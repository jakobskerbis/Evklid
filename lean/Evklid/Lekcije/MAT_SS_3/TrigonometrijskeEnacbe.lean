/-
vir: content/lessons/MAT-SS-3/trigonometrijske-enacbe.md
sha256: e125598be1ba8eae20c707d846649526af5af8cf90c08260c33972ebff76ba4a
Ni v Leanu: simulacija »Trigonometrijska enačba sin x = a«, zgodba o Maji (koda), opisi z enotsko krožnico
(»premica seka krožnico v dveh točkah«; dokazane so splošne rešitve same), delovanje kalkulatorja (tipka
sin⁻¹, načina DEG/RAD; dokazane so vrednosti), Postopek in Pazi na (navodila), točkovanje. Koti so v
radianih (360° = 2π, kot θ° je θ·π/180), splošna rešitev je zapisana z `∃ k : ℤ`. Pri tangensu je dodan
pogoj `cos x ≠ 0`, ker je v Leanu `tan x = sin x / cos x` in `x/0 = 0` (sicer bi `tan(π/2) = 0` »rešil«
`tan x = 0`). Numerične vrednosti (arccos 0,3, arcsin(1/3), arcsin 0,8, arccos 0,1 …) so dokazane s
Taylorjevim polinomom stopnje 9 z ostankom (`Complex.exp_bound`, n = 10), mejo |π − 3,1415926536| ≤ 10⁻¹⁰
in monotonostjo arcsin/arccos; »≈« je ocena |x − približek| < pol enote zadnjega mesta. Razlaga napačnega
odgovora v Preveri se 3 (»na [0°, 360°) imata obe enačbi po dve rešitvi«) kot štetje rešitev: ni
dokazano, ker gre le za razlago napačnega odgovora (izbira obsega; isti postopek kot v `primer2`,
ki dokaže natanko dve rešitvi na [0, 2π); dokazani sta tudi splošni rešitvi `sin_splosna`, `tan_splosna`).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.TrigonometrijskeEnacbe

open Real

/-! ## Pomožne numerične ocene -/

/-- Pomožna trditev (Taylor z ostankom iz `Complex.exp_bound`, n = 10): za `|x| ≤ 1` sta `cos x` in `sin x`
oddaljena od Taylorjevih polinomov največ `|x|¹⁰·11/36288000`. -/
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

/-- Pomožna trditev: `|π − 3,1415926536| ≤ 10⁻¹⁰` (iz `pi_gt_d20`, `pi_lt_d20`). -/
theorem pi_blizu : |π - 3.1415926536| ≤ 1 / 10 ^ 10 := by
  have h1 := pi_gt_d20
  have h2 := pi_lt_d20
  rw [abs_le]; constructor <;> norm_num at * <;> linarith

/-- Pomožna trditev: `cos` pri kotu `θ°` (`0 ≤ θ ≤ 57`) je blizu Taylorjevega polinoma v
`q = θ·3,1415926536/180`. -/
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

/-- Pomožna trditev: `sin` pri kotu `θ°` (`0 ≤ θ ≤ 57`) je blizu Taylorjevega polinoma v
`q = θ·3,1415926536/180` (`pi_blizu` in Lipschitzova ocena `|sin x − sin q| ≤ |x − q|`). -/
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

/-- Pomožna trditev: `cos θ° = sin (90 − θ)°`. -/
theorem cos_v_sin (θ : ℝ) : Real.cos (θ * π / 180) = Real.sin ((90 - θ) * π / 180) := by
  rw [← Real.sin_pi_div_two_sub]; congr 1; ring

/-- Pomožna trditev: `sin θ° = cos (90 − θ)°`. -/
theorem sin_v_cos (θ : ℝ) : Real.sin (θ * π / 180) = Real.cos ((90 - θ) * π / 180) := by
  rw [← Real.cos_pi_div_two_sub]; congr 1; ring

/-- Pomožna trditev: če je `lo² < y < hi²` (`0 ≤ lo`, `0 < hi`), je `lo < √y < hi`. -/
theorem sqrt_med (y lo hi : ℝ) (hlo : 0 ≤ lo) (hhi : 0 < hi) (h1 : lo ^ 2 < y) (h2 : y < hi ^ 2) :
    lo < Real.sqrt y ∧ Real.sqrt y < hi :=
  ⟨(Real.lt_sqrt hlo).mpr h1, (Real.sqrt_lt' hhi).mpr h2⟩

/-- Predpostavke trditve `sqrt_med` se dajo izpolniti (`y = 4`, `lo = 1`, `hi = 3`). -/
example : (0:ℝ) ≤ 1 ∧ (0:ℝ) < 3 ∧ (1:ℝ) ^ 2 < 4 ∧ (4:ℝ) < 3 ^ 2 := by norm_num

/-- Pomožna trditev: če je `cos b < v < cos a` za `0 ≤ a < b ≤ π`, je `a < arccos v < b`. -/
theorem arccos_med (v a b : ℝ) (ha : 0 ≤ a) (hab : a < b) (hb : b ≤ π) (h1 : Real.cos b < v)
    (h2 : v < Real.cos a) : a < Real.arccos v ∧ Real.arccos v < b := by
  have hv1 : -1 ≤ v := (Real.neg_one_le_cos b).trans h1.le
  have hv2 : v ≤ 1 := h2.le.trans (Real.cos_le_one a)
  have hc := Real.cos_arccos hv1 hv2
  have ht0 := Real.arccos_nonneg v
  have htp := Real.arccos_le_pi v
  constructor
  · by_contra h
    push Not at h
    have : Real.cos a ≤ Real.cos (Real.arccos v) :=
      Real.cos_le_cos_of_nonneg_of_le_pi ht0 (hab.le.trans hb) h
    linarith
  · by_contra h
    push Not at h
    have : Real.cos (Real.arccos v) ≤ Real.cos b :=
      Real.cos_le_cos_of_nonneg_of_le_pi (ha.trans hab.le) htp h
    linarith

/-- Predpostavke trditve `arccos_med` se dajo izpolniti (`v = 0`, `a = 0`, `b = π`). -/
example : (0:ℝ) ≤ 0 ∧ (0:ℝ) < π ∧ Real.cos π < 0 ∧ (0:ℝ) < Real.cos 0 := by
  refine ⟨le_rfl, Real.pi_pos, by simp, by simp⟩

/-- Pomožna trditev: če je `sin a < v < sin b` za `−π/2 ≤ a < b ≤ π/2`, je `a < arcsin v < b`. -/
theorem arcsin_med (v a b : ℝ) (ha : -(π / 2) ≤ a) (hab : a < b) (hb : b ≤ π / 2)
    (h1 : Real.sin a < v) (h2 : v < Real.sin b) : a < Real.arcsin v ∧ Real.arcsin v < b := by
  have hv1 : -1 ≤ v := (Real.neg_one_le_sin a).trans h1.le
  have hv2 : v ≤ 1 := h2.le.trans (Real.sin_le_one b)
  have hs := Real.sin_arcsin hv1 hv2
  have ht0 := Real.neg_pi_div_two_le_arcsin v
  have htp := Real.arcsin_le_pi_div_two v
  constructor
  · by_contra h
    push Not at h
    have : Real.sin (Real.arcsin v) ≤ Real.sin a :=
      Real.sin_le_sin_of_le_of_le_pi_div_two ht0 (hab.le.trans hb) h
    linarith
  · by_contra h
    push Not at h
    have : Real.sin b ≤ Real.sin (Real.arcsin v) :=
      Real.sin_le_sin_of_le_of_le_pi_div_two (ha.trans hab.le) htp h
    linarith

/-- Predpostavke trditve `arcsin_med` se dajo izpolniti (`v = 0`, `a = −π/2`, `b = π/2`). -/
example : Real.sin (-(π / 2)) < 0 ∧ (0:ℝ) < Real.sin (π / 2) := by simp

/-- Pomožna trditev: spodnja in zgornja meja za `cos θ°` iz Taylorjevega polinoma (preverita jih `norm_num`). -/
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

/-- Pomožna trditev: spodnja in zgornja meja za `sin θ°` iz Taylorjevega polinoma. -/
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

/-- Pomožna trditev: iz `a·π/180 < x < b·π/180` sledi `a < x·180/π < b` (pretvorba v stopinje). -/
theorem v_stopinje (x a b : ℝ) (ha : a * π / 180 < x) (hb : x < b * π / 180) :
    a < x * 180 / π ∧ x * 180 / π < b := by
  have hpi := Real.pi_pos
  constructor
  · rw [lt_div_iff₀ hpi]; nlinarith
  · rw [div_lt_iff₀ hpi]; nlinarith

/-- Predpostavke trditve `v_stopinje` se dajo izpolniti (`x = π/180`, `a = 0`, `b = 2`). -/
example : (0:ℝ) * π / 180 < π / 180 ∧ π / 180 < 2 * π / 180 := by
  constructor <;> nlinarith [Real.pi_pos]


/-- Pomožna trditev: celo število `k` z `n − 1 < k < n + 1` je `n`. -/
theorem int_med (k n : ℤ) (h1 : (n : ℝ) - 1 < k) (h2 : (k : ℝ) < n + 1) : k = n := by
  have a : n - 1 < k := by exact_mod_cast h1
  have b : k < n + 1 := by exact_mod_cast h2
  omega

/-- Predpostavke trditve `int_med` se dajo izpolniti (`k = n = 0`). -/
example : ((0:ℤ) : ℝ) - 1 < ((0:ℤ) : ℝ) ∧ ((0:ℤ) : ℝ) < ((0:ℤ) : ℝ) + 1 := by norm_num

/-! ## Splošne rešitve (Razlaga 4, 5, Povzetek, Ponovitev) -/

/-- Razlaga 4 in Ustno vprašanje 1: za `−1 ≤ a ≤ 1`, `x₁ = arcsin a`, je `sin x = a` natanko tedaj, ko
`x = x₁ + k·360°` ali `x = 180° − x₁ + k·360°` (`k ∈ ℤ`; v radianih `360° = 2π`, `180° = π`). -/
theorem sin_splosna (a x : ℝ) (h1 : -1 ≤ a) (h2 : a ≤ 1) :
    Real.sin x = a ↔ ∃ k : ℤ, x = Real.arcsin a + k * (2 * π) ∨ x = π - Real.arcsin a + k * (2 * π) := by
  rw [← Real.sin_arcsin h1 h2, eq_comm, Real.sin_eq_sin_iff, Real.arcsin_sin' ⟨by
    linarith [Real.neg_pi_div_two_le_arcsin a], Real.arcsin_le_pi_div_two a⟩]
  · constructor
    · rintro ⟨k, h | h⟩
      · exact ⟨k, Or.inl (by rw [h]; ring)⟩
      · exact ⟨k, Or.inr (by rw [h]; ring)⟩
    · rintro ⟨k, h | h⟩
      · exact ⟨k, Or.inl (by rw [h]; ring)⟩
      · exact ⟨k, Or.inr (by rw [h]; ring)⟩

/-- Predpostavke trditve `sin_splosna` se dajo izpolniti (`a = 0`). -/
example : (-1:ℝ) ≤ 0 ∧ (0:ℝ) ≤ 1 := by norm_num

/-- Razlaga 4: za `−1 ≤ a ≤ 1`, `x₁ = arccos a`, je `cos x = a` natanko tedaj, ko `x = ±x₁ + k·360°`. -/
theorem cos_splosna (a x : ℝ) (h1 : -1 ≤ a) (h2 : a ≤ 1) :
    Real.cos x = a ↔ ∃ k : ℤ, x = Real.arccos a + k * (2 * π) ∨ x = -Real.arccos a + k * (2 * π) := by
  rw [← Real.cos_arccos h1 h2, eq_comm, Real.cos_eq_cos_iff, Real.arccos_cos (Real.arccos_nonneg _)
    (Real.arccos_le_pi _)]
  constructor
  · rintro ⟨k, h | h⟩
    · exact ⟨k, Or.inl (by rw [h]; ring)⟩
    · exact ⟨k, Or.inr (by rw [h]; ring)⟩
  · rintro ⟨k, h | h⟩
    · exact ⟨k, Or.inl (by rw [h]; ring)⟩
    · exact ⟨k, Or.inr (by rw [h]; ring)⟩

/-- Predpostavke trditve `cos_splosna` se dajo izpolniti (`a = 0`). -/
example : (-1:ℝ) ≤ 0 ∧ (0:ℝ) ≤ 1 := by norm_num

/-- Razlaga 4: za vsak `a`, `x₁ = arctan a`, je `tan x = a` (kjer je tangens definiran, `cos x ≠ 0`) natanko
tedaj, ko `x = x₁ + k·180°`. (V Leanu je `tan x = sin x / cos x` in `x/0 = 0`, zato pogoj `cos x ≠ 0`.) -/
theorem tan_splosna (a x : ℝ) :
    (Real.tan x = a ∧ Real.cos x ≠ 0) ↔ ∃ k : ℤ, x = Real.arctan a + k * π := by
  have hc := Real.cos_arctan_pos a
  have ht := Real.tan_arctan a
  constructor
  · rintro ⟨h, hx⟩
    have hs1 : Real.sin x = a * Real.cos x := by
      have h' := h; rw [Real.tan_eq_sin_div_cos, div_eq_iff hx] at h'; exact h'
    have hs2 : Real.sin (Real.arctan a) = a * Real.cos (Real.arctan a) := by
      have h' := ht; rw [Real.tan_eq_sin_div_cos, div_eq_iff hc.ne'] at h'; exact h'
    have h0 : Real.sin (x - Real.arctan a) = 0 := by
      rw [Real.sin_sub, hs1, hs2]; ring
    obtain ⟨n, hn⟩ := Real.sin_eq_zero_iff.mp h0
    exact ⟨n, by linarith⟩
  · rintro ⟨k, rfl⟩
    refine ⟨by rw [Real.tan_add_int_mul_pi, ht], ?_⟩
    rw [Real.cos_add_int_mul_pi]
    exact mul_ne_zero (zpow_ne_zero _ (by norm_num)) hc.ne'

