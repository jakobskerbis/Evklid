/-
vir: content/lessons/MAT-SS-2/logaritem.md
sha256: 322da4188bd59b17f2f77f2b791a43464c110f282882ea91f65699ac1c0ab02f
Ni v Leanu: uvodna zgodba (alge; dokazano je, da 2ˣ = 5 ima rešitev med 2 in 3); »izrazi log₂ 0, log₂(−4),
log₁ 5 niso definirani« in »log₂ 0 = 0 ni res«: v Leanu so ti izrazi po dogovoru definirani
(`Real.log 0 = 0`, `Real.log (−x) = Real.log x`, logb 1 x = log x / 0 = 0), zato je dokazano le, da
noben eksponent ne da 0, negativnega števila ali 5 pri osnovi 1; navodila za računalo (tipke »log«,
»ln«); risbe in simulacija (dokazane so oznake na skali in točke); besedne razlage (»operacija se
spusti za stopnjo nižje«, »logaritmi stisnejo lestvico«); pH in decibeli kot naravoslovna dejstva
(dokazani so le računi); razlaga 9: obrat »zveza je logaritemska, kadar se ob vsakem množenju x z
istim faktorjem y spremeni za isti korak« (zahtevno, še ni dokazano; dokazana je smer, da ima model
y = A + B log x to lastnost); točkovanje; podatki v Primeru 6 so izmišljeni (dokazan je model).
Dogovori Leana: ln je `Real.log`, logₐ je `Real.logb a` (= log x / log a), desetiški log je
`Real.logb 10`, e je `Real.exp 1`. Numerične vrednosti logaritmov so izpeljane iz `Real.log_two_gt_d9`,
`Real.log_two_lt_d9` in vrste za log(1 − x) (`Real.abs_log_sub_add_sum_range_le`). »≈ v« pomeni
interval pol enote zadnjega mesta okoli v (dokazani sta obe meji).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.Logaritem

open Finset

/-! ## Pomožne trditve: numerične meje -/

/-- Pomožno: meje za log(1 − x) iz vrste −∑ xᵏ/k (|x| < 1, n členov).
pomozno -/
theorem log_vrsta (x : ℝ) (hx : |x| < 1) (n : ℕ) :
    -(∑ i ∈ range n, x ^ (i + 1) / (i + 1)) - |x| ^ (n + 1) / (1 - |x|) ≤ Real.log (1 - x) ∧
    Real.log (1 - x) ≤ -(∑ i ∈ range n, x ^ (i + 1) / (i + 1)) + |x| ^ (n + 1) / (1 - |x|) := by
  have h := Real.abs_log_sub_add_sum_range_le hx n
  rw [abs_le] at h
  constructor <;> linarith [h.1, h.2]

/-- Predpostavke trditve `log_vrsta` se dajo izpolniti (x = 1/4). -/
example : |(1 / 4 : ℝ)| < 1 := by norm_num [abs_of_pos]

/-- Pomožno: 0,6931471803 < ln 2 < 0,6931471808 (Mathlib).
pomozno -/
theorem ln2 : 0.6931471803 < Real.log 2 ∧ Real.log 2 < 0.6931471808 :=
  ⟨Real.log_two_gt_d9, Real.log_two_lt_d9⟩

/-- Pomožno: 1,098612 < ln 3 < 1,098613 (ln 3 = 2 ln 2 + ln(1 − 1/4)).
pomozno -/
theorem ln3 : 1.098612 < Real.log 3 ∧ Real.log 3 < 1.098613 := by
  have h := log_vrsta (1 / 4) (by norm_num [abs_of_pos]) 14
  norm_num [Finset.sum_range_succ, abs_of_pos] at h
  have e : Real.log 3 = 2 * Real.log 2 + Real.log (3 / 4) := by
    rw [Real.log_div (by norm_num) (by norm_num), show (4 : ℝ) = 2 ^ 2 by norm_num, Real.log_pow]
    push_cast; ring
  obtain ⟨l1, l2⟩ := ln2
  constructor <;> linarith [h.1, h.2]

/-- Pomožno: 1,609437 < ln 5 < 1,609438 (ln 5 = 2 ln 2 − ln(1 − 1/5)).
pomozno -/
theorem ln5 : 1.609437 < Real.log 5 ∧ Real.log 5 < 1.609438 := by
  have h := log_vrsta (1 / 5) (by norm_num [abs_of_pos]) 12
  norm_num [Finset.sum_range_succ, abs_of_pos] at h
  have e : Real.log 5 = 2 * Real.log 2 - Real.log (4 / 5) := by
    rw [Real.log_div (by norm_num) (by norm_num), show (4 : ℝ) = 2 ^ 2 by norm_num, Real.log_pow]
    push_cast; ring
  obtain ⟨l1, l2⟩ := ln2
  constructor <;> linarith [h.1, h.2]

/-- Pomožno: 1,945910 < ln 7 < 1,945911 (ln 7 = 3 ln 2 + ln(1 − 1/8)).
pomozno -/
theorem ln7 : 1.945910 < Real.log 7 ∧ Real.log 7 < 1.945911 := by
  have h := log_vrsta (1 / 8) (by norm_num [abs_of_pos]) 10
  norm_num [Finset.sum_range_succ, abs_of_pos] at h
  have e : Real.log 7 = 3 * Real.log 2 + Real.log (7 / 8) := by
    rw [Real.log_div (by norm_num) (by norm_num), show (8 : ℝ) = 2 ^ 3 by norm_num, Real.log_pow]
    push_cast; ring
  obtain ⟨l1, l2⟩ := ln2
  constructor <;> linarith [h.1, h.2]

/-- Pomožno: ln 10 = ln 2 + ln 5 in 2,3025841 < ln 10 < 2,3025852.
pomozno -/
theorem ln10 : Real.log 10 = Real.log 2 + Real.log 5 ∧
    2.3025841 < Real.log 10 ∧ Real.log 10 < 2.3025852 := by
  have e : Real.log 10 = Real.log 2 + Real.log 5 := by
    rw [← Real.log_mul (by norm_num) (by norm_num)]; norm_num
  obtain ⟨l1, l2⟩ := ln2
  obtain ⟨l3, l4⟩ := ln5
  exact ⟨e, by linarith, by linarith⟩

/-- Pomožno: meje kvocienta: iz a₁ < a < a₂, b₁ < b < b₂ (a₁ ≥ 0, b₁ > 0) sledi a₁/b₂ < a/b < a₂/b₁.
pomozno -/
theorem kvocient {a b a₁ a₂ b₁ b₂ : ℝ} (ha₁ : 0 ≤ a₁) (hb₁ : 0 < b₁) (h1 : a₁ < a) (h2 : a < a₂)
    (h3 : b₁ < b) (h4 : b < b₂) : a₁ / b₂ < a / b ∧ a / b < a₂ / b₁ := by
  have hb : 0 < b := by linarith
  have hb2 : 0 < b₂ := by linarith
  constructor
  · rw [div_lt_div_iff₀ hb2 hb]; nlinarith
  · rw [div_lt_div_iff₀ hb hb₁]; nlinarith

/-- Predpostavke trditve `kvocient` se dajo izpolniti (a = 1, b = 2, meje 0, 2, 1, 3). -/
example : (0 : ℝ) ≤ 0 ∧ (0 : ℝ) < 1 ∧ (0 : ℝ) < 1 ∧ (1 : ℝ) < 2 ∧ (1 : ℝ) < 2 ∧ (2 : ℝ) < 3 := by
  norm_num

/-- Pomožno: 0,30102996 < log 2 < 0,30103015 (desetiški).
pomozno -/
theorem lg2 : 0.30102996 < Real.logb 10 2 ∧ Real.logb 10 2 < 0.30103015 := by
  obtain ⟨a1, a2⟩ := ln2
  obtain ⟨_, b1, b2⟩ := ln10
  have q := kvocient (by norm_num) (by norm_num) a1 a2 b1 b2
  rw [Real.logb]
  constructor <;> linarith [q.1, q.2]

/-- Pomožno: 0,4771205 < log 3 < 0,477122 (desetiški).
pomozno -/
theorem lg3 : 0.4771205 < Real.logb 10 3 ∧ Real.logb 10 3 < 0.477122 := by
  obtain ⟨a1, a2⟩ := ln3
  obtain ⟨_, b1, b2⟩ := ln10
  have q := kvocient (by norm_num) (by norm_num) a1 a2 b1 b2
  rw [Real.logb]
  constructor <;> linarith [q.1, q.2]

/-- Pomožno: logₐ potence a: logₐ(aˣ) = x (a > 0, a ≠ 1).
pomozno -/
theorem log_pot (a x : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) : Real.logb a (a ^ x) = x :=
  Real.logb_rpow ha ha1

/-- Predpostavke trditve `log_pot` se dajo izpolniti (a = 10). -/
example : (0 : ℝ) < 10 ∧ (10 : ℝ) ≠ 1 := by norm_num

/-- Pomožno (za približke potenc): če je e·q = p in aᵠ < yᵖ < bᵠ (y > 0, b ≥ 0), je a < y^e < b.
pomozno -/
theorem koren_med {y a b e : ℝ} {p : ℤ} {q : ℕ} (hy : 0 < y)
    (hb : 0 ≤ b) (he : e * q = p) (h1 : a ^ q < y ^ p) (h2 : y ^ p < b ^ q) :
    a < y ^ e ∧ y ^ e < b := by
  have hz0 : 0 ≤ y ^ e := Real.rpow_nonneg hy.le e
  have hz : (y ^ e) ^ q = y ^ p := by
    rw [← Real.rpow_natCast, ← Real.rpow_mul hy.le, he, Real.rpow_intCast]
  constructor
  · by_contra h
    have := pow_le_pow_left₀ hz0 (not_lt.mp h) q
    linarith
  · by_contra h
    have := pow_le_pow_left₀ hb (not_lt.mp h) q
    linarith

/-- Predpostavke trditve `koren_med` se dajo izpolniti (y = 4, e = 1/2, p = 1, q = 2, a = 1, b = 3). -/
example : (0 : ℝ) < 4 ∧ (0 : ℝ) ≤ 3 ∧ (1 / 2 : ℝ) * ((2 : ℕ) : ℝ) = ((1 : ℤ) : ℝ)
    ∧ (1 : ℝ) ^ 2 < (4 : ℝ) ^ (1 : ℤ) ∧ (4 : ℝ) ^ (1 : ℤ) < 3 ^ 2 := by norm_num

/-! ## Razlaga 1–4: definicija in osnovne zveze -/

