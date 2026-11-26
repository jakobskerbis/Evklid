/-
vir: content/lessons/MAT-OS-7/primerjanje-in-urejanje-ulomkov.md
sha256: e4828fcc309300d35fcee9e60dacd818fb27572c62dc80f7b46bead57a74ff76
Model: ulomki so racionalna števila (`ℚ`); števci in imenovalci v splošnih pravilih so racionalna števila,
imenovalci pozitivni (b > 0, d > 0), pri pravilu enakih števcev tudi števec a > 0 (pri a = 0 sta ulomka enaka).
Najmanjši skupni večkratnik v(m, n) je `Nat.lcm` na naravnih številih; neznanki x v Preveri se 3 in 4 sta
naravni števili (`ℕ`). Urejenost in »leži bolj desno na premici« sta Leanova urejenost `<` na ℚ.
Ni v Leanu: risbe (trakova, številska premica), simulacija in kosi pice kot slika (dokazani so računi v njih, npr.
5/6 = 15/18, 7/9 = 14/18, razlika 1/18); postopek v štirih korakih in »odgovor zapišemo s prvotnima ulomkoma«
(navodilo; dokazane so primerjave prvotnih ulomkov); »najugodnejši je najmanjši skupni večkratnik, ker so števila
najmanjša« je dokazano kot v(b, d) ≤ n za vsak pozitiven skupni večkratnik n; zgodbe (tehtnica na Luni, Marsu,
Veneri …, knjigi, pice, testi) kot besedilo in »približno« pri teži (podatki); utemeljitve s kosi (»več delov,
manjši del«) kot razlaga (dokazana so pravila); besedilo napačnih odgovorov v Preveri se (dokazane so napačne
vrednosti, ki jih razlaga navaja).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.PrimerjanjeInUrejanjeUlomkov

/-! ## Splošna pravila -/

/-- Razlaga 1, Primer 1 (formula), Povzetek: pri enakem imenovalcu b > 0 je a/b < c/b natanko tedaj, ko je
a < c, in a/b = c/b natanko tedaj, ko je a = c. -/
theorem enaka_imenovalca (a b c : ℚ) (hb : 0 < b) : (a / b < c / b ↔ a < c) ∧ (a / b = c / b ↔ a = c) :=
  ⟨div_lt_div_iff_of_pos_right hb, div_left_inj₀ hb.ne'⟩

/-- Predpostavka `enaka_imenovalca` se da izpolniti (b = 7). -/
example : (0:ℚ) < 7 := by norm_num

/-- Razlaga 2, Primer 1 (formula), Povzetek, Pogoste napake 1: pri enakem števcu a > 0 in imenovalcih b, d > 0
je a/b < a/d natanko tedaj, ko je b > d (večji imenovalec, manjši ulomek). -/
theorem enaka_stevca (a b d : ℚ) (ha : 0 < a) (hb : 0 < b) (hd : 0 < d) : a / b < a / d ↔ d < b :=
  div_lt_div_iff_of_pos_left ha hb hd

/-- Predpostavke `enaka_stevca` se dajo izpolniti (a = 3, b = 8, d = 5). -/
example : (0:ℚ) < 3 ∧ (0:ℚ) < 8 ∧ (0:ℚ) < 5 := by norm_num

/-- Razlaga 3 in 5, Bolj natančno, Pogoste napake 3: razširjanje ne spremeni vrednosti: a/b = (a · k)/(b · k) za
k ≠ 0; razširjen samo imenovalec pa vrednost spremeni (2/3 ≠ 2/12). -/
theorem razsirjanje (a b k : ℚ) (hk : k ≠ 0) : a / b = (a * k) / (b * k) ∧ (2:ℚ) / 3 = 8 / 12 ∧
    (2:ℚ) / 3 ≠ 2 / 12 :=
  ⟨(mul_div_mul_right a b hk).symm, by norm_num, by norm_num⟩

/-- Predpostavka `razsirjanje` se da izpolniti (k = 4). -/
example : (4:ℚ) ≠ 0 := by norm_num

/-- Bolj natančno: skupni imenovalec b · d: a/b = (a · d)/(b · d), c/d = (c · b)/(b · d), zato je (b, d > 0)
a/b < c/d natanko tedaj, ko je a · d < c · b (navzkrižno množenje). -/
theorem navzkrizno (a b c d : ℚ) (hb : 0 < b) (hd : 0 < d) :
    a / b = (a * d) / (b * d) ∧ c / d = (c * b) / (b * d) ∧ (a / b < c / d ↔ a * d < c * b) := by
  refine ⟨by field_simp, by field_simp, div_lt_div_iff₀ hb hd⟩

