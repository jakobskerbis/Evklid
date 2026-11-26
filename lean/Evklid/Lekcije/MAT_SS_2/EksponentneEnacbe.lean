/-
vir: content/lessons/MAT-SS-2/eksponentne-enacbe.md
sha256: 9d08b9144c7d7117439d8fcbd2f6afe535541ed16635fbcc02ed2381686bc8d5
Ni v Leanu: zgodovinska zgodba o šahovnici (dokazan je račun 2^(n−1) = 1024); opis, kaj je eksponentna
enačba (razlaga 2, definicija z besedami); postopki v točkah (razlaga 7, 11, Ponovitev) kot navodila
(dokazani so vsi primeri, ki jih uporabljajo); risbe in simulacija (dokazane so presečišča in rešitve,
ki jih opisujejo); »rešitev 2ˣ = 5 je blizu 2,3« je dokazano kot 2,25 < x < 2,35; analogiji z valuto in
dresom (besedno); ustna vprašanja z besedami (dokazana so pravila, ki jih navajajo); točkovanje;
neenačbe, ki jih lekcija rešuje grafično, so dokazane računsko kot množice rešitev.
Dogovori Leana: aˣ je `Real.rpow`; neznanke so realna števila (tudi število krogov in odbojev), rešitev
je zapisana kot ↔ (vse rešitve). »≈ v« pomeni interval pol enote zadnjega mesta okoli v.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.EksponentneEnacbe

/-! ## Pomožne trditve -/

/-- Pomožno (za približke): če je e·q = p in aᵠ < yᵖ < bᵠ (y > 0, b ≥ 0), potem leži y^e med a in b.
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

/-- Pomožno: pri a > 1 je aˣ strogo naraščajoča.
pomozno -/
theorem narasca (a : ℝ) (ha : 1 < a) : StrictMono fun x : ℝ => a ^ x :=
  fun _ _ h => (Real.rpow_lt_rpow_left_iff ha).mpr h

/-- Predpostavke trditve `narasca` se dajo izpolniti (a = 2). -/
example : (1 : ℝ) < 2 := by norm_num

/-- Pomožno: pri 0 < a < 1 je aˣ strogo padajoča.
pomozno -/
theorem pada (a : ℝ) (h0 : 0 < a) (h1 : a < 1) : StrictAnti fun x : ℝ => a ^ x :=
  fun _ _ h => (Real.rpow_lt_rpow_left_iff_of_base_lt_one h0 h1).mpr h

/-- Predpostavke trditve `pada` se dajo izpolniti (a = 1/2). -/
example : (0 : ℝ) < 1 / 2 ∧ (1 / 2 : ℝ) < 1 := by norm_num

