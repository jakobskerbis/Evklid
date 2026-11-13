// Senčilniki mikroskopa (docs/mikroskop.md): skupna knjižnica (naključnost, šum, Voronoi, oblike), opis tkiva T, ki ga
// vrne vsak preparat, in splošni prikaz TEM (organeli, membrane, jedro). Preparat (public/mikroskop/preparati/*.js) da
// samo funkcijo `T tkivo(vec2 p, float px)`: p je točka na objektnem stekelcu v µm, px velikost slikovne točke v µm
// (za glajenje robov). Barve svetlobnega mikroskopa nastanejo iz količin barvil po Beer–Lambertu (OD-vektorji barvil
// so uniforme, preparat izbere barvanje), sivine TEM iz »gostote« snovi in organelov.

export const OSNOVE = /* glsl */ `
precision highp float;
precision highp int;

// ---------- naključnost (pcg2d, Jarzynski in Olano 2020) ----------
uvec2 pcg2(uvec2 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * 1664525u; v.y += v.x * 1664525u;
  v ^= v >> 16u;
  v.x += v.y * 1664525u; v.y += v.x * 1664525u;
  v ^= v >> 16u;
  return v;
}
vec2 h22(vec2 c) { return vec2(pcg2(uvec2(ivec2(floor(c)) + ivec2(1 << 20)))) * (1.0 / 4294967295.0); }
float h12(vec2 c) { return h22(c).x; }
vec4 h42(vec2 c) {
  uvec2 a = pcg2(uvec2(ivec2(floor(c)) + ivec2(1 << 20)));
  uvec2 b = pcg2(a ^ uvec2(0x9e3779b9u, 0x85ebca6bu));
  return vec4(vec2(a), vec2(b)) * (1.0 / 4294967295.0);
}

// Gradientni šum (0..1) in fraktalni šum.
float sum(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 a = h22(i) * 2.0 - 1.0, b = h22(i + vec2(1, 0)) * 2.0 - 1.0;
  vec2 c = h22(i + vec2(0, 1)) * 2.0 - 1.0, d = h22(i + vec2(1, 1)) * 2.0 - 1.0;
  float v = mix(mix(dot(a, f), dot(b, f - vec2(1, 0)), u.x), mix(dot(c, f - vec2(0, 1)), dot(d, f - vec2(1, 1)), u.x), u.y);
  return 0.5 + 0.7 * v;
}
float fbm(vec2 p, int n) {
  float s = 0.0, a = 0.5, w = 0.0;
  for (int i = 0; i < 6; i++) {
    if (i >= n) break;
    s += a * sum(p); w += a;
    p = mat2(1.6, 1.2, -1.2, 1.6) * p + 17.3;
    a *= 0.5;
  }
  return s / w;
}
// Šum, ki ga pri premajhni sliki (velikost vzorca < 2 točki) nadomesti povprečje 0,5: brez migotanja ob oddaljitvi.
float sumL(vec2 p, float s, float px) { return mix(sum(p / s), 0.5, smoothstep(0.25 * s, 0.6 * s, px)); }

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
float pokrij(float d, float px) { return 1.0 - smoothstep(-px, px, d); }            // delež znotraj oblike (d < 0)
float crta(float d, float w, float px) {                                              // tanka črta širine 2w
  float pw = max(px, 1e-6);
  return clamp((w + 0.5 * pw - abs(d)) / pw, 0.0, 1.0) * min(1.0, sqrt(2.0 * w / pw + 0.02));
}
float sdElipsa(vec2 p, vec2 r) { float k = length(p / r); return (k - 1.0) * min(r.x, r.y) * (k < 1.0 ? 1.0 : min(1.0, k)); }
float sdKapsula(vec2 p, float L, float r) { p.x = max(abs(p.x) - L, 0.0); return length(p) - r; }
float sdKrog(vec2 p, float r) { return length(p) - r; }
float sdPravok(vec2 p, vec2 b) { vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }

// Voronoi z razdaljo do meje (Quilez): id celice (cela števila), središče, razdalja do središča in do meje.
// Enote so enote mreže; vor() spodaj vrne µm.
struct Vor { vec2 id; vec2 c; float d; float rob; vec2 nb; };  // nb: smer proti najbližji meji
Vor voronoi(vec2 x, float jit) {
  vec2 n = floor(x), f = x - n, mg = vec2(0), mr = vec2(0);
  float md = 8.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(i, j);
    vec2 r = g + 0.5 + jit * (h22(n + g) - 0.5) - f;
    float d = dot(r, r);
    if (d < md) { md = d; mr = r; mg = g; }
  }
  float rob = 8.0;
  vec2 nb = vec2(1, 0);
  for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++) {
    vec2 g = mg + vec2(i, j);
    vec2 r = g + 0.5 + jit * (h22(n + g) - 0.5) - f;
    vec2 dr = r - mr;
    if (dot(dr, dr) > 1e-6) {
      float b = dot(0.5 * (mr + r), normalize(dr));
      if (b < rob) { rob = b; nb = normalize(dr); }
    }
  }
  return Vor(n + mg, x + mr, sqrt(md), rob, nb);
}
// Celice velikosti s (µm), raztegnjene za a (a.x vzdolž, a.y počez) in zasukane za kot k.
Vor vor(vec2 p, float s, vec2 a, float k, float jit) {
  mat2 R = rot(k);
  vec2 q = (R * p) / (s * a);
  Vor v = voronoi(q, jit);
  v.c = transpose(R) * (v.c * s * a);
  v.d *= s * min(a.x, a.y);
  v.rob *= s * min(a.x, a.y);
  v.nb = transpose(R) * normalize(v.nb / a);
  return v;
}

// Naključni krogci v mreži s (µm): v vsaki celici en krog s polmerom r0–r1 z verjetnostjo pr. Pregleda 3 × 3 sosedov,
// zato se krogci ne odrežejo na meji mreže. Vrne (razdalja do roba, < 0 znotraj; središče x, y; seme).
vec4 krogci(vec2 p, float s, float r0, float r1, float pr, float seme) {
  vec2 n = floor(p / s);
  vec4 b = vec4(1e3, 0.0, 0.0, 0.0);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 k = n + vec2(i, j);
    vec4 h = h42(k + seme);
    if (h.z > pr) continue;
    vec2 c = (k + 0.5 + 0.75 * (h.xy - 0.5)) * s;
    float d = length(p - c) - mix(r0, r1, h.w);
    if (d < b.x) b = vec4(d, c, h.w + k.x * 7.0 + k.y * 13.0);
  }
  return b;
}

// Robni obris rezine (tkivo na stekelcu): elipsa s polosema r (µm), razjedena s šumom. < 0 znotraj.
float odsek(vec2 p, vec2 r, float seme) {
  float d = sdElipsa(p, r);
  float m = min(r.x, r.y);
  return d + m * 0.12 * (fbm(p / (m * 0.35) + seme, 4) - 0.5) + m * 0.03 * (sum(p / (m * 0.04)) - 0.5);
}

// ---------- opis tkiva ----------
// snov (S_*): kaj je v točki; tip (C_*): vrsta celice, ki določa organele pri TEM.
#define S_PRAZNO 0.0
#define S_CITO 1.0
#define S_JEDRO 2.0
#define S_KOLAGEN 3.0
#define S_MINERAL 4.0
#define S_ERITROCIT 5.0
#define S_LIPID 6.0
#define S_MIOFIBRILA 7.0
#define S_MIELIN 8.0
#define S_MATRIKS 9.0
#define S_KERATIN 10.0
#define S_STENA 11.0
#define S_VAKUOLA 12.0
#define S_KOLOID 13.0
#define S_PLAZMA 14.0
#define S_ELASTIN 15.0
#define S_SLUZ 16.0
#define S_VIRUS 17.0
#define S_SKLENINA 18.0
// le pri TEM (organeli in deli jedra)
#define S_MITO 20.0
#define S_ER 21.0
#define S_RIBOSOM 22.0
#define S_GLIKOGEN 23.0
#define S_MEMBRANA 24.0
#define S_KLOROPLAST 25.0
#define S_GRANULA 26.0
#define S_KROMATIN 27.0
#define S_JEDRCE 28.0
#define S_GOLGI 29.0
#define S_MIKROVIL 30.0

#define C_SPLOSNA 0.0
#define C_HEPATOCIT 1.0
#define C_FIBROBLAST 2.0
#define C_LIMFOCIT 3.0
#define C_NEVRON 4.0
#define C_ZLEZNA 5.0
#define C_RASTLINSKA 6.0
#define C_BAKTERIJA 7.0
#define C_RESICE 8.0
#define C_KERATINOCIT 9.0
#define C_GLIJA 10.0
#define C_KVASOVKA 11.0
#define C_PRAZIVAL 12.0
#define C_GLADKA 13.0
#define C_ADIPOCIT 14.0
#define C_LEVKOCIT 15.0
#define C_MISICA 16.0
#define C_NEVRIT 17.0   // drobni izrastki v nevropilu (aksoni, dendriti, sinapse z mehurčki)

struct T {
  vec3 dye;    // količine barvil (prvo, drugo, tretje); barve dajo uniforme uBarvilo0..2
  float snov;  // S_*
  float meja;  // razdalja do celične membrane (µm), 1e3 če je ni
  float jedro; // predznačena razdalja do roba jedra (µm), < 0 v jedru; 1e3 če ga ni
  vec2 cc;     // središče celice (µm)
  vec2 jc;     // središče jedra (µm)
  vec2 cid;    // id celice (seme)
  float tip;   // C_*
  vec2 smer;   // smer vlaken v ravnini rezine; dolžina 1 = vzdolžni, 0 = prečni prerez
  float r1;    // plastna koordinata (mielin: razdalja od aksona, µm; sarkomera: lega vzdolž vlakna, µm)
};
T prazno() { return T(vec3(0), S_PRAZNO, 1e3, 1e3, vec2(0), vec2(0), vec2(0), C_SPLOSNA, vec2(0), 0.0); }
T celicaT(Vor v, float tip) { T t = prazno(); t.snov = S_CITO; t.meja = v.rob; t.cc = v.c; t.jc = v.c; t.cid = v.id; t.tip = tip; return t; }

// Kromatin pri svetlobnem mikroskopu: zrnato barvilo v jedru (0,55–1) in temnejše jedrce.
float kromatin(vec2 q, vec2 seme, float px) {
  float z = sumL(q + seme * 31.0, 0.45, px) * 0.55 + sumL(q * 1.7 + seme * 7.0, 0.25, px) * 0.35;
  return clamp(0.35 + z, 0.0, 1.2);
}
// Jedro kot zaobljena elipsa s šumom roba; vrne predznačeno razdaljo (µm).
float sdJedro(vec2 q, vec2 r, float kot, vec2 seme) {
  vec2 z = rot(kot) * q;
  float d = sdElipsa(z, r);
  return d + min(r.x, r.y) * 0.12 * (sum(z / (min(r.x, r.y) * 0.8) + seme * 13.0) - 0.5);
}
// Najpogostejša oblika: jedro v celici t na odmiku o od središča, polosi r, zasuk kot; moc = jakost barvila.
void jedroV(inout T t, vec2 p, vec2 o, vec2 r, float kot, float moc, float px) {
  t.jc = t.cc + o;
  vec2 q = p - t.jc;
  float d = sdJedro(q, r, kot, t.cid);
  t.jedro = d;
  float k = pokrij(d, px);
  if (k > 0.0) {
    t.dye.x = mix(t.dye.x, moc * kromatin(q, t.cid, px), k);
    t.dye.y *= 1.0 - 0.6 * k;
    if (k > 0.5) t.snov = S_JEDRO;
  }
}

// Enoskladni epitelij: d = globina od apikalne površine (0..H), s = lega vzdolž površine, w = širina celice.
// Jedro pri globini jd·H (0 apikalno, 1 bazalno), podolgovato pri visokih celicah. Vrne T celice (snov S_CITO/S_JEDRO).
T epitel(float d, float s, float H, float w, float jd, float tip, vec2 seme, vec2 p, vec2 os, float px) {
  T t = prazno();
  float i = floor(s / w);
  vec4 h = h42(vec2(i, 0.0) + seme);
  float ls = (fract(s / w) - 0.5) * w;
  t.snov = S_CITO; t.tip = tip; t.cid = vec2(i, 0.0) + seme;
  t.meja = min(min(0.5 * w - abs(ls), d), H - d);
  t.cc = p + os * (d - 0.5 * H) - vec2(-os.y, os.x) * ls;
  t.dye = vec3(0.07, 0.4 + 0.08 * (sumL(vec2(s, d), 3.0, px) - 0.5), 0.0);
  t.dye.y -= 0.12 * crta(0.5 * w - abs(ls), 0.2, px);
  vec2 q = vec2(ls, d - jd * H - 0.6 * (h.x - 0.5) * min(H * 0.2, 3.0));
  vec2 r = vec2(min(0.32 * w, 3.0), clamp(0.22 * H, 0.32 * w, 6.5));
  float dj = sdElipsa(q, r) + 0.15 * (sum(q * 1.2 + h.zw * 9.0) - 0.5);
  t.jedro = dj;
  t.jc = t.cc + os * (jd * H - 0.5 * H);
  float jk = pokrij(dj, px);
  t.dye.x = mix(t.dye.x, 0.85 * kromatin(q, h.zw, px), jk);
  if (jk > 0.5) t.snov = S_JEDRO;
  return t;
}

// Prečni prerez cevke (žleza, ledvična cevka, folikel): svetlina polmera rl, epitelij do polmera R. q glede na središče.
T cevka(vec2 q, float rl, float R, float w, float jd, float tip, vec2 seme, vec2 p, float px) {
  float r = length(q);
  if (r < rl) { T t = prazno(); t.dye = vec3(0.0, 0.03, 0.0); return t; }
  float ref = 0.5 * (rl + R);
  return epitel(r - rl, atan(q.y, q.x) * ref, max(R - rl, 2.0), w, jd, tip, seme, p, q / max(r, 1e-3), px);
}

// Večskladni ploščati epitelij: d = globina od površine (0..H). Celice so bazalno majhne in temne, proti površini
// ploščate; rozen = poroženevajoč (koža): vrhnja plast brez jeder, pod njo zrnati sloj.
T vecskladni(float d, float s, float H, float rozen, vec2 seme, float px) {
  T t = prazno();
  float f = clamp(d / H, 0.0, 1.0);                // 0 površina, 1 bazalno
  float hc = mix(1.6, 7.5, f);
  float D = (log(1.6 + 5.9 * f) - log(1.6)) / 5.9 * H;   // ∫ dd / hc
  Vor v = voronoi(vec2(s / mix(26.0, 9.0, f), D / 1.0 * 0.95) + seme, 0.75);
  vec4 h = h42(v.id);
  t.snov = S_CITO; t.tip = C_KERATINOCIT; t.cid = v.id;
  t.meja = v.rob * min(mix(26.0, 9.0, f), hc);
  t.cc = vec2(0.0); t.jc = vec2(0.0);
  t.dye = vec3(0.08 + 0.12 * f * f, 0.42 - 0.1 * f + 0.05 * (sumL(vec2(s, d), 4.0, px) - 0.5), 0.0);
  t.dye.y -= 0.1 * crta(t.meja, 0.3, px) * (1.0 - smoothstep(0.0, 0.4, f));
  t.dye.x += 0.12 * crta(t.meja, 0.35, px) * smoothstep(0.3, 0.6, f);   // »bodice« med celicami
  float roz = rozen * (1.0 - smoothstep(0.1, 0.16, f));
  if (roz > 0.5) {
    t.snov = S_KERATIN; t.jedro = 1e3;
    t.dye = vec3(0.04, 0.42 + 0.12 * sin(d * 2.8 + 3.0 * sum(vec2(s / 20.0, 0.0))), 0.0);
    t.dye *= step(0.3, sumL(vec2(s * 0.2, d * 1.5), 1.0, px) + 0.15);
    return t;
  }
  float zrn = rozen * smoothstep(0.12, 0.17, f) * (1.0 - smoothstep(0.22, 0.28, f));
  t.dye.x += 0.9 * zrn * smoothstep(0.55, 0.7, sumL(vec2(s, d), 0.6, px));
  vec2 c = (v.c - seme) * vec2(mix(26.0, 9.0, f), 1.0);
  vec2 q = vec2(s - c.x, (D * 0.95 - (v.c.y - seme.y)) * hc);
  vec2 r = vec2(mix(5.0, 3.0, f), mix(1.2, 2.8, f));
  float dj = sdElipsa(q, r) + 0.2 * (sum(q + h.zw * 9.0) - 0.5);
  t.jedro = dj;
  t.cc = -q; t.jc = -q;                            // odmik središča v (s, d); vSvet ga prenese v ravnino rezine
  float jk = pokrij(dj, px) * step(0.15, f);
  t.dye.x = mix(t.dye.x, mix(0.6, 1.0, f) * kromatin(q, h.zw, px), jk);
  if (jk > 0.5) t.snov = S_JEDRO;
  return t;
}

// Elektronska gostota (TEM): g = 0 svetlo … 1+ temno; snov in razdalja do najbližje membrane (µm).
struct U { float g; float snov; float meja; };
float membrana(float d, float px);
void zrno(inout U u, vec2 z, float r, float g0, float mem, float px);
void mitohondrij(inout U u, vec2 z, float L, float r, vec4 h, float px);

// Središče celice iz večskladnega epitelija (odmik v koordinatah s, d) v ravnini rezine: tv = smer naraščanja s,
// nv = smer naraščanja d (v globino).
T vSvet(T e, vec2 p, vec2 tv, vec2 nv) {
  e.cc = p + e.cc.x * tv + e.cc.y * nv;
  e.jc = p + e.jc.x * tv + e.jc.y * nv;
  return e;
}

// Krvna žila (prečni prerez) s polmerom r: tanka stena z endotelijem, v svetlini eritrociti. q glede na središče.
bool zila(inout T t, vec2 q, float r, float stena, vec2 seme, float px) {
  float d = length(q) - r;
  if (d > stena + px) return false;
  float k = pokrij(d - stena, px);
  t.dye = mix(t.dye, vec3(0.08, 0.38, 0.0), k);
  t.snov = S_KOLAGEN; t.smer = vec2(0.0);
  float a = atan(q.y, q.x);
  float jn = abs(fract(a * r / 14.0 + seme.x) - 0.5) * 14.0;
  float dj = sdElipsa(vec2(jn, d - 0.3 * stena), vec2(3.5, 0.8));
  t.dye.x += 0.8 * pokrij(dj, px);
  if (dj < 0.0) { t.snov = S_JEDRO; t.jedro = dj; t.tip = C_FIBROBLAST; }
  if (d < 0.0) {
    T l = prazno();
    l.snov = S_PLAZMA;
    l.dye = vec3(0.0, 0.08, 0.0);
    vec4 e = krogci(q, 7.2, 3.2, 3.7, 0.75, seme.y * 13.0);
    if (e.x < 0.0) { l.dye.y = 0.75 - 0.2 * smoothstep(1.8, 0.0, length(q - e.yz)); l.snov = S_ERITROCIT; l.meja = -e.x; }
    float kk = pokrij(d, px);
    t.dye = mix(t.dye, l.dye, kk);
    if (kk > 0.5) { t.snov = l.snov; t.meja = l.meja; t.jedro = 1e3; }
  }
  return true;
}

`;

