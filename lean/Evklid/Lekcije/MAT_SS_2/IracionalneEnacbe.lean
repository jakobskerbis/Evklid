/-
vir: content/lessons/MAT-SS-2/iracionalne-enacbe.md
sha256: 5cfc28d08a8602042e6decd46b62ff423e3e90fd0932eff27d589f489ccb7fd1
Ni v Leanu: risbe grafov in simulacija; Mostellerjeva formula kot medicinski model (dokazan je le račun z njo);
analogija s presejalnim testom; razvrščanje korakov postopka (Preveri se, 2) in vrstni red korakov postopka v
razdelku 5 (navodilo, ne trditev; dokazana je ekvivalenca, na kateri temelji: √A = B ⇔ A = B² in B ≥ 0);
Preveri se, 1 (katera enačba je »iracionalna« je poimenovanje, ne računska trditev); trditev, da kandidat
»nima smisla« pri negativni površini (razlaga modela; dokazano je, da −1,8 da isto maso, a √(…) ≠ −1,8);
napačno »kvadriranje po členih« (dokazano je pravilno razvitje z dvojnim zmnožkom); točkovanje.
Lean: √x je za x < 0 enak 0 in x^(1/2) za x < 0 ni realni koren. Zato je pri vsaki enačbi definicijsko območje
(»koren obstaja«) zapisano na levi strani ↔ (npr. 0 ≤ x + 6 ∧ √(x + 6) = x ↔ x = 3). Kubični koren je `koren 3`
(za a < 0 je −(−a)^(1/3)); `koren_lih` pokaže, da je to edino realno število b z b³ = a.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.IracionalneEnacbe

open Real

/-! ## Pomožne trditve -/

/-- Realni n-ti koren: za a ≥ 0 je a^(1/n), za a < 0 je −(−a)^(1/n). -/
noncomputable def koren (n : ℕ) (a : ℝ) : ℝ :=
  if 0 ≤ a then a ^ ((n : ℝ)⁻¹) else -((-a) ^ ((n : ℝ)⁻¹))

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem koren_nenegativen {n : ℕ} {a : ℝ} (ha : 0 ≤ a) : 0 ≤ koren n a := by
  simp only [koren, ha, ↓reduceIte]; exact Real.rpow_nonneg ha _

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem koren_pot {n : ℕ} (hn : n ≠ 0) {a : ℝ} (ha : 0 ≤ a) : koren n a ^ n = a := by
  simp only [koren, ha, ↓reduceIte]; exact Real.rpow_inv_natCast_pow ha hn

example : (2:ℕ) ≠ 0 ∧ (0:ℝ) ≤ 4 := by norm_num

/-- Če je b ≥ 0 in bⁿ = a, je ⁿ√a = b.
trditev: MAT-SS-2/iracionalne-enacbe#koren-eq
besedilo: »$\sqrt{A} = B$: pogoja $A \ge 0$ in $B \ge 0$ (na pamet)« -/
theorem koren_eq {n : ℕ} (hn : n ≠ 0) {a b : ℝ} (hb : 0 ≤ b) (h : b ^ n = a) : koren n a = b := by
  subst h; simp only [koren, pow_nonneg hb n, ↓reduceIte]; exact Real.pow_rpow_inv_natCast hb hn

