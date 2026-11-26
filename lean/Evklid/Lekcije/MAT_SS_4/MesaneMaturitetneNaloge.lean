/-
vir: content/lessons/MAT-SS-4/mesane-maturitetne-naloge.md
sha256: 35f5676aaa05819c9e148eecb61dff0362e461fd65c89c66e1e0df74778408cf
Ni v Leanu: seznam »ključna beseda → orodje«, štirje splošni koraki, analogija s trenerjem in postopki
(napotki za reševanje, ne matematične trditve); simulacija; trditvi »vsak par je nova priložnost« in
»ljudje štejemo osebe, verjetnost pa šteje pare« (razlaga); premisli o kolesarju (izbira orodja); zapis
zaporednih metov oziroma žarnic kot dogodkov v verjetnostnem prostoru (zahtevno, še ni dokazano: meti,
žarnice, rojstni dnevi so dokazani kot računi s formulami lekcije; pri nalogi 3 d je dokazana vsota, ne
nezdružljivost dogodkov); pogosta napaka o integralu negativne hitrosti (ni konkretne funkcije); kviza o naklonu in o
vrstnem redu korakov razen računov; točkovanje. Približki »≈« so dokazani kot |vrednost − približek| ≤ pol
enote zadnjega mesta, zapisi »0,664832…« kot spodnja in zgornja meja na zapisano število decimalk.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.MesaneMaturitetneNaloge

open Set Finset MeasureTheory ProbabilityTheory intervalIntegral

/-! ## Pomožne trditve -/

/-- Pomožna trditev: približek »≈ v« dokažemo z mejama `v − e ≤ x ≤ v + e`.
pomozno -/
theorem blizu {x v e : ℝ} (h1 : v - e ≤ x) (h2 : x ≤ v + e) : |x - v| ≤ e :=
  abs_le.mpr ⟨by linarith, by linarith⟩

/-- Pomožna trditev (Newton-Leibnizova formula): če je `F' = f` povsod in je `f` zvezna, je
`∫ₐᵇ f = F(b) − F(a)`.
pomozno -/
theorem newton_leibniz (F f : ℝ → ℝ) (a b : ℝ) (hF : ∀ x, HasDerivAt F (f x) x) (hf : Continuous f) :
    ∫ x in a..b, f x = F b - F a :=
  integral_eq_sub_of_hasDerivAt (fun x _ => hF x) (hf.intervalIntegrable a b)

/-- Pomožna trditev: meje za `ln(1 − x)` iz vrste `−(x + x²/2 + … + xⁿ/n)` z oceno ostanka
`|x|ⁿ⁺¹/(1 − |x|)`.
pomozno -/
theorem log_meje (x : ℝ) (n : ℕ) (hx : |x| < 1) (lo hi : ℝ)
    (h1 : lo ≤ -(∑ i ∈ range n, x ^ (i + 1) / (i + 1)) - |x| ^ (n + 1) / (1 - |x|))
    (h2 : -(∑ i ∈ range n, x ^ (i + 1) / (i + 1)) + |x| ^ (n + 1) / (1 - |x|) ≤ hi) :
    lo ≤ Real.log (1 - x) ∧ Real.log (1 - x) ≤ hi := by
  have := Real.abs_log_sub_add_sum_range_le hx n
  rw [abs_le] at this
  constructor <;> linarith [this.1, this.2]

/-- Predpostavke trditve `blizu` se dajo izpolniti. -/
example : (1:ℝ) - 0.5 ≤ 1 ∧ (1:ℝ) ≤ 1 + 0.5 := by norm_num

/-- Predpostavke trditve `newton_leibniz` se dajo izpolniti (`F(x) = x`, `f = 1`). -/
example : (∀ x : ℝ, HasDerivAt (fun x : ℝ => x) 1 x) ∧ Continuous (fun _ : ℝ => (1:ℝ)) :=
  ⟨fun x => hasDerivAt_id' x, continuous_const⟩

/-- Predpostavke trditve `log_meje` se dajo izpolniti (`x = 0`, `n = 1`, `lo = hi = 0`). -/
example : |(0:ℝ)| < 1 ∧
    (0:ℝ) ≤ -(∑ i ∈ Finset.range 1, (0:ℝ) ^ (i + 1) / (i + 1)) - |(0:ℝ)| ^ (1 + 1) / (1 - |(0:ℝ)|) ∧
    -(∑ i ∈ Finset.range 1, (0:ℝ) ^ (i + 1) / (i + 1)) + |(0:ℝ)| ^ (1 + 1) / (1 - |(0:ℝ)|) ≤ 0 := by
  norm_num

/-! ## Razlaga: paradoks rojstnih dni -/

/-- Verjetnost, da ima `n` ljudi različne rojstne dneve: `365/365 · 364/365 · … · (365 − n + 1)/365`. -/
noncomputable def razlicni (n : ℕ) : ℝ := ∏ i ∈ range n, ((365:ℝ) - i) / 365

/-- Razlaga, korak 3 in »Bolj natančno«: produkt ulomkov je isti račun kot `Vₙᵏ/nᵏ`
(`∏ (n − i)/n = Vₙᵏ / nᵏ` za `k ≤ n`).
trditev: MAT-SS-4/mesane-maturitetne-naloge#produkt-variacije
besedilo: »Račun.** Produkt ulomkov je isti račun kot $\frac{V_{365}^{23}}{365^{23}}$,« -/
theorem produkt_variacije (n k : ℕ) (hn : n ≠ 0) (hk : k ≤ n) :
    ∏ i ∈ range k, ((n:ℝ) - i) / n = (n.descFactorial k : ℝ) / (n:ℝ) ^ k := by
  induction k with
  | zero => simp
  | succ k ih =>
    rw [prod_range_succ, ih (by omega), Nat.descFactorial_succ, Nat.cast_mul,
      Nat.cast_sub (by omega), pow_succ]
    have : (n:ℝ) ≠ 0 := Nat.cast_ne_zero.mpr hn
    field_simp

/-- Predpostavke trditve `produkt_variacije` se dajo izpolniti (`n = 365`, `k = 23`). -/
example : (365:ℕ) ≠ 0 ∧ 23 ≤ 365 := by norm_num

/-- Predpostavke trditve `produkt_variacije` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (365:ℕ) ≠ 0 ∧ 23 ≤ 365 := by norm_num
  produkt_variacije (hn := w.1) (hk := w.2)

/-- Ponovitev: `Vₙᵏ = n!/(n − k)!` za `k ≤ n`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#variacije
besedilo: »$V_n^k = \frac{n!}{(n-k)!}$« -/
theorem variacije (n k : ℕ) (hk : k ≤ n) : n.descFactorial k = n.factorial / (n - k).factorial :=
  Nat.descFactorial_eq_div hk

/-- Predpostavka trditve `variacije` se da izpolniti. -/
example : 2 ≤ 10 := by norm_num

