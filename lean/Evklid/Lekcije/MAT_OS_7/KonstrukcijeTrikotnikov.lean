/-
vir: content/lessons/MAT-OS-7/konstrukcije-trikotnikov.md
sha256: aae04b00a335a1b36e59c09aed21a621735f3ce55b99f6e079968ab7da1554bc
Model: splošne trditve so v evklidskem prostoru `P`, konkretni trikotniki v ravnini ℂ (z = x + yi). Oznake kot v
lekciji: a = |BC|, b = |CA|, c = |AB|, α = ∠ C A B (pri A), β = ∠ A B C, γ = ∠ B C A. Koti `∠` so neorientirani in
v radianih (θ° = θ·π/180: 30° = π/6, 45° = π/4, 60° = π/3, 75° = 5π/12, 90° = π/2); računi s stopinjami (vsota kotov,
β = 180° − α − γ) so s stopinjami kot števili. Skladnost je Mathlibova `≅` (enake vse razdalje med istoležnimi
oglišči). »Trikotnik« (nesploščen) je `¬ Collinear ℝ {A, B, C}`. Krožnica okoli A s polmerom b je množica točk z
dist A C = b. »≈ x« na eno decimalko je |vrednost − x| < 0,05.
Lean: kot ob izrojenem oglišču je v Mathlibu π/2, zato imajo izrek ksk in računi s koti pogoja A ≠ B oz.
nekolinearnost (pri ssk A ≠ B sledi iz |AC| < |BC|); √ negativnega števila je 0 (vse korenjene vrednosti so pozitivne).
Ni v Leanu: poskus s trakovi, stojala, oddajniki in zemljevidi kot zgodbe (dokazani so njihovi računi in trditve
o razdaljah); risbe in simulacija »Konstrukcije trikotnikov«; definicije (skladnost, istoležnost, oznake stranic)
kot poimenovanja; postopek načrtovanja (skica, analiza, opis, konstrukcija z ravnilom in šestilom, »pomožnih črt ne
briši«) in opisi korakov konstrukcij kot navodila: dokazano je, kar konstrukcija uporablja (presečišče krožnic,
kot 60° iz enakostraničnega trikotnika, 60 : 2 = 30, 90 : 2 = 45, sks/ksk), ne pa sam postopek z orodji (npr.
konstrukcija pravokotnice in simetrale kota); obrat pogoja za kote (da za vsaka α, β z α + β < 180° in vsako c > 0
trikotnik obstaja; zahtevno, še ni dokazano; dokazana je nujnost α + β < π); »izmeriš a ≈ 4,6, a ≈ 4,4, b ≈ 5,4,
a = 10« kot meritve (dokazane so s kosinusnim in sinusnim izrekom); »omrežje potrebuje še tretji oddajnik«
(Primer 1, opis); Iz vsakdanjega življenja (okvirji, mostovi, geodeti) kot opis, dokazani so izreki sss, sks, ksk;
razlage napačnih odgovorov v kvizih (dokazano je, da so napačne vrednosti res napačne); Pogoste napake kot opis
napak pri risanju (dokazani so pravilni računi in izreki, ki jih napake kršijo); poimenovanje izreka v Preveri se 1
(sks je dokazan).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.KonstrukcijeTrikotnikov

open Real EuclideanGeometry
open scoped Congruent ComplexConjugate

variable {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P] [NormedAddTorsor V P]

/-! ## Pomožno: koordinate v ℂ -/

/-- Pomožno: razdalja v ℂ iz koordinat. -/
theorem dist_c {z w : ℂ} {d : ℝ} (hd : 0 ≤ d) (h : (z.re - w.re) ^ 2 + (z.im - w.im) ^ 2 = d ^ 2) :
    dist z w = d := by
  rw [Complex.dist_eq_re_im, h, Real.sqrt_sq hd]

/-- Predpostavke trditve `dist_c` se dajo izpolniti (z = 3, w = 0, d = 3). -/
example : (0 : ℝ) ≤ 3 ∧ ((3 : ℂ).re - (0 : ℂ).re) ^ 2 + ((3 : ℂ).im - (0 : ℂ).im) ^ 2 = 3 ^ 2 := by
  constructor <;> simp

/-- Pomožno: kvadrat razdalje v ℂ iz koordinat. -/
theorem dist_c_sq (z w : ℂ) : dist z w ^ 2 = (z.re - w.re) ^ 2 + (z.im - w.im) ^ 2 := by
  rw [Complex.dist_eq_re_im, Real.sq_sqrt (by positivity)]

