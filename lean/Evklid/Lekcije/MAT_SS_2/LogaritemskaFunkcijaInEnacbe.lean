/-
vir: content/lessons/MAT-SS-2/logaritemska-funkcija-in-enacbe.md
sha256: 3f18ab43a78a9ad4f47d169f95c2e6b89217cecadb970401d94f7c65fa5a9a54
Ni v Leanu: uvodna zgodba in opis aplikacije; risbe, prepogibanje lista in simulacija (dokazane so
točke, zrcaljenje (x, y) ↦ (y, x) med aˣ in logₐ x in premiki); definicijsko območje kot pojem: v Leanu
je `Real.logb` definiran za vsak x (log 0 = 0, log(−x) = log x), zato so pogoji »logaritmand > 0«
zapisani kot predpostavke oziroma kot del množice rešitev, »os y je asimptota« pa kot: vrednosti blizu
0 so pod vsako mejo; »logaritem 0 ne obstaja« je dokazano kot: noben eksponent ne da 0; »rast se
upočasnjuje« v nalogi 3 d (dokazana sta prirastka 3 in 12 tednov), »raste vse počasneje« v razlagi 9
(dokazano je, da se mora x podvojiti za +1); magnituda potresa, slovarji (besedno); točkovanje; risanje
grafov v nalogi 2 d (dokazane so točke in zrcaljenje).
Dogovori Leana: logₐ je `Real.logb a`, desetiški log je `Real.logb 10`, ln je `Real.log`; aˣ je
`Real.rpow`. »≈ v« pomeni interval pol enote zadnjega mesta okoli v (dokazani sta obe meji).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.LogaritemskaFunkcijaInEnacbe

open Finset Filter Asymptotics

/-! ## Pomožne trditve -/

/-- Pomožno: meje za log(1 − x) iz vrste (|x| < 1, n členov).
pomozno -/
theorem log_vrsta (x : ℝ) (hx : |x| < 1) (n : ℕ) :
    -(∑ i ∈ range n, x ^ (i + 1) / (i + 1)) - |x| ^ (n + 1) / (1 - |x|) ≤ Real.log (1 - x) ∧
    Real.log (1 - x) ≤ -(∑ i ∈ range n, x ^ (i + 1) / (i + 1)) + |x| ^ (n + 1) / (1 - |x|) := by
  have h := Real.abs_log_sub_add_sum_range_le hx n
  rw [abs_le] at h
  constructor <;> linarith [h.1, h.2]

/-- Predpostavke trditve `log_vrsta` se dajo izpolniti (x = 1/5). -/
example : |(1 / 5 : ℝ)| < 1 := by norm_num [abs_of_pos]

/-- Pomožno: 1,609437 < ln 5 < 1,609438.
pomozno -/
theorem ln5 : 1.609437 < Real.log 5 ∧ Real.log 5 < 1.609438 := by
  have h := log_vrsta (1 / 5) (by norm_num [abs_of_pos]) 12
  norm_num [Finset.sum_range_succ, abs_of_pos] at h
  have e : Real.log 5 = 2 * Real.log 2 - Real.log (4 / 5) := by
    rw [Real.log_div (by norm_num) (by norm_num), show (4 : ℝ) = 2 ^ 2 by norm_num, Real.log_pow]
    push_cast; ring
  have l1 := Real.log_two_gt_d9
  have l2 := Real.log_two_lt_d9
  constructor <;> linarith [h.1, h.2]

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

/-- Pomožno: logₐ(aˣ) = x (a > 0, a ≠ 1).
pomozno -/
theorem log_pot (a x : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) : Real.logb a (a ^ x) = x :=
  Real.logb_rpow ha ha1

/-- Predpostavke trditve `log_pot` se dajo izpolniti (a = 2). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 := by norm_num

/-- Pomožno: log₂ 2ⁿ za n = −2, …, 4 in log₃ 3ⁿ za n = 0, 1, 2.
pomozno -/
theorem vrednosti :
    Real.logb 2 (1 / 4) = -2 ∧ Real.logb 2 (1 / 2) = -1 ∧ Real.logb 2 1 = 0 ∧ Real.logb 2 2 = 1 ∧
    Real.logb 2 4 = 2 ∧ Real.logb 2 8 = 3 ∧ Real.logb 2 16 = 4 ∧ Real.logb 2 32 = 5 ∧
    Real.logb 3 1 = 0 ∧ Real.logb 3 3 = 1 ∧ Real.logb 3 9 = 2 := by
  have lp : ∀ k : ℝ, Real.logb 2 ((2 : ℝ) ^ k) = k := fun k => log_pot 2 k (by norm_num) (by norm_num)
  have lp3 : ∀ k : ℝ, Real.logb 3 ((3 : ℝ) ^ k) = k := fun k => log_pot 3 k (by norm_num) (by norm_num)
  refine ⟨?_, ?_, Real.logb_one, Real.logb_self_eq_one (by norm_num), ?_, ?_, ?_, ?_, Real.logb_one,
    Real.logb_self_eq_one (by norm_num), ?_⟩
  · rw [show (1 / 4 : ℝ) = 2 ^ (-2 : ℝ) by norm_num [Real.rpow_neg], lp]
  · rw [show (1 / 2 : ℝ) = 2 ^ (-1 : ℝ) by norm_num, lp]
  · rw [show (4 : ℝ) = 2 ^ (2 : ℝ) by norm_num, lp]
  · rw [show (8 : ℝ) = 2 ^ (3 : ℝ) by norm_num, lp]
  · rw [show (16 : ℝ) = 2 ^ (4 : ℝ) by norm_num, lp]
  · rw [show (32 : ℝ) = 2 ^ (5 : ℝ) by norm_num, lp]
  · rw [show (9 : ℝ) = 3 ^ (2 : ℝ) by norm_num, lp3]

