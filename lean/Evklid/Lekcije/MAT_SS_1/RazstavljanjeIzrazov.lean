/-
vir: content/lessons/MAT-SS-1/razstavljanje-izrazov.md
sha256: f2e75c3bddddd92c732439b5c293b2151adba5465af6776cec720c575cb0ee5b
Ni v Leanu: definicije in poimenovanja (razstaviti, faktor, popoln razcep, tričlenik, prosti člen, razcepna
enačba) ter postopki in nasveti (poišči največji skupni delitelj in najmanjši eksponent, vrstni red korakov v
Razlagi 5, Povzetku in Ponovitvi, »množiti znaš vedno, pri razstavljanju iščemo vzorec«, »enačbe ne deli z x«
kot navodilo); trditvi »razcep ni popoln« pri 3(2x² − 3x) in (x² − 4)(x² + 4) ter »popoln razcep« na splošno,
ker pojem nerazstavljivosti s celimi števili ni formaliziran (dokazane so enakosti razcepov, da x² + b² pri
b ≠ 0 in x² + c pri c > 0 nimata realnega razcepa (x + m)(x + n), da x² − 2 nima razcepa (x + a)(x + b) s
celima a, b, in da X³ ne deli X²); »če takega para ni, tričlenika s celimi števili ne moremo razstaviti«
je dokazano kot: iz (x + a)(x + b) = x² + px + q za vse x sledi a + b = p in ab = q; risbe in simulacija
(dokazane so ustrezne enakosti ploščin); geometrijski razrez črke L kot opis (dokazana je enakost
a² − b² = a(a − b) + b(a − b) = (a − b)(a + b)); točkovanje maturitetnih nalog; besedila napačnih odgovorov v
Preveri se (dokazano je, da so napačne vrednosti oz. razcepi res napačni). Deljenja členov v Primeru 1
(12a²b : 6ab = 2a …) so dokazana kot zmnožki preizkusa (6ab · 2a = 12a²b …), ker deljenje velja le za
a, b ≠ 0. Pari števil pri Vietovem pravilu so dokazani v ℝ kot edina rešitev sistema a + b = p, ab = q.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.RazstavljanjeIzrazov

open Polynomial

/-! ## Pomožne trditve -/

/-- Pomožno (Razlaga 6): enačbi a = b in c = d sta enakovredni, če je a − b = c − d (prenos členov). -/
theorem iff_of_sub {a b c d : ℝ} (h : a - b = c - d) : a = b ↔ c = d := by
  constructor <;> intro h' <;> linarith

/-- Predpostavka `iff_of_sub` se da izpolniti. -/
example : (2 : ℝ) = 2 ↔ (0 : ℝ) = 0 := iff_of_sub (by norm_num)

/-- Razlaga 4, Ustno vprašanje 2, Bolj natančno: če r₁ + r₂ = p in r₁r₂ = q, sta r₁, r₂ (v poljubnem vrstnem
redu) edini števili a, b z a + b = p in ab = q. -/
theorem par (p q a b r₁ r₂ : ℝ) (hs : r₁ + r₂ = p) (hp : r₁ * r₂ = q) :
    a + b = p ∧ a * b = q ↔ (a = r₁ ∧ b = r₂) ∨ (a = r₂ ∧ b = r₁) := by
  constructor
  · rintro ⟨h1, h2⟩
    have hb : b = p - a := by linarith
    subst hb
    have h : (a - r₁) * (a - r₂) = 0 := by linear_combination -h2 - a * hs + hp
    rcases mul_eq_zero.mp h with h | h
    · left; constructor <;> linarith
    · right; constructor <;> linarith
  · rintro (⟨rfl, rfl⟩ | ⟨rfl, rfl⟩)
    · exact ⟨hs, hp⟩
    · exact ⟨by linarith, by rw [mul_comm]; exact hp⟩

/-- Predpostavki `par` se dajo izpolniti (p = 7, q = 12, r₁ = 3, r₂ = 4). -/
example : (3 : ℝ) + 4 = 7 ∧ (3 : ℝ) * 4 = 12 ↔ ((3 : ℝ) = 3 ∧ (4 : ℝ) = 4) ∨ ((3 : ℝ) = 4 ∧ (4 : ℝ) = 3) :=
  par 7 12 3 4 3 4 (by norm_num) (by norm_num)

/-! ## Zakaj se tega učimo -/

/-- Zakaj se tega učimo: 52² = 2704, 48² = 2304, razlika 400; na pamet (52 − 48)(52 + 48) = 4·100 = 400;
pri 50 m² na vrečo je to 400 / 50 = 8 vreč. -/
theorem travnik : (52 : ℝ) ^ 2 = 2704 ∧ (48 : ℝ) ^ 2 = 2304 ∧ (2704 : ℝ) - 2304 = 400 ∧
    (52 : ℝ) ^ 2 - 48 ^ 2 = (52 - 48) * (52 + 48) ∧ ((52 - 48) * (52 + 48) : ℝ) = 4 * 100 ∧
    (4 * 100 : ℝ) = 400 ∧ (400 : ℝ) / 50 = 8 := by
  norm_num

/-- Zakaj se tega učimo, Razlaga 6, Povzetek: produkt je 0 natanko tedaj, ko je vsaj en faktor 0. -/
theorem produkt_nic (A B : ℝ) : A * B = 0 ↔ A = 0 ∨ B = 0 := mul_eq_zero

/-! ## Razlaga 1 in 2: izpostavljanje -/

/-- Razlaga 1: 7·13 = 91 in 3x(x + 2) = 3x² + 6x (oz. obratno, razcep). -/
theorem razlaga1 (x : ℝ) : (7 * 13 : ℝ) = 91 ∧ 3 * x * (x + 2) = 3 * x ^ 2 + 6 * x := by
  constructor
  · norm_num
  · ring

/-- Razlaga 2, Povzetek: ab + ac = a(b + c). -/
theorem izpostavljanje (a b c : ℝ) : a * b + a * c = a * (b + c) := (mul_add a b c).symm

/-- Primer 1 (formula): ab + ac + ad = a(b + c + d). -/
theorem izpostavljanje3 (a b c d : ℝ) : a * b + a * c + a * d = a * (b + c + d) := by ring

