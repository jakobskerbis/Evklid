/-
vir: content/lessons/MAT-OS-8/uporaba-pitagorovega-izreka.md
sha256: 84793aa81ffc272c2c8285c90bda95f0565aa151d0e97d8aa84f38797ba3f59d
Model: splošna pravila so dokazana geometrijsko v evklidskem prostoru (točke v `P`, razdalja `dist`, kot `∠`;
pravi kot je ∠ = π/2), iz Mathlibovega Pitagorovega izreka
`EuclideanGeometry.dist_sq_eq_dist_sq_add_dist_sq_iff_angle_eq_pi_div_two`; zgledi, da se predpostavke dajo
izpolniti, so v ravnini `EuclideanSpace ℝ (Fin 2)`. Obrazca d = √(a² + b²) in v = √(b² − (a/2)²) nista ločeni
definiciji: sledita iz geometrijskih izrekov (`hipotenuza`, `kateta`, `visina`); računi s števili so v ℝ;
decimalna števila so točni ulomki. »≈ a« na k decimalk je |x − a| < ½·10⁻ᵏ. Lean ima
√x = 0 za x < 0; vse dokazane enakosti s korenom imajo nenegativen radikand (pri formuli za višino pogoj
a/2 ≤ b, ki velja v vsakem enakokrakem trikotniku).
Ni v Leanu: zgodovina (mezopotamske tablice, pisarji, naloga s tramom kot zgodba; dokazani so njeni računi);
risbe, skice in simulacija z lestvijo (opažanje, da višina na zidu pri večjem odmiku pada vse hitreje —
konkavnost √(L² − x²) — zahtevno, še ni dokazano); postopek »nariši skico, označi pravi kot, odgovori s stavkom
in enoto« (navodila); da diagonala razdeli pravokotnik na dva pravokotna trikotnika in da je pri lestvi, rampi,
toboganu ali zastavici pravi kot tam, kjer pravi lekcija (geometrija modela; dokazano je pravilo za pravokotni
trikotnik s pravim kotom v danem oglišču); »ravna pot je najkrajša« v splošnem (dokazano je d < a + b);
enote (m, cm, cm²) in »brez robov«; Preveri se 1 (razvrstitev nalog v besedah; dokazano je, da se hipotenuza
dobi s seštevanjem, kateta z odštevanjem kvadratov).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_8.UporabaPitagorovegaIzreka

open Real EuclideanGeometry

/-! ## Pomožno -/

/-- Pomožno: √x = a, če je a ≥ 0 in a² = x (za korake »√2500 = 50«). -/
theorem koren (x a : ℝ) (ha : 0 ≤ a) (h : a ^ 2 = x) : √x = a := by
  rw [← h, Real.sqrt_sq ha]

/-- Predpostavke `koren` se dajo izpolniti (a = 50, x = 2500). -/
example : (0 : ℝ) ≤ 50 ∧ (50 : ℝ) ^ 2 = 2500 := by norm_num

