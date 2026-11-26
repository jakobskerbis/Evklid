/-
vir: content/lessons/MAT-SS-1/realna-stevila-in-intervali.md
sha256: c61141bf4189d06b7c5fe7f9a09a8036cb050aae678cfca409a43ad0950492e8
Ni v Leanu: zgodbe (zdravnica, izvid, Nina) kot besedilo, njihove številke so dokazane; »vsakemu realnemu številu
pripada natanko ena točka premice in obratno« (geometrijski aksiom, ne trditev o številih); konstrukcija √10 in √2
z ravnilom in šestilom v Nalogi 2 a) in Ustnem vprašanju 2 (geometrijski postopek; dokazano je, da je hipotenuza
s katetama 3 in 1 oziroma 1 in 1 dolga √10 oziroma √2); risbe, krožci in simulacija (dokazani so preseki
[1, 5] ∩ [3, 8] = [3, 5] in [1, 5) ∩ [3, 8] = [3, 5)); dogovori o zapisu: oklepaji ob ∞, podpičje med decimalnimi
krajišči, »odprt, zaprt, polodprt« (imena; dokazano je, kaj vsak zapis vsebuje); oznaka 𝕀 (v Leanu `Irrational`);
točkovanje; trditev Razlage 1 »decimalni zapis racionalnega števila je končen ali periodičen« (zahtevno, še ni
dokazano, tudi v `RacionalnaStevila.lean` ne; dokazana je obratna smer za iracionalna števila:
`iracionalno_neperiodicno`).
Dogovori: intervali so Mathlibovi `Set.Ioo`, `Set.Icc`, `Set.Ico`, `Set.Ioc`, `Set.Ioi`, `Set.Ici`, `Set.Iio`,
`Set.Iic`, (−∞, ∞) je `Set.univ`. Periodični decimalni zapis `rep p L` (perioda p z L mesti) je enak kot v
`RacionalnaStevila.lean`: ∑ₖ p · (10^L)^−(k+1). Dolžina intervala je mera `volume`.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.RealnaStevilaInIntervali

open Real MeasureTheory

/-! ## Razlaga 1: iracionalna in realna števila -/

/-- Periodični del 0,(p)(p)(p)…: perioda p z L mesti (enako kot v `RacionalnaStevila.lean`). -/
noncomputable def rep (p : ℝ) (L : ℕ) : ℝ := ∑' k : ℕ, p * ((10 : ℝ) ^ L)⁻¹ ^ (k + 1)

/-- Pomožno: 0,(p)(p)… = p / (10^L − 1). -/
theorem rep_eq (p : ℝ) {L : ℕ} (hL : 1 ≤ L) : rep p L = p / (10 ^ L - 1) := by
  have h1 : (1 : ℝ) < 10 ^ L := one_lt_pow₀ (by norm_num) (by omega)
  have hr0 : 0 ≤ ((10 : ℝ) ^ L)⁻¹ := by positivity
  have hr1 : ((10 : ℝ) ^ L)⁻¹ < 1 := inv_lt_one_of_one_lt₀ h1
  have hs : ∀ k : ℕ, p * ((10 : ℝ) ^ L)⁻¹ ^ (k + 1) = (p * ((10 : ℝ) ^ L)⁻¹) * ((10 : ℝ) ^ L)⁻¹ ^ k :=
    fun k => by ring
  unfold rep
  rw [tsum_congr hs, tsum_mul_left, tsum_geometric_of_lt_one hr0 hr1]
  have ht : (10 : ℝ) ^ L ≠ 0 := by positivity
  have ht1 : (10 : ℝ) ^ L - 1 ≠ 0 := by linarith
  have h2 : 1 - ((10 : ℝ) ^ L)⁻¹ = ((10 : ℝ) ^ L - 1) / 10 ^ L := by field_simp
  rw [h2, inv_div]
  field_simp

/-- Razlaga 1 in Povzetek: iracionalno število nima končnega (m / 10ᵏ) ne periodičnega
(d / 10ⁿ + 0,(p)… / 10ⁿ) decimalnega zapisa. -/
theorem iracionalno_neperiodicno (x : ℝ) (hx : Irrational x) :
    (¬ ∃ m : ℤ, ∃ k : ℕ, x = m / 10 ^ k) ∧
    ¬ ∃ d p : ℤ, ∃ n L : ℕ, 1 ≤ L ∧ x = d / 10 ^ n + rep p L / 10 ^ n := by
  constructor
  · rintro ⟨m, k, rfl⟩
    exact hx ⟨(m : ℚ) / 10 ^ k, by push_cast; rfl⟩
  · rintro ⟨d, p, n, L, hL, rfl⟩
    refine hx ⟨(d : ℚ) / 10 ^ n + ((p : ℚ) / (10 ^ L - 1)) / 10 ^ n, ?_⟩
    rw [rep_eq _ hL]; push_cast; ring

/-- Zakaj se tega učimo in Razlaga 1: diagonala kvadrata s stranico 1 ima d² = 1² + 1² = 2, zato d = √2; nobeno
racionalno število na kvadrat ni 2, √2 je iracionalno. -/
theorem diagonala (d : ℝ) (hd : 0 < d) (h : d ^ 2 = 1 ^ 2 + 1 ^ 2) :
    (1 : ℝ) ^ 2 + 1 ^ 2 = 2 ∧ d = √2 ∧ (∀ q : ℚ, q ^ 2 ≠ 2) ∧ Irrational (√2) := by
  have h2 : d ^ 2 = 2 := by rw [h]; norm_num
  refine ⟨by norm_num, ?_, fun q hq => ?_, irrational_sqrt_two⟩
  · rw [← h2, Real.sqrt_sq hd.le]
  · have : ((q : ℝ)) ^ 2 = 2 := by exact_mod_cast hq
    have h' : |(q : ℝ)| = √2 := by rw [← Real.sqrt_sq_eq_abs, this]
    exact irrational_sqrt_two ⟨|q|, by push_cast; exact h'⟩

/-- Predpostavke `diagonala` se dajo izpolniti (d = √2). -/
example : 0 < √2 ∧ (√2) ^ 2 = 1 ^ 2 + 1 ^ 2 := ⟨by positivity, by rw [Real.sq_sqrt (by norm_num)]; norm_num⟩

