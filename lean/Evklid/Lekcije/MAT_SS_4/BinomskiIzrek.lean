/-
vir: content/lessons/MAT-SS-4/binomski-izrek.md
sha256: a9d1ca3cfbf6a6978b579e6bae0017bed6cf48c24b211738c402b79225fbf448
Ni v Leanu: risbe (zemljevid, Pascalov trikotnik), simulacija »Kombinacije in binomski simbol«, analogija z
menzo in primer z vlaki kot besedilna razlaga (dokazana so le njuna števila), trditev »pri 11^5 se zatakne«
(opis prenosa pri zapisu števk; dokazan je le razvoj 11^5), vrstni red korakov v nalogi »Razvrsti korake«
(postopek, ne trditev; dokazano je število 84), ustna utemeljitev »iz vsakega oklepaja vzamemo a ali b« (dokazan
je izrek sam in štetje izbir kot moč množice podmnožic). Koeficient »pri a^(n-k)b^k« je izražen z razvojem, ki
velja v vsakem komutativnem kolobarju (torej tudi za polinome), ne z `Polynomial.coeff`.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.BinomskiIzrek

open Finset

/-! ## Razlaga 1: štetje poti -/

/-- Zakaj se tega učimo: do muzeja 4 odseke vzhodno in 4 severno vodi 70 najkrajših poti (izberemo, katere 4
od 8 korakov so severne), kar je `C(8,4) = 8!/(4!·4!) = 70`. -/
theorem poti_manhattan : #((range 8).powersetCard 4) = 70 ∧
    Nat.factorial 8 / (Nat.factorial 4 * Nat.factorial 4) = 70 := by
  refine ⟨?_, by decide⟩
  rw [card_powersetCard, card_range]; rfl

/-- Zakaj se tega učimo: v razvoju (a+b)⁸ je koeficient pred a⁴b⁴ enak 70 (člen k = 4 binomskega izreka). -/
theorem koeficient_a4b4 : Nat.choose 8 4 = 70 := by decide

/-- Razlaga 1: pot 3 vzhodno, 2 severno je določena z izbiro 2 severnih od 5 korakov: `C(5,2) = 10`
(`5!/(2!·3!) = 10`). -/
theorem poti_muzej : #((range 5).powersetCard 2) = 10 ∧
    Nat.factorial 5 / (Nat.factorial 2 * Nat.factorial 3) = 10 := by
  refine ⟨?_, by decide⟩
  rw [card_powersetCard, card_range]; rfl

/-- Razlaga 1: do križišča i odsekov vzhodno in j severno vodi `C(i+j, j)` poti; na robu je ena pot,
notranje število je vsota števila levo (od zahoda) in spodaj (od juga). -/
theorem pravilo_krizisca (i j : ℕ) :
    Nat.choose (i + 0) 0 = 1 ∧ Nat.choose (0 + j) j = 1 ∧
    Nat.choose ((i + 1) + (j + 1)) (j + 1) =
      Nat.choose (i + (j + 1)) (j + 1) + Nat.choose ((i + 1) + j) j := by
  refine ⟨by simp, by simp, ?_⟩
  have h := Nat.choose_succ_succ' (i + j + 1) j
  rw [show (i + 1) + (j + 1) = i + j + 1 + 1 by omega, h,
    show i + (j + 1) = i + j + 1 by omega, show (i + 1) + j = i + j + 1 by omega]
  ring

/-- Razlaga 1, risba: števila ob križiščih po pravilu sosedov: 3 + 3 = 6, nato 6 + 4 = 10. -/
theorem krizisca_risba : Nat.choose 4 2 = 3 + 3 ∧ Nat.choose 5 2 = 6 + 4 := by decide

/-! ## Razlaga 2: Pascalov trikotnik -/

/-- Razlaga 2, risba: vrstica 4 je 1, 4, 6, 4, 1, vrstica 5 je 1, 5, 10, 10, 5, 1, vrstica 6 je
1, 6, 15, 20, 15, 6, 1; 4 + 6 = 10. -/
theorem vrstice_4_5_6 :
    (List.range 5).map (Nat.choose 4) = [1, 4, 6, 4, 1] ∧
    (List.range 6).map (Nat.choose 5) = [1, 5, 10, 10, 5, 1] ∧
    (List.range 7).map (Nat.choose 6) = [1, 6, 15, 20, 15, 6, 1] ∧
    Nat.choose 4 1 + Nat.choose 4 2 = Nat.choose 5 2 := by decide

