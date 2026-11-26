/-
vir: content/lessons/MAT-OS-8/mnozenje-izrazov.md
sha256: 5b70f9799b809bcda1aa7b8e963700c7075f1772c4c67ffd8a2c1fc3b4a3bbe3
Model: spremenljivke so realna števila (`ℝ`), izrazi so funkcije spremenljivk; »izraza sta enaka« pomeni
enakost za vsa števila (identiteta), »ni enako« pa, da enakost ne velja za vsa števila (pokazano z rešitvijo
ustrezne enačbe ali s protiprimerom). Količine so brez enot (km, m, m², cm², evri so le v docstringih).
Ni v Leanu: pojmi (enočlenik, dvočlenik, podobni členi, koeficient, črkovni del) kot definicije in »štetje
produktov« (koliko členov ima razčlenjen produkt; dokazane so same identitete s štirimi oz. šestimi produkti);
risba s pravokotniki in simulacija (dokazane so ploščine delov kot računi); »popravki« v Pogostih napakah
(nasveti, npr. risanje lokov); zgodba o Tini in Mihi kot besedilo (dokazani so njeni računi); analogija s
potmi (štetje poti kot kombinatorika ni formalizirano; dokazan je račun (2 + 1)(3 + 2) = 6 + 4 + 3 + 2 = 15);
Preveri se 5: da izraz res opiše plačilo (model besedila; dokazana je identiteta (n + 2)(c + 4) = nc + 4n + 2c + 8).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_8.MnozenjeIzrazov

/-! ## Razlaga -/

/-- Razlaga, »Najprej s števili«: pri x = 250 je 4·(250 + 35) = 4·285 = 1140 in po delih
4·250 + 4·35 = 1000 + 140 = 1140; Mihov izraz da 4·250 + 35 = 1035. -/
theorem stevila_250 :
    (4 : ℝ) * (250 + 35) = 4 * 285 ∧ (4 : ℝ) * 285 = 1140 ∧ (4 : ℝ) * 250 + 4 * 35 = 1000 + 140 ∧
      (1000 : ℝ) + 140 = 1140 ∧ (4 : ℝ) * 250 + 35 = 1035 := by
  norm_num

/-- Razlaga, »Premisli«: Miha se je zmotil za 1140 − 1035 = 105 = 3·35 km. -/
theorem miha_razlika : (1140 : ℝ) - 1035 = 105 ∧ (3 : ℝ) * 35 = 105 := by norm_num

/-- Razlaga, »Posplošimo«: 4·(x + 35) = 4x + 140 za vsako število x. -/
theorem stiri_krat (x : ℝ) : 4 * (x + 35) = 4 * x + 140 := by ring

/-- Zakaj se tega učimo in Pogoste napake 1: Miha nima prav — 4(x + 35) = 4x + 35 ne velja za nobeno število
(razlika je vedno 105). -/
theorem miha_nima_prav (x : ℝ) : 4 * (x + 35) ≠ 4 * x + 35 ∧ 4 * (x + 35) - (4 * x + 35) = 105 := by
  constructor
  · intro h; linarith
  · ring

/-- Razlaga in Povzetek 1: zakon o razčlenjevanju a(b + c) = ab + ac in a(b − c) = ab − ac. -/
theorem razclenjevanje (a b c : ℝ) : a * (b + c) = a * b + a * c ∧ a * (b - c) = a * b - a * c :=
  ⟨mul_add a b c, mul_sub a b c⟩

/-- Razlaga in Povzetek 2: enočlenika množimo po koeficientih in spremenljivkah: 3x·2x = (3·2)(x·x) = 6x². -/
theorem enoclenika (x : ℝ) : 3 * x * (2 * x) = (3 * 2) * (x * x) ∧ (3 * 2) * (x * x) = 6 * x ^ 2 := by
  constructor <;> ring

