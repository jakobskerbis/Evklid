/-
vir: content/lessons/MAT-SS-4/zaporedja.md
sha256: 24c03c4d50e9da114f886ff9bb91a1ef2bb1c0a23c48b8a68ee1d2c1e80b2931
Ni v Leanu: graf in simulacija (pike, pas okoli premice); analogija s cesto in sodnikom kot zgodba
  (dokazana sta oba primera iz nje: 1/n z n₀ = 10 in n₀ = 1000 ter (−1)ⁿ pri ε = 1/2); modeliranje
  zgodb (pohod, avto, zdravilo, potovanje): dokazane so formule in računi iz lekcije, ne to, da opisujejo
  resničnost; zaokrožene vrednosti (≈ 67, 80, 86, 89; ≈ 98,99; ≈ 1,01; ≈ 99,01; ≈ 1,667) so dokazane kot
  meje; zaporedje približkov √2 je dokazano kot ⌊10ⁿ√2⌋/10ⁿ (naraščajoče, < 1,5, limita √2), štirje
  zapisani približki pa kot števila; definicije (zaporedje, končno/neskončno, rekurziven zapis) niso
  trditve; točkovanje.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.Zaporedja

open Filter Topology Finset

/-- Pomožno: lim 1/n = 0 (razlaga 9, »znane limite«). -/
theorem lim_1_n : Tendsto (fun n : ℕ => 1 / (n : ℝ)) atTop (𝓝 0) :=
  tendsto_one_div_atTop_nhds_zero_nat

/-- Razlaga 9: limita konstantnega zaporedja je ta konstanta (lim c = c). -/
theorem lim_konst (c : ℝ) : Tendsto (fun _ : ℕ => c) atTop (𝓝 c) := tendsto_const_nhds

/-- Razlaga 9: za konvergentni zaporedji je limita vsote vsota limit, limita produkta produkt limit
in limita količnika količnik limit (če limita imenovalca ni 0). -/
theorem lim_pravila (a b : ℕ → ℝ) (A B : ℝ) (ha : Tendsto a atTop (𝓝 A))
    (hb : Tendsto b atTop (𝓝 B)) :
    Tendsto (fun n => a n + b n) atTop (𝓝 (A + B)) ∧ Tendsto (fun n => a n * b n) atTop (𝓝 (A * B)) ∧
    (B ≠ 0 → Tendsto (fun n => a n / b n) atTop (𝓝 (A / B))) :=
  ⟨ha.add hb, ha.mul hb, fun h => ha.div hb h⟩

/-- Pomožno: če sta zaporedji enaki za vse n ≥ 1, imata isto limito. -/
theorem lim_od_1 {f g : ℕ → ℝ} {L : ℝ} (h : ∀ n, 1 ≤ n → f n = g n) (hg : Tendsto g atTop (𝓝 L)) :
    Tendsto f atTop (𝓝 L) :=
  hg.congr' (eventually_atTop.2 ⟨1, fun n hn => (h n hn).symm⟩)

/-! ## Uvod: pohod in vožnja -/

/-- Uvod, razlaga 2: pohod, a₁ = 8, aₙ₊₁ = aₙ/2 ⇒ 8; 4; 2; 1; 0,5 in aₙ → 0. -/
theorem pohod (a : ℕ → ℝ) (h1 : a 1 = 8) (h : ∀ n, 1 ≤ n → a (n + 1) = a n / 2) :
    (a 2 = 4 ∧ a 3 = 2 ∧ a 4 = 1 ∧ a 5 = 1 / 2) ∧ Tendsto a atTop (𝓝 0) := by
  have e : ∀ n, 1 ≤ n → a n = 16 * (1 / 2) ^ n := by
    intro n hn
    induction n, hn using Nat.le_induction with
    | base => rw [h1]; norm_num
    | succ n hn ih => rw [h n hn, ih, pow_succ]; ring
  refine ⟨⟨?_, ?_, ?_, ?_⟩, ?_⟩
  · rw [e 2 (by norm_num)]; norm_num
  · rw [e 3 (by norm_num)]; norm_num
  · rw [e 4 (by norm_num)]; norm_num
  · rw [e 5 (by norm_num)]; norm_num
  · have := (tendsto_pow_atTop_nhds_zero_of_lt_one (by norm_num : (0 : ℝ) ≤ 1 / 2)
      (by norm_num)).const_mul 16
    rw [mul_zero] at this
    exact lim_od_1 e this

example : ∃ a : ℕ → ℝ, a 1 = 8 ∧ ∀ n, 1 ≤ n → a (n + 1) = a n / 2 :=
  ⟨fun n => 16 * (1 / 2) ^ n, by norm_num, fun n _ => by simp only [pow_succ]; ring⟩

/-- Uvod, primer 2: povprečna hitrost vₙ = 200n/(2n + 1): v₁ ≈ 67, v₂ = 80, v₃ ≈ 86, v₄ ≈ 89
(vse zaokrožene na celo), vₙ < 100 za vsak n in vₙ narašča. -/
theorem hitrosti :
    (66.5 ≤ (200 * 1 / (2 * 1 + 1) : ℝ) ∧ (200 * 1 / (2 * 1 + 1) : ℝ) < 67.5) ∧
    (200 * 2 / (2 * 2 + 1) : ℝ) = 80 ∧
    (85.5 ≤ (200 * 3 / (2 * 3 + 1) : ℝ) ∧ (200 * 3 / (2 * 3 + 1) : ℝ) < 86.5) ∧
    (88.5 ≤ (200 * 4 / (2 * 4 + 1) : ℝ) ∧ (200 * 4 / (2 * 4 + 1) : ℝ) < 89.5) ∧
    (∀ n : ℕ, 200 * (n : ℝ) / (2 * n + 1) < 100) ∧
    (∀ n : ℕ, 200 * (n : ℝ) / (2 * n + 1) < 200 * ((n : ℝ) + 1) / (2 * (n + 1) + 1)) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, fun n => ?_, fun n => ?_⟩
  · rw [div_lt_iff₀ (by positivity)]; linarith
  · rw [div_lt_div_iff₀ (by positivity) (by positivity)]; nlinarith

/-! ## Razlaga 2–5: aₙ = 2 − 1/n -/

