/-
vir: content/lessons/MAT-SS-4/drugi-odvod-prevoj-in-konveksnost.md
sha256: 5cbd4550920431b31e170a9fd3d758e57577fc1f7a46d4318b8542f6044e2f2b
Ni v Leanu: poskus z ravnilom, zgodbi o raketi in roverju, risbi, simulacija; pomen h'' kot pospeška;
Preveri se 5 (supernova, brez dane funkcije); »prevoj, kjer funkcija ni definirana« za 1/x (pojem
definicijskega območja; dokazano je le f''(x) = 2/x³ in menjava predznaka); branje abscis 0,4 in 2,6 z
grafa (dokazani sta natančni ničli (3 ± √5)/2 z mejama); Naloga 2: približka ordinat prevojev 0,2162 in
−3,7282 (eksponent iracionalnega števila; zahtevno, še ni dokazano; dokazani sta natančni vrednosti
(6 ± 4√5)e^(−2 ∓ √5)); točkovanje.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.DrugiOdvodPrevojInKonveksnost

open Real Filter Topology Set

/-! ## Pravila -/

/-- Razlaga 1: drugi odvod je odvod odvoda, f''(x) = (f'(x))'.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#drugi-odvod
besedilo: »Odvod $f'$ je spet funkcija, zato ga lahko še enkrat odvajamo. Dobimo **drugi odvod** $f''$: $$f''(x) = \bigl(f'(x)\bigr)'$$« -/
theorem drugi_odvod {f f₁ f₂ : ℝ → ℝ} (h₁ : ∀ x, HasDerivAt f (f₁ x) x)
    (h₂ : ∀ x, HasDerivAt f₁ (f₂ x) x) (x : ℝ) : deriv^[2] f x = f₂ x := by
  have e : deriv f = f₁ := funext fun x => (h₁ x).deriv
  show deriv (deriv f) x = f₂ x
  rw [e]; exact (h₂ x).deriv

/-- Predpostavke trditve `drugi_odvod` so izpolnljive (f = x³, f₁ = 3x², f₂ = 6x). -/
example : (∀ x : ℝ, HasDerivAt (fun x : ℝ => x ^ 3) (3 * x ^ 2) x) ∧
    ∀ x : ℝ, HasDerivAt (fun x : ℝ => 3 * x ^ 2) (6 * x) x :=
  ⟨fun x => (hasDerivAt_pow 3 x).congr_deriv (by norm_num),
    fun x => ((hasDerivAt_pow 2 x).const_mul 3).congr_deriv (by push_cast; ring)⟩

/-- Predpostavke trditve `drugi_odvod` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (∀ x : ℝ, HasDerivAt (fun x : ℝ => x ^ 3) (3 * x ^ 2) x) ∧ ∀ x : ℝ, HasDerivAt (fun x : ℝ => 3 * x ^ 2) (6 * x) x :=
    ⟨fun x => (hasDerivAt_pow 3 x).congr_deriv (by norm_num),
      fun x => ((hasDerivAt_pow 2 x).const_mul 3).congr_deriv (by push_cast; ring)⟩
  drugi_odvod (h₁ := w.1) (h₂ := w.2)

/-- Razlaga 3: f'' > 0 na (notranjosti) intervala ⇒ f je tam konveksna.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#konveksna
besedilo: »$f''(x) > 0$ na intervalu: $f$ je tam konveksna;« -/
theorem konveksna {f f₁ f₂ : ℝ → ℝ} {D : Set ℝ} (h₁ : ∀ x, HasDerivAt f (f₁ x) x)
    (h₂ : ∀ x, HasDerivAt f₁ (f₂ x) x) (hD : Convex ℝ D) (hp : ∀ x ∈ interior D, 0 < f₂ x) :
    StrictConvexOn ℝ D f :=
  strictConvexOn_of_deriv2_pos hD (fun x _ => (h₁ x).continuousAt.continuousWithinAt)
    fun x hx => by rw [drugi_odvod h₁ h₂ x]; exact hp x hx

/-- Razlaga 3: f'' < 0 na (notranjosti) intervala ⇒ f je tam konkavna.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#konkavna
besedilo: »$f''(x) < 0$ na intervalu: $f$ je tam konkavna.« -/
theorem konkavna {f f₁ f₂ : ℝ → ℝ} {D : Set ℝ} (h₁ : ∀ x, HasDerivAt f (f₁ x) x)
    (h₂ : ∀ x, HasDerivAt f₁ (f₂ x) x) (hD : Convex ℝ D) (hn : ∀ x ∈ interior D, f₂ x < 0) :
    StrictConcaveOn ℝ D f :=
  strictConcaveOn_of_deriv2_neg hD (fun x _ => (h₁ x).continuousAt.continuousWithinAt)
    fun x hx => by rw [drugi_odvod h₁ h₂ x]; exact hn x hx