// Splošni prikaz TEM: organeli v celici (po vrsti celice), jedro z ovojnico in porami, membrane, posebne snovi.
export const ULTRA = /* glsl */ `
// Membrana (lipidni dvosloj, ~7,5 nm): dva temna lista na ±2,5 nm. Pri manjši povečavi ena temna črta.
float membrana(float d, float px) {
  float list2 = crta(abs(d) - 0.0025, 0.0011, px);
  float ena = crta(d, 0.0038, px);
  return mix(list2, ena, smoothstep(0.0008, 0.0025, px));
}

struct Profil { float mito; float rer; float golgi; float gran; float rib; float glik; float lip; float kerat; };
Profil profil(float tip) {
  if (tip == C_HEPATOCIT) return Profil(0.55, 0.35, 0.1, 0.12, 0.5, 0.8, 0.06, 0.0);
  if (tip == C_FIBROBLAST) return Profil(0.18, 0.55, 0.15, 0.05, 0.4, 0.0, 0.02, 0.0);
  if (tip == C_LIMFOCIT) return Profil(0.12, 0.05, 0.03, 0.04, 0.9, 0.0, 0.0, 0.0);
  if (tip == C_NEVRON) return Profil(0.4, 0.55, 0.15, 0.08, 0.6, 0.0, 0.0, 0.0);
  if (tip == C_ZLEZNA) return Profil(0.25, 0.6, 0.2, 0.45, 0.5, 0.0, 0.0, 0.0);
  if (tip == C_RASTLINSKA) return Profil(0.15, 0.1, 0.06, 0.0, 0.3, 0.0, 0.03, 0.0);
  if (tip == C_RESICE) return Profil(0.5, 0.2, 0.12, 0.08, 0.4, 0.0, 0.03, 0.0);
  if (tip == C_KERATINOCIT) return Profil(0.12, 0.08, 0.04, 0.05, 0.4, 0.0, 0.0, 0.7);
  if (tip == C_GLIJA) return Profil(0.2, 0.2, 0.06, 0.05, 0.4, 0.0, 0.0, 0.0);
  if (tip == C_KVASOVKA) return Profil(0.2, 0.15, 0.05, 0.0, 0.7, 0.3, 0.1, 0.0);
  if (tip == C_PRAZIVAL) return Profil(0.3, 0.15, 0.08, 0.3, 0.5, 0.0, 0.08, 0.0);
  if (tip == C_GLADKA) return Profil(0.2, 0.05, 0.03, 0.0, 0.2, 0.05, 0.0, 0.35);
  if (tip == C_ADIPOCIT) return Profil(0.1, 0.05, 0.02, 0.0, 0.2, 0.0, 0.0, 0.0);
  if (tip == C_LEVKOCIT) return Profil(0.12, 0.1, 0.05, 0.6, 0.4, 0.15, 0.0, 0.0);
  if (tip == C_MISICA) return Profil(0.6, 0.0, 0.0, 0.0, 0.2, 0.3, 0.05, 0.0);
  if (tip == C_NEVRIT) return Profil(0.35, 0.0, 0.0, 0.0, 0.05, 0.0, 0.0, 0.0);
  if (tip == C_BAKTERIJA) return Profil(0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0);
  return Profil(0.3, 0.25, 0.1, 0.1, 0.45, 0.0, 0.03, 0.0);
}

// Mitohondrij v lokalnem sistemu (os x vzdolž): ovojnica (dve membrani), kriste, gost matriks.
void mitohondrij(inout U u, vec2 z, float L, float r, vec4 h, float px) {
  float d = sdKapsula(z, L, r);
  if (d > 0.01 + px) return;
  float m = pokrij(d, px);
  float notri = pokrij(d + 0.02, px);
  // kriste: ploščice počez na os, izmenično z obeh strani
  float per = 0.085 + 0.05 * h.z;
  float u0 = z.x / per + h.w * 7.0;
  float idx = floor(u0 + 0.5);
  float c = (u0 - idx) * per;
  float strana = h12(vec2(idx, h.x * 97.0)) < 0.5 ? -1.0 : 1.0;
  float doseg = r * (0.45 + 0.5 * h12(vec2(idx, h.y * 53.0)));
  float vk = z.y * strana + r - 0.02;
  float krista = (vk < doseg * 2.0 && vk > 0.0) ? max(membrana(c - 0.009, px), membrana(c + 0.009, px)) : 0.0;
  float g = 0.42 + 0.12 * sumL(z, 0.03, px);
  float ovoj = max(membrana(d, px), membrana(d + 0.02, px));
  float dens = mix(u.g, g, m);
  dens = mix(dens, 0.8, max(ovoj, krista * notri) * m);
  u.g = dens;
  if (m > 0.5) { u.snov = S_MITO; u.meja = min(u.meja, min(abs(d), abs(d + 0.02))); }
}

// Zrnati ali gladki endoplazemski retikel / Golgijev aparat: kup sploščenih cistern.
void cisterne(inout U u, vec2 z, float L, float n, float raz, float rib, float krivina, vec4 h, float px) {
  float zv = z.y + krivina * z.x * z.x;
  float i = clamp(floor(zv / raz + 0.5 * n), 0.0, n - 1.0);
  float v = zv - (i - 0.5 * (n - 1.0)) * raz;
  float Li = L * (0.7 + 0.3 * h12(vec2(i, h.x * 91.0)));
  float konec = smoothstep(Li, Li - 0.06, abs(z.x));
  if (konec <= 0.0) return;
  float sir = 0.016 * (1.0 + krivina * 4.0 * smoothstep(Li * 0.6, Li, abs(z.x)));
  float lumen = pokrij(abs(v) - sir, px) * konec;
  float mem = max(membrana(v - sir, px), membrana(v + sir, px)) * konec;
  float g = mix(u.g, 0.3, lumen);
  g = mix(g, 0.78, mem);
  if (rib > 0.0) {
    float s = 0.034;
    float w = z.x / s + i * 0.37;
    vec2 rz = vec2((fract(w) - 0.5) * s, abs(v) - sir - 0.016);
    float on = step(0.25, h12(vec2(floor(w), i + h.y * 77.0)));
    g = mix(g, 0.85, on * pokrij(length(rz) - 0.0115, px) * konec * step(abs(v), sir + 0.035));
  }
  u.g = g;
  if (lumen > 0.5) u.snov = rib > 0.0 ? S_ER : S_GOLGI;
  if (mem > 0.0) u.meja = min(u.meja, abs(abs(v) - sir));
}

// Zrna (lizosomi, sekretorna zrnca), lipidne kapljice, vezikli.
void zrno(inout U u, vec2 z, float r, float g0, float mem, float px) {
  float d = sdKrog(z, r);
  float m = pokrij(d, px);
  if (m <= 0.0 && d > 0.006 + px) return;
  u.g = mix(u.g, g0 + 0.1 * (sumL(z, 0.04, px) - 0.5), m);
  if (mem > 0.0) u.g = mix(u.g, 0.8, membrana(d, px) * mem);
  if (m > 0.5) { u.snov = mem > 0.0 ? S_GRANULA : S_LIPID; u.meja = min(u.meja, abs(d)); }
}

// Kloroplast: elipsa z grani (skladi tilakoid) in stromskimi tilakoidami, škrobna zrna, plastoglobuli.
void kloroplast(inout U u, vec2 z, vec2 r, vec4 h, float px) {
  float d = sdElipsa(z, r);
  if (d > 0.02 + px) return;
  float m = pokrij(d, px);
  float g = 0.4 + 0.08 * sumL(z, 0.05, px);
  // grani: na vsakih ~0,45 µm sklad diskov (razmik 16 nm), med njimi posamezne stromske tilakoide
  float gx = z.x / 0.45 + h.x * 5.0;
  float gi = floor(gx);
  float vGranum = abs(fract(gx) - 0.5) * 0.45;
  float granum = step(vGranum, 0.13 + 0.05 * h12(vec2(gi, h.y * 31.0)));
  float per = granum > 0.5 ? 0.017 : 0.09;
  float lv = (fract(z.y / per + 0.5) - 0.5) * per;
  float til = membrana(lv, px) * step(abs(z.y), r.y - 0.06);
  g = mix(g, 0.8, til * 0.9);
  // škrob (svetla elipsa) in plastoglobuli (temne pike)
  float skrob = pokrij(sdElipsa(rot(0.3) * (z - vec2(r.x * 0.3 * (h.z - 0.5), 0.0)), vec2(r.x * 0.28, r.y * 0.35)), px) * step(0.4, h.w);
  g = mix(g, 0.12, skrob);
  float ovoj = max(membrana(d, px), membrana(d + 0.018, px));
  u.g = mix(u.g, mix(g, 0.8, ovoj), m);
  if (m > 0.5) { u.snov = S_KLOROPLAST; u.meja = min(u.meja, min(abs(d), abs(lv))); }
}

// Organeli v citoplazmi celice t (lokalni sistem celice, mreža 1,6 µm, 3×3 sosedov).
void organeli(inout U u, T t, vec2 p, float px) {
  Profil P = profil(t.tip);
  float ob = smoothstep(0.08, 0.3, t.meja) * smoothstep(0.05, 0.25, t.jedro);
  if (ob <= 0.0) return;
  vec4 hc = h42(t.cid + 0.37);
  vec2 q = rot(hc.x * 6.2832) * (p - t.cc);
  float G = 1.6;
  vec2 n = floor(q / G);
  U z = u;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 k = n + vec2(i, j);
    vec4 h = h42(k + t.cid * 13.1);
    vec2 c = (k + 0.25 + 0.5 * h.xy) * G;
    float w = h.z;
    vec2 lz = rot(h.w * 6.2832) * (q - c);
    float s = 0.0;
    if (w < (s += P.mito)) {
      float L = 0.25 + 0.6 * fract(h.x * 17.0);
      if (t.tip == C_MISICA) lz = rot(-h.w * 6.2832) * (q - c);
      mitohondrij(z, lz, L, 0.17 + 0.12 * fract(h.y * 9.0), h, px);
    } else if (w < (s += P.rer * 0.6)) {
      cisterne(z, lz, 0.55 + 0.4 * fract(h.y * 7.0), 3.0 + floor(3.0 * fract(h.x * 5.0)), 0.11, 1.0, 0.15 * (fract(h.x * 3.0) - 0.5), h, px);
    } else if (w < (s += P.golgi * 0.6)) {
      cisterne(z, lz, 0.4 + 0.2 * fract(h.y * 7.0), 4.0 + floor(3.0 * fract(h.x * 5.0)), 0.05, 0.0, 0.9, h, px);
    } else if (w < (s += P.gran * 0.5)) {
      zrno(z, lz, 0.12 + 0.2 * fract(h.y * 11.0), 0.62 + 0.25 * fract(h.x * 3.0), 1.0, px);
    } else if (w < (s += P.lip * 0.6)) {
      zrno(z, lz, 0.25 + 0.4 * fract(h.y * 11.0), 0.36, 0.0, px);
    } else if (t.tip == C_RASTLINSKA && w < s + 0.55) {
      kloroplast(z, rot(h.w * 2.0) * (q - c), vec2(1.1 + 0.4 * h.x, 0.42 + 0.12 * h.y), h, px);
    }
  }
  // drobni vezikli (v sinaptičnih končičih gosti sinaptični mehurčki ~40 nm)
  {
    bool sinapsa = t.tip == C_NEVRIT && hc.w < 0.35;
    float g2 = sinapsa ? 0.06 : 0.32;
    vec2 n2 = floor(q / g2);
    vec4 h = h42(n2 + t.cid * 3.3 + 0.5);
    if (h.z < (sinapsa ? 0.75 : 0.18)) zrno(z, q - (n2 + 0.25 + 0.5 * h.xy) * g2, sinapsa ? 0.02 : 0.025 + 0.025 * h.w, 0.22, 1.0, px);
  }
  // prosti ribosomi in glikogen
  {
    float g3 = 0.045;
    vec2 n3 = floor(q / g3);
    vec4 h = h42(n3 + t.cid * 5.7);
    float gostota = P.rib * 0.35;
    float vid = 1.0 - smoothstep(0.004, 0.012, px);
    float rib = step(h.z, gostota) * pokrij(length(q - (n3 + 0.2 + 0.6 * h.xy) * g3) - 0.0115, px) * vid;
    z.g = mix(z.g, 0.82, rib) + gostota * 0.12 * (1.0 - vid);
    if (rib > 0.5 && z.snov == S_CITO) z.snov = S_RIBOSOM;
    if (P.glik > 0.0) {
      float pol = smoothstep(0.55, 0.7, sum(q / 1.3 + t.cid));
      vec4 hg = h42(n3 + t.cid * 2.1 + 9.0);
      float gl = step(hg.z, P.glik * 0.7 * pol) * pokrij(length(q - (n3 + 0.2 + 0.6 * hg.xy) * g3) - 0.013, px) * vid;
      z.g = mix(z.g, 0.9, gl) + P.glik * pol * 0.1 * (1.0 - vid);
      if (gl > 0.5) z.snov = S_GLIKOGEN;
    }
  }
  // snopi keratinskih filamentov (keratinociti) in aktinskih (gladka mišica)
  if (P.kerat > 0.0) {
    vec2 kz = rot(hc.y * 3.14) * q;
    float pas = smoothstep(0.55, 0.75, sum(vec2(kz.x * 0.5, kz.y * 3.0) + hc.zw * 9.0));
    float nit = 0.5 + 0.5 * sin(kz.y * 900.0 + 3.0 * sum(kz * 8.0));
    float vid = 1.0 - smoothstep(0.004, 0.01, px);
    z.g += P.kerat * pas * (0.25 + 0.2 * mix(0.5, nit, vid));
    if (pas > 0.5 && z.snov == S_CITO) z.snov = S_KERATIN;
  }
  u.g = mix(u.g, z.g, ob);
  if (ob > 0.5) { u.snov = z.snov; u.meja = min(u.meja, z.meja); }
}

// Jedro: evkromatin, heterokromatin (ob ovojnici in v otočkih), jedrce, dvojna ovojnica s porami.
void jedroTEM(inout U u, T t, vec2 p, float px) {
  float d = t.jedro;
  if (d > 0.06 + px) return;
  vec2 q = p - t.jc;
  float m = pokrij(d, px);
  float het = smoothstep(0.58, 0.68, fbm(q / 0.35 + t.cid * 3.0, 3));
  het = max(het, smoothstep(-0.1, -0.03, d) * (0.6 + 0.4 * sum(q / 0.12)));
  float g = mix(0.28, 0.7, het) + 0.08 * (sumL(q, 0.02, px) - 0.5);
  vec4 h = h42(t.cid + 4.4);
  float jr = 1.5 + 2.0 * h.x;
  vec2 jo = (h.yz - 0.5) * 1.2;
  float jd = sdElipsa(q - jo, vec2(0.55, 0.45) * (0.8 + 0.5 * h.w)) + 0.06 * (sum(q / 0.1) - 0.5);
  float jm = pokrij(jd, px) * step(t.jedro, -0.6);
  g = mix(g, 0.75 + 0.1 * (sumL(q, 0.015, px) - 0.5), jm);
  // ovojnica: notranja (d = 0) in zunanja (d = 0,035) membrana, pore na ~0,12 µm, kjer se membrani stakneta
  float kot = atan(q.y, q.x) * length(q);
  float pora = smoothstep(0.012, 0.02, abs(fract(kot / 0.13 + h.x * 9.0) - 0.5) * 0.13);
  float ovoj = max(membrana(d, px), membrana(d - 0.035, px)) * pora;
  float vmes = pokrij(abs(d - 0.0175) - 0.0175, px) * pora;
  u.g = mix(u.g, g, m);
  u.g = mix(u.g, 0.22, vmes * (1.0 - m));
  u.g = mix(u.g, 0.82, ovoj);
  if (m > 0.5) { u.snov = jm > 0.5 ? S_JEDRCE : (het > 0.5 ? S_KROMATIN : S_JEDRO); }
  if (ovoj > 0.0 || abs(d) < 0.05) u.meja = min(u.meja, min(abs(d), abs(d - 0.035)));
}

// Snovi zunaj celic in posebne snovi celic.
void snovTEM(inout U u, T t, vec2 p, float px) {
  float s = t.snov;
  float vid = 1.0 - smoothstep(0.02, 0.05, px);     // vidna vlakenca (pri manjši povečavi povprečje)
  if (s == S_KOLAGEN || s == S_MINERAL) {
    float L = length(t.smer);
    vec2 sm = L > 0.01 ? t.smer / L : vec2(1, 0);
    vec2 z = mat2(sm.x, -sm.y, sm.y, sm.x) * p;
    // vzdolžno: vlakenca 60–100 nm s pasovi D = 67 nm; prečno: okrogli preseki
    float vz = 0.3;
    if (L > 0.5) {
      float w = 0.085;
      float i = floor(z.y / w);
      float v = (fract(z.y / w) - 0.5) * w;
      float ri = 0.026 + 0.012 * h12(vec2(i, 3.0));
      float vl = pokrij(abs(v) - ri, px);
      float d67 = 0.5 + 0.5 * cos(6.2832 * (z.x / 0.067 + h12(vec2(i, 9.0))));
      float pasovi = mix(0.5, d67, smoothstep(0.012, 0.004, px));
      vz = mix(0.12, 0.45 + 0.3 * pasovi, mix(0.65, vl, vid));
    } else {
      Vor v = vor(p, 0.07, vec2(1), 0.0, 0.7);
      float ri = 0.024 + 0.01 * h12(v.id);
      float vl = pokrij(v.d - ri, px);
      vz = mix(0.12, 0.55 + 0.1 * (sum(p / 0.01) - 0.5), mix(0.55, vl, vid));
    }
    if (s == S_MINERAL) {
      float igle = smoothstep(0.6, 0.85, sum(vec2(z.x * 25.0, z.y * 90.0) + 3.0));
      vz += 0.12 + 0.3 * mix(0.25, igle, vid);
    }
    u.g = vz;
  } else if (s == S_ERITROCIT) {
    u.g = 0.78 + 0.06 * (sumL(p, 0.02, px) - 0.5);
  } else if (s == S_LIPID) {
    u.g = 0.36 + 0.03 * (sumL(p, 0.3, px) - 0.5);
  } else if (s == S_MIOFIBRILA) {
    float L = length(t.smer);
    vec2 sm = L > 0.01 ? t.smer / L : vec2(1, 0);
    vec2 z = mat2(sm.x, -sm.y, sm.y, sm.x) * p;
    float x = t.r1;                                      // lega vzdolž vlakna (µm), sarkomera 2,2 µm
    float f = mod(x, 2.2) - 1.1;                         // 0 = črta M, ±1,1 = črta Z
    float a = abs(f);
    float g = 0.3;
    g = mix(g, 0.62, step(a, 0.8));                      // pas A (1,6 µm)
    g = mix(g, 0.5, step(a, 0.17));                      // pas H
    g = mix(g, 0.75, crta(f, 0.012, px));                // črta M
    g = mix(g, 0.88, crta(a - 1.1, 0.04, px));           // črta Z
    // meje miofibril (~1 µm) s sarkoplazemskim retiklom
    float v = (fract(z.y / 1.05 + 0.5 * sum(vec2(z.x * 0.1, 0.0))) - 0.5) * 1.05;
    float rez = crta(v, 0.035, px);
    g = mix(g, 0.18, rez);
    // filamenti: debeli (myozin) 15 nm, tanki (aktin) med njimi
    float fil = 0.5 + 0.5 * cos(6.2832 * z.y / 0.022);
    g += 0.12 * (fil - 0.5) * vid * (1.0 - rez);
    if (L < 0.5) g = 0.45 + 0.15 * mix(0.0, sum(p / 0.012) - 0.5, vid);
    u.g = g;
  } else if (s == S_MIELIN) {
    float pl = 0.5 + 0.5 * cos(6.2832 * t.r1 / 0.012);
    u.g = mix(0.55, 0.3 + 0.6 * pl, vid);
    u.meja = abs((fract(t.r1 / 0.012) - 0.5) * 0.012);
  } else if (s == S_MATRIKS) {
    u.g = 0.14 + 0.1 * sumL(p, 0.03, px) + 0.15 * smoothstep(0.7, 0.8, sumL(p, 0.012, px)) * vid;
  } else if (s == S_KERATIN) {
    u.g = 0.6 + 0.15 * (sumL(p * vec2(1.0, 4.0), 0.05, px) - 0.5);
  } else if (s == S_STENA) {
    float L = length(t.smer);
    vec2 sm = L > 0.01 ? t.smer / L : vec2(1, 0);
    float v = dot(p, vec2(-sm.y, sm.x));
    u.g = 0.3 + 0.12 * mix(0.5, 0.5 + 0.5 * sin(v * 600.0 + 4.0 * sum(p * 20.0)), vid) + 0.25 * crta(t.r1, 0.012, px);
  } else if (s == S_VAKUOLA) {
    u.g = 0.05 + 0.03 * sumL(p, 0.05, px);
  } else if (s == S_KOLOID) {
    u.g = 0.42 + 0.05 * (sumL(p, 0.08, px) - 0.5);
  } else if (s == S_PLAZMA) {
    u.g = 0.1 + 0.08 * sumL(p, 0.02, px);
  } else if (s == S_ELASTIN) {
    u.g = 0.3 + 0.08 * (sumL(p, 0.05, px) - 0.5);
  } else if (s == S_SLUZ) {
    u.g = 0.12 + 0.1 * smoothstep(0.5, 0.8, sumL(p, 0.03, px));
  } else if (s == S_SKLENINA) {
    float L = length(t.smer);
    vec2 sm = L > 0.01 ? t.smer / L : vec2(1, 0);
    vec2 z = mat2(sm.x, -sm.y, sm.y, sm.x) * p;
    u.g = 0.85 + 0.1 * mix(0.0, sum(vec2(z.x * 5.0, z.y * 60.0)) - 0.5, vid);
  } else if (s == S_KROMATIN) {
    u.g = 0.85 + 0.15 * (sumL(p, 0.03, px) - 0.5);       // zgoščeni kromosomi med delitvijo
  } else if (s == S_VIRUS) {
    u.g = 0.7 + 0.1 * (sumL(p, 0.01, px) - 0.5);
  } else if (s == S_PRAZNO) {
    u.g = 0.03 + 0.02 * sumL(p, 0.05, px);
  }
}

U ultra(T t, vec2 p, float px) {
  U u = U(0.25 + 0.08 * (sumL(p, 0.015, px) - 0.5), t.snov, 1e3);
  if (t.snov == S_KLOROPLAST) {
    // kloroplast, ki ga nariše preparat: središče t.jc, dolga os t.smer, polos t.r1 (µm)
    vec2 sm = length(t.smer) > 0.01 ? normalize(t.smer) : vec2(1.0, 0.0);
    u.g = 0.25;
    kloroplast(u, mat2(sm.x, -sm.y, sm.y, sm.x) * (p - t.jc), vec2(t.r1, 0.45 * t.r1), h42(t.cid + 3.0), px);
  } else if (t.snov == S_CITO || t.snov == S_JEDRO) {
    if (t.tip == C_ADIPOCIT) u.g = 0.36;
    organeli(u, t, p, px);
  } else {
    snovTEM(u, t, p, px);
  }
  if (t.jedro < 0.1) jedroTEM(u, t, p, px);
  // celična membrana
  if (t.meja < 0.05) {
    float m = membrana(t.meja, px);
    u.g = mix(u.g, 0.8, m);
    u.meja = min(u.meja, t.meja);
    if (m > 0.6) u.snov = S_MEMBRANA;
  }
#ifdef IMA_TEM_POSEBNO
  temPosebno(u, t, p, px);
#endif
  return u;
}
`;

