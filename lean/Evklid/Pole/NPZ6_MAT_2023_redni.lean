/-
vir: content/exam-papers/NPZ6-MAT-2023-redni.json
sha256: fc4ff9092f679c70556e1ab50fa6e5f11bb2e0f67462ccaf6a7f833512247b98
Ni v Leanu:
- pisni postopki (podpisovanje, prenos, izposojanje pri 1a, 1b, 1c, 1d) kot postopek: dokazan je vsak
  zapisani korak kot račun in razvoj po desetiških enotah, ne sam algoritem;
- 2b, 2d: izbira modela iz besedila (kateri izraz »pove« ceno, kaj »zagotovo« velja) je razlaga besedila;
  dokazane so vrednosti vseh izrazov, da plačilo samo z bankovci (celi evri) ne more biti točno 45,60 € in da
  dve dopustni plačili dasta različno vračilo;
- 4a, 4b: branje slike (število razdelkov, 12 delov kroga) je iz risbe; dokazani so računi in ulomki;
  4b: barvanje (risba);
- 6a: vpis v diagram (risba); dokazana je razvrstitev vsakega števila v štiri območja;
- 7a, 7b, 7c, 7d, 7e: lega premic in meritve kotov in dolžin na sliki (70°, 115°, 25 mm, AB ≈ 27 mm) so
  meritve na risbi; dokazani so: 180° − 115° = 65°, 180° − 70° = 110°, 70° < 90°, 2,5 cm = 25 mm, splošno
  pravilo, da se nevzporedni premici v ravnini sekata, in da je poševna daljica med vzporednicama daljša od
  pravokotne; 7a »Dodatno potrdilo«: geometrijsko pravilo »če premica c seka premici a in b pod enakima
  kotoma (enakoležna kota), sta a in b vzporedni« je uporabljeno kot pravilo in ni dokazano;
- 9b: risanje stolpcev (risba); dokazana so števila kvadratkov;
- razlage napak v besedah (npr. »nesmiseln rezultat«, enota m namesto m², znak ∈ namesto ⊂); števila iz razlag
  napak, ki so račun, so dokazana.
Decimalna števila so zapisana v ℚ (decimalni zapis je v ℚ točen). Zaokrožitve so dokazane z `round`
(round x = ⌊x + 1/2⌋) in z mejo napake. Pri 8c je ℕ-odštevanje uporabljeno samo pri t ≤ 27.
-/
module

public import Mathlib

public section

namespace Evklid.Pole.NPZ6_MAT_2023_redni

/-! ## Naloga 1 -/

/-- Naloga 1a (odgovor): 5 687 + 948 = 6 635; zaokroženo na stotice 6 600 (napaka največ 50). -/
theorem n1a_odgovor :
    (5687 : ℤ) + 948 = 6635 ∧ round ((6635 : ℚ) / 100) * 100 = 6600 ∧ |(6635 : ℚ) - 6600| ≤ 50 := by
  refine ⟨by norm_num, ?_, ?_⟩
  · have h : round ((6635 : ℚ) / 100) = 66 := by
      rw [round_eq, Int.floor_eq_iff]; norm_num
    rw [h]; norm_num
  · rw [abs_le]; norm_num

/-- Naloga 1a, »Po korakih (pisno seštevanje)«: enice 7 + 8 = 15, desetice 8 + 4 + 1 = 13, stotice
6 + 9 + 1 = 16, tisočice 5 + 1 = 6; vsota 6 635 (razvoj po desetiških enotah). Števka stotic je 6; števka
desetic 6 635 je 3 < 5, zato navzdol na 6 600. -/
theorem n1a_pot1 :
    7 + 8 = 15 ∧ 8 + 4 + 1 = 13 ∧ 6 + 9 + 1 = 16 ∧ 5 + 1 = 6 ∧
    (5687 + 948 = 6635) ∧ (6635 / 100) % 10 = 6 ∧ (6635 / 10) % 10 = 3 ∧ 3 < 5 := by
  refine ⟨rfl, rfl, rfl, rfl, ?_, rfl, rfl, by norm_num⟩
  calc 5687 + 948 = 5 * 1000 + (6 + 9) * 100 + (8 + 4) * 10 + (7 + 8) := by norm_num
    _ = 5 * 1000 + (6 + 9) * 100 + (8 + 4 + 1) * 10 + 5 := by norm_num
    _ = (5 + 1) * 1000 + 6 * 100 + 3 * 10 + 5 := by norm_num
    _ = 6635 := by norm_num

/-- Naloga 1a, »Drugače: z dopolnjevanjem do okroglega števila in preizkusom«: 948 = 1 000 − 52,
5 687 + 1 000 = 6 687, 6 687 − 52 = 6 635; preizkus 6 635 − 948 = 5 687; 6 635 je od 6 600 oddaljeno 35, od
6 700 pa 65, zato je bližja stotica 6 600. -/
theorem n1a_pot2 :
    (5687 : ℤ) + 948 = 6635 ∧ (6635 : ℤ) - 948 = 5687 ∧
    (6635 : ℤ) - 6600 = 35 ∧ (6700 : ℤ) - 6635 = 65 ∧ (35 : ℤ) < 65 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  calc (5687 : ℤ) + 948 = 5687 + (1000 - 52) := by norm_num
    _ = (5687 + 1000) - 52 := by ring
    _ = 6687 - 52 := by norm_num
    _ = 6635 := by norm_num