/-- Predpostavke trditve `koren_eq` se dajo izpolniti. -/
example : (2:ℕ) ≠ 0 ∧ (0:ℝ) ≤ 2 ∧ (2:ℝ) ^ 2 = 4 := by norm_num

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem koren_lih_pot {n : ℕ} (hn : Odd n) (a : ℝ) : koren n a ^ n = a := by
  have hn0 : n ≠ 0 := by rintro rfl; exact Nat.not_odd_zero hn
  by_cases ha : 0 ≤ a
  · exact koren_pot hn0 ha
  · have ha' : 0 ≤ -a := le_of_lt (neg_pos.mpr (not_le.mp ha))
    simp only [koren, ha, ↓reduceIte]; rw [hn.neg_pow, Real.rpow_inv_natCast_pow ha' hn0, neg_neg]

example : Odd 3 := ⟨1, rfl⟩

/-- Razlaga 7 (lihi n): ⁿ√a je edino realno število b z bⁿ = a, tudi za negativen a.
trditev: MAT-SS-2/iracionalne-enacbe#koren-lih
besedilo: »pri lihem n pa za vsa realna števila.« -/
theorem koren_lih {n : ℕ} (hn : Odd n) (a b : ℝ) : b ^ n = a ↔ b = koren n a := by
  constructor
  · intro h; exact hn.pow_inj.mp (by rw [h, koren_lih_pot hn])
  · rintro rfl; exact koren_lih_pot hn a

/-- Predpostavka trditve `koren_lih` se da izpolniti (n = 3). -/
example : Odd 3 := ⟨1, rfl⟩

/-- Razlaga 7, Povzetek (tabela) in Ustno vprašanje 3: pri sodem n in a > 0 ima xⁿ = a natanko rešitvi ±ⁿ√a.
trditev: MAT-SS-2/iracionalne-enacbe#enacba-sod-poz
besedilo: »Pri sodem $n$ in $a > 0$ sta rešitvi dve,« -/
theorem enacba_sod_poz {n : ℕ} (hn : Even n) (hn0 : n ≠ 0) {a : ℝ} (ha : 0 < a) (x : ℝ) :
    x ^ n = a ↔ x = koren n a ∨ x = -koren n a := by
  constructor
  · intro h
    have h' : |x| ^ n = a := by rw [hn.pow_abs, h]
    have := koren_eq hn0 (abs_nonneg x) h'
    rcases abs_choice x with hx | hx
    · left; rw [← hx, this]
    · right; rw [this, hx, neg_neg]
  · rintro (rfl | rfl)
    · exact koren_pot hn0 ha.le
    · rw [hn.neg_pow]; exact koren_pot hn0 ha.le

/-- Predpostavke trditve `enacba_sod_poz` se dajo izpolniti. -/
example : Even 4 ∧ (4:ℕ) ≠ 0 ∧ (0:ℝ) < 16 := ⟨⟨2, rfl⟩, by norm_num, by norm_num⟩

/-- Razlaga 7, Povzetek (tabela): pri sodem n in a < 0 realne rešitve ni.
trditev: MAT-SS-2/iracionalne-enacbe#enacba-sod-neg
besedilo: »Pri sodem $n$ in $a < 0$ realne rešitve ni.« -/
theorem enacba_sod_neg {n : ℕ} (hn : Even n) {a : ℝ} (ha : a < 0) : ¬ ∃ x : ℝ, x ^ n = a :=
  fun ⟨x, hx⟩ => by have := hn.pow_nonneg x; linarith

/-- Predpostavke trditve `enacba_sod_neg` se dajo izpolniti. -/
example : Even 2 ∧ (-4:ℝ) < 0 := ⟨even_two, by norm_num⟩

/-- Ustno vprašanje 3: pri a = 0 ima xⁿ = 0 le rešitev x = 0.
trditev: MAT-SS-2/iracionalne-enacbe#enacba-nic
besedilo: »pri $a = 0$ le rešitev $x = 0$,« -/
theorem enacba_nic {n : ℕ} (hn0 : n ≠ 0) (x : ℝ) : x ^ n = 0 ↔ x = 0 := pow_eq_zero_iff hn0

/-- Predpostavke trditve `enacba_nic` se dajo izpolniti. -/
example : (4:ℕ) ≠ 0 := by norm_num

/-- Razlaga 1 in 5, Bolj natančno: za A ≥ 0 je √A = B natanko tedaj, ko A = B² in B ≥ 0.
trditev: MAT-SS-2/iracionalne-enacbe#kor-eq
besedilo: »Enačba $\sqrt{A} = B$ je **ekvivalentna** sistemu »$A = B^2$ in $B \ge 0$«. Pogoj $A \ge 0$ je tedaj že izpolnjen, ker je $A = B^2 \ge 0$. Zato pri preverjanju odloča predvsem predznak druge strani.« -/
theorem kor_eq {A B : ℝ} (hA : 0 ≤ A) : √A = B ↔ A = B ^ 2 ∧ 0 ≤ B := by
  constructor
  · rintro rfl; exact ⟨(Real.sq_sqrt hA).symm, Real.sqrt_nonneg _⟩
  · rintro ⟨h, hB⟩; rw [h]; exact Real.sqrt_sq hB

/-- Predpostavke trditve `kor_eq` se dajo izpolniti. -/
example : (0:ℝ) ≤ 9 := by norm_num

/-- Bolj natančno: enačba √A = B (s pogojem, da koren obstaja) je ekvivalentna sistemu »A = B² in B ≥ 0«;
pogoj A ≥ 0 je tedaj že izpolnjen.
trditev: MAT-SS-2/iracionalne-enacbe#bolj-natancno
besedilo: »Enačba $\sqrt{A} = B$ je **ekvivalentna** sistemu »$A = B^2$ in $B \ge 0$«. Pogoj $A \ge 0$ je tedaj že izpolnjen, ker je $A = B^2 \ge 0$. Zato pri preverjanju odloča predvsem predznak druge strani.« -/
theorem bolj_natancno (A B : ℝ) : (0 ≤ A ∧ √A = B) ↔ (A = B ^ 2 ∧ 0 ≤ B) := by
  constructor
  · rintro ⟨hA, h⟩; exact (kor_eq hA).mp h
  · rintro ⟨h, hB⟩; exact ⟨h ▸ sq_nonneg B, (kor_eq (h ▸ sq_nonneg B)).mpr ⟨h, hB⟩⟩

/-- Pomožno: (x − a)(x − b) = 0 natanko tedaj, ko x = a ali x = b.
pomozno -/
theorem produkt_nic (a b x : ℝ) : (x - a) * (x - b) = 0 ↔ x = a ∨ x = b := by
  rw [mul_eq_zero, sub_eq_zero, sub_eq_zero]

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem sqrt_kv {k : ℝ} (hk : 0 ≤ k) : √(k ^ 2) = k := Real.sqrt_sq hk

example : (0:ℝ) ≤ 3 := by norm_num

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem sqrt9 : √(9:ℝ) = 3 := by rw [show (9:ℝ) = 3 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)
/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem sqrt4 : √(4:ℝ) = 2 := by rw [show (4:ℝ) = 2 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)
/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem sqrt16 : √(16:ℝ) = 4 := by rw [show (16:ℝ) = 4 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)
/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem sqrt1 : √(1:ℝ) = 1 := Real.sqrt_one

/-! ## Zakaj se tega učimo, razlaga 1–4 -/

/-- Zakaj se tega učimo in razlaga 4: −3 = 3 ni res, po kvadriranju pa (−3)² = 3², torej 9 = 9.
trditev: MAT-SS-2/iracionalne-enacbe#uvod
besedilo: »Vzemi napačno trditev $-3 = 3$ in kvadriraj obe strani. Dobiš $(-3)^2 = 3^2$, torej $9 = 9$, kar je res. Kvadriranje je laž spremenilo v resnico. Sliši se kot trik, a prav ta pojav čaka pri vsaki enačbi s korenom.« -/
theorem uvod : (-3:ℝ) ≠ 3 ∧ (-3:ℝ) ^ 2 = 3 ^ 2 ∧ (3:ℝ) ^ 2 = 9 := by norm_num

/-- Razlaga 1: x + 6 = x² uredimo v x² − x − 6 = 0, ki je (x − 3)(x + 2) = 0 (Vieta: (−3) · 2 = −6,
−3 + 2 = −1), rešitvi x = 3 ali x = −2.
trditev: MAT-SS-2/iracionalne-enacbe#razlaga1-kvadratna
besedilo: »Dobimo enačbo brez korena: $x + 6 = x^2$, urejeno $x^2 - x - 6 = 0$.« -/
theorem razlaga1_kvadratna (x : ℝ) : (x + 6 = x ^ 2 ↔ x ^ 2 - x - 6 = 0) ∧ x ^ 2 - x - 6 = (x - 3) * (x + 2) ∧
    (x ^ 2 - x - 6 = 0 ↔ x = 3 ∨ x = -2) ∧ (-3:ℝ) * 2 = -6 ∧ (-3:ℝ) + 2 = -1 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, by ring, ?_, by norm_num, by norm_num⟩
  rw [show x ^ 2 - x - 6 = (x - 3) * (x - (-2)) by ring, produkt_nic]

/-- Razlaga 1–2: √(x + 6) = x ima eno samo rešitev x = 3 (−2 je navidezna).
trditev: MAT-SS-2/iracionalne-enacbe#razlaga1
besedilo: »Število, ki ga dobimo med računanjem, a prvotne enačbe ne reši, je **navidezna rešitev**. Enačba $\sqrt{x + 6} = x$ ima eno samo rešitev, $x = 3$.« -/
theorem razlaga1 (x : ℝ) : (0 ≤ x + 6 ∧ √(x + 6) = x) ↔ x = 3 := by
  constructor
  · rintro ⟨hA, h⟩
    obtain ⟨h1, h2⟩ := (kor_eq hA).mp h
    have : (x - 3) * (x - (-2)) = 0 := by linear_combination -h1
    rcases (produkt_nic _ _ _).mp this with h3 | h3
    · exact h3
    · linarith
  · rintro rfl; refine ⟨by norm_num, ?_⟩; norm_num

/-- Razlaga 2, preizkus: x = 3: √9 = 3 (velja); x = −2: √4 = 2 ≠ −2 (ne velja), čeprav je −2 + 6 ≥ 0
(Premisli: izloči ga pogoj x ≥ 0).
trditev: MAT-SS-2/iracionalne-enacbe#razlaga2-preizkus
besedilo: »Ostane $x = 1$. Preizkus: $\sqrt{4} = 2$ in $1 + 1 = 2$. Kandidat $x = -4$ ne izpolni pogoja $x \ge -1$: leva stran bi bila $\sqrt{9} = 3$, desna $-3$. To je navidezna rešitev.« -/
theorem razlaga2_preizkus : √((3:ℝ) + 6) = √9 ∧ √(9:ℝ) = 3 ∧ √((-2:ℝ) + 6) = √4 ∧ √(4:ℝ) = 2 ∧
    √((-2:ℝ) + 6) ≠ -2 ∧ (0:ℝ) ≤ -2 + 6 ∧ ¬ (0:ℝ) ≤ -2 := by
  refine ⟨by norm_num, sqrt9, by norm_num, sqrt4, ?_, by norm_num, by norm_num⟩
  rw [show (-2:ℝ) + 6 = 4 by norm_num, sqrt4]; norm_num

/-- Razlaga 3: x + 6 = x² ne loči √(x + 6) in −√(x + 6): za A ≥ 0 je A = B² ⇔ √A = B ali −√A = B.
trditev: MAT-SS-2/iracionalne-enacbe#kvadriranje-obe-krivulji
besedilo: »Enačba $x + 6 = x^2$ ne loči med $\sqrt{x + 6}$ in $-\sqrt{x + 6}$,« -/
theorem kvadriranje_obe_krivulji {A B : ℝ} (hA : 0 ≤ A) : A = B ^ 2 ↔ √A = B ∨ -√A = B := by
  constructor
  · intro h
    have : √A ^ 2 = B ^ 2 := by rw [Real.sq_sqrt hA, h]
    rcases sq_eq_sq_iff_eq_or_eq_neg.mp this with h1 | h1
    · left; exact h1
    · right; rw [h1, neg_neg]
  · rintro (h | h) <;> rw [← h] <;> simp [Real.sq_sqrt hA]

/-- Predpostavke trditve `kvadriranje_obe_krivulji` se dajo izpolniti. -/
example : (0:ℝ) ≤ 4 := by norm_num

/-- Razlaga 3: črtkana krivulja y = −√(x + 6) seka premico y = x v (−2, −2): −√(x + 6) = x ⇔ x = −2.
trditev: MAT-SS-2/iracionalne-enacbe#navidezna-krivulja
besedilo: »Kaj vidimo na grafu.** Levo stran enačbe preberemo kot funkcijo $y = \sqrt{x + 6}$, desno kot premico $y = x$.« -/
theorem navidezna_krivulja (x : ℝ) : (0 ≤ x + 6 ∧ -√(x + 6) = x) ↔ x = -2 := by
  constructor
  · rintro ⟨hA, h⟩
    have hs := Real.sqrt_nonneg (x + 6)
    have h1 : x + 6 = x ^ 2 := by
      calc x + 6 = √(x + 6) ^ 2 := (Real.sq_sqrt hA).symm
        _ = (-√(x + 6)) ^ 2 := by ring
        _ = x ^ 2 := by rw [h]
    have : (x - 3) * (x - (-2)) = 0 := by linear_combination -h1
    rcases (produkt_nic _ _ _).mp this with h3 | h3
    · rw [h3] at h; rw [h3] at hs; linarith
    · exact h3
  · rintro rfl; refine ⟨by norm_num, ?_⟩; norm_num

/-- Razlaga 4: iz a = b sledi a² = b²; iz a² = b² le a = b ali a = −b.
trditev: MAT-SS-2/iracionalne-enacbe#kvadriranje
besedilo: »Obratno ne velja: iz $a^2 = b^2$ sledi le, da je $a = b$ *ali* $a = -b$.« -/
theorem kvadriranje (a b : ℝ) : (a = b → a ^ 2 = b ^ 2) ∧ (a ^ 2 = b ^ 2 ↔ a = b ∨ a = -b) :=
  ⟨fun h => by rw [h], sq_eq_sq_iff_eq_or_eq_neg⟩

/-- Razlaga 4: kvadriranje ni ekvivalentno preoblikovanje (obstajata a ≠ b z a² = b²).
trditev: MAT-SS-2/iracionalne-enacbe#kvadriranje-ni-ekvivalentno
besedilo: »Kvadriranje** ni ekvivalentno preoblikovanje: iz $a^2 = b^2$ sledi $a = b$ ali $a = -b$.« -/
theorem kvadriranje_ni_ekvivalentno : ∃ a b : ℝ, a ^ 2 = b ^ 2 ∧ a ≠ b := ⟨-3, 3, by norm_num, by norm_num⟩

/-- Razlaga 6 in formula Primera 2: (p + q)² = p² + 2pq + q².
trditev: MAT-SS-2/iracionalne-enacbe#kvadrat-vsote
besedilo: »$(p + q)^2 = p^2 + 2pq + q^2$« -/
theorem kvadrat_vsote (p q : ℝ) : (p + q) ^ 2 = p ^ 2 + 2 * p * q + q ^ 2 := by ring

/-- Premisli: (√x + 1)² = x + 2√x + 1 (koren ne izgine); po osamitvi √x = 2 pa x = 4.
trditev: MAT-SS-2/iracionalne-enacbe#premisli-osamitev
besedilo: »Ne izgine. Leva stran je vsota: $(\sqrt{x} + 1)^2 = x + 2\sqrt{x} + 1$. Dvojni zmnožek $2\sqrt{x}$ še vedno vsebuje koren. Če pa najprej osamiš $\sqrt{x} = 2$, po kvadriranju takoj dobiš $x = 4$.« -/
theorem premisli_osamitev (x : ℝ) (hx : 0 ≤ x) : (√x + 1) ^ 2 = x + 2 * √x + 1 ∧ (√x + 1 = 3 ↔ x = 4) := by
  refine ⟨by linear_combination Real.sq_sqrt hx, ⟨fun h => ?_, fun h => ?_⟩⟩
  · have h2 : √x = 2 := by linarith
    have := (kor_eq hx).mp h2; linarith [this.1]
  · rw [h, sqrt4]; norm_num

/-- Predpostavke trditve `premisli_osamitev` se dajo izpolniti. -/
example : (0:ℝ) ≤ 4 := by norm_num

/-! ## Razlaga 7: enačbe xⁿ = a -/

/-- Razlaga 7: x³ = 8 da x = ∛8 = 2; x³ = −27 da x = −3.
trditev: MAT-SS-2/iracionalne-enacbe#razlaga7-lih
besedilo: »S korenjenjem.** Pri lihem $n$ ima enačba eno rešitev, $x = \sqrt[n]{a}$, tudi za negativen $a$: enačba $x^3 = 8$ da $x = \sqrt[3]{8} = 2$, enačba $x^3 = -27$ da $x = -3$.« -/
theorem razlaga7_lih (x : ℝ) : (x ^ 3 = 8 ↔ x = 2) ∧ (x ^ 3 = -27 ↔ x = -3) := by
  have h3 : Odd 3 := ⟨1, rfl⟩
  have k8 : koren 3 8 = 2 := koren_eq (by norm_num) (by norm_num) (by norm_num)
  have k27 : koren 3 (-27) = -3 := ((koren_lih h3 (-27) (-3)).mp (by norm_num)).symm
  exact ⟨by rw [koren_lih h3, k8], by rw [koren_lih h3, k27]⟩

/-- Razlaga 7: x⁴ = 16 da x = 2 ali x = −2 (∜16 = 2).
trditev: MAT-SS-2/iracionalne-enacbe#razlaga7-sod
besedilo: »enačba $x^4 = 16$ da $x = 2$ ali $x = -2$.« -/
theorem razlaga7_sod (x : ℝ) : x ^ 4 = 16 ↔ x = 2 ∨ x = -2 := by
  have k : koren 4 16 = 2 := koren_eq (by norm_num) (by norm_num) (by norm_num)
  rw [enacba_sod_poz ⟨2, rfl⟩ (by norm_num) (by norm_num), k]

/-- Razlaga 7: x² = −4 nima realne rešitve.
trditev: MAT-SS-2/iracionalne-enacbe#razlaga7-neg
besedilo: »$x^2 = -4$« -/
theorem razlaga7_neg : ¬ ∃ x : ℝ, x ^ 2 = -4 := enacba_sod_neg even_two (by norm_num)

/-- Razlaga 7: razlika kubov a³ − b³ = (a − b)(a² + ab + b²).
trditev: MAT-SS-2/iracionalne-enacbe#razlika-kubov
besedilo: »Za razliko kubov velja $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$ (preveriš z množenjem).« -/
theorem razlika_kubov (a b : ℝ) : a ^ 3 - b ^ 3 = (a - b) * (a ^ 2 + a * b + b ^ 2) := by ring

/-- Razlaga 7: x³ − 8 = (x − 2)(x² + 2x + 4), x² + 2x + 4 = (x + 1)² + 3 ≥ 3, zato je x = 2 edina rešitev.
trditev: MAT-SS-2/iracionalne-enacbe#razstavljanje-kub
besedilo: »Drugi faktor dopolnimo do popolnega kvadrata: $x^2 + 2x + 4 = (x + 1)^2 + 3 \ge 3$, torej ni nikoli nič in je $x = 2$ edina rešitev.« -/
theorem razstavljanje_kub (x : ℝ) : x ^ 3 - 8 = (x - 2) * (x ^ 2 + 2 * x + 4) ∧ x ^ 2 + 2 * x + 4 = (x + 1) ^ 2 + 3 ∧
    3 ≤ x ^ 2 + 2 * x + 4 ∧ (x ^ 3 - 8 = 0 ↔ x = 2) := by
  have h3 : 3 ≤ x ^ 2 + 2 * x + 4 := by nlinarith [sq_nonneg (x + 1)]
  refine ⟨by ring, by ring, h3, ⟨fun h => ?_, fun h => by rw [h]; norm_num⟩⟩
  have : (x - 2) * (x ^ 2 + 2 * x + 4) = 0 := by linear_combination h
  rcases mul_eq_zero.mp this with h1 | h1
  · linarith
  · linarith

/-- Razlaga 7: x⁴ − 16 = (x² − 4)(x² + 4) = (x − 2)(x + 2)(x² + 4), rešitvi 2 in −2.
trditev: MAT-SS-2/iracionalne-enacbe#razstavljanje-cetrta
besedilo: »Enačba $x^4 - 16 = 0$ postane $(x^2 - 4)(x^2 + 4) = 0$, po še eni razliki kvadratov $(x - 2)(x + 2)(x^2 + 4) = 0$, kar da $x = 2$ in $x = -2$.« -/
theorem razstavljanje_cetrta (x : ℝ) : x ^ 4 - 16 = (x ^ 2 - 4) * (x ^ 2 + 4) ∧
    (x ^ 2 - 4) * (x ^ 2 + 4) = (x - 2) * (x + 2) * (x ^ 2 + 4) ∧ (x ^ 4 - 16 = 0 ↔ x = 2 ∨ x = -2) := by
  refine ⟨by ring, by ring, ?_⟩
  rw [sub_eq_zero, razlaga7_sod]

/-! ## Rešeni primeri -/

/-- Primer 1: x − √(x + 1) = 5. Koraki: √(x + 1) = x − 5; pogoja x + 1 ≥ 0, x − 5 ≥ 0 (skupaj x ≥ 5);
x + 1 = x² − 10x + 25; x² − 11x + 24 = (x − 3)(x − 8) = 0; 3 odpade, preizkus 8 − √9 = 5. Edina rešitev x = 8.
trditev: MAT-SS-2/iracionalne-enacbe#primer1
besedilo: »Uredimo v enačbo $x^2 - 11x + 24 = 0$ in razstavimo: $(x - 3)(x - 8) = 0$, torej $x = 3$ ali $x = 8$.« -/
theorem primer1 (x : ℝ) : (0 ≤ x + 1 ∧ x - √(x + 1) = 5) ↔ x = 8 := by
  constructor
  · rintro ⟨hA, h⟩
    have h1 : √(x + 1) = x - 5 := by linarith
    obtain ⟨h2, h3⟩ := (kor_eq hA).mp h1
    have h4 : x + 1 = x ^ 2 - 10 * x + 25 := by rw [h2]; ring
    have h5 : (x - 3) * (x - 8) = 0 := by linear_combination -h4
    rcases (produkt_nic _ _ _).mp h5 with h6 | h6
    · linarith
    · exact h6
  · rintro rfl; refine ⟨by norm_num, ?_⟩; norm_num

/-- Primer 1, korak 2: pogoja x + 1 ≥ 0 in x − 5 ≥ 0 skupaj dasta x ≥ 5.
trditev: MAT-SS-2/iracionalne-enacbe#primer1-pogoja
besedilo: »Pogoja: $x + 1 \ge 0$ in $x - 5 \ge 0$. Skupaj velja $x \ge 5$.« -/
theorem primer1_pogoja (x : ℝ) : (0 ≤ x + 1 ∧ 0 ≤ x - 5) ↔ 5 ≤ x :=
  ⟨fun h => by linarith [h.2], fun h => ⟨by linarith, by linarith⟩⟩

/-- Primer 2: √(3x + 1) − √(x + 4) = 1. Koraki: pogoj x ≥ −1/3; √(3x + 1) = 1 + √(x + 4);
3x + 1 = 1 + 2√(x + 4) + x + 4; 2x − 4 = 2√(x + 4), x − 2 = √(x + 4), x ≥ 2; x² − 4x + 4 = x + 4, x² − 5x = 0,
x(x − 5) = 0; 0 odpade (√1 − √4 = −1), preizkus za 5: √16 − √9 = 1. Rešitev x = 5.
trditev: MAT-SS-2/iracionalne-enacbe#primer2
besedilo: »Število $0$ ne izpolni pogoja $x \ge 2$. Preizkus za $0$ to potrdi: $\sqrt{1} - \sqrt{4} = -1$, ne $1$. Preizkus za $5$: $\sqrt{16} - \sqrt{9} = 1$, ustreza.« -/
theorem primer2 (x : ℝ) : (0 ≤ 3 * x + 1 ∧ 0 ≤ x + 4 ∧ √(3 * x + 1) - √(x + 4) = 1) ↔ x = 5 := by
  constructor
  · rintro ⟨hA, hB, h⟩
    have hs := Real.sq_sqrt hB
    have hs0 := Real.sqrt_nonneg (x + 4)
    have h1 : √(3 * x + 1) = 1 + √(x + 4) := by linarith
    obtain ⟨h2, _⟩ := (kor_eq hA).mp h1
    have h3 : 3 * x + 1 = 1 + 2 * √(x + 4) + (x + 4) := by rw [h2]; linear_combination hs
    have h4 : x - 2 = √(x + 4) := by linarith
    have h5 : 0 ≤ x - 2 := by linarith
    have h6 : x ^ 2 - 4 * x + 4 = x + 4 := by
      have : (x - 2) ^ 2 = x + 4 := by rw [h4, hs]
      linear_combination this
    have h7 : (x - 0) * (x - 5) = 0 := by linear_combination h6
    rcases (produkt_nic _ _ _).mp h7 with h8 | h8
    · linarith
    · exact h8
  · rintro rfl; refine ⟨by norm_num, by norm_num, ?_⟩; norm_num

/-- Primer 2, korak 1: pogoja 3x + 1 ≥ 0 in x + 4 ≥ 0 dasta x ≥ −1/3; korak 6: kandidat 0 ne ustreza:
√1 − √4 = −1 ≠ 1.
trditev: MAT-SS-2/iracionalne-enacbe#primer2-pogoj-in-preizkus
besedilo: »Oba korena morata obstajati: $3x + 1 \ge 0$ in $x + 4 \ge 0$, torej $x \ge -\dfrac{1}{3}$.« -/
theorem primer2_pogoj_in_preizkus (x : ℝ) : ((0 ≤ 3 * x + 1 ∧ 0 ≤ x + 4) ↔ -1 / 3 ≤ x) ∧
    √(3 * 0 + 1 : ℝ) - √(0 + 4) = -1 := by
  refine ⟨⟨fun h => by linarith [h.1], fun h => ⟨by linarith, by linarith⟩⟩, ?_⟩
  norm_num

/-- Primer 3 (splošno): pri h > 0, S > 0 je √(h · m/3600) = S ⇔ m = 3600 S²/h.
trditev: MAT-SS-2/iracionalne-enacbe#mosteller
besedilo: »$S = \sqrt{\dfrac{h \cdot m}{3600}}$, po kvadriranju $m = \dfrac{3600\,S^2}{h}$« -/
theorem mosteller {h S : ℝ} (hh : 0 < h) (hS : 0 < S) (m : ℝ) :
    √(h * m / 3600) = S ↔ m = 3600 * S ^ 2 / h := by
  constructor
  · intro e
    have hA : 0 ≤ h * m / 3600 := by
      by_contra hc
      rw [Real.sqrt_eq_zero_of_nonpos (le_of_lt (not_le.mp hc))] at e
      linarith
    obtain ⟨e1, _⟩ := (kor_eq hA).mp e
    field_simp; linarith
  · intro e; rw [e]; field_simp; exact Real.sqrt_sq hS.le

/-- Predpostavke trditve `mosteller` se dajo izpolniti. -/
example : (0:ℝ) < 180 ∧ (0:ℝ) < 1.8 := by norm_num

/-- Primer 3 a): √(180 m/3600) = 1,8 ⇔ m = 64,8; koraki 180 m/3600 = 1,8², m/20 = 3,24, m = 20 · 3,24 = 64,8;
preizkus 180 · 64,8/3600 = 3,24 in √3,24 = 1,8.
trditev: MAT-SS-2/iracionalne-enacbe#primer3a
besedilo: »Zato je $m_1 = 20 \cdot 3{,}24 = 64{,}8\,\mathrm{kg}$. Preizkus: $\dfrac{180 \cdot 64{,}8}{3600} = 3{,}24$ in $\sqrt{3{,}24} = 1{,}8$, ustreza.« -/
theorem primer3a (m : ℝ) : (√(180 * m / 3600) = 1.8 ↔ m = 64.8) ∧ (180 * m / 3600 = 1.8 ^ 2 ↔ m / 20 = 3.24) ∧
    (20:ℝ) * 3.24 = 64.8 ∧ (180:ℝ) * 64.8 / 3600 = 3.24 ∧ √(3.24:ℝ) = 1.8 := by
  refine ⟨?_, ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, by norm_num, ?_⟩
  · rw [mosteller (by norm_num) (by norm_num)]; constructor <;> intro h <;> rw [h] <;> norm_num
  · rw [show (3.24:ℝ) = 1.8 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)

