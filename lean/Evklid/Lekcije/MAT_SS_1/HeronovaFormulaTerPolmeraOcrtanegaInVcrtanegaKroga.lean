/-
vir: content/lessons/MAT-SS-1/heronova-formula-ter-polmera-ocrtanega-in-vcrtanega-kroga.md
sha256: 05bf03e498efd0811b93b4d864ccd1f663c926dcf0c962bb0f5ed6b892894e8f
Model: `pol a b c = (a + b + c)/2` je polobseg, `heron a b c = √(s(s − a)(s − b)(s − c))`. Splošni trditvi (Heronova
formula, R = abc/(4S)) sta dokazani za trikotnik v ravnini ℂ z A = 0, B = c > 0 (na realni osi) in C = x + yi:
a = |BC|, b = |AC|, ploščina je osnovnica krat višina skozi 2, S = c·|y|/2 (višina na AB je |y|); središče O očrtane
krožnice je katerakoli točka, enako oddaljena od A, B, C (|OA| = |OB| = |OC| = R). Decimalna števila so ulomki;
»≈ a« na k decimalk je |vrednost − a| < ½·10⁻ᵏ. Lean: √ negativnega je 0 in x/0 = 0, zato je trditev »pod korenom je
negativno število, ploščine ni« zapisana kot »ne obstaja realni S z S² = s(s − a)(s − b)(s − c)«.
Ni v Leanu: zgodba (Maja, reševalci, Egipt, Heron), risbe in simulacija »Središči očrtanega in včrtanega kroga«;
razrez na tri trikotnike z višino r pri r = S/s (dokazana je algebra ar/2 + br/2 + cr/2 = r·s; da je središče I za
3, 4, 5 v (1, 1), je opis risbe); »središče včrtane krožnice ostane vedno v trikotniku« in lega središča O glede na
vrsto trikotnika (Primer 2 »oddajnik stoji zunaj«, Naloga 2 d) »središče leži znotraj«; zahtevno, še ni dokazano;
dokazano je, da je kot nasproti najdaljše stranice top oziroma oster); »R je vedno večji od r« (Eulerjeva neenakost,
zahtevno, še ni dokazano); »vsaka stranica je tetiva, krajša od premera, pri drugih trikotnikih« je dokazano kot
|AB| ≤ 2R in »|AB| = 2R ⇒ pravi kot pri C«; kateri krog je »največji v trikotniku« (opis: uporabljen je včrtani);
»Formula S = ab/2 velja, kadar sta a, b kateti« je dokazana v modelu (C = yi nad A); razvrščanje korakov (kviz 5),
Postopek, Pazi na, točkovanje (opis).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.HeronovaFormulaTerPolmeraOcrtanegaInVcrtanegaKroga

open Real EuclideanGeometry

/-- Polobseg s = (a + b + c)/2. -/
noncomputable def pol (a b c : ℝ) : ℝ := (a + b + c) / 2

/-- Heronova formula: √(s(s − a)(s − b)(s − c)). -/
noncomputable def heron (a b c : ℝ) : ℝ :=
  √(pol a b c * (pol a b c - a) * (pol a b c - b) * (pol a b c - c))

/-- Pomožno: kvadrat razdalje v ℂ iz koordinat. -/
theorem dist_c_sq (z w : ℂ) : dist z w ^ 2 = (z.re - w.re) ^ 2 + (z.im - w.im) ^ 2 := by
  rw [Complex.dist_eq_re_im, Real.sq_sqrt (by positivity)]

/-- Pomožno: produkt pod korenom, izražen s kvadrati stranic: 16·s(s − a)(s − b)(s − c) =
2a²b² + 2a²c² + 2b²c² − a⁴ − b⁴ − c⁴. -/
theorem produkt (a b c : ℝ) : pol a b c * (pol a b c - a) * (pol a b c - b) * (pol a b c - c) =
    (2 * a ^ 2 * b ^ 2 + 2 * a ^ 2 * c ^ 2 + 2 * b ^ 2 * c ^ 2 - (a ^ 2) ^ 2 - (b ^ 2) ^ 2 - c ^ 4) / 16 := by
  unfold pol; ring

/-- Pomožno: √(k²) = k za k ≥ 0. -/
theorem sqrt_kv {k : ℝ} (hk : 0 ≤ k) : √(k ^ 2) = k := Real.sqrt_sq hk

/-- Predpostavka trditve `sqrt_kv` se da izpolniti (k = 3). -/
example : (0 : ℝ) ≤ 3 := by norm_num

/-! ## 2. Heronova formula -/

