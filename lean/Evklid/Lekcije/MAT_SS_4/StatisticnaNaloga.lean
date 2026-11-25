/-
vir: content/lessons/MAT-SS-4/statisticna-naloga.md
sha256: a543d65aae4b47248065489aa1d597c5722c372c1a9fbeb8de2cb8cd553a4ec9
Ni v Leanu: pojmi in postopki brez računa (populacija, vzorec, reprezentativnost, vrste spremenljivk,
koraki statistične naloge, »povezanost ni vzrok«, tretja spremenljivka, omejitve; premisli, ustna vprašanja,
matura 1 in 2 c, kviza 1, 3 in 5 – besedni odgovori); ocene moči povezanosti z besedami (»močna«,
»skoraj na premici«) in odčitavanje z risb (dokazane so le monotonost podatkov in sredine sosednjih točk);
simulacija »Obdelava zbranih podatkov«. Korelacijski koeficient: dokazano le, da leži med −1 in 1.
Pari s decimalnimi vrednostmi so pri urejanju (permutacija) zapisani v desetinkah kot naravna števila.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.StatisticnaNaloga

/-! ## Uvod: murn kot termometer -/

/-- Uvod: tabela je urejena hkrati po temperaturi in po cvrkih (oboje narašča, pozitivna povezanost). -/
theorem murn_narasca : [14, 16, 17, 19, 21, 22, 24, 26].Pairwise (· < ·) ∧
    [18, 22, 23, 28, 31, 34, 37, 41].Pairwise (· < ·) := by decide

/-- Uvod: 30 cvrkov leži med 28 (19 °C) in 31 (21 °C); linearno vmes je 19 + 2·(30 − 28)/(31 − 28) ≈ 20 °C. -/
theorem murn_ocena : (28 : ℝ) < 30 ∧ (30 : ℝ) < 31 ∧
    |(19 : ℝ) + 2 * (30 - 28) / (31 - 28) - 20| < 0.5 := by norm_num [abs_lt]

/-! ## Razlaga 2: korelacijski koeficient je med −1 in 1 -/

/-- Razlaga 2 (Povzetek, Ponovitev): korelacijski koeficient
r = Σ(xᵢ − x̄)(yᵢ − ȳ) / √(Σ(xᵢ − x̄)² · Σ(yᵢ − ȳ)²) leži med −1 in 1 (neenakost Cauchy–Schwarz). -/
theorem korelacija_med (N : ℕ) (x y : Fin N → ℝ) (mx my : ℝ) :
    -1 ≤ (∑ i, (x i - mx) * (y i - my)) / √((∑ i, (x i - mx) ^ 2) * ∑ i, (y i - my) ^ 2) ∧
    (∑ i, (x i - mx) * (y i - my)) / √((∑ i, (x i - mx) ^ 2) * ∑ i, (y i - my) ^ 2) ≤ 1 := by
  have cs := Finset.sum_mul_sq_le_sq_mul_sq Finset.univ (fun i => x i - mx) (fun i => y i - my)
  have h := Real.abs_le_sqrt cs
  have h0 := Real.sqrt_nonneg ((∑ i, (x i - mx) ^ 2) * ∑ i, (y i - my) ^ 2)
  have : |(∑ i, (x i - mx) * (y i - my)) / √((∑ i, (x i - mx) ^ 2) * ∑ i, (y i - my) ^ 2)| ≤ 1 := by
    rw [abs_div, abs_of_nonneg h0]
    exact div_le_one_of_le₀ h h0
  exact abs_le.mp this

/-! ## Primer 1: višje je hladneje -/

/-- Primer 1, korak 1–2: temperature z višino padajo (negativna povezanost); padci 1,7; 1,7; 1,7; 2,2; 1,3 so
vsi med 1,3 in 2,2 °C. -/
theorem primer1_pada : (21.5 : ℝ) > 19.8 ∧ (19.8 : ℝ) > 18.1 ∧ (18.1 : ℝ) > 16.4 ∧ (16.4 : ℝ) > 14.2 ∧
    (14.2 : ℝ) > 12.9 ∧
    (21.5 : ℝ) - 19.8 = 1.7 ∧ (19.8 : ℝ) - 18.1 = 1.7 ∧ (18.1 : ℝ) - 16.4 = 1.7 ∧ (16.4 : ℝ) - 14.2 = 2.2 ∧
    (14.2 : ℝ) - 12.9 = 1.3 := by norm_num

/-- Primer 1, korak 3: na 1500 m pade temperatura za 21,5 − 12,9 = 8,6 °C, to je ≈ 0,57 °C na 100 m. -/
theorem primer1_padec : (1800 : ℝ) - 300 = 1500 ∧ (21.5 : ℝ) - 12.9 = 8.6 ∧
    |(8.6 : ℝ) / 15 - 0.57| < 0.005 := by norm_num [abs_lt]

/-- Primer 1, korak 4: 1350 m je na sredini med 1200 in 1500 m, ocena (16,4 + 14,2)/2 = 15,3 °C. -/
theorem primer1_ocena : ((1200 : ℝ) + 1500) / 2 = 1350 ∧ ((16.4 : ℝ) + 14.2) / 2 = 15.3 := by norm_num

/-! ## Primer 2: deževni in suhi dnevi -/

/-- Primer 2, korak 1: podatki razdeljeni v skupini; suhi dnevi urejeno 25…30, deževni 19, 21, 22, 23. -/
theorem primer2_skupini : List.Perm [27, 29, 25, 30, 28, 26] [25, 26, 27, 28, 29, 30] ∧
    List.Perm [21, 23, 19, 22] [19, 21, 22, 23] ∧
    [25, 26, 27, 28, 29, 30].Pairwise (· ≤ ·) ∧ [19, 21, 22, 23].Pairwise (· ≤ ·) := by decide

