/-
vir: content/exam-papers/NPZ9-MAT-2026-redni.json
sha256: 8099d44e1b2dc24fb1803f2942e48a07ca4f09cfc009d57114008574ccc84e93
Ni v Leanu: 2 slika je prepisana kot dve množici kvadratkov v mreži 8 × 5 (12 celih, 4 polovični, prepis iz
SVG); da je kvadratek, razpolovljen po diagonali, pol kvadratka, je podatek. 3a »ℕ« v rešitvi so števila
1, 2, 3, …; Leanov ℕ vsebuje še 0, −4 ni v nobenem; pripadnost množici je zapisana kot slika vložitve
(`Set.range`). 4 pretvorbe enot (1 kg = 100 dag, 1 dm = 10 cm = 100 mm, 1 m² = 100 dm² = 10 000 cm²,
1 l = 1 dm³ = 1000 cm³ = 1000 ml, 1 h = 60 min) so zapisane kot faktorji (definicije). 6 šestkotnik je model
v ℂ (A = 0, B = 4, C = 6 + 2√3 i, D = 4 + 4√3 i, E = 4√3 i, F = −2 + 2√3 i, središče S = 2 + 2√3 i); da je
vsak pravilni šestkotnik s stranico 4 skladen z modelom, ni dokazano. Splošna obrazca (n − 2)·180° in
»vsota zunanjih kotov je 360°« nista dokazana (dokazano je, da so vsi notranji koti modela 2π/3 = 120° in
da sta kota ABS in SBC po π/3 = 60°; računi poti so dokazani); ploščina trikotnika a·v/2 in razdelitev
šestkotnika na šest trikotnikov sta podatek (dokazano: vseh šest trikotnikov s središčem ima stranice 4);
obrazec a²√3/4 je dokazan iz a·v/2 z v = √(a² − (a/2)²). 6d risanje s šestilom ni dokazano; dokazano je, da
je v modelu |SA| = |SB| = |AB| = 4, da so vsa oglišča od S oddaljena 4 in vse stranice dolge 4; natančnost
»prvi način je natančnejši« ni trditev. 7 lik je mreža (n + 1) × (n + 1), osenčeni so kvadratki s koordinato
0 ali n (pravilo iz besedila); ujemanje s sliko za 1., 2., 3. lik je dokazano s štetjem po tem pravilu,
ne iz SVG. 7b obrazci za kvadrat (ploščina a², obseg 4a, diagonala √(a² + a²)) so podatek; »podobnost« je
razlaga, dokazana so razmerja. 8a, 8b imena teles (prizma, osnovna ploskev) niso trditve v Leanu; dokazano
je, da je trikotna stena enakokraka (model v ℂ: kraka sta 2 m) in ni enakostranična; obrazca za ploščino
pravokotnika in V = O·v sta podatek. 9 vrednosti so odčitek s prikaza (preverjeno z višinami stolpcev v SVG:
10 dolžin = 25 enot), dnevi so indeksi 0 … 6 (pon … ned). Mediana je zapisana kot srednji (4.) člen urejenega
seznama sedmih podatkov. Besedilne razlage (»številska premica«, »vejico premaknemo«, »rezultat je smiseln«)
niso trditve, kjer niso števila; »približno« je dokazano kot meja napake.
Decimalna števila so točna racionalna (ℚ) ali realna (ℝ) števila. Konvencije Leana: x/0 = 0 (deljenje z 0 se
ne uporabi), √ negativnega je 0 (koreni so le iz pozitivnih števil), kot z ničelnim vektorjem je π/2 (pri 6
so vsa uporabljena oglišča in središče različna), odštevanje v ℕ se uporabi le pri 4e (60 − 48, 17 − 14,
1041 − 828) in 7a (4(n + 1) − 4, (n + 1)² − (n − 1)² za n ≥ 1), vselej manjše od večjega.
-/
module

public import Mathlib

public section

namespace Evklid.Pole.NPZ9_MAT_2026_redni

open EuclideanGeometry Complex

/-! ## Naloga 1 -/

/-- Naloga 1a, uradni odgovor in pot »Po korakih«: 18 + 26 = 44, torej −18 − 26 = −44. -/
theorem n1a : (-18 - 26 : ℤ) = -44 ∧ 18 + 26 = 44 := by norm_num

/-- Naloga 1a, pot »Drugače: s prištevanjem nasprotnega števila«: −18 − 26 = −18 + (−26) = −(18 + 26) = −44. -/
theorem n1a_nasprotno : (-18 - 26 : ℤ) = -44 := by
  calc (-18 - 26 : ℤ) = -18 + (-26) := by norm_num
    _ = -(18 + 26) := by norm_num
    _ = -44 := by norm_num

/-- Naloga 1a, napaka: −18 − 26 ni 8 in ni −8. -/
theorem n1a_napaka : (-18 - 26 : ℤ) ≠ 8 ∧ (-18 - 26 : ℤ) ≠ -8 := by norm_num

/-- Naloga 1b, uradni odgovor in pot »Po korakih«: 0,4·2,35 = 0,94; 4·235 = 940; 1 + 2 = 3 decimalna mesta:
940/10³ = 0,940 = 0,94. -/
theorem n1b : (0.4 * 2.35 : ℚ) = 0.94 ∧ 4 * 235 = 940 ∧ 1 + 2 = 3 ∧ (940 / 10 ^ 3 : ℚ) = 0.940 ∧
    (0.940 : ℚ) = 0.94 := by norm_num

/-- Naloga 1b, pot »Drugače: z ulomki«: 0,4 = 4/10, 2,35 = 235/100; 4/10·235/100 = 940/1000 = 0,94. -/
theorem n1b_ulomki : (0.4 : ℚ) = 4 / 10 ∧ (2.35 : ℚ) = 235 / 100 ∧ (4 / 10 * (235 / 100) : ℚ) = 0.94 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  calc (4 / 10 * (235 / 100) : ℚ) = 940 / 1000 := by norm_num
    _ = 0.94 := by norm_num

/-- Naloga 1b, napaka: 9,4 in 0,094 nista 0,4·2,35. -/
theorem n1b_napaka : (9.4 : ℚ) ≠ 0.4 * 2.35 ∧ (0.094 : ℚ) ≠ 0.4 * 2.35 := by norm_num

/-- Naloga 1c, uradni odgovor in pot »Po korakih«: 3 = 24/8; 24/8 − 5/8 = 19/8 = 2 3/8. -/
theorem n1c : (3 - 5 / 8 : ℚ) = 19 / 8 ∧ (19 / 8 : ℚ) = 2 + 3 / 8 ∧ (3 : ℚ) = 24 / 8 ∧
    (24 / 8 - 5 / 8 : ℚ) = 19 / 8 := by norm_num

/-- Naloga 1c, pot »Drugače: z mešanim številom«: 3 = 2 + 1 = 2 + 8/8; 3 − 5/8 = 2 + 8/8 − 5/8 = 2 3/8. -/
theorem n1c_mesano : (3 : ℚ) = 2 + 1 ∧ (2 + 1 : ℚ) = 2 + 8 / 8 ∧ (3 - 5 / 8 : ℚ) = 2 + 3 / 8 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  calc (3 - 5 / 8 : ℚ) = 2 + 8 / 8 - 5 / 8 := by norm_num
    _ = 2 + 3 / 8 := by norm_num

/-- Naloga 1d, uradni odgovor in pot »Po korakih«: obratna vrednost 3/5 je 5/3; 9 : 3/5 = 9·5/3 = 45/3 = 15. -/
theorem n1d : (3 / 5 : ℚ)⁻¹ = 5 / 3 ∧ (9 / (3 / 5) : ℚ) = 15 := by
  refine ⟨by norm_num, ?_⟩
  calc (9 / (3 / 5) : ℚ) = 9 * (5 / 3) := by rw [div_eq_mul_inv, inv_div]
    _ = 45 / 3 := by norm_num
    _ = 15 := by norm_num

/-- Naloga 1d, pot »Drugače: kolikokrat gredo tri petine v 9«: 9 = 45/5; (45/5) : (3/5) = 45 : 3 = 15;
preizkus 15·3/5 = 45/5 = 9. -/
theorem n1d_kolikokrat : (9 : ℚ) = 45 / 5 ∧ ((45 / 5) / (3 / 5) : ℚ) = 45 / 3 ∧ (45 / 3 : ℚ) = 15 ∧
    (15 * (3 / 5) : ℚ) = 45 / 5 ∧ (45 / 5 : ℚ) = 9 := by norm_num

/-- Naloga 1d, napaka: 9·3/5 = 5,4 ≠ 15. -/
theorem n1d_napaka : (9 * (3 / 5) : ℚ) = 5.4 ∧ (5.4 : ℚ) ≠ 9 / (3 / 5) := by norm_num

