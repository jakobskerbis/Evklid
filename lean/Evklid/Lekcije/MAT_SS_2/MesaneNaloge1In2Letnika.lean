/-
vir: content/lessons/MAT-SS-2/mesane-naloge-1-in-2-letnika.md
sha256: 74192ce78fd63d195d5d0560027787cfd7528b5c4fb72ca9ee2c58ca20b8f435
Ni v Leanu: zgodovina (Napier, Kepler), risbe, simulacija, preglednica »v besedilu → orodje« in postopek štirih
korakov (navodila; dokazana je formula za teme −b/(2a)), analogija z zdravnikom, Preveri se 5 (vrstni red korakov),
točkovanje; trditev iz Premisli 1, da 0,15 »ne znamo zapisati« kot potenco števila 1/2 (pedagoška, ne
matematična); trditev »ekvivalentni so koraki, ki jih lahko obrneš« (opis).
Lean definira log x = log |x| za x ≠ 0 in log 0 = 0, zato so logaritemske enačbe zapisane le na definicijskem
območju (npr. x > 2), kjer jih lekcija rešuje. Koti so v radianih (θ° = θ·π/180), »≈ a« na k decimalk je
|vrednost − a| < ½·10⁻ᵏ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.MesaneNaloge1In2Letnika

open Real Set

/-! ## Pomožne numerične ocene (Taylorjev polinom stopnje 9 z ostankom, kot v `MAT_SS_3`) -/

/-- Pomožna trditev (Taylor z ostankom iz `Complex.exp_bound`, n = 10): za `|x| ≤ 1` sta `cos x` in `sin x`
oddaljena od Taylorjevih polinomov največ `|x|¹⁰·11/36288000`.
pomozno -/
theorem taylor_sin_cos (x : ℝ) (hx : |x| ≤ 1) :
    |Real.cos x - (1 - x ^ 2 / 2 + x ^ 4 / 24 - x ^ 6 / 720 + x ^ 8 / 40320)| ≤ |x| ^ 10 * (11 / 36288000) ∧
    |Real.sin x - (x - x ^ 3 / 6 + x ^ 5 / 120 - x ^ 7 / 5040 + x ^ 9 / 362880)| ≤
      |x| ^ 10 * (11 / 36288000) := by
  have hb := Complex.exp_bound (x := (x : ℂ) * Complex.I) (by simpa using hx) (n := 10) (by norm_num)
  have h2 : Complex.I ^ 2 = -1 := Complex.I_sq
  have h3 : Complex.I ^ 3 = -Complex.I := by rw [pow_succ, h2]; ring
  have h4 : Complex.I ^ 4 = 1 := by rw [pow_succ, h3]; ring_nf; rw [h2]; ring
  have h5 : Complex.I ^ 5 = Complex.I := by rw [pow_succ, h4, one_mul]
  have h6 : Complex.I ^ 6 = -1 := by rw [pow_succ, h5, Complex.I_mul_I]
  have h7 : Complex.I ^ 7 = -Complex.I := by rw [pow_succ, h6]; ring
  have h8 : Complex.I ^ 8 = 1 := by rw [pow_succ, h7]; ring_nf; rw [h2]; ring
  have h9 : Complex.I ^ 9 = Complex.I := by rw [pow_succ, h8, one_mul]
  have hsum : ∑ m ∈ Finset.range 10, ((x : ℂ) * Complex.I) ^ m / (m.factorial : ℂ) =
      ((1 - x ^ 2 / 2 + x ^ 4 / 24 - x ^ 6 / 720 + x ^ 8 / 40320 : ℝ) : ℂ) +
      ((x - x ^ 3 / 6 + x ^ 5 / 120 - x ^ 7 / 5040 + x ^ 9 / 362880 : ℝ) : ℂ) * Complex.I := by
    simp only [Finset.sum_range_succ, Finset.sum_range_zero, mul_pow, h2, h3, h4, h5, h6, h7, h8, h9,
      Nat.factorial]
    push_cast
    ring
  rw [hsum, Complex.exp_ofReal_mul_I] at hb
  have hn : ‖(x : ℂ) * Complex.I‖ = |x| := by simp
  rw [hn] at hb
  have e : (Real.cos x : ℂ) + (Real.sin x : ℂ) * Complex.I -
      (((1 - x ^ 2 / 2 + x ^ 4 / 24 - x ^ 6 / 720 + x ^ 8 / 40320 : ℝ) : ℂ) +
      ((x - x ^ 3 / 6 + x ^ 5 / 120 - x ^ 7 / 5040 + x ^ 9 / 362880 : ℝ) : ℂ) * Complex.I) =
      ((Real.cos x - (1 - x ^ 2 / 2 + x ^ 4 / 24 - x ^ 6 / 720 + x ^ 8 / 40320) : ℝ) : ℂ) +
      ((Real.sin x - (x - x ^ 3 / 6 + x ^ 5 / 120 - x ^ 7 / 5040 + x ^ 9 / 362880) : ℝ) : ℂ) *
        Complex.I := by push_cast; ring
  rw [e] at hb
  have hk : |x| ^ 10 * ((Nat.succ 10 : ℕ) * ((Nat.factorial 10 : ℕ) * (10 : ℕ) : ℝ)⁻¹) =
      |x| ^ 10 * (11 / 36288000) := by norm_num [Nat.factorial]
  rw [hk] at hb
  constructor
  · refine le_trans (le_of_eq ?_) ((Complex.abs_re_le_norm _).trans hb)
    rw [Complex.add_re, Complex.ofReal_re, Complex.re_ofReal_mul, Complex.I_re, mul_zero, add_zero]
  · refine le_trans (le_of_eq ?_) ((Complex.abs_im_le_norm _).trans hb)
    rw [Complex.add_im, Complex.ofReal_im, Complex.im_ofReal_mul, Complex.I_im, mul_one, zero_add]

/-- Predpostavke trditve `taylor_sin_cos` se dajo izpolniti (`x = 0`). -/
example : |(0:ℝ)| ≤ 1 := by norm_num

/-- Pomožna trditev: `|π − 3,1415926536| ≤ 10⁻¹⁰` (iz `pi_gt_d20`, `pi_lt_d20`).
pomozno -/
theorem pi_blizu : |π - 3.1415926536| ≤ 1 / 10 ^ 10 := by
  have h1 := pi_gt_d20
  have h2 := pi_lt_d20
  rw [abs_le]; constructor <;> norm_num at * <;> linarith

/-- Pomožna trditev: `cos` pri kotu `θ°` (`0 ≤ θ ≤ 57`) je blizu Taylorjevega polinoma v
`q = θ·3,1415926536/180`.
pomozno -/
theorem cos_stopinj (θ q : ℝ) (hq : q = θ * 3.1415926536 / 180) (h0 : 0 ≤ θ) (h1 : θ ≤ 57) :
    |Real.cos (θ * π / 180) - (1 - q ^ 2 / 2 + q ^ 4 / 24 - q ^ 6 / 720 + q ^ 8 / 40320)| ≤
      θ / 180 * (1 / 10 ^ 10) + q ^ 10 * (11 / 36288000) := by
  have hq0 : 0 ≤ q := by rw [hq]; positivity
  have hq1 : |q| ≤ 1 := by rw [abs_of_nonneg hq0, hq]; linarith
  have ht := (taylor_sin_cos q hq1).1
  rw [abs_of_nonneg hq0] at ht
  have hd : |θ * π / 180 - q| ≤ θ / 180 * (1 / 10 ^ 10) := by
    rw [hq, show θ * π / 180 - θ * 3.1415926536 / 180 = θ / 180 * (π - 3.1415926536) by ring, abs_mul,
      abs_of_nonneg (by positivity)]
    exact mul_le_mul_of_nonneg_left pi_blizu (by positivity)
  calc _ = |(Real.cos (θ * π / 180) - Real.cos q) +
        (Real.cos q - (1 - q ^ 2 / 2 + q ^ 4 / 24 - q ^ 6 / 720 + q ^ 8 / 40320))| := by ring_nf
    _ ≤ _ := (abs_add_le _ _).trans (add_le_add ((abs_cos_sub_cos_le _ _).trans hd) ht)

/-- Predpostavke trditev `cos_stopinj` in `sin_stopinj` se dajo izpolniti (`θ = q = 0`). -/
example : (0:ℝ) = 0 * 3.1415926536 / 180 ∧ (0:ℝ) ≤ 0 ∧ (0:ℝ) ≤ 57 := by norm_num

/-- Pomožna trditev: `sin` pri kotu `θ°` (`0 ≤ θ ≤ 57`) je blizu Taylorjevega polinoma v
`q = θ·3,1415926536/180`.
pomozno -/
theorem sin_stopinj (θ q : ℝ) (hq : q = θ * 3.1415926536 / 180) (h0 : 0 ≤ θ) (h1 : θ ≤ 57) :
    |Real.sin (θ * π / 180) - (q - q ^ 3 / 6 + q ^ 5 / 120 - q ^ 7 / 5040 + q ^ 9 / 362880)| ≤
      θ / 180 * (1 / 10 ^ 10) + q ^ 10 * (11 / 36288000) := by
  have hq0 : 0 ≤ q := by rw [hq]; positivity
  have hq1 : |q| ≤ 1 := by rw [abs_of_nonneg hq0, hq]; linarith
  have ht := (taylor_sin_cos q hq1).2
  rw [abs_of_nonneg hq0] at ht
  have hd : |θ * π / 180 - q| ≤ θ / 180 * (1 / 10 ^ 10) := by
    rw [hq, show θ * π / 180 - θ * 3.1415926536 / 180 = θ / 180 * (π - 3.1415926536) by ring, abs_mul,
      abs_of_nonneg (by positivity)]
    exact mul_le_mul_of_nonneg_left pi_blizu (by positivity)
  calc _ = |(Real.sin (θ * π / 180) - Real.sin q) +
        (Real.sin q - (q - q ^ 3 / 6 + q ^ 5 / 120 - q ^ 7 / 5040 + q ^ 9 / 362880))| := by ring_nf
    _ ≤ _ := (abs_add_le _ _).trans (add_le_add ((abs_sin_sub_sin_le _ _).trans hd) ht)

/-- Pomožna trditev: spodnja in zgornja meja za `sin θ°` (`0 ≤ θ ≤ 57`); pogoja na meje preveri `norm_num`.
pomozno -/
theorem sin_meja (θ lo hi : ℝ) (h0 : 0 ≤ θ) (h1 : θ ≤ 57)
    (hlo : lo ≤ ((θ * 3.1415926536 / 180) - (θ * 3.1415926536 / 180) ^ 3 / 6 +
      (θ * 3.1415926536 / 180) ^ 5 / 120 - (θ * 3.1415926536 / 180) ^ 7 / 5040 +
      (θ * 3.1415926536 / 180) ^ 9 / 362880) -
      (θ / 180 * (1 / 10 ^ 10) + (θ * 3.1415926536 / 180) ^ 10 * (11 / 36288000)))
    (hhi : ((θ * 3.1415926536 / 180) - (θ * 3.1415926536 / 180) ^ 3 / 6 +
      (θ * 3.1415926536 / 180) ^ 5 / 120 - (θ * 3.1415926536 / 180) ^ 7 / 5040 +
      (θ * 3.1415926536 / 180) ^ 9 / 362880) +
      (θ / 180 * (1 / 10 ^ 10) + (θ * 3.1415926536 / 180) ^ 10 * (11 / 36288000)) ≤ hi) :
    lo ≤ Real.sin (θ * π / 180) ∧ Real.sin (θ * π / 180) ≤ hi := by
  have h := sin_stopinj θ _ rfl h0 h1
  rw [abs_le] at h
  constructor <;> linarith [h.1, h.2]