/-- Razlaga 2–3: aₙ = 2 − 1/n: a₁ = 1, a₂ = 1,5, a₃ = 5/3 ≈ 1,667; tabela a₅ = 1,8, a₁₀ = 1,9,
a₁₀₀ = 1,99; razdalja do 2 je 1/n. -/
theorem tabela :
    (2 - 1 / 1 : ℝ) = 1 ∧ (2 - 1 / 2 : ℝ) = 1.5 ∧ (2 - 1 / 3 : ℝ) = 5 / 3 ∧
    (1.6665 ≤ (5 / 3 : ℝ) ∧ (5 / 3 : ℝ) < 1.6675) ∧
    (2 - 1 / 5 : ℝ) = 1.8 ∧ (2 - 1 / 10 : ℝ) = 1.9 ∧ (2 - 1 / 100 : ℝ) = 1.99 ∧
    ∀ n : ℕ, |(2 - 1 / (n : ℝ)) - 2| = 1 / n := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    fun n => ?_⟩
  rw [show (2 - 1 / (n : ℝ)) - 2 = -(1 / n) by ring, abs_neg, abs_of_nonneg (by positivity)]

/-- Razlaga 4: aₙ₊₁ − aₙ = 1/n − 1/(n + 1) = 1/(n(n + 1)) > 0 za aₙ = 2 − 1/n, zato je zaporedje
strogo naraščajoče (n ≥ 1). -/
theorem narasca (n : ℕ) (hn : 1 ≤ n) :
    (2 - 1 / ((n : ℝ) + 1)) - (2 - 1 / (n : ℝ)) = 1 / n - 1 / (n + 1) ∧
    1 / (n : ℝ) - 1 / (n + 1) = 1 / (n * (n + 1)) ∧ 0 < 1 / ((n : ℝ) * (n + 1)) := by
  have : (1 : ℝ) ≤ n := by exact_mod_cast hn
  refine ⟨by ring, ?_, by positivity⟩
  field_simp; ring

/-- Razlaga 4: za zaporedje s pozitivnimi členi je aₙ₊₁ > aₙ natanko tedaj, ko je aₙ₊₁/aₙ > 1. -/
theorem kolicnik (x y : ℝ) (hx : 0 < x) : x < y ↔ 1 < y / x := by
  rw [lt_div_iff₀ hx, one_mul]

/-- Razlaga 5 in »Premisli«: 1 ≤ 2 − 1/n < 2 za vsak n ≥ 1; noben člen ni enak 2. -/
theorem omejeno (n : ℕ) (hn : 1 ≤ n) :
    1 ≤ 2 - 1 / (n : ℝ) ∧ 2 - 1 / (n : ℝ) < 2 ∧ 2 - 1 / (n : ℝ) ≠ 2 := by
  have h : (1 : ℝ) ≤ n := by exact_mod_cast hn
  have h1 : 1 / (n : ℝ) ≤ 1 := by rw [div_le_one (by linarith)]; exact h
  have h2 : 0 < 1 / (n : ℝ) := by positivity
  exact ⟨by linarith, by linarith, by linarith⟩

/-- Razlaga 6: okolica s polmerom ε: |x − L| < ε ⇔ x ∈ (L − ε, L + ε). -/
theorem okolica (x L ε : ℝ) : |x - L| < ε ↔ x ∈ Set.Ioo (L - ε) (L + ε) := by
  rw [abs_sub_lt_iff, Set.mem_Ioo]; constructor <;> intro h <;> constructor <;> linarith [h.1, h.2]

/-- Razlaga 7: pri ε = 0,1 je |aₙ − 2| < 0,1 natanko za n > 10 (a₁, …, a₁₀ so zunaj, a₁₀ = 1,9 na robu). -/
theorem pas_01 (n : ℕ) (hn : 1 ≤ n) : |(2 - 1 / (n : ℝ)) - 2| < 0.1 ↔ 10 < n := by
  rw [(tabela).2.2.2.2.2.2.2 n]
  have h : (0 : ℝ) < n := by exact_mod_cast hn
  rw [div_lt_iff₀ h]
  constructor
  · intro h'; have : (10 : ℝ) < n := by linarith
    exact_mod_cast this
  · intro h'; have : (10 : ℝ) < n := by exact_mod_cast h'
    linarith

/-- Razlaga 7, »Premisli«: zunaj okolice 2 s polmerom 0,01 je natanko 100 členov: a₁, …, a₁₀₀
(a₁₀₀ = 1,99 je na robu). -/
theorem pas_001 :
    {n : ℕ | 1 ≤ n ∧ ¬ |(2 - 1 / (n : ℝ)) - 2| < 0.01} = Set.Icc 1 100 ∧
    (Set.Icc 1 100 : Set ℕ).ncard = 100 := by
  refine ⟨?_, ?_⟩
  · ext n
    simp only [Set.mem_ofPred_eq, Set.mem_Icc]
    constructor
    · rintro ⟨hn, h⟩
      refine ⟨hn, ?_⟩
      by_contra hc
      apply h
      rw [(tabela).2.2.2.2.2.2.2 n]
      have : (100 : ℝ) < n := by exact_mod_cast (show 100 < n by omega)
      rw [div_lt_iff₀ (by linarith)]; linarith
    · rintro ⟨hn, h⟩
      refine ⟨hn, ?_⟩
      rw [(tabela).2.2.2.2.2.2.2 n, not_lt]
      have : (n : ℝ) ≤ 100 := by exact_mod_cast h
      have : (0 : ℝ) < n := by exact_mod_cast hn
      rw [le_div_iff₀ (by linarith)]; linarith
  · rw [← Finset.coe_Icc, Set.ncard_coe_finset]; simp

/-- Razlaga 7: lim (2 − 1/n) = 2. -/
theorem lim_2 : Tendsto (fun n : ℕ => 2 - 1 / (n : ℝ)) atTop (𝓝 2) := by
  simpa using (tendsto_const_nhds (x := (2 : ℝ))).sub lim_1_n

/-- Razlaga 7 in »Bolj natančno«: definicija limite v Mathlibu se ujema z lekcijino: lim aₙ = L
natanko tedaj, ko za vsak ε > 0 obstaja n₀, da je |aₙ − L| < ε za vse n > n₀. -/
theorem def_limite (a : ℕ → ℝ) (L : ℝ) :
    Tendsto a atTop (𝓝 L) ↔ ∀ ε > 0, ∃ n₀ : ℕ, ∀ n > n₀, |a n - L| < ε := by
  rw [Metric.tendsto_atTop]
  simp only [Real.dist_eq]
  constructor
  · intro h ε hε
    obtain ⟨N, hN⟩ := h ε hε
    exact ⟨N, fun n hn => hN n hn.le⟩
  · intro h ε hε
    obtain ⟨n₀, h0⟩ := h ε hε
    exact ⟨n₀ + 1, fun n hn => h0 n (by omega)⟩