/-- Razlaga 2 in 5, pravilo sosedov: `C(n,k) + C(n,k+1) = C(n+1,k+1)`. -/
theorem pravilo_sosedov (n k : ℕ) : Nat.choose n k + Nat.choose n (k + 1) = Nat.choose (n + 1) (k + 1) :=
  (Nat.choose_succ_succ' n k).symm

/-- Razlaga 2, robovi: na robu vsake vrstice sta enici, `C(n,0) = C(n,n) = 1`. -/
theorem robovi (n : ℕ) : Nat.choose n 0 = 1 ∧ Nat.choose n n = 1 := by simp

/-- Razlaga 2 in 5, simetrija: `C(n,k) = C(n,n-k)` za `k ≤ n`. -/
theorem simetrija (n k : ℕ) (hk : k ≤ n) : Nat.choose n k = Nat.choose n (n - k) :=
  (Nat.choose_symm hk).symm

/-- Predpostavka trditve `simetrija` se da izpolniti. -/
example : (2 : ℕ) ≤ 5 := by norm_num

/-- Razlaga 2, vsota vrstice: `C(n,0) + … + C(n,n) = 2ⁿ`. -/
theorem vsota_vrstice (n : ℕ) : ∑ k ∈ range (n + 1), Nat.choose n k = 2 ^ n := Nat.sum_range_choose n

/-- Razlaga 2: 1 + 6 + 15 + 20 + 15 + 6 + 1 = 64 = 2⁶ (vrstica 6). -/
theorem vsota_vrstice_6 : 1 + 6 + 15 + 20 + 15 + 6 + 1 = 64 ∧ (64 : ℕ) = 2 ^ 6 := by norm_num

/-- Razlaga 2, »Premisli«: vrstica 7 je 1, 7, 21, 35, 35, 21, 7, 1 (6 + 15 = 21, 15 + 20 = 35), njena vsota je
2⁷ = 128, dvakratnik vsote vrstice 6. -/
theorem vrstica_7 :
    (List.range 8).map (Nat.choose 7) = [1, 7, 21, 35, 35, 21, 7, 1] ∧ 6 + 15 = 21 ∧ 15 + 20 = 35 ∧
    ∑ k ∈ range 8, Nat.choose 7 k = 128 ∧ (128 : ℕ) = 2 ^ 7 ∧ (128 : ℕ) = 2 * 64 := by decide

/-! ## Razlaga 3 in 4: razvoj potenc -/

/-- Razlaga 3: (V+S)² = VV + VS + SV + SS, tudi ko vrstni red šteje (nekomutativni kolobar). -/
theorem kvadrat_poti {R : Type*} [Ring R] (V S : R) : (V + S) ^ 2 = V * V + V * S + S * V + S * S := by
  rw [sq]; noncomm_ring

/-- Razlaga 3: (V+S)² = VV + VS + SV + SS = V² + 2VS + S² (komutativno). -/
theorem kvadrat {R : Type*} [CommRing R] (V S : R) : (V + S) ^ 2 = V ^ 2 + 2 * V * S + S ^ 2 := by
  calc (V + S) ^ 2 = V * V + V * S + S * V + S * S := kvadrat_poti V S
    _ = V ^ 2 + 2 * V * S + S ^ 2 := by ring

/-- Razlaga 4: (a+b)⁴ = a⁴ + 4a³b + 6a²b² + 4ab³ + b⁴. -/
theorem cetrta_potenca {R : Type*} [CommRing R] (a b : R) :
    (a + b) ^ 4 = a ^ 4 + 4 * a ^ 3 * b + 6 * a ^ 2 * b ^ 2 + 4 * a * b ^ 3 + b ^ 4 := by ring

/-! ## Razlaga 5: binomski izrek -/

/-- Razlaga 5 (in Povzetek, Ustno vprašanje 1): binomski izrek
`(a+b)ⁿ = Σ_{k=0}^{n} C(n,k)·a^(n-k)·b^k`. -/
theorem binomski_izrek {R : Type*} [CommRing R] (a b : R) (n : ℕ) :
    (a + b) ^ n = ∑ k ∈ range (n + 1), (Nat.choose n k : R) * a ^ (n - k) * b ^ k := by
  rw [add_comm a b, add_pow]
  refine sum_congr rfl fun k _ => ?_
  ring

/-- Razlaga 4: razvoj ima n + 1 členov (k teče od 0 do n). -/
theorem stevilo_clenov (n : ℕ) : #(range (n + 1)) = n + 1 := card_range _

/-- Razlaga 4: v vsakem členu je vsota eksponentov (n − k) + k enaka n. -/
theorem vsota_eksponentov (n k : ℕ) (hk : k ∈ range (n + 1)) : (n - k) + k = n := by
  rw [mem_range] at hk; omega

/-- Predpostavka trditve `vsota_eksponentov` se da izpolniti. -/
example : (2 : ℕ) ∈ range (5 + 1) := by decide

/-- Razlaga 5 (in Povzetek): binomski simbol je `C(n,k) = n!/(k!·(n−k)!)` za `k ≤ n` (deljenje je točno). -/
theorem binomski_simbol (n k : ℕ) (hk : k ≤ n) :
    Nat.choose n k = Nat.factorial n / (Nat.factorial k * Nat.factorial (n - k)) ∧
    Nat.choose n k * (Nat.factorial k * Nat.factorial (n - k)) = Nat.factorial n := by
  refine ⟨Nat.choose_eq_factorial_div_factorial hk, ?_⟩
  rw [← mul_assoc]; exact Nat.choose_mul_factorial_mul_factorial hk

/-- Predpostavka trditve `binomski_simbol` se da izpolniti. -/
example : (2 : ℕ) ≤ 5 := by norm_num

/-- Razlaga 5: binomski simbol `C(n,k)` je število izborov k elementov izmed n (kombinacij). -/
theorem binomski_simbol_steje (n k : ℕ) : #((range n).powersetCard k) = Nat.choose n k := by
  rw [card_powersetCard, card_range]

/-- Razlaga 5 (simulacija): `C(5,2) = 10 = C(5,3)`. -/
theorem simulacija_5_2 : Nat.choose 5 2 = 10 ∧ Nat.choose 5 3 = 10 := by decide

/-! ## Razlaga 6: dvočlenik z minusom -/

/-- Razlaga 6: `(a−b)ⁿ = (a+(−b))ⁿ = Σ (−1)^k·C(n,k)·a^(n−k)·b^k` (predznaki se izmenjujejo). -/
theorem binomski_izrek_minus {R : Type*} [CommRing R] (a b : R) (n : ℕ) :
    (a - b) ^ n = ∑ k ∈ range (n + 1), (-1) ^ k * (Nat.choose n k : R) * a ^ (n - k) * b ^ k := by
  rw [sub_eq_add_neg, binomski_izrek]
  refine sum_congr rfl fun k _ => ?_
  rw [neg_pow]; ring

/-- Razlaga 6: (a−b)³ = a³ − 3a²b + 3ab² − b³. -/
theorem tretja_minus {R : Type*} [CommRing R] (a b : R) :
    (a - b) ^ 3 = a ^ 3 - 3 * a ^ 2 * b + 3 * a * b ^ 2 - b ^ 3 := by ring

/-- Razlaga 6, »Premisli«: vsota koeficientov razvoja (x−1)⁷ je (1−1)⁷ = 0, tj.
`Σ C(7,k)·(−1)^(7−k) = 0`. -/
theorem vsota_koeficientov_x_minus_1 :
    ∑ k ∈ range 8, (Nat.choose 7 k : ℤ) * (-1) ^ (7 - k) = 0 ∧ ((1 : ℤ) - 1) ^ 7 = 0 := by
  refine ⟨?_, by norm_num⟩
  simp only [sum_range_succ, sum_range_zero]
  norm_num [Nat.choose]

/-! ## Rešeni primeri -/

/-- Primer 1: `C(6,2) = 6·5/2 = 15` (izberemo 2 severna od 6 korakov). -/
theorem primer1 : Nat.choose 6 2 = 6 * 5 / 2 ∧ 6 * 5 / 2 = 15 := by decide

/-- Primer 1: v razvoju (V+S)⁶ je koeficient pri V⁴S² enak 15 (vrstica 6 Pascalovega trikotnika). -/
theorem primer1_razvoj {R : Type*} [CommRing R] (V S : R) :
    (V + S) ^ 6 = V ^ 6 + 6 * V ^ 5 * S + 15 * V ^ 4 * S ^ 2 + 20 * V ^ 3 * S ^ 3 + 15 * V ^ 2 * S ^ 4 +
      6 * V * S ^ 5 + S ^ 6 := by ring

/-- Primer 2: (x−2)⁵ po korakih: koeficienti 1, 5, 10, 10, 5, 1, potence −2 so 1, −2, 4, −8, 16, −32, zmnožki
−10, 40, −80, 80; rezultat x⁵ − 10x⁴ + 40x³ − 80x² + 80x − 32. -/
theorem primer2 {R : Type*} [CommRing R] (x : R) :
    (x - 2) ^ 5 = x ^ 5 - 10 * x ^ 4 + 40 * x ^ 3 - 80 * x ^ 2 + 80 * x - 32 := by
  calc (x - 2) ^ 5 = (x + (-2)) ^ 5 := by rw [sub_eq_add_neg]
    _ = 1 * x ^ 5 + 5 * x ^ 4 * (-2) + 10 * x ^ 3 * (-2) ^ 2 + 10 * x ^ 2 * (-2) ^ 3 +
          5 * x * (-2) ^ 4 + 1 * (-2) ^ 5 := by ring
    _ = x ^ 5 + 5 * x ^ 4 * (-2) + 10 * x ^ 3 * 4 + 10 * x ^ 2 * (-8) + 5 * x * 16 + (-32) := by ring
    _ = x ^ 5 + (5 * (-2)) * x ^ 4 + (10 * 4) * x ^ 3 + (10 * (-8)) * x ^ 2 + (5 * 16) * x - 32 := by ring
    _ = x ^ 5 - 10 * x ^ 4 + 40 * x ^ 3 - 80 * x ^ 2 + 80 * x - 32 := by ring

/-- Primer 2: potence b = −2 in zmnožki s koeficienti. -/
theorem primer2_potence :
    ((-2 : ℤ) ^ 0, (-2 : ℤ) ^ 1, (-2 : ℤ) ^ 2, (-2 : ℤ) ^ 3, (-2 : ℤ) ^ 4, (-2 : ℤ) ^ 5) =
      (1, -2, 4, -8, 16, -32) ∧
    (5 : ℤ) * (-2) = -10 ∧ (10 : ℤ) * 4 = 40 ∧ (10 : ℤ) * (-8) = -80 ∧ (5 : ℤ) * 16 = 80 := by norm_num

/-- Primer 2, preizkus: pri x = 1 je (−1)⁵ = −1 in 1 − 10 + 40 − 80 + 80 − 32 = −1. -/
theorem primer2_preizkus : ((1 : ℤ) - 2) ^ 5 = -1 ∧ (1 : ℤ) - 10 + 40 - 80 + 80 - 32 = -1 := by norm_num

/-- Primer 3, formula in korak 1: splošni člen razvoja (x² − 2/x)⁶ je
`C(6,k)·(x²)^(6−k)·(−2/x)^k = C(6,k)·(−2)^k·x^(12−3k)` (x ≠ 0, k ≤ 6). -/
theorem primer3_splosni (x : ℝ) (hx : x ≠ 0) (k : ℕ) (hk : k ≤ 6) :
    (Nat.choose 6 k : ℝ) * (x ^ 2) ^ (6 - k) * (-2 / x) ^ k =
      (Nat.choose 6 k : ℝ) * (-2) ^ k * x ^ ((12 : ℤ) - 3 * k) := by
  have e : ((12 : ℤ) - 3 * k) = ((2 * (6 - k) : ℕ) : ℤ) - (k : ℤ) := by omega
  rw [e, zpow_sub₀ hx, zpow_natCast, zpow_natCast, ← pow_mul, div_pow]
  ring

/-- Predpostavke trditve `primer3_splosni` se dajo izpolniti. -/
example : (1 : ℝ) ≠ 0 ∧ (4 : ℕ) ≤ 6 := by norm_num

/-- Primer 3, korak 2 in 4: eksponent 12 − 3k je 0 natanko pri k = 4 in 3 natanko pri k = 3. -/
theorem primer3_eksponent (k : ℕ) : ((12 : ℤ) - 3 * k = 0 ↔ k = 4) ∧ ((12 : ℤ) - 3 * k = 3 ↔ k = 3) := by
  constructor <;> constructor <;> intro h <;> omega

/-- Primer 3, korak 3 in 4: `T₅ = C(6,4)·(−2)⁴ = 15·16 = 240`, koeficient pri x³ je `C(6,3)·(−2)³ = 20·(−8) = −160`. -/
theorem primer3 :
    (Nat.choose 6 4 : ℤ) * (-2) ^ 4 = 15 * 16 ∧ (15 : ℤ) * 16 = 240 ∧
    (Nat.choose 6 3 : ℤ) * (-2) ^ 3 = 20 * (-8) ∧ (20 : ℤ) * (-8) = -160 := by decide

/-- Primer 3 (RAČUN): celoten razvoj
(x² − 2/x)⁶ = x¹² − 12x⁹ + 60x⁶ − 160x³ + 240 − 192/x³ + 64/x⁶ (x ≠ 0); člen brez x je 240. -/
theorem primer3_razvoj (x : ℝ) (hx : x ≠ 0) :
    (x ^ 2 - 2 / x) ^ 6 =
      x ^ 12 - 12 * x ^ 9 + 60 * x ^ 6 - 160 * x ^ 3 + 240 - 192 / x ^ 3 + 64 / x ^ 6 := by
  field_simp
  ring

/-- Predpostavka trditve `primer3_razvoj` se da izpolniti. -/
example : (1 : ℝ) ≠ 0 := one_ne_zero

/-- Primer 4: koeficient pri x³ v (2x−1)⁵: k = 2 (5 − k = 3), `C(5,2)·2³·(−1)² = 10·8·1 = 80`; (2x)³ = 8x³. -/
theorem primer4 :
    (∀ k : ℕ, 5 - k = 3 ∧ k ≤ 5 ↔ k = 2) ∧
    (Nat.choose 5 2 : ℤ) * 2 ^ 3 * (-1) ^ 2 = 10 * 8 * 1 ∧ (10 : ℤ) * 8 * 1 = 80 := by
  refine ⟨fun k => by omega, by decide, by norm_num⟩

/-- Primer 4: (2x)³ = 8x³ in celoten razvoj (2x−1)⁵ = 32x⁵ − 80x⁴ + 80x³ − 40x² + 10x − 1 (koeficient pri x³ je 80). -/
theorem primer4_razvoj {R : Type*} [CommRing R] (x : R) :
    (2 * x) ^ 3 = 8 * x ^ 3 ∧
    (2 * x - 1) ^ 5 = 32 * x ^ 5 - 80 * x ^ 4 + 80 * x ^ 3 - 40 * x ^ 2 + 10 * x - 1 := by
  constructor <;> ring

/-! ## Pogoste napake -/

/-- Pogoste napake: (a+b)³ = a³ + b³ ne velja (pri a = b = 1 je 8 ≠ 2). -/
theorem potenca_se_ne_razdeli : ¬ ∀ a b : ℤ, (a + b) ^ 3 = a ^ 3 + b ^ 3 := by
  intro h; have := h 1 1; norm_num at this

/-- Pogoste napake: pri (2x−1)⁵ napačni »2x³« da 10·2 = 20 namesto 80. -/
theorem napaka_2x3 : (Nat.choose 5 2 : ℤ) * 2 = 20 ∧ (20 : ℤ) ≠ 80 := by decide

/-- Pogoste napake in »Preveri se«: pri (x+3)⁵ je koeficient pri x³ `C(5,2)·3² = 10·9 = 90`, ne 10;
celoten razvoj (x+3)⁵ = x⁵ + 15x⁴ + 90x³ + 270x² + 405x + 243. -/
theorem koeficient_x_plus_3 {R : Type*} [CommRing R] (x : R) :
    (Nat.choose 5 2 : ℤ) * 3 ^ 2 = 10 * 9 ∧ (10 : ℤ) * 9 = 90 ∧
    (x + 3) ^ 5 = x ^ 5 + 15 * x ^ 4 + 90 * x ^ 3 + 270 * x ^ 2 + 405 * x + 243 := by
  refine ⟨by decide, by norm_num, by ring⟩

/-! ## Za maturo -/

/-- Naloga 1: (1+√2)⁴ = 1 + 4√2 + 6(√2)² + 4(√2)³ + (√2)⁴ = 1 + 4√2 + 12 + 8√2 + 4 = 17 + 12√2. -/
theorem naloga1 : (1 + Real.sqrt 2) ^ 4 = 17 + 12 * Real.sqrt 2 := by
  have s2 : Real.sqrt 2 ^ 2 = 2 := Real.sq_sqrt (by norm_num)
  calc (1 + Real.sqrt 2) ^ 4
      = 1 + 4 * Real.sqrt 2 + 6 * Real.sqrt 2 ^ 2 + 4 * Real.sqrt 2 ^ 3 + Real.sqrt 2 ^ 4 := by ring
    _ = 1 + 4 * Real.sqrt 2 + 12 + 8 * Real.sqrt 2 + 4 := by
        rw [show Real.sqrt 2 ^ 3 = Real.sqrt 2 ^ 2 * Real.sqrt 2 by ring,
          show Real.sqrt 2 ^ 4 = (Real.sqrt 2 ^ 2) ^ 2 by ring, s2]; ring
    _ = 17 + 12 * Real.sqrt 2 := by ring

/-- Naloga 2 a), korak 1: splošni člen (1+2x)ⁿ je `C(n,k)·1^(n−k)·(2x)^k = C(n,k)·2^k·x^k`. -/
theorem naloga2_splosni {R : Type*} [CommRing R] (x : R) (n k : ℕ) :
    (Nat.choose n k : R) * 1 ^ (n - k) * (2 * x) ^ k = (Nat.choose n k : R) * 2 ^ k * x ^ k := by ring

