/-
vir: content/lessons/MAT-SS-1/racionalna-stevila.md
sha256: 9729376c757074f721b4987f17b42a4b64955241e4ce8af70de61908e7a24d1f
Ni v Leanu: zgodbe (strelki, palačinke, nogomet, Lana na stezi) kot besedilo, njihovi računi so dokazani; risbe
številske premice in simulacija (dokazane so lege števil: urejenost in −3/2 kot sredina med −2 in −1); »kosa sta
različno velika« in podobne razlage; trditev »vsako racionalno število ima končen ali periodičen decimalni zapis«
in »krog je dolg največ šest korakov« (zahtevno, še ni dokazano; dokazano je, da je vsako periodično število
racionalno, in vsi zapisi iz primerov); zapis z mešanim številom in »predznak pišemo pred ulomek« (dogovor o
zapisu; dokazano je 19/12 = 1 + 7/12 in −3/5 = (−3)/5); točkovanje.
Dogovori: ℚ je Leanov `ℚ`; »končen decimalni zapis« je `koncen q`: q = m / 10ᵏ za celo m in naravno k.
Periodični zapis je v ℝ: `rep p L` = 0,(p)(p)(p)… s periodo p dolžine L mest, to je vrsta ∑ p · (10^L)^−(k+1);
npr. 0,58(3) je 58/100 + rep 3 1 / 100. Zaokroženi zapisi (≈) so dokazani kot ocena napake (polovica enote
zadnjega mesta). Nekrajšljiv ulomek je `Rat.num / Rat.den` (imenovalec q.den je po krajšanju).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.RacionalnaStevila

/-! ## Pomožne definicije: končen in periodičen decimalni zapis -/

/-- Končen decimalni zapis: q = m / 10ᵏ (k decimalk). -/
def koncen (q : ℚ) : Prop := ∃ m : ℤ, ∃ k : ℕ, q = m / 10 ^ k

/-- Periodični del 0,(p)(p)(p)…: perioda p z L mesti, vrednost ∑ₖ p · (10^L)^−(k+1). -/
noncomputable def rep (p : ℝ) (L : ℕ) : ℝ := ∑' k : ℕ, p * ((10 : ℝ) ^ L)⁻¹ ^ (k + 1)

/-- Razlaga 5 in Pogoste napake 5: 0,(p)(p)… = p / (10^L − 1) (imenovalec ima L devetk). -/
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

/-- Razlaga 5: »repa« se ujemata: 10^L · 0,(p)(p)… = p + 0,(p)(p)…, zato pri odštevanju izgineta. -/
theorem rep_premik (p : ℝ) {L : ℕ} (hL : 1 ≤ L) : 10 ^ L * rep p L = p + rep p L := by
  have h1 : (1 : ℝ) < 10 ^ L := one_lt_pow₀ (by norm_num) (by omega)
  have ht1 : (10 : ℝ) ^ L - 1 ≠ 0 := by linarith
  rw [rep_eq p hL]; field_simp; ring

/-- Razlaga 5: vsako periodično (in končno) decimalno število je racionalno: d / 10ⁿ + rep p L / 10ⁿ ∈ ℚ. -/
theorem periodicno_racionalno (d p : ℤ) (n L : ℕ) (hL : 1 ≤ L) :
    ∃ r : ℚ, ((d : ℝ) / 10 ^ n + rep p L / 10 ^ n) = r := by
  refine ⟨(d : ℚ) / 10 ^ n + ((p : ℚ) / (10 ^ L - 1)) / 10 ^ n, ?_⟩
  rw [rep_eq _ hL]; push_cast; ring

/-- Predpostavke `rep_eq`, `rep_premik` in `periodicno_racionalno` se dajo izpolniti (L = 1). -/
example : 1 ≤ 1 := le_rfl

/-! ## Razlaga 1–3: racionalna števila in računanje -/

/-- Razlaga 1: vsako racionalno število je a / b z a ∈ ℤ, b ∈ ℕ, b ≠ 0 (nekrajšljivo: num / den). -/
theorem racionalno_ulomek (q : ℚ) : ∃ a : ℤ, ∃ b : ℕ, 0 < b ∧ Nat.Coprime a.natAbs b ∧ q = a / b :=
  ⟨q.num, q.den, q.den_pos, q.reduced, (Rat.num_div_den q).symm⟩

/-- Razlaga 1 in Povzetek: ℕ ⊂ ℤ ⊂ ℚ; 5 = 5/1, −3 = (−3)/1; 1/2 ni celo število; −1 ni naravno. -/
theorem veriga : ((5 : ℚ) = 5 / 1 ∧ (-3 : ℚ) = -3 / 1) ∧ (¬ ∃ n : ℤ, (n : ℚ) = 1 / 2) ∧
    (¬ ∃ n : ℕ, (n : ℤ) = -1) := by
  refine ⟨by norm_num, ?_, ?_⟩
  · rintro ⟨n, hn⟩
    have h1 : (2 : ℚ) * n = 1 := by rw [hn]; norm_num
    have h2 : (2 : ℤ) * n = 1 := by exact_mod_cast h1
    omega
  · rintro ⟨n, hn⟩; omega

/-- Zakaj se tega učimo in Ustno vprašanje 1: 3x = 1 nima rešitve v ℤ, v ℚ pa natanko x = 1/3. -/
theorem enacba_3x : (¬ ∃ x : ℤ, 3 * x = 1) ∧ ∀ x : ℚ, 3 * x = 1 ↔ x = 1 / 3 := by
  refine ⟨fun ⟨x, hx⟩ => by omega, fun x => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩⟩

/-- Razlaga 3 in Ustno vprašanje 1: v ℚ deljenje (razen z 0) vedno uspe: za q ≠ 0 je p = (p/q) · q. -/
theorem deljenje_uspe (p q : ℚ) (hq : q ≠ 0) : ∃ r : ℚ, r * q = p := ⟨p / q, div_mul_cancel₀ p hq⟩

