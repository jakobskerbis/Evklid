// Fotosinteza: kloroplast, tilakoidna membrana in Calvinov cikel, korak za korakom (pogodba v docs/3d.md).
// Molekule so napisne značke (InstancedMesh, obrnjene proti kameri v senčilniku), ki tečejo po vnaprej izračunanih poteh.

export const info = {
  id: "fotosinteza",
  naslov: "Fotosinteza",
  podrocje: "procesi",
  predmet: "BIO",
  opis: "Kako rastlina s svetlobo iz CO₂ in vode naredi sladkor in kisik: kloroplast, svetlobne reakcije na tilakoidni membrani in Calvinov cikel, korak za korakom.",
  merilo: { m: 6e-6, oznaka: "6 µm" },
};

const PISAVA = '"Instrument Sans", system-ui, sans-serif';
const K_PX = (2 * Math.tan(Math.PI / 9)) / 800; // velikost sprita na zaslonsko piko (fov 40°, višina 800 px)
const KORAKOV = 6;
const ENACBA = "6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂ (svetloba, klorofil)";

function nakljucje(seme) {
  let a = seme >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function zgradi(THREE, ctx = {}) {
  const nizka = ctx.kakovost === "nizka";
  const gibanje = ctx.gibanje !== false;
  const zacetek = ctx.zacetek || {};
  const viri = new Set();
  const h = (x) => (viri.add(x), x);
  const group = new THREE.Group();
  group.name = "fotosinteza";
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
  // Oznake s črtami: [besedilo, položaj napisa, točka na delu | null, možnosti]
  function oznake(stars, seznam) {
    const g = new THREE.Group();
    const crte = [];
    for (const [b, p, t, o] of seznam) {
      const s = napis(b, o);
      s.position.set(p[0], p[1], p[2]);
      g.add(s);
      if (t) {
        const d = Math.hypot(p[0], p[1], p[2]), f = d > 0.985 ? 0.985 / d : 1; // črta ostane v enotski krogli
        crte.push(p[0] * f, p[1] * f, p[2] * f, t[0], t[1], t[2]);
      }
    }
    if (crte.length) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(crte, 3));
      const l = new THREE.LineSegments(geo, h(new THREE.LineBasicMaterial({ color: 0xc3cde3, transparent: true, opacity: 0.55, depthWrite: false })));
      l.renderOrder = 29;
      g.add(l);
    }
    stars.add(g);
    return g;
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
  function sijaj(barva) {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,240,1)"); gr.addColorStop(0.25, barva); gr.addColorStop(1, "rgba(255,220,80,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return { tex: tekstura(c), razmerje: 1 };
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

  // Tokovi molekul za en pogled: vsaka vrsta ima svoj InstancedMesh.
  function tokovi(stars, vrste) {
    const m = {};
    for (const [k, t] of Object.entries(vrste)) {
      const z = t.sij ? sijaj(t.barva) : znacka(t.b, t.barva, t.crnilo);
      const mesh = new THREE.InstancedMesh(h(new THREE.PlaneGeometry(z.razmerje, 1)), znackaMat(z.tex, t.sij), t.n || 40);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.count = 0; mesh.visible = false; mesh.frustumCulled = false; mesh.renderOrder = 25;
      mesh.onBeforeRender = merilniZaslon;
      stars.add(mesh);
      m[k] = { mesh, n: 0, s: (t.px || 17) * K_PX, max: t.n || 40 };
    }
    const p = [0, 0, 0];
    function zapisi(k, s, f, nihaj) {
      const e = m[k];
      if (!e || e.n >= e.max || f <= 0.001) return;
      const a = e.mesh.instanceMatrix.array, o = e.n * 16, sc = e.s * Math.min(1, f);
      a[o] = sc; a[o + 5] = sc; a[o + 10] = sc;
      a[o + 12] = p[0] + (nihaj ? nihaj[0] : 0); a[o + 13] = p[1] + (nihaj ? nihaj[1] : 0); a[o + 14] = p[2] + (nihaj ? nihaj[2] : 0);
      e.n++;
    }
    const nih = [0, 0, 0];
    function posodobi(spec, u, cas) {
      for (const k in m) m[k].n = 0;
      for (const d of spec) {
        if (d.n) {
          for (let i = 0; i < d.n; i++) {
            let s = (u * (d.hit || 1) + i / d.n + (d.faza || 0)) % 1;
            if (s < 0) s += 1;
            naPoti(d.pot, s, p);
            zapisi(d.tip, s, Math.min(s, 1 - s) / 0.07, null);
          }
        } else if (d.tocka) {
          p[0] = d.tocka[0]; p[1] = d.tocka[1]; p[2] = d.tocka[2];
          const q = d.faza || 0;
          nih[0] = 0.018 * Math.sin(cas * 1.7 + q * 7.1); nih[1] = 0.012 * Math.sin(cas * 2.3 + q * 3.3); nih[2] = 0.018 * Math.cos(cas * 1.3 + q * 5.7);
          zapisi(d.tip, 0, 1, nih);
        } else {
          if (u < d.od || u >= d.do) continue;
          let s = (u - d.zac) / (d.kon - d.zac);
          s = Math.min(1, Math.max(0, s));
          if (!d.lin) s = s * s * (3 - 2 * s);
          naPoti(d.pot, s, p);
          const fi = d.od <= 0 ? 1 : (u - d.od) / 0.02, fo = d.do >= 1 ? 1 : (d.do - u) / 0.02;
          zapisi(d.tip, s, Math.min(fi, fo), null);
        }
      }
      for (const k in m) {
        const e = m[k];
        e.mesh.count = e.n; e.mesh.visible = e.n > 0;
        e.mesh.instanceMatrix.needsUpdate = true;
      }
    }
    return { posodobi };
  }
  const tok = (tip, p, n, o = {}) => ({ tip, pot: p, n, ...o });
  const let_ = (tip, p, zac, kon, od = zac, do_ = kon, lin = false) => ({ tip, pot: p, zac, kon, od, do: do_, lin });

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

  // ---------- stanje ----------
  let pogled = ["kloroplast", "tilakoida", "calvin"].includes(zacetek.pogled) ? zacetek.pogled : "kloroplast";
  let k = Math.round(Number(zacetek.korak));
  if (!(k >= 1 && k <= KORAKOV)) k = 1;
  let predvajaj = zacetek.predvajaj !== undefined ? !!zacetek.predvajaj : false;
  let kazOznake = zacetek.oznake !== undefined ? !!zacetek.oznake : true;
  let cas = 0, ucas = 0, odKoraka = 0;

  const pogledi = {};

  // =====================================================================
  // 1) KLOROPLAST
  // =====================================================================
  {
    const G = new THREE.Group();
    group.add(G);
    const A = [0.9, 0.34, 0.55];
    const rnd = nakljucje(7);
    const nA = nizka ? 40 : 72, nB = nizka ? 30 : 54;
    // točka na ovojnici v globini d pod površjem (zamik vzdolž normale, zato je debelina plasti povsod enaka)
    const tocka = (d, a, b, out) => {
      const w = 1 + 0.012 * Math.sin(a * 6 + b * 2) * Math.sin(a);
      const x = A[0] * w * Math.cos(a), y = A[1] * w * Math.sin(a) * Math.cos(b), z = A[2] * w * Math.sin(a) * Math.sin(b);
      const nx = x / (A[0] * A[0]), ny = y / (A[1] * A[1]), nz = z / (A[2] * A[2]), l = Math.hypot(nx, ny, nz) || 1;
      out[0] = x - (d * nx) / l; out[1] = y - (d * ny) / l; out[2] = z - (d * nz) / l;
    };
    const t3 = [0, 0, 0];
    function lupina(r, b0, b1) {
      const pos = [], nor = [], idx = [];
      for (let i = 0; i <= nA; i++) {
        const a = (i / nA) * Math.PI;
        for (let j = 0; j <= nB; j++) {
          const b = b0 + ((b1 - b0) * j) / nB;
          tocka(r, a, b, t3);
          pos.push(t3[0], t3[1], t3[2]);
          const n = V(t3[0] / (A[0] * A[0]), t3[1] / (A[1] * A[1]), t3[2] / (A[2] * A[2]));
          if (i === 0) n.set(1, 0, 0);
          if (i === nA) n.set(-1, 0, 0);
          n.normalize();
          nor.push(n.x, n.y, n.z);
        }
      }
      for (let i = 0; i < nA; i++) for (let j = 0; j < nB; j++) {
        const a = i * (nB + 1) + j, b = a + nB + 1;
        idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
      g.setIndex(idx);
      return g;
    }
    function pasovi(r0, r1, bete) {
      const pos = [], idx = [];
      let o = 0;
      for (const b of bete) {
        for (let i = 0; i <= nA; i++) {
          const a = (i / nA) * Math.PI;
          tocka(r0, a, b, t3); pos.push(...t3);
          tocka(r1, a, b, t3); pos.push(...t3);
        }
        for (let i = 0; i < nA; i++) { const q = o + i * 2; idx.push(q, q + 1, q + 2, q + 1, q + 3, q + 2); }
        o += (nA + 1) * 2;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    }
    const P2 = Math.PI / 2 + 0.3, P3 = 2 * Math.PI - 0.12, E = 0.17;
    const mZun = fiz("#4FA64C", { roughness: 0.36, clearcoat: 0.8, sheen: 0.15, emissive: "#9be37a", emissiveIntensity: 0 });
    const mZunRob = fiz("#78C76A", { side: THREE.DoubleSide, roughness: 0.5, emissive: "#9be37a", emissiveIntensity: 0 });
    const mNot = fiz("#93C95A", { roughness: 0.4, clearcoat: 0.6, sheen: 0.15, emissive: "#d6f59a", emissiveIntensity: 0 });
    const mNotRob = fiz("#BFE07E", { side: THREE.DoubleSide, roughness: 0.5, emissive: "#d6f59a", emissiveIntensity: 0 });
    const mStroma = fiz("#B9D488", { side: THREE.BackSide, roughness: 0.75, clearcoat: 0.1, sheen: 0.0, emissive: "#e8f5b0", emissiveIntensity: 0 });
    // globine pod površjem: zunanja membrana 0–0,011, medmembranski prostor, notranja membrana 0,022–0,033
    const Z0 = 0, Z1 = 0.011, N0 = 0.022, N1 = 0.033;
    const zun = new THREE.Mesh(lupina(Z0, P2, P3), mZun);
    const zunRob = new THREE.Mesh(pasovi(Z1, Z0, [P2, P3]), mZunRob);
    const not = new THREE.Mesh(lupina(N0, P2 - E, P3 + E), mNot);
    const notRob = new THREE.Mesh(pasovi(N1, N0, [P2 - E, P3 + E]), mNotRob);
    const stromaStena = new THREE.Mesh(lupina(N1 + 0.001, P2 - E, P3 + E), mStroma);
    G.add(zun, zunRob, not, notRob, stromaStena);
    zun.onBeforeRender = merilniZaslon;

    // rezervirana mesta (Calvinov cikel, škrob, DNK)
    const CK = [0.3, 0.05, 0.3];
    const SKROB = [[0.47, -0.07, 0.2], [-0.5, 0.0, -0.18], [0.04, -0.13, -0.3]];
    const DNK = [[-0.32, 0.03, 0.25], [0.3, 0.13, -0.24], [-0.6, -0.05, 0.08]];
    const rez = [[CK, 0.17], ...SKROB.map((p) => [p, 0.14]), ...DNK.map((p) => [p, 0.09])];
    const znotraj = (x, y, z, f) => (x / (A[0] * f)) ** 2 + (y / (A[1] * f)) ** 2 + (z / (A[2] * f)) ** 2 < 1;

    // grana
    const grana = [];
    const DEB = 0.0105, RAZ = 0.0148;
    for (let p = 0; p < 6000 && grana.length < (nizka ? 22 : 28); p++) {
      const x = (rnd() * 2 - 1) * 0.68, z = (rnd() * 2 - 1) * 0.42, y = (rnd() * 2 - 1) * 0.11;
      const n = 5 + Math.floor(rnd() * 5), r = 0.068 + rnd() * 0.022, v = n * RAZ;
      let ok = true;
      for (let q = 0; q < 8 && ok; q++) {
        const f = (q / 8) * Math.PI * 2;
        for (const sg of [-1, 1]) if (!znotraj(x + r * Math.cos(f), y + (sg * v) / 2, z + r * Math.sin(f), 0.9)) ok = false;
      }
      for (const [c, rr] of rez) if (Math.hypot(x - c[0], (y - c[1]) * 0.7, z - c[2]) < r + rr) ok = false;
      for (const o of grana) {
        if (Math.abs(o.y - y) < (o.v + v) / 2 + 0.03 && Math.hypot(o.x - x, o.z - z) < o.r + r + 0.04) ok = false;
      }
      if (ok) grana.push({ x, y, z, n, r, v });
    }
    // izpostavljeno granum v izrezu (spredaj zgoraj)
    let gi = 0;
    grana.forEach((g, i) => { const s = g.z + g.y * 0.8 - Math.abs(g.x - 0.0) * 0.4; if (s > grana[gi].z + grana[gi].y * 0.8 - Math.abs(grana[gi].x) * 0.4) gi = i; });
    const vidna = grana.map((g, i) => [g.z * 1.0 + g.y * 0.6 - Math.abs(g.x) * 0.15, i]).sort((a, b) => b[0] - a[0]).slice(0, 5).map(([, i]) => grana[i]);

    const prof = [V(0, 0.5, 0)];
    const nr = nizka ? 3 : 5;
    for (let i = 0; i <= nr; i++) { const f = Math.PI / 2 - (i / nr) * Math.PI; prof.push(V(0.9 + 0.1 * Math.cos(f), 0.5 * Math.sin(f), 0)); }
    prof.push(V(0, -0.5, 0));
    const diskGeo = h(new THREE.LatheGeometry(prof.map((p) => new THREE.Vector2(p.x, p.y)).reverse(), nizka ? 12 : 22));
    const mDisk = fiz("#ffffff", { roughness: 0.5, clearcoat: 0.45, sheen: 0, emissive: "#58e06a", emissiveIntensity: 0 });
    const mDisk2 = fiz("#ffffff", { roughness: 0.5, clearcoat: 0.45, sheen: 0, emissive: "#58e06a", emissiveIntensity: 0 });
    let nDisk = 0, nDisk2 = 0;
    for (const [i, g] of grana.entries()) (i === gi ? (nDisk2 += g.n) : (nDisk += g.n));
    const diski = new THREE.InstancedMesh(diskGeo, mDisk, nDisk);
    // izpostavljeno granum je prerezano: manjka klin proti privzeti kameri (azimut 35°), v prerezu se vidita membrana in lumen
    const KLIN = (100 * Math.PI) / 180, FI0 = 0.611 + KLIN / 2;
    const diskGeo2 = h(new THREE.LatheGeometry(prof.map((p) => new THREE.Vector2(p.x, p.y)).reverse(), nizka ? 10 : 18, FI0, 2 * Math.PI - KLIN));
    const notr = [V(0, 0.3, 0)];
    for (let i = 0; i <= nr; i++) { const f = Math.PI / 2 - (i / nr) * Math.PI; notr.push(V(0.9 + 0.074 * Math.cos(f), 0.3 * Math.sin(f), 0)); }
    notr.push(V(0, -0.3, 0));
    const pPos = [], pBar = [], pIdx = [];
    const cMem = new THREE.Color("#72D282"), cLum = new THREE.Color("#7FA2EC");
    for (const fi of [FI0, FI0 + 2 * Math.PI - KLIN]) {
      const sn = Math.sin(fi), cs = Math.cos(fi), o = pPos.length / 3, M = prof.length;
      const tk = (p, c) => { pPos.push(p.x * sn, p.y, p.x * cs); pBar.push(c.r, c.g, c.b); };
      for (const p of prof) tk(p, cMem);
      for (const p of notr) tk(p, cMem);
      for (const p of notr) tk(p, cLum);
      tk(V(0, 0, 0), cLum);
      for (let i = 0; i < M - 1; i++) {
        pIdx.push(o + i, o + i + 1, o + M + i + 1, o + i, o + M + i + 1, o + M + i);
        pIdx.push(o + 3 * M, o + 2 * M + i, o + 2 * M + i + 1);
      }
    }
    const prerezGeo = h(new THREE.BufferGeometry());
    prerezGeo.setAttribute("position", new THREE.Float32BufferAttribute(pPos, 3));
    prerezGeo.setAttribute("color", new THREE.Float32BufferAttribute(pBar, 3));
    prerezGeo.setIndex(pIdx);
    prerezGeo.computeVertexNormals();
    const diski2 = new THREE.InstancedMesh(diskGeo2, mDisk2, nDisk2);
    const prerez = new THREE.InstancedMesh(prerezGeo, fiz("#ffffff", { vertexColors: true, side: THREE.DoubleSide, roughness: 0.55, clearcoat: 0.3, sheen: 0, emissive: "#58e06a", emissiveIntensity: 0 }), nDisk2);
    const mt = new THREE.Matrix4(), q0 = new THREE.Quaternion(), sv = V(1, 1, 1), pv = V(0, 0, 0), barva = new THREE.Color();
    let a1 = 0, a2 = 0;
    const zeleni = ["#1F7A34", "#24873A", "#1A6E2E", "#2A9441"];
    for (const [i, g] of grana.entries()) {
      for (let d = 0; d < g.n; d++) {
        const yy = g.y - g.v / 2 + (d + 0.5) * RAZ, rr = g.r * (1 - 0.05 * rnd());
        mt.compose(pv.set(g.x, yy, g.z), q0, sv.set(rr, DEB, rr));
        barva.set(zeleni[Math.floor(rnd() * zeleni.length)]);
        if (i === gi) { prerez.setMatrixAt(a2, mt); diski2.setMatrixAt(a2, mt); diski2.setColorAt(a2++, barva.offsetHSL(0, 0.05, 0.04)); } else { diski.setMatrixAt(a1, mt); diski.setColorAt(a1++, barva); }
      }
    }
    G.add(diski, diski2, prerez);

    // lamele (stromalne tilakoide) med sosednjimi grani
    const pari = new Set(), lamM = [];
    for (const [i, g] of grana.entries()) {
      const sos = grana.map((o, j) => [Math.hypot(o.x - g.x, (o.y - g.y) * 1.5, o.z - g.z), j]).filter(([d, j]) => j !== i && d < 0.36).sort((a, b) => a[0] - b[0]).slice(0, 2);
      for (const [, j] of sos) {
        const kl = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (pari.has(kl)) continue;
        pari.add(kl);
        const o = grana[j];
        for (let s = 0; s < 2; s++) {
          const ya = g.y - g.v / 2 + (Math.floor(rnd() * g.n) + 0.5) * RAZ, yb = o.y - o.v / 2 + (Math.floor(rnd() * o.n) + 0.5) * RAZ;
          const smer = V(o.x - g.x, 0, o.z - g.z).normalize();
          const p1 = V(g.x, ya, g.z).addScaledVector(smer, g.r * 0.9), p2 = V(o.x, yb, o.z).addScaledVector(smer, -o.r * 0.9);
          const d = p2.clone().sub(p1), L = d.length();
          const q = new THREE.Quaternion().setFromUnitVectors(V(1, 0, 0), d.normalize());
          lamM.push(new THREE.Matrix4().compose(p1.add(p2).multiplyScalar(0.5), q, V(L, 0.0065, 0.03 + rnd() * 0.012)));
        }
      }
    }
    const lamele = new THREE.InstancedMesh(h(new THREE.BoxGeometry(1, 1, 1)), fiz("#2F9A45", { roughness: 0.5, sheen: 0, emissive: "#58e06a", emissiveIntensity: 0 }), Math.max(1, lamM.length));
    lamM.forEach((m, i) => lamele.setMatrixAt(i, m));
    lamele.count = lamM.length;
    G.add(lamele);

    // ribosomi
    const vGranumu = (x, y, z, m) => grana.some((g) => Math.abs(y - g.y) < g.v / 2 + m && Math.hypot(x - g.x, z - g.z) < g.r + m);
    const ribP = [];
    for (let p = 0; p < 5000 && ribP.length < (nizka ? 80 : 130); p++) {
      const x = (rnd() * 2 - 1) * 0.8, y = (rnd() * 2 - 1) * 0.3, z = (rnd() * 2 - 1) * 0.5;
      if (!znotraj(x, y, z, 0.88) || vGranumu(x, y, z, 0.02)) continue;
      if (rez.some(([c, rr]) => Math.hypot(x - c[0], y - c[1], z - c[2]) < rr * 0.8)) continue;
      ribP.push([x, y, z]);
    }
    const ribosomi = new THREE.InstancedMesh(h(new THREE.IcosahedronGeometry(0.0085, nizka ? 0 : 1)), fiz("#5E4FA8", { roughness: 0.55, clearcoat: 0.3, sheen: 0, emissive: "#a58cff", emissiveIntensity: 0 }), ribP.length);
    ribP.forEach((p, i) => { mt.makeTranslation(p[0], p[1], p[2]); ribosomi.setMatrixAt(i, mt); });
    G.add(ribosomi);

    // drobci v stromi (encimi)
    const tP = [];
    for (let p = 0; p < 20000 && tP.length < (nizka ? 600 : 1300) * 3; p++) {
      const x = (rnd() * 2 - 1) * 0.8, y = (rnd() * 2 - 1) * 0.3, z = (rnd() * 2 - 1) * 0.5;
      if (znotraj(x, y, z, 0.9) && !vGranumu(x, y, z, 0.005)) tP.push(x, y, z);
    }
    const tgeo = new THREE.BufferGeometry();
    tgeo.setAttribute("position", new THREE.Float32BufferAttribute(tP, 3));
    const drobci = new THREE.Points(tgeo, h(new THREE.PointsMaterial({ color: "#EAF6C8", size: 0.0055, transparent: true, opacity: 0.6, depthWrite: false })));
    G.add(drobci);

    // kloroplastna DNK (krožne molekule v nukleoidih)
    const dnkG = [];
    for (const c of DNK) {
      const t = [];
      const nn = 12;
      for (let i = 0; i < nn; i++) {
        const f = (i / nn) * Math.PI * 2, r = 0.045 + rnd() * 0.035;
        t.push(V(c[0] + r * Math.cos(f), c[1] + (rnd() - 0.5) * 0.06, c[2] + r * Math.sin(f) * 0.8));
      }
      dnkG.push([new THREE.TubeGeometry(new THREE.CatmullRomCurve3(t, true), nizka ? 70 : 140, 0.0042, nizka ? 4 : 6, true), null]);
    }
    const dnk = new THREE.Mesh(zdruzi(dnkG), fiz("#F08A5D", { roughness: 0.4, emissive: "#ffb08a", emissiveIntensity: 0 }));
    G.add(dnk);

    // škrobna zrna
    const skrob = new THREE.InstancedMesh(h(new THREE.SphereGeometry(1, nizka ? 18 : 30, nizka ? 12 : 20)), fiz("#F2E9D0", { roughness: 0.62, clearcoat: 0.25, sheen: 0.3, emissive: "#fff3cf", emissiveIntensity: 0 }), 3);
    SKROB.forEach((p, i) => {
      mt.compose(pv.set(...p), q0.setFromEuler(new THREE.Euler(0.2 * i, 0.9 * i + 0.3, 0.1)), sv.set(0.105 - 0.012 * i, 0.06, 0.08));
      skrob.setMatrixAt(i, mt);
    });
    q0.identity();
    G.add(skrob);

    // oznaka Calvinovega cikla v stromi (obroč s puščico)
    const calvin = new THREE.Group();
    calvin.position.set(...CK);
    calvin.rotation.set(-0.9, 0.3, 0);
    const mCalvin = fiz("#FFD166", { roughness: 0.3, emissive: "#ffcf5a", emissiveIntensity: 0.35 });
    const obroc = new THREE.Mesh(h(new THREE.TorusGeometry(0.085, 0.011, 10, 48, Math.PI * 1.65)), mCalvin);
    const konica = new THREE.Mesh(h(new THREE.ConeGeometry(0.025, 0.05, 12)), mCalvin);
    konica.position.set(0.085, 0, 0); konica.rotation.z = Math.PI;
    calvin.add(obroc, konica);
    G.add(calvin);

    // snop svetlobe
    const sc = document.createElement("canvas");
    sc.width = 4; sc.height = 128;
    const sg = sc.getContext("2d");
    const sgr = sg.createLinearGradient(0, 0, 0, 128);
    sgr.addColorStop(0, "rgba(255,236,150,0.0)"); sgr.addColorStop(0.3, "rgba(255,236,150,0.16)"); sgr.addColorStop(0.85, "rgba(255,236,150,0.12)"); sgr.addColorStop(1, "rgba(255,236,150,0.0)");
    sg.fillStyle = sgr; sg.fillRect(0, 0, 4, 128);
    const S0 = V(-0.27, 0.8, 0.3), S1 = V(0.02, 0.24, 0.12);
    const snopGeo = h(new THREE.CylinderGeometry(0.17, 0.2, S0.distanceTo(S1), 32, 1, true));
    const snop = new THREE.Mesh(snopGeo, h(new THREE.MeshBasicMaterial({ map: tekstura(sc), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })));
    snop.position.copy(S0).add(S1).multiplyScalar(0.5);
    snop.quaternion.setFromUnitVectors(V(0, 1, 0), S0.clone().sub(S1).normalize());
    snop.renderOrder = 20;
    G.add(snop);

    // poti molekul
    const vrh = (g) => [g.x, g.y + g.v / 2 + 0.01, g.z];
    const bok = (g, f) => [g.x + Math.cos(f) * (g.r + 0.012), g.y, g.z + Math.sin(f) * (g.r + 0.012)];
    const [g1, g2, g3, g4] = vidna;
    const pSvet = vidna.slice(0, 4).map((g, i) => pot([[S0.x + 0.06 * i - 0.08, S0.y, S0.z + 0.04 * i], [g.x * 0.5 - 0.1, 0.5, g.z * 0.5 + 0.15], vrh(g)], 24));
    const pVoda = [g1, g2, g3].map((g, i) => pot([[-0.95, 0.12 + 0.08 * i, 0.22 - 0.05 * i], [-0.6, 0.18, 0.4 - 0.05 * i], [(g.x - 0.6) / 2, g.y + 0.08, g.z + 0.06], bok(g, Math.PI * 0.9)]));
    const pKisik = [g1, g2, g3].map((g, i) => pot([bok(g, 0.3), [g.x + 0.15, 0.3, g.z + 0.15], [0.35 + 0.1 * i, 0.62, 0.45], [0.42 + 0.08 * i, 0.78, 0.4 - 0.08 * i]]));
    const zaCikel = grana.filter((g) => { const d = Math.hypot(g.x - CK[0], g.z - CK[2]); return d > 0.24 && d < 0.55 && g.z + g.y > -0.05; }).sort((p, q) => q.z + q.y * 0.6 - (p.z + p.y * 0.6)).slice(0, 4);
    while (zaCikel.length < 4) zaCikel.push(vidna[zaCikel.length]);
    const pVCikel = zaCikel.map((g) => pot([bok(g, Math.atan2(CK[2] - g.z, CK[0] - g.x)), [(g.x + CK[0]) / 2, Math.max(g.y, CK[1]) + 0.06, (g.z + CK[2]) / 2 + 0.03], CK]));
    const pIzCikla = zaCikel.slice(0, 2).map((g) => pot([CK, [(g.x + CK[0]) / 2, Math.min(g.y, CK[1]) - 0.04, (g.z + CK[2]) / 2 + 0.05], bok(g, Math.atan2(CK[2] - g.z, CK[0] - g.x) + 0.6)]));
    const pCO2 = [0, 1].map((i) => pot([[0.82 - 0.12 * i, 0.5 + 0.06 * i, 0.3 + 0.05 * i], [0.5, 0.3, 0.42 - 0.06 * i], [CK[0] + 0.07, CK[1] + 0.03, CK[2] + 0.02]]));
    const pSladkor = pot([CK, [0.32, 0.03, 0.3], [SKROB[0][0] - 0.08, SKROB[0][1] + 0.06, SKROB[0][2] + 0.03]]);
    const pVen = pot([CK, [0.45, 0.1, 0.38], [0.86, 0.1, 0.42]]);

    const vrste = {
      svet: { sij: true, barva: "rgba(255,226,110,0.9)", px: 26, n: 30 },
      h2o: { b: "H₂O", barva: "#62C3F7" },
      o2: { b: "O₂", barva: "#FF8A80" },
      atp: { b: "ATP", barva: "#FFD166" },
      nadph: { b: "NADPH", barva: "#C3A2FF" },
      adp: { b: "ADP", barva: "#C8B47A" },
      nadp: { b: "NADP⁺", barva: "#9C8CC8" },
      co2: { b: "CO₂", barva: "#CFD5DE" },
      g3p: { b: "G3P", barva: "#FF9EC4" },
      glu: { b: "glukoza", barva: "#F6E7C1" },
    };
    const T = tokovi(G, vrste);
    const koraki = [
      { s: "Kloroplast je organel v celicah listov. Obdajata ga zunanja in notranja membrana, v notranjosti sta stroma in tilakoide, zložene v grana.", a: [], d: [] },
      { s: "Svetloba pade na kloroplast. Klorofil v membranah tilakoid jo vpije; to sproži svetlobne reakcije.", a: ["tilakoide", "granum"], d: pSvet.map((p, i) => tok("svet", p, 4, { faza: i * 0.13, hit: 2 })), snop: 1 },
      { s: "V tilakoidah se z energijo svetlobe razcepi voda. Nastane kisik (O₂), ki odide iz kloroplasta in nato iz lista.", a: ["tilakoide", "granum"], d: [...pSvet.slice(0, 2).map((p, i) => tok("svet", p, 2, { faza: i * 0.2, hit: 2 })), ...pVoda.map((p, i) => tok("h2o", p, 3, { faza: i * 0.1 })), ...pKisik.map((p, i) => tok("o2", p, 2, { faza: i * 0.17 + 0.3 }))], snop: 0.5 },
      { s: "Na tilakoidah nastaneta ATP in NADPH. Odpotujeta v stromo do Calvinovega cikla, ADP in NADP⁺ pa se vrneta po novo energijo.", a: ["tilakoide", "granum"], d: [...pVCikel.map((p, i) => tok(i % 2 ? "nadph" : "atp", p, 2, { faza: i * 0.13 })), tok("adp", pIzCikla[0], 2, { faza: 0.2 }), tok("nadp", pIzCikla[1], 2, { faza: 0.6 })], cikel: 1 },
      { s: "V stromi Calvinov cikel z energijo ATP in NADPH veže CO₂ iz zraka; nastane sladkor G3P.", a: ["stroma"], d: [...pCO2.map((p, i) => tok("co2", p, 3, { faza: i * 0.16 })), tok("atp", pVCikel[0], 2), tok("nadph", pVCikel[1], 2, { faza: 0.3 }), tok("g3p", pSladkor, 2, { faza: 0.1 })], cikel: 1 },
      { s: "Iz G3P nastanejo glukoza in drugi sladkorji. Del se shrani kot škrob v škrobnih zrnih, del odide iz kloroplasta v celico.", a: ["skrobna-zrna"], d: [tok("glu", pSladkor, 3, { faza: 0.1 }), tok("glu", pVen, 2, { faza: 0.5 }), ...pCO2.slice(0, 1).map((p) => tok("co2", p, 2))], cikel: 1 },
    ];
    const gTop = grana[gi];
    const tZun = [0, 0, 0], tNot = [0, 0, 0], tStr = [0, 0, 0];
    tocka(Z0, Math.PI * 0.3, P2 + 0.6, tZun);
    tocka(N0, Math.PI * 0.68, P2 - E / 2, tNot);
    tocka(N1 + 0.001, Math.PI * 0.36, Math.PI * 1.5 + 0.5, tStr);
    const tTil = [g2.x + g2.r * 0.6, g2.y + g2.v / 2 - 0.004, g2.z];
    const tLam = lamM.length ? lamM.reduce((b, m) => (m.elements[14] + m.elements[13] > b[2] + b[1] ? m.elements.slice(12, 15) : b), [0, -1, -1]) : [0, 0, 0];
    const tRib = ribP.reduce((b, p) => (p[2] + p[1] * 0.5 > b[2] + b[1] * 0.5 && p[0] < -0.05 && p[0] > -0.5 ? p : b), ribP[0]);
    const tDnk = [DNK[0][0], DNK[0][1], DNK[0][2] + 0.03], tSkr = [SKROB[0][0] + 0.06, SKROB[0][1] + 0.03, SKROB[0][2] + 0.05];
    const ozn = oznake(G, [
      ["zunanja membrana", zaslon(0.22, -0.62), tZun],
      ["notranja membrana", zaslon(-0.58, -0.5), tNot],
      ["stroma", zaslon(0.6, 0.52), tStr],
      ["granum", zaslon(-0.12, 0.66), vrh(gTop)],
      ["tilakoida", zaslon(0.28, 0.74), tTil],
      ["lamela", zaslon(0.8, 0.3), tLam],
      ["ribosom", zaslon(-0.2, -0.74), tRib],
      ["DNK", zaslon(-0.64, 0.46), tDnk],
      ["škrobno zrno", zaslon(0.66, -0.46), tSkr],
    ]);
    const oznCikel = oznake(G, [["Calvinov cikel", [CK[0] + 0.02, CK[1] + 0.28, CK[2] + 0.1], [CK[0], CK[1] + 0.05, CK[2]], { barva: "#FFE3A0" }]]);

    const deli = [
      { id: "zunanja-membrana", ime: "Zunanja membrana", opis: "Zunanja ovojnica kloroplasta; prepušča majhne molekule, na primer vodo in CO₂.", barva: "#5FB35A", meshes: [zun, zunRob], tocka: tZun },
      { id: "notranja-membrana", ime: "Notranja membrana", opis: "Notranja ovojnica s prenašalci, ki izbirajo, katere snovi pridejo v stromo.", barva: "#A6D46A", meshes: [not, notRob], tocka: tNot },
      { id: "stroma", ime: "Stroma", opis: "Gosta tekočina v kloroplastu, polna encimov; v njej poteka Calvinov cikel, v katerem nastane sladkor.", barva: "#C9DE95", meshes: [stromaStena, drobci], tocka: tStr },
      { id: "tilakoide", ime: "Tilakoide", opis: "Sploščeni membranski mešički s klorofilom, v katerih poteka svetlobni del fotosinteze; narisani so debelejši, kot so v resnici.", barva: "#34A84C", meshes: [diski], tocka: tTil },
      { id: "granum", ime: "Granum", opis: "Kupček tilakoid, zloženih kot kovanci; v enem kloroplastu jih je več deset. V prerezu se vidi, da ima vsaka tilakoida membrano in v njej prostor, imenovan lumen.", barva: "#3BB255", meshes: [diski2, prerez], tocka: vrh(gTop) },
      { id: "lamele", ime: "Lamele", opis: "Stromalne tilakoide, ki povezujejo grana, tako da so vse tilakoide ena sama povezana membrana.", barva: "#49B85C", meshes: [lamele], tocka: tLam },
      { id: "ribosomi", ime: "Ribosomi", opis: "Kloroplast ima svoje majhne ribosome, na katerih izdela del svojih beljakovin.", barva: "#7A63C9", meshes: [ribosomi], tocka: tRib },
      { id: "dnk", ime: "Kloroplastna DNK", opis: "Kloroplast ima svojo krožno DNK, podobno bakterijski, z geni za nekatere svoje beljakovine.", barva: "#F08A5D", meshes: [dnk], tocka: tDnk },
      { id: "skrobna-zrna", ime: "Škrobna zrna", opis: "Zaloga škroba, ki nastane iz sladkorja, narejenega pri fotosintezi.", barva: "#F2E9D0", meshes: [skrob], tocka: tSkr },
    ];
    const sij = {
      tilakoide: [mDisk, 0.25], granum: [mDisk2, 0.25], stroma: [mStroma, 0.12], "skrobna-zrna": [skrob.material, 0.35],
    };
    pogledi.kloroplast = {
      G, deli, koraki, T, sij,
      merilo: { m: 6e-6, oznaka: "6 µm" },
      oznake: [ozn],
      stanje(kk, t) {
        const st = koraki[kk - 1];
        snop.visible = !!st.snop;
        snop.material.opacity = (st.snop || 0) * (gibanje ? 0.85 + 0.15 * Math.sin(t * 3) : 1);
        calvin.visible = !!st.cikel;
        oznCikel.visible = !!st.cikel && kazOznake;
        if (gibanje) calvin.rotation.z = -t * 1.2;
      },
    };
  }

  // =====================================================================
  // 2) TILAKOIDNA MEMBRANA
  // =====================================================================
  {
    const G = new THREE.Group();
    group.add(G);
    // Membrana je vodoravna: zgoraj stroma, spodaj lumen. Kompleksi stojijo ob sprednjem prerezu membrane.
    const yM = -0.08, yT = 0.02, yB = -0.18, XL = 0.82, ZB = -0.36, ZF = 0.1, ZC = (ZB + ZF) / 2, ZD = ZF - ZB;
    const rnd = nakljucje(11);
    const GLAVA = 0.032; // razmik lipidnih glav (≈ 0,8 nm)
    const cc = document.createElement("canvas");
    cc.width = cc.height = 256;
    const cg = cc.getContext("2d");
    cg.fillStyle = "#6E4A2E"; cg.fillRect(0, 0, 256, 256);
    const korakG = 256 / 14;
    for (let r = -1; r < 17; r++) for (let s = -1; s < 16; s++) {
      const x = s * korakG + (r % 2 ? korakG / 2 : 0), y = r * korakG * 0.866;
      const gr = cg.createRadialGradient(x - 2, y - 2, 1, x, y, korakG * 0.55);
      const tone = 0.85 + 0.15 * rnd();
      gr.addColorStop(0, `rgb(${Math.round(255 * tone)},${Math.round(214 * tone)},${Math.round(160 * tone)})`);
      gr.addColorStop(0.7, `rgb(${Math.round(222 * tone)},${Math.round(150 * tone)},${Math.round(92 * tone)})`);
      gr.addColorStop(1, "rgba(110,74,46,1)");
      cg.fillStyle = gr; cg.beginPath(); cg.arc(x, y, korakG * 0.5, 0, Math.PI * 2); cg.fill();
    }
    const texVrh = tekstura(cc);
    texVrh.wrapS = texVrh.wrapT = THREE.RepeatWrapping;
    const bc = document.createElement("canvas");
    bc.width = 256; bc.height = 128;
    const bg = bc.getContext("2d");
    bg.fillStyle = "#3A2A20"; bg.fillRect(0, 0, 256, 128);
    bg.strokeStyle = "#D7B57A"; bg.lineWidth = 2.2;
    for (let s = 0; s < 14; s++) {
      const x = (s + 0.5) * korakG;
      for (const [y0, sm] of [[16, 1], [112, -1]]) {
        for (const dx of [-3, 3]) {
          bg.beginPath(); bg.moveTo(x + dx, y0);
          for (let t = 0; t <= 1.0001; t += 0.125) bg.lineTo(x + dx + 2.2 * Math.sin(t * 12 + s), y0 + sm * t * 44);
          bg.stroke();
        }
        const gr = bg.createRadialGradient(x - 2, y0 - 2, 1, x, y0, 9);
        gr.addColorStop(0, "#FFE0B0"); gr.addColorStop(0.75, "#E09A5C"); gr.addColorStop(1, "#8E5A34");
        bg.fillStyle = gr; bg.beginPath(); bg.arc(x, y0, 8.5, 0, Math.PI * 2); bg.fill();
      }
    }
    const texBok = tekstura(bc);
    texBok.wrapS = THREE.RepeatWrapping;
    const ploskev = (w, hh, ux, uy, rot, poz) => {
      const g = new THREE.PlaneGeometry(w, hh);
      const uv = g.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * ux, uv.getY(i) * uy);
      g.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(rot));
      g.translate(poz[0], poz[1], poz[2]);
      return [g, null];
    };
    const tile = 14 * GLAVA;
    const vrhGeo = zdruzi([
      ploskev(2 * XL, ZD, (2 * XL) / tile, ZD / tile, new THREE.Euler(-Math.PI / 2, 0, 0), [0, yT, ZC]),
      ploskev(2 * XL, ZD, (2 * XL) / tile, ZD / tile, new THREE.Euler(Math.PI / 2, 0, 0), [0, yB, ZC]),
    ]);
    const bokGeo = zdruzi([
      ploskev(2 * XL, yT - yB, (2 * XL) / tile, 1, new THREE.Euler(0, 0, 0), [0, yM, ZF]),
      ploskev(2 * XL, yT - yB, (2 * XL) / tile, 1, new THREE.Euler(0, Math.PI, 0), [0, yM, ZB]),
      ploskev(ZD, yT - yB, ZD / tile, 1, new THREE.Euler(0, Math.PI / 2, 0), [XL, yM, ZC]),
      ploskev(ZD, yT - yB, ZD / tile, 1, new THREE.Euler(0, -Math.PI / 2, 0), [-XL, yM, ZC]),
    ]);
    const mVrh = fiz("#ffffff", { map: texVrh, bumpMap: texVrh, bumpScale: 1.2, roughness: 0.5, clearcoat: 0.6, clearcoatRoughness: 0.4, sheen: 0.2, emissive: "#ffcf8a", emissiveIntensity: 0 });
    const mBok = fiz("#ffffff", { map: texBok, roughness: 0.6, clearcoat: 0.3, sheen: 0.1, emissive: "#ffcf8a", emissiveIntensity: 0 });
    const membVrh = new THREE.Mesh(vrhGeo, mVrh);
    const membBok = new THREE.Mesh(bokGeo, mBok);
    G.add(membVrh, membBok);
    membVrh.onBeforeRender = merilniZaslon;
    // lumen: prosojna modra plast pod membrano
    const lumen = new THREE.Mesh(h(new THREE.BoxGeometry(2 * XL, 0.25, ZD)), h(new THREE.MeshPhysicalMaterial({ color: "#7FA6FF", transparent: true, opacity: 0.2, roughness: 0.25, depthWrite: false, side: THREE.DoubleSide, emissive: "#5b8cff", emissiveIntensity: 0 })));
    lumen.position.set(0, yB - 0.125, ZC);
    lumen.renderOrder = 5;
    G.add(lumen);

    const mat = (glow) => fiz("#ffffff", { vertexColors: true, roughness: 0.38, clearcoat: 0.7, sheen: 0.25, emissive: glow, emissiveIntensity: 0 });
    // fotosistem II (jedro z reakcijskim središčem, antene LHCII, kompleks za razcep vode v lumnu)
    const P2 = [-0.55, yM, 0.07];
    const psii = new THREE.Mesh(zdruzi([
      kepa(0.14, 0.19, 0.12, P2[0], yM + 0.01, P2[2], "#2FA184", 26),
      kepa(0.1, 0.035, 0.08, P2[0] + 0.01, yT + 0.1, P2[2], "#5CC7A6"),
      kepa(0.068, 0.15, 0.068, P2[0] - 0.17, yM, P2[2] - 0.02, "#7FD45B"),
      kepa(0.068, 0.15, 0.068, P2[0] - 0.07, yM, P2[2] - 0.13, "#8ADB63"),
      kepa(0.068, 0.15, 0.068, P2[0] + 0.08, yM, P2[2] - 0.14, "#7FD45B"),
      kepa(0.08, 0.06, 0.075, P2[0] + 0.02, yB - 0.1, P2[2] + 0.02, "#F2A541"),
    ]), mat("#7dffb0"));
    // citokrom b6f (dimer)
    const B6 = [-0.2, yM, 0.07];
    const b6f = new THREE.Mesh(zdruzi([
      kepa(0.058, 0.17, 0.075, B6[0] - 0.056, yM, B6[2], "#B5559A"),
      kepa(0.058, 0.17, 0.075, B6[0] + 0.056, yM, B6[2], "#C2629F"),
      kepa(0.08, 0.035, 0.065, B6[0], yT + 0.07, B6[2], "#D07BB5"),
      kepa(0.042, 0.048, 0.042, B6[0] - 0.05, yB - 0.08, B6[2] + 0.02, "#E59BC9"),
      kepa(0.042, 0.048, 0.042, B6[0] + 0.05, yB - 0.08, B6[2] - 0.0, "#E59BC9"),
    ]), mat("#ff9be0"));
    // fotosistem I (jedro, antene LHCI, stromalni greben)
    const P1 = [0.16, yM, 0.06];
    const psi = new THREE.Mesh(zdruzi([
      kepa(0.15, 0.17, 0.12, P1[0], yM, P1[2], "#1F8F6A", 26),
      kepa(0.085, 0.045, 0.075, P1[0], yT + 0.1, P1[2] + 0.02, "#46B98D"),
      ...[-0.13, -0.045, 0.045, 0.13].map((dx, i) => kepa(0.05, 0.13, 0.05, P1[0] + dx, yM, P1[2] - 0.12 + Math.abs(dx) * 0.3, i % 2 ? "#7FD45B" : "#8ADB63")),
      kepa(0.065, 0.04, 0.055, P1[0], yB - 0.04, P1[2] + 0.02, "#3FA58A"),
    ]), mat("#7dffb0"));
    // NADP⁺-reduktaza (FNR) na strani strome
    const FN = [0.4, yT + 0.07, 0.08];
    const fnr = new THREE.Mesh(zdruzi([kepa(0.075, 0.06, 0.065, FN[0], FN[1], FN[2], "#E8C547"), kepa(0.045, 0.04, 0.045, FN[0] - 0.055, FN[1] + 0.03, FN[2] + 0.02, "#F2D66B")]), mat("#ffe27a"));
    // gibljivi prenašalci
    const fd = new THREE.Mesh(h(new THREE.SphereGeometry(0.038, seg(18), seg(12))), fiz("#C8643C", { roughness: 0.4, emissive: "#ff9a6a", emissiveIntensity: 0 }));
    const pc = new THREE.Mesh(h(new THREE.SphereGeometry(0.042, seg(18), seg(12))), fiz("#4F8FE8", { roughness: 0.35, emissive: "#8ab8ff", emissiveIntensity: 0 }));
    fd.scale.set(1, 0.85, 1.1); pc.scale.set(1.1, 0.9, 1);
    const pq = new THREE.InstancedMesh(h(new THREE.CapsuleGeometry(0.017, 0.07, 4, nizka ? 6 : 10)), fiz("#F4E46A", { roughness: 0.35, emissive: "#fff38a", emissiveIntensity: 0 }), 3);
    // ATP-sintaza: obroč c in os γ se vrtita, glava α3β3 in stator mirujeta
    const AT = [0.6, yM, 0.04];
    const statorDeli = [];
    const yG = 0.36;
    for (let i = 0; i < 6; i++) {
      const f = (i / 6) * Math.PI * 2;
      statorDeli.push(kepa(0.062, 0.095, 0.062, AT[0] + 0.083 * Math.cos(f), yG, AT[2] + 0.083 * Math.sin(f), i % 2 ? "#F6A3A3" : "#E35D6A"));
    }
    statorDeli.push(kepa(0.04, 0.035, 0.04, AT[0], yG + 0.1, AT[2], "#F7C1C1"));
    statorDeli.push(kepa(0.045, 0.12, 0.05, AT[0] + 0.115, yM, AT[2] - 0.03, "#C77B3F"));
    const bStalk = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(AT[0] + 0.13, yT, AT[2] - 0.03), V(AT[0] + 0.15, 0.2, AT[2] - 0.02), V(AT[0] + 0.13, yG + 0.05, AT[2] - 0.03), V(AT[0] + 0.05, yG + 0.12, AT[2] - 0.02)]), 24, 0.013, 6);
    statorDeli.push([bStalk, "#D9894D"]);
    const stator = new THREE.Mesh(zdruzi(statorDeli), mat("#ffb0b0"));
    const rotorDeli = [];
    for (let i = 0; i < 14; i++) {
      const f = (i / 14) * Math.PI * 2;
      const c = new THREE.CylinderGeometry(0.017, 0.017, 0.24, seg(10));
      c.translate(0.058 * Math.cos(f), 0, 0.058 * Math.sin(f));
      rotorDeli.push([c, i % 2 ? "#F08C3C" : "#D8702A"]);
    }
    const gam = new THREE.CylinderGeometry(0.022, 0.026, 0.34, seg(12));
    gam.translate(0, 0.18, 0);
    rotorDeli.push([gam, "#F4B860"]);
    const rotor = new THREE.Mesh(zdruzi(rotorDeli), mat("#ffc070"));
    rotor.position.set(AT[0], yM, AT[2]);
    G.add(psii, b6f, psi, fnr, fd, pc, pq, stator, rotor);

    // poti molekul
    const OEC = [P2[0] + 0.02, yB - 0.11, P2[2] + 0.1];
    const Zp = 0.2; // pred membrano, da so molekule vidne
    const pSvet2 = [0, 1, 2].map((i) => pot([[-0.84 + 0.1 * i, 0.6, 0.32 - 0.08 * i], [-0.72 + 0.06 * i, 0.32, 0.22 - 0.03 * i], [P2[0] - 0.14 + 0.07 * i, yT + 0.08, P2[2] + 0.06]], 20));
    const pSvet1 = [0, 1, 2].map((i) => pot([[-0.06 + 0.1 * i, 0.74, 0.34 - 0.08 * i], [0.04 + 0.06 * i, 0.42, 0.2 - 0.03 * i], [P1[0] - 0.08 + 0.06 * i, yT + 0.1, P1[2] + 0.04]], 20));
    const pVoda = [0, 1].map((i) => pot([[-0.84, -0.32 - 0.05 * i, 0.3 - 0.08 * i], [-0.72, -0.31, Zp], OEC]));
    const pKisik = pot([OEC, [-0.42, -0.4, 0.26], [-0.28, -0.44, 0.4]]);
    const pHvoda = [0, 1].map((i) => pot([OEC, [-0.44 + 0.05 * i, -0.32, 0.18 + 0.04 * i], [-0.34 + 0.08 * i, -0.38, 0.12 + 0.05 * i]]));
    const pEvoda = pot([OEC, [P2[0] + 0.02, yM - 0.04, P2[2] + 0.14], [P2[0] + 0.06, yM + 0.03, P2[2] + 0.13]]);
    const pE2 = pot([[P2[0] + 0.1, yM, P2[2] + 0.11], [-0.38, yM - 0.01, ZF + 0.03], [B6[0] - 0.07, yM, B6[2] + 0.1]]);
    const pE2kratka = pot([[P2[0] + 0.04, yM + 0.02, P2[2] + 0.13], [P2[0] + 0.2, yM, ZF + 0.03]]);
    const pHb6 = [0, 1].map((i) => pot([[-0.32 + 0.1 * i, 0.3, 0.3], [B6[0] - 0.05 + 0.08 * i, yT + 0.1, B6[2] + 0.1], [B6[0] - 0.03 + 0.06 * i, yM, B6[2] + 0.1], [B6[0] - 0.05 + 0.1 * i, yB - 0.14, B6[2] + 0.14]]));
    const pEpc = pot([[B6[0], yB - 0.1, B6[2] + 0.1], [-0.02, yB - 0.15, 0.2], [P1[0] - 0.02, yB - 0.08, P1[2] + 0.1]]);
    const pEfd = pot([[P1[0], yT + 0.14, P1[2] + 0.08], [0.28, yT + 0.17, 0.18], [FN[0] - 0.04, FN[1] + 0.05, FN[2] + 0.08]]);
    const pNadpIn = pot([[0.7, 0.52, 0.42], [0.54, 0.3, 0.32], [FN[0] + 0.03, FN[1] + 0.06, FN[2] + 0.08]]);
    const pNadphOut = pot([[FN[0], FN[1] + 0.06, FN[2] + 0.08], [0.32, 0.34, 0.36], [0.18, 0.58, 0.46]]);
    const pHatp = [0, 1].map((i) => pot([[0.36 + 0.08 * i, -0.36, 0.2 - 0.04 * i], [AT[0] - 0.03, yB - 0.1, AT[2] + 0.1], [AT[0] + 0.058 * Math.cos(1.2 + i), yM, AT[2] + 0.058 * Math.sin(1.2 + i) + 0.03], [AT[0] - 0.08, yT + 0.1, AT[2] + 0.16], [AT[0] - 0.26, 0.22, AT[2] + 0.34]]));
    const pADP = pot([[0.95, 0.22, 0.14], [0.8, 0.3, 0.16], [AT[0] + 0.1, yG - 0.02, AT[2] + 0.12]]);
    const pPi = pot([[0.9, 0.46, -0.06], [0.78, 0.42, 0.04], [AT[0] + 0.08, yG + 0.02, AT[2] + 0.12]]);
    const pATP = pot([[AT[0] - 0.03, yG - 0.04, AT[2] + 0.14], [AT[0] - 0.16, 0.44, AT[2] + 0.3], [0.32, 0.62, 0.42]]);
    const bazen = [];
    for (let i = 0; i < 16; i++) bazen.push([-0.74 + (i / 15) * 1.32 + (rnd() - 0.5) * 0.06, -0.28 - rnd() * 0.12, -0.05 + rnd() * 0.3]);
    const vrste = {
      svet: { sij: true, barva: "rgba(255,226,110,0.9)", px: 24, n: 24 },
      h2o: { b: "H₂O", barva: "#62C3F7" },
      o2: { b: "O₂", barva: "#FF8A80" },
      h: { b: "H⁺", barva: "#FFA94D", px: 15, n: 50 },
      e: { b: "e⁻", barva: "#7DF0E4", px: 14 },
      nadp: { b: "NADP⁺", barva: "#9C8CC8" },
      nadph: { b: "NADPH", barva: "#C3A2FF" },
      adp: { b: "ADP", barva: "#C8B47A" },
      pi: { b: "Pᵢ", barva: "#E6E6E6", px: 15 },
      atp: { b: "ATP", barva: "#FFD166" },
    };
    const T = tokovi(G, vrste);
    const hb = (n) => bazen.slice(0, n).map((p, i) => ({ tip: "h", tocka: p, faza: i }));
    const kSvet2 = (n) => pSvet2.map((p, i) => tok("svet", p, n, { hit: 2, faza: i * 0.21 }));
    const kVoda = [...pVoda.map((p, i) => tok("h2o", p, 2, { faza: i * 0.25 })), tok("o2", pKisik, 2, { hit: 0.5, faza: 0.3 }), ...pHvoda.map((p, i) => tok("h", p, 2, { faza: i * 0.25 + 0.1 })), tok("e", pEvoda, 3, { faza: 0.05 })];
    const kTok = [tok("e", pE2, 4), ...pHb6.map((p, i) => tok("h", p, 2, { faza: i * 0.25 })), tok("e", pEpc, 3, { faza: 0.1 })];
    const kPSI = [...pSvet1.map((p, i) => tok("svet", p, 3, { hit: 2, faza: i * 0.19 })), tok("e", pEfd, 4), tok("nadp", pNadpIn, 2), tok("nadph", pNadphOut, 2, { faza: 0.4 })];
    const kATP = [...pHatp.map((p, i) => tok("h", p, 3, { faza: i * 0.17 })), tok("adp", pADP, 2), tok("pi", pPi, 2, { faza: 0.2 }), tok("atp", pATP, 2, { faza: 0.5 })];
    const koraki = [
      { s: "Svetloba vzbudi klorofil v antenah fotosistema II. Energija preide v reakcijsko središče, ki odda vzbujene elektrone (e⁻).", a: ["fotosistem-ii"], d: [...kSvet2(4), tok("e", pE2kratka, 3)] },
      { s: "Fotosistem II razcepi vodo: 2 H₂O → O₂ + 4 H⁺ + 4 e⁻. Elektroni nadomestijo oddane, H⁺ ostanejo v lumnu, kisik odide.", a: ["fotosistem-ii"], d: [...kSvet2(2), ...kVoda, ...hb(6)] },
      { s: "Plastokinon (PQ) odnese elektrone do citokroma b6f, ki pri tem črpa H⁺ iz strome v lumen. Plastocianin nese elektrone do fotosistema I.", a: ["plastokinon", "citokrom-b6f", "plastocianin"], d: [...kTok, ...hb(10)] },
      { s: "Svetloba vzbudi fotosistem I. Elektroni prek feredoksina pridejo do NADP⁺-reduktaze: NADP⁺ + 2 e⁻ + H⁺ → NADPH.", a: ["fotosistem-i", "feredoksin", "fnr"], d: [...kPSI, ...hb(10)] },
      { s: "V lumnu je veliko H⁺. Tečejo nazaj v stromo skozi ATP-sintazo, ki se zavrti in iz ADP in fosfata (Pᵢ) naredi ATP.", a: ["atp-sintaza"], d: [...kATP, ...hb(12)] },
      { s: "Vse skupaj: svetloba žene elektrone od vode do NADP⁺. Nastanejo O₂, NADPH in ATP; NADPH in ATP gresta v Calvinov cikel.", a: ["fotosistem-ii", "citokrom-b6f", "fotosistem-i", "atp-sintaza"], d: [...kSvet2(2), ...kVoda.slice(0, 3), ...kTok, ...kPSI, ...kATP, ...hb(12)] },
    ];
    const tPSII = [P2[0] - 0.02, yT + 0.12, P2[2]], tB6 = [B6[0], yT + 0.1, B6[2]], tPSI = [P1[0], yT + 0.14, P1[2]], tFNR = [FN[0] + 0.02, FN[1] + 0.05, FN[2]];
    const tPQ = [-0.36, yM, ZF + 0.012], tPC = [-0.02, yB - 0.13, ZF + 0.04], tFD = [0.28, yT + 0.12, ZF + 0.04], tATP = [AT[0], yG + 0.12, AT[2]], tMemb = [-0.1, yM, ZF], tLum = [-0.3, yB - 0.16, ZF];
    const ozn = oznake(G, [
      ["stroma", zaslon(-0.74, 0.72), null, { barva: "#C9DE95", ozadje: "rgba(13,18,28,0.55)" }],
      ["lumen", zaslon(-0.72, -0.4), null, { barva: "#A9C2FF", ozadje: "rgba(13,18,28,0.55)" }],
      ["fotosistem II", zaslon(-0.46, 0.52), tPSII],
      ["citokrom b6f", zaslon(-0.16, 0.42), tB6],
      ["fotosistem I", zaslon(0.22, -0.6), [P1[0] + 0.02, yB - 0.08, P1[2] + 0.06]],
      ["NADP⁺-reduktaza", zaslon(0.4, 0.4), tFNR],
      ["ATP-sintaza", zaslon(0.6, 0.72), tATP],
      ["plastokinon", zaslon(-0.44, -0.6), tPQ],
      ["plastocianin", zaslon(-0.1, -0.74), tPC],
      ["feredoksin", zaslon(0.1, 0.6), tFD],
      ["tilakoidna membrana", zaslon(0.6, -0.48), [0.42, yM - 0.04, ZF]],
    ]);
    const deli = [
      { id: "tilakoidna-membrana", ime: "Tilakoidna membrana", opis: "Dvojna plast lipidov, ki loči stromo (zgoraj) od lumna (spodaj); kompleksi so narisani v približni velikosti, a bliže drug drugemu kot v resnici.", barva: "#E09A5C", meshes: [membVrh, membBok], tocka: tMemb },
      { id: "lumen", ime: "Lumen tilakoide", opis: "Notranji prostor tilakoide, v katerem se nabirajo vodikovi ioni (H⁺), zato je bolj kisel od strome.", barva: "#5B8CFF", meshes: [lumen], tocka: tLum },
      { id: "fotosistem-ii", ime: "Fotosistem II", opis: "Z antenami klorofila ujame svetlobo in odda vzbujene elektrone, nadomesti pa jih z elektroni iz vode, pri čemer nastane kisik.", barva: "#2FA184", meshes: [psii], tocka: tPSII },
      { id: "plastokinon", ime: "Plastokinon (PQ)", opis: "Majhna molekula, ki se giblje v membrani in nosi elektrone od fotosistema II do citokroma b6f, s seboj pa tudi H⁺.", barva: "#F4E46A", meshes: [pq], tocka: tPQ },
      { id: "citokrom-b6f", ime: "Citokrom b6f", opis: "Kompleks, ki elektrone poda plastocianinu in pri tem prečrpa H⁺ iz strome v lumen.", barva: "#B5559A", meshes: [b6f], tocka: tB6 },
      { id: "plastocianin", ime: "Plastocianin", opis: "Majhna beljakovina z bakrom, ki v lumnu prenaša elektrone od citokroma b6f do fotosistema I.", barva: "#4F8FE8", meshes: [pc], tocka: tPC },
      { id: "fotosistem-i", ime: "Fotosistem I", opis: "S svetlobo elektronom znova dvigne energijo in jih odda feredoksinu na strani strome.", barva: "#1F8F6A", meshes: [psi], tocka: tPSI },
      { id: "feredoksin", ime: "Feredoksin", opis: "Majhna beljakovina z železom in žveplom, ki elektrone odnese do NADP⁺-reduktaze.", barva: "#C8643C", meshes: [fd], tocka: tFD },
      { id: "fnr", ime: "NADP⁺-reduktaza", opis: "Encim (feredoksin-NADP⁺-reduktaza), ki z dvema elektronoma in H⁺ pretvori NADP⁺ v NADPH.", barva: "#E8C547", meshes: [fnr], tocka: tFNR },
      { id: "atp-sintaza", ime: "ATP-sintaza", opis: "Molekularni motor: H⁺ tečejo skozi vrteči se del iz lumna v stromo, glava pa pri tem iz ADP in fosfata naredi ATP.", barva: "#E35D6A", meshes: [stator, rotor], tocka: tATP },
    ];
    const sij = {
      "fotosistem-ii": [psii.material, 0.35], "citokrom-b6f": [b6f.material, 0.35], "fotosistem-i": [psi.material, 0.35], fnr: [fnr.material, 0.35],
      feredoksin: [fd.material, 0.4], plastocianin: [pc.material, 0.4], plastokinon: [pq.material, 0.4], "atp-sintaza": [stator.material, 0.3],
    };
    const mt = new THREE.Matrix4(), qq = new THREE.Quaternion().setFromAxisAngle(V(0, 0, 1), Math.PI / 2), vv = V(0, 0, 0), ss = V(1, 1, 1);
    let kotRotor = 0;
    pogledi.tilakoida = {
      G, deli, koraki, T, sij,
      merilo: { m: 50e-9, oznaka: "50 nm" },
      oznake: [ozn],
      stanje(kk, t, dt) {
        const f = gibanje ? t : 1.3;
        for (let i = 0; i < 3; i++) {
          const s = 0.5 + 0.5 * Math.sin(f * 1.4 + i * 2.1);
          vv.set(P2[0] + 0.17 + s * (B6[0] - P2[0] - 0.29), yM + 0.045 * (i - 1), ZF + 0.008);
          mt.compose(vv, qq, ss);
          pq.setMatrixAt(i, mt);
        }
        pq.instanceMatrix.needsUpdate = true;
        const sp = 0.5 + 0.5 * Math.sin(f * 1.1);
        pc.position.set(B6[0] + 0.02 + sp * (P1[0] - B6[0] - 0.04), yB - 0.12 - 0.03 * Math.sin(sp * Math.PI), ZF + 0.04);
        const sf = 0.5 + 0.5 * Math.sin(f * 1.25 + 1);
        fd.position.set(P1[0] + 0.08 + sf * (FN[0] - P1[0] - 0.16), yT + 0.13 + 0.03 * Math.sin(sf * Math.PI), ZF + 0.04);
        if (gibanje && (kk === 5 || kk === 6)) kotRotor += dt * 2.4;
        rotor.rotation.y = kotRotor;
      },
    };
  }

  // =====================================================================
  // 3) CALVINOV CIKEL
  // =====================================================================
  {
    const G = new THREE.Group();
    group.add(G);
    const O = new THREE.Group();
    O.rotation.set(-0.75, 0.35, 0, "YXZ");
    O.updateMatrix();
    const Oinv = O.matrix.clone().invert();
    // položaj v koordinatah obroča iz koordinat na zaslonu
    const lz = (sx, sy, d = 0.1) => V(...zaslon(sx, sy, d)).applyMatrix4(Oinv).toArray();
    const sred = (a, b, k = 0.1) => { const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2 + 0.03]; const l = Math.hypot(m[0], m[1]) || 1; m[0] += (m[0] / l) * k; m[1] += (m[1] / l) * k; return m; };
    G.add(O);
    const R = 0.56;
    const rp = (deg, dr = 0, z = 0) => { const f = (deg * Math.PI) / 180; return [(R + dr) * Math.cos(f), (R + dr) * Math.sin(f), z]; };
    const lok = (t0, t1, dr = 0) => {
      const n = Math.max(8, Math.round(Math.abs(t1 - t0) / 3));
      const a = new Float32Array((n + 1) * 3);
      for (let i = 0; i <= n; i++) { const p = rp(t0 + ((t1 - t0) * i) / n, dr, 0.0); a[i * 3] = p[0]; a[i * 3 + 1] = p[1]; a[i * 3 + 2] = p[2]; }
      return a;
    };
    const sektor = (od, barva, glow) => {
      const g = h(new THREE.TorusGeometry(R, 0.032, seg(16), seg(64), (2 * Math.PI) / 3));
      const m = new THREE.Mesh(g, fiz(barva, { roughness: 0.32, clearcoat: 0.7, sheen: 0, emissive: glow, emissiveIntensity: 0 }));
      m.rotation.z = (od * Math.PI) / 180;
      O.add(m);
      return m;
    };
    const sFiks = sektor(-30, "#38A957", "#8af0a4");
    const sRed = sektor(-150, "#E0782A", "#ffbf7a");
    const sReg = sektor(90, "#4A78E0", "#9cbcff");
    sFiks.onBeforeRender = merilniZaslon;
    // puščice v smeri urinega kazalca
    const pus = new THREE.InstancedMesh(h(new THREE.ConeGeometry(0.068, 0.14, seg(18))), fiz("#ffffff", { roughness: 0.3, clearcoat: 0.8, sheen: 0 }), 3);
    const mt = new THREE.Matrix4(), qq = new THREE.Quaternion();
    [[25, "#7FE39A"], [-95, "#FFB36B"], [145, "#9DB9FF"]].forEach(([d, c], i) => {
      const f = (d * Math.PI) / 180;
      qq.setFromUnitVectors(V(0, 1, 0), V(Math.sin(f), -Math.cos(f), 0));
      mt.compose(V(...rp(d)), qq, V(1, 1, 0.4));
      pus.setMatrixAt(i, mt);
      pus.setColorAt(i, new THREE.Color(c));
    });
    O.add(pus);
    // RuBisCO (L8S8): 8 velikih in 8 malih podenot
    const rb = [];
    const RB = rp(90, 0.0, 0.0);
    for (let i = 0; i < 8; i++) {
      const f = ((i % 4) / 4) * Math.PI * 2 + (i < 4 ? 0 : Math.PI / 4);
      rb.push(kepa(0.048, 0.045, 0.048, RB[0] + 0.055 * Math.cos(f), RB[1] + 0.07 + (i < 4 ? 0.025 : -0.025), RB[2] + 0.055 * Math.sin(f), i % 2 ? "#3FA88E" : "#4FBFA2", 16));
    }
    for (let i = 0; i < 8; i++) {
      const f = ((i % 4) / 4) * Math.PI * 2 + Math.PI / 4;
      rb.push(kepa(0.028, 0.024, 0.028, RB[0] + 0.04 * Math.cos(f), RB[1] + 0.07 + (i < 4 ? 0.075 : -0.075), RB[2] + 0.04 * Math.sin(f), "#A5E6CF", 12));
    }
    const rubisco = new THREE.Mesh(zdruzi(rb), fiz("#ffffff", { vertexColors: true, roughness: 0.4, clearcoat: 0.6, emissive: "#8af0c8", emissiveIntensity: 0 }));
    O.add(rubisco);
    const RBc = [RB[0], RB[1] + 0.07, RB[2]];

    // izvori in ponori
    const qCO2 = [0, 1, 2].map((i) => lz(0.22 + 0.15 * i, 0.8 - 0.04 * i));
    const qATP = [0, 1, 2, 3, 4, 5].map((j) => lz(0.86, 0.14 - 0.075 * j));
    const qNADPH = [0, 1, 2, 3, 4, 5].map((j) => lz(-0.32 + 0.13 * j, -0.74));
    const qATP2 = [0, 1, 2].map((i) => lz(-0.86, -0.02 + 0.08 * i));
    const outADP = lz(0.82, -0.5), outNADP = lz(-0.5, -0.62), outADP2 = lz(-0.72, 0.5);
    const E = lz(-0.74, -0.38), E2 = lz(-0.62, -0.5), GL = lz(-0.84, -0.6);
    const T_ATP = -55, T_NADPH = -105, T_IZ = -157, T_REG = -205;

    // korak 1: fiksacija
    const k1 = [];
    const tPG = (j) => -25 + 9 * j;
    for (let i = 0; i < 3; i++) {
      const ti = 0.2 + 0.22 * i;
      k1.push(let_("rubp", lok(125 + 12 * i, 94), ti - 0.17, ti, 0, ti + 0.012));
      k1.push(let_("co2", pot([qCO2[i], sred(qCO2[i], RBc, 0.02), [RBc[0] + 0.03, RBc[1] + 0.05, 0.06]]), ti - 0.16, ti, 0, ti + 0.012));
      for (let q = 0; q < 2; q++) {
        const j = 2 * i + q;
        k1.push(let_("pg", lok(86, tPG(j)), ti + 0.015 + 0.04 * q, ti + 0.3 + 0.04 * q, ti + 0.012, 1));
      }
    }
    // korak 2: redukcija
    const k2 = [];
    const tQ = (j) => -157 + 9 * j;
    for (let j = 0; j < 6; j++) {
      const zac = 0.04 + 0.072 * j, kon = zac + 0.3, t0 = tPG(j);
      const a = zac + ((t0 - T_ATP) / (t0 - T_NADPH)) * 0.3;
      k2.push(let_("pg", lok(t0, T_NADPH), zac, kon, 0, kon + 0.008, true));
      k2.push(let_("atp", pot([qATP[j], sred(qATP[j], rp(T_ATP)), rp(T_ATP, 0.05, 0.03)]), a - 0.13, a, 0, a + 0.01));
      k2.push(let_("adp", pot([rp(T_ATP, 0.05, 0.03), sred(rp(T_ATP), outADP), outADP]), a, a + 0.14, a, a + 0.15));
      k2.push(let_("nadph", pot([qNADPH[j], sred(qNADPH[j], rp(T_NADPH)), rp(T_NADPH, 0.05, 0.03)]), kon - 0.13, kon, 0, kon + 0.01));
      k2.push(let_("nadp", pot([rp(T_NADPH, 0.05, 0.03), sred(rp(T_NADPH), outNADP), outNADP]), kon, kon + 0.14, kon, kon + 0.15));
      k2.push(let_("g3p", lok(T_NADPH, tQ(j)), kon, kon + 0.13, kon, 1));
    }
    // korak 3: en G3P zapusti cikel, pet jih gre naprej
    const k3 = [];
    const tR = (j) => -165 - 9 * (5 - j);
    k3.push({ ...let_("g3p", pot([rp(tQ(0)), sred(rp(tQ(0)), E, 0.03), E]), 0.22, 0.55, 0, 1), izhod: true });
    for (let j = 1; j < 6; j++) k3.push(let_("g3p", lok(tQ(j), tR(j)), 0.3 + 0.04 * (j - 1), 0.62 + 0.04 * (j - 1), 0, 1));
    // korak 4: regeneracija
    const k4 = [];
    for (let j = 1; j < 6; j++) {
      const zac = 0.04 + 0.05 * (j - 1), kon = zac + 0.22;
      k4.push(let_("g3p", lok(tR(j), T_REG), zac, kon, 0, kon + 0.008));
    }
    for (let i = 0; i < 3; i++) {
      const a = 0.3 + 0.06 * i;
      k4.push(let_("atp", pot([qATP2[i], sred(qATP2[i], rp(T_REG)), rp(T_REG, 0.05, 0.03)]), a - 0.15, a, 0, a + 0.01));
      k4.push(let_("adp", pot([rp(T_REG, 0.05, 0.03), sred(rp(T_REG), outADP2), outADP2]), a, a + 0.14, a, a + 0.15));
      k4.push(let_("rubp", lok(T_REG, 125 + 12 * i - 360), 0.52 + 0.08 * i, 0.82 + 0.05 * i, 0.5 + 0.08 * i, 1));
    }
    const stisni = (sez, a, b) => sez.map((d) => ({ ...d, zac: a + d.zac * (b - a), kon: a + d.kon * (b - a), od: a + d.od * (b - a), do: d.do >= 1 ? b : a + d.do * (b - a) }));
    const k5 = [...stisni(k1, 0, 0.25), ...stisni(k2, 0.25, 0.5), ...stisni(k3, 0.5, 0.75), ...stisni(k4, 0.75, 1)];
    // korak 6: obrat cikla, nato se G3P iz tega obrata združi z G3P iz prejšnjega obrata v glukozo
    const SR = [(E[0] + E2[0]) / 2, (E[1] + E2[1]) / 2, (E[2] + E2[2]) / 2];
    const k6 = [...stisni(k1, 0, 0.25), ...stisni(k2, 0.25, 0.5), ...stisni(k3.filter((d) => !d.izhod), 0.5, 0.75), ...stisni(k4, 0.75, 1),
      let_("g3p", pot([rp(tQ(0)), sred(rp(tQ(0)), E, 0.03), E]), 0.555, 0.64, 0.55, 0.7),
      let_("g3p", pot([E2, E2]), 0, 1, 0, 0.7),
      let_("g3p", pot([E, SR]), 0.7, 0.78, 0.7, 0.785),
      let_("g3p", pot([E2, SR]), 0.7, 0.78, 0.7, 0.785),
      let_("glu", pot([SR, GL]), 0.785, 0.9, 0.78, 1)];

    const vrste = {
      co2: { b: "CO₂", barva: "#CFD5DE", n: 8 },
      rubp: { b: "RuBP", barva: "#6FD8C4", n: 8 },
      pg: { b: "3-PG", barva: "#8FD0FF", n: 10 },
      g3p: { b: "G3P", barva: "#FF9EC4", n: 12 },
      atp: { b: "ATP", barva: "#FFD166", n: 10 },
      adp: { b: "ADP", barva: "#C8B47A", n: 10 },
      nadph: { b: "NADPH", barva: "#C3A2FF", n: 10 },
      nadp: { b: "NADP⁺", barva: "#9C8CC8", n: 10 },
      glu: { b: "glukoza", barva: "#F6E7C1", n: 2 },
    };
    const T = tokovi(O, vrste);
    const koraki = [
      { s: "Fiksacija: encim RuBisCO veže 3 CO₂ na 3 RuBP. Nastane 6 molekul 3-fosfoglicerata (3-PG).", a: ["rubisco", "fiksacija"], d: k1, p: 7, u: 0.45 },
      { s: "Redukcija: z energijo 6 ATP in elektroni 6 NADPH se 6 3-PG pretvori v 6 G3P (gliceraldehid-3-fosfat). ADP in NADP⁺ se vrneta k tilakoidam.", a: ["redukcija"], d: k2, p: 8, u: 0.55 },
      { s: "Izstop: 1 G3P zapusti cikel – iz dveh G3P rastlina naredi glukozo, iz nje pa saharozo in škrob. Preostalih 5 G3P ostane v ciklu.", a: ["redukcija", "regeneracija"], d: k3, p: 6, u: 0.7 },
      { s: "Regeneracija: 5 G3P (15 C) se s 3 ATP preuredi v 3 RuBP (15 C), zato lahko cikel spet veže CO₂.", a: ["regeneracija"], d: k4, p: 7, u: 0.6 },
      { s: "Bilanca enega obrata: 3 CO₂ + 9 ATP + 6 NADPH → 1 G3P (6 ATP pri redukciji, 3 ATP pri regeneraciji).", a: ["rubisco", "fiksacija", "redukcija", "regeneracija"], d: k5, p: 14, u: 0.4 },
      { s: "Za eno glukozo sta potrebna 2 G3P, torej dva taka obrata: 6 CO₂, 18 ATP in 12 NADPH.", a: ["rubisco", "fiksacija", "redukcija", "regeneracija"], d: k6, p: 14, u: 0.85 },
    ];
    const ozn = oznake(O, [
      ["Calvinov cikel", [0, 0.1, 0], null, { krepko: true, px: 13 }],
      ["v stromi", [0, -0.0, 0], null, { barva: "#C9DE95", ozadje: "rgba(13,18,28,0.0)", rob: "rgba(0,0,0,0)" }],
      ["fiksacija", [0.29, 0.2, 0], null, { barva: "#8BE0A2" }],
      ["redukcija", [0.0, -0.3, 0], null, { barva: "#FFC48A" }],
      ["regeneracija", [-0.27, 0.22, 0], null, { barva: "#A9C3FF" }],
      ["RuBisCO", [-0.2, 0.68, 0.06], [RBc[0] - 0.06, RBc[1], 0]],
      ["3 CO₂", lz(0.42, 0.94), null, { barva: "#CFD5DE" }],
      ["6 ATP", lz(0.78, 0.3), null, { barva: "#FFD166" }],
      ["6 NADPH", lz(0.02, -0.88), null, { barva: "#C3A2FF" }],
      ["3 ATP", lz(-0.78, 0.3), null, { barva: "#FFD166" }],
      ["1 G3P", lz(-0.6, -0.72), null, { barva: "#FF9EC4" }],
    ]);
    const deli = [
      { id: "rubisco", ime: "RuBisCO", opis: "Encim, ki veže CO₂ na RuBP; je najpogostejša beljakovina na Zemlji.", barva: "#4FBFA2", meshes: [rubisco], tocka: RBc },
      { id: "fiksacija", ime: "Fiksacija CO₂", opis: "Prvi del cikla: iz 3 RuBP in 3 CO₂ nastane 6 molekul 3-fosfoglicerata (3-PG).", barva: "#55B96E", meshes: [sFiks], tocka: rp(30) },
      { id: "redukcija", ime: "Redukcija", opis: "Drugi del: 6 ATP in 6 NADPH iz svetlobnih reakcij pretvorita 6 3-PG v 6 G3P.", barva: "#E8954A", meshes: [sRed], tocka: rp(-90) },
      { id: "regeneracija", ime: "Regeneracija RuBP", opis: "Tretji del: 5 G3P se s 3 ATP preuredi nazaj v 3 RuBP; to je poenostavljena shema brez vmesnih snovi in ni v merilu.", barva: "#5E8CF0", meshes: [sReg], tocka: rp(150) },
    ];
    // tocke so v koordinatah obroča: preračunaj v koordinate skupine
    O.updateMatrix();
    for (const d of deli) d.tocka = V(...d.tocka).applyMatrix4(O.matrix).toArray();
    const sij = { rubisco: [rubisco.material, 0.35], fiksacija: [sFiks.material, 0.35], redukcija: [sRed.material, 0.35], regeneracija: [sReg.material, 0.35] };
    pogledi.calvin = { G, deli, koraki, T, sij, merilo: null, oznake: [ozn], stanje() {} };
  }

  // ---------- upravljanje ----------
  const trenutni = () => pogledi[pogled];
  function osvezi(dt = 0) {
    for (const [ime, p] of Object.entries(pogledi)) {
      p.G.visible = ime === pogled;
      for (const o of p.oznake) o.visible = kazOznake && ime === pogled;
    }
    const p = trenutni();
    const st = p.koraki[k - 1];
    const P = st.p || 6;
    const u = gibanje ? (ucas % P) / P : st.u ?? 0.45;
    p.T.posodobi(st.d, u, gibanje ? cas : 0);
    const utrip = gibanje ? 0.75 + 0.25 * Math.sin(cas * 3.2) : 1;
    for (const [id, [m, jak]] of Object.entries(p.sij)) m.emissiveIntensity = st.a.includes(id) ? jak * utrip : 0;
    p.stanje(k, gibanje ? cas : 0, dt);
  }
  function nastaviKorak(n) {
    k = Math.min(KORAKOV, Math.max(1, Math.round(n)));
    nKorak.vrednost = k;
    ucas = 0; odKoraka = 0;
    osvezi();
  }
  const nKorak = { tip: "drsnik", id: "korak", oznaka: "Korak", min: 1, max: KORAKOV, korak: 1, vrednost: k, ob: (v) => nastaviKorak(v) };
  const nadzor = [
    { tip: "izbira", id: "pogled", oznaka: "Pogled", moznosti: [["kloroplast", "Kloroplast"], ["tilakoida", "Tilakoidna membrana"], ["calvin", "Calvinov cikel"]], vrednost: pogled,
      ob: (v) => { if (pogledi[v]) { pogled = v; ucas = 0; odKoraka = 0; osvezi(); } } },
    nKorak,
    { tip: "gumb", id: "nazaj", oznaka: "Nazaj", ob: () => nastaviKorak(k - 1) },
    { tip: "gumb", id: "naprej", oznaka: "Naprej", ob: () => nastaviKorak(k + 1) },
    { tip: "stikalo", id: "predvajaj", oznaka: "Predvajaj", vrednost: predvajaj, ob: (v) => { predvajaj = !!v; odKoraka = 0; } },
    { tip: "stikalo", id: "oznake", oznaka: "Oznake", vrednost: kazOznake, ob: (v) => { kazOznake = !!v; osvezi(); } },
    { tip: "izpis", id: "opis", oznaka: "Kaj se dogaja", vrednost: () => `${k}/${KORAKOV} · ${trenutni().koraki[k - 1].s}` },
    { tip: "izpis", id: "enacba", oznaka: "Fotosinteza", vrednost: () => ENACBA },
  ];
  osvezi();

  const model = {
    group,
    get deli() { return trenutni().deli; },
    nadzor,
    merilo: () => trenutni().merilo,
    korak(t, dt) {
      const d = Math.min(0.1, Math.max(0, dt || 0));
      if (gibanje) { cas += d; ucas += d; }
      if (predvajaj) {
        odKoraka += d;
        const st = trenutni().koraki[k - 1];
        if (odKoraka >= Math.max(7, st.p || 6)) nastaviKorak(k >= KORAKOV ? 1 : k + 1);
      }
      osvezi(d);
    },
    dispose() {
      group.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
      for (const x of viri) x.dispose?.();
      viri.clear();
    },
  };
  return model;
}
