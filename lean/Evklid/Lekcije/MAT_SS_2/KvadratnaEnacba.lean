/-
vir: content/lessons/MAT-SS-2/kvadratna-enacba.md
sha256: bfde0ded87f400cd4525fb8adbf8fc6f811145464ba4fcaf7003147861e430ad
Ni v Leanu: trditev »rešitve enačbe so natanko ničle funkcije f« (definicija ničle); risbe, simulacija in
opis »Na sliki« (premikanje parabole, rešitvi »zbežita« v kompleksno
ravnino; dokazano je le, da D pri večanju c pada, in da je realni del kompleksnih rešitev −b/(2a));
fizikalni modeli višine (h(t) = 4,9t − 4,9t², h(t) = v₀t − g/2·t² kot zakon gibanja; dokazana je samo
algebra: največja višina v₀²/(2g) in šestkratnik pri šestkrat manjšem g); poimenovanja (vodilni,
linearni koeficient, prosti člen, »razcepna enačba«), postopki reševanja v korakih (Razlaga 3 in 8,
Ponovitev, Povzetek) in nasveti (»negativen b vstavi v oklepaj«, »z x ne deli«) kot navodila, ne trditve
(pravilni računi iz njih so dokazani); točkovanje maturitetnih nalog; besedilo napačnih odgovorov v
Preveri se (dokazani so pravilni odgovori, pri napakah, kjer gre, tudi to, da napačna vrednost ni rešitev);
Naloga 3 d), utemeljitev »vsak centimeter širine da več kartona« kot besedni opis (dokazano je, da je
pri istem x > 0 ploščina drugega paspartuja večja in zato pozitivna rešitev manjša).
Približki so dokazani kot ocene napake zaokrožitve (|x − približek| < pol enote zadnjega mesta) iz
dokazanih mej korenov. Decimalna števila so točna racionalna števila v ℝ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.KvadratnaEnacba

open Complex

/-! ## Pomožne trditve -/

/-- Pomožno: enačba L = R je enakovredna P = 0, če je L − R = P.
pomozno -/
theorem enacba_iff {R : Type*} [AddGroup R] {L D P : R} (h : L - D = P) : L = D ↔ P = 0 := by
  rw [← h, sub_eq_zero]

/-- Predpostavka `enacba_iff` se da izpolniti (L = 3, D = 1, P = 2). -/
example : (3 : ℝ) = 1 ↔ (2 : ℝ) = 0 := enacba_iff (by norm_num)

/-- Razlaga 3 (pravilo produkta): A·B = 0 natanko tedaj, ko je A = 0 ali B = 0.
trditev: MAT-SS-2/kvadratna-enacba#produkt-nic
besedilo: »Rešimo jo s pravilom: produkt je enak $0$ natanko tedaj, ko je enak $0$ vsaj en faktor.« -/
theorem produkt_nic (A B : ℝ) : A * B = 0 ↔ A = 0 ∨ B = 0 := mul_eq_zero

/-- Pomožno: (x − r)(x − s) = 0 ↔ x = r ∨ x = s (v ℝ in v ℂ).
pomozno -/
theorem dva_faktorja {K : Type*} [CommRing K] [NoZeroDivisors K] (x r s : K) :
    (x - r) * (x - s) = 0 ↔ x = r ∨ x = s := by
  simp only [mul_eq_zero, sub_eq_zero]

/-- Pomožno: (x − r)(x − s)(x − t) = 0 ↔ x = r ∨ x = s ∨ x = t.
pomozno -/
theorem trije_faktorji (x r s t : ℝ) :
    (x - r) * (x - s) * (x - t) = 0 ↔ x = r ∨ x = s ∨ x = t := by
  simp only [mul_eq_zero, sub_eq_zero, or_assoc]

/-- Pomožno (Primer 2, korak 4): (m + ni)(m − ni) = m² + n².
pomozno -/
theorem konjugirani_produkt (m n : ℂ) : (m + n * I) * (m - n * I) = m ^ 2 + n ^ 2 := by
  linear_combination (-n ^ 2) * I_sq

/-! ## Razlaga -/

/-- Razlaga 1, Preveri: 3x = 5 − 2x² ima splošno obliko 2x² + 3x − 5 = 0 (a = 2, b = 3, c = −5).
trditev: MAT-SS-2/kvadratna-enacba#preveri-splosna
besedilo: »Preveri:* kateri so $a$, $b$, $c$ pri $3x = 5 - 2x^2$? (Enačba se glasi $2x^2 + 3x - 5 = 0$, torej $a = 2$, $b = 3$, $c = -5$.)« -/
theorem preveri_splosna (x : ℝ) : 3 * x = 5 - 2 * x ^ 2 ↔ 2 * x ^ 2 + 3 * x + (-5) = 0 := by
  constructor <;> intro h <;> linarith

/-- Razlaga 2 (c = 0): ax² + bx = 0 ⇔ x(ax + b) = 0 ⇔ x = 0 ali x = −b/a (a ≠ 0).
trditev: MAT-SS-2/kvadratna-enacba#nepopolna-c0
besedilo: »$c = 0$: izpostavi $x$. Iz $ax^2 + bx = 0$ sledi $x(ax + b) = 0$, torej $x_1 = 0$ in $x_2 = -\dfrac{b}{a}$.« -/
theorem nepopolna_c0 (a b x : ℝ) (ha : a ≠ 0) : a * x ^ 2 + b * x = 0 ↔ x = 0 ∨ x = -b / a := by
  rw [enacba_iff (P := x * (a * x + b)) (by ring), mul_eq_zero]
  apply or_congr Iff.rfl
  constructor
  · intro h; field_simp; linarith
  · intro h; rw [h]; field_simp; ring

/-- Predpostavka `nepopolna_c0` se da izpolniti (a = 1). -/
example : (1 : ℝ) * 0 ^ 2 + 2 * 0 = 0 ↔ (0 : ℝ) = 0 ∨ (0 : ℝ) = -2 / 1 :=
  nepopolna_c0 1 2 0 one_ne_zero

/-- Razlaga 2 (b = 0): ax² + c = 0 ⇔ x² = −c/a (a ≠ 0).
trditev: MAT-SS-2/kvadratna-enacba#nepopolna-b0
besedilo: »$b = 0$: iz $ax^2 + c = 0$ sledi $x^2 = -\dfrac{c}{a}$.« -/
theorem nepopolna_b0 (a c x : ℝ) (ha : a ≠ 0) : a * x ^ 2 + c = 0 ↔ x ^ 2 = -c / a := by
  rw [eq_div_iff ha]
  constructor <;> intro h <;> linarith

/-- Predpostavka `nepopolna_b0` se da izpolniti (a = 1). -/
example : (1 : ℝ) * 3 ^ 2 + (-9) = 0 ↔ (3 : ℝ) ^ 2 = -(-9) / 1 := nepopolna_b0 1 (-9) 3 one_ne_zero

/-- Razlaga 2 (b = 0): če je −c/a < 0, enačba ax² + c = 0 nima realne rešitve, v ℂ pa sta rešitvi
x = ±i√(c/a).
trditev: MAT-SS-2/kvadratna-enacba#nepopolna-b0-kompleksno
besedilo: »$b = 0$: iz $ax^2 + c = 0$ sledi $x^2 = -\dfrac{c}{a}$. Če je desna stran negativna, sta rešitvi kompleksni: enačba $x^2 = -9$ da $x_{1,2} = \pm 3i$. Če je pozitivna, ima enačba obliko $x^2 = k$ s $k > 0$.« -/
theorem nepopolna_b0_kompleksno (a c : ℝ) (ha : a ≠ 0) (h : -c / a < 0) :
    (∀ x : ℝ, a * x ^ 2 + c ≠ 0) ∧ ∀ z : ℂ, (a : ℂ) * z ^ 2 + c = 0 ↔
      z = I * Real.sqrt (c / a) ∨ z = -(I * Real.sqrt (c / a)) := by
  have hca : 0 < c / a := by
    have : -c / a = -(c / a) := neg_div a c
    linarith
  refine ⟨fun x hx => ?_, fun z => ?_⟩
  · have := (nepopolna_b0 a c x ha).1 hx
    nlinarith [sq_nonneg x]
  · have hs : ((Real.sqrt (c / a) : ℝ) : ℂ) ^ 2 = (c : ℂ) / a := by
      rw [← ofReal_pow, Real.sq_sqrt hca.le]; push_cast; ring
    have ha' : (a : ℂ) ≠ 0 := ofReal_ne_zero.mpr ha
    have e : (a : ℂ) * z ^ 2 + c = a * ((z - I * Real.sqrt (c / a)) * (z - -(I * Real.sqrt (c / a)))) := by
      have hc : (c : ℂ) = a * ((c : ℂ) / a) := by field_simp
      linear_combination hc + (a * I ^ 2) * hs + (a * ((c : ℂ) / a)) * I_sq
    rw [e, mul_eq_zero, or_iff_right ha', dva_faktorja]

/-- Predpostavke `nepopolna_b0_kompleksno` se dajo izpolniti (x² + 4, a = 1, c = 4). -/
example : (∀ x : ℝ, 1 * x ^ 2 + 4 ≠ 0) ∧ ∀ z : ℂ, ((1 : ℝ) : ℂ) * z ^ 2 + ((4 : ℝ) : ℂ) = 0 ↔
    z = I * Real.sqrt (4 / 1) ∨ z = -(I * Real.sqrt (4 / 1)) :=
  nepopolna_b0_kompleksno 1 4 one_ne_zero (by norm_num)

/-- Razlaga 2: x² = −9 nima realne rešitve, v ℂ pa sta rešitvi x = ±3i.
trditev: MAT-SS-2/kvadratna-enacba#x2-minus9
besedilo: »Če je desna stran negativna, sta rešitvi kompleksni: enačba $x^2 = -9$ da $x_{1,2} = \pm 3i$.« -/
theorem x2_minus9 : (∀ x : ℝ, x ^ 2 ≠ -9) ∧ ∀ z : ℂ, z ^ 2 = -9 ↔ z = 3 * I ∨ z = -(3 * I) := by
  refine ⟨fun x h => by nlinarith [sq_nonneg x], fun z => ?_⟩
  rw [enacba_iff (P := (z - 3 * I) * (z - -(3 * I))) (by linear_combination 9 * I_sq),
    dva_faktorja]

/-- Razlaga 2 (korenjenje): za k > 0 je x² = k ⇔ x = √k ali x = −√k.
trditev: MAT-SS-2/kvadratna-enacba#korenjenje
besedilo: »ima enačba obliko $x^2 = k$ s $k > 0$.« -/
theorem korenjenje (k x : ℝ) (hk : 0 < k) : x ^ 2 = k ↔ x = Real.sqrt k ∨ x = -Real.sqrt k := by
  have hs : Real.sqrt k ^ 2 = k := Real.sq_sqrt hk.le
  rw [enacba_iff (P := (x - Real.sqrt k) * (x - -Real.sqrt k)) (by linear_combination hs),
    dva_faktorja]

/-- Predpostavka `korenjenje` se da izpolniti (k = 9). -/
example : (3 : ℝ) ^ 2 = 9 ↔ (3 : ℝ) = Real.sqrt 9 ∨ (3 : ℝ) = -Real.sqrt 9 :=
  korenjenje 9 3 (by norm_num)

/-- Razlaga 2 (razstavljanje): za k ≥ 0 je x² − k = (x − √k)(x + √k).
trditev: MAT-SS-2/kvadratna-enacba#razlika-kvadratov
besedilo: »z razstavljanjem**: $k$ prenesi na levo in uporabi razliko kvadratov, $x^2 - k = (x - \sqrt{k})(x + \sqrt{k})$. Enačba $x^2 - 9 = 0$ postane $(x - 3)(x + 3) = 0$, torej $x_1 = 3$ ali $x_2 = -3$.« -/
theorem razlika_kvadratov (k x : ℝ) (hk : 0 ≤ k) :
    x ^ 2 - k = (x - Real.sqrt k) * (x + Real.sqrt k) := by
  have hs : Real.sqrt k ^ 2 = k := Real.sq_sqrt hk
  linear_combination hs

/-- Predpostavka `razlika_kvadratov` se da izpolniti (k = 5). -/
example (x : ℝ) : x ^ 2 - 5 = (x - Real.sqrt 5) * (x + Real.sqrt 5) :=
  razlika_kvadratov 5 x (by norm_num)

/-- Razlaga 2: x² = 9 ⇔ x = ±3, in x² − 9 = (x − 3)(x + 3).
trditev: MAT-SS-2/kvadratna-enacba#x2-9
besedilo: »Enačba $x^2 - 9 = 0$ postane $(x - 3)(x + 3) = 0$, torej $x_1 = 3$ ali $x_2 = -3$.« -/
theorem x2_9 (x : ℝ) : (x ^ 2 = 9 ↔ x = 3 ∨ x = -3) ∧ x ^ 2 - 9 = (x - 3) * (x + 3) := by
  refine ⟨?_, by ring⟩
  rw [enacba_iff (P := (x - 3) * (x - -3)) (by ring), dva_faktorja]

/-- Razlaga 2: x² = 5 ⇔ x = ±√5, x² − 5 = (x − √5)(x + √5).
trditev: MAT-SS-2/kvadratna-enacba#x2-5
besedilo: »$x^2 - 5 = (x - \sqrt{5})(x + \sqrt{5})$« -/
theorem x2_5 (x : ℝ) : (x ^ 2 = 5 ↔ x = Real.sqrt 5 ∨ x = -Real.sqrt 5) ∧
    x ^ 2 - 5 = (x - Real.sqrt 5) * (x + Real.sqrt 5) :=
  ⟨korenjenje 5 x (by norm_num), razlika_kvadratov 5 x (by norm_num)⟩

/-- Razlaga 2, Preveri: x² = 5x ⇔ x(x − 5) = 0 ⇔ x = 0 ali x = 5.
trditev: MAT-SS-2/kvadratna-enacba#preveri-x2-5x
besedilo: »Preveri:* reši $x^2 = 5x$. (Iz $x(x - 5) = 0$ sledi $x_1 = 0$ in $x_2 = 5$; z $x$ ne deli.)« -/
theorem preveri_x2_5x (x : ℝ) : x ^ 2 = 5 * x ↔ x = 0 ∨ x = 5 := by
  rw [enacba_iff (P := (x - 0) * (x - 5)) (by ring), dva_faktorja]

/-- Razlaga 3: x³ − 4x = x(x² − 4) = x(x − 2)(x + 2), zato x³ = 4x ⇔ x ∈ {0, 2, −2}.
trditev: MAT-SS-2/kvadratna-enacba#x3-4x
besedilo: »Izpostavimo $x$ in dobimo $x(x^2 - 4) = 0$, z razliko kvadratov pa $x(x - 2)(x + 2) = 0$.« -/
theorem x3_4x (x : ℝ) : x ^ 3 = 4 * x ↔ x = 0 ∨ x = 2 ∨ x = -2 := by
  have e : x ^ 3 - 4 * x = (x - 0) * (x - 2) * (x - -2) := by
    calc x ^ 3 - 4 * x = x * (x ^ 2 - 4) := by ring
      _ = x * (x - 2) * (x + 2) := by ring
      _ = (x - 0) * (x - 2) * (x - -2) := by ring
  rw [enacba_iff e, trije_faktorji]

/-- Razlaga 3, Preveri: (x + 1)(x² − 9) = 0 ⇔ x ∈ {−1, 3, −3}.
trditev: MAT-SS-2/kvadratna-enacba#preveri-razcepna
besedilo: »(Iz $x + 1 = 0$ ali $x^2 - 9 = 0$ sledi $x_1 = -1$, $x_2 = 3$ in $x_3 = -3$.)« -/
theorem preveri_razcepna (x : ℝ) : (x + 1) * (x ^ 2 - 9) = 0 ↔ x = -1 ∨ x = 3 ∨ x = -3 := by
  rw [enacba_iff (P := (x - -1) * (x - 3) * (x - -3)) (by ring), trije_faktorji]

/-! ## Obrazec in diskriminanta -/

/-- Razlaga 4, Povzetek: obrazec za rešitvi, za a ≠ 0 in D = b² − 4ac ≥ 0:
ax² + bx + c = 0 ⇔ x = (−b ± √D)/(2a).
trditev: MAT-SS-2/kvadratna-enacba#obrazec
besedilo: »$h(t) = v_0 t - \dfrac{g}{2}t^2$; enačba $h(t) = h_1$ v splošni obliki: $\dfrac{g}{2}t^2 - v_0 t + h_1 = 0$; $\; D = b^2 - 4ac$, $\; t_{1,2} = \dfrac{-b \pm \sqrt{D}}{2a}$« -/
theorem obrazec (a b c x : ℝ) (ha : a ≠ 0) (hD : 0 ≤ b ^ 2 - 4 * a * c) :
    a * x ^ 2 + b * x + c = 0 ↔
      x = (-b + Real.sqrt (b ^ 2 - 4 * a * c)) / (2 * a) ∨
      x = (-b - Real.sqrt (b ^ 2 - 4 * a * c)) / (2 * a) := by
  have h := quadratic_eq_zero_iff ha (s := Real.sqrt (b ^ 2 - 4 * a * c))
    (by rw [discrim, Real.mul_self_sqrt hD]) x
  rw [show a * x ^ 2 + b * x + c = a * (x * x) + b * x + c by ring]
  exact h

/-- Predpostavke `obrazec` se dajo izpolniti (x² − 1 = 0). -/
example : (1 : ℝ) * 1 ^ 2 + 0 * 1 + (-1) = 0 ↔
    (1 : ℝ) = (-0 + Real.sqrt (0 ^ 2 - 4 * 1 * (-1))) / (2 * 1) ∨
    (1 : ℝ) = (-0 - Real.sqrt (0 ^ 2 - 4 * 1 * (-1))) / (2 * 1) :=
  obrazec 1 0 (-1) 1 one_ne_zero (by norm_num)

/-- Razlaga 5 (D > 0): rešitvi iz obrazca sta različni (graf seka os x v dveh točkah).
trditev: MAT-SS-2/kvadratna-enacba#d-poz-razlicni
besedilo: »$D > 0$: dve različni realni rešitvi, graf seka os $x$ v dveh točkah;« -/
theorem D_poz_razlicni (a b c : ℝ) (ha : a ≠ 0) (hD : 0 < b ^ 2 - 4 * a * c) :
    (-b + Real.sqrt (b ^ 2 - 4 * a * c)) / (2 * a) ≠
      (-b - Real.sqrt (b ^ 2 - 4 * a * c)) / (2 * a) := by
  have hs : 0 < Real.sqrt (b ^ 2 - 4 * a * c) := Real.sqrt_pos.2 hD
  intro h
  rw [div_left_inj₀ (mul_ne_zero two_ne_zero ha)] at h
  linarith

/-- Predpostavke `D_poz_razlicni` se dajo izpolniti (x² − 1, D = 4). -/
example : (-0 + Real.sqrt ((0 : ℝ) ^ 2 - 4 * 1 * (-1))) / (2 * 1) ≠
    (-0 - Real.sqrt ((0 : ℝ) ^ 2 - 4 * 1 * (-1))) / (2 * 1) :=
  D_poz_razlicni 1 0 (-1) one_ne_zero (by norm_num)

/-- Razlaga 5, Za maturo 2 a): enačba ima dve različni realni rešitvi natanko tedaj, ko je D > 0
(a ≠ 0).
trditev: MAT-SS-2/kvadratna-enacba#dve-realni-iff
besedilo: »$D > 0$: dve različni realni rešitvi, graf seka os $x$ v dveh točkah;« -/
theorem dve_realni_iff (a b c : ℝ) (ha : a ≠ 0) :
    (∃ x₁ x₂ : ℝ, x₁ ≠ x₂ ∧ a * x₁ ^ 2 + b * x₁ + c = 0 ∧ a * x₂ ^ 2 + b * x₂ + c = 0) ↔
      0 < b ^ 2 - 4 * a * c := by
  constructor
  · rintro ⟨x₁, x₂, hne, e1, e2⟩
    have hsub : x₁ - x₂ ≠ 0 := sub_ne_zero.mpr hne
    have hs : a * (x₁ + x₂) + b = 0 := by
      have h0 : (x₁ - x₂) * (a * (x₁ + x₂) + b) = 0 := by linear_combination e1 - e2
      exact (mul_eq_zero.mp h0).resolve_left hsub
    have hD : b ^ 2 - 4 * a * c = (a * (x₁ - x₂)) ^ 2 := by
      linear_combination (-4 * a) * e1 + (a * (x₁ + x₂) + b + 2 * a * (x₁ - x₂)) * hs
    rw [hD]
    exact lt_of_le_of_ne (sq_nonneg _) (Ne.symm (pow_ne_zero 2 (mul_ne_zero ha hsub)))
  · intro hD
    refine ⟨_, _, D_poz_razlicni a b c ha hD, ?_, ?_⟩
    · exact (obrazec a b c _ ha hD.le).2 (Or.inl rfl)
    · exact (obrazec a b c _ ha hD.le).2 (Or.inr rfl)

