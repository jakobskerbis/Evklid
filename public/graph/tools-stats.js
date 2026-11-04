// Orodje Statistika: 1 spremenljivka (s pogostostmi, kot Casio »Freq«) in 2 spremenljivki
// (vsote, povprečja, odkloni, r, regresija z napovedjo ŷ in x̂ kot Casio fx-991CW in TI-84 2-Var Stats/LinReg).
// Računanje: toolscore.js (stats, stats2, expandFreq) in model.js (regression, regressionX).
import { esc, texHtml, remember } from "./tools-kit.js";
import { readList, readNumber, stats, stats2, expandFreq } from "./toolscore.js";
import { regression, regressionX, regressionTex, MODELS } from "./model.js";

// splošni zapis modela; črke koeficientov so v istem vrstnem redu kot fit.p
const FORM = {
  lin: "y = ax + b",
  quad: "y = ax^2 + bx + c",
  cubic: "y = ax^3 + bx^2 + cx + d",
  quart: "y = ax^4 + bx^3 + cx^2 + dx + e",
  exp: "y = a\\cdot b^{x}",
  expe: "y = a\\,e^{bx}",
  pow: "y = a\\,x^{b}",
  log: "y = a + b\\ln x",
  inv: "y = a + \\dfrac{b}{x}",
  logistic: "y = \\dfrac{c}{1 + a\\,e^{-bx}}",
  sin: "y = a\\sin(bx + c) + d",
};

