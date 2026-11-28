/-
vir: content/lessons/MAT-SS-4/statistika.md
sha256: a0cc688c0a4dac39b3beebd923ea6f692b7b9e03135ceb3985d47db8055ff183
Ni v Leanu: tabelne vrednosti Φ (Φ(1) = 0,3413, Φ(1,5) = 0,4332, Φ(2) = 0,4772, Φ(0,5), Φ(1,25), Φ(1,75))
in pravilo 68–95–99,7 % (numerični integrali gostote; Mathlib nima numeričnih mej zanje) – zato so primeri
z normalno porazdelitvijo dokazani kot račun s podanimi tabelnimi vrednostmi, P(X > 23) ≈ 0,13 % pri z = 3
pa sploh ne (Φ(3) v lekciji ni podan); prevoja pri μ ± σ (zahtevno, še ni dokazano); standardizacija
kot zamenjava spremenljivke v integralu za splošna μ, σ (zahtevno, še ni dokazano; dokazano le
P(Z < z) = 0,5 + Φ(z), P(Z > z) = 0,5 − Φ(z), Φ(−z) = −Φ(z) za standardno Z); histogram, simulacija, škatla z brki (risba),
pravilo za osamelce kot dogovor (dokazane so le meje in primerjave); vzorčni odklon in navodila za
računalo; besedne razlage (premisli, ustna vprašanja, »Iz vsakdanjega življenja«, kviza 4 in 5 brez računa
razen z-vrednosti in 0,5 − 0,3413).
Opomba: `varianca_nenegativna` velja tudi pri N = 0, a le zaradi Leanovega dogovora x/0 = 0 (varianca 0);
v lekciji je N ≥ 1.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.Statistika

open Real MeasureTheory Set ProbabilityTheory

/-! ## Uvod in Razlaga 1: igrice (10 dijakov) -/

/-- Uvod: podatki o igranju (minute), urejeni po velikosti. -/
def igrice : List ℕ := [20, 30, 30, 40, 40, 40, 50, 60, 90, 400]

/-- Uvod in Razlaga 1: vsota je 800, x̄ = 800 : 10 = 80; več kot 80 minut igrata le dva od desetih.
trditev: MAT-SS-4/statistika#igrice-sredina
besedilo: »Za igrice: $\bar x = 800 : 10 = 80$ minut.« -/
theorem igrice_sredina : igrice.sum = 800 ∧ (800 : ℝ) / 10 = 80 ∧ igrice.length = 10 ∧
    (igrice.filter (fun x => 80 < x)).length = 2 := by
  refine ⟨by decide, by norm_num, by decide, by decide⟩

/-- Razlaga 1: niz je urejen; na 5. in 6. mestu sta 40 in 40, zato Me = (40 + 40)/2 = 40.
trditev: MAT-SS-4/statistika#igrice-mediana
besedilo: »Pri igricah sta na 5. in 6. mestu $40$ in $40$, zato je $\mathrm{Me} = 40$ minut.« -/
theorem igrice_mediana : igrice.Pairwise (· ≤ ·) ∧ igrice.getD 4 0 = 40 ∧ igrice.getD 5 0 = 40 ∧
    ((40 : ℝ) + 40) / 2 = 40 := by
  refine ⟨by decide, by decide, by decide, by norm_num⟩

/-- Razlaga 1: modus je 40 (pojavi se 3-krat, vsak drug podatek redkeje).
trditev: MAT-SS-4/statistika#igrice-modus
besedilo: »Tretja mera je **modus** $\mathrm{Mo}$, najpogostejši podatek. Tu je to $40$.« -/
theorem igrice_modus : igrice.count 40 = 3 ∧ ∀ x ∈ igrice, x ≠ 40 → igrice.count x < igrice.count 40 := by
  decide

/-- Razlaga 1: če 400 zamenjamo s 4000, ostane niz urejen in mediana 40.
trditev: MAT-SS-4/statistika#igrice-4000
besedilo: »Mediana gleda le *vrstni red*: če $400$ zamenjamo s $4000$, ostane $40$.« -/
theorem igrice_4000 : [20, 30, 30, 40, 40, 40, 50, 60, 90, 4000].Pairwise (· ≤ ·) ∧
    [20, 30, 30, 40, 40, 40, 50, 60, 90, 4000].getD 4 0 = 40 ∧
    [20, 30, 30, 40, 40, 40, 50, 60, 90, 4000].getD 5 0 = 40 := by decide

/-- Razlaga 1, premisli: 400 popravimo na 100: vsota 500, sredina 50, niz ostane urejen, mediana 40.
trditev: MAT-SS-4/statistika#igrice-100
besedilo: »Sredina pade z $80$ na $50$ minut (vsota je $500$), mediana ostane $40$. Mediana se ni spremenila, ker je $100$ še vedno največji podatek in vrstni red ostane enak.« -/
theorem igrice_100 : [20, 30, 30, 40, 40, 40, 50, 60, 90, 100].sum = 500 ∧ (500 : ℝ) / 10 = 50 ∧
    [20, 30, 30, 40, 40, 40, 50, 60, 90, 100].Pairwise (· ≤ ·) ∧
    [20, 30, 30, 40, 40, 40, 50, 60, 90, 100].getD 4 0 = 40 ∧
    [20, 30, 30, 40, 40, 40, 50, 60, 90, 100].getD 5 0 = 40 := by
  refine ⟨by decide, by norm_num, by decide, by decide, by decide⟩