/-- Pomožno: |√x − a| < e, če je e > 0, a − e ≥ 0 in (a − e)² < x < (a + e)². -/
theorem blizu_koren (x a e : ℝ) (he : 0 < e) (h0 : 0 ≤ a - e) (h1 : (a - e) ^ 2 < x) (h2 : x < (a + e) ^ 2) :
    |√x - a| < e := by
  rw [abs_lt]
  constructor
  · have := (Real.lt_sqrt h0).2 h1; linarith
  · have := (Real.sqrt_lt' (by linarith : 0 < a + e)).2 h2; linarith

/-- Predpostavke `blizu_koren` se dajo izpolniti (√2 ≈ 1,41). -/
example : (0 : ℝ) < 0.005 ∧ (0 : ℝ) ≤ 1.41 - 0.005 ∧ ((1.41 : ℝ) - 0.005) ^ 2 < 2 ∧ (2 : ℝ) < (1.41 + 0.005) ^ 2 := by norm_num

/-! ## Splošna pravila (geometrija) -/

section Geometrija

variable {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P] [NormedAddTorsor V P]

/-- Pitagorov izrek v obliki lekcije: v trikotniku ABC s pravim kotom pri B je AC² = AB² + BC². -/
theorem pitagora (A B C : P) (h : ∠ A B C = π / 2) : dist A C ^ 2 = dist A B ^ 2 + dist B C ^ 2 := by
  have := (dist_sq_eq_dist_sq_add_dist_sq_iff_angle_eq_pi_div_two A B C).2 h
  rw [dist_comm C B] at this
  nlinarith

/-- Razlaga 2, 3 in Povzetek 4: hipotenuzo (nasproti pravega kota) dobiš s seštevanjem kvadratov:
AC = √(AB² + BC²); diagonala pravokotnika d = √(a² + b²) (pravi kot v oglišču B). -/
theorem hipotenuza (A B C : P) (h : ∠ A B C = π / 2) : dist A C = √(dist A B ^ 2 + dist B C ^ 2) := by
  rw [← pitagora A B C h, Real.sqrt_sq dist_nonneg]

/-- Razlaga 2 in Povzetek 4: kateto dobiš z odštevanjem: AB = √(AC² − BC²). -/
theorem kateta (A B C : P) (h : ∠ A B C = π / 2) : dist A B = √(dist A C ^ 2 - dist B C ^ 2) := by
  rw [pitagora A B C h, add_sub_cancel_right, Real.sqrt_sq dist_nonneg]

/-- Razlaga 5, korak 4 in Povzetek 5: v pravokotnem trikotniku (B ≠ A, B ≠ C) je hipotenuza najdaljša stranica. -/
theorem hipotenuza_najdaljsa (A B C : P) (h : ∠ A B C = π / 2) (hA : A ≠ B) (hC : B ≠ C) :
    dist A B < dist A C ∧ dist B C < dist A C := by
  have e := pitagora A B C h
  have h1 : 0 < dist A B := dist_pos.2 hA
  have h2 : 0 < dist B C := dist_pos.2 hC
  constructor <;> nlinarith [dist_nonneg (x := A) (y := C)]

/-- Bolj natančno: če je v enakokrakem trikotniku AC = BC in je D vznožje višine iz C (pravi kot pri D v obeh
trikotnikih ADC, BDC), je AD² = AC² − CD² = BC² − CD² = DB², torej AD = DB. -/
theorem visina_razpolovi (A B C D : P) (hk : dist A C = dist B C) (h1 : ∠ A D C = π / 2)
    (h2 : ∠ B D C = π / 2) : dist A D = dist D B := by
  have e1 := pitagora A D C h1
  have e2 := pitagora B D C h2
  have : dist A D ^ 2 = dist B D ^ 2 := by rw [hk] at e1; linarith
  rw [dist_comm D B]
  exact (pow_left_inj₀ dist_nonneg dist_nonneg two_ne_zero).1 this

/-- Razlaga 4 in Povzetek 3: višina enakokrakega trikotnika z osnovnico a = AB in krakom b = AC = BC, ki ima
vznožje D na osnovnici: CD = √(b² − (a/2)²) (višina razpolovi osnovnico). -/
theorem visina (A B C D : P) (hk : dist A C = dist B C) (h1 : ∠ A D C = π / 2) (h2 : ∠ B D C = π / 2)
    (hD : Wbtw ℝ A D B) : dist C D = √(dist A C ^ 2 - (dist A B / 2) ^ 2) := by
  have hr := visina_razpolovi A B C D hk h1 h2
  have hs := hD.dist_add_dist
  have hpol : dist A D = dist A B / 2 := by linarith
  have e := pitagora A D C h1
  rw [← hpol, e, add_sub_cancel_left, Real.sqrt_sq dist_nonneg, dist_comm]

end Geometrija

/-- Zgled za `pitagora`, `hipotenuza`, `kateta`, `hipotenuza_najdaljsa`, `visina_razpolovi` in `visina`:
enakokraki trikotnik A(−5, 0), B(5, 0), C(0, 12) z vznožjem višine D(0, 0) izpolni vse predpostavke
(pravi kot pri D v ADC in BDC, AC = BC, D med A in B, A ≠ D, D ≠ C). -/
example :
    let A : EuclideanSpace ℝ (Fin 2) := !₂[-5, 0]
    let B : EuclideanSpace ℝ (Fin 2) := !₂[5, 0]
    let C : EuclideanSpace ℝ (Fin 2) := !₂[0, 12]
    let D : EuclideanSpace ℝ (Fin 2) := !₂[0, 0]
    ∠ A D C = π / 2 ∧ ∠ B D C = π / 2 ∧ dist A C = dist B C ∧ Wbtw ℝ A D B ∧ A ≠ D ∧ D ≠ C := by
  intro A B C D
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_⟩
  · rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [A, C, D, PiLp.inner_apply, Fin.sum_univ_two]
  · rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [B, C, D, PiLp.inner_apply, Fin.sum_univ_two]
  · simp [A, B, C, EuclideanSpace.dist_eq, Fin.sum_univ_two]
  · refine ⟨1 / 2, ⟨by norm_num, by norm_num⟩, ?_⟩
    ext i; fin_cases i <;> simp [A, B, D, AffineMap.lineMap_apply] ; norm_num
  · intro h; have := congrArg (fun x : EuclideanSpace ℝ (Fin 2) => x 0) h; simp [A, D] at this
  · intro h; have := congrArg (fun x : EuclideanSpace ℝ (Fin 2) => x 1) h; simp [C, D] at this

/-! ## Obrazci (algebra) -/

/-- Razlaga 3 in Povzetek 2: diagonala kvadrata d = √(a² + a²) = √(2a²) = a√2 (a ≥ 0). -/
theorem diagonala_kvadrata (a : ℝ) (ha : 0 ≤ a) : √(a ^ 2 + a ^ 2) = √(2 * a ^ 2) ∧ √(2 * a ^ 2) = a * √2 := by
  refine ⟨by ring_nf, ?_⟩
  rw [Real.sqrt_mul (by norm_num), Real.sqrt_sq ha, mul_comm]

/-- Predpostavka `diagonala_kvadrata` se da izpolniti (a = 1). -/
example : (0 : ℝ) ≤ 1 := by norm_num

/-- Zakaj se tega učimo in Razlaga 3: diagonala kvadrata je √2 ≈ 1,41-krat daljša od stranice. -/
theorem tablica : |√2 - 1.41| < 0.005 := blizu_koren _ _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num)

