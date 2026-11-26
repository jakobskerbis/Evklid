/-
vir: content/lessons/MAT-SS-4/limita-in-zveznost-funkcije.md
sha256: 3de9ce4407b607965e69f5202c1d5536ba47954ae2df786bd728dace7bd75d75
Ni v Leanu: zvočnik in akustika v uvodu, »Drugače: Z analogijo« (praska, skok tona, piskanje) in
simulacija; tabela v razlagi, vrstici x = 0,5 in x = 0,1 (ocena `Real.sin_bound`
|sin x − (x − x³/6)| ≤ |x|⁵/100 za šest decimalk pri teh x ni dovolj natančna, natančnejša ocena je
zahtevna, še ni dokazano; vrstici 0,01 in 0,001 sta dokazani);
karakterizacija limite z zaporedji (Heine) kot splošna trditev; geometrijski dokaz sin x < x < tan x s
ploščinami (neenakosti so dokazane z Mathlibom, ne s ploščinami); trditev »√x nima leve limite v 0«
(v Mathlibu je √x = 0 za x < 0, zato tam leva limita obstaja); trditve »f(a) ne obstaja« (v Leanu je
vsaka funkcija povsod definirana, deljenje z 0 da 0; namesto tega je dokazana limita oziroma
nezveznost); »zvezne povsod, kjer so definirane« za vse elementarne funkcije hkrati (dokazano za
funkcije iz primerov); Preveri se, vprašanje 1 (definicija, ni računska trditev); točkovanje
maturitetnih nalog.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.LimitaInZveznostFunkcije

open Real Filter Topology Set

/-- Pomožna: levi poltrak brez točke a leži v {a}ᶜ. -/
theorem lt_podmn (a : ℝ) : Iio a ⊆ {a}ᶜ := fun x hx => by
  simp only [mem_compl_iff, mem_singleton_iff]; exact ne_of_lt hx

/-- Pomožna: desni poltrak brez točke a leži v {a}ᶜ. -/
theorem gt_podmn (a : ℝ) : Ioi a ⊆ {a}ᶜ := fun x hx => by
  simp only [mem_compl_iff, mem_singleton_iff]; exact ne_of_gt hx

/-- Pomožna trditev za krajšanje: če je f(x) = g(x) za x ≠ a in je g zvezna v a, je
lim_{x→a} f(x) = g(a). -/
theorem limita_okrajsaj (f g : ℝ → ℝ) (a : ℝ) (h : ∀ x, x ≠ a → f x = g x) (hg : ContinuousAt g a) :
    Tendsto f (𝓝[≠] a) (𝓝 (g a)) :=
  (hg.tendsto.mono_left nhdsWithin_le_nhds).congr' (eventually_nhdsWithin_of_forall fun x hx => (h x hx).symm)

/-- Predpostavke trditve `limita_okrajsaj` se dajo izpolniti (f = g = x). -/
example : (∀ x : ℝ, x ≠ 0 → x = x) ∧ ContinuousAt (fun x : ℝ => x) 0 := ⟨fun _ _ => rfl, continuousAt_id⟩

/-- Pomožna trditev za pol: če gre števec proti c > 0, imenovalec pa proti 0 s pozitivne strani,
ulomek raste čez vse meje. -/
theorem pol_atTop {l : Filter ℝ} (f g : ℝ → ℝ) (c : ℝ) (hc : 0 < c) (hf : Tendsto f l (𝓝 c))
    (hg : Tendsto g l (𝓝[>] 0)) : Tendsto (fun x => f x / g x) l atTop := by
  have := hf.pos_mul_atTop hc (tendsto_inv_nhdsGT_zero.comp hg)
  simpa [div_eq_mul_inv] using this

/-- Predpostavke trditve `pol_atTop` se dajo izpolniti (f = 1, g = x na 𝓝[>] 0). -/
example : Tendsto (fun _ : ℝ => (1:ℝ)) (𝓝[>] 0) (𝓝 1) ∧ Tendsto (fun x : ℝ => x) (𝓝[>] 0) (𝓝[>] 0) :=
  ⟨tendsto_const_nhds, tendsto_id⟩

/-- Pomožna trditev za pol: števec proti c > 0, imenovalec proti 0 z negativne strani ⇒ ulomek gre
proti −∞. -/
theorem pol_atBot {l : Filter ℝ} (f g : ℝ → ℝ) (c : ℝ) (hc : 0 < c) (hf : Tendsto f l (𝓝 c))
    (hg : Tendsto g l (𝓝[<] 0)) : Tendsto (fun x => f x / g x) l atBot := by
  have := hf.pos_mul_atBot hc (tendsto_inv_nhdsLT_zero.comp hg)
  simpa [div_eq_mul_inv] using this

/-- Predpostavke trditve `pol_atBot` se dajo izpolniti (f = 1, g = x na 𝓝[<] 0). -/
example : Tendsto (fun _ : ℝ => (1:ℝ)) (𝓝[<] 0) (𝓝 1) ∧ Tendsto (fun x : ℝ => x) (𝓝[<] 0) (𝓝[<] 0) :=
  ⟨tendsto_const_nhds, tendsto_id⟩

/-- Razlaga, blok 1: f(x) = sin x / x je soda, f(−x) = f(x). -/
theorem sinc_soda (x : ℝ) : sin (-x) / (-x) = sin x / x := by
  rw [sin_neg, neg_div_neg_eq]

/-- Razlaga, blok 1, tabela: sin(0,01)/0,01 ≈ 0,999983 in sin(0,001)/0,001 ≈ 0,9999998. -/
theorem tabela : |sin (0.01:ℝ) / 0.01 - 0.999983| < 0.0000005 ∧
    |sin (0.001:ℝ) / 0.001 - 0.9999998| < 0.00000005 := by
  have b1 := sin_bound (x := (0.01:ℝ)) (by norm_num [abs_of_pos])
  have b2 := sin_bound (x := (0.001:ℝ)) (by norm_num [abs_of_pos])
  rw [abs_le] at b1 b2
  norm_num [abs_of_pos] at b1 b2
  constructor <;> rw [abs_lt] <;> constructor
  · rw [lt_sub_iff_add_lt, lt_div_iff₀ (by norm_num)]; linarith
  · rw [sub_lt_iff_lt_add, div_lt_iff₀ (by norm_num)]; linarith
  · rw [lt_sub_iff_add_lt, lt_div_iff₀ (by norm_num)]; linarith
  · rw [sub_lt_iff_lt_add, div_lt_iff₀ (by norm_num)]; linarith

/-- Razlaga, blok 1 (in povzetek): lim_{x→0} sin x / x = 1. -/
theorem limita_sinc : Tendsto (fun x : ℝ => sin x / x) (𝓝[≠] 0) (𝓝 1) := tendsto_sin_div_nhdsNE_zero

/-- Razlaga, blok 2, »Premisli«: če funkciji sin x / x dodamo f(0) = 5, ostane limita 1
(limita ne gleda vrednosti v točki). -/
theorem limita_ne_gleda_f0 :
    Tendsto (Function.update (fun x : ℝ => sin x / x) 0 5) (𝓝[≠] 0) (𝓝 1) := by
  refine limita_sinc.congr' (eventually_nhdsWithin_of_forall fun x hx => ?_)
  rw [Function.update_of_ne hx]

/-- Razlaga, blok 3: funkcija s skokom g(x) = x za x < 1, g(x) = x + 1 za x ≥ 1. -/
noncomputable def g (x : ℝ) : ℝ := if x < 1 then x else x + 1