/-- Razlaga 7: »zunaj poljubne okolice števila L je le končno mnogo členov« je enakovredno limiti. -/
theorem def_limite_koncno (a : ℕ → ℝ) (L : ℝ) :
    Tendsto a atTop (𝓝 L) ↔ ∀ ε > 0, {n | ¬ |a n - L| < ε}.Finite := by
  rw [← Nat.cofinite_eq_atTop, Metric.tendsto_nhds]
  simp only [Real.dist_eq, eventually_cofinite]

/-- Razlaga 7 in pogoste napake: (−1)ⁿ je omejeno (−1 ≤ (−1)ⁿ ≤ 1), a divergentno. -/
theorem minus1_divergira :
    (∀ n : ℕ, -1 ≤ ((-1 : ℝ) ^ n) ∧ (-1 : ℝ) ^ n ≤ 1) ∧
    ¬ ∃ L, Tendsto (fun n : ℕ => (-1 : ℝ) ^ n) atTop (𝓝 L) := by
  refine ⟨fun n => ?_, ?_⟩
  · rcases neg_one_pow_eq_or ℝ n with h | h <;> rw [h] <;> norm_num
  · rintro ⟨L, hL⟩
    have hm : Tendsto (fun n : ℕ => 2 * n) atTop atTop := tendsto_id.const_mul_atTop' (by norm_num)
    have he : Tendsto (fun n : ℕ => (-1 : ℝ) ^ (2 * n)) atTop (𝓝 L) := hL.comp hm
    have ho : Tendsto (fun n : ℕ => (-1 : ℝ) ^ (2 * n + 1)) atTop (𝓝 L) :=
      hL.comp ((tendsto_add_atTop_nat 1).comp hm)
    have e1 : ∀ n : ℕ, (-1 : ℝ) ^ (2 * n) = 1 := fun n => by rw [pow_mul]; norm_num
    have e2 : ∀ n : ℕ, (-1 : ℝ) ^ (2 * n + 1) = -1 := fun n => by rw [pow_succ, pow_mul]; norm_num
    simp only [e1, e2] at he ho
    have h1 := tendsto_nhds_unique he tendsto_const_nhds
    have h2 := tendsto_nhds_unique ho tendsto_const_nhds
    rw [h1] at h2; norm_num at h2

/-- Razlaga 8: vsako konvergentno zaporedje je omejeno (obstajata m in M z m ≤ aₙ ≤ M). -/
theorem konvergentno_omejeno (a : ℕ → ℝ) (L : ℝ) (h : Tendsto a atTop (𝓝 L)) :
    ∃ m M, ∀ n, m ≤ a n ∧ a n ≤ M := by
  obtain ⟨M, hM⟩ := h.bddAbove_range
  obtain ⟨m, hm⟩ := h.bddBelow_range
  exact ⟨m, M, fun n => ⟨hm ⟨n, rfl⟩, hM ⟨n, rfl⟩⟩⟩

/-- Razlaga 8: vsako monotono in omejeno zaporedje je konvergentno (naraščajoče in navzgor omejeno
ali padajoče in navzdol omejeno). -/
theorem monotono_omejeno (a : ℕ → ℝ) :
    (Monotone a → BddAbove (Set.range a) → ∃ L, Tendsto a atTop (𝓝 L)) ∧
    (Antitone a → BddBelow (Set.range a) → ∃ L, Tendsto a atTop (𝓝 L)) :=
  ⟨fun hm hb => ⟨_, tendsto_atTop_ciSup hm hb⟩, fun hm hb => ⟨_, tendsto_atTop_ciInf hm hb⟩⟩

/-- »Bolj natančno«: limita je ena sama. -/
theorem limita_enolicna (a : ℕ → ℝ) (L₁ L₂ : ℝ) (h₁ : Tendsto a atTop (𝓝 L₁))
    (h₂ : Tendsto a atTop (𝓝 L₂)) : L₁ = L₂ := tendsto_nhds_unique h₁ h₂

/-! ## Rešeni primeri -/

/-- Primer 1: aₙ = (n + 2)/(2n): a₁ = 3/2, a₂ = 1, a₃ = 5/6, a₄ = 3/4; aₙ = n/(2n) + 2/(2n) = 1/2 + 1/n;
aₙ₊₁ − aₙ = 1/(n + 1) − 1/n = −1/(n(n + 1)) < 0, zato strogo pada (n ≥ 1). -/
theorem primer1 (n : ℕ) (hn : 1 ≤ n) :
    ((1 + 2) / (2 * 1) : ℝ) = 3 / 2 ∧ ((2 + 2) / (2 * 2) : ℝ) = 1 ∧ ((3 + 2) / (2 * 3) : ℝ) = 5 / 6 ∧
    ((4 + 2) / (2 * 4) : ℝ) = 3 / 4 ∧
    ((n : ℝ) + 2) / (2 * n) = n / (2 * n) + 2 / (2 * n) ∧
    (n : ℝ) / (2 * n) + 2 / (2 * n) = 1 / 2 + 1 / n ∧
    (1 / 2 + 1 / ((n : ℝ) + 1)) - (1 / 2 + 1 / n) = 1 / (n + 1) - 1 / n ∧
    1 / ((n : ℝ) + 1) - 1 / n = -(1 / (n * (n + 1))) ∧
    (((n : ℝ) + 1 + 2) / (2 * (n + 1))) - ((n + 2) / (2 * n)) < 0 := by
  have h : (0 : ℝ) < n := by exact_mod_cast hn
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by ring, ?_, by ring, ?_, ?_⟩
  · field_simp
  · field_simp; ring
  · rw [sub_neg, div_lt_div_iff₀ (by positivity) (by positivity)]; nlinarith