/-- Razlaga 3 (ključna lastnost, Povzetek, ustno vprašanje 1): za a > 0, a ≠ 1 je aᵘ = aᵛ ⟺ u = v.
trditev: MAT-SS-2/eksponentne-enacbe#enacenje
besedilo: »$$a^{u} = a^{v} \iff u = v \qquad (a > 0,\ a \ne 1).$$« -/
theorem enacenje (a : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (u v : ℝ) : a ^ u = a ^ v ↔ u = v := by
  constructor
  · intro h
    rcases lt_or_gt_of_ne ha1 with h1 | h1
    · exact (pada a ha h1).injective h
    · exact (narasca a h1).injective h
  · intro h; rw [h]

/-- Predpostavke trditve `enacenje` se dajo izpolniti (a = 2). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 := by norm_num

/-- Predpostavke trditve `enacenje` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 := by norm_num
  enacenje (ha := w.1) (ha1 := w.2)

/-- Pomožno: (t − r)(t − s) = 0 ⟺ t = r ali t = s.
pomozno -/
theorem kvadratna (t r s : ℝ) : (t - r) * (t - s) = 0 ↔ t = r ∨ t = s := by
  rw [mul_eq_zero, sub_eq_zero, sub_eq_zero]

/-- Pomožno: (a²)ˣ = (aˣ)² za a ≥ 0 (npr. 4ˣ = (2ˣ)², 9ˣ = (3ˣ)²).
pomozno -/
theorem kvad (a x : ℝ) (ha : 0 ≤ a) : (a ^ 2) ^ x = (a ^ x) ^ 2 := by
  rw [← Real.rpow_natCast a 2, ← Real.rpow_mul ha, ← Real.rpow_natCast (a ^ x) 2,
    ← Real.rpow_mul ha]
  congr 1; push_cast; ring

/-- Predpostavke trditve `kvad` se dajo izpolniti (a = 2). -/
example : (0 : ℝ) ≤ 2 := by norm_num

/-- Pomožno: 4ˣ = (2ˣ)².
pomozno -/
theorem stiri (x : ℝ) : (4 : ℝ) ^ x = ((2 : ℝ) ^ x) ^ 2 := by
  rw [show (4 : ℝ) = 2 ^ 2 by norm_num]; exact kvad 2 x (by norm_num)

/-- Pomožno: 9ˣ = (3ˣ)².
pomozno -/
theorem devet (x : ℝ) : (9 : ℝ) ^ x = ((3 : ℝ) ^ x) ^ 2 := by
  rw [show (9 : ℝ) = 3 ^ 2 by norm_num]; exact kvad 3 x (by norm_num)

/-! ## Razlaga 1: šahovnica -/

/-- Razlaga 1: 2¹ = 2, 2² = 4, 2³ = 8, 2¹⁰ = 1024; 2^(n−1) = 1024 ⟺ 2^(n−1) = 2¹⁰ ⟺ n − 1 = 10 ⟺ n = 11;
preizkus 2^(11−1) = 2¹⁰ = 1024.
trditev: MAT-SS-2/eksponentne-enacbe#sahovnica
besedilo: »Desno stran zapišemo kot potenco števila $2$: $2^1 = 2$, $2^2 = 4$, $2^3 = 8$, … in $2^{10} = 1024$.« -/
theorem sahovnica (n : ℝ) :
    ((2 : ℝ) ^ (1 : ℝ) = 2 ∧ (2 : ℝ) ^ (2 : ℝ) = 4 ∧ (2 : ℝ) ^ (3 : ℝ) = 8 ∧ (2 : ℝ) ^ (10 : ℝ) = 1024) ∧
    ((2 : ℝ) ^ (n - 1) = 1024 ↔ n = 11) ∧ (2 : ℝ) ^ ((11 : ℝ) - 1) = 1024 := by
  refine ⟨by norm_num, ?_, by norm_num⟩
  calc (2 : ℝ) ^ (n - 1) = 1024 ↔ (2 : ℝ) ^ (n - 1) = (2 : ℝ) ^ (10 : ℝ) := by norm_num
    _ ↔ n - 1 = 10 := enacenje 2 (by norm_num) (by norm_num) _ _
    _ ↔ n = 11 := by constructor <;> intro h <;> linarith

/-! ## Razlaga 3 in 4 -/

/-- Razlaga 3: pogoj a ≠ 1 je potreben: 1⁵ = 1⁷, a 5 ≠ 7.
trditev: MAT-SS-2/eksponentne-enacbe#ena-osnova
besedilo: »Pogoj $a \ne 1$ je pomemben: $1^5 = 1^7$, pa vendar $5 \ne 7$.« -/
theorem ena_osnova : (1 : ℝ) ^ (5 : ℝ) = (1 : ℝ) ^ (7 : ℝ) ∧ (5 : ℝ) ≠ 7 := by norm_num

/-- Razlaga 4 (in Povzetek, ustno vprašanje 3): za a > 0 in c ≤ 0 enačba aˣ = c nima rešitve; posebej
2ˣ = −4, 3ˣ = 0, 3ˣ = −9 in 3ˣ = −3 nimajo rešitve.
trditev: MAT-SS-2/eksponentne-enacbe#brez-resitve
besedilo: »4. Kdaj enačba nima rešitve.** Za $a > 0$ je potenca $a^x$ vedno pozitivna. Enačbe $2^x = -4$ ali $3^x = 0$ zato nimajo realne rešitve. To preveriš takoj, preden začneš računati.« -/
theorem brez_resitve (a c : ℝ) (ha : 0 < a) (hc : c ≤ 0) : ¬ ∃ x : ℝ, a ^ x = c := by
  rintro ⟨x, hx⟩
  have := Real.rpow_pos_of_pos ha x
  linarith

/-- Predpostavke trditve `brez_resitve` se dajo izpolniti (a = 2, c = −4). -/
example : (0 : ℝ) < 2 ∧ (-4 : ℝ) ≤ 0 := by norm_num

/-- Predpostavke trditve `brez_resitve` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (-4 : ℝ) ≤ 0 := by norm_num
  brez_resitve (ha := w.1) (hc := w.2)

/-- Razlaga 4: primeri 2ˣ = −4, 3ˣ = 0, 3ˣ = −9, 3ˣ = −3 brez rešitve.
trditev: MAT-SS-2/eksponentne-enacbe#brez-resitve-primeri
besedilo: »Enačbe $2^x = -4$ ali $3^x = 0$ zato nimajo realne rešitve.« -/
theorem brez_resitve_primeri :
    (¬ ∃ x : ℝ, (2 : ℝ) ^ x = -4) ∧ (¬ ∃ x : ℝ, (3 : ℝ) ^ x = 0) ∧
    (¬ ∃ x : ℝ, (3 : ℝ) ^ x = -9) ∧ (¬ ∃ x : ℝ, (3 : ℝ) ^ x = -3) :=
  ⟨brez_resitve 2 (-4) (by norm_num) (by norm_num), brez_resitve 3 0 (by norm_num) le_rfl,
    brez_resitve 3 (-9) (by norm_num) (by norm_num), brez_resitve 3 (-3) (by norm_num) (by norm_num)⟩

/-- Razlaga 4, premisli: 2ˣ = 2^(x+1) nima rešitve (x = x + 1 ne velja; 2^(x+1) = 2·2ˣ).
trditev: MAT-SS-2/eksponentne-enacbe#premisli-x-plus-1
besedilo: »Nobene. Z enačenjem eksponentov dobimo enačbo $x = x + 1$, ki ne velja za noben $x$. Drugače: $2^{x+1} = 2 \cdot 2^x$, iz enačbe $2^x = 2 \cdot 2^x$ pa bi sledilo $2^x = 0$, kar je nemogoče.« -/
theorem premisli_x_plus_1 : (∀ x : ℝ, (2 : ℝ) ^ (x + 1) = 2 * (2 : ℝ) ^ x) ∧
    ¬ ∃ x : ℝ, (2 : ℝ) ^ x = (2 : ℝ) ^ (x + 1) := by
  refine ⟨fun x => by rw [Real.rpow_add (by norm_num), Real.rpow_one]; ring, ?_⟩
  rintro ⟨x, hx⟩
  have := (enacenje 2 (by norm_num) (by norm_num) _ _).mp hx
  linarith

/-! ## Razlaga 5: enačenje osnov -/

/-- Razlaga 5, tabela: potence števil 2, 3, 5 ter za a > 0 in n ≠ 0: 1 = a⁰, 1/aⁿ = a⁻ⁿ,
(aᵐ)^(1/n) = a^(m/n).
trditev: MAT-SS-2/eksponentne-enacbe#tabela-potenc
besedilo: »$4 = 2^2$, $8 = 2^3$, $16 = 2^4$, $32 = 2^5$, $64 = 2^6$, $128 = 2^7$, $256 = 2^8$« -/
theorem tabela_potenc :
    ((2 : ℝ) ^ 2 = 4 ∧ (2 : ℝ) ^ 3 = 8 ∧ (2 : ℝ) ^ 4 = 16 ∧ (2 : ℝ) ^ 5 = 32 ∧ (2 : ℝ) ^ 6 = 64 ∧
      (2 : ℝ) ^ 7 = 128 ∧ (2 : ℝ) ^ 8 = 256) ∧
    ((3 : ℝ) ^ 2 = 9 ∧ (3 : ℝ) ^ 3 = 27 ∧ (3 : ℝ) ^ 4 = 81 ∧ (3 : ℝ) ^ 5 = 243) ∧
    ((5 : ℝ) ^ 2 = 25 ∧ (5 : ℝ) ^ 3 = 125 ∧ (5 : ℝ) ^ 4 = 625) ∧
    ∀ a n m : ℝ, 0 < a → n ≠ 0 → a ^ (0 : ℝ) = 1 ∧ 1 / a ^ n = a ^ (-n) ∧
      (a ^ m) ^ (1 / n) = a ^ (m / n) := by
  refine ⟨by norm_num, by norm_num, by norm_num, fun a n m ha _ => ⟨Real.rpow_zero a, ?_, ?_⟩⟩
  · rw [Real.rpow_neg ha.le, one_div]
  · rw [← Real.rpow_mul ha.le]; congr 1; ring

/-- Razlaga 5 (in analogija z valuto): 8ˣ = 4^(x+1) ⟺ 2^(3x) = 2^(2x+2) ⟺ 3x = 2x + 2 ⟺ x = 2.
trditev: MAT-SS-2/eksponentne-enacbe#osem-stiri
besedilo: »Primer: $8^{x} = 4^{x+1}$. Ker je $8 = 2^3$ in $4 = 2^2$, dobimo $2^{3x} = 2^{2x+2}$, torej $3x = 2x + 2$ in $x = 2$.« -/
theorem osem_stiri (x : ℝ) : (8 : ℝ) ^ x = (4 : ℝ) ^ (x + 1) ↔ x = 2 := by
  have h8 : (8 : ℝ) ^ x = (2 : ℝ) ^ (3 * x) := by
    rw [show (8 : ℝ) = 2 ^ (3 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]
  have h4 : (4 : ℝ) ^ (x + 1) = (2 : ℝ) ^ (2 * x + 2) := by
    rw [show (4 : ℝ) = 2 ^ (2 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; congr 1; ring
  calc (8 : ℝ) ^ x = (4 : ℝ) ^ (x + 1) ↔ (2 : ℝ) ^ (3 * x) = (2 : ℝ) ^ (2 * x + 2) := by rw [h8, h4]
    _ ↔ 3 * x = 2 * x + 2 := enacenje 2 (by norm_num) (by norm_num) _ _
    _ ↔ x = 2 := by constructor <;> intro h <;> linarith

/-! ## Razlaga 6: izpostavljanje -/

/-- Razlaga 6: 3^(x+1) − 3^(x−1) = 72 ⟺ 3·3ˣ − (1/3)·3ˣ = 72 ⟺ 3ˣ(3 − 1/3) = 72 ⟺ 3ˣ·8/3 = 72
⟺ 3ˣ = 72·3/8 = 27 = 3³ ⟺ x = 3.
trditev: MAT-SS-2/eksponentne-enacbe#izpostavljanje
besedilo: »$$3^x = 72 \cdot \frac{3}{8} = 27 = 3^3 \;\Rightarrow\;« -/
theorem izpostavljanje (x : ℝ) : (3 : ℝ) ^ (x + 1) - (3 : ℝ) ^ (x - 1) = 72 ↔ x = 3 := by
  have h1 : (3 : ℝ) ^ (x + 1) = 3 * (3 : ℝ) ^ x := by
    rw [Real.rpow_add (by norm_num), Real.rpow_one]; ring
  have h2 : (3 : ℝ) ^ (x - 1) = 1 / 3 * (3 : ℝ) ^ x := by
    rw [Real.rpow_sub (by norm_num), Real.rpow_one]; ring
  calc (3 : ℝ) ^ (x + 1) - (3 : ℝ) ^ (x - 1) = 72 ↔ 3 * (3 : ℝ) ^ x - 1 / 3 * (3 : ℝ) ^ x = 72 := by
        rw [h1, h2]
    _ ↔ (3 : ℝ) ^ x * (3 - 1 / 3) = 72 := by constructor <;> intro h <;> linarith
    _ ↔ (3 : ℝ) ^ x * (8 / 3) = 72 := by norm_num
    _ ↔ (3 : ℝ) ^ x = 72 * (3 / 8) := by constructor <;> intro h <;> linarith
    _ ↔ (3 : ℝ) ^ x = (3 : ℝ) ^ (3 : ℝ) := by norm_num
    _ ↔ x = 3 := enacenje 3 (by norm_num) (by norm_num) _ _

/-! ## Razlaga 7: nova spremenljivka -/

/-- Razlaga 7, premisli: 2ˣ = t pri t ≤ 0 nima rešitve, 2ˣ = 1/2 pa ima rešitev x = −1 (majhen pozitiven
t pomeni negativen x).
trditev: MAT-SS-2/eksponentne-enacbe#majhen-t
besedilo: »Ker je $2^x$ vedno pozitivno, enačba $2^x = t$ s $t \le 0$ nima rešitve. Vsako pozitivno število pa je vrednost potence: enačba $2^x = \frac{1}{2}$ ima rešitev $x = -1$. Majhen pozitiven $t$ pomeni le negativen $x$.« -/
theorem majhen_t (x : ℝ) : (2 : ℝ) ^ x = 1 / 2 ↔ x = -1 := by
  calc (2 : ℝ) ^ x = 1 / 2 ↔ (2 : ℝ) ^ x = (2 : ℝ) ^ (-1 : ℝ) := by norm_num
    _ ↔ x = -1 := enacenje 2 (by norm_num) (by norm_num) _ _

/-! ## Razlaga 8: enaka eksponenta -/

/-- Razlaga 8 (in Povzetek): za a, b > 0, a ≠ b iz aᵘ = bᵘ sledi (a/b)ᵘ = 1 = (a/b)⁰ in u = 0.
trditev: MAT-SS-2/eksponentne-enacbe#enaka-eksponenta
besedilo: »Enaki eksponenti, različni osnovi.** Če je $a^{u} = b^{u}$ za različni pozitivni osnovi $a$ in $b$, delimo z $b^u$ in dobimo $\left(\dfrac{a}{b}\right)^u = 1 = \left(\dfrac{a}{b}\right)^0$, zato je $u = 0$.« -/
theorem enaka_eksponenta (a b u : ℝ) (ha : 0 < a) (hb : 0 < b) (hab : a ≠ b) (h : a ^ u = b ^ u) :
    (a / b) ^ u = 1 ∧ (1 : ℝ) = (a / b) ^ (0 : ℝ) ∧ u = 0 := by
  have h1 : (a / b) ^ u = 1 := by
    rw [Real.div_rpow ha.le hb.le, h, div_self (Real.rpow_pos_of_pos hb u).ne']
  have hab' : a / b ≠ 1 := by
    intro h2; apply hab; field_simp at h2; linarith
  refine ⟨h1, (Real.rpow_zero _).symm, ?_⟩
  rw [← Real.rpow_zero (a / b)] at h1
  exact (enacenje (a / b) (div_pos ha hb) hab' u 0).mp h1

/-- Predpostavke trditve `enaka_eksponenta` se dajo izpolniti (a = 2, b = 5, u = 0). -/
example : (0 : ℝ) < 2 ∧ (0 : ℝ) < 5 ∧ (2 : ℝ) ≠ 5 ∧ (2 : ℝ) ^ (0 : ℝ) = (5 : ℝ) ^ (0 : ℝ) := by norm_num

/-- Predpostavke trditve `enaka_eksponenta` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (0 : ℝ) < 5 ∧ (2 : ℝ) ≠ 5 ∧ (2 : ℝ) ^ (0 : ℝ) = (5 : ℝ) ^ (0 : ℝ) := by norm_num
  enaka_eksponenta (ha := w.1) (hb := w.2.1) (hab := w.2.2.1) (h := w.2.2.2)

/-- Razlaga 8: 2^(x−3) = 5^(x−3) ⟺ x = 3.
trditev: MAT-SS-2/eksponentne-enacbe#dva-pet
besedilo: »Tako je rešitev enačbe $2^{x-3} = 5^{x-3}$ število $x = 3$.« -/
theorem dva_pet (x : ℝ) : (2 : ℝ) ^ (x - 3) = (5 : ℝ) ^ (x - 3) ↔ x = 3 := by
  constructor
  · intro h
    have := (enaka_eksponenta 2 5 (x - 3) (by norm_num) (by norm_num) (by norm_num) h).2.2
    linarith
  · intro h; rw [h]; norm_num

/-! ## Razlaga 10: grafični pogled, obstoj rešitve -/

/-- Razlaga 10: 2ˣ = 8 ⟺ x = 3.
trditev: MAT-SS-2/eksponentne-enacbe#dva-osem
besedilo: »Rešitve enačbe $2^x = 8$ so torej abscise presečišč krivulje $y = 2^x$ in vodoravne premice $y = 8$; presečišče je pri $x = 3$.« -/
theorem dva_osem (x : ℝ) : (2 : ℝ) ^ x = 8 ↔ x = 3 := by
  calc (2 : ℝ) ^ x = 8 ↔ (2 : ℝ) ^ x = (2 : ℝ) ^ (3 : ℝ) := by norm_num
    _ ↔ x = 3 := enacenje 2 (by norm_num) (by norm_num) _ _

/-- Razlaga 10 in Bolj natančno (obstoj rešitve): za a > 0, a ≠ 1 in c > 0 ima aˣ = c natanko eno
rešitev; pri a = 2: rešitev enačbe 2ˣ = b je pri b = 1 enaka 0, pri 0 < b < 1 pa negativna.
trditev: MAT-SS-2/eksponentne-enacbe#obstoj
besedilo: »Zato ima enačba $a^x = c$ za vsak $c > 0$ natanko eno rešitev,« -/
theorem obstoj (a c : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (hc : 0 < c) :
    (∃! x : ℝ, a ^ x = c) ∧ (∀ x : ℝ, (2 : ℝ) ^ x = 1 ↔ x = 0) ∧
    (∀ b x : ℝ, b < 1 → (2 : ℝ) ^ x = b → x < 0) := by
  refine ⟨⟨Real.logb a c, Real.rpow_logb ha ha1 hc, fun y hy => ?_⟩, fun x => ?_, fun b x hb hx => ?_⟩
  · rw [← Real.rpow_logb ha ha1 hc] at hy
    exact (enacenje a ha ha1 _ _).mp hy
  · rw [show (1 : ℝ) = (2 : ℝ) ^ (0 : ℝ) by norm_num]; exact enacenje 2 (by norm_num) (by norm_num) _ _
  · have : (2 : ℝ) ^ x < (2 : ℝ) ^ (0 : ℝ) := by rw [Real.rpow_zero]; linarith
    exact (Real.rpow_lt_rpow_left_iff (by norm_num)).mp this

/-- Predpostavke trditve `obstoj` se dajo izpolniti (a = 2, c = 5). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 5 := by norm_num

/-- Predpostavke trditve `obstoj` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 5 := by norm_num
  obstoj (ha := w.1) (ha1 := w.2.1) (hc := w.2.2)

/-- Razlaga 10: 2ˣ = 5 ima rešitev, in vsaka rešitev leži med 2,25 in 2,35 (≈ 2,3).
trditev: MAT-SS-2/eksponentne-enacbe#dva-pet-resitev
besedilo: »Kaj pa enačba $2^x = 5$? Števila $5$ ne znamo zapisati kot potenco števila $2$ s preprostim eksponentom. Rešitev vseeno obstaja, graf jo pokaže blizu $x \approx 2{,}3$. Natančno jo bomo zapisali šele v naslednji lekciji.« -/
theorem dva_pet_resitev : (∃ x : ℝ, (2 : ℝ) ^ x = 5) ∧
    ∀ x : ℝ, (2 : ℝ) ^ x = 5 → 2.25 < x ∧ x < 2.35 := by
  refine ⟨⟨Real.logb 2 5, Real.rpow_logb (by norm_num) (by norm_num) (by norm_num)⟩, fun x hx => ?_⟩
  have h1 : (0 : ℝ) < (2 : ℝ) ^ (2.25 : ℝ) ∧ (2 : ℝ) ^ (2.25 : ℝ) < 5 :=
    koren_med (p := 9) (q := 4) (by norm_num) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h2 : (5 : ℝ) < (2 : ℝ) ^ (2.35 : ℝ) ∧ (2 : ℝ) ^ (2.35 : ℝ) < 6 :=
    koren_med (p := 47) (q := 20) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num)
  rw [← hx] at h1 h2
  exact ⟨(Real.rpow_lt_rpow_left_iff (by norm_num)).mp h1.2,
    (Real.rpow_lt_rpow_left_iff (by norm_num)).mp h2.1⟩

/-! ## Razlaga 11: neenačbe -/

/-- Razlaga 11: 2ˣ < 8 ⟺ x < 3 in (1/2)ˣ < 8 ⟺ x > −3 (presečišči (3, 8) in (−3, 8)).
trditev: MAT-SS-2/eksponentne-enacbe#neenacbi
besedilo: »Padajoča krivulja $y = \left(\frac{1}{2}\right)^x$ pa je pod premico $y = 8$ desno od presečišča $(-3, 8)$, zato neenačbo $\left(\frac{1}{2}\right)^x < 8$ rešijo vsi $x > -3$.« -/
theorem neenacbi (x : ℝ) : ((2 : ℝ) ^ x < 8 ↔ x < 3) ∧ ((1 / 2 : ℝ) ^ x < 8 ↔ -3 < x) := by
  constructor
  · rw [show (8 : ℝ) = (2 : ℝ) ^ (3 : ℝ) by norm_num]
    exact Real.rpow_lt_rpow_left_iff (by norm_num)
  · rw [show (8 : ℝ) = (1 / 2 : ℝ) ^ (-3 : ℝ) by norm_num [Real.rpow_neg]]
    exact Real.rpow_lt_rpow_left_iff_of_base_lt_one (by norm_num) (by norm_num)

/-! ## Primer 1 -/

/-- Primer 1 a): 1/27 = 1/3³ = 3^(−3); 3^(2x−1) = 1/27 ⟺ 3^(2x−1) = 3^(−3) ⟺ 2x − 1 = −3 ⟺ 2x = −2
⟺ x = −1; preizkus 3^(2·(−1)−1) = 3^(−3) = 1/27.
trditev: MAT-SS-2/eksponentne-enacbe#primer1a
besedilo: »Preizkus: $3^{2 \cdot (-1) - 1} = 3^{-3} = \dfrac{1}{27}$.« -/
theorem primer1a (x : ℝ) :
    (1 : ℝ) / 27 = 1 / 3 ^ 3 ∧ (1 : ℝ) / 3 ^ 3 = (3 : ℝ) ^ (-3 : ℝ) ∧
    ((3 : ℝ) ^ (2 * x - 1) = 1 / 27 ↔ x = -1) ∧
    (3 : ℝ) ^ (2 * (-1 : ℝ) - 1) = (3 : ℝ) ^ (-3 : ℝ) ∧ (3 : ℝ) ^ (-3 : ℝ) = 1 / 27 := by
  refine ⟨by norm_num, by norm_num [Real.rpow_neg], ?_, by norm_num, by norm_num [Real.rpow_neg]⟩
  calc (3 : ℝ) ^ (2 * x - 1) = 1 / 27 ↔ (3 : ℝ) ^ (2 * x - 1) = (3 : ℝ) ^ (-3 : ℝ) := by
        norm_num [Real.rpow_neg]
    _ ↔ 2 * x - 1 = -3 := enacenje 3 (by norm_num) (by norm_num) _ _
    _ ↔ 2 * x = -2 := by constructor <;> intro h <;> linarith
    _ ↔ x = -1 := by constructor <;> intro h <;> linarith

/-- Primer 1 b): 4ˣ = (2²)ˣ = 2^(2x), 8√2 = 2³·2^(1/2) = 2^(7/2); 4ˣ = 8√2 ⟺ 2^(2x) = 2^(7/2) ⟺ 2x = 7/2
⟺ x = 7/4.
trditev: MAT-SS-2/eksponentne-enacbe#primer1b
besedilo: »b) Obe strani zapišemo s potenco števila $2$: $4^x = \left(2^2\right)^x = 2^{2x}$ in $8\sqrt{2} = 2^3 \cdot 2^{\frac{1}{2}} = 2^{\frac{7}{2}}$.« -/
theorem primer1b (x : ℝ) :
    (4 : ℝ) ^ x = (2 : ℝ) ^ (2 * x) ∧ 8 * Real.sqrt 2 = (2 : ℝ) ^ (3 : ℝ) * (2 : ℝ) ^ (1 / 2 : ℝ) ∧
    (2 : ℝ) ^ (3 : ℝ) * (2 : ℝ) ^ (1 / 2 : ℝ) = (2 : ℝ) ^ (7 / 2 : ℝ) ∧
    ((4 : ℝ) ^ x = 8 * Real.sqrt 2 ↔ x = 7 / 4) := by
  have h4 : (4 : ℝ) ^ x = (2 : ℝ) ^ (2 * x) := by
    rw [show (4 : ℝ) = 2 ^ (2 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]
  have hs1 : 8 * Real.sqrt 2 = (2 : ℝ) ^ (3 : ℝ) * (2 : ℝ) ^ (1 / 2 : ℝ) := by
    rw [Real.sqrt_eq_rpow]; norm_num
  have hs2 : (2 : ℝ) ^ (3 : ℝ) * (2 : ℝ) ^ (1 / 2 : ℝ) = (2 : ℝ) ^ (7 / 2 : ℝ) := by
    rw [← Real.rpow_add (by norm_num)]; norm_num
  refine ⟨h4, hs1, hs2, ?_⟩
  calc (4 : ℝ) ^ x = 8 * Real.sqrt 2 ↔ (2 : ℝ) ^ (2 * x) = (2 : ℝ) ^ (7 / 2 : ℝ) := by
        rw [h4, hs1, hs2]
    _ ↔ 2 * x = 7 / 2 := enacenje 2 (by norm_num) (by norm_num) _ _
    _ ↔ x = 7 / 4 := by constructor <;> intro h <;> linarith

/-- Primer 1 b), preizkus: 4^(7/4) = 2^(7/2) ≈ 11,31 in 8·1,414 ≈ 11,31.
trditev: MAT-SS-2/eksponentne-enacbe#primer1b-preizkus
besedilo: »Preizkus: $4^{\frac{7}{4}} = 2^{\frac{7}{2}} \approx 11{,}31$ in $8\sqrt{2} \approx 8 \cdot 1{,}414 \approx 11{,}31$.« -/
theorem primer1b_preizkus : (4 : ℝ) ^ (7 / 4 : ℝ) = (2 : ℝ) ^ (7 / 2 : ℝ) ∧
    (11.305 < (2 : ℝ) ^ (7 / 2 : ℝ) ∧ (2 : ℝ) ^ (7 / 2 : ℝ) < 11.315) ∧
    (11.305 < (8 : ℝ) * 1.414 ∧ (8 : ℝ) * 1.414 < 11.315) := by
  refine ⟨?_, koren_med (p := 7) (q := 2) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
    (by norm_num), by norm_num⟩
  rw [(primer1b (7 / 4)).1]; norm_num

/-! ## Primer 2 -/

/-- Primer 2: 2^(x+2) + 2^(x−1) = 36 ⟺ 4·2ˣ + (1/2)·2ˣ = 36 ⟺ 2ˣ(4 + 1/2) = 36 ⟺ 2ˣ·9/2 = 36
⟺ 2ˣ = 36·2/9 = 8 = 2³ ⟺ x = 3; preizkus 2⁵ + 2² = 32 + 4 = 36.
trditev: MAT-SS-2/eksponentne-enacbe#primer2
besedilo: »$2^{x+2} = 4 \cdot 2^x$, zato je $2^x(4 + 1) = 5 \cdot 2^x = 40$. Sledi $2^x = 8 = 2^3$ in $x = 3$; preizkus: $32 + 8 = 40$.« -/
theorem primer2 (x : ℝ) :
    ((2 : ℝ) ^ (x + 2) + (2 : ℝ) ^ (x - 1) = 36 ↔ x = 3) ∧
    (2 : ℝ) ^ ((3 : ℝ) + 2) + (2 : ℝ) ^ ((3 : ℝ) - 1) = 32 + 4 ∧ (32 : ℝ) + 4 = 36 := by
  have h1 : (2 : ℝ) ^ (x + 2) = 4 * (2 : ℝ) ^ x := by
    rw [Real.rpow_add (by norm_num), mul_comm]; norm_num
  have h2 : (2 : ℝ) ^ (x - 1) = 1 / 2 * (2 : ℝ) ^ x := by
    rw [Real.rpow_sub (by norm_num), Real.rpow_one]; ring
  refine ⟨?_, by norm_num, by norm_num⟩
  calc (2 : ℝ) ^ (x + 2) + (2 : ℝ) ^ (x - 1) = 36 ↔ 4 * (2 : ℝ) ^ x + 1 / 2 * (2 : ℝ) ^ x = 36 := by
        rw [h1, h2]
    _ ↔ (2 : ℝ) ^ x * (4 + 1 / 2) = 36 := by constructor <;> intro h <;> linarith
    _ ↔ (2 : ℝ) ^ x * (9 / 2) = 36 := by norm_num
    _ ↔ (2 : ℝ) ^ x = 36 * (2 / 9) := by constructor <;> intro h <;> linarith
    _ ↔ (2 : ℝ) ^ x = 8 := by norm_num
    _ ↔ x = 3 := dva_osem x

/-! ## Primer 3 -/

/-- Primer 3: 9ˣ = (3ˣ)², 2·3^(x+1) = 6·3ˣ; 9ˣ − 2·3^(x+1) − 27 = 0 ⟺ t² − 6t − 27 = 0 (t = 3ˣ)
⟺ (t − 9)(t + 3) = 0 ⟺ t = 9 ali t = −3 ⟺ t = 9 (t = −3 < 0 zavržemo) ⟺ 3ˣ = 3² ⟺ x = 2.
trditev: MAT-SS-2/eksponentne-enacbe#primer3
besedilo: »Vse potence zapišemo s $3^x$: $9^x = \left(3^2\right)^x = \left(3^x\right)^2$ in $2 \cdot 3^{x+1} = 2 \cdot 3 \cdot 3^x = 6 \cdot 3^x$.« -/
theorem primer3 (x : ℝ) : (9 : ℝ) ^ x - 2 * (3 : ℝ) ^ (x + 1) - 27 = 0 ↔ x = 2 := by
  have ht : 0 < (3 : ℝ) ^ x := Real.rpow_pos_of_pos (by norm_num) x
  have h3 : 2 * (3 : ℝ) ^ (x + 1) = 6 * (3 : ℝ) ^ x := by
    rw [Real.rpow_add (by norm_num), Real.rpow_one]; ring
  calc (9 : ℝ) ^ x - 2 * (3 : ℝ) ^ (x + 1) - 27 = 0
      ↔ ((3 : ℝ) ^ x) ^ 2 - 6 * (3 : ℝ) ^ x - 27 = 0 := by rw [devet, h3]
    _ ↔ ((3 : ℝ) ^ x - 9) * ((3 : ℝ) ^ x - (-3)) = 0 := by
        rw [show ((3 : ℝ) ^ x - 9) * ((3 : ℝ) ^ x - (-3)) = ((3 : ℝ) ^ x) ^ 2 - 6 * (3 : ℝ) ^ x - 27 by
          ring]
    _ ↔ (3 : ℝ) ^ x = 9 ∨ (3 : ℝ) ^ x = -3 := kvadratna _ _ _
    _ ↔ (3 : ℝ) ^ x = 9 := by
        constructor
        · rintro (h | h)
          · exact h
          · linarith
        · exact Or.inl
    _ ↔ (3 : ℝ) ^ x = (3 : ℝ) ^ (2 : ℝ) := by norm_num
    _ ↔ x = 2 := enacenje 3 (by norm_num) (by norm_num) _ _

/-- Primer 3: D = 36 + 108 = 144, t₁,₂ = (6 ± 12)/2 = 9, −3; preizkus 9² − 2·3³ − 27 = 81 − 54 − 27 = 0.
trditev: MAT-SS-2/eksponentne-enacbe#primer3-racun
besedilo: »Rešimo kvadratno enačbo. Diskriminanta je $D = 36 + 108 = 144$, zato je $t_{1,2} = \dfrac{6 \pm 12}{2}$, torej $t_1 = 9$ in $t_2 = -3$. (Tudi razcep $(t - 9)(t + 3) = 0$ da isto.)« -/
theorem primer3_racun : (-6 : ℝ) ^ 2 - 4 * 1 * (-27) = 36 + 108 ∧ (36 : ℝ) + 108 = 144 ∧
    Real.sqrt 144 = 12 ∧ ((6 : ℝ) + 12) / 2 = 9 ∧ ((6 : ℝ) - 12) / 2 = -3 ∧
    (9 : ℝ) ^ (2 : ℝ) - 2 * (3 : ℝ) ^ ((2 : ℝ) + 1) - 27 = 81 - 54 - 27 ∧ (81 : ℝ) - 54 - 27 = 0 := by
  refine ⟨by norm_num, by norm_num, ?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  rw [show (144 : ℝ) = 12 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-! ## Primer 4: turnir -/

/-- Primer 4: 256·(1/2)ⁿ = 2 ⟺ (1/2)ⁿ = 2/256 = 1/128 ⟺ (1/2)ⁿ = (1/2)⁷ (128 = 2⁷) ⟺ n = 7.
trditev: MAT-SS-2/eksponentne-enacbe#primer4
besedilo: »Ker je $128 = 2^7$, je $\frac{1}{128} = \left(\frac{1}{2}\right)^7$ in $n = 7$.« -/
theorem primer4 (n : ℝ) : 256 * (1 / 2 : ℝ) ^ n = 2 ↔ n = 7 := by
  calc 256 * (1 / 2 : ℝ) ^ n = 2 ↔ (1 / 2 : ℝ) ^ n = 2 / 256 := by
        constructor <;> intro h <;> linarith
    _ ↔ (1 / 2 : ℝ) ^ n = 1 / 128 := by norm_num
    _ ↔ (1 / 2 : ℝ) ^ n = (1 / 2 : ℝ) ^ (7 : ℝ) := by norm_num
    _ ↔ n = 7 := enacenje (1 / 2) (by norm_num) (by norm_num) _ _

/-- Primer 4, premisli: 128 = 2⁷, 256·1/128 = 2; finale je osmi krog: 256·(1/2)⁸ = 1 zmagovalec.
trditev: MAT-SS-2/eksponentne-enacbe#primer4-racun
besedilo: »Finale je še en krog, zato ima turnir $8$ krogov; po njem ostane $256 \cdot \left(\frac{1}{2}\right)^8 = 1$ zmagovalec.« -/
theorem primer4_racun : (128 : ℝ) = 2 ^ 7 ∧ (256 : ℝ) * (1 / 128) = 2 ∧ (7 : ℝ) + 1 = 8 ∧
    256 * (1 / 2 : ℝ) ^ (8 : ℝ) = 1 := by norm_num

/-! ## Primer 5: neenačbi -/

/-- Pomožno: za t < 0 in t > 1 je 2ᵗ > 1 + t, za 0 ≤ t ≤ 1 pa 2ᵗ ≤ 1 + t.
pomozno -/
theorem dve_na_t (t : ℝ) : (t < 0 → 1 + t < (2 : ℝ) ^ t) ∧ (1 < t → 1 + t < (2 : ℝ) ^ t) ∧
    (0 ≤ t → t ≤ 1 → (2 : ℝ) ^ t ≤ 1 + t) := by
  have hl1 := Real.log_two_gt_d9
  have hl2 := Real.log_two_lt_d9
  have hdef : ∀ s : ℝ, (2 : ℝ) ^ s = Real.exp (Real.log 2 * s) :=
    fun s => Real.rpow_def_of_pos (by norm_num) s
  refine ⟨fun ht => ?_, fun ht => ?_, fun h0 h1 => ?_⟩
  · rw [hdef]
    have := Real.add_one_le_exp (Real.log 2 * t)
    nlinarith
  · rw [show t = (t - 1) + 1 by ring, Real.rpow_add (by norm_num), Real.rpow_one, hdef]
    have := Real.add_one_le_exp (Real.log 2 * (t - 1))
    nlinarith
  · have hc := convexOn_exp.2 (Set.mem_univ 0) (Set.mem_univ (Real.log 2))
      (show (0 : ℝ) ≤ 1 - t by linarith) h0 (by ring)
    simp only [smul_eq_mul, mul_zero, zero_add, Real.exp_zero, mul_one,
      Real.exp_log (show (0 : ℝ) < 2 by norm_num)] at hc
    rw [hdef, mul_comm]
    linarith

/-- Primer 5, točke krivulje: (−1; 0,5), (0, 1), (1, 2), (2, 4), (3, 8); 6 − 2 = 4; 2^(1/2) ≈ 1,41 < 1,5.
trditev: MAT-SS-2/eksponentne-enacbe#primer5-tocke
besedilo: »b) Med presečiščema je krivulja pod premico: pri $x = \frac{1}{2}$ je $2^{\frac{1}{2}} \approx 1{,}41 < 1{,}5$. Levo od $0$ in desno od $1$ je nad njo, na primer $2^{-1} = 0{,}5 > 0$ in $2^3 = 8 > 4$.« -/
theorem primer5_tocke :
    (2 : ℝ) ^ (-1 : ℝ) = 0.5 ∧ (2 : ℝ) ^ (0 : ℝ) = 1 ∧ (2 : ℝ) ^ (1 : ℝ) = 2 ∧ (2 : ℝ) ^ (2 : ℝ) = 4 ∧
    (2 : ℝ) ^ (3 : ℝ) = 8 ∧ (6 : ℝ) - 2 = 4 ∧ (0 : ℝ) + 1 = 1 ∧ (1 : ℝ) + 1 = 2 ∧
    (1.405 < (2 : ℝ) ^ (1 / 2 : ℝ) ∧ (2 : ℝ) ^ (1 / 2 : ℝ) < 1.415) ∧ (1.415 : ℝ) < 1.5 ∧
    (0.5 : ℝ) > 0 ∧ (8 : ℝ) > 3 + 1 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, koren_med (p := 1) (q := 2) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num), by norm_num, by norm_num, by norm_num⟩

/-- Primer 5 a): 2ˣ < 6 − x ⟺ x < 2 (presečišče (2, 4); krivulja narašča, premica pada).
trditev: MAT-SS-2/eksponentne-enacbe#primer5a
besedilo: »a) Krivulja seka premico $y = 6 - x$ v točki $(2, 4)$. Preizkus: $2^2 = 4$ in $6 - 2 = 4$. Krivulja narašča, premica pada, zato drugega presečišča ni.« -/
theorem primer5a (x : ℝ) : (2 : ℝ) ^ x < 6 - x ↔ x < 2 := by
  have h4 : (2 : ℝ) ^ (2 : ℝ) = 4 := by norm_num
  constructor
  · intro h
    by_contra hx
    have hx' := not_lt.mp hx
    have : (2 : ℝ) ^ (2 : ℝ) ≤ (2 : ℝ) ^ x := (narasca 2 (by norm_num)).monotone hx'
    linarith
  · intro hx
    have : (2 : ℝ) ^ x < (2 : ℝ) ^ (2 : ℝ) := narasca 2 (by norm_num) hx
    linarith