/-- Predpostavke trditve `variacije` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : 2 ≤ 10 := by norm_num
  variacije (hk := w)

/-- Razlaga: produkt `23` ulomkov je približno `0,493`, zato je `P(vsaj dva isti dan) ≈ 1 − 0,493 = 0,507`;
parov je `C(23, 2) = 253`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#rojstni-dnevi
besedilo: »$$P(\text{vsaj dva isti dan}) \approx 1 - 0{,}493 = 0{,}507$$« -/
theorem rojstni_dnevi :
    |razlicni 23 - 0.493| ≤ 0.0005 ∧ (1:ℝ) - 0.493 = 0.507 ∧ |1 - razlicni 23 - 0.507| ≤ 0.0005 ∧
      Nat.choose 23 2 = 253 := by
  have e : razlicni 23 = ∏ i ∈ range 23, ((365:ℝ) - i) / 365 := rfl
  simp only [prod_range_succ, prod_range_zero] at e
  norm_num at e
  refine ⟨blizu (by rw [e]; norm_num) (by rw [e]; norm_num), by norm_num,
    blizu (by rw [e]; norm_num) (by rw [e]; norm_num), by decide⟩

/-- Razlaga, premisli: pri `24` ljudeh je verjetnost približno `54 %`; novi človek prinese `23` novih
parov, kar je dobrih `9 %` od `253`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#rojstni-dnevi-24
besedilo: »Poveča se, a za malo (na približno $54\,\%$). Novi človek prinese $23$ novih parov, kar je le dobrih $9\,\%$ več parov kot prej ($253$).« -/
theorem rojstni_dnevi_24 :
    |1 - razlicni 24 - 0.54| ≤ 0.005 ∧ Nat.choose 24 2 = 253 + 23 ∧
      (0.09:ℝ) < 23 / 253 ∧ (23:ℝ) / 253 < 0.1 := by
  have e : razlicni 24 = ∏ i ∈ range 24, ((365:ℝ) - i) / 365 := rfl
  simp only [prod_range_succ, prod_range_zero] at e
  norm_num at e
  exact ⟨blizu (by rw [e]; norm_num) (by rw [e]; norm_num), by decide, by norm_num, by norm_num⟩

/-- Drugače, bolj natančno: preglednica `P(vsaj dva isti dan)` za `n = 10, 30, 50` je `0,117`, `0,706`,
`0,970`; pričakovano število parov z istim dnem pri `23` ljudeh je `253/365 ≈ 0,69`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#rojstni-dnevi-tabela
besedilo: »Pri $23$ ljudeh je pričakovano število parov z istim dnem $\frac{253}{365} \approx 0{,}69$,« -/
theorem rojstni_dnevi_tabela :
    |1 - razlicni 10 - 0.117| ≤ 0.0005 ∧ |1 - razlicni 30 - 0.706| ≤ 0.0005 ∧
      |1 - razlicni 50 - 0.970| ≤ 0.0005 ∧ |(253:ℝ) / 365 - 0.69| ≤ 0.005 := by
  have e1 : razlicni 10 = ∏ i ∈ range 10, ((365:ℝ) - i) / 365 := rfl
  have e2 : razlicni 30 = ∏ i ∈ range 30, ((365:ℝ) - i) / 365 := rfl
  have e3 : razlicni 50 = ∏ i ∈ range 50, ((365:ℝ) - i) / 365 := rfl
  simp only [prod_range_succ, prod_range_zero] at e1 e2 e3
  norm_num at e1 e2 e3
  exact ⟨blizu (by rw [e1]; norm_num) (by rw [e1]; norm_num),
    blizu (by rw [e2]; norm_num) (by rw [e2]; norm_num),
    blizu (by rw [e3]; norm_num) (by rw [e3]; norm_num), blizu (by norm_num) (by norm_num)⟩

/-- Drugače, bolj natančno: število parov je `C(n, 2) = n(n − 1)/2`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#pari
besedilo: »Razlog je število parov $\binom{n}{2} = \frac{n(n-1)}{2}$,« -/
theorem pari (n : ℕ) : Nat.choose n 2 = n * (n - 1) / 2 := Nat.choose_two_right n

/-! ## Formule: nasprotni dogodek in neodvisnost -/

/-- Ključna beseda »vsaj« in ponovitev: `P(A) = 1 − P(Ā)` (za merljiv dogodek v verjetnostnem prostoru).
trditev: MAT-SS-4/mesane-maturitetne-naloge#nasprotni-dogodek
besedilo: »Ključna beseda.** »Vsaj« je skoraj vedno znak za nasprotni dogodek: $P(A) = 1 - P(\overline{A})$.« -/
theorem nasprotni_dogodek {Ω : Type*} [MeasurableSpace Ω] (μ : Measure Ω) [IsProbabilityMeasure μ]
    (A : Set Ω) (hA : MeasurableSet A) : μ A = 1 - μ Aᶜ := by
  rw [prob_compl_eq_one_sub hA, ENNReal.sub_sub_cancel ENNReal.one_ne_top prob_le_one]

/-- Predpostavke trditve `nasprotni_dogodek` se dajo izpolniti (Diracova mera na `Bool`). -/
example : IsProbabilityMeasure (Measure.dirac true : Measure Bool) ∧ MeasurableSet ({true} : Set Bool) :=
  ⟨inferInstance, measurableSet_singleton true⟩

/-- Primer 1, formula in ustno vprašanje 1: neodvisna dogodka imata `P(A·B) = P(A)·P(B)`; enakost je
tudi definicija neodvisnosti.
trditev: MAT-SS-4/mesane-maturitetne-naloge#neodvisna
besedilo: »pri neodvisnih dogodkih $P(A \cdot B) = P(A) \cdot P(B)$« -/
theorem neodvisna {Ω : Type*} [MeasurableSpace Ω] (μ : Measure Ω) [IsProbabilityMeasure μ]
    (A B : Set Ω) (hA : MeasurableSet A) (hB : MeasurableSet B) :
    IndepSet A B μ ↔ μ (A ∩ B) = μ A * μ B :=
  indepSet_iff_measure_inter_eq_mul hA hB μ

/-- Predpostavke trditve `neodvisna` se dajo izpolniti. -/
example : IsProbabilityMeasure (Measure.dirac true : Measure Bool) ∧ MeasurableSet (Set.univ : Set Bool) :=
  ⟨inferInstance, MeasurableSet.univ⟩

/-- Predpostavke trditve `neodvisna` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : IsProbabilityMeasure (Measure.dirac true : Measure Bool) ∧ MeasurableSet (Set.univ : Set Bool) :=
    ⟨inferInstance, MeasurableSet.univ⟩
  neodvisna (hA := w.1) (hB := w.2)

/-- Ustno vprašanje 1: dva meta kovanca, verjetnost dveh grbov je `1/2 · 1/2 = 1/4`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#kovanec
besedilo: »Primer sta dva meta kovanca: verjetnost, da obakrat pade grb, je $\frac{1}{2} \cdot \frac{1}{2} = \frac{1}{4}$.« -/
theorem kovanec : (1:ℝ) / 2 * (1 / 2) = 1 / 4 := by norm_num

