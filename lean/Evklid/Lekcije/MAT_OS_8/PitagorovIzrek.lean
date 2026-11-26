/-
vir: content/lessons/MAT-OS-8/pitagorov-izrek.md
sha256: 986de14222066ac68cf65990181fcdeba5ea0957aab8105e4a178a24aa95274c
Model: trikotnik ABC v evklidskem afinem prostoru (ravnina je poseben primer), pravi kot je pri C (∠ A C B = π/2),
kateti sta a = |BC| in b = |AC|, hipotenuza c = |AB|. Pitagorov izrek in njegov obrat sta ena trditev ↔ (Mathlib
`dist_sq_eq_dist_sq_add_dist_sq_iff_angle_eq_pi_div_two`). Rešeni primeri so dokazani za vsak pravokotni trikotnik
z danima stranicama; da tak trikotnik obstaja, pokaže `obstaja_pravokotni` (točke v ℝ²). Decimalna števila so
točni ulomki (2,5 = 5/2); enote (cm, m) so le v docstringih; koren je `Real.sqrt`.
Lean: kot ob izrojenem oglišču (A = C ali B = C) je v Mathlibu π/2; izrek takrat še vedno velja (ena kateta je 0),
trditvi »hipotenuza je najdaljša« in »kateta je krajša od hipotenuze« pa imata zato pogoja A ≠ C, B ≠ C.
Ni v Leanu: vrv z vozli, karirast papir in risbe; »trikotnik 2, 5, 5 je ozek in koničast« (opis oblike; dokazano je
le, da ni pravokoten); simulacija »Pitagorov izrek s kvadrati« in štetje kvadratkov ter preložitev ploščic (dokazane
so le številske enakosti 9 + 16 = 25, 36 + 64 = 100); geometrijska sestava dokaza v Bolj natančno (polaganje štirih
trikotnikov v kvadrat; dokazan je le algebrski del, da iz (a + b)² = c² + 4 · ab/2 sledi a² + b² = c²); »hipotenuza
je ravna bližnjica« kot pojasnilo (dokazano je a + b ≠ c pri 3, 4, 5 in c < a + b za vsak nerazrojen pravokotni
trikotnik); zaokroževanje »na milimeter ali centimeter, kolikor meri meter« in nasvet »nariši skico« (navodila);
izmerjene hipotenuze v tabeli (meritev; dokazano je, da so vsote kvadratov 5², 10², 13²); »5 + 6 > 8 pove, da trikotnik
obstaja« (dokazano je le 5 + 6 > 8); »kot med stranicama 3 in 4 je pravi« v uvodu kot trditev o vrvi (dokazana sta
uganka 3, 4, 5 in obrat izreka `pitagora`); »diagonala razdeli pravokotnik na dva pravokotna trikotnika« (Primer 4;
dokazan je le račun za pravokotni trikotnik s katetama 3 in 5); »če zidar izmeri 5,83 m, so vogali na centimeter
natančno pravi« (praktična, približna trditev; dokazano je 5,825 < √34 < 5,835).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_8.PitagorovIzrek

open EuclideanGeometry Real