/-- Pomožno: kot med realnim r > 0 in z v ℂ je arccos (Re z / |z|). -/
theorem kot_os {r : ℝ} (hr : 0 < r) (z : ℂ) :
    InnerProductGeometry.angle (r : ℂ) z = Real.arccos (z.re / ‖z‖) := by
  unfold InnerProductGeometry.angle
  congr 1
  have hi : inner ℝ (r : ℂ) z = r * z.re := by simp [Complex.inner, mul_comm]
  rw [hi, Complex.norm_real, Real.norm_of_nonneg hr.le, mul_div_mul_left _ _ hr.ne']

/-- Predpostavka trditve `kot_os` se da izpolniti (r = 1). -/
example : (0 : ℝ) < 1 := one_pos

/-- Pomožno: točka t(cos θ + i sin θ) s t > 0 in 0 ≤ θ ≤ π oklepa z realnim r > 0 kot θ. -/
theorem kot_zarek {r t θ : ℝ} (hr : 0 < r) (ht : 0 < t) (h0 : 0 ≤ θ) (hπ : θ ≤ π) :
    InnerProductGeometry.angle (r : ℂ) ⟨t * cos θ, t * sin θ⟩ = θ := by
  rw [kot_os hr]
  have hn : ‖(⟨t * cos θ, t * sin θ⟩ : ℂ)‖ = t := by
    rw [Complex.norm_eq_sqrt_sq_add_sq]
    rw [show (t * cos θ) ^ 2 + (t * sin θ) ^ 2 = t ^ 2 by linear_combination t ^ 2 * sin_sq_add_cos_sq θ]
    exact Real.sqrt_sq ht.le
  rw [hn]
  show Real.arccos (t * cos θ / t) = θ
  rw [mul_div_cancel_left₀ _ ht.ne', Real.arccos_cos h0 hπ]

/-- Predpostavke trditve `kot_zarek` se dajo izpolniti (r = t = 1, θ = π/3). -/
example : (0 : ℝ) < 1 ∧ (0 : ℝ) < 1 ∧ 0 ≤ π / 3 ∧ π / 3 ≤ π :=
  ⟨one_pos, one_pos, by positivity, by linarith [pi_pos]⟩

/-- Pomožno (obstoj podatkov sks): za b, c > 0 in 0 ≤ θ ≤ π je v ℂ trikotnik A = 0, B = c,
C = b(cos θ + i sin θ) z |AB| = c, |AC| = b in ∠ B A C = θ. -/
theorem obstoj_sks {b c θ : ℝ} (hb : 0 < b) (hc : 0 < c) (h0 : 0 ≤ θ) (hπ : θ ≤ π) :
    dist (0 : ℂ) (c : ℂ) = c ∧ dist (0 : ℂ) ⟨b * cos θ, b * sin θ⟩ = b ∧
      ∠ (c : ℂ) 0 ⟨b * cos θ, b * sin θ⟩ = θ := by
  refine ⟨dist_c hc.le (by simp), dist_c hb.le ?_, ?_⟩
  · simp only [Complex.zero_re, Complex.zero_im]
    linear_combination b ^ 2 * sin_sq_add_cos_sq θ
  · simp only [EuclideanGeometry.angle, vsub_eq_sub, sub_zero]
    exact kot_zarek hc hb h0 hπ

/-- Predpostavke trditve `obstoj_sks` se dajo izpolniti (b = 4, c = 5, θ = π/3: Primer 2). -/
example : (0 : ℝ) < 4 ∧ (0 : ℝ) < 5 ∧ 0 ≤ π / 3 ∧ π / 3 ≤ π :=
  ⟨by norm_num, by norm_num, by positivity, by linarith [pi_pos]⟩

/-- Pomožno: trikotnik z A, B na realni osi (A ≠ B) in C zunaj nje (Im C ≠ 0) ni izrojen. -/
theorem nekolinearni_c {A B C : ℂ} (hA : A.im = 0) (hB : B.im = 0) (hAB : A ≠ B) (hC : C.im ≠ 0) :
    ¬ Collinear ℝ ({A, B, C} : Set ℂ) := by
  rw [collinear_iff_of_mem (p₀ := A) (by simp)]
  rintro ⟨v, hv⟩
  obtain ⟨r₁, h₁⟩ := hv B (by simp)
  obtain ⟨r₂, h₂⟩ := hv C (by simp)
  have i₁ := congrArg Complex.im h₁
  have i₂ := congrArg Complex.im h₂
  simp only [vadd_eq_add, Complex.add_im, Complex.real_smul, Complex.mul_im, Complex.ofReal_re,
    Complex.ofReal_im, zero_mul, add_zero, hA, hB] at i₁ i₂
  have hr : r₁ ≠ 0 := by
    rintro rfl
    apply hAB
    rw [h₁]; simp
  have hv0 : v.im = 0 := by
    rcases mul_eq_zero.mp i₁.symm with h | h
    · exact absurd h hr
    · exact h
  rw [hv0, mul_zero] at i₂
  exact hC i₂

/-- Predpostavke trditve `nekolinearni_c` se dajo izpolniti (A = 0, B = 1, C = i). -/
example : (0 : ℂ).im = 0 ∧ (1 : ℂ).im = 0 ∧ (0 : ℂ) ≠ 1 ∧ Complex.I.im ≠ 0 := by
  refine ⟨by simp, by simp, zero_ne_one, by simp⟩

/-- Pomožno: trikotnik 0, 1, i v ℂ ni izrojen. -/
theorem nekolinearni : ¬ Collinear ℝ ({(0 : ℂ), 1, Complex.I} : Set ℂ) :=
  nekolinearni_c (by simp) (by simp) zero_ne_one (by simp)

/-! ## 1.–3. Skladnost -/

/-- Razlaga 3 (sss), Zakaj se tega učimo (tog trikotnik), Iz vsakdanjega življenja: trikotnika, ki se ujemata v
vseh treh stranicah, sta skladna (tudi istoležni koti so enaki). -/
theorem sss {A B C A₁ B₁ C₁ : P} (h1 : dist A B = dist A₁ B₁) (h2 : dist B C = dist B₁ C₁)
    (h3 : dist C A = dist C₁ A₁) : (![A, B, C] ≅ ![A₁, B₁, C₁]) ∧ ∠ C A B = ∠ C₁ A₁ B₁ ∧
      ∠ A B C = ∠ A₁ B₁ C₁ ∧ ∠ B C A = ∠ B₁ C₁ A₁ := by
  have hc := side_side_side h1 h2 h3
  exact ⟨hc, by simpa using angle_eq_of_congruent hc 2 0 1, by simpa using angle_eq_of_congruent hc 0 1 2,
    by simpa using angle_eq_of_congruent hc 1 2 0⟩

/-- Razlaga 3 in 4 (sks), Primer 2, Preveri se 1: dve stranici b = |AC|, c = |AB| in kot α med njima (pri A) določajo
trikotnik: trikotnika z enakimi b, c, α sta skladna. -/
theorem sks {A B C A₁ B₁ C₁ : P} (h : ∠ B A C = ∠ B₁ A₁ C₁) (hc : dist A B = dist A₁ B₁)
    (hb : dist A C = dist A₁ C₁) : ![A, B, C] ≅ ![A₁, B₁, C₁] := by
  have k := side_angle_side h (by rwa [dist_comm B A, dist_comm B₁ A₁]) hb
  exact side_side_side hc (by simpa using k.dist_eq 0 2) (by rw [dist_comm, hb, dist_comm])

/-- Razlaga 3 (ksk), Primer 3: stranica c = |AB| in oba kota ob njej (α pri A, β pri B) določajo trikotnik
(trikotnik ni izrojen). -/
theorem ksk {A B C A₁ B₁ C₁ : P} (hn : ¬ Collinear ℝ ({A, B, C} : Set P)) (hα : ∠ C A B = ∠ C₁ A₁ B₁)
    (hc : dist A B = dist A₁ B₁) (hβ : ∠ A B C = ∠ A₁ B₁ C₁) : ![A, B, C] ≅ ![A₁, B₁, C₁] := by
  have hn' : ¬ Collinear ℝ ({C, A, B} : Set P) := by
    rwa [show ({C, A, B} : Set P) = {A, B, C} by ext; simp only [Set.mem_insert_iff, Set.mem_singleton_iff]; tauto]
  have k := angle_side_angle hn' hα hc hβ
  exact side_side_side hc (by simpa using k.dist_eq 2 0) (by simpa using k.dist_eq 0 1)

/-- Razlaga 3 in 4 (ssk): dve stranici a = |BC|, b = |AC| in kot α pri A, ki leži nasproti daljše od njiju (a > b),
določajo trikotnik (A ≠ B in A₁ ≠ B₁ sledita iz |AC| < |BC|). Dokaz: po kosinusnem izreku je c = |AB| pozitivna rešitev
c² − 2bc·cos α + (b² − a²) = 0; zmnožek rešitev je b² − a² < 0, zato je pozitivna rešitev ena sama. -/
theorem ssk {A B C A₁ B₁ C₁ : P} (h : ∠ C A B = ∠ C₁ A₁ B₁)
    (hb : dist A C = dist A₁ C₁) (ha : dist B C = dist B₁ C₁) (hdalj : dist A C < dist B C) :
    ![A, B, C] ≅ ![A₁, B₁, C₁] := by
  have hAB : A ≠ B := by rintro rfl; exact lt_irrefl _ hdalj
  have hAB₁ : A₁ ≠ B₁ := by rintro rfl; rw [hb, ha] at hdalj; exact lt_irrefl _ hdalj
  have l1 := EuclideanGeometry.law_cos C A B
  have l2 := EuclideanGeometry.law_cos C₁ A₁ B₁
  have hc : 0 < dist A B := dist_pos.mpr hAB
  have hc₁ : 0 < dist A₁ B₁ := dist_pos.mpr hAB₁
  rw [dist_comm C A, dist_comm B A, dist_comm C B] at l1
  rw [dist_comm C₁ A₁, dist_comm B₁ A₁, dist_comm C₁ B₁, ← h, ← hb, ← ha] at l2
  have hc_eq : dist A B = dist A₁ B₁ := by
    by_contra hne
    have e : (dist A B - dist A₁ B₁) *
        (dist A B + dist A₁ B₁ - 2 * dist A C * Real.cos (∠ C A B)) = 0 := by
      linear_combination l2 - l1
    have hsum : dist A B + dist A₁ B₁ - 2 * dist A C * Real.cos (∠ C A B) = 0 := by
      rcases mul_eq_zero.mp e with h0 | h0
      · exact absurd (by linarith) hne
      · exact h0
    have hprod : dist A B * dist A₁ B₁ = dist A C * dist A C - dist B C * dist B C := by
      linear_combination l1 + dist A B * hsum
    have : dist A C * dist A C - dist B C * dist B C < 0 := by
      nlinarith [dist_nonneg (x := A) (y := C)]
    nlinarith [mul_pos hc hc₁]
  exact side_side_side hc_eq ha (by rw [dist_comm C A, dist_comm C₁ A₁]; exact hb)

/-- Predpostavke trditev `sss`, `sks`, `ksk`, `ssk` se dajo izpolniti (isti trikotnik A = 0, B = 1, C = i dvakrat:
nekolinearen, |AC| = 1 < |BC| = √2). -/
example : ¬ Collinear ℝ ({(0 : ℂ), 1, Complex.I} : Set ℂ) ∧ (0 : ℂ) ≠ 1 ∧
    dist (0 : ℂ) Complex.I < dist (1 : ℂ) Complex.I := by
  refine ⟨nekolinearni, zero_ne_one, ?_⟩
  rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im]; simp
  rw [Real.lt_sqrt (by norm_num)]; norm_num

/-- Razlaga 1, premisli 1 (dve stranici nista dovolj): trikotnika z enakima b = |AC|, c = |AB|, a različnima kotoma
med njima, nista skladna. -/
theorem dve_stranici_ne {A B C A₁ B₁ C₁ : P} (_hc : dist A B = dist A₁ B₁)
    (_hb : dist A C = dist A₁ C₁) (h : ∠ B A C ≠ ∠ B₁ A₁ C₁) : ¬ (![A, B, C] ≅ ![A₁, B₁, C₁]) := by
  intro hc
  exact h (by simpa using angle_eq_of_congruent hc 1 0 2)

/-- Predpostavke trditve `dve_stranici_ne` se dajo izpolniti: b = 10, c = 8 pri kotih π/3 in π/2 (`obstoj_sks`). -/
example : dist (0 : ℂ) ((8 : ℝ) : ℂ) = dist (0 : ℂ) ((8 : ℝ) : ℂ) ∧
    dist (0 : ℂ) ⟨10 * cos (π / 3), 10 * sin (π / 3)⟩ = dist (0 : ℂ) ⟨10 * cos (π / 2), 10 * sin (π / 2)⟩ ∧
    ∠ ((8 : ℝ) : ℂ) 0 ⟨10 * cos (π / 3), 10 * sin (π / 3)⟩ ≠
    ∠ ((8 : ℝ) : ℂ) 0 ⟨10 * cos (π / 2), 10 * sin (π / 2)⟩ := by
  have k1 := obstoj_sks (b := 10) (c := 8) (θ := π / 3) (by norm_num) (by norm_num) (by positivity)
    (by linarith [pi_pos])
  have k2 := obstoj_sks (b := 10) (c := 8) (θ := π / 2) (by norm_num) (by norm_num) (by positivity)
    (by linarith [pi_pos])
  refine ⟨rfl, k1.2.1.trans k2.2.1.symm, ?_⟩
  rw [k1.2.2, k2.2.2]
  intro h; have := pi_pos; linarith

/-- Razlaga 2, Povzetek 1: skladna trikotnika (△ABC ≅ △A₁B₁C₁) imata enako dolge istoležne stranice in enako velike
istoležne kote. -/
theorem skladna {A B C A₁ B₁ C₁ : P} (h : ![A, B, C] ≅ ![A₁, B₁, C₁]) :
    dist B C = dist B₁ C₁ ∧ dist C A = dist C₁ A₁ ∧ dist A B = dist A₁ B₁ ∧ ∠ C A B = ∠ C₁ A₁ B₁ ∧
      ∠ A B C = ∠ A₁ B₁ C₁ ∧ ∠ B C A = ∠ B₁ C₁ A₁ := by
  refine ⟨by simpa using h.dist_eq 1 2, by simpa using h.dist_eq 2 0, by simpa using h.dist_eq 0 1,
    by simpa using angle_eq_of_congruent h 2 0 1, by simpa using angle_eq_of_congruent h 0 1 2,
    by simpa using angle_eq_of_congruent h 1 2 0⟩

/-- Predpostavka trditve `skladna` se da izpolniti (trikotnik 0, 1, i je skladen sam s sabo). -/
example : ![(0 : ℂ), 1, Complex.I] ≅ ![(0 : ℂ), 1, Complex.I] := Congruent.refl _

/-- Razlaga 1, Pogoste napake 5, Preveri se 3 (trije koti ne določajo trikotnika): trikotnik, raztegnjen s faktorjem
r > 0, r ≠ 1, ima enake vse tri kote, a drugačne stranice, zato ni skladen s prvotnim; koti 50°, 60°, 70° dajo
180°. -/
theorem kkk_ne (A B C : V) {r : ℝ} (hr : 0 < r) (hr1 : r ≠ 1) (hAB : A ≠ B) :
    ∠ (r • C) (r • A) (r • B) = ∠ C A B ∧ ∠ (r • A) (r • B) (r • C) = ∠ A B C ∧
      ∠ (r • B) (r • C) (r • A) = ∠ B C A ∧ dist (r • A) (r • B) ≠ dist A B ∧
      ¬ (![r • A, r • B, r • C] ≅ ![A, B, C]) ∧ (50 : ℝ) + 60 + 70 = 180 := by
  have hk : ∀ X Y Z : V, ∠ (r • X) (r • Y) (r • Z) = ∠ X Y Z := by
    intro X Y Z
    simp only [EuclideanGeometry.angle, vsub_eq_sub, ← smul_sub]
    rw [InnerProductGeometry.angle_smul_left_of_pos _ _ hr, InnerProductGeometry.angle_smul_right_of_pos _ _ hr]
  have hd : dist (r • A) (r • B) ≠ dist A B := by
    rw [dist_smul₀, Real.norm_of_nonneg hr.le]
    intro h
    have hd : 0 < dist A B := dist_pos.mpr hAB
    have : (r - 1) * dist A B = 0 := by linarith
    rcases mul_eq_zero.mp this with h0 | h0
    · exact hr1 (by linarith)
    · linarith
  refine ⟨hk C A B, hk A B C, hk B C A, hd, fun h => hd (by simpa using h.dist_eq 0 1), by norm_num⟩

/-- Predpostavke trditve `kkk_ne` se dajo izpolniti (r = 2, A = 0, B = 1 v ℂ). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℂ) ≠ 1 := ⟨by norm_num, by norm_num, zero_ne_one⟩

