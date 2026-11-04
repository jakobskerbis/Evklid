// Preizkusni model iz kode za test/atlas3d.test.js in posnetke pregledovalnika (ni v nobenem področju, zato ga
// zbirka ne pokaže). Pokaže vse vrste nadzora iz pogodbe (docs/3d.md).
export const info = {
  id: "preizkus-kocka",
  naslov: "Preizkusna kocka",
  podrocje: "matematika",
  predmet: "MAT",
  opis: "Kocka in krogla za preizkus pregledovalnika.",
  merilo: { m: 0.1, oznaka: "10 cm" },
};

export function zgradi(THREE, ctx) {
  const group = new THREE.Group();
  const kocka = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshStandardMaterial({ color: 0x6e9bff }));
  const krogla = new THREE.Mesh(new THREE.SphereGeometry(0.08, 24, 16), new THREE.MeshStandardMaterial({ color: 0xffb454 }));
  krogla.position.set(0.25, 0, 0);
  group.add(kocka, krogla);
  let vrti = ctx.zacetek?.vrti !== false;
  let kot = 0;
  return {
    group,
    deli: [
      { id: "kocka", ime: "Kocka", opis: "Ima šest enakih ploskev.", meshes: [kocka], tocka: [0, 0.1, 0] },
      { id: "krogla", ime: "Krogla", opis: "Vse točke površja so enako oddaljene od središča.", meshes: [krogla], tocka: [0.25, 0.08, 0] },
    ],
    nadzor: [
      { tip: "drsnik", id: "velikost", oznaka: "Velikost", min: 0.5, max: 2, korak: 0.1, vrednost: 1, ob: (v) => kocka.scale.setScalar(v) },
      { tip: "izbira", id: "telo", oznaka: "Telo", moznosti: [["kocka", "Kocka"], ["krogla", "Krogla"]], vrednost: "kocka", ob: () => {} },
      { tip: "stikalo", id: "vrti", oznaka: "Vrtenje", vrednost: vrti, ob: (v) => (vrti = v) },
      { tip: "gumb", id: "ponovi", oznaka: "Na začetek", ob: () => (kot = 0) },
      { tip: "izpis", id: "kot", oznaka: "Kot", vidno: () => vrti, vrednost: () => `${Math.round((kot * 180) / Math.PI) % 360}°` },
    ],
    izberi(id, hit) {
      // Tap na kroglo prek kocke (hit iz raycasta) ali izbira iz seznama: vrne isti del.
      return hit && hit.object === krogla ? "krogla" : id;
    },
    korak(t, dt) {
      if (!vrti || !ctx.gibanje) return;
      kot += dt;
      group.rotation.y = kot;
    },
    dispose() {
      for (const m of [kocka, krogla]) {
        m.geometry.dispose();
        m.material.dispose();
      }
    },
  };
}