/-- Razlaga 1 (definicija, Povzetek, ustno vprašanje 1): za a > 0, a ≠ 1, b > 0 je logₐ b = x ⟺ aˣ = b.
trditev: MAT-SS-2/logaritem#definicija
besedilo: »Definicija.** Naj bo $a > 0$, $a \ne 1$ in $b > 0$.« -/
theorem definicija (a b x : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (hb : 0 < b) :
    Real.logb a b = x ↔ a ^ x = b := Real.logb_eq_iff_rpow_eq ha ha1 hb

/-- Predpostavke trditve `definicija` se dajo izpolniti (a = 2, b = 32). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 32 := by norm_num

/-- Predpostavke trditve `definicija` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 32 := by norm_num
  definicija (ha := w.1) (ha1 := w.2.1) (hb := w.2.2)

/-- Razlaga 1: log₂ 32 = 5 (2⁵ = 32) in log₃(1/9) = −2 (3⁻² = 1/9).
trditev: MAT-SS-2/logaritem#definicija-primera
besedilo: »Na primer $\log_2 32 = 5$, ker je $2^5 = 32$, in $\log_3 \dfrac{1}{9} = -2$, ker je $3^{-2} = \dfrac{1}{9}$.« -/
theorem definicija_primera : Real.logb 2 32 = 5 ∧ Real.logb 3 (1 / 9) = -2 := by
  constructor
  · rw [show (32 : ℝ) = 2 ^ (5 : ℝ) by norm_num, log_pot 2 5 (by norm_num) (by norm_num)]
  · rw [show (1 / 9 : ℝ) = 3 ^ (-2 : ℝ) by norm_num [Real.rpow_neg],
      log_pot 3 (-2) (by norm_num) (by norm_num)]

/-- Razlaga 2 (pogoji): (−4)^(1/2) = √(−4) ni realno število (noben x nima x² = −4); 1ˣ = 5 nima
rešitve; za a > 0 je aˣ > 0, zato aˣ = b pri b ≤ 0 nima rešitve (posebej 2ˣ = 0, 2ˣ = −4, 3ˣ = −9).
trditev: MAT-SS-2/logaritem#pogoji
besedilo: »Pri $a \le 0$ potenca $a^x$ ni realno število za vse realne $x$ (na primer $(-4)^{\frac{1}{2}} = \sqrt{-4}$), pri $a = 1$ pa je $1^x = 1$ za vsak $x$, zato $1^x = 5$ nima rešitve.« -/
theorem pogoji : (¬ ∃ x : ℝ, x ^ 2 = -4) ∧ (¬ ∃ x : ℝ, (1 : ℝ) ^ x = 5) ∧
    (∀ a b : ℝ, 0 < a → b ≤ 0 → ¬ ∃ x : ℝ, a ^ x = b) ∧
    (¬ ∃ x : ℝ, (2 : ℝ) ^ x = 0) ∧ (¬ ∃ x : ℝ, (2 : ℝ) ^ x = -4) ∧ (¬ ∃ x : ℝ, (3 : ℝ) ^ x = -9) := by
  have hb : ∀ a b : ℝ, 0 < a → b ≤ 0 → ¬ ∃ x : ℝ, a ^ x = b := by
    rintro a b ha hb ⟨x, hx⟩
    have := Real.rpow_pos_of_pos ha x
    linarith
  refine ⟨?_, ?_, hb, hb 2 0 (by norm_num) le_rfl, hb 2 (-4) (by norm_num) (by norm_num),
    hb 3 (-9) (by norm_num) (by norm_num)⟩
  · rintro ⟨x, hx⟩; nlinarith [sq_nonneg x]
  · rintro ⟨x, hx⟩; rw [Real.one_rpow] at hx; norm_num at hx

/-- Razlaga 2: logaritem je lahko negativen, nič ali pozitiven: log₂(1/2) = −1, log₂ 1 = 0, log₂ 2 = 1.
trditev: MAT-SS-2/logaritem#predznak
besedilo: »Logaritem sam pa je lahko negativen, nič ali pozitiven.« -/
theorem predznak : Real.logb 2 (1 / 2) = -1 ∧ Real.logb 2 1 = 0 ∧ Real.logb 2 2 = 1 := by
  refine ⟨?_, Real.logb_one, Real.logb_self_eq_one (by norm_num)⟩
  rw [show (1 / 2 : ℝ) = 2 ^ (-1 : ℝ) by norm_num, log_pot 2 (-1) (by norm_num) (by norm_num)]

/-- Razlaga 3 (Povzetek, Ponovitev): logₐ 1 = 0, logₐ a = 1, logₐ aˣ = x, a^(logₐ b) = b
(a > 0, a ≠ 1, b > 0).
trditev: MAT-SS-2/logaritem#osnovne-zveze
besedilo: »$$\log_a 1 = 0, \qquad \log_a a = 1, \qquad \log_a a^x = x, \qquad a^{\log_a b} = b.$$« -/
theorem osnovne_zveze (a b x : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (hb : 0 < b) :
    Real.logb a 1 = 0 ∧ Real.logb a a = 1 ∧ Real.logb a (a ^ x) = x ∧ a ^ (Real.logb a b) = b := by
  refine ⟨Real.logb_one, ?_, log_pot a x ha ha1, Real.rpow_logb ha ha1 hb⟩
  have := log_pot a 1 ha ha1
  rwa [Real.rpow_one] at this

/-- Predpostavke trditve `osnovne_zveze` se dajo izpolniti (a = 2, b = 5). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 5 := by norm_num

/-- Predpostavke trditve `osnovne_zveze` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 5 := by norm_num
  osnovne_zveze (ha := w.1) (ha1 := w.2.1) (hb := w.2.2)

/-- Razlaga 4: log 1000 = 3, log 1 = 0, log 0,01 = −2; naravni logaritem je log z osnovo e:
log_e b = ln b, ln e = 1.
trditev: MAT-SS-2/logaritem#posebni-osnovi
besedilo: »Velja $\log 1000 = 3$, $\log 1 = 0$, $\log 0{,}01 = -2$.« -/
theorem posebni_osnovi (b : ℝ) :
    Real.logb 10 1000 = 3 ∧ Real.logb 10 1 = 0 ∧ Real.logb 10 0.01 = -2 ∧
    Real.logb (Real.exp 1) b = Real.log b ∧ Real.log (Real.exp 1) = 1 := by
  refine ⟨?_, Real.logb_one, ?_, ?_, Real.log_exp 1⟩
  · rw [show (1000 : ℝ) = 10 ^ (3 : ℝ) by norm_num, log_pot 10 3 (by norm_num) (by norm_num)]
  · rw [show (0.01 : ℝ) = 10 ^ (-2 : ℝ) by norm_num [Real.rpow_neg],
      log_pot 10 (-2) (by norm_num) (by norm_num)]
  · rw [Real.logb, Real.log_exp, div_one]

/-- Razlaga 4, premisli: 2² = 4 < 5 < 2^2,5 = √32 ≈ 5,66, zato 2 < log₂ 5 < 2,5 (bliže 2).
trditev: MAT-SS-2/logaritem#premisli-log2-5
besedilo: »Bliže $2$. Na sredini med $2$ in $3$ bi bila potenca $2^{2{,}5} = \sqrt{32} \approx 5{,}66$, kar je že več od $5$. Zato je $\log_2 5 < 2{,}5$.« -/
theorem premisli_log2_5 :
    (2 : ℝ) ^ (2.5 : ℝ) = Real.sqrt 32 ∧ (5.655 < Real.sqrt 32 ∧ Real.sqrt 32 < 5.665) ∧
    2 < Real.logb 2 5 ∧ Real.logb 2 5 < 2.5 := by
  have hs : 5.655 < (2 : ℝ) ^ (2.5 : ℝ) ∧ (2 : ℝ) ^ (2.5 : ℝ) < 5.665 :=
    koren_med (p := 5) (q := 2) (by norm_num) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h32 : (2 : ℝ) ^ (2.5 : ℝ) = Real.sqrt 32 := by
    rw [Real.sqrt_eq_rpow, show (32 : ℝ) = 2 ^ (5 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]
    norm_num
  have h5 : (2 : ℝ) ^ (Real.logb 2 5) = 5 := Real.rpow_logb (by norm_num) (by norm_num) (by norm_num)
  refine ⟨h32, by rw [← h32]; exact hs, ?_, ?_⟩
  · have : (2 : ℝ) ^ (2 : ℝ) < (2 : ℝ) ^ (Real.logb 2 5) := by rw [h5]; norm_num
    exact (Real.rpow_lt_rpow_left_iff (by norm_num)).mp this
  · have : (2 : ℝ) ^ (Real.logb 2 5) < (2 : ℝ) ^ (2.5 : ℝ) := by rw [h5]; linarith [hs.1]
    exact (Real.rpow_lt_rpow_left_iff (by norm_num)).mp this

/-! ## Razlaga 5: pravila -/

/-- Razlaga 5 (Povzetek, Ponovitev): za a > 0, a ≠ 1, x, y > 0 in realen n:
logₐ(xy) = logₐ x + logₐ y, logₐ(x/y) = logₐ x − logₐ y, logₐ xⁿ = n·logₐ x, logₐ ⁿ√x = (1/n)·logₐ x.
trditev: MAT-SS-2/logaritem#pravila
besedilo: »Za $a > 0$, $a \ne 1$, $x, y > 0$ in realno število $n$ (pri korenu je $n$ naravno, $n \ge 2$):« -/
theorem pravila (a x y n : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (hx : 0 < x) (hy : 0 < y) :
    Real.logb a (x * y) = Real.logb a x + Real.logb a y ∧
    Real.logb a (x / y) = Real.logb a x - Real.logb a y ∧
    Real.logb a (x ^ n) = n * Real.logb a x ∧
    Real.logb a (x ^ (1 / n)) = 1 / n * Real.logb a x := by
  have _h := And.intro ha ha1
  have hp : ∀ m : ℝ, Real.logb a (x ^ m) = m * Real.logb a x := by
    intro m; rw [Real.logb, Real.log_rpow hx, Real.logb]; ring
  exact ⟨Real.logb_mul hx.ne' hy.ne', Real.logb_div hx.ne' hy.ne', hp n, hp (1 / n)⟩

/-- Predpostavke trditve `pravila` se dajo izpolniti (a = 2, x = 4, y = 8). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 4 ∧ (0 : ℝ) < 8 := by norm_num

/-- Predpostavke trditve `pravila` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 4 ∧ (0 : ℝ) < 8 := by norm_num
  pravila (ha := w.1) (ha1 := w.2.1) (hx := w.2.2.1) (hy := w.2.2.2)

/-- Razlaga 5 in ustno vprašanje 2 (dokaz pravila za produkt): če je u = logₐ x in v = logₐ y, je
x = aᵘ, y = aᵛ, xy = a^(u+v) in logₐ(xy) = u + v.
trditev: MAT-SS-2/logaritem#dokaz-produkta
besedilo: »Dokaz prvega pravila: označimo $u = \log_a x$ in $v = \log_a y$, torej $x = a^u$, $y = a^v$. Potem je $x \cdot y = a^{u+v}$ in po definiciji $\log_a (xy) = u + v$.« -/
theorem dokaz_produkta (a x y : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (hx : 0 < x) (hy : 0 < y) :
    x = a ^ (Real.logb a x) ∧ y = a ^ (Real.logb a y) ∧
    x * y = a ^ (Real.logb a x + Real.logb a y) ∧
    Real.logb a (x * y) = Real.logb a x + Real.logb a y := by
  have h1 := Real.rpow_logb ha ha1 hx
  have h2 := Real.rpow_logb ha ha1 hy
  have h3 : x * y = a ^ (Real.logb a x + Real.logb a y) := by rw [Real.rpow_add ha, h1, h2]
  refine ⟨h1.symm, h2.symm, h3, ?_⟩
  rw [h3, log_pot a _ ha ha1]

/-- Predpostavke trditve `dokaz_produkta` se dajo izpolniti (a = 2, x = 4, y = 8). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 4 ∧ (0 : ℝ) < 8 := by norm_num

/-- Predpostavke trditve `dokaz_produkta` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 4 ∧ (0 : ℝ) < 8 := by norm_num
  dokaz_produkta (ha := w.1) (ha1 := w.2.1) (hx := w.2.2.1) (hy := w.2.2.2)

/-- Razlaga 5, primeri: log₂(4·8) = 2 + 3 = 5, log 50 − log 5 = log 10 = 1, log₃ 9⁵ = 5·2 = 10,
log₂ √8 = 3/2.
trditev: MAT-SS-2/logaritem#pravila-primeri
besedilo: »Primeri po vrsti: $\log_2 (4 \cdot 8) = 2 + 3 = 5$, $\;\log 50 - \log 5 = \log 10 = 1$, $\;\log_3 9^5 = 5 \cdot 2 = 10$, $\;\log_2 \sqrt{8} = \dfrac{3}{2}$.« -/
theorem pravila_primeri :
    Real.logb 2 (4 * 8) = Real.logb 2 4 + Real.logb 2 8 ∧ Real.logb 2 4 + Real.logb 2 8 = 2 + 3 ∧
    Real.logb 10 50 - Real.logb 10 5 = Real.logb 10 10 ∧ Real.logb 10 10 = 1 ∧
    Real.logb 3 (9 ^ 5) = 5 * Real.logb 3 9 ∧ (5 : ℝ) * Real.logb 3 9 = 5 * 2 ∧
    Real.logb 2 (Real.sqrt 8) = 3 / 2 := by
  have l4 : Real.logb 2 4 = 2 := by
    rw [show (4 : ℝ) = 2 ^ (2 : ℝ) by norm_num, log_pot 2 2 (by norm_num) (by norm_num)]
  have l8 : Real.logb 2 8 = 3 := by
    rw [show (8 : ℝ) = 2 ^ (3 : ℝ) by norm_num, log_pot 2 3 (by norm_num) (by norm_num)]
  have l9 : Real.logb 3 9 = 2 := by
    rw [show (9 : ℝ) = 3 ^ (2 : ℝ) by norm_num, log_pot 3 2 (by norm_num) (by norm_num)]
  refine ⟨Real.logb_mul (by norm_num) (by norm_num), by rw [l4, l8], ?_,
    Real.logb_self_eq_one (by norm_num), by rw [Real.logb_pow]; norm_num, by rw [l9], ?_⟩
  · rw [← Real.logb_div (by norm_num) (by norm_num)]; norm_num
  · rw [Real.sqrt_eq_rpow, show (8 : ℝ) = 2 ^ (3 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num),
      log_pot 2 _ (by norm_num) (by norm_num)]
    norm_num

/-- Razlaga 5, premisli: 2¹ + 2³ = 10, log₂ 10 ≈ 3,32; log 20 ≈ 1,30, log 10 + log 10 = 2.
trditev: MAT-SS-2/logaritem#premisli-vsota
besedilo: »Ne znaš: $2^1 + 2^3 = 10$, eksponenta za $10$ ($\log_2 10 \approx 3{,}32$) pa iz $1$ in $3$ ne dobiš s preprostim računom. Ker za vsoto potenc ni pravila, ga ni niti za logaritem vsote. Na primer $\log 20 \approx 1{,}30$, $\log 10 + \log 10 = 2$.« -/
theorem premisli_vsota :
    (2 : ℝ) ^ 1 + 2 ^ 3 = 10 ∧ (3.315 < Real.logb 2 10 ∧ Real.logb 2 10 < 3.325) ∧
    (1.295 < Real.logb 10 20 ∧ Real.logb 10 20 < 1.305) ∧
    Real.logb 10 10 + Real.logb 10 10 = 2 := by
  obtain ⟨a1, a2⟩ := ln2
  obtain ⟨_, b1, b2⟩ := ln10
  have q := kvocient (by norm_num) (by norm_num) b1 b2 a1 a2
  have l20 : Real.logb 10 20 = 1 + Real.logb 10 2 := by
    rw [show (20 : ℝ) = 10 * 2 by norm_num, Real.logb_mul (by norm_num) (by norm_num),
      Real.logb_self_eq_one (by norm_num)]
  obtain ⟨g1, g2⟩ := lg2
  refine ⟨by norm_num, ?_, ⟨by linarith, by linarith⟩, by rw [Real.logb_self_eq_one (by norm_num)]; norm_num⟩
  rw [Real.logb]
  constructor <;> linarith [q.1, q.2]

/-! ## Razlaga 6: prehod na novo osnovo -/

/-- Razlaga 6 (Povzetek, ustno vprašanje 3): za a > 0, a ≠ 1, b > 0 in c > 0, c ≠ 1 je
logₐ b = log_c b / log_c a; posebej logₐ b = log b / log a in (osnova c = e) logₐ b = ln b / ln a,
ker je log_e b = ln b in log_e a = ln a.
trditev: MAT-SS-2/logaritem#prehod
besedilo: »Izpeljava: naj bo $x = \log_a b$, torej $a^x = b$. Obe strani logaritmiramo z osnovo $c$ in uporabimo pravilo za potenco: $x \cdot \log_c a = \log_c b$. Delimo z $\log_c a$ (ki ni $0$, ker je $a \ne 1$) in dobimo formulo.« -/
theorem prehod (a b c : ℝ) (hc : 0 < c) (hc1 : c ≠ 1) (ha : 0 < a) (ha1 : a ≠ 1) (hb : 0 < b) :
    Real.logb a b = Real.logb c b / Real.logb c a ∧
    Real.logb a b = Real.logb 10 b / Real.logb 10 a ∧
    Real.logb a b = Real.logb (Real.exp 1) b / Real.logb (Real.exp 1) a ∧
    Real.logb (Real.exp 1) b = Real.log b ∧ Real.logb (Real.exp 1) a = Real.log a := by
  have _h := And.intro ha (And.intro ha1 hb)
  have hlc : Real.log c ≠ 0 := by
    intro h
    rcases Real.log_eq_zero.mp h with h | h | h <;> [linarith; exact hc1 h; linarith]
  have h10 : Real.log 10 ≠ 0 := by
    rw [(ln10).1]; linarith [(ln2).1, (ln5).1]
  have he : Real.log (Real.exp 1) ≠ 0 := by rw [Real.log_exp]; norm_num
  refine ⟨?_, ?_, ?_, ?_, ?_⟩
  · simp only [Real.logb]; field_simp
  · simp only [Real.logb]; field_simp
  · simp only [Real.logb]; field_simp
  · rw [Real.logb, Real.log_exp, div_one]
  · rw [Real.logb, Real.log_exp, div_one]

/-- Predpostavke trditve `prehod` se dajo izpolniti (c = 10, a = 2, b = 5). -/
example : (0 : ℝ) < 10 ∧ (10 : ℝ) ≠ 1 ∧ (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 5 := by norm_num

/-- Predpostavke trditve `prehod` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 10 ∧ (10 : ℝ) ≠ 1 ∧ (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 5 := by norm_num
  prehod (hc := w.1) (hc1 := w.2.1) (ha := w.2.2.1) (ha1 := w.2.2.2.1) (hb := w.2.2.2.2)

/-- Razlaga 6 (izpeljava): iz x = logₐ b sledi aˣ = b in x·log_c a = log_c b (a, b, c > 0, a ≠ 1).
trditev: MAT-SS-2/logaritem#prehod-izpeljava
besedilo: »Izpeljava: naj bo $x = \log_a b$, torej $a^x = b$. Obe strani logaritmiramo z osnovo $c$ in uporabimo pravilo za potenco: $x \cdot \log_c a = \log_c b$. Delimo z $\log_c a$ (ki ni $0$, ker je $a \ne 1$) in dobimo formulo.« -/
theorem prehod_izpeljava (a b c : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (hb : 0 < b) :
    a ^ (Real.logb a b) = b ∧ Real.logb a b * Real.logb c a = Real.logb c b := by
  refine ⟨Real.rpow_logb ha ha1 hb, ?_⟩
  have h := congrArg (Real.logb c) (Real.rpow_logb ha ha1 hb)
  rw [Real.logb, Real.log_rpow ha] at h
  rw [← h, Real.logb, Real.logb]; ring

/-- Predpostavke trditve `prehod_izpeljava` se dajo izpolniti (a = 2, b = 5, c = 10). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 5 := by norm_num

/-- Predpostavke trditve `prehod_izpeljava` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 5 := by norm_num
  prehod_izpeljava (ha := w.1) (ha1 := w.2.1) (hb := w.2.2)

/-- Razlaga 6: log₂ 5 = log 5 / log 2 ≈ 0,69897/0,30103 ≈ 2,3219 (in ≈ 2,32 tedna; 2,32·7 ≈ 16 dni);
preizkus 2^2,3219 ≈ 5,000.
trditev: MAT-SS-2/logaritem#log2-5
besedilo: »$\log_2 5 = \dfrac{\log 5}{\log 2} \approx \dfrac{0{,}69897}{0{,}30103} \approx 2{,}3219$« -/
theorem log2_5 :
    Real.logb 2 5 = Real.logb 10 5 / Real.logb 10 2 ∧
    (2.32185 < (0.69897 : ℝ) / 0.30103 ∧ (0.69897 : ℝ) / 0.30103 < 2.32195) ∧
    (2.32185 < Real.logb 2 5 ∧ Real.logb 2 5 < 2.32195) ∧
    (15.5 < (2.32 : ℝ) * 7 ∧ (2.32 : ℝ) * 7 < 16.5) ∧
    (4.9995 < (2 : ℝ) ^ (2.3219 : ℝ) ∧ (2 : ℝ) ^ (2.3219 : ℝ) < 5.0005) := by
  obtain ⟨a1, a2⟩ := ln2
  obtain ⟨c1, c2⟩ := ln5
  have q := kvocient (by norm_num) (by norm_num) c1 c2 a1 a2
  have hu : Real.exp (Real.log 2 * 2.3219 - Real.log 5) = (2 : ℝ) ^ (2.3219 : ℝ) / 5 := by
    rw [Real.exp_sub, Real.exp_log (by norm_num), Real.rpow_def_of_pos (by norm_num)]
  have hneg : Real.log 2 * 2.3219 - Real.log 5 ≤ 0 := by nlinarith
  have e1 := Real.add_one_le_exp (Real.log 2 * 2.3219 - Real.log 5)
  have e2 : Real.exp (Real.log 2 * 2.3219 - Real.log 5) ≤ 1 := by
    rw [← Real.exp_zero]; exact Real.exp_le_exp.mpr hneg
  rw [hu] at e1 e2
  refine ⟨(prehod 2 5 10 (by norm_num) (by norm_num) (by positivity) (by norm_num) (by positivity)).2.1, by norm_num, ?_, by norm_num,
    ⟨by nlinarith, by linarith⟩⟩
  rw [Real.logb]
  constructor <;> linarith [q.1, q.2]

/-- Razlaga 6: logₐ b · log_b a = 1 (a, b > 0, a, b ≠ 1); log₂ 8 · log₈ 2 = 3·(1/3) = 1.
trditev: MAT-SS-2/logaritem#obratna
besedilo: »Posledica formule je še zveza $\log_a b \cdot \log_b a = 1$, na primer $\log_2 8 \cdot \log_8 2 = 3 \cdot \dfrac{1}{3} = 1$.« -/
theorem obratna (a b : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (hb : 0 < b) (hb1 : b ≠ 1) :
    Real.logb a b * Real.logb b a = 1 ∧ Real.logb 2 8 = 3 ∧ Real.logb 8 2 = 1 / 3 ∧
    (3 : ℝ) * (1 / 3) = 1 := by
  have hla : Real.log a ≠ 0 := by
    intro h; rcases Real.log_eq_zero.mp h with h | h | h <;> [linarith; exact ha1 h; linarith]
  have hlb : Real.log b ≠ 0 := by
    intro h; rcases Real.log_eq_zero.mp h with h | h | h <;> [linarith; exact hb1 h; linarith]
  have l8 : Real.logb 2 8 = 3 := by
    rw [show (8 : ℝ) = 2 ^ (3 : ℝ) by norm_num, log_pot 2 3 (by norm_num) (by norm_num)]
  refine ⟨by simp only [Real.logb]; field_simp, l8, ?_, by norm_num⟩
  rw [← Real.inv_logb, l8, inv_eq_one_div]

/-- Predpostavke trditve `obratna` se dajo izpolniti (a = 2, b = 8). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 8 ∧ (8 : ℝ) ≠ 1 := by norm_num

/-! ## Razlaga 7: naravni logaritem -/

/-- Predpostavke trditve `obratna` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 8 ∧ (8 : ℝ) ≠ 1 := by norm_num
  obratna (ha := w.1) (ha1 := w.2.1) (hb := w.2.2.1) (hb1 := w.2.2.2)

/-- Razlaga 7: ln 1 = 0, ln e = 1, ln eˣ = x, e^(ln b) = b (b > 0); ln e⁵ = 5, ln(1/e²) = −2, e^(ln 7) = 7.
trditev: MAT-SS-2/logaritem#naravni
besedilo: »Na primer $\ln \mathrm{e}^5 = 5$, $\;\ln \dfrac{1}{\mathrm{e}^2} = -2$ in $\mathrm{e}^{\ln 7} = 7$.« -/
theorem naravni (x b : ℝ) (hb : 0 < b) :
    Real.log 1 = 0 ∧ Real.log (Real.exp 1) = 1 ∧ Real.log (Real.exp x) = x ∧
    Real.exp (Real.log b) = b ∧ Real.log (Real.exp 5) = 5 ∧
    Real.log (1 / Real.exp 2) = -2 ∧ Real.exp (Real.log 7) = 7 := by
  refine ⟨Real.log_one, Real.log_exp 1, Real.log_exp x, Real.exp_log hb, Real.log_exp 5, ?_,
    Real.exp_log (by norm_num)⟩
  rw [one_div, Real.log_inv, Real.log_exp]

/-- Predpostavke trditve `naravni` se dajo izpolniti (b = 7). -/
example : (0 : ℝ) < 7 := by norm_num

/-- Predpostavke trditve `naravni` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 7 := by norm_num
  naravni (hb := w)

/-- Razlaga 7: eˣ = 20 ⟺ x = ln 20 ≈ 3,00; 3ˣ = 20 ⟺ x·ln 3 = ln 20 ⟺ x = ln 20/ln 3 ≈ 2,73.
trditev: MAT-SS-2/logaritem#naravni-enacbi
besedilo: »Enačbo z drugo osnovo, na primer $3^x = 20$, logaritmiramo z $\ln$: $x \ln 3 = \ln 20$, zato je $x = \dfrac{\ln 20}{\ln 3} \approx 2{,}73$.« -/
theorem naravni_enacbi (x : ℝ) :
    (Real.exp x = 20 ↔ x = Real.log 20) ∧ (2.995 < Real.log 20 ∧ Real.log 20 < 3.005) ∧
    ((3 : ℝ) ^ x = 20 ↔ x * Real.log 3 = Real.log 20) ∧
    ((3 : ℝ) ^ x = 20 ↔ x = Real.log 20 / Real.log 3) ∧
    (2.725 < Real.log 20 / Real.log 3 ∧ Real.log 20 / Real.log 3 < 2.735) := by
  have l20 : Real.log 20 = 2 * Real.log 2 + Real.log 5 := by
    rw [show (20 : ℝ) = 2 ^ 2 * 5 by norm_num, Real.log_mul (by norm_num) (by norm_num), Real.log_pow]
    push_cast; ring
  obtain ⟨a1, a2⟩ := ln2
  obtain ⟨c1, c2⟩ := ln5
  obtain ⟨d1, d2⟩ := ln3
  have b1 : 2.995731 < Real.log 20 := by linarith
  have b2 : Real.log 20 < 2.995733 := by linarith
  have q := kvocient (by norm_num) (by norm_num) b1 b2 d1 d2
  have hl3 : 0 < Real.log 3 := by linarith
  have e3 : (3 : ℝ) ^ x = 20 ↔ x * Real.log 3 = Real.log 20 := by
    rw [Real.rpow_def_of_pos (by norm_num)]
    constructor
    · intro h; rw [← h, Real.log_exp]; ring
    · intro h; rw [mul_comm, h, Real.exp_log (by norm_num)]
  refine ⟨⟨fun h => by rw [← h, Real.log_exp], fun h => by rw [h, Real.exp_log (by norm_num)]⟩,
    ⟨by linarith, by linarith⟩, e3, ?_, ⟨by linarith [q.1], by linarith [q.2]⟩⟩
  rw [e3, eq_div_iff hl3.ne']

/-! ## Razlaga 8 in 9: logaritemska skala, model -/

/-- Razlaga 8: oznake 2, 3, 5 ležijo pri log 2 ≈ 0,301, log 3 ≈ 0,477, log 5 ≈ 0,699 dekade, oznake 20,
30, 50 pa pri 1 + teh vrednostih; točka t dekade desno od 10ⁿ pripada 10^(n+t) (log 10^(n+t) = n + t);
sredina med 10 in 100 je 10^1,5 ≈ 31,6, ne 55.
trditev: MAT-SS-2/logaritem#skala
besedilo: »Sredina med $10$ in $100$ je zato $10^{1{,}5} \approx 31{,}6$, ne $55$.« -/
theorem skala (n t : ℝ) :
    (0.3005 < Real.logb 10 2 ∧ Real.logb 10 2 < 0.3015) ∧
    (0.4765 < Real.logb 10 3 ∧ Real.logb 10 3 < 0.4775) ∧
    (0.6985 < Real.logb 10 5 ∧ Real.logb 10 5 < 0.6995) ∧
    Real.logb 10 20 = 1 + Real.logb 10 2 ∧ Real.logb 10 30 = 1 + Real.logb 10 3 ∧
    Real.logb 10 50 = 1 + Real.logb 10 5 ∧
    Real.logb 10 ((10 : ℝ) ^ (n + t)) = n + t ∧
    (31.55 < (10 : ℝ) ^ (1.5 : ℝ) ∧ (10 : ℝ) ^ (1.5 : ℝ) < 31.65) ∧ ((10 : ℝ) + 100) / 2 = 55 := by
  obtain ⟨g1, g2⟩ := lg2
  obtain ⟨h1, h2⟩ := lg3
  have l5 : Real.logb 10 5 = 1 - Real.logb 10 2 := by
    rw [show (5 : ℝ) = 10 / 2 by norm_num, Real.logb_div (by norm_num) (by norm_num),
      Real.logb_self_eq_one (by norm_num)]
  have m : ∀ y : ℝ, y ≠ 0 → Real.logb 10 (10 * y) = 1 + Real.logb 10 y := fun y hy => by
    rw [Real.logb_mul (by norm_num) hy, Real.logb_self_eq_one (by norm_num)]
  refine ⟨⟨by linarith, by linarith⟩, ⟨by linarith, by linarith⟩, ⟨by linarith, by linarith⟩,
    by rw [← m 2 (by norm_num)]; norm_num, by rw [← m 3 (by norm_num)]; norm_num,
    by rw [← m 5 (by norm_num)]; norm_num, log_pot 10 _ (by norm_num) (by norm_num),
    koren_med (p := 3) (q := 2) (by norm_num) (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    by norm_num⟩

/-- Razlaga 9: v modelu y = A + B log x pomnožitev x s k (x, k > 0) spremeni y za isti korak B log k;
pH = −log c: ko se c podeseteri, pH pade za 1, pri c = 1 je pH = 0.
trditev: MAT-SS-2/logaritem#model
besedilo: »Tako nastane pH: ko se $c$ podeseteri, pH pade za $1$, pri $c = 1\,\text{mol/L}$ pa je $0$, torej $B = -1$ in $A = 0$.« -/
theorem model (A B x k : ℝ) (hx : 0 < x) (hk : 0 < k) :
    A + B * Real.logb 10 (k * x) = (A + B * Real.logb 10 x) + B * Real.logb 10 k ∧
    -Real.logb 10 (10 * x) = -Real.logb 10 x - 1 ∧ -Real.logb 10 1 = 0 := by
  refine ⟨by rw [Real.logb_mul hk.ne' hx.ne']; ring, ?_, by rw [Real.logb_one]; norm_num⟩
  rw [Real.logb_mul (by norm_num) hx.ne', Real.logb_self_eq_one (by norm_num)]; ring

/-- Predpostavke trditve `model` se dajo izpolniti (x = 1, k = 10). -/
example : (0 : ℝ) < 1 ∧ (0 : ℝ) < 10 := by norm_num

/-! ## Primer 1 -/

/-- Predpostavke trditve `model` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 1 ∧ (0 : ℝ) < 10 := by norm_num
  model (hx := w.1) (hk := w.2)

/-- Primer 1: a) 32 = 2⁵ ⟹ log₂ 32 = 5; b) 1/9 = 3⁻² ⟹ log₃(1/9) = −2; c) 4ˣ = 8 ⟺ 2^(2x) = 2³ ⟺ 2x = 3
⟺ x = 3/2, torej log₄ 8 = 3/2 (preizkus 4^(3/2) = (√4)³ = 2³ = 8); d) 0,001 = 1/1000 = 10⁻³ ⟹ log 0,001 = −3.
trditev: MAT-SS-2/logaritem#primer1
besedilo: »Odgovor: $\log_2 32 = 5$, $\log_3 \dfrac{1}{9} = -2$, $\log_4 8 = \dfrac{3}{2}$ in $\log 0{,}001 = -3$.« -/
theorem primer1 :
    Real.logb 2 32 = 5 ∧ Real.logb 3 (1 / 9) = -2 ∧
    (∀ x : ℝ, (4 : ℝ) ^ x = 8 ↔ x = 3 / 2) ∧ Real.logb 4 8 = 3 / 2 ∧
    (4 : ℝ) ^ (3 / 2 : ℝ) = (Real.sqrt 4) ^ 3 ∧ (Real.sqrt 4) ^ 3 = 2 ^ 3 ∧ (2 : ℝ) ^ 3 = 8 ∧
    (0.001 : ℝ) = 1 / 1000 ∧ (1 / 1000 : ℝ) = 10 ^ (-3 : ℝ) ∧ Real.logb 10 0.001 = -3 := by
  have h4 : ∀ x : ℝ, (4 : ℝ) ^ x = 8 ↔ x = 3 / 2 := by
    intro x
    calc (4 : ℝ) ^ x = 8 ↔ (2 : ℝ) ^ (2 * x) = (2 : ℝ) ^ (3 : ℝ) := by
          rw [show (4 : ℝ) = 2 ^ (2 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; norm_num
      _ ↔ 2 * x = 3 := by
          constructor
          · intro h
            rcases lt_trichotomy (2 * x) 3 with h1 | h1 | h1
            · have := (Real.rpow_lt_rpow_left_iff (show (1 : ℝ) < 2 by norm_num)).mpr h1; linarith
            · exact h1
            · have := (Real.rpow_lt_rpow_left_iff (show (1 : ℝ) < 2 by norm_num)).mpr h1; linarith
          · intro h; rw [h]
      _ ↔ x = 3 / 2 := by constructor <;> intro h <;> linarith
  have hs : Real.sqrt 4 = 2 := by
    rw [show (4 : ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨(definicija_primera).1, (definicija_primera).2, h4, ?_, ?_, by rw [hs], by norm_num,
    by norm_num, by norm_num [Real.rpow_neg], ?_⟩
  · rw [definicija 4 8 _ (by norm_num) (by norm_num) (by norm_num)]; exact (h4 _).mpr rfl
  · rw [Real.sqrt_eq_rpow, ← Real.rpow_natCast, ← Real.rpow_mul (by norm_num)]; norm_num
  · rw [show (0.001 : ℝ) = 10 ^ (-3 : ℝ) by norm_num [Real.rpow_neg],
      log_pot 10 (-3) (by norm_num) (by norm_num)]

/-! ## Primer 2 -/

/-- Primer 2: a) log₆ 9 + log₆ 4 = log₆(9·4) = log₆ 36 = 2; b) 2 log₃ 6 = log₃ 6² = log₃ 36,
log₃ 36 − log₃ 4 = log₃(36/4) = log₃ 9 = 2; preverjanje: log₆ 9 ≈ 1,2263, log₆ 4 ≈ 0,7737.
trditev: MAT-SS-2/logaritem#primer2
besedilo: »Preverjanje z računalom: $\log_6 9 \approx 1{,}2263$ in $\log_6 4 \approx 0{,}7737$, vsota je $2{,}0000$.« -/
theorem primer2 :
    Real.logb 6 9 + Real.logb 6 4 = Real.logb 6 (9 * 4) ∧ Real.logb 6 (9 * 4) = Real.logb 6 36 ∧
    Real.logb 6 36 = 2 ∧
    2 * Real.logb 3 6 = Real.logb 3 (6 ^ 2) ∧ Real.logb 3 (6 ^ 2) = Real.logb 3 36 ∧
    Real.logb 3 36 - Real.logb 3 4 = Real.logb 3 (36 / 4) ∧ Real.logb 3 (36 / 4) = Real.logb 3 9 ∧
    Real.logb 3 9 = 2 ∧
    (1.22625 < Real.logb 6 9 ∧ Real.logb 6 9 < 1.22635) ∧
    (0.77365 < Real.logb 6 4 ∧ Real.logb 6 4 < 0.77375) := by
  have l6 : Real.log 6 = Real.log 2 + Real.log 3 := by
    rw [← Real.log_mul (by norm_num) (by norm_num)]; norm_num
  have l9 : Real.log 9 = 2 * Real.log 3 := by
    rw [show (9 : ℝ) = 3 ^ 2 by norm_num, Real.log_pow]; push_cast; ring
  have l4 : Real.log 4 = 2 * Real.log 2 := by
    rw [show (4 : ℝ) = 2 ^ 2 by norm_num, Real.log_pow]; push_cast; ring
  obtain ⟨a1, a2⟩ := ln2
  obtain ⟨d1, d2⟩ := ln3
  have q9 := kvocient (a := Real.log 9) (b := Real.log 6) (by norm_num) (by norm_num)
    (show 2.197224 < Real.log 9 by linarith) (show Real.log 9 < 2.197226 by linarith)
    (show 1.7917591 < Real.log 6 by linarith) (show Real.log 6 < 1.7917602 by linarith)
  have q4 := kvocient (a := Real.log 4) (b := Real.log 6) (by norm_num) (by norm_num)
    (show 1.3862943 < Real.log 4 by linarith) (show Real.log 4 < 1.3862944 by linarith)
    (show 1.7917591 < Real.log 6 by linarith) (show Real.log 6 < 1.7917602 by linarith)
  refine ⟨Real.logb_mul (by norm_num) (by norm_num) |>.symm, by norm_num, ?_,
    by rw [Real.logb_pow]; norm_num, by norm_num, Real.logb_div (by norm_num) (by norm_num) |>.symm,
    by norm_num, ?_, ?_, ?_⟩
  · rw [show (36 : ℝ) = 6 ^ (2 : ℝ) by norm_num, log_pot 6 2 (by norm_num) (by norm_num)]
  · rw [show (9 : ℝ) = 3 ^ (2 : ℝ) by norm_num, log_pot 3 2 (by norm_num) (by norm_num)]
  · rw [Real.logb]; constructor <;> linarith [q9.1, q9.2]
  · rw [Real.logb]; constructor <;> linarith [q4.1, q4.2]

/-! ## Primer 3 -/

/-- Primer 3 a): 72 = 8·9 = 2³·3², log 72 = 3 log 2 + 2 log 3 ≈ 3·0,3010 + 2·0,4771 = 0,9030 + 0,9542
= 1,8572 (≈ 1,857; tudi prava vrednost log 72 ≈ 1,857).
trditev: MAT-SS-2/logaritem#primer3a
besedilo: »$\log 72 = \log 2^3 + \log 3^2 = 3\log 2 + 2\log 3 \approx 3 \cdot 0{,}3010 + 2 \cdot 0{,}4771 = 0{,}9030 + 0{,}9542 = 1{,}8572$« -/
theorem primer3a :
    (72 : ℝ) = 8 * 9 ∧ (8 : ℝ) * 9 = 2 ^ 3 * 3 ^ 2 ∧
    Real.logb 10 72 = 3 * Real.logb 10 2 + 2 * Real.logb 10 3 ∧
    (3 : ℝ) * 0.3010 + 2 * 0.4771 = 0.9030 + 0.9542 ∧ (0.9030 : ℝ) + 0.9542 = 1.8572 ∧
    (1.8565 < Real.logb 10 72 ∧ Real.logb 10 72 < 1.8575) := by
  have e : Real.logb 10 72 = 3 * Real.logb 10 2 + 2 * Real.logb 10 3 := by
    rw [show (72 : ℝ) = 2 ^ 3 * 3 ^ 2 by norm_num, Real.logb_mul (by norm_num) (by norm_num),
      Real.logb_pow, Real.logb_pow]
    push_cast; ring
  obtain ⟨g1, g2⟩ := lg2
  obtain ⟨h1, h2⟩ := lg3
  exact ⟨by norm_num, by norm_num, e, by norm_num, by norm_num, ⟨by linarith, by linarith⟩⟩

/-- Primer 3 b): log₆ 24 = log 24/log 6, 24 = 2³·3, 6 = 2·3, log 24 = 3 log 2 + log 3 ≈ 1,3801,
log 6 = log 2 + log 3 ≈ 0,7781; 1,3801/0,7781 ≈ 1,7737 ≈ 1,774 (tudi prava vrednost ≈ 1,774);
6¹ < 24 < 6², zato 1 < log₆ 24 < 2.
trditev: MAT-SS-2/logaritem#primer3b
besedilo: »Razcepimo: $24 = 2^3 \cdot 3$ in $6 = 2 \cdot 3$. Zato je $\log 24 = 3\log 2 + \log 3 \approx 0{,}9030 + 0{,}4771 = 1{,}3801$ in $\log 6 = \log 2 + \log 3 \approx 0{,}7781$.« -/
theorem primer3b :
    Real.logb 6 24 = Real.logb 10 24 / Real.logb 10 6 ∧
    Real.logb 10 24 = 3 * Real.logb 10 2 + Real.logb 10 3 ∧
    Real.logb 10 6 = Real.logb 10 2 + Real.logb 10 3 ∧
    (0.9030 : ℝ) + 0.4771 = 1.3801 ∧ (0.3010 : ℝ) + 0.4771 = 0.7781 ∧
    (1.77365 < (1.3801 : ℝ) / 0.7781 ∧ (1.3801 : ℝ) / 0.7781 < 1.77375) ∧
    (1.7735 < Real.logb 6 24 ∧ Real.logb 6 24 < 1.7745) ∧
    (1 < Real.logb 6 24 ∧ Real.logb 6 24 < 2) := by
  have e24 : Real.logb 10 24 = 3 * Real.logb 10 2 + Real.logb 10 3 := by
    rw [show (24 : ℝ) = 2 ^ 3 * 3 by norm_num, Real.logb_mul (by norm_num) (by norm_num),
      Real.logb_pow]
    push_cast; ring
  have e6 : Real.logb 10 6 = Real.logb 10 2 + Real.logb 10 3 := by
    rw [← Real.logb_mul (by norm_num) (by norm_num)]; norm_num
  obtain ⟨g1, g2⟩ := lg2
  obtain ⟨h1, h2⟩ := lg3
  have q := kvocient (a := Real.logb 10 24) (b := Real.logb 10 6) (by norm_num) (by norm_num)
    (show 1.3802 < Real.logb 10 24 by linarith) (show Real.logb 10 24 < 1.38043 by linarith)
    (show 0.7781 < Real.logb 10 6 by linarith) (show Real.logb 10 6 < 0.77816 by linarith)
  have hp := (prehod 6 24 10 (by norm_num) (by norm_num) (by positivity) (by norm_num) (by positivity)).2.1
  refine ⟨hp, e24, e6, by norm_num, by norm_num, by norm_num, ?_, ?_⟩
  · rw [hp]; constructor <;> linarith [q.1, q.2]
  · rw [hp]; constructor <;> linarith [q.1, q.2]

/-! ## Primer 4: tlak -/

/-- Primer 4: 1013·0,88ʰ = 500 ⟺ 0,88ʰ = 500/1013 ⟺ h = log₀,₈₈(500/1013) = log(500/1013)/log 0,88.
trditev: MAT-SS-2/logaritem#primer4
besedilo: »$1013 \cdot 0{,}88^h = 500$« -/
theorem primer4 (h : ℝ) :
    (1013 * (0.88 : ℝ) ^ h = 500 ↔ (0.88 : ℝ) ^ h = 500 / 1013) ∧
    ((0.88 : ℝ) ^ h = 500 / 1013 ↔ h = Real.logb 0.88 (500 / 1013)) ∧
    Real.logb 0.88 (500 / 1013) = Real.logb 10 (500 / 1013) / Real.logb 10 0.88 := by
  refine ⟨by constructor <;> intro h1 <;> linarith, ?_,
    (prehod 0.88 (500 / 1013) 10 (by norm_num) (by norm_num) (by positivity) (by norm_num) (by positivity)).2.1⟩
  rw [eq_comm (a := h), definicija 0.88 (500 / 1013) h (by norm_num) (by norm_num) (by norm_num)]

/-- Primer 4, premisli: 500/1013 ≈ 0,4936; log 0,4936 ≈ −0,3066; log 0,88 ≈ −0,0555; h ≈ 5,52
(≈ 5,5 km); 0,88⁵ ≈ 0,53, 0,88⁶ ≈ 0,46, zato 5 < h < 6.
trditev: MAT-SS-2/logaritem#primer4-vrednost
besedilo: »Smiselnost: $0{,}88^5 \approx 0{,}53$ in $0{,}88^6 \approx 0{,}46$, iskani $0{,}4936$ leži vmes, zato je $h$ med $5$ in $6$.« -/
theorem primer4_vrednost :
    ((0.49355 : ℝ) < 500 / 1013 ∧ (500 : ℝ) / 1013 < 0.49365) ∧
    (-0.30665 < Real.logb 10 0.4936 ∧ Real.logb 10 0.4936 < -0.30655) ∧
    (-0.05555 < Real.logb 10 0.88 ∧ Real.logb 10 0.88 < -0.05545) ∧
    (5.515 < Real.logb 0.88 (500 / 1013) ∧ Real.logb 0.88 (500 / 1013) < 5.525) ∧
    ((0.525 : ℝ) < 0.88 ^ 5 ∧ (0.88 : ℝ) ^ 5 < 0.535) ∧ ((0.455 : ℝ) < 0.88 ^ 6 ∧ (0.88 : ℝ) ^ 6 < 0.465) ∧
    (5 < Real.logb 0.88 (500 / 1013) ∧ Real.logb 0.88 (500 / 1013) < 6) := by
  -- ln 0,88 = ln(1 − 0,12)
  have h88 := log_vrsta 0.12 (by norm_num [abs_of_pos]) 10
  norm_num [Finset.sum_range_succ, abs_of_pos] at h88
  -- ln(1000/1013) = ln(1 − 13/1013)
  have h13 := log_vrsta (13 / 1013) (by norm_num [abs_of_pos]) 5
  norm_num [Finset.sum_range_succ, abs_of_pos] at h13
  -- ln 0,9872 = ln(1 − 0,0128)
  have h128 := log_vrsta 0.0128 (by norm_num [abs_of_pos]) 5
  norm_num [Finset.sum_range_succ, abs_of_pos] at h128
  obtain ⟨a1, a2⟩ := ln2
  obtain ⟨_, b1, b2⟩ := ln10
  have e500 : Real.log (500 / 1013) = -Real.log 2 + Real.log (1000 / 1013) := by
    rw [show (500 / 1013 : ℝ) = 2⁻¹ * (1000 / 1013) by norm_num,
      Real.log_mul (by norm_num) (by norm_num), Real.log_inv]
  have e4936 : Real.log 0.4936 = -Real.log 2 + Real.log (1234 / 1250) := by
    rw [show (0.4936 : ℝ) = 2⁻¹ * (1234 / 1250) by norm_num,
      Real.log_mul (by norm_num) (by norm_num), Real.log_inv]
  have l88a : 0.127833 < -Real.log 0.88 := by linarith [h88.1, h88.2]
  have l88b : -Real.log 0.88 < 0.127834 := by linarith [h88.1, h88.2]
  have l500a : 0.706063 < -Real.log (500 / 1013) := by rw [e500]; linarith [h13.1, h13.2]
  have l500b : -Real.log (500 / 1013) < 0.706064 := by rw [e500]; linarith [h13.1, h13.2]
  have l49a : 0.706029 < -Real.log 0.4936 := by rw [e4936]; linarith [h128.1, h128.2]
  have l49b : -Real.log 0.4936 < 0.706031 := by rw [e4936]; linarith [h128.1, h128.2]
  have qh := kvocient (by norm_num) (by norm_num) l500a l500b l88a l88b
  have q49 := kvocient (by norm_num) (by norm_num) l49a l49b b1 b2
  have q88 := kvocient (by norm_num) (by norm_num) l88a l88b b1 b2
  have eh : Real.logb 0.88 (500 / 1013) = (-Real.log (500 / 1013)) / (-Real.log 0.88) := by
    rw [Real.logb, neg_div_neg_eq]
  have e49 : Real.logb 10 0.4936 = -((-Real.log 0.4936) / Real.log 10) := by rw [Real.logb]; ring
  have e88 : Real.logb 10 0.88 = -((-Real.log 0.88) / Real.log 10) := by rw [Real.logb]; ring
  refine ⟨by norm_num, ?_, ?_, ?_, by norm_num, by norm_num, ?_⟩
  · rw [e49]; constructor <;> linarith [q49.1, q49.2]
  · rw [e88]; constructor <;> linarith [q88.1, q88.2]
  · rw [eh]; constructor <;> linarith [qh.1, qh.2]
  · rw [eh]; constructor <;> linarith [qh.1, qh.2]

/-! ## Primer 5: naravni logaritem -/

/-- Primer 5: a) ln e³ = 3, ln(1/e) = ln e⁻¹ = −1, vsota 3 − 1 = 2; b) 2 ln 3 = ln 3² = ln 9, e^(2 ln 3)
= e^(ln 9) = 9; c) e^(2x−1) = 5 ⟺ 2x − 1 = ln 5 ⟺ x = (1 + ln 5)/2.
trditev: MAT-SS-2/logaritem#primer5
besedilo: »a) $\ln \mathrm{e}^3 = 3$ in $\ln \dfrac{1}{\mathrm{e}} = \ln \mathrm{e}^{-1} = -1$, vsota je $3 - 1 = 2$.« -/
theorem primer5 (x : ℝ) :
    Real.log (Real.exp 3) = 3 ∧ Real.log (1 / Real.exp 1) = Real.log (Real.exp (-1)) ∧
    Real.log (Real.exp (-1)) = -1 ∧ (3 : ℝ) - 1 = 2 ∧
    2 * Real.log 3 = Real.log (3 ^ 2) ∧ Real.log ((3 : ℝ) ^ 2) = Real.log 9 ∧
    Real.exp (2 * Real.log 3) = 9 ∧
    (Real.exp (2 * x - 1) = 5 ↔ 2 * x - 1 = Real.log 5) ∧
    (2 * x - 1 = Real.log 5 ↔ x = (1 + Real.log 5) / 2) := by
  have h9 : 2 * Real.log 3 = Real.log (3 ^ 2) := by rw [Real.log_pow]; push_cast; ring
  refine ⟨Real.log_exp 3, by rw [one_div, Real.exp_neg], Real.log_exp (-1), by norm_num, h9,
    by norm_num, ?_, ⟨fun h => by rw [← h, Real.log_exp], fun h => by rw [h, Real.exp_log (by norm_num)]⟩,
    by constructor <;> intro h <;> linarith⟩
  rw [h9, Real.exp_log (by norm_num)]; norm_num

/-- Primer 5 c): ln 5 ≈ 1,6094, x = (1 + ln 5)/2 ≈ 2,6094/2 ≈ 1,3047 ≈ 1,30; preizkus 2·1,3047 − 1 = 1,6094
in e^1,6094 ≈ 5,000.
trditev: MAT-SS-2/logaritem#primer5-vrednost
besedilo: »Preizkus: $2 \cdot 1{,}3047 - 1 = 1{,}6094$ in $\mathrm{e}^{1{,}6094} \approx 5{,}000$.« -/
theorem primer5_vrednost :
    (1.60935 < Real.log 5 ∧ Real.log 5 < 1.60945) ∧
    (1.30465 < (1 + Real.log 5) / 2 ∧ (1 + Real.log 5) / 2 < 1.30475) ∧
    (1.295 < (1 + Real.log 5) / 2 ∧ (1 + Real.log 5) / 2 < 1.305) ∧
    (2 : ℝ) * 1.3047 - 1 = 1.6094 ∧ (2.6094 : ℝ) / 2 = 1.3047 ∧
    (4.9995 < Real.exp 1.6094 ∧ Real.exp 1.6094 < 5.0005) := by
  obtain ⟨c1, c2⟩ := ln5
  have hu : Real.exp (1.6094 - Real.log 5) = Real.exp 1.6094 / 5 := by
    rw [Real.exp_sub, Real.exp_log (by norm_num)]
  have hneg : (1.6094 : ℝ) - Real.log 5 ≤ 0 := by linarith
  have e1 := Real.add_one_le_exp (1.6094 - Real.log 5)
  have e2 : Real.exp (1.6094 - Real.log 5) ≤ 1 := by
    rw [← Real.exp_zero]; exact Real.exp_le_exp.mpr hneg
  rw [hu] at e1 e2
  exact ⟨⟨by linarith, by linarith⟩, ⟨by linarith, by linarith⟩, ⟨by linarith, by linarith⟩,
    by norm_num, by norm_num, ⟨by linarith, by linarith⟩⟩

/-! ## Primer 6: hitrost hoje -/

/-- Primer 6 a): pomnožitev P z 10 poveča v za 0,15; A + 3B = 1,10 in A + 4B = 1,25 ⟺ B = 0,15 in
A = 1,10 − 0,45 = 0,65; preizkus z vsemi vrsticami (log 10³ = 3, …, log 10⁶ = 6).
trditev: MAT-SS-2/logaritem#primer6a
besedilo: »a) Iz prvih dveh vrstic: $A + 3B = 1{,}10$ in $A + 4B = 1{,}25$. Odštejemo: $B = 0{,}15$, nato $A = 1{,}10 - 0{,}45 = 0{,}65$.« -/
theorem primer6a (A B : ℝ) :
    ((1.25 : ℝ) - 1.10 = 0.15 ∧ (1.40 : ℝ) - 1.25 = 0.15 ∧ (1.55 : ℝ) - 1.40 = 0.15) ∧
    ((A + 3 * B = 1.10 ∧ A + 4 * B = 1.25) ↔ (B = 0.15 ∧ A = 0.65)) ∧ (1.10 : ℝ) - 0.45 = 0.65 ∧
    (0.65 + 0.15 * Real.logb 10 1000 = (1.10 : ℝ) ∧ 0.65 + 0.15 * Real.logb 10 10000 = (1.25 : ℝ) ∧
      0.65 + 0.15 * Real.logb 10 100000 = (1.40 : ℝ) ∧ 0.65 + 0.15 * Real.logb 10 1000000 = (1.55 : ℝ)) := by
  have lp : ∀ k : ℝ, Real.logb 10 ((10 : ℝ) ^ k) = k := fun k => log_pot 10 k (by norm_num) (by norm_num)
  refine ⟨by norm_num, ⟨fun ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩, fun ⟨h1, h2⟩ => ⟨by rw [h1, h2]; norm_num,
    by rw [h1, h2]; norm_num⟩⟩, by norm_num, ?_, ?_, ?_, ?_⟩
  · rw [show (1000 : ℝ) = 10 ^ (3 : ℝ) by norm_num, lp]; norm_num
  · rw [show (10000 : ℝ) = 10 ^ (4 : ℝ) by norm_num, lp]; norm_num
  · rw [show (100000 : ℝ) = 10 ^ (5 : ℝ) by norm_num, lp]; norm_num
  · rw [show (1000000 : ℝ) = 10 ^ (6 : ℝ) by norm_num, lp]; norm_num

/-- Primer 6 b), c): log 300000 ≈ 5,4771, v ≈ 1,47; M: log P = 4 + 0,3 = 4,3, P = 10^4,3 ≈ 19952,6 ≈ 20000
(10^0,3 ≈ 2, ker log 2 ≈ 0,30); v = 0,65 + 0,15·4,3 = 1,295 ≈ 1,3; model je linearen v log P.
trditev: MAT-SS-2/logaritem#primer6bc
besedilo: »c) Točke ležijo na premici, ker je $v$ linearna funkcija števila $\log P$. Pri M je $v = 0{,}65 + 0{,}15 \cdot 4{,}3 \approx 1{,}3\,\mathrm{m/s}$.« -/
theorem primer6bc :
    (5.47705 < Real.logb 10 300000 ∧ Real.logb 10 300000 < 5.47715) ∧
    (1.465 < 0.65 + 0.15 * Real.logb 10 300000 ∧ 0.65 + 0.15 * Real.logb 10 300000 < 1.475) ∧
    (4 : ℝ) + 0.3 = 4.3 ∧ Real.logb 10 ((10 : ℝ) ^ (4.3 : ℝ)) = 4.3 ∧
    (19952.55 < (10 : ℝ) ^ (4.3 : ℝ) ∧ (10 : ℝ) ^ (4.3 : ℝ) < 19952.65) ∧
    (1.95 < (10 : ℝ) ^ (0.3 : ℝ) ∧ (10 : ℝ) ^ (0.3 : ℝ) < 2.05) ∧
    (0.65 : ℝ) + 0.15 * 4.3 = 1.295 ∧ ((1.25 : ℝ) < 1.295 ∧ (1.295 : ℝ) < 1.35) := by
  have e : Real.logb 10 300000 = Real.logb 10 3 + 5 := by
    rw [show (300000 : ℝ) = 3 * 10 ^ (5 : ℝ) by norm_num, Real.logb_mul (by norm_num) (by norm_num),
      log_pot 10 5 (by norm_num) (by norm_num)]
  obtain ⟨h1, h2⟩ := lg3
  refine ⟨by rw [e]; constructor <;> linarith, by rw [e]; constructor <;> linarith, by norm_num,
    log_pot 10 _ (by norm_num) (by norm_num), ?_, ?_, by norm_num, by norm_num⟩
  · exact koren_med (p := 43) (q := 10) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num)
  · exact koren_med (p := 3) (q := 10) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num)