/-- Naloga 1b (odgovor in pot »Pisno odštevanje z dopisanimi ničlami«): 12,4 = 12,400; koraki
10 − 8 = 2, 10 − 4 = 6 (4 = 3 + 1), 14 − 8 = 6 (8 = 7 + 1), 12 − 6 = 6 (6 = 5 + 1), 1 − 1 = 0;
12,400 − 5,738 = 6,662; preizkus 6,662 + 5,738 = 12,400 = 12,4. -/
theorem n1b :
    (12.4 : ℚ) = 12.400 ∧
    (10 - 8 = 2 ∧ 3 + 1 = 4 ∧ 10 - 4 = 6 ∧ 7 + 1 = 8 ∧ 14 - 8 = 6 ∧ 5 + 1 = 6 ∧ 12 - 6 = 6 ∧ 1 - 1 = 0) ∧
    (12.400 : ℚ) - 5.738 = 6.662 ∧ (6.662 : ℚ) + 5.738 = 12.400 := by
  refine ⟨by norm_num, by decide, ?_, by norm_num⟩
  calc (12.400 : ℚ) - 5.738 = 6 + 6 / 10 + 6 / 100 + 2 / 1000 := by norm_num
    _ = 6.662 := by norm_num

/-- Naloga 1b, napaka: prepis števk dá 6,738, kar ni rezultat (12,4 − 5,738 ≠ 6,738). -/
theorem n1b_napaka : (12.4 : ℚ) - 5.738 ≠ 6.738 := by norm_num

/-- Naloga 1c (odgovor): 3,6 · 2,47 = 8,892; zaokroženo na desetine 8,9 (napaka največ 0,05). -/
theorem n1c_odgovor :
    (3.6 : ℚ) * 2.47 = 8.892 ∧ (round ((8.892 : ℚ) * 10) : ℚ) / 10 = 8.9 ∧
    |(8.892 : ℚ) - 8.9| ≤ 0.05 := by
  refine ⟨by norm_num, ?_, ?_⟩
  · have h : round ((8.892 : ℚ) * 10) = 89 := by
      rw [round_eq, Int.floor_eq_iff]; norm_num
    rw [h]; norm_num
  · rw [abs_le]; norm_num

/-- Naloga 1c, »Po korakih (najprej brez vejic)«: 247 · 3 = 741 (zamaknjeno 7 410), 247 · 6 = 1 482,
7 410 + 1 482 = 8 892; 1 + 2 = 3 decimalke, zato 3,6 · 2,47 = 8,892; števka stotin 9 ≥ 5, navzgor 8,9. -/
theorem n1c_pot1 :
    247 * 3 = 741 ∧ 247 * 6 = 1482 ∧ 1 + 2 = 3 ∧ (8892 / 10) % 10 = 9 ∧ 5 ≤ 9 ∧
    (3.6 : ℚ) * 2.47 = 8.892 := by
  refine ⟨rfl, rfl, rfl, rfl, by norm_num, ?_⟩
  calc (3.6 : ℚ) * 2.47 = (36 * 247 : ℕ) / 10 ^ (1 + 2) := by norm_num
    _ = (247 * 30 + 247 * 6 : ℕ) / 10 ^ 3 := by norm_num
    _ = (7410 + 1482 : ℕ) / 10 ^ 3 := by norm_num
    _ = (8892 : ℕ) / 10 ^ 3 := by norm_num
    _ = 8.892 := by norm_num

/-- Naloga 1c, »Drugače: po delih in z oceno«: 3 · 2,47 = 7,41; 0,6 · 2,47 = 1,482; 7,41 + 1,482 = 8,892;
ocena 3,5 · 2,5 = 8,75; 8,892 leži med 8,8 in 8,9, do 8,9 manjka 0,008. -/
theorem n1c_pot2 :
    (3.6 : ℚ) * 2.47 = 8.892 ∧ (3.5 : ℚ) * 2.5 = 8.75 ∧ (8.8 : ℚ) < 8.892 ∧ (8.892 : ℚ) < 8.9 ∧
    (8.9 : ℚ) - 8.892 = 0.008 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  calc (3.6 : ℚ) * 2.47 = 3 * 2.47 + 0.6 * 2.47 := by ring
    _ = 7.41 + 1.482 := by norm_num
    _ = 8.892 := by norm_num

/-- Naloga 1c, napaka: 889,2 ni zmnožek (3,6 · 2,47 ≠ 889,2); tudi 88,92 ni. -/
theorem n1c_napaka : (3.6 : ℚ) * 2.47 ≠ 889.2 ∧ (3.6 : ℚ) * 2.47 ≠ 88.92 := by norm_num

/-- Naloga 1d (odgovor in pot »Pisno deljenje«): 25 = 4 · 6 + 1, 19 = 3 · 6 + 1, 12 = 2 · 6 + 0;
25,92 : 6 = 4,32; preizkus 4,32 · 6 = 25,92. -/
theorem n1d :
    (25 = 4 * 6 + 1 ∧ 19 = 3 * 6 + 1 ∧ 12 = 2 * 6 + 0) ∧ (25.92 : ℚ) / 6 = 4.32 ∧ (4.32 : ℚ) * 6 = 25.92 := by
  refine ⟨by decide, ?_, by norm_num⟩
  calc (25.92 : ℚ) / 6 = (24 + 1.92) / 6 := by norm_num
    _ = 4 + 1.92 / 6 := by ring
    _ = 4 + (1.8 + 0.12) / 6 := by norm_num
    _ = 4 + 0.3 + 0.02 := by ring
    _ = 4.32 := by norm_num

/-- Naloga 1d, napaka: 432 ni količnik; ocena 24 : 6 = 4. -/
theorem n1d_napaka : (25.92 : ℚ) / 6 ≠ 432 ∧ (24 : ℚ) / 6 = 4 := by norm_num

/-! ## Naloga 2 -/

/-- Naloga 2a (odgovor, ↔): cena c ene žogice izpolnjuje 6 · c = 5,70 natanko tedaj, ko je c = 0,95. -/
theorem n2a_odgovor (c : ℚ) : 6 * c = 5.70 ↔ c = 0.95 := by
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Naloga 2a, »Ceno škatlice razdeli na žogice«: 5,70 : 6 = 0,95; v centih 570 : 6 = 95; preizkus
6 · 0,95 = 5,70. -/
theorem n2a_pot : (5.70 : ℚ) / 6 = 0.95 ∧ 570 / 6 = 95 ∧ (95 : ℚ) / 100 = 0.95 ∧ (6 : ℚ) * 0.95 = 5.70 := by
  refine ⟨by norm_num, rfl, by norm_num, by norm_num⟩

