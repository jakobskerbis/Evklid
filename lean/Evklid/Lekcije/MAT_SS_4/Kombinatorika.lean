/-
vir: content/lessons/MAT-SS-4/kombinatorika.md
sha256: 3c629415605054dd0511e92a85e89b0cc889486b54c558d33e88efa8d498cf5a
Ni v Leanu: kombinatorično drevo (risba v besedilu), simulacija »Permutacije, variacije in kombinacije«,
analogija s fotografijo in nahrbtnikom ter navigacija (dokazana so le njihova števila), primerjava s številom
prebivalcev Slovenije (statistični podatek), ustni odgovori kot besedilo (dokazane so formule), splošna formula
za permutacije s ponavljanjem kot število razvrstitev (Mathlib nima izreka, ki šteje različne razvrstitve
multimnožice; dokazana sta primera ANA in MAMA s štetjem besed, POPOTNIK pa kot multinomski koeficient), štetje
v Nalogi 2 d) kot množica funkcij (dokazan je račun; Naloga 1 je preverjena s štetjem štirimestnih števil,
Naloga 2 b) in c) pa s štetjem podmnožic), izbira formule glede na tri vprašanja (postopek).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.Kombinatorika

open Finset

/-! ## Zakaj se tega učimo -/

/-- Zakaj se tega učimo: 10 krajev ima 10! = 3 628 800 vrstnih redov, več kot tri milijone; po en vrstni red na
dan je to skoraj 10 000 let (med 9900 in 10 000 let po 365 dni). -/
theorem deset_krajev : Nat.factorial 10 = 3628800 ∧ 3000000 < Nat.factorial 10 ∧
    9900 * 365 < Nat.factorial 10 ∧ Nat.factorial 10 < 10000 * 365 := by decide

/-! ## Razlaga 1: osnovni izrek -/

/-- Razlaga 1 (osnovni izrek kombinatorike, pravilo produkta): pri izbiri v dveh korakih z m in n možnostmi
je izbir m·n. -/
theorem osnovni_izrek {α β : Type*} (A : Finset α) (B : Finset β) : #(A ×ˢ B) = #A * #B := card_product A B

/-- Razlaga 1: Ljubljana–Maribor 3 prevozi, Maribor–Gradec 2 prevoza: 3·2 = 6 poti. -/
theorem drevo_poti : #((range 3) ×ˢ (range 2)) = 6 := by decide

/-! ## Razlaga 2: permutacije -/

/-- Razlaga 2: permutacij n različnih elementov je n! (`P_n = n!`). -/
theorem permutacije (n : ℕ) : Fintype.card (Equiv.Perm (Fin n)) = Nat.factorial n := by
  rw [Fintype.card_perm, Fintype.card_fin]

/-- Razlaga 2: `n! = n·(n−1)···2·1` (produkt števil od 1 do n). -/
theorem fakulteta_produkt (n : ℕ) : Nat.factorial n = ∏ i ∈ range n, (i + 1) := by
  rw [← Finset.prod_range_add_one_eq_factorial]

/-- Razlaga 2: dogovor 0! = 1. -/
theorem nic_fakulteta : Nat.factorial 0 = 1 := Nat.factorial_zero

/-- Razlaga 2, tabela: Bled (0), Bohinj (1), Kr. Gora (2) razvrstimo na 3·2·1 = 6 načinov; vseh šest vrstic
tabele so različne razvrstitve. -/
theorem tabela_treh :
    ([0, 1, 2].permutations').length = 6 ∧ 3 * 2 * 1 = 6 ∧
    [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].Nodup ∧
    ∀ r ∈ [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]], r ∈ [0, 1, 2].permutations' := by
  decide

/-- Razlaga 2, »Premisli«: s Piranom je vrstnih redov 4! = 24 = 6·4. -/
theorem piran : Nat.factorial 4 = 24 ∧ (24 : ℕ) = 6 * 4 := by decide

/-! ## Razlaga 3: variacije -/

