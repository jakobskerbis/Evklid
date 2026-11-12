// Pravi presek mreže z ravnino reza (organ.js, tkivo.rezPresek): namesto pokrova iz zadnjih ploskev (ta pokaže vse, kar
// je za ravnino v praznem prostoru med deli, npr. med ledvičnimi piramidami) izračunamo obris preseka in ga zapolnimo s
// trikotniki. Rez je zato poln in pri vrtenju enak, kot pri pravem prerezanem organu.
// Brez three (preizkus test/3d-organ-presek.test.js); triangulacijo mnogokotnika z luknjami poda klicatelj
// (organ.js: THREE.ShapeUtils.triangulateShape).

// Ploščina s predznakom (2D, točke [x, y]).
export function ploscina(zanka) {
  let s = 0;
  for (let i = 0, j = zanka.length - 1; i < zanka.length; j = i++) s += zanka[j][0] * zanka[i][1] - zanka[i][0] * zanka[j][1];
  return s / 2;
}

function vZanki(p, zanka) {
  let v = false;
  for (let i = 0, j = zanka.length - 1; i < zanka.length; j = i++) {
    const a = zanka[i], b = zanka[j];
    if (a[1] > p[1] !== b[1] > p[1] && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) v = !v;
  }
  return v;
}

// Sklenjene zanke preseka. pos: položaji (3 na oglišče), idx: indeksi trikotnikov, ravnina n·x + d = 0 (n enotski).
// Oglišča se najprej zvarijo po položaju (šivi UV), točka preseka je vezana na rob mreže, zato se zanke sklenejo natanko.
// Odprte verige (luknja v mreži, nemnogoteren rob) odpadejo. Vrne { zanke: [[x, y], …][], O, U, V } (2D v ravnini:
// točka = O + x·U + y·V).
export function zankePreseka(pos, idx, n, d, zvar = 2e-5) {
  const nv = pos.length / 3;
  const kljuci = new Map();
  const w = new Uint32Array(nv);
  const raz = [];
  const prvi = [];
  for (let i = 0; i < nv; i++) {
    const k = `${Math.round(pos[i * 3] / zvar)},${Math.round(pos[i * 3 + 1] / zvar)},${Math.round(pos[i * 3 + 2] / zvar)}`;
    let j = kljuci.get(k);
    if (j === undefined) {
      j = raz.length;
      kljuci.set(k, j);
      const r = n[0] * pos[i * 3] + n[1] * pos[i * 3 + 1] + n[2] * pos[i * 3 + 2] + d;
      raz.push(Math.abs(r) < 1e-7 ? 1e-7 : r); // oglišče na ravnini: malenkost na ohranjeno stran
      prvi.push(i);
    }
    w[i] = j;
  }
  const u0 = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const kriz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const enota = (a) => { const l = Math.hypot(...a) || 1; return a.map((x) => x / l); };
  const U = enota(kriz(u0, n));
  const V = kriz(n, U);
  const O = n.map((x) => -d * x);
  const tocke = []; // 2D
  const sos = [];
  const poRobu = new Map();
  const tocka = (a, b) => {
    const k = a < b ? a * 4294967296 + b : b * 4294967296 + a;
    let t = poRobu.get(k);
    if (t === undefined) {
      const f = raz[a] / (raz[a] - raz[b]);
      const pa = prvi[a] * 3, pb = prvi[b] * 3;
      const p = [0, 1, 2].map((c) => pos[pa + c] + (pos[pb + c] - pos[pa + c]) * f - O[c]);
      t = tocke.length;
      tocke.push([p[0] * U[0] + p[1] * U[1] + p[2] * U[2], p[0] * V[0] + p[1] * V[1] + p[2] * V[2]]);
      sos.push([]);
      poRobu.set(k, t);
    }
    return t;
  };
  for (let f = 0; f + 2 < idx.length; f += 3) {
    const a = w[idx[f]], b = w[idx[f + 1]], c = w[idx[f + 2]];
    if (a === b || b === c || a === c) continue;
    const sa = raz[a] > 0, sb = raz[b] > 0, sc = raz[c] > 0;
    if (sa === sb && sb === sc) continue;
    const [p, q] = sa === sb ? [tocka(a, c), tocka(b, c)] : sa === sc ? [tocka(a, b), tocka(c, b)] : [tocka(b, a), tocka(c, a)];
    sos[p].push(q);
    sos[q].push(p);
  }
  const obiskana = new Uint8Array(tocke.length);
  const zanke = [];
  for (let s = 0; s < tocke.length; s++) {
    if (obiskana[s] || sos[s].length !== 2) continue;
    const z = [];
    let prej = -1, t = s, sklenjena = false;
    while (true) {
      obiskana[t] = 1;
      z.push(tocke[t]);
      const nasl = sos[t][0] !== prej ? sos[t][0] : sos[t][1];
      if (nasl === s) { sklenjena = z.length >= 3; break; }
      if (nasl === undefined || obiskana[nasl] || sos[nasl].length !== 2) break;
      prej = t;
      t = nasl;
    }
    if (sklenjena) zanke.push(z);
  }
  return { zanke, O, U, V };
}

