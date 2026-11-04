// Shared checks for code-built 3D models (public/3d/modeli/<area>/*.js), contract in docs/3d.md.
// Used by test/3d-matematika.test.js, test/3d-vesolje.test.js and test/3d-procesi.test.js.
// CLI for one builder while writing it: node test/3d-preveri-gradnik.js matematika/telesa
import * as THREE from "three";
import { pathToFileURL } from "node:url";
import path from "node:path";

export const PODROCJA = ["celice", "organi", "sistemi", "kemija", "fizika", "matematika", "vesolje", "procesi"];
export const PREDMETI = ["BIO", "KEM", "FIZ", "MAT", "NAR"];
export const MEJE = { visoka: 150_000, nizka: 60_000, klici: 60, polmer: 1.1 };
const TIPI = ["drsnik", "izbira", "stikalo", "gumb", "izpis"];
const MODELI = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../public/3d/modeli");

// Node has no canvas: a 2D context that accepts every call, so builders may draw textures in code.
function namestiPlatno() {
  if (globalThis.document?.createElement) return;
  const kontekst = (w, h) => new Proxy({}, {
    get(t, k) {
      if (k in t) return t[k];
      if (k === "measureText") return (s) => ({ width: String(s).length * 7, actualBoundingBoxAscent: 8, actualBoundingBoxDescent: 2 });
      if (k === "createLinearGradient" || k === "createRadialGradient" || k === "createConicGradient" || k === "createPattern") return () => ({ addColorStop() {} });
      if (k === "getImageData" || k === "createImageData") return (x, y, a = w, b = h) => ({ width: a, height: b, data: new Uint8ClampedArray(Math.max(1, a * b * 4)) });
      if (k === "canvas") return undefined;
      return () => {};
    },
    set(t, k, v) { t[k] = v; return true; },
  });
  const platno = () => {
    const c = { width: 300, height: 150, style: {}, getContext() { return kontekst(c.width, c.height); }, toDataURL: () => "data:,", addEventListener() {} };
    return c;
  };
  globalThis.document = { createElement: (t) => (t === "canvas" ? platno() : { style: {}, appendChild() {}, setAttribute() {} }), createElementNS: (ns, t) => platno() };
  globalThis.OffscreenCanvas ??= class { constructor(w, h) { this.width = w; this.height = h; } getContext() { return kontekst(this.width, this.height); } };
}

export async function naloziPodrocje(podrocje) {
  const seznam = (await import(pathToFileURL(path.join(MODELI, podrocje, "index.js")).href)).default;
  return seznam;
}

function trikotniki(o) {
  const g = o.geometry; if (!g) return 0;
  let n = g.index ? g.index.count : g.attributes.position ? g.attributes.position.count : 0;
  if (o.isMesh) n /= 3; else if (o.isLineSegments) n /= 2; else if (o.isLine || o.isPoints) n /= 1; else return 0;
  if (g.drawRange && g.drawRange.count !== Infinity) n = Math.min(n, o.isMesh ? g.drawRange.count / 3 : g.drawRange.count);
  if (o.isInstancedMesh) n *= o.count;
  return o.isMesh ? n : 0;
}
function vidno(o) { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; }

// Counts triangles, draw calls and the farthest point from the origin of everything visible.
export function izmeri(group) {
  group.updateMatrixWorld(true);
  let tri = 0, klici = 0, polmer = 0;
  const v = new THREE.Vector3(), m = new THREE.Matrix4();
  group.traverse((o) => {
    if (!(o.isMesh || o.isLine || o.isPoints || o.isSprite) || !vidno(o)) return;
    const mat = Array.isArray(o.material) ? o.material : [o.material];
    if (mat.every((x) => !x || x.visible === false)) return;
    tri += trikotniki(o);
    klici += Array.isArray(o.material) && o.geometry?.groups?.length ? o.geometry.groups.length : 1;
    if (o.isSprite) return; // labels may sit just outside the unit sphere
    const g = o.geometry; if (!g?.attributes?.position) return;
    if (!g.boundingSphere) g.computeBoundingSphere();
    if (o.isInstancedMesh) {
      for (let i = 0; i < o.count; i++) {
        o.getMatrixAt(i, m); v.copy(g.boundingSphere.center).applyMatrix4(m).applyMatrix4(o.matrixWorld);
        const s = Math.cbrt(Math.abs(m.determinant())) * o.matrixWorld.getMaxScaleOnAxis();
        polmer = Math.max(polmer, v.length() + g.boundingSphere.radius * s);
      }
      return;
    }
    const p = g.attributes.position, n = Math.min(p.count, g.drawRange?.count ?? Infinity);
    const korak = Math.max(1, Math.floor(n / 20000));
    for (let i = 0; i < n; i += korak) { v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld); polmer = Math.max(polmer, v.length()); }
  });
  return { tri: Math.round(tri), klici, polmer };
}