/-- Razlaga 2: D(12, 18) = 6 in 12x³y − 18x²y² = 6x²y(2x − 3y). -/
theorem razlaga2_primer (x y : ℝ) : Nat.gcd 12 18 = 6 ∧
    12 * x ^ 3 * y - 18 * x ^ 2 * y ^ 2 = 6 * x ^ 2 * y * (2 * x - 3 * y) := by
  constructor
  · norm_num
  · ring

/-- Razlaga 2: cel oklepaj kot skupni faktor: a(x + 1) + b(x + 1) = (a + b)(x + 1). -/
theorem oklepaj_faktor (a b x : ℝ) : a * (x + 1) + b * (x + 1) = (a + b) * (x + 1) := by ring

/-- Razlaga 2, Premisli: x³ ne deli x² (kot mnogočlenika), zato x³ ni skupni faktor. -/
theorem x3_ne_deli : ¬ ((X : ℝ[X]) ^ 3 ∣ X ^ 2) := by
  intro h
  have := Polynomial.natDegree_le_of_dvd h (pow_ne_zero 2 X_ne_zero)
  simp at this

/-- Razlaga 2, Povzetek: po skupinah ax + ay + bx + by = a(x + y) + b(x + y) = (a + b)(x + y). -/
theorem po_skupinah (a b x y : ℝ) : a * x + a * y + b * x + b * y = (a + b) * (x + y) := by
  calc a * x + a * y + b * x + b * y = a * (x + y) + b * (x + y) := by ring
    _ = (a + b) * (x + y) := by ring

/-- Razlaga 2: izpostavljanje negativnega faktorja: −a − b = −(a + b) in b − a = −(a − b). -/
theorem minus_izpostavi (a b : ℝ) : -a - b = -(a + b) ∧ b - a = -(a - b) := by
  constructor <;> ring

/-! ## Razlaga 3: obrazci -/

/-- Razlaga 3, Povzetek: a² − b² = (a − b)(a + b). -/
theorem razlika_kvadratov (a b : ℝ) : a ^ 2 - b ^ 2 = (a - b) * (a + b) := by ring

/-- Razlaga 3, Povzetek: a² + 2ab + b² = (a + b)² in a² − 2ab + b² = (a − b)². -/
theorem popolni_kvadrat (a b : ℝ) : a ^ 2 + 2 * a * b + b ^ 2 = (a + b) ^ 2 ∧
    a ^ 2 - 2 * a * b + b ^ 2 = (a - b) ^ 2 := by
  constructor <;> ring

/-- Razlaga 3: 9x² = (3x)², 16 = 4², 9x² − 16 = (3x − 4)(3x + 4); x² + 10x + 25 = (x + 5)²;
4x² − 12x + 9 = (2x − 3)². -/
theorem razlaga3_primeri (x : ℝ) : 9 * x ^ 2 = (3 * x) ^ 2 ∧ (16 : ℝ) = 4 ^ 2 ∧
    9 * x ^ 2 - 16 = (3 * x - 4) * (3 * x + 4) ∧ x ^ 2 + 10 * x + 25 = (x + 5) ^ 2 ∧
    4 * x ^ 2 - 12 * x + 9 = (2 * x - 3) ^ 2 := by
  refine ⟨by ring, by norm_num, by ring, by ring, by ring⟩

/-- Razlaga 3, Povzetek: vsote kvadratov x² + b² (b ≠ 0) ni mogoče zapisati kot (x + m)(x + n) z realnima
m, n. -/
theorem vsota_kvadratov (b : ℝ) (hb : b ≠ 0) :
    ¬ ∃ m n : ℝ, ∀ x : ℝ, x ^ 2 + b ^ 2 = (x + m) * (x + n) := by
  rintro ⟨m, n, h⟩
  have h0 := h (-m)
  rw [show -m + m = 0 by ring, zero_mul] at h0
  have hb2 : b ^ 2 = 0 := by linarith [neg_sq m, sq_nonneg m, sq_nonneg b]
  exact hb (pow_eq_zero_iff two_ne_zero |>.mp hb2)

/-- Predpostavka `vsota_kvadratov` se da izpolniti (b = 3, x² + 9). -/
example : ¬ ∃ m n : ℝ, ∀ x : ℝ, x ^ 2 + 3 ^ 2 = (x + m) * (x + n) := vsota_kvadratov 3 (by norm_num)

/-- Ustno vprašanje 3 in Bolj natančno: za c > 0 izraza x² + c ni mogoče zapisati kot (x + a)(x + b) z
realnima a, b (pri x = −a je desna stran 0, leva a² + c > 0). -/
theorem x2_plus_c (c : ℝ) (hc : 0 < c) : ¬ ∃ a b : ℝ, ∀ x : ℝ, x ^ 2 + c = (x + a) * (x + b) := by
  rintro ⟨a, b, h⟩
  have h0 := h (-a)
  rw [show -a + a = 0 by ring, zero_mul] at h0
  nlinarith [neg_sq a, sq_nonneg a]

/-- Predpostavka `x2_plus_c` se da izpolniti (c = 1, x² + 1 iz Bolj natančno). -/
example : ¬ ∃ a b : ℝ, ∀ x : ℝ, x ^ 2 + 1 = (x + a) * (x + b) := x2_plus_c 1 one_pos

/-! ## Razlaga 4: Vietovo pravilo -/

/-- Razlaga 4, Bolj natančno: (x + a)(x + b) = x² + bx + ax + ab = x² + (a + b)x + ab. -/
theorem zmnozek_dvoclenikov (x a b : ℝ) : (x + a) * (x + b) = x ^ 2 + (a + b) * x + a * b := by
  calc (x + a) * (x + b) = x ^ 2 + b * x + a * x + a * b := by ring
    _ = x ^ 2 + (a + b) * x + a * b := by ring

/-- Razlaga 4, Povzetek: če je a + b = p in ab = q, je x² + px + q = (x + a)(x + b). -/
theorem vieta (x p q a b : ℝ) (hp : a + b = p) (hq : a * b = q) :
    x ^ 2 + p * x + q = (x + a) * (x + b) := by
  rw [zmnozek_dvoclenikov, hp, hq]

/-- Predpostavki `vieta` se dajo izpolniti (x² + 7x + 12, a = 3, b = 4). -/
example (x : ℝ) : x ^ 2 + 7 * x + 12 = (x + 3) * (x + 4) := vieta x 7 12 3 4 (by norm_num) (by norm_num)