variable {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
  [NormedAddTorsor V P]

/-! ## Izrek in obrat -/

/-- Razlaga 3 in 7, Povzetek (Pitagorov izrek in obrat): v trikotniku ABC velja a² + b² = c² (a = |BC|, b = |AC|,
c = |AB|) natanko tedaj, ko je kot pri C pravi. Smer ⇐ je izrek, smer ⇒ obrat (zidarski trik); »če enakost ne
velja, kot ni pravi« je ista ekvivalenca. -/
theorem pitagora (A B C : P) :
    dist B C ^ 2 + dist A C ^ 2 = dist A B ^ 2 ↔ ∠ A C B = π / 2 := by
  rw [← dist_sq_eq_dist_sq_add_dist_sq_iff_angle_eq_pi_div_two A C B, dist_comm B C]
  constructor <;> intro h <;> nlinarith [h]

/-- Pomožna trditev za `example`-e: za vsaka a, b ≥ 0 obstaja pravokotni trikotnik v ℝ² s pravim kotom pri C in
katetama |BC| = a, |AC| = b (C = (0, 0), B = (a, 0), A = (0, b)). -/
theorem obstaja_pravokotni (a b : ℝ) (ha : 0 ≤ a) (hb : 0 ≤ b) :
    ∃ A B C : EuclideanSpace ℝ (Fin 2), ∠ A C B = π / 2 ∧ dist B C = a ∧ dist A C = b := by
  refine ⟨!₂[0, b], !₂[a, 0], !₂[0, 0], ?_, ?_, ?_⟩
  · rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [EuclideanSpace.inner_eq_star_dotProduct]
  · rw [EuclideanSpace.dist_eq]; simp [Real.sqrt_sq ha]
  · rw [EuclideanSpace.dist_eq]; simp [Real.sqrt_sq hb]

/-- Predpostavki `obstaja_pravokotni` se dajo izpolniti (a = 3, b = 4). -/
example : (0 : ℝ) ≤ 3 ∧ (0 : ℝ) ≤ 4 := by norm_num

/-- Razlaga 1, Povzetek in Preveri se 1: hipotenuza je najdaljša stranica: v pravokotnem trikotniku (pravi kot pri C,
A ≠ C, B ≠ C) je vsaka kateta krajša od hipotenuze. -/
theorem hipotenuza_najdaljsa (A B C : P) (h : ∠ A C B = π / 2) (hA : A ≠ C) (hB : B ≠ C) :
    dist B C < dist A B ∧ dist A C < dist A B := by
  have hp := (pitagora A B C).mpr h
  have ha : 0 < dist B C := dist_pos.mpr hB
  have hb : 0 < dist A C := dist_pos.mpr hA
  have hc : 0 ≤ dist A B := dist_nonneg
  constructor <;> nlinarith

/-- Predpostavke `hipotenuza_najdaljsa` se dajo izpolniti (trikotnik s katetama 3 in 4). -/
example : ∃ A B C : EuclideanSpace ℝ (Fin 2), ∠ A C B = π / 2 ∧ A ≠ C ∧ B ≠ C := by
  obtain ⟨A, B, C, h, ha, hb⟩ := obstaja_pravokotni 3 4 (by norm_num) (by norm_num)
  refine ⟨A, B, C, h, ?_, ?_⟩
  · intro e; rw [e, dist_self] at hb; norm_num at hb
  · intro e; rw [e, dist_self] at ha; norm_num at ha

/-- Razlaga 3, Premisli (»hipotenuza je bližnjica«): v nerazrojenem pravokotnem trikotniku je c < a + b, torej
a + b ≠ c. -/
theorem bliznjica (A B C : P) (h : ∠ A C B = π / 2) (hA : A ≠ C) (hB : B ≠ C) :
    dist A B < dist B C + dist A C := by
  have hp := (pitagora A B C).mpr h
  have ha : 0 < dist B C := dist_pos.mpr hB
  have hb : 0 < dist A C := dist_pos.mpr hA
  have hc : 0 ≤ dist A B := dist_nonneg
  nlinarith

/-- Predpostavke `bliznjica` se dajo izpolniti: glej `example` pri `hipotenuza_najdaljsa` (iste predpostavke). -/
example : ∃ A B C : EuclideanSpace ℝ (Fin 2), ∠ A C B = π / 2 ∧ A ≠ C ∧ B ≠ C := by
  obtain ⟨A, B, C, h, ha, hb⟩ := obstaja_pravokotni 3 4 (by norm_num) (by norm_num)
  refine ⟨A, B, C, h, ?_, ?_⟩
  · intro e; rw [e, dist_self] at hb; norm_num at hb
  · intro e; rw [e, dist_self] at ha; norm_num at ha

/-- Razlaga 4 in Povzetek (hipotenuza): v pravokotnem trikotniku je c = √(a² + b²). -/
theorem hipotenuza (A B C : P) (h : ∠ A C B = π / 2) :
    dist A B = Real.sqrt (dist B C ^ 2 + dist A C ^ 2) := by
  rw [(pitagora A B C).mpr h, Real.sqrt_sq dist_nonneg]

/-- Predpostavka `hipotenuza` se da izpolniti (katete 6 in 8). -/
example : ∃ A B C : EuclideanSpace ℝ (Fin 2), ∠ A C B = π / 2 := by
  obtain ⟨A, B, C, h, -⟩ := obstaja_pravokotni 6 8 (by norm_num) (by norm_num)
  exact ⟨A, B, C, h⟩

/-- Razlaga 5 in Povzetek (kateta): v pravokotnem trikotniku je a = √(c² − b²). -/
theorem kateta (A B C : P) (h : ∠ A C B = π / 2) :
    dist B C = Real.sqrt (dist A B ^ 2 - dist A C ^ 2) := by
  rw [← (pitagora A B C).mpr h, add_sub_cancel_right, Real.sqrt_sq dist_nonneg]

/-- Predpostavka `kateta` se da izpolniti (kateti 8 in 6, hipotenuza 10). -/
example : ∃ A B C : EuclideanSpace ℝ (Fin 2), ∠ A C B = π / 2 := by
  obtain ⟨A, B, C, h, -⟩ := obstaja_pravokotni 8 6 (by norm_num) (by norm_num)
  exact ⟨A, B, C, h⟩

/-- Pogoste napake in Preveri se 1 (izrek brez pravega kota): v enakostraničnem trikotniku s stranico s > 0
a² + b² ≠ c² (s² + s² ≠ s²); to je le algebra, da noben kot ni pravi, pove `enakostranicni_60` (vsi koti π/3). -/
theorem enakostranicni (s : ℝ) (hs : 0 < s) : s ^ 2 + s ^ 2 ≠ s ^ 2 := by
  intro h; nlinarith

/-- Predpostavka `enakostranicni` se da izpolniti (s = 4). -/
example : (0 : ℝ) < 4 := by norm_num

/-! ## Zakaj se tega učimo -/

/-- Zakaj se tega učimo (uganka z vrvjo): edina delitev 12 enot na tri cele stranice a ≤ b ≤ c, za katero je
a² + b² = c² (trikotnik s pravim kotom, glej `pitagora`), je 3, 4, 5. -/
theorem uganka (a b c : ℕ) (ha : 0 < a) (hab : a ≤ b) (hbc : b ≤ c) (hs : a + b + c = 12) :
    a ^ 2 + b ^ 2 = c ^ 2 ↔ a = 3 ∧ b = 4 ∧ c = 5 := by
  constructor
  · intro h
    have hc : c = 12 - a - b := by omega
    subst hc
    have : a ≤ 4 := by omega
    have : b ≤ 6 := by omega
    interval_cases a <;> interval_cases b <;> simp_all
  · rintro ⟨rfl, rfl, rfl⟩; norm_num

/-- Predpostavke `uganka` se dajo izpolniti (3, 4, 5). -/
example : 0 < 3 ∧ 3 ≤ 4 ∧ 4 ≤ 5 ∧ 3 + 4 + 5 = 12 := by norm_num

/-- Zakaj se tega učimo: trikotnika 4, 4, 4 in 2, 5, 5 nista pravokotna (16 + 16 ≠ 16, 4 + 25 ≠ 25). -/
theorem nista_pravokotna : (4 : ℝ) ^ 2 + 4 ^ 2 ≠ 4 ^ 2 ∧ (2 : ℝ) ^ 2 + 5 ^ 2 ≠ 5 ^ 2 := by norm_num

/-- Pomožno za `enakostranicni_60`: če so vse tri stranice 4, je kot pri srednjem oglišču π/3 (kosinusni izrek). -/
theorem kot_60 (A B C : P) (h1 : dist A B = 4) (h2 : dist B C = 4) (h3 : dist A C = 4) :
    ∠ A B C = π / 3 := by
  have h := dist_sq_eq_dist_sq_add_dist_sq_sub_two_mul_dist_mul_dist_mul_cos_angle A B C
  rw [h1, h3, dist_comm C B, h2] at h
  have hc : Real.cos (∠ A B C) = Real.cos (π / 3) := by rw [Real.cos_pi_div_three]; linarith
  exact Real.injOn_cos ⟨angle_nonneg _ _ _, angle_le_pi _ _ _⟩
    ⟨by positivity, by linarith [Real.pi_pos]⟩ hc

/-- Zakaj se tega učimo: v enakostraničnem trikotniku 4, 4, 4 merijo vsi trije koti 60° (π/3), po kosinusnem
izreku; noben ni pravi. -/
theorem enakostranicni_60 (A B C : P) (h1 : dist A B = 4) (h2 : dist B C = 4) (h3 : dist A C = 4) :
    ∠ B A C = π / 3 ∧ ∠ A B C = π / 3 ∧ ∠ A C B = π / 3 := by
  refine ⟨kot_60 B A C (by rw [dist_comm]; exact h1) h3 h2, kot_60 A B C h1 h2 h3,
    kot_60 A C B h3 (by rw [dist_comm]; exact h2) h1⟩

/-- Predpostavke `kot_60` in `enakostranicni_60` se dajo izpolniti: (0, 0), (4, 0), (2, 2√3) v ℝ². -/
example : ∃ A B C : EuclideanSpace ℝ (Fin 2), dist A B = 4 ∧ dist B C = 4 ∧ dist A C = 4 := by
  refine ⟨!₂[0, 0], !₂[4, 0], !₂[2, 2 * √3], ?_, ?_, ?_⟩ <;> rw [EuclideanSpace.dist_eq] <;>
    simp [Fin.sum_univ_two]
  all_goals
    rw [Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num), abs_of_nonneg (Real.sqrt_nonneg 3)]
    norm_num [Real.dist_eq, mul_pow]

