// Preparati prebavil (HE): požiralnik, želodec, tanko črevo, debelo črevo. Svetlina je zgoraj, pod sluznico so
// mišica sluznice, podsluznica, dvojna mišična plast (notranja krožna, zunanja vzdolžna) in seroza.
// Mere (Ross in Pawlina): resica ~0,5–1 mm, kripta ~0,3 mm; parietalna celica ~25 µm; epitelij požiralnika ~300 µm.

// Globlje plasti stene; g = globina pod sluznico (µm).
const STENA = /* glsl */ `
T globje(vec2 p, float g, float px) {
  T t = prazno();
  if (g < 18.0) { t.snov = S_CITO; t.tip = C_GLADKA; t.dye = vec3(0.08, 0.55, 0.0); t.meja = 2.0; if (sum(vec2(p.x / 9.0, p.y / 2.0)) > 0.7) { t.dye.x = 0.8; t.snov = S_JEDRO; } return t; }
  if (g < 300.0) {
    t.snov = S_KOLAGEN; t.smer = normalize(vec2(sum(p / 50.0) - 0.5, sum(p / 50.0 + 3.0) - 0.5) + 1e-3);
    // podsluznica: rahlejše vezivo z valovitimi snopi kolagena in svetlimi režami
    vec2 kg = kolagen(p, vec2(1.0, 0.0), 9.0, 0.4, 0.8, 7.0, px);
    t.dye = vec3(0.04, kg.x, 0.0);
    if (kg.y > 0.6) t.snov = S_PRAZNO;
    // fibroblasti: tanka podolgovata jedra vzdolž snopov
    vec4 f = krogci(p, 30.0, 2.0, 2.0, 0.55, 41.0);
    float fw = fract(f.w * 1.37);   // f.w je oznaka krogca, ne število 0..1
    float df = sdElipsa(rot(0.5 * (fw - 0.5)) * (p - f.yz), vec2(4.5 + 1.5 * fw, 1.0));
    if (df < px) { float k = pokrij(df, px); t.dye.x = mix(t.dye.x, 0.85, k); if (k > 0.5) { t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = df; t.jc = f.yz; t.cc = f.yz; } }
    vec4 z = krogci(p, 220.0, 10.0, 28.0, 0.55, 43.0);
    zila(t, p - z.yz, length(p - z.yz) - z.x, 4.0, vec2(z.w), px);
    return t;
  }
  if (g < 620.0 || (g > 640.0 && g < 820.0)) {
    bool vzd = g < 620.0;
    Vor v = vor(p, 7.0, vzd ? vec2(9.0, 1.0) : vec2(1.0), 0.0, 0.9);
    vec4 h = h42(v.id + (vzd ? 0.0 : 70.0));
    t.snov = S_CITO; t.tip = C_GLADKA; t.meja = v.rob; t.cc = v.c; t.jc = v.c; t.cid = v.id;
    t.dye = vec3(0.07, 0.52 + 0.05 * (sumL(p, 30.0, px) - 0.5), 0.0);
    vec2 q = p - v.c;
    float dj = vzd ? sdKapsula(q - vec2(8.0 * (h.x - 0.5), 0.0), 6.0 + 2.0 * h.w, 1.2) : length(q) - 1.3;
    if (h.y < (vzd ? 0.5 : 0.3)) { float jk = pokrij(dj, px); t.dye.x = mix(t.dye.x, 0.75 * kromatin(q, h.zw, px), jk); t.jedro = dj; if (jk > 0.5) t.snov = S_JEDRO; }
    return t;
  }
  if (g <= 640.0) { t.snov = S_KOLAGEN; t.dye = vec3(0.1, 0.3, 0.0); return t; }        // med plastema (živčni pletež)
  if (g < 840.0) { t.snov = S_KOLAGEN; t.dye = vec3(0.05, 0.45, 0.0); return t; }       // seroza
  return t;
}
// Lamina propria: rahlo vezivo z limfociti in kapilarami.
T propria(vec2 p, float px) {
  T t = prazno();
  t.snov = S_KOLAGEN; t.smer = vec2(0.0);
  // rahlo vezivo, polno celic (limfociti, plazmatke, fibroblasti) in kapilar
  t.dye = vec3(0.07, 0.34 + 0.08 * sumL(p, 3.0, px), 0.0);
  vec4 fb = krogci(p, 14.0, 1.0, 1.0, 0.45, 53.0);
  vec2 fq = rot(h12(vec2(fb.w, 2.0)) * 3.14) * (p - fb.yz);
  float df = sdElipsa(fq, vec2(3.6, 1.2));
  if (df < px) { float k = pokrij(df, px); t.dye.x = mix(t.dye.x, 0.85, k); if (k > 0.5) { t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = df; t.jc = fb.yz; t.cc = fb.yz; } }
  vec4 l = krogci(p, 9.0, 2.3, 2.9, 0.7, 47.0);
  if (l.x < 0.0) { t.dye.x = 1.1 * kromatin(p - l.yz, vec2(l.w), px); t.snov = S_JEDRO; t.tip = C_LIMFOCIT; t.jedro = l.x; t.jc = l.yz; t.cc = l.yz; t.cid = vec2(l.w); }
  vec4 e = krogci(p, 18.0, 2.8, 3.3, 0.2, 49.0);
  if (e.x < 0.0) { t.dye = vec3(0.02, 0.75, 0.0); t.snov = S_ERITROCIT; t.meja = -e.x; }
  return t;
}
// Stena kripte (cevaste žleze črevesa): q glede na os kripte, rl svetlina, R zunanji polmer, sk lega vzdolž stene,
// vrc delež vrčastih celic. Vrčaste celice: okrogel do jajčast svetel kelih s penasto sluzjo v svetlinski polovici,
// stisnjeno temno jedro ob bazi; enterociti/kolonociti: rožnata citoplazma, podolgovato jedro ob bazi.
T crevniEpitel(float dl, float H, float sk, vec2 os, float vrc, float paneth, float seme, vec2 p, float px) {
  // dl: globina od svetline (0) do baze (H), sk: lega vzdolž epitelija, os: smer od svetline proti bazi
  float w = 9.0;
  float su = (sk + 0.4 * w * (sum(vec2(sk / 27.0, seme)) - 0.5) + 0.25 * w * (sum(vec2(sk / 8.0, dl / 7.0) + seme * 3.0) - 0.5)) / w;
  float ci = floor(su);
  vec2 cid = vec2(ci, seme * 7.0);
  vec4 hc = h42(cid + 29.0);
  float lat = (0.5 - abs(fract(su) - 0.5)) * w;
  float ls = (fract(su) - 0.5) * w;
  T t = prazno();
  t.snov = S_CITO; t.tip = C_RESICE; t.cid = cid; t.meja = min(lat, min(dl, H - dl));
  t.cc = p - os * (dl - 0.5 * H); t.jc = t.cc;
  float meja = crta(lat, 0.25, px) * (1.0 - smoothstep(0.6, 1.4, px));
  bool vc = hc.x < vrc;
  if (hc.x > 1.0 - paneth) {
    // Panethova celica (dno kripte v tankem črevesu): nad jedrom svetlo rdeča zrnca, bazalno vijolična citoplazma
    t.tip = C_ZLEZNA;
    vec4 z = krogci(p, 1.3, 0.45, 0.6, 0.85 * (1.0 - smoothstep(0.45, 0.62, dl / H)), seme + 9.0);
    t.dye = vec3(0.3, 0.3, 0.0);
    if (z.x < 0.0) t.dye = mix(t.dye, vec3(0.02, 0.95, 0.0), pokrij(z.x, px));
    t.dye.y += 0.35 * (1.0 - smoothstep(0.45, 0.62, dl / H)) * smoothstep(0.6, 1.2, px);
    vec2 jq = vec2(dl - 0.8 * H, ls);
    float dj = length(jq) - 2.6;
    t.jedro = dj;
    float jk = pokrij(dj, px);
    t.dye.x = mix(t.dye.x, 0.95 * kromatin(jq, hc.zw, px), jk);
    if (jk > 0.5) t.snov = S_JEDRO;
    return t;
  }
  if (vc) {
    // kelih: zgornji (svetlinski) del celice, širši od celice same (stisne sosede)
    vec2 kq = vec2(dl - (0.4 + 0.06 * hc.z) * H, ls);
    float dk = sdElipsa(kq, vec2((0.3 + 0.08 * hc.y) * H, 0.47 * w));
    if (dk < 0.0) {
      t.snov = S_SLUZ; t.tip = C_ZLEZNA; t.meja = -dk;
      float pena = sumL(p + hc.zw * 20.0, 0.75, px);
      t.dye = vec3(0.17 + 0.12 * smoothstep(0.4, 0.8, pena), 0.11 + 0.05 * pena, 0.0);
      t.dye += vec3(0.1, 0.3, 0.0) * crta(dk, 0.35, px);
      return t;
    }
    t.dye = vec3(0.1, 0.36, 0.0);
    vec2 jq = vec2(dl - 0.86 * H, ls);
    float dj = sdElipsa(jq, vec2(1.3, 2.4));
    t.jedro = dj;
    float jk = pokrij(dj, px);
    t.dye.x = mix(t.dye.x, 1.1, jk);
    if (jk > 0.5) t.snov = S_JEDRO;
  } else {
    t.dye = vec3(0.09 + 0.05 * hc.y, 0.4 + 0.08 * sumL(p, 2.0, px), 0.0);
    vec2 jq = vec2(dl - (0.66 + 0.12 * hc.z) * H, ls - (hc.w - 0.5) * 1.5);
    float dj = sdElipsa(jq, vec2(4.0, 1.7)) + 0.12 * (sum(jq * 1.4 + hc.zw * 9.0) - 0.5);
    t.jedro = dj;
    float jk = pokrij(dj, px);
    t.dye.x = mix(t.dye.x, 0.95 * kromatin(jq, hc.zw, px), jk);
    if (jk > 0.5) t.snov = S_JEDRO;
  }
  t.dye *= 1.0 - 0.2 * meja;
  t.dye.y += 0.15 * crta(H - dl, 0.4, px);       // bazalna membrana
  return t;
}
T kripta(vec2 q, float rl, float R, float sk, float vrc, float seme, vec2 p, float px) {
  float rq = length(q);
  return crevniEpitel(rq - rl, R - rl, sk, q / max(rq, 1e-3), vrc, 0.0, seme, p, px);
}
// Prizmatski epitelij z vrčastimi celicami (delež vrc): d globina, s lega vzdolž površine.
T prizmatski(float d, float s, float H, float vrc, vec2 p, vec2 os, float resice, float px) {
  float w = 6.0;
  T t = prazno();
  if (vrcasta(t, d, s, H, w, vrc, vec2(0.0, 9.0), px)) return t;
  T e = epitel(d, s, H, w, 0.72, C_RESICE, vec2(0.0, 9.0), p, os, px);
  if (resice > 0.0) e.dye.y += 0.3 * resice * smoothstep(1.5, 0.2, d);
  return e;
}
`;