/-- Bolj natančno: primerjava koeficientov; če (x + a)(x + b) = x² + px + q velja za vse x, je a + b = p in
ab = q (če takega para ni, razcepa (x + a)(x + b) ni). -/
theorem vieta_obrat (p q a b : ℝ) (h : ∀ x : ℝ, x ^ 2 + p * x + q = (x + a) * (x + b)) :
    a + b = p ∧ a * b = q := by
  have h0 := h 0
  have h1 := h 1
  constructor
  · nlinarith
  · linarith

/-- Predpostavka `vieta_obrat` se da izpolniti (x² + 7x + 12 = (x + 3)(x + 4)). -/
example : (3 : ℝ) + 4 = 7 ∧ (3 : ℝ) * 4 = 12 :=
  vieta_obrat 7 12 3 4 (fun x => by ring)

/-- Razlaga 4, Ustno vprašanje 2: predznaki pri a + b = p, ab = q: pri q > 0 imata a in b isti predznak, in
sicer predznak p; pri q < 0 imata različna predznaka; pri q < 0 in p ≠ 0 nista enako velika po absolutni
vrednosti in tisto, ki je po absolutni vrednosti večje, ima predznak p. -/
theorem vieta_predznaki (a b p q : ℝ) (hp : a + b = p) (hq : a * b = q) :
    (0 < q → 0 < p → 0 < a ∧ 0 < b) ∧ (0 < q → p < 0 → a < 0 ∧ b < 0) ∧
    (0 < q → (0 < a ∧ 0 < b ∧ 0 < p) ∨ (a < 0 ∧ b < 0 ∧ p < 0)) ∧
    (q < 0 → (0 < a ∧ b < 0) ∨ (a < 0 ∧ 0 < b)) ∧ (q < 0 → p ≠ 0 → |a| ≠ |b|) ∧
    (q < 0 → |b| < |a| → (0 < a ↔ 0 < p)) ∧ (q < 0 → |a| < |b| → (0 < b ↔ 0 < p)) := by
  subst hp hq
  refine ⟨fun h h' => ?_, fun h h' => ?_, fun h => ?_, fun h => mul_neg_iff.mp h, fun h h' => ?_,
    fun h h' => ?_, fun h h' => ?_⟩
  · rcases pos_and_pos_or_neg_and_neg_of_mul_pos h with h2 | h2
    · exact h2
    · exact absurd h' (by linarith)
  · rcases pos_and_pos_or_neg_and_neg_of_mul_pos h with h2 | h2
    · exact absurd h' (by linarith)
    · exact h2
  · rcases pos_and_pos_or_neg_and_neg_of_mul_pos h with h2 | h2
    · exact Or.inl ⟨h2.1, h2.2, by linarith⟩
    · exact Or.inr ⟨h2.1, h2.2, by linarith⟩
  · rcases mul_neg_iff.mp h with ⟨ha, hb⟩ | ⟨ha, hb⟩
    · rw [abs_of_pos ha, abs_of_neg hb]; intro e; exact h' (by linarith)
    · rw [abs_of_neg ha, abs_of_pos hb]; intro e; exact h' (by linarith)
  · rcases mul_neg_iff.mp h with ⟨ha, hb⟩ | ⟨ha, hb⟩
    · rw [abs_of_pos ha, abs_of_neg hb] at h'; constructor <;> intro <;> linarith
    · rw [abs_of_neg ha, abs_of_pos hb] at h'; constructor <;> intro <;> linarith
  · rcases mul_neg_iff.mp h with ⟨ha, hb⟩ | ⟨ha, hb⟩
    · rw [abs_of_pos ha, abs_of_neg hb] at h'; constructor <;> intro <;> linarith
    · rw [abs_of_neg ha, abs_of_pos hb] at h'; constructor <;> intro <;> linarith

/-- Predpostavki `vieta_predznaki` se dajo izpolniti (a = 2, b = −7, p = −5, q = −14 iz Primera 2). -/
example : (-14 : ℝ) < 0 → (0 < (2 : ℝ) ∧ (-7 : ℝ) < 0) ∨ ((2 : ℝ) < 0 ∧ 0 < (-7 : ℝ)) :=
  (vieta_predznaki 2 (-7) (-5) (-14) (by norm_num) (by norm_num)).2.2.2.1

/-- Razlaga 4: x² + 7x + 12: pari 1·12, 2·6, 3·4 z vsotami 13, 8, 7; edini števili z vsoto 7 in produktom 12
sta 3 in 4; x² + 7x + 12 = (x + 3)(x + 4). -/
theorem razlaga4_primer (x a b : ℝ) : (1 + 12 : ℝ) = 13 ∧ (2 + 6 : ℝ) = 8 ∧ (3 + 4 : ℝ) = 7 ∧
    (a + b = 7 ∧ a * b = 12 ↔ (a = 3 ∧ b = 4) ∨ (a = 4 ∧ b = 3)) ∧
    x ^ 2 + 7 * x + 12 = (x + 3) * (x + 4) := by
  exact ⟨by norm_num, by norm_num, by norm_num, par 7 12 a b 3 4 (by norm_num) (by norm_num),
    by ring⟩

/-- Razlaga 4, simulacija: pri drsnikih 3 in 3 pravokotnik postane kvadrat (x + 3)(x + 3) = (x + 3)². -/
theorem simulacija (x : ℝ) : (x + 3) * (x + 3) = (x + 3) ^ 2 := (sq (x + 3)).symm

/-- Razlaga 4, Premisli: za x² − 7x + 12 sta števili negativni, −3 in −4 (vsota −7, produkt 12);
x² − 7x + 12 = (x − 3)(x − 4). -/
theorem premisli_vieta (x : ℝ) : (-3 : ℝ) + -4 = -7 ∧ (-3 : ℝ) * -4 = 12 ∧
    x ^ 2 - 7 * x + 12 = (x - 3) * (x - 4) := by
  refine ⟨by norm_num, by norm_num, by ring⟩

/-- Razlaga 4: 2x² − 10x + 12 = 2(x² − 5x + 6) = 2(x − 2)(x − 3). -/
theorem razlaga4_koeficient (x : ℝ) : 2 * x ^ 2 - 10 * x + 12 = 2 * (x - 2) * (x - 3) := by
  calc 2 * x ^ 2 - 10 * x + 12 = 2 * (x ^ 2 - 5 * x + 6) := by ring
    _ = 2 * (x - 2) * (x - 3) := by ring