/-- Predpostavke `deljenje_uspe` se dajo izpolniti. -/
example : (2 : ℚ) ≠ 0 := by norm_num

/-- Razlaga 2 in Povzetek: a/b = c/d ⇔ a · d = b · c (b, d ≠ 0). -/
theorem enakost_ulomkov (a b c d : ℚ) (hb : b ≠ 0) (hd : d ≠ 0) : a / b = c / d ↔ a * d = b * c := by
  rw [div_eq_div_iff hb hd, mul_comm b c]

/-- Predpostavke `enakost_ulomkov` se dajo izpolniti (b = 9, d = 15). -/
example : (9 : ℚ) ≠ 0 ∧ (15 : ℚ) ≠ 0 := by norm_num

/-- Razlaga 2: razširjanje in krajšanje ne spremeni vrednosti: (a · k)/(b · k) = a/b za k ≠ 0. -/
theorem razsirjanje (a b k : ℚ) (hk : k ≠ 0) : (a * k) / (b * k) = a / b := mul_div_mul_right a b hk

/-- Predpostavke `razsirjanje` se dajo izpolniti. -/
example : (3 : ℚ) ≠ 0 := by norm_num

/-- Razlaga 2: 1/2 = 2/4 = 3/6; 6/9 = 10/15 (6 · 15 = 90 = 9 · 10); D(18, 30) = 6 in 18/30 = 3/5 (nekrajšljiv);
−3/5 = (−3)/5. -/
theorem razlaga2_primeri :
    ((1 : ℚ) / 2 = 2 / 4 ∧ (2 : ℚ) / 4 = 3 / 6) ∧ ((6 : ℚ) / 9 = 10 / 15 ∧ 6 * 15 = 90 ∧ 90 = 9 * 10) ∧
    (Nat.gcd 18 30 = 6 ∧ (18 : ℚ) / 30 = 3 / 5 ∧ Nat.Coprime 3 5) ∧ -((3 : ℚ) / 5) = (-3) / 5 := by
  refine ⟨by norm_num, by norm_num, ⟨by decide, by norm_num, by decide⟩, by ring⟩

/-- Razlaga 3 in Povzetek: vsota, razlika, zmnožek, količnik ulomkov (b, d ≠ 0, pri količniku c ≠ 0) in obratna
vrednost (c/d · d/c = 1). -/
theorem racunanje (a b c d : ℚ) (hb : b ≠ 0) (hd : d ≠ 0) :
    a / b + c / d = (a * d + b * c) / (b * d) ∧ a / b - c / d = (a * d - b * c) / (b * d) ∧
    a / b * (c / d) = (a * c) / (b * d) ∧ (a / b) / (c / d) = a / b * (d / c) ∧
    (c ≠ 0 → c / d * (d / c) = 1) := by
  refine ⟨by field_simp, by field_simp, by field_simp, by rw [div_eq_mul_inv (a / b), inv_div], fun hc => by field_simp⟩

/-- Predpostavke `racunanje` se dajo izpolniti. -/
example : (2 : ℚ) ≠ 0 ∧ (3 : ℚ) ≠ 0 := by norm_num

/-- Razlaga 3 in Pogoste napake 1: 1/2 + 1/3 = (3 + 2)/6 = 5/6 (= 3/6 + 2/6); napačni 2/5 = 0,4 je manjši od 1/2. -/
theorem vsota_polovica_tretjina :
    (1 : ℚ) / 2 + 1 / 3 = (3 + 2) / 6 ∧ ((3 : ℚ) + 2) / 6 = 5 / 6 ∧ (3 : ℚ) / 6 + 2 / 6 = 5 / 6 ∧
    (1 : ℚ) / 2 + 1 / 3 ≠ 2 / 5 ∧ (2 : ℚ) / 5 = 0.4 ∧ (2 : ℚ) / 5 < 1 / 2 := by norm_num

/-- Razlaga 3: 2/3 · 3/8 = 6/24 = 1/4; 3/4 : 9/8 = 3/4 · 8/9 = 2/3; 19/12 = 1 + 7/12. -/
theorem razlaga3_primeri :
    ((2 : ℚ) / 3 * (3 / 8) = 6 / 24 ∧ (6 : ℚ) / 24 = 1 / 4) ∧
    ((3 : ℚ) / 4 / (9 / 8) = 3 / 4 * (8 / 9) ∧ (3 : ℚ) / 4 * (8 / 9) = 2 / 3) ∧ (19 : ℚ) / 12 = 1 + 7 / 12 := by
  norm_num

/-! ## Razlaga 4: decimalni zapis -/

