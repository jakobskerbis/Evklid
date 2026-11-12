// Živalska in rastlinska celica druga ob drugi v istem merilu; izbira »Poudari« pokaže skupne dele in dele, ki jih ima le
// ena. Obe celici zgradita graditelja zivalska.js in rastlinska.js (isti videz in deli), tu sta pomanjšani, obrnjeni
// proti skupni kameri in z manj drobnimi deli, da gresta skupaj v proračun.
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta.
import { zgradi as zgradiZivalsko } from "./zivalska.js";
import { zgradi as zgradiRastlinsko } from "./rastlinska.js";
import { BARVE_UCBENIK } from "../../celice-videz.js";

export const info = {
  id: "celice-primerjava",
  naslov: "Živalska in rastlinska celica",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Živalska in rastlinska celica v istem merilu, obe v prerezu. Z izbiro »Poudari« vidiš, kateri deli so skupni in katere ima le živalska ali le rastlinska celica.",
  poskusi: "Izberi »Samo v rastlinski« in nato »Samo v živalski«: kateri deli zasvetijo?",
  merilo: { m: 80e-6, oznaka: "80 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const gib = ctx.gibanje !== false;
  const zac = ctx.zacetek || {};
  const group = new THREE.Group();
  const odpad = [];
  const v3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

  // ---------- obe celici ----------
  const Z = zgradiZivalsko(THREE, { kakovost: ctx.kakovost, gibanje: ctx.gibanje });
  const R = zgradiRastlinsko(THREE, { kakovost: ctx.kakovost, gibanje: ctx.gibanje, lahka: true });
  const delZ = Object.fromEntries(Z.deli.map((d) => [d.id, d]));
  const delR = Object.fromEntries(R.deli.map((d) => [d.id, d]));
  // živalska celica: manj ribosomov, beljakovin in mitohondrijev (je manjša na zaslonu)
  const skrci = (m, n) => { if (m && m.isInstancedMesh) m.count = Math.min(m.count, n); };
  skrci(delZ.ribosomi.meshes[0], hi ? 900 : 120);
  for (const m of delZ.membrana.meshes) skrci(m, hi ? 150 : 40);
  skrci(delZ.mitohondrij.meshes[0], hi ? 16 : 5);
  for (const m of delZ["jedrna-ovojnica"].meshes) skrci(m, hi ? 60 : 16);
  if (!hi) { delZ["zrnati-er"].meshes[1].visible = false; delZ.citoskelet.meshes[1].visible = false; }

  // Merilo: 1 enota = 40 µm. Živalska: 1 enota = 10 µm, rastlinska: 1 enota = 25 µm.
  const SZ = 10 / 40, SR = 25 / 40;
  // Skupna kamera C; vsaka celica je obrnjena tako, da jo C vidi kot njena lastna privzeta kamera.
  const C = v3(0, 0.42, 0.91).normalize(), GOR = v3(0, 1, 0);
  const baza = (f) => { const r = v3().crossVectors(GOR, f).normalize(), u = v3().crossVectors(f, r); return new THREE.Matrix4().makeBasis(r, u, f); };
  const desno = v3().crossVectors(GOR, C).normalize(), gor = v3().crossVectors(C, desno);
  function drzalo(M, s, polozaj) {
    const h = new THREE.Group();
    const rot = baza(C).multiply(baza(v3().fromArray(M.pogled).normalize()).transpose());
    h.quaternion.setFromRotationMatrix(rot);
    h.scale.setScalar(s);
    h.position.copy(polozaj);
    h.add(M.group);
    h.updateMatrix();
    group.add(h);
    return h;
  }
  // po diagonali (živalska levo zgoraj): okvir je bolj kvadraten, zato sta celici večji tudi na pokončnem telefonu
  const PZ = desno.clone().multiplyScalar(-0.6).addScaledVector(gor, 0.3), PR = desno.clone().multiplyScalar(0.22).addScaledVector(gor, -0.13);
  const hZ = drzalo(Z, SZ, PZ), hR = drzalo(R, SR, PR);
  const vSkupino = (h, t) => v3().fromArray(t).applyMatrix4(h.matrix).toArray().map((x) => Math.round(x * 1000) / 1000);

  // ---------- deli: skupni, samo v živalski, samo v rastlinski ----------
  const deli = [], skup = {};
  function del(sk, id, ime, opis, barva, viri) {
    const meshes = [];
    let tocka = null;
    for (const [h, d] of viri) {
      if (!d) continue;
      meshes.push(...d.meshes);
      if (!tocka) tocka = vSkupino(h, d.tocka);
    }
    meshes.forEach((m) => { m.userData.del = id; });
    skup[id] = sk;
    deli.push({ id, ime, opis, barva, meshes, tocka });
  }
  const oba = (id, idR = id) => [[hZ, delZ[id]], [hR, delR[idR]]];
  del("skupni", "membrana", "Celična membrana", "Prožna plast iz dveh plasti fosfolipidov, ki obdaja vsako celico in odloča, katere snovi vstopijo vanjo in izstopijo iz nje. Debelina je povečana.", "#9fb4ff", oba("membrana"));
  del("skupni", "citoplazma", "Citoplazma", "Želatinasta tekočina, ki napolnjuje celico; v njej so organeli. V rastlinski celici je le tanka plast ob steni.", "#5b4bb0", oba("citoplazma"));
  del("skupni", "jedro", "Jedro", "Hrani DNK z navodili za delovanje celice; imata ga obe celici.", "#8a3ef0", [...oba("jedro"), ...oba("nukleoplazma")]);
  del("skupni", "jedrna-ovojnica", "Jedrna ovojnica in pore", "Dvojna membrana okoli jedra s porami, skozi katere potujejo snovi med jedrom in citoplazmo.", "#6b36d6", oba("jedrna-ovojnica"));
  del("skupni", "kromatin", "Kromatin", "Dolge niti DNK, navite na beljakovine; pred delitvijo celice se zgostijo v kromosome.", "#5b22c4", oba("kromatin"));
  del("skupni", "jedrce", "Jedrce", "Gosto območje v jedru, kjer nastajajo deli ribosomov.", "#37128c", oba("jedrce"));
  del("skupni", "er", "Endoplazemski retikulum", "Sistem membranskih cistern in cevk: na zrnatem ER ribosomi izdelujejo beljakovine, gladki ER izdeluje maščobe.", "#4d61d9", [[hZ, delZ["zrnati-er"]], [hZ, delZ["gladki-er"]], [hR, delR.er]]);
  del("skupni", "golgi", "Golgijev aparat", "Kupi sploščenih membranskih vrečk, ki dodelajo, zapakirajo in razpošljejo beljakovine; rastlinska celica ima veliko majhnih kupčkov.", "#f0a12c", oba("golgi"));
  del("skupni", "mitohondrij", "Mitohondrij", "Pri celičnem dihanju pridobi energijo (ATP) iz glukoze in kisika; imajo ga živalske in rastlinske celice.", "#e29424", oba("mitohondrij"));
  del("skupni", "ribosomi", "Ribosomi", "Drobna zrnca, ki po navodilih iz DNK sestavljajo beljakovine.", "#ffc94a", oba("ribosomi"));
  del("skupni", "peroksisom", "Peroksisom", "Majhen mehurček z encimi, ki razgrajuje maščobne kisline in strupeni vodikov peroksid.", "#6ed98a", oba("peroksisom"));
  del("skupni", "citoskelet", "Citoskelet", "Mreža beljakovinskih vlaken in cevk, po kateri se premikajo organeli; živalski celici daje tudi obliko.", "#ffd84a", oba("citoskelet"));
  del("skupni", "mesicki", "Mešički", "Mehurčki, ki nosijo snovi od Golgijevega aparata do celične membrane.", "#41d3e6", oba("mesicki"));
  del("zival", "lizosom", "Lizosom", "Mehurček s prebavnimi encimi, ki razgradi odslužene dele celice; značilen je za živalske celice.", "#1fc8bd", [[hZ, delZ.lizosom]]);
  del("zival", "centrosom", "Centrosom s centriolama", "Par valjčkov iz mikrotubulov, ki pomaga pri delitvi živalske celice; rastlinske celice centriol nimajo.", "#ffcf3a", [[hZ, delZ.centrosom]]);
  del("rastl", "celicna-stena", "Celična stena", "Trdna plast iz celuloze zunaj membrane; rastlinsko celico ščiti in ji daje obliko. Živalske celice je nimajo.", "#8cc63f", [[hR, delR["celicna-stena"]], [hR, delR["srednja-lamela"]]]);
  del("rastl", "plazmodezme", "Plazmodezme", "Kanalčki skozi celično steno, po katerih je citoplazma povezana s sosednjimi rastlinskimi celicami.", "#e9a7c4", [[hR, delR.plazmodezme]]);
  del("rastl", "kloroplast", "Kloroplast", "Zeleni organel, v katerem poteka fotosinteza; v odprtih kloroplastih se vidijo grana. Imajo ga le rastlinske celice.", "#3eb33f", [[hR, delR.kloroplast], [hR, delR.tilakoidi], [hR, delR.stroma], [hR, delR.skrob]]);
  del("rastl", "vakuola", "Osrednja vakuola", "Velik mehur s celičnim sokom, ki zavzema večino rastlinske celice in jo drži napeto; živalske celice imajo le majhne mehurčke.", "#22b5c9", [[hR, delR.vakuola], [hR, delR.tonoplast]]);

  // ---------- napisa nad celicama ----------
  if (typeof document !== "undefined") {
    for (const [t, p] of [["Živalska celica", PZ.clone().addScaledVector(gor, 0.36)], ["Rastlinska celica", PR.clone().addScaledVector(gor, 0.62).addScaledVector(desno, 0.1)]]) {
      const cv = document.createElement("canvas");
      cv.width = 512; cv.height = 96;
      const c2 = cv.getContext("2d");
      if (!c2) continue;
      c2.font = "600 52px system-ui, sans-serif"; c2.textAlign = "center"; c2.textBaseline = "middle";
      c2.fillStyle = "#e8ecf4"; c2.fillText(t, 256, 50);
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sm = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
      odpad.push(sm, tex);
      const sp = new THREE.Sprite(sm);
      sp.scale.set(0.46, 0.086, 1);
      sp.position.copy(p);
      group.add(sp);
    }
  }

  // ---------- poudari ----------
  const temno = new THREE.Color(0x15122a);
  const izvirno = new Map();
  function zapomni() { // barve brez poudarka (po vsaki menjavi barv kot v učbeniku znova)
    izvirno.clear();
    for (const d of deli) for (const m of d.meshes) {
      const mt = m.material;
      if (mt && !izvirno.has(mt)) izvirno.set(mt, { c: mt.color.clone(), e: mt.emissive ? mt.emissive.clone() : null, t: mt.transparent, o: mt.opacity, dw: mt.depthWrite, fs: mt.forceSinglePass });
    }
  }
  zapomni();
  const OPISI = {
    vse: "Vsi deli obeh celic",
    skupni: "Skupno: membrana, citoplazma, jedro, ER, Golgijev aparat, mitohondriji, ribosomi, peroksisomi, citoskelet, mešički",
    zival: "Samo v živalski: lizosomi, centriole",
    rastl: "Samo v rastlinski: celična stena s plazmodezmami, kloroplasti, osrednja vakuola",
  };
  let poudari = "vse";
  const tocke = [];
  group.traverse((x) => { if (x.isPoints) tocke.push(x); });
  function nastavi(v) {
    poudari = OPISI[v] ? v : "vse";
    for (const x of tocke) x.visible = poudari === "vse" || poudari === "skupni"; // zrnca citoplazme in celičnega soka
    for (const d of deli) {
      const ja = poudari === "vse" || skup[d.id] === poudari;
      for (const m of d.meshes) {
        const mt = m.material, s = izvirno.get(mt);
        if (!s) continue;
        if (mt.userData.steklo) { mt.visible = ja; continue; } // steklena membrana: senčilnik sam določa prosojnost
        mt.color.copy(s.c);
        if (s.e) mt.emissive.copy(s.e);
        if (!ja) { mt.color.lerp(temno, 0.6); if (s.e) mt.emissive.multiplyScalar(0.15); }
        const tr = ja ? s.t : true;
        if (mt.transparent !== tr) { mt.transparent = tr; mt.needsUpdate = true; }
        mt.opacity = ja ? s.o : 0.16;
        mt.depthWrite = ja ? s.dw : false;
        mt.forceSinglePass = ja ? s.fs : true; // prosojna dvostranska snov sicer porabi dva klica risanja
      }
    }
  }
  const nadzor = [
    {
      tip: "izbira", id: "poudari", oznaka: "Poudari",
      moznosti: [["vse", "Vse"], ["skupni", "Skupni deli"], ["zival", "Samo v živalski"], ["rastl", "Samo v rastlinski"]],
      vrednost: "vse", ob: nastavi,
    },
    { tip: "izpis", id: "kaj", oznaka: "Poudarjeno", vrednost: () => OPISI[poudari] },
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["celi", "Celi celici"]], vrednost: "prerez",
      ob: (v) => { const p = v === "celi" ? "cela" : "prerez"; Z.nadzor[0].ob(p); R.nadzor[0].ob(p); },
    },
  ];
  // »Barve kot v učbeniku«: stikalo vklopi obe celici hkrati (vsaka si izbiro zapomni sama)
  const ucZ = Z.nadzor.find((n) => n.id === "ucbenik"), ucR = R.nadzor.find((n) => n.id === "ucbenik");
  if (ucZ && ucR) {
    const izvBarve = new Map(deli.map((d) => [d, d.barva]));
    const UC = Object.assign({}, BARVE_UCBENIK, { er: "#4f95e8", vakuola: "#4aa6d8" });
    const barveDelov = (v) => { for (const d of deli) d.barva = v && UC[d.id] ? UC[d.id] : izvBarve.get(d); };
    const uc = {
      tip: "stikalo", id: "ucbenik", oznaka: ucZ.oznaka, vrednost: !!ucZ.vrednost,
      ob(v) {
        const p = poudari;
        nastavi("vse");
        ucZ.ob(v); ucR.ob(v);
        uc.vrednost = !!v;
        barveDelov(uc.vrednost);
        zapomni();
        nastavi(p);
      },
    };
    if (ucZ.vrednost !== ucR.vrednost) ucR.ob(ucZ.vrednost);
    barveDelov(uc.vrednost);
    zapomni();
    nadzor.push(uc);
  }
  if (zac.poudari) { nadzor[0].vrednost = zac.poudari; nastavi(zac.poudari); }
  if (zac.prikaz) { nadzor[2].vrednost = zac.prikaz; nadzor[2].ob(zac.prikaz); }

  return {
    group,
    deli,
    nadzor,
    oder: "celica",
    pogled: C.toArray(),
    korak(t, dt) {
      if (!gib) return;
      Z.korak && Z.korak(t, dt);
      R.korak && R.korak(t, dt);
    },
    dispose() {
      Z.dispose && Z.dispose();
      R.dispose && R.dispose();
      odpad.forEach((m) => m.dispose());
    },
  };
}
