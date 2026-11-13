// Preparati žlez in sečil ter spolnih žlez (HE): trebušna slinavka (žleza z zunanjim izločanjem in Langerhansovi
// otočki), ščitnica, nadledvična žleza, sečni mehur, modo, jajčnik.
// Mere (Ross in Pawlina): acinus ~40 µm; otoček 100–200 µm; folikel ščitnice 50–500 µm; semenska cevka ~200 µm.

export const zleza = {
  id: "zleza",
  ime: "Trebušna slinavka",
  opis: "Trebušna slinavka je žleza: večino sestavljajo acinusi, skupki celic, ki izločajo prebavne encime (bazalno vijolične, ob svetlini rožnata zrnca). Svetlejši okrogli Langerhansovi otočki izločajo hormona inzulin in glukagon. Podobno so zgrajene slinavke.",
  barvanje: "he",
  velikost: [2400, 1500],
  zacetek: { m: 100, sredisce: [0, 0] },
  sredisceBlizu: [0, 0],
  imena: { 5: "acinarna celica", 0: "celica Langerhansovega otočka" },
  snovi: { 26: "zrnce z encimi (zimogen)" },
  isci: "Poišči Langerhansov otoček (svetel krog med acinusi). Pri TEM poišči zrnca zimogena in zrnati ER.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(2400.0, 1500.0), 31.0);
  if (rob > 0.0) return t;
  // pregrade med režnji
  // pregrade so valovite, različno debele, z režo ob robu
  vec2 pw = p + 60.0 * (vec2(fbm(p / 300.0, 2), fbm(p / 300.0 + 7.0, 2)) - 0.5) * 2.0;
  Vor L = vor(pw, 600.0, vec2(1.0), 0.0, 0.9);
  float pd = 4.0 + 14.0 * sum(pw / 250.0);
  if (L.rob < pd) {
    vec2 kg = kolagen(p, L.nb.yx * vec2(1.0, -1.0), 6.0, 0.45, 0.3, 2.0, px);
    t.snov = S_KOLAGEN; t.dye = vec3(0.04, kg.x * (1.0 - 0.8 * crta(pd - L.rob, 1.0, px)), 0.0);
    vec4 f = krogci(p, 22.0, 2.0, 2.0, 0.5, 13.0);
    float df = sdElipsa(rot(f.w) * (p - f.yz), vec2(4.0, 1.0));
    if (df < 0.0) { t.dye.x = 0.85; t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = df; }
    return t;
  }
  // Langerhansov otoček
  vec4 o = krogci(p, 700.0, 85.0, 130.0, 0.55, 3.0);
  if (o.x < 0.0) {
    Vor v = vor(p, 11.0, vec2(1.0), 0.0, 0.8);
    vec4 h = h42(v.id);
    t.snov = S_CITO; t.tip = C_ZLEZNA; t.meja = v.rob; t.cc = v.c; t.jc = v.c; t.cid = v.id;
    t.dye = vec3(0.07, 0.3 + 0.05 * sumL(p, 2.0, px), 0.0);
    if (fract(v.id.x * 0.37 + v.id.y * 0.61) < 0.12) { t.snov = S_ERITROCIT; t.dye = vec3(0.02, 0.7, 0.0); return t; }
    float dj = length(p - v.c) - 3.0;
    t.jedro = dj;
    float jk = pokrij(dj, px);
    t.dye.x = mix(t.dye.x, 0.8 * kromatin(p - v.c, h.zw, px), jk);
    if (jk > 0.5) t.snov = S_JEDRO;
    return t;
  }
  // acinusi: tesno zloženi, med njimi le tanke vezivne reže; mestoma izvodilo
  vec4 iz = krogci(p, 260.0, 10.0, 16.0, 0.5, 9.0);
  if (iz.x < 0.0) {
    vec2 q = p - iz.yz; float r = length(q);
    return cevka(q, 4.0, r - iz.x, 7.0, 0.6, C_ZLEZNA, vec2(iz.w, 9.0), p, px);
  }
  if (iz.x < 6.0) { t.snov = S_KOLAGEN; t.dye = vec3(0.04, 0.42, 0.0); return t; }
  T e = acinus(p, 34.0, 1.0, 7.0, px);
  return e;
}`,
};

export const scitnica = {
  id: "scitnica",
  ime: "Ščitnica",
  opis: "Ščitnica je zgrajena iz foliklov: kroglic, ki jih obdaja enoskladni kubični epitelij. V njih je rožnat koloid z beljakovino tiroglobulinom, iz katere celice izdelujejo hormona tiroksin in trijodtironin.",
  barvanje: "he",
  velikost: [2400, 1500],
  zacetek: { m: 100, sredisce: [0, 0] },
  sredisceBlizu: [0, 0],
  imena: { 5: "folikularna celica (tirocit)" },
  snovi: { 13: "koloid (tiroglobulin)" },
  isci: "Poišči folikle s koloidom in kubični epitelij okoli njih.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(2400.0, 1500.0), 32.0);
  if (rob > 0.0) return t;
  vec2 w = p + 15.0 * vec2(sum(p / 70.0) - 0.5, sum(p / 70.0 + 5.0) - 0.5);
  Vor v = vor(w, 120.0, vec2(1.0), 0.0, 0.85);
  vec4 h = h42(v.id);
  float pre = 3.0 + 2.0 * h.w;
  // folikli so okrogli: rob celice Voronoi zaobljen s krogom; v kotih med folikli ostane vezivo s kapilarami
  vec2 qf = w - v.c;
  float rq = length(qf);
  float dc = 72.0 * (0.9 + 0.3 * h.z) - rq;
  vec2 nv = dc < v.rob ? qf / max(rq, 1e-3) : v.nb;
  float rb = min(v.rob, dc);
  if (rb < pre) {
    t.snov = S_KOLAGEN; t.dye = vec3(0.05, 0.36, 0.0);
    vec4 e = krogci(p, 9.0, 2.6, 3.0, 0.35, 5.0);
    if (e.x < 0.0) { t.dye.y = 0.72; t.snov = S_ERITROCIT; t.meja = -e.x; }
    return t;
  }
  float H = 7.0 + 4.0 * h.x;
  float d = rb - pre;
  if (d < H) {
    T e = epitel(H - d, atan(qf.y, qf.x) * 50.0, H, 8.0, 0.4, C_ZLEZNA, v.id, p, -nv, px);
    e.dye.x += 0.05; // citoplazma tirocitov je rahlo bazofilna (vijoličasta)
    return e;
  }
  // koloid: gost rožnat, ob robu svetle vakuole (resorpcija)
  t.snov = S_KOLOID;
  t.dye = vec3(0.04, 0.68 + 0.06 * sumL(p, 20.0, px), 0.0);
  float vak = smoothstep(4.0, 0.0, d - H) * smoothstep(0.55, 0.6, sumL(w, 1.5, px));
  t.dye.y *= 1.0 - 0.8 * vak;
  t.dye.y *= 1.0 - 0.6 * smoothstep(0.03, 0.0, abs(sum(w / 30.0) - 0.5)) * step(0.8, h.y);      // razpoka pri rezanju
  return t;
}`,
};