// Izbočena ovojnica točk (Andrew), v nasprotni smeri urinega kazalca.
export function ovojnica(tocke) {
  const t = [...tocke].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const kriz = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const pol = (seznam) => {
    const h = [];
    for (const p of seznam) {
      while (h.length >= 2 && kriz(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop();
      h.push(p);
    }
    h.pop();
    return h;
  };
  return [...pol(t), ...pol(t.reverse())];
}

// Zapolnjen presek: { polozaji: Float32Array (3D, na ravnini), indeksi: number[], vrste: Float32Array } ali null, če
// ravnina mreže ne seka; os = { O, U, V } ravnine. vrste (na oglišče): 0 = ploskev preseka, 1 = obroba (rob), 2 = zapolnjena luknja (luknje).
// idx: indeksi trikotnikov ali seznam takih polj (vsako zaprto telo posebej: zanke sosednjih teles se ne gnezdijo).
// polno: samo zunanji obrisi brez lukenj (lupina z votlino postane polna ploskev).
// ovoj: ena sama ploskev, izbočena ovojnica vseh zank (podlaga pod drugimi plastmi).
// rob: polovična širina obrobe vzdolž vsakega obrisa (enote mreže; zapre špranjo med sosednjima telesoma iste plasti).
// luknje: luknje preseka (svetlina cevi z dvojno steno) dobijo svojo ploskev (vrsta 2) namesto praznine; obris brez lukenj
// (polna cev) je ves svetlina (vrsta 2), njegovo steno nariše obroba (rob).
// brezPloskve: samo obroba (stena votlega organa: ledvični meh), ploskve preseka ni.
// povecaj: faktor, s katerim se vsaka zanka poveča okoli svojega težišča (1,02: sosednji telesi se prekrijeta).
// trianguliraj(obris, luknje) → [[a, b, c], …] z indeksi v obris, nato luknje po vrsti (kot THREE.ShapeUtils.triangulateShape).
// najPloscina: zanke z manjšo ploščino odpadejo (drobir).
export function presekMreze(pos, idx, n, d, { polno = false, ovoj = false, luknje: zapolniLuknje = false, brezPloskve = false, povecaj = 1, rob = 0, trianguliraj, najPloscina = 1e-7 } = {}) {
  const polozaji = [];
  const indeksi = [];
  const vrste = []; // na oglišče: 0 ploskev, 1 obroba, 2 zapolnjena luknja
  const vseZanke = [];
  // obroba: trak širine 2·rob vzdolž obrisa (zapre špranjo do sosednjega telesa iste plasti; z drugo barvo stena ali ovojnica)
  const obroba = (z, { O, U, V }) => {
    for (let a = 0; a < z.length; a++) {
      const p = z[a], q = z[(a + 1) % z.length];
      const l = Math.hypot(q[0] - p[0], q[1] - p[1]);
      if (l < 1e-9) continue;
      const nx = (-(q[1] - p[1]) / l) * rob, ny = ((q[0] - p[0]) / l) * rob;
      const i0 = polozaji.length / 3;
      for (const [x, y] of [[p[0] + nx, p[1] + ny], [p[0] - nx, p[1] - ny], [q[0] - nx, q[1] - ny], [q[0] + nx, q[1] + ny]]) {
        for (let c = 0; c < 3; c++) polozaji.push(O[c] + x * U[c] + y * V[c]);
        vrste.push(1);
      }
      indeksi.push(i0, i0 + 1, i0 + 2, i0, i0 + 2, i0 + 3);
      // zaobljen stik s prejšnjim odsekom: trikotnika od oglišča do obeh robov (brez zareze na zunanji strani ovinka)
      const o = z[(a + z.length - 1) % z.length];
      const lo = Math.hypot(p[0] - o[0], p[1] - o[1]);
      if (lo < 1e-9) continue;
      const mx = (-(p[1] - o[1]) / lo) * rob, my = ((p[0] - o[0]) / lo) * rob;
      const j0 = polozaji.length / 3;
      for (const [x, y] of [[p[0], p[1]], [p[0] + mx, p[1] + my], [p[0] + nx, p[1] + ny], [p[0] - mx, p[1] - my], [p[0] - nx, p[1] - ny]]) {
        for (let c = 0; c < 3; c++) polozaji.push(O[c] + x * U[c] + y * V[c]);
        vrste.push(1);
      }
      indeksi.push(j0, j0 + 1, j0 + 2, j0, j0 + 3, j0 + 4);
    }
  };
  let os = null;
  for (const del of typeof idx[0] === "number" ? [idx] : idx) {
    const { zanke, O, U, V } = zankePreseka(pos, del, n, d);
    os = { O, U, V };
    let dobre = zanke.filter((z) => Math.abs(ploscina(z)) > najPloscina);
    if (povecaj !== 1) {
      // vsaka zanka malo večja okoli svojega težišča: sosednji telesi iste plasti se prekrijeta (brez špranje med njima)
      dobre = dobre.map((z) => {
        const c = [z.reduce((a, p) => a + p[0], 0) / z.length, z.reduce((a, p) => a + p[1], 0) / z.length];
        return z.map((p) => [c[0] + (p[0] - c[0]) * povecaj, c[1] + (p[1] - c[1]) * povecaj]);
      });
    }
    if (ovoj) {
      vseZanke.push(...dobre);
      if (rob > 0) for (const z of dobre) obroba(z, os);
      continue;
    }
    // globina gnezdenja: v koliko drugih zankah leži zanka
    const v = dobre.map((z, i) => dobre.map((y, j) => i !== j && vZanki(z[0], y)));
    const globina = v.map((r) => r.filter(Boolean).length);
    dobre.forEach((z, i) => {
      if (polno ? globina[i] !== 0 : globina[i] % 2 !== 0) return;
      const luknje = polno ? [] : dobre.filter((_, j) => globina[j] === globina[i] + 1 && v[j][i]);
      const vse = [z, ...luknje].flat();
      const zacetek = polozaji.length / 3;
      for (const p of vse) for (let c = 0; c < 3; c++) polozaji.push(O[c] + p[0] * U[c] + p[1] * V[c]);
      if (!brezPloskve) for (const t of trianguliraj(z, luknje)) indeksi.push(zacetek + t[0], zacetek + t[1], zacetek + t[2]);
      // polna cev brez notranje stene (obris brez lukenj): vsa ploskev je svetlina, steno nariše obroba
      for (let i = 0; i < vse.length; i++) vrste.push(zapolniLuknje && !luknje.length ? 2 : 0);
      if (zapolniLuknje) {
        for (const l of luknje) {
          const z2 = polozaji.length / 3;
          for (const p of l) { for (let c = 0; c < 3; c++) polozaji.push(O[c] + p[0] * U[c] + p[1] * V[c]); vrste.push(2); }
          for (const t of trianguliraj(l, [])) indeksi.push(z2 + t[0], z2 + t[1], z2 + t[2]);
        }
      }
      if (rob > 0) obroba(z, os);
    });
  }
  if (ovoj && vseZanke.length) {
    const h = ovojnica(vseZanke.flat());
    const z0 = polozaji.length / 3;
    for (const p of h) { for (let c = 0; c < 3; c++) polozaji.push(os.O[c] + p[0] * os.U[c] + p[1] * os.V[c]); vrste.push(0); }
    for (let i = 1; i + 1 < h.length; i++) indeksi.push(z0, z0 + i, z0 + i + 1);
  }
  return indeksi.length ? { polozaji: new Float32Array(polozaji), indeksi, vrste: new Float32Array(vrste), os } : null;
}