/-- Razlaga 1: π je iracionalen; √2 = 1,41421356… in π = 3,14159265… (prvih osem decimalk). -/
theorem pi_sqrt2 : Irrational π ∧ (1.41421356 : ℝ) < √2 ∧ √2 < 1.41421357 ∧ (3.14159265 : ℝ) < π ∧
    π < 3.14159266 := by
  refine ⟨irrational_pi, ?_, ?_, ?_, ?_⟩
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num
  · linarith [pi_gt_d20]
  · linarith [pi_lt_d20]

/-- Razlaga 1 in Povzetek: ℝ = ℚ ∪ 𝕀 (vsako realno število je racionalno ali iracionalno; v Leanu to sledi iz
definicije `Irrational`); ℚ ⊂ ℝ je prava (vsebina: √2 ni racionalno). -/
theorem r_q_i : Set.range ((↑) : ℚ → ℝ) ∪ {x | Irrational x} = Set.univ ∧
    Set.range ((↑) : ℚ → ℝ) ≠ Set.univ := by
  constructor
  · ext x; simp only [Set.mem_union, Set.mem_ofPred_eq, Set.mem_univ, iff_true]
    by_cases h : x ∈ Set.range ((↑) : ℚ → ℝ)
    · exact Or.inl h
    · exact Or.inr h
  · intro h
    exact irrational_sqrt_two (h ▸ Set.mem_univ (√2))

