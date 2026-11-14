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
// Jedro gladke mišične celice (vzdolžni rez): podolgovato kot cigara, z zaobljenimi konci, rahlo ukrivljeno in različno
// nagnjeno; v skrčenih celicah nagubano kot zamašek (pri pravih preparatih nikoli ravne enake črtice)
float jedroGladke(vec2 q, float L, float r, vec4 h) {
  vec4 g = fract(h * vec4(7.31, 13.7, 5.13, 11.9) + h.yzwx * 3.7);   // neodvisno od izbire jedra in dolžine pri klicatelju
  q = rot(0.18 * (g.x - 0.5)) * q;
  q.y -= 0.012 * (g.y - 0.5) * q.x * q.x;
  q.y -= step(0.8, g.z) * 0.3 * sin(q.x * 1.7);
  float t = clamp(abs(q.x) / (L + r), 0.0, 1.0);
  return sdKapsula(q, L, r * (1.0 - 0.35 * t * t)) + 0.12 * (sum(q * 1.4 + h.zw * 9.0) - 0.5);
}
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
#define S_GENOM 31.0      // genom v virusu (le za sloj molekul: DNK faga T4, RNK SARS-CoV-2 in HIV)
#define S_GER 32.0        // gladki endoplazemski retikulum (mreža cevk brez ribosomov)

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
  // meje celic niso ravnilo: širina celic niha, meje so rahlo nagnjene in vijugajo z globino
  float sw = s + w * 0.6 * (sum(vec2(s / (2.3 * w), d / (1.6 * max(H, 4.0))) + seme * 7.0) - 0.5);
  float i = floor(sw / w);
  vec4 h = h42(vec2(i, 0.0) + seme);
  float ls = (fract(sw / w) - 0.5) * w;
  t.snov = S_CITO; t.tip = tip; t.cid = vec2(i, 0.0) + seme;
  t.meja = min(min(0.5 * w - abs(ls), d), H - d);
  t.cc = p + os * (d - 0.5 * H) - vec2(-os.y, os.x) * ls;
  t.dye = vec3(0.07, (0.4 + 0.08 * (sumL(vec2(s, d), 3.0, px) - 0.5)) * (0.9 + 0.2 * h.y), 0.0);
  // meje so tanke in mestoma neopazne
  t.dye.y -= 0.09 * crta(0.5 * w - abs(ls), 0.2, px) * smoothstep(0.3, 0.6, sum(vec2(s / 4.0, d / 5.0) + seme * 3.0));
  // jedra niso v ravni vrsti: pri visokih celicah se višina precej razlikuje, nekatera so prerezana le ob robu
  vec2 q = vec2(ls - (h.y - 0.5) * 0.15 * w, d - jd * H - (h.x - 0.5) * min(H * 0.28, 6.0));
  float zr = h.w < 0.18 ? 0.65 : 1.0;
  vec2 r = zr * vec2(min(0.32 * w, 3.0), clamp(0.22 * H, 0.32 * w, 6.5));
  float dj = sdElipsa(q, r) + 0.15 * (sum(q * 1.2 + h.zw * 9.0) - 0.5);
  t.jedro = dj;
  t.jc = t.cc + os * (jd * H - 0.5 * H);
  float jk = pokrij(dj, px);
  t.dye.x = mix(t.dye.x, (zr < 1.0 ? 0.6 : 0.85) * kromatin(q, h.zw, px), jk);
  if (jk > 0.5) t.snov = S_JEDRO;
  return t;
}

// Vrčasta celica v epiteliju (d globina od površine, s lega vzdolž nje, H višina epitelija, w širina celice): svetel
// kelih s penasto sluzjo nad jedrom, ozek vrat proti svetlini, obdan s tankim rožnatim robom (stisnjene sosednje celice).
// Delež celic »delez«. Vrne true in nastavi t, če je točka v kelihu.
bool vrcasta(inout T t, float d, float s, float H, float w, float delez, vec2 seme, float px) {
  // isti (vijugasti) stolpec kot epitel(), da vrč ne seka sosednjih celic
  float sw = s + w * 0.6 * (sum(vec2(s / (2.3 * w), d / (1.6 * max(H, 4.0))) + seme * 7.0) - 0.5);
  float i = floor(sw / w);
  vec4 h = h42(vec2(i, 0.0) + seme);
  if (h.z >= delez) return false;
  float lsv = (fract(sw / w) - 0.5) * w;
  float sir = min(0.5 * w * (0.85 + 0.25 * h.y), 0.48 * w);
  float vis = min(H * 0.25, 8.0);
  float dk = sdElipsa(vec2(lsv, d - H * 0.32), vec2(sir, vis));
  if (d < H * 0.1) dk = max(dk, abs(lsv) - 0.16 * w);
  // ozek vrat od površine do vrha vrča, skozi katerega se sluz izliva
  dk = min(dk, max(max(abs(lsv) - 0.16 * w, -d), d - (H * 0.32 - vis) - 0.5));
  if (dk >= 0.0) return false;
  t = prazno();
  t.snov = S_SLUZ; t.tip = C_ZLEZNA; t.cid = vec2(i, 0.0) + seme;
  t.meja = -dk;
  t.cc = vec2(i * w, 0.0); t.jc = t.cc;
  float pena = sumL(vec2(s, d) + h.zw * 20.0, 0.7, px);
  t.dye = vec3(0.16 + 0.16 * smoothstep(0.45, 0.8, pena), 0.06 + 0.04 * pena, 0.0);
  t.dye.y += 0.3 * crta(dk, 0.35, px);
  return true;
}

