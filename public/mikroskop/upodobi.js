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

// Program iz senčilnika. Z vzporednim prevajanjem (KHR_parallel_shader_compile, večina telefonov) vrne obljubo, ki se
// izpolni, ko je program preveden, in medtem ne blokira strani; sicer preveri takoj (kot prej).
function zgradi(gl, fs) {
  const sh = (tip, src) => {
    const s = gl.createShader(tip);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const vs = sh(gl.VERTEX_SHADER, VS), fsh = sh(gl.FRAGMENT_SHADER, fs);
  const p = gl.createProgram();
  gl.attachShader(p, vs);
  gl.attachShader(p, fsh);
  gl.bindAttribLocation(p, 0, "a");
  gl.linkProgram(p);
  return { p, vs, fsh, src: fs };
}
function preveri(gl, g) {
  if (!gl.getProgramParameter(g.p, gl.LINK_STATUS)) {
    for (const s of [g.fsh, g.vs]) {
      if (gl.getShaderParameter(s, gl.COMPILE_STATUS)) continue;
      const log = gl.getShaderInfoLog(s);
      const vrstice = (s === g.fsh ? g.src : VS).split("\n");
      const m = /0:(\d+)/.exec(log || "");
      const okolica = m ? vrstice.slice(Math.max(0, +m[1] - 3), +m[1] + 2).join("\n") : "";
      throw new Error(`Senčilnik: ${log}\n${okolica}`);
    }
    throw new Error(gl.getProgramInfoLog(g.p));
  }
  gl.deleteShader(g.vs);
  gl.deleteShader(g.fsh);
  const loc = {};
  const u = (ime) => (ime in loc ? loc[ime] : (loc[ime] = gl.getUniformLocation(g.p, ime)));
  return { p: g.p, u };
}
function program(gl, fs) {
  return preveri(gl, zgradi(gl, fs));
}
function programVzporedno(gl, fs, ext) {
  const g = zgradi(gl, fs);
  if (!ext) return Promise.resolve().then(() => preveri(gl, g));
  return new Promise((ok, napaka) => {
    const cakaj = () => {
      try {
        if (gl.isContextLost()) napaka(new Error("WebGL: kontekst izgubljen"));
        else if (gl.getProgramParameter(g.p, ext.COMPLETION_STATUS_KHR)) ok(preveri(gl, g));
        else setTimeout(cakaj, 16);
      } catch (e) {
        napaka(e);
      }
    };
    cakaj();
  });
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
  let idT = null; // majhna tekstura za prehod z režami molekul (oznake)
  const nastaviMol = (U, res, pxNm, idPass) => {
    gl.useProgram(mol.p);
    gl.uniform2f(mol.u("uRes"), res, res);
    gl.uniform1f(mol.u("uPxNm"), pxNm);
    gl.uniform2f(mol.u("uFine"), U.fine[0], U.fine[1]);
    gl.uniform1f(mol.u("uMem"), U.mem);
    gl.uniform1f(mol.u("uY0"), U.y0);
    gl.uniform2f(mol.u("uN"), U.n[0], U.n[1]);
    gl.uniform2f(mol.u("uSmer"), U.smer[0], U.smer[1]);
    gl.uniform1f(mol.u("uSmerL"), U.smerL);
    gl.uniform1f(mol.u("uFaza"), U.faza);
    gl.uniform1f(mol.u("uBarve"), U.barve);
    gl.uniform1f(mol.u("uPA"), U.pA);
    gl.uniform1f(mol.u("uPB"), U.pB);
    gl.uniform1f(mol.u("uMemVrsta"), U.memVrsta);
    gl.uniform1f(mol.u("uZun"), U.zun);
    gl.uniform1f(mol.u("uBodice"), U.bodice);
    gl.uniform3fv(mol.u("uBarvaMol"), U.barve3);
    gl.uniform1fv(mol.u("uGostMol"), U.gost);
    gl.uniform1fv(mol.u("uAtMol"), U.at);
    gl.uniform1i(mol.u("uIdPass"), idPass);
  };
  let prep = null;
  let prepId = null;
  let prepSem = null; // SEM: ločen program preparata, preveden šele ob prvem izrisu SEM (glsl.js fragmentPreparata)
  let prepGlsl = "";
  const sonda = plavajoce ? tekstura(gl, [8, 2], true) : null;
  // Teksture po velikosti n: p (preparat, ostane, dokler se pogled ne spremeni), a in b (zamegljenost), m (molekule).
  // Hranimo tri velikosti (polna slika in predogleda, med katerima skala niha), da se ob prehodih ne ustvarjajo znova.
  const kompleti = new Map();
  let T = null;
  const pripravi = (n) => {
    T = kompleti.get(n);
    if (T) {
      kompleti.delete(n);
      kompleti.set(n, T);
      return;
    }
    T = { n, p: tekstura(gl, [n, n]), a: tekstura(gl, [n, n]), b: tekstura(gl, [n, n]), m: tekstura(gl, [n, n]) };
    kompleti.set(n, T);
    while (kompleti.size > 3) {
      const [k, star] = kompleti.entries().next().value;
      for (const x of [star.p, star.a, star.b, star.m]) {
        gl.deleteTexture(x.t);
        gl.deleteFramebuffer(x.f);
      }
      kompleti.delete(k);
    }
  };
  const risi = (fb, w, h) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.viewport(0, 0, w, h);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const vzporedno = gl.getExtension("KHR_parallel_shader_compile");
  const piksel = new Uint8Array(4);
  let zadnjaZahteva = 0;

  const api = {
    gl,
    plavajoce,
    // Preparat: { id, glsl } (preparati/*.js). Prevajanje traja (na telefonu tudi sekundo ali več), zato le ob menjavi
    // in, kjer gre, vzporedno: stran med tem ostane odzivna. Vrne obljubo.
    // velja(): klicatelj še želi ta preparat (med nalaganjem ali prevajanjem ni izbral drugega ali zaprl mikroskopa)
    async nastaviPreparat(p, velja = () => true) {
      const moja = ++zadnjaZahteva;
      if (prepId === p.id) return;
      const nov = await programVzporedno(gl, fragmentPreparata(p.glsl), vzporedno);
      // med prevajanjem je bil izbran drug preparat: velja zadnja izbira
      if (moja !== zadnjaZahteva || !velja()) return void gl.deleteProgram(nov.p);
      if (prep) gl.deleteProgram(prep.p);
      if (prepSem) gl.deleteProgram(prepSem.p);
      prep = nov;
      prepSem = null;
      prepGlsl = p.glsl;
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
    // Preparat v teksturo p, le vrstice y0 ≤ y < y1 (izris po pasovih: dolg izris na telefonu razdelimo na več sličic,
    // da stran ne zamrzne in GPU ne preseže časovne meje). Najdražji del celotnega izrisa.
    narisiPreparat(v, y0 = 0, y1 = v.n) {
      if (!prep) return;
      const n = v.n;
      pripravi(n);
      const nacin = v.nacin ?? (v.tem ? 1 : 0);
      if (nacin === 3 && !prepSem) prepSem = program(gl, fragmentPreparata(prepGlsl, { sem: true }));
      const pr = nacin === 3 ? prepSem : prep;
      gl.useProgram(pr.p);
      gl.uniform2f(pr.u("uRes"), n, n);
      gl.uniform2f(pr.u("uCenter"), v.sredisce[0], v.sredisce[1]);
      gl.uniform1f(pr.u("uPx"), v.umNaTocko);
      gl.uniform1i(pr.u("uNacin"), nacin);
      gl.uniformMatrix3fv(pr.u("uBarvila"), false, v.barvila);
      gl.uniform1f(pr.u("uDebelina"), v.debelina);
      gl.uniform1i(pr.u("uSS"), v.ss || 1);
      const delno = y0 > 0 || y1 < n;
      if (delno) {
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(0, y0, n, Math.max(0, Math.min(n, y1) - y0));
      }
      risi(T.p.f, n, n);
      if (delno) gl.disable(gl.SCISSOR_TEST);
    },
    // Ali so teksture za velikost n še shranjene (sicer je treba preparat narisati znova).
    ima(n) {
      return kompleti.has(n);
    },
    // Počaka, da GPU konča dosedanje delo (en piksel iz teksture preparata): za merjenje časa pasu.
    pocakaj() {
      if (!T) return;
      gl.bindFramebuffer(gl.FRAMEBUFFER, T.p.f);
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, piksel);
    },
    // Iz že narisanega preparata (narisiPreparat za isti v.n): zamegljenost, molekule in sestava na zaslon. Poceni,
    // zato drsniki (lučka, zaslonka, ostrina) ne rišejo preparata znova.
    sestavi(v) {
      if (!prep) return;
      const n = v.n;
      pripravi(n);
      // zamegljenost: vodoravno p → b, navpično b → a
      gl.useProgram(blur.p);
      gl.uniform2f(blur.u("uVel"), n, n);
      gl.uniform1f(blur.u("uSigma"), v.sigma);
      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(blur.u("uT"), 0);
      gl.bindTexture(gl.TEXTURE_2D, T.p.t);
      gl.uniform2f(blur.u("uSmer"), 1, 0);
      risi(T.b.f, n, n);
      gl.bindTexture(gl.TEXTURE_2D, T.b.t);
      gl.uniform2f(blur.u("uSmer"), 0, 1);
      risi(T.a.f, n, n);
      // molekule in atomi
      let utez = 0;
      if (v.mol && v.mol.utez > 0) {
        if (!mol) mol = program(gl, MOLEKULE);
        nastaviMol(v.mol.uniforme, n, v.umNaTocko * 1000, 0);
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
      gl.uniform1f(sestavi.u("uTEM"), v.elektroni ?? v.tem ? 1 : 0);
      gl.uniform1f(sestavi.u("uCas"), (v.cas || 0) % 100);
      gl.uniform1f(sestavi.u("uLom"), v.lom || 0);
      gl.uniform1f(sestavi.u("uLomD"), Math.max(1.5, 0.8 * (v.sigma || 0)) / n);
      gl.uniform1f(sestavi.u("uKA"), v.krog ? 0.003 : 0);
      risi(null, W, H);
    },
    // v = { n, sredisce [µm], umNaTocko, tem, barvila (9 števil, stolpci), debelina, sigma (točke),
    //       mol: null | { utez, uniforme }, svetlost, kontrast, topla, sum, krog }: celoten izris naenkrat
    narisi(v) {
      if (!prep) return;
      api.narisiPreparat(v);
      api.sestavi(v);
    },
    // Reže molekul v mreži k × k čez isto vidno polje kot izris v (za oznake z imeni): vrednost = reža + 1, 0 = nič.
    // Kliči pred narisi: readPixels potem čaka le na majhen prehod k × k, ne na celoten izris molekul.
    idMolekul(v, k = 48) {
      if (!v.mol) return null;
      if (!mol) mol = program(gl, MOLEKULE);
      if (!idT) idT = tekstura(gl, [k, k]);
      nastaviMol(v.mol.uniforme, k, (v.umNaTocko * 1000 * v.n) / k, 1);
      risi(idT.f, k, k);
      const px = new Uint8Array(k * k * 4);
      gl.readPixels(0, 0, k, k, gl.RGBA, gl.UNSIGNED_BYTE, px);
      const r = new Uint8Array(k * k);
      for (let i = 0; i < k * k; i++) r[i] = px[i * 4];
      return r;
    },
    unici() {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
  return api;
}
