/-
vir: content/lessons/MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku.md
sha256: 08f661272801a3a620ed58d153348beb235d8d81ae3c17f6b886c54ae656ecd5
Ni v Leanu: zgodovina (Galilei), simulacija in risbe (Na sliki: vrtenje hipotenuze kot opis; dokazano je
sin α = a, cos α = b pri c = 1 in monotonost), poimenovanje katet (nasprotna / priležna, »hipotenuza ni kateta«) kot
opis (dokazane so formule s točkami trikotnika), delovanje računala (DEG/RAD, tipke SHIFT, sin⁻¹; dokazani so
sin 30 ≈ −0,988 za 30 rad, sin 30° = 0,5, arcsin 0,5 = 30°), Postopek in Pazi na (navodila), Pogoste napake
»definicije v trikotniku, ki ni pravokoten« (opis), točkovanje. Razlaga 8 »trikotnik je določen z dvema stranicama ali
stranico in ostrim kotom« (zahtevno, še ni dokazano; dokazano je, kako iz teh podatkov izračunamo ostale stranice in
kote). Naloga 2 za maturo: geometrija romba je dokazana na konkretnem rombu z danima diagonalama v ℂ
(`naloga2_romb`); za splošni romb sta dokazani le pravokotnost diagonal (`romb_pravi_kot`) in definicije v
pravokotnem trikotniku; ploščina romba e·f/2 = |AB|·v je zapisana le kot račun 10·6/2 = 30 = √34·30/√34. Pri Primeru 2 je ploščina z nezaokroženima katetama ≈ 15,04 (dokazano je tudi, da
zapisani zmnožek 4,5886·6,5532/2 ≈ 15,04). Geometrijske trditve so zapisane s točkami evklidskega prostora (`∠`,
`dist`, pravi kot pri C); koti so v radianih (θ° = θ·π/180, 30° = π/6 ...); tan⁻¹ je `arctan`; »≈ a« na k decimalk
je |vrednost − a| < ½·10⁻ᵏ. Numerične vrednosti sin/cos so dokazane s Taylorjevim polinomom stopnje 9 z ostankom
(`Complex.exp_bound`, n = 10) in mejo |π − 3,1415926536| ≤ 10⁻¹⁰; kote nad 57° prevedemo na komplementarne
(sin 70° = cos 20°, sin 61,93° = cos 28,07°); tan⁻¹ z monotonostjo.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.KotneFunkcijeVPravokotnemTrikotniku

open Real EuclideanGeometry Set

variable {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P] [NormedAddTorsor V P]

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

/-! ## Pomožne trditve -/

/-- Pomožna trditev: če je lo·y < x < hi·y za y > 0, je lo < x/y < hi.
pomozno -/
theorem div_med (x y lo hi : ℝ) (hy : 0 < y) (h1 : lo * y < x) (h2 : x < hi * y) : lo < x / y ∧ x / y < hi :=
  ⟨(lt_div_iff₀ hy).mpr h1, (div_lt_iff₀ hy).mpr h2⟩

/-- Predpostavke `div_med` se dajo izpolniti (x = y = 1, lo = 0, hi = 2). -/
example : (0:ℝ) < 1 ∧ (0:ℝ) * 1 < 1 ∧ (1:ℝ) < 2 * 1 := by norm_num

/-- Pomožna trditev: cos θ° > 0 za 0 ≤ θ ≤ 57.
pomozno -/
theorem cos_poz (θ : ℝ) (h0 : 0 ≤ θ) (h1 : θ ≤ 57) : 0 < cos (θ * π / 180) := by
  have hp := pi_pos
  exact cos_pos_of_mem_Ioo ⟨by nlinarith, by nlinarith⟩

/-- Predpostavke `cos_poz` se dajo izpolniti (θ = 0). -/
example : (0:ℝ) ≤ 0 ∧ (0:ℝ) ≤ 57 := by norm_num