/-! ## Razlaga 6: razcepna enačba -/

/-- Razlaga 6: x³ = x² + 6x ⇔ x³ − x² − 6x = 0 ⇔ x(x² − x − 6) = 0 ⇔ x(x + 2)(x − 3) = 0 ⇔
x = 0 ali x = −2 ali x = 3 (2 + (−3) = −1, 2·(−3) = −6). -/
theorem razlaga6 (x : ℝ) : x ^ 3 = x ^ 2 + 6 * x ↔ x = 0 ∨ x = -2 ∨ x = 3 := by
  calc x ^ 3 = x ^ 2 + 6 * x ↔ x ^ 3 - x ^ 2 - 6 * x = 0 := iff_of_sub (by ring)
    _ ↔ x * (x ^ 2 - x - 6) = 0 := iff_of_sub (by ring)
    _ ↔ x * (x + 2) * (x - 3) = 0 := iff_of_sub (by ring)
    _ ↔ x = 0 ∨ x = -2 ∨ x = 3 := by
      rw [mul_eq_zero, mul_eq_zero, add_eq_zero_iff_eq_neg, sub_eq_zero, or_assoc]

/-- Razlaga 6: števili z vsoto −1 in produktom −6 sta 2 in −3; preizkus pri x = 3: 27 = 9 + 18. -/
theorem razlaga6_preizkus : (2 : ℝ) + -3 = -1 ∧ (2 : ℝ) * -3 = -6 ∧ (3 : ℝ) ^ 3 = 27 ∧
    (3 : ℝ) ^ 2 + 6 * 3 = 9 + 18 ∧ (9 + 18 : ℝ) = 27 := by
  norm_num

/-- Razlaga 6: z deljenjem z x bi izgubili rešitev x = 0 (je rešitev x³ = x² + 6x, ni pa rešitev x² = x + 6). -/
theorem deljenje_z_x : (0 : ℝ) ^ 3 = 0 ^ 2 + 6 * 0 ∧ (0 : ℝ) ^ 2 ≠ 0 + 6 := by norm_num

/-- Razlaga 6: x(x + 2) = 15 ⇔ x² + 2x − 15 = 0 ⇔ (x + 5)(x − 3) = 0 ⇔ x = −5 ali x = 3; x = 15 ni rešitev. -/
theorem razlaga6_past (x : ℝ) : (x * (x + 2) = 15 ↔ x = -5 ∨ x = 3) ∧ (15 : ℝ) * (15 + 2) ≠ 15 := by
  refine ⟨?_, by norm_num⟩
  calc x * (x + 2) = 15 ↔ x ^ 2 + 2 * x - 15 = 0 := iff_of_sub (by ring)
    _ ↔ (x + 5) * (x - 3) = 0 := iff_of_sub (by ring)
    _ ↔ x = -5 ∨ x = 3 := by rw [mul_eq_zero, add_eq_zero_iff_eq_neg, sub_eq_zero]

/-! ## Rešeni primeri -/

/-- Primer 1: D(12, 18, 6) = 6; preizkus 6ab·2a = 12a²b, 6ab·3b = 18ab², 6ab·1 = 6ab;
12a²b − 18ab² + 6ab = 6ab(2a − 3b + 1). -/
theorem primer1 (a b : ℝ) : Nat.gcd (Nat.gcd 12 18) 6 = 6 ∧ 6 * a * b * (2 * a) = 12 * a ^ 2 * b ∧
    6 * a * b * (3 * b) = 18 * a * b ^ 2 ∧ 6 * a * b * 1 = 6 * a * b ∧
    12 * a ^ 2 * b - 18 * a * b ^ 2 + 6 * a * b = 6 * a * b * (2 * a - 3 * b + 1) := by
  refine ⟨by norm_num, by ring, by ring, by ring, by ring⟩

/-- Primer 2: edini števili z vsoto −5 in produktom −14 sta 2 in −7 (par 1, −14 ima vsoto −13);
x² − 5x − 14 = (x + 2)(x − 7) = x² − 7x + 2x − 14. -/
theorem primer2 (x a b : ℝ) : (1 : ℝ) + -14 = -13 ∧ (2 : ℝ) + -7 = -5 ∧
    (a + b = -5 ∧ a * b = -14 ↔ (a = 2 ∧ b = -7) ∨ (a = -7 ∧ b = 2)) ∧
    (x + 2) * (x - 7) = x ^ 2 - 7 * x + 2 * x - 14 ∧ x ^ 2 - 7 * x + 2 * x - 14 = x ^ 2 - 5 * x - 14 := by
  exact ⟨by norm_num, by norm_num, par (-5) (-14) a b 2 (-7) (by norm_num) (by norm_num), by ring, by ring⟩

/-- Primer 2: pri x > 7 sta obe stranici x + 2 in x − 7 pozitivni. -/
theorem primer2_pogoj (x : ℝ) (hx : 7 < x) : 0 < x + 2 ∧ 0 < x - 7 := by
  constructor <;> linarith

/-- Predpostavka `primer2_pogoj` se da izpolniti (x = 17). -/
example : 0 < (17 : ℝ) + 2 ∧ 0 < (17 : ℝ) - 7 := primer2_pogoj 17 (by norm_num)

/-- Primer 2: pri x = 17 je x + 2 = 19, x − 7 = 10, 19·10 = 190 = 17² − 5·17 − 14. -/
theorem primer2_vrednost : (17 + 2 : ℝ) = 19 ∧ (17 - 7 : ℝ) = 10 ∧ (19 * 10 : ℝ) = 190 ∧
    (17 : ℝ) ^ 2 - 5 * 17 - 14 = 190 := by
  norm_num

/-- Primer 3: 2x³ + 4x² − 18x − 36 = 2(x³ + 2x² − 9x − 18) = 2(x²(x + 2) − 9(x + 2)) = 2(x + 2)(x² − 9)
= 2(x + 2)(x − 3)(x + 3). -/
theorem primer3 (x : ℝ) : 2 * x ^ 3 + 4 * x ^ 2 - 18 * x - 36 = 2 * (x + 2) * (x - 3) * (x + 3) := by
  calc 2 * x ^ 3 + 4 * x ^ 2 - 18 * x - 36 = 2 * (x ^ 3 + 2 * x ^ 2 - 9 * x - 18) := by ring
    _ = 2 * (x ^ 2 * (x + 2) - 9 * (x + 2)) := by ring
    _ = 2 * ((x + 2) * (x ^ 2 - 9)) := by ring
    _ = 2 * (x + 2) * (x - 3) * (x + 3) := by ring

