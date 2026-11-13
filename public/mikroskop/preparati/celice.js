// Preparati celic in rastlin: ustna sluznica (metilensko modro), povrhnjica čebule (jod), prečni prerez lista in listna
// povrhnjica z režami (brez barvanja), koreninski vršiček z mitozo (acetoorcein), prerez stebla (safranin in hitra
// zelena). Mere: celica ustne sluznice 50–60 µm, jedro ~8 µm; celica čebule ~250 × 50 µm; palisadne celice ~70 × 12 µm;
// kloroplast 5 × 2 µm; zapiralki ~25 µm; meristemske celice ~14 µm, mitotski indeks ~10 %; koreninski laski do 1 mm.

// Rastlinska celica iz Voronoijeve mreže v: stena polovične debeline sw (v.rob = razdalja do srednje lamele), tanek sloj
// citoplazme in vakuola. kd = barvilo stene (vec3).
const RASTLINSKA = /* glsl */ `
T rCelica(Vor v, vec2 p, float sw, vec3 kd, float px) {
  T t = prazno();
  t.cid = v.id; t.cc = v.c; t.jc = v.c; t.tip = C_SPLOSNA;
  // stena ni povsod enako debela in obarvana; srednja lamela med sosednima celicama je malo temnejša
  float swl = sw * (0.75 + 0.5 * sum(p / 9.0 + v.id * 3.0));
  if (v.rob < swl) {
    t.snov = S_STENA; t.smer = vec2(-v.nb.y, v.nb.x); t.r1 = v.rob;
    t.dye = kd * (0.7 + 0.3 * sumL(p, 2.0, px)) * (0.8 + 0.35 * crta(v.rob, 0.25, px));
    return t;
  }
  sw = swl;
  float m = v.rob - sw;
  if (m < 1.2) { t.snov = S_CITO; t.meja = min(m, 1.2 - m); t.dye = vec3(0.0, 0.05, 0.0); return t; }
  t.snov = S_VAKUOLA; t.meja = m - 1.2; t.dye = vec3(0.0);
  return t;
}
// Kloroplast z dolgo osjo sm, središčem c in polosjo r (svetlobni prikaz + podatki za TEM). Vrne true, če p leži v njem.
bool kloroplastL(inout T t, vec2 p, vec2 c, vec2 sm, float r, float px) {
  vec2 z = mat2(sm.x, -sm.y, sm.y, sm.x) * (p - c);
  float d = sdElipsa(z, vec2(r, 0.62 * r));       // lečast, od strani malo sploščen
  if (d > px) return false;
  float k = pokrij(d, px);
  t.dye = mix(t.dye, vec3(0.75 + 0.25 * sumL(z, 0.45, px), 0.08, 0.0), k);
  if (k > 0.5) { t.snov = S_KLOROPLAST; t.jc = c; t.smer = sm; t.r1 = r; t.meja = 1e3; }
  return k > 0.5;
}
`;

export const ustne = {
  id: "ustne",
  ime: "Celice ustne sluznice",
  opis: "Razmaz celic, ki jih z žličko postrgaš z notranje strani lica. To so ploščate živalske celice brez celične stene. Metilensko modro obarva jedro temno modro, citoplazmo svetlo modro. Drobne pike na celicah so bakterije iz ust.",
  barvanje: "metilensko",
  velikost: [1600, 1100],
  zacetek: { m: 100, sredisce: [0, 0] },
  sredisceBlizu: [0, 0],
  imena: { 9: "celica ustne sluznice", 7: "bakterija iz ust" },
  snovi: {},
  isci: "Poišči jedro v sredini celice in gube na tankih celicah. Primerjaj s celico čebule: ali ima celica ustne sluznice steno?",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  if (odsek(p, vec2(1600.0, 1100.0), 51.0) > 0.0) return t;
  for (int k = 0; k < 2; k++) {
    float fk = float(k);
    vec2 w = p + fk * vec2(37.0, 53.0);
    w += 7.0 * vec2(sum(w / 45.0) - 0.5, sum(w / 45.0 + 7.0) - 0.5);
    w += 3.0 * vec2(sum(w / 13.0 + 3.0) - 0.5, sum(w / 13.0 + 11.0) - 0.5); // robovi niso ravni: tanke celice se zvijejo
    Vor v = vor(w, 80.0, vec2(1.0), 0.0, 0.85);
    vec4 h = h42(v.id + fk * 17.0);
    if (h.x > 0.55 - fk * 0.2) continue;
    float g = 5.0 + 9.0 * h.y + 5.0 * (sum(w / 11.0 + fk) - 0.5);
    float m = v.rob - g;
    if (m < 0.0) continue;
    t.snov = S_CITO; t.tip = C_KERATINOCIT; t.meja = m; t.cc = p - (w - v.c); t.cid = v.id + fk * 17.0;
    // gube: tanke temnejše črte, največ ob robu, kjer se tanka celica prepogne; citoplazma drobno zrnata (keratohialin)
    float guba = crta((sum(w / 22.0 + h.zw * 5.0) - 0.5) * 22.0, 0.22, px) * step(0.5, h.w) * (0.4 + 0.6 * smoothstep(0.35, 0.65, sum(w / 30.0 + 4.0)));
    guba = max(guba, 0.8 * crta(m - 4.0 - 3.0 * sum(w / 9.0 + fk), 0.25, px) * step(0.45, sum(w / 40.0 + 2.0)));
    float zrno = 0.05 * sumL(w, 2.0, px) + 0.05 * sumL(w, 0.6, px);
    t.dye = vec3(0.13 + zrno + 0.22 * guba + 0.25 * crta(m, 0.5, px) + 0.05 * smoothstep(12.0, 0.0, m), 0.06 * crta(m, 0.8, px), 0.0);
    jedroV(t, p, (h.zw - 0.5) * 10.0, vec2(4.3, 3.5), h.z * 6.0, 1.0, px);
    vec4 b = krogci(p, 1.7, 0.35, 0.45, 0.35 * smoothstep(0.55, 0.7, sum(p / 25.0 + fk * 3.0)), 61.0 + fk);
    if (b.x < px && t.snov != S_JEDRO) {
      t.dye.x = mix(t.dye.x, 1.1, pokrij(b.x, px));
      if (b.x < 0.0) { t.tip = C_BAKTERIJA; t.meja = -b.x; t.cc = b.yz; t.cid = vec2(b.w, 61.0); t.jedro = 1e3; }
    }
    return t;
  }
  return t;
}`,
};

export const cebula = {
  id: "cebula",
  ime: "Povrhnjica čebule",
  opis: "Tanka kožica z notranje strani čebulne luske. Podolgovate rastlinske celice ležijo kot opeke. Vsaka ima celično steno, veliko vakuolo in jedro z jedrci. Jod obarva jedro in citoplazmo rumenorjavo. Kloroplastov ni, ker luske rastejo v temi.",
  barvanje: "jod",
  velikost: [1800, 1200],
  zacetek: { m: 100, sredisce: [0, 0] },
  sredisceBlizu: [0, 0],
  imena: { 0: "celica povrhnjice čebule" },
  snovi: { 11: "celična stena (celuloza)", 12: "vakuola" },
  isci: "Poišči celično steno, jedro z jedrci in tanek sloj citoplazme ob steni. Pri TEM poišči srednjo lamelo med stenama sosednjih celic.",
  glsl: RASTLINSKA + /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  if (odsek(p, vec2(1800.0, 1200.0), 53.0) > 0.0) return t;
  float H = 52.0;
  float yy = p.y + 4.0 * sin(p.x / 90.0);
  float row = floor(yy / H);
  float ly = yy - row * H;
  float Lc = 250.0;
  float xr = p.x + row * 97.0;
  float k = floor(xr / Lc);
  float lo = -1e4, hi = 1e4, id = k;
  vec2 slo = vec2(0.0);
  for (int i = -1; i <= 2; i++) {
    float ki = k + float(i);
    vec4 h = h42(vec2(ki, row));
    float b = ki * Lc + 80.0 * (h.x - 0.5) + (h.y - 0.5) * 1.6 * (ly - 0.5 * H);
    if (b <= xr && b > lo) { lo = b; id = ki; }
    if (b > xr && b < hi) hi = b;
  }
  float dx = min(xr - lo, hi - xr) * 0.85;
  float dy = min(ly, H - ly);
  float dw = min(dx, dy);
  vec2 cid = vec2(id, row);
  vec4 h = h42(cid + 0.5);
  t.cid = cid; t.tip = C_SPLOSNA;
  vec2 c = vec2(lo + (hi - lo) * (0.25 + 0.5 * h.z) - row * 97.0, row * H + (h.w < 0.5 ? 0.3 : 0.7) * H - 4.0 * sin(p.x / 90.0));
  t.cc = c; t.jc = c;
  if (dw < 0.9) {
    t.snov = S_STENA; t.smer = dx < dy ? vec2(0.0, 1.0) : vec2(1.0, 0.0); t.r1 = dw;
    t.dye = vec3(0.45 + 0.08 * h.x, 0.0, 0.0);
    return t;
  }
  // jedro (ob njem nekaj citoplazme) in jedrca
  vec2 q = p - c;
  float dj = sdJedro(q, vec2(10.0, 7.0), 0.15 * (h.x - 0.5), cid);
  float cit = 1.3 + 2.0 * smoothstep(0.6, 0.8, sum(p / 30.0 + h.xy * 7.0));
  if (dj < 3.0) {
    t.snov = S_CITO; t.meja = min(dw - 0.9, max(0.0, 3.0 - dj)); t.dye = vec3(0.16 + 0.06 * sumL(p, 0.8, px), 0.0, 0.0);
    float k2 = pokrij(dj, px);
    if (k2 > 0.0) {
      t.dye.x = mix(t.dye.x, 0.55 * kromatin(q, h.zw, px), k2);
      float jc = min(length(q - vec2(2.5, 1.5)) - 1.8, length(q + vec2(3.0, 0.5)) - 1.4 + 2.0 * step(0.5, h.y));
      t.dye.x += 0.6 * pokrij(jc, px) * k2;
      if (k2 > 0.5) { t.snov = S_JEDRO; t.jedro = dj; t.meja = 1e3; }
    }
    return t;
  }
  if (dw < 0.9 + cit) {
    t.snov = S_CITO; t.meja = min(dw - 0.9, 0.9 + cit - dw);
    t.dye = vec3(0.11 + 0.06 * sumL(p, 0.8, px), 0.0, 0.0);
    return t;
  }
  // vakuola s posameznimi tankimi citoplazemskimi nitmi
  t.snov = S_VAKUOLA; t.meja = dw - 0.9 - cit;
  float nit = crta((sum(p / 40.0 + h.zw * 3.0) - 0.5) * 40.0, 0.4, px) * step(0.6, h.y);
  t.dye = vec3(0.012 + 0.1 * nit, 0.0, 0.0);
  if (nit > 0.5) { t.snov = S_CITO; t.meja = 0.4; }
  return t;
}`,
};

