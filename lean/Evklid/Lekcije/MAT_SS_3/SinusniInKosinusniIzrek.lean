/-
vir: content/lessons/MAT-SS-3/sinusni-in-kosinusni-izrek.md
sha256: cefc8db21dd82069999b966fa9cd425d8109115c56fd98a94fd8aded378320d1
Ni v Leanu: simulacija »Sinusni in kosinusni izrek«, slike in analogije (menjalni tečaj, Hawk-Eye, reka,
jadranje; dokazana je le monotonost c v γ, `sestilo`), seznam »Kateri izrek izbrati« in Postopek (navodila
metode), Preveri se 1 (izbira izreka glede na podatke; ni matematična trditev), točkovanje. Trikotnik je v
splošnih izrekih zapisan s točkami evklidskega prostora (`∠`, `dist`, Mathlibov `law_cos`, `law_sin`,
očrtana krožnica `Affine.Triangle.circumradius`); v številskih primerih so koti zapisani v radianih kot
θ·π/180, »≈« pa kot ocena |x − približek| < pol enote zadnjega mesta. Numerične vrednosti sin/cos so
dokazane s Taylorjevim polinomom stopnje 9 z ostankom (`Complex.exp_bound`, n = 10) in mejo
|π − 3,1415926536| ≤ 10⁻¹⁰ (`pi_gt_d20`, `pi_lt_d20`); arcsin/arccos z monotonostjo. Pri Primeru 3 je
dokazan pravilni trikotnik računa lekcije (λ ≈ 94,88° ≈ 94,9°), ne pa geometrijski obstoj trikotnika. Prav tako
ni dokazan geometrijski obstoj oz. število trikotnikov pri dveh kandidatih iz sinusa (Razlaga »trikotnik lahko
obstaja z obema kotoma, le z enim ali z nobenim«, Ustno vprašanje 3, Preveri se 4); dokazano je le, da sta
kandidata dva (`dve_resitvi_sinus`) in da sta vsoti z danim kotom pod 180° (`kviz4`): zahtevno, še ni dokazano.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.SinusniInKosinusniIzrek

open Real EuclideanGeometry

/-! ## Pomožne numerične ocene -/

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
`q = θ·3,1415926536/180` (`pi_blizu` in Lipschitzova ocena `|sin x − sin q| ≤ |x − q|`).
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

/-- Pomožna trditev: `cos θ° = sin (90 − θ)°`.
pomozno -/
theorem cos_v_sin (θ : ℝ) : Real.cos (θ * π / 180) = Real.sin ((90 - θ) * π / 180) := by
  rw [← Real.sin_pi_div_two_sub]; congr 1; ring

/-- Pomožna trditev: `sin θ° = cos (90 − θ)°`.
pomozno -/
theorem sin_v_cos (θ : ℝ) : Real.sin (θ * π / 180) = Real.cos ((90 - θ) * π / 180) := by
  rw [← Real.cos_pi_div_two_sub]; congr 1; ring