/-! ## 5. Kdaj trikotnik obstaja -/

/-- Pomožno: nekolinearnost ni odvisna od vrstnega reda točk. -/
theorem nk {A B C X Y Z : P} (h : ¬ Collinear ℝ ({A, B, C} : Set P))
    (e : ({X, Y, Z} : Set P) = {A, B, C}) : ¬ Collinear ℝ ({X, Y, Z} : Set P) := e ▸ h

/-- Predpostavki trditve `nk` se dajo izpolniti (nekolinearni 0, 1, i in ista množica). -/
example : ¬ Collinear ℝ ({(0 : ℂ), 1, Complex.I} : Set ℂ) ∧
    ({(0 : ℂ), 1, Complex.I} : Set ℂ) = {(0 : ℂ), 1, Complex.I} := ⟨nekolinearni, rfl⟩

/-- Razlaga 5 (trikotniška neenakost), Povzetek 4: v trikotniku je vsaka stranica krajša od vsote drugih dveh. -/
theorem trikotniska_neenakost {A B C : P} (h : ¬ Collinear ℝ ({A, B, C} : Set P)) :
    dist B C < dist C A + dist A B ∧ dist C A < dist B C + dist A B ∧ dist A B < dist B C + dist C A := by
  have hw : ∀ X Y Z : P, ¬ Collinear ℝ ({X, Y, Z} : Set P) → dist X Z < dist X Y + dist Y Z :=
    fun X Y Z hc => dist_lt_dist_add_dist_iff.mpr (fun hw => hc hw.collinear)
  have p1 := hw B A C (nk h (by ext; simp only [Set.mem_insert_iff, Set.mem_singleton_iff]; tauto))
  have p2 := hw C B A (nk h (by ext; simp only [Set.mem_insert_iff, Set.mem_singleton_iff]; tauto))
  have p3 := hw A C B (nk h (by ext; simp only [Set.mem_insert_iff, Set.mem_singleton_iff]; tauto))
  refine ⟨?_, ?_, ?_⟩
  · linarith [dist_comm B A, dist_comm A C, dist_comm C A]
  · linarith [dist_comm C B, dist_comm B A]
  · linarith [dist_comm C B, dist_comm A C, dist_comm C A]

/-- Razlaga 5, premisli 2: pri znanih stranicah a = |BC|, b = |CA| je tretja med |a − b| in a + b. -/
theorem meje_tretje {A B C : P} (h : ¬ Collinear ℝ ({A, B, C} : Set P)) :
    |dist B C - dist C A| < dist A B ∧ dist A B < dist B C + dist C A := by
  obtain ⟨h1, h2, h3⟩ := trikotniska_neenakost h
  exact ⟨abs_sub_lt_iff.mpr ⟨by linarith, by linarith⟩, h3⟩