/-- Razlaga, »Dva oklepaja, spet s števili«: parcela 70·60 = 4200 m² razpade na 50·50 = 2500, 50·10 = 500,
20·50 = 1000, 20·10 = 200, vsota 2500 + 500 + 1000 + 200 = 4200. -/
theorem parcela :
    (50 : ℝ) + 20 = 70 ∧ (50 : ℝ) + 10 = 60 ∧ (70 : ℝ) * 60 = 4200 ∧ (50 : ℝ) * 50 = 2500 ∧
      (50 : ℝ) * 10 = 500 ∧ (20 : ℝ) * 50 = 1000 ∧ (20 : ℝ) * 10 = 200 ∧
      (2500 : ℝ) + 500 + 1000 + 200 = 4200 := by
  norm_num

/-- Razlaga, »Posplošimo«: (x + 20)(x + 10) = x² + 10x + 20x + 200 = x² + 30x + 200 (deli x², 10x, 20x, 200). -/
theorem parcela_x (x : ℝ) : (x + 20) * (x + 10) = x ^ 2 + 30 * x + 200 := by
  calc (x + 20) * (x + 10) = x * x + x * 10 + 20 * x + 20 * 10 := by ring
    _ = x ^ 2 + 10 * x + 20 * x + 200 := by ring
    _ = x ^ 2 + 30 * x + 200 := by ring

/-- Razlaga in Povzetek 3: dvočlenik krat dvočlenik (a + b)(c + d) = ac + ad + bc + bd. -/
theorem dvoclenika (a b c d : ℝ) : (a + b) * (c + d) = a * c + a * d + b * c + b * d := by ring

/-- Povzetek 4 (na sliki): pravokotnik s stranicama a + b in c + d ima ploščino, enako vsoti ploščin štirih
delov ac, ad, bc, bd (kot račun ploščin pravokotnikov). -/
theorem stirje_deli (a b c d : ℝ) : (a + b) * (c + d) = a * c + a * d + b * c + b * d := dvoclenika a b c d

/-- Razlaga, »Premisli«: (x + 3)² = (x + 3)(x + 3) = x² + 3x + 3x + 9 = x² + 6x + 9; pri x = 1 je (1 + 3)² = 16,
x² + 9 pa le 10. -/
theorem kvadrat_x3 (x : ℝ) :
    (x + 3) ^ 2 = (x + 3) * (x + 3) ∧ (x + 3) * (x + 3) = x ^ 2 + 3 * x + 3 * x + 9 ∧
      x ^ 2 + 3 * x + 3 * x + 9 = x ^ 2 + 6 * x + 9 := by
  refine ⟨?_, ?_, ?_⟩ <;> ring

/-- Razlaga, »Premisli« in Pogoste napake 2: (x + 3)² = x² + 9 ni identiteta — velja le pri x = 0
(manjkata dva pravokotnika 3x); pri x = 1 je 16 ≠ 10. -/
theorem kvadrat_ni (x : ℝ) : (x + 3) ^ 2 = x ^ 2 + 9 ↔ x = 0 := by
  constructor
  · intro h; nlinarith
  · rintro rfl; norm_num

/-- Razlaga, »Premisli«: vrednosti pri x = 1. -/
theorem kvadrat_pri_1 : ((1 : ℝ) + 3) ^ 2 = 16 ∧ (1 : ℝ) ^ 2 + 9 = 10 := by norm_num

/-- Razlaga, »Predznaki«: x − 3 = x + (−3); (x − 3)(x + 2) = x² + 2x − 3x − 6 = x² − x − 6. -/
theorem predznaki (x : ℝ) : x - 3 = x + (-3) ∧ (x - 3) * (x + 2) = x ^ 2 + 2 * x - 3 * x - 6 ∧
    x ^ 2 + 2 * x - 3 * x - 6 = x ^ 2 - x - 6 := by
  refine ⟨?_, ?_, ?_⟩ <;> ring

/-- Razlaga, »Predznaki«: pravilo predznakov — enaka predznaka dasta plus, različna minus:
(−a)(−b) = ab, (−a)·b = −ab, a·(−b) = −ab. -/
theorem pravilo_predznakov (a b : ℝ) : (-a) * (-b) = a * b ∧ (-a) * b = -(a * b) ∧ a * (-b) = -(a * b) := by
  refine ⟨?_, ?_, ?_⟩ <;> ring