export const list = {
  id: "list",
  ime: "List (prečni prerez)",
  opis: "Prečni prerez lista brez barvanja. Pod zgornjo povrhnjico so stebričaste palisadne celice, polne zelenih kloroplastov (tu poteka največ fotosinteze). Pod njimi je gobasto tkivo z zračnimi prostori, v spodnji povrhnjici so listne reže. Žile prevajajo vodo in hrano.",
  barvanje: "naravno",
  velikost: [2000, 600],
  zacetek: { m: 100, sredisce: [0, 0] },
  sredisceBlizu: [100, 60],
  imena: { 0: "celica lista" },
  snovi: { 25: "kloroplast", 11: "celična stena", 12: "vakuola", 6: "kutikula (vosek)" },
  isci: "Poišči palisadno in gobasto tkivo, žilo (ksilem zgoraj, floem spodaj) in listno režo z zapiralkama. Pri TEM v kloroplastu poišči grane (sklade tilakoid).",
  glsl: RASTLINSKA + /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  t.snov = S_PRAZNO;
  if (abs(p.x) > 2000.0 - 60.0 * sum(vec2(p.y / 50.0, 1.0))) return t;
  float yt = 110.0 + 10.0 * sin(p.x / 300.0);
  float yb = -110.0 + 8.0 * sin(p.x / 260.0 + 1.0);
  if (p.y > yt || p.y < yb) return t;
  float d = yt - p.y;            // globina od zgoraj
  float db = p.y - yb;           // višina od spodaj
  vec3 sten = vec3(0.0, 0.2, 0.0);              // nebarvane stene so le blede sence
  // povrhnjici s kutikulo
  if (d < 3.0 || db < 2.5) { t.snov = S_LIPID; t.dye = vec3(0.04, 0.3, 0.0); return t; }
  // listna reža v spodnji povrhnjici in podrežna votlina nad njo
  float j = floor((p.x + 40.0) / 170.0);
  vec4 hj = h42(vec2(j, 4.0));
  float cx = (j + 0.5) * 170.0 - 40.0 + 30.0 * (hj.x - 0.5);
  if (hj.y < 0.75) {
    vec2 q = p - vec2(cx, yb + 9.0);
    float gz = min(length(q - vec2(-7.6, 0.0)), length(q - vec2(7.6, 0.0))) - 6.6;
    if (gz < 0.0) {
      float sx = sign(q.x);
      vec2 gc = vec2(cx + sx * 7.6, yb + 9.0);
      t.cid = vec2(j, sx); t.cc = gc; t.jc = gc; t.tip = C_SPLOSNA;
      float zid = -gz;
      if (zid < 0.8 + 1.4 * smoothstep(4.0, 1.0, abs(q.x))) { t.snov = S_STENA; t.smer = normalize(vec2(-q.y, q.x) + 1e-4); t.r1 = zid; t.dye = vec3(0.0, 0.45, 0.0); return t; }
      t.snov = S_CITO; t.meja = zid - 0.8; t.dye = vec3(0.0, 0.08, 0.0);
      vec4 kk = krogci(p, 2.4, 0.9, 1.1, 0.8, 75.0);
      if (zid > 1.8) kloroplastL(t, p, kk.yz, normalize(vec2(1.0, kk.w - 0.5)), 1.0, px);
      return t;
    }
    if (abs(q.x) < 1.0 && q.y < 7.0) return t;                       // odprtina reže
    float sv = sdElipsa(p - vec2(cx, yb + 32.0), vec2(28.0, 17.0));
    if (sv < 0.0) return t;                                          // podrežna votlina (zrak)
  }
  // celice povrhnjic: pravokotne, brez kloroplastov
  if (d < 21.0 || db < 18.0) {
    bool zg = d < 21.0;
    float s = p.x / 26.0 + (zg ? 0.0 : 0.5);
    float lx = abs(fract(s) - 0.5) * 26.0;
    float dd = zg ? min(d - 3.0, 21.0 - d) : min(db - 2.5, 18.0 - db);
    Vor v; v.id = vec2(floor(s), zg ? 1.0 : 2.0); v.c = vec2((floor(s) + 0.5) * 26.0, zg ? yt - 12.0 : yb + 10.0);
    v.rob = min(13.0 - lx, dd + 0.6 * (zg ? step(d, 5.0) : step(db, 4.5))); v.nb = lx > 13.0 - dd ? vec2(1.0, 0.0) : vec2(0.0, 1.0); v.d = 0.0;
    return rCelica(v, p, 0.7, sten, px);
  }
  // žile: majhne vsakih ~520 µm, ena večja
  float vi = floor((p.x + 260.0) / 520.0);
  float vr = abs(vi) < 0.5 ? 62.0 : 36.0;
  vec2 vc = vec2(vi * 520.0 + 40.0 * h12(vec2(vi, 2.0)), yt - 125.0);
  float dz = length((p - vc) * vec2(1.0, 1.15));
  if (dz < vr) {
    if (dz > vr - 9.0) { Vor v = vor(p, 9.0, vec2(1.0), 0.0, 0.7); T c = rCelica(v, p, 0.6, sten, px); if (c.snov == S_CITO || c.snov == S_VAKUOLA) c.dye.x += 0.15; return c; }   // ovojnica žile
    if (p.y > vc.y - 0.15 * vr) {                                    // ksilem: žile z debelimi stenami
      vec4 x = krogci(p, 0.36 * vr, 0.09 * vr, 0.14 * vr, 0.8, 77.0);
      if (x.x < 0.0) { t.snov = S_PRAZNO; t.meja = -x.x; return t; }
      if (x.x < 1.6) { t.snov = S_STENA; t.smer = normalize(vec2(-(p - x.yz).y, (p - x.yz).x) + 1e-4); t.r1 = x.x; t.dye = vec3(0.0, 0.55, 0.0); return t; }
      Vor v = vor(p, 5.0, vec2(1.0), 0.0, 0.7);
      return rCelica(v, p, 1.0, vec3(0.0, 0.4, 0.0), px);
    }
    Vor v = vor(p, 4.5, vec2(1.0), 0.0, 0.7);                       // floem: drobne celice
    return rCelica(v, p, 0.4, sten, px);
  }
  // palisadno tkivo
  if (d < 92.0) {
    Vor v = vor(p + vec2(0.0, 3.0 * sin(p.x / 7.0)), 11.5, vec2(1.0, 6.0), 0.0, 0.45);
    float rob = min(v.rob, min(d - 21.0, 92.0 - d) * 1.0 + 0.0);
    if (v.rob < 1.2 && sum(vec2(p.x / 6.0, p.y / 25.0)) > 0.64) return t;   // ozki zračni prostori med stebričastimi celicami (redki)
    v.rob = rob;
    T c = rCelica(v, p, 0.4, sten, px);
    // kloroplasti v vrsti ob stenah dolgih stebričastih celic; sredina celice (vakuola) je svetla (pregled PR #644)
    if (c.snov != S_STENA && rob > 0.6 && rob < 3.4) {
      vec4 kk = krogci(p, 2.9, 1.0, 1.0, 0.95, 79.0);
      kloroplastL(c, p, kk.yz, abs(v.nb.x) > 0.5 ? vec2(0.0, 1.0) : vec2(1.0, 0.0), 2.1 + 0.4 * fract(kk.w * 1.37), px);
    }
    return c;
  }
  // gobasto tkivo z velikimi zračnimi prostori
  Vor v = vor(p, 24.0, vec2(1.0, 0.8), 0.0, 0.9);
  // celice gobastega tkiva so zaobljene in različno velike, med njimi veliki zračni prostori
  float g = 1.2 + 4.0 * sum(p / 18.0 + 5.0);
  float zr = min(v.rob, 10.0 - 0.6 * v.d);                             // zaobljeni vogali
  if (zr < g) return t;
  v.rob = zr - g;
  T c = rCelica(v, p, 0.4, sten, px);
  if (c.snov != S_STENA && v.rob > 0.7 && v.rob < 4.0) {
    vec4 kk = krogci(p, 3.6, 1.0, 1.0, 0.7, 81.0);
    kloroplastL(c, p, kk.yz, normalize(vec2(-v.nb.y, v.nb.x) + 1e-4), 1.9 + 0.4 * fract(kk.w * 1.37), px);
  }
  return c;
}`,
};

export const reza = {
  id: "reza",
  ime: "Listna povrhnjica z režami",
  opis: "Tanka spodnja povrhnjica lista, gledana od zgoraj. Celice se prepletajo kot sestavljanka. Med njimi so listne reže: dve fižolasti zapiralki s kloroplasti odpirata in zapirata odprtino, skozi katero list izmenjuje pline in oddaja vodo.",
  barvanje: "naravno",
  velikost: [1600, 1100],
  zacetek: { m: 100, sredisce: [0, 0] },
  sredisceBlizu: [0, 0],
  imena: { 0: "celica povrhnjice ali zapiralka" },
  snovi: { 25: "kloroplast zapiralke", 11: "celična stena", 12: "vakuola" },
  isci: "Poišči listno režo. Kje so kloroplasti: v zapiralkah ali v ostalih celicah povrhnjice?",
  glsl: RASTLINSKA + /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  if (odsek(p, vec2(1600.0, 1100.0), 57.0) > 0.0) return t;
  vec4 r = krogci(p, 125.0, 1.0, 1.0, 0.85, 71.0);
  float ka = fract(r.w * 3.7) * 6.2832;
  vec2 q = rot(ka) * (p - r.yz);
  float de = sdElipsa(q, vec2(17.0, 14.0));
  if (de < 0.0) {
    float sy = q.y > 0.0 ? 1.0 : -1.0;
    float pora = sdElipsa(q, vec2(9.0, 1.2 + 0.8 * fract(r.w * 5.0)));
    if (pora < 0.0) { t.dye = vec3(0.0, 0.55, 0.0); return t; }
    vec2 gc = r.yz + transpose(rot(ka)) * vec2(0.0, sy * 7.5);
    t.cid = vec2(r.w, sy); t.cc = gc; t.jc = gc; t.tip = C_SPLOSNA;
    float zid = min(-de, pora);
    float deb = pora < 1.6 ? 1.6 : 0.8;
    if (zid < deb || abs(q.x) > 16.0 - 2.0 * abs(q.y) / 14.0 || abs(q.y) < 0.6) { t.snov = S_STENA; t.smer = vec2(1.0, 0.0); t.r1 = zid; t.dye = vec3(0.0, 0.45, 0.0); return t; }
    t.snov = S_CITO; t.meja = zid - deb; t.dye = vec3(0.0, 0.07, 0.0);
    float dj = sdElipsa(q - vec2(0.0, sy * 8.0), vec2(3.6, 2.0));
    if (dj < 0.0) { t.snov = S_JEDRO; t.jedro = dj; t.jc = gc + transpose(rot(ka)) * vec2(0.0, sy * 0.5); t.dye.y = 0.2; return t; }
    vec4 kk = krogci(p, 2.5, 1.0, 1.0, 0.75, 73.0);
    if (zid > 1.6) kloroplastL(t, p, kk.yz, normalize(vec2(1.0, kk.w - 0.5)), 1.1, px);
    return t;
  }
  vec2 w = p + 7.0 * vec2(sum(p / 14.0) - 0.5, sum(p / 14.0 + 9.0) - 0.5);
  Vor v = vor(w, 48.0, vec2(1.3, 1.0), 0.4, 0.85);
  v.c = p - (w - v.c);
  v.rob = min(v.rob, de + 0.7);
  T c = rCelica(v, p, 0.7, vec3(0.0, 0.32, 0.0), px);
  vec2 h = h22(v.id);
  float dj = sdElipsa(p - v.c - (h - 0.5) * 12.0, vec2(5.0, 3.6));
  if (dj < 0.0 && c.snov != S_STENA) { c.snov = S_JEDRO; c.jedro = dj; c.jc = v.c + (h - 0.5) * 12.0; c.dye.y = 0.14 + 0.05 * sumL(p, 0.6, px); }
  return c;
}`,
};