/-- Primer 3 b): S₂ = 1,1 · 1,8 = 1,98; m₂ = 20 · 1,98² = 78,408 ≈ 78,4; m₂/m₁ = (S₂/S₁)² = 1,1² = 1,21, torej
masa je večja za 21 %; kvadrat −1,8 da isto maso, √(…) pa ni −1,8.
trditev: MAT-SS-2/iracionalne-enacbe#primer3b
besedilo: »Druga površina: $S_2 = 1{,}1 \cdot 1{,}8 = 1{,}98\,\mathrm{m^2}$. Enako kot prej je $m_2 = 20 \cdot 1{,}98^2 = 78{,}408\,\mathrm{kg}$, kar je približno $78{,}4\,\mathrm{kg}$.« -/
theorem primer3b (m : ℝ) : (1.1:ℝ) * 1.8 = 1.98 ∧ (√(180 * m / 3600) = 1.98 ↔ m = 78.408) ∧
    (20:ℝ) * 1.98 ^ 2 = 78.408 ∧ (78.408:ℝ) / 64.8 = (1.98 / 1.8) ^ 2 ∧ ((1.98:ℝ) / 1.8) ^ 2 = 1.1 ^ 2 ∧
    (1.1:ℝ) ^ 2 = 1.21 ∧ (20:ℝ) * (-1.8) ^ 2 = 64.8 ∧ √(180 * 64.8 / 3600 : ℝ) ≠ -1.8 := by
  refine ⟨by norm_num, ?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  · rw [mosteller (by norm_num) (by norm_num)]; constructor <;> intro h <;> rw [h] <;> norm_num
  · have := Real.sqrt_nonneg (180 * 64.8 / 3600 : ℝ); intro h; linarith