/-- Razlaga 4, Povzetek, Ponovitev in Ustno vprašanje 2: q ima končen decimalni zapis natanko tedaj, ko ima
imenovalec nekrajšljivega ulomka (q.den) le prafaktorja 2 in 5. -/
theorem koncen_iff (q : ℚ) : koncen q ↔ ∀ p : ℕ, p.Prime → p ∣ q.den → p = 2 ∨ p = 5 := by
  constructor
  · rintro ⟨m, k, hq⟩ p hp hpd
    have hq' : q = Rat.divInt m ((10 : ℤ) ^ k) := by rw [hq, Rat.divInt_eq_div]; push_cast; rfl
    have h1 : ((q.den : ℤ)) ∣ (10 : ℤ) ^ k := by rw [hq']; exact Rat.den_dvd m _
    have h2 : q.den ∣ 10 ^ k := by exact_mod_cast h1
    have h3 : p ∣ 10 := hp.dvd_of_dvd_pow (dvd_trans hpd h2)
    have h4 : p ∣ 2 * 5 := by simpa using h3
    rcases (Nat.Prime.dvd_mul hp).mp h4 with h | h
    · exact Or.inl ((Nat.prime_dvd_prime_iff_eq hp Nat.prime_two).mp h)
    · exact Or.inr ((Nat.prime_dvd_prime_iff_eq hp (by norm_num)).mp h)
  · intro h
    have hn : q.den ≠ 0 := q.den_nz
    obtain ⟨a, n1, h2, hn1⟩ := Nat.exists_eq_pow_mul_and_not_dvd hn 2 (by norm_num)
    have hn1' : n1 ≠ 0 := by rintro rfl; simp at hn1
    obtain ⟨b, m, h5, hm⟩ := Nat.exists_eq_pow_mul_and_not_dvd hn1' 5 (by norm_num)
    have hm1 : m = 1 := by
      by_contra hne
      have hp := Nat.minFac_prime hne
      have hdm : m.minFac ∣ m := Nat.minFac_dvd m
      have hdd : m.minFac ∣ q.den := by
        rw [hn1, hm]; exact Dvd.dvd.mul_left (Dvd.dvd.mul_left hdm _) _
      rcases h _ hp hdd with h' | h'
      · exact h2 (by rw [hm]; exact Dvd.dvd.mul_left (h' ▸ hdm) _)
      · exact h5 (h' ▸ hdm)
    subst hm1
    have hden : (q.den : ℚ) = 2 ^ a * 5 ^ b := by rw [hn1, hm]; push_cast; ring
    refine ⟨q.num * 2 ^ b * 5 ^ a, a + b, ?_⟩
    have hq : q = (q.num : ℚ) / (q.den : ℚ) := (Rat.num_div_den q).symm
    rw [hden] at hq
    have h10 : (10 : ℚ) ^ (a + b) = (2 ^ a * 5 ^ b) * (2 ^ b * 5 ^ a) := by
      rw [show (10 : ℚ) = 2 * 5 by norm_num, mul_pow, pow_add, pow_add]; ring
    conv_lhs => rw [hq]
    rw [h10]; push_cast; field_simp

/-- Razlaga 4 in Preveri se 1: 3/8 = 375/1000 = 0,375 je končen (8 = 2 · 2 · 2); 0,35 = 35/100 = 7/20. -/
theorem koncni_primeri : ((3 : ℚ) / 8 = 375 / 1000 ∧ (3 : ℚ) / 8 = 0.375 ∧ koncen (3 / 8)) ∧
    ((0.35 : ℚ) = 35 / 100 ∧ (35 : ℚ) / 100 = 7 / 20) ∧ (5 : ℚ) / 8 = 0.625 ∧ (1 : ℚ) / 8 = 0.125 :=
  ⟨⟨by norm_num, by norm_num, ⟨375, 3, by norm_num⟩⟩, ⟨by norm_num, by norm_num⟩, by norm_num, by norm_num⟩

/-- Razlaga 4, premisli, Ustno vprašanje 2 in Preveri se 1: 1/3, 5/12 (12 = 2 · 2 · 3), 2/7, 7/12 in 19/72
(72 = 2³ · 3²) nimajo končnega zapisa; 9/15 = 3/5 = 0,6 in 21/28 = 3/4 = 0,75 (D(21, 28) = 7) ga imata. -/
theorem nekoncni_primeri :
    ¬ koncen (1 / 3) ∧ ¬ koncen (5 / 12) ∧ ¬ koncen (2 / 7) ∧ ¬ koncen (7 / 12) ∧ ¬ koncen (19 / 72) ∧
    12 = 2 * 2 * 3 ∧ 72 = 2 ^ 3 * 3 ^ 2 ∧
    ((9 : ℚ) / 15 = 3 / 5 ∧ (3 : ℚ) / 5 = 0.6 ∧ koncen (9 / 15)) ∧
    (Nat.gcd 21 28 = 7 ∧ 28 = 2 * 2 * 7 ∧ (21 : ℚ) / 28 = 3 / 4 ∧ (3 : ℚ) / 4 = 0.75 ∧ koncen (21 / 28)) := by
  have n3 : ∀ q : ℚ, 3 ∣ q.den → ¬ koncen q := fun q h hk => by
    rcases (koncen_iff q).mp hk 3 Nat.prime_three h with h' | h' <;> norm_num at h'
  have n7 : ∀ q : ℚ, 7 ∣ q.den → ¬ koncen q := fun q h hk => by
    rcases (koncen_iff q).mp hk 7 (by norm_num) h with h' | h' <;> norm_num at h'
  refine ⟨n3 _ (by norm_num), n3 _ (by norm_num), n7 _ (by norm_num), n3 _ (by norm_num), n3 _ (by norm_num), by norm_num, by norm_num,
    ⟨by norm_num, by norm_num, ⟨6, 1, by norm_num⟩⟩, ⟨by decide, by norm_num, by norm_num, by norm_num,
    ⟨75, 2, by norm_num⟩⟩⟩

/-- Razlaga 4, Primer 2, Preveri se 1 in 5, Kot zgodba: periodični zapisi 1/3 = 0,(3), 5/11 = 0,(45),
1/6 = 0,1(6), 7/12 = 0,58(3), 5/12 = 0,41(6), 2/7 = 0,(285714), 1/7 = 0,(142857), 11/15 = 0,7(3), 8/11 = 0,(72),
13/18 = 0,7(2). -/
theorem periodicni_primeri :
    (1 : ℝ) / 3 = rep 3 1 ∧ (5 : ℝ) / 11 = rep 45 2 ∧ (1 : ℝ) / 6 = 1 / 10 + rep 6 1 / 10 ∧
    (7 : ℝ) / 12 = 58 / 100 + rep 3 1 / 100 ∧ (5 : ℝ) / 12 = 41 / 100 + rep 6 1 / 100 ∧
    (2 : ℝ) / 7 = rep 285714 6 ∧ (1 : ℝ) / 7 = rep 142857 6 ∧ (11 : ℝ) / 15 = 7 / 10 + rep 3 1 / 10 ∧
    (8 : ℝ) / 11 = rep 72 2 ∧ (13 : ℝ) / 18 = 7 / 10 + rep 2 1 / 10 := by
  simp only [rep_eq _ (le_refl 1), rep_eq _ (by norm_num : 1 ≤ 2), rep_eq _ (by norm_num : 1 ≤ 6)]
  norm_num

/-- Razlaga 4 (Primer 2, koraki 3–4) in Kot zgodba: pisno deljenje z ostanki: 70 = 5 · 12 + 10, 100 = 8 · 12 + 4,
40 = 3 · 12 + 4 (ostanek 4 se ponovi); 1 : 7 da ostanke 3, 2, 6, 4, 5, 1 in števke 1, 4, 2, 8, 5, 7; pri 1 : 8 pride
po treh korakih ostanek 0. -/
theorem deljenje_ostanki :
    (70 = 5 * 12 + 10 ∧ 100 = 8 * 12 + 4 ∧ 40 = 3 * 12 + 4) ∧
    (10 = 1 * 7 + 3 ∧ 30 = 4 * 7 + 2 ∧ 20 = 2 * 7 + 6 ∧ 60 = 8 * 7 + 4 ∧ 40 = 5 * 7 + 5 ∧ 50 = 7 * 7 + 1) ∧
    (10 = 1 * 8 + 2 ∧ 20 = 2 * 8 + 4 ∧ 40 = 5 * 8 + 0) := by norm_num

/-! ## Razlaga 5: od decimalnega zapisa k ulomku, odstotki -/

/-- Razlaga 5: x = 2,(18): 100x = 218,(18), 99x = 216, x = 216/99 = 24/11. -/
theorem dva_18 :
    let x : ℝ := 2 + rep 18 2
    100 * x = 218 + rep 18 2 ∧ 99 * x = 216 ∧ x = 216 / 99 ∧ (216 : ℝ) / 99 = 24 / 11 := by
  intro x
  have hp := rep_premik 18 (by norm_num : 1 ≤ 2)
  have h1 : 100 * x = 218 + rep 18 2 := by
    simp only [x]; norm_num at hp; linarith
  have h2 : 99 * x = 216 := by simp only [x] at h1 ⊢; linarith
  exact ⟨h1, h2, by field_simp; linarith, by norm_num⟩

/-- Razlaga 5: x = 0,1(6): 10x = 1,(6), 100x = 16,(6), 90x = 15, x = 15/90 = 1/6. -/
theorem nic_1_6 :
    let x : ℝ := 1 / 10 + rep 6 1 / 10
    10 * x = 1 + rep 6 1 ∧ 100 * x = 16 + rep 6 1 ∧ 90 * x = 15 ∧ x = 15 / 90 ∧ (15 : ℝ) / 90 = 1 / 6 := by
  intro x
  have hp := rep_premik 6 (le_refl 1)
  norm_num at hp
  have h1 : 10 * x = 1 + rep 6 1 := by simp only [x]; ring
  have h2 : 100 * x = 16 + rep 6 1 := by simp only [x]; linarith
  exact ⟨h1, h2, by linarith, by field_simp; linarith, by norm_num⟩

/-- Razlaga 5: odstotek je stotina; 5/8 = 0,625 = 62,5 %; 7/12 · 100 ≈ 58,3 (napaka pod 0,05); 35 % = 35/100 =
7/20, 35 % od 60 je 7/20 · 60 = 21. -/
theorem odstotki :
    (1 : ℚ) / 100 = 0.01 ∧ (5 : ℚ) / 8 * 100 = 62.5 ∧ |(7 : ℚ) / 12 * 100 - 58.3| < 0.05 ∧
    (35 : ℚ) / 100 = 7 / 20 ∧ (7 : ℚ) / 20 * 60 = 21 := by
  refine ⟨by norm_num, by norm_num, ?_, by norm_num, by norm_num⟩
  rw [abs_lt]; constructor <;> norm_num

/-! ## Razlaga 6: urejenost in gostost -/

/-- Razlaga 6: za racionalni p, q velja natanko ena od p < q, p = q, p > q. -/
theorem trihotomija (p q : ℚ) : (p < q ∨ p = q ∨ q < p) ∧ ¬ (p < q ∧ p = q) ∧ ¬ (p < q ∧ q < p) ∧
    ¬ (p = q ∧ q < p) :=
  ⟨lt_trichotomy p q, fun h => h.1.ne h.2, fun h => lt_asymm h.1 h.2, fun h => h.2.ne h.1.symm⟩

/-- Razlaga 6, Pogoste napake 3 in 4: −1 < −1/2 < −1/3 < 0 < 0,35 < 0,4 < 1 (0,35 = 35/100 < 40/100 = 0,40). -/
theorem veriga_neenakosti : (-1 : ℚ) < -1 / 2 ∧ (-1 : ℚ) / 2 < -1 / 3 ∧ (-1 : ℚ) / 3 < 0 ∧ (0 : ℚ) < 0.35 ∧
    (0.35 : ℚ) < 0.4 ∧ (0.4 : ℚ) < 1 ∧ (0.4 : ℚ) = 40 / 100 ∧ (35 : ℚ) / 100 < 40 / 100 := by norm_num

/-- Razlaga 6: pri istem pozitivnem imenovalcu je večji ulomek z večjim števcem; pri istem pozitivnem števcu z
manjšim imenovalcem (Preveri se 3: večji imenovalec, manjša vrednost). -/
theorem primerjava_isti (a b c d : ℚ) :
    (0 < b → (a / b < c / b ↔ a < c)) ∧ (0 < a → 0 < b → 0 < d → (a / d < a / b ↔ b < d)) :=
  ⟨fun hb => div_lt_div_iff_of_pos_right hb, fun ha hb hd => div_lt_div_iff_of_pos_left ha hd hb⟩

/-- Razlaga 6: 3/7 < 5/7, 1/8 < 1/5. -/
theorem primerjava_primeri : (3 : ℚ) / 7 < 5 / 7 ∧ (1 : ℚ) / 8 < 1 / 5 := by norm_num

/-- Razlaga 6 in Povzetek: za b, d > 0 je a/b < c/d ⇔ a · d < b · c. -/
theorem primerjava (a b c d : ℚ) (hb : 0 < b) (hd : 0 < d) : a / b < c / d ↔ a * d < b * c := by
  rw [div_lt_div_iff₀ hb hd, mul_comm c b]

/-- Predpostavke `primerjava` se dajo izpolniti. -/
example : (0 : ℚ) < 12 ∧ (0 : ℚ) < 8 := by norm_num

/-- Razlaga 6, premisli: pogoj b, d > 0 je potreben: 1/(−1) < 0/1, a 1 · 1 < (−1) · 0 ne velja. -/
theorem primerjava_pogoj : (1 : ℚ) / (-1) < 0 / 1 ∧ ¬ ((1 : ℚ) * 1 < (-1) * 0) := by norm_num

/-- Zakaj se tega učimo in premisli v Razlagi 6: 7 · 8 = 56 < 60 = 12 · 5, zato 7/12 < 5/8 (Maja je boljša);
5/8 = 0,625. -/
theorem ana_maja : 7 * 8 = 56 ∧ 12 * 5 = 60 ∧ (7 : ℚ) / 12 < 5 / 8 ∧ (12 : ℚ) * 8 = 96 := by norm_num

/-- Razlaga 6, Povzetek in Ustno vprašanje 3: gostost: med p < q leži (p + q)/2; zato ni »naslednjega«
racionalnega števila. -/
theorem gostost (p q : ℚ) (h : p < q) : p < (p + q) / 2 ∧ (p + q) / 2 < q := ⟨by linarith, by linarith⟩

/-- Predpostavke `gostost` se dajo izpolniti (1/3 < 1/2). -/
example : (1 : ℚ) / 3 < 1 / 2 := by norm_num

/-- Razlaga 6: 5/12 je povprečje 1/3 in 1/2; noben racionalni p nima naslednika; pri celih za 4 pride 5. -/
theorem ni_naslednjega : ((1 : ℚ) / 3 + 1 / 2) / 2 = 5 / 12 ∧
    (∀ p : ℚ, ¬ ∃ q, p < q ∧ ∀ r, p < r → q ≤ r) ∧ (∀ n : ℤ, ¬ (4 < n ∧ n < 5)) := by
  refine ⟨by norm_num, fun p ⟨q, hpq, hq⟩ => ?_, fun n => by omega⟩
  have := hq ((p + q) / 2) (gostost p q hpq).1
  linarith [(gostost p q hpq).2]

/-! ## Razlaga 7: zakoni -/

/-- Razlaga 7 in Povzetek: zakoni računskih operacij v ℚ; obratna vrednost za p ≠ 0. -/
theorem zakoni (p q r : ℚ) :
    p + q = q + p ∧ p * q = q * p ∧ (p + q) + r = p + (q + r) ∧ (p * q) * r = p * (q * r) ∧
    p * (q + r) = p * q + p * r ∧ p + 0 = p ∧ p * 1 = p ∧ p + (-p) = 0 ∧ (p ≠ 0 → p * (1 / p) = 1) :=
  ⟨add_comm p q, mul_comm p q, add_assoc p q r, mul_assoc p q r, mul_add p q r, add_zero p, mul_one p,
    add_neg_cancel p, fun hp => by rw [one_div, mul_inv_cancel₀ hp]⟩

/-- Razlaga 7: zamenljivost zmnožka prek števcev in imenovalcev: a/b · c/d = ac/(bd) = ca/(db) = c/d · a/b. -/
theorem zamenljivost_ulomki (a b c d : ℚ) : a / b * (c / d) = c / d * (a / b) := by
  calc a / b * (c / d) = (a * c) / (b * d) := div_mul_div_comm a b c d
    _ = (c * a) / (d * b) := by rw [mul_comm a c, mul_comm b d]
    _ = c / d * (a / b) := (div_mul_div_comm c d a b).symm

/-- Razlaga 7: v ℤ imata obratno vrednost samo 1 in −1, v ℚ vsako število razen 0. -/
theorem obratna_z_q (n : ℤ) : (∃ m : ℤ, n * m = 1) ↔ n = 1 ∨ n = -1 := by
  constructor
  · rintro ⟨m, hm⟩; exact Int.isUnit_iff.mp (IsUnit.of_mul_eq_one m hm)
  · rintro (rfl | rfl)
    · exact ⟨1, rfl⟩
    · exact ⟨-1, rfl⟩

/-- Razlaga 7: deljenje ni zamenljivo: 1/2 : 1/4 = 2, 1/4 : 1/2 = 1/2. -/
theorem deljenje_ni_zamenljivo : (1 : ℚ) / 2 / (1 / 4) = 2 ∧ (1 : ℚ) / 4 / (1 / 2) = 1 / 2 := by norm_num

/-- Razlaga 7: 5/6 + 2/9 + 1/6 = (5/6 + 1/6) + 2/9 = 1 + 2/9 = 11/9. -/
theorem zakoni_primer1 : (5 : ℚ) / 6 + 2 / 9 + 1 / 6 = 11 / 9 := by
  calc (5 : ℚ) / 6 + 2 / 9 + 1 / 6 = (5 / 6 + 1 / 6) + 2 / 9 := by ring
    _ = 1 + 2 / 9 := by norm_num
    _ = 11 / 9 := by norm_num

/-- Razlaga 7: 3/7 · 5/8 + 3/7 · 3/8 = 3/7 · (5/8 + 3/8) = 3/7 · 1 = 3/7. -/
theorem zakoni_primer2 : (3 : ℚ) / 7 * (5 / 8) + 3 / 7 * (3 / 8) = 3 / 7 := by
  calc (3 : ℚ) / 7 * (5 / 8) + 3 / 7 * (3 / 8) = 3 / 7 * (5 / 8 + 3 / 8) := (mul_add _ _ _).symm
    _ = 3 / 7 * 1 := by norm_num
    _ = 3 / 7 := mul_one _

/-! ## Rešeni primeri -/

/-- Primer 1: v(4, 6) = 12; 3/4 = (3 · 3)/(4 · 3) = 9/12, 5/6 = (5 · 2)/(6 · 2) = 10/12; V = 9/12 + 10/12 = 19/12
(19 praštevilo, tuje z 12); 19 = 1 · 12 + 7, 19/12 = 1 + 7/12 ≈ 1,58. -/
theorem primer1 :
    Nat.lcm 4 6 = 12 ∧ ((3 : ℚ) / 4 = (3 * 3) / (4 * 3) ∧ ((3 : ℚ) * 3) / (4 * 3) = 9 / 12) ∧
    ((5 : ℚ) / 6 = (5 * 2) / (6 * 2) ∧ ((5 : ℚ) * 2) / (6 * 2) = 10 / 12) ∧
    ((3 : ℚ) / 4 + 5 / 6 = 9 / 12 + 10 / 12 ∧ (9 : ℚ) / 12 + 10 / 12 = 19 / 12) ∧
    Nat.Prime 19 ∧ Nat.Coprime 19 12 ∧ 19 = 1 * 12 + 7 ∧ (19 : ℚ) / 12 = 1 + 7 / 12 ∧
    |(19 : ℚ) / 12 - 1.58| < 0.005 := by
  refine ⟨by decide, by norm_num, by norm_num, by norm_num, by norm_num, by decide, by norm_num, by norm_num, ?_⟩
  rw [abs_lt]; constructor <;> norm_num

/-- Primer 2: 7 in 12 sta tuji, 12 = 2 · 2 · 3, zato zapis ni končen; 7/12 = 0,58(3). -/
theorem primer2 : Nat.Coprime 7 12 ∧ 12 = 2 * 2 * 3 ∧ ¬ koncen (7 / 12) ∧
    (7 : ℝ) / 12 = 58 / 100 + rep 3 1 / 100 :=
  ⟨by decide, by norm_num, nekoncni_primeri.2.2.2.1, periodicni_primeri.2.2.2.1⟩

/-- Primer 3, korak 1: x = 0,(6): 10x = 6,(6), 9x = 6, x = 6/9 = 2/3. -/
theorem primer3_periodicno :
    let x : ℝ := rep 6 1
    10 * x = 6 + rep 6 1 ∧ 9 * x = 6 ∧ x = 6 / 9 ∧ (6 : ℝ) / 9 = 2 / 3 := by
  intro x
  have hp := rep_premik 6 (le_refl 1)
  norm_num at hp
  have h1 : 10 * x = 6 + rep 6 1 := hp
  exact ⟨h1, by linarith, by field_simp; linarith, by norm_num⟩

/-- Primer 3, koraki 2–7: −0,7 = −7/10; v(5, 3, 10, 8) = 120; 3/5 = 72/120, −2/3 = −80/120, 2/3 = 80/120,
−7/10 = −84/120, 5/8 = 75/120; −84 < −80 < 72 < 75 < 80; vrstni red D, B, A, E, C. -/
theorem primer3 :
    (-0.7 : ℚ) = -7 / 10 ∧ Nat.lcm 5 (Nat.lcm 3 (Nat.lcm 10 8)) = 120 ∧
    (3 : ℚ) / 5 = 72 / 120 ∧ -(2 : ℚ) / 3 = -80 / 120 ∧ (2 : ℚ) / 3 = 80 / 120 ∧ -(7 : ℚ) / 10 = -84 / 120 ∧
    (5 : ℚ) / 8 = 75 / 120 ∧ (-84 < -80 ∧ -80 < 72 ∧ 72 < 75 ∧ 75 < 80 : Prop) ∧
    ((-0.7 : ℚ) < -2 / 3 ∧ -(2 : ℚ) / 3 < 3 / 5 ∧ (3 : ℚ) / 5 < 5 / 8 ∧ (5 : ℚ) / 8 < 2 / 3) := by
  refine ⟨by norm_num, by decide, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩

/-- Primer 4: x = 0,2(7): 10x = 2,(7), 100x = 27,(7), 100x − 10x = 27 − 2, 90x = 25, x = 25/90 = 5/18;
5/18 · 18 = 5 zmag. -/
theorem primer4 :
    let x : ℝ := 2 / 10 + rep 7 1 / 10
    10 * x = 2 + rep 7 1 ∧ 100 * x = 27 + rep 7 1 ∧ 100 * x - 10 * x = 27 - 2 ∧ 90 * x = 25 ∧
    x = 25 / 90 ∧ (25 : ℝ) / 90 = 5 / 18 ∧ (5 : ℝ) / 18 * 18 = 5 := by
  intro x
  have hp := rep_premik 7 (le_refl 1)
  norm_num at hp
  have h1 : 10 * x = 2 + rep 7 1 := by simp only [x]; ring
  have h2 : 100 * x = 27 + rep 7 1 := by simp only [x]; linarith
  exact ⟨h1, h2, by linarith, by linarith, by field_simp; linarith, by norm_num, by norm_num⟩

/-- Primer 5: −1,5 = −3/2 = −6/4; 5/4 = 1 + 1/4; −6/4 je sredina med −2 in −1; −1,5 < −3/4 < 5/4. -/
theorem primer5 : (-1.5 : ℚ) = -3 / 2 ∧ (-3 : ℚ) / 2 = -6 / 4 ∧ (5 : ℚ) / 4 = 1 + 1 / 4 ∧
    ((-2 : ℚ) + (-1)) / 2 = -6 / 4 ∧ (-1.5 : ℚ) < -3 / 4 ∧ (-3 : ℚ) / 4 < 5 / 4 := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 2: (4 + 3)/4 = 7/4 ≠ 3; (4 · 3)/4 = 3. -/
theorem krajsanje_sestevancev : ((4 : ℚ) + 3) / 4 = 7 / 4 ∧ ((4 : ℚ) + 3) / 4 ≠ 3 ∧ ((4 : ℚ) * 3) / 4 = 3 := by
  norm_num

/-- Pogoste napake 3 in 5: −1/2 < −1/3 (−0,5 levo od −0,33…); 0,(3) ≠ 3/10 = 0,3, ampak 10x − x = 3, 9x = 3,
x = 1/3. -/
theorem napake_3_5 : (-1 : ℚ) / 2 < -1 / 3 ∧ rep 3 1 ≠ 3 / 10 ∧ (3 : ℚ) / 10 = 0.3 ∧
    10 * rep 3 1 - rep 3 1 = 3 ∧ 9 * rep 3 1 = 3 ∧ rep 3 1 = 1 / 3 := by
  have hp := rep_premik 3 (le_refl 1)
  norm_num at hp
  have h : rep 3 1 = 1 / 3 := by rw [rep_eq _ (le_refl 1)]; norm_num
  refine ⟨by norm_num, by rw [h]; norm_num, by norm_num, by linarith, by linarith, h⟩

/-! ## Za maturo -/

/-- Naloga 1 in RACUN »resi: 999x = 135«: x = 0,(135): 1000x = 135,(135), 999x = 135 ⇔ x = 5/37 (135 = 27 · 5,
999 = 27 · 37); 5 · 15 = 75 > 74 = 37 · 2, zato 5/37 > 2/15. -/
theorem naloga1 :
    1000 * rep 135 3 = 135 + rep 135 3 ∧ 999 * rep 135 3 = 135 ∧ (∀ x : ℝ, 999 * x = 135 ↔ x = 5 / 37) ∧
    rep 135 3 = 135 / 999 ∧ 135 = 27 * 5 ∧ 999 = 27 * 37 ∧ (135 : ℝ) / 999 = 5 / 37 ∧
    5 * 15 = 75 ∧ 37 * 2 = 74 ∧ (2 : ℚ) / 15 < 5 / 37 := by
  have hp := rep_premik 135 (by norm_num : 1 ≤ 3)
  norm_num at hp
  have h : rep 135 3 = 135 / 999 := by rw [rep_eq _ (by norm_num : 1 ≤ 3)]; norm_num
  refine ⟨hp, by linarith, fun x => ⟨fun hx => by linarith, fun hx => by rw [hx]; norm_num⟩, h, by norm_num,
    by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 2 a), b), d): v(8, 12) = 24; 3/8 + 5/12 = 9/24 + 10/24 = 19/24; 1 − 2/3 = 1/3; 1/3 · 19/24 = 19/72
(tudi 19/24 − 2/3 · 19/24 = 19/72), 19 praštevilo, tuje z 72; 19/72 · 360 = 19 · 5 = 95 l. -/
theorem naloga2_abd :
    Nat.lcm 8 12 = 24 ∧ (3 : ℚ) / 8 + 5 / 12 = 9 / 24 + 10 / 24 ∧ (9 : ℚ) / 24 + 10 / 24 = 19 / 24 ∧
    1 - (2 : ℚ) / 3 = 1 / 3 ∧ (1 : ℚ) / 3 * (19 / 24) = 19 / 72 ∧ (19 : ℚ) / 24 - 2 / 3 * (19 / 24) = 19 / 72 ∧
    Nat.Prime 19 ∧ Nat.Coprime 19 72 ∧ (19 : ℚ) / 72 * 360 = 19 * 5 ∧ (19 : ℚ) * 5 = 95 := by
  refine ⟨by decide, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by decide,
    by norm_num, by norm_num⟩

/-- Naloga 2 c): 72 = 2³ · 3², zapis 19/72 ni končen; deljenje: 190 = 2 · 72 + 46, 460 = 6 · 72 + 28,
280 = 3 · 72 + 64, 640 = 8 · 72 + 64; 19/72 = 0,263(8) ≈ 0,2638889. -/
theorem naloga2_c :
    72 = 2 ^ 3 * 3 ^ 2 ∧ ¬ koncen (19 / 72) ∧
    (190 = 2 * 72 + 46 ∧ 460 = 6 * 72 + 28 ∧ 280 = 3 * 72 + 64 ∧ 640 = 8 * 72 + 64) ∧
    (19 : ℝ) / 72 = 263 / 1000 + rep 8 1 / 1000 ∧ |(19 : ℚ) / 72 - 0.2638889| < 0.00000005 := by
  refine ⟨by norm_num, nekoncni_primeri.2.2.2.2.1, by norm_num, ?_, ?_⟩
  · rw [rep_eq _ (le_refl 1)]; norm_num
  · rw [abs_lt]; constructor <;> norm_num

