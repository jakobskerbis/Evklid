// Senčilnik ravni molekul in atomov (povečava nad ~1 000 000×, docs/mikroskop.md). Pri tej povečavi pravi TEM v
// biološkem vzorcu ne vidi več podrobnosti, zato je slika MODEL: snov v središču vidnega polja in bližnjo membrano
// izmeri sonda na ravni TEM (upodobi.js), molekule-vrste.js izbere prave molekule te snovi v tem preparatu (prizor),
// ta senčilnik pa jih nariše v prepoznavni obliki (slog ilustracij D. Goodsella: ploskve z obrobo) in pri še večji
// povečavi posamezne atome (krogle v barvah CPK ali sivine). Prehod uIdPass zapiše, katera molekula je kje (oznake).
import { OSNOVE } from "./glsl.js";

export const MOLEKULE = /* glsl */ `#version 300 es
${OSNOVE}
uniform vec2 uRes;
uniform float uPxNm;      // nm na slikovno točko
uniform vec2 uFine;       // središče pogleda po modulu 4000 nm (natančne krajevne koordinate)
uniform float uMem;       // 1 = membrana v bližini
uniform float uY0;        // razdalja središča od sredine membrane (nm), > 0 na strani A
uniform vec2 uN;          // normala membrane proti strani A
uniform vec2 uSmer;       // smer vlaken (enotski vektor)
uniform float uSmerL;     // 1 = vlakna v ravnini rezine, 0 = prečni prerez
uniform float uFaza;      // lega vzdolž vlakna v središču (nm): sarkomera, mielin
uniform float uBarve;     // 1 = barve, 0 = sivine (TEM)
uniform float uPA;        // prizor na strani A (P_*, molekule-vrste.js)
uniform float uPB;        // prizor na strani B
uniform float uMemVrsta;  // 0 lipidni dvosloj, 1 glava T4, 2 ovojnica z bodicami, 3 stena p24, 4 le rob
uniform float uZun;       // +1: zunanjost virusa je na strani A, -1: na strani B
uniform float uBodice;    // razmik bodic na ovojnici (nm)
uniform vec3 uBarvaMol[16];
uniform float uGostMol[16]; // gostota za TEM; < 0: reža je prazna
uniform float uAtMol[16];   // vrsta atomov (A_*)
uniform int uIdPass;      // 1: namesto barve zapiši režo molekule (za oznake)
out vec4 o;

// ---------- atomi ----------
// el: 1 H, 2 C, 3 N, 4 O, 5 P, 6 S, 7 Ca, 8 Fe, 9 Na, 10 K, 11 Cl, 12 Zn (barve CPK, kot ELEMENTI v molekule-vrste.js)
vec3 barvaEl(float el) {
  if (el < 1.5) return vec3(0.93);
  if (el < 2.5) return vec3(0.52, 0.55, 0.58);
  if (el < 3.5) return vec3(0.19, 0.31, 0.97);
  if (el < 4.5) return vec3(0.95, 0.12, 0.10);
  if (el < 5.5) return vec3(1.0, 0.5, 0.0);
  if (el < 6.5) return vec3(0.95, 0.9, 0.2);
  if (el < 7.5) return vec3(0.24, 0.85, 0.15);
  if (el < 8.5) return vec3(0.88, 0.4, 0.2);
  if (el < 9.5) return vec3(0.67, 0.36, 0.95);
  if (el < 10.5) return vec3(0.56, 0.25, 0.83);
  if (el < 11.5) return vec3(0.12, 0.94, 0.12);
  return vec3(0.49, 0.5, 0.69);
}
float polmerEl(float el) {
  if (el < 1.5) return 0.055;
  if (el < 2.5) return 0.085;
  if (el < 4.5) return 0.08;
  if (el < 6.5) return 0.11;
  if (el < 7.5) return 0.14;
  if (el < 8.5) return 0.12;
  if (el < 11.5) return 0.16;
  return 0.12;
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

// ---------- molekule (ilustracija): prizori s pravimi molekulami (molekule-vrste.js) ----------
// Reže: 0–5 strani A, 6–11 strani B, 12–15 membrana. Barvo, gostoto (TEM) in vrsto atomov vsake reže da JS, ki pozna
// imena; vrstni red rež v vsakem prizoru je zapisan ob prizoru in se mora ujemati s PRIZORI v molekule-vrste.js.
struct M { vec3 c; float g; float id; vec2 z; };

vec3 obroba(vec3 c, float d, float px) { return mix(c * 0.55, c, smoothstep(0.0, max(px * 1.5, 0.15), -d)); }

void slikaj(inout M m, float k, float d, vec2 z, float px) {
  int i = int(k);
  if (k < 0.0 || uGostMol[i] < 0.0) return;
  float a = pokrij(d, px);
  if (a <= 0.001) return;
  m.c = mix(m.c, obroba(uBarvaMol[i], d, px), a);
  m.g = mix(m.g, uGostMol[i], a);
  if (d < 0.0) { m.id = k; m.z = z; }
}
M zacni(float k) { int i = int(k); return M(uBarvaMol[i], max(uGostMol[i], 0.0), k, vec2(0.0)); }

float sdKepa(vec2 z, float R, float h) {
  float d = length(z) - R;
  d = min(d, length(z - vec2(0.75 * R, 0.15 * R)) - 0.62 * R);
  d = min(d, length(z + vec2(0.3 * R, 0.72 * R)) - 0.58 * R);
  return d + 0.07 * R * sin(atan(z.y, z.x) * 5.0 + h * 6.28);
}
float sdOdsek(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0)); }

#define O_KEPA 0
#define O_HB 1
#define O_Y 2
#define O_SRCE 3
#define O_RIBOSOM 5
#define O_KVADER 6
#define O_HEKSAMER 7
#define O_ROZETA 8
#define O_DIMER 9
#define O_TOCKA 10

// Oblika molekule o v lokalnih koordinatah z (nm), velikost R. x: rob molekule, y: rob podrobnosti (hem, cink),
// zw: središče podrobnosti (za atome).
vec4 oblika(int o, vec2 z, float R, float h) {
  float d = 1e3, det = 1e3;
  vec2 dc = vec2(0.0);
  if (o == O_HB) {
    // hemoglobin: štiri podenote (2 α, 2 β), v žepu vsake hem z železom (Perutz 1960; PDB 2HHB)
    for (int i = 0; i < 4; i++) {
      vec2 c = vec2(i == 0 || i == 3 ? -0.42 : 0.42, i < 2 ? -0.4 : 0.4) * R;
      d = min(d, length(z - c) - 0.58 * R);
      float dh = length(z - c * 1.32) - 0.17 * R;
      if (dh < det) { det = dh; dc = c * 1.32; }
    }
  } else if (o == O_Y) {
    // protitelo IgG: dva kraka Fab in pecelj Fc (oblika Y, ~15 nm)
    d = sdOdsek(z, vec2(0.0), vec2(0.0, -0.85 * R)) - 0.2 * R;
    d = min(d, sdOdsek(z, vec2(0.0), vec2(-0.78, 0.72) * R) - 0.18 * R);
    d = min(d, sdOdsek(z, vec2(0.0), vec2(0.78, 0.72) * R) - 0.18 * R);
    d = min(d, length(z - vec2(-0.82, 0.78) * R) - 0.24 * R);
    d = min(d, length(z - vec2(0.82, 0.78) * R) - 0.24 * R);
  } else if (o == O_SRCE) {
    // albumin: srčasta oblika iz treh domen (PDB 1AO6)
    d = min(length(z - vec2(-0.38, 0.22) * R) - 0.46 * R, length(z - vec2(0.38, 0.22) * R) - 0.46 * R);
    d = min(d, length(z - vec2(0.0, -0.38) * R) - 0.42 * R);
  } else if (o == O_RIBOSOM) {
    // ribosom: velika in mala podenota
    d = min(sdKepa(z - vec2(0.0, 0.18 * R), 0.6 * R, h), sdElipsa(z - vec2(0.05 * R, -0.55 * R), vec2(0.55, 0.3) * R));
  } else if (o == O_KVADER) {
    // rubisko: kocka iz 8 velikih in 8 malih podenot (pogled od zgoraj)
    d = sdPravok(z, vec2(0.6 * R)) - 0.3 * R + 0.06 * R * cos(4.0 * atan(z.y, z.x));
    det = length(z) - 0.16 * R;
  } else if (o == O_HEKSAMER) {
    // heksamer (inzulin s cinkom, kapsomera): obroč šestih podenot, v sredini ion
    for (int i = 0; i < 6; i++) d = min(d, length(z - 0.6 * R * vec2(cos(float(i) * 1.0472), sin(float(i) * 1.0472))) - 0.36 * R);
    det = length(z) - 0.13 * R;
  } else if (o == O_ROZETA) {
    // glikogen: razvejana kroglica (delec β, ~25 nm)
    float r = length(z) / R;
    d = (r - 0.82 - 0.18 * sin(atan(z.y, z.x) * 9.0 + h * 6.0) * sin(r * 9.0)) * R;
  } else if (o == O_DIMER) {
    d = min(sdKepa(z - vec2(0.48 * R, 0.0), 0.52 * R, h), sdKepa(rot(3.14) * (z + vec2(0.48 * R, 0.0)), 0.52 * R, h + 0.3));
  } else if (o == O_TOCKA) {
    d = length(z) - R;
  } else {
    d = sdKepa(z, R, h);
  }
  return vec4(d, det, dc);
}

// Raztopina: v mreži g (nm) do štiri vrste molekul (reže k, < 0 = ni) s kumulativnimi deleži c, oblikami o in
// velikostmi R; podrobnost (hem, cink) v režo kd.
void raztopina(inout M m, vec2 x, float px, float g, vec4 k, vec4 c, ivec4 o, vec4 R, vec4 kd, float seme) {
  vec2 n = floor(x / g);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 cel = n + vec2(i, j);
    vec4 h = h42(cel + seme);
    int v = h.z < c.x ? 0 : h.z < c.y ? 1 : h.z < c.z ? 2 : h.z < c.w ? 3 : -1;
    if (v < 0) continue;
    vec2 cc = (cel + 0.25 + 0.5 * h.xy) * g;
    vec2 z = rot(h.w * 6.2832) * (x - cc);
    vec4 d = oblika(o[v], z, R[v], h.x);
    slikaj(m, k[v], d.x, z, px);
    if (kd[v] >= 0.0) slikaj(m, kd[v], d.y, z - d.zw, px);
  }
}
void ioni(inout M m, vec2 x, float px, float k, float delez) {
  raztopina(m, x, px, 1.4, vec4(k, -1.0, -1.0, -1.0), vec4(delez, 0.0, 0.0, 0.0), ivec4(O_TOCKA, 0, 0, 0), vec4(0.17, 0.0, 0.0, 0.0), vec4(-1.0), 3.0);
}

#define V_AKTIN 0
#define V_MT 1
#define V_IF 2
#define V_DNK 3
#define V_RNK 4
#define V_KRTACA 6
#define V_TANKO 7
#define V_BISERI 8
#define V_FIB 9
#define V_FIBRILA 10
// Prerez vlakna v lokalnih koordinatah q (q.x vzdolž vlakna, nm): razdalja od roba
float prerez(int v, vec2 q) {
  if (v == V_AKTIN) {
    // dve verigi kroglic G-aktina (5,5 nm), ki se ovijata (polovica koraka 36 nm)
    float y1 = 1.9 * cos(3.14159 * q.x / 36.0);
    float a = length(vec2(mod(q.x, 5.5) - 2.75, q.y - y1)) - 2.4;
    float b = length(vec2(mod(q.x + 2.75, 5.5) - 2.75, q.y + y1)) - 2.4;
    return min(a, b);
  }
  if (v == V_MT) {
    // mikrotubul (25 nm): protofilamenti iz dimerov tubulina (8 nm)
    float d = abs(q.y) - 12.5;
    d = max(d, -(abs(fract(q.y / 3.6) - 0.5) * 3.6 - 0.25));
    return max(d, -(abs(fract(q.x / 4.0) - 0.5) * 4.0 - 0.15));
  }
  if (v == V_IF) return max(abs(q.y) - 5.0, -(abs(fract((q.x + q.y * 0.8) / 3.0) - 0.5) * 3.0 - 0.3));   // vmesni filament (10 nm)
  if (v == V_DNK) {
    // dvojna vijačnica: dve hrbtenici (sladkor-fosfat), med njima bazni pari; kjer se hrbtenici približata, je žleb
    float f = 6.2832 * q.x / 3.4;
    float y1 = 0.72 * sin(f), y2 = 0.72 * sin(f + 2.2);
    float hrb = min(abs(q.y - y1), abs(q.y - y2)) - 0.3;
    return min(hrb, abs(q.y - 0.5 * (y1 + y2)) - 0.5 * abs(y1 - y2));
  }
  if (v == V_RNK) return abs(q.y - 1.2 * sin(q.x * 0.45 + 2.0 * sin(q.x * 0.13))) - 0.45;
  if (v == V_KRTACA) {
    // krtača: beljakovinska os z gosto nanizanimi verigami sladkorjev (agrekan, mucin)
    float os = abs(q.y) - 0.7;
    float ver = max(abs(fract(q.x / 2.2) - 0.5) * 2.2 - 0.35, abs(q.y + 0.6 * sin(q.x)) - 9.0);
    return min(os, ver);
  }
  if (v == V_TANKO) return abs(q.y - 0.8 * sin(q.x / 2.5)) - 0.4;
  if (v == V_BISERI) return min(abs(q.y) - 0.6, length(vec2((fract(q.x / 9.0) - 0.5) * 9.0, q.y)) - 2.0);
  if (v == V_FIB) {
    // fibrinogen: palica 45 nm z vozlički D na koncih in E v sredini
    float d = max(abs(q.y) - 0.6, abs(q.x) - 22.5);
    d = min(d, length(q - vec2(22.5, 0.0)) - 2.6);
    d = min(d, length(q + vec2(22.5, 0.0)) - 2.6);
    return min(d, length(q) - 2.2);
  }
  // kolagensko vlakence (~20 nm) s pasovi D = 67 nm
  return max(abs(q.y) - 10.0, -(abs(fract(q.x / 67.0) - 0.5) * 67.0 - 1.5));
}
// Vlakna: odseki dolžine 1,6 g v mreži g (delež pr), smer sm z raztrosom raz (rad; > 3 = poljubna)
void vlakna(inout M m, vec2 x, float px, float g, float pr, vec2 sm, float raz, int v, float k, float seme) {
  if (k < 0.0 || uGostMol[int(k)] < 0.0) return;
  vec2 n = floor(x / g);
  float a0 = atan(sm.y, sm.x);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 cel = n + vec2(i, j);
    vec4 h = h42(cel + seme);
    if (h.z > pr) continue;
    vec2 cc = (cel + 0.3 + 0.4 * h.xy) * g;
    vec2 q = rot(-(a0 + (h.w - 0.5) * 2.0 * raz)) * (x - cc);
    float d = max(prerez(v, vec2(q.x + h.y * 37.0, q.y)), abs(q.x) - 0.8 * g);
    slikaj(m, k, d, vec2(q.x + h.y * 37.0, q.y), px);
  }
}

#define P_VODA 1
#define P_KRI 2
#define P_PLAZMA 3
#define P_CITO 4
#define P_BAKTERIJA 5
#define P_JEDRO 6
#define P_KROMATIN 7
#define P_JEDRCE 8
#define P_KOLAGEN 9
#define P_KOST 10
#define P_SKLENINA 11
#define P_MIOFIBRILA 12
#define P_LIPID 13
#define P_STENA_R 14
#define P_STENA_B 15
#define P_STENA_K 16
#define P_MATRIKS 17
#define P_SLUZ 18
#define P_ELASTIN 19
#define P_KERATIN 20
#define P_RIBOSOM 21
#define P_GLIKOGEN 22
#define P_MITO 23
#define P_KLOROPLAST 24
#define P_KOLOID 25
#define P_GRANULA 26
#define P_ER 27
#define P_MIELIN 28
#define P_SMOLA 29
#define P_T4_DNK 30
#define P_T4_REP 31
#define P_T4_VLAKNO 32
#define P_SARS_RNP 33
#define P_HIV_JEDRO 34
#define P_HIV_MATRIKS 35
#define P_VIRUS 36
#define P_MIKROVIL 37

// Prizor P na eni strani membrane; b = prva reža strani, y = oddaljenost od membrane v to stran (nm).
M prizor(int P, float b, vec2 x, float y, float px) {
  M m = zacni(b);
  mat2 R = mat2(uSmer.x, -uSmer.y, uSmer.y, uSmer.x);   // z = R x: os x vzdolž vlaken
  vec2 sp = vec2(-uN.y, uN.x);                           // smer vzdolž membrane
  if (P == P_VODA) {
    // voda, ioni
    ioni(m, x, px, b + 1.0, 0.12);
  } else if (P == P_KRI) {
    // voda, hemoglobin, hem, karboanhidraza (hemoglobin je ~1/3 mase eritrocita: gneča)
    raztopina(m, x, px, 6.6, vec4(b + 1.0, b + 3.0, -1.0, -1.0), vec4(0.93, 0.95, 0.0, 0.0), ivec4(O_HB, O_KEPA, 0, 0), vec4(2.7, 2.5, 0.0, 0.0), vec4(b + 2.0, -1.0, -1.0, -1.0), 1.0);
  } else if (P == P_PLAZMA) {
    // voda, albumin, protitelo IgG, fibrinogen, ioni
    ioni(m, x, px, b + 4.0, 0.1);
    vlakna(m, x, px, 32.0, 0.12, vec2(1.0, 0.0), 4.0, V_FIB, b + 3.0, 41.0);
    raztopina(m, x, px, 9.0, vec4(b + 1.0, b + 2.0, -1.0, -1.0), vec4(0.3, 0.36, 0.0, 0.0), ivec4(O_SRCE, O_Y, 0, 0), vec4(3.8, 6.5, 0.0, 0.0), vec4(-1.0), 5.0);
  } else if (P == P_CITO || P == P_MIKROVIL) {
    // voda, ribosom, aktin, mikrotubul, encimi (ali mioglobin), vmesni filament (nevrofilament, keratin) ali nič
    raztopina(m, x, px, 7.5, vec4(b + 4.0, -1.0, -1.0, -1.0), vec4(0.5, 0.0, 0.0, 0.0), ivec4(O_KEPA, 0, 0, 0), vec4(2.6, 0.0, 0.0, 0.0), vec4(-1.0), 7.0);
    if (P == P_MIKROVIL) vlakna(m, x, px, 11.0, 0.95, uSmer, 0.04, V_AKTIN, b + 2.0, 9.0);
    else {
      vlakna(m, x, px, 45.0, 0.45, vec2(1.0, 0.0), 4.0, V_AKTIN, b + 2.0, 9.0);
      vlakna(m, x, px, 40.0, 0.4, vec2(1.0, 0.0), 4.0, V_IF, b + 5.0, 13.0);
      vlakna(m, x, px, 130.0, 0.3, vec2(1.0, 0.0), 4.0, V_MT, b + 3.0, 11.0);
    }
    raztopina(m, x, px, 40.0, vec4(b + 1.0, -1.0, -1.0, -1.0), vec4(0.3, 0.0, 0.0, 0.0), ivec4(O_RIBOSOM, 0, 0, 0), vec4(12.0, 0.0, 0.0, 0.0), vec4(-1.0), 15.0);
  } else if (P == P_BAKTERIJA) {
    // voda, ribosom, encimi, DNK (nukleoid); bakterija nima mikrotubulov
    raztopina(m, x, px, 6.5, vec4(b + 2.0, -1.0, -1.0, -1.0), vec4(0.6, 0.0, 0.0, 0.0), ivec4(O_KEPA, 0, 0, 0), vec4(2.4, 0.0, 0.0, 0.0), vec4(-1.0), 7.0);
    vlakna(m, x, px, 28.0, 0.5, vec2(1.0, 0.0), 4.0, V_DNK, b + 3.0, 17.0);
    raztopina(m, x, px, 26.0, vec4(b + 1.0, -1.0, -1.0, -1.0), vec4(0.55, 0.0, 0.0, 0.0), ivec4(O_RIBOSOM, 0, 0, 0), vec4(10.0, 0.0, 0.0, 0.0), vec4(-1.0), 15.0);
  } else if (P == P_JEDRO || P == P_KROMATIN) {
    // voda, nukleosom (histoni), DNK, RNK-polimeraza II; kromatin je gostejši
    float gost = P == P_KROMATIN ? 0.95 : 0.5;
    raztopina(m, x, px, 40.0, vec4(b + 3.0, -1.0, -1.0, -1.0), vec4(P == P_KROMATIN ? 0.04 : 0.3, 0.0, 0.0, 0.0), ivec4(O_KEPA, 0, 0, 0), vec4(6.5, 0.0, 0.0, 0.0), vec4(-1.0), 19.0);
    float g = 13.0;
    vec2 n = floor(x / g);
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 k = n + vec2(i, j);
      vec4 h = h42(k + 5.0);
      if (h.z > gost) continue;
      vec2 c = (k + 0.25 + 0.5 * h.xy) * g;
      vec4 h2 = h42(k + vec2(1, 0) + 5.0);
      vec2 c2 = (k + vec2(1, 0) + 0.25 + 0.5 * h2.xy) * g;
      vec2 ba = normalize(c2 - c);
      vec2 q = vec2(dot(x - c, ba), dot(x - c, vec2(-ba.y, ba.x)));
      if (h2.z <= gost) slikaj(m, b + 2.0, max(prerez(V_DNK, q), max(-q.x, q.x - length(c2 - c))), q, px);   // povezovalna DNK
      vec2 z = x - c;
      float r = length(z);
      slikaj(m, b + 1.0, r - 4.3, z, px);                                                    // oktamer histonov
      float fi = atan(z.y, z.x);
      slikaj(m, b + 2.0, max(abs(r - 4.9) - 1.0, -(abs(fract(fi * 4.9 / 3.4) - 0.5) * 3.4 - 0.12)), vec2(fi * 4.9, r - 4.9), px); // 1,65 ovoja DNK
    }
  } else if (P == P_JEDRCE) {
    // voda, rRNK, nastajajoči ribosomi, fibrilarin
    vlakna(m, x, px, 12.0, 0.8, vec2(1.0, 0.0), 4.0, V_RNK, b + 1.0, 21.0);
    raztopina(m, x, px, 9.0, vec4(b + 3.0, -1.0, -1.0, -1.0), vec4(0.3, 0.0, 0.0, 0.0), ivec4(O_KEPA, 0, 0, 0), vec4(2.4, 0.0, 0.0, 0.0), vec4(-1.0), 23.0);
    raztopina(m, x, px, 30.0, vec4(b + 2.0, -1.0, -1.0, -1.0), vec4(0.45, 0.0, 0.0, 0.0), ivec4(O_RIBOSOM, 0, 0, 0), vec4(10.0, 0.0, 0.0, 0.0), vec4(-1.0), 25.0);
  } else if (P == P_KOLAGEN || P == P_KOST) {
    // KOLAGEN: voda, kolagen I, dekorin. KOST: hidroksiapatit, kolagen I, voda
    float kk = b + 1.0;
    if (P == P_KOST) m = zacni(b);
    if (uSmerL < 0.5) {
      // prečni prerez vlakenca: preseki trojnih vijačnic (1,5 nm) v skoraj heksagonalni razporeditvi
      vec4 kr = krogci(x, 1.6, 0.6, 0.72, 0.9, 2.0);
      slikaj(m, kk, kr.x, x - kr.yz, px);
    } else {
      // trojne vijačnice 300 × 1,5 nm, zamaknjene za večkratnik D = 67 nm: vrzeli se poravnajo v pasove
      vec2 z = R * x;
      float vrsta = floor(z.y / 1.55 + 0.5);
      float zam = floor(h12(vec2(vrsta, 4.0)) * 5.0) * 67.0;
      float f = mod(z.x + zam, 335.0);
      float v = z.y - vrsta * 1.55;
      float sir = 0.6 + 0.1 * sin(6.2832 * z.x / 8.6 + vrsta * 2.0);
      float dm = f > 300.0 ? 1e3 : max(abs(v) - sir, -min(f, 300.0 - f));
      if (P == P_KOST) {
        // ploščice apatita v vrzelih (~50 × 25 × 3 nm)
        vec2 pq = vec2(mod(z.x + 15.0, 67.0) - 33.5, mod(z.y + 3.0, 7.0) - 3.5);
        slikaj(m, b, sdPravok(pq, vec2(20.0, 1.1)), pq, px);
      } else {
        raztopina(m, x, px, 14.0, vec4(b + 2.0, -1.0, -1.0, -1.0), vec4(0.15, 0.0, 0.0, 0.0), ivec4(O_KEPA, 0, 0, 0), vec4(2.4, 0.0, 0.0, 0.0), vec4(-1.0), 27.0);
      }
      slikaj(m, kk, dm, vec2(f, v), px);
    }
  } else if (P == P_SKLENINA) {
    // hidroksiapatit (dolgi šestrobi kristali, ~25 × 60 nm prereza), voda in ostanki beljakovin med njimi
    m = zacni(b + 1.0);
    vec2 z = R * x;
    float i = floor(z.y / 27.0 + 0.5);
    float v = z.y - 27.0 * i;
    float f = (z.x + h12(vec2(i, 3.0)) * 500.0) / 160.0;
    slikaj(m, b, max(abs(v) - 12.5 + 0.2 * abs(fract(f) - 0.5), abs(fract(f) - 0.5) * 160.0 - 78.0), z, px);
  } else if (P == P_MIOFIBRILA) {
    // voda, miozin, aktin, α-aktinin (linija Z), titin, tropomiozin (na aktinu)
    vec2 z = R * x;
    float xa = uFaza + dot(x - uFine, uSmer);
    float f = abs(mod(xa, 2200.0) - 1100.0);           // 0 = linija M, 1100 = linija Z
    float yv = mod(z.y, 40.0);
    if (f > 100.0) {
      slikaj(m, b + 2.0, prerez(V_AKTIN, vec2(z.x, yv - 30.0)), vec2(z.x, yv - 30.0), px);
      slikaj(m, b + 5.0, abs(yv - 30.0 - 1.9 * cos(3.14159 * z.x / 36.0 + 1.2)) - 0.45, vec2(z.x, yv - 30.0), px);
    }
    if (f < 1080.0) slikaj(m, b + 4.0, abs(yv - 20.0) - 0.5, vec2(z.x, yv - 20.0), px);
    if (f < 800.0) {
      slikaj(m, b + 1.0, abs(yv - 10.0) - 5.0, vec2(z.x, yv - 10.0), px);
      if (f > 70.0) {
        vec2 gq = vec2(mod(z.x, 14.3) - 7.0, abs(yv - 10.0) - 7.5);
        slikaj(m, b + 1.0, length(gq) - 2.6, gq, px);  // glave miozina vsakih 14,3 nm
      }
    }
    slikaj(m, b + 3.0, abs(f - 1100.0) - 30.0 + 2.0 * sin(z.y * 0.6), z, px);
  } else if (P == P_LIPID) {
    // triglicerid (kapljica maščobe)
    m.c *= 0.92 + 0.16 * smoothstep(0.35, 0.65, sum(x / 1.2));
  } else if (P == P_STENA_R) {
    // voda, celuloza (mikrofibrile), hemiceluloza (ksiloglukan), pektin
    vlakna(m, x, px, 8.0, 0.7, vec2(1.0, 0.0), 4.0, V_TANKO, b + 3.0, 29.0);
    vec2 z = R * x;
    float v = abs(mod(z.y, 6.0) - 3.0);
    slikaj(m, b + 1.0, max(v - 1.75, -(abs(fract(z.y / 0.6) - 0.5) * 0.6 - 0.05)), vec2(z.x, mod(z.y, 6.0) - 3.0), px);
    vlakna(m, x, px, 10.0, 0.6, vec2(uSmer.y, -uSmer.x), 0.5, V_TANKO, b + 2.0, 31.0);
  } else if (P == P_STENA_B) {
    // voda, peptidoglikan: verige sladkorjev (NAG–NAM) in prečne peptidne vezi
    vec2 z = R * x;
    float v = mod(z.y, 2.6) - 1.3;
    float d = abs(v) - 0.45;
    float pr = max(abs(mod(z.x + 2.0 * floor(z.y / 2.6), 4.0) - 2.0) - 0.3, abs(v) - 1.4);
    slikaj(m, b + 1.0, min(d, pr), vec2(z.x, v), px);
  } else if (P == P_STENA_K) {
    // voda, β-glukan in hitin, manoproteini
    vlakna(m, x, px, 4.0, 0.9, vec2(1.0, 0.0), 4.0, V_TANKO, b + 1.0, 33.0);
    raztopina(m, x, px, 9.0, vec4(b + 2.0, -1.0, -1.0, -1.0), vec4(0.3, 0.0, 0.0, 0.0), ivec4(O_KEPA, 0, 0, 0), vec4(2.6, 0.0, 0.0, 0.0), vec4(-1.0), 35.0);
  } else if (P == P_MATRIKS) {
    // voda, agrekan, hialuronska kislina, kolagen II
    vlakna(m, x, px, 110.0, 0.5, vec2(1.0, 0.0), 4.0, V_FIBRILA, b + 3.0, 37.0);
    vlakna(m, x, px, 50.0, 0.8, vec2(1.0, 0.0), 4.0, V_TANKO, b + 2.0, 39.0);
    vlakna(m, x, px, 30.0, 0.75, vec2(1.0, 0.0), 4.0, V_KRTACA, b + 1.0, 41.0);
  } else if (P == P_SLUZ) {
    // voda, mucin, ioni
    ioni(m, x, px, b + 2.0, 0.1);
    vlakna(m, x, px, 30.0, 0.8, vec2(1.0, 0.0), 4.0, V_KRTACA, b + 1.0, 43.0);
  } else if (P == P_ELASTIN) {
    // voda, elastin (amorfna gmota), fibrilin (mikrofibrile)
    float e = (0.48 - sum(x / 25.0)) * 70.0;
    slikaj(m, b + 1.0, e, x, px);
    vlakna(m, x, px, 40.0, 0.6, vec2(1.0, 0.0), 4.0, V_BISERI, b + 2.0, 45.0);
  } else if (P == P_KERATIN) {
    // voda, keratin (snopi vmesnih filamentov 10 nm)
    vec2 z = R * x;
    float yy = z.y + 4.0 * sum(z / 40.0);
    float v = mod(yy, 13.0) - 6.5;
    slikaj(m, b + 1.0, prerez(V_IF, vec2(z.x, v)), vec2(z.x, v), px);
  } else if (P == P_RIBOSOM) {
    // voda, ribosom, mRNK
    vlakna(m, x, px, 40.0, 0.5, vec2(1.0, 0.0), 4.0, V_RNK, b + 2.0, 47.0);
    raztopina(m, x, px, 24.0, vec4(b + 1.0, -1.0, -1.0, -1.0), vec4(0.8, 0.0, 0.0, 0.0), ivec4(O_RIBOSOM, 0, 0, 0), vec4(10.0, 0.0, 0.0, 0.0), vec4(-1.0), 21.0);
  } else if (P == P_GLIKOGEN) {
    // voda, glikogen
    raztopina(m, x, px, 28.0, vec4(b + 1.0, -1.0, -1.0, -1.0), vec4(0.9, 0.0, 0.0, 0.0), ivec4(O_ROZETA, 0, 0, 0), vec4(12.0, 0.0, 0.0, 0.0), vec4(-1.0), 27.0);
  } else if (P == P_MITO) {
    // voda, encimi citratnega cikla, mitohondrijska DNK
    vlakna(m, x, px, 60.0, 0.3, vec2(1.0, 0.0), 4.0, V_DNK, b + 2.0, 49.0);
    raztopina(m, x, px, 7.0, vec4(b + 1.0, -1.0, -1.0, -1.0), vec4(0.75, 0.0, 0.0, 0.0), ivec4(O_KEPA, 0, 0, 0), vec4(2.6, 0.0, 0.0, 0.0), vec4(-1.0), 51.0);
  } else if (P == P_KLOROPLAST) {
    // voda, rubisko, tilakoid s fotosistemom II
    vec2 z = R * x;
    float v = mod(z.y, 45.0) - 22.5;
    float til = abs(v) - 6.5;
    raztopina(m, x, px, 13.0, vec4(b + 1.0, -1.0, -1.0, -1.0), vec4(0.75, 0.0, 0.0, 0.0), ivec4(O_KVADER, 0, 0, 0), vec4(5.5, 0.0, 0.0, 0.0), vec4(-1.0), 53.0);
    slikaj(m, b + 2.0, min(til, length(vec2(mod(z.x, 18.0) - 9.0, abs(v) - 6.0)) - 3.2), vec2(z.x, v), px);
  } else if (P == P_KOLOID) {
    // voda, tiroglobulin (ščitnica) ali kristalini (leča)
    raztopina(m, x, px, 22.0, vec4(b + 1.0, -1.0, -1.0, -1.0), vec4(0.75, 0.0, 0.0, 0.0), ivec4(O_DIMER, 0, 0, 0), vec4(10.0, 0.0, 0.0, 0.0), vec4(-1.0), 55.0);
  } else if (P == P_GRANULA) {
    // voda, vsebina zrnca (melanin, prebavni encimi ali druge izločene beljakovine)
    raztopina(m, x, px, 9.0, vec4(b + 1.0, -1.0, -1.0, -1.0), vec4(0.95, 0.0, 0.0, 0.0), ivec4(O_KEPA, 0, 0, 0), vec4(4.0, 0.0, 0.0, 0.0), vec4(-1.0), 57.0);
  } else if (P == P_ER) {
    // voda, šaperon BiP, nastajajoče beljakovine
    vlakna(m, x, px, 14.0, 0.4, vec2(1.0, 0.0), 4.0, V_RNK, b + 2.0, 59.0);
    raztopina(m, x, px, 10.0, vec4(b + 1.0, -1.0, -1.0, -1.0), vec4(0.35, 0.0, 0.0, 0.0), ivec4(O_KEPA, 0, 0, 0), vec4(3.0, 0.0, 0.0, 0.0), vec4(-1.0), 61.0);
  } else if (P == P_MIELIN) {
    // voda, fosfolipid, holesterol, mielinska bazična beljakovina: dvosloji v razmiku 12 nm
    vec2 z = R * x;
    float v = mod(z.y, 12.0) - 6.0;
    float glava = length(vec2((fract(z.x / 0.8 + (v > 0.0 ? 0.0 : 0.5)) - 0.5) * 0.8, abs(v) - 2.0)) - 0.42;
    slikaj(m, b + 1.0, abs(v) - 1.65, vec2(z.x, v), px);
    slikaj(m, b + 1.0, glava, vec2(z.x, v), px);
    vec4 hh = h42(vec2(floor(z.x / 3.0), floor(z.y / 12.0)));
    if (hh.x < 0.35) slikaj(m, b + 2.0, sdElipsa(vec2(mod(z.x, 3.0) - 1.5, v - (hh.y < 0.5 ? 0.9 : -0.9)), vec2(0.35, 0.8)), vec2(z.x, v), px);
    float zun = abs(abs(v) - 6.0);
    vec4 hm = h42(vec2(floor(z.x / 7.0), floor(z.y / 12.0 + 0.5) + 77.0));
    if (hm.x < 0.6) slikaj(m, b + 3.0, sdKepa(vec2(mod(z.x, 7.0) - 3.5, zun), 1.6, hm.y), vec2(z.x, zun), px);
  } else if (P == P_SMOLA) {
    // vložna smola (epoksi), s katero je preparat zalit
    m.c *= 0.94 + 0.12 * smoothstep(0.6, 0.85, sum(x / 0.8));
  } else if (P == P_T4_DNK) {
    // voda, DNK: v glavi faga je 169 000 baznih parov navitih kot sukanec (razmik ~2,5 nm)
    // plasti DNK sledijo gladkemu polju (brez trganja): φ = prečna lega + upogib
    float fi = dot(x, vec2(0.6, 0.8)) + 22.0 * sum(x / 70.0);
    float i = floor(fi / 2.7 + 0.5);
    float v = fi - 2.7 * i;
    float u = dot(x, vec2(-0.8, 0.6)) + 3.4 * h12(vec2(i, 9.0)) + 0.9 * i;   // vsaka plast s svojo fazo žlebov
    slikaj(m, b + 1.0, prerez(V_DNK, vec2(u, v)), vec2(u, v), px);
  } else if (P == P_T4_REP) {
    // voda, ovoj repa gp18, cev repa gp19 (rep je debel ~23 nm; y = oddaljenost od roba)
    float r = abs(11.5 - y);
    float u = dot(x, sp);
    if (y > 0.0 && y < 23.0) {
      if (r < 4.6) slikaj(m, b + 2.0, length(vec2(mod(u, 4.1) - 2.05, r - 3.2)) - 1.5, vec2(u, r), px);
      else {
        float pl = floor(r / 3.4);
        vec2 q = vec2(mod(u + 1.4 * pl, 4.1) - 2.05, mod(r - 4.6, 3.4) - 1.7);
        slikaj(m, b + 1.0, length(q) - 1.65, vec2(u, r), px);
      }
    }
  } else if (P == P_T4_VLAKNO) {
    // voda, vlakna repa (gp34–gp37): tanka, členasta (polmer ~2 nm)
    float u = dot(x, sp);
    if (y > -3.0) slikaj(m, b + 1.0, prerez(V_BISERI, vec2(u, 2.0 - y)), vec2(u, 2.0 - y), px);
  } else if (P == P_SARS_RNP) {
    // voda, beljakovina N, virusna RNK (kroglice RNP ~15 nm na niti RNK)
    vlakna(m, x, px, 14.0, 0.9, vec2(1.0, 0.0), 4.0, V_RNK, b + 2.0, 63.0);
    raztopina(m, x, px, 16.0, vec4(b + 1.0, -1.0, -1.0, -1.0), vec4(0.7, 0.0, 0.0, 0.0), ivec4(O_KEPA, 0, 0, 0), vec4(5.0, 0.0, 0.0, 0.0), vec4(-1.0), 65.0);
  } else if (P == P_HIV_JEDRO) {
    // voda, virusna RNK (dve kopiji), reverzna transkriptaza
    vlakna(m, x, px, 10.0, 0.9, vec2(1.0, 0.0), 4.0, V_RNK, b + 1.0, 67.0);
    raztopina(m, x, px, 14.0, vec4(b + 2.0, -1.0, -1.0, -1.0), vec4(0.25, 0.0, 0.0, 0.0), ivec4(O_KEPA, 0, 0, 0), vec4(3.5, 0.0, 0.0, 0.0), vec4(-1.0), 69.0);
  } else if (P == P_HIV_MATRIKS) {
    // voda, kapsidna beljakovina p24 (nevgrajena)
    raztopina(m, x, px, 12.0, vec4(b + 1.0, -1.0, -1.0, -1.0), vec4(0.2, 0.0, 0.0, 0.0), ivec4(O_KEPA, 0, 0, 0), vec4(2.4, 0.0, 0.0, 0.0), vec4(-1.0), 71.0);
  } else if (P == P_VIRUS) {
    // voda, virusne beljakovine
    raztopina(m, x, px, 8.0, vec4(b + 1.0, -1.0, -1.0, -1.0), vec4(0.9, 0.0, 0.0, 0.0), ivec4(O_KEPA, 0, 0, 0), vec4(2.8, 0.0, 0.0, 0.0), vec4(-1.0), 73.0);
  }
  return m;
}

// Membrana (reže 12–15) čez prizor: 0 lipidni dvosloj, 1 glava faga T4, 2 virusna ovojnica z bodicami, 3 stena iz p24,
// 4 brez (le rob). y > 0 na strani A; uZun = +1, če je zunanjost (pri virusih) na strani A.
void membranaMol(inout M m, vec2 x, float y, float px) {
  int v = int(uMemVrsta + 0.5);
  vec2 t = vec2(-uN.y, uN.x);
  float u = dot(x, t);
  vec2 z = vec2(u, y);
  if (v == 0 || v == 2) {
    if (abs(y) > 4.5 && v == 0) return;
    // fosfolipidi: glave na ±2 nm, repi v sredini
    float rep = max(abs(y) - 1.65, -(abs(fract(u / 0.4) - 0.5) * 0.4 - 0.06));
    slikaj(m, 12.0, rep, z, px);
    m.c = mix(m.c, m.c * vec3(1.05, 1.02, 0.85), step(abs(y), 1.65) * step(m.id, 12.5) * step(11.5, m.id));
    slikaj(m, 12.0, length(vec2((fract(u / 0.8 + (y > 0.0 ? 0.0 : 0.5)) - 0.5) * 0.8, abs(y) - 2.0)) - 0.42, z, px);
    vec4 hb = h42(vec2(floor(u / 24.0), 3.0));
    if (v == 0) {
      // holesterol v repih, občasno membranska beljakovina čez vso debelino
      vec4 hc = h42(vec2(floor(u / 2.4), 5.0));
      if (hc.x < 0.4) slikaj(m, 13.0, sdElipsa(vec2(mod(u, 2.4) - 1.2, abs(y) - 0.95), vec2(0.3, 0.75)), z, px);
      if (hb.x < 0.45) slikaj(m, 14.0, sdKepa(vec2((fract(u / 24.0) - 0.5) * 24.0, y) * vec2(1.0, 0.75), 3.0, hb.y), z, px);
    } else {
      // beljakovina M v ovojnici in bodice na zunanji strani (razmik uBodice)
      float yo = y * uZun;
      vec4 hm = h42(vec2(floor(u / 9.0), 7.0));
      if (hm.x < 0.5) slikaj(m, 14.0, sdElipsa(vec2(mod(u, 9.0) - 4.5, y), vec2(1.3, 2.6)), z, px);
      vec4 hs = h42(vec2(floor(u / uBodice), 9.0));
      if (hs.x < 0.75) {
        vec2 q = vec2(mod(u, uBodice) - 0.5 * uBodice, yo);
        float d = sdOdsek(q, vec2(0.0, 2.0), vec2(0.0, 11.0)) - 1.0;
        d = min(d, sdElipsa(q - vec2(0.0, 15.5), vec2(4.5, 5.0)));
        slikaj(m, 13.0, d, q, px);
      }
    }
  } else if (v == 1) {
    // glava T4: plašč iz beljakovine gp23 (debelina ~3 nm), zunaj gumbi Hoc in drobni Soc
    float yo = y * uZun;
    vec2 q = vec2(mod(u, 4.6) - 2.3, yo + 1.6);
    slikaj(m, 12.0, max(length(q) - 2.0, abs(yo + 1.6) - 1.6), z, px);
    vec2 hq = vec2(mod(u, 14.0) - 7.0, yo - 2.6);
    slikaj(m, 13.0, min(length(hq) - 2.1, max(abs(hq.x) - 0.7, abs(yo - 0.8) - 1.0)), z, px);
    slikaj(m, 13.0, length(vec2(mod(u + 3.5, 7.0) - 3.5, yo - 0.6)) - 0.8, z, px);
  } else if (v == 3) {
    // stena stožčastega jedra HIV iz heksamerov p24 (prerez: grudast pas ~4 nm)
    slikaj(m, 12.0, max(length(vec2(mod(u, 3.2) - 1.6, y)) - 2.0, abs(y) - 2.0), z, px);
  }
}

// ---------- atomi ----------
#define A_VODA 0
#define A_BELJ 1
#define A_DNK 2
#define A_RNK 3
#define A_LIPID 4
#define A_APATIT 5
#define A_CELULOZA 6
#define A_KOLAGEN 7
#define A_SLADKOR 8
#define A_HEM 9
#define A_ION 10
#define A_SMOLA 11
#define A_ZN 12
#define A_TG 13
// hem: železo v sredini porfirinskega obroča (4 N, 20 C)
void hemAt(inout vec4 b, vec2 x, vec2 z) {
  vec2 c = x - z;
  atom(b, x, c, 8.0);
  for (int i = 0; i < 4; i++) atom(b, x, c + 0.2 * smerOd(float(i) * 1.5708 + 0.785), 3.0);
  for (int i = 0; i < 12; i++) atom(b, x, c + (mod(float(i), 3.0) < 0.5 ? 0.42 : 0.33) * smerOd(float(i) * 0.5236), 2.0);
}
vec4 atomiMol(M m, vec2 x, float y) {
  vec4 b = vec4(1e3, 0.0, 0.0, 0.0);
  int a = int(uAtMol[int(m.id)] + 0.5);
  if (a == A_VODA) voda(b, x, 1.0);
  else if (a == A_BELJ) organska(b, x, 0.0);
  else if (a == A_DNK) { if (abs(m.z.y) < 1.3) dnk(b, m.z); else organska(b, x, 0.0); }
  else if (a == A_RNK) organska(b, x, 0.12);
  else if (a == A_LIPID) lipidi(b, m.z);
  else if (a == A_TG) verige(b, rot(0.4 * sum(x / 3.0)) * x, 0.45, 0.06);
  else if (a == A_APATIT) apatit(b, x);
  else if (a == A_CELULOZA) celuloza(b, m.z);
  else if (a == A_KOLAGEN) kolagenAt(b, m.z);
  else if (a == A_SLADKOR) celuloza(b, rot(1.3 * sum(x / 2.0)) * x);
  else if (a == A_HEM) hemAt(b, x, m.z);
  else if (a == A_ION) { vec2 c = x - m.z; atom(b, x, c, 9.0 + floor(h12(floor(c * 7.0)) * 3.0)); }
  else if (a == A_ZN) atom(b, x, x - m.z, 12.0);
  else { organska(b, x * 1.4, 0.0); if (b.x > 1.0) b = vec4(1e3, 0, 0, 0); }
  return b;
}

void main() {
  vec2 off = (gl_FragCoord.xy - 0.5 * uRes) * uPxNm;
  vec2 x = uFine + off;                     // natančno (do 4000 nm)
  float y = uY0 + dot(off, uN);             // oddaljenost od membrane (> 0 na strani A)
  float px = uPxNm;
  bool stranB = uMem > 0.5 && y < 0.0;
  M m;
  if (stranB) m = prizor(int(uPB + 0.5), 6.0, x, -y, px);
  else m = prizor(int(uPA + 0.5), 0.0, x, y, px);
  if (uMem > 0.5 && abs(y) < 30.0) membranaMol(m, x, y, px);
  if (uIdPass == 1) { o = vec4((m.id + 1.0) / 255.0, 0.0, 0.0, 1.0); return; }
  vec3 c = uBarve > 0.5 ? m.c : vec3(exp(-2.0 * m.g));
  // raven atomov: postopen prehod od 0,08 do 0,03 nm na točko; voda je bleda, da izstopajo molekule
  float at = smoothstep(0.08, 0.03, px);
  if (at > 0.0) {
    vec4 b = atomiMol(m, x, y);
    bool vodna = int(uAtMol[int(m.id)] + 0.5) == A_VODA;
    vec3 ozadje = uBarve > 0.5 ? vec3(0.05, 0.07, 0.12) : vec3(0.93);
    if (!vodna) ozadje = mix(ozadje, uBarve > 0.5 ? m.c : vec3(exp(-2.0 * m.g)), 0.22);
    vec3 ca = ozadje;
    if (b.x < 1.0) {
      float z = sqrt(max(0.0, 1.0 - b.x * b.x));
      vec3 n = normalize(vec3(b.zw / polmerEl(b.y), z));
      float l = max(0.0, dot(n, normalize(vec3(-0.4, 0.5, 0.8))));
      vec3 bc = barvaEl(b.y);
      vec3 sfera = bc * (0.35 + 0.65 * l) + pow(max(0.0, dot(reflect(-normalize(vec3(-0.4, 0.5, 0.8)), n), vec3(0, 0, 1))), 24.0) * 0.5;
      float sv = (1.0 - smoothstep(0.92, 1.0, b.x)) * (vodna ? 0.35 : 1.0);
      vec3 siva = vec3(1.0 - zEl(b.y) * (0.6 + 0.4 * z));
      ca = mix(ozadje, uBarve > 0.5 ? sfera : siva, sv);
    }
    c = mix(c, ca, at);
  }
  o = vec4(c, 1.0);
}`;
