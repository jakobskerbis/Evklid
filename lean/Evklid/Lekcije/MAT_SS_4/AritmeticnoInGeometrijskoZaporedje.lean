/-
vir: content/lessons/MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje.md
sha256: 89389b192efe9931aeb6135303311f826c50fe0c519a60117a0db9b362749d81
Ni v Leanu: simulacija in risbe (»Drugače: Na sliki«: točke na premici, krivulja, stopnice iz kock);
  induktivno sklepanje kot postopek (»uganemo« pravilo) — dokazano je le, da uganjeni splošni členi
  ustrezajo danim členom in da trije členi zaporedja ne določajo; zgodovinska trditev o Gaussu;
  zgodba o krovcu in kolesarki kot modeliranje (dokazan je račun); točkovanje.
  Monotonost geometrijskega zaporedja je dokazana pri a₁ > 0, kot jo navaja lekcija.
  Zaokroženi rezultati naloge 2 so dokazani kot meje (npr. 176,319 ≤ a₆ < 176,32), kar da zapisano
  zaokrožitev; log(25/12)/log 1,08 ≈ 9,54 je dokazan kot 9,535 < … < 9,545.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.AritmeticnoInGeometrijskoZaporedje

open Finset

/-! ## Razlaga, 1–4: aritmetično zaporedje -/

/-- Razlaga 1: šesti člen v tabeli: 2 + 5·3 = 17 (prištevamo 3) in 2·3⁵ = 486 (množimo s 3);
tudi vsi prikazani členi 2, 5, 8, 11, 14 in 2, 6, 18, 54, 162.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#tabela
besedilo: »$1 \cdot 3 = 3$, $2 \cdot 4 = 8$, $3 \cdot 5 = 15$, $4 \cdot 6 = 24$. Vsak člen je za $1$ manjši od kvadrata: $a_n = (n + 1)^2 - 1 = n(n + 2)$.« -/
theorem tabela :
    (List.range 6).map (fun k : ℕ => (2 + 3 * k : ℤ)) = [2, 5, 8, 11, 14, 17] ∧
    (List.range 6).map (fun k : ℕ => (2 * 3 ^ k : ℤ)) = [2, 6, 18, 54, 162, 486] := by
  decide

/-- Razlaga 2, »Preveri«: zaporedje 10, 7, 4, 1 ima vse razlike enake −3.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#diferenca-negativna
besedilo: »Preveri:* kolikšna je diferenca zaporedja $10, 7, 4, 1, \ldots$? *(Odgovor: $d = -3$; diferenca je lahko negativna.)« -/
theorem diferenca_negativna : (7 : ℤ) - 10 = -3 ∧ (4 : ℤ) - 7 = -3 ∧ (1 : ℤ) - 4 = -3 := by
  norm_num

/-- Razlaga 3: splošni člen aritmetičnega zaporedja. Če je aₙ₊₁ − aₙ = d za vsak n ≥ 1, je
aₙ = a₁ + (n − 1)d za vsak n ≥ 1.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#aritm-splosni
besedilo: »Splošni člen aritmetičnega zaporedja.** Od $a_1$ do $a_n$ naredimo $n - 1$ korakov, vsak prinese $d$.« -/
theorem aritm_splosni (a : ℕ → ℝ) (d : ℝ) (h : ∀ n, 1 ≤ n → a (n + 1) - a n = d) :
    ∀ n, 1 ≤ n → a n = a 1 + ((n : ℝ) - 1) * d := by
  intro n hn
  induction n, hn using Nat.le_induction with
  | base => simp
  | succ n hn ih =>
    have := h n hn
    push_cast
    linarith

/-- Predpostavke aritmetičnih trditev se dajo izpolniti (aₙ = a₁ + (n − 1)d za vsak n).
Trditve: `aritm_splosni`, `aritm_narasca`, `aritm_pada`, `aritm_konst`, `aritm_vsota'`, `aritm_vsota` in
`aritm_sredina` (za vsak d, tudi d > 0, d < 0 in d = 0; n = 1 oziroma n = 2). -/
example (a₁ d : ℝ) : ∃ a : ℕ → ℝ, a 1 = a₁ ∧ ∀ n, 1 ≤ n → a (n + 1) - a n = d :=
  ⟨fun n => a₁ + ((n : ℝ) - 1) * d, by simp, fun n _ => by push_cast; ring⟩

/-- Predpostavke trditve `aritm_splosni` se dajo izpolniti: izrek, uporabljen na primeru. -/
example (a₁ d : ℝ) :=
  have w : ∃ a : ℕ → ℝ, a 1 = a₁ ∧ ∀ n, 1 ≤ n → a (n + 1) - a n = d :=
    ⟨fun n => a₁ + ((n : ℝ) - 1) * d, by simp, fun n _ => by push_cast; ring⟩
  aritm_splosni (h := w.choose_spec.2)

/-- Razlaga 3: pri d > 0 je aritmetično zaporedje strogo naraščajoče (aₘ < aₙ za 1 ≤ m < n).
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#aritm-narasca
besedilo: »Če je $d > 0$, je zaporedje strogo naraščajoče, če je $d < 0$, strogo padajoče, pri $d = 0$ pa konstantno.« -/
theorem aritm_narasca (a : ℕ → ℝ) (d : ℝ) (h : ∀ n, 1 ≤ n → a (n + 1) - a n = d) (hd : 0 < d) :
    ∀ m n, 1 ≤ m → m < n → a m < a n := by
  intro m n hm hmn
  rw [aritm_splosni a d h m hm, aritm_splosni a d h n (by omega)]
  have : (m : ℝ) < n := by exact_mod_cast hmn
  nlinarith

/-- Razlaga 3: pri d < 0 je aritmetično zaporedje strogo padajoče.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#aritm-pada
besedilo: »Če je $d > 0$, je zaporedje strogo naraščajoče, če je $d < 0$, strogo padajoče, pri $d = 0$ pa konstantno.« -/
theorem aritm_pada (a : ℕ → ℝ) (d : ℝ) (h : ∀ n, 1 ≤ n → a (n + 1) - a n = d) (hd : d < 0) :
    ∀ m n, 1 ≤ m → m < n → a n < a m := by
  intro m n hm hmn
  rw [aritm_splosni a d h m hm, aritm_splosni a d h n (by omega)]
  have : (m : ℝ) < n := by exact_mod_cast hmn
  nlinarith

/-- Razlaga 3: pri d = 0 je aritmetično zaporedje konstantno.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#aritm-konst
besedilo: »Če je $d > 0$, je zaporedje strogo naraščajoče, če je $d < 0$, strogo padajoče, pri $d = 0$ pa konstantno.« -/
theorem aritm_konst (a : ℕ → ℝ) (h : ∀ n, 1 ≤ n → a (n + 1) - a n = 0) :
    ∀ n, 1 ≤ n → a n = a 1 := by
  intro n hn
  rw [aritm_splosni a 0 h n hn]; ring

/-- Razlaga 3, »Premisli«: zaporedje 3, 7, 11 ima d = 4 in a₁₀ = 3 + 9·4 = 39, ne 3 + 10·4 = 43.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#premisli-a10
besedilo: »Zaporedje je $3, 7, 11, \ldots$ Sošolec izračuna $a_{10} = 3 + 10 \cdot 4 = 43$.« -/
theorem premisli_a10 (a : ℕ → ℝ) (h1 : a 1 = 3) (h : ∀ n, 1 ≤ n → a (n + 1) - a n = 4) :
    a 2 = 7 ∧ a 3 = 11 ∧ a 10 = 39 ∧ a 10 ≠ 3 + 10 * 4 := by
  have e := aritm_splosni a 4 h
  refine ⟨?_, ?_, ?_, ?_⟩
  · rw [e 2 (by norm_num), h1]; norm_num
  · rw [e 3 (by norm_num), h1]; norm_num
  · calc a 10 = 3 + 9 * 4 := by rw [e 10 (by norm_num), h1]; norm_num
      _ = 39 := by norm_num
  · rw [e 10 (by norm_num), h1]; norm_num

/-- Predpostavke trditve `premisli_a10` se dajo izpolniti (aₙ = 3 + (n − 1)·4). -/
example : ∃ a : ℕ → ℝ, a 1 = 3 ∧ ∀ n, 1 ≤ n → a (n + 1) - a n = 4 :=
  ⟨fun n => 3 + ((n : ℝ) - 1) * 4, by norm_num, fun n _ => by push_cast; ring⟩

/-- Predpostavke trditve `premisli_a10` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ a : ℕ → ℝ, a 1 = 3 ∧ ∀ n, 1 ≤ n → a (n + 1) - a n = 4 :=
    ⟨fun n => 3 + ((n : ℝ) - 1) * 4, by norm_num, fun n _ => by push_cast; ring⟩
  premisli_a10 (h1 := w.choose_spec.1) (h := w.choose_spec.2)

/-- Razlaga 4: Gauss, 1 + 2 + … + 100 = 100·101/2 = 5050; vsak par k + (101 − k) (k = 1, …, 100) da 101.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#gauss
besedilo: »$\dfrac{100 \cdot 101}{2} = 5050$« -/
theorem gauss :
    (∀ k : ℕ, 1 ≤ k → k ≤ 100 → k + (101 - k) = 101) ∧
    ∑ k ∈ Icc 1 100, (k : ℕ) = 100 * 101 / 2 ∧ 100 * 101 / 2 = 5050 := by
  refine ⟨fun k _ h => by omega, by rfl, by norm_num⟩