/-- Naloga 1e, uradni odgovor in pot »Po korakih«: 3 − 0,5 = 2,5; 1,2·2,5 = 3; 4,5 − 3 = 1,5. -/
theorem n1e : (4.5 - 1.2 * (3 - 0.5) : ℚ) = 1.5 ∧ (3 - 0.5 : ℚ) = 2.5 ∧ (1.2 * 2.5 : ℚ) = 3 ∧
    (4.5 - 3 : ℚ) = 1.5 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  calc (4.5 - 1.2 * (3 - 0.5) : ℚ) = 4.5 - 1.2 * 2.5 := by norm_num
    _ = 4.5 - 3 := by norm_num
    _ = 1.5 := by norm_num

/-- Naloga 1e, pot »Drugače: z ulomki«: 4,5 = 9/2, 1,2 = 6/5, 3 − 0,5 = 5/2;
9/2 − 6/5·5/2 = 9/2 − 30/10 = 9/2 − 3 = 3/2 = 1,5. -/
theorem n1e_ulomki : (4.5 : ℚ) = 9 / 2 ∧ (1.2 : ℚ) = 6 / 5 ∧ (3 - 0.5 : ℚ) = 5 / 2 ∧
    (9 / 2 - 6 / 5 * (5 / 2) : ℚ) = 1.5 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  calc (9 / 2 - 6 / 5 * (5 / 2) : ℚ) = 9 / 2 - 30 / 10 := by norm_num
    _ = 9 / 2 - 3 := by norm_num
    _ = 3 / 2 := by norm_num
    _ = 1.5 := by norm_num

/-- Naloga 1e, pot »Drugače: z razčlenjevanjem«: 1,2·(3 − 0,5) = 1,2·3 − 1,2·0,5 = 3,6 − 0,6 = 3;
4,5 − 3 = 1,5. -/
theorem n1e_distributivnost : (1.2 * (3 - 0.5) : ℚ) = 3 ∧ (4.5 - 3 : ℚ) = 1.5 := by
  refine ⟨?_, by norm_num⟩
  calc (1.2 * (3 - 0.5) : ℚ) = 1.2 * 3 - 1.2 * 0.5 := by ring
    _ = 3.6 - 0.6 := by norm_num
    _ = 3 := by norm_num

/-- Naloga 1e, napaka: od leve proti desni (4,5 − 1,2)·2,5 = 3,3·2,5 = 8,25 ≠ 1,5. -/
theorem n1e_napaka : ((4.5 - 1.2) * 2.5 : ℚ) = 3.3 * 2.5 ∧ (3.3 * 2.5 : ℚ) = 8.25 ∧
    (8.25 : ℚ) ≠ 4.5 - 1.2 * (3 - 0.5) := by norm_num

/-! ## Naloga 2

Mreža 8 × 5; kvadratek (stolpec, vrstica), šteto od zgoraj levo (prepis iz SVG). -/

/-- Vsi kvadratki pravokotnika. -/
def mreza : Finset (ℕ × ℕ) := Finset.range 8 ×ˢ Finset.range 5

/-- V celoti osenčeni kvadratki. -/
def polni : Finset (ℕ × ℕ) :=
  {(0, 0), (1, 0), (2, 0), (3, 0), (0, 1), (1, 1), (2, 1), (3, 1), (0, 2), (1, 2), (0, 3), (1, 3)}

/-- Kvadratki, osenčeni do polovice (po diagonali). -/
def polovicni : Finset (ℕ × ℕ) := {(4, 0), (4, 1), (2, 2), (2, 3)}

/-- Naloga 2, slika: 8·5 = 40 kvadratkov, 12 celih in 4 polovični (različni) kvadratki v mreži. -/
theorem n2_slika : mreza.card = 40 ∧ 8 * 5 = 40 ∧ polni ⊆ mreza ∧ polovicni ⊆ mreza ∧
    Disjoint polni polovicni ∧ polni.card = 12 ∧ polovicni.card = 4 := by
  refine ⟨by decide, rfl, by decide, by decide, by decide, by decide, by decide⟩

/-- Naloga 2a, uradni odgovor in pot »Po korakih«: osenčenih je 12 + 4·(1/2) = 12 + 2 = 14 kvadratkov;
14/40 = 35/100 = 35 %. -/
theorem n2a : (polni.card + polovicni.card * (1 / 2) : ℚ) = 14 ∧ (4 * (1 / 2) : ℚ) = 2 ∧ 12 + 2 = 14 ∧
    (14 / 40 : ℚ) = 35 / 100 := by
  refine ⟨?_, by norm_num, rfl, by norm_num⟩
  rw [(n2_slika).2.2.2.2.2.1, (n2_slika).2.2.2.2.2.2]; norm_num

/-- Naloga 2a, pot »Drugače: en kvadratek je 2,5 %«: 100 : 40 = 2,5; 14·2,5 = 35. -/
theorem n2a_odstotek : (100 / 40 : ℚ) = 2.5 ∧ (14 * 2.5 : ℚ) = 35 := by norm_num

/-- Naloga 2a, napaka: polovice kot cele da 16/40 = 40 % ≠ 35 %. -/
theorem n2a_napaka : 12 + 4 = 16 ∧ (16 / 40 : ℚ) = 40 / 100 ∧ (16 / 40 : ℚ) ≠ 14 / 40 := by norm_num

/-- Naloga 2b, uradni odgovor in poti »Iz odstotkov«, »Iz ulomka«: 35 % = 35/100 = 0,35;
14/40 = 7/20 = 35/100 = 0,35 (krajšamo z 2, razširimo s 5); 7 : 20 = 0,35. -/
theorem n2b : (35 / 100 : ℚ) = 0.35 ∧ (14 / 40 : ℚ) = 7 / 20 ∧ (7 / 20 : ℚ) = (7 * 5) / (20 * 5) ∧
    (7 * 5 : ℚ) / (20 * 5) = 35 / 100 ∧ (7 / 20 : ℚ) = 0.35 := by norm_num

/-- Naloga 2c, uradni odgovor in pot »Po korakih«: 14/40 = 7/20; največji skupni delitelj 14 in 40 je 2;
7 in 20 sta tuji števili (ulomek je okrajšan). -/
theorem n2c : (14 / 40 : ℚ) = 7 / 20 ∧ Nat.gcd 14 40 = 2 ∧ 14 / 2 = 7 ∧ 40 / 2 = 20 ∧ Nat.Coprime 7 20 := by
  refine ⟨by norm_num, by norm_num, rfl, rfl, by norm_num⟩

/-- Naloga 2c, pot »Drugače: iz odstotkov« in napaka: 35/100 = 7/20 (krajšamo s 5); 14/40 in 35/100 nista
okrajšana (števec in imenovalec nista tuja). -/
theorem n2c_odstotki : (35 / 100 : ℚ) = 7 / 20 ∧ Nat.gcd 35 100 = 5 ∧ 35 / 5 = 7 ∧ 100 / 5 = 20 ∧
    ¬ Nat.Coprime 14 40 ∧ ¬ Nat.Coprime 35 100 := by
  refine ⟨by norm_num, by norm_num, rfl, rfl, by norm_num, by norm_num⟩

/-- Naloga 2d, uradni odgovor in pot »Po korakih«: 0,05·800 = 40, 800 + 40 = 840; 0,05·840 = 42,
840 + 42 = 882. -/
theorem n2d : (0.05 * 800 : ℚ) = 40 ∧ (800 + 40 : ℚ) = 840 ∧ (0.05 * 840 : ℚ) = 42 ∧ (840 + 42 : ℚ) = 882 ∧
    (5 / 100 : ℚ) = 0.05 := by norm_num

/-- Znesek po n letih pri obrestovanju 5 % od zneska na računu (obresti se pripišejo na koncu leta). -/
def znesek : ℕ → ℚ
  | 0 => 800
  | n + 1 => znesek n + 0.05 * znesek n

/-- Naloga 2d, pot »Drugače: s faktorjem povečanja«: 1 + 5 % = 1,05 (105 %); 800·1,05 = 840, 840·1,05 = 882;
800·1,05·1,05 = 800·1,1025 = 882; po pravilu iz besedila je znesek po dveh letih 882. -/
theorem n2d_faktor : (1 + 5 / 100 : ℚ) = 1.05 ∧ (1.05 : ℚ) = 105 / 100 ∧ (800 * 1.05 : ℚ) = 840 ∧
    (840 * 1.05 : ℚ) = 882 ∧ (800 * 1.05 * 1.05 : ℚ) = 882 ∧ (∀ n, znesek n = 800 * 1.05 ^ n) ∧
    znesek 2 = 882 := by
  have h : ∀ n, znesek n = 800 * 1.05 ^ n := by
    intro n; induction n with
    | zero => simp [znesek]
    | succ n ih => rw [znesek, ih, pow_succ]; ring
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_, h, by rw [h]; norm_num⟩
  calc (800 * 1.05 * 1.05 : ℚ) = 800 * 1.1025 := by norm_num
    _ = 882 := by norm_num