/-- Zakaj se tega učimo, Razlaga 7 in Preveri se 5 (zidarji, okvir): 60² + 80² = 3600 + 6400 = 10 000 = 100²
in √10 000 = 100 (ne 60 + 80 = 140). -/
theorem zidarji :
    (60 : ℝ) ^ 2 + 80 ^ 2 = 3600 + 6400 ∧ (3600 : ℝ) + 6400 = 10000 ∧ (10000 : ℝ) = 100 ^ 2 ∧
      Real.sqrt 10000 = 100 ∧ (60 : ℝ) + 80 = 140 :=
  ⟨by norm_num, by norm_num, by norm_num,
    (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num), by norm_num⟩

/-- Zakaj se tega učimo in Razlaga 7: vogal z odmerjenima 60 cm in 80 cm ter razdaljo 100 cm med oznakama je
pravi (obrat izreka). -/
theorem zidarski_vogal (A B C : P) (ha : dist B C = 60) (hb : dist A C = 80) (hc : dist A B = 100) :
    ∠ A C B = π / 2 := by
  rw [← pitagora, ha, hb, hc]; norm_num

/-- Predpostavke `zidarski_vogal` se dajo izpolniti (pravokotni trikotnik s katetama 60 in 80; hipotenuza je
po `hipotenuza` √10 000 = 100). -/
example : ∃ A B C : EuclideanSpace ℝ (Fin 2), dist B C = 60 ∧ dist A C = 80 ∧ dist A B = 100 := by
  obtain ⟨A, B, C, h, ha, hb⟩ := obstaja_pravokotni 60 80 (by norm_num) (by norm_num)
  refine ⟨A, B, C, ha, hb, ?_⟩
  rw [hipotenuza A B C h, ha, hb]
  exact (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)