/-! ## Primer 1: trije prosti meti -/

/-- Primer 1, koraka 2 in 3: `0,8 · 0,8 · 0,8 = 0,512` in `1 − 0,512 = 0,488`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#primer1
besedilo: »$P(\text{vsaj en zgrešen}) = 1 - 0{,}512 = 0{,}488$« -/
theorem primer1 : (0.8:ℝ) * 0.8 * 0.8 = 0.512 ∧ (1:ℝ) - 0.512 = 0.488 := by norm_num

/-- Pogoste napake: vsota `0,2 + 0,2 + 0,2 = 0,6` ni `0,488`; pri štirih metih z `0,3` bi vsota dala
`1,2 > 1`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#napaka-vsota
besedilo: »Pri štirih metih z verjetnostjo zgrešitve $0{,}3$ bi dobil celo več kot $1$.« -/
theorem napaka_vsota : (0.2:ℝ) + 0.2 + 0.2 = 0.6 ∧ (0.6:ℝ) ≠ 0.488 ∧ 4 * (0.3:ℝ) = 1.2 ∧ (1.2:ℝ) > 1 := by
  norm_num

/-! ## Primer 2: let žoge -/

/-- Višina žoge iz primera 2. -/
noncomputable def h₂ (t : ℝ) : ℝ := -5 * t ^ 2 + 10 * t + 1