export const koren = {
  id: "koren",
  ime: "Koreninski vršiček",
  opis: "Vzdolžni prerez korenine čebule, obarvan z acetoorceinom. Spodaj je koreninska čepica, nad njo delitveno tkivo (meristem), kjer se celice delijo z mitozo. Višje se celice podaljšujejo, še višje rastejo koreninski laski.",
  barvanje: "orcein",
  velikost: [1400, 1800],
  zacetek: { m: 100, sredisce: [0, -800] },
  sredisceBlizu: [0, -860],
  imena: { 0: "celica korenine" },
  snovi: { 27: "kromosomi", 11: "celična stena", 12: "vakuola" },
  isci: "V meristemu poišči vse faze mitoze: profazo (nitke kromatina), metafazo (kromosomi v ravnini na sredini), anafazo (dve skupini kromosomov potujeta narazen) in telofazo (dve novi jedri in nova stena).",
  glsl: /* glsl */ `
float cIdx(float y) {
  if (y < -500.0) return y / 14.0;
  return -500.0 / 14.0 + (log(14.0 + 0.09 * (y + 500.0)) - log(14.0)) / 0.09;
}
T stenaK(T t, float dw, vec2 sm) { t.snov = S_STENA; t.smer = sm; t.r1 = dw; t.dye = vec3(0.05, 0.3, 0.0); return t; }
T tkivo(vec2 p, float px) {
  T t = prazno();
  if (p.y > 1650.0 - 80.0 * sum(vec2(p.x / 60.0, 1.0))) return t;
  float yt = -1300.0;
  float R = 420.0 * sqrt(clamp((p.y - yt) / 420.0, 0.0, 1.0));
  float ax = abs(p.x);
  // koreninski laski
  if (ax > R) {
    if (p.y < 450.0) return t;
    float sx = sign(p.x);
    float ey = p.y + 0.12 * (ax - R);
    float jj = floor(ey / 26.0);
    for (int i = -1; i <= 1; i++) {
      float ji = jj + float(i);
      vec4 h = h42(vec2(ji, sx));
      if (h.x > 0.55 * smoothstep(450.0, 650.0, ji * 26.0)) continue;
      vec2 b = vec2(sx * (R - 2.0), (ji + 0.5) * 26.0);
      vec2 dir = normalize(vec2(sx, -0.12 + 0.1 * (h.y - 0.5)));
      vec2 l = p - b;
      float a = dot(l, dir);
      float L = 250.0 + 500.0 * h.z;
      float c = abs(dot(l, vec2(-dir.y, dir.x)) + 3.0 * sin(a / 60.0 + h.w * 6.0));
      float dl = max(c - 5.5, a - L);
      if (dl < 0.0 && a > 0.0) {
        t.cid = vec2(ji, sx); t.cc = b; t.jc = b; t.tip = C_SPLOSNA;
        if (-dl < 0.5) return stenaK(t, -dl, dir);
        t.snov = S_VAKUOLA; t.meja = -dl - 0.5; t.dye = vec3(0.02, 0.02, 0.0);
        return t;
      }
    }
    return t;
  }
  float ycap = -1060.0 + p.x * p.x / 600.0;
  if (p.y < ycap) {                                                   // koreninska čepica
    float ob = R - ax + (p.y - yt) * 0.4;
    if (ob < 25.0 && sum(p / 16.0) > 0.6) return t;                   // odluščene celice
    Vor v = vor(p, 19.0, vec2(1.3, 1.0), 0.0, 0.6);
    t.cid = v.id; t.cc = v.c; t.jc = v.c; t.tip = C_SPLOSNA;
    if (v.rob < 0.5) return stenaK(t, v.rob, vec2(-v.nb.y, v.nb.x));
    t.snov = S_CITO; t.meja = v.rob - 0.5; t.dye = vec3(0.08 + 0.04 * sumL(p, 1.0, px), 0.08, 0.0);
    vec2 q = p - v.c;
    vec4 a = krogci(p, 2.2, 0.6, 0.8, 0.8 * smoothstep(2.0, -6.0, q.y), 83.0);   // škrobna zrna (statoliti) spodaj
    if (a.x < 0.0) t.dye.y += 0.35;
    float dj = length(q - vec2(0.0, 2.0)) - 3.0;
    if (dj < px) { t.dye.x = mix(t.dye.x, 0.75 * kromatin(q, v.id, px), pokrij(dj, px)); if (dj < 0.0) { t.snov = S_JEDRO; t.jedro = dj; } }
    return t;
  }
  // vzdolžne vrste celic, ki se proti vršičku zožijo
  // vrste niso ravnila: rahlo vijugajo, celice v vsaki vrsti so različno dolge
  float u = p.x * 420.0 / max(R, 40.0) + 5.0 * (sum(vec2(p.y / 70.0, p.x / 90.0)) - 0.5) + 2.0 * (sum(vec2(p.y / 23.0, p.x / 31.0) + 4.0) - 0.5);
  float fw = 13.0;
  float fi = floor(u / fw);
  float sk = R / 420.0;
  float lu = (fract(u / fw) - 0.5) * fw * sk;
  float cw = 0.5 * fw * sk;
  vec4 hf = h42(vec2(fi, 3.0));
  // prečne stene so rahlo poševne in ukrivljene, celice v vrsti so različno dolge
  float lu0 = (fract(u / fw) - 0.5);
  float cc = cIdx(p.y) + hf.x + 0.55 * (sum(vec2(fi * 1.7, p.y / 35.0)) - 0.5) + (0.12 + 0.1 * hf.y) * lu0 * (hf.z < 0.5 ? 1.0 : -1.0) + 0.06 * lu0 * lu0;
  float ci = floor(cc);
  float hh = p.y < -500.0 ? 14.0 : 14.0 + 0.09 * (p.y + 500.0);
  float lv = (fract(cc) - 0.5) * hh;
  float dx = cw - abs(lu), dy = 0.5 * hh - abs(lv);
  float dw = min(dx, dy);
  vec2 cid = vec2(fi, ci);
  vec4 h = h42(cid);
  t.cid = cid; t.tip = C_SPLOSNA; t.cc = p - vec2(lu, lv); t.jc = t.cc;
  if (dw < 0.3) return stenaK(t, dw, dx < dy ? vec2(0.0, 1.0) : vec2(1.0, 0.0));
  t.snov = S_CITO; t.meja = dw - 0.3;
  t.dye = vec3(0.07 + 0.04 * sumL(p, 1.2, px), 0.09, 0.0);
  float mer = 1.0 - smoothstep(-640.0, -420.0, p.y);
  vec2 q = vec2(lu, lv);
  // vakuole v coni podaljševanja
  float vak = smoothstep(-650.0, 200.0, p.y);
  if (vak > 0.0 && dw > 1.6 && sum(q / 5.0 + h.zw * 9.0) < vak * 0.9 + 0.1 * (1.0 - vak)) { t.snov = S_VAKUOLA; t.meja = dw - 1.6; t.dye = vec3(0.015, 0.02, 0.0); }
  float rn = min(4.4, 0.78 * min(cw, 0.5 * hh));
  float ph = h.z;
  if (mer < 0.5 || ph > 0.15) {
    vec2 qn = q - vec2(0.0, 0.25 * hh * (h.w - 0.5) * (1.0 - mer));
    float dj = length(qn) - rn + 0.3 * (sum(qn / 1.5 + h.xy * 9.0) - 0.5);
    if (dj < px) {
      float k = pokrij(dj, px);
      // orcein obarva vse jedro zrnato vijolično; jedrce je le malo temnejše
      t.dye.x = mix(t.dye.x, 0.32 + 0.45 * kromatin(qn, h.xy, px) + 0.25 * pokrij(length(qn - vec2(0.8, 0.6)) - 1.1, px), k);
      if (k > 0.5) { t.snov = S_JEDRO; t.jedro = dj; t.jc = t.cc + vec2(0.0, 0.25 * hh * (h.w - 0.5) * (1.0 - mer)); }
    }
    return t;
  }
  float kr = 1e3;
  if (ph < 0.06) {                                                   // profaza: zgoščene nitke v jedru
    float dj = length(q) - rn;
    if (dj < 0.0) {
      float n1 = crta((sum(q / 1.1 + h.xy * 9.0) - 0.5) * 1.1, 0.2, px);
      float n2 = crta((sum(q / 0.9 + 3.0 + h.yx * 5.0) - 0.5) * 0.9, 0.17, px);
      float nit = min(1.0, n1 + n2);
      t.dye.x = 0.18 + 1.1 * nit; t.snov = nit > 0.5 ? S_KROMATIN : S_JEDRO; t.jedro = dj;
      return t;
    }
  } else if (ph < 0.095) {                                           // metafaza: kromosomi v ekvatorialni ravnini
    float i = floor(q.x / 0.95);
    vec4 hc = h42(vec2(i, ci) + cid);
    if (abs(q.x) < cw - 1.8 && hc.x < 0.8)
      kr = sdKapsula(vec2(q.y - 0.5 * (hc.y - 0.5), (fract(q.x / 0.95) - 0.5) * 0.95), 0.9 + 0.7 * hc.z, 0.32);
    t.dye.y += 0.05 * crta(abs(q.x) - abs(abs(q.y) - 0.45 * hh) * (cw / (0.45 * hh)), 0.15, px) * step(abs(q.y), 0.45 * hh);
  } else if (ph < 0.125) {                                           // anafaza: dve skupini potujeta k poloma
    float s = 0.2 * hh;
    vec2 q2 = vec2(q.x * (1.0 + 0.15 * (abs(q.y) - s)), abs(q.y) - s);
    float i = floor(q2.x / 0.9);
    vec4 hc = h42(vec2(i, ci + sign(q.y)) + cid);
    if (abs(q.x) < cw - 2.2 && hc.x < 0.8)
      kr = sdKapsula(vec2(q2.y + 0.9, (fract(q2.x / 0.9) - 0.5) * 0.9), 0.8 + 0.5 * hc.z, 0.3);
  } else {                                                           // telofaza: dve jedri in celična plošča
    vec2 q2 = vec2(q.x, abs(q.y) - 0.27 * hh);
    kr = sdElipsa(q2, vec2(min(cw * 0.6, 3.5), 2.0)) + 0.3 * (sum(q * 1.5 + h.xy * 5.0) - 0.5);
    t.dye.y += 0.3 * crta(q.y, 0.25, px) * step(abs(q.x), cw * (0.4 + 2.0 * (ph - 0.125)));
  }
  float k = pokrij(kr, px);
  t.dye.x = mix(t.dye.x, 1.25, k);
  if (k > 0.5) t.snov = S_KROMATIN;
  return t;
}`,
};

