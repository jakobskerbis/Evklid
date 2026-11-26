/-
vir: content/lessons/MAT-OS-6/veckratniki-in-delitelji.md
sha256: 798a6018547b6c52da0d2b3729f1f74866febd7ae17c125560ba8893cb43eaf2
Model: števila so naravna (ℕ); »b je delitelj a« je b ∣ a, D_a je `Nat.divisors a`; večkratniki števila b so
b · n z n ≥ 1 (lekcija šteje naravna števila od 1, zato 0 ni med večkratniki); a^n je `a ^ n`, »a : b« je `/` (v
trditvah se deljenje izide), ostanek je `%`.
Lean: v Leanu 0 ∣ a le za a = 0 in vsako število deli 0, D(0) = ∅; zato imajo splošne trditve o deliteljih pogoj
a ≠ 0, o večkratnikih pa b ≠ 0 (kjer ga potrebujejo). Lean bere `3 * 2 ^ 3` kot 3 · (2³), tj. potenco pred
množenjem, kot zahteva dogovor lekcije.
Ni v Leanu: zgodba o aplikaciji in risbe (premica, mreža); frekvence kot fizika (dokazani računi 55 · 2 = 110,
…, 55 · 2³ = 440); imena osnova, eksponent, kvadrat, kub in branje »dva na tretjo« (izrazoslovje); napotek za
simulacijo (dokazano D₂₄ in D₁₃ = {1, 13}); analogiji ploščic in ponavljalnega znaka ter vsakdanji primeri kot
zgodbe (njihovi računi so dokazani); vrstni red »oklepaji, potence, množenje in deljenje, seštevanje in
odštevanje« kot dogovor (dokazane vrednosti izrazov po njem); zadnji kviz (razvrščanje korakov) je navodilo,
dokazan je D₃₀ in koraki.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.VeckratnikiInDelitelji

/-! ## Razlaga 1: večkratniki -/

/-- Razlaga 1: boben udari na 4, 8, 12, 16, 20, 24 = 4 · 1, …, 4 · 6: to so natanko večkratniki 4 med 1 in 24.
trditev: MAT-OS-6/veckratniki-in-delitelji#boben
besedilo: »Boben udari na dobah $4, 8, 12, 16, 20, 24$.« -/
theorem boben : (Finset.Icc 1 24).filter (4 ∣ ·) = {4, 8, 12, 16, 20, 24} ∧
    (4 * 1, 4 * 2, 4 * 3, 4 * 4, 4 * 5, 4 * 6) = (4, 8, 12, 16, 20, 24) := by
  decide

/-- Razlaga 1 in Povzetek: večkratnikov števila b ≠ 0 (b · 1, b · 2, …) je neskončno mnogo, najmanjši je b.
trditev: MAT-OS-6/veckratniki-in-delitelji#neskoncno
besedilo: »Večkratnikov je zato **neskončno mnogo**. Najmanjši večkratnik števila $4$ je $4$ sam.« -/
theorem neskoncno (b : ℕ) (hb : b ≠ 0) :
    {m : ℕ | ∃ n, 1 ≤ n ∧ m = b * n}.Infinite ∧ ∀ n, 1 ≤ n → b ≤ b * n := by
  refine ⟨?_, fun _ hn => Nat.le_mul_of_pos_right b hn⟩
  apply Set.infinite_of_injective_forall_mem (f := fun k : ℕ => b * (k + 1))
  · intro i j h
    have := Nat.eq_of_mul_eq_mul_left (Nat.pos_of_ne_zero hb) h
    omega
  · intro k
    exact ⟨k + 1, by omega, rfl⟩

example := (neskoncno 4 (by norm_num)).2 3 (by norm_num)