/-- Razlaga 1: koren naravnega števila je iracionalen natanko tedaj, ko število ni popoln kvadrat;
če je n popoln kvadrat, je √n naravno število; √9 = 3, √16 = 4; √2, √3, √5 so iracionalni. -/
theorem koreni (n : ℕ) : (Irrational (√(n : ℝ)) ↔ ¬ IsSquare n) ∧ (IsSquare n → ∃ m : ℕ, √(n : ℝ) = m) ∧
    √(9 : ℝ) = 3 ∧ √(16 : ℝ) = 4 ∧
    Irrational (√(2 : ℝ)) ∧ Irrational (√(3 : ℝ)) ∧ Irrational (√(5 : ℝ)) := by
  refine ⟨irrational_sqrt_natCast_iff, ?_, ?_, ?_, irrational_sqrt_two, ?_, ?_⟩
  · rintro ⟨m, rfl⟩
    exact ⟨m, by push_cast; rw [Real.sqrt_mul_self (Nat.cast_nonneg m)]⟩
  · rw [show (9 : ℝ) = 3 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (16 : ℝ) = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · have := (irrational_sqrt_natCast_iff (n := 3)).mpr (by
      rintro ⟨r, hr⟩; have : r ≤ 2 := by nlinarith
      interval_cases r <;> omega)
    simpa using this
  · have := (irrational_sqrt_natCast_iff (n := 5)).mpr (by
      rintro ⟨r, hr⟩; have : r ≤ 3 := by nlinarith
      interval_cases r <;> omega)
    simpa using this

/-- Razlaga 1: 1,41² = 1,9881 in 1,42² = 2,0164, zato 1,41 < √2 < 1,42. -/
theorem ocena_sqrt2 : (1.41 : ℝ) ^ 2 = 1.9881 ∧ (1.42 : ℝ) ^ 2 = 2.0164 ∧ (1.41 : ℝ) < √2 ∧ √2 < 1.42 := by
  refine ⟨by norm_num, by norm_num, ?_, ?_⟩
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num

/-- Zakaj se tega učimo in Razlaga 3: med temperaturami t < 38 ni največje ((t + 38)/2 je večja in še pod 38);
37,9 < 37,99 < 37,999 < 38; pri t ≤ 38 je največja 38. -/
theorem ni_najvisje : (¬ ∃ t : ℝ, t < 38 ∧ ∀ s, s < 38 → s ≤ t) ∧
    (∀ t : ℝ, t < 38 → t < (t + 38) / 2 ∧ (t + 38) / 2 < 38) ∧
    ((37.9 : ℝ) < 37.99 ∧ (37.99 : ℝ) < 37.999 ∧ (37.999 : ℝ) < 38) ∧ IsGreatest (Set.Iic (38 : ℝ)) 38 := by
  refine ⟨fun ⟨t, ht, h⟩ => ?_, fun t ht => ⟨by linarith, by linarith⟩, by norm_num, isGreatest_Iic⟩
  have := h ((t + 38) / 2) (by linarith)
  linarith

/-! ## Razlaga 2: absolutna vrednost -/

/-- Razlaga 2 in Ustno vprašanje 1: |x| = x za x ≥ 0, |x| = −x za x < 0; |5| = 5, |−5| = 5, |0| = 0;
|√2 − 2| = 2 − √2. -/
theorem absolutna (x : ℝ) : (0 ≤ x → |x| = x) ∧ (x < 0 → |x| = -x) ∧ |(5 : ℝ)| = 5 ∧ |(-5 : ℝ)| = 5 ∧
    |(0 : ℝ)| = 0 ∧ |√2 - 2| = 2 - √2 := by
  refine ⟨abs_of_nonneg, abs_of_neg, by norm_num, by norm_num, by norm_num, ?_⟩
  have : √2 < 2 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  rw [abs_of_neg (by linarith)]; ring

/-- Razlaga 2, premisli: |x| = −x natanko za x ≤ 0. -/
theorem abs_eq_neg (x : ℝ) : |x| = -x ↔ x ≤ 0 := abs_eq_neg_self

/-- Razlaga 2, Povzetek in Ustno vprašanje 1: lastnosti absolutne vrednosti in razdalje. -/
theorem lastnosti (a b x : ℝ) :
    |a - b| = |b - a| ∧ 0 ≤ |x| ∧ (|x| = 0 ↔ x = 0) ∧ |-x| = |x| ∧ |a * b| = |a| * |b| ∧
    (b ≠ 0 → |a / b| = |a| / |b|) ∧ |a + b| ≤ |a| + |b| :=
  ⟨abs_sub_comm a b, abs_nonneg x, abs_eq_zero, abs_neg x, abs_mul a b, fun _ => abs_div a b, abs_add_le a b⟩

/-- Razlaga 2 in Povzetek: enačba |x| = a: pri a > 0 je x = a ali x = −a, pri a = 0 je x = 0, pri a < 0 ni
rešitve. -/
theorem enacba_abs (x a : ℝ) : (0 < a → (|x| = a ↔ x = a ∨ x = -a)) ∧ (|x| = 0 ↔ x = 0) ∧ (a < 0 → |x| ≠ a) :=
  ⟨fun ha => abs_eq ha.le, abs_eq_zero, fun ha h => by linarith [abs_nonneg x]⟩

/-- Razlaga 2: |x − c| = r (r > 0) ⇔ x = c − r ali x = c + r. -/
theorem enacba_abs_c (x c r : ℝ) (hr : 0 < r) : |x - c| = r ↔ x = c - r ∨ x = c + r := by
  rw [abs_eq hr.le]
  constructor
  · rintro (h | h)
    · right; linarith
    · left; linarith
  · rintro (h | h)
    · right; linarith
    · left; linarith

/-- Predpostavke `enacba_abs_c` se dajo izpolniti (r = 1). -/
example : (0 : ℝ) < 1 := one_pos

/-- Razlaga 2 in RACUN: |2x − 1| = 7 ⇔ x = 4 ali x = −3. -/
theorem enacba_2x1 (x : ℝ) : |2 * x - 1| = 7 ↔ x = 4 ∨ x = -3 := by
  rw [abs_eq (by norm_num : (0 : ℝ) ≤ 7)]
  constructor
  · rintro (h | h)
    · left; linarith
    · right; linarith
  · rintro (h | h)
    · left; rw [h]; norm_num
    · right; rw [h]; norm_num

/-- Razlaga 2: |x − 3| = x − 3 za x ≥ 3, 3 − x za x < 3; za x < 3 je |x − 3| + x = (3 − x) + x = 3. -/
theorem abs_x3 (x : ℝ) : (3 ≤ x → |x - 3| = x - 3) ∧ (x < 3 → |x - 3| = 3 - x) ∧
    (x < 3 → |x - 3| + x = (3 - x) + x ∧ (3 - x) + x = 3) := by
  refine ⟨fun h => abs_of_nonneg (by linarith), fun h => by rw [abs_of_neg (by linarith)]; ring, fun h => ?_⟩
  rw [abs_of_neg (by linarith)]; constructor <;> ring

/-! ## Razlaga 3–4: intervali in operacije -/

/-- Razlaga 3 (tabela): pomen vseh devetih vrst intervalov. -/
theorem intervali (a b x : ℝ) :
    (x ∈ Set.Ioo a b ↔ a < x ∧ x < b) ∧ (x ∈ Set.Icc a b ↔ a ≤ x ∧ x ≤ b) ∧
    (x ∈ Set.Ico a b ↔ a ≤ x ∧ x < b) ∧ (x ∈ Set.Ioc a b ↔ a < x ∧ x ≤ b) ∧
    (x ∈ Set.Ioi a ↔ a < x) ∧ (x ∈ Set.Ici a ↔ a ≤ x) ∧ (x ∈ Set.Iio b ↔ x < b) ∧ (x ∈ Set.Iic b ↔ x ≤ b) ∧
    x ∈ (Set.univ : Set ℝ) :=
  ⟨Iff.rfl, Iff.rfl, Iff.rfl, Iff.rfl, Iff.rfl, Iff.rfl, Iff.rfl, Iff.rfl, Set.mem_univ x⟩

/-- Razlaga 3 in Pogoste napake 5: [2, 5] vsebuje tudi 2,5, π in √10; [3,5; 5,1] vsebuje 4,27 in √20. -/
theorem vsa_stevila : (2.5 : ℝ) ∈ Set.Icc (2 : ℝ) 5 ∧ π ∈ Set.Icc (2 : ℝ) 5 ∧ √10 ∈ Set.Icc (2 : ℝ) 5 ∧
    (4.27 : ℝ) ∈ Set.Icc (3.5 : ℝ) 5.1 ∧ √20 ∈ Set.Icc (3.5 : ℝ) 5.1 := by
  refine ⟨by norm_num, ⟨by linarith [pi_gt_three], by linarith [pi_lt_four]⟩, ⟨?_, ?_⟩, by norm_num, ⟨?_, ?_⟩⟩
  · rw [Real.le_sqrt (by norm_num) (by norm_num)]; norm_num
  · rw [Real.sqrt_le_left (by norm_num)]; norm_num
  · rw [Real.le_sqrt (by norm_num) (by norm_num)]; norm_num
  · rw [Real.sqrt_le_left (by norm_num)]; norm_num

/-- Razlaga 3: dolžina intervala [a, b] je b − a, središče (a + b)/2 leži v njem. -/
theorem dolzina_sredisce (a b : ℝ) (h : a < b) :
    volume (Set.Icc a b) = ENNReal.ofReal (b - a) ∧ (a + b) / 2 ∈ Set.Ioo a b :=
  ⟨Real.volume_Icc, ⟨by linarith, by linarith⟩⟩

/-- Predpostavke `dolzina_sredisce` se dajo izpolniti (1 < 5). -/
example : (1 : ℝ) < 5 := by norm_num

/-- Razlaga 4: A = [1, 5], B = (3, 8): A ∩ B = (3, 5], A ∪ B = [1, 8), A ∖ B = [1, 3]. -/
theorem operacije_1_5_3_8 :
    Set.Icc (1 : ℝ) 5 ∩ Set.Ioo 3 8 = Set.Ioc 3 5 ∧ Set.Icc (1 : ℝ) 5 ∪ Set.Ioo 3 8 = Set.Ico 1 8 ∧
    Set.Icc (1 : ℝ) 5 \ Set.Ioo 3 8 = Set.Icc 1 3 := by
  refine ⟨?_, ?_, ?_⟩ <;> ext x <;>
    simp only [Set.mem_inter_iff, Set.mem_union, Set.mem_sdiff, Set.mem_Icc, Set.mem_Ioo, Set.mem_Ioc,
      Set.mem_Ico, not_and_or, not_lt]
  · constructor
    · rintro ⟨⟨_, h2⟩, h3, _⟩; exact ⟨h3, h2⟩
    · rintro ⟨h1, h2⟩; exact ⟨⟨by linarith, h2⟩, h1, by linarith⟩
  · constructor
    · rintro (⟨h1, h2⟩ | ⟨h1, h2⟩)
      · exact ⟨h1, by linarith⟩
      · exact ⟨by linarith, h2⟩
    · rintro ⟨h1, h2⟩
      rcases le_or_gt x 5 with h | h
      · exact Or.inl ⟨h1, h⟩
      · exact Or.inr ⟨by linarith, h2⟩
  · constructor
    · rintro ⟨⟨h1, h2⟩, h3 | h3⟩
      · exact ⟨h1, h3⟩
      · exact ⟨h1, by linarith⟩
    · rintro ⟨h1, h2⟩; exact ⟨⟨h1, by linarith⟩, Or.inl h2⟩

/-- Razlaga 4 (simulacija): [1, 5] ∩ [3, 8] = [3, 5] in [1, 5) ∩ [3, 8] = [3, 5). -/
theorem simulacija : Set.Icc (1 : ℝ) 5 ∩ Set.Icc 3 8 = Set.Icc 3 5 ∧ Set.Ico (1 : ℝ) 5 ∩ Set.Icc 3 8 = Set.Ico 3 5 := by
  constructor
  · rw [Set.Icc_inter_Icc]; norm_num
  · ext x; simp only [Set.mem_inter_iff, Set.mem_Ico, Set.mem_Icc]
    constructor
    · rintro ⟨⟨_, h2⟩, h3, _⟩; exact ⟨h3, h2⟩
    · rintro ⟨h1, h2⟩; exact ⟨⟨by linarith, h2⟩, h1, by linarith⟩

/-- Razlaga 4: (−∞, −2) ∪ (3, ∞) ni en interval: vsebuje −3 in 4, ne pa 0 med njima. -/
theorem dva_dela : (-3 : ℝ) ∈ Set.Iio (-2) ∪ Set.Ioi 3 ∧ (4 : ℝ) ∈ Set.Iio (-2) ∪ Set.Ioi 3 ∧
    (0 : ℝ) ∉ Set.Iio (-2) ∪ Set.Ioi 3 := by
  simp only [Set.mem_union, Set.mem_Iio, Set.mem_Ioi]; norm_num

/-! ## Razlaga 5: absolutna vrednost in intervali -/

/-- Razlaga 5, Povzetek in Ustno vprašanje 3: |x − c| < r, ≤ r, > r, ≥ r kot interval oziroma unija. -/
theorem abs_intervali (x c r : ℝ) :
    (|x - c| < r ↔ x ∈ Set.Ioo (c - r) (c + r)) ∧ (|x - c| ≤ r ↔ x ∈ Set.Icc (c - r) (c + r)) ∧
    (r < |x - c| ↔ x ∈ Set.Iio (c - r) ∪ Set.Ioi (c + r)) ∧
    (r ≤ |x - c| ↔ x ∈ Set.Iic (c - r) ∪ Set.Ici (c + r)) := by
  simp only [Set.mem_Ioo, Set.mem_Icc, Set.mem_union, Set.mem_Iio, Set.mem_Ioi, Set.mem_Iic, Set.mem_Ici]
  refine ⟨?_, ?_, ?_, ?_⟩
  · rw [abs_lt]; constructor <;> rintro ⟨h1, h2⟩ <;> constructor <;> linarith
  · rw [abs_le]; constructor <;> rintro ⟨h1, h2⟩ <;> constructor <;> linarith
  · rw [lt_abs]; constructor
    · rintro (h | h)
      · right; linarith
      · left; linarith
    · rintro (h | h)
      · right; linarith
      · left; linarith
  · rw [le_abs']; constructor
    · rintro (h | h)
      · left; linarith
      · right; linarith
    · rintro (h | h)
      · left; linarith
      · right; linarith

/-- Razlaga 5 in Pogoste napake 3: |x| > 3 ni isto kot x > 3 (−4 je rešitev); |x| < 3 je (−3, 3), |x| > 3 je
(−∞, −3) ∪ (3, ∞); |x − 2| < 3 ⇔ x ∈ (−1, 5). -/
theorem abs_primeri (x : ℝ) : (3 < |(-4 : ℝ)| ∧ ¬ (3 < (-4 : ℝ))) ∧ (|x| < 3 ↔ x ∈ Set.Ioo (-3) 3) ∧
    (3 < |x| ↔ x ∈ Set.Iio (-3) ∪ Set.Ioi 3) ∧ (|x - 2| < 3 ↔ x ∈ Set.Ioo (-1) 5) := by
  have h0 := abs_intervali x 0 3
  have h2 := abs_intervali x 2 3
  simp only [sub_zero, zero_sub, zero_add] at h0
  norm_num at h2
  refine ⟨by norm_num, h0.1, h0.2.2.1, h2.1⟩

/-- Razlaga 5, premisli: |x − 4| ≥ 1 ⇔ x ∈ (−∞, 3] ∪ [5, ∞); 4 ni rešitev, 3 in 5 sta. -/
theorem premisli_4_1 (x : ℝ) : (1 ≤ |x - 4| ↔ x ∈ Set.Iic 3 ∪ Set.Ici 5) ∧ ¬ (1 ≤ |(4 : ℝ) - 4|) ∧
    1 ≤ |(3 : ℝ) - 4| ∧ 1 ≤ |(5 : ℝ) - 4| := by
  have h := (abs_intervali x 4 1).2.2.2
  norm_num at h
  refine ⟨by rw [h]; simp only [Set.mem_union, Set.mem_Iic, Set.mem_Ici], by norm_num, by norm_num, by norm_num⟩

/-! ## Rešeni primeri -/

/-- Primer 1: |−3| + |5 − 9| − |−2| = 3 + 4 − 2 = 5; |AB| = |3 − (−4)| = |7| = 7 = |−4 − 3|. -/
theorem primer1 : |(-3 : ℝ)| + |(5 : ℝ) - 9| - |(-2 : ℝ)| = 3 + 4 - 2 ∧ (3 : ℝ) + 4 - 2 = 5 ∧ (5 : ℝ) - 9 = -4 ∧
    |(3 : ℝ) - (-4)| = |(7 : ℝ)| ∧ |(7 : ℝ)| = 7 ∧ |(-4 : ℝ) - 3| = 7 := by norm_num

/-- Primer 2: A = [−2, 4), B = (1, 6]: A ∩ B = (1, 4), A ∪ B = [−2, 6], A ∖ B = [−2, 1]; 1 ∈ A ∖ B, 4 ∈ A ∪ B,
4 ∉ A ∩ B. -/
theorem primer2 :
    Set.Ico (-2 : ℝ) 4 ∩ Set.Ioc 1 6 = Set.Ioo 1 4 ∧ Set.Ico (-2 : ℝ) 4 ∪ Set.Ioc 1 6 = Set.Icc (-2) 6 ∧
    Set.Ico (-2 : ℝ) 4 \ Set.Ioc 1 6 = Set.Icc (-2) 1 ∧ (1 : ℝ) ∈ Set.Ico (-2 : ℝ) 4 \ Set.Ioc 1 6 ∧
    (4 : ℝ) ∈ Set.Ico (-2 : ℝ) 4 ∪ Set.Ioc 1 6 ∧ (4 : ℝ) ∉ Set.Ico (-2 : ℝ) 4 ∩ Set.Ioc 1 6 := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_⟩
  · ext x; simp only [Set.mem_inter_iff, Set.mem_Ico, Set.mem_Ioc, Set.mem_Ioo]
    constructor
    · rintro ⟨⟨_, h2⟩, h3, _⟩; exact ⟨h3, h2⟩
    · rintro ⟨h1, h2⟩; exact ⟨⟨by linarith, h2⟩, h1, by linarith⟩
  · ext x; simp only [Set.mem_union, Set.mem_Ico, Set.mem_Ioc, Set.mem_Icc]
    constructor
    · rintro (⟨h1, h2⟩ | ⟨h1, h2⟩)
      · exact ⟨h1, by linarith⟩
      · exact ⟨by linarith, h2⟩
    · rintro ⟨h1, h2⟩
      rcases lt_or_ge x 4 with h | h
      · exact Or.inl ⟨h1, h⟩
      · exact Or.inr ⟨by linarith, h2⟩
  · ext x; simp only [Set.mem_sdiff, Set.mem_Ico, Set.mem_Ioc, Set.mem_Icc, not_and_or, not_lt]
    constructor
    · rintro ⟨⟨h1, _⟩, h3 | h3⟩
      · exact ⟨h1, h3⟩
      · exact ⟨h1, by linarith⟩
    · rintro ⟨h1, h2⟩; exact ⟨⟨h1, by linarith⟩, Or.inl h2⟩
  · simp only [Set.mem_sdiff, Set.mem_Ico, Set.mem_Ioc]; norm_num
  · simp only [Set.mem_union, Set.mem_Ico, Set.mem_Ioc]; norm_num
  · simp only [Set.mem_inter_iff, Set.mem_Ico, Set.mem_Ioc]; norm_num

/-- Primer 3: [60, 100]; c = (60 + 100)/2 = 80, r = (100 − 60)/2 = 20; |x − 80| ≤ 20 ⇔ x ∈ [60, 100];
|58 − 80| = 22 > 20 (ni normalen), |96 − 80| = 16 ≤ 20 (je normalen). -/
theorem primer3 (x : ℝ) :
    ((60 : ℝ) + 100) / 2 = 80 ∧ ((100 : ℝ) - 60) / 2 = 20 ∧ (|x - 80| ≤ 20 ↔ x ∈ Set.Icc (60 : ℝ) 100) ∧
    (80 : ℝ) - 20 = 60 ∧ (80 : ℝ) + 20 = 100 ∧ |(58 : ℝ) - 80| = 22 ∧ (20 : ℝ) < 22 ∧ |(96 : ℝ) - 80| = 16 ∧
    (16 : ℝ) ≤ 20 := by
  have h := (abs_intervali x 80 20).2.1
  norm_num at h
  exact ⟨by norm_num, by norm_num, h, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Primer 4 a): E = |x + 1| + |x − 3| je za −1 ≤ x < 3 enak (x + 1) + (3 − x) = 4, za x ≥ 3 pa
(x + 1) + (x − 3) = 2x − 2; preizkusa |1| + |−3| = 4 in |6| + |2| = 8 = 2 · 5 − 2. -/
theorem primer4a (x : ℝ) :
    (-1 ≤ x → x < 3 → |x + 1| + |x - 3| = (x + 1) + (3 - x) ∧ (x + 1) + (3 - x) = 4) ∧
    (3 ≤ x → |x + 1| + |x - 3| = (x + 1) + (x - 3) ∧ (x + 1) + (x - 3) = 2 * x - 2) ∧
    |(1 : ℝ)| + |(-3 : ℝ)| = 4 ∧ |(6 : ℝ)| + |(2 : ℝ)| = 8 ∧ (8 : ℝ) = 2 * 5 - 2 := by
  refine ⟨fun h1 h2 => ⟨?_, by ring⟩, fun h => ⟨?_, by ring⟩, by norm_num, by norm_num, by norm_num⟩
  · rw [abs_of_nonneg (by linarith), abs_of_neg (by linarith)]; ring
  · rw [abs_of_nonneg (by linarith), abs_of_nonneg (by linarith)]

/-- Primer 4 b) in RACUN: |5 − 2x| = 3 ⇔ x = 1 ali x = 4 (5 − 2x = 3: −2x = −2; 5 − 2x = −3: −2x = −8);
preizkus |5 − 2| = 3, |5 − 8| = 3. -/
theorem primer4b (x : ℝ) : (|5 - 2 * x| = 3 ↔ x = 1 ∨ x = 4) ∧ |(5 : ℝ) - 2| = 3 ∧ |(5 : ℝ) - 8| = 3 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  rw [abs_eq (by norm_num : (0 : ℝ) ≤ 3)]
  constructor
  · rintro (h | h)
    · left; linarith
    · right; linarith
  · rintro (h | h)
    · left; rw [h]; norm_num
    · right; rw [h]; norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1: |a + b| = |a| + |b| velja natanko pri istem predznaku; |3 + (−5)| = 2, |3| + |−5| = 8. -/
