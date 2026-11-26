/-
vir: content/lessons/MAT-SS-3/graf-polinoma.md
sha256: 8cac40e4f6641bcfb9520a6ce4e29aff6e0c785b4156396403a7496377f4f279
Ni v Leanu: simulacija »Graf polinoma: ničle in njihova stopnja«, risba (graf iz Na sliki) in besedni opisi
skic (Primer 1 korak 6, Naloga 2 b »skica«, delfin, črka U), postopek skice v petih korakih in postopek
sestavljanja modela (Razlaga 8, korak 1–4) kot navodila, ne trditve, presoje smiselnosti modelov (»jezero ne bo
naraščalo v nedogled«, »brez nove tablete«; dokazano je le, da kraki gredo v ±∞ oz. da funkcija raste),
točkovanje. »Pri stopnji 3 ali več se graf ob ničli splošči« (opis oblike, ni trditev) in »graf stopnje n ima
največ n − 1 obratov« (potrebuje pojem obrata kot lokalnega ekstrema in odvod; lekcija sama napove dokaz pri
odvodih): ni dokazano. Bolj natančno, »oklepaj gre proti
1«: dokazano kot asimptotska enakovrednost p(x) ~ aₙxⁿ (`vodilni_clen_prevlada`), ne v zapisu z ulomki.
Stopnja ničle je `rootMultiplicity`; »seka / dotakne se« je zapisano kot menjava / ohranitev predznaka ob ničli
(`stopnja_nicle`), v Primeru 3 in Nalogi 3 kot deljivost s faktorjem (x − c) oz. (x − c)². Decimalna števila so
točna (ℝ), npr. −0,04 kot `-0.04 : ℝ`.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.GrafPolinoma

open Polynomial Filter

/-! ## Splošna pravila -/

/-- Razlaga 2: graf polinoma je neprekinjen, zato je na intervalu brez ničel predznak stalen (poljubni točki
`x`, `y` z intervala dasta vrednosti istega predznaka, torej zadošča ena testna točka).
trditev: MAT-SS-3/graf-polinoma#predznak-stalen
besedilo: »Med sosednjima ničlama je predznak stalen.** Graf polinoma je neprekinjena krivulja, brez skokov in lukenj.« -/
theorem predznak_stalen (p : ℝ[X]) (a b : ℝ) (h : ∀ x ∈ Set.Ioo a b, p.eval x ≠ 0) (x y : ℝ)
    (hx : x ∈ Set.Ioo a b) (hy : y ∈ Set.Ioo a b) : 0 < p.eval x * p.eval y := by
  wlog hxy : x ≤ y generalizing x y
  · rw [mul_comm]; exact this y x hy hx (le_of_not_ge hxy)
  have hc : ContinuousOn (fun t => p.eval t) (Set.Icc x y) := p.continuous.continuousOn
  have hsub : Set.Icc x y ⊆ Set.Ioo a b := fun t ht => ⟨hx.1.trans_le ht.1, ht.2.trans_lt hy.2⟩
  rcases lt_trichotomy (p.eval x) 0 with h1 | h1 | h1
  · rcases lt_trichotomy (p.eval y) 0 with h2 | h2 | h2
    · exact mul_pos_of_neg_of_neg h1 h2
    · exact absurd h2 (h y hy)
    · obtain ⟨z, hz, hz0⟩ := intermediate_value_Icc hxy hc ⟨h1.le, h2.le⟩
      exact absurd hz0 (h z (hsub hz))
  · exact absurd h1 (h x hx)
  · rcases lt_trichotomy (p.eval y) 0 with h2 | h2 | h2
    · obtain ⟨z, hz, hz0⟩ := intermediate_value_Icc' hxy hc ⟨h2.le, h1.le⟩
      exact absurd hz0 (h z (hsub hz))
    · exact absurd h2 (h y hy)
    · exact mul_pos h1 h2

/-- Predpostavke trditve `predznak_stalen` se dajo izpolniti (`x² + 1` nima ničel na `(0, 1)`). -/
example : ∀ x ∈ Set.Ioo (0:ℝ) 1, (X ^ 2 + 1 : ℝ[X]).eval x ≠ 0 := fun x _ => by simp; positivity

/-- Razlaga 3, Bolj natančno in Ustno vprašanje 1: če je `p(x) = (x − c)ᵏ s(x)` in `s(c) ≠ 0` (ničla stopnje
`k`), ima `s` blizu `c` predznak `s(c)`; pri sodem `k` ima `p` na obeh straneh `c` isti predznak (graf se osi
dotakne), pri lihem `k` se predznak zamenja (graf os seka). Produkt s `s(c)` meri, ali ima `p(x)` predznak
`s(c)`.
trditev: MAT-SS-3/graf-polinoma#stopnja-nicle
besedilo: »Zakaj odloča parnost stopnje ničle.** Če je $c$ ničla stopnje $k$, je $p(x) = (x - c)^k s(x)$, kjer je $s(c) \ne 0$.« -/
theorem stopnja_nicle (s : ℝ[X]) (c : ℝ) (k : ℕ) (hs : s.eval c ≠ 0) :
    ∃ δ > 0, ∀ x, |x - c| < δ → x ≠ c →
      (Even k → 0 < (x - c) ^ k * s.eval x * s.eval c) ∧
      (Odd k → (x < c → (x - c) ^ k * s.eval x * s.eval c < 0) ∧
        (c < x → 0 < (x - c) ^ k * s.eval x * s.eval c)) := by
  have hcont : Continuous fun x => s.eval x * s.eval c := s.continuous.mul continuous_const
  have hpos : 0 < s.eval c * s.eval c := mul_self_pos.mpr hs
  obtain ⟨δ, hδ, hδ'⟩ := Metric.continuous_iff.mp hcont c _ hpos
  refine ⟨δ, hδ, fun x hx hxc => ?_⟩
  have hsx : 0 < s.eval x * s.eval c := by
    have := hδ' x (by rwa [Real.dist_eq])
    rw [Real.dist_eq] at this
    linarith [(abs_lt.mp this).1]
  simp only [mul_assoc]
  refine ⟨fun hk => mul_pos (hk.pow_pos (sub_ne_zero.mpr hxc)) hsx, fun hk => ⟨fun h => ?_, fun h => ?_⟩⟩
  · exact mul_neg_of_neg_of_pos (hk.pow_neg (sub_neg.mpr h)) hsx
  · exact mul_pos (pow_pos (sub_pos.mpr h) k) hsx

/-- Predpostavke trditve `stopnja_nicle` se dajo izpolniti (`s = 1`). -/
example : (1 : ℝ[X]).eval 0 ≠ 0 := by simp

/-- Predpostavke trditve `stopnja_nicle` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ[X]).eval 0 ≠ 0 := by simp
  stopnja_nicle (hs := w)