/-- Ustno vprašanje 2: 3/8 = 375/1000 = 0,375; 10ᵏ = 2ᵏ · 5ᵏ. -/
theorem ustno2 (k : ℕ) : (3 : ℚ) / 8 = 375 / 1000 ∧ (10 : ℕ) ^ k = 2 ^ k * 5 ^ k := by
  refine ⟨by norm_num, ?_⟩
  rw [show (10 : ℕ) = 2 * 5 by norm_num, mul_pow]

/-- Korak za korakom: (2/3 − 5/8) : 1/4 = (16/24 − 15/24) : 1/4 = 1/24 · 4/1 = 4/24 = 1/6 = 0,1(6);
10 = 1 · 6 + 4, 40 = 6 · 6 + 4. -/
theorem korak_za_korakom : ((2 : ℚ) / 3 - 5 / 8) / (1 / 4) = 1 / 6 ∧ 10 = 1 * 6 + 4 ∧ 40 = 6 * 6 + 4 ∧
    (1 : ℝ) / 6 = 1 / 10 + rep 6 1 / 10 := by
  refine ⟨?_, by norm_num, by norm_num, periodicni_primeri.2.2.1⟩
  calc ((2 : ℚ) / 3 - 5 / 8) / (1 / 4) = (16 / 24 - 15 / 24) / (1 / 4) := by norm_num
    _ = 1 / 24 * (4 / 1) := by norm_num
    _ = 4 / 24 := by norm_num
    _ = 1 / 6 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 2: 0,(45) = 5/11 (100x = 45,(45), 99x = 45, x = 45/99); 9/20 = 0,45 in 1/2 nista. -/