/-- Pomožna trditev: 1,732050 < √3 < 1,732051 in (√3)² = 3.
pomozno -/
theorem koren3 : (1.732050 : ℝ) < √3 ∧ √3 < 1.732051 ∧ √3 ^ 2 = 3 :=
  ⟨by rw [Real.lt_sqrt (by norm_num)]; norm_num, by rw [Real.sqrt_lt' (by norm_num)]; norm_num,
    Real.sq_sqrt (by norm_num)⟩

/-- Pomožna trditev: 1,41421 < √2 < 1,41422 in (√2)² = 2.
pomozno -/
theorem koren2 : (1.41421 : ℝ) < √2 ∧ √2 < 1.41422 ∧ √2 ^ 2 = 2 :=
  ⟨by rw [Real.lt_sqrt (by norm_num)]; norm_num, by rw [Real.sqrt_lt' (by norm_num)]; norm_num,
    Real.sq_sqrt (by norm_num)⟩

/-- Pomožna trditev (kot v stopinjah): 70° = 90° − 20°, zato sin 70° = cos 20° in cos 70° = sin 20°.
pomozno -/
theorem kot70 : sin (70 * π / 180) = cos (20 * π / 180) ∧ cos (70 * π / 180) = sin (20 * π / 180) := by
  rw [show (70:ℝ) * π / 180 = π / 2 - 20 * π / 180 by ring, sin_pi_div_two_sub, cos_pi_div_two_sub]
  exact ⟨rfl, rfl⟩

/-! ## Razlaga -/

/-- Razlaga 1, 2, Povzetek in Ustno vprašanje 1 (definicije): v trikotniku ABC s pravim kotom pri C je za
α = ∠CAB in β = ∠CBA (a = |BC|, b = |AC|, c = |AB|): sin α = a/c, cos α = b/c, tan α = a/b, cot α = b/a,
sin β = b/c, cos β = a/c, tan β = b/a in α + β = 90°.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#definicije
besedilo: »Za kot $\beta$ velja $\sin \beta = \dfrac{b}{c}$, $\cos \beta = \dfrac{a}{c}$, $\tan \beta = \dfrac{b}{a}$. Tangens ponekod pišejo tudi $\operatorname{tg} \alpha$. Obratna vrednost tangensa je **kotangens**, $\cot \alpha = \dfrac{b}{a}$.« -/
theorem definicije {A B C : P} (h : ∠ B C A = π / 2) (hA : A ≠ C) (hB : B ≠ C) :
    sin (∠ C A B) = dist B C / dist A B ∧ cos (∠ C A B) = dist A C / dist A B ∧
    tan (∠ C A B) = dist B C / dist A C ∧ cot (∠ C A B) = dist A C / dist B C ∧
    sin (∠ C B A) = dist A C / dist A B ∧ cos (∠ C B A) = dist B C / dist A B ∧
    tan (∠ C B A) = dist A C / dist B C ∧ ∠ C A B + ∠ C B A = π / 2 := by
  have h' : ∠ A C B = π / 2 := by rw [angle_comm]; exact h
  have s1 := sin_angle_of_angle_eq_pi_div_two h (Or.inl hB)
  have c1 := cos_angle_of_angle_eq_pi_div_two h
  rw [dist_comm B A] at s1 c1
  have hBC : dist B C ≠ 0 := dist_ne_zero.mpr hB
  have hAB : dist A B ≠ 0 := by
    rw [dist_ne_zero]; intro hab; subst hab
    rw [angle_self_of_ne (by assumption)] at h'; linarith [pi_pos]
  have sum := angle_add_angle_add_angle_eq_pi B hA
  rw [h, angle_comm A B C] at sum
  refine ⟨s1, c1, tan_angle_of_angle_eq_pi_div_two h, ?_, sin_angle_of_angle_eq_pi_div_two h' (Or.inl hA),
    cos_angle_of_angle_eq_pi_div_two h', tan_angle_of_angle_eq_pi_div_two h', by linarith⟩
  rw [cot_eq_cos_div_sin, s1, c1]; field_simp

/-- Pogoji izreka `definicije` se dajo izpolniti: v ℂ imajo točke i, 0, 1 pravi kot pri 0. -/
example : ∠ Complex.I (0:ℂ) 1 = π / 2 ∧ (1:ℂ) ≠ 0 ∧ Complex.I ≠ 0 := by
  refine ⟨?_, one_ne_zero, Complex.I_ne_zero⟩
  rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
  simp [Complex.inner]

/-- Predpostavke trditve `definicije` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∠ Complex.I (0:ℂ) 1 = π / 2 ∧ (1:ℂ) ≠ 0 ∧ Complex.I ≠ 0 := by
    refine ⟨?_, one_ne_zero, Complex.I_ne_zero⟩
    rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [Complex.inner]
  definicije (h := w.1) (hA := w.2.1) (hB := w.2.2)

/-- Povzetek »Iz stranice in kota« in Ponovitev: a = c·sin α, b = c·cos α, a = b·tan α.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#iz-stranice-in-kota
besedilo: »$$a = c \sin \alpha, \quad b = c \cos \alpha$$« -/
theorem iz_stranice_in_kota {A B C : P} (h : ∠ B C A = π / 2) (hA : A ≠ C) :
    dist B C = dist A B * sin (∠ C A B) ∧ dist A C = dist A B * cos (∠ C A B) ∧
    dist B C = dist A C * tan (∠ C A B) := by
  have s := sin_angle_mul_dist_of_angle_eq_pi_div_two h
  have c := cos_angle_mul_dist_of_angle_eq_pi_div_two h
  have t := tan_angle_mul_dist_of_angle_eq_pi_div_two h (Or.inr hA)
  rw [dist_comm B A] at s c
  exact ⟨by rw [← s]; ring, by rw [← c]; ring, by rw [← t]; ring⟩

/-- Predpostavke `iz_stranice_in_kota` se dajo izpolniti (i, 0, 1 v ℂ). -/
example : ∠ Complex.I (0:ℂ) 1 = π / 2 ∧ (1:ℂ) ≠ 0 := by
  refine ⟨?_, one_ne_zero⟩
  rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
  simp [Complex.inner]

/-- Predpostavke trditve `iz_stranice_in_kota` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∠ Complex.I (0:ℂ) 1 = π / 2 ∧ (1:ℂ) ≠ 0 := by
    refine ⟨?_, one_ne_zero⟩
    rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [Complex.inner]
  iz_stranice_in_kota (h := w.1) (hA := w.2)

/-- Ustno vprašanje 1, Drugače: Bolj natančno in Preveri se 3: vrednost je odvisna le od kota: dva pravokotna
trikotnika z enakim ostrim kotom imata enako razmerje nasprotne katete in hipotenuze; pri podobnih trikotnikih
(a' = ka, c' = kc, k > 0) je a'/c' = a/c.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#le-od-kota
besedilo: »Sinus ostrega kota je razmerje med nasprotno kateto in hipotenuzo,« -/
theorem le_od_kota {A B C A' B' C' : P} (h : ∠ B C A = π / 2) (h' : ∠ B' C' A' = π / 2) (hB : B ≠ C)
    (hB' : B' ≠ C') (hα : ∠ C A B = ∠ C' A' B') :
    dist B C / dist B A = dist B' C' / dist B' A' ∧ ∀ a c k : ℝ, 0 < k → (k * a) / (k * c) = a / c := by
  refine ⟨?_, fun a c k hk => mul_div_mul_left a c hk.ne'⟩
  rw [← sin_angle_of_angle_eq_pi_div_two h (Or.inl hB), ← sin_angle_of_angle_eq_pi_div_two h' (Or.inl hB'), hα]

/-- Predpostavke `le_od_kota` se dajo izpolniti (isti trikotnik i, 0, 1). -/
example : ∠ Complex.I (0:ℂ) 1 = π / 2 ∧ Complex.I ≠ 0 := by
  refine ⟨?_, Complex.I_ne_zero⟩
  rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
  simp [Complex.inner]

/-- Zakaj se tega učimo in Razlaga 2 (senca): s = 1,75 m / tan 25° ≈ 3,75 m, kar je več od 1,75 m (senca je daljša).
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#senca
besedilo: »$s = \dfrac{1{,}75\,\text{m}}{\tan 25^\circ} \approx 3{,}75\,\text{m}$« -/
theorem senca : |1.75 / tan (25 * π / 180) - 3.75| < 0.005 ∧ 1.75 < 1.75 / tan (25 * π / 180) := by
  obtain ⟨s1, s2⟩ := sin_meja 25 0.422618261655 0.422618261835 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨c1, c2⟩ := cos_meja 25 0.906307787015 0.906307787195 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  rw [tan_eq_sin_div_cos, div_div_eq_mul_div]
  obtain ⟨l, u⟩ := div_med (1.75 * cos (25 * π / 180)) (sin (25 * π / 180)) 3.745 3.755 (by linarith)
    (by linarith) (by linarith)
  exact ⟨by rw [abs_lt]; constructor <;> linarith, by linarith⟩

/-- Pomožna trditev (ravnina ℂ): razdalja točk z razliko a + bi je √(a² + b²).
pomozno -/
theorem razd (z w : ℂ) (a b : ℝ) (h : z - w = a + b * Complex.I) : dist z w = √(a ^ 2 + b ^ 2) := by
  rw [dist_eq_norm, h, Complex.norm_def, Complex.normSq_apply]; simp; ring_nf

/-- Pomožna trditev (ravnina ℂ): kosinus kota ∠ABC iz koordinat vektorjev BA→ = a + bi in BC→ = c + di.
pomozno -/
theorem kos (A B C : ℂ) (a b c d : ℝ) (h1 : A - B = a + b * Complex.I) (h2 : C - B = c + d * Complex.I) :
    cos (∠ A B C) = (a * c + b * d) / (√(a ^ 2 + b ^ 2) * √(c ^ 2 + d ^ 2)) := by
  rw [EuclideanGeometry.angle, InnerProductGeometry.cos_angle, vsub_eq_sub, vsub_eq_sub,
    ← dist_eq_norm, ← dist_eq_norm, razd _ _ _ _ h1, razd _ _ _ _ h2, h1, h2]
  simp [Complex.inner]; ring

/-- Pomožna trditev (ravnina ℂ): če je skalarni produkt vektorjev BA→ = a + bi in BC→ = c + di enak 0, je
∠ABC = 90°.
pomozno -/
theorem pravi (A B C : ℂ) (a b c d : ℝ) (h1 : A - B = a + b * Complex.I) (h2 : C - B = c + d * Complex.I)
    (h : a * c + b * d = 0) : ∠ A B C = π / 2 := by
  rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two, vsub_eq_sub,
    vsub_eq_sub, h1, h2]
  simp [Complex.inner]; linarith

/-- Predpostavke `razd`, `kos` in `pravi` se dajo izpolniti (A = 1, B = 0, C = i). -/
example : (1:ℂ) - 0 = ((1:ℝ):ℂ) + ((0:ℝ):ℂ) * Complex.I ∧ Complex.I - 0 = ((0:ℝ):ℂ) + ((1:ℝ):ℂ) * Complex.I ∧
    (1:ℝ) * 0 + 0 * 1 = 0 := by
  refine ⟨by push_cast; ring, by push_cast; ring, by norm_num⟩

/-- Naloga 2 (romb): če se diagonali sekata v M, ki razpolavlja BD (MD→ = −MB→), in sta stranici AB in AD enako
dolgi, je ∠AMB = 90° (diagonali romba sta pravokotni): |AB|² = |MA→ − MB→|² in |AD|² = |MA→ + MB→|² se razlikujeta
za 4·⟨MA→, MB→⟩.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#romb-pravi-kot
besedilo: »a) Diagonali romba se razpolavljata in sta pravokotni, zato je trikotnik $AMB$ pravokoten s pravim kotom pri $M$ in s katetama $|AM| = 5\,\text{cm}$ in $|BM| = 3\,\text{cm}$.« -/
theorem romb_pravi_kot {A B D M : P} (hM : D -ᵥ M = -(B -ᵥ M)) (h : dist A B = dist A D) :
    ∠ A M B = π / 2 := by
  rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
  have e1 : dist A B = ‖(A -ᵥ M) - (B -ᵥ M)‖ := by rw [dist_eq_norm_vsub V, vsub_sub_vsub_cancel_right]
  have e2 : dist A D = ‖(A -ᵥ M) + (B -ᵥ M)‖ := by
    rw [dist_eq_norm_vsub V, ← vsub_sub_vsub_cancel_right A D M, hM, sub_neg_eq_add]
  have := congrArg (· ^ 2) (e1.symm.trans (h.trans e2))
  rw [norm_sub_sq_real, norm_add_sq_real] at this
  linarith

/-- Predpostavke `romb_pravi_kot` se dajo izpolniti: romb A = −5, B = −3i, D = 3i, M = 0 v ℂ. -/
example : (3 * Complex.I : ℂ) -ᵥ (0:ℂ) = -((-3 * Complex.I : ℂ) -ᵥ (0:ℂ)) ∧
    dist (-5:ℂ) (-3 * Complex.I) = dist (-5:ℂ) (3 * Complex.I) := by
  refine ⟨by simp, ?_⟩
  rw [razd _ _ (-5) 3 (by push_cast; ring), razd _ _ (-5) (-3) (by push_cast; ring)]; norm_num

/-- Predpostavke trditve `romb_pravi_kot` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (3 * Complex.I : ℂ) -ᵥ (0:ℂ) = -((-3 * Complex.I : ℂ) -ᵥ (0:ℂ)) ∧ dist (-5:ℂ) (-3 * Complex.I) = dist (-5:ℂ) (3 * Complex.I) := by
    refine ⟨by simp, ?_⟩
    rw [razd _ _ (-5) 3 (by push_cast; ring), razd _ _ (-5) (-3) (by push_cast; ring)]; norm_num
  romb_pravi_kot (hM := w.1) (h := w.2)

/-- Razlaga 2, Preizkus: v trikotniku C = 0, A = 4, B = 3i (v ℂ) s pravim kotom pri C je a = |BC| = 3, b = |AC| = 4,
c = |AB| = 5 (3² + 4² = 5²), zato je po `definicije` cos α = cos ∠CAB = b/c = 4/5. Drugače: Na sliki: pri c = 1 je
sin α = a/1 = a in cos α = b/1 = b.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#preizkus2
besedilo: »Preizkus:* trikotnik ima $a = 3$, $b = 4$, $c = 5$. Koliko je $\cos \alpha$? ($\dfrac{4}{5}$.)« -/
theorem preizkus2 :
    ∠ (3 * Complex.I) (0:ℂ) 4 = π / 2 ∧ dist (3 * Complex.I) (0:ℂ) = 3 ∧ dist (4:ℂ) 0 = 4 ∧
    dist (4:ℂ) (3 * Complex.I) = 5 ∧ (3:ℝ) ^ 2 + 4 ^ 2 = 5 ^ 2 ∧ cos (∠ (0:ℂ) 4 (3 * Complex.I)) = 4 / 5 ∧
    ∀ a b : ℝ, a / 1 = a ∧ b / 1 = b := by
  have h : ∠ (3 * Complex.I) (0:ℂ) 4 = π / 2 :=
    pravi _ _ _ 0 3 4 0 (by push_cast; ring) (by push_cast; ring) (by norm_num)
  have dA : dist (4:ℂ) 0 = 4 := by
    rw [razd _ _ 4 0 (by push_cast; ring)]; norm_num [show (16:ℝ) = 4 ^ 2 by norm_num]
  have dAB : dist (4:ℂ) (3 * Complex.I) = 5 := by
    rw [razd _ _ 4 (-3) (by push_cast; ring)]; norm_num [show (25:ℝ) = 5 ^ 2 by norm_num]
  have c := (definicije h (by norm_num) (by simp)).2.1
  refine ⟨h, by rw [razd _ _ 0 3 (by push_cast; ring)]; norm_num [show (9:ℝ) = 3 ^ 2 by norm_num], dA, dAB,
    by norm_num, by rw [c, dA, dAB], fun a b => ⟨div_one a, div_one b⟩⟩

