// Barvila preparatov (docs/mikroskop.md »Stains«): OD-vektorji (optična gostota v R, G, B) za Beer–Lambertov zakon.
// HE: izhodišče Ruifrok in Johnston, Anal. Quant. Cytol. Histol. 23 (2001) 291–299 (hematoksilin 0,650/0,704/0,286, eozin
// 0,072/0,990/0,105; eozin rahlo popravljen proti modri, da je bolj rdeče rožnat kot na mikroskopu). Druga barvila so ocenjena iz vrhov absorpcije (metilensko modro 664 nm, kristal vijolično 590 nm,
// safranin 530 nm, jod/Lugol < 500 nm, klorofil 430 in 662 nm, melanin širok pas, močnejši v modrem).
const norm = (v) => {
  const l = Math.hypot(...v);
  return v.map((x) => x / l);
};
const HEM = norm([0.65, 0.704, 0.286]);
const EOZ = norm([0.12, 0.9, 0.42]);
const EOZ_G = norm([0.04, 0.72, 0.62]); // eozin v Giemsi: eritrociti lososovo rožnati
const MELANIN = norm([0.4, 0.55, 0.73]);
const AZUR = norm([0.5, 0.86, 0.22]);
const MET_MODRO = norm([0.86, 0.46, 0.12]);
const KRISTAL_VIJ = norm([0.42, 0.88, 0.22]);
const SAFRANIN = norm([0.06, 0.78, 0.55]);
const ZELENO = norm([0.78, 0.12, 0.42]); // hitra zelena FCF
const JOD = norm([0.06, 0.32, 0.95]);
const SKROB_JOD = norm([0.75, 0.72, 0.42]);
const KLOROFIL = norm([0.66, 0.16, 0.73]);
const SIVO = norm([1, 1, 1]);
const HEMOGLOBIN = norm([0.05, 0.62, 0.78]);
const ORCEIN = norm([0.38, 0.86, 0.34]); // acetoorcein: kromosomi rdeče vijolični (vrh ~ 540 nm)
const RJAVKASTO = norm([0.28, 0.5, 0.82]); // obrus zoba ali kosti: rumeno rjav zaradi sipanja in organskih snovi

export const BARVANJA = {
  he: { ime: "hematoksilin in eozin (HE)", opis: "Jedra so modrovijolična, citoplazma in kolagen rožnata.", od: [HEM, EOZ, MELANIN], moc: 1.15 },
  giemsa: { ime: "barvilo po Giemsi", opis: "Jedra levkocitov so vijolična, eritrociti rožnati, citoplazma limfocitov svetlo modra.", od: [AZUR, EOZ_G, MET_MODRO], moc: 1.5 },
  jod: { ime: "Lugolova raztopina (jod)", opis: "Jod obarva jedra in citoplazmo rumenorjavo, škrob temno modro.", od: [JOD, SKROB_JOD, SIVO], moc: 1.3 },
  metilensko: { ime: "metilensko modro", opis: "Jedra so temno modra, citoplazma svetlo modra.", od: [MET_MODRO, SIVO, EOZ], moc: 1.5 },
  gram: { ime: "barvanje po Gramu", opis: "Grampozitivne bakterije so vijolične, gramnegativne rožnate.", od: [KRISTAL_VIJ, SAFRANIN, SIVO], moc: 1.6 },
  safranin: { ime: "safranin in hitra zelena", opis: "Olesenele stene (ksilem) so rdeče, celulozne stene zelene.", od: [SAFRANIN, ZELENO, SIVO], moc: 1.5 },
  orcein: { ime: "acetoorcein", opis: "Kromosomi in jedra so rdečevijolični, citoplazma skoraj brezbarvna.", od: [ORCEIN, SIVO, EOZ], moc: 1.5 },
  obrus: { ime: "obrus brez barvanja", opis: "Trdo tkivo je zbrušeno do tankega lističa. Barve ni, svetloba se siplje na kristalih in kanalčkih, zato je rumenorjavkasto.", od: [RJAVKASTO, SIVO, MELANIN], moc: 1.2 },
  naravno: { ime: "brez barvanja", opis: "Vidiš naravne barve: zelene kloroplaste in sence celičnih sten.", od: [KLOROFIL, SIVO, HEMOGLOBIN], moc: 1.4 },
};

// Matrika 3 × 3 po stolpcih (WebGL uniformMatrix3fv, transpose = false).
export function matrikaBarvil(ime) {
  const b = BARVANJA[ime] || BARVANJA.he;
  return new Float32Array([...b.od[0], ...b.od[1], ...b.od[2]]);
}