/-- Naloga 2 a), korak 2 in 3 (RAČUN `resi`): 4·n(n−1)/2 = 112 ⇔ n(n−1) = 56 ⇔ n² − n − 56 = 0
⇔ (n−8)(n+7) = 0 ⇔ n = −7 ali n = 8 (realna rešitev). -/
theorem naloga2_enacba (n : ℝ) : 4 * n * (n - 1) / 2 = 112 ↔ n = -7 ∨ n = 8 := by
  calc 4 * n * (n - 1) / 2 = 112 ↔ n * (n - 1) = 56 := by
        constructor <;> intro h
        · linear_combination h / 2
        · linear_combination 2 * h
    _ ↔ n ^ 2 - n - 56 = 0 := by constructor <;> intro h <;> linear_combination h
    _ ↔ (n - 8) * (n + 7) = 0 := by constructor <;> intro h <;> linear_combination h
    _ ↔ n = 8 ∨ n = -7 := by rw [mul_eq_zero, sub_eq_zero, add_eq_zero_iff_eq_neg]
    _ ↔ n = -7 ∨ n = 8 := or_comm

/-- Naloga 2 a), korak 3: med naravnimi števili je koeficient `C(n,2)·2² = 112` natanko pri n = 8. -/
theorem naloga2_a (n : ℕ) : Nat.choose n 2 * 2 ^ 2 = 112 ↔ n = 8 := by
  constructor
  · intro h
    have hn : n < 10 := by
      by_contra h'
      have h1 := Nat.choose_le_choose 2 (not_lt.mp h')
      have h2 : Nat.choose 10 2 = 45 := by decide
      omega
    interval_cases n <;> first | rfl | (revert h; decide)
  · rintro rfl; decide

/-- Naloga 2 b): razvoj (1+2x)⁸ ima 9 členov, srednji je peti (k = 4):
`T₅ = C(8,4)·(2x)⁴ = 70·16x⁴ = 1120x⁴`. -/
theorem naloga2_b {R : Type*} [CommRing R] (x : R) :
    8 + 1 = 9 ∧ (Nat.choose 8 4 : R) * 1 ^ 4 * (2 * x) ^ 4 = 70 * (16 * x ^ 4) ∧
    (70 : R) * (16 * x ^ 4) = 1120 * x ^ 4 := by
  refine ⟨rfl, ?_, by ring⟩
  rw [show Nat.choose 8 4 = 70 by decide]; push_cast; ring