/-- Naloga 2d, pot »Preizkus in primerjava« in napaka: obresti samo od 800 € da 800 + 40 + 40 = 880
(= 800 + 2·40 = 800·1,10); obresti v 2. letu so za 42 − 40 = 2 € večje; 880 + 2 = 882 ≠ 880. -/
theorem n2d_primerjava : (800 + 40 + 40 : ℚ) = 880 ∧ (800 + 2 * 40 : ℚ) = 880 ∧ (800 * 1.10 : ℚ) = 880 ∧
    (42 - 40 : ℚ) = 2 ∧ (880 + 2 : ℚ) = 882 ∧ (880 : ℚ) ≠ znesek 2 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  rw [(n2d_faktor).2.2.2.2.2.2]; norm_num

/-! ## Naloga 3 -/

/-- Naloga 3a, uradni odgovor: 5(x + 1) = 2x − 7 ⇔ x = −4; −4 je celo (zato racionalno in realno) število,
ni pa naravno (niti 0, 1, 2, …); vložitve ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ; −4 = −4/1. -/
theorem n3a : (∀ x : ℝ, 5 * (x + 1) = 2 * x - 7 ↔ x = -4) ∧
    (-4 : ℝ) ∉ Set.range (Nat.cast : ℕ → ℝ) ∧ (-4 : ℝ) ∈ Set.range (Int.cast : ℤ → ℝ) ∧
    (-4 : ℝ) ∈ Set.range (Rat.cast : ℚ → ℝ) ∧ (-4 : ℚ) = (-4 : ℤ) / (1 : ℤ) ∧
    Set.range (Nat.cast : ℕ → ℝ) ⊆ Set.range (Int.cast : ℤ → ℝ) ∧
    Set.range (Int.cast : ℤ → ℝ) ⊆ Set.range (Rat.cast : ℚ → ℝ) := by
  refine ⟨fun x => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, ?_, ⟨-4, by norm_num⟩,
    ⟨-4, by norm_num⟩, by norm_num, ?_, ?_⟩
  · rintro ⟨n, hn⟩
    have : (0 : ℝ) ≤ n := n.cast_nonneg
    linarith
  · rintro _ ⟨n, rfl⟩; exact ⟨n, by simp⟩
  · rintro _ ⟨z, rfl⟩; exact ⟨z, by simp⟩

/-- Naloga 3a, pot »Po korakih«: 5(x + 1) = 5x + 5; 5x + 5 = 2x − 7 ⇔ 5x − 2x = −7 − 5 ⇔ 3x = −12 ⇔ x = −4. -/
theorem n3a_koraki (x : ℝ) : 5 * (x + 1) = 5 * x + 5 ∧ (5 * x + 5 = 2 * x - 7 ↔ 5 * x - 2 * x = -7 - 5) ∧
    (5 * x - 2 * x = -7 - 5 ↔ 3 * x = -12) ∧ (3 * x = -12 ↔ x = -4) := by
  refine ⟨by ring, ⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩⟩

/-- Naloga 3a, pot »Drugače: člene z neznanko na desno«: 5x + 5 = 2x − 7 ⇔ 5 + 7 = 2x − 5x ⇔ 12 = −3x ⇔
x = 12 : (−3) = −4; preizkus 5·(−4 + 1) = 5·(−3) = −15, 2·(−4) − 7 = −8 − 7 = −15. -/
theorem n3a_desno (x : ℝ) : (5 * x + 5 = 2 * x - 7 ↔ 5 + 7 = 2 * x - 5 * x) ∧
    (5 + 7 = 2 * x - 5 * x ↔ 12 = -3 * x) ∧ (12 = -3 * x ↔ x = 12 / (-3)) ∧ (12 / (-3) : ℝ) = -4 ∧
    (5 * (-4 + 1) : ℝ) = 5 * (-3) ∧ (5 * (-3) : ℝ) = -15 ∧ (2 * (-4) - 7 : ℝ) = -8 - 7 ∧
    (-8 - 7 : ℝ) = -15 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    ⟨fun h => by rw [eq_div_iff (by norm_num)]; linarith, fun h => ?_⟩, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num⟩
  rw [h]; norm_num

/-- Naloga 3a, napaka: −4 je celo število, zato je tudi racionalno in realno (ni samo v ℤ). -/
theorem n3a_napaka : (-4 : ℚ) = ((-4 : ℤ) : ℚ) ∧ (((-4 : ℚ)) : ℝ) = -4 := by norm_num

/-- Naloga 3b, uradni odgovor: (x − 2)/3 − (x + 1)/4 = 1/2 ⇔ x = 17. -/
theorem n3b (x : ℝ) : (x - 2) / 3 - (x + 1) / 4 = 1 / 2 ↔ x = 17 := by
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Naloga 3b, pot »Po korakih: odpravimo ulomke«: v(3, 4, 2) = 12; enačba ⇔ 12·(x − 2)/3 − 12·(x + 1)/4 =
12·1/2 ⇔ 4(x − 2) − 3(x + 1) = 6 ⇔ 4x − 8 − 3x − 3 = 6 ⇔ x − 11 = 6 ⇔ x = 17; preizkus
(17 − 2)/3 − (17 + 1)/4 = 15/3 − 18/4 = 5 − 4,5 = 0,5 = 1/2. -/
theorem n3b_koraki (x : ℝ) : Nat.lcm (Nat.lcm 3 4) 2 = 12 ∧
    ((x - 2) / 3 - (x + 1) / 4 = 1 / 2 ↔ 12 * ((x - 2) / 3) - 12 * ((x + 1) / 4) = 12 * (1 / 2)) ∧
    (12 * ((x - 2) / 3) - 12 * ((x + 1) / 4) = 12 * (1 / 2) ↔ 4 * (x - 2) - 3 * (x + 1) = 6) ∧
    (4 * (x - 2) - 3 * (x + 1) = 6 ↔ 4 * x - 8 - 3 * x - 3 = 6) ∧
    (4 * x - 8 - 3 * x - 3 = 6 ↔ x - 11 = 6) ∧ (x - 11 = 6 ↔ x = 17) ∧
    ((17 - 2) / 3 - (17 + 1) / 4 : ℝ) = 15 / 3 - 18 / 4 ∧ (15 / 3 - 18 / 4 : ℝ) = 5 - 4.5 ∧
    (5 - 4.5 : ℝ) = 0.5 ∧ (0.5 : ℝ) = 1 / 2 := by
  refine ⟨by norm_num, ⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 3b, pot »Drugače: ulomke razdelimo«: (x − 2)/3 − (x + 1)/4 = x/3 − 2/3 − x/4 − 1/4;
x/3 − x/4 = (4x − 3x)/12 = x/12; 2/3 + 1/4 = 8/12 + 3/12 = 11/12; enačba ⇔ x/12 − 11/12 = 6/12 ⇔
x − 11 = 6 ⇔ x = 17. -/
theorem n3b_razdelimo (x : ℝ) : (x - 2) / 3 - (x + 1) / 4 = x / 3 - 2 / 3 - x / 4 - 1 / 4 ∧
    x / 3 - x / 4 = (4 * x - 3 * x) / 12 ∧ (4 * x - 3 * x) / 12 = x / 12 ∧
    (2 / 3 + 1 / 4 : ℝ) = 8 / 12 + 3 / 12 ∧ (8 / 12 + 3 / 12 : ℝ) = 11 / 12 ∧
    (x / 3 - 2 / 3 - x / 4 - 1 / 4 = 1 / 2 ↔ x / 12 - 11 / 12 = 6 / 12) ∧
    (x / 12 - 11 / 12 = 6 / 12 ↔ x - 11 = 6) ∧ (x - 11 = 6 ↔ x = 17) := by
  refine ⟨by ring, by ring, by ring, by norm_num, by norm_num, ⟨fun h => by linarith, fun h => by linarith⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩⟩

/-- Naloga 3b, pot »Preizkus z decimalnimi števili«: (17 − 2) : 3 = 5, (17 + 1) : 4 = 4,5, 5 − 4,5 = 0,5 = 1/2. -/
theorem n3b_preizkus : ((17 - 2) / 3 : ℚ) = 5 ∧ ((17 + 1) / 4 : ℚ) = 4.5 ∧ (5 - 4.5 : ℚ) = 0.5 ∧
    (1 / 2 : ℚ) = 0.5 := by norm_num

/-- Naloga 3b, napaka: −3(x + 1) ≠ −3x + 3 (npr. pri x = 0); z napako 4(x − 2) − 3x + 3 = 6 ⇔ x = 11,
11 pa ni rešitev prave enačbe. -/
theorem n3b_napaka : (¬ ∀ x : ℝ, -3 * (x + 1) = -3 * x + 3) ∧ (∀ x : ℝ, -3 * (x + 1) = -3 * x - 3) ∧
    (∀ x : ℝ, 4 * (x - 2) - 3 * x + 3 = 6 ↔ x = 11) ∧ ¬ ((11 - 2) / 3 - (11 + 1) / 4 = (1 / 2 : ℝ)) := by
  refine ⟨fun h => by have := h 0; norm_num at this, fun x => by ring,
    fun x => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num⟩

/-! ## Naloga 4 -/

