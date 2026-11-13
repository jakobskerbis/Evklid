// Senčilnik ravni molekul in atomov (povečava nad ~1 000 000×, docs/mikroskop.md). Pri tej povečavi pravi TEM v
// biološkem vzorcu ne vidi več podrobnosti, zato je slika MODEL: snov v središču vidnega polja in bližnjo membrano
// izmeri sonda na ravni TEM (upodobi.js), ta senčilnik pa nariše njihove molekule (slog ilustracij D. Goodsella:
// ploskve z obrobo) in pri še večji povečavi posamezne atome (krogle v barvah CPK ali sivine).
import { OSNOVE } from "./glsl.js";

export const MOLEKULE = /* glsl */ `#version 300 es
${OSNOVE}
uniform vec2 uRes;
uniform float uPxNm;      // nm na slikovno točko
uniform vec2 uFine;       // središče pogleda po modulu 4000 nm (natančne krajevne koordinate)
uniform float uA;         // snov na strani A (kjer je središče), S_*
uniform float uB;         // snov onkraj membrane
uniform float uMem;       // 1 = membrana v bližini
uniform float uY0;        // razdalja središča od sredine membrane (nm), > 0 na strani A
uniform vec2 uN;          // normala membrane proti strani A
uniform vec2 uSmer;       // smer vlaken (enotski vektor)
uniform float uSmerL;     // 1 = vlakna v ravnini rezine, 0 = prečni prerez
uniform float uFaza;      // lega vzdolž vlakna v središču (nm): sarkomera, mielin
uniform float uBarve;     // 1 = barve, 0 = sivine (TEM)
out vec4 o;

// ---------- atomi ----------
// el: 1 H, 2 C, 3 N, 4 O, 5 P, 6 S, 7 Ca
vec3 barvaEl(float el) {
  if (el < 1.5) return vec3(0.93);
  if (el < 2.5) return vec3(0.52, 0.55, 0.58);
  if (el < 3.5) return vec3(0.19, 0.31, 0.97);
  if (el < 4.5) return vec3(0.95, 0.12, 0.10);
  if (el < 5.5) return vec3(1.0, 0.5, 0.0);
  if (el < 6.5) return vec3(0.95, 0.9, 0.2);
  return vec3(0.24, 0.85, 0.15);
}
float polmerEl(float el) {
  if (el < 1.5) return 0.055;
  if (el < 2.5) return 0.085;
  if (el < 4.5) return 0.08;
  if (el < 6.5) return 0.11;
  return 0.14;
}
float zEl(float el) { return el < 1.5 ? 0.15 : el < 4.5 ? 0.45 : el < 6.5 ? 0.75 : 0.9; }
// best: x = d/r najbližjega atoma, y = element, zw = odmik od njegovega središča (nm)
void atom(inout vec4 best, vec2 x, vec2 c, float el) {
  float r = polmerEl(el);
  float k = length(x - c) / r;
  if (k < best.x) best = vec4(k, el, x - c);
}
vec2 smerOd(float a) { return vec2(cos(a), sin(a)); }

// voda: O in dva H (kot 104,5°, 0,096 nm), mreža 0,31 nm
void voda(inout vec4 b, vec2 x, float delez) {
  vec2 n = floor(x / 0.31);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 k = n + vec2(i, j);
    vec4 h = h42(k + 71.0);
    if (h.w > delez) continue;
    vec2 c = (k + 0.2 + 0.6 * h.xy) * 0.31;
    float a = h.z * 6.2832;
    atom(b, x, c, 4.0);
    atom(b, x, c + 0.096 * smerOd(a), 1.0);
    atom(b, x, c + 0.096 * smerOd(a + 1.824), 1.0);
  }
}
// beljakovina ali druga organska snov: naključni atomi v mreži 0,16 nm (H, C, N, O, S); pP = delež P (RNA)
void organska(inout vec4 b, vec2 x, float pP) {
  vec2 n = floor(x / 0.16);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 k = n + vec2(i, j);
    vec4 h = h42(k + 13.0);
    if (h.w < 0.22) continue;
    vec2 c = (k + 0.15 + 0.7 * h.xy) * 0.16;
    float e = h.z < 0.38 ? 1.0 : h.z < 0.38 + pP ? 5.0 : h.z < 0.74 ? 2.0 : h.z < 0.84 ? 3.0 : h.z < 0.985 ? 4.0 : 6.0;
    atom(b, x, c, e);
  }
}
// verige ogljikovodika (cik-cak 0,127 nm, razmik verig d), os x vzdolž verig
void verige(inout vec4 b, vec2 x, float d, float zamik) {
  float i = floor(x.y / d + 0.5);
  float y0 = i * d;
  float s = 0.127;
  float jx = floor((x.x + zamik * i) / s);
  for (int k = -1; k <= 1; k++) {
    float m = jx + float(k);
    vec2 c = vec2(m * s - zamik * i, y0 + (mod(m, 2.0) < 0.5 ? 0.042 : -0.042));
    atom(b, x, c, 2.0);
    atom(b, x, c + vec2(0.0, mod(m, 2.0) < 0.5 ? 0.1 : -0.1), 1.0);
  }
}
// dvojna vijačnica DNK vzdolž osi x (širina 2 nm, korak 3,4 nm, 10 baznih parov)
void dnk(inout vec4 b, vec2 x) {
  float bp = 0.34;
  float j0 = floor(x.x / bp);
  for (int k = -2; k <= 2; k++) {
    float m = j0 + float(k);
    float xs = m * bp;
    float f1 = 6.2832 * xs / 3.4;
    float f2 = f1 + 2.4;
    float y1 = 0.95 * sin(f1), y2 = 0.95 * sin(f2);
    atom(b, x, vec2(xs, y1), 5.0);
    atom(b, x, vec2(xs + 0.1, y1 + 0.12), 4.0);
    atom(b, x, vec2(xs - 0.1, y1 - 0.1), 4.0);
    atom(b, x, vec2(xs, y2), 5.0);
    atom(b, x, vec2(xs + 0.1, y2 - 0.12), 4.0);
    atom(b, x, vec2(xs - 0.1, y2 + 0.1), 4.0);
    // bazni par: veriga C in N med obema hrbtenicama
    for (int q = 1; q < 6; q++) {
      float t = float(q) / 6.0;
      atom(b, x, vec2(xs + 0.05 * sin(float(q) * 2.1), mix(y1, y2, t)), mod(float(q) + m, 3.0) < 1.0 ? 3.0 : 2.0);
    }
  }
}
// hidroksiapatit (pogled vzdolž osi c): heksagonalna mreža a = 0,942 nm, stolpci Ca, skupine PO4, kanal OH
void apatit(inout vec4 b, vec2 x) {
  float a = 0.942;
  vec2 e1 = vec2(a, 0.0), e2 = vec2(0.5 * a, 0.866 * a);
  mat2 M = inverse(mat2(e1, e2));
  vec2 f = M * x;
  vec2 n = floor(f);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 k = n + vec2(i, j);
    vec2 o0 = k.x * e1 + k.y * e2;
    atom(b, x, o0, 4.0);                                   // OH v kanalu
    atom(b, x, o0 + vec2(0.05, 0.06), 1.0);
    atom(b, x, o0 + (e1 + e2) / 3.0, 7.0);                 // Ca(1)
    atom(b, x, o0 + 2.0 * (e1 + e2) / 3.0, 7.0);
    for (int r = 0; r < 3; r++) {
      float fi = float(r) * 2.0944;
      atom(b, x, o0 + 0.23 * smerOd(fi + 0.4), 7.0);     // Ca(2) okoli kanala
      vec2 pc = o0 + 0.39 * smerOd(fi + 1.45);           // PO4
      atom(b, x, pc, 5.0);
      for (int s = 0; s < 3; s++) atom(b, x, pc + 0.15 * smerOd(fi + float(s) * 2.0944 + 0.7), 4.0);
    }
  }
}
// celuloza: verige glukoze vzdolž x (obroči C5O na 0,515 nm), razmik verig 0,6 nm
void celuloza(inout vec4 b, vec2 x) {
  float i = floor(x.y / 0.6 + 0.5);
  float y0 = i * 0.6;
  float s = 0.515;
  float j0 = floor(x.x / s);
  for (int k = -1; k <= 1; k++) {
    float m = j0 + float(k);
    vec2 c = vec2(m * s + 0.5 * s, y0);
    float zas = mod(m, 2.0) < 0.5 ? 1.0 : -1.0;
    for (int r = 0; r < 6; r++) {
      vec2 pr = c + vec2(0.14 * cos(float(r) * 1.047), 0.12 * sin(float(r) * 1.047) * zas);
      atom(b, x, pr, r == 0 ? 4.0 : 2.0);
    }
    atom(b, x, c + vec2(0.0, 0.26 * zas), 4.0);
    atom(b, x, c + vec2(0.06, 0.33 * zas), 1.0);
    atom(b, x, vec2(m * s, y0 - 0.05 * zas), 4.0);         // glikozidna vez
  }
}
// trojna vijačnica kolagena vzdolž x (premer ~1,5 nm), molekule v razmiku 1,6 nm
void kolagenAt(inout vec4 b, vec2 x) {
  float i = floor(x.y / 1.6 + 0.5);
  vec2 l = vec2(x.x + i * 0.7, x.y - i * 1.6);
  float s = 0.29;
  float j0 = floor(l.x / s);
  for (int k = -2; k <= 2; k++) {
    float m = j0 + float(k);
    for (int v = 0; v < 3; v++) {
      float fi = 6.2832 * (m * s / 0.86) + float(v) * 2.094;
      vec2 c = vec2(m * s, 0.32 * sin(fi));
      float e = mod(m + float(v), 3.0) < 1.0 ? 3.0 : (mod(m, 3.0) < 2.0 ? 2.0 : 4.0);
      atom(b, l, c, e);
      atom(b, l, c + vec2(0.1, 0.1 * cos(fi)), mod(m, 2.0) < 1.0 ? 1.0 : 2.0);
    }
  }
}
// lipid membrane: glava (N, P, O, glicerol) pri |y| ~ 1,7–2,3 nm, dve verigi do sredine
void lipidi(inout vec4 b, vec2 x) {
  float stran = x.y >= 0.0 ? 1.0 : -1.0;
  vec2 l = vec2(x.x + (stran > 0.0 ? 0.0 : 0.4), abs(x.y));
  float s = 0.8;
  float i = floor(l.x / s + 0.5);
  float x0 = i * s;
  vec4 h = h42(vec2(i, stran));
  float yg = 2.05 + 0.15 * (h.x - 0.5);
  atom(b, l, vec2(x0 + 0.05, yg + 0.25), 3.0);
  atom(b, l, vec2(x0 - 0.1, yg + 0.33), 2.0);
  atom(b, l, vec2(x0, yg), 5.0);
  atom(b, l, vec2(x0 + 0.14, yg + 0.05), 4.0);
  atom(b, l, vec2(x0 - 0.14, yg - 0.03), 4.0);
  atom(b, l, vec2(x0 + 0.02, yg + 0.14), 4.0);
  atom(b, l, vec2(x0, yg - 0.17), 4.0);
  atom(b, l, vec2(x0 - 0.05, yg - 0.32), 2.0);
  atom(b, l, vec2(x0 + 0.12, yg - 0.45), 4.0);
  for (int c = 0; c < 2; c++) {
    float xc = x0 + (float(c) - 0.5) * 0.42;
    float dolz = 1.6 - 0.25 * h.y;
    float s2 = 0.127;
    float j = floor((yg - 0.55 - l.y) / s2);
    for (int k = -1; k <= 1; k++) {
      float m = j + float(k);
      float yy = yg - 0.55 - m * s2;
      if (m < 0.0 || yy < yg - 0.55 - dolz) continue;
      vec2 cc = vec2(xc + (mod(m, 2.0) < 0.5 ? 0.04 : -0.04) + 0.05 * sin(m * 0.7 + h.z * 6.0), yy);
      atom(b, l, cc, 2.0);
      atom(b, l, cc + vec2(mod(m, 2.0) < 0.5 ? 0.1 : -0.1, 0.0), 1.0);
    }
  }
}

// ---------- molekule (ilustracija) ----------
// Gneča beljakovin: krogli skupki v mreži g (nm). Vrne razdaljo do najbližjega roba (< 0 znotraj) in seme.
vec2 gneca(vec2 x, float g, float gost, float seme) {
  vec2 n = floor(x / g);
  float d = 1e3, id = 0.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 k = n + vec2(i, j);
    vec4 h = h42(k + seme);
    if (h.z > gost) continue;
    vec2 c = (k + 0.2 + 0.6 * h.xy) * g;
    float R = g * (0.22 + 0.2 * h.w);
    vec2 z = rot(h.w * 6.28) * (x - c);
    float dd = min(length(z) - R, length(z - vec2(R * 0.8, 0.0)) - R * 0.7);
    dd = min(dd, length(z + vec2(0.3 * R, 0.75 * R)) - R * 0.6);
    if (dd < d) { d = dd; id = h.x; }
  }
  return vec2(d, id);
}
vec3 obroba(vec3 c, float d, float px) { return mix(c * 0.55, c, smoothstep(0.0, max(px * 1.5, 0.15), -d)); }

// Barva in gostota snovi s na ravni molekul. x: krajevne koordinate (nm), y: oddaljenost od membrane.
vec4 molekule(float s, vec2 x, float px) {
  vec3 voda = vec3(0.97, 0.95, 0.90);
  if (s == S_PRAZNO) {
    float m = smoothstep(0.7, 0.8, sum(x / 0.8));
    return vec4(mix(vec3(0.93, 0.92, 0.88), vec3(0.75, 0.72, 0.65), m), 0.04 + 0.1 * m);
  }
  if ((s == S_KOLAGEN || s == S_MINERAL) && uSmerL < 0.5) {
    // prečni prerez vlakenca: preseki trojnih vijačnic (1,5 nm) v skoraj heksagonalni razporeditvi
    vec4 k = krogci(x, 1.6, 0.6, 0.72, 0.9, 2.0);
    float mol = pokrij(k.x, px);
    vec3 ozadje = s == S_MINERAL ? vec3(0.78, 0.82, 0.88) : vec3(0.97, 0.95, 0.9);
    return vec4(mix(ozadje, obroba(vec3(0.88, 0.6, 0.5), k.x, px), mol), (s == S_MINERAL ? 0.7 : 0.15) + 0.35 * mol);
  }
  if (s == S_KOLAGEN || s == S_MINERAL) {
    // molekule kolagena (trojne vijačnice 300 × 1,5 nm), zamaknjene za večkratnik D = 67 nm: vrzeli se poravnajo v pasove
    vec2 z = mat2(uSmer.x, -uSmer.y, uSmer.y, uSmer.x) * x;
    float vrsta = floor(z.y / 1.55 + 0.5);
    float zam = floor(h12(vec2(vrsta, 4.0)) * 5.0) * 67.0;
    float f = mod(z.x + zam, 335.0);
    float v = z.y - vrsta * 1.55;
    float sir = 0.6 + 0.1 * sin(6.2832 * z.x / 8.6 + vrsta * 2.0);
    float konec = min(f, 300.0 - f);
    float dm = max(abs(v) - sir, -konec);
    float mol = step(f, 300.0) * pokrij(dm, px);
    vec3 kc = vec3(0.88, 0.6, 0.5) * (0.88 + 0.12 * sin(6.2832 * z.x / 2.9 + v * 4.0));
    vec3 ozadje = s == S_MINERAL ? vec3(0.78, 0.82, 0.88) : voda;
    vec3 c = mix(ozadje, obroba(kc, dm, px), mol);
    float g = (s == S_MINERAL ? 0.7 : 0.12) + 0.4 * mol;
    if (s == S_MINERAL) {
      // ploščice apatita v vrzelih (~50 × 25 × 3 nm)
      float kr = pokrij(sdPravok(vec2(mod(z.x + 15.0, 67.0) - 33.5, mod(z.y + 3.0, 7.0) - 3.5), vec2(20.0, 1.1)), px);
      c = mix(c, obroba(vec3(0.72, 0.78, 0.9), sdPravok(vec2(mod(z.x + 15.0, 67.0) - 33.5, mod(z.y + 3.0, 7.0) - 3.5), vec2(20.0, 1.1)), px), kr * (1.0 - mol));
      g = mix(g, 0.95, kr);
    }
    return vec4(c, g);
  }
  if (s == S_MIOFIBRILA) {
    vec2 z = mat2(uSmer.x, -uSmer.y, uSmer.y, uSmer.x) * x;
    float xa = uFaza + dot(x - uFine, uSmer);
    float f = abs(mod(xa, 2200.0) - 1100.0);
    float yv = mod(z.y, 40.0);
    float debel = step(f, 800.0) * pokrij(abs(yv - 10.0) - 7.5, px);
    float glave = debel * 0.0 + step(f, 790.0) * step(70.0, f) * pokrij(length(vec2(mod(z.x, 14.3) - 7.0, abs(yv - 10.0) - 9.0)) - 2.5, px);
    float tanek = step(100.0, f) * pokrij(abs(yv - 30.0) - 3.5, px);
    float zcrta = pokrij(abs(f - 1100.0) - 30.0, px);
    vec3 c = voda;
    c = mix(c, vec3(0.62, 0.78, 0.95), tanek);
    c = mix(c, vec3(0.88, 0.45, 0.42), max(debel, glave));
    c = mix(c, vec3(0.55, 0.5, 0.75), zcrta);
    return vec4(c, 0.15 + 0.6 * max(max(debel, glave), max(tanek * 0.7, zcrta)));
  }
  if (s == S_JEDRO || s == S_KROMATIN || s == S_JEDRCE) {
    float gost = s == S_KROMATIN ? 0.95 : s == S_JEDRCE ? 0.6 : 0.45;
    float g = 13.0;
    vec2 n = floor(x / g);
    float best = 1e3, dna = 1e3;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 k = n + vec2(i, j);
      vec4 h = h42(k + 5.0);
      vec2 c = (k + 0.25 + 0.5 * h.xy) * g;
      vec4 h2 = h42(k + vec2(1, 0) + 5.0);
      vec2 c2 = (k + vec2(1, 0) + 0.25 + 0.5 * h2.xy) * g;
      vec2 pa = x - c, ba = c2 - c;
      float t = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      dna = min(dna, length(pa - ba * t) - 1.0);
      if (h.z < gost) best = min(best, length(x - c) - 5.3);
    }
    vec3 c = voda;
    if (s == S_JEDRCE) {
      vec2 r = gneca(x, 14.0, 0.8, 3.0);
      c = mix(c, obroba(vec3(0.85, 0.45, 0.75), r.x, px), pokrij(r.x, px));
    }
    c = mix(c, vec3(0.95, 0.7, 0.25), pokrij(dna, px));
    float nuk = pokrij(best, px);
    vec3 cn = obroba(vec3(0.45, 0.55, 0.85), best, px);
    cn = mix(cn, vec3(0.95, 0.7, 0.25), pokrij(abs(best + 0.6) - 0.6, px));
    c = mix(c, cn, nuk);
    return vec4(c, 0.2 + 0.55 * max(nuk, pokrij(dna, px)));
  }
  if (s == S_LIPID) {
    float m = smoothstep(0.35, 0.65, sum(x / 1.2));
    return vec4(mix(vec3(0.98, 0.92, 0.6), vec3(0.93, 0.82, 0.45), m), 0.36);
  }
  if (s == S_STENA) {
    vec2 z = mat2(uSmer.x, -uSmer.y, uSmer.y, uSmer.x) * x;
    float v = abs(mod(z.y, 6.0) - 3.0);
    float mf = pokrij(v - 1.75, px);
    float hem = pokrij(abs(mod(z.x * 0.6 + z.y * 0.8, 9.0) - 4.5) - 0.4, px) * (1.0 - mf);
    vec3 c = mix(voda, obroba(vec3(0.55, 0.78, 0.45), v - 1.75, px), mf);
    c = mix(c, vec3(0.75, 0.85, 0.55), hem * 0.6);
    return vec4(c, 0.2 + 0.25 * mf);
  }
  if (s == S_MATRIKS || s == S_SLUZ || s == S_ELASTIN) {
    vec2 r = gneca(x, 16.0, 0.35, 9.0);
    float hrb = pokrij(abs(sum(x / 30.0) - 0.5) * 30.0 - 0.6, px);
    float ret = pokrij(abs(mod(x.x + 7.0 * sum(x / 25.0), 3.0) - 1.5) - 0.25, px) * smoothstep(1.5, 0.5, abs(sum(x / 30.0) - 0.5) * 30.0);
    vec3 c = voda;
    vec3 barva = s == S_MATRIKS ? vec3(0.55, 0.72, 0.9) : s == S_SLUZ ? vec3(0.7, 0.85, 0.9) : vec3(0.95, 0.8, 0.55);
    c = mix(c, barva, max(hrb, ret * 0.8));
    c = mix(c, obroba(vec3(0.7, 0.6, 0.85), r.x, px), pokrij(r.x, px));
    return vec4(c, 0.12 + 0.3 * max(hrb, pokrij(r.x, px)));
  }
  if (s == S_KERATIN) {
    vec2 z = mat2(uSmer.x, -uSmer.y, uSmer.y, uSmer.x) * x;
    float v = abs(mod(z.y + 4.0 * sum(z / 40.0), 13.0) - 6.5);
    float f = pokrij(v - 5.0, px) * (0.85 + 0.15 * sin(z.x * 0.6));
    return vec4(mix(voda, obroba(vec3(0.9, 0.75, 0.55), v - 5.0, px), f), 0.2 + 0.5 * f);
  }
  if (s == S_RIBOSOM) {
    vec2 r = gneca(x, 9.0, 0.95, 21.0);
    return vec4(mix(vec3(0.9, 0.6, 0.85), obroba(vec3(0.78, 0.35, 0.7), r.x, px), pokrij(r.x, px)), 0.85);
  }
  if (s == S_GLIKOGEN) {
    vec2 r = gneca(x, 5.0, 0.9, 27.0);
    return vec4(mix(voda, obroba(vec3(0.98, 0.85, 0.4), r.x, px), pokrij(r.x, px)), 0.8);
  }
  // raztopine beljakovin (citoplazma, matriks mitohondrija, lumen ER, plazma, koloid, vakuola, eritrocit …)
  float gost = 0.6, g = 9.0;
  vec3 b1 = vec3(0.55, 0.62, 0.9), b2 = vec3(0.68, 0.55, 0.88);
  if (s == S_ERITROCIT) { gost = 0.95; g = 7.0; b1 = vec3(0.9, 0.3, 0.3); b2 = vec3(0.85, 0.25, 0.35); }
  else if (s == S_MITO) { gost = 0.85; b1 = vec3(0.6, 0.8, 0.55); b2 = vec3(0.45, 0.7, 0.75); }
  else if (s == S_PLAZMA) { gost = 0.25; b1 = vec3(0.95, 0.8, 0.45); b2 = vec3(0.9, 0.65, 0.4); }
  else if (s == S_VAKUOLA) { gost = 0.05; }
  else if (s == S_KOLOID) { gost = 0.8; g = 12.0; b1 = vec3(0.6, 0.85, 0.6); b2 = vec3(0.5, 0.75, 0.55); }
  else if (s == S_ER || s == S_GOLGI) { gost = 0.45; b1 = vec3(0.95, 0.75, 0.5); }
  else if (s == S_GRANULA) { gost = 0.95; g = 7.0; b1 = vec3(0.9, 0.55, 0.4); }
  else if (s == S_KLOROPLAST) { gost = 0.85; g = 11.0; b1 = vec3(0.4, 0.75, 0.35); b2 = vec3(0.55, 0.8, 0.4); }
  else if (s == S_VIRUS) { gost = 0.95; b1 = vec3(0.85, 0.55, 0.65); }
  vec2 r = gneca(x, g, gost, 1.0);
  vec3 c = mix(voda, obroba(mix(b1, b2, step(0.5, r.y)), r.x, px), pokrij(r.x, px));
  return vec4(c, 0.12 + 0.55 * pokrij(r.x, px) * (s == S_ERITROCIT ? 1.3 : 1.0));
}

// Membrana na ravni molekul: dvosloj (glave na ±2 nm, repi), občasna transmembranska beljakovina.
vec4 membranaMol(vec2 x, float y, float px) {
  vec2 t = vec2(-uN.y, uN.x);
  float u = dot(x, t);
  vec4 hb = h42(vec2(floor(u / 24.0), 3.0));
  float bel = (hb.x < 0.45) ? pokrij(length(vec2((fract(u / 24.0) - 0.5) * 24.0 / 1.4, y / 3.6)) - 1.0, px * 0.3) : 0.0;
  float glava = pokrij(length(vec2((fract(u / 0.8 + (y > 0.0 ? 0.0 : 0.5)) - 0.5) * 0.8, abs(y) - 2.0)) - 0.42, px);
  float rep = step(abs(y), 1.65) * (0.6 + 0.4 * pokrij(abs((fract(u / 0.4) - 0.5) * 0.4) - 0.09, px));
  vec3 c = vec3(0.97, 0.95, 0.9);
  c = mix(c, vec3(0.98, 0.9, 0.62), rep);
  c = mix(c, vec3(0.62, 0.8, 0.35), glava);
  c = mix(c, vec3(0.95, 0.65, 0.35), bel);
  return vec4(c, max(0.75 * glava, max(0.3 * rep, 0.55 * bel)) + 0.08);
}

// Atomi snovi s (x v nm).
vec4 atomiSnov(float s, vec2 x, float y) {
  vec4 b = vec4(1e3, 0.0, 0.0, 0.0);
  if (uMem > 0.5 && abs(y) < 2.8) {
    vec2 t = vec2(-uN.y, uN.x);
    lipidi(b, vec2(dot(x, t), y));
    return b;
  }
  if (s == S_MINERAL || s == S_SKLENINA) apatit(b, x);
  else if (s == S_KOLAGEN) { vec2 z = mat2(uSmer.x, -uSmer.y, uSmer.y, uSmer.x) * x; kolagenAt(b, z); voda(b, x, 0.35); }
  else if (s == S_STENA) { vec2 z = mat2(uSmer.x, -uSmer.y, uSmer.y, uSmer.x) * x; celuloza(b, z); }
  else if (s == S_LIPID) { vec2 z = rot(0.4 * sum(x / 3.0)) * x; verige(b, z, 0.45, 0.06); }
  else if (s == S_JEDRO || s == S_KROMATIN || s == S_JEDRCE) {
    vec2 n = floor(x / 6.0);
    float a = h12(n + 2.0) * 3.14;
    vec2 z = rot(a) * (x - (n + 0.5) * 6.0);
    if (abs(z.y) < 1.3) dnk(b, z); else { organska(b, x, 0.0); voda(b, x, 0.7); }
  } else if (s == S_PRAZNO) { organska(b, x * 1.4, 0.0); if (b.x > 1.0) b = vec4(1e3, 0, 0, 0); }
  else if (s == S_VAKUOLA || s == S_PLAZMA) voda(b, x, 0.95);
  else if (s == S_RIBOSOM) organska(b, x, 0.12);
  else {
    // beljakovina, kjer je na ravni molekul skupek, drugje voda
    float g = s == S_ERITROCIT ? 7.0 : 9.0;
    vec2 r = gneca(x, g, s == S_ERITROCIT ? 0.95 : 0.6, 1.0);
    if (r.x < 0.0) organska(b, x, 0.0); else voda(b, x, 1.0);
  }
  return b;
}

void main() {
  vec2 off = (gl_FragCoord.xy - 0.5 * uRes) * uPxNm;
  vec2 x = uFine + off;                     // natančno (do 4000 nm)
  float y = uY0 + dot(off, uN);             // oddaljenost od membrane
  float s = uMem > 0.5 && y < -4.0 ? uB : uA;
  float px = uPxNm;
  // raven molekul
  vec4 m = (uMem > 0.5 && abs(y) < 4.0) ? membranaMol(x, y, px) : molekule(s, x, px);
  if (uMem > 0.5 && abs(y) < 4.6 && abs(y) >= 4.0) m = mix(m, membranaMol(x, y, px), 0.0);
  vec3 c = uBarve > 0.5 ? m.rgb : vec3(exp(-2.0 * m.a));
  // raven atomov: postopen prehod od 0,08 do 0,03 nm na točko
  float at = smoothstep(0.08, 0.03, px);
  if (at > 0.0) {
    vec4 b = atomiSnov(s, x, y);
    vec3 ozadje = uBarve > 0.5 ? vec3(0.05, 0.07, 0.12) : vec3(0.93);
    vec3 ca = ozadje;
    if (b.x < 1.0) {
      float z = sqrt(max(0.0, 1.0 - b.x * b.x));
      vec3 n = normalize(vec3(b.zw / polmerEl(b.y), z));
      float l = max(0.0, dot(n, normalize(vec3(-0.4, 0.5, 0.8))));
      vec3 bc = barvaEl(b.y);
      vec3 sfera = bc * (0.35 + 0.65 * l) + pow(max(0.0, dot(reflect(-normalize(vec3(-0.4, 0.5, 0.8)), n), vec3(0, 0, 1))), 24.0) * 0.5;
      float sv = 1.0 - smoothstep(0.92, 1.0, b.x);
      vec3 siva = vec3(1.0 - zEl(b.y) * (0.6 + 0.4 * z));
      ca = mix(ozadje, uBarve > 0.5 ? sfera : siva, sv);
    }
    c = mix(c, ca, at);
  }
  o = vec4(c, 1.0);
}`;