/-! ## Pogoste napake -/

/-- Pogoste napake: log(10 + 10) = log 20 ≈ 1,30 ≠ log 10 + log 10 = 2; log 100/log 10 = 2, log(100/10) = 1;
log₂ 8 = log 8/log 2 = 3 (ne log 2/log 8 = 1/3; 2³ = 8); (log 1000)² = 9, log 1000² = 6; logₐ 1 = 0 (a⁰ = 1)
za a > 0, a ≠ 1.
trditev: MAT-SS-2/logaritem#napake
besedilo: »Preizkus: $\log (10 + 10) = \log 20 \approx 1{,}30$, $\log 10 + \log 10 = 2$.« -/
theorem napake (a : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) :
    Real.logb 10 (10 + 10) = Real.logb 10 20 ∧ Real.logb 10 20 ≠ Real.logb 10 10 + Real.logb 10 10 ∧
    Real.logb 10 100 / Real.logb 10 10 = 2 ∧ Real.logb 10 (100 / 10) = 1 ∧
    Real.logb 2 8 = Real.logb 10 8 / Real.logb 10 2 ∧ Real.logb 2 8 = 3 ∧
    Real.logb 10 2 / Real.logb 10 8 = 1 / 3 ∧
    (Real.logb 10 1000) ^ 2 = 9 ∧ Real.logb 10 (1000 ^ 2) = 6 ∧ Real.logb a 1 = 0 := by
  have _h := And.intro ha ha1
  have lp : ∀ k : ℝ, Real.logb 10 ((10 : ℝ) ^ k) = k := fun k => log_pot 10 k (by norm_num) (by norm_num)
  have l1000 : Real.logb 10 1000 = 3 := by rw [show (1000 : ℝ) = 10 ^ (3 : ℝ) by norm_num, lp]
  have l100 : Real.logb 10 100 = 2 := by rw [show (100 : ℝ) = 10 ^ (2 : ℝ) by norm_num, lp]
  have l10 : Real.logb 10 10 = 1 := Real.logb_self_eq_one (by norm_num)
  have l8 : Real.logb 2 8 = 3 := by
    rw [show (8 : ℝ) = 2 ^ (3 : ℝ) by norm_num, log_pot 2 3 (by norm_num) (by norm_num)]
  have h8 : Real.logb 10 8 = 3 * Real.logb 10 2 := by
    rw [show (8 : ℝ) = 2 ^ 3 by norm_num, Real.logb_pow]; push_cast; ring
  obtain ⟨g1, g2⟩ := lg2
  have hp := (prehod 2 8 10 (by norm_num) (by norm_num) (by positivity) (by norm_num) (by positivity)).2.1
  refine ⟨by norm_num, ?_, by rw [l100, l10]; norm_num,
    by rw [show (100 / 10 : ℝ) = 10 by norm_num]; exact l10, hp, l8, ?_,
    by rw [l1000]; norm_num, ?_, Real.logb_one⟩
  · have l20 := (premisli_vsota).2.2.1
    rw [l10]; intro h; linarith [l20.2]
  · rw [h8]; field_simp
  · rw [Real.logb_pow, l1000]; norm_num