/-- Primer 4: √(5 − x) = x + 1; pogoja −1 ≤ x ≤ 5; 5 − x = x² + 2x + 1, x² + 3x − 4 = (x + 4)(x − 1) = 0;
ostane x = 1 (√4 = 2 = 1 + 1), −4 je navidezna (√9 = 3, desno −3).
trditev: MAT-SS-2/iracionalne-enacbe#primer4
besedilo: »Ostane $x = 1$. Preizkus: $\sqrt{4} = 2$ in $1 + 1 = 2$. Kandidat $x = -4$ ne izpolni pogoja $x \ge -1$: leva stran bi bila $\sqrt{9} = 3$, desna $-3$. To je navidezna rešitev.« -/
theorem primer4 (x : ℝ) : (0 ≤ 5 - x ∧ √(5 - x) = x + 1) ↔ x = 1 := by
  constructor
  · rintro ⟨hA, h⟩
    obtain ⟨h1, h2⟩ := (kor_eq hA).mp h
    have : (x - (-4)) * (x - 1) = 0 := by linear_combination -h1
    rcases (produkt_nic _ _ _).mp this with h3 | h3
    · linarith
    · exact h3
  · rintro rfl; refine ⟨by norm_num, ?_⟩; norm_num

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem primer4_koraki (x : ℝ) : ((0 ≤ 5 - x ∧ 0 ≤ x + 1) ↔ (-1 ≤ x ∧ x ≤ 5)) ∧
    x ^ 2 + 3 * x - 4 = (x + 4) * (x - 1) ∧ √(5 - (-4) : ℝ) = 3 ∧ √(5 - (-4) : ℝ) ≠ -4 + 1 := by
  have h9 : √(5 - (-4) : ℝ) = 3 := by norm_num
  refine ⟨⟨fun h => ⟨by linarith [h.2], by linarith [h.1]⟩, fun h => ⟨by linarith [h.2], by linarith [h.1]⟩⟩,
    by ring, h9, by rw [h9]; norm_num⟩