/-! ## Razlaga 2: razpršenost -/

/-- Razlaga 2 in ustno vprašanje 3: vsota odklonov od sredine je vedno 0:
Σ(xᵢ − x̄) = Nx̄ − Nx̄ = 0, kjer je x̄ = (Σxᵢ)/N in N ≥ 1.
trditev: MAT-SS-4/statistika#vsota-odklonov
besedilo: »Odklonov ne smemo kar sešteti, ker je njihova vsota vedno $0$: $(x_1 - \bar x) + \dots + (x_N - \bar x) = N\bar x - N\bar x = 0$.« -/
theorem vsota_odklonov (N : ℕ) (hN : N ≠ 0) (x : Fin N → ℝ) :
    ∑ i, (x i - (∑ j, x j) / N) = 0 := by
  rw [Finset.sum_sub_distrib, Finset.sum_const, Finset.card_univ, Fintype.card_fin, nsmul_eq_mul]
  have : (N : ℝ) ≠ 0 := by exact_mod_cast hN
  field_simp
  ring

/-- Predpostavka trditve `vsota_odklonov` se da izpolniti (N = 5). -/
example : (5 : ℕ) ≠ 0 := by norm_num

/-- Predpostavke trditve `vsota_odklonov` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (5 : ℕ) ≠ 0 := by norm_num
  vsota_odklonov (hN := w)

/-- Razlaga 2 in ustno vprašanje 3: varianca je nenegativna (vsota kvadratov, deljena z N), σ = √σ² ≥ 0
in σ² = (√σ²)², torej koren vrne varianco.
trditev: MAT-SS-4/statistika#varianca-nenegativna
besedilo: »Kvadrati so vsi nenegativni, zato se ne izničijo« -/
theorem varianca_nenegativna (N : ℕ) (x : Fin N → ℝ) (m : ℝ) :
    0 ≤ (∑ i, (x i - m) ^ 2) / N ∧ 0 ≤ √((∑ i, (x i - m) ^ 2) / N) ∧
    (√((∑ i, (x i - m) ^ 2) / N)) ^ 2 = (∑ i, (x i - m) ^ 2) / N := by
  have h : 0 ≤ (∑ i, (x i - m) ^ 2) / N := by positivity
  exact ⟨h, Real.sqrt_nonneg _, Real.sq_sqrt h⟩

/-! ## Razlaga 3: kvartili, medkvartilni razmik, osamelci -/

/-- Razlaga 3: spodnja polovica 20, 30, 30, 40, 40 ima mediano Q₁ = 30, zgornja 40, 50, 60, 90, 400
mediano Q₃ = 60 (polovici skupaj sta ves niz).
trditev: MAT-SS-4/statistika#igrice-kvartili
besedilo: »Pri igricah je spodnja polovica $20, 30, 30, 40, 40$, torej $Q_1 = 30$; zgornja je $40, 50, 60, 90, 400$, torej $Q_3 = 60$.« -/
theorem igrice_kvartili : [20, 30, 30, 40, 40] ++ [40, 50, 60, 90, 400] = igrice ∧
    [20, 30, 30, 40, 40].getD 2 0 = 30 ∧ [40, 50, 60, 90, 400].getD 2 0 = 60 := by decide

/-- Razlaga 3: Q₃ − Q₁ = 30, 1,5·30 = 45, meja 60 + 45 = 105; 400 > 105 je osamelec (edini v nizu).
trditev: MAT-SS-4/statistika#igrice-osamelec
besedilo: »Igralec s $400$ minutami je osamelec.« -/
theorem igrice_osamelec : (60 : ℝ) - 30 = 30 ∧ (1.5 : ℝ) * 30 = 45 ∧ (60 : ℝ) + 45 = 105 ∧
    (105 : ℝ) < 400 ∧ igrice.filter (fun x => 105 < x) = [400] := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by decide⟩

/-! ## Razlaga 5: gostota normalne porazdelitve -/

/-- Razlaga 5: gostota normalne porazdelitve f(x) = 1/(σ√(2π))·e^(−(x−μ)²/(2σ²)). -/
noncomputable def f (μ σ x : ℝ) : ℝ := 1 / (σ * √(2 * π)) * Real.exp (-(x - μ) ^ 2 / (2 * σ ^ 2))

/-- Razlaga 5: predpis iz lekcije je Mathlibova gostota normalne porazdelitve z varianco σ² (σ > 0).
trditev: MAT-SS-4/statistika#f-je-gauss
besedilo: »Gostota je $$f(x) = \frac{1}{\sigma\sqrt{2\pi}}\, e^{-\frac{(x - \mu)^2}{2\sigma^2}}$$« -/
theorem f_je_gauss (μ σ : ℝ) (hσ : 0 < σ) :
    f μ σ = gaussianPDFReal μ (σ ^ 2).toNNReal := by
  funext x
  simp only [f, gaussianPDFReal, Real.coe_toNNReal _ (sq_nonneg σ)]
  congr 1
  rw [Real.sqrt_mul (by positivity) (σ ^ 2), Real.sqrt_sq hσ.le]
  field_simp

