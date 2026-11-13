// Prosto vrtenje kamere okoli točke (scena.js, opts.prostoVrtenje; j, 4. 11.: »okoli točke, ne osi«): vodoravni poteg
// zavrti okoli zaslonske navpičnice, navpični okoli zaslonske vodoravnice. Kamera in njen »gor« se vrtita skupaj, zato
// ni zaklenjene osi ne pola. Brez uvozov (THREE pride od klicatelja), da ga preizkusi test/3d-zbirka.test.js.
export function zavrtiOkoli(THREE, polozaj, gor, cilj, kotX, kotY) {
  const odmik = polozaj.clone().sub(cilj);
  const q = new THREE.Quaternion().setFromAxisAngle(gor.clone().normalize(), -kotX);
  const desno = new THREE.Vector3().crossVectors(gor, odmik).normalize();
  if (desno.lengthSq() > 1e-12) q.premultiply(new THREE.Quaternion().setFromAxisAngle(desno, -kotY));
  odmik.applyQuaternion(q);
  gor.applyQuaternion(q).normalize();
  polozaj.copy(cilj).add(odmik);
}