/-- Razlaga 3, obrat (Primer 3, Naloga 3 a): če `p(x) = (x − c)ᵏ s(x)` (`s(c) ≠ 0`) blizu `c` levo in desno od
`c` nima nasprotnih predznakov (graf se osi le dotakne), je stopnja ničle `k` soda.
trditev: MAT-SS-3/graf-polinoma#dotik-soda-stopnja
besedilo: »Zakaj odloča parnost stopnje ničle.** Če je $c$ ničla stopnje $k$, je $p(x) = (x - c)^k s(x)$, kjer je $s(c) \ne 0$.« -/
theorem dotik_soda_stopnja (s : ℝ[X]) (c : ℝ) (k : ℕ) (hs : s.eval c ≠ 0)
    (h : ∃ δ > 0, ∀ x y, c - δ < x → x < c → c < y → y < c + δ →
      0 < ((x - c) ^ k * s.eval x) * ((y - c) ^ k * s.eval y)) : Even k := by
  by_contra hk
  have hk' := Nat.not_even_iff_odd.mp hk
  obtain ⟨δ, hδ, hp⟩ := h
  obtain ⟨ε, hε, he⟩ := stopnja_nicle s c k hs
  have hm : 0 < min δ ε / 2 := by positivity
  have hmδ : min δ ε / 2 < δ := by linarith [min_le_left δ ε]
  have hmε : min δ ε / 2 < ε := by linarith [min_le_right δ ε]
  set m := min δ ε / 2
  have h1 := ((he (c - m) (by rw [abs_lt]; constructor <;> linarith) (by linarith)).2 hk').1 (by linarith)
  have h2 := ((he (c + m) (by rw [abs_lt]; constructor <;> linarith) (by linarith)).2 hk').2 (by linarith)
  have h3 := hp (c - m) (c + m) (by linarith) (by linarith) (by linarith) (by linarith)
  nlinarith [mul_neg_of_neg_of_pos h1 h2, mul_nonneg h3.le (sq_nonneg (s.eval c))]

/-- Predpostavke trditve `dotik_soda_stopnja` se dajo izpolniti (`s = 1`, `c = 0`, `k = 2`). -/
example : (1 : ℝ[X]).eval 0 ≠ 0 ∧ ∃ δ > (0:ℝ), ∀ x y : ℝ, 0 - δ < x → x < 0 → 0 < y → y < 0 + δ →
    0 < ((x - 0) ^ 2 * (1 : ℝ[X]).eval x) * ((y - 0) ^ 2 * (1 : ℝ[X]).eval y) := by
  refine ⟨by simp, 1, one_pos, fun x y _ hx hy _ => ?_⟩
  simp only [eval_one, mul_one, sub_zero]
  exact mul_pos (by nlinarith) (by nlinarith)

/-- Predpostavke trditve `dotik_soda_stopnja` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ[X]).eval 0 ≠ 0 ∧ ∃ δ > (0:ℝ), ∀ x y : ℝ, 0 - δ < x → x < 0 → 0 < y → y < 0 + δ → 0 < ((x - 0) ^ 2 * (1 : ℝ[X]).eval x) * ((y - 0) ^ 2 * (1 : ℝ[X]).eval y) := by
    refine ⟨by simp, 1, one_pos, fun x y _ hx hy _ => ?_⟩
    simp only [eval_one, mul_one, sub_zero]
    exact mul_pos (by nlinarith) (by nlinarith)
  dotik_soda_stopnja (hs := w.1) (h := w.2)

/-- Pomožna trditev: produkt `(x − x₁)^k₁ (x − x₂)^k₂ ⋯` je moničen polinom stopnje `k₁ + k₂ + ⋯`.
pomozno -/
theorem razcep_monicen (l : List (ℝ × ℕ)) :
    (l.map fun (e : ℝ × ℕ) => (X - C e.1) ^ e.2).prod.Monic ∧
    (l.map fun (e : ℝ × ℕ) => (X - C e.1) ^ e.2).prod.natDegree = (l.map Prod.snd).sum := by
  induction l with
  | nil => simp
  | cons e l ih =>
    simp only [List.map_cons, List.prod_cons, List.sum_cons]
    have hm : ((X - C e.1) ^ e.2).Monic := (monic_X_sub_C _).pow _
    refine ⟨hm.mul ih.1, ?_⟩
    rw [hm.natDegree_mul ih.1, ih.2, natDegree_pow, natDegree_X_sub_C, mul_one]

/-- Razlaga 4: polinom `a (x − x₁)^k₁ (x − x₂)^k₂ ⋯` (`a ≠ 0`) ima stopnjo `k₁ + k₂ + ⋯` in vodilni
koeficient `a`.
trditev: MAT-SS-3/graf-polinoma#stopnja-iz-razcepa
besedilo: »4. Stopnja polinoma iz razcepa.** Če vse oklepaje zmnožiš, dobiš vodilni člen $a\,x^{k_1 + k_2 + \dots}$. Stopnja polinoma je zato vsota stopenj vseh ničel (kadar je razcepljen na same linearne faktorje), vodilni koeficient pa je število $a$ pred oklepaji.« -/
theorem stopnja_iz_razcepa (a : ℝ) (ha : a ≠ 0) (l : List (ℝ × ℕ)) :
    (C a * (l.map fun (e : ℝ × ℕ) => (X - C e.1) ^ e.2).prod).natDegree = (l.map Prod.snd).sum ∧
    (C a * (l.map fun (e : ℝ × ℕ) => (X - C e.1) ^ e.2).prod).leadingCoeff = a := by
  obtain ⟨hm, hd⟩ := razcep_monicen l
  refine ⟨by rw [natDegree_C_mul ha, hd], ?_⟩
  rw [leadingCoeff_mul, leadingCoeff_C, hm.leadingCoeff, mul_one]

/-- Predpostavke trditve `stopnja_iz_razcepa` se dajo izpolniti (`a = 1`). -/
example : (1:ℝ) ≠ 0 := one_ne_zero

/-- Predpostavke trditve `stopnja_iz_razcepa` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 := one_ne_zero
  stopnja_iz_razcepa (ha := w)

/-- Pomožna trditev: obnašanje levega kraka `p` je obnašanje desnega kraka `p(−x)`.
pomozno -/
theorem levi_krak (p : ℝ[X]) (l : Filter ℝ) (h : Tendsto (fun y => (p.comp (-X)).eval y) atTop l) :
    Tendsto (fun x => p.eval x) atBot l := by
  have := h.comp tendsto_neg_atBot_atTop
  convert this using 1
  ext x
  simp [eval_comp]

/-- Predpostavke trditve `levi_krak` se dajo izpolniti (`p = −x`: `p(−x) = x → +∞`). -/
example : Tendsto (fun y => ((-X : ℝ[X]).comp (-X)).eval y) atTop atTop := by
  simp; exact tendsto_id

/-- Razlaga 5 (tabela krakov) in Ustno vprašanje 2: za polinom stopnje `n ≥ 1` z vodilnim koeficientom `aₙ`:
sod `n`, `aₙ > 0`: levo in desno `+∞`; sod `n`, `aₙ < 0`: levo in desno `−∞`; lih `n`, `aₙ > 0`: levo `−∞`,
desno `+∞`; lih `n`, `aₙ < 0`: levo `+∞`, desno `−∞`.
trditev: MAT-SS-3/graf-polinoma#kraka
besedilo: »Oba navzdol, levo in desno $-\infty$. Vodilni člen je $-x^4$: stopnja $4$ je soda, vodilni koeficient $-1$ negativen. Prosti člen $7$ na kraka ne vpliva, pa čeprav je zapisan prvi.« -/
theorem kraka (p : ℝ[X]) (hn : 0 < p.natDegree) :
    (Even p.natDegree → 0 < p.leadingCoeff →
      Tendsto (fun x => p.eval x) atBot atTop ∧ Tendsto (fun x => p.eval x) atTop atTop) ∧
    (Even p.natDegree → p.leadingCoeff < 0 →
      Tendsto (fun x => p.eval x) atBot atBot ∧ Tendsto (fun x => p.eval x) atTop atBot) ∧
    (Odd p.natDegree → 0 < p.leadingCoeff →
      Tendsto (fun x => p.eval x) atBot atBot ∧ Tendsto (fun x => p.eval x) atTop atTop) ∧
    (Odd p.natDegree → p.leadingCoeff < 0 →
      Tendsto (fun x => p.eval x) atBot atTop ∧ Tendsto (fun x => p.eval x) atTop atBot) := by
  have hd : 0 < p.degree := natDegree_pos_iff_degree_pos.mp hn
  have hdq : 0 < (p.comp (-X)).degree := by rw [degree_comp_neg_X]; exact hd
  have hlq := comp_neg_X_leadingCoeff_eq p
  refine ⟨fun he hl => ⟨levi_krak p _ ?_, p.tendsto_atTop_of_leadingCoeff_nonneg hd hl.le⟩,
    fun he hl => ⟨levi_krak p _ ?_, p.tendsto_atBot_of_leadingCoeff_nonpos hd hl.le⟩,
    fun ho hl => ⟨levi_krak p _ ?_, p.tendsto_atTop_of_leadingCoeff_nonneg hd hl.le⟩,
    fun ho hl => ⟨levi_krak p _ ?_, p.tendsto_atBot_of_leadingCoeff_nonpos hd hl.le⟩⟩
  · apply (p.comp (-X)).tendsto_atTop_of_leadingCoeff_nonneg hdq
    rw [hlq, he.neg_one_pow, one_mul]; exact hl.le
  · apply (p.comp (-X)).tendsto_atBot_of_leadingCoeff_nonpos hdq
    rw [hlq, he.neg_one_pow, one_mul]; exact hl.le
  · apply (p.comp (-X)).tendsto_atBot_of_leadingCoeff_nonpos hdq
    rw [hlq, ho.neg_one_pow]; linarith
  · apply (p.comp (-X)).tendsto_atTop_of_leadingCoeff_nonneg hdq
    rw [hlq, ho.neg_one_pow]; linarith

/-- Predpostavke trditve `kraka` se dajo izpolniti (`x` ima stopnjo 1). -/
example : 0 < (X : ℝ[X]).natDegree := by simp

/-- Predpostavke trditve `kraka` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : 0 < (X : ℝ[X]).natDegree := by simp
  kraka (hn := w)

/-- Razlaga 5 in Bolj natančno: za zelo velike `|x|` je `p(x) ≈ aₙ xⁿ` (asimptotska enakovrednost na obeh
koncih: količnik gre proti 1).
trditev: MAT-SS-3/graf-polinoma#vodilni-clen-prevlada
besedilo: »$$p(x) \approx a_n x^n \quad \text{za zelo velike } |x|.$$« -/
theorem vodilni_clen_prevlada (p : ℝ[X]) :
    Asymptotics.IsEquivalent atTop (fun x => p.eval x) (fun x => p.leadingCoeff * x ^ p.natDegree) ∧
    Asymptotics.IsEquivalent atBot (fun x => p.eval x) (fun x => p.leadingCoeff * x ^ p.natDegree) :=
  ⟨p.isEquivalent_atTop_lead, p.isEquivalent_atBot_lead⟩

/-- Razlaga 6 in Povzetek: graf seka os `y` v točki `(0, p(0))`, `p(0)` je prosti člen.
trditev: MAT-SS-3/graf-polinoma#presecisce-y
besedilo: »Presečišče z osjo $y$.** To je točka $(0, p(0))$, kjer je $p(0)$ prosti člen.« -/
theorem presecisce_y (p : ℝ[X]) : p.eval 0 = p.coeff 0 := (coeff_zero_eq_eval_zero p).symm

/-- Razlaga 8 in Preveri se 6: polinom stopnje največ `n` je določen z vrednostmi v `n + 1` različnih točkah.
trditev: MAT-SS-3/graf-polinoma#dolocen-s-tockami
besedilo: »Polinom stopnje $n$ ima $n + 1$ koeficientov, zato ga določa $n + 1$ točk z različnimi $x$.« -/
theorem dolocen_s_tockami (n : ℕ) (f g : ℝ[X]) (s : Finset ℝ) (hs : s.card = n + 1)
    (hf : f.natDegree ≤ n) (hg : g.natDegree ≤ n) (h : ∀ x ∈ s, f.eval x = g.eval x) : f = g := by
  apply eq_of_degrees_lt_of_eval_finset_eq s _ _ h
  · rw [hs]; exact (degree_le_of_natDegree_le hf).trans_lt (by exact_mod_cast Nat.lt_succ_self n)
  · rw [hs]; exact (degree_le_of_natDegree_le hg).trans_lt (by exact_mod_cast Nat.lt_succ_self n)

/-- Predpostavke trditve `dolocen_s_tockami` se dajo izpolniti (`f = g = 0`, `n = 0`, `s = {0}`). -/
example : ({0} : Finset ℝ).card = 0 + 1 ∧ (0 : ℝ[X]).natDegree ≤ 0 ∧ (0 : ℝ[X]).natDegree ≤ 0 ∧
    ∀ x ∈ ({0} : Finset ℝ), (0 : ℝ[X]).eval x = (0 : ℝ[X]).eval x := by simp

/-- Predpostavke trditve `dolocen_s_tockami` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ({0} : Finset ℝ).card = 0 + 1 ∧ (0 : ℝ[X]).natDegree ≤ 0 ∧ (0 : ℝ[X]).natDegree ≤ 0 ∧ ∀ x ∈ ({0} : Finset ℝ), (0 : ℝ[X]).eval x = (0 : ℝ[X]).eval x := by simp
  dolocen_s_tockami (hs := w.1) (hf := w.2.1) (hg := w.2.2.1) (h := w.2.2.2)

/-- Razlaga 8: za `n + 1` različnih točk in poljubne vrednosti obstaja polinom stopnje največ `n`, ki ima v
teh točkah dane vrednosti (Lagrangeev interpolacijski polinom).
trditev: MAT-SS-3/graf-polinoma#obstaja-skozi-tocke
besedilo: »Polinom stopnje $n$ ima $n + 1$ koeficientov, zato ga določa $n + 1$ točk z različnimi $x$.« -/
theorem obstaja_skozi_tocke (n : ℕ) (s : Finset ℝ) (hs : s.card = n + 1) (v : ℝ → ℝ) :
    ∃ f : ℝ[X], f.natDegree ≤ n ∧ ∀ x ∈ s, f.eval x = v x := by
  classical
  have hinj : Set.InjOn id (s : Set ℝ) := Set.injOn_id _
  refine ⟨Lagrange.interpolate s id v, ?_, fun x hx => Lagrange.eval_interpolate_at_node v hinj hx⟩
  have hd := Lagrange.degree_interpolate_lt v hinj
  rw [hs] at hd
  exact natDegree_le_iff_degree_le.mpr (Order.le_of_lt_succ (by exact_mod_cast hd))

/-- Predpostavke trditve `obstaja_skozi_tocke` se dajo izpolniti (`n = 0`, `s = {0}`). -/
example : ({0} : Finset ℝ).card = 0 + 1 := by simp

/-- Predpostavke trditve `obstaja_skozi_tocke` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ({0} : Finset ℝ).card = 0 + 1 := by simp
  obstaja_skozi_tocke (hs := w)

/-- Preveri se 6: s štirimi meritvami polinoma četrte stopnje ne določimo enolično: za vsak polinom stopnje 4
in vsake štiri točke obstaja drug polinom stopnje 4 z enakimi vrednostmi v teh točkah.
trditev: MAT-SS-3/graf-polinoma#stiri-ne-zadoscajo
besedilo: »4 | Polinom četrte stopnje ima pet koeficientov, od $a_4$ do $a_0$; vsaka meritev da le eno enačbo.« -/
theorem stiri_ne_zadoscajo (p : ℝ[X]) (hp : p.natDegree = 4) (t₁ t₂ t₃ t₄ : ℝ) :
    ∃ q : ℝ[X], q ≠ p ∧ q.natDegree = 4 ∧
      q.eval t₁ = p.eval t₁ ∧ q.eval t₂ = p.eval t₂ ∧ q.eval t₃ = p.eval t₃ ∧ q.eval t₄ = p.eval t₄ := by
  set r : ℝ[X] := (X - C t₁) * (X - C t₂) * (X - C t₃) * (X - C t₄) with hr
  have hrm : r.Monic := by
    simp only [hr]
    exact (((monic_X_sub_C _).mul (monic_X_sub_C _)).mul (monic_X_sub_C _)).mul (monic_X_sub_C _)
  have hrd : r.natDegree = 4 := by
    simp only [hr]
    rw [natDegree_mul, natDegree_mul, natDegree_mul] <;> simp [X_sub_C_ne_zero]
  have ha : p.leadingCoeff ≠ 0 := by
    rw [Ne, leadingCoeff_eq_zero]; rintro rfl; simp at hp
  refine ⟨p + C p.leadingCoeff * r, ?_, ?_, ?_⟩
  · intro h
    have : C p.leadingCoeff * r = 0 := by linear_combination h
    rcases mul_eq_zero.mp this with h1 | h1
    · exact ha (C_eq_zero.mp h1)
    · exact hrm.ne_zero h1
  · have hle : (p + C p.leadingCoeff * r).natDegree ≤ 4 :=
      natDegree_add_le_of_degree_le (hp ▸ le_rfl) ((natDegree_C_mul_le _ _).trans hrd.le)
    have hc : (p + C p.leadingCoeff * r).coeff 4 = 2 * p.leadingCoeff := by
      have h1 : r.coeff 4 = 1 := by rw [← hrd]; exact hrm.coeff_natDegree
      have h2 : p.coeff 4 = p.leadingCoeff := by rw [leadingCoeff, hp]
      rw [coeff_add, coeff_C_mul, h1, h2]; ring
    exact le_antisymm hle (le_natDegree_of_ne_zero (by rw [hc]; exact mul_ne_zero two_ne_zero ha))
  · simp [hr]

/-- Predpostavke trditve `stiri_ne_zadoscajo` se dajo izpolniti (`x⁴` ima stopnjo 4). -/
example : (X ^ 4 : ℝ[X]).natDegree = 4 := natDegree_X_pow 4

/-- Predpostavke trditve `stiri_ne_zadoscajo` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (X ^ 4 : ℝ[X]).natDegree = 4 := natDegree_X_pow 4
  stiri_ne_zadoscajo (hp := w)

/-- Bolj natančno: polinom lihe stopnje ima vsaj eno realno ničlo.
trditev: MAT-SS-3/graf-polinoma#liha-stopnja
besedilo: »Še dve dejstvi.** Polinom lihe stopnje ima vedno vsaj eno realno ničlo,« -/
theorem liha_stopnja (p : ℝ[X]) (hp : Odd p.natDegree) : ∃ x : ℝ, p.eval x = 0 :=
  IsRealClosed.exists_isRoot_of_odd_natDegree hp

/-- Predpostavke trditve `liha_stopnja` se dajo izpolniti (`x` ima stopnjo 1). -/
example : Odd (X : ℝ[X]).natDegree := by rw [natDegree_X]; exact odd_one

/-- Predpostavke trditve `liha_stopnja` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Odd (X : ℝ[X]).natDegree := by rw [natDegree_X]; exact odd_one
  liha_stopnja (hp := w)

/-- Pomožna trditev: kvadrat neničelnega števila je pozitiven.
pomozno -/
theorem kvadrat_pozitiven (y : ℝ) (h : y ≠ 0) : 0 < y ^ 2 :=
  lt_of_le_of_ne (sq_nonneg y) (Ne.symm (pow_ne_zero 2 h))

/-- Predpostavke trditve `kvadrat_pozitiven` se dajo izpolniti (`y = 1`). -/
example : (1:ℝ) ≠ 0 := one_ne_zero

/-- Pomožna trditev: stopnja ničle `a` v `(x − b)ⁿ` je `n`, če `a = b`, sicer 0.
pomozno -/
theorem stopnja_v_potenci (a b : ℝ) (n : ℕ) :
    rootMultiplicity a ((X - C b) ^ n) = if a = b then n else 0 := by
  split_ifs with h
  · subst h; exact rootMultiplicity_X_sub_C_pow a n
  · apply rootMultiplicity_eq_zero
    simp [IsRoot, sub_eq_zero, h]

/-- Pomožna trditev: če moničen `q` deli `p ≠ 0` in `p` nima višje stopnje od `q`, je `p = a·q`.
pomozno -/
theorem enolicen_iz_deljivosti (p q : ℝ[X]) (hq : q.Monic) (hdvd : q ∣ p) (hp : p ≠ 0)
    (hd : p.natDegree ≤ q.natDegree) : ∃ a : ℝ, p = C a * q := by
  obtain ⟨r, rfl⟩ := hdvd
  have hr : r ≠ 0 := right_ne_zero_of_mul hp
  rw [hq.natDegree_mul' hr] at hd
  have hr0 : r.natDegree = 0 := by omega
  refine ⟨r.coeff 0, ?_⟩
  rw [mul_comm, ← eq_C_of_natDegree_eq_zero hr0]

/-- Predpostavke trditve `enolicen_iz_deljivosti` se dajo izpolniti (`p = q = x`). -/
example : (X : ℝ[X]).Monic ∧ (X : ℝ[X]) ∣ X ∧ (X : ℝ[X]) ≠ 0 := ⟨monic_X, dvd_rfl, X_ne_zero⟩

/-! ## Zakaj se tega učimo (uganka) in razlaga -/

/-- Uganka: `T(t) = −0,04 (t − 2)(t − 7)²`; ob 18.00 `T(0) = 3,92`, ob 20.00 `T(2) = 0`, ob 1.00 `T(7) = 0`;
rešitev uganke: `T(5) = −0,04·3·4 = −0,48`.
trditev: MAT-SS-3/graf-polinoma#uganka-vrednosti
besedilo: »$T(5) = -0{,}04 \cdot 3 \cdot 4 = -0{,}48$« -/
theorem uganka_vrednosti :
    (-0.04:ℝ) * (0 - 2) * (0 - 7) ^ 2 = 3.92 ∧ (-0.04:ℝ) * (2 - 2) * (2 - 7) ^ 2 = 0 ∧
    (-0.04:ℝ) * (7 - 2) * (7 - 7) ^ 2 = 0 ∧
    (-0.04:ℝ) * (5 - 2) * (5 - 7) ^ 2 = -0.04 * 3 * 4 ∧ (-0.04:ℝ) * 3 * 4 = -0.48 := by norm_num

/-- Rešitev uganke: na `(2, 7)` in na `(7, 10]` je temperatura negativna, pri `t = 7` natanko 0; po 1.00 se
do 4.00 ni otoplilo nad ledišče (`T(t) ≤ 0` za `7 ≤ t ≤ 10`).
trditev: MAT-SS-3/graf-polinoma#uganka-resitev
besedilo: »Rešitev uganke.** V modelu $T(t) = -0{,}04\,(t - 2)(t - 7)^2$ je $t = 7$ ničla stopnje $2$.« -/
theorem uganka_resitev :
    (∀ t : ℝ, 2 < t → t < 7 → (-0.04:ℝ) * (t - 2) * (t - 7) ^ 2 < 0) ∧
    (∀ t : ℝ, 7 < t → t ≤ 10 → (-0.04:ℝ) * (t - 2) * (t - 7) ^ 2 < 0) ∧
    (∀ t : ℝ, 7 ≤ t → t ≤ 10 → (-0.04:ℝ) * (t - 2) * (t - 7) ^ 2 ≤ 0) := by
  refine ⟨fun t h1 h2 => ?_, fun t h1 _ => ?_, fun t h1 _ => ?_⟩
  · exact mul_neg_of_neg_of_pos (mul_neg_of_neg_of_pos (by norm_num) (by linarith))
      (kvadrat_pozitiven _ (by linarith))
  · exact mul_neg_of_neg_of_pos (mul_neg_of_neg_of_pos (by norm_num) (by linarith))
      (kvadrat_pozitiven _ (by linarith))
  · exact mul_nonpos_of_nonpos_of_nonneg (mul_nonpos_of_nonpos_of_nonneg (by norm_num) (by linarith))
      (sq_nonneg _)

/-- Razlaga 1, preizkus: `p(x) = 2(x + 1)(x − 4)` ima ničli natanko −1 in 4.
trditev: MAT-SS-3/graf-polinoma#preizkus1
besedilo: »Preizkus:* katere ničle ima $p(x) = 2(x + 1)(x - 4)$? *Odgovor:* $x = -1$ in $x = 4$.« -/
theorem preizkus1 (x : ℝ) : 2 * (x + 1) * (x - 4) = 0 ↔ x = -1 ∨ x = 4 := by
  constructor
  · intro h
    rcases mul_eq_zero.mp h with h1 | h1
    · rcases mul_eq_zero.mp h1 with h2 | h2
      · norm_num at h2
      · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Razlaga 2, preizkus: med −1 in 4 je `2(x + 1)(x − 4)` negativen; testna točka `x = 0` da `2·1·(−4) = −8`.
trditev: MAT-SS-3/graf-polinoma#preizkus2
besedilo: »Preizkus:* kakšen predznak ima $p(x) = 2(x + 1)(x - 4)$ med $-1$ in $4$? *Odgovor:* testna točka $x = 0$ da $2 \cdot 1 \cdot (-4) = -8$, torej negativen.« -/
theorem preizkus2 : 2 * ((0:ℝ) + 1) * (0 - 4) = 2 * 1 * (-4) ∧ (2:ℝ) * 1 * (-4) = -8 ∧
    ∀ x : ℝ, -1 < x → x < 4 → 2 * (x + 1) * (x - 4) < 0 := by
  refine ⟨by norm_num, by norm_num, fun x h1 h2 => ?_⟩
  exact mul_neg_of_pos_of_neg (by linarith) (by linarith)

/-- Razlaga 3, premisli: `q(x) = x²(x − 3)` je pod osjo pri 1 in tudi pri −1: `q(−1) = 1·(−4) = −4`.
trditev: MAT-SS-3/graf-polinoma#premisli-q
besedilo: »Graf polinoma $q(x) = x^2(x - 3)$ je pri $x = 1$ pod osjo $x$.« -/
theorem premisli_q : (1:ℝ) ^ 2 * (1 - 3) < 0 ∧ (-1:ℝ) ^ 2 * (-1 - 3) = 1 * (-4) ∧ (1:ℝ) * (-4) = -4 := by
  norm_num

/-- Razlaga 4, preizkus: `p(x) = −3x(x − 2)²` ima stopnjo `1 + 2 = 3` in vodilni koeficient −3.
trditev: MAT-SS-3/graf-polinoma#preizkus4
besedilo: »Preizkus:* stopnja in vodilni koeficient polinoma $p(x) = -3x(x - 2)^2$? *Odgovor:* stopnja $1 + 2 = 3$, vodilni koeficient $-3$.« -/
theorem preizkus4 : (-3 * X * (X - 2) ^ 2 : ℝ[X]).natDegree = 1 + 2 ∧
    (-3 * X * (X - 2) ^ 2 : ℝ[X]).leadingCoeff = -3 := by
  have e : (-3 * X * (X - 2) ^ 2 : ℝ[X]) = -3 * X ^ 3 + 12 * X ^ 2 - 12 * X := by ring
  have hd : (-3 * X ^ 3 + 12 * X ^ 2 - 12 * X : ℝ[X]).natDegree = 3 := by compute_degree!
  rw [e, hd]
  refine ⟨rfl, ?_⟩
  rw [leadingCoeff, hd]; simp [coeff_X]

/-- Razlaga 5, tabela: `p(x) = x³ − 10x² + 5` ima `p(10) = 5`, `p(100) = 900 005`, `p(1000) = 990 000 005`;
pri `x = 1000` se `p(x)` in `x³` razlikujeta za manj kot odstotek.
trditev: MAT-SS-3/graf-polinoma#tabela-krakov
besedilo: »$p(x) = x^3 - 10x^2 + 5$« -/
theorem tabela_krakov : (10:ℝ) ^ 3 - 10 * 10 ^ 2 + 5 = 5 ∧ (100:ℝ) ^ 3 - 10 * 100 ^ 2 + 5 = 900005 ∧
    (1000:ℝ) ^ 3 - 10 * 1000 ^ 2 + 5 = 990000005 ∧ (100:ℝ) ^ 3 = 10 ^ 6 ∧ (1000:ℝ) ^ 3 = 10 ^ 9 ∧
    ((10:ℝ) ^ 9 - 990000005) / 10 ^ 9 < 1 / 100 := by norm_num

/-- Razlaga 5, premisli: `p(x) = 7 + 2x − x⁴` ima stopnjo 4 in vodilni koeficient −1, zato gresta oba kraka
v `−∞`.
trditev: MAT-SS-3/graf-polinoma#premisli-kraka
besedilo: »Oba navzdol, levo in desno $-\infty$. Vodilni člen je $-x^4$: stopnja $4$ je soda, vodilni koeficient $-1$ negativen. Prosti člen $7$ na kraka ne vpliva, pa čeprav je zapisan prvi.« -/
theorem premisli_kraka :
    (7 + 2 * X - X ^ 4 : ℝ[X]).natDegree = 4 ∧ (7 + 2 * X - X ^ 4 : ℝ[X]).leadingCoeff = -1 ∧
    Tendsto (fun x => (7 + 2 * X - X ^ 4 : ℝ[X]).eval x) atBot atBot ∧
    Tendsto (fun x => (7 + 2 * X - X ^ 4 : ℝ[X]).eval x) atTop atBot := by
  have hd : (7 + 2 * X - X ^ 4 : ℝ[X]).natDegree = 4 := by compute_degree!
  have hl : (7 + 2 * X - X ^ 4 : ℝ[X]).leadingCoeff = -1 := by
    rw [leadingCoeff, hd]; simp [coeff_X]
  refine ⟨hd, hl, (kraka _ (by rw [hd]; norm_num)).2.1 (by rw [hd]; decide) (by rw [hl]; norm_num)⟩

/-! ## Rešeni primeri -/

/-- Primer 1, korak 1: ničle `(x + 2)(x − 1)²(x − 3)` so −2, 1 in 3.
trditev: MAT-SS-3/graf-polinoma#primer1-nicle
besedilo: »$p(x) = (x + 2)(x - 1)^2(x - 3)$« -/
theorem primer1_nicle (x : ℝ) : (x + 2) * (x - 1) ^ 2 * (x - 3) = 0 ↔ x = -2 ∨ x = 1 ∨ x = 3 := by
  constructor
  · intro h
    rcases mul_eq_zero.mp h with h1 | h1
    · rcases mul_eq_zero.mp h1 with h2 | h2
      · left; linarith
      · right; left; have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h2; linarith
    · right; right; linarith
  · rintro (rfl | rfl | rfl) <;> norm_num

/-- Primer 1, korak 1: stopnje ničel −2, 1, 3 so 1, 2, 1.
trditev: MAT-SS-3/graf-polinoma#primer1-stopnje
besedilo: »Ničle: $-2$ (stopnja $1$), $1$ (stopnja $2$), $3$ (stopnja $1$), ker vsak faktor da svojo ničlo.« -/
theorem primer1_stopnje :
    rootMultiplicity (-2) ((X - C (-2)) * (X - C 1) ^ 2 * (X - C 3) : ℝ[X]) = 1 ∧
    rootMultiplicity 1 ((X - C (-2)) * (X - C 1) ^ 2 * (X - C 3) : ℝ[X]) = 2 ∧
    rootMultiplicity 3 ((X - C (-2)) * (X - C 1) ^ 2 * (X - C 3) : ℝ[X]) = 1 := by
  have h0 : ((X - C (-2)) * (X - C 1) ^ 2 * (X - C 3) : ℝ[X]) ≠ 0 :=
    mul_ne_zero (mul_ne_zero (X_sub_C_ne_zero _) (pow_ne_zero _ (X_sub_C_ne_zero _))) (X_sub_C_ne_zero _)
  have h1 := left_ne_zero_of_mul h0
  refine ⟨?_, ?_, ?_⟩ <;>
    (rw [rootMultiplicity_mul h0, rootMultiplicity_mul h1, stopnja_v_potenci,
      rootMultiplicity_X_sub_C, rootMultiplicity_X_sub_C]; norm_num)

/-- Primer 1, korak 2: stopnja je `1 + 2 + 1 = 4`, vodilni koeficient 1, zato gresta oba kraka v `+∞`.
trditev: MAT-SS-3/graf-polinoma#primer1-kraka
besedilo: »Stopnja polinoma je $1 + 2 + 1 = 4$, vodilni koeficient $1$. Soda stopnja in pozitiven koeficient: oba kraka gresta v $+\infty$.« -/
theorem primer1_kraka :
    ((X - C (-2)) * (X - C 1) ^ 2 * (X - C 3) : ℝ[X]).natDegree = 1 + 2 + 1 ∧
    ((X - C (-2)) * (X - C 1) ^ 2 * (X - C 3) : ℝ[X]).leadingCoeff = 1 ∧
    Tendsto (fun x => ((X - C (-2)) * (X - C 1) ^ 2 * (X - C 3) : ℝ[X]).eval x) atBot atTop ∧
    Tendsto (fun x => ((X - C (-2)) * (X - C 1) ^ 2 * (X - C 3) : ℝ[X]).eval x) atTop atTop := by
  have hd : ((X - C (-2)) * (X - C 1) ^ 2 * (X - C 3) : ℝ[X]).natDegree = 1 + 2 + 1 := by
    rw [natDegree_mul (mul_ne_zero (X_sub_C_ne_zero _) (pow_ne_zero _ (X_sub_C_ne_zero _)))
      (X_sub_C_ne_zero _), natDegree_mul (X_sub_C_ne_zero _) (pow_ne_zero _ (X_sub_C_ne_zero _)),
      natDegree_pow, natDegree_X_sub_C, natDegree_X_sub_C, natDegree_X_sub_C]
  have hl : ((X - C (-2)) * (X - C 1) ^ 2 * (X - C 3) : ℝ[X]).leadingCoeff = 1 :=
    (((monic_X_sub_C _).mul ((monic_X_sub_C _).pow 2)).mul (monic_X_sub_C _)).leadingCoeff
  refine ⟨hd, hl, (kraka _ (by rw [hd]; norm_num)).1 (by rw [hd]; decide) (by rw [hl]; norm_num)⟩

/-- Primer 1, koraki 3–5: `p(0) = 2·1·(−3) = −6`; predznaki: za `x > 3` pozitiven, na `(1, 3)` negativen,
na `(−2, 1)` negativen, za `x < −2` pozitiven; preizkus `p(2) = 4·1·(−1) = −4 < 0`.
trditev: MAT-SS-3/graf-polinoma#primer1-predznaki
besedilo: »Predznaki od desne proti levi: za $x > 3$ pozitiven (desni krak). Pri $3$ (liha) se zamenja: med $1$ in $3$ negativen. Pri $1$ (soda) ostane: med $-2$ in $1$ negativen. Pri $-2$ (liha) se zamenja: za $x < -2$ pozitiven.« -/
theorem primer1_predznaki :
    ((0:ℝ) + 2) * (0 - 1) ^ 2 * (0 - 3) = 2 * 1 * (-3) ∧ (2:ℝ) * 1 * (-3) = -6 ∧
    (∀ x : ℝ, 3 < x → 0 < (x + 2) * (x - 1) ^ 2 * (x - 3)) ∧
    (∀ x : ℝ, 1 < x → x < 3 → (x + 2) * (x - 1) ^ 2 * (x - 3) < 0) ∧
    (∀ x : ℝ, -2 < x → x < 1 → (x + 2) * (x - 1) ^ 2 * (x - 3) < 0) ∧
    (∀ x : ℝ, x < -2 → 0 < (x + 2) * (x - 1) ^ 2 * (x - 3)) ∧
    ((2:ℝ) + 2) * (2 - 1) ^ 2 * (2 - 3) = 4 * 1 * (-1) ∧ (4:ℝ) * 1 * (-1) = -4 := by
  refine ⟨by norm_num, by norm_num, fun x h => ?_, fun x h1 h2 => ?_, fun x h1 h2 => ?_, fun x h => ?_,
    by norm_num, by norm_num⟩
  · exact mul_pos (mul_pos (by linarith) (kvadrat_pozitiven _ (by linarith))) (by linarith)
  · exact mul_neg_of_pos_of_neg (mul_pos (by linarith) (kvadrat_pozitiven _ (by linarith))) (by linarith)
  · exact mul_neg_of_pos_of_neg (mul_pos (by linarith) (kvadrat_pozitiven _ (by linarith))) (by linarith)
  · exact mul_pos_of_neg_of_neg (mul_neg_of_neg_of_pos (by linarith) (kvadrat_pozitiven _ (by linarith)))
      (by linarith)

/-- Primer 2, korak 1: kandidati za cele ničle so delitelji −20: `±1, ±2, ±4, ±5, ±10, ±20`.
trditev: MAT-SS-3/graf-polinoma#primer2-kandidati
besedilo: »Kandidati za cele ničle: $\pm 1, \pm 2, \pm 4, \pm 5, \pm 10, \pm 20$.« -/
theorem primer2_kandidati (a : ℤ) :
    a ∣ -20 ↔ a ∈ ({1, -1, 2, -2, 4, -4, 5, -5, 10, -10, 20, -20} : Finset ℤ) := by
  constructor
  · intro h
    have h' := dvd_neg.mp h
    have h1 := Int.le_of_dvd (by norm_num) h'
    have h2 := Int.le_of_dvd (by norm_num) (neg_dvd.mpr h')
    have h3 : -20 ≤ a := by linarith
    interval_cases a <;> simp_all
  · intro h; simp only [Finset.mem_insert, Finset.mem_singleton] at h
    rcases h with rfl | rfl | rfl | rfl | rfl | rfl | rfl | rfl | rfl | rfl | rfl | rfl <;> norm_num

/-- Primer 2, koraki 1–3: `v(1) = 1 − 9 + 24 − 20 = −4`, `v(2) = 8 − 36 + 48 − 20 = 0`; Horner z 2: 1, −7, 10,
ostanek 0; `d² − 7d + 10 = (d − 2)(d − 5)` in `v(d) = (d − 2)²(d − 5)`.
trditev: MAT-SS-3/graf-polinoma#primer2-razcep
besedilo: »Kandidati za cele ničle: $\pm 1, \pm 2, \pm 4, \pm 5, \pm 10, \pm 20$. Velja $v(1) = 1 - 9 + 24 - 20 = -4$, $v(2) = 8 - 36 + 48 - 20 = 0$. Ničla je $2$.« -/
theorem primer2_razcep :
    (1:ℝ) ^ 3 - 9 * 1 ^ 2 + 24 * 1 - 20 = 1 - 9 + 24 - 20 ∧ (1:ℝ) - 9 + 24 - 20 = -4 ∧
    (2:ℝ) ^ 3 - 9 * 2 ^ 2 + 24 * 2 - 20 = 8 - 36 + 48 - 20 ∧ (8:ℝ) - 36 + 48 - 20 = 0 ∧
    (1:ℝ) * 2 - 9 = -7 ∧ (-7:ℝ) * 2 + 24 = 10 ∧ (10:ℝ) * 2 - 20 = 0 ∧
    (∀ d : ℝ, d ^ 3 - 9 * d ^ 2 + 24 * d - 20 = (d - 2) * (d ^ 2 - 7 * d + 10)) ∧
    (∀ d : ℝ, d ^ 2 - 7 * d + 10 = (d - 2) * (d - 5)) ∧
    (∀ d : ℝ, d ^ 3 - 9 * d ^ 2 + 24 * d - 20 = (d - 2) ^ 2 * (d - 5)) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    fun d => by ring, fun d => by ring, fun d => by ring⟩

/-- Primer 2, korak 3: ničla 2 ima stopnjo 2, ničla 5 stopnjo 1.
trditev: MAT-SS-3/graf-polinoma#primer2-stopnje
besedilo: »Razcep: $v(d) = (d - 2)^2(d - 5)$. Ničla $2$ ima stopnjo $2$, ničla $5$ stopnjo $1$.« -/
theorem primer2_stopnje :
    rootMultiplicity 2 ((X - C 2) ^ 2 * (X - C 5) : ℝ[X]) = 2 ∧
    rootMultiplicity 5 ((X - C 2) ^ 2 * (X - C 5) : ℝ[X]) = 1 := by
  have h0 : ((X - C 2) ^ 2 * (X - C 5) : ℝ[X]) ≠ 0 :=
    mul_ne_zero (pow_ne_zero _ (X_sub_C_ne_zero _)) (X_sub_C_ne_zero _)
  constructor <;>
    (rw [rootMultiplicity_mul h0, stopnja_v_potenci, rootMultiplicity_X_sub_C]; norm_num)

/-- Primer 2, koraki 4–6: za `0 ≤ d ≤ 7` je gladina nad običajno višino natanko za `5 < d ≤ 7`; preizkus
`v(3) = 1·(−2) = −2`, `v(0) = −20`; pri `d = 2` je odmik 0, okoli nje negativen.
trditev: MAT-SS-3/graf-polinoma#primer2-odgovor
besedilo: »Cerkniško jezero presiha: gladina se hitro dviga in spušča. Odmik gladine od običajne višine (v cm) $d$ dni po začetku merjenja opisuje model $v(d) = d^3 - 9d^2 + 24d - 20$, ki velja za $0 \le d \le 7$. Kdaj je gladina nad običajno višino?« -/
theorem primer2_odgovor :
    (∀ d : ℝ, 0 ≤ d → d ≤ 7 → (0 < d ^ 3 - 9 * d ^ 2 + 24 * d - 20 ↔ 5 < d)) ∧
    (∀ d : ℝ, 0 ≤ d → d < 5 → d ≠ 2 → d ^ 3 - 9 * d ^ 2 + 24 * d - 20 < 0) ∧
    ((3:ℝ) - 2) ^ 2 * (3 - 5) = 1 * (-2) ∧ (1:ℝ) * (-2) = -2 ∧ (0:ℝ) ^ 3 - 9 * 0 ^ 2 + 24 * 0 - 20 = -20 := by
  refine ⟨fun d _ _ => ?_, fun d _ h5 h2 => ?_, by norm_num, by norm_num, by norm_num⟩
  · rw [show d ^ 3 - 9 * d ^ 2 + 24 * d - 20 = (d - 2) ^ 2 * (d - 5) by ring]
    constructor
    · intro h
      by_contra hd
      have : (d - 2) ^ 2 * (d - 5) ≤ 0 := mul_nonpos_of_nonneg_of_nonpos (sq_nonneg _) (by linarith)
      linarith
    · intro h
      exact mul_pos (kvadrat_pozitiven _ (by linarith)) (by linarith)
  · rw [show d ^ 3 - 9 * d ^ 2 + 24 * d - 20 = (d - 2) ^ 2 * (d - 5) by ring]
    exact mul_neg_of_pos_of_neg (kvadrat_pozitiven _ (sub_ne_zero.mpr h2)) (by linarith)

/-- Primer 3, koraka 3 in premisli: `p(0) = a·1·4·(−4) = −16a = 8` natanko pri `a = −0,5`.
trditev: MAT-SS-3/graf-polinoma#primer3-a
besedilo: »Iz $-16a = 8$ sledi $a = -0{,}5$. Stopnja $4$ je soda, vodilni koeficient $-0{,}5$ negativen, zato gresta oba kraka v $-\infty$. Polinom: $p(x) = -0{,}5\,(x + 1)(x - 2)^2(x - 4)$.« -/
theorem primer3_a (a : ℝ) : a * (0 + 1) * (0 - 2) ^ 2 * (0 - 4) = a * 1 * 4 * (-4) ∧
    a * 1 * 4 * (-4) = -16 * a ∧ (-16 * a = 8 ↔ a = -0.5) := by
  refine ⟨by ring, by ring, ?_⟩
  constructor <;> intro h <;> norm_num at * <;> linarith

/-- Primer 3, koraki 1 in 2 (najmanjša stopnja in enoličnost): če graf polinoma `p ≠ 0` seka os pri −1 in 4
(faktorja `x + 1`, `x − 4`) in se je dotakne pri 2 (faktor `(x − 2)²`), ima `p` stopnjo vsaj 4; pri stopnji 4
in `p(0) = 8` je `p(x) = −0,5 (x + 1)(x − 2)²(x − 4)`.
trditev: MAT-SS-3/graf-polinoma#primer3-polinom
besedilo: »Iz $-16a = 8$ sledi $a = -0{,}5$. Stopnja $4$ je soda, vodilni koeficient $-0{,}5$ negativen, zato gresta oba kraka v $-\infty$. Polinom: $p(x) = -0{,}5\,(x + 1)(x - 2)^2(x - 4)$.« -/
theorem primer3_polinom (p : ℝ[X]) (hp : p ≠ 0) (h1 : X - C (-1) ∣ p) (h2 : (X - C 2) ^ 2 ∣ p)
    (h4 : X - C 4 ∣ p) :
    4 ≤ p.natDegree ∧ (p.natDegree = 4 → p.eval 0 = 8 →
      p = C (-0.5) * ((X - C (-1)) * (X - C 2) ^ 2 * (X - C 4))) := by
  have hc : ∀ a b : ℝ, a ≠ b → IsCoprime (X - C a) (X - C b) := fun a b hab =>
    isCoprime_X_sub_C_of_isUnit_sub (isUnit_iff_ne_zero.mpr (sub_ne_zero.mpr hab))
  have hc12 : IsCoprime (X - C (-1) : ℝ[X]) ((X - C 2) ^ 2) := (hc (-1) 2 (by norm_num)).pow_right
  have hc4 : IsCoprime ((X - C (-1)) * (X - C 2) ^ 2 : ℝ[X]) (X - C 4) :=
    IsCoprime.mul_left (hc (-1) 4 (by norm_num)) ((hc 2 4 (by norm_num)).pow_left)
  have hdvd : (X - C (-1)) * (X - C 2) ^ 2 * (X - C 4) ∣ p := hc4.mul_dvd (hc12.mul_dvd h1 h2) h4
  have hm : ((X - C (-1)) * (X - C 2) ^ 2 * (X - C 4) : ℝ[X]).Monic :=
    ((monic_X_sub_C _).mul ((monic_X_sub_C _).pow _)).mul (monic_X_sub_C _)
  have hd : ((X - C (-1)) * (X - C 2) ^ 2 * (X - C 4) : ℝ[X]).natDegree = 4 := by
    rw [natDegree_mul (mul_ne_zero (X_sub_C_ne_zero _) (pow_ne_zero _ (X_sub_C_ne_zero _)))
      (X_sub_C_ne_zero _), natDegree_mul (X_sub_C_ne_zero _) (pow_ne_zero _ (X_sub_C_ne_zero _)),
      natDegree_pow, natDegree_X_sub_C, natDegree_X_sub_C, natDegree_X_sub_C]
  refine ⟨hd ▸ natDegree_le_of_dvd hdvd hp, fun hp4 h0 => ?_⟩
  obtain ⟨a, ha⟩ := enolicen_iz_deljivosti p _ hm hdvd hp (by rw [hp4, hd])
  rw [ha] at h0 ⊢
  simp at h0
  congr 2
  norm_num at h0 ⊢
  linarith

/-- Predpostavke trditve `primer3_polinom` se dajo izpolniti (`p = −0,5 (x + 1)(x − 2)²(x − 4)`). -/
example : (C (-0.5) * ((X - C (-1)) * (X - C 2) ^ 2 * (X - C 4)) : ℝ[X]) ≠ 0 ∧
    X - C (-1) ∣ (C (-0.5) * ((X - C (-1)) * (X - C 2) ^ 2 * (X - C 4)) : ℝ[X]) ∧
    (X - C 2) ^ 2 ∣ (C (-0.5) * ((X - C (-1)) * (X - C 2) ^ 2 * (X - C 4)) : ℝ[X]) ∧
    X - C 4 ∣ (C (-0.5) * ((X - C (-1)) * (X - C 2) ^ 2 * (X - C 4)) : ℝ[X]) := by
  refine ⟨mul_ne_zero (by norm_num) (mul_ne_zero (mul_ne_zero (X_sub_C_ne_zero _)
    (pow_ne_zero _ (X_sub_C_ne_zero _))) (X_sub_C_ne_zero _)), ?_, ?_, ?_⟩
  · exact (dvd_mul_of_dvd_left (dvd_mul_right _ _) _).mul_left _
  · exact (dvd_mul_of_dvd_left (dvd_mul_left _ _) _).mul_left _
  · exact (dvd_mul_left _ _).mul_left _

/-- Predpostavke trditve `primer3_polinom` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (C (-0.5) * ((X - C (-1)) * (X - C 2) ^ 2 * (X - C 4)) : ℝ[X]) ≠ 0 ∧ X - C (-1) ∣ (C (-0.5) * ((X - C (-1)) * (X - C 2) ^ 2 * (X - C 4)) : ℝ[X]) ∧ (X - C 2) ^ 2 ∣ (C (-0.5) * ((X - C (-1)) * (X - C 2) ^ 2 * (X - C 4)) : ℝ[X]) ∧ X - C 4 ∣ (C (-0.5) * ((X - C (-1)) * (X - C 2) ^ 2 * (X - C 4)) : ℝ[X]) := by
    refine ⟨mul_ne_zero (by norm_num) (mul_ne_zero (mul_ne_zero (X_sub_C_ne_zero _)
      (pow_ne_zero _ (X_sub_C_ne_zero _))) (X_sub_C_ne_zero _)), ?_, ?_, ?_⟩
    · exact (dvd_mul_of_dvd_left (dvd_mul_right _ _) _).mul_left _
    · exact (dvd_mul_of_dvd_left (dvd_mul_left _ _) _).mul_left _
    · exact (dvd_mul_left _ _).mul_left _
  primer3_polinom (hp := w.1) (h1 := w.2.1) (h2 := w.2.2.1) (h4 := w.2.2.2)

/-- Primer 3, premisli: `p(x) = −0,5 (x + 1)(x − 2)²(x − 4)` ima stopnjo 4 in vodilni koeficient −0,5, zato
gresta oba kraka v `−∞`.
trditev: MAT-SS-3/graf-polinoma#primer3-kraka
besedilo: »Iz $-16a = 8$ sledi $a = -0{,}5$. Stopnja $4$ je soda, vodilni koeficient $-0{,}5$ negativen, zato gresta oba kraka v $-\infty$. Polinom: $p(x) = -0{,}5\,(x + 1)(x - 2)^2(x - 4)$.« -/
theorem primer3_kraka :
    (C (-0.5) * ((X - C (-1)) * (X - C 2) ^ 2 * (X - C 4)) : ℝ[X]).natDegree = 4 ∧
    (C (-0.5) * ((X - C (-1)) * (X - C 2) ^ 2 * (X - C 4)) : ℝ[X]).leadingCoeff = -0.5 ∧
    Tendsto (fun x => (C (-0.5) * ((X - C (-1)) * (X - C 2) ^ 2 * (X - C 4)) : ℝ[X]).eval x) atBot atBot ∧
    Tendsto (fun x => (C (-0.5) * ((X - C (-1)) * (X - C 2) ^ 2 * (X - C 4)) : ℝ[X]).eval x) atTop atBot := by
  have h := stopnja_iz_razcepa (-0.5) (by norm_num) [(-1, 1), (2, 2), (4, 1)]
  simp only [List.map_cons, List.map_nil, List.prod_cons, List.prod_nil, List.sum_cons, List.sum_nil,
    pow_one, mul_one] at h
  have e : ((X - C (-1)) * ((X - C 2) ^ 2 * (X - C 4)) : ℝ[X]) = (X - C (-1)) * (X - C 2) ^ 2 * (X - C 4) := by
    ring
  rw [e] at h
  obtain ⟨hd, hl⟩ := h
  refine ⟨hd, hl, (kraka _ (by rw [hd]; norm_num)).2.1 (by rw [hd]; decide) (by rw [hl]; norm_num)⟩

/-- Primer 4, koraki 1–3: iz `C(0) = 0` je `a₀ = 0`; sistem `a₃ + a₂ + a₁ = 25`, `4a₃ + 2a₂ + a₁ = 16`,
`9a₃ + 3a₂ + a₁ = 9` (po deljenju z 2 in 3), razlike `3a₃ + a₂ = −9`, `5a₃ + a₂ = −7`, `2a₃ = 2`, ima edino
rešitev `a₃ = 1`, `a₂ = −12`, `a₁ = 36`.
trditev: MAT-SS-3/graf-polinoma#primer4-sistem
besedilo: »Odštejemo zaporedni enačbi: $3a_3 + a_2 = -9$ in $5a_3 + a_2 = -7$. Od tod $2a_3 = 2$, torej $a_3 = 1$, $a_2 = -12$, $a_1 = 36$.« -/
theorem primer4_sistem (a₃ a₂ a₁ a₀ : ℝ) :
    (a₃ * 0 ^ 3 + a₂ * 0 ^ 2 + a₁ * 0 + a₀ = 0 ∧ a₃ * 1 ^ 3 + a₂ * 1 ^ 2 + a₁ * 1 + a₀ = 25 ∧
      a₃ * 2 ^ 3 + a₂ * 2 ^ 2 + a₁ * 2 + a₀ = 32 ∧ a₃ * 3 ^ 3 + a₂ * 3 ^ 2 + a₁ * 3 + a₀ = 27) ↔
    (a₃ = 1 ∧ a₂ = -12 ∧ a₁ = 36 ∧ a₀ = 0) := by
  constructor
  · rintro ⟨h0, h1, h2, h3⟩
    have ha0 : a₀ = 0 := by linarith
    have e1 : a₃ + a₂ + a₁ = 25 := by linarith
    have e2 : 4 * a₃ + 2 * a₂ + a₁ = 16 := by linarith
    have e3 : 9 * a₃ + 3 * a₂ + a₁ = 9 := by linarith
    have d1 : 3 * a₃ + a₂ = -9 := by linarith
    have d2 : 5 * a₃ + a₂ = -7 := by linarith
    have h2a : 2 * a₃ = 2 := by linarith
    have ha3 : a₃ = 1 := by linarith
    have ha2 : a₂ = -12 := by linarith
    exact ⟨ha3, ha2, by linarith, ha0⟩
  · rintro ⟨rfl, rfl, rfl, rfl⟩; norm_num

/-- Primer 4, koraka 4 in 5: `C(t) = t³ − 12t² + 36t = t(t − 6)²`; preizkus `C(4) = 4·4 = 16`.
trditev: MAT-SS-3/graf-polinoma#primer4-model
besedilo: »$C(t) = t^3 - 12t^2 + 36t = t\,(t - 6)^2$« -/
theorem primer4_model : (∀ t : ℝ, t ^ 3 - 12 * t ^ 2 + 36 * t = t * (t - 6) ^ 2) ∧
    (4:ℝ) * (4 - 6) ^ 2 = 4 * 4 ∧ (4:ℝ) * 4 = 16 := ⟨fun t => by ring, by norm_num, by norm_num⟩

/-- Primer 4 (enoličnost): polinom stopnje največ 3 skozi `(0, 0)`, `(1, 25)`, `(2, 32)`, `(3, 27)` je natanko
`t³ − 12t² + 36t`.
trditev: MAT-SS-3/graf-polinoma#primer4-enolicnost
besedilo: »Podatki:** meritve $(0, 0)$, $(1, 25)$, $(2, 32)$, $(3, 27)$, kontrolna $(4, 16)$; polinom tretje stopnje« -/
theorem primer4_enolicnost (f : ℝ[X]) (hf : f.natDegree ≤ 3) (h0 : f.eval 0 = 0) (h1 : f.eval 1 = 25)
    (h2 : f.eval 2 = 32) (h3 : f.eval 3 = 27) : f = X ^ 3 - 12 * X ^ 2 + 36 * X := by
  apply dolocen_s_tockami 3 f _ {0, 1, 2, 3} (by norm_num) hf (by compute_degree!)
  intro x hx
  simp only [Finset.mem_insert, Finset.mem_singleton] at hx
  rcases hx with rfl | rfl | rfl | rfl <;> simp [h0, h1, h2, h3] <;> norm_num

/-- Predpostavke trditve `primer4_enolicnost` se dajo izpolniti (`f = t³ − 12t² + 36t`). -/
example : (X ^ 3 - 12 * X ^ 2 + 36 * X : ℝ[X]).natDegree ≤ 3 ∧
    (X ^ 3 - 12 * X ^ 2 + 36 * X : ℝ[X]).eval 0 = 0 ∧ (X ^ 3 - 12 * X ^ 2 + 36 * X : ℝ[X]).eval 1 = 25 ∧
    (X ^ 3 - 12 * X ^ 2 + 36 * X : ℝ[X]).eval 2 = 32 ∧ (X ^ 3 - 12 * X ^ 2 + 36 * X : ℝ[X]).eval 3 = 27 := by
  refine ⟨by compute_degree!, by simp, by simp; norm_num, by simp; norm_num, by simp; norm_num⟩

/-- Predpostavke trditve `primer4_enolicnost` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (X ^ 3 - 12 * X ^ 2 + 36 * X : ℝ[X]).natDegree ≤ 3 ∧ (X ^ 3 - 12 * X ^ 2 + 36 * X : ℝ[X]).eval 0 = 0 ∧ (X ^ 3 - 12 * X ^ 2 + 36 * X : ℝ[X]).eval 1 = 25 ∧ (X ^ 3 - 12 * X ^ 2 + 36 * X : ℝ[X]).eval 2 = 32 ∧ (X ^ 3 - 12 * X ^ 2 + 36 * X : ℝ[X]).eval 3 = 27 := by
    refine ⟨by compute_degree!, by simp, by simp; norm_num, by simp; norm_num, by simp; norm_num⟩
  primer4_enolicnost (hf := w.1) (h0 := w.2.1) (h1 := w.2.2.1) (h2 := w.2.2.2.1) (h3 := w.2.2.2.2)

/-- Primer 4, koraka 6 in 7: `C(t) = 0` natanko pri `t = 0` in `t = 6` (6 je ničla stopnje 2); na `(0, 6)` je
`C > 0`, za `t > 6` bi koncentracija spet rasla.
trditev: MAT-SS-3/graf-polinoma#primer4-odgovor
besedilo: »Ničla $6$ je stopnje $2$: graf se osi dotakne in se obrne navzgor. Za $t > 6$ bi koncentracija spet rasla, česar brez nove tablete ni.« -/
theorem primer4_odgovor :
    (∀ t : ℝ, t * (t - 6) ^ 2 = 0 ↔ t = 0 ∨ t = 6) ∧
    rootMultiplicity 6 (X * (X - C 6) ^ 2 : ℝ[X]) = 2 ∧
    (∀ t : ℝ, 0 < t → t < 6 → 0 < t * (t - 6) ^ 2) ∧
    (∀ s t : ℝ, 6 < s → s < t → s * (s - 6) ^ 2 < t * (t - 6) ^ 2) := by
  refine ⟨fun t => ?_, ?_, fun t h1 h2 => mul_pos h1 (kvadrat_pozitiven _ (by linarith)), fun s t hs hst => ?_⟩
  · constructor
    · intro h
      rcases mul_eq_zero.mp h with h1 | h1
      · exact Or.inl h1
      · right; have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h1; linarith
    · rintro (rfl | rfl) <;> norm_num
  · have h0 : (X * (X - C 6) ^ 2 : ℝ[X]) ≠ 0 := mul_ne_zero X_ne_zero (pow_ne_zero _ (X_sub_C_ne_zero _))
    rw [rootMultiplicity_mul h0, rootMultiplicity_X_sub_C_pow,
      show (X : ℝ[X]) = X - C 0 by simp, rootMultiplicity_X_sub_C]
    norm_num
  · have h1 : (s - 6) ^ 2 < (t - 6) ^ 2 := by nlinarith
    nlinarith [sq_nonneg (s - 6)]

/-! ## Pogoste napake -/

/-- Pogoste napake: pri `(x + 1)(x − 2)²` so predznaki od leve proti desni −, +, + (ne izmenično).
trditev: MAT-SS-3/graf-polinoma#napaka-predznaki
besedilo: »Pri $(x + 1)(x - 2)^2$ so predznaki od leve proti desni $-, +, +$.« -/
theorem napaka_predznaki :
    (∀ x : ℝ, x < -1 → (x + 1) * (x - 2) ^ 2 < 0) ∧
    (∀ x : ℝ, -1 < x → x < 2 → 0 < (x + 1) * (x - 2) ^ 2) ∧
    (∀ x : ℝ, 2 < x → 0 < (x + 1) * (x - 2) ^ 2) := by
  refine ⟨fun x h => ?_, fun x h1 h2 => ?_, fun x h => ?_⟩
  · exact mul_neg_of_neg_of_pos (by linarith) (kvadrat_pozitiven _ (by linarith))
  · exact mul_pos (by linarith) (kvadrat_pozitiven _ (by linarith))
  · exact mul_pos (by linarith) (kvadrat_pozitiven _ (by linarith))

/-- Pogoste napake: pri `5 + 3x² − 2x³` odloča `−2x³`: desno `−∞`, levo `+∞`.
trditev: MAT-SS-3/graf-polinoma#napaka-kraka
besedilo: »Kraka iz prostega člena ali iz prvega zapisanega člena.** Pri $p(x) = 5 + 3x^2 - 2x^3$ kdo zagleda pozitivno $5$ in reče, da gre desni krak navzgor. Odloča pa člen z najvišjo potenco, $-2x^3$: desno $-\infty$, levo $+\infty$.« -/
theorem napaka_kraka :
    (5 + 3 * X ^ 2 - 2 * X ^ 3 : ℝ[X]).natDegree = 3 ∧ (5 + 3 * X ^ 2 - 2 * X ^ 3 : ℝ[X]).leadingCoeff = -2 ∧
    Tendsto (fun x => (5 + 3 * X ^ 2 - 2 * X ^ 3 : ℝ[X]).eval x) atBot atTop ∧
    Tendsto (fun x => (5 + 3 * X ^ 2 - 2 * X ^ 3 : ℝ[X]).eval x) atTop atBot := by
  have hd : (5 + 3 * X ^ 2 - 2 * X ^ 3 : ℝ[X]).natDegree = 3 := by compute_degree!
  have hl : (5 + 3 * X ^ 2 - 2 * X ^ 3 : ℝ[X]).leadingCoeff = -2 := by
    rw [leadingCoeff, hd]; simp
  refine ⟨hd, hl, (kraka _ (by rw [hd]; norm_num)).2.2.2 (by rw [hd]; decide) (by rw [hl]; norm_num)⟩

/-- Pogoste napake: `(x − 1)²(x + 2)` ima dve različni ničli, a stopnjo 3.
trditev: MAT-SS-3/graf-polinoma#napaka-stopnja
besedilo: »Stopnja je enaka številu ničel.** Polinom $(x - 1)^2(x + 2)$ ima dve različni ničli, a stopnjo $3$.« -/
theorem napaka_stopnja :
    (∀ x : ℝ, (x - 1) ^ 2 * (x + 2) = 0 ↔ x = 1 ∨ x = -2) ∧
    ((X - C 1) ^ 2 * (X - C (-2)) : ℝ[X]).natDegree = 3 := by
  refine ⟨fun x => ?_, ?_⟩
  · constructor
    · intro h
      rcases mul_eq_zero.mp h with h1 | h1
      · left; have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h1; linarith
      · right; linarith
    · rintro (rfl | rfl) <;> norm_num
  · rw [natDegree_mul (pow_ne_zero _ (X_sub_C_ne_zero _)) (X_sub_C_ne_zero _), natDegree_pow,
      natDegree_X_sub_C, natDegree_X_sub_C]

/-- Pogoste napake (model velja povsod): `v(d) = d³ − 9d² + 24d − 20` gre za velike `d` v `+∞`.
trditev: MAT-SS-3/graf-polinoma#napaka-model
besedilo: »Podatki:** $v(d) = d^3 - 9d^2 + 24d - 20$ (v cm), $d$ v dneh, $0 \le d \le 7$« -/
theorem napaka_model : Tendsto (fun d => (X ^ 3 - 9 * X ^ 2 + 24 * X - 20 : ℝ[X]).eval d) atTop atTop := by
  have hd : (X ^ 3 - 9 * X ^ 2 + 24 * X - 20 : ℝ[X]).natDegree = 3 := by compute_degree!
  have hl : (X ^ 3 - 9 * X ^ 2 + 24 * X - 20 : ℝ[X]).leadingCoeff = 1 := by
    rw [leadingCoeff, hd]; simp [coeff_X]
  exact ((kraka _ (by rw [hd]; norm_num)).2.2.1 (by rw [hd]; decide) (by rw [hl]; norm_num)).2

/-! ## Za maturo -/

/-- Naloga 1 (in `<<RACUN`): `x³ − 4x² + 4x = x(x² − 4x + 4) = x(x − 2)²`; ničli 0 (stopnje 1) in 2 (stopnje 2);
`x³ − 4x² + 4x ≤ 0` natanko za `x ∈ (−∞, 0] ∪ {2}`.
trditev: MAT-SS-3/graf-polinoma#matura1
besedilo: »Razcep: $x^3 - 4x^2 + 4x = x(x^2 - 4x + 4) = x(x - 2)^2$. Ničli sta $0$ (stopnje $1$) in $2$ (stopnje $2$).« -/
theorem matura1 :
    (∀ x : ℝ, x ^ 3 - 4 * x ^ 2 + 4 * x = x * (x ^ 2 - 4 * x + 4) ∧ x * (x ^ 2 - 4 * x + 4) = x * (x - 2) ^ 2) ∧
    rootMultiplicity 0 (X * (X - C 2) ^ 2 : ℝ[X]) = 1 ∧ rootMultiplicity 2 (X * (X - C 2) ^ 2 : ℝ[X]) = 2 ∧
    ∀ x : ℝ, x ^ 3 - 4 * x ^ 2 + 4 * x ≤ 0 ↔ x ≤ 0 ∨ x = 2 := by
  have h0 : (X * (X - C 2) ^ 2 : ℝ[X]) ≠ 0 := mul_ne_zero X_ne_zero (pow_ne_zero _ (X_sub_C_ne_zero _))
  have hX : (X : ℝ[X]) = X - C 0 := by simp
  refine ⟨fun x => ⟨by ring, by ring⟩, ?_, ?_, fun x => ?_⟩
  · rw [rootMultiplicity_mul h0, stopnja_v_potenci, hX, rootMultiplicity_X_sub_C]; norm_num
  · rw [rootMultiplicity_mul h0, stopnja_v_potenci, hX, rootMultiplicity_X_sub_C]; norm_num
  · rw [show x ^ 3 - 4 * x ^ 2 + 4 * x = x * (x - 2) ^ 2 by ring]
    constructor
    · intro h
      by_contra hc
      push Not at hc
      have : 0 < x * (x - 2) ^ 2 := mul_pos hc.1 (kvadrat_pozitiven _ (sub_ne_zero.mpr hc.2))
      linarith
    · rintro (h | rfl)
      · exact mul_nonpos_of_nonpos_of_nonneg h (sq_nonneg _)
      · norm_num

/-- Naloga 2 a) (in `<<RACUN`): Horner z 2 na `−1, 0, 3, 2`: −1, −2, −1, ostanek 0, torej `p(2) = 0`;
količnik `−x² − 2x − 1 = −(x + 1)²` in `p(x) = −(x − 2)(x + 1)²`.
trditev: MAT-SS-3/graf-polinoma#matura2a
besedilo: »a) Hornerjev algoritem z $2$ na koeficientih $-1, 0, 3, 2$: $-1$; $-2$; $-1$; $0$. Ostanek $0$ pomeni $p(2) = 0$, količnik je $-x^2 - 2x - 1 = -(x + 1)^2$.« -/
theorem matura2a :
    (-1:ℝ) * 2 + 0 = -2 ∧ (-2:ℝ) * 2 + 3 = -1 ∧ (-1:ℝ) * 2 + 2 = 0 ∧ -((2:ℝ) ^ 3) + 3 * 2 + 2 = 0 ∧
    (∀ x : ℝ, -x ^ 3 + 3 * x + 2 = (x - 2) * (-x ^ 2 - 2 * x - 1)) ∧
    (∀ x : ℝ, -x ^ 2 - 2 * x - 1 = -(x + 1) ^ 2) ∧
    (∀ x : ℝ, -x ^ 3 + 3 * x + 2 = -(x - 2) * (x + 1) ^ 2) :=
  ⟨by norm_num, by norm_num, by norm_num, by norm_num, fun x => by ring, fun x => by ring, fun x => by ring⟩

/-- Naloga 2 b): ničli −1 (stopnje 2) in 2 (stopnje 1); `p(0) = 2`; vodilni člen `−x³`: levi krak `+∞`,
desni `−∞`.
trditev: MAT-SS-3/graf-polinoma#matura2b
besedilo: »b) Vodilni člen je $-x^3$: stopnja je liha, koeficient negativen, zato gre levi krak v $+\infty$, desni v $-\infty$.« -/
theorem matura2b :
    rootMultiplicity (-1) (C (-1) * (X - C 2) * (X - C (-1)) ^ 2 : ℝ[X]) = 2 ∧
    rootMultiplicity 2 (C (-1) * (X - C 2) * (X - C (-1)) ^ 2 : ℝ[X]) = 1 ∧
    -((0:ℝ) ^ 3) + 3 * 0 + 2 = 2 ∧
    (-X ^ 3 + 3 * X + 2 : ℝ[X]).natDegree = 3 ∧ (-X ^ 3 + 3 * X + 2 : ℝ[X]).leadingCoeff = -1 ∧
    Tendsto (fun x => (-X ^ 3 + 3 * X + 2 : ℝ[X]).eval x) atBot atTop ∧
    Tendsto (fun x => (-X ^ 3 + 3 * X + 2 : ℝ[X]).eval x) atTop atBot := by
  have h0 : (C (-1) * (X - C 2) * (X - C (-1)) ^ 2 : ℝ[X]) ≠ 0 :=
    mul_ne_zero (mul_ne_zero (by simp) (X_sub_C_ne_zero _)) (pow_ne_zero _ (X_sub_C_ne_zero _))
  have h1 := left_ne_zero_of_mul h0
  have hd : (-X ^ 3 + 3 * X + 2 : ℝ[X]).natDegree = 3 := by compute_degree!
  have hl : (-X ^ 3 + 3 * X + 2 : ℝ[X]).leadingCoeff = -1 := by
    rw [leadingCoeff, hd]; simp [coeff_X]
  refine ⟨?_, ?_, by norm_num, hd, hl,
    (kraka _ (by rw [hd]; norm_num)).2.2.2 (by rw [hd]; decide) (by rw [hl]; norm_num)⟩ <;>
  (rw [rootMultiplicity_mul h0, rootMultiplicity_mul h1, rootMultiplicity_C, stopnja_v_potenci,
      rootMultiplicity_X_sub_C]; norm_num)

