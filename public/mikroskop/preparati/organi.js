// Preparati organov (HE): jetra, ledvica (skorja), pljuča, sapnik, bezgavka.
// Mere (Ross in Pawlina): jetrni režnjič ~0,7 × 2 mm, hepatocit 20–30 µm; ledvično telesce ~200 µm; alveol ~200 µm,
// pregrada 5–10 µm; dihalni epitelij ~50 µm; limfni folikel 0,2–1 mm, limfocit 6–8 µm.

export const jetra = {
  id: "jetra",
  ime: "Jetra",
  opis: "Jetra so zgrajena iz režnjičev. V sredini režnjiča je osrednja vena, od nje se kot žarki širijo plošče jetrnih celic (hepatocitov), med njimi so sinusoidi s krvjo. Na vogalih režnjičev so portalni prostori z vejo portalne vene, arterijo in žolčevodom.",
  barvanje: "he",
  velikost: [2600, 1700],
  zacetek: { m: 40, sredisce: [0, 0] },
  sredisceBlizu: [160, 120],
  imena: { 1: "hepatocit (jetrna celica)", 2: "celica stene sinusoida", 8: "celica žolčevoda" },
  snovi: { 14: "kri v sinusoidu", 3: "vezivo portalnega prostora" },
  isci: "Poišči osrednjo veno in portalni prostor. Pri 400× opazuj hepatocite z okroglim jedrom, nekateri imajo dve jedri.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(2600.0, 1700.0), 21.0);
  if (rob > 0.0) return t;
  Vor L = vor(p, 820.0, vec2(1.0), 0.15, 0.45);
  vec2 q = p - L.c;
  float r = length(q);
  // portalni prostor: na meji režnjičev, kjer je bližnji vogal
  vec4 pk = krogci(p, 420.0, 1.0, 1.0, 1.0, 5.0);
  Vor Lp = vor(pk.yz, 820.0, vec2(1.0), 0.15, 0.45);
  bool portal = Lp.rob < 120.0 && length(p - pk.yz) < 95.0 + 15.0 * sum(p / 30.0);
  if (portal) {
    vec2 z = p - pk.yz;
    t.snov = S_KOLAGEN; t.smer = vec2(0.0);
    t.dye = vec3(0.05, 0.45 + 0.05 * sumL(p, 3.0, px), 0.0);
    vec4 f = krogci(p, 18.0, 1.6, 2.4, 0.4, 9.0);
    if (f.x < 0.0) { t.dye.x = 0.9; t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = f.x; t.jc = f.yz; t.cc = f.yz; t.cid = vec2(f.w); }
    zila(t, z - vec2(-25.0, 10.0), 34.0, 2.0, vec2(pk.w, 1.0), px);           // veja portalne vene
    zila(t, z - vec2(32.0, -28.0), 9.0, 6.0, vec2(pk.w, 2.0), px);            // arteriola
    vec2 bz = z - vec2(30.0, 30.0);
    if (length(bz) < 15.0) return cevka(bz, 5.0, 15.0, 7.5, 0.5, C_RESICE, vec2(pk.w, 3.0), p, px);
    return t;
  }
  // osrednja vena
  vec4 hl = h42(L.id);
  float rv = 38.0 + 15.0 * hl.x;
  if (r < rv + 3.0) {
    t.snov = S_PLAZMA; t.dye = vec3(0.0, 0.05, 0.0);
    zila(t, q, rv, 2.5, hl.zw, px);
    return t;
  }
  // plošče hepatocitov: mnogokotne celice; meje, ki potekajo v smeri žarka od osrednje vene, so sinusoidi
  vec2 rad = q / max(r, 1.0);
  vec2 z = p;
  Vor v = vor(p, 23.0, vec2(1.0, 1.0), 0.0, 0.75);
  vec4 h = h42(v.id);
  bool sinus = abs(dot(v.nb, rad)) < 0.55 && h.y > 0.15;
  float sw = sinus ? 2.4 + 2.0 * h.w : 0.0;
  if (v.rob < sw) {
    t.snov = S_PLAZMA; t.dye = vec3(0.0, 0.1, 0.0);
    if (h.z < 0.25 && v.rob < 1.2) { t.dye = vec3(0.85, 0.2, 0.0); t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = v.rob - 1.2; t.jc = p + v.nb * (v.rob - 0.6); t.cc = t.jc; }
    vec4 e = krogci(p, 9.0, 3.0, 3.5, 0.3, 17.0);
    if (e.x < 0.0) { t.dye.y = 0.7; t.snov = S_ERITROCIT; t.meja = -e.x; }
    return t;
  }
  t.snov = S_CITO; t.tip = C_HEPATOCIT; t.meja = v.rob - sw; t.cid = v.id;
  vec2 cz = v.c;
  t.cc = cz;
  t.jc = t.cc;
  t.dye = vec3(0.1 + 0.04 * sumL(z, 2.0, px), 0.48 + 0.08 * (smoothstep(0.4, 0.7, sumL(z, 1.2, px)) - 0.5), 0.0);
  t.dye.y -= 0.12 * crta(t.meja, 0.3, px);
  vec2 jq = z - cz;
  float dj = length(jq - vec2(h.x - 0.5, h.y - 0.5) * 3.0) - 4.2;
  if (h.w > 0.82) dj = min(length(jq - vec2(-5.0, 0.0)) - 3.8, length(jq - vec2(5.0, 0.0)) - 3.8);   // dvojedrne
  t.jedro = dj;
  float jk = pokrij(dj, px);
  t.dye.x = mix(t.dye.x, 0.7 * kromatin(jq, h.zw, px), jk);
  t.dye.x += 0.9 * pokrij(length(jq - vec2(h.x - 0.5, h.y - 0.5) * 3.0 - vec2(1.0, 0.5)) - 0.9, px) * jk;
  if (jk > 0.5) t.snov = S_JEDRO;
  return t;
}`,
};

export const ledvica = {
  id: "ledvica",
  ime: "Ledvica",
  opis: "Skorja ledvice. Ledvična telesca so klopčiči kapilar (glomeruli) v Bowmanovi ovojnici; okoli njih so preseki ledvičnih cevk: proksimalne so temno rožnate s ščetkastim robom, distalne svetlejše z večjo svetlino.",
  barvanje: "he",
  velikost: [2600, 1700],
  zacetek: { m: 100, sredisce: [0, 0] },
  imena: { 8: "celica ledvične cevke", 0: "celica" },
  snovi: { 14: "seč (filtrat) / kri", 0: "svetlina cevke" },
  isci: "Poišči ledvično telesce z Bowmanovim prostorom. Primerjaj proksimalno in distalno cevko.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(2600.0, 1700.0), 22.0);
  if (rob > 0.0) return t;
  // ledvična telesca
  vec4 g = krogci(p, 520.0, 95.0, 110.0, 0.7, 3.0);
  if (g.x < 3.0) {
    vec2 q = p - g.yz;
    float R = length(q) - g.x;
    float r = length(q);
    if (g.x > 0.0) { t.snov = S_CITO; t.dye = vec3(0.6 * step(0.85, fract(atan(q.y, q.x) * 10.0)), 0.45, 0.0); t.meja = min(g.x, 3.0 - g.x); return t; }
    float Rt = R - 14.0;
    if (r > Rt + 4.0 * (sum(q / 25.0) - 0.5)) { t.snov = S_PLAZMA; t.dye = vec3(0.0, 0.04, 0.0); return t; }   // Bowmanov prostor
    // klopčič: kapilarne zanke z eritrociti in številna jedra
    vec4 k = krogci(q, 13.0, 3.5, 5.5, 0.85, 7.0);
    t.snov = S_CITO; t.tip = C_SPLOSNA; t.cid = vec2(g.w, 1.0); t.cc = vec2(g.w * 37.0, 11.0); t.meja = 2.0;
    t.dye = vec3(0.12, 0.5, 0.0);
    if (k.x < 0.0) { t.snov = S_PLAZMA; t.dye = vec3(0.0, 0.1, 0.0); vec4 e = krogci(q, 7.0, 2.8, 3.2, 0.5, 9.0); if (e.x < 0.0) { t.dye.y = 0.75; t.snov = S_ERITROCIT; t.meja = -e.x; } }
    vec4 j = krogci(q, 9.0, 2.2, 2.8, 0.6, 11.0);
    if (j.x < 0.0 && k.x > 0.5) { t.dye.x = 1.0 * kromatin(q - j.yz, vec2(j.w), px); t.snov = S_JEDRO; t.jedro = j.x; t.jc = j.yz; }
    return t;
  }
  // cevke (prečni preseki)
  Vor v = vor(p, 52.0, vec2(1.0), 0.0, 0.75);
  vec4 h = h42(v.id);
  if (v.rob < 2.5) {
    t.snov = S_KOLAGEN; t.dye = vec3(0.05, 0.25, 0.0);
    vec4 e = krogci(p, 10.0, 2.6, 3.0, 0.25, 13.0);
    if (e.x < 0.0) { t.dye.y = 0.72; t.snov = S_ERITROCIT; t.meja = -e.x; }
    return t;
  }
  bool prox = h.x < 0.7;
  vec2 q = p - v.c;
  float r = length(q);
  float R = r + v.rob - 2.5;                      // do roba cevke
  float rl = prox ? 4.0 + 2.0 * h.y : 9.0 + 3.0 * h.y;
  rl += 1.5 * (sum(q / 3.0 + h.zw * 9.0) - 0.5);
  if (r < rl) { t.snov = S_PLAZMA; t.dye = vec3(0.0, 0.03, 0.0); return t; }
  T e = cevka(q, rl, max(R, rl + 3.0), prox ? 11.0 : 8.0, 0.6, C_RESICE, v.id, p, px);
  e.dye.y = prox ? 0.62 + 0.06 * sumL(q, 1.0, px) : 0.36;
  if (prox) {
    e.dye.y += 0.25 * smoothstep(2.5, 0.5, r - rl) * (0.6 + 0.4 * sumL(q * vec2(1.0, 4.0), 0.5, px));   // ščetkasti rob
    e.dye.y -= 0.12 * crta(e.meja, 0.3, px) * 0.0;
  }
  if (e.snov == S_JEDRO) e.dye.x *= 0.85;
  return e;
}`,
};