/-- Primer 5 b): 2ˣ ≤ x + 1 ⟺ x ∈ [0, 1]; enakost (presečišči) natanko pri x = 0 in x = 1, zato
tretjega presečišča ni.
trditev: MAT-SS-2/eksponentne-enacbe#primer5b
besedilo: »b) Krivulja seka premico $y = x + 1$ v točkah $(0, 1)$ in $(1, 2)$. Preizkus: $2^0 = 1 = 0 + 1$ in $2^1 = 2 = 1 + 1$. Krivulja $y = 2^x$ je vse strmejša in se ukrivlja navzgor, zato jo premica seka največ v dveh točkah: tretjega presečišča ni.« -/
theorem primer5b (x : ℝ) : ((2 : ℝ) ^ x ≤ x + 1 ↔ x ∈ Set.Icc 0 1) ∧
    ((2 : ℝ) ^ x = x + 1 ↔ x = 0 ∨ x = 1) := by
  obtain ⟨hA, hB, hC⟩ := dve_na_t x
  constructor
  · rw [Set.mem_Icc]
    constructor
    · intro h
      constructor
      · by_contra hx; have hx' := not_le.mp hx; linarith [hA hx']
      · by_contra hx; have hx' := not_le.mp hx; linarith [hB hx']
    · rintro ⟨h0, h1⟩; linarith [hC h0 h1]
  · constructor
    · intro h
      rcases lt_trichotomy x 0 with hx | hx | hx
      · linarith [hA hx]
      · exact Or.inl hx
      · rcases lt_trichotomy x 1 with hx1 | hx1 | hx1
        · -- strogo med 0 in 1: konveksnost da 2ˣ < 1 + x
          exfalso
          have hm := (convexOn_exp.2 (Set.mem_univ 0) (Set.mem_univ (Real.log 2))
            (show (0 : ℝ) ≤ 1 - x by linarith) hx.le (by ring))
          have hs := (strictConvexOn_exp.2 (Set.mem_univ 0) (Set.mem_univ (Real.log 2))
            (show (0 : ℝ) ≠ Real.log 2 by
              have := Real.log_two_gt_d9; intro h0; rw [← h0] at this; norm_num at this)
            (show (0 : ℝ) < 1 - x by linarith) hx (by ring))
          simp only [smul_eq_mul, mul_zero, zero_add, Real.exp_zero, mul_one,
            Real.exp_log (show (0 : ℝ) < 2 by norm_num)] at hm hs
          rw [Real.rpow_def_of_pos (by norm_num), mul_comm] at h
          linarith
        · exact Or.inr hx1
        · linarith [hB hx1]
    · rintro (h | h) <;> rw [h] <;> norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1: 2ˣ = 4^(x−1) ⟺ 2ˣ = 2^(2x−2) ⟺ x = 2x − 2 ⟺ x = 2 (preizkus 2² = 4 = 4¹).
