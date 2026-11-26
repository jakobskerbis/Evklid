/-
vir: content/lessons/MAT-SS-1/algebrski-izrazi.md
sha256: d84443ecc2d6c5d2b467989cdfb78da055cad1a9a1d2c75a603a051ae2460ed1
Ni v Leanu: definicije in poimenovanja (algebrski izraz, spremenljivka, neznanka, enočlenik, koeficient,
spremenljivi del, podobni enočleniki, dvočlenik, tričlenik, mnogočlenik) ter razlika med izrazom in enačbo
(Razlaga 1, Ustno vprašanje 3) kot opis pojmov; stopnja enočlenika −4a²b³ kot vsota eksponentov (definicija;
dokazano je le, da ima mnogočlenik 2x³ − 5x + 7 stopnjo 3); »5ab in 5a²b nista podobna« in »nepodobnih
enočlenikov ne moremo združiti« kot dogovor o zapisu (dokazano je, da 3x + 2x² ni 5x³ in 3x·2x ni 6x);
štetje členov pred združevanjem (m·n členov, »pri dveh dvočlenikih štirje«) kot trditev o zapisu, ne o
vrednosti; risbe (razrez kvadrata, kocke iz sladkorja, pekač, torta) in simulacija (dokazane so ustrezne
ploščine in prostornine kot številske ali algebrske enakosti); »skoraj polovico kocke« (Primer 3) je dokazano kot
488 < 1000/2 in 488 > 1000·2/5; nasveti in postopki (negativno število vstavi v oklepaju, člene uredi po
padajočih potencah, ne izberi ničle pri preizkusu) kot navodila (dokazano je, da napačni x² + 6 namesto
(x + 2)(x + 3) pri x = 0 da isto vrednost, pri x = 1 pa ne); točkovanje maturitetnih nalog; besedila
napačnih odgovorov v Preveri se (dokazano je, da so napačne vrednosti oz. izrazi res različni od pravilnih).
Pogoj x > 2 v Nalogi 2 je potreben le za geometrijo; algebrske enakosti veljajo za vsak realni x.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.AlgebrskiIzrazi

open Polynomial

/-! ## Zakaj se tega učimo -/

/-- Zakaj se tega učimo: pekač 20 cm ima dno 20·20 = 400 cm², večji (25 cm) 25·25 = 625 cm²,
napačna ocena 400 + 5² = 425 cm² zgreši za 200 cm², kar sta trakova 20 cm × 5 cm. -/
theorem pekac : (20 : ℝ) * 20 = 400 ∧ (400 : ℝ) + 5 ^ 2 = 425 ∧ (25 : ℝ) * 25 = 625 ∧
    (625 : ℝ) - 425 = 200 ∧ (2 * (20 * 5) : ℝ) = 200 ∧ (25 : ℝ) ^ 2 = 20 ^ 2 + 2 * (20 * 5) + 5 ^ 2 := by
  norm_num

/-! ## Razlaga 1: vrednost izraza -/

/-- Razlaga 1: vrednost 3x² − 5x + 2 pri x = 2 je 3·4 − 10 + 2 = 4. -/
theorem vrednost_x2 : (3 : ℝ) * 2 ^ 2 - 5 * 2 + 2 = 4 := by
  calc (3 : ℝ) * 2 ^ 2 - 5 * 2 + 2 = 3 * 4 - 10 + 2 := by norm_num
    _ = 4 := by norm_num

/-- Razlaga 1: vrednost 3x² − 5x + 2 pri x = −1 je 3·(−1)² − 5·(−1) + 2 = 3 + 5 + 2 = 10. -/
theorem vrednost_xm1 : (3 : ℝ) * (-1) ^ 2 - 5 * (-1) + 2 = 10 := by
  calc (3 : ℝ) * (-1) ^ 2 - 5 * (-1) + 2 = 3 + 5 + 2 := by norm_num
    _ = 10 := by norm_num

/-! ## Razlaga 2: enočleniki -/

/-- Razlaga 2: podobne enočlenike seštejemo s seštevanjem koeficientov: 5ab − 2ab = 3ab. -/
theorem podobna (a b : ℝ) : 5 * a * b - 2 * a * b = 3 * a * b := by ring

/-- Razlaga 2 in Povzetek: aᵐ · aⁿ = aᵐ⁺ⁿ (m, n naravna). -/
theorem potenci (a : ℝ) (m n : ℕ) : a ^ m * a ^ n = a ^ (m + n) := (pow_add a m n).symm

/-- Razlaga 2: (−3a²b)(4ab³) = −12a³b⁴. -/
theorem enoclenika (a b : ℝ) : (-3 * a ^ 2 * b) * (4 * a * b ^ 3) = -12 * a ^ 3 * b ^ 4 := by ring

/-! ## Razlaga 3: mnogočleniki -/

/-- Razlaga 3: mnogočlenik 2x³ − 5x + 7 ima stopnjo 3. -/
theorem stopnja : (2 * X ^ 3 - 5 * X + 7 : ℝ[X]).natDegree = 3 := by
  compute_degree!

/-- Razlaga 3: (3x² − 2x + 1) − (x² + 4x − 5) = 3x² − 2x + 1 − x² − 4x + 5 = 2x² − 6x + 6. -/
theorem razlika_mnogoclenikov (x : ℝ) :
    (3 * x ^ 2 - 2 * x + 1) - (x ^ 2 + 4 * x - 5) = 2 * x ^ 2 - 6 * x + 6 := by
  calc (3 * x ^ 2 - 2 * x + 1) - (x ^ 2 + 4 * x - 5) = 3 * x ^ 2 - 2 * x + 1 - x ^ 2 - 4 * x + 5 := by ring
    _ = 2 * x ^ 2 - 6 * x + 6 := by ring