theorem napaka_vsota (a b : ℝ) : (|a + b| = |a| + |b| ↔ 0 ≤ a ∧ 0 ≤ b ∨ a ≤ 0 ∧ b ≤ 0) ∧
    |(3 : ℝ) + (-5)| = 2 ∧ |(3 : ℝ)| + |(-5 : ℝ)| = 8 :=
  ⟨abs_add_eq_add_abs_iff a b, by norm_num, by norm_num⟩

/-- Pogoste napake 2: |2 − 5| = |−3| = 3, ne 7. -/
theorem napaka_minus : (2 : ℝ) - 5 = -3 ∧ |(2 : ℝ) - 5| = 3 ∧ |(2 : ℝ) - 5| ≠ 7 := by norm_num

/-- Pogoste napake 4: x ≥ 2 je [2, ∞), 2 ≤ x ≤ 5 je [2, 5] in ne (2, 5) (2 ni v (2, 5)). -/
theorem napaka_oklepaji (x : ℝ) : (2 ≤ x ↔ x ∈ Set.Ici (2 : ℝ)) ∧ (2 ≤ x ∧ x ≤ 5 ↔ x ∈ Set.Icc (2 : ℝ) 5) ∧
    (2 : ℝ) ∉ Set.Ioo (2 : ℝ) 5 :=
  ⟨Iff.rfl, Iff.rfl, fun h => lt_irrefl _ h.1⟩