/-- Naloga 4a, uradni odgovor in poti: 1 kg = 100 dag; 3,06·100 = 306; po delih 3·100 = 300, 0,06·100 = 6,
300 + 6 = 306; napaka: 3,06·10 = 30,6 ≠ 306. -/
theorem n4a : (3.06 * 100 : ℚ) = 306 ∧ (3 * 100 : ℚ) = 300 ∧ (0.06 * 100 : ℚ) = 6 ∧ (300 + 6 : ℚ) = 306 ∧
    (3.06 * 10 : ℚ) = 30.6 ∧ (30.6 : ℚ) ≠ 306 := by norm_num

/-- Naloga 4b, uradni odgovor in poti: 1 dm = 10 cm = 100 mm (10·10 = 100); 47 : 100 = 0,47;
prek centimetrov 47 : 10 = 4,7 in 4,7 : 10 = 0,47. -/
theorem n4b : 10 * 10 = 100 ∧ (47 / 100 : ℚ) = 0.47 ∧ (47 / 10 : ℚ) = 4.7 ∧ (4.7 / 10 : ℚ) = 0.47 := by
  norm_num

/-- Naloga 4c, uradni odgovor in poti: 1 m² = 100·100 cm² = 10 000 cm²; 0,35·10 000 = 3500; po stopnicah
0,35·100 = 35 (dm²), 35·100 = 3500 (cm²); napaka: 35 ≠ 3500. -/
theorem n4c : 100 * 100 = 10000 ∧ (0.35 * 10000 : ℚ) = 3500 ∧ (0.35 * 100 : ℚ) = 35 ∧ (35 * 100 : ℚ) = 3500 ∧
    (35 : ℚ) ≠ 3500 := by norm_num

/-- Naloga 4d, uradni odgovor in poti: 1 l = 1000 ml, 1 dm³ = 1000 cm³; 0,4·1000 = 400; manjka
1000 − 400 − 250 = 350 ml in je edina taka vrednost; preizkus 400 + 250 + 350 = 1000. -/
theorem n4d : (0.4 * 1000 : ℚ) = 400 ∧ (1000 - 400 - 250 : ℚ) = 350 ∧
    (∀ m : ℚ, 0.4 * 1000 + 250 + m = 1000 ↔ m = 350) ∧ (400 + 250 + 350 : ℚ) = 1000 := by
  refine ⟨by norm_num, by norm_num, fun m => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num⟩

/-- Naloga 4e, uradni odgovor in pot »Po korakih (do polne ure)«: od 13.48 do 14.00 je 60 − 48 = 12 min,
od 14.00 do 17.00 je 17 − 14 = 3 h, od 17.00 do 17.21 je 21 min; 12 + 21 = 33; skupaj 3 h 33 min
(= 3·60 + 33 minut = razlika časov v minutah). -/
theorem n4e : 60 - 48 = 12 ∧ 17 - 14 = 3 ∧ 12 + 21 = 33 ∧
    (17 * 60 + 21) - (13 * 60 + 48) = 3 * 60 + 33 ∧ 12 + 3 * 60 + 21 = 3 * 60 + 33 := by decide

/-- Naloga 4e, pot »Drugače: v minutah«: 13·60 + 48 = 828, 17·60 + 21 = 1041, 1041 − 828 = 213,
213 = 3·60 + 33 (213 : 60 = 3, ostanek 33). -/
theorem n4e_minute : 13 * 60 + 48 = 828 ∧ 17 * 60 + 21 = 1041 ∧ 1041 - 828 = 213 ∧ 213 = 3 * 60 + 33 ∧
    213 / 60 = 3 ∧ 213 % 60 = 33 := by decide

/-- Naloga 4e, napaka: 17,21 − 13,48 = 3,73, a »73 minut« ni možno (73 ≥ 60) in 3 h 73 min ≠ 213 min. -/
theorem n4e_napaka : (17.21 - 13.48 : ℚ) = 3.73 ∧ 60 ≤ 73 ∧ 3 * 60 + 73 ≠ 213 := by norm_num

/-! ## Naloga 5 -/

/-- Naloga 5a, uradni odgovor in pot »Po korakih«: 3a² + 2a² − a² = 4a², −5ab + 7ab = 2ab. -/
theorem n5a (a b : ℝ) : 3 * a ^ 2 - 5 * a * b + 2 * a ^ 2 + 7 * a * b - a ^ 2 = 4 * a ^ 2 + 2 * a * b ∧
    3 * a ^ 2 + 2 * a ^ 2 - a ^ 2 = 4 * a ^ 2 ∧ -5 * a * b + 7 * a * b = 2 * a * b := by
  refine ⟨by ring, by ring, by ring⟩

/-- Naloga 5a, pot »Preizkus z vstavljanjem« (a = b = 1): 3 − 5 + 2 + 7 − 1 = 6 = 4 + 2. -/
theorem n5a_preizkus : (3 - 5 + 2 + 7 - 1 : ℤ) = 6 ∧ (4 + 2 : ℤ) = 6 := by norm_num

/-- Naloga 5a, napaka: 4a² + 2ab ni 6a³b (npr. a = 1, b = 2: 8 ≠ 12). -/
theorem n5a_napaka : ¬ ∀ a b : ℝ, 4 * a ^ 2 + 2 * a * b = 6 * a ^ 3 * b := by
  intro h; have := h 1 2; norm_num at this

/-- Naloga 5b, uradni odgovor in pot »Po korakih«: −2·4 = −8, x³·x = x³⁺¹ = x⁴, y·y² = y¹⁺² = y³. -/
theorem n5b (x y : ℝ) : (-2 * x ^ 3 * y) * (4 * x * y ^ 2) = -8 * x ^ 4 * y ^ 3 ∧ (-2 * 4 : ℝ) = -8 ∧
    x ^ 3 * x = x ^ (3 + 1) ∧ y * y ^ 2 = y ^ (1 + 2) := by
  refine ⟨by ring, by norm_num, by ring, by ring⟩

/-- Naloga 5b, napaka: x³·x ni x³ = x^(3·1) (npr. x = 2: 16 ≠ 8); predznak: ni 8x⁴y³ (x = y = 1). -/
theorem n5b_napaka : (¬ ∀ x : ℝ, x ^ 3 * x = x ^ (3 * 1)) ∧
    ¬ ∀ x y : ℝ, (-2 * x ^ 3 * y) * (4 * x * y ^ 2) = 8 * x ^ 4 * y ^ 3 := by
  refine ⟨fun h => by have := h 2; norm_num at this, fun h => by have := h 1 1; norm_num at this⟩

/-- Naloga 5c, uradni odgovor in poti: 3a·2a = 6a², 3a·(−5b) = −15ab; preizkus a = b = 1: 3·(2 − 5) = −9 = 6 − 15. -/
theorem n5c (a b : ℝ) : 3 * a * (2 * a - 5 * b) = 6 * a ^ 2 - 15 * a * b ∧ 3 * a * (2 * a) = 6 * a ^ 2 ∧
    3 * a * (-5 * b) = -15 * a * b ∧ (3 * (2 - 5) : ℤ) = -9 ∧ (6 - 15 : ℤ) = -9 := by
  refine ⟨by ring, by ring, by ring, by norm_num, by norm_num⟩

/-- Naloga 5d, uradni odgovor in pot »Po obrazcu«: (A − B)² = A² − 2AB + B² z A = 2x, B = 3:
(2x)² − 2·2x·3 + 3² = 4x² − 12x + 9. -/
theorem n5d (x : ℝ) : (2 * x - 3) ^ 2 = 4 * x ^ 2 - 12 * x + 9 ∧
    (∀ A B : ℝ, (A - B) ^ 2 = A ^ 2 - 2 * A * B + B ^ 2) ∧
    (2 * x) ^ 2 - 2 * (2 * x) * 3 + 3 ^ 2 = 4 * x ^ 2 - 12 * x + 9 := by
  refine ⟨by ring, fun A B => by ring, by ring⟩

/-- Naloga 5d, pot »Drugače: kot zmnožek«: (2x − 3)(2x − 3) = 4x² − 6x − 6x + 9 = 4x² − 12x + 9;
preizkus x = 2: (2·2 − 3)² = 1 = 4·4 − 12·2 + 9. -/
theorem n5d_zmnozek (x : ℝ) : (2 * x - 3) * (2 * x - 3) = 4 * x ^ 2 - 6 * x - 6 * x + 9 ∧
    4 * x ^ 2 - 6 * x - 6 * x + 9 = 4 * x ^ 2 - 12 * x + 9 ∧ ((2 * 2 - 3) ^ 2 : ℤ) = 1 ∧
    (4 * 4 - 12 * 2 + 9 : ℤ) = 1 := by
  refine ⟨by ring, by ring, by norm_num, by norm_num⟩

/-- Naloga 5d, napaka: (2x − 3)² ni 4x² − 9 (x = 0: 9 ≠ −9) in ni 4x² + 9 (x = 1: 1 ≠ 13). -/
theorem n5d_napaka : (¬ ∀ x : ℝ, (2 * x - 3) ^ 2 = 4 * x ^ 2 - 9) ∧ ¬ ∀ x : ℝ, (2 * x - 3) ^ 2 = 4 * x ^ 2 + 9 := by
  refine ⟨fun h => by have := h 0; norm_num at this, fun h => by have := h 1; norm_num at this⟩