/-- Razlaga 3, Primer 1 (formula) in Povzetek: minus pred oklepajem spremeni predznak vsakemu členu:
−(p + q − r) = −p − q + r. -/
theorem minus_oklepaj (p q r : ℝ) : -(p + q - r) = -p - q + r := by ring

/-- Primer 1 (formula): podobne člene združimo, mxᵏ + nxᵏ = (m + n)xᵏ. -/
theorem zdruzi (m n x : ℝ) (k : ℕ) : m * x ^ k + n * x ^ k = (m + n) * x ^ k := by ring

/-! ## Razlaga 4 in 5: množenje -/

/-- Razlaga 4: razčlenjevalni zakon a(b + c) = ab + ac. -/
theorem distributivnost (a b c : ℝ) : a * (b + c) = a * b + a * c := mul_add a b c

/-- Razlaga 4: −2x(3x² − x + 4) = −6x³ + 2x² − 8x. -/
theorem enoclenik_krat (x : ℝ) : -2 * x * (3 * x ^ 2 - x + 4) = -6 * x ^ 3 + 2 * x ^ 2 - 8 * x := by ring

/-- Razlaga 5 in Povzetek: (a + b)(c + d) = ac + ad + bc + bd. -/
theorem vsak_z_vsakim (a b c d : ℝ) : (a + b) * (c + d) = a * c + a * d + b * c + b * d := by ring

/-- Razlaga 5: (2x + 3)(x − 5) = 2x² − 10x + 3x − 15 = 2x² − 7x − 15. -/
theorem razlaga5_primer (x : ℝ) : (2 * x + 3) * (x - 5) = 2 * x ^ 2 - 7 * x - 15 := by
  calc (2 * x + 3) * (x - 5) = 2 * x ^ 2 - 10 * x + 3 * x - 15 := by ring
    _ = 2 * x ^ 2 - 7 * x - 15 := by ring

/-! ## Razlaga 6: kvadrat dvočlenika -/

/-- Razlaga 6, tabela: (a + b)² in a² + b² za 3 + 2, 5 + 1, 4 + 3, 20 + 5 ter razlike 12, 10, 24, 200,
ki so po vrsti 2·a·b. -/
theorem tabela :
    ((3 + 2 : ℝ) ^ 2 = 25 ∧ (3 : ℝ) ^ 2 + 2 ^ 2 = 13 ∧ (25 : ℝ) - 13 = 12 ∧ (12 : ℝ) = 2 * 3 * 2) ∧
    ((5 + 1 : ℝ) ^ 2 = 36 ∧ (5 : ℝ) ^ 2 + 1 ^ 2 = 26 ∧ (36 : ℝ) - 26 = 10 ∧ (10 : ℝ) = 2 * 5 * 1) ∧
    ((4 + 3 : ℝ) ^ 2 = 49 ∧ (4 : ℝ) ^ 2 + 3 ^ 2 = 25 ∧ (49 : ℝ) - 25 = 24 ∧ (24 : ℝ) = 2 * 4 * 3) ∧
    ((20 + 5 : ℝ) ^ 2 = 625 ∧ (20 : ℝ) ^ 2 + 5 ^ 2 = 425 ∧ (625 : ℝ) - 425 = 200 ∧
      (200 : ℝ) = 2 * 20 * 5) := by
  norm_num

/-- Razlaga 6, Premisli: po vzorcu (10 + 3)² − (10² + 3²) = 2·10·3 = 60; preverba 169 − 109 = 60. -/
theorem premisli_10_3 : (10 + 3 : ℝ) ^ 2 - (10 ^ 2 + 3 ^ 2) = 2 * 10 * 3 ∧ (2 * 10 * 3 : ℝ) = 60 ∧
    (10 + 3 : ℝ) ^ 2 = 169 ∧ (10 ^ 2 + 3 ^ 2 : ℝ) = 109 ∧ (169 : ℝ) - 109 = 60 := by
  norm_num

/-- Razlaga 6: razlika med kvadratom vsote in vsoto kvadratov je vedno 2ab. -/
theorem razlika_vedno (a b : ℝ) : (a + b) ^ 2 - (a ^ 2 + b ^ 2) = 2 * a * b := by ring

/-- Razlaga 6 (razrez kvadrata): (a + b)² = (a + b)(a + b) = a² + ab + ba + b² = a² + 2ab + b². -/
theorem kvadrat_vsote (a b : ℝ) : (a + b) ^ 2 = a ^ 2 + 2 * a * b + b ^ 2 := by
  calc (a + b) ^ 2 = (a + b) * (a + b) := sq (a + b)
    _ = a ^ 2 + a * b + b * a + b ^ 2 := by ring
    _ = a ^ 2 + 2 * a * b + b ^ 2 := by ring

/-- Razlaga 6, Pregled, Povzetek: (a − b)² = a² − 2ab + b². -/
theorem kvadrat_razlike (a b : ℝ) : (a - b) ^ 2 = a ^ 2 - 2 * a * b + b ^ 2 := by ring

/-- Razlaga 6: pri razliki je minus le pri srednjem členu, ker je (−b)² = b². -/
theorem minus_b_kvadrat (b : ℝ) : (-b) ^ 2 = b ^ 2 := neg_sq b

/-- Razlaga 6: (x + 4)² = x² + 8x + 16. -/
theorem x_plus_4 (x : ℝ) : (x + 4) ^ 2 = x ^ 2 + 8 * x + 16 := by ring