theorem kviz2 : 100 * rep 45 2 = 45 + rep 45 2 ∧ 99 * rep 45 2 = 45 ∧ rep 45 2 = 45 / 99 ∧
    (45 : ℝ) / 99 = 5 / 11 ∧ rep 45 2 ≠ 9 / 20 ∧ rep 45 2 ≠ 1 / 2 := by
  have hp := rep_premik 45 (by norm_num : 1 ≤ 2)
  norm_num at hp
  have h : rep 45 2 = 45 / 99 := by rw [rep_eq _ (by norm_num : 1 ≤ 2)]; norm_num
  refine ⟨hp, by linarith, h, by norm_num, by rw [h]; norm_num, by rw [h]; norm_num⟩

/-- Preveri se 4: −3/4 = −9/12, −2/3 = −8/12, −9 < −8, zato −3/4 < −2/3; v(4, 3) = 12. -/
theorem kviz4 : Nat.lcm 4 3 = 12 ∧ -(3 : ℚ) / 4 = -9 / 12 ∧ -(2 : ℚ) / 3 = -8 / 12 ∧ (-9 : ℤ) < -8 ∧
    -(3 : ℚ) / 4 < -2 / 3 := by
  refine ⟨by decide, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Preveri se 5: 11 · 11 = 121 > 120 = 15 · 8 ⇒ 11/15 > 8/11; 8 · 18 = 144 > 143 = 11 · 13 ⇒ 8/11 > 13/18;