/-- Razlaga 3, »Premisli«: pot po diagonali je krajša od poti ob dveh stranicah: √(a² + b²) < a + b (a, b > 0). -/
theorem diagonala_krajsa (a b : ℝ) (ha : 0 < a) (hb : 0 < b) : √(a ^ 2 + b ^ 2) < a + b := by
  rw [Real.sqrt_lt' (by linarith)]; nlinarith

/-- Predpostavke `diagonala_krajsa` se dajo izpolniti (a = 40, b = 30). -/
example : (0 : ℝ) < 40 ∧ (0 : ℝ) < 30 := by norm_num

/-- Razlaga 4 in Bolj natančno: višina enakostraničnega trikotnika √(a² − (a/2)²) = √(a² − a²/4) = √(3a²/4) = a√3/2
(a ≥ 0). -/
theorem enakostranicni (a : ℝ) (ha : 0 ≤ a) :
    √(a ^ 2 - (a / 2) ^ 2) = √(a ^ 2 - a ^ 2 / 4) ∧ √(a ^ 2 - a ^ 2 / 4) = √(3 * a ^ 2 / 4) ∧
      √(3 * a ^ 2 / 4) = a * √3 / 2 := by
  refine ⟨by ring_nf, by ring_nf, ?_⟩
  have h3 : (a * √3 / 2) ^ 2 = 3 * a ^ 2 / 4 := by
    rw [div_pow, mul_pow, Real.sq_sqrt (by norm_num)]; ring
  rw [← h3, Real.sqrt_sq (by positivity)]

/-- Predpostavka `enakostranicni` se da izpolniti (a = 30). -/
example : (0 : ℝ) ≤ 30 := by norm_num

/-- Razlaga 4 »Premisli« in Preveri se 3: pri enakem kraku b daljša osnovnica (0 ≤ a₁ < a₂ ≤ 2b) da manjšo
višino: √(b² − (a₂/2)²) < √(b² − (a₁/2)²). -/
theorem visina_pada (a₁ a₂ b : ℝ) (h0 : 0 ≤ a₁) (h12 : a₁ < a₂) (h2 : a₂ ≤ 2 * b) :
    √(b ^ 2 - (a₂ / 2) ^ 2) < √(b ^ 2 - (a₁ / 2) ^ 2) := by
  apply Real.sqrt_lt_sqrt
  · nlinarith
  · nlinarith

/-- Predpostavke `visina_pada` se dajo izpolniti (b = 13, a₁ = 10, a₂ = 24). -/
example : (0 : ℝ) ≤ 10 ∧ (10 : ℝ) < 24 ∧ (24 : ℝ) ≤ 2 * 13 := by norm_num

/-- Razlaga 4, tabela trojic (Korak za korakom): 3² + 4² = 5², 5² + 12² = 13², 8² + 15² = 17², 7² + 24² = 25². -/
theorem trojice : (3 : ℝ) ^ 2 + 4 ^ 2 = 5 ^ 2 ∧ (5 : ℝ) ^ 2 + 12 ^ 2 = 13 ^ 2 ∧ (8 : ℝ) ^ 2 + 15 ^ 2 = 17 ^ 2 ∧
    (7 : ℝ) ^ 2 + 24 ^ 2 = 25 ^ 2 := by norm_num

/-- Korak za korakom: veljajo tudi večkratniki trojic: (ka)² + (kb)² = (kc)², npr. 30, 40, 50 = 10·(3, 4, 5) in
15, 36, 39 = 3·(5, 12, 13). -/
theorem veckratniki (a b c k : ℝ) (h : a ^ 2 + b ^ 2 = c ^ 2) : (k * a) ^ 2 + (k * b) ^ 2 = (k * c) ^ 2 ∧
    ((10 : ℝ) * 3 = 30 ∧ (10 : ℝ) * 4 = 40 ∧ (10 : ℝ) * 5 = 50) ∧ ((3 : ℝ) * 5 = 15 ∧ (3 : ℝ) * 12 = 36 ∧
    (3 : ℝ) * 13 = 39) := by
  refine ⟨by linear_combination k ^ 2 * h, by norm_num, by norm_num⟩

/-- Predpostavka `veckratniki` se da izpolniti (3, 4, 5). -/
example : (3 : ℝ) ^ 2 + 4 ^ 2 = 5 ^ 2 := by norm_num

/-! ## Razlaga: računi -/

/-- Razlaga 1: napačno vstavljanje da √(10² + 13²) = √269 ≈ 16,4, kar je več od kraka 13 (višina mora biti
krajša). -/
theorem skusnjava : (10 : ℝ) ^ 2 + 13 ^ 2 = 269 ∧ |√269 - 16.4| < 0.05 ∧ 13 < √269 := by
  refine ⟨by norm_num, blizu_koren _ _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num), ?_⟩
  rw [Real.lt_sqrt (by norm_num)]; norm_num