/-- Predpostavke trditve `napake` se dajo izpolniti (a = 10). -/
example : (0 : ℝ) < 10 ∧ (10 : ℝ) ≠ 1 := by norm_num

/-! ## Za maturo -/

/-- Predpostavke trditve `napake` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 10 ∧ (10 : ℝ) ≠ 1 := by norm_num
  napake (ha := w.1) (ha1 := w.2)

/-- Za maturo, naloga 1 in RAČUN: log₂ 24 + log₂(2/3) = log₂(24·2/3) = log₂ 16 = 4, √5 = 5^(1/2),
log₅ √5 = 1/2, vrednost 4 − 1/2 = 7/2.
trditev: MAT-SS-2/logaritem#matura1
besedilo: »$\log_2 24 + \log_2 \dfrac{2}{3} = \log_2 \left(24 \cdot \dfrac{2}{3}\right) = \log_2 16 = 4$« -/
theorem matura1 :
    Real.logb 2 24 + Real.logb 2 (2 / 3) = Real.logb 2 (24 * (2 / 3)) ∧ (24 : ℝ) * (2 / 3) = 16 ∧
    Real.logb 2 16 = 4 ∧ Real.logb 5 (Real.sqrt 5) = 1 / 2 ∧ (4 : ℝ) - 1 / 2 = 7 / 2 ∧
    Real.logb 2 24 + Real.logb 2 (2 / 3) - Real.logb 5 (Real.sqrt 5) = 7 / 2 := by
  have h1 : Real.logb 2 24 + Real.logb 2 (2 / 3) = Real.logb 2 (24 * (2 / 3)) :=
    (Real.logb_mul (by norm_num) (by norm_num)).symm
  have h16 : Real.logb 2 16 = 4 := by
    rw [show (16 : ℝ) = 2 ^ (4 : ℝ) by norm_num, log_pot 2 4 (by norm_num) (by norm_num)]
  have h5 : Real.logb 5 (Real.sqrt 5) = 1 / 2 := by
    rw [Real.sqrt_eq_rpow, log_pot 5 _ (by norm_num) (by norm_num)]
  refine ⟨h1, by norm_num, h16, h5, by norm_num, ?_⟩
  rw [h1, h5, show (24 : ℝ) * (2 / 3) = 16 by norm_num, h16]; norm_num