/-- Predpostavki `navzkrizno` se dajo izpolniti (b = 6, d = 9). -/
example : (0:ℚ) < 6 ∧ (0:ℚ) < 9 := by norm_num

/-- Razlaga 4 (preglednica), Povzetek: za b > 0 je a/b < 1 ⇔ a < b, a/b = 1 ⇔ a = b, a/b > 1 ⇔ a > b. -/
theorem primerjava_z_ena (a b : ℚ) (hb : 0 < b) :
    (a / b < 1 ↔ a < b) ∧ (a / b = 1 ↔ a = b) ∧ (1 < a / b ↔ b < a) :=
  ⟨div_lt_one hb, div_eq_one_iff_eq hb.ne', one_lt_div hb⟩

/-- Predpostavka `primerjava_z_ena` se da izpolniti (b = 9). -/
example : (0:ℚ) < 9 := by norm_num

/-- Razlaga 4 (preglednica), Povzetek: za b > 0 je a/b < 1/2 ⇔ 2a < b in a/b > 1/2 ⇔ 2a > b. -/
theorem primerjava_s_polovico (a b : ℚ) (hb : 0 < b) : (a / b < 1 / 2 ↔ 2 * a < b) ∧ (1 / 2 < a / b ↔ b < 2 * a) := by
  constructor
  · rw [div_lt_div_iff₀ hb (by norm_num)]; constructor <;> intro h <;> linarith
  · rw [div_lt_div_iff₀ (by norm_num) hb]; constructor <;> intro h <;> linarith

/-- Predpostavka `primerjava_s_polovico` se da izpolniti (b = 8). -/
example : (0:ℚ) < 8 := by norm_num

/-- Razlaga 4: če je en ulomek manjši od 1/2, drugi pa večji, je prvi manjši od drugega. -/
theorem prek_polovice (x y : ℚ) (hx : x < 1 / 2) (hy : 1 / 2 < y) : x < y := hx.trans hy

/-- Predpostavki `prek_polovice` se dajo izpolniti (x = 3/8, y = 5/9). -/
example : (3:ℚ) / 8 < 1 / 2 ∧ (1:ℚ) / 2 < 5 / 9 := by norm_num

/-- Razlaga 3: najmanjši skupni večkratnik je najmanjši skupni imenovalec: vsak pozitiven skupni večkratnik n
imenovalcev b in d je vsaj v(b, d). -/
theorem nsv_najmanjsi (b d n : ℕ) (hn : 0 < n) (hb : b ∣ n) (hd : d ∣ n) : Nat.lcm b d ≤ n :=
  Nat.le_of_dvd hn (Nat.lcm_dvd hb hd)

/-- Predpostavke `nsv_najmanjsi` se dajo izpolniti (b = 6, d = 9, n = 18). -/
example : 0 < 18 ∧ 6 ∣ 18 ∧ 9 ∣ 18 := by decide

/-- Bolj natančno: med dvema različnima ulomkoma x < y vedno leži še kak ulomek (npr. (x + y)/2), in teh je
neskončno mnogo (»brez konca«). -/
theorem gostost (x y : ℚ) (h : x < y) : (x < (x + y) / 2 ∧ (x + y) / 2 < y) ∧ (Set.Ioo x y).Infinite :=
  ⟨⟨by linarith, by linarith⟩, Set.Ioo_infinite h⟩

/-- Predpostavka `gostost` se da izpolniti (x = 1/3, y = 1/2). -/
example : (1:ℚ) / 3 < 1 / 2 := by norm_num

/-! ## Razlaga: primeri -/

/-- Razlaga 1: 2/7 < 5/7 (2 < 5); preizkus 6/11 > 4/11. Razlaga 2: 3/5 > 3/8; premisli: 2/9 < 2/5. -/
theorem razlaga_1_2 : (2:ℚ) / 7 < 5 / 7 ∧ (4:ℚ) / 11 < 6 / 11 ∧ (3:ℚ) / 8 < 3 / 5 ∧ (2:ℚ) / 9 < 2 / 5 := by
  norm_num

