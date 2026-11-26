/-
vir: content/lessons/MAT-SS-1/dvojiski-stevilski-sestav.md
sha256: 3bc935db5078cfe4fdfc50b987c0f32265c919ba30836cdeac84248576790140
Ni v Leanu: zgodbe (Matic, sonda, Arecibo, Eva, števec v avtu) kot besedilo, njihove številke so dokazane;
razlaga »zakaj računalniki« (šum, napetost: tehnični opis); risbe in simulacija; zapis z indeksom (2) in branje
»ena nič ena ena« (dogovor o zapisu); »števec prenaša« (opis; dokazana sta tabela štetja in podvajanje
mestnih vrednosti); razvrščanje postopka v korake (postopek; dokazani so vsi njegovi računi); točkovanje.
Dogovori: dvojiški zapis je seznam števk, napisan kot v lekciji (skrajno leva števka prva), njegova vrednost je
`dv l = Nat.ofDigits 2 l.reverse`; dvojiški zapis števila n je `zapis n = (Nat.digits 2 n).reverse` (brez vodilnih
ničel). »S k biti« pomeni seznam dolžine k s števkami 0 ali 1 (spredaj so lahko ničle).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.DvojiskiStevilskiSestav

/-- Vrednost dvojiškega zapisa, napisanega kot v lekciji (skrajno leva števka prva). -/
def dv (l : List ℕ) : ℕ := Nat.ofDigits 2 l.reverse

/-- Dvojiški zapis števila n (skrajno leva števka prva, brez vodilnih ničel). -/
def zapis (n : ℕ) : List ℕ := (Nat.digits 2 n).reverse

/-! ## Razlaga -/

/-- Razlaga 1: 307 = 3 · 100 + 0 · 10 + 7 · 1; brez ničle bi bilo 37.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#desetisko
besedilo: »Število $307$ pomeni $3$ stotice, $0$ desetic in $7$ enic: $3 \cdot 100 + 0 \cdot 10 + 7 \cdot 1 = 307$.« -/
theorem desetisko : 307 = 3 * 100 + 0 * 10 + 7 * 1 ∧ Nat.ofDigits 10 [7, 0, 3] = 307 ∧ Nat.ofDigits 10 [7, 3] = 37 := by
  norm_num [Nat.ofDigits]

/-- Razlaga 2 (tabela štetja) in premisli: 1, 10, 11, 100, 101, 110, 111, 1000 so 1, …, 8; 16 = 10000₍₂₎,
1111₍₂₎ = 8 + 4 + 2 + 1 = 15.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#stetje
besedilo: »Zapis $1111$ je število tik pred tem: $8 + 4 + 2 + 1 = 15$.« -/
theorem stetje : zapis 1 = [1] ∧ zapis 2 = [1, 0] ∧ zapis 3 = [1, 1] ∧ zapis 4 = [1, 0, 0] ∧ zapis 5 = [1, 0, 1] ∧
    zapis 6 = [1, 1, 0] ∧ zapis 7 = [1, 1, 1] ∧ zapis 8 = [1, 0, 0, 0] ∧ zapis 16 = [1, 0, 0, 0, 0] ∧
    dv [1, 1, 1, 1] = 8 + 4 + 2 + 1 ∧ 8 + 4 + 2 + 1 = 15 := by
  norm_num [zapis, dv, Nat.ofDigits]

/-- Razlaga 2: zapis z enico in k ničlami je 2ᵏ; vsak naslednji je dvakrat večji.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#enica-nicle
besedilo: »Vsak naslednji zapis z eno enico in samimi ničlami za njo pomeni **dvakrat** večje število od prejšnjega.« -/
theorem enica_nicle (k : ℕ) : dv (1 :: List.replicate k 0) = 2 ^ k ∧ 2 ^ (k + 1) = 2 * 2 ^ k := by
  refine ⟨?_, pow_succ' 2 k⟩
  simp only [dv, List.reverse_cons, List.reverse_replicate, Nat.ofDigits_append, Nat.ofDigits_replicate_zero,
    List.length_replicate, Nat.ofDigits_singleton]
  simp