/-- Razlaga 3: variacij k-tega razreda iz n elementov (injektivnih izborov) je
`V_n^k = n(n−1)···(n−k+1) = n!/(n−k)!` (k ≤ n). -/
theorem variacije (n k : ℕ) (hk : k ≤ n) :
    Fintype.card (Fin k ↪ Fin n) = ∏ i ∈ range k, (n - i) ∧
    Fintype.card (Fin k ↪ Fin n) = Nat.factorial n / Nat.factorial (n - k) := by
  rw [Fintype.card_embedding_eq, Fintype.card_fin, Fintype.card_fin]
  exact ⟨Nat.descFactorial_eq_prod_range n k, Nat.descFactorial_eq_div hk⟩

/-- Predpostavka trditve `variacije` se da izpolniti. -/
example : (3 : ℕ) ≤ 7 := by norm_num

/-- Razlaga 3: 7 krajev, 3 dnevi: 7·6·5 = 210 načrtov. -/
theorem sedem_tri : Nat.descFactorial 7 3 = 7 * 6 * 5 ∧ 7 * 6 * 5 = 210 := by decide

/-- Razlaga 3: variacij s ponavljanjem je `⁽ᵖ⁾V_n^k = n^k`. -/
theorem variacije_s_ponavljanjem (n k : ℕ) : Fintype.card (Fin k → Fin n) = n ^ k := by simp

/-! ## Razlaga 4: kombinacije -/

/-- Razlaga 4: kombinacij k-tega razreda iz n elementov (k-elementnih podmnožic) je `C(n,k)`, in
`C(n,k) = n!/(k!·(n−k)!)` za k ≤ n. -/
theorem kombinacije (n k : ℕ) (hk : k ≤ n) :
    #((range n).powersetCard k) = Nat.choose n k ∧
    Nat.choose n k = Nat.factorial n / (Nat.factorial k * Nat.factorial (n - k)) := by
  rw [card_powersetCard, card_range]
  exact ⟨rfl, Nat.choose_eq_factorial_div_factorial hk⟩

/-- Predpostavka trditve `kombinacije` se da izpolniti. -/
example : (3 : ℕ) ≤ 7 := by norm_num

/-- Razlaga 4, Povzetek, Ustno vprašanje 2, analogija: `V_n^k = k!·C(n,k)`, torej `C(n,k) = V_n^k / k!`. -/
theorem variacije_kombinacije (n k : ℕ) :
    Nat.descFactorial n k = Nat.factorial k * Nat.choose n k ∧
    Nat.choose n k = Nat.descFactorial n k / Nat.factorial k := by
  refine ⟨Nat.descFactorial_eq_factorial_mul_choose n k, ?_⟩
  rw [Nat.descFactorial_eq_factorial_mul_choose, Nat.mul_div_cancel_left _ (Nat.factorial_pos k)]

/-- Razlaga 4: vsak izbor treh krajev nastopi 3! = 6-krat, izborov je 210/6 = 35 = `C(7,3)`. -/
theorem sedem_tri_kombinacije : Nat.factorial 3 = 6 ∧ 210 / 6 = 35 ∧ Nat.choose 7 3 = 35 := by decide

/-- Razlaga 4, »Premisli« in Povzetek: `C(n,k) = C(n,n−k)` (k ≤ n); posebej `C(7,3) = C(7,4) = 35`. -/
theorem simetrija (n k : ℕ) (hk : k ≤ n) : Nat.choose n k = Nat.choose n (n - k) :=
  (Nat.choose_symm hk).symm

/-- Predpostavka trditve `simetrija` se da izpolniti. -/
example : (3 : ℕ) ≤ 7 := by norm_num

/-- Razlaga 4, »Premisli«: `C(7,3) = C(7,4) = 35`. -/
theorem sedem_tri_stiri : Nat.choose 7 3 = Nat.choose 7 4 ∧ Nat.choose 7 4 = 35 := by decide

/-- Razlaga 5 (simulacija): pri n = 5, k = 3 je variacij 60, kombinacij 10, razmerje 3! = 6. -/
theorem simulacija : Nat.descFactorial 5 3 = 60 ∧ Nat.choose 5 3 = 10 ∧ 60 = Nat.factorial 3 * 10 := by decide

