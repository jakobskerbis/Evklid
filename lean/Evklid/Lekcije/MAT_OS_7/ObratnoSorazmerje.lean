/-
vir: content/lessons/MAT-OS-7/obratno-sorazmerje.md
sha256: e8c4711d5da8481865e10205f8cf5254727b7263b2d89f1c87ab64235a7bfca4
Ni v Leanu: zgodbe (zidarji, mizarji, tesarji, delavci, deske, črpalke, kulise) so dokazane samo kot
račun s števili; predpostavka »vsi delajo enako hitro in se ne ovirajo« in Pogoj (240 zidarjev ne more
hkrati do stene) sta fizikalni, ne matematični trditvi (dokazano je le 24 : 240 = 1/10); simulacija in
risbe (pravokotniki, krivulja) kot slike: dokazano je, da imajo vsi pravokotniki ploščino 24, da so pari
naravnih števil z zmnožkom 24 natanko našteti, da točke (1, 24), (2, 12), (3, 8) ne ležijo na premici, da
y = k/x za k > 0 na x > 0 strogo pada in da pri k ≠ 0 nobena točka ne leži na osi; »krivulja najprej
strmo, nato vse bolj položno pada« in »se osi približuje« nista dokazani (zahtevno, še ni dokazano kot
lastnost grafa); »tudi k ni 0« (Bolj natančno) je del definicije obratnega sorazmerja, ne izrek; vrstica
tabele »premo: graf je premica skozi (0, 0)« je opis slike (zahtevno, še ni dokazano kot lastnost grafa);
navodila (»preveri smer«, »vprašaj se«) kot besedilo.
Model: količini x, y sta obratno sorazmerni s koeficientom k, ko je x·y = k; računa se v ℚ. Kjer se deli z
x, je x ≠ 0 predpostavka (Leanov dogovor x/0 = 0 se nikjer ne uporabi). Napačni odgovori kvizov: dokazano
je, da napačne vrednosti niso rešitve.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.ObratnoSorazmerje

/-! ## Splošna pravila (Razlaga, Povzetek, Bolj natančno) -/

/-- Bolj natančno: iz x·y = k izrazimo y = k/x (x ≠ 0), in obratno. -/
theorem y_k_x (x y k : ℚ) (hx : x ≠ 0) : x * y = k ↔ y = k / x := by
  rw [eq_div_iff hx]
  constructor <;> intro h <;> linarith

/-- Predpostavka trditve `y_k_x` se da izpolniti (x = 3). -/
example : (3 : ℚ) ≠ 0 := by norm_num

/-- Korak 2, Povzetek in Bolj natančno: če je x₁·y₁ = k, x₂·y₂ = k in x₂ = n·x₁ (n, x₁ ≠ 0), je
y₂ = y₁ : n (n-krat več, n-krat manj). -/
theorem n_krat (x₁ y₁ x₂ y₂ k n : ℚ) (hx : x₁ ≠ 0) (hn : n ≠ 0) (h₁ : x₁ * y₁ = k)
    (h₂ : x₂ * y₂ = k) (hx₂ : x₂ = n * x₁) : y₂ = y₁ / n := by
  subst hx₂
  rw [eq_div_iff hn]
  have : x₁ * (y₂ * n) = x₁ * y₁ := by rw [h₁, ← h₂]; ring
  exact mul_left_cancel₀ hx this

/-- Predpostavke trditve `n_krat` se dajo izpolniti (3 zidarji 8 dni, 6 zidarjev 4 dni, n = 2). -/
example : (3 : ℚ) ≠ 0 ∧ (2 : ℚ) ≠ 0 ∧ (3 : ℚ) * 8 = 24 ∧ (6 : ℚ) * 4 = 24 ∧ (6 : ℚ) = 2 * 3 := by
  norm_num

/-- Korak 4 in Povzetek: za dva para obratno sorazmernih količin velja x₁·y₁ = x₂·y₂; pri x₂ ≠ 0 je to
natanko y₂ = x₁·y₁ : x₂. -/
theorem dva_para (x₁ y₁ x₂ y₂ : ℚ) (hx : x₂ ≠ 0) : x₁ * y₁ = x₂ * y₂ ↔ y₂ = x₁ * y₁ / x₂ := by
  rw [eq_div_iff hx]
  constructor <;> intro h <;> linarith

/-- Predpostavka trditve `dva_para` se da izpolniti (x₂ = 6). -/
example : (6 : ℚ) ≠ 0 := by norm_num