/-- Za maturo, naloga 2 a), b), d) in RAČUN: 10⁻⁶/10⁻¹² = 10⁶, L = 10 log 10⁶ = 60 dB;
3,2·10⁻⁵/10⁻¹² = 3,2·10⁷, L = 10(log 3,2 + 7) ≈ 10·7,50515 ≈ 75,05 ≈ 75,1 dB; L(5I) = 10 log 5 + L(I),
10 log 5 ≈ 6,99 ≈ 7,0 dB (log 5 ≈ 0,69897).
trditev: MAT-SS-2/logaritem#matura2abd
besedilo: »b) $L = 10 \log \left(3{,}2 \cdot 10^7\right) = 10 \left(\log 3{,}2 + 7\right) \approx 10 \cdot 7{,}50515 \approx 75{,}05$, zaokroženo $75{,}1\,\mathrm{dB}$.« -/
theorem matura2abd (I : ℝ) (hI : 0 < I) :
    (10 : ℝ) ^ (-6 : ℝ) / (10 : ℝ) ^ (-12 : ℝ) = (10 : ℝ) ^ (6 : ℝ) ∧
    10 * Real.logb 10 ((10 : ℝ) ^ (6 : ℝ)) = 60 ∧
    (3.2 * (10 : ℝ) ^ (-5 : ℝ)) / (10 : ℝ) ^ (-12 : ℝ) = 3.2 * (10 : ℝ) ^ (7 : ℝ) ∧
    Real.logb 10 (3.2 * (10 : ℝ) ^ (7 : ℝ)) = Real.logb 10 3.2 + 7 ∧
    (7.505145 < Real.logb 10 3.2 + 7 ∧ Real.logb 10 3.2 + 7 < 7.505155) ∧
    (75.045 < 10 * (Real.logb 10 3.2 + 7) ∧ 10 * (Real.logb 10 3.2 + 7) < 75.055) ∧
    (75.05 < 10 * (Real.logb 10 3.2 + 7) ∧ 10 * (Real.logb 10 3.2 + 7) < 75.15) ∧
    10 * Real.logb 10 (5 * I / (10 : ℝ) ^ (-12 : ℝ)) =
      10 * Real.logb 10 5 + 10 * Real.logb 10 (I / (10 : ℝ) ^ (-12 : ℝ)) ∧
    (0.698965 < Real.logb 10 5 ∧ Real.logb 10 5 < 0.698975) ∧
    (6.985 < 10 * Real.logb 10 5 ∧ 10 * Real.logb 10 5 < 6.995) ∧
    (6.95 < 10 * Real.logb 10 5 ∧ 10 * Real.logb 10 5 < 7.05) := by
  have lp : ∀ k : ℝ, Real.logb 10 ((10 : ℝ) ^ k) = k := fun k => log_pot 10 k (by norm_num) (by norm_num)
  have l32 : Real.logb 10 3.2 = 5 * Real.logb 10 2 - 1 := by
    rw [show (3.2 : ℝ) = 2 ^ 5 / 10 by norm_num, Real.logb_div (by norm_num) (by norm_num),
      Real.logb_pow, Real.logb_self_eq_one (by norm_num)]
    push_cast; ring
  have l5 : Real.logb 10 5 = 1 - Real.logb 10 2 := by
    rw [show (5 : ℝ) = 10 / 2 by norm_num, Real.logb_div (by norm_num) (by norm_num),
      Real.logb_self_eq_one (by norm_num)]
  have h12 : (0 : ℝ) < (10 : ℝ) ^ (-12 : ℝ) := Real.rpow_pos_of_pos (by norm_num) _
  obtain ⟨g1, g2⟩ := lg2
  refine ⟨?_, by rw [lp]; norm_num, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_⟩
  · rw [← Real.rpow_sub (by norm_num)]; norm_num
  · rw [mul_div_assoc, ← Real.rpow_sub (by norm_num)]; norm_num
  · rw [Real.logb_mul (by norm_num) (by positivity), lp]
  · rw [l32]; constructor <;> linarith
  · rw [l32]; constructor <;> linarith
  · rw [l32]; constructor <;> linarith
  · rw [mul_div_assoc, Real.logb_mul (by norm_num) (div_pos hI h12).ne']; ring
  · rw [l5]; constructor <;> linarith
  · rw [l5]; constructor <;> linarith
  · rw [l5]; constructor <;> linarith

/-- Predpostavke trditve `matura2abd` se dajo izpolniti (I = 10⁻⁶). -/
example : (0 : ℝ) < 10 ^ (-6 : ℝ) := Real.rpow_pos_of_pos (by norm_num) _

/-- Predpostavke trditve `matura2abd` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 10 ^ (-6 : ℝ) := Real.rpow_pos_of_pos (by norm_num) _
  matura2abd (hI := w)

/-- Za maturo, naloga 2 c): za I > 0 je 10 log(I/I₀) = 85 ⟺ log(I/I₀) = 8,5 ⟺ I/I₀ = 10^8,5
⟺ I = 10⁻¹²·10^8,5 = 10^(−3,5) ≈ 3,162·10⁻⁴ ≈ 3,16·10⁻⁴ W/m².
trditev: MAT-SS-2/logaritem#matura2c
besedilo: »c) $I = 10^{-12} \cdot 10^{8{,}5} = 10^{-3{,}5} \approx 3{,}162 \cdot 10^{-4}$, zaokroženo $3{,}16 \cdot 10^{-4}\,\mathrm{W/m^2}$.« -/
theorem matura2c (I : ℝ) (hI : 0 < I) :
    (10 * Real.logb 10 (I / (10 : ℝ) ^ (-12 : ℝ)) = 85 ↔ Real.logb 10 (I / (10 : ℝ) ^ (-12 : ℝ)) = 8.5) ∧
    (Real.logb 10 (I / (10 : ℝ) ^ (-12 : ℝ)) = 8.5 ↔ I / (10 : ℝ) ^ (-12 : ℝ) = (10 : ℝ) ^ (8.5 : ℝ)) ∧
    (I / (10 : ℝ) ^ (-12 : ℝ) = (10 : ℝ) ^ (8.5 : ℝ) ↔ I = (10 : ℝ) ^ (-12 : ℝ) * (10 : ℝ) ^ (8.5 : ℝ)) ∧
    (10 : ℝ) ^ (-12 : ℝ) * (10 : ℝ) ^ (8.5 : ℝ) = (10 : ℝ) ^ (-3.5 : ℝ) ∧
    (3.1615e-4 < (10 : ℝ) ^ (-3.5 : ℝ) ∧ (10 : ℝ) ^ (-3.5 : ℝ) < 3.1625e-4) ∧
    (3.155e-4 < (10 : ℝ) ^ (-3.5 : ℝ) ∧ (10 : ℝ) ^ (-3.5 : ℝ) < 3.165e-4) := by
  have h12 : (0 : ℝ) < (10 : ℝ) ^ (-12 : ℝ) := Real.rpow_pos_of_pos (by norm_num) _
  have hb : 3.1615e-4 < (10 : ℝ) ^ (-3.5 : ℝ) ∧ (10 : ℝ) ^ (-3.5 : ℝ) < 3.1625e-4 :=
    koren_med (p := -7) (q := 2) (by norm_num) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  refine ⟨by constructor <;> intro h <;> linarith, (definicija 10 _ 8.5 (by norm_num) (by norm_num)
    (div_pos hI h12)).trans eq_comm, ?_, ?_, hb, ⟨by linarith [hb.1], by linarith [hb.2]⟩⟩
  · rw [div_eq_iff h12.ne']; constructor <;> intro h <;> linarith
  · rw [← Real.rpow_add (by norm_num)]; norm_num

/-- Predpostavke trditve `matura2c` se dajo izpolniti (I = 10^(−3,5)). -/
example : (0 : ℝ) < 10 ^ (-3.5 : ℝ) := Real.rpow_pos_of_pos (by norm_num) _

/-- Predpostavke trditve `matura2c` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 10 ^ (-3.5 : ℝ) := Real.rpow_pos_of_pos (by norm_num) _
  matura2c (hI := w)

/-- Za maturo, naloga 3 a)–c) in RAČUN (r = log₂ 3): log₂ 18 = 1 + 2r, log₂(9/16) = 2r − 4, log₃ 2 = 1/r,
log₂ 12 = 2 + r, log₁₈ 12 = (2 + r)/(1 + 2r), log₈ √27 = (3/2·r)/3 = r/2.
trditev: MAT-SS-2/logaritem#matura3abc
besedilo: »$\log_{18} 12 = \dfrac{\log_2 12}{\log_2 18} = \dfrac{\log_2 (2^2 \cdot 3)}{1 + 2r} = \dfrac{2 + r}{1 + 2r}$« -/
theorem matura3abc :
    Real.logb 2 18 = 1 + 2 * Real.logb 2 3 ∧ Real.logb 2 (9 / 16) = 2 * Real.logb 2 3 - 4 ∧
    Real.logb 3 2 = 1 / Real.logb 2 3 ∧ Real.logb 2 12 = 2 + Real.logb 2 3 ∧
    Real.logb 18 12 = Real.logb 2 12 / Real.logb 2 18 ∧
    Real.logb 18 12 = (2 + Real.logb 2 3) / (1 + 2 * Real.logb 2 3) ∧
    Real.logb 2 (Real.sqrt 27) = 3 / 2 * Real.logb 2 3 ∧
    Real.logb 8 (Real.sqrt 27) = (3 / 2 * Real.logb 2 3) / 3 ∧
    Real.logb 8 (Real.sqrt 27) = Real.logb 2 3 / 2 := by
  have l2 : Real.logb 2 2 = 1 := Real.logb_self_eq_one (by norm_num)
  have l4 : Real.logb 2 4 = 2 := by
    rw [show (4 : ℝ) = 2 ^ (2 : ℝ) by norm_num, log_pot 2 2 (by norm_num) (by norm_num)]
  have l8 : Real.logb 2 8 = 3 := by
    rw [show (8 : ℝ) = 2 ^ (3 : ℝ) by norm_num, log_pot 2 3 (by norm_num) (by norm_num)]
  have l16 : Real.logb 2 16 = 4 := by
    rw [show (16 : ℝ) = 2 ^ (4 : ℝ) by norm_num, log_pot 2 4 (by norm_num) (by norm_num)]
  have l9 : Real.logb 2 9 = 2 * Real.logb 2 3 := by
    rw [show (9 : ℝ) = 3 ^ 2 by norm_num, Real.logb_pow]; push_cast; ring
  have l18 : Real.logb 2 18 = 1 + 2 * Real.logb 2 3 := by
    rw [show (18 : ℝ) = 2 * 9 by norm_num, Real.logb_mul (by norm_num) (by norm_num), l2, l9]
  have l12 : Real.logb 2 12 = 2 + Real.logb 2 3 := by
    rw [show (12 : ℝ) = 4 * 3 by norm_num, Real.logb_mul (by norm_num) (by norm_num), l4]
  have ls : Real.logb 2 (Real.sqrt 27) = 3 / 2 * Real.logb 2 3 := by
    rw [Real.sqrt_eq_rpow, show (27 : ℝ) = 3 ^ (3 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num),
      (pravila 2 3 1 _ (by norm_num) (by norm_num) (by norm_num) (by norm_num)).2.2.1]
    norm_num
  have h18 := (prehod 18 12 2 (by norm_num) (by norm_num) (by positivity) (by norm_num) (by positivity)).1
  have h8 := (prehod 8 (Real.sqrt 27) 2 (by norm_num) (by norm_num) (by positivity) (by norm_num) (by positivity)).1
  refine ⟨l18, ?_, ?_, l12, h18, by rw [h18, l12, l18], ls, by rw [h8, ls, l8], by rw [h8, ls, l8]; ring⟩
  · rw [Real.logb_div (by norm_num) (by norm_num), l9, l16]
  · rw [← Real.inv_logb, inv_eq_one_div]