/-- Razlaga 1 (premisli): 30 = 4 · 7 + 2, zato 4 ne deli 30; skoki pristanejo na 28 in 32. Splošno: n je
večkratnik 4 natanko tedaj, ko je ostanek pri deljenju s 4 enak 0.
trditev: MAT-OS-6/veckratniki-in-delitelji#trideset
besedilo: »Število je večkratnik števila $4$ samo, če se deljenje s $4$ izide brez ostanka.« -/
theorem trideset : 30 / 4 = 7 ∧ 30 % 4 = 2 ∧ ¬ 4 ∣ 30 ∧ 4 ∣ 28 ∧ 4 ∣ 32 ∧ ∀ n : ℕ, 4 ∣ n ↔ n % 4 = 0 :=
  ⟨rfl, rfl, by decide, by decide, by decide, fun _ => Nat.dvd_iff_mod_eq_zero⟩

/-! ## Razlaga 2–4: delitelji -/

/-- Razlaga 2: 24 = 1 · 24 = 2 · 12 = 3 · 8 = 4 · 6; s 5 ne gre (24 : 5 = 4, ostanek 4).
trditev: MAT-OS-6/veckratniki-in-delitelji#pari-24
besedilo: »S $5$ dobami v taktu ne gre: $24 : 5 = 4$, ostanek $4$, zadnji takt bi bil nepopoln.« -/
theorem pari_24 : 24 = 1 * 24 ∧ 24 = 2 * 12 ∧ 24 = 3 * 8 ∧ 24 = 4 * 6 ∧ 24 / 5 = 4 ∧ 24 % 5 = 4 ∧ ¬ 5 ∣ 24 := by
  decide