/-- Naloga 2a, napaka: deljenje s številom škatlic ne dá cene žogice (5,70 : 8 ≠ 0,95). -/
theorem n2a_napaka : (5.70 : ℚ) / 8 ≠ 0.95 := by norm_num

/-- Naloga 2b, »Kaj pomeni vsak izraz«: C = 8 · 5,70 je 8-krat cena škatlice; A = 8 · 6 · 5,70 je 48 žogic
po 5,70 €; B = 5,70 : 6 · 8 je cena 8 žogic (8-krat cena žogice); D = 8 + 6 + 5,70. Vrednosti A, B, D se
razlikujejo od C. -/
theorem n2b :
    (8 : ℚ) * 6 * 5.70 = 48 * 5.70 ∧ (5.70 : ℚ) / 6 * 8 = 8 * 0.95 ∧
    (8 : ℚ) * 6 * 5.70 ≠ 8 * 5.70 ∧ (5.70 : ℚ) / 6 * 8 ≠ 8 * 5.70 ∧ (8 : ℚ) + 6 + 5.70 ≠ 8 * 5.70 := by
  norm_num

/-- Naloga 2c (odgovor in pot »Po korakih«): 8 · 5 = 40, 8 · 0,70 = 5,60, 40 + 5,60 = 45,60. -/
theorem n2c_pot1 : (8 : ℚ) * 5.70 = 45.60 := by
  calc (8 : ℚ) * 5.70 = 8 * 5 + 8 * 0.70 := by ring
    _ = 40 + 5.60 := by norm_num
    _ = 45.60 := by norm_num

/-- Naloga 2c, »Drugače: prek cene ene žogice«: 8 · 6 = 48 žogic, 48 · 0,95 = 48 − 48 · 0,05 = 48 − 2,40 =
45,60; ocena: 8 · 6 = 48 in rezultat je malo pod 48. -/
theorem n2c_pot2 : 8 * 6 = 48 ∧ (48 : ℚ) * 0.95 = 45.60 ∧ (45.60 : ℚ) < 48 := by
  refine ⟨rfl, ?_, by norm_num⟩
  calc (48 : ℚ) * 0.95 = 48 - 48 * 0.05 := by ring
    _ = 48 - 2.40 := by norm_num
    _ = 45.60 := by norm_num

/-- Naloga 2c, napaka: 8 · 5,70 ≠ 40,70 (pozabljen 8 · 0,70 = 5,60). -/
theorem n2c_napaka : (8 : ℚ) * 5.70 ≠ 40.70 ∧ (8 : ℚ) * 0.70 = 5.60 := by norm_num

/-- Naloga 2d, A in B: z bankovcem za 50 € je vračilo 50 − 45,60 = 4,40, s tremi bankovci za 20 € je
3 · 20 − 45,60 = 14,40, z bankovcem za 100 € je 100 − 45,60 = 54,40. -/
theorem n2d_vracila :
    (50 : ℚ) - 45.60 = 4.40 ∧ (3 * 20 : ℚ) - 45.60 = 14.40 ∧ (100 : ℚ) - 45.60 = 54.40 := by norm_num

/-- Naloga 2d, C: bankovci so vredni cele evre, zato nobena vsota bankovcev (celo število evrov) ni 45,60 €. -/
theorem n2d_ni_tocno (s : ℤ) : (s : ℚ) ≠ 45.60 := by
  intro h
  have h1 : (s : ℚ) * 5 = 228 := by rw [h]; norm_num
  have h2 : s * 5 = 228 := by exact_mod_cast h1
  omega

/-- Naloga 2d, D: dve plačili samo z bankovci, ki obe pokrijeta 45,60 € (50 € in 3 · 20 € = 60 €), dasta
različno vračilo, zato vračila iz podatkov ne moremo izračunati. -/
theorem n2d_ne_moremo :
    ∃ p q : ℤ, (45.60 : ℚ) ≤ p ∧ (45.60 : ℚ) ≤ q ∧ (p : ℚ) - 45.60 ≠ q - 45.60 :=
  ⟨50, 3 * 20, by norm_num, by norm_num, by norm_num⟩

/-! ## Naloga 3 -/

/-- Naloga 3a (odgovor B in pot »Zapiši z decimalno vejico in primerjaj razdalje«): 37 desetin je 3,7;
razdalje 3,7 − 0,37 = 3,33, 3,70 − 3,69 = 0,01, 3,8 − 3,7 = 0,1, 37 je desetkrat 3,7; najbližje je 3,69.
Možnost A je 37 stotin. -/
theorem n3a :
    (37 : ℚ) / 10 = 3.7 ∧ (3.7 : ℚ) - 0.37 = 3.33 ∧ (3.70 : ℚ) - 3.69 = 0.01 ∧ (3.8 : ℚ) - 3.7 = 0.1 ∧
    (37 : ℚ) = 10 * 3.7 ∧ (37 : ℚ) / 100 = 0.37 ∧
    (∀ x ∈ ({0.37, 3.8, 37} : Finset ℚ), |(3.69 : ℚ) - 3.7| < |x - 3.7|) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  intro x hx
  simp only [Finset.mem_insert, Finset.mem_singleton] at hx
  rcases hx with rfl | rfl | rfl <;> norm_num [abs_of_neg, abs_of_pos]

