/-
vir: content/lessons/MAT-SS-2/koreni.md
sha256: f1668f871e0cca4c30d17017f659bd977fe7b2fb7010a40a963a55165b577341
Ni v Leanu: risbe (spirala, številska premica) in simulaciji; merjenje z ravnilom in opis konstrukcije z ravnilom,
trikotnikom in šestilom (geometrijski postopek; dokazane so dolžine √(p² + q²), √(h² − p²) in √(n + 1)); opisi tipk
računala, vrstni red tipkanja in opozorilo, da nekatera računala pri (−20)^(1/3) javijo napako (opis naprave;
dokazano je, da 200^1 : 5 = 40 in da je ∛(−20) = −∛20); pojasnila »s takim ulomkom je lažje računati«, »množiti je
lažje kot deliti« (didaktična trditev); trditev, da je 2√18 »ni končna oblika« in da je treba izvleči *največji*
popolni kvadrat (dogovor o zapisu; dokazano je √72 = 2√18 = 6√2); točkovanje maturitetnih nalog; opisi napačnih
postopkov v razlagah napačnih odgovorov, kjer niso številske trditve (številske so dokazane: √15, 5 + √3, √60,
√900 = 30, √300, 300 : 5); »graf se začne v izhodišču in vedno bolj počasi raste« (opis grafa; točke tabele so
dokazane); »za negativen x grafa ni« (v Leanu je √x = 0 za x < 0, zato je trditev zapisana kot: noben realni y
nima y² < 0); trditev, da je 30 % : 5 = 6 % »napačen« letni odstotek (dokazano: 1,06⁵ ≠ 1,3).
Kubični in n-ti koren: v Mathlibu je x^(1/n) za x < 0 drugačen od realnega lihega korena, zato je tu definiran
`koren n a` (za a ≥ 0 je a^(1/n), za a < 0 je −(−a)^(1/n)); `koren_lih` pokaže, da je pri lihem n edino realno število
b z bⁿ = a, `koren_sod` pa, da je pri sodem n edino nenegativno tako število. Vsak »≈« je dokazan kot ocena
napake zaokrožitve (polovica enote zadnjega mesta), razen kjer lekcija sama zaokroži grobo (»približno 1 cm«:
dokazano 1,005 < 100 − 70√2 < 1,015).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.Koreni

open Real

/-! ## n-ti koren in pomožne trditve -/

/-- Razlaga 2: realni n-ti koren. Za a ≥ 0 je a^(1/n), za a < 0 (smiselno pri lihem n) je −(−a)^(1/n). -/
noncomputable def koren (n : ℕ) (a : ℝ) : ℝ :=
  if 0 ≤ a then a ^ ((n : ℝ)⁻¹) else -((-a) ^ ((n : ℝ)⁻¹))

/-- Razlaga 2: za a ≥ 0 je ⁿ√a nenegativen.
trditev: MAT-SS-2/koreni#koren-nenegativen
besedilo: »Pri **sodem** $n$ mora biti $a \ge 0$ in je koren po dogovoru nenegativen.« -/
theorem koren_nenegativen {n : ℕ} {a : ℝ} (ha : 0 ≤ a) : 0 ≤ koren n a := by
  simp only [koren, ha, ↓reduceIte]; exact Real.rpow_nonneg ha _

/-- Predpostavka trditve `koren_nenegativen` se da izpolniti (a = 4). -/
example : (0:ℝ) ≤ 4 := by norm_num

/-- Predpostavke trditve `koren_nenegativen` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 4 := by norm_num
  koren_nenegativen (ha := w)

/-- Razlaga 2: za a ≥ 0 in n ≥ 1 je (ⁿ√a)ⁿ = a.
trditev: MAT-SS-2/koreni#koren-pot
besedilo: »$a \ge 0$« -/
theorem koren_pot {n : ℕ} (hn : n ≠ 0) {a : ℝ} (ha : 0 ≤ a) : koren n a ^ n = a := by
  simp only [koren, ha, ↓reduceIte]; exact Real.rpow_inv_natCast_pow ha hn

/-- Predpostavki trditve `koren_pot` se dajo izpolniti (n = 2, a = 4). -/
example : (2:ℕ) ≠ 0 ∧ (0:ℝ) ≤ 4 := by norm_num

/-- Predpostavke trditve `koren_pot` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2:ℕ) ≠ 0 ∧ (0:ℝ) ≤ 4 := by norm_num
  koren_pot (hn := w.1) (ha := w.2)

/-- Razlaga 2: če je b ≥ 0 in bⁿ = a, je ⁿ√a = b.
trditev: MAT-SS-2/koreni#koren-eq
besedilo: »$b^n = a$« -/
theorem koren_eq {n : ℕ} (hn : n ≠ 0) {a b : ℝ} (hb : 0 ≤ b) (h : b ^ n = a) : koren n a = b := by
  subst h; simp only [koren, pow_nonneg hb n, ↓reduceIte]; exact Real.pow_rpow_inv_natCast hb hn

/-- Predpostavke trditve `koren_eq` se dajo izpolniti (n = 2, a = 4, b = 2). -/
example : (2:ℕ) ≠ 0 ∧ (0:ℝ) ≤ 2 ∧ (2:ℝ) ^ 2 = 4 := by norm_num

/-- Predpostavke trditve `koren_eq` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2:ℕ) ≠ 0 ∧ (0:ℝ) ≤ 2 ∧ (2:ℝ) ^ 2 = 4 := by norm_num
  koren_eq (hn := w.1) (hb := w.2.1) (h := w.2.2)

/-- Razlaga 2: pri lihem n je (ⁿ√a)ⁿ = a za vsak realni a, tudi negativen.
trditev: MAT-SS-2/koreni#koren-lih-pot
besedilo: »Pri **lihem** $n$ je koren definiran tudi za negativne $a$:« -/
theorem koren_lih_pot {n : ℕ} (hn : Odd n) (a : ℝ) : koren n a ^ n = a := by
  have hn0 : n ≠ 0 := by rintro rfl; exact Nat.not_odd_zero hn
  by_cases ha : 0 ≤ a
  · exact koren_pot hn0 ha
  · have ha' : 0 ≤ -a := le_of_lt (neg_pos.mpr (not_le.mp ha))
    simp only [koren, ha, ↓reduceIte]; rw [hn.neg_pow, Real.rpow_inv_natCast_pow ha' hn0, neg_neg]

/-- Predpostavka trditve `koren_lih_pot` se da izpolniti (n = 3). -/
example : Odd 3 := ⟨1, rfl⟩

/-- Predpostavke trditve `koren_lih_pot` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Odd 3 := ⟨1, rfl⟩
  koren_lih_pot (hn := w)

/-- Razlaga 2 in Ustno vprašanje 1: pri lihem n je ⁿ√a edino realno število b z bⁿ = a.
trditev: MAT-SS-2/koreni#koren-lih
besedilo: »2. n-ti koren.** Za naravno število $n \ge 2$ je $\sqrt[n]{a}$ tisto število $b$, za katero velja $b^n = a$.« -/
theorem koren_lih {n : ℕ} (hn : Odd n) (a b : ℝ) : b ^ n = a ↔ b = koren n a := by
  constructor
  · intro h; exact hn.pow_inj.mp (by rw [h, koren_lih_pot hn])
  · rintro rfl; exact koren_lih_pot hn a

/-- Predpostavka trditve `koren_lih` se da izpolniti (n = 3). -/
example : Odd 3 := ⟨1, rfl⟩

/-- Predpostavke trditve `koren_lih` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Odd 3 := ⟨1, rfl⟩
  koren_lih (hn := w)

/-- Razlaga 2: pri sodem n in a ≥ 0 je ⁿ√a edino nenegativno število b z bⁿ = a.
trditev: MAT-SS-2/koreni#koren-sod
besedilo: »2. n-ti koren.** Za naravno število $n \ge 2$ je $\sqrt[n]{a}$ tisto število $b$, za katero velja $b^n = a$.« -/
theorem koren_sod {n : ℕ} (hn0 : n ≠ 0) {a b : ℝ} (ha : 0 ≤ a) (hb : 0 ≤ b) :
    b ^ n = a ↔ b = koren n a :=
  ⟨fun h => (koren_eq hn0 hb h).symm, fun h => h ▸ koren_pot hn0 ha⟩

/-- Predpostavke trditve `koren_sod` se dajo izpolniti. -/
example : (0:ℝ) ≤ 16 ∧ (0:ℝ) ≤ 2 ∧ (4:ℕ) ≠ 0 := by norm_num

/-- Predpostavke trditve `koren_sod` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 16 ∧ (0:ℝ) ≤ 2 ∧ (4:ℕ) ≠ 0 := by norm_num
  koren_sod (hn0 := w.2.2) (ha := w.1) (hb := w.2.1)

/-- Razlaga 2: pri sodem n negativno število ni n-ta potenca nobenega realnega števila.
trditev: MAT-SS-2/koreni#sod-negativen
besedilo: »2. n-ti koren.** Za naravno število $n \ge 2$ je $\sqrt[n]{a}$ tisto število $b$,« -/
theorem sod_negativen {n : ℕ} (hn : Even n) {a : ℝ} (ha : a < 0) (b : ℝ) : b ^ n ≠ a := by
  have := hn.pow_nonneg b; intro h; linarith

/-- Predpostavke trditve `sod_negativen` se dajo izpolniti. -/
example : Even 2 ∧ (-4 : ℝ) < 0 := ⟨even_two, by norm_num⟩

/-- Predpostavke trditve `sod_negativen` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Even 2 ∧ (-4 : ℝ) < 0 := ⟨even_two, by norm_num⟩
  sod_negativen (hn := w.1) (ha := w.2)

/-- Ustno vprašanje 1: pri sodem n in a > 0 ima xⁿ = a natanko rešitvi ±ⁿ√a.
trditev: MAT-SS-2/koreni#enacba-sod-poz
besedilo: »Zato ima enačba $x^n = a$ pri sodem $n$ dve rešitvi $\pm\sqrt[n]{a}$, če je $a > 0$, eno rešitev $0$, če je $a = 0$, in nobene realne rešitve, če je $a < 0$.« -/
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
example : Even 2 ∧ (2:ℕ) ≠ 0 ∧ (0:ℝ) < 9 := ⟨even_two, by norm_num, by norm_num⟩

/-- Predpostavke trditve `enacba_sod_poz` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Even 2 ∧ (2:ℕ) ≠ 0 ∧ (0:ℝ) < 9 := ⟨even_two, by norm_num, by norm_num⟩
  enacba_sod_poz (hn := w.1) (hn0 := w.2.1) (ha := w.2.2)

/-- Ustno vprašanje 1: pri sodem n in a = 0 ima xⁿ = 0 le rešitev 0.
trditev: MAT-SS-2/koreni#enacba-sod-nic
besedilo: »Zato ima enačba $x^n = a$ pri sodem $n$ dve rešitvi $\pm\sqrt[n]{a}$, če je $a > 0$, eno rešitev $0$, če je $a = 0$, in nobene realne rešitve, če je $a < 0$.« -/
theorem enacba_sod_nic {n : ℕ} (hn0 : n ≠ 0) (x : ℝ) : x ^ n = 0 ↔ x = 0 := pow_eq_zero_iff hn0

/-- Predpostavke trditve `enacba_sod_nic` se dajo izpolniti. -/
example : (2:ℕ) ≠ 0 := by norm_num

/-- Predpostavke trditve `enacba_sod_nic` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2:ℕ) ≠ 0 := by norm_num
  enacba_sod_nic (hn0 := w)

/-- Ustno vprašanje 1: pri sodem n in a < 0 enačba xⁿ = a nima realne rešitve.
trditev: MAT-SS-2/koreni#enacba-sod-neg
besedilo: »Zato ima enačba $x^n = a$ pri sodem $n$ dve rešitvi $\pm\sqrt[n]{a}$, če je $a > 0$, eno rešitev $0$, če je $a = 0$, in nobene realne rešitve, če je $a < 0$.« -/
theorem enacba_sod_neg {n : ℕ} (hn : Even n) {a : ℝ} (ha : a < 0) : ¬ ∃ x : ℝ, x ^ n = a :=
  fun ⟨x, hx⟩ => sod_negativen hn ha x hx

/-- Predpostavki trditve `enacba_sod_neg` se dajo izpolniti (n = 2, a = −4). -/
example : Even 2 ∧ (-4:ℝ) < 0 := ⟨even_two, by norm_num⟩

/-- Predpostavke trditve `enacba_sod_neg` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Even 2 ∧ (-4:ℝ) < 0 := ⟨even_two, by norm_num⟩
  enacba_sod_neg (hn := w.1) (ha := w.2)

/-- Ustno vprašanje 1: pri lihem n ima xⁿ = a natanko eno realno rešitev x = ⁿ√a.
trditev: MAT-SS-2/koreni#enacba-lih
besedilo: »Enačba $x^n = a$ ima pri lihem $n$ natanko eno realno rešitev $x = \sqrt[n]{a}$.« -/
theorem enacba_lih {n : ℕ} (hn : Odd n) (a : ℝ) : ∃! x : ℝ, x ^ n = a :=
  ⟨koren n a, koren_lih_pot hn a, fun y hy => (koren_lih hn a y).mp hy⟩

/-- Predpostavke trditve `enacba_lih` se dajo izpolniti. -/
example : Odd 3 := ⟨1, rfl⟩

/-- Predpostavke trditve `enacba_lih` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Odd 3 := ⟨1, rfl⟩
  enacba_lih (hn := w)

/-- Kvadratni koren je koren z eksponentom 2: za a ≥ 0 je ²√a = √a.
trditev: MAT-SS-2/koreni#koren-dva
besedilo: »Kvadratni koren.** Za $a \ge 0$ je $\sqrt{a}$ **nenegativno** število,« -/
theorem koren_dva {a : ℝ} (ha : 0 ≤ a) : koren 2 a = √a :=
  koren_eq (by norm_num) (Real.sqrt_nonneg a) (Real.sq_sqrt ha)

/-- Predpostavke trditve `koren_dva` se dajo izpolniti. -/
example : (0:ℝ) ≤ 2 := by norm_num

/-- Predpostavke trditve `koren_dva` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 2 := by norm_num
  koren_dva (ha := w)