/-- Razlaga, »Predznaki« in Povzetek 5: minus pred oklepajem je množenje z −1 in zamenja predznake vseh členov:
−(4a² − 4a) = (−1)·(4a² − 4a) = −4a² + 4a. -/
theorem minus_pred (a : ℝ) : -(4 * a ^ 2 - 4 * a) = (-1) * (4 * a ^ 2 - 4 * a) ∧
    (-1) * (4 * a ^ 2 - 4 * a) = -4 * a ^ 2 + 4 * a := by
  constructor <;> ring

/-- Primer 4 (formula): minus pred oklepajem −(m − n) = −m + n. -/
theorem minus_oklepaj (m n : ℝ) : -(m - n) = -m + n := by ring

/-! ## Rešeni primeri -/

/-- Primer 1: 3x·(2x + 5) = 3x·2x + 3x·5 = 6x² + 15x; preizkus z x = 1: 3·(2 + 5) = 21 = 6 + 15. -/
theorem primer1 (x : ℝ) : 3 * x * (2 * x + 5) = 6 * x ^ 2 + 15 * x := by
  calc 3 * x * (2 * x + 5) = 3 * x * (2 * x) + 3 * x * 5 := by ring
    _ = 6 * x ^ 2 + 3 * x * 5 := by ring
    _ = 6 * x ^ 2 + 15 * x := by ring

/-- Primer 1, korak 4: preizkus z x = 1. -/
theorem primer1_preizkus : (3 : ℝ) * (2 + 5) = 21 ∧ (6 : ℝ) + 15 = 21 := by norm_num

/-- Primer 2: (x + 5)(x − 4): x·x + x·(−4) = x² − 4x; 5·x + 5·(−4) = 5x − 20; skupaj x² − 4x + 5x − 20 = x² + x − 20. -/
theorem primer2 (x : ℝ) : (x + 5) * (x - 4) = x ^ 2 + x - 20 := by
  calc (x + 5) * (x - 4) = (x * x + x * (-4)) + (5 * x + 5 * (-4)) := by ring
    _ = (x ^ 2 - 4 * x) + (5 * x - 20) := by ring
    _ = x ^ 2 - 4 * x + 5 * x - 20 := by ring
    _ = x ^ 2 + x - 20 := by ring

/-- Primer 2, korak 5: preizkus z x = 2: (2 + 5)(2 − 4) = −14 = 4 + 2 − 20. -/
theorem primer2_preizkus : ((2 : ℝ) + 5) * (2 - 4) = -14 ∧ (4 : ℝ) + 2 - 20 = -14 := by norm_num

/-- Primer 3: p = (x + 8)(x + 5) − 3x = x² + 5x + 8x + 40 − 3x = x² + 13x + 40 − 3x = x² + 10x + 40. -/
theorem primer3 (x : ℝ) : (x + 8) * (x + 5) - 3 * x = x ^ 2 + 10 * x + 40 := by
  calc (x + 8) * (x + 5) - 3 * x = x ^ 2 + 5 * x + 8 * x + 40 - 3 * x := by ring
    _ = x ^ 2 + 13 * x + 40 - 3 * x := by ring
    _ = x ^ 2 + 10 * x + 40 := by ring

/-- Primer 3, koraka 3 in 4: pri x = 20 je 20² + 10·20 + 40 = 400 + 200 + 40 = 640; brez izraza: list
(20 + 8)(20 + 5) = 28·25 = 700, legenda 20·3 = 60, razlika 700 − 60 = 640. -/
theorem primer3_vrednost :
    (20 : ℝ) ^ 2 + 10 * 20 + 40 = 400 + 200 + 40 ∧ (400 : ℝ) + 200 + 40 = 640 ∧ (20 : ℝ) + 8 = 28 ∧
      (20 : ℝ) + 5 = 25 ∧ (28 : ℝ) * 25 = 700 ∧ (20 : ℝ) * 3 = 60 ∧ (700 : ℝ) - 60 = 640 := by
  norm_num