export const poziralnik = {
  id: "poziralnik",
  ime: "Požiralnik",
  opis: "Stena požiralnika. Svetlino obdaja debel večskladni ploščati epitelij, ki ne poroženeva (varuje pred trenjem hrane). Pod njim so vezivo, mišica sluznice, podsluznica z žlezami in mišična plast.",
  barvanje: "he",
  velikost: [2400, 1500],
  zacetek: { m: 40, sredisce: [0, 300] },
  sredisceBlizu: [0, 1050],
  imena: { 9: "ploščata epitelijska celica", 13: "gladka mišična celica", 3: "limfocit" },
  snovi: { 3: "vezivo" },
  isci: "Primerjaj ta epitelij s kožo: tu na površini ni poroženele plasti in celice obdržijo jedra.",
  glsl: STENA + /* glsl */ `
T tkivo(vec2 p, float px) {
  float rob = odsek(p, vec2(2400.0, 1500.0), 25.0);
  float ys = 1250.0 + 30.0 * sin(p.x / 400.0);
  if (rob > 0.0 || p.y > ys) return prazno();
  float d = ys - p.y;
  float H = 285.0 + 30.0 * sin(p.x / 90.0 + 1.3 * sum(vec2(p.x / 300.0, 2.0)));   // nizke papile, celice se ob njih ne razvlečejo
  // vezivne papile segajo kot ozki prsti do ½–⅔ debeline epitelija; ob njih je temnejša bazalna plast
  float pk = floor(p.x / 140.0);
  vec4 hp = h42(vec2(pk, 12.0));
  float hgt = H * (0.45 + 0.2 * hp.y);
  float gb = H - d;                                                  // višina nad dnom epitelija
  float wpp = (10.0 + 6.0 * hp.z) * sqrt(clamp(1.0 - gb / hgt, 0.0, 1.0));
  float dp = wpp - abs(p.x - (pk + 0.5) * 140.0 - 40.0 * (hp.x - 0.5));
  if (d < H && gb < hgt && dp > 0.0) return propria(p, px);
  if (d < H) {
    T e = vecskladni(d, p.x, H, 0.0, vec2(0.0, 5.0), px);
    if (e.snov != S_JEDRO) e.dye.x += 0.1 * smoothstep(-9.0, -1.0, gb < hgt ? dp : -9.0);
    return vSvet(e, p, vec2(1.0, 0.0), vec2(0.0, -1.0));
  }
  if (d < H + 160.0) return propria(p, px);
  return globje(p, d - H - 160.0, px);
}`,
};