/-- Primer 2: vₙ = 100n/(n + 1/2) = 200n/(2n + 1) = 200/(2 + 1/n) (n ≥ 1); lim vₙ = 200/(2 + 0) = 100. -/
theorem primer2_limita :
    (∀ n : ℕ, 1 ≤ n → 100 * (n : ℝ) / (n + 1 / 2) = 200 * n / (2 * n + 1) ∧
      200 * (n : ℝ) / (2 * n + 1) = 200 / (2 + 1 / n)) ∧
    Tendsto (fun n : ℕ => 200 * (n : ℝ) / (2 * n + 1)) atTop (𝓝 100) := by
  have e : ∀ n : ℕ, 1 ≤ n → 200 * (n : ℝ) / (2 * n + 1) = 200 / (2 + 1 / n) := by
    intro n hn
    have : (0 : ℝ) < n := by exact_mod_cast hn
    field_simp
  refine ⟨fun n hn => ⟨?_, e n hn⟩, ?_⟩
  · have : (0 : ℝ) < n := by exact_mod_cast hn
    field_simp; ring
  · have t := (tendsto_const_nhds (x := (200 : ℝ))).div
      ((tendsto_const_nhds (x := (2 : ℝ))).add lim_1_n) (by norm_num)
    refine lim_od_1 e ?_
    convert t using 2; norm_num

/-- Primer 2, koraki 3–6: 100 − vₙ = (100(2n + 1) − 200n)/(2n + 1) = 100/(2n + 1) > 0;
100/(2n + 1) < 1 ⇔ 2n + 1 > 100 ⇔ n > 49,5, za naravni n torej n ≥ 50; v₄₉ = 9800/99 ≈ 98,99
(do 100 manjka ≈ 1,01), v₅₀ = 10000/101 ≈ 99,01. -/
theorem primer2_okolica (n : ℕ) :
    100 - 200 * (n : ℝ) / (2 * n + 1) = (100 * (2 * n + 1) - 200 * n) / (2 * n + 1) ∧
    (100 * (2 * (n : ℝ) + 1) - 200 * n) / (2 * n + 1) = 100 / (2 * n + 1) ∧
    0 < 100 / (2 * (n : ℝ) + 1) ∧
    (100 / (2 * (n : ℝ) + 1) < 1 ↔ 2 * (n : ℝ) + 1 > 100) ∧
    (2 * (n : ℝ) + 1 > 100 ↔ (n : ℝ) > 49.5) ∧ ((n : ℝ) > 49.5 ↔ 50 ≤ n) ∧
    (200 * 49 / (2 * 49 + 1) : ℝ) = 9800 / 99 ∧
    (98.985 ≤ (9800 / 99 : ℝ) ∧ (9800 / 99 : ℝ) < 98.995) ∧
    (1.005 ≤ 100 - (9800 / 99 : ℝ) ∧ 100 - (9800 / 99 : ℝ) < 1.015) ∧
    (200 * 50 / (2 * 50 + 1) : ℝ) = 10000 / 101 ∧
    (99.005 ≤ (10000 / 101 : ℝ) ∧ (10000 / 101 : ℝ) < 99.015) := by
  have hp : (0 : ℝ) < 2 * n + 1 := by positivity
  refine ⟨by field_simp, by ring, by positivity, by rw [div_lt_one hp], ⟨fun h => by linarith,
    fun h => by linarith⟩, ⟨fun h => ?_, fun h => ?_⟩, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩
  · have : (49 : ℝ) < n := by linarith
    have : 49 < n := by exact_mod_cast this
    omega
  · have : (50 : ℝ) ≤ n := by exact_mod_cast h
    linarith

/-- Primer 3: zdravilo, a₁ = 100, aₙ₊₁ = aₙ/2 + 100: prvi členi 100; 150; 175; 187,5; 193,75;
aₙ < 200 (indukcija); aₙ₊₁ − aₙ = 100 − aₙ/2 > 0, zato strogo narašča; L = L/2 + 100 ⇔ L = 200;
zaporedje konvergira in lim aₙ = 200. -/
theorem primer3 (a : ℕ → ℝ) (h1 : a 1 = 100) (h : ∀ n, 1 ≤ n → a (n + 1) = a n / 2 + 100) :
    (a 2 = 150 ∧ a 3 = 175 ∧ a 4 = 187.5 ∧ a 5 = 193.75) ∧
    (∀ n, 1 ≤ n → a n < 200) ∧
    (∀ n, 1 ≤ n → a (n + 1) - a n = 100 - a n / 2 ∧ 0 < a (n + 1) - a n) ∧
    (∀ L : ℝ, L = L / 2 + 100 ↔ L = 200) ∧
    Tendsto a atTop (𝓝 200) := by
  have a2 : a 2 = 150 := by rw [h 1 le_rfl, h1]; norm_num
  have a3 : a 3 = 175 := by rw [h 2 (by norm_num), a2]; norm_num
  have a4 : a 4 = 187.5 := by rw [h 3 (by norm_num), a3]; norm_num
  have a5 : a 5 = 193.75 := by rw [h 4 (by norm_num), a4]; norm_num
  have lt : ∀ n, 1 ≤ n → a n < 200 := by
    intro n hn
    induction n, hn using Nat.le_induction with
    | base => rw [h1]; norm_num
    | succ n hn ih => rw [h n hn]; linarith
  have e : ∀ n, 1 ≤ n → a n = 200 - 200 * (1 / 2) ^ n := by
    intro n hn
    induction n, hn using Nat.le_induction with
    | base => rw [h1]; norm_num
    | succ n hn ih => rw [h n hn, ih, pow_succ]; ring
  refine ⟨⟨a2, a3, a4, a5⟩, lt, fun n hn => ⟨by rw [h n hn]; ring, ?_⟩,
    fun L => ⟨fun hL => by linarith, fun hL => by rw [hL]; norm_num⟩, ?_⟩
  · rw [h n hn]; linarith [lt n hn]
  · have t := (tendsto_const_nhds (x := (200 : ℝ))).sub
      ((tendsto_pow_atTop_nhds_zero_of_lt_one (by norm_num : (0 : ℝ) ≤ 1 / 2)
      (by norm_num)).const_mul 200)
    rw [mul_zero, sub_zero] at t
    exact lim_od_1 e t

example : ∃ a : ℕ → ℝ, a 1 = 100 ∧ ∀ n, 1 ≤ n → a (n + 1) = a n / 2 + 100 :=
  ⟨fun n => 200 - 200 * (1 / 2) ^ n, by norm_num, fun n _ => by simp only [pow_succ]; ring⟩

