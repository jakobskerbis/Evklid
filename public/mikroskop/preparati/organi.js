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
  // portalni prostor ni okrogel: trikoten do nepravilen obris, rahlo vlaknato vezivo z limfociti
  vec2 zp = p - pk.yz;
  float ap = atan(zp.y, zp.x) + 6.28 * pk.w;
  float rp = 85.0 + 22.0 * cos(3.0 * ap) + 30.0 * (fbm(zp / 45.0 + pk.w * 9.0, 2) - 0.5) * 2.0;
  bool portal = Lp.rob < 120.0 && length(zp) < rp;
  if (portal) {
    vec2 z = zp;
    t.snov = S_KOLAGEN; t.smer = vec2(0.0);
    vec2 kg = kolagen(p, normalize(vec2(-z.y, z.x) + 1e-3), 6.0, 0.4, 0.25, 2.0, px);
    t.dye = vec3(0.07, mix(0.38, kg.x, 0.5), 0.0);
    if (kg.y > 0.9) t.snov = S_PRAZNO;
    vec4 l = krogci(p, 11.0, 2.4, 2.9, 0.45, 19.0);
    if (l.x < 0.0) { t.dye.x = 1.1 * kromatin(p - l.yz, vec2(l.w), px); t.dye.y = 0.15; t.snov = S_JEDRO; t.tip = C_LIMFOCIT; t.jedro = l.x; t.jc = l.yz; t.cc = l.yz; t.cid = vec2(l.w); }
    vec4 f = krogci(p, 18.0, 2.0, 2.0, 0.4, 9.0);
    float df = sdElipsa(rot(f.w * 3.14) * (p - f.yz), vec2(4.0, 1.0));
    if (df < 0.0) { t.dye.x = 0.9; t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = df; t.jc = f.yz; t.cc = f.yz; t.cid = vec2(f.w); }
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
  // plošče hepatocitov (1–2 celici debele) se žarkovito širijo od osrednje vene; med njimi so sinusoidi. V pasovih
  // r = 40·2^b µm se število sinusoidov podvoji, zato se plošče razcepljajo in spajajo kot v resnici.
  float th = atan(q.y, q.x);
  float pas = floor(log2(max(r, 40.0) / 40.0));
  float ns = 12.0 * exp2(pas);
  // šum je del kota, zato se vsak sinusoid notranjega pasu na meji pasov nadaljuje (u se pri meji natanko podvoji)
  float u = (th / 6.2832 * 12.0 + 0.35 * (sum(p / 70.0) - 0.5) + 0.06 * (sum(p / 17.0 + 3.0) - 0.5)) * exp2(pas)
    + 0.35 * (sum(p / 16.0 + 5.0) - 0.5);
  float razmik = 6.2832 * r / ns;
  float dsin = min(fract(u), 1.0 - fract(u)) * razmik;           // razdalja do osi sinusoida (µm)
  // polširina sinusoida: svetlina je nepravilna, mestoma zaprta (le meja med ploščama), drugje 4–10 µm široka
  float sw = 0.4 + 4.6 * smoothstep(0.38, 0.8, sum(p / 15.0 + 7.0)) + 0.7 * (sum(p / 8.0 + 2.0) - 0.5);
  vec2 z = p;
  Vor v = vor(p, 23.0, vec2(1.0, 1.0), 0.0, 0.75);
  vec4 h = h42(v.id);
  if (dsin < sw) {
    t.snov = S_PLAZMA; t.dye = vec3(0.01, 0.05 + 0.06 * sumL(p, 2.0, px), 0.0);
    // sploščena jedra endotelijskih in Kupfferjevih celic ob steni, posamezni eritrociti
    vec2 smer = normalize(vec2(-q.y, q.x) * 0.0 + q);
    vec4 kj = krogci(p, 26.0, 1.0, 1.0, 0.55, 23.0);
    vec2 kq = mat2(smer.x, -smer.y, smer.y, smer.x) * (p - kj.yz);
    float dk = sdElipsa(kq, vec2(4.0, 1.3));
    if (dk < px && abs(dsin - sw + 1.2) < 1.6) { float k = pokrij(dk, px); t.dye = mix(t.dye, vec3(0.95, 0.15, 0.0), k); if (k > 0.5) { t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = dk; t.jc = kj.yz; t.cc = kj.yz; } }
    vec4 e = krogci(p, 9.0, 2.6, 3.2, 0.5, 17.0);
    if (e.x < px && t.snov != S_JEDRO) { float k = pokrij(e.x, px); t.dye = mix(t.dye, vec3(0.0, 0.85, 0.0), k); if (k > 0.5) { t.snov = S_ERITROCIT; t.meja = -e.x; } }
    return t;
  }
  t.snov = S_CITO; t.tip = C_HEPATOCIT; t.meja = min(v.rob, dsin - sw); t.cid = v.id;
  vec2 cz = v.c;
  t.cc = cz;
  t.jc = t.cc;
  // citoplazma zrnato rožnata (mitohondriji, ER), mestoma svetlejša (glikogen); meje celic so le tanke svetlejše črte
  t.dye = vec3(0.1 + 0.04 * sumL(z, 2.0, px), 0.5 + 0.12 * (smoothstep(0.35, 0.75, sumL(z, 0.9, px)) - 0.5) - 0.1 * smoothstep(0.6, 0.8, sum(z / 7.0 + h.xy)), 0.0);
  t.dye.y -= 0.1 * crta(v.rob, 0.25, px);
  t.dye.y -= 0.14 * crta(dsin - sw, 0.3, px) * smoothstep(1.2, 0.6, sw);   // zaprt sinusoid: le svetla meja med ploščama
  vec2 jq = z - cz;
  float dj = length(jq - vec2(h.x - 0.5, h.y - 0.5) * 3.0) - 4.2;
  if (h.w > 0.82) dj = min(length(jq - vec2(-5.0, 0.0)) - 3.8, length(jq - vec2(5.0, 0.0)) - 3.8);   // dvojedrne
  t.jedro = dj;
  float jk = pokrij(dj, px);
  t.dye.x = mix(t.dye.x, 0.58 * kromatin(jq, h.zw, px), jk);   // jedro je svetlo (vezikularno) z jedrcem
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
    float Rt = R - 3.0 - 10.0 * smoothstep(-0.2, 0.9, cos(atan(q.y, q.x) - g.w * 6.28));   // Bowmanov prostor je ponekod le reža
    Rt -= 9.0 * smoothstep(0.55, 0.8, sum(q / 28.0 + g.w * 9.0));                           // klopčič je režnjat
    if (r > Rt + 4.0 * (sum(q / 25.0) - 0.5)) { t.snov = S_PLAZMA; t.dye = vec3(0.0, 0.04, 0.0); return t; }   // Bowmanov prostor
    // klopčič: kapilarne zanke z eritrociti in številna jedra
    vec4 k = krogci(q, 11.0, 2.6, 4.2, 0.8, 7.0);
    t.snov = S_CITO; t.tip = C_SPLOSNA; t.cid = vec2(g.w, 1.0); t.cc = vec2(g.w * 37.0, 11.0); t.meja = 2.0;
    t.dye = vec3(0.16, 0.5, 0.0);
    if (k.x < 0.0) { t.snov = S_PLAZMA; t.dye = vec3(0.02, 0.22, 0.0); vec4 e = krogci(q, 6.0, 2.6, 3.0, 0.35, 9.0); if (e.x < 0.0) { t.dye.y = 0.72; t.snov = S_ERITROCIT; t.meja = -e.x; } }
    vec4 j = krogci(q, 5.2, 1.9, 2.5, 0.9, 11.0);
    if (j.x < 0.0 && k.x > 0.5) { t.dye.x = 1.0 * kromatin(q - j.yz, vec2(j.w), px); t.snov = S_JEDRO; t.jedro = j.x; t.jc = j.yz; }
    return t;
  }
  // cevke: tesno zložene, okrogle, ovalne ali podolgovate (zvite cevke so prerezane pod različnimi koti). Vsaka cevka
  // ima svojo smer in podolgovatost (anizotropni Voronoi), širina vseh je podobna (~50 µm); v žarkih so ravne in
  // vzporedne. Med cevkami je le tanko vezivo s kapilarami, polnimi eritrocitov.
  const float SC = 50.0;
  vec2 gc = floor(p / SC);
  float d1 = 1e9, d2 = 1e9, th1 = 0.0, k1 = 1.0;
  vec2 c1 = vec2(0.0), id1 = vec2(0.0);
  for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++) {
    vec2 id = gc + vec2(float(i), float(j));
    vec4 hh = h42(id + 17.0);
    vec2 c = (id + 0.5 + 0.8 * (hh.xy - 0.5)) * SC;
    float zar = smoothstep(0.6, 0.75, fbm(c / 520.0 + 3.0, 2));
    float th = mix(hh.z * 3.1416, 0.4 + 0.25 * (hh.z - 0.5), zar);
    float k = 1.0 + mix(1.6 * hh.w * hh.w * hh.w, 1.2 + 1.2 * hh.w, zar);
    vec2 l = rot(th) * (p - c);
    float d = length(l / vec2(k, 1.0)) / (0.85 + 0.3 * h12(id + 3.0));
    if (d < d1) { d2 = d1; d1 = d; c1 = c; id1 = id; th1 = th; k1 = k; } else if (d < d2) d2 = d;
  }
  vec4 h = h42(id1);
  // cevke so okrogle (ne mnogokotniki): kjer so sosede daleč, je med njimi intersticij (pregled PR #644)
  float Rt = 24.5 + 4.0 * h12(id1 + 5.0);
  // vezivo je tanko, v kotih med cevkami širše (tam so peritubulne kapilare z eritrociti)
  float vez = 1.0 + 1.0 * smoothstep(0.5, 0.8, sum(p / 23.0 + 4.0)) + 0.4 * max(0.0, d1 - 30.0);
  float stena = min(0.5 * (d2 - d1), Rt - d1);     // približna razdalja do meje cevke (µm)
  if (stena < vez) {
    t.snov = S_KOLAGEN; t.dye = vec3(0.06, 0.34, 0.0);
    vec4 e = krogci(p, 6.0, 2.6, 3.0, 0.75, 13.0);
    if (e.x < 0.0 && stena > 0.4 && (vez > 1.8 || sum(p / 45.0 + 11.0) > 0.58)) { t.dye.y = 0.75; t.snov = S_ERITROCIT; t.meja = -e.x; }
    // jedra fibroblastov in endotelija v intersticiju
    vec4 fj = krogci(p, 11.0, 1.4, 1.9, 0.3, 15.0);
    if (fj.x < 0.0) { t.dye.x = 0.85; t.snov = S_JEDRO; t.jedro = fj.x; }
    return t;
  }
  bool prox = h.x < 0.78;
  vec2 q = rot(th1) * (p - c1) / vec2(k1, 1.0);  // krajevni prostor cevke (krožna)
  float Rb = min(0.5 * (d1 + d2), Rt);             // polmer do meje v tej smeri (krajevne enote)
  float f = d1 / Rb;                                // 0 v središču, 1 na meji
  float a = atan(q.y, q.x);
  // svetlina: proksimalne nepravilna, zvezdasta, mestoma skoraj zaprta; distalne okrogla in odprta
  float fl0 = prox ? 0.24 + 0.16 * h.y : 0.38 + 0.16 * h.y;
  float fl = fl0;
  fl *= prox ? 0.7 + 0.9 * sum(q / 7.0 + h.zw * 7.0) : 1.0 + 0.1 * sin(a * (2.0 + floor(h.z * 3.0)) + h.w * 6.0);
  fl += 0.05 * (sum(p / 3.0 + h.zw * 9.0) - 0.5);
  float rlum = (f - fl) * Rb;                       // razdalja od svetline (µm, približno)
  if (rlum < 0.0) {
    t.snov = S_PLAZMA; t.dye = vec3(0.0, prox ? 0.08 : 0.02, 0.0);
    if (prox) {
      // ščetkasti rob: 1,5–2,5 µm širok svetlo rožnat, radialno progast pas ob svetlini, mestoma odtrgan
      float sir = 1.5 + 1.0 * sum(vec2(a * 3.0, h.y * 9.0));
      float bb = smoothstep(-sir - 0.4, -sir + 0.4, rlum) * (0.75 + 0.25 * smoothstep(0.35, 0.6, sum(q / 4.0 + h.zw * 5.0)));
      float proge = 0.75 + 0.25 * sin(a * Rb * 2.6 + 3.0 * sumL(q, 0.8, px));
      t.dye.y = mix(t.dye.y, 0.36 * proge, bb);
      if (bb > 0.5) t.snov = S_CITO;
    } else t.dye.y = mix(t.dye.y, 0.4, smoothstep(-1.5 * px, 0.0, rlum));   // gladek rob svetline
    return t;
  }
  // celice po obodu: okroglo jedro, meje med celicami komaj vidne (proksimalne) ali jasne (distalne)
  float w = prox ? 11.0 : 8.5;
  float R0 = min(0.5 * SC * (0.85 + 0.3 * h12(id1 + 3.0)), Rt);
  float n = max(5.0, floor(6.2832 * R0 * sqrt(0.5 * (k1 * k1 + 1.0)) * (0.5 + 0.5 * fl0) / w + 0.5));
  float u = (a / 6.2832 + 0.5) * n + 0.25 * (sum(vec2(f * 6.0, h.x * 9.0)) - 0.5);
  float ci = floor(u);
  vec4 hc = h42(vec2(ci, 3.0) + id1 * 7.0);
  float ac = (ci + 0.5) / n * 6.2832 - 3.1416;
  float fn = fl0 + (prox ? 0.55 : 0.45 + 0.15 * hc.x) * (1.0 - fl0);
  vec2 jl = vec2(cos(ac), sin(ac)) * fn * R0;      // stalno mesto (polmer Rb se znotraj celice spreminja)
  vec2 jc = c1 + transpose(rot(th1)) * (jl * vec2(k1, 1.0));
  T e = prazno();
  e.snov = S_CITO; e.tip = C_RESICE; e.cid = vec2(ci, 3.0) + id1 * 7.0;
  float mejaCel = (0.5 - abs(fract(u) - 0.5)) * 6.2832 * f * Rb / n;
  e.meja = min(min(rlum, stena - vez), mejaCel);
  e.cc = jc; e.jc = jc;
  // proksimalne: zrnata, močno eozinofilna citoplazma; distalne: svetlejše, bolj bazofilne
  e.dye = prox ? vec3(0.06, 0.5 + 0.1 * sumL(p, 1.2, px) + 0.06 * sumL(p, 3.5, px) - 0.06 * hc.z, 0.0) : vec3(0.11, 0.4 + 0.05 * hc.z, 0.0);
  if (prox) e.dye.y += 0.1 * smoothstep(2.5, 0.3, rlum) * (0.5 + 0.5 * sumL(q * vec2(1.0, 4.0), 0.5, px));   // ščetkasti rob
  e.dye.y -= (prox ? 0.03 : 0.12) * crta(mejaCel, 0.25, px);
  e.dye.y *= 1.0 - 0.15 * smoothstep(2.0, 0.0, stena - vez);   // bazalna membrana / bazalne gube
  vec2 jq = p - jc;
  float dj = length(jq) - (prox ? 3.1 : 2.6) * (0.9 + 0.2 * hc.y) + 0.25 * (sum(jq * 1.3 + hc.zw * 9.0) - 0.5);
  float jk = pokrij(dj, px) * step(prox ? 0.2 : 0.1, hc.w);
  e.jedro = dj;
  e.dye.x = mix(e.dye.x, 0.8 * kromatin(jq, hc.zw, px), jk);
  if (jk > 0.5) e.snov = S_JEDRO;
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
  // alveoli v prerezu so različno veliki (50–250 µm) in nepravilni; nekatere pregrade se končajo prosto (odprtina
  // v alveolarni vod), konec je odebeljen
  vec2 w = p + 55.0 * vec2(sum(p / 130.0) - 0.5, sum(p / 130.0 + 5.0) - 0.5) + 12.0 * vec2(sum(p / 40.0 + 2.0) - 0.5, sum(p / 40.0 + 8.0) - 0.5);
  Vor v = vor(w, 150.0, vec2(1.0), 0.0, 1.0);
  float sp = sum(p / 40.0);
  float sir = 2.0 + 2.5 * sp + 9.0 * smoothstep(0.62, 0.9, sum(w / 60.0 + 4.0));   // mestoma odebeljeni vozli pregrad
  sir += 0.14 * max(0.0, v.d - 88.0);                // zaobljeni vogali alveolov (trikotni vozli, kjer se stikajo tri pregrade)
  float odp = sum(w / 70.0 + 13.0);
  // prosti konec pregrade je zaobljen in rahlo odebeljen (gumb), ne odrezan (pregled PR #644)
  float Rk = sir * (1.0 + 0.6 * smoothstep(0.58, 0.63, odp));
  float dE = (0.66 - odp) * 140.0;                   // približna razdalja do konca (µm)
  sir = dE >= Rk ? Rk : sqrt(max(0.0, dE * (2.0 * Rk - dE)));
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
  // jedra pnevmocitov in endotelija so sploščena vzdolž pregrade
  vec4 j = krogci(p, 18.0, 2.3, 3.0, 0.6, 19.0);
  vec2 nn = normalize(v.nb + 1e-4);
  vec2 jq = p - j.yz;
  float dj = j.x < 3.5 ? sdElipsa(vec2(dot(jq, vec2(-nn.y, nn.x)), dot(jq, nn)), vec2(3.6, 1.5) * (0.85 + 0.3 * fract(j.w * 1.37))) : 1e3;
  if (dj < 0.0) { t.dye.x = 0.95 * kromatin(jq, vec2(j.w), px); t.snov = S_JEDRO; t.jedro = dj; t.jc = j.yz; t.cc = j.yz; }
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
    if (vrcasta(t, d, p.x, 48.0, w, 0.18, vec2(0.0, 2.0), px)) { t.cc = vec2((i + 0.5) * w, p.y); return t; }
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
  // vezivo z žlezami (seromukozne žleze v režnjičih)
  t.snov = S_KOLAGEN; t.smer = vec2(1.0, 0.0);
  vec2 kg = kolagen(p, vec2(1.0, 0.0), 8.0, 0.36, 0.88, 4.0, px);
  t.dye = vec3(0.04, kg.x, 0.0);
  if (kg.y > 0.6) t.snov = S_PRAZNO;
  vec2 pw = p + 40.0 * (vec2(fbm(p / 160.0, 2), fbm(p / 160.0 + 3.0, 2)) - 0.5) * 2.0;
  vec4 g = krogci(pw, 260.0, 70.0, 110.0, smoothstep(120.0, 220.0, d) * smoothstep(500.0, 420.0, d), 33.0);
  if (g.x < 0.0) {
    T a = acinus(p, 30.0, -1.0, 5.0 + g.w, px);
    if (g.x > -4.0 && a.snov == S_KOLAGEN) { a.dye.y = 0.4; }
    return a;
  }
  vec4 f = krogci(p, 30.0, 2.0, 2.0, 0.5, 37.0);
  float df = sdElipsa(rot(0.4 * (fract(f.w * 1.37) - 0.5)) * (p - f.yz), vec2(4.5, 1.0));
  if (df < px) { float k = pokrij(df, px); t.dye.x = mix(t.dye.x, 0.85, k); if (k > 0.5) { t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = df; t.jc = f.yz; t.cc = f.yz; } }
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
  // gostota limfocitov: skorja z folikli (temen plašč, svetlejše germinativno središče z večjimi celicami),
  // parakorteks gost, sredica s trakovi celic in med njimi razvejanimi svetlejšimi sinusi
  float gost = 0.92;
  float svetlo = 0.0;
  float sinus = 0.0;
  if (g < 520.0) {
    vec4 f = krogci(p, 520.0, 170.0, 230.0, 0.9, 5.0);
    float R = length(p - f.yz) - f.x;
    if (f.x < 0.0) { gost = 0.98; if (length(p - f.yz) < 0.62 * R + 20.0 * (sum(p / 60.0) - 0.5)) { gost = 0.62; svetlo = 1.0; } }
  } else if (g > 760.0) {
    float m = fbm(p / 220.0 + 4.0, 3);
    sinus = smoothstep(0.035, 0.02, abs(m - 0.5)) + 0.7 * smoothstep(0.025, 0.012, abs(fbm(p / 140.0 + 9.0, 2) - 0.5));
    sinus = min(sinus, 1.0) * smoothstep(760.0, 860.0, g);
    gost = mix(0.92, 0.22, sinus);
  }
  // podkapsularni in sredični sinus: svetlo rožnato-sivo ozadje s finimi retikulinskimi vlakni
  t.snov = S_PLAZMA; t.dye = vec3(0.09, 0.28 + 0.08 * sumL(p, 2.0, px), 0.0);
  vec4 c = krogci(p, 6.2, 2.5, 3.0, gost, 7.0);
  if (svetlo > 0.5 && fract(c.w * 3.1) < 0.45) c = krogci(p, 6.2, 3.3, 4.0, gost, 7.0);
  if (sinus > 0.5) {
    // makrofag v sinusu: večja svetla celica z ledvičastim jedrom (vsak tretji krogec mreže, cel, ne razrezan)
    vec4 mk = krogci(p, 25.0, 6.0, 8.0, 0.5, 21.0);
    if (mk.x < 0.0 && fract(mk.w * 5.3) < 0.35) { t.snov = S_CITO; t.tip = C_LEVKOCIT; t.cc = mk.yz; t.jc = mk.yz; t.meja = -mk.x; t.dye = vec3(0.1, 0.38, 0.0); float dj = sdElipsa(p - mk.yz - vec2(1.0, 0.0), vec2(2.6, 3.4)); t.jedro = dj; if (dj < 0.0) { t.dye.x = 0.7; t.snov = S_JEDRO; } return t; }
  }
  if (c.x < 1.0) {
    t.snov = S_CITO; t.tip = C_LIMFOCIT; t.meja = 1.0 - c.x; t.cc = c.yz; t.jc = c.yz; t.cid = vec2(c.w, 7.0);
    t.dye = vec3(0.22, 0.25, 0.0);
    t.jedro = c.x;
    float jk = pokrij(c.x, px);
    t.dye.x = mix(t.dye.x, (svetlo > 0.5 && fract(c.w * 3.1) < 0.45 ? 0.75 : 1.2) * kromatin(p - c.yz, vec2(c.w), px), jk);
    if (jk > 0.5) t.snov = S_JEDRO;
  }
  return t;
}`,
};
