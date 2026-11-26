/-
vir: content/lessons/MAT-SS-3/mesane-naloge-3-letnika.md
sha256: 02d4e1526702d09bd246bfba521c105fa5811204025b71114598467717392e34
Model: ravnina je `EuclideanSpace ℝ (Fin 2)` (točka `P2 x y`), kot med vektorjema je Mathlibov
`InnerProductGeometry.angle`, očrtani krog je `Affine.Simplex.circumradius`. Rešitve enačb in neenačb so
zapisane kot ↔ (cela množica rešitev), zaokrožene vrednosti kot |x − vrednost| < pol enote zadnjega mesta
(kot v stopinjah: · 180/π; π med 3,141592 in 3,141593).
Ni v Leanu: simulacija in graf (risba), besedni deli (»Zakaj se tega učimo«, seznam »besedilo → orodje« kot
navodilo, postopek, zgodba, premisli brez računa), pri nalogi 3 b) kot φ = arccos(3√2/8) kot kot v piramidi
(dokazan je račun; povezava s telesom: zahtevno, še ni dokazano), točkovanje. Ploščina trikotnika z
ogliščem v izhodišču in stranicama (a, b), (c, d) je v modelu ½|ad − bc| (determinanta); S = ½|u||v| sin γ
je dokazana splošno (`ploscina_sin`) in v primerih 1 in naloga 4 e). Celoštevilske ničle polinoma s celimi
koeficienti delijo prosti člen (`celostevilske_nicle`, ustno 3). Drugi način pri
ustnem 2 je dokazan za krožnico s središčem v izhodišču in premico y = kx + n.
Lean: x/0 = 0 (zato ima neenačba (x + 6)/x > x pogoj x ≠ 0 vgrajen: pri x = 0 je leva stran 0 in 0 > 0 ne
velja), √ negativnega je 0, `rpow` za tretji koren pozitivnega števila.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.MesaneNaloge3Letnika

open Real InnerProductGeometry EuclideanGeometry

/-! ## Numerično orodje: meje za sin in cos na [0, 1] -/

open Complex Finset in
/-- Taylorjev polinom za cos in sin do x⁸ z ostankom (iz `Complex.exp_bound`, n = 9).
pomozno -/
theorem sc_bound (x : ℝ) (hx : |x| ≤ 1) :
    |Real.cos x - (1 - x^2/2 + x^4/24 - x^6/720 + x^8/40320)| ≤ |x|^9 * (10 / (362880 * 9)) ∧
    |Real.sin x - (x - x^3/6 + x^5/120 - x^7/5040)| ≤ |x|^9 * (10 / (362880 * 9)) := by
  have hb := Complex.exp_bound (x := (x : ℂ) * I) (n := 9) (by simpa using hx) (by norm_num)
  have hn : ‖(x:ℂ) * I‖ = |x| := by simp
  have hI3 : I ^ 3 = -I := by rw [pow_succ, I_sq]; ring
  have hfac : ((Nat.succ 9 : ℕ) : ℝ) * ((Nat.factorial 9 : ℕ) * (9:ℕ) : ℝ)⁻¹ = 10 / (362880 * 9) := by
    norm_num [Nat.factorial]
  have hz : cexp ((x:ℂ) * I) - ∑ m ∈ range 9, ((x:ℂ) * I) ^ m / (m.factorial : ℂ) =
      (((Real.cos x - (1 - x^2/2 + x^4/24 - x^6/720 + x^8/40320)) : ℝ) : ℂ) +
      (((Real.sin x - (x - x^3/6 + x^5/120 - x^7/5040)) : ℝ) : ℂ) * I := by
    rw [exp_mul_I]
    simp only [Finset.sum_range_succ, Finset.sum_range_zero, Nat.factorial, mul_pow]
    push_cast
    ring_nf
    simp only [I_sq, hI3]
    ring_nf
  rw [hn, hfac, hz] at hb
  constructor
  · refine le_trans ?_ hb
    have := Complex.abs_re_le_norm ((((Real.cos x - (1 - x^2/2 + x^4/24 - x^6/720 + x^8/40320)) : ℝ) : ℂ) +
      (((Real.sin x - (x - x^3/6 + x^5/120 - x^7/5040)) : ℝ) : ℂ) * I)
    simp only [add_re, ofReal_re, mul_re, I_re, I_im, ofReal_im, mul_zero, mul_one, sub_zero,
      add_zero] at this
    exact this
  · refine le_trans ?_ hb
    have := Complex.abs_im_le_norm ((((Real.cos x - (1 - x^2/2 + x^4/24 - x^6/720 + x^8/40320)) : ℝ) : ℂ) +
      (((Real.sin x - (x - x^3/6 + x^5/120 - x^7/5040)) : ℝ) : ℂ) * I)
    simp only [add_im, ofReal_re, mul_im, I_re, I_im, ofReal_im, mul_zero, mul_one, zero_add,
      add_zero] at this
    exact this

/-- Spodnja meja za sin. -/
@[expose] noncomputable def sSp (x : ℝ) : ℝ := x - x^3/6 + x^5/120 - x^7/5040 - x^9/326592
/-- Zgornja meja za sin. -/
@[expose] noncomputable def sZg (x : ℝ) : ℝ := x - x^3/6 + x^5/120 - x^7/5040 + x^9/326592
/-- Spodnja meja za cos. -/
@[expose] noncomputable def cSp (x : ℝ) : ℝ := 1 - x^2/2 + x^4/24 - x^6/720 + x^8/40320 - x^9/326592
/-- Zgornja meja za cos. -/
@[expose] noncomputable def cZg (x : ℝ) : ℝ := 1 - x^2/2 + x^4/24 - x^6/720 + x^8/40320 + x^9/326592

/-- Meje sSp ≤ sin ≤ sZg, cSp ≤ cos ≤ cZg na [0, 1].
pomozno -/
theorem meje (x : ℝ) (h0 : 0 ≤ x) (h1 : x ≤ 1) :
    sSp x ≤ sin x ∧ sin x ≤ sZg x ∧ cSp x ≤ cos x ∧ cos x ≤ cZg x := by
  have hx : |x| = x := abs_of_nonneg h0
  obtain ⟨hc, hs⟩ := sc_bound x (by rw [hx]; exact h1)
  rw [hx, abs_le] at hc hs
  unfold sSp sZg cSp cZg
  refine ⟨?_, ?_, ?_, ?_⟩ <;> nlinarith [hc.1, hc.2, hs.1, hs.2]

/-- Kot v stopinjah iz arcsin: če je y₁ ≤ y ≤ y₂ in sZg a ≤ y₁, y₂ < sSp b za točki a, b tik ob
(D ∓ e)·π/180, je |arcsin y · 180/π − D| < e.
pomozno -/
theorem arcsin_stopinje {y D e y₁ y₂ : ℝ} (a b : ℝ) (hDe : 0 < D - e)
    (ha : (D - e) * 3.141593 / 180 ≤ a) (hb : b ≤ (D + e) * 3.141592 / 180) (ha1 : a ≤ 1)
    (hb0 : 0 ≤ b) (hb1 : b ≤ 1) (hy₁ : y₁ ≤ y) (hy₂ : y ≤ y₂) (hy1 : y ≤ 1)
    (hna : sZg a ≤ y₁) (hnb : y₂ < sSp b) : |arcsin y * 180 / π - D| < e := by
  have hpi1 := pi_gt_d6
  have hpi2 := pi_lt_d6
  have ha0 : 0 ≤ a := by nlinarith
  have hma := meje a ha0 ha1
  have hmb := meje b hb0 hb1
  have hya : sin a ≤ y := by linarith [hma.2.1]
  have hyb : y < sin b := by linarith [hmb.1]
  have hym : -1 ≤ y := le_trans (neg_one_le_sin a) hya
  have h1 : a ≤ arcsin y :=
    (le_arcsin_iff_sin_le ⟨by linarith, by linarith⟩ ⟨hym, hy1⟩).2 hya
  have h2 : arcsin y < b := (arcsin_lt_iff_lt_sin ⟨hym, hy1⟩ ⟨by linarith, by linarith⟩).2 hyb
  have hpi : 0 < π := pi_pos
  rw [abs_sub_lt_iff]
  constructor
  · rw [sub_lt_iff_lt_add, div_lt_iff₀ hpi]; nlinarith
  · rw [sub_lt_comm, lt_div_iff₀ hpi]; nlinarith

/-- Kot v stopinjah iz arctan: q₁ ≤ q ≤ q₂ in numerične meje za sin, cos v točkah a, b.
pomozno -/
theorem arctan_stopinje {q D e q₁ q₂ : ℝ} (a b : ℝ) (hDe : 0 < D - e)
    (ha : (D - e) * 3.141593 / 180 ≤ a) (hb : b ≤ (D + e) * 3.141592 / 180) (ha1 : a ≤ 1)
    (hb0 : 0 ≤ b) (hb1 : b ≤ 1) (hq₁ : q₁ ≤ q) (hq₂ : q ≤ q₂) (hq0 : 0 ≤ q₁)
    (hca0 : 0 ≤ cSp a) (hcb0 : 0 ≤ cZg b)
    (hna : sZg a ≤ q₁ * cSp a) (hnb : q₂ * cZg b < sSp b) : |arctan q * 180 / π - D| < e := by
  have hpi1 := pi_gt_d6
  have hpi2 := pi_lt_d6
  have ha0 : 0 ≤ a := by nlinarith
  have hma := meje a ha0 ha1
  have hmb := meje b hb0 hb1
  have hca : 0 < cos a := cos_pos_of_mem_Ioo ⟨by linarith, by linarith⟩
  have hcb : 0 < cos b := cos_pos_of_mem_Ioo ⟨by linarith, by linarith⟩
  have hqa : sin a ≤ q * cos a := by nlinarith [hma.2.1, hma.2.2.1]
  have hqb : q * cos b < sin b := by nlinarith [hmb.1, hmb.2.2.2]
  have h1 : a ≤ arctan q := by
    have : tan a ≤ q := by rw [tan_eq_sin_div_cos, div_le_iff₀ hca]; exact hqa
    calc a = arctan (tan a) := (arctan_tan (by linarith) (by linarith)).symm
      _ ≤ arctan q := arctan_strictMono.monotone this
  have h2 : arctan q < b := by
    have : q < tan b := by rw [tan_eq_sin_div_cos, lt_div_iff₀ hcb]; exact hqb
    calc arctan q < arctan (tan b) := arctan_strictMono this
      _ = b := arctan_tan (by linarith) (by linarith)
  have hpi : 0 < π := pi_pos
  rw [abs_sub_lt_iff]
  constructor
  · rw [sub_lt_iff_lt_add, div_lt_iff₀ hpi]; nlinarith
  · rw [sub_lt_comm, lt_div_iff₀ hpi]; nlinarith