/-- Primer 3, korak 5: če zaporedje s tem pravilom konvergira k L, mora biti L = L/2 + 100, torej
L = 200 (sklep iz pravila, ne iz formule). -/
theorem primer3_sklep (a : ℕ → ℝ) (L : ℝ) (h : ∀ n, 1 ≤ n → a (n + 1) = a n / 2 + 100)
    (hL : Tendsto a atTop (𝓝 L)) : L = L / 2 + 100 ∧ L = 200 := by
  have t1 : Tendsto (fun n => a (n + 1)) atTop (𝓝 L) := (tendsto_add_atTop_iff_nat 1).2 hL
  have t2 : Tendsto (fun n => a (n + 1)) atTop (𝓝 (L / 2 + 100)) :=
    lim_od_1 (fun n hn => h n hn) ((hL.div_const 2).add_const 100)
  have := tendsto_nhds_unique t1 t2
  exact ⟨this, by linarith⟩

/-- Primer 4: (2n² − n)/(n² + 3) = (2 − 1/n)/(1 + 3/n²) (n ≥ 1) in limita je (2 − 0)/(1 + 0) = 2. -/
theorem primer4 :
    (∀ n : ℕ, 1 ≤ n → (2 * (n : ℝ) ^ 2 - n) / (n ^ 2 + 3) = (2 - 1 / n) / (1 + 3 / n ^ 2)) ∧
    Tendsto (fun n : ℕ => (2 * (n : ℝ) ^ 2 - n) / (n ^ 2 + 3)) atTop (𝓝 2) := by
  have e : ∀ n : ℕ, 1 ≤ n → (2 * (n : ℝ) ^ 2 - n) / (n ^ 2 + 3) = (2 - 1 / n) / (1 + 3 / n ^ 2) := by
    intro n hn
    have : (0 : ℝ) < n := by exact_mod_cast hn
    field_simp
  refine ⟨e, lim_od_1 e ?_⟩
  have t2 : Tendsto (fun n : ℕ => 3 / (n : ℝ) ^ 2) atTop (𝓝 0) := by
    have := (lim_1_n.pow 2).const_mul 3
    simp only [one_div, inv_pow, ne_eq, OfNat.ofNat_ne_zero, not_false_eq_true, zero_pow,
      mul_zero] at this
    simpa [div_eq_mul_inv] using this
  have := ((tendsto_const_nhds (x := (2 : ℝ))).sub lim_1_n).div
    ((tendsto_const_nhds (x := (1 : ℝ))).add t2) (by norm_num)
  convert this using 2; norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1: členi 1/n se z vsakim korakom približajo tudi −1, pa −1 ni limita. -/
theorem napaka_blizje (n : ℕ) (hn : 1 ≤ n) :
    |1 / ((n : ℝ) + 1) - (-1)| < |1 / (n : ℝ) - (-1)| ∧
    ¬ Tendsto (fun n : ℕ => 1 / (n : ℝ)) atTop (𝓝 (-1)) := by
  have h : (0 : ℝ) < n := by exact_mod_cast hn
  refine ⟨?_, fun ht => by have := tendsto_nhds_unique ht lim_1_n; norm_num at this⟩
  have p1 : 0 < 1 / ((n : ℝ) + 1) := by positivity
  have p2 : 0 < 1 / (n : ℝ) := by positivity
  rw [abs_of_pos (by linarith), abs_of_pos (by linarith)]
  have : 1 / ((n : ℝ) + 1) < 1 / n := one_div_lt_one_div_of_lt h (by linarith)
  linarith

/-- Pogoste napake 2: 1/n ima limito 0, ki ni noben člen (n ≥ 1); konstantno zaporedje 5 ima limito 5. -/
theorem napaka_dosezena : (∀ n : ℕ, 1 ≤ n → 1 / (n : ℝ) ≠ 0) ∧
    Tendsto (fun _ : ℕ => (5 : ℝ)) atTop (𝓝 5) :=
  ⟨fun n hn => by have : (0 : ℝ) < n := by exact_mod_cast hn
                  positivity, tendsto_const_nhds⟩

/-- Pogoste napake 4: (n − 3)² da 4, 1, 0, 1, 4, 9 (n = 1, …, 6), zato ni monotono. -/
theorem napaka_n3 :
    (List.range 6).map (fun k : ℕ => ((k : ℤ) + 1 - 3) ^ 2) = [4, 1, 0, 1, 4, 9] := by decide

/-- Pogoste napake 5: lim (2n + 1)/(n + 3) = 2, ne 1. -/
theorem napaka_2 : Tendsto (fun n : ℕ => (2 * (n : ℝ) + 1) / (n + 3)) atTop (𝓝 2) := by
  have e : ∀ n : ℕ, 1 ≤ n → (2 * (n : ℝ) + 1) / (n + 3) = (2 + 1 / n) / (1 + 3 * (1 / n)) := by
    intro n hn
    have : (0 : ℝ) < n := by exact_mod_cast hn
    field_simp
  refine lim_od_1 e ?_
  have := ((tendsto_const_nhds (x := (2 : ℝ))).add lim_1_n).div
    ((tendsto_const_nhds (x := (1 : ℝ))).add (lim_1_n.const_mul 3)) (by norm_num)
  convert this using 2; norm_num

/-! ## Za maturo -/

/-- Naloga 1: a₁ = 3, aₙ₊₁ = 2aₙ − 1 ⇒ a₂ = 5, a₃ = 9, a₄ = 17, a₅ = 33, a₆ = 65, a₇ = 2·65 − 1 = 129;
aₙ = 2ⁿ + 1; 129 = 2⁷ + 1 je člen natanko pri n = 7. -/
theorem matura1 (a : ℕ → ℤ) (h1 : a 1 = 3) (h : ∀ n, 1 ≤ n → a (n + 1) = 2 * a n - 1) :
    (a 2 = 5 ∧ a 3 = 9 ∧ a 4 = 17 ∧ a 5 = 33 ∧ a 6 = 65 ∧ a 7 = 129) ∧
    (∀ n, 1 ≤ n → a n = 2 ^ n + 1) ∧ (∀ n, 1 ≤ n → (a n = 129 ↔ n = 7)) := by
  have e : ∀ n, 1 ≤ n → a n = 2 ^ n + 1 := by
    intro n hn
    induction n, hn using Nat.le_induction with
    | base => rw [h1]; norm_num
    | succ n hn ih => rw [h n hn, ih, pow_succ]; ring
  refine ⟨⟨?_, ?_, ?_, ?_, ?_, ?_⟩, e, fun n hn => ?_⟩
  · rw [h 1 le_rfl, h1]; norm_num
  · rw [e 3 (by norm_num)]; norm_num
  · rw [e 4 (by norm_num)]; norm_num
  · rw [e 5 (by norm_num)]; norm_num
  · rw [e 6 (by norm_num)]; norm_num
  · calc a 7 = 2 * a 6 - 1 := h 6 (by norm_num)
      _ = 2 * 65 - 1 := by rw [e 6 (by norm_num)]; norm_num
      _ = 129 := by norm_num
  · rw [e n hn]
    constructor
    · intro hc
      have h2 : (2 : ℤ) ^ n = 2 ^ 7 := by linarith
      exact Nat.pow_right_injective (le_refl 2) (by exact_mod_cast h2)
    · rintro rfl; norm_num

