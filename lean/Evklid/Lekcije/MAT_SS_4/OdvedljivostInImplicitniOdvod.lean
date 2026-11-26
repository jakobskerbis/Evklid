/-
vir: content/lessons/MAT-SS-4/odvedljivost-in-implicitni-odvod.md
sha256: 0e667799f871b76ead1207d97f6a552c81e1981dc18cc38b5f2ee97cf9ffe0f6
Ni v Leanu: zgodba o medicinski sestri, povečevalno steklo, risbe, simulacija, analogije (vlak, vrv, EKG);
neodvedljivost ∛(x²) (ost) in ∛x (navpična tangenta) v 0 ter skok in navpična tangenta v točkah C in D
kviza 1 (Mathlib nima realnega kubičnega korena za negativna števila; dokazano je le, da ∛h/h pri h → 0⁺
raste čez vse meje, z ∛h = h^(1/3) za h > 0); risanje grafov v nalogah 1 in 2; trditev »tangenta je
navpična premica x = 5 / x = 4« kot geometrijski pojem (dokazano je, da v (5, 0) in v B(4, 2) ni odvedljive
implicitne funkcije in da premica x = 4 seka K le v B); kviz 4 (1/x na (0, 5) ni definirana v 0: pojem
definicijskega območja); razvrščanje korakov (kviz 6); točkovanje. Funkcija c iz Primera 1 je zapisana na
vsem ℝ (za t < 0 kot 4t), kar zveznosti in odvedljivosti v t = 2 ne spremeni.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.OdvedljivostInImplicitniOdvod

open Real Filter Topology Set

/-! ## Pomožne trditve -/

