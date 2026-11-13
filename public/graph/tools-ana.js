// Analiza (odvod, ničle, integral, limita, Taylor), vektorji, diferencialne enačbe, merske napake
// in 3D graf. Računanje je v anacore.js, risanje 3D v plot3d.js.
import { esc, texHtml, remember } from "./tools-kit.js";
import { readNumber, readList } from "./toolscore.js";
import { exactTex } from "./scicore.js";
import { fn, derivative, toTex, integrate, roots, limit, taylor, V, odeSolve, measurement, propagate, roundMeasurement } from "./anacore.js";
import { createPlot3d } from "./plot3d.js";
import { compile } from "./math.js";

/** ctx: { t, icon, num(v), card(html), err(msg), insertBtn(v), comma() } */
export function anaTools(ctx) {
  const { t, num, card, err, insertBtn } = ctx;
  const tnum = (v) => (v === Infinity ? "\\infty" : v === -Infinity ? "-\\infty" : num(v).tex);
  // premica y = kx + n v berljivi obliki (brez 0x, 1x, + −)
  const lineTex = (k, n) => {
    const z = (v) => (Math.abs(v) < 1e-12 ? 0 : v);
    k = z(k); n = z(n);
    if (!k) return tnum(n);
    const kx = k === 1 ? "x" : k === -1 ? "-x" : `${tnum(k)}\\,x`;
    return n ? `${kx} ${n < 0 ? "-" : "+"} ${tnum(Math.abs(n))}` : kx;
  };
  // točna oblika, kadar jo prepoznamo (1/2, √3/2, π/4)
  const exact = (v) => {
    const e = Number.isFinite(v) ? exactTex(v) : null;
    return e ? `${e} \\approx ${tnum(v)}` : tnum(v);
  };
  const field = (cls, label, value = "", attrs = "") => `<label class="tl-field"><span>${label}</span><input class="${cls}" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(value)}"${attrs}></label>`;
  const row = (tex, v) => `<div class="tl-row"><span class="tl-v">${texHtml(tex)}</span>${v === undefined || !Number.isFinite(v) ? "" : insertBtn(v)}</div>`;
  const parseErr = (e) => err(e?.code === "char" ? t("gc.errChar", { ch: e.info.ch }) : e?.code === "unknownFn" ? t("gc.errChar", { ch: e.info.f }) : t("gc.errSyntax"));
  const missing = (name) => err(t("gc.errMissing", { names: name }));
  const sub = (el, key, parts, build) => {
    let part = parts.includes(remember.get(key)) ? remember.get(key) : parts[0];
    const bar = el.querySelector(".tl-sub");
    const show = (k) => {
      part = k;
      remember.set(key, k);
      bar.querySelectorAll("[data-part]").forEach((b) => {
        b.classList.toggle("active", b.dataset.part === k);
        b.setAttribute("aria-selected", String(b.dataset.part === k));
      });
      build(k);
    };
    bar.addEventListener("click", (e) => {
      const b = e.target.closest("[data-part]");
      if (b) show(b.dataset.part);
    });
    show(part);
  };

  // ---- analiza ----
  const PARTS = ["deriv", "roots", "int", "lim", "taylor"];
  function calc(el) {
    const st = remember.get("evklid.tool.ana", { f: "x^3 - 3x", a: "-3", b: "3", c: "0", side: "both", x0: "0", n: "5", x: "1" });
    el.innerHTML = card(`${field("tl-af", texHtml("f(x) ="), st.f)}<p class="muted tl-note">${esc(t("sc.ana.hint"))}</p>`) +
      `<div class="chip-row tl-sub" role="tablist">${PARTS.map((k) => `<button type="button" role="tab" data-part="${k}">${esc(t(`sc.ana.${k}`))}</button>`).join("")}</div><div class="tl-apar"></div><div class="tl-out" aria-live="polite"></div>`;
    const par = el.querySelector(".tl-apar");
    const out = el.querySelector(".tl-out");
    let part;
    const save = () => {
      st.f = el.querySelector(".tl-af").value;
      par.querySelectorAll("[data-k]").forEach((x) => (st[x.dataset.k] = x.value));
      remember.set("evklid.tool.ana", st);
    };
    function inputs(k) {
      part = k;
      const f2 = (key, tex) => field("tl-ap", texHtml(tex), st[key], ` data-k="${key}" inputmode="decimal"`);
      const html = {
        deriv: f2("x", "x_0"),
        roots: `<div class="tl-pair">${f2("a", "a")}${f2("b", "b")}</div><p class="muted tl-note">${esc(t("sc.ana.rootsHint"))}</p>`,
        int: `<div class="tl-pair">${f2("a", "a")}${f2("b", "b")}</div>`,
        lim: `<div class="tl-pair">${field("tl-ap", texHtml("x \\to"), st.c, ` data-k="c"`)}<label class="tl-field tl-narrow"><span>${esc(t("sc.ana.side"))}</span><select class="tl-ap" data-k="side">${["both", "left", "right"].map((s) => `<option value="${s}"${s === st.side ? " selected" : ""}>${esc(t(`sc.ana.side.${s}`))}</option>`).join("")}</select></label></div><p class="muted tl-note">${esc(t("sc.ana.limHint"))}</p>`,
        taylor: `<div class="tl-pair">${f2("x0", "x_0")}<label class="tl-field tl-narrow"><span>${esc(t("sc.eq.degree"))}</span><select class="tl-ap" data-k="n">${[1, 2, 3, 4, 5, 6, 7, 8].map((k) => `<option${String(k) === String(st.n) ? " selected" : ""}>${k}</option>`).join("")}</select></label></div>`,
      }[k];
      par.innerHTML = card(html);
      run();
    }
    function run() {
      save();
      if (!st.f.trim()) return (out.innerHTML = "");
      let F;
      try {
        F = fn(st.f);
      } catch (e) {
        return (out.innerHTML = parseErr(e));
      }
      const other = [...F.vars].filter((v) => v !== "x");
      if (other.length) return (out.innerHTML = missing(other[0]));
      const f = (x) => F.f({ x });
      const fTex = toTex(F.node);
      try {
        if (part === "deriv") {
          const d1 = derivative(F.node);
          const d2 = derivative(d1);
          const x0 = readNumber(st.x);
          let html = row(`f'(x) = ${toTex(d1)}`) + row(`f''(x) = ${toTex(d2)}`);
          if (Number.isFinite(x0)) {
            const fx = f(x0);
            const k = fnFromNode(d1)({ x: x0 });
            html += row(`f'(${tnum(x0)}) = ${exact(k)}`, k);
            if (Number.isFinite(fx) && Number.isFinite(k)) html += `<p class="muted tl-note">${esc(t("sc.ana.tangent"))}: ${texHtml(`y = ${lineTex(k, fx - k * x0)}`)}</p>`;
          }
          out.innerHTML = card(html);
        } else if (part === "roots") {
          const a = readNumber(st.a);
          const b = readNumber(st.b);
          if (!(a < b)) return (out.innerHTML = err(t("sc.ana.badInterval")));
          const r = roots(f, a, b);
          out.innerHTML = card(r.length ? `<div class="tl-h">${esc(t("sc.ana.found", { n: r.length }))}</div>${r.map((x, i) => row(`x_{${i + 1}} = ${exact(x)}`, x)).join("")}` : `<p>${esc(t("sc.ana.noRoots"))}</p>`);
        } else if (part === "int") {
          const a = readNumber(st.a);
          const b = readNumber(st.b);
          if (!Number.isFinite(a) || !Number.isFinite(b)) return (out.innerHTML = err(t("sc.ana.badInterval")));
          const v = integrate(f, a, b);
          out.innerHTML = card(Number.isFinite(v) ? row(`\\int_{${tnum(a)}}^{${tnum(b)}} ${fTex}\\,dx = ${exact(v)}`, v) + `<p class="muted tl-note">${esc(t("sc.ana.intNote"))}</p>` : `<p>${esc(t("sc.ana.intDiverge"))}</p>`);
        } else if (part === "lim") {
          const cs = st.c.trim().replace(/\s/g, "");
          const c = /^\+?(∞|inf|oo)$/i.test(cs) ? Infinity : /^-(∞|inf|oo)$/i.test(cs) ? -Infinity : readNumber(cs);
          if (Number.isNaN(c)) return (out.innerHTML = err(t("sc.ana.badPoint")));
          const show = (v) => (Number.isNaN(v) ? `\\text{${t("sc.ana.noLimit")}}` : exact(v));
          const ct = tnum(c);
          let html;
          if (!Number.isFinite(c)) {
            const L = limit(f, c);
            html = row(`\\lim_{x \\to ${ct}} ${fTex} = ${show(L)}`, L);
          } else {
            const L = limit(f, c, -1);
            const R = limit(f, c, 1);
            const same = (Number.isFinite(L) && Number.isFinite(R) && Math.abs(L - R) <= 1e-6 * Math.max(1, Math.abs(L))) || (L === R && !Number.isNaN(L));
            if (st.side === "left") html = row(`\\lim_{x \\to ${ct}^-} ${fTex} = ${show(L)}`, L);
            else if (st.side === "right") html = row(`\\lim_{x \\to ${ct}^+} ${fTex} = ${show(R)}`, R);
            else
              html =
                row(`\\lim_{x \\to ${ct}^-} = ${show(L)},\\quad \\lim_{x \\to ${ct}^+} = ${show(R)}`) +
                row(`\\lim_{x \\to ${ct}} ${fTex} = ${same ? show(R) : `\\text{${t("sc.ana.noLimit")}}`}`, same ? R : undefined);
          }
          out.innerHTML = card(html + `<p class="muted tl-note">${esc(t("sc.ana.numNote"))}</p>`);
        } else if (part === "taylor") {
          const x0 = readNumber(st.x0);
          const n = Number(st.n);
          if (!Number.isFinite(x0)) return (out.innerHTML = err(t("sc.ana.badPoint")));
          const c = taylor(F.node, x0, n);
          if (c.some((v) => !Number.isFinite(v))) return (out.innerHTML = err(t("sc.ana.noTaylor")));
          const xs = x0 === 0 ? "x" : `(x ${x0 < 0 ? "+" : "-"} ${tnum(Math.abs(x0))})`;
          const terms = c
            .map((k, i) => {
              if (Math.abs(k) < 1e-13) return null;
              const e = exactTex(Math.abs(k)) || tnum(Math.abs(k));
              const coef = i > 0 && Math.abs(Math.abs(k) - 1) < 1e-12 ? "" : e;
              const pow = i === 0 ? "" : i === 1 ? xs : `${xs}^{${i}}`;
              return { neg: k < 0, s: `${coef}${coef && pow ? "\\," : ""}${pow}` || "1" };
            })
            .filter(Boolean);
          const poly = terms.length ? terms.map((p, i) => (i === 0 ? (p.neg ? "-" : "") : p.neg ? " - " : " + ") + p.s).join("") : "0";
          out.innerHTML = card(row(`T_{${n}}(x) = ${poly}`) + `<p class="muted tl-note">${texHtml(`f(x) = ${fTex}`)}</p>`);
        }
      } catch (e) {
        out.innerHTML = parseErr(e);
      }
    }
    el.querySelector(".tl-af").addEventListener("input", run);
    par.addEventListener("input", run);
    par.addEventListener("change", run);
    sub(el, "evklid.tool.anaPart", PARTS, inputs);
  }
  // ---- vektorji ----
  function vec(el) {
    const st = remember.get("evklid.tool.vec", { a: "2, 1, 3", b: "1, -1, 2", c: "" });
    el.innerHTML = card(`<div class="tl-grid2">${field("tl-va", texHtml("\\vec a"), st.a, ' data-k="a"')}${field("tl-va", texHtml("\\vec b"), st.b, ' data-k="b"')}${field("tl-va", `${texHtml("\\vec c")} <small class="muted">${esc(t("sc.vec.optional"))}</small>`, st.c, ' data-k="c"')}</div><p class="muted tl-note">${esc(t("sc.vec.hint"))}</p>`) + `<div class="tl-out" aria-live="polite"></div>`;
    const vt = (v) => `(${v.map((x) => tnum(Math.abs(x) < 1e-12 ? 0 : x)).join(",\\ ")})`;
    const run = () => {
      el.querySelectorAll(".tl-va").forEach((x) => (st[x.dataset.k] = x.value));
      remember.set("evklid.tool.vec", st);
      const out = el.querySelector(".tl-out");
      const a = V.read(st.a);
      const b = V.read(st.b);
      const c = st.c.trim() ? V.read(st.c) : null;
      if (!a || !b || (st.c.trim() && !c)) return (out.innerHTML = err(t("sc.vec.bad")));
      if (a.length !== b.length || (c && c.length !== a.length)) return (out.innerHTML = err(t("sc.vec.dim")));
      const ang = V.angle(a, b);
      const cr = V.cross(a, b);
      const lines = [
        row(`\\vec a + \\vec b = ${vt(V.add(a, b))}`),
        row(`\\vec a - \\vec b = ${vt(V.sub(a, b))}`),
        row(`\\vec a \\cdot \\vec b = ${exact(V.dot(a, b))}`, V.dot(a, b)),
        row(`|\\vec a| = ${exact(V.norm(a))},\\quad |\\vec b| = ${exact(V.norm(b))}`, V.norm(a)),
        Number.isFinite(ang) ? row(`\\varphi = ${tnum((ang * 180) / Math.PI)}^\\circ = ${exact(ang)}\\ \\mathrm{rad}`, (ang * 180) / Math.PI) : "",
        row(`\\vec a \\times \\vec b = ${vt(cr)}`),
        row(`S_{\\text{${t("sc.vec.para")}}} = |\\vec a \\times \\vec b| = ${exact(V.norm(cr))}`, V.norm(cr)),
        V.dot(b, b) ? row(`\\operatorname{proj}_{\\vec b} \\vec a = ${vt(V.proj(a, b))}`) : "",
        V.norm(a) ? row(`\\vec a_0 = ${vt(a.map((x) => x / V.norm(a)))}`) : "",
        c ? row(`(\\vec a \\times \\vec b) \\cdot \\vec c = ${exact(V.triple(c, a, b))},\\quad V = ${exact(Math.abs(V.triple(c, a, b)))}`, V.triple(c, a, b)) : "",
      ];
      out.innerHTML = card(lines.join(""));
    };
    el.addEventListener("input", run);
    run();
  }

  // ---- diferencialne enačbe ----
  function ode(el) {
    const st = remember.get("evklid.tool.ode", { order: 1, f: "y", x0: "0", y0: "1", yd0: "0", x1: "2", N: "100", method: "rk4" });
    el.innerHTML = card(`<div class="seg tl-seg"><button type="button" data-o="1">${texHtml("y' = f(x, y)")}</button><button type="button" data-o="2">${texHtml("y'' = f(x, y, y')")}</button></div>
      <div class="tl-ode-f"></div>
      <div class="tl-grid2">${field("tl-on", texHtml("x_0"), st.x0, ' data-k="x0" inputmode="decimal"')}${field("tl-on", texHtml("y(x_0)"), st.y0, ' data-k="y0" inputmode="decimal"')}<span class="tl-yd0">${field("tl-on", texHtml("y'(x_0)"), st.yd0, ' data-k="yd0" inputmode="decimal"')}</span>${field("tl-on", texHtml(`x_{\\text{${t("sc.ode.end")}}}`), st.x1, ' data-k="x1" inputmode="decimal"')}
      ${field("tl-on", esc(t("sc.ode.steps")), st.N, ' data-k="N" inputmode="numeric"')}<label class="tl-field"><span>${esc(t("sc.ode.method"))}</span><select class="tl-om">${["rk4", "euler"].map((m) => `<option value="${m}"${m === st.method ? " selected" : ""}>${esc(t(`sc.ode.${m}`))}</option>`).join("")}</select></label></div>
      <p class="muted tl-note">${esc(t("sc.ode.hint"))}</p>`) + `<div class="tl-out" aria-live="polite"></div>`;
    const fbox = el.querySelector(".tl-ode-f");
    const drawF = () => {
      el.querySelectorAll(".tl-seg [data-o]").forEach((b) => b.classList.toggle("active", Number(b.dataset.o) === st.order));
      fbox.innerHTML = field("tl-of", texHtml(st.order === 1 ? "y' =" : "y'' ="), st.f);
      el.querySelector(".tl-yd0").hidden = st.order === 1;
      run();
    };
    const run = () => {
      st.f = el.querySelector(".tl-of").value;
      st.method = el.querySelector(".tl-om").value;
      el.querySelectorAll(".tl-on").forEach((x) => (st[x.dataset.k] = x.value));
      remember.set("evklid.tool.ode", st);
      const out = el.querySelector(".tl-out");
      let F;
      try {
        F = fn(st.f);
      } catch (e) {
        return (out.innerHTML = parseErr(e));
      }
      const allowed = st.order === 1 ? ["x", "y"] : ["x", "y", "y_d"];
      const bad = [...F.vars].find((v) => !allowed.includes(v));
      if (bad) return (out.innerHTML = missing(bad === "y_d" ? "y'" : bad));
      const [x0, y0, yd0, x1, N] = ["x0", "y0", "yd0", "x1", "N"].map((k) => readNumber(st[k]));
      if (![x0, y0, x1].every(Number.isFinite) || x1 === x0 || (st.order === 2 && !Number.isFinite(yd0)) || !(N >= 1 && N <= 100000)) return (out.innerHTML = err(t("sc.ode.bad")));
      const sol = odeSolve(F.f, { order: st.order, x0, y0, yd0, x1, N: Math.round(N), method: st.method });
      const end = sol[sol.length - 1];
      if (sol.length < Math.round(N) + 1) return (out.innerHTML = err(t("sc.ode.blowup", { x: num(end.x).text })));
      const step = Math.max(1, Math.round(sol.length / 10));
      const table = sol.filter((_, i) => i % step === 0 || i === sol.length - 1);
      out.innerHTML = card(
        row(`y(${tnum(x1)}) \\approx ${tnum(end.y)}`, end.y) +
          (st.order === 2 ? row(`y'(${tnum(x1)}) \\approx ${tnum(end.yd)}`, end.yd) : "") +
          chart(sol) +
          `<table class="pse-tab"><thead><tr><th>${texHtml("x")}</th><th>${texHtml("y")}</th>${st.order === 2 ? `<th>${texHtml("y'")}</th>` : ""}</tr></thead><tbody>${table.map((p) => `<tr><td>${esc(num(p.x).text)}</td><td>${esc(num(p.y).text)}</td>${st.order === 2 ? `<td>${esc(num(p.yd).text)}</td>` : ""}</tr>`).join("")}</tbody></table>`,
      );
    };
    const chart = (sol) => {
      const W = 320;
      const H = 150;
      const p = 22;
      const xs = sol.map((s) => s.x);
      const ys = sol.map((s) => s.y);
      const [xa, xb] = [Math.min(...xs), Math.max(...xs)];
      let [ya, yb] = [Math.min(...ys), Math.max(...ys)];
      if (yb - ya < 1e-12) {
        ya -= 1;
        yb += 1;
      }
      const sx = (x) => p + ((x - xa) / (xb - xa)) * (W - 2 * p);
      const sy = (y) => H - p - ((y - ya) / (yb - ya)) * (H - 2 * p);
      const d = sol.map((s, i) => `${i ? "L" : "M"}${sx(s.x).toFixed(1)},${sy(s.y).toFixed(1)}`).join("");
      const zero = ya < 0 && yb > 0 ? `<line x1="${p}" x2="${W - p}" y1="${sy(0).toFixed(1)}" y2="${sy(0).toFixed(1)}" class="pr-ax"/>` : "";
      return `<svg class="pr-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t("sc.ode.chart"))}"><line x1="${p}" x2="${W - p}" y1="${H - p}" y2="${H - p}" class="pr-ax"/>${zero}<path d="${d}" class="pr-line"/><text x="${p}" y="${H - 6}" class="pr-t">${esc(num(xa).text)}</text><text x="${W - p}" y="${H - 6}" class="pr-t">${esc(num(xb).text)}</text><text x="${p + 2}" y="12" class="pr-t" text-anchor="start">${esc(num(yb).text)}</text><text x="${p + 2}" y="${H - p - 4}" class="pr-t" text-anchor="start">${esc(num(ya).text)}</text></svg>`;
    };
    el.querySelector(".tl-seg").addEventListener("click", (e) => {
      const b = e.target.closest("[data-o]");
      if (!b) return;
      st.order = Number(b.dataset.o);
      if (st.order === 2 && st.f === "y") st.f = "-y";
      drawF();
    });
    el.addEventListener("input", run);
    el.addEventListener("change", run);
    drawF();
  }

  // ---- merske napake ----
  function errTool(el) {
    const st = remember.get("evklid.tool.err", { data: "9,78 9,82 9,80 9,85 9,79", f: "2*π*sqrt(l/g)", vals: { l: "1", g: "9,81" }, errs: { l: "0,005", g: "0,02" } });
    el.innerHTML = `<div class="chip-row tl-sub" role="tablist">${["rep", "prop"].map((k) => `<button type="button" role="tab" data-part="${k}">${esc(t(`sc.err.${k}`))}</button>`).join("")}</div><div class="tl-epar"></div>`;
    const box = el.querySelector(".tl-epar");
    const save = () => remember.set("evklid.tool.err", st);
    const fixed = (v, d) => (ctx.comma() ? v.toFixed(d).replace(".", "{,}") : v.toFixed(d)).replace("-", "-");
    const result = (x, dx) => {
      const r = roundMeasurement(x, dx);
      return r ? `(${fixed(r.x, r.dec)} \\pm ${fixed(r.dx, r.dec)})` : `${tnum(x)} \\pm ${tnum(dx)}`;
    };
    function rep() {
      box.innerHTML = card(`<label class="tl-field"><span>${esc(t("sc.err.data"))}</span><textarea class="tl-ed" rows="3" inputmode="decimal" spellcheck="false">${esc(st.data)}</textarea></label><p class="muted tl-note">${esc(t("sc.dataHint"))}</p>`) + `<div class="tl-out" aria-live="polite"></div>`;
      const run = () => {
        st.data = box.querySelector(".tl-ed").value;
        save();
        const m = measurement(readList(st.data));
        const out = box.querySelector(".tl-out");
        if (!m) return (out.innerHTML = err(t("sc.err.two")));
        out.innerHTML = card(
          row(`\\bar x = ${tnum(m.mean)}`, m.mean) +
            row(`s = ${tnum(m.s)}`, m.s) +
            row(`\\Delta x = \\frac{s}{\\sqrt{n}} = ${tnum(m.sem)}`, m.sem) +
            row(`x = ${result(m.mean, m.sem)},\\quad \\delta = ${tnum((100 * m.sem) / Math.abs(m.mean))}\\ \\%`) +
            `<p class="muted tl-note">${esc(t("sc.err.maxDev"))}: ${texHtml(`\\Delta x_{\\max} = ${tnum(m.maxDev)},\\quad x = ${result(m.mean, m.maxDev)}`)}</p>`,
        );
      };
      box.querySelector(".tl-ed").addEventListener("input", run);
      run();
    }
    function prop() {
      box.innerHTML = card(`${field("tl-ef", texHtml("f ="), st.f)}<p class="muted tl-note">${esc(t("sc.err.propHint"))}</p><div class="tl-evars"></div>`) + `<div class="tl-out" aria-live="polite"></div>`;
      const vbox = box.querySelector(".tl-evars");
      let vars = [];
      const drawVars = () => {
        vbox.innerHTML = vars.map((v) => `<div class="tl-pair">${field("tl-ev", texHtml(v), st.vals[v] ?? "", ` data-v="${esc(v)}" inputmode="decimal"`)}${field("tl-ee", texHtml(`\\Delta ${v}`), st.errs[v] ?? "", ` data-v="${esc(v)}" inputmode="decimal"`)}</div>`).join("");
      };
      const run = () => {
        st.f = box.querySelector(".tl-ef").value;
        vbox.querySelectorAll(".tl-ev").forEach((x) => (st.vals[x.dataset.v] = x.value));
        vbox.querySelectorAll(".tl-ee").forEach((x) => (st.errs[x.dataset.v] = x.value));
        save();
        const out = box.querySelector(".tl-out");
        let F;
        try {
          F = fn(st.f);
        } catch (e) {
          vars = [];
          drawVars();
          return (out.innerHTML = parseErr(e));
        }
        const nv = [...F.vars].sort();
        if (nv.join() !== vars.join()) {
          vars = nv;
          drawVars();
        }
        const vals = {};
        const errs = {};
        for (const v of vars) {
          vals[v] = readNumber(st.vals[v]);
          errs[v] = readNumber(st.errs[v] || "0");
        }
        if (!vars.length || Object.values(vals).concat(Object.values(errs)).some((x) => !Number.isFinite(x))) return (out.innerHTML = err(t("sc.err.fill")));
        const r = propagate(F.node, vals, errs);
        if (!Number.isFinite(r.value)) return (out.innerHTML = err(t("sc.errUndefined")));
        out.innerHTML = card(
          row(`f = ${tnum(r.value)}`, r.value) +
            row(`\\Delta f = \\sum \\left|\\frac{\\partial f}{\\partial x_i}\\right| \\Delta x_i = ${tnum(r.max)}`, r.max) +
            row(`f = ${result(r.value, r.max)},\\quad \\delta = ${tnum((100 * r.max) / Math.abs(r.value))}\\ \\%`) +
            `<p class="muted tl-note">${esc(t("sc.err.quad"))}: ${texHtml(`\\Delta f = \\sqrt{\\sum \\left(\\frac{\\partial f}{\\partial x_i} \\Delta x_i\\right)^2} = ${tnum(r.quad)}`)}</p>` +
            `<table class="pse-tab"><thead><tr><th></th><th>${texHtml("\\partial f/\\partial x_i")}</th><th>${texHtml("|\\partial f/\\partial x_i|\\,\\Delta x_i")}</th></tr></thead><tbody>${r.parts.map((p) => `<tr><td>${texHtml(p.v)}</td><td>${esc(num(p.d).text)}</td><td>${esc(num(p.contrib).text)}</td></tr>`).join("")}</tbody></table>`,
        );
      };
      box.addEventListener("input", run);
      run();
    }
    sub(el, "evklid.tool.errPart", ["rep", "prop"], (k) => (k === "rep" ? rep() : prop()));
  }

  // ---- 3D graf ----
  function plot3(el) {
    const st = remember.get("evklid.tool.p3", { f: "sin(x)*cos(y)", x0: "-3", x1: "3", y0: "-3", y1: "3" });
    el.innerHTML = card(`${field("tl-pf", texHtml("z = f(x, y) ="), st.f)}<div class="tl-grid2">${["x0", "x1", "y0", "y1"].map((k) => field("tl-pr", texHtml(`${k[0]}_{\\${k[1] === "0" ? "min" : "max"}}`), st[k], ` data-k="${k}" inputmode="decimal"`)).join("")}</div>`) +
      `<div class="card tl-card p3-card"><canvas class="p3" tabindex="0" role="img" aria-label="${esc(t("sc.p3.aria"))}"></canvas><div class="p3-scale" aria-hidden="true"><span class="p3-lo"></span><i></i><span class="p3-hi"></span></div><p class="muted tl-note">${esc(t("sc.p3.hint"))}</p><div class="tl-out" aria-live="polite"></div></div>`;
    const canvas = el.querySelector("canvas");
    const out = el.querySelector(".tl-out");
    let plot = null;
    const run = () => {
      st.f = el.querySelector(".tl-pf").value;
      el.querySelectorAll(".tl-pr").forEach((x) => (st[x.dataset.k] = x.value));
      remember.set("evklid.tool.p3", st);
      let F;
      try {
        F = fn(st.f);
      } catch (e) {
        return (out.innerHTML = parseErr(e));
      }
      const bad = [...F.vars].find((v) => !["x", "y"].includes(v));
      if (bad) return (out.innerHTML = missing(bad));
      const [x0, x1, y0, y1] = ["x0", "x1", "y0", "y1"].map((k) => readNumber(st[k]));
      if (!(x0 < x1 && y0 < y1)) return (out.innerHTML = err(t("sc.ana.badInterval")));
      out.innerHTML = "";
      const o = { f: (x, y) => F.f({ x, y }), x: [x0, x1], y: [y0, y1], label: (v) => num(Number(v.toPrecision(3))).text };
      if (!plot) plot = createPlot3d(canvas, o);
      else plot.set(o);
      plot.draw();
      const r = plot.range();
      if (r) {
        el.querySelector(".p3-lo").textContent = num(Number(r[0].toPrecision(3))).text;
        el.querySelector(".p3-hi").textContent = num(Number(r[1].toPrecision(3))).text;
      }
    };
    el.addEventListener("input", run);
    // platno dobi velikost šele, ko je pogled viden
    requestAnimationFrame(run);
    return { resize: () => plot?.draw() };
  }

  return { calc, vec, ode, err: errTool, plot3 };
}

// vrednotenje drevesa (odvod) v točki
function fnFromNode(node) {
  const c = compile(node);
  return (vars) => {
    const v = c(vars);
    return typeof v === "number" ? v : NaN;
  };
}