/-- Razlaga 2, Povzetek (Heronova formula): za trikotnik A = 0, B = c, C = x + yi (c ≥ 0) s stranicama a = |BC|,
b = |AC| je ploščina S = c·|y|/2 enaka √(s(s − a)(s − b)(s − c)). -/
theorem heronova_formula (c x y : ℝ) (hc : 0 ≤ c) :
    c * |y| / 2 = heron (dist (c : ℂ) ⟨x, y⟩) (dist (0 : ℂ) ⟨x, y⟩) c := by
  have ha := dist_c_sq (c : ℂ) ⟨x, y⟩
  have hb := dist_c_sq (0 : ℂ) ⟨x, y⟩
  simp only [Complex.ofReal_re, Complex.ofReal_im, Complex.zero_re, Complex.zero_im] at ha hb
  unfold heron
  rw [produkt, ha, hb]
  have : (2 * ((c - x) ^ 2 + (0 - y) ^ 2) * ((0 - x) ^ 2 + (0 - y) ^ 2) + 2 * ((c - x) ^ 2 + (0 - y) ^ 2) * c ^ 2 +
      2 * ((0 - x) ^ 2 + (0 - y) ^ 2) * c ^ 2 - ((c - x) ^ 2 + (0 - y) ^ 2) ^ 2 -
      ((0 - x) ^ 2 + (0 - y) ^ 2) ^ 2 - c ^ 4) / 16 = (c * |y| / 2) ^ 2 := by
    rw [div_pow, mul_pow, sq_abs]; ring
  rw [this, Real.sqrt_sq (by positivity)]

/-- Predpostavka trditve `heronova_formula` se da izpolniti (c = 6). -/
example : (0 : ℝ) ≤ 6 := by norm_num

/-- Razlaga 1 in Pogoste napake: S = ab/2 velja, kadar sta a, b kateti: pri C = yi (pravi kot pri A) je
S = c·|y|/2 = |AB|·|AC|/2. -/
theorem katete (c y : ℝ) (hc : 0 ≤ c) : c * |y| / 2 = dist (0 : ℂ) c * dist (0 : ℂ) ⟨0, y⟩ / 2 := by
  rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im]
  simp [Real.sqrt_sq_eq_abs, abs_of_nonneg hc]

/-- Predpostavka trditve `katete` se da izpolniti (c = 3). -/
example : (0 : ℝ) ≤ 3 := by norm_num

/-- Razlaga 2, premisli 1 in Ustno vprašanje 2: če je c > a + b (a, b > 0), je s − c < 0, drugi faktorji so
pozitivni, zato je s(s − a)(s − b)(s − c) < 0 in ni realnega S z S² = s(s − a)(s − b)(s − c) (trikotnika ni). -/
theorem heron_ne_obstaja (a b c : ℝ) (ha : 0 < a) (hb : 0 < b) (h : a + b < c) :
    pol a b c - c < 0 ∧ pol a b c * (pol a b c - a) * (pol a b c - b) * (pol a b c - c) < 0 ∧
      ¬ ∃ S : ℝ, S ^ 2 = pol a b c * (pol a b c - a) * (pol a b c - b) * (pol a b c - c) := by
  unfold pol
  have h1 : (a + b + c) / 2 - c < 0 := by linarith
  have h2 : 0 < (a + b + c) / 2 * ((a + b + c) / 2 - a) * ((a + b + c) / 2 - b) := by
    have : 0 < (a + b + c) / 2 := by linarith
    have : 0 < (a + b + c) / 2 - a := by linarith
    have : 0 < (a + b + c) / 2 - b := by linarith
    positivity
  have h3 := mul_neg_of_pos_of_neg h2 h1
  refine ⟨h1, h3, ?_⟩
  rintro ⟨S, hS⟩
  nlinarith [sq_nonneg S]

/-- Predpostavke trditve `heron_ne_obstaja` se dajo izpolniti (2, 3, 6: 2 + 3 < 6). -/
example : (0 : ℝ) < 2 ∧ (0 : ℝ) < 3 ∧ (2 : ℝ) + 3 < 6 := by norm_num

/-- Premisli 1: za 2, 3, 6 je s = 5,5 in s − c = −0,5. -/
theorem premisli_236 : pol 2 3 6 = 11 / 2 ∧ pol 2 3 6 - 6 = -1 / 2 := by
  unfold pol; norm_num

/-- Ustno vprašanje 2: če je c = a + b, je S = 0 (točke so na premici). -/
theorem heron_izrojen (a b : ℝ) : heron a b (a + b) = 0 := by
  unfold heron pol
  rw [show (a + b + (a + b)) / 2 - (a + b) = 0 by ring, mul_zero, Real.sqrt_zero]

/-! ## 3., 4. Polmera -/

/-- Razlaga 3, Ustno vprašanje 1, Povzetek: S = ar/2 + br/2 + cr/2 = r·s, zato r = S/s (s ≠ 0). -/
theorem vcrtana (a b c r : ℝ) (hs : pol a b c ≠ 0) :
    a * r / 2 + b * r / 2 + c * r / 2 = r * pol a b c ∧
      r = (a * r / 2 + b * r / 2 + c * r / 2) / pol a b c := by
  refine ⟨by unfold pol; ring, ?_⟩
  rw [eq_div_iff hs]; unfold pol; ring