// SEM (vrstični elektronski mikroskop): višina površine v µm iz snovi tkiva. Preparat je prelomljen in prevlečen z
// zlatom; celice so izbočene (prosto ležeče, npr. krvničke in bakterije, bolj kot celice v tkivu), svetline in
// posušena tekočina so nižje, vlakna so rebrasta. Posebne oblike doda preparat s semPosebno (#define IMA_SEM).
const SEM = /* glsl */ `
float semVisina(T t, vec2 p, float px) {
  float zrno = 0.004 * sumL(p, 0.012, px); // zlata prevleka, zrna ~10 nm
  if (t.snov == S_PRAZNO && t.meja > 100.0 && dot(t.dye, vec3(1.0)) < 0.08) return -1.6 + 0.15 * sumL(p, 40.0, px) + zrno; // stekelce
  float s = t.snov;
  // relief prelomne ploskve: približno samopodoben (višina raste z valovno dolžino), zato je tekstura vidna pri vsaki
  // povečavi; hrapavost je odvisna od snovi, zato se meje med tkivi vidijo kot stopnice
  float hr = s == S_KOLAGEN || s == S_ELASTIN ? 1.0 : s == S_MINERAL || s == S_SKLENINA ? 1.3 : s == S_KERATIN ? 0.8
    : s == S_MIOFIBRILA ? 0.7 : s == S_PLAZMA || s == S_KOLOID || s == S_SLUZ ? 0.15 : s == S_LIPID ? 0.25 : 0.5;
  float h = 0.7 * sumL(p, 70.0, px) + hr * (0.08 * sumL(p, 0.8, px) + 0.3 * sumL(p, 3.0, px) + 1.2 * sumL(p, 12.0, px) + 4.0 * sumL(p, 48.0, px));
#ifdef SEM_PROSTE
  float jama = 0.9;  // razmaz: plazma je tanka plast na stekelcu
#else
  float jama = 3.0;  // svetlina žile, žleze ali alveola je globoka jama v prelomu
#endif
  if (s == S_PLAZMA || s == S_SLUZ || s == S_PRAZNO) h -= jama;
  else if (s == S_VAKUOLA || s == S_KOLOID || s == S_LIPID) h -= 0.9;
#ifdef SEM_PROSTE
  // preparat s prosto ležečimi celicami (razmaz, kapljica): celice so kroglice na stekelcu
  bool prosta = t.tip == C_BAKTERIJA || t.tip == C_KVASOVKA || t.tip == C_LEVKOCIT || t.tip == C_LIMFOCIT || t.tip == C_PRAZIVAL;
#else
  bool prosta = false;
#endif
  if (s == S_ERITROCIT && t.meja < 100.0) {
    // dvojno vbočena ploščica (Evans in Fung 1972): debelina D/2 · √(1−x²)(0,207 + 2,003x² − 1,123x⁴)
    float r = length(p - t.cc);
    float R = max(t.meja + r, 0.5);
    float x = min(r / R, 1.0);
    return -0.9 + 0.5 * sumL(p, 70.0, px) + R * sqrt(max(1.0 - x * x, 0.0)) * (0.207 + 2.003 * x * x - 1.123 * x * x * x * x) + zrno;
  } else if (t.meja < 100.0 && prosta) {
    // prosta celica (bakterija, kvasovka, levkocit, pražival): krogla ali valj; od zunaj ne vidiš notranjosti
    // mikrobi (mikrob v celice.js) imajo v smer.x razdaljo do površine; meja je lahko do vakuole ali jedra
    bool mikr = t.tip == C_BAKTERIJA || t.tip == C_KVASOVKA;
    float dm = mikr ? -t.smer.x : t.meja;
    float W = t.tip == C_BAKTERIJA ? 0.5 : max(dm + length(p - t.cc), 0.3);
    float m = min(max(dm, 0.0), W);
    return -0.9 + 0.3 * sumL(p, 70.0, px) + 0.9 * sqrt(max(m * (2.0 * W - m), 0.0)) + 0.06 * sumL(p, 0.35, px) + zrno;
  } else if (t.meja < 100.0) {
    // celica v tkivu: blazinica, zaobljena ob robu (λ), med celicami žleb; jedro malo izbočeno
    float lam = 1.2;
    h += 0.8 * lam * (1.0 - exp(-max(t.meja, 0.0) / lam)) - 0.6;
    if (t.jedro < 0.0) h += 0.35 * smoothstep(0.0, 2.0, -t.jedro);
  }
  float ls = length(t.smer);
  if ((s == S_KOLAGEN || s == S_ELASTIN || s == S_MIOFIBRILA || s == S_MIELIN || s == S_KERATIN) && ls > 0.3) {
    vec2 sm = t.smer / ls;
    vec2 q = vec2(dot(p, vec2(-sm.y, sm.x)), dot(p, sm));
    // vlakna, snopi in snopi snopov; sumL dobi px v raztegnjenih koordinatah (prečno na vlakna)
    h += 0.35 * sumL(vec2(q.x * 3.0, q.y * 0.08), 0.5, 3.0 * px) + 1.0 * sumL(vec2(q.x * 0.5, q.y * 0.02), 1.0, 0.5 * px)
       + 3.0 * sumL(vec2(q.x * 0.08, q.y * 0.004), 1.0, 0.08 * px);
    h += 0.012 * cos(6.2832 * q.y / 0.067) * (1.0 - smoothstep(0.008, 0.02, px)); // 67-nm progavost kolagena
  } else if (s == S_KOLAGEN || s == S_ELASTIN) {
    h += 0.25 * sumL(p, 0.9, px);
  }
  if (s == S_MINERAL || s == S_SKLENINA) h += 0.5 * sumL(p, 2.5, px) + 0.15 * sumL(p, 0.3, px);
  if (s == S_STENA) h += 0.4;
  if (s == S_MIKROVIL) h += 0.4 * sumL(p, 0.12, px);
  if (s == S_VIRUS) h += 0.05;
#ifdef IMA_SEM
  semPosebno(h, t, p, px);
#endif
  return h + zrno;
}
`;