/-- Primer 3, preizkus: (x − 3)(x + 3) = x² − 9, (x + 2)(x² − 9) = x³ + 2x² − 9x − 18; pri x = 1:
2 + 4 − 18 − 36 = −48 in 2·3·(−2)·4 = −48. -/
theorem primer3_preizkus (x : ℝ) : (x - 3) * (x + 3) = x ^ 2 - 9 ∧
    (x + 2) * (x ^ 2 - 9) = x ^ 3 + 2 * x ^ 2 - 9 * x - 18 ∧
    (2 + 4 - 18 - 36 : ℝ) = -48 ∧ (2 * 3 * (-2) * 4 : ℝ) = -48 := by
  refine ⟨by ring, by ring, by norm_num, by norm_num⟩

/-- Primer 4: (x + 3)² − (x − 3)² = [(x + 3) − (x − 3)][(x + 3) + (x − 3)] = 6·2x = 12x; pri x = 10:
13² − 7² = 169 − 49 = 120 = 12·10. -/
theorem primer4 (x : ℝ) : (x + 3) ^ 2 - (x - 3) ^ 2 = 12 * x ∧ (13 : ℝ) ^ 2 - 7 ^ 2 = 169 - 49 ∧
    (169 - 49 : ℝ) = 120 ∧ (12 * 10 : ℝ) = 120 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  calc (x + 3) ^ 2 - (x - 3) ^ 2 = ((x + 3) - (x - 3)) * ((x + 3) + (x - 3)) := by ring
    _ = 6 * (2 * x) := by ring
    _ = 12 * x := by ring

/-! ## Pogoste napake -/

/-- Pogoste napake 1: 4x² + 4x = 4x(x + 1), ne 4x·x. -/
theorem napaka_enica : (∀ x : ℝ, 4 * x ^ 2 + 4 * x = 4 * x * (x + 1)) ∧
    (¬ ∀ x : ℝ, 4 * x ^ 2 + 4 * x = 4 * x * x) := by
  refine ⟨fun x => by ring, fun h => ?_⟩
  have := h 1; norm_num at this

/-- Pogoste napake 2: 6x² − 9x = 3x(2x − 3) (tudi = 3(2x² − 3x)); x⁴ − 16 = (x² − 4)(x² + 4)
= (x − 2)(x + 2)(x² + 4), kjer x² + 4 nima realnega razcepa. -/
theorem napaka_popoln (x : ℝ) : 6 * x ^ 2 - 9 * x = 3 * x * (2 * x - 3) ∧
    6 * x ^ 2 - 9 * x = 3 * (2 * x ^ 2 - 3 * x) ∧ x ^ 4 - 16 = (x ^ 2 - 4) * (x ^ 2 + 4) ∧
    x ^ 4 - 16 = (x - 2) * (x + 2) * (x ^ 2 + 4) ∧
    ¬ ∃ m n : ℝ, ∀ x : ℝ, x ^ 2 + 2 ^ 2 = (x + m) * (x + n) := by
  exact ⟨by ring, by ring, by ring, by ring, vsota_kvadratov 2 (by norm_num)⟩

/-- Pogoste napake 3 in Ponovitev: −x² + 4x = −x(x − 4), ne −x(x + 4). -/
theorem napaka_minus : (∀ x : ℝ, -x ^ 2 + 4 * x = -x * (x - 4)) ∧
    (¬ ∀ x : ℝ, -x ^ 2 + 4 * x = -x * (x + 4)) := by
  refine ⟨fun x => by ring, fun h => ?_⟩
  have := h 1; norm_num at this

/-- Pogoste napake 4: x² + 9 ≠ (x + 3)², x² − 9 ≠ (x − 3)², (x + 3)² = x² + 6x + 9, x² − 9 = (x − 3)(x + 3),
x² + 9 ni razstavljiv (z realnimi m, n). -/
theorem napaka_obrazci : (¬ ∀ x : ℝ, x ^ 2 + 9 = (x + 3) ^ 2) ∧ (¬ ∀ x : ℝ, x ^ 2 - 9 = (x - 3) ^ 2) ∧
    (∀ x : ℝ, (x + 3) ^ 2 = x ^ 2 + 6 * x + 9) ∧ (∀ x : ℝ, x ^ 2 - 9 = (x - 3) * (x + 3)) ∧
    ¬ ∃ m n : ℝ, ∀ x : ℝ, x ^ 2 + 9 = (x + m) * (x + n) := by
  refine ⟨fun h => ?_, fun h => ?_, fun x => by ring, fun x => by ring, ?_⟩
  · have := h 1; norm_num at this
  · have := h 0; norm_num at this
  · exact x2_plus_c 9 (by norm_num)

/-- Pogoste napake 5 in Ponovitev: x² − 5x + 6 ≠ (x + 2)(x + 3) (2 + 3 = 5 ≠ −5); edini števili z vsoto −5 in
produktom 6 sta −2 in −3; x² − 5x + 6 = (x − 2)(x − 3). -/
theorem napaka_vieta (a b : ℝ) : (¬ ∀ x : ℝ, x ^ 2 - 5 * x + 6 = (x + 2) * (x + 3)) ∧ (2 + 3 : ℝ) ≠ -5 ∧
    (a + b = -5 ∧ a * b = 6 ↔ (a = -2 ∧ b = -3) ∨ (a = -3 ∧ b = -2)) ∧
    (∀ x : ℝ, x ^ 2 - 5 * x + 6 = (x - 2) * (x - 3)) := by
  refine ⟨fun h => ?_, by norm_num, par (-5) 6 a b (-2) (-3) (by norm_num) (by norm_num),
    fun x => by ring⟩
  have := h 1; norm_num at this

/-! ## Za maturo -/