/-- Razlaga 3: v(4, 6) = 12, 3/4 = 9/12, 5/6 = 10/12, 9 < 10, zato 3/4 < 5/6. -/
theorem razlaga_3 : Nat.lcm 4 6 = 12 ∧ (3:ℚ) / 4 = 9 / 12 ∧ (5:ℚ) / 6 = 10 / 12 ∧ (9:ℚ) / 12 < 10 / 12 ∧
    (3:ℚ) / 4 < 5 / 6 := by norm_num

/-- Razlaga 3, preizkus (uvod): v(6, 8) = 24, 1/6 = 4/24 < 9/24 = 3/8 (na Luni lažji); v(20, 25) = 100,
17/20 = 85/100 > 84/100 = 21/25 (matematika boljša). -/
theorem uvod : Nat.lcm 6 8 = 24 ∧ (1:ℚ) / 6 = 4 / 24 ∧ (3:ℚ) / 8 = 9 / 24 ∧ (1:ℚ) / 6 < 3 / 8 ∧
    Nat.lcm 20 25 = 100 ∧ (17:ℚ) / 20 = 85 / 100 ∧ (21:ℚ) / 25 = 84 / 100 ∧ (21:ℚ) / 25 < 17 / 20 := by
  norm_num

/-- Razlaga 4 (preglednica): 7/9 < 1, 6/6 = 1, 9/7 > 1, 3/8 < 1/2 (6 < 8), 5/9 > 1/2 (10 > 9), zato
3/8 < 5/9. -/
theorem razlaga_4 : (7:ℚ) / 9 < 1 ∧ (6:ℚ) / 6 = 1 ∧ (1:ℚ) < 9 / 7 ∧ (2 * 3 : ℚ) = 6 ∧ (3:ℚ) / 8 < 1 / 2 ∧
    (2 * 5 : ℚ) = 10 ∧ (1:ℚ) / 2 < 5 / 9 ∧ (3:ℚ) / 8 < 5 / 9 := by norm_num

/-- Razlaga 4, premisli: 2 · 5 = 10 < 12, zato 5/12 < 1/2; 2 · 4 = 8 > 7, zato 4/7 > 1/2; torej 5/12 < 4/7;
s skupnim imenovalcem 84: 35/84 < 48/84. -/
theorem razlaga_4_premisli : (2 * 5 : ℚ) < 12 ∧ (5:ℚ) / 12 < 1 / 2 ∧ (7 : ℚ) < 2 * 4 ∧ (1:ℚ) / 2 < 4 / 7 ∧
    (5:ℚ) / 12 < 4 / 7 ∧ Nat.lcm 12 7 = 84 ∧ (5:ℚ) / 12 = 35 / 84 ∧ (4:ℚ) / 7 = 48 / 84 ∧
    (35:ℚ) / 84 < 48 / 84 := by norm_num

/-- Razlaga 5: 4/6 = 12/18 = 6/9; preizkus 6/8 = 18/24 = 9/12. -/
theorem enakovredni : (4:ℚ) / 6 = 12 / 18 ∧ (6:ℚ) / 9 = 12 / 18 ∧ (4:ℚ) / 6 = 6 / 9 ∧ (6:ℚ) / 8 = 18 / 24 ∧
    (9:ℚ) / 12 = 18 / 24 ∧ (6:ℚ) / 8 = 9 / 12 := by norm_num

/-- Razlaga 6, preizkus: 1/4 < 1/3 < 1/2. -/
theorem urejanje_polovic : (1:ℚ) / 4 < 1 / 3 ∧ (1:ℚ) / 3 < 1 / 2 := by norm_num

/-- Razlaga 7 (simulacija), Na sliki: 5/6 = 15/18, 7/9 = 14/18; 5/6 je za en košček 1/18 večji (bolj desno). -/
theorem simulacija : (5:ℚ) / 6 = 15 / 18 ∧ (7:ℚ) / 9 = 14 / 18 ∧ (5:ℚ) / 6 - 7 / 9 = 1 / 18 ∧
    (7:ℚ) / 9 < 5 / 6 := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: a) 5 < 7, zato 5/9 < 7/9; b) 8 > 5, zato 3/8 < 3/5. -/
theorem primer1 : ((5:ℚ) < 7 ∧ (5:ℚ) / 9 < 7 / 9) ∧ ((5:ℚ) < 8 ∧ (3:ℚ) / 8 < 3 / 5) := by norm_num