trditev: MAT-SS-2/eksponentne-enacbe#napaka1
besedilo: »Pravilno: $4^{x-1} = 2^{2x-2}$, zato je $x = 2x - 2$ in $x = 2$ (preizkus: $2^2 = 4 = 4^1$).« -/
theorem napaka1 (x : ℝ) : (2 : ℝ) ^ x = (4 : ℝ) ^ (x - 1) ↔ x = 2 := by
  have h4 : (4 : ℝ) ^ (x - 1) = (2 : ℝ) ^ (2 * x - 2) := by
    rw [show (4 : ℝ) = 2 ^ (2 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; congr 1; ring
  calc (2 : ℝ) ^ x = (4 : ℝ) ^ (x - 1) ↔ (2 : ℝ) ^ x = (2 : ℝ) ^ (2 * x - 2) := by rw [h4]
    _ ↔ x = 2 * x - 2 := enacenje 2 (by norm_num) (by norm_num) _ _
    _ ↔ x = 2 := by constructor <;> intro h <;> linarith

/-- Pogoste napake 2 in 3: 2^(x+3) = 2³·2ˣ = 8·2ˣ (ne 2ˣ + 2³: pri x = 0 je 8 ≠ 9); 2ˣ + 2ˣ = 2·2ˣ = 2^(x+1)
(ne 4ˣ: pri x = 2 je 8 ≠ 16); 2·3ˣ ni 6ˣ (pri x = 2: 2·9 = 18, 6² = 36).
trditev: MAT-SS-2/eksponentne-enacbe#napaka2
besedilo: »Koeficient vpleten v osnovo.** $2 \cdot 3^x$ ni enako $6^x$, ker se potencira le osnova $3$, faktor $2$ pa ne. Preizkus z $x = 2$: $2 \cdot 9 = 18$, $6^2 = 36$. Koeficient pusti pred potenco in ga po potrebi izpostavi ali z njim deli.« -/
theorem napaka2 (x : ℝ) :
    (2 : ℝ) ^ (x + 3) = (2 : ℝ) ^ (3 : ℝ) * (2 : ℝ) ^ x ∧ (2 : ℝ) ^ (3 : ℝ) * (2 : ℝ) ^ x = 8 * (2 : ℝ) ^ x ∧
    (2 : ℝ) ^ ((0 : ℝ) + 3) ≠ (2 : ℝ) ^ (0 : ℝ) + (2 : ℝ) ^ (3 : ℝ) ∧
    (2 : ℝ) ^ x + (2 : ℝ) ^ x = 2 * (2 : ℝ) ^ x ∧ 2 * (2 : ℝ) ^ x = (2 : ℝ) ^ (x + 1) ∧
    (2 : ℝ) ^ (2 : ℝ) + (2 : ℝ) ^ (2 : ℝ) ≠ (4 : ℝ) ^ (2 : ℝ) ∧
    (2 : ℝ) * (3 : ℝ) ^ (2 : ℝ) = 18 ∧ (6 : ℝ) ^ (2 : ℝ) = 36 := by
  refine ⟨by rw [Real.rpow_add (by norm_num), mul_comm], by norm_num, by norm_num, by ring,
    by rw [Real.rpow_add (by norm_num), Real.rpow_one]; ring, by norm_num, by norm_num, by norm_num⟩

/-- Pogoste napake 5: 1/8 = 2^(−3), ne 2³ ali 2^(1/3) (∛2 = 2^(1/3) ≠ 1/8, ker je 2^(1/3) > 1);
(1/2)ⁿ = 1/8 ⟺ n = 3.
trditev: MAT-SS-2/eksponentne-enacbe#napaka5
besedilo: »Obratna vrednost pomeni negativni eksponent: $\dfrac{1}{8} = 2^{-3}$, koren pa ulomek v eksponentu: $\sqrt[3]{2} = 2^{\frac{1}{3}}$.« -/
theorem napaka5 (n : ℝ) :
    (1 : ℝ) / 8 = (2 : ℝ) ^ (-3 : ℝ) ∧ (1 : ℝ) / 8 ≠ (2 : ℝ) ^ (3 : ℝ) ∧ (1 : ℝ) / 8 ≠ (2 : ℝ) ^ (1 / 3 : ℝ) ∧
    ((1 / 2 : ℝ) ^ n = 1 / 8 ↔ n = 3) := by
  refine ⟨by norm_num [Real.rpow_neg], by norm_num, ?_, ?_⟩
  · have := Real.one_lt_rpow (show (1 : ℝ) < 2 by norm_num) (show (0 : ℝ) < 1 / 3 by norm_num)
    intro h; rw [← h] at this; norm_num at this
  · rw [show (1 / 8 : ℝ) = (1 / 2 : ℝ) ^ (3 : ℝ) by norm_num]
    exact enacenje (1 / 2) (by norm_num) (by norm_num) _ _

/-! ## Za maturo -/

/-- Za maturo, naloga 1: √(27ˣ) = (3^(3x))^(1/2) = 3^(3x/2), 9^(x+1)/3 = 3^(2x+2)/3¹ = 3^(2x+1);
√(27ˣ) = 9^(x+1)/3 ⟺ 3x/2 = 2x + 1 ⟺ 3x = 4x + 2 ⟺ x = −2.
trditev: MAT-SS-2/eksponentne-enacbe#matura1
besedilo: »Izenačimo eksponenta: $\dfrac{3x}{2} = 2x + 1$, torej $3x = 4x + 2$ in $x = -2$.« -/
theorem matura1 (x : ℝ) :
    Real.sqrt ((27 : ℝ) ^ x) = ((3 : ℝ) ^ (3 * x)) ^ (1 / 2 : ℝ) ∧
    ((3 : ℝ) ^ (3 * x)) ^ (1 / 2 : ℝ) = (3 : ℝ) ^ (3 * x / 2) ∧
    (9 : ℝ) ^ (x + 1) / 3 = (3 : ℝ) ^ (2 * x + 2) / (3 : ℝ) ^ (1 : ℝ) ∧
    (3 : ℝ) ^ (2 * x + 2) / (3 : ℝ) ^ (1 : ℝ) = (3 : ℝ) ^ (2 * x + 1) ∧
    (Real.sqrt ((27 : ℝ) ^ x) = (9 : ℝ) ^ (x + 1) / 3 ↔ x = -2) := by
  have hL1 : Real.sqrt ((27 : ℝ) ^ x) = ((3 : ℝ) ^ (3 * x)) ^ (1 / 2 : ℝ) := by
    rw [Real.sqrt_eq_rpow, show (27 : ℝ) = 3 ^ (3 : ℝ) by norm_num,
      ← Real.rpow_mul (show (0 : ℝ) ≤ 3 by norm_num)]
  have hL2 : ((3 : ℝ) ^ (3 * x)) ^ (1 / 2 : ℝ) = (3 : ℝ) ^ (3 * x / 2) := by
    rw [← Real.rpow_mul (by norm_num)]; congr 1; ring
  have hR1 : (9 : ℝ) ^ (x + 1) / 3 = (3 : ℝ) ^ (2 * x + 2) / (3 : ℝ) ^ (1 : ℝ) := by
    rw [show (9 : ℝ) ^ (x + 1) = ((3 : ℝ) ^ (2 : ℝ)) ^ (x + 1) by norm_num, ← Real.rpow_mul (by norm_num),
      Real.rpow_one]
    congr 2; ring
  have hR2 : (3 : ℝ) ^ (2 * x + 2) / (3 : ℝ) ^ (1 : ℝ) = (3 : ℝ) ^ (2 * x + 1) := by
    rw [← Real.rpow_sub (by norm_num)]; congr 1; ring
  refine ⟨hL1, hL2, hR1, hR2, ?_⟩
  calc Real.sqrt ((27 : ℝ) ^ x) = (9 : ℝ) ^ (x + 1) / 3 ↔ (3 : ℝ) ^ (3 * x / 2) = (3 : ℝ) ^ (2 * x + 1) := by
        rw [hL1, hL2, hR1, hR2]
    _ ↔ 3 * x / 2 = 2 * x + 1 := enacenje 3 (by norm_num) (by norm_num) _ _
    _ ↔ 3 * x = 4 * x + 2 := by constructor <;> intro h <;> linarith
    _ ↔ x = -2 := by constructor <;> intro h <;> linarith

/-- Za maturo, naloga 1, preizkus in RAČUN: √(27^(−2)) = √(1/729) = 1/27 in 9^(−1)/3 = 1/27.
trditev: MAT-SS-2/eksponentne-enacbe#matura1-preizkus
besedilo: »Preizkus: $\sqrt{27^{-2}} = \sqrt{\dfrac{1}{729}} = \dfrac{1}{27}$ in $\dfrac{9^{-1}}{3} = \dfrac{1}{27}$.« -/
theorem matura1_preizkus : Real.sqrt ((27 : ℝ) ^ (-2 : ℝ)) = Real.sqrt (1 / 729) ∧
    Real.sqrt (1 / 729) = 1 / 27 ∧ (9 : ℝ) ^ (-1 : ℝ) / 3 = 1 / 27 := by
  refine ⟨by norm_num [Real.rpow_neg], ?_, by norm_num⟩
  rw [show (1 / 729 : ℝ) = (1 / 27) ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Za maturo, naloga 2 a): f(0) = 4⁰ − 6·2⁰ + 8 = 1 − 6 + 8 = 3.
trditev: MAT-SS-2/eksponentne-enacbe#matura2a
besedilo: »$f(0) = 4^0 - 6 \cdot 2^0 + 8 = 1 - 6 + 8 = 3$« -/
theorem matura2a : (4 : ℝ) ^ (0 : ℝ) - 6 * (2 : ℝ) ^ (0 : ℝ) + 8 = 1 - 6 + 8 ∧ (1 : ℝ) - 6 + 8 = 3 := by
  norm_num

/-- Za maturo, naloga 2 b): f(x) = 0 ⟺ t² − 6t + 8 = 0 (t = 2ˣ) ⟺ (t − 2)(t − 4) = 0 ⟺ t = 2 ali t = 4
⟺ x = 1 ali x = 2.
trditev: MAT-SS-2/eksponentne-enacbe#matura2b
besedilo: »b) Ker je $4^x = \left(2^x\right)^2$, vpeljemo $t = 2^x$ s pogojem $t > 0$. Enačba $f(x) = 0$ se glasi $t^2 - 6t + 8 = 0$.« -/
theorem matura2b (x : ℝ) : (4 : ℝ) ^ x - 6 * (2 : ℝ) ^ x + 8 = 0 ↔ x = 1 ∨ x = 2 := by
  calc (4 : ℝ) ^ x - 6 * (2 : ℝ) ^ x + 8 = 0 ↔ ((2 : ℝ) ^ x) ^ 2 - 6 * (2 : ℝ) ^ x + 8 = 0 := by
        rw [stiri]
    _ ↔ ((2 : ℝ) ^ x - 2) * ((2 : ℝ) ^ x - 4) = 0 := by
        rw [show ((2 : ℝ) ^ x - 2) * ((2 : ℝ) ^ x - 4) = ((2 : ℝ) ^ x) ^ 2 - 6 * (2 : ℝ) ^ x + 8 by ring]
    _ ↔ (2 : ℝ) ^ x = 2 ∨ (2 : ℝ) ^ x = 4 := kvadratna _ _ _
    _ ↔ (2 : ℝ) ^ x = (2 : ℝ) ^ (1 : ℝ) ∨ (2 : ℝ) ^ x = (2 : ℝ) ^ (2 : ℝ) := by norm_num
    _ ↔ x = 1 ∨ x = 2 := by
        rw [enacenje 2 (by norm_num) (by norm_num) x 1, enacenje 2 (by norm_num) (by norm_num) x 2]