/-- Razlaga 2 in Povzetek: deliteljev števila a ≠ 0 je končno mnogo, med njimi sta 1 in a, noben ni večji od a.
trditev: MAT-OS-6/veckratniki-in-delitelji#koncno
besedilo: »Teh je **končno mnogo**: med njimi sta vedno $1$ in število samo, noben pa ni večji od števila.« -/
theorem koncno (a : ℕ) (ha : a ≠ 0) :
    {d : ℕ | d ∣ a}.Finite ∧ 1 ∣ a ∧ a ∣ a ∧ ∀ d, d ∣ a → d ≤ a := by
  refine ⟨?_, one_dvd a, dvd_refl a, fun d hd => Nat.le_of_dvd (Nat.pos_of_ne_zero ha) hd⟩
  apply (Nat.divisors a).finite_toSet.subset
  intro d hd
  have hd' : d ∣ a := hd
  simp [Nat.mem_divisors, hd', ha]

example := (koncno 24 (by norm_num)).2.2.2 6 (by norm_num)

/-- Razlaga 2 (simulacija): 13 ima le delitelja 1 in 13; 24 ima več deliteljev.
trditev: MAT-OS-6/veckratniki-in-delitelji#trinajst
besedilo: »$13$ pa samo v eno vrsto, ker ima le delitelja $1$ in $13$.« -/
theorem trinajst : Nat.divisors 13 = {1, 13} ∧ 2 < (Nat.divisors 24).card := by decide

/-- Razlaga 3, 4 in Povzetek: a je večkratnik b (a = b · n) natanko tedaj, ko je b delitelj a; večkratniki
(n ≥ 1) niso manjši od b, delitelji števila a ≠ 0 niso večji od a.
trditev: MAT-OS-6/veckratniki-in-delitelji#dve-imeni
besedilo: »Iz $a = b \cdot n$ sledi: $a$ je večkratnik števila $b$, $b$ je delitelj števila $a$.« -/
theorem dve_imeni (a b : ℕ) : ((∃ n, a = b * n) ↔ b ∣ a) ∧ (∀ n, 1 ≤ n → b ≤ b * n) ∧
    (a ≠ 0 → b ∣ a → b ≤ a) :=
  ⟨Iff.rfl, fun _ hn => Nat.le_mul_of_pos_right b hn, fun ha h => Nat.le_of_dvd (Nat.pos_of_ne_zero ha) h⟩

example := (dve_imeni 24 4).2.2 (by norm_num) (by norm_num)

/-- Razlaga 3: 24 = 4 · 6, zato je 24 večkratnik 4 in 4 delitelj 24.
trditev: MAT-OS-6/veckratniki-in-delitelji#zapis-24
besedilo: »Zapis $24 = 4 \cdot 6$ pove dvoje hkrati: $24$ je večkratnik števila $4$ in $4$ je delitelj števila $24$.« -/
theorem zapis_24 : 24 = 4 * 6 ∧ 4 ∣ 24 := by decide

/-- Razlaga 4: V₄ = {4, 8, 12, …} (pozitivni večkratniki 4) in D₂₄ = {1, 2, 3, 4, 6, 8, 12, 24}.
trditev: MAT-OS-6/veckratniki-in-delitelji#v4-d24
besedilo: »$$D_{24} = \{1, 2, 3, 4, 6, 8, 12, 24\}$$« -/
theorem v4_d24 : Nat.divisors 24 = {1, 2, 3, 4, 6, 8, 12, 24} ∧
    {m : ℕ | ∃ n, 1 ≤ n ∧ m = 4 * n} = {m | 0 < m ∧ 4 ∣ m} := by
  refine ⟨by decide, ?_⟩
  ext m
  show (∃ n, 1 ≤ n ∧ m = 4 * n) ↔ 0 < m ∧ 4 ∣ m
  constructor
  · rintro ⟨n, hn, rfl⟩
    exact ⟨by omega, dvd_mul_right 4 n⟩
  · rintro ⟨hm, n, rfl⟩
    exact ⟨n, by omega, rfl⟩

/-! ## Razlaga 5: delitelji v parih -/

/-- Razlaga 5 in Povzetek: 36 = 1 · 36 = 2 · 18 = 3 · 12 = 4 · 9 = 6 · 6, 5 ne deli 36 (ostanek 1),
D₃₆ = {1, 2, 3, 4, 6, 9, 12, 18, 36}.
trditev: MAT-OS-6/veckratniki-in-delitelji#d36
besedilo: »Torej: $D_{36} = \{1, 2, 3, 4, 6, 9, 12, 18, 36\}$.« -/
theorem d36 : 36 = 1 * 36 ∧ 36 = 2 * 18 ∧ 36 = 3 * 12 ∧ 36 = 4 * 9 ∧ 36 = 6 * 6 ∧ 36 % 5 = 1 ∧
    Nat.divisors 36 = {1, 2, 3, 4, 6, 9, 12, 18, 36} := by
  decide

/-- Razlaga 5 in Pogoste napake 3: delitelji pridejo v parih: če d deli a ≠ 0, je tudi a : d delitelj in
d · (a : d) = a; delitelj d z d · d > a ima partnerja a : d, manjšega od d (zato iskanje konča, ko se faktorja
srečata).
trditev: MAT-OS-6/veckratniki-in-delitelji#v-parih
besedilo: »Delitelji pridejo v parih, kot stranici pravokotnika.« -/
theorem v_parih (a d : ℕ) (hd : d ∣ a) : a / d ∣ a ∧ d * (a / d) = a ∧ (a < d * d → a / d < d) := by
  refine ⟨Nat.div_dvd_of_dvd hd, Nat.mul_div_cancel' hd, fun h => ?_⟩
  have h1 := Nat.mul_div_cancel' hd
  by_contra h2
  have : d * d ≤ d * (a / d) := Nat.mul_le_mul_left d (Nat.le_of_not_lt h2)
  omega

example := (v_parih 36 9 (by norm_num)).2.2 (by norm_num)

/-! ## Razlaga 6: potence -/

/-- Razlaga 6: 55 · 2 = 110, 55 · 2 · 2 = 220, 55 · 2 · 2 · 2 = 440 = 55 · 2³.
trditev: MAT-OS-6/veckratniki-in-delitelji#oktave
besedilo: »Produkt enakih faktorjev $2 \cdot 2 \cdot 2$ zapišemo krajše kot $2^3$, torej $440 = 55 \cdot 2^3$.« -/
theorem oktave : 55 * 2 = 110 ∧ 55 * 2 * 2 = 220 ∧ 55 * 2 * 2 * 2 = 440 ∧ 2 * 2 * 2 = 2 ^ 3 ∧ 440 = 55 * 2 ^ 3 := by
  decide

/-- Razlaga 6 in Povzetek: a^n je produkt n enakih faktorjev a; a¹ = a; 10⁶ = 1 000 000.
trditev: MAT-OS-6/veckratniki-in-delitelji#potenca
besedilo: »Potenca $a^n$ je produkt $n$ enakih faktorjev $a$ (osnova $a$, eksponent $n$)« -/
theorem potenca (a n : ℕ) : (List.replicate n a).prod = a ^ n ∧ a ^ 1 = a ∧ 10 ^ 6 = 1000000 :=
  ⟨List.prod_replicate n a, pow_one a, rfl⟩

/-- Razlaga 6, Pogoste napake 4 in 5: 2³ = 2 · 2 · 2 = 8, ne 2 · 3 = 6; 3 · 2³ = 3 · 8 = 24, (3 · 2)³ = 6³ = 216.
trditev: MAT-OS-6/veckratniki-in-delitelji#eksponent-ni-faktor
besedilo: »Zato je $3 \cdot 2^3 = 3 \cdot 8 = 24$, $(3 \cdot 2)^3$ pa je $6^3 = 216$.« -/
theorem eksponent_ni_faktor : 2 ^ 3 = 2 * 2 * 2 ∧ 2 * 2 * 2 = 8 ∧ 2 ^ 3 ≠ 2 * 3 ∧ 3 * 2 ^ 3 = 3 * 8 ∧
    3 * 8 = 24 ∧ (3 * 2) ^ 3 = 6 ^ 3 ∧ 6 ^ 3 = 216 ∧ 3 * 2 ^ 3 ≠ 216 := by
  decide

/-- Razlaga 6 (premisli) in Povzetek: 2⁵ = 2 · 2 · 2 · 2 · 2 = 32, 5² = 5 · 5 = 25, 2⁵ ≠ 5²; 2⁴ = 4² = 16.
trditev: MAT-OS-6/veckratniki-in-delitelji#lana
besedilo: »Nima. $2^5 = 2 \cdot 2 \cdot 2 \cdot 2 \cdot 2 = 32$, $5^2 = 5 \cdot 5 = 25$.« -/
theorem lana : 2 ^ 5 = 2 * 2 * 2 * 2 * 2 ∧ 2 * 2 * 2 * 2 * 2 = 32 ∧ 5 ^ 2 = 5 * 5 ∧ 5 * 5 = 25 ∧ 2 ^ 5 ≠ 5 ^ 2 ∧
    2 ^ 4 = 4 ^ 2 ∧ 4 ^ 2 = 16 := by
  decide

/-- Pomožno za `en_par`: (n + 1)ⁿ < 3 · nⁿ za n ≥ 1 (ker je (1 + 1/n)ⁿ ≤ e < 3).
pomozno – ocena (1 + 1/n)ⁿ < 3 za dokaz izreka `en_par` -/
theorem kljuc (n : ℕ) (hn : 1 ≤ n) : (n + 1) ^ n < 3 * n ^ n := by
  have hpos : (0 : ℝ) < n := by exact_mod_cast hn
  have h1 : (1 / (n : ℝ) + 1) ^ n ≤ Real.exp 1 := by
    calc (1 / (n : ℝ) + 1) ^ n ≤ (Real.exp (1 / n)) ^ n :=
          pow_le_pow_left₀ (by positivity) (Real.add_one_le_exp _) n
      _ = Real.exp 1 := by
          rw [← Real.exp_nat_mul]
          congr 1
          field_simp
  have h2 : Real.exp 1 < 3 := lt_trans Real.exp_one_lt_d9 (by norm_num)
  have h3 : ((n : ℝ) + 1) ^ n = (1 / (n : ℝ) + 1) ^ n * (n : ℝ) ^ n := by
    rw [← mul_pow]
    congr 1
    field_simp
    ring
  have h5 : (0 : ℝ) < (n : ℝ) ^ n := by positivity
  have h4 : ((n : ℝ) + 1) ^ n < 3 * (n : ℝ) ^ n := by
    rw [h3]
    nlinarith
  exact_mod_cast h4

/-- Pomožno za `en_par`: za 3 ≤ a < b je bᵃ < aᵇ.
pomozno – neenakost za dokaz izreka `en_par` -/
theorem vecja_osnova (a : ℕ) (ha : 3 ≤ a) (b : ℕ) (hb : a + 1 ≤ b) : b ^ a < a ^ b := by
  induction b, hb using Nat.le_induction with
  | base =>
    calc (a + 1) ^ a < 3 * a ^ a := kljuc a (by omega)
      _ ≤ a * a ^ a := Nat.mul_le_mul_right _ ha
      _ = a ^ (a + 1) := by ring
  | succ b hab ih =>
    have k := kljuc b (by omega)
    have e1 : b ^ b = b ^ a * b ^ (b - a) := by rw [← pow_add]; congr 1; omega
    have e2 : (b + 1) ^ b = (b + 1) ^ a * (b + 1) ^ (b - a) := by rw [← pow_add]; congr 1; omega
    have hle : b ^ (b - a) ≤ (b + 1) ^ (b - a) := Nat.pow_le_pow_left (by omega) _
    have hmono : (b + 1) ^ a * b ^ b ≤ (b + 1) ^ b * b ^ a := by
      rw [e1, e2]
      calc (b + 1) ^ a * (b ^ a * b ^ (b - a)) = ((b + 1) ^ a * b ^ a) * b ^ (b - a) := by ring
        _ ≤ ((b + 1) ^ a * b ^ a) * (b + 1) ^ (b - a) := Nat.mul_le_mul_left _ hle
        _ = (b + 1) ^ a * (b + 1) ^ (b - a) * b ^ a := by ring
    have h5 : (b + 1) ^ a < 3 * b ^ a := by
      have hba : 0 < b ^ a := pow_pos (by omega) a
      have : (b + 1) ^ a * b ^ b < 3 * b ^ a * b ^ b := by
        calc (b + 1) ^ a * b ^ b ≤ (b + 1) ^ b * b ^ a := hmono
          _ < 3 * b ^ b * b ^ a := Nat.mul_lt_mul_of_pos_right k hba
          _ = 3 * b ^ a * b ^ b := by ring
      exact Nat.lt_of_mul_lt_mul_right this
    calc (b + 1) ^ a < 3 * b ^ a := h5
      _ ≤ a * b ^ a := Nat.mul_le_mul_right _ ha
      _ < a * a ^ b := Nat.mul_lt_mul_of_pos_left ih (by omega)
      _ = a ^ (b + 1) := by ring

/-- Pomožno za `en_par`: b² < 2ᵇ za b ≥ 5.
pomozno – neenakost za dokaz izreka `en_par` -/
theorem kvadrat_dva (b : ℕ) (hb : 5 ≤ b) : b ^ 2 < 2 ^ b := by
  induction b, hb using Nat.le_induction with
  | base => norm_num
  | succ b hab ih =>
    rw [pow_succ 2 b]
    nlinarith

/-- Pomožno za `en_par`: za a < b je aᵇ = bᵃ natanko pri a = 2, b = 4.
pomozno – urejeni primer izreka `en_par` -/
theorem en_par_lt (a b : ℕ) (hab : a < b) : a ^ b = b ^ a ↔ a = 2 ∧ b = 4 := by
  constructor
  · intro h
    rcases Nat.lt_or_ge a 3 with h3 | h3
    · interval_cases a
      · rw [zero_pow (by omega), pow_zero] at h
        exact absurd h (by norm_num)
      · rw [one_pow, pow_one] at h
        omega
      · rcases Nat.lt_or_ge b 5 with h5 | h5
        · interval_cases b
          · norm_num at h
          · exact ⟨rfl, rfl⟩
        · exact absurd h (ne_of_gt (kvadrat_dva b h5))
    · exact absurd h (ne_of_gt (vecja_osnova a h3 b hab))
  · rintro ⟨rfl, rfl⟩
    norm_num

/-- Razlaga 6 (premisli): med različnimi naravnimi števili je aᵇ = bᵃ le pri enem paru, {2, 4}: 2⁴ = 4² = 16.
trditev: MAT-OS-6/veckratniki-in-delitelji#en-par
besedilo: »Med različnimi naravnimi števili se izide le pri enem paru: $2^4 = 4^2 = 16$.« -/
theorem en_par (a b : ℕ) (hab : a ≠ b) : a ^ b = b ^ a ↔ (a = 2 ∧ b = 4) ∨ (a = 4 ∧ b = 2) := by
  rcases Nat.lt_or_gt_of_ne hab with h | h
  · rw [en_par_lt a b h]
    constructor
    · exact Or.inl
    · rintro (h' | ⟨rfl, rfl⟩)
      · exact h'
      · omega
  · rw [eq_comm, en_par_lt b a h]
    constructor
    · rintro ⟨rfl, rfl⟩
      exact Or.inr ⟨rfl, rfl⟩
    · rintro (⟨rfl, rfl⟩ | ⟨rfl, rfl⟩)
      · omega
      · exact ⟨rfl, rfl⟩

example := en_par 2 5 (by norm_num)

/-! ## Rešeni primeri -/

/-- Primer 1: prvih šest večkratnikov 7 je 7, 14, 21, 28, 35, 42; 28 = 1 · 28 = 2 · 14 = 4 · 7; 3, 5, 6 ne delijo
28 (ostanka 1 in 3); D₂₈ = {1, 2, 4, 7, 14, 28}; 7 deli 28.
trditev: MAT-OS-6/veckratniki-in-delitelji#primer1
besedilo: »Odgovor: $V_7 = \{7, 14, 21, 28, 35, 42, \dots\}$ in $D_{28} = \{1, 2, 4, 7, 14, 28\}$.« -/
theorem primer1 : (7 * 1, 7 * 2, 7 * 3, 7 * 4, 7 * 5, 7 * 6) = (7, 14, 21, 28, 35, 42) ∧
    28 = 1 * 28 ∧ 28 = 2 * 14 ∧ 28 = 4 * 7 ∧ 28 % 3 = 1 ∧ 28 % 5 = 3 ∧ ¬ 6 ∣ 28 ∧
    Nat.divisors 28 = {1, 2, 4, 7, 14, 28} ∧ 7 ∣ 28 := by
  decide

/-- Primer 2: 7 · 7 · 7 · 7 = 7⁴ = 2 401 (7 · 7 = 49, 49 · 7 = 343, 343 · 7 = 2 401); 2⁵ = 32, 5² = 25,
3 · 2³ = 3 · 8 = 24.
trditev: MAT-OS-6/veckratniki-in-delitelji#primer2
besedilo: »Odgovor: a) $7^4 = 2\,401$; b) $32$; $25$ in $24$.« -/
theorem primer2 : 7 * 7 * 7 * 7 = 7 ^ 4 ∧ 7 ^ 4 = 2401 ∧ 2 ^ 5 = 32 ∧ 5 ^ 2 = 25 ∧ 3 * 2 ^ 3 = 24 := by
  refine ⟨by norm_num, ?_, by norm_num, by norm_num, ?_⟩
  · calc 7 ^ 4 = 7 * 7 * 7 * 7 := by norm_num
      _ = 49 * 7 * 7 := by norm_num
      _ = 343 * 7 := by norm_num
      _ = 2401 := by norm_num
  · calc 3 * 2 ^ 3 = 3 * 8 := by norm_num
      _ = 24 := by norm_num