/-! ## Razlaga 6: pravilo vsote -/

/-- Razlaga 6 (pravilo vsote): za primera, ki se ne prekrivata, je možnosti m + n. -/
theorem pravilo_vsote {α : Type*} [DecidableEq α] (A B : Finset α) (h : Disjoint A B) :
    #(A ∪ B) = #A + #B := card_union_of_disjoint h

/-- Predpostavka trditve `pravilo_vsote` se da izpolniti. -/
example : Disjoint (range 4) ((range 7) \ (range 4)) := disjoint_sdiff

/-- Razlaga 6: gore (4) ali morje (3): 4 + 3 = 7 izletov, ne 4·3. -/
theorem izleti : #(range 4 ∪ ((range 7) \ (range 4))) = 4 + 3 ∧ 4 + 3 = 7 ∧ 4 * 3 ≠ 7 := by decide

/-- Razlaga 6: gesel iz 2 ali 3 črk (26 črk, s ponavljanjem) je 26² + 26³ = 676 + 17 576 = 18 252. -/
theorem gesla : Fintype.card ((Fin 2 → Fin 26) ⊕ (Fin 3 → Fin 26)) = 26 ^ 2 + 26 ^ 3 ∧
    26 ^ 2 + 26 ^ 3 = 676 + 17576 ∧ 676 + 17576 = 18252 := by
  refine ⟨by simp, by norm_num, by norm_num⟩

/-! ## Razlaga 7: permutacije s ponavljanjem -/

/-- Razlaga 7: besed iz črk ANA je 3!/2! = 3 (besede dolžine 3 z dvema A in enim N: ANA, AAN, NAA). -/
theorem ana : #(univ.filter (fun f : Fin 3 → Fin 2 => #(univ.filter (fun i => f i = 0)) = 2)) = 3 ∧
    Nat.factorial 3 / Nat.factorial 2 = 3 := by decide

/-- Razlaga 7: `P_n^{k₁,…,k_r}·k₁!···k_r! = n!` (multinomski koeficient, k₁ + … + k_r = n). -/
theorem permutacije_s_ponavljanjem {ι : Type*} (s : Finset ι) (k : ι → ℕ) :
    (∏ i ∈ s, Nat.factorial (k i)) * Nat.multinomial s k = Nat.factorial (∑ i ∈ s, k i) :=
  Nat.multinomial_spec s k

/-! ## Rešeni primeri -/

/-- Primer 1: `P_5 = 5·4·3·2·1 = 120`. -/
theorem primer1 : Fintype.card (Equiv.Perm (Fin 5)) = 5 * 4 * 3 * 2 * 1 ∧ 5 * 4 * 3 * 2 * 1 = 120 := by
  rw [permutacije]; decide

/-- Primer 2: `V_9^3 = 9·8·7 = 504`. -/
theorem primer2 : Fintype.card (Fin 3 ↪ Fin 9) = 9 * 8 * 7 ∧ 9 * 8 * 7 = 504 := by
  rw [Fintype.card_embedding_eq, Fintype.card_fin, Fintype.card_fin]; decide

/-- Primer 3: `C(6,3) = 6·5·4/(3·2·1) = 20`, `C(4,2) = 4·3/(2·1) = 6`, 20·6 = 120 izborov, 5! = 120,
120·120 = 14 400 potovanj. -/
theorem primer3 :
    Nat.choose 6 3 = 6 * 5 * 4 / (3 * 2 * 1) ∧ 6 * 5 * 4 / (3 * 2 * 1) = 20 ∧
    Nat.choose 4 2 = 4 * 3 / (2 * 1) ∧ 4 * 3 / (2 * 1) = 6 ∧
    #(((range 6).powersetCard 3) ×ˢ ((range 4).powersetCard 2)) = 20 * 6 ∧ 20 * 6 = 120 ∧
    Nat.factorial 5 = 120 ∧ 120 * 120 = 14400 := by
  refine ⟨by decide, by decide, by decide, by decide, ?_, by decide, by decide, by decide⟩
  rw [card_product, card_powersetCard, card_powersetCard, card_range, card_range]; decide