export const steblo = {
  id: "steblo",
  ime: "Steblo (prečni prerez)",
  opis: "Prečni prerez stebla dvokaličnice (sončnice), obarvan s safraninom in hitro zeleno. Olesenele stene (ksilem in sklerenhimska vlakna) so rdeče, tanke celulozne stene zelene. Prevajalni snopiči so razporejeni v krogu: ksilem na notranji strani, floem na zunanji.",
  barvanje: "safranin",
  velikost: [1600, 1600],
  zacetek: { m: 40, sredisce: [0, 0] },
  sredisceBlizu: [-200, 1133],
  imena: { 0: "rastlinska celica" },
  snovi: { 11: "celična stena", 12: "vakuola", 0: "svetlina cevi ksilema", 6: "kutikula" },
  isci: "Poišči prevajalni snopič: rdeče cevi ksilema, zelen floem in rdečo kapo vlaken. Med ksilemom in floemom je kambij iz ploščatih celic.",
  glsl: RASTLINSKA + /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  float r = length(p) + 25.0 * (sum(p / 300.0) - 0.5);
  float g = 1500.0 - r;
  if (g < 0.0) return t;
  vec3 zel = vec3(0.04, 0.5, 0.0), rde = vec3(0.85, 0.06, 0.0);
  if (g < 3.0) { t.snov = S_LIPID; t.dye = vec3(0.35, 0.08, 0.0); return t; }
  float th = atan(p.y, p.x);
  if (g < 18.0) {                                                    // povrhnjica
    float s = th * 1500.0 / 15.0;
    float lx = abs(fract(s) - 0.5) * 15.0;
    Vor v; v.id = vec2(floor(s), 1.0); v.c = p; v.rob = min(7.5 - lx, min(g - 3.0, 18.0 - g) + 0.6); v.nb = vec2(1.0, 0.0); v.d = 0.0;
    return rCelica(v, p, 0.7, zel, px);
  }
  if (g < 90.0) {                                                    // kolenhim: odebeljeni vogali
    Vor v = vor(p, 16.0, vec2(1.0), 0.0, 0.7);
    return rCelica(v, p, 1.0 + 1.6 * smoothstep(0.6, 0.15, v.rob / 8.0 + 0.4 * (v.d / 8.0)), zel * 1.3, px);
  }
  // prevajalni snopiči
  float k = floor(th / (6.2832 / 18.0) + 0.5);
  float s = (th - k * 6.2832 / 18.0) * r;
  float rr = r - 1150.0;
  float sb = sdElipsa(vec2(s, rr), vec2(115.0, 190.0));
  if (sb < 0.0) {
    if (rr > 115.0) { Vor v = vor(p, 8.0, vec2(1.0), 0.0, 0.7); return rCelica(v, p, 2.2, rde, px); }       // vlakna
    if (rr > 45.0) { Vor v = vor(p, 7.0, vec2(1.0), 0.0, 0.75); return rCelica(v, p, 0.5, zel, px); }       // floem
    if (rr > 28.0) { Vor v = vor(vec2(s, rr), 6.0, vec2(1.0, 0.35), 0.0, 0.3); v.c = p; return rCelica(v, p, 0.4, zel, px); }   // kambij
    vec4 x = krogci(p, 34.0, 9.0, 17.0, 0.7, 87.0);                 // ksilem
    if (x.x < 0.0) { t.snov = S_PRAZNO; t.meja = -x.x; return t; }
    if (x.x < 2.6) { vec2 dq = p - x.yz; t.snov = S_STENA; t.smer = normalize(vec2(-dq.y, dq.x) + 1e-4); t.r1 = x.x; t.dye = rde * 1.1; return t; }
    Vor v = vor(p, 7.0, vec2(1.0), 0.0, 0.75);
    return rCelica(v, p, 1.3, rde * 0.85, px);
  }
  if (abs(rr - 36.0) < 8.0 && r < 1300.0) { Vor v = vor(vec2(s, rr), 6.0, vec2(1.0, 0.35), 0.0, 0.3); v.c = p; return rCelica(v, p, 0.4, zel, px); }   // medsnopični kambij
  // skorja, strženovi trakovi in stržen: parenhim z medceličnimi prostori
  float vel = r > 1210.0 ? 38.0 : (r > 950.0 ? 30.0 : 70.0);
  Vor v = vor(p, vel, vec2(1.0), 0.0, 0.85);
  if (v.rob < 1.4 && v.d < 0.3 * vel && sum(p / 7.0) > 0.62) return t;
  return rCelica(v, p, r > 1210.0 ? 0.9 : 1.2, zel, px);
}`,
};

// ---------- mikrobi (na kapljici ali razmazu) ----------
// Bakterije in kvasovke pri TEM: celična stena (Gram+: debel peptidoglikan ~30 nm; Gram–: zunanja membrana in tanek
// periplazemski prostor; kvasovka: stena ~150 nm), nukleoid, ribosomi. t.smer.x = razdalja do zunanje površine (µm),
// t.r1 = vrsta ovojnice (1 Gram+, 2 Gram–, 3 kvasovka).
const MIKROB_TEM = /* glsl */ `
#define IMA_TEM_POSEBNO
void temPosebno(inout U u, T t, vec2 p, float px) {
  if (t.r1 < 0.5 || t.r1 > 3.5 || (t.tip != C_BAKTERIJA && t.tip != C_KVASOVKA)) return;
  float d = t.smer.x;
  float vid = 1.0 - smoothstep(0.004, 0.012, px);
  if (t.tip == C_BAKTERIJA) {
    // ribosomi in nukleoid
    vec2 n3 = floor(p / 0.03);
    vec4 h = h42(n3 + t.cid * 5.7);
    float rib = step(h.z, 0.45) * pokrij(length(p - (n3 + 0.2 + 0.6 * h.xy) * 0.03) - 0.01, px) * vid;
    float nuk = smoothstep(-0.1, -0.2, d) * smoothstep(0.45, 0.6, sum((p - t.cc) / 0.25 + t.cid));
    u.g = mix(0.3 + 0.12 * (1.0 - vid), 0.12 + 0.08 * sumL(p, 0.01, px), nuk);
    u.g = mix(u.g, 0.85, rib * (1.0 - nuk));
    if (rib > 0.5 && nuk < 0.5) u.snov = S_RIBOSOM;
  }
  float w = t.r1 < 1.5 ? 0.032 : (t.r1 < 2.5 ? 0.022 : 0.15);
  if (d > -w) {
    float g = t.r1 < 1.5 ? 0.62 : (t.r1 < 2.5 ? 0.12 : 0.4 + 0.3 * smoothstep(-0.04, -0.01, d));
    u.g = g + 0.06 * (sumL(p, 0.01, px) - 0.5);
    u.snov = S_STENA;
    if (t.r1 > 1.5 && t.r1 < 2.5) {
      u.g = mix(u.g, 0.8, membrana(d + 0.004, px));
      u.g = mix(u.g, 0.5, crta(d + 0.013, 0.002, px));
      if (abs(d + 0.004) < 0.004) u.snov = S_MEMBRANA;
    }
  }
}
// Ena bakterija ali kvasovka: d = razdalja do površine, w = debelina stene; vrne T celice.
T mikrob(float d, float w, vec2 c, vec2 cid, float tip, float ovoj) {
  T t = prazno();
  t.snov = S_CITO; t.tip = tip; t.cc = c; t.jc = c; t.cid = cid; t.r1 = ovoj;
  t.smer = vec2(d, 0.0);
  t.meja = abs(d + w + 0.004);
  if (d > -w) { t.snov = S_STENA; }
  return t;
}
`;

export const bakterije = {
  id: "bakterije",
  ime: "Bakterije (barvanje po Gramu)",
  opis: "Razmaz bakterij, barvan po Gramu. Grampozitivne bakterije (tu okrogli stafilokoki v grozdih) imajo debelo steno, ki zadrži vijolično barvilo. Gramnegativne (tu paličaste bakterije E. coli) imajo tanko steno z zunanjo membrano in so rožnate.",
  barvanje: "gram",
  velikost: [500, 350],
  zacetek: { m: 1000, sredisce: [0, 0] },
  sredisceBlizu: [0, 0],
  imena: { 7: "bakterija" },
  snovi: { 11: "celična stena bakterije" },
  isci: "Pri 1000× z oljem poišči vijolične koke v grozdih in rožnate paličke. Pri TEM primerjaj steni: debelo pri grampozitivnih, dve membrani pri gramnegativnih.",
  glsl: "#define SEM_PROSTE\n" + MIKROB_TEM + /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  if (odsek(p, vec2(500.0, 350.0), 59.0) > 0.0) return t;
  t.dye = vec3(0.0, 0.04 * sumL(p, 3.0, px), 0.0);
  float grozd = smoothstep(0.6, 0.7, fbm(p / 14.0, 3));
  if (grozd > 0.0) {
    vec4 k = krogci(p, 1.05, 0.46, 0.52, 0.92 * grozd, 81.0);
    if (k.x < px) {
      T b = mikrob(k.x, 0.032, k.yz, vec2(k.w, 1.0), C_BAKTERIJA, 1.0);
      b.dye = vec3(1.35 * pokrij(k.x, px), 0.0, 0.0);
      if (k.x < 0.0) return b;
      t.dye = mix(t.dye, b.dye, pokrij(k.x, px));
    }
  }
  vec2 n = floor(p / 3.5);
  float best = 1e3; vec2 bc = vec2(0.0); vec2 bid = vec2(0.0);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 kk = n + vec2(i, j);
    vec4 h = h42(kk + 91.0);
    if (h.z > 0.5 * (1.0 - grozd)) continue;
    vec2 c = (kk + 0.5 + 0.6 * (h.xy - 0.5)) * 3.5;
    vec2 z = rot(h.w * 6.2832) * (p - c);
    float d = sdKapsula(z, 0.55 + 0.45 * h.x, 0.31);
    if (d < best) { best = d; bc = c; bid = kk; }
  }
  if (best < px) {
    T b = mikrob(best, 0.022, bc, bid, C_BAKTERIJA, 2.0);
    b.dye = vec3(0.0, 1.0 * pokrij(best, px), 0.0);
    if (best < 0.0) return b;
    t.dye = mix(t.dye, b.dye, pokrij(best, px));
  }
  return t;
}`,
};