/-- Razlaga 4: vsota prvih n členov aritmetičnega zaporedja (Sₙ = a₁ + … + aₙ):
Sₙ = n/2·(2a₁ + (n − 1)d) za vsak n.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#aritm-vsota-crtica
besedilo: »Vsota aritmetičnega zaporedja.** Z $S_n$ označimo **vsoto prvih $n$ členov**: $S_n = a_1 + a_2 + \ldots + a_n$.« -/
theorem aritm_vsota' (a : ℕ → ℝ) (d : ℝ) (h : ∀ n, 1 ≤ n → a (n + 1) - a n = d) (n : ℕ) :
    ∑ k ∈ range n, a (k + 1) = n / 2 * (2 * a 1 + ((n : ℝ) - 1) * d) := by
  induction n with
  | zero => simp
  | succ n ih =>
    rw [sum_range_succ, ih, aritm_splosni a d h (n + 1) (by omega)]
    push_cast; ring

/-- Predpostavke trditve `aritm_vsota'` se dajo izpolniti: izrek, uporabljen na primeru. -/
example (a₁ d : ℝ) :=
  have w : ∃ a : ℕ → ℝ, a 1 = a₁ ∧ ∀ n, 1 ≤ n → a (n + 1) - a n = d :=
    ⟨fun n => a₁ + ((n : ℝ) - 1) * d, by simp, fun n _ => by push_cast; ring⟩
  aritm_vsota' (h := w.choose_spec.2)