/-- Predpostavke trditev `konveksna` in `konkavna` so izpolnljive (x² na ℝ: f'' = 2 > 0). -/
example : (∀ x : ℝ, HasDerivAt (fun x : ℝ => x ^ 2) (2 * x) x) ∧
    (∀ x : ℝ, HasDerivAt (fun x : ℝ => 2 * x) ((fun _ => (2:ℝ)) x) x) ∧
    ∀ x ∈ interior (univ : Set ℝ), (0:ℝ) < (fun _ => (2:ℝ)) x :=
  ⟨fun x => (hasDerivAt_pow 2 x).congr_deriv (by norm_num),
    fun x => ((hasDerivAt_id' x).const_mul 2).congr_deriv (by ring), fun _ _ => two_pos⟩

/-- Pomožno: −x² na ℝ ima f' = −2x in f'' = −2 < 0 (predpostavke `konkavna` in `test_maksimum`).
pomozno -/
theorem konkavna_izpolnljivo : (∀ x : ℝ, HasDerivAt (fun x : ℝ => -x ^ 2) (-2 * x) x) ∧
    (∀ x : ℝ, HasDerivAt (fun x : ℝ => -2 * x) ((fun _ => (-2:ℝ)) x) x) ∧
    ∀ x ∈ interior (univ : Set ℝ), (fun _ => (-2:ℝ)) x < 0 :=
  ⟨fun x => ((hasDerivAt_pow 2 x).neg).congr_deriv (by norm_num),
    fun x => ((hasDerivAt_id' x).const_mul (-2)).congr_deriv (by ring), fun _ _ => by norm_num⟩

/-- Razlaga 3 (pomen): graf konveksne funkcije leži nad vsako svojo tangento,
f(x) + f'(x)(y − x) ≤ f(y).
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#nad-tangento
besedilo: »Funkcija je na intervalu **konveksna**, če njen graf tam leži nad vsako svojo tangento (oblika »skodelice«, $\cup$).« -/
theorem nad_tangento {f : ℝ → ℝ} {D : Set ℝ} {x y f' : ℝ} (hf : ConvexOn ℝ D f) (hx : x ∈ D)
    (hy : y ∈ D) (hd : HasDerivAt f f' x) : f x + f' * (y - x) ≤ f y := by
  rcases lt_trichotomy x y with h | rfl | h
  · have := hf.le_slope_of_hasDerivAt hx hy h hd
    rw [slope_def_field, le_div_iff₀ (by linarith)] at this
    linarith
  · simp
  · have := hf.slope_le_of_hasDerivAt hy hx h hd
    rw [slope_def_field, div_le_iff₀ (by linarith)] at this
    linarith

/-- Predpostavke trditve `nad_tangento` so izpolnljive (x² na ℝ v 0). -/
example : ConvexOn ℝ univ (fun x : ℝ => x ^ 2) ∧ HasDerivAt (fun x : ℝ => x ^ 2) 0 0 :=
  ⟨Even.convexOn_pow (by decide), (hasDerivAt_pow 2 (0:ℝ)).congr_deriv (by norm_num)⟩

/-- Razlaga 3 (pomen): graf konkavne funkcije leži pod vsako svojo tangento.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#pod-tangento
besedilo: »Je **konkavna**, če graf leži pod tangentami (oblika »kupole«, $\cap$).« -/
theorem pod_tangento {f : ℝ → ℝ} {D : Set ℝ} {x y f' : ℝ} (hf : ConcaveOn ℝ D f) (hx : x ∈ D)
    (hy : y ∈ D) (hd : HasDerivAt f f' x) : f y ≤ f x + f' * (y - x) := by
  have := nad_tangento hf.neg hx hy hd.neg
  simp only [Pi.neg_apply] at this
  linarith

/-- Predpostavke trditve `pod_tangento` so izpolnljive (−x² na ℝ v 0). -/
example : ConcaveOn ℝ univ (fun x : ℝ => -x ^ 2) ∧ HasDerivAt (fun x : ℝ => -x ^ 2) 0 0 :=
  ⟨(Even.convexOn_pow (𝕜 := ℝ) (n := 2) (by decide)).neg,
    ((hasDerivAt_pow 2 (0:ℝ)).neg).congr_deriv (by norm_num)⟩

/-- Razlaga 4: če f'' v x₀ obstaja (f' je odvedljiva blizu x₀) in v x₀ zamenja predznak, je
f''(x₀) = 0 (v prevoju ima f' ekstrem).
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#prevoj-potrebni-pogoj
besedilo: »Pravilo: v prevoju $f''$ **zamenja predznak**. Če $f''(x_0)$ obstaja, je zato $f''(x_0) = 0$.« -/
theorem prevoj_potrebni_pogoj {f : ℝ → ℝ} {x₀ δ : ℝ} (hδ : 0 < δ)
    (hd : ∀ x ∈ Ioo (x₀ - δ) (x₀ + δ), DifferentiableAt ℝ (deriv f) x)
    (hs : ((∀ x ∈ Ioo (x₀ - δ) x₀, deriv (deriv f) x < 0) ∧ ∀ x ∈ Ioo x₀ (x₀ + δ), 0 < deriv (deriv f) x) ∨
      ((∀ x ∈ Ioo (x₀ - δ) x₀, 0 < deriv (deriv f) x) ∧ ∀ x ∈ Ioo x₀ (x₀ + δ), deriv (deriv f) x < 0)) :
    deriv (deriv f) x₀ = 0 := by
  have hc : ContinuousAt (deriv f) x₀ := (hd x₀ ⟨by linarith, by linarith⟩).continuousAt
  have d0 : DifferentiableOn ℝ (deriv f) (Ioo (x₀ - δ) x₀) := fun x hx =>
    (hd x ⟨hx.1, by linarith [hx.2]⟩).differentiableWithinAt
  have d1 : DifferentiableOn ℝ (deriv f) (Ioo x₀ (x₀ + δ)) := fun x hx =>
    (hd x ⟨by linarith [hx.1], hx.2⟩).differentiableWithinAt
  rcases hs with ⟨hl, hr⟩ | ⟨hl, hr⟩
  · exact (isLocalMin_of_deriv_Ioo (by linarith) (by linarith) hc d0 d1
      (fun x hx => (hl x hx).le) (fun x hx => (hr x hx).le)).deriv_eq_zero
  · exact (isLocalMax_of_deriv_Ioo (by linarith) (by linarith) hc d0 d1
      (fun x hx => (hl x hx).le) (fun x hx => (hr x hx).le)).deriv_eq_zero

/-- Razlaga 6 in Ustno vprašanje 3: f'(a) = 0 in f''(a) > 0 ⇒ v a je lokalni minimum.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#test-minimum
besedilo: »$f'(a) = 0$ in $f''(a) > 0$: graf je okoli $a$ skodelica, v $a$ je **minimum**;« -/
theorem test_minimum {f f₁ f₂ : ℝ → ℝ} {a : ℝ} (h₁ : ∀ x, HasDerivAt f (f₁ x) x)
    (h₂ : ∀ x, HasDerivAt f₁ (f₂ x) x) (ha : f₁ a = 0) (hp : 0 < f₂ a) : IsLocalMin f a :=
  isLocalMin_of_deriv_deriv_pos (by rw [show deriv (deriv f) a = f₂ a from drugi_odvod h₁ h₂ a]; exact hp)
    (by rw [(h₁ a).deriv]; exact ha) (h₁ a).continuousAt

/-- Razlaga 6 in Ustno vprašanje 3: f'(a) = 0 in f''(a) < 0 ⇒ v a je lokalni maksimum.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#test-maksimum
besedilo: »$f'(a) = 0$ in $f''(a) < 0$: graf je kupola, v $a$ je **maksimum**;« -/
theorem test_maksimum {f f₁ f₂ : ℝ → ℝ} {a : ℝ} (h₁ : ∀ x, HasDerivAt f (f₁ x) x)
    (h₂ : ∀ x, HasDerivAt f₁ (f₂ x) x) (ha : f₁ a = 0) (hn : f₂ a < 0) : IsLocalMax f a :=
  isLocalMax_of_deriv_deriv_neg (by rw [show deriv (deriv f) a = f₂ a from drugi_odvod h₁ h₂ a]; exact hn)
    (by rw [(h₁ a).deriv]; exact ha) (h₁ a).continuousAt

/-- Predpostavke trditev `test_minimum` in `test_maksimum` so izpolnljive (x² v 0: f' = 2x, f'' = 2). -/
example : (∀ x : ℝ, HasDerivAt (fun x : ℝ => x ^ 2) ((fun x => 2 * x) x) x) ∧
    (∀ x : ℝ, HasDerivAt (fun x : ℝ => 2 * x) ((fun _ => (2:ℝ)) x) x) ∧ (fun x : ℝ => 2 * x) 0 = 0 ∧
    (0:ℝ) < (fun _ => (2:ℝ)) 0 :=
  ⟨fun x => (hasDerivAt_pow 2 x).congr_deriv (by norm_num),
    fun x => ((hasDerivAt_id' x).const_mul 2).congr_deriv (by ring), by norm_num, two_pos⟩

/-- Predpostavke trditve `test_maksimum` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  test_maksimum (h₁ := konkavna_izpolnljivo.1) (h₂ := konkavna_izpolnljivo.2.1) (a := 0) (ha := by norm_num)
    (hn := by norm_num)

/-- Predpostavke trditve `test_minimum` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (∀ x : ℝ, HasDerivAt (fun x : ℝ => x ^ 2) ((fun x => 2 * x) x) x) ∧ (∀ x : ℝ, HasDerivAt (fun x : ℝ => 2 * x) ((fun _ => (2:ℝ)) x) x) ∧ (fun x : ℝ => 2 * x) 0 = 0 ∧ (0:ℝ) < (fun _ => (2:ℝ)) 0 :=
    ⟨fun x => (hasDerivAt_pow 2 x).congr_deriv (by norm_num),
      fun x => ((hasDerivAt_id' x).const_mul 2).congr_deriv (by ring), by norm_num, two_pos⟩
  test_minimum (h₁ := w.1) (h₂ := w.2.1) (ha := w.2.2.1) (hp := w.2.2.2)

example : (∀ x : ℝ, HasDerivAt (fun x : ℝ => -x ^ 2) ((fun x => -2 * x) x) x) ∧
    (∀ x : ℝ, HasDerivAt (fun x : ℝ => -2 * x) ((fun _ => (-2:ℝ)) x) x) ∧ (fun x : ℝ => -2 * x) 0 = 0 ∧
    (fun _ => (-2:ℝ)) 0 < 0 :=
  ⟨fun x => ((hasDerivAt_pow 2 x).neg).congr_deriv (by norm_num),
    fun x => ((hasDerivAt_id' x).const_mul (-2)).congr_deriv (by ring), by norm_num, by norm_num⟩

/-! ## Razlaga, 1–3: primeri -/

/-- Razlaga 1: prvi odvod (odvod funkcije), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#kub-d1
besedilo: »Za $f(x) = x^3$ je $f'(x) = 3x^2$« -/
theorem kub_d1 (x : ℝ) : HasDerivAt (fun x : ℝ => x ^ 3) (3 * x ^ 2) x :=
  (hasDerivAt_pow 3 x).congr_deriv (by norm_num)

/-- Razlaga 1: drugi odvod (odvod prvega odvoda), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#kub-d2
besedilo: »Za $f(x) = x^3$ je $f'(x) = 3x^2$ in $f''(x) = 6x$.« -/
theorem kub_d2 (x : ℝ) : HasDerivAt (fun x : ℝ => 3 * x ^ 2) (6 * x) x :=
  ((hasDerivAt_pow 2 x).const_mul 3).congr_deriv (by push_cast; ring)

/-- Razlaga 1 in 2 (tabela): (x³)' = 3x², (x³)'' = 6x; (x²)'' = 2 > 0, (−x²)'' = −2 < 0.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#tabela
besedilo: »| $x^2$ | $2 > 0$ | nad | | $-x^2$ | $-2 < 0$ | pod | | $x^3$ | $6x$ | pod, nato nad |« -/
theorem tabela (x : ℝ) :
    deriv^[2] (fun x : ℝ => x ^ 3) x = 6 * x ∧ deriv^[2] (fun x : ℝ => x ^ 2) x = 2 ∧
    deriv^[2] (fun x : ℝ => -x ^ 2) x = -2 := by
  refine ⟨drugi_odvod kub_d1 kub_d2 x, drugi_odvod (f₁ := fun x => 2 * x) (f₂ := fun _ => 2)
    (fun x => (hasDerivAt_pow 2 x).congr_deriv (by norm_num))
    (fun x => ((hasDerivAt_id' x).const_mul 2).congr_deriv (by ring)) x,
    drugi_odvod (f₁ := fun x => -(2 * x)) (f₂ := fun _ => -2)
    (fun x => (hasDerivAt_pow 2 x).neg.congr_deriv (by norm_num))
    (fun x => ((hasDerivAt_id' x).const_mul 2).neg.congr_deriv (by ring)) x⟩

/-- Razlaga 3, Premisli: (ln x)' = 1/x, (1/x)' = −1/x² < 0 za x > 0; ln narašča in je konkavna.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#ln-konkavna
besedilo: »Konkavna. $g'(x) = \frac{1}{x}$ in $g''(x) = -\frac{1}{x^2} < 0$ za vsak $x > 0$. Naraščanje določa predznak **prvega** odvoda, ukrivljenost pa predznak **drugega**. Graf $\ln x$ se dviga vse počasneje, zato leži pod tangentami.« -/
theorem ln_konkavna (x : ℝ) (hx : 0 < x) :
    HasDerivAt log (1 / x) x ∧ HasDerivAt (fun x : ℝ => 1 / x) (-1 / x ^ 2) x ∧ -1 / x ^ 2 < 0 ∧
    StrictMonoOn log (Ioi 0) ∧ StrictConcaveOn ℝ (Ioi 0) log := by
  refine ⟨by rw [one_div]; exact hasDerivAt_log hx.ne', ?_, by
    apply div_neg_of_neg_of_pos (by norm_num) (by positivity), strictMonoOn_log, strictConcaveOn_log_Ioi⟩
  exact ((hasDerivAt_const x (1:ℝ)).div (hasDerivAt_id' x) hx.ne').congr_deriv (by ring)

/-- Predpostavke trditve `ln_konkavna` se dajo izpolniti (x = 1). -/
example : (0:ℝ) < 1 := one_pos

/-! ## Razlaga, 4: prevoj na grafu x³ − 3x -/

/-- Predpostavke trditve `ln_konkavna` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 1 := one_pos
  ln_konkavna (hx := w)

/-- Razlaga 4: prvi odvod (odvod funkcije), kot je zapisan v lekciji.
pomozno -/
theorem f_d1 (x : ℝ) : HasDerivAt (fun x : ℝ => x ^ 3 - 3 * x) (3 * x ^ 2 - 3) x :=
  ((hasDerivAt_pow 3 x).sub ((hasDerivAt_id' x).const_mul 3)).congr_deriv (by push_cast; ring)

/-- Razlaga 4: drugi odvod (odvod prvega odvoda), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#f-d2
besedilo: »Tu je $f''(x) = 6x$.« -/
theorem f_d2 (x : ℝ) : HasDerivAt (fun x : ℝ => 3 * x ^ 2 - 3) (6 * x) x :=
  (((hasDerivAt_pow 2 x).const_mul 3).sub_const 3).congr_deriv (by push_cast; ring)

/-- Razlaga 4: za f(x) = x³ − 3x je f'' = 6x; levo od 0 je f konkavna in tangenta y = 2 v A(−1, 2) leži nad
grafom, desno konveksna in tangenta y = −2 v B(1, −2) pod grafom; tangenta y = −3x v P(0, 0) graf preseka
(f(x) − (−3x) = x³).
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#tri-tangente
besedilo: »Tu je $f''(x) = 6x$. Levo od $0$ je negativen (graf konkaven, tangenta v $A$ nad grafom), desno pozitiven (graf konveksen, tangenta v $B$ pod grafom). V $P(0, 0)$ zamenja predznak: to je prevoj.« -/
theorem tri_tangente :
    StrictConcaveOn ℝ (Iic 0) (fun x : ℝ => x ^ 3 - 3 * x) ∧
    StrictConvexOn ℝ (Ici 0) (fun x : ℝ => x ^ 3 - 3 * x) ∧
    (-1:ℝ) ^ 3 - 3 * (-1) = 2 ∧ (3:ℝ) * (-1) ^ 2 - 3 = 0 ∧ (∀ x : ℝ, x ≤ 0 → x ^ 3 - 3 * x ≤ 2) ∧
    (1:ℝ) ^ 3 - 3 * 1 = -2 ∧ (3:ℝ) * 1 ^ 2 - 3 = 0 ∧ (∀ x : ℝ, 0 ≤ x → -2 ≤ x ^ 3 - 3 * x) ∧
    (3:ℝ) * 0 ^ 2 - 3 = -3 ∧ (∀ x : ℝ, x < 0 → x ^ 3 - 3 * x < -3 * x) ∧
    (∀ x : ℝ, 0 < x → -3 * x < x ^ 3 - 3 * x) := by
  refine ⟨konkavna f_d1 f_d2 (convex_Iic 0) fun x hx => ?_,
    konveksna f_d1 f_d2 (convex_Ici 0) fun x hx => ?_, by norm_num, by norm_num,
    fun x hx => by nlinarith [sq_nonneg (x + 1)], by norm_num, by norm_num,
    fun x hx => by nlinarith [sq_nonneg (x - 1)], by norm_num,
    fun x hx => by nlinarith [pow_pos (neg_pos.mpr hx) 3], fun x hx => by nlinarith [pow_pos hx 3]⟩
  · rw [interior_Iic] at hx; have : x < 0 := hx; linarith
  · rw [interior_Ici] at hx; have : 0 < x := hx; linarith

/-- Predpostavke trditve `prevoj_potrebni_pogoj` so izpolnljive: x³ v 0 (f'' = 6x zamenja predznak),
in f''(0) = 0.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#prevoj-x3
besedilo: »Pri $x^3$ se predznak zamenja iz $-$ v $+$: v $(0, 0)$ je prevoj.« -/
theorem prevoj_x3 :
    (∀ x ∈ Ioo ((0:ℝ) - 1) (0 + 1), DifferentiableAt ℝ (deriv (fun x : ℝ => x ^ 3)) x) ∧
    (∀ x ∈ Ioo ((0:ℝ) - 1) 0, deriv (deriv (fun x : ℝ => x ^ 3)) x < 0) ∧
    (∀ x ∈ Ioo (0:ℝ) (0 + 1), 0 < deriv (deriv (fun x : ℝ => x ^ 3)) x) ∧
    deriv (deriv (fun x : ℝ => x ^ 3)) 0 = 0 := by
  have e : deriv (fun x : ℝ => x ^ 3) = fun x => 3 * x ^ 2 := funext fun x => (kub_d1 x).deriv
  have e2 : ∀ x, deriv (deriv (fun x : ℝ => x ^ 3)) x = 6 * x := fun x => by rw [e]; exact (kub_d2 x).deriv
  refine ⟨fun x _ => by rw [e]; exact (kub_d2 x).differentiableAt, fun x hx => ?_, fun x hx => ?_,
    by rw [e2]; ring⟩
  · rw [e2]; linarith [hx.2]
  · rw [e2]; linarith [hx.1]

/-- Razlaga 4, Premisli, Pogoste napake 1 in Preveri se 3: za x⁴ je f'' = 12x², f''(0) = 0, a f'' > 0 na
obeh straneh 0; x⁴ je konveksna povsod in ima v 0 minimum, prevoja ni.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#x4-brez-prevoja
besedilo: »Nima. $12x^2 > 0$ na obeh straneh ničle, zato je $x^4$ konveksna povsod in v $(0, 0)$ ima minimum. Pogoj $f''(x_0) = 0$ je **potreben, ni pa zadosten**: odločilna je menjava predznaka.« -/
theorem x4_brez_prevoja :
    (∀ x : ℝ, deriv^[2] (fun x : ℝ => x ^ 4) x = 12 * x ^ 2) ∧ (12:ℝ) * 0 ^ 2 = 0 ∧
    (∀ x : ℝ, x ≠ 0 → 0 < 12 * x ^ 2) ∧ StrictConvexOn ℝ univ (fun x : ℝ => x ^ 4) ∧
    IsLocalMin (fun x : ℝ => x ^ 4) 0 := by
  refine ⟨fun x => drugi_odvod (f₁ := fun x => 4 * x ^ 3) (f₂ := fun x => 12 * x ^ 2)
    (fun x => (hasDerivAt_pow 4 x).congr_deriv (by norm_num))
    (fun x => ((hasDerivAt_pow 3 x).const_mul 4).congr_deriv (by push_cast; ring)) x, by norm_num,
    fun x hx => by positivity, Even.strictConvexOn_pow (by decide) (by norm_num), ?_⟩
  exact Filter.Eventually.of_forall fun x => by show (0:ℝ) ^ 4 ≤ x ^ 4; rw [zero_pow (by norm_num)]; positivity

/-! ## Razlaga, 6: f''(a) = 0 ne odloči -/

/-- Razlaga 6 in Pogoste napake 5: pri x⁴, −x⁴ in x³ je v 0 f' = 0 in f'' = 0, v 0 pa je po vrsti
minimum, maksimum in nobenega ekstrema.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#test-ne-odloci
besedilo: »$f'(a) = 0$ in $f''(a) = 0$: drugi odvod ne odloči. Pri $x^4$, $-x^4$ in $x^3$ je v $0$ po vrsti minimum, maksimum in nobenega ekstrema. Vrni se k predznaku $f'$.« -/
theorem test_ne_odloci :
    IsLocalMin (fun x : ℝ => x ^ 4) 0 ∧ IsLocalMax (fun x : ℝ => -x ^ 4) 0 ∧
    ¬ IsLocalMin (fun x : ℝ => x ^ 3) 0 ∧ ¬ IsLocalMax (fun x : ℝ => x ^ 3) 0 ∧
    (4:ℝ) * 0 ^ 3 = 0 ∧ (12:ℝ) * 0 ^ 2 = 0 ∧ (3:ℝ) * 0 ^ 2 = 0 ∧ (6:ℝ) * 0 = 0 := by
  have hm : StrictMono (fun x : ℝ => x ^ 3) := Odd.strictMono_pow (by decide)
  refine ⟨x4_brez_prevoja.2.2.2.2, Filter.Eventually.of_forall fun x => ?_, fun h => ?_, fun h => ?_,
    by norm_num, by norm_num, by norm_num, by norm_num⟩
  · simp only; have : 0 ≤ x ^ 4 := by positivity
    linarith
  · obtain ⟨x, hx, hx0⟩ := (h.filter_mono (nhdsWithin_le_nhds (s := Iio 0))).and
      self_mem_nhdsWithin |>.exists
    exact absurd (hm (show x < (0:ℝ) from hx0)) (not_lt.mpr hx)
  · obtain ⟨x, hx, hx0⟩ := (h.filter_mono (nhdsWithin_le_nhds (s := Ioi 0))).and
      self_mem_nhdsWithin |>.exists
    exact absurd (hm (show (0:ℝ) < x from hx0)) (not_lt.mpr hx)

/-- Razlaga 7 (simulacija): f'(x) = 3x² − 3 ima pri x = 0 najmanjšo vrednost −3.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#odvod-najmanjsi
besedilo: »Vrednost $f'$ najprej pada, pri $x_0 = 0$ doseže najmanjšo vrednost $-3$, nato spet raste.« -/
theorem odvod_najmanjsi (x : ℝ) : (3:ℝ) * 0 ^ 2 - 3 = -3 ∧ -3 ≤ 3 * x ^ 2 - 3 := by
  constructor
  · norm_num
  · nlinarith [sq_nonneg x]

/-! ## Rešeni primeri -/

/-- Primer 1: prvi odvod (odvod funkcije), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#p1-d1
besedilo: »Prvi odvod: $f'(x) = 3x^2 - 6x$.« -/
theorem p1_d1 (x : ℝ) : HasDerivAt (fun x : ℝ => x ^ 3 - 3 * x ^ 2 + 2) (3 * x ^ 2 - 6 * x) x :=
  (((hasDerivAt_pow 3 x).sub ((hasDerivAt_pow 2 x).const_mul 3)).add_const 2).congr_deriv
    (by push_cast; ring)

/-- Primer 1: drugi odvod (odvod prvega odvoda), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#p1-d2
besedilo: »Drugi odvod: $f''(x) = 6x - 6 = 6(x - 1)$.« -/
theorem p1_d2 (x : ℝ) : HasDerivAt (fun x : ℝ => 3 * x ^ 2 - 6 * x) (6 * x - 6) x :=
  (((hasDerivAt_pow 2 x).const_mul 3).sub ((hasDerivAt_id' x).const_mul 6)).congr_deriv
    (by push_cast; ring)

/-- Primer 1: f' = 3x² − 6x, f'' = 6x − 6 = 6(x − 1); 6x − 6 = 0 ⇔ x = 1; f''(0) = −6 < 0, f''(2) = 6 > 0;
f(1) = 1 − 3 + 2 = 0; f je konkavna na (−∞, 1), konveksna na (1, ∞), prevoj T(1, 0).
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#primer1
besedilo: »Odgovor: $f$ je konkavna na $(-\infty, 1)$, konveksna na $(1, \infty)$, prevoj je $T(1, 0)$.« -/
theorem primer1 (x : ℝ) :
    6 * x - 6 = 6 * (x - 1) ∧ (6 * x - 6 = 0 ↔ x = 1) ∧ (6:ℝ) * 0 - 6 = -6 ∧ (6:ℝ) * 2 - 6 = 6 ∧
    (1:ℝ) ^ 3 - 3 * 1 ^ 2 + 2 = 1 - 3 + 2 ∧ (1:ℝ) - 3 + 2 = 0 ∧
    StrictConcaveOn ℝ (Iio 1) (fun x : ℝ => x ^ 3 - 3 * x ^ 2 + 2) ∧
    StrictConvexOn ℝ (Ioi 1) (fun x : ℝ => x ^ 3 - 3 * x ^ 2 + 2) := by
  refine ⟨by ring, ⟨fun h => by linarith, fun h => by subst h; norm_num⟩, by norm_num, by norm_num,
    by norm_num, by norm_num, konkavna p1_d1 p1_d2 (convex_Iio 1) fun y hy => ?_,
    konveksna p1_d1 p1_d2 (convex_Ioi 1) fun y hy => ?_⟩
  · rw [interior_Iio] at hy; have : y < 1 := hy; linarith
  · rw [interior_Ioi] at hy; have : 1 < y := hy; linarith

/-- Primer 2: prvi odvod (odvod funkcije), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#p2-d1
besedilo: »$f'(x) = 4x^3 - 12x = 4x(x^2 - 3)$« -/
theorem p2_d1 (x : ℝ) : HasDerivAt (fun x : ℝ => x ^ 4 - 6 * x ^ 2) (4 * x ^ 3 - 12 * x) x :=
  ((hasDerivAt_pow 4 x).sub ((hasDerivAt_pow 2 x).const_mul 6)).congr_deriv (by push_cast; ring)

/-- Primer 2: drugi odvod (odvod prvega odvoda), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#p2-d2
besedilo: »$f''(x) = 12x^2 - 12 = 12(x - 1)(x + 1)$« -/
theorem p2_d2 (x : ℝ) : HasDerivAt (fun x : ℝ => 4 * x ^ 3 - 12 * x) (12 * x ^ 2 - 12) x :=
  (((hasDerivAt_pow 3 x).const_mul 4).sub ((hasDerivAt_id' x).const_mul 12)).congr_deriv
    (by push_cast; ring)

/-- Primer 2, koraki 1–4: f' = 4x³ − 12x = 4x(x² − 3), f'' = 12x² − 12 = 12(x − 1)(x + 1), ničli ±1,
f'' < 0 natanko na (−1, 1); f''(−2) = 36, f''(0) = −12, f''(2) = 36; f(±1) = 1 − 6 = −5.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#primer2-prevoja
besedilo: »$f'(x) = 4x^3 - 12x = 4x(x^2 - 3)$. 2. $f''(x) = 12x^2 - 12 = 12(x - 1)(x + 1)$, ničli sta $x = -1$ in $x = 1$. 3. Predznak $f''$ po intervalih: $f''(-2) = 36 > 0$, $f''(0) = -12 < 0$, $f''(2) = 36 > 0$. Na vsaki ničli se zamenja. 4. Ordinati: $f(1) = 1 - 6 = -5$ in enako $f(-1) = -5$, ker je funkcija soda.« -/
theorem primer2_prevoja (x : ℝ) :
    4 * x ^ 3 - 12 * x = 4 * x * (x ^ 2 - 3) ∧ 12 * x ^ 2 - 12 = 12 * (x - 1) * (x + 1) ∧
    (12 * x ^ 2 - 12 = 0 ↔ x = -1 ∨ x = 1) ∧ (12 * x ^ 2 - 12 < 0 ↔ -1 < x ∧ x < 1) ∧
    (12:ℝ) * (-2) ^ 2 - 12 = 36 ∧ (12:ℝ) * 0 ^ 2 - 12 = -12 ∧ (12:ℝ) * 2 ^ 2 - 12 = 36 ∧
    (1:ℝ) ^ 4 - 6 * 1 ^ 2 = 1 - 6 ∧ (1:ℝ) - 6 = -5 ∧ (-1:ℝ) ^ 4 - 6 * (-1) ^ 2 = -5 := by
  refine ⟨by ring, by ring, ⟨fun h => ?_, ?_⟩, ⟨fun h => ⟨by nlinarith, by nlinarith⟩,
    fun h => by nlinarith [h.1, h.2]⟩, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩
  · have : (x - 1) * (x + 1) = 0 := by nlinarith
    rcases mul_eq_zero.mp this with h | h
    · right; linarith
    · left; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Primer 2, korak 7: f je konveksna na (−∞, −1) in (1, ∞), konkavna na (−1, 1).
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#primer2-konveksnost
besedilo: »Odgovor: $f$ je konveksna na $(-\infty, -1)$ in na $(1, \infty)$, konkavna na $(-1, 1)$« -/
theorem primer2_konveksnost :
    StrictConvexOn ℝ (Iio (-1)) (fun x : ℝ => x ^ 4 - 6 * x ^ 2) ∧
    StrictConcaveOn ℝ (Ioo (-1) 1) (fun x : ℝ => x ^ 4 - 6 * x ^ 2) ∧
    StrictConvexOn ℝ (Ioi 1) (fun x : ℝ => x ^ 4 - 6 * x ^ 2) := by
  refine ⟨konveksna p2_d1 p2_d2 (convex_Iio _) fun y hy => ?_,
    konkavna p2_d1 p2_d2 (convex_Ioo _ _) fun y hy => ?_,
    konveksna p2_d1 p2_d2 (convex_Ioi _) fun y hy => ?_⟩
  · rw [interior_Iio] at hy; have : y < -1 := hy; nlinarith
  · rw [interior_Ioo] at hy; nlinarith [hy.1, hy.2]
  · rw [interior_Ioi] at hy; have : 1 < y := hy; nlinarith

/-- Primer 2, koraki 5–6: stacionarne točke so 0 in ±√3; f''(0) = −12 < 0, maksimum f(0) = 0;
f''(√3) = 12 · 3 − 12 = 24 > 0, minimuma f(±√3) = 9 − 18 = −9.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#primer2-ekstremi
besedilo: »$f''(0) = -12 < 0$, zato je v $0$ maksimum $f(0) = 0$. $f''(\sqrt{3}) = 12 \cdot 3 - 12 = 24 > 0$, zato sta v $\pm\sqrt{3}$ minimuma $f(\pm\sqrt{3}) = 9 - 18 = -9$.« -/
theorem primer2_ekstremi (x : ℝ) :
    (4 * x ^ 3 - 12 * x = 0 ↔ x = -√3 ∨ x = 0 ∨ x = √3) ∧
    IsLocalMax (fun x : ℝ => x ^ 4 - 6 * x ^ 2) 0 ∧ (0:ℝ) ^ 4 - 6 * 0 ^ 2 = 0 ∧
    12 * √3 ^ 2 - 12 = 12 * 3 - 12 ∧ (12:ℝ) * 3 - 12 = 24 ∧
    IsLocalMin (fun x : ℝ => x ^ 4 - 6 * x ^ 2) (√3) ∧
    IsLocalMin (fun x : ℝ => x ^ 4 - 6 * x ^ 2) (-√3) ∧
    √3 ^ 4 - 6 * √3 ^ 2 = 9 - 18 ∧ (-√3) ^ 4 - 6 * (-√3) ^ 2 = 9 - 18 ∧ (9:ℝ) - 18 = -9 := by
  have s3 : √3 ^ 2 = 3 := sq_sqrt (by norm_num)
  have s4 : √3 ^ 4 = 9 := by rw [show √3 ^ 4 = (√3 ^ 2) ^ 2 by ring, s3]; norm_num
  refine ⟨⟨fun h => ?_, ?_⟩, test_maksimum p2_d1 p2_d2 (by norm_num) (by norm_num), by norm_num,
    by rw [s3], by norm_num, test_minimum p2_d1 p2_d2 (by rw [show √3 ^ 3 = √3 ^ 2 * √3 by ring, s3]; ring)
      (by rw [s3]; norm_num),
    test_minimum p2_d1 p2_d2 (by rw [show (-√3) ^ 3 = -(√3 ^ 2 * √3) by ring, s3]; ring)
      (by rw [neg_sq, s3]; norm_num), by rw [s4, s3]; norm_num, by rw [neg_sq, show (-√3) ^ 4 = √3 ^ 4 by ring, s4, s3]; norm_num,
    by norm_num⟩
  · have : 4 * x * ((x - √3) * (x + √3)) = 0 := by linear_combination h + (-4 * x) * s3
    rcases mul_eq_zero.mp this with h | h
    · right; left; linarith
    · rcases mul_eq_zero.mp h with h | h
      · right; right; linarith
      · left; linarith
  · rintro (rfl | rfl | rfl)
    · rw [show (-√3) ^ 3 = -(√3 ^ 2 * √3) by ring, s3]; ring
    · norm_num
    · rw [show √3 ^ 3 = √3 ^ 2 * √3 by ring, s3]; ring

/-- Primer 3: prvi odvod (odvod funkcije), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#p3-d1
besedilo: »$v(t) = h'(t) = 12t - 3t^2$« -/
theorem p3_d1 (t : ℝ) : HasDerivAt (fun t : ℝ => 6 * t ^ 2 - t ^ 3) (12 * t - 3 * t ^ 2) t :=
  (((hasDerivAt_pow 2 t).const_mul 6).sub (hasDerivAt_pow 3 t)).congr_deriv (by push_cast; ring)

/-- Primer 3: drugi odvod (odvod prvega odvoda), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#p3-d2
besedilo: »Pospešek: $h''(t) = 12 - 6t$.« -/
theorem p3_d2 (t : ℝ) : HasDerivAt (fun t : ℝ => 12 * t - 3 * t ^ 2) (12 - 6 * t) t :=
  (((hasDerivAt_id' t).const_mul 12).sub ((hasDerivAt_pow 2 t).const_mul 3)).congr_deriv
    (by push_cast; ring)

/-- Primer 3: v = h' = 12t − 3t², h'' = 12 − 6t; 12 − 6t = 0 ⇔ t = 2; h konveksna na [0, 2], konkavna
na [2, 4]; v(2) = 12 · 2 − 3 · 4 = 12 je največja hitrost (v(0) = 0, v(4) = 48 − 48 = 0);
h(2) = 6 · 4 − 8 = 16; vrh leta je pri t = 4 (maksimum h na [0, 4], h'(4) = 0, h''(4) = −12 ≠ 0, torej ni
prevoj).
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#primer3
besedilo: »Odgovor: raketa se najhitreje dviga po $2\,\mathrm{s}$, s hitrostjo $12\,\mathrm{m/s}$, na višini $16\,\mathrm{m}$. Točka $(2, 16)$ je prevoj grafa višine: pred njo je graf konveksen, za njo konkaven. Vrh leta pri $t = 4\,\mathrm{s}$ ni prevoj, ampak maksimum.« -/
theorem primer3 (t : ℝ) :
    (12 - 6 * t = 0 ↔ t = 2) ∧
    StrictConvexOn ℝ (Icc 0 2) (fun t : ℝ => 6 * t ^ 2 - t ^ 3) ∧
    StrictConcaveOn ℝ (Icc 2 4) (fun t : ℝ => 6 * t ^ 2 - t ^ 3) ∧
    (12:ℝ) * 2 - 3 * 2 ^ 2 = 12 * 2 - 3 * 4 ∧ (12:ℝ) * 2 - 3 * 4 = 12 ∧ 12 * t - 3 * t ^ 2 ≤ 12 ∧
    (12:ℝ) * 0 - 3 * 0 ^ 2 = 0 ∧ (12:ℝ) * 4 - 3 * 4 ^ 2 = 48 - 48 ∧ (48:ℝ) - 48 = 0 ∧
    (6:ℝ) * 2 ^ 2 - 2 ^ 3 = 6 * 4 - 8 ∧ (6:ℝ) * 4 - 8 = 16 ∧
    IsMaxOn (fun t : ℝ => 6 * t ^ 2 - t ^ 3) (Icc 0 4) 4 ∧ (12:ℝ) - 6 * 4 = -12 := by
  refine ⟨⟨fun h => by linarith, fun h => by subst h; norm_num⟩,
    konveksna p3_d1 p3_d2 (convex_Icc _ _) fun y hy => ?_,
    konkavna p3_d1 p3_d2 (convex_Icc _ _) fun y hy => ?_, by norm_num, by norm_num,
    by nlinarith [sq_nonneg (t - 2)], by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    fun s hs => ?_, by norm_num⟩
  · rw [interior_Icc] at hy; linarith [hy.2]
  · rw [interior_Icc] at hy; linarith [hy.1]
  · have hs' : s ∈ Icc (0:ℝ) 4 := hs
    show 6 * s ^ 2 - s ^ 3 ≤ 6 * 4 ^ 2 - 4 ^ 3
    nlinarith [mul_nonneg (sq_nonneg (s - 4)) (show (0:ℝ) ≤ s + 2 by linarith [hs'.1])]

/-- Primer 4: prvi odvod (odvod funkcije), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#p4-d1
besedilo: »$f'(x) = e^{-x} - x\,e^{-x} = (1 - x)\,e^{-x}$« -/
theorem p4_d1 (x : ℝ) : HasDerivAt (fun x : ℝ => x * exp (-x)) (exp (-x) - x * exp (-x)) x :=
  ((hasDerivAt_id' x).mul (hasDerivAt_neg x).exp).congr_deriv (by ring)

/-- Primer 4: prvi odvod (odvod funkcije), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#p4-d1-crtica
besedilo: »$f'(x) = e^{-x} - x\,e^{-x} = (1 - x)\,e^{-x}$« -/
theorem p4_d1' (x : ℝ) : HasDerivAt (fun x : ℝ => x * exp (-x)) ((1 - x) * exp (-x)) x :=
  (p4_d1 x).congr_deriv (by ring)

/-- Primer 4: drugi odvod (odvod prvega odvoda), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#p4-d2
besedilo: »$f''(x) = -e^{-x} - (1 - x)\,e^{-x} = (x - 2)\,e^{-x}$« -/
theorem p4_d2 (x : ℝ) :
    HasDerivAt (fun x : ℝ => (1 - x) * exp (-x)) (-exp (-x) - (1 - x) * exp (-x)) x :=
  (((hasDerivAt_id' x).const_sub 1).mul (hasDerivAt_neg x).exp).congr_deriv (by ring)

/-- Primer 4: drugi odvod (odvod prvega odvoda), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#p4-d2-crtica
besedilo: »$f''(x) = -e^{-x} - (1 - x)\,e^{-x} = (x - 2)\,e^{-x}$« -/
theorem p4_d2' (x : ℝ) : HasDerivAt (fun x : ℝ => (1 - x) * exp (-x)) ((x - 2) * exp (-x)) x :=
  (p4_d2 x).congr_deriv (by ring)

/-- Primer 4: f' = e^{−x} − x e^{−x} = (1 − x)e^{−x}, stacionarna točka x = 1; f'' = −e^{−x} − (1 − x)e^{−x}
= (x − 2)e^{−x}; f''(1) = −e^{−1} < 0, maksimum f(1) = e^{−1} ≈ 0,37; prevoj T(2, 2e^{−2}) ≈ (2; 0,27):
levo od 2 je f konkavna, desno konveksna.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#primer4
besedilo: »$f''(1) = -e^{-1} < 0$, zato je v $x = 1$ maksimum $f(1) = e^{-1} \approx 0{,}37$. $f''$ zamenja predznak v $x = 2$ (levo negativen, desno pozitiven), zato je prevoj $T(2, 2e^{-2}) \approx (2; 0{,}27)$. Levo od $2$ je $f$ konkavna, desno konveksna.« -/
theorem primer4 (x : ℝ) :
    exp (-x) - x * exp (-x) = (1 - x) * exp (-x) ∧ ((1 - x) * exp (-x) = 0 ↔ x = 1) ∧
    -exp (-x) - (1 - x) * exp (-x) = (x - 2) * exp (-x) ∧
    (1 - 2) * exp (-1) = -exp (-1) ∧ -exp (-1) < 0 ∧
    IsLocalMax (fun x : ℝ => x * exp (-x)) 1 ∧ 1 * exp (-1) = exp (-1) ∧
    (0.365 < exp (-1) ∧ exp (-1) < 0.375) ∧
    StrictConcaveOn ℝ (Iio 2) (fun x : ℝ => x * exp (-x)) ∧
    StrictConvexOn ℝ (Ioi 2) (fun x : ℝ => x * exp (-x)) ∧
    (0.265 < 2 * exp (-2) ∧ 2 * exp (-2) < 0.275) := by
  have e1 := exp_one_gt_d9
  have e2 := exp_one_lt_d9
  have hE1 : exp (-1) = 1 / exp 1 := by rw [exp_neg, one_div]
  have hE2 : exp (-2) = 1 / (exp 1 * exp 1) := by
    rw [show (-2:ℝ) = -(1 + 1) by norm_num, exp_neg, exp_add, one_div]
  have hp : 0 < exp 1 := exp_pos 1
  refine ⟨by ring, ⟨fun h => ?_, fun h => by subst h; ring⟩, by ring, by ring,
    neg_neg_of_pos (exp_pos _),
    test_maksimum p4_d1' p4_d2' (by ring) (by norm_num; exact exp_pos _), by ring, ⟨?_, ?_⟩,
    konkavna p4_d1' p4_d2' (convex_Iio _) fun y hy => ?_,
    konveksna p4_d1' p4_d2' (convex_Ioi _) fun y hy => ?_, ⟨?_, ?_⟩⟩
  · rcases mul_eq_zero.mp h with h | h
    · linarith
    · exact absurd h (exp_pos _).ne'
  · rw [hE1, lt_div_iff₀ hp]; nlinarith
  · rw [hE1, div_lt_iff₀ hp]; nlinarith
  · rw [interior_Iio] at hy; have : y < 2 := hy
    exact mul_neg_of_neg_of_pos (by linarith) (exp_pos _)
  · rw [interior_Ioi] at hy; have : 2 < y := hy
    exact mul_pos (by linarith) (exp_pos _)
  · rw [hE2, mul_one_div, lt_div_iff₀ (by positivity)]; nlinarith
  · rw [hE2, mul_one_div, div_lt_iff₀ (by positivity)]; nlinarith

/-! ## Pogoste napake -/

/-- Pogoste napake 2: e^{−x} pada ((e^{−x})' = −e^{−x} < 0) in je konveksna ((e^{−x})'' = e^{−x} > 0).
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#eksp-pada-konveksna
besedilo: »$e^{-x}$ pada in je konveksna.« -/
theorem eksp_pada_konveksna :
    StrictAnti (fun x : ℝ => exp (-x)) ∧ StrictConvexOn ℝ univ (fun x : ℝ => exp (-x)) := by
  have d1 : ∀ x : ℝ, HasDerivAt (fun x : ℝ => exp (-x)) (-exp (-x)) x := fun x =>
    (hasDerivAt_neg x).exp.congr_deriv (by ring)
  have d2 : ∀ x : ℝ, HasDerivAt (fun x : ℝ => -exp (-x)) (exp (-x)) x := fun x => (d1 x).neg.congr_deriv (by ring)
  refine ⟨strictAnti_of_deriv_neg fun x => by rw [(d1 x).deriv]; exact neg_neg_of_pos (exp_pos _),
    konveksna d1 d2 convex_univ fun x _ => exp_pos _⟩

/-- Pogoste napake 4: za f(x) = 1/x je f'(x) = −1/x² in f''(x) = 2/x³ (x ≠ 0), ki pri 0 zamenja predznak.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#ena-skozi-x
besedilo: »Za $f(x) = \frac{1}{x}$ je $f''(x) = \frac{2}{x^3}$, ki pri $0$ zamenja predznak.« -/
theorem ena_skozi_x (x : ℝ) (hx : x ≠ 0) :
    HasDerivAt (fun x : ℝ => 1 / x) (-1 / x ^ 2) x ∧ HasDerivAt (fun x : ℝ => -1 / x ^ 2) (2 / x ^ 3) x ∧
    (x < 0 → 2 / x ^ 3 < 0) ∧ (0 < x → 0 < 2 / x ^ 3) := by
  refine ⟨((hasDerivAt_const x (1:ℝ)).div (hasDerivAt_id' x) hx).congr_deriv (by ring), ?_,
    fun h => div_neg_of_pos_of_neg two_pos (Odd.pow_neg (by decide) h), fun h => by positivity⟩
  exact ((hasDerivAt_const x (-1:ℝ)).div (hasDerivAt_pow 2 x) (pow_ne_zero 2 hx)).congr_deriv
    (by field_simp; ring)

/-- Predpostavke trditve `ena_skozi_x` se dajo izpolniti (x = 1). -/
example : (1:ℝ) ≠ 0 := one_ne_zero

/-! ## Za maturo -/

/-- Predpostavke trditve `ena_skozi_x` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 := one_ne_zero
  ena_skozi_x (hx := w)

/-- Naloga 1: prvi odvod (odvod funkcije), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#m1-d1
besedilo: »a) $f'(x) = 4x^3 - 12x^2 = 4x^2(x - 3)$.« -/
theorem m1_d1 (x : ℝ) : HasDerivAt (fun x : ℝ => x ^ 4 - 4 * x ^ 3 + 10) (4 * x ^ 3 - 12 * x ^ 2) x :=
  (((hasDerivAt_pow 4 x).sub ((hasDerivAt_pow 3 x).const_mul 4)).add_const 10).congr_deriv
    (by push_cast; ring)

/-- Naloga 1: drugi odvod (odvod prvega odvoda), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#m1-d2
besedilo: »a) $f''(x) = 12x^2 - 24x = 12x(x - 2)$.« -/
theorem m1_d2 (x : ℝ) : HasDerivAt (fun x : ℝ => 4 * x ^ 3 - 12 * x ^ 2) (12 * x ^ 2 - 24 * x) x :=
  (((hasDerivAt_pow 3 x).const_mul 4).sub ((hasDerivAt_pow 2 x).const_mul 12)).congr_deriv
    (by push_cast; ring)

/-- Naloga 1 a), b): f' = 4x³ − 12x² = 4x²(x − 3), f'' = 12x² − 24x = 12x(x − 2); ničli f'' sta 0 in 2,
f'' < 0 natanko na (0, 2); f''(−1) = 36, f''(1) = −12, f''(3) = 36; f konveksna na (−∞, 0) in (2, ∞),
konkavna na (0, 2); f(0) = 10, f(2) = 16 − 32 + 10 = −6.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#matura1-ab
besedilo: »b) $f$ je konveksna na $(-\infty, 0)$ in na $(2, \infty)$, konkavna na $(0, 2)$. V obeh ničlah $f''$ zamenja predznak. 5. b) $f(0) = 10$ in $f(2) = 16 - 32 + 10 = -6$, zato sta prevoja $P_1(0, 10)$ in $P_2(2, -6)$.« -/
theorem matura1_ab (x : ℝ) :
    4 * x ^ 3 - 12 * x ^ 2 = 4 * x ^ 2 * (x - 3) ∧ 12 * x ^ 2 - 24 * x = 12 * x * (x - 2) ∧
    (12 * x ^ 2 - 24 * x = 0 ↔ x = 0 ∨ x = 2) ∧ (12 * x ^ 2 - 24 * x < 0 ↔ 0 < x ∧ x < 2) ∧
    (12:ℝ) * (-1) ^ 2 - 24 * (-1) = 36 ∧ (12:ℝ) * 1 ^ 2 - 24 * 1 = -12 ∧ (12:ℝ) * 3 ^ 2 - 24 * 3 = 36 ∧
    StrictConvexOn ℝ (Iio 0) (fun x : ℝ => x ^ 4 - 4 * x ^ 3 + 10) ∧
    StrictConcaveOn ℝ (Ioo 0 2) (fun x : ℝ => x ^ 4 - 4 * x ^ 3 + 10) ∧
    StrictConvexOn ℝ (Ioi 2) (fun x : ℝ => x ^ 4 - 4 * x ^ 3 + 10) ∧
    (0:ℝ) ^ 4 - 4 * 0 ^ 3 + 10 = 10 ∧ (2:ℝ) ^ 4 - 4 * 2 ^ 3 + 10 = 16 - 32 + 10 ∧ (16:ℝ) - 32 + 10 = -6 := by
  refine ⟨by ring, by ring, ⟨fun h => ?_, ?_⟩, ⟨fun h => ⟨by nlinarith, by nlinarith⟩,
    fun h => by nlinarith [h.1, h.2]⟩, by norm_num, by norm_num, by norm_num,
    konveksna m1_d1 m1_d2 (convex_Iio _) fun y hy => ?_,
    konkavna m1_d1 m1_d2 (convex_Ioo _ _) fun y hy => ?_,
    konveksna m1_d1 m1_d2 (convex_Ioi _) fun y hy => ?_, by norm_num, by norm_num, by norm_num⟩
  · have : x * (x - 2) = 0 := by nlinarith
    rcases mul_eq_zero.mp this with h | h
    · left; exact h
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num
  · rw [interior_Iio] at hy; have : y < 0 := hy; nlinarith
  · rw [interior_Ioo] at hy; nlinarith [hy.1, hy.2]
  · rw [interior_Ioi] at hy; have : 2 < y := hy; nlinarith

/-- Naloga 1 c): stacionarni točki sta 0 in 3; f''(3) = 108 − 72 = 36 > 0, lokalni minimum
f(3) = 81 − 108 + 10 = −17; f''(0) = 0 ne odloči, 4x²(x − 3) je levo in desno od 0 negativen, v 0 ni
ekstrema.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#matura1-c
besedilo: »c) $f''(3) = 108 - 72 = 36 > 0$, zato je v $x = 3$ lokalni minimum $f(3) = 81 - 108 + 10 = -17$, točka $(3, -17)$. 8. c) $f''(0) = 0$, zato drugi odvod o vrsti ne odloči. Izraz $4x^2(x - 3)$ je levo in desno od $0$ negativen, $f'$ predznaka ne zamenja, zato v $x = 0$ ni ekstrema: točka $(0, 10)$ je prevoj z vodoravno tangento.« -/
theorem matura1_c (x : ℝ) :
    (4 * x ^ 2 * (x - 3) = 0 ↔ x = 0 ∨ x = 3) ∧ (12:ℝ) * 3 ^ 2 - 24 * 3 = 108 - 72 ∧
    (108:ℝ) - 72 = 36 ∧ IsLocalMin (fun x : ℝ => x ^ 4 - 4 * x ^ 3 + 10) 3 ∧
    (3:ℝ) ^ 4 - 4 * 3 ^ 3 + 10 = 81 - 108 + 10 ∧ (81:ℝ) - 108 + 10 = -17 ∧
    (12:ℝ) * 0 ^ 2 - 24 * 0 = 0 ∧ (∀ y : ℝ, y ≠ 0 → y < 3 → 4 * y ^ 2 * (y - 3) < 0) ∧
    ¬ IsLocalMax (fun x : ℝ => x ^ 4 - 4 * x ^ 3 + 10) 0 ∧
    ¬ IsLocalMin (fun x : ℝ => x ^ 4 - 4 * x ^ 3 + 10) 0 := by
  refine ⟨⟨fun h => ?_, ?_⟩, by norm_num, by norm_num, test_minimum m1_d1 m1_d2 (by norm_num) (by norm_num),
    by norm_num, by norm_num, by norm_num, fun y hy h3 => ?_, fun h => ?_, fun h => ?_⟩
  · rcases mul_eq_zero.mp h with h | h
    · left; have : x ^ 2 = 0 := by linarith
      exact pow_eq_zero_iff (n := 2) (by norm_num) |>.mp this
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num
  · have : 0 < y ^ 2 := by positivity
    nlinarith
  · obtain ⟨y, ⟨hy, hy1⟩, hy0⟩ := ((h.filter_mono (nhdsWithin_le_nhds (s := Iio 0))).and
      (nhdsWithin_le_nhds (Ioo_mem_nhds (show (-1:ℝ) < 0 by norm_num) (show (0:ℝ) < 1 by norm_num)))).and
      self_mem_nhdsWithin |>.exists
    have hy0' : y < 0 := hy0
    have : 0 < y ^ 3 * (y - 4) := mul_pos_of_neg_of_neg (Odd.pow_neg (by decide) hy0') (by linarith)
    simp only at hy; nlinarith
  · obtain ⟨y, ⟨hy, hy1⟩, hy0⟩ := ((h.filter_mono (nhdsWithin_le_nhds (s := Ioi 0))).and
      (nhdsWithin_le_nhds (Ioo_mem_nhds (show (-1:ℝ) < 0 by norm_num) (show (0:ℝ) < 1 by norm_num)))).and
      self_mem_nhdsWithin |>.exists
    have hy0' : 0 < y := hy0
    have : y ^ 3 * (y - 4) < 0 := mul_neg_of_pos_of_neg (by positivity) (by linarith [hy1.2])
    simp only at hy; nlinarith

/-- Naloga 2: prvi odvod (odvod funkcije), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#m2-d1
besedilo: »$f'(x) = 2x\,e^x + (x^2 - 3)\,e^x = (x^2 + 2x - 3)\,e^x$« -/
theorem m2_d1 (x : ℝ) :
    HasDerivAt (fun x : ℝ => (x ^ 2 - 3) * exp x) (2 * x * exp x + (x ^ 2 - 3) * exp x) x :=
  (((hasDerivAt_pow 2 x).sub_const 3).mul (hasDerivAt_exp x)).congr_deriv (by push_cast; ring)

/-- Naloga 2: prvi odvod (odvod funkcije), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#m2-d1-crtica
besedilo: »$f'(x) = 2x\,e^x + (x^2 - 3)\,e^x = (x^2 + 2x - 3)\,e^x$« -/
theorem m2_d1' (x : ℝ) : HasDerivAt (fun x : ℝ => (x ^ 2 - 3) * exp x) ((x ^ 2 + 2 * x - 3) * exp x) x :=
  (m2_d1 x).congr_deriv (by ring)

/-- Naloga 2: drugi odvod (odvod prvega odvoda), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#m2-d2
besedilo: »$f''(x) = (2x + 2)\,e^x + (x^2 + 2x - 3)\,e^x = (x^2 + 4x - 1)\,e^x$« -/
theorem m2_d2 (x : ℝ) :
    HasDerivAt (fun x : ℝ => (x ^ 2 + 2 * x - 3) * exp x)
      ((2 * x + 2) * exp x + (x ^ 2 + 2 * x - 3) * exp x) x :=
  ((((hasDerivAt_pow 2 x).add ((hasDerivAt_id' x).const_mul 2)).sub_const 3).mul
    (hasDerivAt_exp x)).congr_deriv (by simp only [Pi.add_apply]; push_cast; ring)

/-- Naloga 2: drugi odvod (odvod prvega odvoda), kot je zapisan v lekciji.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#m2-d2-crtica
besedilo: »$f''(x) = (2x + 2)\,e^x + (x^2 + 2x - 3)\,e^x = (x^2 + 4x - 1)\,e^x$« -/
theorem m2_d2' (x : ℝ) :
    HasDerivAt (fun x : ℝ => (x ^ 2 + 2 * x - 3) * exp x) ((x ^ 2 + 4 * x - 1) * exp x) x :=
  (m2_d2 x).congr_deriv (by ring)

/-- Naloga 2 a), b): f' = 2x eˣ + (x² − 3)eˣ = (x² + 2x − 3)eˣ, f'' = (2x + 2)eˣ + (x² + 2x − 3)eˣ
= (x² + 4x − 1)eˣ; f' = 0 ⇔ (x + 3)(x − 1) = 0 ⇔ x = −3 ali 1; f''(−3) = (9 − 12 − 1)e^{−3} = −4e^{−3} < 0,
maksimum f(−3) = 6e^{−3} ≐ 0,2987; f''(1) = 4e > 0, minimum f(1) = −2e ≐ −5,4366.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#matura2-ab
besedilo: »b) Ker je $e^x > 0$, je $f'(x) = 0$ natanko pri $x^2 + 2x - 3 = (x + 3)(x - 1) = 0$, torej pri $x = -3$ in $x = 1$. 4. b) $f''(-3) = (9 - 12 - 1)\,e^{-3} = -4e^{-3} < 0$: lokalni maksimum $f(-3) = 6e^{-3} \doteq 0{,}2987$, točka $(-3; 0{,}30)$. 5. b) $f''(1) = 4e > 0$: lokalni minimum $f(1) = -2e \doteq -5{,}4366$, točka $(1; -5{,}44)$.« -/
theorem matura2_ab (x : ℝ) :
    2 * x * exp x + (x ^ 2 - 3) * exp x = (x ^ 2 + 2 * x - 3) * exp x ∧
    (2 * x + 2) * exp x + (x ^ 2 + 2 * x - 3) * exp x = (x ^ 2 + 4 * x - 1) * exp x ∧
    x ^ 2 + 2 * x - 3 = (x + 3) * (x - 1) ∧
    ((x ^ 2 + 2 * x - 3) * exp x = 0 ↔ x = -3 ∨ x = 1) ∧
    ((-3) ^ 2 + 4 * (-3) - 1) * exp (-3) = (9 - 12 - 1) * exp (-3) ∧
    (9 - 12 - 1) * exp (-3) = -4 * exp (-3) ∧ -4 * exp (-3) < 0 ∧
    IsLocalMax (fun x : ℝ => (x ^ 2 - 3) * exp x) (-3) ∧ ((-3) ^ 2 - 3) * exp (-3) = 6 * exp (-3) ∧
    (0.29865 < 6 * exp (-3) ∧ 6 * exp (-3) < 0.29875) ∧
    ((1:ℝ) ^ 2 + 4 * 1 - 1) * exp 1 = 4 * exp 1 ∧ 0 < 4 * exp 1 ∧
    IsLocalMin (fun x : ℝ => (x ^ 2 - 3) * exp x) 1 ∧ ((1:ℝ) ^ 2 - 3) * exp 1 = -2 * exp 1 ∧
    (-5.43665 < -2 * exp 1 ∧ -2 * exp 1 < -5.43655) := by
  have e1 := exp_one_gt_d9
  have e2 := exp_one_lt_d9
  have hE3 : exp (-3) = 1 / (exp 1 * exp 1 * exp 1) := by
    rw [show (-3:ℝ) = -(1 + 1 + 1) by norm_num, exp_neg, exp_add, exp_add, one_div]
  have hp : 0 < exp 1 := exp_pos 1
  refine ⟨by ring, by ring, by ring, ⟨fun h => ?_, ?_⟩, by norm_num, by norm_num,
    by nlinarith [exp_pos (-3)], test_maksimum m2_d1' m2_d2' (by norm_num) (by norm_num; exact exp_pos _),
    by norm_num, ⟨?_, ?_⟩, by norm_num, by positivity,
    test_minimum m2_d1' m2_d2' (by norm_num) (by norm_num; exact exp_pos _), by norm_num,
    ⟨by linarith, by linarith⟩⟩
  · rcases mul_eq_zero.mp h with h | h
    · have : (x + 3) * (x - 1) = 0 := by linarith
      rcases mul_eq_zero.mp this with h | h
      · left; linarith
      · right; linarith
    · exact absurd h (exp_pos _).ne'
  · rintro (rfl | rfl) <;> norm_num
  · rw [hE3, mul_one_div, lt_div_iff₀ (by positivity)]; nlinarith [mul_pos hp hp]
  · rw [hE3, mul_one_div, div_lt_iff₀ (by positivity)]; nlinarith [mul_pos hp hp]

/-- Naloga 2 c), d): f'' = 0 ⇔ x² + 4x − 1 = 0 ⇔ x = −2 ± √5 (≐ −4,2361 in 0,2361); ničli sta enostavni,
polinom je med njima negativen, zunaj pozitiven: f je konkavna na (−2 − √5, −2 + √5), konveksna zunaj;
ordinati sta (6 + 4√5)e^{−2−√5} in (6 − 4√5)e^{−2+√5}.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#matura2-cd
besedilo: »d) Polinom $x^2 + 4x - 1$ je negativen med ničlama in pozitiven zunaj njiju. Zato je $f$ konveksna na $(-\infty, -2 - \sqrt{5})$ in na $(-2 + \sqrt{5}, \infty)$, konkavna pa na $(-2 - \sqrt{5}, -2 + \sqrt{5})$, približno na $(-4{,}24; 0{,}24)$.« -/
theorem matura2_cd (x : ℝ) :
    (x ^ 2 + 4 * x - 1 = 0 ↔ x = -2 - √5 ∨ x = -2 + √5) ∧
    (x ^ 2 + 4 * x - 1 < 0 ↔ -2 - √5 < x ∧ x < -2 + √5) ∧
    (-4.23615 < -2 - √5 ∧ -2 - √5 < -4.23605) ∧ (0.23605 < -2 + √5 ∧ -2 + √5 < 0.23615) ∧
    StrictConcaveOn ℝ (Ioo (-2 - √5) (-2 + √5)) (fun x : ℝ => (x ^ 2 - 3) * exp x) ∧
    StrictConvexOn ℝ (Iio (-2 - √5)) (fun x : ℝ => (x ^ 2 - 3) * exp x) ∧
    StrictConvexOn ℝ (Ioi (-2 + √5)) (fun x : ℝ => (x ^ 2 - 3) * exp x) ∧
    ((-2 - √5) ^ 2 - 3) * exp (-2 - √5) = (6 + 4 * √5) * exp (-2 - √5) ∧
    ((-2 + √5) ^ 2 - 3) * exp (-2 + √5) = (6 - 4 * √5) * exp (-2 + √5) := by
  have s5 : √5 ^ 2 = 5 := sq_sqrt (by norm_num)
  have s0 : 0 < √5 := by positivity
  have fac : ∀ y : ℝ, y ^ 2 + 4 * y - 1 = (y - (-2 - √5)) * (y - (-2 + √5)) := fun y => by
    nlinarith [s5]
  have b1 : 2.23605 < √5 := by
    rw [show (2.23605:ℝ) = √(2.23605 ^ 2) by rw [sqrt_sq (by norm_num)]]
    exact sqrt_lt_sqrt (by norm_num) (by norm_num)
  have b2 : √5 < 2.23615 := by
    rw [show (2.23615:ℝ) = √(2.23615 ^ 2) by rw [sqrt_sq (by norm_num)]]
    exact sqrt_lt_sqrt (by norm_num) (by norm_num)
  refine ⟨⟨fun h => ?_, ?_⟩, ⟨fun h => ?_, fun h => ?_⟩, ⟨by linarith, by linarith⟩,
    ⟨by linarith, by linarith⟩, konkavna m2_d1' m2_d2' (convex_Ioo _ _) fun y hy => ?_,
    konveksna m2_d1' m2_d2' (convex_Iio _) fun y hy => ?_,
    konveksna m2_d1' m2_d2' (convex_Ioi _) fun y hy => ?_, ?_, ?_⟩
  · rw [fac] at h
    rcases mul_eq_zero.mp h with h | h
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> nlinarith [s5]
  · rw [fac] at h
    rcases lt_or_ge x (-2 - √5) with h1 | h1
    · nlinarith
    · rcases lt_or_ge x (-2 + √5) with h2 | h2
      · exact ⟨lt_of_le_of_ne h1 (by rintro rfl; simp at h), h2⟩
      · nlinarith
  · rw [fac]; exact mul_neg_of_pos_of_neg (by linarith [h.1]) (by linarith [h.2])
  · rw [interior_Ioo] at hy
    have h1 : y ^ 2 + 4 * y - 1 < 0 := by
      rw [fac]; exact mul_neg_of_pos_of_neg (by linarith [hy.1]) (by linarith [hy.2])
    exact mul_neg_of_neg_of_pos h1 (exp_pos _)
  · rw [interior_Iio] at hy; have : y < -2 - √5 := hy
    have h1 : 0 < y ^ 2 + 4 * y - 1 := by
      rw [fac]; exact mul_pos_of_neg_of_neg (by linarith) (by linarith)
    exact mul_pos h1 (exp_pos _)
  · rw [interior_Ioi] at hy; have : -2 + √5 < y := hy
    have h1 : 0 < y ^ 2 + 4 * y - 1 := by
      rw [fac]; exact mul_pos (by linarith) (by linarith)
    exact mul_pos h1 (exp_pos _)
  · congr 1; nlinarith [s5]
  · congr 1; nlinarith [s5]

/-! ## Drugače in Preveri se -/

/-- Drugače (tabela): (x³)'' = 6x da −0,6, 0, 0,6; (x⁴)'' = 12x² da 0,12, 0, 0,12; (−0,1)³ = −0,001 je pod
tangento y = 0, 0,1³ = 0,001 nad njo; (±0,1)⁴ = 0,0001.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#drugace
besedilo: »| $-0{,}1$ | $-0{,}6$ | $0{,}12$ | | $0$ | $0$ | $0$ | | $0{,}1$ | $0{,}6$ | $0{,}12$ | 1. Pri $x^3$ se predznak zamenja iz $-$ v $+$: v $(0, 0)$ je prevoj. 2. Pri $x^4$ je predznak na obeh straneh $+$: prevoja ni, funkcija je povsod konveksna. 3. Preizkus s tangento: tangenta na $x^3$ v $0$ je os $x$. Vrednost $(-0{,}1)^3 = -0{,}001$ je pod njo, $0{,}1^3 = 0{,}001$ nad njo: tangenta graf res preseka. 4. Pri $x^4$ sta obe vrednosti $0{,}0001$ nad osjo $x$: graf leži nad tangento, ne preseka je.« -/
theorem drugace :
    (6:ℝ) * (-0.1) = -0.6 ∧ (6:ℝ) * 0 = 0 ∧ (6:ℝ) * 0.1 = 0.6 ∧ (12:ℝ) * (-0.1) ^ 2 = 0.12 ∧
    (12:ℝ) * 0 ^ 2 = 0 ∧ (12:ℝ) * 0.1 ^ 2 = 0.12 ∧ (-0.1:ℝ) ^ 3 = -0.001 ∧ (0.1:ℝ) ^ 3 = 0.001 ∧
    (-0.1:ℝ) ^ 4 = 0.0001 ∧ (0.1:ℝ) ^ 4 = 0.0001 := by norm_num

/-- Preveri se 2: za f' = x² − 3x + 1 je f'' = 2x − 3 = 0 ⇔ x = 1,5; f' ima tam najmanjšo vrednost −1,25;
ničli f' sta (3 ± √5)/2 ≈ 0,4 in 2,6.
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#kviz2
besedilo: »V prevoju ima $f'$ ekstrem. Najnižja točka parabole je na sredini med ničlama, pri $x = 1{,}5$.« -/
theorem kviz2 (x : ℝ) :
    HasDerivAt (fun x : ℝ => x ^ 2 - 3 * x + 1) (2 * x - 3) x ∧ (2 * x - 3 = 0 ↔ x = 1.5) ∧
    -1.25 ≤ x ^ 2 - 3 * x + 1 ∧ (1.5:ℝ) ^ 2 - 3 * 1.5 + 1 = -1.25 ∧
    (x ^ 2 - 3 * x + 1 = 0 ↔ x = (3 - √5) / 2 ∨ x = (3 + √5) / 2) ∧
    (0.35 < (3 - √5) / 2 ∧ (3 - √5) / 2 < 0.45) ∧ (2.55 < (3 + √5) / 2 ∧ (3 + √5) / 2 < 2.65) := by
  have s5 : √5 ^ 2 = 5 := sq_sqrt (by norm_num)
  have b1 : 2.1 < √5 := by
    rw [show (2.1:ℝ) = √(2.1 ^ 2) by rw [sqrt_sq (by norm_num)]]
    exact sqrt_lt_sqrt (by norm_num) (by norm_num)
  have b2 : √5 < 2.3 := by
    rw [show (2.3:ℝ) = √(2.3 ^ 2) by rw [sqrt_sq (by norm_num)]]
    exact sqrt_lt_sqrt (by norm_num) (by norm_num)
  refine ⟨?_, ⟨fun h => by linarith, fun h => by subst h; norm_num⟩, by nlinarith [sq_nonneg (x - 1.5)],
    by norm_num, ⟨fun h => ?_, ?_⟩, ⟨by linarith, by linarith⟩, ⟨by linarith, by linarith⟩⟩
  · exact (((hasDerivAt_pow 2 x).sub ((hasDerivAt_id' x).const_mul 3)).add_const 1).congr_deriv
      (by push_cast; ring)
  · have : (x - (3 - √5) / 2) * (x - (3 + √5) / 2) = 0 := by nlinarith [s5]
    rcases mul_eq_zero.mp this with h | h
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> nlinarith [s5]

/-- Preveri se 4: za f(x) = x³ + kx² + 1 je f''(x) = 6x + 2k; f''(2) = 12 + 2k = 0 ⇔ k = −6, takrat je
f'' = 6x − 12, ki v 2 zamenja predznak; (napačno: f'(2) = 12 + 4k = 0 da k = −3).
trditev: MAT-SS-4/drugi-odvod-prevoj-in-konveksnost#kviz4
besedilo: »$f''(x) = 6x + 2k$. Iz $f''(2) = 12 + 2k = 0$ sledi $k = -6$. Takrat je $f''(x) = 6x - 12$, ki pri $x = 2$ res zamenja predznak.« -/
theorem kviz4 (k x : ℝ) :
    deriv^[2] (fun x : ℝ => x ^ 3 + k * x ^ 2 + 1) x = 6 * x + 2 * k ∧ (6 * 2 + 2 * k = 0 ↔ k = -6) ∧
    (x < 2 → 6 * x - 12 < 0) ∧ (2 < x → 0 < 6 * x - 12) ∧ (3 * 2 ^ 2 + 2 * k * 2 = 0 ↔ k = -3) := by
  refine ⟨drugi_odvod (f₁ := fun x => 3 * x ^ 2 + 2 * k * x) (f₂ := fun x => 6 * x + 2 * k)
    (fun x => (((hasDerivAt_pow 3 x).add ((hasDerivAt_pow 2 x).const_mul k)).add_const 1).congr_deriv
      (by push_cast; ring))
    (fun x => (((hasDerivAt_pow 2 x).const_mul 3).add ((hasDerivAt_id' x).const_mul (2 * k))).congr_deriv
      (by push_cast; ring)) x,
    ⟨fun h => by linarith, fun h => by subst h; norm_num⟩, fun h => by linarith, fun h => by linarith,
    ⟨fun h => by linarith, fun h => by subst h; norm_num⟩⟩

/-! ## Primeri izpolnljivosti (izrek, uporabljen na konkretnih vrednostih) -/

/-- Predpostavke trditve `konveksna` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (∀ x : ℝ, HasDerivAt (fun x : ℝ => x ^ 2) (2 * x) x) ∧ (∀ x : ℝ, HasDerivAt (fun x : ℝ => 2 * x) ((fun _ => (2:ℝ)) x) x) ∧ ∀ x ∈ interior (univ : Set ℝ), (0:ℝ) < (fun _ => (2:ℝ)) x :=
    ⟨fun x => (hasDerivAt_pow 2 x).congr_deriv (by norm_num),
      fun x => ((hasDerivAt_id' x).const_mul 2).congr_deriv (by ring), fun _ _ => two_pos⟩
  konveksna (h₁ := w.1) (h₂ := w.2.1) (hD := convex_univ) (hp := w.2.2)

/-- Predpostavke trditve `konkavna` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  konkavna (h₁ := konkavna_izpolnljivo.1) (h₂ := konkavna_izpolnljivo.2.1) (hD := convex_univ)
    (hn := konkavna_izpolnljivo.2.2)

/-- Predpostavke trditve `nad_tangento` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ConvexOn ℝ univ (fun x : ℝ => x ^ 2) ∧ HasDerivAt (fun x : ℝ => x ^ 2) 0 0 :=
    ⟨Even.convexOn_pow (by decide), (hasDerivAt_pow 2 (0:ℝ)).congr_deriv (by norm_num)⟩
  nad_tangento (hf := w.1) (hx := Set.mem_univ 0) (hy := Set.mem_univ 1) (hd := w.2)

/-- Predpostavke trditve `pod_tangento` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ConcaveOn ℝ univ (fun x : ℝ => -x ^ 2) ∧ HasDerivAt (fun x : ℝ => -x ^ 2) 0 0 :=
    ⟨(Even.convexOn_pow (𝕜 := ℝ) (n := 2) (by decide)).neg,
      ((hasDerivAt_pow 2 (0:ℝ)).neg).congr_deriv (by norm_num)⟩
  pod_tangento (hf := w.1) (hx := Set.mem_univ 0) (hy := Set.mem_univ 1) (hd := w.2)

/-- Predpostavke trditve `prevoj_potrebni_pogoj` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  prevoj_potrebni_pogoj (hδ := one_pos) (hd := prevoj_x3.1) (hs := Or.inl ⟨prevoj_x3.2.1, prevoj_x3.2.2.1⟩)

end Evklid.Lekcije.MAT_SS_4.DrugiOdvodPrevojInKonveksnost
