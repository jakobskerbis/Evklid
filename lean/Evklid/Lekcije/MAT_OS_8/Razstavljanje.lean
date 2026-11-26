/-
vir: content/lessons/MAT-OS-8/razstavljanje.md
sha256: 8254f5a299491f99b81aceba7818c73cbb9aaa94ddb8f7a5659984939db58c62
Model: izrazi so realni (x, y, a, b, c, d ∈ ℝ); NSD koeficientov je `Nat.gcd` v ℕ. Razstavitev je dokazana kot
enakost izrazov za vse x (in y); »druga stranica« (primer 3, Preveri se 5) je dokazana tudi kot edina rešitev
(pri x ≠ 0, ker stranica 4x oz. 3x ni 0).
Ni v Leanu: karo papir, škarje, risba in simulacija z algebrskimi ploščicami (dokazane so ustrezne enakosti, npr.
x² + 3x = x(x + 3), 4x(2x + 3) = 8x² + 12x); pojma »vsota / produkt« in »izraz je razstavljen« (oblika zapisa,
hitra preizkušnja 1); postopek v štirih korakih in nasvet »vedno preveri z množenjem« (navodila); »običajno
izpostavimo negativen faktor« (dogovor); trditev, da se 3x² + 5y z izpostavljanjem ne da razstaviti (»razstaviti«
ni formaliziran pojem; dokazano je le, da je NSD koeficientov 3 in 5 enak 1); »ne smemo izpustiti enice«, »skupna višina je skupni faktor« (razlaga);
»višje potence ne moremo izpostaviti, ker je ni v vsakem členu« (»izpostaviti« ni formaliziran pojem; dokazano je le,
da izpostavitev x^m deluje).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_8.Razstavljanje

/-! ## Zakaj se tega učimo -/

/-- Zakaj se tega učimo: 3 · 5 = 15, 3 · 7 = 21, skupaj 36; 5 + 7 = 12 in 3 · 12 = 36; torej
3 · 5 + 3 · 7 = 3 · (5 + 7). -/
theorem karo_papir :
    3 * 5 = 15 ∧ 3 * 7 = 21 ∧ 15 + 21 = 36 ∧ 5 + 7 = 12 ∧ 3 * 12 = 36 ∧ 3 * 5 + 3 * 7 = 3 * (5 + 7) := by
  norm_num

/-- Zakaj se tega učimo: 3(2x + 5) = 6x + 15 (in obratno). -/
theorem uvod (x : ℝ) : 3 * (2 * x + 5) = 6 * x + 15 := by ring

/-- Zakaj se tega učimo (na pamet): 37 · 15 + 37 · 85 = 37 · 100 = 3700. -/
theorem na_pamet : 37 * 15 + 37 * 85 = 37 * 100 ∧ 37 * 100 = 3700 := by norm_num

/-! ## Razlaga -/

/-- Razlaga 2, Povzetek in Bolj natančno (izpostavljanje skupnega faktorja): ab + ac = a(b + c) za vse a, b, c. -/
theorem izpostavljanje (a b c : ℝ) : a * b + a * c = a * (b + c) := by ring

/-- Primer 2 (formula): ab + ac + ad = a(b + c + d). -/
theorem izpostavljanje3 (a b c d : ℝ) : a * b + a * c + a * d = a * (b + c + d) := by ring

/-- Primer 4 (formula) in Povzetek: −ab − ac = −a(b + c); pri negativnem faktorju se predznaki v oklepaju obrnejo. -/
theorem negativni_faktor (a b c : ℝ) : -(a * b) - a * c = -a * (b + c) := by ring

/-- Razlaga 2, hitra preizkušnja: 5 · 4 + 5 · 6 = 5 · (4 + 6) in 4 + 6 = 10. -/
theorem preizkusnja2 : 5 * 4 + 5 * 6 = 5 * (4 + 6) ∧ 4 + 6 = 10 := by norm_num

/-- Razlaga 3: D(12, 18) = 6; 6 deli 12 in 18, vsak skupni delitelj pa je ≤ 6. Hitra preizkušnja: D(8, 12) = 4. -/
theorem nsd :
    Nat.gcd 12 18 = 6 ∧ 6 ∣ 12 ∧ 6 ∣ 18 ∧ (∀ d : ℕ, d ∣ 12 → d ∣ 18 → d ≤ 6) ∧ Nat.gcd 8 12 = 4 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, by norm_num⟩
  intro d h1 h2
  exact Nat.le_of_dvd (by norm_num) (Nat.dvd_gcd h1 h2)

