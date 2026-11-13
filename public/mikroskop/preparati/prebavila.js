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
    t.dye = vec3(0.04, 0.22 + 0.25 * smoothstep(0.45, 0.7, sum(rot(1.0) * p / 8.0)), 0.0);
    vec4 f = krogci(p, 32.0, 1.4, 2.0, 0.5, 41.0);
    if (f.x < 0.0) { t.dye.x = 0.85; t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = f.x; t.jc = f.yz; t.cc = f.yz; }
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
  t.dye = vec3(0.05, 0.26 + 0.06 * sumL(p, 3.0, px), 0.0);
  vec4 l = krogci(p, 11.0, 2.4, 3.0, 0.4, 47.0);
  if (l.x < 0.0) { t.dye.x = 1.1 * kromatin(p - l.yz, vec2(l.w), px); t.snov = S_JEDRO; t.tip = C_LIMFOCIT; t.jedro = l.x; t.jc = l.yz; t.cc = l.yz; t.cid = vec2(l.w); }
  vec4 e = krogci(p, 18.0, 2.8, 3.3, 0.2, 49.0);
  if (e.x < 0.0) { t.dye = vec3(0.02, 0.75, 0.0); t.snov = S_ERITROCIT; t.meja = -e.x; }
  return t;
}
// Prizmatski epitelij z vrčastimi celicami (delež vrc): d globina, s lega vzdolž površine.
T prizmatski(float d, float s, float H, float vrc, vec2 p, vec2 os, float resice, float px) {
  float w = 6.0;
  float i = floor(s / w);
  vec4 h = h42(vec2(i, 9.0));
  if (h.z < vrc && d < H * 0.7) {
    T t = prazno();
    t.snov = S_SLUZ; t.tip = C_ZLEZNA; t.cid = vec2(i, 9.0);
    float ls = (fract(s / w) - 0.5) * w;
    t.meja = min(0.5 * w - abs(ls), d);
    t.cc = vec2(i * w, 0.0); t.jc = t.cc;
    t.dye = vec3(0.1 + 0.08 * sumL(vec2(s, d), 1.0, px), 0.08, 0.0);
    return t;
  }
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
  float H = 260.0 + 70.0 * pow(0.5 + 0.5 * sin(p.x / 45.0), 3.0);
  if (d < H) { T e = vecskladni(d, p.x, H, 0.0, vec2(0.0, 5.0), px); return vSvet(e, p, vec2(1.0, 0.0), vec2(0.0, -1.0)); }
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
  // žleze: navpične cevke na 70 µm
  float k = floor(p.x / 70.0);
  vec4 h = h42(vec2(k, 3.0));
  float lx = p.x - (k + 0.5) * 70.0 - 6.0 * (h.x - 0.5) - 6.0 * sin(d / 90.0 + h.y * 6.0);
  float jam = 180.0 + 40.0 * h.z;                   // želodčna jamica
  if (d < jam) {
    float rl = 9.0;
    if (abs(lx) < rl) { T t = prazno(); t.snov = S_SLUZ; t.dye = vec3(0.04, 0.05, 0.0); return t; }
    if (abs(lx) < rl + 26.0) {
      T e = epitel(abs(lx) - rl, d + 500.0 * sign(lx), 26.0, 6.0, 0.8, C_ZLEZNA, vec2(k, 1.0), p, vec2(sign(lx), 0.0), px);
      if (e.snov != S_JEDRO) { e.dye = vec3(0.08, 0.15, 0.0); e.snov = S_SLUZ; }
      return e;
    }
    return propria(p, px);
  }
  float rl = 2.5;
  if (abs(lx) < rl) { T t = prazno(); t.dye = vec3(0.0, 0.05, 0.0); return t; }
  if (abs(lx) < 30.0) {
    float dno = smoothstep(M - 320.0, M - 160.0, d);
    float yi = floor((d + 300.0 * sign(lx)) / 18.0);
    vec4 g = h42(vec2(yi, k + 3.0 * sign(lx)));
    bool pariet = g.x < mix(0.55, 0.15, dno);
    T e = epitel(abs(lx) - rl, d + 300.0 * sign(lx), 27.5, pariet ? 20.0 : 10.0, 0.6, C_ZLEZNA, vec2(k, 2.0), p, vec2(sign(lx), 0.0), px);
    if (e.snov != S_JEDRO) e.dye = pariet ? vec3(0.06, 0.72 + 0.08 * sumL(p, 1.5, px), 0.0) : vec3(0.42 + 0.1 * sumL(p, 1.0, px), 0.3, 0.0);
    if (pariet && e.snov == S_JEDRO) e.dye.x *= 0.8;
    if (pariet) e.tip = C_RESICE;
    return e;
  }
  return propria(p, px);
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
  float k = floor(p.x / 170.0);
  vec4 h = h42(vec2(k, 4.0));
  float lx = p.x - (k + 0.5) * 170.0 - 10.0 * (h.x - 0.5) - 12.0 * sin(p.y / 120.0 + h.y * 6.0);
  float Hv = 520.0 + 160.0 * h.z;
  float dv = max(abs(lx) - 55.0, p.y - yb - Hv);
  dv = min(dv, length(vec2(lx, p.y - yb - Hv)) - 55.0);
  if (p.y > yb) {
    if (dv > 0.0) return prazno();
    if (dv > -30.0) return prizmatski(-dv, p.y * sign(lx) + 2000.0 * sign(lx), 30.0, 0.16, p, vec2(sign(lx), 0.0), 1.0, px);
    T t = propria(p, px);
    if (abs(lx) < 6.0 && p.y < yb + Hv - 40.0) { t.snov = S_PLAZMA; t.dye = vec3(0.0, 0.06, 0.0); }    // mlečna žila
    return t;
  }
  float d = yb - p.y;
  if (d < 280.0) {
    // kripte med resicami
    float kx = p.x - (k + 1.0) * 170.0;
    float r2 = abs(kx);
    if (r2 < 4.0) return prazno();
    if (r2 < 32.0) {
      T e = prizmatski(r2 - 4.0, d * sign(kx) + 900.0, 28.0, 0.2, p, vec2(sign(kx), 0.0), 0.0, px);
      if (d > 230.0 && e.snov != S_JEDRO) e.dye = vec3(0.1, 0.85 * smoothstep(0.5, 0.7, sumL(p, 1.0, px)) + 0.3, 0.0);  // Panethove celice
      return e;
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
  if (d < 26.0) return prizmatski(d, p.x, 26.0, 0.3, p, vec2(0.0, -1.0), 0.5, px);
  float k = floor(p.x / 85.0);
  vec4 h = h42(vec2(k, 6.0));
  float lx = p.x - (k + 0.5) * 85.0 - 5.0 * (h.x - 0.5) - 4.0 * sin(d / 70.0 + h.y * 6.0);
  if (d < M - 30.0 && abs(lx) < 36.0) {
    if (abs(lx) < 5.0) { T t = prazno(); t.snov = S_SLUZ; t.dye = vec3(0.05, 0.04, 0.0); return t; }
    return prizmatski(abs(lx) - 5.0, d * sign(lx) + 3000.0 * sign(lx), 31.0, 0.55, p, vec2(sign(lx), 0.0), 0.0, px);
  }
  return propria(p, px);
}`,
};