export const zelodec = {
  id: "zelodec",
  ime: "Želodec",
  opis: "Sluznica želodca. Površino in želodčne jamice obdajajo svetle celice, ki izločajo sluz. V žlezah so rožnate parietalne celice (izločajo klorovodikovo kislino) in ob dnu vijolične glavne celice (izločajo pepsinogen).",
  barvanje: "he",
  velikost: [2400, 1500],
  zacetek: { m: 100, sredisce: [0, 900] },
  sredisceBlizu: [0, 820],
  imena: { 5: "parietalna celica / glavna celica", 8: "celica, ki izloča sluz" },
  snovi: { 16: "sluz" },
  isci: "Pri 400× poišči velike rožnate parietalne celice in vijolične glavne celice na dnu žlez.",
  glsl: STENA + /* glsl */ `
T tkivo(vec2 p, float px) {
  float rob = odsek(p, vec2(2400.0, 1500.0), 26.0);
  float ys = 1300.0 + 20.0 * sin(p.x / 300.0);
  if (rob > 0.0 || p.y > ys) return prazno();
  float d = ys - p.y;
  float M = 800.0;                                  // debelina sluznice
  if (d > M) return globje(p, d - M, px);
  float jam = 190.0 + 30.0 * (sum(vec2(p.x / 260.0, 3.0)) - 0.5);   // dno želodčnih jamic
  if (d < jam + 30.0) {
    // želodčne jamice: ozke vijugaste cevke, obdane s svetlimi celicami s sluzjo (foveolarne celice); dno je zaobljeno
    float S = 76.0;
    float xs = p.x + 10.0 * (sum(vec2(p.x / 140.0, d / 110.0)) - 0.5);
    float k = floor(xs / S);
    vec4 h = h42(vec2(k, 3.0));
    float R = 24.0 + 5.0 * h.z;
    float cx = (k + 0.5) * S + 16.0 * (h.x - 0.5);
    float L = jam - 20.0 * h.y;
    float lx = xs - cx;
    float ay = clamp(d, 0.0, L - R);
    vec2 q = vec2(lx, d - ay);
    float rq = length(q);
    if (rq < R) {
      float rl = (2.0 + 4.0 * smoothstep(0.3, 0.8, sum(vec2(k * 1.7, d / 50.0)))) * (1.0 - smoothstep(L - R - 30.0, L - R, d));
      if (rq < rl) { T t = prazno(); t.snov = S_SLUZ; t.dye = vec3(0.06 * sumL(p, 2.0, px), 0.05, 0.0); return t; }
      float sw = d <= L - R ? d : (L - R) + R * (1.5708 - atan(abs(lx), d - (L - R)));
      T e = epitel(rq - rl, sw * sign(lx) + 500.0 * sign(lx), R - rl, 6.0, 0.82, C_ZLEZNA, vec2(k, 1.0), p, q / max(rq, 1e-3), px);
      // svetla sluzna kapa nad jedrom, bazalno rožnata citoplazma
      if (e.snov != S_JEDRO) { float kapa = 1.0 - smoothstep(0.45, 0.65, (rq - rl) / (R - rl)); e.dye = mix(vec3(0.08, 0.36, 0.0), vec3(0.1, 0.2, 0.0), kapa); if (kapa > 0.5) e.snov = S_SLUZ; }
      return e;
    }
    if (d < 24.0) {
      T e = epitel(d, p.x + 900.0, 24.0, 6.0, 0.82, C_ZLEZNA, vec2(0.0, 5.0), p, vec2(0.0, -1.0), px);
      if (e.snov != S_JEDRO) { float kapa = 1.0 - smoothstep(0.45, 0.65, d / 24.0); e.dye = mix(vec3(0.08, 0.36, 0.0), vec3(0.1, 0.2, 0.0), kapa); if (kapa > 0.5) e.snov = S_SLUZ; }
      return e;
    }
    if (d < jam - 10.0) return propria(p, px);
  }
  // žleze telesa: dolge cevke, tesno druga ob drugi, ob dnu bolj zvite; rez mestoma zapusti cevko (odsek se konča
  // z zaobljenim koncem), nekateri odseki so prerezani ob steni in nimajo svetline
  float dno = smoothstep(M - 360.0, M - 80.0, d);
  float zg = smoothstep(jam + 120.0, jam - 10.0, d);          // vrat žleze (sluzne celice vratu)
  float S = 54.0;
  float k0 = floor(p.x / S);
  float best = 1e3, bk = 0.0, bR = 20.0, bs = 0.0;
  vec2 bq = vec2(0.0);
  bool blum = true;
  for (int i = -1; i <= 1; i++) {
    float k = k0 + float(i);
    vec4 h = h42(vec2(k, 23.0));
    float A = mix(11.0, 17.0, dno);
    float cx = (k + 0.5) * S + 8.0 * (h.x - 0.5) + A * (sum(vec2(k * 3.7, d / 55.0)) - 0.5) * 2.0 + 6.0 * (sum(vec2(k * 2.3, d / 26.0)) - 0.5);
    float Ls = 320.0 + 380.0 * h.y;
    float j = floor((d + Ls * h.z) / Ls);
    vec4 hj = h42(vec2(k, j) + 41.0);
    float R = 23.0 + 4.0 * hj.x + 4.0 * (sum(vec2(k * 1.9, d / 90.0)) - 0.5);   // rez seka cevko različno globoko
    float y0 = j * Ls - Ls * h.z;
    float y1 = y0 + Ls * (0.95 + 0.05 * hj.y);
    float ay = clamp(d, y0 + R, max(y1 - R, y0 + R));
    vec2 q = vec2(p.x - cx, d - ay);
    float dd = length(q) - R;
    if (dd < best) { best = dd; bq = q; bk = k * 3.0 + j * 0.37; bR = R; bs = ay + R * atan(q.y, abs(q.x)); blum = hj.z > 0.22; }
  }
  if (d > M - 14.0 + 10.0 * h12(vec2(bk, 5.0))) return propria(p, px);
  if (best > -0.5) {
    // med žlezami le tanko vezivo s kapilarami (eritrociti v vrsti ob cevki), redko jedro
    T t = prazno(); t.snov = S_KOLAGEN; t.dye = vec3(0.06, 0.3 + 0.06 * sumL(p, 2.0, px), 0.0);
    if (best > 0.6 && best < 4.5 && abs(bq.y) < 1.0 && sum(vec2(p.x / 30.0, d / 70.0) + 3.0) > 0.56) { t.dye = vec3(0.02, 0.74, 0.0); t.snov = S_ERITROCIT; t.meja = min(best, 4.5 - best); return t; }
    vec4 l = krogci(p, 16.0, 2.0, 2.6, 0.3, 61.0);
    if (l.x < 0.0) { t.dye.x = 0.95; t.snov = S_JEDRO; t.jedro = l.x; t.jc = l.yz; t.cc = l.yz; }
    return t;
  }
  float rq = length(bq);
  float rl = blum ? 0.5 + 1.5 * smoothstep(0.45, 0.85, sum(vec2(bk, d / 40.0))) : 0.0;   // svetlina je ozka reža, mestoma zaprta
  if (rq < rl) { T t = prazno(); t.snov = S_PLAZMA; t.dye = vec3(0.03, 0.24, 0.0); return t; }
  float H = bR - rl;
  float dl = rq - rl;
  float w = 10.0;
  float side = sign(bq.x);
  // celice niso enako visoke (8–14 µm); na koncu odseka (rez ob steni cevke) jih vidimo od zgoraj kot mnogokotnike
  float su = (bs + 0.6 * w * (sum(vec2(bs / 31.0, bk)) - 0.5) + 0.45 * w * (sum(vec2(bs / 23.0, dl / 16.0) + bk) - 0.5) + 0.3 * w * (sum(vec2(bs / 7.0, dl / 6.0) + bk * 3.0) - 0.5)) / w;
  su += 1.3 * (dl / H - 0.5) * (sum(vec2(bs / 21.0, bk * 2.0)) - 0.5);   // meje so poševne: celice so piramidaste, ne opeke
  float ci = floor(su);
  vec2 cid = vec2(ci, side + bk * 7.0);
  float lat = (0.5 - abs(fract(su) - 0.5)) * w;
  float kapa = smoothstep(0.02, 0.2, abs(bq.y) / bR);
  vec2 qv = vec2(0.0);
  if (kapa > 0.5) {
    Vor cv = vor(p, 11.0, vec2(1.0), 0.0, 0.85);
    cid = cv.id + bk * 13.0; lat = cv.rob; qv = p - cv.c;
  }
  vec4 hc = h42(cid + 17.0);
  vec2 os = bq / max(rq, 1e-3);
  T t = prazno();
  t.snov = S_CITO; t.tip = C_ZLEZNA; t.cid = cid; t.meja = min(lat, -best);
  t.cc = p - os * (dl - 0.5 * H); t.jc = t.cc;
  float meja = max(crta(lat, 0.3, px), crta(-best, 0.35, px));
  bool parietalna = hc.x < mix(0.5, 0.2, dno) * (1.0 - 0.6 * zg);
  float jd; vec2 jr; float jbarva = 0.9;
  if (parietalna) {
    // parietalna celica: rožnata, svetlo zrnata citoplazma, okroglo jedro v sredini (»jajce na oko«)
    t.tip = C_RESICE;
    t.dye = vec3(0.07, 0.5 + 0.1 * sumL(p, 1.1, px) - 0.14 * smoothstep(0.5, 0.75, sumL(p + 7.0, 0.7, px)), 0.0);
    jd = 0.5; jr = vec2(2.7, 2.6) * (0.9 + 0.2 * hc.y);
  } else if (zg > 0.5 && hc.y < 0.6) {
    // sluzna celica vratu: svetla, jedro sploščeno ob bazi
    t.snov = S_SLUZ;
    t.dye = vec3(0.16 + 0.1 * sumL(p, 0.9, px), 0.2, 0.0);
    jd = 0.88; jr = vec2(1.1, 3.0);
  } else {
    // glavna celica: bazofilna (modro-vijolična) zrnata citoplazma, okroglo jedro blizu baze
    t.dye = vec3(0.36 + 0.12 * dno + 0.16 * sumL(p, 0.9, px), 0.24, 0.0);
    jd = 0.84; jr = vec2(2.3, 2.3);   // jedro ob bazi (pregled PR #644)
  }
  vec2 ql = kapa > 0.5 ? qv - (hc.zw - 0.5) * 2.0 : vec2(dl - jd * H - (hc.z - 0.5) * 2.0, (fract(su) - 0.5) * w - (hc.w - 0.5) * 2.0);
  float dj = sdElipsa(ql, jr) + 0.12 * (sum(ql * 1.4 + hc.zw * 9.0) - 0.5);
  vec3 jdv = vec3(dj, ql);
  // vsaka celica je malo drugače obarvana, meje so tanke svetle črte
  t.dye *= 0.92 + 0.16 * hc.y;   // manjše razlike med sosednjimi celicami: ni »šahovnice«
  t.dye *= 1.0 - 0.45 * meja * (1.0 - smoothstep(0.6, 1.4, px));
  t.jedro = jdv.x;
  float jk = pokrij(jdv.x, px) * step(0.1, hc.w);
  t.dye.x = mix(t.dye.x, jbarva * kromatin(jdv.yz, hc.zw, px), jk);
  if (jk > 0.5) t.snov = S_JEDRO;
  return t;
}`,
};