/-- Razlaga 4 (Gaussova formula): Sₙ = n/2·(a₁ + aₙ) za vsak n ≥ 1.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#aritm-vsota
besedilo: »$$S_n = \frac{n}{2}\,(a_1 + a_n) = \frac{n}{2}\,\bigl(2a_1 + (n-1)\,d\bigr).$$« -/
theorem aritm_vsota (a : ℕ → ℝ) (d : ℝ) (h : ∀ n, 1 ≤ n → a (n + 1) - a n = d) (n : ℕ)
    (hn : 1 ≤ n) : ∑ k ∈ range n, a (k + 1) = n / 2 * (a 1 + a n) := by
  rw [aritm_vsota' a d h n, aritm_splosni a d h n hn]; ring

/-- Razlaga 4, »Preveri« in uvod: Tilen za 10 stopnic porabi 1 + … + 10 = 55 kock, za 20 stopnic
20/2·(1 + 20) = 210 kock, ne 110; to je več kot trikratnik in manj kot štirikratnik od 55.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#tilen
besedilo: »Preveri:* koliko kock potrebuje Tilen za $20$ stopnic? *(Odgovor: $\frac{20}{2}(1 + 20) = 210$, skoraj štirikrat toliko kot za $10$ stopnic. Tilen se moti: vsaka od novih stopnic ima več kock kot katera koli od prvih desetih.)« -/
theorem tilen (a : ℕ → ℝ) (h1 : a 1 = 1) (h : ∀ n, 1 ≤ n → a (n + 1) - a n = 1) :
    ∑ k ∈ range 10, a (k + 1) = 55 ∧ ∑ k ∈ range 20, a (k + 1) = 210 ∧ (210 : ℝ) ≠ 110 ∧
    3 * 55 < (210 : ℝ) ∧ (210 : ℝ) < 4 * 55 := by
  have e := aritm_splosni a 1 h
  refine ⟨?_, ?_, by norm_num, by norm_num, by norm_num⟩
  · rw [aritm_vsota a 1 h 10 (by norm_num), e 10 (by norm_num), h1]; norm_num
  · calc ∑ k ∈ range 20, a (k + 1) = 20 / 2 * (1 + 20) := by
          rw [aritm_vsota a 1 h 20 (by norm_num), e 20 (by norm_num), h1]; norm_num
      _ = 210 := by norm_num

/-- Predpostavke trditve `tilen` se dajo izpolniti (aₙ = n). -/
example : ∃ a : ℕ → ℝ, a 1 = 1 ∧ ∀ n, 1 ≤ n → a (n + 1) - a n = 1 :=
  ⟨fun n => n, by simp, fun n _ => by push_cast; ring⟩

/-! ## Razlaga, 5–6: geometrijsko zaporedje -/

/-- Predpostavke trditve `tilen` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ a : ℕ → ℝ, a 1 = 1 ∧ ∀ n, 1 ≤ n → a (n + 1) - a n = 1 :=
    ⟨fun n => n, by simp, fun n _ => by push_cast; ring⟩
  tilen (h1 := w.choose_spec.1) (h := w.choose_spec.2)

/-- Razlaga 5: splošni člen geometrijskega zaporedja. Če so členi neničelni in aₙ₊₁/aₙ = q za vsak
n ≥ 1, je aₙ = a₁·qⁿ⁻¹ za vsak n ≥ 1.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#geom-splosni
besedilo: »Splošni člen geometrijskega zaporedja je $a_n = a_1 \cdot q^{\,n-1}$.« -/
theorem geom_splosni (a : ℕ → ℝ) (q : ℝ) (h0 : ∀ n, 1 ≤ n → a n ≠ 0)
    (h : ∀ n, 1 ≤ n → a (n + 1) / a n = q) : ∀ n, 1 ≤ n → a n = a 1 * q ^ (n - 1) := by
  intro n hn
  induction n, hn using Nat.le_induction with
  | base => simp
  | succ n hn ih =>
    have hq := h n hn
    rw [div_eq_iff (h0 n hn)] at hq
    obtain ⟨k, rfl⟩ := Nat.exists_eq_add_of_le' hn
    rw [hq, ih]
    simp only [Nat.add_sub_cancel, pow_succ]
    ring

/-- Predpostavke geometrijskih trditev se dajo izpolniti (aₙ = a₁·qⁿ⁻¹ pri a₁ ≠ 0, q ≠ 0).
Trditve: `geom_splosni`, `geom_narasca`, `geom_pada`, `geom_konst`, `geom_alternira`, `geom_vsota` in
`geom_vsota_q1` (npr. a₁ = 1 in q = 2, 1/2, 1 ali −1). -/
example (a₁ q : ℝ) (ha : a₁ ≠ 0) (hq : q ≠ 0) : ∃ a : ℕ → ℝ, a 1 = a₁ ∧
    (∀ n, 1 ≤ n → a n ≠ 0) ∧ ∀ n, 1 ≤ n → a (n + 1) / a n = q := by
  refine ⟨fun n => a₁ * q ^ (n - 1), by simp, fun n _ => mul_ne_zero ha (pow_ne_zero _ hq),
    fun n hn => ?_⟩
  obtain ⟨k, rfl⟩ := Nat.exists_eq_add_of_le' hn
  simp only [Nat.add_sub_cancel, show k + 1 + 1 - 1 = k + 1 by omega, pow_succ]
  field_simp

/-- Razlaga 5, »Preveri«: ostanki deske 96, 48, 24 imajo količnik q = 1/2.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#deska
besedilo: »Preveri:* ostanki deske, ki jo vsakič prežagaš na pol, merijo $96$, $48$, $24$ … centimetrov. Kolikšen je $q$? *(Odgovor: $q = \frac{1}{2}$.)« -/
theorem deska : (48 : ℝ) / 96 = 1 / 2 ∧ (24 : ℝ) / 48 = 1 / 2 := by norm_num

/-- Razlaga 5: pri a₁ > 0 in q > 1 je geometrijsko zaporedje strogo naraščajoče.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#geom-narasca
besedilo: »Pri $a_1 > 0$ je zaporedje za $q > 1$ strogo naraščajoče,« -/
theorem geom_narasca (a : ℕ → ℝ) (q : ℝ) (h0 : ∀ n, 1 ≤ n → a n ≠ 0)
    (h : ∀ n, 1 ≤ n → a (n + 1) / a n = q) (ha : 0 < a 1) (hq : 1 < q) :
    ∀ m n, 1 ≤ m → m < n → a m < a n := by
  intro m n hm hmn
  rw [geom_splosni a q h0 h m hm, geom_splosni a q h0 h n (by omega)]
  exact mul_lt_mul_of_pos_left (pow_lt_pow_right₀ hq (by omega)) ha

/-- Razlaga 5: pri a₁ > 0 in 0 < q < 1 je geometrijsko zaporedje strogo padajoče.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#geom-pada
besedilo: »Pri $a_1 > 0$ je zaporedje za $q > 1$ strogo naraščajoče, za $0 < q < 1$ strogo padajoče, za $q = 1$ pa konstantno.« -/
theorem geom_pada (a : ℕ → ℝ) (q : ℝ) (h0 : ∀ n, 1 ≤ n → a n ≠ 0)
    (h : ∀ n, 1 ≤ n → a (n + 1) / a n = q) (ha : 0 < a 1) (hq0 : 0 < q) (hq : q < 1) :
    ∀ m n, 1 ≤ m → m < n → a n < a m := by
  intro m n hm hmn
  rw [geom_splosni a q h0 h m hm, geom_splosni a q h0 h n (by omega)]
  exact mul_lt_mul_of_pos_left (pow_lt_pow_right_of_lt_one₀ hq0 hq (by omega)) ha

/-- Razlaga 5: pri q = 1 je geometrijsko zaporedje konstantno.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#geom-konst
besedilo: »Pri $a_1 > 0$ je zaporedje za $q > 1$ strogo naraščajoče, za $0 < q < 1$ strogo padajoče, za $q = 1$ pa konstantno.« -/
theorem geom_konst (a : ℕ → ℝ) (h0 : ∀ n, 1 ≤ n → a n ≠ 0)
    (h : ∀ n, 1 ≤ n → a (n + 1) / a n = 1) : ∀ n, 1 ≤ n → a n = a 1 := by
  intro n hn; rw [geom_splosni a 1 h0 h n hn]; simp

/-- Razlaga 5: pri a₁ > 0 in q < 0 zaporedna člena vedno nasprotnega predznaka (aₙ·aₙ₊₁ < 0),
zato zaporedje ni monotono: ni naraščajoče in ni padajoče.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#geom-alternira
besedilo: »Pri $a_1 > 0$ je zaporedje za $q > 1$ strogo naraščajoče, za $0 < q < 1$ strogo padajoče, za $q = 1$ pa konstantno. Za $q < 0$ členi izmenično menjajo predznak, zato zaporedje ni monotono. Takemu zaporedju rečemo **alternirajoče**.« -/
theorem geom_alternira (a : ℕ → ℝ) (q : ℝ) (h0 : ∀ n, 1 ≤ n → a n ≠ 0)
    (h : ∀ n, 1 ≤ n → a (n + 1) / a n = q) (ha : 0 < a 1) (hq : q < 0) :
    (∀ n, 1 ≤ n → a n * a (n + 1) < 0) ∧
    ¬ (∀ n, 1 ≤ n → a n ≤ a (n + 1)) ∧ ¬ (∀ n, 1 ≤ n → a (n + 1) ≤ a n) := by
  have e := geom_splosni a q h0 h
  have a2 : a 2 = a 1 * q := by rw [e 2 (by norm_num)]; ring
  have a3 : a 3 = a 1 * q ^ 2 := by rw [e 3 (by norm_num)]
  refine ⟨fun n hn => ?_, fun H => ?_, fun H => ?_⟩
  · rw [e n hn, e (n + 1) (by omega)]
    obtain ⟨k, rfl⟩ := Nat.exists_eq_add_of_le' hn
    simp only [Nat.add_sub_cancel, show k + 1 + 1 - 1 = k + 1 by omega, pow_succ]
    have : 0 < (a 1 * q ^ k) ^ 2 := sq_pos_of_ne_zero (mul_ne_zero ha.ne' (pow_ne_zero _ hq.ne))
    nlinarith
  · have := H 1 le_rfl; rw [a2] at this; nlinarith
  · have := H 2 (by norm_num); rw [a2, a3] at this; nlinarith

/-- Razlaga 5, »Premisli«: 2, 4, 6, … (d = 2) ima a₁₀ = 2 + 9·2 = 20; 2, 4, 8, … (q = 2) ima
a₁₀ = 2·2⁹ = 1024.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#premisli-deseti
besedilo: »Prvo je aritmetično z $d = 2$: $a_{10} = 2 + 9 \cdot 2 = 20$. Drugo je geometrijsko s $q = 2$: $a_{10} = 2 \cdot 2^9 = 1024$. Pri $a_1 > 0$ in $q > 1$ geometrijsko zaporedje prej ali slej prehiti vsako aritmetično.« -/
theorem premisli_deseti : (2 : ℝ) + 9 * 2 = 20 ∧ (2 : ℝ) * 2 ^ 9 = 1024 := by norm_num

/-- Razlaga 5, »Premisli«: pri a₁ > 0 in q > 1 geometrijsko zaporedje prej ali slej prehiti vsako
aritmetično: za vse b₁, d obstaja N, da je b₁ + (n − 1)d < a₁qⁿ⁻¹ za vse n ≥ N.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#geom-prehiti
besedilo: »Pri $a_1 > 0$ in $q > 1$ geometrijsko zaporedje prej ali slej prehiti vsako aritmetično.« -/
theorem geom_prehiti (a₁ q b₁ d : ℝ) (ha : 0 < a₁) (hq : 1 < q) :
    ∃ N : ℕ, ∀ n, N ≤ n → b₁ + ((n : ℝ) - 1) * d < a₁ * q ^ (n - 1) := by
  have t1 := tendsto_pow_const_div_const_pow_of_one_lt 1 hq
  have t0 := tendsto_pow_const_div_const_pow_of_one_lt 0 hq
  have t := (t0.const_mul (|b₁| + |d|)).add (t1.const_mul |d|)
  simp only [mul_zero, add_zero] at t
  have ev := t.eventually (gt_mem_nhds (show (0 : ℝ) < a₁ / q by positivity))
  rw [Filter.eventually_atTop] at ev
  obtain ⟨N, hN⟩ := ev
  refine ⟨N + 1, fun n hn => ?_⟩
  obtain ⟨k, rfl⟩ := Nat.exists_eq_add_of_le' (show 1 ≤ n by omega)
  have hk := hN k (by omega)
  simp only [pow_zero, pow_one] at hk
  have hqk : 0 < q ^ k := by positivity
  simp only [Nat.add_sub_cancel]
  push_cast
  have e : (|b₁| + |d|) * (1 / q ^ k) + |d| * (k / q ^ k) = ((|b₁| + |d|) + |d| * k) / q ^ k := by
    ring
  rw [e, div_lt_iff₀ hqk] at hk
  have hq0 : 0 < q := by linarith
  have h2 : a₁ / q * q ^ k ≤ a₁ * q ^ k := by
    apply mul_le_mul_of_nonneg_right _ hqk.le
    rw [div_le_iff₀ hq0]; nlinarith
  have hk0 : (0 : ℝ) ≤ k := k.cast_nonneg
  have h3 : (k : ℝ) * d ≤ |d| * k := by rw [mul_comm]; exact mul_le_mul_of_nonneg_right (le_abs_self d) hk0
  have h4 : b₁ ≤ |b₁| := le_abs_self b₁
  have h5 : 0 ≤ |d| := abs_nonneg d
  linarith

/-- Predpostavki trditve `geom_prehiti` se dajo izpolniti (a₁ = 1, q = 2). -/
example : (0:ℝ) < 1 ∧ (1:ℝ) < 2 := by norm_num

/-- Predpostavke trditve `geom_prehiti` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 1 ∧ (1:ℝ) < 2 := by norm_num
  geom_prehiti (ha := w.1) (hq := w.2)

/-- Razlaga 6 (izpeljava): za Sₙ = a₁ + a₁q + … + a₁qⁿ⁻¹ je Sₙ − q·Sₙ = a₁ − a₁qⁿ.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#geom-odstej
besedilo: »$S_n = a_1 + a_1 q + \ldots + a_1 q^{n-1}$« -/
theorem geom_odstej (a₁ q : ℝ) (n : ℕ) :
    ∑ k ∈ range n, a₁ * q ^ k - q * ∑ k ∈ range n, a₁ * q ^ k = a₁ - a₁ * q ^ n := by
  induction n with
  | zero => simp
  | succ n ih => rw [sum_range_succ, pow_succ]; linear_combination ih

/-- Razlaga 6: vsota prvih n členov geometrijskega zaporedja pri q ≠ 1: Sₙ = a₁·(qⁿ − 1)/(q − 1).
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#geom-vsota
besedilo: »Vsota geometrijskega zaporedja.** Vsoto $S_n = a_1 + a_1 q + \ldots + a_1 q^{n-1}$ pomnožimo s $q$:« -/
theorem geom_vsota (a : ℕ → ℝ) (q : ℝ) (h0 : ∀ n, 1 ≤ n → a n ≠ 0)
    (h : ∀ n, 1 ≤ n → a (n + 1) / a n = q) (hq : q ≠ 1) (n : ℕ) :
    ∑ k ∈ range n, a (k + 1) = a 1 * ((q ^ n - 1) / (q - 1)) := by
  have e : ∀ k ∈ range n, a (k + 1) = a 1 * q ^ k := fun k _ => by
    rw [geom_splosni a q h0 h (k + 1) (by omega)]; simp
  rw [sum_congr rfl e, ← mul_sum, geom_sum_eq hq]

/-- Razlaga 6: pri q = 1 so vsi členi enaki a₁, zato je Sₙ = n·a₁.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#geom-vsota-q1
besedilo: »Pri $q = 1$ so vsi členi enaki $a_1$, zato je $S_n = n \cdot a_1$.« -/
theorem geom_vsota_q1 (a : ℕ → ℝ) (h0 : ∀ n, 1 ≤ n → a n ≠ 0)
    (h : ∀ n, 1 ≤ n → a (n + 1) / a n = 1) (n : ℕ) :
    ∑ k ∈ range n, a (k + 1) = n * a 1 := by
  rw [sum_congr rfl (fun k _ => geom_konst a h0 h (k + 1) (by omega))]; simp

/-- Razlaga 6, »Preveri«: 1 + 2 + 4 + 8 + 16 = (2⁵ − 1)/(2 − 1) = 31.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#preveri-31
besedilo: »Preveri:* koliko je $1 + 2 + 4 + 8 + 16$ po formuli? *(Odgovor: $\frac{2^5 - 1}{2 - 1} = 31$.)« -/
theorem preveri_31 : ∑ k ∈ range 5, (2 : ℝ) ^ k = (2 ^ 5 - 1) / (2 - 1) ∧
    ((2 : ℝ) ^ 5 - 1) / (2 - 1) = 31 := by
  constructor
  · rw [geom_sum_eq (by norm_num)]
  · norm_num

/-! ## Razlaga, 7: zaporedje po vzorcu -/

/-- Razlaga 7, vprašanje 2: pri 1, 4, 9, 16 so razlike 3, 5, 7; naslednja razlika je 9 in naslednji
člen 25; hkrati so to kvadrati n² (vprašanje 3).
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#vzorec-kvadrati
besedilo: »Pri $1, 4, 9, 16, \ldots$ so razlike $3, 5, 7$: vsaka je za $2$ večja, zato je naslednja razlika $9$ in naslednji člen $25$.« -/
theorem vzorec_kvadrati :
    (4 - 1 = 3 ∧ 9 - 4 = 5 ∧ 16 - 9 = 7 ∧ 16 + 9 = 25) ∧
    (List.range 5).map (fun k => (k + 1) ^ 2) = [1, 4, 9, 16, 25] := by
  decide

/-- Razlaga 7, vprašanje 3: 4, 10, 28, 82 so 3ⁿ + 1 (n = 1, …, 4), naslednji člen je 3⁵ + 1 = 244.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#vzorec-3n
besedilo: »Členi $4, 10, 28, 82$ so za $1$ večji od potenc števila $3$: $a_n = 3^n + 1$, naslednji člen je $244$.« -/
theorem vzorec_3n :
    (List.range 5).map (fun k => 3 ^ (k + 1) + 1) = [4, 10, 28, 82, 244] := by decide

/-- Razlaga 7: trije členi 1, 2, 4 zaporedja ne določajo: aₙ = 2ⁿ⁻¹ (podvajanje) in
bₙ = (n² − n + 2)/2 (razlike 1, 2, 3) se ujemata pri n = 1, 2, 3, četrti člen pa je 8 oziroma 7.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#vzorec-ne-enolicno
besedilo: »Zaporedje $1, 2, 4, \ldots$ lahko nadaljuješ z $8$ (podvajanje) ali s $7$ (razlike $1, 2, 3$).« -/
theorem vzorec_ne_enolicno :
    (List.range 4).map (fun k => 2 ^ k) = [1, 2, 4, 8] ∧
    (List.range 4).map (fun k => ((k + 1) ^ 2 - (k + 1) + 2) / 2) = [1, 2, 4, 7] := by decide

/-- Razlaga 7, »Preveri«: 1, 3, 7, 15, 31 nadaljujemo z 63; splošni člen aₙ = 2ⁿ − 1.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#vzorec-2n
besedilo: »Preveri:* nadaljuj zaporedje $1, 3, 7, 15, 31, \ldots$ in zapiši splošni člen. *(Odgovor: $63$; vsak člen je za $1$ manjši od potence števila $2$, $a_n = 2^n - 1$.)« -/
theorem vzorec_2n :
    (List.range 6).map (fun k => 2 ^ (k + 1) - 1) = [1, 3, 7, 15, 31, 63] := by decide

/-! ## Rešeni primeri -/

/-- Primer 1: a₁ = 5, d = 3 ⇒ a₂₀ = 5 + 19·3 = 62 in S₂₀ = 20/2·(5 + 62) = 10·67 = 670.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#primer1
besedilo: »$S_{20} = \dfrac{20}{2} \cdot (5 + 62) = 10 \cdot 67 = 670$« -/
theorem primer1 (a : ℕ → ℝ) (h1 : a 1 = 5) (h : ∀ n, 1 ≤ n → a (n + 1) - a n = 3) :
    a 20 = 62 ∧ ∑ k ∈ range 20, a (k + 1) = 670 := by
  have a20 : a 20 = 62 := by
    calc a 20 = 5 + 19 * 3 := by rw [aritm_splosni a 3 h 20 (by norm_num), h1]; norm_num
      _ = 62 := by norm_num
  refine ⟨a20, ?_⟩
  calc ∑ k ∈ range 20, a (k + 1) = 20 / 2 * (5 + 62) := by
        rw [aritm_vsota a 3 h 20 (by norm_num), h1, a20]; norm_num
    _ = 10 * 67 := by norm_num
    _ = 670 := by norm_num

/-- Predpostavke trditve `primer1` se dajo izpolniti. -/
example : ∃ a : ℕ → ℝ, a 1 = 5 ∧ ∀ n, 1 ≤ n → a (n + 1) - a n = 3 :=
  ⟨fun n => 5 + ((n : ℝ) - 1) * 3, by norm_num, fun n _ => by push_cast; ring⟩

/-- Predpostavke trditve `primer1` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ a : ℕ → ℝ, a 1 = 5 ∧ ∀ n, 1 ≤ n → a (n + 1) - a n = 3 :=
    ⟨fun n => 5 + ((n : ℝ) - 1) * 3, by norm_num, fun n _ => by push_cast; ring⟩
  primer1 (h1 := w.choose_spec.1) (h := w.choose_spec.2)

/-- Primer 2: a₁ = 3, q = 2 ⇒ a₈ = 3·2⁷ = 3·128 = 384 in S₈ = 3·(2⁸ − 1)/(2 − 1) = 3·255 = 765;
preizkus: vsota je manjša od dvakratnika zadnjega člena (765 < 768).
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#primer2
besedilo: »Ker je $q \ne 1$, uporabimo formulo za geometrijsko vsoto: $S_8 = 3 \cdot \dfrac{2^8 - 1}{2 - 1} = 3 \cdot 255 = 765$.« -/
theorem primer2 (a : ℕ → ℝ) (h0 : ∀ n, 1 ≤ n → a n ≠ 0) (h1 : a 1 = 3)
    (h : ∀ n, 1 ≤ n → a (n + 1) / a n = 2) :
    a 8 = 384 ∧ ∑ k ∈ range 8, a (k + 1) = 765 ∧ (765 : ℝ) < 2 * 384 := by
  refine ⟨?_, ?_, by norm_num⟩
  · calc a 8 = 3 * 2 ^ 7 := by rw [geom_splosni a 2 h0 h 8 (by norm_num), h1]
      _ = 3 * 128 := by norm_num
      _ = 384 := by norm_num
  · calc ∑ k ∈ range 8, a (k + 1) = 3 * ((2 ^ 8 - 1) / (2 - 1)) := by
          rw [geom_vsota a 2 h0 h (by norm_num) 8, h1]
      _ = 3 * 255 := by norm_num
      _ = 765 := by norm_num

/-- Predpostavke trditve `primer2` se dajo izpolniti. -/
example : ∃ a : ℕ → ℝ, (∀ n, 1 ≤ n → a n ≠ 0) ∧ a 1 = 3 ∧ ∀ n, 1 ≤ n → a (n + 1) / a n = 2 := by
  refine ⟨fun n => 3 * 2 ^ (n - 1), fun n _ => by positivity, by norm_num, fun n hn => ?_⟩
  obtain ⟨k, rfl⟩ := Nat.exists_eq_add_of_le' hn
  simp only [show k + 1 + 1 - 1 = k + 1 by omega, Nat.add_sub_cancel, pow_succ]
  field_simp

/-- Predpostavke trditve `primer2` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ a : ℕ → ℝ, (∀ n, 1 ≤ n → a n ≠ 0) ∧ a 1 = 3 ∧ ∀ n, 1 ≤ n → a (n + 1) / a n = 2 := by
    refine ⟨fun n => 3 * 2 ^ (n - 1), fun n _ => by positivity, by norm_num, fun n hn => ?_⟩
    obtain ⟨k, rfl⟩ := Nat.exists_eq_add_of_le' hn
    simp only [show k + 1 + 1 - 1 = k + 1 by omega, Nat.add_sub_cancel, pow_succ]
    field_simp
  primer2 (h0 := w.choose_spec.1) (h1 := w.choose_spec.2.1) (h := w.choose_spec.2.2)

/-- Razlaga 6, primer 2, preizkus: pri q = 2 je vsak člen večji od vsote vseh prejšnjih
(2ⁿ > 1 + 2 + … + 2ⁿ⁻¹).
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#q2-vecji-od-vsote
besedilo: »Preizkus smiselnosti: vsota je malo manj kot dvakratnik zadnjega člena, kar je pri $q = 2$ pričakovano, saj je vsak člen večji od vsote vseh prejšnjih.« -/
theorem q2_vecji_od_vsote (a₁ : ℝ) (ha : 0 < a₁) (n : ℕ) :
    ∑ k ∈ range n, a₁ * 2 ^ k < a₁ * 2 ^ n := by
  induction n with
  | zero => simpa using ha
  | succ n ih => rw [sum_range_succ, pow_succ]; linarith

/-- Predpostavka trditve `q2_vecji_od_vsote` se da izpolniti (a₁ = 1). -/
example : (0:ℝ) < 1 := one_pos

/-- Predpostavke trditve `q2_vecji_od_vsote` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 1 := one_pos
  q2_vecji_od_vsote (ha := w)

/-- Primer 3, koraka 2–5: 740 = n/2·(36 + 2(n − 1)) = n(n + 17); kvadratna enačba
n² + 17n − 740 = 0 ima (v ℝ) natanko rešitvi 20 in −37; D = 17² + 4·740 = 289 + 2960 = 3249 = 57².
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#primer3-enacba
besedilo: »$D = 17^2 + 4 \cdot 740 = 289 + 2960 = 3249 = 57^2$« -/
theorem primer3_enacba (n : ℝ) :
    (740 = n / 2 * (36 + 2 * (n - 1)) ↔ n = 20 ∨ n = -37) ∧
    n / 2 * (36 + 2 * (n - 1)) = n * (n + 17) := by
  refine ⟨⟨fun h => ?_, ?_⟩, by ring⟩
  · have : (n - 20) * (n + 37) = 0 := by nlinarith
    rcases mul_eq_zero.mp this with h | h
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem primer3_D : (17 : ℝ) ^ 2 + 4 * 740 = 289 + 2960 ∧ (289 + 2960 : ℝ) = 3249 ∧
    (3249 : ℝ) = 57 ^ 2 ∧ (-17 + 57) / 2 = (20 : ℝ) ∧ (-17 - 57) / 2 = (-37 : ℝ) := by norm_num

/-- Primer 3: a₁ = 18, d = 2; Sₙ = 740 velja natanko pri n = 20 (n naravno), in
a₂₀ = 18 + 19·2 = 56; preizkus 20/2·(18 + 56) = 740.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#primer3
besedilo: »Najnižja vrsta: $a_{20} = 18 + 19 \cdot 2 = 56$. Preizkus: $\dfrac{20}{2} \cdot (18 + 56) = 740$.« -/
theorem primer3 (a : ℕ → ℝ) (h1 : a 1 = 18) (h : ∀ n, 1 ≤ n → a (n + 1) - a n = 2) (n : ℕ) :
    (∑ k ∈ range n, a (k + 1) = 740 ↔ n = 20) ∧ a 20 = 56 ∧ (20 : ℝ) / 2 * (18 + 56) = 740 := by
  have a20 : a 20 = 56 := by
    calc a 20 = 18 + 19 * 2 := by rw [aritm_splosni a 2 h 20 (by norm_num), h1]; norm_num
      _ = 56 := by norm_num
  refine ⟨?_, a20, by norm_num⟩
  rw [aritm_vsota' a 2 h n, h1]
  have key := (primer3_enacba (n : ℝ)).1
  constructor
  · intro hs
    rcases key.mp (by linarith) with h20 | h37
    · exact_mod_cast h20
    · have : (0 : ℝ) ≤ n := n.cast_nonneg; linarith
  · rintro rfl; norm_num

/-- Predpostavke trditve `primer3` se dajo izpolniti. -/
example : ∃ a : ℕ → ℝ, a 1 = 18 ∧ ∀ n, 1 ≤ n → a (n + 1) - a n = 2 :=
  ⟨fun n => 18 + ((n : ℝ) - 1) * 2, by norm_num, fun n _ => by push_cast; ring⟩

/-- Predpostavke trditve `primer3` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ a : ℕ → ℝ, a 1 = 18 ∧ ∀ n, 1 ≤ n → a (n + 1) - a n = 2 :=
    ⟨fun n => 18 + ((n : ℝ) - 1) * 2, by norm_num, fun n _ => by push_cast; ring⟩
  primer3 (h1 := w.choose_spec.1) (h := w.choose_spec.2)

/-- Primer 4, korak 1: razlike 2, 6, 12, 20, 30 so 4, 6, 8, 10; količniki 3, 2, 5/3 (≈ 1,67)
niso enaki.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#primer4-razlike
besedilo: »Razlike so $4, 6, 8, 10$, zato zaporedje ni aritmetično. Količniki $3$; $2$; $1{,}67$ … niso enaki, zato tudi ni geometrijsko.« -/
theorem primer4_razlike : ((6 : ℝ) - 2 = 4 ∧ (12 : ℝ) - 6 = 6 ∧ (20 : ℝ) - 12 = 8 ∧ (30 : ℝ) - 20 = 10) ∧
    ((6 : ℝ) / 2 = 3 ∧ (12 : ℝ) / 6 = 2 ∧ (20 : ℝ) / 12 = 5 / 3 ∧ (5 / 3 : ℝ) ≠ 2) := by norm_num

/-- Primer 4, korak 2: če se razlike vsakič povečajo za 2, je a₆ = 30 + 12 = 42 in a₇ = 42 + 14 = 56.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#primer4-nadaljuj
besedilo: »Razlike se vsakič povečajo za $2$. Naslednji razliki sta $12$ in $14$, zato je $a_6 = 30 + 12 = 42$ in $a_7 = 42 + 14 = 56$.« -/
theorem primer4_nadaljuj (a : ℕ → ℝ) (h4 : a 4 = 20) (h5 : a 5 = 30)
    (h : ∀ n, 1 ≤ n → (a (n + 2) - a (n + 1)) - (a (n + 1) - a n) = 2) :
    a 6 = 42 ∧ a 7 = 56 := by
  have e4 := h 4 (by norm_num); have e5 := h 5 (by norm_num)
  norm_num at e4 e5
  have a6 : a 6 = 42 := by
    calc a 6 = 30 + 12 := by linarith
      _ = 42 := by norm_num
  refine ⟨a6, ?_⟩
  calc a 7 = 42 + 14 := by linarith
    _ = 56 := by norm_num

/-- Primer 4, koraka 3–4: domneva aₙ = n(n + 1) da vse dane in nove člene 2, 6, 12, 20, 30, 42, 56
in izpolnjuje pravilo, da se razlike vsakič povečajo za 2 (s tem so predpostavke
`primer4_nadaljuj` izpolnljive).
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#primer4-domneva
besedilo: »Posplošimo: $2 = 1 \cdot 2$, $6 = 2 \cdot 3$, $12 = 3 \cdot 4$, $20 = 4 \cdot 5$, $30 = 5 \cdot 6$. Vsak člen je produkt indeksa in naslednjega števila, domneva je $a_n = n(n + 1)$.« -/
theorem primer4_domneva :
    (List.range 7).map (fun k => (k + 1) * (k + 2)) = [2, 6, 12, 20, 30, 42, 56] ∧
    ∀ n : ℕ, (((n + 2) * (n + 3) : ℝ) - (n + 1) * (n + 2)) - ((n + 1) * (n + 2) - n * (n + 1)) = 2 := by
  exact ⟨by decide, fun n => by ring⟩

/-- Predpostavke trditve `primer4_nadaljuj` se dajo izpolniti (aₙ = n(n + 1)). -/
example : ∃ a : ℕ → ℝ, a 4 = 20 ∧ a 5 = 30 ∧
    ∀ n, 1 ≤ n → (a (n + 2) - a (n + 1)) - (a (n + 1) - a n) = 2 :=
  ⟨fun n => n * (n + 1), by norm_num, by norm_num, fun n _ => by push_cast; ring⟩

/-- Primer 4, korak 5: n(n + 1) = 420 ⇔ n² + n − 420 = 0 ⇔ n = 20 ali n = −21 (v ℝ);
za naravni n je to n = 20.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#primer4-420
besedilo: »Člen $420$: enačba $n(n + 1) = 420$ oziroma $n^2 + n - 420 = 0$ ima rešitvi $n = 20$ in $n = -21$. Indeks je naravno število, zato $n = 20$.« -/
theorem primer4_420 (x : ℝ) (n : ℕ) :
    (x * (x + 1) = 420 ↔ x ^ 2 + x - 420 = 0) ∧ (x ^ 2 + x - 420 = 0 ↔ x = 20 ∨ x = -21) ∧
    (n * (n + 1) = 420 ↔ n = 20) := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => ?_, ?_⟩, ⟨fun h => ?_, ?_⟩⟩
  · have : (x - 20) * (x + 21) = 0 := by linarith
    rcases mul_eq_zero.mp this with h | h
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num
  · have : n ≤ 20 := by nlinarith
    interval_cases n <;> omega
  · rintro rfl; norm_num

/-- Primer 5: aₙ geometrijsko, a₂ = 6, a₅ = 48 ⇒ q³ = 48/6 = 8, q = 2, a₁ = 6/2 = 3,
S₆ = 3·(2⁶ − 1)/(2 − 1) = 3·63 = 189; preizkus 3 + 6 + 12 + 24 + 48 + 96 = 189.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#primer5
besedilo: »$S_6 = 3 \cdot \dfrac{2^6 - 1}{2 - 1} = 3 \cdot 63 = 189$. Preizkus: $3 + 6 + 12 + 24 + 48 + 96 = 189$.« -/
theorem primer5 (a : ℕ → ℝ) (q : ℝ) (h0 : ∀ n, 1 ≤ n → a n ≠ 0)
    (h : ∀ n, 1 ≤ n → a (n + 1) / a n = q) (h2 : a 2 = 6) (h5 : a 5 = 48) :
    q ^ 3 = 8 ∧ q = 2 ∧ a 1 = 3 ∧ ∑ k ∈ range 6, a (k + 1) = 189 ∧
    (3 + 6 + 12 + 24 + 48 + 96 : ℝ) = 189 := by
  have e := geom_splosni a q h0 h
  have h25 : a 5 = a 2 * q ^ 3 := by rw [e 5 (by norm_num), e 2 (by norm_num)]; ring
  have hq3 : q ^ 3 = 8 := by
    calc q ^ 3 = 48 / 6 := by rw [h25, h2] at h5; linarith
      _ = 8 := by norm_num
  have hq : q = 2 := by nlinarith [sq_nonneg (q + 1)]
  have ha1 : a 1 = 3 := by
    have : a 2 = a 1 * q := by rw [e 2 (by norm_num)]; ring
    calc a 1 = a 2 / q := by rw [this, hq]; field_simp
      _ = 6 / 2 := by rw [h2, hq]
      _ = 3 := by norm_num
  refine ⟨hq3, hq, ha1, ?_, by norm_num⟩
  calc ∑ k ∈ range 6, a (k + 1) = 3 * ((2 ^ 6 - 1) / (2 - 1)) := by
        rw [geom_vsota a q h0 h (by rw [hq]; norm_num) 6, ha1, hq]
    _ = 3 * 63 := by norm_num
    _ = 189 := by norm_num

/-- Predpostavke trditve `primer5` se dajo izpolniti. -/
example : ∃ (a : ℕ → ℝ) (q : ℝ), (∀ n, 1 ≤ n → a n ≠ 0) ∧ (∀ n, 1 ≤ n → a (n + 1) / a n = q) ∧
    a 2 = 6 ∧ a 5 = 48 := by
  refine ⟨fun n => 3 * 2 ^ (n - 1), 2, fun n _ => by positivity, fun n hn => ?_, by norm_num,
    by norm_num⟩
  obtain ⟨k, rfl⟩ := Nat.exists_eq_add_of_le' hn
  simp only [show k + 1 + 1 - 1 = k + 1 by omega, Nat.add_sub_cancel, pow_succ]
  field_simp

/-! ## Pogoste napake -/

/-- Predpostavke trditve `primer5` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ (a : ℕ → ℝ) (q : ℝ), (∀ n, 1 ≤ n → a n ≠ 0) ∧ (∀ n, 1 ≤ n → a (n + 1) / a n = q) ∧ a 2 = 6 ∧ a 5 = 48 := by
    refine ⟨fun n => 3 * 2 ^ (n - 1), 2, fun n _ => by positivity, fun n hn => ?_, by norm_num,
      by norm_num⟩
    obtain ⟨k, rfl⟩ := Nat.exists_eq_add_of_le' hn
    simp only [show k + 1 + 1 - 1 = k + 1 by omega, Nat.add_sub_cancel, pow_succ]
    field_simp
  primer5 (h0 := w.choose_spec.choose_spec.1) (h := w.choose_spec.choose_spec.2.1) (h2 := w.choose_spec.choose_spec.2.2.1) (h5 := w.choose_spec.choose_spec.2.2.2)

/-- Pogoste napake 1: prava formula pri n = 1 da a₁: a₁ + 0·d = a₁ in a₁·q⁰ = a₁.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#napaka-n1
besedilo: »Preveri pri $n = 1$: prava formula mora dati $a_1$, saj je $a_1 + 0 \cdot d = a_1$ in $a_1 \cdot q^0 = a_1$.« -/
theorem napaka_n1 (a₁ d q : ℝ) : a₁ + ((1 : ℕ) - 1 : ℝ) * d = a₁ ∧ a₁ * q ^ (1 - 1) = a₁ := by
  simp

/-- Pogoste napake 2: padec za 20 % pusti 80 % (q = 0,8), rast za 5 % da q = 1,05.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#napaka-odstotek
besedilo: »Odstotek namesto količnika.** Če vrednost vsako leto pade za $20\,\%$, ostane $80\,\%$, zato je $q = 0{,}8$, ne $0{,}2$. Pri rasti za $5\,\%$ je $q = 1{,}05$. Količnik pove, kolikšen del prejšnjega člena je naslednji člen.« -/
theorem napaka_odstotek (x : ℝ) : x - 20 / 100 * x = 8 / 10 * x ∧ x + 5 / 100 * x = 105 / 100 * x := by
  constructor <;> ring

/-- Pogoste napake 3: iz 2, 4 vrste ne vemo (aritmetično da 6, geometrijsko 8); 1, 2, 4, 8 ni
aritmetično, ker 4 − 2 ≠ 2 − 1.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#napaka-dva-clena
besedilo: »Vrsta zaporedja iz prvih dveh členov.** Iz $2, 4$ ne moreš vedeti, ali je naslednji člen $6$ (aritmetično) ali $8$ (geometrijsko). Prav tako zaporedje $1, 2, 4, 8$ ni aritmetično, čeprav je $2 - 1 = 1$. Razliko oziroma količnik preveri pri vseh danih parih.« -/
theorem napaka_dva_clena : (4 : ℝ) + (4 - 2) = 6 ∧ (4 : ℝ) * (4 / 2) = 8 ∧ (4 : ℝ) - 2 ≠ 2 - 1 := by
  norm_num

/-- Pogoste napake 4 in »Preveri se« 3: za 1 + 3 + 9 + 27 + 81 Gaussova formula da 5/2·(1 + 81) = 205,
prava vsota pa je (3⁵ − 1)/(3 − 1) = 121; para 1 + 81 in 3 + 27 nimata enake vsote.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#napaka-gauss
besedilo: »Pari $1 + 81$ in $3 + 27$ nimajo enake vsote, zato Gaussov premislek tu ne deluje. Pravilno: $S_5 = \dfrac{3^5 - 1}{3 - 1} = 121$.« -/
theorem napaka_gauss :
    (5 : ℝ) / 2 * (1 + 81) = 205 ∧ ∑ k ∈ range 5, (3 : ℝ) ^ k = (3 ^ 5 - 1) / (3 - 1) ∧
    ((3 : ℝ) ^ 5 - 1) / (3 - 1) = 121 ∧ (121 : ℝ) ≠ 205 ∧ (1 + 81 : ℝ) ≠ 3 + 27 ∧
    (3 : ℝ) ^ 4 = 81 ∧ (3 : ℝ) ^ 5 = 243 := by
  refine ⟨by norm_num, by rw [geom_sum_eq (by norm_num)], by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num⟩

/-- Pogoste napake 5 in »Preveri se« 1: pri a₁ = 5, q = −2 so členi 5, −10, 20, −40 in zaporedje ni
monotono (5 > −10 < 20).
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#napaka-alternira
besedilo: »»Geometrijsko zaporedje z velikim $|q|$ vedno narašča.«** Pri $q = -2$ členi $5, -10, 20, -40$ menjajo predznak, zato zaporedje ni monotono. Pri $a_1 > 0$ monotonost določata predznak $q$ in to, ali je $|q|$ večji ali manjši od $1$.« -/
theorem napaka_alternira :
    (List.range 4).map (fun k => (5 : ℤ) * (-2) ^ k) = [5, -10, 20, -40] ∧
    (-10 : ℤ) < 5 ∧ (-10 : ℤ) < 20 := by decide

/-! ## Drugače: Bolj natančno; ustna vprašanja -/

/-- Bolj natančno: v aritmetičnem zaporedju je vsak člen (razen prvega) aritmetična sredina
sosedov: aₙ = (aₙ₋₁ + aₙ₊₁)/2 za n ≥ 2.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#aritm-sredina
besedilo: »Pri aritmetičnem zaporedju je vsak člen (razen prvega) **aritmetična sredina** sosedov: $a_n = \dfrac{a_{n-1} + a_{n+1}}{2}$, ker je $a_{n-1} = a_n - d$ in $a_{n+1} = a_n + d$.« -/
theorem aritm_sredina (a : ℕ → ℝ) (d : ℝ) (h : ∀ n, 1 ≤ n → a (n + 1) - a n = d) (n : ℕ)
    (hn : 2 ≤ n) : a n = (a (n - 1) + a (n + 1)) / 2 := by
  obtain ⟨k, rfl⟩ := Nat.exists_eq_add_of_le' hn
  have h1 := h (k + 1) (by omega)
  have h2 := h (k + 2) (by omega)
  simp only [show k + 2 - 1 = k + 1 by omega]
  linarith

/-- Bolj natančno: v geometrijskem zaporedju s pozitivnimi členi je vsak člen (razen prvega)
geometrijska sredina sosedov: aₙ = √(aₙ₋₁·aₙ₊₁) za n ≥ 2, ker je aₙ₋₁·aₙ₊₁ = aₙ².
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#geom-sredina
besedilo: »Pri geometrijskem zaporedju s pozitivnimi členi je vsak člen **geometrijska sredina** sosedov: $a_n = \sqrt{a_{n-1}\,a_{n+1}}$, ker je $a_{n-1}\,a_{n+1} = \dfrac{a_n}{q} \cdot a_n q = a_n^2$.« -/
theorem geom_sredina (a : ℕ → ℝ) (q : ℝ) (hp : ∀ n, 1 ≤ n → 0 < a n)
    (h : ∀ n, 1 ≤ n → a (n + 1) / a n = q) (n : ℕ) (hn : 2 ≤ n) :
    a (n - 1) * a (n + 1) = a n ^ 2 ∧ a n = Real.sqrt (a (n - 1) * a (n + 1)) := by
  obtain ⟨k, rfl⟩ := Nat.exists_eq_add_of_le' hn
  simp only [show k + 2 - 1 = k + 1 by omega]
  have p1 := hp (k + 1) (by omega)
  have p2 := hp (k + 2) (by omega)
  have q1 := h (k + 1) (by omega)
  have q2 := h (k + 2) (by omega)
  rw [div_eq_iff p1.ne'] at q1
  rw [div_eq_iff p2.ne'] at q2
  have e : a (k + 1) * a (k + 2 + 1) = a (k + 2) ^ 2 := by
    rw [q2, show k + 2 = k + 1 + 1 from rfl, q1]; ring
  refine ⟨e, ?_⟩
  rw [e, Real.sqrt_sq p2.le]

/-- Predpostavke trditve `geom_sredina` se dajo izpolniti. -/
example : ∃ (a : ℕ → ℝ) (q : ℝ), (∀ n, 1 ≤ n → 0 < a n) ∧ ∀ n, 1 ≤ n → a (n + 1) / a n = q :=
  ⟨fun _ => 1, 1, fun _ _ => one_pos, fun _ _ => by norm_num⟩

/-- Bolj natančno: a₁ + (n − 1)d = d·n + (a₁ − d) (linearna funkcija n), in pri q ≠ 0, n ≥ 1
a₁qⁿ⁻¹ = (a₁/q)·qⁿ.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#linearna-eksponentna
besedilo: »Splošni člen $a_n = a_1 + (n-1)d = d\,n + (a_1 - d)$ je linearna funkcija spremenljivke $n$, zato točke ležijo na premici. Splošni člen $a_n = a_1 q^{\,n-1} = \dfrac{a_1}{q} \cdot q^n$ je pri $q > 0$, $q \ne 1$ eksponentna funkcija, zožena na naravna števila.« -/
theorem linearna_eksponentna (a₁ d q : ℝ) (n : ℕ) (hq : q ≠ 0) (hn : 1 ≤ n) :
    a₁ + ((n : ℝ) - 1) * d = d * n + (a₁ - d) ∧ a₁ * q ^ (n - 1) = a₁ / q * q ^ n := by
  refine ⟨by ring, ?_⟩
  obtain ⟨k, rfl⟩ := Nat.exists_eq_add_of_le' hn
  simp only [Nat.add_sub_cancel, pow_succ]
  field_simp

/-- Predpostavki trditve `linearna_eksponentna` se dajo izpolniti (q = 2, n = 1). -/
example : (2:ℝ) ≠ 0 ∧ 1 ≤ (1:ℕ) := by norm_num

/-- Predpostavke trditve `linearna_eksponentna` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2:ℝ) ≠ 0 ∧ 1 ≤ (1:ℕ) := by norm_num
  linearna_eksponentna (hq := w.1) (hn := w.2)

/-- Bolj natančno: indukcijski dokaz formule za vsoto (q ≠ 1): pri n = 1 je a₁(q − 1)/(q − 1) = a₁,
in a₁(qⁿ − 1)/(q − 1) + a₁qⁿ = a₁(qⁿ⁺¹ − 1)/(q − 1).
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#geom-indukcija
besedilo: »Formulo za vsoto dokažemo tudi z matematično indukcijo. Za $q \ne 1$ velja pri $n = 1$: $a_1 \frac{q - 1}{q - 1} = a_1$. Iz $S_n$ dobimo $S_{n+1} = S_n + a_1 q^n = a_1 \frac{q^n - 1 + q^{n+1} - q^n}{q - 1} = a_1 \frac{q^{n+1} - 1}{q - 1}$.« -/
theorem geom_indukcija (a₁ q : ℝ) (hq : q ≠ 1) (n : ℕ) :
    a₁ * ((q - 1) / (q - 1)) = a₁ ∧
    a₁ * ((q ^ n - 1) / (q - 1)) + a₁ * q ^ n = a₁ * ((q ^ n - 1 + q ^ (n + 1) - q ^ n) / (q - 1)) ∧
    a₁ * ((q ^ n - 1 + q ^ (n + 1) - q ^ n) / (q - 1)) = a₁ * ((q ^ (n + 1) - 1) / (q - 1)) := by
  have : q - 1 ≠ 0 := sub_ne_zero.mpr hq
  refine ⟨by field_simp, ?_, by ring_nf⟩
  field_simp; ring

/-- Predpostavka trditve `geom_indukcija` se da izpolniti (q = 2). -/
example : (2:ℝ) ≠ 1 := by norm_num

/-- Predpostavke trditve `geom_indukcija` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2:ℝ) ≠ 1 := by norm_num
  geom_indukcija (hq := w)

/-- Ustno vprašanje 3: (a + d)² = a(a + 2d) ⇔ d² = 0 ⇔ d = 0 (enako-vrstica RAČUN: (a+d)² − a(a+2d) = d²).
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#ustno3-enacba
besedilo: »$(a + d)^2 = a(a + 2d)$« -/
theorem ustno3_enacba (a d : ℝ) :
    (a + d) ^ 2 - a * (a + 2 * d) = d ^ 2 ∧ ((a + d) ^ 2 = a * (a + 2 * d) ↔ d = 0) := by
  refine ⟨by ring, ⟨fun h => ?_, fun h => by subst h; ring⟩⟩
  have : d ^ 2 = 0 := by linarith
  exact pow_eq_zero_iff (n := 2) (by norm_num) |>.mp this

/-- Ustno vprašanje 3: zaporedje, ki je hkrati aritmetično (diferenca d) in geometrijsko (neničelni
členi, količnik q), je konstantno: d = 0 in q = 1. Primer 5, 5, 5, … to izpolni.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#ustno3
besedilo: »Primer je konstantno zaporedje $5, 5, 5, \ldots$ z diferenco $d = 0$ in količnikom $q = 1$.« -/
theorem ustno3 (a : ℕ → ℝ) (d q : ℝ) (ha : ∀ n, 1 ≤ n → a (n + 1) - a n = d)
    (h0 : ∀ n, 1 ≤ n → a n ≠ 0) (hg : ∀ n, 1 ≤ n → a (n + 1) / a n = q) :
    d = 0 ∧ q = 1 ∧ ∀ n, 1 ≤ n → a n = a 1 := by
  have e := aritm_splosni a d ha
  have g := geom_splosni a q h0 hg
  have h2 : a 1 + d = a 1 * q := by have := e 2 (by norm_num); have := g 2 (by norm_num); norm_num at *; linarith
  have h3 : a 1 + 2 * d = a 1 * q ^ 2 := by
    have := e 3 (by norm_num); have := g 3 (by norm_num); norm_num at *; linarith
  have hd : (a 1 + d) ^ 2 = a 1 * (a 1 + 2 * d) := by rw [h2, h3]; ring
  have d0 := (ustno3_enacba (a 1) d).2.mp hd
  refine ⟨d0, ?_, aritm_konst a (by rw [← d0]; exact ha)⟩
  subst d0
  have : a 1 * (q - 1) = 0 := by linarith
  rcases mul_eq_zero.mp this with h | h
  · exact absurd h (h0 1 le_rfl)
  · linarith

/-- Predpostavke trditve `ustno3` se dajo izpolniti. -/
example : ∃ a : ℕ → ℝ, (∀ n, 1 ≤ n → a (n + 1) - a n = 0) ∧ (∀ n, 1 ≤ n → a n ≠ 0) ∧
    ∀ n, 1 ≤ n → a (n + 1) / a n = 1 :=
  ⟨fun _ => 5, fun _ _ => by norm_num, fun _ _ => by norm_num, fun _ _ => by norm_num⟩

/-! ## Za maturo -/

/-- Predpostavke trditve `ustno3` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ a : ℕ → ℝ, (∀ n, 1 ≤ n → a (n + 1) - a n = 0) ∧ (∀ n, 1 ≤ n → a n ≠ 0) ∧ ∀ n, 1 ≤ n → a (n + 1) / a n = 1 :=
    ⟨fun _ => 5, fun _ _ => by norm_num, fun _ _ => by norm_num, fun _ _ => by norm_num⟩
  ustno3 (ha := w.choose_spec.1) (h0 := w.choose_spec.2.1) (hg := w.choose_spec.2.2)

/-- Naloga 1: a₁ = 7, a₁₀ = 43 ⇒ 9d = 36, d = 4; vstavljena števila 11, 15, …, 39;
S₁₀ = 10/2·(7 + 43) = 5·50 = 250.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#matura1
besedilo: »$S_{10} = \dfrac{10}{2}\,(7 + 43) = 5 \cdot 50 = 250$« -/
theorem matura1 (a : ℕ → ℝ) (d : ℝ) (h : ∀ n, 1 ≤ n → a (n + 1) - a n = d) (h1 : a 1 = 7)
    (h10 : a 10 = 43) :
    d = 4 ∧ (a 2 = 11 ∧ a 3 = 15 ∧ a 4 = 19 ∧ a 5 = 23 ∧ a 6 = 27 ∧ a 7 = 31 ∧ a 8 = 35 ∧ a 9 = 39) ∧
    ∑ k ∈ range 10, a (k + 1) = 250 := by
  have e := aritm_splosni a d h
  have hd : d = 4 := by
    have h9 : 9 * d = 36 := by have := e 10 (by norm_num); rw [h1, h10] at this; norm_num at this; linarith
    linarith
  subst hd
  refine ⟨rfl, ?_, ?_⟩
  · refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_⟩ <;>
      (rw [e _ (by norm_num), h1]; norm_num)
  · calc ∑ k ∈ range 10, a (k + 1) = 10 / 2 * (7 + 43) := by
          rw [aritm_vsota a 4 h 10 (by norm_num), h1, h10]; norm_num
      _ = 5 * 50 := by norm_num
      _ = 250 := by norm_num

/-- Predpostavke trditve `matura1` se dajo izpolniti. -/
example : ∃ (a : ℕ → ℝ) (d : ℝ), (∀ n, 1 ≤ n → a (n + 1) - a n = d) ∧ a 1 = 7 ∧ a 10 = 43 :=
  ⟨fun n => 7 + ((n : ℝ) - 1) * 4, 4, fun n _ => by push_cast; ring, by norm_num, by norm_num⟩

/-- Predpostavke trditve `matura1` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ (a : ℕ → ℝ) (d : ℝ), (∀ n, 1 ≤ n → a (n + 1) - a n = d) ∧ a 1 = 7 ∧ a 10 = 43 :=
    ⟨fun n => 7 + ((n : ℝ) - 1) * 4, 4, fun n _ => by push_cast; ring, by norm_num, by norm_num⟩
  matura1 (h := w.choose_spec.choose_spec.1) (h1 := w.choose_spec.choose_spec.2.1) (h10 := w.choose_spec.choose_spec.2.2)

/-- Naloga 2 a): a₆ = 120·1,08⁵ = 176,319… ≈ 176,3 (RAČUN: 120·1,08⁵).
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#matura2a
besedilo: »$a_6 = 120 \cdot 1{,}08^5 = 176{,}319\ldots \approx 176{,}3$« -/
theorem matura2a : 176319 / 1000 ≤ (120 : ℝ) * (108 / 100) ^ 5 ∧
    (120 : ℝ) * (108 / 100) ^ 5 < 17632 / 100 := by norm_num

/-- Naloga 2 b): S₁₀ = 120·(1,08¹⁰ − 1)/(1,08 − 1) = 1738,387… ≈ 1738,4.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#matura2b
besedilo: »$S_{10} = 120 \cdot \dfrac{1{,}08^{10} - 1}{1{,}08 - 1} = 1738{,}387\ldots \approx 1738{,}4$« -/
theorem matura2b : 1738387 / 1000 ≤ (120 : ℝ) * ((108 / 100) ^ 10 - 1) / (108 / 100 - 1) ∧
    (120 : ℝ) * ((108 / 100) ^ 10 - 1) / (108 / 100 - 1) < 1738388 / 1000 := by norm_num

/-- Naloga 2 c): 120·1,08ⁿ⁻¹ > 250 velja (za n ≥ 1) natanko pri n ≥ 11; a₁₀ = 120·1,08⁹ ≈ 239,9,
a₁₁ = 120·1,08¹⁰ ≈ 259,1.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#matura2c
besedilo: »c) Najmanjše celo število, ki to izpolni, je $n - 1 = 10$, torej $n = 11$. Preizkus: $a_{10} = 120 \cdot 1{,}08^9 \approx 239{,}9$ in $a_{11} = 120 \cdot 1{,}08^{10} \approx 259{,}1$.« -/
theorem matura2c (n : ℕ) (hn : 1 ≤ n) :
    (250 < (120 : ℝ) * (108 / 100) ^ (n - 1) ↔ 11 ≤ n) ∧
    (23985 / 100 ≤ (120 : ℝ) * (108 / 100) ^ 9 ∧ (120 : ℝ) * (108 / 100) ^ 9 < 23995 / 100) ∧
    (25905 / 100 ≤ (120 : ℝ) * (108 / 100) ^ 10 ∧ (120 : ℝ) * (108 / 100) ^ 10 < 25915 / 100) := by
  refine ⟨⟨fun h => ?_, fun h => ?_⟩, by norm_num, by norm_num⟩
  · by_contra hlt
    have : n - 1 ≤ 9 := by omega
    have := pow_le_pow_right₀ (show (1 : ℝ) ≤ 108 / 100 by norm_num) this
    have : (120 : ℝ) * (108 / 100) ^ 9 < 250 := by norm_num
    nlinarith
  · have h' := pow_le_pow_right₀ (show (1 : ℝ) ≤ 108 / 100 by norm_num) (show 10 ≤ n - 1 by omega)
    have : (250 : ℝ) < 120 * (108 / 100) ^ 10 := by norm_num
    nlinarith