/-- Ocena korena: če je 0 ≤ lo, loⁿ < a < hiⁿ, je lo < ⁿ√a < hi.
trditev: MAT-SS-2/koreni#koren-med
besedilo: »Ocena korena.** Če $a$ ni popoln kvadrat,« -/
theorem koren_med {n : ℕ} (hn : n ≠ 0) {a lo hi : ℝ} (ha : 0 ≤ a) (hhi : 0 ≤ hi)
    (h1 : lo ^ n < a) (h2 : a < hi ^ n) : lo < koren n a ∧ koren n a < hi := by
  have hr := koren_pot hn ha
  exact ⟨lt_of_pow_lt_pow_left₀ n (koren_nenegativen ha) (by rw [hr]; exact h1),
    lt_of_pow_lt_pow_left₀ n hhi (by rw [hr]; exact h2)⟩

/-- Predpostavke trditve `koren_med` se dajo izpolniti. -/
example : (3:ℕ) ≠ 0 ∧ (0:ℝ) ≤ 50 ∧ (0:ℝ) ≤ 4 ∧ (3:ℝ) ^ 3 < 50 ∧ (50:ℝ) < 4 ^ 3 := by norm_num

/-- Predpostavke trditve `koren_med` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (3:ℕ) ≠ 0 ∧ (0:ℝ) ≤ 50 ∧ (0:ℝ) ≤ 4 ∧ (3:ℝ) ^ 3 < 50 ∧ (50:ℝ) < 4 ^ 3 := by norm_num
  koren_med (hn := w.1) (ha := w.2.1) (hhi := w.2.2.1) (h1 := w.2.2.2.1) (h2 := w.2.2.2.2)