/-- Predpostavka `dve_realni_iff` se da izpolniti (a = 1). -/
example : (∃ x₁ x₂ : ℝ, x₁ ≠ x₂ ∧ 1 * x₁ ^ 2 + 0 * x₁ + (-1) = 0 ∧ 1 * x₂ ^ 2 + 0 * x₂ + (-1) = 0) :=
  (dve_realni_iff 1 0 (-1) one_ne_zero).2 (by norm_num)

/-- Razlaga 5 (D = 0): ena dvojna rešitev x = −b/(2a); teme (−b/(2a), 0) leži na osi x.
trditev: MAT-SS-2/kvadratna-enacba#d-nic
besedilo: »$D = 0$: ena dvojna realna rešitev $x_1 = x_2 = -\dfrac{b}{2a}$, teme leži na osi $x$;« -/
theorem D_nic (a b c x : ℝ) (ha : a ≠ 0) (hD : b ^ 2 - 4 * a * c = 0) :
    (a * x ^ 2 + b * x + c = 0 ↔ x = -b / (2 * a)) := by
  rw [show a * x ^ 2 + b * x + c = a * (x * x) + b * x + c by ring]
  exact quadratic_eq_zero_iff_of_discrim_eq_zero ha (by rw [discrim]; exact hD) x

/-- Predpostavke `D_nic` se dajo izpolniti (x² − 2x + 1, D = 0). -/
example : (1 : ℝ) * 1 ^ 2 + (-2) * 1 + 1 = 0 ↔ (1 : ℝ) = -(-2) / (2 * 1) :=
  D_nic 1 (-2) 1 1 one_ne_zero (by norm_num)

/-- Preveri se, vprašanje 1: graf se osi x dotakne v eni sami točki (enačba ima natanko eno realno
rešitev) natanko tedaj, ko je D = 0.
trditev: MAT-SS-2/kvadratna-enacba#ena-resitev-iff
besedilo: »Graf funkcije $f(x) = ax^2 + bx + c$ se osi $x$ le dotakne, v eni sami točki. Kaj velja za enačbo $ax^2 + bx + c = 0$?« -/
theorem ena_resitev_iff (a b c : ℝ) (ha : a ≠ 0) :
    (∃! x : ℝ, a * x ^ 2 + b * x + c = 0) ↔ b ^ 2 - 4 * a * c = 0 := by
  have e : ∀ x : ℝ, a * x ^ 2 + b * x + c = a * (x * x) + b * x + c := fun x => by ring
  simp only [e]
  exact (discrim_eq_zero_iff ha).symm.trans (by rw [discrim])

/-- Predpostavka `ena_resitev_iff` se da izpolniti (a = 1). -/
example : (∃! x : ℝ, 1 * x ^ 2 + (-2) * x + 1 = 0) :=
  (ena_resitev_iff 1 (-2) 1 one_ne_zero).2 (by norm_num)

/-- Razlaga 5 (D < 0): realnih rešitev ni, graf ne seka osi x.
trditev: MAT-SS-2/kvadratna-enacba#d-neg
besedilo: »$D < 0$: dve konjugirano kompleksni rešitvi, graf ne seka osi $x$.« -/
theorem D_neg (a b c : ℝ) (hD : b ^ 2 - 4 * a * c < 0) (x : ℝ) : a * x ^ 2 + b * x + c ≠ 0 := by
  rw [show a * x ^ 2 + b * x + c = a * (x * x) + b * x + c by ring]
  exact quadratic_ne_zero_of_discrim_ne_sq (fun s h => by
    rw [discrim] at h; nlinarith [sq_nonneg s]) x

/-- Predpostavka `D_neg` se da izpolniti (x² + 1, D = −4). -/
example : (1 : ℝ) * 0 ^ 2 + 0 * 0 + 1 ≠ 0 := D_neg 1 0 1 (by norm_num) 0

/-- Razlaga 6: za D < 0 je (i√(−D))² = i²·(−D) = D.
trditev: MAT-SS-2/kvadratna-enacba#koren-negativnega
besedilo: »6. Negativna diskriminanta.** Pri $D < 0$ realnih rešitev ni, v kompleksnih pa sta dve. Negativno število $D$ ima kvadratna korena $\pm i\sqrt{-D}$, saj je $\left(i\sqrt{-D}\right)^2 = i^2 \cdot (-D) = D$. Zato« -/
theorem koren_negativnega (D : ℝ) (hD : D < 0) :
    (I * (Real.sqrt (-D) : ℂ)) ^ 2 = I ^ 2 * ((-D : ℝ) : ℂ) ∧ I ^ 2 * ((-D : ℝ) : ℂ) = D := by
  have hs : ((Real.sqrt (-D) : ℝ) : ℂ) ^ 2 = ((-D : ℝ) : ℂ) := by
    rw [← ofReal_pow, Real.sq_sqrt (by linarith)]
  constructor
  · rw [mul_pow, hs]
  · rw [I_sq]; push_cast; ring

/-- Predpostavka `koren_negativnega` se da izpolniti (D = −16). -/
example : (I * (Real.sqrt (-(-16)) : ℂ)) ^ 2 = I ^ 2 * ((-(-16) : ℝ) : ℂ) ∧
    I ^ 2 * ((-(-16) : ℝ) : ℂ) = ((-16 : ℝ) : ℂ) :=
  koren_negativnega (-16) (by norm_num)

/-- Razlaga 6, Ustno vprašanje 1, Bolj natančno: za realne a ≠ 0, b, c z D < 0 ima enačba v ℂ rešitvi
x = (−b ± i√(−D))/(2a).
trditev: MAT-SS-2/kvadratna-enacba#obrazec-kompleksno
besedilo: »Pri $D < 0$ korenimo v $\mathbb{C}$: negativno število $\dfrac{D}{4a^2}$ ima kvadratna korena $\pm \dfrac{i\sqrt{-D}}{2a}$.« -/
theorem obrazec_kompleksno (a b c : ℝ) (ha : a ≠ 0) (hD : b ^ 2 - 4 * a * c < 0) (z : ℂ) :
    (a : ℂ) * z ^ 2 + b * z + c = 0 ↔
      z = (-b + I * Real.sqrt (-(b ^ 2 - 4 * a * c))) / (2 * a) ∨
      z = (-b - I * Real.sqrt (-(b ^ 2 - 4 * a * c))) / (2 * a) := by
  have hs : ((Real.sqrt (-(b ^ 2 - 4 * a * c)) : ℝ) : ℂ) * (Real.sqrt (-(b ^ 2 - 4 * a * c)) : ℂ) =
      ((-(b ^ 2 - 4 * a * c) : ℝ) : ℂ) := by
    rw [← ofReal_mul, Real.mul_self_sqrt (by linarith)]
  have hd : discrim (a : ℂ) b c = (I * Real.sqrt (-(b ^ 2 - 4 * a * c))) *
      (I * Real.sqrt (-(b ^ 2 - 4 * a * c))) := by
    rw [discrim, show I * ((Real.sqrt (-(b ^ 2 - 4 * a * c)) : ℝ) : ℂ) *
      (I * ((Real.sqrt (-(b ^ 2 - 4 * a * c)) : ℝ) : ℂ)) = (I * I) *
      (((Real.sqrt (-(b ^ 2 - 4 * a * c)) : ℝ) : ℂ) * ((Real.sqrt (-(b ^ 2 - 4 * a * c)) : ℝ) : ℂ))
      by ring, hs, I_mul_I]
    push_cast; ring
  rw [show (a : ℂ) * z ^ 2 + b * z + c = a * (z * z) + b * z + c by ring]
  exact quadratic_eq_zero_iff (ofReal_ne_zero.mpr ha) hd z

/-- Predpostavke `obrazec_kompleksno` se dajo izpolniti (z² + 1 = 0). -/
example : ((1 : ℝ) : ℂ) * I ^ 2 + ((0 : ℝ) : ℂ) * I + ((1 : ℝ) : ℂ) = 0 ↔
    I = (-((0 : ℝ) : ℂ) + I * Real.sqrt (-((0 : ℝ) ^ 2 - 4 * 1 * 1))) / (2 * ((1 : ℝ) : ℂ)) ∨
    I = (-((0 : ℝ) : ℂ) - I * Real.sqrt (-((0 : ℝ) ^ 2 - 4 * 1 * 1))) / (2 * ((1 : ℝ) : ℂ)) :=
  obrazec_kompleksno 1 0 1 one_ne_zero (by norm_num) I