/-- Razlaga 4 in Bolj natančno (najmanjši eksponent): x³ = x² · x in x², zato 12x³ + 18x² = 6x²(2x + 3). -/
theorem tabela_x (x : ℝ) : x ^ 3 = x ^ 2 * x ∧ 12 * x ^ 3 + 18 * x ^ 2 = 6 * x ^ 2 * (2 * x + 3) :=
  ⟨by ring, by ring⟩

/-- Razlaga 4 in Povzetek (splošno): pri m ≤ n se iz xᵐa + xⁿb izpostavi xᵐ (najmanjši eksponent):
xᵐa + xⁿb = xᵐ(a + xⁿ⁻ᵐb). -/
theorem najmanjsi_eksponent (x a b : ℝ) (m n : ℕ) (h : m ≤ n) :
    x ^ m * a + x ^ n * b = x ^ m * (a + x ^ (n - m) * b) := by
  obtain ⟨k, rfl⟩ := Nat.exists_eq_add_of_le h
  rw [Nat.add_sub_cancel_left, pow_add]; ring

/-- Predpostavka `najmanjsi_eksponent` se da izpolniti (m = 2, n = 3). -/
example : 2 ≤ 3 := by norm_num

/-- Razlaga 4, hitra preizkušnja: skupni faktor x² in 5x je x: x² + 5x = x(x + 5). -/
theorem preizkusnja4 (x : ℝ) : x ^ 2 + 5 * x = x * (x + 5) := by ring

/-- Razlaga 5, Premisli: 4x + 4 = 4(x + 1); 4(x + 0) = 4x pa ni 4x + 4 (drugi člen bi izginil). -/
theorem premisli_enica (x : ℝ) : 4 * x + 4 = 4 * (x + 1) ∧ 4 * (x + 0) ≠ 4 * x + 4 := by
  refine ⟨by ring, ?_⟩
  intro h; linarith

/-- Razlaga 5 (simulacija, p = 3): x² + 3x = x(x + 3). -/
theorem ploscice (x : ℝ) : x ^ 2 + 3 * x = x * (x + 3) := by ring

/-- Razlaga 6: −4x² − 10x = −2x(2x + 5); preverimo −2x · 2x = −4x² in −2x · 5 = −10x. -/
theorem razlaga6 (x : ℝ) :
    -4 * x ^ 2 - 10 * x = -2 * x * (2 * x + 5) ∧ -2 * x * (2 * x) = -4 * x ^ 2 ∧ -2 * x * 5 = -10 * x :=
  ⟨by ring, by ring, by ring⟩

/-- Razlaga 6, Premisli: −6x + 9 = −3(2x − 3), ker je −3 · (−3) = 9. -/
theorem razlaga6_premisli (x : ℝ) : -6 * x + 9 = -3 * (2 * x - 3) ∧ (-3 : ℝ) * (-3) = 9 :=
  ⟨by ring, by norm_num⟩

/-! ## Rešeni primeri -/

/-- Primer 1: D(6, 9) = 3; 3 · 2x = 6x, 3 · 3 = 9; 6x + 9 = 3 · 2x + 3 · 3 = 3(2x + 3). -/
theorem primer1 (x : ℝ) :
    Nat.gcd 6 9 = 3 ∧ 3 * (2 * x) = 6 * x ∧ 6 * x + 9 = 3 * (2 * x + 3) := by
  refine ⟨by norm_num, by ring, ?_⟩
  calc 6 * x + 9 = 3 * (2 * x) + 3 * 3 := by ring
    _ = 3 * (2 * x + 3) := by ring

/-- Primer 2: D(12, 18, 6) = 6; 6xy · 2x = 12x²y, 6xy · 3y = 18xy², 6xy · 1 = 6xy;
12x²y − 18xy² + 6xy = 6xy(2x − 3y + 1). V oklepaju imajo koeficienti 2, 3, 1 NSD 1. -/
theorem primer2 (x y : ℝ) :
    Nat.gcd (Nat.gcd 12 18) 6 = 6 ∧ 6 * x * y * (2 * x) = 12 * x ^ 2 * y ∧ 6 * x * y * (3 * y) = 18 * x * y ^ 2 ∧
      6 * x * y * 1 = 6 * x * y ∧
      12 * x ^ 2 * y - 18 * x * y ^ 2 + 6 * x * y = 6 * x * y * (2 * x - 3 * y + 1) ∧
      Nat.gcd (Nat.gcd 2 3) 1 = 1 :=
  ⟨by norm_num, by ring, by ring, by ring, by ring, by norm_num⟩