/-- Predpostavke trditve `sin_meja` se dajo izpolniti (`θ = 0`, `lo = −1`, `hi = 1`). -/
example : (-1:ℝ) ≤ ((0 * 3.1415926536 / 180) - (0 * 3.1415926536 / 180) ^ 3 / 6 +
      (0 * 3.1415926536 / 180) ^ 5 / 120 - (0 * 3.1415926536 / 180) ^ 7 / 5040 +
      (0 * 3.1415926536 / 180) ^ 9 / 362880) -
      (0 / 180 * (1 / 10 ^ 10) + (0 * 3.1415926536 / 180) ^ 10 * (11 / 36288000)) ∧
    ((0 * 3.1415926536 / 180) - (0 * 3.1415926536 / 180) ^ 3 / 6 +
      (0 * 3.1415926536 / 180) ^ 5 / 120 - (0 * 3.1415926536 / 180) ^ 7 / 5040 +
      (0 * 3.1415926536 / 180) ^ 9 / 362880) +
      (0 / 180 * (1 / 10 ^ 10) + (0 * 3.1415926536 / 180) ^ 10 * (11 / 36288000)) ≤ (1:ℝ) := by
  constructor <;> norm_num

/-- Pomožna trditev: spodnja in zgornja meja za `cos θ°` (`0 ≤ θ ≤ 57`); pogoja na meje preveri `norm_num`.
pomozno -/
theorem cos_meja (θ lo hi : ℝ) (h0 : 0 ≤ θ) (h1 : θ ≤ 57)
    (hlo : lo ≤ (1 - (θ * 3.1415926536 / 180) ^ 2 / 2 + (θ * 3.1415926536 / 180) ^ 4 / 24 -
      (θ * 3.1415926536 / 180) ^ 6 / 720 + (θ * 3.1415926536 / 180) ^ 8 / 40320) -
      (θ / 180 * (1 / 10 ^ 10) + (θ * 3.1415926536 / 180) ^ 10 * (11 / 36288000)))
    (hhi : (1 - (θ * 3.1415926536 / 180) ^ 2 / 2 + (θ * 3.1415926536 / 180) ^ 4 / 24 -
      (θ * 3.1415926536 / 180) ^ 6 / 720 + (θ * 3.1415926536 / 180) ^ 8 / 40320) +
      (θ / 180 * (1 / 10 ^ 10) + (θ * 3.1415926536 / 180) ^ 10 * (11 / 36288000)) ≤ hi) :
    lo ≤ Real.cos (θ * π / 180) ∧ Real.cos (θ * π / 180) ≤ hi := by
  have h := cos_stopinj θ _ rfl h0 h1
  rw [abs_le] at h
  constructor <;> linarith [h.1, h.2]

/-- Predpostavke trditve `cos_meja` se dajo izpolniti (`θ = 0`, `lo = 0`, `hi = 2`). -/
example : (0:ℝ) ≤ (1 - (0 * 3.1415926536 / 180) ^ 2 / 2 + (0 * 3.1415926536 / 180) ^ 4 / 24 -
      (0 * 3.1415926536 / 180) ^ 6 / 720 + (0 * 3.1415926536 / 180) ^ 8 / 40320) -
      (0 / 180 * (1 / 10 ^ 10) + (0 * 3.1415926536 / 180) ^ 10 * (11 / 36288000)) ∧
    (1 - (0 * 3.1415926536 / 180) ^ 2 / 2 + (0 * 3.1415926536 / 180) ^ 4 / 24 -
      (0 * 3.1415926536 / 180) ^ 6 / 720 + (0 * 3.1415926536 / 180) ^ 8 / 40320) +
      (0 / 180 * (1 / 10 ^ 10) + (0 * 3.1415926536 / 180) ^ 10 * (11 / 36288000)) ≤ (2:ℝ) := by
  constructor <;> norm_num

/-- Pomožna trditev: če je tan lo° < v < tan hi° (zapisano kot sin lo° < v·cos lo° in v·cos hi° < sin hi°) za
0 ≤ lo ≤ hi ≤ 57, je lo < arctan v · 180/π < hi (kot v stopinjah).
pomozno -/
theorem arctan_stopinj (v lo hi : ℝ) (h0 : 0 ≤ lo) (hlh : lo ≤ hi) (h1 : hi ≤ 57)
    (hs1 : Real.sin (lo * π / 180) < v * Real.cos (lo * π / 180))
    (hs2 : v * Real.cos (hi * π / 180) < Real.sin (hi * π / 180)) :
    lo < Real.arctan v * 180 / π ∧ Real.arctan v * 180 / π < hi := by
  have hp := Real.pi_pos
  have p1 := Real.pi_gt_d2
  have hlo1 : -(π / 2) < lo * π / 180 := by nlinarith
  have hlo2 : lo * π / 180 < π / 2 := by nlinarith
  have hhi1 : -(π / 2) < hi * π / 180 := by nlinarith
  have hhi2 : hi * π / 180 < π / 2 := by nlinarith
  have c1 : 0 < Real.cos (lo * π / 180) := Real.cos_pos_of_mem_Ioo ⟨hlo1, hlo2⟩
  have c2 : 0 < Real.cos (hi * π / 180) := Real.cos_pos_of_mem_Ioo ⟨hhi1, hhi2⟩
  have t1 : Real.tan (lo * π / 180) < v := by rw [Real.tan_eq_sin_div_cos, div_lt_iff₀ c1]; linarith
  have t2 : v < Real.tan (hi * π / 180) := by rw [Real.tan_eq_sin_div_cos, lt_div_iff₀ c2]; linarith
  have a1 : lo * π / 180 < Real.arctan v := by
    have := Real.arctan_strictMono t1; rwa [Real.arctan_tan hlo1 hlo2] at this
  have a2 : Real.arctan v < hi * π / 180 := by
    have := Real.arctan_strictMono t2; rwa [Real.arctan_tan hhi1 hhi2] at this
  constructor
  · rw [lt_div_iff₀ hp]; linarith
  · rw [div_lt_iff₀ hp]; linarith

/-- Predpostavke trditve `arctan_stopinj` se dajo izpolniti (v = 1, lo = 0, hi = 57: sin 0 = 0 < cos 0 in
cos 57° < sin 57°, ker je 57° > 45°). -/
example : Real.sin (0 * π / 180) < 1 * Real.cos (0 * π / 180) ∧
    1 * Real.cos (57 * π / 180) < Real.sin (57 * π / 180) := by
  constructor
  · simp
  · rw [one_mul, ← Real.sin_pi_div_two_sub]
    have hp := Real.pi_pos
    apply Real.sin_lt_sin_of_lt_of_le_pi_div_two <;> nlinarith

/-! ## Pomožne trditve o potencah -/

/-- Pomožna trditev: primerjava b^e z v prek n-te potence, kadar je e·n = p naravno število.
pomozno -/
theorem rpow_vs (b v e : ℝ) (n p : ℕ) (hb : 0 < b) (hv : 0 < v) (hn : n ≠ 0) (he : e * n = p) :
    (b ^ e < v ↔ b ^ p < v ^ n) ∧ (v < b ^ e ↔ v ^ n < b ^ p) := by
  have key : (b ^ e) ^ n = b ^ p := by
    rw [← Real.rpow_natCast (b ^ e) n, ← Real.rpow_mul hb.le, he, Real.rpow_natCast]
  have h1 : 0 ≤ b ^ e := Real.rpow_nonneg hb.le e
  constructor
  · rw [← key]; exact (pow_lt_pow_iff_left₀ h1 hv.le hn).symm
  · rw [← key]; exact (pow_lt_pow_iff_left₀ hv.le h1 hn).symm

/-- Predpostavke `rpow_vs` se dajo izpolniti (b = 2, v = 1, e = 1, n = p = 1). -/
example : (0:ℝ) < 2 ∧ (0:ℝ) < 1 ∧ (1:ℕ) ≠ 0 ∧ (1:ℝ) * ((1:ℕ):ℝ) = ((1:ℕ):ℝ) := by norm_num

/-- Pomožna trditev: za 0 < b < 1 je b^x = b^y natanko tedaj, ko je x = y, in b^y < b^x ⟺ x < y (pada).
pomozno -/
theorem pada (b : ℝ) (h0 : 0 < b) (h1 : b < 1) (x y : ℝ) : (b ^ x = b ^ y ↔ x = y) ∧ (b ^ y < b ^ x ↔ x < y) := by
  refine ⟨⟨fun h => le_antisymm ?_ ?_, fun h => by rw [h]⟩, Real.rpow_lt_rpow_left_iff_of_base_lt_one h0 h1⟩
  · exact (Real.rpow_le_rpow_left_iff_of_base_lt_one h0 h1).mp h.ge
  · exact (Real.rpow_le_rpow_left_iff_of_base_lt_one h0 h1).mp h.le

/-- Pomožna trditev: za b > 1 je b^x = b^y natanko tedaj, ko je x = y, in b^x < b^y ⟺ x < y (narašča).
pomozno -/
theorem narasca (b : ℝ) (h1 : 1 < b) (x y : ℝ) : (b ^ x = b ^ y ↔ x = y) ∧ (b ^ x < b ^ y ↔ x < y) := by
  refine ⟨⟨fun h => le_antisymm ?_ ?_, fun h => by rw [h]⟩, Real.rpow_lt_rpow_left_iff h1⟩
  · exact (Real.rpow_le_rpow_left_iff h1).mp h.le
  · exact (Real.rpow_le_rpow_left_iff h1).mp h.ge

/-- Predpostavke `pada` in `narasca` se dajo izpolniti (b = 1/2 oz. b = 2). -/
example : (0:ℝ) < 1 / 2 ∧ (1 / 2 : ℝ) < 1 ∧ (1:ℝ) < 2 := by norm_num

/-- Pomožna trditev: b^(n : ℝ) = bⁿ za naravni n, zapisan kot ulomek (npr. 12/6 = 2).
pomozno -/
theorem rpow_nar (b r : ℝ) (n : ℕ) (h : r = n) : b ^ r = b ^ n := by rw [h, Real.rpow_natCast]

/-- Predpostavka `rpow_nar` se da izpolniti (r = 12/6, n = 2). -/
example : (12:ℝ) / 6 = ((2:ℕ):ℝ) := by norm_num

/-! ## Razlaga: zdravilo -/

/-- Razlaga, tabela: c(t) = 80·(1/2)^(t/6) da c(0) = 80, c(6) = 40, c(12) = 20, c(18) = 10, c(24) = 5.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#tabela
besedilo: »$80 \cdot \left(\frac{1}{2}\right)^{t/6} = 10$« -/
theorem tabela :
    80 * (1 / 2 : ℝ) ^ ((0:ℝ) / 6) = 80 ∧ 80 * (1 / 2 : ℝ) ^ ((6:ℝ) / 6) = 40 ∧
    80 * (1 / 2 : ℝ) ^ ((12:ℝ) / 6) = 20 ∧ 80 * (1 / 2 : ℝ) ^ ((18:ℝ) / 6) = 10 ∧
    80 * (1 / 2 : ℝ) ^ ((24:ℝ) / 6) = 5 := by
  refine ⟨?_, ?_, ?_, ?_, ?_⟩
  · rw [rpow_nar _ _ 0 (by norm_num)]; norm_num
  · rw [rpow_nar _ _ 1 (by norm_num)]; norm_num
  · rw [rpow_nar _ _ 2 (by norm_num)]; norm_num
  · rw [rpow_nar _ _ 3 (by norm_num)]; norm_num
  · rw [rpow_nar _ _ 4 (by norm_num)]; norm_num