/-- Naloga 5e, uradni odgovor in poti: x·2x + x·(−1) + 4·2x + 4·(−1) = 2x² − x + 8x − 4 = 2x² + 7x − 4;
preizkus x = 1: (1 + 4)(2 − 1) = 5 = 2 + 7 − 4. -/
theorem n5e (x : ℝ) : (x + 4) * (2 * x - 1) = x * (2 * x) + x * (-1) + 4 * (2 * x) + 4 * (-1) ∧
    x * (2 * x) + x * (-1) + 4 * (2 * x) + 4 * (-1) = 2 * x ^ 2 - x + 8 * x - 4 ∧
    2 * x ^ 2 - x + 8 * x - 4 = 2 * x ^ 2 + 7 * x - 4 ∧ ((1 + 4) * (2 - 1) : ℤ) = 5 ∧ (2 + 7 - 4 : ℤ) = 5 := by
  refine ⟨by ring, by ring, by ring, by norm_num, by norm_num⟩

/-- Naloga 5f, uradni odgovor in poti: (A + B)(A − B) = A² − B² z A = 3y, B = 5: (3y)² − 5² = 9y² − 25;
z množenjem 9y² − 15y + 15y − 25 = 9y² − 25. -/
theorem n5f (y : ℝ) : (3 * y + 5) * (3 * y - 5) = 9 * y ^ 2 - 25 ∧
    (∀ A B : ℝ, (A + B) * (A - B) = A ^ 2 - B ^ 2) ∧ (3 * y) ^ 2 - 5 ^ 2 = 9 * y ^ 2 - 25 ∧
    (3 * y + 5) * (3 * y - 5) = 9 * y ^ 2 - 15 * y + 15 * y - 25 ∧
    9 * y ^ 2 - 15 * y + 15 * y - 25 = 9 * y ^ 2 - 25 := by
  refine ⟨by ring, fun A B => by ring, by ring, by ring, by ring⟩

/-- Naloga 5f, napaka: (3y + 5)(3y − 5) ni 3y² − 25 (y = 1: −16 ≠ −22). -/
theorem n5f_napaka : ¬ ∀ y : ℝ, (3 * y + 5) * (3 * y - 5) = 3 * y ^ 2 - 25 := by
  intro h; have := h 1; norm_num at this

/-! ## Naloga 6

Model pravilnega šestkotnika v ℂ s stranico 4 na daljici AB (A = 0, B = 4) in središčem S. -/

/-- Oglišče A. -/
def tA : ℂ := ⟨0, 0⟩
/-- Oglišče B. -/
def tB : ℂ := ⟨4, 0⟩
/-- Oglišče C. -/
noncomputable def tC : ℂ := ⟨6, 2 * √3⟩
/-- Oglišče D. -/
noncomputable def tD : ℂ := ⟨4, 4 * √3⟩
/-- Oglišče E. -/
noncomputable def tE : ℂ := ⟨0, 4 * √3⟩
/-- Oglišče F. -/
noncomputable def tF : ℂ := ⟨-2, 2 * √3⟩
/-- Središče S. -/
noncomputable def tS : ℂ := ⟨2, 2 * √3⟩

/-- Kvadrat razdalje v ℂ: |z − w|² = (Re z − Re w)² + (Im z − Im w)². -/
theorem dsq (z w : ℂ) : dist z w ^ 2 = (z.re - w.re) ^ 2 + (z.im - w.im) ^ 2 := by
  rw [Complex.dist_eq, Complex.sq_norm, Complex.normSq_apply]; simp; ring

/-- Razdalja iz kvadrata razdalje. -/
theorem dist_iz_sq {z w : ℂ} {r : ℝ} (hr : 0 ≤ r) (h : (z.re - w.re) ^ 2 + (z.im - w.im) ^ 2 = r ^ 2) :
    dist z w = r := by
  rw [← dsq] at h
  exact (pow_left_inj₀ dist_nonneg hr two_ne_zero).1 h

/-- √3² = 3. -/
theorem koren3_sq : (√3 : ℝ) ^ 2 = 3 := Real.sq_sqrt (by norm_num)

/-- Predpostavki `dist_iz_sq` se dajo izpolniti (A = 0, B = 4, r = 4). -/
example : ∃ z w : ℂ, ∃ r : ℝ, 0 ≤ r ∧ (z.re - w.re) ^ 2 + (z.im - w.im) ^ 2 = r ^ 2 :=
  ⟨tA, tB, 4, by norm_num, by simp [tA, tB]⟩

/-- Naloga 6, model (in pot »Konstrukcija s središčem« iz 6d): vse stranice AB, BC, CD, DE, EF, FA so dolge 4;
S je od A in B oddaljen 4 (trikotnik ABS je enakostraničen) in vsa oglišča so od S oddaljena 4 (krožnica s
središčem S in polmerom 4 gre skozi vsa oglišča: stranica je enaka polmeru). -/
theorem n6_model : dist tA tB = 4 ∧ dist tB tC = 4 ∧ dist tC tD = 4 ∧ dist tD tE = 4 ∧ dist tE tF = 4 ∧
    dist tF tA = 4 ∧ dist tS tA = 4 ∧ dist tS tB = 4 ∧ dist tS tC = 4 ∧ dist tS tD = 4 ∧ dist tS tE = 4 ∧
    dist tS tF = 4 := by
  have h3 := koren3_sq
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_⟩ <;>
    exact dist_iz_sq (by norm_num) (by dsimp only [tA, tB, tC, tD, tE, tF, tS]; nlinarith [h3])