/-- Primer 2, korak 1: `h'(t) = −10t + 10`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#primer2-odvod
besedilo: »$h'(t) = -10t + 10$« -/
theorem primer2_odvod (t : ℝ) : HasDerivAt h₂ (-10 * t + 10) t := by
  unfold h₂
  exact ((((hasDerivAt_pow 2 t).const_mul (-5)).add ((hasDerivAt_id' t).const_mul 10)).add_const 1)
    |>.congr_deriv (by norm_num; ring)

/-- Primer 2, koraka 2 in 3: `−10t + 10 = 0` natanko pri `t = 1`; višina vrha je
`−5·1² + 10·1 + 1 = 6` in je največja (`h(t) ≤ 6` za vsak `t`).
trditev: MAT-SS-4/mesane-maturitetne-naloge#primer2-vrh
besedilo: »Višino dobimo z vstavljanjem v $h$, ne v $h'$: $-5 \cdot 1^2 + 10 \cdot 1 + 1 = 6$, torej $6\,\mathrm{m}$.« -/
theorem primer2_vrh :
    (∀ t : ℝ, -10 * t + 10 = 0 ↔ t = 1) ∧ h₂ 1 = -5 * 1 ^ 2 + 10 * 1 + 1 ∧
      (-5:ℝ) * 1 ^ 2 + 10 * 1 + 1 = 6 ∧ ∀ t, h₂ t ≤ 6 := by
  refine ⟨fun t => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, rfl, by norm_num,
    fun t => ?_⟩
  unfold h₂
  nlinarith [sq_nonneg (t - 1)]

/-- Formula iz primera 2 v splošni obliki: za `a ≠ 0` in `D = b² − 4ac ≥ 0` je `ax² + bx + c = 0`
natanko pri `x = (−b ± √D)/(2a)`; pri `D < 0` realne rešitve ni.
trditev: MAT-SS-4/mesane-maturitetne-naloge#kvadratna-formula
besedilo: »vrh: $h'(t) = 0$; padec: $h(t) = 0$, rešitev kvadratne enačbe $t = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$« -/
theorem kvadratna_formula (a b c : ℝ) (ha : a ≠ 0) :
    discrim a b c = b ^ 2 - 4 * a * c ∧
    (0 ≤ b ^ 2 - 4 * a * c → ∀ x : ℝ, a * x ^ 2 + b * x + c = 0 ↔
      x = (-b + Real.sqrt (b ^ 2 - 4 * a * c)) / (2 * a) ∨
        x = (-b - Real.sqrt (b ^ 2 - 4 * a * c)) / (2 * a)) ∧
    (b ^ 2 - 4 * a * c < 0 → ∀ x : ℝ, a * x ^ 2 + b * x + c ≠ 0) := by
  refine ⟨rfl, fun hD x => ?_, fun hD x => ?_⟩
  · have h : discrim a b c = Real.sqrt (b ^ 2 - 4 * a * c) * Real.sqrt (b ^ 2 - 4 * a * c) := by
      rw [Real.mul_self_sqrt hD, discrim]
    rw [← quadratic_eq_zero_iff ha h x, show a * x ^ 2 = a * (x * x) by ring]
  · rw [show a * x ^ 2 = a * (x * x) by ring]
    exact quadratic_ne_zero_of_discrim_ne_sq (fun s hs => by
      rw [discrim] at hs; nlinarith [sq_nonneg s]) x

/-- Predpostavka trditve `kvadratna_formula` se da izpolniti (`a = 5` iz primera 2). -/
example : (5:ℝ) ≠ 0 := by norm_num

/-- Predpostavke trditve `kvadratna_formula` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (5:ℝ) ≠ 0 := by norm_num
  kvadratna_formula (ha := w)

/-- Primer 2, koraki 4 in 5: `−5t² + 10t + 1 = 0` ⇔ `5t² − 10t − 1 = 0` ⇔ `t = (10 ± √120)/10`,
diskriminanta `D = 100 + 20 = 120`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#primer2-tla
besedilo: »Diskriminanta: $D = 100 + 20 = 120$, torej $t = \dfrac{10 \pm \sqrt{120}}{10}$.« -/
theorem primer2_tla (t : ℝ) :
    (h₂ t = 0 ↔ 5 * t ^ 2 - 10 * t - 1 = 0) ∧ ((-10:ℝ) ^ 2 - 4 * 5 * (-1) = 100 + 20) ∧
      (100:ℝ) + 20 = 120 ∧
      (h₂ t = 0 ↔ t = (10 + Real.sqrt 120) / 10 ∨ t = (10 - Real.sqrt 120) / 10) := by
  have hs : Real.sqrt 120 ^ 2 = 120 := Real.sq_sqrt (by norm_num)
  refine ⟨by unfold h₂; constructor <;> intro h <;> linarith, by norm_num, by norm_num, ?_⟩
  have e : h₂ t = -5 * ((t - (10 + Real.sqrt 120) / 10) * (t - (10 - Real.sqrt 120) / 10)) := by
    unfold h₂; nlinarith [hs]
  rw [e]
  constructor
  · intro h
    have : (t - (10 + Real.sqrt 120) / 10) * (t - (10 - Real.sqrt 120) / 10) = 0 := by linarith
    rcases mul_eq_zero.mp this with h1 | h1
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> ring

/-- Primer 2, koraka 6 in 7: negativna rešitev `(10 − √120)/10 < 0` ni smiselna, pozitivna je
`(10 + √120)/10 ≈ 2,10`, torej na tla pade po približno `2,1 s`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#primer2-cas
besedilo: »na tla pade po približno $2{,}1\,\mathrm{s}$.« -/
theorem primer2_cas :
    (10 - Real.sqrt 120) / 10 < 0 ∧ |(10 + Real.sqrt 120) / 10 - 2.10| ≤ 0.005 ∧
      |(10 + Real.sqrt 120) / 10 - 2.1| ≤ 0.05 := by
  have h1 : (10.95:ℝ) < Real.sqrt 120 := by
    rw [Real.lt_sqrt (by norm_num)]; norm_num
  have h2 : Real.sqrt 120 < 10.96 := by
    rw [Real.sqrt_lt' (by norm_num)]; norm_num
  exact ⟨by linarith, blizu (by linarith) (by linarith), blizu (by linarith) (by linarith)⟩

/-! ## Primer 3: kolesarski šprint -/

/-- Hitrost kolesarja iz primera 3. -/
noncomputable def v₃ (t : ℝ) : ℝ := 3 * t - 0.25 * t ^ 2

/-- Primer 3, korak 1: `v'(t) = 3 − 0,5t`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#primer3-odvod
besedilo: »$v'(t) = 3 - 0{,}5t$« -/
theorem primer3_odvod (t : ℝ) : HasDerivAt v₃ (3 - 0.5 * t) t := by
  unfold v₃
  exact (((hasDerivAt_id' t).const_mul 3).sub ((hasDerivAt_pow 2 t).const_mul 0.25)).congr_deriv
    (by norm_num; ring)

/-- Primer 3, koraka 2 in 3: `3 − 0,5t = 0` natanko pri `t = 6`; pred tem je `v' > 0`, po tem `v' < 0`;
`v_max = 3·6 − 0,25·36 = 9` in `v(t) ≤ 9` za vsak `t`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#primer3-maksimum
besedilo: »$v_{\max} = 3 \cdot 6 - 0{,}25 \cdot 36 = 9$« -/
theorem primer3_maksimum :
    (∀ t : ℝ, 3 - 0.5 * t = 0 ↔ t = 6) ∧ (∀ t : ℝ, t < 6 → 0 < 3 - 0.5 * t) ∧
      (∀ t : ℝ, 6 < t → 3 - 0.5 * t < 0) ∧ v₃ 6 = 3 * 6 - 0.25 * 36 ∧ (3:ℝ) * 6 - 0.25 * 36 = 9 ∧
      ∀ t, v₃ t ≤ 9 := by
  refine ⟨fun t => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, fun t h => by linarith,
    fun t h => by linarith, by unfold v₃; norm_num, by norm_num, fun t => ?_⟩
  unfold v₃
  nlinarith [sq_nonneg (t - 6)]

/-- Primer 3, koraki 4 in 5: primitivna funkcija `1,5t² − t³/12`; pot je
`∫₀¹² v = 1,5·144 − 1728/12 = 216 − 144 = 72`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#primer3-pot
besedilo: »$1{,}5 \cdot 144 - \dfrac{1728}{12} = 216 - 144 = 72$« -/
theorem primer3_pot : ∫ t in (0:ℝ)..12, v₃ t = 72 := by
  have hF : ∀ t, HasDerivAt (fun t : ℝ => 1.5 * t ^ 2 - t ^ 3 / 12) (v₃ t) t := by
    intro t
    unfold v₃
    exact (((hasDerivAt_pow 2 t).const_mul 1.5).sub ((hasDerivAt_pow 3 t).div_const 12)).congr_deriv
      (by norm_num; ring)
  have hc : Continuous v₃ := by unfold v₃; fun_prop
  calc ∫ t in (0:ℝ)..12, v₃ t
      = (1.5 * 12 ^ 2 - 12 ^ 3 / 12) - (1.5 * 0 ^ 2 - 0 ^ 3 / 12) := newton_leibniz _ _ 0 12 hF hc
    _ = 1.5 * 144 - 1728 / 12 := by norm_num
    _ = 216 - 144 := by norm_num
    _ = 72 := by norm_num

/-- Primer 3, korak 6: `v(12) = 36 − 36 = 0`, kolesar se ustavi.
trditev: MAT-SS-4/mesane-maturitetne-naloge#primer3-ustavi
besedilo: »Preverimo smiselnost: $v(12) = 36 - 36 = 0$, kolesar se res ustavi.« -/
theorem primer3_ustavi : v₃ 12 = 36 - 36 ∧ (36:ℝ) - 36 = 0 := by unfold v₃; norm_num

/-! ## Primer 4: sezonske vstopnice -/

/-- Ponovitev: `n`-ti člen geometrijskega zaporedja `aₙ = a₁qⁿ⁻¹`. -/
noncomputable def clen (a₁ q : ℝ) (n : ℕ) : ℝ := a₁ * q ^ (n - 1)

/-- Ponovitev in ustno vprašanje 3: vsota prvih `n` členov `a₁ + a₁q + … + a₁qⁿ⁻¹ = a₁(qⁿ − 1)/(q − 1)`
za `q ≠ 1`; izpeljava: `qSₙ − Sₙ = a₁qⁿ − a₁`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#geometrijska-vsota
besedilo: »$S_n = a_1 \frac{q^n - 1}{q - 1}$, $q \ne 1$ (priloga)« -/
theorem geometrijska_vsota (a₁ q : ℝ) (hq : q ≠ 1) (n : ℕ) :
    q * (∑ i ∈ range n, a₁ * q ^ i) - ∑ i ∈ range n, a₁ * q ^ i = a₁ * q ^ n - a₁ ∧
      ∑ i ∈ range n, a₁ * q ^ i = a₁ * (q ^ n - 1) / (q - 1) := by
  have g := geom_sum_mul q n
  rw [← mul_sum]
  constructor
  · linear_combination a₁ * g
  · rw [geom_sum_eq hq n]; ring

/-- Predpostavka trditve `geometrijska_vsota` se da izpolniti (`q = 1,05`). -/
example : (1.05:ℝ) ≠ 1 := by norm_num

/-- Predpostavke trditve `geometrijska_vsota` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1.05:ℝ) ≠ 1 := by norm_num
  geometrijska_vsota (hq := w)

/-- Primer 4, korak 2 in pogoste napake: `a₆ = 2000·1,05⁵ ≈ 2553` (eksponent `n − 1 = 5`, ne `6`).
trditev: MAT-SS-4/mesane-maturitetne-naloge#primer4-clen
besedilo: »$a_6 = 2000 \cdot 1{,}05^5 \approx 2553$ vstopnic (eksponent je $n - 1 = 5$).« -/
theorem primer4_clen :
    clen 2000 1.05 6 = 2000 * 1.05 ^ 5 ∧ |2000 * (1.05:ℝ) ^ 5 - 2553| ≤ 0.5 ∧
      clen 2000 1.05 6 ≠ 2000 * 1.05 ^ 6 := by
  refine ⟨by norm_num [clen], blizu (by norm_num) (by norm_num), by norm_num [clen]⟩

/-- Primer 4, premisli: `S₆ = 2000·(1,05⁶ − 1)/0,05 ≈ 13 604`, kar je vsota šestih sezon.
trditev: MAT-SS-4/mesane-maturitetne-naloge#primer4-vsota
besedilo: »$S_6 = 2000 \cdot \dfrac{1{,}05^6 - 1}{0{,}05}$« -/
theorem primer4_vsota :
    ∑ i ∈ range 6, 2000 * (1.05:ℝ) ^ i = 2000 * ((1.05:ℝ) ^ 6 - 1) / 0.05 ∧
      |2000 * ((1.05:ℝ) ^ 6 - 1) / 0.05 - 13604| ≤ 0.5 := by
  refine ⟨?_, blizu (by norm_num) (by norm_num)⟩
  rw [(geometrijska_vsota 2000 1.05 (by norm_num) 6).2]
  norm_num

/-! ## Pogoste napake: liga -/

/-- Pogoste napake in Preveri se 3: doma in v gosteh je `V₁₀² = 10·9 = 90` tekem, ne `C(10, 2) = 45`;
pri `20` ekipah `V₂₀² = 20·19 = 380`, kar je približno štirikrat več (`4 < 380/90 < 4,25`); deset novih
ekip, vsaka z `2·19 = 38` tekmami.
trditev: MAT-SS-4/mesane-maturitetne-naloge#liga
besedilo: »$V_{20}^2 = 20 \cdot 19 = 380$, $V_{10}^2 = 10 \cdot 9 = 90$. Število tekem raste približno s kvadratom števila ekip.« -/
theorem liga :
    Nat.descFactorial 10 2 = 10 * 9 ∧ 10 * 9 = 90 ∧ Nat.choose 10 2 = 45 ∧
      Nat.descFactorial 20 2 = 20 * 19 ∧ 20 * 19 = 380 ∧ (4:ℝ) < 380 / 90 ∧ (380:ℝ) / 90 < 4.25 ∧
      2 * 19 = 38 := by
  refine ⟨by decide, by norm_num, by decide, by decide, by norm_num, by norm_num, by norm_num,
    by norm_num⟩

/-! ## Za maturo, naloga 1 -/

/-- Rdeča kroglica: oznake `0, …, 4` so rdeče, `5, 6, 7` modre. -/
def rdeca (i : Fin 8) : Prop := i.val < 5

instance : DecidablePred rdeca := fun i => inferInstanceAs (Decidable (i.val < 5))

/-- Naloga 1: dveh od `8` kroglic je `C(8, 2) = 8·7/2 = 28` izbir, izbir z eno rdečo in eno modro je
`5·3 = 15`, zato je `P = 15/28`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#naloga1
besedilo: »Vseh izidov je toliko, kot je načinov za izbiro $2$ od $8$ kroglic; vrstni red ni pomemben: $\binom{8}{2} = \dfrac{8 \cdot 7}{2} = 28$.« -/
theorem naloga1 :
    ((univ : Finset (Fin 8)).powersetCard 2).card = 28 ∧ (8 * 7 / 2 : ℕ) = 28 ∧
      (((univ : Finset (Fin 8)).powersetCard 2).filter (fun s => (s.filter rdeca).card = 1)).card = 15 ∧
      5 * 3 = 15 ∧ ((15:ℝ) / 28 = 5 * 3 / 28) := by
  refine ⟨by decide, by norm_num, by decide, by norm_num, by norm_num⟩

/-! ## Za maturo, naloga 2 -/

/-- Funkcija iz naloge 2: `f(x) = −x² + 4x`. -/
noncomputable def f₂ (x : ℝ) : ℝ := -x ^ 2 + 4 * x

/-- Naloga 2 a): `−x² + 4x = −x(x − 4) = 0` natanko pri `x = 0` ali `x = 4`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#naloga2-nicli
besedilo: »a) $-x^2 + 4x = -x(x - 4) = 0$, zato sta ničli $x_1 = 0$ in $x_2 = 4$.« -/
theorem naloga2_nicli (x : ℝ) : (f₂ x = -x * (x - 4)) ∧ (f₂ x = 0 ↔ x = 0 ∨ x = 4) := by
  refine ⟨by unfold f₂; ring, ?_⟩
  unfold f₂
  constructor
  · intro h
    have : x * (x - 4) = 0 := by linarith
    rcases mul_eq_zero.mp this with h1 | h1
    · left; exact h1
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Naloga 2 a): presečišča `−x² + 4x = x` ⇔ `x² − 3x = x(x − 3) = 0` ⇔ `x = 0` ali `x = 3`;
točki `A(0, 0)` in `B(3, 3)`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#naloga2-presecisca
besedilo: »a) Presečišča: $-x^2 + 4x = x$ da $x^2 - 3x = 0$ oziroma $x(x - 3) = 0$, torej $x = 0$ ali $x = 3$. Presečišči sta $A(0, 0)$ in $B(3, 3)$.« -/
theorem naloga2_presecisca (x : ℝ) :
    (f₂ x = x ↔ x ^ 2 - 3 * x = 0) ∧ (f₂ x = x ↔ x = 0 ∨ x = 3) ∧ f₂ 0 = 0 ∧ f₂ 3 = 3 := by
  refine ⟨by unfold f₂; constructor <;> intro h <;> linarith, ?_, by norm_num [f₂], by norm_num [f₂]⟩
  unfold f₂
  constructor
  · intro h
    have : x * (x - 3) = 0 := by linarith
    rcases mul_eq_zero.mp this with h1 | h1
    · left; exact h1
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Naloga 2 b): `f(1) = −1 + 4 = 3`, `f'(x) = −2x + 4`, `k = f'(1) = 2`; tangenta
`y − 3 = 2(x − 1)` je `y = 2x + 1`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#naloga2-tangenta
besedilo: »b) $f(1) = -1 + 4 = 3$, $f'(x) = -2x + 4$, naklon tangente $k = f'(1) = 2$.« -/
theorem naloga2_tangenta :
    f₂ 1 = -1 + 4 ∧ (-1:ℝ) + 4 = 3 ∧ (∀ x, HasDerivAt f₂ (-2 * x + 4) x) ∧ -2 * (1:ℝ) + 4 = 2 ∧
      ∀ x : ℝ, 3 + 2 * (x - 1) = 2 * x + 1 := by
  refine ⟨by norm_num [f₂], by norm_num, fun x => ?_, by norm_num, fun x => by ring⟩
  unfold f₂
  exact ((hasDerivAt_pow 2 x).neg.add ((hasDerivAt_id' x).const_mul 4)).congr_deriv
    (by norm_num)

/-- Naloga 2 c): na `[0, 3]` je graf nad premico (`x ≤ f(x)`, npr. `f(1) = 3 > 1`), ploščina je
`∫₀³ (−x² + 4x − x) dx = ∫₀³ (−x² + 3x) dx = [−x³/3 + 3x²/2]₀³ = −9 + 27/2 = 9/2`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#naloga2-ploscina
besedilo: »c) Med $x = 0$ in $x = 3$ je graf funkcije nad premico (na primer $f(1) = 3 > 1$), zato je $S = \int_0^3 \left(-x^2 + 4x - x\right) dx = \int_0^3 \left(-x^2 + 3x\right) dx$.« -/
theorem naloga2_ploscina :
    (∀ x ∈ Icc (0:ℝ) 3, x ≤ f₂ x) ∧ f₂ 1 > 1 ∧
      ∫ x in (0:ℝ)..3, (f₂ x - x) = 9 / 2 := by
  refine ⟨fun x hx => ?_, by norm_num [f₂], ?_⟩
  · unfold f₂; nlinarith [hx.1, hx.2]
  · have hF : ∀ x, HasDerivAt (fun x : ℝ => -x ^ 3 / 3 + 3 * x ^ 2 / 2) (-x ^ 2 + 3 * x) x := by
      intro x
      exact (((hasDerivAt_pow 3 x).neg.div_const 3).add ((hasDerivAt_pow 2 x).const_mul 3
        |>.div_const 2)).congr_deriv (by norm_num; ring)
    calc ∫ x in (0:ℝ)..3, (f₂ x - x)
        = ∫ x in (0:ℝ)..3, (-x ^ 2 + 3 * x) := by
          congr 1; ext x; unfold f₂; ring
      _ = (-3 ^ 3 / 3 + 3 * 3 ^ 2 / 2) - (-0 ^ 3 / 3 + 3 * 0 ^ 2 / 2) :=
          newton_leibniz _ _ 0 3 hF (by fun_prop)
      _ = -9 + 27 / 2 := by norm_num
      _ = 9 / 2 := by norm_num

/-! ## Za maturo, naloga 3 -/

/-- Naloga 3 a): `P = C(10, 1)·0,04·0,96⁹ = 10·0,04·0,96⁹`; `0,96⁹ = 0,692533…`,
`P = 0,277013… ≈ 0,2770`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#naloga3-a
besedilo: »$P = 10 \cdot 0{,}04 \cdot 0{,}692533\ldots = 0{,}277013\ldots \approx 0{,}2770$« -/
theorem naloga3_a :
    (Nat.choose 10 1 : ℝ) * 0.04 * 0.96 ^ 9 = 10 * 0.04 * 0.96 ^ 9 ∧
      (0.692533:ℝ) ≤ 0.96 ^ 9 ∧ (0.96:ℝ) ^ 9 < 0.692534 ∧ |(0.96:ℝ) ^ 9 - 0.692534| ≤ 0.0000005 ∧
      (0.277013:ℝ) ≤ 10 * 0.04 * 0.96 ^ 9 ∧ 10 * 0.04 * (0.96:ℝ) ^ 9 < 0.277014 ∧
      |10 * 0.04 * (0.96:ℝ) ^ 9 - 0.2770| ≤ 0.00005 := by
  refine ⟨by norm_num, by norm_num, by norm_num, blizu (by norm_num) (by norm_num), by norm_num,
    by norm_num, blizu (by norm_num) (by norm_num)⟩

/-- Naloga 3 b): `0,96¹⁰ = 0,664832…`, `P = 1 − 0,96¹⁰ = 0,335167… ≈ 0,3352`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#naloga3-b
besedilo: »$P = 1 - 0{,}96^{10} = 0{,}335167\ldots \approx 0{,}3352$« -/
theorem naloga3_b :
    (0.664832:ℝ) ≤ 0.96 ^ 10 ∧ (0.96:ℝ) ^ 10 < 0.664833 ∧ (0.335167:ℝ) ≤ 1 - 0.96 ^ 10 ∧
      1 - (0.96:ℝ) ^ 10 < 0.335168 ∧ |1 - (0.96:ℝ) ^ 10 - 0.3352| ≤ 0.00005 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, blizu (by norm_num) (by norm_num)⟩

