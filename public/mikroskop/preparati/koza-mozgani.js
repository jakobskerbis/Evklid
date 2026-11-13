// Preparati: koža z dlako (HE), možganska skorja (siva možganovina), bela možganovina, mali možgani.
// Mere (Ross in Pawlina): tanka koža – povrhnjica 75–150 µm; skorja velikih možganov 2–4 mm, piramidne celice
// 10–50 µm (Betzove do 100 µm); Purkinjeve celice 50–80 µm; zrnate celice 5–8 µm.

export const koza = {
  id: "koza",
  ime: "Koža",
  opis: "Prerez kože: zgoraj večskladni poroženevajoči ploščati epitelij (povrhnjica), pod njim usnjica iz veziva z lasnim mešičkom, lojnico in znojnicami, spodaj podkožje z maščevjem.",
  barvanje: "he",
  velikost: [2600, 1600],
  zacetek: { m: 40, sredisce: [0, 300] },
  sredisceBlizu: [200, 1100],
  imena: { 9: "keratinocit", 2: "fibroblast", 14: "adipocit", 5: "celica lojnice" },
  snovi: { 10: "keratin (poroženela plast)", 3: "kolagenska vlakna usnjice", 6: "maščoba" },
  isci: "Poišči plasti povrhnjice: temne bazalne celice, ploščate celice proti površini in poroženelo plast brez jeder. Poišči dlako v lasnem mešičku.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  float rob = odsek(p, vec2(2600.0, 1600.0), 16.0);
  float ys = 1180.0 + 25.0 * sin(p.x / 260.0) + 10.0 * (sum(vec2(p.x / 90.0, 2.0)) - 0.5);
  if (rob > 0.0 || p.y > ys) return prazno();
  float d = ys - p.y;
  float H = 70.0 + 30.0 * pow(0.5 + 0.5 * sin(p.x / 38.0 + 2.0 * sum(vec2(p.x / 200.0, 1.0))), 2.0);
  // dlaka: poševen valj od površine v globino
  float x0 = floor((p.x + 0.45 * d) / 900.0);
  float dx = p.x + 0.45 * d - (x0 + 0.5) * 900.0;
  vec4 hd = h42(vec2(x0, 5.0));
  float los = 1050.0 + 150.0 * hd.x;
  if (d < los && abs(dx) < 70.0 && hd.y < 0.85) {
    T t = prazno();
    float ad = abs(dx);
    float bulb = smoothstep(los - 140.0, los, d);
    float rlas = 16.0 + 12.0 * bulb;
    if (ad < rlas * 0.55) {
      t.snov = S_KERATIN; t.smer = normalize(vec2(-0.45, 1.0));
      t.dye = vec3(0.15, 0.35, 0.9 + 0.3 * sumL(vec2(dx, d), 3.0, px));
      return t;
    }
    if (ad < rlas) { t.snov = S_KERATIN; t.dye = vec3(0.1, 0.62, 0.15); return t; }
    if (ad < 62.0) {
      T e = vecskladni(62.0 - ad, d, 46.0 - 10.0 * bulb, 0.0, vec2(x0 * 7.0, 3.0), px);
      return vSvet(e, p, vec2(0.0, -1.0), vec2(-sign(dx), 0.0));
    }
    T t2 = prazno(); t2.snov = S_KOLAGEN; t2.dye = vec3(0.05, 0.5, 0.0); return t2;
  }
  // lojnica ob mešičku
  vec2 lz = vec2(dx + 120.0, d - 380.0 - 60.0 * hd.z);
  float ls = sdElipsa(lz, vec2(60.0, 85.0)) + 10.0 * (sum(lz / 30.0) - 0.5);
  if (ls < 0.0 && hd.y < 0.85) {
    Vor v = vor(lz, 13.0, vec2(1.0), 0.0, 0.8);
    vec4 h = h42(v.id);
    T t = prazno();
    t.snov = S_CITO; t.tip = C_ZLEZNA; t.meja = v.rob; t.cc = p - (lz - v.c); t.jc = t.cc; t.cid = v.id;
    float pena = smoothstep(0.45, 0.6, sumL(lz, 1.5, px));
    t.dye = vec3(0.08, 0.2 + 0.15 * pena + 0.25 * crta(v.rob, 0.35, px), 0.0);
    float dj = length(lz - v.c) - 2.8;
    t.dye.x = mix(t.dye.x, 0.9 * kromatin(lz - v.c, h.zw, px), pokrij(dj, px));
    t.jedro = dj;
    if (dj < 0.0) t.snov = S_JEDRO;
    return t;
  }
  if (d < H) {
    T e = vecskladni(d, p.x, H, 1.0, vec2(0.0, 0.0), px);
    e.dye.z += 0.35 * smoothstep(0.8, 1.0, d / H);    // melanin v bazalnih celicah
    e = vSvet(e, p, vec2(1.0, 0.0), vec2(0.0, -1.0));
    return e;
  }
  float g = d - H;
  T t = prazno();
  if (g < 1500.0) {
    // usnjica: papilarna (rahla) in retikularna (gosta) plast
    float rahlo = 1.0 - smoothstep(60.0, 140.0, g);
    t.snov = S_KOLAGEN; t.smer = normalize(vec2(sum(p / 80.0) - 0.5, sum(p / 80.0 + 4.0) - 0.5) + 1e-3);
    // retikularna usnjica: debeli valoviti snopi kolagena v različnih smereh, med njimi svetle reže (skrčki ob
    // pripravi); papilarna plast je rahla iz tankih vlaken
    vec2 kg = kolagen(p, normalize(vec2(1.0, 0.35 * (sum(p / 500.0) - 0.5))), mix(22.0, 6.0, rahlo), 0.47, rahlo * 0.8, 3.0, px);
    t.dye = vec3(0.04, mix(kg.x, 0.26 * (1.0 - 0.6 * kg.y), rahlo), 0.0);
    if (kg.y > 0.6) t.snov = S_PRAZNO;
    vec4 f = krogci(p, 30.0, 1.0, 1.0, 0.25 + 0.55 * rahlo, 19.0);
    vec2 q = p - f.yz;
    float dj = sdElipsa(rot(f.w) * q, vec2(4.0, 1.1));
    if (dj < px) { t.dye.x += 0.9 * pokrij(dj, px); if (dj < 0.0) { t.snov = S_JEDRO; t.tip = C_FIBROBLAST; t.jedro = dj; t.jc = f.yz; t.cc = f.yz; t.cid = vec2(f.w, 1.0); } }
    // znojnice: klopčič cevk v globoki usnjici
    if (g > 900.0) {
      vec2 c0 = vec2(floor(p.x / 600.0) * 600.0 + 300.0, ys - H - 1250.0);
      if (length(p - c0) < 150.0) {
        vec4 k = krogci(p, 34.0, 13.0, 16.0, 0.9, 23.0);
        if (k.x < 0.0) {
          vec2 kq = p - k.yz;
          float r0 = length(kq);
          float Rt = r0 - k.x;
          T c = cevka(kq, 4.0, Rt, 7.0, 0.55, C_ZLEZNA, vec2(k.w), p, px);
          return c;
        }
      }
    }
    vec4 z2 = krogci(p, 260.0, 7.0, 16.0, 0.55, 29.0);
    zila(t, p - z2.yz, length(p - z2.yz) - z2.x, 3.0, vec2(z2.w), px);
    return t;
  }
  // podkožje: maščevje
  Vor v = vor(p, 80.0, vec2(1.0), 0.0, 0.8);
  t.snov = S_LIPID; t.tip = C_ADIPOCIT; t.meja = v.rob; t.cc = v.c; t.cid = v.id;
  t.dye = vec3(0.0, 0.5 * crta(v.rob, 0.7, px), 0.0);
  return t;
}`,
};

export const skorja = {
  id: "skorja",
  ime: "Možganska skorja",
  opis: "Siva možganovina velikih možganov. V rožnatem nevropilu (gost splet živčnih izrastkov) so telesa nevronov s svetlim jedrom in jedrcem, največja so piramidne celice; drobna temna jedra pripadajo celicam glije.",
  barvanje: "he",
  velikost: [2600, 1700],
  zacetek: { m: 100, sredisce: [0, 900] },
  sredisceBlizu: [0, 300],
  imena: { 4: "nevron (piramidna celica)", 10: "celica glije", 17: "nevropil (aksoni, dendriti, sinapse)" },
  snovi: { 3: "mehka možganska ovojnica (vezivo)" },
  isci: "Pri 400× poišči piramidno celico z dendritom proti površini. Pri TEM nad 20 000× poišči sinapse z mehurčki.",
  glsl: /* glsl */ `