/-- Pomožno: za a > 0, a ≠ 1, A > 0 je logₐ A = c ⟺ A = a^c.
pomozno -/
theorem v_potenco (a A c : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (hA : 0 < A) :
    Real.logb a A = c ↔ A = a ^ c := by
  rw [Real.logb_eq_iff_rpow_eq ha ha1 hA, eq_comm]

/-- Predpostavke trditve `v_potenco` se dajo izpolniti (a = 2, A = 8). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 8 := by norm_num

/-! ## Razlaga 1 in 2 -/

/-- Razlaga 1, tabela: log₂(ν/440) pri ν = 110, 220, 440, 880, 1760 je −2, −1, 0, 1, 2; premisli:
3520 : 440 = 8 = 2³, torej 3 oktave; frekvence 0 ne da nobeno število oktav (440·2ˣ > 0).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#oktave
besedilo: »Ker je $3520 : 440 = 8 = 2^3$, je ton $3$ oktave nad A. Pri $0 \mathrm{Hz}$ ni nobenega odgovora: potenca $2^x$ je vedno pozitivna, zato nobeno število oktav ne da frekvence $0$. Logaritem števila $0$ (in negativnega števila) ne obstaja.« -/
theorem oktave :
    Real.logb 2 (110 / 440) = -2 ∧ Real.logb 2 (220 / 440) = -1 ∧ Real.logb 2 (440 / 440) = 0 ∧
    Real.logb 2 (880 / 440) = 1 ∧ Real.logb 2 (1760 / 440) = 2 ∧ (3520 : ℝ) / 440 = 8 ∧
    (8 : ℝ) = 2 ^ 3 ∧ Real.logb 2 (3520 / 440) = 3 ∧ (¬ ∃ x : ℝ, 440 * (2 : ℝ) ^ x = 0) := by
  obtain ⟨v1, v2, v3, v4, v5, v6, -⟩ := vrednosti
  refine ⟨by rw [show (110 / 440 : ℝ) = 1 / 4 by norm_num]; exact v1,
    by rw [show (220 / 440 : ℝ) = 1 / 2 by norm_num]; exact v2,
    by rw [show (440 / 440 : ℝ) = 1 by norm_num]; exact v3,
    by rw [show (880 / 440 : ℝ) = 2 by norm_num]; exact v4,
    by rw [show (1760 / 440 : ℝ) = 4 by norm_num]; exact v5, by norm_num, by norm_num,
    by rw [show (3520 / 440 : ℝ) = 8 by norm_num]; exact v6, ?_⟩
  rintro ⟨x, hx⟩
  have := Real.rpow_pos_of_pos (show (0 : ℝ) < 2 by norm_num) x
  linarith

/-- Razlaga 2, tabela: log₂ x pri x = 1/2, 1, 2, 4, 8 je −1, 0, 1, 2, 3; točka (2, 4) grafa 2ˣ preide v
(4, 2) grafa log₂ x; obratni funkciji: logₐ aˣ = x in a^(logₐ x) = x (x > 0); splošno je (x, y) na grafu
aˣ natanko tedaj, ko je (y, x) na grafu logₐ (zrcaljenje čez y = x).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#obratni
besedilo: »Funkciji, ki druga drugi »izničita« učinek, imenujemo **obratni (inverzni) funkciji**: velja $\log_a a^x = x$ in $a^{\log_a x} = x$ za $x > 0$. Grafa obratnih funkcij sta vedno zrcalna čez premico $y = x$.« -/
theorem obratni (a x : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (hx : 0 < x) :
    (2 : ℝ) ^ (2 : ℝ) = 4 ∧ Real.logb 2 4 = 2 ∧
    Real.logb a (a ^ x) = x ∧ a ^ (Real.logb a x) = x ∧
    (∀ u v : ℝ, 0 < v → (a ^ u = v ↔ Real.logb a v = u)) := by
  refine ⟨by norm_num, (vrednosti).2.2.2.2.1, log_pot a x ha ha1, Real.rpow_logb ha ha1 hx,
    fun u v hv => (Real.logb_eq_iff_rpow_eq ha ha1 hv).symm⟩

/-- Predpostavke trditve `obratni` se dajo izpolniti (a = 2, x = 4). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 4 := by norm_num

/-! ## Razlaga 3 in 4: definicija in lastnosti -/

/-- Predpostavke trditve `obratni` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 4 := by norm_num
  obratni (ha := w.1) (ha1 := w.2.1) (hx := w.2.2)

/-- Razlaga 3 (Povzetek): zaloga vrednosti logₐ na (0, ∞) je ℝ: za vsak y obstaja x > 0 z logₐ x = y.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#zaloga
besedilo: »Njena **zaloga vrednosti** je $Z_f = \mathbb{R}$: logaritem je lahko poljubno realno število.« -/
theorem zaloga (a : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (y : ℝ) : ∃ x : ℝ, 0 < x ∧ Real.logb a x = y :=
  ⟨a ^ y, Real.rpow_pos_of_pos ha y, log_pot a y ha ha1⟩

/-- Predpostavke trditve `zaloga` se dajo izpolniti (a = 2). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 := by norm_num

/-- Predpostavke trditve `zaloga` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 := by norm_num
  zaloga (ha := w.1) (ha1 := w.2)

/-- Razlaga 4: logₐ za a > 1 na (0, ∞) strogo narašča; edina ničla je x = 1, graf gre skozi (a, 1);
logₐ x < 0 ⟺ x ∈ (0, 1), logₐ x > 0 ⟺ x ∈ (1, ∞).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#lastnosti-vecja
besedilo: »| graf | narašča | pada | | ničla | $x = 1$ | $x = 1$ | | točka | $(a, 1)$ | $(a, 1)$ | | asimptota | $x = 0$ | $x = 0$ | | $f(x) < 0$ | $(0, 1)$ | $(1, \infty)$ | | $f(x) > 0$ | $(1, \infty)$ | $(0, 1)$ |« -/
theorem lastnosti_vecja (a : ℝ) (ha : 1 < a) :
    StrictMonoOn (Real.logb a) (Set.Ioi 0) ∧ Real.logb a 1 = 0 ∧ Real.logb a a = 1 ∧
    (∀ x : ℝ, 0 < x → (Real.logb a x = 0 ↔ x = 1)) ∧
    (∀ x : ℝ, 0 < x → (Real.logb a x < 0 ↔ x < 1)) ∧
    (∀ x : ℝ, 0 < x → (0 < Real.logb a x ↔ 1 < x)) := by
  have hmono : StrictMonoOn (Real.logb a) (Set.Ioi 0) := fun x hx y hy h =>
    (Real.logb_lt_logb_iff ha hx hy).mpr h
  refine ⟨hmono, Real.logb_one, Real.logb_self_eq_one ha, fun x hx => ?_, fun x hx => ?_, fun x hx => ?_⟩
  · rw [v_potenco a x 0 (by linarith) ha.ne' hx, Real.rpow_zero]
  · rw [← Real.logb_one (b := a)]; exact Real.logb_lt_logb_iff ha hx one_pos
  · rw [← Real.logb_one (b := a)]; exact Real.logb_lt_logb_iff ha one_pos hx

/-- Predpostavke trditve `lastnosti_vecja` se dajo izpolniti (a = 2). -/
example : (1 : ℝ) < 2 := by norm_num

/-- Predpostavke trditve `lastnosti_vecja` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ) < 2 := by norm_num
  lastnosti_vecja (ha := w)

/-- Razlaga 4: log_(1/a) x = −logₐ x (a > 0, a ≠ 1, x > 0), zato sta grafa simetrična glede na os x;
iz aʸ = x sledi (1/a)^(−y) = x.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#simetrija
besedilo: »Grafa funkcij $y = \log_a x$ in $y = \log_{\frac{1}{a}} x$ sta simetrična glede na os $x$, ker je $\log_{\frac{1}{a}} x = -\log_a x$: iz $a^y = x$ sledi $\left(\frac{1}{a}\right)^{-y} = x$.« -/
theorem simetrija (a x y : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (hx : 0 < x) :
    Real.logb (1 / a) x = -Real.logb a x ∧ (a ^ y = x → (1 / a) ^ (-y) = x) := by
  have _h := And.intro ha1 hx
  refine ⟨by rw [Real.logb, Real.logb, one_div, Real.log_inv, div_neg], fun h => ?_⟩
  rw [one_div, Real.inv_rpow ha.le, Real.rpow_neg ha.le, inv_inv, h]

/-- Predpostavke trditve `simetrija` se dajo izpolniti (a = 2, x = 8). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 8 := by norm_num

/-- Predpostavke trditve `simetrija` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 8 := by norm_num
  simetrija (ha := w.1) (ha1 := w.2.1) (hx := w.2.2)

/-- Razlaga 4 in ustno vprašanje 2: za 0 < a < 1 logₐ na (0, ∞) strogo pada, edina ničla je x = 1,
graf gre skozi (a, 1); logₐ x > 0 ⟺ x ∈ (0, 1), logₐ x < 0 ⟺ x ∈ (1, ∞).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#lastnosti-manjsa
besedilo: »Funkcija je strogo padajoča. Njena edina ničla je $x = 1$, graf pa gre tudi skozi točko $(a, 1)$. Os $y$ je navpična asimptota grafa. Funkcija je pozitivna na intervalu $(0, 1)$ in negativna na intervalu $(1, \infty)$.« -/
theorem lastnosti_manjsa (a : ℝ) (h0 : 0 < a) (h1 : a < 1) :
    StrictAntiOn (Real.logb a) (Set.Ioi 0) ∧ Real.logb a 1 = 0 ∧ Real.logb a a = 1 ∧
    (∀ x : ℝ, 0 < x → (Real.logb a x = 0 ↔ x = 1)) ∧
    (∀ x : ℝ, 0 < x → (0 < Real.logb a x ↔ x < 1)) ∧
    (∀ x : ℝ, 0 < x → (Real.logb a x < 0 ↔ 1 < x)) := by
  have hb : 1 < 1 / a := by rw [lt_div_iff₀ h0]; linarith
  have hs : ∀ x, Real.logb a x = -Real.logb (1 / a) x := by
    intro x
    rw [Real.logb, Real.logb, one_div, Real.log_inv, div_neg, neg_neg]
  obtain ⟨m, -, -, z, n, p⟩ := lastnosti_vecja (1 / a) hb
  refine ⟨fun x hx y hy h => ?_, Real.logb_one, ?_, fun x hx => ?_, fun x hx => ?_, fun x hx => ?_⟩
  · rw [hs, hs]; exact neg_lt_neg (m hx hy h)
  · have : Real.log a ≠ 0 := (Real.log_neg h0 h1).ne
    rw [Real.logb, div_self this]
  · rw [hs, neg_eq_zero]; exact z x hx
  · rw [hs, neg_pos]; exact n x hx
  · rw [hs, neg_lt_zero]; exact p x hx

/-- Predpostavke trditve `lastnosti_manjsa` se dajo izpolniti (a = 1/2). -/
example : (0 : ℝ) < 1 / 2 ∧ (1 / 2 : ℝ) < 1 := by norm_num

/-- Predpostavke trditve `lastnosti_manjsa` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 1 / 2 ∧ (1 / 2 : ℝ) < 1 := by norm_num
  lastnosti_manjsa (h0 := w.1) (h1 := w.2)

/-- Razlaga 4 (navpična asimptota in neomejenost): pri a > 1 je za vsak M logₐ x < M na (0, a^M), graf pa
ni navzgor omejen; log₂ x = 10 natanko pri x = 1024.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#asimptota
besedilo: »Os $y$ je **navpična asimptota**: pri $a > 1$ se graf, ko gre $x$ proti $0$, spušča neomejeno navzdol in se osi $y$ približuje, a je nikoli ne doseže. Osi $y$ graf ne seka, ker $0$ ni v definicijskem območju. Za $x > 1$ graf pri $a > 1$ narašča vse počasneje, a ni navzgor omejen: $\log_2 x = 10$ doseže šele pri $x = 1024$.« -/
theorem asimptota (a : ℝ) (ha : 1 < a) :
    (∀ M : ℝ, ∃ δ > 0, ∀ x, 0 < x → x < δ → Real.logb a x < M) ∧
    (∀ M : ℝ, ∃ x > 0, M < Real.logb a x) ∧
    (∀ x : ℝ, 0 < x → (Real.logb 2 x = 10 ↔ x = 1024)) := by
  have ha0 : 0 < a := by linarith
  refine ⟨fun M => ⟨a ^ M, Real.rpow_pos_of_pos ha0 M, fun x hx hxd => ?_⟩,
    fun M => ⟨a ^ (M + 1), Real.rpow_pos_of_pos ha0 _, ?_⟩, fun x hx => ?_⟩
  · have := (Real.logb_lt_logb_iff ha hx (Real.rpow_pos_of_pos ha0 M)).mpr hxd
    rwa [log_pot a M ha0 ha.ne'] at this
  · rw [log_pot a _ ha0 ha.ne']; linarith
  · rw [v_potenco 2 x 10 (by norm_num) (by norm_num) hx]; norm_num

/-- Predpostavke trditve `asimptota` se dajo izpolniti (a = 2). -/
example : (1 : ℝ) < 2 := by norm_num

/-- Predpostavke trditve `asimptota` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ) < 2 := by norm_num
  asimptota (ha := w)

/-- Razlaga 4 (tabela, 0 < a < 1): tudi tu je os y navpična asimptota: za vsak M je logₐ x > M na
(0, a^M); graf ni navzdol omejen.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#asimptota-manjsa
besedilo: »Os $y$ je navpična asimptota grafa.« -/
theorem asimptota_manjsa (a : ℝ) (h0 : 0 < a) (h1 : a < 1) :
    (∀ M : ℝ, ∃ δ > 0, ∀ x, 0 < x → x < δ → M < Real.logb a x) ∧
    (∀ M : ℝ, ∃ x > 0, Real.logb a x < M) := by
  have ha1 : a ≠ 1 := h1.ne
  refine ⟨fun M => ⟨a ^ M, Real.rpow_pos_of_pos h0 M, fun x hx hxd => ?_⟩,
    fun M => ⟨a ^ (M - 1), Real.rpow_pos_of_pos h0 _, ?_⟩⟩
  · have := (Real.logb_lt_logb_iff_of_base_lt_one h0 h1 (Real.rpow_pos_of_pos h0 M) hx).mpr hxd
    rwa [log_pot a M h0 ha1] at this
  · rw [log_pot a _ h0 ha1]; linarith

/-- Predpostavke trditve `asimptota_manjsa` se dajo izpolniti (a = 1/2). -/
example : (0 : ℝ) < 1 / 2 ∧ (1 / 2 : ℝ) < 1 := by norm_num

/-- Predpostavke trditve `asimptota_manjsa` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 1 / 2 ∧ (1 / 2 : ℝ) < 1 := by norm_num
  asimptota_manjsa (h0 := w.1) (h1 := w.2)

/-- Razlaga 4: pri a > 1 logₐ x (tudi za x > 1) narašča vse počasneje: logₐ je strogo konkavna na
(0, ∞) (in zato tudi na (1, ∞)).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#vse-pocasneje
besedilo: »Za $x > 1$ graf pri $a > 1$ narašča vse počasneje,« -/
theorem vse_pocasneje (a : ℝ) (ha : 1 < a) :
    StrictConcaveOn ℝ (Set.Ioi 0) (Real.logb a) ∧ StrictConcaveOn ℝ (Set.Ioi 1) (Real.logb a) := by
  have hla : 0 < Real.log a := Real.log_pos ha
  have h : StrictConcaveOn ℝ (Set.Ioi 0) (Real.logb a) := by
    refine ⟨convex_Ioi 0, fun x hx y hy hxy s t hs ht hst => ?_⟩
    have hc := strictConcaveOn_log_Ioi.2 hx hy hxy hs ht hst
    simp only [smul_eq_mul] at hc ⊢
    simp only [Real.logb]
    rw [lt_div_iff₀ hla]
    have e : (s * (Real.log x / Real.log a) + t * (Real.log y / Real.log a)) * Real.log a =
        s * Real.log x + t * Real.log y := by field_simp
    rw [e]; exact hc
  exact ⟨h, h.subset (fun x (hx : 1 < x) => (show (0 : ℝ) < x by linarith)) (convex_Ioi 1)⟩

/-- Predpostavke trditve `vse_pocasneje` se dajo izpolniti (a = 2). -/
example : (1 : ℝ) < 2 := by norm_num

/-! ## Razlaga 5: premiki in raztegi -/

/-- Predpostavke trditve `vse_pocasneje` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ) < 2 := by norm_num
  vse_pocasneje (ha := w)

/-- Razlaga 5: g(x) = logₐ(x − p) + q: pogoj x − p > 0 ⟺ x > p (asimptota x = p, D = (p, ∞)); točka (1, 0)
preide v (1 + p, q) (a > 0, a ≠ 1).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#premik
besedilo: »definicijsko območje je $(p, \infty)$, ker mora veljati $x - p > 0$, - točka $(1, 0)$ preide v $(1 + p, q)$.« -/
theorem premik (a p q x : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) :
    (0 < x - p ↔ p < x) ∧ Real.logb a ((1 + p) - p) + q = q := by
  have _h := And.intro ha ha1
  refine ⟨sub_pos, ?_⟩
  rw [add_sub_cancel_right, Real.logb_one, zero_add]

/-- Predpostavke trditve `premik` se dajo izpolniti (a = 2). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 := by norm_num

/-- Predpostavke trditve `premik` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 := by norm_num
  premik (ha := w.1) (ha1 := w.2)

/-- Razlaga 5, premisli: log₂(x + 3) = log₂(x − (−3)), asimptota x = −3, točka (1, 0) preide v (−2, 0):
log₂(−2 + 3) = log₂ 1 = 0.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#premik-levo
besedilo: »Asimptota je $x = -3$, točka $(1, 0)$ pa preide v $(-2, 0)$. Tu je $p = -3$, ker je $x + 3 = x - (-3)$, zato se graf premakne za $3$ v levo. Preizkus: $\log_2 (-2 + 3) = \log_2 1 = 0$.« -/
theorem premik_levo (x : ℝ) : x + 3 = x - (-3) ∧ Real.logb 2 (-2 + 3) = 0 ∧ (0 < x + 3 ↔ -3 < x) := by
  refine ⟨by ring, by norm_num, by constructor <;> intro h <;> linarith⟩

/-- Razlaga 5 (raztegi): c·logₐ x preslika (x, y) v (x, cy): ničla x = 1 ostane, (a, 1) preide v (a, c);
log₄ x = (1/2)·log₂ x (4ʸ = x ⟹ 2^(2y) = x).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#raztegi
besedilo: »Ničla $x = 1$, asimptota $x = 0$ in $D_g = (0, \infty)$ ostanejo, točka $(a, 1)$ pa preide v $(a, c)$. Na primer $y = \log_4 x$ je graf $y = \log_2 x$, v smeri osi $y$ skrčen s faktorjem $\frac{1}{2}$, ker iz $4^y = x$ sledi $2^{2y} = x$.« -/
theorem raztegi (a c x : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) :
    c * Real.logb a 1 = 0 ∧ c * Real.logb a a = c ∧ Real.logb 4 x = 1 / 2 * Real.logb 2 x ∧
    ∀ y : ℝ, (4 : ℝ) ^ y = (2 : ℝ) ^ (2 * y) := by
  have haa : Real.logb a a = 1 := by have := log_pot a 1 ha ha1; rwa [Real.rpow_one] at this
  refine ⟨by rw [Real.logb_one, mul_zero], by rw [haa, mul_one], ?_, fun y => ?_⟩
  · rw [show (4 : ℝ) = 2 ^ (2 : ℝ) by norm_num]
    simp only [Real.logb]
    rw [Real.log_rpow (by norm_num)]; ring
  · rw [show (4 : ℝ) = 2 ^ (2 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]

/-- Predpostavke trditve `raztegi` se dajo izpolniti (a = 2). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 := by norm_num

/-- Predpostavke trditve `raztegi` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 := by norm_num
  raztegi (ha := w.1) (ha1 := w.2)

/-- Razlaga 5 in Povzetek: logₐ(kx) = logₐ k + logₐ x (k, x > 0); log₂(4x) = 2 + log₂ x; ničla
logₐ(kx) je x = 1/k (a > 0, a ≠ 1): edina pozitivna rešitev logₐ(kx) = 0.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#skrcitev
besedilo: »Pri logaritmu pa je $\log_a (kx) = \log_a k + \log_a x$, zato je to hkrati premik za $\log_a k$ v smeri osi $y$: graf $y = \log_2 (4x)$ je graf $y = \log_2 x$, premaknjen za $2$ navzgor. Asimptota $x = 0$ ostane, ničla pa je $x = \frac{1}{k}$.« -/
theorem skrcitev (a k x : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (hk : 0 < k) (hx : 0 < x) :
    Real.logb a (k * x) = Real.logb a k + Real.logb a x ∧
    Real.logb 2 (4 * x) = 2 + Real.logb 2 x ∧ Real.logb a (k * (1 / k)) = 0 ∧
    ∀ z : ℝ, 0 < z → (Real.logb a (k * z) = 0 ↔ z = 1 / k) := by
  refine ⟨Real.logb_mul hk.ne' hx.ne', ?_, ?_, fun z hz => ?_⟩
  · rw [Real.logb_mul (by norm_num) hx.ne', (vrednosti).2.2.2.2.1]
  · rw [mul_one_div_cancel hk.ne', Real.logb_one]
  · rw [v_potenco a (k * z) 0 ha ha1 (mul_pos hk hz), Real.rpow_zero, eq_div_iff hk.ne', mul_comm]

/-- Predpostavke trditve `skrcitev` se dajo izpolniti (a = 2, k = 4, x = 1). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 4 ∧ (0 : ℝ) < 1 := by norm_num

/-! ## Razlaga 6–8 -/

/-- Predpostavke trditve `skrcitev` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 4 ∧ (0 : ℝ) < 1 := by norm_num
  skrcitev (ha := w.1) (ha1 := w.2.1) (hk := w.2.2.1) (hx := w.2.2.2)

/-- Razlaga 6: 6 − 2x > 0 ⟺ x < 3; x² − x − 6 = (x − 3)(x + 2) > 0 ⟺ x < −2 ali x > 3.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#definicijsko
besedilo: »Za $f(x) = \log_3 (6 - 2x)$ rešimo neenačbo $6 - 2x > 0$ in dobimo $x < 3$, torej $D_f = (-\infty, 3)$. Če je pod logaritmom kvadratni izraz, rešimo kvadratno neenačbo. Pri $\log (x^2 - x - 6)$ ima izraz $(x - 3)(x + 2)$ ničli $-2$ in $3$; parabola je odprta navzgor, zato je izraz pozitiven zunaj ničel in $D = (-\infty, -2) \cup (3, \infty)$.« -/
theorem definicijsko (x : ℝ) : (0 < 6 - 2 * x ↔ x < 3) ∧ x ^ 2 - x - 6 = (x - 3) * (x + 2) ∧
    (0 < x ^ 2 - x - 6 ↔ x < -2 ∨ 3 < x) := by
  refine ⟨by constructor <;> intro h <;> linarith, by ring, ?_⟩
  constructor
  · intro h
    by_contra hc
    push Not at hc
    nlinarith [hc.1, hc.2]
  · rintro (h | h) <;> nlinarith

/-- Razlaga 7 (Povzetek, Ponovitev): za a > 0, a ≠ 1 in A, B > 0: logₐ A = c ⟺ A = a^c,
logₐ A = logₐ B ⟺ A = B, logₐ A + logₐ B = logₐ(A·B).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#tipi
besedilo: »$\log_a A = c$: po definiciji zapišemo $A = a^c$. - $\log_a A = \log_a B$: sklepamo $A = B$. - Več logaritmov z isto osnovo: s pravili jih **združimo** v en logaritem, na primer $\log_a A + \log_a B = \log_a (A \cdot B)$« -/
theorem tipi (a A B c : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (hA : 0 < A) (hB : 0 < B) :
    (Real.logb a A = c ↔ A = a ^ c) ∧ (Real.logb a A = Real.logb a B ↔ A = B) ∧
    Real.logb a A + Real.logb a B = Real.logb a (A * B) := by
  refine ⟨v_potenco a A c ha ha1 hA, ⟨fun h => ?_, fun h => by rw [h]⟩,
    (Real.logb_mul hA.ne' hB.ne').symm⟩
  rw [← Real.rpow_logb ha ha1 hA, h, Real.rpow_logb ha ha1 hB]

/-- Predpostavke trditve `tipi` se dajo izpolniti (a = 2, A = 4, B = 8). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 4 ∧ (0 : ℝ) < 8 := by norm_num

/-- Predpostavke trditve `tipi` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 4 ∧ (0 : ℝ) < 8 := by norm_num
  tipi (ha := w.1) (ha1 := w.2.1) (hA := w.2.2.1) (hB := w.2.2.2)

/-- Razlaga 8: pri x = −7 sta x + 3 = −4 in x − 1 = −8 negativna, produkt (−4)(−8) = 32 pa pozitiven.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#razsiritev
besedilo: »v Primeru 2 je produkt $(x + 3)(x - 1)$ pri $x = -7$ pozitiven, čeprav sta oba faktorja negativna« -/
theorem razsiritev : (-7 : ℝ) + 3 < 0 ∧ (-7 : ℝ) - 1 < 0 ∧ ((-7 : ℝ) + 3) * ((-7 : ℝ) - 1) = 32 := by
  norm_num

/-! ## Razlaga 9: rast -/

/-- Pomožno: za naravna n je n + 1 ≤ 2ⁿ.
pomozno -/
theorem nat_dve (n : ℕ) : (n : ℝ) + 1 ≤ 2 ^ n := by
  induction n with
  | zero => norm_num
  | succ k ih => push_cast; rw [pow_succ]; linarith [one_le_pow₀ (show (1 : ℝ) ≤ 2 by norm_num) (n := k)]

/-- Razlaga 9 (in Povzetek): za vsak x > 0 je log₂ x < x < 2ˣ.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#log-x-pot
besedilo: »Zato za vsak $x > 0$ velja $\log_2 x < x < 2^x$.« -/
theorem log_x_pot (x : ℝ) (hx : 0 < x) : Real.logb 2 x < x ∧ x < (2 : ℝ) ^ x := by
  have h2 : x < (2 : ℝ) ^ x := by
    set n := ⌊x⌋₊ with hn
    have h1 : x < n + 1 := Nat.lt_floor_add_one x
    have h2 : (n : ℝ) ≤ x := Nat.floor_le hx.le
    have h3 : (2 : ℝ) ^ (n : ℝ) ≤ (2 : ℝ) ^ x :=
      Real.rpow_le_rpow_of_exponent_le (by norm_num) h2
    rw [Real.rpow_natCast] at h3
    linarith [nat_dve n]
  refine ⟨?_, h2⟩
  have := (Real.logb_lt_logb_iff (show (1 : ℝ) < 2 by norm_num) hx (Real.rpow_pos_of_pos (by norm_num) x)).mpr h2
  rwa [log_pot 2 x (by norm_num) (by norm_num)] at this

/-- Predpostavke trditve `log_x_pot` se dajo izpolniti (x = 1). -/
example : (0 : ℝ) < 1 := by norm_num

/-- Predpostavke trditve `log_x_pot` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 1 := by norm_num
  log_x_pot (hx := w)

/-- Razlaga 9, tabela: log₂ 1, 2, 4, 8, 16 = 0, 1, 2, 3, 4 in 2¹, 2², 2⁴, 2⁸, 2¹⁶ = 2, 4, 16, 256, 65536;
2^(x+1) = 2·2ˣ, log₂(2x) = 1 + log₂ x (x > 0).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#rast-tabela
besedilo: »| $1$ | $0$ | $2$ | | $2$ | $1$ | $4$ | | $4$ | $2$ | $16$ | | $8$ | $3$ | $256$ | | $16$ | $4$ | $65\,536$ | Ko se $x$ poveča za $1$, se $2^x$ **podvoji**. Da se $\log_2 x$ poveča za $1$, pa se mora $x$ **podvojiti**.« -/
theorem rast_tabela (x : ℝ) (hx : 0 < x) :
    (2 : ℝ) ^ (1 : ℝ) = 2 ∧ (2 : ℝ) ^ (2 : ℝ) = 4 ∧ (2 : ℝ) ^ (4 : ℝ) = 16 ∧ (2 : ℝ) ^ (8 : ℝ) = 256 ∧
    (2 : ℝ) ^ (16 : ℝ) = 65536 ∧ Real.logb 2 16 = 4 ∧
    (2 : ℝ) ^ (x + 1) = 2 * (2 : ℝ) ^ x ∧ Real.logb 2 (2 * x) = 1 + Real.logb 2 x := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, (vrednosti).2.2.2.2.2.2.1,
    by rw [Real.rpow_add (by norm_num), Real.rpow_one]; ring, ?_⟩
  rw [Real.logb_mul (by norm_num) hx.ne', Real.logb_self_eq_one (by norm_num)]

/-- Predpostavke trditve `rast_tabela` se dajo izpolniti (x = 1). -/
example : (0 : ℝ) < 1 := by norm_num

/-- Predpostavke trditve `rast_tabela` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 1 := by norm_num
  rast_tabela (hx := w)

set_option exponentiation.threshold 1100 in
/-- Razlaga 9 in RAČUN: 2ˣ = 1000 ⟺ x = log₂ 1000 ≈ 9,97; log₂ x = 1000 ⟺ x = 2¹⁰⁰⁰ (x > 0), ki ima 302
števki (10³⁰¹ ≤ 2¹⁰⁰⁰ < 10³⁰²); 1000·log 2 ≈ 301,03; pri x = 2²⁰ je log₂ x = 20, √x = 1024.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#rast-stevila
besedilo: »Vrednost $1000$ doseže $2^x$ že pri $x \approx 9{,}97$, $\log_2 x$ pa šele pri $x = 2^{1000}$, številu s $302$ števkami.« -/
theorem rast_stevila :
    (∀ x : ℝ, (2 : ℝ) ^ x = 1000 ↔ x = Real.logb 2 1000) ∧
    (9.965 < Real.logb 2 1000 ∧ Real.logb 2 1000 < 9.975) ∧
    (9.9655 < Real.logb 2 1000 ∧ Real.logb 2 1000 < 9.966) ∧
    (∀ x : ℝ, 0 < x → (Real.logb 2 x = 1000 ↔ x = (2 : ℝ) ^ (1000 : ℝ))) ∧
    ((10 : ℕ) ^ 301 ≤ 2 ^ 1000 ∧ (2 : ℕ) ^ 1000 < 10 ^ 302) ∧
    (301.025 < 1000 * Real.logb 10 2 ∧ 1000 * Real.logb 10 2 < 301.035) ∧
    Real.logb 2 ((2 : ℝ) ^ (20 : ℝ)) = 20 ∧ Real.sqrt ((2 : ℝ) ^ (20 : ℝ)) = 1024 := by
  have l1 := Real.log_two_gt_d9
  have l2 := Real.log_two_lt_d9
  obtain ⟨c1, c2⟩ := ln5
  have e10 : Real.log 10 = Real.log 2 + Real.log 5 := by
    rw [← Real.log_mul (by norm_num) (by norm_num)]; norm_num
  have e1000 : Real.log 1000 = 3 * Real.log 10 := by
    rw [show (1000 : ℝ) = 10 ^ 3 by norm_num, Real.log_pow]; push_cast; ring
  have q := kvocient (a := Real.log 1000) (b := Real.log 2) (by norm_num) (by norm_num)
    (show 6.9077523 < Real.log 1000 by rw [e1000, e10]; linarith)
    (show Real.log 1000 < 6.9077556 by rw [e1000, e10]; linarith) l1 l2
  have q2 := kvocient (a := Real.log 2) (b := Real.log 10) (by norm_num) (by norm_num) l1 l2
    (show 2.3025841 < Real.log 10 by rw [e10]; linarith) (show Real.log 10 < 2.3025852 by rw [e10]; linarith)
  refine ⟨fun x => ?_, ?_, ?_, fun x hx => v_potenco 2 x 1000 (by norm_num) (by norm_num) hx,
    by norm_num, ?_, log_pot 2 _ (by norm_num) (by norm_num), ?_⟩
  · rw [eq_comm (a := x), Real.logb_eq_iff_rpow_eq (by norm_num) (by norm_num) (by norm_num)]
  · rw [Real.logb]; constructor <;> linarith [q.1, q.2]
  · rw [Real.logb]; constructor <;> linarith [q.1, q.2]
  · rw [Real.logb]; constructor <;> nlinarith [q2.1, q2.2]
  · rw [show (2 : ℝ) ^ (20 : ℝ) = 1024 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Razlaga 9 (zahtevnejši trditvi): logₐ x (a > 1) in ln x sčasoma zaostaneta za √x
(logₐ x = o(x^(1/2)), ln x = o(x^(1/2))), aˣ (a > 1) pa sčasoma prehiti vsako potenco xⁿ (xⁿ = o(aˣ)).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#asimptotika
besedilo: »Za vsako osnovo $a > 1$ velja še več: $a^x$ sčasoma prehiti vsako potenco $x^n$, $\log_a x$ pa sčasoma zaostane celo za $\sqrt{x}$ (pri $x = 2^{20}$ je $\log_2 x = 20$, $\sqrt{x} = 1024$).« -/
theorem asimptotika (a : ℝ) (ha : 1 < a) (n : ℕ) :
    (fun x : ℝ => Real.logb a x) =o[atTop] (fun x : ℝ => x ^ (1 / 2 : ℝ)) ∧
    (fun x : ℝ => Real.log x) =o[atTop] (fun x : ℝ => x ^ (1 / 2 : ℝ)) ∧
    (fun x : ℝ => x ^ n) =o[atTop] (fun x : ℝ => a ^ x) := by
  have hl := isLittleO_log_rpow_atTop (show (0 : ℝ) < 1 / 2 by norm_num)
  refine ⟨?_, hl, ?_⟩
  · refine (hl.const_mul_left (1 / Real.log a)).congr_left fun x => ?_
    rw [Real.logb]; ring
  have h := isLittleO_pow_exp_pos_mul_atTop n (Real.log_pos ha)
  refine h.congr_right fun x => ?_
  rw [Real.rpow_def_of_pos (by linarith)]

/-- Predpostavke trditve `asimptotika` se dajo izpolniti (a = 2). -/
example : (1 : ℝ) < 2 := by norm_num

/-! ## Primer 1 -/

/-- Predpostavke trditve `asimptotika` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ) < 2 := by norm_num
  asimptotika (ha := w)

/-- Primer 1: f(x) = log₃(x − 2) + 1: pogoj x − 2 > 0 ⟺ x > 2; za x > 2 je f(x) = 0 ⟺ log₃(x − 2) = −1
⟺ x − 2 = 3⁻¹ = 1/3 ⟺ x = 7/3; x = 0 ni v D (0 − 2 < 0); f(3) = log₃ 1 + 1 = 1, f(5) = log₃ 3 + 1 = 2,
f(11) = log₃ 9 + 1 = 3; f na (2, ∞) strogo narašča.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#primer1
besedilo: »Logaritmand mora biti pozitiven: $x - 2 > 0$, torej $x > 2$ in $D_f = (2, \infty)$. 2. Asimptota je navpična premica $x = 2$. 3. Ničla: $\log_3 (x - 2) + 1 = 0$, torej $\log_3 (x - 2) = -1$. Po definiciji je $x - 2 = 3^{-1} = \dfrac{1}{3}$ in $x = \dfrac{7}{3}$. 4. Presečišča z osjo $y$ ni, ker $x = 0$ ni v definicijskem območju. 5. Vrednosti: $f(3) = \log_3 1 + 1 = 1$, $f(5) = \log_3 3 + 1 = 2$, $f(11) = \log_3 9 + 1 = 3$. 6. Ker je $a = 3 > 1$, funkcija strogo narašča.« -/
theorem primer1 :
    (∀ x : ℝ, 0 < x - 2 ↔ 2 < x) ∧
    (∀ x : ℝ, 2 < x → (Real.logb 3 (x - 2) + 1 = 0 ↔ x = 7 / 3)) ∧ (0 : ℝ) - 2 < 0 ∧
    Real.logb 3 ((3 : ℝ) - 2) + 1 = 1 ∧ Real.logb 3 ((5 : ℝ) - 2) + 1 = 2 ∧
    Real.logb 3 ((11 : ℝ) - 2) + 1 = 3 ∧
    StrictMonoOn (fun x => Real.logb 3 (x - 2) + 1) (Set.Ioi 2) := by
  obtain ⟨-, -, -, -, -, -, -, -, w1, w3, w9⟩ := vrednosti
  refine ⟨fun x => sub_pos, fun x hx => ?_, by norm_num, by norm_num, ?_, ?_, fun x hx y hy h => ?_⟩
  · calc Real.logb 3 (x - 2) + 1 = 0 ↔ Real.logb 3 (x - 2) = -1 := by
          constructor <;> intro h <;> linarith
      _ ↔ x - 2 = (3 : ℝ) ^ (-1 : ℝ) := v_potenco 3 _ _ (by norm_num) (by norm_num) (by linarith)
      _ ↔ x - 2 = 1 / 3 := by norm_num
      _ ↔ x = 7 / 3 := by constructor <;> intro h <;> linarith
  · rw [show (5 : ℝ) - 2 = 3 by norm_num, w3]; norm_num
  · rw [show (11 : ℝ) - 2 = 9 by norm_num, w9]; norm_num
  · have hx' : (0 : ℝ) < x - 2 := sub_pos.mpr hx
    have hy' : (0 : ℝ) < y - 2 := sub_pos.mpr hy
    have := (Real.logb_lt_logb_iff (show (1 : ℝ) < 3 by norm_num) hx' hy').mpr (by linarith)
    show Real.logb 3 (x - 2) + 1 < Real.logb 3 (y - 2) + 1
    linarith

/-! ## Primer 2 -/

/-- Primer 2: log₂(x + 3) + log₂(x − 1) = 5 s pogojema x + 3 > 0, x − 1 > 0 (torej x > 1)
⟺ log₂((x + 3)(x − 1)) = 5 ⟺ (x + 3)(x − 1) = 2⁵ = 32 ⟺ x² + 2x − 35 = 0 ⟺ (x + 7)(x − 5) = 0
⟺ x = 5 (x = −7 ne ustreza pogoju).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#primer2
besedilo: »Odgovor: enačba ima eno rešitev, $x = 5$.« -/
theorem primer2 (x : ℝ) :
    (0 < x + 3 ∧ 0 < x - 1 ∧ Real.logb 2 (x + 3) + Real.logb 2 (x - 1) = 5) ↔ x = 5 := by
  constructor
  · rintro ⟨h1, h2, h⟩
    have e1 : Real.logb 2 ((x + 3) * (x - 1)) = 5 := by
      rw [Real.logb_mul h1.ne' h2.ne']; exact h
    have e2 : (x + 3) * (x - 1) = (2 : ℝ) ^ (5 : ℝ) :=
      (v_potenco 2 _ 5 (by norm_num) (by norm_num) (mul_pos h1 h2)).mp e1
    have e3 : (x + 3) * (x - 1) = 32 := by rw [e2]; norm_num
    have e4 : x ^ 2 + 2 * x - 35 = 0 := by nlinarith
    have e5 : (x + 7) * (x - 5) = 0 := by nlinarith
    rcases mul_eq_zero.mp e5 with h7 | h5
    · linarith
    · linarith
  · rintro rfl
    refine ⟨by norm_num, by norm_num, ?_⟩
    rw [show (5 : ℝ) + 3 = 8 by norm_num, show (5 : ℝ) - 1 = 4 by norm_num, (vrednosti).2.2.2.2.2.1,
      (vrednosti).2.2.2.2.1]
    norm_num

/-- Primer 2, račun: (x + 3)(x − 1) = x² + 2x − 3; x² + 2x − 35 = (x + 7)(x − 5); preizkus
log₂ 8 + log₂ 4 = 3 + 2 = 5.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#primer2-racun
besedilo: »Odpravimo oklepaje: $x^2 + 2x - 3 = 32$, torej $x^2 + 2x - 35 = 0$. 5. Razcepimo: $(x + 7)(x - 5) = 0$, zato je $x_1 = 5$ in $x_2 = -7$. 6. Pogoj $x > 1$ izpolnjuje le $x = 5$. Pri $x = -7$ bi bil $\log_2 (-4)$, ki ni definiran. 7. Preizkus: $\log_2 8 + \log_2 4 = 3 + 2 = 5$.« -/
theorem primer2_racun (x : ℝ) : (x + 3) * (x - 1) = x ^ 2 + 2 * x - 3 ∧
    x ^ 2 + 2 * x - 35 = (x + 7) * (x - 5) ∧ Real.logb 2 8 + Real.logb 2 4 = 3 + 2 := by
  refine ⟨by ring, by ring, by rw [(vrednosti).2.2.2.2.2.1, (vrednosti).2.2.2.2.1]⟩

/-! ## Primer 3: uglaševalnik -/

/-- Primer 3 a): 110/440 = 1/4 = 2⁻², log₂(1/4) = −2, k = 12·(−2) = −24.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#primer3a
besedilo: »Razmerje je $\dfrac{110}{440} = \dfrac{1}{4} = 2^{-2}$, zato je $\log_2 \dfrac{1}{4} = -2$. 3. a) Pomnožimo z $12$: $12 \cdot (-2) = -24$.« -/
theorem primer3a : (110 : ℝ) / 440 = 1 / 4 ∧ (1 / 4 : ℝ) = 2 ^ (-2 : ℝ) ∧
    Real.logb 2 (110 / 440) = -2 ∧ 12 * Real.logb 2 (110 / 440) = -24 := by
  have h := (vrednosti).1
  refine ⟨by norm_num, by norm_num [Real.rpow_neg], by norm_num; exact h, ?_⟩
  rw [show (110 / 440 : ℝ) = 1 / 4 by norm_num, h]; norm_num

/-- Primer 3 b): za ν > 0 je 12 log₂(ν/440) = 7 ⟺ log₂(ν/440) = 7/12 ⟺ ν/440 = 2^(7/12)
⟺ ν = 440·2^(7/12); 2^(7/12) ≈ 1,4983, ν ≈ 659,3 Hz (tudi 440·1,4983 ≈ 659,3).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#primer3b
besedilo: »Enačbo $12 \log_2 \dfrac{\nu}{440} = 7$ delimo z $12$: $\log_2 \dfrac{\nu}{440} = \dfrac{7}{12}$. 5. b) Po definiciji logaritma je $\dfrac{\nu}{440} = 2^{\frac{7}{12}} \approx 1{,}4983$; osnova $2$ se potencira, desna stran je eksponent. 6. b) Pomnožimo s $440$: $\nu \approx 440 \cdot 1{,}4983 \approx 659{,}3\,\mathrm{Hz}$« -/
theorem primer3b (ν : ℝ) (hν : 0 < ν) :
    (12 * Real.logb 2 (ν / 440) = 7 ↔ Real.logb 2 (ν / 440) = 7 / 12) ∧
    (Real.logb 2 (ν / 440) = 7 / 12 ↔ ν / 440 = (2 : ℝ) ^ (7 / 12 : ℝ)) ∧
    (ν / 440 = (2 : ℝ) ^ (7 / 12 : ℝ) ↔ ν = 440 * (2 : ℝ) ^ (7 / 12 : ℝ)) ∧
    (1.49825 < (2 : ℝ) ^ (7 / 12 : ℝ) ∧ (2 : ℝ) ^ (7 / 12 : ℝ) < 1.49835) ∧
    (659.25 < 440 * (2 : ℝ) ^ (7 / 12 : ℝ) ∧ 440 * (2 : ℝ) ^ (7 / 12 : ℝ) < 659.35) ∧
    (659.25 < (440 : ℝ) * 1.4983 ∧ (440 : ℝ) * 1.4983 < 659.35) := by
  have hb : 659.25 / 440 < (2 : ℝ) ^ (7 / 12 : ℝ) ∧ (2 : ℝ) ^ (7 / 12 : ℝ) < 659.35 / 440 :=
    koren_med (p := 7) (q := 12) (by norm_num) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have hc : 1.49825 < (2 : ℝ) ^ (7 / 12 : ℝ) ∧ (2 : ℝ) ^ (7 / 12 : ℝ) < 1.49835 :=
    koren_med (p := 7) (q := 12) (by norm_num) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  refine ⟨by constructor <;> intro h <;> linarith, v_potenco 2 _ _ (by norm_num) (by norm_num)
    (by positivity), by rw [div_eq_iff (by norm_num)]; constructor <;> intro h <;> linarith, hc,
    ⟨by linarith [hb.1], by linarith [hb.2]⟩, by norm_num⟩

/-- Predpostavke trditve `primer3b` se dajo izpolniti (ν = 659,3). -/
example : (0 : ℝ) < 659.3 := by norm_num

/-! ## Primer 4 -/

/-- Predpostavke trditve `primer3b` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 659.3 := by norm_num
  primer3b (hν := w)

/-- Primer 4: za x > 0 je log x³ = 3 log x in (log x)² − log x³ + 2 = 0 ⟺ t² − 3t + 2 = 0 (t = log x)
⟺ (t − 1)(t − 2) = 0 ⟺ log x = 1 ali log x = 2 ⟺ x = 10 ali x = 100.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#primer4
besedilo: »Rešitvi enačbe sta $x = 10$ in $x = 100$.« -/
theorem primer4 (x : ℝ) (hx : 0 < x) :
    Real.logb 10 (x ^ 3) = 3 * Real.logb 10 x ∧
    ((Real.logb 10 x) ^ 2 - Real.logb 10 (x ^ 3) + 2 = 0 ↔ x = 10 ∨ x = 100) := by
  have h3 : Real.logb 10 (x ^ 3) = 3 * Real.logb 10 x := by rw [Real.logb_pow]; push_cast; ring
  refine ⟨h3, ?_⟩
  calc (Real.logb 10 x) ^ 2 - Real.logb 10 (x ^ 3) + 2 = 0
      ↔ (Real.logb 10 x - 1) * (Real.logb 10 x - 2) = 0 := by
        rw [h3, show (Real.logb 10 x - 1) * (Real.logb 10 x - 2) =
          (Real.logb 10 x) ^ 2 - 3 * Real.logb 10 x + 2 by ring]
    _ ↔ Real.logb 10 x = 1 ∨ Real.logb 10 x = 2 := by rw [mul_eq_zero, sub_eq_zero, sub_eq_zero]
    _ ↔ x = (10 : ℝ) ^ (1 : ℝ) ∨ x = (10 : ℝ) ^ (2 : ℝ) := by
        rw [v_potenco 10 x 1 (by norm_num) (by norm_num) hx, v_potenco 10 x 2 (by norm_num) (by norm_num) hx]
    _ ↔ x = 10 ∨ x = 100 := by norm_num

/-- Predpostavke trditve `primer4` se dajo izpolniti (x = 10). -/
example : (0 : ℝ) < 10 := by norm_num

/-- Predpostavke trditve `primer4` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 10 := by norm_num
  primer4 (hx := w)

/-- Primer 4, preizkus: 1² − log 1000 + 2 = 1 − 3 + 2 = 0 in 2² − log 10⁶ + 2 = 4 − 6 + 2 = 0.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#primer4-preizkus
besedilo: »Preizkus za $x = 10$: $1^2 - \log 1000 + 2 = 1 - 3 + 2 = 0$. Za $x = 100$: $2^2 - \log 10^6 + 2 = 4 - 6 + 2 = 0$.« -/
theorem primer4_preizkus : (1 : ℝ) ^ 2 - Real.logb 10 1000 + 2 = 0 ∧
    (2 : ℝ) ^ 2 - Real.logb 10 (10 ^ 6) + 2 = 0 := by
  constructor
  · rw [show (1000 : ℝ) = 10 ^ (3 : ℝ) by norm_num, log_pot 10 3 (by norm_num) (by norm_num)]; norm_num
  · rw [Real.logb_pow, Real.logb_self_eq_one (by norm_num)]; norm_num

/-! ## Primer 5 -/

/-- Primer 5: pri p = 1 (asimptota x = 1) je g(5) = c·log₂ 4 = 2c = 6 ⟺ c = 3; za x > 1 je
3 log₂(x − 1) = 0 ⟺ x − 1 = 1 ⟺ x = 2; točka (4, 2) preide v (5, 6), (8, 3) v (9, 9): g(9) = 3 log₂ 8 = 9.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#primer5
besedilo: »Vstavimo točko: $g(5) = c \log_2 4 = 2c = 6$, zato je $c = 3$. 3. Ničla: $3 \log_2 (x - 1) = 0$ velja pri $x - 1 = 1$, torej $x = 2$. 4. Graf $y = \log_2 x$ premaknemo za $1$ v desno in ga raztegnemo s faktorjem $3$ v smeri osi $y$. Točka $(4, 2)$ preide v $(5, 6)$, točka $(1, 0)$ v ničlo $(2, 0)$. 5. Preizkus še v eni točki: $g(9) = 3 \log_2 8 = 9$, iz točke $(8, 3)$ dobimo $(9, 9)$.« -/
theorem primer5 (c : ℝ) :
    (c * Real.logb 2 ((5 : ℝ) - 1) = 6 ↔ c = 3) ∧
    (∀ x : ℝ, 1 < x → (3 * Real.logb 2 (x - 1) = 0 ↔ x = 2)) ∧
    3 * Real.logb 2 ((5 : ℝ) - 1) = 3 * Real.logb 2 4 ∧ (3 : ℝ) * 2 = 6 ∧
    3 * Real.logb 2 ((9 : ℝ) - 1) = 9 := by
  obtain ⟨-, -, -, -, w4, w8, -⟩ := vrednosti
  refine ⟨?_, fun x hx => ?_, by norm_num, by norm_num, ?_⟩
  · rw [show (5 : ℝ) - 1 = 4 by norm_num, w4]; constructor <;> intro h <;> linarith
  · have hx' : (0 : ℝ) < x - 1 := sub_pos.mpr hx
    rw [mul_eq_zero, or_iff_right (by norm_num : (3 : ℝ) ≠ 0),
      (lastnosti_vecja 2 (by norm_num)).2.2.2.1 _ hx']
    constructor <;> intro h <;> linarith
  · rw [show (9 : ℝ) - 1 = 8 by norm_num, w8]; norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake: log₂(x + 3) = log₂ x + log₂ 3 ne velja (pri x = 1: log₂ 4 = 2, log₂ 1 + log₂ 3 = log₂ 3
≠ 2); log₃(2x + 1) = 2 ⟺ 2x + 1 = 3² = 9 ⟺ x = 4 (pri 2x + 1 > 0), ne 2x + 1 = 6 ali 8;
(log x)² ≠ log x² (pri x = 1000: 9 ≠ 6). Premik log₂(x + 3) v levo je v `premik_levo`.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#napake
besedilo: »$\log_2 (x + 3) = \log_2 x + \log_2 3$ ne velja. Pravilo $\log_a A + \log_a B = \log_a (AB)$ govori o **produktu** pod logaritmom; za vsoto $x + 3$ pod logaritmom pravila ni, zato tak logaritem pustimo cel. - **Napačna pot od logaritma do potence.** Iz $\log_3 (2x + 1) = 2$ ne sledi $2x + 1 = 3 \cdot 2$ ali $2x + 1 = 2^3$. Osnova se potencira, desna stran je eksponent: $2x + 1 = 3^2 = 9$, torej $x = 4$. - **Premik v napačno smer.** Graf $y = \log_2 (x + 3)$ ni premaknjen v desno. Asimptoto najdeš tako, da logaritmand izenačiš z nič: $x + 3 = 0$, torej $x = -3$; graf je premaknjen za $3$ v levo in $D = (-3, \infty)$. - **Kvadrat logaritma zamenjan z logaritmom kvadrata.** $(\log x)^2$ ni enako $\log x^2 = 2\log x$.« -/
theorem napake :
    Real.logb 2 (1 + 3) ≠ Real.logb 2 1 + Real.logb 2 3 ∧
    (∀ x : ℝ, 0 < 2 * x + 1 → (Real.logb 3 (2 * x + 1) = 2 ↔ x = 4)) ∧
    Real.logb 3 (2 * 2.5 + 1) ≠ 2 ∧ Real.logb 3 (2 * 3.5 + 1) ≠ 2 ∧
    (Real.logb 10 1000) ^ 2 ≠ Real.logb 10 (1000 ^ 2) := by
  have ne3 : ∀ y : ℝ, 0 < y → y ≠ 9 → Real.logb 3 y ≠ 2 := by
    intro y hy h9 h
    rw [v_potenco 3 y 2 (by norm_num) (by norm_num) hy] at h
    apply h9; rw [h]; norm_num
  have l1000 : Real.logb 10 1000 = 3 := by
    rw [show (1000 : ℝ) = 10 ^ (3 : ℝ) by norm_num, log_pot 10 3 (by norm_num) (by norm_num)]
  refine ⟨?_, fun x hx => ?_, ne3 _ (by norm_num) (by norm_num), ne3 _ (by norm_num) (by norm_num), ?_⟩
  · rw [show (1 : ℝ) + 3 = 4 by norm_num, (vrednosti).2.2.2.2.1, Real.logb_one, zero_add]
    intro h
    rw [eq_comm, v_potenco 2 3 2 (by norm_num) (by norm_num) (by norm_num)] at h
    norm_num at h
  · rw [v_potenco 3 _ 2 (by norm_num) (by norm_num) hx]
    constructor
    · intro h; have : (3 : ℝ) ^ (2 : ℝ) = 9 := by norm_num
      linarith
    · intro h; rw [h]; norm_num
  · rw [Real.logb_pow, l1000]; norm_num

/-! ## Za maturo -/

/-- Za maturo, naloga 1: log₂(x + 1) − log₂(x − 2) = 2 s pogojema x + 1 > 0, x − 2 > 0 (x > 2)
⟺ log₂((x + 1)/(x − 2)) = 2 ⟺ (x + 1)/(x − 2) = 4 ⟺ x + 1 = 4x − 8 ⟺ 3x = 9 ⟺ x = 3;
preizkus log₂ 4 − log₂ 1 = 2.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#matura1
besedilo: »Iz $x + 1 = 4x - 8$ sledi $3x = 9$ in $x = 3$, kar ustreza pogoju $x > 2$.« -/
theorem matura1 (x : ℝ) :
    (0 < x + 1 ∧ 0 < x - 2 ∧ Real.logb 2 (x + 1) - Real.logb 2 (x - 2) = 2) ↔ x = 3 := by
  constructor
  · rintro ⟨h1, h2, h⟩
    have e1 : Real.logb 2 ((x + 1) / (x - 2)) = 2 := by rw [Real.logb_div h1.ne' h2.ne']; exact h
    have e2 : (x + 1) / (x - 2) = (2 : ℝ) ^ (2 : ℝ) :=
      (v_potenco 2 _ 2 (by norm_num) (by norm_num) (div_pos h1 h2)).mp e1
    have e3 : (x + 1) / (x - 2) = 4 := by rw [e2]; norm_num
    rw [div_eq_iff h2.ne'] at e3
    linarith
  · rintro rfl
    refine ⟨by norm_num, by norm_num, ?_⟩
    rw [show (3 : ℝ) + 1 = 4 by norm_num, show (3 : ℝ) - 2 = 1 by norm_num, (vrednosti).2.2.2.2.1,
      Real.logb_one]
    norm_num

/-- Za maturo, naloga 2 a), b): f(x) = log₂(x + 4) − 1: pogoj x + 4 > 0 ⟺ x > −4; za x > −4 je f(x) = 0
⟺ log₂(x + 4) = 1 ⟺ x + 4 = 2 ⟺ x = −2; f(0) = log₂ 4 − 1 = 1.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#matura2ab
besedilo: »Logaritmand mora biti pozitiven: $x + 4 > 0$, zato je $D_f = (-4, \infty)$. Asimptota je navpična premica $x = -4$. 2. b) Iz $\log_2 (x + 4) - 1 = 0$ sledi $\log_2 (x + 4) = 1$, torej $x + 4 = 2$ in $x = -2$. 3. b) $f(0) = \log_2 4 - 1 = 2 - 1 = 1$, presečišče z osjo $y$ je točka $(0, 1)$.« -/
theorem matura2ab :
    (∀ x : ℝ, 0 < x + 4 ↔ -4 < x) ∧
    (∀ x : ℝ, -4 < x → (Real.logb 2 (x + 4) - 1 = 0 ↔ x = -2)) ∧
    Real.logb 2 ((0 : ℝ) + 4) - 1 = 1 := by
  refine ⟨fun x => by constructor <;> intro h <;> linarith, fun x hx => ?_, ?_⟩
  · calc Real.logb 2 (x + 4) - 1 = 0 ↔ Real.logb 2 (x + 4) = 1 := by
          constructor <;> intro h <;> linarith
      _ ↔ x + 4 = (2 : ℝ) ^ (1 : ℝ) := v_potenco 2 _ _ (by norm_num) (by norm_num) (by linarith)
      _ ↔ x = -2 := by rw [Real.rpow_one]; constructor <;> intro h <;> linarith
  · rw [show (0 : ℝ) + 4 = 4 by norm_num, (vrednosti).2.2.2.2.1]; norm_num

/-- Za maturo, naloga 2 c), d) in RAČUN: f⁻¹(x) = 2^(x+1) − 4 je obratna funkcija: f(f⁻¹(y)) = y za vsak y
in f⁻¹(f(x)) = x za x > −4; zaloga vrednosti f⁻¹ je (−4, ∞) = D_f; točke f: (−3, −1), (−2, 0), (0, 1),
(4, 2), točke f⁻¹: (−1, −3), (0, −2), (1, 0), (2, 4).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#matura2cd
besedilo: »Zapišemo $y = \log_2 (x + 4) - 1$ in izrazimo $x$: $y + 1 = \log_2 (x + 4)$, po definiciji $x + 4 = 2^{y+1}$ in $x = 2^{y+1} - 4$. 5. c) Zamenjamo vlogi spremenljivk: $f^{-1}(x) = 2^{x+1} - 4$. Zaloga vrednosti obratne funkcije je definicijsko območje funkcije $f$, torej $Z_{f^{-1}} = (-4, \infty)$; to se ujema z $2^{x+1} > 0$. 6. d) Točke grafa $f$: $(-3, -1)$, $(-2, 0)$, $(0, 1)$, $(4, 2)$, navpična asimptota $x = -4$. Točke grafa $f^{-1}$ dobimo z zamenjavo koordinat: $(-1, -3)$, $(0, -2)$, $(1, 0)$, $(2, 4)$« -/
theorem matura2cd :
    (∀ y : ℝ, Real.logb 2 (((2 : ℝ) ^ (y + 1) - 4) + 4) - 1 = y) ∧
    (∀ x : ℝ, -4 < x → (2 : ℝ) ^ ((Real.logb 2 (x + 4) - 1) + 1) - 4 = x) ∧
    Set.range (fun x : ℝ => (2 : ℝ) ^ (x + 1) - 4) = Set.Ioi (-4) ∧
    (Real.logb 2 ((-3 : ℝ) + 4) - 1 = -1 ∧ Real.logb 2 ((-2 : ℝ) + 4) - 1 = 0 ∧
      Real.logb 2 ((4 : ℝ) + 4) - 1 = 2) ∧
    ((2 : ℝ) ^ ((-1 : ℝ) + 1) - 4 = -3 ∧ (2 : ℝ) ^ ((0 : ℝ) + 1) - 4 = -2 ∧
      (2 : ℝ) ^ ((1 : ℝ) + 1) - 4 = 0 ∧ (2 : ℝ) ^ ((2 : ℝ) + 1) - 4 = 4) := by
  obtain ⟨-, -, w1, w2, w4, w8, -⟩ := vrednosti
  refine ⟨fun y => ?_, fun x hx => ?_, ?_, ⟨?_, ?_, ?_⟩, by norm_num⟩
  · rw [sub_add_cancel, log_pot 2 _ (by norm_num) (by norm_num)]; ring
  · rw [sub_add_cancel, Real.rpow_logb (by norm_num) (by norm_num) (by linarith)]; ring
  · ext y
    constructor
    · rintro ⟨x, rfl⟩
      show -4 < (2 : ℝ) ^ (x + 1) - 4
      linarith [Real.rpow_pos_of_pos (show (0 : ℝ) < 2 by norm_num) (x + 1)]
    · intro hy
      have hy' : -4 < y := hy
      refine ⟨Real.logb 2 (y + 4) - 1, ?_⟩
      show (2 : ℝ) ^ ((Real.logb 2 (y + 4) - 1) + 1) - 4 = y
      rw [sub_add_cancel, Real.rpow_logb (by norm_num) (by norm_num) (by linarith)]; ring
  · rw [show (-3 : ℝ) + 4 = 1 by norm_num, w1]; norm_num
  · rw [show (-2 : ℝ) + 4 = 2 by norm_num, w2]; norm_num
  · rw [show (4 : ℝ) + 4 = 8 by norm_num, w8]; norm_num