/-- Naloga 2 b): predznaki od desne: za `x > 2` negativen, na `(−1, 2)` pozitiven, za `x < −1` pozitiven.
trditev: MAT-SS-3/graf-polinoma#matura2b-predznaki
besedilo: »b) Predznaki od desne: za $x > 2$ negativen; pri $2$ se zamenja, na $(-1, 2)$ pozitiven; pri $-1$ (soda) ostane, za $x < -1$ pozitiven.« -/
theorem matura2b_predznaki :
    (∀ x : ℝ, 2 < x → -(x - 2) * (x + 1) ^ 2 < 0) ∧
    (∀ x : ℝ, -1 < x → x < 2 → 0 < -(x - 2) * (x + 1) ^ 2) ∧
    (∀ x : ℝ, x < -1 → 0 < -(x - 2) * (x + 1) ^ 2) := by
  refine ⟨fun x h => ?_, fun x h1 h2 => ?_, fun x h => ?_⟩
  · exact mul_neg_of_neg_of_pos (by linarith) (kvadrat_pozitiven _ (by linarith))
  · exact mul_pos (by linarith) (kvadrat_pozitiven _ (by linarith))
  · exact mul_pos (by linarith) (kvadrat_pozitiven _ (by linarith))

/-- Naloga 2 c) (in `<<RACUN`): `−x³ + 3x + 2 > 0` natanko za `x ∈ (−∞, −1) ∪ (−1, 2)`.
trditev: MAT-SS-3/graf-polinoma#matura2c
besedilo: »$p(x) = -x^3 + 3x + 2$« -/
theorem matura2c (x : ℝ) : 0 < -x ^ 3 + 3 * x + 2 ↔ x < -1 ∨ (-1 < x ∧ x < 2) := by
  rw [show -x ^ 3 + 3 * x + 2 = -(x - 2) * (x + 1) ^ 2 by ring]
  constructor
  · intro h
    have hx2 : x < 2 := by
      by_contra hc
      have : -(x - 2) * (x + 1) ^ 2 ≤ 0 := mul_nonpos_of_nonpos_of_nonneg (by linarith) (sq_nonneg _)
      linarith
    have hx1 : x ≠ -1 := by rintro rfl; norm_num at h
    rcases lt_or_gt_of_ne hx1 with h' | h'
    · exact Or.inl h'
    · exact Or.inr ⟨h', hx2⟩
  · rintro (h | ⟨h1, h2⟩)
    · exact (matura2b_predznaki.2.2) x h
    · exact (matura2b_predznaki.2.1) x h1 h2