/-- Naloga 3 c), koraka 5 in 6: `1 − 0,96ⁿ > 0,5` ⇔ `0,96ⁿ < 0,5` ⇔ `n ln 0,96 < ln 0,5` ⇔
`n > ln 0,5 / ln 0,96` (ker je `ln 0,96 < 0`, se neenačaj obrne); velja za vsak realni `n`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#naloga3-c-log
besedilo: »c) Logaritmiramo: $n \ln 0{,}96 < \ln 0{,}5$. Ker je $\ln 0{,}96 < 0$, se pri deljenju znak neenakosti obrne: $n > \dfrac{\ln 0{,}5}{\ln 0{,}96} = 16{,}979\ldots$.« -/
theorem naloga3_c_log (n : ℝ) :
    (1 - (0.96:ℝ) ^ n > 0.5 ↔ (0.96:ℝ) ^ n < 0.5) ∧
      ((0.96:ℝ) ^ n < 0.5 ↔ n * Real.log 0.96 < Real.log 0.5) ∧ Real.log 0.96 < 0 ∧
      (n * Real.log 0.96 < Real.log 0.5 ↔ n > Real.log 0.5 / Real.log 0.96) := by
  have hl : Real.log 0.96 < 0 := Real.log_neg (by norm_num) (by norm_num)
  refine ⟨by constructor <;> intro h <;> linarith, ?_, hl, ?_⟩
  · rw [← Real.log_lt_log_iff (Real.rpow_pos_of_pos (by norm_num) n) (by norm_num),
      Real.log_rpow (by norm_num)]
  · rw [gt_iff_lt, div_lt_iff_of_neg hl]