/-- Za maturo, naloga 3 a)–d) in RAČUN: h(x) = r + s log₂(x + 1); h(0) = r = 20; 20 + 2s = 32 ⟺ s = 6;
h(7) = 20 + 6 log₂ 8 = 38; za x > −1: h(x) = 50 ⟺ x = 31, h(x) = 44 ⟺ x = 15; prirastka: 3 tedne,
nato 15 − 3 = 12 tednov.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#matura3
besedilo: »$h(0) = r + s \log_2 1 = r$, zato je $r = 20$. 2. a) $h(3) = 20 + s \log_2 4 = 20 + 2s = 32$, zato je $s = 6$ in $h(x) = 20 + 6 \log_2 (x + 1)$. 3. b) $h(7) = 20 + 6 \log_2 8 = 20 + 18 = 38$ besed na minuto. 4. c) Iz $20 + 6 \log_2 (x + 1) = 50$ sledi $\log_2 (x + 1) = 5$, torej $x + 1 = 2^5 = 32$ in $x = 31$ tednov. 5. d) Hitrost $32$ doseže pri $x = 3$. Iz $20 + 6 \log_2 (x + 1) = 44$ sledi $\log_2 (x + 1) = 4$ in $x = 15$. 6. d) Za prvih $12$ besed na minuto potrebuje $3$ tedne, za naslednjih $12$ pa $15 - 3 = 12$ tednov.« -/
theorem matura3 (r s : ℝ) :
    r + s * Real.logb 2 ((0 : ℝ) + 1) = r ∧ (20 + 2 * s = 32 ↔ s = 6) ∧
    20 + 6 * Real.logb 2 ((3 : ℝ) + 1) = 32 ∧
    20 + 6 * Real.logb 2 ((7 : ℝ) + 1) = 38 ∧
    (∀ x : ℝ, -1 < x → (20 + 6 * Real.logb 2 (x + 1) = 50 ↔ x = 31)) ∧
    (∀ x : ℝ, -1 < x → (20 + 6 * Real.logb 2 (x + 1) = 44 ↔ x = 15)) ∧ (15 : ℝ) - 3 = 12 := by
  obtain ⟨-, -, -, -, w4, w8, w16, w32⟩ := vrednosti
  have resi : ∀ x c : ℝ, -1 < x → (20 + 6 * Real.logb 2 (x + 1) = 20 + 6 * c ↔ x + 1 = (2 : ℝ) ^ c) := by
    intro x c hx
    rw [← v_potenco 2 _ c (by norm_num) (by norm_num) (by linarith)]
    constructor <;> intro h <;> linarith
  refine ⟨by rw [show (0 : ℝ) + 1 = 1 by norm_num, Real.logb_one]; ring,
    by constructor <;> intro h <;> linarith, by rw [show (3 : ℝ) + 1 = 4 by norm_num, w4]; norm_num,
    by rw [show (7 : ℝ) + 1 = 8 by norm_num, w8]; norm_num, fun x hx => ?_, fun x hx => ?_, by norm_num⟩
  · rw [show (50 : ℝ) = 20 + 6 * 5 by norm_num, resi x 5 hx]; norm_num
    constructor <;> intro h <;> linarith
  · rw [show (44 : ℝ) = 20 + 6 * 4 by norm_num, resi x 4 hx]; norm_num
    constructor <;> intro h <;> linarith