/-- Razlaga 6: (3x − 2)² = (3x)² − 2·3x·2 + 2² = 9x² − 12x + 4. -/
theorem trix_minus_2 (x : ℝ) : (3 * x - 2) ^ 2 = 9 * x ^ 2 - 12 * x + 4 := by
  calc (3 * x - 2) ^ 2 = (3 * x) ^ 2 - 2 * (3 * x) * 2 + 2 ^ 2 := by ring
    _ = 9 * x ^ 2 - 12 * x + 4 := by ring

/-- Razlaga 6, simulacija: (x + 3)² razpade na x², dva pravokotnika 3x in 9: x² + 3x + 3x + 9 = x² + 6x + 9. -/
theorem simulacija_kvadrat (x : ℝ) : (x + 3) ^ 2 = x ^ 2 + 3 * x + 3 * x + 9 ∧
    x ^ 2 + 3 * x + 3 * x + 9 = x ^ 2 + 6 * x + 9 := by
  constructor <;> ring

/-! ## Razlaga 7: zmnožek vsote in razlike -/

/-- Razlaga 7: (a + b)(a − b) = a² − ab + ab − b² = a² − b². -/
theorem vsota_krat_razlika (a b : ℝ) : (a + b) * (a - b) = a ^ 2 - b ^ 2 := by
  calc (a + b) * (a - b) = a ^ 2 - a * b + a * b - b ^ 2 := by ring
    _ = a ^ 2 - b ^ 2 := by ring

/-- Razlaga 7: (2x + 5)(2x − 5) = 4x² − 25. -/
theorem razlaga7_primer (x : ℝ) : (2 * x + 5) * (2 * x - 5) = 4 * x ^ 2 - 25 := by ring

/-- Razlaga 7, simulacija: pravokotnika 3x in −3x se izničita: (x + 3)(x − 3) = x² + 3x − 3x − 9 = x² − 9. -/
theorem simulacija_razlika (x : ℝ) : (x + 3) * (x - 3) = x ^ 2 + 3 * x - 3 * x - 9 ∧
    x ^ 2 + 3 * x - 3 * x - 9 = x ^ 2 - 9 := by
  constructor <;> ring

/-! ## Razlaga 8: kub dvočlenika -/

/-- Razlaga 8: kocka z robom 3 ima 3³ = 27 kock, ne 2³ + 1³ = 9; razrez 2 + 1 da 2·2·2 = 8, tri plošče
2·2·1 (12), tri palčke 2·1·1 (6) in eno kocko: 8 + 12 + 6 + 1 = 27. -/
theorem kocka_sladkorja : (3 : ℝ) ^ 3 = 27 ∧ (2 : ℝ) ^ 3 + 1 ^ 3 = 9 ∧ (2 * 2 * 2 : ℝ) = 8 ∧
    3 * (2 * 2 * 1 : ℝ) = 12 ∧ 3 * (2 * 1 * 1 : ℝ) = 6 ∧ (8 + 12 + 6 + 1 : ℝ) = 27 := by
  norm_num

/-- Razlaga 8 in Ustno vprašanje 2: (a + b)³ = (a + b)²(a + b) = (a² + 2ab + b²)(a + b)
= a³ + a²b + 2a²b + 2ab² + ab² + b³ = a³ + 3a²b + 3ab² + b³. -/
theorem kub_vsote (a b : ℝ) : (a + b) ^ 3 = a ^ 3 + 3 * a ^ 2 * b + 3 * a * b ^ 2 + b ^ 3 := by
  calc (a + b) ^ 3 = (a + b) ^ 2 * (a + b) := pow_succ (a + b) 2
    _ = (a ^ 2 + 2 * a * b + b ^ 2) * (a + b) := by rw [kvadrat_vsote]
    _ = a ^ 3 + a ^ 2 * b + 2 * a ^ 2 * b + 2 * a * b ^ 2 + a * b ^ 2 + b ^ 3 := by ring
    _ = a ^ 3 + 3 * a ^ 2 * b + 3 * a * b ^ 2 + b ^ 3 := by ring

/-- Razlaga 8 in Ustno vprašanje 2: iz kuba vsote z −b namesto b: (a − b)³ = a³ − 3a²b + 3ab² − b³. -/
theorem kub_razlike (a b : ℝ) : (a - b) ^ 3 = a ^ 3 - 3 * a ^ 2 * b + 3 * a * b ^ 2 - b ^ 3 := by
  calc (a - b) ^ 3 = (a + -b) ^ 3 := by ring
    _ = a ^ 3 + 3 * a ^ 2 * (-b) + 3 * a * (-b) ^ 2 + (-b) ^ 3 := kub_vsote a (-b)
    _ = a ^ 3 - 3 * a ^ 2 * b + 3 * a * b ^ 2 - b ^ 3 := by ring

/-- Razlaga 8: (x + 2)³ = x³ + 6x² + 12x + 8 in (x − 2)³ = x³ − 6x² + 12x − 8. -/
theorem razlaga8_primera (x : ℝ) : (x + 2) ^ 3 = x ^ 3 + 6 * x ^ 2 + 12 * x + 8 ∧
    (x - 2) ^ 3 = x ^ 3 - 6 * x ^ 2 + 12 * x - 8 := by
  constructor <;> ring

/-- Razlaga 8, Premisli: kocka z robom 4 = 3 + 1: plošče 3·3·1 (3·9 = 27), palčke 3·1·1 (9),
27 + 27 + 9 + 1 = 64 = 4³. -/
theorem premisli_kocka4 : 3 * (3 * 3 * 1 : ℝ) = 3 * 9 ∧ (3 * 9 : ℝ) = 27 ∧ 3 * (3 * 1 * 1 : ℝ) = 9 ∧
    (27 + 27 + 9 + 1 : ℝ) = 64 ∧ (64 : ℝ) = 4 ^ 3 ∧ (4 : ℝ) ^ 3 = (3 + 1) ^ 3 := by
  norm_num