/-- Razlaga 4 in Povzetek: za `a > 1` ali `a < −1` enačbi `sin x = a` in `cos x = a` nimata rešitev. -/
theorem brez_resitev (a x : ℝ) (ha : 1 < |a|) : Real.sin x ≠ a ∧ Real.cos x ≠ a := by
  constructor
  · rintro rfl; exact absurd (Real.abs_sin_le_one x) (not_le.mpr ha)
  · rintro rfl; exact absurd (Real.abs_cos_le_one x) (not_le.mpr ha)

/-- Predpostavke trditve `brez_resitev` se dajo izpolniti (`a = 1,2`, Pogoste napake). -/
example : (1:ℝ) < |1.2| := by norm_num [abs_of_pos]

/-! ## Krožne funkcije (Razlaga 3, Povzetek) -/

/-- Razlaga 3: `arcsin a ∈ [−90°, 90°]`, `arccos a ∈ [0°, 180°]`, `arctan a ∈ (−90°, 90°)`; za `|a| ≤ 1` je
`sin (arcsin a) = a` in `cos (arccos a) = a`, za vsak `a` pa `tan (arctan a) = a`. -/
theorem krozne_funkcije (a : ℝ) :
    (-(π / 2) ≤ Real.arcsin a ∧ Real.arcsin a ≤ π / 2) ∧ (0 ≤ Real.arccos a ∧ Real.arccos a ≤ π) ∧
    (-(π / 2) < Real.arctan a ∧ Real.arctan a < π / 2) ∧ Real.tan (Real.arctan a) = a ∧
    (-1 ≤ a → a ≤ 1 → Real.sin (Real.arcsin a) = a ∧ Real.cos (Real.arccos a) = a) :=
  ⟨⟨Real.neg_pi_div_two_le_arcsin a, Real.arcsin_le_pi_div_two a⟩,
    ⟨Real.arccos_nonneg a, Real.arccos_le_pi a⟩, ⟨Real.neg_pi_div_two_lt_arctan a, Real.arctan_lt_pi_div_two a⟩,
    Real.tan_arctan a, fun h1 h2 => ⟨Real.sin_arcsin h1 h2, Real.cos_arccos h1 h2⟩⟩

/-- Razlaga 3 in Povzetek: `arcsin(−a) = −arcsin a`, `arctan(−a) = −arctan a`, `arccos(−a) = 180° − arccos a`. -/
theorem lihost (a : ℝ) : Real.arcsin (-a) = -Real.arcsin a ∧ Real.arctan (-a) = -Real.arctan a ∧
    Real.arccos (-a) = π - Real.arccos a :=
  ⟨Real.arcsin_neg a, Real.arctan_neg a, Real.arccos_neg a⟩

/-- Razlaga 3 (in `<<RACUN`): `arcsin(√3/2) = 60°`, `arccos 0 = 90°`, `arctan 1 = 45°`, `arcsin(1/2) = 30° = π/6`,
`arcsin(−1/2) = −30°`, `arctan(−1) = −45°`, `arccos(−1/2) = 180° − 60° = 120° = 2π/3`. -/
theorem znane_vrednosti :
    Real.arcsin (Real.sqrt 3 / 2) = π / 3 ∧ Real.arccos 0 = π / 2 ∧ Real.arctan 1 = π / 4 ∧
    Real.arcsin (1 / 2) = π / 6 ∧ Real.arcsin (-(1 / 2)) = -(π / 6) ∧ Real.arctan (-1) = -(π / 4) ∧
    Real.arccos (-(1 / 2)) = π - π / 3 ∧ π - π / 3 = 2 * π / 3 := by
  have hpi := Real.pi_pos
  have h1 : Real.arcsin (Real.sqrt 3 / 2) = π / 3 := by
    rw [← Real.sin_pi_div_three]; exact Real.arcsin_sin (by linarith) (by linarith)
  have h2 : Real.arcsin (1 / 2) = π / 6 := by
    rw [← Real.sin_pi_div_six]; exact Real.arcsin_sin (by linarith) (by linarith)
  have h3 : Real.arccos (1 / 2) = π / 3 := by
    rw [← Real.cos_pi_div_three]; exact Real.arccos_cos (by linarith) (by linarith)
  refine ⟨h1, Real.arccos_zero, Real.arctan_one, h2, by rw [Real.arcsin_neg, h2], by
    rw [Real.arctan_neg, Real.arctan_one], by rw [Real.arccos_neg, h3], by ring⟩

/-- Razlaga 3 in `<<RACUN`: v stopinjah `arcsin(√3/2)·180/π = 60`, `arccos 0·180/π = 90`, `arctan 1·180/π = 45`,
`arcsin(−1/2)·180/π = −30`, `arctan(−1)·180/π = −45`, `arccos(−1/2)·180/π = 120`. -/
theorem znane_vrednosti_stopinje :
    Real.arcsin (Real.sqrt 3 / 2) * 180 / π = 60 ∧ Real.arccos 0 * 180 / π = 90 ∧
    Real.arctan 1 * 180 / π = 45 ∧ Real.arcsin (-(1 / 2)) * 180 / π = -30 ∧
    Real.arctan (-1) * 180 / π = -45 ∧ Real.arccos (-(1 / 2)) * 180 / π = 120 := by
  obtain ⟨h1, h2, h3, -, h5, h6, h7, -⟩ := znane_vrednosti
  have hpi := Real.pi_pos.ne'
  rw [h1, h2, h3, h5, h6, h7]
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_⟩ <;> field_simp <;> ring

/-- Primer 5 (in `<<RACUN`): `arcsin(−√3/2) = −60° = −π/3`, `arccos(−√2/2) = 180° − 45° = 135° = 3π/4`,
`arctan(−√3/3) = −30° = −π/6`; Preveri se 6: `arccos(−√3/2) = 180° − 30° = 150°`. -/
theorem primer5_tocno :
    Real.arcsin (-(Real.sqrt 3 / 2)) = -(π / 3) ∧ Real.arccos (-(Real.sqrt 2 / 2)) = 3 * π / 4 ∧
    Real.arctan (-(Real.sqrt 3 / 3)) = -(π / 6) ∧ Real.arccos (-(Real.sqrt 3 / 2)) = 5 * π / 6 ∧
    Real.arccos (-(Real.sqrt 3 / 2)) * 180 / π = 150 := by
  have hpi := Real.pi_pos
  have h1 : Real.arcsin (Real.sqrt 3 / 2) = π / 3 := znane_vrednosti.1
  have h2 : Real.arccos (Real.sqrt 2 / 2) = π / 4 := by
    rw [← Real.cos_pi_div_four]; exact Real.arccos_cos (by linarith) (by linarith)
  have h3 : Real.arctan (Real.sqrt 3 / 3) = π / 6 := by
    have e : Real.sqrt 3 / 3 = 1 / Real.sqrt 3 := by
      have h3' : Real.sqrt 3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
      have hs : Real.sqrt 3 ≠ 0 := by positivity
      field_simp; linarith
    rw [e, ← Real.tan_pi_div_six]; exact Real.arctan_tan (by linarith) (by linarith)
  have h4 : Real.arccos (Real.sqrt 3 / 2) = π / 6 := by
    rw [← Real.cos_pi_div_six]; exact Real.arccos_cos (by linarith) (by linarith)
  have h5 : Real.arccos (-(Real.sqrt 3 / 2)) = 5 * π / 6 := by rw [Real.arccos_neg, h4]; ring
  refine ⟨by rw [Real.arcsin_neg, h1], by rw [Real.arccos_neg, h2]; ring, by rw [Real.arctan_neg, h3], h5, ?_⟩
  rw [h5]; field_simp; ring

/-! ## Rešitve na intervalu -/

/-- Pomožna trditev: član družine `x = c·π + k·p·π` z `l·π ≤ x < h·π` zadošča `l ≤ c + k·p < h`. -/
theorem druzina_pi (c p l h x : ℝ) (k : ℤ) (hx : x = c * π + k * (p * π)) (h1 : l * π ≤ x)
    (h2 : x < h * π) : l ≤ c + k * p ∧ c + k * p < h := by
  have hpi := Real.pi_pos
  rw [hx] at h1 h2
  constructor
  · by_contra hc; push Not at hc; nlinarith
  · by_contra hc; push Not at hc; nlinarith

/-- Predpostavke trditve `druzina_pi` se dajo izpolniti (`x = 0`, `c = 0`, `k = 0`, `l = 0`, `h = 1`). -/
example : (0:ℝ) = 0 * π + ((0:ℤ):ℝ) * (2 * π) ∧ (0:ℝ) * π ≤ 0 ∧ (0:ℝ) < 1 * π := by
  refine ⟨by simp, by simp, by simp [Real.pi_pos]⟩

/-- Razlaga 1, 2: `sin x = 1/2` natanko pri `x = 30° + k·360°` ali `x = 150° + k·360°`. -/
theorem sin_pol (x : ℝ) : Real.sin x = 1 / 2 ↔ ∃ k : ℤ, x = π / 6 + k * (2 * π) ∨ x = 5 * π / 6 + k * (2 * π) := by
  rw [sin_splosna _ _ (by norm_num) (by norm_num), znane_vrednosti.2.2.2.1]
  constructor
  · rintro ⟨k, hk | hk⟩
    · exact ⟨k, Or.inl hk⟩
    · exact ⟨k, Or.inr (by rw [hk]; ring)⟩
  · rintro ⟨k, hk | hk⟩
    · exact ⟨k, Or.inl hk⟩
    · exact ⟨k, Or.inr (by rw [hk]; ring)⟩

/-- Razlaga 2, tabela: `30°, 390°, 750°, −330°` (prva družina) in `150°, 510°, 870°, −210°` (druga družina) so
rešitve `sin x = 1/2`. -/
theorem tabela_druzin :
    Real.sin (30 * π / 180) = 1 / 2 ∧ Real.sin (390 * π / 180) = 1 / 2 ∧ Real.sin (750 * π / 180) = 1 / 2 ∧
    Real.sin (-330 * π / 180) = 1 / 2 ∧ Real.sin (150 * π / 180) = 1 / 2 ∧
    Real.sin (510 * π / 180) = 1 / 2 ∧ Real.sin (870 * π / 180) = 1 / 2 ∧
    Real.sin (-210 * π / 180) = 1 / 2 := by
  refine ⟨(sin_pol _).mpr ⟨0, Or.inl (by push_cast; ring)⟩, (sin_pol _).mpr ⟨1, Or.inl (by push_cast; ring)⟩,
    (sin_pol _).mpr ⟨2, Or.inl (by push_cast; ring)⟩, (sin_pol _).mpr ⟨-1, Or.inl (by push_cast; ring)⟩,
    (sin_pol _).mpr ⟨0, Or.inr (by push_cast; ring)⟩, (sin_pol _).mpr ⟨1, Or.inr (by push_cast; ring)⟩,
    (sin_pol _).mpr ⟨2, Or.inr (by push_cast; ring)⟩, (sin_pol _).mpr ⟨-1, Or.inr (by push_cast; ring)⟩⟩

/-- Razlaga 5: v radianih `sin x = 0,5` natanko pri `x = π/6 + 2kπ` ali `x = 5π/6 + 2kπ`. -/
theorem sin_pol_radiani (x : ℝ) :
    Real.sin x = 0.5 ↔ ∃ k : ℤ, x = π / 6 + 2 * k * π ∨ x = 5 * π / 6 + 2 * k * π := by
  rw [show (0.5:ℝ) = 1 / 2 by norm_num, sin_pol]
  constructor <;> rintro ⟨k, hk | hk⟩ <;> refine ⟨k, ?_⟩ <;> [left; right; left; right] <;>
    (rw [hk]; ring)