/-- Predpostavka trditev `trikotniska_neenakost` in `meje_tretje` se da izpolniti (0, 1, i). -/
example : ¬ Collinear ℝ ({(0 : ℂ), 1, Complex.I} : Set ℂ) := nekolinearni

/-- Razlaga 5 (krožnici se ne sekata), Zakaj se tega učimo (3, 4, 8), Preveri se 5: če je |AB| > b + a, ni točke C,
ki bi bila od A oddaljena b in od B oddaljena a. -/
theorem kroznici_se_ne_sekata {A B : P} {a b : ℝ} (h : a + b < dist A B) :
    ¬ ∃ C : P, dist A C = b ∧ dist B C = a := by
  rintro ⟨C, h1, h2⟩
  have := dist_triangle A C B
  rw [dist_comm C B] at this
  linarith

/-- Predpostavka trditve `kroznici_se_ne_sekata` se da izpolniti (A = 0, B = 8, a = 4, b = 3 v ℂ). -/
example : (4 : ℝ) + 3 < dist (0 : ℂ) 8 := by
  rw [dist_c (show (0 : ℝ) ≤ 8 by norm_num) (by simp)]; norm_num

/-- Razlaga 5, premisli 2 (sploščen trikotnik): če je c = b + a (|AB| = |AC| + |CB|), C leži na daljici AB, točke so
na premici in trikotnika ni. -/
theorem splosceni {A B C : P} (h : dist A B = dist A C + dist C B) :
    Wbtw ℝ A C B ∧ Collinear ℝ ({A, C, B} : Set P) :=
  ⟨dist_add_dist_eq_iff.mp h.symm, (dist_add_dist_eq_iff.mp h.symm).collinear⟩

/-- Predpostavka trditve `splosceni` se da izpolniti (0, 3, 7 na premici: 7 = 3 + 4). -/
example : dist (0 : ℂ) 7 = dist (0 : ℂ) 3 + dist (3 : ℂ) 7 := by
  rw [dist_c (show (0 : ℝ) ≤ 7 by norm_num) (by simp), dist_c (show (0 : ℝ) ≤ 3 by norm_num) (by simp),
    dist_c (show (0 : ℝ) ≤ 4 by norm_num) (by simp; norm_num)]
  norm_num

/-- Razlaga 5 (obstoj): za a, b, c > 0, ki zadoščajo trikotniški neenakosti, v ℂ obstaja trikotnik z |BC| = a,
|CA| = b, |AB| = c, ki ni izrojen (A, B na realni osi, Im C > 0). -/
theorem obstoj_trikotnika (a b c : ℝ) (ha : 0 < a) (hb : 0 < b) (hc : 0 < c) (h1 : a < b + c) (h2 : b < a + c)
    (h3 : c < a + b) :
    ∃ A B C : ℂ, dist B C = a ∧ dist C A = b ∧ dist A B = c ∧ ¬ Collinear ℝ ({A, B, C} : Set ℂ) := by
  set x := (b ^ 2 + c ^ 2 - a ^ 2) / (2 * c) with hx
  have hpos : 0 < b ^ 2 - x ^ 2 := by
    have key : 4 * c ^ 2 * (b ^ 2 - x ^ 2) = (a ^ 2 - (b - c) ^ 2) * ((b + c) ^ 2 - a ^ 2) := by
      rw [hx]; field_simp; ring
    have q1 : 0 < a - (b - c) := by linarith
    have q2 : 0 < a + (b - c) := by linarith
    have q3 : 0 < b + c - a := by linarith
    have q4 : 0 < b + c + a := by linarith
    have k1 : 0 < a ^ 2 - (b - c) ^ 2 := by nlinarith [mul_pos q1 q2]
    have k2 : 0 < (b + c) ^ 2 - a ^ 2 := by nlinarith [mul_pos q3 q4]
    have : 0 < 4 * c ^ 2 * (b ^ 2 - x ^ 2) := by rw [key]; positivity
    have hc2 : 0 < 4 * c ^ 2 := by positivity
    exact pos_of_mul_pos_right this hc2.le
  set y := √(b ^ 2 - x ^ 2) with hy
  have hy0 : 0 < y := Real.sqrt_pos.mpr hpos
  have hy2 : y ^ 2 = b ^ 2 - x ^ 2 := Real.sq_sqrt hpos.le
  refine ⟨0, c, ⟨x, y⟩, ?_, ?_, ?_, nekolinearni_c (by simp) (by simp) ?_ hy0.ne'⟩
  · exact dist_c ha.le (by simp; rw [hy2, hx]; field_simp; ring)
  · exact dist_c hb.le (by simp; rw [hy2]; ring)
  · exact dist_c hc.le (by simp)
  · intro h0
    have := congrArg Complex.re h0
    simp at this
    linarith

/-- Predpostavke trditve `obstoj_trikotnika` se dajo izpolniti (a = 5, b = 4, c = 6: Primer 1). -/
example : (0 : ℝ) < 5 ∧ (0 : ℝ) < 4 ∧ (0 : ℝ) < 6 ∧ (5 : ℝ) < 4 + 6 ∧ (4 : ℝ) < 5 + 6 ∧ (6 : ℝ) < 5 + 4 := by
  norm_num

/-- Razlaga 1 in 6, Povzetek 5: vsota notranjih kotov je π (180°), zato je β = π − α − γ. -/
theorem vsota_kotov {A B C : P} (h : B ≠ A) :
    ∠ C A B + ∠ A B C + ∠ B C A = π ∧ ∠ A B C = π - ∠ C A B - ∠ B C A := by
  have := EuclideanGeometry.angle_add_angle_add_angle_eq_pi C h
  exact ⟨by linarith, by linarith⟩

/-- Predpostavka trditve `vsota_kotov` se da izpolniti (B = 1 ≠ A = 0 v ℂ). -/
example : (1 : ℂ) ≠ 0 := one_ne_zero

/-- Razlaga 5, Povzetek 4 (pogoj za kote): v trikotniku dva kota skupaj merita manj kot π (180°). -/
theorem dva_kota {A B C : P} (h : ¬ Collinear ℝ ({A, B, C} : Set P)) : ∠ C A B + ∠ A B C < π := by
  have hBA : B ≠ A := (ne₁₂_of_not_collinear h).symm
  have hs := (vsota_kotov (C := C) hBA).1
  have hγ : ∠ B C A ≠ 0 := by
    intro h0
    exact nk h (by ext; simp only [Set.mem_insert_iff, Set.mem_singleton_iff]; tauto)
      (collinear_of_angle_eq_zero h0)
  have := EuclideanGeometry.angle_nonneg B C A
  have : 0 < ∠ B C A := lt_of_le_of_ne this (Ne.symm hγ)
  linarith

/-- Predpostavka trditve `dva_kota` se da izpolniti (0, 1, i). -/
example : ¬ Collinear ℝ ({(0 : ℂ), 1, Complex.I} : Set ℂ) := nekolinearni

/-! ## 8. Koti s šestilom -/

/-- Razlaga 8, Primer 2 korak 3: kot enakostraničnega trikotnika (teme V, T in presečišče lokov S z
|VT| = |VS| = |TS|) meri π/3 (60°). -/
theorem kot60 {Vv T S : P} (hT : T ≠ Vv) (h1 : dist Vv T = dist Vv S) (h2 : dist T S = dist T Vv) :
    ∠ T Vv S = π / 3 := by
  have e1 := EuclideanGeometry.angle_eq_angle_of_dist_eq h1
  have e2 := EuclideanGeometry.angle_eq_angle_of_dist_eq h2
  have hs := EuclideanGeometry.angle_add_angle_add_angle_eq_pi S hT
  rw [EuclideanGeometry.angle_comm T S Vv] at e2
  linarith [EuclideanGeometry.angle_comm Vv S T, EuclideanGeometry.angle_comm S T Vv,
    EuclideanGeometry.angle_comm T Vv S, EuclideanGeometry.angle_comm S Vv T]