/-- Naloga 2 c): vsota koeficientov je (1 + 2·1)⁸ = 3⁸ = 6561, tj. `Σ C(8,k)·2^k = 6561`. -/
theorem naloga2_c : ((1 : ℤ) + 2 * 1) ^ 8 = 3 ^ 8 ∧ (3 : ℤ) ^ 8 = 6561 ∧
    ∑ k ∈ range 9, (Nat.choose 8 k : ℤ) * 2 ^ k = 6561 := by
  refine ⟨by norm_num, by norm_num, by decide⟩

/-- Naloga 2 (RAČUN): `8!/(2!·6!)·2² = 112`, `8!/(4!·4!)·2⁴ = 1120`. -/
theorem naloga2_racun : Nat.factorial 8 / (Nat.factorial 2 * Nat.factorial 6) * 2 ^ 2 = 112 ∧
    Nat.factorial 8 / (Nat.factorial 4 * Nat.factorial 4) * 2 ^ 4 = 1120 := by decide

/-- Ustno vprašanje 3: pri a = b = 1 binomski izrek da `C(n,0) + … + C(n,n) = (1+1)ⁿ = 2ⁿ`. -/
theorem ustno3 (n : ℕ) : ∑ k ∈ range (n + 1), (Nat.choose n k : ℤ) = (1 + 1) ^ n ∧ ((1 : ℤ) + 1) ^ n = 2 ^ n := by
  refine ⟨?_, by norm_num⟩
  rw [binomski_izrek]; simp