/-- Predpostavka σ > 0 (v `f_je_gauss`, `var_ne_zero`, `f_integrabilna`, `f_ploscina`, `f_pozitivna`,
`f_maksimum`) se da izpolniti (σ = 2). -/
example : (0 : ℝ) < 2 := by norm_num

/-- Predpostavke trditve `f_je_gauss` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 := by norm_num
  f_je_gauss (hσ := w)

/-- Pomožno: pri σ > 0 je varianca σ² različna od 0.
pomozno -/
theorem var_ne_zero (σ : ℝ) (hσ : 0 < σ) : (σ ^ 2).toNNReal ≠ 0 := by
  intro h
  rw [Real.toNNReal_eq_zero] at h
  nlinarith

/-- Pomožno: gostota je integrabilna.
pomozno -/
theorem f_integrabilna (μ σ : ℝ) (hσ : 0 < σ) : Integrable (f μ σ) := by
  rw [f_je_gauss μ σ hσ]; exact integrable_gaussianPDFReal _ _

/-- Razlaga 5: ploščina pod celo krivuljo je 1 (in Preveri se 1, pravilni odgovor).
trditev: MAT-SS-4/statistika#f-ploscina
besedilo: »ploščina pod celo krivuljo pa je $1$.« -/
theorem f_ploscina (μ σ : ℝ) (hσ : 0 < σ) : ∫ x, f μ σ x = 1 := by
  rw [f_je_gauss μ σ hσ]; exact integral_gaussianPDFReal_eq_one μ (var_ne_zero σ hσ)

/-- Predpostavke trditve `f_ploscina` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 := by norm_num
  f_ploscina (hσ := w)

/-- Preveri se 1: krivulja leži povsod nad osjo x (f > 0), zato je v μ ± 3σ ne seka.
trditev: MAT-SS-4/statistika#f-pozitivna
besedilo: »Krivulja leži povsod nad osjo $x$« -/
theorem f_pozitivna (μ σ x : ℝ) (hσ : 0 < σ) : 0 < f μ σ x := by
  unfold f; positivity

/-- Predpostavke trditve `f_pozitivna` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 := by norm_num
  f_pozitivna (hσ := w)

/-- Razlaga 5: krivulja je simetrična glede na x = μ: f(μ + t) = f(μ − t).
trditev: MAT-SS-4/statistika#f-simetricna
besedilo: »Krivulja je simetrična glede na $x = \mu$« -/
theorem f_simetricna (μ σ t : ℝ) : f μ σ (μ + t) = f μ σ (μ - t) := by
  unfold f; ring_nf

/-- Razlaga 5 (in Preveri se 1): maksimum je pri x = μ, kjer je f(μ) = 1/(σ√(2π)).
trditev: MAT-SS-4/statistika#f-maksimum
besedilo: »Krivulja je simetrična glede na $x = \mu$ in tam doseže maksimum.« -/
theorem f_maksimum (μ σ x : ℝ) (hσ : 0 < σ) : f μ σ x ≤ f μ σ μ ∧ f μ σ μ = 1 / (σ * √(2 * π)) := by
  constructor
  · unfold f
    apply mul_le_mul_of_nonneg_left _ (by positivity)
    apply Real.exp_le_exp.mpr
    have : 0 ≤ (x - μ) ^ 2 / (2 * σ ^ 2) := by positivity
    simp only [sub_self, ne_eq, OfNat.ofNat_ne_zero, not_false_eq_true, zero_pow, neg_zero, zero_div]
    rw [neg_div]; linarith
  · simp [f]

/-- Predpostavke trditve `f_maksimum` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 := by norm_num
  f_maksimum (hσ := w)

/-- Razlaga 5: večji σ da nižjo krivuljo: za 0 < σ₁ < σ₂ je f_σ₂(μ) < f_σ₁(μ).
trditev: MAT-SS-4/statistika#f-nizja
besedilo: »Večji $\sigma$ pomeni širšo krivuljo, a tudi nižjo.« -/
theorem f_nizja (μ σ₁ σ₂ : ℝ) (h1 : 0 < σ₁) (h12 : σ₁ < σ₂) : f μ σ₂ μ < f μ σ₁ μ := by
  rw [(f_maksimum μ σ₂ μ (by linarith)).2, (f_maksimum μ σ₁ μ h1).2]
  have hs : 0 < √(2 * π) := Real.sqrt_pos.mpr (by positivity)
  apply one_div_lt_one_div_of_lt (by positivity)
  exact mul_lt_mul_of_pos_right h12 hs

/-- Predpostavke trditve `f_nizja` se dajo izpolniti (σ₁ = 1, σ₂ = 3). -/
example : (0 : ℝ) < 1 ∧ (1 : ℝ) < 3 := by norm_num

/-- Predpostavke trditve `f_nizja` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 1 ∧ (1 : ℝ) < 3 := by norm_num
  f_nizja (h1 := w.1) (h12 := w.2)