export const pljuca = {
  id: "pljuca",
  ime: "Pljuča",
  opis: "Pljučno tkivo je kot gobica: tanke pregrade ločijo pljučne mešičke (alveole). V pregradah so kapilare z eritrociti, tu kisik prehaja v kri. Vmes je bronhiol z gubasto sluznico in arterija.",
  barvanje: "he",
  velikost: [2600, 1700],
  zacetek: { m: 40, sredisce: [0, 0] },
  sredisceBlizu: [300, 200],
  imena: { 0: "pnevmocit tipa I", 2: "celica pregrade", 15: "alveolarni makrofag" },
  snovi: { 0: "zrak v alveolu", 5: "eritrocit v kapilari" },
  isci: "Poišči tanke alveolarne pregrade in eritrocite v njihovih kapilarah. Pri TEM poišči pregrado med zrakom in krvjo (manj kot 1 µm).",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(2600.0, 1700.0), 23.0);
  if (rob > 0.0) return t;
  // bronhiol
  vec2 bq = p - vec2(-900.0, -350.0);
  float br = length(bq);
  if (br < 260.0) {
    float th = atan(bq.y, bq.x);
    float rl = 150.0 + 20.0 * sin(th * 9.0);
    if (br < rl) { t.dye = vec3(0.0, 0.02, 0.0); return t; }
    if (br < rl + 28.0) return epitel(br - rl, th * (rl + 14.0), 28.0, 7.0, 0.65, C_RESICE, vec2(4.0), p, bq / br, px);
    T m = prazno(); m.snov = S_CITO; m.tip = C_GLADKA; m.dye = vec3(0.08, 0.5, 0.0); m.meja = 2.0;
    if (br < rl + 75.0) { if (sum(vec2(th * 40.0, br / 8.0)) > 0.65) { m.dye.x = 0.8; m.snov = S_JEDRO; } return m; }
    t.snov = S_KOLAGEN; t.dye = vec3(0.05, 0.4, 0.0); return t;
  }
  zila(t, p - vec2(-560.0, -620.0), 120.0, 35.0, vec2(3.0, 4.0), px);
  if (t.snov != S_PRAZNO) return t;
  vec2 w = p + 25.0 * vec2(sum(p / 120.0) - 0.5, sum(p / 120.0 + 5.0) - 0.5);
  Vor v = vor(w, 210.0, vec2(1.0), 0.0, 0.95);
  float sir = 4.5 + 4.0 * sum(p / 40.0);
  if (v.rob > sir) {
    // zrak; občasen alveolarni makrofag
    vec4 m = krogci(p, 140.0, 8.0, 10.0, 0.12, 31.0);
    if (m.x < 0.0) {
      t.snov = S_CITO; t.tip = C_LEVKOCIT; t.meja = -m.x; t.cc = m.yz; t.jc = m.yz; t.cid = vec2(m.w);
      t.dye = vec3(0.1, 0.4, 0.25 * smoothstep(0.55, 0.75, sumL(p, 1.0, px)));
      float dj = length(p - m.yz - vec2(2.0, 0.0)) - 3.5;
      t.jedro = dj; if (dj < 0.0) { t.dye.x = 0.9; t.snov = S_JEDRO; }
      return t;
    }
    t.dye = vec3(0.0, 0.01, 0.0);
    return t;
  }
  // pregrada: kapilare z eritrociti, jedra pnevmocitov in endotelija
  t.snov = S_CITO; t.tip = C_SPLOSNA; t.meja = min(v.rob, sir - v.rob); t.cc = v.c; t.cid = v.id;
  t.dye = vec3(0.08, 0.42 + 0.08 * sumL(p, 2.0, px), 0.0);
  vec4 e = krogci(p, 9.0, 2.5, 3.2, 0.45, 17.0);
  if (e.x < 0.0) { t.dye = vec3(0.02, 0.78, 0.0); t.snov = S_ERITROCIT; t.meja = -e.x; return t; }
  vec4 j = krogci(p, 26.0, 2.3, 3.0, 0.55, 19.0);
  if (j.x < 0.0) { t.dye.x = 0.95 * kromatin(p - j.yz, vec2(j.w), px); t.snov = S_JEDRO; t.jedro = j.x; t.jc = j.yz; t.cc = j.yz; }
  return t;
}`,
};

export const sapnik = {
  id: "sapnik",
  ime: "Sapnik in bronhij",
  opis: "Stena sapnika. Svetlino obdaja dihalni epitelij: večvrstni visokoprizmatski z migetalkami in vrčastimi celicami, ki izločajo sluz. Pod njim je vezivo z žlezami, globlje hialini hrustanec.",
  barvanje: "he",
  velikost: [2400, 1600],
  zacetek: { m: 100, sredisce: [0, 1150] },
  sredisceBlizu: [0, 1370],
  imena: { 8: "celica z migetalkami", 5: "vrčasta celica / žlezna celica", 2: "hondrocit ali fibroblast" },
  snovi: { 16: "sluz", 9: "hrustančni matriks" },
  isci: "Pri 1000× poišči migetalke na površini in vrčaste celice s svetlo sluzjo.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  float rob = odsek(p, vec2(2400.0, 1600.0), 24.0);
  float ys = 1400.0 + 15.0 * sin(p.x / 200.0);
  if (rob > 0.0 || p.y > ys + 6.0) return t;
  float d = ys - p.y;
  if (d < 0.0) {
    // migetalke: tanke niti nad epitelijem
    float m = crta(fract(p.x / 0.6 + 0.3 * sin(p.y)) - 0.5, 0.12, px / 0.6) * step(-6.0, d);
    t.snov = S_CITO; t.dye = vec3(0.1, 0.35 * m, 0.0);
    return t;
  }
  if (d < 48.0) {
    // večvrstni epitelij: jedra na več višinah, vrčaste celice
    float w = 6.5;
    float i = floor(p.x / w);
    vec4 h = h42(vec2(i, 2.0));
    if (h.z < 0.18 && d < 30.0) {
      t.snov = S_SLUZ; t.tip = C_ZLEZNA;
      float lx = (fract(p.x / w) - 0.5) * w;
      t.meja = min(0.5 * w - abs(lx), d);
      t.cc = vec2((i + 0.5) * w, p.y); t.cid = vec2(i, 2.0);
      t.dye = vec3(0.12 + 0.08 * sumL(p, 1.0, px), 0.1, 0.0);
      return t;
    }
    T e = epitel(d, p.x, 48.0, w, 0.35 + 0.55 * h.y, C_RESICE, vec2(0.0, 2.0), p, vec2(0.0, -1.0), px);
    return e;
  }
  if (d < 54.0) { t.snov = S_KOLAGEN; t.dye = vec3(0.04, 0.7, 0.0); return t; }     // debela bazalna membrana
  // hrustanec v globini
  float hr = d - 520.0 - 60.0 * sin(p.x / 500.0);
  if (hr > 0.0 && hr < 700.0) {
    t.snov = S_MATRIKS;
    t.dye = vec3(0.25 + 0.05 * sumL(p, 40.0, px), 0.2, 0.0);
    float rob2 = min(hr, 700.0 - hr);
    if (rob2 < 40.0) { t.snov = S_KOLAGEN; t.dye = vec3(0.05, 0.45, 0.0); }
    vec4 c = krogci(p, 30.0, 6.0, 9.0, 0.75, 27.0);
    if (c.x < 0.0 && rob2 > 40.0) {
      t.snov = S_PRAZNO; t.dye = vec3(0.02, 0.04, 0.0);
      float dc = c.x + 2.0;
      if (dc < 0.0) { t.snov = S_CITO; t.tip = C_FIBROBLAST; t.meja = -dc; t.cc = c.yz; t.jc = c.yz; t.cid = vec2(c.w); t.dye = vec3(0.15, 0.3, 0.0); float dj = length(p - c.yz) - 2.6; t.jedro = dj; if (dj < 0.0) { t.dye.x = 0.95; t.snov = S_JEDRO; } }
    }
    t.dye.x += 0.25 * smoothstep(8.0, 0.0, c.x) * step(40.0, rob2);
    return t;
  }
  // vezivo z žlezami
  t.snov = S_KOLAGEN; t.smer = vec2(1.0, 0.0);
  t.dye = vec3(0.04, 0.3 + 0.12 * smoothstep(0.4, 0.7, sum(p / 9.0)), 0.0);
  vec4 g = krogci(p, 70.0, 20.0, 26.0, smoothstep(120.0, 220.0, d) * 0.8, 33.0);
  if (g.x < 0.0) {
    vec2 q = p - g.yz;
    float r = length(q);
    float R = r - g.x;
    if (r < 4.0) { t.dye = vec3(0.0, 0.04, 0.0); t.snov = S_SLUZ; return t; }
    T e = cevka(q, 4.0, R, 9.0, 0.8, C_ZLEZNA, vec2(g.w), p, px);
    if (fract(g.w * 3.7) < 0.5) { e.dye = vec3(0.18 + 0.1 * sumL(q, 1.0, px), 0.12, 0.0); if (e.snov != S_JEDRO) e.snov = S_SLUZ; }
    return e;
  }
  vec4 f = krogci(p, 30.0, 1.3, 2.0, 0.5, 37.0);
  if (f.x < 0.0) { t.dye.x = 0.85; t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = f.x; t.jc = f.yz; t.cc = f.yz; }
  return t;
}`,
};