/-- Za maturo, naloga 2 c): f(x) = 24 ⟺ t² − 6t + 8 = 24 ⟺ t² − 6t − 16 = 0 ⟺ (t − 8)(t + 2) = 0
⟺ t = 8 (t = −2 zavržemo) ⟺ x = 3; preizkus f(3) = 64 − 48 + 8 = 24.
trditev: MAT-SS-2/eksponentne-enacbe#matura2c
besedilo: »c) Iz $2^x = 8 = 2^3$ sledi $x = 3$. Preizkus: $f(3) = 64 - 48 + 8 = 24$.« -/
theorem matura2c (x : ℝ) : ((4 : ℝ) ^ x - 6 * (2 : ℝ) ^ x + 8 = 24 ↔ x = 3) ∧
    (4 : ℝ) ^ (3 : ℝ) - 6 * (2 : ℝ) ^ (3 : ℝ) + 8 = 64 - 48 + 8 ∧ (64 : ℝ) - 48 + 8 = 24 := by
  have ht : 0 < (2 : ℝ) ^ x := Real.rpow_pos_of_pos (by norm_num) x
  refine ⟨?_, by norm_num, by norm_num⟩
  calc (4 : ℝ) ^ x - 6 * (2 : ℝ) ^ x + 8 = 24 ↔ ((2 : ℝ) ^ x) ^ 2 - 6 * (2 : ℝ) ^ x + 8 = 24 := by
        rw [stiri]
    _ ↔ ((2 : ℝ) ^ x) ^ 2 - 6 * (2 : ℝ) ^ x - 16 = 0 := by constructor <;> intro h <;> linarith
    _ ↔ ((2 : ℝ) ^ x - 8) * ((2 : ℝ) ^ x - (-2)) = 0 := by
        rw [show ((2 : ℝ) ^ x - 8) * ((2 : ℝ) ^ x - (-2)) = ((2 : ℝ) ^ x) ^ 2 - 6 * (2 : ℝ) ^ x - 16 by
          ring]
    _ ↔ (2 : ℝ) ^ x = 8 ∨ (2 : ℝ) ^ x = -2 := kvadratna _ _ _
    _ ↔ (2 : ℝ) ^ x = 8 := by
        constructor
        · rintro (h | h)
          · exact h
          · linarith
        · exact Or.inl
    _ ↔ x = 3 := dva_osem x