/-- Naloga 3 a) (in `<<RACUN`): `v(d) = a·d·(d − 8)²` in `v(2) = a·2·36 = 72a = 36` natanko pri `a = 1/2`.
trditev: MAT-SS-3/graf-polinoma#matura3a-a
besedilo: »a) Iz $v(2) = a \cdot 2 \cdot 36 = 72a = 36$ sledi $a = \frac{1}{2}$, torej $v(d) = \frac{1}{2}\,d\,(d - 8)^2$.« -/
theorem matura3a_a (a : ℝ) : a * 2 * (2 - 8) ^ 2 = a * 2 * 36 ∧ a * 2 * 36 = 72 * a ∧
    (a * 2 * (2 - 8) ^ 2 = 36 ↔ a = 1 / 2) := by
  refine ⟨by norm_num, by ring, ?_⟩
  constructor <;> intro h <;> norm_num at * <;> linarith

/-- Naloga 3 a) (enoličnost): polinom tretje stopnje z ničlo 0 (`d ∣ v`), dotikom osi pri 8 (`(d − 8)² ∣ v`)
in `v(2) = 36` je natanko `v(d) = ½·d·(d − 8)²`.
trditev: MAT-SS-3/graf-polinoma#matura3a
besedilo: »a) Ničli sta $0$ in $8$. Dotik pri $8$ pomeni sodo stopnjo ničle, torej faktor $(d - 8)^2$. Polinom je tretje stopnje, zato ostane za ničlo $0$ faktor $d$: $v(d) = a\,d\,(d - 8)^2$.« -/
theorem matura3a (v : ℝ[X]) (hd : v.natDegree = 3) (h0 : X ∣ v) (h8 : (X - C 8) ^ 2 ∣ v)
    (h2 : v.eval 2 = 36) : v = C (1 / 2) * (X * (X - C 8) ^ 2) := by
  have hv : v ≠ 0 := by rintro rfl; simp at hd
  have hco : IsCoprime (X : ℝ[X]) ((X - C 8) ^ 2) := by
    have := isCoprime_X_sub_C_of_isUnit_sub (R := ℝ) (a := 0) (b := 8)
      (isUnit_iff_ne_zero.mpr (by norm_num))
    simpa using this.pow_right (n := 2)
  have hdvd := hco.mul_dvd h0 h8
  have hm : (X * (X - C 8) ^ 2 : ℝ[X]).Monic := monic_X.mul ((monic_X_sub_C _).pow _)
  have hmd : (X * (X - C 8) ^ 2 : ℝ[X]).natDegree = 3 := by
    rw [natDegree_mul X_ne_zero (pow_ne_zero _ (X_sub_C_ne_zero _)), natDegree_pow, natDegree_X_sub_C,
      natDegree_X]
  obtain ⟨a, ha⟩ := enolicen_iz_deljivosti v _ hm hdvd hv (by rw [hd, hmd])
  rw [ha] at h2 ⊢
  simp at h2
  congr 2
  norm_num at h2 ⊢
  linarith