/-- Predpostavka trditve `vcrtana` se da izpolniti (3, 4, 5: s = 6). -/
example : pol 3 4 5 ≠ 0 := by unfold pol; norm_num

/-- Razlaga 4 in Povzetek (R = abc/(4S)): za trikotnik A = 0, B = c > 0, C = x + yi (y ≠ 0) in točko O, enako
oddaljeno R od A, B, C, je R = a·b·c/(4S) s S = c·|y|/2, a = |BC|, b = |AC|. -/
theorem ocrtana (c x y R : ℝ) (O : ℂ) (hc : 0 < c) (hy : y ≠ 0) (h1 : dist O 0 = R) (h2 : dist O c = R)
    (h3 : dist O ⟨x, y⟩ = R) :
    R = dist (c : ℂ) ⟨x, y⟩ * dist (0 : ℂ) ⟨x, y⟩ * c / (4 * (c * |y| / 2)) := by
  have hR : 0 ≤ R := h1 ▸ dist_nonneg
  have e1 := dist_c_sq O 0
  have e2 := dist_c_sq O c
  have e3 := dist_c_sq O ⟨x, y⟩
  have ha := dist_c_sq (c : ℂ) ⟨x, y⟩
  have hb := dist_c_sq (0 : ℂ) ⟨x, y⟩
  rw [h1] at e1; rw [h2] at e2; rw [h3] at e3
  simp only [Complex.ofReal_re, Complex.ofReal_im, Complex.zero_re, Complex.zero_im] at e1 e2 e3 ha hb
  set p := O.re; set q := O.im
  set a := dist (c : ℂ) ⟨x, y⟩; set b := dist (0 : ℂ) ⟨x, y⟩
  have ha0 : 0 ≤ a := dist_nonneg
  have hb0 : 0 ≤ b := dist_nonneg
  have hp : p = c / 2 := by
    have : c * (c - 2 * p) = 0 := by nlinarith
    rcases mul_eq_zero.mp this with h | h
    · exact absurd h hc.ne'
    · linarith
  have hq : 2 * q * y = x ^ 2 + y ^ 2 - c * x := by rw [hp] at e1 e3; nlinarith
  have key : 4 * y ^ 2 * R ^ 2 = a ^ 2 * b ^ 2 := by
    rw [ha, hb, e1, hp]
    have : 4 * y ^ 2 * ((c / 2 - 0) ^ 2 + (q - 0) ^ 2) = c ^ 2 * y ^ 2 + (2 * q * y) ^ 2 := by ring
    rw [this, hq]; ring
  have hyabs : 0 < |y| := abs_pos.mpr hy
  have hden : 4 * (c * |y| / 2) ≠ 0 := by positivity
  rw [eq_div_iff hden]
  have hsq : (R * (4 * (c * |y| / 2))) ^ 2 = (a * b * c) ^ 2 := by
    have : (R * (4 * (c * |y| / 2))) ^ 2 = c ^ 2 * (4 * y ^ 2 * R ^ 2) := by
      rw [show (R * (4 * (c * |y| / 2))) ^ 2 = 4 * c ^ 2 * |y| ^ 2 * R ^ 2 by ring, sq_abs]; ring
    rw [this, key]; ring
  have h0 : 0 ≤ R * (4 * (c * |y| / 2)) := by positivity
  have h0' : 0 ≤ a * b * c := by positivity
  exact (sq_eq_sq₀ h0 h0').mp hsq

/-- Predpostavke trditve `ocrtana` se dajo izpolniti: trikotnik 0, 4, 4i ima središče O = 2 + 2i, R = √8. -/
example : dist (⟨2, 2⟩ : ℂ) 0 = √8 ∧ dist (⟨2, 2⟩ : ℂ) (4 : ℝ) = √8 ∧ dist (⟨2, 2⟩ : ℂ) ⟨0, 4⟩ = √8 ∧
    (0 : ℝ) < 4 ∧ (4 : ℝ) ≠ 0 := by
  refine ⟨?_, ?_, ?_, by norm_num, by norm_num⟩ <;> rw [Complex.dist_eq_re_im] <;> norm_num

/-- Razlaga 4, premisli 2, Ustno vprašanje 3: vsaka stranica je tetiva očrtane krožnice, zato |AB| ≤ 2R; če je
|AB| = 2R, je O razpolovišče AB in kot pri C je pravi (Tales). -/
theorem tetiva {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] {A B C O : P} {R : ℝ} (hA : dist O A = R) (hB : dist O B = R) (hC : dist O C = R) :
    dist A B ≤ 2 * R ∧ (dist A B = 2 * R → ∠ A C B = π / 2) := by
  refine ⟨by linarith [dist_triangle A O B, dist_comm A O], fun h => ?_⟩
  have hm : O = midpoint ℝ A B := by
    apply eq_midpoint_of_dist_eq_half
    · rw [dist_comm, hA, h]; ring
    · rw [hB, h]; ring
  rw [EuclideanGeometry.Sphere.angle_eq_pi_div_two_iff_mem_sphere_ofDiameter, EuclideanGeometry.mem_sphere]
  show dist C (midpoint ℝ A B) = dist A B / 2
  rw [← hm, dist_comm, hC, h]; ring

/-- Predpostavke trditve `tetiva` se dajo izpolniti (A = −1, B = 1, C = i, O = 0, R = 1 v ℂ). -/
example : dist (0 : ℂ) (-1) = 1 ∧ dist (0 : ℂ) 1 = 1 ∧ dist (0 : ℂ) Complex.I = 1 := by
  simp [Complex.dist_eq]

/-- Pogoste napake in kviz 2 (merilo): če vse stranice pomnožimo s k (merilo, k > 0; enakost velja za vsak
realni k), se ploščina pomnoži s k². -/
theorem merilo (a b c k : ℝ) : heron (k * a) (k * b) (k * c) = k ^ 2 * heron a b c := by
  unfold heron pol
  have : (k * a + k * b + k * c) / 2 * ((k * a + k * b + k * c) / 2 - k * a) *
      ((k * a + k * b + k * c) / 2 - k * b) * ((k * a + k * b + k * c) / 2 - k * c) =
      (k ^ 2) ^ 2 * ((a + b + c) / 2 * ((a + b + c) / 2 - a) * ((a + b + c) / 2 - b) * ((a + b + c) / 2 - c)) := by
    ring
  rw [this, Real.sqrt_mul (by positivity), sqrt_kv (by positivity)]

/-- Pomožno: kot pri C je oster, če je c² < a² + b² (kosinusni izrek), in top, če je c² > a² + b². -/
theorem kot_iz_stranic {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] {A B C : P} (hA : A ≠ C) (hB : B ≠ C) :
    (dist A B ^ 2 < dist C A ^ 2 + dist C B ^ 2 → ∠ A C B < π / 2) ∧
      (dist C A ^ 2 + dist C B ^ 2 < dist A B ^ 2 → π / 2 < ∠ A C B) := by
  have l := EuclideanGeometry.law_cos A C B
  have ha : 0 < dist A C := dist_pos.mpr hA
  have hb : 0 < dist B C := dist_pos.mpr hB
  rw [dist_comm C A, dist_comm C B]
  constructor
  · intro h
    by_contra hc
    replace hc := not_lt.mp hc
    have : Real.cos (∠ A C B) ≤ 0 :=
      Real.cos_nonpos_of_pi_div_two_le_of_le hc (by linarith [EuclideanGeometry.angle_le_pi A C B, pi_pos])
    nlinarith [mul_pos ha hb]
  · intro h
    by_contra hc
    replace hc := not_lt.mp hc
    have : 0 ≤ Real.cos (∠ A C B) :=
      Real.cos_nonneg_of_mem_Icc ⟨by linarith [EuclideanGeometry.angle_nonneg A C B, pi_pos], hc⟩
    nlinarith [mul_pos ha hb]

/-- Predpostavke trditve `kot_iz_stranic` se dajo izpolniti (A = 1, B = i, C = 0 v ℂ). -/
example : (1 : ℂ) ≠ 0 ∧ Complex.I ≠ 0 := ⟨one_ne_zero, Complex.I_ne_zero⟩

/-! ## Računi iz lekcije -/

/-- Razlaga 1: višina v = √(5² − 3²) = √16 = 4, ploščina 6·4/2 = 12, bližnjica 5·5/2 = 12,5 ≠ 12. -/
theorem razlaga1 : √((5 : ℝ) ^ 2 - 3 ^ 2) = √16 ∧ √(16 : ℝ) = 4 ∧ (6 : ℝ) * 4 / 2 = 12 ∧ (5 : ℝ) * 5 / 2 = 25 / 2 ∧
    (25 / 2 : ℝ) ≠ 12 := by
  refine ⟨by norm_num, ?_, by norm_num, by norm_num, by norm_num⟩
  rw [show (16 : ℝ) = 4 ^ 2 by norm_num, sqrt_kv (by norm_num)]

/-- Razlaga 2 in `RACUN`: za 5, 5, 6 je s = 8, faktorji 8, 3, 3, 2, S = √(8·3·3·2) = √144 = 12. -/
theorem razlaga2 : pol 5 5 6 = 8 ∧ heron 5 5 6 = √(8 * 3 * 3 * 2) ∧ √((8 : ℝ) * 3 * 3 * 2) = √144 ∧
    √(144 : ℝ) = 12 := by
  refine ⟨by unfold pol; norm_num, by unfold heron pol; norm_num, by norm_num, ?_⟩
  rw [show (144 : ℝ) = 12 ^ 2 by norm_num, sqrt_kv (by norm_num)]

/-- Razlaga 4 in `RACUN`: R = 5·5·6/(4·12) = 150/48 = 3,125 ≈ 3,1. -/
theorem razlaga4 : (5 : ℝ) * 5 * 6 / (4 * 12) = 150 / 48 ∧ (150 / 48 : ℝ) = 3125 / 1000 ∧
    |(3125 / 1000 : ℝ) - 31 / 10| < 5 / 100 := by
  refine ⟨by norm_num, by norm_num, ?_⟩; rw [abs_lt]; norm_num

/-- Razlaga 5 in `RACUN` (3, 4, 5): s = 6, S = √(6·3·2·1) = √36 = 6 = 3·4/2, r = 6/6 = 1,
R = 3·4·5/(4·6) = 2,5 = 5/2. -/
theorem razlaga5 : pol 3 4 5 = 6 ∧ heron 3 4 5 = √(6 * 3 * 2 * 1) ∧ √((6 : ℝ) * 3 * 2 * 1) = √36 ∧ √(36 : ℝ) = 6 ∧
    (3 : ℝ) * 4 / 2 = 6 ∧ (6 : ℝ) / 6 = 1 ∧ (3 : ℝ) * 4 * 5 / (4 * 6) = 25 / 10 ∧ (25 / 10 : ℝ) = 5 / 2 := by
  refine ⟨by unfold pol; norm_num, by unfold heron pol; norm_num, by norm_num, ?_, by norm_num, by norm_num,
    by norm_num, by norm_num⟩
  rw [show (36 : ℝ) = 6 ^ 2 by norm_num, sqrt_kv (by norm_num)]

/-- Primer 1 in `RACUN`: 11, 13, 20: s = 22, razlike 11, 9, 2, S = √(22·11·9·2) = √4356 = 66. -/
theorem primer1 : pol 11 13 20 = 22 ∧ (22 : ℝ) - 11 = 11 ∧ (22 : ℝ) - 13 = 9 ∧ (22 : ℝ) - 20 = 2 ∧
    heron 11 13 20 = √(22 * 11 * 9 * 2) ∧ √((22 : ℝ) * 11 * 9 * 2) = √4356 ∧ √(4356 : ℝ) = 66 := by
  refine ⟨by unfold pol; norm_num, by norm_num, by norm_num, by norm_num, by unfold heron pol; norm_num,
    by norm_num, ?_⟩
  rw [show (4356 : ℝ) = 66 ^ 2 by norm_num, sqrt_kv (by norm_num)]

/-- Primer 2 in `RACUN`: 10, 17, 21: s = 24, S = √(24·14·7·3) = √7056 = 84, R = 10·17·21/(4·84) = 3570/336 =
10,625 ≈ 10,6, r = 84/24 = 3,5; 21² = 441 > 10² + 17² = 389 (kot nasproti c je top, `kot_iz_stranic`). -/
theorem primer2 : pol 10 17 21 = 24 ∧ heron 10 17 21 = √(24 * 14 * 7 * 3) ∧ √((24 : ℝ) * 14 * 7 * 3) = √7056 ∧
    √(7056 : ℝ) = 84 ∧ (10 : ℝ) * 17 * 21 / (4 * 84) = 3570 / 336 ∧ (3570 / 336 : ℝ) = 10625 / 1000 ∧
    |(10625 / 1000 : ℝ) - 106 / 10| < 5 / 100 ∧ (84 : ℝ) / 24 = 35 / 10 ∧ (21 : ℝ) ^ 2 = 441 ∧
    (10 : ℝ) ^ 2 + 17 ^ 2 = 389 ∧ (389 : ℝ) < 441 := by
  refine ⟨by unfold pol; norm_num, by unfold heron pol; norm_num, by norm_num, ?_, by norm_num, by norm_num, ?_,
    by norm_num, by norm_num, by norm_num, by norm_num⟩
  · rw [show (7056 : ℝ) = 84 ^ 2 by norm_num, sqrt_kv (by norm_num)]
  · rw [abs_lt]; norm_num

/-- Primer 3 in `RACUN`: 9, 10, 17 cm pri merilu 1 : 1000 so 90, 100, 170 m; s = 180, razlike 90, 80, 10,
S = √(180·90·80·10) = √12960000 = 3600 m² = 0,36 ha; kontrola: na načrtu s = 18, S = √(18·9·8·1) = 36 cm²,
36·100 = 3600; r = 3600/180 = 20 m. -/
theorem primer3 : (9 : ℝ) * 10 = 90 ∧ (10 : ℝ) * 10 = 100 ∧ (17 : ℝ) * 10 = 170 ∧ pol 90 100 170 = 180 ∧
    (180 : ℝ) - 90 = 90 ∧ (180 : ℝ) - 100 = 80 ∧ (180 : ℝ) - 170 = 10 ∧
    heron 90 100 170 = √(180 * 90 * 80 * 10) ∧ √((180 : ℝ) * 90 * 80 * 10) = √12960000 ∧
    √(12960000 : ℝ) = 3600 ∧ (3600 : ℝ) / 10000 = 36 / 100 ∧ pol 9 10 17 = 18 ∧
    heron 9 10 17 = √(18 * 9 * 8 * 1) ∧ √((18 : ℝ) * 9 * 8 * 1) = 36 ∧ (36 : ℝ) * 100 = 3600 ∧
    (3600 : ℝ) / 180 = 20 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by unfold pol; norm_num, by norm_num, by norm_num, by norm_num,
    by unfold heron pol; norm_num, by norm_num, ?_, by norm_num, by unfold pol; norm_num,
    by unfold heron pol; norm_num, ?_, by norm_num, by norm_num⟩
  · rw [show (12960000 : ℝ) = 3600 ^ 2 by norm_num, sqrt_kv (by norm_num)]
  · rw [show (18 : ℝ) * 9 * 8 * 1 = 36 ^ 2 by norm_num, sqrt_kv (by norm_num)]

/-- Primer 3 (merilo): stranice v naravi so 1000-krat daljše, ploščina 1000²-krat večja: 36 cm² na načrtu je
36·1000² cm² = 3600 m² (kot `merilo` s k = 1000). -/
theorem primer3_merilo : heron (1000 * 9) (1000 * 10) (1000 * 17) = 1000 ^ 2 * heron 9 10 17 :=
  merilo 9 10 17 1000

/-- Primer 4 (premisli) in `RACUN`: 5, 12, 13: s = 15, S = √(15·10·3·2) = √900 = 30, r = 30/15 = 2,
R = 5·12·13/(4·30) = 6,5 = 13/2; 5² + 12² = 13². -/
theorem primer4 : pol 5 12 13 = 15 ∧ heron 5 12 13 = √(15 * 10 * 3 * 2) ∧ √((15 : ℝ) * 10 * 3 * 2) = √900 ∧
    √(900 : ℝ) = 30 ∧ (30 : ℝ) / 15 = 2 ∧ (5 : ℝ) * 12 * 13 / (4 * 30) = 65 / 10 ∧ (65 / 10 : ℝ) = 13 / 2 ∧
    (5 : ℝ) ^ 2 + 12 ^ 2 = 13 ^ 2 := by
  refine ⟨by unfold pol; norm_num, by unfold heron pol; norm_num, by norm_num, ?_, by norm_num, by norm_num,
    by norm_num, by norm_num⟩
  rw [show (900 : ℝ) = 30 ^ 2 by norm_num, sqrt_kv (by norm_num)]

/-- Pogoste napake: z obsegom namesto polobsega pri 3, 4, 5 dobimo √(12·9·8·7) = √6048 ≈ 77,8 ≠ 6; S/o je
polovica r = S/s; produkt pri 5, 5, 6 je 144 = S², ploščina pa 12. -/
theorem napake : |√((12 : ℝ) * 9 * 8 * 7) - 778 / 10| < 5 / 100 ∧ (∀ S s : ℝ, S / (2 * s) = (S / s) / 2) ∧
    pol 5 5 6 * (pol 5 5 6 - 5) * (pol 5 5 6 - 5) * (pol 5 5 6 - 6) = 144 ∧ heron 5 5 6 = 12 := by
  refine ⟨?_, fun S s => by ring, by unfold pol; norm_num, ?_⟩
  · rw [abs_lt]; constructor
    · rw [lt_sub_iff_add_lt, Real.lt_sqrt (by norm_num)]; norm_num
    · rw [sub_lt_iff_lt_add, Real.sqrt_lt' (by norm_num)]; norm_num
  · unfold heron pol; rw [show ((5 : ℝ) + 5 + 6) / 2 * ((5 + 5 + 6) / 2 - 5) * ((5 + 5 + 6) / 2 - 5) *
      ((5 + 5 + 6) / 2 - 6) = 12 ^ 2 by norm_num, sqrt_kv (by norm_num)]

/-- Naloga 1 in `RACUN`: 25, 29, 6: s = 30, razlike 5, 1, 24, S = √(30·5·1·24) = √3600 = 60, v_c = 2S/c =
2·60/6 = 20 (in to je edina rešitev S = c·v_c/2). -/
theorem naloga1 : pol 25 29 6 = 30 ∧ (30 : ℝ) - 25 = 5 ∧ (30 : ℝ) - 29 = 1 ∧ (30 : ℝ) - 6 = 24 ∧
    heron 25 29 6 = √(30 * 5 * 1 * 24) ∧ √((30 : ℝ) * 5 * 1 * 24) = √3600 ∧ √(3600 : ℝ) = 60 ∧
    (2 : ℝ) * 60 / 6 = 20 ∧ ∀ v : ℝ, 60 = 6 * v / 2 ↔ v = 20 := by
  refine ⟨by unfold pol; norm_num, by norm_num, by norm_num, by norm_num, by unfold heron pol; norm_num,
    by norm_num, ?_, by norm_num, fun v => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩⟩
  rw [show (3600 : ℝ) = 60 ^ 2 by norm_num, sqrt_kv (by norm_num)]

/-- Pomožno: meje za √50,5856. -/
theorem meje_S : (7112355 / 1000000 : ℝ) < √(505856 / 10000) ∧ √(505856 / 10000) < 7112356 / 1000000 := by
  constructor
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num

/-- Naloga 2 a), b), c) in `RACUN`: s = 6,4, razlike 3,2, 1,9, 1,3; produkt 50,5856; S = √50,5856 ≈ 7,1124 ≈ 7,11;
r = S/6,4 ≈ 1,1113 ≈ 1,11; R = 3,2·4,5·5,1/(4S) = 73,44/(4S) ≈ 73,44/28,4494 ≈ 2,5814 ≈ 2,58. -/
theorem naloga2 :
    pol (32 / 10) (45 / 10) (51 / 10) = 64 / 10 ∧ (64 / 10 : ℝ) - 32 / 10 = 32 / 10 ∧
    (64 / 10 : ℝ) - 45 / 10 = 19 / 10 ∧ (64 / 10 : ℝ) - 51 / 10 = 13 / 10 ∧
    (64 / 10 : ℝ) * (32 / 10) * (19 / 10) * (13 / 10) = 505856 / 10000 ∧
    heron (32 / 10) (45 / 10) (51 / 10) = √(505856 / 10000) ∧
    |√(505856 / 10000 : ℝ) - 71124 / 10000| < 5 / 100000 ∧ |√(505856 / 10000 : ℝ) - 711 / 100| < 5 / 1000 ∧
    |√(505856 / 10000 : ℝ) / (64 / 10) - 11113 / 10000| < 5 / 100000 ∧
    |√(505856 / 10000 : ℝ) / (64 / 10) - 111 / 100| < 5 / 1000 ∧
    (32 / 10 : ℝ) * (45 / 10) * (51 / 10) = 7344 / 100 ∧
    |4 * √(505856 / 10000 : ℝ) - 284494 / 10000| < 5 / 100000 ∧
    |(7344 / 100 : ℝ) / (4 * √(505856 / 10000)) - 25814 / 10000| < 5 / 100000 ∧
    |(7344 / 100 : ℝ) / (4 * √(505856 / 10000)) - 258 / 100| < 5 / 1000 := by
  obtain ⟨l, u⟩ := meje_S
  have hpos : 0 < √(505856 / 10000 : ℝ) := by linarith
  refine ⟨by unfold pol; norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by unfold heron pol; norm_num, ?_, ?_, ?_, ?_, by norm_num, ?_, ?_, ?_⟩
  · rw [abs_lt]; constructor <;> linarith
  · rw [abs_lt]; constructor <;> linarith
  · rw [abs_lt]; constructor
    · rw [lt_sub_iff_add_lt, lt_div_iff₀ (by norm_num)]; linarith
    · rw [sub_lt_iff_lt_add, div_lt_iff₀ (by norm_num)]; linarith
  · rw [abs_lt]; constructor
    · rw [lt_sub_iff_add_lt, lt_div_iff₀ (by norm_num)]; linarith
    · rw [sub_lt_iff_lt_add, div_lt_iff₀ (by norm_num)]; linarith
  · rw [abs_lt]; constructor <;> linarith
  · rw [abs_lt]; constructor
    · rw [lt_sub_iff_add_lt, lt_div_iff₀ (by positivity)]; nlinarith
    · rw [sub_lt_iff_lt_add, div_lt_iff₀ (by positivity)]; nlinarith
  · rw [abs_lt]; constructor
    · rw [lt_sub_iff_add_lt, lt_div_iff₀ (by positivity)]; nlinarith
    · rw [sub_lt_iff_lt_add, div_lt_iff₀ (by positivity)]; nlinarith

