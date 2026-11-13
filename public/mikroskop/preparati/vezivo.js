// Preparati veziv (HE): kita (gosto urejeno vezivo), gosto neurejeno vezivo (ovojnice, sklepna ovojnica, usnjica),
// hialini hrustanec, maščevje. Mere: Ross in Pawlina (hondrocit 10–30 µm v izogenih skupinah, adipocit 50–150 µm).

export const kita = {
  id: "kita",
  ime: "Kita in vez",
  opis: "Vzdolžni prerez kite. Snopi kolagenskih vlaken so vzporedni in rahlo valoviti, med njimi so v vrstah podolgovata jedra fibroblastov (tenocitov).",
  barvanje: "he",
  velikost: [2600, 1400],
  zacetek: { m: 100, sredisce: [0, 0] },
  imena: { 2: "fibroblast (tenocit)" },
  snovi: { 3: "kolagenska vlakna (kolagen tipa I)" },
  isci: "Opazuj valovitost kolagenskih snopov in vrste sploščenih jeder med njimi.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(2600.0, 1400.0), 11.0);
  if (rob > 0.0) return t;
  // snopi (~40–100 µm) imajo vsak svoj val (»crimp«): perioda 20–55 µm, amplituda 1,5–4,5 µm; med njimi endotenon
  // meja med snopi sledi valu vlaken (ni ravna črta)
  float yb = p.y + 25.0 * (sum(vec2(p.x / 500.0, 2.0)) - 0.5) + 2.5 * sin(6.2832 * p.x / 34.0 + 2.0 * sum(p / 300.0));
  float bw = yb / 70.0 + 0.4 * (sum(vec2(p.x / 300.0, yb / 210.0)) - 0.5);
  float bi = floor(bw);
  vec4 hb = h42(vec2(bi, 7.0));
  float per = 20.0 + 35.0 * hb.x, A = 1.5 + 3.0 * hb.y;
  float fz = 6.2832 * p.x / per + 6.2832 * hb.z + 2.0 * sum(p / 300.0);
  float val = A * sin(fz);
  float y = p.y + val;
  float dval = A * 6.2832 / per * cos(fz);
  // endotenon: tanka reža med snopi, mestoma razprta, drugje sklenjena
  float endo = crta((fract(bw) - 0.5) * 70.0 - 35.0 * sign(fract(bw) - 0.5), 0.5 + 1.6 * hb.w * sum(vec2(p.x / 80.0, bi)), px)
    * smoothstep(0.3, 0.5, sum(vec2(p.x / 110.0, bi * 1.7)));
  vec2 smer = normalize(vec2(1.0, -dval));
  t.snov = S_KOLAGEN; t.smer = smer;
  float vid = 1.0 - smoothstep(0.4, 1.0, px);
  float vl = 0.5 + 0.5 * sin(y * 2.2 + 3.0 * sum(vec2(p.x / 40.0, y / 3.0)));
  t.dye = vec3(0.03, (0.4 + 0.06 * hb.w) + 0.08 * mix(0.5, vl, vid) + 0.06 * (sumL(p, 120.0, px) - 0.5), 0.0);
  t.dye.y *= 1.0 - 0.7 * endo;
  // vrste tenocitov na ~18 µm
  float W = 18.0;
  float i = floor(y / W);
  float v = y - (i + 0.5) * W;
  t.dye.y -= 0.12 * crta(v, 0.6, px);
  float kk = floor(p.x / 30.0);
  for (int d = -1; d <= 1; d++) {
    float m = kk + float(d);
    vec4 g = h42(vec2(m, i));
    if (g.z > 0.55) continue;
    vec2 q = vec2(p.x - (m + 0.5 + 0.5 * (g.x - 0.5)) * 30.0, v);
    float dj = sdElipsa(q, vec2(6.5 + 2.0 * g.y, 0.9)) + 0.15 * (sum(q + g.xy * 9.0) - 0.5);
    float jk = pokrij(dj, px);
    if (jk > 0.0) {
      t.dye.x = mix(t.dye.x, 1.0 * kromatin(q, g.xy, px), jk);
      if (jk > 0.5) { t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = dj; t.jc = p - q; t.cc = t.jc; t.cid = vec2(m, i); t.meja = 0.6 - dj; }
    }
  }
  return t;
}`,
};

export const vezivo = {
  id: "vezivo",
  ime: "Gosto neurejeno vezivo",
  opis: "Vezivo ovojnic (fascij, sklepnih ovojnic, pokostnice). Debeli snopi kolagenskih vlaken potekajo v različnih smereh, med njimi so fibroblasti in drobne žile.",
  barvanje: "he",
  velikost: [2400, 1600],
  zacetek: { m: 100, sredisce: [0, 0] },
  imena: { 2: "fibroblast" },
  snovi: { 3: "kolagenska vlakna", 0: "prostor med snopi" },
  isci: "Primerjaj s kito: tu snopi niso vzporedni, ampak se prepletajo.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(2400.0, 1600.0), 12.0);
  if (rob > 0.0) return t;
  // snopi: smer vlaken se počasi spreminja (polje smeri), ponekod prečno prerezani snopi, ozke razpoke med njimi
  float kot = 6.2832 * fbm(p / 260.0 + 3.0, 3);
  vec2 smer = vec2(cos(kot), sin(kot));
  float prerez = smoothstep(0.62, 0.66, fbm(p / 150.0 + 11.0, 2));
  t.snov = S_KOLAGEN; t.smer = smer * (1.0 - step(0.5, prerez));
  float vid = 1.0 - smoothstep(0.4, 1.0, px);
  // vzdolžni snopi: valoviti, z režami med njimi; prečno prerezani snopi so drobno pikčasti
  vec2 kg = kolagen(p, smer, 14.0, 0.52, 0.15, 3.0, px);
  float vl = sumL(p, 1.6, px);
  t.dye = vec3(0.04, mix(kg.x, 0.47 + 0.12 * mix(0.5, vl, vid), prerez) + 0.05 * (sumL(p, 90.0, px) - 0.5), 0.0);
  if (kg.y > 0.6 && prerez < 0.5) t.snov = S_PRAZNO;
  vec2 h = vec2(0.0);
  // fibroblasti ob robovih snopov
  vec4 f = krogci(p, 34.0, 1.0, 1.0, 0.7, 4.0);
  vec2 q = rot(-kot) * (p - f.yz);
  float dj = sdElipsa(q, vec2(5.0, 1.0)) + 0.15 * (sum(q + f.w) - 0.5);
  float jk = pokrij(dj, px);
  if (jk > 0.0) {
    t.dye.x = mix(t.dye.x, kromatin(q, vec2(f.w), px), jk);
    if (jk > 0.5) { t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = dj; t.jc = f.yz; t.cc = f.yz; t.cid = vec2(f.w, 2.0); t.meja = 0.7 - dj; }
  }
  // drobne žile
  vec4 z2 = krogci(p, 260.0, 9.0, 22.0, 0.6, 7.0);
  zila(t, p - z2.yz, length(p - z2.yz) - z2.x, 3.0, vec2(z2.w), px);
  return t;
}`,
};