/-- Zakaj se tega učimo in Razlaga 2, premisli: telefon se vrti s 6° na sekundo; v prvih 120 s pokaže
`sin x = 0,5` natanko ob 5, 25, 65 in 85 s. -/
theorem telefon (t : ℝ) (h0 : 0 ≤ t) (h1 : t < 120) :
    Real.sin (6 * t * π / 180) = 1 / 2 ↔ t = 5 ∨ t = 25 ∨ t = 65 ∨ t = 85 := by
  rw [sin_pol]
  constructor
  · rintro ⟨k, hk | hk⟩
    · obtain ⟨a, b⟩ := druzina_pi (1 / 6) 2 0 4 (6 * t * π / 180) k (by rw [hk]; ring) (by nlinarith [Real.pi_pos])
        (by nlinarith [Real.pi_pos])
      have hk' : t = 5 + 60 * k := by
        have := mul_right_cancel₀ Real.pi_ne_zero (show (t / 30) * π = (1 / 6 + 2 * k) * π by linarith)
        linarith
      have e1 : -1 < k := by exact_mod_cast (show (-1:ℝ) < k by linarith)
      have e2 : k < 2 := by exact_mod_cast (show (k:ℝ) < 2 by linarith)
      interval_cases k
      · left; rw [hk']; norm_num
      · right; right; left; rw [hk']; norm_num
    · obtain ⟨a, b⟩ := druzina_pi (5 / 6) 2 0 4 (6 * t * π / 180) k (by rw [hk]; ring) (by nlinarith [Real.pi_pos])
        (by nlinarith [Real.pi_pos])
      have hk' : t = 25 + 60 * k := by
        have := mul_right_cancel₀ Real.pi_ne_zero (show (t / 30) * π = (5 / 6 + 2 * k) * π by linarith)
        linarith
      have e1 : -1 < k := by exact_mod_cast (show (-1:ℝ) < k by linarith)
      have e2 : k < 2 := by exact_mod_cast (show (k:ℝ) < 2 by linarith)
      interval_cases k
      · right; left; rw [hk']; norm_num
      · right; right; right; rw [hk']; norm_num
  · rintro (rfl | rfl | rfl | rfl)
    · exact ⟨0, Or.inl (by push_cast; ring)⟩
    · exact ⟨0, Or.inr (by push_cast; ring)⟩
    · exact ⟨1, Or.inl (by push_cast; ring)⟩
    · exact ⟨1, Or.inr (by push_cast; ring)⟩

/-- Predpostavke trditve `telefon` se dajo izpolniti (`t = 5`). -/
example : (0:ℝ) ≤ 5 ∧ (5:ℝ) < 120 := by norm_num

/-- Pomožna trditev: na `[0°, 360°)` je `cos x = 0` natanko pri 90° in 270°. -/
theorem cos_nic (x : ℝ) (h0 : 0 ≤ x) (h1 : x < 2 * π) : Real.cos x = 0 ↔ x = π / 2 ∨ x = 3 * π / 2 := by
  rw [Real.cos_eq_zero_iff]
  constructor
  · rintro ⟨k, hk⟩
    obtain ⟨a, b⟩ := druzina_pi (1 / 2) 1 0 2 (x) k (by rw [hk]; ring) (by linarith) (by linarith)
    have e1 : -1 < k := by exact_mod_cast (show (-1:ℝ) < k by linarith)
    have e2 : k < 2 := by exact_mod_cast (show (k:ℝ) < 2 by linarith)
    interval_cases k
    · left; rw [hk]; ring
    · right; rw [hk]; ring
  · rintro (rfl | rfl)
    · exact ⟨0, by push_cast; ring⟩
    · exact ⟨1, by push_cast; ring⟩

/-- Predpostavke trditve `cos_nic` se dajo izpolniti (`x = 0`). -/
example : (0:ℝ) ≤ 0 ∧ (0:ℝ) < 2 * π := ⟨le_rfl, by positivity⟩

/-- Pomožna trditev: na `[0°, 360°)` je `sin x = 1/2` natanko pri 30° in 150°. -/
theorem sin_pol_int (x : ℝ) (h0 : 0 ≤ x) (h1 : x < 2 * π) :
    Real.sin x = 1 / 2 ↔ x = π / 6 ∨ x = 5 * π / 6 := by
  rw [sin_pol]
  constructor
  · rintro ⟨k, hk | hk⟩
    · obtain ⟨a, b⟩ := druzina_pi (1 / 6) 2 0 2 (x) k (by rw [hk]; ring) (by linarith) (by linarith)
      have := int_med k 0 (by push_cast; linarith) (by push_cast; linarith)
      left; rw [hk, this]; simp
    · obtain ⟨a, b⟩ := druzina_pi (5 / 6) 2 0 2 (x) k (by rw [hk]; ring) (by linarith) (by linarith)
      have := int_med k 0 (by push_cast; linarith) (by push_cast; linarith)
      right; rw [hk, this]; simp
  · rintro (rfl | rfl)
    · exact ⟨0, Or.inl (by simp)⟩
    · exact ⟨0, Or.inr (by simp)⟩

/-- Predpostavke trditve `sin_pol_int` se dajo izpolniti (`x = 0`). -/
example : (0:ℝ) ≤ 0 ∧ (0:ℝ) < 2 * π := ⟨le_rfl, by positivity⟩

/-- Razlaga 5, premisli: `sin x = 1` ima na `[0°, 360°)` eno samo rešitev, 90° (`180° − 90° = 90°`). -/
theorem sin_ena (x : ℝ) (h0 : 0 ≤ x) (h1 : x < 2 * π) : Real.sin x = 1 ↔ x = π / 2 := by
  constructor
  · intro h
    have hc : Real.cos x = 0 := by
      have := Real.sin_sq_add_cos_sq x
      rw [h] at this; nlinarith [sq_nonneg (Real.cos x)]
    rcases (cos_nic x h0 h1).mp hc with h2 | h2
    · exact h2
    · rw [h2] at h
      rw [show 3 * π / 2 = π / 2 + π by ring, Real.sin_add_pi, Real.sin_pi_div_two] at h
      norm_num at h
  · rintro rfl; exact Real.sin_pi_div_two

/-- Predpostavke trditve `sin_ena` se dajo izpolniti (`x = 0`). -/
example : (0:ℝ) ≤ 0 ∧ (0:ℝ) < 2 * π := ⟨le_rfl, by positivity⟩

/-- Primer 1: `cos x = −1/2` natanko pri `x = ±120° + k·360°`; na `[0°, 360°)` sta rešitvi 120° in
`−120° + 360° = 240°`. -/
theorem primer1 :
    (∀ x : ℝ, Real.cos x = -(1 / 2) ↔
      ∃ k : ℤ, x = 2 * π / 3 + k * (2 * π) ∨ x = -(2 * π / 3) + k * (2 * π)) ∧
    (∀ x : ℝ, 0 ≤ x → x < 2 * π → (Real.cos x = -(1 / 2) ↔ x = 2 * π / 3 ∨ x = 4 * π / 3)) := by
  have ha : Real.arccos (-(1 / 2)) = 2 * π / 3 := by
    rw [znane_vrednosti.2.2.2.2.2.2.1]; ring
  have hg : ∀ x : ℝ, Real.cos x = -(1 / 2) ↔
      ∃ k : ℤ, x = 2 * π / 3 + k * (2 * π) ∨ x = -(2 * π / 3) + k * (2 * π) := by
    intro x; rw [cos_splosna _ _ (by norm_num) (by norm_num), ha]
  refine ⟨hg, fun x h0 h1 => ?_⟩
  rw [hg]
  constructor
  · rintro ⟨k, hk | hk⟩
    · obtain ⟨a, b⟩ := druzina_pi (2 / 3) 2 0 2 (x) k (by rw [hk]; ring) (by linarith) (by linarith)
      have := int_med k 0 (by push_cast; linarith) (by push_cast; linarith)
      left; rw [hk, this]; simp
    · obtain ⟨a, b⟩ := druzina_pi (-(2 / 3)) 2 0 2 (x) k (by rw [hk]; ring) (by linarith) (by linarith)
      have := int_med k 1 (by push_cast; linarith) (by push_cast; linarith)
      right; rw [hk, this]; push_cast; ring
  · rintro (rfl | rfl)
    · exact ⟨0, Or.inl (by simp)⟩
    · exact ⟨1, Or.inr (by push_cast; ring)⟩

/-- Primer 3: `325 sin(100πt) = 162,5` za `0 ≤ t < 0,02` natanko pri `t = 1/600 s` in `t = 1/120 s`
(`sin(100πt) = 162,5/325 = 0,5`, `y = 100πt`); `1/600 ≈ 0,00167`, `1/120 ≈ 0,00833`, perioda `1/50 = 0,02`. -/
theorem primer3 (t : ℝ) (h0 : 0 ≤ t) (h1 : t < 0.02) :
    ((162.5:ℝ) / 325 = 0.5 ∧ (1:ℝ) / 50 = 0.02) ∧
    (325 * Real.sin (100 * π * t) = 162.5 ↔ t = 1 / 600 ∨ t = 1 / 120) ∧
    |(1:ℝ) / 600 - 0.00167| < 0.000005 ∧ |(1:ℝ) / 120 - 0.00833| < 0.000005 := by
  refine ⟨⟨by norm_num, by norm_num⟩, ?_, by norm_num [abs_lt], by norm_num [abs_lt]⟩
  have e : 325 * Real.sin (100 * π * t) = 162.5 ↔ Real.sin (100 * π * t) = 1 / 2 := by
    constructor <;> intro h <;> linarith
  rw [e, sin_pol]
  constructor
  · rintro ⟨k, hk | hk⟩
    · obtain ⟨a, b⟩ := druzina_pi (1 / 6) 2 0 2 (100 * π * t) k (by rw [hk]; ring) (by nlinarith [Real.pi_pos])
        (by nlinarith [Real.pi_pos])
      have hk0 := int_med k 0 (by push_cast; linarith) (by push_cast; linarith)
      subst hk0
      push_cast at hk
      left
      have := mul_right_cancel₀ Real.pi_ne_zero (show (100 * t) * π = (1 / 6) * π by linarith)
      linarith
    · obtain ⟨a, b⟩ := druzina_pi (5 / 6) 2 0 2 (100 * π * t) k (by rw [hk]; ring) (by nlinarith [Real.pi_pos])
        (by nlinarith [Real.pi_pos])
      have hk0 := int_med k 0 (by push_cast; linarith) (by push_cast; linarith)
      subst hk0
      push_cast at hk
      right
      have := mul_right_cancel₀ Real.pi_ne_zero (show (100 * t) * π = (5 / 6) * π by linarith)
      linarith
  · rintro (rfl | rfl)
    · exact ⟨0, Or.inl (by push_cast; ring)⟩
    · exact ⟨0, Or.inr (by push_cast; ring)⟩

/-- Predpostavke trditve `primer3` se dajo izpolniti (`t = 0`). -/
example : (0:ℝ) ≤ 0 ∧ (0:ℝ) < 0.02 := by norm_num

/-- Primer 3, korak 3: iz `y = π/6 + 2kπ` ali `5π/6 + 2kπ` in `y = 100πt` sledi `t = 1/600 + k/50` ali
`t = 1/120 + k/50`. -/
theorem primer3_t (t : ℝ) (k : ℤ) :
    (100 * π * t = π / 6 + 2 * k * π ↔ t = 1 / 600 + k / 50) ∧
    (100 * π * t = 5 * π / 6 + 2 * k * π ↔ t = 1 / 120 + k / 50) := by
  have hpi := Real.pi_ne_zero
  constructor <;> constructor <;> intro h
  · have := mul_right_cancel₀ hpi (show (100 * t) * π = (1 / 6 + 2 * k) * π by linarith); linarith
  · rw [h]; ring
  · have := mul_right_cancel₀ hpi (show (100 * t) * π = (5 / 6 + 2 * k) * π by linarith); linarith
  · rw [h]; ring

/-- Primer 4 (in Pogoste napake): `sin 2x = cos x` je enakovredno `cos x (2 sin x − 1) = 0`; z deljenjem s
`cos x` bi izgubili 90° in 270°; na `[0°, 360°)` so rešitve 30°, 90°, 150°, 270°. -/
theorem primer4 (x : ℝ) (h0 : 0 ≤ x) (h1 : x < 2 * π) :
    (Real.sin (2 * x) = Real.cos x ↔ Real.cos x * (2 * Real.sin x - 1) = 0) ∧
    (Real.sin (2 * x) = Real.cos x ↔ x = π / 6 ∨ x = π / 2 ∨ x = 5 * π / 6 ∨ x = 3 * π / 2) := by
  have e : Real.sin (2 * x) = Real.cos x ↔ Real.cos x * (2 * Real.sin x - 1) = 0 := by
    rw [Real.sin_two_mul]; constructor <;> intro h <;> linarith
  refine ⟨e, ?_⟩
  rw [e, mul_eq_zero, cos_nic x h0 h1,
    show 2 * Real.sin x - 1 = 0 ↔ Real.sin x = 1 / 2 by constructor <;> intro h <;> linarith,
    sin_pol_int x h0 h1]
  tauto

/-- Predpostavke trditve `primer4` se dajo izpolniti (`x = 0`). -/
example : (0:ℝ) ≤ 0 ∧ (0:ℝ) < 2 * π := ⟨le_rfl, by positivity⟩

/-- Razlaga 6 in Primer 6, korak 1: vsota v produkt `sin α + sin β = 2 sin((α + β)/2) cos((α − β)/2)`, zato
`sin 3x + sin x = 2 sin 2x cos x`. -/
theorem vsota_v_produkt (α β x : ℝ) :
    Real.sin α + Real.sin β = 2 * Real.sin ((α + β) / 2) * Real.cos ((α - β) / 2) ∧
    Real.sin (3 * x) + Real.sin x = 2 * Real.sin (2 * x) * Real.cos x := by
  have key : ∀ α β : ℝ, Real.sin α + Real.sin β = 2 * Real.sin ((α + β) / 2) * Real.cos ((α - β) / 2) := by
    intro α β
    have h1 := Real.sin_add ((α + β) / 2) ((α - β) / 2)
    have h2 := Real.sin_sub ((α + β) / 2) ((α - β) / 2)
    rw [show (α + β) / 2 + (α - β) / 2 = α by ring] at h1
    rw [show (α + β) / 2 - (α - β) / 2 = β by ring] at h2
    rw [h1, h2]; ring
  refine ⟨key α β, ?_⟩
  rw [key]; congr 2 <;> ring_nf

/-- Primer 6: `sin 3x + sin x = cos x` je `cos x (2 sin 2x − 1) = 0`; na `[0°, 360°)` je šest rešitev:
15°, 75°, 90°, 195°, 255°, 270°. -/
theorem primer6 (x : ℝ) (h0 : 0 ≤ x) (h1 : x < 2 * π) :
    Real.sin (3 * x) + Real.sin x = Real.cos x ↔
      x = π / 12 ∨ x = 5 * π / 12 ∨ x = π / 2 ∨ x = 13 * π / 12 ∨ x = 17 * π / 12 ∨ x = 3 * π / 2 := by
  rw [(vsota_v_produkt 0 0 x).2]
  have e : 2 * Real.sin (2 * x) * Real.cos x = Real.cos x ↔ Real.cos x * (2 * Real.sin (2 * x) - 1) = 0 := by
    constructor <;> intro h <;> linarith
  rw [e, mul_eq_zero, cos_nic x h0 h1,
    show 2 * Real.sin (2 * x) - 1 = 0 ↔ Real.sin (2 * x) = 1 / 2 by constructor <;> intro h <;> linarith,
    sin_pol]
  constructor
  · rintro ((h | h) | ⟨k, hk | hk⟩)
    · right; right; left; exact h
    · right; right; right; right; right; exact h
    · obtain ⟨a, b⟩ := druzina_pi (1 / 6) 2 0 4 (2 * x) k (by rw [hk]; ring) (by linarith) (by linarith)
      have e1 : -1 < k := by exact_mod_cast (show (-1:ℝ) < k by linarith)
      have e2 : k < 2 := by exact_mod_cast (show (k:ℝ) < 2 by linarith)
      interval_cases k
      · left; linarith
      · right; right; right; left; push_cast at hk; linarith
    · obtain ⟨a, b⟩ := druzina_pi (5 / 6) 2 0 4 (2 * x) k (by rw [hk]; ring) (by linarith) (by linarith)
      have e1 : -1 < k := by exact_mod_cast (show (-1:ℝ) < k by linarith)
      have e2 : k < 2 := by exact_mod_cast (show (k:ℝ) < 2 by linarith)
      interval_cases k
      · right; left; push_cast at hk; linarith
      · right; right; right; right; left; push_cast at hk; linarith
  · rintro (rfl | rfl | rfl | rfl | rfl | rfl)
    · right; exact ⟨0, Or.inl (by push_cast; ring)⟩
    · right; exact ⟨0, Or.inr (by push_cast; ring)⟩
    · left; left; rfl
    · right; exact ⟨1, Or.inl (by push_cast; ring)⟩
    · right; exact ⟨1, Or.inr (by push_cast; ring)⟩
    · left; right; rfl

/-- Predpostavke trditve `primer6` se dajo izpolniti (`x = 0`). -/
example : (0:ℝ) ≤ 0 ∧ (0:ℝ) < 2 * π := ⟨le_rfl, by positivity⟩

/-! ## Numerične vrednosti krožnih funkcij -/

/-- Razlaga 3, Primer 5 (in `<<RACUN`): `arccos 0,3 ≈ 72,54° ≈ 1,266`, `arccos(−0,3) ≈ 107,46°`, preverba
`180° − 72,54° = 107,46°`. -/
theorem arccos_03 :
    |Real.arccos 0.3 * 180 / π - 72.54| < 0.005 ∧ |Real.arccos 0.3 - 1.266| < 0.0005 ∧
    |Real.arccos (-0.3) * 180 / π - 107.46| < 0.005 ∧ (180:ℝ) - 72.54 = 107.46 := by
  obtain ⟨l1, u1⟩ := sin_meja 17.46 0.300039 0.300041 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨l2, u2⟩ := sin_meja 17.455 0.299956 0.299958 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have hb := arccos_med 0.3 (72.54 * π / 180) (72.545 * π / 180) (by positivity)
    (by nlinarith [Real.pi_pos]) (by nlinarith [Real.pi_pos])
    (by rw [cos_v_sin]; norm_num at u2 ⊢; linarith) (by rw [cos_v_sin]; norm_num at l1 ⊢; linarith)
  obtain ⟨d1, d2⟩ := v_stopinje _ _ _ hb.1 hb.2
  have hpi1 := Real.pi_gt_d6
  have hpi2 := Real.pi_lt_d6
  have hneg : Real.arccos (-0.3) = π - Real.arccos 0.3 := Real.arccos_neg 0.3
  have hd : Real.arccos (-0.3) * 180 / π = 180 - Real.arccos 0.3 * 180 / π := by
    rw [hneg]; field_simp
  refine ⟨?_, ?_, ?_, by norm_num⟩
  · rw [abs_lt]; constructor <;> linarith
  · obtain ⟨b1, b2⟩ := hb
    rw [abs_lt]; constructor <;> nlinarith
  · rw [hd, abs_lt]; constructor <;> linarith

/-- Pomožna trditev: `19,471218° < arcsin(1/3) < 19,471223°`. -/
theorem arcsin_tretjina :
    19.471218 * π / 180 < Real.arcsin (1 / 3) ∧ Real.arcsin (1 / 3) < 19.471223 * π / 180 := by
  obtain ⟨l1, u1⟩ := sin_meja 19.471218 0.333333289 0.333333291 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  obtain ⟨l2, u2⟩ := sin_meja 19.471223 0.333333371 0.333333373 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  exact arcsin_med (1 / 3) _ _ (by nlinarith [Real.pi_pos]) (by nlinarith [Real.pi_pos])
    (by nlinarith [Real.pi_pos]) (by linarith) (by linarith)

/-- Primer 2 (in Pogoste napake): `3 sin x + 1 = 0` je `sin x = −1/3`; `x₁ = arcsin(−1/3) ≈ −19,47°`; na
`[0°, 360°)` sta rešitvi natanko `x₁ + 360° ≈ 340,53°` in `180° − x₁ ≈ 199,47°` (napačno bi bilo
`180° − 19,47° = 160,53°`, kjer je sinus pozitiven). -/
theorem primer2 :
    (∀ x : ℝ, 3 * Real.sin x + 1 = 0 ↔ Real.sin x = -(1 / 3)) ∧
    |Real.arcsin (-(1 / 3)) * 180 / π - (-19.47)| < 0.005 ∧
    (∀ x : ℝ, 0 ≤ x → x < 2 * π → (Real.sin x = -(1 / 3) ↔
      x = Real.arcsin (-(1 / 3)) + 2 * π ∨ x = π - Real.arcsin (-(1 / 3)))) ∧
    |(Real.arcsin (-(1 / 3)) + 2 * π) * 180 / π - 340.53| < 0.005 ∧
    |(π - Real.arcsin (-(1 / 3))) * 180 / π - 199.47| < 0.005 ∧
    (180:ℝ) - (-19.47) = 199.47 ∧ (180:ℝ) - 19.47 = 160.53 ∧ 0 < Real.sin (160.53 * π / 180) := by
  obtain ⟨a1, a2⟩ := arcsin_tretjina
  have hn : Real.arcsin (-(1 / 3)) = -Real.arcsin (1 / 3) := Real.arcsin_neg _
  have hpi := Real.pi_pos
  obtain ⟨d1, d2⟩ := v_stopinje _ _ _ a1 a2
  have e1 : Real.arcsin (-(1 / 3)) * 180 / π = -(Real.arcsin (1 / 3) * 180 / π) := by rw [hn]; ring
  have e2 : (Real.arcsin (-(1 / 3)) + 2 * π) * 180 / π = 360 - Real.arcsin (1 / 3) * 180 / π := by
    rw [hn]; field_simp; ring
  have e3 : (π - Real.arcsin (-(1 / 3))) * 180 / π = 180 + Real.arcsin (1 / 3) * 180 / π := by
    rw [hn]; field_simp; ring
  refine ⟨fun x => ⟨fun h => by linarith, fun h => by linarith⟩, ?_, fun x h0 h1 => ?_, ?_, ?_,
    by norm_num, by norm_num, ?_⟩
  · rw [e1, abs_lt]; constructor <;> linarith
  · rw [sin_splosna _ _ (by norm_num) (by norm_num), hn]
    constructor
    · rintro ⟨k, hk | hk⟩
      · left
        have hk1 : (k:ℝ) < 2 := by nlinarith
        have hk2 : (0:ℝ) < k := by nlinarith
        have : k = 1 := int_med k 1 (by push_cast; linarith) (by push_cast; linarith)
        rw [hk, this]; push_cast; ring
      · right
        have hk1 : (k:ℝ) < 1 := by nlinarith
        have hk2 : (-1:ℝ) < k := by nlinarith
        have : k = 0 := int_med k 0 (by push_cast; linarith) (by push_cast; linarith)
        rw [hk, this]; push_cast; ring
    · rintro (h | h)
      · exact ⟨1, Or.inl (by rw [h]; push_cast; ring)⟩
      · exact ⟨0, Or.inr (by rw [h]; push_cast; ring)⟩
  · rw [e2, abs_lt]; constructor <;> linarith
  · rw [e3, abs_lt]; constructor <;> linarith
  · apply Real.sin_pos_of_pos_of_lt_pi <;> nlinarith

/-- Pomožna trditev: `arccos(1/3) = 90° − arcsin(1/3)` in `arccos(−1/3) = 180° − arccos(1/3)`, zato
`109,471218° < arccos(−1/3) < 109,471223°`. -/
theorem arccos_minus_tretjina :
    109.471218 < Real.arccos (-(1 / 3)) * 180 / π ∧ Real.arccos (-(1 / 3)) * 180 / π < 109.471223 := by
  obtain ⟨a1, a2⟩ := arcsin_tretjina
  obtain ⟨d1, d2⟩ := v_stopinje _ _ _ a1 a2
  have h : Real.arccos (-(1 / 3)) * 180 / π = 90 + Real.arcsin (1 / 3) * 180 / π := by
    rw [Real.arccos_neg, Real.arccos_eq_pi_div_two_sub_arcsin]; field_simp; ring
  rw [h]; constructor <;> linarith

/-- Korak za korakom: `sin x = 0,8`, `x₁ = arcsin 0,8 ≈ 53,13°`, druga točka `180° − 53,13° = 126,87°`; na
`[0°, 720°)` so rešitve natanko `x₁`, `180° − x₁`, `x₁ + 360°`, `540° − x₁` (≈ 53,13°, 126,87°, 413,13°,
486,87°). -/
theorem sin_08 :
    |Real.arcsin 0.8 * 180 / π - 53.13| < 0.005 ∧ |(π - Real.arcsin 0.8) * 180 / π - 126.87| < 0.005 ∧
    |(Real.arcsin 0.8 + 2 * π) * 180 / π - 413.13| < 0.005 ∧
    |(3 * π - Real.arcsin 0.8) * 180 / π - 486.87| < 0.005 ∧ (180:ℝ) - 53.13 = 126.87 ∧
    ∀ x : ℝ, 0 ≤ x → x < 4 * π → (Real.sin x = 0.8 ↔ x = Real.arcsin 0.8 ∨ x = π - Real.arcsin 0.8 ∨
      x = Real.arcsin 0.8 + 2 * π ∨ x = 3 * π - Real.arcsin 0.8) := by
  obtain ⟨l1, u1⟩ := sin_meja 53.13 0.7999985 0.7999993 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨l2, u2⟩ := sin_meja 53.135 0.8000509 0.8000517 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  have hb := arcsin_med 0.8 (53.13 * π / 180) (53.135 * π / 180) (by nlinarith [Real.pi_pos])
    (by nlinarith [Real.pi_pos]) (by nlinarith [Real.pi_pos]) (by linarith) (by linarith)
  obtain ⟨d1, d2⟩ := v_stopinje _ _ _ hb.1 hb.2
  have hpi := Real.pi_pos
  have e2 : (π - Real.arcsin 0.8) * 180 / π = 180 - Real.arcsin 0.8 * 180 / π := by
    field_simp
  have e3 : (Real.arcsin 0.8 + 2 * π) * 180 / π = Real.arcsin 0.8 * 180 / π + 360 := by
    field_simp; ring
  have e4 : (3 * π - Real.arcsin 0.8) * 180 / π = 540 - Real.arcsin 0.8 * 180 / π := by
    field_simp; ring
  obtain ⟨b1, b2⟩ := hb
  refine ⟨?_, ?_, ?_, ?_, by norm_num, fun x h0 h1 => ?_⟩
  · rw [abs_lt]; constructor <;> linarith
  · rw [e2, abs_lt]; constructor <;> linarith
  · rw [e3, abs_lt]; constructor <;> linarith
  · rw [e4, abs_lt]; constructor <;> linarith
  · rw [sin_splosna _ _ (by norm_num) (by norm_num)]
    constructor
    · rintro ⟨k, hk | hk⟩
      · have hk1 : (k:ℝ) < 2 := by nlinarith
        have hk2 : (-1:ℝ) < k := by nlinarith
        have e1 : -1 < k := by exact_mod_cast hk2
        have e2 : k < 2 := by exact_mod_cast hk1
        interval_cases k
        · left; rw [hk]; push_cast; ring
        · right; right; left; rw [hk]; push_cast; ring
      · have hk1 : (k:ℝ) < 2 := by nlinarith
        have hk2 : (-1:ℝ) < k := by nlinarith
        have e1 : -1 < k := by exact_mod_cast hk2
        have e2 : k < 2 := by exact_mod_cast hk1
        interval_cases k
        · right; left; rw [hk]; push_cast; ring
        · right; right; right; rw [hk]; push_cast; ring
    · rintro (h | h | h | h)
      · exact ⟨0, Or.inl (by rw [h]; push_cast; ring)⟩
      · exact ⟨0, Or.inr (by rw [h]; push_cast; ring)⟩
      · exact ⟨1, Or.inl (by rw [h]; push_cast; ring)⟩
      · exact ⟨1, Or.inr (by rw [h]; push_cast; ring)⟩

/-- Preveri se 2: najmanjša pozitivna rešitev `cos x = 0,1` je `arccos 0,1 ≈ 84,26°` (približno 84°, ne 6° ali
96°). -/
theorem arccos_01 : |Real.arccos 0.1 * 180 / π - 84.26| < 0.005 ∧ 0 < Real.arccos 0.1 ∧
    (∀ x : ℝ, 0 < x → Real.cos x = 0.1 → Real.arccos 0.1 ≤ x) ∧
    Real.cos (96 * π / 180) < 0 := by
  obtain ⟨l1, u1⟩ := sin_meja 5.74 0.1000143 0.1000145 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨l2, u2⟩ := sin_meja 5.735 0.0999275 0.0999277 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  have hb := arccos_med 0.1 (84.26 * π / 180) (84.265 * π / 180) (by positivity)
    (by nlinarith [Real.pi_pos]) (by nlinarith [Real.pi_pos])
    (by rw [cos_v_sin]; norm_num at u2 ⊢; linarith) (by rw [cos_v_sin]; norm_num at l1 ⊢; linarith)
  obtain ⟨d1, d2⟩ := v_stopinje _ _ _ hb.1 hb.2
  have hpi := Real.pi_pos
  refine ⟨by rw [abs_lt]; constructor <;> linarith, by nlinarith [hb.1], fun x hx h => ?_, ?_⟩
  · obtain ⟨k, hk | hk⟩ := (cos_splosna 0.1 x (by norm_num) (by norm_num)).mp h
    · have : (-1:ℝ) < k := by nlinarith [Real.arccos_le_pi 0.1]
      have hk0 : 0 ≤ k := by
        have : -1 < k := by exact_mod_cast this
        omega
      have : (0:ℝ) ≤ k := by exact_mod_cast hk0
      nlinarith
    · have : (0:ℝ) < k := by nlinarith [Real.arccos_le_pi 0.1]
      have hk1 : 1 ≤ k := by
        have : 0 < k := by exact_mod_cast this
        omega
      have : (1:ℝ) ≤ k := by exact_mod_cast hk1
      nlinarith [Real.arccos_le_pi 0.1, hb.2]
  · apply Real.cos_neg_of_pi_div_two_lt_of_lt <;> nlinarith

/-- Pomožna trditev: `arccos(1/2) = 60° = π/3`. -/
theorem znane_vrednosti_arccos_pol : Real.arccos (1 / 2) = π / 3 := by
  have hpi := Real.pi_pos
  rw [← Real.cos_pi_div_three]; exact Real.arccos_cos (by linarith) (by linarith)

/-- Pomožna trditev: `arccos(−1/2) = 120° = 2π/3`. -/
theorem znane_vrednosti_arccos_minus_pol : Real.arccos (-(1 / 2)) = 2 * π / 3 := by
  rw [Real.arccos_neg, znane_vrednosti_arccos_pol]; ring

/-! ## Polovični koti (Razlaga 6, Ustno vprašanje 3) -/

/-- Razlaga 6, Naloga 3 c), Ustno vprašanje 3 (in `<<RACUN`): `1 + cos x = 2 cos²(x/2)`. -/
theorem polovicni (x : ℝ) : 1 + Real.cos x = 2 * Real.cos (x / 2) ^ 2 := by
  have := Real.cos_sq (x / 2)
  rw [show 2 * (x / 2) = x by ring] at this
  linarith

/-- Pomožna trditev: `cos y = 0` natanko pri `y = 90° + k·180°`. -/
theorem cos_nic_splosna (y : ℝ) : Real.cos y = 0 ↔ ∃ k : ℤ, y = π / 2 + k * π := by
  rw [Real.cos_eq_zero_iff]
  constructor <;> rintro ⟨k, hk⟩ <;> exact ⟨k, by rw [hk]; ring⟩

/-- Razlaga 6 (in `<<RACUN`): `1 + cos x = cos(x/2)` je `cos(x/2)(2cos(x/2) − 1) = 0`, rešitve so
`x = 180° + k·360°` in `x = ±120° + k·720°`. -/
theorem razlaga6 (x : ℝ) :
    (1 + Real.cos x = Real.cos (x / 2) ↔ Real.cos (x / 2) * (2 * Real.cos (x / 2) - 1) = 0) ∧
    (1 + Real.cos x = Real.cos (x / 2) ↔
      ∃ k : ℤ, x = π + k * (2 * π) ∨ x = 2 * π / 3 + k * (4 * π) ∨ x = -(2 * π / 3) + k * (4 * π)) := by
  have e : 1 + Real.cos x = Real.cos (x / 2) ↔ Real.cos (x / 2) * (2 * Real.cos (x / 2) - 1) = 0 := by
    rw [polovicni]; constructor <;> intro h <;> nlinarith
  refine ⟨e, ?_⟩
  rw [e, mul_eq_zero, cos_nic_splosna,
    show 2 * Real.cos (x / 2) - 1 = 0 ↔ Real.cos (x / 2) = 1 / 2 by constructor <;> intro h <;> linarith,
    cos_splosna _ _ (by norm_num) (by norm_num), znane_vrednosti_arccos_pol]
  constructor
  · rintro (⟨k, hk⟩ | ⟨k, hk | hk⟩)
    · exact ⟨k, Or.inl (by linarith)⟩
    · exact ⟨k, Or.inr (Or.inl (by linarith))⟩
    · exact ⟨k, Or.inr (Or.inr (by linarith))⟩
  · rintro ⟨k, hk | hk | hk⟩
    · exact Or.inl ⟨k, by rw [hk]; ring⟩
    · exact Or.inr ⟨k, Or.inl (by rw [hk]; ring)⟩
    · exact Or.inr ⟨k, Or.inr (by rw [hk]; ring)⟩

/-- Primer 6 (in `<<RACUN`): splošna rešitev `sin 3x + sin x = cos x` je `x = π/2 + kπ`, `x = π/12 + kπ` ali
`x = 5π/12 + kπ` (iz `2x = 30° + k·360°` ali `150° + k·360°`). -/
theorem primer6_splosna (x : ℝ) :
    Real.sin (3 * x) + Real.sin x = Real.cos x ↔
      ∃ k : ℤ, x = π / 2 + k * π ∨ x = π / 12 + k * π ∨ x = 5 * π / 12 + k * π := by
  rw [(vsota_v_produkt 0 0 x).2]
  have e : 2 * Real.sin (2 * x) * Real.cos x = Real.cos x ↔ Real.cos x * (2 * Real.sin (2 * x) - 1) = 0 := by
    constructor <;> intro h <;> linarith
  rw [e, mul_eq_zero, cos_nic_splosna,
    show 2 * Real.sin (2 * x) - 1 = 0 ↔ Real.sin (2 * x) = 1 / 2 by constructor <;> intro h <;> linarith,
    sin_pol]
  constructor
  · rintro (⟨k, hk⟩ | ⟨k, hk | hk⟩)
    · exact ⟨k, Or.inl hk⟩
    · exact ⟨k, Or.inr (Or.inl (by linarith))⟩
    · exact ⟨k, Or.inr (Or.inr (by linarith))⟩
  · rintro ⟨k, hk | hk | hk⟩
    · exact Or.inl ⟨k, hk⟩
    · exact Or.inr ⟨k, Or.inl (by rw [hk]; ring)⟩
    · exact Or.inr ⟨k, Or.inr (by rw [hk]; ring)⟩

/-! ## Za maturo -/

/-- Naloga 1 (in `<<RACUN`): `2 cos(x − π/6) = 1` je `x − π/6 = ±π/3 + 2kπ`, torej `x = π/2 + 2kπ` ali
`x = −π/6 + 2kπ`; na `[0, 2π)` natanko `x = π/2` in `x = 11π/6`. -/
theorem matura1 :
    (∀ x : ℝ, 2 * Real.cos (x - π / 6) = 1 ↔
      ∃ k : ℤ, x = π / 2 + k * (2 * π) ∨ x = -(π / 6) + k * (2 * π)) ∧
    (∀ x : ℝ, 0 ≤ x → x < 2 * π → (2 * Real.cos (x - π / 6) = 1 ↔ x = π / 2 ∨ x = 11 * π / 6)) := by
  have hg : ∀ x : ℝ, 2 * Real.cos (x - π / 6) = 1 ↔
      ∃ k : ℤ, x = π / 2 + k * (2 * π) ∨ x = -(π / 6) + k * (2 * π) := by
    intro x
    rw [show 2 * Real.cos (x - π / 6) = 1 ↔ Real.cos (x - π / 6) = 1 / 2 by
      constructor <;> intro h <;> linarith, cos_splosna _ _ (by norm_num) (by norm_num),
      znane_vrednosti_arccos_pol]
    constructor
    · rintro ⟨k, hk | hk⟩
      · exact ⟨k, Or.inl (by linarith)⟩
      · exact ⟨k, Or.inr (by linarith)⟩
    · rintro ⟨k, hk | hk⟩
      · exact ⟨k, Or.inl (by rw [hk]; ring)⟩
      · exact ⟨k, Or.inr (by rw [hk]; ring)⟩
  refine ⟨hg, fun x h0 h1 => ?_⟩
  rw [hg]
  constructor
  · rintro ⟨k, hk | hk⟩
    · obtain ⟨a, b⟩ := druzina_pi (1 / 2) 2 0 2 x k (by rw [hk]; ring) (by linarith) (by linarith)
      have := int_med k 0 (by push_cast; linarith) (by push_cast; linarith)
      left; rw [hk, this]; simp
    · obtain ⟨a, b⟩ := druzina_pi (-(1 / 6)) 2 0 2 x k (by rw [hk]; ring) (by linarith) (by linarith)
      have := int_med k 1 (by push_cast; linarith) (by push_cast; linarith)
      right; rw [hk, this]; push_cast; ring
  · rintro (rfl | rfl)
    · exact ⟨0, Or.inl (by simp)⟩
    · exact ⟨1, Or.inr (by push_cast; ring)⟩

/-- Naloga 2 a): `h = 20 − 18 cos 135° = 20 + 9√2 ≈ 32,7279 m ≈ 32,73 m`. -/
theorem matura2a :
    20 - 18 * Real.cos (135 * π / 180) = 20 + 9 * Real.sqrt 2 ∧
    |20 + 9 * Real.sqrt 2 - 32.7279| < 0.00005 ∧ |20 + 9 * Real.sqrt 2 - 32.73| < 0.005 := by
  have hc : Real.cos (135 * π / 180) = -(Real.sqrt 2 / 2) := by
    rw [show 135 * π / 180 = π - π / 4 by ring, Real.cos_pi_sub, Real.cos_pi_div_four]
  obtain ⟨l, u⟩ := sqrt_med 2 1.41421356 1.41421357 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  refine ⟨by rw [hc]; ring, ?_, ?_⟩ <;> (rw [abs_lt]; constructor <;> linarith)

/-- Naloga 2 b) (in `<<RACUN`): `20 − 18 cos x = 26` je `cos x = −1/3`, splošno `x = ±arccos(−1/3) + 2kπ`;
v prvem obratu natanko `x₁ = arccos(−1/3) ≈ 109,4712° ≈ 109,47°` in `360° − x₁ ≈ 250,5288° ≈ 250,53°`. -/
theorem matura2b :
    (∀ x : ℝ, 20 - 18 * Real.cos x = 26 ↔ Real.cos x = -(1 / 3)) ∧
    (∀ x : ℝ, 20 - 18 * Real.cos x = 26 ↔
      ∃ k : ℤ, x = Real.arccos (-(1 / 3)) + k * (2 * π) ∨ x = -Real.arccos (-(1 / 3)) + k * (2 * π)) ∧
    (∀ x : ℝ, 0 ≤ x → x < 2 * π → (20 - 18 * Real.cos x = 26 ↔
      x = Real.arccos (-(1 / 3)) ∨ x = 2 * π - Real.arccos (-(1 / 3)))) ∧
    |Real.arccos (-(1 / 3)) * 180 / π - 109.4712| < 0.00005 ∧
    |Real.arccos (-(1 / 3)) * 180 / π - 109.47| < 0.005 ∧
    |(2 * π - Real.arccos (-(1 / 3))) * 180 / π - 250.5288| < 0.00005 ∧
    |(2 * π - Real.arccos (-(1 / 3))) * 180 / π - 250.53| < 0.005 := by
  have e : ∀ x : ℝ, 20 - 18 * Real.cos x = 26 ↔ Real.cos x = -(1 / 3) := fun x => by
    constructor <;> intro h <;> linarith
  obtain ⟨d1, d2⟩ := arccos_minus_tretjina
  have hpi := Real.pi_pos
  have hA1 : π / 2 < Real.arccos (-(1 / 3)) := by
    by_contra hc; push Not at hc
    have : 0 ≤ Real.cos (Real.arccos (-(1 / 3))) :=
      Real.cos_nonneg_of_mem_Icc ⟨by linarith [Real.arccos_nonneg (-(1 / 3))], hc⟩
    rw [Real.cos_arccos (by norm_num) (by norm_num)] at this; norm_num at this
  have hA2 := Real.arccos_le_pi (-(1 / 3))
  have e2 : (2 * π - Real.arccos (-(1 / 3))) * 180 / π = 360 - Real.arccos (-(1 / 3)) * 180 / π := by
    field_simp; ring
  refine ⟨e, fun x => by rw [e, cos_splosna _ _ (by norm_num) (by norm_num)], fun x h0 h1 => ?_, ?_, ?_, ?_, ?_⟩
  · rw [e, cos_splosna _ _ (by norm_num) (by norm_num)]
    constructor
    · rintro ⟨k, hk | hk⟩
      · left
        have hk1 : (k:ℝ) < 1 := by nlinarith
        have hk2 : (-1:ℝ) < k := by nlinarith
        have : k = 0 := int_med k 0 (by push_cast; linarith) (by push_cast; linarith)
        rw [hk, this]; simp
      · right
        have hk1 : (k:ℝ) < 2 := by nlinarith
        have hk2 : (0:ℝ) < k := by nlinarith
        have : k = 1 := int_med k 1 (by push_cast; linarith) (by push_cast; linarith)
        rw [hk, this]; push_cast; ring
    · rintro (h | h)
      · exact ⟨0, Or.inl (by rw [h]; simp)⟩
      · exact ⟨1, Or.inr (by rw [h]; push_cast; ring)⟩
  · rw [abs_lt]; constructor <;> linarith
  · rw [abs_lt]; constructor <;> linarith
  · rw [e2, abs_lt]; constructor <;> linarith
  · rw [e2, abs_lt]; constructor <;> linarith

/-- Naloga 2 c): v prvem obratu je sedež više od 26 m (`cos x < −1/3`) natanko med `x₁ = arccos(−1/3)` in
`360° − x₁`; lok `360° − 2x₁ ≈ 141,0576°`, obrat 720 s (2 s na stopinjo), čas `≈ 282,12 s ≈ 282 s`
(4 min 42 s). -/
theorem matura2c :
    (∀ x : ℝ, 0 ≤ x → x < 2 * π → (26 < 20 - 18 * Real.cos x ↔
      Real.arccos (-(1 / 3)) < x ∧ x < 2 * π - Real.arccos (-(1 / 3)))) ∧
    |360 - 2 * (Real.arccos (-(1 / 3)) * 180 / π) - 141.0576| < 0.00005 ∧ (720:ℝ) / 360 = 2 ∧
    |(360 - 2 * (Real.arccos (-(1 / 3)) * 180 / π)) * 2 - 282.12| < 0.005 ∧
    |(360 - 2 * (Real.arccos (-(1 / 3)) * 180 / π)) * 2 - 282| < 0.5 ∧ (4:ℝ) * 60 + 42 = 282 := by
  obtain ⟨d1, d2⟩ := arccos_minus_tretjina
  have hpi := Real.pi_pos
  set A := Real.arccos (-(1 / 3)) with hAdef
  have hA0 := Real.arccos_nonneg (-(1 / 3))
  have hA2 := Real.arccos_le_pi (-(1 / 3))
  have hcA : Real.cos A = -(1 / 3) := Real.cos_arccos (by norm_num) (by norm_num)
  have hA1 : A < π := by
    by_contra hc; push Not at hc
    have : A = π := le_antisymm hA2 hc
    rw [this, Real.cos_pi] at hcA; norm_num at hcA
  refine ⟨fun x h0 h1 => ?_, ?_, by norm_num, ?_, ?_, by norm_num⟩
  · have e : 26 < 20 - 18 * Real.cos x ↔ Real.cos x < -(1 / 3) := by
      constructor <;> intro h <;> linarith
    rw [e, ← hcA]
    by_cases hx : x ≤ π
    · constructor
      · intro h
        refine ⟨?_, by linarith⟩
        by_contra hc; push Not at hc
        have := Real.cos_le_cos_of_nonneg_of_le_pi h0 hA2 hc
        linarith
      · rintro ⟨h2, -⟩
        exact Real.cos_lt_cos_of_nonneg_of_le_pi hA0 hx h2
    · push Not at hx
      have hcx : Real.cos x = Real.cos (2 * π - x) := by
        rw [Real.cos_two_pi_sub]
      rw [hcx]
      constructor
      · intro h
        refine ⟨by linarith, ?_⟩
        by_contra hc; push Not at hc
        have := Real.cos_le_cos_of_nonneg_of_le_pi (by linarith) hA2 (show 2 * π - x ≤ A by linarith)
        linarith
      · rintro ⟨-, h2⟩
        exact Real.cos_lt_cos_of_nonneg_of_le_pi hA0 (by linarith) (by linarith)
  · rw [abs_lt]; constructor <;> linarith
  · rw [abs_lt]; constructor <;> linarith
  · rw [abs_lt]; constructor <;> linarith