/-- Primer 3 (terasa): D(8, 12) = 4; 4x · 2x = 8x², 4x · 3 = 12x, zato 8x² + 12x = 4x(2x + 3). -/
theorem primer3 (x : ℝ) :
    Nat.gcd 8 12 = 4 ∧ 4 * x * (2 * x) = 8 * x ^ 2 ∧ 4 * x * 3 = 12 * x ∧ 8 * x ^ 2 + 12 * x = 4 * x * (2 * x + 3) :=
  ⟨by norm_num, by ring, by ring, by ring⟩

/-- Primer 3: druga stranica je natanko 2x + 3: če je 4x · s = 8x² + 12x in x ≠ 0, je s = 2x + 3. -/
theorem primer3_stranica (x s : ℝ) (hx : x ≠ 0) : 4 * x * s = 8 * x ^ 2 + 12 * x ↔ s = 2 * x + 3 := by
  constructor
  · intro h
    have h4 : 4 * x ≠ 0 := mul_ne_zero (by norm_num) hx
    apply mul_left_cancel₀ h4
    linarith
  · rintro rfl; ring

/-- Predpostavka `primer3_stranica` se da izpolniti (x = 5). -/
example : (5 : ℝ) ≠ 0 := by norm_num

/-- Primer 3, preverjanje pri x = 5: 8 · 25 + 12 · 5 = 200 + 60 = 260, 4 · 5 · 13 = 260; terasa 20 m × 13 m. -/
theorem primer3_x5 :
    (8 : ℝ) * 25 + 12 * 5 = 200 + 60 ∧ (200 : ℝ) + 60 = 260 ∧ (4 : ℝ) * 5 * 13 = 260 ∧
      (5 : ℝ) ^ 2 = 25 ∧ (4 : ℝ) * 5 = 20 ∧ (2 : ℝ) * 5 + 3 = 13 := by norm_num

/-- Primer 4, Premisli: D(6, 15) = 3; −6x² − 15x = −3x(2x + 5); −3x · 2x = −6x², −3x · 5 = −15x. -/
theorem primer4 (x : ℝ) :
    Nat.gcd 6 15 = 3 ∧ -6 * x ^ 2 - 15 * x = -3 * x * (2 * x + 5) ∧ -3 * x * (2 * x) = -6 * x ^ 2 ∧
      -3 * x * 5 = -15 * x :=
  ⟨by norm_num, by ring, by ring, by ring⟩

/-! ## Pogoste napake -/

/-- Pogoste napake (pozabljena enica): 3x + 3 = 3(x + 1), napačni 3x pa ni nikoli enak 3x + 3. -/
theorem pozabljena_enica (x : ℝ) : 3 * x + 3 = 3 * (x + 1) ∧ 3 * x + 3 ≠ 3 * x := by
  refine ⟨by ring, ?_⟩
  intro h; linarith

/-- Pogoste napake (faktor le pri enem členu) in Preveri se 1: 5x + 20 = 5(x + 4); 5x + 4 in 5 · x · 4 nista
5(x + 4) (npr. pri x = 1: 9 in 20 proti 25). -/
theorem le_en_clen (x : ℝ) :
    5 * x + 20 = 5 * (x + 4) ∧ 5 * x + 4 ≠ 5 * (x + 4) ∧ (5 : ℝ) * 1 * 4 ≠ 5 * (1 + 4) := by
  refine ⟨by ring, ?_, by norm_num⟩
  intro h; linarith

/-- Pogoste napake in Preveri se 3 (nepopolno izpostavljanje): 12x + 18 = 2(6x + 9) je pravilno, a
6x + 9 = 3(2x + 3) (D(6, 9) = 3), zato 12x + 18 = 2 · 3 · (2x + 3) = 6(2x + 3); D(12, 18) = 6 in D(2, 3) = 1. -/
theorem nepopolno (x : ℝ) :
    12 * x + 18 = 2 * (6 * x + 9) ∧ 6 * x + 9 = 3 * (2 * x + 3) ∧ Nat.gcd 6 9 = 3 ∧
      Nat.gcd 12 18 = 6 ∧ Nat.gcd 2 3 = 1 ∧ 12 * x + 18 = 6 * (2 * x + 3) := by
  refine ⟨by ring, by ring, by norm_num, by norm_num, by norm_num, ?_⟩
  calc 12 * x + 18 = 2 * (6 * x + 9) := by ring
    _ = 2 * 3 * (2 * x + 3) := by ring
    _ = 6 * (2 * x + 3) := by ring

/-- Pogoste napake (napačni predznaki): −2(x − 3) = −2x + 6, kar ni −2x − 6; pravilno −2x − 6 = −2(x + 3). -/
theorem napacni_predznaki (x : ℝ) :
    -2 * (x - 3) = -2 * x + 6 ∧ -2 * x - 6 ≠ -2 * (x - 3) ∧ -2 * x - 6 = -2 * (x + 3) := by
  refine ⟨by ring, ?_, by ring⟩
  intro h; linarith