/-- Razlaga 3 (tabela): mestne vrednosti 2⁰, …, 2⁷ so 1, 2, 4, 8, 16, 32, 64, 128.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#mestne-vrednosti
besedilo: »**Mestne vrednosti** od desne so $1, 2, 4, 8, 16, 32, 64, 128$ …, to je $2^0, 2^1, 2^2, \dots$« -/
theorem mestne_vrednosti : (2 : ℕ) ^ 0 = 1 ∧ (2 : ℕ) ^ 1 = 2 ∧ (2 : ℕ) ^ 2 = 4 ∧ (2 : ℕ) ^ 3 = 8 ∧
    (2 : ℕ) ^ 4 = 16 ∧ (2 : ℕ) ^ 5 = 32 ∧ (2 : ℕ) ^ 6 = 64 ∧ (2 : ℕ) ^ 7 = 128 := by norm_num

/-- Razlaga 3 in Ustno vprašanje 1: vrednost zapisa a_k … a_1 a_0 je a_k · 2ᵏ + … + a_1 · 2 + a_0
(po mestih: števka na mestu i, šteto od desne od 0, prispeva a_i · 2ⁱ).
trditev: MAT-SS-1/dvojiski-stevilski-sestav#vrednost-zapisa
besedilo: »Število z zapisom $a_k \dots a_1 a_0$ ima vrednost $n = a_k \cdot 2^k + \dots + a_1 \cdot 2 + a_0$.« -/
theorem vrednost_zapisa (L : List ℕ) :
    dv L = ((L.reverse).mapIdx fun i a => a * 2 ^ i).sum := by
  rw [dv, Nat.ofDigits_eq_sum_mapIdx]

