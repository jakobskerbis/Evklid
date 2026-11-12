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
  Vor L = vor(p, 600.0, vec2(1.0), 0.0, 0.9);
  if (L.rob < 12.0) { t.snov = S_KOLAGEN; t.dye = vec3(0.04, 0.4, 0.0); return t; }
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
  // acinusi
  vec4 a = krogci(p, 34.0, 15.0, 19.0, 0.97, 7.0);
  if (a.x > 0.0) { t.snov = S_KOLAGEN; t.dye = vec3(0.04, 0.18, 0.0); return t; }
  vec2 q = p - a.yz;
  float r = length(q);
  float R = r - a.x;
  T e = cevka(q, 1.6, R, 9.0, 0.78, C_ZLEZNA, vec2(a.w, 7.0), p, px);
  float f = clamp((r - 1.6) / (R - 1.6), 0.0, 1.0);
  if (e.snov != S_JEDRO && r > 1.6) {
    e.dye.x = 0.15 + 0.5 * smoothstep(0.45, 0.85, f);
    e.dye.y = 0.25 + 0.5 * (1.0 - smoothstep(0.3, 0.6, f)) * (0.6 + 0.4 * smoothstep(0.5, 0.7, sumL(q, 0.7, px)));
    if (f < 0.45) e.snov = S_CITO;
  }
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
  if (v.rob < pre) {
    t.snov = S_KOLAGEN; t.dye = vec3(0.04, 0.22, 0.0);
    vec4 e = krogci(p, 9.0, 2.6, 3.0, 0.35, 5.0);
    if (e.x < 0.0) { t.dye.y = 0.72; t.snov = S_ERITROCIT; t.meja = -e.x; }
    return t;
  }
  float H = 7.0 + 4.0 * h.x;
  float d = v.rob - pre;
  if (d < H) {
    vec2 q = w - v.c;
    T e = epitel(H - d, atan(q.y, q.x) * 60.0, H, 8.0, 0.4, C_ZLEZNA, v.id, p, -v.nb, px);
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
  float plast = d < 140.0 ? 0.0 : d < 780.0 ? 1.0 : d < 1000.0 ? 2.0 : 3.0;
  vec2 a = plast == 1.0 ? vec2(1.0, 3.0) : vec2(1.0);
  Vor v = vor(p, plast == 1.0 ? 15.0 : 13.0, a, 0.0, 0.8);
  vec4 h = h42(v.id);
  // trakovi celic med sinusoidi
  float trak = plast == 1.0 ? abs(fract(p.x / 34.0) - 0.5) * 34.0 : 100.0;
  if (trak < 2.5 || (plast != 1.0 && sum(p / 25.0) > 0.68)) { t.snov = S_PLAZMA; t.dye = vec3(0.0, 0.2, 0.0); return t; }
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
      float w = 28.0;
      float i = floor(p.x / w);
      vec4 h = h42(vec2(i, 1.0));
      float lx = (fract(p.x / w) - 0.5) * w;
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
    t.dye = vec3(0.04, 0.25 + 0.2 * smoothstep(0.45, 0.7, sum(p / 9.0)), 0.0);
    vec4 f = krogci(p, 28.0, 1.4, 2.0, 0.5, 9.0);
    if (f.x < 0.0) { t.dye.x = 0.85; t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = f.x; }
    vec4 z = krogci(p, 200.0, 8.0, 18.0, 0.5, 11.0);
    zila(t, p - z.yz, length(p - z.yz) - z.x, 3.0, vec2(z.w), px);
    return t;
  }
  // snopi gladkih mišic v različnih smereh
  Vor s = vor(p, 160.0, vec2(1.0), 0.0, 0.9);
  if (s.rob < 10.0) { t.snov = S_KOLAGEN; t.dye = vec3(0.04, 0.3, 0.0); return t; }
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
  vec4 c = krogci(p, 230.0, 90.0, 105.0, 1.0, 3.0);
  if (c.x > 0.0) {
    // intersticij z Leydigovimi celicami
    t.snov = S_KOLAGEN; t.dye = vec3(0.04, 0.2, 0.0);
    vec4 l = krogci(p, 16.0, 5.0, 7.0, smoothstep(10.0, 25.0, c.x) * 0.7, 5.0);
    if (l.x < 0.0) {
      t.snov = S_CITO; t.tip = C_ZLEZNA; t.meja = -l.x; t.cc = l.yz; t.jc = l.yz; t.cid = vec2(l.w);
      t.dye = vec3(0.08, 0.65, 0.0);
      float dj = length(p - l.yz) - 2.8;
      t.jedro = dj; if (dj < 0.0) { t.dye.x = 0.8; t.snov = S_JEDRO; }
    }
    return t;
  }
  vec2 q = p - c.yz;
  float r = length(q);
  float R = r - c.x;
  float d = R - r;                               // globina od stene cevke
  if (d < 4.0) { t.snov = S_KOLAGEN; t.dye = vec3(0.1 + 0.6 * step(0.9, fract(atan(q.y, q.x) * 12.0)), 0.5, 0.0); return t; }
  float lum = R - 70.0 + 10.0 * (sum(q / 20.0) - 0.5);
  if (r < lum) {
    // svetlina z repki spermijev
    float rep = crta(sin(atan(q.y, q.x) * 40.0 + r * 0.3), 0.05, px) * step(lum - 25.0, r);
    t.dye = vec3(0.05, 0.25 * rep, 0.0);
    return t;
  }
  // plasti spolnih celic: velikost in videz jedra po globini
  float f = clamp((d - 4.0) / 62.0, 0.0, 1.0);
  float s = mix(9.0, 6.5, f);
  Vor v = vor(q, s, vec2(1.0), 0.0, 0.7);
  vec4 h = h42(v.id + c.w);
  t.snov = S_CITO; t.tip = C_ZLEZNA; t.meja = v.rob; t.cc = c.yz + v.c; t.jc = t.cc; t.cid = v.id + c.w;
  t.dye = vec3(0.1, 0.38, 0.0);
  vec2 jq = q - v.c;
  float rj = f < 0.2 ? 2.8 : f < 0.6 ? 3.8 : f < 0.85 ? 2.2 : 1.4;
  float dj = (f > 0.85 ? sdElipsa(jq, vec2(1.6, 0.9)) : length(jq) - rj) + 0.2 * (sum(jq + h.zw * 9.0) - 0.5);
  t.jedro = dj;
  float jk = pokrij(dj, px);
  float kr = f > 0.2 && f < 0.6 ? 0.55 + 0.6 * smoothstep(0.55, 0.7, sum(jq * 1.6 + h.xy * 9.0)) : 1.0 * kromatin(jq, h.zw, px);
  t.dye.x = mix(t.dye.x, kr * (f > 0.85 ? 1.4 : 1.0), jk);
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