/-- Primer 3: delitelji 36 med 3 in 12 so 3, 4, 6, 9, 12; vrst je 36 : 3 = 12, 36 : 4 = 9, 36 : 6 = 6, 36 : 9 = 4,
36 : 12 = 3 (partner iz para).
trditev: MAT-OS-6/veckratniki-in-delitelji#primer3
besedilo: »$36 : 3 = 12$, $36 : 4 = 9$, $36 : 6 = 6$, $36 : 9 = 4$, $36 : 12 = 3$.« -/
theorem primer3 : (Nat.divisors 36).filter (fun d => 3 ≤ d ∧ d ≤ 12) = {3, 4, 6, 9, 12} ∧
    36 / 3 = 12 ∧ 36 / 4 = 9 ∧ 36 / 6 = 6 ∧ 36 / 9 = 4 ∧ 36 / 12 = 3 ∧
    3 * 12 = 36 ∧ 4 * 9 = 36 ∧ 6 * 6 = 36 ∧ 9 * 4 = 36 ∧ 12 * 3 = 36 := by
  decide

/-! ## Pogoste napake -/

/-- Pogoste napake 1 in Preveri se 1: 20 : 1 = 20 in 20 : 20 = 1 se izideta, D₂₀ = {1, 2, 4, 5, 10, 20}.
trditev: MAT-OS-6/veckratniki-in-delitelji#d20
besedilo: »Pravilno: $D_{20} = \{1, 2, 4, 5, 10, 20\}$.« -/
theorem d20 : 20 / 1 = 20 ∧ 20 / 20 = 1 ∧ Nat.divisors 20 = {1, 2, 4, 5, 10, 20} := by decide