/-- Zakaj se tega učimo in Razlaga 3: z dvema števkama zapišeš vsako naravno število, in to na en sam način
(brez vodilnih ničel).
trditev: MAT-SS-1/dvojiski-stevilski-sestav#vsako-stevilo
besedilo: »z dvema števkama zapišeš vsako naravno število« -/
theorem vsako_stevilo (n : ℕ) :
    (∀ d ∈ zapis n, d < 2) ∧ dv (zapis n) = n ∧
    ∀ L : List ℕ, (∀ d ∈ L, d < 2) → (L ≠ [] → L.head? ≠ some 0) → dv L = n → L = zapis n := by
  refine ⟨fun d hd => Nat.digits_lt_base (by norm_num) (List.mem_reverse.mp hd), ?_, ?_⟩
  · simp [dv, zapis, Nat.ofDigits_digits]
  · intro L hL h0 hv
    have hd : Nat.digits 2 (Nat.ofDigits 2 L.reverse) = L.reverse := by
      refine Nat.digits_ofDigits 2 (by norm_num) _ (fun d hd => hL d (List.mem_reverse.mp hd)) ?_
      intro hne
      rw [List.getLast_reverse]
      have hL' : L ≠ [] := fun h => hne (by simp [h])
      have := h0 hL'
      rw [List.head?_eq_some_head hL'] at this
      exact fun h => this (by rw [h])
    rw [zapis, ← hv, dv, hd, List.reverse_reverse]

/-- Razlaga 4 in Primer 1: 101101₍₂₎ = 1 · 32 + 0 · 16 + 1 · 8 + 1 · 4 + 0 · 2 + 1 · 1 = 32 + 8 + 4 + 1 = 45.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#primer1
besedilo: »Seštejemo $32 + 8 + 4 + 1 = 45$. Torej je $101101_{(2)}$ število $45$.« -/
theorem primer1 : dv [1, 0, 1, 1, 0, 1] = 1 * 2 ^ 5 + 0 * 2 ^ 4 + 1 * 2 ^ 3 + 1 * 2 ^ 2 + 0 * 2 + 1 ∧
    1 * 2 ^ 5 + 0 * 2 ^ 4 + 1 * 2 ^ 3 + 1 * 2 ^ 2 + 0 * 2 + 1 = 32 + 8 + 4 + 1 ∧ 32 + 8 + 4 + 1 = 45 := by
  norm_num [dv, Nat.ofDigits]

/-- Razlaga 5: 45 − 32 = 13, 13 − 8 = 5, 5 − 4 = 1; 45 = 32 + 8 + 4 + 1 in zapis(45) = 101101.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#vsota-potenc-45
besedilo: »Torej $45 = 32 + 8 + 4 + 1$.« -/
theorem vsota_potenc_45 : 45 - 32 = 13 ∧ 13 - 8 = 5 ∧ 5 - 4 = 1 ∧ 45 = 32 + 8 + 4 + 1 ∧
    zapis 45 = [1, 0, 1, 1, 0, 1] := by norm_num [zapis]

/-- Razlaga 6 in Ustno vprašanje 2: pri deljenju z 2 je ostanek 0 ali 1 in je zadnja števka zapisa, količnik pa
ima ostale števke (zapis(n) = zapis(n / 2) ++ [n % 2] za n > 0); število je sodo natanko pri zadnji števki 0.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#deljenje-z-2
besedilo: »**Zadnja števka** je ostanek pri deljenju z $2$: $0$ pri sodem, $1$ pri lihem številu.« -/
theorem deljenje_z_2 (n : ℕ) (hn : 0 < n) :
    (n % 2 = 0 ∨ n % 2 = 1) ∧ n = n / 2 * 2 + n % 2 ∧ zapis n = zapis (n / 2) ++ [n % 2] ∧
    (2 ∣ n ↔ n % 2 = 0) := by
  refine ⟨Nat.mod_two_eq_zero_or_one n, by omega, ?_, Nat.dvd_iff_mod_eq_zero⟩
  rw [zapis, zapis, Nat.digits_def' (by norm_num) hn, List.reverse_cons]

/-- Predpostavke `deljenje_z_2` se dajo izpolniti (n = 45). -/
example : 0 < 45 := by norm_num

/-- Razlaga 6: 45 = 101101₍₂₎, 45 : 2 da količnik 22 = 10110₍₂₎ in ostanek 1 (zadnja enica odpade).
trditev: MAT-SS-1/dvojiski-stevilski-sestav#primer-45-22
besedilo: »$45 = 101101_{(2)}$ deljeno z $2$ da količnik $22 = 10110_{(2)}$ in ostanek $1$« -/
theorem primer_45_22 : 45 = 22 * 2 + 1 ∧ zapis 22 = [1, 0, 1, 1, 0] := by norm_num [zapis]

/-- Razlaga 6, premisli, Naloga 1 d): zapis, ki se konča z dvema (tremi) ničlama, je deljiv s 4 (z 8).
trditev: MAT-SS-1/dvojiski-stevilski-sestav#koncne-nicle
besedilo: »Deljivo je s $4$. Vse mestne vrednosti od tretjega mesta naprej ($4$, $8$, $16$ …) so večkratniki števila $4$, zadnji dve mesti pa ne prispevata ničesar.« -/
theorem koncne_nicle (L : List ℕ) : dv (L ++ [0, 0]) = 4 * dv L ∧ dv (L ++ [0, 0, 0]) = 8 * dv L := by
  simp only [dv, List.reverse_append, List.reverse_cons, List.reverse_nil, List.nil_append, List.cons_append,
    Nat.ofDigits_cons]
  constructor <;> ring

/-- Razlaga 7, Ustno vprašanje 3, Primer 3: s k biti zapišeš natanko števila od 0 do 2ᵏ − 1; vseh zapisov je 2ᵏ,
največji (same enice) je 2ᵏ − 1.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#k-bitov
besedilo: »S $k$ biti zapišeš števila od $0$ do $2^k - 1$, to je $2^k$ različnih števil« -/
theorem k_bitov (k : ℕ) :
    (∀ L : List ℕ, L.length = k → (∀ d ∈ L, d < 2) → dv L < 2 ^ k) ∧
    (∀ n, n < 2 ^ k → ∃ L : List ℕ, L.length = k ∧ (∀ d ∈ L, d < 2) ∧ dv L = n) ∧
    Fintype.card (Fin k → Fin 2) = 2 ^ k ∧ dv (List.replicate k 1) = 2 ^ k - 1 := by
  refine ⟨fun L hL hd => ?_, fun n hn => ?_, by simp, ?_⟩
  · have := Nat.ofDigits_lt_base_pow_length (b := 2) (l := L.reverse) (by norm_num)
      (fun x hx => hd x (List.mem_reverse.mp hx))
    rw [List.length_reverse, hL] at this; exact this
  · have hlen : (Nat.digits 2 n).length ≤ k := (Nat.digits_length_le_iff (by norm_num) n).mpr hn
    refine ⟨(Nat.digits 2 n ++ List.replicate (k - (Nat.digits 2 n).length) 0).reverse, ?_, ?_, ?_⟩
    · simp only [List.length_reverse, List.length_append, List.length_replicate]; omega
    · intro d hd
      simp only [List.mem_reverse, List.mem_append, List.mem_replicate] at hd
      rcases hd with hd | ⟨-, rfl⟩
      · exact Nat.digits_lt_base (by norm_num) hd
      · norm_num
    · rw [dv, List.reverse_reverse, Nat.ofDigits_append_replicate_zero, Nat.ofDigits_digits]
  · simp only [dv, List.reverse_replicate]
    induction k with
    | zero => simp
    | succ k ih =>
      rw [List.replicate_succ, Nat.ofDigits_cons, ih, pow_succ]
      have h1 : 1 ≤ 2 ^ k := Nat.one_le_two_pow
      omega

/-! ## Rešeni primeri -/

/-- Primer 2: 89 = 44 · 2 + 1, 44 = 22 · 2 + 0, 22 = 11 · 2 + 0, 11 = 5 · 2 + 1, 5 = 2 · 2 + 1, 2 = 1 · 2 + 0,
1 = 0 · 2 + 1; od spodaj navzgor 1011001₍₂₎; preizkus 64 + 16 + 8 + 1 = 89.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#primer2
besedilo: »Odgovor: $89$ meteorjev zapišemo kot $1011001_{(2)}$.« -/
theorem primer2 :
    89 = 44 * 2 + 1 ∧ 44 = 22 * 2 + 0 ∧ 22 = 11 * 2 + 0 ∧ 11 = 5 * 2 + 1 ∧ 5 = 2 * 2 + 1 ∧ 2 = 1 * 2 + 0 ∧
    1 = 0 * 2 + 1 ∧ zapis 89 = [1, 0, 1, 1, 0, 0, 1] ∧ dv [1, 0, 1, 1, 0, 0, 1] = 64 + 16 + 8 + 1 ∧
    64 + 16 + 8 + 1 = 89 := by
  norm_num [zapis, dv, Nat.ofDigits]

/-- Primer 3: največje 8-bitno število 11111111₍₂₎ = 128 + 64 + … + 1 = 2⁸ − 1 = 255 < 300; 256 ≤ 300 < 512,
300 = 256 + 32 + 8 + 4 = 100101100₍₂₎ ima 9 mest; z največ 8 biti 300 ni mogoče zapisati.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#primer3
besedilo: »Odgovor: z $8$ biti lahko pošlje največ $255$; za $300$ km potrebuje $9$ bitov.« -/
theorem primer3 :
    dv (List.replicate 8 1) = 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 ∧ 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255 ∧
    2 ^ 8 - 1 = 255 ∧ 255 < 300 ∧ (256 ≤ 300 ∧ 300 < 512) ∧ 300 = 256 + 32 + 8 + 4 ∧
    zapis 300 = [1, 0, 0, 1, 0, 1, 1, 0, 0] ∧ (zapis 300).length = 9 ∧
    (∀ k ≤ 8, ∀ L : List ℕ, L.length = k → (∀ d ∈ L, d < 2) → dv L ≠ 300) := by
  refine ⟨by norm_num [dv, Nat.ofDigits], by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num [zapis], by norm_num [zapis], fun k hk L hL hd h => ?_⟩
  have h1 := (k_bitov k).1 L hL hd
  have h2 : 2 ^ k ≤ 2 ^ 8 := Nat.pow_le_pow_right (by norm_num) hk
  norm_num at h2
  omega

/-- Primer 4 in premisli: 58 − 32 = 26, 26 − 16 = 10, 10 = 8 + 2; 58 = 32 + 16 + 8 + 2 = 111010₍₂₎.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#primer4
besedilo: »$10 = 8 + 2$, torej $58 = 32 + 16 + 8 + 2$. Mesta $4$ in $1$ dobita ničlo: $111010_{(2)}$.« -/
theorem primer4 : 58 - 32 = 26 ∧ 26 - 16 = 10 ∧ 10 = 8 + 2 ∧ 58 = 32 + 16 + 8 + 2 ∧ zapis 58 = [1, 1, 1, 0, 1, 0] := by
  norm_num [zapis]

/-! ## Pogoste napake -/

/-- Pogoste napake: ostanki 89 od zgoraj navzdol dajo 1001101₍₂₎ = 77; mestne vrednosti od 2 naprej dajo za
101101₍₂₎ 90 = 2 · 45; 40 = 32 + 8 = 101000₍₂₎, ne 11₍₂₎ = 3; 1100₍₂₎ = 8 + 4 = 12.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#pogoste-napake
besedilo: »Pri $89$ dobi $1001101_{(2)}$, to pa je $77$.« -/
theorem pogoste_napake :
    dv [1, 0, 0, 1, 1, 0, 1] = 64 + 8 + 4 + 1 ∧ 64 + 8 + 4 + 1 = 77 ∧ 2 * dv [1, 0, 1, 1, 0, 1] = 90 ∧
    40 = 32 + 8 ∧ zapis 40 = [1, 0, 1, 0, 0, 0] ∧ dv [1, 1] = 3 ∧ dv [1, 1, 0, 0] = 8 + 4 ∧ 8 + 4 = 12 := by
  norm_num [zapis, dv, Nat.ofDigits]

/-! ## Za maturo -/

/-- Naloga 1: a) 1110011₍₂₎ = 64 + 32 + 16 + 2 + 1 = 115; b) deljenja 200, 100, 50, 25, 12, 6, 3, 1 in
200 = 11001000₍₂₎ (128 + 64 + 8); c) 200 − 115 = 85 = 64 + 16 + 4 + 1 = 1010101₍₂₎; d) tri končne ničle:
11001000₍₂₎ = 8 · 11001₍₂₎ = 8 · 25 = 200, zato je 200 deljivo z 8.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#naloga1
besedilo: »Odgovor: do opoldneva je prišlo $115$ obiskovalcev, popoldne $85 = 1010101_{(2)}$; $200 = 11001000_{(2)}$ je deljivo z $8$.« -/
theorem naloga1 :
    dv [1, 1, 1, 0, 0, 1, 1] = 64 + 32 + 16 + 2 + 1 ∧ 64 + 32 + 16 + 2 + 1 = 115 ∧
    (200 = 100 * 2 + 0 ∧ 100 = 50 * 2 + 0 ∧ 50 = 25 * 2 + 0 ∧ 25 = 12 * 2 + 1 ∧ 12 = 6 * 2 + 0 ∧ 6 = 3 * 2 + 0 ∧
      3 = 1 * 2 + 1 ∧ 1 = 0 * 2 + 1) ∧
    zapis 200 = [1, 1, 0, 0, 1, 0, 0, 0] ∧ 128 + 64 + 8 = 200 ∧ 200 - 115 = 85 ∧ 85 = 64 + 16 + 4 + 1 ∧
    zapis 85 = [1, 0, 1, 0, 1, 0, 1] ∧ dv ([1, 1, 0, 0, 1] ++ [0, 0, 0]) = 8 * dv [1, 1, 0, 0, 1] ∧ dv [1, 1, 0, 0, 1] = 25 ∧
    200 = 8 * 25 ∧ 8 ∣ 200 := by
  refine ⟨by norm_num [dv, Nat.ofDigits], by norm_num, by norm_num, by norm_num [zapis], by norm_num, by norm_num,
    by norm_num, by norm_num [zapis], (koncne_nicle _).2, by norm_num [dv, Nat.ofDigits], by norm_num,
    by norm_num⟩