/-- Predpostavke trditve `kot60` se dajo izpolniti: V = 0, T = 2, S = 1 + √3·i v ℂ. -/
example : (2 : ℂ) ≠ 0 ∧ dist (0 : ℂ) 2 = dist (0 : ℂ) ⟨1, √3⟩ ∧ dist (2 : ℂ) ⟨1, √3⟩ = dist (2 : ℂ) 0 := by
  have h3 : (√3 : ℝ) ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have e1 : dist (0 : ℂ) 2 = 2 := dist_c (by norm_num) (by simp)
  have e2 : dist (0 : ℂ) ⟨1, √3⟩ = 2 := dist_c (by norm_num) (by simp; norm_num [h3])
  have e3 : dist (2 : ℂ) ⟨1, √3⟩ = 2 := dist_c (by norm_num) (by simp; norm_num [h3])
  have e4 : dist (2 : ℂ) 0 = 2 := dist_c (by norm_num) (by simp)
  exact ⟨two_ne_zero, e1.trans e2.symm, e3.trans e4.symm⟩

/-- Razlaga 8, Primer 3 korak 3: z razpolavljanjem 60 : 2 = 30 in 90 : 2 = 45 (v radianih (π/3)/2 = π/6,
(π/2)/2 = π/4). -/
theorem razpolavljanje : (60 : ℝ) / 2 = 30 ∧ (90 : ℝ) / 2 = 45 ∧ π / 3 / 2 = π / 6 ∧ π / 2 / 2 = π / 4 := by
  refine ⟨by norm_num, by norm_num, by ring, by ring⟩

/-! ## Rešeni primeri -/

/-- Primer 1, korak 1 in `RACUN`: najdaljša je c = 6, a + b = 5 + 4 = 9 > 6, trikotnik obstaja. -/
theorem primer1_obstoj : (5 : ℝ) + 4 = 9 ∧ (9 : ℝ) > 6 ∧ (5 : ℝ) < 4 + 6 ∧ (4 : ℝ) < 5 + 6 := by norm_num

/-- Primer 1, korak 2–6 (vse rešitve): pri A = 0, B = 6 so točke C, oddaljene 4 od A in 5 od B, natanko dve:
C = 9/4 ± (5√7/4)·i (zrcalni glede na AB; 9/4 = 2,25, 5√7/4 ≈ 3,31 kot na risbi). -/
theorem primer1 (z : ℂ) :
    (dist z 0 = 4 ∧ dist z 6 = 5) ↔ (z = ⟨9 / 4, 5 * √7 / 4⟩ ∨ z = ⟨9 / 4, -(5 * √7 / 4)⟩) := by
  have h7 : (√7 : ℝ) ^ 2 = 7 := Real.sq_sqrt (by norm_num)
  constructor
  · rintro ⟨h1, h2⟩
    have e1 := dist_c_sq z 0
    have e2 := dist_c_sq z 6
    rw [h1] at e1
    rw [h2] at e2
    simp only [Complex.zero_re, Complex.zero_im, sub_zero] at e1
    simp only [Complex.re_ofNat, Complex.im_ofNat, sub_zero] at e2
    have hre : z.re = 9 / 4 := by nlinarith
    have him : z.im ^ 2 = (5 * √7 / 4) ^ 2 := by
      rw [hre] at e1
      nlinarith
    rcases sq_eq_sq_iff_eq_or_eq_neg.mp him with h | h
    · exact Or.inl (Complex.ext hre h)
    · exact Or.inr (Complex.ext hre h)
  · rintro (rfl | rfl)
    · exact ⟨dist_c (by norm_num) (by simp; nlinarith [h7]), dist_c (by norm_num) (by simp; nlinarith [h7])⟩
    · exact ⟨dist_c (by norm_num) (by simp; nlinarith [h7]), dist_c (by norm_num) (by simp; nlinarith [h7])⟩

/-- Primer 1, korak 5, Razlaga 7 (diskusija): trikotnik ABC in njegova zrcalna slika ABC' (A, B na realni osi,
C' = C̄) sta skladna (sss), zato podatki sss dajo en sam trikotnik. -/
theorem zrcalni (A B C : ℂ) (hA : A.im = 0) (hB : B.im = 0) : ![A, B, C] ≅ ![A, B, conj C] := by
  have key : ∀ w : ℂ, w.im = 0 → dist w C = dist w (conj C) := by
    intro w hw
    rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im]
    simp only [Complex.conj_re, Complex.conj_im, hw]
    ring_nf
  exact side_side_side rfl (key B hB) (by rw [dist_comm, key A hA, dist_comm])

/-- Predpostavke trditve `zrcalni` se dajo izpolniti (A = 0, B = 6). -/
example : (0 : ℂ).im = 0 ∧ (6 : ℂ).im = 0 := by simp

/-- Primer 2 (sks): v vsakem trikotniku z b = |AC| = 4, c = |AB| = 5 in α = ∠ B A C = π/3 (60°) je
a = |BC| = √(4² + 5² − 2 · 4 · 5 · cos 60°) = √21 (kosinusni izrek). -/
theorem primer2 {A B C : P} (hb : dist A C = 4) (hc : dist A B = 5) (hα : ∠ B A C = π / 3) :
    dist B C = √21 := by
  have l := EuclideanGeometry.law_cos B A C
  rw [dist_comm B A, dist_comm C A, hb, hc, hα, cos_pi_div_three] at l
  rw [← Real.sqrt_mul_self dist_nonneg, l]
  norm_num

/-- Predpostavke trditve `primer2` se dajo izpolniti (`obstoj_sks` z b = 4, c = 5, θ = π/3). -/
example : ∃ A B C : ℂ, dist A C = 4 ∧ dist A B = 5 ∧ ∠ B A C = π / 3 := by
  obtain ⟨h1, h2, h3⟩ := obstoj_sks (b := 4) (c := 5) (θ := π / 3) (by norm_num) (by norm_num) (by positivity)
    (by linarith [pi_pos])
  exact ⟨0, (5 : ℝ), ⟨4 * cos (π / 3), 4 * sin (π / 3)⟩, h2, h1, h3⟩

/-- Primer 2, korak 5 in `RACUN`: 4² + 5² − 2 · 4 · 5 · cos 60° = 21 in a = √21 ≈ 4,6. -/
theorem primer2_racun : (4 : ℝ) ^ 2 + 5 ^ 2 - 2 * 4 * 5 * cos (π / 3) = 21 ∧ |√21 - 4.6| < 0.05 := by
  refine ⟨by rw [cos_pi_div_three]; norm_num, ?_⟩
  have l : (4.55 : ℝ) < √21 := (Real.lt_sqrt (by norm_num)).mpr (by norm_num)
  have u : √21 < (4.65 : ℝ) := (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)
  rw [abs_lt]; constructor <;> linarith

/-- Primer 3, korak 1–4 (premisli): β = 180° − 45° − 75° = 60°, α + β = 45° + 60° = 105° < 180°. -/
theorem primer3_racun : (180 : ℝ) - 45 - 75 = 60 ∧ (45 : ℝ) + 60 = 105 ∧ (105 : ℝ) < 180 := by norm_num

/-- Primer 3: v vsakem trikotniku s c = |AB| = 6, α = π/4 (45°) in γ = 5π/12 (75°) je β = π/3 (60°), po sinusnem
izreku a = 6 · sin 45°/sin 75° in b = 6 · sin 60°/sin 75°. -/
theorem primer3 {A B C : P} (hn : ¬ Collinear ℝ ({A, B, C} : Set P)) (hc : dist A B = 6)
    (hα : ∠ C A B = π / 4) (hγ : ∠ B C A = 5 * π / 12) :
    ∠ A B C = π / 3 ∧ dist B C = 6 * sin (π / 4) / sin (5 * π / 12) ∧
      dist C A = 6 * sin (π / 3) / sin (5 * π / 12) := by
  have hBA : B ≠ A := (ne₁₂_of_not_collinear hn).symm
  have hβ : ∠ A B C = π / 3 := by
    have := (vsota_kotov (C := C) hBA).2
    rw [this, hα, hγ]; ring
  refine ⟨hβ, ?_, ?_⟩
  · have := EuclideanGeometry.dist_eq_dist_mul_sin_angle_div_sin_angle (p₁ := B) (p₂ := C) (p₃ := A)
      (nk hn (by ext; simp only [Set.mem_insert_iff, Set.mem_singleton_iff]; tauto))
    rw [this, hc, hα, hγ]
  · have := EuclideanGeometry.dist_eq_dist_mul_sin_angle_div_sin_angle (p₁ := A) (p₂ := C) (p₃ := B)
      (nk hn (by ext; simp only [Set.mem_insert_iff, Set.mem_singleton_iff]; tauto))
    rw [dist_comm C A, this, dist_comm B A, hc, angle_comm C B A, hβ, angle_comm A C B, hγ]