/-- Naloga 3b (odgovor B in pot »Decimalni ulomek zapiši kot decimalno število«): 204/100 = 2,04; razdalje
2,40 − 2,04 = 0,36, 2,04 − 2 = 0,04, 2,10 − 2,04 = 0,06, 20,4 je desetkrat 2,04 (= 204 : 10); najbližje je 2. -/
theorem n3b :
    (204 : ℚ) / 100 = 2.04 ∧ (2.40 : ℚ) - 2.04 = 0.36 ∧ (2.04 : ℚ) - 2 = 0.04 ∧ (2.10 : ℚ) - 2.04 = 0.06 ∧
    (20.4 : ℚ) = 10 * 2.04 ∧ (204 : ℚ) / 10 = 20.4 ∧
    (∀ x ∈ ({2.4, 2.1, 20.4} : Finset ℚ), |(2 : ℚ) - 2.04| < |x - 2.04|) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  intro x hx
  simp only [Finset.mem_insert, Finset.mem_singleton] at hx
  rcases hx with rfl | rfl | rfl <;> norm_num [abs_of_neg, abs_of_pos]

/-- Naloga 3c (odgovor B in pot »Določi mesto števke«): v 61 724 je števka stotic 7; v 4 078 je 7 števka
desetic, v 27 105 števka tisočic (in ne stotic); 0,07 je 7 stotink. -/
theorem n3c :
    (61724 / 100) % 10 = 7 ∧ (4078 / 10) % 10 = 7 ∧ (4078 / 100) % 10 ≠ 7 ∧
    (27105 / 1000) % 10 = 7 ∧ (27105 / 100) % 10 ≠ 7 ∧ (0.07 : ℚ) = 7 / 100 := by
  refine ⟨rfl, rfl, by decide, rfl, by decide, by norm_num⟩

/-- Naloga 3d (odgovor B in pot »Razstavi po desetiških enotah«): 6 048 = 6 · 1 000 + 0 · 100 + 4 · 10 + 8 =
6 · 10³ + 4 · 10 + 8; A = 6 408, C = 60 048, D = 6 480. -/
theorem n3d :
    6048 = 6 * 1000 + 0 * 100 + 4 * 10 + 8 ∧ 10 ^ 3 = 1000 ∧ 10 ^ 2 = 100 ∧ 10 ^ 4 = 10000 ∧
    6 * 10 ^ 3 + 4 * 10 + 8 = 6048 ∧
    6 * 10 ^ 3 + 4 * 10 ^ 2 + 8 = 6408 ∧ 6 * 10 ^ 4 + 4 * 10 + 8 = 60048 ∧
    6 * 10 ^ 3 + 4 * 10 ^ 2 + 8 * 10 = 6480 := by
  decide

/-! ## Naloga 4 -/

/-- Naloga 4a (odgovor): oznake so 0,4 + k · 0,02; okvirček (k = 3) je 0,46 = 46/100 = 23/50. -/
theorem n4a_odgovor : (0.4 : ℚ) + 3 * 0.02 = 0.46 ∧ (0.46 : ℚ) = 46 / 100 ∧ (46 : ℚ) / 100 = 23 / 50 := by
  norm_num

/-- Naloga 4a, »Po korakih: velikost enega razdelka«: 0,5 − 0,4 = 0,1 = 10 stotin, 10 : 5 = 2 stotini = 0,02;
0,4 + 3 · 0,02 = 0,4 + 0,06 = 0,46; okrajšano z 2: 23/50. -/
theorem n4a_pot1 :
    (0.5 : ℚ) - 0.4 = 0.1 ∧ (0.1 : ℚ) = 10 / 100 ∧ 10 / 5 = 2 ∧ (2 : ℚ) / 100 = 0.02 ∧
    (0.4 : ℚ) + 3 * 0.02 = 0.46 ∧ (46 : ℚ) / 100 = (23 * 2) / (50 * 2) := by
  refine ⟨by norm_num, by norm_num, rfl, by norm_num, ?_, by norm_num⟩
  calc (0.4 : ℚ) + 3 * 0.02 = 0.4 + 0.06 := by norm_num
    _ = 0.46 := by norm_num

/-- Naloga 4a, »Drugače: zapiši vse oznake s stotinami«: oznake 40, 42, 44, 46, 48, 50 stotin (pet enakih
korakov); tretja za 0,40 je 0,46; preizkus 0,46 + 2 · 0,02 = 0,50. -/
theorem n4a_pot2 :
    (List.range 6).map (fun k => 40 + 2 * k) = [40, 42, 44, 46, 48, 50] ∧ 40 + 2 * 3 = 46 ∧
    (0.46 : ℚ) + 2 * 0.02 = 0.50 := by
  refine ⟨by decide, rfl, by norm_num⟩

/-- Naloga 4a, napaka: z desetimi razdelki po 0,01 bi dobili 0,43, kar ni 0,46. -/
theorem n4a_napaka : (0.4 : ℚ) + 3 * 0.01 = 0.43 ∧ (0.43 : ℚ) ≠ 0.46 := by norm_num

/-- Naloga 4b (odgovor in pot »Po korakih: preštej dele«): krog z 12 deli; 1/4 je 12 : 4 = 3 deli, 3/4 je
3 · 3 = 9 delov; nepobarvanih 12 − 9 = 3, to je 3/12 = 1/4 (okrajšano s 3). -/
theorem n4b_pot1 :
    12 / 4 = 3 ∧ 3 * 3 = 9 ∧ (9 : ℚ) / 12 = 3 / 4 ∧ 12 - 9 = 3 ∧ (3 : ℚ) / 12 = 1 / 4 := by
  refine ⟨rfl, rfl, by norm_num, rfl, by norm_num⟩

/-- Naloga 4b, »Drugače: od celote«: 4/4 − 3/4 = 1/4; vsaka četrtina ima 3 dele. -/
theorem n4b_pot2 : (4 : ℚ) / 4 - 3 / 4 = 1 / 4 ∧ (4 : ℚ) / 4 = 1 ∧ 12 / 4 = 3 := by
  refine ⟨by norm_num, by norm_num, rfl⟩

/-- Naloga 4b, napaka: 3 deli od 12 so 1/4 kroga, ne 3/4. -/
theorem n4b_napaka : (3 : ℚ) / 12 ≠ 3 / 4 := by norm_num