/-- Naloga 2 a), b): z 9 biti 2⁹ = 512 številk, največja 2⁹ − 1 = 511; 512 < 700 ≤ 1024 = 2¹⁰, zato je potrebnih
najmanj 10 bitov (z 9 ali manj biti ni mogoče zapisati 699, z 10 biti je).
trditev: MAT-SS-1/dvojiski-stevilski-sestav#naloga2-ab
besedilo: »Z $9$ biti je le $512$ številk, kar je manj od $700$. Z $10$ biti je $2^{10} = 1\,024 \ge 700$ številk, največja je $1\,023 \ge 699$. Šola potrebuje najmanj $10$ bitov.« -/
theorem naloga2_ab :
    Fintype.card (Fin 9 → Fin 2) = 2 ^ 9 ∧ (2 : ℕ) ^ 9 = 512 ∧ dv (List.replicate 9 1) = 511 ∧ 512 < 700 ∧
    (2 : ℕ) ^ 10 = 1024 ∧ 700 ≤ 1024 ∧ 699 ≤ 1023 ∧
    (∀ k ≤ 9, ∀ L : List ℕ, L.length = k → (∀ d ∈ L, d < 2) → dv L ≠ 699) ∧
    (∃ L : List ℕ, L.length = 10 ∧ (∀ d ∈ L, d < 2) ∧ dv L = 699) := by
  refine ⟨by simp, by norm_num, by rw [(k_bitov 9).2.2.2]; norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, fun k hk L hL hd h => ?_, (k_bitov 10).2.1 699 (by norm_num)⟩
  have h1 := (k_bitov k).1 L hL hd
  have h2 : 2 ^ k ≤ 2 ^ 9 := Nat.pow_le_pow_right (by norm_num) hk
  norm_num at h2
  omega