/-- Razlaga: koncentracija je vedno pozitivna (graf nikoli ne pade na nič) in strogo pada; zato enačba q^t = b
z b ≤ 0 nima rešitve (simulacija).
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#pozitivna-pada
besedilo: »V simulaciji spodaj (Zbirka simulacij za maturo) odpri Eksponentna funkcija in nastavi osnovo med $0$ in $1$. Opazi, da graf pada, a ostane nad osjo $x$; zato enačba $q^t = b$ z negativnim $b$ nima rešitve.« -/
theorem pozitivna_pada :
    (∀ t : ℝ, 0 < 80 * (1 / 2 : ℝ) ^ (t / 6)) ∧
    (∀ t₁ t₂ : ℝ, t₁ < t₂ → 80 * (1 / 2 : ℝ) ^ (t₂ / 6) < 80 * (1 / 2 : ℝ) ^ (t₁ / 6)) ∧
    (∀ q b t : ℝ, 0 < q → b ≤ 0 → q ^ t ≠ b) := by
  refine ⟨fun t => by positivity, fun t₁ t₂ h => ?_, fun q b t hq hb h => ?_⟩
  · have := ((pada (1 / 2) (by norm_num) (by norm_num) (t₁ / 6) (t₂ / 6)).2).mpr (by linarith)
    linarith
  · have := Real.rpow_pos_of_pos hq t; linarith

/-- Razlaga »na grafu pada vse počasneje«: v enako dolgem časovnem intervalu h > 0 koncentracija c(t) =
80·(1/2)^(t/6) pade za c(t) − c(t + h) = c(t)·(1 − (1/2)^(h/6)) > 0, pozneje (t₂ > t₁) pa za manj kot prej.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#pada-vse-pocasneje
besedilo: »$$c(t) = 80 \cdot \left(\frac{1}{2}\right)^{t/6}$$« -/
theorem pada_vse_pocasneje (t₁ t₂ h : ℝ) (ht : t₁ < t₂) (hh : 0 < h) :
    80 * (1 / 2 : ℝ) ^ ((t₂ + h) / 6) < 80 * (1 / 2 : ℝ) ^ (t₂ / 6) ∧
    80 * (1 / 2 : ℝ) ^ (t₂ / 6) - 80 * (1 / 2 : ℝ) ^ ((t₂ + h) / 6) <
      80 * (1 / 2 : ℝ) ^ (t₁ / 6) - 80 * (1 / 2 : ℝ) ^ ((t₁ + h) / 6) := by
  have e : ∀ t : ℝ, 80 * (1 / 2 : ℝ) ^ (t / 6) - 80 * (1 / 2 : ℝ) ^ ((t + h) / 6) =
      80 * (1 / 2 : ℝ) ^ (t / 6) * (1 - (1 / 2 : ℝ) ^ (h / 6)) := by
    intro t; rw [show (t + h) / 6 = t / 6 + h / 6 by ring, Real.rpow_add (by norm_num)]; ring
  have q : (1 / 2 : ℝ) ^ (h / 6) < 1 := Real.rpow_lt_one (by norm_num) (by norm_num) (by positivity)
  have m : (1 / 2 : ℝ) ^ (t₂ / 6) < (1 / 2 : ℝ) ^ (t₁ / 6) :=
    Real.rpow_lt_rpow_of_exponent_gt (by norm_num) (by norm_num) (by linarith)
  have p : (0:ℝ) < (1 / 2 : ℝ) ^ (t₂ / 6) := by positivity
  constructor
  · have := e t₂; nlinarith
  · rw [e, e]; apply mul_lt_mul_of_pos_right (by linarith) (by linarith)

/-- Predpostavke `pada_vse_pocasneje` se dajo izpolniti (t₁ = 0, t₂ = 6, h = 6). -/
example : (0:ℝ) < 6 ∧ (0:ℝ) < 6 := by norm_num

/-- Predpostavke trditve `pada_vse_pocasneje` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 6 ∧ (0:ℝ) < 6 := by norm_num
  pada_vse_pocasneje (ht := w.1) (hh := w.2)

/-- Razlaga: 80·(1/2)^(t/6) = 10 ⟺ (1/2)^(t/6) = 1/8 = (1/2)³ ⟺ t/6 = 3 ⟺ t = 18; za t > 18 je koncentracija
pod mejo 10 (naslednji odmerek po 18 urah).
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#razpolovitev
besedilo: »Delimo z $80$ in dobimo $\left(\frac{1}{2}\right)^{t/6} = \frac{1}{8} = \left(\frac{1}{2}\right)^{3}$.« -/
theorem razpolovitev (t : ℝ) :
    (80 * (1 / 2 : ℝ) ^ (t / 6) = 10 ↔ (1 / 2 : ℝ) ^ (t / 6) = 1 / 8) ∧ (1 / 8 : ℝ) = (1 / 2) ^ (3:ℝ) ∧
    ((1 / 2 : ℝ) ^ (t / 6) = (1 / 2) ^ (3:ℝ) ↔ t / 6 = 3) ∧ (t / 6 = 3 ↔ t = 18) ∧
    (18 < t → 80 * (1 / 2 : ℝ) ^ (t / 6) < 10) := by
  have e3 : (1 / 8 : ℝ) = (1 / 2) ^ (3:ℝ) := by rw [rpow_nar _ _ 3 (by norm_num)]; norm_num
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, e3,
    (pada (1 / 2) (by norm_num) (by norm_num) _ _).1, ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    fun h => ?_⟩
  have := ((pada (1 / 2) (by norm_num) (by norm_num) (3:ℝ) (t / 6)).2).mpr (by linarith)
  rw [← e3] at this; linarith

/-- Razlaga, Premisli 1 (in blok RACUN): pri meji 12 mg/L je 12/80 = 0,15; enačba 80·(1/2)^(t/6) = 12 ima natanko
eno rešitev t = 6·log_{1/2} 0,15 in ta je ≈ 16,4 h.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#meja12
besedilo: »Tu nastopi logaritem: $\frac{t}{6} = \log_{1/2} 0{,}15$, torej $t \approx 16{,}4\,\mathrm{h}$.« -/
theorem meja12 :
    (12:ℝ) / 80 = 0.15 ∧ 80 * (1 / 2 : ℝ) ^ (6 * Real.logb (1 / 2) 0.15 / 6) = 12 ∧
    ∀ t : ℝ, 80 * (1 / 2 : ℝ) ^ (t / 6) = 12 → t = 6 * Real.logb (1 / 2) 0.15 ∧ |t - 16.4| < 0.05 := by
  have ex : 80 * (1 / 2 : ℝ) ^ (6 * Real.logb (1 / 2) 0.15 / 6) = 12 := by
    rw [show 6 * Real.logb (1 / 2) 0.15 / 6 = Real.logb (1 / 2) 0.15 by ring,
      Real.rpow_logb (by norm_num) (by norm_num) (by norm_num)]; norm_num
  refine ⟨by norm_num, ex, fun t ht => ⟨?_, ?_⟩⟩
  · have := (pada (1 / 2) (by norm_num) (by norm_num) (t / 6) (6 * Real.logb (1 / 2) 0.15 / 6)).1.mp
      (by linarith)
    linarith
  · -- (1/2)^(16,35/6) > 0,15 > (1/2)^(16,45/6), funkcija pada
    have a : (0.15 : ℝ) < (1 / 2) ^ ((16.35 : ℝ) / 6) :=
      ((rpow_vs (1 / 2) 0.15 (16.35 / 6) 40 109 (by norm_num) (by norm_num) (by norm_num) (by norm_num)).2).mpr
        (by norm_num)
    have b : (1 / 2 : ℝ) ^ ((16.44 : ℝ) / 6) < 0.15 :=
      ((rpow_vs (1 / 2) 0.15 (16.44 / 6) 50 137 (by norm_num) (by norm_num) (by norm_num) (by norm_num)).1).mpr
        (by norm_num)
    have h15 : (1 / 2 : ℝ) ^ (t / 6) = 0.15 := by linarith
    have l : 16.35 < t := by
      have := (pada (1 / 2) (by norm_num) (by norm_num) (16.35 / 6) (t / 6)).2.mp (by rw [h15]; exact a)
      linarith
    have u : t < 16.44 := by
      have := (pada (1 / 2) (by norm_num) (by norm_num) (t / 6) (16.44 / 6)).2.mp (by rw [h15]; exact b)
      linarith
    rw [abs_lt]; constructor <;> linarith

/-- Razlaga, Premisli 2: log₂(x + 1) = 3 (pogoj x + 1 > 0) ⟺ x + 1 = 2³ = 8 ⟺ x = 7.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#premisli2
besedilo: »Presečišče grafov je enačba $\log_2 (x + 1) = 3$; logaritem odpraviš po definiciji, $x + 1 = 2^3 = 8$, torej $x = 7$.« -/
theorem premisli2 (x : ℝ) (hx : 0 < x + 1) : Real.logb 2 (x + 1) = 3 ↔ x = 7 := by
  rw [Real.logb_eq_iff_rpow_eq (by norm_num) (by norm_num) hx, rpow_nar _ _ 3 (by norm_num)]
  constructor
  · intro h; norm_num at h; linarith
  · intro h; rw [h]; norm_num

/-- Predpostavka `premisli2` se da izpolniti (x = 7). -/
example : (0:ℝ) < 7 + 1 := by norm_num

/-- Predpostavke trditve `premisli2` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 7 + 1 := by norm_num
  premisli2 (hx := w)

/-- Preglednica (»največ / najmanj: teme −b/(2a)«): za a ≠ 0 je ax² + bx + c = a(x + b/(2a))² + c − b²/(4a), zato
je teme pri x = −b/(2a).
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#teme
besedilo: »| najmanj | teme: $-\frac{b}{2a}$ |« -/
theorem teme (a b c x : ℝ) (ha : a ≠ 0) :
    a * x ^ 2 + b * x + c = a * (x - (-b / (2 * a))) ^ 2 + (c - b ^ 2 / (4 * a)) := by
  field_simp; ring

/-- Predpostavka `teme` se da izpolniti (a = 1). -/
example : (1:ℝ) ≠ 0 := one_ne_zero

/-! ## Rešeni primeri -/

/-- Predpostavke trditve `teme` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 := one_ne_zero
  teme (ha := w)

