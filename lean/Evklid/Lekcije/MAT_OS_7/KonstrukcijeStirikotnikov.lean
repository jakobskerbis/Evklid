/-
vir: content/lessons/MAT-OS-7/konstrukcije-stirikotnikov.md
sha256: 25157601a9af7129e33b239eafc659e4529ce65cc750852f366c7759b322705d
Ni v Leanu: risanje s šestilom in ravnilom, skica, analiza in diskusija kot postopek; simulacija in zgodbe
(slamice, mizar, ograja, mostovi) kot slike oziroma besedilo; označevanje »v nasprotni smeri urnega
kazalca« (Pogoste napake 5) kot dogovor. »Diagonala razdeli štirikotnik na dva trikotnika«, »četrto oglišče
je presečišče dveh lokov / vzporednice in loka« in »diagonala zaklene obliko« so opis konstrukcije, ne
dokazane trditve. Pojem »štirikotnik je določen« (vsi načrtani liki so skladni) in s
tem tabela potrebnih podatkov (kvadrat 1, pravokotnik in romb 2, paralelogram in deltoid 3, trapez 4,
splošni 5; Preveri se 1, Bolj natančno, Povzetek): zahtevno, še ni dokazano (skladnost štirikotnikov ni
formalizirana); dokazana je le aritmetika štetja (3 + 2 = 5, 5 − 2 = 3 …). »Trikotnik je tog« (izrek sss in
ostali izreki o skladnosti), dve rešitvi pri ssk, »presečišče na isti strani premice« in »se stranice ne
križajo«: zahtevno, še ni dokazano. Merjenje (|BC| = 4 cm v Primeru 3, stranica ≈ 3,6 cm v Primeru 2) je
nadomeščeno z izračunom. Lastnost »AB ∥ CD« pri trapezu je zapisana kot C − D = (c/a)·(B − A) (vzporedni in
enako usmerjeni osnovnici, c ≤ a). Romb je tu paralelogram s sosednjima stranicama enake dolžine
(B − A = C − D in |AB| = |BC|); deltoid z osjo AC je dobljen z zrcaljenjem B čez premico AC.
Model: točke so vektorji v realnem prostoru s skalarnim produktom V (ravnina je poseben primer); primeri
izpolnljivosti so v ℂ. Kot ∠ je Mathlibov `EuclideanGeometry.angle` v radianih (180° = π); stopinje v primerih
so računane kot števila. Dolžine (cm) so števila v ℝ. Napačni odgovori kvizov: dokazano je, da napačne
vrednosti niso pravilne, razen pri Preveri se 1 (napačni 2, 4, 5 slonijo na zgornji tabeli, ki še ni
dokazana) in pri povratnih informacijah, ki so opis konstrukcije: Preveri se 3 (»lik na drugi strani AB je
zrcalna slika in skladen s prvim«) in Korak za korakom, korak 2 (»dani kot β leži nasproti daljše stranice
e, zato gre za izrek ssk«) nista dokazani (zahtevno, še ni dokazano, skladnost ni formalizirana). Preveri se 5
je dokazan na zgledu v ℂ (A = 0, B = 4): C = 4 + 3i je na pravokotnici v B in |AC| = 5; napačna izbira
»5 cm na pravokotnico v A« da točko 5i ≠ C, »5 cm na pravokotnico v B« pa točko z |AC| = √41 ≠ 5.
Da je to presečišče edino oglišče C nad AB, je del konstrukcije (zahtevno, še ni dokazano).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.KonstrukcijeStirikotnikov

open EuclideanGeometry Complex Real
open scoped InnerProductSpace

/-- Pomožna trditev za primere: √a = b, če je b ≥ 0 in a = b². -/
theorem koren (a b : ℝ) (hb : 0 ≤ b) (h : a = b ^ 2) : √a = b := by
  rw [h, Real.sqrt_sq hb]

/-! ## Obstoj pomožnega trikotnika (trikotniška neenakost) -/

/-- Razlaga 4 (preverjanje obstoja): če trikotnik s stranicami x, y, z obstaja (tri točke v metričnem
prostoru), je z ≤ x + y; zato pri x + y < z ne obstaja. -/
theorem ni_trikotnika {M : Type*} [MetricSpace M] (x y z : ℝ) (h : x + y < z) :
    ¬ ∃ A B C : M, dist A B = x ∧ dist B C = y ∧ dist A C = z := by
  rintro ⟨A, B, C, hAB, hBC, hAC⟩
  have := dist_triangle A B C
  linarith

