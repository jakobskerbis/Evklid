// Kliki brez čakanja (j 15. 11. 2026: »vse se ob kliku odpre takoj«, naloga hitrost klikov 20. 11. 2026).
// Pomnilniki in vnaprejšnji prenosi, ki jih kliče app.js (tu so, da app.js ostane v proračunu velikosti,
// test/hitrost-proracun.test.js); nič od tega ne spremeni videza, le kdaj so podatki in moduli že na napravi.

// Po naslednji sliki: tap se nariše takoj, težji izris (tema, naloga, liga) pride v naslednji nalogi.
// Skrit zavihek nima okvirjev, zato največ 100 ms.
export const poSliki = () =>
  new Promise((ok) => {
    const t = setTimeout(ok, 100);
    requestAnimationFrame(() => setTimeout(() => (clearTimeout(t), ok()), 0));
  });

// Vzporedno nalaganje lenega modula (»vzporedno, ne zaporedno«): vse njegove odvisnosti hkrati (<link rel=modulepreload>,
// seznam s strežnika /lene-odvisnosti.js) namesto ravni za ravnijo uvozov; na Slow 4G je vsaka raven ~0,6 s.
let odvisnosti = null;
export const naloziOdvisnosti = () =>
  (odvisnosti ||= import("./lene-odvisnosti.js").then((m) => m.default || {}).catch(() => {
    odvisnosti = null;
    return {};
  }));
const vnaprejModuli = new Set();
export function vzporedno(entry) {
  return naloziOdvisnosti().then((map) => {
    for (const u of map[entry] || []) {
      if (vnaprejModuli.has(u)) continue;
      vnaprejModuli.add(u);
      document.head.append(Object.assign(document.createElement("link"), { rel: "modulepreload", href: u }));
    }
  });
}

// Naslov Učne poti učenca za ključ poti (teme().pathData in app.js openTopic pred nalaganjem vadnice).
export const pathUrl = (sid, key) => `/api/students/${sid}/path?key=${encodeURIComponent(key)}`;

// Vsebina teme (/api/topic, javna in enaka v seji): ena zahteva na temo in jezik; neuspeh se ne zapomni.
// Stanje teme (sklop, vaje, status) iz zadnje Učne poti učenca: velja, dokler ni nobene spremembe (gen) in za istega učenca.
export function teme({ api, kopija, jezik, ucenec, gen }) {
  const vsebine = new Map(); // url -> { p, v } (v: prispel odgovor)
  function entry(id) {
    const url = `/api/topic?id=${encodeURIComponent(id)}&lang=${encodeURIComponent(jezik())}`;
    let e = vsebine.get(url);
    if (!e) {
      e = { p: api(url), v: null };
      e.p.then((v) => (e.v = v), () => vsebine.get(url) === e && vsebine.delete(url));
      if (vsebine.size >= 60) vsebine.delete(vsebine.keys().next().value);
      vsebine.set(url, e);
    }
    return e;
  }
  let pot = null; // { key, sid, gen, t, units }: velja 60 s kot topli (stanje teme se lahko spremeni drugje)
  const keepPath = (p, sid, g) => {
    if (p?.key && Array.isArray(p.units) && g === gen() && ucenec() === sid) pot = { key: p.key, sid, gen: g, t: Date.now(), units: structuredClone(p.units) };
    return p;
  };
  return {
    entry,
    content: (id) => entry(id).p.then(kopija),
    keepPath,
    pathData(key) {
      const sid = ucenec();
      const g = gen();
      return api(pathUrl(sid, key)).then((p) => keepPath(p, sid, g));
    },
    unitsFor(topicId) {
      const c = pot;
      if (!c || c.gen !== gen() || c.sid !== ucenec() || Date.now() - c.t > 60_000 || !c.units.some((u) => u.topics.some((x) => x.id === topicId))) return null;
      return structuredClone(c.units);
    },
  };
}

// Zapomnjen izris (razlaga teme): ključ so vsi vhodi; zadnjih `n`.
export function zapomni(n = 20) {
  const m = new Map();
  return (k, izris) => {
    if (k == null) return izris();
    if (m.has(k)) return m.get(k);
    const v = izris();
    if (m.size >= n) m.delete(m.keys().next().value);
    m.set(k, v);
    return v;
  };
}

// Naslednja naloga vadnice vnaprej (po preverjenem odgovoru in ob odprti temi v učenju). Strežnik ob { vnaprej: true }
// ne pokaže zgleda in ne spremeni stanja teme; naloga je enaka, kot bi jo dobil ob kliku. Velja za istega učenca in
// temo, največ 60 s in samo, če vmes ni bilo nobene druge spremembe (gen).
export function vadnica({ api, ucenec, tema, gen, smem }) {
  let naprej = null; // { sid, topic, gen, p }
  return {
    prefetch(topicId) {
      const sid = ucenec();
      if (!sid || !topicId || !smem()) return;
      const e = { sid, topic: topicId, gen: gen(), t: Date.now(), p: api(`/api/students/${sid}/practice/next`, { method: "POST", body: { topic_id: topicId, vnaprej: true }, ohrani: true, ozadje: true }) };
      e.p.catch(() => naprej === e && (naprej = null));
      naprej = e;
    },
    take() {
      const e = naprej;
      naprej = null;
      // Največ 60 s kot topli: starejšo nalogo strežnik ob običajnem kliku osveži (created_at) ali ustvari znova.
      if (!e || e.sid !== ucenec() || e.topic !== tema() || e.gen !== gen() || Date.now() - e.t > 60000) return null;
      return e.p.then((out) => (out?.task ? out : null), () => null);
    },
  };
}

// Vnaprej prenesen GET: prvi klic istega naslova ga porabi, če je za istega učenca, mlajši od 60 s in vmes ni bilo
// nobene spremembe (gen). Edini tak mehanizem v app.js (prej še apiVnaprej s 15 s): dotik, mirovanje in podatki
// zaslona hkrati z modulom. drop: modul zaslona se ni naložil, odgovor ne čaka poznejšega klica.
export function topli({ get, gen, ucenec = () => null }) {
  const m = new Map(); // url -> { p, gen, sid, t }
  const svez = (w) => w && w.gen === gen() && w.sid === ucenec() && Date.now() - w.t < 60_000;
  return {
    prefetch(url) {
      if (svez(m.get(url))) return;
      const e = { p: get(url), gen: gen(), sid: ucenec(), t: Date.now() };
      e.p.catch(() => m.get(url) === e && m.delete(url));
      m.set(url, e);
    },
    take(url) {
      const w = m.get(url);
      m.delete(url);
      return svez(w) ? w.p : null;
    },
    drop: (url) => m.delete(url),
    clear: () => m.clear(),
  };
}

// Verjetne naslednje teme z Učne poti (naslednja, za ponovitev, v učenju): vsebina v mirovanju, nato še izris razlage.
export function temeVnaprej(root, { entry, whenIdle, izrisi }) {
  const ids = [...root.querySelectorAll(".node.current[data-open], .node.due[data-open], .node.learning[data-open]")]
    .map((b) => b.dataset.open)
    .filter((id, i, a) => a.indexOf(id) === i)
    .slice(0, 4);
  whenIdle(() => ids.forEach((id) => entry(id).p.then((tp) => tp?.explanation && whenIdle(() => izrisi(tp)), () => {})));
}
