// Preparati očesa in zoba: mrežnica (HE), roženica (HE), leča (HE), zob (obrus brez barvanja).
// Mere: mrežnica ~250 µm (plasti po Ross in Pawlina, Histology, 8. izd., pogl. 24); paličnice ~2 µm, čepnice ~6 µm;
// pigmentni epitelij ~12 µm. Roženica ~540 µm: epitelij 50 µm, Bowmanova plast 12 µm, stroma iz lamel ~2 µm,
// Descemetova membrana ~10 µm, endotelij ~5 µm. Leča: ovojnica 10–20 µm, vlakna 5 µm debela. Zob: sklenina do 2,5 mm
// iz prizem ~5 µm, dentinski kanalčki 1–3 µm (ob pulpi gostejši), Retziusove proge, Hunter-Schregerjevi pasovi.

export const mreznica = {
  id: "mreznica",
  ime: "Mrežnica",
  opis: "Mrežnica ima deset plasti. Svetloba pride od zgoraj (od steklovine), gre skozi živčne celice in zadene paličnice in čepnice spodaj. Pod njimi je pigmentni epitelij z rjavim melaninom, nato žilnica in beločnica.",
  barvanje: "he",
  velikost: [2400, 1100],
  zacetek: { m: 100, sredisce: [0, 330] },
  sredisceBlizu: [0, 310],
  imena: { 4: "živčna celica (ganglijska ali bipolarna)", 17: "živčni izrastki in sinapse", 18: "fotoreceptor (paličnica ali čepnica)", 0: "celica pigmentnega epitelija", 2: "fibroblast", 3: "limfocit" },
  snovi: { 9: "membrana (bazalna lamina)", 3: "kolagenska vlakna", 5: "eritrocit" },
  isci: "Od zgoraj navzdol poišči: plast ganglijskih celic, notranjo jedrno plast, zunanjo jedrno plast (zelo gosta temna jedra paličnic), notranje in zunanje segmente fotoreceptorjev, rjavi pigmentni epitelij. Pri TEM nad 20 000× poišči membranske diske v zunanjem segmentu.",
  glsl: /* glsl */ `
#define C_FOTO 18.0
#define IMA_TEM_POSEBNO
T nevPlast(vec2 p, float px, float g) {
  T t = prazno();
  t.snov = S_CITO; t.tip = C_NEVRIT;
  Vor v = vor(p, 1.2, vec2(1.0), 0.0, 0.9);
  t.meja = v.rob; t.cc = v.c; t.jc = v.c; t.cid = v.id;
  float vid = 1.0 - smoothstep(0.4, 1.2, px);
  t.dye = vec3(0.06, g + 0.07 * (mix(0.5, sumL(p, 1.0, px), vid) - 0.5), 0.0);
  return t;
}
// Gosta plast jeder (krogci), med njimi nevropil; moc = temnost kromatina.
T jedra(vec2 p, float d, float d0, float d1, float s, float r0, float r1, float moc, float seme, float px) {
  T t = nevPlast(p, px, 0.3);
  vec4 e = krogci(p, s, r0, r1, 0.96, seme);
  float dc = d + (e.z - p.y);   // globina središča jedra
  if (dc < d0 + r1 || dc > d1 - r1) return t;
  if (e.x < 1.0) { t.meja = abs(e.x - 0.5); t.cc = e.yz; t.jc = e.yz; t.cid = vec2(e.w, seme); t.tip = C_NEVRON; }
  float k = pokrij(e.x, px);
  if (k > 0.0) {
    t.dye.x = mix(t.dye.x, moc * kromatin(p - e.yz, vec2(e.w, seme), px), k);
    t.dye.y *= 1.0 - 0.7 * k;
    if (k > 0.5) { t.snov = S_JEDRO; t.jedro = e.x; }
  }
  return t;
}
T tkivo(vec2 p, float px) {
  T t = prazno();
  if (odsek(p, vec2(2400.0, 1100.0), 41.0) > 0.0) return t;
  float y0 = 520.0 + 25.0 * sin(p.x / 420.0) + 8.0 * (sum(vec2(p.x / 150.0, 3.0)) - 0.5);
  float d = y0 - p.y;
  if (d < 0.0) { t.dye = vec3(0.0, 0.03 * sumL(p, 20.0, px), 0.0); return t; }              // steklovina
  if (d < 2.0) { t.snov = S_MATRIKS; t.dye = vec3(0.04, 0.62, 0.0); return t; }             // notranja mejna membrana
  if (d < 22.0) {                                                                            // plast živčnih vlaken
    t = nevPlast(p, px, 0.42);
    t.smer = vec2(1.0, 0.0);
    t.dye.y += 0.05 * sin(p.y * 2.5 + 3.0 * sum(vec2(p.x / 40.0, p.y / 3.0))) * (1.0 - smoothstep(0.4, 1.2, px));
    float xi = floor(p.x / 300.0);
    vec4 hz = h42(vec2(xi, 4.0));
    if (hz.y < 0.6) zila(t, p - vec2((xi + 0.3 + 0.4 * hz.x) * 300.0, y0 - 12.0), 5.0 + 2.5 * hz.z, 1.2, hz.zw, px);
    return t;
  }
  if (d < 40.0) {                                                                            // plast ganglijskih celic
    t = nevPlast(p, px, 0.4);
    float xi = floor(p.x / 22.0);
    for (int i = -1; i <= 1; i++) {
      vec4 h = h42(vec2(xi + float(i), 6.0));
      if (h.z > 0.7) continue;
      vec2 c = vec2((xi + float(i) + 0.5 + 0.3 * (h.x - 0.5)) * 22.0, y0 - 31.0);
      float r = 6.5 + 2.5 * h.y;
      float ds = sdElipsa(p - c, vec2(r, r * 0.85)) + 0.6 * (sum((p - c) / 3.0 + h.zw * 9.0) - 0.5);
      if (ds < 0.0) {
        t.snov = S_CITO; t.tip = C_NEVRON; t.meja = -ds; t.cc = c; t.cid = vec2(xi + float(i), 6.0);
        t.dye = vec3(0.12 + 0.18 * smoothstep(0.5, 0.75, sumL(p, 0.8, px)), 0.42, 0.0);      // Nisslova telesca
        jedroV(t, p, vec2(0.0, 0.8), vec2(3.6, 3.4), 0.0, 0.42, px);
        t.dye.x += 0.9 * pokrij(length(p - t.jc - vec2(0.8, 0.4)) - 0.9, px);
        return t;
      }
    }
    return t;
  }
  if (d < 75.0) return nevPlast(p, px, 0.45);                                                // notranja pleksiformna
  if (d < 110.0) return jedra(p, d, 75.0, 110.0, 6.2, 2.5, 2.9, 0.85, 11.0, px);            // notranja jedrna plast
  if (d < 125.0) return nevPlast(p, px, 0.38);                                               // zunanja pleksiformna
  if (d < 178.0) return jedra(p, d, 125.0, 178.0, 5.4, 2.25, 2.5, 1.2, 13.0, px);           // zunanja jedrna plast
  if (d < 179.0) { t.snov = S_MATRIKS; t.dye = vec3(0.05, 0.6, 0.0); return t; }             // zunanja mejna membrana
  if (d < 237.0) {                                                                           // notranji in zunanji segmenti
    t.snov = S_MATRIKS; t.dye = vec3(0.0, 0.24, 0.0);
    t.smer = vec2(0.0, 1.0);
    float kc = floor(p.x / 9.0 + 0.5);
    float lc = p.x - kc * 9.0;
    float w = 0.0;
    if (d < 201.0) w = 2.8 * sqrt(max(0.0, 1.0 - pow((d - 190.0) / 11.0, 2.0)));
    else if (d < 216.0) w = mix(1.5, 0.5, (d - 201.0) / 15.0);
    if (abs(lc) < w) {
      t.snov = S_CITO; t.tip = C_FOTO; t.meja = w - abs(lc); t.cc = vec2(kc * 9.0, y0 - 190.0); t.cid = vec2(kc, 2.0);
      t.dye = vec3(0.05, d < 201.0 ? 0.62 : 0.42, 0.0);
      t.r1 = d < 201.0 ? 0.0 : 1.0;
      return t;
    }
    float kr = floor(p.x / 2.2);
    float lr = (fract(p.x / 2.2) - 0.5) * 2.2;
    if (abs(lr) < 0.8 && abs(lc) > w + 0.4) {
      t.snov = S_CITO; t.tip = C_FOTO; t.meja = 0.8 - abs(lr); t.cc = vec2((kr + 0.5) * 2.2, y0 - 200.0); t.cid = vec2(kr, 3.0);
      t.dye = vec3(0.04, d < 207.0 ? 0.46 : 0.34, 0.0);
      t.dye.y -= 0.08 * smoothstep(0.55, 0.7, sumL(vec2(p.x, p.y * 0.2), 1.0, px));
      t.r1 = d < 207.0 ? 0.0 : 1.0;
    }
    t.dye.z += 0.7 * smoothstep(229.0, 237.0, d) * smoothstep(0.5, 0.7, sumL(p, 0.7, px));  // izrastki pigmentnih celic
    return t;
  }
  if (d < 249.0) {                                                                           // pigmentni epitelij
    T e = epitel(d - 237.0, p.x, 12.0, 14.0, 0.72, C_SPLOSNA, vec2(3.0, 0.0), p, vec2(0.0, 1.0), px);
    float mel = (1.0 - smoothstep(3.0, 6.0, d - 237.0)) * (0.5 + 0.8 * smoothstep(0.45, 0.6, sumL(p, 0.6, px)));
    if (e.snov != S_JEDRO) { e.dye.z += 0.9 * mel; if (mel > 0.6) e.r1 = 2.0; }
    return e;
  }
  if (d < 251.0) { t.snov = S_MATRIKS; t.dye = vec3(0.03, 0.55, 0.0); return t; }           // Bruchova membrana
  if (d < 430.0) {                                                                           // žilnica
    t.snov = S_KOLAGEN; t.dye = vec3(0.03, 0.2 + 0.08 * sumL(p, 6.0, px), 0.0);
    vec4 m = krogci(p, 22.0, 3.0, 5.0, 0.55, 23.0);
    vec2 mq = rot(m.w * 6.0) * (p - m.yz);
    float dm = sdElipsa(mq, vec2(11.0, 3.0)) + 4.0 * (fbm(mq / 4.0 + m.w * 3.0, 3) - 0.5);   // razvejan melanocit
    if (dm < 0.0) {
      t.dye.z += 0.8 * (0.5 + 0.5 * sumL(p, 0.6, px)) * smoothstep(0.0, 1.5, -dm); t.snov = S_CITO; t.tip = C_FIBROBLAST; t.meja = -dm; t.cc = m.yz; t.cid = vec2(m.w, 4.0);
      t.r1 = 2.0;
    }
    if (d < 266.0) {
      float xi = floor(p.x / 17.0);
      vec4 hc = h42(vec2(xi, 8.0));
      zila(t, p - vec2((xi + 0.5) * 17.0, y0 - 258.0), 4.5 + hc.x, 0.8, hc.zw, px);
    } else {
      vec4 z = krogci(p, 70.0, 10.0, 28.0, 0.75, 29.0);
      zila(t, p - z.yz, length(p - z.yz) - z.x, 2.5, vec2(z.w), px);
    }
    return t;
  }
  // beločnica: gosta vlakna
  t.snov = S_KOLAGEN; t.smer = normalize(vec2(1.0, 0.25 * (sum(p / 120.0) - 0.5)));
  float vl = 0.5 + 0.5 * sin(p.y * 0.35 + 4.0 * sum(p / 60.0));
  t.dye = vec3(0.03, 0.5 + 0.12 * mix(0.5, vl, 1.0 - smoothstep(0.5, 2.0, px)), 0.0);
  vec4 f = krogci(p, 40.0, 1.0, 1.0, 0.4, 31.0);
  float dj = sdElipsa(p - f.yz, vec2(5.0, 0.9));
  if (dj < 0.0) { t.dye.x += 0.85; t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = dj; t.jc = f.yz; t.cc = f.yz; t.cid = vec2(f.w, 5.0); }
  return t;
}
void temPosebno(inout U u, T t, vec2 p, float px) {
  // zunanji segment fotoreceptorja: skladi membranskih diskov (razmik ~30 nm)
  if (t.tip == C_FOTO && t.r1 > 0.5 && (t.snov == S_CITO || u.snov == S_RIBOSOM)) {
    float L = 0.03;
    float v = (fract(p.y / L) - 0.5) * L;
    float disk = max(membrana(v - 0.007, px), membrana(v + 0.007, px)) * step(0.06, t.meja);
    u.g = px > 0.01 ? 0.5 : mix(0.3, 0.8, disk);
    if (disk > 0.5) u.snov = S_MEMBRANA;
    u.meja = min(u.meja, abs(abs(v) - 0.007));
  }
  // melaninska zrnca v pigmentnih celicah in melanocitih
  if (t.r1 > 1.5) {
    vec4 m = krogci(p, 0.6, 0.12, 0.22, 0.8, 37.0);
    vec2 mq = rot(m.w * 3.0) * (p - m.yz);
    float dm = sdElipsa(mq, vec2(0.22 + 0.2 * fract(m.w * 7.0), 0.12));
    float k = pokrij(dm, px);
    u.g = mix(u.g, 1.25, k);
    if (k > 0.5) { u.snov = S_GRANULA; u.meja = min(u.meja, abs(dm)); }
  }
}`,
};