/-- Kot 120° iz skalarnega produkta: |YX| = |YZ| = 4 in (YX)·(YZ) = −8 da ∠XYZ = arccos(−1/2) = 2π/3. -/
theorem kot120 {X Y Z : ℂ} (h1 : dist X Y = 4) (h2 : dist Z Y = 4)
    (h : (X - Y).re * (Z - Y).re + (X - Y).im * (Z - Y).im = -8) : ∠ X Y Z = 2 * Real.pi / 3 := by
  rw [EuclideanGeometry.angle, InnerProductGeometry.angle, vsub_eq_sub, vsub_eq_sub, ← Complex.dist_eq,
    ← Complex.dist_eq, h1, h2, Complex.inner]
  have h' : ((Z - Y) * (starRingEnd ℂ) (X - Y)).re = (X - Y).re * (Z - Y).re + (X - Y).im * (Z - Y).im := by
    simp only [Complex.mul_re, Complex.conj_re, Complex.conj_im]; ring
  rw [h', h]
  rw [show (-8 : ℝ) / (4 * 4) = -(1 / 2) by norm_num, Real.arccos_neg, ← Real.cos_pi_div_three,
    Real.arccos_cos (by positivity) (by linarith [Real.pi_pos])]
  ring

/-- Kot 60° iz skalarnega produkta: |YX| = |YZ| = 4 in (YX)·(YZ) = 8 da ∠XYZ = arccos(1/2) = π/3. -/
theorem kot60 {X Y Z : ℂ} (h1 : dist X Y = 4) (h2 : dist Z Y = 4)
    (h : (X - Y).re * (Z - Y).re + (X - Y).im * (Z - Y).im = 8) : ∠ X Y Z = Real.pi / 3 := by
  rw [EuclideanGeometry.angle, InnerProductGeometry.angle, vsub_eq_sub, vsub_eq_sub, ← Complex.dist_eq,
    ← Complex.dist_eq, h1, h2, Complex.inner]
  have h' : ((Z - Y) * (starRingEnd ℂ) (X - Y)).re = (X - Y).re * (Z - Y).re + (X - Y).im * (Z - Y).im := by
    simp only [Complex.mul_re, Complex.conj_re, Complex.conj_im]; ring
  rw [h', h]
  rw [show (8 : ℝ) / (4 * 4) = 1 / 2 by norm_num, ← Real.cos_pi_div_three,
    Real.arccos_cos (by positivity) (by linarith [Real.pi_pos])]

/-- Predpostavke `kot120` (X = A, Y = B, Z = C) in `kot60` (X = A, Y = B, Z = S) se dajo izpolniti. -/
example : (dist tA tB = 4 ∧ dist tC tB = 4 ∧
      (tA - tB).re * (tC - tB).re + (tA - tB).im * (tC - tB).im = -8) ∧
    (dist tA tB = 4 ∧ dist tS tB = 4 ∧ (tA - tB).re * (tS - tB).re + (tA - tB).im * (tS - tB).im = 8) := by
  obtain ⟨hAB, hBC, -, -, -, -, -, hSB, -⟩ := n6_model
  have h3 := koren3_sq
  refine ⟨⟨hAB, by rw [dist_comm]; exact hBC, by simp [tA, tB, tC]; norm_num⟩,
    ⟨hAB, hSB, by simp [tA, tB, tS]; norm_num⟩⟩

/-- Naloga 6a, uradni odgovor (na modelu): vseh šest notranjih kotov meri 2π/3, to je 120°. -/
theorem n6a : ∠ tF tA tB = 2 * Real.pi / 3 ∧ ∠ tA tB tC = 2 * Real.pi / 3 ∧ ∠ tB tC tD = 2 * Real.pi / 3 ∧
    ∠ tC tD tE = 2 * Real.pi / 3 ∧ ∠ tD tE tF = 2 * Real.pi / 3 ∧ ∠ tE tF tA = 2 * Real.pi / 3 ∧
    2 * Real.pi / 3 * (180 / Real.pi) = 120 := by
  obtain ⟨hAB, hBC, hCD, hDE, hEF, hFA, -⟩ := n6_model
  have h3 := koren3_sq
  have d : ∀ z w : ℂ, dist z w = dist w z := fun z w => dist_comm z w
  refine ⟨kot120 hFA (by rw [d]; exact hAB) ?_, kot120 hAB (by rw [d]; exact hBC) ?_,
    kot120 hBC (by rw [d]; exact hCD) ?_, kot120 hCD (by rw [d]; exact hDE) ?_,
    kot120 hDE (by rw [d]; exact hEF) ?_, kot120 hEF (by rw [d]; exact hFA) ?_, ?_⟩
  all_goals first
    | (simp [tA, tB, tC, tD, tE, tF]; nlinarith [h3])
    | (field_simp; ring)

/-- Naloga 6a, pot »Z vsoto notranjih kotov«: (6 − 2)·180° = 720°, 720° : 6 = 120°. -/
theorem n6a_vsota : ((6 - 2) * 180 : ℚ) = 720 ∧ (720 / 6 : ℚ) = 120 := by norm_num

/-- Naloga 6a, pot »Drugače: z zunanjim kotom«: 360° : 6 = 60°, 180° − 60° = 120° (in π − π/3 = 2π/3). -/
theorem n6a_zunanji : (360 / 6 : ℚ) = 60 ∧ (180 - 60 : ℚ) = 120 ∧ Real.pi - Real.pi / 3 = 2 * Real.pi / 3 := by
  refine ⟨by norm_num, by norm_num, by ring⟩

/-- Naloga 6a, pot »Drugače: s trikotniki«: pri oglišču B se stikata kota ABS in SBC po π/3 = 60°;
2·60° = 120° in π/3 + π/3 = 2π/3 = ∠ABC. -/
theorem n6a_trikotniki : ∠ tA tB tS = Real.pi / 3 ∧ ∠ tS tB tC = Real.pi / 3 ∧ (2 * 60 : ℚ) = 120 ∧
    ∠ tA tB tS + ∠ tS tB tC = ∠ tA tB tC := by
  obtain ⟨hAB, hBC, -, -, -, -, -, hSB, -⟩ := n6_model
  have h3 := koren3_sq
  have h1 : ∠ tA tB tS = Real.pi / 3 :=
    kot60 hAB hSB (by simp [tA, tB, tS]; norm_num)
  have h2 : ∠ tS tB tC = Real.pi / 3 :=
    kot60 hSB (by rw [dist_comm]; exact hBC) (by simp [tB, tC, tS]; nlinarith [h3])
  have h4 : ∠ tA tB tC = 2 * Real.pi / 3 := (n6a).2.1
  refine ⟨h1, h2, by norm_num, ?_⟩
  rw [h1, h2, h4]; ring

/-- Naloga 6b, uradni odgovor: o = 6·4 = 24 (vsota šestih stranic modela). -/
theorem n6b : dist tA tB + dist tB tC + dist tC tD + dist tD tE + dist tE tF + dist tF tA = 24 ∧
    (6 * 4 : ℚ) = 24 := by
  obtain ⟨h1, h2, h3, h4, h5, h6, -⟩ := n6_model
  rw [h1, h2, h3, h4, h5, h6]; norm_num

/-- Naloga 6c, uradni odgovor in pot »Po korakih«: v = √(4² − 2²) = √12 = 2√3; p₁ = 4·2√3/2 = 4√3;
p = 6·4√3 = 24√3; v modelu je višina trikotnika ABS (Im S) enaka 2√3. -/
theorem n6c : √((4 : ℝ) ^ 2 - 2 ^ 2) = √12 ∧ √(12 : ℝ) = 2 * √3 ∧ 4 * (2 * √3) / 2 = 4 * √3 ∧
    6 * (4 * √3) = 24 * √3 ∧ tS.im = 2 * √3 ∧ (4 : ℝ) / 2 = 2 := by
  refine ⟨by norm_num, ?_, by ring, by ring, rfl, by norm_num⟩
  rw [show (12 : ℝ) = 2 ^ 2 * 3 by norm_num, Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]

/-- Naloga 6c, pot »Drugače: z obrazcem«: ploščina enakostraničnega trikotnika a·√(a² − (a/2)²)/2 = a²√3/4
(a > 0); 6·a²√3/4 = 3a²√3/2; za a = 4: 3·16·√3/2 = 24√3. -/
theorem n6c_obrazec (a : ℝ) (ha : 0 < a) : a * √(a ^ 2 - (a / 2) ^ 2) / 2 = a ^ 2 * √3 / 4 ∧
    6 * (a ^ 2 * √3 / 4) = 3 * a ^ 2 * √3 / 2 ∧ 3 * (4 : ℝ) ^ 2 * √3 / 2 = 3 * 16 * √3 / 2 ∧
    3 * 16 * √3 / 2 = 24 * √3 := by
  refine ⟨?_, by ring, by norm_num, by ring⟩
  rw [show a ^ 2 - (a / 2) ^ 2 = (a / 2) ^ 2 * 3 by ring, Real.sqrt_mul (by positivity),
    Real.sqrt_sq (by positivity)]
  ring

example : ∃ a : ℝ, 0 < a := ⟨4, by norm_num⟩

/-- Meje za √3: 1,732 < √3 < 1,7321. -/
theorem koren3 : (1.732 : ℝ) < √3 ∧ √3 < 1.7321 := by
  constructor
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num

/-- Naloga 6c, pot »Preveri z oceno« in napaka: √3 ≈ 1,73 (|√3 − 1,73| < 0,003); 24·1,73 = 41,52;
24√3 ≈ 41,5 (|24√3 − 41,5| < 0,1); krog s polmerom 4 ima ploščino 16π ≈ 50 (|16π − 50| < 0,5) in
šestkotnik je manjši od kroga; 41,6 ni točna vrednost (24√3 < 41,6); višina ni stranica (2√3 ≠ 4). -/
theorem n6c_ocena : |√3 - 1.73| < (0.003 : ℝ) ∧ (24 * 1.73 : ℚ) = 41.52 ∧ |24 * √3 - 41.5| < (0.1 : ℝ) ∧
    |Real.pi * 4 ^ 2 - 50| < (0.5 : ℝ) ∧ 24 * √3 < Real.pi * 4 ^ 2 ∧ 24 * √3 ≠ (41.6 : ℝ) ∧
    2 * √3 ≠ (4 : ℝ) := by
  obtain ⟨h1, h2⟩ := koren3
  have p1 := Real.pi_gt_d2
  have p2 := Real.pi_lt_d2
  refine ⟨?_, by norm_num, ?_, ?_, by nlinarith, by intro h; linarith, by intro h; linarith⟩
  · rw [abs_lt]; constructor <;> linarith
  · rw [abs_lt]; constructor <;> linarith
  · rw [abs_lt]; constructor <;> nlinarith

/-- Naloga 6d, pot »Drugače: s koti po 120°«: na modelu je |FA| = 4 in kot pri A meri 120° (preverba v 4. koraku);
(glej `n6_model`, `n6a`). -/
theorem n6d_preverba : dist tF tA = 4 ∧ ∠ tF tA tB = 2 * Real.pi / 3 :=
  ⟨(n6_model).2.2.2.2.2.1, (n6a).1⟩

/-! ## Naloga 7

n-ti lik je mreža (n + 1) × (n + 1) kvadratkov (i, j), 0 ≤ i, j ≤ n; osenčeni so kvadratki ob robu. -/

/-- Vsi kvadratki n-tega lika. -/
def lik (n : ℕ) : Finset (ℕ × ℕ) := Finset.range (n + 1) ×ˢ Finset.range (n + 1)

/-- Osenčeni (robni) kvadratki n-tega lika. -/
def rob (n : ℕ) : Finset (ℕ × ℕ) := (lik n).filter (fun p => p.1 = 0 ∨ p.1 = n ∨ p.2 = 0 ∨ p.2 = n)

/-- Neosenčeni (notranji) kvadratki: kvadrat s stranico n − 1. -/
def notranjost (n : ℕ) : Finset (ℕ × ℕ) := Finset.Icc 1 (n - 1) ×ˢ Finset.Icc 1 (n - 1)

/-- n-ti lik ima (n + 1)² kvadratkov. -/
theorem card_lik (n : ℕ) : (lik n).card = (n + 1) ^ 2 := by simp [lik, sq]

/-- Notranjost n-tega lika ima (n − 1)² kvadratkov. -/
theorem card_notranjost (n : ℕ) : (notranjost n).card = (n - 1) ^ 2 := by simp [notranjost, sq]

/-- Robni kvadratki so vsi kvadratki brez notranjih. -/
theorem rob_eq (n : ℕ) : rob n = lik n \ notranjost n := by
  ext ⟨i, j⟩; simp [rob, lik, notranjost]; omega

/-- Naloga 7a, uradni odgovor: za n ≥ 1 ima n-ti lik 4n osenčenih in (n + 1)² vseh kvadratkov;
preglednica: 4, 8, 12, 20 in 4, 9, 16, 36. -/
theorem n7a : (∀ n, 1 ≤ n → (rob n).card = 4 * n) ∧ (∀ n, (lik n).card = (n + 1) ^ 2) ∧
    (rob 1).card = 4 ∧ (rob 2).card = 8 ∧ (rob 3).card = 12 ∧ (rob 5).card = 20 ∧
    (lik 1).card = 4 ∧ (lik 2).card = 9 ∧ (lik 3).card = 16 ∧ (lik 5).card = 36 := by
  have h : ∀ n, 1 ≤ n → (rob n).card = 4 * n := by
    intro n hn
    have hs : notranjost n ⊆ lik n := by
      intro ⟨i, j⟩ hp; simp [notranjost, lik] at hp ⊢; omega
    rw [rob_eq, Finset.card_sdiff_of_subset hs, card_lik, card_notranjost]
    obtain ⟨k, rfl⟩ : ∃ k, n = k + 1 := ⟨n - 1, by omega⟩
    simp only [Nat.add_sub_cancel]
    apply Nat.sub_eq_of_eq_add; ring
  refine ⟨h, card_lik, h 1 le_rfl, h 2 (by norm_num), h 3 (by norm_num), h 5 (by norm_num), ?_, ?_, ?_, ?_⟩ <;>
    norm_num [card_lik]

/-- Naloga 7a, pot »Po korakih: iz stranice lika«: stranica n-tega lika je n + 1; (5 + 1)² = 36;
4(n + 1) − 4 = 4n; 4·6 − 4 = 20; preverba 4·1 = 4, 4·2 = 8, 4·3 = 12. -/
theorem n7a_stranica : (∀ n, (lik n).card = (n + 1) * (n + 1)) ∧ (5 + 1) ^ 2 = 36 ∧
    (∀ n : ℕ, 4 * (n + 1) - 4 = 4 * n) ∧ 4 * 6 - 4 = 20 ∧ 4 * 1 = 4 ∧ 4 * 2 = 8 ∧ 4 * 3 = 12 := by
  refine ⟨fun n => by rw [card_lik, sq], rfl, fun n => by omega, rfl, rfl, rfl, rfl⟩

/-- Naloga 7a, pot »Drugače: osenčeni = vsi − neosenčeni«: notranjost ima (n − 1)² kvadratkov (na sliki 0, 1, 4);
(n + 1)² − (n − 1)² = n² + 2n + 1 − (n² − 2n + 1) = 4n; za 5. lik (5 + 1)² − (5 − 1)² = 36 − 16 = 20. -/
theorem n7a_razlika : (notranjost 1).card = 0 ∧ (notranjost 2).card = 1 ∧ (notranjost 3).card = 4 ∧
    (∀ n : ℤ, (n + 1) ^ 2 - (n - 1) ^ 2 = n ^ 2 + 2 * n + 1 - (n ^ 2 - 2 * n + 1)) ∧
    (∀ n : ℤ, n ^ 2 + 2 * n + 1 - (n ^ 2 - 2 * n + 1) = 4 * n) ∧ (5 + 1) ^ 2 - (5 - 1) ^ 2 = 36 - 16 ∧
    36 - 16 = 20 := by
  refine ⟨by norm_num [card_notranjost], by norm_num [card_notranjost], by norm_num [card_notranjost],
    fun n => by ring,
    fun n => by ring, rfl, rfl⟩

/-- Naloga 7a, pot »Drugače: zaporedje razlik«: 4, 8, 12, 16, 20 so 4n za n = 1 … 5 (razlika 4);
4, 9, 16, 25, 36 so kvadrati 2, 3, 4, 5, 6, torej (n + 1)². Napaka: 4(n + 1) ≠ 4n. -/
theorem n7a_zaporedje : (List.range 5).map (fun i => (rob (i + 1)).card) = [4, 8, 12, 16, 20] ∧
    (List.range 5).map (fun i => (lik (i + 1)).card) = [4, 9, 16, 25, 36] ∧
    [4, 9, 16, 25, 36] = [2 ^ 2, 3 ^ 2, 4 ^ 2, 5 ^ 2, 6 ^ 2] ∧ ∀ n : ℕ, 4 * (n + 1) ≠ 4 * n := by
  obtain ⟨h, -⟩ := n7a
  refine ⟨?_, ?_, rfl, fun n => by omega⟩
  · simp [List.range_succ, h _ (Nat.succ_pos _)]
  · simp [List.range_succ, card_lik]

/-- Naloga 7b, uradni odgovor in pot »Preverimo vsako trditev«: stranice 2, 3, 4; diagonala kvadrata
√(a² + a²) = a√2 (a ≥ 0). A: 16/4 = 4 ≠ 2; B: √(4² + 4²) = 4√2, √(2² + 2²) = 2√2, 4√2/(2√2) = 2, torej
√(4² + 4²) = 2·√(2² + 2²) (drži); C: 16/8 = 2 ≠ 4; D: 9/4 = 2,25,
(9 − 4)/4 = 125 %, ni 50 %. -/
theorem n7b : (∀ a : ℝ, 0 ≤ a → √(a ^ 2 + a ^ 2) = a * √2) ∧
    ((4 : ℚ) ^ 2 = 16 ∧ (2 : ℚ) ^ 2 = 4 ∧ (16 / 4 : ℚ) = 4 ∧ (16 / 4 : ℚ) ≠ 2) ∧
    (4 * √2 / (2 * √2) = (2 : ℝ)) ∧
    (√((4 : ℝ) ^ 2 + 4 ^ 2) = 4 * √2 ∧ √((2 : ℝ) ^ 2 + 2 ^ 2) = 2 * √2 ∧
      √((4 : ℝ) ^ 2 + 4 ^ 2) = 2 * √((2 : ℝ) ^ 2 + 2 ^ 2)) ∧
    ((4 * 4 : ℚ) = 16 ∧ (4 * 2 : ℚ) = 8 ∧ (16 / 8 : ℚ) = 2 ∧ (16 / 8 : ℚ) ≠ 4) ∧
    ((3 : ℚ) ^ 2 = 9 ∧ (9 / 4 : ℚ) = 2.25 ∧ ((9 - 4) / 4 : ℚ) = 125 / 100 ∧ (9 : ℚ) ≠ 4 + 4 / 2) := by
  have hd : ∀ a : ℝ, 0 ≤ a → √(a ^ 2 + a ^ 2) = a * √2 := fun a ha => by
    rw [show a ^ 2 + a ^ 2 = a ^ 2 * 2 by ring, Real.sqrt_mul (by positivity), Real.sqrt_sq ha]
  refine ⟨hd, by norm_num, ?_, ⟨hd 4 (by norm_num), hd 2 (by norm_num), ?_⟩, by norm_num, by norm_num⟩
  · have : (0 : ℝ) < √2 := by positivity
    field_simp; ring
  · rw [hd 4 (by norm_num), hd 2 (by norm_num)]; ring

/-- Naloga 7b, pot »Drugače: s podobnostjo«: 4 : 2 = 2; dolžine (stranica, diagonala, obseg) v razmerju 2,
ploščini v razmerju 2² = 4. -/
theorem n7b_podobnost : (4 / 2 : ℚ) = 2 ∧ (4 * √2) / (2 * √2) = (4 / 2 : ℝ) ∧ (4 * 4 : ℚ) / (4 * 2) = 2 ∧
    ((4 : ℚ) ^ 2 / 2 ^ 2) = 2 ^ 2 ∧ (2 : ℚ) ^ 2 = 4 := by
  refine ⟨by norm_num, ?_, by norm_num, by norm_num, by norm_num⟩
  have : (0 : ℝ) < √2 := by positivity
  field_simp

/-! ## Naloga 8

Model trikotne stene v ℂ (v metrih): oglišči ob tleh −1,2 in 1,2, vrh 1,6 i. -/

/-- Levo oglišče ob tleh. -/
def sL : ℂ := ⟨-1.2, 0⟩
/-- Desno oglišče ob tleh. -/
def sR : ℂ := ⟨1.2, 0⟩
/-- Vrh stene. -/
def sV : ℂ := ⟨0, 1.6⟩

/-- Naloga 8b, uradni odgovor: stena (širina 2,4, višina 1,6) je enakokraka (kraka sta 2) in ni enakostranična
(2 ≠ 2,4); enakostranični trikotnik s stranico 2,4 bi imel višino √(2,4² − 1,2²) = 2,4√3/2 ≈ 2,08
(|2,4√3/2 − 2,08| < 0,005), ne 1,6. -/
theorem n8b : dist sL sR = 2.4 ∧ dist sL sV = 2 ∧ dist sR sV = 2 ∧ (2 : ℝ) ≠ 2.4 ∧
    √((2.4 : ℝ) ^ 2 - 1.2 ^ 2) = 2.4 * √3 / 2 ∧ |2.4 * √3 / 2 - 2.08| < (0.005 : ℝ) ∧
    2.4 * √3 / 2 ≠ (1.6 : ℝ) := by
  obtain ⟨h1, h2⟩ := koren3
  refine ⟨dist_iz_sq (by norm_num) (by simp [sL, sR]; norm_num),
    dist_iz_sq (by norm_num) (by simp [sL, sV]; norm_num),
    dist_iz_sq (by norm_num) (by simp [sR, sV]; norm_num), by norm_num, ?_, ?_, by intro h; linarith⟩
  · rw [show (2.4 : ℝ) ^ 2 - 1.2 ^ 2 = 1.2 ^ 2 * 3 by norm_num, Real.sqrt_mul (by norm_num),
      Real.sqrt_sq (by norm_num)]
    ring
  · rw [abs_lt]; constructor <;> linarith

/-- Naloga 8c, uradni odgovor in pot »Po korakih«: krak s > 0, s² = 1,2² + 1,6² = 1,44 + 2,56 = 4 ⇔ s = 2;
ploščina strešne ploskve 3·2 = 6. -/
theorem n8c : (∀ s : ℝ, 0 < s → (s ^ 2 = 1.2 ^ 2 + 1.6 ^ 2 ↔ s = 2)) ∧ (1.2 ^ 2 + 1.6 ^ 2 : ℚ) = 1.44 + 2.56 ∧
    (1.44 + 2.56 : ℚ) = 4 ∧ (3 * 2 : ℚ) = 6 := by
  refine ⟨fun s hs => ⟨fun h => ?_, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num⟩
  have : (s - 2) * (s + 2) = 0 := by nlinarith
  rcases mul_eq_zero.1 this with h | h <;> linarith

example : ∃ s : ℝ, 0 < s := ⟨2, by norm_num⟩

/-- Naloga 8c, pot »Drugače: v decimetrih«: 12 = 4·3, 16 = 4·4, 20 = 4·5; 12² + 16² = 144 + 256 = 400 = 20²;
30·20 = 600 dm² = 6 m² (1 m² = 100 dm²). -/
theorem n8c_dm : 12 = 4 * 3 ∧ 16 = 4 * 4 ∧ 4 * 5 = 20 ∧ 12 ^ 2 + 16 ^ 2 = 144 + 256 ∧ 144 + 256 = 400 ∧
    400 = 20 ^ 2 ∧ 30 * 20 = 600 ∧ (600 / 100 : ℚ) = 6 := by
  refine ⟨rfl, rfl, rfl, rfl, rfl, rfl, rfl, by norm_num⟩

/-- Naloga 8c, napaka: z višino 1,6 namesto kraka 3·1,6 = 4,8 ≠ 6; s polovico širine 3·1,2 = 3,6 ≠ 6. -/
theorem n8c_napaka : (3 * 1.6 : ℚ) = 4.8 ∧ (4.8 : ℚ) ≠ 6 ∧ (3 * 1.2 : ℚ) = 3.6 ∧ (3.6 : ℚ) ≠ 6 := by norm_num

/-- Naloga 8d, uradni odgovor in pot »Po korakih«: O = 2,4·1,6/2 = 1,92; V = 1,92·3 = 5,76. -/
theorem n8d : (2.4 * 1.6 / 2 : ℚ) = 1.92 ∧ (1.92 * 3 : ℚ) = 5.76 := by norm_num

/-- Naloga 8d, pot »Drugače: polovica kvadra« in napaka: 2,4·1,6·3 = 11,52; 11,52 : 2 = 5,76;
11,52 ≠ 5,76 (pozabljeno deljenje z 2). -/
theorem n8d_kvader : (2.4 * 1.6 * 3 : ℚ) = 11.52 ∧ (11.52 / 2 : ℚ) = 5.76 ∧ (2.4 * 1.6 / 2 * 3 : ℚ) =
    2.4 * 1.6 * 3 / 2 ∧ (11.52 : ℚ) ≠ 5.76 := by norm_num

/-! ## Naloga 9 -/

/-- Število dolžin po dnevih (pon … ned), odčitek s prikaza. -/
def dolzine : List ℕ := [40, 45, 50, 30, 55, 60, 20]

/-- Čas treninga po dnevih (min), iz preglednice. -/
def cas : List ℕ := [45, 50, 55, 35, 60, 66, 25]

/-- Naloga 9a, uradni odgovor: več kot 40 dolžin je bilo v dneh 1, 2, 4, 5 (tor, sre, pet, sob), to so
4 dnevi; ponedeljek (40) ne šteje, ker 40 < 40 ne velja. -/
theorem n9a : (List.range 7).filter (fun i => 40 < dolzine.getD i 0) = [1, 2, 4, 5] ∧
    (dolzine.filter (40 < ·)).length = 4 ∧ dolzine.getD 0 0 = 40 ∧ ¬ (40 < 40) := by decide

/-- Naloga 9a, napaka: s ponedeljkom (»vsaj 40«) bi dobili 5 dni. -/
theorem n9a_napaka : (dolzine.filter (40 ≤ ·)).length = 5 := by decide

/-- Naloga 9b, uradni odgovor in pot »Po korakih«: v petek 55 dolžin; 55·25 = 50·25 + 5·25 = 1250 + 125 = 1375 m;
1375 m = 1375/1000 km = 1,375 km. -/
theorem n9b : dolzine.getD 4 0 = 55 ∧ 55 * 25 = 50 * 25 + 5 * 25 ∧ 50 * 25 + 5 * 25 = 1250 + 125 ∧
    1250 + 125 = 1375 ∧ (1375 / 1000 : ℚ) = 1.375 := by
  refine ⟨by decide, rfl, rfl, rfl, by norm_num⟩

/-- Naloga 9b, poti »Po 40 dolžin« in »Neposredno v kilometrih«: 40·25 = 1000 m = 1 km; 55 − 40 = 15,
15·25 = 375 m = 0,375 km; 1 + 0,375 = 1,375; 25 m = 0,025 km, 55·0,025 = 1,375. Napaka: 13,75 in 137,5
nista 1375/1000. -/
theorem n9b_poti : 40 * 25 = 1000 ∧ 55 - 40 = 15 ∧ 15 * 25 = 375 ∧ (375 / 1000 : ℚ) = 0.375 ∧
    (1 + 0.375 : ℚ) = 1.375 ∧ (25 / 1000 : ℚ) = 0.025 ∧ (55 * 0.025 : ℚ) = 1.375 ∧
    (13.75 : ℚ) ≠ 1375 / 1000 ∧ (137.5 : ℚ) ≠ 1375 / 1000 := by
  refine ⟨rfl, rfl, rfl, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 9c, uradni odgovor in pot »Po korakih«: 7 podatkov, vsota 45 + 50 + 55 + 35 + 60 + 66 + 25 = 336;
336 : 7 = 48. -/
theorem n9c : cas.length = 7 ∧ cas.sum = 336 ∧ 45 + 50 + 55 + 35 + 60 + 66 + 25 = 336 ∧
    ((cas.sum : ℚ) / cas.length) = 48 ∧ (336 / 7 : ℚ) = 48 := by
  have h1 : cas.sum = 336 := by decide
  have h2 : cas.length = 7 := by decide
  refine ⟨h2, h1, rfl, ?_, by norm_num⟩
  rw [h1, h2]; norm_num

/-- Naloga 9c, pot »Drugače: z odmiki od 50 minut«: odmiki −5, 0, 5, −15, 10, 16, −25; vsota −14;
−14 : 7 = −2; 50 − 2 = 48. Pot »Preizkus«: 7·48 = 336. -/
theorem n9c_odmiki : cas.map (fun t => (t : ℤ) - 50) = [-5, 0, 5, -15, 10, 16, -25] ∧
    (-5 + 0 + 5 - 15 + 10 + 16 - 25 : ℤ) = -14 ∧ (-14 / 7 : ℚ) = -2 ∧ (50 - 2 : ℚ) = 48 ∧ 7 * 48 = 336 := by
  refine ⟨by decide, by norm_num, by norm_num, by norm_num, rfl⟩

/-- Naloga 9c, napaka: mediana (4. člen urejenih podatkov 25, 35, 45, 50, 55, 60, 66, ki so preureditev
podatkov iz preglednice) je 50 ≠ 48; deljenje s 6 ali 8 ne da 48. -/
theorem n9c_napaka : cas.Perm [25, 35, 45, 50, 55, 60, 66] ∧ [25, 35, 45, 50, 55, 60, 66].Pairwise (· ≤ ·) ∧
    [25, 35, 45, 50, 55, 60, 66].getD 3 0 = 50 ∧ (50 : ℚ) ≠ 48 ∧ (336 / 6 : ℚ) ≠ 48 ∧ (336 / 8 : ℚ) ≠ 48 := by
  refine ⟨by decide, by decide, rfl, by norm_num, by norm_num, by norm_num⟩

end Evklid.Pole.NPZ9_MAT_2026_redni