/-- Razlaga 6: kompleksni rešitvi sta konjugirani (razlikujeta se le v predznaku imaginarnega dela).
trditev: MAT-SS-2/kvadratna-enacba#konjugirani
besedilo: »Rešitvi se razlikujeta le v predznaku imaginarnega dela, torej sta konjugirani kompleksni števili.« -/
theorem konjugirani (a b D : ℝ) (_hD : D < 0) (_ha : a ≠ 0) :
    (starRingEnd ℂ) ((-b + I * Real.sqrt (-D)) / (2 * a)) = (-b - I * Real.sqrt (-D)) / (2 * a) := by
  simp [map_div₀, sub_eq_add_neg, map_ofNat]

/-- Predpostavki `konjugirani` se dasta izpolniti (a = 1, D = −4). -/
example : (starRingEnd ℂ) ((-((0 : ℝ) : ℂ) + I * Real.sqrt (-(-4))) / (2 * ((1 : ℝ) : ℂ))) =
    (-((0 : ℝ) : ℂ) - I * Real.sqrt (-(-4))) / (2 * ((1 : ℝ) : ℂ)) :=
  konjugirani 1 0 (-4) (by norm_num) one_ne_zero

/-- Drugače: Na sliki: realni del kompleksnih rešitev je −b/(2a) (simetrijska os ostane).
trditev: MAT-SS-2/kvadratna-enacba#realni-del
besedilo: »Pri $D < 0$ simetrijska os ostane, ničel pa ni: realni del obeh kompleksnih rešitev je ravno $-\dfrac{b}{2a}$.« -/
theorem realni_del (a b s : ℝ) :
    (((-b / (2 * a) : ℝ) : ℂ) + ((s / (2 * a) : ℝ) : ℂ) * I).re = -b / (2 * a) := by
  simp only [add_re, ofReal_re, mul_re, ofReal_im, I_re, I_im]; ring

/-- Drugače: Na sliki: (−b + i·s)/(2a) = −b/(2a) + (s/(2a))·i (a ≠ 0), zato je realni del −b/(2a).
trditev: MAT-SS-2/kvadratna-enacba#kompleksna-oblika
besedilo: »Pri $D < 0$ simetrijska os ostane, ničel pa ni: realni del obeh kompleksnih rešitev je ravno $-\dfrac{b}{2a}$.« -/
theorem kompleksna_oblika (a b s : ℝ) (ha : a ≠ 0) :
    (-(b : ℂ) + I * s) / (2 * a) = ((-b / (2 * a) : ℝ) : ℂ) + ((s / (2 * a) : ℝ) : ℂ) * I := by
  have : (a : ℂ) ≠ 0 := ofReal_ne_zero.mpr ha
  push_cast
  field_simp

/-- Predpostavka `kompleksna_oblika` se da izpolniti (a = 1). -/
example : (-((2 : ℝ) : ℂ) + I * ((4 : ℝ) : ℂ)) / (2 * ((1 : ℝ) : ℂ)) =
    ((-2 / (2 * 1) : ℝ) : ℂ) + ((4 / (2 * 1) : ℝ) : ℂ) * I := kompleksna_oblika 1 2 4 one_ne_zero

/-- Drugače: Na sliki: ko pri a > 0 povečamo c, se D zmanjša.
trditev: MAT-SS-2/kvadratna-enacba#d-pada-s-c
besedilo: »$$x^2 + \frac{b}{a}x + \frac{c}{a} = 0 \;\Longrightarrow\; \left(x + \frac{b}{2a}\right)^2 = \frac{b^2 - 4ac}{4a^2} = \frac{D}{4a^2}.$$« -/
theorem D_pada_s_c (a b c c' : ℝ) (ha : 0 < a) (h : c < c') :
    b ^ 2 - 4 * a * c' < b ^ 2 - 4 * a * c := by nlinarith

/-- Predpostavke `D_pada_s_c` se dajo izpolniti. -/
example : (0 : ℝ) ^ 2 - 4 * 1 * 1 < 0 ^ 2 - 4 * 1 * 0 := D_pada_s_c 1 0 0 1 one_pos one_pos

/-- Razlaga 4, Preveri: pri x² + 2x − 3 = 0 je D = 4 + 12 = 16.
trditev: MAT-SS-2/kvadratna-enacba#preveri-d16
besedilo: »Preveri:* koliko je $D$ pri $x^2 + 2x - 3 = 0$? ($D = 4 + 12 = 16$.)« -/
theorem preveri_D16 : (2 : ℝ) ^ 2 - 4 * 1 * (-3) = 4 + 12 ∧ (4 : ℝ) + 12 = 16 := by norm_num

/-- Razlaga 5, Preveri: x² − 6x + 9 = 0 ima D = 36 − 36 = 0 in eno dvojno rešitev x = 3.
trditev: MAT-SS-2/kvadratna-enacba#preveri-dvojna
besedilo: »Preveri:* koliko realnih rešitev ima $x^2 - 6x + 9 = 0$? ($D = 36 - 36 = 0$: ena dvojna, $x = 3$.)« -/
theorem preveri_dvojna (x : ℝ) : ((-6 : ℝ) ^ 2 - 4 * 1 * 9 = 36 - 36 ∧ (36 : ℝ) - 36 = 0) ∧
    (x ^ 2 - 6 * x + 9 = 0 ↔ x = 3) := by
  refine ⟨by norm_num, ?_⟩
  rw [enacba_iff (P := (x - 3) * (x - 3)) (by ring), dva_faktorja, or_self]

/-- Razlaga 6, Preveri: x² + 2x + 5 = 0 ima D = −16, rešitvi (−2 ± 4i)/2 = −1 ± 2i.
trditev: MAT-SS-2/kvadratna-enacba#preveri-kompleksna
besedilo: »Preveri:* reši $x^2 + 2x + 5 = 0$. ($D = -16$, $x_{1,2} = \dfrac{-2 \pm 4i}{2} = -1 \pm 2i$.)« -/
theorem preveri_kompleksna (z : ℂ) : ((2 : ℝ) ^ 2 - 4 * 1 * 5 = -16) ∧
    ((-2 + 4 * I) / 2 = -1 + 2 * I ∧ (-2 - 4 * I) / 2 = -1 - 2 * I) ∧
    (z ^ 2 + 2 * z + 5 = 0 ↔ z = -1 + 2 * I ∨ z = -1 - 2 * I) := by
  refine ⟨by norm_num, ⟨by ring, by ring⟩, ?_⟩
  rw [enacba_iff (P := (z - (-1 + 2 * I)) * (z - (-1 - 2 * I))) (by linear_combination 4 * I_sq),
    dva_faktorja]

/-! ## Vietovi formuli in razcep -/

/-- Razlaga 7, Ustno vprašanje 2, Bolj natančno: Vietovi formuli. Če je s·s = D = b² − 4ac (s = √D v ℝ
ali s = i√(−D) v ℂ; pri s = 0 dvojna rešitev), za x₁,₂ = (−b ± s)/(2a) velja x₁ + x₂ = −b/a in
x₁x₂ = ((−b)² − s²)/(4a²) = c/a.
trditev: MAT-SS-2/kvadratna-enacba#vieta
besedilo: »$D = b^2 - 4ac$, $\; x_{1,2} = \dfrac{-b \pm \sqrt{D}}{2a}$, $\; x_1 + x_2 = -\dfrac{b}{a}$, $\; x_1 x_2 = \dfrac{c}{a}$« -/
theorem vieta {K : Type*} [Field K] [NeZero (2 : K)] (a b c s : K) (ha : a ≠ 0)
    (hs : s * s = b ^ 2 - 4 * a * c) :
    (-b + s) / (2 * a) + (-b - s) / (2 * a) = -b / a ∧
      (-b + s) / (2 * a) * ((-b - s) / (2 * a)) = ((-b) ^ 2 - s * s) / (4 * a ^ 2) ∧
      ((-b) ^ 2 - s * s) / (4 * a ^ 2) = c / a := by
  have h2 : (2 : K) ≠ 0 := NeZero.ne 2
  refine ⟨?_, ?_, ?_⟩
  · rw [← add_div, div_eq_div_iff (mul_ne_zero h2 ha) ha]; ring
  · rw [div_mul_div_comm]; ring
  · have h4 : (4 : K) ≠ 0 := by
      rw [show (4 : K) = 2 * 2 by norm_num]; exact mul_ne_zero h2 h2
    rw [div_eq_div_iff (mul_ne_zero h4 (pow_ne_zero 2 ha)) ha, hs]; ring

/-- Predpostavke `vieta` se dajo izpolniti (x² − 1, s = 2). -/
example : ((-0 + 2) / (2 * 1) + (-0 - 2) / (2 * 1) = (-0 : ℝ) / 1) ∧
    (-(0 : ℝ) + 2) / (2 * 1) * ((-0 - 2) / (2 * 1)) = ((-0) ^ 2 - 2 * 2) / (4 * 1 ^ 2) ∧
    ((-0 : ℝ) ^ 2 - 2 * 2) / (4 * 1 ^ 2) = -1 / 1 :=
  vieta (1 : ℝ) 0 (-1) 2 one_ne_zero (by norm_num)

/-- Razlaga 7, Povzetek, Bolj natančno: iz Vietovih formul sledi razcep
ax² + bx + c = a(x² − (x₁ + x₂)x + x₁x₂) = a(x − x₁)(x − x₂).
trditev: MAT-SS-2/kvadratna-enacba#razcep
besedilo: »Razcep.** Iz Vietovih formul sledi $a(x - x_1)(x - x_2) = a\left(x^2 - (x_1 + x_2)x + x_1 x_2\right) = ax^2 + bx + c$.« -/
theorem razcep {K : Type*} [Field K] (a b c x₁ x₂ : K) (ha : a ≠ 0)
    (h1 : x₁ + x₂ = -b / a) (h2 : x₁ * x₂ = c / a) (x : K) :
    a * x ^ 2 + b * x + c = a * (x ^ 2 - (x₁ + x₂) * x + x₁ * x₂) ∧
      a * (x ^ 2 - (x₁ + x₂) * x + x₁ * x₂) = a * (x - x₁) * (x - x₂) := by
  have hb : b = -a * (x₁ + x₂) := by rw [h1]; field_simp
  have hc : c = a * (x₁ * x₂) := by rw [h2]; field_simp
  exact ⟨by rw [hb, hc]; ring, by ring⟩

/-- Predpostavke `razcep` se dajo izpolniti (x² − 1 z ničlama 1 in −1). -/
example (x : ℝ) : 1 * x ^ 2 + 0 * x + (-1) = 1 * (x ^ 2 - (1 + -1) * x + 1 * -1) ∧
    1 * (x ^ 2 - (1 + -1) * x + 1 * -1) = 1 * (x - 1) * (x - -1) :=
  razcep 1 0 (-1) 1 (-1) one_ne_zero (by norm_num) (by norm_num) x

/-- Razlaga 7, Povzetek (sestavljanje enačbe): x₁ in x₂ sta rešitvi enačbe x² − (x₁ + x₂)x + x₁x₂ = 0,
saj je to (x − x₁)(x − x₂).
trditev: MAT-SS-2/kvadratna-enacba#sestavljanje
besedilo: »sestavljanje enačbe** z danima rešitvama: $x^2 - (x_1 + x_2)x + x_1 x_2 = 0$,« -/
theorem sestavljanje (x₁ x₂ x : ℝ) :
    x ^ 2 - (x₁ + x₂) * x + x₁ * x₂ = (x - x₁) * (x - x₂) ∧
      (x ^ 2 - (x₁ + x₂) * x + x₁ * x₂ = 0 ↔ x = x₁ ∨ x = x₂) := by
  refine ⟨by ring, ?_⟩
  rw [show x ^ 2 - (x₁ + x₂) * x + x₁ * x₂ = (x - x₁) * (x - x₂) by ring, dva_faktorja]

/-- Bolj natančno: vsaka kvadratna enačba (a ≠ 0) ima v ℂ dve rešitvi (dvojno štejemo dvakrat):
ax² + bx + c = a(x − x₁)(x − x₂).
trditev: MAT-SS-2/kvadratna-enacba#razcep-v-c
besedilo: »Zato ima kvadratna enačba z realnimi koeficienti v $\mathbb{C}$ vedno dve rešitvi, če dvojno rešitev štejemo dvakrat.« -/
theorem razcep_v_C (a b c : ℂ) (ha : a ≠ 0) :
    ∃ x₁ x₂ : ℂ, ∀ x, a * x ^ 2 + b * x + c = a * (x - x₁) * (x - x₂) := by
  obtain ⟨s, hs⟩ := IsAlgClosed.exists_pow_nat_eq (b ^ 2 - 4 * a * c) (n := 2) two_pos
  have hs' : s * s = b ^ 2 - 4 * a * c := by rw [← hs]; ring
  obtain ⟨h1, h2, h3⟩ := vieta a b c s ha hs'
  refine ⟨(-b + s) / (2 * a), (-b - s) / (2 * a), fun x => ?_⟩
  obtain ⟨e1, e2⟩ := razcep a b c _ _ ha h1 (h2.trans h3) x
  exact e1.trans e2

/-- Predpostavka `razcep_v_C` se da izpolniti (a = 1). -/
example : ∃ x₁ x₂ : ℂ, ∀ x, 1 * x ^ 2 + 0 * x + 1 = 1 * (x - x₁) * (x - x₂) :=
  razcep_v_C 1 0 1 one_ne_zero

/-- Bolj natančno: pri D ≥ 0 (a ≠ 0) se ax² + bx + c v ℝ razstavi na linearna faktorja
a(x − x₁)(x − x₂) z x₁,₂ = (−b ± √D)/(2a) (Vieta s s = √D).
trditev: MAT-SS-2/kvadratna-enacba#razcep-v-r
besedilo: »$D = b^2 - 4ac$, $\; x_{1,2} = \dfrac{-b \pm \sqrt{D}}{2a}$, $\; x_1 + x_2 = -\dfrac{b}{a}$, $\; x_1 x_2 = \dfrac{c}{a}$« -/
theorem razcep_v_R (a b c : ℝ) (ha : a ≠ 0) (hD : 0 ≤ b ^ 2 - 4 * a * c) :
    ∀ x, a * x ^ 2 + b * x + c = a * (x - (-b + Real.sqrt (b ^ 2 - 4 * a * c)) / (2 * a)) *
      (x - (-b - Real.sqrt (b ^ 2 - 4 * a * c)) / (2 * a)) := by
  obtain ⟨h1, h2, h3⟩ := vieta a b c _ ha (Real.mul_self_sqrt hD)
  intro x
  obtain ⟨e1, e2⟩ := razcep a b c _ _ ha h1 (h2.trans h3) x
  exact e1.trans e2