export const nadledvicna = {
  id: "nadledvicna",
  ime: "Nadledvična žleza",
  opis: "Žleza z notranjim izločanjem. Pod ovojnico je skorja v treh plasteh (klobčičasta, snopasta s svetlimi celicami, polnimi maščobnih kapljic, in mrežasta); v sredici so celice, ki izločajo adrenalin. Podobno (v trakovih in skupkih) so zgrajene obščitnice in hipofiza.",
  barvanje: "he",
  velikost: [2400, 1500],
  zacetek: { m: 40, sredisce: [0, 0] },
  sredisceBlizu: [0, 900],
  imena: { 5: "endokrina celica" },
  snovi: { 6: "maščobna kapljica (holesterol za hormone)" },
  isci: "Poišči tri plasti skorje in sredico. Snopasta plast je svetla, ker so celice polne maščobnih kapljic.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(2400.0, 1500.0), 33.0);
  float ys = 1300.0 + 20.0 * sin(p.x / 300.0);
  if (rob > 0.0 || p.y > ys) return t;
  float d = ys - p.y;
  if (d < 25.0) { t.snov = S_KOLAGEN; t.dye = vec3(0.05, 0.55, 0.0); return t; }
  // meje med plastmi niso ravne
  float dn = d + 40.0 * (fbm(p / 260.0 + 2.0, 2) - 0.5) * 2.0;
  float plast = dn < 140.0 ? 0.0 : dn < 780.0 ? 1.0 : dn < 1000.0 ? 2.0 : 3.0;
  vec2 a = plast == 1.0 ? vec2(1.0, 3.0) : vec2(1.0);
  Vor v = vor(p, plast == 1.0 ? 15.0 : 13.0, a, 0.0, 0.8);
  vec4 h = h42(v.id);
  // sinusoidi: v glomeruloznem sloju okoli obokanih skupin celic, v fascikularnem med ravnimi trakovi (1–2 celici,
  // rahlo valoviti, mestoma povezani), v retikularnem in sredici mreža
  float sin0 = 100.0;
  if (plast == 0.0) { Vor g = vor(p + 10.0 * (vec2(sum(p / 30.0), sum(p / 30.0 + 4.0)) - 0.5), 42.0, vec2(1.6, 1.0), 0.0, 0.9); sin0 = g.rob; }
  else if (plast == 1.0) {
    float xs = p.x + 14.0 * (sum(vec2(p.x / 90.0, p.y / 160.0)) - 0.5) * 2.0;
    float per = 34.0;
    sin0 = abs(fract(xs / per) - 0.5) * per;
    if (h12(vec2(floor(xs / per), floor(p.y / 70.0))) < 0.2) sin0 = max(sin0, 3.0 * step(abs(fract(p.y / 70.0) - 0.5) * 70.0, 6.0)) ;
  } else {
    float m = fbm(p / (plast == 2.0 ? 30.0 : 55.0) + 3.0, 2);
    sin0 = abs(m - 0.5) * (plast == 2.0 ? 130.0 : 260.0);
  }
  if (sin0 < 2.5 + (plast == 3.0 ? 1.5 : 0.0)) {
    t.snov = S_PLAZMA; t.dye = vec3(0.02, 0.12, 0.0);
    vec4 e = krogci(p, 8.0, 3.2, 3.6, 0.35, 21.0);
    if (e.x < 0.0) { t.snov = S_ERITROCIT; t.dye = vec3(0.02, 0.75, 0.0); t.meja = -e.x; }
    return t;
  }
  t.snov = S_CITO; t.tip = C_ZLEZNA; t.meja = v.rob; t.cc = v.c; t.jc = v.c; t.cid = v.id;
  float pena = plast == 1.0 ? smoothstep(0.45, 0.6, sumL(p, 1.6, px)) : 0.0;
  t.dye = plast == 3.0 ? vec3(0.35, 0.3, 0.0) : plast == 2.0 ? vec3(0.1, 0.62, 0.0) : vec3(0.08, 0.45 - 0.25 * pena, 0.0);
  if (pena > 0.5 && plast == 1.0) t.tip = C_ADIPOCIT;
  t.dye.y -= 0.1 * crta(v.rob, 0.3, px);
  float dj = length(p - v.c) - 3.0;
  t.jedro = dj;
  float jk = pokrij(dj, px);
  t.dye.x = mix(t.dye.x, 0.85 * kromatin(p - v.c, h.zw, px), jk);
  if (jk > 0.5) t.snov = S_JEDRO;
  return t;
}`,
};

export const mehur = {
  id: "mehur",
  ime: "Sečni mehur",
  opis: "Sečni mehur, sečevoda in začetek sečnice od znotraj prekriva prehodni epitelij: površinske celice so velike in obokane (»dežnikaste«) ter se pri raztezanju sploščijo. Pod njim sta vezivo in debela plast gladkih mišic.",
  barvanje: "he",
  velikost: [2400, 1500],
  zacetek: { m: 100, sredisce: [0, 1100] },
  sredisceBlizu: [0, 1215],
  imena: { 0: "celica prehodnega epitelija", 13: "gladka mišična celica" },
  snovi: { 3: "vezivo" },
  isci: "Poišči velike obokane dežnikaste celice na površini epitelija.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(2400.0, 1500.0), 34.0);
  float ys = 1250.0 + 40.0 * sin(p.x / 240.0);
  if (rob > 0.0 || p.y > ys) return t;
  float d = ys - p.y;
  float H = 70.0;
  if (d < H) {
    if (d < 16.0) {
      // dežnikaste celice
      // dežnikaste celice so različno široke (20–36 µm)
      float w = 28.0;
      float xs = p.x + 0.45 * w * (sum(vec2(p.x / 45.0, 3.0)) - 0.5) * 2.0;
      float i = floor(xs / w);
      vec4 h = h42(vec2(i, 1.0));
      float lx = (fract(xs / w) - 0.5) * w;
      float kupola = 16.0 - 6.0 * (lx / (0.5 * w)) * (lx / (0.5 * w));
      if (d < 16.0 - kupola) return t;
      t.snov = S_CITO; t.cc = vec2((i + 0.5) * w, ys - 8.0); t.jc = t.cc; t.cid = vec2(i, 1.0); t.meja = min(0.5 * w - abs(lx), 16.0 - d);
      t.dye = vec3(0.07, 0.55, 0.0);
      float dj = min(length(vec2(lx - (h.y > 0.6 ? 5.0 : 0.0), d - 8.0)) - 3.2, h.y > 0.6 ? length(vec2(lx + 5.0, d - 8.0)) - 3.2 : 1e3);
      t.jedro = dj;
      if (dj < 0.0) { t.dye.x = 0.8 * kromatin(vec2(lx, d), h.zw, px); t.snov = S_JEDRO; }
      return t;
    }
    T e = vecskladni(d - 16.0, p.x, H - 16.0, 0.0, vec2(0.0, 7.0), px);
    e = vSvet(e, p, vec2(1.0, 0.0), vec2(0.0, -1.0));
    return e;
  }
  if (d < H + 260.0) {
    t.snov = S_KOLAGEN; t.smer = vec2(1.0, 0.0);
    vec2 kg = kolagen(p, vec2(1.0, 0.0), 8.0, 0.4, 0.6, 9.0, px);
    t.dye = vec3(0.04, kg.x, 0.0);
    if (kg.y > 0.6) t.snov = S_PRAZNO;
    vec4 f = krogci(p, 28.0, 2.0, 2.0, 0.5, 9.0);
    float df = sdElipsa(rot(0.5 * (fract(f.w * 1.37) - 0.5)) * (p - f.yz), vec2(4.5, 1.0));
    if (df < px) { float k = pokrij(df, px); t.dye.x = mix(t.dye.x, 0.85, k); if (k > 0.5) { t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = df; } }
    vec4 z = krogci(p, 200.0, 8.0, 18.0, 0.5, 11.0);
    zila(t, p - z.yz, length(p - z.yz) - z.x, 3.0, vec2(z.w), px);
    return t;
  }
  // snopi gladkih mišic v različnih smereh
  // snopi so zaobljeni, med njimi različno široke vezivne pregrade z režami
  vec2 pw = p + 45.0 * (vec2(fbm(p / 220.0, 2), fbm(p / 220.0 + 5.0, 2)) - 0.5) * 2.0;
  pw += 22.0 * (vec2(sum(p / 60.0 + 1.0), sum(p / 60.0 + 8.0)) - 0.5) * 2.0;
  Vor s = vor(pw, 190.0, vec2(1.0), 0.0, 1.0);
  float sp = sum(pw / 150.0 + 2.0);
  float pd = 2.0 + 12.0 * sp * sp;
  if (s.rob < pd) {
    vec2 kg = kolagen(p, vec2(s.nb.y, -s.nb.x), 5.0, 0.4, 0.4, 4.0, px);
    t.snov = kg.y > 0.6 ? S_PRAZNO : S_KOLAGEN; t.dye = vec3(0.04, kg.x, 0.0);
    t.dye.y *= 1.0 - 0.8 * crta(s.rob - pd, 1.2, px);       // skrček ob robu snopa
    return t;
  }
  vec4 hs = h42(s.id);
  bool vzd = hs.x < 0.6;
  float kot = hs.y * 3.14;
  Vor v = vor(p, 7.0, vzd ? vec2(9.0, 1.0) : vec2(1.0), kot, 0.9);
  vec4 h = h42(v.id);
  t.snov = S_CITO; t.tip = C_GLADKA; t.meja = v.rob; t.cc = v.c; t.jc = v.c; t.cid = v.id;
  t.dye = vec3(0.07, 0.52, 0.0);
  vec2 q = rot(kot) * (p - v.c);
  float dj = vzd ? sdKapsula(q, 6.0 + 2.0 * h.w, 1.2) : length(q) - 1.3;
  if (h.y < (vzd ? 0.5 : 0.3)) { float jk = pokrij(dj, px); t.dye.x = mix(t.dye.x, 0.75 * kromatin(q, h.zw, px), jk); t.jedro = dj; if (jk > 0.5) t.snov = S_JEDRO; }
  return t;
}`,
};