/-- Za maturo, naloga 3 e) in RAČUN: za x > −1 je 20 + 6 log₂(x + 1) = 40 ⟺ log₂(x + 1) = 10/3
⟺ x + 1 = 2^(10/3); 2^(10/3) ≈ 10,0794, x ≈ 9,0794 ≈ 9,08 ≈ 9,1 tedna.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#matura3e
besedilo: »Iz $20 + 6 \log_2 (x + 1) = 40$ sledi $\log_2 (x + 1) = \dfrac{10}{3}$, po definiciji $x + 1 = 2^{\frac{10}{3}}$. 8. e) Z računalom: $2^{\frac{10}{3}} \approx 10{,}0794$, zato je $x \approx 9{,}0794$, zaokroženo $9{,}1$ tedna.« -/
theorem matura3e (x : ℝ) (hx : -1 < x) :
    (20 + 6 * Real.logb 2 (x + 1) = 40 ↔ Real.logb 2 (x + 1) = 10 / 3) ∧
    (Real.logb 2 (x + 1) = 10 / 3 ↔ x + 1 = (2 : ℝ) ^ (10 / 3 : ℝ)) ∧
    (10.07935 < (2 : ℝ) ^ (10 / 3 : ℝ) ∧ (2 : ℝ) ^ (10 / 3 : ℝ) < 10.07945) ∧
    (x + 1 = (2 : ℝ) ^ (10 / 3 : ℝ) → (9.075 < x ∧ x < 9.085) ∧ (9.05 < x ∧ x < 9.15)) := by
  have hb : 10.07935 < (2 : ℝ) ^ (10 / 3 : ℝ) ∧ (2 : ℝ) ^ (10 / 3 : ℝ) < 10.07945 :=
    koren_med (p := 10) (q := 3) (by norm_num) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  refine ⟨by constructor <;> intro h <;> linarith, v_potenco 2 _ _ (by norm_num) (by norm_num)
    (by linarith), hb, fun h => ⟨⟨by linarith [hb.1], by linarith [hb.2]⟩,
    ⟨by linarith [hb.1], by linarith [hb.2]⟩⟩⟩