/-! ## Razlaga: številke -/

/-- Razlaga 2 (kvadrati nad 3, 4, 5 in tabela): 3² + 4² = 9 + 16 = 25 = 5², 36 + 64 = 100 = 10²,
25 + 144 = 169 = 13². -/
theorem tabela :
    (3 : ℝ) ^ 2 + 4 ^ 2 = 9 + 16 ∧ (9 : ℝ) + 16 = 25 ∧ (25 : ℝ) = 5 ^ 2 ∧
    (6 : ℝ) ^ 2 + 8 ^ 2 = 36 + 64 ∧ (36 : ℝ) + 64 = 100 ∧ (100 : ℝ) = 10 ^ 2 ∧
    (5 : ℝ) ^ 2 + 12 ^ 2 = 25 + 144 ∧ (25 : ℝ) + 144 = 169 ∧ (169 : ℝ) = 13 ^ 2 := by norm_num

/-- Razlaga 3, Premisli in Preveri se 1: pri 3, 4, 5 je 3 + 4 = 7 ≠ 5. -/
theorem vsota_dolzin : (3 : ℝ) + 4 = 7 ∧ (3 : ℝ) + 4 ≠ 5 := by norm_num

/-- Razlaga 4, Preveri: kateti 6 in 8 dasta c² = 100 in c = √100 = 10 (za vsak tak pravokotni trikotnik). -/
theorem razlaga4 (A B C : P) (h : ∠ A C B = π / 2) (ha : dist B C = 6) (hb : dist A C = 8) :
    dist A B ^ 2 = 100 ∧ dist A B = 10 := by
  have hp := (pitagora A B C).mpr h
  rw [ha, hb] at hp
  refine ⟨by linarith, ?_⟩
  rw [hipotenuza A B C h, ha, hb]
  exact (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)

/-- Predpostavke `razlaga4` se dajo izpolniti. -/
example : ∃ A B C : EuclideanSpace ℝ (Fin 2), ∠ A C B = π / 2 ∧ dist B C = 6 ∧ dist A C = 8 :=
  obstaja_pravokotni 6 8 (by norm_num) (by norm_num)

/-- Razlaga 5, Premisli: s hipotenuzo 10 in kateto 6 je druga kateta 8 (10² − 6² = 64), torej ne 12. -/
theorem razlaga5_premisli (A B C : P) (h : ∠ A C B = π / 2) (hc : dist A B = 10) (hb : dist A C = 6) :
    dist B C = 8 := by
  rw [kateta A B C h, hc, hb]
  calc Real.sqrt ((10 : ℝ) ^ 2 - 6 ^ 2) = Real.sqrt 64 := by norm_num
    _ = 8 := (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)

/-- Predpostavke `razlaga5_premisli` se dajo izpolniti (kateti 8 in 6). -/
example : ∃ A B C : EuclideanSpace ℝ (Fin 2), ∠ A C B = π / 2 ∧ dist A B = 10 ∧ dist A C = 6 := by
  obtain ⟨A, B, C, h, ha, hb⟩ := obstaja_pravokotni 8 6 (by norm_num) (by norm_num)
  refine ⟨A, B, C, h, ?_, hb⟩
  rw [hipotenuza A B C h, ha, hb]
  exact (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)

/-- Razlaga 5, Preveri: hipotenuza 13, kateta 12, druga kateta √(169 − 144) = √25 = 5. -/
theorem razlaga5_preveri (A B C : P) (h : ∠ A C B = π / 2) (hc : dist A B = 13) (hb : dist A C = 12) :
    dist B C = 5 := by
  rw [kateta A B C h, hc, hb]
  calc Real.sqrt ((13 : ℝ) ^ 2 - 12 ^ 2) = Real.sqrt (169 - 144) := by norm_num
    _ = Real.sqrt 25 := by norm_num
    _ = 5 := (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)

/-- Predpostavke `razlaga5_preveri` se dajo izpolniti (kateti 5 in 12). -/
example : ∃ A B C : EuclideanSpace ℝ (Fin 2), ∠ A C B = π / 2 ∧ dist A B = 13 ∧ dist A C = 12 := by
  obtain ⟨A, B, C, h, ha, hb⟩ := obstaja_pravokotni 5 12 (by norm_num) (by norm_num)
  refine ⟨A, B, C, h, ?_, hb⟩
  rw [hipotenuza A B C h, ha, hb]
  exact (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)