example : ∃ a : ℕ → ℤ, a 1 = 3 ∧ ∀ n, 1 ≤ n → a (n + 1) = 2 * a n - 1 :=
  ⟨fun n => 2 ^ n + 1, by norm_num, fun n _ => by simp only [pow_succ]; ring⟩

/-- Naloga 2 a)–b): aₙ = (2n + 5)/(n + 1): a₁ = 7/2, a₂ = 9/3 = 3, a₃ = 11/4;
aₙ = (2(n + 1) + 3)/(n + 1) = 2 + 3/(n + 1); aₙ₊₁ − aₙ = 3/(n + 2) − 3/(n + 1)
= (3(n + 1) − 3(n + 2))/((n + 1)(n + 2)) = −3/((n + 1)(n + 2)) < 0. -/
theorem matura2ab (n : ℕ) :
    ((2 * 1 + 5) / (1 + 1) : ℝ) = 7 / 2 ∧ ((2 * 2 + 5) / (2 + 1) : ℝ) = 9 / 3 ∧ (9 / 3 : ℝ) = 3 ∧
    ((2 * 3 + 5) / (3 + 1) : ℝ) = 11 / 4 ∧
    (2 * (n : ℝ) + 5) / (n + 1) = (2 * (n + 1) + 3) / (n + 1) ∧
    (2 * ((n : ℝ) + 1) + 3) / (n + 1) = 2 + 3 / (n + 1) ∧
    3 / ((n : ℝ) + 2) - 3 / (n + 1) = (3 * (n + 1) - 3 * (n + 2)) / ((n + 1) * (n + 2)) ∧
    (3 * ((n : ℝ) + 1) - 3 * (n + 2)) / ((n + 1) * (n + 2)) = -3 / ((n + 1) * (n + 2)) ∧
    -3 / (((n : ℝ) + 1) * (n + 2)) < 0 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by ring_nf, ?_, ?_, by ring, ?_⟩
  · field_simp
  · field_simp
  · apply div_neg_of_neg_of_pos (by norm_num); positivity

/-- Naloga 2 c): 2 < aₙ ≤ a₁ = 7/2 za vsak n ≥ 1 in lim aₙ = 2 (RAČUN: limita (2n+5)/(n+1) = 2). -/
theorem matura2c :
    (∀ n : ℕ, 1 ≤ n → 2 < (2 * (n : ℝ) + 5) / (n + 1) ∧ (2 * (n : ℝ) + 5) / (n + 1) ≤ 7 / 2) ∧
    Tendsto (fun n : ℕ => (2 * (n : ℝ) + 5) / (n + 1)) atTop (𝓝 2) := by
  refine ⟨fun n hn => ?_, ?_⟩
  · have : (1 : ℝ) ≤ n := by exact_mod_cast hn
    constructor
    · rw [lt_div_iff₀ (by positivity)]; linarith
    · rw [div_le_iff₀ (by positivity)]; linarith
  · have e : ∀ n : ℕ, (2 * (n : ℝ) + 5) / (n + 1) = 2 + 3 * (1 / ((n : ℝ) + 1)) := fun n => by
      field_simp; ring
    simp only [e]
    simpa using (tendsto_const_nhds (x := (2 : ℝ))).add
      ((tendsto_one_div_add_atTop_nhds_zero_nat (𝕜 := ℝ)).const_mul 3)

/-- Naloga 2 d): |aₙ − 2| = 3/(n + 1); 3/(n + 1) < 0,05 ⇔ n > 59; a₅₉ = 2 + 3/60 = 2,05 (rob);
zunaj okolice je natanko 59 členov, a₁, …, a₅₉ (RAČUN: 3/(n+1) = 0,05 ⇔ n = 59). -/
theorem matura2d :
    (∀ n : ℕ, |(2 * (n : ℝ) + 5) / (n + 1) - 2| = 3 / (n + 1)) ∧
    (∀ n : ℕ, 3 / ((n : ℝ) + 1) < 0.05 ↔ 59 < n) ∧
    (∀ x : ℝ, x ≠ -1 → (3 / (x + 1) = 0.05 ↔ x = 59)) ∧
    (2 + 3 / 60 : ℝ) = 2.05 ∧
    {n : ℕ | 1 ≤ n ∧ ¬ |(2 * (n : ℝ) + 5) / (n + 1) - 2| < 0.05} = Set.Icc 1 59 ∧
    (Set.Icc 1 59 : Set ℕ).ncard = 59 := by
  have ab : ∀ n : ℕ, |(2 * (n : ℝ) + 5) / (n + 1) - 2| = 3 / (n + 1) := fun n => by
    rw [show (2 * (n : ℝ) + 5) / (n + 1) - 2 = 3 / (n + 1) by field_simp; ring]
    exact abs_of_pos (by positivity)
  have lt : ∀ n : ℕ, 3 / ((n : ℝ) + 1) < 0.05 ↔ 59 < n := fun n => by
    rw [div_lt_iff₀ (by positivity)]
    constructor
    · intro h; have : (59 : ℝ) < n := by linarith
      exact_mod_cast this
    · intro h; have : (59 : ℝ) < n := by exact_mod_cast h
      linarith
  refine ⟨ab, lt, fun x hx => ?_, by norm_num, ?_, ?_⟩
  · have : x + 1 ≠ 0 := fun h => hx (by linarith)
    rw [div_eq_iff this]; constructor <;> intro h <;> linarith
  · ext n
    simp only [Set.mem_ofPred_eq, Set.mem_Icc, ab, lt]
    omega
  · rw [← Finset.coe_Icc, Set.ncard_coe_finset]; simp