/-- Za maturo, naloga 3 d) in RAČUN: log₂ 3·log₃ 4·log₄ 5·log₅ 6·log₆ 7·log₇ 8 = log 8/log 2 = log₂ 8 = 3
(vsak števec se okrajša z naslednjim imenovalcem).
trditev: MAT-SS-2/logaritem#matura3d
besedilo: »d) Produkt je $\dfrac{\log 3}{\log 2} \cdot \dfrac{\log 4}{\log 3} \cdot \dfrac{\log 5}{\log 4} \cdot \dfrac{\log 6}{\log 5} \cdot \dfrac{\log 7}{\log 6} \cdot \dfrac{\log 8}{\log 7}$. Vsak števec se okrajša z imenovalcem naslednjega faktorja.« -/
theorem matura3d :
    Real.logb 2 3 * Real.logb 3 4 * Real.logb 4 5 * Real.logb 5 6 * Real.logb 6 7 * Real.logb 7 8 =
      Real.log 8 / Real.log 2 ∧ Real.log 8 / Real.log 2 = 3 := by
  have hp : ∀ x : ℝ, 1 < x → Real.log x ≠ 0 := fun x hx => (Real.log_pos hx).ne'
  have h3 := hp 3 (by norm_num)
  have h4 := hp 4 (by norm_num)
  have h5 := hp 5 (by norm_num)
  have h6 := hp 6 (by norm_num)
  have h7 := hp 7 (by norm_num)
  have h2 := hp 2 (by norm_num)
  constructor
  · simp only [Real.logb]; field_simp
  · rw [Real.log_div_log, show (8 : ℝ) = 2 ^ (3 : ℝ) by norm_num, log_pot 2 3 (by norm_num) (by norm_num)]

/-- Za maturo, naloga 3 e) in RAČUN: oznaki 3 in 12 ležita pri r in 2 + r; sredina (r + (2 + r))/2 = 1 + r
= log₂ 2 + log₂ 3 = log₂ 6 (oznaka števila 6, ne (3 + 12)/2 = 7,5).
trditev: MAT-SS-2/logaritem#matura3e
besedilo: »e) Sredina med oznakama leži $\dfrac{r + (2 + r)}{2} = 1 + r$ centimetrov desno od oznake števila $1$. Ker je $1 + r = \log_2 2 + \log_2 3 = \log_2 6$, je tam oznaka števila $6$, ne aritmetične sredine $\dfrac{3 + 12}{2} = 7{,}5$.« -/
theorem matura3e :
    (Real.logb 2 3 + Real.logb 2 12) / 2 = 1 + Real.logb 2 3 ∧
    1 + Real.logb 2 3 = Real.logb 2 6 ∧ ((3 : ℝ) + 12) / 2 = 7.5 ∧ (7.5 : ℝ) ≠ 6 := by
  have l12 := (matura3abc).2.2.2.1
  refine ⟨by rw [l12]; ring, ?_, by norm_num, by norm_num⟩
  rw [show (6 : ℝ) = 2 * 3 by norm_num, Real.logb_mul (by norm_num) (by norm_num),
    Real.logb_self_eq_one (by norm_num)]

/-! ## Drugače -/