/-- Naloga 1: −4 + (−9) = −13, (−4)(−9) = 36; x⁴ − 13x² + 36 = (x² − 4)(x² − 9) = (x − 2)(x + 2)(x − 3)(x + 3). -/
theorem naloga1 (x : ℝ) : (-4 : ℝ) + -9 = -13 ∧ (-4 : ℝ) * -9 = 36 ∧
    x ^ 4 - 13 * x ^ 2 + 36 = (x ^ 2 - 4) * (x ^ 2 - 9) ∧
    (x ^ 2 - 4) * (x ^ 2 - 9) = (x - 2) * (x + 2) * (x - 3) * (x + 3) := by
  refine ⟨by norm_num, by norm_num, by ring, by ring⟩

/-- Naloga 1, preizkus pri x = 1: 1 − 13 + 36 = 24 in (−1)·3·(−2)·4 = 24. -/
theorem naloga1_preizkus : (1 - 13 + 36 : ℝ) = 24 ∧ ((-1) * 3 * (-2) * 4 : ℝ) = 24 ∧
    (1 : ℝ) ^ 4 - 13 * 1 ^ 2 + 36 = 1 - 13 + 36 := by
  norm_num

/-- Naloga 2 a): x³ − 2x² − 4x + 8 = x²(x − 2) − 4(x − 2) = (x − 2)(x² − 4) = (x − 2)(x − 2)(x + 2)
= (x − 2)²(x + 2). -/
theorem naloga2a (x : ℝ) : x ^ 3 - 2 * x ^ 2 - 4 * x + 8 = (x - 2) ^ 2 * (x + 2) := by
  calc x ^ 3 - 2 * x ^ 2 - 4 * x + 8 = x ^ 2 * (x - 2) - 4 * (x - 2) := by ring
    _ = (x - 2) * (x ^ 2 - 4) := by ring
    _ = (x - 2) * (x - 2) * (x + 2) := by ring
    _ = (x - 2) ^ 2 * (x + 2) := by ring

/-- Naloga 2 a), preizkus pri x = 1: 1 − 2 − 4 + 8 = 3 in (−1)²·3 = 3. -/
theorem naloga2a_preizkus : (1 - 2 - 4 + 8 : ℝ) = 3 ∧ (-1 : ℝ) ^ 2 * 3 = 3 := by norm_num

/-- Naloga 2 b): x³ − 2x² − 4x + 8 = 0 ⇔ (x − 2)²(x + 2) = 0 ⇔ x = 2 ali x = −2. -/
theorem naloga2b (x : ℝ) : x ^ 3 - 2 * x ^ 2 - 4 * x + 8 = 0 ↔ x = 2 ∨ x = -2 := by
  rw [naloga2a, mul_eq_zero, pow_eq_zero_iff two_ne_zero, sub_eq_zero, add_eq_zero_iff_eq_neg]

/-- Naloga 2 c): pri x = 52 je x − 2 = 50, x + 2 = 54, vrednost 50²·54 = 2500·54 = 2500·50 + 2500·4
= 125000 + 10000 = 135000. -/
theorem naloga2c : (52 - 2 : ℝ) = 50 ∧ (52 + 2 : ℝ) = 54 ∧
    (52 : ℝ) ^ 3 - 2 * 52 ^ 2 - 4 * 52 + 8 = 135000 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  calc (52 : ℝ) ^ 3 - 2 * 52 ^ 2 - 4 * 52 + 8 = (52 - 2) ^ 2 * (52 + 2) := naloga2a 52
    _ = 50 ^ 2 * 54 := by norm_num
    _ = 2500 * 54 := by norm_num
    _ = 2500 * 50 + 2500 * 4 := by norm_num
    _ = 125000 + 10000 := by norm_num
    _ = 135000 := by norm_num

/-! ## Drugače -/

/-- Na sliki: a(b + c) = ab + ac; razlika kvadratov kot lik L: a² − b² = a(a − b) + b(a − b) = (a − b)(a + b);
Vieta: (x + 3)(x + 4) = x² + 4x + 3x + 12 = x² + 7x + 12. -/
theorem na_sliki (a b c x : ℝ) : a * (b + c) = a * b + a * c ∧
    a ^ 2 - b ^ 2 = a * (a - b) + b * (a - b) ∧ a * (a - b) + b * (a - b) = (a - b) * (a + b) ∧
    (x + 3) * (x + 4) = x ^ 2 + 4 * x + 3 * x + 12 ∧ x ^ 2 + 4 * x + 3 * x + 12 = x ^ 2 + 7 * x + 12 := by
  refine ⟨by ring, by ring, by ring, by ring, by ring⟩

/-- Iz vsakdanjega življenja: 12z + 12s = 12(z + s); 37·8 + 37·2 = 37·10 = 370;
98·102 = (100 − 2)(100 + 2) = 100² − 2² = 10000 − 4 = 9996; 47·53 = (50 − 3)(50 + 3) = 50² − 3² = 2491;
terasa pri x = 2: (2 + 3)(2 + 4) = 5·6 = 30 = 4 + 14 + 12. -/
theorem vsakdan (z s : ℝ) : 12 * z + 12 * s = 12 * (z + s) ∧ (37 * 8 + 37 * 2 : ℝ) = 37 * 10 ∧
    (37 * 10 : ℝ) = 370 ∧ (98 * 102 : ℝ) = (100 - 2) * (100 + 2) ∧
    ((100 - 2) * (100 + 2) : ℝ) = 100 ^ 2 - 2 ^ 2 ∧ (100 ^ 2 - 2 ^ 2 : ℝ) = 10000 - 4 ∧ (10000 - 4 : ℝ) = 9996 ∧
    (47 * 53 : ℝ) = (50 - 3) * (50 + 3) ∧ ((50 - 3) * (50 + 3) : ℝ) = 50 ^ 2 - 3 ^ 2 ∧
    (50 ^ 2 - 3 ^ 2 : ℝ) = 2491 ∧ ((2 + 3) * (2 + 4) : ℝ) = 5 * 6 ∧ (5 * 6 : ℝ) = 30 ∧
    (2 : ℝ) ^ 2 + 7 * 2 + 12 = 4 + 14 + 12 ∧ (4 + 14 + 12 : ℝ) = 30 := by
  refine ⟨by ring, ?_⟩
  norm_num