/-- Naloga 2 d) in `RACUN`: c² = 5,1² = 26,01 < a² + b² = 3,2² + 4,5² = 10,24 + 20,25 = 30,49 (kot γ je oster,
`kot_iz_stranic`). -/
theorem naloga2d : (51 / 10 : ℝ) ^ 2 = 2601 / 100 ∧ (32 / 10 : ℝ) ^ 2 + (45 / 10) ^ 2 = 1024 / 100 + 2025 / 100 ∧
    (1024 / 100 : ℝ) + 2025 / 100 = 3049 / 100 ∧ (2601 / 100 : ℝ) < 3049 / 100 := by norm_num

/-- Korak za korakom (13, 14, 15) in `RACUN`: s = 21, razlike 8, 7, 6, S = √(21·8·7·6) = 84, r = 84/21 = 4,
R = 13·14·15/(4·84) = 8,125; kontrola √(13² − 5²) = √(15² − 9²) = 12, 5 + 9 = 14, 14·12/2 = 84. -/
theorem korak_za_korakom : pol 13 14 15 = 21 ∧ (21 : ℝ) - 13 = 8 ∧ (21 : ℝ) - 14 = 7 ∧ (21 : ℝ) - 15 = 6 ∧
    heron 13 14 15 = 84 ∧ (84 : ℝ) / 21 = 4 ∧ (13 : ℝ) * 14 * 15 / (4 * 84) = 8125 / 1000 ∧
    √((13 : ℝ) ^ 2 - 5 ^ 2) = 12 ∧ √((15 : ℝ) ^ 2 - 9 ^ 2) = 12 ∧ (5 : ℝ) + 9 = 14 ∧ (14 : ℝ) * 12 / 2 = 84 := by
  refine ⟨by unfold pol; norm_num, by norm_num, by norm_num, by norm_num, ?_, by norm_num, by norm_num, ?_, ?_,
    by norm_num, by norm_num⟩
  · unfold heron pol
    rw [show ((13 : ℝ) + 14 + 15) / 2 * ((13 + 14 + 15) / 2 - 13) * ((13 + 14 + 15) / 2 - 14) *
      ((13 + 14 + 15) / 2 - 15) = 84 ^ 2 by norm_num, sqrt_kv (by norm_num)]
  · rw [show (13 : ℝ) ^ 2 - 5 ^ 2 = 12 ^ 2 by norm_num, sqrt_kv (by norm_num)]
  · rw [show (15 : ℝ) ^ 2 - 9 ^ 2 = 12 ^ 2 by norm_num, sqrt_kv (by norm_num)]