export const rozenica = {
  id: "rozenica",
  ime: "Roženica",
  opis: "Roženica je prozorno okno očesa. Zgoraj je večskladni ploščati epitelij brez poroženevanja, pod njim Bowmanova plast, debela stroma iz pravilno zloženih plasti kolagena (zato je prozorna), Descemetova membrana in enoskladni endotelij. V roženici ni žil.",
  barvanje: "he",
  velikost: [2400, 900],
  zacetek: { m: 100, sredisce: [0, 50] },
  sredisceBlizu: [0, 160],
  imena: { 9: "celica epitelija", 2: "keratocit (fibroblast strome)", 0: "celica endotelija" },
  snovi: { 3: "kolagenske lamele strome", 9: "Descemetova membrana" },
  isci: "Poišči pet plasti. Pri TEM v stromi poišči lamele, v katerih kolagenska vlakna tečejo pravokotno na sosednjo lamelo.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  if (odsek(p, vec2(2400.0, 900.0), 43.0) > 0.0) return t;
  float ys = 330.0 - p.x * p.x / 15600.0;          // polmer ukrivljenosti 7,8 mm
  float d = ys - p.y;
  if (d < 0.0) return t;
  if (d < 52.0) {
    T e = vecskladni(d, p.x, 52.0, 0.0, vec2(5.0, 1.0), px);
    return vSvet(e, p, vec2(1.0, 0.0), vec2(0.0, -1.0));
  }
  if (d < 64.0) { t.snov = S_KOLAGEN; t.dye = vec3(0.03, 0.6 + 0.04 * sumL(p, 3.0, px), 0.0); return t; }   // Bowmanova plast
  if (d < 530.0) {                                                                                         // stroma
    // lamele so rahlo valovite (pri rezanju se stroma malo nabere)
    float g = d - 64.0 + 1.5 * (sum(vec2(p.x / 250.0, d / 80.0)) - 0.5) + 2.5 * (sum(vec2(p.x / 70.0, d / 140.0) + 4.0) - 0.5);
    float lam = floor(g / 2.0);
    float lv = (fract(g / 2.0) - 0.5) * 2.0;
    vec4 h = h42(vec2(lam, floor(p.x / 600.0 + 0.5 * h12(vec2(lam, 1.0)))));
    t.snov = S_KOLAGEN;
    t.smer = h.x < 0.5 ? vec2(1.0, 0.0) : vec2(0.0);
    t.dye = vec3(0.03, 0.5 + 0.06 * (h.y - 0.5), 0.0);
    // razpoke med lamelami (artefakt priprave)
    // redke, različno široke in na koncih zožene razpoke (prej goste ravne bele črtice)
    float sirR = 0.1 + 0.45 * smoothstep(0.45, 0.8, sum(vec2(p.x / 90.0, lam * 0.37)));
    float raz = step(0.93, h.z) * crta(abs(lv) - 0.98, sirR, px) * smoothstep(0.45, 0.6, sum(vec2(p.x / 60.0, lam)));
    t.dye.y *= 1.0 - 0.85 * raz;
    if (raz > 0.5) t.snov = S_PRAZNO;
    // keratociti: ploščata jedra med lamelami
    float ki = floor(p.x / 70.0);
    vec4 hk = h42(vec2(ki, lam));
    if (hk.x < 0.035) {
      vec2 c = vec2((ki + 0.5 + 0.3 * (hk.y - 0.5)) * 70.0, p.y + (g - (lam + 1.0) * 2.0));
      float dj = sdElipsa(p - c, vec2(8.0, 0.75));
      if (dj < px) {
        t.dye.x += 0.9 * pokrij(dj, px);
        if (dj < 0.0) { t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = dj; t.jc = c; t.cc = c; t.cid = vec2(ki, lam); }
      }
    }
    return t;
  }
  if (d < 540.0) { t.snov = S_MATRIKS; t.dye = vec3(0.02, 0.66, 0.0); return t; }   // Descemetova membrana
  if (d < 545.0) return epitel(545.0 - d, p.x, 5.0, 20.0, 0.5, C_SPLOSNA, vec2(9.0, 0.0), p, vec2(0.0, -1.0), px);
  return t;                                                                          // sprednji prekat
}`,
};

export const leca = {
  id: "leca",
  ime: "Leča",
  opis: "Leča je zgrajena iz dolgih prozornih vlaken, polnih beljakovin kristalinov. Zgoraj je debela ovojnica in pod njo enoskladni epitelij; mlada vlakna pod njim imajo še jedra, starejša v globini jih izgubijo.",
  barvanje: "he",
  velikost: [2000, 900],
  zacetek: { m: 100, sredisce: [0, 500] },
  sredisceBlizu: [0, 560],
  imena: { 0: "celica epitelija leče ali lečno vlakno" },
  snovi: { 13: "lečno vlakno (kristalini)", 9: "ovojnica leče" },
  isci: "Poišči ovojnico, epitelij in vlakna z jedri pod njim. Pri TEM poišči stike med vlakni.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  if (odsek(p, vec2(2000.0, 900.0), 47.0) > 0.0) return t;
  float ys = 700.0 - p.x * p.x / 20000.0;
  float d = ys - p.y;
  if (d < 0.0) return t;
  if (d < 14.0) { t.snov = S_MATRIKS; t.dye = vec3(0.03, 0.78, 0.0); return t; }   // ovojnica
  if (d < 26.0) return epitel(d - 14.0, p.x, 12.0, 12.0, 0.5, C_SPLOSNA, vec2(2.0, 0.0), p, vec2(0.0, 1.0), px);
  float dd = d - 26.0;
  float g = dd / 4.5 + 0.6 * (sum(vec2(p.x / 300.0, dd / 200.0)) - 0.5);
  float i = floor(g);
  float lv = (fract(g) - 0.5) * 4.5 + 0.25 * sin(p.x * 2.0 + i * 3.0) * (1.0 - smoothstep(0.05, 0.2, px));
  t.snov = S_KOLOID; t.tip = C_SPLOSNA; t.cid = vec2(i, 1.0);
  t.meja = max(0.0, 2.25 - abs(lv));
  t.cc = vec2(p.x, p.y + lv);
  t.smer = vec2(1.0, 0.0);
  t.dye = vec3(0.02, 0.5 + 0.08 * (h12(vec2(i, 1.0)) - 0.5), 0.0);
  t.dye.y -= 0.14 * crta(t.meja, 0.2, px);
  // jedra mladih vlaken: podolgovata, vse redkejša v globino
  float ni = floor(p.x / 60.0);
  vec4 h = h42(vec2(ni, i));
  if (h.x < 0.5 * (1.0 - smoothstep(40.0, 160.0, dd))) {
    vec2 c = vec2((ni + 0.5 + 0.3 * (h.y - 0.5)) * 60.0, p.y + lv);
    float dj = sdElipsa(p - c, vec2(6.0, 1.4));
    if (dj < px) {
      float k = pokrij(dj, px);
      t.dye.x = mix(t.dye.x, 0.75 * kromatin(p - c, h.zw, px), k);
      if (dj < 0.0) { t.snov = S_JEDRO; t.jedro = dj; t.jc = c; t.cc = c; }
    }
  }
  return t;
}`,
};