/-- Razlaga 6 in Povzetek: kateti 1 in 1 dasta c = √2, ki je iracionalen; c ≈ 1,41 (1,41 < √2 < 1,415). -/
theorem koren2 :
    Real.sqrt ((1 : ℝ) ^ 2 + 1 ^ 2) = Real.sqrt 2 ∧ Irrational (Real.sqrt 2) ∧
      (141 : ℝ) / 100 < Real.sqrt 2 ∧ Real.sqrt 2 < 1415 / 1000 :=
  ⟨by norm_num, irrational_sqrt_two, (Real.lt_sqrt (by norm_num)).mpr (by norm_num),
    (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)⟩

/-- Razlaga 6, Preveri: kateti 1 in 2 dasta c = √5, in ker je 4 < 5 < 9, je 2 < √5 < 3. -/
theorem koren5 : Real.sqrt ((1 : ℝ) ^ 2 + 2 ^ 2) = Real.sqrt 5 ∧ (2 : ℝ) < Real.sqrt 5 ∧ Real.sqrt 5 < 3 :=
  ⟨by norm_num, (Real.lt_sqrt (by norm_num)).mpr (by norm_num), (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)⟩

/-- Razlaga 7, Preveri in Preveri se 1: trikotnik 4, 5, 6 nima pravega kota (16 + 25 = 41 ≠ 36 = 6²); za vsak
trikotnik s temi stranicami (c = 6 nasproti C) noben kot ni pravi (pri A: 5² + 6² ≠ 4², pri B: 4² + 6² ≠ 5²). -/
theorem trikotnik456 (A B C : P) (ha : dist B C = 4) (hb : dist A C = 5) (hc : dist A B = 6) :
    (16 : ℝ) + 25 = 41 ∧ (6 : ℝ) ^ 2 = 36 ∧ ∠ A C B ≠ π / 2 ∧ ∠ B A C ≠ π / 2 ∧ ∠ A B C ≠ π / 2 := by
  refine ⟨by norm_num, by norm_num, ?_, ?_, ?_⟩
  · rw [ne_eq, ← pitagora, ha, hb, hc]; norm_num
  · rw [ne_eq, ← pitagora B C A, dist_comm C A, dist_comm B A, ha, hb, hc]; norm_num
  · rw [ne_eq, ← pitagora A C B, dist_comm C B, ha, hb, hc]; norm_num

/-- Predpostavke `trikotnik456` se dajo izpolniti: trikotnik s stranicami 4, 5, 6 v ℝ²
(C = (0, 0), B = (4, 0), A = (5/8, 15√7/8)). -/
example : ∃ A B C : EuclideanSpace ℝ (Fin 2), dist B C = 4 ∧ dist A C = 5 ∧ dist A B = 6 := by
  refine ⟨!₂[5 / 8, 15 * √7 / 8], !₂[4, 0], !₂[0, 0], ?_, ?_, ?_⟩ <;> rw [EuclideanSpace.dist_eq] <;>
    simp [Fin.sum_univ_two]
  all_goals
    rw [Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)]
    norm_num [Real.dist_eq, mul_pow, div_pow, abs_of_nonneg (Real.sqrt_nonneg 7)]

/-! ## Rešeni primeri -/

/-- Primer 1 (poševna letev): kateti 80 in 150; 80² = 6400, 150² = 22 500, c² = 28 900, c = √28 900 = 170, kar je
več od vsake katete. -/
theorem primer1 (A B C : P) (h : ∠ A C B = π / 2) (ha : dist B C = 80) (hb : dist A C = 150) :
    dist A B = 170 ∧ (80 : ℝ) < 170 ∧ (150 : ℝ) < 170 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  calc dist A B = Real.sqrt (80 ^ 2 + 150 ^ 2) := by rw [hipotenuza A B C h, ha, hb]
    _ = Real.sqrt (6400 + 22500) := by norm_num
    _ = Real.sqrt 28900 := by norm_num
    _ = 170 := (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)

/-- Predpostavke `primer1` se dajo izpolniti. -/
example : ∃ A B C : EuclideanSpace ℝ (Fin 2), ∠ A C B = π / 2 ∧ dist B C = 80 ∧ dist A C = 150 :=
  obstaja_pravokotni 80 150 (by norm_num) (by norm_num)

/-- Primer 2 (lestev): hipotenuza 2,5, kateta 0,7; 2,5² = 6,25, 0,7² = 0,49, b² = 6,25 − 0,49 = 5,76,
b = √5,76 = 2,4. -/
theorem primer2 (A B C : P) (h : ∠ A C B = π / 2) (hc : dist A B = 5 / 2) (ha : dist A C = 7 / 10) :
    dist B C = 24 / 10 := by
  calc dist B C = Real.sqrt ((5 / 2) ^ 2 - (7 / 10) ^ 2) := by rw [kateta A B C h, hc, ha]
    _ = Real.sqrt (625 / 100 - 49 / 100) := by norm_num
    _ = Real.sqrt (576 / 100) := by norm_num
    _ = 24 / 10 := (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)

