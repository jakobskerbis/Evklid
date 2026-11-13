// Preparat: žilno-živčni snop (prečni prerez, HE) z mišično arterijo, spremljajočo veno in perifernim živcem v
// rahlem vezivu in maščevju. Trije vnosi (arterija, vena, živec) uporabljajo isti preparat z drugim začetnim mestom.
// Mere (Ross in Pawlina): mišična arterija ~2–3 mm, medija 10–40 plasti gladkih mišičnih celic; živčni snopič 0,2–1 mm;
// mielinizirano vlakno 1–20 µm, razmerje g ≈ 0,6.

const A = [-1100, 150];
const V = [1000, 250];
const N = [0, -950];

const GLSL = /* glsl */ `
const vec2 CA = vec2(${A[0]}.0, ${A[1]}.0);
const vec2 CV = vec2(${V[0]}.0, ${V[1]}.0);
const vec2 CN = vec2(${N[0]}.0, ${N[1]}.0);

T okolica(vec2 p, float px) {
  // rahlo vezivo in maščevje okoli struktur
  T t = prazno();
  vec2 w = p + 20.0 * vec2(sum(p / 140.0) - 0.5, sum(p / 140.0 + 5.0) - 0.5);
  Vor v = vor(w, 80.0, vec2(1.0), 0.0, 0.8);
  float mast = smoothstep(0.45, 0.6, sum(p / 500.0 + 3.0));
  if (mast > 0.5) {
    t.snov = S_LIPID; t.tip = C_ADIPOCIT; t.meja = v.rob; t.cc = v.c; t.cid = v.id;
    t.dye = vec3(0.01, 0.45 * crta(v.rob, max(0.7, 0.45 * px), px), 0.0);
    return t;
  }
  t.snov = S_KOLAGEN; t.smer = normalize(vec2(sum(p / 60.0) - 0.5, sum(p / 60.0 + 4.0) - 0.5) + 1e-3);
  vec2 kg = kolagen(p, t.smer, 8.0, 0.36, 0.8, 6.0, px);
  t.dye = vec3(0.04, kg.x, 0.0);
  if (kg.y > 0.6) t.snov = S_PRAZNO;
  vec4 f = krogci(p, 40.0, 1.0, 1.0, 0.5, 21.0);
  vec2 q = p - f.yz;
  float dj = sdElipsa(rot(f.w) * q, vec2(4.5, 1.1));
  if (dj < px) { t.dye.x += 0.9 * pokrij(dj, px); if (dj < 0.0) { t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = dj; t.jc = f.yz; t.cc = f.yz; t.cid = vec2(f.w, 5.0); } }
  vec4 z = krogci(p, 300.0, 8.0, 20.0, 0.5, 9.0);
  zila(t, p - z.yz, length(p - z.yz) - z.x, 3.0, vec2(z.w), px);
  return t;
}

// Gladke mišične celice, ki potekajo krožno (q glede na središče, r polmer).
T medija(vec2 q, float r, float th, vec2 seme, float px) {
  vec2 z = vec2(th * 700.0, r);
  Vor v = vor(z, 6.0, vec2(8.0, 1.0), 0.0, 0.9);
  vec4 h = h42(v.id + seme);
  T t = prazno();
  t.snov = S_CITO; t.tip = C_GLADKA; t.meja = v.rob; t.cc = v.c; t.jc = v.c; t.cid = v.id + seme;
  t.smer = vec2(-q.y, q.x) / max(r, 1.0);
  t.dye = vec3(0.07, 0.5 + 0.05 * (sumL(z, 20.0, px) - 0.5) - 0.1 * crta(v.rob, 0.25, px), 0.0);
  if (h.y < 0.5) {
    vec2 lz = z - v.c;
    float dj = sdKapsula(lz, 5.5 + 2.0 * h.w, 1.1) + 0.15 * (sum(lz + h.zw * 9.0) - 0.5);
    float jk = pokrij(dj, px);
    t.dye.x = mix(t.dye.x, 0.85 * kromatin(lz, h.zw, px), jk);
    t.jedro = dj;
    if (jk > 0.5) t.snov = S_JEDRO;
  }
  return t;
}

T arterija(vec2 p, float px) {
  vec2 q = p - CA;
  float r = length(q), th = atan(q.y, q.x);
  float Rl = 520.0 + 12.0 * sin(th * 30.0) + 25.0 * (sum(vec2(th * 2.0, 1.0)) - 0.5);
  float Rm = Rl + 250.0 + 15.0 * (sum(vec2(th * 3.0, 7.0)) - 0.5);
  float Ra = Rm + 170.0;
  T t = prazno();
  if (r < Rl) {
    t.snov = S_PLAZMA;
    t.dye = vec3(0.0, 0.05, 0.0);
    vec4 e = krogci(q, 7.2, 3.2, 3.7, smoothstep(0.55, 0.75, sum(q / 90.0)) * 0.85, 31.0);
    if (e.x < 0.0) { t.dye.y = 0.72; t.snov = S_ERITROCIT; t.meja = -e.x; }
    return t;
  }
  float d = r - Rl;
  if (d < 2.0) {
    t.snov = S_CITO; t.tip = C_SPLOSNA; t.meja = min(d, 2.0 - d); t.cc = CA + q / r * (Rl + 1.0); t.cid = vec2(floor(th * 60.0), 9.0);
    t.dye = vec3(0.1, 0.4, 0.0);
    float jn = abs(fract(th * Rl / 16.0) - 0.5) * 16.0;
    float dj = sdElipsa(vec2(jn, d - 1.0), vec2(4.0, 0.9));
    if (dj < 0.0) { t.dye.x = 0.9; t.snov = S_JEDRO; t.jedro = dj; }
    return t;
  }
  // notranja elastična membrana: valovita, svetlo rožnata, lomna
  float iel = 4.5 + 1.2 * sin(th * Rl / 9.0);
  if (abs(d - iel) < 1.4) { t.snov = S_ELASTIN; t.dye = vec3(0.02, 0.85 * pokrij(abs(d - iel) - 1.2, px) + 0.3, 0.0); return t; }
  if (r < Rm) {
    T m = medija(q, r, th, vec2(1.0, 0.0), px);
    m.dye.y += 0.25 * crta(sin(r / 22.0 + 3.0 * sum(vec2(th * 30.0, 0.0))), 0.08, px);   // posamezna elastična vlakna
    m.dye.x += 0.35 * crta(r - Rm + 2.0, 0.8, px);                                     // zunanja elastična membrana
    return m;
  }
  if (r < Ra + 60.0 * (sum(vec2(th * 4.0, 3.0)) - 0.5)) {
    t = okolica(p, px);
    if (t.snov == S_LIPID) { t.snov = S_KOLAGEN; }
    // adventicija: gosti krožni snopi kolagena
    t.smer = vec2(-q.y, q.x) / r;
    vec2 kg = kolagen(p, t.smer, 6.0, 0.5, 0.3, 8.0, px);
    if (t.snov != S_JEDRO) { t.dye.y = kg.x; if (kg.y > 0.6) t.snov = S_PRAZNO; }
    return t;
  }
  return okolica(p, px);
}

T vena(vec2 p, float px) {
  vec2 q = rot(0.2) * (p - CV);
  float dl = sdElipsa(q, vec2(650.0, 330.0)) + 60.0 * (sum(q / 260.0) - 0.5);
  T t = prazno();
  if (dl < 0.0) {
    t.snov = S_PLAZMA; t.dye = vec3(0.0, 0.06, 0.0);
    vec4 e = krogci(q, 7.0, 3.2, 3.7, 0.92, 41.0);
    if (e.x < 0.0) { t.dye.y = 0.74 - 0.15 * smoothstep(1.5, 0.0, length(q - e.yz)); t.snov = S_ERITROCIT; t.meja = -e.x; }
    return t;
  }
  if (dl < 2.0) { t.snov = S_CITO; t.meja = min(dl, 2.0 - dl); t.dye = vec3(0.4 * step(0.8, fract(atan(q.y, q.x) * 40.0)), 0.35, 0.0); return t; }
  if (dl < 45.0) {
    T m = medija(q, dl + 500.0, atan(q.y, q.x), vec2(3.0, 0.0), px);
    m.dye.y -= 0.12 * smoothstep(0.4, 0.7, sum(q / 12.0));
    return m;
  }
  if (dl < 150.0) {
    t = okolica(p, px);
    if (t.snov == S_LIPID) t.snov = S_KOLAGEN;
    vec2 kg = kolagen(p, normalize(vec2(-q.y, q.x) + 1e-3), 6.0, 0.48, 0.35, 10.0, px);
    if (t.snov != S_JEDRO) { t.dye.y = kg.x; if (kg.y > 0.6) t.snov = S_PRAZNO; }
    // vzdolžni snopi gladkih mišic v adventiciji (prečno prerezani)
    if (sum(q / 40.0 + 2.0) > 0.66) { t.dye = vec3(0.1, 0.48, 0.0); t.snov = S_CITO; t.tip = C_GLADKA; }
    return t;
  }
  return okolica(p, px);
}

T zivec(vec2 p, float px, out bool v) {
  vec2 q = p - CN;
  v = false;
  float de = sdElipsa(q, vec2(680.0, 520.0)) + 50.0 * (sum(q / 300.0) - 0.5);
  if (de > 0.0) return prazno();
  v = true;
  // snopiči
  vec3 F[5] = vec3[5](vec3(-280.0, 120.0, 230.0), vec3(220.0, 170.0, 200.0), vec3(-60.0, -210.0, 240.0), vec3(330.0, -180.0, 140.0), vec3(-420.0, -160.0, 110.0));
  for (int i = 0; i < 5; i++) {
    vec2 z = q - F[i].xy;
    float df = length(z) - F[i].z - 12.0 * (sum(z / 70.0 + float(i)) - 0.5);
    if (df > 9.0) continue;
    T t = prazno();
    if (df > 0.0) {
      // perinevrij: tanke plasti sploščenih celic; ob notranji strani se snopič pri pripravi rad odmakne (svetla reža)
      float odmik = 2.5 * smoothstep(0.4, 0.7, sum(z / 90.0 + float(i) * 3.0));
      if (df < odmik) return t;
      t.snov = S_KOLAGEN; t.smer = vec2(-z.y, z.x) / length(z);
      t.dye = vec3(0.06 + 0.5 * crta(sin(df * 1.6 + 3.0 * sum(z / 40.0)), 0.2, px) * (1.0 - smoothstep(0.5, 1.2, px)), 0.46, 0.0);
      return t;
    }
    // aksoni z mielinom
    Vor a = vor(z, 7.0, vec2(1.0), 0.0, 0.85);
    vec4 h = h42(a.id + float(i) * 17.0);
    float R = 1.2 + 2.2 * h.x * h.x + 0.5;
    vec2 c = a.c;
    vec2 lz = z - c;
    float r = length(lz);
    float ra = 0.62 * R;
    t.snov = S_KOLAGEN; t.smer = vec2(0.0);
    t.dye = vec3(0.06, 0.34 + 0.08 * sumL(z, 1.0, px), 0.0);   // endonevrij: rožnata vlakenca
    if (h.y < 0.9 && r < R) {
      if (r < ra) {
        t.snov = S_CITO; t.tip = C_NEVRON; t.meja = ra - r; t.cc = CN + F[i].xy + c; t.cid = a.id + float(i) * 17.0; t.jedro = 1e3;
        t.dye = vec3(0.06, 0.38, 0.0);
      } else {
        t.snov = S_MIELIN; t.r1 = r - ra; t.cc = CN + F[i].xy + c;
        float nk = crta(sin(atan(lz.y, lz.x) * 7.0 + h.z * 9.0 + r * 1.5), 0.12, px);
        // mielin se pri parafinskem rezu raztopi: ostane svetel prostor z nežno rožnato mrežico (nevrokeratin)
        t.dye = vec3(0.02, 0.13 + 0.2 * nk * (1.0 - smoothstep(0.2, 0.6, px)) + 0.08 * sumL(lz * 3.0, 1.0, px), 0.0);
      }
    }
    // jedra Schwannovih celic (polmesec ob mielinu)
    if (h.z < 0.38 && r > R && r < R + 2.2) {
      float kot = atan(lz.y, lz.x) - h.w * 6.28;
      float b = abs(atan(sin(kot), cos(kot)));
      float dj = sdElipsa(vec2(b * R, r - R - 1.1), vec2(3.8, 1.2));
      if (dj < 0.0) { t.dye = vec3(0.9, 0.15, 0.0); t.snov = S_JEDRO; t.jedro = dj; t.tip = C_GLIJA; }
    }
    return t;
  }
  // epinevrij: gosto vezivo z maščevjem
  T t = okolica(p, px);
  if (t.snov != S_LIPID) t.dye.y += 0.12;
  return t;
}

T tkivo(vec2 p, float px) {
  float rob = odsek(p, vec2(2800.0, 1900.0), 15.0);
  if (rob > 0.0) return prazno();
  if (length(p - CA) < 1100.0) return arterija(p, px);
  if (length(rot(0.2) * (p - CV)) < 950.0) {
    T t = vena(p, px);
    return t;
  }
  bool v;
  T z = zivec(p, px, v);
  if (v) return z;
  return okolica(p, px);
}`;