/-! ## Pogoste napake -/

/-- Pogoste napake: (√(x + 1) + 2)² = x + 1 + 4√(x + 1) + 4 (ne x + 1 + 4) in
(1 + √(x + 4))² = 1 + 2√(x + 4) + x + 4.
trditev: MAT-SS-2/iracionalne-enacbe#dvojni-zmnozek
besedilo: »Kvadriranje po členih.** Iz $\sqrt{x + 1} + 2 = x$ učenec napiše $x + 1 + 4 = x^2$ (napačno).« -/
theorem dvojni_zmnozek (x : ℝ) (h1 : 0 ≤ x + 1) (h4 : 0 ≤ x + 4) :
    (√(x + 1) + 2) ^ 2 = x + 1 + 4 * √(x + 1) + 4 ∧ (1 + √(x + 4)) ^ 2 = 1 + 2 * √(x + 4) + (x + 4) :=
  ⟨by linear_combination Real.sq_sqrt h1, by linear_combination Real.sq_sqrt h4⟩

/-- Predpostavke trditve `dvojni_zmnozek` se dajo izpolniti. -/
example : (0:ℝ) ≤ 0 + 1 ∧ (0:ℝ) ≤ 0 + 4 := by norm_num

/-- Pogoste napake: pri √(x + 1) + 2 = x je pravilni prvi korak osamitev √(x + 1) = x − 2.
trditev: MAT-SS-2/iracionalne-enacbe#osamitev
besedilo: »Najprej osami koren, $\sqrt{x + 1} = x - 2$, šele nato kvadriraj.« -/
theorem osamitev (x : ℝ) : √(x + 1) + 2 = x ↔ √(x + 1) = x - 2 := ⟨fun h => by linarith, fun h => by linarith⟩

/-! ## Za maturo -/

/-- Naloga 1: (x − 1)⁴ = 625 ⇔ x − 1 = ±∜625 = ±5 ⇔ x = 6 ali x = −4.
trditev: MAT-SS-2/iracionalne-enacbe#matura1
besedilo: »Točkovanje:** 1 točka za $x - 1 = 5$ ali $x - 1 = -5$ (oba predznaka), 1 točka za $x = 6$ in $x = -4$, 1 točka za razstavljanje z utemeljitvijo, da faktor $(x - 1)^2 + 25$ ni nikoli nič.« -/
theorem matura1 (x : ℝ) : koren 4 625 = 5 ∧ ((x - 1) ^ 4 = 625 ↔ x - 1 = 5 ∨ x - 1 = -5) ∧
    ((x - 1) ^ 4 = 625 ↔ x = 6 ∨ x = -4) := by
  have k : koren 4 625 = 5 := koren_eq (by norm_num) (by norm_num) (by norm_num)
  have e : (x - 1) ^ 4 = 625 ↔ x - 1 = 5 ∨ x - 1 = -5 := by
    rw [enacba_sod_poz ⟨2, rfl⟩ (by norm_num) (by norm_num), k]
  refine ⟨k, e, ?_⟩
  rw [e]; constructor <;> rintro (h | h)
  · left; linarith
  · right; linarith
  · left; linarith
  · right; linarith