/-- Meje za sin in cos kota k° (k·π/180 ≤ 1) prek mej za π (`pi_gt_d6`, `pi_lt_d6`).
pomozno -/
theorem meje_stopinj (k : ℝ) (hk : 0 ≤ k) (hk1 : k * 3.141593 / 180 ≤ 1) :
    sSp (k * 3.141592 / 180) ≤ sin (k * π / 180) ∧ sin (k * π / 180) ≤ sZg (k * 3.141593 / 180) ∧
    cSp (k * 3.141593 / 180) ≤ cos (k * π / 180) ∧ cos (k * π / 180) ≤ cZg (k * 3.141592 / 180) := by
  have hpi1 := pi_gt_d6
  have hpi2 := pi_lt_d6
  have l1 : k * 3.141592 / 180 ≤ k * π / 180 := by nlinarith
  have l2 : k * π / 180 ≤ k * 3.141593 / 180 := by nlinarith
  have h0 : 0 ≤ k * 3.141592 / 180 := by positivity
  have m1 := meje _ h0 (by nlinarith)
  have m2 := meje _ (by positivity) hk1
  refine ⟨?_, ?_, ?_, ?_⟩
  · exact m1.1.trans (sin_le_sin_of_le_of_le_pi_div_two (by linarith) (by linarith) l1)
  · exact (sin_le_sin_of_le_of_le_pi_div_two (by linarith) (by linarith) l2).trans m2.2.1
  · exact m2.2.2.1.trans (cos_le_cos_of_nonneg_of_le_pi (by linarith) (by linarith) l2)
  · exact (cos_le_cos_of_nonneg_of_le_pi h0 (by linarith) l1).trans m1.2.2.2

/-- Predpostavke orodij `sc_bound` in `meje` se dajo izpolniti (x = 1/2). Predpostavke `arcsin_stopinje` in
`arctan_stopinje` so izpolnjene ob vsaki uporabi spodaj (npr. pri kotu 35,26°). -/
example : |(1 / 2 : ℝ)| ≤ 1 ∧ (0 : ℝ) ≤ 1 / 2 ∧ (1 / 2 : ℝ) ≤ 1 := by norm_num [abs_of_pos]

/-- Predpostavke trditve `meje_stopinj` se dajo izpolniti (k = 35). -/
example : (0 : ℝ) ≤ 35 ∧ (35 : ℝ) * 3.141593 / 180 ≤ 1 := by norm_num