/-- Razlaga 5: večji σ da širšo krivuljo: za 0 < σ₁ < σ₂ je dovolj daleč od μ (|x − μ| > R)
f_σ₂(x) > f_σ₁(x), repa krivulje s σ₂ sta višja.
trditev: MAT-SS-4/statistika#f-sirsa
besedilo: »Večji $\sigma$ pomeni širšo krivuljo,« -/
theorem f_sirsa (μ σ₁ σ₂ : ℝ) (h1 : 0 < σ₁) (h12 : σ₁ < σ₂) :
    ∃ R : ℝ, ∀ x, R < |x - μ| → f μ σ₁ x < f μ σ₂ x := by
  have h2 : 0 < σ₂ := by linarith
  set c := 1 / (2 * σ₁ ^ 2) - 1 / (2 * σ₂ ^ 2) with hc
  have hc0 : 0 < c := by
    have : 1 / (2 * σ₂ ^ 2) < 1 / (2 * σ₁ ^ 2) :=
      one_div_lt_one_div_of_lt (by positivity) (by nlinarith)
    linarith
  refine ⟨√(σ₂ / σ₁ / c), fun x hx => ?_⟩
  have hpos : 0 < |x - μ| := lt_of_le_of_lt (Real.sqrt_nonneg _) hx
  have ht : σ₂ / σ₁ / c < (x - μ) ^ 2 := by
    have := (Real.sqrt_lt' hpos).mp hx
    rwa [sq_abs] at this
  set t := (x - μ) ^ 2 with htdef
  have htc : σ₂ / σ₁ < t * c := by rwa [div_lt_iff₀ hc0] at ht
  have hexp : σ₂ / σ₁ < exp (t * c) := by linarith [Real.add_one_le_exp (t * c)]
  rw [div_lt_iff₀ h1] at hexp
  have key : exp (-t / (2 * σ₂ ^ 2)) = exp (-t / (2 * σ₁ ^ 2)) * exp (t * c) := by
    rw [← Real.exp_add]; congr 1; rw [hc]; field_simp; ring
  unfold f
  rw [← htdef, key]
  have hs : 0 < √(2 * π) := Real.sqrt_pos.mpr (by positivity)
  have hE : 0 < exp (-t / (2 * σ₁ ^ 2)) := Real.exp_pos _
  rw [div_mul_eq_mul_div, div_mul_eq_mul_div, one_mul, one_mul,
    div_lt_div_iff₀ (by positivity) (by positivity)]
  have := mul_lt_mul_of_pos_left hexp (mul_pos hE hs)
  nlinarith

/-- Predpostavke trditve `f_sirsa` se dajo izpolniti (σ₁ = 1, σ₂ = 3). -/
example : (0 : ℝ) < 1 ∧ (1 : ℝ) < 3 := by norm_num

/-! ## Razlaga 6: standardizacija in Φ -/

/-- Razlaga 6: standardna gostota (μ = 0, σ = 1). -/
noncomputable def φ (x : ℝ) : ℝ := f 0 1 x

/-- Razlaga 6: Φ(z) je ploščina pod standardno krivuljo od 0 do z. -/
noncomputable def Φ (z : ℝ) : ℝ := ∫ x in (0 : ℝ)..z, φ x

/-- Predpostavke trditve `f_sirsa` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 1 ∧ (1 : ℝ) < 3 := by norm_num
  f_sirsa (h1 := w.1) (h12 := w.2)

/-- Pomožno: standardna gostota je soda, φ(−x) = φ(x).
pomozno -/
theorem φ_soda (x : ℝ) : φ (-x) = φ x := by
  have := f_simetricna 0 1 (-x)
  simp only [zero_add, zero_sub, neg_neg] at this
  exact this

/-- Pomožno: standardna gostota je integrabilna.
pomozno -/
theorem φ_integrabilna : Integrable φ := f_integrabilna 0 1 one_pos

/-- Razlaga 6: Φ(−z) = −Φ(z).
trditev: MAT-SS-4/statistika#liha
besedilo: »Za negativne $z$ velja $\Phi(-z) = -\Phi(z)$.« -/
theorem Φ_liha (z : ℝ) : Φ (-z) = -Φ z := by
  unfold Φ
  have h := intervalIntegral.integral_comp_neg (a := 0) (b := -z) φ
  simp only [neg_neg, neg_zero, φ_soda] at h
  rw [h, intervalIntegral.integral_symm]

/-- Razlaga 6: polovica ploščine je levo od μ = 0: ∫_{(−∞, 0]} φ = 0,5.
trditev: MAT-SS-4/statistika#polovica
besedilo: »Ker je polovica ploščine na vsaki strani $\mu$« -/
theorem polovica : ∫ x in Iic 0, φ x = 1 / 2 := by
  have hI := intervalIntegral.integral_Iic_add_Ioi (f := φ) (b := 0) (μ := volume)
    φ_integrabilna.integrableOn φ_integrabilna.integrableOn
  have h1 : ∫ x, φ x = 1 := f_ploscina 0 1 one_pos
  have hs := integral_comp_neg_Iic 0 φ
  simp only [neg_zero, φ_soda] at hs
  rw [h1, ← hs] at hI
  linarith

/-- Razlaga 6 (Povzetek): P(Z < z) = 0,5 + Φ(z) za standardno normalno Z.
trditev: MAT-SS-4/statistika#p-manj
besedilo: »$P(X < x) = 0{,}5 + \Phi(z)$« -/
theorem P_manj (z : ℝ) : ∫ x in Iic z, φ x = 1 / 2 + Φ z := by
  have h := intervalIntegral.integral_Iic_sub_Iic (f := φ) (a := 0) (b := z) (μ := volume)
    φ_integrabilna.integrableOn φ_integrabilna.integrableOn
  rw [polovica] at h
  unfold Φ; linarith

/-- Razlaga 6 (Povzetek): P(Z > z) = 0,5 − Φ(z).
trditev: MAT-SS-4/statistika#p-vec
besedilo: »$P(X > x) = 0{,}5 - \Phi(z)$« -/
theorem P_vec (z : ℝ) : ∫ x in Ioi z, φ x = 1 / 2 - Φ z := by
  have hI := intervalIntegral.integral_Iic_add_Ioi (f := φ) (b := z) (μ := volume)
    φ_integrabilna.integrableOn φ_integrabilna.integrableOn
  have h1 : ∫ x, φ x = 1 := f_ploscina 0 1 one_pos
  rw [h1, P_manj] at hI
  linarith

/-- Primer 4 (formula): P(a < Z < b) = ∫ₐᵇ φ = Φ(b) − Φ(a).
trditev: MAT-SS-4/statistika#p-med
besedilo: »$P(a < X < b) = \Phi(z_b) - \Phi(z_a)$« -/
theorem P_med (a b : ℝ) : ∫ x in a..b, φ x = Φ b - Φ a := by
  unfold Φ
  exact (intervalIntegral.integral_interval_sub_left (a := 0) (b := b) (c := a)
    φ_integrabilna.intervalIntegrable φ_integrabilna.intervalIntegrable).symm

/-- Razlaga 6: z = (x − μ)/σ pove, koliko σ je x od μ: x = μ + kσ da z = k (σ ≠ 0).
trditev: MAT-SS-4/statistika#z-vrednost
besedilo: »ki pove, koliko standardnih odklonov je $x$ od $\mu$« -/
theorem z_vrednost (μ σ k : ℝ) (hσ : σ ≠ 0) : ((μ + k * σ) - μ) / σ = k := by
  field_simp; ring

/-- Predpostavka trditve `z_vrednost` se da izpolniti. -/
example : (2 : ℝ) ≠ 0 := by norm_num

/-- Predpostavke trditve `z_vrednost` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2 : ℝ) ≠ 0 := by norm_num
  z_vrednost (hσ := w)