/-- Predpostavka trditve `matura2c` se da izpolniti (n = 1). -/
example : 1 ≤ (1:ℕ) := le_rfl

set_option exponentiation.threshold 2000 in
/-- Predpostavke trditve `matura2c` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : 1 ≤ (1:ℕ) := le_rfl
  matura2c (hn := w)

/-- Naloga 2 c): 1,08ⁿ⁻¹ > 25/12 ⇔ 120·1,08ⁿ⁻¹ > 250, in log(25/12)/log 1,08 ≈ 9,54
(9,535 < … < 9,545). Primerjava potenc 1,08¹⁹⁰⁷ < (25/12)²⁰⁰ potrebuje višji prag za računanje
potenc (`exponentiation.threshold`).
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#matura2c-log
besedilo: »c) Pogoj $120 \cdot 1{,}08^{\,n-1} > 250$ preoblikujemo v $1{,}08^{\,n-1} > \dfrac{25}{12}$ in logaritmiramo: $n - 1 > \dfrac{\log \frac{25}{12}}{\log 1{,}08} \approx 9{,}54$.« -/
theorem matura2c_log :
    (∀ x : ℝ, 250 < 120 * x ↔ 25 / 12 < x) ∧
    9535 / 1000 < Real.log (25 / 12) / Real.log (108 / 100) ∧
    Real.log (25 / 12) / Real.log (108 / 100) < 9545 / 1000 := by
  have hl : 0 < Real.log (108 / 100) := Real.log_pos (by norm_num)
  refine ⟨fun x => ⟨fun h => by linarith, fun h => by linarith⟩, ?_, ?_⟩
  · rw [lt_div_iff₀ hl]
    have : (1907 : ℝ) * Real.log (108 / 100) < 200 * Real.log (25 / 12) := by
      have e1 := Real.log_pow (108 / 100 : ℝ) 1907
      have e2 := Real.log_pow (25 / 12 : ℝ) 200
      push_cast at e1 e2
      rw [← e1, ← e2]
      exact Real.log_lt_log (by positivity) (by norm_num)
    linarith
  · rw [div_lt_iff₀ hl]
    have : (200 : ℝ) * Real.log (25 / 12) < 1909 * Real.log (108 / 100) := by
      have e1 := Real.log_pow (25 / 12 : ℝ) 200
      have e2 := Real.log_pow (108 / 100 : ℝ) 1909
      push_cast at e1 e2
      rw [← e1, ← e2]
      exact Real.log_lt_log (by positivity) (by norm_num)
    linarith