export const kvasovke = {
  id: "kvasovke",
  ime: "Kvasovke",
  opis: "Pivske kvasovke v kapljici z metilenskim modrim. Kvasovke so enocelične glive. Ovalne celice se razmnožujejo z brstenjem: na celici zraste manjša hčerinska celica. Žive celice barvilo razbarvajo in ostanejo svetle, mrtve so modre.",
  barvanje: "metilensko",
  velikost: [600, 420],
  zacetek: { m: 400, sredisce: [0, 0] },
  sredisceBlizu: [0, 0],
  imena: { 11: "kvasovka" },
  snovi: { 11: "celična stena kvasovke", 12: "vakuola" },
  isci: "Poišči kvasovko z brstom. Koliko celic je mrtvih (modrih)?",
  glsl: "#define SEM_PROSTE\n" + MIKROB_TEM + /* glsl */ `
T tkivo(vec2 p, float px) {
  T t = prazno();
  if (odsek(p, vec2(600.0, 420.0), 61.0) > 0.0) return t;
  vec4 k = krogci(p, 10.0, 2.4, 3.1, 0.8, 83.0);
  float ka = fract(k.w * 2.3) * 6.2832;
  vec2 q = rot(ka) * (p - k.yz);
  float r = 2.3 + 0.9 * fract(k.w * 3.1);
  float d = sdElipsa(q, vec2(r * 1.15, r * 0.92));
  float rb = 0.9 + 0.8 * fract(k.w * 11.0);
  if (fract(k.w * 7.3) < 0.35) d = min(d, sdKrog(q - vec2(r * 1.15 + rb * 0.75, 0.0), rb));
  if (d > px) return t;
  bool mrtva = fract(k.w * 5.7) < 0.15;
  T c = mikrob(d, 0.15, k.yz, vec2(k.w, 9.0), C_KVASOVKA, 3.0);
  c.dye = vec3((mrtva ? 0.95 : 0.06) + 0.05 * sumL(p, 0.4, px), 0.25 * crta(d + 0.1, 0.12, px), 0.0) * pokrij(d, px);
  vec2 vq = q - vec2(0.5 * r, -0.2 * r);
  float dv = length(vq) - 0.38 * r;
  if (dv < 0.0 && d < -0.3) { c.snov = S_VAKUOLA; c.meja = -dv; c.dye.x *= 0.5; }
  else if (d < -0.15) c.meja = min(c.meja, abs(dv));
  vec2 jq = q + vec2(0.45 * r, 0.1 * r);
  float dj = length(jq) - 0.35 * r;
  if (dj < 0.1 && d < -0.3 && dv > 0.0) { c.jedro = dj; c.jc = k.yz + transpose(rot(ka)) * vec2(-0.45 * r, -0.1 * r); if (dj < 0.0) c.snov = S_JEDRO; }
  return c;
}`,
};