/-- Razlaga 2 in Pogoste napake 1, 2: kateta je polovica osnovnice 10/2 = 5; v² = 13² − 5² = 169 − 25 = 144,
v = 12 cm < 13 cm. -/
theorem popravek : (10 : ℝ) / 2 = 5 ∧ (13 : ℝ) ^ 2 - 5 ^ 2 = 169 - 25 ∧ (169 : ℝ) - 25 = 144 ∧ √144 = 12 ∧
    (12 : ℝ) < 13 := by
  refine ⟨by norm_num, by norm_num, by norm_num, koren _ _ (by norm_num) (by norm_num), by norm_num⟩

/-- Razlaga 4, »Premisli«: krak 13, osnovnica 24: kateta 24/2 = 12, v = √(13² − 12²) = √25 = 5 cm. -/
theorem premisli_24 : (24 : ℝ) / 2 = 12 ∧ (13 : ℝ) ^ 2 - 12 ^ 2 = 25 ∧ √25 = 5 := by
  refine ⟨by norm_num, by norm_num, koren _ _ (by norm_num) (by norm_num)⟩

/-! ## Rešeni primeri -/

/-- Primer 1: d² = 40² + 30² = 1600 + 900 = 2500, d = √2500 = 50 m; 40 < 50 < 40 + 30 = 70; 70 − 50 = 20 m. -/
theorem primer1 : (40 : ℝ) ^ 2 + 30 ^ 2 = 1600 + 900 ∧ (1600 : ℝ) + 900 = 2500 ∧ √2500 = 50 ∧ (40 : ℝ) < 50 ∧
    (50 : ℝ) < 40 + 30 ∧ (40 : ℝ) + 30 - 50 = 20 := by
  refine ⟨by norm_num, by norm_num, koren _ _ (by norm_num) (by norm_num), by norm_num, by norm_num, by norm_num⟩