/-- Naloga 2 d): 10/2·(2·120 + 9·12) = 5·348 = 1740; razlika 1740 − 1738,387… ≈ 1,6 (sotekmovalec
prevozi več).
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#matura2d
besedilo: »V desetih tednih prevozi $\dfrac{10}{2}\,(2 \cdot 120 + 9 \cdot 12) = 5 \cdot 348 = 1740$ (km).« -/
theorem matura2d :
    (10 : ℝ) / 2 * (2 * 120 + 9 * 12) = 5 * 348 ∧ (5 * 348 : ℝ) = 1740 ∧
    1612 / 1000 ≤ 1740 - (120 : ℝ) * ((108 / 100) ^ 10 - 1) / (108 / 100 - 1) ∧
    1740 - (120 : ℝ) * ((108 / 100) ^ 10 - 1) / (108 / 100 - 1) < 1613 / 1000 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 2: a₁ = 4, d = 3 ⇒ a₁₅ = 4 + 14·3 = 46 (napačna odgovora: 4 + 15·3 = 49 in
4·3¹⁴ = 19131876).
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#kviz2
besedilo: »$a_{15} = 4 + 14 \cdot 3 = 46$« -/
theorem kviz2 (a : ℕ → ℝ) (h1 : a 1 = 4) (h : ∀ n, 1 ≤ n → a (n + 1) - a n = 3) :
    a 15 = 46 ∧ (4 : ℝ) + 15 * 3 = 49 ∧ (4 : ℝ) * 3 ^ 14 = 19131876 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  calc a 15 = 4 + 14 * 3 := by rw [aritm_splosni a 3 h 15 (by norm_num), h1]; norm_num
    _ = 46 := by norm_num