/-- Pomožna trditev (Razlaga 1, Povzetek): f je v a odvedljiva z odvodom f' natanko tedaj, ko imata
diferenčna količnika (f(a + h) − f(a))/h z leve in z desne limito f'.
pomozno -/
theorem odvedljiva_leva_desna (f : ℝ → ℝ) (a f' : ℝ) :
    HasDerivAt f f' a ↔
      Tendsto (fun h => (f (a + h) - f a) / h) (𝓝[<] 0) (𝓝 f') ∧
      Tendsto (fun h => (f (a + h) - f a) / h) (𝓝[>] 0) (𝓝 f') := by
  rw [hasDerivAt_iff_tendsto_slope_zero, ← Iio_union_Ioi, nhdsWithin_union, tendsto_sup]
  simp only [smul_eq_mul, div_eq_inv_mul]

/-- Pomožna trditev (vogal): če se f levo od a (do a) ujema z g, desno (od a) pa s k, in sta smerna
koeficienta g'(a) ≠ k'(a) različna, f v a ni odvedljiva.
pomozno -/
theorem ni_odvedljiva_vogal {f g k : ℝ → ℝ} {a g' k' δ : ℝ} (hδ : 0 < δ)
    (hl : ∀ t, a - δ < t → t ≤ a → f t = g t) (hr : ∀ t, a ≤ t → t < a + δ → f t = k t)
    (hg : HasDerivAt g g' a) (hk : HasDerivAt k k' a) (hne : g' ≠ k') : ¬ DifferentiableAt ℝ f a := by
  intro hd
  have hf := hd.hasDerivAt
  have hU : Ioo (a - δ) (a + δ) ∈ 𝓝 a := Ioo_mem_nhds (by linarith) (by linarith)
  have el : f =ᶠ[𝓝[Iic a] a] g := by
    filter_upwards [self_mem_nhdsWithin, nhdsWithin_le_nhds hU] with t ht1 ht2
    exact hl t ht2.1 ht1
  have er : f =ᶠ[𝓝[Ici a] a] k := by
    filter_upwards [self_mem_nhdsWithin, nhdsWithin_le_nhds hU] with t ht1 ht2
    exact hr t ht1 ht2.2
  have h1 : HasDerivWithinAt f g' (Iic a) a :=
    hg.hasDerivWithinAt.congr_of_eventuallyEq el (hl a (by linarith) le_rfl)
  have h2 : HasDerivWithinAt f k' (Ici a) a :=
    hk.hasDerivWithinAt.congr_of_eventuallyEq er (hr a le_rfl (by linarith))
  have e1 := (uniqueDiffWithinAt_Iic a).eq_deriv _ hf.hasDerivWithinAt h1
  have e2 := (uniqueDiffWithinAt_Ici a).eq_deriv _ hf.hasDerivWithinAt h2
  exact hne (e1.symm.trans e2)

/-- Predpostavke trditve `ni_odvedljiva_vogal` so izpolnljive (|x| v 0). -/
example : (0:ℝ) < 1 ∧ (∀ t : ℝ, 0 - 1 < t → t ≤ 0 → |t| = -t) ∧ (∀ t : ℝ, 0 ≤ t → t < 0 + 1 → |t| = t) ∧
    HasDerivAt (fun t : ℝ => -t) (-1) 0 ∧ HasDerivAt (fun t : ℝ => t) 1 0 ∧ (-1:ℝ) ≠ 1 :=
  ⟨one_pos, fun t _ h => abs_of_nonpos h, fun t h _ => abs_of_nonneg h, (hasDerivAt_id' 0).neg,
    hasDerivAt_id' 0, by norm_num⟩

/-- Pomožna trditev (zveznost v točki stika): če se f levo od a ujema z zvezno g, desno z zvezno k,
je f v a zvezna.
pomozno -/
theorem zvezna_stik {f g k : ℝ → ℝ} {a δ : ℝ} (hδ : 0 < δ)
    (hl : ∀ t, a - δ < t → t ≤ a → f t = g t) (hr : ∀ t, a ≤ t → t < a + δ → f t = k t)
    (hg : ContinuousAt g a) (hk : ContinuousAt k a) : ContinuousAt f a := by
  have hU : Ioo (a - δ) (a + δ) ∈ 𝓝 a := Ioo_mem_nhds (by linarith) (by linarith)
  rw [continuousAt_iff_continuous_left_right]
  constructor
  · refine hg.continuousWithinAt.congr_of_eventuallyEq ?_ (hl a (by linarith) le_rfl)
    filter_upwards [self_mem_nhdsWithin, nhdsWithin_le_nhds hU] with t ht1 ht2
    exact hl t ht2.1 ht1
  · refine hk.continuousWithinAt.congr_of_eventuallyEq ?_ (hr a le_rfl (by linarith))
    filter_upwards [self_mem_nhdsWithin, nhdsWithin_le_nhds hU] with t ht1 ht2
    exact hr t ht1 ht2.2

/-- Predpostavke trditve `zvezna_stik` so izpolnljive (|x| v 0). -/
example : (0:ℝ) < 1 ∧ (∀ t : ℝ, 0 - 1 < t → t ≤ 0 → |t| = -t) ∧ (∀ t : ℝ, 0 ≤ t → t < 0 + 1 → |t| = t) ∧
    ContinuousAt (fun t : ℝ => -t) 0 ∧ ContinuousAt (fun t : ℝ => t) 0 :=
  ⟨one_pos, fun t _ h => abs_of_nonpos h, fun t h _ => abs_of_nonneg h, by fun_prop, by fun_prop⟩

/-! ## Razlaga, 1: povečevalno steklo -/

/-- Razlaga 1: za f(x) = x² je f'(1) = 2.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#kvadrat-v-1
besedilo: »1. Pogled skozi povečevalno steklo.** Na graf funkcije $f(x) = x^2$ postavi povečevalno steklo pri točki $(1, 1)$ in ga povečuj. Krivulja je v steklu vse bolj ravna in na koncu je videti kot premica, tangenta s smernim koeficientom $f'(1) = 2$.« -/
theorem kvadrat_v_1 : HasDerivAt (fun x : ℝ => x ^ 2) 2 1 :=
  (hasDerivAt_pow 2 (1:ℝ)).congr_deriv (by norm_num)

/-- Razlaga 1: diferenčni količnik |h|/h je −1 za h < 0 in 1 za h > 0; tabela pri ±0,1 in ±0,01.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#abs-kvocient
besedilo: »| $-0{,}01$ | $-1$ |« -/
theorem abs_kvocient :
    (∀ h : ℝ, h < 0 → |h| / h = -1) ∧ (∀ h : ℝ, 0 < h → |h| / h = 1) ∧
    |(-0.1:ℝ)| / (-0.1) = -1 ∧ |(-0.01:ℝ)| / (-0.01) = -1 ∧ |(0.01:ℝ)| / 0.01 = 1 ∧
    |(0.1:ℝ)| / 0.1 = 1 := by
  refine ⟨fun h hh => ?_, fun h hh => ?_, by norm_num [abs_of_neg], by norm_num [abs_of_neg],
    by norm_num, by norm_num⟩
  · rw [abs_of_neg hh, neg_div, div_self hh.ne]
  · rw [abs_of_pos hh, div_self hh.ne']

/-- Razlaga 1: z leve je limita |h|/h enaka −1, z desne 1; ker se razlikujeta, |x| v 0 ni odvedljiva.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#abs-v-nic
besedilo: »Z leve je limita $-1$, z desne $1$. Ker se razlikujeta, limita ne obstaja in $f'(0)$ ne obstaja.« -/
theorem abs_v_nic :
    Tendsto (fun h : ℝ => |h| / h) (𝓝[<] 0) (𝓝 (-1)) ∧
    Tendsto (fun h : ℝ => |h| / h) (𝓝[>] 0) (𝓝 1) ∧ ¬ DifferentiableAt ℝ (fun x : ℝ => |x|) 0 := by
  refine ⟨?_, ?_, ?_⟩
  · refine tendsto_const_nhds.congr' ?_
    filter_upwards [self_mem_nhdsWithin] with h hh using (abs_kvocient.1 h hh).symm
  · refine tendsto_const_nhds.congr' ?_
    filter_upwards [self_mem_nhdsWithin] with h hh using (abs_kvocient.2.1 h hh).symm
  · exact ni_odvedljiva_vogal (g := fun t => -t) (k := fun t => t) one_pos
      (fun t _ h => abs_of_nonpos h) (fun t h _ => abs_of_nonneg h) (hasDerivAt_id' 0).neg
      (hasDerivAt_id' 0) (by norm_num)

/-! ## Razlaga, 2: znaki na grafu (Premisli: ∛x) -/

/-- Razlaga 2, Premisli: ∛0,001 = 0,1 (ker je 0,1³ = 0,001) in 0,1/0,001 = 100; pri h = 0,000001 je
∛h = 0,01 in količnik 10 000.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#kubicni-koren-stevila
besedilo: »Pri $h = 0{,}001$ je $\sqrt[3]{0{,}001} = 0{,}1$ in količnik $\frac{0{,}1}{0{,}001} = 100$, pri $h = 0{,}000001$ že $10\,000$.« -/
theorem kubicni_koren_stevila :
    (0.1:ℝ) ^ 3 = 0.001 ∧ (0.1:ℝ) / 0.001 = 100 ∧ (0.01:ℝ) ^ 3 = 0.000001 ∧
    (0.01:ℝ) / 0.000001 = 10000 := by norm_num

/-- Razlaga 2, Premisli: za h > 0 količnik ∛h/h = h^(1/3)/h pri h → 0⁺ raste čez vse meje.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#kubicni-koren-kvocient
besedilo: »Raste čez vse meje. Pri $h = 0{,}001$ je $\sqrt[3]{0{,}001} = 0{,}1$ in količnik $\frac{0{,}1}{0{,}001} = 100$, pri $h = 0{,}000001$ že $10\,000$. Sekante so vse bolj navpične, končnega odvoda ni.« -/
theorem kubicni_koren_kvocient :
    Tendsto (fun h : ℝ => h ^ ((1:ℝ) / 3) / h) (𝓝[>] 0) atTop := by
  have := tendsto_rpow_neg_nhdsGT_zero (y := (1:ℝ) / 3 - 1) (by norm_num)
  refine this.congr' ?_
  filter_upwards [self_mem_nhdsWithin] with h hh
  exact rpow_sub_one (ne_of_gt hh) _

/-! ## Razlaga, 3: odvedljiva funkcija je zvezna (višja raven) -/

/-- Razlaga 3 in Ustno vprašanje 2: f(a + h) − f(a) = (f(a + h) − f(a))/h · h za h ≠ 0, in odvedljiva
funkcija je zvezna.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#odvedljiva-je-zvezna
besedilo: »Za $h \ne 0$ zapišemo $f(a + h) - f(a) = \frac{f(a + h) - f(a)}{h} \cdot h$.« -/
theorem odvedljiva_je_zvezna {f : ℝ → ℝ} {a f' : ℝ} (hf : HasDerivAt f f' a) :
    (∀ h : ℝ, h ≠ 0 → f (a + h) - f a = (f (a + h) - f a) / h * h) ∧ ContinuousAt f a :=
  ⟨fun h hh => by field_simp, hf.continuousAt⟩

/-- Predpostavka je izpolnljiva (f = x²). Trditev: `odvedljiva_je_zvezna`. -/
example : HasDerivAt (fun x : ℝ => x ^ 2) 2 1 := kvadrat_v_1

/-- Predpostavke trditve `odvedljiva_je_zvezna` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : HasDerivAt (fun x : ℝ => x ^ 2) 2 1 := kvadrat_v_1
  odvedljiva_je_zvezna (hf := w)

/-- Razlaga 3 (višja raven): obrat ne velja, |x| je v 0 zvezna, odvedljiva pa ne.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#obrat-ne-velja
besedilo: »(višja raven) Obrat ne velja: $|x|$ je v $0$ zvezna, odvedljiva pa ne.« -/
theorem obrat_ne_velja :
    ContinuousAt (fun x : ℝ => |x|) 0 ∧ ¬ DifferentiableAt ℝ (fun x : ℝ => |x|) 0 :=
  ⟨by fun_prop, abs_v_nic.2.2⟩

/-- Razlaga 3 in Preveri se 3: kjer funkcija ni zvezna (skok, luknja, pol), ni odvedljiva.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#nezvezna-ni-odvedljiva
besedilo: »(višja raven) Obrat ne velja: $|x|$ je v $0$ zvezna, odvedljiva pa ne. Velja pa enakovreden zapis izreka: kjer je funkcija nezvezna, ni odvedljiva. Zato je vsak skok, luknja ali pol hkrati točka neodvedljivosti.« -/
theorem nezvezna_ni_odvedljiva {f : ℝ → ℝ} {a : ℝ} (h : ¬ ContinuousAt f a) :
    ¬ DifferentiableAt ℝ f a := fun hd => h hd.continuousAt

/-- Predpostavka je izpolnljiva (predznačna funkcija ima v 0 skok). Trditev: `nezvezna_ni_odvedljiva`. -/
example : ¬ ContinuousAt (fun x : ℝ => if x ≤ 0 then (0:ℝ) else 1) 0 := by
  intro hc
  have h1 := hc.tendsto.mono_left (nhdsWithin_le_nhds (s := Ioi 0))
  have h2 : Tendsto (fun x : ℝ => if x ≤ 0 then (0:ℝ) else 1) (𝓝[>] 0) (𝓝 1) := by
    refine tendsto_const_nhds.congr' ?_
    filter_upwards [self_mem_nhdsWithin] with x hx
    simp [not_le.mpr (show (0:ℝ) < x from hx)]
  have := tendsto_nhds_unique h1 h2
  simp at this

/-- Predpostavke trditve `nezvezna_ni_odvedljiva` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ¬ ContinuousAt (fun x : ℝ => if x ≤ 0 then (0:ℝ) else 1) 0 := by
    intro hc
    have h1 := hc.tendsto.mono_left (nhdsWithin_le_nhds (s := Ioi 0))
    have h2 : Tendsto (fun x : ℝ => if x ≤ 0 then (0:ℝ) else 1) (𝓝[>] 0) (𝓝 1) := by
      refine tendsto_const_nhds.congr' ?_
      filter_upwards [self_mem_nhdsWithin] with x hx
      simp [not_le.mpr (show (0:ℝ) < x from hx)]
    have := tendsto_nhds_unique h1 h2
    simp at this
  nezvezna_ni_odvedljiva (h := w)

/-- Razlaga 3 in Preveri se 4: funkcija, odvedljiva v vsaki točki intervala, je na njem zvezna.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#odvedljiva-na-intervalu
besedilo: »(višja raven) Izrek velja v vsaki točki posebej, zato tudi na intervalu: funkcija, ki je odvedljiva v vsaki točki intervala, je na tem intervalu zvezna.« -/
theorem odvedljiva_na_intervalu {f : ℝ → ℝ} {s : Set ℝ} (h : DifferentiableOn ℝ f s) :
    ContinuousOn f s := h.continuousOn

/-- Predpostavka je izpolnljiva (x² na (0, 5)). Trditev: `odvedljiva_na_intervalu`. -/
example : DifferentiableOn ℝ (fun x : ℝ => x ^ 2) (Ioo 0 5) := by fun_prop

/-- Predpostavke trditve `odvedljiva_na_intervalu` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : DifferentiableOn ℝ (fun x : ℝ => x ^ 2) (Ioo 0 5) := by fun_prop
  odvedljiva_na_intervalu (h := w)

/-- Razlaga 3: x³ − 2x je odvedljiva na ℝ, zato zvezna na ℝ.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#primer-x3-2x
besedilo: »Na primer $x^3 - 2x$ je odvedljiva na $\mathbb{R}$, zato je na $\mathbb{R}$ zvezna.« -/
theorem primer_x3_2x :
    Differentiable ℝ (fun x : ℝ => x ^ 3 - 2 * x) ∧ Continuous (fun x : ℝ => x ^ 3 - 2 * x) :=
  ⟨by fun_prop, by fun_prop⟩

/-- Razlaga 3: |x| je zvezna na (−1, 1), odvedljiva na (−1, 0) in (0, 1), v 0 pa ne.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#abs-na-intervalu
besedilo: »Zvezna funkcija pa na intervalu ni nujno odvedljiva: $|x|$ je zvezna na $(-1, 1)$, odvedljiva pa le na $(-1, 0)$ in $(0, 1)$.« -/
theorem abs_na_intervalu :
    ContinuousOn (fun x : ℝ => |x|) (Ioo (-1) 1) ∧
    DifferentiableOn ℝ (fun x : ℝ => |x|) (Ioo (-1) 0) ∧
    DifferentiableOn ℝ (fun x : ℝ => |x|) (Ioo 0 1) ∧ ¬ DifferentiableAt ℝ (fun x : ℝ => |x|) 0 := by
  refine ⟨by fun_prop, fun x hx => ?_, fun x hx => ?_, abs_v_nic.2.2⟩
  · have : (fun x : ℝ => |x|) =ᶠ[𝓝 x] fun x => -x := by
      filter_upwards [Iio_mem_nhds hx.2] with t ht using abs_of_neg ht
    exact ((differentiableAt_id.neg).congr_of_eventuallyEq this).differentiableWithinAt
  · have : (fun x : ℝ => |x|) =ᶠ[𝓝 x] fun x => x := by
      filter_upwards [Ioi_mem_nhds hx.1] with t ht using abs_of_pos ht
    exact (differentiableAt_id.congr_of_eventuallyEq this).differentiableWithinAt

/-! ## Razlaga, 4: implicitni odvod krožnice (višja raven) -/

/-- Razlaga 4 in Ustno vprašanje 3: če je y odvedljiva v x₀ in blizu x₀ velja x² + y(x)² = C
(krožnica, C = r²), je 2x₀ + 2y y' = 0, za y ≠ 0 pa y' = −x/y.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#krog-implicitno
besedilo: »Pri krožnici dobimo $2x + 2y\,y' = 0$, torej $y' = -\frac{x}{y}$ za $y \ne 0$.« -/
theorem krog_implicitno {y : ℝ → ℝ} {x₀ y' C : ℝ} (hy : HasDerivAt y y' x₀)
    (he : ∀ᶠ x in 𝓝 x₀, x ^ 2 + y x ^ 2 = C) :
    2 * x₀ + 2 * y x₀ * y' = 0 ∧ (y x₀ ≠ 0 → y' = -x₀ / y x₀) := by
  have h1 : HasDerivAt (fun x => x ^ 2 + y x ^ 2) (2 * x₀ + 2 * y x₀ * y') x₀ :=
    ((hasDerivAt_pow 2 x₀).add (hy.pow 2)).congr_deriv (by push_cast; ring)
  have h2 : HasDerivAt (fun x => x ^ 2 + y x ^ 2) 0 x₀ :=
    (hasDerivAt_const x₀ C).congr_of_eventuallyEq he
  have e := h1.unique h2
  refine ⟨e, fun hne => ?_⟩
  field_simp; linarith

/-- RACUN: zgornji lok y = √(25 − x²) ima za x² < 25 odvod −x/√(25 − x²); v 3 je to −3/4.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#zgornji-lok
besedilo: »$y = -\frac{3}{4}x + \frac{25}{4}$« -/
theorem zgornji_lok (x : ℝ) (hx : x ^ 2 < 25) :
    HasDerivAt (fun x => √(25 - x ^ 2)) (-x / √(25 - x ^ 2)) x := by
  have hp : 0 < 25 - x ^ 2 := by linarith
  have h1 := hasDerivAt_sqrt hp.ne'
  have h2 : HasDerivAt (fun x : ℝ => 25 - x ^ 2) (-(2 * x)) x :=
    ((hasDerivAt_pow 2 x).const_sub 25).congr_deriv (by norm_num)
  have hs : 0 < √(25 - x ^ 2) := sqrt_pos.mpr hp
  exact (h1.comp x h2).congr_deriv (by field_simp)

/-- Predpostavke trditve `zgornji_lok` se dajo izpolniti (x = 3). -/
example : (3:ℝ) ^ 2 < 25 := by norm_num

/-- Predpostavke trditve `zgornji_lok` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (3:ℝ) ^ 2 < 25 := by norm_num
  zgornji_lok (hx := w)

/-- Razlaga 4: predpostavke trditve `krog_implicitno` so izpolnljive: zgornji lok y = √(25 − x²) blizu
x = 3, y(3) = 4, y'(3) = −3/4.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#krog-lok-v-3
besedilo: »$y = -\frac{3}{4}x + \frac{25}{4}$« -/
theorem krog_lok_v_3 :
    HasDerivAt (fun x => √(25 - x ^ 2)) (-3 / 4) 3 ∧
    (∀ᶠ x in 𝓝 (3:ℝ), x ^ 2 + √(25 - x ^ 2) ^ 2 = 25) ∧ √(25 - (3:ℝ) ^ 2) = 4 := by
  have s : √(25 - (3:ℝ) ^ 2) = 4 := by
    rw [show (25:ℝ) - 3 ^ 2 = 4 ^ 2 by norm_num, sqrt_sq (by norm_num)]
  refine ⟨(zgornji_lok 3 (by norm_num)).congr_deriv (by norm_num [s]), ?_, s⟩
  filter_upwards [Ioo_mem_nhds (show (2:ℝ) < 3 by norm_num) (show (3:ℝ) < 4 by norm_num)] with x hx
  rw [sq_sqrt (by nlinarith [hx.1, hx.2])]; ring

/-- Razlaga 4: v T(3, 4) je y' = −3/4; tangenta y − 4 = −3/4 (x − 3) je y = −3/4 x + 25/4; polmer ima
naklon 4/3 in produkt naklonov je −1.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#krog-tangenta
besedilo: »V točki $T$: $y' = -\frac{3}{4}$. Tangenta je $y - 4 = -\frac{3}{4}(x - 3)$ oziroma $y = -\frac{3}{4}x + \frac{25}{4}$. Polmer do $T$ ima naklon $\frac{4}{3}$, produkt naklonov je $-1$: tangenta je pravokotna na polmer, kot ve geometrija.« -/
theorem krog_tangenta (x y : ℝ) :
    -(3:ℝ) / 4 = -3 / 4 ∧ (y - 4 = -3 / 4 * (x - 3) ↔ y = -3 / 4 * x + 25 / 4) ∧
    ((4:ℝ) - 0) / (3 - 0) = 4 / 3 ∧ (-3 / 4 : ℝ) * (4 / 3) = -1 := by
  refine ⟨by norm_num, ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, by norm_num⟩

/-- RACUN: tangenta y = −3/4 x + 25/4 ima s krožnico x² + y² = 25 skupno le točko x = 3.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#krog-tangenta-dotik
besedilo: »(višja raven) (brez računala) Kolikšen je smerni koeficient tangente na krožnico $x^2 + y^2 = 25$ v točki $(-3, 4)$?« -/
theorem krog_tangenta_dotik (x : ℝ) : x ^ 2 + (-3 / 4 * x + 25 / 4) ^ 2 = 25 ↔ x = 3 := by
  constructor
  · intro h
    have : (25 / 16) * (x - 3) ^ 2 = 0 := by nlinarith
    have : (x - 3) ^ 2 = 0 := by linarith
    have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp this
    linarith
  · rintro rfl; norm_num

/-- Razlaga 4, Premisli: v točki (5, 0) ni odvedljive implicitne funkcije (iz 2x + 2y y' = 0 bi sledilo
10 = 0): formula −x/y ima tam imenovalec 0.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#krog-v-5
besedilo: »Kaj se zgodi s formulo $y' = -\frac{x}{y}$ v točki $(5, 0)$? Kaj to pove o tangenti tam?« -/
theorem krog_v_5 :
    ¬ ∃ (y : ℝ → ℝ) (y' : ℝ), HasDerivAt y y' 5 ∧ y 5 = 0 ∧ ∀ᶠ x in 𝓝 (5:ℝ), x ^ 2 + y x ^ 2 = 25 := by
  rintro ⟨y, y', hy, h0, he⟩
  have := (krog_implicitno hy he).1
  rw [h0] at this; norm_num at this

/-! ## Rešeni primeri -/

/-- Primer 1, koraki 1–4: c(2) = 4 · 2 = 8, desni del gre proti 8e⁰ = 8, c je v t = 2 zvezna; z leve je
smerni koeficient 4, z desne c'(t) = 8e^{−0,5(t − 2)} · (−0,5) = −4e^{−0,5(t − 2)}, v 2 je to −4; ker
4 ≠ −4, c v t = 2 ni odvedljiva.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#primer1
besedilo: »Z desne: $c'(t) = 8e^{-0{,}5(t - 2)} \cdot (-0{,}5) = -4e^{-0{,}5(t - 2)}$, verižno pravilo. Pri $t = 2$ je to $-4$.« -/
theorem primer1 :
    (4:ℝ) * 2 = 8 ∧ (8:ℝ) * exp (-0.5 * (2 - 2)) = 8 ∧
    ContinuousAt (fun t : ℝ => if t ≤ 2 then 4 * t else 8 * exp (-0.5 * (t - 2))) 2 ∧
    HasDerivAt (fun t : ℝ => 4 * t) 4 2 ∧
    (∀ t : ℝ, HasDerivAt (fun t : ℝ => 8 * exp (-0.5 * (t - 2)))
      (8 * (exp (-0.5 * (t - 2)) * (-0.5))) t ∧
      8 * (exp (-0.5 * (t - 2)) * (-0.5)) = -4 * exp (-0.5 * (t - 2))) ∧
    -4 * exp (-0.5 * ((2:ℝ) - 2)) = -4 ∧ (4:ℝ) ≠ -4 ∧
    ¬ DifferentiableAt ℝ (fun t : ℝ => if t ≤ 2 then 4 * t else 8 * exp (-0.5 * (t - 2))) 2 := by
  have hd : ∀ t : ℝ, HasDerivAt (fun t : ℝ => 8 * exp (-0.5 * (t - 2)))
      (8 * (exp (-0.5 * (t - 2)) * (-0.5))) t := fun t =>
    (((hasDerivAt_id' t).sub_const 2).const_mul (-0.5)).exp.const_mul 8 |>.congr_deriv (by ring)
  have hl : ∀ t : ℝ, 2 - 1 < t → t ≤ 2 →
      (if t ≤ 2 then 4 * t else 8 * exp (-0.5 * (t - 2))) = 4 * t := fun t _ h => by simp [h]
  have hr : ∀ t : ℝ, 2 ≤ t → t < 2 + 1 →
      (if t ≤ 2 then 4 * t else 8 * exp (-0.5 * (t - 2))) = 8 * exp (-0.5 * (t - 2)) := by
    intro t h _
    rcases eq_or_lt_of_le h with h | h
    · subst h; norm_num
    · simp [not_le.mpr h]
  have hl4 : HasDerivAt (fun t : ℝ => 4 * t) 4 2 := ((hasDerivAt_id' 2).const_mul 4).congr_deriv (by ring)
  refine ⟨by norm_num, by norm_num, zvezna_stik one_pos hl hr (by fun_prop) (by fun_prop), hl4,
    fun t => ⟨hd t, by ring⟩, by norm_num, by norm_num, ?_⟩
  exact ni_odvedljiva_vogal (k' := -4) one_pos hl hr hl4 ((hd 2).congr_deriv (by norm_num)) (by norm_num)

/-- Primer 2 (višja raven): če je y odvedljiva v x₀ in blizu x₀ velja x²/25 + y²/9 = 1, je
2x/25 + 2y y'/9 = 0 in za y ≠ 0 y' = −9x/(25y).
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#elipsa-implicitno
besedilo: »Odvajamo: $\frac{2x}{25} + \frac{2y\,y'}{9} = 0$, zato $y' = -\frac{9x}{25y}$.« -/
theorem elipsa_implicitno {y : ℝ → ℝ} {x₀ y' : ℝ} (hy : HasDerivAt y y' x₀)
    (he : ∀ᶠ x in 𝓝 x₀, x ^ 2 / 25 + y x ^ 2 / 9 = 1) :
    2 * x₀ / 25 + 2 * y x₀ * y' / 9 = 0 ∧ (y x₀ ≠ 0 → y' = -(9 * x₀) / (25 * y x₀)) := by
  have h1 : HasDerivAt (fun x => x ^ 2 / 25 + y x ^ 2 / 9) (2 * x₀ / 25 + 2 * y x₀ * y' / 9) x₀ :=
    (((hasDerivAt_pow 2 x₀).div_const 25).add ((hy.pow 2).div_const 9)).congr_deriv
      (by push_cast; ring)
  have h2 : HasDerivAt (fun x => x ^ 2 / 25 + y x ^ 2 / 9) 0 x₀ :=
    (hasDerivAt_const x₀ (1:ℝ)).congr_of_eventuallyEq he
  have e := h1.unique h2
  refine ⟨e, fun hne => ?_⟩
  field_simp; linarith

/-- Predpostavke trditve `elipsa_implicitno` so izpolnljive: y = 3√(1 − x²/25) blizu x = 4, y(4) = 1,8. -/
example : ∃ (y : ℝ → ℝ) (y' : ℝ), HasDerivAt y y' 4 ∧ y 4 = 1.8 ∧
    ∀ᶠ x in 𝓝 (4:ℝ), x ^ 2 / 25 + y x ^ 2 / 9 = 1 := by
  have hd : DifferentiableAt ℝ (fun x : ℝ => 3 * √(1 - x ^ 2 / 25)) 4 :=
    ((by fun_prop : DifferentiableAt ℝ (fun x : ℝ => 1 - x ^ 2 / 25) 4).sqrt (by norm_num)).const_mul 3
  refine ⟨_, _, hd.hasDerivAt, ?_, ?_⟩
  · show 3 * √(1 - (4:ℝ) ^ 2 / 25) = 1.8
    rw [show (1:ℝ) - 4 ^ 2 / 25 = (3 / 5) ^ 2 by norm_num, sqrt_sq (by norm_num)]; norm_num
  · filter_upwards [Ioo_mem_nhds (show (3:ℝ) < 4 by norm_num) (show (4:ℝ) < 5 by norm_num)] with x hx
    rw [mul_pow, sq_sqrt (by nlinarith [hx.1, hx.2])]; ring

/-- Primer 2, koraki 1, 3, 4: T(4; 1,8) leži na elipsi (16/25 + 3,24/9 = 0,64 + 0,36 = 1),
k = −(9 · 4)/(25 · 1,8) = −36/45 = −0,8, tangenta y − 1,8 = −0,8(x − 4) je y = −0,8x + 5.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#primer2
besedilo: »Točka leži na elipsi: $\frac{16}{25} + \frac{3{,}24}{9} = 0{,}64 + 0{,}36 = 1$.« -/
theorem primer2 (x y : ℝ) :
    (1.8:ℝ) ^ 2 = 3.24 ∧ (16:ℝ) / 25 + 3.24 / 9 = 0.64 + 0.36 ∧ (0.64:ℝ) + 0.36 = 1 ∧
    -(9 * 4 : ℝ) / (25 * 1.8) = -36 / 45 ∧ (-36:ℝ) / 45 = -0.8 ∧
    (y - 1.8 = -0.8 * (x - 4) ↔ y = -0.8 * x + 5) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    ⟨fun h => by linarith, fun h => by linarith⟩⟩

/-- RACUN: tangenta y = −4/5 x + 5 ima z elipso skupno le točko x = 4.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#primer2-dotik
besedilo: »$k = -\frac{2 + 2}{1 + 4} = -\frac{4}{5} = -0{,}8$. Tangenta: $y - 2 = -0{,}8(x - 1)$, torej $y = -0{,}8x + 2{,}8$.« -/
theorem primer2_dotik (x : ℝ) : x ^ 2 / 25 + (-4 / 5 * x + 5) ^ 2 / 9 = 1 ↔ x = 4 := by
  constructor
  · intro h
    have : (x - 4) ^ 2 = 0 := by nlinarith
    have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp this
    linarith
  · rintro rfl; norm_num

/-- Primer 3, koraki 2–4: točke krožnice x² + y² = 625 (y ≠ 0) s smernim koeficientom −x/y = 3/4 so
natanko (15, −20) in (−15, 20).
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#primer3-tocki
besedilo: »Podatki:** krožnica $x^2 + y^2 = 625$ (polmer $25\,\mathrm{mm}$), smerni koeficient tangente $k = \frac{3}{4}$« -/
theorem primer3_tocki (x y : ℝ) :
    (x ^ 2 + y ^ 2 = 625 ∧ y ≠ 0 ∧ -x / y = 3 / 4) ↔ (x = 15 ∧ y = -20) ∨ (x = -15 ∧ y = 20) := by
  constructor
  · rintro ⟨h1, h2, h3⟩
    have hy : y = -4 / 3 * x := by field_simp at h3; linarith
    subst hy
    have h4 : 25 / 9 * x ^ 2 = 625 := by nlinarith
    have h5 : x ^ 2 = 225 := by linarith
    have h6 : (x - 15) * (x + 15) = 0 := by nlinarith
    rcases mul_eq_zero.mp h6 with h | h
    · left; constructor <;> linarith
    · right; constructor <;> linarith
  · rintro (⟨rfl, rfl⟩ | ⟨rfl, rfl⟩) <;> norm_num

/-- Primer 3, korak 3 (RACUN): x² + (−4/3 x)² = x² + 16/9 x² = 25/9 x², enako 625 natanko pri x = ±15.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#primer3-enacba
besedilo: »Vstavimo v krožnico: $x^2 + \frac{16}{9}x^2 = 625$, torej $\frac{25}{9}x^2 = 625$ in $x^2 = 225$.« -/
theorem primer3_enacba (x : ℝ) :
    x ^ 2 + (-4 * x / 3) ^ 2 = x ^ 2 + 16 / 9 * x ^ 2 ∧ x ^ 2 + 16 / 9 * x ^ 2 = 25 / 9 * x ^ 2 ∧
    (x ^ 2 + (-4 * x / 3) ^ 2 = 625 ↔ x = -15 ∨ x = 15) := by
  refine ⟨by ring, by ring, ⟨fun h => ?_, ?_⟩⟩
  · have h6 : (x - 15) * (x + 15) = 0 := by nlinarith
    rcases mul_eq_zero.mp h6 with h | h
    · right; linarith
    · left; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Primer 3, koraka 5–6: tangenti y = 3/4 x − 125/4 skozi (15, −20) in y = 3/4 x + 125/4 skozi
(−15, 20); preizkus 3/4 · 15 − 125/4 = (45 − 125)/4 = −20. Drugače (avto v krožišču):
y' = −15/(−20) = 3/4.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#primer3-tangenti
besedilo: »Tangenti: skozi $(15, -20)$ je $y = \frac{3}{4}x - \frac{125}{4}$, skozi $(-15, 20)$ je $y = \frac{3}{4}x + \frac{125}{4}$.« -/
theorem primer3_tangenti :
    (3:ℝ) / 4 * 15 - 125 / 4 = (45 - 125) / 4 ∧ ((45:ℝ) - 125) / 4 = -20 ∧
    (3:ℝ) / 4 * (-15) + 125 / 4 = 20 ∧ -(15:ℝ) / (-20) = 3 / 4 ∧ -(-15:ℝ) / 20 = 3 / 4 := by
  norm_num

/-- RACUN: tangenta y = 3/4 x − 125/4 ima s krožnico x² + y² = 625 skupno le točko x = 15.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#primer3-dotik
besedilo: »Podatki:** krožnica $x^2 + y^2 = 625$ (polmer $25\,\mathrm{mm}$), smerni koeficient tangente $k = \frac{3}{4}$« -/
theorem primer3_dotik (x : ℝ) : x ^ 2 + (3 / 4 * x - 125 / 4) ^ 2 = 625 ↔ x = 15 := by
  constructor
  · intro h
    have : (x - 15) ^ 2 = 0 := by nlinarith
    have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp this
    linarith
  · rintro rfl; norm_num

/-- Primer 4 (višja raven): če je y odvedljiva v x₀ in blizu x₀ velja x² + xy + y² = 7, je
2x + y + x y' + 2y y' = 0, torej y'(x + 2y) = −(2x + y) in za x + 2y ≠ 0 y' = −(2x + y)/(x + 2y).
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#primer4-implicitno
besedilo: »$2x + y + x\,y' + 2y\,y' = 0$« -/
theorem primer4_implicitno {y : ℝ → ℝ} {x₀ y' : ℝ} (hy : HasDerivAt y y' x₀)
    (he : ∀ᶠ x in 𝓝 x₀, x ^ 2 + x * y x + y x ^ 2 = 7) :
    2 * x₀ + y x₀ + x₀ * y' + 2 * y x₀ * y' = 0 ∧ y' * (x₀ + 2 * y x₀) = -(2 * x₀ + y x₀) ∧
    (x₀ + 2 * y x₀ ≠ 0 → y' = -(2 * x₀ + y x₀) / (x₀ + 2 * y x₀)) := by
  have h1 : HasDerivAt (fun x => x ^ 2 + x * y x + y x ^ 2)
      (2 * x₀ + y x₀ + x₀ * y' + 2 * y x₀ * y') x₀ :=
    (((hasDerivAt_pow 2 x₀).add ((hasDerivAt_id' x₀).mul hy)).add (hy.pow 2)).congr_deriv
      (by push_cast; ring)
  have h2 : HasDerivAt (fun x => x ^ 2 + x * y x + y x ^ 2) 0 x₀ :=
    (hasDerivAt_const x₀ (7:ℝ)).congr_of_eventuallyEq he
  have e := h1.unique h2
  have e2 : y' * (x₀ + 2 * y x₀) = -(2 * x₀ + y x₀) := by linarith
  exact ⟨e, e2, fun hne => by field_simp; linarith⟩

/-- Predpostavke trditve `primer4_implicitno` so izpolnljive: y = (−x + √(28 − 3x²))/2 blizu x = 1,
y(1) = 2. -/
example : ∃ (y : ℝ → ℝ) (y' : ℝ), HasDerivAt y y' 1 ∧ y 1 = 2 ∧
    ∀ᶠ x in 𝓝 (1:ℝ), x ^ 2 + x * y x + y x ^ 2 = 7 := by
  have hd : DifferentiableAt ℝ (fun x : ℝ => (-x + √(28 - 3 * x ^ 2)) / 2) 1 :=
    ((differentiableAt_id.neg.add
      ((by fun_prop : DifferentiableAt ℝ (fun x : ℝ => 28 - 3 * x ^ 2) 1).sqrt (by norm_num))).div_const 2)
  refine ⟨_, _, hd.hasDerivAt, ?_, ?_⟩
  · show (-(1:ℝ) + √(28 - 3 * 1 ^ 2)) / 2 = 2
    rw [show (28:ℝ) - 3 * 1 ^ 2 = 5 ^ 2 by norm_num, sqrt_sq (by norm_num)]; norm_num
  · filter_upwards [Ioo_mem_nhds (show (0:ℝ) < 1 by norm_num) (show (1:ℝ) < 2 by norm_num)] with x hx
    have hs := sq_sqrt (show (0:ℝ) ≤ 28 - 3 * x ^ 2 by nlinarith [hx.1, hx.2])
    nlinarith [hs]

/-- Primer 4: T(1, 2) leži na krivulji (1 + 2 + 4 = 7), k = −(2 + 2)/(1 + 4) = −4/5 = −0,8, tangenta
y − 2 = −0,8(x − 1) je y = −0,8x + 2,8.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#primer4
besedilo: »$k = -\frac{2 + 2}{1 + 4} = -\frac{4}{5} = -0{,}8$. Tangenta: $y - 2 = -0{,}8(x - 1)$, torej $y = -0{,}8x + 2{,}8$.« -/
theorem primer4 (x y : ℝ) :
    (1:ℝ) ^ 2 + 1 * 2 + 2 ^ 2 = 1 + 2 + 4 ∧ (1:ℝ) + 2 + 4 = 7 ∧
    -((2:ℝ) * 1 + 2) / (1 + 2 * 2) = -(2 + 2) / (1 + 4) ∧ -((2:ℝ) + 2) / (1 + 4) = -4 / 5 ∧
    (-4:ℝ) / 5 = -0.8 ∧ (y - 2 = -0.8 * (x - 1) ↔ y = -0.8 * x + 2.8) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    ⟨fun h => by linarith, fun h => by linarith⟩⟩

/-- RACUN: tangenta y = −4/5 x + 14/5 ima s krivuljo x² + xy + y² = 7 skupno le točko x = 1.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#primer4-dotik
besedilo: »$k = -\frac{2 + 2}{1 + 4} = -\frac{4}{5} = -0{,}8$. Tangenta: $y - 2 = -0{,}8(x - 1)$, torej $y = -0{,}8x + 2{,}8$.« -/
theorem primer4_dotik (x : ℝ) :
    x ^ 2 + x * (-4 / 5 * x + 14 / 5) + (-4 / 5 * x + 14 / 5) ^ 2 = 7 ↔ x = 1 := by
  constructor
  · intro h
    have : (x - 1) ^ 2 = 0 := by nlinarith
    have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp this
    linarith
  · rintro rfl; norm_num

/-! ## Za maturo -/

/-- Naloga 1, korak 1: predpis |x + 1| + |x − 2| po intervalih: −2x + 1 za x < −1, 3 za −1 ≤ x ≤ 2,
2x − 1 za x > 2.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#matura1-predpis
besedilo: »Predpis po intervalih: za $x < -1$ je $f(x) = -(x + 1) - (x - 2) = -2x + 1$, za $-1 \le x \le 2$ je $f(x) = (x + 1) - (x - 2) = 3$, za $x > 2$ je $f(x) = (x + 1) + (x - 2) = 2x - 1$.« -/
theorem matura1_predpis (x : ℝ) :
    (x < -1 → |x + 1| + |x - 2| = -(x + 1) - (x - 2) ∧ -(x + 1) - (x - 2) = -2 * x + 1) ∧
    (-1 ≤ x → x ≤ 2 → |x + 1| + |x - 2| = (x + 1) - (x - 2) ∧ (x + 1) - (x - 2) = 3) ∧
    (2 < x → |x + 1| + |x - 2| = (x + 1) + (x - 2) ∧ (x + 1) + (x - 2) = 2 * x - 1) := by
  refine ⟨fun h => ⟨?_, by ring⟩, fun h1 h2 => ⟨?_, by ring⟩, fun h => ⟨?_, by ring⟩⟩
  · rw [abs_of_neg (by linarith), abs_of_neg (by linarith)]; ring
  · rw [abs_of_nonneg (by linarith), abs_of_nonpos (by linarith)]; ring
  · rw [abs_of_pos (by linarith), abs_of_pos (by linarith)]

/-- Naloga 1, korak 2 (RACUN): f(−2) = 5, f(−1) = 3, f(3) = 5.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#matura1-vrednosti
besedilo: »za $-1 \le x \le 2$ je $f(x) = (x + 1) - (x - 2) = 3$,« -/
theorem matura1_vrednosti :
    |(-2:ℝ) + 1| + |(-2:ℝ) - 2| = 5 ∧ |(-1:ℝ) + 1| + |(-1:ℝ) - 2| = 3 ∧
    |(3:ℝ) + 1| + |(3:ℝ) - 2| = 5 := by
  norm_num [abs_of_neg, abs_of_pos]

/-- Naloga 1, koraka 3–4: f(x) = |x + 1| + |x − 2| je odvedljiva natanko v x ≠ −1, 2 (v x = −1 se smerni
koeficient spremeni z −2 na 0, v x = 2 z 0 na 2).
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#matura1
besedilo: »V točkah $(-1, 3)$ in $(2, 3)$ ima graf vogal: v $x = -1$ se smerni koeficient spremeni z $-2$ na $0$, v $x = 2$ pa z $0$ na $2$.« -/
theorem matura1 (x : ℝ) :
    DifferentiableAt ℝ (fun x : ℝ => |x + 1| + |x - 2|) x ↔ x ≠ -1 ∧ x ≠ 2 := by
  constructor
  · intro hd
    constructor
    · rintro rfl
      refine ni_odvedljiva_vogal (g := fun t => -2 * t + 1) (k := fun _ => 3) one_pos ?_ ?_ ?_
        (hasDerivAt_const _ _) (by norm_num : (-2:ℝ) ≠ 0) hd
      · intro t _ h
        rw [abs_of_nonpos (by linarith), abs_of_neg (by linarith)]; ring
      · intro t h h2
        rw [abs_of_nonneg (by linarith), abs_of_neg (by linarith)]; ring
      · exact (((hasDerivAt_id' _).const_mul (-2)).add_const 1).congr_deriv (by ring)
    · rintro rfl
      refine ni_odvedljiva_vogal (g := fun _ => 3) (k := fun t => 2 * t - 1) one_pos ?_ ?_
        (hasDerivAt_const _ _) ?_ (by norm_num : (0:ℝ) ≠ 2) hd
      · intro t h1 h
        rw [abs_of_pos (by linarith), abs_of_nonpos (by linarith)]; ring
      · intro t h _
        rw [abs_of_pos (by linarith), abs_of_nonneg (by linarith)]; ring
      · exact (((hasDerivAt_id' _).const_mul 2).sub_const 1).congr_deriv (by ring)
  · rintro ⟨h1, h2⟩
    rcases lt_or_gt_of_ne h1 with h1 | h1
    · have : (fun x : ℝ => |x + 1| + |x - 2|) =ᶠ[𝓝 x] fun t => -2 * t + 1 := by
        filter_upwards [Iio_mem_nhds h1] with t ht
        exact ((matura1_predpis t).1 ht).1.trans ((matura1_predpis t).1 ht).2
      exact (by fun_prop : DifferentiableAt ℝ (fun t : ℝ => -2 * t + 1) x).congr_of_eventuallyEq this
    · rcases lt_or_gt_of_ne h2 with h2 | h2
      · have : (fun x : ℝ => |x + 1| + |x - 2|) =ᶠ[𝓝 x] fun _ => 3 := by
          filter_upwards [Ioo_mem_nhds h1 h2] with t ht
          exact ((matura1_predpis t).2.1 ht.1.le ht.2.le).1.trans
            ((matura1_predpis t).2.1 ht.1.le ht.2.le).2
        exact (differentiableAt_const _).congr_of_eventuallyEq this
      · have : (fun x : ℝ => |x + 1| + |x - 2|) =ᶠ[𝓝 x] fun t => 2 * t - 1 := by
          filter_upwards [Ioi_mem_nhds h2] with t ht
          exact ((matura1_predpis t).2.2 ht).1.trans ((matura1_predpis t).2.2 ht).2
        exact (by fun_prop : DifferentiableAt ℝ (fun t : ℝ => 2 * t - 1) x).congr_of_eventuallyEq this

/-- Naloga 2 a): (x + 1)|x − 1| = (x + 1)(x − 1) = x² − 1 za x ≥ 1 in (x + 1)(1 − x) = 1 − x² za x < 1.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#matura2a
besedilo: »a) Za $x \ge 1$ je $\lvert x - 1 \rvert = x - 1$ in $f(x) = x^2 - 1$. Za $x < 1$ je $\lvert x - 1 \rvert = 1 - x$ in $f(x) = 1 - x^2$.« -/
theorem matura2a (x : ℝ) :
    (1 ≤ x → (x + 1) * |x - 1| = (x + 1) * (x - 1) ∧ (x + 1) * (x - 1) = x ^ 2 - 1) ∧
    (x < 1 → (x + 1) * |x - 1| = (x + 1) * (1 - x) ∧ (x + 1) * (1 - x) = 1 - x ^ 2) := by
  refine ⟨fun h => ⟨by rw [abs_of_nonneg (by linarith)], by ring⟩,
    fun h => ⟨by rw [abs_of_neg (by linarith)]; ring, by ring⟩⟩

/-- Naloga 2 b): f(1) = 0 in f je v 1 zvezna; z leve (1 − x²)' = −2x, v 1 je −2 · 1 = −2, z desne
(x² − 1)' = 2x, v 1 je 2; smerna koeficienta se razlikujeta, zato f'(1) ne obstaja.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#matura2b
besedilo: »b) Z leve: $(1 - x^2)' = -2x$, pri $x = 1$ je smerni koeficient $-2$. Z desne: $(x^2 - 1)' = 2x$, pri $x = 1$ je $2$. Smerna koeficienta se razlikujeta, zato $f'(1)$ ne obstaja.« -/
theorem matura2b :
    (1 + 1) * |(1:ℝ) - 1| = 0 ∧ ContinuousAt (fun x : ℝ => (x + 1) * |x - 1|) 1 ∧
    (∀ x : ℝ, HasDerivAt (fun x : ℝ => 1 - x ^ 2) (-2 * x) x) ∧ (-2:ℝ) * 1 = -2 ∧
    (∀ x : ℝ, HasDerivAt (fun x : ℝ => x ^ 2 - 1) (2 * x) x) ∧ (2:ℝ) * 1 = 2 ∧
    ¬ DifferentiableAt ℝ (fun x : ℝ => (x + 1) * |x - 1|) 1 := by
  have dl : ∀ x : ℝ, HasDerivAt (fun x : ℝ => 1 - x ^ 2) (-2 * x) x := fun x =>
    ((hasDerivAt_pow 2 x).const_sub 1).congr_deriv (by norm_num)
  have dr : ∀ x : ℝ, HasDerivAt (fun x : ℝ => x ^ 2 - 1) (2 * x) x := fun x =>
    ((hasDerivAt_pow 2 x).sub_const 1).congr_deriv (by norm_num)
  have hl : ∀ t : ℝ, 1 - 1 < t → t ≤ 1 → (t + 1) * |t - 1| = 1 - t ^ 2 := by
    intro t _ h; rw [abs_of_nonpos (by linarith)]; ring
  have hr : ∀ t : ℝ, 1 ≤ t → t < 1 + 1 → (t + 1) * |t - 1| = t ^ 2 - 1 := fun t h _ =>
    ((matura2a t).1 h).1.trans ((matura2a t).1 h).2
  refine ⟨by norm_num, by fun_prop, dl, by norm_num, dr, by norm_num, ?_⟩
  exact ni_odvedljiva_vogal (g' := -2) (k' := 2) one_pos hl hr ((dl 1).congr_deriv (by norm_num))
    ((dr 1).congr_deriv (by norm_num)) (by norm_num)

/-- Naloga 2 c): g(x) = (x − 1)|x − 1|, g(1) = 0, diferenčni količnik (1 + h − 1)|1 + h − 1|/h = |h|
(h ≠ 0) gre proti 0, zato g'(1) = 0.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#matura2c
besedilo: »c) $g(1) = 0$, zato je diferenčni količnik $\dfrac{g(1 + h) - g(1)}{h} = \dfrac{h\,\lvert h \rvert}{h} = \lvert h \rvert$.« -/
theorem matura2c :
    ((1:ℝ) - 1) * |(1:ℝ) - 1| = 0 ∧
    (∀ h : ℝ, h ≠ 0 → (1 + h - 1) * |1 + h - 1| / h = |h|) ∧
    Tendsto (fun h : ℝ => |h|) (𝓝 0) (𝓝 0) ∧
    HasDerivAt (fun x : ℝ => (x - 1) * |x - 1|) 0 1 := by
  have hq : ∀ h : ℝ, h ≠ 0 → (1 + h - 1) * |1 + h - 1| / h = |h| := by
    intro h hh; rw [show (1:ℝ) + h - 1 = h by ring]; field_simp
  have ht : Tendsto (fun h : ℝ => |h|) (𝓝 0) (𝓝 0) := by
    simpa using (continuous_abs.tendsto (0:ℝ))
  refine ⟨by norm_num, hq, ht, ?_⟩
  rw [hasDerivAt_iff_tendsto_slope_zero]
  refine (ht.mono_left nhdsWithin_le_nhds).congr' ?_
  filter_upwards [self_mem_nhdsWithin] with h hh
  have hh' : h ≠ 0 := hh
  simp only [smul_eq_mul, sub_self, abs_zero, mul_zero, sub_zero]
  rw [← div_eq_inv_mul, hq h hh']

/-- Naloga 3 a): če je y odvedljiva v x₀ in blizu x₀ velja x² − xy + y² = 12, je
2x − y − x y' + 2y y' = 0, y'(2y − x) = y − 2x in za 2y − x ≠ 0 y' = (y − 2x)/(2y − x).
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#matura3a
besedilo: »a) Obe strani odvajamo po $x$, pri tem je $(xy)' = y + x\,y'$ in $(y^2)' = 2y\,y'$: $2x - y - x\,y' + 2y\,y' = 0$.« -/
theorem matura3a {y : ℝ → ℝ} {x₀ y' : ℝ} (hy : HasDerivAt y y' x₀)
    (he : ∀ᶠ x in 𝓝 x₀, x ^ 2 - x * y x + y x ^ 2 = 12) :
    2 * x₀ - y x₀ - x₀ * y' + 2 * y x₀ * y' = 0 ∧ y' * (2 * y x₀ - x₀) = y x₀ - 2 * x₀ ∧
    (2 * y x₀ - x₀ ≠ 0 → y' = (y x₀ - 2 * x₀) / (2 * y x₀ - x₀)) := by
  have h1 : HasDerivAt (fun x => x ^ 2 - x * y x + y x ^ 2)
      (2 * x₀ - y x₀ - x₀ * y' + 2 * y x₀ * y') x₀ :=
    (((hasDerivAt_pow 2 x₀).sub ((hasDerivAt_id' x₀).mul hy)).add (hy.pow 2)).congr_deriv
      (by push_cast; ring)
  have h2 : HasDerivAt (fun x => x ^ 2 - x * y x + y x ^ 2) 0 x₀ :=
    (hasDerivAt_const x₀ (12:ℝ)).congr_of_eventuallyEq he
  have e := h1.unique h2
  have e2 : y' * (2 * y x₀ - x₀) = y x₀ - 2 * x₀ := by linarith
  exact ⟨e, e2, fun hne => by rw [eq_div_iff hne]; linarith⟩

/-- Predpostavke trditve `matura3a` so izpolnljive: y = (x + √(48 − 3x²))/2 blizu x = −2, y(−2) = 2. -/
example : ∃ (y : ℝ → ℝ) (y' : ℝ), HasDerivAt y y' (-2) ∧ y (-2) = 2 ∧
    ∀ᶠ x in 𝓝 (-2:ℝ), x ^ 2 - x * y x + y x ^ 2 = 12 := by
  have hd : DifferentiableAt ℝ (fun x : ℝ => (x + √(48 - 3 * x ^ 2)) / 2) (-2) :=
    ((differentiableAt_id.add
      ((by fun_prop : DifferentiableAt ℝ (fun x : ℝ => 48 - 3 * x ^ 2) (-2)).sqrt
        (by norm_num))).div_const 2)
  refine ⟨_, _, hd.hasDerivAt, ?_, ?_⟩
  · show ((-2:ℝ) + √(48 - 3 * (-2) ^ 2)) / 2 = 2
    rw [show (48:ℝ) - 3 * (-2) ^ 2 = 6 ^ 2 by norm_num, sqrt_sq (by norm_num)]; norm_num
  · filter_upwards [Ioo_mem_nhds (show (-3:ℝ) < -2 by norm_num) (show (-2:ℝ) < -1 by norm_num)]
      with x hx
    have hs := sq_sqrt (show (0:ℝ) ≤ 48 - 3 * x ^ 2 by nlinarith [hx.1, hx.2])
    nlinarith [hs]

/-- Naloga 3 (RACUN): −(2x − y)/(2y − x) = (y − 2x)/(2y − x).
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#matura3a-racun
besedilo: »a) $y'(2y - x) = y - 2x$, torej $y' = \dfrac{y - 2x}{2y - x}$.« -/
theorem matura3a_racun (x y : ℝ) : -(2 * x - y) / (2 * y - x) = (y - 2 * x) / (2 * y - x) := by ring

/-- Naloga 3 b): A(−2, 2) leži na K (4 + 4 + 4 = 12), k = (2 + 4)/(4 + 2) = 1, tangenta y − 2 = x + 2 je
y = x + 4, normala y − 2 = −(x + 2) je y = −x.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#matura3b
besedilo: »b) $k = \dfrac{2 + 4}{4 + 2} = 1$. Tangenta: $y - 2 = x + 2$, torej $y = x + 4$.« -/
theorem matura3b (x y : ℝ) :
    (-2:ℝ) ^ 2 - (-2) * 2 + 2 ^ 2 = 4 + 4 + 4 ∧ (4:ℝ) + 4 + 4 = 12 ∧
    ((2:ℝ) - 2 * (-2)) / (2 * 2 - (-2)) = (2 + 4) / (4 + 2) ∧ ((2:ℝ) + 4) / (4 + 2) = 1 ∧
    (y - 2 = x + 2 ↔ y = x + 4) ∧ (y - 2 = -(x + 2) ↔ y = -x) ∧ (1:ℝ) * (-1) = -1 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ⟨fun h => by linarith, fun h => by linarith⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num⟩

/-- RACUN: tangenta y = x + 4 ima s K skupno le točko x = −2.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#matura3b-dotik
besedilo: »Odgovor: $y' = \frac{y - 2x}{2y - x}$; v $A$ je tangenta $y = x + 4$ in normala $y = -x$; vodoravna tangenta je v točkah $(2, 4)$ in $(-2, -4)$; tangenta v $B$ je navpična premica $x = 4$.« -/
theorem matura3b_dotik (x : ℝ) : x ^ 2 - x * (x + 4) + (x + 4) ^ 2 = 12 ↔ x = -2 := by
  constructor
  · intro h
    have : (x + 2) ^ 2 = 0 := by nlinarith
    have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp this
    linarith
  · rintro rfl; norm_num

/-- Naloga 3 c): točke K z vodoravno tangento (števec y − 2x = 0, imenovalec 2y − x ≠ 0) so natanko
(2, 4) in (−2, −4): y = 2x, 3x² = 12; imenovalca sta 6 in −6.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#matura3c
besedilo: »d) V točki $B$ je imenovalec $2y - x = 4 - 4 = 0$, števec pa $y - 2x = -6 \ne 0$. Odvod $y'$ tam ne obstaja: tangenta je navpična.« -/
theorem matura3c (x y : ℝ) :
    (x ^ 2 - x * y + y ^ 2 = 12 ∧ y - 2 * x = 0 ∧ 2 * y - x ≠ 0) ↔
      (x = 2 ∧ y = 4) ∨ (x = -2 ∧ y = -4) := by
  constructor
  · rintro ⟨h1, h2, -⟩
    have hy : y = 2 * x := by linarith
    subst hy
    have h3 : 3 * x ^ 2 = 12 := by linarith
    have h6 : (x - 2) * (x + 2) = 0 := by nlinarith
    rcases mul_eq_zero.mp h6 with h | h
    · left; constructor <;> linarith
    · right; constructor <;> linarith
  · rintro (⟨rfl, rfl⟩ | ⟨rfl, rfl⟩) <;> norm_num

/-- Naloga 3 c), korak 7 (RACUN): x² − x · 2x + (2x)² = 3x², enako 12 natanko pri x = ±2; imenovalca
2 · 4 − 2 = 6 in 2 · (−4) − (−2) = −6.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#matura3c-racun
besedilo: »c) Vstavimo v enačbo $K$: $x^2 - 2x^2 + 4x^2 = 3x^2 = 12$, zato $x = 2$ ali $x = -2$.« -/
theorem matura3c_racun (x : ℝ) :
    x ^ 2 - x * (2 * x) + (2 * x) ^ 2 = 3 * x ^ 2 ∧
    (x ^ 2 - x * (2 * x) + (2 * x) ^ 2 = 12 ↔ x = -2 ∨ x = 2) ∧
    (2:ℝ) * 4 - 2 = 6 ∧ (2:ℝ) * (-4) - (-2) = -6 := by
  refine ⟨by ring, ⟨fun h => ?_, ?_⟩, by norm_num, by norm_num⟩
  · have h6 : (x - 2) * (x + 2) = 0 := by nlinarith
    rcases mul_eq_zero.mp h6 with h | h
    · right; linarith
    · left; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Naloga 3 d): B(4, 2) leži na K (16 − 8 + 4 = 12); imenovalec 2y − x = 4 − 4 = 0, števec y − 2x = −6 ≠ 0;
v B ni odvedljive implicitne funkcije (odvod y' ne obstaja); premica x = 4 seka K le v B.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#matura3d
besedilo: »d) V točki $B$ je imenovalec $2y - x = 4 - 4 = 0$, števec pa $y - 2x = -6 \ne 0$. Odvod $y'$ tam ne obstaja: tangenta je navpična.« -/
theorem matura3d :
    (4:ℝ) ^ 2 - 4 * 2 + 2 ^ 2 = 12 ∧ (2:ℝ) * 2 - 4 = 0 ∧ (2:ℝ) - 2 * 4 = -6 ∧
    (¬ ∃ (y : ℝ → ℝ) (y' : ℝ), HasDerivAt y y' 4 ∧ y 4 = 2 ∧
      ∀ᶠ x in 𝓝 (4:ℝ), x ^ 2 - x * y x + y x ^ 2 = 12) ∧
    ∀ y : ℝ, (4:ℝ) ^ 2 - 4 * y + y ^ 2 = 12 ↔ y = 2 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, fun y => ⟨fun h => ?_, ?_⟩⟩
  · rintro ⟨y, y', hy, h0, he⟩
    have := (matura3a hy he).2.1
    rw [h0] at this; norm_num at this
  · have : (y - 2) ^ 2 = 0 := by nlinarith
    have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp this
    linarith
  · rintro rfl; norm_num

/-! ## Preveri se -/

/-- Preveri se 1: graf 1 + |x − 2| je pri x = 1 del premice y = 3 − x z odvodom −1 (A ni posebna točka),
pri x = 2 pa ima vogal (B, nakloni −1 in 1).
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#kviz1
besedilo: »Pri $x = 1$ je graf del premice $y = 3 - x$, odvod je $-1$. V B (vogal), C (skok) in D (navpična tangenta) odvod ne obstaja.« -/
theorem kviz1 :
    HasDerivAt (fun x : ℝ => 1 + |x - 2|) (-1) 1 ∧ ¬ DifferentiableAt ℝ (fun x : ℝ => 1 + |x - 2|) 2 := by
  constructor
  · have : (fun x : ℝ => 1 + |x - 2|) =ᶠ[𝓝 1] fun x => 3 - x := by
      filter_upwards [Iio_mem_nhds (show (1:ℝ) < 2 by norm_num)] with t ht
      have ht' : t < 2 := ht
      rw [abs_of_neg (by linarith)]; ring
    exact (((hasDerivAt_id' (1:ℝ)).const_sub 3).congr_deriv (by ring)).congr_of_eventuallyEq this
  · refine ni_odvedljiva_vogal (g := fun t => 3 - t) (k := fun t => t - 1) one_pos ?_ ?_
      ((hasDerivAt_id' 2).const_sub 3) ((hasDerivAt_id' 2).sub_const 1) (by norm_num)
    · intro t _ h; rw [abs_of_nonpos (by linarith)]; ring
    · intro t h _; rw [abs_of_nonneg (by linarith)]; ring

/-- Preveri se 2: |x² − 4| je zvezna povsod in odvedljiva natanko v x ≠ ±2; pri 0 je f'(0) = 0
(vrh 4 − 0² = 4, 3² − 4 = 5), pri 2 sta naklona −2 · 2 = −4 in 2 · 2 = 4.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#kviz2
besedilo: »3 | Pri $x = 0$ je vrh zaobljen: tam je $f(x) = 4 - x^2$, $f'(0) = 0$, tangenta je vodoravna.« -/
theorem kviz2 :
    Continuous (fun x : ℝ => |x ^ 2 - 4|) ∧
    (∀ x : ℝ, DifferentiableAt ℝ (fun x : ℝ => |x ^ 2 - 4|) x ↔ x ≠ 2 ∧ x ≠ -2) ∧
    HasDerivAt (fun x : ℝ => |x ^ 2 - 4|) 0 0 ∧ (4:ℝ) - 0 ^ 2 = 4 ∧ (3:ℝ) ^ 2 - 4 = 5 ∧
    (-2:ℝ) * 2 = -4 ∧ (2:ℝ) * 2 = 4 := by
  have dl : ∀ x : ℝ, HasDerivAt (fun x : ℝ => 4 - x ^ 2) (-2 * x) x := fun x =>
    ((hasDerivAt_pow 2 x).const_sub 4).congr_deriv (by norm_num)
  have dr : ∀ x : ℝ, HasDerivAt (fun x : ℝ => x ^ 2 - 4) (2 * x) x := fun x =>
    ((hasDerivAt_pow 2 x).sub_const 4).congr_deriv (by norm_num)
  have h0 : HasDerivAt (fun x : ℝ => |x ^ 2 - 4|) 0 0 := by
    have : (fun x : ℝ => |x ^ 2 - 4|) =ᶠ[𝓝 0] fun x => 4 - x ^ 2 := by
      filter_upwards [Ioo_mem_nhds (show (-1:ℝ) < 0 by norm_num) (show (0:ℝ) < 1 by norm_num)]
        with t ht
      rw [abs_of_neg (by nlinarith [ht.1, ht.2])]; ring
    exact ((dl 0).congr_deriv (by norm_num)).congr_of_eventuallyEq this
  refine ⟨by fun_prop, fun x => ⟨fun hd => ⟨?_, ?_⟩, fun ⟨h1, h2⟩ => ?_⟩, h0, by norm_num, by norm_num,
    by norm_num, by norm_num⟩
  · rintro rfl
    refine ni_odvedljiva_vogal (g := fun t => 4 - t ^ 2) (k := fun t => t ^ 2 - 4) one_pos ?_ ?_
      (dl 2) (dr 2) (by norm_num) hd
    · intro t h1 h2; rw [abs_of_nonpos (by nlinarith)]; ring
    · intro t h1 _; rw [abs_of_nonneg (by nlinarith)]
  · rintro rfl
    refine ni_odvedljiva_vogal (g := fun t => t ^ 2 - 4) (k := fun t => 4 - t ^ 2) one_pos ?_ ?_
      (dr (-2)) (dl (-2)) (by norm_num) hd
    · intro t _ h2; rw [abs_of_nonneg (by nlinarith)]
    · intro t h1 h2; rw [abs_of_nonpos (by nlinarith)]; ring
  · have hc : Tendsto (fun t : ℝ => t ^ 2) (𝓝 x) (𝓝 (x ^ 2)) := (continuous_pow 2).tendsto x
    have hne : x ^ 2 ≠ 4 := by
      intro h
      have : (x - 2) * (x + 2) = 0 := by nlinarith
      rcases mul_eq_zero.mp this with h | h
      · exact h1 (by linarith)
      · exact h2 (by linarith)
    rcases lt_or_gt_of_ne hne with h | h
    · have : (fun x : ℝ => |x ^ 2 - 4|) =ᶠ[𝓝 x] fun t => 4 - t ^ 2 := by
        filter_upwards [Filter.Tendsto.eventually_lt_const h hc] with t ht
        rw [abs_of_neg (by linarith)]; ring
      exact (dl x).differentiableAt.congr_of_eventuallyEq this
    · have : (fun x : ℝ => |x ^ 2 - 4|) =ᶠ[𝓝 x] fun t => t ^ 2 - 4 := by
        filter_upwards [Filter.Tendsto.eventually_const_lt h hc] with t ht
        rw [abs_of_pos (by linarith)]
      exact (dr x).differentiableAt.congr_of_eventuallyEq this

/-- Preveri se 4: |x − 2| je zvezna na (0, 5), v 2 pa ni odvedljiva; (x − 2)² je odvedljiva na (0, 5) in
ima v 2 odvod 0.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#kviz4
besedilo: »Odvedljivost ne izključuje vodoravne tangente: $(x - 2)^2$ je odvedljiva na $(0, 5)$, pa je njen odvod pri $x = 2$ enak $0$.« -/
theorem kviz4 :
    ContinuousOn (fun x : ℝ => |x - 2|) (Ioo 0 5) ∧ ¬ DifferentiableAt ℝ (fun x : ℝ => |x - 2|) 2 ∧
    DifferentiableOn ℝ (fun x : ℝ => (x - 2) ^ 2) (Ioo 0 5) ∧
    HasDerivAt (fun x : ℝ => (x - 2) ^ 2) 0 2 := by
  refine ⟨by fun_prop, ?_, by fun_prop, ?_⟩
  · refine ni_odvedljiva_vogal (g := fun t => 2 - t) (k := fun t => t - 2) one_pos ?_ ?_
      ((hasDerivAt_id' 2).const_sub 2) ((hasDerivAt_id' 2).sub_const 2) (by norm_num)
    · intro t _ h; rw [abs_of_nonpos (by linarith)]; ring
    · intro t h _; rw [abs_of_nonneg (by linarith)]
  · exact (((hasDerivAt_id' (2:ℝ)).sub_const 2).pow 2).congr_deriv (by norm_num)

/-- Preveri se 5: smerni koeficient tangente na x² + y² = 25 v (−3, 4) je −(−3)/4 = 3/4 = 0,75.
trditev: MAT-SS-4/odvedljivost-in-implicitni-odvod#kviz5
besedilo: »(višja raven) (brez računala) Kolikšen je smerni koeficient tangente na krožnico $x^2 + y^2 = 25$ v točki $(-3, 4)$?« -/
theorem kviz5 : -(-3:ℝ) / 4 = 3 / 4 ∧ (3:ℝ) / 4 = 0.75 := by norm_num

/-! ## Primeri izpolnljivosti (izrek, uporabljen na konkretnih vrednostih) -/

/-- Predpostavke trditve `krog_implicitno` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  krog_implicitno (hy := krog_lok_v_3.1) (he := krog_lok_v_3.2.1)

/-- Predpostavke trditve `elipsa_implicitno` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ (y : ℝ → ℝ) (y' : ℝ), HasDerivAt y y' 4 ∧ y 4 = 1.8 ∧ ∀ᶠ x in 𝓝 (4:ℝ), x ^ 2 / 25 + y x ^ 2 / 9 = 1 := by
    have hd : DifferentiableAt ℝ (fun x : ℝ => 3 * √(1 - x ^ 2 / 25)) 4 :=
      ((by fun_prop : DifferentiableAt ℝ (fun x : ℝ => 1 - x ^ 2 / 25) 4).sqrt (by norm_num)).const_mul 3
    refine ⟨_, _, hd.hasDerivAt, ?_, ?_⟩
    · show 3 * √(1 - (4:ℝ) ^ 2 / 25) = 1.8
      rw [show (1:ℝ) - 4 ^ 2 / 25 = (3 / 5) ^ 2 by norm_num, sqrt_sq (by norm_num)]; norm_num
    · filter_upwards [Ioo_mem_nhds (show (3:ℝ) < 4 by norm_num) (show (4:ℝ) < 5 by norm_num)] with x hx
      rw [mul_pow, sq_sqrt (by nlinarith [hx.1, hx.2])]; ring
  elipsa_implicitno (hy := w.choose_spec.choose_spec.1) (he := w.choose_spec.choose_spec.2.2)

/-- Predpostavke trditve `primer4_implicitno` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ (y : ℝ → ℝ) (y' : ℝ), HasDerivAt y y' 1 ∧ y 1 = 2 ∧ ∀ᶠ x in 𝓝 (1:ℝ), x ^ 2 + x * y x + y x ^ 2 = 7 := by
    have hd : DifferentiableAt ℝ (fun x : ℝ => (-x + √(28 - 3 * x ^ 2)) / 2) 1 :=
      ((differentiableAt_id.neg.add
        ((by fun_prop : DifferentiableAt ℝ (fun x : ℝ => 28 - 3 * x ^ 2) 1).sqrt (by norm_num))).div_const 2)
    refine ⟨_, _, hd.hasDerivAt, ?_, ?_⟩
    · show (-(1:ℝ) + √(28 - 3 * 1 ^ 2)) / 2 = 2
      rw [show (28:ℝ) - 3 * 1 ^ 2 = 5 ^ 2 by norm_num, sqrt_sq (by norm_num)]; norm_num
    · filter_upwards [Ioo_mem_nhds (show (0:ℝ) < 1 by norm_num) (show (1:ℝ) < 2 by norm_num)] with x hx
      have hs := sq_sqrt (show (0:ℝ) ≤ 28 - 3 * x ^ 2 by nlinarith [hx.1, hx.2])
      nlinarith [hs]
  primer4_implicitno (hy := w.choose_spec.choose_spec.1) (he := w.choose_spec.choose_spec.2.2)

/-- Predpostavke trditve `matura3a` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ (y : ℝ → ℝ) (y' : ℝ), HasDerivAt y y' (-2) ∧ y (-2) = 2 ∧ ∀ᶠ x in 𝓝 (-2:ℝ), x ^ 2 - x * y x + y x ^ 2 = 12 := by
    have hd : DifferentiableAt ℝ (fun x : ℝ => (x + √(48 - 3 * x ^ 2)) / 2) (-2) :=
      ((differentiableAt_id.add
        ((by fun_prop : DifferentiableAt ℝ (fun x : ℝ => 48 - 3 * x ^ 2) (-2)).sqrt
          (by norm_num))).div_const 2)
    refine ⟨_, _, hd.hasDerivAt, ?_, ?_⟩
    · show ((-2:ℝ) + √(48 - 3 * (-2) ^ 2)) / 2 = 2
      rw [show (48:ℝ) - 3 * (-2) ^ 2 = 6 ^ 2 by norm_num, sqrt_sq (by norm_num)]; norm_num
    · filter_upwards [Ioo_mem_nhds (show (-3:ℝ) < -2 by norm_num) (show (-2:ℝ) < -1 by norm_num)]
        with x hx
      have hs := sq_sqrt (show (0:ℝ) ≤ 48 - 3 * x ^ 2 by nlinarith [hx.1, hx.2])
      nlinarith [hs]
  matura3a (hy := w.choose_spec.choose_spec.1) (he := w.choose_spec.choose_spec.2.2)

end Evklid.Lekcije.MAT_SS_4.OdvedljivostInImplicitniOdvod