/-! ## Razlaga 10: preizkus -/

/-- Razlaga 10 in Pogoste napake: napačni razvoj x² + 6 namesto (x + 2)(x + 3) se pri x = 0 ujema, pri
x = 1 pa ne; zato ničla napako skrije. -/
theorem preizkus_nicla : (0 + 2 : ℝ) * (0 + 3) = 0 ^ 2 + 6 ∧ (1 + 2 : ℝ) * (1 + 3) ≠ 1 ^ 2 + 6 := by
  norm_num

/-! ## Rešeni primeri -/

/-- Primer 1, koraki 1–3: (2x² − 3x + 5) − (x² + 4x − 7) = 2x² − 3x + 5 − x² − 4x + 7 = x² − 7x + 12,
z združitvami 2x² − x² = x², −3x − 4x = −7x, 5 + 7 = 12. -/
theorem primer1 (x : ℝ) : (2 * x ^ 2 - 3 * x + 5) - (x ^ 2 + 4 * x - 7) = x ^ 2 - 7 * x + 12 ∧
    2 * x ^ 2 - x ^ 2 = x ^ 2 ∧ -3 * x - 4 * x = -7 * x ∧ (5 : ℝ) + 7 = 12 := by
  refine ⟨?_, by ring, by ring, by norm_num⟩
  calc (2 * x ^ 2 - 3 * x + 5) - (x ^ 2 + 4 * x - 7) = 2 * x ^ 2 - 3 * x + 5 - x ^ 2 - 4 * x + 7 := by ring
    _ = x ^ 2 - 7 * x + 12 := by ring

/-- Primer 1, korak 4: vrednost pri x = 2 je 2² − 7·2 + 12 = 4 − 14 + 12 = 2. -/
theorem primer1_vrednost : (2 : ℝ) ^ 2 - 7 * 2 + 12 = 2 := by
  calc (2 : ℝ) ^ 2 - 7 * 2 + 12 = 4 - 14 + 12 := by norm_num
    _ = 2 := by norm_num

/-- Primer 1, korak 5: izvirni izraz pri x = 2: (2·4 − 6 + 5) − (4 + 8 − 7) = 7 − 5 = 2. -/
theorem primer1_preizkus :
    (2 * (2 : ℝ) ^ 2 - 3 * 2 + 5) - ((2 : ℝ) ^ 2 + 4 * 2 - 7) = 2 := by
  calc (2 * (2 : ℝ) ^ 2 - 3 * 2 + 5) - ((2 : ℝ) ^ 2 + 4 * 2 - 7) = (2 * 4 - 6 + 5) - (4 + 8 - 7) := by
        norm_num
    _ = 7 - 5 := by norm_num
    _ = 2 := by norm_num

/-- Primer 2, korak 1: (3x − 2)(2x + 5) = 6x² + 15x − 4x − 10 = 6x² + 11x − 10. -/
theorem primer2_prvi (x : ℝ) : (3 * x - 2) * (2 * x + 5) = 6 * x ^ 2 + 11 * x - 10 := by
  calc (3 * x - 2) * (2 * x + 5) = 6 * x ^ 2 + 15 * x - 4 * x - 10 := by ring
    _ = 6 * x ^ 2 + 11 * x - 10 := by ring

/-- Primer 2, koraki 1–4: (3x − 2)(2x + 5) − (x − 4)(x + 4) = (6x² + 11x − 10) − (x² − 16)
= 6x² + 11x − 10 − x² + 16 = 5x² + 11x + 6. -/
theorem primer2 (x : ℝ) : (3 * x - 2) * (2 * x + 5) - (x - 4) * (x + 4) = 5 * x ^ 2 + 11 * x + 6 := by
  calc (3 * x - 2) * (2 * x + 5) - (x - 4) * (x + 4) = (6 * x ^ 2 + 11 * x - 10) - (x ^ 2 - 16) := by
        rw [primer2_prvi]; ring
    _ = 6 * x ^ 2 + 11 * x - 10 - x ^ 2 + 16 := by ring
    _ = 5 * x ^ 2 + 11 * x + 6 := by ring

/-- Primer 2, korak 5: preizkus pri x = 1: (1)·(7) − (−3)·(5) = 7 + 15 = 22 in 5 + 11 + 6 = 22. -/
theorem primer2_preizkus : (3 * 1 - 2 : ℝ) * (2 * 1 + 5) - (1 - 4) * (1 + 4) = 22 ∧
    (5 * 1 ^ 2 + 11 * 1 + 6 : ℝ) = 22 := by
  constructor
  · calc (3 * 1 - 2 : ℝ) * (2 * 1 + 5) - (1 - 4) * (1 + 4) = 1 * 7 - (-3) * 5 := by norm_num
      _ = 7 + 15 := by norm_num
      _ = 22 := by norm_num
  · norm_num

