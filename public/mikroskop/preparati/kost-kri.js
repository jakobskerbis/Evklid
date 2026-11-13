// Preparati: kompaktna kost (prečni prerez, razapnjena, HE) in krvni razmaz (Giemsa). Mere: Junqueira, Osnove
// histologije; Ross in Pawlina, Histology (osteon 100–250 µm, lamele 3–7 µm, lakune ~15 × 5 µm; eritrocit 7,5 µm).

export const kost = {
  id: "kost",
  ime: "Kompaktna kost",
  opis: "Prečni prerez zbite kosti. Kost je zgrajena iz osteonov: okoli Haversovega kanala z žilo so koncentrične lamele, v lakunah med njimi so kostne celice (osteociti).",
  barvanje: "he",
  velikost: [2600, 1700],
  zacetek: { m: 40, sredisce: [0, 0] },
  imena: { [2]: "osteocit", 1: "celica" },
  snovi: { 4: "kostni matriks (kolagen in kristali hidroksiapatita)", 0: "Haversov kanal / lakuna" },
  isci: "Poišči osteon, Haversov kanal v njegovem središču in osteocite v lakunah. Pri 400× opazuj lamele.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(2600.0, 1700.0), 3.0);
  if (rob > 0.0) return t;
  Vor v = vor(p, 230.0, vec2(1.0), 0.3, 0.9);
  vec4 h = h42(v.id);
  float R = min(100.0 + 35.0 * h.x, v.d + v.rob - 4.0);   // osteoni so tesno zloženi, med njimi le ozki pasovi intersticijskih lamel
  vec2 q = p - v.c;
  float r = length(q) * (1.0 + 0.1 * (sum(q / 55.0 + h.zw * 9.0) - 0.5));
  float rc = 11.0 + 13.0 * h.y;
  vec2 lc = q;
  float rr = r;
  bool osteon = r < R;
  if (!osteon) {
    Vor w = vor(p + 117.0, 150.0, vec2(1.0), 1.1, 0.9);
    lc = p + 117.0 - w.c;
    rr = length(lc) * 0.55 + 130.0;
  }
  if (rob > -130.0) { rr = -rob + 4.0; lc = vec2(0.0, rr); osteon = false; }
  // matriks: eozin z rahlimi lamelami (5,5 µm)
  // lamele: v osteonu pravilni obroči, med osteoni (intersticijske lamele, ostanki starih osteonov) šibke in nepravilne
  float lam = sin(6.2832 * rr / 5.5 + (osteon ? 2.5 : 9.0) * sum(lc / 30.0)) * (0.6 + 0.4 * sum(lc / 20.0 + 3.0)) * (osteon ? 1.0 : 0.35);
  float vid = 1.0 - smoothstep(1.5, 3.0, px);
  t.snov = S_MINERAL;
  t.dye = vec3(0.06 + 0.03 * sumL(p, 30.0, px), 0.42 + 0.05 * lam * vid + 0.08 * (sumL(p, 90.0, px) - 0.5), 0.0);
  t.smer = mod(floor(rr / 5.5), 2.0) < 0.5 ? normalize(vec2(-lc.y, lc.x) + 1e-4) : vec2(0.0);
  // cementna črta (meja osteona)
  if (osteon) t.dye.x += 0.55 * crta(r - R, 0.9, px);
  // Haversov kanal z žilo, krvničkami in celicami ob robu
  if (osteon && r < rc + 1.5) {
    float k = pokrij(r - rc, px);
    T c = prazno();
    c.dye = vec3(0.03, 0.08 + 0.05 * sumL(p, 6.0, px), 0.0);
    vec2 zo = rot(h.z * 6.28) * vec2(rc * 0.35, 0.0);
    float rz = rc * 0.42;
    float dz = length(q - zo) - rz;
    c.dye.y += 0.35 * crta(dz, 0.6, px);
    if (dz < 0.0) {
      Vor e = vor(q, 4.2, vec2(1.0), 0.0, 0.8);
      float ery = pokrij(e.d - 1.8, px) * step(h12(e.id + 3.0), 0.6);
      c.dye.y += 0.75 * ery;
      if (ery > 0.5) { c.snov = S_ERITROCIT; c.meja = 1.8 - e.d; }
    }
    // podolgovata jedra celic ob robu kanala
    float a = atan(q.y, q.x);
    float s = a * rc;
    float j = floor(s / 9.0);
    vec2 jz = vec2((fract(s / 9.0) - 0.5) * 9.0, r - rc + 1.3);
    float jd = sdElipsa(jz, vec2(3.0, 0.9));
    if (h12(vec2(j, v.id.x + 7.0)) < 0.7) { c.dye.x += 0.9 * pokrij(jd, px); if (jd < 0.0) { c.snov = S_JEDRO; c.jedro = jd; c.tip = C_FIBROBLAST; } }
    t.dye = mix(t.dye, c.dye, k);
    if (k > 0.5) { c.smer = vec2(0); return c; }
    return t;
  }
  // lakune z osteociti (v obročih na 9 µm, na loku na ~22 µm)
  float th = atan(lc.y, lc.x);
  float k0 = floor(rr / 9.0);
  for (int dk = -1; dk <= 1; dk++) {
    float k = k0 + float(dk);
    float rk = (k + 0.5) * 9.0;
    if (osteon && rk < rc + 6.0) continue;
    float s = th * rk;
    float n = floor(s / 22.0);
    for (int dj = -1; dj <= 1; dj++) {
      float j = n + float(dj);
      vec4 g = h42(vec2(j, k) + v.id * 31.0 + (osteon ? 0.0 : 5.0));
      if (g.z > 0.62) continue;
      float tj = (j + 0.5 + 0.35 * (g.x - 0.5)) * 22.0 / rk;
      float rj = rk + 2.5 * (g.y - 0.5);
      vec2 c = rj * vec2(cos(tj), sin(tj));
      vec2 z = rot(-(tj + 1.5708)) * (lc - c);
      float aL = 6.0 + 2.0 * g.w, bL = 2.2 + 0.6 * g.x;
      float dl = sdElipsa(z, vec2(aL, bL));
      if (dl > 2.0) continue;
      // kanalčki: tanke radialne črtice iz lakune
      float kan = crta(z.x - 2.5 * sin(z.y * 0.6 + g.y * 9.0), 0.25, px) * smoothstep(bL + 6.0, bL, abs(z.y)) * step(abs(z.x), aL);
      t.dye.x += 0.18 * kan * vid;
      float rob2 = crta(dl, 0.5, px);
      t.dye.x += 0.25 * rob2;
      if (dl < 0.0) {
        float dc = sdElipsa(z, vec2(aL - 0.6, bL - 0.3));
        T c2 = prazno();
        c2.dye = vec3(0.12, 0.1, 0.0);
        if (dc < 0.0) {
          c2.snov = S_CITO; c2.tip = C_FIBROBLAST; c2.meja = -dc; c2.cid = vec2(j, k) + v.id * 7.0;
          c2.cc = v.c + c; c2.jc = c2.cc;
          c2.dye = vec3(0.12, 0.3, 0.0);
          float dj2 = sdElipsa(z - vec2(0.4 * (g.y - 0.5), 0.0), vec2(aL - 2.6, bL - 0.9));
          c2.jedro = dj2;
          float jk = pokrij(dj2, px);
          c2.dye.x = mix(c2.dye.x, 1.05 * kromatin(z, c2.cid, px), jk);
          if (jk > 0.5) c2.snov = S_JEDRO;
        }
        c2.meja = min(c2.meja, abs(dc));
        float kk = pokrij(dl, px);
        t.dye = mix(t.dye, c2.dye, kk);
        if (kk > 0.5) return c2;
      }
    }
  }
  return t;
}`,
};

export const kri = {
  id: "kri",
  ime: "Krvni razmaz",
  opis: "Tanka plast krvi na stekelcu, obarvana po Giemsi. Največ je eritrocitov brez jedra; med njimi so redki levkociti z jedrom in drobni trombociti.",
  barvanje: "giemsa",
  velikost: [3000, 900],
  zacetek: { m: 400, sredisce: [900, 0] },
  imena: { 15: "levkocit", 3: "limfocit" },
  snovi: { 5: "eritrocit (rdeča krvnička)", 14: "krvna plazma" },
  isci: "Pri 400× poišči levkocite: nevtrofilec ima jedro z več režnji, limfocit okroglo temno jedro. Trombociti so drobne vijolične pike.",
  glsl: "#define SEM_PROSTE\n" + /* glsl */ `