export const tankoCrevo = {
  id: "tanko-crevo",
  ime: "Tanko črevo",
  opis: "Sluznica tankega črevesa ima resice, prstaste izrastke, ki povečajo površino za vsrkavanje. Resice prekriva visokoprizmatski epitelij s ščetkastim robom in vrčastimi celicami; med resicami se odpirajo kripte.",
  barvanje: "he",
  velikost: [2400, 1500],
  zacetek: { m: 40, sredisce: [0, 400] },
  sredisceBlizu: [0, 1050],
  imena: { 8: "enterocit (vsrkavalna celica)", 5: "vrčasta celica", 3: "limfocit", 13: "gladka mišična celica" },
  snovi: { 16: "sluz" },
  isci: "Poišči resice, v njih kapilare, in ščetkasti rob na površini enterocitov. Pri TEM nad 20 000× poišči mikroresice.",
  glsl: STENA + /* glsl */ `
T tkivo(vec2 p, float px) {
  float rob = odsek(p, vec2(2400.0, 1500.0), 27.0);
  if (rob > 0.0) return prazno();
  float yb = 400.0 + 20.0 * sin(p.x / 500.0);      // dno resic
  // resice: listaste, različno visoke (350–650 µm) in široke, proti vrhu tanjše, upognjene; med njimi ozke reže
  float S = 128.0;
  float k0 = floor(p.x / S);
  float dv = 1e3, vk = 0.0, vlx = 0.0;
  for (int i = -1; i <= 1; i++) {
    float k = k0 + float(i);
    vec4 h = h42(vec2(k, 4.0));
    float vy = clamp((p.y - yb) / 500.0, 0.0, 1.3);
    float lx = p.x - (k + 0.5) * S - 20.0 * (h.x - 0.5) - (14.0 + 26.0 * h.y) * (sum(vec2(k * 3.1, p.y / 240.0)) - 0.5) * 2.0 * vy;
    float Hv = 350.0 + 300.0 * h.z;
    float t = clamp((p.y - yb) / Hv, 0.0, 1.0);
    float hw = (54.0 + 12.0 * (h.w - 0.5)) * (1.0 - 0.18 * t + 0.08 * sin(t * 6.0 + h.x * 6.0));
    float tip = yb + Hv - hw;
    float dd = p.y < tip ? abs(lx) - hw : length(vec2(lx, p.y - tip)) - hw;
    if (dd < dv) { dv = dd; vk = k; vlx = lx; }
  }
  dv -= 0.9 * max(0.0, yb + 26.0 - p.y);       // reža med resicama se navzdol zoži v ustje kripte
  {
    if (p.y > yb) {
      if (dv > 0.0) return prazno();
      if (dv > -30.0) {
        T e = crevniEpitel(-dv, 30.0, p.y + 2000.0 * sign(vlx) + 500.0 * vk, vec2(-sign(vlx), 0.0), 0.14, 0.0, vk + (vlx > 0.0 ? 0.5 : 0.0), p, px);
        if (e.snov != S_SLUZ && -dv < 1.6) e.dye = mix(e.dye, vec3(0.04, 0.6, 0.0), 0.7 * (1.0 - smoothstep(0.6, 1.6, -dv)));   // ščetkasti rob
        return e;
      }
      T t = propria(p, px);
      // mlečna žila: ozka, večinoma stisnjena, le mestoma vidna svetlina
      if (abs(vlx) < 2.5 * smoothstep(0.45, 0.7, sum(vec2(vk, p.y / 70.0))) && dv < -60.0) { t.snov = S_PLAZMA; t.dye = vec3(0.0, 0.08, 0.0); }
      return t;
    }
  }
  float d = yb - p.y;
  if (d < 280.0) {
    // kripte: cevaste žleze med resicami, ob dnu Panethove celice z rdečimi zrnci
    // vsaka druga kripta se odpira v režo med resicama (njen epitelij se nadaljuje v epitelij resic), ostale so
    // pod resicami in jih rez ujame le pod vrhom
    float Sc = 0.5 * S;
    float c0 = floor((p.x - 0.25 * S) / Sc);
    float best = 1e3, bk = 0.0, bR = 22.0, bs = 0.0, bL = 0.0;
    vec2 bq = vec2(0.0);
    for (int i = -1; i <= 1; i++) {
      float k = c0 + float(i);
      float vj = floor(k * 0.5);
      bool reza = mod(k, 2.0) > 0.5;
      vec4 hv0 = h42(vec2(vj, 4.0)), hv1 = h42(vec2(vj + 1.0, 4.0));
      float e0 = (vj + 0.5) * S + 20.0 * (hv0.x - 0.5) + (54.0 + 12.0 * (hv0.w - 0.5)) * (1.0 + 0.08 * sin(hv0.x * 6.0));
      float e1 = (vj + 1.5) * S + 20.0 * (hv1.x - 0.5) - (54.0 + 12.0 * (hv1.w - 0.5)) * (1.0 + 0.08 * sin(hv1.x * 6.0));
      vec4 h = h42(vec2(k, 16.0));
      float R = 21.0 + 4.0 * h.z;
      float cx0 = reza ? 0.5 * (e0 + e1) : (vj + 0.5) * S + 20.0 * (hv0.x - 0.5);
      float cx = cx0 + 6.0 * (sum(vec2(k * 2.3, d / 70.0)) - 0.5) * 2.0 * smoothstep(0.0, 80.0, d);
      float L = 250.0 - 40.0 * h.y * h.y;
      float ay = clamp(d, reza ? -10.0 : 40.0 + R, L - R);
      vec2 q = vec2(p.x - cx, d - ay);
      float dd = length(q) - R;
      if (dd < best) { best = dd; bq = q; bk = k; bR = R; bL = L; bs = ay + R * atan(q.y, abs(q.x)); }
    }
    if (best < 0.0) {
      float rq = length(bq);
      float rl = (mod(bk, 2.0) > 0.5 ? 1.5 + 2.0 * smoothstep(0.3, 0.8, sum(vec2(bk * 1.3, d / 50.0))) : 0.0) + 4.0 * smoothstep(40.0, 0.0, d);
      if (rq < rl) { T t = prazno(); t.snov = S_SLUZ; t.dye = vec3(0.06, 0.08, 0.0); return t; }
      float dno = smoothstep(bL - 70.0, bL - 20.0, d);
      return crevniEpitel(rq - rl, bR - rl, bs * sign(bq.x) + 300.0, bq / max(rq, 1e-3), 0.18 * (1.0 - dno), 0.55 * dno, bk + (bq.x > 0.0 ? 0.5 : 0.0), p, px);
    }
    return propria(p, px);
  }
  return globje(p, d - 280.0, px);
}`,
};