/-- Za maturo, naloga 3 a), b): A(0) = 200, B(0) = 25; 200·2ˣ = 25·4ˣ ⟺ 8 = 4ˣ/2ˣ = 2ˣ ⟺ x = 3;
A(3) = 200·8 = 1600 = 25·64 = B(3).
trditev: MAT-SS-2/eksponentne-enacbe#matura3ab
besedilo: »b) Iz $2^x = 2^3$ sledi $x = 3$. Takrat je $A(3) = 200 \cdot 8 = 1600$ in $B(3) = 25 \cdot 64 = 1600$.« -/
theorem matura3ab (x : ℝ) :
    200 * (2 : ℝ) ^ (0 : ℝ) = 200 ∧ 25 * (4 : ℝ) ^ (0 : ℝ) = 25 ∧
    (4 : ℝ) ^ x / (2 : ℝ) ^ x = (2 : ℝ) ^ x ∧
    (200 * (2 : ℝ) ^ x = 25 * (4 : ℝ) ^ x ↔ x = 3) ∧
    200 * (2 : ℝ) ^ (3 : ℝ) = 1600 ∧ 25 * (4 : ℝ) ^ (3 : ℝ) = 1600 := by
  have ht : 0 < (2 : ℝ) ^ x := Real.rpow_pos_of_pos (by norm_num) x
  refine ⟨by norm_num, by norm_num, ?_, ?_, by norm_num, by norm_num⟩
  · rw [stiri]; field_simp
  · rw [stiri]
    constructor
    · intro h
      have e : 25 * (2 : ℝ) ^ x * ((2 : ℝ) ^ x - 8) = 25 * ((2 : ℝ) ^ x) ^ 2 - 200 * (2 : ℝ) ^ x := by ring
      have h0 : 25 * (2 : ℝ) ^ x * ((2 : ℝ) ^ x - 8) = 0 := by linarith
      rcases mul_eq_zero.mp h0 with h1 | h1
      · linarith
      · exact (dva_osem x).mp (by linarith)
    · intro h; rw [h]; norm_num

/-- Za maturo, naloga 3 c): 200·2ˣ + 25·4ˣ = 9600 ⟺ t² + 8t − 384 = 0 (deljeno s 25, t = 2ˣ)
⟺ (t − 16)(t + 24) = 0 ⟺ t = 16 (t = −24 zavržemo) ⟺ 2ˣ = 2⁴ ⟺ x = 4.
trditev: MAT-SS-2/eksponentne-enacbe#matura3c
besedilo: »c) Enačba $200 \cdot 2^x + 25 \cdot 4^x = 9600$; delimo s $25$ in vpeljemo $t = 2^x$, $t > 0$: $t^2 + 8t - 384 = 0$.« -/
theorem matura3c (x : ℝ) : 200 * (2 : ℝ) ^ x + 25 * (4 : ℝ) ^ x = 9600 ↔ x = 4 := by
  have ht : 0 < (2 : ℝ) ^ x := Real.rpow_pos_of_pos (by norm_num) x
  calc 200 * (2 : ℝ) ^ x + 25 * (4 : ℝ) ^ x = 9600 ↔ ((2 : ℝ) ^ x) ^ 2 + 8 * (2 : ℝ) ^ x - 384 = 0 := by
        rw [stiri]; constructor <;> intro h <;> linarith
    _ ↔ ((2 : ℝ) ^ x - 16) * ((2 : ℝ) ^ x - (-24)) = 0 := by
        rw [show ((2 : ℝ) ^ x - 16) * ((2 : ℝ) ^ x - (-24)) = ((2 : ℝ) ^ x) ^ 2 + 8 * (2 : ℝ) ^ x - 384 by
          ring]
    _ ↔ (2 : ℝ) ^ x = 16 ∨ (2 : ℝ) ^ x = -24 := kvadratna _ _ _
    _ ↔ (2 : ℝ) ^ x = 16 := by
        constructor
        · rintro (h | h)
          · exact h
          · linarith
        · exact Or.inl
    _ ↔ (2 : ℝ) ^ x = (2 : ℝ) ^ (4 : ℝ) := by norm_num
    _ ↔ x = 4 := enacenje 2 (by norm_num) (by norm_num) _ _