/-- Naloga 2 c), d): 1001011010₍₂₎ = 512 + 64 + 16 + 8 + 2 = 602; deljenja 699, 349, 174, 87, 43, 21, 10, 5, 2, 1 in
699 = 1010111011₍₂₎ (512 + 128 + 32 + 16 + 8 + 2 + 1).
trditev: MAT-SS-1/dvojiski-stevilski-sestav#naloga2-cd
besedilo: »Ostanke beremo od spodaj navzgor: $699 = 1010111011_{(2)}$.« -/
theorem naloga2_cd :
    dv [1, 0, 0, 1, 0, 1, 1, 0, 1, 0] = 512 + 64 + 16 + 8 + 2 ∧ 512 + 64 + 16 + 8 + 2 = 602 ∧
    (699 = 349 * 2 + 1 ∧ 349 = 174 * 2 + 1 ∧ 174 = 87 * 2 + 0 ∧ 87 = 43 * 2 + 1 ∧ 43 = 21 * 2 + 1 ∧
      21 = 10 * 2 + 1 ∧ 10 = 5 * 2 + 0 ∧ 5 = 2 * 2 + 1 ∧ 2 = 1 * 2 + 0 ∧ 1 = 0 * 2 + 1) ∧
    zapis 699 = [1, 0, 1, 0, 1, 1, 1, 0, 1, 1] ∧ 512 + 128 + 32 + 16 + 8 + 2 + 1 = 699 := by
  refine ⟨by norm_num [dv, Nat.ofDigits], by norm_num, by norm_num, by norm_num [zapis], by norm_num⟩