/-- Meje za √2.
pomozno -/
theorem sqrt2_meje : (1.41421356 : ℝ) < √2 ∧ √2 < 1.41421357 :=
  ⟨by rw [Real.lt_sqrt (by norm_num)]; norm_num, by rw [Real.sqrt_lt' (by norm_num)]; norm_num⟩

/-- Meje za √3.
pomozno -/
theorem sqrt3_meje : (1.73205080 : ℝ) < √3 ∧ √3 < 1.73205081 :=
  ⟨by rw [Real.lt_sqrt (by norm_num)]; norm_num, by rw [Real.sqrt_lt' (by norm_num)]; norm_num⟩

/-! ## Model ravnine -/

/-- Ravnina ℝ². -/
abbrev R2 := EuclideanSpace ℝ (Fin 2)

/-- Točka (vektor) s koordinatama (x, y). -/
@[expose] noncomputable def P2 (x y : ℝ) : R2 := !₂[x, y]

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
@[simp] theorem P2_0 (x y : ℝ) : P2 x y 0 = x := rfl
/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
@[simp] theorem P2_1 (x y : ℝ) : P2 x y 1 = y := rfl

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem inner_P2 (a b c d : ℝ) : inner ℝ (P2 a b) (P2 c d) = a * c + b * d := by
  simp [P2, EuclideanSpace.inner_eq_star_dotProduct, Fin.sum_univ_two, dotProduct]; ring

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem norm_P2 (a b : ℝ) : ‖P2 a b‖ = √(a ^ 2 + b ^ 2) := by
  rw [EuclideanSpace.norm_eq]; simp [P2, Fin.sum_univ_two]

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem P2_sub (a b c d : ℝ) : P2 a b - P2 c d = P2 (a - c) (b - d) := by
  ext i; fin_cases i <;> simp [P2]

/-! ## Razlaga: pekač -/

/-- Prostornina pekača V(x) = x(30 − 2x)². -/
@[expose] def V (x : ℝ) : ℝ := x * (30 - 2 * x) ^ 2

/-- Razlaga, tabela: a = 30 − 2x in V(1) = 784, V(2) = 1352, V(5) = 2000, V(10) = 1000, V(14) = 56.
trditev: MAT-SS-3/mesane-naloge-3-letnika#tabela
besedilo: »$a = 30 - 2x$« -/
theorem tabela :
    (30 : ℝ) - 2 * 1 = 28 ∧ V 1 = 784 ∧ (30 : ℝ) - 2 * 2 = 26 ∧ V 2 = 1352 ∧ (30 : ℝ) - 2 * 5 = 20 ∧
    V 5 = 2000 ∧ (30 : ℝ) - 2 * 10 = 10 ∧ V 10 = 1000 ∧ (30 : ℝ) - 2 * 14 = 2 ∧ V 14 = 56 := by
  norm_num [V]

/-- Razlaga (premisli), Preveri se (3): pri x = 15 je stranica dna 0, pri x > 15 negativna; dno je dolžina
(30 − 2x > 0) in x > 0 natanko pri 0 < x < 15.
trditev: MAT-SS-3/mesane-naloge-3-letnika#omejitev
besedilo: »Ne. Pri $x = 15$ je stranica dna $30 - 30 = 0$, pri večjem $x$ bi bila negativna. Zato pride v poštev le $0 < x < 15$. Enačba lahko ima tudi rešitev zunaj tega intervala, a te pekač ne more imeti.« -/
theorem omejitev (x : ℝ) : (30 : ℝ) - 2 * 15 = 0 ∧ (15 < x → 30 - 2 * x < 0) ∧
    (0 < x ∧ 0 < 30 - 2 * x ↔ 0 < x ∧ x < 15) := by
  refine ⟨by norm_num, fun h => by linarith, ⟨fun ⟨h1, h2⟩ => ⟨h1, by linarith⟩, fun ⟨h1, h2⟩ => ⟨h1, by linarith⟩⟩⟩

/-- Razlaga: prostornina na (0, 15) najprej raste (na (0, 5]), nato pada (na [5, 15)).
trditev: MAT-SS-3/mesane-naloge-3-letnika#raste-pada
besedilo: »Prostornina najprej raste, nato pada.« -/
theorem raste_pada : StrictMonoOn V (Set.Ioc 0 5) ∧ StrictAntiOn V (Set.Ico 5 15) := by
  constructor
  · intro x hx y hy hxy
    simp only [V]
    obtain ⟨hx0, hx5⟩ := hx; obtain ⟨hy0, hy5⟩ := hy
    have e : y * (30 - 2 * y) ^ 2 - x * (30 - 2 * x) ^ 2 =
        (y - x) * (4 * (x ^ 2 + x * y + y ^ 2) - 120 * (x + y) + 900) := by ring
    have : 0 < 4 * (x ^ 2 + x * y + y ^ 2) - 120 * (x + y) + 900 := by
      nlinarith [mul_pos (sub_pos.2 hxy) (sub_pos.2 hxy), mul_nonneg (sub_nonneg.2 hx5) (sub_nonneg.2 hy5)]
    nlinarith [mul_pos (sub_pos.2 hxy) this]
  · intro x hx y hy hxy
    simp only [V]
    obtain ⟨hx5, hx15⟩ := hx; obtain ⟨hy5, hy15⟩ := hy
    have e : x * (30 - 2 * x) ^ 2 - y * (30 - 2 * y) ^ 2 =
        (y - x) * (-(4 * (x ^ 2 + x * y + y ^ 2) - 120 * (x + y) + 900)) := by ring
    have : 0 < -(4 * (x ^ 2 + x * y + y ^ 2) - 120 * (x + y) + 900) := by
      nlinarith [mul_pos (sub_pos.2 hxy) (sub_pos.2 hxy), mul_nonneg (sub_nonneg.2 hx5) (sub_nonneg.2 hy5),
        mul_pos (sub_pos.2 hx15) (sub_pos.2 hy15)]
    nlinarith [mul_pos (sub_pos.2 hxy) this]

/-- Razlaga: V(x) = 1000 ⇔ 4x³ − 120x² + 900x − 1000 = 0 ⇔ x³ − 30x² + 225x − 250 = 0.
trditev: MAT-SS-3/mesane-naloge-3-letnika#enacba-pekaca
besedilo: »Iz tabele v enačbo.** Splošno je prostornina $V(x) = x(30 - 2x)^2$ za $0 < x < 15$. Pogoj $V(x) = 1000$ je enačba tretje stopnje. Ko izraz zmnožimo in vse prenesemo na levo, dobimo $4x^3 - 120x^2 + 900x - 1000 = 0$. Delimo s $4$ in dobimo« -/
theorem enacba_pekaca (x : ℝ) :
    (V x = 1000 ↔ 4 * x ^ 3 - 120 * x ^ 2 + 900 * x - 1000 = 0) ∧
    (4 * x ^ 3 - 120 * x ^ 2 + 900 * x - 1000 = 0 ↔ x ^ 3 - 30 * x ^ 2 + 225 * x - 250 = 0) := by
  simp only [V]
  constructor <;> constructor <;> intro h <;> linarith

/-- Primer 4: Horner s koeficienti 1, −30, 225, −250 pri x = 10 da 1, −20, 25 in ostanek 0, torej
x³ − 30x² + 225x − 250 = (x − 10)(x² − 20x + 25).
trditev: MAT-SS-3/mesane-naloge-3-letnika#horner
besedilo: »$x^3 - 30x^2 + 225x - 250 = (x - 10)(x^2 - 20x + 25)$« -/
theorem horner (x : ℝ) :
    (1 : ℝ) * 10 - 30 = -20 ∧ (-20 : ℝ) * 10 + 225 = 25 ∧ (25 : ℝ) * 10 - 250 = 0 ∧
    x ^ 3 - 30 * x ^ 2 + 225 * x - 250 = (x - 10) * (x ^ 2 - 20 * x + 25) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by ring⟩

/-- Primer 4 (premisli), RAČUN: x² − 20x + 25 = 0 ⇔ x = (20 ± √(400 − 100))/2 = 10 ± 5√3.
trditev: MAT-SS-3/mesane-naloge-3-letnika#kvadratni-faktor
besedilo: »$x = \frac{20 \pm \sqrt{400 - 100}}{2} = 10 \pm 5\sqrt{3}$« -/
theorem kvadratni_faktor (x : ℝ) :
    √(400 - 100 : ℝ) = 10 * √3 ∧ (20 + 10 * √3) / 2 = 10 + 5 * √3 ∧
    (x ^ 2 - 20 * x + 25 = 0 ↔ x = 10 - 5 * √3 ∨ x = 10 + 5 * √3) := by
  have h3 : √3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  refine ⟨?_, by ring, ?_⟩
  · rw [show (400 - 100 : ℝ) = 10 ^ 2 * 3 by norm_num, Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  · constructor
    · intro h
      have : (x - (10 - 5 * √3)) * (x - (10 + 5 * √3)) = 0 := by nlinarith
      rcases mul_eq_zero.1 this with h1 | h1
      · left; linarith
      · right; linarith
    · rintro (rfl | rfl) <;> nlinarith

/-- RAČUN, Primer 4: vse rešitve x³ − 30x² + 225x − 250 = 0 (in x(30 − 2x)² = 1000) so 10, 10 − 5√3,
10 + 5√3; 10 − 5√3 ≈ 1,34 ≈ 1,3, 10 + 5√3 ≈ 18,66 > 15 (odpade, 30 − 2x ≈ −7,3 < 0). Pri pogoju
0 < x < 15 sta rešitvi natanko 10 in 10 − 5√3, slednja med 1 in 2 (tabela: V(1) < 1000 < V(2)).
trditev: MAT-SS-3/mesane-naloge-3-letnika#pekac
besedilo: »reši enačbo $x^3 - 30x^2 + 225x - 250 = 0$ pri pogoju $0 < x < 15$.« -/
theorem pekac (x : ℝ) :
    (x ^ 3 - 30 * x ^ 2 + 225 * x - 250 = 0 ↔ x = 10 ∨ x = 10 - 5 * √3 ∨ x = 10 + 5 * √3) ∧
    (V x = 1000 ↔ x = 10 ∨ x = 10 - 5 * √3 ∨ x = 10 + 5 * √3) ∧
    ((V x = 1000 ∧ 0 < x ∧ x < 15) ↔ x = 10 ∨ x = 10 - 5 * √3) ∧
    |10 - 5 * √3 - 1.34| < 0.005 ∧ |10 - 5 * √3 - 1.3| < 0.05 ∧ |10 + 5 * √3 - 18.66| < 0.005 ∧
    15 < 10 + 5 * √3 ∧ |30 - 2 * (10 + 5 * √3) - (-7.3)| < 0.05 ∧ 1 < 10 - 5 * √3 ∧ 10 - 5 * √3 < 2 := by
  obtain ⟨t1, t2⟩ := sqrt3_meje
  have hc : x ^ 3 - 30 * x ^ 2 + 225 * x - 250 = 0 ↔ x = 10 ∨ x = 10 - 5 * √3 ∨ x = 10 + 5 * √3 := by
    rw [(horner x).2.2.2, mul_eq_zero, sub_eq_zero, (kvadratni_faktor x).2.2]
  have hv : V x = 1000 ↔ x = 10 ∨ x = 10 - 5 * √3 ∨ x = 10 + 5 * √3 := by
    rw [(enacba_pekaca x).1, (enacba_pekaca x).2, hc]
  refine ⟨hc, hv, ?_, ?_, ?_, ?_, by linarith, ?_, by linarith, by linarith⟩
  · rw [hv]
    constructor
    · rintro ⟨h | h | h, h0, h15⟩
      · exact Or.inl h
      · exact Or.inr h
      · rw [h] at h15; linarith
    · rintro (h | h) <;> subst h
      · exact ⟨Or.inl rfl, by norm_num, by norm_num⟩
      · exact ⟨Or.inr (Or.inl rfl), by linarith, by linarith⟩
  all_goals rw [abs_lt]; constructor <;> linarith

/-! ## Razlaga: premica in krožnica -/

/-- Razlaga (drugi poskus): x² + (x + n)² = 8 ⇔ 2x² + 2nx + n² − 8 = 0; D = 4n² − 8(n² − 8) = 64 − 4n².
trditev: MAT-SS-3/mesane-naloge-3-letnika#premica-kroznica
besedilo: »$D = 4n^2 - 8(n^2 - 8) = 64 - 4n^2$« -/
theorem premica_kroznica (x n : ℝ) :
    (x ^ 2 + (x + n) ^ 2 = 8 ↔ 2 * x ^ 2 + 2 * n * x + n ^ 2 - 8 = 0) ∧
    discrim 2 (2 * n) (n ^ 2 - 8) = 4 * n ^ 2 - 8 * (n ^ 2 - 8) ∧ 4 * n ^ 2 - 8 * (n ^ 2 - 8) = 64 - 4 * n ^ 2 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, by unfold discrim; ring, by ring⟩

/-- Razlaga (pravilo): pri a ≠ 0 diskriminanta D = b² − 4ac pove število rešitev ax² + bx + c = 0:
D > 0 dve različni, D = 0 ena (x = −b/(2a)), D < 0 nobene.
trditev: MAT-SS-3/mesane-naloge-3-letnika#diskriminanta
besedilo: »Pri kvadratni enačbi število rešitev pove diskriminanta: $D > 0$ dve presečišči, $D = 0$ dotikališče (premica je tangenta), $D < 0$ nobene skupne točke.« -/
theorem diskriminanta (a b c : ℝ) (ha : a ≠ 0) :
    (0 < discrim a b c → ∀ x, a * x ^ 2 + b * x + c = 0 ↔
      x = (-b + √(discrim a b c)) / (2 * a) ∨ x = (-b - √(discrim a b c)) / (2 * a)) ∧
    (0 < discrim a b c → (-b + √(discrim a b c)) / (2 * a) ≠ (-b - √(discrim a b c)) / (2 * a)) ∧
    (discrim a b c = 0 → ∀ x, a * x ^ 2 + b * x + c = 0 ↔ x = -b / (2 * a)) ∧
    (discrim a b c < 0 → ∀ x, a * x ^ 2 + b * x + c ≠ 0) := by
  refine ⟨fun hD x => ?_, fun hD h => ?_, fun hD x => ?_, fun hD x => ?_⟩
  · rw [← quadratic_eq_zero_iff ha (s := √(discrim a b c)) (Real.mul_self_sqrt hD.le).symm x]; ring_nf
  · have h2 : (2 * a) ≠ 0 := by positivity
    rw [div_left_inj₀ h2] at h
    have : √(discrim a b c) = 0 := by linarith
    rw [Real.sqrt_eq_zero hD.le] at this; linarith
  · rw [← quadratic_eq_zero_iff_of_discrim_eq_zero ha hD x]; ring_nf
  · have := quadratic_ne_zero_of_discrim_ne_sq (a := a) (b := b) (c := c)
      (fun s hs => by nlinarith [sq_nonneg s]) x
    intro h; apply this; linarith [h]

/-- Predpostavka trditve `diskriminanta` se da izpolniti (a = 2). -/
example : (2:ℝ) ≠ 0 := by norm_num

/-- Predpostavke trditve `diskriminanta` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2:ℝ) ≠ 0 := by norm_num
  diskriminanta (ha := w)

/-- Razlaga, tabela: n = 2: D = 48, dve rešitvi x = −1 ± √3 (seka); n = 4: D = 0, ena rešitev x = −2
(dotika se, točka (−2, 2)); n = 6: D = −80, nobene (mimo). RAČUN: 4·4² − 8(4² − 8) = 0, 64 − 4·2² = 48,
64 − 4·6² = −80, 2x² + 8x + 8 = 0 ⇔ x = −2.
trditev: MAT-SS-3/mesane-naloge-3-letnika#tabela-n
besedilo: »$D = 4n^2 - 8(n^2 - 8) = 64 - 4n^2$« -/
theorem tabela_n (x : ℝ) :
    (64 : ℝ) - 4 * 2 ^ 2 = 48 ∧ (x ^ 2 + (x + 2) ^ 2 = 8 ↔ x = -1 + √3 ∨ x = -1 - √3) ∧
    (4 : ℝ) * 4 ^ 2 - 8 * (4 ^ 2 - 8) = 0 ∧ (x ^ 2 + (x + 4) ^ 2 = 8 ↔ x = -2) ∧
    (2 * x ^ 2 + 8 * x + 8 = 0 ↔ x = -2) ∧ (-2 : ℝ) + 4 = 2 ∧
    (64 : ℝ) - 4 * 6 ^ 2 = -80 ∧ x ^ 2 + (x + 6) ^ 2 ≠ 8 := by
  have h3 : √3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  refine ⟨by norm_num, ?_, by norm_num, ?_, ?_, by norm_num, by norm_num, ?_⟩
  · constructor
    · intro h
      have : (x - (-1 + √3)) * (x - (-1 - √3)) = 0 := by nlinarith
      rcases mul_eq_zero.1 this with h1 | h1
      · left; linarith
      · right; linarith
    · rintro (rfl | rfl) <;> nlinarith
  · constructor
    · intro h; nlinarith [sq_nonneg (x + 2)]
    · rintro rfl; norm_num
  · constructor
    · intro h; nlinarith [sq_nonneg (x + 2)]
    · rintro rfl; norm_num
  · intro h; nlinarith [sq_nonneg (x + 3)]

/-- Razlaga (premisli): polmer v dotikališču leži na y = −x, ta je pravokotna na y = x + 4 (smeri (1, −1)
in (1, 1)); −x = x + 4 da x = −2, y = 2; tudi −2n/4 = −2 pri n = 4.
trditev: MAT-SS-3/mesane-naloge-3-letnika#dotikalisce
besedilo: »Tangenta je pravokotna na polmer v dotikališču. Polmer leži na premici $y = -x$ skozi središče, ki je pravokotna na $y = x + 4$. Iz $-x = x + 4$ dobiš $x = -2$ in $y = 2$, točka $(-2, 2)$. Račun potrdi: pri $D = 0$ je $x = -\frac{2n}{4} = -2$.« -/
theorem dotikalisce (x : ℝ) :
    inner ℝ (P2 1 (-1)) (P2 1 1) = 0 ∧ (-x = x + 4 ↔ x = -2) ∧ -(-2 : ℝ) = 2 ∧ -(2 * 4) / 4 = (-2 : ℝ) := by
  refine ⟨by simp [inner_P2], ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, by norm_num⟩

/-! ## Orodja: skalarni produkt, kot, tangenta -/

/-- Seznam orodij, Povzetek, Ustno vprašanje 1: cos φ = ⟪a, b⟫/(|a||b|); ⟪a, b⟫ = |a||b| cos φ;
neničelna vektorja sta pravokotna ⇔ ⟪a, b⟫ = 0 (φ = 90°); negativen skalarni produkt ⇔ top kot;
kosinus je vedno med −1 in 1 (Pogoste napake).
trditev: MAT-SS-3/mesane-naloge-3-letnika#kot-vektorjev
besedilo: »Kot dobiš iz $\cos\varphi = \frac{\vec a \cdot \vec b}{|\vec a|\,|\vec b|}$; negativen skalarni produkt pomeni top kot.« -/
theorem kot_vektorjev {E : Type*} [NormedAddCommGroup E] [InnerProductSpace ℝ E] (a b : E)
    (_ha : a ≠ 0) (_hb : b ≠ 0) :
    cos (InnerProductGeometry.angle a b) = inner ℝ a b / (‖a‖ * ‖b‖) ∧ inner ℝ a b = ‖a‖ * ‖b‖ * cos (InnerProductGeometry.angle a b) ∧
    (inner ℝ a b = 0 ↔ InnerProductGeometry.angle a b = π / 2) ∧ (inner ℝ a b < 0 ↔ π / 2 < InnerProductGeometry.angle a b) ∧
    -1 ≤ inner ℝ a b / (‖a‖ * ‖b‖) ∧ inner ℝ a b / (‖a‖ * ‖b‖) ≤ 1 := by
  refine ⟨cos_angle a b, by rw [← cos_angle_mul_norm_mul_norm]; ring, inner_eq_zero_iff_angle_eq_pi_div_two a b,
    inner_neg_iff_pi_div_two_lt_angle, (abs_le.1 (abs_real_inner_div_norm_mul_norm_le_one a b)).1,
    (abs_le.1 (abs_real_inner_div_norm_mul_norm_le_one a b)).2⟩

/-- Predpostavke trditve `kot_vektorjev` se dajo izpolniti (a = (1, 0), b = (0, 1)). -/
example : P2 1 0 ≠ 0 ∧ P2 0 1 ≠ 0 := by
  constructor
  · intro h; have := congrFun (congrArg (⇑) h) 0; simp [P2] at this
  · intro h; have := congrFun (congrArg (⇑) h) 1; simp [P2] at this

/-- Predpostavke trditve `kot_vektorjev` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : P2 1 0 ≠ 0 ∧ P2 0 1 ≠ 0 := by
    constructor
    · intro h; have := congrFun (congrArg (⇑) h) 0; simp [P2] at this
    · intro h; have := congrFun (congrArg (⇑) h) 1; simp [P2] at this
  kot_vektorjev (_ha := w.1) (_hb := w.2)

/-- Seznam orodij (ploščina): za trikotnik s stranicama u = (a, b), v = (c, d) iz istega oglišča je
½|u||v| sin γ = ½|ad − bc| (ploščina z determinanto).
trditev: MAT-SS-3/mesane-naloge-3-letnika#ploscina-sin
besedilo: »$S = \frac{1}{2}ab\sin\gamma$« -/
theorem ploscina_sin (a b c d : ℝ) :
    1 / 2 * ‖P2 a b‖ * ‖P2 c d‖ * sin (InnerProductGeometry.angle (P2 a b) (P2 c d)) =
      1 / 2 * |a * d - b * c| := by
  have h := sin_angle_mul_norm_mul_norm (P2 a b) (P2 c d)
  rw [inner_P2, inner_P2, inner_P2,
    show (a * a + b * b) * (c * c + d * d) - (a * c + b * d) * (a * c + b * d) = (a * d - b * c) ^ 2 by ring,
    Real.sqrt_sq_eq_abs] at h
  rw [← h]; ring

/-- Ustno vprašanje 3: celoštevilska ničla a polinoma s celimi koeficienti deli prosti člen.
trditev: MAT-SS-3/mesane-naloge-3-letnika#celostevilske-nicle
besedilo: »Celoštevilske ničle polinoma s celimi koeficienti so delitelji prostega člena.« -/
theorem celostevilske_nicle (p : Polynomial ℤ) (a : ℤ) (h : p.IsRoot a) : a ∣ p.coeff 0 := by
  obtain ⟨q, hq⟩ := Polynomial.dvd_iff_isRoot.2 h
  rw [hq, Polynomial.mul_coeff_zero]
  simp

/-- Predpostavka trditve `celostevilske_nicle` se da izpolniti (p = x − 2, a = 2). -/
example : (Polynomial.X - Polynomial.C (2 : ℤ)).IsRoot 2 := by simp

/-- Predpostavke trditve `celostevilske_nicle` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (Polynomial.X - Polynomial.C (2 : ℤ)).IsRoot 2 := by simp
  celostevilske_nicle (h := w)

/-- Ustno vprašanje 2 (višja raven): premica y = kx + n in krožnica x² + y² = r² (r ≥ 0): enačba
(1 + k²)x² + 2knx + n² − r² = 0 ima diskriminanto 4(r²(1 + k²) − n²), zato je D = 0 (tangenta) natanko
tedaj, ko je razdalja |n|/√(1 + k²) središča od premice enaka polmeru r.
trditev: MAT-SS-3/mesane-naloge-3-letnika#tangenta
besedilo: »(višja raven) Premica $y = x + n$ se dotika krožnice $x^2 + y^2 = 2$.« -/
theorem tangenta (k n r : ℝ) (hr : 0 ≤ r) :
    discrim (1 + k ^ 2) (2 * k * n) (n ^ 2 - r ^ 2) = 4 * (r ^ 2 * (1 + k ^ 2) - n ^ 2) ∧
    (discrim (1 + k ^ 2) (2 * k * n) (n ^ 2 - r ^ 2) = 0 ↔ |n| / √(1 + k ^ 2) = r) := by
  have hk : 0 < √(1 + k ^ 2) := Real.sqrt_pos.2 (by positivity)
  have hk2 : √(1 + k ^ 2) ^ 2 = 1 + k ^ 2 := Real.sq_sqrt (by positivity)
  refine ⟨by unfold discrim; ring, ?_⟩
  unfold discrim
  rw [div_eq_iff hk.ne']
  constructor
  · intro h
    have h1 : |n| ^ 2 = (r * √(1 + k ^ 2)) ^ 2 := by rw [sq_abs, mul_pow, hk2]; nlinarith
    exact (pow_left_inj₀ (abs_nonneg n) (by positivity) two_ne_zero).1 h1
  · intro h
    have : |n| ^ 2 = (r * √(1 + k ^ 2)) ^ 2 := by rw [h]
    rw [sq_abs, mul_pow, hk2] at this; nlinarith

/-- Predpostavka trditve `tangenta` se da izpolniti (r = 1). -/
example : (0:ℝ) ≤ 1 := zero_le_one

/-- Predpostavke trditve `tangenta` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 1 := zero_le_one
  tangenta (hr := w)

/-- Ustno vprašanje 3: a je ničla polinoma p natanko tedaj, ko je p = (x − a)·q, kjer je q količnik
deljenja z x − a (izrek o ničli, Mathlib).
trditev: MAT-SS-3/mesane-naloge-3-letnika#izrek-o-nicli
besedilo: »Po izreku o ničli je tedaj $p(x) = (x - a)\,q(x)$, torej je $x - a$ delitelj polinoma.« -/
theorem izrek_o_nicli (p : Polynomial ℝ) (a : ℝ) :
    (Polynomial.X - Polynomial.C a) * (p /ₘ (Polynomial.X - Polynomial.C a)) = p ↔ p.IsRoot a :=
  Polynomial.mul_divByMonic_eq_iff_isRoot

/-! ## Primer 1: kot in ploščina iz koordinat -/

/-- Primer 1: AB = (4, 0), AC = (2, 2), ⟪AB, AC⟫ = 4·2 + 0·2 = 8, |AB| = 4, |AC| = √8 = 2√2,
cos α = 8/(4·2√2) = √2/2, α = 45°; S = ½·4·2√2·√2/2 = 4 = 4·2/2. RAČUN: arccos(8/(4·2√2))·180/π = 45.
trditev: MAT-SS-3/mesane-naloge-3-letnika#primer1
besedilo: »$\cos\alpha = \frac{8}{4 \cdot 2\sqrt{2}} = \frac{\sqrt{2}}{2}$, zato $\alpha = 45^\circ$ (poseben kot, računalo ni potrebno).« -/
theorem primer1 :
    P2 4 0 - P2 0 0 = P2 4 0 ∧ P2 2 2 - P2 0 0 = P2 2 2 ∧ inner ℝ (P2 4 0) (P2 2 2) = 4 * 2 + 0 * 2 ∧
    (4 : ℝ) * 2 + 0 * 2 = 8 ∧ ‖P2 4 0‖ = 4 ∧ ‖P2 2 2‖ = √8 ∧ √8 = 2 * √2 ∧
    cos (InnerProductGeometry.angle (P2 4 0) (P2 2 2)) = 8 / (4 * (2 * √2)) ∧ 8 / (4 * (2 * √2)) = √2 / 2 ∧
    InnerProductGeometry.angle (P2 4 0) (P2 2 2) = π / 4 ∧ InnerProductGeometry.angle (P2 4 0) (P2 2 2) * 180 / π = 45 ∧
    1 / 2 * 4 * (2 * √2) * (√2 / 2) = 4 ∧ (4 : ℝ) * 2 / 2 = 4 := by
  have h2 : √2 * √2 = 2 := Real.mul_self_sqrt (by norm_num)
  have hs : 0 < √2 := by positivity
  have n1 : ‖P2 4 0‖ = 4 := by
    rw [norm_P2]; simp
  have n2 : ‖P2 2 2‖ = √8 := by rw [norm_P2]; norm_num
  have h8 : √8 = 2 * √2 := by
    rw [show (8 : ℝ) = 2 ^ 2 * 2 by norm_num, Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  have hc : cos (InnerProductGeometry.angle (P2 4 0) (P2 2 2)) = 8 / (4 * (2 * √2)) := by
    rw [cos_angle, inner_P2, n1, n2, h8]; norm_num
  have hv : 8 / (4 * (2 * √2)) = √2 / 2 := by field_simp; nlinarith
  have ha : InnerProductGeometry.angle (P2 4 0) (P2 2 2) = π / 4 := by
    rw [← arccos_cos (angle_nonneg _ _) (angle_le_pi _ _), hc, hv, ← cos_pi_div_four,
      arccos_cos (by linarith [pi_pos]) (by linarith [pi_pos])]
  refine ⟨by simp [P2_sub], by simp [P2_sub], inner_P2 _ _ _ _, by norm_num, n1, n2, h8, hc, hv, ha, ?_, ?_,
    by norm_num⟩
  · rw [ha]; field_simp; ring
  · field_simp; nlinarith

/-! ## Primer 2: racionalna neenačba -/

/-- Primer 2 (višja raven), RAČUN: (x + 6)/x > x ⇔ x ∈ (−∞, −2) ∪ (0, 3) (pri x = 0 Lean da (x+6)/x = 0,
zato 0 ni rešitev, kot v lekciji). Koraki: (x + 6)/x − x = (x + 6 − x²)/x, −x² + x + 6 = −(x − 3)(x + 2).
trditev: MAT-SS-3/mesane-naloge-3-letnika#primer2
besedilo: »Števec razstavimo: $-x^2 + x + 6 = -(x - 3)(x + 2)$. Ničli sta $-2$ in $3$, pol je $0$.« -/
theorem primer2 (x : ℝ) :
    ((x + 6) / x > x ↔ x < -2 ∨ (0 < x ∧ x < 3)) ∧
    (x ≠ 0 → (x + 6) / x - x = (x + 6 - x ^ 2) / x) ∧ -x ^ 2 + x + 6 = -((x - 3) * (x + 2)) := by
  refine ⟨?_, fun hx => by field_simp, by ring⟩
  rcases lt_trichotomy x 0 with h | h | h
  · rw [gt_iff_lt, lt_div_iff_of_neg h]
    constructor
    · intro h1; left; nlinarith
    · rintro (h1 | ⟨h1, -⟩)
      · nlinarith
      · linarith
  · subst h; simp
  · rw [gt_iff_lt, lt_div_iff₀ h]
    constructor
    · intro h1; right; exact ⟨h, by nlinarith⟩
    · rintro (h1 | ⟨-, h1⟩)
      · linarith
      · nlinarith

/-- Primer 2 (koraka 3, 4): poskusne točke (x + 6 − x²)/x: pri −3 je 2, pri −1 je −4, pri 1 je 6,
pri 4 je −1,5; v ničlah −2 in 3 se graf in premica sekata: f(−2) = −2, f(3) = 3.
trditev: MAT-SS-3/mesane-naloge-3-letnika#primer2-tocke
besedilo: »Predznak preverimo na vsakem intervalu s poskusno točko. Pri $x = -3$ je izraz $2 > 0$, pri $x = -1$ je $-4 < 0$, pri $x = 1$ je $6 > 0$, pri $x = 4$ je $-1{,}5 < 0$.« -/
theorem primer2_tocke :
    ((-3 : ℝ) + 6 - (-3) ^ 2) / (-3) = 2 ∧ ((-1 : ℝ) + 6 - (-1) ^ 2) / (-1) = -4 ∧
    ((1 : ℝ) + 6 - 1 ^ 2) / 1 = 6 ∧ ((4 : ℝ) + 6 - 4 ^ 2) / 4 = -1.5 ∧
    ((-2 : ℝ) + 6) / (-2) = -2 ∧ ((3 : ℝ) + 6) / 3 = 3 := by norm_num

/-- Pogoste napake (4): z množenjem z x dobiš x + 6 > x² ⇔ −2 < x < 3, kar ni prava množica rešitev:
izgubiš (−∞, −2) (npr. −3) in dodaš (−2, 0) (npr. −1).
trditev: MAT-SS-3/mesane-naloge-3-letnika#mnozenje-z-imenovalcem
besedilo: »(višja raven) **Množenje neenačbe z imenovalcem.** Iz $\frac{x + 6}{x} > x$ z množenjem z $x$ dobiš $x + 6 > x^2$, kar velja le za $x > 0$.« -/
theorem mnozenje_z_imenovalcem (x : ℝ) :
    (x + 6 > x ^ 2 ↔ -2 < x ∧ x < 3) ∧ ((-3 + 6) / (-3 : ℝ) > -3) ∧ ¬ ((-1 + 6) / (-1 : ℝ) > -1) := by
  refine ⟨⟨fun h => ⟨by nlinarith, by nlinarith⟩, fun ⟨h1, h2⟩ => by nlinarith⟩, by norm_num, by norm_num⟩

/-! ## Primer 3: kozarec za koktajl -/

/-- Primer 3: V = π·16·12/3 = 64π ≈ 201,1, polovica 32π; ρ = 4h/12 = h/3, V_s = π/3·h²/9·h = πh³/27;
πh³/27 = 32π ⇔ h³ = 864 ⇔ h = ∛864 ≈ 9,52 ≈ 9,5 (za realni h), kar je več kot 6.
trditev: MAT-SS-3/mesane-naloge-3-letnika#primer3
besedilo: »Prostornina kozarca: $V = \frac{\pi \cdot 16 \cdot 12}{3} = 64\pi \approx 201{,}1\,\mathrm{cm^3}$. Polovica je $32\pi\,\mathrm{cm^3}$.« -/
theorem primer3 (h : ℝ) :
    π * 16 * 12 / 3 = 64 * π ∧ |64 * π - 201.1| < 0.05 ∧ 64 * π / 2 = 32 * π ∧ 4 / 12 * h = h / 3 ∧
    π / 3 * (h ^ 2 / 9) * h = π * h ^ 3 / 27 ∧ (π * h ^ 3 / 27 = 32 * π ↔ h ^ 3 = 864) ∧
    (h ^ 3 = 864 ↔ h = (864 : ℝ) ^ ((1 : ℝ) / 3)) ∧ |(864 : ℝ) ^ ((1 : ℝ) / 3) - 9.52| < 0.005 ∧
    |(864 : ℝ) ^ ((1 : ℝ) / 3) - 9.5| < 0.05 ∧ 6 < (864 : ℝ) ^ ((1 : ℝ) / 3) := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  set c := (864 : ℝ) ^ ((1 : ℝ) / 3) with hcdef
  have hc : c ^ 3 = 864 := by
    rw [hcdef, ← Real.rpow_natCast, ← Real.rpow_mul (by norm_num)]; norm_num
  have hc0 : 0 < c := by positivity
  have c1 : (9.524 : ℝ) < c := by
    by_contra hh; push Not at hh
    have := pow_le_pow_left₀ hc0.le hh 3; norm_num at this; linarith
  have c2 : c < (9.525 : ℝ) := by
    by_contra hh; push Not at hh
    have := pow_le_pow_left₀ (by norm_num) hh 3; norm_num at this; linarith
  refine ⟨by ring, by rw [abs_lt]; constructor <;> linarith, by ring, by ring, by ring, ?_, ?_,
    by rw [abs_lt]; constructor <;> linarith, by rw [abs_lt]; constructor <;> linarith, by linarith⟩
  · have := pi_pos
    constructor
    · intro hh; nlinarith
    · intro hh; rw [hh]; ring
  · constructor
    · intro hh
      have hh0 : 0 < h := by nlinarith [sq_nonneg h, sq_nonneg (h + 1)]
      exact (pow_left_inj₀ hh0.le hc0.le (by norm_num)).1 (hh.trans hc.symm)
    · rintro rfl; exact hc

/-- Primer 3 (korak 6), Pogoste napake, Pazi na: polovica višine da (1/2)³ = 1/8 prostornine; pri podobnih
telesih s koeficientom k se ploščine pomnožijo s k², prostornine s k³.
trditev: MAT-SS-3/mesane-naloge-3-letnika#podobna-telesa
besedilo: »Smisel: polovica višine bi dala le $\left(\frac{1}{2}\right)^3 = \frac{1}{8}$ prostornine, ker se pri podobnih telesih prostornina spremeni s kubom koeficienta. Zato mora biti gladina precej više od $6\,\mathrm{cm}$.« -/
theorem podobna_telesa (k r v : ℝ) :
    ((1 : ℝ) / 2) ^ 3 = 1 / 8 ∧ π * (k * r) ^ 2 * (k * v) / 3 = k ^ 3 * (π * r ^ 2 * v / 3) ∧
    π * (k * r) ^ 2 = k ^ 2 * (π * r ^ 2) := ⟨by norm_num, by ring, by ring⟩

/-- Drugače (korak za korakom): h = 6: polmer 2, π·4·6/3 = 8π ≈ 25,1 = 64π/8; h = 9: polmer 3, π·9·9/3 = 27π
≈ 84,8 < 32π ≈ 100,5; h = 10: polmer 10/3, 1000π/27 ≈ 116,4 > 32π; gladina je med 9 in 10.
trditev: MAT-SS-3/mesane-naloge-3-letnika#kozarec-stevila
besedilo: »Do višine $9$: polmer $3$, prostornina $\frac{\pi \cdot 9 \cdot 9}{3} = 27\pi \approx 84{,}8\,\mathrm{cm^3}$. Še vedno manj kot $32\pi \approx 100{,}5\,\mathrm{cm^3}$.« -/
theorem kozarec_stevila :
    π * 4 * 6 / 3 = 8 * π ∧ 8 * π = 64 * π / 8 ∧ |8 * π - 25.1| < 0.05 ∧ π * 9 * 9 / 3 = 27 * π ∧
    |27 * π - 84.8| < 0.05 ∧ |32 * π - 100.5| < 0.05 ∧ 27 * π < 32 * π ∧
    π * (10 / 3) ^ 2 * 10 / 3 = 1000 * π / 27 ∧ |1000 * π / 27 - 116.4| < 0.05 ∧ 32 * π < 1000 * π / 27 ∧
    (9 : ℝ) < (864 : ℝ) ^ ((1 : ℝ) / 3) ∧ (864 : ℝ) ^ ((1 : ℝ) / 3) < 10 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  have h := primer3 0
  refine ⟨by ring, by ring, ?_, by ring, ?_, ?_, by linarith, by ring, ?_, by linarith, ?_, ?_⟩
  all_goals first
    | (rw [abs_lt]; constructor <;> linarith)
    | (have := h.2.2.2.2.2.2.2.1; rw [abs_lt] at this; linarith [this.1, this.2])

/-! ## Za maturo -/

/-- Naloga 1 (sinusni izrek z očrtanim krogom, Mathlib): v trikotniku s stranico a = 6 nasproti kota 30°
je 2R = a/sin α = 6/(1/2) = 12, R = 6, ploščina kroga πR² = 36π.
trditev: MAT-SS-3/mesane-naloge-3-letnika#naloga1
besedilo: »V trikotniku je stranica $a = 6\,\mathrm{cm}$, kot nasproti nje pa $\alpha = 30^\circ$. Izračunajte polmer trikotniku očrtanega kroga in ploščino tega kroga. (sinusni izrek + ploščina kroga)« -/
theorem naloga1 (t : Affine.Triangle ℝ R2) (ha : dist (t.points 0) (t.points 2) = 6)
    (hα : ∠ (t.points 0) (t.points 1) (t.points 2) = 30 * π / 180) :
    (6 : ℝ) / (1 / 2) = 12 ∧ t.circumradius = 6 ∧ π * t.circumradius ^ 2 = 36 * π := by
  have h := t.dist_div_sin_angle_eq_two_mul_circumradius (i₁ := 0) (i₂ := 1) (i₃ := 2) (by decide)
    (by decide) (by decide)
  rw [ha, hα, show (30 : ℝ) * π / 180 = π / 6 by ring, sin_pi_div_six] at h
  have hR : t.circumradius = 6 := by linarith
  refine ⟨by norm_num, hR, by rw [hR]; ring⟩

/-- Predpostavke trditve `naloga1` se dajo izpolniti: trikotnik (0, 6), (6√3, 0), (0, 0) s pravim kotom pri
(0, 0) ima stranico 6 nasproti kota 30° pri (6√3, 0). -/
example : ∃ t : Affine.Triangle ℝ R2, dist (t.points 0) (t.points 2) = 6 ∧
    ∠ (t.points 0) (t.points 1) (t.points 2) = 30 * π / 180 := by
  have h3 : 0 < √3 := by positivity
  have hr : ∠ (P2 0 6) (P2 0 0) (P2 (6 * √3) 0) = π / 2 := by
    rw [EuclideanGeometry.angle, ← inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [vsub_eq_sub, P2_sub, inner_P2]
  have hne : P2 (6 * √3) 0 ≠ P2 0 0 := by
    intro h; have := congrFun (congrArg (⇑) h) 0; simp at this
  have d1 : dist (P2 0 6) (P2 0 0) = 6 := by
    rw [dist_eq_norm, P2_sub, norm_P2]; norm_num
  have d2 : dist (P2 (6 * √3) 0) (P2 0 0) = 6 * √3 := by
    rw [dist_eq_norm, P2_sub, norm_P2]; simp
  have hk : ∠ (P2 0 0) (P2 (6 * √3) 0) (P2 0 6) = π / 6 := by
    rw [angle_eq_arctan_of_angle_eq_pi_div_two hr hne, d1, d2,
      show (6 : ℝ) / (6 * √3) = (√3)⁻¹ by field_simp, arctan_inv_sqrt_three]
  have hk' : ∠ (P2 0 6) (P2 (6 * √3) 0) (P2 0 0) = π / 6 := by rw [EuclideanGeometry.angle_comm]; exact hk
  have hind : AffineIndependent ℝ ![P2 0 6, P2 (6 * √3) 0, P2 0 0] := by
    rw [affineIndependent_iff_not_collinear_set, collinear_iff_eq_or_eq_or_angle_eq_zero_or_angle_eq_pi]
    push Not
    refine ⟨?_, ?_, ?_, ?_⟩
    · intro h; have := congrFun (congrArg (⇑) h) 1; simp at this
    · intro h; exact hne h.symm |>.elim
    · rw [hk']; positivity
    · rw [hk']; intro h; linarith [pi_pos]
  refine ⟨⟨_, hind⟩, ?_, ?_⟩
  · simp; rw [d1]
  · simp; rw [hk']; ring

/-- Predpostavke trditve `naloga1` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ t : Affine.Triangle ℝ R2, dist (t.points 0) (t.points 2) = 6 ∧ ∠ (t.points 0) (t.points 1) (t.points 2) = 30 * π / 180 := by
    have h3 : 0 < √3 := by positivity
    have hr : ∠ (P2 0 6) (P2 0 0) (P2 (6 * √3) 0) = π / 2 := by
      rw [EuclideanGeometry.angle, ← inner_eq_zero_iff_angle_eq_pi_div_two]
      simp [vsub_eq_sub, P2_sub, inner_P2]
    have hne : P2 (6 * √3) 0 ≠ P2 0 0 := by
      intro h; have := congrFun (congrArg (⇑) h) 0; simp at this
    have d1 : dist (P2 0 6) (P2 0 0) = 6 := by
      rw [dist_eq_norm, P2_sub, norm_P2]; norm_num
    have d2 : dist (P2 (6 * √3) 0) (P2 0 0) = 6 * √3 := by
      rw [dist_eq_norm, P2_sub, norm_P2]; simp
    have hk : ∠ (P2 0 0) (P2 (6 * √3) 0) (P2 0 6) = π / 6 := by
      rw [angle_eq_arctan_of_angle_eq_pi_div_two hr hne, d1, d2,
        show (6 : ℝ) / (6 * √3) = (√3)⁻¹ by field_simp, arctan_inv_sqrt_three]
    have hk' : ∠ (P2 0 6) (P2 (6 * √3) 0) (P2 0 0) = π / 6 := by rw [EuclideanGeometry.angle_comm]; exact hk
    have hind : AffineIndependent ℝ ![P2 0 6, P2 (6 * √3) 0, P2 0 0] := by
      rw [affineIndependent_iff_not_collinear_set, collinear_iff_eq_or_eq_or_angle_eq_zero_or_angle_eq_pi]
      push Not
      refine ⟨?_, ?_, ?_, ?_⟩
      · intro h; have := congrFun (congrArg (⇑) h) 1; simp at this
      · intro h; exact hne h.symm |>.elim
      · rw [hk']; positivity
      · rw [hk']; intro h; linarith [pi_pos]
    refine ⟨⟨_, hind⟩, ?_, ?_⟩
    · simp; rw [d1]
    · simp; rw [hk']; ring
  naloga1 (ha := w.choose_spec.1) (hα := w.choose_spec.2)

/-- Naloga 2 a), RAČUN: p(x) = 2x³ − x² − 2x + 1 = x²(2x − 1) − (2x − 1) = (2x − 1)(x² − 1)
= (2x − 1)(x − 1)(x + 1); ničle so natanko −1, 1/2, 1.
trditev: MAT-SS-3/mesane-naloge-3-letnika#naloga2a
besedilo: »$p(x) = 2x^3 - x^2 - 2x + 1$« -/
theorem naloga2a (x : ℝ) :
    2 * x ^ 3 - x ^ 2 - 2 * x + 1 = x ^ 2 * (2 * x - 1) - (2 * x - 1) ∧
    x ^ 2 * (2 * x - 1) - (2 * x - 1) = (2 * x - 1) * (x ^ 2 - 1) ∧
    (2 * x - 1) * (x ^ 2 - 1) = (2 * x - 1) * (x - 1) * (x + 1) ∧
    (2 * x ^ 3 - x ^ 2 - 2 * x + 1 = 0 ↔ x = -1 ∨ x = 1 / 2 ∨ x = 1) := by
  refine ⟨by ring, by ring, by ring, ?_⟩
  rw [show 2 * x ^ 3 - x ^ 2 - 2 * x + 1 = (2 * x - 1) * (x - 1) * (x + 1) by ring]
  constructor
  · intro h
    rcases mul_eq_zero.1 h with h1 | h1
    · rcases mul_eq_zero.1 h1 with h2 | h2
      · right; left; linarith
      · right; right; linarith
    · left; linarith
  · rintro (rfl | rfl | rfl) <;> norm_num

/-- Naloga 2 b), RAČUN: p(x) < 0 ⇔ x ∈ (−∞, −1) ∪ (1/2, 1); predznaki: pozitiven nad 1, negativen na
(1/2, 1), pozitiven na (−1, 1/2), negativen pod −1.
trditev: MAT-SS-3/mesane-naloge-3-letnika#naloga2b
besedilo: »b) Vodilni koeficient je pozitiven, zato je $p$ za velike $x$ pozitiven in pri vsaki enostavni ničli spremeni predznak. Od desne: pozitiven nad $1$, negativen na $\left(\frac{1}{2}, 1\right)$, pozitiven na $\left(-1, \frac{1}{2}\right)$, negativen pod $-1$.« -/
theorem naloga2b (x : ℝ) : 2 * x ^ 3 - x ^ 2 - 2 * x + 1 < 0 ↔ x < -1 ∨ (1 / 2 < x ∧ x < 1) := by
  rw [show 2 * x ^ 3 - x ^ 2 - 2 * x + 1 = (2 * x - 1) * (x - 1) * (x + 1) by ring]
  constructor
  · intro h
    by_contra hc; push Not at hc
    obtain ⟨h1, h2⟩ := hc
    rcases le_or_gt x (1 / 2) with hx | hx
    · nlinarith [mul_nonneg (mul_nonneg (by linarith : (0:ℝ) ≤ 1 - 2 * x) (by linarith : (0:ℝ) ≤ 1 - x))
        (by linarith : (0:ℝ) ≤ x + 1)]
    · have := h2 hx
      nlinarith [mul_nonneg (mul_nonneg (by linarith : (0:ℝ) ≤ 2 * x - 1) (by linarith : (0:ℝ) ≤ x - 1))
        (by linarith : (0:ℝ) ≤ x + 1)]
  · rintro (h | ⟨h1, h2⟩)
    · nlinarith [mul_pos (mul_pos (by linarith : (0:ℝ) < 1 - 2 * x) (by linarith : (0:ℝ) < 1 - x))
        (by linarith : (0:ℝ) < -(x + 1))]
    · nlinarith [mul_pos (mul_pos (by linarith : (0:ℝ) < 2 * x - 1) (by linarith : (0:ℝ) < 1 - x))
        (by linarith : (0:ℝ) < x + 1)]

/-- Na [0, 2π) velja cos x = cos y (y ∈ [0, π]) natanko za x = y ali x = 2π − y.
trditev: MAT-SS-3/mesane-naloge-3-letnika#cos-eq-na-intervalu
besedilo: »c) Na $[0, 2\pi)$: $\cos x = 1$ da $x = 0$; $\cos x = -1$ da $x = \pi$; $\cos x = \frac{1}{2}$ da $x = \frac{\pi}{3}$ in $x = \frac{5\pi}{3}$.« -/
theorem cos_eq_na_intervalu {x y : ℝ} (hx0 : 0 ≤ x) (hx : x < 2 * π) (hy0 : 0 ≤ y) (hy : y ≤ π) :
    cos x = cos y ↔ x = y ∨ x = 2 * π - y := by
  have hp := pi_pos
  constructor
  · intro h
    obtain ⟨k, hk | hk⟩ := Real.cos_eq_cos_iff.1 h
    · -- y = 2kπ + x
      have k1 : (k : ℝ) * (2 * π) ≤ π := by nlinarith
      have k2 : -(2 * π) < (k : ℝ) * (2 * π) := by nlinarith
      have k3 : (k : ℝ) < 1 := by nlinarith
      have k4 : (-1 : ℝ) < k := by nlinarith
      have : k = 0 := by
        have := Int.cast_lt.1 (show (k : ℝ) < ((1 : ℤ) : ℝ) by simpa using k3)
        have := Int.cast_lt.1 (show ((-1 : ℤ) : ℝ) < k by simpa using k4)
        omega
      subst this; left; simp at hk; linarith
    · -- y = 2kπ − x
      have k3 : (k : ℝ) < 3 / 2 := by nlinarith
      have k4 : (0 : ℝ) < k + 1 / 2 := by nlinarith
      have : k = 0 ∨ k = 1 := by
        have h1 : k < 2 := Int.cast_lt.1 (show (k : ℝ) < ((2 : ℤ) : ℝ) by push_cast; linarith)
        have h2 : -1 < k := Int.cast_lt.1 (show ((-1 : ℤ) : ℝ) < k by push_cast; linarith)
        omega
      rcases this with rfl | rfl
      · left; simp at hk; linarith
      · right; simp at hk; linarith
  · rintro (rfl | rfl)
    · rfl
    · rw [show 2 * π - y = -y + 2 * π by ring, cos_add_two_pi, cos_neg]

/-- Naloga 2 c), RAČUN: p(cos x) = 0 na [0, 2π) ⇔ cos x ∈ {−1, 1/2, 1} ⇔ x ∈ {0, π/3, π, 5π/3}.
trditev: MAT-SS-3/mesane-naloge-3-letnika#naloga2c
besedilo: »c) Na $[0, 2\pi)$: $\cos x = 1$ da $x = 0$; $\cos x = -1$ da $x = \pi$; $\cos x = \frac{1}{2}$ da $x = \frac{\pi}{3}$ in $x = \frac{5\pi}{3}$.« -/
theorem naloga2c (x : ℝ) (hx0 : 0 ≤ x) (hx : x < 2 * π) :
    (2 * cos x ^ 3 - cos x ^ 2 - 2 * cos x + 1 = 0 ↔ cos x = -1 ∨ cos x = 1 / 2 ∨ cos x = 1) ∧
    (2 * cos x ^ 3 - cos x ^ 2 - 2 * cos x + 1 = 0 ↔ x = 0 ∨ x = π / 3 ∨ x = π ∨ x = 5 * π / 3) := by
  have hp := pi_pos
  have e1 : cos x = 1 ↔ x = 0 := by
    rw [← cos_zero, cos_eq_na_intervalu hx0 hx le_rfl hp.le]
    constructor
    · rintro (h | h)
      · exact h
      · linarith
    · intro h; left; exact h
  have e2 : cos x = -1 ↔ x = π := by
    rw [← cos_pi, cos_eq_na_intervalu hx0 hx hp.le le_rfl]
    constructor
    · rintro (h | h) <;> linarith
    · intro h; left; exact h
  have e3 : cos x = 1 / 2 ↔ x = π / 3 ∨ x = 5 * π / 3 := by
    rw [← cos_pi_div_three, cos_eq_na_intervalu hx0 hx (by positivity) (by linarith)]
    constructor
    · rintro (h | h)
      · left; exact h
      · right; linarith
    · rintro (h | h)
      · left; exact h
      · right; linarith
  refine ⟨(naloga2a (cos x)).2.2.2, ?_⟩
  rw [(naloga2a (cos x)).2.2.2, e1, e2, e3]
  tauto

/-- Predpostavke trditve `naloga2c` se dajo izpolniti (x = 0). -/
example : (0:ℝ) ≤ 0 ∧ (0:ℝ) < 2 * π := ⟨le_rfl, by positivity⟩

/-- Predpostavke trditve `naloga2c` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 0 ∧ (0:ℝ) < 2 * π := ⟨le_rfl, by positivity⟩
  naloga2c (hx0 := w.1) (hx := w.2)

/-- Predpostavke trditve `cos_eq_na_intervalu` se dajo izpolniti (x = y = 0). -/
example : (0:ℝ) ≤ 0 ∧ (0:ℝ) < 2 * π ∧ (0:ℝ) ≤ π := ⟨le_rfl, by positivity, pi_pos.le⟩

/-- Predpostavke trditve `cos_eq_na_intervalu` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 0 ∧ (0:ℝ) < 2 * π ∧ (0:ℝ) ≤ π := ⟨le_rfl, by positivity, pi_pos.le⟩
  cos_eq_na_intervalu (hx0 := w.1) (hx := w.2.1) (hy0 := w.2.2) (hy := w.2.2)

/-- Naloga 3 (a = 6, s = 8): polovica diagonale 6√2/2 = 3√2 ≈ 4,24; v = √(64 − 18) = √46 ≈ 6,78;
V = 36√46/3 = 12√46 ≈ 81,39. (Kot φ = arccos(3√2/8) je v `naloga3b`.)
trditev: MAT-SS-3/mesane-naloge-3-letnika#naloga3
besedilo: »$V = \frac{a^2 v}{3} = \frac{36\sqrt{46}}{3} = 12\sqrt{46} \approx 81{,}39\,\mathrm{cm^3}$« -/
theorem naloga3 :
    6 * √2 / 2 = 3 * √2 ∧ |3 * √2 - 4.24| < 0.005 ∧ (8 : ℝ) ^ 2 - (3 * √2) ^ 2 = 64 - 18 ∧
    (64 : ℝ) - 18 = 46 ∧ |√46 - 6.78| < 0.005 ∧ (6 : ℝ) ^ 2 * √46 / 3 = 36 * √46 / 3 ∧
    36 * √46 / 3 = 12 * √46 ∧ |12 * √46 - 81.39| < 0.005 := by
  obtain ⟨s1, s2⟩ := sqrt2_meje
  have h2 : √2 ^ 2 = 2 := Real.sq_sqrt (by norm_num)
  have a1 : (6.78232 : ℝ) < √46 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have a2 : √46 < (6.78233 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by ring, by rw [abs_lt]; constructor <;> linarith, by rw [mul_pow, h2]; norm_num, by norm_num,
    by rw [abs_lt]; constructor <;> linarith, by norm_num, by ring, by rw [abs_lt]; constructor <;> linarith⟩

/-- Naloga 3 b), RAČUN: φ = arccos(3√2/8) ≈ 57,97° (= 90° − arcsin(3√2/8)).
trditev: MAT-SS-3/mesane-naloge-3-letnika#naloga3b
besedilo: »b) Kot $\varphi$ med robom in osnovno ploskvijo je kot med robom in njegovo projekcijo: $\cos\varphi = \frac{3\sqrt{2}}{8}$, zato $\varphi \approx 57{,}97^\circ$.« -/
theorem naloga3b : |arccos (3 * √2 / 8) * 180 / π - 57.97| < 0.005 := by
  obtain ⟨s1, s2⟩ := sqrt2_meje
  have h := arcsin_stopinje (y := 3 * √2 / 8) (D := 32.03) (e := 0.005) (y₁ := 3 * 1.41421356 / 8)
    (y₂ := 3 * 1.41421357 / 8) ((32.03 - 0.005) * 3.141593 / 180) ((32.03 + 0.005) * 3.141592 / 180)
    (by norm_num) le_rfl le_rfl (by norm_num) (by norm_num) (by norm_num) (by linarith) (by linarith)
    (by linarith) (by norm_num [sZg]) (by norm_num [sSp])
  have hpi : arccos (3 * √2 / 8) * 180 / π = 90 - arcsin (3 * √2 / 8) * 180 / π := by
    rw [arccos_eq_pi_div_two_sub_arcsin]; field_simp; ring
  rw [hpi]
  rw [abs_lt] at h ⊢; constructor <;> linarith [h.1, h.2]

/-- Naloga 4 a), b): x² + y² − 6x − 4y + 8 = 0 ⇔ (x − 3)² + (y − 2)² = 9 + 4 − 8 = 5 (S(3, 2), r = √5);
z y = x: 2x² − 10x + 8 = 0 ⇔ x² − 5x + 4 = 0 ⇔ x = 1 ∨ x = 4, presečišči A(1, 1), B(4, 4).
trditev: MAT-SS-3/mesane-naloge-3-letnika#naloga4ab
besedilo: »b) Vstavimo $y = x$: $2x^2 - 10x + 8 = 0$ oziroma $x^2 - 5x + 4 = 0$, torej $x = 1$ ali $x = 4$. Presečišči sta $A(1, 1)$ in $B(4, 4)$.« -/
theorem naloga4ab (x y : ℝ) :
    (x ^ 2 + y ^ 2 - 6 * x - 4 * y + 8 = 0 ↔ (x - 3) ^ 2 + (y - 2) ^ 2 = 5) ∧ (9 : ℝ) + 4 - 8 = 5 ∧
    (x ^ 2 + x ^ 2 - 6 * x - 4 * x + 8 = 0 ↔ 2 * x ^ 2 - 10 * x + 8 = 0) ∧
    (2 * x ^ 2 - 10 * x + 8 = 0 ↔ x ^ 2 - 5 * x + 4 = 0) ∧ (x ^ 2 - 5 * x + 4 = 0 ↔ x = 1 ∨ x = 4) ∧
    ((x ^ 2 + y ^ 2 - 6 * x - 4 * y + 8 = 0 ∧ y = x) ↔ (x = 1 ∧ y = 1) ∨ (x = 4 ∧ y = 4)) := by
  have hq : x ^ 2 - 5 * x + 4 = 0 ↔ x = 1 ∨ x = 4 := by
    rw [show x ^ 2 - 5 * x + 4 = (x - 1) * (x - 4) by ring, mul_eq_zero, sub_eq_zero, sub_eq_zero]
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, ⟨fun h => by linarith, fun h => by linarith⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩, hq, ?_⟩
  constructor
  · rintro ⟨h, rfl⟩
    rcases hq.1 (by linarith) with rfl | rfl
    · left; exact ⟨rfl, rfl⟩
    · right; exact ⟨rfl, rfl⟩
  · rintro (⟨rfl, rfl⟩ | ⟨rfl, rfl⟩) <;> norm_num

/-- Naloga 4 c), RAČUN: SA = (−2, −1), SB = (1, 2), ⟪SA, SB⟫ = −2 − 2 = −4, |SA| = |SB| = √5,
cos ∠ASB = −4/(√5·√5) = −4/5; kot je top (> 90°).
trditev: MAT-SS-3/mesane-naloge-3-letnika#naloga4c
besedilo: »c) $\cos\angle ASB = \frac{-4}{\sqrt{5} \cdot \sqrt{5}} = -\frac{4}{5}$; kot je top.« -/
theorem naloga4c :
    P2 1 1 - P2 3 2 = P2 (-2) (-1) ∧ P2 4 4 - P2 3 2 = P2 1 2 ∧ inner ℝ (P2 (-2) (-1)) (P2 1 2) = -2 - 2 ∧
    (-2 : ℝ) - 2 = -4 ∧ ‖P2 (-2) (-1)‖ = √5 ∧ ‖P2 1 2‖ = √5 ∧
    cos (InnerProductGeometry.angle (P2 (-2) (-1)) (P2 1 2)) = -4 / (√5 * √5) ∧ -4 / (√5 * √5) = (-4 : ℝ) / 5 ∧
    π / 2 < InnerProductGeometry.angle (P2 (-2) (-1)) (P2 1 2) ∧ ((-2) * 1 + (-1) * 2) / 5 = (-4 : ℝ) / 5 := by
  have n1 : ‖P2 (-2) (-1)‖ = √5 := by rw [norm_P2]; norm_num
  have n2 : ‖P2 1 2‖ = √5 := by rw [norm_P2]; norm_num
  have i1 : inner ℝ (P2 (-2) (-1)) (P2 1 2) = -2 - 2 := by rw [inner_P2]; norm_num
  have h5 : √5 * √5 = 5 := Real.mul_self_sqrt (by norm_num)
  refine ⟨by rw [P2_sub]; norm_num, by rw [P2_sub]; norm_num, i1, by norm_num, n1, n2,
    by rw [cos_angle, i1, n1, n2]; norm_num, by rw [h5], ?_, by norm_num⟩
  rw [← inner_neg_iff_pi_div_two_lt_angle, i1]; norm_num