/-- Primer 4: (2a − 3)(a + 5) − 4a(a − 1): prvi produkt 2a·a + 2a·5 − 3·a − 3·5 = 2a² + 10a − 3a − 15 =
2a² + 7a − 15, drugi 4a(a − 1) = 4a² − 4a z minusom −4a² + 4a, skupaj 2a² + 7a − 15 − 4a² + 4a = −2a² + 11a − 15. -/
theorem primer4 (a : ℝ) : (2 * a - 3) * (a + 5) - 4 * a * (a - 1) = -2 * a ^ 2 + 11 * a - 15 := by
  have h1 : (2 * a - 3) * (a + 5) = 2 * a * a + 2 * a * 5 - 3 * a - 3 * 5 := by ring
  have h2 : 2 * a * a + 2 * a * 5 - 3 * a - 3 * 5 = 2 * a ^ 2 + 10 * a - 3 * a - 15 := by ring
  have h3 : 2 * a ^ 2 + 10 * a - 3 * a - 15 = 2 * a ^ 2 + 7 * a - 15 := by ring
  have h4 : 4 * a * (a - 1) = 4 * a ^ 2 - 4 * a := by ring
  have h5 : -(4 * a ^ 2 - 4 * a) = -4 * a ^ 2 + 4 * a := by ring
  calc (2 * a - 3) * (a + 5) - 4 * a * (a - 1) = (2 * a ^ 2 + 7 * a - 15) - (4 * a ^ 2 - 4 * a) := by
        rw [h1, h2, h3, h4]
    _ = 2 * a ^ 2 + 7 * a - 15 + (-4 * a ^ 2 + 4 * a) := by rw [sub_eq_add_neg, h5]
    _ = 2 * a ^ 2 + 7 * a - 15 - 4 * a ^ 2 + 4 * a := by ring
    _ = -2 * a ^ 2 + 11 * a - 15 := by ring

/-- Primer 4, »Premisli«: 2a² − 4a² = −2a², 7a + 4a = 11a; preizkus z a = 2: (4 − 3)(2 + 5) − 8·1 = −1 in
−8 + 22 − 15 = −1. -/
theorem primer4_preizkus (a : ℝ) :
    2 * a ^ 2 - 4 * a ^ 2 = -2 * a ^ 2 ∧ 7 * a + 4 * a = 11 * a ∧ ((4 : ℝ) - 3) * (2 + 5) - 8 * 1 = -1 ∧
      (-8 : ℝ) + 22 - 15 = -1 ∧ (2 * (2 : ℝ) - 3) * (2 + 5) - 4 * 2 * (2 - 1) = -1 := by
  refine ⟨by ring, by ring, by norm_num, by norm_num, by norm_num⟩

/-! ## Pogoste napake -/

/-- Pogoste napake 2: (x + 3)(x + 4) = x² + 7x + 12 (manjkata 4x in 3x); »x² + 12« velja le pri x = 0. -/
theorem napaka_prvi_zadnji (x : ℝ) : (x + 3) * (x + 4) = x ^ 2 + 4 * x + 3 * x + 12 ∧
    ((x + 3) * (x + 4) = x ^ 2 + 12 ↔ x = 0) := by
  refine ⟨by ring, ⟨fun h => by linarith, by rintro rfl; norm_num⟩⟩

/-- Pogoste napake 3: zadnji člen produkta (x − 3)(x + 2) je −3·2 = −6, ne +6. -/
theorem napaka_minus : (-3 : ℝ) * 2 = -6 ∧ ∀ x : ℝ, (x - 3) * (x + 2) ≠ x ^ 2 - x + 6 := by
  refine ⟨by norm_num, fun x h => ?_⟩
  have : (x - 3) * (x + 2) = x ^ 2 - x - 6 := by ring
  linarith

/-- Pogoste napake 4: 5 − (x − 3) = 5 − x + 3 = 8 − x; »5 − x − 3« ne velja za nobeno število. -/
theorem napaka_minus_pred (x : ℝ) : 5 - (x - 3) = 5 - x + 3 ∧ 5 - x + 3 = 8 - x ∧ 5 - (x - 3) ≠ 5 - x - 3 := by
  refine ⟨by ring, by ring, fun h => by linarith⟩