/-- Naloga 2 e): če je n = a_k · 2ᵏ + … + a_0, je 2n zapis z ničlo na koncu (števke se premaknejo v levo);
2 · 602 = 1204 = 10010110100₍₂₎ (1024 + 128 + 32 + 16 + 4).
trditev: MAT-SS-1/dvojiski-stevilski-sestav#naloga2-e
besedilo: »Dvakratnik številke $1001011010_{(2)}$ je zato $10010110100_{(2)}$.« -/
theorem naloga2_e (L : List ℕ) :
    dv (L ++ [0]) = 2 * dv L ∧ dv [1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0] = 2 * 602 ∧ 2 * 602 = 1204 ∧
    1024 + 128 + 32 + 16 + 4 = 1204 := by
  refine ⟨?_, by norm_num [dv, Nat.ofDigits], by norm_num, by norm_num⟩
  simp only [dv, List.reverse_append, List.reverse_cons, List.reverse_nil, List.nil_append, List.singleton_append,
    Nat.ofDigits_cons]
  ring

/-! ## Drugače -/

/-- Korak za korakom: 150 = 75 · 2 + 0, 75 = 37 · 2 + 1, 37 = 18 · 2 + 1, 18 = 9 · 2 + 0, 9 = 4 · 2 + 1,
4 = 2 · 2 + 0, 2 = 1 · 2 + 0, 1 = 0 · 2 + 1; 150 = 10010110₍₂₎ (8 mest, 128 + 16 + 4 + 2); sodo, zadnja števka 0.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#korak-150
besedilo: »Ostanke beremo od spodnje vrstice navzgor: $10010110_{(2)}$.« -/
theorem korak_150 :
    (150 = 75 * 2 + 0 ∧ 75 = 37 * 2 + 1 ∧ 37 = 18 * 2 + 1 ∧ 18 = 9 * 2 + 0 ∧ 9 = 4 * 2 + 1 ∧ 4 = 2 * 2 + 0 ∧
      2 = 1 * 2 + 0 ∧ 1 = 0 * 2 + 1) ∧
    zapis 150 = [1, 0, 0, 1, 0, 1, 1, 0] ∧ (2 : ℕ) ^ 7 = 128 ∧ 128 + 16 + 4 + 2 = 150 ∧ 150 % 2 = 0 := by
  refine ⟨by norm_num, by norm_num [zapis], by norm_num, by norm_num, by norm_num⟩