/-- Predpostavke trditve `kviz2` se dajo izpolniti. -/
example : ∃ a : ℕ → ℝ, a 1 = 4 ∧ ∀ n, 1 ≤ n → a (n + 1) - a n = 3 :=
  ⟨fun n => 4 + ((n : ℝ) - 1) * 3, by norm_num, fun n _ => by push_cast; ring⟩

/-- Predpostavke trditve `kviz2` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ a : ℕ → ℝ, a 1 = 4 ∧ ∀ n, 1 ≤ n → a (n + 1) - a n = 3 :=
    ⟨fun n => 4 + ((n : ℝ) - 1) * 3, by norm_num, fun n _ => by push_cast; ring⟩
  kviz2 (h1 := w.choose_spec.1) (h := w.choose_spec.2)

/-- Preveri se 4: a₁ = 1; aritmetično z d = 10 ima S₈ = 8/2·(1 + 71) = 288 in a₈ = 71, geometrijsko
s q = 2 ima S₈ = (2⁸ − 1)/(2 − 1) = 255 in a₈ = 128; pri 9 členih je 369 < 511.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#kviz4
besedilo: »Aritmetično: $S_8 = \dfrac{8}{2} \cdot (1 + 71) = 288$. Geometrijsko: $S_8 = \dfrac{2^8 - 1}{2 - 1} = 255$.« -/
theorem kviz4 :
    (1 : ℝ) + 7 * 10 = 71 ∧ (8 : ℝ) / 2 * (1 + 71) = 288 ∧ ((2 : ℝ) ^ 8 - 1) / (2 - 1) = 255 ∧
    (255 : ℝ) < 288 ∧ (2 : ℝ) ^ 7 = 128 ∧ (9 : ℝ) / 2 * (1 + 81) = 369 ∧
    ((2 : ℝ) ^ 9 - 1) / (2 - 1) = 511 ∧ (369 : ℝ) < 511 := by norm_num