/-! ## Za maturo -/

/-- Naloga 1 in RACUN: 2|x + 1| − 3 = 5 ⇔ |x + 1| = 4 ⇔ x = 3 ali x = −5; preizkus 2|4| − 3 = 5, 2|−4| − 3 = 5. -/
theorem naloga1 (x : ℝ) : (2 * |x + 1| - 3 = 5 ↔ |x + 1| = 4) ∧ (|x + 1| = 4 ↔ x = 3 ∨ x = -5) ∧
    2 * |(4 : ℝ)| - 3 = 5 ∧ 2 * |(-4 : ℝ)| - 3 = 5 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, ?_, by norm_num, by norm_num⟩
  rw [abs_eq (by norm_num : (0 : ℝ) ≤ 4)]
  constructor
  · rintro (h | h)
    · left; linarith
    · right; linarith
  · rintro (h | h)
    · left; rw [h]; norm_num
    · right; rw [h]; norm_num

/-- Naloga 2 a), b): 10 = 3² + 1², hipotenuza s katetama 3 in 1 je √(3² + 1²) = √10; 3² = 9 < 10 < 16 = 4², zato
3 < √10 < 4. -/
theorem naloga2_ab : (10 : ℝ) = 3 ^ 2 + 1 ^ 2 ∧ √((3 : ℝ) ^ 2 + 1 ^ 2) = √10 ∧ (3 : ℝ) ^ 2 = 9 ∧ (9 : ℝ) < 10 ∧
    (10 : ℝ) < 16 ∧ (16 : ℝ) = 4 ^ 2 ∧ 3 < √10 ∧ √10 < 4 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_, ?_⟩
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num