/-- Naloga 3 a): z adicijskima izrekoma `cos(2x + x) = cos 2x cos x − sin 2x sin x`,
`cos(2x − x) = cos 2x cos x + sin 2x sin x`, vsota `cos 3x + cos x = 2 cos 2x cos x`; enako za `x/2`:
`cos(3x/2) + cos(x/2) = 2 cos x cos(x/2)`. -/
theorem matura3a (x : ℝ) :
    Real.cos (2 * x + x) = Real.cos (2 * x) * Real.cos x - Real.sin (2 * x) * Real.sin x ∧
    Real.cos (2 * x - x) = Real.cos (2 * x) * Real.cos x + Real.sin (2 * x) * Real.sin x ∧
    Real.cos (3 * x) + Real.cos x = 2 * Real.cos (2 * x) * Real.cos x ∧
    Real.cos (3 * x / 2) + Real.cos (x / 2) = 2 * Real.cos x * Real.cos (x / 2) := by
  have key : ∀ y : ℝ, Real.cos (3 * y) + Real.cos y = 2 * Real.cos (2 * y) * Real.cos y := by
    intro y
    have h1 := Real.cos_add (2 * y) y
    have h2 := Real.cos_sub (2 * y) y
    rw [show 2 * y + y = 3 * y by ring] at h1
    rw [show 2 * y - y = y by ring] at h2
    rw [h1]; nth_rewrite 2 [h2]; ring
  refine ⟨Real.cos_add _ _, Real.cos_sub _ _, key x, ?_⟩
  have := key (x / 2)
  rw [show 3 * (x / 2) = 3 * x / 2 by ring, show 2 * (x / 2) = x by ring] at this
  exact this