/-- Pomožna trditev: če je `lo² < y < hi²` (`0 ≤ lo`, `0 < hi`), je `lo < √y < hi`.
pomozno -/
theorem sqrt_med (y lo hi : ℝ) (hlo : 0 ≤ lo) (hhi : 0 < hi) (h1 : lo ^ 2 < y) (h2 : y < hi ^ 2) :
    lo < Real.sqrt y ∧ Real.sqrt y < hi :=
  ⟨(Real.lt_sqrt hlo).mpr h1, (Real.sqrt_lt' hhi).mpr h2⟩

/-- Predpostavke trditve `sqrt_med` se dajo izpolniti (`y = 4`, `lo = 1`, `hi = 3`). -/
example : (0:ℝ) ≤ 1 ∧ (0:ℝ) < 3 ∧ (1:ℝ) ^ 2 < 4 ∧ (4:ℝ) < 3 ^ 2 := by norm_num

/-- Pomožna trditev: če je `cos b < v < cos a` za `0 ≤ a < b ≤ π`, je `a < arccos v < b`.
pomozno -/
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

/-- Pomožna trditev: če je `sin a < v < sin b` za `−π/2 ≤ a < b ≤ π/2`, je `a < arcsin v < b`.
pomozno -/
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

/-! ## Splošna pravila (trikotnik v evklidskem prostoru) -/

section Trikotnik

variable {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
  [NormedAddTorsor V P]

/-- Razlaga in Povzetek, kosinusni izrek: za `a = |BC|`, `b = |CA|`, `c = |AB|` in kot `γ = ∠ACB` velja
`c² = a² + b² − 2ab cos γ`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#kosinusni-izrek
besedilo: »Izrek velja za vsako stranico; črke le zamenjaš: $a^2 = b^2 + c^2 - 2bc\cos\alpha$. Če poznaš vse tri stranice, ga preoblikuješ za kot: $\cos\gamma = \dfrac{a^2 + b^2 - c^2}{2ab}$.« -/
theorem kosinusni_izrek (A B C : P) :
    dist A B ^ 2 = dist B C ^ 2 + dist C A ^ 2 - 2 * dist B C * dist C A * Real.cos (∠ A C B) := by
  have h := EuclideanGeometry.law_cos A C B
  rw [dist_comm C A, dist_comm B C] at *
  nlinarith [h]

/-- Razlaga, sinusni izrek (enakost razmerij): `a sin β = b sin α`, torej `a / sin α = b / sin β`, kadar sinusa
nista 0 (`a = |BC|` nasproti `α = ∠CAB`, `b = |CA|` nasproti `β = ∠ABC`).
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#sinusni-izrek
besedilo: »$$\frac{a}{\sin\alpha} = \frac{b}{\sin\beta} = \frac{c}{\sin\gamma} = 2R$$« -/
theorem sinusni_izrek (A B C : P) (hα : Real.sin (∠ C A B) ≠ 0) (hβ : Real.sin (∠ A B C) ≠ 0) :
    dist B C / Real.sin (∠ C A B) = dist C A / Real.sin (∠ A B C) := by
  have h := EuclideanGeometry.law_sin A B C
  rw [div_eq_div_iff hα hβ]
  linarith

/-- Razlaga in Povzetek, sinusni izrek z očrtano krožnico: v trikotniku je stranica, deljena s sinusom
nasprotnega kota, enaka `2R` (`R` je polmer očrtane krožnice).
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#sinusni-izrek-2r
besedilo: »Sinusni izrek pravi, da v vsakem trikotniku velja $\frac{a}{\sin\alpha} = \frac{b}{\sin\beta} = \frac{c}{\sin\gamma} = 2R$, kjer je $R$ polmer očrtane krožnice.« -/
theorem sinusni_izrek_2R (t : Affine.Triangle ℝ P) {i₁ i₂ i₃ : Fin 3} (h₁₂ : i₁ ≠ i₂) (h₁₃ : i₁ ≠ i₃)
    (h₂₃ : i₂ ≠ i₃) :
    dist (t.points i₁) (t.points i₃) / Real.sin (∠ (t.points i₁) (t.points i₂) (t.points i₃)) =
      2 * t.circumradius :=
  t.dist_div_sin_angle_eq_two_mul_circumradius h₁₂ h₁₃ h₂₃

/-- Predpostavke trditve `sinusni_izrek_2R` se dajo izpolniti (indeksi 0, 1, 2 so različni). -/
example : (0 : Fin 3) ≠ 1 ∧ (0 : Fin 3) ≠ 2 ∧ (1 : Fin 3) ≠ 2 := by decide

/-- Predpostavke trditve `sinusni_izrek_2R` se dajo izpolniti: izrek, uporabljen na primeru. -/
example (t : Affine.Triangle ℝ (EuclideanSpace ℝ (Fin 2))) :=
  have w : (0 : Fin 3) ≠ 1 ∧ (0 : Fin 3) ≠ 2 ∧ (1 : Fin 3) ≠ 2 := by decide
  sinusni_izrek_2R t (h₁₂ := w.1) (h₁₃ := w.2.1) (h₂₃ := w.2.2)

/-- Postopek in Primer 2: vsota notranjih kotov trikotnika je `180° = π` (tretji kot iz `180°`).
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#vsota-kotov
besedilo: »Tretji kot izračunaj iz vsote kotov $180^\circ$.« -/
theorem vsota_kotov (A B C : P) (h : B ≠ A) : ∠ A B C + ∠ B C A + ∠ C A B = π :=
  EuclideanGeometry.angle_add_angle_add_angle_eq_pi C h

/-- Razlaga in Povzetek: večjemu kotu leži nasproti daljša stranica (v nedegeneriranem trikotniku): `∠ACB <
∠ABC` natanko tedaj, ko `|AB| < |AC|`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#vecji-kot-daljsa-stranica
besedilo: »Zato večjemu kotu leži nasproti daljša stranica.« -/
theorem vecji_kot_daljsa_stranica (A B C : P) (h : ¬Collinear ℝ ({A, B, C} : Set P)) :
    ∠ A C B < ∠ A B C ↔ dist A B < dist A C :=
  EuclideanGeometry.angle_lt_iff_dist_lt h

/-- Razlaga (varna bližnjica), Povzetek in Ustno vprašanje 3: kot nasproti stranice, ki ni najdaljša (obstaja
daljša), je oster; zato je top kot lahko le nasproti najdaljše stranice.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#kot-nasproti-krajse-oster
besedilo: »Varna bližnjica: top kot leži lahko le nasproti najdaljše stranice. Kot nasproti krajše stranice je zagotovo oster, zato ga s sinusom izračunaš brez skrbi.« -/
theorem kot_nasproti_krajse_oster (A B C : P) (h : ¬Collinear ℝ ({A, B, C} : Set P))
    (hd : dist A B < dist A C) : ∠ A C B < π / 2 := by
  have h1 := (vecji_kot_daljsa_stranica A B C h).mpr hd
  have hBA : B ≠ A := by
    rintro rfl; apply h; simp [collinear_pair]
  have hs := vsota_kotov A B C hBA
  have h3 : 0 ≤ ∠ C A B := EuclideanGeometry.angle_nonneg _ _ _
  rw [EuclideanGeometry.angle_comm B C A] at hs
  linarith

/-- Razlaga (višina): v pravokotnem trikotniku s pravim kotom pri `H` je kateta `|CH|` nasproti kota pri `A`
enaka `|AC| sin ∠CAH` (`v_c = b sin α`).
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#visina
besedilo: »Višina $v_c$ iz oglišča $C$ razdeli trikotnik na dva pravokotna trikotnika, zato je $v_c = b\sin\alpha$ in $v_c = a\sin\beta$.« -/
theorem visina (A H C : P) (h : ∠ C H A = π / 2) : Real.sin (∠ H A C) * dist C A = dist C H :=
  EuclideanGeometry.sin_angle_mul_dist_of_angle_eq_pi_div_two h

end Trikotnik

/-! ### Konkreten trikotnik (predpostavke splošnih trditev se dajo izpolniti) -/

/-- Oglišče `A = (0, 0)` konkretnega trikotnika v ravnini. -/
noncomputable def tA : EuclideanSpace ℝ (Fin 2) := !₂[0, 0]
/-- Oglišče `B = (1, 0)` konkretnega trikotnika v ravnini. -/
noncomputable def tB : EuclideanSpace ℝ (Fin 2) := !₂[1, 0]
/-- Oglišče `C = (0, 2)` konkretnega trikotnika v ravnini. -/
noncomputable def tC : EuclideanSpace ℝ (Fin 2) := !₂[0, 2]

/-- Pomožna trditev: kot pri `A` v trikotniku `A = (0, 0)`, `B = (1, 0)`, `C = (0, 2)` je pravi.
pomozno -/
theorem t_pravi : ∠ tB tA tC = π / 2 := by
  rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
  simp [tA, tB, tC, EuclideanSpace.inner_eq_star_dotProduct, Fin.sum_univ_two, dotProduct]

/-- Pomožna trditev: točke `A = (0, 0)`, `B = (1, 0)`, `C = (0, 2)` niso kolinearne (trikotnik ni izrojen).
pomozno -/
theorem t_nekolinearen : ¬Collinear ℝ ({tA, tB, tC} : Set (EuclideanSpace ℝ (Fin 2))) := by
  rw [Set.insert_comm, collinear_iff_eq_or_eq_or_angle_eq_zero_or_angle_eq_pi, t_pravi]
  have hBA : tB ≠ tA := by
    intro h; have := congrArg (fun v : EuclideanSpace ℝ (Fin 2) => v 0) h; simp [tA, tB] at this
  have hCA : tC ≠ tA := by
    intro h; have := congrArg (fun v : EuclideanSpace ℝ (Fin 2) => v 1) h; simp [tA, tC] at this
  rintro (h | h | h | h)
  · exact hBA h
  · exact hCA h
  · linarith [Real.pi_pos]
  · linarith [Real.pi_pos]

/-- Predpostavke trditev `sinusni_izrek`, `vsota_kotov`, `vecji_kot_daljsa_stranica`,
`kot_nasproti_krajse_oster` in `visina` se dajo izpolniti s trikotnikom `A = (0, 0)`, `B = (1, 0)`,
`C = (0, 2)` (`|AB| = 1 < 2 = |AC|`, pravi kot pri `A`). -/
example : Real.sin (∠ tC tA tB) ≠ 0 ∧ Real.sin (∠ tA tB tC) ≠ 0 ∧ tB ≠ tA ∧
    ¬Collinear ℝ ({tA, tB, tC} : Set (EuclideanSpace ℝ (Fin 2))) ∧ dist tA tB < dist tA tC ∧
    ∠ tC tA tB = π / 2 := by
  have h := t_nekolinearen
  have hp : ∠ tC tA tB = π / 2 := by rw [EuclideanGeometry.angle_comm]; exact t_pravi
  refine ⟨?_, sin_ne_zero_of_not_collinear h, ?_, h, ?_, hp⟩
  · rw [hp, Real.sin_pi_div_two]; exact one_ne_zero
  · intro hBA; apply h; rw [hBA]; simp [collinear_pair]
  · simp [EuclideanSpace.dist_eq, tA, tB, tC, Fin.sum_univ_two]

/-- Predpostavke trditve `vsota_kotov` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Real.sin (∠ tC tA tB) ≠ 0 ∧ Real.sin (∠ tA tB tC) ≠ 0 ∧ tB ≠ tA ∧ ¬Collinear ℝ ({tA, tB, tC} : Set (EuclideanSpace ℝ (Fin 2))) ∧ dist tA tB < dist tA tC ∧ ∠ tC tA tB = π / 2 := by
    have h := t_nekolinearen
    have hp : ∠ tC tA tB = π / 2 := by rw [EuclideanGeometry.angle_comm]; exact t_pravi
    refine ⟨?_, sin_ne_zero_of_not_collinear h, ?_, h, ?_, hp⟩
    · rw [hp, Real.sin_pi_div_two]; exact one_ne_zero
    · intro hBA; apply h; rw [hBA]; simp [collinear_pair]
    · simp [EuclideanSpace.dist_eq, tA, tB, tC, Fin.sum_univ_two]
  vsota_kotov (h := w.1)

/-- Razlaga (višina): iz `b sin α = a sin β` po deljenju s `sin α sin β` sledi `a / sin α = b / sin β`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#visina-sklep
besedilo: »Ko obe strani deliš s $\sin\alpha\sin\beta$, dobiš $\dfrac{a}{\sin\alpha} = \dfrac{b}{\sin\beta}$.« -/
theorem visina_sklep (a b sα sβ : ℝ) (hα : sα ≠ 0) (hβ : sβ ≠ 0) (h : b * sα = a * sβ) :
    a / sα = b / sβ := by
  rw [div_eq_div_iff hα hβ]; linarith

/-- Predpostavke trditve `visina_sklep` se dajo izpolniti (`a = b = 1`, `sα = sβ = 1`). -/
example : (1:ℝ) ≠ 0 ∧ (1:ℝ) * 1 = 1 * 1 := by norm_num

/-- Predpostavke trditve `visina_sklep` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 ∧ (1:ℝ) * 1 = 1 * 1 := by norm_num
  visina_sklep (hα := w.1) (hβ := w.1) (h := w.2)

/-- Razlaga, Ponovitev in Pogoste napake: `sin(180° − x) = sin x`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#sin-suplement
besedilo: »$\sin x = \sin(180^\circ - x)$« -/
theorem sin_suplement (x : ℝ) : Real.sin (π - x) = Real.sin x := Real.sin_pi_sub x

/-- Razlaga (past pri sinusu), Pogoste napake in Ustno vprašanje 3: za `x₀ ∈ [0°, 90°]` ima `sin x = sin x₀` na
`[0°, 180°]` natanko rešitvi `x₀` in `180° − x₀`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#dve-resitvi-sinus
besedilo: »Med $0^\circ$ in $180^\circ$ imata enak sinus kota $x$ in $180^\circ - x$,« -/
theorem dve_resitvi_sinus (x₀ x : ℝ) (h0 : 0 ≤ x₀) (h1 : x₀ ≤ π / 2) (hx0 : 0 ≤ x) (hx1 : x ≤ π) :
    Real.sin x = Real.sin x₀ ↔ x = x₀ ∨ x = π - x₀ := by
  have hm : x₀ ∈ Set.Icc (-(π / 2)) (π / 2) := ⟨by linarith [Real.pi_pos], h1⟩
  constructor
  · intro h
    by_cases hx : x ≤ π / 2
    · exact Or.inl (Real.injOn_sin ⟨by linarith [Real.pi_pos], hx⟩ hm h)
    · right
      have : π - x = x₀ :=
        Real.injOn_sin ⟨by linarith, by linarith [Real.pi_pos]⟩ hm (by rw [Real.sin_pi_sub, h])
      linarith
  · rintro (rfl | rfl)
    · rfl
    · exact Real.sin_pi_sub x₀

/-- Predpostavke trditve `dve_resitvi_sinus` se dajo izpolniti (`x₀ = 0`, `x = 0`). -/
example : (0:ℝ) ≤ 0 ∧ (0:ℝ) ≤ π / 2 ∧ (0:ℝ) ≤ π := ⟨le_rfl, by positivity, Real.pi_pos.le⟩

/-- Predpostavke trditve `dve_resitvi_sinus` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 0 ∧ (0:ℝ) ≤ π / 2 ∧ (0:ℝ) ≤ π := ⟨le_rfl, by positivity, Real.pi_pos.le⟩
  dve_resitvi_sinus 0 0 w.1 w.2.1 w.1 w.2.2

/-- Razlaga (premisli) in Povzetek: med 0° in 180° ima vsak kot drugačen kosinus, zato da kosinus en sam kot.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#kosinus-en-kot
besedilo: »Med $0^\circ$ in $180^\circ$ ima vsak kot drugačen kosinus.« -/
theorem kosinus_en_kot (x y : ℝ) (hx : x ∈ Set.Icc 0 π) (hy : y ∈ Set.Icc 0 π) (h : Real.cos x = Real.cos y) :
    x = y := Real.injOn_cos hx hy h

/-- Predpostavke trditve `kosinus_en_kot` se dajo izpolniti (`x = y = 0`). -/
example : (0:ℝ) ∈ Set.Icc 0 π := ⟨le_rfl, Real.pi_pos.le⟩

/-- Razlaga (tabela), Povzetek in Ustno vprašanje 2: pri `c² = a² + b² − 2ab cos γ`, `a, b > 0`, je
`c² < a² + b²` natanko pri `cos γ > 0`, `c² = a² + b²` (Pitagora) natanko pri `cos γ = 0`, `c² > a² + b²`
natanko pri `cos γ < 0`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#primerjava
besedilo: »$$c^2 = a^2 + b^2 - 2ab\cos\gamma$$« -/
theorem primerjava (a b c cγ : ℝ) (ha : 0 < a) (hb : 0 < b) (h : c ^ 2 = a ^ 2 + b ^ 2 - 2 * a * b * cγ) :
    (c ^ 2 < a ^ 2 + b ^ 2 ↔ 0 < cγ) ∧ (c ^ 2 = a ^ 2 + b ^ 2 ↔ cγ = 0) ∧
    (a ^ 2 + b ^ 2 < c ^ 2 ↔ cγ < 0) := by
  have hab : 0 < 2 * a * b := by positivity
  refine ⟨⟨fun h1 => ?_, fun h1 => ?_⟩, ⟨fun h1 => ?_, fun h1 => ?_⟩, ⟨fun h1 => ?_, fun h1 => ?_⟩⟩
  · by_contra hc; push Not at hc; nlinarith
  · nlinarith
  · have : 2 * a * b * cγ = 0 := by linarith
    rcases mul_eq_zero.mp this with h2 | h2
    · linarith
    · exact h2
  · rw [h, h1]; ring
  · by_contra hc; push Not at hc; nlinarith
  · nlinarith

/-- Predpostavke trditve `primerjava` se dajo izpolniti (`a = 3`, `b = 4`, `c = 5`, `cos γ = 0`). -/
example : (0:ℝ) < 3 ∧ (0:ℝ) < 4 ∧ (5:ℝ) ^ 2 = 3 ^ 2 + 4 ^ 2 - 2 * 3 * 4 * 0 := by norm_num

/-- Predpostavke trditve `primerjava` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 3 ∧ (0:ℝ) < 4 ∧ (5:ℝ) ^ 2 = 3 ^ 2 + 4 ^ 2 - 2 * 3 * 4 * 0 := by norm_num
  primerjava (ha := w.1) (hb := w.2.1) (h := w.2.2)

/-- Razlaga, tabela: za kot `γ ∈ [0°, 180°]` je `cos γ > 0` natanko pri ostrem, `= 0` pri pravem, `< 0` pri
topem kotu.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#kosinus-vrsta-kota
besedilo: »Med $0^\circ$ in $180^\circ$ ima vsak kot drugačen kosinus. Topi koti imajo negativen kosinus, ostri pozitiven. Iz $\cos\gamma$ zato dobiš natanko en kot.« -/
theorem kosinus_vrsta_kota (γ : ℝ) (h0 : 0 ≤ γ) (h1 : γ ≤ π) :
    (0 < Real.cos γ ↔ γ < π / 2) ∧ (Real.cos γ = 0 ↔ γ = π / 2) ∧ (Real.cos γ < 0 ↔ π / 2 < γ) := by
  have key : ∀ t, 0 ≤ t → t ≤ π → (0 < Real.cos t ↔ t < π / 2) := fun t ht0 ht1 => by
    constructor
    · intro hc; by_contra h; push Not at h
      exact absurd hc (not_lt.mpr (Real.cos_nonpos_of_pi_div_two_le_of_le h (by linarith)))
    · intro h; exact Real.cos_pos_of_mem_Ioo ⟨by linarith, h⟩
  have key2 : (Real.cos γ < 0 ↔ π / 2 < γ) := by
    constructor
    · intro hc; by_contra h; push Not at h
      rcases h.lt_or_eq with h | h
      · linarith [(key γ h0 h1).mpr h]
      · rw [h, Real.cos_pi_div_two] at hc; exact lt_irrefl _ hc
    · intro h; exact Real.cos_neg_of_pi_div_two_lt_of_lt h (by linarith)
  refine ⟨key γ h0 h1, ⟨fun hc => ?_, fun h => by rw [h, Real.cos_pi_div_two]⟩, key2⟩
  by_contra hne
  rcases lt_or_gt_of_ne hne with h | h
  · linarith [(key γ h0 h1).mpr h]
  · linarith [key2.mpr h]

/-- Predpostavke trditve `kosinus_vrsta_kota` se dajo izpolniti (`γ = 0`). -/
example : (0:ℝ) ≤ 0 ∧ (0:ℝ) ≤ π := ⟨le_rfl, Real.pi_pos.le⟩

/-- Predpostavke trditve `kosinus_vrsta_kota` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 0 ∧ (0:ℝ) ≤ π := ⟨le_rfl, Real.pi_pos.le⟩
  kosinus_vrsta_kota (h0 := w.1) (h1 := w.2)

/-- Razlaga in Ponovitev: iz `c² = a² + b² − 2ab cos γ` (`a, b ≠ 0`) sledi `cos γ = (a² + b² − c²)/(2ab)`;
z zamenjavo črk velja tudi `a² = b² + c² − 2bc cos α`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#kosinus-iz-stranic
besedilo: »Izrek velja za vsako stranico; črke le zamenjaš: $a^2 = b^2 + c^2 - 2bc\cos\alpha$. Če poznaš vse tri stranice, ga preoblikuješ za kot: $\cos\gamma = \dfrac{a^2 + b^2 - c^2}{2ab}$.« -/
theorem kosinus_iz_stranic (a b c cγ : ℝ) (ha : a ≠ 0) (hb : b ≠ 0)
    (h : c ^ 2 = a ^ 2 + b ^ 2 - 2 * a * b * cγ) : cγ = (a ^ 2 + b ^ 2 - c ^ 2) / (2 * a * b) := by
  rw [eq_div_iff (by positivity)]; linarith

/-- Predpostavke trditve `kosinus_iz_stranic` se dajo izpolniti (`a = 3`, `b = 4`, `c = 5`, `cos γ = 0`). -/
example : (3:ℝ) ≠ 0 ∧ (4:ℝ) ≠ 0 ∧ (5:ℝ) ^ 2 = 3 ^ 2 + 4 ^ 2 - 2 * 3 * 4 * 0 := by norm_num

/-- Predpostavke trditve `kosinus_iz_stranic` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (3:ℝ) ≠ 0 ∧ (4:ℝ) ≠ 0 ∧ (5:ℝ) ^ 2 = 3 ^ 2 + 4 ^ 2 - 2 * 3 * 4 * 0 := by norm_num
  kosinus_iz_stranic (ha := w.1) (hb := w.2.1) (h := w.2.2)

/-- Razlaga in Povzetek: pri `γ = 90°` kosinusni izrek preide v Pitagorov izrek.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#pitagora
besedilo: »Pri $\gamma = 90^\circ$ preide v Pitagorov izrek.« -/
theorem pitagora (a b : ℝ) : a ^ 2 + b ^ 2 - 2 * a * b * Real.cos (π / 2) = a ^ 2 + b ^ 2 := by
  rw [Real.cos_pi_div_two]; ring

/-- Razlaga (sinusni izrek): ker je `α + β < 180°`, ima večji kot večji sinus (`0 < α < β`).
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#vecji-kot-vecji-sinus
besedilo: »Ker sta dva kota trikotnika skupaj manj kot $180^\circ$, ima večji kot tudi večji sinus.« -/
theorem vecji_kot_vecji_sinus (α β : ℝ) (h0 : 0 < α) (hαβ : α < β) (hs : α + β < π) :
    Real.sin α < Real.sin β := by
  by_cases hb : β ≤ π / 2
  · exact Real.sin_lt_sin_of_lt_of_le_pi_div_two (by linarith) hb hαβ
  · rw [← Real.sin_pi_sub β]
    exact Real.sin_lt_sin_of_lt_of_le_pi_div_two (by linarith) (by linarith) (by linarith)

/-- Predpostavke trditve `vecji_kot_vecji_sinus` se dajo izpolniti (`α = π/6`, `β = π/3`). -/
example : (0:ℝ) < π / 6 ∧ π / 6 < π / 3 ∧ π / 6 + π / 3 < π := by
  refine ⟨by positivity, by linarith [Real.pi_pos], by linarith [Real.pi_pos]⟩

/-- Predpostavke trditve `vecji_kot_vecji_sinus` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < π / 6 ∧ π / 6 < π / 3 ∧ π / 6 + π / 3 < π := by
    refine ⟨by positivity, by linarith [Real.pi_pos], by linarith [Real.pi_pos]⟩
  vecji_kot_vecji_sinus (h0 := w.1) (hαβ := w.2.1) (hs := w.2.2)

/-- Razlaga (šestilo) in Z analogijo: pri stalnih `a, b > 0` je `c² = a² + b² − 2ab cos γ` strogo naraščajoč v
`γ ∈ [0°, 180°]`: bolj odprto šestilo, bolj oddaljeni konici.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#sestilo
besedilo: »Predstavljaj si šestilo s krakoma dolžin $a$ in $b$. Kot $\gamma$ je odprtost šestila, $c$ je razdalja med konicama. Pri pravem kotu je $c^2 = a^2 + b^2$, kar je Pitagorov izrek. Člen $-2ab\cos\gamma$ je popravek, ko kot ni pravi.« -/
theorem sestilo (a b γ₁ γ₂ : ℝ) (ha : 0 < a) (hb : 0 < b) (h0 : 0 ≤ γ₁) (h12 : γ₁ < γ₂) (h2 : γ₂ ≤ π) :
    a ^ 2 + b ^ 2 - 2 * a * b * Real.cos γ₁ < a ^ 2 + b ^ 2 - 2 * a * b * Real.cos γ₂ := by
  have := Real.cos_lt_cos_of_nonneg_of_le_pi h0 h2 h12
  nlinarith [mul_pos ha hb]

/-- Predpostavke trditve `sestilo` se dajo izpolniti (`a = b = 1`, `γ₁ = 0`, `γ₂ = π`). -/
example : (0:ℝ) < 1 ∧ (0:ℝ) < π := ⟨one_pos, Real.pi_pos⟩

/-! ## Znane vrednosti -/

/-- `cos 120° = −0,5` in `cos 60° = 0,5` (Razlaga, premisli; Preveri se 2).
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#cos-120-60
besedilo: »$\cos 60^\circ = 0{,}5$, $\cos 120^\circ = -0{,}5$.« -/
theorem cos_120_60 : Real.cos (120 * π / 180) = -0.5 ∧ Real.cos (60 * π / 180) = 0.5 := by
  constructor
  · rw [show 120 * π / 180 = π - π / 3 by ring, Real.cos_pi_sub, Real.cos_pi_div_three]; norm_num
  · rw [show 60 * π / 180 = π / 3 by ring, Real.cos_pi_div_three]; norm_num

/-- Razlaga, premisli: pri `a = 3`, `b = 4` je pri `γ = 90°` `c = 5`, pri `γ = 120°` pa popravek
`−2·3·4·(−0,5) = 12`, `c² = 25 + 12 = 37`, `c ≈ 6,1 > 5`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#premisli-120
besedilo: »Daljša. Ker je $\cos 120^\circ = -0{,}5$, je popravek $-2 \cdot 3 \cdot 4 \cdot (-0{,}5) = +12$. Zato je $c^2 = 25 + 12 = 37$ in $c \approx 6{,}1$. Bolj odprto šestilo, bolj oddaljeni konici.« -/
theorem premisli_120 :
    (3:ℝ) ^ 2 + 4 ^ 2 - 2 * 3 * 4 * Real.cos (π / 2) = 5 ^ 2 ∧
    -2 * 3 * 4 * Real.cos (120 * π / 180) = 12 ∧ (25:ℝ) + 12 = 37 ∧
    |Real.sqrt 37 - 6.1| < 0.05 ∧ 5 < Real.sqrt 37 := by
  obtain ⟨h1, h2⟩ := sqrt_med 37 6.08 6.09 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  refine ⟨by rw [Real.cos_pi_div_two]; norm_num, by rw [cos_120_60.1]; norm_num, by norm_num, ?_, by linarith⟩
  rw [abs_lt]; constructor <;> linarith

/-- Razlaga (past pri sinusu): `sin x = 0,9` ima na `[0°, 180°]` natanko rešitvi `arcsin 0,9 ≈ 64,2°` in
`180° − arcsin 0,9 ≈ 115,8°`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#sinus-09
besedilo: »Iz lekcije o trigonometrijskih enačbah veš, da ima $\sin x = 0{,}9$ med $0^\circ$ in $180^\circ$ dve rešitvi: $x \approx 64{,}2^\circ$ in $x \approx 115{,}8^\circ$.« -/
theorem sinus_09 :
    (∀ x, 0 ≤ x → x ≤ π → (Real.sin x = 0.9 ↔ x = Real.arcsin 0.9 ∨ x = π - Real.arcsin 0.9)) ∧
    |Real.arcsin 0.9 * 180 / π - 64.2| < 0.05 ∧ |(π - Real.arcsin 0.9) * 180 / π - 115.8| < 0.05 := by
  have hs : Real.sin (Real.arcsin 0.9) = 0.9 := Real.sin_arcsin (by norm_num) (by norm_num)
  have hb := arcsin_med 0.9 (64.15 * π / 180) (64.25 * π / 180) (by nlinarith [Real.pi_pos])
    (by nlinarith [Real.pi_pos]) (by nlinarith [Real.pi_pos])
    (by
      have h := cos_stopinj 25.85 _ rfl (by norm_num) (by norm_num)
      rw [sin_v_cos]; rw [abs_le] at h; norm_num at h ⊢; linarith [h.2])
    (by
      have h := cos_stopinj 25.75 _ rfl (by norm_num) (by norm_num)
      rw [sin_v_cos]; rw [abs_le] at h; norm_num at h ⊢; linarith [h.1])
  have hpi := Real.pi_pos
  have h0 : 0 ≤ Real.arcsin 0.9 := Real.arcsin_nonneg.mpr (by norm_num)
  have hle : Real.arcsin 0.9 ≤ π / 2 := Real.arcsin_le_pi_div_two _
  refine ⟨fun x hx0 hx1 => ?_, ?_, ?_⟩
  · have := dve_resitvi_sinus _ x h0 hle hx0 hx1
    rw [hs] at this; exact this
  · obtain ⟨l, u⟩ := hb
    rw [abs_lt]; constructor
    · rw [lt_sub_iff_add_lt, lt_div_iff₀ hpi]; nlinarith
    · rw [sub_lt_iff_lt_add, div_lt_iff₀ hpi]; nlinarith
  · obtain ⟨l, u⟩ := hb
    rw [abs_lt]; constructor
    · rw [lt_sub_iff_add_lt, lt_div_iff₀ hpi]; nlinarith
    · rw [sub_lt_iff_lt_add, div_lt_iff₀ hpi]; nlinarith

/-- Pomožna trditev: spodnja in zgornja meja za `cos θ°` iz Taylorjevega polinoma (preverita jih `norm_num`).
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

/-- Pomožna trditev: spodnja in zgornja meja za `sin θ°` iz Taylorjevega polinoma.
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

/-- Pomožna trditev: iz `a·π/180 < x < b·π/180` sledi `a < x·180/π < b` (pretvorba v stopinje).
pomozno -/
theorem v_stopinje (x a b : ℝ) (ha : a * π / 180 < x) (hb : x < b * π / 180) :
    a < x * 180 / π ∧ x * 180 / π < b := by
  have hpi := Real.pi_pos
  constructor
  · rw [lt_div_iff₀ hpi]; nlinarith
  · rw [div_lt_iff₀ hpi]; nlinarith

/-- Predpostavke trditve `v_stopinje` se dajo izpolniti (`x = π/180`, `a = 0`, `b = 2`). -/
example : (0:ℝ) * π / 180 < π / 180 ∧ π / 180 < 2 * π / 180 := by
  constructor <;> nlinarith [Real.pi_pos]

/-! ## Rešeni primeri -/

/-- Primer 1, koraki 2–5: `a² = 14400`, `b² = 22500`, `2ab = 36000`; `cos 20° ≈ 0,9397`; popravek
`2ab cos γ ≈ 33829`; `c² ≈ 14400 + 22500 − 33829 = 3071`; `c ≈ 55,4 m`; brez odstopanja bi ostalo
`150 − 120 = 30 m`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#primer1
besedilo: »Ker je $\cos 20^\circ \approx 0{,}9397$, je popravek $2ab\cos\gamma \approx 33829\,\mathrm{m^2}$.« -/
theorem primer1 :
    (120:ℝ) ^ 2 = 14400 ∧ (150:ℝ) ^ 2 = 22500 ∧ (2:ℝ) * 120 * 150 = 36000 ∧
    |Real.cos (20 * π / 180) - 0.9397| < 0.00005 ∧
    |36000 * Real.cos (20 * π / 180) - 33829| < 0.5 ∧ (14400:ℝ) + 22500 - 33829 = 3071 ∧
    |14400 + 22500 - 36000 * Real.cos (20 * π / 180) - 3071| < 0.5 ∧
    |Real.sqrt (14400 + 22500 - 36000 * Real.cos (20 * π / 180)) - 55.4| < 0.05 ∧ (150:ℝ) - 120 = 30 := by
  obtain ⟨l, u⟩ := cos_meja 20 0.939692 0.939693 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨sl, su⟩ := sqrt_med (14400 + 22500 - 36000 * Real.cos (20 * π / 180)) 55.41 55.42
    (by norm_num) (by norm_num) (by nlinarith) (by nlinarith)
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, ?_, by norm_num, ?_, ?_, by norm_num⟩ <;>
    (rw [abs_lt]; constructor <;> linarith)

/-- Primer 2, koraki 1–4: `γ = 180° − 52° − 71° = 57°`; `c / sin γ = 400 / sin 57° ≈ 476,9 m`;
`b ≈ 476,9·sin 71° ≈ 451,0 m`; `a ≈ 476,9·sin 52° ≈ 375,8 m`; kontrola: `b` je najdaljša stranica.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#primer2
besedilo: »Stranica $b$ leži nasproti $\beta$, zato $b = \dfrac{c}{\sin\gamma} \cdot \sin\beta \approx 476{,}9\,\mathrm{m} \cdot \sin 71^\circ \approx 451{,}0\,\mathrm{m}$.« -/
theorem primer2 :
    (180:ℝ) - 52 - 71 = 57 ∧
    |400 / Real.sin (57 * π / 180) - 476.9| < 0.05 ∧
    |400 / Real.sin (57 * π / 180) * Real.sin (71 * π / 180) - 451.0| < 0.05 ∧
    |400 / Real.sin (57 * π / 180) * Real.sin (52 * π / 180) - 375.8| < 0.05 ∧
    400 / Real.sin (57 * π / 180) * Real.sin (52 * π / 180) <
      400 / Real.sin (57 * π / 180) * Real.sin (71 * π / 180) ∧
    (400:ℝ) < 400 / Real.sin (57 * π / 180) * Real.sin (71 * π / 180) := by
  obtain ⟨l1, u1⟩ := cos_meja 33 0.838670 0.838671 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨l2, u2⟩ := cos_meja 19 0.945518 0.945519 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨l3, u3⟩ := cos_meja 38 0.788010 0.788011 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  rw [sin_v_cos 57, sin_v_cos 71, sin_v_cos 52]
  rw [show (90:ℝ) - 57 = 33 by norm_num, show (90:ℝ) - 71 = 19 by norm_num,
    show (90:ℝ) - 52 = 38 by norm_num]
  set s1 := Real.cos (33 * π / 180)
  set s2 := Real.cos (19 * π / 180)
  set s3 := Real.cos (38 * π / 180)
  have hs1 : 0 < s1 := by linarith
  have hr1 : 476.94 < 400 / s1 := by rw [lt_div_iff₀ hs1]; nlinarith
  have hr2 : 400 / s1 < 476.95 := by rw [div_lt_iff₀ hs1]; nlinarith
  refine ⟨by norm_num, ?_, ?_, ?_, ?_, ?_⟩
  · rw [abs_lt]; constructor <;> linarith
  · rw [abs_lt]; constructor <;> nlinarith
  · rw [abs_lt]; constructor <;> nlinarith
  · nlinarith
  · nlinarith

/-- Primer 3, koraki 2 in 3: `p² = 7,32² ≈ 53,58`, `2ld = 720`, `cos φ = (400 + 324 − 53,5824)/720 ≈ 0,9311`,
`φ = arccos(…) ≈ 21,4°`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#primer3-phi
besedilo: »$\cos\varphi \approx \dfrac{400 + 324 - 53{,}58}{720} \approx 0{,}9311$, zato je $\varphi \approx 21{,}4^\circ$.« -/
theorem primer3_phi :
    (20:ℝ) ^ 2 = 400 ∧ (18:ℝ) ^ 2 = 324 ∧ (7.32:ℝ) ^ 2 = 53.5824 ∧ |(53.5824:ℝ) - 53.58| < 0.005 ∧
    (2:ℝ) * 20 * 18 = 720 ∧ |((400:ℝ) + 324 - 7.32 ^ 2) / 720 - 0.9311| < 0.00005 ∧
    21.38 < Real.arccos ((400 + 324 - 7.32 ^ 2) / 720) * 180 / π ∧
    Real.arccos ((400 + 324 - 7.32 ^ 2) / 720) * 180 / π < 21.39 ∧
    |Real.arccos ((400 + 324 - 7.32 ^ 2) / 720) * 180 / π - 21.4| < 0.05 := by
  obtain ⟨l1, u1⟩ := cos_meja 21.38 0.931183 0.931184 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨l2, u2⟩ := cos_meja 21.39 0.931119 0.931120 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have hb := arccos_med ((400 + 324 - 7.32 ^ 2) / 720) (21.38 * π / 180) (21.39 * π / 180)
    (by positivity) (by nlinarith [Real.pi_pos]) (by nlinarith [Real.pi_pos])
    (by norm_num at u2 ⊢; linarith) (by norm_num at l1 ⊢; linarith)
  obtain ⟨d1, d2⟩ := v_stopinje _ _ _ hb.1 hb.2
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, d1, d2, ?_⟩
  rw [abs_lt]; constructor <;> linarith

/-- Primer 3, koraki 4–7: `δ` leži nasproti `d = 18`, ki ni najdaljša stranica, zato je oster;
`sin δ = 18 sin φ / 7,32 ≈ 0,8967`, `δ ≈ 63,7°`; `λ = 180° − φ − δ ≈ 94,9°` (iz zaokroženih
`180 − 21,4 − 63,7 = 94,9`), top in nasproti najdaljše stranice `l = 20`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#primer3-delta-lambda
besedilo: »Tretji kot: $\lambda \approx 180^\circ - 21{,}4^\circ - 63{,}7^\circ = 94{,}9^\circ$. Je top in leži nasproti najdaljše stranice $l$, kot mora.« -/
theorem primer3_delta_lambda :
    let φ := Real.arccos ((400 + 324 - 7.32 ^ 2) / 720)
    let w := 18 * Real.sin φ / 7.32
    |w - 0.8967| < 0.00005 ∧
    63.73 < Real.arcsin w * 180 / π ∧ Real.arcsin w * 180 / π < 63.74 ∧
    |Real.arcsin w * 180 / π - 63.7| < 0.05 ∧
    |180 - φ * 180 / π - Real.arcsin w * 180 / π - 94.9| < 0.05 ∧
    90 < 180 - φ * 180 / π - Real.arcsin w * 180 / π ∧ (180:ℝ) - 21.4 - 63.7 = 94.9 ∧
    (18:ℝ) < 20 ∧ (7.32:ℝ) < 20 := by
  intro φ w
  have hv : Real.sin φ = Real.sqrt (1 - ((400 + 324 - 7.32 ^ 2) / 720) ^ 2) := Real.sin_arccos _
  obtain ⟨q1, q2⟩ := sqrt_med (1 - ((400 + 324 - 7.32 ^ 2) / 720) ^ 2) 0.3646732 0.3646733
    (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have hwe : w = 18 * Real.sqrt (1 - ((400 + 324 - 7.32 ^ 2) / 720) ^ 2) / 7.32 := by
    simp only [w]; rw [hv]
  have hw1 : 0.8967373 < w := by rw [hwe, lt_div_iff₀ (by norm_num)]; linarith
  have hw2 : w < 0.89673766 := by rw [hwe, div_lt_iff₀ (by norm_num)]; linarith
  obtain ⟨l1, u1⟩ := cos_meja 26.27 0.896718 0.896719 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨l2, u2⟩ := cos_meja 26.26 0.896795 0.896796 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have hb := arcsin_med w (63.73 * π / 180) (63.74 * π / 180) (by nlinarith [Real.pi_pos])
    (by nlinarith [Real.pi_pos]) (by nlinarith [Real.pi_pos])
    (by rw [sin_v_cos]; norm_num at u1 ⊢; linarith) (by rw [sin_v_cos]; norm_num at l2 ⊢; linarith)
  obtain ⟨d1, d2⟩ := v_stopinje _ _ _ hb.1 hb.2
  obtain ⟨p1, p2⟩ := (primer3_phi).2.2.2.2.2.2
  have p2' := p2.1
  refine ⟨?_, d1, d2, ?_, ?_, ?_, by norm_num, by norm_num, by norm_num⟩
  · rw [abs_lt]; constructor <;> linarith
  · rw [abs_lt]; constructor <;> linarith
  · simp only [φ] at *; rw [abs_lt]; constructor <;> linarith
  · simp only [φ] at *; linarith

/-- Primer 3, opomba: kalkulator za `λ` iz sinusa vrne `180° − λ ≈ 85,1°`, ker je `arcsin(sin λ) = 180° − λ` za
`90° ≤ λ ≤ 270°`; `180 − 85,1 = 94,9`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#primer3-kalkulator
besedilo: »Enačba za sinus ima dve rešitvi in kalkulator vrne napačno: pravi kot je $180^\circ - 85{,}1^\circ = 94{,}9^\circ$.« -/
theorem primer3_kalkulator (x : ℝ) (h1 : π / 2 ≤ x) (h2 : x ≤ 3 * π / 2) :
    Real.arcsin (Real.sin x) = π - x ∧ (180:ℝ) - 85.1 = 94.9 := by
  refine ⟨?_, by norm_num⟩
  rw [← Real.sin_pi_sub]
  exact Real.arcsin_sin (by linarith) (by linarith)

/-- Predpostavke trditve `primer3_kalkulator` se dajo izpolniti (`x = π`). -/
example : π / 2 ≤ π ∧ π ≤ 3 * π / 2 := by constructor <;> linarith [Real.pi_pos]

/-- Predpostavke trditve `primer3_kalkulator` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : π / 2 ≤ π ∧ π ≤ 3 * π / 2 := by constructor <;> linarith [Real.pi_pos]
  primer3_kalkulator (h1 := w.1) (h2 := w.2)

/-- Primer 3, opomba (za dejanski `λ` iz računa): kalkulator iz `sin λ` vrne kot `≈ 85,1°`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#primer3-kalkulator-lambda
besedilo: »Če bi s sinusom računal kot $\lambda$, bi kalkulator vrnil $85{,}1^\circ$.« -/
theorem primer3_kalkulator_lambda :
    |Real.arcsin (Real.sin ((180 - Real.arccos ((400 + 324 - 7.32 ^ 2) / 720) * 180 / π -
      Real.arcsin (18 * Real.sin (Real.arccos ((400 + 324 - 7.32 ^ 2) / 720)) / 7.32) * 180 / π) * π / 180)) *
      180 / π - 85.1| < 0.05 := by
  obtain ⟨-, -, -, -, h5, h6, -⟩ := primer3_delta_lambda
  set L := 180 - Real.arccos ((400 + 324 - 7.32 ^ 2) / 720) * 180 / π -
      Real.arcsin (18 * Real.sin (Real.arccos ((400 + 324 - 7.32 ^ 2) / 720)) / 7.32) * 180 / π
  rw [abs_lt] at h5
  have hpi := Real.pi_pos
  have hx := (primer3_kalkulator (L * π / 180) (by nlinarith) (by nlinarith)).1
  rw [hx, show (π - L * π / 180) * 180 / π = 180 - L by field_simp, abs_lt]
  constructor <;> linarith

/-- Primer 4: kvadrati `2,4² = 5,76`, `3,1² = 9,61`, `3,5² = 12,25`, imenovalec `2·2,4·3,1 = 14,88`;
`cos κ = 3,12/14,88 ≈ 0,2097`, `κ ≈ 77,9°`, oster (`cos κ > 0`).
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#primer4
besedilo: »Kvadrati: $2{,}4^2 = 5{,}76$; $3{,}1^2 = 9{,}61$; $3{,}5^2 = 12{,}25$. Imenovalec: $2 \cdot 2{,}4 \cdot 3{,}1 = 14{,}88$.« -/
theorem primer4 :
    (2.4:ℝ) ^ 2 = 5.76 ∧ (3.1:ℝ) ^ 2 = 9.61 ∧ (3.5:ℝ) ^ 2 = 12.25 ∧ (2:ℝ) * 2.4 * 3.1 = 14.88 ∧
    ((5.76:ℝ) + 9.61 - 12.25) / 14.88 = 3.12 / 14.88 ∧ |(3.12:ℝ) / 14.88 - 0.2097| < 0.00005 ∧
    |Real.arccos (3.12 / 14.88) * 180 / π - 77.9| < 0.05 ∧ Real.arccos (3.12 / 14.88) < π / 2 := by
  obtain ⟨l1, u1⟩ := sin_meja 12.05 0.208765 0.208766 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨l2, u2⟩ := sin_meja 12.15 0.210471 0.210472 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have hb := arccos_med (3.12 / 14.88) (77.85 * π / 180) (77.95 * π / 180)
    (by positivity) (by nlinarith [Real.pi_pos]) (by nlinarith [Real.pi_pos])
    (by rw [cos_v_sin]; norm_num at u1 ⊢; linarith) (by rw [cos_v_sin]; norm_num at l2 ⊢; linarith)
  obtain ⟨d1, d2⟩ := v_stopinje _ _ _ hb.1 hb.2
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_, ?_⟩
  · rw [abs_lt]; constructor <;> linarith
  · nlinarith [Real.pi_pos, hb.2]

/-- Primer 1 in Primer 2, zaokroženi odgovori: `c ≈ 55 m` in `a ≈ 376 m`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#zaokrozeni-odgovori
besedilo: »Odgovor: žoga je približno $55\,\mathrm{m}$ od zastavice.« -/
theorem zaokrozeni_odgovori :
    |Real.sqrt (14400 + 22500 - 36000 * Real.cos (20 * π / 180)) - 55| < 0.5 ∧
    |400 / Real.sin (57 * π / 180) * Real.sin (52 * π / 180) - 376| < 0.5 := by
  obtain ⟨-, -, -, -, -, -, -, h1, -⟩ := primer1
  obtain ⟨-, -, -, h2, -⟩ := primer2
  rw [abs_lt] at h1 h2 ⊢
  rw [abs_lt]
  exact ⟨⟨by linarith, by linarith⟩, by linarith, by linarith⟩

/-! ## Pogoste napake -/

/-- Pogoste napake (kot zavoja): pri zavoju za 50° je notranji kot `180° − 50° = 130°`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#napaka-zavoj
besedilo: »Kot zavoja namesto notranjega kota.** Tekač se obrne za $50^\circ$, a notranji kot trikotnika je $180^\circ - 50^\circ = 130^\circ$.« -/
theorem napaka_zavoj : (180:ℝ) - 50 = 130 := by norm_num

/-- Pogoste napake (pozabljen koren): `c² = 39` pomeni `c = √39 ≈ 6,24`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#napaka-koren
besedilo: »Pozabljen koren.** Kosinusni izrek da $c^2$, ne $c$. Rezultat $c^2 = 39$ pomeni $c \approx 6{,}24$.« -/
theorem napaka_koren (c : ℝ) (hc : 0 ≤ c) (h : c ^ 2 = 39) : c = Real.sqrt 39 ∧ |c - 6.24| < 0.005 := by
  have hs : c = Real.sqrt 39 := by rw [← h, Real.sqrt_sq hc]
  obtain ⟨l, u⟩ := sqrt_med 39 6.2449 6.245 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  refine ⟨hs, ?_⟩
  rw [hs, abs_lt]; constructor <;> linarith

/-- Predpostavke trditve `napaka_koren` se dajo izpolniti (`c = √39`). -/
example : 0 ≤ Real.sqrt 39 ∧ Real.sqrt 39 ^ 2 = 39 := ⟨Real.sqrt_nonneg _, Real.sq_sqrt (by norm_num)⟩

/-- Predpostavke trditve `napaka_koren` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : 0 ≤ Real.sqrt 39 ∧ Real.sqrt 39 ^ 2 = 39 := ⟨Real.sqrt_nonneg _, Real.sq_sqrt (by norm_num)⟩
  napaka_koren (hc := w.1) (h := w.2)

/-- Pogoste napake (vrstni red računanja): `(a² + b² − 2ab)·cos γ` v splošnem ni `a² + b² − 2ab cos γ` (npr.
`a = 3`, `b = 4`, `γ = 60°`: `1·0,5 = 0,5`, pravilno pa `25 − 12 = 13`).
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#napaka-vrstni-red
besedilo: »Napačen vrstni red računanja.** Računaš $(a^2 + b^2 - 2ab) \cdot \cos\gamma$.« -/
theorem napaka_vrstni_red :
    ((3:ℝ) ^ 2 + 4 ^ 2 - 2 * 3 * 4) * Real.cos (60 * π / 180) = 0.5 ∧
    (3:ℝ) ^ 2 + 4 ^ 2 - 2 * 3 * 4 * Real.cos (60 * π / 180) = 13 := by
  rw [cos_120_60.2]; norm_num

/-! ## Za maturo -/

/-- Naloga 1: stranice 3, 5, 7; `cos γ = (9 + 25 − 49)/30 = −15/30 = −1/2`; med 0° in 180° ima kosinus `−1/2`
le kot 120°.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#matura1
besedilo: »Po kosinusnem izreku: $\cos\gamma = \dfrac{a^2 + b^2 - c^2}{2ab} = \dfrac{9 + 25 - 49}{30} = \dfrac{-15}{30} = -\dfrac{1}{2}$.« -/
theorem matura1 (γ : ℝ) (h0 : 0 ≤ γ) (h1 : γ ≤ π)
    (h : (7:ℝ) ^ 2 = 3 ^ 2 + 5 ^ 2 - 2 * 3 * 5 * Real.cos γ) :
    ((3:ℝ) ^ 2 + 5 ^ 2 - 7 ^ 2) / (2 * 3 * 5) = (9 + 25 - 49) / 30 ∧ ((9:ℝ) + 25 - 49) / 30 = -15 / 30 ∧
    (-15:ℝ) / 30 = -1 / 2 ∧ Real.cos γ = -1 / 2 ∧ γ = 120 * π / 180 := by
  have hc : Real.cos γ = -1 / 2 := by linarith
  refine ⟨by norm_num, by norm_num, by norm_num, hc, ?_⟩
  apply Real.injOn_cos ⟨h0, h1⟩ ⟨by positivity, by nlinarith [Real.pi_pos]⟩
  rw [hc, cos_120_60.1]; norm_num

/-- Predpostavke trditve `matura1` se dajo izpolniti (`γ = 120°`). -/
example : (0:ℝ) ≤ 120 * π / 180 ∧ 120 * π / 180 ≤ π ∧
    (7:ℝ) ^ 2 = 3 ^ 2 + 5 ^ 2 - 2 * 3 * 5 * Real.cos (120 * π / 180) := by
  refine ⟨by positivity, by nlinarith [Real.pi_pos], ?_⟩
  rw [cos_120_60.1]; norm_num

/-- Predpostavke trditve `matura1` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 120 * π / 180 ∧ 120 * π / 180 ≤ π ∧ (7:ℝ) ^ 2 = 3 ^ 2 + 5 ^ 2 - 2 * 3 * 5 * Real.cos (120 * π / 180) := by
    refine ⟨by positivity, by nlinarith [Real.pi_pos], ?_⟩
    rw [cos_120_60.1]; norm_num
  matura1 (h0 := w.1) (h1 := w.2.1) (h := w.2.2)

/-- `<<RACUN`: `arccos(−1/2)·180/π = 120`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#arccos-minus-pol
besedilo: »Med $0^\circ$ in $180^\circ$ ima kosinus $-\frac{1}{2}$ le kot $120^\circ$.« -/
theorem arccos_minus_pol : Real.arccos (-1 / 2) * 180 / π = 120 := by
  have h : Real.arccos (-1 / 2) = 120 * π / 180 := by
    have e : (-1 / 2 : ℝ) = Real.cos (120 * π / 180) := by rw [cos_120_60.1]; norm_num
    rw [e]
    exact Real.arccos_cos (by positivity) (by nlinarith [Real.pi_pos])
  rw [h]; field_simp

/-- Naloga 2 a): `a² = 62² + 85² − 2·62·85·cos 74° = 3844 + 7225 − 10540 cos 74° ≈ 8163,78`,
`a ≈ 90,354 ≈ 90,4 m`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#matura2a
besedilo: »a) $a^2 = b^2 + c^2 - 2bc\cos\alpha = 3844 + 7225 - 10540\cos 74^\circ \approx 8163{,}78\,\mathrm{m^2}$, torej $a \approx 90{,}354\,\mathrm{m} \approx 90{,}4\,\mathrm{m}$.« -/
theorem matura2a :
    (62:ℝ) ^ 2 = 3844 ∧ (85:ℝ) ^ 2 = 7225 ∧ (2:ℝ) * 62 * 85 = 10540 ∧
    |3844 + 7225 - 10540 * Real.cos (74 * π / 180) - 8163.78| < 0.005 ∧
    |Real.sqrt (3844 + 7225 - 10540 * Real.cos (74 * π / 180)) - 90.354| < 0.0005 ∧
    |Real.sqrt (3844 + 7225 - 10540 * Real.cos (74 * π / 180)) - 90.4| < 0.05 := by
  obtain ⟨l, u⟩ := sin_meja 16 0.27563735 0.27563736 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  rw [cos_v_sin, show (90:ℝ) - 74 = 16 by norm_num]
  obtain ⟨sl, su⟩ := sqrt_med (3844 + 7225 - 10540 * Real.sin (16 * π / 180)) 90.3536 90.3537
    (by norm_num) (by norm_num) (by nlinarith) (by nlinarith)
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, ?_, ?_⟩ <;> (rw [abs_lt]; constructor <;> linarith)

/-- Naloga 2 b): `β` leži nasproti `b = 62`, ki ni najdaljša, zato je oster;
`sin β = b sin α / a ≈ 62·0,96126/90,354 ≈ 0,65961`, `β ≈ 41,270° ≈ 41,27°`; z zaokroženim `a = 90,4` pa
`β ≈ 41,24°`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#matura2b
besedilo: »b) $\sin\beta = \dfrac{b\sin\alpha}{a} \approx \dfrac{62 \cdot 0{,}96126}{90{,}354} \approx 0{,}65961$, zato $\beta \approx 41{,}270^\circ \approx 41{,}27^\circ$.« -/
theorem matura2b :
    let a := Real.sqrt (3844 + 7225 - 10540 * Real.cos (74 * π / 180))
    |Real.sin (74 * π / 180) - 0.96126| < 0.000005 ∧
    |62 * Real.sin (74 * π / 180) / a - 0.65961| < 0.000005 ∧
    |Real.arcsin (62 * Real.sin (74 * π / 180) / a) * 180 / π - 41.27| < 0.005 ∧
    |Real.arcsin (62 * Real.sin (74 * π / 180) / 90.4) * 180 / π - 41.24| < 0.005 ∧ (62:ℝ) < 85 := by
  intro a
  obtain ⟨l, u⟩ := sin_meja 16 0.27563735 0.27563736 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨cl, cu⟩ := cos_meja 16 0.96126169 0.96126170 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have ha : a = Real.sqrt (3844 + 7225 - 10540 * Real.sin (16 * π / 180)) := by
    simp only [a]; rw [cos_v_sin, show (90:ℝ) - 74 = 16 by norm_num]
  obtain ⟨sl, su⟩ := sqrt_med (3844 + 7225 - 10540 * Real.sin (16 * π / 180)) 90.35365 90.353652
    (by norm_num) (by norm_num) (by nlinarith) (by nlinarith)
  rw [← ha] at sl su
  have hs : Real.sin (74 * π / 180) = Real.cos (16 * π / 180) := by
    rw [sin_v_cos, show (90:ℝ) - 74 = 16 by norm_num]
  rw [hs]
  have hpos : 0 < a := by linarith
  have hq1 : 0.6596105 < 62 * Real.cos (16 * π / 180) / a := by rw [lt_div_iff₀ hpos]; nlinarith
  have hq2 : 62 * Real.cos (16 * π / 180) / a < 0.6596107 := by rw [div_lt_iff₀ hpos]; nlinarith
  obtain ⟨b1l, b1u⟩ := cos_meja 48.735 0.6595425 0.6595428 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  obtain ⟨b2l, b2u⟩ := cos_meja 48.725 0.6596737 0.6596740 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  have hb := arcsin_med (62 * Real.cos (16 * π / 180) / a) (41.265 * π / 180) (41.275 * π / 180)
    (by nlinarith [Real.pi_pos]) (by nlinarith [Real.pi_pos]) (by nlinarith [Real.pi_pos])
    (by rw [sin_v_cos]; norm_num at b1u ⊢; linarith) (by rw [sin_v_cos]; norm_num at b2l ⊢; linarith)
  obtain ⟨d1, d2⟩ := v_stopinje _ _ _ hb.1 hb.2
  obtain ⟨c1l, c1u⟩ := cos_meja 48.765 0.6591488 0.6591491 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  obtain ⟨c2l, c2u⟩ := cos_meja 48.755 0.6592801 0.6592804 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  have hb' := arcsin_med (62 * Real.cos (16 * π / 180) / 90.4) (41.235 * π / 180) (41.245 * π / 180)
    (by nlinarith [Real.pi_pos]) (by nlinarith [Real.pi_pos]) (by nlinarith [Real.pi_pos])
    (by rw [sin_v_cos]; norm_num at c1u ⊢; linarith) (by rw [sin_v_cos]; norm_num at c2l ⊢; linarith)
  obtain ⟨e1, e2⟩ := v_stopinje _ _ _ hb'.1 hb'.2
  refine ⟨?_, ?_, ?_, ?_, by norm_num⟩ <;> (rw [abs_lt]; constructor <;> linarith)