/-- Predpostavke `razcep_v_R` se dajo izpolniti (x² − 1). -/
example : ∀ x : ℝ, 1 * x ^ 2 + 0 * x + (-1) = 1 * (x - (-0 + Real.sqrt (0 ^ 2 - 4 * 1 * (-1))) / (2 * 1)) *
    (x - (-0 - Real.sqrt (0 ^ 2 - 4 * 1 * (-1))) / (2 * 1)) :=
  razcep_v_R 1 0 (-1) one_ne_zero (by norm_num)

/-- Bolj natančno: pri D < 0 se ax² + bx + c v ℝ ne da razstaviti na linearna faktorja
a(x − x₁)(x − x₂) (sicer bi bil x₁ realna rešitev).
trditev: MAT-SS-2/kvadratna-enacba#ni-razcepa-v-r
besedilo: »$a(x - x_1)(x - x_2) = a\left(x^2 - (x_1 + x_2)x + x_1 x_2\right) = ax^2 + bx + c$« -/
theorem ni_razcepa_v_R (a b c : ℝ) (hD : b ^ 2 - 4 * a * c < 0) :
    ¬∃ x₁ x₂ : ℝ, ∀ x, a * x ^ 2 + b * x + c = a * (x - x₁) * (x - x₂) := by
  rintro ⟨x₁, x₂, h⟩
  exact D_neg a b c hD x₁ (by rw [h x₁]; ring)

/-- Predpostavka `ni_razcepa_v_R` se da izpolniti (x² + 1, D = −4). -/
example : ¬∃ x₁ x₂ : ℝ, ∀ x, 1 * x ^ 2 + 0 * x + 1 = 1 * (x - x₁) * (x - x₂) :=
  ni_razcepa_v_R 1 0 1 (by norm_num)

/-- Bolj natančno: za a ≠ 0 je ax² + bx + c = 0 ⇔ (x + b/(2a))² = (b² − 4ac)/(4a²) = D/(4a²);
imenovalec 4a² je pozitiven.
trditev: MAT-SS-2/kvadratna-enacba#dopolnjevanje
besedilo: »$$x^2 + \frac{b}{a}x + \frac{c}{a} = 0 \;\Longrightarrow\; \left(x + \frac{b}{2a}\right)^2 = \frac{b^2 - 4ac}{4a^2} = \frac{D}{4a^2}.$$« -/
theorem dopolnjevanje (a b c x : ℝ) (ha : a ≠ 0) :
    (a * x ^ 2 + b * x + c = 0 ↔ x ^ 2 + b / a * x + c / a = 0) ∧
      (x ^ 2 + b / a * x + c / a = 0 ↔ (x + b / (2 * a)) ^ 2 = (b ^ 2 - 4 * a * c) / (4 * a ^ 2)) ∧
      0 < 4 * a ^ 2 := by
  refine ⟨?_, ?_, by positivity⟩
  · have e : x ^ 2 + b / a * x + c / a = (a * x ^ 2 + b * x + c) / a := by field_simp
    rw [e, div_eq_zero_iff]; simp [ha]
  · have e : (x + b / (2 * a)) ^ 2 - (b ^ 2 - 4 * a * c) / (4 * a ^ 2) = x ^ 2 + b / a * x + c / a := by
      field_simp; ring
    rw [← sub_eq_zero (a := (x + b / (2 * a)) ^ 2), e]

/-- Predpostavka `dopolnjevanje` se da izpolniti (a = 1). -/
example : 0 < 4 * (1 : ℝ) ^ 2 := (dopolnjevanje 1 0 0 0 one_ne_zero).2.2

/-- Bolj natančno: pri D ≥ 0 iz (x + b/(2a))² = D/(4a²) sledi x + b/(2a) = ±√D/(2a).
trditev: MAT-SS-2/kvadratna-enacba#korenjenje-kvadrata
besedilo: »$$x^2 + \frac{b}{a}x + \frac{c}{a} = 0 \;\Longrightarrow\; \left(x + \frac{b}{2a}\right)^2 = \frac{b^2 - 4ac}{4a^2} = \frac{D}{4a^2}.$$« -/
theorem korenjenje_kvadrata (a b c x : ℝ) (_ha : a ≠ 0) (hD : 0 ≤ b ^ 2 - 4 * a * c) :
    (x + b / (2 * a)) ^ 2 = (b ^ 2 - 4 * a * c) / (4 * a ^ 2) ↔
      x + b / (2 * a) = Real.sqrt (b ^ 2 - 4 * a * c) / (2 * a) ∨
      x + b / (2 * a) = -(Real.sqrt (b ^ 2 - 4 * a * c) / (2 * a)) := by
  have hs : Real.sqrt (b ^ 2 - 4 * a * c) ^ 2 = b ^ 2 - 4 * a * c := Real.sq_sqrt hD
  have e : (b ^ 2 - 4 * a * c) / (4 * a ^ 2) = (Real.sqrt (b ^ 2 - 4 * a * c) / (2 * a)) ^ 2 := by
    rw [div_pow, hs]; ring
  rw [e, sq_eq_sq_iff_eq_or_eq_neg]

/-- Predpostavke `korenjenje_kvadrata` se dajo izpolniti (a = 1, b = 0, c = −1). -/
example : ((1 : ℝ) + 0 / (2 * 1)) ^ 2 = (0 ^ 2 - 4 * 1 * (-1)) / (4 * 1 ^ 2) ↔
    (1 : ℝ) + 0 / (2 * 1) = Real.sqrt (0 ^ 2 - 4 * 1 * (-1)) / (2 * 1) ∨
    (1 : ℝ) + 0 / (2 * 1) = -(Real.sqrt (0 ^ 2 - 4 * 1 * (-1)) / (2 * 1)) :=
  korenjenje_kvadrata 1 0 (-1) 1 one_ne_zero (by norm_num)

/-- Drugače: Na sliki: ničli sta simetrični glede na os x = −b/(2a): x₁ + x₂ = −b/a = 2·(−b/(2a)).
trditev: MAT-SS-2/kvadratna-enacba#vsota-simetrija
besedilo: »ničli sta simetrični glede na os $x = -\dfrac{b}{2a}$,« -/
theorem vsota_simetrija (a b : ℝ) (ha : a ≠ 0) : -b / a = 2 * (-b / (2 * a)) := by
  field_simp

/-- Predpostavka `vsota_simetrija` se da izpolniti (a = 1). -/
example : -(2 : ℝ) / 1 = 2 * (-2 / (2 * 1)) := vsota_simetrija 1 2 one_ne_zero

/-- Razlaga 7, premisli: x² − 10x + 21 = 0 ⇔ x ∈ {3, 7}; edina para celih števil z vsoto 10 in
produktom 21 sta (3, 7) in (7, 3).
trditev: MAT-SS-2/kvadratna-enacba#premisli-vieta
besedilo: »Rešitvi sta $3$ in $7$. Po Vietu iščeš dve števili z vsoto $10$ in produktom $21$; med celimi delitelji števila $21$ ustreza le par $3$ in $7$.« -/
theorem premisli_vieta (x : ℝ) : (x ^ 2 - 10 * x + 21 = 0 ↔ x = 3 ∨ x = 7) ∧
    ∀ p q : ℤ, (p + q = 10 ∧ p * q = 21) ↔ (p = 3 ∧ q = 7) ∨ (p = 7 ∧ q = 3) := by
  refine ⟨by rw [enacba_iff (P := (x - 3) * (x - 7)) (by ring), dva_faktorja], fun p q => ?_⟩
  constructor
  · rintro ⟨h1, h2⟩
    have hq : q = 10 - p := by linarith
    subst hq
    have h0 : (p - 3) * (p - 7) = 0 := by linear_combination -h2
    rcases mul_eq_zero.mp h0 with h | h
    · left; constructor <;> linarith
    · right; constructor <;> linarith
  · rintro (⟨rfl, rfl⟩ | ⟨rfl, rfl⟩) <;> norm_num

/-- Razlaga 7, Preveri: enačba z rešitvama 1 in 4 je x² − 5x + 4 = 0.
trditev: MAT-SS-2/kvadratna-enacba#preveri-1-4
besedilo: »Preveri:* katera enačba z vodilnim koeficientom $1$ ima rešitvi $1$ in $4$? ($x^2 - 5x + 4 = 0$.)« -/
theorem preveri_1_4 (x : ℝ) : x ^ 2 - 5 * x + 4 = 0 ↔ x = 1 ∨ x = 4 := by
  rw [enacba_iff (P := (x - 1) * (x - 4)) (by ring), dva_faktorja]

/-! ## Žoga iz uvoda -/

/-- Uvod: 4,9t − 4,9t² = 1 ⇔ 4,9t² − 4,9t + 1 = 0.
trditev: MAT-SS-2/kvadratna-enacba#uvod-enacba
besedilo: »Iz $4{,}9t - 4{,}9t^2 = 1$ dobiš enačbo $4{,}9t^2 - 4{,}9t + 1 = 0$.« -/
theorem uvod_enacba (t : ℝ) : 4.9 * t - 4.9 * t ^ 2 = 1 ↔ 4.9 * t ^ 2 - 4.9 * t + 1 = 0 := by
  constructor <;> intro h <;> linarith