/-- Razlaga, blok 3: leva limita g v 1 je 1, desna 2, limite v 1 ni; »Pogoste napake«: g(1) = 2. -/
theorem skok : Tendsto g (𝓝[<] 1) (𝓝 1) ∧ Tendsto g (𝓝[>] 1) (𝓝 2) ∧
    (¬ ∃ L, Tendsto g (𝓝[≠] 1) (𝓝 L)) ∧ g 1 = 2 := by
  have hl : Tendsto g (𝓝[<] 1) (𝓝 1) := by
    have : Tendsto (fun x : ℝ => x) (𝓝[<] 1) (𝓝 1) := tendsto_nhdsWithin_of_tendsto_nhds tendsto_id
    refine this.congr' (eventually_nhdsWithin_of_forall fun x hx => ?_)
    simp [g, show x < 1 from hx]
  have hr : Tendsto g (𝓝[>] 1) (𝓝 2) := by
    have : Tendsto (fun x : ℝ => x + 1) (𝓝[>] 1) (𝓝 (1 + 1)) :=
      tendsto_nhdsWithin_of_tendsto_nhds ((continuous_id.add continuous_const).tendsto 1)
    norm_num at this
    refine this.congr' (eventually_nhdsWithin_of_forall fun x hx => ?_)
    simp [g, not_lt.mpr (le_of_lt (show 1 < x from hx))]
  refine ⟨hl, hr, ?_, by norm_num [g]⟩
  rintro ⟨L, hL⟩
  have h1 := tendsto_nhds_unique (hL.mono_left (nhdsWithin_mono _ (lt_podmn 1))) hl
  have h2 := tendsto_nhds_unique (hL.mono_left (nhdsWithin_mono _ (gt_podmn 1))) hr
  linarith

/-- Razlaga, »Pogoste napake«: g(1) = 2, leva limita pa je 1. -/
theorem g1 : g 1 = 2 := by norm_num [g]

/-- Razlaga, blok 3: limita obstaja natanko tedaj, ko obstajata leva in desna limita in sta enaki. -/
theorem leva_desna (f : ℝ → ℝ) (a L : ℝ) :
    Tendsto f (𝓝[≠] a) (𝓝 L) ↔ Tendsto f (𝓝[<] a) (𝓝 L) ∧ Tendsto f (𝓝[>] a) (𝓝 L) := by
  rw [← nhdsLT_sup_nhdsGT, tendsto_sup]

/-- Razlaga, blok 4: pravila za računanje z limitami (vsota, razlika, produkt, količnik pri B ≠ 0). -/
theorem pravila (f h : ℝ → ℝ) (a A B : ℝ) (hf : Tendsto f (𝓝[≠] a) (𝓝 A))
    (hh : Tendsto h (𝓝[≠] a) (𝓝 B)) :
    Tendsto (fun x => f x + h x) (𝓝[≠] a) (𝓝 (A + B)) ∧
      Tendsto (fun x => f x - h x) (𝓝[≠] a) (𝓝 (A - B)) ∧
      Tendsto (fun x => f x * h x) (𝓝[≠] a) (𝓝 (A * B)) ∧
      (B ≠ 0 → Tendsto (fun x => f x / h x) (𝓝[≠] a) (𝓝 (A / B))) :=
  ⟨hf.add hh, hf.sub hh, hf.mul hh, fun hB => hf.div hh hB⟩

/-- Predpostavke trditve `pravila` se dajo izpolniti (f = sin x / x, h = sin x / x v 0). -/
example : Tendsto (fun x : ℝ => sin x / x) (𝓝[≠] 0) (𝓝 1) := limita_sinc

/-- Razlaga, blok 4: lim_{x→2} (x³ − 4x + 1) = 8 − 8 + 1 = 1 (vstavljanje pri polinomu). -/
theorem polinom : Tendsto (fun x : ℝ => x ^ 3 - 4 * x + 1) (𝓝 2) (𝓝 1) := by
  have h : Tendsto (fun x : ℝ => x ^ 3 - 4 * x + 1) (𝓝 2) (𝓝 (2 ^ 3 - 4 * 2 + 1)) :=
    (by fun_prop : Continuous fun x : ℝ => x ^ 3 - 4 * x + 1).tendsto 2
  have e : (2:ℝ) ^ 3 - 4 * 2 + 1 = 1 := by
    calc (2:ℝ) ^ 3 - 4 * 2 + 1 = 8 - 8 + 1 := by norm_num
      _ = 1 := by norm_num
  rwa [e] at h

/-- Razlaga, blok 6, in ustno vprašanje 2: lim_{x→∞} 1/x = 0. -/
theorem ena_skozi_x : Tendsto (fun x : ℝ => 1 / x) atTop (𝓝 0) := by
  simpa using tendsto_inv_atTop_zero (𝕜 := ℝ)

/-- Razlaga, blok 6: za P > 0 gre I = P/(4πr²) proti 0, ko r → ∞, in čez vse meje, ko r → 0⁺ (pol). -/
theorem jakost (P : ℝ) (hP : 0 < P) :
    Tendsto (fun r : ℝ => P / (4 * π * r ^ 2)) atTop (𝓝 0) ∧
      Tendsto (fun r : ℝ => P / (4 * π * r ^ 2)) (𝓝[>] 0) atTop := by
  constructor
  · have h1 : Tendsto (fun r : ℝ => 4 * π * r ^ 2) atTop atTop :=
      (tendsto_pow_atTop two_ne_zero).const_mul_atTop (by positivity)
    exact h1.const_div_atTop P
  · refine pol_atTop _ _ P hP tendsto_const_nhds ?_
    rw [tendsto_nhdsWithin_iff]
    refine ⟨?_, eventually_nhdsWithin_of_forall fun r (hr : 0 < r) => by simp only [mem_Ioi]; positivity⟩
    have : Tendsto (fun r : ℝ => 4 * π * r ^ 2) (𝓝 0) (𝓝 (4 * π * 0 ^ 2)) :=
      (by fun_prop : Continuous fun r : ℝ => 4 * π * r ^ 2).tendsto 0
    simpa using this.mono_left nhdsWithin_le_nhds

/-- Predpostavka trditve `jakost` se da izpolniti (P = 1). -/
example : (0 : ℝ) < 1 := one_pos

/-- Razlaga, blok 6, »Premisli«: pri podvojeni razdalji je jakost četrtina, P/(4π(2r)²) = I/4. -/
theorem podvojena_razdalja (P r : ℝ) : P / (4 * π * (2 * r) ^ 2) = (P / (4 * π * r ^ 2)) / 4 := by
  rw [div_div]; congr 1; ring

/-- Razlaga, blok 7: luknjo pri sin x / x zakrpamo z f(0) = 1; tako dopolnjena funkcija je zvezna v 0. -/
theorem luknja_zakrpana : ContinuousAt (Function.update (fun x : ℝ => sin x / x) 0 1) 0 :=
  continuousAt_update_same.mpr limita_sinc

/-- Razlaga, blok 8: √x je zvezna na [0, ∞) (v krajišču 0 šteje le desna limita). -/
theorem sqrt_zvezna : ContinuousOn Real.sqrt (Ici 0) := Real.continuous_sqrt.continuousOn