/-- Pogoste napake (3x² + 5y): NSD koeficientov 3 in 5 je 1. -/
theorem brez_skupnega : Nat.gcd 3 5 = 1 := by norm_num

/-! ## Drugače -/

/-- Na sliki: levi del 4x · 2x = 8x², desni 4x · 3 = 12x, skupaj 8x² + 12x = 4x(2x + 3). -/
theorem na_sliki (x : ℝ) :
    4 * x * (2 * x) = 8 * x ^ 2 ∧ 4 * x * 3 = 12 * x ∧ 4 * x * (2 * x) + 4 * x * 3 = 4 * x * (2 * x + 3) :=
  ⟨by ring, by ring, by ring⟩

/-- Bolj natančno: zakon o razčlenjevanju a(b + c) = ab + ac (od leve proti desni odpravljamo oklepaj). -/
theorem razclenjevanje (a b c : ℝ) : a * (b + c) = a * b + a * c := by ring

/-! ## Preveri se -/

/-- Preveri se 1: pravokotnik iz delov 5 × x in 5 × 4 ima ploščino 5(x + 4) = 5x + 20 (5 · 4 = 20). -/
theorem kviz1 (x : ℝ) : 5 * x + 5 * 4 = 5 * (x + 4) ∧ 5 * (x + 4) = 5 * x + 20 := ⟨by ring, by ring⟩

/-- Preveri se 2: 49 · 13 + 49 · 7 = 49 · (13 + 7) = 49 · 20 = 980; napačna: 49 + 13 + 7 = 69,
49 · 13 · 7 = 4459. -/
theorem kviz2 :
    49 * 13 + 49 * 7 = 49 * (13 + 7) ∧ 49 * (13 + 7) = 49 * 20 ∧ 49 * 20 = 980 ∧ 49 + 13 + 7 = 69 ∧
      49 * 13 * 7 = 4459 := by norm_num

/-- Preveri se 3: 2 · 6x + 2 · 9 = 12x + 18 (enakost je pravilna); 18 nima x. -/
theorem kviz3 (x : ℝ) : 2 * (6 * x) + 2 * 9 = 12 * x + 18 := by ring

/-- Preveri se 4: −3x(2x − 5) = −6x² + 15x (−3x · 2x = −6x², −3x · (−5) = 15x); napačna −6x² − 15x (pri x = 1) in
−6x + 15 (pri x = 0) nista enaka. -/
theorem kviz4 (x : ℝ) :
    -3 * x * (2 * x - 5) = -6 * x ^ 2 + 15 * x ∧ -3 * x * (-5) = 15 * x ∧
      (-6 : ℝ) * 1 ^ 2 - 15 * 1 ≠ -6 * 1 ^ 2 + 15 * 1 ∧ (-6 : ℝ) * 0 + 15 ≠ -6 * 0 ^ 2 + 15 * 0 :=
  ⟨by ring, by ring, by norm_num, by norm_num⟩

/-- Preveri se 5: 6x² + 9x = 3x(2x + 3) (3x · 2x = 6x², 3x · 3 = 9x). -/
theorem kviz5 (x : ℝ) : 6 * x ^ 2 + 9 * x = 3 * x * (2 * x + 3) ∧ 3 * x * 3 = 9 * x := ⟨by ring, by ring⟩

/-- Preveri se 5: pri višini 3x (x ≠ 0) je dolžina natanko 2x + 3, torej ne 2x + 9 in ne 2x² + 3x. -/
theorem kviz5_dolzina (x s : ℝ) (hx : x ≠ 0) : 3 * x * s = 6 * x ^ 2 + 9 * x ↔ s = 2 * x + 3 := by
  constructor
  · intro h
    have h3 : 3 * x ≠ 0 := mul_ne_zero (by norm_num) hx
    apply mul_left_cancel₀ h3
    linarith
  · rintro rfl; ring

/-- Predpostavka `kviz5_dolzina` se da izpolniti (x = 1). -/
example : (1 : ℝ) ≠ 0 := by norm_num

/-- Preveri se 5, napačna odgovora: 2x + 9 in 2x² + 3x nista izraz 2x + 3; pri x = 2 sta 13 in 14, 2x + 3 pa 7. -/
theorem kviz5_napacna : (2 : ℝ) * 2 + 9 ≠ 2 * 2 + 3 ∧ (2 : ℝ) * 2 ^ 2 + 3 * 2 ≠ 2 * 2 + 3 := by norm_num

end Evklid.Lekcije.MAT_OS_8.Razstavljanje