/-- Naloga 2 c), d): A = (−3, √10], B = [0, 6): A ∩ B = [0, √10], A ∪ B = (−3, 6), A ∖ B = (−3, 0), celi števili
v A ∖ B sta −2 in −1. -/
theorem naloga2_cd :
    Set.Ioc (-3 : ℝ) √10 ∩ Set.Ico 0 6 = Set.Icc 0 √10 ∧ Set.Ioc (-3 : ℝ) √10 ∪ Set.Ico 0 6 = Set.Ioo (-3) 6 ∧
    Set.Ioc (-3 : ℝ) √10 \ Set.Ico 0 6 = Set.Ioo (-3) 0 ∧
    {n : ℤ | (n : ℝ) ∈ Set.Ioc (-3 : ℝ) √10 \ Set.Ico 0 6} = {-2, -1} := by
  have h3 := naloga2_ab.2.2.2.2.2.2.1
  have h4 := naloga2_ab.2.2.2.2.2.2.2
  have hd : Set.Ioc (-3 : ℝ) √10 \ Set.Ico 0 6 = Set.Ioo (-3) 0 := by
    ext x; simp only [Set.mem_sdiff, Set.mem_Ioc, Set.mem_Ico, Set.mem_Ioo, not_and_or, not_le, not_lt]
    constructor
    · rintro ⟨⟨h1, h2⟩, h | h⟩
      · exact ⟨h1, h⟩
      · exact absurd h (by linarith)
    · rintro ⟨h1, h2⟩; exact ⟨⟨h1, by linarith⟩, Or.inl h2⟩
  refine ⟨?_, ?_, hd, ?_⟩
  · ext x; simp only [Set.mem_inter_iff, Set.mem_Ioc, Set.mem_Ico, Set.mem_Icc]
    constructor
    · rintro ⟨⟨_, h2⟩, h3, _⟩; exact ⟨h3, h2⟩
    · rintro ⟨h1, h2⟩; exact ⟨⟨by linarith, h2⟩, h1, by linarith⟩
  · ext x; simp only [Set.mem_union, Set.mem_Ioc, Set.mem_Ico, Set.mem_Ioo]
    constructor
    · rintro (⟨h1, h2⟩ | ⟨h1, h2⟩)
      · exact ⟨h1, by linarith⟩
      · exact ⟨by linarith, h2⟩
    · rintro ⟨h1, h2⟩
      rcases lt_or_ge x 0 with h | h
      · exact Or.inl ⟨h1, by linarith⟩
      · exact Or.inr ⟨h, h2⟩
  · rw [hd]; ext n
    simp only [Set.mem_ofPred_eq, Set.mem_Ioo, Set.mem_insert_iff, Set.mem_singleton_iff]
    constructor
    · rintro ⟨h1, h2⟩
      have a : -3 < n := by exact_mod_cast h1
      have b : n < 0 := by exact_mod_cast h2
      omega
    · rintro (rfl | rfl) <;> norm_num

/-- Naloga 3 a) in RACUN: števila, oddaljena od 2 največ za 3: |x − 2| ≤ 3 ⇔ x ∈ [2 − 3, 2 + 3] = [−1, 5]. -/
theorem naloga3a (x : ℝ) : (|x - 2| ≤ 3 ↔ x ∈ Set.Icc (2 - 3 : ℝ) (2 + 3)) ∧ Set.Icc (2 - 3 : ℝ) (2 + 3) = Set.Icc (-1) 5 :=
  ⟨(abs_intervali x 2 3).2.1, by norm_num⟩

/-- Naloga 3 b) in RACUN: |3 − 2x| > 5 ⇔ 3 − 2x < −5 ali 3 − 2x > 5 ⇔ x > 4 ali x < −1. -/
theorem naloga3b (x : ℝ) : (5 < |3 - 2 * x| ↔ 3 - 2 * x < -5 ∨ 5 < 3 - 2 * x) ∧
    (3 - 2 * x < -5 ↔ 4 < x) ∧ (5 < 3 - 2 * x ↔ x < -1) ∧
    (5 < |3 - 2 * x| ↔ x ∈ Set.Iio (-1) ∪ Set.Ioi 4) := by
  have e1 : (5 < |3 - 2 * x| ↔ 3 - 2 * x < -5 ∨ 5 < 3 - 2 * x) := by
    rw [lt_abs]; constructor
    · rintro (h | h)
      · right; exact h
      · left; linarith
    · rintro (h | h)
      · right; linarith
      · left; exact h
  have e2 : (3 - 2 * x < -5 ↔ 4 < x) := ⟨fun h => by linarith, fun h => by linarith⟩
  have e3 : (5 < 3 - 2 * x ↔ x < -1) := ⟨fun h => by linarith, fun h => by linarith⟩
  refine ⟨e1, e2, e3, ?_⟩
  rw [e1, e2, e3, Set.mem_union, Set.mem_Iio, Set.mem_Ioi, or_comm]