export const modo = {
  id: "modo",
  ime: "Modo",
  opis: "Modo sestavljajo semenske cevke. Ob njihovi steni so spermatogoniji, proti svetlini se delijo in zorijo v spermatocite, spermatide in spermije z repki v svetlini. Med cevkami so skupki Leydigovih celic, ki izdelujejo testosteron.",
  barvanje: "he",
  velikost: [2400, 1500],
  zacetek: { m: 100, sredisce: [0, 0] },
  sredisceBlizu: [0, 0],
  imena: { 5: "spolna celica v razvoju", 2: "Leydigova celica" },
  snovi: { 0: "svetlina cevke" },
  isci: "Sledi zorenju spolnih celic od stene cevke proti svetlini. Poišči Leydigove celice med cevkami.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(2400.0, 1500.0), 35.0);
  if (rob > 0.0) return t;
  // cevke so prerezane pod različnimi koti (okrogle do ovalne), obris ni povsem gladek
  vec4 c = krogci(p, 230.0, 96.0, 108.0, 1.0, 3.0);
  vec4 hc = h42(vec2(c.w, 3.0));
  vec2 q0 = p - c.yz;
  vec2 qq = rot(hc.x * 3.14) * q0;
  float asp = 0.8 + 0.2 * hc.y;
  float r = length(vec2(qq.x, qq.y / asp)) * (1.0 + 0.03 * (sum(q0 / 25.0 + hc.zw * 7.0) - 0.5));
  float R = length(q0) - c.x;                    // polmer kroga (cevka se v drugi smeri skrči na asp·R)
  vec2 q = q0;
  if (c.x > 0.0 || r > R) {
    // intersticij z Leydigovimi celicami v skupinah in kapilarami
    float dz = c.x > 0.0 ? c.x : (r - R) * asp;
    t.snov = S_KOLAGEN; t.dye = vec3(0.05, 0.24 + 0.06 * sumL(p, 3.0, px), 0.0);
    // Leydigove celice: skupine mnogokotnih rožnatih celic z okroglim jedrom
    float sk = smoothstep(0.55, 0.65, sum(p / 40.0)) * smoothstep(3.0, 9.0, dz);
    Vor l = vor(p, 13.0, vec2(1.0), 0.0, 0.8);
    vec4 hl = h42(l.id);
    if (hl.x < sk * 1.2 && l.rob > 0.25) {
      t.snov = S_CITO; t.tip = C_ZLEZNA; t.meja = l.rob; t.cc = l.c; t.jc = l.c; t.cid = l.id;
      t.dye = vec3(0.09, 0.46 + 0.1 * sumL(p, 1.0, px), 0.0);
      float dj = length(p - l.c - 1.5 * (hl.zw - 0.5)) - 2.6;
      t.jedro = dj; float jk = pokrij(dj, px); t.dye.x = mix(t.dye.x, 0.85 * kromatin(p - l.c, hl.zw, px), jk); if (jk > 0.5) t.snov = S_JEDRO;
    } else if (hl.y < 0.06) {
      vec2 fq = rot(hl.z * 3.14) * (p - l.c);
      float df = sdElipsa(fq, vec2(4.0, 1.0));
      if (df < 0.0) { t.dye.x = 0.8; t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = df; }
    }
    return t;
  }
  float d = (R - r) * mix(asp, 1.0, 0.5);        // globina od stene cevke
  if (d < 4.0) {
    // ovojnica cevke: kolagen in sploščena jedra mioidnih celic
    t.snov = S_KOLAGEN; t.dye = vec3(0.06, 0.5, 0.0);
    float a = atan(qq.y, qq.x) * R;
    float ln = (fract(a / 28.0 + hc.z) - 0.5) * 28.0;
    float dj = sdElipsa(vec2(ln, d - 2.0), vec2(6.0, 0.9));
    float jk = pokrij(dj, px) * step(0.35, h12(vec2(floor(a / 28.0 + hc.z), c.w)));
    t.dye.x = mix(t.dye.x, 0.8, jk); if (jk > 0.5) { t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = dj; }
    return t;
  }
  float lum = R - 74.0 + 22.0 * (fbm(q / 22.0 + hc.zw * 5.0, 2) - 0.5);
  if (r < lum) {
    // svetlina: tu in tam tanki valoviti repki spermijev
    float rep = crta(fbm(q / 14.0 + hc.zw * 9.0, 2) - 0.5, 0.012, px / 14.0) * step(lum - 30.0, r) * step(0.4, sum(q / 30.0));
    t.dye = vec3(0.03, 0.07 + 0.3 * rep, 0.0); t.snov = S_PLAZMA;
    return t;
  }
  // plasti spolnih celic od baze proti svetlini (vsaka plast ima svojo stalno velikost celic, da se celice ne
  // raztegnejo): spermatogoniji in Sertolijeve celice ob bazi, največji primarni spermatociti z grudasto
  // kromatino, majhni bledi okrogli spermatidi, ob svetlini temne podolgovate glavice zrelih spermatid
  float f = clamp((d - 4.0) / 62.0, 0.0, 1.0) + 0.06 * (sum(q / 18.0 + hc.zw * 3.0) - 0.5);
  float b = f < 0.16 ? 0.0 : f < 0.55 ? 1.0 : f < 0.8 ? 2.0 : 3.0;
  float sc = b == 0.0 ? 8.0 : b == 1.0 ? 11.0 : b == 2.0 ? 6.5 : 4.2;
  Vor v = vor(q + b * 37.0, sc, vec2(1.0), 0.0, 0.75);
  v.c -= b * 37.0;
  vec4 h = h42(v.id + c.w + b * 11.0);
  t.snov = S_CITO; t.tip = C_ZLEZNA; t.meja = v.rob; t.cc = c.yz + v.c; t.jc = t.cc; t.cid = v.id + c.w + b * 11.0;
  t.dye = vec3(0.1, 0.36 + 0.06 * sumL(q, 2.0, px), 0.0);
  vec2 jq = q - v.c;
  vec2 rad = normalize(v.c + 1e-3);
  vec2 lq = vec2(dot(jq, rad), dot(jq, vec2(-rad.y, rad.x)));     // x v smeri proti steni
  float dj, kr;
  if (b == 0.0) {
    bool sert = h.y < 0.35;
    dj = sert ? sdElipsa(lq, vec2(3.6, 2.4)) : length(jq) - 2.7;
    kr = sert ? 0.45 + 0.9 * pokrij(length(lq) - 0.8, px) : 1.0 * kromatin(jq, h.zw, px);
  } else if (b == 1.0) {
    dj = length(jq) - (4.0 + 0.6 * h.x);
    kr = 0.4 + 0.8 * smoothstep(0.55, 0.68, sum(jq * 1.4 + h.xy * 9.0));   // grudasta, nitasta kromatina
  } else if (b == 2.0) {
    dj = length(jq) - 2.2;
    kr = 0.55 + 0.25 * kromatin(jq, h.zw, px);
  } else {
    dj = sdElipsa(lq + vec2(0.0, 0.0), vec2(1.7, 0.8));
    kr = 1.45;
    if (h.y > 0.7) dj = 1e3;
  }
  dj += 0.2 * (sum(jq + h.zw * 9.0) - 0.5);
  t.jedro = dj;
  float jk = pokrij(dj, px);
  t.dye.x = mix(t.dye.x, kr, jk);
  if (jk > 0.5) t.snov = S_JEDRO;
  return t;
}`,
};

export const jajcnik = {
  id: "jajcnik",
  ime: "Jajčnik",
  opis: "V skorji jajčnika so folikli: majhni prvotni folikli z jajčno celico in ploščatimi celicami ter večji folikli z več plastmi zrnatih celic in votlino, napolnjeno s tekočino. Okoli je gosta stroma.",
  barvanje: "he",
  velikost: [2400, 1500],
  zacetek: { m: 40, sredisce: [0, 0] },
  sredisceBlizu: [-300, 650],
  imena: { 5: "zrnata (granulozna) celica", 0: "jajčna celica (oocit)", 2: "celica strome" },
  snovi: { 14: "folikularna tekočina" },
  isci: "Poišči jajčno celico z velikim jedrom in rožnato ovojnico (zona pellucida) v zorečem foliklu.",
  glsl: /* glsl */ `