/-! ## Preveri se -/

/-- Preveri se 1: S = ab/2 ne velja za poljuben trikotnik (5, 5, 6: 12,5 ≠ 12 = Heron). -/
theorem kviz1 : (5 : ℝ) * 5 / 2 ≠ heron 5 5 6 := by
  rw [(napake).2.2.2]; norm_num

/-- Preveri se 2: podvojene stranice ⇒ ploščina 2² = 4-krat večja. Dokazana je ta enakost; da faktor ni 2, 8 ali 16
(16 = 2⁴ je pod korenom), sledi iz nje za vsak trikotnik s ploščino S ≠ 0 (ni zapisano posebej). -/
theorem kviz2 (a b c : ℝ) : heron (2 * a) (2 * b) (2 * c) = 4 * heron a b c := by
  rw [merilo a b c 2]; norm_num

/-- Preveri se 3 in `RACUN`: 7, 15, 20: o = 42, S = √(21·14·6·1) = √1764 = 42, napačno S/o = 1, pravilno
r = S/s = 42/21 = 2. -/
theorem kviz3 : (7 : ℝ) + 15 + 20 = 42 ∧ heron 7 15 20 = √(21 * 14 * 6 * 1) ∧ √((21 : ℝ) * 14 * 6 * 1) = √1764 ∧
    √(1764 : ℝ) = 42 ∧ (42 : ℝ) / 42 = 1 ∧ (42 : ℝ) / 21 = 2 := by
  refine ⟨by norm_num, by unfold heron pol; norm_num, by norm_num, ?_, by norm_num, by norm_num⟩
  rw [show (1764 : ℝ) = 42 ^ 2 by norm_num, sqrt_kv (by norm_num)]