/-- Pomožno: sin 75° = sin(45° + 30°) = (√2/2)(√3/2) + (√2/2)(1/2). -/
theorem sin75 : sin (5 * π / 12) = √2 / 2 * (√3 / 2) + √2 / 2 * (1 / 2) := by
  rw [show 5 * π / 12 = π / 4 + π / 6 by ring, sin_add, sin_pi_div_four, cos_pi_div_four, sin_pi_div_six,
    cos_pi_div_six]

/-- Primer 3 (premisli) in `RACUN`: a = 6 · sin 45°/sin 75° ≈ 4,4 in b = 6 · sin 60°/sin 75° ≈ 5,4. -/
theorem primer3_meritve :
    |6 * sin (π / 4) / sin (5 * π / 12) - 4.4| < 0.05 ∧ |6 * sin (π / 3) / sin (5 * π / 12) - 5.4| < 0.05 := by
  rw [sin75, sin_pi_div_four, sin_pi_div_three]
  have l2 : (1.4142 : ℝ) < √2 := (Real.lt_sqrt (by norm_num)).mpr (by norm_num)
  have u2 : √2 < (1.4143 : ℝ) := (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)
  have l3 : (1.732 : ℝ) < √3 := (Real.lt_sqrt (by norm_num)).mpr (by norm_num)
  have u3 : √3 < (1.7321 : ℝ) := (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)
  have hD : 0 < √2 / 2 * (√3 / 2) + √2 / 2 * (1 / 2) := by positivity
  have p1 : (1.4142 : ℝ) * 1.732 < √2 * √3 := by nlinarith
  have p2 : √2 * √3 < (1.4143 : ℝ) * 1.7321 := by nlinarith
  constructor
  · rw [abs_lt]; constructor
    · rw [lt_sub_iff_add_lt, lt_div_iff₀ hD]; nlinarith
    · rw [sub_lt_iff_lt_add, div_lt_iff₀ hD]; nlinarith
  · rw [abs_lt]; constructor
    · rw [lt_sub_iff_add_lt, lt_div_iff₀ hD]; nlinarith
    · rw [sub_lt_iff_lt_add, div_lt_iff₀ hD]; nlinarith