/-- Naloga 3 c), d) in RACUN: A = [−1, 5], B = (−∞, −1) ∪ (4, ∞): A ∩ B = (4, 5], A ∪ B = ℝ, A ∖ B = [−1, 4];
c = (−1 + 4)/2 = 3/2, r = (4 − (−1))/2 = 5/2; [−1, 4] je množica rešitev |x − 3/2| ≤ 5/2 in |2x − 3| ≤ 5. -/
theorem naloga3cd :
    Set.Icc (-1 : ℝ) 5 ∩ (Set.Iio (-1) ∪ Set.Ioi 4) = Set.Ioc 4 5 ∧
    Set.Icc (-1 : ℝ) 5 ∪ (Set.Iio (-1) ∪ Set.Ioi 4) = Set.univ ∧
    Set.Icc (-1 : ℝ) 5 \ (Set.Iio (-1) ∪ Set.Ioi 4) = Set.Icc (-1) 4 ∧
    ((-1 : ℝ) + 4) / 2 = 3 / 2 ∧ ((4 : ℝ) - (-1)) / 2 = 5 / 2 ∧
    {x : ℝ | |x - 3 / 2| ≤ 5 / 2} = Set.Icc (-1) 4 ∧ {x : ℝ | |2 * x - 3| ≤ 5} = Set.Icc (-1) 4 := by
  refine ⟨?_, ?_, ?_, by norm_num, by norm_num, ?_, ?_⟩
  · ext x; simp only [Set.mem_inter_iff, Set.mem_union, Set.mem_Icc, Set.mem_Iio, Set.mem_Ioi, Set.mem_Ioc]
    constructor
    · rintro ⟨⟨h1, h2⟩, h | h⟩
      · exact absurd h (by linarith)
      · exact ⟨h, h2⟩
    · rintro ⟨h1, h2⟩; exact ⟨⟨by linarith, h2⟩, Or.inr h1⟩
  · ext x; simp only [Set.mem_union, Set.mem_Icc, Set.mem_Iio, Set.mem_Ioi, Set.mem_univ, iff_true]
    rcases lt_or_ge x (-1) with h | h
    · exact Or.inr (Or.inl h)
    · rcases le_or_gt x 5 with h' | h'
      · exact Or.inl ⟨h, h'⟩
      · exact Or.inr (Or.inr (by linarith))
  · ext x; simp only [Set.mem_sdiff, Set.mem_union, Set.mem_Icc, Set.mem_Iio, Set.mem_Ioi, not_or, not_lt]
    constructor
    · rintro ⟨⟨h1, _⟩, _, h4⟩; exact ⟨h1, h4⟩
    · rintro ⟨h1, h2⟩; exact ⟨⟨h1, by linarith⟩, h1, h2⟩
  · ext x; simp only [Set.mem_ofPred_eq, Set.mem_Icc, abs_le]
    constructor <;> rintro ⟨h1, h2⟩ <;> constructor <;> linarith
  · ext x; simp only [Set.mem_ofPred_eq, Set.mem_Icc, abs_le]
    constructor <;> rintro ⟨h1, h2⟩ <;> constructor <;> linarith

/-- Ustno vprašanje 2: hipotenuza s katetama 1 in 1 meri √(1² + 1²) = √2. -/
theorem ustno2 : √((1 : ℝ) ^ 2 + 1 ^ 2) = √2 := by norm_num

/-! ## Drugače -/

/-- Kot zgodba: |38,2 − 37| = 1,2 = |35,8 − 37| (> 0,5, kliče); |37,3 − 37| = 0,3 ≤ 0,5 (ne kliče); mirne vrednosti
|t − 37| ≤ 0,5 so [36,5; 37,5], klicati mora pri t ∈ (−∞; 36,5) ∪ (37,5; ∞). -/
theorem kot_zgodba (t : ℝ) :
    |(38.2 : ℝ) - 37| = 1.2 ∧ |(35.8 : ℝ) - 37| = 1.2 ∧ (0.5 : ℝ) < 1.2 ∧ |(37.3 : ℝ) - 37| = 0.3 ∧
    (0.3 : ℝ) ≤ 0.5 ∧ (|t - 37| ≤ 0.5 ↔ t ∈ Set.Icc (36.5 : ℝ) 37.5) ∧
    (0.5 < |t - 37| ↔ t ∈ Set.Iio (36.5 : ℝ) ∪ Set.Ioi 37.5) := by
  have h := abs_intervali t 37 0.5
  rw [show (37 : ℝ) - 0.5 = 36.5 by norm_num, show (37 : ℝ) + 0.5 = 37.5 by norm_num] at h
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, h.2.1, h.2.2.1⟩

/-- Korak za korakom: |2x − 1| < 5 ⇔ −5 < 2x − 1 < 5 ⇔ −4 < 2x < 6 ⇔ −2 < x < 3; preverbe pri 0, 3, −2, 4. -/
theorem korak_za_korakom (x : ℝ) :
    (|2 * x - 1| < 5 ↔ -5 < 2 * x - 1 ∧ 2 * x - 1 < 5) ∧ (-5 < 2 * x - 1 ∧ 2 * x - 1 < 5 ↔ -4 < 2 * x ∧ 2 * x < 6) ∧
    (-4 < 2 * x ∧ 2 * x < 6 ↔ -2 < x ∧ x < 3) ∧ (-2 < x ∧ x < 3 ↔ x ∈ Set.Ioo (-2 : ℝ) 3) ∧
    |2 * (0 : ℝ) - 1| = 1 ∧ (1 : ℝ) < 5 ∧ |2 * (3 : ℝ) - 1| = 5 ∧ |2 * (-2 : ℝ) - 1| = 5 ∧
    |2 * (4 : ℝ) - 1| = 7 ∧ ¬ ((7 : ℝ) < 5) := by
  refine ⟨abs_lt, ⟨fun ⟨a, b⟩ => ⟨by linarith, by linarith⟩, fun ⟨a, b⟩ => ⟨by linarith, by linarith⟩⟩,
    ⟨fun ⟨a, b⟩ => ⟨by linarith, by linarith⟩, fun ⟨a, b⟩ => ⟨by linarith, by linarith⟩⟩, Iff.rfl,
    by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Korak za korakom: |x + 1| ≥ 2 ⇔ x ≤ −3 ali x ≥ 1; preverbe pri −3, 1 (|±2| = 2 ≥ 2) in 0 (|1| = 1 < 2). -/