/-- Predpostavka trditve `ni_trikotnika` se da izpolniti (5 + 3 < 9). -/
example : (5 : ℝ) + 3 < 9 := by norm_num

/-- Razlaga 4 (premisli): paralelogram z a = 5, b = 3, e = 9 ne obstaja, ker pomožni trikotnik ABC
ne obstaja (5 + 3 = 8 < 9). -/
theorem premisli_5_3_9 {M : Type*} [MetricSpace M] :
    (5 : ℝ) + 3 = 8 ∧ (8 : ℝ) < 9 ∧ ¬ ∃ A B C : M, dist A B = 5 ∧ dist B C = 3 ∧ dist A C = 9 :=
  ⟨by norm_num, by norm_num, ni_trikotnika 5 3 9 (by norm_num)⟩

/-- Pogoste napake 3 in Preveri se 3: paralelogram z a = 6, b = 2, e = 9 ne obstaja (6 + 2 < 9). -/
theorem kviz3 {M : Type*} [MetricSpace M] :
    (6 : ℝ) + 2 < 9 ∧ ¬ ∃ A B C : M, dist A B = 6 ∧ dist B C = 2 ∧ dist A C = 9 :=
  ⟨by norm_num, ni_trikotnika 6 2 9 (by norm_num)⟩

/-! ## Paralelogram -/

section Vektorji

variable {V : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V]

omit [InnerProductSpace ℝ V] in
/-- Primer 1 (formula) in Na sliki: v paralelogramu (B − A = C − D) sta nasprotni stranici enaki,
|CD| = |AB| in |DA| = |BC|; zrcaljenje čez razpolovišče diagonale BD (X ↦ B + D − X) preslika A v C,
B v D in D v B in ohranja razdalje (‖(B + D − X) − (B + D − Y)‖ = ‖X − Y‖), zato sta trikotnika ABD in
CDB skladna. -/
theorem paralelogram (A B C D : V) (h : B - A = C - D) :
    ‖C - D‖ = ‖B - A‖ ∧ ‖D - A‖ = ‖C - B‖ ∧ B + D - A = C ∧ B + D - B = D ∧ B + D - D = B ∧
      ∀ X Y : V, ‖(B + D - X) - (B + D - Y)‖ = ‖X - Y‖ := by
  have hC : C = B - A + D := by rw [h]; abel
  subst hC
  refine ⟨by congr 1; abel, by congr 1; abel, by abel, by abel, by abel, fun X Y => ?_⟩
  rw [show (B + D - X) - (B + D - Y) = -(X - Y) by abel, norm_neg]

/-- Predpostavka trditve `paralelogram` se da izpolniti (A = 0, B = 1, C = 1 + i, D = i v ℂ). -/
example : (1 : ℂ) - 0 = (1 + I) - I := by ring

/-- Primer 1, korak 6: v paralelogramu (B − A = C − D) je vsota sosednjih kotov 180°:
∠DAB + ∠ABC = π. -/
theorem sosednja_kota (A B C D : V) (h : B - A = C - D) : ∠ D A B + ∠ A B C = π := by
  have hC : C = B - A + D := by rw [h]; abel
  subst hC
  unfold EuclideanGeometry.angle
  simp only [vsub_eq_sub]
  rw [show A - B = -(B - A) by abel, show B - A + D - B = D - A by abel,
    InnerProductGeometry.angle_neg_left, InnerProductGeometry.angle_comm (B - A)]
  ring

/-- Predpostavka trditve `sosednja_kota` se da izpolniti (A = 0, B = 1, C = 1 + i, D = i v ℂ). -/
example : (1 : ℂ) - 0 = (1 + I) - I := by ring

/-- Primer 1, korak 6: β = 180° − 60° = 120°. -/
theorem primer1_beta : (180 : ℝ) - 60 = 120 := by norm_num

/-- Primer 2 (formula): v rombu (paralelogram B − A = C − D z |AB| = |BC|) se diagonali razpolavljata
(A + C = B + D, skupno razpolovišče S) in sta pravokotni (⟪C − A, D − B⟫ = 0). -/
theorem romb_diagonali (A B C D : V) (h : B - A = C - D) (hab : ‖B - A‖ = ‖C - B‖) :
    A + C = B + D ∧ ⟪C - A, D - B⟫_ℝ = 0 := by
  have hC : C = B - A + D := by rw [h]; abel
  subst hC
  refine ⟨by abel, ?_⟩
  rw [show B - A + D - A = (D - A) + (B - A) by abel, show D - B = (D - A) - (B - A) by abel,
    real_inner_add_sub_eq_zero_iff, hab]
  congr 1; abel