T nevropil(vec2 p, float px) {
  T t = prazno();
  t.snov = S_CITO; t.tip = C_NEVRIT;
  Vor v = vor(p, 1.3, vec2(1.0), 0.0, 0.9);
  t.meja = v.rob; t.cc = v.c; t.jc = v.c; t.cid = v.id;
  float vid = 1.0 - smoothstep(0.4, 1.2, px);
  t.dye = vec3(0.07, 0.38 + 0.06 * mix(0.5, sumL(p, 1.2, px), vid) + 0.04 * (sumL(p, 50.0, px) - 0.5), 0.0);
  return t;
}
T tkivo(vec2 p, float px) {
  float rob = odsek(p, vec2(2600.0, 1700.0), 17.0);
  float ys = 1500.0 + 40.0 * sin(p.x / 400.0);
  if (rob > 0.0 || p.y > ys) return prazno();
  float d = ys - p.y;
  T t = nevropil(p, px);
  if (d < 6.0) { t.snov = S_KOLAGEN; t.dye = vec3(0.1, 0.5, 0.0); return t; }   // mehka možganska ovojnica
  float gn = d < 220.0 ? 0.25 : 0.8;
  // glija: drobna temna jedra
  vec4 g = krogci(p, 22.0, 2.3, 3.2, gn, 3.0);
  if (g.x < px) {
    float k = pokrij(g.x, px);
    t.dye.x = mix(t.dye.x, 1.15 * kromatin(p - g.yz, vec2(g.w), px), k);
    if (g.x < 0.0) { t.snov = S_JEDRO; t.tip = C_GLIJA; t.jedro = g.x; t.jc = g.yz; t.cc = g.yz; t.cid = vec2(g.w, 3.0); t.meja = 1.5 - g.x; }
    return t;
  }
  // nevroni: velikost po plasteh (II–III manjše, V velike piramidne)
  float vel = d < 220.0 ? 0.0 : d < 900.0 ? 0.7 : d < 1150.0 ? 0.5 : 1.0;
  vec4 n = krogci(p, 55.0, 1.0, 1.0, d < 220.0 ? 0.05 : 0.55, 7.0);
  vec4 h = h42(vec2(n.w, 1.0));
  // piramidne celice niso enake: rahlo nagnjene, nepravilnega obrisa, z zvitim vršnim in kratkimi bazalnimi dendriti
  vec2 q = rot(0.45 * (h.y - 0.5)) * (p - n.yz);
  float R = mix(7.0, 15.0, vel) * (0.75 + 0.5 * h.x);
  vec2 z = q / R;
  float tri = max(abs(z.x) * (0.85 + 0.25 * h.z) + z.y * 0.55 - 0.65, -z.y - 0.7 - 0.15 * (h.w - 0.5));
  float sd = tri * R * 0.8 + 0.12 * R * (sum(q / (0.5 * R) + h.zw * 9.0) - 0.5);
  float L = (3.0 + 4.0 * h.w) * R;
  float dx = q.x + 0.06 * q.y + 0.25 * R * sin(q.y / (1.7 * R) + 6.28 * h.z) * smoothstep(0.0, 2.0 * R, q.y);
  float den = max(abs(dx) - mix(0.22 * R, 0.35, clamp(q.y / L, 0.0, 1.0)), max(-q.y, q.y - L));
  for (int b = -1; b <= 1; b += 2) {
    vec2 bq = rot(float(b) * (0.9 + 0.4 * h.x)) * (q - vec2(float(b) * 0.55 * R, -0.65 * R));
    den = min(den, max(abs(bq.x) - mix(0.15 * R, 0.3, clamp(-bq.y / (1.6 * R), 0.0, 1.0)), max(bq.y, -bq.y - 1.6 * R)));
  }
  sd = min(sd, den);
  // skrčitveni svetel rob okoli telesa (pogost artefakt fiksacije)
  float hal = (h.y > 0.35 && tri < 0.2) ? smoothstep(0.5 + 1.0 * h.x, 0.0, sd) * step(0.0, sd) : 0.0;
  if (hal > 0.0) { t.dye.y *= 1.0 - 0.6 * hal; t.dye.x *= 1.0 - 0.5 * hal; if (hal > 0.7) t.snov = S_PRAZNO; }
  if (sd < px) {
    float k = pokrij(sd, px);
    T c = prazno();
    c.snov = S_CITO; c.tip = C_NEVRON; c.meja = -sd; c.cc = n.yz; c.jc = n.yz - vec2(0.0, 0.1 * R); c.cid = vec2(n.w, 7.0);
    float nissl = smoothstep(0.45, 0.7, sumL(q, 1.0, px));
    c.dye = vec3(0.32 + 0.35 * nissl, 0.42, 0.0);
    vec2 jq = q + vec2(0.0, 0.1 * R);
    float dj = length(jq) - 0.42 * R;
    c.jedro = dj;
    float jk = pokrij(dj, px);
    c.dye = mix(c.dye, vec3(0.18 + 0.15 * sumL(jq, 0.8, px), 0.15, 0.0), jk);
    float jdc = length(jq - vec2(0.12 * R, 0.05 * R)) - 0.11 * R;
    c.dye.x += 1.1 * pokrij(jdc, px) * jk;
    if (jk > 0.5) c.snov = S_JEDRO;
    t.dye = mix(t.dye, c.dye, k);
    if (k > 0.5) return c;
  }
  vec4 z2 = krogci(p, 150.0, 3.0, 5.0, 0.6, 31.0);
  zila(t, p - z2.yz, length(p - z2.yz) - z2.x, 1.5, vec2(z2.w), px);
  return t;
}`,
};

export const bela = {
  id: "bela-snov",
  ime: "Bela možganovina",
  opis: "Bela možganovina je iz mieliniziranih aksonov, ki povezujejo dele možganov. Pri barvanju HE je bledo rožnata, jedra oligodendrocitov (ti izdelujejo mielin) pa so v vrstah med vlakni.",
  barvanje: "he",
  velikost: [2600, 1700],
  zacetek: { m: 100, sredisce: [0, 0] },
  imena: { 10: "oligodendrocit", 4: "akson" },
  snovi: { 8: "mielinska ovojnica" },
  isci: "Opazuj vrste temnih jeder oligodendrocitov s svetlim robom. Pri TEM poišči akson in plasti mielina okoli njega.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  float rob = odsek(p, vec2(2600.0, 1700.0), 18.0);
  if (rob > 0.0) return prazno();
  T t = prazno();
  float kot = 0.3 + 0.4 * (sum(p / 900.0) - 0.5);
  vec2 sm = vec2(cos(kot), sin(kot));
  vec2 z = rot(-kot) * p;
  float vid = 1.0 - smoothstep(0.4, 1.2, px);
  // aksoni: tanke cevke vzdolž; v TEM prečni preseki
  Vor a = vor(z, 2.2, vec2(1.0, 1.0), 0.0, 0.85);
  vec4 h = h42(a.id);
  float R = 0.45 + 0.5 * h.x;
  vec2 lz = z - a.c;
  float r = length(lz), ra = 0.65 * R;
  t.snov = S_CITO; t.tip = C_GLIJA; t.meja = a.rob; t.cc = a.c; t.cid = a.id;
  if (r < R && h.y < 0.85) {
    if (r < ra) { t.tip = C_NEVRON; t.meja = ra - r; t.cc = p - (z - a.c); t.jedro = 1e3; }
    else { t.snov = S_MIELIN; t.r1 = r - ra; }
  }
  float vl = 0.5 + 0.5 * sin(z.y * 2.5 + 2.0 * sum(z / vec2(40.0, 6.0)));
  t.dye = vec3(0.05, 0.3 + 0.08 * mix(0.5, vl, vid), 0.0);
  t.dye.y *= 1.0 - 0.5 * smoothstep(0.66, 0.72, sumL(z * vec2(0.3, 1.0), 4.0, px)) * vid;     // »vakuole« (izprani mielin)
  // vrste oligodendrocitov
  // vrste oligodendrocitov med snopi aksonov: valovite, prekinjene verige 3–10 jeder; vmes posamezni astrociti
  float zy = z.y + 10.0 * (sum(vec2(z.x / 90.0, 4.0)) - 0.5);
  float i = floor(zy / 26.0);
  vec2 oc = vec2(z.x, (i + 0.5) * 26.0);
  float j = floor(z.x / 10.0);
  vec4 g = h42(vec2(j, i));
  vec4 as = krogci(z, 45.0, 3.2, 4.0, 0.35, 12.0);
  if (as.x < px) {
    float k = pokrij(as.x, px);
    t.dye.x = mix(t.dye.x, 0.55 * kromatin(z - as.yz, vec2(as.w), px), k);
    if (as.x < 0.0) { t.snov = S_JEDRO; t.tip = C_GLIJA; t.jedro = as.x; t.cid = vec2(as.w, 12.0); t.meja = -as.x; }
    return t;
  }
  if (g.z < 0.75 * smoothstep(0.42, 0.5, sum(vec2(z.x / 70.0, i * 1.7)))) {
    vec2 q = vec2(z.x - (j + 0.5 + 0.3 * (g.w - 0.5)) * 10.0, zy - oc.y - 5.0 * (g.x - 0.5));
    float dj = length(q) - 2.6;
    float halo = length(q) - 4.6;
    t.dye.y *= 1.0 - 0.7 * pokrij(halo, px);
    if (dj < px) {
      float k = pokrij(dj, px);
      t.dye.x = mix(t.dye.x, 1.2 * kromatin(q, g.xy, px), k);
      if (dj < 0.0) { t.snov = S_JEDRO; t.tip = C_GLIJA; t.jedro = dj; t.jc = p - (z - (oc + q - q)); t.cc = t.jc; t.cid = vec2(j, i); t.meja = 1.5 - dj; }
    }
  }
  return t;
}`,
};