/-- Naloga 3 c), korak 6: `ln 0,5 / ln 0,96 = 16,979…` (meje za logaritma iz vrste za `ln(1 − x)`).
trditev: MAT-SS-4/mesane-maturitetne-naloge#naloga3-c-kvocient
besedilo: »c) Logaritmiramo: $n \ln 0{,}96 < \ln 0{,}5$. Ker je $\ln 0{,}96 < 0$, se pri deljenju znak neenakosti obrne: $n > \dfrac{\ln 0{,}5}{\ln 0{,}96} = 16{,}979\ldots$.« -/
theorem naloga3_c_kvocient :
    (16.979:ℝ) < Real.log 0.5 / Real.log 0.96 ∧ Real.log 0.5 / Real.log 0.96 < 16.98 := by
  obtain ⟨a1, a2⟩ := log_meje 0.5 40 (by norm_num [abs_of_pos]) (-0.6931471815) (-0.69314718)
    (by norm_num [sum_range_succ, abs_of_pos]) (by norm_num [sum_range_succ, abs_of_pos])
  obtain ⟨b1, b2⟩ := log_meje 0.04 10 (by norm_num [abs_of_pos]) (-0.0408219946) (-0.0408219945)
    (by norm_num [sum_range_succ, abs_of_pos]) (by norm_num [sum_range_succ, abs_of_pos])
  norm_num at a1 a2 b1 b2
  have hl : Real.log 0.96 < 0 := Real.log_neg (by norm_num) (by norm_num)
  constructor
  · rw [lt_div_iff_of_neg hl]; linarith
  · rw [div_lt_iff_of_neg hl]; linarith