/-- Drugače, na sliki: tabela potenc 2ˣ za x = −2, …, 5 brana nazaj (log₂ 16 = 4), 4 < 5 < 8, zato
2 < log₂ 5 < 3; prebrana abscisa ≈ 2,32.
trditev: MAT-SS-2/logaritem#na-sliki
besedilo: »Če bereš od leve proti desni, potenciraš. Če bereš od desne proti levi, logaritmiraš: levo od $16$ piše eksponent $4$, zato je $\log_2 16 = 4$. Število $5$ v desnem stolpcu manjka, leži med $4$ in $8$, zato je $\log_2 5$ med $2$ in $3$.« -/
theorem na_sliki :
    (2 : ℝ) ^ (-2 : ℝ) = 1 / 4 ∧ (2 : ℝ) ^ (-1 : ℝ) = 1 / 2 ∧ (2 : ℝ) ^ (0 : ℝ) = 1 ∧
    (2 : ℝ) ^ (1 : ℝ) = 2 ∧ (2 : ℝ) ^ (2 : ℝ) = 4 ∧ (2 : ℝ) ^ (3 : ℝ) = 8 ∧ (2 : ℝ) ^ (4 : ℝ) = 16 ∧
    (2 : ℝ) ^ (5 : ℝ) = 32 ∧ Real.logb 2 16 = 4 ∧
    (2 < Real.logb 2 5 ∧ Real.logb 2 5 < 3) ∧ (2.315 < Real.logb 2 5 ∧ Real.logb 2 5 < 2.325) := by
  have h := (log2_5).2.2.1
  refine ⟨by norm_num [Real.rpow_neg], by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, (matura1).2.2.1, ⟨by linarith [h.1], by linarith [h.2]⟩,
    ⟨by linarith [h.1], by linarith [h.2]⟩⟩