/-- Korak 5, Povzetek in Bolj natančno: če eno količino pomnožimo s p/q (p, q, x₁ ≠ 0), se druga pomnoži
s q/p; (p/q)·(q/p) = 1. -/
theorem ulomek_faktor (x₁ y₁ y₂ p q : ℚ) (hx : x₁ ≠ 0) (hp : p ≠ 0) (hq : q ≠ 0)
    (h : x₁ * y₁ = (p / q * x₁) * y₂) : y₂ = q / p * y₁ ∧ p / q * (q / p) = 1 := by
  refine ⟨?_, by field_simp⟩
  have h' : x₁ * (p / q * y₂) = x₁ * y₁ := by rw [h]; ring
  have h2 : p / q * y₂ = y₁ := mul_left_cancel₀ hx h'
  rw [← h2]
  field_simp

/-- Predpostavke trditve `ulomek_faktor` se dajo izpolniti (4 tesarji 9 dni, faktor 3/2, 6 dni). -/
example : (4 : ℚ) ≠ 0 ∧ (3 : ℚ) ≠ 0 ∧ (2 : ℚ) ≠ 0 ∧ (4 : ℚ) * 9 = (3 / 2 * 4) * 6 := by norm_num

/-- Korak 3 in Bolj natančno (enoličnost): če je x·f(x) = k za vse x ≠ 0 in je f(3) = 8 (3 zidarji, 8 dni),
je k = 24 in f(x) = 24/x za vsak x ≠ 0. -/
theorem enolicnost (f : ℚ → ℚ) (k : ℚ) (hf : ∀ x, x ≠ 0 → x * f x = k) (h3 : f 3 = 8) :
    k = 24 ∧ ∀ x, x ≠ 0 → f x = 24 / x := by
  have hk : k = 24 := by rw [← hf 3 (by norm_num), h3]; norm_num
  refine ⟨hk, fun x hx => ?_⟩
  rw [← (y_k_x x (f x) 24 hx), ← hk]
  exact hf x hx

/-- Predpostavke trditve `enolicnost` se dajo izpolniti (f(x) = 24/x, k = 24). -/
example : (∀ x : ℚ, x ≠ 0 → x * (24 / x) = 24) ∧ (24 : ℚ) / 3 = 8 :=
  ⟨fun x hx => by field_simp, by norm_num⟩

/-- Bolj natančno in Na sliki: pri k ≠ 0 iz x·y = k sledi x ≠ 0 in y ≠ 0 (noben zmnožek z ničlo ni k,
zato točka ne leži na osi). -/
theorem ni_nic (x y k : ℚ) (hk : k ≠ 0) (h : x * y = k) : x ≠ 0 ∧ y ≠ 0 := by
  constructor <;> rintro rfl <;> simp at h <;> exact hk h.symm

/-- Predpostavke trditve `ni_nic` se dajo izpolniti (1·24 = 24). -/
example : (24 : ℚ) ≠ 0 ∧ (1 : ℚ) * 24 = 24 := by norm_num

/-- Korak 7 in Bolj natančno (graf): pri k > 0 je y = k/x na x > 0 strogo padajoča (večji x, manjši y). -/
theorem pada (k x₁ x₂ : ℚ) (hk : 0 < k) (h1 : 0 < x₁) (h12 : x₁ < x₂) : k / x₂ < k / x₁ :=
  div_lt_div_of_pos_left hk h1 h12

/-- Predpostavke trditve `pada` se dajo izpolniti (k = 24, x₁ = 2, x₂ = 6). -/
example : (0 : ℚ) < 24 ∧ (0 : ℚ) < 2 ∧ (2 : ℚ) < 6 := by norm_num

/-- Korak 7 in Na sliki: točke (1, 24), (2, 12), (3, 8) ne ležijo na isti premici (naklona se razlikujeta). -/
theorem ni_premica : ((12 : ℚ) - 24) / (2 - 1) ≠ (8 - 12) / (3 - 2) := by norm_num

/-- Bolj natančno (primerjava): pri premem sorazmerju y = k·x se ob podvojitvi x podvoji y, pri obratnem
y = k/x se razpolovi. -/
theorem premo_obratno (k x : ℚ) : k * (2 * x) = 2 * (k * x) ∧ k / (2 * x) = (k / x) / 2 := by
  refine ⟨by ring, ?_⟩
  rw [div_div, mul_comm]

/-! ## Razlaga, koraki 1–5 -/

/-- Korak 1: 3 zidarje zamenja 6, zid je gotov v 8 : 2 = 4 dneh; hitri preizkus: 2 mizarja 6 dni →
4 mizarji 3 dni. -/
theorem korak1 : (8 : ℚ) / 2 = 4 ∧ (3 : ℚ) * 8 = 6 * 4 ∧ (2 : ℚ) * 6 = 4 * 3 := by norm_num