/-- Predpostavke trditve `matura3e` se dajo izpolniti (x = 2^(10/3) − 1). -/
example : (-1 : ℝ) < 2 ^ (10 / 3 : ℝ) - 1 := by
  linarith [Real.rpow_pos_of_pos (show (0 : ℝ) < 2 by norm_num) (10 / 3 : ℝ)]

/-! ## Ustna vprašanja in Drugače -/

/-- Predpostavke trditve `matura3e` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (-1 : ℝ) < 2 ^ (10 / 3 : ℝ) - 1 := by
    linarith [Real.rpow_pos_of_pos (show (0 : ℝ) < 2 by norm_num) (10 / 3 : ℝ)]
  matura3e (hx := w)

/-- Ustno vprašanje 1: točka (0, 1) grafa aˣ preide v (1, 0), (1, a) v (a, 1) (a⁰ = 1, logₐ 1 = 0,
a¹ = a, logₐ a = 1).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#ustno1
besedilo: »Točka $(0, 1)$ preide v točko $(1, 0)$, točka $(1, a)$ pa v točko $(a, 1)$.« -/
theorem ustno1 (a : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) :
    a ^ (0 : ℝ) = 1 ∧ Real.logb a 1 = 0 ∧ a ^ (1 : ℝ) = a ∧ Real.logb a a = 1 := by
  refine ⟨Real.rpow_zero a, Real.logb_one, Real.rpow_one a, ?_⟩
  have := log_pot a 1 ha ha1; rwa [Real.rpow_one] at this

