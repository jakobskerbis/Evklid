// CT in MR ob fotografiji v pogledu »Pravi prerez« (docs/3d.md »CT in MR«): ista rezina, isti drsnik in ista imena struktur,
// slika pa je lahko fotografija, CT ali MR. Podatke pripravi scripts/atlas/ctmr.py v mapo telesa: ctmr.json, ct/a|k|s/<i>.webp,
// ct/mali.webp, mr/<t1|t2|pd>/<z>.webp. Brez ctmr.json (ženska, starejši podatki) gumbov ni.
// CT je ena slika na rezino s stisnjenimi HU (ctmr.json → ct.koda); okno (mehka tkiva, pljuča, kosti) naredi odjemalec s
// tabelo 256 vrednosti, zato menjava okna ne potrebuje omrežja. Raven OŠ: CT in MR sta skrita (načrt atlasa, j 10. 11.).
// Besedila (ctmr.*) so v public/3d/rezine-ctmr-besedila.json in se naložijo šele, ko se zgradi pogled (ne ob prvem odprtju).

export const NACINI = ["foto", "ct", "mr"];
export const OKNA = ["mehka", "pljuca", "kosti"];
export const SEKVENCE = ["t1", "t2", "pd"];
const IME_SEKVENCE = { t1: "T1", t2: "T2", pd: "PD" };

export const BESEDILA_SL = {
  "ctmr.image": "Slika",
  "ctmr.photo": "Fotografija",
  "ctmr.ct": "CT",
  "ctmr.mr": "MR",
  "ctmr.window": "Okno CT",
  "ctmr.win.mehka": "Mehka tkiva",
  "ctmr.win.pljuca": "Pljuča",
  "ctmr.win.kosti": "Kosti",
  "ctmr.sequence": "Sekvenca MR",
  "ctmr.mrHeadOnly": "MR je na voljo le v prečnih rezinah glave; tu je fotografija.",
  "ctmr.ctNone": "Za to rezino CT ni; tu je fotografija.",
};

// Slovar ctmr.* v jeziku vmesnika (veriga i18n/languages.js uiChain, srbska latinica kot v i18n.js); brez datoteke tuji
// jeziki dobijo angleščino iz datoteke ni mogoče, zato ostane slovenščina iz kode (BESEDILA_SL).
export async function naloziBesedila(json, koren = import.meta.url) {
  const [vse, jez, i18n] = await Promise.all([
    json(new URL("./rezine-ctmr-besedila.json", koren).href).catch(() => null),
    import(new URL("../i18n/languages.js", koren).href).catch(() => null),
    import(new URL("../i18n.js", koren).href).catch(() => null),
  ]);
  const lang = i18n?.currentLang?.() || globalThis.document?.documentElement.lang || "sl";
  return slovar(vse, jez?.uiChain ? jez.uiChain(lang) : [lang, "en", "sl"], i18n?.srToLatin || ((x) => x));
}
export function slovar(vse, veriga, lat = (x) => x) {
  const d = (vse ? veriga : []).map((c) => (c === "sr-Latn" && vse.sr ? Object.fromEntries(Object.entries(vse.sr).map(([k, v]) => [k, lat(v)])) : vse[c])).filter(Boolean);
  return (k) => d.find((x) => x[k] != null)?.[k] ?? BESEDILA_SL[k];
}

// Tabela okna: koda (0–255) → sivina 0–255. koda = { hu: [...], v: [...] } (odsekoma linearno, naraščajoče), okno [središče, širina].
export function lutOkna(koda, [c, w]) {
  const lut = new Uint8Array(256), { hu, v } = koda;
  for (let k = 0; k < 256; k++) {
    let j = 1;
    while (j < v.length - 1 && k > v[j]) j++;
    const t = (k - v[j - 1]) / (v[j] - v[j - 1] || 1);
    const h = hu[j - 1] + Math.max(0, Math.min(1, t)) * (hu[j] - hu[j - 1]);
    lut[k] = Math.round(255 * Math.max(0, Math.min(1, (h - (c - w / 2)) / w)));
  }
  return lut;
}

// RGBA na mestu: sivina iz zelenega kanala skozi tabelo (alfa ostane).
export function uporabiLut(data, lut) {
  for (let i = 0; i < data.length; i += 4) {
    const g = lut[data[i + 1]];
    data[i] = data[i + 1] = data[i + 2] = g;
  }
  return data;
}

// Najbližja rezina MR (debelina 4 mm na vsakih 5 mm): indeks z ali -1, če je rezina dlje od pol debeline + 0,5 mm.
export function rezinaMr(mr, i) {
  if (!mr?.rezine?.length) return -1;
  let naj = -1, d = Infinity;
  for (const z of mr.rezine) if (Math.abs(z - i) < d) { d = Math.abs(z - i); naj = z; }
  return d <= (mr.debelina || 4) / 2 + 0.5 ? naj : -1;
}