/-- Pogoste napake 2: 1, 2, 3, 6 so delitelji 6 (D₆), večkratniki 6 pa so 6, 12, 18 (niso manjši od 6).
trditev: MAT-OS-6/veckratniki-in-delitelji#zamenjava
besedilo: »Večkratnike dobiš z množenjem in niso manjši od števila: $6, 12, 18, \dots$« -/
theorem zamenjava : Nat.divisors 6 = {1, 2, 3, 6} ∧ (6 * 1, 6 * 2, 6 * 3) = (6, 12, 18) ∧
    ∀ n, 1 ≤ n → 6 ≤ 6 * n := by
  refine ⟨by decide, rfl, fun n hn => by omega⟩

example := zamenjava.2.2 2 (by norm_num)

/-- Pogoste napake 3: iz 36 = 4 · 9 je tudi 9 delitelj 36.
trditev: MAT-OS-6/veckratniki-in-delitelji#partner
besedilo: »Vsak delitelj ima par: iz $36 = 4 \cdot 9$ je delitelj tudi $9$.« -/
theorem partner : 36 = 4 * 9 ∧ 9 ∣ 36 := by decide

/-- Pogoste napake 5: 3 · 2³ = 3 · 8 = 24, ne 6³ = 216.
trditev: MAT-OS-6/veckratniki-in-delitelji#potenca-pred
besedilo: »Potenca je na vrsti pred množenjem: $3 \cdot 2^3 = 3 \cdot 8 = 24$.« -/
theorem potenca_pred : 3 * 2 ^ 3 = 3 * 8 ∧ 3 * 8 = 24 ∧ 6 ^ 3 = 216 ∧ 3 * 2 ^ 3 ≠ 6 ^ 3 := by decide