/-- Ocena kvadratnega korena: 0 ≤ lo, lo² < x < hi², 0 < hi ⇒ lo < √x < hi.
trditev: MAT-SS-2/koreni#koren2-med
besedilo: »Kvadratni koren.** Za $a \ge 0$ je $\sqrt{a}$ **nenegativno** število,« -/
theorem koren2_med {x lo hi : ℝ} (hlo : 0 ≤ lo) (hhi : 0 < hi) (h1 : lo ^ 2 < x) (h2 : x < hi ^ 2) :
    lo < √x ∧ √x < hi :=
  ⟨(Real.lt_sqrt hlo).mpr h1, (Real.sqrt_lt' hhi).mpr h2⟩

/-- Predpostavke trditve `koren2_med` se dajo izpolniti. -/
example : (0:ℝ) ≤ 4 ∧ (0:ℝ) < 5 ∧ (4:ℝ) ^ 2 < 20 ∧ (20:ℝ) < 5 ^ 2 := by norm_num

/-- Predpostavke trditve `koren2_med` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 4 ∧ (0:ℝ) < 5 ∧ (4:ℝ) ^ 2 < 20 ∧ (20:ℝ) < 5 ^ 2 := by norm_num
  koren2_med (hlo := w.1) (hhi := w.2.1) (h1 := w.2.2.1) (h2 := w.2.2.2)

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem s2 : (1.41421356 : ℝ) < √2 ∧ √2 < 1.41421357 := koren2_med (by norm_num) (by norm_num) (by norm_num) (by norm_num)
/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem s3 : (1.7320508 : ℝ) < √3 ∧ √3 < 1.7320509 := koren2_med (by norm_num) (by norm_num) (by norm_num) (by norm_num)
/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem s5 : (2.2360679 : ℝ) < √5 ∧ √5 < 2.236068 := koren2_med (by norm_num) (by norm_num) (by norm_num) (by norm_num)
/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem s6 : (2.4494897 : ℝ) < √6 ∧ √6 < 2.4494898 := koren2_med (by norm_num) (by norm_num) (by norm_num) (by norm_num)
/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem s7 : (2.6457513 : ℝ) < √7 ∧ √7 < 2.6457514 := koren2_med (by norm_num) (by norm_num) (by norm_num) (by norm_num)
/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem s13 : (3.6055512 : ℝ) < √13 ∧ √13 < 3.6055513 := koren2_med (by norm_num) (by norm_num) (by norm_num) (by norm_num)

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem sq2 : √2 ^ 2 = 2 := Real.sq_sqrt (by norm_num)
/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem sq3 : √3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem sq5 : √5 ^ 2 = 5 := Real.sq_sqrt (by norm_num)
/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem sq7 : √7 ^ 2 = 7 := Real.sq_sqrt (by norm_num)

/-- Pomožno: √(k²) = k za naravno k (za izračune √9 = 3 ipd.).
pomozno -/
theorem sqrt_kv {k : ℝ} (hk : 0 ≤ k) : √(k ^ 2) = k := Real.sqrt_sq hk

example : (0:ℝ) ≤ 3 := by norm_num

/-! ## Razlaga 1: kvadratni koren -/

/-- Razlaga 1: za a ≥ 0 je (√a)² = a.
trditev: MAT-SS-2/koreni#kvadrat-korena
besedilo: »$$\left(\sqrt{a}\right)^2 = a \quad (a \ge 0), \qquad \sqrt{x^2} = |x| \quad (x \in \mathbb{R}).$$« -/
theorem kvadrat_korena {a : ℝ} (ha : 0 ≤ a) : √a ^ 2 = a := Real.sq_sqrt ha

/-- Predpostavke trditve `kvadrat_korena` se dajo izpolniti. -/
example : (0:ℝ) ≤ 5 := by norm_num

/-- Predpostavke trditve `kvadrat_korena` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 5 := by norm_num
  kvadrat_korena (ha := w)

/-- Razlaga 1 in Bolj natančno: √(x²) = |x| za vsak realni x.
trditev: MAT-SS-2/koreni#koren-kvadrata
besedilo: »\qquad \sqrt{x^2} = |x| \quad (x \in \mathbb{R}).$$« -/
theorem koren_kvadrata (x : ℝ) : √(x ^ 2) = |x| := Real.sqrt_sq_eq_abs x

/-- Razlaga 1 in Pogoste napake: √((−3)²) = √9 = 3 = |−3| in ne −3.
trditev: MAT-SS-2/koreni#koren-minus3
besedilo: »Zato je $\sqrt{(-3)^2} = \sqrt{9} = 3 = |-3|$ in ne $-3$.« -/
theorem koren_minus3 : √((-3:ℝ) ^ 2) = √9 ∧ √(9:ℝ) = 3 ∧ (3:ℝ) = |-3| ∧ √((-3:ℝ) ^ 2) ≠ -3 := by
  have h9 : √(9:ℝ) = 3 := by rw [show (9:ℝ) = 3 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)
  refine ⟨by norm_num, h9, by norm_num, ?_⟩
  rw [show ((-3:ℝ)) ^ 2 = 9 by norm_num, h9]; norm_num

/-- Razlaga 1: √a je nenegativen (in v realnih številih noben y nima y² < 0: koren negativnega števila ne obstaja).
trditev: MAT-SS-2/koreni#koren-definicija
besedilo: »1. Kvadratni koren.** Za $a \ge 0$ je $\sqrt{a}$ **nenegativno** število, katerega kvadrat je $a$. Pogoj $a \ge 0$ je nujen: v realnih številih ne obstaja kvadratni koren negativnega števila. Velja« -/
theorem koren_definicija (a : ℝ) : 0 ≤ √a ∧ (a < 0 → ¬ ∃ y : ℝ, y ^ 2 = a) :=
  ⟨Real.sqrt_nonneg a, fun ha ⟨y, hy⟩ => by nlinarith [sq_nonneg y]⟩

/-- Razlaga 2: ∛(−27) = −3, ker je (−3)³ = −27.
trditev: MAT-SS-2/koreni#kubicni-m27
besedilo: »Pri **lihem** $n$ je koren definiran tudi za negativne $a$: $\sqrt[3]{-27} = -3$, ker je $(-3)^3 = -27$.« -/
theorem kubicni_m27 : ((-3:ℝ)) ^ 3 = -27 ∧ koren 3 (-27) = -3 :=
  ⟨by norm_num, ((koren_lih ⟨1, rfl⟩ (-27) (-3)).mp (by norm_num)).symm⟩

/-- Povzetek: lihi koren negativnega števila je realen: ∛(−8) = −2, ker je (−2)³ = −8.
trditev: MAT-SS-2/koreni#kubicni-m8
besedilo: »Sodi koren** negativnega števila ni realen; **lihi** je: $\sqrt[3]{-8} = -2$.« -/
theorem kubicni_m8 : ((-2:ℝ)) ^ 3 = -8 ∧ koren 3 (-8) = -2 :=
  ⟨by norm_num, ((koren_lih ⟨1, rfl⟩ (-8) (-2)).mp (by norm_num)).symm⟩

/-! ## Razlaga 3: tabela in pravila -/

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem sqrt4 : √(4:ℝ) = 2 := by rw [show (4:ℝ) = 2 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)
/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem sqrt9 : √(9:ℝ) = 3 := by rw [show (9:ℝ) = 3 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)
/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem sqrt16 : √(16:ℝ) = 4 := by rw [show (16:ℝ) = 4 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)
/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem sqrt25 : √(25:ℝ) = 5 := by rw [show (25:ℝ) = 5 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)
/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem sqrt36 : √(36:ℝ) = 6 := by rw [show (36:ℝ) = 6 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)

/-- Razlaga 3, tabela, 1. vrstica: √4 · √9 = 2 · 3 = 6 = √36.
trditev: MAT-SS-2/koreni#tabela1
besedilo: »| $\sqrt{4} \cdot \sqrt{9}$ | $2 \cdot 3$ | $\sqrt{36}$ |« -/
theorem tabela1 : √(4:ℝ) * √9 = 2 * 3 ∧ (2:ℝ) * 3 = 6 ∧ √(36:ℝ) = 6 := by
  rw [sqrt4, sqrt9, sqrt36]; norm_num

/-- Razlaga 3, tabela, 2. vrstica: √4 · √25 = 2 · 5 = 10 = √100.
trditev: MAT-SS-2/koreni#tabela2
besedilo: »| $\sqrt{4} \cdot \sqrt{25}$ | $2 \cdot 5$ | $\sqrt{100}$ |« -/
theorem tabela2 : √(4:ℝ) * √25 = 2 * 5 ∧ (2:ℝ) * 5 = 10 ∧ √(100:ℝ) = 10 := by
  rw [sqrt4, sqrt25, show (100:ℝ) = 10 ^ 2 by norm_num, sqrt_kv (by norm_num)]; norm_num

/-- Razlaga 3, tabela, 3. vrstica in uvod: √2 · √225 = √450 = √225 · √2 = 15√2, oba izraza sta ≈ 21,21
(tudi 1,414 · 15 = 21,21).
trditev: MAT-SS-2/koreni#tabela3
besedilo: »Vsakič dobiš isto: v prvi vrstici $6$, v drugi $10$, v zadnji pa sta oba izraza približno $21{,}21$. Zadnja vrstica je diagonala lista iz uvoda: $\sqrt{450} = \sqrt{225} \cdot \sqrt{2} = 15\sqrt{2}$.« -/
theorem tabela3 : √2 * √225 = √450 ∧ √(450:ℝ) = √225 * √2 ∧ √(225:ℝ) * √2 = 15 * √2 ∧
    (1.414:ℝ) * 15 = 21.21 ∧ 21.205 < √(450:ℝ) ∧ √(450:ℝ) < 21.215 := by
  have h225 : √(225:ℝ) = 15 := by rw [show (225:ℝ) = 15 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)
  have hm : √2 * √225 = √(450:ℝ) := by rw [← Real.sqrt_mul (by norm_num)]; norm_num
  obtain ⟨a, b⟩ := koren2_med (x := 450) (lo := 21.205) (hi := 21.215) (by norm_num) (by norm_num)
    (by norm_num) (by norm_num)
  refine ⟨hm, by rw [← hm, mul_comm], by rw [h225], by norm_num, a, b⟩

/-- Zakaj se tega učimo: diagonala lista s stranico 15 cm je √(15² + 15²) = √450 ≈ 21,2 cm, ploščice s
stranico 20 cm √(20² + 20²) ≈ 28,3 cm; količnik diagonala/stranica je obakrat √2 ≈ 1,41.
trditev: MAT-SS-2/koreni#uvod-diagonale
besedilo: »Ploščica s stranico $20\,\text{cm}$ ima diagonalo približno $28{,}3\,\text{cm}$.« -/
theorem uvod_diagonale :
    √((15:ℝ) ^ 2 + 15 ^ 2) = √450 ∧ 21.15 < √(450:ℝ) ∧ √(450:ℝ) < 21.25 ∧
    28.25 < √((20:ℝ) ^ 2 + 20 ^ 2) ∧ √((20:ℝ) ^ 2 + 20 ^ 2) < 28.35 ∧
    √(450:ℝ) / 15 = √2 ∧ √((20:ℝ) ^ 2 + 20 ^ 2) / 20 = √2 ∧ 1.405 < √2 ∧ √2 < (1.415:ℝ) := by
  have e1 : √(450:ℝ) = 15 * √2 := by
    rw [show (450:ℝ) = 15 ^ 2 * 2 by norm_num, Real.sqrt_mul (by norm_num), sqrt_kv (by norm_num)]
  have e2 : √((20:ℝ) ^ 2 + 20 ^ 2) = 20 * √2 := by
    rw [show (20:ℝ) ^ 2 + 20 ^ 2 = 20 ^ 2 * 2 by norm_num, Real.sqrt_mul (by norm_num), sqrt_kv (by norm_num)]
  obtain ⟨a, b⟩ := s2
  refine ⟨by norm_num, by rw [e1]; linarith, by rw [e1]; linarith, by rw [e2]; linarith,
    by rw [e2]; linarith, by rw [e1]; ring, by rw [e2]; ring, by linarith, by linarith⟩

/-- Pravila za računanje: √(a · b) = √a · √b za a, b ≥ 0 (Bolj natančno: obe strani sta nenegativni in imata
kvadrat ab).
trditev: MAT-SS-2/koreni#koren-produkta
besedilo: »Edino nenegativno število s kvadratom $ab$ pa je po definiciji $\sqrt{ab}$, zato je $\sqrt{a}\sqrt{b} = \sqrt{ab}$.« -/
theorem koren_produkta {a b : ℝ} (ha : 0 ≤ a) (_hb : 0 ≤ b) : √(a * b) = √a * √b := Real.sqrt_mul ha b

/-- Predpostavke trditve `koren_produkta` se dajo izpolniti. -/
example : (0:ℝ) ≤ 3 ∧ (0:ℝ) ≤ 12 := by norm_num

/-- Predpostavke trditve `koren_produkta` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 3 ∧ (0:ℝ) ≤ 12 := by norm_num
  koren_produkta (ha := w.1) (_hb := w.2)

/-- Bolj natančno: dokaz pravila za produkt po korakih: (√a√b)² = √a² · √b² = ab in √a√b ≥ 0, zato je to √(ab).
trditev: MAT-SS-2/koreni#koren-produkta-dokaz
besedilo: »$\left(\sqrt{a}\sqrt{b}\right)^2 = \sqrt{a}^2 \cdot \sqrt{b}^2 = ab$« -/
theorem koren_produkta_dokaz {a b : ℝ} (ha : 0 ≤ a) (hb : 0 ≤ b) :
    (√a * √b) ^ 2 = √a ^ 2 * √b ^ 2 ∧ √a ^ 2 * √b ^ 2 = a * b ∧ 0 ≤ √a * √b ∧ √a * √b = √(a * b) := by
  refine ⟨by ring, by rw [Real.sq_sqrt ha, Real.sq_sqrt hb], by positivity, ?_⟩
  exact (Real.sqrt_mul ha b).symm

/-- Predpostavke trditve `koren_produkta_dokaz` se dajo izpolniti. -/
example : (0:ℝ) ≤ 2 ∧ (0:ℝ) ≤ 3 := by norm_num

/-- Predpostavke trditve `koren_produkta_dokaz` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 2 ∧ (0:ℝ) ≤ 3 := by norm_num
  koren_produkta_dokaz (ha := w.1) (hb := w.2)

/-- Pravila: primer √3 · √12 = √36 = 6.
trditev: MAT-SS-2/koreni#primer-3-12
besedilo: »$\sqrt{3} \cdot \sqrt{12} = \sqrt{36} = 6$« -/
theorem primer_3_12 : √(3:ℝ) * √12 = √36 ∧ √(36:ℝ) = 6 := by
  refine ⟨?_, sqrt36⟩; rw [← Real.sqrt_mul (by norm_num)]; norm_num

/-- Pravila: √(a/b) = √a/√b za a ≥ 0, b > 0.
trditev: MAT-SS-2/koreni#koren-kolicnika
besedilo: »$\;\sqrt{\dfrac{a}{b}} = \dfrac{\sqrt{a}}{\sqrt{b}}$ za $a, b \ge 0$ (pri ulomku $b > 0$) (na pamet)« -/
theorem koren_kolicnika {a b : ℝ} (_ha : 0 ≤ a) (hb : 0 < b) : √(a / b) = √a / √b := Real.sqrt_div' a hb.le

/-- Predpostavke trditve `koren_kolicnika` se dajo izpolniti. -/
example : (0:ℝ) ≤ 25 ∧ (0:ℝ) < 4 := by norm_num

/-- Predpostavke trditve `koren_kolicnika` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 25 ∧ (0:ℝ) < 4 := by norm_num
  koren_kolicnika (_ha := w.1) (hb := w.2)

/-- Pravila: primer √(25/4) = 5/2.
trditev: MAT-SS-2/koreni#primer-25-4
besedilo: »$\sqrt{\dfrac{25}{4}} = \dfrac{5}{2}$« -/
theorem primer_25_4 : √((25:ℝ) / 4) = 5 / 2 := by
  rw [Real.sqrt_div' _ (by norm_num), sqrt25, sqrt4]

/-- Pravila: ⁿ√(a · b) = ⁿ√a · ⁿ√b za a, b ≥ 0.
trditev: MAT-SS-2/koreni#koren-n-produkta
besedilo: »$\sqrt{a^2 b} = a\sqrt{b}$ za $a, b \ge 0$ (na pamet)« -/
theorem koren_n_produkta (n : ℕ) {a b : ℝ} (ha : 0 ≤ a) (hb : 0 ≤ b) :
    koren n (a * b) = koren n a * koren n b := by
  simp only [koren, mul_nonneg ha hb, ha, hb, ↓reduceIte]; rw [Real.mul_rpow ha hb]

/-- Predpostavke trditve `koren_n_produkta` se dajo izpolniti. -/
example : (0:ℝ) ≤ 2 ∧ (0:ℝ) ≤ 4 := by norm_num

/-- Predpostavke trditve `koren_n_produkta` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 2 ∧ (0:ℝ) ≤ 4 := by norm_num
  koren_n_produkta (ha := w.1) (hb := w.2)

/-- Pravila in premisli k racionalizaciji: ∛2 · ∛4 = ∛8 = 2.
trditev: MAT-SS-2/koreni#primer-kub-2-4
besedilo: »$\sqrt[3]{2} \cdot \sqrt[3]{4} = \sqrt[3]{8} = 2$« -/
theorem primer_kub_2_4 : koren 3 2 * koren 3 4 = koren 3 8 ∧ koren 3 8 = 2 := by
  refine ⟨?_, koren_eq (by norm_num) (by norm_num) (by norm_num)⟩
  rw [← koren_n_produkta 3 (by norm_num) (by norm_num)]; norm_num

/-- Pravila: ᵐ√(ⁿ√a) = ᵐⁿ√a za a ≥ 0.
trditev: MAT-SS-2/koreni#koren-korena
besedilo: »Pravila** za $a, b \ge 0$ (pri ulomku $b > 0$):« -/
theorem koren_korena (m n : ℕ) {a : ℝ} (ha : 0 ≤ a) : koren m (koren n a) = koren (m * n) a := by
  have h := koren_nenegativen (n := n) ha
  simp only [koren, ha, ↓reduceIte] at h ⊢
  simp only [h, ↓reduceIte]
  rw [← Real.rpow_mul ha]
  congr 1; push_cast; rw [mul_inv]; ring

/-- Predpostavke trditve `koren_korena` se dajo izpolniti. -/
example : (0:ℝ) ≤ 16 := by norm_num

/-- Predpostavke trditve `koren_korena` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 16 := by norm_num
  koren_korena (ha := w)

/-- Pravila: primer √(√16) = ∜16 = 2.
trditev: MAT-SS-2/koreni#primer-16
besedilo: »$2^2 = 4$, $3^2 = 9$ in $4^2 = 16$, zato je $\sqrt{4} = 2$, $\sqrt{9} = 3$ in $\sqrt{16} = 4$.« -/
theorem primer_16 : √(√(16:ℝ)) = koren 4 16 ∧ koren 4 16 = 2 := by
  have h2 : koren 4 16 = 2 := koren_eq (by norm_num) (by norm_num) (by norm_num)
  refine ⟨?_, h2⟩
  rw [h2, sqrt16, sqrt4]

/-- Premisli in Pogoste napake: √9 + √16 = 3 + 4 = 7, √(9 + 16) = √25 = 5, torej √(9 + 16) ≠ √9 + √16.
trditev: MAT-SS-2/koreni#vsota-ni
besedilo: »Ne velja: $\sqrt{9} + \sqrt{16} = 3 + 4 = 7$, $\sqrt{9 + 16} = \sqrt{25} = 5$.« -/
theorem vsota_ni : √(9:ℝ) + √16 = 3 + 4 ∧ (3:ℝ) + 4 = 7 ∧ √((9:ℝ) + 16) = √25 ∧ √(25:ℝ) = 5 ∧
    √((9:ℝ) + 16) ≠ √9 + √16 := by
  refine ⟨by rw [sqrt9, sqrt16], by norm_num, by norm_num, sqrt25, ?_⟩
  rw [show (9:ℝ) + 16 = 25 by norm_num, sqrt25, sqrt9, sqrt16]; norm_num

/-- Premisli in razlaga: za seštevanje pravila ni, √(a + b) = √a + √b ne velja za vse a, b ≥ 0.
trditev: MAT-SS-2/koreni#vsota-ni-pravilo
besedilo: »$\left(\sqrt{a} - \sqrt{b}\right)\left(\sqrt{a} + \sqrt{b}\right) = a - b$« -/
theorem vsota_ni_pravilo : ¬ ∀ a b : ℝ, 0 ≤ a → 0 ≤ b → √(a + b) = √a + √b :=
  fun h => vsota_ni.2.2.2.2 (h 9 16 (by norm_num) (by norm_num))

/-- Premisli: diagonala lista ni 15 + 15 = 30 cm, ampak √(15² + 15²) ≈ 21,2 cm.
trditev: MAT-SS-2/koreni#diagonala-ni-30
besedilo: »Zato tudi diagonala lista ni $15 + 15 = 30\,\text{cm}$, ampak $\sqrt{15^2 + 15^2} \approx 21{,}2\,\text{cm}$.« -/
theorem diagonala_ni_30 : √((15:ℝ) ^ 2 + 15 ^ 2) ≠ 15 + 15 := by
  have := uvod_diagonale; rw [this.1]; intro h; linarith [this.2.2.1]

/-- Ocena korena: 4² = 16, 5² = 25, zato 4 < √20 < 5; 4,4² = 19,36, 4,5² = 20,25, zato 4,4 < √20 < 4,5.
trditev: MAT-SS-2/koreni#ocena-20
besedilo: »Ker je $4{,}4^2 = 19{,}36$ in $4{,}5^2 = 20{,}25$, je še natančneje $4{,}4 < \sqrt{20} < 4{,}5$.« -/
theorem ocena_20 : (4:ℝ) ^ 2 = 16 ∧ (5:ℝ) ^ 2 = 25 ∧ 4 < √(20:ℝ) ∧ √(20:ℝ) < 5 ∧
    (4.4:ℝ) ^ 2 = 19.36 ∧ (4.5:ℝ) ^ 2 = 20.25 ∧ 4.4 < √(20:ℝ) ∧ √(20:ℝ) < 4.5 := by
  obtain ⟨a, b⟩ := koren2_med (x := 20) (lo := 4) (hi := 5) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨c, d⟩ := koren2_med (x := 20) (lo := 4.4) (hi := 4.5) (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  exact ⟨by norm_num, by norm_num, a, b, by norm_num, by norm_num, c, d⟩

/-- Simulacija (številski del): 50 = 25 · 2, √50 = 5√2, približek 7,07 se ujema s 5√2 ≈ 5 · 1,414.
trditev: MAT-SS-2/koreni#sim-50
besedilo: »Opazi, da se približek $7{,}07$ ujema s $5\sqrt{2} \approx 5 \cdot 1{,}414$, saj je $50 = 25 \cdot 2$.« -/
theorem sim_50 : (50:ℝ) = 25 * 2 ∧ √(50:ℝ) = 5 * √2 ∧ 7.065 < 5 * √2 ∧ 5 * √2 < (7.075:ℝ) ∧
    (5:ℝ) * 1.414 = 7.07 := by
  have e : √(50:ℝ) = 5 * √2 := by
    rw [show (50:ℝ) = 5 ^ 2 * 2 by norm_num, Real.sqrt_mul (by norm_num), sqrt_kv (by norm_num)]
  obtain ⟨a, b⟩ := s2
  exact ⟨by norm_num, e, by linarith, by linarith, by norm_num⟩

/-! ## Razlaga 4: istovrstni koreni -/

/-- Razlaga 4 in Primer 1: p√b + q√b = (p + q)√b.
trditev: MAT-SS-2/koreni#istovrstni
besedilo: »$\;p\sqrt{b} + q\sqrt{b} = (p + q)\sqrt{b}$« -/
theorem istovrstni (p q b : ℝ) : p * √b + q * √b = (p + q) * √b := by ring

/-- Razlaga 4: 2√3 + 5√3 = 7√3.
trditev: MAT-SS-2/koreni#istovrstni-primer
besedilo: »$2\sqrt{3} + 5\sqrt{3} = 7\sqrt{3}$« -/
theorem istovrstni_primer : 2 * √3 + 5 * √3 = 7 * √(3:ℝ) := by ring

/-- Razlaga 4 in Pogoste napake: 2√3 + 3√5 = 5√8 ni res.
trditev: MAT-SS-2/koreni#razlicni-koreni
besedilo: »Seštevanje različnih korenov.** $2\sqrt{3} + 3\sqrt{5} = 5\sqrt{8}$ ni res.« -/
theorem razlicni_koreni : 2 * √3 + 3 * √5 ≠ 5 * √(8:ℝ) := by
  obtain ⟨_, a⟩ := s3; obtain ⟨_, b⟩ := s5
  obtain ⟨c, _⟩ := koren2_med (x := 8) (lo := 2.8) (hi := 3) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  intro h; linarith

/-! ## Razlaga 5: delno korenjenje -/

/-- Razlaga 5: √(a² · b) = a√b za a, b ≥ 0.
trditev: MAT-SS-2/koreni#delno-korenjenje
besedilo: »$$\sqrt{a^2 \cdot b} = a\sqrt{b} \quad (a \ge 0,\ b \ge 0).$$« -/
theorem delno_korenjenje {a b : ℝ} (ha : 0 ≤ a) (_hb : 0 ≤ b) : √(a ^ 2 * b) = a * √b := by
  rw [Real.sqrt_mul (sq_nonneg a), Real.sqrt_sq ha]

/-- Predpostavke trditve `delno_korenjenje` se dajo izpolniti. -/
example : (0:ℝ) ≤ 6 ∧ (0:ℝ) ≤ 2 := by norm_num

/-- Predpostavke trditve `delno_korenjenje` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 6 ∧ (0:ℝ) ≤ 2 := by norm_num
  delno_korenjenje (ha := w.1) (_hb := w.2)

/-- Razlaga 5 in Pogoste napake: √72 = √(36 · 2) = 6√2; tudi √72 = 2√18 drži.
trditev: MAT-SS-2/koreni#koren72
besedilo: »Delno korenjenje do polovice.** $\sqrt{72} = 2\sqrt{18}$ drži, a ni končna oblika, ker je v $18$ še popolni kvadrat $9$. Izvleči moraš *največji* popolni kvadrat: $72 = 36 \cdot 2$, zato je $\sqrt{72} = 6\sqrt{2}$.« -/
theorem koren72 : √(72:ℝ) = √(36 * 2) ∧ √((36:ℝ) * 2) = 6 * √2 ∧ √(72:ℝ) = 2 * √18 := by
  have h : √((36:ℝ) * 2) = 6 * √2 := by
    rw [show (36:ℝ) = 6 ^ 2 by norm_num]; exact delno_korenjenje (by norm_num) (by norm_num)
  have h18 : √(18:ℝ) = 3 * √2 := by
    rw [show (18:ℝ) = 3 ^ 2 * 2 by norm_num]; exact delno_korenjenje (by norm_num) (by norm_num)
  refine ⟨by norm_num, h, ?_⟩
  rw [h18, show (72:ℝ) = 36 * 2 by norm_num, h]; ring

/-- Razlaga 5: √(18a³) = √(9a² · 2a) = 3a√(2a) za a ≥ 0.
trditev: MAT-SS-2/koreni#delno-18a3
besedilo: »$\sqrt{18a^3} = \sqrt{9a^2 \cdot 2a} = 3a\sqrt{2a}$ za $a \ge 0$.« -/
theorem delno_18a3 {a : ℝ} (ha : 0 ≤ a) : √(18 * a ^ 3) = √(9 * a ^ 2 * (2 * a)) ∧
    √(9 * a ^ 2 * (2 * a)) = 3 * a * √(2 * a) := by
  refine ⟨by ring_nf, ?_⟩
  rw [show 9 * a ^ 2 * (2 * a) = (3 * a) ^ 2 * (2 * a) by ring]
  exact delno_korenjenje (by positivity) (by positivity)

/-- Predpostavke trditve `delno_18a3` se dajo izpolniti. -/
example : (0:ℝ) ≤ 1 := by norm_num

/-- Predpostavke trditve `delno_18a3` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 1 := by norm_num
  delno_18a3 (ha := w)

/-- Razlaga 5 in Korak za korakom: ∛54 = ∛(27 · 2) = 3∛2 ≈ 3,78.
trditev: MAT-SS-2/koreni#kub54
besedilo: »Kubični koren $\sqrt[3]{54}$.** Najdemo popolni kub: $54 = 27 \cdot 2$, zato je $\sqrt[3]{54} = 3\sqrt[3]{2} \approx 3{,}78$.« -/
theorem kub54 : koren 3 54 = koren 3 (27 * 2) ∧ koren 3 ((27:ℝ) * 2) = 3 * koren 3 2 ∧
    3.775 < 3 * koren 3 2 ∧ 3 * koren 3 2 < (3.785:ℝ) := by
  have h27 : koren 3 27 = 3 := koren_eq (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨a, b⟩ := koren_med (n := 3) (a := 2) (lo := 1.2599) (hi := 1.26) (by norm_num) (by norm_num)
    (by norm_num) (by norm_num) (by norm_num)
  refine ⟨by norm_num, by rw [koren_n_produkta 3 (by norm_num) (by norm_num), h27], by linarith, by linarith⟩

/-- Razlaga 5: obratno, 3√2 = √(9 · 2) = √18 (faktor 3 ≥ 0 vnesemo pod koren).
trditev: MAT-SS-2/koreni#vnos-pod-koren
besedilo: »Obratno, faktor lahko vnesemo pod koren: $3\sqrt{2} = \sqrt{9 \cdot 2} = \sqrt{18}$ (če faktor ni negativen).« -/
theorem vnos_pod_koren : 3 * √2 = √((9:ℝ) * 2) ∧ √((9:ℝ) * 2) = √18 := by
  refine ⟨?_, by norm_num⟩
  rw [show (9:ℝ) = 3 ^ 2 by norm_num, delno_korenjenje (by norm_num) (by norm_num)]

/-! ## Razlaga 6: racionalizacija -/

/-- Razlaga 6: a/√b = a√b/(√b · √b) = a√b/b za b > 0.
trditev: MAT-SS-2/koreni#racionalizacija
besedilo: »$\dfrac{a}{\sqrt{b}} = \dfrac{a \cdot \sqrt{b}}{\sqrt{b} \cdot \sqrt{b}} = \dfrac{a\sqrt{b}}{b}$« -/
theorem racionalizacija (a : ℝ) {b : ℝ} (hb : 0 < b) :
    a / √b = a * √b / (√b * √b) ∧ a * √b / (√b * √b) = a * √b / b := by
  have hne : √b ≠ 0 := (Real.sqrt_pos.mpr hb).ne'
  exact ⟨(mul_div_mul_right a (√b) hne).symm, by rw [Real.mul_self_sqrt hb.le]⟩

/-- Predpostavke trditve `racionalizacija` se dajo izpolniti. -/
example : (0:ℝ) < 3 := by norm_num

/-- Predpostavke trditve `racionalizacija` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 3 := by norm_num
  racionalizacija (hb := w)

/-- Razlaga 6 (konjugirani izraz): (√a + √b)(√a − √b) = a − b za a, b ≥ 0; Bolj natančno:
(u − v)(u + v) = u² − v².
trditev: MAT-SS-2/koreni#konjugirani
besedilo: »Zakaj konjugirani izraz deluje?** Pri produktu $(u - v)(u + v)$ se mešana člena uničita in ostane $u^2 - v^2$. Če vstavimo $u = \sqrt{a}$ in $v = \sqrt{b}$, kvadrata korenov izgineta in ostane racionalno število $a - b$.« -/
theorem konjugirani {a b : ℝ} (ha : 0 ≤ a) (hb : 0 ≤ b) : (√a + √b) * (√a - √b) = a - b := by
  linear_combination (Real.sq_sqrt ha) - (Real.sq_sqrt hb)

/-- Predpostavke trditve `konjugirani` se dajo izpolniti. -/
example : (0:ℝ) ≤ 7 ∧ (0:ℝ) ≤ 2 := by norm_num

/-- Predpostavke trditve `konjugirani` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 7 ∧ (0:ℝ) ≤ 2 := by norm_num
  konjugirani (ha := w.1) (hb := w.2)

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem razlika_kvadratov (u v : ℝ) : (u - v) * (u + v) = u ^ 2 - v ^ 2 := by ring

/-- Razlaga 6: 1/(√a − √b) = (√a + √b)/(a − b) za a, b ≥ 0, a ≠ b.
trditev: MAT-SS-2/koreni#racionalizacija-razlike
besedilo: »Tako je $\dfrac{1}{\sqrt{a} - \sqrt{b}} = \dfrac{\sqrt{a} + \sqrt{b}}{a - b}$ za $a \ne b$.« -/
theorem racionalizacija_razlike {a b : ℝ} (ha : 0 ≤ a) (hb : 0 ≤ b) (hab : a ≠ b) :
    1 / (√a - √b) = (√a + √b) / (a - b) := by
  have hne : √a - √b ≠ 0 := by
    intro h; exact hab ((Real.sqrt_inj ha hb).mp (sub_eq_zero.mp h))
  rw [div_eq_div_iff hne (sub_ne_zero.mpr hab), ← konjugirani ha hb]; ring

/-- Predpostavke trditve `racionalizacija_razlike` se dajo izpolniti. -/
example : (0:ℝ) ≤ 5 ∧ (0:ℝ) ≤ 2 ∧ (5:ℝ) ≠ 2 := by norm_num

/-- Predpostavke trditve `racionalizacija_razlike` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 5 ∧ (0:ℝ) ≤ 2 ∧ (5:ℝ) ≠ 2 := by norm_num
  racionalizacija_razlike (ha := w.1) (hb := w.2.1) (hab := w.2.2)

/-- Razlaga 6: 3/(2 + √3) = 3(2 − √3)/(4 − 3) = 6 − 3√3; preverjanje 3/3,732 ≈ 0,804 in 6 − 5,196 = 0,804
(6 − 3√3 ≈ 0,804).
trditev: MAT-SS-2/koreni#racionalizacija-2-3
besedilo: »Preverjanje: leva stran je $\dfrac{3}{3{,}732} \approx 0{,}804$, desna $6 - 5{,}196 = 0{,}804$.« -/
theorem racionalizacija_2_3 : 3 / (2 + √3) = 3 * (2 - √3) / (4 - 3) ∧ 3 * (2 - √(3:ℝ)) / (4 - 3) = 6 - 3 * √3 ∧
    0.8035 < (3:ℝ) / 3.732 ∧ (3:ℝ) / 3.732 < 0.8045 ∧ (6:ℝ) - 5.196 = 0.804 ∧
    0.8035 < 6 - 3 * √(3:ℝ) ∧ 6 - 3 * √(3:ℝ) < 0.8045 := by
  have hp : 0 < 2 + √(3:ℝ) := by positivity
  obtain ⟨a, b⟩ := s3
  refine ⟨?_, by ring, by norm_num, by norm_num, by norm_num, by linarith, by linarith⟩
  rw [div_eq_div_iff hp.ne' (by norm_num)]
  linear_combination 3 * sq3

/-- Premisli (racionalizacija kubičnega korena): 1/∛2 = ∛4/2, ker je ∛2 · ∛4 = 2; ∛2 · ∛2 = ∛4.
trditev: MAT-SS-2/koreni#racionalizacija-kub
besedilo: »S $\sqrt[3]{4}$, ker je $\sqrt[3]{2} \cdot \sqrt[3]{4} = \sqrt[3]{8} = 2$. Torej je $\dfrac{1}{\sqrt[3]{2}} = \dfrac{\sqrt[3]{4}}{2}$. Razširitev s $\sqrt[3]{2}$ ne zadošča, ker je $\sqrt[3]{2} \cdot \sqrt[3]{2} = \sqrt[3]{4}$ še vedno koren.« -/
theorem racionalizacija_kub : 1 / koren 3 2 = koren 3 4 / 2 ∧ koren 3 2 * koren 3 2 = koren 3 4 := by
  obtain ⟨h1, h2⟩ := primer_kub_2_4
  have hpos : 0 < koren 3 2 := by
    have := (koren_med (n := 3) (a := 2) (lo := 1) (hi := 2) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)).1
    linarith
  refine ⟨?_, ?_⟩
  · rw [div_eq_div_iff hpos.ne' (by norm_num)]; rw [h2] at h1; linarith
  · rw [← koren_n_produkta 3 (by norm_num) (by norm_num)]; norm_num

/-- Razlaga 4 (racionalizacija): ∛4 je še vedno koren: 1 < ∛4 < 2, zato ∛4 ni celo število, in ker je (∛4)³ = 4,
je ∛4 iracionalen.
trditev: MAT-SS-2/koreni#kub4-iracionalen
besedilo: »ker je $\sqrt[3]{2} \cdot \sqrt[3]{2} = \sqrt[3]{4}$ še vedno koren.« -/
theorem kub4_iracionalen : 1 < koren 3 4 ∧ koren 3 4 < 2 ∧ Irrational (koren 3 4) := by
  obtain ⟨a, b⟩ := koren_med (n := 3) (a := 4) (lo := 1) (hi := 2) (by norm_num) (by norm_num) (by norm_num)
    (by norm_num) (by norm_num)
  refine ⟨a, b, irrational_nrt_of_notint_nrt 3 4 (by rw [koren_pot (by norm_num) (by norm_num)]; norm_num) ?_
    (by norm_num)⟩
  rintro ⟨y, hy⟩
  rw [hy] at a b
  have h1 : (1:ℤ) < y := by exact_mod_cast a
  have h2 : y < (2:ℤ) := by exact_mod_cast b
  omega

/-! ## Razlaga 7: iracionalnost in konstrukcija korenov -/

/-- Razlaga 7: kvadratni koren naravnega števila, ki ni popolni kvadrat, je iracionalen.
trditev: MAT-SS-2/koreni#iracionalen
besedilo: »Konstrukcija kvadratnih korenov.** Kvadratni koren naravnega števila, ki ni popolni kvadrat, je iracionalen: $\sqrt{2}$, $\sqrt{3}$, $\sqrt{5}$, $\sqrt{13}$ (dokaz je podoben kot za $\sqrt{2}$ v razdelku »Bolj natančno«).« -/
theorem iracionalen (n : ℕ) (h : ¬ IsSquare n) : Irrational (√(n:ℝ)) := irrational_sqrt_natCast_iff.mpr h

/-- Predpostavke trditve `iracionalen` se dajo izpolniti. -/
example : ¬ IsSquare (2:ℕ) := Nat.prime_two.not_isSquare

/-- Predpostavke trditve `iracionalen` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ¬ IsSquare (2:ℕ) := Nat.prime_two.not_isSquare
  iracionalen (h := w)

/-- Razlaga 7, Ustno vprašanje 3, Bolj natančno: √2, √3, √5 in √13 so iracionalni.
trditev: MAT-SS-2/koreni#iracionalni
besedilo: »Konstrukcija kvadratnih korenov.** Kvadratni koren naravnega števila, ki ni popolni kvadrat, je iracionalen: $\sqrt{2}$, $\sqrt{3}$, $\sqrt{5}$, $\sqrt{13}$ (dokaz je podoben kot za $\sqrt{2}$ v razdelku »Bolj natančno«).« -/
theorem iracionalni : Irrational √(2:ℝ) ∧ Irrational √(3:ℝ) ∧ Irrational √(5:ℝ) ∧ Irrational √(13:ℝ) := by
  refine ⟨irrational_sqrt_two, ?_, ?_, ?_⟩
  · simpa using Nat.prime_three.irrational_sqrt
  · simpa using Nat.prime_five.irrational_sqrt
  · simpa using (show Nat.Prime 13 by norm_num).irrational_sqrt

/-- Razlaga 7: decimalke iracionalnega števila se nikoli ne končajo: ni oblike m / 10ᵏ (končen decimalni zapis).
trditev: MAT-SS-2/koreni#decimalke-ne-koncajo
besedilo: »Njihove decimalke se nikoli ne končajo,« -/
theorem decimalke_ne_koncajo {x : ℝ} (hx : Irrational x) (m : ℤ) (k : ℕ) : x ≠ m / 10 ^ k := by
  have := hx.ne_rat ((m : ℚ) / 10 ^ k); push_cast at this; exact this

/-- Predpostavke trditve `decimalke_ne_koncajo` se dajo izpolniti. -/
example : Irrational √(2:ℝ) := irrational_sqrt_two

/-- Predpostavke trditve `decimalke_ne_koncajo` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Irrational √(2:ℝ) := irrational_sqrt_two
  decimalke_ne_koncajo (hx := w)

/-- Razlaga 7: decimalke √2, √3, √5 in √13 se nikoli ne končajo.
trditev: MAT-SS-2/koreni#decimalke-korenov
besedilo: »Konstrukcija kvadratnih korenov.** Kvadratni koren naravnega števila, ki ni popolni kvadrat, je iracionalen: $\sqrt{2}$, $\sqrt{3}$, $\sqrt{5}$, $\sqrt{13}$ (dokaz je podoben kot za $\sqrt{2}$ v razdelku »Bolj natančno«).« -/
theorem decimalke_korenov (m : ℤ) (k : ℕ) : √(2:ℝ) ≠ m / 10 ^ k ∧ √(3:ℝ) ≠ m / 10 ^ k ∧ √(5:ℝ) ≠ m / 10 ^ k ∧
    √(13:ℝ) ≠ m / 10 ^ k :=
  ⟨decimalke_ne_koncajo iracionalni.1 m k, decimalke_ne_koncajo iracionalni.2.1 m k,
    decimalke_ne_koncajo iracionalni.2.2.1 m k, decimalke_ne_koncajo iracionalni.2.2.2 m k⟩

/-- Ustno vprašanje 3 (koraki dokaza): iz p² = 2q² sledi, da je p sod; p = 2r da q² = 2r², torej je sod tudi q.
trditev: MAT-SS-2/koreni#dokaz-koraki
besedilo: »Zapišemo $p = 2r$ in dobimo $4r^2 = 2q^2$,« -/
theorem dokaz_koraki (p q : ℤ) (h : p ^ 2 = 2 * q ^ 2) : Even p ∧ Even q := by
  have hp : Even p := by
    have : Even (p ^ 2) := ⟨q ^ 2, by rw [h]; ring⟩
    exact (Int.even_pow.mp this).1
  obtain ⟨r, hr⟩ := hp
  have hq2 : q ^ 2 = 2 * r ^ 2 := by rw [hr] at h; linarith
  exact ⟨⟨r, hr⟩, (Int.even_pow.mp ⟨r ^ 2, by rw [hq2]; ring⟩).1⟩

/-- Predpostavke trditve `dokaz_koraki` se dajo izpolniti. -/
example : (0:ℤ) ^ 2 = 2 * 0 ^ 2 := by norm_num

/-- Predpostavke trditve `dokaz_koraki` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℤ) ^ 2 = 2 * 0 ^ 2 := by norm_num
  dokaz_koraki (h := w)

/-- Razlaga 7 (koren kot hipotenuza): kateti 1 in 1 dasta √2, 1 in 2 dasta √5, 2 in 3 dasta √13.
trditev: MAT-SS-2/koreni#hipotenuze
besedilo: »Koren kot hipotenuza.** Kateti $p$ in $q$ dasta hipotenuzo $\sqrt{p^2 + q^2}$. Kateti $1$ in $1$ dasta $\sqrt{2}$, kateti $1$ in $2$ dasta $\sqrt{5}$, kateti $2$ in $3$ dasta $\sqrt{13}$.« -/
theorem hipotenuze : √((1:ℝ) ^ 2 + 1 ^ 2) = √2 ∧ √((1:ℝ) ^ 2 + 2 ^ 2) = √5 ∧ √((2:ℝ) ^ 2 + 3 ^ 2) = √13 := by
  norm_num

/-- Razlaga 7 (spirala): na hipotenuzo √n postavimo kateto 1, nova hipotenuza je √((√n)² + 1²) = √(n + 1);
po vrsti √2, √3, √4 = 2, √5.
trditev: MAT-SS-2/koreni#spirala
besedilo: »Spirala.** Na hipotenuzo $\sqrt{n}$ postavimo pravokotno kateto $1$. Nova hipotenuza je $\sqrt{n + 1}$, saj je $\left(\sqrt{n}\right)^2 + 1^2 = n + 1$. Tako dobimo po vrsti $\sqrt{2}$, $\sqrt{3}$, $\sqrt{4} = 2$, $\sqrt{5}$ in naprej (risba).« -/
theorem spirala (n : ℝ) (hn : 0 ≤ n) : √(√n ^ 2 + 1 ^ 2) = √(n + 1) := by rw [Real.sq_sqrt hn]; ring_nf

/-- Predpostavke trditve `spirala` se dajo izpolniti. -/
example : (0:ℝ) ≤ 1 := by norm_num

/-- Predpostavke trditve `spirala` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 1 := by norm_num
  spirala (hn := w)

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem spirala_prvi : √(4:ℝ) = 2 := sqrt4

/-- Razlaga 7 (koren kot kateta): hipotenuza 2 in kateta 1 dasta √(2² − 1²) = √3.
trditev: MAT-SS-2/koreni#kateta-3
besedilo: »Koren kot kateta.** Hipotenuza $h$ in kateta $p$ dasta drugo kateto $\sqrt{h^2 - p^2}$. Hipotenuza $2$ in kateta $1$ dasta $\sqrt{3}$.« -/
theorem kateta_3 : √((2:ℝ) ^ 2 - 1 ^ 2) = √3 := by norm_num

/-- Razlaga 7: točka √5 leži med 2 in 3.
trditev: MAT-SS-2/koreni#sqrt5-med
besedilo: »Tako dobimo točko $\sqrt{5}$ med $2$ in $3$,« -/
theorem sqrt5_med : 2 < √(5:ℝ) ∧ √(5:ℝ) < 3 := by obtain ⟨a, b⟩ := s5; constructor <;> linarith

/-! ## Razlaga 8: kubični in n-ti koreni -/

/-- Razlaga 8: kubi 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000 so tretje potence števil 1, …, 10.
trditev: MAT-SS-2/koreni#kubi
besedilo: »Zapomni si kube $1$, $8$, $27$, $64$, $125$, $216$, $343$, $512$, $729$, $1000$.« -/
theorem kubi : ((List.range 10).map fun k => (k + 1) ^ 3) = [1, 8, 27, 64, 125, 216, 343, 512, 729, 1000] := by
  decide

/-- Razlaga 8: ∛343 = 7, ∛(−64) = −4, ∛0,008 = 0,2 (ker 0,2³ = 0,008), ∛(27/125) = 3/5.
trditev: MAT-SS-2/koreni#kubicni-na-pamet
besedilo: »Z njimi je $\sqrt[3]{343} = 7$, $\sqrt[3]{-64} = -4$, $\sqrt[3]{0{,}008} = 0{,}2$ (ker je $0{,}2^3 = 0{,}008$) in $\sqrt[3]{\dfrac{27}{125}} = \dfrac{3}{5}$.« -/
theorem kubicni_na_pamet : koren 3 343 = 7 ∧ koren 3 (-64) = -4 ∧ (0.2:ℝ) ^ 3 = 0.008 ∧
    koren 3 0.008 = 0.2 ∧ koren 3 (27 / 125) = 3 / 5 := by
  refine ⟨koren_eq (by norm_num) (by norm_num) (by norm_num),
    ((koren_lih ⟨1, rfl⟩ (-64) (-4)).mp (by norm_num)).symm, by norm_num,
    koren_eq (by norm_num) (by norm_num) (by norm_num), koren_eq (by norm_num) (by norm_num) (by norm_num)⟩

/-- Razlaga 8: ∛50 ≈ 3,684, ⁵√200 ≈ 2,885; brez oklepaja računalo izračuna 200¹ : 5 = 40.
trditev: MAT-SS-2/koreni#racunalo
besedilo: »Oklepaj je nujen, brez njega računalo izračuna $200^1 : 5 = 40$.« -/
theorem racunalo : 3.6835 < koren 3 50 ∧ koren 3 50 < 3.6845 ∧ 2.8845 < koren 5 200 ∧ koren 5 200 < 2.8855 ∧
    (200:ℝ) ^ 1 / 5 = 40 := by
  obtain ⟨a, b⟩ := koren_med (n := 3) (a := 50) (lo := 3.6835) (hi := 3.6845) (by norm_num) (by norm_num)
    (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨c, d⟩ := koren_med (n := 5) (a := 200) (lo := 2.8845) (hi := 2.8855) (by norm_num) (by norm_num)
    (by norm_num) (by norm_num) (by norm_num)
  exact ⟨a, b, c, d, by norm_num⟩

/-- Razlaga 8: aⁿ^(1/n) = ⁿ√a za a ≥ 0 (potenca z eksponentom 1/n).
trditev: MAT-SS-2/koreni#potenca-1-n
besedilo: »potenca z eksponentom $\frac{1}{n}$ (velja $a^{\frac{1}{n}} = \sqrt[n]{a}$,« -/
theorem potenca_1_n {n : ℕ} {a : ℝ} (ha : 0 ≤ a) : a ^ ((1:ℝ) / n) = koren n a := by
  simp only [koren, ha, ↓reduceIte, one_div]

/-- Predpostavke trditve `potenca_1_n` se dajo izpolniti. -/
example : (0:ℝ) ≤ 200 := by norm_num

/-- Predpostavke trditve `potenca_1_n` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 200 := by norm_num
  potenca_1_n (ha := w)

/-- Razlaga 8 in Primer 6 b): ∛(−20) = −∛20 ≈ −2,714.
trditev: MAT-SS-2/koreni#kub-m20
besedilo: »$\sqrt[3]{-20} \approx -2{,}714$.« -/
theorem kub_m20 : koren 3 (-20) = -koren 3 20 ∧ -2.7145 < koren 3 (-20) ∧ koren 3 (-20) < -2.7135 := by
  have e : koren 3 (-20) = -koren 3 20 := by
    simp only [koren]; norm_num
  obtain ⟨a, b⟩ := koren_med (n := 3) (a := 20) (lo := 2.7135) (hi := 2.7145) (by norm_num) (by norm_num)
    (by norm_num) (by norm_num) (by norm_num)
  exact ⟨e, by rw [e]; linarith, by rw [e]; linarith⟩

/-- Razlaga 8: sodi koren negativnega števila ni realen (npr. ni realnega b z b² = −20).
trditev: MAT-SS-2/koreni#sodi-negativen
besedilo: »Lihi koren negativnega števila je realen: $\sqrt[3]{-20} \approx -2{,}714$. Nekatera računala pri potenci $(-20)^{1/3}$ javijo napako, tedaj izračunaš $-\sqrt[3]{20}$. Sodi koren negativnega števila računalo zavrne z napako, ker ni realen.« -/
theorem sodi_negativen : ¬ ∃ b : ℝ, b ^ 2 = -20 := enacba_sod_neg even_two (by norm_num)

/-- Razlaga 8: preverjanje 3,684³ ≈ 50,0 in ocena 27 < 50 < 64, zato je 3 < ∛50 < 4.
trditev: MAT-SS-2/koreni#preverjanje-50
besedilo: »Rezultat računala vedno preveri: s potenciranjem ($3{,}684^3 \approx 50{,}0$) in z oceno ($27 < 50 < 64$, zato je $\sqrt[3]{50}$ med $3$ in $4$).« -/
theorem preverjanje_50 : 49.95 < (3.684:ℝ) ^ 3 ∧ (3.684:ℝ) ^ 3 < 50.05 ∧ 3 < koren 3 50 ∧ koren 3 50 < 4 :=
  ⟨by norm_num, by norm_num, koren_med (by norm_num) (by norm_num) (by norm_num) (by norm_num) (by norm_num)⟩

/-! ## Rešeni primeri -/

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem sqrt50 : √(50:ℝ) = √(25 * 2) ∧ √((25:ℝ) * 2) = 5 * √2 := by
  refine ⟨by norm_num, ?_⟩
  rw [show (25:ℝ) = 5 ^ 2 by norm_num]; exact delno_korenjenje (by norm_num) (by norm_num)

/-- Primer 1: √50 + √18 − √8 = 5√2 + 3√2 − 2√2 = (5 + 3 − 2)√2 = 6√2 (delno korenjenje: √50 = √(25 · 2),
√18 = √(9 · 2), √8 = √(4 · 2)).
trditev: MAT-SS-2/koreni#primer1
besedilo: »Vsak koren delno korenimo: $\sqrt{50} = \sqrt{25 \cdot 2} = 5\sqrt{2}$, $\sqrt{18} = \sqrt{9 \cdot 2} = 3\sqrt{2}$, $\sqrt{8} = \sqrt{4 \cdot 2} = 2\sqrt{2}$.« -/
theorem primer1 : √(50:ℝ) + √18 - √8 = 6 * √2 := by
  have h50 : √(50:ℝ) = 5 * √2 := by rw [show (50:ℝ) = 5 ^ 2 * 2 by norm_num]; exact delno_korenjenje (by norm_num) (by norm_num)
  have h18 : √(18:ℝ) = 3 * √2 := by rw [show (18:ℝ) = 3 ^ 2 * 2 by norm_num]; exact delno_korenjenje (by norm_num) (by norm_num)
  have h8 : √(8:ℝ) = 2 * √2 := by rw [show (8:ℝ) = 2 ^ 2 * 2 by norm_num]; exact delno_korenjenje (by norm_num) (by norm_num)
  calc √(50:ℝ) + √18 - √8 = 5 * √2 + 3 * √2 - 2 * √2 := by rw [h50, h18, h8]
    _ = (5 + 3 - 2) * √2 := by ring
    _ = 6 * √2 := by norm_num

/-- Primer 1, preverjanje: √50 ≈ 7,0711, √18 ≈ 4,2426, √8 ≈ 2,8284, 7,0711 + 4,2426 − 2,8284 = 8,4853 in
6√2 ≈ 8,4853.
trditev: MAT-SS-2/koreni#primer1-preverjanje
besedilo: »Preverjanje: $\sqrt{50} + \sqrt{18} - \sqrt{8} \approx 7{,}0711 + 4{,}2426 - 2{,}8284 = 8{,}4853$ in $6\sqrt{2} \approx 8{,}4853$.« -/
theorem primer1_preverjanje :
    7.07105 < √(50:ℝ) ∧ √(50:ℝ) < 7.07115 ∧ 4.24255 < √(18:ℝ) ∧ √(18:ℝ) < 4.24265 ∧
    2.82835 < √(8:ℝ) ∧ √(8:ℝ) < 2.82845 ∧ (7.0711:ℝ) + 4.2426 - 2.8284 = 8.4853 ∧
    8.48525 < 6 * √(2:ℝ) ∧ 6 * √(2:ℝ) < 8.48535 := by
  obtain ⟨a, b⟩ := koren2_med (x := 50) (lo := 7.07105) (hi := 7.07115) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨c, d⟩ := koren2_med (x := 18) (lo := 4.24255) (hi := 4.24265) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨e, f⟩ := koren2_med (x := 8) (lo := 2.82835) (hi := 2.82845) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨g, h⟩ := s2
  exact ⟨a, b, c, d, e, f, by norm_num, by linarith, by linarith⟩

/-- Primer 2 a): 6/√3 = 6√3/(√3 · √3) = 6√3/3 = 2√3.
trditev: MAT-SS-2/koreni#primer2a
besedilo: »a) Razširimo s $\sqrt{3}$: $\dfrac{6}{\sqrt{3}} = \dfrac{6\sqrt{3}}{\sqrt{3} \cdot \sqrt{3}} = \dfrac{6\sqrt{3}}{3} = 2\sqrt{3}$.« -/
theorem primer2a : 6 / √(3:ℝ) = 2 * √3 := by
  obtain ⟨h1, h2⟩ := racionalizacija 6 (b := 3) (by norm_num)
  calc 6 / √(3:ℝ) = 6 * √3 / (√3 * √3) := h1
    _ = 6 * √3 / 3 := h2
    _ = 2 * √3 := by ring

/-- Primer 2 b): 10/(√7 − √2) · (√7 + √2)/(√7 + √2) = 10(√7 + √2)/(7 − 2) = 10(√7 + √2)/5 = 2(√7 + √2)
= 2√7 + 2√2.
trditev: MAT-SS-2/koreni#primer2b
besedilo: »Imenovalec je $7 - 2 = 5$, zato je rezultat $\dfrac{10\left(\sqrt{7} + \sqrt{2}\right)}{5} = 2\left(\sqrt{7} + \sqrt{2}\right) = 2\sqrt{7} + 2\sqrt{2}$.« -/
theorem primer2b : 10 / (√7 - √(2:ℝ)) = 2 * √7 + 2 * √2 := by
  have hp : √7 + √(2:ℝ) ≠ 0 := by positivity
  have hk : (√7 - √(2:ℝ)) * (√7 + √2) = 7 - 2 := by
    rw [mul_comm]; exact konjugirani (by norm_num) (by norm_num)
  calc 10 / (√7 - √(2:ℝ)) = 10 / (√7 - √2) * ((√7 + √2) / (√7 + √2)) := by rw [div_self hp, mul_one]
    _ = 10 * (√7 + √2) / (7 - 2) := by rw [div_mul_div_comm, hk]
    _ = 10 * (√7 + √2) / 5 := by norm_num
    _ = 2 * (√7 + √2) := by ring
    _ = 2 * √7 + 2 * √2 := by ring

/-- Primer 2, preverjanje: 10/(2,6458 − 1,4142) ≈ 8,120 in 2 · 2,6458 + 2 · 1,4142 ≈ 8,120 (tudi točna
vrednost 2√7 + 2√2 ≈ 8,120).
trditev: MAT-SS-2/koreni#primer2-preverjanje
besedilo: »Preverjanje: $\dfrac{10}{2{,}6458 - 1{,}4142} \approx 8{,}120$ in $2 \cdot 2{,}6458 + 2 \cdot 1{,}4142 \approx 8{,}120$.« -/
theorem primer2_preverjanje : 8.1195 < (10:ℝ) / (2.6458 - 1.4142) ∧ (10:ℝ) / (2.6458 - 1.4142) < 8.1205 ∧
    (2:ℝ) * 2.6458 + 2 * 1.4142 = 8.12 ∧ 8.1195 < 2 * √7 + 2 * √(2:ℝ) ∧ 2 * √7 + 2 * √(2:ℝ) < 8.1205 := by
  obtain ⟨a, b⟩ := s7; obtain ⟨c, d⟩ := s2
  exact ⟨by norm_num, by norm_num, by norm_num, by linarith, by linarith⟩

/-- Primer 3: stranica s = √50 = √(25 · 2) = 5√2 ≈ 7,07; število ploščic 100/(5√2) = 20/√2 = 20√2/2 = 10√2
≈ 14,14; celih ploščic je ⌊10√2⌋ = 14; zasedejo 14 · 5√2 = 70√2 ≈ 98,99 cm; ostane 100 − 70√2 ≈ 1,01 cm
(približno 1 cm).
trditev: MAT-SS-2/koreni#primer3
besedilo: »Celih ploščic je $14$. Zasedejo $14 \cdot 5\sqrt{2} = 70\sqrt{2} \approx 98{,}99\,\text{cm}$.« -/
theorem primer3 :
    √(50:ℝ) = 5 * √2 ∧ 7.065 < 5 * √(2:ℝ) ∧ 5 * √(2:ℝ) < 7.075 ∧
    100 / (5 * √(2:ℝ)) = 20 / √2 ∧ 20 / √(2:ℝ) = 20 * √2 / 2 ∧ 20 * √(2:ℝ) / 2 = 10 * √2 ∧
    14.135 < 10 * √(2:ℝ) ∧ 10 * √(2:ℝ) < 14.145 ∧ ⌊10 * √(2:ℝ)⌋ = 14 ∧
    14 * (5 * √(2:ℝ)) = 70 * √2 ∧ 98.985 < 70 * √(2:ℝ) ∧ 70 * √(2:ℝ) < 98.995 ∧
    1.005 < 100 - 70 * √(2:ℝ) ∧ 100 - 70 * √(2:ℝ) < 1.015 := by
  have hne : √(2:ℝ) ≠ 0 := by positivity
  obtain ⟨a, b⟩ := s2
  have hfl : ⌊10 * √(2:ℝ)⌋ = 14 := by
    rw [Int.floor_eq_iff]; constructor <;> push_cast <;> linarith
  refine ⟨sqrt50.2 ▸ sqrt50.1, by linarith, by linarith, ?_, ?_, ?_, by linarith, by linarith, hfl, by ring,
    by linarith, by linarith, by linarith, by linarith⟩
  · field_simp; ring
  · rw [div_eq_div_iff hne (by norm_num)]; linear_combination (-20) * sq2
  · ring

/-- Primer 4: prvi ulomek (√3 + √2)/(√3 − √2) razširimo s √3 + √2: imenovalec 3 − 2 = 1, števec
(√3 + √2)² = 3 + 2√6 + 2 = 5 + 2√6.
trditev: MAT-SS-2/koreni#primer4-prvi
besedilo: »Prvi ulomek razširimo s $\sqrt{3} + \sqrt{2}$: imenovalec je $3 - 2 = 1$, števec pa $\left(\sqrt{3} + \sqrt{2}\right)^2 = 3 + 2\sqrt{6} + 2 = 5 + 2\sqrt{6}$.« -/
theorem primer4_prvi : (√3 + √2) / (√3 - √(2:ℝ)) = (√3 + √2) * (√3 + √2) / ((√3 - √2) * (√3 + √2)) ∧
    (√3 - √(2:ℝ)) * (√3 + √2) = 3 - 2 ∧ (√3 + √(2:ℝ)) ^ 2 = 3 + 2 * √6 + 2 ∧
    (√3 + √(2:ℝ)) / (√3 - √2) = 5 + 2 * √6 := by
  have hp : √3 + √(2:ℝ) ≠ 0 := by positivity
  have h6 : √(3:ℝ) * √2 = √6 := by rw [← Real.sqrt_mul (by norm_num)]; norm_num
  have hk : (√3 - √(2:ℝ)) * (√3 + √2) = 3 - 2 := by rw [mul_comm]; exact konjugirani (by norm_num) (by norm_num)
  have hs : (√3 + √(2:ℝ)) ^ 2 = 3 + 2 * √6 + 2 := by linear_combination sq3 + sq2 + 2 * h6
  have e1 := (mul_div_mul_right (√3 + √(2:ℝ)) (√3 - √2) hp).symm
  refine ⟨e1, hk, hs, ?_⟩
  rw [e1, hk, ← sq, hs]; ring

/-- Primer 4 (premisli): drugi ulomek je (√3 − √2)² /(3 − 2) = 3 − 2√6 + 2 = 5 − 2√6, razlika
(5 + 2√6) − (5 − 2√6) = 4√6; preverjanje 9,899 − 0,101 = 9,798 ≈ 4√6.
trditev: MAT-SS-2/koreni#primer4
besedilo: »Preverjanje: prvi ulomek je približno $9{,}899$, drugi $0{,}101$, razlika $9{,}798$, in $4\sqrt{6} \approx 9{,}798$.« -/
theorem primer4 : (√3 - √(2:ℝ)) / (√3 + √2) = 5 - 2 * √6 ∧
    (√3 + √(2:ℝ)) / (√3 - √2) - (√3 - √2) / (√3 + √2) = 4 * √6 ∧
    9.8985 < 5 + 2 * √(6:ℝ) ∧ 5 + 2 * √(6:ℝ) < 9.8995 ∧ 0.1005 < 5 - 2 * √(6:ℝ) ∧ 5 - 2 * √(6:ℝ) < 0.1015 ∧
    (9.899:ℝ) - 0.101 = 9.798 ∧ 9.7975 < 4 * √(6:ℝ) ∧ 4 * √(6:ℝ) < 9.7985 := by
  have hp : √3 + √(2:ℝ) ≠ 0 := by positivity
  have h6 : √(3:ℝ) * √2 = √6 := by rw [← Real.sqrt_mul (by norm_num)]; norm_num
  have hk : (√3 + √(2:ℝ)) * (√3 - √2) = 3 - 2 := konjugirani (by norm_num) (by norm_num)
  have h2 : (√3 - √(2:ℝ)) / (√3 + √2) = 5 - 2 * √6 := by
    rw [← mul_div_mul_right (√3 - √(2:ℝ)) (√3 + √2) (sub_ne_zero.mpr ?_), hk]
    · linear_combination sq3 + sq2 - 2 * h6
    · intro h; have := (Real.sqrt_inj (by norm_num) (by norm_num)).mp h; norm_num at this
  obtain ⟨a, b⟩ := s6
  refine ⟨h2, by rw [primer4_prvi.2.2.2, h2]; ring, by linarith, by linarith, by linarith, by linarith,
    by norm_num, by linarith, by linarith⟩

/-- Primer 5: 13 = 4 + 9 = 2² + 3², √(2² + 3²) = √13 ≈ 3,61; 7 = 16 − 9 = 4² − 3², √(16 − 9) = √7 ≈ 2,65;
izmerjeno približno 3,6 cm in 2,6 cm.
trditev: MAT-SS-2/koreni#primer5
besedilo: »Odgovor: $\sqrt{13}$ je hipotenuza trikotnika s katetama $2$ in $3$, $\sqrt{7}$ je kateta trikotnika s hipotenuzo $4$ in kateto $3$ (v centimetrih). Z ravnilom izmeriš približno $3{,}6\,\text{cm}$ in $2{,}6\,\text{cm}$.« -/
theorem primer5 : (13:ℝ) = 4 + 9 ∧ (4:ℝ) + 9 = 2 ^ 2 + 3 ^ 2 ∧ √((2:ℝ) ^ 2 + 3 ^ 2) = √13 ∧
    3.605 < √(13:ℝ) ∧ √(13:ℝ) < 3.615 ∧ 3.55 < √(13:ℝ) ∧ √(13:ℝ) < 3.65 ∧
    (7:ℝ) = 16 - 9 ∧ (16:ℝ) - 9 = 4 ^ 2 - 3 ^ 2 ∧ √((16:ℝ) - 9) = √7 ∧
    2.645 < √(7:ℝ) ∧ √(7:ℝ) < 2.655 ∧ 2.55 < √(7:ℝ) ∧ √(7:ℝ) < 2.65 := by
  obtain ⟨a, b⟩ := s13; obtain ⟨c, d⟩ := s7
  refine ⟨by norm_num, by norm_num, by norm_num, by linarith, by linarith, by linarith, by linarith,
    by norm_num, by norm_num, by norm_num, by linarith, by linarith, by linarith, by linarith⟩

/-- Primer 5, korak 3: 7 ni vsota dveh kvadratov celih števil.
trditev: MAT-SS-2/koreni#sedem-ni-vsota
besedilo: »Število $7$ ni vsota dveh kvadratov celih števil,« -/
theorem sedem_ni_vsota (a b : ℤ) : a ^ 2 + b ^ 2 ≠ 7 := by
  intro h
  have ha1 : -2 ≤ a := by nlinarith [sq_nonneg b]
  have ha2 : a ≤ 2 := by nlinarith [sq_nonneg b]
  have hb1 : -2 ≤ b := by nlinarith [sq_nonneg a]
  have hb2 : b ≤ 2 := by nlinarith [sq_nonneg a]
  interval_cases a <;> interval_cases b <;> norm_num at h

/-- Primer 6 a): (−0,5)³ = −0,125, zato ∛(−0,125) = −0,5; 2³ = 8, 3³ = 27, zato ∛(8/27) = 2/3.
trditev: MAT-SS-2/koreni#primer6a
besedilo: »a) $(-0{,}5)^3 = -0{,}125$, zato je $\sqrt[3]{-0{,}125} = -0{,}5$. Ker je $2^3 = 8$ in $3^3 = 27$, je $\sqrt[3]{\dfrac{8}{27}} = \dfrac{2}{3}$.« -/
theorem primer6a : ((-0.5):ℝ) ^ 3 = -0.125 ∧ koren 3 (-0.125) = -0.5 ∧ (2:ℝ) ^ 3 = 8 ∧ (3:ℝ) ^ 3 = 27 ∧
    koren 3 (8 / 27) = 2 / 3 :=
  ⟨by norm_num, ((koren_lih ⟨1, rfl⟩ _ _).mp (by norm_num)).symm, by norm_num, by norm_num,
    koren_eq (by norm_num) (by norm_num) (by norm_num)⟩