/-- Naloga 2 c): polmer očrtane krožnice `R = a / (2 sin α) ≈ 90,354/(2 sin 74°) ≈ 46,997 ≈ 47,0 m`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#matura2c
besedilo: »c) Krožnica skozi vsa tri oglišča je očrtana krožnica. Iz sinusnega izreka $2R = \dfrac{a}{\sin\alpha}$ sledi $R = \dfrac{90{,}354\,\mathrm{m}}{2\sin 74^\circ} \approx 46{,}997\,\mathrm{m}$.« -/
theorem matura2c :
    |Real.sqrt (3844 + 7225 - 10540 * Real.cos (74 * π / 180)) / (2 * Real.sin (74 * π / 180)) - 46.997| <
      0.0005 ∧
    |Real.sqrt (3844 + 7225 - 10540 * Real.cos (74 * π / 180)) / (2 * Real.sin (74 * π / 180)) - 47.0| <
      0.05 := by
  obtain ⟨l, u⟩ := sin_meja 16 0.27563735 0.27563736 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨cl, cu⟩ := cos_meja 16 0.96126169 0.96126170 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  rw [cos_v_sin 74, sin_v_cos 74, show (90:ℝ) - 74 = 16 by norm_num]
  obtain ⟨sl, su⟩ := sqrt_med (3844 + 7225 - 10540 * Real.sin (16 * π / 180)) 90.35365 90.353652
    (by norm_num) (by norm_num) (by nlinarith) (by nlinarith)
  have hpos : 0 < 2 * Real.cos (16 * π / 180) := by linarith
  have r1 : 46.99741 < Real.sqrt (3844 + 7225 - 10540 * Real.sin (16 * π / 180)) /
      (2 * Real.cos (16 * π / 180)) := by rw [lt_div_iff₀ hpos]; nlinarith
  have r2 : Real.sqrt (3844 + 7225 - 10540 * Real.sin (16 * π / 180)) /
      (2 * Real.cos (16 * π / 180)) < 46.99745 := by rw [div_lt_iff₀ hpos]; nlinarith
  constructor <;> (rw [abs_lt]; constructor <;> linarith)