/-- Predpostavke trditve `ustno1` se dajo izpolniti (a = 3). -/
example : (0 : ℝ) < 3 ∧ (3 : ℝ) ≠ 1 := by norm_num

/-- Predpostavke trditve `ustno1` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 3 ∧ (3 : ℝ) ≠ 1 := by norm_num
  ustno1 (ha := w.1) (ha1 := w.2)

/-- Ustno vprašanje 3: log₂ x + log₂(x − 2) = 3 s pogojema x > 0, x − 2 > 0 ⟺ x = 4; x(x − 2) = 8
⟺ x = 4 ali x = −2 (−2 je odvečna rešitev).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#ustno3
besedilo: »Ko logaritma združimo, dobimo enačbo $x(x - 2) = 8$ z rešitvama $x = 4$ in $x = -2$. Pri $x = -2$ logaritmanda nista pozitivna, zato prvotna enačba tam ni definirana in $-2$ ni njena rešitev.« -/
theorem ustno3 (x : ℝ) :
    ((0 < x ∧ 0 < x - 2 ∧ Real.logb 2 x + Real.logb 2 (x - 2) = 3) ↔ x = 4) ∧
    (x * (x - 2) = 8 ↔ x = 4 ∨ x = -2) := by
  have hq : x * (x - 2) = 8 ↔ x = 4 ∨ x = -2 := by
    constructor
    · intro h
      have : (x - 4) * (x + 2) = 0 := by nlinarith
      rcases mul_eq_zero.mp this with h1 | h1
      · left; linarith
      · right; linarith
    · rintro (rfl | rfl) <;> norm_num
  refine ⟨⟨fun ⟨h1, h2, h⟩ => ?_, fun h => ?_⟩, hq⟩
  · have e1 : Real.logb 2 (x * (x - 2)) = 3 := by rw [Real.logb_mul h1.ne' h2.ne']; exact h
    have e2 : x * (x - 2) = (2 : ℝ) ^ (3 : ℝ) := (v_potenco 2 _ 3 (by norm_num) (by norm_num)
      (mul_pos h1 h2)).mp e1
    have e3 : x * (x - 2) = 8 := by rw [e2]; norm_num
    rcases hq.mp e3 with h4 | h4
    · exact h4
    · linarith
  · subst h
    refine ⟨by norm_num, by norm_num, ?_⟩
    rw [show (4 : ℝ) - 2 = 2 by norm_num, (vrednosti).2.2.2.2.1, (vrednosti).2.2.2.1]; norm_num