/-- Predpostavke `primer2` se dajo izpolniti (kateti 2,4 in 0,7). -/
example : ∃ A B C : EuclideanSpace ℝ (Fin 2), ∠ A C B = π / 2 ∧ dist A B = 5 / 2 ∧ dist A C = 7 / 10 := by
  obtain ⟨A, B, C, h, ha, hb⟩ := obstaja_pravokotni (24 / 10) (7 / 10) (by norm_num) (by norm_num)
  refine ⟨A, B, C, h, ?_, hb⟩
  rw [hipotenuza A B C h, ha, hb]
  exact (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)

/-- Primer 3 (strešni tram): a = 9,6 : 2 = 4,8, b = 1,4; 4,8² = 23,04, 1,4² = 1,96, c² = 25, c = 5; tram
5 + 0,6 = 5,6. -/
theorem primer3 (A B C : P) (h : ∠ A C B = π / 2) (ha : dist B C = 96 / 10 / 2) (hb : dist A C = 14 / 10) :
    (96 : ℝ) / 10 / 2 = 48 / 10 ∧ dist A B = 5 ∧ dist A B + 6 / 10 = 56 / 10 := by
  have hc : dist A B = 5 := by
    calc dist A B = Real.sqrt ((48 / 10) ^ 2 + (14 / 10) ^ 2) := by
          rw [hipotenuza A B C h, ha, hb]; norm_num
      _ = Real.sqrt (2304 / 100 + 196 / 100) := by norm_num
      _ = Real.sqrt 25 := by norm_num
      _ = 5 := (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)
  exact ⟨by norm_num, hc, by rw [hc]; norm_num⟩

/-- Predpostavke `primer3` se dajo izpolniti. -/
example : ∃ A B C : EuclideanSpace ℝ (Fin 2), ∠ A C B = π / 2 ∧ dist B C = 96 / 10 / 2 ∧ dist A C = 14 / 10 :=
  obstaja_pravokotni (96 / 10 / 2) (14 / 10) (by norm_num) (by norm_num)