/-! ## Preveri se -/

/-- Preveri se 2: `cos 60° = 0,5`, `cos 120° = −0,5`; pri istih `a, b > 0` je stranica pri 120° daljša:
`a² + b² − 2ab·cos 120° > a² + b² − 2ab·cos 60°`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#kviz2
besedilo: »Pri $\gamma = 120^\circ$ je $\cos\gamma < 0$, zato je $c^2 = a^2 + b^2 + 2ab \cdot 0{,}5$, kar je več kot pri $60^\circ$.« -/
theorem kviz2 (a b : ℝ) (ha : 0 < a) (hb : 0 < b) :
    a ^ 2 + b ^ 2 - 2 * a * b * Real.cos (60 * π / 180) <
      a ^ 2 + b ^ 2 - 2 * a * b * Real.cos (120 * π / 180) := by
  rw [cos_120_60.1, cos_120_60.2]; nlinarith [mul_pos ha hb]

/-- Predpostavke trditve `kviz2` se dajo izpolniti (`a = b = 1`). -/
example : (0:ℝ) < 1 := one_pos

/-- Predpostavke trditve `kviz2` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 1 := one_pos
  kviz2 (ha := w) (hb := w)

/-- Preveri se 3 (in `<<RACUN`): `a = 5`, `b = 7`, `γ = 60°`: `c² = 25 + 49 − 2·5·7·0,5 = 39`,
`c = √39 ≈ 6,24 cm`; napačni `√74 ≈ 8,60` (Pitagora), `√109 ≈ 10,44` (popravek prištet).
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#kviz3
besedilo: »$c^2 = 25 + 49 - 2 \cdot 5 \cdot 7 \cdot 0{,}5 = 39$, torej $c = \sqrt{39}\,\mathrm{cm} \approx 6{,}24\,\mathrm{cm}$.« -/
theorem kviz3 :
    (5:ℝ) ^ 2 + 7 ^ 2 - 2 * 5 * 7 * Real.cos (60 * π / 180) = 39 ∧
    |Real.sqrt 39 - 6.24| < 0.005 ∧ |Real.sqrt (25 + 49) - 8.60| < 0.005 ∧
    |Real.sqrt (74 + 35) - 10.44| < 0.005 := by
  obtain ⟨a1, a2⟩ := sqrt_med 39 6.2449 6.245 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨b1, b2⟩ := sqrt_med (25 + 49) 8.602 8.6024 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨c1, c2⟩ := sqrt_med (74 + 35) 10.4403 10.4404 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  refine ⟨by rw [cos_120_60.2]; norm_num, ?_, ?_, ?_⟩ <;> (rw [abs_lt]; constructor <;> linarith)