/-- Drugače: Na sliki: 2,3 + 13,6 + 34,1 = 50 (polovica); 2·34,1 = 68,2 ≈ 68; 2(34,1 + 13,6) = 95,4 ≈ 95.
trditev: MAT-SS-4/statistika#pasovi
besedilo: »Med $\mu$ in $\mu + \sigma$ je $34{,}1\,\%$, med $\mu + \sigma$ in $\mu + 2\sigma$ še $13{,}6\,\%$, naprej le še $2{,}3\,\%$.« -/
theorem pasovi : (2.3 : ℝ) + 13.6 + 34.1 = 50 ∧ 2 * (34.1 : ℝ) = 68.2 ∧ 2 * ((34.1 : ℝ) + 13.6) = 95.4 := by
  norm_num

/-! ## Primer 1: obvestila -/

/-- Primer 1: 3 + 8 + 5 + 12 + 5 + 7 + 2 = 42, x̄ = 42 : 7 = 6; urejeno 2, 3, 5, 5, 7, 8, 12 (permutacija
podatkov), na 4. mestu je 5 = Me; edini ponovljeni podatek je 5 = Mo.
trditev: MAT-SS-4/statistika#primer1
besedilo: »Odgovor: sredina je $6$ obvestil, mediana in modus pa $5$.« -/
theorem primer1 : [3, 8, 5, 12, 5, 7, 2].sum = 42 ∧ (42 : ℝ) / 7 = 6 ∧
    List.Perm [3, 8, 5, 12, 5, 7, 2] [2, 3, 5, 5, 7, 8, 12] ∧ [2, 3, 5, 5, 7, 8, 12].Pairwise (· ≤ ·) ∧
    [2, 3, 5, 5, 7, 8, 12].getD 3 0 = 5 ∧
    (∀ x ∈ [3, 8, 5, 12, 5, 7, 2], [3, 8, 5, 12, 5, 7, 2].count x ≥ 2 → x = 5) ∧
    [3, 8, 5, 12, 5, 7, 2].count 5 = 2 := by
  refine ⟨by decide, by norm_num, by decide, by decide, by decide, by decide, by decide⟩

/-! ## Primer 2: baterije -/

/-- Primer 2, A: x̄ = 100 : 5 = 20; odkloni −2, 0, 2, −1, 1; kvadrati 4, 0, 4, 1, 1; vsota 10; σ² = 2.
trditev: MAT-SS-4/statistika#primer2-a
besedilo: »Vsota kvadratov je $10$, zato $\sigma_A^2 = 10 : 5 = 2$« -/
theorem primer2_A : ((18 : ℝ) + 20 + 22 + 19 + 21) = 100 ∧ (100 : ℝ) / 5 = 20 ∧
    ((18 : ℝ) - 20 = -2 ∧ (20 : ℝ) - 20 = 0 ∧ (22 : ℝ) - 20 = 2 ∧ (19 : ℝ) - 20 = -1 ∧ (21 : ℝ) - 20 = 1) ∧
    ((-2 : ℝ) ^ 2 = 4 ∧ (0 : ℝ) ^ 2 = 0 ∧ (2 : ℝ) ^ 2 = 4 ∧ (-1 : ℝ) ^ 2 = 1 ∧ (1 : ℝ) ^ 2 = 1) ∧
    (4 : ℝ) + 0 + 4 + 1 + 1 = 10 ∧ (10 : ℝ) / 5 = 2 := by norm_num