export const debeloCrevo = {
  id: "debelo-crevo",
  ime: "Debelo črevo",
  opis: "Sluznica debelega črevesa nima resic. Ravne cevaste kripte so tesno druga ob drugi in polne vrčastih celic, ki izločajo sluz za lažje drsenje blata.",
  barvanje: "he",
  velikost: [2400, 1500],
  zacetek: { m: 100, sredisce: [0, 800] },
  sredisceBlizu: [0, 950],
  imena: { 8: "kolonocit", 5: "vrčasta celica" },
  snovi: { 16: "sluz" },
  isci: "Primerjaj s tankim črevesom: tu ni resic, vrčastih celic pa je veliko več.",
  glsl: STENA + /* glsl */ `
T tkivo(vec2 p, float px) {
  float rob = odsek(p, vec2(2400.0, 1500.0), 28.0);
  float ys = 1150.0 + 20.0 * sin(p.x / 350.0);
  if (rob > 0.0 || p.y > ys) return prazno();
  float d = ys - p.y;
  float M = 480.0;
  if (d > M) return globje(p, d - M, px);
  // kripte: ravne cevke s svetlino, ki se odpira na površino, in zaobljenim dnom tik nad mišičnim slojem sluznice
  float S = 74.0;
  float k0 = floor(p.x / S);
  float best = 1e3, bk = 0.0, bR = 28.0, bs = 0.0, bL = 0.0;
  vec2 bq = vec2(0.0);
  for (int i = -1; i <= 1; i++) {
    float k = k0 + float(i);
    vec4 h = h42(vec2(k, 6.0));
    float R = 26.0 + 6.0 * h.z;
    float cx = (k + 0.5) * S + 12.0 * (h.x - 0.5) + 5.0 * (sum(vec2(k * 2.9, d / 90.0)) - 0.5) * 2.0;
    float L = M - 22.0 - 130.0 * h.y * h.y;
    float ay = clamp(d, 0.0, L - R);
    vec2 q = vec2(p.x - cx, d - ay);
    float dd = length(q) - R;
    if (dd < best) { best = dd; bq = q; bk = k; bR = R; bL = L; bs = ay + R * atan(q.y, abs(q.x)); }
  }
  if (best < 0.0) {
    float rq = length(bq);
    float rl = (1.2 + 2.3 * smoothstep(0.3, 0.8, sum(vec2(bk * 1.3, d / 60.0)))) * (1.0 - 0.7 * smoothstep(bL - 120.0, bL - 30.0, d)) + 4.0 * smoothstep(40.0, 0.0, d);
    if (rq < rl) { T t = prazno(); t.snov = S_SLUZ; t.dye = vec3(0.1 + 0.1 * sumL(p, 1.5, px), 0.1, 0.0); return t; }
    float vrc = 0.62 * (1.0 - 0.6 * smoothstep(bL - 110.0, bL - 20.0, d));    // na dnu kripte manj vrčastih celic
    return kripta(bq, rl, bR, bs * sign(bq.x), vrc, bk + (bq.x > 0.0 ? 0.5 : 0.0), p, px);
  }
  if (d < 26.0) return prizmatski(d, p.x, 26.0, 0.3, p, vec2(0.0, -1.0), 0.5, px);
  return propria(p, px);
}`,
};