/-- Naloga 3 b): `cos 3x + cos x = cos 2x` je `cos 2x (2 cos x − 1) = 0`; na `[0°, 360°)` so rešitve
45°, 60°, 135°, 225°, 300°, 315°. -/
theorem matura3b (x : ℝ) (h0 : 0 ≤ x) (h1 : x < 2 * π) :
    Real.cos (3 * x) + Real.cos x = Real.cos (2 * x) ↔
      x = π / 4 ∨ x = π / 3 ∨ x = 3 * π / 4 ∨ x = 5 * π / 4 ∨ x = 5 * π / 3 ∨ x = 7 * π / 4 := by
  rw [(matura3a x).2.2.1]
  have e : 2 * Real.cos (2 * x) * Real.cos x = Real.cos (2 * x) ↔
      Real.cos (2 * x) * (2 * Real.cos x - 1) = 0 := by constructor <;> intro h <;> linarith
  have hc : 2 * Real.cos x - 1 = 0 ↔ Real.cos x = 1 / 2 := by constructor <;> intro h <;> linarith
  rw [e, mul_eq_zero, cos_nic_splosna, hc, cos_splosna _ _ (by norm_num) (by norm_num),
    znane_vrednosti_arccos_pol]
  constructor
  · rintro (⟨k, hk⟩ | ⟨k, hk | hk⟩)
    · obtain ⟨a, b⟩ := druzina_pi (1 / 2) 1 0 4 (2 * x) k (by rw [hk]; ring) (by linarith) (by linarith)
      have e1 : -1 < k := by exact_mod_cast (show (-1:ℝ) < k by linarith)
      have e2 : k < 4 := by exact_mod_cast (show (k:ℝ) < 4 by linarith)
      interval_cases k
      · left; push_cast at hk; linarith
      · right; right; left; push_cast at hk; linarith
      · right; right; right; left; push_cast at hk; linarith
      · right; right; right; right; right; push_cast at hk; linarith
    · obtain ⟨a, b⟩ := druzina_pi (1 / 3) 2 0 2 x k (by rw [hk]; ring) (by linarith) (by linarith)
      have := int_med k 0 (by push_cast; linarith) (by push_cast; linarith)
      right; left; rw [hk, this]; simp
    · obtain ⟨a, b⟩ := druzina_pi (-(1 / 3)) 2 0 2 x k (by rw [hk]; ring) (by linarith) (by linarith)
      have := int_med k 1 (by push_cast; linarith) (by push_cast; linarith)
      right; right; right; right; left; rw [hk, this]; push_cast; ring
  · rintro (rfl | rfl | rfl | rfl | rfl | rfl)
    · exact Or.inl ⟨0, by push_cast; ring⟩
    · exact Or.inr ⟨0, Or.inl (by simp)⟩
    · exact Or.inl ⟨1, by push_cast; ring⟩
    · exact Or.inl ⟨2, by push_cast; ring⟩
    · exact Or.inr ⟨1, Or.inr (by push_cast; ring)⟩
    · exact Or.inl ⟨3, by push_cast; ring⟩