/-- Preveri se 4: `a = 9`, `b = 5`, `β = 30°`: `sin α = 9·0,5/5 = 0,9`; poleg `α ≈ 64,2°` je rešitev tudi
`α ≈ 115,8°` z `γ ≈ 34,2°`, obe vsoti z β sta pod 180°, trikotnika sta dva.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#kviz4
besedilo: »Tudi $\alpha \approx 115{,}8^\circ$ ima sinus $0{,}9$, z $\beta = 30^\circ$ pa je vsota še pod $180^\circ$ ($\gamma \approx 34{,}2^\circ$). Trikotnika sta dva.« -/
theorem kviz4 :
    (9:ℝ) * 0.5 / 5 = 0.9 ∧
    Real.arcsin 0.9 * 180 / π + 30 < 180 ∧ (π - Real.arcsin 0.9) * 180 / π + 30 < 180 ∧
    |180 - 30 - (π - Real.arcsin 0.9) * 180 / π - 34.2| < 0.05 := by
  obtain ⟨-, h1, h2⟩ := sinus_09
  rw [abs_lt] at h1 h2
  refine ⟨by norm_num, by linarith, by linarith, ?_⟩
  rw [abs_lt]; constructor <;> linarith

/-- Preveri se 5 (in `<<RACUN`): notranji kot 130°, `c² = 9 + 4 − 12 cos 130° ≈ 20,71`, `c ≈ 4,55 km`; napačni:
s kotom 50° `≈ 2,30`, naravnost 5, Pitagora `√13 ≈ 3,61`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#kviz5
besedilo: »Notranji kot je $180^\circ - 50^\circ = 130^\circ$. Torej $c^2 = 9 + 4 - 12\cos 130^\circ \approx 20{,}71$ in $c \approx 4{,}55\,\mathrm{km}$.« -/
theorem kviz5 :
    |9 + 4 - 12 * Real.cos (130 * π / 180) - 20.71| < 0.005 ∧
    |Real.sqrt (9 + 4 - 12 * Real.cos (130 * π / 180)) - 4.55| < 0.005 ∧
    |Real.sqrt (9 + 4 - 12 * Real.cos (50 * π / 180)) - 2.30| < 0.005 ∧
    (3:ℝ) + 2 = 5 ∧ |Real.sqrt 13 - 3.61| < 0.005 := by
  obtain ⟨l, u⟩ := sin_meja 40 0.64278760 0.64278762 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h130 : Real.cos (130 * π / 180) = -Real.sin (40 * π / 180) := by
    rw [show 130 * π / 180 = 40 * π / 180 + π / 2 by ring, Real.cos_add_pi_div_two]
  have h50 : Real.cos (50 * π / 180) = Real.sin (40 * π / 180) := by
    rw [cos_v_sin]; norm_num
  rw [h130, h50]
  obtain ⟨s1, s2⟩ := sqrt_med (9 + 4 - 12 * -Real.sin (40 * π / 180)) 4.5512 4.5513 (by norm_num) (by norm_num)
    (by nlinarith) (by nlinarith)
  obtain ⟨t1, t2⟩ := sqrt_med (9 + 4 - 12 * Real.sin (40 * π / 180)) 2.2992 2.2993 (by norm_num) (by norm_num)
    (by nlinarith) (by nlinarith)
  obtain ⟨r1, r2⟩ := sqrt_med 13 3.6055 3.6056 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  refine ⟨?_, ?_, ?_, by norm_num, ?_⟩ <;> (rw [abs_lt]; constructor <;> linarith)