/-- Naloga 1, razstavljanje: u² − 625 = (u − 25)(u + 25), (x − 1)² − 25 = (x − 6)(x + 4),
(x − 1)⁴ − 625 = (x − 6)(x + 4)((x − 1)² + 25), (x − 1)² + 25 ≥ 25 ni nikoli nič.
trditev: MAT-SS-2/iracionalne-enacbe#matura1-razstavljanje
besedilo: »Z oznako $u = (x - 1)^2$ je $u^2 - 625 = (u - 25)(u + 25)$, prvi faktor pa je spet razlika kvadratov: $(x - 1)^2 - 25 = (x - 6)(x + 4)$.« -/
theorem matura1_razstavljanje (x u : ℝ) : u ^ 2 - 625 = (u - 25) * (u + 25) ∧ (x - 1) ^ 2 - 25 = (x - 6) * (x + 4) ∧
    (x - 1) ^ 4 - 625 = (x - 6) * (x + 4) * ((x - 1) ^ 2 + 25) ∧ 25 ≤ (x - 1) ^ 2 + 25 ∧
    ((x - 1) ^ 2 - 25) * ((x - 1) ^ 2 + 25) = (x - 1) ^ 4 - 625 :=
  ⟨by ring, by ring, by ring, by nlinarith [sq_nonneg (x - 1)], by ring⟩

/-- Naloga 2 a): kubiranje je ekvivalentno (a³ = b³ ⇔ a = b); ∛(x² − 9) = −2 ⇔ x² − 9 = (−2)³ = −8 ⇔ x² = 1 ⇔
x = ±1; preizkus ∛(−8) = −2.
trditev: MAT-SS-2/iracionalne-enacbe#matura2a
besedilo: »a) Kubični koren obstaja za vsako realno število, kubiranje pa je ekvivalentno preoblikovanje, ker iz $a^3 = b^3$ sledi $a = b$. Kubiramo: $x^2 - 9 = (-2)^3 = -8$.« -/
theorem matura2a (x : ℝ) : (∀ a b : ℝ, a ^ 3 = b ^ 3 ↔ a = b) ∧
    (koren 3 (x ^ 2 - 9) = -2 ↔ x ^ 2 - 9 = (-2) ^ 3) ∧ ((-2:ℝ) ^ 3 = -8) ∧
    (koren 3 (x ^ 2 - 9) = -2 ↔ x = 1 ∨ x = -1) ∧ koren 3 (-8) = -2 := by
  have h3 : Odd 3 := ⟨1, rfl⟩
  have e : koren 3 (x ^ 2 - 9) = -2 ↔ x ^ 2 - 9 = (-2) ^ 3 := by
    rw [eq_comm, ← koren_lih h3, eq_comm]
  refine ⟨fun a b => h3.pow_inj, e, by norm_num, ?_, ((koren_lih h3 _ _).mp (by norm_num)).symm⟩
  rw [e]
  constructor
  · intro h
    have : (x - 1) * (x - (-1)) = 0 := by linear_combination h
    exact (produkt_nic _ _ _).mp this
  · rintro (rfl | rfl) <;> norm_num

/-- Naloga 2 b): √(x² − 9) = −2 nima rešitve (koren je nenegativen); kvadriranje bi dalo x² − 9 = 4,
x = ±√13, ki ju preizkus izloči (√(13 − 9) = 2 ≠ −2).
trditev: MAT-SS-2/iracionalne-enacbe#matura2b
besedilo: »b) Kvadratni koren je vedno nenegativen, zato ne more biti enak $-2$. Enačba nima rešitve. (Kvadriranje bi dalo kandidata $x = \pm\sqrt{13}$, ki ju preizkus izloči.)« -/
theorem matura2b (x : ℝ) : ¬ (√(x ^ 2 - 9) = -2) ∧ (x ^ 2 - 9 = 4 ↔ x = √13 ∨ x = -√13) ∧
    √(√13 ^ 2 - 9 : ℝ) = 2 := by
  have h13 : √(13:ℝ) ^ 2 = 13 := Real.sq_sqrt (by norm_num)
  refine ⟨fun h => by linarith [Real.sqrt_nonneg (x ^ 2 - 9)], ?_, ?_⟩
  · rw [← sq_eq_sq_iff_eq_or_eq_neg, h13]; constructor <;> intro h <;> linarith
  · rw [h13]; norm_num

/-- Naloga 2 c): pogoja x² − 9 ≥ 0 in x − 1 ≥ 0 dasta x ≥ 3; √(x² − 9) = x − 1 ⇔ x = 5
(x² − 9 = x² − 2x + 1, 2x = 10; preizkus √16 = 4 = 5 − 1).
trditev: MAT-SS-2/iracionalne-enacbe#matura2c
besedilo: »c) Kvadriramo: $x^2 - 9 = x^2 - 2x + 1$, torej $2x = 10$ in $x = 5$. Število $5$ izpolni pogoj; preizkus: $\sqrt{25 - 9} = \sqrt{16} = 4 = 5 - 1$.« -/
theorem matura2c (x : ℝ) : ((0 ≤ x ^ 2 - 9 ∧ 0 ≤ x - 1) ↔ 3 ≤ x) ∧
    ((0 ≤ x ^ 2 - 9 ∧ √(x ^ 2 - 9) = x - 1) ↔ x = 5) := by
  refine ⟨⟨fun ⟨h1, h2⟩ => by nlinarith, fun h => ⟨by nlinarith, by linarith⟩⟩, ⟨?_, ?_⟩⟩
  · rintro ⟨hA, h⟩
    obtain ⟨h1, _⟩ := (kor_eq hA).mp h
    have : 2 * x = 10 := by linear_combination h1
    linarith
  · rintro rfl; refine ⟨by norm_num, ?_⟩; norm_num

/-- Naloga 3 a): D_f = [−5, ∞), D_g = [2, ∞), presek [2, ∞).
trditev: MAT-SS-2/iracionalne-enacbe#matura3a
besedilo: »a) Korenjenca morata biti nenegativna: $x + 5 \ge 0$ da $D_f = [-5, \infty)$, $x - 2 \ge 0$ da $D_g = [2, \infty)$.« -/
theorem matura3a : {x : ℝ | 0 ≤ x + 5} = Set.Ici (-5) ∧ {x : ℝ | 0 ≤ x - 2} = Set.Ici 2 ∧
    Set.Ici (-5 : ℝ) ∩ Set.Ici 2 = Set.Ici 2 := by
  refine ⟨?_, ?_, ?_⟩
  · ext x; simp only [Set.mem_ofPred_eq, Set.mem_Ici]; constructor <;> intro h <;> linarith
  · ext x; simp only [Set.mem_ofPred_eq, Set.mem_Ici]; constructor <;> intro h <;> linarith
  · exact Set.inter_eq_right.mpr (Set.Ici_subset_Ici.mpr (by norm_num))

/-- Naloga 3 b): za x ≥ 2 je √(x + 5) = 1 + √(x − 2) ⇔ x = 11 (x + 5 = 1 + 2√(x − 2) + x − 2, 6 = 2√(x − 2),
√(x − 2) = 3, x − 2 = 9); f(11) = √16 = 4, g(11) = 1 + √9 = 4, presečišče P(11, 4).
trditev: MAT-SS-2/iracionalne-enacbe#matura3b
besedilo: »b) $f(11) = \sqrt{16} = 4$ in $g(11) = 1 + \sqrt{9} = 4$; preizkus se ujema. Presečišče je $P(11, 4)$.« -/
theorem matura3b (x : ℝ) : ((2 ≤ x ∧ √(x + 5) = 1 + √(x - 2)) ↔ x = 11) ∧ √((11:ℝ) + 5) = 4 ∧
    1 + √((11:ℝ) - 2) = 4 := by
  refine ⟨⟨?_, ?_⟩, by norm_num, by norm_num⟩
  · rintro ⟨hx, h⟩
    have hB : 0 ≤ x - 2 := by linarith
    have hs := Real.sq_sqrt hB
    obtain ⟨h1, _⟩ := (kor_eq (show 0 ≤ x + 5 by linarith)).mp h
    have h2 : x + 5 = 1 + 2 * √(x - 2) + (x - 2) := by rw [h1]; linear_combination hs
    have h3 : √(x - 2) = 3 := by linarith
    have h4 := ((kor_eq hB).mp h3).1
    linarith
  · rintro rfl; refine ⟨by norm_num, ?_⟩; norm_num

