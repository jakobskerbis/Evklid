// Sinteza beljakovin: transkripcija v jedru in translacija na ribosomu v enem prizoru, s predvajalnikom korakov (pogodba v docs/3d.md).
// Gen je kratek in izmišljen, a vsak kodon je preverjen s standardnim genskim kodom.

export const info = {
  id: "sinteza-beljakovin",
  naslov: "Sinteza beljakovin",
  podrocje: "procesi",
  predmet: "BIO",
  opis: "Od gena do beljakovine: v jedru RNA-polimeraza prepiše DNK v mRNA, v citoplazmi ribosom s pomočjo tRNA prevede mRNA v verigo aminokislin.",
  merilo: { m: 2e-8, oznaka: "≈ 20 nm" },
};

const PISAVA = '"Instrument Sans", system-ui, sans-serif';
const K_PX = (2 * Math.tan(Math.PI / 9)) / 800;

// Kodirajoča veriga 5'→3': promotor (5 bp), prepisani del (28 bp: 5' UTR 2, kodoni 24, 3' UTR 2), 1 bp za genom.
const KODIRAJOCA = "CTATACAATGGCTTGGAAAGACTTCGGCTAAGCA";
const PREP0 = 5, NNT = 28, NBP = KODIRAJOCA.length;
const KOMP = { A: "T", T: "A", G: "C", C: "G" };
const MATRICA = [...KODIRAJOCA].map((b) => KOMP[b]).join(""); // matrična veriga, poravnana (3'→5')
const MRNA = KODIRAJOCA.slice(PREP0, PREP0 + NNT).replace(/T/g, "U");
const UTR5 = 2;
const AK = [
  { k: "AUG", ac: "UAC", kr: "Met", ime: "metionin", toz: "metionin", barva: "#E9C46A" },
  { k: "GCU", ac: "CGA", kr: "Ala", ime: "alanin", toz: "alanin", barva: "#8CC084" },
  { k: "UGG", ac: "ACC", kr: "Trp", ime: "triptofan", toz: "triptofan", barva: "#E76F51" },
  { k: "AAA", ac: "UUU", kr: "Lys", ime: "lizin", toz: "lizin", barva: "#2EC4B6" },
  { k: "GAC", ac: "CUG", kr: "Asp", ime: "asparaginska kislina", toz: "asparaginsko kislino", barva: "#F48FB1" },
  { k: "UUC", ac: "AAG", kr: "Phe", ime: "fenilalanin", toz: "fenilalanin", barva: "#B388EB" },
  { k: "GGC", ac: "CCG", kr: "Gly", ime: "glicin", toz: "glicin", barva: "#5BC0EB" },
];
const STOP = "UAA";
const NK = AK.length; // 7 aminokislin, kodon 7 je stop
const BARVE = { A: "#5CCB8C", T: "#F07167", U: "#F5A25D", G: "#F2D35B", C: "#63A9F5" };
const KONEC = 12;
const TRAJANJE = [6, 10, 6, 7, 8, 7, 7, 7, 7, 7, 7, 8]; // sekund za vsak korak pri predvajanju

const ss = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const cl = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const lerp = (a, b, t) => a + (b - a) * t;