export const kapljica = {
  id: "kapljica",
  ime: "Kapljica vode iz ribnika",
  opis: "Živa kapljica iz ribnika brez barvanja. V njej plavajo praživali: copatkar z migetalkami, evglena z zelenimi kloroplasti in rdečo očesno pego, ameba s panožicami. Diagonalno leži nitasta alga zelenica s spiralnim kloroplastom (uvijačka).",
  barvanje: "naravno",
  velikost: [1200, 800],
  zacetek: { m: 100, sredisce: [0, 0] },
  sredisceBlizu: [-50, 66],
  imena: { 12: "pražival", 6: "celica alge" },
  snovi: { 25: "kloroplast", 12: "voda ali vakuola", 11: "celična stena alge" },
  isci: "Poišči copatkarja in njegovo veliko jedro, utripajoči vakuoli in migetalke. Pri evgleni poišči rdečo očesno pego in bičeka.",
  glsl: "#define SEM_PROSTE\n" + RASTLINSKA + /* glsl */ `
T voda(vec2 p, float px) {
  T t = prazno();
  t.snov = S_VAKUOLA;
  vec4 b = krogci(p, 9.0, 0.3, 0.6, 0.25, 97.0);
  t.dye = vec3(0.0, 0.03 * sumL(p, 40.0, px) + 0.35 * pokrij(b.x, px), 0.0);
  return t;
}
T protist(vec2 p, vec2 c, float d, vec2 cid, float px) {
  T t = prazno();
  t.snov = S_CITO; t.tip = C_PRAZIVAL; t.meja = -d; t.cc = c; t.jc = c; t.cid = cid;
  t.dye = vec3(0.0, 0.14 + 0.1 * sumL(p, 1.2, px) + 0.45 * crta(d, 0.7, px), 0.0);
  if (d > -3.0) t.dye.y *= 0.6;                     // svetla ektoplazma
  return t;
}
bool copatkar(inout T t, vec2 p, vec2 c, float ka, float px) {
  vec2 z = rot(ka) * (p - c);
  float d = sdElipsa(vec2(z.x, z.y * (1.0 + 0.22 * z.x / 110.0)), vec2(110.0, 34.0));
  d = max(d, -sdElipsa(z - vec2(-5.0, -36.0), vec2(38.0, 9.0)));
  if (d > 9.0) return false;
  if (d > 0.0) {
    float a = atan(z.y / 34.0, z.x / 110.0) * 72.0 * 2.0;
    float cil = crta((fract(a / 1.5) - 0.5) * 1.5, 0.12, px) * (1.0 - smoothstep(5.0, 9.0, d));
    t.dye.y += 0.25 * cil;
    return false;
  }
  t = protist(p, c, d, vec2(ka, 1.0), px);
  float dm = sdElipsa(z - vec2(5.0, 3.0), vec2(22.0, 12.0));
  if (dm < 0.0) { t.snov = S_JEDRO; t.jedro = dm; t.jc = c + transpose(rot(ka)) * vec2(5.0, 3.0); t.dye.y = 0.3 + 0.1 * sumL(z, 1.0, px); }
  float dmi = length(z - vec2(26.0, 11.0)) - 3.0;
  if (dmi < 0.0) t.dye.y = 0.5;
  for (int i = 0; i < 2; i++) {
    vec2 vz = z - vec2(i == 0 ? -72.0 : 70.0, 9.0);
    float rv = length(vz);
    float ka2 = abs(fract(atan(vz.y, vz.x) * 6.0 / 6.2832) - 0.5) * 6.2832 / 6.0 * rv;
    if (rv < 6.5) { t.snov = S_VAKUOLA; t.dye = vec3(0.0, 0.03 + 0.25 * crta(rv - 6.5, 0.4, px), 0.0); }
    else if (rv < 20.0 && ka2 < 1.0) t.dye.y = 0.02;
  }
  vec4 f = krogci(z, 17.0, 3.0, 5.5, 0.45, 101.0);
  if (f.x < 0.0 && d < -8.0 && dm > 0.0) { t.dye = vec3(0.3, 0.2 + 0.15 * sumL(z, 0.8, px), 0.0); t.snov = S_VAKUOLA; t.meja = -f.x; }
  return true;
}
bool evglena(inout T t, vec2 p, vec2 c, float ka, float px) {
  vec2 z = rot(ka) * (p - c);
  float tap = 1.0 - 0.45 * clamp(z.x / 24.0, -0.4, 1.0);
  float d = sdKapsula(vec2(z.x, z.y / tap), 19.0, 5.5) * tap;
  // biček
  float fx = -z.x - 23.0;
  if (d > 0.0) {
    if (fx > 0.0 && fx < 45.0) { float fl = abs(z.y - 4.0 * sin(fx / 7.0) * smoothstep(0.0, 10.0, fx)); t.dye.y += 0.3 * crta(fl, 0.25, px); }
    return false;
  }
  t = protist(p, c, d, vec2(ka, 2.0), px);
  float dj = length(z - vec2(3.0, 0.0)) - 3.6;
  if (dj < 0.0) { t.snov = S_JEDRO; t.jedro = dj; t.jc = c + transpose(rot(ka)) * vec2(3.0, 0.0); t.dye.y = 0.28; return true; }
  float pega = length(z - vec2(-16.0, 2.2)) - 1.6;
  if (pega < px) { t.dye.z += 1.3 * pokrij(pega, px); return true; }
  vec4 kk = krogci(z, 3.0, 1.0, 1.0, 0.85, 103.0);
  if (d < -0.8) kloroplastL(t, p, c + transpose(rot(ka)) * kk.yz, transpose(rot(ka)) * normalize(vec2(1.0, kk.w - 0.5)), 1.3, px);
  return true;
}
bool ameba(inout T t, vec2 p, vec2 c, float px) {
  vec2 z = p - c;
  float a = atan(z.y, z.x);
  float rr = 55.0 + 75.0 * max(0.0, fbm(vec2(cos(a), sin(a)) * 1.7 + 3.0, 3) - 0.35);
  float d = (length(z) - rr) * 0.8;
  if (d > 0.0) return false;
  t = protist(p, c, d, vec2(7.0, 3.0), px);
  if (d > -4.0) t.dye.y = 0.03;
  float dj = length(z - vec2(8.0, -6.0)) - 10.0;
  if (dj < 0.0) { t.snov = S_JEDRO; t.jedro = dj; t.jc = c + vec2(8.0, -6.0); t.dye.y = 0.22 + 0.08 * sumL(z, 1.0, px); }
  float dv = length(z - vec2(-25.0, 20.0)) - 8.0;
  if (dv < 0.0) { t.snov = S_VAKUOLA; t.dye.y = 0.02 + 0.25 * crta(dv, 0.4, px); }
  vec4 f = krogci(z, 22.0, 3.0, 6.0, 0.4, 107.0);
  if (f.x < 0.0 && d < -6.0 && dj > 0.0) { t.dye = vec3(0.2, 0.2, 0.02); t.snov = S_VAKUOLA; }
  return true;
}
bool uvijacka(inout T t, vec2 p, float px) {
  vec2 dir = normalize(vec2(1.0, -0.35));
  vec2 l = p - vec2(0.0, -470.0);
  float a = dot(l, dir), b = dot(l, vec2(-dir.y, dir.x));
  if (abs(b) > 22.0) return false; // nit ~44 µm, celice ~72 µm dolge
  float ci = floor(a / 72.0);
  float la = (fract(a / 72.0) - 0.5) * 72.0;
  t = prazno(); t.tip = C_SPLOSNA; t.cid = vec2(ci, 5.0); t.cc = p - dir * la - vec2(-dir.y, dir.x) * b; t.jc = t.cc;
  float dw = min(22.0 - abs(b), 36.0 - abs(la));
  if (dw < 1.0) { t.snov = S_STENA; t.smer = abs(b) > 21.0 ? dir : vec2(-dir.y, dir.x); t.r1 = dw; t.dye = vec3(0.04, 0.45, 0.0); return true; }
  t.snov = S_VAKUOLA; t.meja = dw - 1.0; t.dye = vec3(0.07, 0.05, 0.0); // tanka plast citoplazme ob steni je rahlo zelena
  float rc = 19.0;
  float th = acos(clamp(b / rc, -1.0, 1.0));
  float pitch = 48.0;
  float s1 = abs(fract((a - pitch * th / 6.2832) / pitch + 0.5) - 0.5) * pitch;
  float s2 = abs(fract((a + pitch * th / 6.2832) / pitch + 0.5) - 0.5) * pitch;
  float rib = max(pokrij(s1 - 5.0, px), 0.45 * pokrij(s2 - 5.0, px)) * step(abs(b), rc + 1.5); // trak kloroplasta ~10 µm
  if (rib > 0.0) {
    t.dye.x = mix(t.dye.x, 0.9, rib);
    float pir = pokrij(length(vec2((fract(a / 9.0) - 0.5) * 9.0, s1)) - 1.6, px);
    t.dye.y += 0.35 * pir * step(s1, 5.0);
    if (rib > 0.5) { t.snov = S_KLOROPLAST; t.jc = p; t.smer = normalize(dir + vec2(-dir.y, dir.x) * 0.6); t.r1 = 3.0; t.meja = 1e3; }
  }
  float dj = sdElipsa(vec2(la, b), vec2(5.0, 3.5));
  if (dj < 0.0) { t.snov = S_JEDRO; t.jedro = dj; t.dye.y = 0.25; t.jc = t.cc; }
  return true;
}
T tkivo(vec2 p, float px) {
  T t = voda(p, px);
  if (odsek(p, vec2(1200.0, 800.0), 63.0) > 0.0) return prazno();
  if (copatkar(t, p, vec2(-60.0, 60.0), 0.35, px)) return t;
  if (copatkar(t, p, vec2(-720.0, 380.0), -2.4, px)) return t;
  if (evglena(t, p, vec2(260.0, 170.0), 2.6, px)) return t;
  if (evglena(t, p, vec2(330.0, 240.0), 0.4, px)) return t;
  if (evglena(t, p, vec2(-380.0, -180.0), 1.3, px)) return t;
  if (ameba(t, p, vec2(560.0, -150.0), px)) return t;
  if (uvijacka(t, p, px)) return t;
  return t;
}`,
};