/-- Predpostavke trditve `matura3a` se dajo izpolniti (`v = ½·d·(d − 8)²`). -/
example : (C (1 / 2) * (X * (X - C 8) ^ 2) : ℝ[X]).natDegree = 3 ∧
    X ∣ (C (1 / 2) * (X * (X - C 8) ^ 2) : ℝ[X]) ∧ (X - C 8) ^ 2 ∣ (C (1 / 2) * (X * (X - C 8) ^ 2) : ℝ[X]) ∧
    (C (1 / 2) * (X * (X - C 8) ^ 2) : ℝ[X]).eval 2 = 36 := by
  refine ⟨?_, (dvd_mul_right _ _).mul_left _, (dvd_mul_left _ _).mul_left _, by simp; norm_num⟩
  rw [natDegree_C_mul (by norm_num), natDegree_mul X_ne_zero (pow_ne_zero _ (X_sub_C_ne_zero _)),
    natDegree_pow, natDegree_X_sub_C, natDegree_X]

/-- Predpostavke trditve `matura3a` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (C (1 / 2) * (X * (X - C 8) ^ 2) : ℝ[X]).natDegree = 3 ∧ X ∣ (C (1 / 2) * (X * (X - C 8) ^ 2) : ℝ[X]) ∧ (X - C 8) ^ 2 ∣ (C (1 / 2) * (X * (X - C 8) ^ 2) : ℝ[X]) ∧ (C (1 / 2) * (X * (X - C 8) ^ 2) : ℝ[X]).eval 2 = 36 := by
    refine ⟨?_, (dvd_mul_right _ _).mul_left _, (dvd_mul_left _ _).mul_left _, by simp; norm_num⟩
    rw [natDegree_C_mul (by norm_num), natDegree_mul X_ne_zero (pow_ne_zero _ (X_sub_C_ne_zero _)),
      natDegree_pow, natDegree_X_sub_C, natDegree_X]
  matura3a (hd := w.1) (h0 := w.2.1) (h8 := w.2.2.1) (h2 := w.2.2.2)