/-- Primer 2, korak 1: večkratniki 6 so 6, 12, 18, 24, večkratniki 9 so 9, 18, 27; v(6, 9) = 18 in noben manjši
pozitiven skupni večkratnik ne obstaja. -/
theorem primer2_nsv : Nat.lcm 6 9 = 18 ∧ (∀ n : ℕ, 0 < n → 6 ∣ n → 9 ∣ n → 18 ≤ n) := by
  refine ⟨by norm_num, fun n hn h6 h9 => ?_⟩
  have := nsv_najmanjsi 6 9 n hn h6 h9
  rwa [show Nat.lcm 6 9 = 18 by norm_num] at this

/-- Primer 2, koraki 2–6: 5/6 = (5 · 3)/(6 · 3) = 15/18, 7/9 = (7 · 2)/(9 · 2) = 14/18, 15/18 > 14/18, zato
5/6 > 7/9; Tina je prebrala več, za 1/18 knjige. -/
theorem primer2 : (5:ℚ) / 6 = (5 * 3) / (6 * 3) ∧ ((5:ℚ) * 3) / (6 * 3) = 15 / 18 ∧
    (7:ℚ) / 9 = (7 * 2) / (9 * 2) ∧ ((7:ℚ) * 2) / (9 * 2) = 14 / 18 ∧ (14:ℚ) / 18 < 15 / 18 ∧
    (7:ℚ) / 9 < 5 / 6 ∧ (5:ℚ) / 6 - 7 / 9 = 1 / 18 := by norm_num

/-- Primer 3, korak 1: 12 ni deljivo z 8, 24 je deljivo s 3, 4, 8 in 12; v(3, 4, 8, 12) = 24, in vsak pozitiven
skupni večkratnik je vsaj 24. -/
theorem primer3_nsv : ¬ 8 ∣ 12 ∧ 3 ∣ 24 ∧ 4 ∣ 24 ∧ 8 ∣ 24 ∧ 12 ∣ 24 ∧
    Nat.lcm (Nat.lcm (Nat.lcm 3 4) 8) 12 = 24 ∧
    (∀ n : ℕ, 0 < n → 3 ∣ n → 4 ∣ n → 8 ∣ n → 12 ∣ n → 24 ≤ n) := by
  refine ⟨by decide, by decide, by decide, by decide, by decide, by norm_num, fun n hn _ _ h8 h12 => ?_⟩
  have := nsv_najmanjsi 8 12 n hn h8 h12
  rwa [show Nat.lcm 8 12 = 24 by norm_num] at this

/-- Primer 3, koraki 2–4: 2/3 = (2 · 8)/(3 · 8) = 16/24, 3/4 = (3 · 6)/(4 · 6) = 18/24,
5/8 = (5 · 3)/(8 · 3) = 15/24, 7/12 = (7 · 2)/(12 · 2) = 14/24; 14 < 15 < 16 < 18, zato
7/12 < 5/8 < 2/3 < 3/4 (največ Lara, najmanj Ula). -/
theorem primer3 : (2:ℚ) / 3 = (2 * 8) / (3 * 8) ∧ ((2:ℚ) * 8) / (3 * 8) = 16 / 24 ∧
    (3:ℚ) / 4 = (3 * 6) / (4 * 6) ∧ ((3:ℚ) * 6) / (4 * 6) = 18 / 24 ∧
    (5:ℚ) / 8 = (5 * 3) / (8 * 3) ∧ ((5:ℚ) * 3) / (8 * 3) = 15 / 24 ∧
    (7:ℚ) / 12 = (7 * 2) / (12 * 2) ∧ ((7:ℚ) * 2) / (12 * 2) = 14 / 24 ∧
    ((14:ℕ) < 15 ∧ (15:ℕ) < 16 ∧ (16:ℕ) < 18) ∧
    ((7:ℚ) / 12 < 5 / 8 ∧ (5:ℚ) / 8 < 2 / 3 ∧ (2:ℚ) / 3 < 3 / 4) := by norm_num

/-- Primer 3, korak 5: vsi štirje ulomki so med 1/2 = 12/24 in 1. -/
theorem primer3_smiselnost : (1:ℚ) / 2 = 12 / 24 ∧
    ∀ x ∈ ({2 / 3, 3 / 4, 5 / 8, 7 / 12} : Set ℚ), 1 / 2 < x ∧ x < 1 := by
  refine ⟨by norm_num, ?_⟩
  intro x hx
  simp only [Set.mem_insert_iff, Set.mem_singleton_iff] at hx
  rcases hx with rfl | rfl | rfl | rfl <;> norm_num