/-- Primer 3: sredica ima rob x − 1 − 1 = x − 2; skorja V = x³ − (x − 2)³ = x³ − x³ + 6x² − 12x + 8
= 6x² − 12x + 8, kjer je (x − 2)³ = x³ − 6x² + 12x − 8. -/
theorem primer3 (x : ℝ) : x - 1 - 1 = x - 2 ∧ (x - 2) ^ 3 = x ^ 3 - 6 * x ^ 2 + 12 * x - 8 ∧
    x ^ 3 - (x - 2) ^ 3 = 6 * x ^ 2 - 12 * x + 8 := by
  refine ⟨by ring, by ring, ?_⟩
  calc x ^ 3 - (x - 2) ^ 3 = x ^ 3 - (x ^ 3 - 6 * x ^ 2 + 12 * x - 8) := by ring
    _ = x ^ 3 - x ^ 3 + 6 * x ^ 2 - 12 * x + 8 := by ring
    _ = 6 * x ^ 2 - 12 * x + 8 := by ring

/-- Primer 3, Premisli: pri x = 10 je V = 6·100 − 12·10 + 8 = 600 − 120 + 8 = 488; preizkus
1000 − 512 = 488 = 10³ − 8³; to je manj kot polovica kocke (1000/2) in več kot 2/5 kocke. -/
theorem primer3_vrednost : (6 * 10 ^ 2 - 12 * 10 + 8 : ℝ) = 488 ∧ (10 : ℝ) ^ 3 - 8 ^ 3 = 488 ∧
    (488 : ℝ) < 1000 / 2 ∧ (1000 : ℝ) * 2 / 5 < 488 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  calc (6 * 10 ^ 2 - 12 * 10 + 8 : ℝ) = 6 * 100 - 12 * 10 + 8 := by norm_num
    _ = 600 - 120 + 8 := by norm_num
    _ = 488 := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1 in Ustno vprašanje 1: (2 + 3)² = 25, 2² + 3² = 13, zato (a + b)² ≠ a² + b² v
splošnem; prav tako (a + b)³ ≠ a³ + b³ v splošnem (2 + 1: 27 ≠ 9). -/
theorem napaka_kvadrat : (2 + 3 : ℝ) ^ 2 = 25 ∧ (2 : ℝ) ^ 2 + 3 ^ 2 = 13 ∧
    (¬ ∀ a b : ℝ, (a + b) ^ 2 = a ^ 2 + b ^ 2) ∧ (¬ ∀ a b : ℝ, (a + b) ^ 3 = a ^ 3 + b ^ 3) := by
  refine ⟨by norm_num, by norm_num, fun h => ?_, fun h => ?_⟩
  · have := h 2 3; norm_num at this
  · have := h 2 1; norm_num at this

/-- Pogoste napake 2: (x − 3)² = x² − 6x + 9; izraza x² − 9 in x² − 6x − 9 nista enaka (x − 3)²;
x² − 9 je (x − 3)(x + 3). -/
theorem napaka_x_minus_3 :
    (∀ x : ℝ, (x - 3) ^ 2 = x ^ 2 - 6 * x + 9) ∧ (¬ ∀ x : ℝ, (x - 3) ^ 2 = x ^ 2 - 9) ∧
    (¬ ∀ x : ℝ, (x - 3) ^ 2 = x ^ 2 - 6 * x - 9) ∧ (∀ x : ℝ, (x - 3) * (x + 3) = x ^ 2 - 9) := by
  refine ⟨fun x => by ring, fun h => ?_, fun h => ?_, fun x => by ring⟩
  · have := h 0; norm_num at this
  · have := h 0; norm_num at this

/-- Pogoste napake 3: 5x − (2x − 3) = 5x − 2x + 3 = 3x + 3, nikoli 3x − 3. -/
theorem napaka_minus (x : ℝ) : 5 * x - (2 * x - 3) = 3 * x + 3 ∧ 5 * x - (2 * x - 3) ≠ 3 * x - 3 := by
  have h : 5 * x - (2 * x - 3) = 3 * x + 3 := by
    calc 5 * x - (2 * x - 3) = 5 * x - 2 * x + 3 := by ring
      _ = 3 * x + 3 := by ring
  refine ⟨h, ?_⟩
  rw [h]; intro h'; linarith