/-- Preveri se 5, razlaga napačnega odgovora 5: zaradi zavoja je razdalja `≈ 4,55` strogo krajša od vsote
odsekov `3 + 2`.
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#kviz5-krajse
besedilo: »Torej $c^2 = 9 + 4 - 12\cos 130^\circ \approx 20{,}71$ in $c \approx 4{,}55\,\mathrm{km}$.« -/
theorem kviz5_krajse : Real.sqrt (9 + 4 - 12 * Real.cos (130 * π / 180)) < 3 + 2 := by
  obtain ⟨-, h, -⟩ := kviz5
  rw [abs_lt] at h
  linarith [h.2]

/-- Preveri se 6 (in `<<RACUN`): `a = 7`, `b = 8`, `γ = 120°`: `c² = 49 + 64 − 2·7·8·(−1/2) = 113 + 56 = 169`,
`c = 13 cm`; napačni `√57 ≈ 7,55`, `√113 ≈ 10,63`, 169 (`c²`).
trditev: MAT-SS-3/sinusni-in-kosinusni-izrek#kviz6
besedilo: »$c^2 = 49 + 64 - 2 \cdot 7 \cdot 8 \cdot \left(-\frac{1}{2}\right) = 113 + 56 = 169$, torej $c = 13\,\mathrm{cm}$.« -/
theorem kviz6 :
    (7:ℝ) ^ 2 + 8 ^ 2 - 2 * 7 * 8 * Real.cos (120 * π / 180) = 113 + 56 ∧ (113:ℝ) + 56 = 169 ∧
    Real.sqrt 169 = 13 ∧ |Real.sqrt 57 - 7.55| < 0.005 ∧ |Real.sqrt 113 - 10.63| < 0.005 := by
  obtain ⟨a1, a2⟩ := sqrt_med 57 7.5498 7.5499 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨b1, b2⟩ := sqrt_med 113 10.6301 10.6302 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  refine ⟨by rw [cos_120_60.1]; norm_num, by norm_num, ?_, ?_, ?_⟩
  · rw [show (169:ℝ) = 13 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  all_goals (rw [abs_lt]; constructor <;> linarith)

/-! ## Primeri izpolnljivosti (izrek, uporabljen na konkretnih vrednostih) -/

/-- Predpostavke trditve `kosinus_en_kot` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ∈ Set.Icc 0 π := ⟨le_rfl, Real.pi_pos.le⟩
  kosinus_en_kot (hx := w) (hy := w) (h := rfl)

/-- Predpostavke trditve `sestilo` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 1 ∧ (0:ℝ) < π := ⟨one_pos, Real.pi_pos⟩
  sestilo (ha := w.1) (hb := w.1) (h0 := le_refl (0:ℝ)) (h12 := w.2) (h2 := le_refl π)

/-- Predpostavke trditve `sinusni_izrek` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Real.sin (∠ tC tA tB) ≠ 0 ∧ Real.sin (∠ tA tB tC) ≠ 0 ∧ tB ≠ tA ∧ ¬Collinear ℝ ({tA, tB, tC} : Set (EuclideanSpace ℝ (Fin 2))) ∧ dist tA tB < dist tA tC ∧ ∠ tC tA tB = π / 2 := by
    have h := t_nekolinearen
    have hp : ∠ tC tA tB = π / 2 := by rw [EuclideanGeometry.angle_comm]; exact t_pravi
    refine ⟨?_, sin_ne_zero_of_not_collinear h, ?_, h, ?_, hp⟩
    · rw [hp, Real.sin_pi_div_two]; exact one_ne_zero
    · intro hBA; apply h; rw [hBA]; simp [collinear_pair]
    · simp [EuclideanSpace.dist_eq, tA, tB, tC, Fin.sum_univ_two]
  sinusni_izrek (hα := w.1) (hβ := w.2.1)

/-- Predpostavke trditve `vecji_kot_daljsa_stranica` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Real.sin (∠ tC tA tB) ≠ 0 ∧ Real.sin (∠ tA tB tC) ≠ 0 ∧ tB ≠ tA ∧ ¬Collinear ℝ ({tA, tB, tC} : Set (EuclideanSpace ℝ (Fin 2))) ∧ dist tA tB < dist tA tC ∧ ∠ tC tA tB = π / 2 := by
    have h := t_nekolinearen
    have hp : ∠ tC tA tB = π / 2 := by rw [EuclideanGeometry.angle_comm]; exact t_pravi
    refine ⟨?_, sin_ne_zero_of_not_collinear h, ?_, h, ?_, hp⟩
    · rw [hp, Real.sin_pi_div_two]; exact one_ne_zero
    · intro hBA; apply h; rw [hBA]; simp [collinear_pair]
    · simp [EuclideanSpace.dist_eq, tA, tB, tC, Fin.sum_univ_two]
  vecji_kot_daljsa_stranica (h := w.2.2.2.1)

/-- Predpostavke trditve `kot_nasproti_krajse_oster` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Real.sin (∠ tC tA tB) ≠ 0 ∧ Real.sin (∠ tA tB tC) ≠ 0 ∧ tB ≠ tA ∧ ¬Collinear ℝ ({tA, tB, tC} : Set (EuclideanSpace ℝ (Fin 2))) ∧ dist tA tB < dist tA tC ∧ ∠ tC tA tB = π / 2 := by
    have h := t_nekolinearen
    have hp : ∠ tC tA tB = π / 2 := by rw [EuclideanGeometry.angle_comm]; exact t_pravi
    refine ⟨?_, sin_ne_zero_of_not_collinear h, ?_, h, ?_, hp⟩
    · rw [hp, Real.sin_pi_div_two]; exact one_ne_zero
    · intro hBA; apply h; rw [hBA]; simp [collinear_pair]
    · simp [EuclideanSpace.dist_eq, tA, tB, tC, Fin.sum_univ_two]
  kot_nasproti_krajse_oster (h := w.2.2.2.1) (hd := w.2.2.2.2.1)

/-- Predpostavke trditve `visina` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Real.sin (∠ tC tA tB) ≠ 0 ∧ Real.sin (∠ tA tB tC) ≠ 0 ∧ tB ≠ tA ∧ ¬Collinear ℝ ({tA, tB, tC} : Set (EuclideanSpace ℝ (Fin 2))) ∧ dist tA tB < dist tA tC ∧ ∠ tC tA tB = π / 2 := by
    have h := t_nekolinearen
    have hp : ∠ tC tA tB = π / 2 := by rw [EuclideanGeometry.angle_comm]; exact t_pravi
    refine ⟨?_, sin_ne_zero_of_not_collinear h, ?_, h, ?_, hp⟩
    · rw [hp, Real.sin_pi_div_two]; exact one_ne_zero
    · intro hBA; apply h; rw [hBA]; simp [collinear_pair]
    · simp [EuclideanSpace.dist_eq, tA, tB, tC, Fin.sum_univ_two]
  visina (h := w.2.2.2.2.2)

end Evklid.Lekcije.MAT_SS_3.SinusniInKosinusniIzrek