/-- Primer 4: oba ulomka sta med 1/2 in 1; 10 in 9 sta tuji, v(10, 9) = 10 · 9 = 90; 9/10 = 81/90, 8/9 = 80/90,
81 > 80, zato 9/10 > 8/9 (na Veneri več); do 1 manjka 1/10 oz. 1/9, 1/10 < 1/9. -/
theorem primer4 : ((1:ℚ) / 2 < 9 / 10 ∧ (9:ℚ) / 10 < 1 ∧ (1:ℚ) / 2 < 8 / 9 ∧ (8:ℚ) / 9 < 1) ∧
    Nat.Coprime 10 9 ∧ Nat.lcm 10 9 = 10 * 9 ∧ 10 * 9 = 90 ∧ (9:ℚ) / 10 = 81 / 90 ∧ (8:ℚ) / 9 = 80 / 90 ∧
    (8:ℚ) / 9 < 9 / 10 ∧ 1 - (9:ℚ) / 10 = 1 / 10 ∧ 1 - (8:ℚ) / 9 = 1 / 9 ∧ (1:ℚ) / 10 < 1 / 9 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num⟩

/-! ## Pogoste napake -/

/-- Pogoste napake 1, Preveri se 1: 1/8 < 1/5, čeprav je 8 > 5. -/
theorem osmina_petina : (5:ℕ) < 8 ∧ (1:ℚ) / 8 < 1 / 5 := by norm_num

/-- Pogoste napake 2: 3/4 = 21/28 > 16/28 = 4/7 (v(4, 7) = 28), čeprav je 3 < 4. -/
theorem napaka_stevci : Nat.lcm 4 7 = 28 ∧ (3:ℚ) / 4 = 21 / 28 ∧ (4:ℚ) / 7 = 16 / 28 ∧ (4:ℚ) / 7 < 3 / 4 := by
  norm_num

/-- Pogoste napake 4: 3/4 manjka do 1 ena četrtina, 6/7 le ena sedmina, zato 3/4 < 6/7. -/
theorem napaka_razlike : 1 - (3:ℚ) / 4 = 1 / 4 ∧ 1 - (6:ℚ) / 7 = 1 / 7 ∧ (3:ℚ) / 4 < 6 / 7 := by norm_num

/-! ## Bolj natančno -/

/-- Bolj natančno: navzkrižno 5 · 9 = 45 > 42 = 7 · 6, zato 5/6 > 7/9 (in `<<RACUN`: 5 · 9 − 7 · 6 = 3). -/
theorem navzkrizno_primer : (5:ℚ) * 9 = 45 ∧ (7:ℚ) * 6 = 42 ∧ (7:ℚ) / 9 < 5 / 6 ∧ (5:ℤ) * 9 - 7 * 6 = 3 := by
  norm_num

/-- Bolj natančno: 1/3 = 4/12, 1/2 = 6/12, vmes 5/12; 4/12 = 8/24, 5/12 = 10/24, vmes 9/24. -/
theorem vmesni : (1:ℚ) / 3 = 4 / 12 ∧ (1:ℚ) / 2 = 6 / 12 ∧ (4:ℚ) / 12 < 5 / 12 ∧ (5:ℚ) / 12 < 6 / 12 ∧
    (4:ℚ) / 12 = 8 / 24 ∧ (5:ℚ) / 12 = 10 / 24 ∧ (8:ℚ) / 24 < 9 / 24 ∧ (9:ℚ) / 24 < 10 / 24 := by norm_num