/-- Pogoste napake 4: (x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6, ne x² + 6. -/
theorem napaka_vsak_z_vsakim : (∀ x : ℝ, (x + 2) * (x + 3) = x ^ 2 + 5 * x + 6) ∧
    (¬ ∀ x : ℝ, (x + 2) * (x + 3) = x ^ 2 + 6) := by
  refine ⟨fun x => ?_, fun h => ?_⟩
  · calc (x + 2) * (x + 3) = x ^ 2 + 3 * x + 2 * x + 6 := by ring
      _ = x ^ 2 + 5 * x + 6 := by ring
  · have := h 1; norm_num at this

/-- Pogoste napake 5 in Ponovitev: 3x + 2x² ni 5x³, 3x·2x ni 6x; pravilno 3x + 2x = 5x in 3x·2x = 6x². -/
theorem napaka_enoclenika : (¬ ∀ x : ℝ, 3 * x + 2 * x ^ 2 = 5 * x ^ 3) ∧
    (¬ ∀ x : ℝ, 3 * x * (2 * x) = 6 * x) ∧ (∀ x : ℝ, 3 * x + 2 * x = 5 * x) ∧
    (∀ x : ℝ, 3 * x * (2 * x) = 6 * x ^ 2) := by
  refine ⟨fun h => ?_, fun h => ?_, fun x => by ring, fun x => by ring⟩
  · have := h 2; norm_num at this
  · have := h 2; norm_num at this

/-! ## Za maturo -/

/-- Naloga 1: (x + 2)³ = x³ + 3·x²·2 + 3·x·2² + 2³ = x³ + 6x² + 12x + 8. -/
theorem naloga1_kub (x : ℝ) : (x + 2) ^ 3 = x ^ 3 + 6 * x ^ 2 + 12 * x + 8 := by
  calc (x + 2) ^ 3 = x ^ 3 + 3 * x ^ 2 * 2 + 3 * x * 2 ^ 2 + 2 ^ 3 := kub_vsote x 2
    _ = x ^ 3 + 6 * x ^ 2 + 12 * x + 8 := by ring

/-- Naloga 1: x(x + 3)² = x(x² + 6x + 9) = x³ + 6x² + 9x. -/
theorem naloga1_drugi (x : ℝ) : x * (x + 3) ^ 2 = x ^ 3 + 6 * x ^ 2 + 9 * x := by
  calc x * (x + 3) ^ 2 = x * (x ^ 2 + 6 * x + 9) := by ring
    _ = x ^ 3 + 6 * x ^ 2 + 9 * x := by ring

/-- Naloga 1: (x + 2)³ − x(x + 3)² = x³ + 6x² + 12x + 8 − x³ − 6x² − 9x = 3x + 8. -/
theorem naloga1 (x : ℝ) : (x + 2) ^ 3 - x * (x + 3) ^ 2 = 3 * x + 8 := by
  calc (x + 2) ^ 3 - x * (x + 3) ^ 2
      = (x ^ 3 + 6 * x ^ 2 + 12 * x + 8) - (x ^ 3 + 6 * x ^ 2 + 9 * x) := by
        rw [naloga1_kub, naloga1_drugi]
    _ = x ^ 3 + 6 * x ^ 2 + 12 * x + 8 - x ^ 3 - 6 * x ^ 2 - 9 * x := by ring
    _ = 3 * x + 8 := by ring

/-- Naloga 1, korak 4: preizkus pri x = 1: 3³ − 1·4² = 27 − 16 = 11 in 3 + 8 = 11. -/
theorem naloga1_preizkus : (1 + 2 : ℝ) ^ 3 - 1 * (1 + 3) ^ 2 = 11 ∧ (3 * 1 + 8 : ℝ) = 11 := by
  constructor
  · calc (1 + 2 : ℝ) ^ 3 - 1 * (1 + 3) ^ 2 = 3 ^ 3 - 1 * 4 ^ 2 := by norm_num
      _ = 27 - 16 := by norm_num
      _ = 11 := by norm_num
  · norm_num

/-- Naloga 2 a): (x + 2)(x − 2) = x² − 4 in prostornina x(x + 2)(x − 2) = x(x² − 4) = x³ − 4x. -/
theorem naloga2a (x : ℝ) : (x + 2) * (x - 2) = x ^ 2 - 4 ∧ x * (x + 2) * (x - 2) = x ^ 3 - 4 * x := by
  refine ⟨by ring, ?_⟩
  calc x * (x + 2) * (x - 2) = x * (x ^ 2 - 4) := by ring
    _ = x ^ 3 - 4 * x := by ring

/-- Naloga 2 b): ploskve x(x + 2) = x² + 2x, x(x − 2) = x² − 2x, (x + 2)(x − 2) = x² − 4; površina
2[(x² + 2x) + (x² − 2x) + (x² − 4)] = 2(3x² − 4) = 6x² − 8. -/
theorem naloga2b (x : ℝ) : x * (x + 2) = x ^ 2 + 2 * x ∧ x * (x - 2) = x ^ 2 - 2 * x ∧
    (x + 2) * (x - 2) = x ^ 2 - 4 ∧
    2 * (x * (x + 2) + x * (x - 2) + (x + 2) * (x - 2)) = 6 * x ^ 2 - 8 := by
  refine ⟨by ring, by ring, by ring, ?_⟩
  calc 2 * (x * (x + 2) + x * (x - 2) + (x + 2) * (x - 2))
      = 2 * ((x ^ 2 + 2 * x) + (x ^ 2 - 2 * x) + (x ^ 2 - 4)) := by ring
    _ = 2 * (3 * x ^ 2 - 4) := by ring
    _ = 6 * x ^ 2 - 8 := by ring

/-- Naloga 2 c): (x + 1)³ = x³ + 3x² + 3x + 1 in (x³ + 3x² + 3x + 1) − (x³ − 4x)
= x³ + 3x² + 3x + 1 − x³ + 4x = 3x² + 7x + 1. -/
theorem naloga2c (x : ℝ) : (x + 1) ^ 3 = x ^ 3 + 3 * x ^ 2 + 3 * x + 1 ∧
    (x + 1) ^ 3 - (x ^ 3 - 4 * x) = 3 * x ^ 2 + 7 * x + 1 := by
  refine ⟨by ring, ?_⟩
  calc (x + 1) ^ 3 - (x ^ 3 - 4 * x) = (x ^ 3 + 3 * x ^ 2 + 3 * x + 1) - (x ^ 3 - 4 * x) := by ring
    _ = x ^ 3 + 3 * x ^ 2 + 3 * x + 1 - x ^ 3 + 4 * x := by ring
    _ = 3 * x ^ 2 + 7 * x + 1 := by ring

/-- Naloga 2 c), preizkus pri x = 5: rob kocke 6, robovi kvadra 5, 7, 3; 216 − 105 = 111 in
3·25 + 7·5 + 1 = 111. -/
theorem naloga2c_preizkus : (5 + 1 : ℝ) = 6 ∧ (5 + 2 : ℝ) = 7 ∧ (5 - 2 : ℝ) = 3 ∧
    (6 : ℝ) ^ 3 - 5 * 7 * 3 = 216 - 105 ∧ (216 - 105 : ℝ) = 111 ∧ (3 * 5 ^ 2 + 7 * 5 + 1 : ℝ) = 3 * 25 + 7 * 5 + 1 ∧
    (3 * 25 + 7 * 5 + 1 : ℝ) = 111 := by
  norm_num