export const hrustanec = {
  id: "hrustanec",
  ime: "Hialini hrustanec",
  opis: "Hialini hrustanec (npr. sklepni ali rebrni). Hondrociti ležijo v lakunah, pogosto po dva do štirje skupaj (izogene skupine). Matriks je rahlo modrikast, okoli skupin temnejši.",
  barvanje: "he",
  velikost: [2400, 1500],
  zacetek: { m: 100, sredisce: [0, 0] },
  imena: { 2: "hondrocit" },
  snovi: { 9: "hrustančni matriks (proteoglikani in kolagen tipa II)", 0: "lakuna" },
  isci: "Poišči izogene skupine hondrocitov in perihondrij ob robu, kjer so celice sploščene.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(2400.0, 1500.0), 13.0);
  if (rob > 0.0) return t;
  float g = -rob;                       // globina od roba (perihondrij)
  t.snov = S_MATRIKS;
  t.dye = vec3(0.22 + 0.05 * sumL(p, 40.0, px), 0.22 + 0.04 * sumL(p, 25.0, px), 0.0);
  if (g < 60.0) {
    // perihondrij: rožnato vezivo, sploščeni fibroblasti vzporedno z robom
    float pk = 1.0 - smoothstep(30.0, 60.0, g);
    t.dye = mix(t.dye, vec3(0.05, 0.45, 0.0), pk);
    if (pk > 0.5) { t.snov = S_KOLAGEN; t.smer = vec2(1.0, 0.0); }
  }
  Vor v = vor(p, 46.0, vec2(1.0), 0.4, 0.9);
  vec4 h = h42(v.id);
  float n = 1.0 + floor(h.x * 3.99);
  float ploscat = smoothstep(120.0, 30.0, g);
  vec2 os = vec2(cos(h.y * 6.28), sin(h.y * 6.28));
  // teritorialni matriks
  float dg = 1e3;
  T c = prazno();
  // izogena skupina: 1–4 celice, ki so se razdelile in ležijo tesno skupaj (pari ali kupček 2 × 2), ločene s tanko
  // pregrado matriksa
  vec2 rg = vec2(6.0 + 2.0 * h.z, (5.0 + 1.5 * h.w) * (1.0 - 0.6 * ploscat));
  for (int i = 0; i < 4; i++) {
    if (float(i) >= n) break;
    vec4 hi = h42(v.id + float(i) * 7.0);
    vec2 ol = n < 2.5 ? vec2((float(i) - 0.5 * (n - 1.0)) * 2.0 * rg.x + 0.9, 0.0)
                      : vec2((mod(float(i), 2.0) - 0.5) * (2.0 * rg.x + 0.9), (floor(float(i) / 2.0) - 0.5) * (2.0 * rg.y + 0.9));
    ol += 1.2 * (hi.xy - 0.5);
    vec2 o = transpose(rot(h.y * 6.28)) * ol;
    vec2 q = p - v.c - o;
    vec2 r = rg * (0.9 + 0.2 * hi.x);
    float dl = sdElipsa(rot(h.y * 6.28) * q, r) + 0.4 * (sum(q * 0.4 + hi.zw * 9.0) - 0.5);
    dg = min(dg, dl);
    if (dl < 0.0) {
      // lakuna in skrčena celica v njej
      c.snov = S_PRAZNO;
      c.dye = vec3(0.02, 0.04, 0.0);
      // celica se ob pripravi različno skrči in odmakne od roba lakune
      float sk = 0.68 + 0.27 * hi.z;
      vec2 ecc = (hi.wx - 0.5) * r * (1.0 - sk) * 1.6;
      float dc = sdElipsa(rot(h.y * 6.28) * q - ecc, r * sk) + 0.3;
      if (dc < 0.0) {
        c.snov = S_CITO; c.tip = C_FIBROBLAST; c.meja = -dc; c.cc = v.c + o; c.jc = c.cc; c.cid = v.id + float(i);
        c.dye = vec3(0.16 + 0.06 * sumL(q, 1.2, px), 0.3, 0.0);
        vec2 qj = rot(h.y * 6.28) * q - ecc;
        float dj = length(qj * vec2(1.0, 1.2)) - 2.4;
        c.jedro = dj;
        float jk = pokrij(dj, px);
        c.dye.x = mix(c.dye.x, 0.95 * kromatin(qj, hi.zw, px), jk);
        if (jk > 0.5) c.snov = S_JEDRO;
      }
      float kk = pokrij(dl, px);
      c.dye = mix(t.dye, c.dye, kk);
      if (kk > 0.5) return c;
      t.dye = c.dye;
    }
  }
  // teritorialni matriks: temnejši obroč okoli skupine, ki ugasne pred mejo celice Voronoja (sicer oglati robovi)
  t.dye.x += 0.32 * smoothstep(14.0, 2.0, dg) * smoothstep(0.0, 9.0, v.rob) * (1.0 - ploscat);
  t.dye.x += 0.25 * crta(dg, 0.5, px);
  return t;
}`,
};

export const mascevje = {
  id: "mascevje",
  ime: "Maščevje",
  opis: "Belo maščevje. Adipociti so velike celice, ki jih skoraj v celoti zapolni ena kapljica maščobe; pri pripravi preparata se maščoba raztopi, zato so celice videti prazne, jedro je stisnjeno ob rob.",
  barvanje: "he",
  velikost: [2400, 1600],
  zacetek: { m: 100, sredisce: [0, 0] },
  imena: { 14: "adipocit", 2: "fibroblast" },
  snovi: { 6: "maščobna kapljica (trigliceridi)" },
  isci: "Poišči jedro adipocita, stisnjeno ob rob celice (»pečatni prstan«).",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(2400.0, 1600.0), 14.0);
  if (rob > 0.0) return t;
  // pregrade veziva med lobuli
  vec2 w = p + 20.0 * vec2(sum(p / 120.0) - 0.5, sum(p / 120.0 + 5.0) - 0.5) + 18.0 * vec2(sum(p / 45.0 + 2.0) - 0.5, sum(p / 45.0 + 9.0) - 0.5);
  vec2 wl = p + 200.0 * (vec2(fbm(p / 400.0, 2), fbm(p / 400.0 + 6.0, 2)) - 0.5) * 2.0 + 40.0 * (vec2(sum(p / 120.0), sum(p / 120.0 + 3.0)) - 0.5);
  Vor lob = vor(wl, 700.0, vec2(1.0), 0.2, 0.9);
  float sd = 5.0 + 22.0 * sum(wl / 300.0 + 1.0);
  if (lob.rob < sd) {
    t.snov = S_KOLAGEN; t.smer = vec2(lob.nb.y, -lob.nb.x);
    vec2 kg = kolagen(p, t.smer, 6.0, 0.44, 0.3, 5.0, px);
    t.dye = vec3(0.05, kg.x, 0.0);
    if (kg.y > 0.6) t.snov = S_PRAZNO;
    vec4 z = krogci(p, 80.0, 6.0, 10.0, 0.5, 3.0);
    zila(t, p - z.yz, length(p - z.yz) - z.x, 2.0, vec2(z.w), px);
    return t;
  }
  Vor v = vor(w, 85.0, vec2(1.0), 0.0, 0.8);
  vec4 h = h42(v.id);
  t.snov = S_LIPID; t.tip = C_ADIPOCIT; t.meja = v.rob; t.cc = v.c; t.jc = v.c; t.cid = v.id;
  t.dye = vec3(0.0, 0.015 * sumL(p, 10.0, px), 0.0);
  // tanka stena (citoplazma in membrana) je vidna tudi pri majhni povečavi zaradi loma ob robu maščobe
  float stena = crta(v.rob, max(0.7, 0.6 * px), px);
  t.dye.y += 0.55 * stena;
  if (v.rob < 1.4) { t.snov = S_CITO; t.meja = v.rob; }
  // stisnjeno jedro ob robu (v ~25 % celic zadeto)
  if (h.y < 0.25) {
    vec2 q = p - v.c;
    float r0 = length(q);
    float a = atan(q.y, q.x) - h.x * 6.28;
    float b = abs(atan(sin(a), cos(a))) * r0;
    float dj = sdElipsa(vec2(b, v.rob - 1.3), vec2(6.0, 1.2));
    float jk = pokrij(dj, px);
    t.dye.x = mix(t.dye.x, 0.9 * kromatin(q, h.zw, px), jk);
    if (jk > 0.5) { t.snov = S_JEDRO; t.jedro = dj; }
  }
  // kapilare v vogalih
  vec4 z = krogci(p, 60.0, 2.6, 3.4, 0.5, 8.0);
  if (z.x < 0.5 && v.rob < 6.0) { t.dye.y += 0.5 * pokrij(z.x, px); if (z.x < 0.0) { t.snov = S_ERITROCIT; t.meja = -z.x; } }
  return t;
}`,
};