/-- Primer 1 (in blok RACUN): 8 = 2³, √2 = 2^(1/2), ∛4 = 4^(1/3) = 2^(2/3), 3 + 1/2 − 2/3 = 17/6, torej
8√2/∛4 = 2^(17/6) in log₂(8√2/∛4) = 17/6.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#primer1
besedilo: »$\log_2 \dfrac{8\sqrt{2}}{\sqrt[3]{4}} = \dfrac{17}{6}$« -/
theorem primer1 :
    (8:ℝ) = 2 ^ (3:ℝ) ∧ √2 = (2:ℝ) ^ (1 / 2 : ℝ) ∧ (4:ℝ) ^ (1 / 3 : ℝ) = 2 ^ (2 / 3 : ℝ) ∧
    (3:ℝ) + 1 / 2 - 2 / 3 = 17 / 6 ∧ 8 * √2 / (4:ℝ) ^ (1 / 3 : ℝ) = 2 ^ (17 / 6 : ℝ) ∧
    Real.logb 2 (8 * √2 / (4:ℝ) ^ (1 / 3 : ℝ)) = 17 / 6 := by
  have e8 : (8:ℝ) = 2 ^ (3:ℝ) := by rw [rpow_nar _ _ 3 (by norm_num)]; norm_num
  have e2 : √2 = (2:ℝ) ^ (1 / 2 : ℝ) := Real.sqrt_eq_rpow 2
  have e4 : (4:ℝ) ^ (1 / 3 : ℝ) = 2 ^ (2 / 3 : ℝ) := by
    rw [show (4:ℝ) = 2 ^ (2:ℝ) by rw [rpow_nar _ _ 2 (by norm_num)]; norm_num, ← Real.rpow_mul (by norm_num)]
    norm_num
  have e : 8 * √2 / (4:ℝ) ^ (1 / 3 : ℝ) = 2 ^ (17 / 6 : ℝ) := by
    rw [e8, e2, e4, ← Real.rpow_add (by norm_num), ← Real.rpow_sub (by norm_num)]; norm_num
  refine ⟨e8, e2, e4, by norm_num, e, ?_⟩
  rw [e, Real.logb_rpow (by norm_num) (by norm_num)]

/-- Primer 2: 4^x = (2^x)², 2^(x+1) = 2·2^x, zato je enačba (2^x)² − 6·2^x + 8 = 0; s² − 6s + 8 = (s − 2)(s − 4); iz
2^x = 2 je x = 1, iz 2^x = 4 je x = 2; preizkus 4 − 12 + 8 = 0 in 16 − 24 + 8 = 0.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#primer2-koraki
besedilo: »Preizkus: $4 - 12 + 8 = 0$ in $16 - 24 + 8 = 0$.« -/
theorem primer2_koraki (x : ℝ) :
    (4:ℝ) ^ x = ((2:ℝ) ^ x) ^ 2 ∧ (2:ℝ) ^ (x + 1) = 2 * 2 ^ x ∧
    ((4:ℝ) ^ x - 3 * 2 ^ (x + 1) + 8 = ((2:ℝ) ^ x) ^ 2 - 6 * 2 ^ x + 8) ∧
    (∀ s : ℝ, s ^ 2 - 6 * s + 8 = (s - 2) * (s - 4)) ∧ ((2:ℝ) ^ x = 2 ↔ x = 1) ∧ ((2:ℝ) ^ x = 4 ↔ x = 2) ∧
    (4:ℝ) - 12 + 8 = 0 ∧ (16:ℝ) - 24 + 8 = 0 := by
  have e4 : (4:ℝ) ^ x = ((2:ℝ) ^ x) ^ 2 := by
    rw [show (4:ℝ) = 2 ^ (2:ℝ) by rw [rpow_nar _ _ 2 (by norm_num)]; norm_num, ← Real.rpow_mul (by norm_num),
      ← Real.rpow_natCast, ← Real.rpow_mul (by norm_num)]
    congr 1; push_cast; ring
  have e2 : (2:ℝ) ^ (x + 1) = 2 * 2 ^ x := by rw [Real.rpow_add (by norm_num), Real.rpow_one]; ring
  refine ⟨e4, e2, by rw [e4, e2]; ring, fun s => by ring, ?_, ?_, by norm_num, by norm_num⟩
  · rw [show ((2:ℝ) ^ x = 2) ↔ ((2:ℝ) ^ x = 2 ^ (1:ℝ)) by rw [Real.rpow_one]]
    exact (narasca 2 (by norm_num) x 1).1
  · rw [show (4:ℝ) = 2 ^ (2:ℝ) by rw [rpow_nar _ _ 2 (by norm_num)]; norm_num]
    exact (narasca 2 (by norm_num) x 2).1

/-- Primer 2 in Primer 4 (blok RACUN): s² − 6s + 8 = 0 ⟺ s = 2 ali s = 4; x² − 2x − 8 = 0 ⟺ x = −2 ali x = 4.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#kvadratni
besedilo: »Uvedemo $s = 2^x$ in dobimo kvadratno enačbo $s^2 - 6s + 8 = 0$, ki se razstavi v $(s - 2)(s - 4) = 0$.« -/
theorem kvadratni :
    (∀ s : ℝ, s ^ 2 - 6 * s + 8 = 0 ↔ s = 2 ∨ s = 4) ∧ (∀ x : ℝ, x ^ 2 - 2 * x - 8 = 0 ↔ x = -2 ∨ x = 4) := by
  refine ⟨fun s => ?_, fun x => ?_⟩
  · rw [show s ^ 2 - 6 * s + 8 = (s - 2) * (s - 4) by ring, mul_eq_zero, sub_eq_zero, sub_eq_zero]
  · rw [show x ^ 2 - 2 * x - 8 = (x + 2) * (x - 4) by ring, mul_eq_zero, sub_eq_zero, add_eq_zero_iff_eq_neg]

/-- Primer 2: 4^x − 3·2^(x+1) + 8 = 0 ⟺ x = 1 ali x = 2 (obe rešitvi za s = 2^x > 0 sta pozitivni).
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#primer2
besedilo: »$4^x - 3 \cdot 2^{x+1} + 8 = 0$« -/
theorem primer2 (x : ℝ) : (4:ℝ) ^ x - 3 * 2 ^ (x + 1) + 8 = 0 ↔ x = 1 ∨ x = 2 := by
  obtain ⟨_, _, e, f, g1, g2, _, _⟩ := primer2_koraki x
  rw [e, f, mul_eq_zero, sub_eq_zero, sub_eq_zero, g1, g2]

/-- Primer 3, koraka 1–3 (in blok RACUN): za q > 0 je q⁸ = 1/4 natanko pri q = ⁸√(1/4) = 2^(−1/4); q ≈ 0,8409,
ostane 84,09 %, izloči se 100 % − 84,09 % = 15,91 % ≈ 15,9 %.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#primer3-q
besedilo: »Ker je $q > 0$, je $q = \sqrt[8]{\frac{1}{4}} = \sqrt[8]{2^{-2}} = 2^{-1/4} \approx 0{,}8409$. Vsako uro torej ostane $84{,}09\,\%$ zdravila.« -/
theorem primer3_q :
    (∀ q : ℝ, 0 < q → (q ^ 8 = 1 / 4 ↔ q = (1 / 4 : ℝ) ^ (1 / 8 : ℝ))) ∧
    (1 / 4 : ℝ) ^ (1 / 8 : ℝ) = 2 ^ (-1 / 4 : ℝ) ∧ |(1 / 4 : ℝ) ^ (1 / 8 : ℝ) - 0.8409| < 0.00005 ∧
    (100:ℝ) - 84.09 = 15.91 ∧ |100 - 100 * (1 / 4 : ℝ) ^ (1 / 8 : ℝ) - 15.9| < 0.05 := by
  have hq8 : ((1 / 4 : ℝ) ^ (1 / 8 : ℝ)) ^ 8 = 1 / 4 := by
    rw [← Real.rpow_natCast, ← Real.rpow_mul (by norm_num)]; norm_num
  have hpos : 0 < (1 / 4 : ℝ) ^ (1 / 8 : ℝ) := by positivity
  have uniq : ∀ q : ℝ, 0 < q → (q ^ 8 = 1 / 4 ↔ q = (1 / 4 : ℝ) ^ (1 / 8 : ℝ)) := fun q hq => by
    constructor
    · intro h; exact (pow_left_inj₀ hq.le hpos.le (by norm_num)).mp (h.trans hq8.symm)
    · intro h; rw [h, hq8]
  have l : (0.84085 : ℝ) < (1 / 4 : ℝ) ^ (1 / 8 : ℝ) := by
    by_contra h; push Not at h
    have := pow_le_pow_left₀ hpos.le h 8; rw [hq8] at this; norm_num at this
  have u : (1 / 4 : ℝ) ^ (1 / 8 : ℝ) < 0.84095 := by
    by_contra h; push Not at h
    have := pow_le_pow_left₀ (by norm_num) h 8; rw [hq8] at this; norm_num at this
  refine ⟨uniq, ?_, by rw [abs_lt]; constructor <;> linarith, by norm_num, by rw [abs_lt]; constructor <;> linarith⟩
  rw [show (1 / 4 : ℝ) = 2 ^ (-2 : ℝ) by rw [Real.rpow_neg (by norm_num), rpow_nar _ _ 2 (by norm_num)]; norm_num,
    ← Real.rpow_mul (by norm_num)]
  norm_num

/-- Primer 3, koraki 4–5 (in blok RACUN): q^t = 0,1 ⟺ t·log q = log 0,1 ⟺ t = log 0,1 / log q; z nezaokroženim
q = ⁸√(1/4) je t ≈ 13,3 h (daljše od 8 ur).
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#primer3-t
besedilo: »Z nezaokroženim $q$ dobimo $t \approx 13{,}3\,\mathrm{h}$. Smisel: $10\,\%$ je manj kot četrtina, zato mora biti čas daljši od $8$ ur.« -/
theorem primer3_t :
    (∀ q t : ℝ, 0 < q → q ≠ 1 → (q ^ t = 0.1 ↔ t * Real.log q = Real.log 0.1) ∧
      (t * Real.log q = Real.log 0.1 ↔ t = Real.log 0.1 / Real.log q)) ∧
    ∀ t : ℝ, ((1 / 4 : ℝ) ^ (1 / 8 : ℝ)) ^ t = 0.1 → |t - 13.3| < 0.05 ∧ 8 < t := by
  refine ⟨fun q t hq h1 => ⟨?_, ?_⟩, fun t ht => ?_⟩
  · have hl : Real.log q ≠ 0 := fun h => h1 (Real.eq_one_of_pos_of_log_eq_zero hq h)
    constructor
    · intro h; rw [← h, Real.log_rpow hq]
    · intro h
      rw [← Real.log_rpow hq] at h
      exact Real.log_injOn_pos (Real.rpow_pos_of_pos hq t) (by norm_num : (0:ℝ) < 0.1) h
  · have hl : Real.log q ≠ 0 := fun h => h1 (Real.eq_one_of_pos_of_log_eq_zero hq h)
    rw [eq_div_iff hl]
  · -- q^t = (1/2)^(t/4)
    have e : ((1 / 4 : ℝ) ^ (1 / 8 : ℝ)) ^ t = (1 / 2 : ℝ) ^ (t / 4) := by
      rw [← Real.rpow_mul (by norm_num), show (1 / 4 : ℝ) = (1 / 2) ^ (2:ℝ) by
        rw [rpow_nar _ _ 2 (by norm_num)]; norm_num, ← Real.rpow_mul (by norm_num)]
      congr 1; ring
    rw [e] at ht
    have a : (0.1 : ℝ) < (1 / 2) ^ ((13.25 : ℝ) / 4) :=
      ((rpow_vs (1 / 2) 0.1 (13.25 / 4) 16 53 (by norm_num) (by norm_num) (by norm_num) (by norm_num)).2).mpr
        (by norm_num)
    have b : (1 / 2 : ℝ) ^ ((10 : ℝ) / 3) < 0.1 :=
      ((rpow_vs (1 / 2) 0.1 (10 / 3) 3 10 (by norm_num) (by norm_num) (by norm_num) (by norm_num)).1).mpr
        (by norm_num)
    have l : 13.25 < t := by
      have := (pada (1 / 2) (by norm_num) (by norm_num) (13.25 / 4) (t / 4)).2.mp (by rw [ht]; exact a)
      linarith
    have u : t < 40 / 3 := by
      have := (pada (1 / 2) (by norm_num) (by norm_num) (t / 4) (10 / 3)).2.mp (by rw [ht]; exact b)
      linarith
    exact ⟨by rw [abs_lt]; constructor <;> linarith, by linarith⟩