/-- Predpostavke trditve `romb_diagonali` se dajo izpolniti (kvadrat A = 0, B = 1, C = 1 + i, D = i v ℂ). -/
example : (1 : ℂ) - 0 = (1 + I) - I ∧ ‖(1 : ℂ) - 0‖ = ‖(1 + I) - 1‖ := by
  refine ⟨by ring, ?_⟩
  simp

/-- Primer 2 (konstrukcija): če se diagonali AC in BD razpolavljata v S (A = S − u, C = S + u, B = S − v,
D = S + v) in sta pravokotni (⟪u, v⟫ = 0), so vse štiri stranice enako dolge, √(|u|² + |v|²) (lik je romb). -/
theorem romb_iz_diagonal (S u v : V) (h : ⟪u, v⟫_ℝ = 0) :
    ‖(S - v) - (S - u)‖ = √(‖u‖ ^ 2 + ‖v‖ ^ 2) ∧ ‖(S + u) - (S - v)‖ = √(‖u‖ ^ 2 + ‖v‖ ^ 2) ∧
      ‖(S + v) - (S + u)‖ = √(‖u‖ ^ 2 + ‖v‖ ^ 2) ∧ ‖(S - u) - (S + v)‖ = √(‖u‖ ^ 2 + ‖v‖ ^ 2) := by
  have hp : ‖u + v‖ = √(‖u‖ ^ 2 + ‖v‖ ^ 2) := by
    rw [eq_comm]; apply koren _ _ (norm_nonneg _); rw [norm_add_sq_real, h]; ring
  have hm : ‖u - v‖ = √(‖u‖ ^ 2 + ‖v‖ ^ 2) := by
    rw [eq_comm]; apply koren _ _ (norm_nonneg _); rw [norm_sub_sq_real, h]; ring
  refine ⟨?_, ?_, ?_, ?_⟩
  · rw [show (S - v) - (S - u) = u - v by abel, hm]
  · rw [show (S + u) - (S - v) = u + v by abel, hp]
  · rw [show (S + v) - (S + u) = -(u - v) by abel, norm_neg, hm]
  · rw [show (S - u) - (S + v) = -(u + v) by abel, norm_neg, hp]

/-- Predpostavka trditve `romb_iz_diagonal` se da izpolniti (u = 3, v = 2i v ℂ, e = 6, f = 4). -/
example : ⟪(3 : ℂ), 2 * I⟫_ℝ = 0 := by simp [Complex.inner]

/-- Korak za korakom (preveri) in Pogoste napake 2: v pravokotniku (paralelogram B − A = C − D s pravim
kotom pri B) sta diagonali enako dolgi, |AC| = |BD| (f = e), in |AC|² = |AB|² + |BC|². -/
theorem pravokotnik_diagonali (A B C D : V) (h : B - A = C - D) (hp : ⟪B - A, C - B⟫_ℝ = 0) :
    ‖C - A‖ = ‖D - B‖ ∧ ‖C - A‖ ^ 2 = ‖B - A‖ ^ 2 + ‖C - B‖ ^ 2 := by
  have hC : C = B - A + D := by rw [h]; abel
  subst hC
  have e1 : B - A + D - A = (B - A) + (B - A + D - B) := by abel
  have e2 : D - B = (B - A + D - B) - (B - A) := by abel
  have h1 := norm_add_sq_real (B - A) (B - A + D - B)
  have h2 := norm_sub_sq_real (B - A + D - B) (B - A)
  rw [hp] at h1
  rw [real_inner_comm, hp] at h2
  refine ⟨?_, by rw [e1, h1]; ring⟩
  rw [e1, e2]
  exact (pow_left_inj₀ (norm_nonneg _) (norm_nonneg _) two_ne_zero).mp (by rw [h1, h2]; ring)

/-- Predpostavke trditve `pravokotnik_diagonali` se dajo izpolniti (A = 0, B = 4, C = 4 + 3i, D = 3i). -/
example : (4 : ℂ) - 0 = (4 + 3 * I) - 3 * I ∧ ⟪(4 : ℂ) - 0, (4 + 3 * I) - 4⟫_ℝ = 0 := by
  refine ⟨by ring, ?_⟩
  simp [Complex.inner]