export const zob = {
  id: "zob",
  ime: "Zob (obrus)",
  opis: "Tanko zbrušen zob brez barvanja. Zgoraj je sklenina (najtrše tkivo v telesu, 96 % minerala) iz drobnih prizem, ki tečejo od dentina proti površini. Pod njo je dentin s tisoči kanalčkov, ki vodijo od pulpe navzven. Pulpa (zobna votlina) se pri brušenju izgubi.",
  barvanje: "obrus",
  velikost: [2600, 1600],
  zacetek: { m: 40, sredisce: [0, 300] },
  sredisceBlizu: [200, 600],
  imena: {},
  snovi: { 18: "sklenina (prizme iz hidroksiapatita)", 4: "dentin", 0: "dentinski kanalček ali pulpa" },
  isci: "Poišči mejo med sklenino in dentinom. V sklenini poišči Retziusove proge in svetle in temne Hunter-Schregerjeve pasove, v dentinu kanalčke. Pri največji povečavi poglej kristale hidroksiapatita.",
  glsl: /* glsl */ `
#define IMA_TEM_POSEBNO
T tkivo(vec2 p, float px) {
  T t = prazno();
  if (odsek(p, vec2(2600.0, 1600.0), 49.0) > 0.0) return t;
  float ys = 1300.0 - p.x * p.x / 9000.0;
  float e = ys - p.y;                                     // globina pod površino
  if (e < 0.0) return t;
  float ydej = ys - 950.0 + 12.0 * sin(p.x / 40.0) + 20.0 * (sum(vec2(p.x / 300.0, 2.0)) - 0.5);
  float vid = 1.0 - smoothstep(0.8, 2.5, px);
  if (p.y > ydej) {
    // sklenina: prizme pravokotno na površino, rahlo valovite
    float u = p.x + (2.0 * p.x / 9000.0) * e + 4.0 * sin(e / 22.0);
    vec2 n = normalize(vec2(2.0 * p.x / 9000.0, 1.0));
    t.snov = S_SKLENINA; t.smer = n; t.r1 = u;
    float pr = abs(fract(u / 5.0) - 0.5) * 5.0;
    float hs = sin(u / 32.0 + e / 140.0 + 2.0 * sum(vec2(u / 200.0, e / 300.0)));
    float hsb = smoothstep(-0.2, 0.2, hs) * (1.0 - smoothstep(450.0, 750.0, p.y - ydej));   // Hunter-Schregerjevi pasovi v notranjem delu
    float ret = crta(abs(fract((p.x * 0.45 + e * 0.9 + 20.0 * sum(vec2(p.x / 150.0, e / 150.0))) / 35.0) - 0.5) * 35.0, 0.9, px);
    t.dye = vec3(0.27 + 0.05 * hsb + 0.2 * ret * step(0.25, sum(vec2(p.x / 400.0, e / 400.0))), 0.04, 0.0);
    t.dye.y += 0.12 * crta(pr - 2.5, 0.35, px) * vid;
    return t;
  }
  float yp = -900.0 + p.x * p.x / 6000.0;
  if (p.y < yp) { t.dye = vec3(0.04 * sumL(p, 30.0, px), 0.02, 0.0); return t; }   // pulpa (prazna)
  // dentin: kanalčki od pulpe proti sklenini (oblika črke S), ob pulpi gostejši in širši
  float f = clamp((p.y - yp) / max(ydej - yp, 1.0), 0.0, 1.0);
  float w = p.x * (1.6 - 0.6 * f) + 30.0 * sin(f * 3.14159);
  float k = floor(w / 6.0);
  float lw = (fract(w / 6.0) - 0.5) * 6.0 / (1.6 - 0.6 * f);
  float rk = mix(1.25, 0.5, f);
  vec2 gr = vec2(1.6 - 0.6 * f, (30.0 * 3.14159 * cos(f * 3.14159) - 0.6 * p.x) / max(ydej - yp, 1.0));
  t.snov = S_MINERAL; t.smer = normalize(gr);      // kolagenska vlakenca dentina pravokotno na kanalčke
  t.dye = vec3(0.2 + 0.05 * sumL(p, 40.0, px), 0.05, 0.0);
  t.dye.x += 0.05 * crta(abs(fract((ydej - p.y) / 18.0) - 0.5) * 18.0, 0.5, px);      // prirastne črte (von Ebner)
  // kanalčki (razmik 6 µm) se rišejo le, ko so večji od točke; sicer povprečna temnejša barva (brez moiréja)
  float al = abs(lw);
  float vk = 1.0 - smoothstep(0.45, 1.3, px * (1.6 - 0.6 * f));
  float kk = pokrij(al - rk, max(px, 0.15)) * vk;
  if (al < rk + 0.6) { t.dye.x -= 0.08 * vk; t.dye.y += 0.06 * vk; t.r1 = -1.0; }        // peritubularni dentin
  t.dye.x += (1.0 - vk) * (0.45 * (2.0 * rk / 6.0) + 0.1 * (sum(vec2(w / 14.0, f * 9.0)) - 0.5)); // povprečje in snopi kanalčkov
  t.dye = mix(t.dye, vec3(0.65, 0.15, 0.0), kk);
  if (kk > 0.5) { t.snov = S_PRAZNO; t.meja = rk - al; }
  return t;
}
void temPosebno(inout U u, T t, vec2 p, float px) {
  if (t.snov == S_SKLENINA) {
    // meje prizem (ovojnica prizme ~0,2 µm) in kristali vzdolž prizme
    float pr = abs(fract(t.r1 / 5.0) - 0.5) * 5.0;
    u.g = mix(u.g, 0.62, crta(pr - 2.5, 0.05, px));
  }
  if (t.snov == S_MINERAL && t.r1 < -0.5) u.g += 0.15;
}`,
};