/-- Naloga 4c (odgovor, prvi del): 3/5 od 45 € je 27 €. -/
theorem n4c_odgovor_del : (3 : ℚ) / 5 * 45 = 27 := by norm_num

/-- Naloga 4c (odgovor, drugi del, ↔): če je 2/7 poti dolgih 16 km, je pot x dolga natanko 56 km. -/
theorem n4c_odgovor_pot (x : ℚ) : 2 / 7 * x = 16 ↔ x = 56 := by
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Naloga 4c, »Po korakih: najprej en del«: 45 : 5 = 9, 3 · 9 = 27; 16 : 2 = 8, 7 · 8 = 56. -/
theorem n4c_pot1 : (3 : ℚ) / 5 * 45 = 27 ∧ (2 : ℚ) / 7 * 56 = 16 := by
  constructor
  · calc (3 : ℚ) / 5 * 45 = 3 * (45 / 5) := by ring
      _ = 3 * 9 := by norm_num
      _ = 27 := by norm_num
  · calc (2 : ℚ) / 7 * 56 = 2 / 7 * (7 * (16 / 2)) := by norm_num
      _ = 2 / 7 * (7 * 8) := by norm_num
      _ = 16 := by norm_num

/-- Naloga 4c, »Drugače: s trakom in preizkusom«: 9 + 9 + 9 = 27; en del 16 : 2 = 8, sedem delov 56;
preizkus 56 : 7 · 2 = 16. -/
theorem n4c_pot2 : 45 / 5 = 9 ∧ 9 + 9 + 9 = 27 ∧ 16 / 2 = 8 ∧ 7 * 8 = 56 ∧ 56 / 7 * 2 = 16 := by
  decide

/-- Naloga 4c, napaka: 2/7 od 16 je manj kot 16, pot pa mora biti daljša od 16 km. -/
theorem n4c_napaka : (2 : ℚ) / 7 * 16 < 16 ∧ (16 : ℚ) < 56 := by norm_num

/-! ## Naloga 5 -/

/-- Naloga 5a (odgovor in pot »Po korakih: obseg pravokotnika«): o = 2 · 48 + 2 · 35 = 96 + 70 = 166 m. -/
theorem n5a_pot1 : 2 * 48 + 2 * 35 = 166 := by
  calc 2 * 48 + 2 * 35 = 96 + 70 := by norm_num
    _ = 166 := by norm_num

/-- Naloga 5a, »Drugače: seštej vse štiri stranice«: 48 + 35 + 48 + 35 = 83 + 83 = 166 in
2 · (48 + 35) = 2 · 83 = 166. -/
theorem n5a_pot2 : 48 + 35 + 48 + 35 = 166 ∧ 2 * (48 + 35) = 166 := by
  constructor
  · calc 48 + 35 + 48 + 35 = 83 + 83 := by norm_num
      _ = 166 := by norm_num
  · calc 2 * (48 + 35) = 2 * 83 := by norm_num
      _ = 166 := by norm_num

/-- Naloga 5a, napaka: 48 + 35 = 83 je le polovica ograje. -/
theorem n5a_napaka : 48 + 35 = 83 ∧ 2 * 83 = 166 := by decide

/-- Naloga 5b (odgovor in pot »Po korakih: ploščina pravokotnika«): 48 · 35 = 48 · 30 + 48 · 5 =
1 440 + 240 = 1 680 m². -/
theorem n5b_pot1 : 48 * 35 = 1680 := by
  calc 48 * 35 = 48 * 30 + 48 * 5 := by norm_num
    _ = 1440 + 240 := by norm_num
    _ = 1680 := by norm_num

/-- Naloga 5b, »Drugače: z okroglim številom«: 50 · 35 = 1 750, 2 · 35 = 70, 1 750 − 70 = 1 680. -/
theorem n5b_pot2 : (48 : ℤ) * 35 = 1680 := by
  calc (48 : ℤ) * 35 = 50 * 35 - 2 * 35 := by norm_num
    _ = 1750 - 70 := by norm_num
    _ = 1680 := by norm_num

/-- Naloga 5c (odgovor, ↔): kvadrat s stranico a ima obseg 166 m natanko tedaj, ko je a = 41,5 m. -/
theorem n5c_odgovor (a : ℚ) : 4 * a = 2 * 48 + 2 * 35 ↔ a = 41.5 := by
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Naloga 5c, »Po korakih: obseg razdeli na štiri«: 166 : 4 = 41,5 (16 : 4 = 4, 6 = 1 · 4 + 2,
20 : 4 = 5); preizkus 4 · 41,5 = 166. -/
theorem n5c_pot1 :
    (166 : ℚ) / 4 = 41.5 ∧ 16 / 4 = 4 ∧ 6 = 1 * 4 + 2 ∧ 20 / 4 = 5 ∧ (4 : ℚ) * 41.5 = 166 := by
  refine ⟨?_, rfl, rfl, rfl, by norm_num⟩
  calc (166 : ℚ) / 4 = (160 + 6) / 4 := by norm_num
    _ = 40 + (4 + 2) / 4 := by ring
    _ = 40 + 1 + 20 / 40 := by norm_num
    _ = 41.5 := by norm_num

/-- Naloga 5c, »Drugače: s polovico obsega«: 48 + 35 = 83, 83 : 2 = 41,5; to je sredina med 48 in 35. -/
theorem n5c_pot2 : (48 : ℚ) + 35 = 83 ∧ (83 : ℚ) / 2 = 41.5 ∧ ((48 : ℚ) + 35) / 2 = 41.5 := by norm_num

/-- Naloga 5c, napaka: 166 : 2 = 83 ni stranica kvadrata z obsegom 166 (4 · 83 ≠ 166). -/
theorem n5c_napaka : (166 : ℚ) / 2 = 83 ∧ (4 : ℚ) * 83 ≠ 166 := by norm_num

/-! ## Naloga 6 -/

/-- Množica M iz naloge 6. -/
def M : Finset ℕ := {6, 8, 12, 15, 20, 27, 34, 36, 49}

