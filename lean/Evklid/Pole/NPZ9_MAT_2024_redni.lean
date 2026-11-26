/-
vir: content/exam-papers/NPZ9-MAT-2024-redni.json
sha256: 03ef3f62143a7793fc1bff24da3f8b6c6892813b125b36ce307b38985a4610b1
Ni v Leanu: 4a risanje (skica, šestilo, ravnilo, ±2 mm); dokazano je, da točke modela v ℂ
(A = 0, B = 8, D = 8 + 6i, C = 16 + 6i) izpolnjujejo pogoje načrta (loki 10 cm, 6 cm, 10 cm, 8 cm; vektor
DC = AB; pravi kot pri B iz tega sledi po `n4b`) in da vsak paralelogram s pravim kotom pri B in |AB| = 8, |BD| = 6
ima |AD| = |BC| = 10; da sta presečišči lokov edini točki, ni dokazano (izbira »na desni strani« je risba).
4c ploščina kot mera lika: Mathlib nima ploščine mnogokotnika, zato obrazec p = a·v_a ni dokazan; dokazano je,
da je BD ⟂ AB, da je |BD| = 6 najkrajša razdalja od D do premice AB (višina v_a), in računa 8·6 = 48,
8·6/2 = 24, 2·24 = 48. 5a pravilni petkotnik je model v ℂ (oglišča 5·ωᵏ, ω = e^{2πi/5}, S = 0); dokazano je
|SA| = |SB| = 5, ω⁵ = 1 (pet vrtenj je cel obrat) in ∠ASB = 72°; razdelitev na pet skladnih trikotnikov je
razlaga. 5b: dokazano splošno, da ima enakokraki trikotnik s krakoma 5 in kotom 72° pri vrhu kota 54° ob
osnovnici; da je notranji kot vsota ∠EAS + ∠SAB (S leži v notranjosti kota EAB), ni dokazano (zahtevno, še ni
dokazano); obrazec (n − 2)·180° in vsota zunanjih kotov 360° sta uporabljena kot podatek (dokazan je račun).
5c obrazec za dolžino loka l = π·r·α/180° je uporabljen kot definicija (v radianih l = r·θ); dokazani so
računi s 3,14 in meja napake |2π − 6,28| < 0,004. 7 telo je zapisano v koordinatah (zgornja ploskev kocke
z = 8, oglišča (0,0), (8,0), (8,8), (0,8), vrh nad središčem (4,4)); razdalja je zapisana kot koren vsote
kvadratov razlik koordinat (Pitagorov izrek v prostoru); 7b štetje robov (12 + 4) je razmislek o telesu,
dokazan je račun; 7a: dokazano je, da ima stranska ploskev v modelu (oglišča (0,0,8), (8,0,8) in vrh
(4,4,8 + √32) iz 7c) vse tri stranice 8; »skica ne kaže pravih dolžin« je razlaga. 8 pravilo iz slik (stranica n + 2, beli
kvadrat n × n, črni rob 4n + 4) je zapisano kot definicija; da so prve štiri slike take, je odčitek s slike
(1. slika: 8 črnih, 1 bel). 6 »praštevilo« in »delitelji« sta pojma na ℕ: število iz seznama (v ℚ) je
naravno, če je enako (n : ℚ) za neki n : ℕ. 3b »preizkus v izhodiščni enačbi« je navodilo (dokazan je
preizkus v izhodiščni enačbi). Besedilne razlage napak, ki niso števila, niso trditve.
Decimalna števila so točna racionalna števila (ℚ) ali realna (ℝ) z ulomkom. Kote v geometriji Mathlib meri
v radianih: 72° je zapisano kot 72·π/180. Konvencije Leana: x/0 = 0 (deljenje z 0 se nikjer ne uporabi,
pri 3c je e > 0), √ negativnega števila je 0 (vsi koreni so iz pozitivnih števil), kot z ničelnim vektorjem
je π/2 (pri 5b sta oglišči A, B različni od S, ker je |SA| = |SB| = 5), odštevanje v ℕ se ne uporabi
(odmiki v 9a so v ℤ). Zaokroževanje je Mathlibov `round` (⌊x + 1/2⌋).
-/
module

public import Mathlib

public section

namespace Evklid.Pole.NPZ9_MAT_2024_redni

open EuclideanGeometry Complex

/-! ## Naloga 1 -/

/-- Naloga 1a, pot »Po pravilu«: −(−15) = +15 in −7 − (−15) = −7 + 15 = 8. -/
theorem n1a : (-(-15) : ℤ) = 15 ∧ (-7 : ℤ) - (-15) = 8 := by
  refine ⟨by norm_num, ?_⟩
  calc (-7 : ℤ) - (-15) = -7 + 15 := by norm_num
    _ = 8 := by norm_num

/-- Naloga 1a, pot »S številsko premico«: od −7 se pomaknemo za 15 v desno; po 7 korakih smo pri 0, po
preostalih 8 pri 8 (7 + 8 = 15). -/
theorem n1a_premica : (-7 : ℤ) + 7 = 0 ∧ (0 : ℤ) + 8 = 8 ∧ 7 + 8 = 15 ∧ (-7 : ℤ) + 15 = 8 := by
  norm_num

/-- Naloga 1a, napaki: −7 − 15 = −22 in −8 nista rezultat; večjo absolutno vrednost ima 15, rezultat je
pozitiven. -/
theorem n1a_napaka : (-7 : ℤ) - 15 = -22 ∧ (-22 : ℤ) ≠ -7 - (-15) ∧ (-8 : ℤ) ≠ -7 - (-15) ∧
    |(-7 : ℤ)| < |(15 : ℤ)| ∧ 0 < (-7 : ℤ) - (-15) := by
  norm_num

/-- Naloga 1b, pot »Po korakih«: 6·37 = 6·30 + 6·7 = 180 + 42 = 222, zato 6·(−37) = −222. -/
theorem n1b : (6 : ℤ) * 37 = 222 ∧ (6 : ℤ) * (-37) = -222 := by
  have h : (6 : ℤ) * 37 = 222 := by
    calc (6 : ℤ) * 37 = 6 * 30 + 6 * 7 := by norm_num
      _ = 180 + 42 := by norm_num
      _ = 222 := by norm_num
  refine ⟨h, ?_⟩
  calc (6 : ℤ) * (-37) = -(6 * 37) := by ring
    _ = -222 := by rw [h]

/-- Naloga 1b, pot »Drugače: z razčlenitvijo«: −37 = −40 + 3 in 6·(−37) = 6·(−40) + 6·3 = −240 + 18 = −222. -/
theorem n1b_razclenitev : (-37 : ℤ) = -40 + 3 ∧ (6 : ℤ) * (-37) = -222 := by
  refine ⟨by norm_num, ?_⟩
  calc (6 : ℤ) * (-37) = 6 * (-40) + 6 * 3 := by norm_num
    _ = -240 + 18 := by norm_num
    _ = -222 := by norm_num

/-- Naloga 1b, napaka: 222 ni rezultat; pozitivno število krat negativno je negativno. -/
theorem n1b_napaka : (222 : ℤ) ≠ 6 * (-37) ∧ ∀ a b : ℤ, 0 < a → b < 0 → a * b < 0 :=
  ⟨by norm_num, fun _ _ ha hb => mul_neg_of_pos_of_neg ha hb⟩

/-- Naloga 1c, pot »Po pravilu«: 0,01 = 1/100, zato deliti z 0,01 pomeni množiti s 100:
4,3 : 0,01 = 4,3·100 = 430. -/
theorem n1c : (0.01 : ℚ) = 1 / 100 ∧ (4.3 : ℚ) / 0.01 = 430 := by
  refine ⟨by norm_num, ?_⟩
  calc (4.3 : ℚ) / 0.01 = 4.3 * 100 := by norm_num
    _ = 430 := by norm_num

/-- Naloga 1c, pot »Drugače: z razširjanjem«: 4,3 : 0,01 = (4,3·100) : (0,01·100) = 430 : 1 = 430. -/
theorem n1c_razsirjanje : (4.3 : ℚ) / 0.01 = 430 := by
  calc (4.3 : ℚ) / 0.01 = (4.3 * 100) / (0.01 * 100) := by norm_num
    _ = 430 / 1 := by norm_num
    _ = 430 := by norm_num

/-- Naloga 1c, napaka: 4,3·0,01 = 0,043 (to je množenje); pri deljenju s pozitivnim številom, manjšim od 1, je
rezultat večji od (pozitivnega) deljenca. -/
theorem n1c_napaka : (4.3 : ℚ) * 0.01 = 0.043 ∧ (0.043 : ℚ) ≠ 4.3 / 0.01 ∧
    ∀ a d : ℚ, 0 < a → 0 < d → d < 1 → a < a / d := by
  refine ⟨by norm_num, by norm_num, fun a d ha hd hd1 => ?_⟩
  rw [lt_div_iff₀ hd]; nlinarith

/-- Naloga 1d, pot »Po pravilu«: 0,0256·1000 = 25,6. -/
theorem n1d : (0.0256 : ℚ) * 1000 = 25.6 := by norm_num

/-- Naloga 1d, pot »Z oceno«: 0,0256 > 0,025, 0,025·1000 = 25, zato je rezultat večji od 25: 25,6 > 25. -/
theorem n1d_ocena : (0.025 : ℚ) < 0.0256 ∧ (0.025 : ℚ) * 1000 = 25 ∧ (25 : ℚ) < 0.0256 * 1000 := by
  norm_num

/-- Naloga 1d, napaka: premik vejice za dve mesti je množenje s 100: 0,0256·100 = 2,56 ≠ 25,6. -/
theorem n1d_napaka : (0.0256 : ℚ) * 100 = 2.56 ∧ (2.56 : ℚ) ≠ 0.0256 * 1000 := by norm_num