/-- Korak za korakom, naloga A: D(4, 36) = 4; 4x³ − 36x = 4x(x² − 9) = 4x(x − 3)(x + 3); preizkus pri x = 2:
4·8 − 72 = −40 = 4·2·(−1)·5; pri x = 3: 4·27 − 108 = 0 in faktor x − 3 = 0. -/
theorem naloga_A (x : ℝ) : Nat.gcd 4 36 = 4 ∧ 4 * x ^ 3 - 36 * x = 4 * x * (x ^ 2 - 9) ∧
    4 * x * (x ^ 2 - 9) = 4 * x * (x - 3) * (x + 3) ∧ (4 * 8 - 72 : ℝ) = -40 ∧
    (4 * 2 * (-1) * 5 : ℝ) = -40 ∧ (4 * 27 - 108 : ℝ) = 0 ∧ (3 - 3 : ℝ) = 0 := by
  refine ⟨by norm_num, by ring, by ring, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Korak za korakom, naloga B: pari s produktom −24: vsote 23, 10, 5, 2; edini števili z vsoto 2 in produktom
−24 sta −4 in 6; x² + 2x − 24 = (x − 4)(x + 6); preizkus pri x = 1: 1 + 2 − 24 = −21 = (−3)·7. -/
theorem naloga_B (x a b : ℝ) : (-1 : ℝ) + 24 = 23 ∧ (-2 : ℝ) + 12 = 10 ∧ (-3 : ℝ) + 8 = 5 ∧
    (-4 : ℝ) + 6 = 2 ∧ (a + b = 2 ∧ a * b = -24 ↔ (a = -4 ∧ b = 6) ∨ (a = 6 ∧ b = -4)) ∧
    x ^ 2 + 2 * x - 24 = (x - 4) * (x + 6) ∧ (1 + 2 - 24 : ℝ) = -21 ∧ ((-3) * 7 : ℝ) = -21 := by
  exact ⟨by norm_num, by norm_num, by norm_num, by norm_num,
    par 2 (-24) a b (-4) 6 (by norm_num) (by norm_num), by ring, by norm_num, by norm_num⟩

/-- Bolj natančno: x² − 2 nima razcepa (x + a)(x + b) s celima a, b, z realnimi pa je x² − 2 = (x − √2)(x + √2). -/
theorem x2_minus_2 : (¬ ∃ a b : ℤ, ∀ x : ℝ, x ^ 2 - 2 = (x + a) * (x + b)) ∧
    ∀ x : ℝ, x ^ 2 - 2 = (x - Real.sqrt 2) * (x + Real.sqrt 2) := by
  constructor
  · rintro ⟨a, b, h⟩
    obtain ⟨hs, hp⟩ := vieta_obrat 0 (-2) a b (fun x => by rw [← h x]; ring)
    have hs' : a + b = 0 := by exact_mod_cast hs
    have hp' : a * b = -2 := by exact_mod_cast hp
    have hb : b = -a := by linarith
    subst hb
    have h1 : a ≤ 1 := by nlinarith
    have h2 : -1 ≤ a := by nlinarith
    interval_cases a <;> norm_num at hp'
  · intro x
    have := Real.sq_sqrt (show (0 : ℝ) ≤ 2 by norm_num)
    linear_combination this

/-- Bolj natančno: 2x² + 7x + 3: 1 + 6 = 7, 1·6 = 2·3; 2x² + 7x + 3 = 2x² + x + 6x + 3 = x(2x + 1) + 3(2x + 1)
= (2x + 1)(x + 3); preizkus (2x + 1)(x + 3) = 2x² + 6x + x + 3. -/
theorem koeficient_2 (x : ℝ) : (1 + 6 : ℝ) = 7 ∧ (1 * 6 : ℝ) = 2 * 3 ∧
    2 * x ^ 2 + 7 * x + 3 = (2 * x + 1) * (x + 3) ∧
    (2 * x + 1) * (x + 3) = 2 * x ^ 2 + 6 * x + x + 3 := by
  refine ⟨by norm_num, by norm_num, ?_, by ring⟩
  calc 2 * x ^ 2 + 7 * x + 3 = 2 * x ^ 2 + x + 6 * x + 3 := by ring
    _ = x * (2 * x + 1) + 3 * (2 * x + 1) := by ring
    _ = (2 * x + 1) * (x + 3) := by ring

/-! ## Preveri se -/

/-- Preveri se 1: x² + 7x + 10 = (x + 2)(x + 5) = x² + 2x + 5x + 10; edini števili z vsoto 7 in produktom 10
sta 2 in 5; (x + 3)(x + 4) in (x + 1)(x + 10) nista enaka x² + 7x + 10. -/
theorem preveri1 (a b : ℝ) : (∀ x : ℝ, x ^ 2 + 7 * x + 10 = x ^ 2 + 2 * x + 5 * x + 10) ∧
    (∀ x : ℝ, x ^ 2 + 2 * x + 5 * x + 10 = (x + 2) * (x + 5)) ∧
    (a + b = 7 ∧ a * b = 10 ↔ (a = 2 ∧ b = 5) ∨ (a = 5 ∧ b = 2)) ∧
    (¬ ∀ x : ℝ, x ^ 2 + 7 * x + 10 = (x + 3) * (x + 4)) ∧
    (¬ ∀ x : ℝ, x ^ 2 + 7 * x + 10 = (x + 1) * (x + 10)) := by
  refine ⟨fun x => by ring, fun x => by ring, par 7 10 a b 2 5 (by norm_num) (by norm_num),
    fun h => ?_, fun h => ?_⟩
  · have := h 0; norm_num at this
  · have := h 1; norm_num at this

/-- Preveri se 2: x² + 4x + 4 = (x + 2)², pri x = 98 je to 100² = 10000 (ne 9608, 9600, 9604). -/
theorem preveri2 : (98 : ℝ) ^ 2 + 4 * 98 + 4 = (98 + 2) ^ 2 ∧ ((98 + 2) ^ 2 : ℝ) = 100 ^ 2 ∧
    (100 : ℝ) ^ 2 = 10000 ∧ (10000 : ℝ) ≠ 9608 ∧ (10000 : ℝ) ≠ 9600 ∧ (10000 : ℝ) ≠ 9604 := by
  norm_num

/-- Preveri se 3: ni realnih a, b z a + b = 0 in ab = 9, ker iz a + b = 0 sledi ab = −a² ≤ 0. -/
theorem preveri3 : (∀ a b : ℝ, a + b = 0 → a * b = -a ^ 2 ∧ a * b ≤ 0) ∧
    ¬ ∃ a b : ℝ, a + b = 0 ∧ a * b = 9 := by
  have key : ∀ a b : ℝ, a + b = 0 → a * b = -a ^ 2 ∧ a * b ≤ 0 := by
    intro a b h
    have hb : b = -a := by linarith
    subst hb
    exact ⟨by ring, by nlinarith [sq_nonneg a]⟩
  refine ⟨key, ?_⟩
  rintro ⟨a, b, h1, h2⟩
  have := (key a b h1).2
  linarith