/-- Ustno vprašanje 3: a₁ = 1, aₙ₊₁ = aₙ + 2 ⇒ 1, 3, 5, 7 in aₙ = 2n − 1. -/
theorem ustno3 (a : ℕ → ℝ) (h1 : a 1 = 1) (h : ∀ n, 1 ≤ n → a (n + 1) = a n + 2) :
    (∀ n, 1 ≤ n → a n = 2 * n - 1) ∧ a 2 = 3 ∧ a 3 = 5 ∧ a 4 = 7 := by
  have e : ∀ n, 1 ≤ n → a n = 2 * n - 1 := by
    intro n hn
    induction n, hn using Nat.le_induction with
    | base => rw [h1]; norm_num
    | succ n hn ih => rw [h n hn, ih]; push_cast; ring
  refine ⟨e, ?_, ?_, ?_⟩ <;> (rw [e _ (by norm_num)]; norm_num)

example : ∃ a : ℕ → ℝ, a 1 = 1 ∧ ∀ n, 1 ≤ n → a (n + 1) = a n + 2 :=
  ⟨fun n => 2 * n - 1, by norm_num, fun n _ => by push_cast; ring⟩

/-! ## Drugače -/

/-- Z analogijo: pri 1/n in L = 0 za ε = 0,1 zadošča n₀ = 10, za ε = 0,001 pa n₀ = 1000. -/
theorem sodnik_1n :
    (∀ n : ℕ, 10 < n → |1 / (n : ℝ) - 0| < 0.1) ∧ (∀ n : ℕ, 1000 < n → |1 / (n : ℝ) - 0| < 0.001) := by
  constructor <;> intro n hn
  · have : (10 : ℝ) < n := by exact_mod_cast hn
    rw [sub_zero, abs_of_pos (by positivity), div_lt_iff₀ (by linarith)]; linarith
  · have : (1000 : ℝ) < n := by exact_mod_cast hn
    rw [sub_zero, abs_of_pos (by positivity), div_lt_iff₀ (by linarith)]; linarith

/-- Z analogijo: pri (−1)ⁿ in ε = 1/2 izgubiš za vsak L: ni n₀, da bi bili vsi členi za n > n₀ v pasu. -/
theorem sodnik_minus1 (L : ℝ) : ¬ ∃ n₀ : ℕ, ∀ n > n₀, |(-1 : ℝ) ^ n - L| < 1 / 2 := by
  rintro ⟨n₀, h⟩
  have h1 := h (2 * n₀ + 2) (by omega)
  have h2 := h (2 * n₀ + 3) (by omega)
  rw [show 2 * n₀ + 2 = 2 * (n₀ + 1) by ring, pow_mul] at h1
  rw [show 2 * n₀ + 3 = 2 * (n₀ + 1) + 1 by ring, pow_succ, pow_mul] at h2
  norm_num at h1 h2
  rw [abs_lt] at h1 h2
  linarith [h1.1, h2.2]

/-- Iz vsakdanjega življenja: 1,4 < 1,41 < 1,414 < 1,4142 < √2 < 1,5. -/
theorem koren2_priblizki :
    (1.4 : ℝ) < 1.41 ∧ (1.41 : ℝ) < 1.414 ∧ (1.414 : ℝ) < 1.4142 ∧ (1.4142 : ℝ) < Real.sqrt 2 ∧
    Real.sqrt 2 < 1.5 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, ?_⟩
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num

/-- Iz vsakdanjega življenja: zaporedje decimalnih približkov xₙ = ⌊10ⁿ√2⌋/10ⁿ je naraščajoče,
navzgor omejeno z 1,5 in ima limito √2. -/
theorem koren2_zaporedje :
    let x : ℕ → ℝ := fun n => ⌊Real.sqrt 2 * 10 ^ n⌋ / 10 ^ n
    Monotone x ∧ (∀ n, x n < 1.5) ∧ Tendsto x atTop (𝓝 (Real.sqrt 2)) := by
  intro x
  have le : ∀ n, x n ≤ Real.sqrt 2 := fun n => by
    simp only [x]; rw [div_le_iff₀ (by positivity)]; exact Int.floor_le _
  have gt : ∀ n, Real.sqrt 2 - 1 / 10 ^ n < x n := fun n => by
    simp only [x]
    rw [lt_div_iff₀ (by positivity), sub_mul, one_div_mul_cancel (by positivity)]
    linarith [Int.lt_floor_add_one (Real.sqrt 2 * 10 ^ n)]
  refine ⟨monotone_nat_of_le_succ fun n => ?_, fun n => (le n).trans_lt koren2_priblizki.2.2.2.2, ?_⟩
  · simp only [x]
    rw [div_le_div_iff₀ (by positivity) (by positivity), pow_succ]
    have : (10 : ℝ) * ⌊Real.sqrt 2 * 10 ^ n⌋ ≤ ⌊Real.sqrt 2 * (10 ^ n * 10)⌋ := by
      have : ((10 * ⌊Real.sqrt 2 * 10 ^ n⌋ : ℤ) : ℝ) ≤ Real.sqrt 2 * (10 ^ n * 10) := by
        push_cast; nlinarith [Int.floor_le (Real.sqrt 2 * 10 ^ n)]
      exact_mod_cast Int.le_floor.mpr this
    nlinarith [pow_pos (show (0 : ℝ) < 10 by norm_num) n]
  · have t : Tendsto (fun n : ℕ => Real.sqrt 2 - 1 / (10 : ℝ) ^ n) atTop (𝓝 (Real.sqrt 2)) := by
      have := (tendsto_pow_atTop_nhds_zero_of_lt_one (by norm_num : (0 : ℝ) ≤ 1 / 10)
        (by norm_num))
      simpa [one_div, inv_pow] using (tendsto_const_nhds (x := Real.sqrt 2)).sub this
    exact tendsto_of_tendsto_of_tendsto_of_le_of_le t tendsto_const_nhds (fun n => (gt n).le) le

/-! ## Preveri se -/

/-- Preveri se 2: če prvih 1000 členov 1/n zamenjamo s 7, ostane limita 0. -/
theorem kviz2 : Tendsto (fun n : ℕ => if n ≤ 1000 then (7 : ℝ) else 1 / (n : ℝ)) atTop (𝓝 0) :=
  lim_1_n.congr' (eventually_atTop.2 ⟨1001, fun n hn => by simp [show ¬ n ≤ 1000 by omega]⟩)