/-- Korak 1 (hitri preizkus): 2 mizarja izdelata omaro v 6 dneh; štirje natanko v 3 dneh. -/
theorem mizarji (y : ℚ) : (2 : ℚ) * 6 = 4 * y ↔ y = 3 := by
  constructor <;> intro h <;> linarith

/-- Korak 2 (premisli): en sam zidar bi zidal natanko 8·3 = 24 dni. -/
theorem en_zidar (y : ℚ) : ((3 : ℚ) * 8 = 1 * y ↔ y = 24) ∧ (8 : ℚ) * 3 = 24 := by
  refine ⟨by constructor <;> intro h <;> linarith, by norm_num⟩

/-- Korak 2: če se ena količina potroji, je druga trikrat manjša; če se zmanjša na četrtino, je druga
štirikrat večja (k = 24, x = 2: 24/6 = 12/3 in 24/(1/2) = 4·12). -/
theorem korak2 : (24 : ℚ) / (3 * 2) = (24 / 2) / 3 ∧ (24 : ℚ) / (1 / 4 * 2) = 4 * (24 / 2) := by norm_num

/-- Korak 3 (tabela): zmnožki 1·24, 2·12, 3·8, 4·6, 6·4 so vsi 24. -/
theorem tabela : (1 : ℚ) * 24 = 24 ∧ (2 : ℚ) * 12 = 24 ∧ (3 : ℚ) * 8 = 24 ∧ (4 : ℚ) * 6 = 24 ∧
    (6 : ℚ) * 4 = 24 := by norm_num

/-- Korak 3 (hitri preizkus): par 5 zidarjev, 5 dni ne sodi v tabelo, ker je 5·5 = 25 ≠ 24. -/
theorem pet_pet : (5 : ℚ) * 5 = 25 ∧ (25 : ℚ) ≠ 24 := by norm_num

/-- Korak 4 (Žan): 3·8 = 6·y, torej 24 = 6·y in y = 24 : 6 = 4 dni; to je edina rešitev, 16 ni. -/
theorem zan (y : ℚ) : (3 : ℚ) * 8 = 6 * y ↔ y = 4 := by
  rw [dva_para 3 8 6 y (by norm_num)]
  norm_num

/-- Korak 4 (Žan): korak za korakom 3·8 = 24 in 24 : 6 = 4; Žanov odgovor 16 ni rešitev. -/
theorem zan_koraki : (3 : ℚ) * 8 = 24 ∧ (24 : ℚ) / 6 = 4 ∧ (3 : ℚ) * 8 ≠ 6 * 16 := by norm_num

/-- Korak 4 (hitri preizkus): 12 zidarjev potrebuje natanko 24 : 12 = 2 dni. -/
theorem dvanajst (y : ℚ) : (24 : ℚ) = 12 * y ↔ y = 2 := by
  constructor <;> intro h <;> linarith

/-- Korak 5: 4 tesarji 9 dni, pride 6: faktor 6/4 = 3/2, dni 9·(2/3) = 6; preizkus 4·9 = 36 = 6·6;
6 dni je edina rešitev. -/
theorem korak5 (y : ℚ) : ((6 : ℚ) / 4 = 3 / 2 ∧ (9 : ℚ) * (2 / 3) = 6 ∧ (4 : ℚ) * 9 = 36 ∧
    (6 : ℚ) * 6 = 36) ∧ ((4 : ℚ) * 9 = 6 * y ↔ y = 6) := by
  refine ⟨by norm_num, by constructor <;> intro h <;> linarith⟩

/-- Korak 5 (hitri preizkus): delavce pomnožimo s 4/3, dni se pomnožijo s 3/4 (4/3·3/4 = 1). -/
theorem stiri_tretjine : (4 : ℚ) / 3 * (3 / 4) = 1 := by norm_num

/-! ## Korak 6 in Pogoste napake: deska 100 cm -/

/-- Korak 6 (premisli): pri x + y = 100 je pri x = 20 y = 80, pri x = 40 y = 60; zmnožka 1600 in 2400
nista enaka, zato x in y nista obratno sorazmerni; stalna je vsota. -/
theorem deska : (20 : ℚ) + 80 = 100 ∧ (40 : ℚ) + 60 = 100 ∧ (20 : ℚ) * 80 = 1600 ∧ (40 : ℚ) * 60 = 2400 ∧
    (1600 : ℚ) ≠ 2400 ∧ (40 : ℚ) = 2 * 20 ∧ (60 : ℚ) ≠ 80 / 2 := by norm_num