/-- Razlaga 3 in Povzetek: za ostri kot je 0 < sin α < 1, 0 < cos α < 1 in tan α > 0; tan 45° = 1; tangens je
lahko poljubno velik (za vsak M obstaja ostri kot s tan α > M).
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#ostri-kot
besedilo: »Za ostri kot je $0 < \sin \alpha < 1$, $0 < \cos \alpha < 1$ in $\tan \alpha > 0$.« -/
theorem ostri_kot :
    (∀ α : ℝ, 0 < α → α < π / 2 → (0 < sin α ∧ sin α < 1) ∧ (0 < cos α ∧ cos α < 1) ∧ 0 < tan α) ∧
    tan (π / 4) = 1 ∧ ∀ M : ℝ, ∃ α : ℝ, 0 < α ∧ α < π / 2 ∧ M < tan α := by
  have hp := pi_pos
  refine ⟨fun α h0 h1 => ⟨⟨sin_pos_of_pos_of_lt_pi h0 (by linarith), ?_⟩,
    ⟨cos_pos_of_mem_Ioo ⟨by linarith, h1⟩, ?_⟩, tan_pos_of_pos_of_lt_pi_div_two h0 h1⟩, tan_pi_div_four,
    fun M => ⟨arctan (|M| + 1), arctan_pos.mpr (by positivity), arctan_lt_pi_div_two _, ?_⟩⟩
  · rw [← sin_pi_div_two]
    exact sin_lt_sin_of_lt_of_le_pi_div_two (by linarith) le_rfl h1
  · rw [← cos_zero]
    exact cos_lt_cos_of_nonneg_of_le_pi le_rfl (by linarith) h0
  · rw [tan_arctan]; linarith [le_abs_self M]

/-- Razlaga 3, Premisli 1: sin α = 1,2 ni mogoč (sin ≤ 1); tan α = 1,2 pa da α = arctan 1,2 ≈ 50,19° > 45°.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#premisli1
besedilo: »To se zgodi pri kotih nad $45^\circ$, za $\tan \alpha = 1{,}2$ je $\alpha \approx 50{,}19^\circ$.« -/
theorem premisli1 :
    (∀ α : ℝ, sin α ≠ 1.2) ∧ tan (arctan 1.2) = 1.2 ∧ π / 4 < arctan 1.2 ∧
    |arctan 1.2 * 180 / π - 50.19| < 0.005 := by
  refine ⟨fun α h => by linarith [sin_le_one α], tan_arctan _, ?_, ?_⟩
  · rw [← arctan_one]; exact arctan_strictMono (by norm_num)
  · obtain ⟨s1, s2⟩ := sin_meja 50.185 0.768115842152 0.768116003337 (by norm_num) (by norm_num) (by norm_num)
      (by norm_num)
    obtain ⟨c1, c2⟩ := cos_meja 50.185 0.640310805924 0.640310967109 (by norm_num) (by norm_num) (by norm_num)
      (by norm_num)
    obtain ⟨s3, s4⟩ := sin_meja 50.195 0.768227585624 0.768227747130 (by norm_num) (by norm_num) (by norm_num)
      (by norm_num)
    obtain ⟨c3, c4⟩ := cos_meja 50.195 0.640176734639 0.640176896146 (by norm_num) (by norm_num) (by norm_num)
      (by norm_num)
    obtain ⟨l, u⟩ := arctan_stopinj 1.2 50.185 50.195 (by norm_num) (by norm_num) (by norm_num) (by linarith)
      (by linarith)
    rw [abs_lt]; constructor <;> linarith

/-- Razlaga 4, Povzetek, Ponovitev in Ustno vprašanje 3: sin²α + cos²α = 1 in tan α = sin α/cos α; izpeljava iz
trikotnika: iz a² + b² = c² (c ≠ 0) je (a/c)² + (b/c)² = 1 in (a/c)/(b/c) = a/b; preizkus: 0,5² + 0,5² = 0,5 ≠ 1,
zato sin α in cos α nista hkrati 0,5.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#zveze
besedilo: »Pitagorov izrek $a^2 + b^2 = c^2$ delimo s $c^2$ in dobimo $\left(\frac{a}{c}\right)^2 + \left(\frac{b}{c}\right)^2 = 1$, torej $\sin^2 \alpha + \cos^2 \alpha = 1$.« -/
theorem zveze :
    (∀ α : ℝ, sin α ^ 2 + cos α ^ 2 = 1 ∧ tan α = sin α / cos α) ∧
    (∀ a b c : ℝ, c ≠ 0 → a ^ 2 + b ^ 2 = c ^ 2 → (a / c) ^ 2 + (b / c) ^ 2 = 1) ∧
    (∀ a b c : ℝ, c ≠ 0 → (a / c) / (b / c) = a / b) ∧ (0.5:ℝ) ^ 2 + 0.5 ^ 2 = 0.5 ∧ (0.5:ℝ) ≠ 1 := by
  refine ⟨fun α => ⟨sin_sq_add_cos_sq α, tan_eq_sin_div_cos α⟩, fun a b c hc h => ?_, fun a b c hc => ?_,
    by norm_num, by norm_num⟩
  · rw [div_pow, div_pow, ← add_div, h, div_self (pow_ne_zero 2 hc)]
  · rw [div_div_div_cancel_right₀ hc]

/-- Predpostavke drugega dela `zveze` se dajo izpolniti (a = 3, b = 4, c = 5). -/
example : (5:ℝ) ≠ 0 ∧ (3:ℝ) ^ 2 + 4 ^ 2 = 5 ^ 2 := by norm_num

/-- Razlaga 5, Povzetek in Premisli 2: sin α = cos(90° − α), cos α = sin(90° − α); sin 30° = cos 60°;
sin 20° = cos 70° (20° + 70° = 90°).
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#komplementarna
besedilo: »$$\sin \alpha = \cos (90^\circ - \alpha), \qquad \cos \alpha = \sin (90^\circ - \alpha)$$« -/
theorem komplementarna :
    (∀ α : ℝ, sin α = cos (π / 2 - α) ∧ cos α = sin (π / 2 - α)) ∧ sin (π / 6) = cos (π / 3) ∧
    sin (20 * π / 180) = cos (70 * π / 180) ∧ (20:ℝ) + 70 = 90 := by
  refine ⟨fun α => ⟨(cos_pi_div_two_sub α).symm, (sin_pi_div_two_sub α).symm⟩, ?_, kot70.2.symm, by norm_num⟩
  rw [sin_pi_div_six, cos_pi_div_three]

/-- Razlaga 6 (tabela), Povzetek, Ponovitev, Ustno vprašanje 2 in Preveri se 1: sin 30° = 1/2, cos 30° = √3/2,
tan 30° = √3/3; sin 45° = cos 45° = √2/2, tan 45° = 1; sin 60° = √3/2, cos 60° = 1/2, tan 60° = √3; preizkus
tan 30°·tan 60° = 1.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#posebne-vrednosti
besedilo: »$\sin 30^\circ = \dfrac{1}{2}$, $\sin 45^\circ = \dfrac{\sqrt{2}}{2}$, $\tan 60^\circ = \sqrt{3}$ (na pamet)« -/
theorem posebne_vrednosti :
    sin (π / 6) = 1 / 2 ∧ cos (π / 6) = √3 / 2 ∧ tan (π / 6) = √3 / 3 ∧ sin (π / 4) = √2 / 2 ∧
    cos (π / 4) = √2 / 2 ∧ tan (π / 4) = 1 ∧ sin (π / 3) = √3 / 2 ∧ cos (π / 3) = 1 / 2 ∧ tan (π / 3) = √3 ∧
    tan (π / 6) * tan (π / 3) = 1 ∧ (30:ℝ) * π / 180 = π / 6 ∧ (45:ℝ) * π / 180 = π / 4 ∧
    (60:ℝ) * π / 180 = π / 3 := by
  have h3 := koren3.2.2
  have h3p : (0:ℝ) < √3 := Real.sqrt_pos.mpr (by norm_num)
  have t6 : tan (π / 6) = √3 / 3 := by
    rw [tan_pi_div_six]; field_simp; nlinarith [h3]
  refine ⟨sin_pi_div_six, cos_pi_div_six, t6, sin_pi_div_four, cos_pi_div_four, tan_pi_div_four,
    sin_pi_div_three, cos_pi_div_three, tan_pi_div_three, ?_, by ring, by ring, by ring⟩
  rw [t6, tan_pi_div_three]; nlinarith [h3]

/-- Razlaga 7, Pogoste napake: iz sin α = 0,5 dobimo α = sin⁻¹ 0,5 = 30° (π/6), medtem ko je 1/sin 30° = 2;
22,62° ≈ 22°37' (0,62·60' = 37,2'), 40,5° = 40°30' (0,5·60' = 30').
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#racunalo
besedilo: »$\sin^{-1}$ ni obratna vrednost.** Tipka $\sin^{-1}$ iz vrednosti vrne **kot**, ne pa $\dfrac{1}{\sin \alpha}$. Iz $\sin \alpha = 0{,}5$ dobiš $\alpha = 30^\circ$, medtem ko je $\dfrac{1}{\sin 30^\circ} = 2$.« -/
theorem racunalo :
    arcsin 0.5 = π / 6 ∧ 1 / sin (π / 6) = 2 ∧ (0.62:ℝ) * 60 = 37.2 ∧ |(37.2:ℝ) - 37| < 0.5 ∧
    (0.5:ℝ) * 60 = 30 := by
  refine ⟨?_, by rw [sin_pi_div_six]; norm_num, by norm_num, by rw [abs_lt]; constructor <;> norm_num, by norm_num⟩
  rw [show (0.5 : ℝ) = 1 / 2 by norm_num, ← sin_pi_div_six,
    arcsin_sin (by linarith [pi_pos]) (by linarith [pi_pos])]