/-- Pomožno za `example` k Primeru 3: v ℂ je trikotnik A = 0, B = 6, C = s(1 + i) s s = 9 − 3√3 nesploščen in ima
|AB| = 6, α = π/4, β = π/3, γ = 5π/12. -/
theorem primer3_trikotnik :
    ¬ Collinear ℝ ({(0 : ℂ), 6, ⟨9 - 3 * √3, 9 - 3 * √3⟩} : Set ℂ) ∧ dist (0 : ℂ) 6 = 6 ∧
      ∠ (⟨9 - 3 * √3, 9 - 3 * √3⟩ : ℂ) 0 6 = π / 4 ∧ ∠ (⟨9 - 3 * √3, 9 - 3 * √3⟩ : ℂ) 6 0 = π / 3 ∧
      ∠ (6 : ℂ) ⟨9 - 3 * √3, 9 - 3 * √3⟩ 0 = 5 * π / 12 := by
  set s : ℝ := 9 - 3 * √3 with hs
  have h3 : (√3 : ℝ) ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have h2 : (√2 : ℝ) ^ 2 = 2 := Real.sq_sqrt (by norm_num)
  have u3 : √3 < 2 := (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)
  have l3 : 1 < √3 := (Real.lt_sqrt (by norm_num)).mpr (by norm_num)
  have hs0 : 0 < s := by rw [hs]; linarith
  have hα : ∠ (⟨s, s⟩ : ℂ) 0 6 = π / 4 := by
    rw [angle_comm]
    simp only [EuclideanGeometry.angle, vsub_eq_sub, sub_zero]
    rw [show (6 : ℂ) = ((6 : ℝ) : ℂ) by simp, kot_os (by norm_num)]
    have hn : ‖(⟨s, s⟩ : ℂ)‖ = s * √2 := by
      rw [Complex.norm_eq_sqrt_sq_add_sq]
      rw [show (⟨s, s⟩ : ℂ).re ^ 2 + (⟨s, s⟩ : ℂ).im ^ 2 = (s * √2) ^ 2 by
        show s ^ 2 + s ^ 2 = (s * √2) ^ 2; rw [mul_pow, h2]; ring]
      exact Real.sqrt_sq (by positivity)
    rw [hn, show (⟨s, s⟩ : ℂ).re = s from rfl, show s / (s * √2) = cos (π / 4) by
      rw [cos_pi_div_four]; field_simp; rw [h2]]
    exact Real.arccos_cos (by positivity) (by linarith [pi_pos])
  have hβ : ∠ (⟨s, s⟩ : ℂ) 6 0 = π / 3 := by
    rw [angle_comm]
    simp only [EuclideanGeometry.angle, vsub_eq_sub]
    rw [show (0 : ℂ) - 6 = -((6 : ℝ) : ℂ) by simp, InnerProductGeometry.angle_neg_left, kot_os (by norm_num)]
    have hn : ‖(⟨s, s⟩ : ℂ) - 6‖ = 6 * √3 - 6 := by
      rw [Complex.norm_eq_sqrt_sq_add_sq]
      rw [show ((⟨s, s⟩ : ℂ) - 6).re ^ 2 + ((⟨s, s⟩ : ℂ) - 6).im ^ 2 = (6 * √3 - 6) ^ 2 by
        simp only [Complex.sub_re, Complex.sub_im, Complex.re_ofNat, Complex.im_ofNat, sub_zero]
        show (s - 6) ^ 2 + s ^ 2 = (6 * √3 - 6) ^ 2
        rw [hs]; linear_combination (-18) * h3]
      exact Real.sqrt_sq (by linarith)
    rw [hn]
    have hre : ((⟨s, s⟩ : ℂ) - 6).re = s - 6 := by simp
    rw [hre, show (s - 6) / (6 * √3 - 6) = -(1 / 2) by
      rw [div_eq_iff (by linarith), hs]; ring, Real.arccos_neg, show (1 / 2 : ℝ) = cos (π / 3) by
      rw [cos_pi_div_three], Real.arccos_cos (by positivity) (by linarith [pi_pos])]
    ring
  have hγ : ∠ (6 : ℂ) ⟨s, s⟩ 0 = 5 * π / 12 := by
    have := (vsota_kotov (A := (0 : ℂ)) (B := 6) (C := ⟨s, s⟩) (by norm_num)).1
    rw [hα, angle_comm (0 : ℂ) 6, hβ] at this
    linarith
  refine ⟨nekolinearni_c (by simp) (by simp) (by norm_num) (show s ≠ 0 from hs0.ne'),
    dist_c (by norm_num) (by simp), hα, hβ, hγ⟩

/-- Predpostavke trditve `primer3` se dajo izpolniti (`primer3_trikotnik`). -/
example : ∃ A B C : ℂ, ¬ Collinear ℝ ({A, B, C} : Set ℂ) ∧ dist A B = 6 ∧ ∠ C A B = π / 4 ∧
    ∠ B C A = 5 * π / 12 := by
  obtain ⟨h1, h2, h3, -, h5⟩ := primer3_trikotnik
  exact ⟨_, _, _, h1, h2, h3, h5⟩

/-! ## Drugače: Na sliki (ssk s kotom nasproti krajše stranice) -/

/-- Točka na kraku kota 30° iz A = 0: t(cos 30° + i sin 30°) = t(√3/2 + i/2). -/
noncomputable def krak30 (t : ℝ) : ℂ := ⟨t * (√3 / 2), t * (1 / 2)⟩

/-- Pomožno: |krak30 t − 6|² = (t − 3√3)² + 9. -/
theorem krak30_razdalja (t : ℝ) : dist (krak30 t) 6 ^ 2 = (t - 3 * √3) ^ 2 + 9 := by
  have h3 : (√3 : ℝ) ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  rw [dist_c_sq]; simp [krak30]; linear_combination (t ^ 2 / 4 - 9) * h3

/-- Pomožno: za t > 0 je ∠ B A C = π/6 (30°) pri A = 0, B = 6, C = krak30 t. -/
theorem krak30_kot {t : ℝ} (ht : 0 < t) : ∠ (6 : ℂ) 0 (krak30 t) = π / 6 := by
  simp only [EuclideanGeometry.angle, vsub_eq_sub, sub_zero]
  rw [show (6 : ℂ) = ((6 : ℝ) : ℂ) by simp, krak30, ← cos_pi_div_six, ← sin_pi_div_six]
  exact kot_zarek (by norm_num) ht (by positivity) (by linarith [pi_pos])

/-- Predpostavka trditve `krak30_kot` se da izpolniti (t = 1). -/
example : (0 : ℝ) < 1 := one_pos

/-- Drugače: Na sliki, Razlaga 4: pri c = 6, α = 30° in a = 4 < c sta na kraku dve točki C₁ = krak30 (3√3 − √7) in
C₂ = krak30 (3√3 + √7) z |BC| = 4; trikotnika ABC₁ in ABC₂ imata enake tri podatke, a nista skladna; kot pri C₁ je
top, pri C₂ oster. Drugih točk z |BC| = 4 ni: `ssk_dva_vse`. -/
theorem ssk_dva :
    let C₁ := krak30 (3 * √3 - √7)
    let C₂ := krak30 (3 * √3 + √7)
    dist (0 : ℂ) 6 = 6 ∧ ∠ (6 : ℂ) 0 C₁ = π / 6 ∧ ∠ (6 : ℂ) 0 C₂ = π / 6 ∧ dist (6 : ℂ) C₁ = 4 ∧
      dist (6 : ℂ) C₂ = 4 ∧ ¬ (![(0 : ℂ), 6, C₁] ≅ ![(0 : ℂ), 6, C₂]) ∧
      π / 2 < ∠ (0 : ℂ) C₁ 6 ∧ ∠ (0 : ℂ) C₂ 6 < π / 2 := by
  intro C₁ C₂
  have h3 : (√3 : ℝ) ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have h7 : (√7 : ℝ) ^ 2 = 7 := Real.sq_sqrt (by norm_num)
  have l3 : 1 < √3 := (Real.lt_sqrt (by norm_num)).mpr (by norm_num)
  have u7 : √7 < 3 := (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)
  have p7 : 0 < √7 := Real.sqrt_pos.mpr (by norm_num)
  have t1 : 0 < 3 * √3 - √7 := by linarith
  have t2 : 0 < 3 * √3 + √7 := by linarith
  have d1 : dist (6 : ℂ) C₁ = 4 := by
    rw [dist_comm, ← Real.sqrt_sq dist_nonneg, krak30_razdalja]
    rw [show (3 * √3 - √7 - 3 * √3) ^ 2 + 9 = (4 : ℝ) ^ 2 by linear_combination h7]
    exact Real.sqrt_sq (by norm_num)
  have d2 : dist (6 : ℂ) C₂ = 4 := by
    rw [dist_comm, ← Real.sqrt_sq dist_nonneg, krak30_razdalja]
    rw [show (3 * √3 + √7 - 3 * √3) ^ 2 + 9 = (4 : ℝ) ^ 2 by linear_combination h7]
    exact Real.sqrt_sq (by norm_num)
  have nA : ∀ t : ℝ, 0 < t → dist (0 : ℂ) (krak30 t) = t := by
    intro t ht
    exact dist_c ht.le (by simp [krak30]; linear_combination (t ^ 2 / 4) * h3)
  -- kot pri C: ⟪A − C, B − C⟫ = t² − 3√3·t
  have hin : ∀ t : ℝ, inner ℝ ((0 : ℂ) - krak30 t) ((6 : ℂ) - krak30 t) = t ^ 2 - 3 * √3 * t := by
    intro t
    simp [krak30, Complex.inner]
    linear_combination (t ^ 2 / 4) * h3
  refine ⟨dist_c (by norm_num) (by simp), krak30_kot t1, krak30_kot t2, d1, d2, ?_, ?_, ?_⟩
  · intro hc
    have := hc.dist_eq 0 2
    simp only [Matrix.cons_val_zero, Matrix.cons_val_two, Matrix.tail_cons, Matrix.head_cons] at this
    rw [nA _ t1, nA _ t2] at this
    linarith
  · simp only [EuclideanGeometry.angle, vsub_eq_sub]
    rw [← InnerProductGeometry.inner_neg_iff_pi_div_two_lt_angle, hin]
    nlinarith [mul_pos t1 p7]
  · simp only [EuclideanGeometry.angle, vsub_eq_sub]
    rw [← not_le, ← InnerProductGeometry.inner_nonpos_iff_pi_div_two_le_angle, hin, not_le]
    nlinarith [mul_pos t2 p7]

/-- Drugače: Na sliki: krožnica s središčem B = 6 in polmerom 4 seka premico kraka v natanko dveh točkah,
t = 3√3 − √7 in t = 3√3 + √7; obe sta na kraku (t > 0, `ssk_dva`). -/
theorem ssk_dva_vse (t : ℝ) :
    dist (krak30 t) 6 = 4 ↔ (t = 3 * √3 - √7 ∨ t = 3 * √3 + √7) := by
  have h7 : (√7 : ℝ) ^ 2 = 7 := Real.sq_sqrt (by norm_num)
  have q := krak30_razdalja t
  constructor
  · intro h
    rw [h] at q
    have : (t - 3 * √3) ^ 2 = (√7) ^ 2 := by linarith
    rcases sq_eq_sq_iff_eq_or_eq_neg.mp this with e | e
    · right; linarith
    · left; linarith
  · intro h
    rw [← Real.sqrt_sq dist_nonneg, q]
    rw [show (t - 3 * √3) ^ 2 + 9 = (4 : ℝ) ^ 2 by rcases h with rfl | rfl <;> linear_combination h7]
    exact Real.sqrt_sq (by norm_num)

/-- Pomožno za `ssk_a7`: točka na kraku (t > 0) z |BC| = 7 je največ ena. -/
theorem ssk_a7_enolicno {t₁ t₂ : ℝ} (h1 : 0 < t₁) (h2 : 0 < t₂) (e1 : dist (krak30 t₁) 6 = 7)
    (e2 : dist (krak30 t₂) 6 = 7) : t₁ = t₂ := by
  have q1 := krak30_razdalja t₁
  have q2 := krak30_razdalja t₂
  rw [e1] at q1
  rw [e2] at q2
  have h3 : (√3 : ℝ) ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  -- t² − 6√3·t − 13 = 0 za oba; zmnožek rešitev je −13 < 0
  by_contra hne
  have hs : t₁ + t₂ = 6 * √3 := by
    have : (t₁ - t₂) * (t₁ + t₂ - 6 * √3) = 0 := by linear_combination q2 - q1
    rcases mul_eq_zero.mp this with h | h
    · exact absurd (by linarith) hne
    · linarith
  have : t₁ * t₂ = -13 := by
    have ht2 : t₂ = 6 * √3 - t₁ := by linarith
    rw [ht2]
    linear_combination q1 + 9 * h3
  nlinarith [mul_pos h1 h2]

/-- Predpostavke trditve `ssk_a7_enolicno` se dajo izpolniti: t = 3√3 + √40 > 0 da |BC| = 7. -/
example : 0 < 3 * √3 + √40 ∧ dist (krak30 (3 * √3 + √40)) 6 = 7 := by
  have h40 : (√40 : ℝ) ^ 2 = 40 := Real.sq_sqrt (by norm_num)
  refine ⟨by positivity, ?_⟩
  rw [← Real.sqrt_sq dist_nonneg, krak30_razdalja,
    show (3 * √3 + √40 - 3 * √3) ^ 2 + 9 = (7 : ℝ) ^ 2 by linear_combination h40]
  exact Real.sqrt_sq (by norm_num)

/-- Drugače: Na sliki: pri a = 7 > c = 6 je na kraku (t > 0) natanko ena točka C z |BC| = 7 (t = 3√3 + √40). -/
theorem ssk_a7 : ∃! t : ℝ, 0 < t ∧ dist (krak30 t) 6 = 7 := by
  have h40 : (√40 : ℝ) ^ 2 = 40 := Real.sq_sqrt (by norm_num)
  refine ⟨3 * √3 + √40, ⟨by positivity, ?_⟩, fun t ht => ?_⟩
  · rw [← Real.sqrt_sq dist_nonneg, krak30_razdalja,
      show (3 * √3 + √40 - 3 * √3) ^ 2 + 9 = (7 : ℝ) ^ 2 by linear_combination h40]
    exact Real.sqrt_sq (by norm_num)
  · have e : dist (krak30 (3 * √3 + √40)) 6 = 7 := by
      rw [← Real.sqrt_sq dist_nonneg, krak30_razdalja,
        show (3 * √3 + √40 - 3 * √3) ^ 2 + 9 = (7 : ℝ) ^ 2 by linear_combination h40]
      exact Real.sqrt_sq (by norm_num)
    exact ssk_a7_enolicno ht.1 (by positivity) ht.2 e

/-- Drugače: Na sliki in `RACUN`: točka B je od kraka oddaljena 6 · sin 30° = 3: vsaka točka kraka je od B oddaljena
vsaj 3 (najbližja je krak30 (3√3)), zato pri a < 3 krožnica kraka ne doseže in trikotnika ni. -/
theorem ssk_premalo : 6 * sin (π / 6) = 3 ∧ (∀ t : ℝ, 3 ≤ dist (krak30 t) 6) ∧ dist (krak30 (3 * √3)) 6 = 3 ∧
    ∀ a : ℝ, a < 3 → ¬ ∃ t : ℝ, dist (krak30 t) 6 = a := by
  have hmin : ∀ t : ℝ, 3 ≤ dist (krak30 t) 6 := by
    intro t
    have q := krak30_razdalja t
    nlinarith [dist_nonneg (x := krak30 t) (y := 6), sq_nonneg (t - 3 * √3)]
  refine ⟨by rw [sin_pi_div_six]; norm_num, hmin, ?_, fun a ha ⟨t, ht⟩ => by linarith [hmin t]⟩
  rw [← Real.sqrt_sq dist_nonneg, krak30_razdalja, show (3 * √3 - 3 * √3) ^ 2 + 9 = (3 : ℝ) ^ 2 by ring]
  exact Real.sqrt_sq (by norm_num)

/-! ## Preveri se -/

/-- Preveri se 2 (sks, stojalo iz poskusa): v vsakem trikotniku z b = |AC| = 6, c = |AB| = 8 in α = π/2 (90°) je
a = |BC| = 10 = √(6² + 8²) (ne 14 = 6 + 8, ne 2 = 8 − 6). -/
theorem kviz2 {A B C : P} (hb : dist A C = 6) (hc : dist A B = 8) (hα : ∠ B A C = π / 2) :
    dist B C = 10 ∧ √((6 : ℝ) ^ 2 + 8 ^ 2) = 10 ∧ dist B C ≠ 14 ∧ dist B C ≠ 2 := by
  have l := EuclideanGeometry.law_cos B A C
  rw [dist_comm B A, dist_comm C A, hb, hc, hα, cos_pi_div_two] at l
  have e : dist B C = 10 := by
    rw [← Real.sqrt_mul_self dist_nonneg, l, show (8 : ℝ) * 8 + 6 * 6 - 2 * 8 * 6 * 0 = 10 ^ 2 by norm_num]
    exact Real.sqrt_sq (by norm_num)
  refine ⟨e, ?_, by rw [e]; norm_num, by rw [e]; norm_num⟩
  rw [show ((6 : ℝ) ^ 2 + 8 ^ 2) = 10 ^ 2 by norm_num]
  exact Real.sqrt_sq (by norm_num)

/-- Predpostavke trditve `kviz2` se dajo izpolniti (`obstoj_sks` z b = 6, c = 8, θ = π/2). -/
example : ∃ A B C : ℂ, dist A C = 6 ∧ dist A B = 8 ∧ ∠ B A C = π / 2 := by
  obtain ⟨h1, h2, h3⟩ := obstoj_sks (b := 6) (c := 8) (θ := π / 2) (by norm_num) (by norm_num) (by positivity)
    (by linarith [pi_pos])
  exact ⟨0, (8 : ℝ), ⟨6 * cos (π / 2), 6 * sin (π / 2)⟩, h2, h1, h3⟩

/-- Preveri se 4 (meja): v trikotniku s stranicama 4 in 7 je celoštevilska tretja stranica n ≤ 10 (n < 4 + 7 = 11);
spodnja meja je 7 − 4 = 3, zato n ≥ 4. -/
theorem kviz4_meja {A B C : P} (hn : ¬ Collinear ℝ ({A, B, C} : Set P)) (ha : dist B C = 4) (hb : dist C A = 7)
    (n : ℕ) (hc : dist A B = n) : n ≤ 10 ∧ 4 ≤ n ∧ (4 : ℝ) + 7 = 11 ∧ (7 : ℝ) - 4 = 3 := by
  have h2 := (meje_tretje hn).2
  have h1 := (meje_tretje hn).1
  rw [ha, hb, hc] at h2
  rw [ha, hb, hc, show (4 : ℝ) - 7 = -3 by norm_num, abs_neg, abs_of_pos (by norm_num : (0 : ℝ) < 3)] at h1
  refine ⟨?_, ?_, by norm_num, by norm_num⟩
  · have : (n : ℝ) < 11 := by linarith
    exact Nat.lt_succ_iff.mp (by exact_mod_cast this)
  · have : (3 : ℝ) < n := h1
    exact_mod_cast this

/-- Preveri se 4 (dosežena meja) in predpostavke `kviz4_meja`: trikotnik s stranicami 4, 7, 10 obstaja. -/
theorem kviz4_obstoj : ∃ A B C : ℂ, dist B C = 4 ∧ dist C A = 7 ∧ dist A B = ((10 : ℕ) : ℝ) ∧
    ¬ Collinear ℝ ({A, B, C} : Set ℂ) := by
  obtain ⟨A, B, C, h1, h2, h3, h4⟩ := obstoj_trikotnika 4 7 10 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num) (by norm_num) (by norm_num)
  exact ⟨A, B, C, h1, h2, by rw [h3]; norm_num, h4⟩