/-- Primer 6 b): ∛(−20) ≈ −2,714; preverjanje (−2,714)³ ≈ −19,99; ocena −27 < −20 < −8, zato je koren med
−3 in −2.
trditev: MAT-SS-2/koreni#primer6b-kub
besedilo: »b) Računalo da $\sqrt[3]{-20} \approx -2{,}714$. Preverjanje: $(-2{,}714)^3 \approx -19{,}99$, ocena pa $-27 < -20 < -8$, zato je koren med $-3$ in $-2$.« -/
theorem primer6b_kub : -2.7145 < koren 3 (-20) ∧ koren 3 (-20) < -2.7135 ∧
    -19.995 < ((-2.714):ℝ) ^ 3 ∧ ((-2.714):ℝ) ^ 3 < -19.985 ∧ -3 < koren 3 (-20) ∧ koren 3 (-20) < -2 := by
  obtain ⟨_, a, b⟩ := kub_m20
  exact ⟨a, b, by norm_num, by norm_num, by linarith, by linarith⟩

/-- Primer 6 b): ∜500 ≈ 4,729; preverjanje 4,729⁴ ≈ 500,1; 4⁴ = 256 < 500 < 625 = 5⁴, zato 4 < ∜500 < 5.
trditev: MAT-SS-2/koreni#primer6b-cetrti
besedilo: »b) S tipko za $n$-ti koren (najprej $4$, nato $500$) dobimo $\sqrt[4]{500} \approx 4{,}729$. Preverjanje: $4{,}729^4 \approx 500{,}1$; ker je $4^4 = 256$ in $5^4 = 625$, je koren med $4$ in $5$.« -/
theorem primer6b_cetrti : 4.7285 < koren 4 500 ∧ koren 4 500 < 4.7295 ∧
    500.05 < (4.729:ℝ) ^ 4 ∧ (4.729:ℝ) ^ 4 < 500.15 ∧ (4:ℝ) ^ 4 = 256 ∧ (5:ℝ) ^ 4 = 625 ∧
    4 < koren 4 500 ∧ koren 4 500 < 5 := by
  obtain ⟨a, b⟩ := koren_med (n := 4) (a := 500) (lo := 4.7285) (hi := 4.7295) (by norm_num) (by norm_num)
    (by norm_num) (by norm_num) (by norm_num)
  exact ⟨a, b, by norm_num, by norm_num, by norm_num, by norm_num, by linarith, by linarith⟩