/-- Preveri se 5: 500·0,8³ = 256 (po 3 letih); 500·0,8² = 320 (po 2 letih); 500·0,2³ = 4;
500 − 3·100 = 200.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#kviz5
besedilo: »po $3$ letih je vrtalnik vreden $500 \cdot 0{,}8^3 = 256\,\text{€}$.« -/
theorem kviz5 : (500 : ℝ) * (8 / 10) ^ 3 = 256 ∧ (500 : ℝ) * (8 / 10) ^ 2 = 320 ∧
    (500 : ℝ) * (2 / 10) ^ 3 = 4 ∧ (500 : ℝ) - 3 * 100 = 200 := by norm_num

/-- Preveri se 6: 1, 5, 11, 19, 29 ima razlike 4, 6, 8, 10, naslednja je 12, a₆ = 29 + 12 = 41; splošni
člen n² + n − 1 da vse te člene (RAČUN: 6² + 6 − 1 = 41); 5/1 ≠ 11/5.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#kviz6
besedilo: »Razlike so $4, 6, 8, 10$, naslednja je $12$: $a_6 = 29 + 12 = 41$. Splošni člen je $a_n = n^2 + n - 1$.« -/
theorem kviz6 :
    (List.range 6).map (fun k => (k + 1) ^ 2 + (k + 1) - 1) = [1, 5, 11, 19, 29, 41] ∧
    29 + 12 = 41 ∧ (5 : ℝ) / 1 ≠ 11 / 5 := by
  refine ⟨by decide, by norm_num, by norm_num⟩

