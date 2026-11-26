/-
vir: content/lessons/MAT-OS-7/obseg-in-ploscina-stirikotnikov.md
sha256: 413b527523f83c5334cf07fdd2efa8c42e84d802626b1b4e7760d2c8d41f1540
Model: ploščina lika je Lebesgueova mera `volume` množice v ℝ × ℝ. Prva koordinata p.1 je smer višine (oz. smer
diagonale f), druga p.2 smer osnovnice (oz. diagonale e). Lik je zapisan z Mathlibovim `regionBetween f g s`
(točke s p.1 ∈ s in f p.1 < p.2 < g p.1): to je notranjost lika z delom roba, rob pa ima ploščino 0.
Paralelogram: osnovnica a na p.1 = 0 (0 < p.2 < a), višina v, zamik t (p.2 od t·p.1 do t·p.1 + a); poševna
stranica je daljica od (0, 0) do (v, t·v), dolga √(v² + (t·v)²); t = 0 je pravokotnik. Trapez: spodnja osnovnica a,
zgornja c (na p.1 = v od t·v do t·v + c), višina v. Lik s pravokotnima diagonalama (romb, deltoid): diagonala e na
p.1 = 0 od 0 do e, diagonala f na p.2 = h od −f₁ do f₂ (f = f₁ + f₂), oglišča (0, 0), (0, e), (f₂, h), (−f₁, h); lik je
unija trikotnikov ob e (Bolj natančno). Pravokotnost diagonal romba in deltoida je dokazana posebej, vektorsko.
Obseg je vsota stranic (formule). Enote (m, cm, m², kg) so le v docstringih; decimalna števila so točni ulomki.
Lean: x/0 = 0; pri trapezu je zato v > 0, pri diagonalah f₁, f₂ > 0.
Ni v Leanu: zgodba (Tilen, gredici, sneg) kot opis, dokazani so njeni računi; rezanje in prestavljanje papirja,
zlaganje dveh trapezov, risbe na karirastem papirju in simulacija »Ploščine štirikotnikov« (dokazane so ploščine
likov z mero in štetje kvadratkov kot račun); da je vsak paralelogram, trapez ali lik s pravokotnima diagonalama
v ravnini skladen z modelom zgoraj (postavitev v koordinate; zahtevno, še ni dokazano); »deltoid ni paralelogram,
zato a · v zanj ne velja« (opis); »diagonali nista na robu« in »diagonala in višina sta znotraj lika« (opis);
enote in pretvarjanje enot (Povzetek); razlage napačnih odgovorov v kvizih (dokazano je, da so napačne vrednosti
res napačne); »paralelogram iz palčk« pri premisli 1 kot fizični model (dokazano je, da ima pri istih stranicah
manjša višina manjšo ploščino in da je obseg enak).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.ObsegInPloscinaStirikotnikov

open MeasureTheory Set Real

/-! ## Ploščine z mero -/

/-- Pomožno: ploščina lika med grafoma zveznih funkcij f ≤ g nad (p, q] je ∫ₚ^q (g − f). -/
theorem ploscina_med (f g : ℝ → ℝ) (hf : Continuous f) (hg : Continuous g) {p q : ℝ} (hpq : p ≤ q)
    (h : ∀ y ∈ Ioc p q, f y ≤ g y) :
    volume (regionBetween f g (Ioc p q)) = ENNReal.ofReal (∫ y in p..q, (g y - f y)) := by
  rw [Measure.volume_eq_prod, volume_regionBetween_eq_integral
    (hf.integrableOn_Icc.mono_set Ioc_subset_Icc_self) (hg.integrableOn_Icc.mono_set Ioc_subset_Icc_self)
    measurableSet_Ioc h, intervalIntegral.integral_of_le hpq]
  rfl

/-- Predpostavke trditve `ploscina_med` se dajo izpolniti (f = 0, g = 1, p = 0, q = 1). -/
example : Continuous (fun _ : ℝ => (0 : ℝ)) ∧ Continuous (fun _ : ℝ => (1 : ℝ)) ∧ (0 : ℝ) ≤ 1 ∧
    ∀ y ∈ Ioc (0 : ℝ) 1, (0 : ℝ) ≤ 1 :=
  ⟨continuous_const, continuous_const, zero_le_one, fun _ _ => zero_le_one⟩