/-- Naloga 3 c), korak 7: med naravnimi števili velja `0,96ⁿ < 0,5` natanko za `n ≥ 17`; preverba
`0,96¹⁶ ≈ 0,5204 > 0,5`, `0,96¹⁷ ≈ 0,4996 < 0,5`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#naloga3-c
besedilo: »c) Najmanjše naravno število je $n = 17$. Preverba: $0{,}96^{16} \approx 0{,}5204 > 0{,}5$ in $0{,}96^{17} \approx 0{,}4996 < 0{,}5$.« -/
theorem naloga3_c :
    (∀ n : ℕ, 1 - (0.96:ℝ) ^ n > 0.5 ↔ 17 ≤ n) ∧ |(0.96:ℝ) ^ 16 - 0.5204| ≤ 0.00005 ∧
      |(0.96:ℝ) ^ 17 - 0.4996| ≤ 0.00005 ∧ (0.96:ℝ) ^ 16 > 0.5 ∧ (0.96:ℝ) ^ 17 < 0.5 := by
  refine ⟨fun n => ⟨fun h => ?_, fun h => ?_⟩, blizu (by norm_num) (by norm_num),
    blizu (by norm_num) (by norm_num), by norm_num, by norm_num⟩
  · by_contra hn
    push Not at hn
    have : (0.96:ℝ) ^ 16 ≤ 0.96 ^ n := pow_le_pow_of_le_one (by norm_num) (by norm_num) (by omega)
    have : (0.5:ℝ) < 0.96 ^ 16 := by norm_num
    linarith
  · have : (0.96:ℝ) ^ n ≤ 0.96 ^ 17 := pow_le_pow_of_le_one (by norm_num) (by norm_num) h
    have : (0.96:ℝ) ^ 17 < 0.5 := by norm_num
    linarith

/-- Naloga 3 d): `pₖ = 0,04·0,96ᵏ⁻¹` ima količnik `pₖ₊₁/pₖ = 0,96` za vsak `k ≥ 1`; vsota
`p₁ + … + p₁₀ = 0,04·(0,96¹⁰ − 1)/(0,96 − 1) = 0,04·(1 − 0,96¹⁰)/0,04 = 1 − 0,96¹⁰ ≈ 0,3352`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#naloga3-d
besedilo: »$S_{10} = 0{,}04 \cdot \dfrac{0{,}96^{10} - 1}{0{,}96 - 1} = 0{,}04 \cdot \dfrac{1 - 0{,}96^{10}}{0{,}04} = 1 - 0{,}96^{10} \approx 0{,}3352$« -/
theorem naloga3_d :
    (∀ k : ℕ, 1 ≤ k → (0.04 * (0.96:ℝ) ^ k) / (0.04 * 0.96 ^ (k - 1)) = 0.96) ∧
      ∑ k ∈ Finset.Icc 1 10, 0.04 * (0.96:ℝ) ^ (k - 1) = 1 - 0.96 ^ 10 ∧
      |1 - (0.96:ℝ) ^ 10 - 0.3352| ≤ 0.00005 := by
  refine ⟨fun k hk => ?_, ?_, blizu (by norm_num) (by norm_num)⟩
  · obtain ⟨j, rfl⟩ := Nat.exists_eq_add_of_le' hk
    rw [Nat.add_sub_cancel, pow_succ]
    have : (0.96:ℝ) ^ j ≠ 0 := by positivity
    field_simp
  · calc ∑ k ∈ Finset.Icc 1 10, 0.04 * (0.96:ℝ) ^ (k - 1)
        = 0.04 * ((0.96:ℝ) ^ 10 - 1) / (0.96 - 1) := by
          rw [show Finset.Icc 1 10 = Finset.Ico 1 11 from rfl, Finset.sum_Ico_eq_sum_range]
          simp only [sum_range_succ, sum_range_zero]
          norm_num
      _ = 0.04 * (1 - (0.96:ℝ) ^ 10) / 0.04 := by norm_num
      _ = 1 - 0.96 ^ 10 := by norm_num

/-! ## Ustno vprašanje 2 -/