prva je ekipa A. -/
theorem kviz5 : 11 * 11 = 121 ∧ 15 * 8 = 120 ∧ (8 : ℚ) / 11 < 11 / 15 ∧ 8 * 18 = 144 ∧ 11 * 13 = 143 ∧
    (13 : ℚ) / 18 < 8 / 11 := by norm_num

/-- Preveri se 6: −7/5 = −1 − 2/5 = −1,4 (točka A); B = −2/5, C = 2/5, D = 7/5. -/
theorem kviz6 : -(7 : ℚ) / 5 = -1 - 2 / 5 ∧ -(7 : ℚ) / 5 = -1.4 ∧ -(7 : ℚ) / 5 ≠ -2 / 5 ∧ -(7 : ℚ) / 5 ≠ 2 / 5 ∧
    -(7 : ℚ) / 5 ≠ 7 / 5 := by norm_num

/-- Preveri se 7: 3/4 · 7/9 + 3/4 · 2/9 = 3/4 · (7/9 + 2/9) = 3/4 · 1 = 3/4 = 0,75. -/
theorem kviz7 : (3 : ℚ) / 4 * (7 / 9) + 3 / 4 * (2 / 9) = 0.75 := by
  calc (3 : ℚ) / 4 * (7 / 9) + 3 / 4 * (2 / 9) = 3 / 4 * (7 / 9 + 2 / 9) := (mul_add _ _ _).symm
    _ = 3 / 4 * 1 := by norm_num
    _ = 3 / 4 := mul_one _
    _ = 0.75 := by norm_num