/-- Naloga 1e, pot »Po korakih«: 1,25 − 1,7 = −(1,70 − 1,25) = −0,45; 3,6 : 0,45 = 360 : 45 = 8;
3,6 : (−0,45) = −8. -/
theorem n1e : (1.25 : ℚ) - 1.7 = -0.45 ∧ (3.6 : ℚ) / 0.45 = 8 ∧ (3.6 : ℚ) / (1.25 - 1.7) = -8 := by
  have h1 : (1.25 : ℚ) - 1.7 = -0.45 := by
    calc (1.25 : ℚ) - 1.7 = -(1.70 - 1.25) := by ring
      _ = -0.45 := by norm_num
  have h2 : (3.6 : ℚ) / 0.45 = 8 := by
    calc (3.6 : ℚ) / 0.45 = 360 / 45 := by norm_num
      _ = 8 := by norm_num
  refine ⟨h1, h2, ?_⟩
  calc (3.6 : ℚ) / (1.25 - 1.7) = 3.6 / (-0.45) := by rw [h1]
    _ = -8 := by norm_num

/-- Naloga 1e, pot »Drugače: z ulomki«: 3,6 = 18/5, 1,25 = 5/4 = 25/20, 1,7 = 17/10 = 34/20;
25/20 − 34/20 = −9/20; 18/5 : (−9/20) = −18/5·20/9 = −(2·4)/1 = −8. -/
theorem n1e_ulomki : (3.6 : ℚ) = 18 / 5 ∧ (1.25 : ℚ) = 5 / 4 ∧ (5 / 4 : ℚ) = 25 / 20 ∧
    (1.7 : ℚ) = 17 / 10 ∧ (17 / 10 : ℚ) = 34 / 20 ∧ (25 / 20 : ℚ) - 34 / 20 = -9 / 20 ∧
    (18 / 5 : ℚ) / (-9 / 20) = -8 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  calc (18 / 5 : ℚ) / (-9 / 20) = -(18 / 5 * (20 / 9)) := by ring
    _ = -(2 * 4 / 1) := by norm_num
    _ = -8 := by norm_num

/-- Naloga 1e, pot »Preizkus«: (−8)·(−0,45) = 3,6. -/
theorem n1e_preizkus : (-8 : ℚ) * (-0.45) = 3.6 := by norm_num

/-- Naloga 1e, napake: brez oklepaja 3,6 : 1,25 − 1,7 = 1,18 ≠ −8; z obrnjeno razliko 1,7 − 1,25 = 0,45 dobimo
+8. -/
theorem n1e_napaka : (3.6 : ℚ) / 1.25 - 1.7 = 1.18 ∧ (1.18 : ℚ) ≠ -8 ∧ (1.7 : ℚ) - 1.25 = 0.45 ∧
    (3.6 : ℚ) / (1.7 - 1.25) = 8 := by
  norm_num

/-! ## Naloga 2 -/

/-- Naloga 2a, pot »S pari deliteljev«: 28 = 1·28 = 2·14 = 4·7; 3, 5 in 6 ne delijo 28; delitelji, manjši od 7,
so 1, 2, 4 (ostali so njihovi pari in 7), zato D₂₈ = {1, 2, 4, 7, 14, 28}. -/
theorem n2a : 28 = 1 * 28 ∧ 28 = 2 * 14 ∧ 28 = 4 * 7 ∧ ¬ 3 ∣ 28 ∧ ¬ 5 ∣ 28 ∧ ¬ 6 ∣ 28 ∧
    (Nat.divisors 28).filter (· < 7) = {1, 2, 4} ∧ Nat.divisors 28 = {1, 2, 4, 7, 14, 28} := by
  refine ⟨by norm_num, by norm_num, by norm_num, by decide, by decide, by decide, by decide, by decide⟩

/-- Naloga 2a, napaka: vsako naravno število n ≥ 1 je deljivo z 1 in s samim seboj. -/
theorem n2a_napaka (n : ℕ) (hn : n ≠ 0) : 1 ∈ Nat.divisors n ∧ n ∈ Nat.divisors n := by
  simp [hn]

/-- Predpostavka trditve `n2a_napaka` se da izpolniti (n = 28). -/
example : (28 : ℕ) ≠ 0 := by norm_num

/-- Naloga 2b, pot »Po korakih«: 42 = 1·42 = 2·21 = 3·14 = 6·7, D₄₂ = {1, 2, 3, 6, 7, 14, 21, 42};
D₂₈ ∩ D₄₂ = {1, 2, 7, 14}. -/
theorem n2b : 42 = 1 * 42 ∧ 42 = 2 * 21 ∧ 42 = 3 * 14 ∧ 42 = 6 * 7 ∧
    Nat.divisors 42 = {1, 2, 3, 6, 7, 14, 21, 42} ∧
    Nat.divisors 28 ∩ Nat.divisors 42 = {1, 2, 7, 14} := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by decide, by decide⟩

/-- Naloga 2b, pot »Drugače: prek največjega skupnega delitelja«: skupni delitelji števil a, b ≠ 0 so
delitelji D(a, b); 28 = 2²·7, 42 = 2·3·7, D(28, 42) = 2·7 = 14, D₁₄ = {1, 2, 7, 14}. -/
theorem n2b_nsd : (∀ a b : ℕ, a ≠ 0 → b ≠ 0 → Nat.divisors a ∩ Nat.divisors b = Nat.divisors (Nat.gcd a b)) ∧
    28 = 2 ^ 2 * 7 ∧ 42 = 2 * 3 * 7 ∧ Nat.gcd 28 42 = 2 * 7 ∧ 2 * 7 = 14 ∧
    Nat.divisors 14 = {1, 2, 7, 14} := by
  refine ⟨fun a b ha hb => ?_, by norm_num, by norm_num, by norm_num, by norm_num, by decide⟩
  ext d
  simp only [Finset.mem_inter, Nat.mem_divisors, Nat.dvd_gcd_iff]
  have : Nat.gcd a b ≠ 0 := Nat.gcd_ne_zero_left ha
  tauto

/-- Naloga 2b, napaka: 4 deli le 28, 3 le 42, zato nista v preseku; presek ni unija. -/
theorem n2b_napaka : 4 ∉ Nat.divisors 28 ∩ Nat.divisors 42 ∧ 3 ∉ Nat.divisors 28 ∩ Nat.divisors 42 ∧
    Nat.divisors 28 ∩ Nat.divisors 42 ≠ Nat.divisors 28 ∪ Nat.divisors 42 := by
  decide

/-- Naloga 2c, pot »Z razcepom na prafaktorje«: 18 = 2·3², 45 = 3²·5; D(18, 45) = 3² = 9;
v(18, 45) = 2·3²·5 = 90. -/
theorem n2c : 18 = 2 * 3 ^ 2 ∧ 45 = 3 ^ 2 * 5 ∧ Nat.gcd 18 45 = 3 ^ 2 ∧ 3 ^ 2 = 9 ∧
    Nat.lcm 18 45 = 2 * 3 ^ 2 * 5 ∧ 2 * 3 ^ 2 * 5 = 90 := by
  norm_num

/-- Naloga 2c, pot »Drugače: z naštevanjem«: D₁₈ = {1, 2, 3, 6, 9, 18}, D₄₅ = {1, 3, 5, 9, 15, 45}, največji
skupni je 9; 45 ni deljiv z 18, 90 je (90 : 18 = 5), zato v(18, 45) = 90. -/
theorem n2c_nastevanje : Nat.divisors 18 = {1, 2, 3, 6, 9, 18} ∧ Nat.divisors 45 = {1, 3, 5, 9, 15, 45} ∧
    9 ∈ Nat.divisors 18 ∩ Nat.divisors 45 ∧
    (∀ d ∈ Nat.divisors 18 ∩ Nat.divisors 45, d ≤ 9) ∧ ¬ 18 ∣ 45 ∧ 90 / 18 = 5 ∧ 18 ∣ 90 ∧
    Nat.lcm 18 45 = 90 := by
  refine ⟨by decide, by decide, by decide, by decide, by decide, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 2c, pot »Preizkus«: D(a, b)·v(a, b) = a·b; 9·90 = 810 in 18·45 = 810. -/
theorem n2c_preizkus : (∀ a b : ℕ, Nat.gcd a b * Nat.lcm a b = a * b) ∧ 9 * 90 = 810 ∧ 18 * 45 = 810 :=
  ⟨fun a b => Nat.gcd_mul_lcm a b, by norm_num, by norm_num⟩

/-- Naloga 2c, napaka: 810 je skupni večkratnik, a ni najmanjši (skupni delitelj je 9). -/
theorem n2c_napaka : 18 ∣ 810 ∧ 45 ∣ 810 ∧ Nat.lcm 18 45 < 810 ∧ Nat.gcd 18 45 = 9 := by norm_num

/-- Naloga 2d, pot »Po korakih«: 12·3 = 36, 12·5 = 60; prvih šest večkratnikov je 12, 24, 36, 48, 60, 72. -/
theorem n2d : 12 * 3 = 36 ∧ 12 * 5 = 60 ∧
    (List.range 6).map (fun k => 12 * (k + 1)) = [12, 24, 36, 48, 60, 72] := by
  refine ⟨by norm_num, by norm_num, by decide⟩

/-- Naloga 2d, napaka: 6 in 4 nista večkratnika števila 12. -/
theorem n2d_napaka : ¬ 12 ∣ 6 ∧ ¬ 12 ∣ 4 := by decide