export const mali = {
  id: "mali-mozgani",
  ime: "Mali možgani",
  opis: "Prerez malih možganov: zunaj svetla molekularna plast, pod njo vrsta velikih Purkinjevih celic, nato gosta zrnata plast drobnih nevronov in v sredini bela možganovina.",
  barvanje: "he",
  velikost: [2600, 1700],
  zacetek: { m: 40, sredisce: [0, 0] },
  sredisceBlizu: [0, 360],
  imena: { 4: "nevron", 10: "celica glije", 17: "nevropil" },
  snovi: { 8: "mielinska ovojnica", 3: "mehka možganska ovojnica (vezivo)" },
  isci: "Poišči vrsto Purkinjevih celic med molekularno in zrnato plastjo.",
  glsl: /* glsl */ `
T tkivo(vec2 p, float px) {
  float rob = odsek(p, vec2(2600.0, 1700.0), 19.0);
  if (rob > 0.0) return prazno();
  // lističi (folije): globina od površine lističa
  float f = p.y + 260.0 * sin(p.x / 330.0 + 0.8 * (fbm(vec2(p.x / 900.0, 1.0), 2) - 0.5)) + 140.0 * (fbm(p / 600.0 + 2.0, 2) - 0.5);
  float per = 1300.0;
  float k = floor(f / per);
  float d = abs(f - (k + 0.5) * per);           // 0 = sredina (bela snov), 650 = površina
  d = 650.0 - d;                                 // globina od površine
  T t = prazno();
  float vid = 1.0 - smoothstep(0.4, 1.2, px);
  if (d < 8.0) { t.snov = S_KOLAGEN; t.dye = vec3(0.08, 0.45, 0.0); return t; }
  if (d > 290.0 && d < 400.0) {
    // Purkinjeve celice v eni vrsti na meji: telo v obliki bučke sega v obe sosednji plasti, debel dendrit proti površini
    float s = p.x;
    float i = floor(s / 60.0);
    vec4 h = h42(vec2(i, k));
    vec2 q = vec2(s - (i + 0.5) * 60.0 - 14.0 * (h.x - 0.5), d - 348.0 - 6.0 * (h.z - 0.5));
    if (h.y < 0.8) {
      float sd = sdElipsa(q, vec2(14.0 + 3.0 * h.w, 19.0)) + 1.5 * (sum(q / 6.0 + h.zw) - 0.5);
      float den = max(abs(q.x + 0.15 * q.y * (h.w - 0.5)) - mix(4.5, 1.0, clamp(-q.y / 55.0, 0.0, 1.0)), max(q.y + 10.0, -q.y - 55.0));
      sd = min(sd, den);
      if (sd < 0.0) {
        T c = prazno();
        c.snov = S_CITO; c.tip = C_NEVRON; c.meja = -sd; c.cc = p - q; c.jc = c.cc; c.cid = vec2(i, k);
        c.dye = vec3(0.3 + 0.3 * smoothstep(0.45, 0.7, sumL(q, 1.0, px)), 0.45, 0.0);
        float dj = length(q - vec2(0.0, 3.0)) - 7.0;
        c.jedro = dj;
        float jk = pokrij(dj, px);
        // mehurčasto (svetlo vijoličasto) jedro z izrazitim temnim jedrcem
        c.dye = mix(c.dye, vec3(0.32 + 0.1 * sumL(q, 0.8, px), 0.22, 0.0), jk);
        c.dye.x += 1.0 * pokrij(length(q - vec2(1.5, 4.0)) - 1.8, px) * jk;
        if (jk > 0.5) c.snov = S_JEDRO;
        return c;
      }
    }
  }
  if (d < 330.0) {
    // molekularna plast
    t.snov = S_CITO; t.tip = C_NEVRIT;
    Vor v = vor(p, 1.3, vec2(1.0), 0.0, 0.9);
    t.meja = v.rob; t.cc = v.c; t.cid = v.id;
    t.dye = vec3(0.06, 0.36 + 0.05 * mix(0.5, sumL(p, 1.2, px), vid), 0.0);
    vec4 g = krogci(p, 30.0, 2.2, 3.0, 0.5, 4.0);
    if (g.x < 0.0) { t.dye.x = 1.0; t.snov = S_JEDRO; t.tip = C_GLIJA; t.jedro = g.x; t.jc = g.yz; t.cc = g.yz; }
    return t;
  }
  if (d < 360.0) {
    // ozek pas med plastema (Bergmannova glija, košarice)
    t.snov = S_CITO; t.tip = C_NEVRIT; t.dye = vec3(0.08, 0.36, 0.0);
    vec4 g = krogci(p, 14.0, 2.4, 3.0, 0.5, 6.0);
    if (g.x < 0.0) { t.dye.x = 0.9; t.snov = S_JEDRO; t.tip = C_GLIJA; t.jedro = g.x; t.jc = g.yz; t.cc = g.yz; }
    return t;
  }
  if (d < 600.0) {
    // zrnata plast: gosta drobna jedra
    vec4 g = krogci(p, 6.6, 2.4, 2.9, 0.82, 9.0);
    t.snov = S_CITO; t.tip = C_NEVRIT;
    Vor v = vor(p, 1.3, vec2(1.0), 0.0, 0.9);
    t.meja = v.rob; t.cc = v.c; t.cid = v.id;
    t.dye = vec3(0.12, 0.3, 0.0);
    float otok = smoothstep(0.66, 0.72, sum(p / 25.0));      // »otočki« brez jeder
    if (g.x < px && otok < 0.5) {
      float kk = pokrij(g.x, px);
      t.dye.x = mix(t.dye.x, 1.3 * kromatin(p - g.yz, vec2(g.w), px), kk);
      if (g.x < 0.0) { t.snov = S_JEDRO; t.tip = C_NEVRON; t.jedro = g.x; t.jc = g.yz; t.cc = g.yz; t.cid = vec2(g.w, 9.0); t.meja = 1.2 - g.x; }
    }
    return t;
  }
  // bela snov v sredini lističa
  Vor a = vor(p, 2.2, vec2(1.0), 0.0, 0.85);
  vec4 h = h42(a.id);
  float R = 0.45 + 0.5 * h.x, r = length(p - a.c);
  t.snov = S_CITO; t.tip = C_GLIJA; t.meja = a.rob; t.cc = a.c; t.cid = a.id;
  if (r < R) { if (r < 0.65 * R) { t.tip = C_NEVRON; t.meja = 0.65 * R - r; } else { t.snov = S_MIELIN; t.r1 = r - 0.65 * R; } }
  t.dye = vec3(0.05, 0.32 + 0.05 * sumL(p, 3.0, px), 0.0);
  return t;
}`,
};