/-! ## Drugače -/

/-- Drugače (korak za korakom): (2x)² = 4x², −2·2x·5 = −20x, 5² = 25, (2x − 5)² = 4x² − 20x + 25. -/
theorem drugace_2x_5 (x : ℝ) : (2 * x) ^ 2 = 4 * x ^ 2 ∧ -2 * (2 * x) * 5 = -20 * x ∧ (5 : ℝ) ^ 2 = 25 ∧
    (2 * x - 5) ^ 2 = 4 * x ^ 2 - 20 * x + 25 := by
  refine ⟨by ring, by ring, by norm_num, ?_⟩
  calc (2 * x - 5) ^ 2 = (2 * x) ^ 2 - 2 * (2 * x) * 5 + 5 ^ 2 := kvadrat_razlike (2 * x) 5
    _ = 4 * x ^ 2 - 20 * x + 25 := by ring

/-- Drugače, korak 6: preizkus pri x = 3: (6 − 5)² = 1 in 36 − 60 + 25 = 1. -/
theorem drugace_preizkus : (2 * 3 - 5 : ℝ) ^ 2 = 1 ∧ (4 * 3 ^ 2 - 20 * 3 + 25 : ℝ) = 36 - 60 + 25 ∧
    (36 - 60 + 25 : ℝ) = 1 := by
  norm_num

/-- Drugače: (x − 1)³ = x³ − 3x² + 3x − 1 (1ᵏ = 1); preizkus pri x = 2: (2 − 1)³ = 1 in 8 − 12 + 6 − 1 = 1. -/
theorem drugace_kub : (∀ x : ℝ, (x - 1) ^ 3 = x ^ 3 - 3 * x ^ 2 + 3 * x - 1) ∧ (∀ k : ℕ, (1 : ℝ) ^ k = 1) ∧
    (2 - 1 : ℝ) ^ 3 = 1 ∧ (8 - 12 + 6 - 1 : ℝ) = 1 ∧ (2 : ℝ) ^ 3 - 3 * 2 ^ 2 + 3 * 2 - 1 = 8 - 12 + 6 - 1 := by
  exact ⟨fun x => by ring, fun k => one_pow k, by norm_num, by norm_num, by norm_num⟩

/-- Drugače (zgodba): pekač 30 → 40 cm: 900 + 300 + 300 + 100 = 1600 = 40², povečanje 700 cm², ne 100;
splošno novo dno a² + 2ab + b². -/
theorem zgodba : (30 : ℝ) ^ 2 = 900 ∧ (30 * 10 : ℝ) = 300 ∧ (10 * 10 : ℝ) = 100 ∧
    (900 + 300 + 300 + 100 : ℝ) = 1600 ∧ (40 : ℝ) ^ 2 = 1600 ∧ (1600 : ℝ) - 900 = 700 ∧ (700 : ℝ) ≠ 100 := by
  norm_num

/-! ## Preveri se -/

/-- Preveri se 1: kos torte s stranico x + 3: deli x·x, x·3, 3·x, 3·3, skupaj x² + 6x + 9; napačni razrezi
x² + 9, x² + 3x + 9 in x² + 6 + 6 + 9 niso (x + 3)² (protiprimer x = 1). -/
theorem preveri1 (x : ℝ) : (x + 3) ^ 2 = x * x + x * 3 + 3 * x + 3 * 3 ∧ (x + 3) ^ 2 = x ^ 2 + 6 * x + 9 := by
  constructor <;> ring

/-- Preveri se 1, napačni odgovori: (x + 3)² ni x² + 9, ni x² + 3x + 9 in ni x² + 6 + 6 + 9 (pri x = 1). -/
theorem preveri1_napacni : (¬ ∀ x : ℝ, (x + 3) ^ 2 = x ^ 2 + 9) ∧ (¬ ∀ x : ℝ, (x + 3) ^ 2 = x ^ 2 + 3 * x + 9) ∧
    (¬ ∀ x : ℝ, (x + 3) ^ 2 = x ^ 2 + 6 + 6 + 9) :=
  ⟨fun h => by have := h 1; norm_num at this, fun h => by have := h 1; norm_num at this,
    fun h => by have := h 1; norm_num at this⟩

/-- Preveri se 2: 98² = (100 − 2)² = 10000 − 400 + 4 = 9604; napačne 9996, 10004, 9600 niso 98²;
98² < 10000. -/
theorem preveri2 : (98 : ℝ) ^ 2 = 9604 ∧ (98 : ℝ) ^ 2 ≠ 9996 ∧ (98 : ℝ) ^ 2 ≠ 10004 ∧
    (98 : ℝ) ^ 2 ≠ 9600 ∧ (98 : ℝ) ^ 2 < 10000 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  calc (98 : ℝ) ^ 2 = (100 - 2) ^ 2 := by norm_num
    _ = 10000 - 400 + 4 := by norm_num
    _ = 9604 := by norm_num

/-- Preveri se 3: (−4)² = (−4)·(−4) = 16, zato (x − 4)² = x² − 8x + 16 (ne x² − 8x − 16 ne (x + 4)²);
(x − 4)(x + 4) = x² − 16. -/
theorem preveri3 : (-4 : ℝ) ^ 2 = (-4) * (-4) ∧ (-4 : ℝ) * (-4) = 16 ∧
    (∀ x : ℝ, (x - 4) ^ 2 = x ^ 2 - 8 * x + 16) ∧ (¬ ∀ x : ℝ, (x - 4) ^ 2 = x ^ 2 - 8 * x - 16) ∧
    (¬ ∀ x : ℝ, (x - 4) ^ 2 = (x + 4) ^ 2) ∧ (∀ x : ℝ, (x - 4) * (x + 4) = x ^ 2 - 16) := by
  refine ⟨by norm_num, by norm_num, fun x => by ring, fun h => ?_, fun h => ?_, fun x => by ring⟩
  · have := h 0; norm_num at this
  · have := h 1; norm_num at this