/-- Korak 6 in Bolj natančno: pri x + y = 100 ni nobenega k, da bi bilo x·y = k za vse x (protiprimer
x = 20 in x = 40); ko x zraste za d, y pade za d (vsota ostane 100). -/
theorem deska_ni_obratno :
    (¬ ∃ k : ℚ, ∀ x : ℚ, x * (100 - x) = k) ∧ ∀ x d : ℚ, (x + d) + ((100 - x) - d) = 100 := by
  refine ⟨?_, fun x d => by ring⟩
  rintro ⟨k, hk⟩
  have h1 := hk 20
  have h2 := hk 40
  norm_num at h1 h2
  linarith

/-! ## Primer 1 -/

/-- Primer 1: 20·12 = 30·8 = 40·6 = 60·4 = 240, zato sta količini obratno sorazmerni in k = 240 je edini
koeficient, ki ustreza vsem parom. -/
theorem primer1 (k : ℚ) :
    ((20 : ℚ) * 12 = 240 ∧ (30 : ℚ) * 8 = 240 ∧ (40 : ℚ) * 6 = 240 ∧ (60 : ℚ) * 4 = 240) ∧
      ((20 * 12 = k ∧ 30 * 8 = k ∧ 40 * 6 = k ∧ 60 * 4 = k) ↔ k = 240) := by
  refine ⟨by norm_num, ?_⟩
  constructor
  · rintro ⟨h, -⟩; linarith
  · rintro rfl; norm_num

/-! ## Primer 2 -/

/-- Primer 2: 6·10 = 60 tesar-dni; 4·y₂ = 60 natanko za y₂ = 60 : 4 = 15; 15 > 10 (manj tesarjev, več dni). -/
theorem primer2 (y₂ : ℚ) : ((6 : ℚ) * 10 = 60 ∧ (60 : ℚ) / 4 = 15 ∧ (15 : ℚ) > 10) ∧
    ((6 : ℚ) * 10 = 4 * y₂ ↔ y₂ = 15) := by
  refine ⟨by norm_num, ?_⟩
  rw [dva_para 6 10 4 y₂ (by norm_num)]
  norm_num

/-! ## Primer 3 -/

/-- Primer 3, koraki 1–5: 8·15 = 120, 8·5 = 40, 120 − 40 = 80, 8 + 2 = 10, 80 : 10 = 8, 5 + 8 = 13;
napačno 120 : 10 = 12; 13 je 2 dni manj kot 15. -/
theorem primer3_koraki : (8 : ℚ) * 15 = 120 ∧ (8 : ℚ) * 5 = 40 ∧ (120 : ℚ) - 40 = 80 ∧ (8 : ℚ) + 2 = 10 ∧
    (80 : ℚ) / 10 = 8 ∧ (5 : ℚ) + 8 = 13 ∧ (15 : ℚ) - 13 = 2 ∧ (120 : ℚ) / 10 = 12 ∧ (12 : ℚ) ≠ 13 := by
  norm_num

/-- Primer 3 (odgovor): če 8 delavcev dela 5 dni in nato 10 delavcev še t dni, je celo delo (8·15)
opravljeno natanko pri t = 8, skupaj torej 5 + t = 13 dni. -/
theorem primer3 (t : ℚ) : (8 * 5 + 10 * t = (8 : ℚ) * 15 ↔ t = 8) := by
  constructor <;> intro h <;> linarith

/-! ## Primer 4 -/

/-- Primer 4 in premisli: 48·15 = 720 cm; 12·y = 720 natanko za y = 720 : 12 = 60 desk; 60 > 48. -/
theorem primer4 (y : ℚ) : ((48 : ℚ) * 15 = 720 ∧ (720 : ℚ) / 12 = 60 ∧ (60 : ℚ) > 48) ∧
    ((48 : ℚ) * 15 = 12 * y ↔ y = 60) := by
  refine ⟨by norm_num, ?_⟩
  rw [dva_para 48 15 12 y (by norm_num)]
  norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake (Žan): 6 zidarjev 16 dni ni rešitev (3·8 = 24 ≠ 6·16 = 96). -/
theorem napaka_zan : (3 : ℚ) * 8 ≠ 6 * 16 := by norm_num

/-- Pogoste napake in Preveri se 4: 5 črpalk 12 minut; 10 črpalk natanko 6 minut (5·12 = 60, 60 : 10 = 6);
7 minut (razlika) in 24 minut (premo) nista rešitvi, 60 je koeficient. -/
theorem crpalke (t : ℚ) : ((5 : ℚ) * 12 = 10 * t ↔ t = 6) ∧ (5 : ℚ) * 12 = 60 ∧ (60 : ℚ) / 10 = 6 ∧
    (5 : ℚ) * 12 ≠ 10 * 7 ∧ (5 : ℚ) * 12 ≠ 10 * 24 ∧ (5 : ℚ) * 12 ≠ 10 * 60 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  constructor <;> intro h <;> linarith