// Prečni prerez cevke (žleza, ledvična cevka, folikel): svetlina polmera rl, epitelij do polmera R. q glede na središče.
T cevka(vec2 q, float rl, float R, float w, float jd, float tip, vec2 seme, vec2 p, float px) {
  float r = length(q);
  if (r < rl) { T t = prazno(); t.dye = vec3(0.0, 0.03, 0.0); return t; }
  float ref = 0.5 * (rl + R);
  return epitel(r - rl, atan(q.y, q.x) * ref, max(R - rl, 2.0), w, jd, tip, seme, p, q / max(r, 1e-3), px);
}

// Prerez zvitih cevastih žlez (želodec, žleze v podsluznici …): tesno zloženi profili (Voronoi velikosti s µm,
// raztegnjen za a, zasukan za kot), vsak profil je cevka iz ene plasti celic okoli ozke svetline; med profili tanka
// lamina proprija (rez µm). Celice so razporejene po obodu, enakomerno po dolžini oboda (širina w µm), in segajo od
// svetline do baze. Specimen sam odloči, kakšna je celica (P.hc), jedro postavi s profilJedro (f: 0 svetlina, 1 baza).
struct Prof { bool v; vec2 id; vec4 h; float rob; float rr; vec2 c; mat2 R; vec2 ax; float Rs; float tc; vec4 hc; vec2 cid; float lat; };
Prof profil(vec2 p, float s, vec2 a, float kot, float rez, float w, float seme) {
  Prof P;
  vec2 z = p + 0.35 * s * (vec2(fbm(p / (1.7 * s) + seme, 2), fbm(p / (1.7 * s) + seme + 5.0, 2)) - 0.5) * 2.0;
  Vor v = vor(z, s, a, kot, 0.9);
  P.id = v.id; P.h = h42(v.id + seme);
  P.rob = v.rob - rez * (0.5 + 1.0 * P.h.w) - 0.6 * rez * (sum(p / 11.0 + seme) - 0.5);
  P.v = P.rob > 0.0;
  P.c = v.c; P.R = rot(kot);
  P.ax = a / min(a.x, a.y);
  vec2 qs = (P.R * (z - v.c)) / P.ax;                  // v tem prostoru je profil približno krog
  float rq = length(qs);
  P.Rs = rq + max(P.rob, 0.0) + 1e-3;
  P.rr = rq / P.Rs;
  // dolžina loka elipse s polosema A, B: s(t) ≈ (A+B)/2·t + (B−A)/4·sin 2t
  float A = P.Rs * P.ax.x, B = P.Rs * P.ax.y;
  float t = atan(qs.y, qs.x);
  float O = 3.1416 * (A + B);
  float sl = 0.5 * (A + B) * t + 0.25 * (B - A) * sin(2.0 * t) + 0.5 * O;
  float n = max(5.0, floor(O / w + 0.5));
  float u = sl / O * n + 0.15 * (sum(vec2(P.rr * 2.0, P.h.x * 9.0 + t)) - 0.5);
  float i = mod(floor(u), n);
  P.lat = (0.5 - abs(fract(u) - 0.5)) * O / n;
  P.cid = vec2(i, 0.0) + 7.0 * v.id; P.hc = h42(P.cid + seme);
  // kot sredine celice (obrat s(t) z eno Newtonovo iteracijo)
  float sc = (i + 0.5) / n * O - 0.5 * O;
  float tc = sc / (0.5 * (A + B));
  tc -= (0.5 * (A + B) * tc + 0.25 * (B - A) * sin(2.0 * tc) - sc) / (0.5 * (A + B) + 0.5 * (B - A) * cos(2.0 * tc));
  P.tc = tc;
  return P;
}
// Točka na osi celice profila pri deležu f (0 svetlina, 1 baza), v µm.
vec2 profilTocka(Prof P, float f) {
  return P.c + transpose(P.R) * (vec2(cos(P.tc), sin(P.tc)) * f * P.Rs * P.ax);
}
// Razdalja do jedra (polosi r: r.x radialno, r.y po obodu) na deležu f; vrne (razdalja, q za kromatin).
vec3 profilJedro(Prof P, vec2 p, float f, vec2 r) {
  vec2 q = p - profilTocka(P, f);
  vec2 o = transpose(P.R) * normalize(vec2(cos(P.tc), sin(P.tc)) / P.ax);   // normala oboda (radialna smer)
  vec2 ql = vec2(dot(q, o), dot(q, vec2(-o.y, o.x)));
  float d = sdElipsa(ql, r) + 0.12 * (sum(ql * 1.4 + P.hc.zw * 9.0) - 0.5);
  return vec3(d, ql);
}