/-- Pogoste napake 5: x·x = x²; »x² + 7x = 8x²« velja le pri x = 0 ali x = 1, »x·x = 2x« le pri x = 0 ali x = 2
(nista identiteti). -/
theorem napaka_nepodobni (x : ℝ) : x * x = x ^ 2 ∧ (x ^ 2 + 7 * x = 8 * x ^ 2 ↔ x = 0 ∨ x = 1) ∧
    (x * x = 2 * x ↔ x = 0 ∨ x = 2) := by
  refine ⟨by ring, ⟨fun h => ?_, ?_⟩, ⟨fun h => ?_, ?_⟩⟩
  · have : x * (x - 1) = 0 := by nlinarith
    rcases mul_eq_zero.mp this with h | h
    · exact Or.inl h
    · exact Or.inr (by linarith)
  · rintro (rfl | rfl) <;> norm_num
  · have : x * (x - 2) = 0 := by nlinarith
    rcases mul_eq_zero.mp this with h | h
    · exact Or.inl h
    · exact Or.inr (by linarith)
  · rintro (rfl | rfl) <;> norm_num

/-! ## Drugače -/

/-- Z analogijo: (2 + 1)(3 + 2) = 15 in po skupinah 2·3 + 2·2 + 1·3 + 1·2 = 6 + 4 + 3 + 2 = 15. -/
theorem poti : (2 + 1) * (3 + 2) = 15 ∧ 2 * 3 = 6 ∧ 2 * 2 = 4 ∧ 1 * 3 = 3 ∧ 1 * 2 = 2 ∧ 6 + 4 + 3 + 2 = 15 := by
  norm_num

/-- Bolj natančno: z m = c + d je (a + b)·m = a·m + b·m = a(c + d) + b(c + d) = ac + ad + bc + bd. -/
theorem iz_razclenjevanja (a b c d : ℝ) : (a + b) * (c + d) = a * c + a * d + b * c + b * d := by
  set m := c + d with hm
  calc (a + b) * m = a * m + b * m := add_mul a b m
    _ = a * (c + d) + b * (c + d) := by rw [hm]
    _ = a * c + a * d + b * c + b * d := by ring

/-- Bolj natančno: a − b = a + (−b), zato pravilo velja tudi za razlike: (a − b)(c − d) = ac − ad − bc + bd. -/
theorem razlike (a b c d : ℝ) : a - b = a + (-b) ∧ (a - b) * (c - d) = a * c - a * d - b * c + b * d := by
  constructor <;> ring

/-- Bolj natančno: pri treh členih v enem oklepaju je produktov 2·3 = 6:
(a + b)(c + d + e) = ac + ad + ae + bc + bd + be. -/
theorem trije_cleni (a b c d e : ℝ) :
    (a + b) * (c + d + e) = a * c + a * d + a * e + b * c + b * d + b * e ∧ 2 * 3 = 6 := by
  constructor <;> ring

/-! ## Preveri se -/

/-- Preveri se 1: 2(x + 5) = 2x + 10 = (x + 5) + (x + 5) = 10 + 2x, izraz 2x + 5 pa ni enak 2(x + 5)
(za nobeno število). -/
theorem kviz1 (x : ℝ) : 2 * (x + 5) = 2 * x + 10 ∧ 2 * (x + 5) = (x + 5) + (x + 5) ∧ 2 * (x + 5) = 10 + 2 * x ∧
    2 * (x + 5) ≠ 2 * x + 5 := by
  refine ⟨by ring, by ring, by ring, fun h => by linarith⟩

/-- Preveri se 2: (x + 4)(x + 6) = x² + bx + 24 za vsa x natanko tedaj, ko je b = 10 (x·6 + 4·x = 10x). -/
theorem kviz2 (b : ℝ) : (∀ x : ℝ, (x + 4) * (x + 6) = x ^ 2 + b * x + 24) ↔ b = 10 := by
  constructor
  · intro h; have := h 1; linarith
  · rintro rfl x; ring