/-- Naloga 3 c): pogoj x ≥ 1; x + 5 = x² − 2x + 1, x² − 3x − 4 = (x − 4)(x + 1) = 0; √(x + 5) = x − 1 ⇔ x = 4
(√9 = 3 = 4 − 1, presečišče (4, 3)); kandidat −1 je presečišče premice s krivuljo y = −√(x + 5) (−√4 = −2).
trditev: MAT-SS-2/iracionalne-enacbe#matura3c
besedilo: »c) Kandidat $-1$ ne izpolni pogoja $x \ge 1$: pri njem je $\sqrt{4} = 2$, desna stran pa $-2$. To je presečišče premice s krivuljo $y = -\sqrt{x + 5}$, zato je navidezna rešitev. Za $x = 4$ je $\sqrt{9} = 3 = 4 - 1$.« -/
theorem matura3c (x : ℝ) : ((0 ≤ x + 5 ∧ √(x + 5) = x - 1) ↔ x = 4) ∧ x ^ 2 - 3 * x - 4 = (x - 4) * (x + 1) ∧
    -√((-1:ℝ) + 5) = -1 - 1 ∧ √((4:ℝ) + 5) = 4 - 1 := by
  refine ⟨⟨?_, ?_⟩, by ring, by norm_num, by norm_num⟩
  · rintro ⟨hA, h⟩
    obtain ⟨h1, h2⟩ := (kor_eq hA).mp h
    have : (x - 4) * (x - (-1)) = 0 := by linear_combination -h1
    rcases (produkt_nic _ _ _).mp this with h3 | h3
    · exact h3
    · linarith
  · rintro rfl; refine ⟨by norm_num, ?_⟩; norm_num

/-- Ustno vprašanje 1: enačba A = B², dobljena iz √A = B, reši tudi −√A = B (glej `kvadriranje_obe_krivulji`);
navidezne rešitve izloči pogoj B ≥ 0 (glej `kor_eq`).
trditev: MAT-SS-2/iracionalne-enacbe#ustno1
besedilo: »Navidezne rešitve izločimo s pogojem $B \ge 0$ ali s preizkusom v prvotni enačbi.« -/
theorem ustno1 {A B : ℝ} (hA : 0 ≤ A) : (√A = B → A = B ^ 2) ∧ (-√A = B → A = B ^ 2) ∧ (√A = B ↔ A = B ^ 2 ∧ 0 ≤ B) := by
  refine ⟨fun h => ((kor_eq hA).mp h).1, fun h => ?_, kor_eq hA⟩
  rw [← h, neg_sq, Real.sq_sqrt hA]

/-- Predpostavke trditve `ustno1` se dajo izpolniti. -/
example : (0:ℝ) ≤ 1 := by norm_num

/-- Ustno vprašanje 2: √(2x + 1) = −x − 1 nima rešitve; kvadriranje da 2x + 1 = x² + 2x + 1, x² = 0, kandidat 0,
ki ga preizkus izloči (√1 = 1 ≠ −1); pogoj korena 2x + 1 ≥ 0 je x ≥ −1/2, pogoj desne strani −x − 1 ≥ 0 je
x ≤ −1, in pogoja se izključujeta.
trditev: MAT-SS-2/iracionalne-enacbe#ustno2
besedilo: »Že pogoja $2x + 1 \ge 0$ in $-x - 1 \ge 0$ zahtevata $x \ge -\frac{1}{2}$ in $x \le -1$, kar se izključuje, zato enačba nima rešitve.« -/
theorem ustno2 : (¬ ∃ x : ℝ, 0 ≤ 2 * x + 1 ∧ √(2 * x + 1) = -x - 1) ∧
    (∀ x : ℝ, 2 * x + 1 = (-x - 1) ^ 2 ↔ x = 0) ∧ √(2 * 0 + 1 : ℝ) ≠ -0 - 1 ∧
    (∀ x : ℝ, 0 ≤ 2 * x + 1 ↔ -1 / 2 ≤ x) ∧ (∀ x : ℝ, 0 ≤ -x - 1 ↔ x ≤ -1) ∧
    ¬ ∃ x : ℝ, 0 ≤ 2 * x + 1 ∧ 0 ≤ -x - 1 := by
  refine ⟨?_, fun x => ⟨fun h => ?_, fun h => by rw [h]; norm_num⟩, by norm_num,
    fun x => ⟨fun h => by linarith, fun h => by linarith⟩, fun x => ⟨fun h => by linarith, fun h => by linarith⟩, ?_⟩
  · rintro ⟨x, hA, h⟩
    have := ((kor_eq hA).mp h).2; linarith
  · have : x ^ 2 = 0 := by linear_combination -h
    exact pow_eq_zero_iff (n := 2) (by norm_num) |>.mp this
  · rintro ⟨x, h1, h2⟩; linarith

/-- Ustno vprašanje 3: x⁴ − 81 = (x² − 9)(x² + 9) = (x − 3)(x + 3)(x² + 9), x² + 9 ni nikoli nič; x⁴ = 81 ⇔
x = ±∜81 = ±3.
trditev: MAT-SS-2/iracionalne-enacbe#ustno3
besedilo: »$x^4 - 81 = (x^2 - 9)(x^2 + 9) = (x - 3)(x + 3)(x^2 + 9)$« -/
theorem ustno3 (x : ℝ) : x ^ 4 - 81 = (x ^ 2 - 9) * (x ^ 2 + 9) ∧ (x ^ 2 - 9) * (x ^ 2 + 9) = (x - 3) * (x + 3) * (x ^ 2 + 9) ∧
    x ^ 2 + 9 ≠ 0 ∧ koren 4 81 = 3 ∧ (x ^ 4 = 81 ↔ x = 3 ∨ x = -3) := by
  have k : koren 4 81 = 3 := koren_eq (by norm_num) (by norm_num) (by norm_num)
  refine ⟨by ring, by ring, by positivity, k, ?_⟩
  rw [enacba_sod_poz ⟨2, rfl⟩ (by norm_num) (by norm_num), k]

/-! ## Drugače: Bolj natančno -/

/-- Bolj natančno: x³ je naraščajoča, zato iz a³ = b³ sledi a = b; ∛(x − 1) = −2 ⇔ x − 1 = −8 ⇔ x = −7;
preizkus ∛(−8) = −2.
trditev: MAT-SS-2/iracionalne-enacbe#bolj-natancno-kub
besedilo: »Primer: enačba $\sqrt[3]{x - 1} = -2$ po kubiranju da $x - 1 = -8$, torej $x = -7$.« -/
theorem bolj_natancno_kub (x : ℝ) : StrictMono (fun a : ℝ => a ^ 3) ∧ (koren 3 (x - 1) = -2 ↔ x = -7) ∧
    koren 3 (-8) = -2 := by
  have h3 : Odd 3 := ⟨1, rfl⟩
  refine ⟨h3.strictMono_pow, ?_, ((koren_lih h3 _ _).mp (by norm_num)).symm⟩
  rw [eq_comm, ← koren_lih h3]; constructor <;> intro h <;> linarith