// Acinusi žleze, tesno zloženi (Voronoi, velikost s µm): piramidne celice okoli majhne svetline. serozni 1 = serozni
// (bazalno vijolična citoplazma, okroglo jedro, ob svetlini rožnata zrnca zimogena), 0 = mukozni (svetla penasta
// citoplazma, jedro sploščeno ob bazi, večja svetlina), < 0 = mešana. Med acinusi tanka vezivna reža. Vrne T (S_CITO/S_JEDRO/S_SLUZ).
T acinus(vec2 p, float s, float serozni, float seme, float px) {
  T t = prazno();
  Vor v = vor(p + 0.25 * s * (vec2(sum(p / (2.0 * s) + seme), sum(p / (2.0 * s) + seme + 4.0)) - 0.5), s, vec2(1.0), seme, 0.85);
  vec4 ha = h42(v.id + seme);
  float rez = 0.3 + 0.45 * ha.w;
  float rp = smoothstep(0.35, 0.6, sum(p / 9.0 + seme));                 // reža je mestoma odprta, drugod le rožnata črta
  if (v.rob < rez) { t.snov = S_KOLAGEN; t.dye = vec3(0.03, mix(mix(0.34, 0.16, rp), 0.3, smoothstep(0.4, 1.4, px)), 0.0); return t; }
  if (serozni < 0.0) serozni = step(0.6, ha.y);                          // mešana žleza: posamezni acinusi so serozni
  vec2 c = v.c + 0.12 * s * (ha.xy - 0.5);
  vec2 q = p - c;
  float rq = length(q);
  float rr = rq / (rq + v.rob);                                 // 0 v svetlini, 1 ob bazi
  float rl = mix(0.2, 0.05 * step(ha.z, 0.35), serozni) * (0.7 + 0.6 * ha.z);
  if (rr < rl) { t.snov = serozni > 0.5 ? S_PLAZMA : S_SLUZ; t.dye = vec3(0.04 * (1.0 - serozni), 0.06, 0.0); return t; }
  float n = max(5.0, floor(6.283 * (rq + v.rob) * 0.6 / 8.5 + 0.5));
  float a = atan(q.y, q.x) / 6.283 + 0.5 + 0.08 * (sum(vec2(rr * 2.0, ha.x * 9.0)) - 0.5);
  float i = floor(a * n);
  vec4 h = h42(vec2(i, 0.0) + v.id * 7.0 + seme);
  float ac = (i + 0.5) / n * 6.283 - 3.1416;
  vec2 smer = vec2(cos(ac), sin(ac));
  t.snov = S_CITO; t.tip = C_ZLEZNA; t.cid = vec2(i, 0.0) + v.id * 7.0;
  t.meja = min(v.rob - rez, 6.283 * rq / n * (0.5 - abs(fract(a * n) - 0.5)));
  float Rb = rq + v.rob;
  t.cc = c + smer * Rb * 0.6; t.jc = c + smer * Rb * (serozni > 0.5 ? 0.72 : 0.9);
  float meja = crta(t.meja, 0.18, px);
  if (serozni > 0.5) {
    // bazalno bazofilna (zrnati ER), apikalno eozinofilna zrnca zimogena
    float baz = smoothstep(0.45, 0.7, rr);
    t.dye = vec3(0.08 + 0.3 * baz, 0.3 + 0.08 * sumL(p, 1.5, px), 0.0);
    vec4 z = krogci(p, 1.2, 0.38, 0.55, 0.9 * (1.0 - smoothstep(0.38, 0.58, rr)), seme + 3.0);
    if (z.x < 0.0) t.dye = mix(t.dye, vec3(0.03, 0.72, 0.0), pokrij(z.x, px));
    t.dye.y += 0.25 * (1.0 - baz) * smoothstep(0.6, 1.2, px);   // zrnca pri majhni povečavi kot rožnat pas
  } else {
    float pena = sumL(p + ha.xy * 30.0, 0.8, px);
    t.dye = vec3(0.17 + 0.12 * smoothstep(0.4, 0.75, pena), 0.1 + 0.05 * pena, 0.0);
    t.snov = S_SLUZ;
  }
  t.dye.y += 0.12 * meja;
  // jedro: seroznim okroglo nad bazo, mukoznim sploščeno ob bazi
  vec2 qj = vec2(dot(p - t.jc, smer), dot(p - t.jc, vec2(-smer.y, smer.x)));
  qj.y -= 0.6 * (h.y - 0.5) * 6.283 * rq / n * 0.4;
  float dj = serozni > 0.5 ? sdElipsa(qj, vec2(2.6, 2.4) * (0.9 + 0.2 * h.x)) : sdElipsa(qj, vec2(1.0, 3.2));
  dj += 0.15 * (sum(qj * 1.3 + h.zw * 9.0) - 0.5);
  t.jedro = dj;
  float jk = pokrij(dj, px) * step(0.12, h.w);
  t.dye.x = mix(t.dye.x, 1.05 * kromatin(qj, h.zw, px), jk);
  t.dye.y *= 1.0 - 0.5 * jk;
  if (jk > 0.5) t.snov = S_JEDRO;
  return t;
}