// Načini, ki jih telo ima za to smer in raven (OŠ: samo fotografija).
export function naciniZa(cm, { os = false, smer = "a" } = {}) {
  const out = ["foto"];
  if (!cm || os) return out;
  if (cm.ct && (cm.ct.ravnine || ["a"]).includes(smer)) out.push("ct");
  if (cm.mr && (cm.mr.ravnine || ["a"]).includes(smer)) out.push("mr");
  return out;
}

// Pot slike (glede na mapo telesa) za izbrani način ali null, ko je tu ni (takrat ostane fotografija).
export function potSlike(cm, izb, smer, i) {
  if (!cm || izb.nacin === "foto") return null;
  if (izb.nacin === "ct" && cm.ct) {
    if (smer === "a" && (i < cm.ct.od || i > cm.ct.do)) return null;
    return `${cm.ct.mapa}${smer}/${i}.webp`;
  }
  if (izb.nacin === "mr" && cm.mr && smer === "a") {
    const z = rezinaMr(cm.mr, i);
    return z < 0 ? null : `${cm.mr.mapa}${izb.sekvenca}/${z}.webp`;
  }
  return null;
}

// Mali list CT (kot mali.webp fotografij: RGB = koda, A = delež telesa) → volumen { dim, mm, data }.
export function maliIzLista(rgba, sw, mali) {
  const [W, H, Z] = mali.dim, data = new Uint8Array(W * H * Z * 4);
  for (let z = 0; z < Z; z++) {
    const ox = (z % mali.stolpcev) * W, oy = Math.floor(z / mali.stolpcev) * H;
    for (let y = 0; y < H; y++) data.set(rgba.subarray(((oy + y) * sw + ox) * 4, ((oy + y) * sw + ox + W) * 4), (z * H + y) * W * 4);
  }
  return { dim: [W, H, Z], mm: mali.mm, data };
}