/-- Razlaga 4 (žoga): D = 4,9² − 4·4,9·1 = 24,01 − 19,6 = 4,41, √4,41 = 2,1.
trditev: MAT-SS-2/kvadratna-enacba#zoga-d
besedilo: »$$D = 4{,}9^2 - 4 \cdot 4{,}9 \cdot 1 = 24{,}01 - 19{,}6 = 4{,}41$$« -/
theorem zoga_D : (4.9 : ℝ) ^ 2 - 4 * 4.9 * 1 = 24.01 - 19.6 ∧ (24.01 : ℝ) - 19.6 = 4.41 ∧
    Real.sqrt 4.41 = 2.1 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  rw [show (4.41 : ℝ) = 2.1 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Razlaga 4 (žoga): 4,9t² − 4,9t + 1 = 0 ⇔ t = (4,9 − 2,1)/9,8 ali t = (4,9 + 2,1)/9,8;
t₁ ≈ 0,29 s in t₂ ≈ 0,71 s.
trditev: MAT-SS-2/kvadratna-enacba#zoga-resitvi
besedilo: »Ker je $\sqrt{4{,}41} = 2{,}1$, sta rešitvi $t_{1,2} = \dfrac{4{,}9 \pm 2{,}1}{9{,}8}$, torej $t_1 \approx 0{,}29\,\text{s}$ in $t_2 \approx 0{,}71\,\text{s}$. Na višini $1\,\text{m}$ je žoga dvakrat: grede gor in grede dol.« -/
theorem zoga_resitvi (t : ℝ) :
    (4.9 * t ^ 2 - 4.9 * t + 1 = 0 ↔ t = (4.9 - 2.1) / 9.8 ∨ t = (4.9 + 2.1) / 9.8) ∧
      |(4.9 - 2.1) / 9.8 - (0.29 : ℝ)| < 0.005 ∧ |(4.9 + 2.1) / 9.8 - (0.71 : ℝ)| < 0.005 := by
  refine ⟨?_, by rw [abs_lt]; norm_num, by rw [abs_lt]; norm_num⟩
  rw [enacba_iff (P := 4.9 * ((t - (4.9 - 2.1) / 9.8) * (t - (4.9 + 2.1) / 9.8))) (by ring),
    mul_eq_zero, dva_faktorja, or_iff_right (by norm_num)]

/-- Razlaga 4, premisli: 4,9t² − 4,9t + 1,5 = 0 ima D = 24,01 − 29,4 = −5,39 < 0, zato realnega časa ni;
največja višina 4,9t − 4,9t² je 1,225 m ≈ 1,2 m (pri t = 0,5).
trditev: MAT-SS-2/kvadratna-enacba#zoga-15
besedilo: »Ne doseže. $D = 24{,}01 - 4 \cdot 4{,}9 \cdot 1{,}5 = 24{,}01 - 29{,}4 = -5{,}39 < 0$, zato realnega časa ni. Žoga se dvigne le do približno $1{,}2\,\text{m}$.« -/
theorem zoga_15 : ((4.9 : ℝ) ^ 2 - 4 * 4.9 * 1.5 = 24.01 - 29.4 ∧ (24.01 : ℝ) - 29.4 = -5.39 ∧
    (-5.39 : ℝ) < 0) ∧ (∀ t : ℝ, 4.9 * t ^ 2 - 4.9 * t + 1.5 ≠ 0) ∧
    (∀ t : ℝ, 4.9 * t - 4.9 * t ^ 2 ≤ 1.225) ∧ 4.9 * 0.5 - 4.9 * (0.5 : ℝ) ^ 2 = 1.225 ∧
    |(1.225 : ℝ) - 1.2| < 0.05 := by
  exact ⟨by norm_num, fun t h' => D_neg 4.9 (-4.9) 1.5 (by norm_num) t (by linarith),
    fun t => by nlinarith [sq_nonneg (t - 0.5)], by norm_num, by rw [abs_lt]; norm_num⟩

/-- Uvod (Luna): največja višina pri metu z v₀ je v₀²/(2g) (pri t = v₀/g); pri šestkrat manjšem g je
šestkrat večja.
trditev: MAT-SS-2/kvadratna-enacba#sestkrat-vise
besedilo: »na Luni je težni pospešek približno šestkrat manjši kot na Zemlji,« -/
theorem sestkrat_vise (v₀ g : ℝ) (hg : 0 < g) :
    (∀ t, v₀ * t - g / 2 * t ^ 2 ≤ v₀ ^ 2 / (2 * g)) ∧
      v₀ * (v₀ / g) - g / 2 * (v₀ / g) ^ 2 = v₀ ^ 2 / (2 * g) ∧
      v₀ ^ 2 / (2 * (g / 6)) = 6 * (v₀ ^ 2 / (2 * g)) := by
  have hg0 : g ≠ 0 := hg.ne'
  refine ⟨fun t => ?_, by field_simp; ring, by field_simp⟩
  have e : v₀ ^ 2 / (2 * g) - (v₀ * t - g / 2 * t ^ 2) = g / 2 * (t - v₀ / g) ^ 2 := by
    field_simp; ring
  have : 0 ≤ g / 2 * (t - v₀ / g) ^ 2 := by positivity
  linarith

/-- Predpostavka `sestkrat_vise` se da izpolniti (g = 9,8). -/
example : (9.8 : ℝ) > 0 ∧ (5 : ℝ) ^ 2 / (2 * (9.8 / 6)) = 6 * (5 ^ 2 / (2 * 9.8)) :=
  ⟨by norm_num, (sestkrat_vise 5 9.8 (by norm_num)).2.2⟩

/-! ## Rešeni primeri -/

/-- Primer 1, koraki 1–3: D = (−2)² − 4·1·(−15) = 4 + 60 = 64 > 0, √D = 8,
x₁ = (2 + 8)/2 = 5, x₂ = (2 − 8)/2 = −3.
trditev: MAT-SS-2/kvadratna-enacba#primer1-racun
besedilo: »Diskriminanta: $D = (-2)^2 - 4 \cdot 1 \cdot (-15) = 4 + 60 = 64$. Ker je $D > 0$, sta rešitvi dve realni.« -/
theorem primer1_racun : ((-2 : ℝ) ^ 2 - 4 * 1 * (-15) = 4 + 60 ∧ (4 : ℝ) + 60 = 64 ∧ (0 : ℝ) < 64) ∧
    Real.sqrt 64 = 8 ∧ (2 + 8) / 2 = (5 : ℝ) ∧ (2 - 8) / 2 = (-3 : ℝ) := by
  refine ⟨by norm_num, ?_, by norm_num, by norm_num⟩
  rw [show (64 : ℝ) = 8 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Primer 1, odgovor: x² − 2x − 15 = 0 ⇔ x = 5 ali x = −3.
trditev: MAT-SS-2/kvadratna-enacba#primer1
besedilo: »$x^2 - 2x - 15 = 0$« -/
theorem primer1 (x : ℝ) : x ^ 2 - 2 * x - 15 = 0 ↔ x = 5 ∨ x = -3 := by
  rw [enacba_iff (P := (x - 5) * (x - -3)) (by ring), dva_faktorja]

/-- Primer 1, korak 4 (preverjanje z Vietom): 5 + (−3) = 2 = −(−2)/1 in 5·(−3) = −15 = −15/1.
trditev: MAT-SS-2/kvadratna-enacba#primer1-vieta
besedilo: »Preverjanje: $x_1 + x_2 = 2 = -\dfrac{-2}{1}$ in $x_1 x_2 = -15 = \dfrac{-15}{1}$.« -/
theorem primer1_vieta : ((5 : ℝ) + -3 = 2 ∧ (2 : ℝ) = -(-2) / 1) ∧ ((5 : ℝ) * -3 = -15 ∧ (-15 : ℝ) = -15 / 1) := by
  norm_num

/-- Primer 2, koraka 1–2: D = 4² − 4·2·5 = 16 − 40 = −24 < 0; √(−D) = √24 = √(4·6) = 2√6.
trditev: MAT-SS-2/kvadratna-enacba#primer2-d
besedilo: »$D = 4^2 - 4 \cdot 2 \cdot 5 = 16 - 40 = -24 < 0$« -/
theorem primer2_D : ((4 : ℝ) ^ 2 - 4 * 2 * 5 = 16 - 40 ∧ (16 : ℝ) - 40 = -24 ∧ (-24 : ℝ) < 0) ∧
    Real.sqrt 24 = 2 * Real.sqrt 6 := by
  refine ⟨by norm_num, ?_⟩
  calc Real.sqrt 24 = Real.sqrt (4 * 6) := by norm_num
    _ = Real.sqrt 4 * Real.sqrt 6 := Real.sqrt_mul (by norm_num) 6
    _ = 2 * Real.sqrt 6 := by rw [show (4 : ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Primer 2, korak 3, odgovor: (−4 ± 2√6 i)/4 = −1 ± (√6/2) i; 2z² + 4z + 5 = 0 ⇔ z = −1 ± (√6/2) i.
trditev: MAT-SS-2/kvadratna-enacba#primer2
besedilo: »$x_{1,2} = \dfrac{-4 \pm 2\sqrt{6}\, i}{4} = -1 \pm \dfrac{\sqrt{6}}{2}\, i$« -/
theorem primer2 (z : ℂ) :
    ((-4 + 2 * (Real.sqrt 6 : ℂ) * I) / 4 = -1 + (Real.sqrt 6 : ℂ) / 2 * I ∧
      (-4 - 2 * (Real.sqrt 6 : ℂ) * I) / 4 = -1 - (Real.sqrt 6 : ℂ) / 2 * I) ∧
    (2 * z ^ 2 + 4 * z + 5 = 0 ↔
      z = -1 + (Real.sqrt 6 : ℂ) / 2 * I ∨ z = -1 - (Real.sqrt 6 : ℂ) / 2 * I) := by
  have h6 : ((Real.sqrt 6 : ℝ) : ℂ) ^ 2 = 6 := by
    rw [← ofReal_pow, Real.sq_sqrt (by norm_num)]; norm_num
  refine ⟨⟨by ring, by ring⟩, ?_⟩
  rw [enacba_iff (P := 2 * ((z - (-1 + (Real.sqrt 6 : ℂ) / 2 * I)) *
      (z - (-1 - (Real.sqrt 6 : ℂ) / 2 * I))))
      (by linear_combination 3 * I_sq + (I ^ 2 / 2) * h6),
    mul_eq_zero, dva_faktorja, or_iff_right two_ne_zero]

/-- Primer 2, korak 4 (Vieta): vsota −1 + (−1) = −2 = −4/2; produkt
(−1)² + (√6/2)² = 1 + 6/4 = 5/2 = c/a.
trditev: MAT-SS-2/kvadratna-enacba#primer2-vieta
besedilo: »Preverjanje z Vietovima formulama: vsota je $-1 + (-1) = -2 = -\dfrac{4}{2}$; produkt konjugiranih števil je $(m + ni)(m - ni) = m^2 + n^2$, tu $(-1)^2 + \left(\dfrac{\sqrt{6}}{2}\right)^2 = 1 + \dfrac{6}{4} = \dfrac{5}{2}$, kar je $\dfrac{c}{a}$.« -/
theorem primer2_vieta : ((-1 : ℝ) + -1 = -2 ∧ (-2 : ℝ) = -4 / 2) ∧
    ((-1 : ℝ) ^ 2 + (Real.sqrt 6 / 2) ^ 2 = 1 + 6 / 4 ∧ (1 : ℝ) + 6 / 4 = 5 / 2) := by
  have h6 : Real.sqrt 6 ^ 2 = 6 := Real.sq_sqrt (by norm_num)
  refine ⟨by norm_num, ?_, by norm_num⟩
  rw [div_pow, h6]; norm_num

/-- Primer 2, korak 5: teme pri x = −4/4 = −1, f(−1) = 2 − 4 + 5 = 3 > 0; f(x) = 2x² + 4x + 5 ≥ 3 > 0
za vse x, graf leži nad osjo x.
trditev: MAT-SS-2/kvadratna-enacba#primer2-graf
besedilo: »Graf: $a = 2 > 0$, teme je pri $x = -\dfrac{4}{4} = -1$, $f(-1) = 2 - 4 + 5 = 3 > 0$. Parabola je odprta navzgor in v celoti leži nad osjo $x$.« -/
theorem primer2_graf : -(4 : ℝ) / 4 = -1 ∧ (2 * (-1 : ℝ) ^ 2 + 4 * (-1) + 5 = 2 - 4 + 5 ∧
    (2 : ℝ) - 4 + 5 = 3) ∧ ∀ x : ℝ, 3 ≤ 2 * x ^ 2 + 4 * x + 5 ∧ 0 < 2 * x ^ 2 + 4 * x + 5 := by
  refine ⟨by norm_num, by norm_num, fun x => ⟨by nlinarith [sq_nonneg (x + 1)],
    by nlinarith [sq_nonneg (x + 1)]⟩⟩

/-- Primer 3, korak 1: 3,24t − 0,81t² = 2,43 ⇔ 0,81t² − 3,24t + 2,43 = 0; model h(t) = v₀t − g/2·t² z
v₀ = 3,24 in g = 1,62 (g/2 = 0,81).
trditev: MAT-SS-2/kvadratna-enacba#primer3-enacba
besedilo: »Podatki:** $v_0 = 3{,}24\,\text{m/s}$, $g = 1{,}62\,\text{m/s}^2$, $h(t) = 3{,}24t - 0{,}81t^2$, višini $h_1 = 2{,}43\,\text{m}$ in $h_2 = 4\,\text{m}$« -/
theorem primer3_enacba (t : ℝ) : (3.24 * t - 0.81 * t ^ 2 = 2.43 ↔ 0.81 * t ^ 2 - 3.24 * t + 2.43 = 0) ∧
    (1.62 : ℝ) / 2 = 0.81 := by
  refine ⟨by constructor <;> intro h <;> linarith, by norm_num⟩

/-- Primer 3, koraki 2–3: D = 3,24² − 4·0,81·2,43 = 10,4976 − 7,8732 = 2,6244 > 0, √D = 1,62, 2a = 1,62,
t = (3,24 ± 1,62)/1,62, tj. 3 s in 1 s.
trditev: MAT-SS-2/kvadratna-enacba#primer3-racun
besedilo: »Diskriminanta: $D = 3{,}24^2 - 4 \cdot 0{,}81 \cdot 2{,}43 = 10{,}4976 - 7{,}8732 = 2{,}6244$. Ker je $D > 0$, je kamen na tej višini dvakrat.« -/
theorem primer3_racun : ((3.24 : ℝ) ^ 2 - 4 * 0.81 * 2.43 = 10.4976 - 7.8732 ∧
    (10.4976 : ℝ) - 7.8732 = 2.6244 ∧ (0 : ℝ) < 2.6244) ∧ Real.sqrt 2.6244 = 1.62 ∧
    2 * (0.81 : ℝ) = 1.62 ∧ (3.24 + 1.62) / 1.62 = (3 : ℝ) ∧ (3.24 - 1.62) / 1.62 = (1 : ℝ) := by
  refine ⟨by norm_num, ?_, by norm_num, by norm_num, by norm_num⟩
  rw [show (2.6244 : ℝ) = 1.62 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Primer 3, odgovor: 0,81t² − 3,24t + 2,43 = 0 ⇔ t = 1 ali t = 3.
trditev: MAT-SS-2/kvadratna-enacba#primer3
besedilo: »$0{,}81t^2 - 3{,}24t + 2{,}43 = 0$« -/
theorem primer3 (t : ℝ) : 0.81 * t ^ 2 - 3.24 * t + 2.43 = 0 ↔ t = 1 ∨ t = 3 := by
  rw [enacba_iff (P := 0.81 * ((t - 1) * (t - 3))) (by ring), mul_eq_zero, dva_faktorja,
    or_iff_right (by norm_num)]

/-- Primer 3, korak 4 (Vieta): 1 + 3 = 4 = 3,24/0,81 in 1·3 = 3 = 2,43/0,81.
trditev: MAT-SS-2/kvadratna-enacba#primer3-vieta
besedilo: »Preverjanje z Vietom: $t_1 + t_2 = 4$, kar je $\dfrac{3{,}24}{0{,}81}$, in $t_1 t_2 = 3$, kar je $\dfrac{2{,}43}{0{,}81}$.« -/
theorem primer3_vieta : ((1 : ℝ) + 3 = 4 ∧ (4 : ℝ) = 3.24 / 0.81) ∧ ((1 : ℝ) * 3 = 3 ∧ (3 : ℝ) = 2.43 / 0.81) := by
  norm_num

/-- Primer 3, korak 5: pri višini 4 m je D = 10,4976 − 4·0,81·4 = 10,4976 − 12,96 = −2,4624 < 0, realnega
časa ni; najvišja točka: iz 10,4976 = 4·0,81·h sledi h = 3,24 m, in res 3,24t − 0,81t² ≤ 3,24 z
enakostjo pri t = 2.
trditev: MAT-SS-2/kvadratna-enacba#primer3-4m
besedilo: »Višina $4\,\text{m}$ da enačbo $0{,}81t^2 - 3{,}24t + 4 = 0$ z diskriminanto $D = 10{,}4976 - 4 \cdot 0{,}81 \cdot 4 = 10{,}4976 - 12{,}96 = -2{,}4624$.« -/
theorem primer3_4m : ((3.24 : ℝ) ^ 2 - 4 * 0.81 * 4 = 10.4976 - 12.96 ∧ (10.4976 : ℝ) - 12.96 = -2.4624 ∧
    (-2.4624 : ℝ) < 0) ∧ (∀ t : ℝ, 0.81 * t ^ 2 - 3.24 * t + 4 ≠ 0) ∧
    (∀ h : ℝ, (10.4976 : ℝ) = 4 * 0.81 * h ↔ h = 3.24) ∧
    (∀ t : ℝ, 3.24 * t - 0.81 * t ^ 2 ≤ 3.24) ∧ 3.24 * 2 - 0.81 * (2 : ℝ) ^ 2 = 3.24 := by
  exact ⟨by norm_num, fun t h => D_neg 0.81 (-3.24) 4 (by norm_num) t (by linarith),
    fun h => by constructor <;> intro e <;> linarith,
    fun t => by nlinarith [sq_nonneg (t - 2)], by norm_num⟩

/-- Primer 4: če sta x₁, x₂ rešitvi x² − 7x + 3 = 0 (x² − 7x + 3 = (x − x₁)(x − x₂)), je x₁ + x₂ = 7,
x₁x₂ = 3, x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂ = 7² − 2·3 = 49 − 6 = 43, x₁²x₂² = (x₁x₂)² = 3² = 9, in
x₁², x₂² sta rešitvi y² − 43y + 9 = 0.
trditev: MAT-SS-2/kvadratna-enacba#primer4
besedilo: »Iz $(x_1 + x_2)^2 = x_1^2 + 2x_1 x_2 + x_2^2$ sledi $x_1^2 + x_2^2 = 7^2 - 2 \cdot 3 = 49 - 6 = 43$.« -/
theorem primer4 (x₁ x₂ : ℝ) (h : ∀ x : ℝ, x ^ 2 - 7 * x + 3 = (x - x₁) * (x - x₂)) :
    x₁ + x₂ = 7 ∧ x₁ * x₂ = 3 ∧ x₁ ^ 2 + x₂ ^ 2 = 43 ∧ x₁ ^ 2 * x₂ ^ 2 = 9 ∧
      ∀ y : ℝ, y ^ 2 - 43 * y + 9 = (y - x₁ ^ 2) * (y - x₂ ^ 2) := by
  have h0 := h 0
  have h1 := h 1
  have hp : x₁ * x₂ = 3 := by linarith
  have hs : x₁ + x₂ = 7 := by nlinarith
  have hk : x₁ ^ 2 + x₂ ^ 2 = 43 := by
    calc x₁ ^ 2 + x₂ ^ 2 = (x₁ + x₂) ^ 2 - 2 * (x₁ * x₂) := by ring
      _ = 7 ^ 2 - 2 * 3 := by rw [hs, hp]
      _ = 49 - 6 := by norm_num
      _ = 43 := by norm_num
  have hq : x₁ ^ 2 * x₂ ^ 2 = 9 := by
    calc x₁ ^ 2 * x₂ ^ 2 = (x₁ * x₂) ^ 2 := by ring
      _ = 3 ^ 2 := by rw [hp]
      _ = 9 := by norm_num
  refine ⟨hs, hp, hk, hq, fun y => ?_⟩
  linear_combination y * hk - hq

/-- Predpostavka `primer4` se da izpolniti: x₁,₂ = (7 ± √37)/2 (D = 49 − 12 = 37 > 0, rešitvi sta
realni). -/
example : ∀ x : ℝ, x ^ 2 - 7 * x + 3 =
    (x - (7 + Real.sqrt 37) / 2) * (x - (7 - Real.sqrt 37) / 2) := by
  have hs : Real.sqrt 37 ^ 2 = 37 := Real.sq_sqrt (by norm_num)
  intro x
  linear_combination (1 / 4) * hs

/-- Predpostavke trditve `primer4` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∀ x : ℝ, x ^ 2 - 7 * x + 3 = (x - (7 + Real.sqrt 37) / 2) * (x - (7 - Real.sqrt 37) / 2) := by
    have hs : Real.sqrt 37 ^ 2 = 37 := Real.sq_sqrt (by norm_num)
    intro x
    linear_combination (1 / 4) * hs
  primer4 (h := w)

/-- Primer 4, D = 49 − 12 = 37 > 0 in premisli (približki): x₁ = (7 + √37)/2 ≈ 6,54, x₂ ≈ 0,46,
x₁² ≈ 42,79, x₂² ≈ 0,21.
trditev: MAT-SS-2/kvadratna-enacba#primer4-priblizki
besedilo: »$x_1^2 x_2^2 = (x_1 x_2)^2 = 3^2 = 9$, zato je enačba $y^2 - 43y + 9 = 0$. Preverjanje s približki: $x_1 \approx 6{,}54$ in $x_2 \approx 0{,}46$, torej $x_1^2 \approx 42{,}79$ in $x_2^2 \approx 0{,}21$; vsota je $43$, produkt približno $9$.« -/
theorem primer4_priblizki : ((-7 : ℝ) ^ 2 - 4 * 1 * 3 = 49 - 12 ∧ (49 : ℝ) - 12 = 37 ∧ (0 : ℝ) < 37) ∧
    |(7 + Real.sqrt 37) / 2 - 6.54| < 0.005 ∧ |(7 - Real.sqrt 37) / 2 - 0.46| < 0.005 ∧
    |((7 + Real.sqrt 37) / 2) ^ 2 - 42.79| < 0.005 ∧ |((7 - Real.sqrt 37) / 2) ^ 2 - 0.21| < 0.005 := by
  have h1 : (6.08276 : ℝ) < Real.sqrt 37 := Real.lt_sqrt_of_sq_lt (by norm_num)
  have h2 : Real.sqrt 37 < 6.08277 := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  refine ⟨by norm_num, ?_, ?_, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> nlinarith

/-- Primer 5: x³ − 2x² = 9x − 18 ⇔ x³ − 2x² − 9x + 18 = 0 ⇔ x²(x − 2) − 9(x − 2) = 0
⇔ (x − 2)(x² − 9) = 0 ⇔ (x − 2)(x − 3)(x + 3) = 0 ⇔ x ∈ {2, 3, −3}.
trditev: MAT-SS-2/kvadratna-enacba#primer5
besedilo: »$x^3 - 2x^2 - 9x + 18 = 0$« -/
theorem primer5 (x : ℝ) : x ^ 3 - 2 * x ^ 2 = 9 * x - 18 ↔ x = 2 ∨ x = 3 ∨ x = -3 := by
  have e : x ^ 3 - 2 * x ^ 2 - (9 * x - 18) = (x - 2) * (x - 3) * (x - -3) := by
    calc x ^ 3 - 2 * x ^ 2 - (9 * x - 18) = x ^ 3 - 2 * x ^ 2 - 9 * x + 18 := by ring
      _ = x ^ 2 * (x - 2) - 9 * (x - 2) := by ring
      _ = (x - 2) * (x ^ 2 - 9) := by ring
      _ = (x - 2) * (x - 3) * (x + 3) := by ring
      _ = (x - 2) * (x - 3) * (x - -3) := by ring
  rw [enacba_iff e, trije_faktorji]

/-- Primer 5, korak 6 (preverjanje): pri x = −3 je leva stran −27 − 18 = −45 in desna −27 − 18 = −45;
pri x = 3 sta obe 9, pri x = 2 obe 0.
trditev: MAT-SS-2/kvadratna-enacba#primer5-preverjanje
besedilo: »Preverjanje za $x = -3$: leva stran je $-27 - 18 = -45$, desna $-27 - 18 = -45$. Za $x = 3$ sta obe strani enaki $9$, za $x = 2$ pa obe $0$.« -/
theorem primer5_preverjanje :
    ((-3 : ℝ) ^ 3 - 2 * (-3) ^ 2 = -27 - 18 ∧ (-27 : ℝ) - 18 = -45) ∧
      (9 * (-3 : ℝ) - 18 = -27 - 18 ∧ (-27 : ℝ) - 18 = -45) ∧
      ((3 : ℝ) ^ 3 - 2 * 3 ^ 2 = 9 ∧ 9 * (3 : ℝ) - 18 = 9) ∧
      ((2 : ℝ) ^ 3 - 2 * 2 ^ 2 = 0 ∧ 9 * (2 : ℝ) - 18 = 0) := by
  norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1: x² = 3x + 4 ⇔ x² − 3x − 4 = 0 (a = 1, b = −3, c = −4, ne c = 4).
trditev: MAT-SS-2/kvadratna-enacba#napaka-splosna
besedilo: »Koeficienti iz enačbe, ki ni v splošni obliki.** Pri $x^2 = 3x + 4$ ni $c = 4$. Razlog: obrazec velja le za obliko $ax^2 + bx + c = 0$. Pravilno: najprej prenesi vse na levo, $x^2 - 3x - 4 = 0$, šele nato preberi $a = 1$, $b = -3$, $c = -4$.« -/
theorem napaka_splosna (x : ℝ) : x ^ 2 = 3 * x + 4 ↔ 1 * x ^ 2 + (-3) * x + (-4) = 0 := by
  constructor <;> intro h <;> linarith

/-- Pogoste napake 2: pri b = −3 je b² = (−3)² = 9 (ne −9) in −b = 3.
trditev: MAT-SS-2/kvadratna-enacba#napaka-predznak
besedilo: »Napaka s predznakom pri $b^2$ in $-b$.** Pri $b = -3$ je $b^2 = (-3)^2 = 9$, ne $-9$, in $-b = 3$.« -/
theorem napaka_predznak : (-3 : ℝ) ^ 2 = 9 ∧ (-3 : ℝ) ^ 2 ≠ -9 ∧ -(-3 : ℝ) = 3 := by norm_num

/-- Pogoste napake 3: napačni zapis −b + √D/(2a) pri x² − 2x − 15 = 0 da 2 + 8/2 = 6, kar ni rešitev;
pravilni (−b + √D)/(2a) = 5 je.
trditev: MAT-SS-2/kvadratna-enacba#napaka-ulomkova-crta
besedilo: »Točkovanje:** 1 točka za zapis z ničlo na desni (ali splošno obliko $x^2 - 8x + 15 = 0$), 1 točka za razcep $(x - 3)(x - 5) = 0$, 1 točka za obe rešitvi.« -/
theorem napaka_ulomkova_crta : (2 : ℝ) + 8 / 2 = 6 ∧ (6 : ℝ) ^ 2 - 2 * 6 - 15 ≠ 0 ∧
    ((2 : ℝ) + 8) / 2 = 5 ∧ (5 : ℝ) ^ 2 - 2 * 5 - 15 = 0 := by norm_num

/-- Pogoste napake 4: x² = 3x ⇔ x(x − 3) = 0 ⇔ x = 0 ali x = 3 (deljenje z x izgubi x = 0).
trditev: MAT-SS-2/kvadratna-enacba#napaka-deljenje
besedilo: »Deljenje z neznanko.** Iz $x^2 = 3x$ nekateri delijo z $x$ in dobijo samo $x = 3$. Razlog: z $x$ smemo deliti le, če $x \ne 0$, zato rešitev $x = 0$ izgubiš. Pravilno: $x^2 - 3x = 0$, $x(x - 3) = 0$, $x_1 = 0$, $x_2 = 3$.« -/
theorem napaka_deljenje (x : ℝ) : x ^ 2 = 3 * x ↔ x = 0 ∨ x = 3 := by
  rw [enacba_iff (P := (x - 0) * (x - 3)) (by ring), dva_faktorja]

/-- Pogoste napake 5: (x − 1)(x − 2) = 6 ⇔ x² − 3x − 4 = 0 ⇔ (x − 4)(x + 1) = 0 ⇔ x ∈ {4, −1};
napačni »x − 1 = 6«, tj. x = 7, ni rešitev.
trditev: MAT-SS-2/kvadratna-enacba#napaka-razcep-ni-nic
besedilo: »Pravilno: najprej $x^2 - 3x - 4 = 0$, nato $(x - 4)(x + 1) = 0$, torej $x_1 = 4$ in $x_2 = -1$.« -/
theorem napaka_razcep_ni_nic (x : ℝ) :
    ((x - 1) * (x - 2) = 6 ↔ x ^ 2 - 3 * x - 4 = 0) ∧ x ^ 2 - 3 * x - 4 = (x - 4) * (x + 1) ∧
      ((x - 1) * (x - 2) = 6 ↔ x = 4 ∨ x = -1) ∧ ((7 : ℝ) - 1) * (7 - 2) ≠ 6 := by
  refine ⟨by constructor <;> intro h <;> linarith, by ring, ?_, by norm_num⟩
  rw [enacba_iff (P := (x - 4) * (x - -1)) (by ring), dva_faktorja]

/-! ## Za maturo -/

/-- Za maturo, naloga 1: (x − 3)² = 2x − 6 ⇔ (x − 3)² − 2(x − 3) = 0 ⇔ (x − 3)(x − 3 − 2) = 0
⇔ (x − 3)(x − 5) = 0 ⇔ x ∈ {3, 5}; splošna oblika x² − 8x + 15 = 0.
trditev: MAT-SS-2/kvadratna-enacba#matura1
besedilo: »Točkovanje:** 1 točka za zapis z ničlo na desni (ali splošno obliko $x^2 - 8x + 15 = 0$), 1 točka za razcep $(x - 3)(x - 5) = 0$, 1 točka za obe rešitvi.« -/
theorem matura1 (x : ℝ) : ((x - 3) ^ 2 = 2 * x - 6 ↔ x = 3 ∨ x = 5) ∧
    ((x - 3) ^ 2 = 2 * x - 6 ↔ x ^ 2 - 8 * x + 15 = 0) := by
  have e : (x - 3) ^ 2 - (2 * x - 6) = (x - 3) * (x - 5) := by
    calc (x - 3) ^ 2 - (2 * x - 6) = (x - 3) ^ 2 - 2 * (x - 3) := by ring
      _ = (x - 3) * (x - 3 - 2) := by ring
      _ = (x - 3) * (x - 5) := by ring
  exact ⟨by rw [enacba_iff e, dva_faktorja], by constructor <;> intro h <;> linarith⟩

/-- Za maturo, naloga 1, korak 4 (preverjanje): pri x = 3 sta obe strani 0, pri x = 5 obe 4.
trditev: MAT-SS-2/kvadratna-enacba#matura1-preverjanje
besedilo: »Preverjanje: za $x = 3$ sta obe strani enaki $0$, za $x = 5$ pa obe enaki $4$.« -/
theorem matura1_preverjanje : ((3 : ℝ) - 3) ^ 2 = 0 ∧ 2 * (3 : ℝ) - 6 = 0 ∧ ((5 : ℝ) - 3) ^ 2 = 4 ∧
    2 * (5 : ℝ) - 6 = 4 := by norm_num

/-- Za maturo, naloga 2 a): D = (−6)² − 4·1·c = 36 − 4c; dve različni realni rešitvi ⇔ 36 − 4c > 0
⇔ c < 9.
trditev: MAT-SS-2/kvadratna-enacba#matura2a
besedilo: »a) Dve različni realni rešitvi sta pri $D > 0$: iz $36 - 4c > 0$ sledi $c < 9$.« -/
theorem matura2a (c : ℝ) : (-6 : ℝ) ^ 2 - 4 * 1 * c = 36 - 4 * c ∧
    ((∃ x₁ x₂ : ℝ, x₁ ≠ x₂ ∧ x₁ ^ 2 - 6 * x₁ + c = 0 ∧ x₂ ^ 2 - 6 * x₂ + c = 0) ↔ c < 9) := by
  refine ⟨by norm_num, ?_⟩
  have key := dve_realni_iff 1 (-6) c one_ne_zero
  have e : ∀ x : ℝ, 1 * x ^ 2 + -6 * x + c = x ^ 2 - 6 * x + c := fun x => by ring
  simp only [e] at key
  rw [key]
  constructor <;> intro h <;> linarith

/-- Za maturo, naloga 2 b): iz x₁ = 2 in Vieta x₂ = 6 − 2 = 4, c = 2·4 = 8; 2² − 6·2 + c = 0 ⇔ c = 8,
in x² − 6x + 8 = 0 ⇔ x ∈ {2, 4}.
trditev: MAT-SS-2/kvadratna-enacba#matura2b
besedilo: »b) Prav tako je $x_1 x_2 = c$, zato $c = 2 \cdot 4 = 8$. Preverjanje: $2^2 - 6 \cdot 2 + 8 = 0$.« -/
theorem matura2b (c x : ℝ) : ((6 : ℝ) - 2 = 4 ∧ (2 : ℝ) * 4 = 8) ∧ ((2 : ℝ) ^ 2 - 6 * 2 + c = 0 ↔ c = 8) ∧
    (x ^ 2 - 6 * x + 8 = 0 ↔ x = 2 ∨ x = 4) := by
  refine ⟨by norm_num, by constructor <;> intro h <;> linarith, ?_⟩
  rw [enacba_iff (P := (x - 2) * (x - 4)) (by ring), dva_faktorja]

/-- Za maturo, naloga 2 b): če je 2 rešitev x² − 6x + c = 0, je c = 8 in druga rešitev 4 (enolično).
trditev: MAT-SS-2/kvadratna-enacba#matura2b-enolicnost
besedilo: »b) Prav tako je $x_1 x_2 = c$, zato $c = 2 \cdot 4 = 8$. Preverjanje: $2^2 - 6 \cdot 2 + 8 = 0$.« -/
theorem matura2b_enolicnost (c : ℝ) (h : (2 : ℝ) ^ 2 - 6 * 2 + c = 0) :
    c = 8 ∧ ∀ x : ℝ, x ^ 2 - 6 * x + c = 0 ↔ x = 2 ∨ x = 4 := by
  have hc : c = 8 := by linarith
  subst hc
  exact ⟨rfl, fun x => (matura2b 8 x).2.2⟩