/-- Pogoste napake (prezgodnje zaokroževanje, blok RACUN): z zaokroženim q ≈ 0,84 iz 0,84^t = 0,1 dobimo
t ≈ 13,2 h namesto 13,3 h.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#primer3-zaokrozeno
besedilo: »Prezgodnje zaokroževanje.** Če v Primeru 3 vzameš $q \approx 0{,}84$, dobiš $t \approx 13{,}2\,\mathrm{h}$ namesto $13{,}3\,\mathrm{h}$.« -/
theorem primer3_zaokrozeno : ∀ t : ℝ, (0.84 : ℝ) ^ t = 0.1 → |t - 13.2| < 0.05 := by
  intro t ht
  have a : (0.1 : ℝ) < 0.84 ^ ((66 : ℝ) / 5) :=
    ((rpow_vs 0.84 0.1 (66 / 5) 5 66 (by norm_num) (by norm_num) (by norm_num) (by norm_num)).2).mpr
      (by norm_num)
  have b : (0.84 : ℝ) ^ ((53 : ℝ) / 4) < 0.1 :=
    ((rpow_vs 0.84 0.1 (53 / 4) 4 53 (by norm_num) (by norm_num) (by norm_num) (by norm_num)).1).mpr
      (by norm_num)
  have l : 66 / 5 < t := (pada 0.84 (by norm_num) (by norm_num) (66 / 5) t).2.mp (by rw [ht]; exact a)
  have u : t < 53 / 4 := (pada 0.84 (by norm_num) (by norm_num) t (53 / 4)).2.mp (by rw [ht]; exact b)
  rw [abs_lt]; constructor <;> linarith

/-- Primer 3, korak 5 (in blok RACUN): t = log 0,1 / log q z nezaokroženim q = ⁸√(1/4) je ≈ 13,3, z zaokroženim
q = 0,84 pa ≈ 13,2.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#primer3-vrednosti
besedilo: »Prezgodnje zaokroževanje.** Če v Primeru 3 vzameš $q \approx 0{,}84$, dobiš $t \approx 13{,}2\,\mathrm{h}$ namesto $13{,}3\,\mathrm{h}$. Vmesne rezultate hrani v računalu, zaokroži šele odgovor.« -/
theorem primer3_vrednosti :
    |Real.log 0.1 / Real.log ((1 / 4 : ℝ) ^ (1 / 8 : ℝ)) - 13.3| < 0.05 ∧
    |Real.log 0.1 / Real.log 0.84 - 13.2| < 0.05 := by
  have hq8 : ((1 / 4 : ℝ) ^ (1 / 8 : ℝ)) ^ 8 = 1 / 4 := by
    rw [← Real.rpow_natCast, ← Real.rpow_mul (by norm_num)]; norm_num
  have hq : 0 < (1 / 4 : ℝ) ^ (1 / 8 : ℝ) := by positivity
  have hq1 : (1 / 4 : ℝ) ^ (1 / 8 : ℝ) ≠ 1 := by intro h; rw [h] at hq8; norm_num at hq8
  obtain ⟨a1, a2⟩ := primer3_t.1 _ (Real.log 0.1 / Real.log ((1 / 4 : ℝ) ^ (1 / 8 : ℝ))) hq hq1
  obtain ⟨b1, b2⟩ := primer3_t.1 0.84 (Real.log 0.1 / Real.log 0.84) (by norm_num) (by norm_num)
  exact ⟨(primer3_t.2 _ (a1.mpr (a2.mpr rfl))).1, primer3_zaokrozeno _ (b1.mpr (b2.mpr rfl))⟩

/-- Primer 4 (in Pogoste napake, Drugače: Bolj natančno, blok RACUN): pogoja x > 0 in x − 2 > 0 dasta x > 2;
log₂ x + log₂(x − 2) = log₂(x(x − 2)); x(x − 2) = 8 ⟺ x² − 2x − 8 = 0 ⟺ (x − 4)(x + 2) = 0 ⟺ x = 4 ali x = −2;
pogoju ustreza le x = 4 (preizkus log₂ 4 + log₂ 2 = 2 + 1 = 3); x(x − 2) > 0 velja tudi za x < 0, zato −2 izpolni
združeno enačbo, ne pa pogoja (tuja rešitev).
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#primer4
besedilo: »$x^2 - 2x - 8 = (x - 4)(x + 2) = 0$ da $x = 4$ ali $x = -2$. Pogoju $x > 2$ ustreza le $x = 4$. Preizkus: $\log_2 4 + \log_2 2 = 2 + 1 = 3$.« -/
theorem primer4 :
    (∀ x : ℝ, 0 < x ∧ 0 < x - 2 ↔ 2 < x) ∧
    (∀ x : ℝ, 2 < x → Real.logb 2 x + Real.logb 2 (x - 2) = Real.logb 2 (x * (x - 2))) ∧
    (∀ x : ℝ, x * (x - 2) = 8 ↔ x ^ 2 - 2 * x - 8 = 0) ∧ (∀ x : ℝ, x ^ 2 - 2 * x - 8 = (x - 4) * (x + 2)) ∧
    (∀ x : ℝ, 2 < x → (Real.logb 2 x + Real.logb 2 (x - 2) = 3 ↔ x = 4)) ∧
    Real.logb 2 4 + Real.logb 2 2 = 2 + 1 ∧ (∀ x : ℝ, 0 < x * (x - 2) ↔ x < 0 ∨ 2 < x) ∧
    Real.logb 2 ((-2) * ((-2) - 2)) = 3 ∧ ¬ (2 < (-2 : ℝ)) := by
  have l4 : Real.logb 2 4 = 2 := by
    rw [show (4:ℝ) = 2 ^ (2:ℝ) by rw [rpow_nar _ _ 2 (by norm_num)]; norm_num,
      Real.logb_rpow (by norm_num) (by norm_num)]
  have l8 : Real.logb 2 8 = 3 := by
    rw [show (8:ℝ) = 2 ^ (3:ℝ) by rw [rpow_nar _ _ 3 (by norm_num)]; norm_num,
      Real.logb_rpow (by norm_num) (by norm_num)]
  have comb : ∀ x : ℝ, 2 < x → Real.logb 2 x + Real.logb 2 (x - 2) = Real.logb 2 (x * (x - 2)) :=
    fun x hx => (Real.logb_mul (show x ≠ 0 by intro h; linarith) (show x - 2 ≠ 0 by intro h; linarith)).symm
  refine ⟨fun x => ⟨fun h => by linarith [h.2], fun h => ⟨by linarith, by linarith⟩⟩, comb,
    fun x => ⟨fun h => by linarith, fun h => by linarith⟩, fun x => by ring, fun x hx => ?_,
    by rw [l4, Real.logb_self_eq_one (by norm_num)], fun x => ?_, by norm_num [l8], by norm_num⟩
  · rw [comb x hx, Real.logb_eq_iff_rpow_eq (by norm_num) (by norm_num) (by nlinarith),
      rpow_nar _ _ 3 (by norm_num)]
    constructor
    · intro h
      have : (x - 4) * (x + 2) = 0 := by nlinarith
      rcases mul_eq_zero.mp this with h1 | h1
      · linarith
      · linarith
    · intro h; rw [h]; norm_num
  · constructor
    · intro h
      rcases lt_or_ge x 0 with h1 | h1
      · exact Or.inl h1
      rcases lt_or_ge 2 x with h2 | h2
      · exact Or.inr h2
      nlinarith [mul_nonneg h1 (by linarith : (0:ℝ) ≤ 2 - x)]
    · rintro (h | h)
      · nlinarith [mul_pos_of_neg_of_neg h (by linarith : x - 2 < 0)]
      · nlinarith [mul_pos (by linarith : (0:ℝ) < x) (by linarith : (0:ℝ) < x - 2)]

/-! ## Pogoste napake, Povzetek, Ponovitev -/

/-- Pogoste napake in Preveri se 1: log₂(4 + 4) = log₂ 8 = 3, log₂ 4 + log₂ 4 = 2 + 2 = 4 (vsote pod logaritmom ne
razbiješ); ∛27 = 3 in 9^(1/2) = 3.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#vsota-pod-log
besedilo: »$\log_2 (4 + 4) = \log_2 8 = 3$, tako kot ostala dva. Vsote pod logaritmom ne razbiješ na vsoto logaritmov.« -/
theorem vsota_pod_log :
    Real.logb 2 (4 + 4) = 3 ∧ Real.logb 2 4 + Real.logb 2 4 = 4 ∧ (27:ℝ) ^ (1 / 3 : ℝ) = 3 ∧
    (9:ℝ) ^ (1 / 2 : ℝ) = 3 := by
  have l4 : Real.logb 2 4 = 2 := by
    rw [show (4:ℝ) = 2 ^ (2:ℝ) by rw [rpow_nar _ _ 2 (by norm_num)]; norm_num,
      Real.logb_rpow (by norm_num) (by norm_num)]
  refine ⟨?_, by rw [l4]; norm_num, ?_, ?_⟩
  · rw [show (4 + 4 : ℝ) = 2 ^ (3:ℝ) by rw [rpow_nar _ _ 3 (by norm_num)]; norm_num,
      Real.logb_rpow (by norm_num) (by norm_num)]
  · rw [show (27:ℝ) = 3 ^ (3:ℝ) by rw [rpow_nar _ _ 3 (by norm_num)]; norm_num, ← Real.rpow_mul (by norm_num)]
    norm_num
  · rw [show (9:ℝ) = 3 ^ (2:ℝ) by rw [rpow_nar _ _ 2 (by norm_num)]; norm_num, ← Real.rpow_mul (by norm_num)]
    norm_num