/-- Bolj natančno: razširitev na enak števec: 1/7 = 2/14 > 2/15. -/
theorem enak_stevec : (1:ℚ) / 7 = 2 / 14 ∧ (2:ℚ) / 15 < 2 / 14 ∧ (2:ℚ) / 15 < 1 / 7 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 2: A = 7/12, B = 9/12 = 3/4; med njima je 2/3 = 8/12; 1/2 = 6/12 leži levo od A,
7/9 = 28/36 > 27/36 = 3/4 in 4/5 = 16/20 > 15/20 = 3/4 ležita desno od B. -/
theorem preveri2 : (9:ℚ) / 12 = 3 / 4 ∧ (2:ℚ) / 3 = 8 / 12 ∧ (2:ℚ) / 3 ∈ Set.Ioo (7 / 12) (9 / 12) ∧
    (1:ℚ) / 2 = 6 / 12 ∧ (1:ℚ) / 2 < 7 / 12 ∧ (7:ℚ) / 9 = 28 / 36 ∧ (3:ℚ) / 4 = 27 / 36 ∧ (3:ℚ) / 4 < 7 / 9 ∧
    (4:ℚ) / 5 = 16 / 20 ∧ (3:ℚ) / 4 = 15 / 20 ∧ (3:ℚ) / 4 < 4 / 5 := by
  refine ⟨by norm_num, by norm_num, ⟨by norm_num, by norm_num⟩, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Preveri se 3: za naravno število x velja 5/8 < x/24 < 3/4 natanko pri x = 16 ali x = 17 (5/8 = 15/24,
3/4 = 18/24); najmanjši je x = 16. Napačni: 15/24 = 5/8, 18/24 = 3/4, 4/24 < 5/8. -/
theorem preveri3 (x : ℕ) : ((5:ℚ) / 8 < x / 24 ∧ (x:ℚ) / 24 < 3 / 4) ↔ x = 16 ∨ x = 17 := by
  constructor
  · rintro ⟨h1, h2⟩
    have a : (15:ℚ) < x := by linarith
    have b : (x:ℚ) < 18 := by linarith
    have a' : 15 < x := by exact_mod_cast a
    have b' : x < 18 := by exact_mod_cast b
    omega
  · rintro (rfl | rfl) <;> norm_num

/-- Preveri se 3: razširjena ulomka in napačni odgovori. -/
theorem preveri3_koraki : (5:ℚ) / 8 = 15 / 24 ∧ (3:ℚ) / 4 = 18 / 24 ∧ (4:ℚ) / 24 < 5 / 8 := by norm_num

/-- Preveri se 4: za naravni števec x je x/6 < 5/9 natanko pri x ≤ 3 (3x < 10), največji je 3:
3/6 = 9/18 < 10/18 = 5/9; napačna: 4/6 = 12/18 > 10/18, 5/6 > 5/9. -/
theorem preveri4 (x : ℕ) : (x:ℚ) / 6 < 5 / 9 ↔ x ≤ 3 := by
  constructor
  · intro h
    have a : (3:ℚ) * x < 10 := by linarith
    have a' : 3 * x < 10 := by exact_mod_cast a
    omega
  · intro h
    have : (x:ℚ) ≤ 3 := by exact_mod_cast h
    linarith

/-- Preveri se 4: koraki in napačni odgovori. -/
theorem preveri4_koraki : Nat.lcm 6 9 = 18 ∧ (5:ℚ) / 9 = 10 / 18 ∧ (3:ℚ) / 6 = 9 / 18 ∧ (4:ℚ) / 6 = 12 / 18 ∧
    (5:ℚ) / 9 < 4 / 6 ∧ (5:ℚ) / 9 < 5 / 6 := by norm_num

/-- Preveri se 5: 1/7 = 2/14, 1/6 = 2/12; 2/15 < 2/14 < 2/12 < 2/11: Evropa, Titan, Luna, Io. -/
theorem preveri5 : (1:ℚ) / 7 = 2 / 14 ∧ (1:ℚ) / 6 = 2 / 12 ∧ (2:ℚ) / 15 < 1 / 7 ∧ (1:ℚ) / 7 < 1 / 6 ∧
    (1:ℚ) / 6 < 2 / 11 := by norm_num

/-- `<<RACUN`: vse vrstice »enako«. -/
theorem racun : (1:ℚ) / 6 = 4 / 24 ∧ (3:ℚ) / 8 = 9 / 24 ∧ (17:ℚ) / 20 = 85 / 100 ∧ (21:ℚ) / 25 = 84 / 100 ∧
    (5:ℚ) / 12 = 35 / 84 ∧ (4:ℚ) / 7 = 48 / 84 ∧ (5:ℚ) / 6 = 15 / 18 ∧ (7:ℚ) / 9 = 14 / 18 ∧
    (2:ℚ) / 3 = 16 / 24 ∧ (3:ℚ) / 4 = 18 / 24 ∧ (5:ℚ) / 8 = 15 / 24 ∧ (7:ℚ) / 12 = 14 / 24 ∧
    (9:ℚ) / 10 = 81 / 90 ∧ (8:ℚ) / 9 = 80 / 90 ∧ (2:ℚ) / 3 = 8 / 12 ∧ (5:ℚ) / 9 = 10 / 18 ∧
    (1:ℚ) / 7 = 2 / 14 ∧ (1:ℚ) / 6 = 2 / 12 := by norm_num

end Evklid.Lekcije.MAT_OS_7.PrimerjanjeInUrejanjeUlomkov