/-- Primer 6 c): q⁵ = 1,3 ima edino realno rešitev q = ⁵√1,3 ≈ 1,0539 ≈ 1,054 (rast ≈ 5,4 %, ne 6 %:
1,06⁵ ≠ 1,3).
trditev: MAT-SS-2/koreni#primer6c
besedilo: »Odgovor: a) $-0{,}5$ in $\dfrac{2}{3}$; b) $\sqrt[3]{-20} \approx -2{,}714$ in $\sqrt[4]{500} \approx 4{,}729$; c) $q \approx 1{,}054$. Naložba vsako leto zraste za približno $5{,}4\,\%$, ne za $30\,\% : 5 = 6\,\%$.« -/
theorem primer6c (q : ℝ) : (q ^ 5 = 1.3 ↔ q = koren 5 1.3) ∧ 1.05385 < koren 5 1.3 ∧ koren 5 1.3 < 1.05395 ∧
    1.0535 < koren 5 1.3 ∧ koren 5 1.3 < 1.0545 ∧ (1.06:ℝ) ^ 5 ≠ 1.3 ∧ (30:ℝ) / 5 = 6 := by
  obtain ⟨a, b⟩ := koren_med (n := 5) (a := 1.3) (lo := 1.05385) (hi := 1.05395) (by norm_num) (by norm_num)
    (by norm_num) (by norm_num) (by norm_num)
  exact ⟨koren_lih ⟨2, rfl⟩ _ _, a, b, by linarith, by linarith, by norm_num, by norm_num⟩