/-! ## Drugače -/

/-- Drugače (analogija): vsaka tretja ploščica 3, 6, 9, 12; 10 ni večkratnik 3; trak 24 cm: kosi 1, 2, 3, 4, 6, 8,
12, 24 cm (D₂₄), s 5 cm ostane 4 cm; 2⁵ = 2 · 2 · 2 · 2 · 2 = 32.
trditev: MAT-OS-6/veckratniki-in-delitelji#analogija
besedilo: »Na ploščico $10$ ne stopiš nikoli, ker $10$ ni večkratnik števila $3$.« -/
theorem analogija : (3 * 1, 3 * 2, 3 * 3, 3 * 4) = (3, 6, 9, 12) ∧ ¬ 3 ∣ 10 ∧
    Nat.divisors 24 = {1, 2, 3, 4, 6, 8, 12, 24} ∧ 24 % 5 = 4 ∧ 2 ^ 5 = 2 * 2 * 2 * 2 * 2 ∧
    2 * 2 * 2 * 2 * 2 = 32 := by
  decide

/-- Drugače (vsakdan): večkratniki 20 so 20, 40, 60; 70 ni večkratnik 20; 24 bonbonov gre brez ostanka med 2, 3,
4, 6, 8, 12 ali 24 otrok, med 5 ne (ostanek 4); pregibi 2, 4, 8, 16 = 2⁴; šahovnica 8 · 8 = 8² = 64.
trditev: MAT-OS-6/veckratniki-in-delitelji#vsakdan
besedilo: »Šahovnica ima $8$ vrst po $8$ polj, torej $8^2 = 64$ polj.« -/
theorem vsakdan : (20 * 1, 20 * 2, 20 * 3) = (20, 40, 60) ∧ ¬ 20 ∣ 70 ∧
    (Nat.divisors 24).erase 1 = {2, 3, 4, 6, 8, 12, 24} ∧ 24 / 5 = 4 ∧ 24 % 5 = 4 ∧
    (2 ^ 1, 2 ^ 2, 2 ^ 3, 2 ^ 4) = (2, 4, 8, 16) ∧ 8 * 8 = 8 ^ 2 ∧ 8 ^ 2 = 64 := by
  decide