/-- Predpostavke trditve `matura3b` se dajo izpolniti (`x = 0`). -/
example : (0:ℝ) ≤ 0 ∧ (0:ℝ) < 2 * π := ⟨le_rfl, by positivity⟩

/-- Naloga 3 c), korak 9 (in `<<RACUN`): `2z² − z − 1 = (2z + 1)(z − 1) = 0` natanko pri `z = 1` ali
`z = −1/2`. -/
theorem matura3c_z (z : ℝ) : 2 * z ^ 2 - z - 1 = (2 * z + 1) * (z - 1) ∧
    (2 * z ^ 2 - z - 1 = 0 ↔ z = 1 ∨ z = -(1 / 2)) := by
  refine ⟨by ring, ?_⟩
  constructor
  · intro h
    have h' : (2 * z + 1) * (z - 1) = 0 := by rw [← h]; ring
    rcases mul_eq_zero.mp h' with h1 | h1
    · right; linarith
    · left; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Naloga 3 c): `cos(3x/2) + cos(x/2) = 1 + cos x` je `2cos(x/2)(cos x − cos(x/2)) = 0`; na `[0°, 720°)` so
rešitve natanko 0°, 180°, 240°, 480°, 540°. -/
theorem matura3c (x : ℝ) (h0 : 0 ≤ x) (h1 : x < 4 * π) :
    (Real.cos (3 * x / 2) + Real.cos (x / 2) = 1 + Real.cos x ↔
      2 * Real.cos (x / 2) * (Real.cos x - Real.cos (x / 2)) = 0) ∧
    (Real.cos (3 * x / 2) + Real.cos (x / 2) = 1 + Real.cos x ↔
      x = 0 ∨ x = π ∨ x = 4 * π / 3 ∨ x = 8 * π / 3 ∨ x = 3 * π) := by
  have hp := polovicni x
  have hd : Real.cos x = 2 * Real.cos (x / 2) ^ 2 - 1 := by linarith
  have e : Real.cos (3 * x / 2) + Real.cos (x / 2) = 1 + Real.cos x ↔
      2 * Real.cos (x / 2) * (Real.cos x - Real.cos (x / 2)) = 0 := by
    rw [(matura3a x).2.2.2, hp]; constructor <;> intro h <;> nlinarith
  refine ⟨e, ?_⟩
  have e2 : 2 * Real.cos (x / 2) * (Real.cos x - Real.cos (x / 2)) = 0 ↔
      Real.cos (x / 2) = 0 ∨ Real.cos (x / 2) = 1 ∨ Real.cos (x / 2) = -(1 / 2) := by
    rw [hd, ← (matura3c_z (Real.cos (x / 2))).2]
    constructor
    · intro h
      rcases mul_eq_zero.mp h with h' | h'
      · left; linarith
      · right; linarith
    · rintro (h | h)
      · rw [h]; ring
      · rw [show 2 * Real.cos (x / 2) ^ 2 - 1 - Real.cos (x / 2) = 2 * Real.cos (x / 2) ^ 2 -
          Real.cos (x / 2) - 1 by ring, h]; ring
  have hpi := Real.pi_pos
  have hy0 : 0 ≤ x / 2 := by linarith
  have hy1 : x / 2 < 2 * π := by linarith
  rw [e, e2, cos_nic (x / 2) hy0 hy1,
    cos_splosna 1 (x / 2) (by norm_num) (by norm_num), Real.arccos_one,
    cos_splosna _ (x / 2) (by norm_num) (by norm_num), znane_vrednosti_arccos_minus_pol]
  constructor
  · rintro ((h | h) | ⟨k, hk | hk⟩ | ⟨k, hk | hk⟩)
    · right; left; linarith
    · right; right; right; right; linarith
    · have := int_med k 0 (by push_cast; nlinarith) (by push_cast; nlinarith)
      left; rw [this] at hk; push_cast at hk; linarith
    · have := int_med k 0 (by push_cast; nlinarith) (by push_cast; nlinarith)
      left; rw [this] at hk; push_cast at hk; linarith
    · have := int_med k 0 (by push_cast; nlinarith) (by push_cast; nlinarith)
      right; right; left; rw [this] at hk; push_cast at hk; linarith
    · have := int_med k 1 (by push_cast; nlinarith) (by push_cast; nlinarith)
      right; right; right; left; rw [this] at hk; push_cast at hk; linarith
  · rintro (rfl | rfl | rfl | rfl | rfl)
    · exact Or.inr (Or.inl ⟨0, Or.inl (by simp)⟩)
    · exact Or.inl (Or.inl (by ring))
    · exact Or.inr (Or.inr ⟨0, Or.inl (by push_cast; ring)⟩)
    · exact Or.inr (Or.inr ⟨1, Or.inr (by push_cast; ring)⟩)
    · exact Or.inl (Or.inr (by ring))