/-! ## Za maturo -/

/-- Naloga 1: √48 = √(16 · 3) = 4√3, √75 = √(25 · 3) = 5√3, 9/√3 = 9√3/3 = 3√3, vsota 4√3 + 3√3 − 5√3 = 2√3.
trditev: MAT-SS-2/koreni#matura1
besedilo: »$\sqrt{48} = \sqrt{16 \cdot 3} = 4\sqrt{3}$ in $\sqrt{75} = \sqrt{25 \cdot 3} = 5\sqrt{3}$.« -/
theorem matura1 : √(48:ℝ) + 9 / √3 - √75 = 2 * √3 := by
  have h48 : √(48:ℝ) = 4 * √3 := by rw [show (48:ℝ) = 4 ^ 2 * 3 by norm_num]; exact delno_korenjenje (by norm_num) (by norm_num)
  have h75 : √(75:ℝ) = 5 * √3 := by rw [show (75:ℝ) = 5 ^ 2 * 3 by norm_num]; exact delno_korenjenje (by norm_num) (by norm_num)
  obtain ⟨r1, r2⟩ := racionalizacija 9 (b := 3) (by norm_num)
  have h9 : 9 / √(3:ℝ) = 3 * √3 := by rw [r1, r2]; ring
  calc √(48:ℝ) + 9 / √3 - √75 = 4 * √3 + 3 * √3 - 5 * √3 := by rw [h48, h75, h9]
    _ = 2 * √3 := by ring