/-- Predpostavka `matura2b_enolicnost` se da izpolniti (c = 8). -/
example : (2 : ℝ) ^ 2 - 6 * 2 + 8 = 0 := by norm_num

/-- Predpostavke trditve `matura2b_enolicnost` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2 : ℝ) ^ 2 - 6 * 2 + 8 = 0 := by norm_num
  matura2b_enolicnost (h := w)

/-- Za maturo, naloga 2 c): pri c = 13 je D = 36 − 52 = −16 < 0, √(−D) = 4, rešitvi (6 ± 4i)/2 = 3 ± 2i;
z² − 6z + 13 = 0 ⇔ z = 3 ± 2i.
trditev: MAT-SS-2/kvadratna-enacba#matura2c
besedilo: »c) $D = 36 - 52 = -16 < 0$, zato realnih rešitev ni; $\sqrt{-D} = 4$.« -/
theorem matura2c (z : ℂ) : ((36 : ℝ) - 52 = -16 ∧ (-16 : ℝ) < 0 ∧ Real.sqrt (-(-16)) = 4) ∧
    ((6 + 4 * I) / 2 = 3 + 2 * I ∧ (6 - 4 * I) / 2 = 3 - 2 * I) ∧
    (z ^ 2 - 6 * z + 13 = 0 ↔ z = 3 + 2 * I ∨ z = 3 - 2 * I) := by
  refine ⟨⟨by norm_num, by norm_num, ?_⟩, ⟨by ring, by ring⟩, ?_⟩
  · rw [show (-(-16) : ℝ) = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [enacba_iff (P := (z - (3 + 2 * I)) * (z - (3 - 2 * I))) (by linear_combination 4 * I_sq),
      dva_faktorja]

/-- Za maturo, naloga 2 c) (preverjanje, `RACUN`): vsota (3 + 2i) + (3 − 2i) = 6 = −(−6)/1, produkt
(3 + 2i)(3 − 2i) = 9 + 4 = 13 = 13/1; obe števili rešita enačbo.
trditev: MAT-SS-2/kvadratna-enacba#matura2c-vieta
besedilo: »c) Vsota: $(3 + 2i) + (3 - 2i) = 6 = -\dfrac{-6}{1}$. Produkt: $(3 + 2i)(3 - 2i) = 9 + 4 = 13 = \dfrac{13}{1}$.« -/
theorem matura2c_vieta : ((3 + 2 * I) + (3 - 2 * I) = 6 ∧ (6 : ℂ) = -(-6) / 1) ∧
    ((3 + 2 * I) * (3 - 2 * I) = 9 + 4 ∧ (9 : ℂ) + 4 = 13 ∧ (13 : ℂ) = 13 / 1) ∧
    (3 + 2 * I) ^ 2 - 6 * (3 + 2 * I) + 13 = 0 ∧ (3 - 2 * I) ^ 2 - 6 * (3 - 2 * I) + 13 = 0 := by
  refine ⟨⟨by ring, by norm_num⟩, ⟨by linear_combination (-4) * I_sq, by norm_num, by norm_num⟩,
    by linear_combination 4 * I_sq, by linear_combination 4 * I_sq⟩