/-- Naloga 4 d): tangenta v A je pravokotna na SA = (−2, −1): −2(x − 1) − (y − 1) = 0 ⇔ y = −2x + 3; premica
ima s krožnico le točko A (dotik).
trditev: MAT-SS-3/mesane-naloge-3-letnika#naloga4d
besedilo: »d) Tangenta v $A$ je pravokotna na polmer $\vec{SA} = (-2, -1)$, ki je njen normalni vektor: $-2(x - 1) - (y - 1) = 0$, torej $y = -2x + 3$.« -/
theorem naloga4d (x y : ℝ) :
    (-2 * (x - 1) - (y - 1) = 0 ↔ y = -2 * x + 3) ∧
    ((x ^ 2 + y ^ 2 - 6 * x - 4 * y + 8 = 0 ∧ y = -2 * x + 3) ↔ x = 1 ∧ y = 1) := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ?_⟩
  constructor
  · rintro ⟨h, rfl⟩
    have : (x - 1) ^ 2 = 0 := by nlinarith
    have hx : x = 1 := by nlinarith [sq_nonneg (x - 1), pow_eq_zero_iff (n := 2) (a := x - 1) two_ne_zero |>.1 this]
    exact ⟨hx, by rw [hx]; norm_num⟩
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Naloga 4 e), RAČUN: sin ∠ASB = √(1 − 16/25) = 3/5 (kot je med 0° in 180°, sinus je pozitiven),
S = ½·√5·√5·3/5 = ½·5·3/5 = 3/2 (preizkus z determinanto: |(−2)·2 − (−1)·1|/2 = 3/2).
trditev: MAT-SS-3/mesane-naloge-3-letnika#naloga4e
besedilo: »e) Kot trikotnika leži med $0^\circ$ in $180^\circ$, zato je njegov sinus pozitiven: $\sin\angle ASB = \sqrt{1 - \frac{16}{25}} = \frac{3}{5}$.« -/
theorem naloga4e :
    sin (InnerProductGeometry.angle (P2 (-2) (-1)) (P2 1 2)) = √(1 - 16 / 25) ∧ √(1 - 16 / 25 : ℝ) = 3 / 5 ∧
    1 / 2 * √5 * √5 * (3 / 5) = (3 : ℝ) / 2 ∧ 1 / 2 * 5 * (3 / 5) = (3 : ℝ) / 2 ∧
    |(-2) * 2 - (-1) * 1| / 2 = (3 : ℝ) / 2 := by
  have hc := (naloga4c).2.2.2.2.2.2.1
  have h5 : √5 * √5 = 5 := Real.mul_self_sqrt (by norm_num)
  refine ⟨?_, ?_, by nlinarith, by norm_num, by norm_num [abs_of_neg]⟩
  · rw [InnerProductGeometry.angle, sin_arccos, ← cos_angle, hc, h5]; norm_num
  · rw [show (1 - 16 / 25 : ℝ) = (3 / 5) ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-! ## Preveri se -/

/-- Preveri se (1): p(x) = 0,5(x + 2)(x − 1)(x − 3) ima ničle −2, 1, 3 in p(0) = 3; (x + 2)(x − 1)(x − 3) ima
pri 0 vrednost 6; 0,5(x − 2)(x + 1)(x + 3) pri −2 ni 0.
trditev: MAT-SS-3/mesane-naloge-3-letnika#graf
besedilo: »Ničle $-2$, $1$, $3$ dajo faktorje $(x + 2)(x - 1)(x - 3)$, ki imajo pri $x = 0$ vrednost $6$. Z grafa je $p(0) = 3$, zato je vodilni koeficient $0{,}5$.« -/
theorem graf :
    (0.5 : ℝ) * (-2 + 2) * (-2 - 1) * (-2 - 3) = 0 ∧ (0.5 : ℝ) * (1 + 2) * (1 - 1) * (1 - 3) = 0 ∧
    (0.5 : ℝ) * (3 + 2) * (3 - 1) * (3 - 3) = 0 ∧ (0.5 : ℝ) * (0 + 2) * (0 - 1) * (0 - 3) = 3 ∧
    ((0 : ℝ) + 2) * (0 - 1) * (0 - 3) = 6 ∧ (0.5 : ℝ) * (-2 - 2) * (-2 + 1) * (-2 + 3) ≠ 0 := by norm_num

/-- Preveri se (2), RAČUN: do treh četrtin višine je (3/4)³ = 27/64 ≈ 0,42, torej ≈ 42,2 % (42,19);
napačna: 75 % in (3/4)² = 56,25 % ≈ 56 %.
trditev: MAT-SS-3/mesane-naloge-3-letnika#tri-cetrtine
besedilo: »$\left(\frac{3}{4}\right)^3 = \frac{27}{64} \approx 0{,}42$« -/
theorem tri_cetrtine :
    ((3 : ℝ) / 4) ^ 3 = 27 / 64 ∧ |(27 : ℝ) / 64 - 0.42| < 0.005 ∧ |((3 : ℝ) / 4) ^ 3 * 100 - 42.2| < 0.05 ∧
    |((3 : ℝ) / 4) ^ 3 * 100 - 42.19| < 0.005 ∧ ((3 : ℝ) / 4) ^ 2 * 100 = 56.25 := by
  norm_num [abs_lt]

/-- Preveri se (3): vse tri ničle pekača 10 − 5√3, 10, 10 + 5√3 so pozitivne.
trditev: MAT-SS-3/mesane-naloge-3-letnika#tri-pozitivne
besedilo: »$x = \frac{20 \pm \sqrt{400 - 100}}{2} = 10 \pm 5\sqrt{3}$« -/
theorem tri_pozitivne : 0 < 10 - 5 * √3 ∧ (0 : ℝ) < 10 ∧ 0 < 10 + 5 * √3 := by
  obtain ⟨t1, t2⟩ := sqrt3_meje
  exact ⟨by linarith, by norm_num, by positivity⟩

/-- Preveri se (4), RAČUN: 2x² + 2nx + n² − 2 = 0 ima D = 4n² − 8(n² − 2) = 16 − 4n²; D = 0 ⇔ n² = 4; pozitivni
n = 2; pri n = 2: 2x² + 4x + 2 = 0 ⇔ x = −1; napačna 1,41 (√2) in 4 (= n²).
trditev: MAT-SS-3/mesane-naloge-3-letnika#tangenta-n
besedilo: »Vstavimo: $2x^2 + 2nx + n^2 - 2 = 0$. Diskriminanta $4n^2 - 8(n^2 - 2) = 16 - 4n^2 = 0$, zato $n^2 = 4$ in $n = 2$.« -/
theorem tangenta_n (n x : ℝ) :
    discrim 2 (2 * n) (n ^ 2 - 2) = 16 - 4 * n ^ 2 ∧ (16 - 4 * n ^ 2 = 0 ↔ n ^ 2 = 4) ∧
    ((n ^ 2 = 4 ∧ 0 < n) ↔ n = 2) ∧ (2 * x ^ 2 + 2 * 2 * x + 2 ^ 2 - 2 = 0 ↔ x = -1) ∧
    |√2 - 1.41| < 0.005 := by
  obtain ⟨s1, s2⟩ := sqrt2_meje
  refine ⟨by unfold discrim; ring, ⟨fun h => by linarith, fun h => by linarith⟩, ?_, ?_,
    by rw [abs_lt]; constructor <;> linarith⟩
  · constructor
    · rintro ⟨h, h0⟩; nlinarith
    · rintro rfl; norm_num
  · constructor
    · intro h; nlinarith [sq_nonneg (x + 1)]
    · rintro rfl; norm_num

/-- Preveri se (5), Pogoste napake (2), RAČUN: cos φ = ⟪(1,1,1), (1,0,0)⟫/(√3·1) = 1/√3, φ = arccos(1/√3)
≈ 54,74° ≈ 0,96 rad; φ in 35,26° (arcsin(1/√3)) se dopolnjujeta do 90°; 45° je kot ploskovne diagonale
(arccos(1/√2) = 45°). Kot med (1,1,1) in (1,0,0) v ℝ³ je res arccos(1/√3).
trditev: MAT-SS-3/mesane-naloge-3-letnika#kot-diagonale
besedilo: »$\cos\varphi = \frac{(1, 1, 1) \cdot (1, 0, 0)}{\sqrt{3} \cdot 1} = \frac{1}{\sqrt{3}}$, zato $\varphi \approx 54{,}74^\circ$. Kota $54{,}74^\circ$ in $35{,}26^\circ$ se dopolnjujeta do $90^\circ$.« -/
theorem kot_diagonale :
    InnerProductGeometry.angle (!₂[1, 1, 1] : EuclideanSpace ℝ (Fin 3)) !₂[1, 0, 0] = arccos (1 / √3) ∧
    (1 * 1 + 1 * 0 + 1 * 0 : ℝ) / (√3 * 1) = 1 / √3 ∧ |arccos (1 / √3) * 180 / π - 54.74| < 0.005 ∧
    |arccos (1 / √3) - 0.96| < 0.005 ∧ arccos (1 / √3) + arcsin (1 / √3) = π / 2 ∧
    arccos (1 / √2) * 180 / π = 45 := by
  obtain ⟨t1, t2⟩ := sqrt3_meje
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  have h := arcsin_stopinje (y := 1 / √3) (D := 35.26) (e := 0.005) (y₁ := 1 / 1.73205081)
    (y₂ := 1 / 1.73205080) ((35.26 - 0.005) * 3.141593 / 180) ((35.26 + 0.005) * 3.141592 / 180)
    (by norm_num) le_rfl le_rfl (by norm_num) (by norm_num) (by norm_num)
    (one_div_le_one_div_of_le (by positivity) t2.le) (one_div_le_one_div_of_le (by norm_num) t1.le)
    (by rw [div_le_one (by positivity)]; linarith) (by norm_num [sZg]) (by norm_num [sSp])
  have hac : arccos (1 / √3) = π / 2 - arcsin (1 / √3) := arccos_eq_pi_div_two_sub_arcsin _
  have hpi : arccos (1 / √3) * 180 / π = 90 - arcsin (1 / √3) * 180 / π := by
    rw [hac]; field_simp; ring
  have hang : InnerProductGeometry.angle (!₂[1, 1, 1] : EuclideanSpace ℝ (Fin 3)) !₂[1, 0, 0] =
      arccos (1 / √3) := by
    unfold InnerProductGeometry.angle
    congr 1
    rw [EuclideanSpace.norm_eq, EuclideanSpace.norm_eq]
    simp [EuclideanSpace.inner_eq_star_dotProduct, Fin.sum_univ_three, dotProduct]
    norm_num
  refine ⟨hang, by ring, ?_, ?_, by rw [hac]; ring, ?_⟩
  · rw [hpi]; rw [abs_lt] at h ⊢; constructor <;> linarith [h.1, h.2]
  · -- arcsin v radianih iz stopinj
    have hp : 0 < π := pi_pos
    rw [abs_lt] at h
    have a1 : (35.255 : ℝ) * π / 180 < arcsin (1 / √3) := by
      have := h.1; rw [lt_sub_iff_add_lt] at this
      have := (lt_div_iff₀ hp).1 (by linarith : (35.255 : ℝ) < arcsin (1 / √3) * 180 / π)
      nlinarith
    have a2 : arcsin (1 / √3) < (35.265 : ℝ) * π / 180 := by
      have := (div_lt_iff₀ hp).1 (by linarith [h.2] : arcsin (1 / √3) * 180 / π < 35.265)
      nlinarith
    rw [hac, abs_lt]; constructor <;> nlinarith
  · rw [one_div, ← Real.sqrt_inv, show (2 : ℝ)⁻¹ = (√2 / 2) ^ 2 by
      rw [div_pow, Real.sq_sqrt (by norm_num)]; norm_num, Real.sqrt_sq (by positivity),
      ← cos_pi_div_four, arccos_cos (by linarith) (by linarith)]
    field_simp; ring

/-- RAČUN: 6/(2 sin(30π/180)) = 6; π·1000/27 ≈ 116,4; ½·5·3/5 = 3/2.
trditev: MAT-SS-3/mesane-naloge-3-letnika#racun
besedilo: »prostornina $\frac{1000\pi}{27} \approx 116{,}4\,\mathrm{cm^3}$.« -/
theorem racun : 6 / (2 * sin (30 * π / 180)) = 6 ∧ |π * 1000 / 27 - 116.4| < 0.05 ∧ 1 / 2 * 5 * (3 / 5) = (3 : ℝ) / 2 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  refine ⟨?_, by rw [abs_lt]; constructor <;> linarith, by norm_num⟩
  rw [show (30 : ℝ) * π / 180 = π / 6 by ring, sin_pi_div_six]; norm_num

end Evklid.Lekcije.MAT_SS_3.MesaneNaloge3Letnika