/-- Naloga 2e, pot »Z zaporednim deljenjem«: 432 : 2 = 216, 216 : 2 = 108, 108 : 2 = 54, 54 : 2 = 27,
27 : 3 = 9, 9 : 3 = 3, 3 : 3 = 1; 432 = 2⁴·3³ in 16·27 = 432. Eksponenta sta enolična:
2ⁱ·3ʲ = 432 ⇔ i = 4 in j = 3. -/
theorem n2e : 432 / 2 = 216 ∧ 216 / 2 = 108 ∧ 108 / 2 = 54 ∧ 54 / 2 = 27 ∧ 2 ∣ 432 ∧ 2 ∣ 216 ∧ 2 ∣ 108 ∧
    2 ∣ 54 ∧ ¬ 2 ∣ 27 ∧ 27 / 3 = 9 ∧ 9 / 3 = 3 ∧ 3 / 3 = 1 ∧ 3 ∣ 27 ∧ 3 ∣ 9 ∧
    432 = 2 ^ 4 * 3 ^ 3 ∧ 16 * 27 = 432 ∧ ∀ i j : ℕ, 2 ^ i * 3 ^ j = 432 ↔ i = 4 ∧ j = 3 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by decide, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, fun i j => ?_⟩
  constructor
  · intro h
    have hi : i < 9 := by
      by_contra hc
      have : 2 ^ 9 ≤ 2 ^ i := Nat.pow_le_pow_right (by norm_num) (by omega)
      have : 1 ≤ 3 ^ j := Nat.one_le_pow _ _ (by norm_num)
      nlinarith
    have hj : j < 6 := by
      by_contra hc
      have : 3 ^ 6 ≤ 3 ^ j := Nat.pow_le_pow_right (by norm_num) (by omega)
      have : 1 ≤ 2 ^ i := Nat.one_le_pow _ _ (by norm_num)
      nlinarith
    interval_cases i <;> interval_cases j <;> simp_all
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Naloga 2e, napaka: 2³·3⁴ = 8·81 = 648 ≠ 432. -/
theorem n2e_napaka : 2 ^ 3 * 3 ^ 4 = 8 * 81 ∧ 8 * 81 = 648 ∧ 648 ≠ 432 := by norm_num

/-! ## Naloga 3 -/

/-- Naloga 3a, pot »Po korakih«: 5a − 2b − (3a − 6b + 4) − b = 5a − 2b − 3a + 6b − 4 − b = 2a + 3b − 4
(5a − 3a = 2a, −2b + 6b − b = 3b). -/
theorem n3a (a b : ℝ) : 5 * a - 2 * b - (3 * a - 6 * b + 4) - b = 2 * a + 3 * b - 4 ∧
    5 * a - 3 * a = 2 * a ∧ -2 * b + 6 * b - b = 3 * b := by
  refine ⟨?_, by ring, by ring⟩
  calc 5 * a - 2 * b - (3 * a - 6 * b + 4) - b = 5 * a - 2 * b - 3 * a + 6 * b - 4 - b := by ring
    _ = 2 * a + 3 * b - 4 := by ring

/-- Naloga 3a, pot »Drugače: najprej zunaj oklepaja«: −2b − b = −3b, izraz je (5a − 3b) − (3a − 6b + 4);
5a − 3a = 2a, −3b − (−6b) = −3b + 6b = 3b, 0 − 4 = −4; rezultat 2a + 3b − 4. -/
theorem n3a_zunaj (a b : ℝ) : -2 * b - b = -3 * b ∧
    5 * a - 2 * b - (3 * a - 6 * b + 4) - b = (5 * a - 3 * b) - (3 * a - 6 * b + 4) ∧
    5 * a - 3 * a = 2 * a ∧ -3 * b - (-6 * b) = -3 * b + 6 * b ∧ -3 * b + 6 * b = 3 * b ∧
    (0 : ℝ) - 4 = -4 ∧ (5 * a - 3 * b) - (3 * a - 6 * b + 4) = 2 * a + 3 * b - 4 := by
  refine ⟨by ring, by ring, by ring, by ring, by ring, by norm_num, by ring⟩

/-- Naloga 3a, pot »Preizkus z vstavljanjem«: za a = 2, b = 1 je 10 − 2 − (6 − 6 + 4) − 1 = 8 − 4 − 1 = 3 in
4 + 3 − 4 = 3. -/
theorem n3a_preizkus :
    (5 * 2 - 2 * 1 - (3 * 2 - 6 * 1 + 4) - 1 : ℝ) = 10 - 2 - (6 - 6 + 4) - 1 ∧
    (10 - 2 - (6 - 6 + 4) - 1 : ℝ) = 8 - 4 - 1 ∧ (8 - 4 - 1 : ℝ) = 3 ∧
    (2 * 2 + 3 * 1 - 4 : ℝ) = 4 + 3 - 4 ∧ (4 + 3 - 4 : ℝ) = 3 := by
  norm_num

/-- Naloga 3a, napaka: −(3a − 6b + 4) = −3a + 6b − 4; zapis −3a − 6b + 4 v splošnem ni enak (npr. a = 0,
b = 0 da −4 ≠ 4). -/
theorem n3a_napaka : (∀ a b : ℝ, -(3 * a - 6 * b + 4) = -3 * a + 6 * b - 4) ∧
    ¬ ∀ a b : ℝ, -(3 * a - 6 * b + 4) = -3 * a - 6 * b + 4 := by
  refine ⟨fun a b => by ring, fun h => ?_⟩
  have := h 0 0
  norm_num at this

/-- Naloga 3b, pot »Po korakih«: enačba 4(2x − 3) − (x + 5) = 3(x + 1) − 4 je enakovredna
8x − 12 − x − 5 = 3x + 3 − 4, 7x − 17 = 3x − 1, 7x − 3x = −1 + 17, 4x = 16 in x = 4 (edina rešitev). -/
theorem n3b (x : ℝ) : 4 * (2 * x - 3) - (x + 5) = 3 * (x + 1) - 4 ↔ x = 4 := by
  calc 4 * (2 * x - 3) - (x + 5) = 3 * (x + 1) - 4
        ↔ 8 * x - 12 - x - 5 = 3 * x + 3 - 4 := by constructor <;> intro h <;> linarith
    _ ↔ 7 * x - 17 = 3 * x - 1 := by constructor <;> intro h <;> linarith
    _ ↔ 7 * x - 3 * x = -1 + 17 := by constructor <;> intro h <;> linarith
    _ ↔ 4 * x = 16 := by constructor <;> intro h <;> linarith
    _ ↔ x = 4 := by constructor <;> intro h <;> linarith

/-- Naloga 3b, pot »Po korakih«, preizkus: leva stran 4(8 − 3) − (4 + 5) = 20 − 9 = 11, desna 3·5 − 4 = 11. -/
theorem n3b_preizkus : (4 * (2 * 4 - 3) - (4 + 5) : ℝ) = 4 * (8 - 3) - (4 + 5) ∧
    (4 * (8 - 3) - (4 + 5) : ℝ) = 20 - 9 ∧ (20 - 9 : ℝ) = 11 ∧
    (3 * (4 + 1) - 4 : ℝ) = 3 * 5 - 4 ∧ (3 * 5 - 4 : ℝ) = 11 := by
  norm_num

/-- Naloga 3b, pot »Drugače: vse na eno stran«: enačba je enakovredna 8x − 12 − x − 5 − 3x − 3 + 4 = 0,
4x − 16 = 0, 4x = 16 in x = 4. -/
theorem n3b_eno_stran (x : ℝ) : 4 * (2 * x - 3) - (x + 5) = 3 * (x + 1) - 4 ↔ x = 4 := by
  calc 4 * (2 * x - 3) - (x + 5) = 3 * (x + 1) - 4
        ↔ 8 * x - 12 - x - 5 - 3 * x - 3 + 4 = 0 := by constructor <;> intro h <;> linarith
    _ ↔ 4 * x - 16 = 0 := by constructor <;> intro h <;> linarith
    _ ↔ 4 * x = 16 := by constructor <;> intro h <;> linarith
    _ ↔ x = 4 := by constructor <;> intro h <;> linarith

/-- Naloga 3b, pot »Drugače: vse na eno stran«, preizkus: L = 4·(2·4 − 3) − (4 + 5) = 4·5 − 9 = 11,
D = 3·(4 + 1) − 4 = 15 − 4 = 11. -/
theorem n3b_preizkus2 : (4 * (2 * 4 - 3) - (4 + 5) : ℝ) = 4 * 5 - 9 ∧ (4 * 5 - 9 : ℝ) = 11 ∧
    (3 * (4 + 1) - 4 : ℝ) = 15 - 4 ∧ (15 - 4 : ℝ) = 11 := by
  norm_num

/-- Naloga 3b, napaka: −(x + 5) = −x − 5, ne −x + 5 (razlika je 10). -/
theorem n3b_napaka (x : ℝ) : -(x + 5) = -x - 5 ∧ -(x + 5) ≠ -x + 5 := by
  constructor
  · ring
  · intro h; linarith