/-- Predpostavke trditve `matura3c` se dajo izpolniti (`x = 0`). -/
example : (0:ℝ) ≤ 0 ∧ (0:ℝ) < 4 * π := ⟨le_rfl, by positivity⟩

/-- `<<RACUN`: splošna rešitev `cos 3x + cos x = cos 2x` je `x = π/4 + kπ`, `3π/4 + kπ`, `π/3 + 2kπ` ali
`−π/3 + 2kπ`. -/
theorem matura3b_splosna (x : ℝ) :
    Real.cos (3 * x) + Real.cos x = Real.cos (2 * x) ↔ ∃ k : ℤ, x = π / 4 + k * π ∨
      x = 3 * π / 4 + k * π ∨ x = π / 3 + k * (2 * π) ∨ x = -(π / 3) + k * (2 * π) := by
  rw [(matura3a x).2.2.1]
  have e : 2 * Real.cos (2 * x) * Real.cos x = Real.cos (2 * x) ↔
      Real.cos (2 * x) * (2 * Real.cos x - 1) = 0 := by constructor <;> intro h <;> linarith
  have hc : 2 * Real.cos x - 1 = 0 ↔ Real.cos x = 1 / 2 := by constructor <;> intro h <;> linarith
  rw [e, mul_eq_zero, cos_nic_splosna, hc, cos_splosna _ _ (by norm_num) (by norm_num),
    znane_vrednosti_arccos_pol]
  constructor
  · rintro (⟨k, hk⟩ | ⟨k, hk | hk⟩)
    · obtain ⟨m, rfl | rfl⟩ := Int.even_or_odd' k
      · exact ⟨m, Or.inl (by push_cast at hk; linarith)⟩
      · exact ⟨m, Or.inr (Or.inl (by push_cast at hk; linarith))⟩
    · exact ⟨k, Or.inr (Or.inr (Or.inl hk))⟩
    · exact ⟨k, Or.inr (Or.inr (Or.inr hk))⟩
  · rintro ⟨k, hk | hk | hk | hk⟩
    · exact Or.inl ⟨2 * k, by rw [hk]; push_cast; ring⟩
    · exact Or.inl ⟨2 * k + 1, by rw [hk]; push_cast; ring⟩
    · exact Or.inr ⟨k, Or.inl hk⟩
    · exact Or.inr ⟨k, Or.inr hk⟩

/-- `<<RACUN`: splošna rešitev `cos(3x/2) + cos(x/2) = 1 + cos x` je `x = 4kπ`, `π + 2kπ`, `4π/3 + 4kπ` ali
`−4π/3 + 4kπ`. -/
theorem matura3c_splosna (x : ℝ) :
    Real.cos (3 * x / 2) + Real.cos (x / 2) = 1 + Real.cos x ↔ ∃ k : ℤ, x = k * (4 * π) ∨
      x = π + k * (2 * π) ∨ x = 4 * π / 3 + k * (4 * π) ∨ x = -(4 * π / 3) + k * (4 * π) := by
  have hp := polovicni x
  have hd : Real.cos x = 2 * Real.cos (x / 2) ^ 2 - 1 := by linarith
  have e : Real.cos (3 * x / 2) + Real.cos (x / 2) = 1 + Real.cos x ↔
      Real.cos (x / 2) = 0 ∨ Real.cos (x / 2) = 1 ∨ Real.cos (x / 2) = -(1 / 2) := by
    rw [(matura3a x).2.2.2, hp, hd]
    constructor
    · intro h
      have h' : Real.cos (x / 2) * ((2 * Real.cos (x / 2) + 1) * (Real.cos (x / 2) - 1)) = 0 := by
        nlinarith
      rcases mul_eq_zero.mp h' with h1 | h1
      · exact Or.inl h1
      · rcases mul_eq_zero.mp h1 with h2 | h2
        · right; right; linarith
        · right; left; linarith
    · rintro (h | h | h) <;> rw [h] <;> ring
  rw [e, cos_nic_splosna, cos_splosna 1 (x / 2) (by norm_num) (by norm_num), Real.arccos_one,
    cos_splosna _ (x / 2) (by norm_num) (by norm_num), znane_vrednosti_arccos_minus_pol]
  constructor
  · rintro (⟨k, hk⟩ | ⟨k, hk | hk⟩ | ⟨k, hk | hk⟩)
    · exact ⟨k, Or.inr (Or.inl (by linarith))⟩
    · exact ⟨k, Or.inl (by linarith)⟩
    · exact ⟨k, Or.inl (by linarith)⟩
    · exact ⟨k, Or.inr (Or.inr (Or.inl (by linarith)))⟩
    · exact ⟨k, Or.inr (Or.inr (Or.inr (by linarith)))⟩
  · rintro ⟨k, hk | hk | hk | hk⟩
    · exact Or.inr (Or.inl ⟨k, Or.inl (by rw [hk]; ring)⟩)
    · exact Or.inl ⟨k, by rw [hk]; ring⟩
    · exact Or.inr (Or.inr ⟨k, Or.inl (by rw [hk]; ring)⟩)
    · exact Or.inr (Or.inr ⟨k, Or.inr (by rw [hk]; ring)⟩)

/-! ## Razlaga 1, ustna vprašanja, pogoste napake -/

/-- Razlaga 1: premica `y = 0,5` seka krožnico pri 30° in `180° − 30° = 150°`; točki sta zrcalni glede na os
`y` (`cos 150° = −cos 30°`, `sin 150° = sin 30°`). -/
theorem dve_tocki :
    Real.sin (30 * π / 180) = 0.5 ∧ Real.sin (150 * π / 180) = 0.5 ∧
    Real.cos (150 * π / 180) = -Real.cos (30 * π / 180) := by
  have h1 : Real.sin (30 * π / 180) = 0.5 := by
    rw [show 30 * π / 180 = π / 6 by ring, Real.sin_pi_div_six]; norm_num
  refine ⟨h1, ?_, ?_⟩
  · rw [show 150 * π / 180 = π - 30 * π / 180 by ring, Real.sin_pi_sub, h1]
  · rw [show 150 * π / 180 = π - 30 * π / 180 by ring, Real.cos_pi_sub]

/-- Ustno vprašanje 2: `sin 2x = sin x` je `sin x (2 cos x − 1) = 0`, torej `sin x = 0` ali `cos x = 1/2`; z
deljenjem s `sin x` bi izgubili rešitve `x = k·180°`. -/
theorem ustno2 (x : ℝ) :
    (Real.sin (2 * x) = Real.sin x ↔ Real.sin x = 0 ∨ Real.cos x = 1 / 2) ∧
    ∀ k : ℤ, Real.sin (2 * (k * π)) = Real.sin (k * π) := by
  refine ⟨?_, fun k => ?_⟩
  · rw [Real.sin_two_mul]
    constructor
    · intro h
      have h' : Real.sin x * (2 * Real.cos x - 1) = 0 := by linarith
      rcases mul_eq_zero.mp h' with h1 | h1
      · exact Or.inl h1
      · right; linarith
    · rintro (h | h) <;> rw [h] <;> ring
  · rw [Real.sin_int_mul_pi, show 2 * ((k:ℝ) * π) = ((2 * k : ℤ) : ℝ) * π by push_cast; ring,
      Real.sin_int_mul_pi]