/-- Pogoste napake, Povzetek in Ponovitev: upadanje za p % da faktor q = 1 − p/100 (za 20 % je q = 0,8, ne 0,2;
s q = 0,2 bi ostala petina); √(a² + b²) ni a + b (npr. √(3² + 4²) = 5 ≠ 7, za a, b > 0 je vedno manjši).
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#odstotek-in-koren
besedilo: »Napačen faktor pri odstotkih.** »Vsako uro izloči $20\,\%$« ne pomeni $q = 0{,}2$, ampak $q = 0{,}8$: ostane $80\,\%$. S $q = 0{,}2$ bi po eni uri ostala petina.« -/
theorem odstotek_in_koren :
    (1:ℝ) - 20 / 100 = 0.8 ∧ (0.2 : ℝ) = 1 / 5 ∧ √((3:ℝ) ^ 2 + 4 ^ 2) = 5 ∧ (5:ℝ) ≠ 3 + 4 ∧
    ∀ a b : ℝ, 0 < a → 0 < b → √(a ^ 2 + b ^ 2) < a + b := by
  refine ⟨by norm_num, by norm_num, ?_, by norm_num, fun a b ha hb => ?_⟩
  · rw [show (3:ℝ) ^ 2 + 4 ^ 2 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [Real.sqrt_lt' (by linarith)]; nlinarith [mul_pos ha hb]

/-- Povzetek in Ponovitev: ⁿ√(aᵐ) = a^(m/n) (a ≥ 0); q^t = b ⟹ t·log q = log b (q, b > 0); log_a(AB) =
log_a A + log_a B (A, B > 0; zveza velja za vsako osnovo b, ker je v Leanu log_b x = log x / log b, lekcija pa
jo uporablja za b > 0, b ≠ 1); s = a^x > 0.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#povzetek
besedilo: »$q^t = b \Rightarrow t \cdot \log q = \log b$« -/
theorem povzetek (a : ℝ) (ha : 0 ≤ a) (m n : ℕ) (_hn : n ≠ 0) :
    ((a ^ m) ^ (1 / (n : ℝ)) = a ^ ((m : ℝ) / n)) ∧
    (∀ q t : ℝ, 0 < q → Real.log (q ^ t) = t * Real.log q) ∧
    (∀ b A B : ℝ, 0 < A → 0 < B → Real.logb b (A * B) = Real.logb b A + Real.logb b B) ∧
    (∀ c x : ℝ, 0 < c → 0 < c ^ x) := by
  refine ⟨?_, fun q t hq => Real.log_rpow hq t, fun b A B hA hB => Real.logb_mul hA.ne' hB.ne',
    fun c x hc => Real.rpow_pos_of_pos hc x⟩
  rw [← Real.rpow_natCast, ← Real.rpow_mul ha, mul_one_div]

/-- Predpostavki `povzetek` se dasta izpolniti (a = 4, n = 2). -/
example : (0:ℝ) ≤ 4 ∧ (2:ℕ) ≠ 0 := by norm_num

/-! ## Za maturo -/

/-- Predpostavke trditve `povzetek` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 4 ∧ (2:ℕ) ≠ 0 := by norm_num
  povzetek (ha := w.1) (_hn := w.2)

/-- Naloga 1: f(x) = log₃(x + 1) − 2 je log₃ x, premaknjen za 1 v levo in 2 navzdol; definiran je za x + 1 > 0,
torej x > −1 (asimptota x = −1); ničla: log₃(x + 1) = 2 ⟺ x + 1 = 3² = 9 ⟺ x = 8; f(0) = log₃ 1 − 2 = −2.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#naloga1
besedilo: »Ničla: $\log_3 (x + 1) = 2$ da $x + 1 = 3^2 = 9$, torej $x = 8$; pogoj $x > -1$ velja.« -/
theorem naloga1 :
    (∀ x : ℝ, Real.logb 3 (x + 1) - 2 = Real.logb 3 (x - (-1)) + (-2)) ∧ (∀ x : ℝ, 0 < x + 1 ↔ -1 < x) ∧
    (∀ x : ℝ, -1 < x → (Real.logb 3 (x + 1) - 2 = 0 ↔ x = 8)) ∧
    Real.logb 3 ((0:ℝ) + 1) - 2 = Real.logb 3 1 - 2 ∧ Real.logb 3 1 - 2 = -2 := by
  refine ⟨fun x => by rw [sub_neg_eq_add]; ring, fun x => ⟨fun h => by linarith, fun h => by linarith⟩, fun x hx => ?_,
    by norm_num, by rw [Real.logb_one]; norm_num⟩
  rw [sub_eq_zero, Real.logb_eq_iff_rpow_eq (by norm_num) (by norm_num) (by linarith),
    rpow_nar _ _ 2 (by norm_num)]
  constructor
  · intro h; norm_num at h; linarith
  · intro h; rw [h]; norm_num

open Filter Topology in
/-- Naloga 1 (asimptota x = −1): ko gre x z desne proti −1, gre log₃(x + 1) − 2 proti −∞.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#naloga1-asimptota
besedilo: »$f(x) = \log_3 (x + 1) - 2$« -/
theorem naloga1_asimptota : Tendsto (fun x : ℝ => Real.logb 3 (x + 1) - 2) (𝓝[>] (-1)) atBot := by
  have h1 : Tendsto (fun x : ℝ => x + 1) (𝓝[>] (-1)) (𝓝[>] 0) := by
    have c : Tendsto (fun x : ℝ => x + 1) (𝓝 (-1)) (𝓝 0) :=
      (by fun_prop : Continuous fun x : ℝ => x + 1).tendsto' (-1) 0 (by norm_num)
    refine tendsto_nhdsWithin_of_tendsto_nhds_of_eventually_within _ (c.mono_left nhdsWithin_le_nhds) ?_
    · filter_upwards [self_mem_nhdsWithin] with x hx; simp only [mem_Ioi] at hx ⊢; linarith
  have h2 := (Real.tendsto_log_nhdsGT_zero.comp h1).atBot_div_const (Real.log_pos (by norm_num : (1:ℝ) < 3))
  have h3 := tendsto_atBot_add_const_right _ (-2) h2
  simpa [Real.logb, sub_eq_add_neg] using h3

/-- Pomožna trditev (ravnina ℂ): razdalja točk z razliko a + bi je √(a² + b²).
pomozno -/
theorem razd (z w : ℂ) (a b : ℝ) (h : z - w = a + b * Complex.I) : dist z w = √(a ^ 2 + b ^ 2) := by
  rw [dist_eq_norm, h, Complex.norm_def, Complex.normSq_apply]; simp; ring_nf
/-- Pomožna trditev (ravnina ℂ): če je skalarni produkt vektorjev BA→ = a + bi in BC→ = c + di enak 0, je
∠ABC = 90°.
pomozno -/
theorem pravi (A B C : ℂ) (a b c d : ℝ) (h1 : A - B = a + b * Complex.I) (h2 : C - B = c + d * Complex.I)
    (h : a * c + b * d = 0) : EuclideanGeometry.angle A B C = π / 2 := by
  rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two, vsub_eq_sub,
    vsub_eq_sub, h1, h2]
  simp [Complex.inner]; linarith
/-- Predpostavke `razd` in `pravi` se dajo izpolniti (A = 1, B = 0, C = i). -/
example : (1:ℂ) - 0 = ((1:ℝ):ℂ) + ((0:ℝ):ℂ) * Complex.I ∧ Complex.I - 0 = ((0:ℝ):ℂ) + ((1:ℝ):ℂ) * Complex.I ∧
    (1:ℝ) * 0 + 0 * 1 = 0 := by
  refine ⟨by push_cast; ring, by push_cast; ring, by norm_num⟩

/-- Naloga 2 a) (in blok RACUN): tan α = 0,45/6 = 0,075 in α = arctan 0,075 ≈ 4,29°.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#naloga2-a
besedilo: »zato $\tan \alpha = \frac{0{,}45}{6} = 0{,}075$ in $\alpha \approx 4{,}29^\circ$.« -/
theorem naloga2_a :
    (0.45 : ℝ) / 6 = 0.075 ∧ |Real.arctan 0.075 * 180 / π - 4.29| < 0.005 := by
  refine ⟨by norm_num, ?_⟩
  obtain ⟨s1, s2⟩ := sin_meja 4.285 0.074717661800 0.074717661805 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  obtain ⟨c1, c2⟩ := cos_meja 4.285 0.997204728734 0.997204728740 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  obtain ⟨s3, s4⟩ := sin_meja 4.295 0.074891705719 0.074891705725 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  obtain ⟨c3, c4⟩ := cos_meja 4.295 0.997191672853 0.997191672859 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  obtain ⟨l, u⟩ := arctan_stopinj 0.075 4.285 4.295 (by norm_num) (by norm_num) (by norm_num)
    (by linarith) (by linarith)
  rw [abs_lt]; constructor <;> linarith

/-- Naloga 2 b), c) (in blok RACUN): d = √(6² + 0,45²) = √36,2025 ≈ 6,02 m; steber: podobni trikotnik s
koeficientom 2/6 = 1/3, višina h/2 = 0,45/6 ⟺ h = 0,45/3 = 0,45·2/6 = 0,15 m.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#naloga2-bc
besedilo: »$d = \sqrt{6^2 + 0{,}45^2} = \sqrt{36{,}2025} \approx 6{,}02\,\mathrm{m}$« -/
theorem naloga2_bc :
    (6:ℝ) ^ 2 + 0.45 ^ 2 = 36.2025 ∧ |√(36.2025 : ℝ) - 6.02| < 0.005 ∧ (2:ℝ) / 6 = 1 / 3 ∧
    (∀ h : ℝ, h / 2 = 0.45 / 6 ↔ h = 0.15) ∧ (0.45 : ℝ) / 3 = 0.15 ∧ (0.45 : ℝ) * 2 / 6 = 0.15 := by
  have s1 : (6.015 : ℝ) < √36.2025 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have s2 : √(36.2025 : ℝ) < 6.025 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num, by rw [abs_lt]; constructor <;> linarith, by norm_num,
    fun h => ⟨fun e => by linarith, fun e => by rw [e]; norm_num⟩, by norm_num, by norm_num⟩

/-- Naloga 2 (geometrija klančine v ℂ: spodnji konec A = 0, vznožje B = 6, vrh T = 6 + 0,45i): pravi kot pri B, zato
po definiciji tan α = tan ∠BAT = |TB|/|AB| = 0,45/6; klančina je hipotenuza |AT| = √(6² + 0,45²); vrh stebra
Q = 2 + 0,15i = ⅓·T leži na klančini, steber PQ (P = 2) je navpičen (pravi kot pri P), trikotnik APQ ima isti kot α
pri A (podobnost s koeficientom 1/3) in steber meri |PQ| = 0,15 m.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#naloga2-geometrija
besedilo: »c) Steber, klančina in tla tvorijo trikotnik, podoben celemu (skupen kot $\alpha$, oba pravokotna). Koeficient podobnosti je $\frac{2}{6} = \frac{1}{3}$, zato je steber visok $\frac{0{,}45}{3} = 0{,}15\,\mathrm{m}$.« -/
theorem naloga2_geometrija :
    EuclideanGeometry.angle (6 + 0.45 * Complex.I) (6:ℂ) 0 = π / 2 ∧
    Real.tan (EuclideanGeometry.angle (6:ℂ) 0 (6 + 0.45 * Complex.I)) = 0.45 / 6 ∧
    dist (0:ℂ) (6 + 0.45 * Complex.I) = √(6 ^ 2 + 0.45 ^ 2) ∧
    (2 + 0.15 * Complex.I : ℂ) = ((1 / 3 : ℝ) : ℂ) * (6 + 0.45 * Complex.I) ∧
    EuclideanGeometry.angle (2 + 0.15 * Complex.I) (2:ℂ) 0 = π / 2 ∧
    EuclideanGeometry.angle (2:ℂ) 0 (2 + 0.15 * Complex.I) = EuclideanGeometry.angle (6:ℂ) 0 (6 + 0.45 * Complex.I) ∧
    dist (2 + 0.15 * Complex.I) (2:ℂ) = 0.15 := by
  have r1 := pravi (6 + 0.45 * Complex.I) 6 0 0 0.45 (-6) 0 (by push_cast; ring) (by push_cast; ring) (by norm_num)
  have dTB : dist (6 + 0.45 * Complex.I) (6:ℂ) = 0.45 := by
    rw [razd _ _ 0 0.45 (by push_cast; ring)]; norm_num [show (0.2025:ℝ) = 0.45 ^ 2 by norm_num]
  have dAB : dist (0:ℂ) 6 = 6 := by
    rw [razd _ _ (-6) 0 (by push_cast; ring)]; norm_num [show (36:ℝ) = 6 ^ 2 by norm_num]
  have t := EuclideanGeometry.tan_angle_of_angle_eq_pi_div_two r1
  refine ⟨r1, by rw [t, dTB, dAB], by rw [razd _ _ (-6) (-0.45) (by push_cast; ring)]; norm_num, by push_cast; ring,
    pravi _ _ _ 0 0.15 (-2) 0 (by push_cast; ring) (by push_cast; ring) (by norm_num), ?_,
    by rw [razd _ _ 0 0.15 (by push_cast; ring)]; norm_num [show (0.0225:ℝ) = 0.15 ^ 2 by norm_num]⟩
  rw [EuclideanGeometry.angle, EuclideanGeometry.angle, vsub_eq_sub, vsub_eq_sub, vsub_eq_sub, vsub_eq_sub,
    show (2:ℂ) - 0 = (1 / 3 : ℝ) • ((6:ℂ) - 0) by rw [Complex.real_smul]; push_cast; ring,
    show (2 + 0.15 * Complex.I : ℂ) - 0 = (1 / 3 : ℝ) • ((6 + 0.45 * Complex.I : ℂ) - 0) by
      rw [Complex.real_smul]; push_cast; ring,
    InnerProductGeometry.angle_smul_left_of_pos _ _ (by norm_num : (0:ℝ) < 1 / 3),
    InnerProductGeometry.angle_smul_right_of_pos _ _ (by norm_num : (0:ℝ) < 1 / 3)]