/-- Pogoste napake in Preveri se 2 (Tina): enačba premega sorazmerja 4/6 = 8/y vodi v y = 12; pravilna
enakost zmnožkov 4·6 = 8·y da y = 3. -/
theorem tina (y : ℚ) : ((4 : ℚ) / 6 = 8 / y ↔ y = 12) ∧ ((4 : ℚ) * 6 = 8 * y ↔ y = 3) := by
  constructor
  · constructor
    · intro h
      have hy : y ≠ 0 := by rintro rfl; norm_num at h
      rw [div_eq_div_iff (by norm_num) hy] at h
      linarith
    · rintro rfl; norm_num
  · constructor <;> intro h <;> linarith

/-- Preveri se 2: Tinina enačba je izračunana pravilno (y = 12, ne 16), a 12 ni rešitev naloge
(4·6 ≠ 8·12); 24 = 8·y da y = 3. -/
theorem tina_ni_16 : (4 : ℚ) / 6 ≠ 8 / 16 ∧ (4 : ℚ) * 6 ≠ 8 * 12 ∧ (24 : ℚ) = 8 * 3 := by norm_num

/-! ## Na sliki -/

/-- Na sliki: pravokotniki iz 24 kvadratkov (naravni stranici) so natanko 1×24, 2×12, 3×8, 4×6, 6×4, 8×3,
12×2 in 24×1. -/
theorem pravokotniki_24 :
    Nat.divisorsAntidiagonal 24 =
      {(1, 24), (2, 12), (3, 8), (4, 6), (6, 4), (8, 3), (12, 2), (24, 1)} := by decide

/-! ## Preveri se -/

/-- Preveri se 1: pri obratnem sorazmerju je stalen zmnožek (1·24 = 2·12), količnik ni (24/1 ≠ 12/2);
ob podvojitvi x se y razpolovi, ne zmanjša za 2 (12 ≠ 24 − 2). -/
theorem kviz1 : (1 : ℚ) * 24 = 2 * 12 ∧ (24 : ℚ) / 1 ≠ 12 / 2 ∧ (24 : ℚ) / 2 = 12 ∧ (12 : ℚ) ≠ 24 - 2 := by
  norm_num

/-- Preveri se 3: kuhinja A 3·12 = 36 mizar-dni, B 4·10 = 40, zato je bilo več dela za B. -/
theorem kviz3 : (3 : ℚ) * 12 = 36 ∧ (4 : ℚ) * 10 = 40 ∧ (36 : ℚ) < 40 := by norm_num

/-- Preveri se 5: 6·10 = 60; v 4 urah 6·4 = 24, ostane 36, 9 učencev 36 : 9 = 4 ure, skupaj 8; preostanek
t ustreza natanko t = 4. Napačni odgovori: 15 = 10·9 : 6 (premo), 4 (le preostanek) in 60 : 9 ≈ 6,7
(devet učencev od začetka) niso 8. -/
theorem kviz5 (t : ℚ) : ((6 : ℚ) * 10 = 60 ∧ (6 : ℚ) * 4 = 24 ∧ (60 : ℚ) - 24 = 36 ∧ (6 : ℚ) + 3 = 9 ∧
    (36 : ℚ) / 9 = 4 ∧ (4 : ℚ) + 4 = 8) ∧ (6 * 4 + 9 * t = (6 : ℚ) * 10 ↔ t = 4) ∧
    ((10 : ℚ) * 9 / 6 = 15 ∧ |(60 : ℚ) / 9 - 6.7| < 0.05 ∧ (4 : ℚ) ≠ 8 ∧ (15 : ℚ) ≠ 8 ∧
    (60 : ℚ) / 9 ≠ 8) := by
  refine ⟨by norm_num, by constructor <;> intro h <;> linarith,
    ⟨by norm_num, ?_, by norm_num, by norm_num, by norm_num⟩⟩
  rw [abs_lt]; constructor <;> norm_num

/-! ## Pogoj -/

/-- Pogoj: po računu bi 240 zidarjev zid pozidalo v 24 : 240 = 1/10 dneva (desetinka). -/
theorem pogoj : (24 : ℚ) / 240 = 1 / 10 := by norm_num

end Evklid.Lekcije.MAT_OS_7.ObratnoSorazmerje