/-! ## Drugače: iz vsakdanjega življenja -/

/-- Vlaki: 2⁵ = 32 = 1 + 5 + 10 + 10 + 5 + 1, natanko 2 ekspresna vlaka: `C(5,2) = 10`. -/
theorem vlaki : (2 : ℕ) ^ 5 = 32 ∧ 1 + 5 + 10 + 10 + 5 + 1 = 32 ∧ Nat.choose 5 2 = 10 := by decide

/-- 11² = 121, 11³ = 1331, 11⁴ = 14641 = (10+1)⁴ = 1·10⁴ + 4·10³ + 6·10² + 4·10 + 1; pri 11⁵ je
1·10⁵ + 5·10⁴ + 10·10³ + 10·10² + 5·10 + 1 = 161051. -/
theorem enajst :
    (11 : ℕ) ^ 2 = 121 ∧ (11 : ℕ) ^ 3 = 1331 ∧ (11 : ℕ) ^ 4 = 14641 ∧
    (10 + 1 : ℕ) ^ 4 = 1 * 10 ^ 4 + 4 * 10 ^ 3 + 6 * 10 ^ 2 + 4 * 10 + 1 ∧
    (11 : ℕ) ^ 5 = 1 * 10 ^ 5 + 5 * 10 ^ 4 + 10 * 10 ^ 3 + 10 * 10 ^ 2 + 5 * 10 + 1 ∧
    (11 : ℕ) ^ 5 = 161051 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 1: do C (2 vzhodno, 2 severno) vodi `C(4,2) = 6` najkrajših poti. -/