// ---------- virusi: s svetlobnim mikroskopom jih ne vidiš (premajhni), pri TEM pa ----------
// SARS-CoV-2: premer ~90 nm, bodice 20 nm (Ke in sod., Nature 588, 2020). HIV: ~110 nm, stožčasto jedro (Briggs in
// Kräusslich, J. Mol. Biol. 410, 2011). Bakteriofag T4: glava 86 × 115 nm, rep 100 nm (Leiman in sod., 2010).
const VIRUS_TEM = /* glsl */ `
#define IMA_TEM_POSEBNO
#define V_SARS 1.0
#define V_HIV 2.0
#define V_T4 3.0
void temPosebno(inout U u, T t, vec2 p, float px) {
  if (t.snov != S_VIRUS) { temMikrob(u, t, p, px); return; }
  vec2 z = p - t.jc;
  float rho = length(z);
  if (t.r1 == V_SARS) {
    float rnp = smoothstep(0.55, 0.7, sumL(z / 0.012 + t.cid, 1.0, 0.0));
    u.g = rho < 0.043 ? 0.35 + 0.45 * rnp : 0.05;
    u.g = mix(u.g, 0.85, membrana(rho - 0.045, px));
    float a = atan(z.y, z.x) * 0.055;
    float lok = abs(fract(a / 0.024 + t.cid.x) - 0.5) * 0.024;
    float steb = step(0.045, rho) * step(rho, 0.06) * pokrij(lok - 0.003, px);
    float glava = pokrij(length(vec2(lok, rho - 0.063)) - 0.007, px);
    u.g = max(u.g, 0.6 * max(steb, glava));
    // za sloj molekul: ovojnica je meja, v njej RNK z beljakovino N, zunaj (tudi med bodicami) gojišče
    u.meja = abs(rho - 0.045);
    u.snov = rho < 0.045 ? S_GENOM : S_VAKUOLA;
  } else if (t.r1 == V_HIV) {
    u.g = 0.15;
    u.g = mix(u.g, 0.85, membrana(rho - 0.055, px));
    float a = atan(z.y, z.x);
    float env = pokrij(length(vec2(abs(fract(a * 1.6 + t.cid.x) - 0.5) * 0.055 * 3.9, rho - 0.062)) - 0.006, px) * step(0.6, h12(vec2(floor(a * 1.6 + t.cid.x), t.cid.y)));
    u.g = max(u.g, 0.55 * env);
    if (t.meja > 1.5) {
      u.g = mix(u.g, 0.7, crta(rho - 0.045, 0.006, px));               // nezrel virus: plašč beljakovine Gag
      u.meja = abs(rho - 0.055);
      u.snov = rho < 0.055 ? S_VIRUS : S_VAKUOLA;
    } else {
      vec2 q = rot(t.cid.x * 6.2832) * z;
      float w = mix(0.012, 0.03, clamp((q.x + 0.04) / 0.08, 0.0, 1.0));
      float jedro = max(abs(q.y) - w, abs(q.x) - 0.042);
      u.g = mix(u.g, 0.45 + 0.2 * sumL(q, 0.008, px), pokrij(jedro, px));
      u.g = mix(u.g, 0.85, crta(jedro, 0.002, px));
      // za sloj molekul: meji sta ovojnica in stena stožčastega jedra (p24); v jedru RNK
      u.meja = min(abs(rho - 0.055), abs(jedro));
      u.snov = rho > 0.055 ? S_VAKUOLA : jedro < 0.0 ? S_GENOM : S_VIRUS;
    }
  } else {
    // T4: r1 = 3,0 glava z DNK, 3,1 rep, 3,2 vlakna; t.meja je razdalja do roba dela (µm)
    float del = floor((t.r1 - V_T4) * 10.0 + 0.5);
    u.g = del < 0.5 ? 0.85 : (del < 1.5 ? 0.7 : 0.55);
    u.meja = t.meja;
    u.snov = del < 0.5 ? S_GENOM : S_VIRUS;
  }
}
`;