/-- Preveri se 5 in Zakaj se tega učimo: 3 + 4 = 7 < 8, zato ni točke, ki bi bila 3 km od A in 4 km od B, če sta
A in B 8 km narazen (enako trakovi 3, 4, 8 cm). -/
theorem kviz5 {A B : P} (h : dist A B = 8) : (3 : ℝ) + 4 = 7 ∧ ¬ ∃ C : P, dist A C = 3 ∧ dist B C = 4 :=
  ⟨by norm_num, kroznici_se_ne_sekata (by rw [h]; norm_num)⟩

/-- Predpostavka trditve `kviz5` se da izpolniti (A = 0, B = 8 v ℂ). -/
example : dist (0 : ℂ) 8 = 8 := dist_c (by norm_num) (by simp)

/-- Preveri se 3, Pogoste napake 5 in `RACUN`: 50 + 60 + 70 = 180 (tak trikotnik obstaja, a ga koti ne določajo:
`kkk_ne`); `RACUN`: 5 + 4 = 9, 180 − 45 − 75 = 60, 45 + 60 = 105, 3 + 4 = 7, 4 + 7 = 11, 7 − 4 = 3. -/
theorem racun : (50 : ℝ) + 60 + 70 = 180 ∧ (5 : ℝ) + 4 = 9 ∧ (180 : ℝ) - 45 - 75 = 60 ∧ (45 : ℝ) + 60 = 105 ∧
    (3 : ℝ) + 4 = 7 ∧ (4 : ℝ) + 7 = 11 ∧ (7 : ℝ) - 4 = 3 := by norm_num

end Evklid.Lekcije.MAT_OS_7.KonstrukcijeTrikotnikov