/-- Naloga 3c, pot »Po korakih«: za diagonalo e > 0 je p = e·f/2 ⇔ 2p = e·f ⇔ f = 2p/e. -/
theorem n3c (p e f : ℝ) (he : 0 < e) : p = e * f / 2 ↔ f = 2 * p / e := by
  calc p = e * f / 2 ↔ 2 * p = e * f := by constructor <;> intro h <;> linarith
    _ ↔ f = 2 * p / e := by
      rw [eq_div_iff he.ne']; constructor <;> intro h <;> linarith

/-- Predpostavka trditve `n3c` se da izpolniti (e = 6). -/
example : (0 : ℝ) < 6 := by norm_num

/-- Naloga 3c, preizkus s števili: e = 6, f = 4: p = 6·4/2 = 12 in f = 2·12/6 = 4. -/
theorem n3c_preizkus : (6 * 4 / 2 : ℝ) = 12 ∧ (2 * 12 / 6 : ℝ) = 4 := by norm_num

/-- Naloga 3c, napaka: f = p/(2e) in f = 2p − e sta napačna (pri e = 6, p = 12 dasta 1 in 18, ne 4). -/
theorem n3c_napaka : (12 / (2 * 6) : ℝ) = 1 ∧ (1 : ℝ) ≠ 4 ∧ (2 * 12 - 6 : ℝ) = 18 ∧ (18 : ℝ) ≠ 4 := by
  norm_num

/-! ## Naloga 4 -/

/-- Naloga 4b: v paralelogramu ABCD (vektor AB = DC) z |AB| = 8, |BC| = 10, |BD| = 6 je |AD| = |BC| = 10;
8² + 6² = 64 + 36 = 100 = 10², zato |AB|² + |BD|² = |AD|² in (obrat Pitagorovega izreka) je ∠ABD pravi kot. -/
theorem n4b {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (A B C D : P) (hpar : B -ᵥ A = C -ᵥ D) (hAB : dist A B = 8)
    (hBC : dist B C = 10) (hBD : dist B D = 6) :
    dist A D = 10 ∧ (8 : ℝ) ^ 2 + 6 ^ 2 = 64 + 36 ∧ (64 + 36 : ℝ) = 100 ∧ (100 : ℝ) = 10 ^ 2 ∧
    dist A B ^ 2 + dist B D ^ 2 = dist A D ^ 2 ∧ ∠ A B D = Real.pi / 2 := by
  have hAD : dist A D = 10 := by
    have h1 : A -ᵥ D = B -ᵥ C := by
      rw [← vsub_sub_vsub_cancel_left A D B, ← vsub_sub_vsub_cancel_right B C D, hpar]
    rw [dist_eq_norm_vsub V, h1, ← dist_eq_norm_vsub V, hBC]
  refine ⟨hAD, by norm_num, by norm_num, by norm_num, by rw [hAB, hBD, hAD]; norm_num, ?_⟩
  rw [← dist_sq_eq_dist_sq_add_dist_sq_iff_angle_eq_pi_div_two, dist_comm D B, hAB, hBD, hAD]
  norm_num

/-- Model paralelograma v ℂ: A = 0, B = 8, D = 8 + 6i, C = 16 + 6i. Izpolnjuje predpostavke `n4b`
(in je načrt iz 4a: |AD| = 10, |BD| = 6, |BC| = 10, |DC| = 8). -/
theorem n4a_model :
    (8 : ℂ) - 0 = (16 + 6 * I) - (8 + 6 * I) ∧ dist (0 : ℂ) 8 = 8 ∧ dist (8 : ℂ) (16 + 6 * I) = 10 ∧
    dist (8 : ℂ) (8 + 6 * I) = 6 ∧ dist (0 : ℂ) (8 + 6 * I) = 10 ∧
    dist (8 + 6 * I : ℂ) (16 + 6 * I) = 8 := by
  have n : ∀ x y : ℝ, dist (0 : ℂ) (x + y * I) = √(x ^ 2 + y ^ 2) := by
    intro x y; rw [dist_comm, Complex.dist_eq, sub_zero, Complex.norm_add_mul_I]
  have s10 : √((8:ℝ) ^ 2 + 6 ^ 2) = 10 := by
    rw [show (8:ℝ) ^ 2 + 6 ^ 2 = 10 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨by ring, ?_, ?_, ?_, ?_, ?_⟩
  · have := n 8 0; push_cast at this; simp only [zero_mul, add_zero] at this
    rw [this]; rw [show (8:ℝ) ^ 2 + 0 ^ 2 = 8 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [Complex.dist_eq, show (8 : ℂ) - (16 + 6 * I) = ((-8 : ℝ) : ℂ) + ((-6 : ℝ) : ℂ) * I by
      push_cast; ring, Complex.norm_add_mul_I]
    rw [show (-8:ℝ) ^ 2 + (-6) ^ 2 = 10 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [Complex.dist_eq, show (8 : ℂ) - (8 + 6 * I) = ((0 : ℝ) : ℂ) + ((-6 : ℝ) : ℂ) * I by
      push_cast; ring, Complex.norm_add_mul_I]
    rw [show (0:ℝ) ^ 2 + (-6) ^ 2 = 6 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · have := n 8 6; push_cast at this; rw [this, s10]
  · rw [Complex.dist_eq, show (8 + 6 * I : ℂ) - (16 + 6 * I) = ((-8 : ℝ) : ℂ) + ((0 : ℝ) : ℂ) * I by
      push_cast; ring, Complex.norm_add_mul_I]
    rw [show (-8:ℝ) ^ 2 + 0 ^ 2 = 8 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Predpostavke trditve `n4b` (in `n4a_pravi_kot`, `n4c_visina`) se dajo izpolniti: model v ℂ. -/
example : ∃ A B C D : ℂ, B -ᵥ A = C -ᵥ D ∧ dist A B = 8 ∧ dist B C = 10 ∧ dist B D = 6 := by
  obtain ⟨h1, h2, h3, h4, -, -⟩ := n4a_model
  exact ⟨0, 8, 16 + 6 * I, 8 + 6 * I, h1, h2, h3, h4⟩

/-- Naloga 4a, pot »Drugače: s pravim kotom pri B«: če je BD ⟂ AB (∠ABD = 90°), |AB| = 8, |BD| = 6 in je C
odmerjen od D vzporedno z AB (vektor DC = AB), je |DC| = 8 in kontrola |AD| = |BC| = 10 velja. -/
theorem n4a_pravi_kot {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (A B C D : P) (hpar : B -ᵥ A = C -ᵥ D) (hAB : dist A B = 8)
    (hBD : dist B D = 6) (hkot : ∠ A B D = Real.pi / 2) :
    dist D C = 8 ∧ dist A D = 10 ∧ dist B C = 10 := by
  have hDC : dist D C = 8 := by
    rw [dist_comm, dist_eq_norm_vsub V, ← hpar, ← dist_eq_norm_vsub V, dist_comm, hAB]
  have hAD : dist A D = 10 := by
    have h := (dist_sq_eq_dist_sq_add_dist_sq_iff_angle_eq_pi_div_two A B D).2 hkot
    rw [dist_comm D B, hAB, hBD] at h
    have h0 := dist_nonneg (x := A) (y := D)
    nlinarith
  refine ⟨hDC, hAD, ?_⟩
  have h1 : A -ᵥ D = B -ᵥ C := by
    rw [← vsub_sub_vsub_cancel_left A D B, ← vsub_sub_vsub_cancel_right B C D, hpar]
  rw [dist_eq_norm_vsub V, ← h1, ← dist_eq_norm_vsub V, hAD]

/-- Naloga 4a, napaka: kot med AB in AD ni pravi; če bi bil, bi bilo |BD|² = 8² + 10² = 164 ≠ 36. -/
theorem n4a_napaka {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (A B D : P) (hAB : dist A B = 8) (hAD : dist A D = 10) (hBD : dist B D = 6) :
    ∠ B A D ≠ Real.pi / 2 := by
  intro h
  have := (dist_sq_eq_dist_sq_add_dist_sq_iff_angle_eq_pi_div_two B A D).2 h
  rw [dist_comm B A, dist_comm D A, hAB, hAD, hBD] at this
  norm_num at this

/-- Predpostavke trditve `n4a_napaka` se dajo izpolniti (model v ℂ: A = 0, B = 8, D = 8 + 6i). -/
example : ∃ A B D : ℂ, dist A B = 8 ∧ dist A D = 10 ∧ dist B D = 6 := by
  obtain ⟨-, h2, -, h4, h5, -⟩ := n4a_model
  exact ⟨0, 8, 8 + 6 * I, h2, h5, h4⟩

/-- Naloga 4b, napaka: zapis 8² + 10² = 6² je napačen (164 ≠ 36); na desni je kvadrat najdaljše stranice. -/
theorem n4b_napaka : (8:ℝ) ^ 2 + 10 ^ 2 = 164 ∧ (6:ℝ) ^ 2 = 36 ∧ (8:ℝ) ^ 2 + 10 ^ 2 ≠ 6 ^ 2 := by norm_num

/-- Naloga 4c, pot »Po korakih«: ker je BD ⟂ AB, je B najbližja točka premice AB točki D: za vsako točko X
premice AB (X = B + t·(A − B)) je |DB| ≤ |DX|; višina na stranico a je v_a = |BD| = 6 in
p = a·v_a = 8·6 = 48. -/
theorem n4c_visina {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (A B D : P) (hkot : ∠ A B D = Real.pi / 2) (hBD : dist B D = 6) :
    (∀ t : ℝ, dist D B ≤ dist D (AffineMap.lineMap B A t)) ∧ dist D B = 6 ∧ (8 * 6 : ℝ) = 48 := by
  refine ⟨fun t => ?_, by rw [dist_comm, hBD], by norm_num⟩
  have hin : inner ℝ (A -ᵥ B) (D -ᵥ B) = 0 :=
    (InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two _ _).2 hkot
  have hX : D -ᵥ AffineMap.lineMap B A t = (D -ᵥ B) - t • (A -ᵥ B) := by
    rw [AffineMap.lineMap_apply, vsub_vadd_eq_vsub_sub]
  have key : ‖(D -ᵥ B) - t • (A -ᵥ B)‖ ^ 2 = ‖D -ᵥ B‖ ^ 2 + t ^ 2 * ‖A -ᵥ B‖ ^ 2 := by
    rw [norm_sub_sq_real, real_inner_smul_right, real_inner_comm, hin, norm_smul, Real.norm_eq_abs,
      mul_pow, sq_abs]
    ring
  rw [dist_eq_norm_vsub V, dist_eq_norm_vsub V, hX]
  have h1 := norm_nonneg (D -ᵥ B)
  have h2 := norm_nonneg ((D -ᵥ B) - t • (A -ᵥ B))
  have h3 : 0 ≤ t ^ 2 * ‖A -ᵥ B‖ ^ 2 := by positivity
  nlinarith

/-- Naloga 4c, pot »Drugače: z dvema trikotnikoma«: p_ABD = 8·6/2 = 24 in p = 2·24 = 48. -/
theorem n4c_trikotnika : (8 * 6 / 2 : ℝ) = 24 ∧ (2 * 24 : ℝ) = 48 := by norm_num

/-- Naloga 4c, napaka: a·b = 8·10 = 80 ≠ 48. -/
theorem n4c_napaka : (8 * 10 : ℝ) = 80 ∧ (80 : ℝ) ≠ 48 := by norm_num

/-! ## Naloga 5 -/

/-- Model pravilnega petkotnika v ℂ: ω = e^{2πi/5}, oglišča 5·ωᵏ, središče S = 0. -/
noncomputable def ω : ℂ := exp (↑(2 * Real.pi / 5) * I)

/-- Naloga 5a, pot »Drugače: z vrtenjem okoli središča«: vrtenje za ω pošlje A = 5 v B = 5ω, B v C = 5ω², …;
pet vrtenj je cel obrat (ω⁵ = 1), vsa oglišča so na krožnici s polmerom 5, in 5·∠ASB = 360° ⇔ ∠ASB = 72°. -/
theorem n5a_vrtenje : ω ^ 5 = 1 ∧ (∀ k : ℕ, ‖(5 : ℂ) * ω ^ k‖ = 5) ∧
    ∀ x : ℝ, 5 * x = 360 ↔ x = 72 := by
  refine ⟨?_, fun k => ?_, fun x => by constructor <;> intro h <;> linarith⟩
  · rw [ω, ← Complex.exp_nat_mul]
    rw [show ((5 : ℕ) : ℂ) * (↑(2 * Real.pi / 5) * I) = 2 * Real.pi * I by push_cast; ring]
    exact Complex.exp_two_pi_mul_I
  · rw [norm_mul, norm_pow, ω, Complex.norm_exp_ofReal_mul_I]; simp

/-- Naloga 5a, pot »Po korakih«: ∠ASB = 360° : 5 = 72°; v modelu je ∠ A S B za A = 5, S = 0, B = 5ω enak
72·π/180 (radiani). -/
theorem n5a : (360 / 5 : ℝ) = 72 ∧ ∠ (5 : ℂ) 0 (5 * ω) = 72 * Real.pi / 180 := by
  refine ⟨by norm_num, ?_⟩
  have hp := Real.pi_pos
  unfold EuclideanGeometry.angle
  simp only [vsub_eq_sub, sub_zero]
  rw [Complex.angle_eq_abs_arg (by norm_num) (by simp [ω, Complex.exp_ne_zero])]
  have : (5:ℂ) / (5 * ω) = exp (↑(-(2 * Real.pi / 5)) * I) := by
    rw [ω, div_mul_eq_div_div, div_self (by norm_num), one_div, ← Complex.exp_neg]; push_cast; ring_nf
  rw [this, Complex.arg_exp_mul_I, (toIocMod_eq_self _).2]
  · rw [abs_neg, abs_of_pos (by positivity)]; ring
  · constructor <;> linarith

/-- Naloga 5b, pot »Z enakokrakim trikotnikom«: trikotnik ASB z |SA| = |SB| = 5 in ∠ASB = 72° ima enaka kota
ob osnovnici, ∠SAB = (180° − 72°) : 2 = 54°; 54° + 54° = 108°. -/
theorem n5b {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (A B S : P) (hSA : dist S A = 5) (hSB : dist S B = 5)
    (hkot : ∠ A S B = 72 * Real.pi / 180) :
    ∠ S A B = (180 - 72) / 2 * Real.pi / 180 ∧ ((180 - 72) / 2 : ℝ) = 54 ∧ (54 + 54 : ℝ) = 108 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  have hAS : A ≠ S := by
    intro h; rw [h, dist_self] at hSA; norm_num at hSA
  have hsum := angle_add_angle_add_angle_eq_pi B hAS
  -- hsum : ∠ S A B + ∠ A B S + ∠ B S A = π
  have heq : ∠ S A B = ∠ S B A := angle_eq_angle_of_dist_eq (by rw [hSA, hSB])
  rw [angle_comm A B S, ← heq, angle_comm B S A, hkot] at hsum
  linarith

/-- Predpostavke trditve `n5b` se dajo izpolniti: A = 5, B = 5ω, S = 0 v ℂ (`n5a`). -/
example : ∃ A B S : ℂ, dist S A = 5 ∧ dist S B = 5 ∧ ∠ A S B = 72 * Real.pi / 180 := by
  refine ⟨5, 5 * ω, 0, by simp, ?_, n5a.2⟩
  rw [dist_comm, Complex.dist_eq, sub_zero]; simpa using n5a_vrtenje.2.1 1

/-- Naloga 5b, pot »Drugače: z vsoto notranjih kotov«: (5 − 2)·180° = 3·180° = 540° in 540° : 5 = 108°. -/
theorem n5b_vsota : ((5 - 2) * 180 : ℝ) = 3 * 180 ∧ (3 * 180 : ℝ) = 540 ∧ (540 / 5 : ℝ) = 108 := by norm_num

/-- Naloga 5b, pot »Drugače: z zunanjim kotom«: 360° : 5 = 72° in 180° − 72° = 108°. -/
theorem n5b_zunanji : (360 / 5 : ℝ) = 72 ∧ (180 - 72 : ℝ) = 108 := by norm_num

/-- Naloga 5b, napaka: z vsoto 360° bi dobili 360° : 5 = 72° ≠ 108°. -/
theorem n5b_napaka : (360 / 5 : ℝ) = 72 ∧ (72 : ℝ) ≠ 108 := by norm_num

/-- Naloga 5c, pot »Z obrazcem za dolžino loka«: 3,14·5·72/180 = 3,14·2 = 6,28, ker 5·72/180 = 360/180 = 2. -/
theorem n5c : (5 * 72 / 180 : ℚ) = 360 / 180 ∧ (360 / 180 : ℚ) = 2 ∧
    (3.14 * 5 * 72 / 180 : ℚ) = 3.14 * 2 ∧ (3.14 * 2 : ℚ) = 6.28 := by
  norm_num

/-- Naloga 5c, pot »Drugače: peti del obsega«: o = 2·3,14·5 = 31,4 in l = 31,4 : 5 = 6,28. -/
theorem n5c_obseg : (2 * 3.14 * 5 : ℚ) = 31.4 ∧ (31.4 / 5 : ℚ) = 6.28 := by norm_num

/-- Naloga 5c, meja napake: pravi lok je l = π·5·72/180 = 2π in |2π − 6,28| < 0,004 (π ≈ 3,14 je približek). -/
theorem n5c_napaka_ocena : Real.pi * 5 * 72 / 180 = 2 * Real.pi ∧ |2 * Real.pi - 6.28| < 0.004 := by
  refine ⟨by ring, ?_⟩
  have h1 := Real.pi_gt_d6
  have h2 := Real.pi_lt_d6
  rw [abs_lt]; constructor <;> linarith

/-- Naloga 5c, napaka s premerom: 3,14·10·72/180 = 12,56 = 2·6,28. -/
theorem n5c_napaka_premer : (3.14 * 10 * 72 / 180 : ℚ) = 12.56 ∧ (12.56 : ℚ) = 2 * 6.28 := by norm_num

/-- Naloga 5c, napaka »lok ni stranica«: v trikotniku ASB z |SA| = |SB| = 5 in ∠ASB = 72° je
|AB|² = 25 + 25 − 50·cos 72° = 12,5·(5 − √5), |AB| zaokroženo na desetinke je 5,9 (5,85 ≤ |AB| < 5,95) in
|AB| je krajša od loka 2π. -/
theorem n5c_stranica {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (A B S : P) (hSA : dist S A = 5) (hSB : dist S B = 5)
    (hkot : ∠ A S B = 72 * Real.pi / 180) :
    dist A B ^ 2 = 12.5 * (5 - √5) ∧ 5.85 ≤ dist A B ∧ dist A B < 5.95 ∧ dist A B < 2 * Real.pi := by
  have hcos : Real.cos (72 * Real.pi / 180) = (√5 - 1) / 4 := by
    rw [show 72 * Real.pi / 180 = 2 * (Real.pi / 5) by ring, Real.cos_two_mul, Real.cos_pi_div_five]
    have := Real.sq_sqrt (show (0:ℝ) ≤ 5 by norm_num)
    nlinarith
  have hlaw := law_cos A S B
  rw [dist_comm A S, dist_comm B S, hSA, hSB, hkot, hcos] at hlaw
  have hsq : dist A B ^ 2 = 12.5 * (5 - √5) := by rw [sq, hlaw]; ring
  have h5 := Real.sq_sqrt (show (0:ℝ) ≤ 5 by norm_num)
  have h5a : (2.236 : ℝ) < √5 := by
    rw [Real.lt_sqrt (by norm_num)]; norm_num
  have h5b : √5 < (2.2361 : ℝ) := by
    rw [Real.sqrt_lt' (by norm_num)]; norm_num
  have h0 := dist_nonneg (x := A) (y := B)
  have hp := Real.pi_gt_d6
  refine ⟨hsq, ?_, ?_, ?_⟩
  · nlinarith
  · nlinarith
  · nlinarith

/-! ## Naloga 6 -/

/-- Seznam števil naloge 6. -/
def seznam : List ℚ := [-9, -6, -2 / 3, 1, 11, 121]

/-- Naloga 6a, pot »Po definiciji«: med danimi števili je naravno praštevilo samo 11 (negativna števila in
ulomek niso naravna, 1 ni praštevilo, 121 = 11·11 je sestavljeno), zato je 11 najmanjše praštevilo. -/
theorem n6a : (121 = 11 * 11) ∧ ¬ Nat.Prime 1 ∧ ¬ Nat.Prime 121 ∧ Nat.Prime 11 ∧
    ∀ x ∈ seznam, (∃ n : ℕ, (n : ℚ) = x ∧ n.Prime) ↔ x = 11 := by
  refine ⟨by norm_num, Nat.not_prime_one, by norm_num, by norm_num, fun x hx => ?_⟩
  simp only [seznam, List.mem_cons, List.not_mem_nil, or_false] at hx
  constructor
  · rintro ⟨n, hn, hp⟩
    rcases hx with rfl|rfl|rfl|rfl|rfl|rfl
    · have := n.cast_nonneg (α := ℚ); linarith
    · have := n.cast_nonneg (α := ℚ); linarith
    · have := n.cast_nonneg (α := ℚ); linarith
    · exact absurd (by exact_mod_cast hn : n = 1) (fun h => Nat.not_prime_one (h ▸ hp))
    · rfl
    · have : n = 121 := by exact_mod_cast hn
      subst this; norm_num at hp
  · rintro rfl; exact ⟨11, by norm_num, by norm_num⟩

/-- Naloga 6b, pot »S kvadrati praštevil«: za praštevilo p je D_{p²} = {1, p, p²}; 121 = 11², D₁₂₁ =
{1, 11, 121}; 11 ima dva delitelja, 1 enega; med danimi števili ima natanko tri delitelje samo 121. -/
theorem n6b : (∀ p : ℕ, p.Prime → Nat.divisors (p ^ 2) = {1, p, p ^ 2}) ∧ 121 = 11 ^ 2 ∧
    Nat.divisors 121 = {1, 11, 121} ∧ (Nat.divisors 11).card = 2 ∧ (Nat.divisors 1).card = 1 ∧
    ∀ x ∈ seznam, (∃ n : ℕ, (n : ℚ) = x ∧ (Nat.divisors n).card = 3) ↔ x = 121 := by
  refine ⟨fun p hp => ?_, by norm_num, by decide, by decide, by decide, fun x hx => ?_⟩
  · rw [Nat.divisors_prime_pow hp]; ext d; simp [Finset.mem_range]
    constructor
    · rintro ⟨k, hk, rfl⟩; interval_cases k <;> simp
    · rintro (rfl | rfl | rfl)
      · exact ⟨0, by norm_num, by simp⟩
      · exact ⟨1, by norm_num, by simp⟩
      · exact ⟨2, by norm_num, rfl⟩
  · simp only [seznam, List.mem_cons, List.not_mem_nil, or_false] at hx
    constructor
    · rintro ⟨n, hn, hc⟩
      rcases hx with rfl|rfl|rfl|rfl|rfl|rfl
      · have := n.cast_nonneg (α := ℚ); linarith
      · have := n.cast_nonneg (α := ℚ); linarith
      · have := n.cast_nonneg (α := ℚ); linarith
      · have : n = 1 := by exact_mod_cast hn
        subst this; simp at hc
      · have : n = 11 := by exact_mod_cast hn
        subst this; revert hc; decide
      · rfl
    · rintro rfl; exact ⟨121, by norm_num, by decide⟩

/-- Naloga 6b, napaka: 9 ima tri delitelje, a −9 ni naravno število. -/
theorem n6b_napaka : (Nat.divisors 9).card = 3 ∧ ∀ n : ℕ, (n : ℚ) ≠ -9 := by
  refine ⟨by decide, fun n h => ?_⟩
  have := n.cast_nonneg (α := ℚ); linarith

/-- Naloga 6c, pot »Po razmisleku«: najmanjša vsota dveh različnih števil iz seznama je −9 + (−6) = −15 in jo
dasta samo −9 in −6; na primer −9 + (−2/3) = −9 2/3 = −29/3 je večja. -/
theorem n6c : (-9 : ℚ) + (-6) = -15 ∧ (-9 : ℚ) + (-2 / 3) = -(9 + 2 / 3) ∧ (-15 : ℚ) < -9 + (-2 / 3) ∧
    ∀ x ∈ seznam, ∀ y ∈ seznam, x ≠ y →
      (-15 ≤ x + y ∧ (x + y = -15 ↔ (x = -9 ∧ y = -6) ∨ (x = -6 ∧ y = -9))) := by
  refine ⟨by norm_num, by norm_num, by norm_num, fun x hx y hy hxy => ?_⟩
  simp only [seznam, List.mem_cons, List.not_mem_nil, or_false] at hx hy
  rcases hx with rfl|rfl|rfl|rfl|rfl|rfl <;> rcases hy with rfl|rfl|rfl|rfl|rfl|rfl <;>
    first | exact absurd rfl hxy | norm_num

/-- Naloga 6c, napaka: 121 + 11 = 132 je največja vsota dveh različnih števil iz seznama. -/
theorem n6c_napaka : (121 : ℚ) + 11 = 132 ∧ ∀ x ∈ seznam, ∀ y ∈ seznam, x ≠ y → x + y ≤ 132 := by
  refine ⟨by norm_num, fun x hx y hy hxy => ?_⟩
  simp only [seznam, List.mem_cons, List.not_mem_nil, or_false] at hx hy
  rcases hx with rfl|rfl|rfl|rfl|rfl|rfl <;> rcases hy with rfl|rfl|rfl|rfl|rfl|rfl <;>
    first | exact absurd rfl hxy | norm_num

/-- Naloga 6d, pot »Po razmisleku«: najmanjši zmnožek dveh različnih števil je −9·121 = −1089 in ga dasta samo
−9 in 121; −6·121 = −726 in −9·11 = −99 sta večja. -/
theorem n6d : (-9 : ℚ) * 121 = -1089 ∧ (-6 : ℚ) * 121 = -726 ∧ (-9 : ℚ) * 11 = -99 ∧
    (-1089 : ℚ) < -726 ∧ (-1089 : ℚ) < -99 ∧
    ∀ x ∈ seznam, ∀ y ∈ seznam, x ≠ y →
      (-1089 ≤ x * y ∧ (x * y = -1089 ↔ (x = -9 ∧ y = 121) ∨ (x = 121 ∧ y = -9))) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, fun x hx y hy hxy => ?_⟩
  simp only [seznam, List.mem_cons, List.not_mem_nil, or_false] at hx hy
  rcases hx with rfl|rfl|rfl|rfl|rfl|rfl <;> rcases hy with rfl|rfl|rfl|rfl|rfl|rfl <;>
    first | exact absurd rfl hxy | norm_num

/-- Naloga 6d, napaka: −9·(−6) = 54 je pozitiven, ni najmanjši. -/
theorem n6d_napaka : (-9 : ℚ) * (-6) = 54 ∧ (-1089 : ℚ) < 54 := by norm_num

/-- Naloga 6e, pot »Po korakih«: 121 : 11 = 11 ≠ 9; (−6) : (−2/3) = (−6)·(−3/2) = 9; to je edini par števil iz
seznama s količnikom 9. -/
theorem n6e : (121 : ℚ) / 11 = 11 ∧ (-6 : ℚ) / (-2 / 3) = 9 ∧
    ∀ x ∈ seznam, ∀ y ∈ seznam, x / y = 9 ↔ (x = -6 ∧ y = -2 / 3) := by
  refine ⟨by norm_num, ?_, fun x hx y hy => ?_⟩
  · calc (-6 : ℚ) / (-2 / 3) = (-6) * (-3 / 2) := by norm_num
      _ = 9 := by norm_num
  · simp only [seznam, List.mem_cons, List.not_mem_nil, or_false] at hx hy
    rcases hx with rfl|rfl|rfl|rfl|rfl|rfl <;> rcases hy with rfl|rfl|rfl|rfl|rfl|rfl <;> norm_num

/-- Naloga 6e, napaka: (−9) : 1 = −9 ≠ 9. -/
theorem n6e_napaka : (-9 : ℚ) / 1 = -9 ∧ (-9 : ℚ) ≠ 9 := by norm_num

/-! ## Naloga 7 -/

/-- Razdalja v prostoru (koren vsote kvadratov razlik koordinat). -/
noncomputable def d3 (p q : ℝ × ℝ × ℝ) : ℝ :=
  √((p.1 - q.1) ^ 2 + (p.2.1 - q.2.1) ^ 2 + (p.2.2 - q.2.2) ^ 2)

/-- Naloga 7a, pot »Po razmisleku«, v koordinatnem modelu iz 7c: stranska ploskev ima oglišča P = (0, 0, 8),
Q = (8, 0, 8) (osnovni rob na zgornji ploskvi kocke) in vrh V = (4, 4, 8 + √32) (`n7c_vrh`). Vse tri
stranice merijo 8, zato je ploskev enakostranični trikotnik. Je pravi trikotnik (V ne leži v ravnini z = 8,
v kateri sta P in Q, zato P, Q, V niso na eni premici) s tremi oglišči, torej ni kvadrat (kvadrat je osnovna
ploskev); ni pravokotna (8² + 8² ≠ 8²: hipotenuza bi bila daljša od katet) in ni »enakokraka, ki ni
enakostranična« (stranska robova sta enaka osnovnemu). -/
theorem n7a :
    d3 (0, 0, 8) (8, 0, 8) = 8 ∧ d3 (4, 4, 8 + √32) (0, 0, 8) = 8 ∧ d3 (4, 4, 8 + √32) (8, 0, 8) = 8 ∧
    (8 + √32 : ℝ) ≠ 8 ∧
    d3 (4, 4, 8 + √32) (0, 0, 8) = d3 (0, 0, 8) (8, 0, 8) ∧
    d3 (4, 4, 8 + √32) (8, 0, 8) = d3 (0, 0, 8) (8, 0, 8) ∧
    d3 (0, 0, 8) (8, 0, 8) ^ 2 + d3 (4, 4, 8 + √32) (0, 0, 8) ^ 2 ≠ d3 (4, 4, 8 + √32) (8, 0, 8) ^ 2 := by
  have h32 := Real.sq_sqrt (show (0:ℝ) ≤ 32 by norm_num)
  have hpos : (0:ℝ) < √32 := by positivity
  have hPQ : d3 (0, 0, 8) (8, 0, 8) = 8 := by
    unfold d3; rw [show ((0:ℝ) - 8) ^ 2 + (0 - 0) ^ 2 + (8 - 8) ^ 2 = 8 ^ 2 by norm_num,
      Real.sqrt_sq (by norm_num)]
  have hVP : d3 (4, 4, 8 + √32) (0, 0, 8) = 8 := by
    unfold d3; rw [show ((4:ℝ) - 0) ^ 2 + (4 - 0) ^ 2 + (8 + √32 - 8) ^ 2 = 8 ^ 2 by nlinarith,
      Real.sqrt_sq (by norm_num)]
  have hVQ : d3 (4, 4, 8 + √32) (8, 0, 8) = 8 := by
    unfold d3; rw [show ((4:ℝ) - 8) ^ 2 + (4 - 0) ^ 2 + (8 + √32 - 8) ^ 2 = 8 ^ 2 by nlinarith,
      Real.sqrt_sq (by norm_num)]
  refine ⟨hPQ, hVP, hVQ, by linarith, by rw [hVP, hPQ], by rw [hVQ, hPQ], ?_⟩
  rw [hPQ, hVP, hVQ]; norm_num

/-- Naloga 7b, pot »S štetjem robov«: 12 + 4 = 16 robov po 8 cm: 16·8 = 128. -/
theorem n7b : 12 + 4 = 16 ∧ 16 * 8 = 128 := by norm_num

/-- Naloga 7b, napaka: 12 + 8 = 20 in 20·8 = 160 ≠ 128. -/
theorem n7b_napaka : 12 + 8 = 20 ∧ 20 * 8 = 160 ∧ 160 ≠ 128 := by norm_num

/-- Naloga 7c, geometrija: vrh V = (4, 4, 8 + v), v > 0, nad središčem zgornje ploskve je od oglišča (0, 0, 8)
oddaljen 8 natanko tedaj, ko je v = 4√2 = √32. -/
theorem n7c_vrh (v : ℝ) (hv : 0 < v) :
    √((4 - 0) ^ 2 + (4 - 0) ^ 2 + ((8 + v) - 8) ^ 2) = 8 ↔ v = √32 := by
  have h32 : (0:ℝ) ≤ 32 := by norm_num
  constructor
  · intro h
    have h2 := Real.sq_sqrt (show (0:ℝ) ≤ (4 - 0) ^ 2 + (4 - 0) ^ 2 + ((8 + v) - 8) ^ 2 by positivity)
    rw [h] at h2
    have hv2 : v ^ 2 = 32 := by nlinarith
    rw [← hv2, Real.sqrt_sq hv.le]
  · intro h
    have hv2 : v ^ 2 = 32 := by rw [h, Real.sq_sqrt h32]
    rw [show (4 - 0 : ℝ) ^ 2 + (4 - 0) ^ 2 + ((8 + v) - 8) ^ 2 = 8 ^ 2 by nlinarith,
      Real.sqrt_sq (by norm_num)]

/-- Predpostavka trditve `n7c_vrh` se da izpolniti (v = √32 > 0). -/
example : (0 : ℝ) < √32 := by positivity

/-- Naloga 7c, pot »Po korakih«: d = a√2 = 8√2 (diagonala kvadrata, √(8² + 8²)), d/2 = 4√2,
(d/2)² = 16·2 = 32; v² = 64 − 32 = 32; v = √32 = 4√2; v ≈ 4·1,41 = 5,64; 8 + 5,64 = 13,64, zaokroženo 14.
Meje napake: |4√2 − 5,64| < 0,02 in pravo višino 8 + 4√2 Mathlibov `round` tudi zaokroži na 14. -/
theorem n7c : √((8:ℝ) ^ 2 + 8 ^ 2) = 8 * √2 ∧ 8 * √2 / 2 = 4 * √2 ∧ (4 * √2) ^ 2 = 16 * 2 ∧
    (16 * 2 : ℝ) = 32 ∧ (8 : ℝ) ^ 2 - 32 = 32 ∧ √32 = 4 * √2 ∧ (4 * 1.41 : ℚ) = 5.64 ∧
    (8 + 5.64 : ℚ) = 13.64 ∧ round (13.64 : ℚ) = 14 ∧ |4 * √2 - 5.64| < 0.02 ∧
    round (8 + 4 * √2) = 14 := by
  have h2 := Real.sq_sqrt (show (0:ℝ) ≤ 2 by norm_num)
  have h2n := Real.sqrt_nonneg 2
  have hs32 : √32 = 4 * √2 := by
    rw [show (32:ℝ) = (4 * √2) ^ 2 by nlinarith, Real.sqrt_sq (by positivity)]
  have hb1 : (1.414 : ℝ) < √2 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have hb2 : √2 < (1.415 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨?_, by ring, by nlinarith, by norm_num, by norm_num, hs32, by norm_num, by norm_num, ?_, ?_, ?_⟩
  · rw [show (8:ℝ) ^ 2 + 8 ^ 2 = (8 * √2) ^ 2 by nlinarith, Real.sqrt_sq (by positivity)]
  · rw [round_eq, Int.floor_eq_iff]; norm_num
  · rw [abs_lt]; constructor <;> linarith
  · rw [round_eq, Int.floor_eq_iff]; push_cast; constructor <;> linarith

/-- Naloga 7c, pot »Drugače: prek višine stranske ploskve«: v_s² = 8² − 4² = 64 − 16 = 48;
v² = v_s² − 4² = 48 − 16 = 32; 5,6² = 31,36 < 32 < 32,49 = 5,7², zato 5,6 < √32 < 5,7, višina telesa je
med 13,6 in 13,7 in se zaokroži na 14. -/
theorem n7c_stranska : (8 : ℝ) ^ 2 - 4 ^ 2 = 64 - 16 ∧ (64 - 16 : ℝ) = 48 ∧ (48 : ℝ) - 4 ^ 2 = 48 - 16 ∧
    (48 - 16 : ℝ) = 32 ∧ (5.6 : ℝ) ^ 2 = 31.36 ∧ (5.7 : ℝ) ^ 2 = 32.49 ∧ (5.6 : ℝ) < √32 ∧ √32 < (5.7 : ℝ) ∧
    (13.6 : ℝ) < 8 + √32 ∧ 8 + √32 < (13.7 : ℝ) ∧ round (8 + √32) = 14 := by
  have h1 : (5.6 : ℝ) < √32 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have h2 : √32 < (5.7 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, h1, h2,
    by linarith, by linarith, ?_⟩
  rw [round_eq, Int.floor_eq_iff]; push_cast; constructor <;> linarith

/-- Naloga 7c, pot »Preizkus z oceno«: 5,5² = 30,25 < 32 ⇒ v > 5,5 in višina > 13,5; 6² = 36 > 32 ⇒ v < 6 in
višina < 14; zato se višina zaokroži na 14. -/
theorem n7c_ocena : (5.5 : ℝ) ^ 2 = 30.25 ∧ (30.25 : ℝ) < 32 ∧ (5.5 : ℝ) < √32 ∧ (13.5 : ℝ) < 8 + √32 ∧
    (6 : ℝ) ^ 2 = 36 ∧ (32 : ℝ) < 36 ∧ √32 < 6 ∧ 8 + √32 < 14 ∧ round (8 + √32) = 14 := by
  have h1 : (5.5 : ℝ) < √32 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have h2 : √32 < (6 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num, by norm_num, h1, by linarith, by norm_num, by norm_num, h2, by linarith, ?_⟩
  rw [round_eq, Int.floor_eq_iff]; push_cast; constructor <;> linarith

/-- Naloga 7c, napaka: s polovico roba namesto polovice diagonale bi dobili v² = 8² − 4² = 48 in višino
8 + √48, ki se zaokroži na 15 (napačno). -/
theorem n7c_napaka : (8 : ℝ) ^ 2 - 4 ^ 2 = 48 ∧ round (8 + √48) = 15 := by
  have h1 : (6.5 : ℝ) < √48 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have h2 : √48 < (7 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num, ?_⟩
  rw [round_eq, Int.floor_eq_iff]; push_cast; constructor <;> linarith

/-! ## Naloga 8 -/

/-- Pravilo iz slik: na n-ti sliki je n² belih žetonov, … -/
def beli (n : ℕ) : ℕ := n ^ 2
/-- … 4n + 4 črnih žetonov (po n + 1 ob vsaki stranici) … -/
def crni (n : ℕ) : ℕ := 4 * n + 4
/-- … in stranica kvadrata ima n + 2 žetonov. -/
def vsi (n : ℕ) : ℕ := (n + 2) * (n + 2)

/-- Pravilo je skladno: beli + črni = vsi, (n + 2)² = n² + (4n + 4); prve štiri slike imajo 9, 16, 25, 36
žetonov. -/
theorem n8_pravilo : (∀ n, beli n + crni n = vsi n) ∧ vsi 1 = 9 ∧ vsi 2 = 16 ∧ vsi 3 = 25 ∧ vsi 4 = 36 ∧
    crni 1 = 8 ∧ beli 1 = 1 := by
  refine ⟨fun n => by simp only [beli, crni, vsi]; ring, by decide, by decide, by decide, by decide,
    by decide, by decide⟩

/-- Naloga 8a, pot »Po pravilu«: stranica 5. slike ima 5 + 2 = 7 žetonov, vseh je 7·7 = 49. -/
theorem n8a : 5 + 2 = 7 ∧ vsi 5 = 7 * 7 ∧ 7 * 7 = 49 := by decide

/-- Naloga 8a, pot »Drugače: belo in črno posebej«: 25 belih, 24 črnih, 25 + 24 = 49. -/
theorem n8a_barve : beli 5 = 25 ∧ crni 5 = 24 ∧ 25 + 24 = 49 ∧ beli 5 + crni 5 = vsi 5 := by decide

/-- Naloga 8a, napaka: 36 + 11 = 47 ≠ 49; razlike med zaporednimi slikami so 7, 9, 11, 13 (splošno 2n + 5). -/
theorem n8a_napaka : vsi 4 + 11 = 47 ∧ 47 ≠ vsi 5 ∧ vsi 2 - vsi 1 = 7 ∧ vsi 3 - vsi 2 = 9 ∧
    vsi 4 - vsi 3 = 11 ∧ vsi 5 - vsi 4 = 13 ∧ ∀ n, vsi (n + 1) = vsi n + (2 * n + 5) := by
  refine ⟨by decide, by decide, by decide, by decide, by decide, by decide, fun n => ?_⟩
  simp only [vsi]; ring

/-- Naloga 8b, pot »S splošnim pravilom«: (20 + 2)² = 22² = 484. -/
theorem n8b : vsi 20 = 22 ^ 2 ∧ 22 ^ 2 = 484 := by decide

/-- Naloga 8b, pot »Drugače: belo in črno posebej«: 20² = 400, 4·20 + 4 = 84, 400 + 84 = 484. -/
theorem n8b_barve : beli 20 = 400 ∧ crni 20 = 84 ∧ 400 + 84 = 484 := by decide

/-- Naloga 8b, napaka: 400 so le beli žetoni, ne vsi. -/
theorem n8b_napaka : (400 : ℕ) ≠ vsi 20 := by decide

/-- Naloga 8c, pot »Po pravilu«: beli 1 = 1, beli 2 = 4, beli 3 = 9, beli 13 = 13² = 169. -/
theorem n8c : beli 1 = 1 ∧ beli 2 = 4 ∧ beli 3 = 9 ∧ beli 13 = 13 ^ 2 ∧ 13 ^ 2 = 169 := by decide

/-- Naloga 8c, napaka: 15² = 225 je število vseh žetonov na 13. sliki. -/
theorem n8c_napaka : vsi 13 = 15 ^ 2 ∧ 15 ^ 2 = 225 := by decide

/-- Naloga 8d, pot »S preverjanjem možnosti«: črni : beli = 7 : 9 (9·črni = 7·beli) velja natanko na 6. sliki;
28 : 36 okrajšano s 4 je 7 : 9; 24 : 25, 32 : 49, 40 : 81 niso 7 : 9. -/
theorem n8d : (∀ n : ℕ, 9 * crni n = 7 * beli n ↔ n = 6) ∧ crni 6 = 28 ∧ beli 6 = 36 ∧ 28 / 4 = 7 ∧
    36 / 4 = 9 ∧ crni 5 = 24 ∧ beli 5 = 25 ∧ 9 * 24 ≠ 7 * 25 ∧ crni 7 = 32 ∧ beli 7 = 49 ∧
    9 * 32 ≠ 7 * 49 ∧ crni 9 = 40 ∧ beli 9 = 81 ∧ 9 * 40 ≠ 7 * 81 := by
  refine ⟨fun n => ?_, by decide, by decide, by decide, by decide, by decide, by decide, by decide,
    by decide, by decide, by decide, by decide, by decide, by decide⟩
  simp only [crni, beli]
  constructor
  · intro h
    have : n ≤ 6 := by nlinarith
    interval_cases n <;> omega
  · rintro rfl; norm_num

/-! ## Naloga 9 -/

/-- Število preskokov učencev A … J. -/
def preskoki : List ℕ := [55, 60, 64, 47, 60, 55, 60, 64, 55, 60]

/-- Naloga 9a, pot »Po korakih«: 55 trikrat, 60 štirikrat, 64 dvakrat, 47 enkrat; vsota
3·55 + 4·60 + 2·64 + 47 = 165 + 240 + 128 + 47 = 580; x̄ = 580 : 10 = 58. -/
theorem n9a : preskoki.count 55 = 3 ∧ preskoki.count 60 = 4 ∧ preskoki.count 64 = 2 ∧
    preskoki.count 47 = 1 ∧ preskoki.length = 10 ∧ preskoki.sum = 3 * 55 + 4 * 60 + 2 * 64 + 47 ∧
    3 * 55 + 4 * 60 + 2 * 64 + 47 = 165 + 240 + 128 + 47 ∧ 165 + 240 + 128 + 47 = 580 ∧
    (580 / 10 : ℚ) = 58 ∧ ((preskoki.sum : ℚ) / preskoki.length) = 58 := by
  refine ⟨by decide, by decide, by decide, by decide, by decide, by decide, by norm_num, by norm_num,
    by norm_num, ?_⟩
  simp [preskoki]; norm_num

/-- Naloga 9a, pot »Drugače: z odmiki od 60«: odmiki so −5, 0, 4, −13, 0, −5, 0, 4, −5, 0; vsota
−15 + 8 − 13 = −20, povprečni odmik −20 : 10 = −2, x̄ = 60 − 2 = 58. -/
theorem n9a_odmiki : preskoki.map (fun x => (x : ℤ) - 60) = [-5, 0, 4, -13, 0, -5, 0, 4, -5, 0] ∧
    ([-5, 0, 4, -13, 0, -5, 0, 4, -5, 0] : List ℤ).sum = -15 + 8 - 13 ∧ (-15 + 8 - 13 : ℤ) = -20 ∧
    (-20 / 10 : ℚ) = -2 ∧ (60 - 2 : ℚ) = 58 := by
  refine ⟨by decide, by decide, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 9a, napaka: povprečje različnih vrednosti (47 + 55 + 60 + 64) : 4 = 56,5 ≠ 58. -/
theorem n9a_napaka : ((47 + 55 + 60 + 64) / 4 : ℚ) = 56.5 ∧ (56.5 : ℚ) ≠ 58 := by norm_num

/-- Naloga 9b, pot »S štetjem«: 60 se pojavi štirikrat (B, E, G, J), vsaka druga vrednost manjkrat: modus je
60 (edini). -/
theorem n9b : preskoki.count 60 = 4 ∧ ∀ x : ℕ, x ≠ 60 → preskoki.count x < 4 := by
  refine ⟨by decide, fun x hx => ?_⟩
  by_cases hm : x ∈ preskoki
  · simp only [preskoki, List.mem_cons, List.not_mem_nil, or_false] at hm
    rcases hm with rfl|rfl|rfl|rfl|rfl|rfl|rfl|rfl|rfl|rfl <;> first | exact absurd rfl hx | decide
  · rw [List.count_eq_zero.2 hm]; norm_num

/-- Naloga 9c, pot »Po definiciji«: ugodna sta C in H (2 od 10), P = 2/10 = 1/5; okrajšan ulomek ima števec
1 in imenovalec 5 (krajšamo z gcd(2, 10) = 2). -/
theorem n9c : preskoki.count 64 = 2 ∧ (2 / 10 : ℚ) = 1 / 5 ∧ (2 / 10 : ℚ).num = 1 ∧ (2 / 10 : ℚ).den = 5 ∧
    Nat.gcd 2 10 = 2 := by
  refine ⟨by decide, by norm_num, ?_, ?_, by norm_num⟩
  · rw [show (2 / 10 : ℚ) = ((1 : ℤ) : ℚ) / ((5 : ℤ) : ℚ) by norm_num,
      Rat.num_div_eq_of_coprime (by norm_num) (by norm_num)]
  · rw [show (2 / 10 : ℚ) = ((1 : ℤ) : ℚ) / ((5 : ℤ) : ℚ) by norm_num]
    have h := Rat.den_div_eq_of_coprime (a := 1) (b := 5) (by norm_num) (by norm_num)
    exact_mod_cast h

/-- Naloga 9d, pot »Po korakih«: 30 % od 10 je 3; natanko trikrat se pojavi samo 55 (A, F, I), zato je
verjetnost 3/10 = 30 %. -/
theorem n9d : (30 / 100 * 10 : ℚ) = 3 ∧ (∀ x : ℕ, preskoki.count x = 3 ↔ x = 55) ∧ (3 / 10 : ℚ) = 30 / 100 := by
  refine ⟨by norm_num, fun x => ?_, by norm_num⟩
  by_cases hx : x ∈ preskoki
  · simp only [preskoki, List.mem_cons, List.not_mem_nil, or_false] at hx
    rcases hx with rfl|rfl|rfl|rfl|rfl|rfl|rfl|rfl|rfl|rfl <;> decide
  · rw [List.count_eq_zero.2 hx]; constructor <;> intro h
    · omega
    · subst h; exact absurd (by decide) hx

/-- Naloga 9d, napaka: 60 se pojavi štirikrat, verjetnost 4/10 = 40 % ≠ 30 %. -/
theorem n9d_napaka : preskoki.count 60 = 4 ∧ (4 / 10 : ℚ) = 40 / 100 ∧ (40 / 100 : ℚ) ≠ 30 / 100 := by
  refine ⟨by decide, by norm_num, by norm_num⟩

end Evklid.Pole.NPZ9_MAT_2024_redni