theorem kviz1 : #((range 4).powersetCard 2) = 6 := by rw [card_powersetCard, card_range]; rfl

/-- Preveri se 2: splošni člen (x + 1/x²)⁹ je `C(9,k)·x^(9−k)·(1/x²)^k = C(9,k)·x^(9−3k)`; eksponent 0 da
k = 3 in člen `C(9,3) = 9!/(3!·6!) = 84`. -/
theorem kviz2 (x : ℝ) (hx : x ≠ 0) (k : ℕ) (hk : k ≤ 9) :
    (Nat.choose 9 k : ℝ) * x ^ (9 - k) * (1 / x ^ 2) ^ k = (Nat.choose 9 k : ℝ) * x ^ ((9 : ℤ) - 3 * k) ∧
    ((9 : ℤ) - 3 * k = 0 ↔ k = 3) ∧ Nat.choose 9 3 = 84 ∧
    Nat.factorial 9 / (Nat.factorial 3 * Nat.factorial 6) = 84 := by
  refine ⟨?_, by omega, by decide, by decide⟩
  have e : ((9 : ℤ) - 3 * k) = ((9 - k : ℕ) : ℤ) - ((2 * k : ℕ) : ℤ) := by omega
  rw [e, zpow_sub₀ hx, zpow_natCast, zpow_natCast, div_pow, one_pow, ← pow_mul]
  ring