/-- Naloga 3 a), b): −x² + 2x + 8 = −(x − 4)(x + 2), ničli −2 in 4; abscisa temena p = −2/(2·(−1)) = 1,
q = f(1) = 9 je največja vrednost; f(x) ≥ 0 ⟺ x ∈ [−2, 4].
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#naloga3-ab
besedilo: »a) $-x^2 + 2x + 8 = -(x - 4)(x + 2)$, ničli sta $x_1 = -2$ in $x_2 = 4$. Abscisa temena je $p = -\frac{2}{2 \cdot (-1)} = 1$, $q = f(1) = 9$, teme $T(1, 9)$.« -/
theorem naloga3_ab :
    (∀ x : ℝ, -x ^ 2 + 2 * x + 8 = -(x - 4) * (x + 2)) ∧
    (∀ x : ℝ, -x ^ 2 + 2 * x + 8 = 0 ↔ x = -2 ∨ x = 4) ∧ -(2:ℝ) / (2 * (-1)) = 1 ∧
    -(1:ℝ) ^ 2 + 2 * 1 + 8 = 9 ∧ (∀ x : ℝ, -x ^ 2 + 2 * x + 8 ≤ 9) ∧
    (∀ x : ℝ, 0 ≤ -x ^ 2 + 2 * x + 8 ↔ x ∈ Icc (-2) 4) := by
  refine ⟨fun x => by ring, fun x => ?_, by norm_num, by norm_num, fun x => by nlinarith [sq_nonneg (x - 1)],
    fun x => ?_⟩
  · constructor
    · intro h
      have : (x - 4) * (x + 2) = 0 := by nlinarith
      rcases mul_eq_zero.mp this with h1 | h1
      · right; linarith
      · left; linarith
    · rintro (rfl | rfl) <;> norm_num
  · rw [mem_Icc]
    constructor
    · intro h
      constructor
      · by_contra h1; push Not at h1
        nlinarith [mul_pos (by linarith : (0:ℝ) < -2 - x) (by linarith : (0:ℝ) < 4 - x)]
      · by_contra h1; push Not at h1
        nlinarith [mul_pos (by linarith : (0:ℝ) < x - 4) (by linarith : (0:ℝ) < x + 2)]
    · rintro ⟨h1, h2⟩; nlinarith [mul_nonneg (by linarith : (0:ℝ) ≤ x + 2) (by linarith : (0:ℝ) ≤ 4 - x)]

/-- Naloga 3 c), d) (in blok RACUN): D_h = (−2, 4) (pod logaritmom strogo pozitivno); na D_h je h(x) = 3 ⟺ f(x) = 8
⟺ x(2 − x) = 0 ⟺ x = 0 ali x = 2, obe sta v D_h.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#naloga3-cd
besedilo: »d) $\log_2 f(x) = 3$ da $f(x) = 8$, torej $-x^2 + 2x = 0$ oziroma $x(2 - x) = 0$.« -/
theorem naloga3_cd :
    (∀ x : ℝ, 0 < -x ^ 2 + 2 * x + 8 ↔ x ∈ Ioo (-2) 4) ∧
    (∀ x : ℝ, x ∈ Ioo (-2) 4 → (Real.logb 2 (-x ^ 2 + 2 * x + 8) = 3 ↔ -x ^ 2 + 2 * x + 8 = 8)) ∧
    (∀ x : ℝ, -x ^ 2 + 2 * x + 8 = 8 ↔ x * (2 - x) = 0) ∧ (∀ x : ℝ, x * (2 - x) = 0 ↔ x = 0 ∨ x = 2) ∧
    (0:ℝ) ∈ Ioo (-2) 4 ∧ (2:ℝ) ∈ Ioo (-2) 4 := by
  have dom : ∀ x : ℝ, 0 < -x ^ 2 + 2 * x + 8 ↔ x ∈ Ioo (-2) 4 := fun x => by
    rw [mem_Ioo]
    constructor
    · intro h
      constructor
      · by_contra h1; push Not at h1
        nlinarith [mul_nonneg (by linarith : (0:ℝ) ≤ -2 - x) (by linarith : (0:ℝ) ≤ 4 - x)]
      · by_contra h1; push Not at h1
        nlinarith [mul_nonneg (by linarith : (0:ℝ) ≤ x - 4) (by linarith : (0:ℝ) ≤ x + 2)]
    · rintro ⟨h1, h2⟩; nlinarith [mul_pos (by linarith : (0:ℝ) < x + 2) (by linarith : (0:ℝ) < 4 - x)]
  refine ⟨dom, fun x hx => ?_, fun x => ⟨fun h => by linarith, fun h => by linarith⟩, fun x => ?_,
    by norm_num, by norm_num⟩
  · rw [Real.logb_eq_iff_rpow_eq (by norm_num) (by norm_num) ((dom x).mpr hx), rpow_nar _ _ 3 (by norm_num)]
    constructor
    · intro h; norm_num at h; linarith
    · intro h; rw [h]; norm_num
  · rw [mul_eq_zero, sub_eq_zero, eq_comm (a := (2:ℝ))]

/-- Naloga 3 e): log₂ strogo narašča, zato je h največja pri x = 1, kjer je f največja: na D_h je
h(x) ≤ h(1) = log₂ 9 = 2·log₂ 3.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#naloga3-e
besedilo: »Odgovor: ničli $-2$ in $4$, teme $T(1, 9)$; $f(x) \ge 0$ za $x \in [-2, 4]$; $D_h = (-2, 4)$; rešitvi $0$ in $2$; največja vrednost $h$ je $2\log_2 3$ pri $x = 1$.« -/
theorem naloga3_e :
    (∀ x : ℝ, x ∈ Ioo (-2) 4 → Real.logb 2 (-x ^ 2 + 2 * x + 8) ≤ Real.logb 2 9) ∧
    Real.logb 2 (-(1:ℝ) ^ 2 + 2 * 1 + 8) = Real.logb 2 9 ∧ Real.logb 2 9 = 2 * Real.logb 2 3 := by
  refine ⟨fun x hx => ?_, by norm_num, ?_⟩
  · have hp : 0 < -x ^ 2 + 2 * x + 8 := by
      rw [mem_Ioo] at hx
      nlinarith [mul_pos (by linarith [hx.1] : (0:ℝ) < x + 2) (by linarith [hx.2] : (0:ℝ) < 4 - x)]
    exact Real.logb_le_logb_of_le (by norm_num) hp (by nlinarith [sq_nonneg (x - 1)])
  · rw [show (9:ℝ) = 3 ^ 2 by norm_num, Real.logb_pow]; norm_num

/-! ## Ustna vprašanja in Drugače -/