/-- Za maturo, naloga 3 a): (40 + 2x)(30 + 2x) = 4x² + 140x + 1200, ploščina paspartuja
P(x) = 4x² + 140x.
trditev: MAT-SS-2/kvadratna-enacba#matura3a
besedilo: »zato je ploščina celotnega pravokotnika $(40 + 2x)(30 + 2x) = 4x^2 + 140x + 1200$.« -/
theorem matura3a (x : ℝ) : (40 + 2 * x) * (30 + 2 * x) = 4 * x ^ 2 + 140 * x + 1200 ∧
    (40 + 2 * x) * (30 + 2 * x) - 1200 = 4 * x ^ 2 + 140 * x := ⟨by ring, by ring⟩

/-- Za maturo, naloga 3 b): 4x² + 140x = 1200 ⇔ x² + 35x − 300 = 0; D = 35² + 4·300 = 2425,
x = (−35 ± √2425)/2 = −35/2 ± 5√97/2.
trditev: MAT-SS-2/kvadratna-enacba#matura3b
besedilo: »b) Enačba $4x^2 + 140x = 1200$ po deljenju s $4$: $x^2 + 35x - 300 = 0$.« -/
theorem matura3b (x : ℝ) : (4 * x ^ 2 + 140 * x = 1200 ↔ x ^ 2 + 35 * x - 300 = 0) ∧
    ((35 : ℝ) ^ 2 + 4 * 300 = 2425) ∧
    (x ^ 2 + 35 * x - 300 = 0 ↔ x = (-35 + Real.sqrt 2425) / 2 ∨ x = (-35 - Real.sqrt 2425) / 2) ∧
    Real.sqrt 2425 = 5 * Real.sqrt 97 := by
  have hs : Real.sqrt 2425 ^ 2 = 2425 := Real.sq_sqrt (by norm_num)
  refine ⟨by constructor <;> intro h <;> linarith, by norm_num, ?_, ?_⟩
  · rw [enacba_iff (P := (x - (-35 + Real.sqrt 2425) / 2) * (x - (-35 - Real.sqrt 2425) / 2))
      (by linear_combination (1 / 4) * hs), dva_faktorja]
  · calc Real.sqrt 2425 = Real.sqrt (5 ^ 2 * 97) := by norm_num
      _ = 5 * Real.sqrt 97 := by rw [Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]

/-- Za maturo, naloga 3 b): x₁ = (−35 + √2425)/2 ≈ 7,1221, x₂ ≈ −42,1221; ustreza le pozitivna,
x₁ ≈ 7,1 cm.
trditev: MAT-SS-2/kvadratna-enacba#matura3b-priblizki
besedilo: »b) $D = 35^2 + 4 \cdot 300 = 2425$, $x_{1,2} = \dfrac{-35 \pm \sqrt{2425}}{2}$, torej $x_1 \approx 7{,}1221$ in $x_2 \approx -42{,}1221$.« -/
theorem matura3b_priblizki : |(-35 + Real.sqrt 2425) / 2 - 7.1221| < 0.00005 ∧
    |(-35 - Real.sqrt 2425) / 2 - (-42.1221)| < 0.00005 ∧ (-35 - Real.sqrt 2425) / 2 < 0 ∧
    0 < (-35 + Real.sqrt 2425) / 2 ∧ |(-35 + Real.sqrt 2425) / 2 - 7.1| < 0.05 := by
  have h1 : (49.24428 : ℝ) < Real.sqrt 2425 := Real.lt_sqrt_of_sq_lt (by norm_num)
  have h2 : Real.sqrt 2425 < 49.2443 := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  refine ⟨?_, ?_, by linarith, by linarith, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Za maturo, naloga 3 c): teme pri x = −140/(2·4) = −17,5; P(x) = 4x² + 140x na [0, ∞) strogo
narašča in za vsak S > 0 je natanko en x > 0 s P(x) = S.
trditev: MAT-SS-2/kvadratna-enacba#matura3c
besedilo: »c) Graf funkcije $P$ je parabola, odprta navzgor ($4 > 0$), s temenom pri $x = -\dfrac{140}{2 \cdot 4} = -17{,}5$. Desno od temena funkcija narašča, zato narašča na vsem intervalu $[0, \infty)$.« -/
theorem matura3c : -(140 : ℝ) / (2 * 4) = -17.5 ∧
    StrictMonoOn (fun x : ℝ => 4 * x ^ 2 + 140 * x) (Set.Ici 0) ∧
    ∀ S : ℝ, 0 < S → ∃! x : ℝ, 0 < x ∧ 4 * x ^ 2 + 140 * x = S := by
  refine ⟨by norm_num, fun x hx y hy hxy => ?_, fun S hS => ?_⟩
  · simp only [Set.mem_Ici] at hx hy
    show 4 * x ^ 2 + 140 * x < 4 * y ^ 2 + 140 * y
    nlinarith [mul_pos (sub_pos.2 hxy) (by linarith : (0 : ℝ) < 4 * (x + y) + 140)]
  · have hs : Real.sqrt (19600 + 16 * S) ^ 2 = 19600 + 16 * S := Real.sq_sqrt (by linarith)
    have h140 : (140 : ℝ) < Real.sqrt (19600 + 16 * S) := Real.lt_sqrt_of_sq_lt (by linarith)
    refine ⟨(-140 + Real.sqrt (19600 + 16 * S)) / 8, ⟨by linarith, by linear_combination (1 / 16) * hs⟩,
      fun y ⟨hy, hyS⟩ => ?_⟩
    have e : (y - (-140 + Real.sqrt (19600 + 16 * S)) / 8) *
        (4 * (y + (-140 + Real.sqrt (19600 + 16 * S)) / 8) + 140) = 0 := by
      linear_combination hyS - (1 / 16) * hs
    rcases mul_eq_zero.mp e with h | h
    · linarith
    · linarith

/-- Za maturo, naloga 3 c) (Vieta): rešitvi 4x² + 140x − S = 0 imata produkt −S/4 < 0, zato je natanko
ena pozitivna (in druga negativna).
trditev: MAT-SS-2/kvadratna-enacba#produkt-negativen
besedilo: »(Enako sledi iz Vietovih formul: rešitvi enačbe $4x^2 + 140x - S = 0$ imata produkt $-\dfrac{S}{4} < 0$, zato je natanko ena pozitivna.)« -/
theorem produkt_negativen (r₁ r₂ : ℝ) (h : r₁ * r₂ < 0) : (0 < r₁ ∧ r₂ < 0) ∨ (r₁ < 0 ∧ 0 < r₂) := by
  rcases lt_trichotomy r₁ 0 with h1 | h1 | h1
  · right; exact ⟨h1, by nlinarith⟩
  · subst h1; simp at h
  · left; exact ⟨h1, by nlinarith⟩

/-- Predpostavka `produkt_negativen` se da izpolniti (r₁ = 1, r₂ = −1). -/
example : ((0 : ℝ) < 1 ∧ (-1 : ℝ) < 0) ∨ ((1 : ℝ) < 0 ∧ (0 : ℝ) < -1) :=
  produkt_negativen 1 (-1) (by norm_num)

/-- Za maturo, naloga 3 c) (Vieta): če sta r₁, r₂ rešitvi 4x² + 140x − S = 0
(4x² + 140x − S = 4(x − r₁)(x − r₂)), je njun produkt r₁r₂ = −S/4 < 0 za S > 0.
trditev: MAT-SS-2/kvadratna-enacba#matura3c-vieta
besedilo: »(Enako sledi iz Vietovih formul: rešitvi enačbe $4x^2 + 140x - S = 0$ imata produkt $-\dfrac{S}{4} < 0$, zato je natanko ena pozitivna.)« -/
theorem matura3c_vieta (S r₁ r₂ : ℝ) (hS : 0 < S)
    (h : ∀ x : ℝ, 4 * x ^ 2 + 140 * x - S = 4 * (x - r₁) * (x - r₂)) :
    r₁ * r₂ = -S / 4 ∧ r₁ * r₂ < 0 := by
  have h0 := h 0
  have e : r₁ * r₂ = -S / 4 := by linarith
  exact ⟨e, by rw [e]; linarith⟩

/-- Predpostavki `matura3c_vieta` se dasta izpolniti (S = 800, r₁ = 5, r₂ = −40). -/
example : (5 : ℝ) * -40 = -800 / 4 ∧ (5 : ℝ) * -40 < 0 :=
  matura3c_vieta 800 5 (-40) (by norm_num) (fun x => by ring)

/-- Za maturo, naloga 3 d): (60 + 2x)(20 + 2x) − 1200 = 4x² + 160x; 4x² + 160x = 1200 ⇔ x² + 40x − 300 = 0;
D = 1600 + 1200 = 2800; pozitivna rešitev (−40 + √2800)/2 = −20 + 10√7 ≈ 6,4575 ≈ 6,5 cm, negativna
(−40 − √2800)/2 = −20 − 10√7.
trditev: MAT-SS-2/kvadratna-enacba#matura3d
besedilo: »d) $D = 1600 + 1200 = 2800$, pozitivna rešitev je $x = \dfrac{-40 + \sqrt{2800}}{2} \approx 6{,}4575$, torej $x \approx 6{,}5\,\text{cm}$.« -/
theorem matura3d (x : ℝ) : (60 + 2 * x) * (20 + 2 * x) - 1200 = 4 * x ^ 2 + 160 * x ∧
    (4 * x ^ 2 + 160 * x = 1200 ↔ x ^ 2 + 40 * x - 300 = 0) ∧ ((40 : ℝ) ^ 2 + 4 * 300 = 1600 + 1200 ∧
    (1600 : ℝ) + 1200 = 2800) ∧
    (x ^ 2 + 40 * x - 300 = 0 ↔ x = (-40 + Real.sqrt 2800) / 2 ∨ x = (-40 - Real.sqrt 2800) / 2) ∧
    (-40 + Real.sqrt 2800) / 2 = -20 + 10 * Real.sqrt 7 ∧
    (-40 - Real.sqrt 2800) / 2 = -20 - 10 * Real.sqrt 7 ∧
    |(-40 + Real.sqrt 2800) / 2 - 6.4575| < 0.00005 ∧ |(-40 + Real.sqrt 2800) / 2 - 6.5| < 0.05 := by
  have hs : Real.sqrt 2800 ^ 2 = 2800 := Real.sq_sqrt (by norm_num)
  have h1 : (52.915 : ℝ) < Real.sqrt 2800 := Real.lt_sqrt_of_sq_lt (by norm_num)
  have h2 : Real.sqrt 2800 < 52.9151 := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  have h7 : Real.sqrt 2800 = 20 * Real.sqrt 7 := by
    calc Real.sqrt 2800 = Real.sqrt (20 ^ 2 * 7) := by norm_num
      _ = 20 * Real.sqrt 7 := by rw [Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  refine ⟨by ring, by constructor <;> intro h <;> linarith, by norm_num, ?_, by rw [h7]; ring, by rw [h7]; ring, ?_, ?_⟩
  · rw [enacba_iff (P := (x - (-40 + Real.sqrt 2800) / 2) * (x - (-40 - Real.sqrt 2800) / 2))
      (by linear_combination (1 / 4) * hs), dva_faktorja]
  · rw [abs_lt]; constructor <;> linarith
  · rw [abs_lt]; constructor <;> linarith

/-- Za maturo, naloga 3 d): sliki imata enako ploščino (40·30 = 60·20 = 1200), linearni člen je obseg
krat x (2(40 + 30) = 140, 2(60 + 20) = 160); pri vsakem x > 0 je ploščina drugega paspartuja večja, zato
je njegova pozitivna rešitev manjša: (−40 + √2800)/2 < (−35 + √2425)/2.
trditev: MAT-SS-2/kvadratna-enacba#matura3d-ozji
besedilo: »d) Ploščina paspartuja je zdaj $(60 + 2x)(20 + 2x) - 1200 = 4x^2 + 160x$. Enačba $4x^2 + 160x = 1200$ da $x^2 + 40x - 300 = 0$.« -/
theorem matura3d_ozji : (40 : ℝ) * 30 = 1200 ∧ (60 : ℝ) * 20 = 1200 ∧ 2 * ((40 : ℝ) + 30) = 140 ∧
    2 * ((60 : ℝ) + 20) = 160 ∧ (∀ x : ℝ, 0 < x → 4 * x ^ 2 + 140 * x < 4 * x ^ 2 + 160 * x) ∧
    (-40 + Real.sqrt 2800) / 2 < (-35 + Real.sqrt 2425) / 2 := by
  have h1 : (49.24428 : ℝ) < Real.sqrt 2425 := Real.lt_sqrt_of_sq_lt (by norm_num)
  have h2 : Real.sqrt 2800 < 52.9151 := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, fun x hx => by linarith, by linarith⟩