/-- Naloga 2 a): c³ = 128 ima (eksponent 3 je lih) natanko eno realno rešitev c = ∛128 = ∛(4³ · 2) = 4∛2.
trditev: MAT-SS-2/koreni#matura2a
besedilo: »a) $c^3 = 128$. Eksponent $3$ je lih, zato ima enačba natanko eno realno rešitev $c = \sqrt[3]{128}$.« -/
theorem matura2a (c : ℝ) : (c ^ 3 = 128 ↔ c = koren 3 128) ∧ (128:ℝ) = 64 * 2 ∧ (64:ℝ) = 4 ^ 3 ∧
    koren 3 128 = koren 3 (4 ^ 3 * 2) ∧ koren 3 ((4:ℝ) ^ 3 * 2) = 4 * koren 3 2 := by
  refine ⟨koren_lih ⟨1, rfl⟩ _ _, by norm_num, by norm_num, by norm_num, ?_⟩
  rw [koren_n_produkta 3 (by norm_num) (by norm_num), koren_eq (by norm_num) (by norm_num) rfl]

/-- Naloga 2 b): c ≈ 5,039684 ≈ 5,04; D = c√2 = 4∛2 · √2 ≈ 7,127190 ≈ 7,13.
trditev: MAT-SS-2/koreni#matura2b
besedilo: »b) $D = c\sqrt{2} = 4\sqrt[3]{2} \cdot \sqrt{2} \approx 7{,}127190$, torej $D \approx 7{,}13\,\text{cm}$.« -/
theorem matura2b : 5.0396835 < koren 3 128 ∧ koren 3 128 < 5.0396845 ∧ 5.035 < koren 3 128 ∧ koren 3 128 < 5.045 ∧
    koren 3 128 * √2 = 4 * koren 3 2 * √2 ∧
    7.1271895 < koren 3 128 * √2 ∧ koren 3 128 * √2 < 7.1271905 ∧ 7.125 < koren 3 128 * √2 ∧
    koren 3 128 * √2 < 7.135 := by
  have h4 : koren 3 (128:ℝ) = 4 * koren 3 2 := by
    obtain ⟨-, -, -, h1, h2⟩ := matura2a 0; rw [h1, h2]
  obtain ⟨a, b⟩ := koren_med (n := 3) (a := 128) (lo := 5.0396841) (hi := 5.0396843) (by norm_num) (by norm_num)
    (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨c, d⟩ := s2
  have hc : 0 ≤ koren 3 128 := koren_nenegativen (by norm_num)
  have p1 := mul_pos (sub_pos.mpr a) (sub_pos.mpr c)
  have p2 := mul_pos (sub_pos.mpr b) (sub_pos.mpr d)
  refine ⟨by linarith, by linarith, by linarith, by linarith, by rw [h4], by nlinarith, by nlinarith, by nlinarith,
    by nlinarith⟩

/-- Naloga 2 c): D³ = (c√2)³ = c³ · (√2)³ = 128 · 2√2 = 256√2 ≈ 362,0387 ≈ 362 cm³.
trditev: MAT-SS-2/koreni#matura2c
besedilo: »$D^3 = \left(c\sqrt{2}\right)^3 = c^3 \cdot \left(\sqrt{2}\right)^3 = 128 \cdot 2\sqrt{2} = 256\sqrt{2}\,\text{cm}^3$« -/
theorem matura2c : (koren 3 128 * √2) ^ 3 = koren 3 128 ^ 3 * √2 ^ 3 ∧ koren 3 128 ^ 3 * √(2:ℝ) ^ 3 = 128 * (2 * √2) ∧
    (128:ℝ) * (2 * √2) = 256 * √2 ∧ 362.03865 < 256 * √(2:ℝ) ∧ 256 * √(2:ℝ) < 362.03875 ∧
    361.5 < 256 * √(2:ℝ) ∧ 256 * √(2:ℝ) < 362.5 := by
  obtain ⟨c, d⟩ := s2
  have h3 : √(2:ℝ) ^ 3 = 2 * √2 := by rw [pow_succ, sq2]
  refine ⟨by ring, by rw [koren_pot (by norm_num) (by norm_num), h3], by ring, by linarith, by linarith,
    by linarith, by linarith⟩

/-- RACUN: (4∛2 · √2)³ = 256√2 (rob 4∛2).
trditev: MAT-SS-2/koreni#racun-kub
besedilo: »$D^3 = \left(c\sqrt{2}\right)^3 = c^3 \cdot \left(\sqrt{2}\right)^3 = 128 \cdot 2\sqrt{2} = 256\sqrt{2}\,\text{cm}^3$« -/
theorem racun_kub : (4 * koren 3 2 * √2) ^ 3 = 256 * √(2:ℝ) := by
  have h : koren 3 (2:ℝ) ^ 3 = 2 := koren_pot (by norm_num) (by norm_num)
  have h3 : √(2:ℝ) ^ 3 = 2 * √2 := by rw [pow_succ, sq2]
  calc (4 * koren 3 2 * √2) ^ 3 = 64 * koren 3 2 ^ 3 * √2 ^ 3 := by ring
    _ = 256 * √2 := by rw [h, h3]; ring

/-! ## Drugače -/

/-- Na sliki: kvadrat s ploščino 2 ima stranico √2 ≈ 1,41 ((√2)² = 2); diagonala kvadrata s stranico 1 je
√(1² + 1²) = √2.
trditev: MAT-SS-2/koreni#na-sliki-kvadrat
besedilo: »Kvadrat s ploščino $2\,\text{cm}^2$ ima stranico $\sqrt{2}\,\text{cm} \approx 1{,}41\,\text{cm}$.« -/
theorem na_sliki_kvadrat : √(2:ℝ) ^ 2 = 2 ∧ √((1:ℝ) ^ 2 + 1 ^ 2) = √2 ∧ 1.405 < √(2:ℝ) ∧ √(2:ℝ) < 1.415 := by
  obtain ⟨a, b⟩ := s2
  exact ⟨sq2, by norm_num, by linarith, by linarith⟩

/-- Na sliki: √2 · √3 = √6 ≈ 2,449 in 1,414 · 1,732 ≈ 2,449.
trditev: MAT-SS-2/koreni#na-sliki-produkt
besedilo: »Pri $\sqrt{6} \approx 2{,}449$ to tudi preveriš: $1{,}414 \cdot 1{,}732 \approx 2{,}449$.« -/
theorem na_sliki_produkt : √(2:ℝ) * √3 = √6 ∧ 2.4485 < √(6:ℝ) ∧ √(6:ℝ) < 2.4495 ∧
    2.4485 < (1.414:ℝ) * 1.732 ∧ (1.414:ℝ) * 1.732 < 2.4495 := by
  obtain ⟨a, b⟩ := s6
  exact ⟨by rw [← Real.sqrt_mul (by norm_num)]; norm_num, by linarith, by linarith, by norm_num, by norm_num⟩

/-- Na sliki, tabela: √0 = 0, √1 = 1, √4 = 2, √9 = 3, √16 = 4.
trditev: MAT-SS-2/koreni#tabela-korenov
besedilo: »$2^2 = 4$, $3^2 = 9$ in $4^2 = 16$, zato je $\sqrt{4} = 2$, $\sqrt{9} = 3$ in $\sqrt{16} = 4$.« -/
theorem tabela_korenov : √(0:ℝ) = 0 ∧ √(1:ℝ) = 1 ∧ √(4:ℝ) = 2 ∧ √(9:ℝ) = 3 ∧ √(16:ℝ) = 4 :=
  ⟨Real.sqrt_zero, Real.sqrt_one, sqrt4, sqrt9, sqrt16⟩

/-- Kot zgodba: diagonala √(1,2² + 1,2²) = √(2 · 1,2²) = 1,2√2 ≈ 1,697 m; Majina meritev 1,70 m je natančna na
centimeter.
trditev: MAT-SS-2/koreni#zgodba-diagonala
besedilo: »»Preveriva z računom,« reče Tone. »Po Pitagori je diagonala $\sqrt{1{,}2^2 + 1{,}2^2} = \sqrt{2 \cdot 1{,}2^2}$. Kvadrat je faktor, zato ga izvlečeš iz korena: diagonala je $1{,}2\sqrt{2} \approx 1{,}697\,\text{m}$.« Maja je zadela na centimeter natančno.« -/
theorem zgodba_diagonala : √((1.2:ℝ) ^ 2 + 1.2 ^ 2) = √(2 * 1.2 ^ 2) ∧ √((2:ℝ) * 1.2 ^ 2) = 1.2 * √2 ∧
    1.6965 < 1.2 * √(2:ℝ) ∧ 1.2 * √(2:ℝ) < 1.6975 ∧ |1.70 - 1.2 * √(2:ℝ)| < 0.01 := by
  obtain ⟨a, b⟩ := s2
  refine ⟨by ring_nf, ?_, by linarith, by linarith, by rw [abs_lt]; constructor <;> linarith⟩
  rw [mul_comm, Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]