/-- A: števila iz M, deljiva s 3. -/
def A : Finset ℕ := M.filter (fun n => 3 ∣ n)

/-- B: števila iz M, deljiva s 4. -/
def B : Finset ℕ := M.filter (fun n => 4 ∣ n)

/-- Naloga 6a, pravili deljivosti iz poti: n je deljivo s 3 natanko tedaj, ko je vsota števk deljiva s 3;
n je deljivo s 4 natanko tedaj, ko je število iz zadnjih dveh števk (n mod 100) deljivo s 4. -/
theorem n6a_pravili (n : ℕ) : (3 ∣ n ↔ 3 ∣ (Nat.digits 10 n).sum) ∧ (4 ∣ n ↔ 4 ∣ n % 100) :=
  ⟨Nat.three_dvd_iff n, by omega⟩

/-- Naloga 6a (odgovor in pot »Preveri vsako število s pravili deljivosti«): samo v A so 6, 15, 27; v obeh
12, 36; samo v B 8, 20; zunaj krogov 34, 49. Vsote števk iz preglednice: 1 + 2 = 3, 1 + 5 = 6, 2 + 0 = 2,
2 + 7 = 9, 3 + 4 = 7, 3 + 6 = 9, 4 + 9 = 13; 34 = 8 · 4 + 2, 36 = 9 · 4. -/
theorem n6a :
    M.filter (fun n => 3 ∣ n ∧ ¬ 4 ∣ n) = {6, 15, 27} ∧ M.filter (fun n => 3 ∣ n ∧ 4 ∣ n) = {12, 36} ∧
    M.filter (fun n => ¬ 3 ∣ n ∧ 4 ∣ n) = {8, 20} ∧ M.filter (fun n => ¬ 3 ∣ n ∧ ¬ 4 ∣ n) = {34, 49} ∧
    ((Nat.digits 10 12).sum = 3 ∧ (Nat.digits 10 15).sum = 6 ∧ (Nat.digits 10 20).sum = 2 ∧
      (Nat.digits 10 27).sum = 9 ∧ (Nat.digits 10 34).sum = 7 ∧ (Nat.digits 10 36).sum = 9 ∧
      (Nat.digits 10 49).sum = 13) ∧
    34 = 8 * 4 + 2 ∧ 36 = 9 * 4 := by
  refine ⟨by decide, by decide, by decide, by decide, ?_, rfl, rfl⟩
  norm_num

/-- Naloga 6b (odgovor in pot »Preberi iz diagrama«): B = {8, 12, 20, 36}; preizkus 8 = 2 · 4, 12 = 3 · 4,
20 = 5 · 4, 36 = 9 · 4. -/
theorem n6b : B = {8, 12, 20, 36} ∧ 8 = 2 * 4 ∧ 12 = 3 * 4 ∧ 20 = 5 * 4 ∧ 36 = 9 * 4 := by
  refine ⟨by decide, rfl, rfl, rfl, rfl⟩

/-- Naloga 6b, napaka: {8, 20} ni B (manjkata 12 in 36 iz preseka). -/
theorem n6b_napaka : B ≠ {8, 20} := by decide

/-- Naloga 6c (odgovor in pot »Preberi iz diagrama«): A = {6, 12, 15, 27, 36}; preizkus 6 = 2 · 3,
12 = 4 · 3, 15 = 5 · 3, 27 = 9 · 3, 36 = 12 · 3. -/
theorem n6c : A = {6, 12, 15, 27, 36} ∧ 6 = 2 * 3 ∧ 12 = 4 * 3 ∧ 15 = 5 * 3 ∧ 27 = 9 * 3 ∧ 36 = 12 * 3 := by
  refine ⟨by decide, rfl, rfl, rfl, rfl, rfl⟩

/-- Naloga 6d (odgovor, obe poti): A ∩ B = {12, 36}, A ∪ B = {6, 8, 12, 15, 20, 27, 36}; unija nastane iz A
z dodanima 8 in 20; preizkus s štetjem 5 + 4 − 2 = 7; unija ni M (34 in 49 nista v njej). -/
theorem n6d :
    A ∩ B = {12, 36} ∧ A ∪ B = {6, 8, 12, 15, 20, 27, 36} ∧ A ∪ B = A ∪ {8, 20} ∧
    A.card = 5 ∧ B.card = 4 ∧ (A ∩ B).card = 2 ∧ (A ∪ B).card = 5 + 4 - 2 ∧ 5 + 4 - 2 = 7 ∧
    A ∪ B ≠ M ∧ 34 ∉ A ∪ B ∧ 49 ∉ A ∪ B := by
  refine ⟨by decide, by decide, by decide, by decide, by decide, by decide, by decide, rfl,
    by decide, by decide, by decide⟩

/-- Naloga 6e (odgovor in pot »Element ali podmnožica«): 27 ∉ B (27 = 6 · 4 + 3) in {12, 36} ⊂ A (prava podmnožica, torej tudi ⊆). -/
theorem n6e : 27 ∉ B ∧ 27 = 6 * 4 + 3 ∧ ({12, 36} : Finset ℕ) ⊆ A ∧ ({12, 36} : Finset ℕ) ⊂ A := by
  refine ⟨by decide, rfl, by decide, by decide⟩

/-! ## Naloga 7 -/