/-- Preveri se 4 in `RACUN`: 10, 10, 12: s = 16, S = √(16·6·6·4) = 48, R = 10·10·12/(4·48) = 1200/192 = 6,25;
r = 48/16 = 3, polovica najdaljše 6, z 2S v imenovalcu 12,5. -/
theorem kviz4 : pol 10 10 12 = 16 ∧ heron 10 10 12 = √(16 * 6 * 6 * 4) ∧ √((16 : ℝ) * 6 * 6 * 4) = 48 ∧
    (10 : ℝ) * 10 * 12 / (4 * 48) = 1200 / 192 ∧ (1200 / 192 : ℝ) = 625 / 100 ∧ (48 : ℝ) / 16 = 3 ∧
    (12 : ℝ) / 2 = 6 ∧ (10 : ℝ) * 10 * 12 / (2 * 48) = 125 / 10 := by
  refine ⟨by unfold pol; norm_num, by unfold heron pol; norm_num, ?_, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num⟩
  rw [show (16 : ℝ) * 6 * 6 * 4 = 48 ^ 2 by norm_num, sqrt_kv (by norm_num)]

/-- Preveri se 4 (geometrijsko): trikotnik A = 0, B = 12, C = 6 + 8i ima kraka 10 in ploščino 12·8/2 = 48 = Heron. -/
theorem kviz4_geo : dist (12 : ℂ) ⟨6, 8⟩ = 10 ∧ dist (0 : ℂ) ⟨6, 8⟩ = 10 ∧ (12 : ℝ) * |8| / 2 = 48 := by
  refine ⟨?_, ?_, by norm_num⟩ <;> rw [Complex.dist_eq_re_im] <;> norm_num

end Evklid.Lekcije.MAT_SS_1.HeronovaFormulaTerPolmeraOcrtanegaInVcrtanegaKroga