const besedilo = (s) => typeof s === "string" && s.trim().length > 0;

// Returns a list of problems (empty = fine) for one builder module.
export async function preveriGradnik(mod, pricakovanId) {
  namestiPlatno();
  const napake = [];
  const n = (s) => napake.push(s);
  const { info, zgradi } = mod;
  if (!info) return ["ni izvoza info"];
  if (typeof zgradi !== "function") n("ni funkcije zgradi");
  if (!/^[a-z0-9-]+$/.test(info.id || "")) n(`id ni ASCII: ${info.id}`);
  if (pricakovanId && info.id !== pricakovanId) n(`id ${info.id} ≠ index ${pricakovanId}`);
  if (!besedilo(info.naslov)) n("ni naslova");
  if (!PODROCJA.includes(info.podrocje)) n(`podrocje ${info.podrocje}`);
  if (!PREDMETI.includes(info.predmet)) n(`predmet ${info.predmet}`);
  if (!besedilo(info.opis)) n("ni opisa");
  if (!(info.merilo?.m > 0) || !besedilo(info.merilo?.oznaka)) n("ni merila");
  if (napake.length) return napake;
  for (const kakovost of ["visoka", "nizka"]) {
    for (const gibanje of [true, false]) {
      const oznaka = `${info.id} ${kakovost}${gibanje ? "" : " brez gibanja"}`;
      let r;
      try { r = zgradi(THREE, { kakovost, gibanje, zacetek: {} }); } catch (e) { n(`${oznaka}: zgradi vrže ${e.stack}`); continue; }
      if (!r?.group?.isGroup) { n(`${oznaka}: ni group`); continue; }
      const meja = MEJE[kakovost];
      if (r.merilo !== undefined && typeof r.merilo !== "function") n(`${oznaka}: merilo mora biti funkcija`);
      const preveriMerilo = (kje) => {
        if (typeof r.merilo !== "function") return;
        const m = r.merilo();
        if (m !== null && (!(m?.m > 0) || !besedilo(m?.oznaka))) n(`${oznaka} ${kje}: merilo() ${JSON.stringify(m)}`);
      };
      const preveriMere = (kje) => {
        const x = izmeri(r.group);
        if (x.tri > meja) n(`${oznaka} ${kje}: ${x.tri} trikotnikov > ${meja}`);
        if (x.klici > MEJE.klici) n(`${oznaka} ${kje}: ${x.klici} klicev risanja > ${MEJE.klici}`);
        if (x.polmer > MEJE.polmer) n(`${oznaka} ${kje}: sega do ${x.polmer.toFixed(2)} > ${MEJE.polmer}`);
        preveriMerilo(kje);
      };
      preveriMere("začetek");
      const deli = r.deli || [];
      const idji = new Set();
      const vSkupini = new Set(); r.group.traverse((o) => vSkupini.add(o));
      for (const d of deli) {
        if (!/^[a-z0-9-]+$/.test(d.id || "") || idji.has(d.id)) n(`${oznaka}: del id ${d.id}`);
        idji.add(d.id);
        if (!besedilo(d.ime) || !besedilo(d.opis)) n(`${oznaka}: del ${d.id} brez imena ali opisa`);
        if (!Array.isArray(d.meshes) || !d.meshes.length || d.meshes.some((m) => !vSkupini.has(m))) n(`${oznaka}: del ${d.id} meshes niso v group`);
        if (d.tocka && (d.tocka.length !== 3 || d.tocka.some((x) => !Number.isFinite(x)))) n(`${oznaka}: del ${d.id} tocka`);
      }
      // every control, at its extremes and every option; the model must stay within budget
      for (const c of r.nadzor || []) {
        if (!TIPI.includes(c.tip)) { n(`${oznaka}: tip nadzora ${c.tip}`); continue; }
        if (!besedilo(c.oznaka)) n(`${oznaka}: nadzor ${c.id} brez oznake`);
        if (c.vidno !== undefined && typeof c.vidno !== "function") n(`${oznaka}: nadzor ${c.id} vidno ni funkcija`);
        try {
          if (c.tip === "drsnik") {
            if (!(c.min <= c.vrednost && c.vrednost <= c.max) || !(c.korak > 0)) n(`${oznaka}: drsnik ${c.id} meje`);
            for (const v of [c.max, c.min, (c.min + c.max) / 2, c.vrednost]) { c.ob(v); preveriMere(`${c.id}=${v}`); }
          } else if (c.tip === "izbira") {
            if (!c.moznosti?.length || !c.moznosti.some(([v]) => v === c.vrednost)) n(`${oznaka}: izbira ${c.id} vrednost`);
            for (const [v, t] of c.moznosti) { if (!besedilo(t)) n(`${oznaka}: izbira ${c.id} brez besedila`); c.ob(v); preveriMere(`${c.id}=${v}`); }
            c.ob(c.vrednost);
          } else if (c.tip === "stikalo") {
            c.ob(!c.vrednost); preveriMere(`${c.id}=${!c.vrednost}`); c.ob(!!c.vrednost);
          } else if (c.tip === "gumb") {
            for (let i = 0; i < 12; i++) c.ob();
            preveriMere(`${c.id}×12`);
          } else if (c.tip === "izpis") {
            const s = typeof c.vrednost === "function" ? c.vrednost() : c.vrednost;
            if (!besedilo(s) || /NaN|undefined|Infinity/.test(s)) n(`${oznaka}: izpis ${c.id} = ${s}`);
          }
        } catch (e) { n(`${oznaka}: nadzor ${c.id} vrže ${e.stack}`); }
      }
      for (const c of (r.nadzor || []).filter((c) => c.tip === "izpis")) {
        const s = typeof c.vrednost === "function" ? c.vrednost() : c.vrednost;
        if (!besedilo(s) || /NaN|undefined|Infinity/.test(s)) n(`${oznaka}: izpis ${c.id} po spremembah = ${s}`);
      }
      if (r.korak) {
        try { let t = 0; for (let i = 0; i < 300; i++) { t += 1 / 30; r.korak(t, 1 / 30); } preveriMere("po 10 s"); }
        catch (e) { n(`${oznaka}: korak vrže ${e.stack}`); }
      }
      try { r.dispose?.(); } catch (e) { n(`${oznaka}: dispose vrže ${e.message}`); }
    }
  }
  return napake;
}

export async function preveriPodrocje(podrocje) {
  const seznam = await naloziPodrocje(podrocje);
  const izid = [];
  for (const e of seznam) {
    const mod = await import(pathToFileURL(path.join(MODELI, podrocje, e.pot)).href);
    izid.push({ e, mod, napake: await preveriGradnik(mod, e.id) });
  }
  return { seznam, izid };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const rel = process.argv[2];
  const mod = await import(pathToFileURL(path.join(MODELI, rel + ".js")).href);
  namestiPlatno();
  const napake = await preveriGradnik(mod);
  const r = mod.zgradi(THREE, { kakovost: "visoka", gibanje: true, zacetek: {} });
  const x = izmeri(r.group);
  const r2 = mod.zgradi(THREE, { kakovost: "nizka", gibanje: true, zacetek: {} });
  console.log(`${mod.info.id}: visoka ${x.tri} trikotnikov, ${x.klici} klicev, polmer ${x.polmer.toFixed(2)}; nizka ${izmeri(r2.group).tri}; delov ${(r.deli || []).length}`);
  console.log(napake.length ? napake.join("\n") : "OK");
  process.exit(napake.length ? 1 : 0);
}