/-- Za maturo, naloga 3 c) in d), RAČUN: D = 64 + 1536 = 1600, t = (−8 ± 40)/2 = 16, −24;
A(4) + B(4) = 3200 + 6400 = 9600; točke A: 200, 400, 800, 1600, 3200; B: 25, 100, 400, 1600, 6400.
trditev: MAT-SS-2/eksponentne-enacbe#matura3-racun
besedilo: »c) Diskriminanta je $D = 64 + 1536 = 1600$, zato je $t_{1,2} = \dfrac{-8 \pm 40}{2}$, torej $t_1 = 16$ in $t_2 = -24$.« -/
theorem matura3_racun :
    (8 : ℝ) ^ 2 - 4 * 1 * (-384) = 64 + 1536 ∧ (64 : ℝ) + 1536 = 1600 ∧ Real.sqrt 1600 = 40 ∧
    ((-8 : ℝ) + 40) / 2 = 16 ∧ ((-8 : ℝ) - 40) / 2 = -24 ∧
    200 * (2 : ℝ) ^ (4 : ℝ) + 25 * (4 : ℝ) ^ (4 : ℝ) = 3200 + 6400 ∧ (3200 : ℝ) + 6400 = 9600 ∧
    (200 * (2 : ℝ) ^ (1 : ℝ) = 400 ∧ 200 * (2 : ℝ) ^ (2 : ℝ) = 800) ∧
    (25 * (4 : ℝ) ^ (1 : ℝ) = 100 ∧ 25 * (4 : ℝ) ^ (2 : ℝ) = 400) := by
  refine ⟨by norm_num, by norm_num, ?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩
  rw [show (1600 : ℝ) = 40 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Za maturo, naloga 3 d): 25·4ˣ > 200·2ˣ ⟺ 2ˣ > 8 = 2³ ⟺ x > 3.
trditev: MAT-SS-2/eksponentne-enacbe#matura3d
besedilo: »neenačbo $25 \cdot 4^x > 200 \cdot 2^x$ delimo s pozitivnim številom $25 \cdot 2^x$ in dobimo $2^x > 8 = 2^3$.« -/
theorem matura3d (x : ℝ) : 200 * (2 : ℝ) ^ x < 25 * (4 : ℝ) ^ x ↔ 3 < x := by
  have ht : 0 < (2 : ℝ) ^ x := Real.rpow_pos_of_pos (by norm_num) x
  calc 200 * (2 : ℝ) ^ x < 25 * (4 : ℝ) ^ x ↔ 8 < (2 : ℝ) ^ x := by
        rw [stiri]
        constructor
        · intro h; nlinarith
        · intro h; nlinarith
    _ ↔ (2 : ℝ) ^ (3 : ℝ) < (2 : ℝ) ^ x := by norm_num
    _ ↔ 3 < x := Real.rpow_lt_rpow_left_iff (by norm_num)

/-! ## Drugače -/

/-- Drugače, korak za korakom: 5^(2x) = (5ˣ)²; 5^(2x) − 30·5ˣ + 125 = 0 ⟺ t² − 30t + 125 = 0
⟺ (t − 25)(t − 5) = 0 ⟺ t = 25 ali t = 5 ⟺ x = 2 ali x = 1.
trditev: MAT-SS-2/eksponentne-enacbe#korak-pet
besedilo: »Vpeljemo $t = 5^x$, $t > 0$. Enačba postane $t^2 - 30t + 125 = 0$.« -/
theorem korak_pet (x : ℝ) : (5 : ℝ) ^ (2 * x) - 30 * (5 : ℝ) ^ x + 125 = 0 ↔ x = 2 ∨ x = 1 := by
  have h5 : (5 : ℝ) ^ (2 * x) = ((5 : ℝ) ^ x) ^ 2 := by
    rw [← Real.rpow_natCast, ← Real.rpow_mul (by norm_num)]; congr 1; push_cast; ring
  calc (5 : ℝ) ^ (2 * x) - 30 * (5 : ℝ) ^ x + 125 = 0 ↔ ((5 : ℝ) ^ x) ^ 2 - 30 * (5 : ℝ) ^ x + 125 = 0 := by
        rw [h5]
    _ ↔ ((5 : ℝ) ^ x - 25) * ((5 : ℝ) ^ x - 5) = 0 := by
        rw [show ((5 : ℝ) ^ x - 25) * ((5 : ℝ) ^ x - 5) = ((5 : ℝ) ^ x) ^ 2 - 30 * (5 : ℝ) ^ x + 125 by ring]
    _ ↔ (5 : ℝ) ^ x = 25 ∨ (5 : ℝ) ^ x = 5 := kvadratna _ _ _
    _ ↔ (5 : ℝ) ^ x = (5 : ℝ) ^ (2 : ℝ) ∨ (5 : ℝ) ^ x = (5 : ℝ) ^ (1 : ℝ) := by norm_num
    _ ↔ x = 2 ∨ x = 1 := by
        rw [enacenje 5 (by norm_num) (by norm_num) x 2, enacenje 5 (by norm_num) (by norm_num) x 1]