theorem korak_ge (x : ℝ) : (2 ≤ |x + 1| ↔ x ∈ Set.Iic (-3 : ℝ) ∪ Set.Ici 1) ∧ |(-3 : ℝ) + 1| = 2 ∧
    |(1 : ℝ) + 1| = 2 ∧ |(0 : ℝ) + 1| = 1 ∧ (1 : ℝ) < 2 := by
  have h := (abs_intervali x (-1) 2).2.2.2
  norm_num at h
  refine ⟨by rw [h]; simp only [Set.mem_union, Set.mem_Iic, Set.mem_Ici], by norm_num, by norm_num, by norm_num,
    by norm_num⟩

/-! ## Preveri se -/

/-- Preveri se 1: [3,5; 5,1] vsebuje obe krajišči in vse vmes (npr. 4,27); (3,5; 5,1) krajišč ne vsebuje. -/
theorem kviz1 : (3.5 : ℝ) ∈ Set.Icc (3.5 : ℝ) 5.1 ∧ (5.1 : ℝ) ∈ Set.Icc (3.5 : ℝ) 5.1 ∧
    (4.27 : ℝ) ∈ Set.Icc (3.5 : ℝ) 5.1 ∧ (3.5 : ℝ) ∉ Set.Ioo (3.5 : ℝ) 5.1 := by
  refine ⟨by norm_num, by norm_num, by norm_num, fun h => lt_irrefl _ h.1⟩

/-- Preveri se 2: p = |−7| = 7, q = |3 − 5| = 2, u = −|4| = −4, v = |0| = 0, zato u < v < q < p. -/
theorem kviz2 : |(-7 : ℝ)| = 7 ∧ |(3 : ℝ) - 5| = 2 ∧ -|(4 : ℝ)| = -4 ∧ |(0 : ℝ)| = 0 ∧
    -|(4 : ℝ)| < |(0 : ℝ)| ∧ |(0 : ℝ)| < |(3 : ℝ) - 5| ∧ |(3 : ℝ) - 5| < |(-7 : ℝ)| := by norm_num

/-- Preveri se 3: |x − 1| < 2 ⇔ x ∈ (−1, 3), |x − 1| ≥ 2 ⇔ x ∈ (−∞, −1] ∪ [3, ∞). -/
theorem kviz3 (x : ℝ) : (|x - 1| < 2 ↔ x ∈ Set.Ioo (-1 : ℝ) 3) ∧ (2 ≤ |x - 1| ↔ x ∈ Set.Iic (-1 : ℝ) ∪ Set.Ici 3) := by
  have h := abs_intervali x 1 2
  norm_num at h
  exact ⟨h.1, h.2.2.2⟩

/-- Preveri se 4: |3 − 8| − |−2| = 5 − 2 = 3. -/
theorem kviz4 : |(3 : ℝ) - 8| - |(-2 : ℝ)| = 5 - 2 ∧ (5 : ℝ) - 2 = 3 := by norm_num

/-- Preveri se 5: |m − 250| ≤ 15 ⇔ m ∈ [235, 265]; 234 ne ustreza (16 > 15), 265, 236, 250 ustrezajo. -/
theorem kviz5 (m : ℝ) : (|m - 250| ≤ 15 ↔ m ∈ Set.Icc (235 : ℝ) 265) ∧ |(234 : ℝ) - 250| = 16 ∧
    ¬ (|(234 : ℝ) - 250| ≤ 15) ∧ |(265 : ℝ) - 250| ≤ 15 ∧ |(236 : ℝ) - 250| ≤ 15 ∧ |(250 : ℝ) - 250| ≤ 15 := by
  have h := (abs_intervali m 250 15).2.1
  norm_num at h
  refine ⟨h, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Preveri se 6 in RACUN: |2x − 5| = 9 ⇔ x = 7 ali x = −2; vsota 7 + (−2) = 5. -/
theorem kviz6 (x : ℝ) : (|2 * x - 5| = 9 ↔ x = 7 ∨ x = -2) ∧ (7 : ℝ) + (-2) = 5 := by
  refine ⟨?_, by norm_num⟩
  rw [abs_eq (by norm_num : (0 : ℝ) ≤ 9)]
  constructor
  · rintro (h | h)
    · left; linarith
    · right; linarith
  · rintro (h | h)
    · left; rw [h]; norm_num
    · right; rw [h]; norm_num

/-- Preveri se 7: za x > 2 je |2 − x| = x − 2 in |2 − x| + x = 2x − 2. -/
theorem kviz7 (x : ℝ) (hx : 2 < x) : |2 - x| = x - 2 ∧ |2 - x| + x = 2 * x - 2 := by
  rw [abs_of_neg (by linarith)]; constructor <;> ring

/-- Predpostavke `kviz7` se dajo izpolniti (x = 3). -/
example : (2 : ℝ) < 3 := by norm_num

/-- RACUN: vrstice »vrednost« (»resi« in »neenacba« so v `enacba_2x1`, `primer4b`, `kviz6`, `naloga1`,
`naloga3a`, `naloga3b`, `naloga3cd`). -/
theorem racun : |(2 : ℝ) - 5| + 5 = 8 ∧ |(0 : ℝ) + 1| + |(0 : ℝ) - 3| = 4 ∧ |(5 : ℝ) + 1| + |(5 : ℝ) - 3| = 8 ∧
    (2 : ℝ) * 5 - 2 = 8 ∧ 2 * |(4 : ℝ)| - 3 = 5 ∧ 2 * |(-4 : ℝ)| - 3 = 5 ∧ (3 : ℝ) ^ 2 + 1 ^ 2 = 10 ∧
    ((-1 : ℝ) + 4) / 2 = 3 / 2 ∧ ((4 : ℝ) - (-1)) / 2 = 5 / 2 := by norm_num

end Evklid.Lekcije.MAT_SS_1.RealnaStevilaInIntervali