/-- Kot zgodba: dan 2 je 10₍₂₎; pet prstov da do 16 + 8 + 4 + 2 + 1 = 31, deset prstov do 2¹⁰ − 1 = 1023 dni
(med dvema in tremi leti po 365 dni).
trditev: MAT-SS-1/dvojiski-stevilski-sestav#kot-zgodba
besedilo: »Ko vzame še drugo roko, deset prstov prešteje do $2^{10} - 1 = 1023$ dni« -/
theorem kot_zgodba : zapis 2 = [1, 0] ∧ dv (List.replicate 5 1) = 16 + 8 + 4 + 2 + 1 ∧ 16 + 8 + 4 + 2 + 1 = 31 ∧
    dv (List.replicate 10 1) = 2 ^ 10 - 1 ∧ 2 ^ 10 - 1 = 1023 ∧ 2 * 365 < 1023 ∧ 1023 < 3 * 365 := by
  refine ⟨by norm_num [zapis], by norm_num [dv, Nat.ofDigits], by norm_num, (k_bitov 10).2.2.2, by norm_num,
    by norm_num, by norm_num⟩

/-! ## Preveri se -/

/-- Preveri se 1: vsaka mestna vrednost je dvakrat večja od tiste desno od nje; skrajno desna je 1.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#kviz1
besedilo: »Mestne vrednosti so potence števila $2$: $1, 2, 4, 8, 16$ …; vsaka je dvakrat večja od prejšnje.« -/
theorem kviz1 (i : ℕ) : 2 ^ (i + 1) = 2 * 2 ^ i ∧ 2 ^ 0 = 1 := ⟨pow_succ' 2 i, pow_zero 2⟩

/-- Preveri se 2: 110110₍₂₎ = 32 + 16 + 4 + 2 = 54; napačni 108 = 2 · 54 in 011011₍₂₎ = 27.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#kviz2
besedilo: »Enice stojijo na mestih $32$, $16$, $4$ in $2$: $32 + 16 + 4 + 2 = 54$.« -/
theorem kviz2 : dv [1, 1, 0, 1, 1, 0] = 32 + 16 + 4 + 2 ∧ 32 + 16 + 4 + 2 = 54 ∧ 2 * 54 = 108 ∧
    dv [0, 1, 1, 0, 1, 1] = 27 := by
  norm_num [dv, Nat.ofDigits]