/-- Primer 2, A: σ_A = √2 ≈ 1,41 h.
trditev: MAT-SS-4/statistika#primer2-sigmaa
besedilo: »$\sigma_A = \sqrt{2} \approx 1{,}41\,\mathrm{h}$« -/
theorem primer2_sigmaA : |√(2 : ℝ) - 1.41| < 0.005 := by
  have h1 : (1.405 : ℝ) < √2 := (Real.lt_sqrt (by norm_num)).mpr (by norm_num)
  have h2 : √(2 : ℝ) < 1.415 := (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)
  rw [abs_lt]; constructor <;> linarith

/-- Primer 2, B: x̄ = 100 : 5 = 20; odkloni −6, 6, 0, −4, 4; kvadrati 36, 36, 0, 16, 16; vsota 104; σ² = 20,8.
trditev: MAT-SS-4/statistika#primer2-b
besedilo: »Za B so odkloni $-6, 6, 0, -4, 4$, kvadrati $36, 36, 0, 16, 16$, vsota $104$. Torej $\sigma_B^2 = 104 : 5 = 20{,}8$« -/
theorem primer2_B : ((14 : ℝ) + 26 + 20 + 16 + 24) = 100 ∧ (100 : ℝ) / 5 = 20 ∧
    ((14 : ℝ) - 20 = -6 ∧ (26 : ℝ) - 20 = 6 ∧ (20 : ℝ) - 20 = 0 ∧ (16 : ℝ) - 20 = -4 ∧ (24 : ℝ) - 20 = 4) ∧
    ((-6 : ℝ) ^ 2 = 36 ∧ (6 : ℝ) ^ 2 = 36 ∧ (0 : ℝ) ^ 2 = 0 ∧ (-4 : ℝ) ^ 2 = 16 ∧ (4 : ℝ) ^ 2 = 16) ∧
    (36 : ℝ) + 36 + 0 + 16 + 16 = 104 ∧ (104 : ℝ) / 5 = 20.8 := by norm_num

/-- Primer 2, B in odgovor: σ_B = √20,8 ≈ 4,56 h in σ_B > 3σ_A (»več kot trikrat manjši«).
trditev: MAT-SS-4/statistika#primer2-sigmab
besedilo: »Torej $\sigma_B^2 = 104 : 5 = 20{,}8$ in $\sigma_B \approx 4{,}56\,\mathrm{h}$.« -/
theorem primer2_sigmaB : |√(20.8 : ℝ) - 4.56| < 0.005 ∧ 3 * √(2 : ℝ) < √20.8 := by
  have h1 : (4.555 : ℝ) < √20.8 := (Real.lt_sqrt (by norm_num)).mpr (by norm_num)
  have h2 : √(20.8 : ℝ) < 4.565 := (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)
  have h3 : √(2 : ℝ) < 1.415 := (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)
  refine ⟨?_, by linarith⟩
  rw [abs_lt]; constructor <;> linarith

/-- Razlaga 2: variacijski razmik A je 22 − 18 = 4, B pa 26 − 14 = 12.
pomozno -/
theorem razmik : (22 : ℝ) - 18 = 4 ∧ (26 : ℝ) - 14 = 12 := by norm_num

/-! ## Primer 3 in 4: normalna porazdelitev (s tabelnimi vrednostmi iz lekcije) -/

/-- Primer 3: z = (23 − 20)/2 = 1,5; P = 0,5 − 0,4332 = 0,0668; 0,0668·5000 = 334 (6,68 % ≈ 6,7 %).
trditev: MAT-SS-4/statistika#primer3
besedilo: »Odgovor: približno $334$ telefonov ($6{,}7\,\%$) zdrži več kot $23$ ur.« -/
theorem primer3 : ((23 : ℝ) - 20) / 2 = 1.5 ∧ (0.5 : ℝ) - 0.4332 = 0.0668 ∧ (0.0668 : ℝ) * 5000 = 334 ∧
    |(0.0668 : ℝ) * 100 - 6.7| < 0.05 := by norm_num [abs_lt]

/-- Primer 4: z_a = (18 − 20)/2 = −1, z_b = (24 − 20)/2 = 2; Φ(2) − Φ(−1) = 0,4772 + 0,3413 = 0,8185 ≈ 82 %.
trditev: MAT-SS-4/statistika#primer4
besedilo: »$\Phi(2) - \Phi(-1) = 0{,}4772 + 0{,}3413 = 0{,}8185$, torej približno $82\,\%$ baterij.« -/
theorem primer4 : ((18 : ℝ) - 20) / 2 = -1 ∧ ((24 : ℝ) - 20) / 2 = 2 ∧
    (0.4772 : ℝ) - (-0.3413) = 0.4772 + 0.3413 ∧ (0.4772 : ℝ) + 0.3413 = 0.8185 ∧
    |(0.8185 : ℝ) * 100 - 82| < 0.5 := by norm_num [abs_lt]

/-- Primer 4: Φ(2) − Φ(−1) = Φ(2) + Φ(1) (iz Φ(−z) = −Φ(z)).
trditev: MAT-SS-4/statistika#primer4-2
besedilo: »$\Phi(2) - \Phi(-1) = 0{,}4772 + 0{,}3413 = 0{,}8185$« -/
theorem primer4_Φ : Φ 2 - Φ (-1) = Φ 2 + Φ 1 := by rw [Φ_liha]; ring