/-- Preveri se 4: 9x² − 12x + 4 = (3x − 2)² = 9x² − 2·3x·2 + 4; ni (9x − 2)², (3x + 2)² ali (3x − 4)²
(slednji je 9x² − 24x + 16). -/
theorem preveri4 : (∀ x : ℝ, (3 * x - 2) ^ 2 = 9 * x ^ 2 - 2 * (3 * x) * 2 + 4) ∧
    (∀ x : ℝ, 9 * x ^ 2 - 2 * (3 * x) * 2 + 4 = 9 * x ^ 2 - 12 * x + 4) ∧
    (¬ ∀ x : ℝ, (9 * x - 2) ^ 2 = 9 * x ^ 2 - 12 * x + 4) ∧
    (¬ ∀ x : ℝ, (3 * x + 2) ^ 2 = 9 * x ^ 2 - 12 * x + 4) ∧
    (¬ ∀ x : ℝ, (3 * x - 4) ^ 2 = 9 * x ^ 2 - 12 * x + 4) ∧
    (∀ x : ℝ, (3 * x - 4) ^ 2 = 9 * x ^ 2 - 24 * x + 16) := by
  refine ⟨fun x => by ring, fun x => by ring, fun h => ?_, fun h => ?_, fun h => ?_, fun x => by ring⟩
  · have := h 1; norm_num at this
  · have := h 1; norm_num at this
  · have := h 0; norm_num at this

/-- Preveri se 5: (n + 1)³ − n³ = 3n² + 3n + 1 (ne 1, ne 3n² + 1); pri n = 2: 12 + 6 + 1 = 19 = 27 − 8. -/
theorem preveri5 : (∀ n : ℝ, (n + 1) ^ 3 - n ^ 3 = 3 * n ^ 2 + 3 * n + 1) ∧
    (¬ ∀ n : ℝ, (n + 1) ^ 3 = n ^ 3 + 1) ∧ (¬ ∀ n : ℝ, (n + 1) ^ 3 - n ^ 3 = 3 * n ^ 2 + 1) ∧
    (3 * 2 ^ 2 + 3 * 2 + 1 : ℝ) = 12 + 6 + 1 ∧ (12 + 6 + 1 : ℝ) = 19 ∧ (27 - 8 : ℝ) = 19 ∧
    (2 + 1 : ℝ) ^ 3 - 2 ^ 3 = 27 - 8 := by
  refine ⟨fun n => by ring, fun h => ?_, fun h => ?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  · have := h 1; norm_num at this
  · have := h 1; norm_num at this

/-- Preveri se 6: 103·97 = (100 + 3)(100 − 3) = 100² − 3² = 10000 − 9 = 9991; ni 10009 ne 9997. -/
theorem preveri6 : (103 * 97 : ℝ) = 9991 ∧ (103 * 97 : ℝ) ≠ 10009 ∧ (103 * 97 : ℝ) ≠ 9997 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  calc (103 * 97 : ℝ) = (100 + 3) * (100 - 3) := by norm_num
    _ = 100 ^ 2 - 3 ^ 2 := by ring
    _ = 10000 - 9 := by norm_num
    _ = 9991 := by norm_num

/-! ## RACUN -/

/-- Blok RACUN: vse vrstice enako in vrednost. -/
theorem racun :
    (∀ x : ℝ, (2*x^2-3*x+5)-(x^2+4*x-7) = x^2-7*x+12) ∧ ((2:ℝ)^2-7*2+12 = 2) ∧
    (∀ x : ℝ, (3*x-2)*(2*x+5)-(x-4)*(x+4) = 5*x^2+11*x+6) ∧
    (∀ x : ℝ, x^3-(x-2)^3 = 6*x^2-12*x+8) ∧ ((6:ℝ)*10^2-12*10+8 = 488) ∧
    (∀ x : ℝ, (x+2)^3 = x^3+6*x^2+12*x+8) ∧ (∀ x : ℝ, x*(x+3)^2 = x^3+6*x^2+9*x) ∧
    (∀ x : ℝ, (x+2)^3-x*(x+3)^2 = 3*x+8) ∧ ((3:ℝ)^3-1*4^2 = 11) ∧
    (∀ x : ℝ, x*(x+2)*(x-2) = x^3-4*x) ∧
    (∀ x : ℝ, 2*(x*(x+2)+x*(x-2)+(x+2)*(x-2)) = 6*x^2-8) ∧
    (∀ x : ℝ, (x+1)^3-(x^3-4*x) = 3*x^2+7*x+1) ∧ ((6:ℝ)^3-5*7*3 = 111) ∧
    ((3:ℝ)*5^2+7*5+1 = 111) ∧ ((98:ℝ)^2 = 9604) ∧ ((103:ℝ)*97 = 9991) := by
  refine ⟨fun x => by ring, by norm_num, fun x => by ring, fun x => by ring, by norm_num,
    fun x => by ring, fun x => by ring, fun x => by ring, by norm_num, fun x => by ring,
    fun x => by ring, fun x => by ring, by norm_num, by norm_num, by norm_num, by norm_num⟩

end Evklid.Lekcije.MAT_SS_1.AlgebrskiIzrazi
