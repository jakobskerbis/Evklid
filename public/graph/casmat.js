// Simbolno računanje, 3. faza: determinanta in inverz matrike s črkami (ukaza det, inverz).
// Vnos v zapisu seznamov kalkulatorja: [[a, b], [c, d]] (pri decimalni vejici [[a; b]; [c; d]]).
// Elementi so ulomki polinomov (lahko tudi s koreni, casalg.js); determinanta z razvojem po vrstici (do 5 × 5),
// inverz = adjungiranka / det. Preverimo s števili: det s številsko determinanto, inverz z A·A⁻¹ = I v 20 točkah.
import { P, AlgebraError } from "../scan/algebra.js";
import { KIT } from "./cas.js";
import { lineTex } from "./scicore.js";
import { newCtx, attempt, ops, verifyAt, lineFn } from "./casalg.js";

export const MAT_OPS = new Set(["det", "inverse"]);
const MAX_N = 5;
const fail = (code) => new AlgebraError(code);
const unwrap = (n) => (n?.k === "grp" ? unwrap(n.a) : n);

// determinanta podmatrike (vrstice od k naprej, stolpci v cols) z razvojem po prvi vrstici; delne rezultate si zapomnimo
function detR(ctx, A, rows, cols, memo = new Map()) {
  if (!rows.length) return new KIT.R(P.num(1));
  const key = rows.join(",") + "|" + cols.join(",");
  if (memo.has(key)) return memo.get(key);
  KIT.tick();
  let s = new KIT.R(new P());
  cols.forEach((c, j) => {
    const a = A[rows[0]][c];
    if (a.n.zero) return;
    const m = ops.mul(ctx, a, detR(ctx, A, rows.slice(1), cols.filter((x) => x !== c), memo));
    s = j % 2 ? ops.sub(ctx, s, m) : ops.add(ctx, s, m);
  });
  memo.set(key, s);
  return s;
}
function detNum(M) {
  const n = M.length;
  const A = M.map((r) => r.slice());
  let d = 1;
  for (let k = 0; k < n; k++) {
    let p = k;
    for (let i = k + 1; i < n; i++) if (Math.abs(A[i][k]) > Math.abs(A[p][k])) p = i;
    if (A[p][k] === 0) return 0;
    if (p !== k) {
      [A[p], A[k]] = [A[k], A[p]];
      d = -d;
    }
    d *= A[k][k];
    for (let i = k + 1; i < n; i++) {
      const f = A[i][k] / A[k][k];
      for (let j = k; j < n; j++) A[i][j] -= f * A[k][j];
    }
  }
  return d;
}
const pmatrix = (rows) => `\\begin{pmatrix}${rows.map((r) => r.join(" & ")).join(" \\\\ ")}\\end{pmatrix}`;
const isPoly = (r) => r.d.isConst() && r.d.constValue().one;
// krajši od razvitega in razstavljenega zapisa (1 − x², ad − bc)
function scalarTex(r, dec) {
  const a = r.d.isConst() ? KIT.polyTex(r.n.scale(r.d.constValue().inv()), dec, true) : KIT.simplifiedTex(r, dec);
  if (r.n.isConst() && r.d.isConst()) return KIT.simplifiedTex(r, dec);
  let b = null;
  try {
    b = KIT.factoredTex(r, dec);
  } catch {}
  return b && b.length < a.length ? b : a;
}