// Stanje slike za model. ustvari({ t, slika, rezinaMalega, ob }) → upravljavec; t(ključ, sl) prevede (ctmr.*),
// slika(url) → Promise<Image>, rezinaMalega(m, smer, i) iz rezine.js, ob() ob spremembi (model postavi rezino znova).
export function ustvari({ t = (k, sl) => sl, slika, rezinaMalega, ob = () => {} }) {
  const izb = { nacin: "foto", okno: "mehka", sekvenca: "t1" };
  let cm = null, url = "", mali = null, maliZa = "", ctx = { os: false, smer: "a", i: 0 };
  const luti = new Map(), napovedane = new Set();
  const lut = () => {
    const k = izb.okno;
    if (!luti.has(k)) luti.set(k, lutOkna(cm.ct.koda, cm.ct.okna?.[k] || [40, 400]));
    return luti.get(k);
  };
  const na = () => naciniZa(cm, ctx);
  const nacin = () => (na().includes(izb.nacin) ? izb.nacin : "foto"); // npr. MR pri frontalni smeri → fotografija

  async function naloziMali() {
    if (!cm?.ct?.mali || maliZa === url) return;
    maliZa = url;
    try {
      const im = await slika(new URL(cm.ct.mali.datoteka, url).href);
      const c = document.createElement("canvas");
      c.width = im.naturalWidth; c.height = im.naturalHeight;
      const g = c.getContext("2d", { willReadFrequently: true });
      g.drawImage(im, 0, 0);
      mali = maliIzLista(g.getImageData(0, 0, c.width, c.height).data, c.width, cm.ct.mali);
      ob();
    } catch (err) {
      console.warn("3D rezine: mali CT ni na voljo", err?.message || err);
      maliZa = "";
    }
  }
  // MR: vse rezine izbrane sekvence vnaprej (≈ 33 × 10 KB), da drsnik skozi glavo ne čaka
  function napovejMr() {
    if (!cm?.mr) return;
    const k = `${url}${izb.sekvenca}`;
    if (napovedane.has(k)) return;
    napovedane.add(k);
    for (const z of cm.mr.rezine) slika(new URL(`${cm.mr.mapa}${izb.sekvenca}/${z}.webp`, url).href).catch(() => {});
  }

  const izbira = (id, moznosti) => ({
    tip: "izbira", id, oznaka: t("ctmr.image", BESEDILA_SL["ctmr.image"]), moznosti, vrednost: izb.nacin,
    vidno: () => na().length > 1 && na().length === moznosti.length,
    ob: (v) => { izb.nacin = v; if (v === "ct") naloziMali(); if (v === "mr") napovejMr(); sinh(); ob(); },
  });
  const nFoto = ["foto", t("ctmr.photo", BESEDILA_SL["ctmr.photo"])], nCt = ["ct", t("ctmr.ct", "CT")], nMr = ["mr", t("ctmr.mr", "MR")];
  const nSlika = izbira("slika", [nFoto, nCt]);
  const nSlikaMr = izbira("slika-mr", [nFoto, nCt, nMr]);
  const nOkno = { tip: "izbira", id: "okno-ct", oznaka: t("ctmr.window", BESEDILA_SL["ctmr.window"]),
    moznosti: OKNA.map((k) => [k, t(`ctmr.win.${k}`, BESEDILA_SL[`ctmr.win.${k}`])]), vrednost: izb.okno,
    vidno: () => nacin() === "ct", ob: (v) => { izb.okno = v; ob(); } };
  const nSekvenca = { tip: "izbira", id: "sekvenca-mr", oznaka: t("ctmr.sequence", BESEDILA_SL["ctmr.sequence"]),
    moznosti: SEKVENCE.map((k) => [k, IME_SEKVENCE[k]]), vrednost: izb.sekvenca,
    vidno: () => nacin() === "mr" && (cm?.mr?.sekvence || []).length > 1, ob: (v) => { izb.sekvenca = v; napovejMr(); ob(); } };
  const nStanje = { tip: "izpis", id: "ctmr-stanje", oznaka: t("ctmr.image", BESEDILA_SL["ctmr.image"]), vidno: () => !!status(), vrednost: () => status() };
  function sinh() {
    nSlika.vrednost = nSlikaMr.vrednost = nacin(); nOkno.vrednost = izb.okno; nSekvenca.vrednost = izb.sekvenca;
  }
  // izbran MR ali CT, a za to rezino ga ni: tiho fotografija in ena vrstica, zakaj
  function status() {
    const n = nacin();
    if (n === "foto" || !cm) return "";
    if (potSlike(cm, { ...izb, nacin: n }, ctx.smer, ctx.i)) return "";
    return n === "mr" ? t("ctmr.mrHeadOnly", BESEDILA_SL["ctmr.mrHeadOnly"]) : t("ctmr.ctNone", BESEDILA_SL["ctmr.ctNone"]);
  }

  return {
    // ctmr.json telesa (mapa u) ali null; nastavi(u, podatki) šele, ko je telo res naloženo (hitra menjava teles)
    preberi: (u, json) => json(u + "ctmr.json").catch(() => null),
    nastavi(u, podatki) {
      url = u; mali = null; maliZa = ""; luti.clear();
      cm = podatki && (podatki.ct || podatki.mr) ? podatki : null;
      if (cm && nacin() === "ct") naloziMali();
      sinh();
      return cm;
    },
    get podatki() { return cm; },
    // model pove lego (pred vsakim risanjem rezine)
    lega(os, smer, i) {
      ctx = { os, smer, i };
      if (os) izb.nacin = "foto"; // OŠ: CT in MR skrita, vedno fotografija
      sinh();
    },
    get nacin() { return nacin(); },
    jeFoto: () => nacin() === "foto" || !potSlike(cm, { ...izb, nacin: nacin() }, ctx.smer, ctx.i),
    kljuc: () => `${nacin()}:${nacin() === "ct" ? izb.okno : nacin() === "mr" ? izb.sekvenca : ""}`,
    // ostra slika: { url, pretvori, kljuc } ali null (fotografija)
    ostra() {
      const p = potSlike(cm, { ...izb, nacin: nacin() }, ctx.smer, ctx.i);
      if (!p) return null;
      const u = new URL(p, url).href;
      if (nacin() !== "ct") return { url: u, kljuc: u, pretvori: null };
      const l = lut();
      return { url: u, kljuc: `${u}#${izb.okno}`, pretvori: (im) => {
        const c = document.createElement("canvas");
        c.width = im.naturalWidth || im.width; c.height = im.naturalHeight || im.height;
        const g = c.getContext("2d", { willReadFrequently: true });
        g.drawImage(im, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height);
        uporabiLut(d.data, l);
        g.putImageData(d, 0, 0);
        return c;
      } };
    },
    // nizka ločljivost med premikanjem drsnika: CT iz malega lista z oknom; MR: prazna rezina (slike so že naložene),
    // fotografija → null (model riše mali volumen fotografij)
    mali(smer, iMali, fotoMala) {
      const n = nacin();
      if (n === "foto" || !potSlike(cm, { ...izb, nacin: n }, smer, ctx.i)) return null;
      if (n === "mr") return { w: fotoMala.w, h: fotoMala.h, data: new Uint8ClampedArray(fotoMala.data.length) };
      if (!mali) { naloziMali(); return null; }
      const r = rezinaMalega(mali, smer, iMali);
      if (r.w !== fotoMala.w || r.h !== fotoMala.h) return null;
      uporabiLut(r.data, lut());
      return r;
    },
    nadzor: [nSlika, nSlikaMr, nOkno, nSekvenca, nStanje],
    sinh,
    _izb: izb,
  };
}