/-- Razlaga, blok 8, primer (in vrstica `resi: x^2-4=0`): x² − 4 = 0 natanko pri x = ±2;
f(x) = (x + 1)/(x² − 4) je zvezna, kjer je x² − 4 ≠ 0 (torej na (−∞, −2), (−2, 2), (2, ∞)),
in f(−1) = 0. -/
theorem intervali_zveznosti :
    (∀ x : ℝ, x ^ 2 - 4 = 0 ↔ x = -2 ∨ x = 2) ∧
      ContinuousOn (fun x : ℝ => (x + 1) / (x ^ 2 - 4)) {x | x ^ 2 - 4 ≠ 0} ∧
      ((-1 : ℝ) + 1) / ((-1) ^ 2 - 4) = 0 := by
  refine ⟨fun x => ?_, ?_, by norm_num⟩
  · rw [show x ^ 2 - 4 = (x + 2) * (x - 2) by ring, mul_eq_zero]
    constructor
    · rintro (h | h)
      · left; linarith
      · right; linarith
    · rintro (h | h)
      · left; linarith
      · right; linarith
  · exact ContinuousOn.div (by fun_prop) (by fun_prop) fun x hx => hx

/-- Primer 1, koraki 1–4: pri x = 3 sta števec 9 − 9 = 0 in imenovalec 3 − 3 = 0;
(x² − 9)/(x − 3) = x + 3 za x ≠ 3 in lim_{x→3} (x² − 9)/(x − 3) = 3 + 3 = 6. -/
theorem primer1 : (3:ℝ) ^ 2 - 9 = 0 ∧ (3:ℝ) - 3 = 0 ∧
    (∀ x : ℝ, x ≠ 3 → (x ^ 2 - 9) / (x - 3) = x + 3) ∧
    Tendsto (fun x : ℝ => (x ^ 2 - 9) / (x - 3)) (𝓝[≠] 3) (𝓝 6) := by
  have hk : ∀ x : ℝ, x ≠ 3 → (x ^ 2 - 9) / (x - 3) = x + 3 := fun x hx => by
    have : x - 3 ≠ 0 := sub_ne_zero.mpr hx
    rw [show x ^ 2 - 9 = (x - 3) * (x + 3) by ring]; field_simp
  refine ⟨by norm_num, by norm_num, hk, ?_⟩
  have := limita_okrajsaj _ (fun x => x + 3) 3 hk (by fun_prop)
  norm_num at this; exact this

/-- Pogoste napake, »Krajšanje členov«: (x² − 9)/(x − 3) ni x − 3 (za x ≠ 3 je enako x + 3). -/
theorem krajsanje_clenov (x : ℝ) (hx : x ≠ 3) : (x ^ 2 - 9) / (x - 3) ≠ x - 3 := by
  rw [primer1.2.2.1 x hx]; intro h; linarith

/-- Predpostavka trditve `krajsanje_clenov` se da izpolniti (x = 0). -/
example : (0 : ℝ) ≠ 3 := by norm_num

/-- Primer 2: (3x² − 5x)/(6x² + 1) = (3 − 5/x)/(6 + 1/x²) za x ≠ 0 in
lim_{x→∞} (3x² − 5x)/(6x² + 1) = 3/6 = 0,5. -/
theorem primer2 : (∀ x : ℝ, x ≠ 0 → (3 * x ^ 2 - 5 * x) / (6 * x ^ 2 + 1) = (3 - 5 / x) / (6 + 1 / x ^ 2)) ∧
    Tendsto (fun x : ℝ => (3 * x ^ 2 - 5 * x) / (6 * x ^ 2 + 1)) atTop (𝓝 0.5) := by
  have hdel : ∀ x : ℝ, x ≠ 0 → (3 * x ^ 2 - 5 * x) / (6 * x ^ 2 + 1) = (3 - 5 / x) / (6 + 1 / x ^ 2) := by
    intro x hx
    have h1 : 6 * x ^ 2 + 1 ≠ 0 := by positivity
    have h2 : 6 + 1 / x ^ 2 ≠ 0 := by positivity
    field_simp
  refine ⟨hdel, ?_⟩
  have hi := tendsto_inv_atTop_zero (𝕜 := ℝ)
  have h : Tendsto (fun x : ℝ => (3 - 5 * x⁻¹) / (6 + (x⁻¹) ^ 2)) atTop (𝓝 ((3 - 5 * 0) / (6 + 0 ^ 2))) :=
    (tendsto_const_nhds.sub (hi.const_mul 5)).div (tendsto_const_nhds.add (hi.pow 2)) (by norm_num)
  rw [show (0.5 : ℝ) = (3 - 5 * 0) / (6 + 0 ^ 2) by norm_num]
  refine h.congr' ?_
  filter_upwards [eventually_ne_atTop 0] with x hx
  rw [hdel x hx]; simp [div_eq_mul_inv, inv_pow]

/-- Primer 3: ovojnica glasnosti s parametrom k (v(t) = (t² + t − 6)/(t − 2) za t < 2, k t − 3 za t ≥ 2). -/
noncomputable def v (k t : ℝ) : ℝ := if t < 2 then (t ^ 2 + t - 6) / (t - 2) else k * t - 3

/-- Primer 3, koraki 1–2: t² + t − 6 = (t − 2)(t + 3) in leva limita v 2 je 2 + 3 = 5. -/
theorem primer3_leva (k : ℝ) : (∀ t : ℝ, t ^ 2 + t - 6 = (t - 2) * (t + 3)) ∧
    Tendsto (v k) (𝓝[<] 2) (𝓝 5) := by
  refine ⟨fun t => by ring, ?_⟩
  have : Tendsto (fun t : ℝ => t + 3) (𝓝[<] 2) (𝓝 (2 + 3)) :=
    tendsto_nhdsWithin_of_tendsto_nhds ((by fun_prop : Continuous fun t : ℝ => t + 3).tendsto 2)
  norm_num at this
  refine this.congr' (eventually_nhdsWithin_of_forall fun t (ht : t < 2) => ?_)
  have : t - 2 ≠ 0 := by linarith
  simp only [v, ht, ↓reduceIte]
  rw [show t ^ 2 + t - 6 = (t - 2) * (t + 3) by ring]; field_simp

/-- Primer 3, koraki 3–6: v je zvezna pri t = 2 natanko tedaj, ko je 2k − 3 = 5, torej k = 4
(preizkus 4 · 2 − 3 = 5). -/
theorem primer3 (k : ℝ) : ContinuousAt (v k) 2 ↔ k = 4 := by
  have hv2 : v k 2 = 2 * k - 3 := by simp [v]; ring
  constructor
  · intro h
    have h1 : Tendsto (v k) (𝓝[<] 2) (𝓝 (v k 2)) := h.tendsto.mono_left nhdsWithin_le_nhds
    have := tendsto_nhds_unique h1 (primer3_leva k).2
    rw [hv2] at this; linarith
  · rintro rfl
    rw [continuousAt_iff_continuous_left'_right']
    constructor
    · show Tendsto (v 4) (𝓝[<] 2) (𝓝 (v 4 2))
      rw [hv2]; norm_num; exact (primer3_leva 4).2
    · show Tendsto (v 4) (𝓝[>] 2) (𝓝 (v 4 2))
      have : Tendsto (fun t : ℝ => 4 * t - 3) (𝓝[>] 2) (𝓝 (4 * 2 - 3)) :=
        tendsto_nhdsWithin_of_tendsto_nhds ((by fun_prop : Continuous fun t : ℝ => 4 * t - 3).tendsto 2)
      rw [hv2]; norm_num at this ⊢
      refine this.congr' (eventually_nhdsWithin_of_forall fun t (ht : 2 < t) => ?_)
      simp [v, not_lt.mpr ht.le]

/-- Primer 3, korak 4: 2k − 3 = 5 ⇔ k = 4. -/
theorem primer3_k (k : ℝ) : 2 * k - 3 = 5 ↔ k = 4 := by constructor <;> intro h <;> linarith

/-- Primer 4: f(x) = x + 2 za x ≤ 0, (x + 6)/(3 − x) za x > 0. -/
noncomputable def f4 (x : ℝ) : ℝ := if x ≤ 0 then x + 2 else (x + 6) / (3 - x)