// Levkocit vrste v (0 nevtrofilec, 1 limfocit, 2 monocit, 3 eozinofilec, 4 bazofilec) s središčem c in semenom h.
T levkocit(vec2 p, vec2 c, vec4 h, float px) {
  T t = prazno();
  float v = h.x < 0.55 ? 0.0 : h.x < 0.85 ? 1.0 : h.x < 0.93 ? 2.0 : h.x < 0.985 ? 3.0 : 4.0;
  float R = v == 1.0 ? 4.4 : v == 2.0 ? 8.5 : 6.2;
  vec2 q = rot(h.y * 6.28) * (p - c);
  float d = length(q) - R - 0.4 * (sum(q / 3.0 + h.zw * 7.0) - 0.5);
  if (d > px) return t;
  t.snov = S_CITO; t.tip = v == 1.0 ? C_LIMFOCIT : C_LEVKOCIT; t.meja = -d; t.cc = c; t.jc = c; t.cid = h.zw * 1000.0;
  t.dye = v == 1.0 ? vec3(0.05, 0.08, 0.55) : v == 2.0 ? vec3(0.12, 0.15, 0.4) : vec3(0.1, 0.35, 0.08);
  float vid = 1.0 - smoothstep(0.3, 0.8, px);
  if (v == 3.0) t.dye.y += 0.55 + 0.45 * smoothstep(0.55, 0.7, sumL(q, 0.45, px)) * vid;
  if (v == 4.0) t.dye.x += 0.9 * smoothstep(0.55, 0.7, sumL(q, 0.5, px));
  if (v == 0.0) t.dye.y += 0.15 * smoothstep(0.5, 0.7, sumL(q, 0.25, px));
  // jedro
  float dj;
  if (v == 0.0) {
    dj = 1e3;
    float n = 3.0 + floor(h.z * 2.5);
    for (int i = 0; i < 5; i++) {
      if (float(i) >= n) break;
      vec2 lc = 2.6 * vec2(cos(float(i) * 6.28 / n * 0.8 + 0.5), sin(float(i) * 6.28 / n * 0.8 + 0.5));
      dj = min(dj, length(q - lc) - 1.55);
      dj = min(dj, sdKapsula(rot(-float(i) * 1.0) * (q - lc * 0.6), 0.9, 0.35));
    }
  } else if (v == 1.0) {
    dj = length(q - vec2(0.5, 0.0)) - 3.6;
  } else if (v == 2.0) {
    dj = max(sdElipsa(q, vec2(5.3, 3.9)), -(length(q - vec2(0.0, 4.6)) - 2.6));
  } else {
    dj = min(length(q - vec2(-2.0, 0.3)) - 2.2, length(q - vec2(2.0, -0.3)) - 2.2);
  }
  dj += 0.25 * (sum(q * 1.5 + h.xy * 9.0) - 0.5);
  t.jedro = dj;
  float jk = pokrij(dj, px);
  float kr = kromatin(q, h.zw, px);
  t.dye.x = mix(t.dye.x, (v == 1.0 ? 1.25 : 0.95) * kr, jk);
  t.dye.y = mix(t.dye.y, 0.12, jk);
  if (jk > 0.5) t.snov = S_JEDRO;
  t.dye *= pokrij(d, px);
  return t;
}
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(3000.0, 900.0), 5.0);
  if (rob > 0.0) return t;
  // debelina razmaza: levo gosto (kupčki), desno redko (pernati rob)
  float gost = clamp(0.92 - 0.5 * (p.x + 3000.0) / 6000.0, 0.38, 0.95);
  t.snov = S_PLAZMA;
  t.dye = vec3(0.0, 0.03 + 0.02 * sumL(p, 20.0, px), 0.0);
  // levkociti: mreža 140 µm, en na celico z verjetnostjo 0,45
  Vor wv = vor(p, 140.0, vec2(1.0), 0.0, 0.8);
  vec4 hw = h42(wv.id + 4.0);
  if (hw.w < 0.45 && wv.d < 10.0) {
    T l = levkocit(p, wv.c, hw, px);
    if (l.snov != S_PRAZNO) return l;
  }
  // trombociti
  Vor tv = vor(p, 16.0, vec2(1.0), 0.0, 0.9);
  vec4 ht = h42(tv.id + 9.0);
  float dt = length(rot(ht.x * 6.0) * (p - tv.c) * vec2(1.0, 1.4)) - 1.1 - 0.4 * ht.y;
  // eritrociti: 7,5 µm, svetlejša sredina (dvojno vbočena ploščica). Vsak je svoja ploščica: kjer se dve prekrivata,
  // se barva sešteje in rob spodnje ostane viden (v tankem delu razmaza se skoraj ne dotikajo).
  // Dve med seboj zasukani mreži z naključno lego v vsakem polju: krvničke niso v vrstah ali stolpcih (pregled PR #644).
  float S = 12.2;
  float vsota = 0.0, robovi = 0.0, najR = 1e3;
  vec2 najC = vec2(0.0); float najW = 0.0;
  for (int pl = 0; pl < 2; pl++) {
  mat2 M = pl == 0 ? mat2(1.0) : rot(0.71);
  vec2 o = pl == 0 ? vec2(0.0) : vec2(5.3, 2.9);
  vec2 pp = M * p + o;
  vec2 n0 = floor(pp / S);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 k = n0 + vec2(i, j);
    vec4 he = h42(k + 0.37 + 91.0 * float(pl));
    if (he.w > gost) continue;
    vec2 c = transpose(M) * ((k + 0.5 + 0.9 * (he.xy - 0.5)) * S - o);
    float R = 3.35 + 0.45 * he.z;
    vec2 q = p - c;
    // ne povsem okrogli (±6 %)
    vec2 qe = rot(he.x * 6.28) * q * vec2(1.0 + 0.12 * (he.y - 0.5), 1.0 - 0.12 * (he.y - 0.5));
    float de = length(qe) - R + 0.18 * (sum(q * 1.3 + he.w * 7.0) - 0.5);
    if (de > px) continue;
    float rr = length(qe) / R;
    float k1 = pokrij(de, px);
    // debelina: sredina ~1 µm, rob ~2,5 µm, zato je sredina svetla
    float deb = 0.28 + 0.72 * smoothstep(0.12, 0.8, rr) - 0.08 * smoothstep(0.85, 1.0, rr);
    vsota += k1 * ((0.36 + 0.07 * (he.z - 0.5)) * deb + 0.04 * sumL(q, 1.2, px));
    robovi += crta(de, 0.25, px);
    if (de < najR) { najR = de; najC = c; najW = dot(k, vec2(7.0, 13.0)) + he.z + 0.5 * float(pl); }
  }
  }
  if (vsota > 0.0 || robovi > 0.0) {
    t.dye = vec3(0.02, t.dye.y + min(vsota, 0.85) + 0.05 * min(robovi, 1.5), 0.0);
    if (najR < 0.0) { t.snov = S_ERITROCIT; t.meja = -najR; t.cc = najC; t.cid = vec2(najW, 1.0); }
  }
  if (ht.z < 0.12 && dt < px) {
    float k = pokrij(dt, px);
    // trombocit: svetlo modrikast rob (hialomera) in vijolična zrnca v sredini (granulomera)
    float zr = smoothstep(0.45, 0.7, sumL(p - tv.c, 0.3, px)) * smoothstep(0.2, -0.6, dt);
    t.dye = mix(t.dye, vec3(0.22 + 0.8 * zr, 0.08, 0.25), k);
    if (k > 0.5) { t.snov = S_CITO; t.tip = C_LEVKOCIT; t.meja = -dt; t.cc = tv.c; t.cid = tv.id; }
  }
  return t;
}`,
};