/-- Drugače, z analogijo: 0,1·2ˣ = 0,8 ⟺ x = 3 = log₂ 8; za 0,05 mm je log₂(1/2) = −1.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#analogija
besedilo: »Za $0{,}8\,\mathrm{mm}$ je odgovor $\log_2 8 = 3$. Analogija pokaže tudi definicijsko območje. Debelina je vedno pozitivna, zato vprašanje »kolikokrat do debeline $0$« nima odgovora. Za debelino $0{,}05\,\mathrm{mm}$ bi morali list enkrat »odpogniti«, zato je odgovor negativen: $\log_2 \frac{1}{2} = -1$.« -/
theorem analogija (x : ℝ) : (0.1 * (2 : ℝ) ^ x = 0.8 ↔ x = Real.logb 2 8) ∧ Real.logb 2 8 = 3 ∧
    (0.05 : ℝ) / 0.1 = 1 / 2 ∧ Real.logb 2 (1 / 2) = -1 := by
  refine ⟨?_, (vrednosti).2.2.2.2.2.1, by norm_num, (vrednosti).2.1⟩
  rw [eq_comm (a := x), Real.logb_eq_iff_rpow_eq (by norm_num) (by norm_num) (by norm_num)]
  constructor <;> intro h <;> linarith

/-- Drugače, iz vsakdanjega življenja: log₂ 10⁶ ≈ 19,93; 2¹⁹ < 10⁶ ≤ 2²⁰ (dovolj je 20 vprašanj);
2⁹ < 1000 ≤ 2¹⁰ in 2²⁹ < 10⁹ ≤ 2³⁰; log₂(1000x) = log₂ 1000 + log₂ x (x > 0), log₂ 1000 ≈ 9,97 ≈ 10.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#ugibanje
besedilo: »Rešitev je $n \ge \log_2 1\,000\,000 \approx 19{,}93$, torej zadošča $20$ vprašanj. Pri $1000$ številih zadošča $10$ vprašanj, pri milijardi pa le $30$. To je značilnost logaritemske funkcije: ko se $x$ tisočkrat poveča, se $\log_2 x$ poveča le za približno $10$.« -/
theorem ugibanje (x : ℝ) (hx : 0 < x) :
    (19.925 < Real.logb 2 1000000 ∧ Real.logb 2 1000000 < 19.935) ∧
    ((2 : ℕ) ^ 19 < 10 ^ 6 ∧ (10 : ℕ) ^ 6 ≤ 2 ^ 20) ∧ ((2 : ℕ) ^ 9 < 1000 ∧ 1000 ≤ (2 : ℕ) ^ 10) ∧
    ((2 : ℕ) ^ 29 < 10 ^ 9 ∧ (10 : ℕ) ^ 9 ≤ 2 ^ 30) ∧
    Real.logb 2 (1000 * x) = Real.logb 2 1000 + Real.logb 2 x ∧
    (9.5 < Real.logb 2 1000 ∧ Real.logb 2 1000 < 10.5) := by
  have h1000 := (rast_stevila).2.2.1
  have e : Real.logb 2 1000000 = 2 * Real.logb 2 1000 := by
    rw [show (1000000 : ℝ) = 1000 ^ 2 by norm_num, Real.logb_pow]; push_cast; ring
  refine ⟨by rw [e]; constructor <;> linarith [h1000.1, h1000.2], by norm_num, by norm_num, by norm_num,
    Real.logb_mul (by norm_num) hx.ne', ⟨by linarith [h1000.1], by linarith [h1000.2]⟩⟩

/-- Predpostavke trditve `ugibanje` se dajo izpolniti (x = 1). -/
example : (0 : ℝ) < 1 := by norm_num

/-- Predpostavke trditve `ugibanje` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 1 := by norm_num
  ugibanje (hx := w)