/-- Primer 4, korak 4 (in vrstica `limita: (x+6)/(3-x)`): f(0) = 2, leva limita 2, desna (0 + 6)/(3 − 0) = 2,
zato je f zvezna v 0. -/
theorem primer4_stik : f4 0 = 2 ∧ Tendsto f4 (𝓝[<] 0) (𝓝 2) ∧ Tendsto f4 (𝓝[>] 0) (𝓝 2) ∧
    ContinuousAt f4 0 := by
  have h0 : f4 0 = 2 := by simp [f4]
  have hl : Tendsto f4 (𝓝[<] 0) (𝓝 2) := by
    have : Tendsto (fun x : ℝ => x + 2) (𝓝[<] 0) (𝓝 (0 + 2)) :=
      tendsto_nhdsWithin_of_tendsto_nhds ((by fun_prop : Continuous fun x : ℝ => x + 2).tendsto 0)
    norm_num at this
    exact this.congr' (eventually_nhdsWithin_of_forall fun x (hx : x < 0) => by simp [f4, hx.le])
  have hr : Tendsto f4 (𝓝[>] 0) (𝓝 2) := by
    have : Tendsto (fun x : ℝ => (x + 6) / (3 - x)) (𝓝[>] 0) (𝓝 ((0 + 6) / (3 - 0))) :=
      tendsto_nhdsWithin_of_tendsto_nhds
        (((continuous_id.add continuous_const).tendsto 0).div
          ((continuous_const.sub continuous_id).tendsto 0) (by norm_num))
    norm_num at this
    exact this.congr' (eventually_nhdsWithin_of_forall fun x (hx : 0 < x) => by simp [f4, not_le.mpr hx])
  refine ⟨h0, hl, hr, ?_⟩
  rw [continuousAt_iff_continuous_left'_right']
  exact ⟨by rw [ContinuousWithinAt, h0]; exact hl, by rw [ContinuousWithinAt, h0]; exact hr⟩

/-- Primer 4, koraka 2–3 (in vrstica `resi: 3-x=0`): 3 − x = 0 natanko pri x = 3; pri x → 3 gre števec proti 9,
imenovalec proti 0 in |f(x)| raste čez vse meje (pol), zato f v 3 ni zvezna. -/
theorem primer4_pol : (∀ x : ℝ, 3 - x = 0 ↔ x = 3) ∧
    Tendsto (fun x => |f4 x|) (𝓝[≠] 3) atTop ∧ ¬ ContinuousAt f4 3 := by
  have hpol : Tendsto (fun x => |f4 x|) (𝓝[≠] 3) atTop := by
    have hnum : Tendsto (fun x : ℝ => |x + 6|) (𝓝[≠] 3) (𝓝 9) := by
      have : Tendsto (fun x : ℝ => |x + 6|) (𝓝 3) (𝓝 |3 + 6|) :=
        (by fun_prop : Continuous fun x : ℝ => |x + 6|).tendsto 3
      norm_num at this
      exact this.mono_left nhdsWithin_le_nhds
    have hden : Tendsto (fun x : ℝ => |3 - x|) (𝓝[≠] 3) (𝓝[>] 0) := by
      rw [tendsto_nhdsWithin_iff]
      refine ⟨?_, eventually_nhdsWithin_of_forall fun x (hx : x ≠ 3) => ?_⟩
      · have : Tendsto (fun x : ℝ => |3 - x|) (𝓝 3) (𝓝 |3 - 3|) :=
          (by fun_prop : Continuous fun x : ℝ => |3 - x|).tendsto 3
        norm_num at this
        exact this.mono_left nhdsWithin_le_nhds
      · simp only [mem_Ioi, abs_pos]; exact sub_ne_zero.mpr (Ne.symm hx)
    have := pol_atTop _ _ 9 (by norm_num) hnum hden
    refine this.congr' ?_
    filter_upwards [nhdsWithin_le_nhds (Ioi_mem_nhds (show (0:ℝ) < 3 by norm_num))] with x hx
    simp only [mem_Ioi] at hx
    simp [f4, not_le.mpr hx, abs_div]
  refine ⟨fun x => by constructor <;> intro h <;> linarith, hpol, fun h => ?_⟩
  have h1 : Tendsto (fun x => |f4 x|) (𝓝[≠] 3) (𝓝 |f4 3|) :=
    (h.tendsto.abs).mono_left nhdsWithin_le_nhds
  exact not_tendsto_nhds_of_tendsto_atTop hpol _ h1

/-- Primer 4, odgovor: f je zvezna na (−∞, 3) in na (3, ∞). -/
theorem primer4_intervali : ContinuousOn f4 (Iio 3) ∧ ContinuousOn f4 (Ioi 3) := by
  have hat : ∀ x : ℝ, x ≠ 3 → ContinuousAt f4 x := by
    intro x hx
    rcases lt_trichotomy x 0 with h | h | h
    · have e : (fun x : ℝ => x + 2) =ᶠ[𝓝 x] f4 := by
        filter_upwards [Iio_mem_nhds h] with y hy
        simp [f4, le_of_lt (show y < 0 from hy)]
      exact ((by fun_prop : Continuous fun x : ℝ => x + 2).continuousAt).congr e
    · rw [h]; exact primer4_stik.2.2.2
    · have e : (fun x : ℝ => (x + 6) / (3 - x)) =ᶠ[𝓝 x] f4 := by
        filter_upwards [Ioi_mem_nhds h] with y hy
        simp [f4, not_le.mpr (show 0 < y from hy)]
      have hd : (3:ℝ) - x ≠ 0 := sub_ne_zero.mpr (Ne.symm hx)
      exact (((continuous_id.add continuous_const).continuousAt).div
        ((continuous_const.sub continuous_id).continuousAt) hd).congr e
  exact ⟨fun x hx => (hat x (ne_of_lt hx)).continuousWithinAt,
    fun x hx => (hat x (ne_of_gt hx)).continuousWithinAt⟩

