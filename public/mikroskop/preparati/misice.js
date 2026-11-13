// Preparati mišičnine (HE): skeletna mišica (vzdolžni prerez), srčna mišica, gladka mišica (obe plasti).
// Mere (Ross in Pawlina; Junqueira): skeletno vlakno 10–100 µm, sarkomera ~2,2–2,5 µm, srčna celica 15 × 85–100 µm,
// gladka mišična celica 5–8 × 20–200 µm.

export const skeletna = {
  id: "skeletna-misica",
  ime: "Skeletna mišica",
  opis: "Vzdolžni prerez skeletne mišice. Vlakna so dolge celice z mnogimi jedri ob robu; prečna progavost nastane, ker se v sarkomerah izmenjujejo temni pasovi A in svetli pasovi I.",
  barvanje: "he",
  velikost: [2400, 1600],
  zacetek: { m: 100, sredisce: [0, 0] },
  imena: { 16: "mišično vlakno", 2: "fibroblast" },
  snovi: { 7: "miofibrile (aktin in miozin)", 3: "endomizij (vezivo med vlakni)" },
  isci: "Pri 400× opazuj progavost in jedra ob robu vlaken. Pri TEM poišči sarkomero med dvema črtama Z.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(2400.0, 1600.0), 7.0);
  if (rob > 0.0) return t;
  mat2 R = rot(0.25);
  vec2 z = R * p;
  vec2 smer = transpose(R) * vec2(1.0, 0.0);
  float wy = z.y + 14.0 * sin(z.x / 420.0) + 60.0 * (sum(z / 900.0) - 0.5);
  // vlakna so različno debela (30–65 µm): meje med njimi so naključno zamaknjene, endomizij 1–3 µm
  float W = 47.0;
  float i = floor(wy / W);
  // meja med vlaknoma i in i+1 je rahlo valovita (vlakna niso povsem enako debela po vsej dolžini)
  #define MEJA_VL(n) (((n) + 1.0) * W + 16.0 * (h12(vec2((n), 8.0)) - 0.5) + 7.0 * (sum(vec2(z.x / 170.0, (n) * 3.1)) - 0.5))
  float e1 = MEJA_VL(i);
  float e0 = MEJA_VL(i - 1.0);
  if (wy > e1) { i += 1.0; e0 = e1; e1 = MEJA_VL(i); }
  else if (wy < e0) { i -= 1.0; e1 = e0; e0 = MEJA_VL(i - 1.0); }
  vec4 h = h42(vec2(i, 3.0));
  float sred = 0.5 * (e0 + e1);
  float hw = 0.5 * (e1 - e0) - 0.6 - 1.2 * h.y - (mod(i, 9.0) < 0.5 ? 8.0 : 0.0);  // vsak deveti: širši perimizij
  float v = wy - sred;
  float bd = hw - abs(v);
  float vid = 1.0 - smoothstep(0.75, 1.15, px); // progavost (2,3 µm) izgine šele pod Nyquistovo mejo zaslona
  // vezivo med vlakni
  t.snov = S_KOLAGEN; t.smer = smer;
  t.dye = vec3(0.04, 0.22 + 0.06 * sumL(p, 5.0, px), 0.0);
  // kapilare in fibroblasti v endomiziju
  vec4 kc = krogci(vec2(z.x * 0.25, wy), 13.0, 2.0, 3.2, 0.35, 5.0);
  if (bd < 0.0) {
    if (kc.x < 0.0) {
      t.dye.y += 0.45 * pokrij(kc.x + 0.6, px);
      if (kc.x < -0.6) { t.snov = S_ERITROCIT; t.meja = -kc.x; }
    }
  }
  float k = pokrij(-bd, px);
  if (k <= 0.0) return t;
  // vlakno: progavost (pas A temnejši), drobne miofibrile vzdolž
  // sarkomere so v vsakem vlaknu malo drugače dolge (2,2–2,6 µm), progavost je rahlo ukrivljena in nežna (HE)
  float xs = (z.x + 50.0 * h.z + 2.0 * (sum(vec2(z.x / 40.0, v / 25.0) + h.xy * 9.0) - 0.5)) * (1.0 + 0.08 * (h.x - 0.5));
  float prog = cos(6.2832 * xs / 2.3) * (0.55 + 0.45 * sum(vec2(z.x / 60.0, v / 9.0) + h.zw * 7.0));
  T f = prazno();
  f.snov = S_MIOFIBRILA; f.tip = C_MISICA; f.smer = smer; f.r1 = xs - 1.15;
  f.meja = bd; f.cc = transpose(R) * vec2(z.x, sred); f.cid = vec2(i, 3.0);
  f.dye = vec3(0.06 + 0.05 * prog * vid, (0.5 + 0.12 * h.w) + 0.11 * prog * vid + 0.04 * sin(v * 5.0) * vid + 0.08 * (sumL(p, 60.0, px) - 0.5), 0.0);
  // jedra ob robu vlakna
  for (int sgn = -1; sgn <= 1; sgn += 2) {
    float yj = sred + float(sgn) * (hw - 1.7);
    float kk = floor(z.x / 30.0);
    for (int d = -1; d <= 1; d++) {
      float m = kk + float(d);
      vec4 g = h42(vec2(m, i * 3.0 + float(sgn)));   // ×3: zgornja jedra vlakna i niso zrcalna spodnjim vlakna i+1
      if (g.z > 0.6) continue;
      vec2 c = vec2((m + 0.5 + 0.6 * (g.x - 0.5)) * 30.0, yj);
      vec2 q = vec2(z.x, wy) - c;
      float dj = sdElipsa(q, vec2(5.5 + 1.5 * g.y, 1.35)) + 0.2 * (sum(q * 0.8 + g.xy * 9.0) - 0.5);
      float jk = pokrij(dj, px);
      if (jk > 0.0) {
        f.dye.x = mix(f.dye.x, 0.95 * kromatin(q, g.xy, px), jk);
        f.dye.y = mix(f.dye.y, 0.2, jk);
        if (jk > 0.5) { f.snov = S_JEDRO; f.jedro = dj; f.jc = transpose(R) * (z - q); f.tip = C_MISICA; }
      }
    }
  }
  t.dye = mix(t.dye, f.dye, k);
  if (k > 0.5) return f;
  return t;
}`,
};

export const srcna = {
  id: "srcna-misica",
  ime: "Srčna mišica",
  opis: "Srčna mišica (stena prekata). Celice so razvejene, imajo eno ali dve jedri v sredini in so povezane z interkalarnimi diski, ki so vidni kot temne prečne črte.",
  barvanje: "he",
  velikost: [2400, 1600],
  zacetek: { m: 400, sredisce: [0, 0] },
  imena: { 16: "srčna mišična celica", 2: "fibroblast" },
  snovi: { 7: "miofibrile (aktin in miozin)", 3: "vezivo med celicami" },
  isci: "Pri 400× poišči interkalarne diske (temne stopničaste črte) in jedra v sredini celic.",
  glsl: /* glsl */ `