/-- Preveri se 7: aₙ = n(n + 2) = (n + 1)² − 1 da 3, 8, 15, 24; 5n − 2 da tretji člen 13,
n² + 2 da drugi člen 6, 3n da drugi člen 6.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#kviz7
besedilo: »$1 \cdot 3 = 3$, $2 \cdot 4 = 8$, $3 \cdot 5 = 15$, $4 \cdot 6 = 24$. Vsak člen je za $1$ manjši od kvadrata: $a_n = (n + 1)^2 - 1 = n(n + 2)$.« -/
theorem kviz7 :
    (List.range 4).map (fun k => (k + 1) * (k + 3)) = [3, 8, 15, 24] ∧
    (∀ n : ℝ, (n + 1) ^ 2 - 1 = n * (n + 2)) ∧
    5 * 3 - 2 = 13 ∧ 2 ^ 2 + 2 = 6 ∧ 3 * 2 = 6 := by
  exact ⟨by decide, fun n => by ring, by norm_num, by norm_num, by norm_num⟩

/-- RAČUN: (43 − 7)/9 = 4, 10/2·(7 + 43) = 250, 7 + 8·4 = 39, 10/2·(2·120 + 9·12) = 1740,
3⁵ + 1 = 244, 2⁶ − 1 = 63, 6·7 = 42, 7·8 = 56.
trditev: MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje#racun
besedilo: »$\dfrac{10}{2}\,(2 \cdot 120 + 9 \cdot 12) = 5 \cdot 348 = 1740$« -/
theorem racun : ((43 : ℝ) - 7) / 9 = 4 ∧ (10 : ℝ) / 2 * (7 + 43) = 250 ∧ (7 : ℝ) + 8 * 4 = 39 ∧
    (10 : ℝ) / 2 * (2 * 120 + 9 * 12) = 1740 ∧ (3 : ℝ) ^ 5 + 1 = 244 ∧ (2 : ℝ) ^ 6 - 1 = 63 ∧
    (6 : ℝ) * 7 = 42 ∧ (7 : ℝ) * 8 = 56 := by norm_num

end Evklid.Lekcije.MAT_SS_4.AritmeticnoInGeometrijskoZaporedje