/-- Preveri se 2, napačni odgovori: 24 = 4·6 je zadnji člen; b = 0 bi dobil le s prvim s prvim in zadnjim z
zadnjim (manjkata 6x in 4x); 2 = 6 − 4, pravilno pa je x·6 + 4·x = 6x + 4x = 10x. -/
theorem kviz2_napacni : (4 : ℝ) * 6 = 24 ∧ (∀ x : ℝ, (x + 4) * (x + 6) - (x ^ 2 + 24) = 6 * x + 4 * x) ∧
    (6 : ℝ) - 4 = 2 ∧ ∀ x : ℝ, x * 6 + 4 * x = 10 * x := by
  refine ⟨by norm_num, fun x => by ring, by norm_num, fun x => by ring⟩

/-- Preveri se 3: igrišče s stranico x, obe stranici + 3: (x + 3)(x + 3) = x² + 3x + 3x + 9 = x² + 6x + 9,
povečanje je 6x + 9. -/
theorem kviz3 (x : ℝ) : (x + 3) * (x + 3) = x ^ 2 + 3 * x + 3 * x + 9 ∧ (x + 3) * (x + 3) - x ^ 2 = 6 * x + 9 := by
  constructor <;> ring

/-- Preveri se 3, napačni odgovori: 9 = 3·3 je le kvadratek v kotu (manjkata dva pravokotnika 3x); 3x + 9
upošteva le en pravokotnik (manjka še 3x); 6x pozabi kvadratek 9. -/
theorem kviz3_napacni (x : ℝ) : (3 : ℝ) * 3 = 9 ∧ (x + 3) * (x + 3) - x ^ 2 - 9 = 3 * x + 3 * x ∧
    (x + 3) * (x + 3) - x ^ 2 - (3 * x + 9) = 3 * x ∧ (x + 3) * (x + 3) - x ^ 2 - 6 * x = 3 * 3 := by
  refine ⟨by norm_num, by ring, by ring, by ring⟩

/-- Preveri se 4: −3·x = −3x in −3·(−2) = +6, zato 4 − 3(x − 2) = 4 − 3x + 6 = 10 − 3x. Lukov korak 1
(4 − 3x − 6) je napačen za vsa x, korak 2 (4 − 3x − 6 = −2 − 3x) pa pravilen; pri x = 0: 10 ≠ −2. -/
theorem kviz4 (x : ℝ) : (-3) * (-2 : ℝ) = 6 ∧ 4 - 3 * (x - 2) = 4 - 3 * x + 6 ∧ 4 - 3 * x + 6 = 10 - 3 * x ∧
    4 - 3 * (x - 2) ≠ 4 - 3 * x - 6 ∧ 4 - 3 * x - 6 = -2 - 3 * x ∧
    ((4 : ℝ) - 3 * (0 - 2) = 10 ∧ (-2 : ℝ) - 3 * 0 = -2) := by
  refine ⟨by norm_num, by ring, by ring, fun h => by linarith, by ring, by norm_num, by norm_num⟩

/-- Preveri se 5: (n + 2)(c + 4) = nc + 4n + 2c + 8. -/
theorem kviz5 (n c : ℝ) : (n + 2) * (c + 4) = n * c + 4 * n + 2 * c + 8 := by ring

/-- Preveri se 5, napačni odgovori: nc + 8 izpusti avtobus učencev 4n in vstopnico učiteljev 2c; pri nc + 4n + 2
sta učitelja le prišteta, plačata pa 2(c + 4) = 2c + 8; pri n + 2c + 8 so učenci le prišteti, plačajo pa
n(c + 4) = nc + 4n. -/
theorem kviz5_napacni (n c : ℝ) : (n + 2) * (c + 4) - (n * c + 8) = 4 * n + 2 * c ∧
    (n + 2) * (c + 4) = n * (c + 4) + 2 * (c + 4) ∧ 2 * (c + 4) = 2 * c + 8 ∧ n * (c + 4) = n * c + 4 * n := by
  refine ⟨by ring, by ring, by ring, by ring⟩

end Evklid.Lekcije.MAT_OS_8.MnozenjeIzrazov