/-- Primer 2, koraki 2–4: x̄_suho = 165/6 = 27,5, Me = (27 + 28)/2 = 27,5; x̄_dež = 85/4 = 21,25,
Me = (21 + 22)/2 = 21,5; razlika 27,5 − 21,25 = 6,25 ≈ 6; najtoplejši deževni (23) < najhladnejši suhi (25). -/
theorem primer2 : ((27 : ℝ) + 29 + 25 + 30 + 28 + 26) / 6 = 27.5 ∧ ((27 : ℝ) + 28) / 2 = 27.5 ∧
    ((21 : ℝ) + 23 + 19 + 22) / 4 = 21.25 ∧ ((21 : ℝ) + 22) / 2 = 21.5 ∧ (27.5 : ℝ) - 21.25 = 6.25 ∧
    |(6.25 : ℝ) - 6| < 0.5 ∧ (23 : ℝ) < 25 := by norm_num [abs_lt]

/-! ## Primer 3: veter in prašni delci -/

/-- Primer 3, korak 3: urejeno po hitrosti vetra so pari (3; 62), (5; 55), (8; 48), (10; 50), (12; 38),
(15; 33), (18; 30), (22; 24) (permutacija danih parov). -/
theorem primer3_urejeno :
    List.Perm [(12, 38), (3, 62), (18, 30), (8, 48), (22, 24), (5, 55), (15, 33), (10, 50)]
      [(3, 62), (5, 55), (8, 48), (10, 50), (12, 38), (15, 33), (18, 30), (22, 24)] ∧
    [3, 5, 8, 10, 12, 15, 18, 22].Pairwise (· < ·) := by decide

/-- Primer 3, korak 4: PM10 pada povsod razen pri (10; 50), ki malo odstopa (48 < 50). -/
theorem primer3_pada : [62, 55, 48].Pairwise (· > ·) ∧ [50, 38, 33, 30, 24].Pairwise (· > ·) ∧ 48 < 50 := by
  decide

/-- Primer 3, korak 4 in premisli: sredini (62 + 55 + 48 + 50)/4 = 53,75 in (38 + 33 + 30 + 24)/4 = 31,25;
razlika 53,75 − 31,25 = 22,5 µg/m³. -/
theorem primer3 : ((62 : ℝ) + 55 + 48 + 50) / 4 = 53.75 ∧ ((38 : ℝ) + 33 + 30 + 24) / 4 = 31.25 ∧
    (53.75 : ℝ) - 31.25 = 22.5 := by norm_num

/-! ## Za maturo, naloga 2 -/

/-- Matura 2 a): urejeno po x so pari (x, 10y): (0; 65), (1; 72), (2; 70), (3; 68), (4; 71), (5; 75), (6; 74),
(8; 80), (10; 79), (12; 83) – permutacija tabele (y v desetinkah ure). -/
theorem matura2_urejeno :
    List.Perm [(2, 70), (0, 65), (5, 75), (8, 80), (3, 68), (10, 79), (1, 72), (6, 74), (4, 71), (12, 83)]
      [(0, 65), (1, 72), (2, 70), (3, 68), (4, 71), (5, 75), (6, 74), (8, 80), (10, 79), (12, 83)] ∧
    [0, 1, 2, 3, 4, 5, 6, 8, 10, 12].Pairwise (· < ·) := by decide

/-- Matura 2 b): ȳ₁ = (6,5 + 7,2 + 7,0 + 6,8 + 7,1)/5 = 34,6/5 = 6,92; ȳ₂ = (7,5 + 7,4 + 8,0 + 7,9 + 8,3)/5 =
39,1/5 = 7,82; razlika 7,82 − 6,92 = 0,9 ure = 0,9·60 = 54 minut. -/
theorem matura2b : (6.5 : ℝ) + 7.2 + 7.0 + 6.8 + 7.1 = 34.6 ∧ (34.6 : ℝ) / 5 = 6.92 ∧
    (7.5 : ℝ) + 7.4 + 8.0 + 7.9 + 8.3 = 39.1 ∧ (39.1 : ℝ) / 5 = 7.82 ∧ (7.82 : ℝ) - 6.92 = 0.9 ∧
    (0.9 : ℝ) * 60 = 54 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 2: pri 8 urah sonca je sredina med (7; 21) in (9; 23): (21 + 23)/2 = 22 °C; temperature
naraščajo (pozitivna povezanost). -/
theorem kviz2 : ((7 : ℝ) + 9) / 2 = 8 ∧ ((21 : ℝ) + 23) / 2 = 22 ∧
    [14, 17, 18, 21, 23, 25, 27].Pairwise (· < ·) := by
  refine ⟨by norm_num, by norm_num, by decide⟩

/-- Preveri se 4: sončni 120/4 = 30, oblačni 60/4 = 15, razlika 15; napačni: 120 − 60 = 60, 30 : 15 = 2. -/
theorem kviz4 : (30 : ℝ) + 34 + 26 + 30 = 120 ∧ (12 : ℝ) + 18 + 14 + 16 = 60 ∧ (120 : ℝ) / 4 = 30 ∧
    (60 : ℝ) / 4 = 15 ∧ (30 : ℝ) - 15 = 15 ∧ (120 : ℝ) - 60 = 60 ∧ (30 : ℝ) / 15 = 2 := by norm_num

end Evklid.Lekcije.MAT_SS_4.StatisticnaNaloga