/-- Drugače, korak za korakom (račun): D = (−30)² − 4·1·125 = 900 − 500 = 400, √D = 20, t = (30 ± 20)/2
= 25, 5; preizkusa 625 − 750 + 125 = 0 in 25 − 150 + 125 = 0.
trditev: MAT-SS-2/eksponentne-enacbe#korak-pet-racun
besedilo: »Diskriminanta: $D = (-30)^2 - 4 \cdot 1 \cdot 125 = 900 - 500 = 400$, $\sqrt{D} = 20$.« -/
theorem korak_pet_racun :
    (-30 : ℝ) ^ 2 - 4 * 1 * 125 = 900 - 500 ∧ (900 : ℝ) - 500 = 400 ∧ Real.sqrt 400 = 20 ∧
    ((30 : ℝ) + 20) / 2 = 25 ∧ ((30 : ℝ) - 20) / 2 = 5 ∧
    (5 : ℝ) ^ (2 * (2 : ℝ)) - 30 * (5 : ℝ) ^ (2 : ℝ) + 125 = 625 - 750 + 125 ∧ (625 : ℝ) - 750 + 125 = 0 ∧
    (5 : ℝ) ^ (2 * (1 : ℝ)) - 30 * (5 : ℝ) ^ (1 : ℝ) + 125 = 25 - 150 + 125 ∧ (25 : ℝ) - 150 + 125 = 0 := by
  refine ⟨by norm_num, by norm_num, ?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩
  rw [show (400 : ℝ) = 20 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Drugače, bolj natančno (zakaj smemo izenačiti): pri a > 1 in u < v je a^(v−u) > 1 in
a^v = a^u·a^(v−u) > a^u; pri 0 < a < 1 se neenakost obrne.
trditev: MAT-SS-2/eksponentne-enacbe#zakaj-izenaciti
besedilo: »Zakaj smemo izenačiti eksponenta.** Naj bo $a > 1$ in $u < v$.« -/
theorem zakaj_izenaciti (a u v : ℝ) (ha : 0 < a) (h : u < v) :
    a ^ v = a ^ u * a ^ (v - u) ∧ (1 < a → 1 < a ^ (v - u) ∧ a ^ u < a ^ v) ∧
    (a < 1 → a ^ (v - u) < 1 ∧ a ^ v < a ^ u) := by
  have hsplit : a ^ v = a ^ u * a ^ (v - u) := by rw [← Real.rpow_add ha]; congr 1; ring
  have hp : 0 < a ^ u := Real.rpow_pos_of_pos ha u
  have hd : 0 < v - u := by linarith
  refine ⟨hsplit, fun ha1 => ?_, fun ha1 => ?_⟩
  · have h1 : 1 < a ^ (v - u) := Real.one_lt_rpow ha1 hd
    exact ⟨h1, by rw [hsplit]; nlinarith⟩
  · have h1 : a ^ (v - u) < 1 := Real.rpow_lt_one ha.le ha1 hd
    exact ⟨h1, by rw [hsplit]; nlinarith⟩

/-- Predpostavke trditve `zakaj_izenaciti` se dajo izpolniti (a = 2, u = 0, v = 1). -/
example : (0 : ℝ) < 2 ∧ (0 : ℝ) < 1 := by norm_num

/-- Predpostavke trditve `zakaj_izenaciti` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 2 ∧ (0 : ℝ) < 1 := by norm_num
  zakaj_izenaciti (ha := w.1) (h := w.2)

/-- Drugače, bolj natančno: 2ˣ + 2^(−x) = 5/2 ⟺ t + 1/t = 5/2 (t = 2ˣ) ⟺ 2t² − 5t + 2 = 0 (pomnožimo z
2t > 0) ⟺ t = 2 ali t = 1/2 ⟺ x = 1 ali x = −1.
trditev: MAT-SS-2/eksponentne-enacbe#plus-minus
besedilo: »Enačbe z $a^x$ in $a^{-x}$.** Enačbo $2^x + 2^{-x} = \dfrac{5}{2}$ rešimo s $t = 2^x$: $t + \dfrac{1}{t} = \dfrac{5}{2}$. Pomnožimo z $2t$ (smemo, ker je $t > 0$): $2t^2 - 5t + 2 = 0$, torej $t = 2$ ali $t = \dfrac{1}{2}$ in $x = 1$ ali $x = -1$.« -/
theorem plus_minus (x : ℝ) : (2 : ℝ) ^ x + (2 : ℝ) ^ (-x) = 5 / 2 ↔ x = 1 ∨ x = -1 := by
  have ht : 0 < (2 : ℝ) ^ x := Real.rpow_pos_of_pos (by norm_num) x
  have hu : (2 : ℝ) ^ x * (1 / (2 : ℝ) ^ x) = 1 := mul_one_div_cancel ht.ne'
  calc (2 : ℝ) ^ x + (2 : ℝ) ^ (-x) = 5 / 2 ↔ (2 : ℝ) ^ x + 1 / (2 : ℝ) ^ x = 5 / 2 := by
        rw [Real.rpow_neg (by norm_num), inv_eq_one_div]
    _ ↔ 2 * ((2 : ℝ) ^ x) ^ 2 - 5 * (2 : ℝ) ^ x + 2 = 0 := by
        constructor
        · intro h; linear_combination 2 * (2 : ℝ) ^ x * h - 2 * hu
        · intro h; linear_combination (1 / (2 : ℝ) ^ x) / 2 * h - ((2 : ℝ) ^ x - 5 / 2) * hu
    _ ↔ ((2 : ℝ) ^ x - 2) * ((2 : ℝ) ^ x - 1 / 2) = 0 := by
        constructor
        · intro h; linear_combination h / 2
        · intro h; linear_combination 2 * h
    _ ↔ (2 : ℝ) ^ x = 2 ∨ (2 : ℝ) ^ x = 1 / 2 := kvadratna _ _ _
    _ ↔ (2 : ℝ) ^ x = (2 : ℝ) ^ (1 : ℝ) ∨ (2 : ℝ) ^ x = (2 : ℝ) ^ (-1 : ℝ) := by norm_num
    _ ↔ x = 1 ∨ x = -1 := by
        rw [enacenje 2 (by norm_num) (by norm_num) x 1, enacenje 2 (by norm_num) (by norm_num) x (-1)]

/-! ## Preveri se -/

/-- Preveri se 1: 1/25 = 1/5² = 5^(−2), zato 5ˣ = 1/25 ⟺ x = −2; napačni: 5^(1/2) = √5 in
5^(−1/2) = 1/√5 nista 1/25.
trditev: MAT-SS-2/eksponentne-enacbe#kviz1
besedilo: »$\dfrac{1}{25} = \dfrac{1}{5^2} = 5^{-2}$, zato je $x = -2$.« -/
theorem kviz1 (x : ℝ) : ((5 : ℝ) ^ x = 1 / 25 ↔ x = -2) ∧ (5 : ℝ) ^ (1 / 2 : ℝ) ≠ 1 / 25 ∧
    (5 : ℝ) ^ (-1 / 2 : ℝ) ≠ 1 / 25 := by
  refine ⟨?_, ?_, ?_⟩
  · rw [show (1 / 25 : ℝ) = (5 : ℝ) ^ (-2 : ℝ) by norm_num [Real.rpow_neg]]
    exact enacenje 5 (by norm_num) (by norm_num) _ _
  · rw [show (1 / 25 : ℝ) = (5 : ℝ) ^ (-2 : ℝ) by norm_num [Real.rpow_neg]]
    intro h; have := (enacenje 5 (by norm_num) (by norm_num) _ _).mp h; norm_num at this
  · rw [show (1 / 25 : ℝ) = (5 : ℝ) ^ (-2 : ℝ) by norm_num [Real.rpow_neg]]
    intro h; have := (enacenje 5 (by norm_num) (by norm_num) _ _).mp h; norm_num at this

/-- Preveri se 2: 2^(x+2) = 2²·2ˣ = 4·2ˣ, zato 2^(x+2) + 2ˣ = 5·2ˣ in 2^(x+2) + 2ˣ = 40 ⟺ 5·2ˣ = 40
⟺ x = 3 (preizkus 32 + 8 = 40).
trditev: MAT-SS-2/eksponentne-enacbe#kviz2
besedilo: »$2^{x+2} = 4 \cdot 2^x$, zato je $2^x(4 + 1) = 5 \cdot 2^x = 40$. Sledi $2^x = 8 = 2^3$ in $x = 3$; preizkus: $32 + 8 = 40$.« -/
theorem kviz2 (x : ℝ) : (2 : ℝ) ^ (x + 2) + (2 : ℝ) ^ x = 5 * (2 : ℝ) ^ x ∧
    ((2 : ℝ) ^ (x + 2) + (2 : ℝ) ^ x = 40 ↔ x = 3) ∧ (32 : ℝ) + 8 = 40 := by
  have h1 : (2 : ℝ) ^ (x + 2) + (2 : ℝ) ^ x = 5 * (2 : ℝ) ^ x := by
    rw [Real.rpow_add (by norm_num)]; norm_num; ring
  refine ⟨h1, ?_, by norm_num⟩
  rw [h1, ← dva_osem x]
  constructor <;> intro h <;> linarith

/-- Preveri se 3: 4ˣ − 2ˣ − 12 = 0 ⟺ t = 4 ali t = −3 (t = 2ˣ); 2ˣ = −3 nima rešitve, zato x = 2;
negativni x so dovoljeni: 2^(−1) = 1/2.
trditev: MAT-SS-2/eksponentne-enacbe#kviz3
besedilo: »Pri reševanju enačbe $4^x - 2^x - 12 = 0$ z novo spremenljivko $t = 2^x$ dobimo $t = 4$ ali $t = -3$.« -/
theorem kviz3 (x : ℝ) : (4 : ℝ) ^ x - (2 : ℝ) ^ x - 12 = 0 ↔ x = 2 := by
  have ht : 0 < (2 : ℝ) ^ x := Real.rpow_pos_of_pos (by norm_num) x
  calc (4 : ℝ) ^ x - (2 : ℝ) ^ x - 12 = 0 ↔ ((2 : ℝ) ^ x - 4) * ((2 : ℝ) ^ x - (-3)) = 0 := by
        rw [stiri, show ((2 : ℝ) ^ x - 4) * ((2 : ℝ) ^ x - (-3)) = ((2 : ℝ) ^ x) ^ 2 - (2 : ℝ) ^ x - 12 by
          ring]
    _ ↔ (2 : ℝ) ^ x = 4 ∨ (2 : ℝ) ^ x = -3 := kvadratna _ _ _
    _ ↔ (2 : ℝ) ^ x = 4 := by
        constructor
        · rintro (h | h)
          · exact h
          · linarith
        · exact Or.inl
    _ ↔ (2 : ℝ) ^ x = (2 : ℝ) ^ (2 : ℝ) := by norm_num
    _ ↔ x = 2 := enacenje 2 (by norm_num) (by norm_num) _ _

/-- Preveri se 4: Maja: t² − 3t − 4 = (t − 4)(t + 1), t = 4 ali t = −1 (koraka 1 in 2 pravilna);
2ˣ = −1 nima rešitve (korak 3 napačen), x = −1 ni rešitev; edina rešitev je x = 2 (16 − 12 − 4 = 0).
trditev: MAT-SS-2/eksponentne-enacbe#kviz4
besedilo: »Enačba $2^x = -1$ nima rešitve, ker je $2^x > 0$. Vrednost $t = -1$ je treba zavreči, ne pa iz nje izpeljati $x = -1$. Edina rešitev je $x = 2$; preizkus: $16 - 12 - 4 = 0$.« -/
theorem kviz4 (x : ℝ) : ((4 : ℝ) ^ x - 3 * (2 : ℝ) ^ x - 4 = 0 ↔ x = 2) ∧
    (¬ ∃ y : ℝ, (2 : ℝ) ^ y = -1) ∧
    (4 : ℝ) ^ (-1 : ℝ) - 3 * (2 : ℝ) ^ (-1 : ℝ) - 4 ≠ 0 ∧ (16 : ℝ) - 12 - 4 = 0 := by
  have ht : 0 < (2 : ℝ) ^ x := Real.rpow_pos_of_pos (by norm_num) x
  refine ⟨?_, brez_resitve 2 (-1) (by norm_num) (by norm_num), by norm_num, by norm_num⟩
  calc (4 : ℝ) ^ x - 3 * (2 : ℝ) ^ x - 4 = 0 ↔ ((2 : ℝ) ^ x - 4) * ((2 : ℝ) ^ x - (-1)) = 0 := by
        rw [stiri, show ((2 : ℝ) ^ x - 4) * ((2 : ℝ) ^ x - (-1)) = ((2 : ℝ) ^ x) ^ 2 - 3 * (2 : ℝ) ^ x - 4 by
          ring]
    _ ↔ (2 : ℝ) ^ x = 4 ∨ (2 : ℝ) ^ x = -1 := kvadratna _ _ _
    _ ↔ (2 : ℝ) ^ x = 4 := by
        constructor
        · rintro (h | h)
          · exact h
          · linarith
        · exact Or.inl
    _ ↔ (2 : ℝ) ^ x = (2 : ℝ) ^ (2 : ℝ) := by norm_num
    _ ↔ x = 2 := enacenje 2 (by norm_num) (by norm_num) _ _

/-- Preveri se 5: 4·(1/2)ⁿ = 0,5 ⟺ (1/2)ⁿ = 1/8 = (1/2)³ ⟺ n = 3 (razmerje 4 : 0,5 = 8 je število
8 = 2³, ne število odbojev).
trditev: MAT-SS-2/eksponentne-enacbe#kviz5
besedilo: »8 | Število $8$ je razmerje $4 : 0{,}5$, ne število razpolovitev. Iz enačbe $\left(\frac{1}{2}\right)^n = \frac{1}{8}$ sledi $n = 3$, ker je $8 = 2^3$.« -/
theorem kviz5 (n : ℝ) : (4 * (1 / 2 : ℝ) ^ n = 0.5 ↔ n = 3) ∧ (4 : ℝ) / 0.5 = 8 := by
  refine ⟨?_, by norm_num⟩
  calc 4 * (1 / 2 : ℝ) ^ n = 0.5 ↔ (1 / 2 : ℝ) ^ n = 1 / 8 := by
        constructor <;> intro h <;> norm_num at h ⊢ <;> linarith
    _ ↔ n = 3 := (napaka5 n).2.2.2

/-- Preveri se 6: (1/2)ˣ ≤ x + 3 ⟺ x ∈ [−1, ∞) (presečišče (−1, 2): (1/2)^(−1) = 2 = −1 + 3).
trditev: MAT-SS-2/eksponentne-enacbe#kviz6
besedilo: »Preizkus presečišča: $\left(\frac{1}{2}\right)^{-1} = 2$ in $-1 + 3 = 2$. Desno od $x = -1$ je padajoča krivulja pod naraščajočo premico, zato je rešitev $x \in [-1, \infty)$.« -/
theorem kviz6 (x : ℝ) : ((1 / 2 : ℝ) ^ x ≤ x + 3 ↔ x ∈ Set.Ici (-1)) ∧
    (1 / 2 : ℝ) ^ (-1 : ℝ) = 2 ∧ (-1 : ℝ) + 3 = 2 := by
  have h2 : (1 / 2 : ℝ) ^ (-1 : ℝ) = 2 := by norm_num
  refine ⟨?_, h2, by norm_num⟩
  rw [Set.mem_Ici]
  constructor
  · intro h
    by_contra hx
    have hx' := not_le.mp hx
    have : (1 / 2 : ℝ) ^ (-1 : ℝ) < (1 / 2 : ℝ) ^ x := pada (1 / 2) (by norm_num) (by norm_num) hx'
    linarith
  · intro hx
    have : (1 / 2 : ℝ) ^ x ≤ (1 / 2 : ℝ) ^ (-1 : ℝ) := (pada (1 / 2) (by norm_num) (by norm_num)).antitone hx
    linarith

end Evklid.Lekcije.MAT_SS_2.EksponentneEnacbe