/-- Naloga 3 b), c) (in `<<RACUN`): `v(5) = ½·5·9 = 22,5`; `v(4) = ½·4·16 = 32`; `v(d) = 32` je enakovredno
`d³ − 16d² + 64d − 64 = 0`; Horner s 4: 1, −12, 16, 0; `d(d − 8)² − 64 = (d − 4)(d² − 12d + 16)`.
trditev: MAT-SS-3/graf-polinoma#matura3bc
besedilo: »c) $v(4) = \frac{1}{2} \cdot 4 \cdot 16 = 32$, zato je $d = 4$ rešitev. Enačba $\frac{1}{2}\,d\,(d - 8)^2 = 32$ je enakovredna $d^3 - 16d^2 + 64d - 64 = 0$.« -/
theorem matura3bc :
    (1 / 2 : ℝ) * 5 * (5 - 8) ^ 2 = 1 / 2 * 5 * 9 ∧ (1 / 2 : ℝ) * 5 * 9 = 22.5 ∧
    (1 / 2 : ℝ) * 4 * (4 - 8) ^ 2 = 1 / 2 * 4 * 16 ∧ (1 / 2 : ℝ) * 4 * 16 = 32 ∧
    (∀ d : ℝ, 1 / 2 * d * (d - 8) ^ 2 = 32 ↔ d ^ 3 - 16 * d ^ 2 + 64 * d - 64 = 0) ∧
    (1:ℝ) * 4 - 16 = -12 ∧ (-12:ℝ) * 4 + 64 = 16 ∧ (16:ℝ) * 4 - 64 = 0 ∧
    (∀ d : ℝ, d * (d - 8) ^ 2 - 64 = (d - 4) * (d ^ 2 - 12 * d + 16)) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, fun d => ?_, by norm_num, by norm_num,
    by norm_num, fun d => by ring⟩
  constructor <;> intro h <;> nlinarith [h]