/-- Drugače, bolj natančno: za a > 0, a ≠ 1 vsakemu y > 0 pripada natanko en x z aˣ = y (x = logₐ y);
iz logₐ A = logₐ B (A, B > 0) sledi A = B.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#dobro-definirana
besedilo: »Vsakemu $y > 0$ torej pripada natanko en $x$ z $a^x = y$. Zato ima obratno funkcijo z definicijskim območjem $(0, \infty)$ in zalogo vrednosti $\mathbb{R}$. To je $\log_a x$. Ker sta grafa obratnih funkcij zrcalna glede na $y = x$, obratna funkcija podeduje monotonost: pri $a > 1$ narašča, pri $0 < a < 1$ pada. **Injektivnost in sklep $A = B$.** Iz $\log_a A = \log_a B$ sledi $A = B$ ravno zato, ker strogo monotona funkcija nobene vrednosti ne zavzame dvakrat.« -/
theorem dobro_definirana (a y : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (hy : 0 < y) :
    (∃! x : ℝ, a ^ x = y) ∧
    ∀ A B : ℝ, 0 < A → 0 < B → Real.logb a A = Real.logb a B → A = B := by
  refine ⟨⟨Real.logb a y, Real.rpow_logb ha ha1 hy, fun x hx => ?_⟩, fun A B hA hB h => ?_⟩
  · have hx' : a ^ x = y := hx
    rw [← Real.logb_eq_iff_rpow_eq ha ha1 hy] at hx'
    exact hx'.symm
  · rw [← Real.rpow_logb ha ha1 hA, ← Real.rpow_logb ha ha1 hB, h]

/-- Predpostavke trditve `dobro_definirana` se dajo izpolniti (a = 2, y = 5). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 5 := by norm_num

/-- Predpostavke trditve `dobro_definirana` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 5 := by norm_num
  dobro_definirana (ha := w.1) (ha1 := w.2.1) (hy := w.2.2)

/-- Drugače, bolj natančno: log x² = 2 log |x| (x ≠ 0); log x² = 2 ⟺ x = 10 ali x = −10 (x ≠ 0);
2 log x = 2 ⟺ x = 10 (x > 0).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#kvadrat-pod-log
besedilo: »Splošno velja $\log x^2 = 2 \log |x|$. Enačba $\log x^2 = 2$ ima zato rešitvi $x = 10$ in $x = -10$, enačba $2\log x = 2$ pa le $x = 10$.« -/
theorem kvadrat_pod_log :
    (∀ x : ℝ, x ≠ 0 → Real.logb 10 (x ^ 2) = 2 * Real.logb 10 |x|) ∧
    (∀ x : ℝ, x ≠ 0 → (Real.logb 10 (x ^ 2) = 2 ↔ x = 10 ∨ x = -10)) ∧
    (∀ x : ℝ, 0 < x → (2 * Real.logb 10 x = 2 ↔ x = 10)) := by
  have hl : ∀ x : ℝ, Real.logb 10 (x ^ 2) = 2 * Real.logb 10 |x| := by
    intro x
    rw [← sq_abs, Real.logb_pow]; push_cast; ring
  refine ⟨fun x _ => hl x, fun x hx => ?_, fun x hx => ?_⟩
  · have ha : 0 < |x| := abs_pos.mpr hx
    rw [hl]
    calc 2 * Real.logb 10 |x| = 2 ↔ Real.logb 10 |x| = 1 := by constructor <;> intro h <;> linarith
      _ ↔ |x| = (10 : ℝ) ^ (1 : ℝ) := v_potenco 10 _ _ (by norm_num) (by norm_num) ha
      _ ↔ x = 10 ∨ x = -10 := by
          rw [Real.rpow_one]
          constructor
          · intro h; rcases abs_eq (by norm_num : (0 : ℝ) ≤ 10) |>.mp h with h | h
            · exact Or.inl h
            · exact Or.inr h
          · rintro (h | h) <;> rw [h] <;> norm_num
  · calc 2 * Real.logb 10 x = 2 ↔ Real.logb 10 x = 1 := by constructor <;> intro h <;> linarith
      _ ↔ x = (10 : ℝ) ^ (1 : ℝ) := v_potenco 10 _ _ (by norm_num) (by norm_num) hx
      _ ↔ x = 10 := by rw [Real.rpow_one]

/-! ## Preveri se -/

/-- Preveri se 1: pri f(x) = log₂ x je log₂ 1 = 0 (točka (1, 0)); točka (0, 1) leži na grafu 2ˣ (2⁰ = 1) in
po zrcaljenju postane (1, 0); 0 ni pozitiven (ni v D).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#kviz1
besedilo: »Graf osi $y$ ne seka, ker $x = 0$ ni v definicijskem območju. Točka $(0, 1)$ leži na grafu $y = 2^x$; po zrcaljenju čez $y = x$ postane $(1, 0)$.« -/
theorem kviz1 : Real.logb 2 1 = 0 ∧ (2 : ℝ) ^ (0 : ℝ) = 1 ∧ ¬ ((0 : ℝ) > 0) :=
  ⟨Real.logb_one, by norm_num, by norm_num⟩

/-- Preveri se 2: log x + log(x − 3) = 1 s pogojema x > 0, x − 3 > 0 ⟺ x = 5; x² − 3x − 10 = (x − 5)(x + 2);
logaritem je lahko negativen: log 0,1 = −1.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#kviz2
besedilo: »Razcep $(x - 5)(x + 2)$ je pravilen; $x = -2$ res reši kvadratno enačbo, ne pa prvotne.« -/
theorem kviz2 (x : ℝ) :
    ((0 < x ∧ 0 < x - 3 ∧ Real.logb 10 x + Real.logb 10 (x - 3) = 1) ↔ x = 5) ∧
    x ^ 2 - 3 * x - 10 = (x - 5) * (x + 2) ∧ Real.logb 10 0.1 = -1 := by
  refine ⟨⟨fun ⟨h1, h2, h⟩ => ?_, fun h => ?_⟩, by ring, ?_⟩
  · have e1 : Real.logb 10 (x * (x - 3)) = 1 := by rw [Real.logb_mul h1.ne' h2.ne']; exact h
    have e2 : x * (x - 3) = (10 : ℝ) ^ (1 : ℝ) := (v_potenco 10 _ 1 (by norm_num) (by norm_num)
      (mul_pos h1 h2)).mp e1
    rw [Real.rpow_one] at e2
    have : (x - 5) * (x + 2) = 0 := by nlinarith
    rcases mul_eq_zero.mp this with h5 | h5
    · linarith
    · linarith
  · subst h
    refine ⟨by norm_num, by norm_num, ?_⟩
    rw [← Real.logb_mul (by norm_num) (by norm_num)]; norm_num
  · rw [show (0.1 : ℝ) = 10 ^ (-1 : ℝ) by norm_num, log_pot 10 _ (by norm_num) (by norm_num)]

/-- Preveri se 3: x² − 4 = (x − 2)(x + 2) > 0 ⟺ x < −2 ali x > 2 (pri x = 0 je 0 − 4 = −4 < 0).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#kviz3
besedilo: »Parabola, odprta navzgor, je med ničlama pod osjo $x$: pri $x = 0$ je $0 - 4 = -4 < 0$. Izraz je pozitiven zunaj ničel, zato je $D_f = (-\infty, -2) \cup (2, \infty)$.« -/
theorem kviz3 (x : ℝ) : x ^ 2 - 4 = (x - 2) * (x + 2) ∧ (0 < x ^ 2 - 4 ↔ x < -2 ∨ 2 < x) ∧
    (0 : ℝ) ^ 2 - 4 = -4 := by
  refine ⟨by ring, ⟨fun h => ?_, fun h => ?_⟩, by norm_num⟩
  · by_contra hc
    push Not at hc
    nlinarith [hc.1, hc.2]
  · rcases h with h | h <;> nlinarith

/-- Preveri se 4: log₃(2x + 1) = 2 ⟺ x = 4 (2x + 1 = 3² = 9); napačni odgovori 2,5, 1 in 3,5 dajo
logaritmande 6, 3, 8 (ne 9); preizkus log₃ 9 = 2.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#kviz4
besedilo: »Po definiciji je $2x + 1 = 3^2 = 9$, zato je $x = 4$. Preizkus: $\log_3 9 = 2$.« -/
theorem kviz4 :
    (∀ x : ℝ, 0 < 2 * x + 1 → (Real.logb 3 (2 * x + 1) = 2 ↔ x = 4)) ∧
    (2 : ℝ) * 2.5 + 1 = 6 ∧ (2 : ℝ) * 1 + 1 = 3 ∧ (2 : ℝ) * 3.5 + 1 = 8 ∧ Real.logb 3 9 = 2 :=
  ⟨(napake).2.1, by norm_num, by norm_num, by norm_num, (vrednosti).2.2.2.2.2.2.2.2.2.2⟩

/-- Preveri se 5: za ν > 0 je 12 log₂(ν/440) = −12 ⟺ log₂(ν/440) = −1 ⟺ ν/440 = 2⁻¹ ⟺ ν = 220.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#kviz5
besedilo: »Iz $12 \log_2 \dfrac{\nu}{440} = -12$ sledi $\log_2 \dfrac{\nu}{440} = -1$ in $\dfrac{\nu}{440} = 2^{-1}$, torej $\nu = 220\,\mathrm{Hz}$: ena oktava pod A.« -/
theorem kviz5 (ν : ℝ) (hν : 0 < ν) : 12 * Real.logb 2 (ν / 440) = -12 ↔ ν = 220 := by
  calc 12 * Real.logb 2 (ν / 440) = -12 ↔ Real.logb 2 (ν / 440) = -1 := by
        constructor <;> intro h <;> linarith
    _ ↔ ν / 440 = (2 : ℝ) ^ (-1 : ℝ) := v_potenco 2 _ _ (by norm_num) (by norm_num) (by positivity)
    _ ↔ ν = 220 := by
        rw [div_eq_iff (by norm_num), show (2 : ℝ) ^ (-1 : ℝ) = 1 / 2 by norm_num]
        constructor <;> intro h <;> linarith

/-- Predpostavke trditve `kviz5` se dajo izpolniti (ν = 220). -/
example : (0 : ℝ) < 220 := by norm_num

/-- Predpostavke trditve `kviz5` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 220 := by norm_num
  kviz5 (hν := w)

/-- Preveri se 6: c·log₃ 9 = 2c = −4 ⟺ c = −2.
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#kviz6
besedilo: »$g(9) = c \log_3 9 = 2c = -4$, zato je $c = -2$: graf $\log_3 x$ je raztegnjen s faktorjem $2$ in prezrcaljen čez os $x$.« -/
theorem kviz6 (c : ℝ) : c * Real.logb 3 9 = -4 ↔ c = -2 := by
  rw [(vrednosti).2.2.2.2.2.2.2.2.2.2]; constructor <;> intro h <;> linarith

/-- Preveri se 7: 2¹⁰ = 1024 in za x > 0: log₂ x = 10 ⟺ x = 2¹⁰ = 1024 (točka (10, 1024) preide v
(1024, 10)).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#kviz7
besedilo: »Iz $\log_2 x = 10$ sledi $x = 2^{10} = 1024$. Točka $(10, 1024)$ grafa $y = 2^x$ preide v točko $(1024, 10)$ grafa $y = \log_2 x$: eksponentna funkcija pride do $1024$ v desetih korakih, logaritemska pa potrebuje $1024$ enot, da pride do $10$.« -/
theorem kviz7 : (2 : ℝ) ^ (10 : ℝ) = 1024 ∧ ∀ x : ℝ, 0 < x → (Real.logb 2 x = 10 ↔ x = 1024) :=
  ⟨by norm_num, (asimptota 2 (by norm_num)).2.2⟩

/-- RAČUN: 2·log₄ x = log₂ x in log₂(4x) = 2 + log₂ x (x > 0).
trditev: MAT-SS-2/logaritemska-funkcija-in-enacbe#racun-osnove
besedilo: »Na primer $y = \log_4 x$ je graf $y = \log_2 x$, v smeri osi $y$ skrčen s faktorjem $\frac{1}{2}$, ker iz $4^y = x$ sledi $2^{2y} = x$. Pri $g(x) = \log_a (kx)$ s $k > 0$ se graf v smeri osi $x$ skrči s faktorjem $k$ (kot pri vsaki funkciji). Pri logaritmu pa je $\log_a (kx) = \log_a k + \log_a x$, zato je to hkrati premik za $\log_a k$ v smeri osi $y$: graf $y = \log_2 (4x)$ je graf $y = \log_2 x$, premaknjen za $2$ navzgor.« -/
theorem racun_osnove (x : ℝ) (hx : 0 < x) :
    2 * Real.logb 4 x = Real.logb 2 x ∧ Real.logb 2 (4 * x) = 2 + Real.logb 2 x := by
  refine ⟨?_, (skrcitev 2 4 x (by norm_num) (by norm_num) (by norm_num) hx).2.1⟩
  rw [(raztegi 2 0 x (by norm_num) (by norm_num)).2.2.1]; ring

/-- Predpostavke trditve `racun_osnove` se dajo izpolniti (x = 1). -/
example : (0 : ℝ) < 1 := by norm_num

/-! ## Primeri izpolnljivosti (izrek, uporabljen na konkretnih vrednostih) -/

/-- Predpostavke trditve `kviz7` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  kviz7.2 1024 (by norm_num)

/-- Predpostavke trditve `racun_osnove` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 1 := by norm_num
  racun_osnove (hx := w)

end Evklid.Lekcije.MAT_SS_2.LogaritemskaFunkcijaInEnacbe