/-- Preveri se 4: (x − 3)(x + 5) = x² + 5x − 3x − 15 = x² + 2x − 15; ni x² − 2x − 15, x² + 2x + 15, x² + 8x − 15. -/
theorem preveri4 : (∀ x : ℝ, (x - 3) * (x + 5) = x ^ 2 + 5 * x - 3 * x - 15) ∧
    (∀ x : ℝ, x ^ 2 + 5 * x - 3 * x - 15 = x ^ 2 + 2 * x - 15) ∧
    (¬ ∀ x : ℝ, (x - 3) * (x + 5) = x ^ 2 - 2 * x - 15) ∧
    (¬ ∀ x : ℝ, (x - 3) * (x + 5) = x ^ 2 + 2 * x + 15) ∧
    (¬ ∀ x : ℝ, (x - 3) * (x + 5) = x ^ 2 + 8 * x - 15) := by
  refine ⟨fun x => by ring, fun x => by ring, fun h => ?_, fun h => ?_, fun h => ?_⟩
  · have := h 1; norm_num at this
  · have := h 0; norm_num at this
  · have := h 1; norm_num at this

/-- Preveri se 5: 3 + b = −1 in 3b = −12 ⇔ b = −4; za x > 4 je druga stranica y z (x + 3)y = x² − x − 12
natanko y = x − 4; (x + 3)(x + 4) = x² + 7x + 12 in (x + 3)(x − 2) = x² + x − 6. -/
theorem preveri5 (b : ℝ) : (3 + b = -1 ∧ 3 * b = -12 ↔ b = -4) ∧
    (∀ x y : ℝ, 4 < x → ((x + 3) * y = x ^ 2 - x - 12 ↔ y = x - 4)) ∧
    (∀ x : ℝ, (x + 3) * (x + 4) = x ^ 2 + 7 * x + 12) ∧ (∀ x : ℝ, (x + 3) * (x - 2) = x ^ 2 + x - 6) := by
  refine ⟨⟨fun h => by linarith [h.1], fun h => by subst h; norm_num⟩, fun x y hx => ?_,
    fun x => by ring, fun x => by ring⟩
  have h3 : x + 3 ≠ 0 := by linarith
  rw [show x ^ 2 - x - 12 = (x + 3) * (x - 4) by ring]
  exact ⟨fun h => mul_left_cancel₀ h3 h, fun h => by rw [h]⟩

/-- Predpostavka x > 4 v `preveri5` se da izpolniti (x = 5, y = 1). -/
example : ((5 : ℝ) + 3) * 1 = 5 ^ 2 - 5 - 12 ↔ (1 : ℝ) = 5 - 4 := (preveri5 0).2.1 5 1 (by norm_num)

/-- Preveri se 6: x² − 3x = 28 ⇔ x² − 3x − 28 = 0 ⇔ (x + 4)(x − 7) = 0 ⇔ x = −4 ali x = 7; največja rešitev
je 7; 31 in 4 nista rešitvi. -/
theorem preveri6 : (∀ x : ℝ, x ^ 2 - 3 * x = 28 ↔ x = -4 ∨ x = 7) ∧
    IsGreatest {x : ℝ | x ^ 2 - 3 * x = 28} 7 ∧ (31 : ℝ) ^ 2 - 3 * 31 ≠ 28 ∧ (4 : ℝ) ^ 2 - 3 * 4 ≠ 28 := by
  have h : ∀ x : ℝ, x ^ 2 - 3 * x = 28 ↔ x = -4 ∨ x = 7 := by
    intro x
    calc x ^ 2 - 3 * x = 28 ↔ x ^ 2 - 3 * x - 28 = 0 := iff_of_sub (by ring)
      _ ↔ (x + 4) * (x - 7) = 0 := iff_of_sub (by ring)
      _ ↔ x = -4 ∨ x = 7 := by rw [mul_eq_zero, add_eq_zero_iff_eq_neg, sub_eq_zero]
  refine ⟨h, ⟨by norm_num, fun x hx => ?_⟩, by norm_num, by norm_num⟩
  rcases (h x).mp hx with rfl | rfl <;> norm_num

/-! ## RACUN -/

/-- Blok RACUN: vrstice enako in vrednost (vrstice resi so `naloga2b`, `razlaga6`, `razlaga6_past`,
`preveri6`). -/
theorem racun :
    (∀ x : ℝ, x^4-13*x^2+36 = (x^2-4)*(x^2-9)) ∧
    (∀ x : ℝ, x^4-13*x^2+36 = (x-2)*(x+2)*(x-3)*(x+3)) ∧ ((1:ℝ)-13+36 = 24) ∧
    (∀ x : ℝ, x^3-2*x^2-4*x+8 = (x-2)*(x^2-4)) ∧ (∀ x : ℝ, x^3-2*x^2-4*x+8 = (x-2)^2*(x+2)) ∧
    ((1:ℝ)-2-4+8 = 3) ∧ ((2500:ℝ)*54 = 135000) ∧ ((52:ℝ)^3-2*52^2-4*52+8 = 135000) ∧
    ((50:ℝ)^2*54 = 135000) ∧ (∀ x : ℝ, x^3-x^2-6*x = x*(x+2)*(x-3)) ∧ ((3:ℝ)^2+6*3 = 27) ∧
    (∀ x : ℝ, x^2+2*x-15 = (x+5)*(x-3)) ∧ (∀ x : ℝ, x^2-3*x-28 = (x+4)*(x-7)) ∧
    ((7:ℝ)*(7-3) = 28) ∧ ((28:ℝ)+3 = 31) ∧ ((-4:ℝ)+7 = 3) := by
  refine ⟨fun x => by ring, fun x => by ring, by norm_num, fun x => by ring, fun x => by ring,
    by norm_num, by norm_num, by norm_num, by norm_num, fun x => by ring, by norm_num,
    fun x => by ring, fun x => by ring, by norm_num, by norm_num, by norm_num⟩

end Evklid.Lekcije.MAT_SS_1.RazstavljanjeIzrazov