/-! ## Preveri se -/

/-- Preveri se 1: 40 = 20 · 2 je večkratnik 20, ni delitelj; 1, 5, 20 so delitelji (20 = 5 · 4).
trditev: MAT-OS-6/veckratniki-in-delitelji#preveri1
besedilo: »Število $40 = 20 \cdot 2$ je večkratnik števila $20$, ne delitelj.« -/
theorem preveri1 : 40 = 20 * 2 ∧ ¬ 40 ∣ 20 ∧ 1 ∣ 20 ∧ 5 ∣ 20 ∧ 20 = 5 * 4 ∧ 20 ∣ 20 := by decide

/-- Preveri se 2: k-ti udarec je na dobi 3 · k; deveti je na 3 · 9 = 27 (osmi 24, deseti 30, ne 9 + 3 = 12).
trditev: MAT-OS-6/veckratniki-in-delitelji#preveri2
besedilo: »Skoki so dolgi $3$, udarci so na večkratnikih števila $3$: deveti je na dobi $3 \cdot 9 = 27$.« -/
theorem preveri2 : 3 * 9 = 27 ∧ 3 * 8 = 24 ∧ 3 * 10 = 30 ∧ 9 + 3 = 12 ∧
    (Finset.Icc 1 27).filter (3 ∣ ·) = {3, 6, 9, 12, 15, 18, 21, 24, 27} := by
  decide