/-! ## Rešeni primeri -/

/-- Primer 1, koraka 1 in 2: c = √(5² + 12²) = √169 = 13; sin α = 5/13 ≈ 0,3846, cos α = 12/13 ≈ 0,9231,
tan α = 5/12 ≈ 0,4167.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#primer1-vrednosti
besedilo: »$\sin \alpha = \dfrac{5}{13} \approx 0{,}3846$, $\;\cos \alpha = \dfrac{12}{13} \approx 0{,}9231$, $\;\tan \alpha = \dfrac{5}{12} \approx 0{,}4167$.« -/
theorem primer1_vrednosti :
    √((5:ℝ) ^ 2 + 12 ^ 2) = √169 ∧ √(169:ℝ) = 13 ∧ |(5:ℝ) / 13 - 0.3846| < 0.00005 ∧
    |(12:ℝ) / 13 - 0.9231| < 0.00005 ∧ |(5:ℝ) / 12 - 0.4167| < 0.00005 := by
  refine ⟨by norm_num, ?_, ?_, ?_, ?_⟩
  · rw [show (169:ℝ) = 13 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  all_goals rw [abs_lt]; constructor <;> norm_num

/-- Primer 1, koraki 3–5 (in Razlaga 7): α = tan⁻¹(5/12) ≈ 22,62° in res sin α = 5/13, cos α = 12/13; preizkus
25/169 + 144/169 = 1.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#primer1-kot
besedilo: »Odgovor: hipotenuza meri $13\,\text{cm}$, $\sin \alpha = \dfrac{5}{13}$, $\cos \alpha = \dfrac{12}{13}$, $\tan \alpha = \dfrac{5}{12}$ in $\alpha \approx 22{,}62^\circ$ (približno $22^\circ 37'$).« -/
theorem primer1_kot :
    |arctan (5 / 12) * 180 / π - 22.62| < 0.005 ∧ sin (arctan (5 / 12)) = 5 / 13 ∧
    cos (arctan (5 / 12)) = 12 / 13 ∧ (25:ℝ) / 169 + 144 / 169 = 1 := by
  have r : √(1 + (5 / 12 : ℝ) ^ 2) = 13 / 12 := by
    rw [show (1 + (5 / 12 : ℝ) ^ 2) = (13 / 12) ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨?_, by rw [sin_arctan, r]; norm_num, by rw [cos_arctan, r]; norm_num, by norm_num⟩
  obtain ⟨s1, s2⟩ := sin_meja 22.615 0.384537005318 0.384537005400 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  obtain ⟨c1, c2⟩ := cos_meja 22.615 0.923109577180 0.923109577262 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  obtain ⟨s3, s4⟩ := sin_meja 22.625 0.384698112475 0.384698112557 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  obtain ⟨c3, c4⟩ := cos_meja 22.625 0.923042448752 0.923042448834 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  obtain ⟨l, u⟩ := arctan_stopinj (5 / 12) 22.615 22.625 (by norm_num) (by norm_num) (by norm_num)
    (by linarith) (by linarith)
  rw [abs_lt]; constructor <;> linarith

/-- Primer 2: a = 8·sin 35° ≈ 8·0,5736 ≈ 4,59 cm (nezaokroženo 4,5886), b = 8·cos 35° ≈ 8·0,8192 ≈ 6,55 cm
(6,5532), β = 90° − 35° = 55°, S = ab/2 ≈ 15,04 cm² (tudi 4,5886·6,5532/2 ≈ 15,04); preizkus a² + b² = 64 = 8²
(4,5886² ≈ 21,06, 6,5532² ≈ 42,94, 21,06 + 42,94 = 64); Pogoste napake: 8/sin 35° ≈ 13,95 > 8 (napačna formula).
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#primer2
besedilo: »$4{,}5886^2 + 6{,}5532^2 \approx 21{,}06 + 42{,}94 = 64 = 8^2$« -/
theorem primer2 :
    |sin (35 * π / 180) - 0.5736| < 0.00005 ∧ |8 * sin (35 * π / 180) - 4.5886| < 0.00005 ∧
    |8 * sin (35 * π / 180) - 4.59| < 0.005 ∧ |cos (35 * π / 180) - 0.8192| < 0.00005 ∧
    |8 * cos (35 * π / 180) - 6.5532| < 0.00005 ∧ |8 * cos (35 * π / 180) - 6.55| < 0.005 ∧
    (90:ℝ) - 35 = 55 ∧ |8 * sin (35 * π / 180) * (8 * cos (35 * π / 180)) / 2 - 15.04| < 0.005 ∧
    |(4.5886:ℝ) * 6.5532 / 2 - 15.04| < 0.005 ∧
    (8 * sin (35 * π / 180)) ^ 2 + (8 * cos (35 * π / 180)) ^ 2 = 8 ^ 2 ∧
    |(4.5886:ℝ) ^ 2 - 21.06| < 0.005 ∧ |(6.5532:ℝ) ^ 2 - 42.94| < 0.005 ∧ (21.06:ℝ) + 42.94 = 64 ∧
    |8 / sin (35 * π / 180) - 13.95| < 0.005 ∧ 8 < 8 / sin (35 * π / 180) := by
  obtain ⟨s1, s2⟩ := sin_meja 35 0.573576434250 0.573576438676 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨c1, c2⟩ := cos_meja 35 0.819152044063 0.819152048489 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have sp : 0 < sin (35 * π / 180) := by linarith
  have cp : 0 < cos (35 * π / 180) := by linarith
  have p1 := mul_le_mul s1 c1 (by norm_num) sp.le
  have p2 := mul_le_mul s2 c2 cp.le (by norm_num)
  obtain ⟨d1, d2⟩ := div_med 8 (sin (35 * π / 180)) 13.945 13.955 sp (by linarith) (by linarith)
  have e : (8 * sin (35 * π / 180)) ^ 2 + (8 * cos (35 * π / 180)) ^ 2 = 8 ^ 2 := by
    rw [mul_pow, mul_pow, ← mul_add, sin_sq_add_cos_sq, mul_one]
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, by norm_num, ?_, ?_, e, ?_, ?_, by norm_num, ?_, ?_⟩
  all_goals first
    | (rw [abs_lt]; constructor <;> norm_num <;> nlinarith)
    | nlinarith

/-- Primer 3, koraki 2–5: za d > 0 iz tan 45° = h/d sledi h = d, iz tan 30° = h/(d + 20) sledi h = (d + 20)/√3;
z d = h in množenjem s √3 dobimo √3·h = h + 20, h(√3 − 1) = 20 in h = 20/(√3 − 1); skupaj natanko h = d in
h = 20/(√3 − 1) = 20(√3 + 1)/(3 − 1) = 10(√3 + 1) m ≈ 27,32 m.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#primer3
besedilo: »$h = \dfrac{20(\sqrt{3} + 1)}{3 - 1}\,\text{m} = 10(\sqrt{3} + 1)\,\text{m} \approx 27{,}32\,\text{m}$« -/
theorem primer3 :
    (∀ h d : ℝ, 0 < d → tan (π / 4) = h / d → tan (π / 6) = h / (d + 20) →
      h = d ∧ h = (d + 20) / √3 ∧ √3 * h = h + 20 ∧ h * (√3 - 1) = 20 ∧ h = 20 / (√3 - 1)) ∧
    (∀ h d : ℝ, 0 < d → ((tan (π / 4) = h / d ∧ tan (π / 6) = h / (d + 20)) ↔
      (h = 10 * (√3 + 1) ∧ d = h))) ∧
    20 / (√3 - 1) = 20 * (√3 + 1) / (3 - 1) ∧ 20 * (√3 + 1) / (3 - 1) = 10 * (√3 + 1) ∧
    |10 * (√3 + 1) - 27.32| < 0.005 := by
  obtain ⟨r1, r2, r3⟩ := koren3
  have hne : √3 - 1 ≠ 0 := by intro h; linarith
  have hp : 0 < √3 := by linarith
  refine ⟨fun h d hd e1 e2 => ?_, fun h d hd => ?_, ?_, by ring, by rw [abs_lt]; constructor <;> linarith⟩
  · rw [tan_pi_div_four, eq_div_iff hd.ne'] at e1
    rw [tan_pi_div_six, div_eq_div_iff hp.ne' (by linarith)] at e2
    have hh : h = (d + 20) / √3 := by rw [eq_div_iff hp.ne']; linarith
    have k1 : √3 * h = h + 20 := by linarith
    have k2 : h * (√3 - 1) = 20 := by linarith
    exact ⟨by linarith, hh, k1, k2, by rw [eq_div_iff hne]; exact k2⟩
  · rw [tan_pi_div_four, tan_pi_div_six]
    have h3n : √3 ≠ 0 := hp.ne'
    have hd' : d ≠ 0 := hd.ne'
    have k : (√3 - 1) * (√3 + 1) = 2 := by ring_nf; linarith [r3]
    constructor
    · rintro ⟨e1, e2⟩
      rw [eq_div_iff hd'] at e1
      have hdh : d = h := by linarith
      subst hdh
      rw [div_eq_div_iff h3n (by linarith)] at e2
      have e4 : d * (√3 - 1) = 20 := by linarith
      have e5 : d * ((√3 - 1) * (√3 + 1)) = 20 * (√3 + 1) := by rw [← mul_assoc, e4]
      rw [k] at e5
      exact ⟨by linarith, rfl⟩
    · rintro ⟨e1, rfl⟩
      refine ⟨(div_self hd').symm, ?_⟩
      rw [div_eq_div_iff h3n (by linarith), e1]
      nlinarith [r3]
  · rw [div_eq_div_iff hne (by norm_num)]; nlinarith [r3]

/-- Predpostavka prvega dela `primer3` se da izpolniti (d = 10(√3 + 1) > 0). -/
example : (0:ℝ) < 10 * (√3 + 1) := by positivity

/-- Primer 3, korak 6: bolj oddaljeno opazovališče je 10(√3 + 1) + 20 ≈ 47,32 m od vznožja; 47,32·0,5774 ≈ 27,32
in 47,32·tan 30° ≈ 27,32; tan 30° ≈ 0,5774.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#primer3-preverjanje
besedilo: »Preverjanje: bolj oddaljeno opazovališče je od vznožja oddaljeno $47{,}32\,\text{m}$; $\;47{,}32 \cdot \tan 30^\circ \approx 47{,}32 \cdot 0{,}5774 \approx 27{,}32$. ✓« -/
theorem primer3_preverjanje :
    |10 * (√3 + 1) + 20 - 47.32| < 0.005 ∧ |(47.32:ℝ) * 0.5774 - 27.32| < 0.005 ∧
    |47.32 * tan (π / 6) - 27.32| < 0.005 ∧ |tan (π / 6) - 0.5774| < 0.00005 := by
  obtain ⟨r1, r2, r3⟩ := koren3
  have t : tan (π / 6) = √3 / 3 := posebne_vrednosti.2.2.1
  refine ⟨by rw [abs_lt]; constructor <;> linarith, by rw [abs_lt]; constructor <;> norm_num, ?_, ?_⟩ <;>
    rw [t, abs_lt] <;> constructor <;> linarith

/-- Primer 4: h = 15 km·tan 6°, tan 6° ≈ 0,1051, h ≈ 15·0,1051 ≈ 1,58 km; senca je približno desetkrat (med 9- in
10-krat) daljša od višine gore.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#primer4
besedilo: »$\tan 6^\circ \approx 0{,}1051$, zato je $h \approx 15\,\text{km} \cdot 0{,}1051 \approx 1{,}58\,\text{km}$. Ker je Sonce nizko, je senca približno desetkrat daljša od višine gore.« -/
theorem primer4 :
    |tan (6 * π / 180) - 0.1051| < 0.00005 ∧ |15 * tan (6 * π / 180) - 1.58| < 0.005 ∧
    |(15:ℝ) * 0.1051 - 1.58| < 0.005 ∧ 9 < 15 / (15 * tan (6 * π / 180)) ∧ 15 / (15 * tan (6 * π / 180)) < 10 := by
  obtain ⟨s1, s2⟩ := sin_meja 6 0.104528463264 0.104528463272 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨c1, c2⟩ := cos_meja 6 0.994521895364 0.994521895372 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have cp : 0 < cos (6 * π / 180) := by linarith
  have t := tan_eq_sin_div_cos (6 * π / 180)
  obtain ⟨l, u⟩ := div_med (sin (6 * π / 180)) (cos (6 * π / 180)) 0.10505 0.10515 cp (by linarith) (by linarith)
  rw [← t] at l u
  have tp : 0 < tan (6 * π / 180) := by linarith
  obtain ⟨l2, u2⟩ := div_med 15 (15 * tan (6 * π / 180)) 9 10 (by positivity) (by nlinarith) (by nlinarith)
  exact ⟨by rw [abs_lt]; constructor <;> linarith, by rw [abs_lt]; constructor <;> linarith,
    by rw [abs_lt]; constructor <;> norm_num, l2, u2⟩

/-! ## Pogoste napake -/

/-- Pogoste napake (računalo v radianih): sin 30 (radianov) ≈ −0,988, v stopinjah pa sin 30° = 0,5.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#radiani
besedilo: »Računalo v radianih.** Če dobiš $\sin 30^\circ \approx -0{,}988$, je računalo nastavljeno na radiane (RAD). Nastavi ga na stopinje (DEG) in preveri: $\sin 30^\circ = 0{,}5$.« -/
theorem radiani : |sin 30 - (-0.988)| < 0.0005 ∧ sin (30 * π / 180) = 0.5 := by
  have p1 := pi_gt_d6
  have p2 := pi_lt_d6
  have e : sin 30 = -cos (30 - 19 * π / 2) := by
    have : sin 30 = sin ((30 - 19 * π / 2) + π / 2 + π + ((4:ℕ):ℝ) * (2 * π)) := by congr 1; push_cast; ring
    rw [this, sin_add_nat_mul_two_pi, sin_add_pi, sin_add_pi_div_two]
  set z := 30 - 19 * π / 2 with hz
  have z1 : 0.154 < z := by rw [hz]; linarith
  have z2 : z < 0.155 := by rw [hz]; linarith
  have lo := one_sub_sq_div_two_le_cos (x := z)
  have hb := cos_bound (x := z) (by rw [abs_of_pos (by linarith)]; linarith)
  rw [abs_of_pos (by linarith : (0:ℝ) < z), abs_le] at hb
  have z4 : z ^ 4 < 0.155 ^ 4 := pow_lt_pow_left₀ z2 (by linarith) (by norm_num)
  refine ⟨?_, ?_⟩
  · rw [e, abs_lt]; constructor <;> nlinarith
  · rw [show (30:ℝ) * π / 180 = π / 6 by ring, sin_pi_div_six]; norm_num

/-! ## Preveri se -/

/-- Preveri se 1: pri 60° je (sin, cos, tan) = (√3/2, 1/2, √3); trojica (1/2, √3/2, √3/3) spada k 30°, (√2/2, √2/2, 1)
k 45°, obrnjeni tangens √3/3 pa ni tan 60°.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#kviz1
besedilo: »Pri $60^\circ$ je $\sin 60^\circ = \dfrac{\sqrt{3}}{2}$, $\cos 60^\circ = \dfrac{1}{2}$ in $\tan 60^\circ = \sqrt{3}$.« -/
theorem kviz1 :
    (sin (π / 3), cos (π / 3), tan (π / 3)) = (√3 / 2, 1 / 2, √3) ∧
    (sin (π / 6), cos (π / 6), tan (π / 6)) = (1 / 2, √3 / 2, √3 / 3) ∧
    (sin (π / 4), cos (π / 4), tan (π / 4)) = (√2 / 2, √2 / 2, 1) ∧ √3 / 3 ≠ √3 ∧ cos (π / 3) < sin (π / 3) := by
  obtain ⟨a1, a2, a3, a4, a5, a6, a7, a8, a9, -⟩ := posebne_vrednosti
  obtain ⟨r1, r2, r3⟩ := koren3
  refine ⟨by rw [a7, a8, a9], by rw [a1, a2, a3], by rw [a4, a5, a6], fun h => by linarith, by
    rw [a7, a8]; linarith⟩

/-- Preveri se 2: sin 30° = 0,5 < sin 40° < sin 45° ≈ 0,71, sin 40° ≈ 0,643 (sinus ostrega kota raste).
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#kviz2
besedilo: »Sinus ostrega kota raste: $\sin 30^\circ = 0{,}5$ in $\sin 45^\circ \approx 0{,}71$, vmes je $\sin 40^\circ$. Računalo da $\sin 40^\circ \approx 0{,}643$.« -/
theorem kviz2 :
    (0.5:ℝ) < sin (40 * π / 180) ∧ sin (40 * π / 180) < 0.71 ∧ |sin (40 * π / 180) - 0.643| < 0.0005 ∧
    sin (π / 6) < sin (40 * π / 180) ∧ sin (40 * π / 180) < sin (π / 4) ∧ |sin (π / 4) - 0.71| < 0.005 := by
  obtain ⟨s1, s2⟩ := sin_meja 40 0.642787601808 0.642787618527 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨q1, q2, _⟩ := koren2
  have hp := pi_pos
  refine ⟨by linarith, by linarith, by rw [abs_lt]; constructor <;> linarith, ?_, ?_, ?_⟩
  · exact sin_lt_sin_of_lt_of_le_pi_div_two (by linarith) (by linarith) (by linarith)
  · exact sin_lt_sin_of_lt_of_le_pi_div_two (by linarith) (by linarith) (by linarith)
  · rw [sin_pi_div_four, abs_lt]; constructor <;> linarith

/-- Preveri se 4: tan α = 1,5/2,6 ≈ 0,577 in α = tan⁻¹(1,5/2,6) ≈ 29,98° ≈ 30°; v radianih je kot ≈ 0,52, obratna
vrednost razmerja pa 2,6/1,5 ≈ 1,73.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#kviz4
besedilo: »$\tan \alpha = \dfrac{1{,}5\,\text{m}}{2{,}6\,\text{m}} \approx 0{,}577$, zato je $\alpha = \tan^{-1} 0{,}577 \approx 30^\circ$ (natančneje $29{,}98^\circ$).« -/
theorem kviz4 :
    |(1.5:ℝ) / 2.6 - 0.577| < 0.0005 ∧ |arctan (1.5 / 2.6) * 180 / π - 29.98| < 0.005 ∧
    |arctan (1.5 / 2.6) * 180 / π - 30| < 0.5 ∧ |arctan (1.5 / 2.6) - 0.52| < 0.005 ∧
    |(2.6:ℝ) / 1.5 - 1.73| < 0.005 := by
  obtain ⟨s1, s2⟩ := sin_meja 29.975 0.499622077087 0.499622078052 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  obtain ⟨c1, c2⟩ := cos_meja 29.975 0.866243487433 0.866243488399 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  obtain ⟨s3, s4⟩ := sin_meja 29.985 0.499773257485 0.499773258453 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  obtain ⟨c3, c4⟩ := cos_meja 29.985 0.866156273737 0.866156274706 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  obtain ⟨l, u⟩ := arctan_stopinj (1.5 / 2.6) 29.975 29.985 (by norm_num) (by norm_num) (by norm_num)
    (by linarith) (by linarith)
  have hp := pi_pos
  have p1 := pi_gt_d6
  have p2 := pi_lt_d6
  have l' := (lt_div_iff₀ hp).mp l
  have u' := (div_lt_iff₀ hp).mp u
  refine ⟨by rw [abs_lt]; constructor <;> norm_num, by rw [abs_lt]; constructor <;> linarith,
    by rw [abs_lt]; constructor <;> linarith, ?_, by rw [abs_lt]; constructor <;> norm_num⟩
  rw [abs_lt]; constructor <;> nlinarith

/-- Preveri se 5: lestev 5 m pod kotom 70°: h = 5·sin 70° ≈ 4,70 m; napačni odgovori 5·cos 70° ≈ 1,71,
5/sin 70° ≈ 5,32, 5·tan 70° ≈ 13,74.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#kviz5
besedilo: »Lestev je hipotenuza, višina je nasprotna kateta kota ob tleh: $h = 5\,\text{m} \cdot \sin 70^\circ \approx 4{,}70\,\text{m}$.« -/
theorem kviz5 :
    |5 * sin (70 * π / 180) - 4.70| < 0.005 ∧ |5 * cos (70 * π / 180) - 1.71| < 0.005 ∧
    |5 / sin (70 * π / 180) - 5.32| < 0.005 ∧ |5 * tan (70 * π / 180) - 13.74| < 0.005 := by
  obtain ⟨s1, s2⟩ := sin_meja 20 0.342020143307 0.342020143347 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨c1, c2⟩ := cos_meja 20 0.939692620773 0.939692620813 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨k1, k2⟩ := kot70
  have sp : 0 < sin (20 * π / 180) := by linarith
  have cp : 0 < cos (20 * π / 180) := by linarith
  rw [tan_eq_sin_div_cos, k1, k2]
  obtain ⟨d1, d2⟩ := div_med 5 (cos (20 * π / 180)) 5.315 5.325 cp (by linarith) (by linarith)
  obtain ⟨d3, d4⟩ := div_med (cos (20 * π / 180)) (sin (20 * π / 180)) 2.7472 2.7478 sp (by linarith)
    (by linarith)
  refine ⟨?_, ?_, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Preveri se 6: kateta 7 cm nasproti 30°: sin 30° = a/c = 1/2, zato c = 2a = 14 cm (napaka 7·sin 30° = 3,5).
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#kviz6
besedilo: »3,5 | To je $7\,\text{cm} \cdot \sin 30^\circ$. Iz $\sin 30^\circ = \dfrac{a}{c}$ sledi $c = \dfrac{a}{\sin 30^\circ}$, deliti moraš. Hipotenuza je najdaljša stranica, ne more biti krajša od katete.« -/
theorem kviz6 (c : ℝ) (hc : 0 < c) : (sin (π / 6) = 7 / c ↔ c = 14) ∧ 7 * sin (π / 6) = 3.5 := by
  rw [sin_pi_div_six]
  refine ⟨⟨fun h => ?_, fun h => by rw [h]; norm_num⟩, by norm_num⟩
  rw [div_eq_div_iff (by norm_num) hc.ne'] at h; linarith

/-- Predpostavka `kviz6` se da izpolniti (c = 14). -/
example : (0:ℝ) < 14 := by norm_num

/-! ## Drugače -/

/-- Predpostavke trditve `kviz6` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 14 := by norm_num
  kviz6 (hc := w)

/-- Drugače: Korak za korakom: kvadrat s stranico 1 ima diagonalo √(1 + 1) = √2, sin 45° = 1/√2 = √2/2 ≈ 0,7071;
enakostranični trikotnik s stranico 2 ima višino √(4 − 1) = √3, cos 30° = √3/2 ≈ 0,8660, tan 30° = 1/√3 = √3/3 ≈
0,5774, tan 60° = √3 ≈ 1,7321.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#korak-za-korakom
besedilo: »Krajša kateta leži nasproti kota $30^\circ$: $\sin 30^\circ = \dfrac{1}{2}$, $\cos 30^\circ = \dfrac{\sqrt{3}}{2} \approx 0{,}8660$, $\tan 30^\circ = \dfrac{1}{\sqrt{3}} = \dfrac{\sqrt{3}}{3} \approx 0{,}5774$.« -/
theorem korak_za_korakom :
    √((1:ℝ) + 1) = √2 ∧ 1 / √2 = √2 / 2 ∧ |√2 / 2 - 0.7071| < 0.00005 ∧ √((4:ℝ) - 1) = √3 ∧
    |√3 / 2 - 0.8660| < 0.00005 ∧ 1 / √3 = √3 / 3 ∧ |√3 / 3 - 0.5774| < 0.00005 ∧ |√3 - 1.7321| < 0.00005 := by
  obtain ⟨q1, q2, q3⟩ := koren2
  obtain ⟨r1, r2, r3⟩ := koren3
  have h2 : (0:ℝ) < √2 := by linarith
  have h3 : (0:ℝ) < √3 := by linarith
  refine ⟨by norm_num, by field_simp; nlinarith [q3], by rw [abs_lt]; constructor <;> linarith, by norm_num,
    by rw [abs_lt]; constructor <;> linarith, by field_simp; nlinarith [r3], by rw [abs_lt]; constructor <;> linarith,
    by rw [abs_lt]; constructor <;> linarith⟩

/-- Drugače: Bolj natančno: za ostri kot s sin α = 3/5 je cos α = √(1 − 9/25) = 4/5 in tan α = (3/5)/(4/5) = 3/4;
1 + tan²α = 1/cos²α (cos α ≠ 0).
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#iz-ene-vrednosti
besedilo: »Iz $\sin \alpha = \dfrac{3}{5}$ sledi $\cos \alpha = \sqrt{1 - \dfrac{9}{25}} = \dfrac{4}{5}$ (pozitivni koren, ker je kot oster) in $\tan \alpha = \dfrac{3/5}{4/5} = \dfrac{3}{4}$.« -/
theorem iz_ene_vrednosti :
    (∀ α : ℝ, 0 < α → α < π / 2 → sin α = 3 / 5 → cos α = 4 / 5 ∧ tan α = 3 / 4) ∧
    √(1 - 9 / 25 : ℝ) = 4 / 5 ∧ (∀ α : ℝ, cos α ≠ 0 → 1 + tan α ^ 2 = 1 / cos α ^ 2) := by
  refine ⟨fun α h0 h1 hs => ?_, ?_, fun α hc => ?_⟩
  · have cp : 0 < cos α := cos_pos_of_mem_Ioo ⟨by linarith, h1⟩
    have e : cos α ^ 2 = (4 / 5) ^ 2 := by have := sin_sq_add_cos_sq α; rw [hs] at this; linarith
    have hc : cos α = 4 / 5 := (pow_left_inj₀ cp.le (by norm_num) two_ne_zero).mp e
    refine ⟨hc, ?_⟩
    rw [tan_eq_sin_div_cos, hs, hc]; norm_num
  · rw [show (1 - 9 / 25 : ℝ) = (4 / 5) ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [tan_eq_sin_div_cos, div_pow, show (1:ℝ) / cos α ^ 2 = (sin α ^ 2 + cos α ^ 2) / cos α ^ 2 by
      rw [sin_sq_add_cos_sq], add_div, div_self (pow_ne_zero 2 hc)]
    ring

/-- Predpostavke prvega dela `iz_ene_vrednosti` se dajo izpolniti (α = arcsin(3/5)). -/
example : 0 < arcsin (3 / 5 : ℝ) ∧ arcsin (3 / 5 : ℝ) < π / 2 ∧ sin (arcsin (3 / 5 : ℝ)) = 3 / 5 :=
  ⟨arcsin_pos.mpr (by norm_num), arcsin_lt_pi_div_two.mpr (by norm_num), sin_arcsin (by norm_num) (by norm_num)⟩

/-- Razlaga 3 in Drugače: Bolj natančno (monotonost): na (0°, 90°) sinus in tangens strogo naraščata, kosinus
strogo pada, zato vrednost kotne funkcije določa ostri kot enolično.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#monotonost
besedilo: »Monotonost.** Pri stalni hipotenuzi se z večanjem kota $\alpha$ nasprotna kateta veča, priležna manjša. Zato na intervalu $(0^\circ, 90^\circ)$ sinus in tangens naraščata, kosinus pa pada. Zaradi tega iz vrednosti kotne funkcije ostri kot določimo enolično.« -/
theorem monotonost :
    StrictMonoOn sin (Ioo 0 (π / 2)) ∧ StrictAntiOn cos (Ioo 0 (π / 2)) ∧ StrictMonoOn tan (Ioo 0 (π / 2)) ∧
    InjOn sin (Ioo 0 (π / 2)) ∧ InjOn cos (Ioo 0 (π / 2)) ∧ InjOn tan (Ioo 0 (π / 2)) := by
  have hp := pi_pos
  have a : StrictMonoOn sin (Ioo 0 (π / 2)) :=
    strictMonoOn_sin.mono fun x hx => ⟨by linarith [hx.1], hx.2.le⟩
  have b : StrictAntiOn cos (Ioo 0 (π / 2)) :=
    strictAntiOn_cos.mono fun x hx => ⟨hx.1.le, by linarith [hx.2]⟩
  have c : StrictMonoOn tan (Ioo 0 (π / 2)) :=
    strictMonoOn_tan.mono fun x hx => ⟨by linarith [hx.1], hx.2⟩
  exact ⟨a, b, c, a.injOn, b.injOn, c.injOn⟩

/-! ## Za maturo -/

/-- Naloga 1: za ostri kot s tan α = 2 je α = tan⁻¹ 2 (kateti 2 in 1, c = √(2² + 1²) = √5), sin α = 2/√5 = 2√5/5,
cos α = 1/√5 = √5/5 (blok RACUN); preizkus 4/5 + 1/5 = 1.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#naloga1
besedilo: »$\sin \alpha = \dfrac{a}{c} = \dfrac{2}{\sqrt{5}} = \dfrac{2\sqrt{5}}{5}$ in $\cos \alpha = \dfrac{b}{c} = \dfrac{1}{\sqrt{5}} = \dfrac{\sqrt{5}}{5}$.« -/
theorem naloga1 :
    √((2:ℝ) ^ 2 + 1 ^ 2) = √5 ∧
    (∀ α : ℝ, 0 < α → α < π / 2 → tan α = 2 → α = arctan 2 ∧ sin α = 2 * √5 / 5 ∧ cos α = √5 / 5) ∧
    2 / √5 = 2 * √5 / 5 ∧ 1 / √5 = √5 / 5 ∧ (4:ℝ) / 5 + 1 / 5 = 1 := by
  have h5 : √5 ^ 2 = (5:ℝ) := Real.sq_sqrt (by norm_num)
  have h5p : (0:ℝ) < √5 := Real.sqrt_pos.mpr (by norm_num)
  have r : √(1 + (2:ℝ) ^ 2) = √5 := by norm_num
  have e1 : 2 / √5 = 2 * √5 / 5 := by field_simp; nlinarith [h5]
  have e2 : 1 / √5 = √5 / 5 := by field_simp; nlinarith [h5]
  refine ⟨by norm_num, fun α h0 h1 ht => ?_, e1, e2, by norm_num⟩
  have ha : α = arctan 2 := by rw [← ht, arctan_tan (by linarith) h1]
  refine ⟨ha, ?_, ?_⟩
  · rw [ha, sin_arctan, r, e1]
  · rw [ha, cos_arctan, r, e2]

/-- Naloga 1 (blok RACUN): sin(tan⁻¹ 2) = 2√5/5 in cos(tan⁻¹ 2) = √5/5.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#racun-naloga1
besedilo: »Odgovor: $\sin \alpha = \dfrac{2\sqrt{5}}{5}$ in $\cos \alpha = \dfrac{\sqrt{5}}{5}$.« -/
theorem racun_naloga1 : sin (arctan 2) = 2 * √5 / 5 ∧ cos (arctan 2) = √5 / 5 := by
  obtain ⟨-, h, -⟩ := naloga1
  have := h (arctan 2) (arctan_pos.mpr (by norm_num)) (arctan_lt_pi_div_two _) (tan_arctan _)
  exact ⟨this.2.1, this.2.2⟩

/-- Predpostavke `naloga1` se dajo izpolniti (α = arctan 2). -/
example : 0 < arctan (2:ℝ) ∧ arctan (2:ℝ) < π / 2 ∧ tan (arctan (2:ℝ)) = 2 :=
  ⟨arctan_pos.mpr (by norm_num), arctan_lt_pi_div_two _, tan_arctan _⟩

/-- Naloga 2 a) (in blok RACUN): |AM| = 10/2 = 5, |BM| = 6/2 = 3, |AB| = √(5² + 3²) = √34 ≈ 5,8310 ≈ 5,83 cm.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#naloga2-a
besedilo: »$|AB| = \sqrt{5^2 + 3^2}\,\text{cm} = \sqrt{34}\,\text{cm} \approx 5{,}8310\,\text{cm} \approx 5{,}83\,\text{cm}$« -/
theorem naloga2_a :
    (10:ℝ) / 2 = 5 ∧ (6:ℝ) / 2 = 3 ∧ √((5:ℝ) ^ 2 + 3 ^ 2) = √34 ∧ |√(34:ℝ) - 5.8310| < 0.00005 ∧
    |√(34:ℝ) - 5.83| < 0.005 := by
  have l : (5.830951 : ℝ) < √34 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u : √(34:ℝ) < 5.830952 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Naloga 2 b) (in blok RACUN): ∠MAB = tan⁻¹(3/5) (dokazano v `naloga2_romb`) ≈ 30,9638°, ∠DAB = 2∠MAB ≈ 61,9275° ≈ 61,93°,
∠ABC = 180° − ∠DAB ≈ 118,0725° ≈ 118,07°.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#naloga2-b
besedilo: »b) Sosednja kota romba sta suplementarna: $\angle ABC = 180^\circ - \angle DAB \approx 118{,}0725^\circ \approx 118{,}07^\circ$.« -/
theorem naloga2_b :
    |arctan (3 / 5) * 180 / π - 30.9638| < 0.00005 ∧
    |2 * arctan (3 / 5) * 180 / π - 61.9275| < 0.00005 ∧ |2 * arctan (3 / 5) * 180 / π - 61.93| < 0.005 ∧
    |180 - 2 * arctan (3 / 5) * 180 / π - 118.0725| < 0.00005 ∧
    |180 - 2 * arctan (3 / 5) * 180 / π - 118.07| < 0.005 := by
  obtain ⟨s1, s2⟩ := sin_meja 30.963751 0.514495672003 0.514495673326 (by norm_num) (by norm_num)
    (by norm_num) (by norm_num)
  obtain ⟨c1, c2⟩ := cos_meja 30.963751 0.857492975310 0.857492976634 (by norm_num) (by norm_num)
    (by norm_num) (by norm_num)
  obtain ⟨s3, s4⟩ := sin_meja 30.963762 0.514495836629 0.514495837953 (by norm_num) (by norm_num)
    (by norm_num) (by norm_num)
  obtain ⟨c3, c4⟩ := cos_meja 30.963762 0.857492876534 0.857492877858 (by norm_num) (by norm_num)
    (by norm_num) (by norm_num)
  obtain ⟨l, u⟩ := arctan_stopinj (3 / 5) 30.963751 30.963762 (by norm_num) (by norm_num) (by norm_num)
    (by linarith) (by linarith)
  have e : 2 * arctan (3 / 5) * 180 / π = 2 * (arctan (3 / 5) * 180 / π) := by ring
  rw [e]
  refine ⟨?_, ?_, ?_, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Naloga 2 c) (in blok RACUN): sin(2·tan⁻¹(3/5)) = 15/17, zato v = √34·sin ∠DAB = √34·15/17 = 30/√34 ≈ 5,14496 ≈
5,14 cm; preizkus s ploščino 10·6/2 = 30 = |AB|·v; z zaokroženim kotom 61,93° je √34·sin 61,93° ≈ 5,15.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#naloga2-c
besedilo: »c) Preverimo s ploščino: ploščina romba je $\dfrac{e \cdot f}{2} = \dfrac{10 \cdot 6}{2} = 30\,\text{cm}^2$, hkrati pa $|AB| \cdot v$, zato $v = \dfrac{30}{\sqrt{34}}\,\text{cm} \approx 5{,}14\,\text{cm}$. ✓« -/
theorem naloga2_c :
    sin (2 * arctan (3 / 5)) = 15 / 17 ∧ √34 * sin (2 * arctan (3 / 5)) = 30 / √34 ∧
    |30 / √(34:ℝ) - 5.14496| < 0.000005 ∧ |30 / √(34:ℝ) - 5.14| < 0.005 ∧ (10:ℝ) * 6 / 2 = 30 ∧
    √34 * (30 / √34) = (30:ℝ) ∧ |√34 * sin (61.93 * π / 180) - 5.15| < 0.005 := by
  have l : (5.830951 : ℝ) < √34 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u : √(34:ℝ) < 5.830952 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  have h34 : √(34:ℝ) * √34 = 34 := Real.mul_self_sqrt (by norm_num)
  have hp : (0:ℝ) < √34 := by linarith
  have hne : √(34:ℝ) ≠ 0 := hp.ne'
  have hs : √(1 + (3 / 5 : ℝ) ^ 2) * √(1 + (3 / 5 : ℝ) ^ 2) = 1 + (3 / 5) ^ 2 := Real.mul_self_sqrt (by positivity)
  have hsp : 0 < √(1 + (3 / 5 : ℝ) ^ 2) := Real.sqrt_pos.mpr (by positivity)
  have s2 : sin (2 * arctan (3 / 5)) = 15 / 17 := by
    rw [sin_two_mul, sin_arctan, cos_arctan]
    calc 2 * ((3 / 5) / √(1 + (3 / 5 : ℝ) ^ 2)) * (1 / √(1 + (3 / 5 : ℝ) ^ 2))
        = 2 * (3 / 5) / (√(1 + (3 / 5 : ℝ) ^ 2) * √(1 + (3 / 5 : ℝ) ^ 2)) := by ring
      _ = 2 * (3 / 5) / (1 + (3 / 5) ^ 2) := by rw [hs]
      _ = 15 / 17 := by norm_num
  have v : √34 * sin (2 * arctan (3 / 5)) = 30 / √34 := by
    rw [s2, eq_div_iff hp.ne']
    calc √34 * (15 / 17) * √34 = (√34 * √34) * (15 / 17) := by ring
      _ = 34 * (15 / 17) := by rw [h34]
      _ = 30 := by norm_num
  obtain ⟨d1, d2⟩ := div_med 30 (√34) 5.144955 5.144965 hp (by nlinarith) (by nlinarith)
  obtain ⟨c1, c2⟩ := cos_meja 28.07 0.882373366291 0.882373366807 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  have k : sin (61.93 * π / 180) = cos (28.07 * π / 180) := by
    rw [show (61.93:ℝ) * π / 180 = π / 2 - 28.07 * π / 180 by ring, sin_pi_div_two_sub]
  have cp : 0 < cos (28.07 * π / 180) := by linarith
  refine ⟨s2, v, by rw [abs_lt]; constructor <;> linarith, by rw [abs_lt]; constructor <;> linarith, by norm_num,
    by field_simp, ?_⟩
  rw [k, abs_lt]
  constructor <;> nlinarith [mul_le_mul l.le c1 (by norm_num) hp.le, mul_le_mul u.le c2 cp.le (by norm_num)]

/-- Naloga 2 (geometrija romba na konkretnem rombu z diagonalama e = 10 in f = 6 v ℂ: A = −5, B = −3i, C = 5,
D = 3i, M = 0): vse stranice merijo √34, |AC| = 10, |BD| = 6, M je razpolovišče obeh diagonal; diagonali sta pravokotni
(∠AMB = 90°, iz |AB| = |AD| z `romb_pravi_kot`); |AM| = 5, |BM| = 3 in po `definicije` tan ∠MAB = |BM|/|AM|, zato
∠MAB = tan⁻¹(3/5); diagonala razpolavlja kot (tudi ∠MAD = tan⁻¹(3/5)), ∠DAB = 2·tan⁻¹(3/5); sosednja kota sta
suplementarna (∠ABC = 180° − ∠DAB); nožišče višine iz D je H = −45/17 − 24/17·i = A + 8/17·(B − A) na stranici AB
z ∠DHA = 90° in višina v = |DH| = |AD|·sin ∠DAB.
trditev: MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku#naloga2-romb
besedilo: »b) Diagonala $AC$ razpolavlja kot pri oglišču $A$. V trikotniku $AMB$ je $|BM|$ nasprotna, $|AM|$ pa priležna kateta kota $\angle MAB$, zato je $\tan \angle MAB = \dfrac{3}{5}$ in $\angle MAB \approx 30{,}9638^\circ$.« -/
theorem naloga2_romb :
    dist (-5:ℂ) (-3 * Complex.I) = √34 ∧ dist (-3 * Complex.I) (5:ℂ) = √34 ∧
    dist (5:ℂ) (3 * Complex.I) = √34 ∧ dist (3 * Complex.I) (-5:ℂ) = √34 ∧
    dist (-5:ℂ) 5 = 10 ∧ dist (-3 * Complex.I) (3 * Complex.I) = 6 ∧
    ((-5:ℂ) + 5) / 2 = 0 ∧ (-3 * Complex.I + 3 * Complex.I) / 2 = 0 ∧
    ∠ (-5:ℂ) 0 (-3 * Complex.I) = π / 2 ∧ dist (-5:ℂ) 0 = 5 ∧ dist (-3 * Complex.I) 0 = 3 ∧
    tan (∠ (0:ℂ) (-5) (-3 * Complex.I)) = dist (-3 * Complex.I) 0 / dist (-5:ℂ) 0 ∧
    ∠ (0:ℂ) (-5) (-3 * Complex.I) = arctan (3 / 5) ∧ ∠ (0:ℂ) (-5) (3 * Complex.I) = arctan (3 / 5) ∧
    ∠ (3 * Complex.I) (-5:ℂ) (-3 * Complex.I) = 2 * arctan (3 / 5) ∧
    ∠ (-5:ℂ) (-3 * Complex.I) 5 = π - ∠ (3 * Complex.I) (-5:ℂ) (-3 * Complex.I) ∧
    (-45 / 17 - 24 / 17 * Complex.I : ℂ) = -5 + (8 / 17 : ℂ) * (-3 * Complex.I - -5) ∧
    ∠ (3 * Complex.I) (-45 / 17 - 24 / 17 * Complex.I : ℂ) (-5) = π / 2 ∧
    dist (3 * Complex.I) (-45 / 17 - 24 / 17 * Complex.I : ℂ) =
      dist (-5:ℂ) (3 * Complex.I) * sin (∠ (3 * Complex.I) (-5:ℂ) (-3 * Complex.I)) := by
  have dAB : dist (-5:ℂ) (-3 * Complex.I) = √34 := by
    rw [razd _ _ (-5) 3 (by push_cast; ring)]; norm_num
  have dAD : dist (-5:ℂ) (3 * Complex.I) = √34 := by
    rw [razd _ _ (-5) (-3) (by push_cast; ring)]; norm_num
  have dAM : dist (-5:ℂ) 0 = 5 := by
    rw [razd _ _ (-5) 0 (by push_cast; ring)]; norm_num
  have dBM : dist (-3 * Complex.I) 0 = 3 := by
    rw [razd _ _ 0 (-3) (by push_cast; ring)]; norm_num
  have dDM : dist (3 * Complex.I) 0 = 3 := by
    rw [razd _ _ 0 3 (by push_cast; ring)]; norm_num
  have pAMB : ∠ (-5:ℂ) 0 (-3 * Complex.I) = π / 2 :=
    romb_pravi_kot (D := 3 * Complex.I) (by simp) (by rw [dAB, dAD])
  have pAMD : ∠ (-5:ℂ) 0 (3 * Complex.I) = π / 2 :=
    romb_pravi_kot (D := -3 * Complex.I) (by simp) (by rw [dAB, dAD])
  have kotA : ∀ X : ℂ, ∠ (-5:ℂ) 0 X = π / 2 → dist X 0 = 3 → X ≠ 0 →
      tan (∠ (0:ℂ) (-5) X) = dist X 0 / dist (-5:ℂ) 0 ∧ ∠ (0:ℂ) (-5) X = arctan (3 / 5) := by
    intro X hX dX hX0
    obtain ⟨-, -, t, -, -, -, -, s⟩ := definicije (A := (-5:ℂ)) (B := X) (C := 0)
      (by rw [angle_comm]; exact hX) (by norm_num) hX0
    have t' : tan (∠ (0:ℂ) (-5) X) = 3 / 5 := by rw [t, dX, dAM]
    refine ⟨t, ?_⟩
    have n1 := angle_nonneg (0:ℂ) (-5) X
    have n2 := angle_nonneg (0:ℂ) X (-5)
    have lt : ∠ (0:ℂ) (-5) X < π / 2 := by
      rcases lt_or_eq_of_le (show ∠ (0:ℂ) (-5) X ≤ π / 2 by linarith) with h | h
      · exact h
      · rw [h, tan_pi_div_two] at t'; norm_num at t'
    rw [← t', arctan_tan (by linarith) lt]
  obtain ⟨tB, aB⟩ := kotA _ pAMB dBM (by simp)
  obtain ⟨-, aD⟩ := kotA _ pAMD dDM (by simp)
  have h34 : √(34:ℝ) * √34 = 34 := Real.mul_self_sqrt (by norm_num)
  have hp : (0:ℝ) < √34 := by positivity
  have a0 := arctan_pos.mpr (show (0:ℝ) < 3 / 5 by norm_num)
  have a1 := arctan_lt_pi_div_two (3 / 5 : ℝ)
  have c2 : cos (2 * arctan (3 / 5)) = 8 / 17 := by
    rw [cos_two_mul, cos_sq_arctan]; norm_num
  have cDAB : cos (∠ (3 * Complex.I) (-5:ℂ) (-3 * Complex.I)) = 8 / 17 := by
    rw [kos _ _ _ 5 3 5 (-3) (by push_cast; ring) (by push_cast; ring)]
    norm_num
  have cABC : cos (∠ (-5:ℂ) (-3 * Complex.I) 5) = -(8 / 17) := by
    rw [kos _ _ _ (-5) 3 5 3 (by push_cast; ring) (by push_cast; ring)]
    norm_num
  have eDAB : ∠ (3 * Complex.I) (-5:ℂ) (-3 * Complex.I) = 2 * arctan (3 / 5) :=
    injOn_cos ⟨angle_nonneg _ _ _, angle_le_pi _ _ _⟩ ⟨by linarith, by linarith⟩ (by rw [cDAB, c2])
  have eABC : ∠ (-5:ℂ) (-3 * Complex.I) 5 = π - ∠ (3 * Complex.I) (-5:ℂ) (-3 * Complex.I) := by
    rw [eDAB]
    exact injOn_cos ⟨angle_nonneg _ _ _, angle_le_pi _ _ _⟩ ⟨by linarith, by linarith⟩
      (by rw [cABC, cos_pi_sub, c2])
  have sDAB : sin (2 * arctan (3 / 5)) = 15 / 17 := by
    rw [sin_two_mul, sin_arctan, cos_arctan]
    have hs : √(1 + (3 / 5 : ℝ) ^ 2) * √(1 + (3 / 5 : ℝ) ^ 2) = 1 + (3 / 5) ^ 2 := Real.mul_self_sqrt (by positivity)
    calc 2 * ((3 / 5) / √(1 + (3 / 5 : ℝ) ^ 2)) * (1 / √(1 + (3 / 5 : ℝ) ^ 2))
        = 2 * (3 / 5) / (√(1 + (3 / 5 : ℝ) ^ 2) * √(1 + (3 / 5 : ℝ) ^ 2)) := by ring
      _ = 2 * (3 / 5) / (1 + (3 / 5) ^ 2) := by rw [hs]
      _ = 15 / 17 := by norm_num
  have dDH : dist (3 * Complex.I) (-45 / 17 - 24 / 17 * Complex.I : ℂ) = 30 / √34 := by
    rw [razd _ _ (45 / 17) (75 / 17) (by push_cast; ring), eq_div_iff hp.ne', ← Real.sqrt_mul (by positivity),
      show ((45 / 17 : ℝ) ^ 2 + (75 / 17) ^ 2) * 34 = 30 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨dAB, by rw [razd _ _ (-5) (-3) (by push_cast; ring)]; norm_num,
    by rw [razd _ _ 5 (-3) (by push_cast; ring)]; norm_num, by rw [dist_comm, dAD],
    by rw [razd _ _ (-10) 0 (by push_cast; ring)]; norm_num [show (100:ℝ) = 10 ^ 2 by norm_num],
    by rw [razd _ _ 0 (-6) (by push_cast; ring)]; norm_num [show (36:ℝ) = 6 ^ 2 by norm_num],
    by ring, by ring, pAMB, dAM, dBM, tB, aB, aD, eDAB, eABC, by ring, ?_, ?_⟩
  · exact pravi _ _ _ (45 / 17) (75 / 17) (-40 / 17) (24 / 17) (by push_cast; ring) (by push_cast; ring)
      (by norm_num)
  · rw [dDH, dAD, eDAB, sDAB, div_eq_iff hp.ne']
    linear_combination (-15 / 17 : ℝ) * h34

/-! ## Primeri izpolnljivosti (izrek, uporabljen na konkretnih vrednostih) -/

/-- Predpostavke trditve `le_od_kota` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∠ Complex.I (0:ℂ) 1 = π / 2 ∧ Complex.I ≠ 0 := by
    refine ⟨?_, Complex.I_ne_zero⟩
    rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [Complex.inner]
  le_od_kota (h := w.1) (h' := w.1) (hB := w.2) (hB' := w.2) (hα := rfl)

end Evklid.Lekcije.MAT_SS_2.KotneFunkcijeVPravokotnemTrikotniku