/-- Primer 5 (premisli): √4 − 2 = 0, 4 − 4 = 0; (√x − 2)(√x + 2) = x − 4 za x ≥ 0 in
lim_{x→4} (√x − 2)/(x − 4) = 1/(2 + 2) = 1/4 = 0,25. -/
theorem primer5 : √(4:ℝ) - 2 = 0 ∧ (4:ℝ) - 4 = 0 ∧
    (∀ x : ℝ, 0 ≤ x → (√x - 2) * (√x + 2) = x - 4) ∧
    Tendsto (fun x : ℝ => (√x - 2) / (x - 4)) (𝓝[≠] 4) (𝓝 0.25) := by
  have h4 : √(4:ℝ) = 2 := by rw [show (4:ℝ) = 2 ^ 2 by norm_num, sqrt_sq (by norm_num)]
  have hr : ∀ x : ℝ, 0 ≤ x → (√x - 2) * (√x + 2) = x - 4 := fun x hx => by
    have := sq_sqrt hx; nlinarith
  refine ⟨by rw [h4]; norm_num, by norm_num, hr, ?_⟩
  have hc : ContinuousAt (fun x : ℝ => 1 / (√x + 2)) 4 :=
    ((continuous_const.div (continuous_sqrt.add continuous_const)
      (fun x => (add_pos_of_nonneg_of_pos (sqrt_nonneg _) two_pos).ne')).continuousAt)
  have ht : Tendsto (fun x : ℝ => 1 / (√x + 2)) (𝓝[≠] 4) (𝓝 (1 / (√4 + 2))) :=
    hc.tendsto.mono_left nhdsWithin_le_nhds
  rw [h4, show (1 / (2 + 2) : ℝ) = 0.25 by norm_num] at ht
  refine ht.congr' ?_
  filter_upwards [self_mem_nhdsWithin, nhdsWithin_le_nhds (Ioi_mem_nhds (show (0:ℝ) < 4 by norm_num))]
    with x hx hpos
  have hx4 : x - 4 ≠ 0 := sub_ne_zero.mpr hx
  have h2 : √x - 2 ≠ 0 := by intro h; apply hx4; rw [← hr x (le_of_lt hpos), h, zero_mul]
  rw [← hr x (le_of_lt hpos)]
  field_simp

/-- Matura, naloga 1 (in vrstica `limita`): pri x = 1 sta števec 1 + 2 − 3 = 0 in imenovalec 1 − 1 = 0;
x² + 2x − 3 = (x − 1)(x + 3), x² − 1 = (x − 1)(x + 1); po krajšanju (x + 3)/(x + 1) in limita
(1 + 3)/(1 + 1) = 2. -/
theorem matura1 : (1:ℝ) + 2 - 3 = 0 ∧ (1:ℝ) - 1 = 0 ∧
    (∀ x : ℝ, x ^ 2 + 2 * x - 3 = (x - 1) * (x + 3) ∧ x ^ 2 - 1 = (x - 1) * (x + 1)) ∧
    Tendsto (fun x : ℝ => (x ^ 2 + 2 * x - 3) / (x ^ 2 - 1)) (𝓝[≠] 1) (𝓝 2) := by
  refine ⟨by norm_num, by norm_num, fun x => ⟨by ring, by ring⟩, ?_⟩
  have hc : ContinuousAt (fun x : ℝ => (x + 3) / (x + 1)) 1 :=
    ((continuous_id.add continuous_const).continuousAt).div
      ((continuous_id.add continuous_const).continuousAt) (by norm_num)
  have ht : Tendsto (fun x : ℝ => (x + 3) / (x + 1)) (𝓝[≠] 1) (𝓝 ((1 + 3) / (1 + 1))) :=
    hc.tendsto.mono_left nhdsWithin_le_nhds
  norm_num at ht
  refine ht.congr' ?_
  filter_upwards [self_mem_nhdsWithin, nhdsWithin_le_nhds (Ioi_mem_nhds (show (0:ℝ) < 1 by norm_num))]
    with x hx hpos
  have h1 : x - 1 ≠ 0 := sub_ne_zero.mpr hx
  have h2 : x + 1 ≠ 0 := by simp only [mem_Ioi] at hpos; linarith
  rw [show x ^ 2 + 2 * x - 3 = (x - 1) * (x + 3) by ring, show x ^ 2 - 1 = (x - 1) * (x + 1) by ring]
  field_simp

/-- Matura, naloga 2 a): x² − x − 2 = (x − 2)(x + 1) je 0 natanko pri x = 2 ali x = −1, zato
D_f = ℝ ∖ {−1, 2}. -/
theorem matura2a (x : ℝ) : x ^ 2 - x - 2 = (x - 2) * (x + 1) ∧ (x ^ 2 - x - 2 = 0 ↔ x = 2 ∨ x = -1) := by
  have h : x ^ 2 - x - 2 = (x - 2) * (x + 1) := by ring
  refine ⟨h, ?_⟩
  rw [h, mul_eq_zero]
  constructor
  · rintro (h | h)
    · left; linarith
    · right; linarith
  · rintro (h | h)
    · left; linarith
    · right; linarith

/-- Matura, naloga 2 b) (in vrstica `enako`): 2 · 4 − 8 = 0; 2x² − 8 = 2(x − 2)(x + 2) in na D_f je
f(x) = 2(x + 2)/(x + 1). -/
theorem matura2_okrajsano (x : ℝ) (h1 : x - 2 ≠ 0) (h2 : x + 1 ≠ 0) :
    (2:ℝ) * 4 - 8 = 0 ∧ 2 * x ^ 2 - 8 = 2 * (x - 2) * (x + 2) ∧
      (2 * x ^ 2 - 8) / (x ^ 2 - x - 2) = 2 * (x + 2) / (x + 1) := by
  refine ⟨by norm_num, by ring, ?_⟩
  rw [(matura2a x).1, show 2 * x ^ 2 - 8 = 2 * (x - 2) * (x + 2) by ring]
  field_simp

/-- Predpostavke trditve `matura2_okrajsano` se dajo izpolniti (x = 0). -/
example : (0:ℝ) - 2 ≠ 0 ∧ (0:ℝ) + 1 ≠ 0 := by norm_num

/-- Matura, naloga 2 b) (in vrstica `limita ... | 2 | 8/3`): lim_{x→2} f(x) = 2 · 4/3 = 8/3 (luknja). -/
theorem matura2b : Tendsto (fun x : ℝ => (2 * x ^ 2 - 8) / (x ^ 2 - x - 2)) (𝓝[≠] 2) (𝓝 (8 / 3)) := by
  have hc : ContinuousAt (fun x : ℝ => 2 * (x + 2) / (x + 1)) 2 :=
    ((continuous_const.mul (continuous_id.add continuous_const)).continuousAt).div
      ((continuous_id.add continuous_const).continuousAt) (by norm_num)
  have ht : Tendsto (fun x : ℝ => 2 * (x + 2) / (x + 1)) (𝓝[≠] 2) (𝓝 (2 * (2 + 2) / (2 + 1))) :=
    hc.tendsto.mono_left nhdsWithin_le_nhds
  norm_num at ht
  refine ht.congr' ?_
  filter_upwards [self_mem_nhdsWithin, nhdsWithin_le_nhds (Ioi_mem_nhds (show (0:ℝ) < 2 by norm_num))]
    with x hx hpos
  simp only [mem_Ioi] at hpos
  rw [(matura2_okrajsano x (sub_ne_zero.mpr hx) (by linarith)).2.2]

/-- Matura, naloga 2 c): pri x → −1 gre števec 2(x + 2) proti 2 > 0; leva limita je −∞, desna +∞
(pol, navpična asimptota x = −1). -/
theorem matura2c :
    Tendsto (fun x : ℝ => (2 * x ^ 2 - 8) / (x ^ 2 - x - 2)) (𝓝[<] (-1)) atBot ∧
      Tendsto (fun x : ℝ => (2 * x ^ 2 - 8) / (x ^ 2 - x - 2)) (𝓝[>] (-1)) atTop := by
  have hnum : Tendsto (fun x : ℝ => 2 * (x + 2)) (𝓝 (-1)) (𝓝 2) := by
    have : Tendsto (fun x : ℝ => 2 * (x + 2)) (𝓝 (-1)) (𝓝 (2 * (-1 + 2))) :=
      (by fun_prop : Continuous fun x : ℝ => 2 * (x + 2)).tendsto (-1)
    norm_num at this; exact this
  have hden0 : Tendsto (fun x : ℝ => x + 1) (𝓝 (-1)) (𝓝 0) := by
    have : Tendsto (fun x : ℝ => x + 1) (𝓝 (-1)) (𝓝 (-1 + 1)) :=
      (by fun_prop : Continuous fun x : ℝ => x + 1).tendsto (-1)
    norm_num at this; exact this
  have hnear : ∀ᶠ x in 𝓝 (-1 : ℝ), x - 2 ≠ 0 := by
    filter_upwards [Iio_mem_nhds (show (-1:ℝ) < 2 by norm_num)] with x hx
    simp only [mem_Iio] at hx; linarith
  constructor
  · have hden : Tendsto (fun x : ℝ => x + 1) (𝓝[<] (-1)) (𝓝[<] 0) := by
      rw [tendsto_nhdsWithin_iff]
      exact ⟨hden0.mono_left nhdsWithin_le_nhds,
        eventually_nhdsWithin_of_forall fun x (hx : x < -1) => by simp only [mem_Iio]; linarith⟩
    refine (pol_atBot _ _ 2 (by norm_num) (hnum.mono_left nhdsWithin_le_nhds) hden).congr' ?_
    filter_upwards [self_mem_nhdsWithin, nhdsWithin_le_nhds hnear] with x hx h2
    simp only [mem_Iio] at hx
    rw [(matura2_okrajsano x h2 (by linarith)).2.2]
  · have hden : Tendsto (fun x : ℝ => x + 1) (𝓝[>] (-1)) (𝓝[>] 0) := by
      rw [tendsto_nhdsWithin_iff]
      exact ⟨hden0.mono_left nhdsWithin_le_nhds,
        eventually_nhdsWithin_of_forall fun x (hx : -1 < x) => by simp only [mem_Ioi]; linarith⟩
    refine (pol_atTop _ _ 2 (by norm_num) (hnum.mono_left nhdsWithin_le_nhds) hden).congr' ?_
    filter_upwards [self_mem_nhdsWithin, nhdsWithin_le_nhds hnear] with x hx h2
    simp only [mem_Ioi] at hx
    rw [(matura2_okrajsano x h2 (by linarith)).2.2]