const SKUPNO = {
  barvanje: "he",
  velikost: [2800, 1900],
  glsl: GLSL,
  imena: { 13: "gladka mišična celica", 4: "akson", 10: "Schwannova celica", 2: "fibroblast", 14: "adipocit" },
  snovi: { 8: "mielinska ovojnica", 15: "elastična membrana", 3: "kolagenska vlakna", 5: "eritrocit", 14: "krvna plazma" },
};

export const arterija = {
  ...SKUPNO,
  id: "arterija",
  osnova: "snop",
  ime: "Arterija",
  opis: "Prečni prerez mišične arterije v žilno-živčnem snopu. Stena ima tri plasti: notranjo (endotelij in valovita elastična membrana), srednjo (debela plast krožnih gladkih mišičnih celic) in zunanjo (vezivo).",
  zacetek: { m: 40, sredisce: A },
  sredisceBlizu: [A[0], A[1] + 690],
  isci: "Poišči valovito notranjo elastično membrano in krožno potekajoče gladke mišične celice v mediji. Primerjaj steno z veno desno.",
};
export const vena = {
  ...SKUPNO,
  id: "vena",
  osnova: "snop",
  ime: "Vena",
  opis: "Vena v istem snopu kot arterija: svetlina je večja in nepravilna, stena tanjša, srednja plast gladkih mišic je tanka, zunanja plast veziva pa debela.",
  zacetek: { m: 40, sredisce: V },
  isci: "Primerjaj debelino stene vene in arterije. V svetlini so eritrociti.",
};
export const zivec = {
  ...SKUPNO,
  id: "zivec",
  osnova: "snop",
  ime: "Periferni živec",
  opis: "Prečni prerez živca: snopiči živčnih vlaken, vsak obdan s perinevrijem. V snopiču so aksoni, oviti z mielinom (pri barvanju HE je mielin skoraj prozoren), med njimi jedra Schwannovih celic.",
  zacetek: { m: 100, sredisce: N },
  isci: "Pri 400× poišči akson v sredini mielinske ovojnice. Pri TEM nad 100 000× vidiš plasti mielina, ki si sledijo na približno 12 nm.",
};