/-- Primer 3 (RAČUN): `6!/(3!)²·4!/(2!)² = 120`. -/
theorem primer3_racun :
    (Nat.factorial 6 : ℚ) / Nat.factorial 3 ^ 2 * Nat.factorial 4 / Nat.factorial 2 ^ 2 = 120 := by
  simp [Nat.factorial]; norm_num

/-- Pogoste napake: v Primeru 3 je 20 + 6 = 26 napačno, pravilno je 20·6 = 120. -/
theorem napaka_sestevanje : 20 + 6 = 26 ∧ 20 + 6 ≠ 20 * 6 := by decide

/-- Primer 4 (RAČUN `resi`): n(n−1)/2 = 45 ⇔ n(n−1) = 90 ⇔ n² − n − 90 = 0 ⇔ n = −9 ali n = 10. -/
theorem primer4_enacba (n : ℝ) : n * (n - 1) / 2 = 45 ↔ n = -9 ∨ n = 10 := by
  calc n * (n - 1) / 2 = 45 ↔ n * (n - 1) = 90 := by
        constructor <;> intro h
        · linear_combination 2 * h
        · linear_combination h / 2
    _ ↔ n ^ 2 - n - 90 = 0 := by constructor <;> intro h <;> linear_combination h
    _ ↔ (n - 10) * (n + 9) = 0 := by constructor <;> intro h <;> linear_combination h
    _ ↔ n = 10 ∨ n = -9 := by rw [mul_eq_zero, sub_eq_zero, add_eq_zero_iff_eq_neg]
    _ ↔ n = -9 ∨ n = 10 := or_comm

/-- Primer 4: med naravnimi števili je linij `C(n,2) = 45` natanko pri n = 10; preizkus 10·9/2 = 45. -/
theorem primer4 (n : ℕ) : Nat.choose n 2 = 45 ↔ n = 10 := by
  constructor
  · intro h
    have hn : n < 11 := by
      by_contra h'
      have h1 := Nat.choose_le_choose 2 (not_lt.mp h')
      have h2 : Nat.choose 11 2 = 55 := by decide
      omega
    interval_cases n <;> first | rfl | (revert h; decide)
  · rintro rfl; decide

/-- Primer 4, preizkus: 10·9 = 90 in `C(10,2) = 10·9/2 = 45`. -/
theorem primer4_preizkus : 10 * 9 = 90 ∧ Nat.choose 10 2 = 10 * 9 / 2 ∧ 10 * 9 / 2 = 45 := by decide

/-- Primer 5: 8! = 40 320, 2!·2! = 4, 8!/(2!·2!) = 40 320/4 = 10 080; to je multinomski koeficient za
črke P, O (po 2-krat) in T, N, I, K (po enkrat). -/
theorem primer5 :
    Nat.factorial 8 = 40320 ∧ Nat.factorial 2 * Nat.factorial 2 = 4 ∧
    Nat.factorial 8 / (Nat.factorial 2 * Nat.factorial 2) = 40320 / 4 ∧ 40320 / 4 = 10080 ∧
    Nat.multinomial univ ![2, 2, 1, 1, 1, 1] = 10080 := by
  refine ⟨by decide, by decide, by decide, by decide, by decide +kernel⟩

/-! ## Pogoste napake -/

/-- Pogoste napake: ključavnica s 4 kolesci ima 10⁴ = 10 000 kod (števke se ponavljajo). -/
theorem kljucavnica : Fintype.card (Fin 4 → Fin 10) = 10 ^ 4 ∧ (10 : ℕ) ^ 4 = 10000 := by
  refine ⟨by simp, by norm_num⟩

/-- Pogoste napake: `C(5,5) = 5!/(5!·0!) = 1`. -/
theorem pet_nad_pet : Nat.choose 5 5 = Nat.factorial 5 / (Nat.factorial 5 * Nat.factorial 0) ∧
    Nat.choose 5 5 = 1 := by decide

/-- Pogoste napake: 7!/3! = 840 ≠ `C(7,3)`; pravilno 7!/(3!·4!) = 35. -/
theorem pozabljen_imenovalec : Nat.factorial 7 / Nat.factorial 3 = 840 ∧ Nat.choose 7 3 ≠ 840 ∧
    Nat.factorial 7 / (Nat.factorial 3 * Nat.factorial 4) = 35 := by decide

/-! ## Za maturo -/

/-- Naloga 1: 5·5·4·3 = 300 štirimestnih števil s števkami 0–5 brez ponavljanja; preverjeno s štetjem vseh
štirimestnih števil (1000–9999), ki imajo različne števke, vse največ 5. -/
theorem naloga1 : 5 * 5 * 4 * 3 = 300 ∧
    #((Icc 1000 9999).filter (fun n => (Nat.digits 10 n).Nodup ∧ ∀ d ∈ Nat.digits 10 n, d ≤ 5)) = 300 := by
  refine ⟨by norm_num, by decide +kernel⟩

/-- Naloga 2 a): `C(14,3) = 14·13·12/(3·2·1) = 364`. -/
theorem naloga2_a : #((range 14).powersetCard 3) = Nat.choose 14 3 ∧
    Nat.choose 14 3 = 14 * 13 * 12 / (3 * 2 * 1) ∧ 14 * 13 * 12 / (3 * 2 * 1) = 364 := by
  refine ⟨by rw [card_powersetCard, card_range], by decide, by decide⟩