/-- Ustno vprašanje 1: log_a x = y ⟺ a^y = x (a > 0, a ≠ 1, x > 0); log_a(xy) = log_a x + log_a y,
log_a(x/y) = log_a x − log_a y, log_a x^r = r·log_a x (x, y > 0); x(x − 2) > 0 velja tudi za x < 0, x > 2 pa ne.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#ustno1
besedilo: »Pravila: $\log_a (xy) = \log_a x + \log_a y$, $\log_a \frac{x}{y} = \log_a x - \log_a y$, $\log_a x^r = r \log_a x$.« -/
theorem ustno1 (a x y r : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (hx : 0 < x) (hy : 0 < y) :
    (Real.logb a x = r ↔ a ^ r = x) ∧ Real.logb a (x * y) = Real.logb a x + Real.logb a y ∧
    Real.logb a (x / y) = Real.logb a x - Real.logb a y ∧ Real.logb a (x ^ r) = r * Real.logb a x ∧
    (0 < (-1:ℝ) * ((-1) - 2) ∧ ¬ (2 < (-1:ℝ))) :=
  ⟨Real.logb_eq_iff_rpow_eq ha ha1 hx, Real.logb_mul hx.ne' hy.ne', Real.logb_div hx.ne' hy.ne',
    Real.logb_rpow_eq_mul_logb_of_pos hx, by norm_num, by norm_num⟩

/-- Predpostavke `ustno1` se dajo izpolniti (a = 2, x = y = 1). -/
example : (0:ℝ) < 2 ∧ (2:ℝ) ≠ 1 ∧ (0:ℝ) < 1 := by norm_num

/-- Predpostavke trditve `ustno1` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 2 ∧ (2:ℝ) ≠ 1 ∧ (0:ℝ) < 1 := by norm_num
  ustno1 (ha := w.1) (ha1 := w.2.1) (hx := w.2.2) (hy := w.1)

/-- Ustno vprašanje 2: za a > 0, a ≠ 1 ima a^x zalogo vrednosti (0, ∞), za a > 1 strogo narašča, za 0 < a < 1
strogo pada, gre skozi (0, 1); inverzna funkcija je log_a (log_a(a^x) = x, a^(log_a y) = y za y > 0), zato
(x, y) leži na grafu a^x natanko tedaj, ko (y, x) leži na grafu log_a (simetrija glede na y = x).
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#ustno2
besedilo: »Kot preslikava iz $\mathbb{R}$ na $(0, \infty)$ je bijektivna, njena inverzna funkcija je $\log_a x$; grafa sta simetrična glede na premico $y = x$.« -/
theorem ustno2 (a : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) :
    range (fun x : ℝ => a ^ x) = Ioi 0 ∧ (1 < a → StrictMono (fun x : ℝ => a ^ x)) ∧
    (a < 1 → StrictAnti (fun x : ℝ => a ^ x)) ∧ a ^ (0:ℝ) = 1 ∧
    (∀ x : ℝ, Real.logb a (a ^ x) = x) ∧ (∀ y : ℝ, 0 < y → a ^ Real.logb a y = y) ∧
    (∀ x y : ℝ, (y = a ^ x ↔ 0 < y ∧ x = Real.logb a y)) := by
  refine ⟨?_, fun h => fun x y hxy => (Real.rpow_lt_rpow_left_iff h).mpr hxy,
    fun h => fun x y hxy => (Real.rpow_lt_rpow_left_iff_of_base_lt_one ha h).mpr hxy, Real.rpow_zero a,
    fun x => Real.logb_rpow ha ha1, fun y hy => Real.rpow_logb ha ha1 hy, fun x y => ?_⟩
  · ext y
    simp only [mem_range, mem_Ioi]
    constructor
    · rintro ⟨x, rfl⟩; exact Real.rpow_pos_of_pos ha x
    · intro hy; exact ⟨Real.logb a y, Real.rpow_logb ha ha1 hy⟩
  · constructor
    · rintro rfl; exact ⟨Real.rpow_pos_of_pos ha x, (Real.logb_rpow ha ha1).symm⟩
    · rintro ⟨hy, rfl⟩; exact (Real.rpow_logb ha ha1 hy).symm

/-- Predpostavke `ustno2` se dajo izpolniti (a = 2). -/
example : (0:ℝ) < 2 ∧ (2:ℝ) ≠ 1 := by norm_num

/-- Predpostavke trditve `ustno2` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 2 ∧ (2:ℝ) ≠ 1 := by norm_num
  ustno2 (ha := w.1) (ha1 := w.2)

open Filter Topology in
/-- Ustno vprašanje 2 (vodoravna asimptota os x): za a > 1 gre a^x proti 0, ko gre x proti −∞, za 0 < a < 1
pa, ko gre x proti +∞.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#ustno2-asimptota
besedilo: »Za $a > 1$ strogo narašča, za $0 < a < 1$ strogo pada.« -/
theorem ustno2_asimptota (a : ℝ) (h0 : 0 < a) :
    (1 < a → Tendsto (fun x : ℝ => a ^ x) atBot (𝓝 0)) ∧ (a < 1 → Tendsto (fun x : ℝ => a ^ x) atTop (𝓝 0)) :=
  ⟨fun h => tendsto_rpow_atBot_of_base_gt_one a h, fun h => tendsto_rpow_atTop_of_base_lt_one a (by linarith) h⟩

/-- Predpostavka `ustno2_asimptota` se da izpolniti (a = 2). -/
example : (0:ℝ) < 2 := by norm_num

/-- Predpostavke trditve `ustno2_asimptota` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 2 := by norm_num
  ustno2_asimptota (h0 := w)

/-- Ustno vprašanje 3: v pravokotnem trikotniku (pravi kot pri C) je sin ∠CAB = |BC|/|AB|; zato imata trikotnika
z istim ostrim kotom enako razmerje nasprotne katete in hipotenuze.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#ustno3
besedilo: »Vsi pravokotni trikotniki z ostrim kotom $\alpha$ se ujemajo v dveh kotih, zato so po izreku KK podobni. V podobnih trikotnikih so razmerja ustreznih stranic enaka, torej je tudi razmerje $\frac{a}{c} = \sin \alpha$ v vseh enako.« -/
theorem ustno3 {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (A B C A' B' C' : P) (h : EuclideanGeometry.angle B C A = π / 2)
    (h' : EuclideanGeometry.angle B' C' A' = π / 2) (hB : B ≠ C) (hB' : B' ≠ C')
    (hα : EuclideanGeometry.angle C A B = EuclideanGeometry.angle C' A' B') :
    dist B C / dist B A = dist B' C' / dist B' A' := by
  rw [← EuclideanGeometry.sin_angle_of_angle_eq_pi_div_two h (Or.inl hB),
    ← EuclideanGeometry.sin_angle_of_angle_eq_pi_div_two h' (Or.inl hB'), hα]

/-- Predpostavke `ustno3` se dajo izpolniti: isti trikotnik i, 0, 1 v ℂ (pravi kot pri 0, i ≠ 0). -/
example : EuclideanGeometry.angle Complex.I (0:ℂ) 1 = π / 2 ∧ Complex.I ≠ 0 := by
  refine ⟨?_, Complex.I_ne_zero⟩
  rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
  simp [Complex.inner]

/-- Drugače: Bolj natančno (in blok RACUN): √(x + 2) = x ⟺ x = 2; s kvadriranjem x + 2 = x² ⟺ x = 2 ali x = −1, a
√(−1 + 2) = 1 ≠ −1 (tuja rešitev); nova neznanka s = 2^x je vedno pozitivna, zato negativen s zavržemo.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#bolj-natancno
besedilo: »Nova neznanka.** Pri $s = 2^x$ je $s > 0$. Če bi kvadratna enačba dala negativen $s$, ga zavržeš, ker $2^x$ ni nikoli negativen.« -/
theorem bolj_natancno :
    (∀ x : ℝ, √(x + 2) = x ↔ x = 2) ∧ (∀ x : ℝ, x + 2 = x ^ 2 ↔ x = 2 ∨ x = -1) ∧ √((-1:ℝ) + 2) = 1 ∧
    (1:ℝ) ≠ -1 ∧ ∀ x : ℝ, 0 < (2:ℝ) ^ x := by
  refine ⟨fun x => ?_, fun x => ?_, by norm_num, by norm_num, fun x => by positivity⟩
  · constructor
    · intro h
      have hx : 0 ≤ x := h ▸ Real.sqrt_nonneg _
      have h2 : x + 2 = x ^ 2 := by
        have := Real.sq_sqrt (show (0:ℝ) ≤ x + 2 by linarith); rw [h] at this; linarith
      have : (x - 2) * (x + 1) = 0 := by nlinarith
      rcases mul_eq_zero.mp this with h1 | h1
      · linarith
      · linarith
    · rintro rfl
      rw [show (2:ℝ) + 2 = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · constructor
    · intro h
      have : (x - 2) * (x + 1) = 0 := by nlinarith
      rcases mul_eq_zero.mp this with h1 | h1
      · left; linarith
      · right; linarith
    · rintro (rfl | rfl) <;> norm_num

/-! ## Preveri se -/

/-- Preveri se 2 (in blok RACUN): √32 = 2^(5/2), zato 2^(x+1) = √32 ⟺ x + 1 = 5/2 ⟺ x = 3/2 = 1,5.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#kviz2
besedilo: »$\sqrt{32} = 2^{5/2}$, zato $x + 1 = \frac{5}{2}$ in $x = \frac{3}{2} = 1{,}5$.« -/
theorem kviz2 (x : ℝ) : √32 = (2:ℝ) ^ (5 / 2 : ℝ) ∧ ((2:ℝ) ^ (x + 1) = √32 ↔ x = 1.5) := by
  have e : √32 = (2:ℝ) ^ (5 / 2 : ℝ) := by
    rw [Real.sqrt_eq_rpow, show (32:ℝ) = 2 ^ (5:ℝ) by rw [rpow_nar _ _ 5 (by norm_num)]; norm_num,
      ← Real.rpow_mul (by norm_num)]
    norm_num
  refine ⟨e, ?_⟩
  rw [e, (narasca 2 (by norm_num) _ _).1]
  constructor
  · intro h; linarith
  · intro h; rw [h]; norm_num

/-- Preveri se 3 (in blok RACUN): pri dvojnem odmerku 160·(1/2)^(t/6) = 10 ⟺ t = 24, čas se podaljša za
24 − 18 = 6 h.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#kviz3
besedilo: »Z grafa: koncentracija se razpolovi v $6$ urah. Dvojni odmerek $160\,\mathrm{mg/L}$ pade na $80\,\mathrm{mg/L}$ v $6$ urah, nato poteka enako kot prej. Iz $160 \cdot \left(\frac{1}{2}\right)^{t/6} = 10$ dobiš $t = 24\,\mathrm{h}$ namesto $18\,\mathrm{h}$.« -/
theorem kviz3 (t : ℝ) : (160 * (1 / 2 : ℝ) ^ (t / 6) = 10 ↔ t = 24) ∧ (24:ℝ) - 18 = 6 := by
  have e : (1 / 16 : ℝ) = (1 / 2) ^ (4:ℝ) := by rw [rpow_nar _ _ 4 (by norm_num)]; norm_num
  refine ⟨?_, by norm_num⟩
  rw [show 160 * (1 / 2 : ℝ) ^ (t / 6) = 10 ↔ (1 / 2 : ℝ) ^ (t / 6) = 1 / 16 by
    constructor <;> intro h <;> linarith, e, (pada (1 / 2) (by norm_num) (by norm_num) _ _).1]
  constructor <;> intro h <;> linarith

/-- Preveri se 4 (in blok RACUN): pogoj x > 3; (x + 3)(x − 3) = 2⁴ = 16 (ne 8), x² = 25, x = 5 (x = −5 ne izpolni
pogoja): log₂(x + 3) + log₂(x − 3) = 4 ⟺ x = 5.
trditev: MAT-SS-2/mesane-naloge-1-in-2-letnika#kviz4
besedilo: »Po definiciji logaritma je $(x + 3)(x - 3) = 2^4 = 16$, ne $8$ (to bi bilo $2^3$ ali $2 \cdot 4$). Pravilno: $x^2 = 25$, $x = 5$; $x = -5$ ne izpolni pogoja.« -/
theorem kviz4 :
    (∀ x : ℝ, 0 < x + 3 ∧ 0 < x - 3 ↔ 3 < x) ∧ (2:ℝ) ^ 4 = 16 ∧ (16:ℝ) ≠ 8 ∧
    (∀ x : ℝ, 3 < x → (Real.logb 2 (x + 3) + Real.logb 2 (x - 3) = 4 ↔ x = 5)) ∧ ¬ (3 < (-5 : ℝ)) := by
  refine ⟨fun x => ⟨fun h => by linarith [h.2], fun h => ⟨by linarith, by linarith⟩⟩, by norm_num, by norm_num,
    fun x hx => ?_, by norm_num⟩
  have h1 : x + 3 ≠ 0 := by intro h; linarith
  have h2 : x - 3 ≠ 0 := by intro h; linarith
  rw [← Real.logb_mul h1 h2,
    Real.logb_eq_iff_rpow_eq (by norm_num) (by norm_num) (by nlinarith), rpow_nar _ _ 4 (by norm_num)]
  constructor
  · intro h
    have : (x - 5) * (x + 5) = 0 := by nlinarith
    rcases mul_eq_zero.mp this with h3 | h3
    · linarith
    · linarith
  · intro h; rw [h]; norm_num

/-! ## Primeri izpolnljivosti (izrek, uporabljen na konkretnih vrednostih) -/

/-- Predpostavke trditve `ustno3` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : EuclideanGeometry.angle Complex.I (0:ℂ) 1 = π / 2 ∧ Complex.I ≠ 0 := by
    refine ⟨?_, Complex.I_ne_zero⟩
    rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [Complex.inner]
  ustno3 (h := w.1) (h' := w.1) (hB := w.2) (hB' := w.2) (hα := rfl)

/-- Predpostavke trditve `meja12` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  meja12.2.2 _ meja12.2.1

/-- Predpostavke trditve `primer3_t` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  And.intro (primer3_t.1 2 1 (by norm_num) (by norm_num))
    (primer3_t.2 _ (Real.rpow_logb (by positivity)
      (Real.rpow_lt_one (by norm_num) (by norm_num) (by norm_num)).ne (by norm_num)))

/-- Predpostavke trditve `primer3_zaokrozeno` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  primer3_zaokrozeno _ (Real.rpow_logb (by norm_num) (by norm_num) (by norm_num))

/-- Predpostavke trditve `odstotek_in_koren` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  odstotek_in_koren.2.2.2.2 3 4 (by norm_num) (by norm_num)

end Evklid.Lekcije.MAT_SS_2.MesaneNaloge1In2Letnika