/-- Pogoste napake (napačna perioda): korak 180° pri sinusu spremeni predznak, `sin(x + 180°) = −sin x`
(npr. `sin 225° < 0`, `sin 315° < 0`); pri tangensu pa je perioda 180°, `tan(x + 180°) = tan x`
(Preveri se 3: točki `x₁` in `x₁ + 180°` sta nasprotni). -/
theorem perioda (x : ℝ) :
    Real.sin (x + π) = -Real.sin x ∧ Real.cos (x + π) = -Real.cos x ∧ Real.tan (x + π) = Real.tan x ∧
    Real.sin (225 * π / 180) < 0 ∧ Real.sin (315 * π / 180) < 0 := by
  have hpi := Real.pi_pos
  refine ⟨Real.sin_add_pi x, Real.cos_add_pi x, Real.tan_periodic x, ?_, ?_⟩
  · rw [show 225 * π / 180 = (225 * π / 180 - 2 * π) + 2 * π by ring, Real.sin_add_two_pi]
    apply Real.sin_neg_of_neg_of_neg_pi_lt <;> nlinarith
  · rw [show 315 * π / 180 = (315 * π / 180 - 2 * π) + 2 * π by ring, Real.sin_add_two_pi]
    apply Real.sin_neg_of_neg_of_neg_pi_lt <;> nlinarith

/-- Pogoste napake (deljenje s kotno funkcijo): 90° in 270° rešita `2 sin x cos x = cos x`, a bi se izgubila
pri deljenju s `cos x` (tam je `cos x = 0`). -/
theorem napaka_deljenje :
    2 * Real.sin (π / 2) * Real.cos (π / 2) = Real.cos (π / 2) ∧
    2 * Real.sin (3 * π / 2) * Real.cos (3 * π / 2) = Real.cos (3 * π / 2) ∧
    Real.cos (π / 2) = 0 ∧ Real.cos (3 * π / 2) = 0 := by
  have h3 : Real.cos (3 * π / 2) = 0 := by
    rw [show 3 * π / 2 = π / 2 + π by ring, Real.cos_add_pi, Real.cos_pi_div_two]; ring
  refine ⟨by rw [Real.cos_pi_div_two]; ring, by rw [h3]; ring, Real.cos_pi_div_two, h3⟩

/-! ## Preveri se -/

/-- Preveri se 1: `sin x = √2/2` ima na `[0°, 720°)` natanko rešitve 45°, 135°, 405°, 495°. -/
theorem kviz1 (x : ℝ) (h0 : 0 ≤ x) (h1 : x < 4 * π) :
    Real.sin x = Real.sqrt 2 / 2 ↔ x = π / 4 ∨ x = 3 * π / 4 ∨ x = 9 * π / 4 ∨ x = 11 * π / 4 := by
  have hpi := Real.pi_pos
  have ha : Real.arcsin (Real.sqrt 2 / 2) = π / 4 := by
    rw [← Real.sin_pi_div_four]; exact Real.arcsin_sin (by linarith) (by linarith)
  have hs2 : Real.sqrt 2 / 2 ≤ 1 := by
    have : Real.sqrt 2 < 2 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
    linarith
  rw [sin_splosna _ _ (by linarith [Real.sqrt_nonneg 2]) hs2, ha]
  constructor
  · rintro ⟨k, hk | hk⟩
    · obtain ⟨a, b⟩ := druzina_pi (1 / 4) 2 0 4 x k (by rw [hk]; ring) (by linarith) (by linarith)
      have e1 : -1 < k := by exact_mod_cast (show (-1:ℝ) < k by linarith)
      have e2 : k < 2 := by exact_mod_cast (show (k:ℝ) < 2 by linarith)
      interval_cases k
      · left; rw [hk]; push_cast; ring
      · right; right; left; rw [hk]; push_cast; ring
    · obtain ⟨a, b⟩ := druzina_pi (3 / 4) 2 0 4 x k (by rw [hk]; ring) (by linarith) (by linarith)
      have e1 : -1 < k := by exact_mod_cast (show (-1:ℝ) < k by linarith)
      have e2 : k < 2 := by exact_mod_cast (show (k:ℝ) < 2 by linarith)
      interval_cases k
      · right; left; rw [hk]; push_cast; ring
      · right; right; right; rw [hk]; push_cast; ring
  · rintro (rfl | rfl | rfl | rfl)
    · exact ⟨0, Or.inl (by push_cast; ring)⟩
    · exact ⟨0, Or.inr (by push_cast; ring)⟩
    · exact ⟨1, Or.inl (by push_cast; ring)⟩
    · exact ⟨1, Or.inr (by push_cast; ring)⟩

/-- Predpostavke trditve `kviz1` se dajo izpolniti (`x = 0`). -/
example : (0:ℝ) ≤ 0 ∧ (0:ℝ) < 4 * π := ⟨le_rfl, by positivity⟩

/-- Preveri se 4: splošno rešitev `x = ±60° + k·360°` ima `cos x = 1/2`; pri `−60°` je sinus negativen
(`sin x = √3/2` ne velja), `tan(−60°) = −√3 ≠ √3`. -/
theorem kviz4 :
    (∀ x : ℝ, Real.cos x = 1 / 2 ↔ ∃ k : ℤ, x = π / 3 + k * (2 * π) ∨ x = -(π / 3) + k * (2 * π)) ∧
    Real.sin (-(π / 3)) < 0 ∧ Real.tan (-(π / 3)) = -Real.sqrt 3 := by
  refine ⟨fun x => by rw [cos_splosna _ _ (by norm_num) (by norm_num), znane_vrednosti_arccos_pol],
    ?_, ?_⟩
  · rw [Real.sin_neg, Real.sin_pi_div_three]; have : 0 < Real.sqrt 3 := by positivity
    linarith
  · rw [Real.tan_neg, Real.tan_pi_div_three]

/-- Preveri se 5: telefon s 30° na sekundo pokaže `sin x = −0,5` v prvih 24 s natanko ob 7, 11, 19, 23 s
(`x = 210°, 330°, 570°, 690°`). -/
theorem kviz5 (t : ℝ) (h0 : 0 ≤ t) (h1 : t < 24) :
    Real.sin (30 * t * π / 180) = -(1 / 2) ↔ t = 7 ∨ t = 11 ∨ t = 19 ∨ t = 23 := by
  have hpi := Real.pi_pos
  rw [sin_splosna _ _ (by norm_num) (by norm_num), Real.arcsin_neg, znane_vrednosti.2.2.2.1]
  constructor
  · rintro ⟨k, hk | hk⟩
    · obtain ⟨a, b⟩ := druzina_pi (-(1 / 6)) 2 0 4 (30 * t * π / 180) k (by rw [hk]; ring)
        (by nlinarith) (by nlinarith)
      have hk' : t = -1 + 12 * k := by
        have := mul_right_cancel₀ Real.pi_ne_zero
          (show (t / 6) * π = (-(1 / 6) + 2 * k) * π by linarith)
        linarith
      have e1 : 0 < k := by exact_mod_cast (show (0:ℝ) < k by linarith)
      have e2 : k < 3 := by exact_mod_cast (show (k:ℝ) < 3 by linarith)
      interval_cases k
      · right; left; rw [hk']; norm_num
      · right; right; right; rw [hk']; norm_num
    · obtain ⟨a, b⟩ := druzina_pi (7 / 6) 2 0 4 (30 * t * π / 180) k (by rw [hk]; ring)
        (by nlinarith) (by nlinarith)
      have hk' : t = 7 + 12 * k := by
        have := mul_right_cancel₀ Real.pi_ne_zero
          (show (t / 6) * π = (7 / 6 + 2 * k) * π by linarith)
        linarith
      have e1 : -1 < k := by exact_mod_cast (show (-1:ℝ) < k by linarith)
      have e2 : k < 2 := by exact_mod_cast (show (k:ℝ) < 2 by linarith)
      interval_cases k
      · left; rw [hk']; norm_num
      · right; right; left; rw [hk']; norm_num
  · rintro (rfl | rfl | rfl | rfl)
    · exact ⟨0, Or.inr (by push_cast; ring)⟩
    · exact ⟨1, Or.inl (by push_cast; ring)⟩
    · exact ⟨1, Or.inr (by push_cast; ring)⟩
    · exact ⟨2, Or.inl (by push_cast; ring)⟩

/-- Predpostavke trditve `kviz5` se dajo izpolniti (`t = 7`). -/
example : (0:ℝ) ≤ 7 ∧ (7:ℝ) < 24 := by norm_num

/-- Preveri se 7: `tan x = −1` ima splošno rešitev `x = −45° + k·180°`; najmanjša pozitivna je 135°
(`−45°` ni pozitivna, `315°` ni najmanjša, `tan 45° = 1`). -/
theorem kviz7 :
    (∀ x : ℝ, (Real.tan x = -1 ∧ Real.cos x ≠ 0) ↔ ∃ k : ℤ, x = -(π / 4) + k * π) ∧
    IsLeast {x : ℝ | 0 < x ∧ Real.tan x = -1 ∧ Real.cos x ≠ 0} (3 * π / 4) ∧ Real.tan (π / 4) = 1 := by
  have hpi := Real.pi_pos
  have ha : Real.arctan (-1) = -(π / 4) := znane_vrednosti.2.2.2.2.2.1
  have hg : ∀ x : ℝ, (Real.tan x = -1 ∧ Real.cos x ≠ 0) ↔ ∃ k : ℤ, x = -(π / 4) + k * π := fun x => by
    rw [tan_splosna, ha]
  refine ⟨hg, ⟨?_, ?_⟩, Real.tan_pi_div_four⟩
  · refine ⟨by positivity, (hg _).mpr ⟨1, by push_cast; ring⟩⟩
  · rintro x ⟨hx, h⟩
    obtain ⟨k, hk⟩ := (hg x).mp h
    have : (0:ℝ) < k := by nlinarith
    have hk1 : 1 ≤ k := by
      have : 0 < k := by exact_mod_cast this
      omega
    have : (1:ℝ) ≤ k := by exact_mod_cast hk1
    rw [hk]; nlinarith

/-! ## Razlage napačnih odgovorov -/

/-- Korak za korakom, korak 6 (preizkus): `sin 126,87° = sin 53,13° ≈ 0,8`. -/
theorem preizkus_126_87 : |Real.sin (126.87 * π / 180) - 0.8| < 0.05 := by
  obtain ⟨l1, u1⟩ := sin_meja 53.13 0.7999985 0.7999993 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  rw [show 126.87 * π / 180 = π - 53.13 * π / 180 by ring, Real.sin_pi_sub, abs_lt]
  constructor <;> linarith

/-- Preveri se 2, razlaga napačnega odgovora 6°: najmanjša pozitivna rešitev `sin x = 0,1` je `arcsin 0,1 ≈ 6°`
(natančneje med 5,7° in 5,8°). -/
theorem kviz2_napacni : 5.7 < Real.arcsin 0.1 * 180 / π ∧ Real.arcsin 0.1 * 180 / π < 5.8 ∧
    |Real.arcsin 0.1 * 180 / π - 6| < 0.5 := by
  obtain ⟨-, u1⟩ := sin_meja 5.7 (-1) 0.0994 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨l2, -⟩ := sin_meja 5.8 0.101 1 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have hb := arcsin_med 0.1 (5.7 * π / 180) (5.8 * π / 180) (by nlinarith [Real.pi_pos])
    (by nlinarith [Real.pi_pos]) (by nlinarith [Real.pi_pos]) (by linarith) (by linarith)
  obtain ⟨d1, d2⟩ := v_stopinje _ _ _ hb.1 hb.2
  refine ⟨d1, d2, ?_⟩
  rw [abs_lt]; constructor <;> linarith

/-- Preveri se 4, razlage napačnih odgovorov: `sin x = √3/2` ima rešitvi 60° in 120°; `tan x = √3` ima rešitvi
60° in 240°. -/
theorem kviz4_napacni :
    Real.sin (π / 3) = Real.sqrt 3 / 2 ∧ Real.sin (2 * π / 3) = Real.sqrt 3 / 2 ∧
    Real.tan (π / 3) = Real.sqrt 3 ∧ Real.tan (4 * π / 3) = Real.sqrt 3 := by
  refine ⟨Real.sin_pi_div_three, ?_, Real.tan_pi_div_three, ?_⟩
  · rw [show 2 * π / 3 = π - π / 3 by ring, Real.sin_pi_sub, Real.sin_pi_div_three]
  · rw [show 4 * π / 3 = π / 3 + π by ring, Real.tan_add_pi, Real.tan_pi_div_three]

/-- Preveri se 6, razlaga napačnega odgovora 210: `cos 210° = −√3/2`, a 210° ni med 0° in 180°. -/
theorem kviz6_napacni : Real.cos (210 * π / 180) = -(Real.sqrt 3 / 2) ∧ ¬(210 * π / 180 ≤ π) := by
  have hpi := Real.pi_pos
  refine ⟨?_, by intro h; nlinarith⟩
  rw [show 210 * π / 180 = π / 6 + π by ring, Real.cos_add_pi, Real.cos_pi_div_six]

end Evklid.Lekcije.MAT_SS_3.TrigonometrijskeEnacbe