/-- Matura, naloga 2 d) (in vrstica `limita ... | oo | 2`): f(x) = (2 − 8/x²)/(1 − 1/x − 2/x²) in
lim_{x→∞} f(x) = 2/1 = 2 (vodoravna asimptota y = 2). -/
theorem matura2d : Tendsto (fun x : ℝ => (2 * x ^ 2 - 8) / (x ^ 2 - x - 2)) atTop (𝓝 2) := by
  have hi := tendsto_inv_atTop_zero (𝕜 := ℝ)
  have h : Tendsto (fun x : ℝ => (2 - 8 * (x⁻¹) ^ 2) / (1 - x⁻¹ - 2 * (x⁻¹) ^ 2)) atTop
      (𝓝 ((2 - 8 * 0 ^ 2) / (1 - 0 - 2 * 0 ^ 2))) :=
    (tendsto_const_nhds.sub ((hi.pow 2).const_mul 8)).div
      ((tendsto_const_nhds.sub hi).sub ((hi.pow 2).const_mul 2)) (by norm_num)
  norm_num at h
  refine h.congr' ?_
  filter_upwards [eventually_gt_atTop 2] with x hx
  have hx0 : x ≠ 0 := by linarith
  have hd : x ^ 2 - x - 2 ≠ 0 := by rw [(matura2a x).1]; exact mul_ne_zero (by linarith) (by linarith)
  have hd' : 1 - x⁻¹ - 2 * (x⁻¹) ^ 2 ≠ 0 := by
    rw [show 1 - x⁻¹ - 2 * (x⁻¹) ^ 2 = (x ^ 2 - x - 2) / x ^ 2 by field_simp]
    exact div_ne_zero hd (by positivity)
  field_simp

/-- Matura, naloga 3: f(x) = sin 2x / x za x < 0, f(0) = c, b(√(x + 4) − 2)/x za x > 0. -/
noncomputable def f3 (b c x : ℝ) : ℝ :=
  if x < 0 then sin (2 * x) / x else if x = 0 then c else b * (√(x + 4) - 2) / x

/-- Matura, naloga 3 a), koraka 1–2 (in vrstica `limita: sin(2*x)/x`): sin 2x / x = 2 · sin 2x/(2x) za
x ≠ 0 in lim_{x→0} sin 2x / x = 2 · 1 = 2 (dvostranska, torej tudi leva limita). -/
theorem matura3a : (∀ x : ℝ, x ≠ 0 → sin (2 * x) / x = 2 * (sin (2 * x) / (2 * x))) ∧
    Tendsto (fun x : ℝ => sin (2 * x) / x) (𝓝[≠] 0) (𝓝 2) := by
  have hk : ∀ x : ℝ, x ≠ 0 → sin (2 * x) / x = 2 * (sin (2 * x) / (2 * x)) := fun x hx => by
    field_simp
  refine ⟨hk, ?_⟩
  have h2 : Tendsto (fun x : ℝ => 2 * x) (𝓝[≠] 0) (𝓝[≠] 0) := by
    rw [tendsto_nhdsWithin_iff]
    refine ⟨?_, eventually_nhdsWithin_of_forall fun x (hx : x ≠ 0) => by
      simp only [mem_compl_iff, mem_singleton_iff]; exact mul_ne_zero two_ne_zero hx⟩
    have : Tendsto (fun x : ℝ => 2 * x) (𝓝 0) (𝓝 (2 * 0)) := (continuous_const.mul continuous_id).tendsto 0
    simpa using this.mono_left nhdsWithin_le_nhds
  have := (limita_sinc.comp h2).const_mul 2
  norm_num at this
  refine this.congr' (eventually_nhdsWithin_of_forall fun x hx => ?_)
  exact (hk x hx).symm