/-- Naloga 3 c) (in `<<RACUN`): `d² − 12d + 16 = 0` natanko pri `d = 6 ± 2√5`.
trditev: MAT-SS-3/graf-polinoma#matura3c-kvadratna
besedilo: »c) $d^2 - 12d + 16 = 0$ da $d = 6 \pm 2\sqrt{5}$,« -/
theorem matura3c_kvadratna (d : ℝ) : d ^ 2 - 12 * d + 16 = 0 ↔ d = 6 - 2 * Real.sqrt 5 ∨ d = 6 + 2 * Real.sqrt 5 := by
  have h5 : Real.sqrt 5 ^ 2 = 5 := Real.sq_sqrt (by norm_num)
  have hf : d ^ 2 - 12 * d + 16 = (d - (6 - 2 * Real.sqrt 5)) * (d - (6 + 2 * Real.sqrt 5)) := by
    linear_combination (4 : ℝ) * h5
  rw [hf, mul_eq_zero, sub_eq_zero, sub_eq_zero]

/-- Pomožna trditev: `2,236067 < √5 < 2,236068`.
pomozno -/
theorem sqrt5_meje : (2.236067 : ℝ) < Real.sqrt 5 ∧ Real.sqrt 5 < 2.236068 := by
  constructor
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num

/-- Naloga 3 c), d) (in `<<RACUN`): `6 − 2√5 ≈ 1,5279`, `6 + 2√5 ≈ 10,4721 > 8` (zunaj območja),
`2√5 − 2 ≈ 2,4721` dneva, `(2√5 − 2)·24 ≈ 59,33` h, zaokroženo 59 ur.
trditev: MAT-SS-3/graf-polinoma#matura3-priblizki
besedilo: »c) $d^2 - 12d + 16 = 0$ da $d = 6 \pm 2\sqrt{5}$, torej $d \approx 1{,}5279$ ali $d \approx 10{,}4721$. Druga rešitev je zunaj območja modela $0 \le d \le 8$.« -/
theorem matura3_priblizki :
    |6 - 2 * Real.sqrt 5 - 1.5279| < 0.00005 ∧ |6 + 2 * Real.sqrt 5 - 10.4721| < 0.00005 ∧
    8 < 6 + 2 * Real.sqrt 5 ∧ |2 * Real.sqrt 5 - 2 - 2.4721| < 0.00005 ∧
    |(2 * Real.sqrt 5 - 2) * 24 - 59.33| < 0.005 ∧ |(2 * Real.sqrt 5 - 2) * 24 - 59| < 0.5 := by
  obtain ⟨h1, h2⟩ := sqrt5_meje
  refine ⟨?_, ?_, by linarith, ?_, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Naloga 3 c), d): na območju `0 ≤ d ≤ 8` je `v(d) = 32` natanko pri `d = 6 − 2√5` in `d = 4`, gladina je
vsaj 32 cm nad običajno natanko na `[6 − 2√5, 4]`, zapornica je odprta `4 − (6 − 2√5) = 2√5 − 2` dneva.
trditev: MAT-SS-3/graf-polinoma#matura3d
besedilo: »d) Pri $d = 2$ je $v = 36 > 32$, zato je gladina vsaj $32\,\mathrm{cm}$ nad običajno med $d = 6 - 2\sqrt{5}$ in $d = 4$. Med $4$ in $8$ ni več nobene rešitve, zato tam ostane pod $32\,\mathrm{cm}$.« -/
theorem matura3d :
    (∀ d : ℝ, 0 ≤ d → d ≤ 8 → (1 / 2 * d * (d - 8) ^ 2 = 32 ↔ d = 6 - 2 * Real.sqrt 5 ∨ d = 4)) ∧
    (∀ d : ℝ, 0 ≤ d → d ≤ 8 → (32 ≤ 1 / 2 * d * (d - 8) ^ 2 ↔ 6 - 2 * Real.sqrt 5 ≤ d ∧ d ≤ 4)) ∧
    (1 / 2 : ℝ) * 2 * (2 - 8) ^ 2 = 36 ∧ (4:ℝ) - (6 - 2 * Real.sqrt 5) = 2 * Real.sqrt 5 - 2 := by
  obtain ⟨s1, s2⟩ := sqrt5_meje
  have key : ∀ d : ℝ, 1 / 2 * d * (d - 8) ^ 2 - 32 =
      1 / 2 * (d - 4) * ((d - (6 - 2 * Real.sqrt 5)) * (d - (6 + 2 * Real.sqrt 5))) := by
    intro d
    have h5 : Real.sqrt 5 ^ 2 = 5 := Real.sq_sqrt (by norm_num)
    linear_combination (2 : ℝ) * (d - 4) * h5
  refine ⟨fun d h0 h8 => ?_, fun d h0 h8 => ?_, by norm_num, by ring⟩
  · have hb : d - (6 + 2 * Real.sqrt 5) < 0 := by linarith
    constructor
    · intro h
      have : 1 / 2 * (d - 4) * ((d - (6 - 2 * Real.sqrt 5)) * (d - (6 + 2 * Real.sqrt 5))) = 0 := by
        rw [← key]; linarith
      rcases mul_eq_zero.mp this with h1 | h1
      · right; linarith
      · rcases mul_eq_zero.mp h1 with h2 | h2
        · left; linarith
        · linarith
    · intro h
      have : 1 / 2 * (d - 4) * ((d - (6 - 2 * Real.sqrt 5)) * (d - (6 + 2 * Real.sqrt 5))) = 0 := by
        rcases h with rfl | rfl <;> ring
      linarith [key d]
  · have hb : d - (6 + 2 * Real.sqrt 5) < 0 := by linarith
    have hk := key d
    constructor
    · intro h
      by_contra hc
      rw [not_and_or] at hc
      rcases hc with hc | hc
      · push Not at hc
        have : 0 < (d - 4) * (d - (6 - 2 * Real.sqrt 5)) := mul_pos_of_neg_of_neg (by linarith) (by linarith)
        nlinarith
      · push Not at hc
        have : 0 < (d - 4) * (d - (6 - 2 * Real.sqrt 5)) := mul_pos (by linarith) (by linarith)
        nlinarith
    · rintro ⟨ha, hb4⟩
      have : (d - 4) * (d - (6 - 2 * Real.sqrt 5)) ≤ 0 :=
        mul_nonpos_of_nonpos_of_nonneg (by linarith) (by linarith)
      nlinarith