/-- Kot zgodba: s√2 = 1,2 ⇔ s = 1,2/√2; 1,2/√2 = 1,2√2/2 = 0,6√2; 0,6 · 1,414 ≈ 0,85 m.
trditev: MAT-SS-2/koreni#zgodba-stranica
besedilo: »$0{,}6 \cdot 1{,}414 \approx 0{,}85\,\text{m}$.« -/
theorem zgodba_stranica (s : ℝ) : (s * √2 = 1.2 ↔ s = 1.2 / √2) ∧ (1.2:ℝ) / √2 = 1.2 * √2 / 2 ∧
    (1.2:ℝ) * √2 / 2 = 0.6 * √2 ∧ 0.845 < (0.6:ℝ) * 1.414 ∧ (0.6:ℝ) * 1.414 < 0.855 ∧
    0.845 < 0.6 * √(2:ℝ) ∧ 0.6 * √(2:ℝ) < 0.855 := by
  have hne : √(2:ℝ) ≠ 0 := by positivity
  obtain ⟨a, b⟩ := s2
  refine ⟨⟨fun h => by rw [← h]; field_simp, fun h => by rw [h]; field_simp⟩, ?_, by ring, by norm_num,
    by norm_num, by linarith, by linarith⟩
  rw [div_eq_div_iff hne (by norm_num)]; linear_combination (-1.2) * sq2

/-- Korak za korakom: 180 = 2 · 2 · 3 · 3 · 5 = 2² · 3² · 5, √(2² · 3² · 5) = 2 · 3 · √5 = 6√5 ≈ 13,416;
6 · 2,236 = 13,416.
trditev: MAT-SS-2/koreni#korak-180
besedilo: »$\sqrt{180} \approx 13{,}416$ in $6\sqrt{5} \approx 6 \cdot 2{,}236 = 13{,}416$.« -/
theorem korak_180 : (180:ℝ) = 2 * 2 * 3 * 3 * 5 ∧ (2:ℝ) * 2 * 3 * 3 * 5 = 2 ^ 2 * 3 ^ 2 * 5 ∧
    √((2:ℝ) ^ 2 * 3 ^ 2 * 5) = 2 * 3 * √5 ∧ (2:ℝ) * 3 * √5 = 6 * √5 ∧
    13.4155 < √(180:ℝ) ∧ √(180:ℝ) < 13.4165 ∧ (6:ℝ) * 2.236 = 13.416 := by
  have h : √((2:ℝ) ^ 2 * 3 ^ 2 * 5) = 2 * 3 * √5 := by
    rw [show (2:ℝ) ^ 2 * 3 ^ 2 * 5 = (2 * 3) ^ 2 * 5 by ring]; exact delno_korenjenje (by norm_num) (by norm_num)
  obtain ⟨a, b⟩ := koren2_med (x := 180) (lo := 13.4155) (hi := 13.4165) (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  exact ⟨by norm_num, by norm_num, h, by ring, a, b, by norm_num⟩

/-- Korak za korakom: 7/(2√5) razširimo s √5: števec 7√5, imenovalec 2√5 · √5 = 2 · 5 = 10, rezultat 7√5/10;
preverjanje 7/(2 · 2,236) ≈ 1,565 in 7 · 2,236/10 ≈ 1,565.
trditev: MAT-SS-2/koreni#korak-7-2s5
besedilo: »Preverjanje: $\dfrac{7}{2 \cdot 2{,}236} \approx 1{,}565$ in $\dfrac{7 \cdot 2{,}236}{10} \approx 1{,}565$.« -/
theorem korak_7_2s5 : 7 / (2 * √5) = 7 * √5 / (2 * √5 * √5) ∧ 2 * √(5:ℝ) * √5 = 2 * 5 ∧
    7 / (2 * √(5:ℝ)) = 7 * √5 / 10 ∧ 1.5645 < (7:ℝ) / (2 * 2.236) ∧ (7:ℝ) / (2 * 2.236) < 1.5655 ∧
    1.5645 < (7:ℝ) * 2.236 / 10 ∧ (7:ℝ) * 2.236 / 10 < 1.5655 := by
  have hne : √(5:ℝ) ≠ 0 := by positivity
  have e1 := (mul_div_mul_right (7:ℝ) (2 * √5) hne).symm
  have e2 : 2 * √(5:ℝ) * √5 = 2 * 5 := by rw [mul_assoc, Real.mul_self_sqrt (by norm_num)]
  refine ⟨e1, e2, by rw [e1, e2]; norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-! ## Preveri se -/

/-- Preveri se, 1: √4 = 2, √9 = 3, √16 = 4.
trditev: MAT-SS-2/koreni#preveri1
besedilo: »$2^2 = 4$, $3^2 = 9$ in $4^2 = 16$, zato je $\sqrt{4} = 2$, $\sqrt{9} = 3$ in $\sqrt{16} = 4$.« -/
theorem preveri1 : √(4:ℝ) = 2 ∧ √(9:ℝ) = 3 ∧ √(16:ℝ) = 4 := ⟨sqrt4, sqrt9, sqrt16⟩

/-- Preveri se, 2: 5√3 = √(25 · 3) = √75 in 8² = 64 < 75 < 81 = 9², zato 8 < 5√3 < 9 (5√3 ≈ 8,66); napačni
odgovori: 3 < √15 < 4 in 5 + √3 ≈ 6,73.
trditev: MAT-SS-2/koreni#preveri2
besedilo: »$5\sqrt{3} = \sqrt{75}$ in $8^2 = 64 < 75 < 81 = 9^2$, zato je $8 < 5\sqrt{3} < 9$ (natančneje $5\sqrt{3} \approx 8{,}66$).« -/
theorem preveri2 : 5 * √3 = √((25:ℝ) * 3) ∧ √((25:ℝ) * 3) = √75 ∧ 8 < 5 * √(3:ℝ) ∧ 5 * √(3:ℝ) < 9 ∧
    8.655 < 5 * √(3:ℝ) ∧ 5 * √(3:ℝ) < 8.665 ∧ 3 < √(15:ℝ) ∧ √(15:ℝ) < 4 ∧
    6.725 < 5 + √(3:ℝ) ∧ 5 + √(3:ℝ) < 6.735 := by
  obtain ⟨a, b⟩ := s3
  obtain ⟨c, d⟩ := koren2_med (x := 15) (lo := 3) (hi := 4) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  refine ⟨?_, by norm_num, by linarith, by linarith, by linarith, by linarith, c, d, by linarith, by linarith⟩
  rw [show (25:ℝ) = 5 ^ 2 by norm_num, delno_korenjenje (by norm_num) (by norm_num)]

/-- Preveri se, 3: 1/(√5 − √2) = (√5 + √2)/3, (√5 − √2)² = 7 − 2√10, √5 + √2 ≠ √7 (≈ 3,65 proti 2,65).
trditev: MAT-SS-2/koreni#preveri3
besedilo: »Napačno je misliti, da je $\sqrt{5} + \sqrt{2}$ enako $\sqrt{7}$: vsota korenov ni koren vsote ($3{,}65$ proti $2{,}65$).« -/
theorem preveri3 : 1 / (√5 - √(2:ℝ)) = (√5 + √2) / 3 ∧ (√5 - √(2:ℝ)) ^ 2 = 7 - 2 * √10 ∧
    √5 + √(2:ℝ) ≠ √7 ∧ 3.645 < √5 + √(2:ℝ) ∧ √5 + √(2:ℝ) < 3.655 ∧ 2.645 < √(7:ℝ) ∧ √(7:ℝ) < 2.655 := by
  have h10 : √(5:ℝ) * √2 = √10 := by rw [← Real.sqrt_mul (by norm_num)]; norm_num
  obtain ⟨a, b⟩ := s5; obtain ⟨c, d⟩ := s2; obtain ⟨e, f⟩ := s7
  refine ⟨?_, by linear_combination sq5 + sq2 - 2 * h10, by intro h; linarith, by linarith, by linarith,
    by linarith, by linarith⟩
  rw [racionalizacija_razlike (by norm_num) (by norm_num) (by norm_num)]; norm_num

/-- Preveri se, 4: 3√5 = √9 · √5 = √45 (in ne √15 ali √75); √75 = √(25 · 3) = 5√3.
trditev: MAT-SS-2/koreni#preveri4
besedilo: »$\sqrt{75} = \sqrt{25 \cdot 3} = 5\sqrt{3}$« -/
theorem preveri4 : 3 * √5 = √9 * √(5:ℝ) ∧ √(9:ℝ) * √5 = √45 ∧ √(45:ℝ) ≠ √15 ∧ √(45:ℝ) ≠ √75 ∧
    √(75:ℝ) = 5 * √3 := by
  have i : ∀ x y : ℝ, 0 ≤ x → 0 ≤ y → x ≠ y → √x ≠ √y := fun x y hx hy h e => h ((Real.sqrt_inj hx hy).mp e)
  refine ⟨by rw [sqrt9], by rw [← Real.sqrt_mul (by norm_num)]; norm_num, i _ _ (by norm_num) (by norm_num) (by norm_num),
    i _ _ (by norm_num) (by norm_num) (by norm_num), ?_⟩
  rw [show (75:ℝ) = 5 ^ 2 * 3 by norm_num]; exact delno_korenjenje (by norm_num) (by norm_num)

/-- Preveri se, 5: diagonala deske √(30² + 30²) = √(900 · 2) = 30√2 ≈ 42,4 cm; napačni odgovori:
30² + 30² = 1800, √60 ≈ 7,7, √900 = 30.
trditev: MAT-SS-2/koreni#preveri5
besedilo: »$\sqrt{30^2 + 30^2} = \sqrt{900 \cdot 2} = 30\sqrt{2} \approx 42{,}4\,\text{cm}$« -/
theorem preveri5 : √((30:ℝ) ^ 2 + 30 ^ 2) = √(900 * 2) ∧ √((900:ℝ) * 2) = 30 * √2 ∧ 42.35 < 30 * √(2:ℝ) ∧
    30 * √(2:ℝ) < 42.45 ∧ (30:ℝ) ^ 2 + 30 ^ 2 = 1800 ∧ 7.65 < √(60:ℝ) ∧ √(60:ℝ) < 7.75 ∧ √(900:ℝ) = 30 := by
  obtain ⟨a, b⟩ := s2
  obtain ⟨c, d⟩ := koren2_med (x := 60) (lo := 7.65) (hi := 7.75) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h900 : √(900:ℝ) = 30 := by rw [show (900:ℝ) = 30 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)
  refine ⟨by norm_num, by rw [Real.sqrt_mul (by norm_num), h900], by linarith, by linarith, by norm_num, c, d, h900⟩

/-- Preveri se, 6: kateti 1 in 4 dasta hipotenuzo √(1² + 4²) = √17, torej n = 17 (napačno 1 + 4 = 5 in 16 − 1 = 15).
trditev: MAT-SS-2/koreni#preveri6
besedilo: »Hipotenuza je $\sqrt{1^2 + 4^2} = \sqrt{17}$, torej $n = 17$.« -/
theorem preveri6 (n : ℝ) (hn : 0 ≤ n) : (√((1:ℝ) ^ 2 + 4 ^ 2) = √n ↔ n = 17) ∧ (1:ℝ) ^ 2 + 4 ^ 2 = 17 ∧
    (1:ℝ) + 4 = 5 ∧ (4:ℝ) ^ 2 - 1 ^ 2 = 15 := by
  refine ⟨⟨fun h => ?_, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num⟩
  have := (Real.sqrt_inj (by norm_num) hn).mp h; linarith

/-- Predpostavke trditve `preveri6` se dajo izpolniti. -/
example : (0:ℝ) ≤ 17 := by norm_num

/-- Predpostavke trditve `preveri6` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 17 := by norm_num
  preveri6 (hn := w)

/-- Preveri se, 7: ⁵√300 ≈ 3,129 ≈ 3,13; preverjanje 3,129⁵ ≈ 300 (RACUN: ≈ 299,94); 3⁵ = 243 < 300 < 1024 = 4⁵;
napačni odgovori 300 : 5 = 60 in √300 ≈ 17,32.
trditev: MAT-SS-2/koreni#preveri7
besedilo: »$\sqrt[5]{300} \approx 3{,}129$, zaokroženo $3{,}13$. Preverjanje: $3{,}129^5 \approx 300$, ocena: $3^5 = 243 < 300 < 1024 = 4^5$.« -/
theorem preveri7 : 3.1285 < koren 5 300 ∧ koren 5 300 < 3.1295 ∧ 3.125 < koren 5 300 ∧ koren 5 300 < 3.135 ∧
    299.935 < (3.129:ℝ) ^ 5 ∧ (3.129:ℝ) ^ 5 < 299.945 ∧ (3:ℝ) ^ 5 = 243 ∧ (4:ℝ) ^ 5 = 1024 ∧
    (300:ℝ) / 5 = 60 ∧ 17.315 < √(300:ℝ) ∧ √(300:ℝ) < 17.325 := by
  obtain ⟨a, b⟩ := koren_med (n := 5) (a := 300) (lo := 3.1291) (hi := 3.1292) (by norm_num) (by norm_num)
    (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨c, d⟩ := koren2_med (x := 300) (lo := 17.315) (hi := 17.325) (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  exact ⟨by linarith, by linarith, by linarith, by linarith, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, c, d⟩

/-- RACUN: √13 ≈ 3,61, √7 ≈ 2,65, 1² + 4² = 17, (−1/2)³ = −1/8, (2/3)³ = 8/27, √(2² + 3²) = √13,
√(4² − 3²) = √7.
trditev: MAT-SS-2/koreni#racun-ostalo
besedilo: »Nariši daljico $3\,\text{cm}$ in v enem krajišču pravokotnico. Šestilo odpri na $4\,\text{cm}$, ga zapiči v drugo krajišče daljice in zareži pravokotnico. Odsek pravokotnice do zareze meri $\sqrt{16 - 9} = \sqrt{7}\,\text{cm} \approx 2{,}65\,\text{cm}$.« -/
theorem racun_ostalo : (1:ℝ) ^ 2 + 4 ^ 2 = 17 ∧ ((-1:ℝ) / 2) ^ 3 = -1 / 8 ∧ ((2:ℝ) / 3) ^ 3 = 8 / 27 ∧
    √((4:ℝ) ^ 2 - 3 ^ 2) = √7 := by norm_num

end Evklid.Lekcije.MAT_SS_2.Koreni
