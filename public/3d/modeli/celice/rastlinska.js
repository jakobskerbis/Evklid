// Rastlinska celica v prerezu: odrezana zgornja sprednja četrtina (y > 0, z > 0) pokaže celično steno v prerezu
// (srednja lamela, primarna stena, plazmodezme), membrano, osrednjo vakuolo, jedro in odprte kloroplaste z grani.
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
// ctx.lahka = true (le za celice-primerjava.js): manj drobnih delov, da gresta obe celici v proračun.
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "celica-rastlinska",
  naslov: "Rastlinska celica",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Celica iz lista (okoli 45 µm) v prerezu. Ima celično steno, kloroplaste in veliko osrednjo vakuolo; organelov je zaradi preglednosti manj kot v resnici, stena in membrane so debelejše.",
  poskusi: "Poišči tri dele, ki jih živalska celica nima: celično steno, kloroplaste in veliko vakuolo, nato izberi »Brez stene«.",
  merilo: { m: 50e-6, oznaka: "50 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const lahka = !!ctx.lahka;
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55) * (lahka ? 0.8 : 1)));
  const qv = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.45) * (lahka ? (hi ? 0.75 : 0.65) : 1))); // velike gladke lupine
  const skopo = lahka && !hi; // primerjava na telefonu: najmanj trikotnikov
  const st = (a, b) => Math.max(1, Math.round((hi ? a : b) * (lahka ? 0.55 : 1))); // število ponovljenih delov
  const gib = ctx.gibanje !== false;
  const zac = ctx.zacetek || {};
  const group = new THREE.Group();
  const deli = [];
  const odpad = [];
  const V = videzCelic(THREE, { hi, odpad });

  // ---------- orodja ----------
  let seme = 11;
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;
  const { hash, sum, fbm } = V;
  const v3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const nakl = (s = 1) => v3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(s);
  const F = (x) => (Number.isInteger(x) ? x + ".0" : String(+(+x).toPrecision(5)));
  function mat(barva, o = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.3,
      sheen: 0.5, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.5,
    }, o));
    odpad.push(m);
    return m;
  }
  // Združi geometrije v eno; barve[i] = barva oglišč i-te geometrije (null = obdrži njene barve oglišč).
  function zdruzi(geos, barve) {
    const pos = [], nor = [], col = [], idx = [];
    let off = 0;
    geos.forEach((g, i) => {
      const p = g.attributes.position, n = g.attributes.normal, ca = g.attributes.color;
      const c = barve && barve[i] != null ? new THREE.Color(barve[i]) : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        if (barve) { if (c) col.push(c.r, c.g, c.b); else if (ca) col.push(ca.getX(k), ca.getY(k), ca.getZ(k)); else col.push(1, 1, 1); }
      }
      if (g.index) for (let k = 0; k < g.index.count; k++) idx.push(g.index.getX(k) + off);
      else for (let k = 0; k < p.count; k++) idx.push(k + off);
      off += p.count;
      g.dispose();
    });
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    out.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    if (barve) out.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    out.setIndex(idx);
    return out;
  }
  function deformiraj(g, fn) {
    const p = g.attributes.position, v = v3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); fn(v, i); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals();
    return g;
  }
  function pobarvaj(g, fn) {
    const p = g.attributes.position, v = v3(), c = [];
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const b = fn(v); c.push(b.r, b.g, b.b); }
    g.setAttribute("color", new THREE.Float32BufferAttribute(c, 3));
    return g;
  }
  // Povpreči normale oglišč na istem mestu (poli in šivi mreže).
  function zgladi(g) {
    const p = g.attributes.position, n = g.attributes.normal, m = new Map();
    const kljuc = (i) => Math.round(p.getX(i) * 1e4) + "," + Math.round(p.getY(i) * 1e4) + "," + Math.round(p.getZ(i) * 1e4);
    for (let i = 0; i < p.count; i++) { const k = kljuc(i); const s = m.get(k); if (s) { s[0] += n.getX(i); s[1] += n.getY(i); s[2] += n.getZ(i); } else m.set(k, [n.getX(i), n.getY(i), n.getZ(i)]); }
    for (let i = 0; i < p.count; i++) { const s = m.get(kljuc(i)), l = Math.hypot(s[0], s[1], s[2]) || 1; n.setXYZ(i, s[0] / l, s[1] / l, s[2] / l); }
    return g;
  }
  // Obdrži le trikotnike, katerih vsa oglišča (v koordinatah skupine: + zamik) izpolnjujejo pogoj.
  function obrezi(g, pogoj, zamik = v3()) {
    const p = g.attributes.position, ix = g.index.array, ok = [], v = v3();
    for (let i = 0; i < p.count; i++) ok.push(pogoj(v.fromBufferAttribute(p, i).add(zamik)));
    const nov = [];
    for (let i = 0; i < ix.length; i += 3) if (ok[ix[i]] && ok[ix[i + 1]] && ok[ix[i + 2]]) nov.push(ix[i], ix[i + 1], ix[i + 2]);
    g.setIndex(nov);
    return g;
  }
  function del(id, ime, opis, barva, meshes, tocka) {
    meshes.forEach((m) => { m.userData.del = id; });
    deli.push({ id, ime, opis, barva, meshes, tocka: tocka.map((x) => Math.round(x * 1000) / 1000) });
  }

  // ---------- izrez: odrezana četrtina y > 0, z > 0 (vzdolž vse celice) ----------
  // Smer iz kotov: t od osi +x (0 … π), f okoli osi x (f = 0 → +y, f = π/2 → +z). Izrez je f ∈ (0, π/2).
  const smerTF = (t, f, o) => o.set(Math.cos(t), Math.sin(t) * Math.cos(f), Math.sin(t) * Math.sin(f));
  const vIzrezu = (p, m = 0) => p.y > -m && p.z > -m;
  // Mreža ploskve r = f(smer) za f ∈ [f0, f1], obrnjena navzven; barva(P) → Color (neobvezno).
  function mrezaTF(f, nF, nT, f0, f1, barva) {
    const pos = [], col = [], idx = [], d = v3(), P = v3();
    for (let j = 0; j <= nT; j++) {
      const t = (j / nT) * Math.PI;
      for (let i = 0; i <= nF; i++) {
        smerTF(t, f0 + ((f1 - f0) * i) / nF, d);
        P.copy(d).multiplyScalar(f(d));
        pos.push(P.x, P.y, P.z);
        if (barva) { const c = barva(P, d); col.push(c.r, c.g, c.b); }
      }
    }
    for (let j = 0; j < nT; j++) for (let i = 0; i < nF; i++) {
      const a = j * (nF + 1) + i, b = a + nF + 1;
      idx.push(a, a + 1, b, b, a + 1, b + 1);
    }
    let s = 0;
    for (let i = 0; i < idx.length; i += 3) {
      const a = idx[i] * 3, b = idx[i + 1] * 3, c = idx[i + 2] * 3;
      const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
      const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
      s += (uy * vz - uz * vy) * pos[a] + (uz * vx - ux * vz) * pos[a + 1] + (ux * vy - uy * vx) * pos[a + 2];
    }
    if (s < 0) for (let i = 0; i < idx.length; i += 3) { const t = idx[i]; idx[i] = idx[i + 2]; idx[i + 2] = t; }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    if (barva) g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return zgladi(g);
  }
  const skoljka = (f, nF, nT, barva) => ({
    odprta: mrezaTF(f, nF, nT, Math.PI / 2, Math.PI * 2, barva),
    pokrov: mrezaTF(f, Math.max(2, Math.round(nF / 3)), nT, 0, Math.PI / 2, barva),
  });
  // Ploskev prereza plasti med fZ (zunaj) in fN (znotraj) na ravninah z = 0 (y ≥ 0) in y = 0 (z ≥ 0).
  // plasti = [[t0, t1, barva | null], …] od zunaj (t = 0) navznoter (t = 1); aRez = (dolžina vzdolž roba po ploskvi
  // sPot, globina t) za senčilnike prereza.
  const RAVNINI = [[0, v3(0, 0, 1), 0], [Math.PI / 2, v3(0, 1, 0), 5.3]];
  function rezPas(fZ, fN, nT, plasti, sPot = fZ) {
    const pos = [], nor = [], col = [], rez = [], idx = [], d = v3(), A = v3(), prej = v3(), c = new THREE.Color();
    for (const [fi, n, s0] of RAVNINI) for (const [t0, t1, barva] of plasti) {
      c.set(barva == null ? 0xffffff : barva);
      const off = pos.length / 3;
      let s = s0;
      for (let j = 0; j <= nT; j++) {
        smerTF((j / nT) * Math.PI, fi, d);
        A.copy(d).multiplyScalar(sPot(d));
        if (j) s += A.distanceTo(prej);
        prej.copy(A);
        const rz = fZ(d), rn = fN(d);
        for (const t of [t0, t1]) { const rr = rz + (rn - rz) * t; pos.push(d.x * rr, d.y * rr, d.z * rr); nor.push(n.x, n.y, n.z); col.push(c.r, c.g, c.b); rez.push(s, t); }
      }
      for (let j = 0; j < nT; j++) {
        const a = off + j * 2;
        const tri = [[a, a + 2, a + 1], [a + 1, a + 2, a + 3]];
        for (const [x, y, z] of tri) {
          const ux = pos[y * 3] - pos[x * 3], uy = pos[y * 3 + 1] - pos[x * 3 + 1], uz = pos[y * 3 + 2] - pos[x * 3 + 2];
          const vx = pos[z * 3] - pos[x * 3], vy = pos[z * 3 + 1] - pos[x * 3 + 1], vz = pos[z * 3 + 2] - pos[x * 3 + 2];
          const dd = (uy * vz - uz * vy) * n.x + (uz * vx - ux * vz) * n.y + (ux * vy - uy * vx) * n.z;
          if (dd >= 0) idx.push(x, y, z); else idx.push(x, z, y);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.setAttribute("aRez", new THREE.Float32BufferAttribute(rez, 2));
    g.setIndex(idx);
    return g;
  }
  // Cevka (odebeljen rob) vzdolž obeh robov izreza na ploskvi f, le kjer velja pogoj(točka).
  function robIzreza(f, r, nT, pogoj = () => true, zamik = v3()) {
    const geos = [], d = v3();
    for (const [fi] of RAVNINI) {
      let tek = [];
      const konec = () => { if (tek.length >= 3) geos.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tek), tek.length * 2, r, q(6), false)); tek = []; };
      for (let j = 0; j <= nT; j++) {
        smerTF((j / nT) * Math.PI, fi, d);
        const P = d.clone().multiplyScalar(f(d) * 0.995);
        if (pogoj(P.clone().add(zamik))) tek.push(P); else konec();
      }
      konec();
    }
    return geos;
  }

  // Smer proti privzeti kameri.
  const POG = v3(-0.3, 0.64, 0.7).normalize();

  // ---------- oblika celice: zaobljen kvader (superelipsoid) ----------
  const sup = (a, b, c, p) => (d) => 1 / Math.pow(Math.pow(Math.abs(d.x) / a, p) + Math.pow(Math.abs(d.y) / b, p) + Math.pow(Math.abs(d.z) / c, p), 1 / p);
  const A = [0.92, 0.6, 0.6], P = 6, DS = 0.064, DMb = 0.022; // stena ≈ 1,6 µm, membrana močno povečana
  const TL = 0.17; // srednja lamela: zunanjih 17 % debeline stene
  const valov = (d) => 1 + 0.008 * fbm(d.x * 2.2 + 5, d.y * 2.2, d.z * 2.2);
  const f0 = sup(A[0], A[1], A[2], P), f1 = sup(A[0] - DS, A[1] - DS, A[2] - DS, P), f2 = sup(A[0] - DS - DMb, A[1] - DS - DMb, A[2] - DS - DMb, P);
  const grad = (p) => v3(Math.sign(p.x) * Math.pow(Math.abs(p.x) / A[0], P - 1) / A[0], Math.sign(p.y) * Math.pow(Math.abs(p.y) / A[1], P - 1) / A[1], Math.sign(p.z) * Math.pow(Math.abs(p.z) / A[2], P - 1) / A[2]).normalize();

  // piknje (primarna polja pikenj): tanjša mesta stene s skupinami plazmodezm
  const piknje = [];
  for (let p = 0; piknje.length < st(20, 14) && p < 5000; p++) {
    const d = v3(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
    if (d.lengthSq() > 1 || d.lengthSq() < 0.1) continue;
    d.normalize();
    const x = d.clone().multiplyScalar(f0(d));
    if (vIzrezu(x, 0.06) || piknje.some((y) => y.distanceTo(x) < 0.28)) continue;
    piknje.push(x);
  }
  const RPK = 0.055;
  const vPiknji = (x) => { let m = 0; for (const p of piknje) { const r = p.distanceTo(x) / RPK; if (r < 1) m = Math.max(m, (1 - r * r) * (1 - r * r)); } return m; };
  const pk0 = v3();
  const fS = (d) => { const r = f0(d) * valov(d); pk0.copy(d).multiplyScalar(r); return r * (1 + 0.011 * fbm(d.x * 7 + 2, d.y * 7, d.z * 7) + 0.004 * fbm(d.x * 17 + 6, d.y * 17, d.z * 17)) - 0.008 * vPiknji(pk0); };
  const fSl = (d) => fS(d) + (f1(d) * valov(d) - fS(d)) * TL; // meja srednje lamele (le za prerez)
  const fSn = (d) => f1(d) * valov(d), fM = (d) => f2(d) * valov(d);
  const notri = (p, m = 0) => { const l = p.length(); return l < 1e-6 || l < fM(p.clone().divideScalar(l)) - m; };

  // ---------- celična stena ----------
  const sv = new THREE.Color(B.stena), stm = new THREE.Color(B.stenaTemna), cS = new THREE.Color();
  const barvaStene = (P, d) => {
    const vl = 0.5 + 0.5 * fbm(P.x * 3 + 1, P.y * 22, P.z * 22); // snopi celuloznih vlaken
    cS.copy(sv).lerp(stm, 0.3 + 0.55 * vl * vl).multiplyScalar(0.72 + 0.4 * (0.5 + 0.5 * fbm(d.x * 7 + 2, d.y * 7, d.z * 7))); // kotanje temnejše
    return cS.lerp(stm.clone().multiplyScalar(0.45), 0.75 * vPiknji(P));
  };
  const stena = skoljka(fS, qv(124), qv(84), barvaStene);
  const stenaMat = mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.5, sheen: 0.4 });
  const stenaOut = new THREE.Mesh(stena.odprta, stenaMat);
  const pokrov = new THREE.Mesh(stena.pokrov, stenaMat);
  pokrov.visible = false;
  // prerez stene: srednja lamela (pektin) in primarna stena (plasti celuloznih vlaken), kanali plazmodezm
  const PER = 0.42, HW = 0.046, KW = 0.018, KR = 0.0058;
  const lamela = new THREE.Mesh(rezPas(fS, fSn, q(160), [[0, TL, null]]), stenaRezMat(DS, 0));
  const stenaRez = new THREE.Mesh(rezPas(fS, fSn, q(160), [[TL, 1, null]]), stenaRezMat(DS, 1));
  group.add(stenaOut, pokrov, lamela, stenaRez);
  del("celicna-stena", "Celična stena", "Trdna, a prepustna plast iz celuloznih vlaken zunaj membrane; celico ščiti, ji daje obliko in preprečuje, da bi ob vpijanju vode počila.", B.stena, [stenaOut, stenaRez, pokrov], [0.3, -0.4, 0.62]);
  del("srednja-lamela", "Srednja lamela", "Tanka zunanja plast iz pektina, ki zlepi steni sosednjih celic; v prerezu je temnejši pas na zunanji strani stene.", "#8a7a2e", [lamela], [0.35, 0.02, 0.57]);

  // plazmodezme: kanalčki skozi steno v piknjah (na površini in v prerezu stene; v prerezu je v sredini cevka ER)
  const nPp = hi ? 9 : skopo ? 4 : 6, nPl = piknje.length * nPp;
  const plGeo = zdruzi([new THREE.TorusGeometry(0.0058, 0.0024, q(4), q(8)), new THREE.CircleGeometry(0.0042, q(8)).translate(0, 0, 0.0002)], [B.dvosloj, 0x2a1f5e]);
  const plMat = mat(0xffffff, { vertexColors: true, roughness: 0.4, clearcoat: 0.6 });
  const plaz = new THREE.InstancedMesh(plGeo, plMat, nPl);
  const o = new THREE.Object3D(), Z = v3(0, 0, 1), gor = v3(0, 1, 0);
  let k = 0;
  for (const c of piknje) {
    const n = grad(c), t1 = v3().crossVectors(n, Math.abs(n.y) < 0.9 ? gor : v3(1, 0, 0)).normalize(), t2 = v3().crossVectors(n, t1);
    for (let i = 0; i < nPp; i++) {
      const a = (i / nPp) * Math.PI * 2 + rnd(), r = i === 0 ? 0 : 0.016 + rnd() * 0.022;
      const d = c.clone().addScaledVector(t1, Math.cos(a) * r).addScaledVector(t2, Math.sin(a) * r).normalize();
      o.position.copy(d).multiplyScalar(fS(d) + 0.0006); o.quaternion.setFromUnitVectors(Z, grad(o.position)); o.updateMatrix();
      plaz.setMatrixAt(k++, o.matrix);
    }
  }
  // v prerezu: cevke ER (dezmotubuli) na istih mestih, kot jih nariše senčilnik prereza stene
  const dezGeo = [];
  {
    const nT = q(160), d = v3(), Pz = v3(), Pn = v3(), prej = v3();
    for (const [fi, n, s0] of RAVNINI) {
      const tz = [], tn = [], ss = [];
      let s = s0;
      for (let j = 0; j <= nT; j++) {
        smerTF((j / nT) * Math.PI, fi, d);
        Pz.copy(d).multiplyScalar(fS(d));
        if (j) s += Pz.distanceTo(prej);
        prej.copy(Pz);
        tz.push(Pz.clone()); tn.push(d.clone().multiplyScalar(fSn(d))); ss.push(s);
      }
      for (let kk = Math.ceil(s0 / PER - 0.5); (kk + 0.5) * PER - HW < s; kk++) for (let m = -2; m <= 2; m++) {
        const sc = (kk + 0.5) * PER + m * KW;
        let j = ss.findIndex((x) => x > sc) - 1;
        if (j < 0 || sc < s0) continue;
        const u = (sc - ss[j]) / (ss[j + 1] - ss[j]);
        const a = tz[j].clone().lerp(tz[j + 1], u), b = tn[j].clone().lerp(tn[j + 1], u);
        if (Math.abs(a.x) > A[0] * 0.93) continue; // ne na zaobljenih koncih
        const g = new THREE.CylinderGeometry(0.0021, 0.0021, a.distanceTo(b) * 1.02, 6, 1);
        g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(gor, b.clone().sub(a).normalize()));
        const sr = a.add(b).multiplyScalar(0.5).addScaledVector(n, 0.0012);
        g.translate(sr.x, sr.y, sr.z);
        dezGeo.push(g);
      }
    }
  }
  const dez = new THREE.Mesh(zdruzi(dezGeo), mat(B.zer, { roughness: 0.3, clearcoat: 0.8, emissive: new THREE.Color(B.zer).multiplyScalar(0.25) }));
  group.add(plaz, dez);
  const pkT = piknje.reduce((a, p) => (p.dot(POG) > a.dot(POG) ? p : a), piknje[0]);
  del("plazmodezme", "Piknje s plazmodezmami", "Kanalčki skozi celično steno v tanjših mestih (piknjah); po njih je citoplazma povezana s sosednjimi celicami, v sredini teče cevka ER.", B.dvosloj, [plaz, dez], pkT.toArray());

  // ---------- celična membrana in citoplazma ----------
  // V prerezu: lipidni dvosloj (temni glavi, svetli repi) tik ob steni. Brez stene je membrana steklena.
  const memRob = new THREE.Mesh(rezPas(fSn, fM, q(140), skopo ? [[0, 0.2, 0x6a3fc8], [0.2, 0.8, 0xe6dcfb], [0.8, 1, 0x6a3fc8]] : [[0, 0.16, 0x6a3fc8], [0.16, 0.42, 0xd9cef8], [0.42, 0.58, 0xf6f0ff], [0.58, 0.84, 0xd9cef8], [0.84, 1, 0x6a3fc8]]),
    mat(0xffffff, { vertexColors: true, roughness: 0.42, clearcoat: 0.6, side: THREE.DoubleSide }));
  memRob.material.userData.rez = true;
  const memL = skoljka(fSn, qv(100), qv(70));
  memL.pokrov.dispose();
  const memSteklo = new THREE.Mesh(memL.odprta, V.steklo(mat(0x8e98e0, { side: THREE.FrontSide }), { a: 0.13, rf: 19, rob: "#8c9cff", rk: 1.3 }));
  const nad = (t) => ({ p: t.p.addScaledVector(t.n, 0.004), n: t.n });
  const belj = V.beljakovine(V.posej(memSteklo, st(420, 200)).map(nad), B.beljakovine, 0.011, { visina: 1.6 });
  memSteklo.visible = belj.visible = false;
  const citL = skoljka(fM, qv(100), qv(70));
  citL.pokrov.dispose();
  const citIn = new THREE.Mesh(citL.odprta, mat(0x3d3180, { roughness: 0.62, clearcoat: 0.25, sheen: 0.35, sheenColor: new THREE.Color(0x8d7ee0), side: THREE.BackSide }));
  group.add(memRob, memSteklo, belj, citIn);
  del("membrana", "Celična membrana", "Prožna plast iz dveh plasti fosfolipidov tik ob celični steni; uravnava, katere snovi vstopajo v celico in iz nje. Debelina je povečana.", B.membrana, [memRob, memSteklo, belj], [-0.2, 0.012, 0.54]);
  del("citoplazma", "Citoplazma", "Želatinasta tekočina med membrano in vakuolo; v njej so organeli in poteka veliko kemijskih reakcij.", "#5b4bb0", [citIn], [0.55, -0.5, -0.1]);

  // ---------- jedro (ob strani, ker ga vakuola potisne k steni) in osrednja vakuola ----------
  const RN = 0.17, N = v3(-0.52, 0, 0);
  const CV = v3(0.16, 0, 0), AV = [0.58, 0.385, 0.385], PV = 3.2;
  const smax = (a, b, s = 24) => Math.log(Math.exp(a * s) + Math.exp(b * s)) / s;
  const Fv = (p) => {
    const e = Math.pow(Math.pow(Math.abs(p.x - CV.x) / AV[0], PV) + Math.pow(Math.abs(p.y - CV.y) / AV[1], PV) + Math.pow(Math.abs(p.z - CV.z) / AV[2], PV), 1 / PV);
    return smax(e, (RN + 0.12) / Math.max(0.01, p.distanceTo(N)));
  };
  const pv = v3();
  const fV0 = (d) => { let lo = 0, h2 = 1.1; for (let i = 0; i < 26; i++) { const m = (lo + h2) / 2; if (Fv(pv.copy(d).multiplyScalar(m).add(CV)) < 1) lo = m; else h2 = m; } return lo; };
  const fV = (d) => fV0(d) * (1 + 0.02 * fbm(d.x * 3 + 1, d.y * 3, d.z * 3));
  const DV = 0.975, fVn = (d) => fV(d) * DV;
  const vVak = (p, m) => Fv(p) < 1 + m;

  const vak = skoljka(fV, qv(96), qv(64));
  vak.pokrov.dispose();
  const tonMat = V.steklo(mat(0x5fd0de, { side: THREE.FrontSide }), { a: 0.2, rf: 22, rob: "#8ff3ff", rk: 1.2 });
  const vakOut = new THREE.Mesh(vak.odprta, tonMat);
  const vakIn = new THREE.Mesh(skoljka(fVn, qv(96), qv(64)).odprta, mat(new THREE.Color(B.vakuola).multiplyScalar(0.5), { roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.06, sheen: 0.2, emissive: new THREE.Color(B.vakuola).multiplyScalar(0.16), side: THREE.BackSide, transparent: true, opacity: 0.6, depthWrite: false }));
  const vakRob = new THREE.Mesh(rezPas(fV, fVn, q(110), [[0, 0.2, 0x137d8c], [0.2, 0.8, 0xb8f4f8], [0.8, 1, 0x137d8c]]), mat(0xffffff, { vertexColors: true, roughness: 0.35, clearcoat: 0.7, side: THREE.DoubleSide }));
  for (const m of [vakOut, vakIn, vakRob]) { m.position.copy(CV); group.add(m); }
  // celični sok: raztopljene snovi kot redka svetla zrnca
  const sokT = [];
  for (let p = 0; sokT.length < st(140, 60) && p < 20000; p++) {
    const x = v3(CV.x + (rnd() * 2 - 1) * AV[0], (rnd() * 2 - 1) * AV[1], (rnd() * 2 - 1) * AV[2]);
    if (!vVak(x, -0.06) || vIzrezu(x, 0.01)) continue;
    sokT.push(x);
  }
  const sok = V.pike(sokT, 0x9ff3f0, 0.009, 0.5);
  group.add(sok);
  del("vakuola", "Osrednja vakuola", "Velik mehur s celičnim sokom (voda, sladkorji, soli, barvila); zavzema večino celice in jo s pritiskom vode drži napeto.", B.vakuola, [vakIn], [0.3, -0.12, -0.25]);
  del("tonoplast", "Tonoplast (membrana vakuole)", "Membrana, ki obdaja osrednjo vakuolo in uravnava prehod snovi med citoplazmo in celičnim sokom.", "#5fd0de", [vakOut, vakRob], [0.35, 0.0, 0.39]);

  // ---------- jedro ----------
  const oblJ = (d) => RN * (1 + 0.04 * sum(d.x * 2 + 9, d.y * 2, d.z * 2));
  const DJ = 0.88;
  const jl = skoljka(oblJ, q(64), q(44));
  const jMat = mat(B.jedro, { roughness: 0.3 });
  const jOut = new THREE.Mesh(jl.odprta, jMat);
  const jPokrov = new THREE.Mesh(jl.pokrov, jMat);
  jPokrov.visible = false;
  const jIn = new THREE.Mesh(skoljka((d) => oblJ(d) * DJ, q(52), q(36)).odprta, mat(0xa565f0, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide }));
  // dvojna jedrna ovojnica: dve membrani (vsaka dvosloj) s svetlim perinuklearnim prostorom
  const jRob = new THREE.Mesh(rezPas(oblJ, (d) => oblJ(d) * DJ, q(70), skopo ? [[0, 0.3, 0x6a2fd0], [0.3, 0.7, 0xe8d6ff], [0.7, 1, 0x6a2fd0]] : [[0, 0.05, 0x34107a], [0.05, 0.12, 0x6a2fd0], [0.12, 0.2, 0xc39af5], [0.2, 0.3, 0x6a2fd0],
    [0.3, 0.7, 0xe8d6ff], [0.7, 0.8, 0x6a2fd0], [0.8, 0.88, 0xc39af5], [0.88, 0.95, 0x6a2fd0], [0.95, 1, 0x34107a]]),
  mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }));
  for (const m of [jOut, jPokrov, jIn, jRob]) { m.position.copy(N); group.add(m); }
  const nPor = st(90, 50);
  const pore = new THREE.InstancedMesh(new THREE.TorusGeometry(0.0085, 0.0035, 4, q(8)), mat(B.ovojnica, { roughness: 0.4 }), nPor);
  const smer = v3();
  k = 0;
  while (k < nPor) {
    smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
    if (smer.lengthSq() > 1 || smer.lengthSq() < 0.05) continue;
    smer.normalize();
    if (vIzrezu(smer, 0.04)) continue;
    o.position.copy(smer).multiplyScalar(oblJ(smer) * 1.004).add(N);
    o.quaternion.setFromUnitVectors(Z, smer); o.updateMatrix();
    pore.setMatrixAt(k++, o.matrix);
  }
  group.add(pore);
  del("jedro", "Jedro", "Hrani DNK z navodili za delovanje celice; za osrednjo vakuolo je največji organel.", B.jedro, [jOut, jPokrov], [N.x - 0.05, N.y - 0.1, N.z + 0.13]);
  del("jedrna-ovojnica", "Jedrna ovojnica in pore", "Dvojna membrana okoli jedra (v prerezu dve temni plasti s presledkom); skozi jedrne pore potujejo snovi med jedrom in citoplazmo.", B.ovojnica, [jRob, pore], [N.x + 0.1, N.y + 0.002, N.z + 0.12]);
  del("nukleoplazma", "Nukleoplazma", "Tekočina v notranjosti jedra, v kateri sta kromatin in jedrce.", "#a565f0", [jIn], [N.x - 0.05, N.y - 0.06, N.z - 0.05]);
  const kromGeo = [];
  for (let i = 0; i < st(14, 8); i++) {
    const pts = [];
    let p = nakl(RN * 1.1);
    for (let s = 0; s < 9; s++) {
      p = p.clone().add(nakl(0.055));
      if (p.length() > RN * 0.78) p.multiplyScalar(0.7);
      pts.push(p);
    }
    kromGeo.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), q(30), 0.0045, q(5), false));
  }
  const krom = new THREE.Mesh(zdruzi(kromGeo), mat(B.kromatin, { roughness: 0.5, clearcoat: 0.5 }));
  krom.position.copy(N);
  group.add(krom);
  del("kromatin", "Kromatin", "Dolge niti DNK, navite na beljakovine; pred delitvijo celice se zgostijo v kromosome.", B.kromatin, [krom], [N.x + 0.03, N.y - 0.04, N.z - 0.03]);
  const jedrce = new THREE.Mesh(deformiraj(new THREE.SphereGeometry(0.058, q(32), q(22)), (v) => v.multiplyScalar(1 + 0.12 * fbm(v.x * 38, v.y * 38, v.z * 38))), mat(B.jedrce, { roughness: 0.55, clearcoat: 0.4 }));
  jedrce.position.set(N.x - 0.01, N.y + 0.02, N.z + 0.015);
  group.add(jedrce);
  del("jedrce", "Jedrce", "Gosto območje v jedru, kjer nastajajo deli ribosomov.", B.jedrce, [jedrce], jedrce.position.toArray());

  // ---------- endoplazemski retikulum: zrnate cisterne okoli jedra in mreža cevk tik pod membrano ----------
  const prostor = (p, m = 0.01) => notri(p, m) && !vVak(p, 0.015) && !vIzrezu(p, -0.002);
  const erPlasti = [], erRobovi = [];
  for (let s = 0; s < (hi && !lahka ? 3 : skopo ? 1 : 2); s++) {
    const rr = RN + 0.045 + s * 0.03;
    const val = (d) => 1 + 0.05 * Math.sin(d.x * 9 + s * 1.7) * Math.cos(d.y * 7 - s) + 0.03 * sum(d.x * 3 + s, d.y * 3, d.z * 3);
    const f = (d) => rr * val(d);
    erPlasti.push(obrezi(skoljka(f, q(64), q(40)).odprta, (p) => notri(p, 0.012) && !vVak(p, 0.01), N));
    erRobovi.push(...robIzreza(f, 0.0085, q(40), (p) => notri(p, 0.012) && !vVak(p, 0.01), N));
  }
  const erLu = { f: 16, prag: 0.7 };
  const erMat = V.sencilo(mat(0x3550d8, { roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.12, specularIntensity: 0.35, sheen: 0, envMapIntensity: 0.7, side: THREE.DoubleSide }),
    { vr: 2, rf: 70, k: 0.6, b: 0.22, s: 0.1, luknje: erLu });
  const er = new THREE.Mesh(zdruzi(erPlasti), erMat);
  const erRob = new THREE.Mesh(zdruzi(erRobovi), V.sencilo(mat(0x5a70f0, { roughness: 0.3, clearcoat: 1, sheen: 0.2, emissive: new THREE.Color(0x1a2280) }), { vr: 2, rf: 90, k: 0.6 }));
  for (const m of [er, erRob]) { m.position.copy(N); group.add(m); }
  const erTocke = V.posej(er, st(1500, 300), (p) => !V.vLuknji(p.clone().sub(N), erLu)).map((t) => t.p.addScaledVector(t.n, 0.006 * (rnd() < 0.5 ? 1 : -1)));
  // kortikalni ER: mnogokotna mreža tankih cevk tik pod membrano
  const korT = skopo ? [] : V.posej(citIn, st(260, 90), (p) => !vIzrezu(p, 0.02) && !vVak(p, 0.01)).map((t) => t.p.addScaledVector(t.n, -0.006));
  const korK = [], vez = new Set();
  korT.forEach((a, i) => {
    korT.map((b, j) => [a.distanceTo(b), j]).filter(([dd, j]) => j !== i && dd < 0.16).sort((x, y) => x[0] - y[0]).slice(0, 3).forEach(([, j]) => {
      const kl = Math.min(i, j) + "-" + Math.max(i, j);
      if (vez.has(kl)) return;
      vez.add(kl);
      const b = korT[j], m = a.clone().lerp(b, 0.5), l = m.length(), dm = m.clone().divideScalar(l);
      m.copy(dm).multiplyScalar(fM(dm) - 0.007).add(nakl(0.012));
      korK.push(new THREE.CatmullRomCurve3([a, m, b]));
    });
  });
  const korER = korK.length ? V.vlakna(korK, 0.0026, B.zer, { sij: 0.06, seg: 5, rad: 3 }) : null;
  if (korER) group.add(korER);
  del("er", "Endoplazemski retikulum", "Sistem membranskih cistern in cevk: zrnati ER ob jedru z ribosomi izdeluje beljakovine, mreža cevk pod membrano pa maščobe.", B.zer, [er, erRob, ...(korER ? [korER] : [])], [N.x + 0.215, N.y + 0.005, N.z + 0.09]);

  // ---------- kloroplasti (odprti: ovojnica, stroma, grana, škrobno zrno) ----------
  const KA = 0.13, KC = 0.045, KB = 0.085, KE = 0.006;
  const elip = (a, c, b) => (d) => 1 / Math.sqrt((d.x / a) ** 2 + (d.y / c) ** 2 + (d.z / b) ** 2);
  const fKz = elip(KA, KC, KB), fKn = elip(KA - KE, KC - KE, KB - KE);
  const kSk = skoljka(fKz, q(22), q(14));
  kSk.pokrov.dispose();
  const kOvojGeo = zdruzi([kSk.odprta, rezPas(fKz, fKn, q(14), [[0, 0.3, 0x1c6b24], [0.3, 0.6, 0xd4f5a8], [0.6, 1, 0x2f9a35]])], [B.kloroplast, null]);
  const stromaG = skoljka(fKn, q(22), q(14));
  stromaG.pokrov.dispose();
  // tilakoidi: grana (kupčki ploščic) in stromalni tilakoidi med njimi; v odprti četrtini (y > 0, z > 0) jih ni
  const SKR = v3(0.036, -0.015, 0.03);
  const tilG = [], granaP = [], RG = 0.0125, SP = 0.0064, DT = 0.0042;
  const kraj = (x, z) => (KC - KE) * Math.sqrt(Math.max(0, 1 - (x / (KA - KE)) ** 2 - (z / (KB - KE)) ** 2));
  for (let gx = -0.093; gx <= 0.094; gx += 0.031) for (let gz = -0.054; gz <= 0.055; gz += 0.0315) {
    const x = gx + (hash(gx * 9, gz * 7, 1) - 0.5) * 0.008, z = gz + (hash(gz * 5, gx * 3, 2) - 0.5) * 0.008;
    if ((x / (KA * 0.8)) ** 2 + (z / (KB * 0.78)) ** 2 > 1 || Math.hypot(x - SKR.x, z - SKR.z) < RG + 0.03) continue;
    if (Math.abs(z) < RG + 0.002) continue; // ne čez ravnino prereza z = 0
    const h = kraj(x, z) - 0.004 - DT / 2;
    // ploščice na skupni mreži y = (i + 0,5)·SP, da senčilnik nariše robove ploščic (en valj na kupček)
    const i0 = Math.ceil(-h / SP - 0.5), i1 = z > 0 ? -1 : Math.floor(h / SP - 0.5);
    if (i1 - i0 < 1) continue;
    granaP.push([x, z]);
    const yb = (i0 + 0.5) * SP - DT / 2, yt = (i1 + 0.5) * SP + DT / 2;
    const c = new THREE.CylinderGeometry(RG, RG, yt - yb, hi ? 10 : 7, 1);
    c.translate(x, (yb + yt) / 2, z);
    tilG.push(c);
  }
  // stromalni tilakoidi: tanke lamele med sosednjimi grani
  if (!skopo) granaP.forEach(([x, z], i) => granaP.forEach(([x2, z2], j) => {
    const dd = Math.hypot(x2 - x, z2 - z);
    if (j <= i || dd > 0.047) return;
    for (const y of [-0.0128, 0.0064]) {
      if (y > 0 && (z > 0 || z2 > 0)) continue;
      for (const st2 of [1, -1]) { // tanka ploskev z obeh strani
        const b = new THREE.PlaneGeometry(dd - RG * 1.6, 0.011).rotateX(-st2 * Math.PI / 2);
        b.rotateY(-Math.atan2(z2 - z, x2 - x));
        b.translate((x + x2) / 2, y + (i % 2 ? SP / 2 : -SP / 2) + st2 * 0.0006, (z + z2) / 2);
        tilG.push(b);
      }
    }
  }));
  const tilGeo = zdruzi(tilG.map((g) => g.toNonIndexed()));
  {
    const nrm = tilGeo.attributes.normal, pos = tilGeo.attributes.position, c = [], ay = [], tem = new THREE.Color(B.tilakoid), sv2 = new THREE.Color(0x63d65a);
    for (let i = 0; i < nrm.count; i++) {
      const kk = Math.abs(nrm.getY(i)), bok = kk < 0.5 ? 1 : 0, y = pos.getY(i);
      const b = tem.clone().lerp(sv2, bok * 0.8); c.push(b.r, b.g, b.b);
      ay.push(bok ? y : Math.round((y - SP / 2) / SP) * SP + SP / 2, bok);
    }
    tilGeo.setAttribute("color", new THREE.Float32BufferAttribute(c, 3));
    tilGeo.setAttribute("aY", new THREE.Float32BufferAttribute(ay, 2));
  }
  // kupček: bočna ploskev valja s svetlimi robovi ploščic in temnimi režami med njimi (relief v senčilniku)
  const tilMat = mat(0xffffff, { vertexColors: true, roughness: 0.3, clearcoat: 0.85, clearcoatRoughness: 0.12, sheen: 0.45, sheenColor: new THREE.Color(0x9ff08a), sheenRoughness: 0.4 });
  tilMat.userData.cv = { tilakoidi: true };
  {
    const dodaj = (m) => {
      m.onBeforeCompile = (sh) => {
        sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute vec2 aY;\nvarying vec2 vY;")
          .replace("#include <begin_vertex>", "#include <begin_vertex>\nvY = aY;");
        sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec2 vY;" + V.GLSL)
          .replace("#include <color_fragment>", `#include <color_fragment>
            float tp = vY.x / ${F(SP)}, ph = fract(tp), aw = fwidth(tp), hw = ${F(DT / SP / 2)};
            float disk = mix(1.0, smoothstep(0.5 - hw - aw, 0.5 - hw + aw, ph) * smoothstep(0.5 + hw + aw, 0.5 + hw - aw, ph), vY.y * clamp(2.0 - aw * 3.0, 0.0, 1.0));
            diffuseColor.rgb *= 0.3 + 0.7 * disk;
            float zh = disk * ${F(SP * 0.12)};`)
          .replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\nnormal = zvRelief(normal, zh, faceDirection);");
      };
      m.customProgramCacheKey = () => "rs-tilakoid";
      m.clone = function () { const c = new this.constructor().copy(this); dodaj(c); return c; };
    };
    dodaj(tilMat);
  }
  const skrGeo = deformiraj(new THREE.SphereGeometry(1, q(12), q(9)), (v) => { v.set(v.x * 0.026, v.y * 0.011, v.z * 0.018).multiplyScalar(1 + 0.06 * sum(v.x * 90, v.y * 90, v.z * 90)); v.add(SKR); });
  const nK = st(38, 13);
  const kOvoj = new THREE.InstancedMesh(kOvojGeo, mat(0xffffff, { vertexColors: true, roughness: 0.32, clearcoat: 0.9, side: THREE.DoubleSide }), nK);
  const stroma = new THREE.InstancedMesh(stromaG.odprta, mat(0xb5df6c, { roughness: 0.55, clearcoat: 0.35, side: THREE.DoubleSide }), nK);
  const tila = new THREE.InstancedMesh(tilGeo, tilMat, nK);
  const skrob = new THREE.InstancedMesh(skrGeo, mat(B.skrob, { roughness: 0.42, clearcoat: 0.6 }), nK);
  const klPol = [], M4 = new THREE.Matrix4(), ex = v3(), ey = v3(), ez = v3();
  k = 0;
  for (let p = 0; k < nK && p < 30000; p++) {
    const d = v3(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
    if (d.lengthSq() > 1 || d.lengthSq() < 0.05) continue;
    d.normalize();
    const S = d.clone().multiplyScalar(fM(d));
    ey.copy(grad(S)).negate();
    const s = 0.85 + 0.25 * rnd();
    const c = S.clone().addScaledVector(ey, KC * s + 0.006);
    ez.copy(POG).projectOnPlane(ey);
    if (ez.lengthSq() < 0.04) ez.set(1, 0, 0).projectOnPlane(ey);
    ez.normalize().applyAxisAngle(ey, (rnd() - 0.5) * 0.7);
    ex.crossVectors(ey, ez).normalize();
    const kraji = [ex.clone().multiplyScalar(KA * s), ex.clone().multiplyScalar(-KA * s), ez.clone().multiplyScalar(KB * s), ez.clone().multiplyScalar(-KB * s), ey.clone().multiplyScalar(KC * s)].map((x) => x.add(c));
    if (kraji.some((x) => !notri(x, 0.004) || vIzrezu(x, 0.004) || vVak(x, 0.005)) || c.distanceTo(N) < RN + 0.2 || klPol.some((x) => x.distanceTo(c) < 0.2 * s + 0.02)) continue;
    klPol.push(c);
    M4.makeBasis(ex, ey, ez).scale(v3(s, s, s)).setPosition(c);
    for (const m of [kOvoj, stroma, tila, skrob]) m.setMatrixAt(k, M4);
    k++;
  }
  for (const m of [kOvoj, stroma, tila, skrob]) { m.count = k; group.add(m); }
  const klT = klPol.reduce((a, p) => (p.dot(POG) + (vIzrezu(p, 0.08) ? 1 : 0) > a.dot(POG) + (vIzrezu(a, 0.08) ? 1 : 0) ? p : a), klPol[0]);
  del("kloroplast", "Kloroplast", "Zeleni organel z dvojno ovojnico, v katerem poteka fotosinteza: iz ogljikovega dioksida in vode z energijo svetlobe nastaneta glukoza in kisik.", B.kloroplast, [kOvoj], klT.toArray());
  del("tilakoidi", "Tilakoidi in grana", "Sploščeni membranski mešički s klorofilom, zloženi v kupčke (grana); v njih svetloba sproži prvi del fotosinteze.", B.tilakoid, [tila], klT.toArray());
  del("stroma", "Stroma", "Tekočina v kloroplastu okoli tilakoidov; v njej iz ogljikovega dioksida nastaja glukoza.", "#b5df6c", [stroma], klT.toArray());
  del("skrob", "Škrobno zrno", "Zaloga sladkorja v kloroplastu: glukozo iz fotosinteze rastlina shrani kot škrob.", B.skrob, [skrob], klT.toArray());

  // ---------- prost prostor v citoplazmi za manjše organele ----------
  const zasedeno = [];
  const prosto = (p, r) => prostor(p, r + 0.006) && !vIzrezu(p, r * 0.6) && p.distanceTo(N) > RN + r + 0.1 && !klPol.some((x) => x.distanceTo(p) < 0.1 + r) && !zasedeno.some((z) => z.p.distanceTo(p) < z.r + r + 0.012);
  function najdi(r, pogoj = () => true) {
    for (let p = 0; p < 40000; p++) {
      const x = v3((rnd() * 2 - 1) * 0.86, (rnd() * 2 - 1) * 0.55, (rnd() * 2 - 1) * 0.55);
      if (prosto(x, r) && pogoj(x)) { zasedeno.push({ p: x, r }); return x; }
    }
    return null;
  }
  // odprtina organela (izrez v lastnih koordinatah) gleda proti kameri
  const mW = v3(Math.sin(0.225 * Math.PI), 0, Math.cos(0.225 * Math.PI)), mP = v3(0, 1, 0).cross(mW);
  function protiKameri(e) {
    const w = POG.clone().add(v3(Math.sin(e.x * 2), Math.sin(e.y * 2), Math.sin(e.z * 2)).multiplyScalar(0.25)).normalize();
    const y = v3(Math.cos(e.x * 2.1), Math.sin(e.y * 1.7), Math.cos(e.z * 1.3)).projectOnPlane(w).normalize();
    const pp = y.clone().cross(w);
    const L = new THREE.Matrix4().makeBasis(mP, v3(0, 1, 0), mW), T = new THREE.Matrix4().makeBasis(pp, y, w);
    return T.multiply(L.transpose());
  }

  // ---------- Golgijev aparat: v rastlinski celici veliko majhnih kupčkov (diktiosomov) ----------
  function golgiGeo() {
    const zb = { pos: [], col: [], idx: [] };
    const mreza = (nU, nV, f, b) => {
      const off = zb.pos.length / 3, Pp = v3();
      for (let j = 0; j <= nV; j++) for (let i = 0; i <= nU; i++) { f(i / nU, j / nV, Pp); zb.pos.push(Pp.x, Pp.y, Pp.z); const c = b(i / nU, j / nV); zb.col.push(c[0], c[1], c[2]); }
      for (let j = 0; j < nV; j++) for (let i = 0; i < nU; i++) { const a = off + j * (nU + 1) + i, c = a + nU + 1; zb.idx.push(a, c, a + 1, a + 1, c, c + 1); }
    };
    const gCis = new THREE.Color(B.golgiSvetel), gTrans = new THREE.Color(0xd9781a), gRob = new THREE.Color(0xffeaa8), gC = new THREE.Color();
    const konci = [];
    for (let i = 0; i < 5; i++) {
      const R = 0.26 - i * 0.026, L = Math.PI * (0.74 - i * 0.05), a0 = Math.PI * (0.13 + i * 0.025), W = 0.06 * (1 - i * 0.04), T = 0.009;
      const prerez = (u, v) => {
        const s = 2 * u - 1, e = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(s), 6)), 0.3) * (1 + 0.7 * Math.pow(s, 4));
        const b = v * Math.PI * 2, cb = Math.cos(b), sb = Math.sin(b);
        return { cb, sb, rad: T * e * (1 + 3 * Math.pow(sb, 12)) * Math.sign(cb) * Math.pow(Math.abs(cb), 0.4), z: W * e * sb };
      };
      mreza(q(24), q(10), (u, v, Pp) => { const a = a0 + u * L, x = prerez(u, v), r = R + x.rad; Pp.set(Math.cos(a) * r, Math.sin(a) * r, x.z); },
        (u, v) => { const x = prerez(u, v); gC.copy(gCis).lerp(gTrans, i / 4).lerp(gRob, 0.3 * Math.pow(Math.abs(x.sb), 10)); const kk = 0.84 + 0.16 * x.cb; return [gC.r * kk, gC.g * kk, gC.b * kk]; });
      for (const u of [0, 1]) konci.push({ a: a0 + u * L + (u ? 1 : -1) * 0.13, r: R });
    }
    for (let n = 0; n < 8; n++) {
      let c;
      if (n % 2 === 0) { const kk = konci[(n * 3) % konci.length]; c = v3(Math.cos(kk.a) * kk.r, Math.sin(kk.a) * kk.r, (rnd() - 0.5) * 0.06); }
      else { const a = Math.PI * (0.2 + rnd() * 0.5), rr = 0.1 - rnd() * 0.03; c = v3(Math.cos(a) * rr, Math.sin(a) * rr, (rnd() - 0.5) * 0.08); }
      const r = 0.02 + rnd() * 0.01, bb = gC.copy(gCis).lerp(gTrans, n % 2 ? 0.9 : 0.4).clone();
      mreza(q(8), q(6), (u, v, Pp) => Pp.set(Math.sin(Math.PI * v) * Math.cos(2 * Math.PI * u), Math.cos(Math.PI * v), Math.sin(Math.PI * v) * Math.sin(2 * Math.PI * u)).multiplyScalar(r).add(c),
        (u, v) => { const kk = 0.8 + 0.2 * Math.cos(Math.PI * v); return [bb.r * kk, bb.g * kk, bb.b * kk]; });
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(zb.pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(zb.col, 3));
    g.setIndex(zb.idx);
    g.translate(-0.12, -0.12, 0);
    g.scale(0.36, 0.36, 0.36);
    g.computeVertexNormals();
    return g;
  }
  const nG = st(7, 3);
  const golgi = new THREE.InstancedMesh(golgiGeo(), mat(0xffffff, { vertexColors: true, roughness: 0.34, clearcoat: 0.85, side: THREE.DoubleSide }), nG);
  const golP = [];
  for (let i = 0; i < nG; i++) {
    const p = najdi(0.055, (x) => (i < 2 ? x.distanceTo(N) < RN + 0.3 : true));
    if (!p) break;
    golP.push(p);
    o.position.copy(p); o.quaternion.setFromUnitVectors(Z, POG); o.rotateZ(rnd() * 6.28); o.scale.setScalar(0.85 + rnd() * 0.3); o.updateMatrix();
    golgi.setMatrixAt(i, o.matrix);
  }
  golgi.count = golP.length;
  group.add(golgi);
  const golT = golP.reduce((a, p) => (p.dot(POG) > a.dot(POG) ? p : a), golP[0]);
  del("golgi", "Golgijev aparat", "Kupčki sploščenih membranskih vrečk (v rastlinski celici jih je veliko); dodelajo beljakovine in pripravijo snovi za celično steno.", B.golgi, [golgi], golT.toArray());

  // ---------- mitohondriji (v prerezu: zunanja membrana in kriste) ----------
  function mitohondrij() {
    const L = 0.12, r = 0.055, prof = [];
    for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 + (i / 12) * Math.PI; prof.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r + (a < 0 ? -L / 2 : L / 2))); }
    const zun = new THREE.LatheGeometry(prof, q(16), 0.5 * Math.PI, 1.45 * Math.PI);
    const not = new THREE.LatheGeometry(prof.map((p) => new THREE.Vector2(p.x * 0.86, p.y * 0.93)), q(16), 0.5 * Math.PI, 1.45 * Math.PI);
    const ix = not.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i]; ix[i] = ix[i + 2]; ix[i + 2] = t; }
    not.computeVertexNormals();
    const kr = [];
    for (let i = 0; i < 6; i++) {
      const y = -L / 2 - r * 0.45 + i * ((L + r * 0.9) / 5);
      const w = Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, Math.abs(y) - L / 2) / r, 2))) * r * 0.85;
      const c = new THREE.BoxGeometry(w * 1.5, 0.008, w * 1.6, 1, 1, 1);
      c.translate(i % 2 ? w * 0.25 : -w * 0.25, y, 0);
      kr.push(c);
    }
    const rez = [], rezB = [];
    for (const a of [0.5 * Math.PI, 1.95 * Math.PI]) for (const [t0, t1, b] of [[0, 0.32, 0xb4621a], [0.32, 0.62, 0xffe6b0], [0.62, 1, 0xe8a032]]) {
      const pos = [], idx = [];
      prof.forEach((pt) => { for (const t of [t0, t1]) { const sx = 1 - 0.14 * t, sy = 1 - 0.07 * t; pos.push(pt.x * sx * Math.sin(a), pt.y * sy, pt.x * sx * Math.cos(a)); } });
      for (let i = 0; i < prof.length - 1; i++) { const j = i * 2; idx.push(j, j + 2, j + 1, j + 1, j + 2, j + 3); }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idx); g.computeVertexNormals();
      rez.push(g); rezB.push(b);
    }
    const g = zdruzi([zun, not, ...kr, ...rez], [0xd98a1e, 0xf0b24a, ...kr.map(() => 0xffd67e), ...rezB]);
    const p = g.attributes.position, v = v3(), H = L / 2 + r;
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const t = v.y / H, w = 1 + 0.07 * Math.sin(t * 3.1 + 0.6) + 0.04 * sum(v.x * 40, v.y * 40, v.z * 40);
      p.setXYZ(i, v.x * w + 0.032 * (t * t - 0.4), v.y, v.z * w);
    }
    g.computeVertexNormals();
    g.scale(0.4, 0.4, 0.4);
    return g;
  }
  const nMit = skopo ? 3 : st(26, 8);
  const mit = new THREE.InstancedMesh(mitohondrij(), mat(0xffffff, { vertexColors: true, roughness: 0.38, side: THREE.DoubleSide }), nMit);
  const mitP = [];
  for (let i = 0; i < nMit; i++) {
    const p = najdi(0.034);
    if (!p) break;
    mitP.push(p);
    o.position.copy(p); o.quaternion.setFromRotationMatrix(protiKameri(v3(rnd() * 3, rnd() * 3, rnd() * 3))); o.scale.setScalar(0.85 + rnd() * 0.35); o.scale.y *= 0.8 + 0.45 * rnd(); o.updateMatrix();
    mit.setMatrixAt(i, o.matrix);
  }
  mit.count = mitP.length;
  group.add(mit);
  const vidnaT = (tt) => !tt.length ? v3(0.3, -0.3, 0.3) : tt.reduce((a, p) => ((vIzrezu(p, 0.12) ? 1 : 0) + p.dot(POG) > (vIzrezu(a, 0.12) ? 1 : 0) + a.dot(POG) ? p : a), tt[0]);
  del("mitohondrij", "Mitohondrij", "Pri celičnem dihanju iz glukoze in kisika pridobi energijo (ATP); potrebujejo ga tudi rastlinske celice. Notranja membrana je nagubana v kriste.", B.mitohondrij, [mit], vidnaT(mitP).toArray());

  // ---------- peroksisomi (ob kloroplastih) ----------
  const nPer = st(14, 6);
  const perG = new THREE.SphereGeometry(0.02, q(14), q(10));
  deformiraj(perG, (v) => v.multiplyScalar(1 + 0.09 * sum(v.x * 80, v.y * 80, v.z * 80)));
  const per = new THREE.InstancedMesh(perG, mat(B.peroksisom, { roughness: 0.4, clearcoat: 0.6 }), nPer);
  const perP = [];
  for (let i = 0; i < nPer; i++) {
    const p = najdi(0.022, (x) => klPol.some((c) => c.distanceTo(x) < 0.2));
    if (!p) break;
    perP.push(p);
    o.position.copy(p); o.rotation.set(rnd() * 3, rnd() * 3, 0); o.scale.setScalar(0.8 + rnd() * 0.4); o.updateMatrix();
    per.setMatrixAt(i, o.matrix);
  }
  per.count = perP.length;
  group.add(per);
  del("peroksisom", "Peroksisom", "Majhen mehurček z encimi; v listnih celicah sodeluje s kloroplasti in mitohondriji in razgrajuje strupeni vodikov peroksid.", B.peroksisom, [per], vidnaT(perP).toArray());

  // ---------- ribosomi (na zrnatem ER in prosti, posamezni in v verižicah) ----------
  const nRib = st(2100, 360);
  const ribGeo = hi ? new THREE.IcosahedronGeometry(0.0052, 0) : new THREE.OctahedronGeometry(0.006, 0);
  ribGeo.scale(1, 0.82, 1.12);
  const rib = new THREE.InstancedMesh(ribGeo, mat(B.ribosomi, { roughness: 0.28, clearcoat: 0.9, emissive: new THREE.Color(B.ribosomi).multiplyScalar(0.22) }), nRib);
  k = 0;
  for (; k < nRib * 0.4 && k < erTocke.length; k++) {
    o.position.copy(erTocke[k]); o.rotation.set(rnd() * 3, rnd() * 3, 0); o.scale.setScalar(0.8 + rnd() * 0.45); o.updateMatrix(); rib.setMatrixAt(k, o.matrix);
  }
  const korP = v3();
  for (let p = 0; k < nRib && p < 300000; p++) {
    smer.set((rnd() * 2 - 1) * 0.86, (rnd() * 2 - 1) * 0.55, (rnd() * 2 - 1) * 0.55);
    if (!prostor(smer, 0.012) || smer.distanceTo(N) < RN + 0.015 || klPol.some((c) => c.distanceTo(smer) < 0.075)) continue;
    const n = rnd() < 0.4 ? 4 + Math.floor(rnd() * 5) : 1;
    korP.set(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).setLength(0.013);
    for (let j = 0; j < n && k < nRib; j++) {
      o.position.copy(smer); o.rotation.set(rnd() * 3, rnd() * 3, 0); o.scale.setScalar(0.8 + rnd() * 0.45); o.updateMatrix(); rib.setMatrixAt(k++, o.matrix);
      korP.applyAxisAngle(o.up, 0.5).add(nakl(0.006)).setLength(0.013);
      smer.add(korP);
    }
  }
  rib.count = k;
  o.scale.setScalar(1);
  group.add(rib);
  del("ribosomi", "Ribosomi", "Drobna zrnca, ki po navodilih iz DNK sestavljajo beljakovine; nekatera prosto plavajo, druga sedijo na zrnatem ER.", B.ribosomi, [rib], [N.x + 0.24, N.y + 0.02, N.z + 0.02]);

  // ---------- citoskelet: kortikalni mikrotubuli (prečni obroči pod membrano) in aktinska vlakna ----------
  const mtK = [], akK = [];
  for (let i = 0; i < st(46, 18); i++) {
    const x = -0.78 + rnd() * 1.56, f0a = Math.PI / 2 + 0.06 + rnd() * Math.PI * 1.1, L = 0.5 + rnd() * 1.1, pts = [];
    for (let j = 0; j <= 10; j++) {
      const fi = Math.min(Math.PI * 2 - 0.06, f0a + (L * j) / 10);
      const d = v3(x, Math.cos(fi), Math.sin(fi)).normalize();
      pts.push(d.clone().multiplyScalar(fM(d) - 0.01));
    }
    mtK.push(new THREE.CatmullRomCurve3(pts));
  }
  for (let i = 0, p = 0; i < st(14, 6) && p < 2000; p++) {
    const fi = Math.PI / 2 + 0.25 + rnd() * (Math.PI * 1.5 - 0.5), pts = [];
    for (let j = 0; j <= 8; j++) {
      const x = -0.72 + (1.44 * j) / 8, d = v3(x, Math.cos(fi + 0.12 * Math.sin(j + i)), Math.sin(fi + 0.12 * Math.sin(j + i))).normalize();
      pts.push(d.clone().multiplyScalar(fM(d) - 0.035 - 0.01 * Math.sin(j * 1.3 + i)));
    }
    if (pts.some((x) => vVak(x, 0.005))) continue;
    akK.push(new THREE.CatmullRomCurve3(pts));
    i++;
  }
  const cito = V.vlakna(mtK, 0.0026, B.citoskelet, { sij: 0.45, seg: hi ? 22 : 12, rad: hi ? 4 : 3 });
  const aktin = akK.length ? V.vlakna(akK, 0.0022, B.aktin, { sij: 0.4, seg: hi ? 20 : 10, rad: 3 }) : null;
  group.add(cito);
  if (aktin) group.add(aktin);
  del("citoskelet", "Citoskelet", "Mreža beljakovinskih vlaken: mikrotubuli pod membrano usmerjajo nalaganje celuloze v steno, po aktinskih vlaknih se premikajo organeli.", B.citoskelet, [cito, ...(aktin ? [aktin] : [])], mtK[0].getPoint(0.5).toArray());

  // ---------- mešički (od Golgijevega aparata do membrane nesejo snovi za steno) ----------
  const nVez = st(18, 9);
  const mesi = new THREE.InstancedMesh(new THREE.SphereGeometry(0.014, q(10), q(8)), mat(B.mesicki, { roughness: 0.16, clearcoat: 1 }), nVez);
  const poti = [];
  for (let i = 0, p = 0; i < nVez && p < 2000 && golP.length; p++) {
    const a = golP[i % golP.length], d = a.clone().add(nakl(0.6)).normalize(), b = d.clone().multiplyScalar(fM(d) - 0.02);
    if (vIzrezu(b, 0.02) || a.distanceTo(b) > 0.35 || [0.3, 0.6].some((u) => vVak(a.clone().lerp(b, u), 0))) continue;
    poti.push({ a, b, f: i / nVez, s: 0.75 + 0.5 * rnd() });
    i++;
  }
  function postaviMesicke(t) {
    poti.forEach((p, i) => {
      const u = (p.f + t * 0.06) % 1;
      o.position.copy(p.a).lerp(p.b, 0.2 + u * 0.8); o.rotation.set(0, 0, 0); o.scale.setScalar(p.s); o.updateMatrix(); mesi.setMatrixAt(i, o.matrix);
    });
    mesi.count = poti.length;
    mesi.instanceMatrix.needsUpdate = true;
  }
  postaviMesicke(0);
  group.add(mesi);
  del("mesicki", "Mešički", "Mehurčki, ki od Golgijevega aparata do membrane nesejo snovi za gradnjo celične stene in jih izločijo iz celice.", B.mesicki, [mesi], poti.length ? poti[0].a.clone().lerp(poti[0].b, 0.6).toArray() : golT.toArray());

  // drobna zrnca v citoplazmi (beljakovinski kompleksi): temna in majhna
  const zrnT = [];
  for (let p = 0; zrnT.length < st(3200, 1200) && p < 200000; p++) {
    const x = v3((rnd() * 2 - 1) * 0.86, (rnd() * 2 - 1) * 0.56, (rnd() * 2 - 1) * 0.56);
    if (prostor(x, 0.012) && x.distanceTo(N) > RN + 0.02) zrnT.push(x);
  }
  const zrn = V.pike(zrnT, 0x8a74e8, 0.0058, 0.5);
  group.add(zrn);

  // ---------- nadzor ----------
  const stenaDeli = [stenaOut, lamela, stenaRez, plaz, dez];
  const nadzor = [
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Cela celica"], ["brez-stene", "Brez stene"]], vrednost: "prerez",
      ob: (v) => {
        const cela = v === "cela", brez = v === "brez-stene";
        for (const m of stenaDeli) m.visible = !brez;
        pokrov.visible = cela;
        lamela.visible = stenaRez.visible = dez.visible = !cela && !brez;
        memRob.visible = !cela;
        memSteklo.visible = belj.visible = brez;
      },
    },
  ];
  if (zac.prikaz) nadzor[0].vrednost = zac.prikaz;
  nadzor[0].ob(nadzor[0].vrednost);

  // rahle razlike v svetlosti med ponovljenimi deli
  {
    const c = new THREE.Color();
    group.traverse((m) => {
      if (!m.isInstancedMesh || m.instanceColor) return;
      for (let i = 0; i < m.instanceMatrix.count; i++) { const kk = 0.88 + 0.2 * hash(i * 1.37, m.instanceMatrix.count * 0.11, 7); m.setColorAt(i, c.setRGB(kk, kk, kk)); }
    });
  }

  // Prerez celične stene v senčilniku: plast 0 = srednja lamela (temen pektin), 1 = primarna stena (plasti celuloznih
  // vlaken, prečno prerezana vlakna kot pike). Na istih mestih kot dezmotubuli so kanali plazmodezm (obloženi z membrano).
  function stenaRezMat(D, plast) {
    const m = mat(0xffffff, { roughness: 0.5, clearcoat: 0.45, clearcoatRoughness: 0.2, sheen: 0.3, sheenColor: new THREE.Color(0xe0ffb8), side: THREE.DoubleSide });
    m.userData.rez = true;
    const sv1 = new THREE.Color(B.stena).convertLinearToSRGB(), sv0 = new THREE.Color(B.stenaTemna).convertLinearToSRGB();
    const C = (c, k = 1) => `vec3(${F(c.r * k)}, ${F(c.g * k)}, ${F(c.b * k)})`;
    function dodaj(m) {
      m.onBeforeCompile = (sh) => {
        sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute vec2 aRez;\nvarying vec2 vRez;")
          .replace("#include <begin_vertex>", "#include <begin_vertex>\nvRez = aRez;");
        sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec2 vRez;" + V.GLSL)
          .replace("#include <color_fragment>", `#include <color_fragment>
            float D = ${F(D)}, t = vRez.y, y = t * D, s = vRez.x, aa = max(fwidth(s), 1e-5), at = max(fwidth(t), 1e-5);
            float fl = (fract(s / ${F(PER)}) - 0.5) * ${F(PER)};
            float kx = fl - floor(fl / ${F(KW)} + 0.5) * ${F(KW)};
            float vp = step(abs(fl), ${F(HW)});
            float kan = vp * smoothstep(${F(KR)} + aa, ${F(KR)} - aa, abs(kx));
            float lin = kan * smoothstep(${F(KR * 0.55)}, ${F(KR * 0.8)}, abs(kx));
            vec3 bv;
            float zh;
            ${plast === 0 ? `
            float g = zvS(vec3(s * 700.0, y * 700.0, 3.0)) * 0.6 + zvS(vec3(s * 1500.0, y * 1500.0, 5.0)) * 0.4;
            bv = vec3(0.4, 0.33, 0.1) * (0.72 + 0.5 * g);
            bv *= 1.0 - 0.3 * (1.0 - smoothstep(0.0, 0.04, t));
            zh = g * D * 0.03;` : `
            float w = zvS(vec3(s * 140.0, y * 140.0, 1.0));
            float u = (t - ${F(TL)}) / ${F(1 - TL)} * 37.7 + w * 2.4;
            float lam = mix(0.5, 0.5 + 0.5 * sin(u), clamp(1.6 - at * 37.7 / ${F(1 - TL)} * 1.2, 0.0, 1.0));
            float vl = zvS(vec3(s * 620.0, y * 620.0, 2.0)), dt = smoothstep(0.66, 0.78, vl) * clamp(1.6 - aa * 620.0, 0.0, 1.0);
            bv = mix(${C(sv0, 0.9)}, ${C(sv1, 1.08)}, 0.2 + 0.65 * lam);
            bv = mix(bv, vec3(0.86, 0.96, 0.62), dt * 0.55);
            bv *= 1.0 - 0.28 * (1.0 - smoothstep(0.0, 0.035, t - ${F(TL)})) - 0.3 * (1.0 - smoothstep(0.0, 0.05, 1.0 - t));
            zh = (lam * 0.03 + dt * 0.04) * D;`}
            bv = mix(bv, vec3(0.2, 0.15, 0.42), kan);
            bv = mix(bv, vec3(0.93, 0.64, 0.8), lin);
            zh -= kan * D * 0.06;
            diffuseColor.rgb = pow(bv, vec3(2.2));`)
          .replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\nnormal = zvRelief(normal, zh, faceDirection);");
      };
      m.customProgramCacheKey = () => "rs-stena-" + plast + "-" + F(D);
      m.clone = function () { const c = new this.constructor().copy(this); dodaj(c); return c; };
    }
    dodaj(m);
    return m;
  }

  const vKl = (p) => klPol.reduce((kk, c) => kk * (1 - 0.32 * Math.max(0, 1 - c.distanceTo(p) / 0.18)), 1);
  V.poliraj(group, deli, {
    "celicna-stena": { tex: "gube", rf: 30, k: 2.2, b: 0.34, s: 0.12, lisa: 0.2, f: 3.2, sheen: 0.3, rough: 0.5, cc: 0.45, ccr: 0.16, ton: 1, temni: 0.66 },
    plazmodezme: { tex: null },
    membrana: { tex: null },
    citoplazma: { tex: "fino", rf: 34, k: 1.1, b: 0.24, lisa: 0.22, f: 3.5, ao: (p) => (0.8 + 0.2 * Math.min(1, Math.max(0, 0.5 + 0.6 * (p.y + p.z) / (Math.hypot(p.y, p.z) * 1.414 || 1)))) * vKl(p) },
    vakuola: { tex: "zrna", rf: 9, k: 0.6, b: 0.08, lisa: 0.12, f: 2.5, rough: 0.2, cc: 0.85, ccr: 0.06, ton: 0.7,
      ao: (p) => 0.8 + 0.2 * Math.min(1, Math.max(0, 0.5 + 0.7 * (p.y + p.z) / (Math.hypot(p.y, p.z) * 1.414 || 1))) },
    tonoplast: { tex: null },
    jedro: { tex: "zrna", rf: 50, k: 1.2, b: 0.2, lisa: 0.12, f: 9 },
    "jedrna-ovojnica": { tex: null },
    nukleoplazma: { tex: "fino", rf: 70, k: 0.9, b: 0.22, lisa: 0.2, f: 12 },
    kromatin: { rf: 160, k: 0.6 },
    jedrce: { tex: "zrna", rf: 110, k: 1.4, b: 0.25 },
    er: { tex: "fino", rf: 80, k: 0.8 },
    golgi: { tex: "fino", rf: 110, k: 0.8 },
    kloroplast: { tex: "zrna", rf: 90, k: 0.9, b: 0.2 },
    stroma: { tex: "fino", rf: 140, k: 0.8, b: 0.22 },
    skrob: { tex: "zrna", rf: 200, k: 0.8 },
    mitohondrij: { tex: "zrna", rf: 150, k: 0.7, b: 0.18 },
    peroksisom: { tex: "zrna", rf: 160, k: 0.9, b: 0.25 },
    mesicki: { rf: 120, k: 0.6 },
    ribosomi: { tex: null },
    citoskelet: { tex: null },
    "srednja-lamela": { tex: null },
  });

  // stikalo »Barve kot v učbeniku« (skupno vsem celicam)
  nadzor.push(V.barveUcbenika(deli, { vakuola: "#4aa6d8", "srednja-lamela": "#3f6a1e", tilakoidi: "#1d6b28", stroma: "#b9e08c", skrob: "#f2ecd6", er: "#4f95e8" }));

  return {
    group,
    // seznam delov kaže le dele, ki so v trenutnem prikazu vidni
    get deli() { return deli.filter((d) => d.meshes.some((m) => { for (let x = m; x; x = x.parent) if (!x.visible) return false; return true; })); },
    nadzor,
    oder: "celica",
    pogled: POG.toArray(),
    korak(t) {
      if (!gib) return;
      postaviMesicke(t);
      group.rotation.y = Math.sin(t * 0.15) * 0.04;
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