/-- Preveri se 3: aₙ = (3n − 1)/(n + 4) → 3, bₙ = (n + 1)/(2n) → 1/2, cₙ = (2n² + 6)/(n² + 1) → 2;
prvi členi a₁ = 0,4, b₁ = 1, c₁ = 4; vrstni red limit b, c, a. -/
theorem kviz3 :
    Tendsto (fun n : ℕ => (3 * (n : ℝ) - 1) / (n + 4)) atTop (𝓝 3) ∧
    Tendsto (fun n : ℕ => ((n : ℝ) + 1) / (2 * n)) atTop (𝓝 (1 / 2)) ∧
    Tendsto (fun n : ℕ => (2 * (n : ℝ) ^ 2 + 6) / (n ^ 2 + 1)) atTop (𝓝 2) ∧
    ((3 * 1 - 1) / (1 + 4) : ℝ) = 0.4 ∧ ((1 + 1) / (2 * 1) : ℝ) = 1 ∧ ((2 * 1 ^ 2 + 6) / (1 ^ 2 + 1) : ℝ) = 4 ∧
    (1 / 2 : ℝ) < 2 ∧ (2 : ℝ) < 3 := by
  have t2 : Tendsto (fun n : ℕ => 1 / (n : ℝ) ^ 2) atTop (𝓝 0) := by
    simpa [one_div, inv_pow] using lim_1_n.pow 2
  refine ⟨?_, ?_, ?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  · have e : ∀ n : ℕ, 1 ≤ n → (3 * (n : ℝ) - 1) / (n + 4) = (3 - 1 / n) / (1 + 4 * (1 / n)) := by
      intro n hn; have : (0 : ℝ) < n := by exact_mod_cast hn
      field_simp
    refine lim_od_1 e ?_
    have := ((tendsto_const_nhds (x := (3 : ℝ))).sub lim_1_n).div
      ((tendsto_const_nhds (x := (1 : ℝ))).add (lim_1_n.const_mul 4)) (by norm_num)
    convert this using 2; norm_num
  · have e : ∀ n : ℕ, 1 ≤ n → ((n : ℝ) + 1) / (2 * n) = (1 + 1 / n) / 2 := by
      intro n hn; have : (0 : ℝ) < n := by exact_mod_cast hn
      field_simp
    refine lim_od_1 e ?_
    have := ((tendsto_const_nhds (x := (1 : ℝ))).add lim_1_n).div_const 2
    convert this using 2; norm_num
  · have e : ∀ n : ℕ, 1 ≤ n →
        (2 * (n : ℝ) ^ 2 + 6) / (n ^ 2 + 1) = (2 + 6 * (1 / n ^ 2)) / (1 + 1 / n ^ 2) := by
      intro n hn; have : (0 : ℝ) < n := by exact_mod_cast hn
      field_simp
    refine lim_od_1 e ?_
    have := ((tendsto_const_nhds (x := (2 : ℝ))).add (t2.const_mul 6)).div
      ((tendsto_const_nhds (x := (1 : ℝ))).add t2) (by norm_num)
    convert this using 2; norm_num

/-- Preveri se 4: lim (5n² − 2)/(2n² + n) = 5/2 = 2,5; a₁ = 1. -/
theorem kviz4 : Tendsto (fun n : ℕ => (5 * (n : ℝ) ^ 2 - 2) / (2 * n ^ 2 + n)) atTop (𝓝 2.5) ∧
    ((5 * 1 ^ 2 - 2) / (2 * 1 ^ 2 + 1) : ℝ) = 1 := by
  refine ⟨?_, by norm_num⟩
  have t2 : Tendsto (fun n : ℕ => 1 / (n : ℝ) ^ 2) atTop (𝓝 0) := by
    simpa [one_div, inv_pow] using lim_1_n.pow 2
  have e : ∀ n : ℕ, 1 ≤ n →
      (5 * (n : ℝ) ^ 2 - 2) / (2 * n ^ 2 + n) = (5 - 2 * (1 / n ^ 2)) / (2 + 1 / n) := by
    intro n hn; have : (0 : ℝ) < n := by exact_mod_cast hn
    field_simp
  refine lim_od_1 e ?_
  have := ((tendsto_const_nhds (x := (5 : ℝ))).sub (t2.const_mul 2)).div
    ((tendsto_const_nhds (x := (2 : ℝ))).add lim_1_n) (by norm_num)
  convert this using 2; norm_num

/-- Preveri se 5: vₙ = 90 − 30/n; v₁ = 60; |vₙ − 90| = 30/n < 2 ⇔ n > 15, torej od n = 16 naprej;
pri n = 15 je razlika natanko 2. -/
theorem kviz5 :
    (90 - 30 / 1 : ℝ) = 60 ∧ (∀ n : ℕ, 1 ≤ n → (|90 - 30 / (n : ℝ) - 90| < 2 ↔ 16 ≤ n)) ∧
    (30 / 15 : ℝ) = 2 := by
  refine ⟨by norm_num, fun n hn => ?_, by norm_num⟩
  have h : (0 : ℝ) < n := by exact_mod_cast hn
  rw [show 90 - 30 / (n : ℝ) - 90 = -(30 / n) by ring, abs_neg, abs_of_pos (by positivity),
    div_lt_iff₀ h]
  constructor
  · intro h'; have : (15 : ℝ) < n := by linarith
    have : 15 < n := by exact_mod_cast this
    omega
  · intro h'; have : (16 : ℝ) ≤ n := by exact_mod_cast h'
    linarith

/-- RAČUN: 2·3 − 1 = 5, 2·5 − 1 = 9, 2·9 − 1 = 17, 2·65 − 1 = 129, 2⁷ + 1 = 129, (2·1 + 5)/(1 + 1) = 7/2,
(2·3 + 5)/(3 + 1) = 11/4, 2 + 3/60 = 2,05. -/
theorem racun : (2 * 3 - 1 : ℝ) = 5 ∧ (2 * 5 - 1 : ℝ) = 9 ∧ (2 * 9 - 1 : ℝ) = 17 ∧
    (2 * 65 - 1 : ℝ) = 129 ∧ (2 ^ 7 + 1 : ℝ) = 129 ∧ ((2 * 1 + 5) / (1 + 1) : ℝ) = 7 / 2 ∧
    ((2 * 3 + 5) / (3 + 1) : ℝ) = 11 / 4 ∧ (2 + 3 / 60 : ℝ) = 2.05 := by norm_num

end Evklid.Lekcije.MAT_SS_4.Zaporedja