/-- Preveri se 3: 55 · 2⁴ = 55 · 16 = 880 = 2 · 440; splošno en faktor 2 več podvoji vrednost.
trditev: MAT-OS-6/veckratniki-in-delitelji#preveri3
besedilo: »$55 \cdot 2^4 = 55 \cdot 16 = 880$, kar je dvakrat $440$. En faktor $2$ več podvoji vrednost.« -/
theorem preveri3 (c n : ℕ) : 55 * 2 ^ 4 = 55 * 16 ∧ 55 * 16 = 880 ∧ 880 = 2 * 440 ∧ c * 2 ^ (n + 1) = 2 * (c * 2 ^ n) :=
  ⟨rfl, rfl, rfl, by ring⟩

/-- Preveri se 4: 5 + 2 · 3² = 5 + 2 · 9 = 5 + 18 = 23; Lanin (5 + 2) · 9 = 63 je napačen.
trditev: MAT-OS-6/veckratniki-in-delitelji#preveri4
besedilo: »Po potenci pride množenje, šele nato seštevanje: $2 \cdot 9 = 18$, nato $5 + 18 = 23$.« -/
theorem preveri4 : 5 + 2 * 3 ^ 2 = 23 ∧ (5 + 2) * 9 = 63 := by
  refine ⟨?_, rfl⟩
  calc 5 + 2 * 3 ^ 2 = 5 + 2 * 9 := by norm_num
    _ = 5 + 18 := by norm_num
    _ = 23 := by norm_num

/-- Preveri se 5: 30 = 1 · 30 = 2 · 15 = 3 · 10 = 5 · 6, 30 : 4 da ostanek 2, D₃₀ = {1, 2, 3, 5, 6, 10, 15, 30}.
trditev: MAT-OS-6/veckratniki-in-delitelji#preveri5
besedilo: »Ko prideš do števila, ki je že partner, si našel vse.« -/
theorem preveri5 : 30 = 1 * 30 ∧ 30 = 2 * 15 ∧ 30 = 3 * 10 ∧ 30 % 4 = 2 ∧ 30 = 5 * 6 ∧
    Nat.divisors 30 = {1, 2, 3, 5, 6, 10, 15, 30} := by
  decide

end Evklid.Lekcije.MAT_OS_6.VeckratnikiInDelitelji