/-- Naloga 3 e): za `d > 8` sta `d` in `(d − 8)²` pozitivna, `v` raste, desni krak gre v `+∞`.
trditev: MAT-SS-3/graf-polinoma#matura3e
besedilo: »e) Za $d > 8$ sta $d$ in $(d - 8)^2$ pozitivna in desni krak gre v $+\infty$.« -/
theorem matura3e :
    (∀ d : ℝ, 8 < d → 0 < 1 / 2 * d * (d - 8) ^ 2) ∧
    (∀ s t : ℝ, 8 < s → s < t → 1 / 2 * s * (s - 8) ^ 2 < 1 / 2 * t * (t - 8) ^ 2) ∧
    Tendsto (fun d => (C (1 / 2) * (X * (X - C 8) ^ 2) : ℝ[X]).eval d) atTop atTop := by
  refine ⟨fun d h => mul_pos (by linarith) (kvadrat_pozitiven _ (by linarith)), fun s t hs hst => ?_, ?_⟩
  · have h1 : (s - 8) ^ 2 < (t - 8) ^ 2 := by nlinarith
    nlinarith [sq_nonneg (s - 8)]
  · have hd : (C (1 / 2) * (X * (X - C 8) ^ 2) : ℝ[X]).natDegree = 3 := by
      rw [natDegree_C_mul (by norm_num), natDegree_mul X_ne_zero (pow_ne_zero _ (X_sub_C_ne_zero _)),
        natDegree_pow, natDegree_X_sub_C, natDegree_X]
    have hl : (C (1 / 2) * (X * (X - C 8) ^ 2) : ℝ[X]).leadingCoeff = 1 / 2 := by
      rw [leadingCoeff_mul, leadingCoeff_C, (monic_X.mul ((monic_X_sub_C _).pow _)).leadingCoeff, mul_one]
    exact ((kraka _ (by rw [hd]; norm_num)).2.2.1 (by rw [hd]; decide) (by rw [hl]; norm_num)).2

/-! ## Ustna vprašanja, Bolj natančno -/

/-- Ustno vprašanje 3: `(x − 1)²(x + 2) > 0` natanko za `x ∈ (−2, 1) ∪ (1, ∞)`.
trditev: MAT-SS-3/graf-polinoma#ustno3
besedilo: »$(x - 1)^2(x + 2) > 0$« -/
theorem ustno3 (x : ℝ) : 0 < (x - 1) ^ 2 * (x + 2) ↔ (-2 < x ∧ x < 1) ∨ 1 < x := by
  constructor
  · intro h
    have hx2 : -2 < x := by
      by_contra hc
      have : (x - 1) ^ 2 * (x + 2) ≤ 0 := mul_nonpos_of_nonneg_of_nonpos (sq_nonneg _) (by linarith)
      linarith
    have hx1 : x ≠ 1 := by rintro rfl; norm_num at h
    rcases lt_or_gt_of_ne hx1 with h' | h'
    · exact Or.inl ⟨hx2, h'⟩
    · exact Or.inr h'
  · rintro (⟨h1, h2⟩ | h)
    · exact mul_pos (kvadrat_pozitiven _ (by linarith)) (by linarith)
    · exact mul_pos (kvadrat_pozitiven _ (by linarith)) (by linarith)

/-- Bolj natančno (faktorji brez ničel): `x² + 1 > 0`, zato ima `(x − 2)(x² + 1)` (stopnje 3) eno samo realno
ničlo 2.
trditev: MAT-SS-3/graf-polinoma#faktor-brez-nicel
besedilo: »Faktorji brez ničel.** Faktor $x^2 + 1$ je vedno pozitiven, zato predznaka nikjer ne zamenja in grafa ne pripelje do osi. Polinom $(x - 2)(x^2 + 1)$ ima stopnjo $3$, a eno samo realno ničlo.« -/
theorem faktor_brez_nicel :
    (∀ x : ℝ, 0 < x ^ 2 + 1) ∧ (∀ x : ℝ, (x - 2) * (x ^ 2 + 1) = 0 ↔ x = 2) ∧
    ((X - C 2) * (X ^ 2 + C 1) : ℝ[X]).natDegree = 3 := by
  refine ⟨fun x => by positivity, fun x => ?_, ?_⟩
  · constructor
    · intro h
      rcases mul_eq_zero.mp h with h1 | h1
      · linarith
      · nlinarith [sq_nonneg x]
    · rintro rfl; norm_num
  · rw [natDegree_mul (X_sub_C_ne_zero _) (by
      intro h; have := congrArg (eval 0) h; simp at this), natDegree_X_sub_C,
      natDegree_X_pow_add_C]

/-! ## Preveri se -/

/-- Preveri se 2: `p(0) = −2·(−1)³·4² = −2·(−1)·16 = 32` za `p(x) = −2(x − 1)³(x + 4)²`; napačni odgovori
−32 (`(−1)³` kot 1), 8 (`4²` kot 4), −8 (oboje).
trditev: MAT-SS-3/graf-polinoma#kviz2
besedilo: »$p(0) = -2 \cdot (-1)^3 \cdot 4^2 = -2 \cdot (-1) \cdot 16 = 32$« -/
theorem kviz2 : -2 * ((0:ℝ) - 1) ^ 3 * (0 + 4) ^ 2 = -2 * (-1) ^ 3 * 4 ^ 2 ∧
    (-2:ℝ) * (-1) ^ 3 * 4 ^ 2 = -2 * (-1) * 16 ∧ (-2:ℝ) * (-1) * 16 = 32 ∧
    (-2:ℝ) * 1 * 16 = -32 ∧ (-2:ℝ) * (-1) * 4 = 8 ∧ (-2:ℝ) * 1 * 4 = -8 := by norm_num

/-- Preveri se 3: za `(x + 1)(x − 2)²` je `p(−2) = (−1)·16 = −16` in `p(3) = 4·1 = 4 > 0` (Jana se je zmotila
za `x > 2`; predznaki so v `napaka_predznaki`).
trditev: MAT-SS-3/graf-polinoma#kviz3
besedilo: »Jana je predznake le izmenjevala. Ničla $2$ je sode stopnje, graf se osi samo dotakne. Preizkus: $p(3) = 4 \cdot 1 = 4 > 0$.« -/
theorem kviz3 : ((-2:ℝ) + 1) * (-2 - 2) ^ 2 = (-1) * 16 ∧ (-1:ℝ) * 16 = -16 ∧
    ((3:ℝ) + 1) * (3 - 2) ^ 2 = 4 * 1 ∧ (0:ℝ) < 4 * 1 := by norm_num

/-- Preveri se 4: levi kraki `p(x) = x³ + 1000` in `q(x) = −x⁴ + x` gresta oba v `−∞`; `(−100)³ = −1 000 000`.
trditev: MAT-SS-3/graf-polinoma#kviz4
besedilo: »Primerjaj leva kraka grafov $p(x) = x^3 + 1000$ in $q(x) = -x^4 + x$.« -/
theorem kviz4 :
    Tendsto (fun x => (X ^ 3 + 1000 : ℝ[X]).eval x) atBot atBot ∧
    Tendsto (fun x => (-X ^ 4 + X : ℝ[X]).eval x) atBot atBot ∧ (-100:ℝ) ^ 3 = -1000000 := by
  have hd1 : (X ^ 3 + 1000 : ℝ[X]).natDegree = 3 := by compute_degree!
  have hl1 : (X ^ 3 + 1000 : ℝ[X]).leadingCoeff = 1 := by rw [leadingCoeff, hd1]; simp
  have hd2 : (-X ^ 4 + X : ℝ[X]).natDegree = 4 := by compute_degree!
  have hl2 : (-X ^ 4 + X : ℝ[X]).leadingCoeff = -1 := by rw [leadingCoeff, hd2]; simp [coeff_X]
  refine ⟨((kraka _ (by rw [hd1]; norm_num)).2.2.1 (by rw [hd1]; decide) (by rw [hl1]; norm_num)).1,
    ((kraka _ (by rw [hd2]; norm_num)).2.1 (by rw [hd2]; decide) (by rw [hl2]; norm_num)).1, by norm_num⟩

/-- Preveri se 5: `T(t) = −0,1 (t − 1)²(t − 6)`, `0 ≤ t ≤ 7`: pod lediščem natanko za `t > 6`;
`T(3) = 1,2`, `T(0) = 0,6`, `T(7) = −3,6`, `T(1) = T(6) = 0`.
trditev: MAT-SS-3/graf-polinoma#kviz5
besedilo: »Za $t > 6$ je $(t - 6) > 0$ in $(t - 1)^2 > 0$, pred njima pa $-0{,}1$, zato $T < 0$; npr. $T(7) = -3{,}6\,^\circ\mathrm{C}$. Pri sodi ničli $1$ se predznak ne zamenja, zato je pred $t = 6$ temperatura nad lediščem.« -/
theorem kviz5 :
    (∀ t : ℝ, 0 ≤ t → t ≤ 7 → ((-0.1:ℝ) * (t - 1) ^ 2 * (t - 6) < 0 ↔ 6 < t)) ∧
    (-0.1:ℝ) * (3 - 1) ^ 2 * (3 - 6) = 1.2 ∧ (-0.1:ℝ) * (0 - 1) ^ 2 * (0 - 6) = 0.6 ∧
    (-0.1:ℝ) * (7 - 1) ^ 2 * (7 - 6) = -3.6 ∧ (-0.1:ℝ) * (1 - 1) ^ 2 * (1 - 6) = 0 ∧
    (-0.1:ℝ) * (6 - 1) ^ 2 * (6 - 6) = 0 := by
  refine ⟨fun t _ _ => ?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  constructor
  · intro h
    by_contra hc
    push Not at hc
    have : 0 ≤ (-0.1:ℝ) * (t - 1) ^ 2 * (t - 6) :=
      mul_nonneg_of_nonpos_of_nonpos (mul_nonpos_of_nonpos_of_nonneg (by norm_num) (sq_nonneg _))
        (by linarith)
    linarith
  · intro h
    exact mul_neg_of_neg_of_pos (mul_neg_of_neg_of_pos (by norm_num) (kvadrat_pozitiven _ (by linarith)))
      (by linarith)

/-- Preveri se 6: polinom četrte stopnje ima `4 + 1 = 5` koeficientov; pet meritev z različnimi časi ga določi
(`dolocen_s_tockami`), štiri ne (`stiri_ne_zadoscajo`).
trditev: MAT-SS-3/graf-polinoma#kviz6
besedilo: »Neznanih koeficientov je $4 + 1 = 5$, zato potrebujemo pet enačb, torej pet meritev.« -/
theorem kviz6 : (4:ℕ) + 1 = 5 := rfl

/-! ## Razcepi kot polinomi -/

/-- Primer 1, Primer 2, Primer 4, Naloga 1, Naloga 2: razcepljene oblike, s katerimi so zgoraj izračunane
stopnje ničel, so kot polinomi enake razvitim polinomom iz lekcije.
trditev: MAT-SS-3/graf-polinoma#razcepi-kot-polinomi
besedilo: »Kandidati za cele ničle: $\pm 1, \pm 2, \pm 4, \pm 5, \pm 10, \pm 20$. Velja $v(1) = 1 - 9 + 24 - 20 = -4$, $v(2) = 8 - 36 + 48 - 20 = 0$. Ničla je $2$.« -/
theorem razcepi_kot_polinomi :
    ((X - C (-2)) * (X - C 1) ^ 2 * (X - C 3) : ℝ[X]) = (X + 2) * (X - 1) ^ 2 * (X - 3) ∧
    ((X - C 2) ^ 2 * (X - C 5) : ℝ[X]) = X ^ 3 - 9 * X ^ 2 + 24 * X - 20 ∧
    (X * (X - C 6) ^ 2 : ℝ[X]) = X ^ 3 - 12 * X ^ 2 + 36 * X ∧
    (X * (X - C 2) ^ 2 : ℝ[X]) = X ^ 3 - 4 * X ^ 2 + 4 * X ∧
    (C (-1) * (X - C 2) * (X - C (-1)) ^ 2 : ℝ[X]) = -X ^ 3 + 3 * X + 2 := by
  simp only [map_neg, map_one, map_ofNat]
  refine ⟨by ring, by ring, by ring, by ring, by ring⟩

/-! ## `<<RACUN` (vrstice, ki niso že zgoraj) -/

/-- `<<RACUN`: `resi: a + b + c = 25, 8a + 4b + 2c = 32, 27a + 9b + 3c = 27` ima edino rešitev
`a = 1, b = −12, c = 36`; `vrednost: 4(4 − 6)² = 16`;
`vrednost: −(0³) + 3·0 + 2 = 2`.
trditev: MAT-SS-3/graf-polinoma#racun
besedilo: »Ostale tri meritve dajo sistem (drugo in tretjo enačbo smo delili z $2$ in $3$): $a_3 + a_2 + a_1 = 25$, $4a_3 + 2a_2 + a_1 = 16$, $9a_3 + 3a_2 + a_1 = 9$.« -/
theorem racun (a b c : ℝ) :
    ((a + b + c = 25 ∧ 8 * a + 4 * b + 2 * c = 32 ∧ 27 * a + 9 * b + 3 * c = 27) ↔
      (a = 1 ∧ b = -12 ∧ c = 36)) ∧ (4:ℝ) * (4 - 6) ^ 2 = 16 ∧ -((0:ℝ) ^ 3) + 3 * 0 + 2 = 2 := by
  refine ⟨⟨fun ⟨h1, h2, h3⟩ => ⟨by linarith, by linarith, by linarith⟩, ?_⟩, by norm_num, by norm_num⟩
  rintro ⟨rfl, rfl, rfl⟩; norm_num

end Evklid.Lekcije.MAT_SS_3.GrafPolinoma