export const bezgavka = {
  id: "bezgavka",
  ime: "Bezgavka",
  opis: "Bezgavka je limfatični organ. Pod ovojnico je skorja z limfnimi folikli (gosta temna jedra limfocitov), nekateri imajo svetlejše germinativno središče; v sredici so limfni sinusi in trakovi celic.",
  barvanje: "he",
  velikost: [2300, 1500],
  zacetek: { m: 40, sredisce: [0, 0] },
  sredisceBlizu: [-1450, 450],
  imena: { 3: "limfocit", 15: "makrofag", 2: "retikularna celica" },
  snovi: { 3: "vezivna ovojnica", 14: "limfa v sinusu" },
  isci: "Poišči limfne folikle v skorji. Pri 1000× opazuj limfocite: okroglo temno jedro in le ozek rob citoplazme.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  float o = sdElipsa(p, vec2(2000.0, 1300.0)) + 60.0 * (fbm(p / 400.0, 3) - 0.5);
  if (o > 0.0) {
    if (o < 120.0 && sum(p / 300.0) > 0.45) { Vor v = vor(p, 80.0, vec2(1.0), 0.0, 0.8); t.snov = S_LIPID; t.tip = C_ADIPOCIT; t.meja = v.rob; t.dye = vec3(0.0, 0.5 * crta(v.rob, 0.7, px), 0.0); }
    return t;
  }
  float g = -o;
  if (g < 30.0) { t.snov = S_KOLAGEN; t.smer = vec2(1, 0); t.dye = vec3(0.05, 0.6, 0.0); return t; }
  if (g < 55.0) { t.snov = S_PLAZMA; t.dye = vec3(0.1, 0.12, 0.0); vec4 c = krogci(p, 14.0, 2.8, 3.2, 0.35, 3.0); if (c.x < 0.0) { t.dye.x = 1.2; t.snov = S_JEDRO; t.tip = C_LIMFOCIT; t.jedro = c.x; } return t; }
  // gostota limfocitov
  float gost = 0.85;
  float svetlo = 0.0;
  if (g < 520.0) {
    vec4 f = krogci(p, 520.0, 170.0, 230.0, 0.9, 5.0);
    float R = length(p - f.yz) - f.x;
    if (f.x < 0.0) { gost = 0.97; if (length(p - f.yz) < 0.6 * R) { gost = 0.6; svetlo = 1.0; } }
  } else if (g > 800.0) {
    // sredica: sinusi (svetli) in trakovi
    float s = smoothstep(0.48, 0.52, fbm(p / 160.0 + 4.0, 3));
    gost = mix(0.9, 0.18, s);
  }
  t.snov = S_PLAZMA; t.dye = vec3(0.08, 0.2, 0.0);
  vec4 c = krogci(p, 7.0, 2.6, 3.1, gost, 7.0);
  if (svetlo > 0.5 && fract(c.w * 3.1) < 0.4) c = krogci(p, 7.0, 3.4, 4.2, gost, 7.0);
  if (c.x < 1.4) {
    t.snov = S_CITO; t.tip = C_LIMFOCIT; t.meja = 1.4 - c.x; t.cc = c.yz; t.jc = c.yz; t.cid = vec2(c.w, 7.0);
    t.dye = vec3(0.2, 0.25, 0.25);
    t.jedro = c.x;
    float jk = pokrij(c.x, px);
    t.dye.x = mix(t.dye.x, (svetlo > 0.5 ? 0.8 : 1.25) * kromatin(p - c.yz, vec2(c.w), px), jk);
    if (jk > 0.5) t.snov = S_JEDRO;
  }
  return t;
}`,
};