/-- Naloga 2 b): natanko dve dekleti: `C(6,2)·8 = 15·8 = 120`; preverjeno s štetjem tričlanskih podmnožic
14 dijakov (dekleta 0–5), ki imajo z dekleti presek moči 2. -/
theorem naloga2_b : Nat.choose 6 2 * 8 = 15 * 8 ∧ 15 * 8 = 120 ∧
    #(((range 14).powersetCard 3).filter (fun s => #(s ∩ range 6) = 2)) = 120 := by
  refine ⟨by decide, by decide, by decide +kernel⟩

/-- Naloga 2 c): `C(8,3) = 8·7·6/(3·2·1) = 56`, 364 − 56 = 308; preizkus 6·C(8,2) + 120 + C(6,3) =
6·28 + 120 + 20 = 308; preverjeno s štetjem podmnožic z vsaj enim dekletom. -/
theorem naloga2_c :
    Nat.choose 8 3 = 8 * 7 * 6 / (3 * 2 * 1) ∧ 8 * 7 * 6 / (3 * 2 * 1) = 56 ∧ 364 - 56 = 308 ∧
    6 * Nat.choose 8 2 + 120 + Nat.choose 6 3 = 6 * 28 + 120 + 20 ∧ 6 * 28 + 120 + 20 = 308 ∧
    #(((range 14).powersetCard 3).filter (fun s => (s ∩ range 6).Nonempty)) = 308 := by
  refine ⟨by decide, by decide, by decide, by decide, by decide, by decide +kernel⟩

/-- Naloga 2 d): `6·V_13^2 = 6·(13·12) = 6·156 = 936`. -/
theorem naloga2_d : Fintype.card (Fin 2 ↪ Fin 13) = 13 * 12 ∧ 13 * 12 = 156 ∧ 6 * 156 = 936 := by
  rw [Fintype.card_embedding_eq, Fintype.card_fin, Fintype.card_fin]; decide

/-- Naloga 2 (RAČUN): `14!/(3!·11!) = 364`, `6!/(2!·4!)·8 = 120`, `8!/(3!·5!) = 56`, `6·13·12 = 936`. -/
theorem naloga2_racun :
    Nat.factorial 14 / (Nat.factorial 3 * Nat.factorial 11) = 364 ∧
    Nat.factorial 6 / (Nat.factorial 2 * Nat.factorial 4) * 8 = 120 ∧
    Nat.factorial 8 / (Nat.factorial 3 * Nat.factorial 5) = 56 ∧ 6 * 13 * 12 = 936 := by decide

/-! ## Drugače: iz vsakdanjega življenja -/