/-- Naloga 7b, »Premica je neomejena«: dve premici a₁x + b₁y = c₁ in a₂x + b₂y = c₂, ki nista vzporedni
(a₁b₂ − a₂b₁ ≠ 0), se v ravnini sekata (imata natanko eno skupno točko). -/
theorem n7b_nevzporedni_se_sekata (a₁ b₁ c₁ a₂ b₂ c₂ : ℝ) (h : a₁ * b₂ - a₂ * b₁ ≠ 0) :
    ∃! p : ℝ × ℝ, a₁ * p.1 + b₁ * p.2 = c₁ ∧ a₂ * p.1 + b₂ * p.2 = c₂ := by
  refine ⟨((c₁ * b₂ - c₂ * b₁) / (a₁ * b₂ - a₂ * b₁), (a₁ * c₂ - a₂ * c₁) / (a₁ * b₂ - a₂ * b₁)),
    ⟨?_, ?_⟩, ?_⟩
  · dsimp only; rw [mul_div_assoc', mul_div_assoc', ← add_div, div_eq_iff h]; ring
  · dsimp only; rw [mul_div_assoc', mul_div_assoc', ← add_div, div_eq_iff h]; ring
  · rintro ⟨x, y⟩ ⟨h1, h2⟩
    simp only at h1 h2
    have hx : x * (a₁ * b₂ - a₂ * b₁) = c₁ * b₂ - c₂ * b₁ := by linear_combination b₂ * h1 - b₁ * h2
    have hy : y * (a₁ * b₂ - a₂ * b₁) = a₁ * c₂ - a₂ * c₁ := by linear_combination a₁ * h2 - a₂ * h1
    refine Prod.ext ?_ ?_
    · simp only; rw [eq_div_iff h, hx]
    · simp only; rw [eq_div_iff h, hy]

/-- Predpostavka trditve `n7b_nevzporedni_se_sekata` se da izpolniti (premici x = 0 in y = 0). -/
example : (1 : ℝ) * 1 - 0 * 0 ≠ 0 := by norm_num

/-- Naloga 7c, preverjanje smiselnosti in napaka: 70° < 90° (oster kot); napačna lestvica dá 180° − 70° = 110°,
kar je top kot. -/
theorem n7c : (70 : ℤ) < 90 ∧ (180 : ℤ) - 70 = 110 ∧ (90 : ℤ) < 110 := by norm_num

/-- Naloga 7d, »Srednja črka je oglišče«: 115° je top kot (90° < 115° < 180°), sosednji kot je
180° − 115° = 65°. -/
theorem n7d : (90 : ℤ) < 115 ∧ (115 : ℤ) < 180 ∧ (180 : ℤ) - 115 = 65 := by norm_num

/-- Naloga 7e, »Z geotrikotnikom: pravokotnica«: 2,5 cm = 25 mm, ker je 1 cm = 10 mm. -/
theorem n7e_enote : (2.5 : ℚ) * 10 = 25 := by norm_num

/-- Naloga 7e, »Drugače: preizkus na drugem mestu«: poševna daljica med vzporednicama na razdalji d > 0, s
premikom t ≠ 0 vzdolž premic, je dolga √(d² + t²) > d (daljša od pravokotne). -/
theorem n7e_posevna (d t : ℝ) (hd : 0 < d) (ht : t ≠ 0) : d < Real.sqrt (d ^ 2 + t ^ 2) := by
  rw [Real.lt_sqrt hd.le]
  have : 0 < t ^ 2 := by positivity
  linarith

/-- Predpostavke trditve `n7e_posevna` se dajo izpolniti (d = 25, t = 1). -/
example : (0 : ℝ) < 25 ∧ (1 : ℝ) ≠ 0 := by norm_num

/-! ## Naloga 8 -/

/-- Naloga 8a (odgovor, ↔): Risi R in Zmaji Z s skupaj 146 točkami in Z = R + 18: natanko R = 64, Z = 82. -/
theorem n8a_odgovor (R Z : ℤ) : (R + Z = 146 ∧ Z = R + 18) ↔ (R = 64 ∧ Z = 82) := by
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Naloga 8a, »Po korakih: najprej odvzemi razliko«: 146 − 18 = 128, 128 : 2 = 64, 64 + 18 = 82; preizkus
64 + 82 = 146, 82 − 64 = 18. -/
theorem n8a_pot1 :
    146 - 18 = 128 ∧ 128 / 2 = 64 ∧ 64 + 18 = 82 ∧ 64 + 82 = 146 ∧ 82 - 64 = 18 := by decide

/-- Naloga 8a, »Drugače: od polovice vsote«: 146 : 2 = 73, 18 : 2 = 9, 73 + 9 = 82, 73 − 9 = 64,
82 − 64 = 18. -/
theorem n8a_pot2 :
    146 / 2 = 73 ∧ 18 / 2 = 9 ∧ 73 + 9 = 82 ∧ 73 - 9 = 64 ∧ 82 - 64 = 18 := by decide

/-- Naloga 8a, napaka: 73 in 73 + 18 = 91 dasta vsoto 164, ne 146. -/
theorem n8a_napaka : 73 + 18 = 91 ∧ 73 + 91 = 164 ∧ 164 ≠ 146 := by decide

/-- Naloga 8b (odgovor, ↔): Eva E in Ana = 2E s skupaj 39 točkami: natanko E = 13, Ana = 26. -/
theorem n8b_odgovor (E An : ℤ) : (E + An = 39 ∧ An = 2 * E) ↔ (E = 13 ∧ An = 26) := by
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Naloga 8b, »Po korakih: z deli«: 1 + 2 = 3 deli, 39 : 3 = 13, 2 · 13 = 26; preizkus 13 + 26 = 39. -/
theorem n8b_pot1 : 1 + 2 = 3 ∧ 39 / 3 = 13 ∧ 39 % 3 = 0 ∧ 2 * 13 = 26 ∧ 13 + 26 = 39 := by decide

/-- Naloga 8b, »Drugače: s poskušanjem«: 10 + 20 = 30, 12 + 24 = 36 (premalo), 13 + 26 = 39. -/
theorem n8b_pot2 :
    10 + 2 * 10 = 30 ∧ 30 < 39 ∧ 12 + 2 * 12 = 36 ∧ 36 < 39 ∧ 13 + 2 * 13 = 39 := by decide

/-- Naloga 8b, napaka: 39 : 2 = 19,5 ni rešitev (19,5 + 2 · 19,5 ≠ 39). -/
theorem n8b_napaka : (39 : ℚ) / 2 = 19.5 ∧ (19.5 : ℚ) + 2 * 19.5 ≠ 39 := by norm_num