// Večskladni ploščati epitelij: d = globina od površine (0..H). Celice so bazalno majhne in temne, proti površini
// ploščate; rozen = poroženevajoč (koža): vrhnja plast brez jeder, pod njo zrnati sloj.
T vecskladni(float d, float s, float H, float rozen, vec2 seme, float px) {
  T t = prazno();
  float f = clamp(d / H, 0.0, 1.0);                // 0 površina, 1 bazalno
  // višina celic hc raste od 1,6 µm na površini do 8 µm v spodnji polovici (trnasti in bazalni sloj sta mnogokotna)
  float g = min(f / 0.45, 1.0);
  float hc = 1.6 + 6.4 * g;
  float K = 0.45 * H / 6.4;
  float D1 = K * log(5.0);
  float D = f < 0.45 ? K * log(1.0 + 4.0 * g) : D1 + (f - 0.45) * H / 8.0;   // ∫ dd / hc: število plasti od površine
  // celice v plasteh (meje plasti so valovite); širina celic v plasti je stalna, zato se celice ne pahljačasto
  // raztegnejo daleč od izhodišča
  float Dw = D * 0.95 + 0.3 * (sum(vec2(s / 12.0, D * 0.7) + seme) - 0.5) + 0.25 * (sum(vec2(s / 4.5, D * 1.3) + seme + 3.0) - 0.5);
  float j = floor(Dw);
  float Dc = (j + 0.5) / 0.95;
  float fj = clamp(Dc < D1 ? 0.45 * (exp(Dc / K) - 1.0) / 4.0 : 0.45 + (Dc - D1) * 8.0 / H, 0.0, 1.0);
  float gj = min(fj / 0.45, 1.0);
  float sc = mix(26.0, 10.0, gj) * (1.0 - 0.15 * smoothstep(0.85, 1.0, fj)), hcj = 1.6 + 6.4 * gj;
  vec4 hr = h42(vec2(j, 0.0) + seme);
  float xx = s / sc + hr.x * 9.0 + 0.35 * (sum(vec2(s / (2.0 * sc), j * 1.7) + seme) - 0.5) + 0.3 * (sum(vec2(s / sc, Dw * 1.1) + seme + 6.0) - 0.5);
  float i = floor(xx);
  vec4 h = h42(vec2(i, j) + seme);
  t.snov = S_CITO; t.tip = C_KERATINOCIT; t.cid = vec2(i, j) + seme;
  t.meja = min((0.5 - abs(fract(xx) - 0.5)) * sc, (0.5 - abs(fract(Dw) - 0.5)) * hcj);
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
  vec2 q = vec2((fract(xx) - 0.5 - 0.2 * (h.x - 0.5)) * sc, (fract(Dw) - 0.5 - 0.15 * (h.y - 0.5)) * hcj);
  vec2 r = vec2(min(mix(5.0, 3.0, g), 0.34 * sc), min(mix(1.2, 2.8, g), 0.42 * hcj)) * (0.9 + 0.2 * h.z);
  float dj = sdElipsa(q, r) + 0.2 * (sum(q + h.zw * 9.0) - 0.5);
  t.jedro = dj;
  t.cc = -q; t.jc = -q;                            // odmik središča v (s, d); vSvet ga prenese v ravnino rezine
  // brez poroženevanja imajo jedra tudi najvišje (sploščene) celice; pri koži jih poroženela plast nima
  float jk = pokrij(dj, px) * mix(1.0, step(0.15, f), rozen) * step(0.08, h.w);
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

// Snopi kolagena v HE (eozin): podolgovati valoviti snopi širine ~w, večinoma v smeri os, prepleteni z drugo družino
// snopov pod kotom; med njimi svetle reže (skrčki ob pripravi). rahl 0 = gosto vezivo, 1 = rahlo (veliko praznega).
// Vrne vec2(gostota eozina, reža 0..1).
vec2 kolagen(vec2 p, vec2 os, float w, float gost, float rahl, float seme, float px) {
  vec2 z = p + 3.0 * w * (vec2(fbm(p / (10.0 * w) + seme, 2), fbm(p / (10.0 * w) + seme + 5.0, 2)) - 0.5) * 2.0;
  vec2 a = vec2(dot(z, os), dot(z, vec2(-os.y, os.x)));
  float f = fbm(vec2(a.x / (5.0 * w), a.y / (1.4 * w)) + seme, 2);
  float g2 = sum(vec2(a.x / (3.0 * w), a.y / w) + seme + 9.0);
  // reže so valovite izočrte (več ravni) zvitega raztegnjenega šuma, mestoma prekinjene; v rahlem vezivu so široke
  float iz = abs(fract(f * 5.0 + 0.5) - 0.5) / 5.0;
  float sir = 0.012 + 0.03 * rahl;
  float reza = smoothstep(sir, 0.35 * sir, iz) * smoothstep(0.35 - 0.2 * rahl, 0.5 - 0.2 * rahl, g2);
  // rahlo vezivo: tanka valovita vlakna (izočrte med režami) na svetli podlagi, mestoma snopiči
  float rahlo = 0.75 * smoothstep(0.5, 0.95, rahl);
  if (rahlo > 0.0) {
    float iz2 = abs(fract(f * 7.0 + 0.25) - 0.5) / 7.0;
    float fib = smoothstep(0.022, 0.007, iz2) * (0.55 + 0.45 * smoothstep(0.3, 0.6, g2));
    fib = max(fib, 0.8 * smoothstep(0.6, 0.7, fbm(vec2(a.x / (4.0 * w), a.y / (0.9 * w)) + seme + 3.0, 2)));
    reza = mix(reza, (1.0 - fib) * (0.62 + 0.38 * smoothstep(0.45, 0.75, g2)), rahlo);
  }
  reza = mix(reza, 0.3 * rahl + 0.35 * rahlo, smoothstep(0.15 * w, 0.6 * w, px));   // pri majhni povečavi se reže zabrišejo
  float vlak = sum(vec2(a.x / 6.0, a.y / 0.7) + seme);                        // fina vlakenca v snopu
  vlak = mix(vlak, 0.5, smoothstep(0.3, 0.8, px));
  float g = gost * (0.85 + 0.3 * f) + 0.07 * (vlak - 0.5);
  return vec2(g * (1.0 - 0.82 * reza), reza);
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

struct Profil { float mito; float rer; float golgi; float gran; float rib; float glik; float lip; float kerat; float ser; };
Profil profil(float tip) {
  if (tip == C_HEPATOCIT) return Profil(0.55, 0.35, 0.1, 0.12, 0.5, 0.8, 0.06, 0.0, 0.55);
  if (tip == C_FIBROBLAST) return Profil(0.18, 0.55, 0.15, 0.05, 0.4, 0.0, 0.02, 0.0, 0.04);
  if (tip == C_LIMFOCIT) return Profil(0.12, 0.05, 0.03, 0.04, 0.9, 0.0, 0.0, 0.0, 0.02);
  if (tip == C_NEVRON) return Profil(0.4, 0.55, 0.15, 0.08, 0.6, 0.0, 0.0, 0.0, 0.1);
  if (tip == C_ZLEZNA) return Profil(0.25, 0.6, 0.2, 0.45, 0.5, 0.0, 0.0, 0.0, 0.08);
  if (tip == C_RASTLINSKA) return Profil(0.15, 0.1, 0.06, 0.0, 0.3, 0.0, 0.03, 0.0, 0.06);
  if (tip == C_RESICE) return Profil(0.5, 0.2, 0.12, 0.08, 0.4, 0.0, 0.03, 0.0, 0.15);
  if (tip == C_KERATINOCIT) return Profil(0.12, 0.08, 0.04, 0.05, 0.4, 0.0, 0.0, 0.7, 0.03);
  if (tip == C_GLIJA) return Profil(0.2, 0.2, 0.06, 0.05, 0.4, 0.0, 0.0, 0.0, 0.06);
  if (tip == C_KVASOVKA) return Profil(0.2, 0.15, 0.05, 0.0, 0.7, 0.3, 0.1, 0.0, 0.06);
  if (tip == C_PRAZIVAL) return Profil(0.3, 0.15, 0.08, 0.3, 0.5, 0.0, 0.08, 0.0, 0.06);
  if (tip == C_GLADKA) return Profil(0.2, 0.05, 0.03, 0.0, 0.2, 0.05, 0.0, 0.35, 0.1);
  if (tip == C_ADIPOCIT) return Profil(0.1, 0.05, 0.02, 0.0, 0.2, 0.0, 0.0, 0.0, 0.4); // gladki ER v pasu citoplazme (izdelava maščob)
  if (tip == C_LEVKOCIT) return Profil(0.12, 0.1, 0.05, 0.6, 0.4, 0.15, 0.0, 0.0, 0.03);
  if (tip == C_MISICA) return Profil(0.6, 0.0, 0.0, 0.0, 0.2, 0.3, 0.05, 0.0, 0.0);
  if (tip == C_NEVRIT) return Profil(0.35, 0.0, 0.0, 0.0, 0.05, 0.0, 0.0, 0.0, 0.0);
  if (tip == C_BAKTERIJA) return Profil(0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0);
  return Profil(0.3, 0.25, 0.1, 0.1, 0.45, 0.0, 0.03, 0.0, 0.06);
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

// Gladki endoplazemski retikulum: gosta mreža razvejanih in povezanih cevk (premer ~40–50 nm) brez ribosomov, v delih
// citoplazme (ob = delež). Največ ga je v hepatocitih (ob glikogenu: razstrupljanje, presnova glikogena) in v celicah, ki
// izdelujejo steroide ali lipide. Cevke so dve prepleteni izočrti šuma, zato se stikajo kot v pravi mreži.
// razdalja (v enotah x) do izočrte šuma sum(x) = 0,5 (deljeno z naklonom, da so cevke povsod enako široke)
float izocrta(vec2 x) {
  vec2 e = vec2(0.02, 0.0);
  vec2 g = vec2(sum(x + e) - sum(x - e), sum(x + e.yx) - sum(x - e.yx)) / 0.04;
  return abs(sum(x) - 0.5) / max(length(g), 0.08);
}
// vrne bližino cevki (0..1): tam ni prostih ribosomov ali glikogena, sicer bi bil videti kot zrnati ER
float gladkiER(inout U u, vec2 q, float ob, vec2 cid, float px) {
  if (ob <= 0.0) return 0.0;
  float s = 0.22;
  vec2 o = fract(cid * 0.0137) * 97.0; // zamik šuma po celici (majhna števila: natančnost float)
  float d = min(izocrta(q / s + o) * s, izocrta(q / (0.8 * s) + o.yx + 11.3) * 0.8 * s);
  float sir = 0.022;
  float lumen = pokrij(d - sir, px) * ob;
  float mem = membrana(d - sir, px) * ob;
  u.g = mix(mix(u.g, 0.14, lumen), 0.78, mem);
  if (lumen > 0.5) u.snov = S_GER;
  if (mem > 0.0) u.meja = min(u.meja, abs(d - sir));
  return ob * (1.0 - smoothstep(sir, sir + 0.016, d));
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
  // gladki ER v delih citoplazme brez drugih organelov (v hepatocitu skupaj z glikogenom)
  float obCevki = 0.0;
  if (P.ser > 0.0 && z.snov == S_CITO) {
    float pol = t.tip == C_HEPATOCIT ? smoothstep(0.5, 0.62, sum(q / 1.3 + t.cid)) : smoothstep(0.78 - 0.5 * P.ser, 0.86 - 0.5 * P.ser, sum(q / 1.1 + t.cid * 1.7 + 5.0));
    obCevki = gladkiER(z, q, pol, t.cid, px);
  }
  // prosti ribosomi in glikogen (ne v svetlini gladkega ER)
  {
    float zun = z.snov == S_GER ? 0.0 : 1.0 - step(0.5, obCevki);
    float g3 = 0.045;
    vec2 n3 = floor(q / g3);
    vec4 h = h42(n3 + t.cid * 5.7);
    float gostota = P.rib * 0.35;
    float vid = 1.0 - smoothstep(0.004, 0.012, px);
    float rib = step(h.z, gostota) * pokrij(length(q - (n3 + 0.2 + 0.6 * h.xy) * g3) - 0.0115, px) * vid * zun;
    z.g = mix(z.g, 0.82, rib) + gostota * 0.12 * (1.0 - vid);
    if (rib > 0.5 && z.snov == S_CITO) z.snov = S_RIBOSOM;
    if (P.glik > 0.0) {
      float pol = smoothstep(0.55, 0.7, sum(q / 1.3 + t.cid));
      vec4 hg = h42(n3 + t.cid * 2.1 + 9.0);
      float gl = step(hg.z, P.glik * 0.7 * pol) * pokrij(length(q - (n3 + 0.2 + 0.6 * hg.xy) * g3) - 0.013, px) * vid * zun;
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
    // meje miofibril (~1 µm): ozka sarkoplazma s sarkoplazemskim retiklom (gladki ER: cevka vzdolž reže) in pri skeletni
    // mišici triade ob prehodu A–I (T-cevka, uvihana membrana, med dvema končnima cisternama), pri srčni diade ob črti Z
    float v = (fract(z.y / 1.05 + 0.5 * sum(vec2(z.x * 0.1, 0.0))) - 0.5) * 1.05;
    float rez = crta(v, 0.035, px);
    g = mix(g, 0.18, rez);
#ifdef DIADE_PRI_Z
    float dxT = a - 1.1;
    float cist = length(vec2(dxT + 0.05, v) / vec2(0.028, 0.05)) - 1.0;
#else
    float dxT = a - 0.8;
    float cist = length(vec2(abs(dxT) - 0.05, v) / vec2(0.028, 0.05)) - 1.0;
#endif
    float srD = min(abs(v) - 0.016 * (1.0 + 0.3 * sin(z.x * 11.0)), cist * 0.028);
    float tD = length(vec2(dxT, v)) - 0.018;
    float srL = pokrij(srD, px) * step(0.0, tD), tL = pokrij(tD, px);
    float srM = membrana(srD, px) * step(0.0, tD), tM = membrana(tD, px);
    float rv = (1.0 - smoothstep(0.006, 0.02, px)); // pod ~150 000× se vidi le svetla reža
    g = mix(g, 0.14, srL * rv);
    g = mix(g, 0.36, tL * rv);
    g = mix(g, 0.78, max(srM, tM) * rv);
    if (srL > 0.5) u.snov = S_GER;
    if (tM > 0.5) u.snov = S_MEMBRANA;
    u.meja = min(u.meja, min(abs(srD), abs(tD)));
    // filamenti: debeli (myozin) 15 nm, tanki (aktin) med njimi
    float fil = 0.5 + 0.5 * cos(6.2832 * z.y / 0.022);
    g += 0.12 * (fil - 0.5) * vid * (1.0 - rez) * (1.0 - srL) * (1.0 - tL);
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
    h += 0.012 * cos(6.2832 * fract(q.y / 0.067)) * (1.0 - smoothstep(0.008, 0.02, px)); // 67-nm progavost kolagena (fract: cos velikega argumenta je na nekaterih GPE netočen)
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

// Senčenje SEM v main(): sekundarni elektroni iz višine površine (semVisina) v točki in dveh sosednjih točkah.
const SEM_SENCENJE = /* glsl */ ` else if (uNacin == 3) {
    // SEM: sekundarni elektroni. Več jih uide s strmih ploskev in robov (1/cos θ), detektor ob strani da senco.
    float e = 1.5 * uPx;                              // korak 1,5 točke: robni učinek je mehak pas, ne nazobčana črta
    float h0 = semVisina(t, p, uPx);
    float h1 = semVisina(tkivo(p + vec2(e, 0.0), uPx), p + vec2(e, 0.0), uPx);
    float h2 = semVisina(tkivo(p + vec2(0.0, e), uPx), p + vec2(0.0, e), uPx);
    vec3 n = normalize(vec3(h0 - h1, h0 - h2, e));
    float strmo = clamp(1.0 / max(n.z, 0.05) - 1.0, 0.0, 3.0);
    float det = dot(n, normalize(vec3(-0.45, 0.55, 0.7)));
    float g = 0.16 + 0.17 * strmo + 0.42 * det;
    g *= mix(0.45, 1.0, smoothstep(-1.5, -0.7, h0)); // stekelce med celicami je temnejše
    o = vec4(vec3(clamp(g, 0.0, 1.0)), 1.0);
  }`;

// Sestavi senčilnik preparata: osnove + koda preparata + TEM + glavni del (svetloba, TEM ali sonda). SEM (sem: true) je
// ločen program, ki ga upodobi.js prevede šele ob prvem izrisu SEM: trikratni tkivo() bi sicer podaljšal prevajanje
// vsakega preparata in (pri programskem izrisu brez GPE) upočasnil tudi svetlobni mikroskop.
export function fragmentPreparata(koda, { sem = false } = {}) {
  return `#version 300 es
${OSNOVE}
${koda}
${ULTRA}
${sem ? SEM : ""}
uniform vec2 uRes;
uniform vec2 uCenter;      // središče vidnega polja na stekelcu (µm)
uniform float uPx;         // µm na slikovno točko
uniform int uNacin;        // 0 svetlobni mikroskop, 1 TEM, 2 sonda, 3 SEM (le v programu SEM)
uniform int uSondaZvij;    // sonda: 1 = vrstica tkiva z zvijanjem rezine (svetlobni, SEM), 0 = brez (TEM, kot slika)
uniform vec2 uSonda[8];    // točke sonde (µm)
uniform mat3 uBarvila;     // stolpci: OD-vektor (R, G, B) prvega, drugega in tretjega barvila
uniform float uDebelina;   // jakost barvanja (debelina rezine)
uniform int uSS;           // vzorcev na slikovno točko (svetlobni mikroskop): 1 ali 4
out vec4 o;
// Resnični videz (j, 13. 11. 2026): v naravi ni popolnih črt. Rahlo zvijanje ravnine (~3,5 % valovne dolžine na treh
// merilih: 40, 10 in 2,5 µm) vzame strukturam risarsko pravilnost; ista funkcija velja za sliko in sondo.
vec2 zvij(vec2 p, float px) {
  vec2 w = vec2(0.0);
  float l = 40.0;
  for (int i = 0; i < 3; i++) {
    float k = 1.0 - smoothstep(0.12 * l, 0.4 * l, px);
    float f = float(i) * 3.1;
    w += k * 0.07 * l * (vec2(sum(p / l + f), sum(p / l + vec2(7.7, 2.3) + f)) - 0.5);
    l *= 0.25;
  }
  return w;
}
// Fazni zamik (0..1) za lom svetlobe na robovih (upodobi.js SESTAVI: Laplace ob defokusu). Lomni količnik snovi glede na
// okolico: lipid, mineral, stena in eritrocit močno lomijo, vakuola in plazma skoraj nič.
float faza(T t) {
  float s = t.snov;
  float f = s == S_PRAZNO ? 0.0 : s == S_VAKUOLA || s == S_PLAZMA ? 0.12 : s == S_SLUZ || s == S_MATRIKS ? 0.25
    : s == S_LIPID || s == S_MINERAL || s == S_MIELIN || s == S_SKLENINA ? 1.0 : s == S_STENA || s == S_ERITROCIT ? 0.85
    : s == S_JEDRCE || s == S_KROMATIN || s == S_KLOROPLAST || s == S_GRANULA || s == S_KERATIN || s == S_ELASTIN ? 0.75
    : s == S_JEDRO ? 0.6 : 0.45;
  return clamp(f + 0.15 * (t.dye.x + t.dye.y), 0.0, 1.0);
}
// Prepuščena svetloba (rgb) in fazni zamik (a) v točki p svetlobnega mikroskopa.
vec4 svetloba(T t, vec2 p) {
  // barvilo se nikoli ne vpije povsem enakomerno: velike lise (debelina rezine, ~0,4 mm), drobna zrnatost (~0,4 µm)
  // in rahlo različen delež posameznih barvil; podlaga (stekelce, krovno steklo, medij) skoraj nič ne vpije
  vec3 d = t.dye * (0.8 + 0.4 * fbm(p / 420.0, 3)) * (vec3(0.92) + 0.16 * vec3(sum(p / 260.0 + 3.0), sum(p / 260.0 + 9.0), 0.5));
  d *= 0.88 + 0.24 * sumL(p, 0.45, uPx);
  // eozin (drugo barvilo) v citoplazmi in medceličnini ni enakomeren: lise ~10 µm in vlaknata zrnatost ~1,5 µm
  // (eritrociti in stene so enakomerni)
  if (t.snov != S_ERITROCIT && t.snov != S_STENA) d.y *= (0.7 + 0.6 * fbm(p / 10.0, 2)) * (0.85 + 0.3 * sumL(p * vec2(1.0, 0.45), 1.5, uPx));
  vec3 od = uBarvila * d * uDebelina + vec3(0.012, 0.014, 0.02);
  return vec4(exp(-od), faza(t));
}
void main() {
  // tkivo() je v senčilniku poklicano le enkrat (zanka): vsak klic se razvije v celotno kodo preparata, zato bi dodatni
  // klici podaljšali prevajanje in upočasnili vsako sliko (pregled PR #644)
  bool sonda = uNacin == 2;
  bool vrsticaTem = sonda && gl_FragCoord.y < 1.0;
  float px = sonda ? 0.0005 : uPx;
  vec2 p = sonda ? uSonda[min(int(gl_FragCoord.x), 7)] : uCenter + (gl_FragCoord.xy - 0.5 * uRes) * uPx;
  // zvijanje reza velja za svetlobni mikroskop in SEM; TEM (in vrstica TEM sonde) brez njega, ker so organeli manjši od valov
  if (uNacin != 1 && !vrsticaTem && !(sonda && uSondaZvij == 0)) p += zvij(p, px);
  // Oko in kamera seštejeta svetlobo s celotne slikovne točke: pri majhni povečavi (uSS = 4) štirje vzorci v točki,
  // da drobne strukture (limfociti, vlakna) ne dajo šuma iz posameznih pik.
  int n = uNacin == 0 && uSS > 1 ? 4 : 1;
  vec4 v = vec4(0.0);
  T t;
  for (int k = 0; k < 4; k++) {
    if (k >= n) break;
    vec2 dq = n == 1 ? vec2(0.0) : uPx * (k == 0 ? vec2(0.125, 0.375) : k == 1 ? vec2(-0.375, 0.125) : k == 2 ? vec2(0.375, -0.125) : vec2(-0.125, -0.375));
    t = tkivo(p + dq, px);
    if (uNacin == 0) v += svetloba(t, p + dq);
  }
  if (uNacin == 0) { o = v / float(n); return; }
  if (sonda && !vrsticaTem) { o = vec4(t.snov, t.tip, t.r1, t.jedro); return; }
  if (sonda || uNacin == 1) {
    U u = ultra(t, p, px);
    o = sonda ? vec4(u.snov, u.meja, t.smer) : vec4(vec3(exp(-2.0 * clamp(u.g, 0.0, 1.5))), 1.0);
    return;
  }
  if (false) {
  }${sem ? SEM_SENCENJE : ""} else {
    o = vec4(1.0);   // SEM riše ločen program (fragmentPreparata(koda, { sem: true }))
  }
}`;
}