/-- Preveri se 8: 17/20 = 85/100 = 0,85 = 85 %. -/
theorem kviz8 : (17 : ℚ) / 20 = 85 / 100 ∧ (85 : ℚ) / 100 = 0.85 ∧ (17 : ℚ) / 20 * 100 = 85 := by norm_num

/-- RACUN: vrstice »vrednost« (»resi« je v `naloga1`; 58,3 in 0,2638889 sta zaokrožitvi, dokazani v `odstotki` in
`naloga2_c`). -/
theorem racun :
    (5 : ℚ) / 8 = 0.625 ∧ (35 : ℚ) / 100 = 7 / 20 ∧ (7 : ℚ) / 20 * 60 = 21 ∧ (5 : ℚ) / 6 + 2 / 9 + 1 / 6 = 11 / 9 ∧
    (3 : ℚ) / 7 * (5 / 8) + 3 / 7 * (3 / 8) = 3 / 7 ∧ (1 : ℚ) / 2 / (1 / 4) = 2 ∧ (1 : ℚ) / 4 / (1 / 2) = 1 / 2 ∧
    (-1.5 : ℚ) * 4 = -6 ∧ (3 : ℚ) / 4 * (7 / 9) + 3 / 4 * (2 / 9) = 0.75 ∧ (17 : ℚ) / 20 * 100 = 85 ∧
    (5 : ℚ) / 4 = 1.25 ∧ -(7 : ℚ) / 5 = -1.4 ∧ (135 : ℚ) / 999 = 5 / 37 ∧ (5 : ℚ) * 15 = 75 ∧ (37 : ℚ) * 2 = 74 ∧
    (3 : ℚ) / 8 + 5 / 12 = 19 / 24 ∧ 1 - (2 : ℚ) / 3 = 1 / 3 ∧ (1 : ℚ) / 3 * (19 / 24) = 19 / 72 ∧
    (19 : ℚ) / 24 - 2 / 3 * (19 / 24) = 19 / 72 ∧ (19 : ℚ) / 72 * 360 = 95 := by norm_num

end Evklid.Lekcije.MAT_SS_1.RacionalnaStevila