export function runMatrix(cmd, line, env) {
  const comma = env.comma !== false;
  const rowsAst = unwrap(line.ast);
  try {
    if (rowsAst.k !== "list" || !rowsAst.items.length) throw fail("matrix");
    const cells = rowsAst.items.map((r) => {
      const u = unwrap(r);
      if (u.k !== "list") throw fail("matrix");
      return u.items.map(unwrap);
    });
    const n = cells.length;
    if (cells.some((r) => r.length !== n)) throw fail("matrix");
    if (n > MAX_N) throw fail("big");
    const ctx = newCtx(line, env);
    const idx = [...Array(n).keys()];
    let A;
    let det;
    let inv = null;
    attempt(ctx, () => {
      A = cells.map((r) => r.map((x) => KIT.rat(x, ctx)));
      const memo = new Map();
      det = detR(ctx, A, idx, idx, memo);
      if (cmd.op === "inverse") {
        if (det.n.zero) throw fail("singular");
        // A⁻¹[i][j] = (−1)^(i+j)·det(A brez vrstice j in stolpca i) / det A
        inv = idx.map((i) =>
          idx.map((j) => {
            const m = detR(ctx, A, idx.filter((x) => x !== j), idx.filter((x) => x !== i), new Map());
            return (i + j) % 2 ? ops.sub(ctx, new KIT.R(new P()), m) : m;
          }),
        );
      }
    });
    const dec = ctx.dec;
    const vs = [...ctx.vars].sort(KIT.varCmp);
    const inTex = pmatrix(cells.map((r) => r.map((x) => lineTex(x, comma))));
    const fs = cells.map((r) => r.map((x) => lineFn(line, x)));
    const numA = (pt) => fs.map((r) => r.map((f) => f(pt)));
    if (cmd.op === "det") {
      const ok = verifyAt(ctx, vs, (pt) => detNum(numA(pt)), (e) => KIT.evalR(det, e));
      if (!ok) return { error: { code: "casUnverified", info: {} } };
      return { kind: "cas", op: "det", tex: `\\det${inTex}`, resTex: scalarTex(det, dec), inner: cmd.inner };
    }
    const entries = inv.map((r) => r.map((m) => ops.div(ctx, m, det, false)));
    // A·A⁻¹ = I: vsota |(A·X − I)ᵢⱼ| mora biti blizu 0
    const ok = verifyAt(
      ctx,
      vs,
      (pt) => {
        const a = numA(pt);
        if (a.flat().some((v) => !Number.isFinite(v))) return null;
        return 0;
      },
      (e) => {
        const a = A.map((r) => r.map((x) => KIT.evalR(x, e)));
        const X = entries.map((r) => r.map((x) => KIT.evalR(x, e)));
        let err = 0;
        let scale = 0;
        for (let i = 0; i < n; i++)
          for (let j = 0; j < n; j++) {
            let s = 0;
            for (let k = 0; k < n; k++) {
              s += a[i][k] * X[k][j];
              scale = Math.max(scale, Math.abs(a[i][k] * X[k][j]));
            }
            err = Math.max(err, Math.abs(s - (i === j ? 1 : 0)));
          }
        return err <= 1e-9 * Math.max(1, scale) ? 0 : 1;
      },
    );
    // elementi A v točki morajo ustrezati vnosu (A je del preverjanja)
    const okA = verifyAt(ctx, vs, (pt) => numA(pt).flat().reduce((s, v, k) => s + v * (k + 1.37), 0), (e) => A.flat().reduce((s, x, k) => s + KIT.evalR(x, e) * (k + 1.37), 0));
    if (!ok || !okA) return { error: { code: "casUnverified", info: {} } };
    let resTex = pmatrix(entries.map((r) => r.map((x) => KIT.simplifiedTex(x, dec))));
    const adj = inv;
    if (!det.n.isConst() && isPoly(det) && adj.flat().every(isPoly)) {
      // učbeniški zapis 1/det · adj(A), če je krajši od ulomkov v vsakem elementu
      const t = `\\frac{1}{${scalarTex(det, dec)}}${pmatrix(adj.map((r) => r.map((x) => KIT.polyTex(x.n, dec, true))))}`;
      if (t.length <= resTex.length) resTex = t;
    }
    const out = { kind: "cas", op: "inverse", tex: `${inTex}^{-1}`, resTex, inner: cmd.inner };
    const cond = KIT.conditions([...ctx.dens, det.n].filter((d) => !d.isConst()), new P().add(P.num(1)), dec);
    if (cond.length) out.cond = cond.join(",\\; ");
    return out;
  } catch (e) {
    return { error: { code: KIT.casCode(e), info: {} } };
  }
}