/-- Drugače, iz vsakdanjega življenja: pH = −log c: pri c = 10⁻³ je pH = 3, pri c = 10⁻⁷ je pH = 7;
pH 3 ima 10-krat večjo c kot pH 4; podvojitev jakosti doda 10 log 2 ≈ 3 dB,
log(2I/I₀) = log 2 + log(I/I₀).
trditev: MAT-SS-2/logaritem#vsakdanje
besedilo: »$\log \dfrac{2I}{I_0} = \log 2 + \log \dfrac{I}{I_0}$« -/
theorem vsakdanje (I : ℝ) (hI : 0 < I) :
    -Real.logb 10 ((10 : ℝ) ^ (-3 : ℝ)) = 3 ∧ -Real.logb 10 ((10 : ℝ) ^ (-7 : ℝ)) = 7 ∧
    (10 : ℝ) ^ (-3 : ℝ) / (10 : ℝ) ^ (-4 : ℝ) = 10 ∧
    (2.5 < 10 * Real.logb 10 2 ∧ 10 * Real.logb 10 2 < 3.5) ∧
    Real.logb 10 (2 * I / (10 : ℝ) ^ (-12 : ℝ)) = Real.logb 10 2 + Real.logb 10 (I / (10 : ℝ) ^ (-12 : ℝ)) := by
  have h12 : (0 : ℝ) < (10 : ℝ) ^ (-12 : ℝ) := Real.rpow_pos_of_pos (by norm_num) _
  obtain ⟨g1, g2⟩ := lg2
  refine ⟨by rw [log_pot 10 _ (by norm_num) (by norm_num)]; norm_num,
    by rw [log_pot 10 _ (by norm_num) (by norm_num)]; norm_num, ?_, ⟨by linarith, by linarith⟩, ?_⟩
  · rw [← Real.rpow_sub (by norm_num)]; norm_num
  · rw [mul_div_assoc, Real.logb_mul (by norm_num) (div_pos hI h12).ne']

/-- Predpostavke trditve `vsakdanje` se dajo izpolniti (I = 1). -/
example : (0 : ℝ) < 1 := by norm_num

/-- Predpostavke trditve `vsakdanje` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 1 := by norm_num
  vsakdanje (hI := w)

/-- Drugače, korak za korakom: za x, y, z > 0 je logₐ(x³√y/z²) = logₐ(x³√y) − logₐ z²
= logₐ x³ + logₐ √y − logₐ z² = 3 logₐ x + (1/2) logₐ y − 2 logₐ z.
trditev: MAT-SS-2/logaritem#razcleni
besedilo: »Potence: $\sqrt{y} = y^{\frac{1}{2}}$, zato dobimo $3\log_a x + \dfrac{1}{2}\log_a y - 2\log_a z$.« -/
theorem razcleni (a x y z : ℝ) (hx : 0 < x) (hy : 0 < y) (hz : 0 < z) :
    Real.logb a (x ^ 3 * Real.sqrt y / z ^ 2) = Real.logb a (x ^ 3 * Real.sqrt y) - Real.logb a (z ^ 2) ∧
    Real.logb a (x ^ 3 * Real.sqrt y) - Real.logb a (z ^ 2) =
      Real.logb a (x ^ 3) + Real.logb a (Real.sqrt y) - Real.logb a (z ^ 2) ∧
    Real.logb a (x ^ 3) + Real.logb a (Real.sqrt y) - Real.logb a (z ^ 2) =
      3 * Real.logb a x + 1 / 2 * Real.logb a y - 2 * Real.logb a z := by
  have hs : 0 < Real.sqrt y := Real.sqrt_pos.mpr hy
  refine ⟨Real.logb_div (by positivity) (by positivity), by rw [Real.logb_mul (by positivity) hs.ne'], ?_⟩
  rw [Real.logb_pow, Real.logb_pow, Real.sqrt_eq_rpow, show Real.logb a (y ^ (1 / 2 : ℝ)) = 1 / 2 * Real.logb a y by
    rw [Real.logb, Real.log_rpow hy, Real.logb]; ring]
  push_cast; ring

/-- Predpostavke trditve `razcleni` se dajo izpolniti (x = y = z = 2). -/
example : (0 : ℝ) < 2 := by norm_num

/-- Predpostavke trditve `razcleni` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 := by norm_num
  razcleni (hx := w) (hy := w) (hz := w)

/-- Drugače, korak za korakom: log₃ 20 = log 20/log 3, log 20 ≈ 1,30103, log 3 ≈ 0,47712,
1,30103/0,47712 ≈ 2,7268; 3² = 9 < 20 < 27 = 3³, zato 2 < log₃ 20 < 3; ln 20 ≈ 2,99573, ln 3 ≈ 1,09861,
2,99573/1,09861 ≈ 2,7268 (tudi log₃ 20 ≈ 2,7268).
trditev: MAT-SS-2/logaritem#log3-20
besedilo: »$\dfrac{\ln 20}{\ln 3} \approx \dfrac{2{,}99573}{1{,}09861} \approx 2{,}7268$.« -/
theorem log3_20 :
    Real.logb 3 20 = Real.logb 10 20 / Real.logb 10 3 ∧
    (1.301025 < Real.logb 10 20 ∧ Real.logb 10 20 < 1.301035) ∧
    (0.477115 < Real.logb 10 3 ∧ Real.logb 10 3 < 0.477125) ∧
    (2.72675 < (1.30103 : ℝ) / 0.47712 ∧ (1.30103 : ℝ) / 0.47712 < 2.72685) ∧
    (2 < Real.logb 3 20 ∧ Real.logb 3 20 < 3) ∧
    (2.995725 < Real.log 20 ∧ Real.log 20 < 2.995735) ∧
    (1.098605 < Real.log 3 ∧ Real.log 3 < 1.098615) ∧
    (2.72675 < (2.99573 : ℝ) / 1.09861 ∧ (2.99573 : ℝ) / 1.09861 < 2.72685) ∧
    (2.72675 < Real.logb 3 20 ∧ Real.logb 3 20 < 2.72685) := by
  have l20 : Real.log 20 = 2 * Real.log 2 + Real.log 5 := by
    rw [show (20 : ℝ) = 2 ^ 2 * 5 by norm_num, Real.log_mul (by norm_num) (by norm_num), Real.log_pow]
    push_cast; ring
  have lg20 : Real.logb 10 20 = 1 + Real.logb 10 2 := by
    rw [show (20 : ℝ) = 10 * 2 by norm_num, Real.logb_mul (by norm_num) (by norm_num),
      Real.logb_self_eq_one (by norm_num)]
  obtain ⟨a1, a2⟩ := ln2
  obtain ⟨c1, c2⟩ := ln5
  obtain ⟨d1, d2⟩ := ln3
  obtain ⟨g1, g2⟩ := lg2
  obtain ⟨h1, h2⟩ := lg3
  have b1 : 2.995731 < Real.log 20 := by linarith
  have b2 : Real.log 20 < 2.995733 := by linarith
  have q := kvocient (by norm_num) (by norm_num) b1 b2 d1 d2
  refine ⟨(prehod 3 20 10 (by norm_num) (by norm_num) (by positivity) (by norm_num) (by positivity)).2.1, by rw [lg20]; constructor <;> linarith,
    ⟨by linarith, by linarith⟩, by norm_num, ?_, ⟨by linarith, by linarith⟩, ⟨by linarith, by linarith⟩,
    by norm_num, ?_⟩
  · rw [Real.logb]; constructor <;> linarith [q.1, q.2]
  · rw [Real.logb]; constructor <;> linarith [q.1, q.2]

/-- Drugače, bolj natančno: za a > 0, a ≠ 1 in b > 0 obstaja natanko en x z aˣ = b (to je logₐ b);
pri osnovi 1 je 1ˣ = b rešljiva le pri b = 1, in to s poljubnim x.
trditev: MAT-SS-2/logaritem#dobro-definiran
besedilo: »Za $a = 1$ bi bila enačba $1^x = b$ rešljiva le pri $b = 1$, in to s poljubnim $x$, zato osnova $1$ ni dovoljena.« -/
theorem dobro_definiran (a b : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (hb : 0 < b) :
    (∃! x : ℝ, a ^ x = b) ∧ (∀ c : ℝ, (∃ x : ℝ, (1 : ℝ) ^ x = c) ↔ c = 1) ∧
    ∀ x : ℝ, (1 : ℝ) ^ x = 1 := by
  refine ⟨⟨Real.logb a b, Real.rpow_logb ha ha1 hb, fun y hy => ?_⟩, fun c => ?_, Real.one_rpow⟩
  · have hy' : a ^ y = b := hy
    rw [← definicija a b y ha ha1 hb] at hy'; exact hy'.symm
  · constructor
    · rintro ⟨x, hx⟩; rw [Real.one_rpow] at hx; exact hx.symm
    · intro h; exact ⟨0, by rw [h, Real.one_rpow]⟩

/-- Predpostavke trditve `dobro_definiran` se dajo izpolniti (a = 2, b = 5). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 5 := by norm_num

/-- Predpostavke trditve `dobro_definiran` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 5 := by norm_num
  dobro_definiran (ha := w.1) (ha1 := w.2.1) (hb := w.2.2)

/-- Drugače, bolj natančno: dokaz pravila za potenco (u = logₐ x, x = aᵘ, xⁿ = a^(nu), logₐ xⁿ = nu) in
kvocient kot x·y⁻¹: logₐ(x/y) = logₐ(x·y⁻¹) = logₐ x − logₐ y.
trditev: MAT-SS-2/logaritem#dokaz-potence
besedilo: »Pravilo za kvocient dobimo iz pravil za produkt in potenco: $\log_a \dfrac{x}{y} = \log_a \left(x \cdot y^{-1}\right) = \log_a x - \log_a y$.« -/
theorem dokaz_potence (a x y n : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (hx : 0 < x) (hy : 0 < y) :
    x ^ n = a ^ (n * Real.logb a x) ∧ Real.logb a (x ^ n) = n * Real.logb a x ∧
    Real.logb a (x / y) = Real.logb a (x * y⁻¹) ∧ Real.logb a (x * y⁻¹) = Real.logb a x - Real.logb a y := by
  have h1 : x ^ n = a ^ (n * Real.logb a x) := by
    rw [mul_comm, Real.rpow_mul ha.le, Real.rpow_logb ha ha1 hx]
  refine ⟨h1, by rw [h1, log_pot a _ ha ha1], by rw [div_eq_mul_inv], ?_⟩
  rw [Real.logb_mul hx.ne' (inv_ne_zero hy.ne'), Real.logb_inv]; ring

/-- Predpostavke trditve `dokaz_potence` se dajo izpolniti (a = 2, x = 4, y = 8). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 4 ∧ (0 : ℝ) < 8 := by norm_num

/-- Predpostavke trditve `dokaz_potence` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 4 ∧ (0 : ℝ) < 8 := by norm_num
  dokaz_potence (ha := w.1) (ha1 := w.2.1) (hx := w.2.2.1) (hy := w.2.2.2)

/-- Drugače, bolj natančno: logₐ b = 1/log_b a; log_(aᵏ) b = (1/k)·logₐ b (a > 0, a ≠ 1, k ≠ 0);
log₄ 8 = (1/2)·log₂ 8 = 3/2; logₐ b = (1/log_c a)·log_c b.
trditev: MAT-SS-2/logaritem#posledice
besedilo: »Prav tako velja $\log_{a^k} b = \dfrac{1}{k}\log_a b$, na primer $\log_4 8 = \dfrac{1}{2}\log_2 8 = \dfrac{3}{2}$, kar se ujema s Primerom 1.« -/
theorem posledice (a b c k : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (hb : 0 < b) (hb1 : b ≠ 1) (hk : k ≠ 0)
    (hc : 0 < c) (hc1 : c ≠ 1) :
    Real.logb a b = 1 / Real.logb b a ∧
    Real.logb (a ^ k) b = 1 / k * Real.logb a b ∧
    Real.logb 4 8 = 1 / 2 * Real.logb 2 8 ∧ (1 / 2 : ℝ) * Real.logb 2 8 = 3 / 2 ∧
    Real.logb a b = 1 / Real.logb c a * Real.logb c b := by
  have _h := hb1
  have hlc : Real.log c ≠ 0 := by
    intro h; rcases Real.log_eq_zero.mp h with h | h | h <;> [linarith; exact hc1 h; linarith]
  have h4 : Real.logb 4 8 = 1 / 2 * Real.logb 2 8 := by
    rw [show (4 : ℝ) = 2 ^ (2 : ℝ) by norm_num]
    simp only [Real.logb]
    rw [Real.log_rpow (by norm_num)]; ring
  refine ⟨?_, ?_, h4,
    (by rw [(obratna 2 8 (by norm_num) (by norm_num) (by norm_num) (by norm_num)).2.1]; norm_num), ?_⟩
  · rw [one_div, Real.inv_logb]
  · simp only [Real.logb]; rw [Real.log_rpow ha]; field_simp
  · rw [(prehod a b c hc hc1 ha ha1 hb).1]; ring

/-- Predpostavke trditve `posledice` se dajo izpolniti (a = 2, b = 8, k = 2, c = 10). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 8 ∧ (8 : ℝ) ≠ 1 ∧ (2 : ℝ) ≠ 0 ∧ (0 : ℝ) < 10 ∧
    (10 : ℝ) ≠ 1 := by norm_num

/-! ## Preveri se -/

/-- Predpostavke trditve `posledice` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 8 ∧ (8 : ℝ) ≠ 1 ∧ (2 : ℝ) ≠ 0 ∧ (0 : ℝ) < 10 ∧ (10 : ℝ) ≠ 1 := by norm_num
  posledice (ha := w.1) (ha1 := w.2.1) (hb := w.2.2.1) (hb1 := w.2.2.2.1) (hk := w.2.2.2.2.1) (hc := w.2.2.2.2.2.1) (hc1 := w.2.2.2.2.2.2)

/-- Preveri se 1: log(xy) = log x + log y (x, y > 0); protiprimeri: log 20 ≠ log 10 + log 10,
log 100/log 10 = 2 ≠ log 10 = 1, (log 1000)² = 9 ≠ 2 log 1000 = 6.
trditev: MAT-SS-2/logaritem#kviz1
besedilo: »Kvocient logaritmov je po prehodu na novo osnovo $\log_y x$, ne logaritem kvocienta: $\dfrac{\log 100}{\log 10} = 2$, $\log 10 = 1$.« -/
theorem kviz1 (x y : ℝ) (hx : 0 < x) (hy : 0 < y) :
    Real.logb 10 (x * y) = Real.logb 10 x + Real.logb 10 y ∧
    Real.logb 10 20 ≠ Real.logb 10 10 + Real.logb 10 10 ∧
    Real.logb 10 100 / Real.logb 10 10 ≠ Real.logb 10 (100 / 10) ∧
    (Real.logb 10 1000) ^ 2 ≠ 2 * Real.logb 10 1000 := by
  have hn := napake 10 (by norm_num) (by norm_num)
  refine ⟨Real.logb_mul hx.ne' hy.ne', hn.2.1, ?_, ?_⟩
  · rw [hn.2.2.1, hn.2.2.2.1]; norm_num
  · rw [hn.2.2.2.2.2.2.2.1]
    have l1000 : Real.logb 10 1000 = 3 := by
      rw [show (1000 : ℝ) = 10 ^ (3 : ℝ) by norm_num, log_pot 10 3 (by norm_num) (by norm_num)]
    rw [l1000]; norm_num

/-- Predpostavke trditve `kviz1` se dajo izpolniti (x = y = 10). -/
example : (0 : ℝ) < 10 := by norm_num

/-- Predpostavke trditve `kviz1` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 10 := by norm_num
  kviz1 (hx := w) (hy := w)

/-- Preveri se 2: log₂ 12 − log₂ 3 = log₂(12/3) = log₂ 4 = 2 (ne log₂ 9 in ne log₂ 36).
trditev: MAT-SS-2/logaritem#kviz2
besedilo: »$\log_2 \dfrac{12}{3} = \log_2 4 = 2$« -/
theorem kviz2 : Real.logb 2 12 - Real.logb 2 3 = Real.logb 2 (12 / 3) ∧ Real.logb 2 (12 / 3) = 2 ∧
    Real.logb 2 9 ≠ 2 ∧ Real.logb 2 36 ≠ 2 := by
  have l4 : Real.logb 2 4 = 2 := by
    rw [show (4 : ℝ) = 2 ^ (2 : ℝ) by norm_num, log_pot 2 2 (by norm_num) (by norm_num)]
  have ne : ∀ y : ℝ, 0 < y → y ≠ 4 → Real.logb 2 y ≠ 2 := by
    intro y hy h4 h
    rw [definicija 2 y 2 (by norm_num) (by norm_num) hy] at h
    apply h4; rw [← h]; norm_num
  refine ⟨(Real.logb_div (by norm_num) (by norm_num)).symm,
    by rw [show (12 / 3 : ℝ) = 4 by norm_num]; exact l4,
    ne 9 (by norm_num) (by norm_num), ne 36 (by norm_num) (by norm_num)⟩

/-- Preveri se 3: log₃(9·27) = log₃ 9 + log₃ 27 = 2 + 3 = 5 (3⁵ = 243 = 9·27), ne log₃ 9·log₃ 27 = 6
(3⁶ = 729).
trditev: MAT-SS-2/logaritem#kviz3
besedilo: »$\log_3 (9 \cdot 27) = \log_3 9 + \log_3 27 = 2 + 3 = 5$; res je $3^5 = 243 = 9 \cdot 27$.« -/
theorem kviz3 : Real.logb 3 (9 * 27) = Real.logb 3 9 + Real.logb 3 27 ∧ Real.logb 3 9 = 2 ∧
    Real.logb 3 27 = 3 ∧ Real.logb 3 (9 * 27) = 5 ∧ (3 : ℝ) ^ 5 = 243 ∧ (9 : ℝ) * 27 = 243 ∧
    (3 : ℝ) ^ 6 = 729 ∧ Real.logb 3 9 * Real.logb 3 27 = 6 := by
  have l9 : Real.logb 3 9 = 2 := by
    rw [show (9 : ℝ) = 3 ^ (2 : ℝ) by norm_num, log_pot 3 2 (by norm_num) (by norm_num)]
  have l27 : Real.logb 3 27 = 3 := by
    rw [show (27 : ℝ) = 3 ^ (3 : ℝ) by norm_num, log_pot 3 3 (by norm_num) (by norm_num)]
  have hm : Real.logb 3 (9 * 27) = Real.logb 3 9 + Real.logb 3 27 := Real.logb_mul (by norm_num) (by norm_num)
  refine ⟨hm, l9, l27, by rw [hm, l9, l27]; norm_num, by norm_num, by norm_num, by norm_num,
    by rw [l9, l27]; norm_num⟩

/-- Preveri se 4: 2² < 7 < 2³ in 3¹ < 7 < 3², zato 2 < log₂ 7 < 3 in 1 < log₃ 7 < 2, torej log₂ 7 > log₃ 7;
log₂ 7 ≈ 2,807, log₃ 7 ≈ 1,771; log₂ 4 = 2, log₄ 4 = 1.
trditev: MAT-SS-2/logaritem#kviz4
besedilo: »$\log_2 7$ je med $2$ in $3$, $\log_3 7$ pa med $1$ in $2$. Prehod na novo osnovo: $\log_2 7 \approx 2{,}807$, $\log_3 7 \approx 1{,}771$.« -/
theorem kviz4 :
    Real.logb 3 7 < Real.logb 2 7 ∧ (2 < Real.logb 2 7 ∧ Real.logb 2 7 < 3) ∧
    (1 < Real.logb 3 7 ∧ Real.logb 3 7 < 2) ∧
    (2.8065 < Real.logb 2 7 ∧ Real.logb 2 7 < 2.8075) ∧
    (1.7705 < Real.logb 3 7 ∧ Real.logb 3 7 < 1.7715) ∧
    Real.logb 2 4 = 2 ∧ Real.logb 4 4 = 1 := by
  obtain ⟨a1, a2⟩ := ln2
  obtain ⟨d1, d2⟩ := ln3
  obtain ⟨s1, s2⟩ := ln7
  have q2 := kvocient (by norm_num) (by norm_num) s1 s2 a1 a2
  have q3 := kvocient (by norm_num) (by norm_num) s1 s2 d1 d2
  have b2 : 2.8065 < Real.logb 2 7 ∧ Real.logb 2 7 < 2.8075 := by
    rw [Real.logb]; constructor <;> linarith [q2.1, q2.2]
  have b3 : 1.7705 < Real.logb 3 7 ∧ Real.logb 3 7 < 1.7715 := by
    rw [Real.logb]; constructor <;> linarith [q3.1, q3.2]
  refine ⟨by linarith [b2.1, b3.2], ⟨by linarith [b2.1], by linarith [b2.2]⟩,
    ⟨by linarith [b3.1], by linarith [b3.2]⟩, b2, b3, ?_, Real.logb_self_eq_one (by norm_num)⟩
  rw [show (4 : ℝ) = 2 ^ (2 : ℝ) by norm_num, log_pot 2 2 (by norm_num) (by norm_num)]

/-- Preveri se 5: če je −log c₁ = 4,6 in −log c₂ = 5,6 (c₁, c₂ > 0), je log(c₁/c₂) = 1 in c₁/c₂ = 10.
trditev: MAT-SS-2/logaritem#kviz5
besedilo: »Naj bo $c_1$ koncentracija v kislem, $c_2$ pa v čistem dežju: $\log c_1 - \log c_2 = -4{,}6 + 5{,}6 = 1$, torej $\log \dfrac{c_1}{c_2} = 1$ in $\dfrac{c_1}{c_2} = 10$.« -/
theorem kviz5 (c₁ c₂ : ℝ) (h1 : 0 < c₁) (h2 : 0 < c₂) (p1 : -Real.logb 10 c₁ = 4.6)
    (p2 : -Real.logb 10 c₂ = 5.6) : Real.logb 10 (c₁ / c₂) = 1 ∧ c₁ / c₂ = 10 := by
  have h : Real.logb 10 (c₁ / c₂) = 1 := by
    rw [Real.logb_div h1.ne' h2.ne']; linarith
  refine ⟨h, ?_⟩
  rw [definicija 10 _ 1 (by norm_num) (by norm_num) (div_pos h1 h2)] at h
  rw [← h]; norm_num

/-- Predpostavke trditve `kviz5` se dajo izpolniti (c₁ = 10^(−4,6), c₂ = 10^(−5,6)). -/
example : ∃ c₁ c₂ : ℝ, 0 < c₁ ∧ 0 < c₂ ∧ -Real.logb 10 c₁ = 4.6 ∧ -Real.logb 10 c₂ = 5.6 :=
  ⟨10 ^ (-4.6 : ℝ), 10 ^ (-5.6 : ℝ), Real.rpow_pos_of_pos (by norm_num) _,
    Real.rpow_pos_of_pos (by norm_num) _, by rw [log_pot 10 _ (by norm_num) (by norm_num)]; norm_num,
    by rw [log_pot 10 _ (by norm_num) (by norm_num)]; norm_num⟩

/-- Predpostavke trditve `kviz5` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ c₁ c₂ : ℝ, 0 < c₁ ∧ 0 < c₂ ∧ -Real.logb 10 c₁ = 4.6 ∧ -Real.logb 10 c₂ = 5.6 :=
    ⟨10 ^ (-4.6 : ℝ), 10 ^ (-5.6 : ℝ), Real.rpow_pos_of_pos (by norm_num) _,
      Real.rpow_pos_of_pos (by norm_num) _, by rw [log_pot 10 _ (by norm_num) (by norm_num)]; norm_num,
      by rw [log_pot 10 _ (by norm_num) (by norm_num)]; norm_num⟩
  kviz5 (h1 := w.choose_spec.choose_spec.1) (h2 := w.choose_spec.choose_spec.2.1) (p1 := w.choose_spec.choose_spec.2.2.1) (p2 := w.choose_spec.choose_spec.2.2.2)

/-- Preveri se 6: ln e⁴ + e^(ln 3) − ln 1 = 4 + 3 − 0 = 7.
trditev: MAT-SS-2/logaritem#kviz6
besedilo: »$\ln \mathrm{e}^4 = 4$, $\mathrm{e}^{\ln 3} = 3$ in $\ln 1 = 0$, zato je vrednost $4 + 3 - 0 = 7$.« -/
theorem kviz6 : Real.log (Real.exp 4) + Real.exp (Real.log 3) - Real.log 1 = 7 := by
  rw [Real.log_exp, Real.exp_log (by norm_num), Real.log_one]; norm_num

/-- Preveri se 7 in RAČUN: 2,1 cm je 2,1/3 = 0,7 dekade; log b = 1 + 0,7 = 1,7, b = 10^1,7 ≈ 50,1 ≈ 50
(linearno branje bi dalo 10 + 0,7·90 = 73).
trditev: MAT-SS-2/logaritem#kviz7
besedilo: »$2{,}1\,\text{cm}$ je $\dfrac{2{,}1}{3} = 0{,}7$ dekade. Točka leži pri $\log b = 1 + 0{,}7 = 1{,}7$, zato je $b = 10^{1{,}7} \approx 50$.« -/
theorem kviz7 : (2.1 : ℝ) / 3 = 0.7 ∧ (1 : ℝ) + 0.7 = 1.7 ∧
    Real.logb 10 ((10 : ℝ) ^ (1.7 : ℝ)) = 1.7 ∧
    (50.05 < (10 : ℝ) ^ (1.7 : ℝ) ∧ (10 : ℝ) ^ (1.7 : ℝ) < 50.15) ∧ (10 : ℝ) + 0.7 * 90 = 73 :=
  ⟨by norm_num, by norm_num, log_pot 10 _ (by norm_num) (by norm_num),
    koren_med (p := 17) (q := 10) (by norm_num) (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    by norm_num⟩

/-- Preveri se 8 in RAČUN: A + B = 7, A + 2B = 11 ⟺ B = 4, A = 3; y(50) = 3 + 4 log 50 ≈ 3 + 4·1,6990 ≈ 9,80;
linearna interpolacija v x bi dala ≈ 8,78.
trditev: MAT-SS-2/logaritem#kviz8
besedilo: »Iz $A + B = 7$ in $A + 2B = 11$ sledi $B = 4$ in $A = 3$. Zato je $y = 3 + 4 \log 50 \approx 3 + 4 \cdot 1{,}6990 \approx 9{,}80$.« -/
theorem kviz8 (A B : ℝ) :
    ((A + B * Real.logb 10 10 = 7 ∧ A + B * Real.logb 10 100 = 11) ↔ (B = 4 ∧ A = 3)) ∧
    (1.69895 < Real.logb 10 50 ∧ Real.logb 10 50 < 1.69905) ∧
    (9.795 < 3 + 4 * Real.logb 10 50 ∧ 3 + 4 * Real.logb 10 50 < 9.805) ∧
    (8.775 < (7 : ℝ) + (50 - 10) / (100 - 10) * (11 - 7) ∧ (7 : ℝ) + (50 - 10) / (100 - 10) * (11 - 7) < 8.785) := by
  have l10 : Real.logb 10 10 = 1 := Real.logb_self_eq_one (by norm_num)
  have l100 : Real.logb 10 100 = 2 := by
    rw [show (100 : ℝ) = 10 ^ (2 : ℝ) by norm_num, log_pot 10 2 (by norm_num) (by norm_num)]
  have l50 : Real.logb 10 50 = 2 - Real.logb 10 2 := by
    rw [show (50 : ℝ) = 100 / 2 by norm_num, Real.logb_div (by norm_num) (by norm_num), l100]
  obtain ⟨g1, g2⟩ := lg2
  rw [l10, l100]
  refine ⟨⟨fun ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩, fun ⟨h1, h2⟩ => ⟨by rw [h1, h2]; norm_num,
    by rw [h1, h2]; norm_num⟩⟩, by rw [l50]; constructor <;> linarith,
    by rw [l50]; constructor <;> linarith, by norm_num⟩

end Evklid.Lekcije.MAT_SS_2.Logaritem
