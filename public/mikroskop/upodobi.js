// Izris mikroskopa v WebGL2 (docs/mikroskop.md »Rendering«): preparat v teksturo (svetloba ali TEM), Gaussova
// zamegljenost (optika), sloj molekul/atomov pri največjih povečavah, na koncu sestava na zaslon (vidno polje okularja
// ali zaslon TEM, svetlost, kontrast, barva žarnice, šum elektronov). Riše samo ob spremembi (narisi()).
import { fragmentPreparata } from "./glsl.js";
import { MOLEKULE } from "./molekule.js";

const VS = `#version 300 es
in vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

const BLUR = `#version 300 es
precision highp float;
uniform sampler2D uT; uniform vec2 uSmer; uniform float uSigma; uniform vec2 uVel;
out vec4 o;
void main() {
  vec2 uv = gl_FragCoord.xy / uVel;
  if (uSigma < 0.35) { o = texture(uT, uv); return; }
  int r = int(min(ceil(uSigma * 2.6), 40.0));
  vec4 s = vec4(0); float w = 0.0;
  for (int i = -40; i <= 40; i++) {
    if (i < -r || i > r) continue;
    float k = exp(-0.5 * float(i * i) / (uSigma * uSigma));
    s += k * texture(uT, uv + uSmer * float(i) / uVel); w += k;
  }
  o = s / w;
}`;

const SESTAVI = `#version 300 es
precision highp float;
uniform sampler2D uT; uniform sampler2D uM;
uniform vec2 uZaslon; uniform float uN;       // velikost platna, velikost slike (kvadrat, točke)
uniform float uMol;                            // utež sloja molekul
uniform float uKrog;                           // 1 = okrogel okular, 0 = kvadratni zaslon TEM
uniform float uSvetlost, uKontrast, uTopla, uSum, uTEM, uCas;
out vec4 o;
float h(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233)) + uCas) * 43758.5453); }
void main() {
  vec2 f = gl_FragCoord.xy - 0.5 * uZaslon;
  vec2 uv = f / uN + 0.5;
  float r = length(f) / (0.5 * uN);
  vec3 c = texture(uT, uv).rgb;
  if (uMol > 0.0) c = mix(c, texture(uM, uv).rgb, uMol);
  // kontrast okoli sive 0,82 (svetlo ozadje stekelca ostane svetlo), svetlost, barva žarnice
  c = clamp((c - 0.82) * uKontrast + 0.82, 0.0, 1.0);
  c *= uSvetlost;
  if (uTEM < 0.5) c *= mix(vec3(1.0), vec3(1.0, 0.86, 0.66), uTopla);
  else c *= vec3(0.96, 1.0, 0.98);
  float n = (h(gl_FragCoord.xy) - 0.5) * uSum;
  c += n * sqrt(max(c, 0.0));
  float rob;
  if (uKrog > 0.5) {
    rob = 1.0 - smoothstep(0.985, 1.0, r);
    c *= 1.0 - 0.22 * smoothstep(0.55, 1.0, r) * smoothstep(0.55, 1.0, r);
  } else {
    rob = 1.0; // slika TEM pokrije ves oder (zaobljene robove da oder)
  }
  o = vec4(mix(vec3(0.0), clamp(c, 0.0, 1.0), rob), 1.0);
}`;

function program(gl, fs) {
  const sh = (tip, src) => {
    const s = gl.createShader(tip);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(s);
      const vrstice = src.split("\n");
      const m = /0:(\d+)/.exec(log || "");
      const okolica = m ? vrstice.slice(Math.max(0, +m[1] - 3), +m[1] + 2).join("\n") : "";
      throw new Error(`Senčilnik: ${log}\n${okolica}`);
    }
    return s;
  };
  const p = gl.createProgram();
  gl.attachShader(p, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
  gl.bindAttribLocation(p, 0, "a");
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const loc = {};
  const u = (ime) => (ime in loc ? loc[ime] : (loc[ime] = gl.getUniformLocation(p, ime)));
  return { p, u };
}

function tekstura(gl, n, plavajoca = false) {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  if (plavajoca) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, n[0], n[1], 0, gl.RGBA, gl.FLOAT, null);
  else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, n[0], n[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  const filt = plavajoca ? gl.NEAREST : gl.LINEAR;
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filt);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filt);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const f = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, f);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
  return { t, f, n };
}

export function ustvariUpodobitev(platno) {
  const gl = platno.getContext("webgl2", { antialias: false, alpha: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
  if (!gl) {
    const e = new Error("webgl2");
    e.koda = "webgl";
    throw e;
  }
  const plavajoce = !!gl.getExtension("EXT_color_buffer_float");
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const blur = program(gl, BLUR);
  const sestavi = program(gl, SESTAVI);
  let mol = null; // prevede se ob prvi uporabi
  let prep = null;
  let prepId = null;
  const sonda = plavajoce ? tekstura(gl, [8, 2], true) : null;
  let T = null; // { a, b, m } teksture velikosti n
  const pripravi = (n) => {
    if (T && T.n === n) return;
    if (T) for (const x of [T.a, T.b, T.m]) {
      gl.deleteTexture(x.t);
      gl.deleteFramebuffer(x.f);
    }
    T = { n, a: tekstura(gl, [n, n]), b: tekstura(gl, [n, n]), m: tekstura(gl, [n, n]) };
  };
  const risi = (fb, w, h) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.viewport(0, 0, w, h);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  return {
    gl,
    plavajoce,
    // Preparat: { id, glsl } (preparati/*.js). Prevajanje traja, zato le ob menjavi.
    nastaviPreparat(p) {
      if (prepId === p.id) return;
      const nov = program(gl, fragmentPreparata(p.glsl));
      if (prep) gl.deleteProgram(prep.p);
      prep = nov;
      prepId = p.id;
    },
    // Sonda: snov in membrana v točkah (µm) na ravni TEM. Vrne [{ snov, meja, smer, snovT, tip, r1, jedro }].
    sonda(tocke) {
      if (!sonda || !prep) return null;
      gl.useProgram(prep.p);
      const arr = new Float32Array(16);
      tocke.slice(0, 8).forEach((t, i) => arr.set(t, i * 2));
      gl.uniform2fv(prep.u("uSonda"), arr);
      gl.uniform1i(prep.u("uNacin"), 2);
      risi(sonda.f, 8, 2);
      const px = new Float32Array(8 * 2 * 4);
      gl.readPixels(0, 0, 8, 2, gl.RGBA, gl.FLOAT, px);
      return tocke.slice(0, 8).map((_, i) => ({
        snov: px[i * 4], meja: px[i * 4 + 1], smer: [px[i * 4 + 2], px[i * 4 + 3]],
        snovT: px[32 + i * 4], tip: px[32 + i * 4 + 1], r1: px[32 + i * 4 + 2], jedro: px[32 + i * 4 + 3],
      }));
    },
    // v = { n, sredisce [µm], umNaTocko, tem, barvila (9 števil, stolpci), debelina, sigma (točke),
    //       mol: null | { utez, uniforme }, svetlost, kontrast, topla, sum, krog }
    narisi(v) {
      if (!prep) return;
      const n = v.n;
      pripravi(n);
      gl.useProgram(prep.p);
      gl.uniform2f(prep.u("uRes"), n, n);
      gl.uniform2f(prep.u("uCenter"), v.sredisce[0], v.sredisce[1]);
      gl.uniform1f(prep.u("uPx"), v.umNaTocko);
      gl.uniform1i(prep.u("uNacin"), v.tem ? 1 : 0);
      gl.uniformMatrix3fv(prep.u("uBarvila"), false, v.barvila);
      gl.uniform1f(prep.u("uDebelina"), v.debelina);
      risi(T.a.f, n, n);
      // zamegljenost: vodoravno a → b, navpično b → a
      gl.useProgram(blur.p);
      gl.uniform2f(blur.u("uVel"), n, n);
      gl.uniform1f(blur.u("uSigma"), v.sigma);
      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(blur.u("uT"), 0);
      gl.bindTexture(gl.TEXTURE_2D, T.a.t);
      gl.uniform2f(blur.u("uSmer"), 1, 0);
      risi(T.b.f, n, n);
      gl.bindTexture(gl.TEXTURE_2D, T.b.t);
      gl.uniform2f(blur.u("uSmer"), 0, 1);
      risi(T.a.f, n, n);
      // molekule in atomi
      let utez = 0;
      if (v.mol && v.mol.utez > 0) {
        if (!mol) mol = program(gl, MOLEKULE);
        gl.useProgram(mol.p);
        gl.uniform2f(mol.u("uRes"), n, n);
        const U = v.mol.uniforme;
        gl.uniform1f(mol.u("uPxNm"), v.umNaTocko * 1000);
        gl.uniform2f(mol.u("uFine"), U.fine[0], U.fine[1]);
        gl.uniform1f(mol.u("uA"), U.a);
        gl.uniform1f(mol.u("uB"), U.b);
        gl.uniform1f(mol.u("uMem"), U.mem);
        gl.uniform1f(mol.u("uY0"), U.y0);
        gl.uniform2f(mol.u("uN"), U.n[0], U.n[1]);
        gl.uniform2f(mol.u("uSmer"), U.smer[0], U.smer[1]);
        gl.uniform1f(mol.u("uSmerL"), U.smerL);
        gl.uniform1f(mol.u("uFaza"), U.faza);
        gl.uniform1f(mol.u("uBarve"), U.barve);
        risi(T.m.f, n, n);
        utez = v.mol.utez;
      }
      // sestava na zaslon
      gl.useProgram(sestavi.p);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, T.a.t);
      gl.uniform1i(sestavi.u("uT"), 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, T.m.t);
      gl.uniform1i(sestavi.u("uM"), 1);
      gl.activeTexture(gl.TEXTURE0);
      const W = platno.width, H = platno.height;
      gl.uniform2f(sestavi.u("uZaslon"), W, H);
      gl.uniform1f(sestavi.u("uN"), v.zaslonN || Math.min(W, H));
      gl.uniform1f(sestavi.u("uMol"), utez);
      gl.uniform1f(sestavi.u("uKrog"), v.krog ? 1 : 0);
      gl.uniform1f(sestavi.u("uSvetlost"), v.svetlost);
      gl.uniform1f(sestavi.u("uKontrast"), v.kontrast);
      gl.uniform1f(sestavi.u("uTopla"), v.topla);
      gl.uniform1f(sestavi.u("uSum"), v.sum);
      gl.uniform1f(sestavi.u("uTEM"), v.tem ? 1 : 0);
      gl.uniform1f(sestavi.u("uCas"), (v.cas || 0) % 100);
      risi(null, W, H);
    },
    unici() {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