T jajcece(vec2 q, float R, vec4 h, vec2 p, float px) {
  T t = prazno();
  float r = length(q);
  if (r > R + 3.0) return t;
  if (r > R) { t.snov = S_MATRIKS; t.dye = vec3(0.05, 0.75, 0.0); return t; }      // zona pellucida
  t.snov = S_CITO; t.tip = C_SPLOSNA; t.meja = R - r; t.cc = p - q; t.jc = t.cc; t.cid = h.zw * 100.0;
  t.dye = vec3(0.06, 0.38 + 0.05 * sumL(q, 2.0, px), 0.0);
  float dj = length(q - vec2(0.15 * R, 0.0)) - 0.32 * R;
  t.jedro = dj;
  float jk = pokrij(dj, px);
  t.dye = mix(t.dye, vec3(0.15, 0.12, 0.0), jk);
  t.dye.x += 1.1 * pokrij(length(q - vec2(0.2 * R, 0.05 * R)) - 0.06 * R, px) * jk;
  if (jk > 0.5) t.snov = S_JEDRO;
  return t;
}
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(2400.0, 1500.0), 36.0);
  if (rob > 0.0) return t;
  float g = -rob;
  if (g < 12.0) { t.snov = S_CITO; t.dye = vec3(0.5, 0.4, 0.0); return t; }             // površinski epitelij
  // velik folikel z votlino
  vec2 fq = p - vec2(-300.0, 250.0);
  float fr = length(fq);
  if (fr < 520.0) {
    if (fr > 470.0) { t.snov = S_CITO; t.tip = C_FIBROBLAST; t.dye = vec3(0.15, 0.45, 0.0); return t; }   // teka
    float gr = 470.0 - fr;
    vec2 kum = fq - vec2(0.0, 400.0);
    T o = jajcece(fq - vec2(0.0, 360.0), 50.0, vec4(1.0), p, px);
    if (o.snov != S_PRAZNO) return o;
    if (gr < 70.0 || length(kum) < 115.0) {
      vec4 c = krogci(p, 7.0, 2.6, 3.0, 0.95, 5.0);
      t.snov = S_CITO; t.tip = C_ZLEZNA; t.meja = 1.2; t.cc = c.yz; t.jc = c.yz; t.cid = vec2(c.w);
      t.dye = vec3(0.12, 0.25, 0.0);
      if (c.x < 0.0) { t.dye.x = 1.0 * kromatin(p - c.yz, vec2(c.w), px); t.snov = S_JEDRO; t.jedro = c.x; }
      return t;
    }
    t.snov = S_PLAZMA; t.dye = vec3(0.0, 0.12 + 0.05 * sumL(p, 20.0, px), 0.0);
    return t;
  }
  // prvotni in rastoči folikli v skorji
  vec4 f = krogci(p, 160.0, 18.0, 70.0, g < 350.0 ? 0.75 : 0.2, 9.0);
  if (f.x < 0.0) {
    vec2 q = p - f.yz;
    float R = length(q) - f.x;
    float Ro = R < 30.0 ? R - 4.0 : R * 0.45;
    T o = jajcece(q, Ro, vec4(f.w), p, px);
    if (o.snov != S_PRAZNO) return o;
    vec4 c = krogci(p, 6.5, 2.4, 2.8, 0.9, 13.0);
    t.snov = S_CITO; t.tip = C_ZLEZNA; t.meja = 1.0; t.cc = c.yz; t.jc = c.yz;
    t.dye = vec3(0.12, 0.28, 0.0);
    if (c.x < 0.0) { t.dye.x = 0.95; t.snov = S_JEDRO; t.jedro = c.x; }
    return t;
  }
  // stroma: goste vretenaste celice v vrtincih
  float kot = 6.28 * fbm(p / 300.0, 2);
  Vor v = vor(p, 6.0, vec2(5.0, 1.0), kot, 0.9);
  vec4 h = h42(v.id);
  t.snov = S_CITO; t.tip = C_FIBROBLAST; t.meja = v.rob; t.cc = v.c; t.jc = v.c; t.cid = v.id;
  t.dye = vec3(0.12, 0.35, 0.0);
  vec2 q = rot(kot) * (p - v.c);
  float dj = sdKapsula(q, 3.5, 1.1);
  t.jedro = dj;
  float jk = pokrij(dj, px) * step(h.y, 0.7);
  t.dye.x = mix(t.dye.x, 0.9 * kromatin(q, h.zw, px), jk);
  if (jk > 0.5) t.snov = S_JEDRO;
  return t;
}`,
};