/-- Primer 3 (formula) in Povzetek: v trapezu z AB ∥ CD (C − D = (c/a)·(B − A), |AB| = a > 0, c ≤ a)
in točko E = B − (C − D) je EBCD paralelogram (B − E = C − D), |ED| = |BC| = b in |AE| = a − c.
Trapez je pri 0 < c; trditev velja za vsak c ≤ a (pogoj c ≥ 0 ni potreben). -/
theorem trapez (A B C D : V) (a c : ℝ) (ha : 0 < a) (hca : c ≤ a) (hAB : ‖B - A‖ = a)
    (hpar : C - D = (c / a) • (B - A)) :
    B - (B - (C - D)) = C - D ∧ ‖(B - (C - D)) - D‖ = ‖B - C‖ ∧ ‖(B - (C - D)) - A‖ = a - c := by
  refine ⟨by abel, by congr 1; abel, ?_⟩
  rw [show B - (C - D) - A = (B - A) - (C - D) by abel, hpar,
    show (B - A) - (c / a) • (B - A) = (1 - c / a) • (B - A) by module, norm_smul, hAB,
    Real.norm_eq_abs, abs_of_nonneg (by rw [sub_nonneg, div_le_one ha]; exact hca)]
  field_simp

/-- Predpostavke trditve `trapez` se dajo izpolniti (A = 0, B = 7, D = i, C = 3 + i v ℂ, a = 7, c = 3). -/
example : (0 : ℝ) < 7 ∧ (3 : ℝ) ≤ 7 ∧ ‖(7 : ℂ) - 0‖ = 7 ∧
    (3 + I) - I = ((3 : ℝ) / 7) • ((7 : ℂ) - 0) := by
  refine ⟨by norm_num, by norm_num, by simp, ?_⟩
  rw [Complex.real_smul]; push_cast; ring

end Vektorji

/-! ## Deltoid -/

/-- Primer 4 (premisli) in Na sliki: zrcalna slika D točke B čez premico AC je od A in C enako oddaljena
kot B (|AD| = |AB|, |CD| = |CB|), zato je ABCD deltoid z osjo AC. -/
theorem deltoid (A B C : ℂ) :
    dist A (EuclideanGeometry.reflection line[ℝ, A, C] B) = dist A B ∧
      dist C (EuclideanGeometry.reflection line[ℝ, A, C] B) = dist C B :=
  ⟨EuclideanGeometry.dist_reflection_eq_of_mem _ (left_mem_affineSpan_pair ℝ A C) B,
    EuclideanGeometry.dist_reflection_eq_of_mem _ (right_mem_affineSpan_pair ℝ A C) B⟩

/-! ## Štiri stranice ne določajo štirikotnika -/

/-- Pogoste napake 1, Preveri se 2 in Povzetek: kvadrat 0, 4, 4 + 4i, 4i in romb 0, 4, 6 + 2√3·i, 2 + 2√3·i
imata vse stranice 4 cm, diagonali AC pa sta različni (√32 ≠ √48), zato štiri stranice ne določajo
štirikotnika (in štirikotnik s stranicami 4, 4, 4, 4 ni nujno kvadrat). -/
theorem stiri_stranice :
    (‖(4 : ℂ) - 0‖ = 4 ∧ ‖(4 + 4 * I) - 4‖ = 4 ∧ ‖4 * I - (4 + 4 * I)‖ = 4 ∧ ‖(0 : ℂ) - 4 * I‖ = 4) ∧
      (‖(4 : ℂ) - 0‖ = 4 ∧ ‖((6 : ℂ) + (2 * √3 : ℝ) * I) - 4‖ = 4 ∧
        ‖((2 : ℂ) + (2 * √3 : ℝ) * I) - (6 + (2 * √3 : ℝ) * I)‖ = 4 ∧
        ‖(0 : ℂ) - (2 + (2 * √3 : ℝ) * I)‖ = 4) ∧
      ‖(4 + 4 * I) - (0 : ℂ)‖ = √32 ∧ ‖((6 : ℂ) + (2 * √3 : ℝ) * I) - 0‖ = √48 ∧ √32 ≠ √48 := by
  have h3 : (√3 : ℝ) ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  refine ⟨⟨by simp, ?_, ?_, ?_⟩, ⟨by simp, ?_, ?_, ?_⟩, ?_, ?_, ?_⟩
  · rw [show (4 : ℂ) + 4 * I - 4 = 4 * I by ring]; simp
  · rw [show 4 * I - (4 + 4 * I) = (-4 : ℂ) by ring]; simp
  · rw [show (0 : ℂ) - 4 * I = -(4 * I) by ring, norm_neg]; simp
  · rw [Complex.norm_eq_sqrt_sq_add_sq]; apply koren _ _ (by norm_num); simp; nlinarith
  · rw [show ((2 : ℂ) + (2 * √3 : ℝ) * I) - (6 + (2 * √3 : ℝ) * I) = (-4 : ℂ) by ring]; simp
  · rw [Complex.norm_eq_sqrt_sq_add_sq]; apply koren _ _ (by norm_num); simp; nlinarith
  · rw [Complex.norm_eq_sqrt_sq_add_sq]; congr 1; simp; norm_num
  · rw [Complex.norm_eq_sqrt_sq_add_sq]; congr 1; simp; nlinarith
  · intro h
    have := Real.sqrt_lt_sqrt (by norm_num : (0 : ℝ) ≤ 32) (by norm_num : (32 : ℝ) < 48)
    linarith