/-- Matura, naloga 3 b), koraki 3–5 (in vrstica `limita: (sqrt(x+4)-2)/x`):
(√(x + 4) − 2)(√(x + 4) + 2) = x za x ≥ −4; po krajšanju b/(√(x + 4) + 2) in
lim_{x→0} b(√(x + 4) − 2)/x = b/(√4 + 2) = b/4. -/
theorem matura3b (b : ℝ) : (∀ x : ℝ, -4 ≤ x → (√(x + 4) - 2) * (√(x + 4) + 2) = x + 4 - 4) ∧
    Tendsto (fun x : ℝ => b * (√(x + 4) - 2) / x) (𝓝[≠] 0) (𝓝 (b / 4)) := by
  have hr : ∀ x : ℝ, -4 ≤ x → (√(x + 4) - 2) * (√(x + 4) + 2) = x + 4 - 4 := fun x hx => by
    have := sq_sqrt (show 0 ≤ x + 4 by linarith); nlinarith
  refine ⟨hr, ?_⟩
  have h4 : √((0:ℝ) + 4) = 2 := by rw [show (0:ℝ) + 4 = 2 ^ 2 by norm_num, sqrt_sq (by norm_num)]
  have hc : ContinuousAt (fun x : ℝ => b / (√(x + 4) + 2)) 0 :=
    (continuous_const.div ((continuous_sqrt.comp (continuous_id.add continuous_const)).add continuous_const)
      (fun x => (add_pos_of_nonneg_of_pos (sqrt_nonneg _) two_pos).ne')).continuousAt
  have ht : Tendsto (fun x : ℝ => b / (√(x + 4) + 2)) (𝓝[≠] 0) (𝓝 (b / (√(0 + 4) + 2))) :=
    hc.tendsto.mono_left nhdsWithin_le_nhds
  rw [h4, show (2:ℝ) + 2 = 4 by norm_num] at ht
  refine ht.congr' ?_
  filter_upwards [self_mem_nhdsWithin, nhdsWithin_le_nhds (Ioi_mem_nhds (show (-4:ℝ) < 0 by norm_num))]
    with x hx hpos
  simp only [mem_Ioi] at hpos
  have hs : √(x + 4) + 2 ≠ 0 := (add_pos_of_nonneg_of_pos (sqrt_nonneg _) two_pos).ne'
  have hx0 : x ≠ 0 := hx
  rw [show b * (√(x + 4) - 2) / x = b * ((√(x + 4) - 2) * (√(x + 4) + 2)) / (x * (√(x + 4) + 2)) by
    field_simp, hr x hpos.le]
  field_simp; ring

/-- Matura, naloga 3 c): f je zvezna v 0 natanko tedaj, ko je b = 8 in f(0) = 2 (b/4 = 2). -/
theorem matura3c (b c : ℝ) : ContinuousAt (f3 b c) 0 ↔ b = 8 ∧ c = 2 := by
  have hc0 : f3 b c 0 = c := by simp [f3]
  have hl : Tendsto (f3 b c) (𝓝[<] 0) (𝓝 2) := by
    refine (matura3a.2.mono_left (nhdsWithin_mono _ (lt_podmn 0))).congr'
      (eventually_nhdsWithin_of_forall fun x (hx : x < 0) => ?_)
    simp [f3, hx]
  have hr : Tendsto (f3 b c) (𝓝[>] 0) (𝓝 (b / 4)) := by
    refine ((matura3b b).2.mono_left (nhdsWithin_mono _ (gt_podmn 0))).congr'
      (eventually_nhdsWithin_of_forall fun x (hx : 0 < x) => ?_)
    simp [f3, not_lt.mpr hx.le, hx.ne']
  rw [continuousAt_iff_continuous_left'_right', ContinuousWithinAt, ContinuousWithinAt, hc0]
  constructor
  · rintro ⟨h1, h2⟩
    have e1 := tendsto_nhds_unique h1 hl
    have e2 := tendsto_nhds_unique h2 hr
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩
    refine ⟨hl, ?_⟩
    norm_num at hr; exact hr

/-- Matura, naloga 3 d) (in vrstici `limita: 8*(sqrt(x+4)-2)/x`): pri b = 8, f(0) = 2 je f zvezna na ℝ,
za x > 0 je f(x) = 8/(√(x + 4) + 2) in lim_{x→∞} f(x) = 0; dvostranska limita 8(√(x + 4) − 2)/x v 0 je 2. -/
theorem matura3d : Continuous (f3 8 2) ∧ Tendsto (f3 8 2) atTop (𝓝 0) ∧
    Tendsto (fun x : ℝ => 8 * (√(x + 4) - 2) / x) (𝓝[≠] 0) (𝓝 2) := by
  have hkr : ∀ x : ℝ, 0 < x → f3 8 2 x = 8 / (√(x + 4) + 2) := by
    intro x hx
    have hs : √(x + 4) + 2 ≠ 0 := (add_pos_of_nonneg_of_pos (sqrt_nonneg _) two_pos).ne'
    have := (matura3b 8).1 x (by linarith)
    simp only [f3, not_lt.mpr hx.le, hx.ne', ↓reduceIte]
    rw [div_eq_div_iff hx.ne' hs]
    nlinarith
  refine ⟨continuous_iff_continuousAt.mpr fun x => ?_, ?_, ?_⟩
  · rcases lt_trichotomy x 0 with h | h | h
    · have e : (fun x : ℝ => sin (2 * x) / x) =ᶠ[𝓝 x] f3 8 2 := by
        filter_upwards [Iio_mem_nhds h] with y hy
        simp [f3, show y < 0 from hy]
      exact ((((continuous_sin.comp (continuous_const.mul continuous_id)).continuousAt).div
        continuousAt_id h.ne)).congr e
    · rw [h]; exact (matura3c 8 2).mpr ⟨rfl, rfl⟩
    · have e : (fun x : ℝ => 8 / (√(x + 4) + 2)) =ᶠ[𝓝 x] f3 8 2 := by
        filter_upwards [Ioi_mem_nhds h] with y hy
        exact (hkr y hy).symm
      exact ((continuous_const.div ((continuous_sqrt.comp (continuous_id.add continuous_const)).add
        continuous_const) (fun x => (add_pos_of_nonneg_of_pos (sqrt_nonneg _) two_pos).ne')).continuousAt).congr e
  · have hden : Tendsto (fun x : ℝ => √(x + 4) + 2) atTop atTop :=
      tendsto_atTop_add_const_right _ 2
        ((tendsto_sqrt_atTop).comp (tendsto_atTop_add_const_right _ 4 tendsto_id))
    refine (hden.const_div_atTop 8).congr' ?_
    filter_upwards [eventually_gt_atTop 0] with x hx
    exact (hkr x hx).symm
  · have := (matura3b 8).2; norm_num at this; exact this

/-- Matura, naloga 3 c), korak 7: b/4 = 2 ⇔ b = 8. -/
theorem matura3_b (b : ℝ) : b / 4 = 2 ↔ b = 8 := by constructor <;> intro h <;> linarith

/-- Ustno vprašanje 2: lim_{x→0} 1/x² = ∞ (pol, navpična asimptota). -/
theorem ena_skozi_x2 : Tendsto (fun x : ℝ => 1 / x ^ 2) (𝓝[≠] 0) atTop := by
  refine pol_atTop _ _ 1 one_pos tendsto_const_nhds ?_
  rw [tendsto_nhdsWithin_iff]
  refine ⟨?_, eventually_nhdsWithin_of_forall fun x (hx : x ≠ 0) => by
    simp only [mem_Ioi]; positivity⟩
  have : Tendsto (fun x : ℝ => x ^ 2) (𝓝 0) (𝓝 (0 ^ 2)) := (continuous_pow 2).tendsto 0
  simpa using this.mono_left nhdsWithin_le_nhds

/-- Ustno vprašanje 3 in »Drugače: Bolj natančno«: za 0 < x < π/2 je sin x < x < tan x in zato
cos x < sin x / x < 1; zaradi sodosti isto velja za −π/2 < x < 0. -/
theorem sendvic (x : ℝ) (h0 : 0 < |x|) (h1 : |x| < π / 2) : cos x < sin x / x ∧ sin x / x < 1 := by
  have key : ∀ y : ℝ, 0 < y → y < π / 2 → cos y < sin y / y ∧ sin y / y < 1 := by
    intro y hy hy2
    have hs := sin_lt hy
    have ht := lt_tan hy hy2
    have hc : 0 < cos y := cos_pos_of_mem_Ioo ⟨by linarith [pi_pos], hy2⟩
    rw [tan_eq_sin_div_cos, lt_div_iff₀ hc] at ht
    constructor
    · rw [lt_div_iff₀ hy]; linarith
    · rw [div_lt_one hy]; exact hs
  rcases lt_or_gt_of_ne (abs_pos.mp h0) with h | h
  · have := key (-x) (by linarith) (by rw [abs_of_neg h] at h1; linarith)
    rwa [cos_neg, sinc_soda] at this
  · exact key x h (by rwa [abs_of_pos h] at h1)

/-- Predpostavke trditve `sendvic` se dajo izpolniti (x = 1). -/
example : (0:ℝ) < |1| ∧ |(1:ℝ)| < π / 2 := by
  rw [abs_one]; exact ⟨one_pos, by linarith [pi_gt_three]⟩

/-- Drugače, bolj natančno: |2x + 1 − 7| = 2|x − 3| in z δ = ε/2 je lim_{x→3} (2x + 1) = 7 po
definiciji ε-δ. -/
theorem epsilon_delta : (∀ x : ℝ, |2 * x + 1 - 7| = 2 * |x - 3|) ∧
    ∀ ε > 0, ∃ δ > 0, ∀ x : ℝ, 0 < |x - 3| → |x - 3| < δ → |2 * x + 1 - 7| < ε := by
  have he : ∀ x : ℝ, |2 * x + 1 - 7| = 2 * |x - 3| := fun x => by
    rw [show 2 * x + 1 - 7 = 2 * (x - 3) by ring, abs_mul]; norm_num
  refine ⟨he, fun ε hε => ⟨ε / 2, by positivity, fun x _ hx => ?_⟩⟩
  rw [he]; linarith

/-- Preveri se, vprašanje 2: A = lim_{x→∞} (2x + 1)/(x − 3) = 2, B = 1, C = lim_{x→2} (x² − 4)/(x − 2) = 4;
torej B < A < C. -/
theorem kviz2 : Tendsto (fun x : ℝ => (2 * x + 1) / (x - 3)) atTop (𝓝 2) ∧
    Tendsto (fun x : ℝ => sin x / x) (𝓝[≠] 0) (𝓝 1) ∧
    Tendsto (fun x : ℝ => (x ^ 2 - 4) / (x - 2)) (𝓝[≠] 2) (𝓝 4) ∧ (1:ℝ) < 2 ∧ (2:ℝ) < 4 := by
  refine ⟨?_, limita_sinc, ?_, by norm_num, by norm_num⟩
  · have hi := tendsto_inv_atTop_zero (𝕜 := ℝ)
    have h : Tendsto (fun x : ℝ => (2 + x⁻¹) / (1 - 3 * x⁻¹)) atTop (𝓝 ((2 + 0) / (1 - 3 * 0))) :=
      (tendsto_const_nhds.add hi).div (tendsto_const_nhds.sub (hi.const_mul 3)) (by norm_num)
    norm_num at h
    refine h.congr' ?_
    filter_upwards [eventually_gt_atTop 3] with x hx
    have hx0 : x ≠ 0 := by linarith
    have h3 : x - 3 ≠ 0 := by linarith
    have h3' : 1 - 3 * x⁻¹ ≠ 0 := by
      rw [show 1 - 3 * x⁻¹ = (x - 3) / x by field_simp]; exact div_ne_zero h3 hx0
    field_simp
  · have hk : ∀ x : ℝ, x ≠ 2 → (x ^ 2 - 4) / (x - 2) = x + 2 := fun x hx => by
      have : x - 2 ≠ 0 := sub_ne_zero.mpr hx
      rw [show x ^ 2 - 4 = (x - 2) * (x + 2) by ring]; field_simp
    have := limita_okrajsaj _ (fun x => x + 2) 2 hk (by fun_prop)
    norm_num at this; exact this

/-- Preveri se, vprašanje 3: f(x) = 1/(x − 1)² raste čez vse meje, ko x → 1 (z obeh strani); pol pri 1. -/
theorem kviz3 : Tendsto (fun x : ℝ => 1 / (x - 1) ^ 2) (𝓝[≠] 1) atTop := by
  refine pol_atTop _ _ 1 one_pos tendsto_const_nhds ?_
  rw [tendsto_nhdsWithin_iff]
  refine ⟨?_, eventually_nhdsWithin_of_forall fun x (hx : x ≠ 1) => by
    simp only [mem_Ioi]; have : x - 1 ≠ 0 := sub_ne_zero.mpr hx; positivity⟩
  have : Tendsto (fun x : ℝ => (x - 1) ^ 2) (𝓝 1) (𝓝 ((1 - 1) ^ 2)) :=
    (by fun_prop : Continuous fun x : ℝ => (x - 1) ^ 2).tendsto 1
  simpa using this.mono_left nhdsWithin_le_nhds

/-- Preveri se, vprašanje 4: x² + 5x + 6 = (x + 2)(x + 3) in lim_{x→−2} (x² + 5x + 6)/(x + 2) = −2 + 3 = 1. -/
theorem kviz4 : Tendsto (fun x : ℝ => (x ^ 2 + 5 * x + 6) / (x + 2)) (𝓝[≠] (-2)) (𝓝 1) := by
  have hk : ∀ x : ℝ, x ≠ -2 → (x ^ 2 + 5 * x + 6) / (x + 2) = x + 3 := fun x hx => by
    have : x + 2 ≠ 0 := fun h => hx (by linarith)
    rw [show x ^ 2 + 5 * x + 6 = (x + 2) * (x + 3) by ring]; field_simp
  have := limita_okrajsaj _ (fun x => x + 3) (-2) hk (by fun_prop)
  norm_num at this; exact this

/-- Preveri se, vprašanje 5: v(0) = 1 in lim_{t→∞} (12t² + 5)/(4t² + 5) = 12/4 = 3. -/
theorem kviz5 : ((12:ℝ) * 0 ^ 2 + 5) / (4 * 0 ^ 2 + 5) = 1 ∧
    Tendsto (fun t : ℝ => (12 * t ^ 2 + 5) / (4 * t ^ 2 + 5)) atTop (𝓝 3) := by
  refine ⟨by norm_num, ?_⟩
  have hi := tendsto_inv_atTop_zero (𝕜 := ℝ)
  have h : Tendsto (fun t : ℝ => (12 + 5 * (t⁻¹) ^ 2) / (4 + 5 * (t⁻¹) ^ 2)) atTop
      (𝓝 ((12 + 5 * 0 ^ 2) / (4 + 5 * 0 ^ 2))) :=
    (tendsto_const_nhds.add ((hi.pow 2).const_mul 5)).div
      (tendsto_const_nhds.add ((hi.pow 2).const_mul 5)) (by norm_num)
  norm_num at h
  refine h.congr' ?_
  filter_upwards [eventually_ne_atTop 0] with t ht
  have h1 : 4 * t ^ 2 + 5 ≠ 0 := by positivity
  have h2 : 4 + 5 * (t⁻¹) ^ 2 ≠ 0 := by positivity
  field_simp

/-- Preveri se, vprašanje 6 (in vrstica `resi: x^2-4*x=0`): x² − 4x = x(x − 4) = 0 natanko pri x = 0 ali
x = 4; f(x) = (x + 1)/(x² − 4x) je zvezna na (−∞, 0), (0, 4) in (4, ∞); f(−1) = 0. -/
theorem kviz6 : (∀ x : ℝ, x ^ 2 - 4 * x = 0 ↔ x = 0 ∨ x = 4) ∧
    ContinuousOn (fun x : ℝ => (x + 1) / (x ^ 2 - 4 * x)) (Iio 0) ∧
    ContinuousOn (fun x : ℝ => (x + 1) / (x ^ 2 - 4 * x)) (Ioo 0 4) ∧
    ContinuousOn (fun x : ℝ => (x + 1) / (x ^ 2 - 4 * x)) (Ioi 4) ∧
    ((-1:ℝ) + 1) / ((-1) ^ 2 - 4 * (-1)) = 0 := by
  have hz : ∀ x : ℝ, x ^ 2 - 4 * x = 0 ↔ x = 0 ∨ x = 4 := fun x => by
    rw [show x ^ 2 - 4 * x = x * (x - 4) by ring, mul_eq_zero]
    constructor
    · rintro (h | h)
      · left; exact h
      · right; linarith
    · rintro (h | h)
      · left; exact h
      · right; linarith
  have hc : ∀ s : Set ℝ, (∀ x ∈ s, x ≠ 0 ∧ x ≠ 4) →
      ContinuousOn (fun x : ℝ => (x + 1) / (x ^ 2 - 4 * x)) s := fun s hs =>
    ContinuousOn.div (by fun_prop) (by fun_prop) fun x hx h => by
      rcases (hz x).mp h with h | h
      · exact (hs x hx).1 h
      · exact (hs x hx).2 h
  refine ⟨hz, hc _ fun x (hx : x < 0) => ⟨by linarith, by linarith⟩,
    hc _ fun x hx => ⟨hx.1.ne', hx.2.ne⟩, hc _ fun x (hx : 4 < x) => ⟨by linarith, by linarith⟩,
    by norm_num⟩

end Evklid.Lekcije.MAT_SS_4.LimitaInZveznostFunkcije