export function zgradi(THREE, ctx = {}) {
  const nizka = ctx.kakovost === "nizka";
  const gibanje = ctx.gibanje !== false;
  const zacetek = ctx.zacetek || {};
  const viri = new Set();
  const h = (x) => (viri.add(x), x);
  const group = new THREE.Group();
  group.name = "sinteza-beljakovin";
  const uVel = { value: 1 };

  // ---------- orodja ----------
  const fiz = (barva, o = {}) => h(new THREE.MeshPhysicalMaterial({
    color: barva, roughness: 0.42, metalness: 0, clearcoat: 0.55, clearcoatRoughness: 0.35,
    sheen: 0.45, sheenRoughness: 0.55, sheenColor: new THREE.Color(0xffffff), ...o,
  }));
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  // Položaj napisa iz koordinat na zaslonu pri privzetem pogledu kamere (azimut 35°, višina 20°): sx desno, sy gor, d proti kameri.
  const KAM_R = V(Math.cos(0.611), 0, -Math.sin(0.611));
  const KAM_N = V(Math.sin(0.611) * Math.cos(0.349), Math.sin(0.349), Math.cos(0.611) * Math.cos(0.349));
  const KAM_G = new THREE.Vector3().crossVectors(KAM_N, KAM_R);
  const zaslon = (sx, sy, d = 0.2) => new THREE.Vector3().addScaledVector(KAM_R, sx).addScaledVector(KAM_G, sy).addScaledVector(KAM_N, d).toArray();

  function zaobljen(g, x, y, w, hh, r) {
    g.beginPath();
    g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.arc(x + w - r, y + r, r, -Math.PI / 2, 0);
    g.lineTo(x + w, y + hh - r); g.arc(x + w - r, y + hh - r, r, 0, Math.PI / 2);
    g.lineTo(x + r, y + hh); g.arc(x + r, y + hh - r, r, Math.PI / 2, Math.PI);
    g.lineTo(x, y + r); g.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
    g.closePath();
  }
  function tekstura(c) {
    const t = h(new THREE.CanvasTexture(c));
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    return t;
  }
  // Napis: sprite stalne velikosti na zaslonu (sizeAttenuation: false), risan v 2× ločljivosti.
  function napis(besedilo, o = {}) {
    const px = o.px || 12, S = 2;
    const font = `${o.krepko ? 650 : 550} ${px * S}px ${PISAVA}`;
    const c = document.createElement("canvas");
    let g = c.getContext("2d");
    g.font = font;
    const w = Math.ceil(g.measureText(besedilo).width) + 2 * 8 * S;
    const hh = Math.round(px * 1.8 * S);
    c.width = w; c.height = hh;
    g = c.getContext("2d");
    g.font = font; g.textBaseline = "middle"; g.textAlign = "center";
    zaobljen(g, 1, 1, w - 2, hh - 2, (hh - 2) / 2);
    g.fillStyle = o.ozadje || "rgba(13,18,28,0.84)"; g.fill();
    g.lineWidth = 2; g.strokeStyle = o.rob || "rgba(154,166,191,0.35)"; g.stroke();
    g.fillStyle = o.barva || "#E8EDF7";
    g.fillText(besedilo, w / 2, hh / 2 + S);
    const m = h(new THREE.SpriteMaterial({ map: tekstura(c), transparent: true, depthTest: false, depthWrite: false, sizeAttenuation: false, toneMapped: false }));
    const s = new THREE.Sprite(m);
    s.renderOrder = 30;
    const vis = (hh / S) * K_PX;
    s.scale.set((vis * w) / hh, vis, 1);
    s.userData.osnova = [s.scale.x, s.scale.y];
    napisi.push(s);
    if (o.sredina) s.center.set(o.sredina[0], o.sredina[1]);
    return s;
  }
  // Značka molekule: zaobljena ploščica z napisom.
  function znacka(besedilo, barva, crnilo) {
    const S = 2, px = 15;
    const font = `700 ${px * S}px ${PISAVA}`;
    const c = document.createElement("canvas");
    let g = c.getContext("2d");
    g.font = font;
    const hh = Math.round(px * 1.6 * S);
    const w = Math.max(hh, Math.ceil(g.measureText(besedilo).width) + 2 * 7 * S);
    c.width = w; c.height = hh;
    g = c.getContext("2d");
    g.font = font; g.textBaseline = "middle"; g.textAlign = "center";
    zaobljen(g, 2, 2, w - 4, hh - 4, (hh - 4) / 2);
    const gr = g.createLinearGradient(0, 0, 0, hh);
    gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.12, barva); gr.addColorStop(1, barva);
    g.fillStyle = gr; g.fill();
    g.lineWidth = 2.5; g.strokeStyle = "rgba(8,12,20,0.55)"; g.stroke();
    g.fillStyle = crnilo || "#0B0F16";
    g.fillText(besedilo, w / 2, hh / 2 + S);
    return { tex: tekstura(c), razmerje: w / hh };
  }
  function znackaMat(tex, sij) {
    const m = h(new THREE.MeshBasicMaterial({
      map: tex, transparent: true, depthWrite: false, toneMapped: false,
      blending: sij ? THREE.AdditiveBlending : THREE.NormalBlending,
    }));
    m.onBeforeCompile = (s) => {
      s.uniforms.uVel = uVel;
      s.vertexShader = "uniform float uVel;\n" + s.vertexShader.replace("#include <project_vertex>", [
        "vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);",
        "float zVel = length(instanceMatrix[0].xyz) * uVel;",
        "mvPosition.xy += position.xy * zVel * (-mvPosition.z);",
        "mvPosition.z += 0.06;",
        "gl_Position = projectionMatrix * mvPosition;",
      ].join("\n"));
    };
    return m;
  }
  // na ozkih zaslonih so značke in napisi le malo manjši (spremembo uveljavi naslednji okvir)
  const napisi = [];
  let fNapis = 1;
  const merilniZaslon = (r) => {
    const w = (r && r.domElement && (r.domElement.clientWidth || r.domElement.width)) || 1000;
    uVel.value = Math.min(1, Math.max(0.8, w / 900));
    const f = Math.min(1, Math.max(0.96, w / 700)); // napisi ostanejo berljivi (vsaj ~11 px)
    if (f !== fNapis) {
      fNapis = f;
      for (const s of napisi) s.scale.set(s.userData.osnova[0] * f, s.userData.osnova[1] * f, 1);
    }
  };

  // Poti: enakomerno po dolžini vzorčene krivulje (Float32Array).
  function pot(tocke, n = 40) {
    const kr = new THREE.CatmullRomCurve3(tocke.map((p) => (p.isVector3 ? p.clone() : V(p[0], p[1], p[2]))), false, "centripetal");
    const a = new Float32Array((n + 1) * 3);
    kr.getSpacedPoints(n).forEach((p, i) => p.toArray(a, i * 3));
    return a;
  }
  function naPoti(a, s, out) {
    const n = a.length / 3 - 1;
    const x = Math.min(Math.max(s, 0), 1) * n;
    const i = Math.min(n - 1, Math.floor(x));
    const f = x - i, j = i * 3;
    out[0] = a[j] + (a[j + 3] - a[j]) * f;
    out[1] = a[j + 1] + (a[j + 4] - a[j + 1]) * f;
    out[2] = a[j + 2] + (a[j + 5] - a[j + 2]) * f;
  }

  // Združi geometrije (z barvami oglišč) v eno.
  function zdruzi(seznam) {
    const deli = seznam.map(([g, barva]) => {
      const n = g.index ? g.toNonIndexed() : g;
      if (n !== g) g.dispose();
      if (!n.attributes.normal) n.computeVertexNormals();
      return [n, barva ? new THREE.Color(barva) : null];
    });
    let st = 0;
    for (const [g] of deli) st += g.attributes.position.count;
    const pos = new Float32Array(st * 3), nor = new Float32Array(st * 3), bar = new Float32Array(st * 3), uv = new Float32Array(st * 2);
    let o = 0;
    for (const [g, c] of deli) {
      const k = g.attributes.position.count;
      pos.set(g.attributes.position.array, o * 3);
      nor.set(g.attributes.normal.array, o * 3);
      if (g.attributes.uv) uv.set(g.attributes.uv.array, o * 2);
      for (let i = 0; i < k; i++) {
        bar[(o + i) * 3] = c ? c.r : 1; bar[(o + i) * 3 + 1] = c ? c.g : 1; bar[(o + i) * 3 + 2] = c ? c.b : 1;
      }
      o += k;
      g.dispose();
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    out.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
    out.setAttribute("color", new THREE.BufferAttribute(bar, 3));
    out.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    return out;
  }
  const seg = (v, n) => Math.max(6, Math.round(nizka ? v * 0.55 : v));
  function kepa(rx, ry, rz, x, y, z, barva, w = 20) {
    const g = new THREE.SphereGeometry(1, seg(w, 0), seg(w * 0.7, 0));
    g.scale(rx, ry, rz); g.translate(x, y, z);
    return [g, barva];
  }
  // gladke normale tudi na šivu krogle (podvojena oglišča dobijo skupno normalo)
  function zgladi(g) {
    g.computeVertexNormals();
    const p = g.attributes.position, n = g.attributes.normal, mapa = new Map();
    for (let i = 0; i < p.count; i++) {
      const k = Math.round(p.getX(i) * 1e4) + "," + Math.round(p.getY(i) * 1e4) + "," + Math.round(p.getZ(i) * 1e4);
      const e = mapa.get(k); if (e) e.push(i); else mapa.set(k, [i]);
    }
    for (const sk of mapa.values()) {
      if (sk.length < 2) continue;
      let x = 0, y = 0, z = 0;
      for (const i of sk) { x += n.getX(i); y += n.getY(i); z += n.getZ(i); }
      const l = Math.hypot(x, y, z) || 1;
      for (const i of sk) n.setXYZ(i, x / l, y / l, z / l);
    }
    return g;
  }
  // grudasta oblika: elipsoid z izboklinami (a > 0) in vdolbinami (a < 0) v izbranih smereh; zleb = žleb po vrhu vzdolž osi x
  function grudica(rx, ry, rz, izbokline, w, zleb = 0) {
    const g = new THREE.SphereGeometry(1, seg(w), seg(w * 0.75));
    const pa = g.attributes.position;
    const izb = izbokline.map(([x, y, z, a, s]) => { const l = Math.hypot(x, y, z); return [x / l, y / l, z / l, a, s * s]; });
    for (let i = 0; i < pa.count; i++) {
      const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i);
      let f = 1;
      for (const [dx, dy, dz, a, s2] of izb) f += a * Math.exp((x * dx + y * dy + z * dz - 1) / s2);
      let yy = y * f;
      if (zleb && y > 0) yy -= zleb * Math.exp(-((z / 0.32) ** 2)) * ss(y / 0.5);
      pa.setXYZ(i, x * f * rx, yy * ry, z * f * rz);
    }
    return zgladi(g);
  }
  // cev z vijačnim žlebom (nakazana dvojna vijačnica RNA): pot, polmer, globina žleba, dolžina zavoja
  function vijacnaCev(tocke, r, glob, zavoj, n) {
    const kr = new THREE.CatmullRomCurve3(tocke.map((p) => V(p[0], p[1], p[2])));
    const RS = seg(12), g = new THREE.TubeGeometry(kr, n, r, RS, false);
    const pa = g.attributes.position, L = kr.getLength(), c = new THREE.Vector3();
    for (let i = 0; i <= n; i++) {
      kr.getPointAt(i / n, c);
      for (let j = 0; j <= RS; j++) {
        const k = i * (RS + 1) + j, f = 1 + glob * Math.sin((2 * Math.PI * (i / n) * L) / zavoj + (2 * Math.PI * j) / RS);
        pa.setXYZ(k, c.x + (pa.getX(k) - c.x) * f, c.y + (pa.getY(k) - c.y) * f, c.z + (pa.getZ(k) - c.z) * f);
      }
    }
    // zaprta konca
    const kon = [];
    for (const u of [0, 1]) { const t = kr.getPointAt(u); kon.push([new THREE.SphereGeometry(r * 0.98, RS, seg(8)).translate(t.x, t.y, t.z), null]); }
    return [[zgladi(g), null], ...kon];
  }


  // črke baz: ploščice v svetu (velikost v enotah prizora), obrnjene proti kameri
  function crkaMat(tex) {
    const m = h(new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }));
    m.onBeforeCompile = (s) => {
      s.vertexShader = s.vertexShader.replace("#include <project_vertex>", [
        "vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);",
        "mvPosition.xy += position.xy * length(instanceMatrix[0].xyz);",
        "mvPosition.z += 0.03;",
        "gl_Position = projectionMatrix * mvPosition;",
      ].join("\n"));
    };
    return m;
  }
  function crkaTex(c, barva) {
    const S = 64, cv = document.createElement("canvas");
    cv.width = cv.height = S;
    const g = cv.getContext("2d");
    zaobljen(g, 3, 3, S - 6, S - 6, 14);
    const gr = g.createLinearGradient(0, 0, 0, S);
    gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.18, barva); gr.addColorStop(1, barva);
    g.fillStyle = gr; g.fill();
    g.lineWidth = 3; g.strokeStyle = "rgba(8,12,20,0.6)"; g.stroke();
    g.fillStyle = "#0B0F16"; g.font = `700 42px ${PISAVA}`; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(c, S / 2, S / 2 + 3);
    return tekstura(cv);
  }
  // instancirani billboardi: vsaka vrsta svoj InstancedMesh, polnjen vsak okvir
  function billboardi(stars, vrste, svet) {
    const m = {};
    for (const [k, t] of Object.entries(vrste)) {
      const mat = svet ? crkaMat(t.tex) : znackaMat(t.tex, false);
      const mesh = new THREE.InstancedMesh(h(new THREE.PlaneGeometry(t.razmerje || 1, 1)), mat, t.n);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.count = 0; mesh.visible = false; mesh.frustumCulled = false; mesh.renderOrder = svet ? 26 : 28;
      if (!svet) mesh.onBeforeRender = merilniZaslon;
      stars.add(mesh);
      m[k] = { mesh, n: 0, max: t.n, s: t.s };
    }
    return {
      zacni() { for (const k in m) m[k].n = 0; },
      dodaj(k, x, y, z, f = 1) {
        const e = m[k];
        if (!e || e.n >= e.max || f <= 0.01) return;
        const a = e.mesh.instanceMatrix.array, o = e.n * 16, sc = e.s * f;
        a[o] = sc; a[o + 5] = sc; a[o + 10] = sc; a[o + 12] = x; a[o + 13] = y; a[o + 14] = z;
        e.n++;
      },
      koncaj() {
        for (const k in m) { const e = m[k]; e.mesh.count = e.n; e.mesh.visible = e.n > 0; e.mesh.instanceMatrix.needsUpdate = true; }
      },
    };
  }
  // cev, katere sredinsko črto lahko vsak okvir spremenimo (brez novih objektov)
  function dinCev(maxN, S, R, r, mat) {
    const obr = (maxN - 1) * S + 1;
    const pos = new Float32Array(obr * R * 3), nor = new Float32Array(obr * R * 3), idx = [];
    for (let i = 0; i < obr - 1; i++) for (let k = 0; k < R; k++) {
      const a = i * R + k, b = i * R + ((k + 1) % R), c = a + R, d = b + R;
      idx.push(a, b, c, b, d, c);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("normal", new THREE.BufferAttribute(nor, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setIndex(idx);
    geo.setDrawRange(0, 0);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    const C = new Float32Array(obr * 3);
    let nx = 0, ny = 1, nz = 0;
    function posodobi(P, n) {
      if (n < 2) { geo.setDrawRange(0, 0); mesh.visible = false; return; }
      mesh.visible = true;
      let q = 0;
      for (let i = 0; i < n - 1; i++) {
        const i0 = i > 0 ? i - 1 : i, i3 = i + 2 < n ? i + 2 : i + 1;
        for (let s = 0; s < S; s++) {
          const t = s / S, t2 = t * t, t3 = t2 * t;
          for (let c = 0; c < 3; c++) {
            const p0 = P[i0 * 3 + c], p1 = P[i * 3 + c], p2 = P[(i + 1) * 3 + c], p3 = P[i3 * 3 + c];
            C[q * 3 + c] = 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
          }
          q++;
        }
      }
      C[q * 3] = P[(n - 1) * 3]; C[q * 3 + 1] = P[(n - 1) * 3 + 1]; C[q * 3 + 2] = P[(n - 1) * 3 + 2];
      q++;
      // vzporedni prenos okvira
      for (let i = 0; i < q; i++) {
        const a = Math.max(0, i - 1), b = Math.min(q - 1, i + 1);
        let tx = C[b * 3] - C[a * 3], ty = C[b * 3 + 1] - C[a * 3 + 1], tz = C[b * 3 + 2] - C[a * 3 + 2];
        const tl = Math.hypot(tx, ty, tz) || 1; tx /= tl; ty /= tl; tz /= tl;
        if (i === 0) { if (Math.abs(ty) < 0.9) { nx = 0; ny = 1; nz = 0; } else { nx = 1; ny = 0; nz = 0; } }
        const dd = nx * tx + ny * ty + nz * tz;
        nx -= dd * tx; ny -= dd * ty; nz -= dd * tz;
        const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
        const bx = ty * nz - tz * ny, by = tz * nx - tx * nz, bz = tx * ny - ty * nx;
        for (let k = 0; k < R; k++) {
          const f = (k / R) * Math.PI * 2, cs = Math.cos(f), sn = Math.sin(f);
          const ox = nx * cs + bx * sn, oy = ny * cs + by * sn, oz = nz * cs + bz * sn, o = (i * R + k) * 3;
          pos[o] = C[i * 3] + ox * r; pos[o + 1] = C[i * 3 + 1] + oy * r; pos[o + 2] = C[i * 3 + 2] + oz * r;
          nor[o] = ox; nor[o + 1] = oy; nor[o + 2] = oz;
        }
      }
      geo.setDrawRange(0, (q - 1) * R * 6);
      geo.attributes.position.needsUpdate = true;
      geo.attributes.normal.needsUpdate = true;
    }
    return { mesh, posodobi };
  }
  // dinamične oznake: sprite + črta; položaje vsak okvir izračuna funkcija
  function dinOznake(stars, seznam) {
    const g = new THREE.Group();
    const geo = new THREE.BufferGeometry();
    const arr = new Float32Array(seznam.length * 6);
    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3).setUsage(THREE.DynamicDrawUsage));
    const crte = new THREE.LineSegments(geo, h(new THREE.LineBasicMaterial({ color: 0xc3cde3, transparent: true, opacity: 0.55, depthWrite: false })));
    crte.renderOrder = 29;
    crte.frustumCulled = false;
    g.add(crte);
    const el = seznam.map((o) => { const s = napis(o.b, o.o); g.add(s); return { ...o, s, p: [0, 0, 0], t: [0, 0, 0] }; });
    stars.add(g);
    return {
      g,
      posodobi() {
        let n = 0;
        for (const e of el) {
          const vid = e.f(e.p, e.t);
          e.s.visible = !!vid;
          if (!vid) continue;
          e.s.position.set(e.p[0], e.p[1], e.p[2]);
          if (e.crta === false) continue;
          const d = Math.hypot(e.p[0], e.p[1], e.p[2]), k = d > 0.985 ? 0.985 / d : 1;
          arr[n++] = e.p[0] * k; arr[n++] = e.p[1] * k; arr[n++] = e.p[2] * k;
          arr[n++] = e.t[0]; arr[n++] = e.t[1]; arr[n++] = e.t[2];
        }
        geo.setDrawRange(0, n / 3);
        crte.visible = n > 0;
        geo.attributes.position.needsUpdate = true;
      },
    };
  }

  // ---------- mere prizora ----------
  const D = 0.048, X0 = -((NBP - 1) * D) / 2, Y0 = 0.42, RH = 0.105, DELTA = 2.4, ZK = 0.03;
  const xb = (i) => X0 + i * D;
  const yOv = (x, z) => 0.005 + 0.08 * x * x + 0.02 * z * z; // jedrna ovojnica (sredina med membranama)
  const PORA = [0.6, 0, 0.0];
  const YR = -0.55, XC0 = -0.62; // mRNA v citoplazmi
  const xc = (j) => XC0 + j * D;
  const kodonX = (c) => xc(UTR5 + 3 * c + 1);
  const ZR = 0.05;

  // ---------- materiali ----------
  const mKod = fiz("#4DA3FF", { roughness: 0.35, clearcoat: 0.8, emissive: "#4da3ff", emissiveIntensity: 0 });
  const mMat = fiz("#C77DFF", { roughness: 0.35, clearcoat: 0.8, emissive: "#c77dff", emissiveIntensity: 0 });
  const mMrna = fiz("#FF6B9A", { roughness: 0.35, clearcoat: 0.8, emissive: "#ff6b9a", emissiveIntensity: 0 });
  const mBaze = fiz("#ffffff", { roughness: 0.45, clearcoat: 0.5, sheen: 0.2, vertexColors: true });
  const mBazeR = fiz("#ffffff", { roughness: 0.45, clearcoat: 0.5, sheen: 0.2, vertexColors: true });

  // ---------- DNK in mRNA ----------
  const cevS = nizka ? 4 : 7, cevR = nizka ? 8 : 14;
  const kodCev = dinCev(NBP, cevS, cevR, 0.02, mKod);
  const matCev = dinCev(NBP, cevS, cevR, 0.02, mMat);
  const mrnaCev = dinCev(NNT, cevS, cevR, 0.019, mMrna);
  group.add(kodCev.mesh, matCev.mesh, mrnaCev.mesh);
  kodCev.mesh.onBeforeRender = merilniZaslon;
  const palGeo = h(new THREE.CylinderGeometry(1, 1, 1, nizka ? 6 : 10, 1));
  palGeo.translate(0, 0.5, 0);
  {
    // baza je ob sredini vijačnice (kjer se para) temnejša: nakazana zasenčenost
    const pa = palGeo.attributes.position, b = new Float32Array(pa.count * 3);
    for (let i = 0; i < pa.count; i++) { const t = 1 - 0.34 * pa.getY(i); b[i * 3] = b[i * 3 + 1] = b[i * 3 + 2] = t; }
    palGeo.setAttribute("color", new THREE.BufferAttribute(b, 3));
  }
  const bazeDNK = new THREE.InstancedMesh(palGeo, mBaze, NBP * 2);
  const bazeR = new THREE.InstancedMesh(palGeo, mBazeR, NNT);
  bazeDNK.frustumCulled = false; bazeR.frustumCulled = false;
  const barva = new THREE.Color();
  for (let i = 0; i < NBP; i++) {
    bazeDNK.setColorAt(i, barva.set(BARVE[KODIRAJOCA[i]]));
    bazeDNK.setColorAt(NBP + i, barva.set(BARVE[MATRICA[i]]));
  }
  for (let j = 0; j < NNT; j++) bazeR.setColorAt(j, barva.set(BARVE[MRNA[j]]));
  group.add(bazeDNK, bazeR);
  // promotor: prosojen ovoj okoli prvih baznih parov
  const promotor = new THREE.Mesh(h(new THREE.CylinderGeometry(0.15, 0.15, PREP0 * D, seg(28), 1, true)), h(new THREE.MeshPhysicalMaterial({ color: "#FFD166", transparent: true, opacity: 0.16, roughness: 0.3, side: THREE.DoubleSide, depthWrite: false, emissive: "#ffd166", emissiveIntensity: 0.2 })));
  promotor.rotation.z = Math.PI / 2;
  promotor.position.set((xb(0) + xb(PREP0 - 1)) / 2, Y0, 0);
  promotor.renderOrder = 6;
  group.add(promotor);

  // črke baz
  const crke = {};
  for (const c of "ATGCU") crke[c] = { tex: crkaTex(c, BARVE[c]), n: 48, s: 0.043 };
  const CR = billboardi(group, crke, true);

  // RNA-polimeraza
  const polG = new THREE.Group();
  const mPol = h(new THREE.MeshPhysicalMaterial({ color: "#B79BFF", transparent: true, opacity: 0.45, roughness: 0.3, clearcoat: 0.8, sheen: 0.4, sheenColor: new THREE.Color("#ffffff"), depthWrite: false, emissive: "#b49bff", emissiveIntensity: 0 }));
  const polMesh = new THREE.Mesh(zdruzi([kepa(0.2, 0.17, 0.165, 0, 0, 0, null, 30), kepa(0.11, 0.09, 0.12, 0.13, 0.1, -0.02, null, 20), kepa(0.1, 0.08, 0.1, -0.12, -0.11, 0.03, null, 20)]), mPol);
  polMesh.renderOrder = 8;
  polG.add(polMesh);
  group.add(polG);

  // jedrna ovojnica (dvojna membrana) s poro
  const OV_X = 0.86, OV_Z0 = -0.42, OV_Z1 = 0.14, ovN = nizka ? 34 : 64, ovM = nizka ? 12 : 22, PR = 0.07;
  // ob pori se membrani zlijeta v zaobljen rob (stena pore na polmeru PR + 0,02); luknja v mreži je krog s polmerom R_IZREZ
  const R_LUK = PR + 0.05, R_IZREZ = 0.1, R_OBOD = 0.13;
  function ovojnica(dy) {
    const pos = [], idx = [];
    const notri = [];
    for (let i = 0; i <= ovN; i++) for (let k = 0; k <= ovM; k++) {
      let x = -OV_X + (2 * OV_X * i) / ovN, z = OV_Z0 + ((OV_Z1 - OV_Z0) * k) / ovM;
      const d = Math.hypot(x - PORA[0], z - PORA[2]);
      notri.push(d < R_IZREZ);
      // oglišča v luknji potisnemo na njen rob, da je luknja okrogla
      if (d < R_IZREZ && d > 1e-6) { x = PORA[0] + ((x - PORA[0]) * R_IZREZ) / d; z = PORA[2] + ((z - PORA[2]) * R_IZREZ) / d; }
      pos.push(x, yOv(x, z) + dy, z);
    }
    for (let i = 0; i < ovN; i++) for (let k = 0; k < ovM; k++) {
      const a = i * (ovM + 1) + k, b = a + ovM + 1;
      if (notri[a] && notri[a + 1] && notri[b] && notri[b + 1]) continue;
      if (!(notri[a] && notri[a + 1] && notri[b])) idx.push(a, a + 1, b);
      if (!(notri[b] && notri[a + 1] && notri[b + 1])) idx.push(b, a + 1, b + 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  const mOv = fiz("#73C2C9", { side: THREE.DoubleSide, roughness: 0.4, clearcoat: 0.6, transparent: true, opacity: 0.9, emissive: "#9ff0f5", emissiveIntensity: 0 });
  const ovZg = new THREE.Mesh(ovojnica(0.022), mOv);
  const ovSp = new THREE.Mesh(ovojnica(-0.022), mOv);
  // robovi na vseh štirih straneh: prerez obeh membran (vsaka ima debelino), vmes lumen
  const robPos = [], robIdx = [];
  function rob(x0, z0, x1, z1, n) {
    const o = robPos.length / 3;
    for (let i = 0; i <= n; i++) {
      const x = lerp(x0, x1, i / n), z = lerp(z0, z1, i / n), y = yOv(x, z);
      robPos.push(x, y + 0.03, z, x, y + 0.014, z, x, y - 0.014, z, x, y - 0.03, z);
    }
    for (let i = 0; i < n; i++) { const a = o + i * 4, b = a + 4; robIdx.push(a, a + 1, b, b, a + 1, b + 1, a + 2, a + 3, b + 2, b + 2, a + 3, b + 3); }
  }
  rob(-OV_X, OV_Z1, OV_X, OV_Z1, ovN); rob(-OV_X, OV_Z0, OV_X, OV_Z0, ovN);
  rob(-OV_X, OV_Z0, -OV_X, OV_Z1, ovM); rob(OV_X, OV_Z0, OV_X, OV_Z1, ovM);
  const robGeo = new THREE.BufferGeometry();
  robGeo.setAttribute("position", new THREE.Float32BufferAttribute(robPos, 3));
  robGeo.setIndex(robIdx);
  robGeo.computeVertexNormals();
  const ovRob = new THREE.Mesh(robGeo, fiz("#A6E3E8", { side: THREE.DoubleSide, roughness: 0.5 }));
  // rob pore: zunanja membrana se zavije v notranjo (prerez je polkrog), nagnjen po ukrivljenosti ovojnice
  const lukT = [new THREE.Vector2(R_OBOD, 0.03)];
  for (let i = 0; i <= 10; i++) { const t = (i / 10) * Math.PI; lukT.push(new THREE.Vector2(R_LUK - 0.03 * Math.sin(t), 0.03 * Math.cos(t))); }
  lukT.push(new THREE.Vector2(R_OBOD, -0.03));
  const ovPoraGeo = new THREE.LatheGeometry(lukT.reverse(), seg(40));
  ovPoraGeo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-0.16 * PORA[0], 1, -0.04 * PORA[2]).normalize()));
  ovPoraGeo.translate(PORA[0], yOv(PORA[0], PORA[2]), PORA[2]);
  const ovPora = new THREE.Mesh(ovPoraGeo, ovRob.material);
  group.add(ovZg, ovSp, ovRob, ovPora);
  // jedrna pora: obroč z osmimi deli
  const poraDeli = [];
  const yP = yOv(PORA[0], PORA[2]);
  for (const dy of [0.03, -0.03]) {
    const t = new THREE.TorusGeometry(PR + 0.012, 0.016, seg(10), seg(40));
    t.rotateX(Math.PI / 2); t.translate(PORA[0], yP + dy, PORA[2]);
    poraDeli.push([t, "#5A8FD8"]);
  }
  for (let i = 0; i < 8; i++) {
    const f = (i / 8) * Math.PI * 2;
    poraDeli.push(kepa(0.022, 0.05, 0.022, PORA[0] + Math.cos(f) * (PR + 0.012), yP, PORA[2] + Math.sin(f) * (PR + 0.012), "#7FB2F0", 12));
    poraDeli.push(kepa(0.012, 0.03, 0.012, PORA[0] + Math.cos(f) * (PR - 0.01), yP + 0.07, PORA[2] + Math.sin(f) * (PR - 0.01), "#9CC4F5", 8));
  }
  const pora = new THREE.Mesh(zdruzi(poraDeli), fiz("#ffffff", { vertexColors: true, roughness: 0.35, clearcoat: 0.7, emissive: "#9cc4ff", emissiveIntensity: 0 }));
  group.add(pora);

  // ribosom
  const mMala = fiz("#F2C14E", { roughness: 0.38, clearcoat: 0.6, sheen: 0.4, emissive: "#ffd36b", emissiveIntensity: 0 });
  const mVelika = h(new THREE.MeshPhysicalMaterial({ color: "#FF9A7C", transparent: true, opacity: 0.34, roughness: 0.3, clearcoat: 0.8, sheen: 0.4, sheenColor: new THREE.Color("#ffffff"), depthWrite: false, emissive: "#ff9a7a", emissiveIntensity: 0 }));
  // mala podenota: telo z glavo, ploščadjo in kljunom, po vrhu žleb za mRNA
  const mala = new THREE.Mesh(zdruzi([[grudica(0.25, 0.075, 0.165, [
    [-0.35, 0.45, -0.85, 0.3, 0.55], [0.5, 0.2, 0.85, 0.24, 0.5], [-0.9, 0.3, -0.35, 0.16, 0.35], [0.85, 0.25, -0.45, 0.12, 0.4], [0, -1, 0, 0.1, 0.6],
  ], 56, 0.28), null]]), mMala);
  // velika podenota: osrednja izboklina, steblo L1 in steblo P (»krona«), spodaj vdolbina za tRNA
  const velika = new THREE.Mesh(zdruzi([[grudica(0.3, 0.2, 0.21, [
    [0.05, 1, -0.35, 0.18, 0.36], [-1, 0.5, -0.1, 0.36, 0.3], [1, 0.45, 0.1, 0.3, 0.22], [-0.43, 1.15, 0.67, 0.4, 0.34], [0, -1, 0.35, -0.16, 0.55],
  ], 64), null]]), mVelika);
  velika.renderOrder = 9;
  // prosojnost po Fresnelu: rob podenote je gostejši, sredina prosojna (vidijo se tRNA in tunel)
  mVelika.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace("#include <opaque_fragment>",
      "{ float frs = pow(1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0), 2.0); diffuseColor.a = opacity * mix(0.45, 2.2, frs); }\n#include <opaque_fragment>");
  };
  mVelika.customProgramCacheKey = () => "evklid-velika-fresnel";
  // izstopni tunel: skozi veliko podenoto od mesta, kjer nastaja peptidna vez, do površja
  const mTunel = h(new THREE.MeshPhysicalMaterial({ color: "#8E2F22", transparent: true, opacity: 0.6, roughness: 0.5, depthWrite: false, side: THREE.DoubleSide }));
  const tunel = new THREE.Mesh(h(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(-0.031, 0.15, 0.03), V(-0.04, 0.2, 0.075), V(-0.08, 0.222, 0.105), V(-0.108, 0.23, 0.124)]), seg(20), 0.019, seg(12), false)), mTunel);
  tunel.renderOrder = 8;
  velika.add(tunel);
  group.add(mala, velika);
  // označen kodon na mestu A
  const kodonOkvir = new THREE.Mesh(h(new THREE.BoxGeometry(3 * D, 0.1, 0.09)), h(new THREE.MeshBasicMaterial({ color: "#6E9BFF", transparent: true, opacity: 0.22, depthWrite: false, toneMapped: false })));
  kodonOkvir.renderOrder = 7;
  group.add(kodonOkvir);

  // tRNA (oblika črke L: antikodonska zanka spodaj, aminokislina zgoraj)
  // dve skoraj pravokotni ročici (antikodonska in sprejemna), v kotu »komolec«; na koncu CCA se veže aminokislina
  const trnaGeo = zdruzi([
    ...vijacnaCev([[0, 0.03, 0], [-0.028, 0.1, -0.012], [-0.062, 0.162, -0.02]], 0.02, 0.13, 0.058, seg(24)),
    kepa(0.034, 0.03, 0.03, -0.066, 0.172, -0.02, null, 16),
    ...vijacnaCev([[-0.06, 0.18, -0.02], [-0.016, 0.205, -0.012], [0.026, 0.222, 0]], 0.02, 0.13, 0.058, seg(20)),
    kepa(0.009, 0.02, 0.009, 0.036, 0.236, 0, null, 8),
  ]);
  viri.add(trnaGeo);
  const trna = new THREE.InstancedMesh(trnaGeo, fiz("#4F8CFF", { roughness: 0.38, clearcoat: 0.6, sheen: 0, emissive: "#a8c8ff", emissiveIntensity: 0 }), 4);
  const zanka = new THREE.InstancedMesh(h(new THREE.SphereGeometry(1, seg(16), seg(10))), fiz("#BFD6FF", { roughness: 0.35, clearcoat: 0.6, sheen: 0, emissive: "#ffffff", emissiveIntensity: 0 }), 4);
  trna.frustumCulled = false; zanka.frustumCulled = false;
  const sprost = new THREE.Mesh(trnaGeo, fiz("#8E9AAF", { roughness: 0.5, clearcoat: 0.4, emissive: "#c3cde3", emissiveIntensity: 0 }));
  group.add(trna, zanka, sprost);
  // aminokisline in peptidne vezi
  const kroglice = new THREE.InstancedMesh(h(new THREE.IcosahedronGeometry(0.034, nizka ? 1 : 2)), fiz("#ffffff", { roughness: 0.35, clearcoat: 0.8, emissive: "#ffffff", emissiveIntensity: 0 }), NK);
  for (let k = 0; k < NK; k++) kroglice.setColorAt(k, barva.set(AK[k].barva));
  const vezi = new THREE.InstancedMesh(palGeo, fiz("#E8EDF7", { roughness: 0.4, clearcoat: 0.5 }), NK);
  kroglice.frustumCulled = false; vezi.frustumCulled = false;
  group.add(kroglice, vezi);
  // velikost kroglice nakazuje velikost stranske verige (Gly najmanjša, Trp največja)
  const AK_VEL = AK.map((a) => ({ Gly: 0.78, Ala: 0.86, Asp: 0.95, Met: 1, Lys: 1.02, Phe: 1.1, Trp: 1.18 })[a.kr] || 1);
  const akZnacke = {};
  for (const a of AK) { const z = znacka(a.kr, a.barva); akZnacke[a.kr] = { tex: z.tex, razmerje: z.razmerje, n: 1, s: 14 * K_PX }; }
  const AZ = billboardi(group, akZnacke, false);

  // ---------- stanje ----------
  let v = Number(zacetek.korak);
  if (!(v >= 0 && v <= KONEC)) v = 0;
  let predvajaj = zacetek.predvajaj !== undefined ? !!zacetek.predvajaj : false;
  let kazOznake = zacetek.oznake !== undefined ? !!zacetek.oznake : true;
  let cas = 0, premor = 0;

  const KOD = new Float32Array(NBP * 3), MAT = new Float32Array(NBP * 3), MR = new Float32Array(NNT * 3);
  const KODD = new Float32Array(NBP * 3), MATD = new Float32Array(NBP * 3);
  const MRs = new Float32Array(NNT); // velikost (pojav) nukleotida
  // poti izvoza skozi poro
  const izvoz = [];
  for (let j = 0; j < NNT; j++) {
    const x = xb(PREP0 + j);
    izvoz.push(pot([[x, Y0 - 0.26, ZK], [lerp(x, PORA[0], 0.6), 0.2, 0.03], [PORA[0], yP + 0.09, PORA[2]], [PORA[0], yP - 0.1, PORA[2]], [lerp(PORA[0], xc(j), 0.4), YR + 0.12, ZR], [xc(j), YR, ZR]], 48));
  }
  const tmp = [0, 0, 0];
  const mt = new THREE.Matrix4(), qv = new THREE.Quaternion(), vA = new THREE.Vector3(), vB = new THREE.Vector3(), vS = new THREE.Vector3(), Y1 = new THREE.Vector3(0, 1, 0);
  function palcka(mesh, i, x, y, z, dx, dy, dz, r) {
    const L = Math.hypot(dx, dy, dz);
    if (L < 1e-5) { mt.makeScale(0, 0, 0); mesh.setMatrixAt(i, mt); return; }
    vA.set(dx / L, dy / L, dz / L);
    qv.setFromUnitVectors(Y1, vA);
    mt.compose(vB.set(x, y, z), qv, vS.set(r, L, r));
    mesh.setMatrixAt(i, mt);
  }

  // stanje prizora, izračunano iz v
  const S = {
    p: PREP0, o: 0, hf: 0, pol: [0, 0, 0], polVid: 0, faza: "", c: 0, u: 0,
    cp: 0, xR: 0, malaPos: [0, 0, 0], velikaPos: [0, 0, 0], ribVid: 0, velVid: 0,
    trna: [], krog: [], tau: 0, malaSc: 1, nMr: 0, nVer: 0, veriga: 0, prosta: 0, sprost: [0, 0, 0], sprostVid: 0, kodonVid: 0, kodonC: 0,
  };
  for (let k = 0; k < NK; k++) S.trna.push({ vid: 0, p: [0, 0, 0], f: 1 });
  for (let k = 0; k < NK; k++) S.krog.push({ vid: 0, p: [0, 0, 0] });
  const xRib = (cp) => kodonX(cp) + 1.5 * D;
  const vezano = (k, out) => { out[0] = kodonX(k); out[1] = YR + 0.15; out[2] = ZR; return out; };
  const vrh = (p, out) => { out[0] = p[0] + 0.041; out[1] = p[1] + 0.25; out[2] = p[2]; return out; };

  function racunaj() {
    const vv = Math.min(KONEC, Math.max(0, v));
    // --- transkripcija ---
    if (vv < 1) {
      const u = vv;
      const a = ss(u / 0.6);
      S.p = PREP0;
      const cx = xb(PREP0 - 3.5);
      S.pol[0] = lerp(-0.4, cx, a); S.pol[1] = lerp(0.58, Y0 - 0.03, a); S.pol[2] = lerp(0.28, ZK, a);
      S.polVid = 1; S.o = ss((u - 0.55) / 0.4); S.hf = 1;
    } else if (vv < 2) {
      S.p = PREP0 + NNT * (vv - 1);
      S.pol[0] = xb(S.p - 3.5); S.pol[1] = Y0 - 0.03; S.pol[2] = ZK;
      S.polVid = 1; S.o = 1; S.hf = 1;
    } else if (vv < 3) {
      const u = vv - 2;
      S.p = PREP0 + NNT;
      const a = ss((u - 0.15) / 0.6);
      S.pol[0] = lerp(xb(S.p - 3.5), 0.38, a); S.pol[1] = lerp(Y0 - 0.03, 0.58, a); S.pol[2] = lerp(ZK, 0.28, a);
      S.polVid = 1 - ss((u - 0.6) / 0.35); S.o = 1 - ss(u / 0.55); S.hf = 1 - ss(u / 0.4);
    } else { S.p = PREP0 + NNT; S.polVid = 0; S.o = 0; S.hf = 0; }

    // DNK
    for (let i = 0; i < NBP; i++) {
      const th = (i * 2 * Math.PI) / 10.5 + 0.6;
      const w = S.o * ss((i - (S.p - 9.5)) / 1.5) * ss((S.p + 2.5 - i) / 1.5);
      const kx = xb(i), ky = Y0 + RH * Math.cos(th), kz = RH * Math.sin(th);
      const mx = xb(i), my = Y0 + RH * Math.cos(th + DELTA), mz = RH * Math.sin(th + DELTA);
      const o = i * 3;
      KOD[o] = kx; KOD[o + 1] = lerp(ky, Y0 + 0.17, w); KOD[o + 2] = lerp(kz, ZK, w);
      MAT[o] = mx; MAT[o + 1] = lerp(my, Y0 + 0.02, w); MAT[o + 2] = lerp(mz, ZK, w);
      // smer baze: v vijačnici do sredine tetive, v mehurčku navzdol
      const hx = (mx - kx) / 2, hy = (my - ky) / 2, hz = (mz - kz) / 2;
      KODD[o] = lerp(hx, 0, w); KODD[o + 1] = lerp(hy, -0.04, w); KODD[o + 2] = lerp(hz, 0, w);
      MATD[o] = lerp(-hx, 0, w); MATD[o + 1] = lerp(-hy, -0.045, w); MATD[o + 2] = lerp(-hz, 0, w);
    }
    // mRNA
    let nMr = 0;
    const vCit = vv >= 4;
    for (let j = 0; j < NNT; j++) {
      const t = PREP0 + j, o = j * 3;
      let x, y, z, sz;
      if (vv < 3) {
        sz = vv < 1 ? 0 : cl((S.p - t - 0.5) / 0.6);
        const hyb = S.hf * ss((8.5 - (S.p - t)) / 1.5);
        x = xb(t); y = lerp(Y0 - 0.26, Y0 - 0.165, hyb); z = ZK;
      } else if (vv < 4) {
        const u = vv - 3;
        naPoti(izvoz[j], ss(cl((u - j * 0.021) / 0.4)), tmp);
        x = tmp[0]; y = tmp[1]; z = tmp[2]; sz = 1;
      } else { x = xc(j); y = YR; z = ZR; sz = 1; }
      MR[o] = x; MR[o + 1] = y; MR[o + 2] = z; MRs[j] = sz;
      if (sz > 0) nMr = j + 1;
    }
    S.nMr = vCit ? NNT : nMr;

    // --- translacija ---
    S.ribVid = 0; S.velVid = 0; S.sprostVid = 0; S.kodonVid = 0; S.prosta = 0;
    for (const t of S.trna) t.vid = 0;
    for (const k of S.krog) k.vid = 0;
    S.veriga = 0; S.faza = vv < 1 ? "vezava" : vv < 2 ? "transkripcija" : vv < 3 ? "konec-transkripcije" : vv < 4 ? "izvoz" : vv < 5 ? "zacetek" : vv < 11 ? "podaljsevanje" : vv < KONEC ? "konec" : "prosta";
    if (vv >= 4) {
      const iv = Math.min(11, Math.floor(vv)), u = vv >= KONEC ? 1 : vv - iv;
      S.u = u;
      let cp = 0, malaOff = 0, velOff = 0, velVid = 1, raz = 0;
      S.malaSc = 1;
      if (iv === 4) {
        const prihod = ss(u / 0.25), skeniraj = ss((u - 0.3) / 0.3);
        S.xR = lerp(-0.48, xRib(0), skeniraj);
        S.malaSc = 0.4 + 0.6 * prihod;
        velOff = 0.16 * (1 - ss((u - 0.6) / 0.32));
        velVid = ss((u - 0.55) / 0.15);
        // tRNA z metioninom pride skupaj z malo podenoto in sedi na mestu P
        const t0 = S.trna[0];
        t0.vid = 1; t0.p[0] = S.xR - 1.5 * D; t0.p[1] = YR + 0.15; t0.p[2] = ZR; t0.f = prihod;
        S.krog[0].vid = 1; vrh(t0.p, S.krog[0].p);
      } else if (iv <= 10) {
        const c = iv - 4; // kodon, ki pride na mesto A
        cp = c - 1 + ss((u - 0.55) / 0.3);
        S.xR = xRib(cp);
        S.kodonVid = 1; S.kodonC = c;
        const tc = S.trna[c], cilj = vezano(c, tmp);
        const vs = ss(u / 0.35);
        tc.vid = 1; tc.f = ss(u / 0.08);
        tc.p[0] = lerp(cilj[0] + 0.3, cilj[0], vs); tc.p[1] = lerp(cilj[1] + 0.12, cilj[1], vs); tc.p[2] = lerp(0.55, cilj[2], vs);
        const tp = S.trna[c - 1];
        tp.vid = 1; tp.f = 1; vezano(c - 1, tp.p);
        const odh = ss((u - 0.85) / 0.15);
        if (odh > 0) { tp.p[0] -= 0.28 * odh; tp.p[1] += 0.12 * odh; tp.p[2] += 0.5 * odh; tp.f = 1 - ss((u - 0.9) / 0.1); }
        S.tau = ss((u - 0.35) / 0.2);
        S.krog[c].vid = 1; vrh(tc.p, S.krog[c].p);
      } else {
        cp = NK - 1;
        S.xR = xRib(cp);
        S.kodonVid = 1; S.kodonC = NK;
        const tp = S.trna[NK - 1];
        tp.vid = 1; tp.f = 1; vezano(NK - 1, tp.p);
        const odh = ss((u - 0.55) / 0.2);
        if (odh > 0) { tp.p[0] -= 0.28 * odh; tp.p[1] += 0.12 * odh; tp.p[2] += 0.5 * odh; tp.f = 1 - ss((u - 0.65) / 0.12); }
        const cilj = vezano(NK, tmp);
        const vs = ss(u / 0.3), od = ss((u - 0.55) / 0.25);
        S.sprostVid = (1 - ss((u - 0.72) / 0.1)) * ss(u / 0.06);
        S.sprost[0] = lerp(cilj[0] + 0.3, cilj[0], vs) + 0.1 * od; S.sprost[1] = lerp(cilj[1] + 0.12, cilj[1], vs) + 0.1 * od; S.sprost[2] = lerp(0.55, cilj[2], vs) + 0.45 * od;
        S.prosta = ss((u - 0.3) / 0.4);
        raz = ss((u - 0.7) / 0.3);
        malaOff = -0.08 * raz; velOff = 0.06 * raz;
      }
      S.cp = cp;
      S.ribVid = 1; S.velVid = velVid;
      S.malaPos[0] = S.xR - 0.12 * raz; S.malaPos[1] = YR - 0.085 + malaOff; S.malaPos[2] = ZR - 0.01;
      S.velikaPos[0] = S.xR + 0.06 * raz; S.velikaPos[1] = YR + 0.25 + 0.3 * velOff; S.velikaPos[2] = ZR - 0.03 + 1.2 * velOff;
    }
  }

  // veriga aminokislin: kroglice ob poti od sidra (vrh tRNA) skozi tunel v veliki podenoti
  const POT = new Float32Array(15), BK = new Float32Array(NK * 3), BK2 = new Float32Array(NK * 3);
  function potVerige(sidro, xR, yOff) {
    POT[0] = sidro[0]; POT[1] = sidro[1]; POT[2] = sidro[2];
    POT[3] = xR - 0.04; POT[4] = YR + 0.46 + yOff; POT[5] = ZR + 0.05;
    POT[6] = xR - 0.13; POT[7] = YR + 0.48 + yOff; POT[8] = ZR + 0.11;
    POT[9] = xR - 0.29; POT[10] = YR + 0.45 + yOff; POT[11] = ZR + 0.2;
    POT[12] = xR - 0.46; POT[13] = YR + 0.38 + yOff; POT[14] = ZR + 0.28;
  }
  function naPolilinji(s, out, o) {
    let ost = s;
    for (let i = 0; i < 4; i++) {
      const dx = POT[i * 3 + 3] - POT[i * 3], dy = POT[i * 3 + 4] - POT[i * 3 + 1], dz = POT[i * 3 + 5] - POT[i * 3 + 2];
      const L = Math.hypot(dx, dy, dz);
      if (ost <= L || i === 3) { const f = L > 0 ? ost / L : 0; out[o] = POT[i * 3] + dx * f; out[o + 1] = POT[i * 3 + 1] + dy * f; out[o + 2] = POT[i * 3 + 2] + dz * f; return; }
      ost -= L;
    }
  }
  const LV = 0.078;
  const FOLD = [0.1, -0.1, 0.5];
  const sidro = [0, 0, 0], sidro2 = [0, 0, 0];

  function izrisi() {
    racunaj();
    const vv = Math.min(KONEC, Math.max(0, v));
    // DNK
    kodCev.posodobi(KOD, NBP);
    matCev.posodobi(MAT, NBP);
    CR.zacni();
    for (let i = 0; i < NBP; i++) {
      const o = i * 3;
      palcka(bazeDNK, i, KOD[o], KOD[o + 1], KOD[o + 2], KODD[o], KODD[o + 1], KODD[o + 2], 0.013);
      palcka(bazeDNK, NBP + i, MAT[o], MAT[o + 1], MAT[o + 2], MATD[o], MATD[o + 1], MATD[o + 2], 0.013);
      // črke samo v razprtem delu
      const w = S.o * ss((i - (S.p - 9.5)) / 1.5) * ss((S.p + 2.5 - i) / 1.5);
      if (w > 0.6) {
        CR.dodaj(KODIRAJOCA[i], KOD[o], KOD[o + 1] - 0.065, KOD[o + 2] + 0.01, (w - 0.6) / 0.4);
        CR.dodaj(MATRICA[i], MAT[o], MAT[o + 1] - 0.055, MAT[o + 2] + 0.01, (w - 0.6) / 0.4);
      }
    }
    bazeDNK.instanceMatrix.needsUpdate = true;
    // mRNA
    let n = 0;
    for (let j = 0; j < NNT; j++) if (MRs[j] > 0) n = j + 1;
    mrnaCev.posodobi(MR, n);
    for (let j = 0; j < NNT; j++) {
      const o = j * 3, sz = MRs[j];
      palcka(bazeR, j, MR[o], MR[o + 1], MR[o + 2], 0, 0.05 * sz, 0, 0.013 * Math.max(sz, 0.001));
      if (sz > 0.05) CR.dodaj(MRNA[j], MR[o], MR[o + 1] + 0.065, MR[o + 2] + 0.01, sz);
    }
    bazeR.instanceMatrix.needsUpdate = true;
    // polimeraza
    polG.visible = S.polVid > 0.01;
    polG.position.set(S.pol[0], S.pol[1], S.pol[2]);
    mPol.opacity = 0.45 * S.polVid;
    const dih = gibanje ? 1 + 0.015 * Math.sin(cas * 2.2) : 1;
    polG.scale.setScalar(dih);
    promotor.visible = vv < 1.4;
    // ribosom
    mala.visible = S.ribVid > 0;
    velika.visible = S.ribVid > 0 && S.velVid > 0.01;
    mala.position.set(S.malaPos[0], S.malaPos[1], S.malaPos[2]);
    mala.scale.setScalar(S.malaSc);
    velika.position.set(S.velikaPos[0], S.velikaPos[1], S.velikaPos[2]);
    mVelika.opacity = 0.34 * S.velVid; mTunel.opacity = 0.6 * S.velVid;
    kodonOkvir.visible = !!S.kodonVid && vv < 11.75;
    if (S.kodonVid) kodonOkvir.position.set(kodonX(S.kodonC), YR + 0.03, ZR);
    // tRNA
    let nt = 0;
    const kiv = gibanje ? 0.006 : 0;
    for (let k = 0; k < NK; k++) {
      const t = S.trna[k];
      if (!t.vid || t.f <= 0.01) continue;
      const wob = kiv * Math.sin(cas * 2.6 + k * 1.7);
      mt.compose(vB.set(t.p[0], t.p[1] + wob, t.p[2]), qv.identity(), vS.set(t.f, t.f, t.f));
      trna.setMatrixAt(nt, mt);
      mt.compose(vB.set(t.p[0], t.p[1] + 0.022 + wob, t.p[2]), qv, vS.set(0.07 * t.f, 0.026 * t.f, 0.032 * t.f));
      zanka.setMatrixAt(nt, mt);
      nt++;
      // antikodon
      const ac = AK[k].ac;
      for (let q = 0; q < 3; q++) CR.dodaj(ac[q], t.p[0] + (q - 1) * D, t.p[1] + 0.005 + wob, t.p[2] + 0.04, t.f);
    }
    trna.count = nt; zanka.count = nt;
    trna.visible = zanka.visible = nt > 0;
    trna.instanceMatrix.needsUpdate = true; zanka.instanceMatrix.needsUpdate = true;
    sprost.visible = S.sprostVid > 0.01;
    sprost.position.set(S.sprost[0], S.sprost[1], S.sprost[2]);
    sprost.scale.setScalar(Math.max(0.001, S.sprostVid));
    // aminokisline
    for (let k = 0; k < NK; k++) { BK[k * 3] = 1e9; }
    if (vv >= 4) {
      const iv = Math.min(11, Math.floor(vv));
      if (iv === 4) {
        const p = S.krog[0].p; BK[0] = p[0]; BK[1] = p[1]; BK[2] = p[2];
      } else if (iv <= 10) {
        const c = iv - 4;
        // pred prenosom: veriga 0..c-1 na tRNA c-1; po prenosu na tRNA c
        vrh(vezano(c - 1, sidro2), sidro);
        const xRp = S.xR;
        potVerige(sidro, xRp, 0);
        for (let m = 0; m < c; m++) naPolilinji((c - 1 - m) * LV, BK2, m * 3);
        vrh(S.trna[c].p, sidro);
        potVerige(sidro, xRp, 0);
        for (let m = 0; m < c; m++) {
          naPolilinji((c - m) * LV, BK, m * 3);
          for (let q = 0; q < 3; q++) BK[m * 3 + q] = lerp(BK2[m * 3 + q], BK[m * 3 + q], S.tau);
        }
        const p = S.krog[c].p; BK[c * 3] = p[0]; BK[c * 3 + 1] = p[1]; BK[c * 3 + 2] = p[2];
      } else {
        vrh(vezano(NK - 1, sidro2), sidro);
        potVerige(sidro, S.xR, 0);
        for (let m = 0; m < NK; m++) {
          naPolilinji((NK - 1 - m) * LV, BK2, m * 3);
          const f = (m * 2.39996);
          const fx = FOLD[0] + 0.07 * Math.cos(f) * Math.sin(m * 0.9 + 0.5), fy = FOLD[1] + 0.06 * Math.sin(m * 1.3) , fz = FOLD[2] + 0.07 * Math.sin(f);
          const t = S.prosta;
          // med odcepitvijo se veriga najprej izvleče, nato zvije
          const izv = ss(t / 0.5), zv = ss((t - 0.4) / 0.6);
          const ox = BK2[m * 3] - 0.08 * izv, oy = BK2[m * 3 + 1] + 0.04 * izv, oz = BK2[m * 3 + 2] + 0.14 * izv;
          BK[m * 3] = lerp(ox, fx, zv); BK[m * 3 + 1] = lerp(oy, fy, zv); BK[m * 3 + 2] = lerp(oz, fz, zv);
        }
      }
    }
    AZ.zacni();
    let nb = 0;
    for (let k = 0; k < NK; k++) {
      if (BK[k * 3] > 1e8) { mt.makeScale(0, 0, 0); kroglice.setMatrixAt(k, mt); continue; }
      let f = 1;
      if (vv >= 4 && vv < 11) { const c = Math.floor(vv) - 4; if (k === c) f = S.trna[k].f; }
      const fk = f * AK_VEL[k];
      mt.compose(vB.set(BK[k * 3], BK[k * 3 + 1], BK[k * 3 + 2]), qv.identity(), vS.set(fk, fk, fk));
      kroglice.setMatrixAt(k, mt);
      AZ.dodaj(AK[k].kr, BK[k * 3], BK[k * 3 + 1] + 0.055, BK[k * 3 + 2], f * (vv >= 11 ? 1 - ss((S.prosta - 0.6) / 0.3) : 1));
      nb++;
    }
    kroglice.visible = nb > 0;
    kroglice.instanceMatrix.needsUpdate = true;
    // peptidne vezi
    let nv = 0;
    const nVer = vv >= 11 ? NK : vv >= 5 ? Math.floor(vv) - 4 + (S.tau > 0.5 ? 1 : 0) : 0;
    for (let m = 0; m + 1 < nVer; m++) {
      const a = m * 3, b = (m + 1) * 3;
      palcka(vezi, nv++, BK[a], BK[a + 1], BK[a + 2], BK[b] - BK[a], BK[b + 1] - BK[a + 1], BK[b + 2] - BK[a + 2], 0.011);
    }
    vezi.count = nv; vezi.visible = nv > 0;
    vezi.instanceMatrix.needsUpdate = true;
    S.nVer = nVer;
    AZ.koncaj();
    CR.koncaj();
    // sij aktivnih delov
    const utrip = gibanje ? 0.7 + 0.3 * Math.sin(cas * 3.2) : 1;
    const ak = AKTIVNI[S.faza] || [];
    for (const [id, m, j] of SIJ) m.emissiveIntensity = ak.includes(id) ? j * utrip : 0;
    oz.g.visible = kazOznake;
    if (kazOznake) oz.posodobi();
  }

  // ---------- oznake ----------
  const zx = (sx, sy, d, out) => { out[0] = KAM_R.x * sx + KAM_G.x * sy + KAM_N.x * d; out[1] = KAM_R.y * sx + KAM_G.y * sy + KAM_N.y * d; out[2] = KAM_R.z * sx + KAM_G.z * sy + KAM_N.z * d; };
  const fazaV = () => Math.min(KONEC, Math.max(0, v));
  const kopiraj = (a, out, dx = 0, dy = 0, dz = 0) => { out[0] = a[0] + dx; out[1] = a[1] + dy; out[2] = a[2] + dz; };
  const odm = (t, dx, dy, out) => { out[0] = t[0] + KAM_R.x * dx + KAM_G.x * dy + KAM_N.x * 0.15; out[1] = t[1] + KAM_R.y * dx + KAM_G.y * dy + KAM_N.y * 0.15; out[2] = t[2] + KAM_R.z * dx + KAM_G.z * dy + KAM_N.z * 0.15; };
  const iz = (A, i, out) => { out[0] = A[i * 3]; out[1] = A[i * 3 + 1]; out[2] = A[i * 3 + 2]; };
  const oz = dinOznake(group, [
    { b: "jedro", o: { barva: "#9FE7EC", ozadje: "rgba(13,18,28,0.55)" }, crta: false, f: (p) => (zx(-0.84, 0.62, 0.1, p), true) },
    { b: "citoplazma", o: { barva: "#FFC9A8", ozadje: "rgba(13,18,28,0.55)" }, crta: false, f: (p) => (zx(0.66, -0.2, 0.3, p), true) },
    { b: "DNK", f: (p, t) => { zx(0.46, 0.9, 0.1, p); iz(KOD, 25, t); return true; } },
    { b: "promotor", o: { barva: "#FFE3A0" }, f: (p, t) => { zx(-0.74, 0.62, 0.25, p); t[0] = promotor.position.x - 0.02; t[1] = Y0 - 0.1; t[2] = 0.08; return fazaV() < 1.4; } },
    { b: "RNA-polimeraza", f: (p, t) => { kopiraj(S.pol, t, 0.0, 0.15, 0.05); odm(t, -0.22, 0.3, p); return S.polVid > 0.3; } },
    { b: "kodirajoča veriga", o: { barva: "#9FCBFF" }, f: (p, t) => { const i = Math.max(0, Math.min(NBP - 1, Math.round(S.p - 4))); iz(KOD, i, t); zx(-0.12, 1.04, 0.1, p); return fazaV() >= 0.8 && fazaV() < 2.6; } },
    { b: "matrična veriga", o: { barva: "#E2B8FF" }, f: (p, t) => { const i = Math.max(0, Math.min(NBP - 1, Math.round(S.p + 1))); iz(MAT, i, t); zx(0.52, 0.7, 0.1, p); return fazaV() >= 0.8 && fazaV() < 2.6; } },
    { b: "mRNA", o: { barva: "#FFB3CB" }, f: (p, t) => {
      const vv = fazaV();
      if (vv < 1.15) return false;
      if (vv < 3) { const j = Math.max(0, Math.min(NNT - 1, Math.floor((S.p - PREP0) * 0.35))); iz(MR, j, t); zx(-0.6, 0.3, 0.25, p); return true; }
      if (vv < 4) { const j = 14; iz(MR, j, t); zx(0.15, 0.32, 0.3, p); return true; }
      const j = NNT - 2; iz(MR, j, t); odm(t, 0.1, 0.24, p); return true;
    } },
    { b: "jedrna ovojnica", f: (p, t) => { t[0] = -0.3; t[1] = yOv(-0.3, OV_Z1); t[2] = OV_Z1; zx(-0.4, 0.13, 0.3, p); return fazaV() < 5; } }, // pri translaciji bi prekrila polipeptid
    { b: "jedrna pora", f: (p, t) => { t[0] = PORA[0]; t[1] = yP + 0.04; t[2] = PORA[2] + PR; zx(0.82, 0.32, 0.2, p); return true; } },
    { b: "mala podenota", o: { barva: "#FFE08A" }, f: (p, t) => { kopiraj(S.malaPos, t, -0.12, -0.06, 0.08); odm(t, -0.4, -0.3, p); return S.ribVid > 0 && fazaV() < 11.9; } },
    { b: "velika podenota", o: { barva: "#FFB59E" }, f: (p, t) => { kopiraj(S.velikaPos, t, -0.2, 0.08, 0.05); odm(t, -0.38, 0.17, p); return S.velVid > 0.5 && fazaV() < 11.9; } },
    { b: "tRNA", o: { barva: "#A8C8FF" }, f: (p, t) => { const k = fazaV() < 5 ? 0 : Math.min(NK - 1, Math.floor(fazaV()) - 4); const tr = S.trna[k]; if (!tr.vid || tr.f < 0.5 || fazaV() >= 11) return false; kopiraj(tr.p, t, -0.02, 0.14, 0); odm(t, 0.44, 0.08, p); return true; } },
    { b: "antikodon", f: (p, t) => { const k = fazaV() < 5 ? 0 : Math.min(NK - 1, Math.floor(fazaV()) - 4); const tr = S.trna[k]; if (!tr.vid || tr.f < 0.5 || fazaV() >= 11) return false; kopiraj(tr.p, t, D, 0.0, 0.04); odm(t, 0.42, -0.06, p); return true; } },
    { b: "kodon", o: { barva: "#B8CCFF" }, f: (p, t) => { if (!S.kodonVid || fazaV() >= 11.75) return false; t[0] = kodonX(S.kodonC); t[1] = YR - 0.02; t[2] = ZR + 0.05; odm(t, 0.3, -0.34, p); return true; } },
    { b: "aminokislina", f: (p, t) => { const vv = fazaV(); if (vv < 4.2 || vv >= 11) return false; const k = vv < 5 ? 0 : Math.floor(vv) - 4; if (BK[k * 3] > 1e8) return false; iz(BK, k, t); odm(t, 0.3, 0.14, p); return true; } },
    { b: "polipeptid", f: (p, t) => { if (S.nVer < 2) return false; iz(BK, 0, t); odm(t, -0.18, 0.28, p); return fazaV() < 11.6; } },
    { b: "sprostitveni dejavnik", o: { barva: "#C3CDE3" }, f: (p, t) => { if (S.sprostVid < 0.5) return false; kopiraj(S.sprost, t, 0, 0.17, 0); odm(t, 0.36, 0.2, p); return true; } },
    { b: "beljakovina", o: { barva: "#FFE3A0", krepko: true }, f: (p, t) => { if (fazaV() < 11.7) return false; kopiraj(FOLD, t); kopiraj(FOLD, p, 0.02, 0.2, 0.0); return true; } },
    { b: "E", o: { px: 11 }, crta: false, f: (p) => { if (!S.ribVid || S.velVid < 0.5 || fazaV() >= 11.7) return false; p[0] = S.xR - 4.5 * D; p[1] = YR - 0.2; p[2] = ZR + 0.16; return true; } },
    { b: "P", o: { px: 11 }, crta: false, f: (p) => { if (!S.ribVid || S.velVid < 0.5 || fazaV() >= 11.7) return false; p[0] = S.xR - 1.5 * D; p[1] = YR - 0.2; p[2] = ZR + 0.16; return true; } },
    { b: "A", o: { px: 11 }, crta: false, f: (p) => { if (!S.ribVid || S.velVid < 0.5 || fazaV() >= 11.7) return false; p[0] = S.xR + 1.5 * D; p[1] = YR - 0.2; p[2] = ZR + 0.16; return true; } },
  ]);

  // ---------- deli ----------
  const AKTIVNI = {
    vezava: ["rna-polimeraza", "promotor"], transkripcija: ["rna-polimeraza", "matricna-veriga", "mrna"], "konec-transkripcije": ["mrna"],
    izvoz: ["mrna", "jedrna-pora"], zacetek: ["mala-podenota", "trna"], podaljsevanje: ["trna", "velika-podenota"], konec: ["sprostitveni-dejavnik"], prosta: ["aminokisline"],
  };
  const SIJ = [
    ["rna-polimeraza", mPol, 0.5], ["matricna-veriga", mMat, 0.35], ["mrna", mMrna, 0.35], ["jedrna-pora", pora.material, 0.4],
    ["mala-podenota", mMala, 0.3], ["velika-podenota", mVelika, 0.3], ["trna", trna.material, 0.3], ["sprostitveni-dejavnik", sprost.material, 0.4], ["aminokisline", kroglice.material, 0.25],
  ];
  const tockaMr = () => { const j = fazaV() >= 4 ? NNT - 4 : 14; return [MR[j * 3], MR[j * 3 + 1], MR[j * 3 + 2]]; };
  const deli = [
    { id: "dnk", ime: "DNK", opis: "Dvojna vijačnica iz dveh verig nukleotidov, povezanih s pari baz A–T in G–C; tu je prikazan en kratek gen.", barva: "#63A9F5", meshes: [bazeDNK], get tocka() { return [xb(2), KOD[7], KOD[8]]; } },
    { id: "kodirajoca-veriga", ime: "Kodirajoča veriga", opis: "Veriga DNK, ki ima enako zaporedje kot mRNA, le da ima T namesto U.", barva: "#4DA3FF", meshes: [kodCev.mesh], get tocka() { const o = 20 * 3; return [KOD[o], KOD[o + 1], KOD[o + 2]]; } },
    { id: "matricna-veriga", ime: "Matrična veriga", opis: "Veriga DNK, ki jo RNA-polimeraza bere (od 3' proti 5') in po njej sestavi komplementarno mRNA.", barva: "#C77DFF", meshes: [matCev.mesh], get tocka() { const o = 20 * 3; return [MAT[o], MAT[o + 1], MAT[o + 2]]; } },
    { id: "promotor", ime: "Promotor", opis: "Odsek DNK pred genom, kamor se veže RNA-polimeraza; pove, kje se prepisovanje začne.", barva: "#FFD166", meshes: [promotor], tocka: [promotor.position.x, Y0 + 0.15, 0] },
    { id: "rna-polimeraza", ime: "RNA-polimeraza", opis: "Encim, ki razpre DNK, bere matrično verigo in povezuje nukleotide v mRNA.", barva: "#9D7BEA", meshes: [polMesh], get tocka() { return [S.pol[0], S.pol[1] + 0.17, S.pol[2]]; } },
    { id: "mrna", ime: "mRNA", opis: "Sporočilna RNA, prepis gena, ki nese navodilo iz jedra do ribosoma; model izpusti introne, kapo in rep poli-A, ki jih ima mRNA pri evkariontih.", barva: "#FF6B9A", meshes: [mrnaCev.mesh, bazeR], get tocka() { return tockaMr(); } },
    { id: "jedrna-ovojnica", ime: "Jedrna ovojnica", opis: "Dvojna membrana, ki loči jedro od citoplazme; ob porah se zunanja in notranja membrana zlijeta. Razmik med membranama je v modelu povečan.", barva: "#73C2C9", meshes: [ovZg, ovSp, ovRob, ovPora], tocka: [-0.3, yOv(-0.3, OV_Z1), OV_Z1] },
    { id: "jedrna-pora", ime: "Jedrna pora", opis: "Odprtina v jedrni ovojnici iz mnogih beljakovin, skozi katero mRNA zapusti jedro.", barva: "#5A8FD8", meshes: [pora], tocka: [PORA[0], yP + 0.04, PORA[2] + PR] },
    { id: "mala-podenota", ime: "Mala podenota ribosoma", opis: "Spodnji del ribosoma, ki se veže na mRNA in poišče začetni kodon AUG; model prikazuje le en ribosom, čeprav mRNA hkrati bere več ribosomov.", barva: "#F2C14E", meshes: [mala], get tocka() { return [S.malaPos[0], S.malaPos[1] - 0.05, S.malaPos[2] + 0.1]; } },
    { id: "velika-podenota", ime: "Velika podenota ribosoma", opis: "Zgornji del ribosoma z mesti A, P in E, kjer med aminokislinami nastajajo peptidne vezi; nastajajoča veriga zapusti ribosom skozi izstopni tunel (temnejša cev).", barva: "#E07A5F", meshes: [velika, tunel], get tocka() { return [S.velikaPos[0], S.velikaPos[1] + 0.12, S.velikaPos[2]]; } },
    { id: "trna", ime: "tRNA", opis: "Prenašalna RNA, zvita v obliko črke L: na koncu ene ročice nosi aminokislino, na koncu druge ima antikodon.", barva: "#6FA8FF", meshes: [trna], get tocka() { const t = S.trna.find((x) => x.vid) || S.trna[0]; return [t.p[0], t.p[1] + 0.18, t.p[2]]; } },
    { id: "antikodon", ime: "Antikodon", opis: "Tri baze na tRNA, ki se po pravilu A–U, G–C ujemajo s kodonom na mRNA; ker leži obrnjen (antiparalelno), ga pod kodonom beremo od 3' proti 5'.", barva: "#F7F2FF", meshes: [zanka], get tocka() { const t = S.trna.find((x) => x.vid) || S.trna[0]; return [t.p[0], t.p[1] + 0.02, t.p[2] + 0.04]; } },
    { id: "kodon", ime: "Kodon", opis: "Tri zaporedne baze na mRNA, ki določajo eno aminokislino ali konec (stop).", barva: "#6E9BFF", meshes: [kodonOkvir], get tocka() { return [kodonX(S.kodonC || 0), YR, ZR + 0.05]; } },
    { id: "aminokisline", ime: "Aminokislina", opis: "Gradnik beljakovin; v celicah je 20 vrst aminokislin, vsako določajo en ali več kodonov. V modelu ima vsaka svojo barvo in tričrkovno oznako, velikost kroglice pa nakazuje velikost njene stranske verige.", barva: "#E9C46A", meshes: [kroglice], get tocka() { for (let k = NK - 1; k >= 0; k--) if (BK[k * 3] < 1e8) return [BK[k * 3], BK[k * 3 + 1], BK[k * 3 + 2]]; return [0, YR + 0.4, ZR]; } },
    { id: "polipeptid", ime: "Polipeptid", opis: "Veriga aminokislin, povezanih s peptidnimi vezmi; ko se zvije, postane beljakovina.", barva: "#E8EDF7", meshes: [vezi], get tocka() { return BK[0] < 1e8 ? [BK[0], BK[1], BK[2]] : FOLD; } },
    { id: "sprostitveni-dejavnik", ime: "Sprostitveni dejavnik", opis: "Beljakovina, ki se veže na stop kodon in sprosti polipeptid z ribosoma.", barva: "#8E9AAF", meshes: [sprost], get tocka() { return [S.sprost[0], S.sprost[1] + 0.15, S.sprost[2]]; } },
  ];

  // ---------- besedila ----------
  const kodonStr = (c) => (c < NK ? AK[c].k : STOP);
  function stavek() {
    const vv = fazaV();
    if (vv >= KONEC) return "Polipeptid iz 7 aminokislin je prost; zvije se v beljakovino, ki v celici opravlja svoje delo.";
    const iv = Math.floor(vv);
    if (iv === 0) return "V jedru je DNK. RNA-polimeraza se veže na promotor pred genom in razpre dvojno vijačnico.";
    if (iv === 1) return "Transkripcija: RNA-polimeraza bere matrično verigo in gradi mRNA po pravilu A–U, T–A, G–C, C–G. mRNA ima enako zaporedje kot kodirajoča veriga, le U namesto T.";
    if (iv === 2) return "Na koncu gena se RNA-polimeraza odcepi in sprosti mRNA; DNK se spet zvije v vijačnico.";
    if (iv === 3) return "mRNA zapusti jedro skozi jedrno poro in pride v citoplazmo.";
    if (iv === 4) return "Začetek translacije: mala podenota se veže na mRNA in poišče začetni kodon AUG, tRNA z metioninom se veže na mesto P, nato se pridruži velika podenota.";
    if (iv <= 10) { const a = AK[iv - 4]; return `tRNA z antikodonom 3'-${a.ac}-5' prinese ${a.toz} (${a.kr}) na mesto A h kodonu ${a.k}. Nastane peptidna vez, nato se ribosom premakne za en kodon naprej.`; }
    return `Stop kodon ${STOP} na mestu A ne ustreza nobeni tRNA. Sprostitveni dejavnik sprosti polipeptid, podenoti ribosoma se ločita.`;
  }
  function zapis() {
    const vv = fazaV();
    if (vv < 4) {
      const n = vv < 1 ? 0 : vv < 2 ? Math.max(0, Math.min(NNT, Math.floor(S.p - PREP0 - 0.5) + 1)) : NNT;
      if (!n) return "Translacija se še ni začela.";
      let s = MRNA.slice(0, Math.min(UTR5, n));
      for (let c = 0; UTR5 + 3 * c < n; c++) s += " " + MRNA.slice(UTR5 + 3 * c, Math.min(n, UTR5 + 3 * c + 3));
      return `mRNA 5'→3': ${s}`;
    }
    const iv = Math.min(11, Math.floor(vv));
    if (vv >= 11) return `Kodon ${STOP} → stop (ni tRNA)`;
    const c = iv === 4 ? 0 : iv - 4;
    const a = AK[c];
    return `Kodon 5'-${a.k}-3' → antikodon 3'-${a.ac}-5' → ${a.kr} (${a.ime})`;
  }
  function veriga() {
    const vv = fazaV();
    if (vv < 4.2) return "še ni aminokislin";
    let n;
    if (vv < 5) n = 1;
    else if (vv < 11) n = Math.floor(vv) - 4 + (ss((vv - Math.floor(vv) - 0.35) / 0.2) > 0.5 ? 1 : 0);
    else n = NK;
    const s = AK.slice(0, n).map((a) => a.kr).join("–");
    return vv >= 11.5 ? `${s} (prosta veriga)` : s;
  }

  // Naprej/Nazaj: korak se odvije od začetka do konca (brez gibanja skoči na njegov izid)
  let doKonca = null;
  function pojdi(n) {
    n = Math.min(KONEC, Math.max(0, n));
    if (n >= KONEC) { nastavi(KONEC); return; }
    if (gibanje) { nastavi(n); if (!predvajaj) doKonca = n + 0.99; } else nastavi(n + 0.99);
  }
  function nastavi(x) {
    doKonca = null;
    v = Math.min(KONEC, Math.max(0, x));
    nKorak.vrednost = Math.round(v * 100) / 100;
    premor = 0;
    izrisi();
  }
  const nKorak = { tip: "drsnik", id: "korak", oznaka: "Korak", min: 0, max: KONEC, korak: 0.01, vrednost: v, ob: (x) => nastavi(Number(x)) };
  const nadzor = [
    nKorak,
    { tip: "gumb", id: "nazaj", oznaka: "Nazaj", ob: () => pojdi(Math.floor(v + 1e-6) - 1) },
    { tip: "gumb", id: "naprej", oznaka: "Naprej", ob: () => pojdi(Math.floor(v + 1e-6) + 1) },
    { tip: "stikalo", id: "predvajaj", oznaka: "Predvajaj", vrednost: predvajaj, ob: (x) => { predvajaj = !!x; doKonca = null; premor = 0; if (predvajaj && v >= KONEC) pojdi(0); } },
    { tip: "stikalo", id: "oznake", oznaka: "Oznake", vrednost: kazOznake, ob: (x) => { kazOznake = !!x; izrisi(); } },
    { tip: "izpis", id: "opis", oznaka: "Kaj se dogaja", vrednost: () => stavek() },
    { tip: "izpis", id: "kodon", oznaka: "Kodon → antikodon → aminokislina", vrednost: () => zapis() },
    { tip: "izpis", id: "veriga", oznaka: "Veriga", vrednost: () => veriga() },
  ];
  izrisi();

  // na seznamu in s točkami so le deli, ki so v trenutnem koraku vidni
  const VIDEN = {
    promotor: () => promotor.visible, "rna-polimeraza": () => S.polVid > 0.3, mrna: () => fazaV() >= 1.15,
    "mala-podenota": () => mala.visible, "velika-podenota": () => S.velVid > 0.5, trna: () => trna.visible, antikodon: () => trna.visible,
    kodon: () => kodonOkvir.visible, aminokisline: () => kroglice.visible, polipeptid: () => vezi.visible, "sprostitveni-dejavnik": () => S.sprostVid > 0.3,
  };
  let deliKljuc = "", deliSeznam = deli;
  return {
    group,
    get deli() {
      const vid = deli.filter((d) => !VIDEN[d.id] || VIDEN[d.id]()), kljuc = vid.map((d) => d.id).join(",");
      if (kljuc !== deliKljuc) { deliKljuc = kljuc; deliSeznam = vid; }
      return deliSeznam;
    },
    nadzor,
    merilo: () => null,
    korak(t, dt) {
      const d = Math.min(0.1, Math.max(0, dt || 0));
      if (gibanje) cas += d;
      if (predvajaj && !gibanje) {
        // brez gibanja: vsake 3 s skok na izid naslednjega koraka
        premor += d;
        if (premor > 3) pojdi(v >= KONEC ? 0 : Math.floor(v + 1e-6) + 1);
      } else if (predvajaj || doKonca !== null) {
        if (predvajaj && v >= KONEC) { premor += d; if (premor > 3) nastavi(0); }
        else {
          const meja = predvajaj ? KONEC : doKonca, dk = doKonca;
          v = Math.min(meja, v + d / TRAJANJE[Math.min(TRAJANJE.length - 1, Math.floor(v))]);
          nKorak.vrednost = Math.round(v * 100) / 100;
          doKonca = v >= meja ? null : dk;
        }
      }
      izrisi();
    },
    dispose() {
      group.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
      for (const x of viri) x.dispose?.();
      viri.clear();
    },
  };
}