function virusGlsl(vrsta) {
  return (
    MIKROB_TEM.replace("#define IMA_TEM_POSEBNO", "").replace("void temPosebno(", "void temMikrob(") +
    VIRUS_TEM +
    /* glsl */ `
// Virion na mreži g (µm) z verjetnostjo pr; vrne true in napolni t, če p leži v njem (s svetlobo neviden).
bool virion(inout T t, vec2 p, float g, float pr, float px) {
  vec4 k = krogci(p, g, 0.0, 0.0, pr, 113.0);
  float R = ${vrsta === "sars" ? "0.068" : "0.064"};
  if (k.x > R) return false;
  t.snov = S_VIRUS; t.jc = k.yz; t.cc = k.yz; t.cid = vec2(fract(k.w * 3.1), k.w); t.tip = C_SPLOSNA;
  t.r1 = ${vrsta === "sars" ? "V_SARS" : "V_HIV"}; t.meja = fract(k.w * 7.0) < 0.3 ? 2.0 : 1.0; t.jedro = 1e3;
  t.dye = vec3(0.0);
  return true;
}
T tkivo(vec2 p, float px) {
  T t = prazno();
  if (odsek(p, vec2(400.0, 300.0), 67.0) > 0.0) return t;
  ${
    vrsta === "t4"
      ? `
  // E. coli z bakteriofagi T4 na površini
  vec2 n = floor(p / 5.0);
  float best = sdKapsula(p, 0.9, 0.42); vec2 bc = vec2(0.0), bid = vec2(0.5); vec2 bz = p; float bL = 0.9;   // bakterija v središču
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 kk = n + vec2(i, j);
    vec4 h = h42(kk + 131.0);
    if (h.z > 0.6) continue;
    vec2 c = (kk + 0.5 + 0.5 * (h.xy - 0.5)) * 5.0;
    vec2 z = rot(h.w * 6.2832) * (p - c);
    float L = 0.7 + 0.4 * h.x;
    float d = sdKapsula(z, L, 0.42);
    if (d < best) { best = d; bc = c; bid = kk; bz = z; bL = L; }
  }
  if (best < 0.0) {
    T b = mikrob(best, 0.022, bc, bid, C_BAKTERIJA, 2.0);
    b.dye = vec3(0.0, 1.0, 0.0);
    return b;
  }
  float s, dd = best;
  if (abs(bz.x) <= bL) s = bz.y > 0.0 ? bz.x : 2.0 * bL + 3.14159 * 0.42 - bz.x;
  else { float a = atan(bz.y, abs(bz.x) - bL); s = bz.x > 0.0 ? bL + (1.5708 - a) * 0.42 : -bL - (1.5708 - a) * 0.42; }
  vec2 l = vec2((fract(s / 0.2) - 0.5) * 0.2, dd);
  float ki = floor(s / 0.2);
  bool fag = h12(vec2(ki, bid.x + bid.y * 7.0)) < 0.55 && dd < 0.3;
  if (!fag) {
    // prosti fagi
    vec4 f = krogci(p, 0.6, 0.0, 0.0, 0.2, 137.0);
    vec2 fz = rot(f.w * 6.2832) * (p - f.yz);
    l = vec2(fz.x, fz.y + 0.12);
    fag = length(p - f.yz) < 0.3;
  }
  if (fag) {
    float rep = max(abs(l.x) - 0.011, abs(l.y - 0.055) - 0.05);
    float plosca = max(abs(l.x) - 0.022, abs(l.y - 0.006) - 0.006);
    vec2 hq = vec2(abs(l.x), l.y - 0.163);
    float glava = max(hq.x - 0.043, abs(hq.y) + hq.x * 0.55 - 0.0575);
    vec2 fx = vec2(abs(l.x), l.y);
    float vl = min(length(fx - vec2(0.02, 0.008) - clamp(dot(fx - vec2(0.02, 0.008), vec2(0.05, 0.035)) / 0.003725, 0.0, 1.0) * vec2(0.05, 0.035)),
                   length(fx - vec2(0.07, 0.043) - clamp(dot(fx - vec2(0.07, 0.043), vec2(0.03, -0.043)) / 0.002749, 0.0, 1.0) * vec2(0.03, -0.043)));
    float dmin = min(min(rep, plosca), min(glava, vl - 0.002));
    if (dmin < 0.0) {
      t.snov = S_VIRUS; t.jc = p; t.cid = vec2(ki, 1.0); t.jedro = 1e3;
      float del = glava < 0.0 ? 0.0 : (min(rep, plosca) < 0.0 ? 1.0 : 2.0);
      t.r1 = V_T4 + 0.1 * del;                                         // 3,0 glava, 3,1 rep, 3,2 vlakna (molekule-vrste.js)
      t.meja = -(del < 0.5 ? glava : del < 1.5 ? min(rep, plosca) : vl - 0.002);
      return t;
    }
  }
  t.snov = S_VAKUOLA;
  return t;`
      : `
  // gojišče celic (${vrsta === "sars" ? "celice Vero, okužene s SARS-CoV-2" : "limfociti T, okuženi z virusom HIV"})
  ${
    vrsta === "sars"
      ? `Vor v = vor(p, 30.0, vec2(1.0), 0.0, 0.85);
  float g = 0.5 + 1.2 * sum(p / 9.0);
  vec2 cc = v.c; float rob = v.rob - g; float rj = 6.5;`
      : `vec4 k = krogci(p, 14.0, 3.6, 4.6, 0.8, 139.0);
  float d0 = length(p) - 4.2;
  if (d0 < k.x) k = vec4(d0, 0.0, 0.0, 0.5);                        // limfocit v središču
  vec2 cc = k.yz; float rob = -k.x; float rj = 2.9; Vor v; v.id = vec2(k.w, 1.0); v.c = k.yz; v.rob = rob;`
  }
  if (rob < 0.0) {
    T w = prazno(); w.snov = S_PLAZMA; w.dye = vec3(0.0, 0.02, 0.0);
    float pr = ${vrsta === "sars" ? "0.35" : "0.3"} * max(smoothstep(0.45, 0.65, sum(p / 3.0)) * smoothstep(-1.5, 0.0, rob), smoothstep(-0.35, -0.1, rob));
    virion(w, p, 0.3, pr, px);
    return w;
  }
  t.snov = S_CITO; t.tip = ${vrsta === "sars" ? "C_FIBROBLAST" : "C_LIMFOCIT"}; t.meja = rob; t.cc = cc; t.cid = v.id;
  t.dye = vec3(0.06, ${vrsta === "sars" ? "0.42" : "0.25"} + 0.05 * sumL(p, 2.0, px), 0.0);
  jedroV(t, p, vec2(0.6, -0.4), vec2(rj, rj * 0.85), 0.0, 0.85, px);
  if (rob < 0.08 && t.snov == S_CITO) virion(t, p, 0.3, ${vrsta === "sars" ? "0.25" : "0.4"}, px);      // virusi na membrani in v brstenju
  if (t.snov == S_CITO && t.jedro > 0.5) {
    vec4 m = krogci(p, 0.9, 0.18, 0.28, 0.2, 141.0);                  // mešički z virusi
    if (m.x < 0.0) { T w = t; w.snov = S_VAKUOLA; w.meja = -m.x; if (!virion(w, p, 0.16, 0.6, px)) w.snov = S_VAKUOLA; return w; }
  }
  return t;`
  }
}`
  );
}

export const virusSars = {
  id: "virus-sars",
  ime: "Virus SARS-CoV-2 v celicah",
  opis: "Celice, okužene z novim koronavirusom. Premer virusa je okoli 90 nanometrov, zato ga s svetlobnim mikroskopom ne vidiš, tudi z najboljšim objektivom ne. S presevnim elektronskim mikroskopom (TEM) vidiš virusne delce z venčkom bodic na celični membrani in v mešičkih v celici.",
  barvanje: "he",
  velikost: [400, 300],
  zacetek: { m: 1000, sredisce: [0, 0] },
  sredisceBlizu: [0, 0],
  imena: { 2: "okužena celica" },
  snovi: { 17: "virus SARS-CoV-2", 14: "gojišče" },
  isci: "S svetlobo poglej celice, nato preklopi na TEM nad 50 000× in poišči viruse ob membrani in v mešičkih. Prepoznaš venček bodic?",
  glsl: virusGlsl("sars"),
};

export const virusHiv = {
  id: "virus-hiv",
  ime: "Virus HIV na limfocitih",
  opis: "Limfociti T, okuženi z virusom HIV. Virusi brstijo iz celične membrane. Zreli virusi imajo stožčasto kapsido, nezreli pa debel obroč beljakovin pod ovojnico. Premer okoli 110 nanometrov: viden samo s TEM.",
  barvanje: "giemsa",
  velikost: [400, 300],
  zacetek: { m: 1000, sredisce: [0, 0] },
  sredisceBlizu: [0, 4.25],
  imena: { 3: "limfocit T" },
  snovi: { 17: "virus HIV", 14: "gojišče" },
  isci: "Pri TEM nad 50 000× poišči zrele viruse s stožčasto kapsido in nezrele z obročem.",
  glsl: virusGlsl("hiv"),
};

export const virusT4 = {
  id: "virus-t4",
  ime: "Bakteriofag T4 na bakteriji E. coli",
  opis: "Bakteriofagi so virusi, ki okužijo bakterije. Fag T4 ima glavo z DNK, rep in repna vlakna, s katerimi se pritrdi na bakterijo. S svetlobo vidiš samo bakterije, fage šele s TEM.",
  barvanje: "gram",
  velikost: [400, 300],
  zacetek: { m: 1000, sredisce: [0, 0] },
  sredisceBlizu: [0, 0.55],
  imena: { 7: "bakterija E. coli" },
  snovi: { 17: "bakteriofag T4", 11: "celična stena bakterije" },
  isci: "Pri TEM nad 100 000× poišči fage, pritrjene na bakterijo z repom navzdol.",
  glsl: virusGlsl("t4"),
};