/-- Predpostavke trditve `kviz2` se dajo izpolniti. -/
example : (1 : ℝ) ≠ 0 ∧ (3 : ℕ) ≤ 9 := by norm_num

/-- Preveri se 3: (a−b)⁶ = a⁶ − 6a⁵b + 15a⁴b² − 20a³b³ + 15a²b⁴ − 6ab⁵ + b⁶ (predznaki se izmenjujejo). -/
theorem kviz3 {R : Type*} [CommRing R] (a b : R) :
    (a - b) ^ 6 = a ^ 6 - 6 * a ^ 5 * b + 15 * a ^ 4 * b ^ 2 - 20 * a ^ 3 * b ^ 3 + 15 * a ^ 2 * b ^ 4 -
      6 * a * b ^ 5 + b ^ 6 := by ring

/-- Preveri se 4: koeficient pri x³ v (x+3)⁵: 5 − k = 3 da k = 2, `C(5,2)·3² = 90`; napačni odgovori:
10 = C(5,2), 30 = C(5,2)·3, 270 = C(5,3)·3³. -/
theorem kviz4 : (Nat.choose 5 2 : ℤ) * 3 ^ 2 = 90 ∧ (Nat.choose 5 2 : ℤ) * 3 = 30 ∧
    (Nat.choose 5 3 : ℤ) * 3 ^ 3 = 270 := by decide