/-- Primer 2: kateta 30/2 = 15; v² = 39² − 15² = 1521 − 225 = 1296, v = √1296 = 36 cm; S = 30·36/2 = 540 cm²;
preizkus 15² + 36² = 225 + 1296 = 1521 = 39². -/
theorem primer2 : (30 : ℝ) / 2 = 15 ∧ (39 : ℝ) ^ 2 - 15 ^ 2 = 1521 - 225 ∧ (1521 : ℝ) - 225 = 1296 ∧ √1296 = 36 ∧
    (30 : ℝ) * 36 / 2 = 540 ∧ (15 : ℝ) ^ 2 + 36 ^ 2 = 225 + 1296 ∧ (225 : ℝ) + 1296 = 1521 ∧ (1521 : ℝ) = 39 ^ 2 := by
  refine ⟨by norm_num, by norm_num, by norm_num, koren _ _ (by norm_num) (by norm_num), by norm_num, by norm_num,
    by norm_num, by norm_num⟩

/-- Primer 3: a² = 2,6² − 1² = 6,76 − 1 = 5,76, a = √5,76 = 2,4 m (24² = 576); 6 − 2,4 = 3,6 m; 2,4 < 2,6. -/
theorem primer3 : (2.6 : ℝ) ^ 2 - 1 ^ 2 = 6.76 - 1 ∧ (6.76 : ℝ) - 1 = 5.76 ∧ √5.76 = 2.4 ∧ (24 : ℝ) ^ 2 = 576 ∧
    (6 : ℝ) - 2.4 = 3.6 ∧ (2.4 : ℝ) < 2.6 := by
  refine ⟨by norm_num, by norm_num, koren _ _ (by norm_num) (by norm_num), by norm_num, by norm_num, by norm_num⟩

/-- Primer 4: 105² = 11025, 68² = 4624, d² = 11025 + 4624 = 15649, d = √15649 ≈ 125,1 m; ker 125² = 15625 < 15649,
je d malo nad 125. -/
theorem primer4 : (105 : ℝ) ^ 2 = 11025 ∧ (68 : ℝ) ^ 2 = 4624 ∧ (11025 : ℝ) + 4624 = 15649 ∧
    |√15649 - 125.1| < 0.05 ∧ (125 : ℝ) ^ 2 = 15625 ∧ 125 < √15649 := by
  refine ⟨by norm_num, by norm_num, by norm_num, blizu_koren _ _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    by norm_num, ?_⟩
  rw [Real.lt_sqrt (by norm_num)]; norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 4: √(2,6² − 1²) = 2,4 ni 2,6 − 1 = 1,6; Pogoste napake 5: d² = 2500 še ni diagonala (2500 ≠ 50). -/
theorem napaka_dolzine : √((2.6 : ℝ) ^ 2 - 1 ^ 2) = 2.4 ∧ (2.6 : ℝ) - 1 = 1.6 ∧ √((2.6 : ℝ) ^ 2 - 1 ^ 2) ≠ 2.6 - 1 ∧
    (2500 : ℝ) ≠ 50 := by
  have h : √((2.6 : ℝ) ^ 2 - 1 ^ 2) = 2.4 := koren _ _ (by norm_num) (by norm_num)
  refine ⟨h, by norm_num, by rw [h]; norm_num, by norm_num⟩

/-- Pogoste napake 3: če iščeš kateto (krak oz. hipotenuza c, druga kateta k > 0) in kvadrata sešteješ, je
rezultat daljši od c; pravilno odštevanje da največ c. -/
theorem napaka_sestel (c k : ℝ) (hc : 0 ≤ c) (hk : 0 < k) : c < √(c ^ 2 + k ^ 2) ∧ √(c ^ 2 - k ^ 2) ≤ c := by
  constructor
  · rw [Real.lt_sqrt hc]; nlinarith
  · rw [Real.sqrt_le_iff]; exact ⟨hc, by nlinarith⟩

/-- Predpostavke `napaka_sestel` se dajo izpolniti (krak 10, polovica osnovnice 8). -/
example : (0 : ℝ) ≤ 10 ∧ (0 : ℝ) < 8 := by norm_num

/-! ## Drugače -/

/-- Kot zgodba (tram): 30 − 6 = 24; 30² − 24² = 900 − 576 = 324; √324 = 18. -/
theorem tram : (30 : ℝ) - 6 = 24 ∧ (30 : ℝ) ^ 2 - 24 ^ 2 = 900 - 576 ∧ (900 : ℝ) - 576 = 324 ∧ √324 = 18 := by
  refine ⟨by norm_num, by norm_num, by norm_num, koren _ _ (by norm_num) (by norm_num)⟩