/-! ## Ustna vprašanja in Preveri se -/

/-- Ustno vprašanje 3: x² + 4 = 0 ima D = 0² − 4·1·4 = −16 < 0, realne rešitve ni (kvadrat ni
negativen), v ℂ sta rešitvi ±2i, saj je (2i)² = −4 (`RACUN`: (±2i)² + 4 = 0).
trditev: MAT-SS-2/kvadratna-enacba#ustno3
besedilo: »Primer je enačba $x^2 + 4 = 0$ z diskriminanto $D = -16 < 0$.« -/
theorem ustno3 (z : ℂ) : ((0 : ℝ) ^ 2 - 4 * 1 * 4 = -16 ∧ (-16 : ℝ) < 0) ∧ (∀ x : ℝ, x ^ 2 + 4 ≠ 0) ∧
    (2 * I) ^ 2 = -4 ∧ (2 * I) ^ 2 + 4 = 0 ∧ (-2 * I) ^ 2 + 4 = 0 ∧
    (z ^ 2 + 4 = 0 ↔ z = 2 * I ∨ z = -(2 * I)) := by
  refine ⟨by norm_num, fun x h => by nlinarith [sq_nonneg x], by linear_combination 4 * I_sq,
    by linear_combination 4 * I_sq, by linear_combination 4 * I_sq, ?_⟩
  rw [enacba_iff (P := (z - 2 * I) * (z - -(2 * I))) (by linear_combination 4 * I_sq), dva_faktorja]

/-- Preveri se, vprašanje 2: x² − 7x + 3 = 0 ⇔ x = (7 ± √37)/2 (D = 49 − 12 = 37); s √37 ≈ 6 dobimo
(7 + 6)/2 = 6,5 in (7 − 6)/2 = 0,5, prava vrednost se od tega razlikuje za manj kot 0,05; vsota 7.
trditev: MAT-SS-2/kvadratna-enacba#preveri-ocena
besedilo: »$D = 49 - 12 = 37$, $x_{1,2} = \dfrac{7 \pm \sqrt{37}}{2} \approx \dfrac{7 \pm 6}{2}$, torej približno $6{,}5$ in $0{,}5$. Vsota $7$ se ujema z Vietom.« -/
theorem preveri_ocena (x : ℝ) : (x ^ 2 - 7 * x + 3 = 0 ↔
      x = (7 + Real.sqrt 37) / 2 ∨ x = (7 - Real.sqrt 37) / 2) ∧
    ((7 : ℝ) + 6) / 2 = 6.5 ∧ ((7 : ℝ) - 6) / 2 = 0.5 ∧
    |(7 + Real.sqrt 37) / 2 - 6.5| < 0.05 ∧ |(7 - Real.sqrt 37) / 2 - 0.5| < 0.05 ∧
    (7 + Real.sqrt 37) / 2 + (7 - Real.sqrt 37) / 2 = 7 := by
  have hs : Real.sqrt 37 ^ 2 = 37 := Real.sq_sqrt (by norm_num)
  have h1 : (6.08 : ℝ) < Real.sqrt 37 := Real.lt_sqrt_of_sq_lt (by norm_num)
  have h2 : Real.sqrt 37 < 6.09 := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  refine ⟨?_, by norm_num, by norm_num, ?_, ?_, by ring⟩
  · rw [enacba_iff (P := (x - (7 + Real.sqrt 37) / 2) * (x - (7 - Real.sqrt 37) / 2))
      (by linear_combination (1 / 4) * hs), dva_faktorja]
  · rw [abs_lt]; constructor <;> linarith
  · rw [abs_lt]; constructor <;> linarith

/-- Preveri se, vprašanje 3: če imata a in c različna predznaka (ac < 0), je −4ac > 0 in D = b² − 4ac > 0,
produkt rešitev c/a pa je negativen.
trditev: MAT-SS-2/kvadratna-enacba#razlicna-predznaka
besedilo: »Pri različnih predznakih je $ac < 0$, zato $-4ac > 0$ in $D = b^2 - 4ac > 0$. Produkt rešitev $\dfrac{c}{a}$ je negativen: ena rešitev je pozitivna, druga negativna.« -/
theorem razlicna_predznaka (a b c : ℝ) (h : a * c < 0) :
    0 < -4 * a * c ∧ 0 < b ^ 2 - 4 * a * c ∧ c / a < 0 := by
  have ha : a ≠ 0 := by rintro rfl; simp at h
  have e : c / a = a * c / a ^ 2 := by field_simp
  refine ⟨by linarith, by nlinarith [sq_nonneg b], ?_⟩
  rw [e]; exact div_neg_of_neg_of_pos h (by positivity)

/-- Predpostavka `razlicna_predznaka` se da izpolniti (a = 1, c = −1). -/
example : 0 < -4 * (1 : ℝ) * (-1) ∧ 0 < (0 : ℝ) ^ 2 - 4 * 1 * (-1) ∧ (-1 : ℝ) / 1 < 0 :=
  razlicna_predznaka 1 0 (-1) (by norm_num)

/-- Preveri se, vprašanje 4: rešitvi 2 in −5 ima x² + 3x − 10 = 0 (vsota −3, produkt −10); x² − 3x − 10
in x² + 3x + 10 ju nimata.
trditev: MAT-SS-2/kvadratna-enacba#preveri-2-m5
besedilo: »Vsota rešitev je $-3$, produkt $-10$, zato $x^2 - (-3)x + (-10) = x^2 + 3x - 10 = 0$.« -/
theorem preveri_2_m5 (x : ℝ) : (x ^ 2 + 3 * x - 10 = 0 ↔ x = 2 ∨ x = -5) ∧
    ((2 : ℝ) + -5 = -3 ∧ (2 : ℝ) * -5 = -10 ∧ x ^ 2 - (-3) * x + (-10) = x ^ 2 + 3 * x - 10) ∧
    (2 : ℝ) ^ 2 - 3 * 2 - 10 ≠ 0 ∧ (2 : ℝ) ^ 2 + 3 * 2 + 10 ≠ 0 := by
  refine ⟨?_, ⟨by norm_num, by norm_num, by ring⟩, by norm_num, by norm_num⟩
  rw [enacba_iff (P := (x - 2) * (x - -5)) (by ring), dva_faktorja]

/-- Preveri se, vprašanje 5 (Mars): 10t − 1,86t² = 15 ⇔ 1,86t² − 10t + 15 = 0, D = 10² − 4·1,86·15 =
100 − 111,6 = −11,6 < 0; množica takih časov je prazna (∅, 0 krat); največja višina je 100/7,44 ≈ 13,4 m.
trditev: MAT-SS-2/kvadratna-enacba#preveri-mars
besedilo: »$D = 10^2 - 4 \cdot 1{,}86 \cdot 15 = 100 - 111{,}6 = -11{,}6 < 0$. Realnega časa ni; kamen se dvigne le do približno $13{,}4\,\text{m}$.« -/
theorem preveri_mars : ((10 : ℝ) ^ 2 - 4 * 1.86 * 15 = 100 - 111.6 ∧ (100 : ℝ) - 111.6 = -11.6 ∧
    (-11.6 : ℝ) < 0) ∧ {t : ℝ | 10 * t - 1.86 * t ^ 2 = 15} = ∅ ∧
    {t : ℝ | 10 * t - 1.86 * t ^ 2 = 15}.ncard = 0 ∧
    (∀ t : ℝ, 10 * t - 1.86 * t ^ 2 ≤ 100 / 7.44) ∧
    10 * (10 / 3.72) - 1.86 * (10 / 3.72 : ℝ) ^ 2 = 100 / 7.44 ∧ |(100 : ℝ) / 7.44 - 13.4| < 0.05 := by
  have : {t : ℝ | 10 * t - 1.86 * t ^ 2 = 15} = ∅ := by
    apply Set.eq_empty_iff_forall_notMem.2
    intro t ht
    have h := D_neg 1.86 (-10) 15 (by norm_num) t
    apply h
    have ht' : 10 * t - 1.86 * t ^ 2 = 15 := ht
    linarith
  refine ⟨by norm_num, this, by rw [this, Set.ncard_empty],
    fun t => by nlinarith [sq_nonneg (t - 10 / 3.72)], by norm_num, by rw [abs_lt]; norm_num⟩

/-- Preveri se, vprašanje 6: x³ = 16x ⇔ x(x − 4)(x + 4) = 0; množica rešitev je {0, 4, −4} in ima
3 elemente.
trditev: MAT-SS-2/kvadratna-enacba#preveri-x3-16x
besedilo: »Na levo: $x^3 - 16x = 0$, razcep $x(x - 4)(x + 4) = 0$. Rešitve so $0$, $4$ in $-4$.« -/
theorem preveri_x3_16x : {x : ℝ | x ^ 3 = 16 * x} = {0, 4, -4} ∧ ({0, 4, -4} : Set ℝ).ncard = 3 := by
  refine ⟨?_, ?_⟩
  · ext x
    show x ^ 3 = 16 * x ↔ x = 0 ∨ x = 4 ∨ x = -4
    rw [enacba_iff (P := (x - 0) * (x - 4) * (x - -4)) (by ring), trije_faktorji]
  · rw [Set.ncard_insert_of_notMem (by norm_num), Set.ncard_pair (by norm_num)]

/-! ## Drugače: korak za korakom -/

/-- Drugače: korak za korakom: x(3x + 4) = 2 − x ⇔ 3x² + 4x = 2 − x ⇔ 3x² + 5x − 2 = 0;
D = 5² − 4·3·(−2) = 25 + 24 = 49 = 7²; x = (−5 ± 7)/6: 2/6 = 1/3 in −12/6 = −2.
trditev: MAT-SS-2/kvadratna-enacba#korak-za-korakom
besedilo: »Diskriminanta:** $D = 5^2 - 4 \cdot 3 \cdot (-2) = 25 + 24 = 49$. Ker je $D > 0$, pričakujemo dve realni rešitvi. Ker je $49 = 7^2$, bosta racionalni.« -/
theorem korak_za_korakom (x : ℝ) : (x * (3 * x + 4) = 2 - x ↔ 3 * x ^ 2 + 4 * x = 2 - x) ∧
    (3 * x ^ 2 + 4 * x = 2 - x ↔ 3 * x ^ 2 + 5 * x - 2 = 0) ∧
    ((5 : ℝ) ^ 2 - 4 * 3 * (-2) = 25 + 24 ∧ (25 : ℝ) + 24 = 49 ∧ (49 : ℝ) = 7 ^ 2) ∧
    ((-5 + 7) / 6 = (2 : ℝ) / 6 ∧ (2 : ℝ) / 6 = 1 / 3 ∧ (-5 - 7) / 6 = (-12 : ℝ) / 6 ∧
      (-12 : ℝ) / 6 = -2) ∧
    (3 * x ^ 2 + 5 * x - 2 = 0 ↔ x = 1 / 3 ∨ x = -2) := by
  refine ⟨by constructor <;> intro h <;> linarith, by constructor <;> intro h <;> linarith,
    by norm_num, by norm_num, ?_⟩
  rw [enacba_iff (P := 3 * ((x - 1 / 3) * (x - -2))) (by ring), mul_eq_zero, dva_faktorja,
    or_iff_right (by norm_num)]

/-- Drugače: korak za korakom, 6.–8.: Vieta 1/3 − 2 = −5/3 = −b/a, (1/3)(−2) = −2/3 = c/a; preverjanje
v prvotni enačbi (x = −2: 3·(−2) + 4 = −2, leva −2·(−2) = 4, desna 2 − (−2) = 4; x = 1/3: leva
(1/3)·5 = 5/3, desna 2 − 1/3 = 5/3); razcep 3x² + 5x − 2 = 3(x − 1/3)(x + 2) = (3x − 1)(x + 2).
trditev: MAT-SS-2/kvadratna-enacba#korak-preverjanje
besedilo: »Preverjanje v prvotni enačbi** za $x = -2$: v oklepaju je $3 \cdot (-2) + 4 = -2$, leva stran je $-2 \cdot (-2) = 4$, desna $2 - (-2) = 4$.« -/
theorem korak_preverjanje (x : ℝ) : ((1 : ℝ) / 3 - 2 = -5 / 3 ∧ (1 : ℝ) / 3 * -2 = -2 / 3) ∧
    (3 * (-2 : ℝ) + 4 = -2 ∧ (-2 : ℝ) * (-2) = 4 ∧ 2 - (-2 : ℝ) = 4) ∧
    ((1 : ℝ) / 3 * (3 * (1 / 3) + 4) = 1 / 3 * 5 ∧ (1 : ℝ) / 3 * 5 = 5 / 3 ∧ 2 - (1 : ℝ) / 3 = 5 / 3) ∧
    3 * x ^ 2 + 5 * x - 2 = 3 * (x - 1 / 3) * (x + 2) ∧ 3 * (x - 1 / 3) * (x + 2) = (3 * x - 1) * (x + 2) :=
  ⟨by norm_num, by norm_num, by norm_num, by ring, by ring⟩

end Evklid.Lekcije.MAT_SS_2.KvadratnaEnacba