// Sestavi senčilnik preparata: osnove + koda preparata + TEM + SEM + glavni del (svetloba, TEM, SEM ali sonda).
export function fragmentPreparata(koda) {
  return `#version 300 es
${OSNOVE}
${koda}
${ULTRA}
${SEM}
uniform vec2 uRes;
uniform vec2 uCenter;      // središče vidnega polja na stekelcu (µm)
uniform float uPx;         // µm na slikovno točko
uniform int uNacin;        // 0 svetlobni mikroskop, 1 TEM, 2 sonda, 3 SEM
uniform vec2 uSonda[8];    // točke sonde (µm)
uniform mat3 uBarvila;     // stolpci: OD-vektor (R, G, B) prvega, drugega in tretjega barvila
uniform float uDebelina;   // jakost barvanja (debelina rezine)
out vec4 o;
void main() {
  if (uNacin == 2) {
    int i = int(gl_FragCoord.x);
    vec2 p = uSonda[min(i, 7)];
    T t = tkivo(p, 0.0005);
    U u = ultra(t, p, 0.0005);
    o = gl_FragCoord.y < 1.0 ? vec4(u.snov, u.meja, t.smer) : vec4(t.snov, t.tip, t.r1, t.jedro);
    return;
  }
  vec2 off = (gl_FragCoord.xy - 0.5 * uRes) * uPx;
  vec2 p = uCenter + off;
  T t = tkivo(p, uPx);
  if (uNacin == 1) {
    U u = ultra(t, p, uPx);
    o = vec4(vec3(exp(-2.0 * clamp(u.g, 0.0, 1.5))), 1.0);
  } else if (uNacin == 3) {
    // SEM: sekundarni elektroni. Več jih uide s strmih ploskev in robov (1/cos θ), detektor ob strani da senco.
    float e = uPx;
    float h0 = semVisina(t, p, uPx);
    float h1 = semVisina(tkivo(p + vec2(e, 0.0), uPx), p + vec2(e, 0.0), uPx);
    float h2 = semVisina(tkivo(p + vec2(0.0, e), uPx), p + vec2(0.0, e), uPx);
    vec3 n = normalize(vec3(h0 - h1, h0 - h2, e));
    float strmo = clamp(1.0 / max(n.z, 0.05) - 1.0, 0.0, 3.0);
    float det = dot(n, normalize(vec3(-0.45, 0.55, 0.7)));
    float g = 0.16 + 0.17 * strmo + 0.42 * det;
    g *= mix(0.45, 1.0, smoothstep(-1.5, -0.7, h0)); // stekelce med celicami je temnejše
    o = vec4(vec3(clamp(g, 0.0, 1.0)), 1.0);
  } else {
    vec3 od = uBarvila * t.dye * uDebelina;
    o = vec4(exp(-od), 1.0);
  }
}`;
}