/-- Navigacija: 15! = 1 307 674 368 000 ≈ 1,3·10¹², več kot bilijon. -/
theorem petnajst : Nat.factorial 15 = 1307674368000 ∧ 10 ^ 12 < Nat.factorial 15 ∧
    1250000000000 ≤ Nat.factorial 15 ∧ Nat.factorial 15 < 1350000000000 := by decide

/-- Letališke oznake: 26³ = 17 576; Rim: `C(7,3) = 35`, z razporedom 210. -/
theorem letalisca_rim : Fintype.card (Fin 3 → Fin 26) = 17576 ∧ Nat.choose 7 3 = 35 ∧
    Nat.descFactorial 7 3 = 210 := by
  refine ⟨by simp, by decide, by decide⟩

/-! ## Preveri se -/

/-- Preveri se 1: izborov 4 od 12 mest je `C(12,4) = 495`. -/
theorem kviz1 : #((range 12).powersetCard 4) = Nat.choose 12 4 ∧ Nat.choose 12 4 = 495 := by
  refine ⟨by rw [card_powersetCard, card_range], by decide⟩

/-- Preveri se 2: `P_4 = 24 < C(7,3) = 35 < V_7^3 = 210 < 7³ = 343`, in `V_7^3 = 6·C(7,3)`. -/
theorem kviz2 :
    Nat.factorial 4 = 24 ∧ Nat.choose 7 3 = 35 ∧ Nat.descFactorial 7 3 = 210 ∧ 7 ^ 3 = 343 ∧
    Nat.factorial 4 < Nat.choose 7 3 ∧ Nat.choose 7 3 < Nat.descFactorial 7 3 ∧
    Nat.descFactorial 7 3 < 7 ^ 3 ∧ Nat.descFactorial 7 3 = 6 * Nat.choose 7 3 := by decide

/-- Preveri se 3: 6! = 720, 7! = 7·6! = 5040, torej sedemkrat več. -/
theorem kviz3 : Nat.factorial 6 = 720 ∧ Nat.factorial 7 = 7 * Nat.factorial 6 ∧ Nat.factorial 7 = 5040 := by
  decide

/-- Preveri se 4: 10⁴ = 10 000 kod; napačni odgovori 10·9·8·7 = 5040, C(10,4) = 210, 4·10 = 40. -/
theorem kviz4 : Fintype.card (Fin 4 → Fin 10) = 10000 ∧ 10 * 9 * 8 * 7 = 5040 ∧ Nat.choose 10 4 = 210 ∧
    4 * 10 = 40 := by
  refine ⟨by simp, by decide, by decide, by decide⟩

/-- Preveri se 5: `V_10^3 = 10·9·8 = 720`; napačni odgovori C(10,3) = 120, 10³ = 1000, 10·3 = 30. -/
theorem kviz5 : Fintype.card (Fin 3 ↪ Fin 10) = 10 * 9 * 8 ∧ 10 * 9 * 8 = 720 ∧ Nat.choose 10 3 = 120 ∧
    10 ^ 3 = 1000 ∧ 10 * 3 = 30 := by
  rw [Fintype.card_embedding_eq, Fintype.card_fin, Fintype.card_fin]; decide

/-- Preveri se 6: besed iz črk MAMA je 4!/(2!·2!) = 24/4 = 6 (besede dolžine 4 z dvema M in dvema A);
napačna sta 4! = 24 in 4!/2! = 12. -/
theorem kviz6 : #(univ.filter (fun f : Fin 4 → Fin 2 => #(univ.filter (fun i => f i = 0)) = 2)) = 6 ∧
    Nat.factorial 4 / (Nat.factorial 2 * Nat.factorial 2) = 24 / 4 ∧ 24 / 4 = 6 ∧
    Nat.factorial 4 = 24 ∧ Nat.factorial 4 / Nat.factorial 2 = 12 := by decide

/-- Preveri se 7: sladoled (5) ali torta (3): 5 + 3 = 8 možnosti (napačno 5·3 = 15). -/
theorem kviz7 : #(range 5 ∪ ((range 8) \ (range 5))) = 5 + 3 ∧ 5 + 3 = 8 ∧ 5 * 3 = 15 := by decide

end Evklid.Lekcije.MAT_SS_4.Kombinatorika