/-- Bolj natančno: (x + 6)^(1/2) = x ima (za x + 6 ≥ 0) isto rešitev x = 3.
trditev: MAT-SS-2/iracionalne-enacbe#bolj-natancno-potenca
besedilo: »enačba $(x + 6)^{\frac{1}{2}} = x$ je enaka enačbi iz razlage in ima isto rešitev $x = 3$.« -/
theorem bolj_natancno_potenca (x : ℝ) : (0 ≤ x + 6 ∧ (x + 6) ^ ((1:ℝ) / 2) = x) ↔ x = 3 := by
  rw [← Real.sqrt_eq_rpow]; exact razlaga1 x

/-! ## Preveri se -/

/-- Preveri se, 3: √(x + 2) = x; kvadriranje da x + 2 = x² s kandidatoma 2 in −1; −1 je presečišče s črtkano
krivuljo (−√1 = −1) in ni rešitev (√1 = 1 ≠ −1); kvadriranje ne izgubi rešitve 2 (2 = 2 ⇒ 4 = 4).
trditev: MAT-SS-2/iracionalne-enacbe#preveri3
besedilo: »Po kvadriranju dobiš enačbo $x + 2 = x^2$ s kandidatoma $2$ in $-1$. Na sliki je $-1$ presečišče s črtkano krivuljo, zato ga preizkus izloči.« -/
theorem preveri3 (x : ℝ) : (x + 2 = x ^ 2 ↔ x = 2 ∨ x = -1) ∧ ((0 ≤ x + 2 ∧ √(x + 2) = x) ↔ x = 2) ∧
    -√((-1:ℝ) + 2) = -1 ∧ √((-1:ℝ) + 2) ≠ -1 := by
  refine ⟨?_, ⟨?_, ?_⟩, by norm_num, by norm_num⟩
  · rw [← produkt_nic]; constructor <;> intro h <;> linear_combination -h
  · rintro ⟨hA, h⟩
    obtain ⟨h1, h2⟩ := (kor_eq hA).mp h
    have : (x - 2) * (x - (-1)) = 0 := by linear_combination -h1
    rcases (produkt_nic _ _ _).mp this with h3 | h3
    · exact h3
    · linarith
  · rintro rfl; refine ⟨by norm_num, ?_⟩; norm_num

/-- Preveri se, 4: √(2x + 7) = x + 2 ⇔ x = 1 (x² + 2x − 3 = (x + 3)(x − 1); −3 je navidezna: desno −1,
√1 = 1; preizkus √9 = 3 = 1 + 2).
trditev: MAT-SS-2/iracionalne-enacbe#preveri4
besedilo: »Kvadriranje da enačbo $x^2 + 2x - 3 = 0$, razstavljeno $(x + 3)(x - 1) = 0$. Pogoj $x \ge -2$ izloči $-3$. Preizkus za $1$: $\sqrt{9} = 3 = 1 + 2$.« -/
theorem preveri4 (x : ℝ) : ((0 ≤ 2 * x + 7 ∧ √(2 * x + 7) = x + 2) ↔ x = 1) ∧
    x ^ 2 + 2 * x - 3 = (x + 3) * (x - 1) ∧ √(2 * (-3) + 7 : ℝ) ≠ -3 + 2 := by
  refine ⟨⟨?_, ?_⟩, by ring, by norm_num⟩
  · rintro ⟨hA, h⟩
    obtain ⟨h1, h2⟩ := (kor_eq hA).mp h
    have : (x - (-3)) * (x - 1) = 0 := by linear_combination -h1
    rcases (produkt_nic _ _ _).mp this with h3 | h3
    · linarith
    · exact h3
  · rintro rfl; refine ⟨by norm_num, ?_⟩; norm_num

/-- Preveri se, 5: √(160 m/3600) = 1,6 ⇔ m = 3600 · 2,56/160 = 57,6 kg; napačno: 3600 · 1,6/160 = 36 in
3600 · √1,6/160 ≈ 28,5.
trditev: MAT-SS-2/iracionalne-enacbe#preveri5
besedilo: »Kvadriramo: $\dfrac{160 \cdot m}{3600} = 2{,}56$, zato je $m = \dfrac{3600 \cdot 2{,}56}{160} = 57{,}6\,\mathrm{kg}$.« -/
theorem preveri5 (m : ℝ) : (√(160 * m / 3600) = 1.6 ↔ m = 57.6) ∧ (1.6:ℝ) ^ 2 = 2.56 ∧
    (3600:ℝ) * 2.56 / 160 = 57.6 ∧ (3600:ℝ) * 1.6 / 160 = 36 ∧
    28.45 < 3600 * √(1.6:ℝ) / 160 ∧ 3600 * √(1.6:ℝ) / 160 < 28.55 := by
  obtain ⟨a, b⟩ : (1.2649 : ℝ) < √1.6 ∧ √(1.6:ℝ) < 1.265 :=
    ⟨(Real.lt_sqrt (by norm_num)).mpr (by norm_num), (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)⟩
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by linarith, by linarith⟩
  rw [mosteller (by norm_num) (by norm_num)]; constructor <;> intro h <;> rw [h] <;> norm_num

/-! ## RACUN -/

/-- RACUN: x² − x − 6 = 0 ⇔ x ∈ {−2, 3}; x − 2 = √(x + 4) ⇔ x = 5; 1,1² = 1,21; (x − 2)(x² + 2x + 4) = x³ − 8;
x − 1 = (−2)³ ⇔ x = −7; x² − 9 = (−2)³ ⇔ x = ±1; x² − 3x − 4 = 0 ⇔ x ∈ {−1, 4};
(x − 3)(x + 3)(x² + 9) = x⁴ − 81. Ostale vrstice RACUN: x⁴ = 81 ⇔ x = ±3 je v `ustno3`,
((x − 1)² − 25)((x − 1)² + 25) = (x − 1)⁴ − 625 in (x − 6)(x + 4) = (x − 1)² − 25 sta v `matura1_razstavljanje`.
trditev: MAT-SS-2/iracionalne-enacbe#racun
besedilo: »c) Kvadriramo: $x + 5 = x^2 - 2x + 1$, urejeno $x^2 - 3x - 4 = 0$, razstavljeno $(x - 4)(x + 1) = 0$. Kandidata sta $x = 4$ in $x = -1$.« -/
theorem racun (x : ℝ) : (x ^ 2 - x - 6 = 0 ↔ x = -2 ∨ x = 3) ∧ ((0 ≤ x + 4 ∧ x - 2 = √(x + 4)) ↔ x = 5) ∧
    (1.1:ℝ) ^ 2 = 1.21 ∧ (x - 2) * (x ^ 2 + 2 * x + 4) = x ^ 3 - 8 ∧ (x - 1 = (-2) ^ 3 ↔ x = -7) ∧
    (x ^ 2 - 9 = (-2) ^ 3 ↔ x = -1 ∨ x = 1) ∧ (x ^ 2 - 3 * x - 4 = 0 ↔ x = -1 ∨ x = 4) ∧
    (x - 3) * (x + 3) * (x ^ 2 + 9) = x ^ 4 - 81 := by
  refine ⟨?_, ⟨?_, ?_⟩, by norm_num, by ring, ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, ?_, ?_, by ring⟩
  · rw [← produkt_nic]; constructor <;> intro h <;> linear_combination h
  · rintro ⟨hA, h⟩
    obtain ⟨h1, h2⟩ := (kor_eq hA).mp h.symm
    have : (x - 0) * (x - 5) = 0 := by linear_combination -h1
    rcases (produkt_nic _ _ _).mp this with h3 | h3
    · linarith
    · exact h3
  · rintro rfl; refine ⟨by norm_num, ?_⟩; norm_num
  · rw [← produkt_nic]; constructor <;> intro h <;> linear_combination h
  · rw [← produkt_nic]; constructor <;> intro h <;> linear_combination h

end Evklid.Lekcije.MAT_SS_2.IracionalneEnacbe