/-- Preveri se 5: splošni člen (2x − 1/x)⁶ je `C(6,k)·(2x)^(6−k)·(−1/x)^k = C(6,k)·2^(6−k)·(−1)^k·x^(6−2k)`;
6 − 2k = 0 da k = 3, člen `20·8·(−1) = −160`. -/
theorem kviz5 (x : ℝ) (hx : x ≠ 0) (k : ℕ) (hk : k ≤ 6) :
    (Nat.choose 6 k : ℝ) * (2 * x) ^ (6 - k) * (-1 / x) ^ k =
      (Nat.choose 6 k : ℝ) * 2 ^ (6 - k) * (-1) ^ k * x ^ ((6 : ℤ) - 2 * k) ∧
    ((6 : ℤ) - 2 * k = 0 ↔ k = 3) ∧
    (Nat.choose 6 3 : ℤ) * 2 ^ 3 * (-1) ^ 3 = 20 * 8 * (-1) ∧ (20 : ℤ) * 8 * (-1) = -160 := by
  refine ⟨?_, by omega, by decide, by norm_num⟩
  have e : ((6 : ℤ) - 2 * k) = ((6 - k : ℕ) : ℤ) - (k : ℤ) := by omega
  rw [e, zpow_sub₀ hx, zpow_natCast, zpow_natCast, div_pow, mul_pow]
  ring

/-- Predpostavke trditve `kviz5` se dajo izpolniti. -/
example : (1 : ℝ) ≠ 0 ∧ (3 : ℕ) ≤ 6 := by norm_num

/-- Preveri se 5: celoten razvoj (2x − 1/x)⁶ = 64x⁶ − 192x⁴ + 240x² − 160 + 60/x² − 12/x⁴ + 1/x⁶ (x ≠ 0). -/
theorem kviz5_razvoj (x : ℝ) (hx : x ≠ 0) :
    (2 * x - 1 / x) ^ 6 = 64 * x ^ 6 - 192 * x ^ 4 + 240 * x ^ 2 - 160 + 60 / x ^ 2 - 12 / x ^ 4 + 1 / x ^ 6 := by
  field_simp
  ring

/-- Predpostavka trditve `kviz5_razvoj` se da izpolniti. -/
example : (1 : ℝ) ≠ 0 := one_ne_zero

/-- RAČUN: `10·2³·(−1)² = 80`, `10·3² = 90`, `20·2³·(−1)³ = −160`, `6·5/2 = 15`. -/
theorem racun : (10 : ℤ) * 2 ^ 3 * (-1) ^ 2 = 80 ∧ (10 : ℤ) * 3 ^ 2 = 90 ∧
    (20 : ℤ) * 2 ^ 3 * (-1) ^ 3 = -160 ∧ (6 : ℚ) * 5 / 2 = 15 := by norm_num

end Evklid.Lekcije.MAT_SS_4.BinomskiIzrek