/-- Ustno vprašanje 2: če ima funkcija največjo vrednost na `[a, b]` v notranji točki `c`, kjer je
odvedljiva, je `f'(c) = 0` (zato so kandidati stacionarne točke in krajišči).
trditev: MAT-SS-4/mesane-maturitetne-naloge#notranji-maksimum
besedilo: »Kandidati za največjo vrednost so te stacionarne točke, točke, kjer funkcija ni odvedljiva, in obe krajišči $a$ in $b$.« -/
theorem notranji_maksimum (f : ℝ → ℝ) (a b c f' : ℝ) (hc : c ∈ Ioo a b) (hmax : IsMaxOn f (Icc a b) c)
    (hf : HasDerivAt f f' c) : f' = 0 :=
  (hmax.isLocalMax (Icc_mem_nhds hc.1 hc.2)).hasDerivAt_eq_zero hf

/-- Predpostavke trditve `notranji_maksimum` se dajo izpolniti (`f(x) = −x²` na `[−1, 1]`, `c = 0`). -/
example : (0:ℝ) ∈ Set.Ioo (-1) 1 ∧ IsMaxOn (fun x : ℝ => -x ^ 2) (Set.Icc (-1) 1) 0 ∧
    HasDerivAt (fun x : ℝ => -x ^ 2) 0 0 := by
  refine ⟨⟨by norm_num, by norm_num⟩, fun x _ => by simp; positivity, ?_⟩
  exact (hasDerivAt_pow 2 (0:ℝ)).neg.congr_deriv (by norm_num)

/-- Predpostavke trditve `notranji_maksimum` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ∈ Set.Ioo (-1) 1 ∧ IsMaxOn (fun x : ℝ => -x ^ 2) (Set.Icc (-1) 1) 0 ∧ HasDerivAt (fun x : ℝ => -x ^ 2) 0 0 := by
    refine ⟨⟨by norm_num, by norm_num⟩, fun x _ => by simp; positivity, ?_⟩
    exact (hasDerivAt_pow 2 (0:ℝ)).neg.congr_deriv (by norm_num)
  notranji_maksimum (hc := w.1) (hmax := w.2.1) (hf := w.2.2)

/-- Ustno vprašanje 2, obstoj: zvezna funkcija na `[a, b]` doseže največjo vrednost v neki točki `c`;
ta je krajišče `a` ali `b` ali pa notranja točka, kjer je (če je `f` tam odvedljiva) `f'(c) = 0`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#maksimum-na-intervalu
besedilo: »Kandidati za največjo vrednost so te stacionarne točke, točke, kjer funkcija ni odvedljiva, in obe krajišči $a$ in $b$.« -/
theorem maksimum_na_intervalu (f : ℝ → ℝ) (a b : ℝ) (hab : a ≤ b) (hf : ContinuousOn f (Icc a b)) :
    ∃ c ∈ Icc a b, IsMaxOn f (Icc a b) c ∧
      (c = a ∨ c = b ∨ (c ∈ Ioo a b ∧ (DifferentiableAt ℝ f c → deriv f c = 0))) := by
  obtain ⟨c, hc, hmax⟩ := isCompact_Icc.exists_isMaxOn (nonempty_Icc.2 hab) hf
  refine ⟨c, hc, hmax, ?_⟩
  rcases eq_or_lt_of_le hc.1 with h1 | h1
  · exact Or.inl h1.symm
  rcases eq_or_lt_of_le hc.2 with h2 | h2
  · exact Or.inr (Or.inl h2)
  exact Or.inr (Or.inr ⟨⟨h1, h2⟩, fun hd => notranji_maksimum f a b c _ ⟨h1, h2⟩ hmax hd.hasDerivAt⟩)

/-- Predpostavke trditve `maksimum_na_intervalu` se dajo izpolniti (`f(x) = −x²` na `[−1, 1]`). -/
example : (-1:ℝ) ≤ 1 ∧ ContinuousOn (fun x : ℝ => -x ^ 2) (Set.Icc (-1) 1) :=
  ⟨by norm_num, by fun_prop⟩

/-! ## Preveri se -/

/-- Predpostavke trditve `maksimum_na_intervalu` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (-1:ℝ) ≤ 1 ∧ ContinuousOn (fun x : ℝ => -x ^ 2) (Set.Icc (-1) 1) :=
    ⟨by norm_num, by fun_prop⟩
  maksimum_na_intervalu (hab := w.1) (hf := w.2)

/-- Preveri se 1: naklon tangente na tir `h(t) = −5t² + 10t + 1` v `t = 1` je `h'(1) = 0`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#kviz1
besedilo: »Na tleh je $h(t) = 0$: $-5t^2 + 10t + 1 = 0$, kar pomnožimo z $-1$ v $5t^2 - 10t - 1 = 0$.« -/
theorem kviz1 : HasDerivAt h₂ 0 1 := by
  simpa using primer2_odvod 1

/-- Preveri se 4: verjetnost vsaj enega zadetka je `1 − 0,3·0,3 = 1 − 0,09 = 0,91`; `0,7 + 0,7 = 1,4 > 1`
in `0,7·0,7 = 0,49` (obe).
trditev: MAT-SS-4/mesane-maturitetne-naloge#kviz4
besedilo: »Nasprotni dogodek: zgreši obe, $0{,}3 \cdot 0{,}3 = 0{,}09$. Torej $1 - 0{,}09 = 0{,}91$.« -/
theorem kviz4 :
    (0.3:ℝ) * 0.3 = 0.09 ∧ (1:ℝ) - 0.09 = 0.91 ∧ (0.7:ℝ) + 0.7 = 1.4 ∧ (1.4:ℝ) > 1 ∧
      (0.7:ℝ) * 0.7 = 0.49 := by norm_num

/-- Višina žoge iz Preveri se 5: `h(t) = −5t² + 15t`. -/
noncomputable def h₅ (t : ℝ) : ℝ := -5 * t ^ 2 + 15 * t

/-- Preveri se 5: `h'(t) = −10t + 15 = 0` da `t = 1,5 s`; `h(1,5) = −11,25 + 22,5 = 11,25 m` je največja
višina; `15·1,5 = 22,5`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#kviz5
besedilo: »$h'(t) = -10t + 15 = 0$ da $t = 1{,}5\,\mathrm{s}$; $h(1{,}5) = -11{,}25 + 22{,}5 = 11{,}25\,\mathrm{m}$.« -/
theorem kviz5 :
    (∀ t, HasDerivAt h₅ (-10 * t + 15) t) ∧ (∀ t : ℝ, -10 * t + 15 = 0 ↔ t = 1.5) ∧
      h₅ 1.5 = -11.25 + 22.5 ∧ (-11.25:ℝ) + 22.5 = 11.25 ∧ (∀ t, h₅ t ≤ 11.25) ∧
      (15:ℝ) * 1.5 = 22.5 := by
  refine ⟨fun t => ?_, fun t => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    by norm_num [h₅], by norm_num, fun t => ?_, by norm_num⟩
  · unfold h₅
    exact (((hasDerivAt_pow 2 t).const_mul (-5)).add ((hasDerivAt_id' t).const_mul 15)).congr_deriv
      (by norm_num; ring)
  · unfold h₅; nlinarith [sq_nonneg (t - 1.5)]

/-! ## Blok RACUN -/

/-- RACUN: `8·7/2 = 28`, `5·3/28 = 15/28`, `−1² + 4·1 = 3`, `0,04·(0,96¹⁰ − 1)/(0,96 − 1) ≈ 0,3352`,
`0,96¹⁰ ≈ 0,6648`, `ln 0,5/ln 0,96 ≈ 16,98`.
trditev: MAT-SS-4/mesane-maturitetne-naloge#racun
besedilo: »$S_{10} = 0{,}04 \cdot \dfrac{0{,}96^{10} - 1}{0{,}96 - 1} = 0{,}04 \cdot \dfrac{1 - 0{,}96^{10}}{0{,}04} = 1 - 0{,}96^{10} \approx 0{,}3352$« -/
theorem racun :
    (8:ℝ) * 7 / 2 = 28 ∧ (5:ℝ) * 3 / 28 = 15 / 28 ∧ -(1:ℝ) ^ 2 + 4 * 1 = 3 ∧
      |0.04 * ((0.96:ℝ) ^ 10 - 1) / (0.96 - 1) - 0.3352| ≤ 0.00005 ∧
      |(0.96:ℝ) ^ 10 - 0.6648| ≤ 0.00005 ∧ |Real.log 0.5 / Real.log 0.96 - 16.98| ≤ 0.005 := by
  obtain ⟨q1, q2⟩ := naloga3_c_kvocient
  exact ⟨by norm_num, by norm_num, by norm_num, blizu (by norm_num) (by norm_num),
    blizu (by norm_num) (by norm_num), blizu (by linarith) (by linarith)⟩

/-! ## Primeri izpolnljivosti (izrek, uporabljen na konkretnih vrednostih) -/

/-- Predpostavke trditve `nasprotni_dogodek` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  nasprotni_dogodek (Measure.dirac true) {true} (measurableSet_singleton true)

end Evklid.Lekcije.MAT_SS_4.MesaneMaturitetneNaloge