/-! ## Pogoste napake -/

/-- Pogoste napake: iz σ² = 4 in σ > 0 sledi σ = 2 (√4 = 2).
trditev: MAT-SS-4/statistika#sigma-iz-variance
besedilo: »Če je dana varianca $\sigma^2 = 4$, je $\sigma = 2$.« -/
theorem sigma_iz_variance (σ : ℝ) : (σ ^ 2 = 4 ∧ 0 < σ) ↔ σ = 2 := by
  constructor
  · rintro ⟨h, hσ⟩; nlinarith [sq_nonneg (σ - 2), sq_nonneg (σ + 2)]
  · rintro rfl; norm_num

/-! ## Za maturo -/

/-- Matura 1: urejeno 8, 10, 12, 15, 16, 18, 20, 25, 30, 50 (permutacija podatkov); spodnja polovica
8, 10, 12, 15, 16 da Q₁ = 12, zgornja 18, 20, 25, 30, 50 da Q₃ = 25.
trditev: MAT-SS-4/statistika#matura1-kvartili
besedilo: »Prvi kvartil je mediana spodnje polovice, $Q_1 = 12$; tretji kvartil je mediana zgornje polovice, $Q_3 = 25$.« -/
theorem matura1_kvartili : List.Perm [15, 30, 8, 20, 12, 50, 16, 25, 10, 18] [8, 10, 12, 15, 16, 18, 20, 25, 30, 50] ∧
    [8, 10, 12, 15, 16, 18, 20, 25, 30, 50].Pairwise (· ≤ ·) ∧
    [8, 10, 12, 15, 16] ++ [18, 20, 25, 30, 50] = [8, 10, 12, 15, 16, 18, 20, 25, 30, 50] ∧
    [8, 10, 12, 15, 16].getD 2 0 = 12 ∧ [18, 20, 25, 30, 50].getD 2 0 = 25 := by decide

/-- Matura 1: Q₃ − Q₁ = 25 − 12 = 13; meja 25 + 1,5·13 = 25 + 19,5 = 44,5; 50 > 44,5, zato je 50 osamelec.
trditev: MAT-SS-4/statistika#matura1
besedilo: »Odgovor: medkvartilni razmik je $13$ minut. Ker je $50 > 44{,}5$, je podatek $50$ osamelec.« -/
theorem matura1 : (25 : ℝ) - 12 = 13 ∧ (25 : ℝ) + 1.5 * 13 = 25 + 19.5 ∧ (25 : ℝ) + 19.5 = 44.5 ∧
    (44.5 : ℝ) < 50 := by norm_num

/-- Matura 2 a): x̄ = 1080/6 = 180; odkloni −6, 6, −9, 9, 3, −3; kvadrati 36, 36, 81, 81, 9, 9; vsota 252;
varianca 252 : 6 = 42.
trditev: MAT-SS-4/statistika#matura2a
besedilo: »a) Varianca šestih mas je $252 : 6 = 42$« -/
theorem matura2a : (174 : ℝ) + 186 + 171 + 189 + 183 + 177 = 1080 ∧ (1080 : ℝ) / 6 = 180 ∧
    ((174 : ℝ) - 180 = -6 ∧ (186 : ℝ) - 180 = 6 ∧ (171 : ℝ) - 180 = -9 ∧ (189 : ℝ) - 180 = 9 ∧
      (183 : ℝ) - 180 = 3 ∧ (177 : ℝ) - 180 = -3) ∧
    ((-6 : ℝ) ^ 2 = 36 ∧ (6 : ℝ) ^ 2 = 36 ∧ (-9 : ℝ) ^ 2 = 81 ∧ (9 : ℝ) ^ 2 = 81 ∧ (3 : ℝ) ^ 2 = 9 ∧
      (-3 : ℝ) ^ 2 = 9) ∧
    (36 : ℝ) + 36 + 81 + 81 + 9 + 9 = 252 ∧ (252 : ℝ) / 6 = 42 := by norm_num

/-- Matura 2 a): σ = √42 = 6,4807… ≈ 6,48 g; točkovanje: z N − 1 bi bilo √(252/5) ≈ 7,10 g.
trditev: MAT-SS-4/statistika#matura2a-sigma
besedilo: »njihov standardni odklon pa $\sqrt{42} = 6{,}4807\ldots \approx 6{,}48\,\mathrm{g}$« -/
theorem matura2a_sigma : |√(42 : ℝ) - 6.4807| < 0.0001 ∧ |√(42 : ℝ) - 6.48| < 0.005 ∧
    |√((252 : ℝ) / 5) - 7.10| < 0.005 := by
  have h1 : (6.4806 : ℝ) < √42 := (Real.lt_sqrt (by norm_num)).mpr (by norm_num)
  have h2 : √(42 : ℝ) < 6.4808 := (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)
  have h3 : (7.095 : ℝ) < √((252 : ℝ) / 5) := (Real.lt_sqrt (by norm_num)).mpr (by norm_num)
  have h4 : √((252 : ℝ) / 5) < 7.105 := (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)
  refine ⟨?_, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Matura 2 b): z = (170 − 180)/8 = −1,25; P(X < 170) = 0,5 + Φ(−1,25) = 0,5 − 0,3944 = 0,1056 = 10,56 %.