/-! ## Rešeni primeri: računi -/

/-- Primer 2: f/2 = 4/2 = 2; stranica romba je √(3² + 2²) = √13 ≈ 3,6 cm. -/
theorem primer2 : (4 : ℝ) / 2 = 2 ∧ (6 : ℝ) / 2 = 3 ∧ (3 : ℝ) ^ 2 + 2 ^ 2 = 13 ∧ |√13 - 3.6| < 0.05 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  rw [abs_lt]
  constructor
  · have : (3.55 : ℝ) < √13 := by
      rw [Real.lt_sqrt (by norm_num)]; norm_num
    linarith
  · have : √13 < (3.65 : ℝ) := by
      rw [Real.sqrt_lt' (by norm_num)]; norm_num
    linarith

/-- Primer 3: merilo 1 : 10: 70/10 = 7, 30/10 = 3, 40/10 = 4, 50/10 = 5; |AE| = 7 − 3 = 4; obstoj
pomožnega trikotnika 4 + 4 = 8 > 5 (in 4 + 5 > 4). -/
theorem primer3 : (70 : ℝ) / 10 = 7 ∧ (30 : ℝ) / 10 = 3 ∧ (40 : ℝ) / 10 = 4 ∧ (50 : ℝ) / 10 = 5 ∧
    (7 : ℝ) - 3 = 4 ∧ (4 : ℝ) + 4 = 8 ∧ (8 : ℝ) > 5 ∧ (4 : ℝ) + 5 > 4 := by norm_num

/-- Primer 3, korak 4: pomožni trikotnik AED s stranicami |AE| = 4, |ED| = 4, |AD| = 5 obstaja
(A = 0, E = 4, D = 25/8 + (√975/8)·i v ℂ). -/
theorem primer3_obstoj :
    ‖(4 : ℂ) - 0‖ = 4 ∧ ‖((25 / 8 : ℂ) + (√975 / 8 : ℝ) * I) - 4‖ = 4 ∧
      ‖((25 / 8 : ℂ) + (√975 / 8 : ℝ) * I) - 0‖ = 5 := by
  have h : (√975 : ℝ) ^ 2 = 975 := Real.sq_sqrt (by norm_num)
  refine ⟨by simp, ?_, ?_⟩
  · rw [Complex.norm_eq_sqrt_sq_add_sq]; apply koren _ _ (by norm_num); simp; nlinarith
  · rw [Complex.norm_eq_sqrt_sq_add_sq]; apply koren _ _ (by norm_num); simp; nlinarith

/-- Primer 4, korak 1: 5 + 3 = 8 > 6; pomožni trikotnik ABC (|AC| = 6, |AB| = 5, |CB| = 3) obstaja
(A = 0, C = 6, B = 13/3 + (√56/3)·i v ℂ). -/
theorem primer4 : (5 : ℝ) + 3 = 8 ∧ (8 : ℝ) > 6 ∧ ‖(6 : ℂ) - 0‖ = 6 ∧
    ‖((13 / 3 : ℂ) + (√56 / 3 : ℝ) * I) - 0‖ = 5 ∧ ‖(6 : ℂ) - ((13 / 3 : ℂ) + (√56 / 3 : ℝ) * I)‖ = 3 := by
  have h : (√56 : ℝ) ^ 2 = 56 := Real.sq_sqrt (by norm_num)
  refine ⟨by norm_num, by norm_num, by simp, ?_, ?_⟩
  · rw [Complex.norm_eq_sqrt_sq_add_sq]; apply koren _ _ (by norm_num); simp; nlinarith
  · rw [Complex.norm_eq_sqrt_sq_add_sq]; apply koren _ _ (by norm_num); simp; nlinarith

/-- Korak za korakom: pravokotnik z a = 4 in e = 5: e > a; |BC| = b > 0 z 4² + b² = 5² je natanko b = 3;
Pogoste napake 2: b = 5 bi dal diagonalo √41 ≠ 5. (Da je f = e, dokazuje `pravokotnik_diagonali`.) -/
theorem korak (b : ℝ) (hb : 0 < b) : (5 : ℝ) > 4 ∧ ((4 : ℝ) ^ 2 + b ^ 2 = 5 ^ 2 ↔ b = 3) ∧
    √((4 : ℝ) ^ 2 + 5 ^ 2) ≠ 5 := by
  refine ⟨by norm_num, ⟨fun h => by nlinarith, fun h => by rw [h]; norm_num⟩, ?_⟩
  intro h
  have := Real.sq_sqrt (by norm_num : (0 : ℝ) ≤ 4 ^ 2 + 5 ^ 2)
  rw [h] at this
  norm_num at this

/-- Predpostavka trditve `korak` se da izpolniti (b = 3). -/
example : (0 : ℝ) < 3 := by norm_num

/-- Preveri se 5 (zgled v ℂ, A = 0, B = 4, a = 4, e = 5): C = 4 + 3i leži na pravokotnici na AB v B in je
od A oddaljen 5; napačno: točka 5i (5 cm na pravokotnico v A) je od A oddaljena 5, a ni C; točka 4 + 5i
(5 cm na pravokotnico v B) je od A oddaljena √41 ≠ 5. -/
theorem kviz5 :
    ⟪(4 : ℂ) - 0, (4 + 3 * I) - 4⟫_ℝ = 0 ∧ ‖(4 + 3 * I : ℂ) - 0‖ = 5 ∧
      ⟪(4 : ℂ) - 0, 5 * I - 0⟫_ℝ = 0 ∧ ‖(5 * I : ℂ) - 0‖ = 5 ∧ (5 * I : ℂ) ≠ 4 + 3 * I ∧
      ⟪(4 : ℂ) - 0, (4 + 5 * I) - 4⟫_ℝ = 0 ∧ ‖(4 + 5 * I : ℂ) - 0‖ = √41 ∧ √41 ≠ 5 := by
  refine ⟨by simp [Complex.inner], ?_, by simp [Complex.inner], by simp, ?_, by simp [Complex.inner], ?_, ?_⟩
  · rw [Complex.norm_eq_sqrt_sq_add_sq]; apply koren _ _ (by norm_num); simp; norm_num
  · intro h
    have := congrArg Complex.re h
    simp at this
  · rw [Complex.norm_eq_sqrt_sq_add_sq]; congr 1; simp; norm_num
  · intro h
    have := Real.sq_sqrt (by norm_num : (0 : ℝ) ≤ 41)
    rw [h] at this
    norm_num at this

/-- Preveri se 4 in Pogoste napake 4: trapez a = 8, c = 5, b = 4, d = 3: pomožni trikotnik ima stranice
a − c = 3, 4, 3 (obstaja: 3 + 3 > 4); napačni sta 8 (cela osnovnica) in 13 = 8 + 5. -/
theorem kviz4 : (8 : ℝ) - 5 = 3 ∧ (3 : ℝ) + 3 > 4 ∧ (8 : ℝ) ≠ 3 ∧ (8 : ℝ) + 5 = 13 ∧ (13 : ℝ) ≠ 3 := by
  norm_num

/-- Bolj natančno: štetje podatkov 3 + 2 = 5; paralelogram 5 − 2 = 3; romb 5 − 3 = 2; pravokotnik
5 − 3 = 2; kvadrat 5 − 4 = 1. -/
theorem stetje : (3 : ℕ) + 2 = 5 ∧ (5 : ℕ) - 2 = 3 ∧ (5 : ℕ) - 3 = 2 ∧ (5 : ℕ) - 4 = 1 := by decide

end Evklid.Lekcije.MAT_OS_7.KonstrukcijeStirikotnikov