/-- Naloga 8c (odgovor, ↔): d košev za 2 točki in t košev za 3 točke (naravni števili) z d + t = 27 in
2d + 3t = 61: natanko d = 20, t = 7. -/
theorem n8c_odgovor (d t : ℕ) : (d + t = 27 ∧ 2 * d + 3 * t = 61) ↔ (d = 20 ∧ t = 7) := by
  omega

/-- Naloga 8c, »Po korakih: sklepanje«: 27 · 2 = 54, 61 − 54 = 7, 3 − 2 = 1 (vsak koš za 3 prinese točko
več), 27 − 7 = 20; preizkus 20 + 7 = 27, 20 · 2 + 7 · 3 = 40 + 21 = 61. -/
theorem n8c_pot1 :
    27 * 2 = 54 ∧ 61 - 54 = 7 ∧ 3 - 2 = 1 ∧ 27 - 7 = 20 ∧ 20 + 7 = 27 ∧ 20 * 2 + 7 * 3 = 61 := by
  refine ⟨rfl, rfl, rfl, rfl, rfl, ?_⟩
  calc 20 * 2 + 7 * 3 = 40 + 21 := by norm_num
    _ = 61 := by norm_num

/-- Naloga 8c, »Drugače: s poskušanjem v preglednici«: 15 + 44 = 59, 18 + 42 = 60, 21 + 40 = 61; vsak dodaten
koš za 3 točke namesto koša za 2 poveča vsoto za 1 (za t + 1 ≤ 27; ℕ-odštevanje je tu točno). -/
theorem n8c_pot2 :
    (5 * 3 + 22 * 2 = 59 ∧ 6 * 3 + 21 * 2 = 60 ∧ 7 * 3 + 20 * 2 = 61) ∧
    ∀ t : ℕ, t + 1 ≤ 27 → 3 * (t + 1) + 2 * (27 - (t + 1)) = 3 * t + 2 * (27 - t) + 1 := by
  refine ⟨by decide, fun t ht => by omega⟩

/-- Predpostavka v `n8c_pot2` se da izpolniti (t = 6). -/
example : 6 + 1 ≤ 27 := by norm_num

/-- Naloga 8c, napaka: 61 : 27 ni celo število (61 = 2 · 27 + 7). -/
theorem n8c_napaka : 61 % 27 = 7 ∧ ¬ 27 ∣ 61 := by decide

/-! ## Naloga 9 -/

/-- Število učencev po razredih (indeks i je (i + 1). razred). -/
def ucenci : Fin 9 → ℕ := ![47, 55, 52, 45, 58, 60, 49, 63, 41]

/-- Naloga 9a (odgovor in pot »Primerjaj števila«): največ učencev je v 8. razredu (63), najmanj v
9. razredu (41); edino število nad 60 je 63, edino pod 45 je 41. -/
theorem n9a :
    ucenci 7 = 63 ∧ ucenci 8 = 41 ∧ (∀ i, i ≠ 7 → ucenci i < ucenci 7) ∧ (∀ i, i ≠ 8 → ucenci 8 < ucenci i) ∧
    (∀ i, 60 < ucenci i ↔ i = 7) ∧ (∀ i, ucenci i < 45 ↔ i = 8) := by
  refine ⟨rfl, rfl, by decide, by decide, by decide, by decide⟩

/-- Naloga 9b (odgovor in obe poti): 45 : 5 = 9, 60 : 5 = 12, 55 : 5 = 11 kvadratkov (5 · 9 = 45,
5 · 11 = 55, 5 · 12 = 60); stolpec 6. razreda je najvišji, 4. najnižji (60 > 55 > 45). -/
theorem n9b :
    ucenci 3 = 5 * 9 ∧ ucenci 5 = 5 * 12 ∧ ucenci 1 = 5 * 11 ∧
    5 * 9 = 45 ∧ 5 * 11 = 55 ∧ 5 * 12 = 60 ∧ 60 > 55 ∧ 55 > 45 := by
  decide

/-- Naloga 9c (odgovor in pot »Po korakih: seštej vse razrede«): 47 + 55 = 102, + 52 = 154, + 45 = 199,
+ 58 = 257, + 60 = 317, + 49 = 366, + 63 = 429, + 41 = 470. -/
theorem n9c_pot1 : ∑ i, ucenci i = 470 := by
  calc ∑ i, ucenci i = 47 + 55 + 52 + 45 + 58 + 60 + 49 + 63 + 41 := by
        simp [Fin.sum_univ_succ, ucenci]
    _ = 102 + 52 + 45 + 58 + 60 + 49 + 63 + 41 := by norm_num
    _ = 154 + 45 + 58 + 60 + 49 + 63 + 41 := by norm_num
    _ = 199 + 58 + 60 + 49 + 63 + 41 := by norm_num
    _ = 257 + 60 + 49 + 63 + 41 := by norm_num
    _ = 317 + 49 + 63 + 41 := by norm_num
    _ = 366 + 63 + 41 := by norm_num
    _ = 429 + 41 := by norm_num
    _ = 470 := by norm_num

/-- Naloga 9c, »Drugače: združi v ugodne pare«: (47 + 63) + (55 + 45) + (52 + 58) + (60 + 41) + 49 =
110 + 100 + 110 + 101 + 49 = 470; ocena 9 · 50 = 450. -/
theorem n9c_pot2 :
    47 + 55 + 52 + 45 + 58 + 60 + 49 + 63 + 41 = 470 ∧ 9 * 50 = 450 := by
  refine ⟨?_, rfl⟩
  calc 47 + 55 + 52 + 45 + 58 + 60 + 49 + 63 + 41
      = (47 + 63) + (55 + 45) + (52 + 58) + (60 + 41) + 49 := by ring
    _ = 110 + 100 + 110 + 101 + 49 := by norm_num
    _ = 470 := by norm_num

end Evklid.Pole.NPZ6_MAT_2023_redni