/-- Preveri se 3: Lukova deljenja so pravilna, ostanki od spodaj navzgor dajo 10110₍₂₎ = 16 + 4 + 2 = 22;
01101₍₂₎ = 1101₍₂₎ = 13.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#kviz3
besedilo: »Prvi ostanek je zadnja števka. Od spodaj navzgor: $10110_{(2)}$, preizkus $16 + 4 + 2 = 22$.« -/
theorem kviz3 : 22 = 11 * 2 + 0 ∧ 11 = 5 * 2 + 1 ∧ 5 = 2 * 2 + 1 ∧ 2 = 1 * 2 + 0 ∧ 1 = 0 * 2 + 1 ∧
    zapis 22 = [1, 0, 1, 1, 0] ∧ 16 + 4 + 2 = 22 ∧ dv [0, 1, 1, 0, 1] = 13 ∧ dv [1, 1, 0, 1] = 13 := by
  norm_num [zapis, dv, Nat.ofDigits]

/-- Preveri se 4: 111111₍₂₎ = 63, 1000000₍₂₎ = 2⁶ = 64, 1100₍₂₎ = 12; največje je 1000000₍₂₎.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#kviz4
besedilo: »$1000000_{(2)} = 2^6 = 64$, kar je več od $63$, $60$ in $12$.« -/
theorem kviz4 : dv [1, 1, 1, 1, 1, 1] = 32 + 16 + 8 + 4 + 2 + 1 ∧ 32 + 16 + 8 + 4 + 2 + 1 = 63 ∧
    dv [1, 0, 0, 0, 0, 0, 0] = 2 ^ 6 ∧ (2 : ℕ) ^ 6 = 64 ∧ dv [1, 1, 0, 0] = 12 ∧ 63 < 64 ∧ 60 < 64 ∧ 12 < 64 := by
  norm_num [dv, Nat.ofDigits]

/-- Preveri se 5: lučke 1100101₍₂₎ = 64 + 32 + 4 + 1 = 101; od desne prebrano 1010011₍₂₎ = 83; od 2 naprej 202.
trditev: MAT-SS-1/dvojiski-stevilski-sestav#kviz5
besedilo: »$1100101_{(2)}$: enice na mestih $64$, $32$, $4$ in $1$, torej $64 + 32 + 4 + 1 = 101$.« -/
theorem kviz5 : dv [1, 1, 0, 0, 1, 0, 1] = 64 + 32 + 4 + 1 ∧ 64 + 32 + 4 + 1 = 101 ∧
    dv [1, 0, 1, 0, 0, 1, 1] = 83 ∧ 2 * 101 = 202 := by
  norm_num [dv, Nat.ofDigits]

/-- RACUN: vse vrstice bloka.
pomozno – računi skritega bloka RACUN (ni vidno besedilo) -/
theorem racun : 8 + 4 + 2 + 1 = 15 ∧ 1 * 2 ^ 5 + 0 * 2 ^ 4 + 1 * 2 ^ 3 + 1 * 2 ^ 2 + 0 * 2 + 1 = 45 ∧
    44 * 2 + 1 = 89 ∧ 64 + 16 + 8 + 1 = 89 ∧ 2 ^ 8 - 1 = 255 ∧ 256 + 32 + 8 + 4 = 300 ∧ 32 + 16 + 8 + 2 = 58 ∧
    64 + 8 + 4 + 1 = 77 ∧ 32 + 16 + 4 + 2 = 54 ∧ 16 + 4 + 2 = 22 ∧ 64 + 32 + 4 + 1 = 101 ∧
    128 + 16 + 4 + 2 = 150 ∧ 2 ^ 10 - 1 = 1023 ∧ 32 + 16 + 8 + 4 + 2 + 1 = 63 ∧ 64 + 32 + 16 + 2 + 1 = 115 ∧
    128 + 64 + 8 = 200 ∧ 200 - 115 = 85 ∧ 64 + 16 + 4 + 1 = 85 ∧ 200 / 8 = 25 ∧ 2 ^ 9 = 512 ∧ 2 ^ 9 - 1 = 511 ∧
    2 ^ 10 = 1024 ∧ 512 + 64 + 16 + 8 + 2 = 602 ∧ 512 + 128 + 32 + 16 + 8 + 2 + 1 = 699 ∧ 2 * 602 = 1204 ∧
    1024 + 128 + 32 + 16 + 4 = 1204 := by norm_num

end Evklid.Lekcije.MAT_SS_1.DvojiskiStevilskiSestav