trditev: MAT-SS-4/statistika#matura2b
besedilo: »b) $P(X < 170) = 0{,}5 + \Phi(-1{,}25) = 0{,}5 - 0{,}3944 = 0{,}1056$, torej $10{,}56\,\%$.« -/
theorem matura2b : ((170 : ℝ) - 180) / 8 = -1.25 ∧ (0.5 : ℝ) + (-0.3944) = 0.5 - 0.3944 ∧
    (0.5 : ℝ) - 0.3944 = 0.1056 ∧ (0.1056 : ℝ) * 100 = 10.56 := by norm_num

/-- Matura 2 c): z₁ = (176 − 180)/8 = −0,5, z₂ = (194 − 180)/8 = 1,75; 0,4599 + 0,1915 = 0,6514;
0,6514·2000 = 1302,8 ≈ 1303.
trditev: MAT-SS-4/statistika#matura2c
besedilo: »$0{,}6514 \cdot 2000 = 1302{,}8 \approx 1303$« -/
theorem matura2c : ((176 : ℝ) - 180) / 8 = -0.5 ∧ ((194 : ℝ) - 180) / 8 = 1.75 ∧
    (0.4599 : ℝ) + 0.1915 = 0.6514 ∧ (0.6514 : ℝ) * 2000 = 1302.8 ∧ |(1302.8 : ℝ) - 1303| < 0.5 := by
  norm_num [abs_lt]

/-! ## Preveri se -/

/-- Preveri se 2: 9, 4, 13, 7, 7 urejeno je 4, 7, 7, 9, 13, mediana (3. mesto) je 7; sredina 40 : 5 = 8;
srednji podatek neurejenega niza je 13.
trditev: MAT-SS-4/statistika#kviz2
besedilo: »Urejeno: $4, 7, 7, 9, 13$; na srednjem, 3. mestu je $7$.« -/
theorem kviz2 : List.Perm [9, 4, 13, 7, 7] [4, 7, 7, 9, 13] ∧ [4, 7, 7, 9, 13].Pairwise (· ≤ ·) ∧
    [4, 7, 7, 9, 13].getD 2 0 = 7 ∧ [9, 4, 13, 7, 7].sum = 40 ∧ (40 : ℝ) / 5 = 8 ∧
    [9, 4, 13, 7, 7].getD 2 0 = 13 := by
  refine ⟨by decide, by decide, by decide, by decide, by norm_num, by decide⟩

/-- Preveri se 3: z = (23 − 20)/2 = 1,5 (deli s σ = 2, ne s σ² = 4); 0,5 + 0,4332 = 0,9332 = 93,32 %;
0,5 − 0,4332 = 0,0668 = 6,68 % (napačni odgovor za »več«).
trditev: MAT-SS-4/statistika#kviz3
besedilo: »Vse baterije pod sredino ($50\,\%$) tudi zdržijo manj kot $23\,\mathrm{h}$: $0{,}5 + 0{,}4332 = 0{,}9332 = 93{,}32\,\%$.« -/
theorem kviz3 : ((23 : ℝ) - 20) / 2 = 1.5 ∧ (0.5 : ℝ) + 0.4332 = 0.9332 ∧ (0.9332 : ℝ) * 100 = 93.32 ∧
    (0.5 : ℝ) - 0.4332 = 0.0668 := by norm_num

/-- Preveri se 4: meja 23 je pri A (σ = 1) z = 3, pri B (σ = 3) z = 1; pri B P = 0,5 − 0,3413 ≈ 16 %.
trditev: MAT-SS-4/statistika#kviz4
besedilo: »Pri B je $z = 1$, $P = 0{,}5 - 0{,}3413 \approx 16\,\%$; pri A je $z = 3$, $P \approx 0{,}13\,\%$.« -/
theorem kviz4 : ((23 : ℝ) - 20) / 1 = 3 ∧ ((23 : ℝ) - 20) / 3 = 1 ∧ (0.5 : ℝ) - 0.3413 = 0.1587 ∧
    |(0.1587 : ℝ) * 100 - 16| < 0.5 := by norm_num [abs_lt]

/-- Preveri se 4 (brez tabele): ker je Φ naraščajoča (φ > 0), je P(Z > 3) < P(Z > 1), torej je verjetnost
pri B večja kot pri A.
trditev: MAT-SS-4/statistika#kviz4-primerjava
besedilo: »Pri B je $z = 1$, $P = 0{,}5 - 0{,}3413 \approx 16\,\%$; pri A je $z = 3$, $P \approx 0{,}13\,\%$.« -/
theorem kviz4_primerjava : ∫ x in Ioi 3, φ x < ∫ x in Ioi 1, φ x := by
  rw [P_vec, P_vec]
  have h : 0 < ∫ x in (1 : ℝ)..3, φ x :=
    intervalIntegral.intervalIntegral_pos_of_pos_on φ_integrabilna.intervalIntegrable
      (fun x _ => f_pozitivna 0 1 x one_pos) (by norm_num)
  rw [P_med] at h
  linarith

/-! ## Primeri izpolnljivosti (izrek, uporabljen na konkretnih vrednostih) -/

/-- Predpostavke trditve `igrice_modus` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  igrice_modus.2 20 (by decide) (by decide)

end Evklid.Lekcije.MAT_SS_4.Statistika