/-- Primer 4 (uta 3 m × 5 m): c² = 3² + 5² = 9 + 25 = 34; 25 < 34 < 36, zato 5 < √34 < 6, bližje 6
(√34 > 5,5); c ≈ 5,83 (5,825 < √34 < 5,835) in 5,83² = 33,9889. -/
theorem primer4 (A B C : P) (h : ∠ A C B = π / 2) (ha : dist B C = 3) (hb : dist A C = 5) :
    dist A B = Real.sqrt 34 ∧ (5 : ℝ) < Real.sqrt 34 ∧ Real.sqrt 34 < 6 ∧ (55 : ℝ) / 10 < Real.sqrt 34 ∧
      (5825 : ℝ) / 1000 < Real.sqrt 34 ∧ Real.sqrt 34 < 5835 / 1000 ∧ ((583 : ℝ) / 100) ^ 2 = 339889 / 10000 := by
  refine ⟨?_, (Real.lt_sqrt (by norm_num)).mpr (by norm_num), (Real.sqrt_lt' (by norm_num)).mpr (by norm_num),
    (Real.lt_sqrt (by norm_num)).mpr (by norm_num), (Real.lt_sqrt (by norm_num)).mpr (by norm_num),
    (Real.sqrt_lt' (by norm_num)).mpr (by norm_num), by norm_num⟩
  calc dist A B = Real.sqrt (3 ^ 2 + 5 ^ 2) := by rw [hipotenuza A B C h, ha, hb]
    _ = Real.sqrt (9 + 25) := by norm_num
    _ = Real.sqrt 34 := by norm_num

/-- Predpostavke `primer4` se dajo izpolniti. -/
example : ∃ A B C : EuclideanSpace ℝ (Fin 2), ∠ A C B = π / 2 ∧ dist B C = 3 ∧ dist A C = 5 :=
  obstaja_pravokotni 3 5 (by norm_num) (by norm_num)

/-! ## Pogoste napake -/

/-- Pogoste napake (hipotenuza na napačnem mestu, seštevanje pri kateti): če je 13 hipotenuza in 5 kateta, je
druga kateta 12, napačni √(5² + 13²) = √194 pa je večji od 13 (13² + 5² = 194). -/
theorem napacna_hipotenuza (A B C : P) (h : ∠ A C B = π / 2) (hc : dist A B = 13) (hb : dist A C = 5) :
    dist B C = 12 ∧ (13 : ℝ) ^ 2 + 5 ^ 2 = 194 ∧ (13 : ℝ) < Real.sqrt (5 ^ 2 + 13 ^ 2) := by
  refine ⟨?_, by norm_num, (Real.lt_sqrt (by norm_num)).mpr (by norm_num)⟩
  calc dist B C = Real.sqrt (13 ^ 2 - 5 ^ 2) := by rw [kateta A B C h, hc, hb]
    _ = Real.sqrt (169 - 25) := by norm_num
    _ = Real.sqrt 144 := by norm_num
    _ = 12 := (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)

/-- Predpostavke `napacna_hipotenuza` se dajo izpolniti (kateti 12 in 5). -/
example : ∃ A B C : EuclideanSpace ℝ (Fin 2), ∠ A C B = π / 2 ∧ dist A B = 13 ∧ dist A C = 5 := by
  obtain ⟨A, B, C, h, ha, hb⟩ := obstaja_pravokotni 12 5 (by norm_num) (by norm_num)
  refine ⟨A, B, C, h, ?_, hb⟩
  rw [hipotenuza A B C h, ha, hb]
  exact (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)

/-- Pogoste napake (pozabljen koren): iz c² = 100 sledi c = 10 (c ≥ 0), ne c = 100. -/
theorem pozabljen_koren (c : ℝ) (hc0 : 0 ≤ c) (h : c ^ 2 = 100) : c = 10 ∧ c ≠ 100 := by
  have : c = 10 := by nlinarith
  exact ⟨this, by rw [this]; norm_num⟩

/-- Predpostavki `pozabljen_koren` se dajo izpolniti (c = 10). -/
example : (0 : ℝ) ≤ 10 ∧ (10 : ℝ) ^ 2 = 100 := by norm_num

/-- Pogoste napake in Preveri se 3: √(5² + 12²) = √(25 + 144) = √169 = 13, ne 5 + 12 = 17 (17² = 289 ≠ 169). -/
theorem koren_vsote :
    Real.sqrt (5 ^ 2 + 12 ^ 2) = 13 ∧ Real.sqrt (5 ^ 2 + 12 ^ 2) ≠ 5 + 12 ∧ (17 : ℝ) ^ 2 = 289 := by
  have h : Real.sqrt (5 ^ 2 + 12 ^ 2) = 13 := by
    calc Real.sqrt (5 ^ 2 + 12 ^ 2) = Real.sqrt (25 + 144) := by norm_num
      _ = Real.sqrt 169 := by norm_num
      _ = 13 := (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)
  exact ⟨h, by rw [h]; norm_num, by norm_num⟩

/-! ## Drugače -/

/-- Na sliki: 3 · 3 = 9 in 4 · 4 = 16 ploščic, skupaj 25 = 5 · 5; pri katetah 1 in 1 sta 2 kvadratka, hipotenuza
√2 pa ni celo število (ni naravnega n z n² = 2). -/
theorem ploscice : (3 : ℕ) * 3 = 9 ∧ (4 : ℕ) * 4 = 16 ∧ 9 + 16 = 5 * 5 ∧ ¬ ∃ n : ℕ, n ^ 2 = 2 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  rintro ⟨n, hn⟩
  have : n ≤ 1 := by nlinarith
  interval_cases n <;> omega

/-- Bolj natančno (algebrski del dokaza): veliki kvadrat ima ploščino (a + b)² = a² + b² + 4 · (ab/2); če je
pokrit s štirimi trikotniki in kvadratom c², je (a + b)² = c² + 4 · (ab/2), zato a² + b² = c². -/
theorem dokaz_ploscine (a b c : ℝ) (h : (a + b) ^ 2 = c ^ 2 + 4 * (a * b / 2)) : a ^ 2 + b ^ 2 = c ^ 2 := by
  have e : (a + b) ^ 2 = a ^ 2 + b ^ 2 + 4 * (a * b / 2) := by ring
  linarith

/-- Predpostavka `dokaz_ploscine` se da izpolniti (a = 3, b = 4, c = 5). -/
example : ((3 : ℝ) + 4) ^ 2 = 5 ^ 2 + 4 * (3 * 4 / 2) := by norm_num

/-- Bolj natančno (pitagorejske trojice): 3, 4, 5; 5, 12, 13; 8, 15, 17; 7, 24, 25; 6, 8, 10; 60, 80, 100. -/
theorem trojice :
    3 ^ 2 + 4 ^ 2 = 5 ^ 2 ∧ 5 ^ 2 + 12 ^ 2 = 13 ^ 2 ∧ 8 ^ 2 + 15 ^ 2 = 17 ^ 2 ∧ 7 ^ 2 + 24 ^ 2 = 25 ^ 2 ∧
      6 ^ 2 + 8 ^ 2 = 10 ^ 2 ∧ 60 ^ 2 + 80 ^ 2 = 100 ^ 2 := by norm_num

/-- Bolj natančno: večkratnik pitagorejske trojice je spet pitagorejska trojica. -/
theorem veckratnik (a b c k : ℕ) (h : a ^ 2 + b ^ 2 = c ^ 2) : (k * a) ^ 2 + (k * b) ^ 2 = (k * c) ^ 2 := by
  calc (k * a) ^ 2 + (k * b) ^ 2 = k ^ 2 * (a ^ 2 + b ^ 2) := by ring
    _ = (k * c) ^ 2 := by rw [h]; ring

/-- Predpostavka `veckratnik` se da izpolniti (3, 4, 5). -/
example : 3 ^ 2 + 4 ^ 2 = 5 ^ 2 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 2: hipotenuza 13, kateta 5: b² = 169 − 25 = 144, b = 12; napačni odgovori: 13 − 5 = 8,
√(13² + 5²) = √194 ≈ 13,9 (13,9 < √194 < 13,95), 144 je b². -/
theorem kviz2 (A B C : P) (h : ∠ A C B = π / 2) (hc : dist A B = 13) (hb : dist A C = 5) :
    dist B C = 12 ∧ dist B C ^ 2 = 144 ∧ (13 : ℝ) - 5 = 8 ∧ (139 : ℝ) / 10 < Real.sqrt (13 ^ 2 + 5 ^ 2) ∧
      Real.sqrt (13 ^ 2 + 5 ^ 2) < 1395 / 100 := by
  have h12 := (napacna_hipotenuza A B C h hc hb).1
  refine ⟨h12, by rw [h12]; norm_num, by norm_num, (Real.lt_sqrt (by norm_num)).mpr (by norm_num),
    (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)⟩

/-- Predpostavke `kviz2` se dajo izpolniti: glej `example` pri `napacna_hipotenuza` (iste predpostavke). -/
example : ∃ A B C : EuclideanSpace ℝ (Fin 2), ∠ A C B = π / 2 ∧ dist A B = 13 ∧ dist A C = 5 := by
  obtain ⟨A, B, C, h, ha, hb⟩ := obstaja_pravokotni 12 5 (by norm_num) (by norm_num)
  refine ⟨A, B, C, h, ?_, hb⟩
  rw [hipotenuza A B C h, ha, hb]
  exact (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)

/-- Preveri se 4: A (6, 8, 10) je pravokoten (36 + 64 = 100 = 10²), B (5, 6, 8) ni (25 + 36 = 61 ≠ 64);
5 + 6 > 8. -/
theorem kviz4 :
    (6 : ℝ) ^ 2 + 8 ^ 2 = 10 ^ 2 ∧ (5 : ℝ) ^ 2 + 6 ^ 2 = 61 ∧ (8 : ℝ) ^ 2 = 64 ∧ (61 : ℝ) ≠ 64 ∧
      (5 : ℝ) + 6 > 8 := by norm_num

/-- Preveri se 4: za vsak trikotnik 5, 6, 8 (8 nasproti C) noben kot ni pravi (pri C: 25 + 36 ≠ 64, pri A:
6² + 8² ≠ 5², pri B: 5² + 8² ≠ 6²). -/
theorem kviz4_B (A B C : P) (ha : dist B C = 5) (hb : dist A C = 6) (hc : dist A B = 8) :
    ∠ A C B ≠ π / 2 ∧ ∠ B A C ≠ π / 2 ∧ ∠ A B C ≠ π / 2 := by
  refine ⟨?_, ?_, ?_⟩
  · rw [ne_eq, ← pitagora, ha, hb, hc]; norm_num
  · rw [ne_eq, ← pitagora B C A, dist_comm C A, dist_comm B A, ha, hb, hc]; norm_num
  · rw [ne_eq, ← pitagora A C B, dist_comm C B, ha, hb, hc]; norm_num

/-- Predpostavke `kviz4_B` se dajo izpolniti: trikotnik s stranicami 5, 6, 8 v ℝ²
(C = (0, 0), B = (5, 0), A = (−3/10, √3591/10)). -/
example : ∃ A B C : EuclideanSpace ℝ (Fin 2), dist B C = 5 ∧ dist A C = 6 ∧ dist A B = 8 := by
  refine ⟨!₂[-3 / 10, √3591 / 10], !₂[5, 0], !₂[0, 0], ?_, ?_, ?_⟩ <;> rw [EuclideanSpace.dist_eq] <;>
    simp [Fin.sum_univ_two]
  all_goals
    rw [Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)]
    norm_num [Real.dist_eq, mul_pow, div_pow, abs_of_nonneg (Real.sqrt_nonneg 3591)]

/-- Preveri se 5 (okvir 60 × 80): diagonala je 100; napačni odgovori: 60 + 80 = 140, c² = 10 000,
√(80² − 60²) = √2800 ≈ 52,9 (52,9 < √2800 < 52,95). -/
theorem kviz5 (A B C : P) (h : ∠ A C B = π / 2) (ha : dist B C = 60) (hb : dist A C = 80) :
    dist A B = 100 ∧ dist A B ^ 2 = 10000 ∧ Real.sqrt (80 ^ 2 - 60 ^ 2) = Real.sqrt 2800 ∧
      (529 : ℝ) / 10 < Real.sqrt 2800 ∧ Real.sqrt 2800 < 5295 / 100 := by
  have hc : dist A B = 100 := by
    rw [hipotenuza A B C h, ha, hb]
    exact (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)
  exact ⟨hc, by rw [hc]; norm_num, by norm_num, (Real.lt_sqrt (by norm_num)).mpr (by norm_num),
    (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)⟩

/-- Predpostavke `kviz5` se dajo izpolniti. -/
example : ∃ A B C : EuclideanSpace ℝ (Fin 2), ∠ A C B = π / 2 ∧ dist B C = 60 ∧ dist A C = 80 :=
  obstaja_pravokotni 60 80 (by norm_num) (by norm_num)

end Evklid.Lekcije.MAT_OS_8.PitagorovIzrek