#define DIADE_PRI_Z // srčna mišica: T-cevka ob črti Z z eno končno cisterno (diada), ne triada ob prehodu A–I
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(2400.0, 1600.0), 8.0);
  if (rob > 0.0) return t;
  float kot = -0.35 + 0.25 * (sum(p / 1500.0) - 0.5);
  vec2 smer = vec2(cos(kot), sin(kot));
  Vor v = vor(p, 17.0, vec2(5.2, 1.0), -kot, 0.85);
  vec4 h = h42(v.id);
  float vid = 1.0 - smoothstep(0.5, 1.1, px);
  bool disk = abs(dot(v.nb, smer)) > 0.75;
  // ob straneh tanek endomizij (večinoma komaj viden, mestoma širši s kapilaro), na koncih interkalarni disk
  float sir = smoothstep(0.55, 0.7, sum(p / 30.0 + 5.0));
  float rez = disk ? 0.0 : 0.55 + 1.1 * sir;
  t.snov = S_KOLAGEN; t.smer = smer;
  t.dye = vec3(0.05, mix(0.3, 0.2, sir) + 0.05 * sumL(p, 5.0, px), 0.0);
  if (!disk && v.rob < rez) {
    vec4 kc = krogci(p, 9.0, 2.0, 2.8, 0.25, 11.0);
    if (kc.x < 0.0) { t.dye.y += 0.5; t.snov = S_ERITROCIT; t.meja = -kc.x; }
  }
  float k = pokrij(rez - v.rob, px);
  if (k <= 0.0) return t;
  float xs = dot(p, smer) + 40.0 * h.z;
  float prog = cos(6.2832 * xs / 2.2);
  T f = prazno();
  f.snov = S_MIOFIBRILA; f.tip = C_MISICA; f.smer = smer; f.r1 = xs - 1.1;
  f.meja = v.rob - rez; f.cc = v.c; f.cid = v.id;
  f.dye = vec3(0.05, 0.5 + 0.08 * prog * vid + 0.06 * (sumL(p, 40.0, px) - 0.5), 0.0);
  // interkalarni disk: tanka temna stopničasta prečna črta
  float stop = 0.6 * step(0.5, fract(dot(p, vec2(-smer.y, smer.x)) / 5.0 + h.w));   // stopničasta črta
  // v.rob je v smeri vlakna stisnjen (vor z raztegom 5,2), zato je prava razdalja do diska 5,2 · v.rob
  // disk je znak, ki ga učenec išče: ~1 µm debel, temno eozinofilen (pregled PR #644: prej skoraj neviden pri 400×)
  if (disk) f.dye += vec3(0.24, 0.4, 0.0) * crta(5.2 * v.rob - 0.6 - stop, 0.55, px);
  // osrednje jedro s svetlim okoljem
  vec2 q = rot(-kot) * (p - v.c);
  q.x += 6.0 * (h.x - 0.5);
  float halo = sdElipsa(q, vec2(9.5, 2.7));
  f.dye.y -= 0.24 * pokrij(halo, px * 2.0 + 0.6);
  if (h.y < 0.75) {
    float dj = sdElipsa(q, vec2(5.2 + 1.2 * h.w, 2.0)) + 0.2 * (sum(q + h.zw * 9.0) - 0.5);
    float jk = pokrij(dj, px);
    f.dye.x = mix(f.dye.x, 1.0 * kromatin(q, h.zw, px), jk);
    f.dye.y = mix(f.dye.y, 0.15, jk);
    if (jk > 0.5) { f.snov = S_JEDRO; f.jedro = dj; f.jc = v.c + transpose(rot(-kot)) * vec2(-6.0 * (h.x - 0.5), 0.0); }
  }
  t.dye = mix(t.dye, f.dye, k);
  if (k > 0.5) return f;
  return t;
}`,
};

export const gladka = {
  id: "gladka-misica",
  ime: "Gladka mišica",
  opis: "Gladka mišičnina iz stene črevesa: zgoraj so celice prerezane vzdolžno (vretenaste z jedrom v obliki cigare), spodaj prečno (okrogli preseki, jedro je zadeto le v nekaterih).",
  barvanje: "he",
  velikost: [2200, 1500],
  zacetek: { m: 400, sredisce: [0, 60] },
  imena: { 13: "gladka mišična celica", 2: "fibroblast" },
  snovi: { 3: "vezivo" },
  isci: "Primerjaj vzdolžni in prečni prerez celic. Gladka mišica nima prečne progavosti.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(2200.0, 1500.0), 9.0);
  if (rob > 0.0) return t;
  float meja = 25.0 * (sum(vec2(p.x / 300.0, 1.0)) - 0.5);
  t.snov = S_KOLAGEN; t.smer = vec2(1, 0);
  t.dye = vec3(0.05, 0.22 + 0.05 * sumL(p, 6.0, px), 0.0);
  if (abs(p.y - meja) < 22.0) return t;               // tanek pas veziva med plastema
  bool vzd = p.y > meja;
  Vor v = vor(p, 7.5, vzd ? vec2(9.0, 1.0) : vec2(1.0), vzd ? 0.05 : 0.0, 0.9);
  vec4 h = h42(v.id + (vzd ? 0.0 : 50.0));
  T f = prazno();
  f.snov = S_CITO; f.tip = C_GLADKA; f.meja = v.rob; f.cc = v.c; f.jc = v.c; f.cid = v.id;
  f.smer = vzd ? vec2(cos(0.05), -sin(0.05)) : vec2(0.0);
  f.dye = vec3(0.06, 0.5 + 0.06 * (sumL(p, 30.0, px) - 0.5) - 0.12 * crta(v.rob, 0.25, px), 0.0);
  vec2 q = vzd ? rot(0.05) * (p - v.c) : p - v.c;
  if (vzd) {
    if (h.y < 0.55) {
      float dj = sdKapsula(q - vec2(10.0 * (h.x - 0.5), 0.0), 6.5 + 2.5 * h.w, 1.35) + 0.15 * (sum(q * 1.5 + h.zw * 9.0) - 0.5);
      float jk = pokrij(dj, px);
      f.dye.x = mix(f.dye.x, 0.55 * kromatin(q, h.zw, px), jk);
      if (jk > 0.5) { f.snov = S_JEDRO; f.jedro = dj; f.jc = v.c + vec2(10.0 * (h.x - 0.5), 0.0); }
      else f.jedro = dj;
    }
  } else if (h.y < 0.3) {
    float dj = length(q) - 1.3;
    float jk = pokrij(dj, px);
    f.dye.x = mix(f.dye.x, 0.9 * kromatin(q, h.zw, px), jk);
    f.jedro = dj;
    if (jk > 0.5) f.snov = S_JEDRO;
  }
  return f;
}`,
};