/-- Gradnik 2, Povzetek (tabela): ploščina paralelograma z osnovnico a ≥ 0, višino v ≥ 0 in poljubnim zamikom t
je S = a · v (ni odvisna od zamika, simulacija: »ploščina ostane 7 · 4 = 28«). Romb je poseben paralelogram, zato
zanj prav tako velja S = a · v. -/
theorem ploscina_paralelograma (a v t : ℝ) (ha : 0 ≤ a) (hv : 0 ≤ v) :
    volume (regionBetween (fun y => t * y) (fun y => t * y + a) (Ioc 0 v)) = ENNReal.ofReal (a * v) := by
  rw [ploscina_med (fun y => t * y) (fun y => t * y + a) (by fun_prop) (by fun_prop) hv
    (fun y _ => by linarith)]
  congr 1
  simp only [add_sub_cancel_left, intervalIntegral.integral_const, sub_zero, smul_eq_mul]
  ring

/-- Predpostavke trditve `ploscina_paralelograma` se dajo izpolniti (a = 7, v = 4, simulacija). -/
example : (0 : ℝ) ≤ 7 ∧ (0 : ℝ) ≤ 4 := by norm_num

/-- Gradnik 3, Povzetek, Bolj natančno: ploščina trapeza z osnovnicama a, c ≥ 0, višino v > 0 in zamikom t je
S = (a + c) · v / 2 (kraka v ploščini ne nastopata). -/
theorem ploscina_trapeza (a c v t : ℝ) (ha : 0 ≤ a) (hc : 0 ≤ c) (hv : 0 < v) :
    volume (regionBetween (fun y => t * y) (fun y => t * y + a - (a - c) * y / v) (Ioc 0 v)) =
      ENNReal.ofReal ((a + c) * v / 2) := by
  have hle : ∀ y ∈ Ioc (0 : ℝ) v, t * y ≤ t * y + a - (a - c) * y / v := by
    intro y hy
    have hu0 : 0 ≤ y / v := div_nonneg hy.1.le hv.le
    have hu1 : y / v ≤ 1 := (div_le_one hv).mpr hy.2
    have e : (a - c) * y / v = (a - c) * (y / v) := by ring
    rw [e]
    nlinarith [mul_nonneg ha (sub_nonneg.2 hu1), mul_nonneg hc hu0]
  rw [ploscina_med (fun y => t * y) (fun y => t * y + a - (a - c) * y / v) (by fun_prop) (by fun_prop) hv.le hle]
  congr 1
  have hF : ∀ y ∈ uIcc (0 : ℝ) v,
      HasDerivAt (fun y => a * y - (a - c) / v * y ^ 2 / 2) (t * y + a - (a - c) * y / v - t * y) y := by
    intro y _
    have := ((hasDerivAt_id' y).const_mul a).sub (((hasDerivAt_pow 2 y).const_mul ((a - c) / v)).div_const 2)
    convert this using 1
    push_cast; ring
  have hint : IntervalIntegrable (fun y => t * y + a - (a - c) * y / v - t * y) volume 0 v :=
    ((((continuous_const.mul continuous_id).add continuous_const).sub
      ((continuous_const.mul continuous_id).div_const v)).sub (continuous_const.mul continuous_id)).intervalIntegrable 0 v
  rw [intervalIntegral.integral_eq_sub_of_hasDerivAt hF hint]
  field_simp
  ring

/-- Predpostavke trditve `ploscina_trapeza` se dajo izpolniti (a = 7, c = 3, v = 4). -/
example : (0 : ℝ) ≤ 7 ∧ (0 : ℝ) ≤ 3 ∧ (0 : ℝ) < 4 := by norm_num

/-- Pomožno (Bolj natančno): ploščina trikotnika z osnovnico e (na p.1 = 0) in višino d > 0, katerega vrh je na
p.1 = d, p.2 = h, je e · d / 2. -/
theorem ploscina_trikotnika (e d h : ℝ) (he : 0 ≤ e) (hd : 0 < d) :
    volume (regionBetween (fun y => h * y / d) (fun y => e - (e - h) * y / d) (Ioc 0 d)) =
      ENNReal.ofReal (e * d / 2) := by
  have hle : ∀ y ∈ Ioc (0 : ℝ) d, h * y / d ≤ e - (e - h) * y / d := by
    intro y hy
    have hu1 : y / d ≤ 1 := (div_le_one hd).mpr hy.2
    have e1 : e - (e - h) * y / d - h * y / d = e * (1 - y / d) := by ring
    nlinarith [mul_nonneg he (sub_nonneg.2 hu1)]
  rw [ploscina_med (fun y => h * y / d) (fun y => e - (e - h) * y / d) (by fun_prop) (by fun_prop) hd.le hle]
  congr 1
  have hF : ∀ y ∈ uIcc (0 : ℝ) d,
      HasDerivAt (fun y => e * y - e / d * y ^ 2 / 2) (e - (e - h) * y / d - h * y / d) y := by
    intro y _
    have := ((hasDerivAt_id' y).const_mul e).sub (((hasDerivAt_pow 2 y).const_mul (e / d)).div_const 2)
    convert this using 1
    push_cast; ring
  have hint : IntervalIntegrable (fun y => e - (e - h) * y / d - h * y / d) volume 0 d :=
    ((continuous_const.sub ((continuous_const.mul continuous_id).div_const d)).sub
      ((continuous_const.mul continuous_id).div_const d)).intervalIntegrable 0 d
  rw [intervalIntegral.integral_eq_sub_of_hasDerivAt hF hint]
  field_simp
  ring

/-- Predpostavke trditve `ploscina_trikotnika` se dajo izpolniti (e = 8, d = 3). -/
example : (0 : ℝ) ≤ 8 ∧ (0 : ℝ) < 3 := by norm_num

/-- Gradnik 4 in 5, Povzetek, Bolj natančno, Preveri se 2: lik s pravokotnima diagonalama e in f = f₁ + f₂
(romb ali deltoid; f₁, f₂ > 0 sta dela diagonale f na obeh straneh e) je unija dveh trikotnikov z osnovnico e in
višinama f₂, f₁; njegova ploščina je e · f₂/2 + e · f₁/2 = e · (f₁ + f₂)/2 = e · f/2. Trikotnika se ne prekrivata. -/
theorem ploscina_diagonali (e f₁ f₂ h : ℝ) (he : 0 ≤ e) (h1 : 0 < f₁) (h2 : 0 < f₂) :
    volume (regionBetween (fun y => h * y / f₂) (fun y => e - (e - h) * y / f₂) (Ioc 0 f₂) ∪
        regionBetween (fun y => h * (-y) / f₁) (fun y => e - (e - h) * (-y) / f₁) (Ioc (-f₁) 0)) =
      ENNReal.ofReal (e * (f₁ + f₂) / 2) := by
  have hd : Disjoint (regionBetween (fun y => h * y / f₂) (fun y => e - (e - h) * y / f₂) (Ioc 0 f₂))
      (regionBetween (fun y => h * (-y) / f₁) (fun y => e - (e - h) * (-y) / f₁) (Ioc (-f₁) 0)) := by
    rw [Set.disjoint_left]
    rintro p ⟨hp1, -⟩ ⟨hp2, -⟩
    exact absurd hp2.2 (not_le.mpr hp1.1)
  have hm : MeasurableSet
      (regionBetween (fun y => h * (-y) / f₁) (fun y => e - (e - h) * (-y) / f₁) (Ioc (-f₁) 0)) :=
    measurableSet_regionBetween (by fun_prop) (by fun_prop) measurableSet_Ioc
  rw [measure_union hd hm, ploscina_trikotnika e f₂ h he h2]
  -- spodnji trikotnik: zrcaljenje p.1 ↦ −p.1 ohranja mero
  have hle : ∀ y ∈ Ioc (-f₁) 0, h * (-y) / f₁ ≤ e - (e - h) * (-y) / f₁ := by
    intro y hy
    have hu1 : -y / f₁ ≤ 1 := (div_le_one h1).mpr (by linarith [hy.1])
    have e1 : e - (e - h) * (-y) / f₁ - h * (-y) / f₁ = e * (1 - -y / f₁) := by ring
    nlinarith [mul_nonneg he (sub_nonneg.2 hu1)]
  rw [ploscina_med (fun y => h * (-y) / f₁) (fun y => e - (e - h) * (-y) / f₁) (by fun_prop) (by fun_prop)
    (by linarith) hle]
  have hF : ∀ y ∈ uIcc (-f₁) 0,
      HasDerivAt (fun y => e * y + e / f₁ * y ^ 2 / 2) (e - (e - h) * (-y) / f₁ - h * (-y) / f₁) y := by
    intro y _
    have := ((hasDerivAt_id' y).const_mul e).add (((hasDerivAt_pow 2 y).const_mul (e / f₁)).div_const 2)
    convert this using 1
    push_cast; ring
  have hint : IntervalIntegrable (fun y => e - (e - h) * (-y) / f₁ - h * (-y) / f₁) volume (-f₁) 0 := by
    apply Continuous.intervalIntegrable; fun_prop
  rw [intervalIntegral.integral_eq_sub_of_hasDerivAt hF hint, ← ENNReal.ofReal_add (by positivity)]
  · congr 1
    field_simp
    ring
  · field_simp
    nlinarith [mul_pos h1 h1]

/-- Predpostavke trditve `ploscina_diagonali` se dajo izpolniti (romb e = 8, f₁ = f₂ = 3, h = 4: Na sliki). -/
example : (0 : ℝ) ≤ 8 ∧ (0 : ℝ) < 3 ∧ (0 : ℝ) < 3 := by norm_num

/-- Bolj natančno: S = e · f₁/2 + e · f₂/2 = e · (f₁ + f₂)/2 = e · f/2 (pri f₁ + f₂ = f). -/
theorem diagonali_racun (e f f₁ f₂ : ℝ) (h : f₁ + f₂ = f) :
    e * f₁ / 2 + e * f₂ / 2 = e * (f₁ + f₂) / 2 ∧ e * (f₁ + f₂) / 2 = e * f / 2 := by
  refine ⟨by ring, by rw [h]⟩

/-- Predpostavka trditve `diagonali_racun` se da izpolniti (f₁ = f₂ = 3, f = 6). -/
example : (3 : ℝ) + 3 = 6 := by norm_num

/-! ## Pravokotni diagonali, poševna stranica, obseg -/

/-- Gradnik 4: diagonali romba sta pravokotni: pri stranicah u, w z ‖u‖ = ‖w‖ sta diagonali u + w in w − u
pravokotni (skalarni produkt 0). -/
theorem romb_diagonali {E : Type*} [NormedAddCommGroup E] [InnerProductSpace ℝ E] (u w : E)
    (h : ‖u‖ = ‖w‖) : inner ℝ (w + u) (w - u) = 0 :=
  (real_inner_add_sub_eq_zero_iff w u).mpr h.symm

/-- Predpostavka trditve `romb_diagonali` se da izpolniti (u = 1, w = i v ℂ). -/
example : ‖(1 : ℂ)‖ = ‖Complex.I‖ := by simp

/-- Gradnik 5: diagonali deltoida sta pravokotni: če je |AB| = |AD| in |CB| = |CD|, je ⟪C − A, D − B⟫ = 0. -/
theorem deltoid_diagonali {E : Type*} [NormedAddCommGroup E] [InnerProductSpace ℝ E] (A B C D : E)
    (h1 : ‖B - A‖ = ‖D - A‖) (h2 : ‖B - C‖ = ‖D - C‖) : inner ℝ (C - A) (D - B) = 0 := by
  have e1 : ‖B - A‖ ^ 2 = ‖D - A‖ ^ 2 := by rw [h1]
  have e2 : ‖B - C‖ ^ 2 = ‖D - C‖ ^ 2 := by rw [h2]
  rw [norm_sub_sq_real, norm_sub_sq_real] at e1 e2
  simp only [inner_sub_left, inner_sub_right]
  linarith [real_inner_comm A B, real_inner_comm C D, real_inner_comm A D, real_inner_comm B C]

/-- Predpostavke trditve `deltoid_diagonali` se dajo izpolniti (A = 0, B = 1, C = 1 + i, D = i v ℂ, kvadrat). -/
example : ‖(1 : ℂ) - 0‖ = ‖Complex.I - 0‖ ∧ ‖(1 : ℂ) - (1 + Complex.I)‖ = ‖Complex.I - (1 + Complex.I)‖ := by
  refine ⟨by simp, ?_⟩
  rw [show (1 : ℂ) - (1 + Complex.I) = -Complex.I by ring, show Complex.I - (1 + Complex.I) = -1 by ring]
  simp

/-- Gradnik 2, Bolj natančno (kvadrat ima največjo ploščino), Pogoste napake 1: poševna stranica paralelograma
b = √(v² + (t·v)²) je vsaj tako dolga kot višina v ≥ 0, zato je S = a · v ≤ a · b (a ≥ 0); pri v > 0 je b = v
natanko tedaj, ko je t = 0 (pravi kot). -/
theorem posevna_stranica (a v t : ℝ) (ha : 0 ≤ a) (hv : 0 ≤ v) :
    v ≤ √(v ^ 2 + (t * v) ^ 2) ∧ a * v ≤ a * √(v ^ 2 + (t * v) ^ 2) ∧
      (0 < v → (√(v ^ 2 + (t * v) ^ 2) = v ↔ t = 0)) := by
  have h1 : v ≤ √(v ^ 2 + (t * v) ^ 2) := Real.le_sqrt_of_sq_le (by nlinarith [sq_nonneg (t * v)])
  refine ⟨h1, mul_le_mul_of_nonneg_left h1 ha, fun hv' => ?_⟩
  constructor
  · intro h
    have := Real.sq_sqrt (show 0 ≤ v ^ 2 + (t * v) ^ 2 by positivity)
    rw [h] at this
    have : (t * v) ^ 2 = 0 := by linarith
    have : t * v = 0 := pow_eq_zero_iff (by norm_num) |>.mp this
    rcases mul_eq_zero.mp this with h0 | h0
    · exact h0
    · linarith
  · rintro rfl
    simp [Real.sqrt_sq hv]

/-- Predpostavke trditve `posevna_stranica` se dajo izpolniti (a = 4, v = 2). -/
example : (0 : ℝ) ≤ 4 ∧ (0 : ℝ) ≤ 2 := by norm_num

/-- Bolj natančno: med rombi s stranico 4 m (v ≤ b = 4) ima največjo ploščino kvadrat, 4 · 4 = 16 m². -/
theorem najvecji_romb (v : ℝ) (hv : v ≤ 4) : 4 * v ≤ 16 ∧ (4 : ℝ) * 4 = 16 := ⟨by linarith, by norm_num⟩

/-- Predpostavka trditve `najvecji_romb` se da izpolniti (v = 2). -/
example : (2 : ℝ) ≤ 4 := by norm_num

/-- Gradnik 1, Povzetek (tabela): obseg je vsota stranic; paralelogram (a, b, a, b) ima o = 2(a + b), romb
(a, a, a, a) o = 4a, deltoid (a, a, b, b) o = 2(a + b). -/
theorem obseg (a b : ℝ) : a + b + a + b = 2 * (a + b) ∧ a + a + a + a = 4 * a ∧ a + a + b + b = 2 * (a + b) := by
  refine ⟨by ring, by ring, by ring⟩

/-- Premisli 2: formula za trapez pri c = a da ploščino paralelograma: (a + a) · v/2 = 2a · v/2 = a · v. -/
theorem trapez_c_eq_a (a v : ℝ) : (a + a) * v / 2 = 2 * a * v / 2 ∧ 2 * a * v / 2 = a * v := by
  refine ⟨by ring, by ring⟩

/-- Premisli 1, Povzetek 3, Pogoste napake 2: paralelogram iz palčk 6 cm in 5 cm ima obseg 2 · (6 + 5) = 22 cm
pri vsaki višini, ploščina 6 · v pa je pri manjši višini manjša: enak obseg ne pomeni enake ploščine. -/
theorem palcke (v₁ v₂ : ℝ) (h : v₁ < v₂) : (2 : ℝ) * (6 + 5) = 22 ∧ 6 * v₁ < 6 * v₂ :=
  ⟨by norm_num, by linarith⟩

/-- Predpostavka trditve `palcke` se da izpolniti (v₁ = 3, v₂ = 4). -/
example : (3 : ℝ) < 4 := by norm_num

/-! ## Kratka vprašanja, sneg -/

/-- Zakaj se tega učimo in Nazaj k snegu: obseg kvadrata in romba s stranico 4 m je 4 · 4 = 16 m; ploščina kvadrata
4 · 4 = 16 m², romba 4 · 2 = 8 m², kar je pol manj (16 = 2 · 8). -/
theorem sneg : (4 : ℝ) * 4 = 16 ∧ (4 : ℝ) * 2 = 8 ∧ (16 : ℝ) = 2 * 8 := by norm_num

/-- Kratka vprašanja (Gradniki 1–5): 2 · (9 + 5) = 28 cm; 9 · 4 = 36 cm²; (7 + 3) · 4/2 = 20 cm²; 10 · 4/2 = 20 cm²;
9 · 4/2 = 18 cm²; simulacija 7 · 4 = 28. -/
theorem kratka_vprasanja : (2 : ℝ) * (9 + 5) = 28 ∧ (9 : ℝ) * 4 = 36 ∧ ((7 : ℝ) + 3) * 4 / 2 = 20 ∧
    (10 : ℝ) * 4 / 2 = 20 ∧ (9 : ℝ) * 4 / 2 = 18 ∧ (7 : ℝ) * 4 = 28 := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: o = 2 · (120 + 75) = 2 · 195 = 390 m, S = 120 · 60 = 7200 m². -/
theorem primer1 : (2 : ℝ) * (120 + 75) = 2 * 195 ∧ (2 : ℝ) * 195 = 390 ∧ (120 : ℝ) * 60 = 7200 := by norm_num

/-- Primer 1 z mero: njiva (paralelogram a = 120, v = 60, poljuben zamik t) ima ploščino 7200 m². -/
theorem primer1_mera (t : ℝ) :
    volume (regionBetween (fun y => t * y) (fun y => t * y + 120) (Ioc 0 60)) = ENNReal.ofReal 7200 := by
  rw [ploscina_paralelograma 120 60 t (by norm_num) (by norm_num)]; norm_num

/-- Primer 2: 80 + 50 = 130, 130 · 40 = 5200, 5200 : 2 = 2600 m², o = 80 + 50 + 50 + 40 = 220 m; podatki so skladni:
poševni krak √((80 − 50)² + 40²) = 50. -/
theorem primer2 : (80 : ℝ) + 50 = 130 ∧ (130 : ℝ) * 40 = 5200 ∧ (5200 : ℝ) / 2 = 2600 ∧
    ((80 : ℝ) + 50) * 40 / 2 = 2600 ∧ (80 : ℝ) + 50 + 50 + 40 = 220 ∧ √((80 - 50) ^ 2 + 40 ^ 2 : ℝ) = 50 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  rw [show ((80 - 50) ^ 2 + 40 ^ 2 : ℝ) = 50 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Primer 2 z mero: pravokotni trapez a = 80, c = 50, v = 40 (t = 0) ima ploščino 2600 m². -/
theorem primer2_mera :
    volume (regionBetween (fun y => 0 * y) (fun y => 0 * y + 80 - (80 - 50) * y / 40) (Ioc 0 40)) =
      ENNReal.ofReal 2600 := by
  rw [ploscina_trapeza 80 50 40 0 (by norm_num) (by norm_num) (by norm_num)]; norm_num

/-- Primer 3, korak 1–3 (enolično): 1260 = e · 40/2 natanko tedaj, ko je e = 63. -/
theorem primer3 (e : ℝ) : 1260 = e * 40 / 2 ↔ e = 63 := by
  constructor <;> intro h <;> linarith

/-- Primer 3 (koraki): e · 40 = 2 · 1260 = 2520, e = 2520 : 40 = 63, preizkus 63 · 40/2 = 1260,
o = 2 · (25 + 52) = 2 · 77 = 154 cm; podatki so skladni: √(25² − 20²) + √(52² − 20²) = 15 + 48 = 63. -/
theorem primer3_racun : (2 : ℝ) * 1260 = 2520 ∧ (2520 : ℝ) / 40 = 63 ∧ (63 : ℝ) * 40 / 2 = 1260 ∧
    (2 : ℝ) * (25 + 52) = 2 * 77 ∧ (2 : ℝ) * 77 = 154 ∧
    √((25 : ℝ) ^ 2 - 20 ^ 2) + √((52 : ℝ) ^ 2 - 20 ^ 2) = 15 + 48 ∧ (15 : ℝ) + 48 = 63 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_, by norm_num⟩
  rw [show ((25 : ℝ) ^ 2 - 20 ^ 2) = 15 ^ 2 by norm_num, show ((52 : ℝ) ^ 2 - 20 ^ 2) = 48 ^ 2 by norm_num,
    Real.sqrt_sq (by norm_num), Real.sqrt_sq (by norm_num)]

/-- Primer 4 (enolično): S = 16 · 12/2 = 96 m² in 96 = 10 · v natanko tedaj, ko je v = 9,6 m < 10 m. -/
theorem primer4 (v : ℝ) : (16 : ℝ) * 12 / 2 = 96 ∧ (96 = 10 * v ↔ v = 9.6) ∧ (9.6 : ℝ) < 10 := by
  refine ⟨by norm_num, ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num⟩

/-- Primer 4 (skladnost podatkov): romb z diagonalama 16 in 12 ima stranico √(8² + 6²) = 10. -/
theorem primer4_stranica : √((8 : ℝ) ^ 2 + 6 ^ 2) = 10 := by
  rw [show ((8 : ℝ) ^ 2 + 6 ^ 2) = 10 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-! ## Drugače -/

/-- Na sliki: paralelogram 7 · 4 = 28; trapez 7 + 3 = 10, 10 · 4 = 40, 40/2 = 20; romb in deltoid 8 · 6 = 48,
48/2 = 24 kvadratkov. -/
theorem na_sliki : (7 : ℝ) * 4 = 28 ∧ (7 : ℝ) + 3 = 10 ∧ (10 : ℝ) * 4 = 40 ∧ (40 : ℝ) / 2 = 20 ∧
    (8 : ℝ) * 6 = 48 ∧ (48 : ℝ) / 2 = 24 := by norm_num

/-- Bolj natančno (obe formuli za romb se ujemata): 8 · 6/2 = 24 cm², v = 24 : 5 = 4,8 cm, 5 · 4,8 = 24; stranica
je res √(4² + 3²) = 5. -/
theorem romb_ujemanje : (8 : ℝ) * 6 / 2 = 24 ∧ (24 : ℝ) / 5 = 4.8 ∧ (5 : ℝ) * 4.8 = 24 ∧
    √((4 : ℝ) ^ 2 + 3 ^ 2) = 5 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  rw [show ((4 : ℝ) ^ 2 + 3 ^ 2) = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-! ## Preveri se -/

/-- Preveri se 1: (9 + 5) · 6/2 = 84/2 = 42 cm² (ne 84, ne 9 · 5 · 6/2 = 135, ne 9 + 5 + 6 = 20). -/
theorem kviz1 : ((9 : ℝ) + 5) * 6 / 2 = 84 / 2 ∧ (84 : ℝ) / 2 = 42 ∧ (9 : ℝ) * 5 * 6 / 2 = 135 ∧
    (9 : ℝ) + 5 + 6 = 20 ∧ (42 : ℝ) ≠ 84 := by norm_num

/-- Preveri se 3: pravilno je 12 · 5 = 60 cm², ne 12 · 7 = 84, ne 84/2 = 42; 2 · (12 + 7) = 38 je obseg. -/
theorem kviz3 : (12 : ℝ) * 5 = 60 ∧ (12 : ℝ) * 7 = 84 ∧ (60 : ℝ) ≠ 84 ∧ (84 : ℝ) / 2 = 42 ∧
    (2 : ℝ) * (12 + 7) = 38 := by norm_num

/-- Preveri se 4: romb 10 · 6/2 = 30 cm², paralelogram 10 · 3 = 30 cm²: ploščini sta enaki (ne 60, ne 50). -/
theorem kviz4 : (10 : ℝ) * 6 / 2 = 30 ∧ (10 : ℝ) * 3 = 30 ∧ (10 : ℝ) * 6 = 60 ∧ (10 : ℝ) * 5 = 50 := by norm_num

/-- Preveri se 5: S = (14 + 8) · 4/2 = 44 m², snega 44 · 50 = 2200 kg (ne 88 · 50 = 4400, ne (14 + 8) · 5/2 · 50 =
2750, ne obseg 14 + 8 + 5 + 5 = 32 krat 50 = 1600); podatki so skladni: √(((14 − 8)/2)² + 4²) = 5. -/
theorem kviz5 : ((14 : ℝ) + 8) * 4 / 2 = 44 ∧ (44 : ℝ) * 50 = 2200 ∧ (88 : ℝ) * 50 = 4400 ∧
    ((14 : ℝ) + 8) * 5 / 2 * 50 = 2750 ∧ (14 : ℝ) + 8 + 5 + 5 = 32 ∧ (32 : ℝ) * 50 = 1600 ∧
    √(((14 - 8) / 2) ^ 2 + 4 ^ 2 : ℝ) = 5 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  rw [show (((14 - 8) / 2) ^ 2 + 4 ^ 2 : ℝ) = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

end Evklid.Lekcije.MAT_OS_7.ObsegInPloscinaStirikotnikov