export function statsTool(el, ctx) {
  const { t, num, card, err, insertBtn, comma } = ctx;
  const st = remember.get("evklid.tool.stats2", { mode: "1", f: "", x: "1 2 3 4 5", y: "2 4 5 4 5", model: "lin", ex: "", ey: "" });
  if (!MODELS.includes(st.model)) st.model = "lin";
  const one = remember.get("evklid.tool.stats", "2 4 4 4 5 5 7 9");
  el.innerHTML = `<div class="seg tl-seg tl-sseg" role="tablist"><button type="button" role="tab" data-smode="1">${esc(t("sc.st.one"))}</button><button type="button" role="tab" data-smode="2">${esc(t("sc.st.two"))}</button></div><div class="tl-sbody"></div><div class="tl-out" aria-live="polite"></div>`;
  const body = el.querySelector(".tl-sbody");
  const out = el.querySelector(".tl-out");
  const save = () => remember.set("evklid.tool.stats2", st);
  const row = (label, sym, v, extra = "") => `<div class="tl-row"><span class="tl-k">${esc(label)}</span><span class="tl-v">${texHtml(`${sym} = ${extra || num(v).tex}`)}</span>${extra ? "" : insertBtn(v)}</div>`;
  const area = (k, label, value, rows = 3) => `<label class="tl-field"><span>${esc(label)}</span><textarea class="tl-sv" data-k="${k}" rows="${rows}" inputmode="decimal" spellcheck="false">${esc(value)}</textarea></label>`;

  function draw() {
    el.querySelectorAll("[data-smode]").forEach((b) => {
      b.classList.toggle("active", b.dataset.smode === st.mode);
      b.setAttribute("aria-selected", String(b.dataset.smode === st.mode));
    });
    if (st.mode === "1") {
      body.innerHTML = card(area("one", t("sc.data"), remember.get("evklid.tool.stats", one)) + `<p class="muted tl-note">${esc(t("sc.dataHint"))}</p>` + area("f", t("sc.st.freq"), st.f, 2) + `<p class="muted tl-note">${esc(t("sc.st.freqHint"))}</p>`);
    } else {
      const opts = MODELS.map((m) => `<option value="${m}"${m === st.model ? " selected" : ""}>${esc(t(`gc.reg.${m}`))}</option>`).join("");
      body.innerHTML = card(
        `<div class="tl-grid2">${area("x", t("sc.st.x"), st.x, 2)}${area("y", t("sc.st.y"), st.y, 2)}</div><p class="muted tl-note">${esc(t("sc.st.pairsHint"))}</p>` +
          `<label class="tl-field"><span>${esc(t("gc.reg"))}</span><select class="tl-sm">${opts}</select></label>` +
          `<div class="tl-grid2"><label class="tl-field"><span>${esc(t("sc.st.estX"))}</span><input class="tl-sv" data-k="ex" inputmode="decimal" autocomplete="off" value="${esc(st.ex)}"></label><label class="tl-field"><span>${esc(t("sc.st.estY"))}</span><input class="tl-sv" data-k="ey" inputmode="decimal" autocomplete="off" value="${esc(st.ey)}"></label></div>`,
      );
    }
    run();
  }

  function runOne() {
    const text = remember.get("evklid.tool.stats", one);
    const vals = readList(text);
    const fr = st.f.trim() ? readList(st.f) : null;
    const data = fr ? expandFreq(vals, fr) : vals;
    if (!data || (fr && vals.length && !data.length)) return (out.innerHTML = err(t("sc.st.freqBad")));
    const s = stats(data);
    if (!s) return (out.innerHTML = "");
    const r = (key, sym, v, extra) => row(t(`sc.st.${key}`), sym, v, extra);
    out.innerHTML =
      (s.bad ? err(t("sc.dataBad", { n: s.bad })) : "") +
      card(
        [
          r("n", "n", s.n),
          r("sum", "\\Sigma x", s.sum),
          r("sumSq", "\\Sigma x^2", s.sumSq),
          r("mean", "\\bar{x}", s.mean),
          r("median", "Me", s.median),
          r("mode", "Mo", 0, s.mode.length ? s.mode.map((v) => num(v).tex).join(";\\ ") : "\\text{—}"),
          r("min", "x_{\\min}", s.min),
          r("max", "x_{\\max}", s.max),
          r("range", "R", s.range),
          r("q1", "Q_1", s.q1),
          r("q3", "Q_3", s.q3),
          r("iqr", "IQR", s.iqr),
          r("sdP", "\\sigma", s.sdP),
          r("sdS", "s", s.sdS),
          r("varP", "\\sigma^2", s.varP),
          r("varS", "s^2", s.varS),
        ].join(""),
      ) +
      `<p class="muted tl-note">${esc(t("sc.sorted"))}: ${esc(s.sorted.slice(0, 200).map((v) => num(v).text).join("; "))}</p>`;
  }

  function runTwo() {
    const xs = readList(st.x);
    const ys = readList(st.y);
    const s = stats2(xs, ys);
    if (!s) return (out.innerHTML = err(t("sc.st.pairsBad")));
    // kot Casio/TI (Math ERROR, ERR:DOMAIN): podatki zunaj definicijskega območja modela se ne preskočijo tiho
    const dom = { exp: [0, 1], expe: [0, 1], pow: [1, 1], log: [1, 0], inv: [2, 0] }[st.model] ?? [0, 0];
    const inDom = xs.every((x, i) => (dom[0] !== 1 || x > 0) && (dom[0] !== 2 || x !== 0) && (!dom[1] || ys[i] > 0));
    const fit = inDom ? regression(xs, ys, st.model) : null;
    // logistična pri x daleč od 0 (npr. leta): a = e^{b·x₀} je prevelik, zato zapis z x₀ (prevoj), kot v načinu graf
    const shifted = fit?.model === "logistic" && Number.isFinite(fit.xm) && !(Math.abs(Math.log10(fit.p[0])) < 12);
    const coefs = shifted ? [["b", fit.p[1]], ["c", fit.p[2]], ["x_0", fit.xm]] : fit ? fit.p.map((v, i) => ["abcde"[i], v]) : [];
    let reg = "";
    if (!fit || !coefs.every(([, v]) => Number.isFinite(v)) || !Number.isFinite(fit.r2)) reg = err(t("sc.st.regBad"));
    else {
      const est = [];
      const ex = st.ex.trim() ? readNumber(st.ex) : NaN;
      const ey = st.ey.trim() ? readNumber(st.ey) : NaN;
      if (Number.isFinite(ex)) {
        const v = fit.fn(ex);
        est.push(Number.isFinite(v) ? row(t("sc.st.yHat"), "\\hat{y}", v) : row(t("sc.st.yHat"), "\\hat{y}", 0, `\\text{${esc(t("sc.st.noEst"))}}`));
      }
      if (Number.isFinite(ey)) {
        const xh = regressionX(fit, ey);
        if (xh === null) est.push(`<p class="muted tl-note">${esc(t("sc.st.noXHat"))}</p>`);
        else if (!xh.length) est.push(row(t("sc.st.xHat"), "\\hat{x}", 0, `\\text{${esc(t("sc.st.noEst"))}}`));
        else xh.forEach((v, i) => est.push(row(t("sc.st.xHat"), xh.length > 1 ? `\\hat{x}_{${i + 1}}` : "\\hat{x}", v)));
      }
      reg = card(
        `<div class="tl-formula">${texHtml(shifted ? "y = \\dfrac{c}{1 + e^{-b(x - x_0)}}" : FORM[st.model])}</div>` +
          coefs.map(([c, v]) => row(t("sc.st.coef", { c: c === "x_0" ? "x₀" : c }), c, v)).join("") +
          row(t("sc.st.r2"), "R^2", fit.r2) +
          `<div class="tl-formula">${texHtml(regressionTex(fit, comma()))}</div>` +
          est.join(""),
      );
    }
    const r = (key, sym, v) => row(t(`sc.st.${key}`), sym, v);
    out.innerHTML =
      card(
        [
          r("pairs", "n", s.n),
          r("meanX", "\\bar{x}", s.mx),
          r("meanY", "\\bar{y}", s.my),
          r("sumX", "\\Sigma x", s.sx),
          r("sumY", "\\Sigma y", s.sy),
          r("sumX2", "\\Sigma x^2", s.sxx),
          r("sumY2", "\\Sigma y^2", s.syy),
          r("sumXY", "\\Sigma xy", s.sxy),
          r("sdPx", "\\sigma_x", s.sdPx),
          r("sdSx", "s_x", s.sdSx),
          r("sdPy", "\\sigma_y", s.sdPy),
          r("sdSy", "s_y", s.sdSy),
          Number.isFinite(s.r) ? r("r", "r", s.r) : "",
        ].join(""),
      ) + reg;
  }

  function run() {
    save();
    if (st.mode === "1") runOne();
    else runTwo();
  }

  el.addEventListener("click", (e) => {
    const b = e.target.closest("[data-smode]");
    if (b && b.dataset.smode !== st.mode) {
      st.mode = b.dataset.smode;
      draw();
    }
  });
  el.addEventListener("input", (e) => {
    const x = e.target;
    if (!x.classList.contains("tl-sv")) return;
    if (x.dataset.k === "one") remember.set("evklid.tool.stats", x.value);
    else st[x.dataset.k] = x.value;
    run();
  });
  el.addEventListener("change", (e) => {
    if (e.target.classList.contains("tl-sm")) {
      st.model = e.target.value;
      run();
    }
  });
  draw();
}