/-- Korak za korakom (biljard): 30/2 = 15; v² = 30² − 15² = 900 − 225 = 675; 25² = 625 < 675 < 676 = 26², zato
je v tik pod 26; v ≈ 25,98 ≈ 26,0 cm; v < 30. -/
theorem biljard : (30 : ℝ) / 2 = 15 ∧ (30 : ℝ) ^ 2 = 900 ∧ (15 : ℝ) ^ 2 = 225 ∧ (900 : ℝ) - 225 = 675 ∧
    (25 : ℝ) ^ 2 = 625 ∧ (26 : ℝ) ^ 2 = 676 ∧ (25 < √675 ∧ √675 < 26) ∧ |√675 - 25.98| < 0.005 ∧
    |√675 - 26.0| < 0.05 ∧ √675 < 30 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ⟨?_, ?_⟩,
    blizu_koren _ _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    blizu_koren _ _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num), ?_⟩
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num

/-- Bolj natančno: pri a = 30 je v = 30√3/2 = 15√3 = √675 ≈ 25,98 cm. -/
theorem biljard_tocno : (30 : ℝ) * √3 / 2 = 15 * √3 ∧ 15 * √3 = √675 ∧ |15 * √3 - 25.98| < 0.005 := by
  have h : 15 * √3 = √675 := by
    rw [show (675 : ℝ) = 15 ^ 2 * 3 by norm_num, Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  refine ⟨by ring, h, ?_⟩
  rw [h]; exact blizu_koren _ _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num)

/-! ## Preveri se -/

/-- Preveri se 2: d = √(28² + 15²) = √(784 + 225) = √1009 ≈ 31,8 m; napačni: vsota 28 + 15 = 43, d² = 1009,
odštevanje √(784 − 225) = √559 ≈ 23,6; diagonala je daljša od 28. -/
theorem kviz2 : (28 : ℝ) ^ 2 + 15 ^ 2 = 784 + 225 ∧ (784 : ℝ) + 225 = 1009 ∧ |√1009 - 31.8| < 0.05 ∧
    (28 : ℝ) + 15 = 43 ∧ |√((784 : ℝ) - 225) - 23.6| < 0.05 ∧ 28 < √1009 := by
  refine ⟨by norm_num, by norm_num, blizu_koren _ _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num), by norm_num,
    blizu_koren _ _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num), ?_⟩
  rw [Real.lt_sqrt (by norm_num)]; norm_num

/-- Preveri se 4: osnovnica 16, krak 10: kateta 16/2 = 8; pravilno v² = 100 − 64 = 36, v = 6 cm; Lukov korak (3)
10² + 8² = 164 je napačen, √164 ≈ 12,8 > 10 (daljše od kraka). -/
theorem kviz4 : (16 : ℝ) / 2 = 8 ∧ (10 : ℝ) ^ 2 - 8 ^ 2 = 100 - 64 ∧ (100 : ℝ) - 64 = 36 ∧ √36 = 6 ∧
    (10 : ℝ) ^ 2 + 8 ^ 2 = 164 ∧ |√164 - 12.8| < 0.05 ∧ 10 < √164 := by
  refine ⟨by norm_num, by norm_num, by norm_num, koren _ _ (by norm_num) (by norm_num), by norm_num,
    blizu_koren _ _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num), ?_⟩
  rw [Real.lt_sqrt (by norm_num)]; norm_num

/-- Preveri se 5: √(3,4² − 1,6²) = √(11,56 − 2,56) = √9 = 3 m; napačni: 3,4 − 1,6 = 1,8, √(11,56 + 2,56) ≈ 3,8,
kar je daljše od drsne ploskve 3,4; 9 = 3² je kvadrat razdalje. -/
theorem kviz5 : (3.4 : ℝ) ^ 2 - 1.6 ^ 2 = 11.56 - 2.56 ∧ (11.56 : ℝ) - 2.56 = 9 ∧ √9 = 3 ∧ (3.4 : ℝ) - 1.6 = 1.8 ∧
    |√((11.56 : ℝ) + 2.56) - 3.8| < 0.05 ∧ 3.4 < √((11.56 : ℝ) + 2.56) ∧ (9 : ℝ) = 3 ^ 2 := by
  refine ⟨by norm_num, by norm_num, koren _ _ (by norm_num) (by norm_num), by norm_num,
    blizu_koren _ _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num), ?_, by norm_num⟩
  rw [Real.lt_sqrt (by norm_num)]; norm_num

end Evklid.Lekcije.MAT_OS_8.UporabaPitagorovegaIzreka
