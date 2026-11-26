/-
vir: content/exam-papers/NPZ9-MAT-2022-redni.json
sha256: f168556c0337a3685066dfe52b8ce2c39782814ae706fc93bdf5752ef2f5f0b0
Ni v Leanu: besedni zapis števil (1a: »dvesto sedem milijonov …« in branje nazaj je jezik, dokazano je
207·10⁶ + 403·10³ + 50 = 207 403 050 in razpis po mestih s `Nat.digits`); pisni postopki kot zapis na papirju
(dokazani so vsi koraki: prenosi pri seštevanju, delni količniki in ostanki pri deljenju); 5a in 5c kot
risanje (dokazano splošno: točka D na nasprotnem poltraku od C da top kot ∠BSD, če je ∠BSC oster; skozi T
obstaja natanko ena premica, vzporedna q); 5b meritev kotov s slike (58° in 122° sta odčitka z geotrikotnikom;
meritev iz koordinat slike ±2° je zahtevna, še ni dokazana; dokazano je, da sta kota sokota in da iz 58° sledi
122°, iz 56°..60° pa 120°..124°); 7a v koordinatnem modelu kvadra (A = (0,0,0), B = (12,0,0), C = (12,5,0),
D = (0,5,0), E = (0,0,8), F = (12,0,8), G = (12,5,8), H = (0,5,8)) – »pravokotni ravnini« ni definiran pojem v
Mathlibu za ravnine v ℝ³, zato je B dokazana kot: ravnini ADH in BCG sta disjunktni (vzporedni), pravokotni
ravnini pa se vedno sekata; primerjava s sobo (7a, pot 2) je ponazoritev; 8a odčitek tehtnice s slike
(1 300 g; dokazan je račun 1 000 + 3·100 = 1 300 in vse nadaljnje); 8b odčitek števca s slike (48 736,2 km);
9a »stalno pravilo« razlik je zapisano kot predpostavka (razlike se ponavljajo s periodo 3), ker preglednica
pravila ne določa enolično. Dolžine stopal v 9b so v milimetrih (ℕ), da Lean preveri urejenost seznama z
`decide`; 252 mm = 25,2 cm je dokazano posebej. Zaokroževanje je Mathlibov `round` (⌊x + 1/2⌋, za pozitivna
števila enako šolskemu pravilu »5 ali več navzgor«). Decimalna števila so točna racionalna števila. Ure so
zapisane v minutah po polnoči. V ℕ je odštevanje odrezano (a − b = 0 pri a < b); vse uporabljene razlike so
nenegativne.
-/
module

public import Mathlib

public section

namespace Evklid.Pole.NPZ9_MAT_2022_redni

open EuclideanGeometry

/-! ## Naloga 1 -/

/-- Naloga 1a, pot »Po razredih in mestih«: prvo število ima razred milijonov 207, tisočev 403 in enic 050,
torej 207·10⁶ + 403·10³ + 50 = 207 403 050; razpis po mestih (od enic navzgor) je 0,5,0,3,0,4,7,0,2. -/
theorem n1a_prvo :
    207 * 10 ^ 6 + 403 * 10 ^ 3 + 50 = 207403050 ∧
    Nat.digits 10 207403050 = [0, 5, 0, 3, 0, 4, 7, 0, 2] := by
  norm_num

/-- Naloga 1a, pot »Po razredih in mestih«: 3 stotisočice, 9 tisočic in 4 enice so 309 004 (preglednica
mest 3 0 9 0 0 4, od enic navzgor 4,0,0,9,0,3). -/
theorem n1a_drugo :
    3 * 10 ^ 5 + 9 * 10 ^ 3 + 4 = 309004 ∧ Nat.digits 10 309004 = [4, 0, 0, 9, 0, 3] := by
  norm_num

/-- Naloga 1a, pot »Po razredih in mestih«: 10⁵ = 100 000, 10³ = 1 000, 10¹ = 10 in
6·100 000 + 2·1 000 + 7·10 = 600 000 + 2 000 + 70 = 602 070. -/
theorem n1a_tretje :
    (10:ℕ) ^ 5 = 100000 ∧ (10:ℕ) ^ 3 = 1000 ∧ (10:ℕ) ^ 1 = 10 ∧
    6 * 10 ^ 5 + 2 * 10 ^ 3 + 7 * 10 ^ 1 = 602070 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  calc 6 * 10 ^ 5 + 2 * 10 ^ 3 + 7 * 10 ^ 1 = 6 * 100000 + 2 * 1000 + 7 * 10 := by norm_num
    _ = 600000 + 2000 + 70 := by norm_num
    _ = 602070 := by norm_num

/-- Naloga 1a, pot »Drugače: potenca pove mesto števke«: števke 602 070 po mestih 10⁰ … 10⁵ so 0,7,0,2,0,6
(preglednica 6 0 2 0 7 0 od 10⁵ navzdol). -/
theorem n1a_tretje_mesta : Nat.digits 10 602070 = [0, 7, 0, 2, 0, 6] := by norm_num

/-- Naloga 1a, napake: izpuščene ničle dajo druga števila (2 074 350 ≠ 207 403 050, 394 ≠ 309 004). -/
theorem n1a_napaka : (2074350:ℕ) ≠ 207403050 ∧ (394:ℕ) ≠ 309004 := by norm_num

/-- Naloga 1b, pot »Po pravilu zaokroževanja«: števka tisočic v 739 512 je 9, števka stotic 5; 739 + 1 = 740;
zaokroženo na tisočice je 739 512 ≈ 740 000. -/
theorem n1b :
    739512 / 1000 % 10 = 9 ∧ 739512 / 100 % 10 = 5 ∧ 739 + 1 = 740 ∧
    round ((739512:ℚ) / 1000) * 1000 = 740000 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  have : round ((739512:ℚ) / 1000) = 740 := by
    rw [round_eq, Int.floor_eq_iff]; norm_num
  rw [this]; norm_num

/-- Naloga 1b, preizkus: 739 000 ≤ 739 512 < 740 000, od 740 000 je oddaljeno 488, od 739 000 pa 512, zato je
bližje 740 000. -/
theorem n1b_preizkus :
    (739000:ℤ) ≤ 739512 ∧ (739512:ℤ) < 740000 ∧ (740000:ℤ) - 739512 = 488 ∧ (739512:ℤ) - 739000 = 512 ∧
    (488:ℤ) < 512 := by norm_num

/-- Naloga 1b, napake: »odrezano« število je 739 000 (⌊739 512/1000⌋·1000), zamenjava 9 z 0 da 730 000; obe
se razlikujeta od pravilnih 740 000. -/
theorem n1b_napaka : 739512 / 1000 * 1000 = 739000 ∧ (739000:ℕ) ≠ 740000 ∧ (730000:ℕ) ≠ 740000 := by
  norm_num

/-- Naloga 1c (uradni odgovor): med števkami d (0 … 9) je število 7 305 81d deljivo z 9 natanko pri d = 3. -/
theorem n1c (d : ℕ) (hd : d ≤ 9) : 9 ∣ 7305810 + d ↔ d = 3 := by
  omega

/-- Predpostavka trditve `n1c` se da izpolniti. -/
example : (3:ℕ) ≤ 9 := by norm_num

/-- Naloga 1c, pot »S pravilom deljivosti z 9«: vsota znanih števk je 7 + 3 + 0 + 5 + 8 + 1 = 24; 27 − 24 = 3;
naslednji večkratnik 36 bi zahteval 36 − 24 = 12 > 9; 7 305 813 ima vsoto števk 27 = 3·9 in je deljivo z 9
(pravilo vsote števk: `Nat.nine_dvd_iff`). -/
theorem n1c_pot :
    7 + 3 + 0 + 5 + 8 + 1 = 24 ∧ 27 - 24 = 3 ∧ 36 - 24 = 12 ∧ 9 < 12 ∧
    (Nat.digits 10 7305813).sum = 27 ∧ 27 = 3 * 9 ∧ 9 ∣ 7305813 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  rw [Nat.nine_dvd_iff]; norm_num

/-- Naloga 1c, napaka: s števko 0 je vsota števk 24, ki ni deljiva z 9, zato 7 305 810 ni deljivo z 9. -/
theorem n1c_napaka : (Nat.digits 10 7305810).sum = 24 ∧ ¬ 9 ∣ 24 ∧ ¬ 9 ∣ 7305810 := by
  norm_num

/-- Naloga 1d (uradni odgovor): D₅₂ = {1, 2, 4, 13, 26, 52}. -/
theorem n1d : Nat.divisors 52 = {1, 2, 4, 13, 26, 52} := by decide

/-- Naloga 1d, pot »Po parih deliteljev«: 1·52 = 2·26 = 4·13 = 52, števila 3, 5, 6, 7, 8, 9, 10, 11, 12 ne
delijo 52;
preizkus 52 = 2²·13 in (2 + 1)·(1 + 1) = 6 = |D₅₂|. -/
theorem n1d_pot :
    1 * 52 = 52 ∧ 2 * 26 = 52 ∧ 4 * 13 = 52 ∧ (∀ k ∈ ({3, 5, 6, 7, 8, 9, 10, 11, 12} : Finset ℕ), ¬ k ∣ 52) ∧
    52 = 2 ^ 2 * 13 ∧ (2 + 1) * (1 + 1) = 6 ∧ (Nat.divisors 52).card = 6 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by decide, by norm_num, by norm_num, by decide⟩

/-! ## Naloga 2 -/

/-- Naloga 2a, pot »Pisno seštevanje«: enice 6 + 9 + 8 = 23, desetice 8 + 5 + 0 + 2 = 15, stotice
7 + 3 + 9 + 1 = 20, tisočice 4 + 2 + 2 = 8, desettisočice 1; vsota 4 786 + 12 359 + 908 = 18 053. -/
theorem n2a_vsota :
    6 + 9 + 8 = 23 ∧ 8 + 5 + 0 + 2 = 15 ∧ 7 + 3 + 9 + 1 = 20 ∧ 4 + 2 + 2 = 8 ∧
    4786 + 12359 + 908 = 18053 := by norm_num

/-- Naloga 2a (uradni odgovor): 18 053 ≈ 18 100 na stotice (števka stotic 0, desno 5 ⇒ navzgor). -/
theorem n2a_zaokrozitev :
    18053 / 100 % 10 = 0 ∧ 18053 / 10 % 10 = 5 ∧ round ((18053:ℚ) / 100) * 100 = 18100 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  have : round ((18053:ℚ) / 100) = 181 := by
    rw [round_eq, Int.floor_eq_iff]; norm_num
  rw [this]; norm_num

/-- Naloga 2a, pot »Drugače: preizkus z oceno«: 4 800 + 12 400 + 900 = 18 100; 18 053 − 908 = 17 145 in
17 145 − 12 359 = 4 786. -/
theorem n2a_preizkus :
    4800 + 12400 + 900 = 18100 ∧ 18053 - 908 = 17145 ∧ 17145 - 12359 = 4786 := by norm_num

/-- Naloga 2a, napaka: 18 000 je dlje od 18 053 (53) kot 18 100 (47), zato 18 000 ni pravilna zaokrožitev. -/
theorem n2a_napaka : (18053:ℤ) - 18000 = 53 ∧ (18100:ℤ) - 18053 = 47 ∧ (47:ℤ) < 53 := by norm_num

/-- Naloga 2b, pot »Pisno deljenje«: 58 = 1·40 + 18, 187 = 4·40 + 27, 270 = 6·40 + 30, 300 = 7·40 + 20,
200 = 5·40 + 0, torej 587 : 40 = 14,675. -/
theorem n2b_deljenje :
    58 = 1 * 40 + 18 ∧ 187 = 4 * 40 + 27 ∧ 270 = 6 * 40 + 30 ∧ 300 = 7 * 40 + 20 ∧ 200 = 5 * 40 + 0 ∧
    (587:ℚ) / 40 = 14.675 := by norm_num

/-- Naloga 2b (uradni odgovor): 14,675 ≈ 14,7 na desetine (števka desetin 6, desno 7 ⇒ navzgor). -/
theorem n2b_zaokrozitev : round ((14.675:ℚ) * 10) / 10 = (14.7:ℚ) := by
  have : round ((14.675:ℚ) * 10) = 147 := by
    rw [round_eq, Int.floor_eq_iff]; norm_num
  rw [this]; norm_num

/-- Naloga 2b, pot »Drugače: delimo najprej z 10, nato s 4«: 40 = 10·4, 587 : 10 = 58,7; 58 = 14·4 + 2,
27 = 6·4 + 3, 30 = 7·4 + 2, 20 = 5·4; 58,7 : 4 = 14,675; preizkus 14,675·40 = 587. -/
theorem n2b_pot2 :
    40 = 10 * 4 ∧ (587:ℚ) / 10 = 58.7 ∧ 58 = 14 * 4 + 2 ∧ 27 = 6 * 4 + 3 ∧ 30 = 7 * 4 + 2 ∧ 20 = 5 * 4 ∧
    (58.7:ℚ) / 4 = 14.675 ∧ (14.675:ℚ) * 40 = 587 := by norm_num

/-- Naloga 2b, napaka (ocena): 40·15 = 600 > 587, zato je količnik manjši od 15. -/
theorem n2b_ocena : 40 * 15 = 600 ∧ (587:ℚ) / 40 < 15 := by norm_num

/-- Naloga 2c (uradni odgovor), pot »Po vrstnem redu računskih operacij«: 75·46 = 3 450, torej
7,5·4,6 = 34,50 = 34,5 in 63 − 34,5 = 28,5. -/
theorem n2c :
    75 * 46 = 3450 ∧ (7.5:ℚ) * 4.6 = 34.50 ∧ (63:ℚ) - 7.5 * 4.6 = 28.5 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  calc (63:ℚ) - 7.5 * 4.6 = 63 - 34.5 := by norm_num
    _ = 28.5 := by norm_num

/-- Naloga 2c, pot »Drugače: razstavimo faktor«: 4,6 = 4 + 0,6, 7,5·4,6 = 7,5·4 + 7,5·0,6 = 30 + 4,5 = 34,5,
63 − 34,5 = 28,5; ocena: 7·4 = 28 < 7,5·4,6 < 40 = 8·5, zato je rezultat med 63 − 40 = 23 in 63 − 28 = 35. -/
theorem n2c_pot2 :
    (4.6:ℚ) = 4 + 0.6 ∧ (63:ℚ) - 34.5 = 28.5 ∧
    (7 * 4 : ℚ) = 28 ∧ (28:ℚ) < 7.5 * 4.6 ∧ (7.5:ℚ) * 4.6 < 40 ∧ (8 * 5 : ℚ) = 40 ∧
    (23:ℚ) < 63 - 7.5 * 4.6 ∧ (63:ℚ) - 7.5 * 4.6 < 35 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩

/-- Naloga 2c, pot 2, razstavljanje kot veriga: 7,5·4,6 = 7,5·(4 + 0,6) = 7,5·4 + 7,5·0,6 = 30 + 4,5 = 34,5. -/
theorem n2c_razstavimo : (7.5:ℚ) * 4.6 = 34.5 := by
  calc (7.5:ℚ) * 4.6 = 7.5 * (4 + 0.6) := by norm_num
    _ = 7.5 * 4 + 7.5 * 0.6 := by ring
    _ = 30 + 4.5 := by norm_num
    _ = 34.5 := by norm_num

/-- Naloga 2c, napaka: kdor računa od leve proti desni, dobi (63 − 7,5)·4,6 = 55,5·4,6 = 255,3 ≠ 28,5. -/
theorem n2c_napaka : ((63:ℚ) - 7.5) * 4.6 = 55.5 * 4.6 ∧ (55.5:ℚ) * 4.6 = 255.3 ∧ (255.3:ℚ) ≠ 28.5 := by
  norm_num

/-! ## Naloga 3 -/

/-- Naloga 3a: 1⁵⁸ = 1 (napačna odgovora 58 in 59 nista enaka 1⁵⁸). -/
theorem n3a : (1:ℤ) ^ 58 = 1 ∧ (1:ℤ) ^ 58 ≠ 1 * 58 ∧ (1:ℤ) ^ 58 ≠ 1 + 58 := by norm_num

/-- Naloga 3b: −30² = −(30·30) = −900 (v Leanu se `-30 ^ 2` bere kot −(30²), kot v nalogi); za primerjavo
(−30)² = (−30)·(−30) = 900; napačni odgovori 900, −60, 60 niso −30². -/
theorem n3b :
    -(30:ℤ) ^ 2 = -(30 * 30) ∧ -((30:ℤ) * 30) = -900 ∧ (-30:ℤ) ^ 2 = (-30) * (-30) ∧ (-30:ℤ) * (-30) = 900 ∧
    -(30:ℤ) ^ 2 ≠ 900 ∧ -(30:ℤ) ^ 2 ≠ -60 ∧ -(30:ℤ) ^ 2 ≠ 60 := by norm_num

/-- Naloga 3c, pot »Z ulomkom«: 0,0169 = 169/10 000, √169 = 13, √10 000 = 100, √0,0169 = 13/100 = 0,13;
preizkus 0,13·0,13 = 0,0169. -/
theorem n3c :
    (0.0169:ℝ) = 169 / 10000 ∧ Real.sqrt 169 = 13 ∧ Real.sqrt 10000 = 100 ∧
    Real.sqrt 0.0169 = 0.13 ∧ (0.13:ℝ) * 0.13 = 0.0169 := by
  have h169 : Real.sqrt 169 = 13 := by
    rw [show (169:ℝ) = 13 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have h10000 : Real.sqrt 10000 = 100 := by
    rw [show (10000:ℝ) = 100 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨by norm_num, h169, h10000, ?_, by norm_num⟩
  calc Real.sqrt 0.0169 = Real.sqrt (169 / 10000) := by norm_num
    _ = Real.sqrt 169 / Real.sqrt 10000 := Real.sqrt_div' 169 (by norm_num)
    _ = 13 / 100 := by rw [h169, h10000]
    _ = 0.13 := by norm_num

/-- Naloga 3c, napaka: 0,013² = 0,000169 ≠ 0,0169, zato 0,013 ni √0,0169. -/
theorem n3c_napaka : (0.013:ℝ) ^ 2 = 0.000169 ∧ (0.000169:ℝ) ≠ 0.0169 ∧ Real.sqrt 0.0169 ≠ 0.013 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  rw [show (0.0169:ℝ) = 0.13 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]; norm_num

/-- Naloga 3d, pot »Mešano število spremenimo v ulomek«: 3 1/16 = (3·16 + 1)/16 = 49/16,
√(49/16) = √49/√16 = 7/4 = 1 3/4; preizkus (7/4)·(7/4) = 49/16 = 3 1/16. -/
theorem n3d :
    ((3:ℝ) + 1 / 16) = (3 * 16 + 1) / 16 ∧ ((3:ℝ) * 16 + 1) / 16 = 49 / 16 ∧
    Real.sqrt (3 + 1 / 16) = 7 / 4 ∧ (7 / 4 : ℝ) = 1 + 3 / 4 ∧ (7 / 4 : ℝ) * (7 / 4) = 49 / 16 := by
  have h49 : Real.sqrt 49 = 7 := by
    rw [show (49:ℝ) = 7 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have h16 : Real.sqrt 16 = 4 := by
    rw [show (16:ℝ) = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨by norm_num, by norm_num, ?_, by norm_num, by norm_num⟩
  calc Real.sqrt (3 + 1 / 16) = Real.sqrt (49 / 16) := by norm_num
    _ = Real.sqrt 49 / Real.sqrt 16 := Real.sqrt_div' 49 (by norm_num)
    _ = 7 / 4 := by rw [h49, h16]

/-- Naloga 3d, napake: √3 + √(1/16) ≠ 7/4 (sicer bi bilo √3 = 3/2, a (3/2)² = 9/4 ≠ 3) in
(3 1/4)² = 169/16 = 10 9/16 ≠ 3 1/16. -/
theorem n3d_napaka :
    Real.sqrt 3 + Real.sqrt (1 / 16) ≠ 7 / 4 ∧
    ((3:ℝ) + 1 / 4) ^ 2 = 169 / 16 ∧ (169 / 16 : ℝ) = 10 + 9 / 16 ∧ (169 / 16 : ℝ) ≠ 3 + 1 / 16 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  have h : Real.sqrt (1 / 16) = 1 / 4 := by
    rw [show (1 / 16 : ℝ) = (1 / 4) ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  rw [h]
  intro hs
  have h3 : Real.sqrt 3 = 3 / 2 := by linarith
  have := Real.sq_sqrt (show (0:ℝ) ≤ 3 by norm_num)
  rw [h3] at this
  norm_num at this

/-! ## Naloga 4 -/

/-- Naloga 4a (uradni odgovor), pot »Po korakih«: 5x + 14 = 2x − 7 ⇔ 5x − 2x = −7 − 14 ⇔ 3x = −21 ⇔ x = −7
(edina rešitev). -/
theorem n4a (x : ℝ) : 5 * x + 14 = 2 * x - 7 ↔ x = -7 := by
  calc 5 * x + 14 = 2 * x - 7 ↔ 5 * x - 2 * x = -7 - 14 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 3 * x = -21 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = -7 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Naloga 4a, preizkus: 5·(−7) + 14 = −35 + 14 = −21 in 2·(−7) − 7 = −14 − 7 = −21. -/
theorem n4a_preizkus :
    (5:ℝ) * (-7) + 14 = -35 + 14 ∧ (-35:ℝ) + 14 = -21 ∧ (2:ℝ) * (-7) - 7 = -14 - 7 ∧ (-14:ℝ) - 7 = -21 := by
  norm_num

/-- Naloga 4a, pot »Drugače: neznanke na desno«: 5x + 14 = 2x − 7 ⇔ 14 + 7 = 2x − 5x ⇔ 21 = −3x ⇔
x = 21 : (−3) = −7. -/
theorem n4a_pot2 (x : ℝ) : 5 * x + 14 = 2 * x - 7 ↔ x = -7 := by
  calc 5 * x + 14 = 2 * x - 7 ↔ 14 + 7 = 2 * x - 5 * x := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 21 = -3 * x := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 21 / (-3) := by
      rw [show (21:ℝ) / (-3) = -7 by norm_num]; exact ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = -7 := by norm_num

/-- Naloga 4a, napaka: brez spremembe predznaka 5x + 2x = −7 + 14 da 7x = 7, x = 1; preizkus pokaže napako:
5 + 14 = 19, 2 − 7 = −5, 19 ≠ −5. -/
theorem n4a_napaka :
    (-7:ℝ) + 14 = 7 ∧ (5:ℝ) * 1 + 14 = 19 ∧ (2:ℝ) * 1 - 7 = -5 ∧ (19:ℝ) ≠ -5 := by norm_num

/-- Naloga 4b (uradni odgovor), pot »Po korakih«: 7 − 2(3x − 4) = 5 − (2x + 6) ⇔ 7 − 6x + 8 = 5 − 2x − 6 ⇔
15 − 6x = −1 − 2x ⇔ −6x + 2x = −1 − 15 ⇔ −4x = −16 ⇔ x = 4 (edina rešitev). -/
theorem n4b (x : ℝ) : 7 - 2 * (3 * x - 4) = 5 - (2 * x + 6) ↔ x = 4 := by
  calc 7 - 2 * (3 * x - 4) = 5 - (2 * x + 6) ↔ 7 - 6 * x + 8 = 5 - 2 * x - 6 :=
        ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 15 - 6 * x = -1 - 2 * x := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ -6 * x + 2 * x = -1 - 15 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ -4 * x = -16 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 4 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Naloga 4b, preizkus v izhodiščni enačbi: L = 7 − 2·(3·4 − 4) = 7 − 2·8 = 7 − 16 = −9 (pot 2:
7 − 2(12 − 4) = −9), D = 5 − (2·4 + 6) = 5 − 14 = −9 (pot 2: 5 − (8 + 6) = −9). -/
theorem n4b_preizkus :
    (7:ℝ) - 2 * (3 * 4 - 4) = 7 - 2 * 8 ∧ (7:ℝ) - 2 * 8 = 7 - 16 ∧ (7:ℝ) - 16 = -9 ∧
    (7:ℝ) - 2 * (12 - 4) = -9 ∧
    (5:ℝ) - (2 * 4 + 6) = 5 - 14 ∧ (5:ℝ) - 14 = -9 ∧ (5:ℝ) - (8 + 6) = -9 := by norm_num

/-- Naloga 4b, pot »Drugače: neznanke na desno«: 15 − 6x = −1 − 2x ⇔ 15 + 1 = −2x + 6x ⇔ 16 = 4x ⇔
x = 16 : 4 = 4. -/
theorem n4b_pot2 (x : ℝ) : 15 - 6 * x = -1 - 2 * x ↔ x = 4 := by
  calc 15 - 6 * x = -1 - 2 * x ↔ 15 + 1 = -2 * x + 6 * x := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 16 = 4 * x := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 16 / 4 := by
      rw [show (16:ℝ) / 4 = 4 by norm_num]; exact ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 4 := by norm_num

/-- Naloga 4b, pot 1 (odprava oklepajev) in napake: −2·3x = −6x, −2·(−4) = 8, torej −2(3x − 4) = −6x + 8
in −(2x + 6) = −2x − 6 za vsak x; napačna zapisa −6x − 8 in −2x + 6 nista enaka za noben x. -/
theorem n4b_oklepaji (x : ℝ) :
    -2 * (3 * x) = -6 * x ∧ (-2:ℝ) * (-4) = 8 ∧ -2 * (3 * x - 4) = -6 * x + 8 ∧ -(2 * x + 6) = -2 * x - 6 ∧
    -2 * (3 * x - 4) ≠ -6 * x - 8 ∧ -(2 * x + 6) ≠ -2 * x + 6 := by
  refine ⟨by ring, by norm_num, by ring, by ring, fun h => by linarith, fun h => by linarith⟩

/-! ## Naloga 5 -/

/-- Naloga 5a: če je kot ∠BSC oster in leži S strogo med C in D (D na premici q na drugi strani S kot C,
D ≠ S), je ∠BSD = π − ∠BSC top (sokota merita skupaj 180°). -/
theorem n5a {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (B S C D : P) (hCSD : Sbtw ℝ C S D) (hostri : ∠ B S C < Real.pi / 2) :
    ∠ B S C + ∠ B S D = Real.pi ∧ Real.pi / 2 < ∠ B S D := by
  have h := angle_add_angle_eq_pi_of_angle_eq_pi B (angle_eq_pi_iff_sbtw.mpr hCSD)
  exact ⟨h, by linarith⟩

/-- Predpostavke trditve `n5a` se dajo izpolniti (v ℂ: S = 0, C = B = 1, D = −1). -/
example : Sbtw ℝ (1:ℂ) 0 (-1) ∧ ∠ (1:ℂ) 0 1 < Real.pi / 2 := by
  constructor
  · rw [← angle_eq_pi_iff_sbtw, EuclideanGeometry.angle, vsub_eq_sub, vsub_eq_sub, sub_zero, sub_zero,
      Complex.angle_one_left (by norm_num)]
    simp [abs_of_pos Real.pi_pos]
  · rw [EuclideanGeometry.angle, vsub_eq_sub, sub_zero, InnerProductGeometry.angle_self one_ne_zero]
    positivity

/-- Naloga 5b, pot »Preizkus: sokota«: SA in SB sta nasprotna poltraka premice p (S strogo med A in B), zato
∠BSC + ∠ASC = 180°; iz izmerjenega ∠BSC = 58° sledi ∠ASC = 122° in 58° + 122° = 180°. -/
theorem n5b {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (A B S C : P) (hASB : Sbtw ℝ A S B) (h58 : ∠ B S C = 58 / 180 * Real.pi) :
    ∠ A S C + ∠ B S C = Real.pi ∧ ∠ A S C = 122 / 180 * Real.pi ∧ (58:ℝ) + 122 = 180 := by
  have h := angle_add_angle_eq_pi_of_angle_eq_pi C (angle_eq_pi_iff_sbtw.mpr hASB)
  rw [angle_comm C S A, angle_comm C S B] at h
  exact ⟨h, by linarith, by norm_num⟩

/-- Naloga 5b, dovoljeno odstopanje ±2°: če je 56° ≤ ∠BSC ≤ 60°, je 120° ≤ ∠ASC ≤ 124°. -/
theorem n5b_odstopanje {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (A B S C : P) (hASB : Sbtw ℝ A S B)
    (h1 : 56 / 180 * Real.pi ≤ ∠ B S C) (h2 : ∠ B S C ≤ 60 / 180 * Real.pi) :
    120 / 180 * Real.pi ≤ ∠ A S C ∧ ∠ A S C ≤ 124 / 180 * Real.pi := by
  have h := angle_add_angle_eq_pi_of_angle_eq_pi C (angle_eq_pi_iff_sbtw.mpr hASB)
  rw [angle_comm C S A, angle_comm C S B] at h
  constructor <;> linarith

/-- Predpostavke trditev `n5b` in `n5b_odstopanje` se dajo izpolniti (v ℂ: S = 0, A = −1, B = 1,
C = e^(i·58°)). -/
example : Sbtw ℝ (-1:ℂ) 0 1 ∧
    ∠ (1:ℂ) 0 (Complex.exp (↑(58 / 180 * Real.pi) * Complex.I)) = 58 / 180 * Real.pi := by
  constructor
  · rw [← angle_eq_pi_iff_sbtw, EuclideanGeometry.angle, vsub_eq_sub, vsub_eq_sub, sub_zero, sub_zero,
      Complex.angle_one_right (by norm_num)]
    simp [abs_of_pos Real.pi_pos]
  · rw [EuclideanGeometry.angle, vsub_eq_sub, vsub_eq_sub, sub_zero, sub_zero,
      Complex.angle_one_left (Complex.exp_ne_zero _), Complex.exp_mul_I, Complex.arg_cos_add_sin_mul_I]
    · rw [abs_of_pos (by positivity)]
    · constructor <;> nlinarith [Real.pi_pos]

/-- Naloga 5c: skozi točko T obstaja natanko ena premica (afin podprostor) r, vzporedna dani premici q;
ima isto smer kot q. -/
theorem n5c {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (q : AffineSubspace ℝ P) (hq : q ≠ ⊥) (T : P) :
    ∃! r : AffineSubspace ℝ P, T ∈ r ∧ r.Parallel q := by
  refine ⟨AffineSubspace.mk' T q.direction, ⟨AffineSubspace.self_mem_mk' T _, ?_⟩, ?_⟩
  · rw [AffineSubspace.parallel_iff_direction_eq_and_eq_bot_iff_eq_bot, AffineSubspace.direction_mk']
    exact ⟨rfl, fun h => absurd h ((AffineSubspace.nonempty_iff_ne_bot _).mp
      (AffineSubspace.mk'_nonempty T _)), fun h => absurd h hq⟩
  · rintro r ⟨hT, hr⟩
    apply AffineSubspace.ext_of_direction_eq
    · rw [hr.direction_eq, AffineSubspace.direction_mk']
    · exact ⟨T, hT, AffineSubspace.self_mem_mk' T _⟩

/-- Predpostavka trditve `n5c` se da izpolniti (premica skozi 0 in 1 v ℂ). -/
example : (line[ℝ, (0:ℂ), 1]) ≠ ⊥ := by
  rw [← AffineSubspace.nonempty_iff_ne_bot]
  exact ⟨0, left_mem_affineSpan_pair ℝ 0 1⟩

/-! ## Naloga 6 -/

/-- Naloga 6a (uradni odgovor), pot »Vstavimo vrednosti«: I = 3·(−2) − 4·5 + 2·(−2)·5; členi −6, 20, −20;
I = −6 − 20 − 20 = −46. -/
theorem n6a :
    (3:ℚ) * (-2) = -6 ∧ (4:ℚ) * 5 = 20 ∧ (2:ℚ) * (-2) * 5 = -20 ∧
    (3:ℚ) * (-2) - 4 * 5 + 2 * (-2) * 5 = -46 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  calc (3:ℚ) * (-2) - 4 * 5 + 2 * (-2) * 5 = -6 - 20 - 20 := by norm_num
    _ = -46 := by norm_num

/-- Naloga 6a, pot »Drugače: najprej izpostavimo«: 3x + 2xy = x(3 + 2y) za vse x, y; 3 + 2·5 = 13;
I = (−2)·13 − 4·5 = −26 − 20 = −46. -/
theorem n6a_pot2 :
    (∀ x y : ℚ, 3 * x + 2 * x * y = x * (3 + 2 * y)) ∧ (3:ℚ) + 2 * 5 = 13 ∧
    (3:ℚ) * (-2) - 4 * 5 + 2 * (-2) * 5 = -46 := by
  refine ⟨fun x y => by ring, by norm_num, ?_⟩
  calc (3:ℚ) * (-2) - 4 * 5 + 2 * (-2) * 5 = (-2) * (3 + 2 * 5) - 4 * 5 := by ring
    _ = (-2) * 13 - 4 * 5 := by norm_num
    _ = -26 - 20 := by norm_num
    _ = -46 := by norm_num

/-- Naloga 6a, napaka: z izgubljenim minusom pri 2xy je −6 − 20 + 20 = −6 ≠ −46. -/
theorem n6a_napaka : (-6:ℚ) - 20 + 20 = -6 ∧ (-6:ℚ) ≠ -46 := by norm_num

/-- Naloga 6b (uradni odgovor), pot »Vstavimo vrednosti«: I = 3·0 − 4·(−1,25) + 2·0·(−1,25); členi 0, 5, 0;
I = 0 + 5 + 0 = 5. -/
theorem n6b :
    (3:ℚ) * 0 = 0 ∧ -4 * (-1.25:ℚ) = 5 ∧ (2:ℚ) * 0 * (-1.25) = 0 ∧
    (3:ℚ) * 0 - 4 * (-1.25) + 2 * 0 * (-1.25) = 5 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  calc (3:ℚ) * 0 - 4 * (-1.25) + 2 * 0 * (-1.25) = 0 + 5 + 0 := by norm_num
    _ = 5 := by norm_num

/-- Naloga 6b, pot »Drugače: s premislekom o ničli«: pri x = 0 je I = −4y za vsak y; −4·(−1,25) = 5;
1,25 = 5/4 in 4·5/4 = 5. -/
theorem n6b_pot2 :
    (∀ y : ℚ, 3 * 0 - 4 * y + 2 * 0 * y = -4 * y) ∧ -4 * (-1.25:ℚ) = 5 ∧ (1.25:ℚ) = 5 / 4 ∧
    (4:ℚ) * (5 / 4) = 5 := by
  refine ⟨fun y => by ring, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 6b, napaki: −5 in 0 nista vrednost izraza. -/
theorem n6b_napaka : (3:ℚ) * 0 - 4 * (-1.25) + 2 * 0 * (-1.25) ≠ -5 ∧
    (3:ℚ) * 0 - 4 * (-1.25) + 2 * 0 * (-1.25) ≠ 0 := by norm_num

/-- Naloga 6c (uradni odgovor), pot »Vstavimo in rešimo enačbo«: pri x = −2/3 je I = 0 ⇔
−2 − 4y − (4/3)y = 0 ⇔ −2 − (16/3)y = 0 ⇔ −(16/3)y = 2 ⇔ y = 2 : (−16/3) ⇔ y = −3/8 (edina rešitev). -/
theorem n6c (y : ℝ) : 3 * (-2 / 3) - 4 * y + 2 * (-2 / 3) * y = 0 ↔ y = -3 / 8 := by
  calc 3 * (-2 / 3) - 4 * y + 2 * (-2 / 3) * y = 0 ↔ -2 - 4 * y - 4 / 3 * y = 0 :=
        ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ -2 - 16 / 3 * y = 0 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ -(16 / 3) * y = 2 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ y = 2 / (-(16 / 3)) := by
      rw [show (2:ℝ) / (-(16 / 3)) = -3 / 8 by norm_num]; exact ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ y = -3 / 8 := by norm_num

/-- Naloga 6c, pot 1, računi: −4y − (4/3)y = −(12/3)y − (4/3)y = −(16/3)y; 2 : (−16/3) = 2·(−3/16) = −6/16 = −3/8. -/
theorem n6c_racun (y : ℝ) :
    -4 * y - 4 / 3 * y = -(12 / 3) * y - 4 / 3 * y ∧ -(12 / 3) * y - 4 / 3 * y = -(16 / 3) * y ∧
    (2:ℝ) / (-(16 / 3)) = 2 * (-(3 / 16)) ∧ (2:ℝ) * (-(3 / 16)) = -(6 / 16) ∧ (-(6 / 16) : ℝ) = -3 / 8 := by
  refine ⟨by ring, by ring, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 6c, pot »Drugače: odpravimo ulomke in preizkus«: −2 − 4y − (4/3)y = 0 ⇔ −6 − 12y − 4y = 0 ⇔
−16y = 6 ⇔ y = −6/16 = −3/8. -/
theorem n6c_pot2 (y : ℝ) : -2 - 4 * y - 4 / 3 * y = 0 ↔ y = -3 / 8 := by
  calc -2 - 4 * y - 4 / 3 * y = 0 ↔ -6 - 12 * y - 4 * y = 0 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ -16 * y = 6 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ y = -6 / 16 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ y = -3 / 8 := by norm_num

/-- Naloga 6c, preizkus: za x = −2/3, y = −3/8 je 3x = −2, −4y = 3/2, 2xy = 12/24 = 1/2 in
−2 + 3/2 + 1/2 = 0. -/
theorem n6c_preizkus :
    (3:ℚ) * (-2 / 3) = -2 ∧ -4 * (-3 / 8 : ℚ) = 3 / 2 ∧ 2 * (-2 / 3 : ℚ) * (-3 / 8) = 12 / 24 ∧
    (12 / 24 : ℚ) = 1 / 2 ∧ (-2:ℚ) + 3 / 2 + 1 / 2 = 0 := by norm_num

/-- Naloga 6c, napaka: kdor reši le −2 − 4y = 0, dobi y = −1/2, a tedaj I = −2 + 2 + 2/3 ≠ 0. -/
theorem n6c_napaka :
    (-2:ℚ) - 4 * (-1 / 2) = 0 ∧
    (3:ℚ) * (-2 / 3) - 4 * (-1 / 2) + 2 * (-2 / 3) * (-1 / 2) = -2 + 2 + 2 / 3 ∧ (-2:ℚ) + 2 + 2 / 3 ≠ 0 := by
  norm_num

/-! ## Naloga 7 (kvader v koordinatah: |AB| = 12, |BC| = 5, |CG| = 8) -/

/-- Oglišča kvadra ABCDEFGH v koordinatah (osnovna ploskev ABCD v ravnini z = 0, višina 8). -/
abbrev tA : ℝ × ℝ × ℝ := (0, 0, 0)
abbrev tB : ℝ × ℝ × ℝ := (12, 0, 0)
abbrev tC : ℝ × ℝ × ℝ := (12, 5, 0)
abbrev tD : ℝ × ℝ × ℝ := (0, 5, 0)
abbrev tE : ℝ × ℝ × ℝ := (0, 0, 8)
abbrev tG : ℝ × ℝ × ℝ := (12, 5, 8)
abbrev tH : ℝ × ℝ × ℝ := (0, 5, 8)

/-- Naloga 7a, izjava A (pravilna), pot »Po izjavah«: AB ∥ DC (B − A = C − D), DC ∥ HG (C − D = G − H), torej
AB ∥ HG; premici sta različni (A ne leži na HG), ležita v ravnini ABGH (G = A + (B − A) + (H − A)). -/
theorem n7a_A :
    tB - tA = tC - tD ∧ tC - tD = tG - tH ∧ tB - tA = tG - tH ∧
    (∀ t : ℝ, tH + t • (tG - tH) ≠ tA) ∧ tG = tA + (tB - tA) + (tH - tA) := by
  refine ⟨by simp, by simp, by simp, ?_, by simp⟩
  intro t h
  simp [Prod.ext_iff] at h

/-- Naloga 7a, izjava B (nepravilna): ravnina ADH je x = 0, ravnina BCG je x = 12; ravnini sta disjunktni
(vzporedni nasprotni ploskvi), pravokotni ravnini pa imata skupno premico, zato nista pravokotni. -/
theorem n7a_B :
    tA.1 = 0 ∧ tD.1 = 0 ∧ tH.1 = 0 ∧ tB.1 = 12 ∧ tC.1 = 12 ∧ tG.1 = 12 ∧
    Disjoint {p : ℝ × ℝ × ℝ | p.1 = 0} {p : ℝ × ℝ × ℝ | p.1 = 12} := by
  refine ⟨rfl, rfl, rfl, rfl, rfl, rfl, ?_⟩
  rw [Set.disjoint_left]
  intro p (h1 : p.1 = 0) (h2 : p.1 = 12)
  rw [h1] at h2; norm_num at h2

/-- Naloga 7a, izjava C (pravilna): premica AE prebode osnovno ploskev (z = 0) samo v A, A ne leži na BC,
premici AE in BC se ne sekata in nista vzporedni (smeri (0,0,8) in (0,5,0) nista sorazmerni) – mimobežni. -/
theorem n7a_C :
    (∀ s : ℝ, (tA + s • (tE - tA)).2.2 = 0 ↔ s = 0) ∧ (∀ t : ℝ, tB + t • (tC - tB) ≠ tA) ∧
    (∀ s t : ℝ, tA + s • (tE - tA) ≠ tB + t • (tC - tB)) ∧ (∀ k : ℝ, tE - tA ≠ k • (tC - tB)) := by
  refine ⟨fun s => by simp, ?_, ?_, ?_⟩
  · intro t h; simp [Prod.ext_iff] at h
  · intro s t h; simp [Prod.ext_iff] at h
  · intro k h; simp [Prod.ext_iff] at h

/-- Naloga 7b, pot »Po obrazcu«: površina kvadra je vsota šestih ploskev, po dve skladni:
2ab + 2ac + 2bc = 2(ab + ac + bc). -/
theorem n7b_obrazec (a b c : ℚ) : 2 * (a * b) + 2 * (a * c) + 2 * (b * c) = 2 * (a * b + a * c + b * c) := by
  ring

/-- Naloga 7b (uradni odgovor), pot »Po obrazcu«: ab = 12·5 = 60, ac = 12·8 = 96, bc = 5·8 = 40;
P = 2·(60 + 96 + 40) = 2·196 = 392 cm²; 1 dm² = 100 cm², 392 : 100 = 3,92 dm². -/
theorem n7b :
    (12:ℚ) * 5 = 60 ∧ (12:ℚ) * 8 = 96 ∧ (5:ℚ) * 8 = 40 ∧
    2 * ((12:ℚ) * 5 + 12 * 8 + 5 * 8) = 392 ∧ (10:ℚ) * 10 = 100 ∧ (392:ℚ) / 100 = 3.92 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, by norm_num, by norm_num⟩
  calc 2 * ((12:ℚ) * 5 + 12 * 8 + 5 * 8) = 2 * (60 + 96 + 40) := by norm_num
    _ = 2 * 196 := by norm_num
    _ = 392 := by norm_num

/-- Naloga 7b, pot »Drugače: najprej pretvorimo v dm«: a = 1,2 dm, b = 0,5 dm, c = 0,8 dm; ploskve 0,6, 0,96,
0,4; P = 2·(0,6 + 0,96 + 0,4) = 2·1,96 = 3,92 dm². -/
theorem n7b_pot2 :
    (12:ℚ) / 10 = 1.2 ∧ (5:ℚ) / 10 = 0.5 ∧ (8:ℚ) / 10 = 0.8 ∧
    (1.2:ℚ) * 0.5 = 0.6 ∧ (1.2:ℚ) * 0.8 = 0.96 ∧ (0.5:ℚ) * 0.8 = 0.4 ∧
    2 * ((1.2:ℚ) * 0.5 + 1.2 * 0.8 + 0.5 * 0.8) = 3.92 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  calc 2 * ((1.2:ℚ) * 0.5 + 1.2 * 0.8 + 0.5 * 0.8) = 2 * (0.6 + 0.96 + 0.4) := by norm_num
    _ = 2 * 1.96 := by norm_num
    _ = 3.92 := by norm_num

/-- Naloga 7b, napake: 392 : 10 = 39,2 ≠ 3,92; prostornina 12·5·8 = 480 ≠ 392; brez faktorja 2 je 196 ≠ 392. -/
theorem n7b_napaka :
    (392:ℚ) / 10 = 39.2 ∧ (39.2:ℚ) ≠ 3.92 ∧ (12:ℚ) * 5 * 8 = 480 ∧ (480:ℚ) ≠ 392 ∧
    (60:ℚ) + 96 + 40 = 196 ∧ (196:ℚ) ≠ 392 := by norm_num

/-! ## Naloga 8 -/

/-- Naloga 8a (uradni odgovor), pot »Po korakih«: razdelek 1 000 : 10 = 100 g, tehtnica 1 000 + 3·100 = 1 300 g
(odčitek s slike); 35 dag = 350 g, 25 dag = 250 g, 0,4 kg = 400 g; semena 1 300 − 350 = 950 g; zmes
950 + 250 + 400 = 1 600 g. -/
theorem n8a :
    (1000:ℚ) / 10 = 100 ∧ (1000:ℚ) + 3 * 100 = 1300 ∧ (35:ℚ) * 10 = 350 ∧ (25:ℚ) * 10 = 250 ∧
    (0.4:ℚ) * 1000 = 400 ∧ (1300:ℚ) - 350 = 950 ∧ (950:ℚ) + 250 + 400 = 1600 := by norm_num

/-- Naloga 8a, pot »Drugače: najprej vse na tehtnici«: 1 300 + 250 + 400 = 1 950 g < 2 000 g;
1 950 − 350 = 1 600 g = 1,6 kg. -/
theorem n8a_pot2 :
    (1300:ℚ) + 250 + 400 = 1950 ∧ (1950:ℚ) < 2000 ∧ (1950:ℚ) - 350 = 1600 ∧ (1600:ℚ) / 1000 = 1.6 := by
  norm_num

/-- Naloga 8a, napaka: 35 dag = 350 g, ne 35 g in ne 3 500 g. -/
theorem n8a_napaka : (35:ℚ) * 10 ≠ 35 ∧ (35:ℚ) * 10 ≠ 3500 := by norm_num

/-- Naloga 8b (ura, uradni odgovor B), pot »Po korakih«: 9.45 + 2 h = 11.45; do 12.00 manjka 60 − 45 = 15 min,
ostane 35 − 15 = 20 min: prihod ob 12.20 (v minutah po polnoči: 9·60 + 45 + 2·60 + 35 = 12·60 + 20). -/
theorem n8b_ura :
    (9 * 60 + 45) + 2 * 60 = 11 * 60 + 45 ∧ 60 - 45 = 15 ∧ 35 - 15 = 20 ∧
    (11 * 60 + 45) + 35 = 12 * 60 + 20 := by norm_num

/-- Naloga 8b, pot »Drugače: računamo v minutah in metrih«: 9·60 + 45 = 585, 2·60 + 35 = 155, 585 + 155 = 740,
740 = 12·60 + 20. Ponujeni zapisi: A 11.80 in C 12.80 nista veljavna zapisa ure (80 ≥ 60, 45 + 35 = 80 =
60 + 20), D 11.20 je 680 ≠ 740 minut; pravilni je B 12.20. -/
theorem n8b_ura_pot2 :
    9 * 60 + 45 = 585 ∧ 2 * 60 + 35 = 155 ∧ 585 + 155 = 740 ∧ 740 = 12 * 60 + 20 ∧
    45 + 35 = 80 ∧ 80 = 60 + 20 ∧ 60 ≤ 80 ∧ 11 * 60 + 20 = 680 ∧ 680 ≠ 740 := by norm_num

/-- Naloga 8b (števec, uradni odgovor): 400 m = 0,4 km, pot 126,4 km, 48 736,2 + 126,4 = 48 862,6 km;
pot 2 v metrih: 48 736 200 + 126 400 = 48 862 600 m = 48 862,6 km. -/
theorem n8b_stevec :
    (400:ℚ) / 1000 = 0.4 ∧ (126:ℚ) + 0.4 = 126.4 ∧ (48736.2:ℚ) + 126.4 = 48862.6 ∧
    (48736.2:ℚ) * 1000 = 48736200 ∧ (126:ℚ) * 1000 + 400 = 126400 ∧ (48736200:ℚ) + 126400 = 48862600 ∧
    (48862600:ℚ) / 1000 = 48862.6 := by norm_num

/-- Naloga 8b, napaka: 400 m ni 0,04 km. -/
theorem n8b_napaka : (400:ℚ) / 1000 ≠ 0.04 := by norm_num

/-! ## Naloga 9 -/

/-- Naloga 9a (uradni odgovor), pot »Z razlikami«: razlike 23,2 − 22,6 = 0,6, 23,9 − 23,2 = 0,7,
24,6 − 23,9 = 0,7, 25,2 − 24,6 = 0,6. Če se razlike ponavljajo s periodo 3 (»stalno pravilo«), je
L(41) = 25,2 + 0,7 = 25,9, L(42) = 25,9 + 0,7 = 26,6, L(43) = 26,6 + 0,6 = 27,2 (se ujema s preglednico) in
L(44) = 27,2 + 0,7 = 27,9. -/
theorem n9a (L : ℕ → ℚ) (h36 : L 36 = 22.6) (h37 : L 37 = 23.2) (h38 : L 38 = 23.9) (h39 : L 39 = 24.6)
    (h40 : L 40 = 25.2) (hper : ∀ n, 37 ≤ n → n ≤ 40 → L (n + 4) - L (n + 3) = L (n + 1) - L n) :
    L 37 - L 36 = 0.6 ∧ L 38 - L 37 = 0.7 ∧ L 39 - L 38 = 0.7 ∧ L 40 - L 39 = 0.6 ∧
    L 41 = 25.9 ∧ L 42 = 26.6 ∧ L 43 = 27.2 ∧ L 44 = 27.9 := by
  have e41 := hper 37 (by norm_num) (by norm_num)
  have e42 := hper 38 (by norm_num) (by norm_num)
  have e43 := hper 39 (by norm_num) (by norm_num)
  have e44 := hper 40 (by norm_num) (by norm_num)
  norm_num at e41 e42 e43 e44
  have l41 : L 41 = 25.9 := by
    calc L 41 = 25.2 + 0.7 := by rw [h38, h37, h40] at e41; linarith
      _ = 25.9 := by norm_num
  have l42 : L 42 = 26.6 := by
    calc L 42 = 25.9 + 0.7 := by rw [h39, h38, l41] at e42; linarith
      _ = 26.6 := by norm_num
  have l43 : L 43 = 27.2 := by
    calc L 43 = 26.6 + 0.6 := by rw [h40, h39, l42] at e43; linarith
      _ = 27.2 := by norm_num
  have l44 : L 44 = 27.9 := by
    calc L 44 = 27.2 + 0.7 := by rw [l41, h40, l43] at e44; linarith
      _ = 27.9 := by norm_num
  refine ⟨?_, ?_, ?_, ?_, l41, l42, l43, l44⟩
  · rw [h37, h36]; norm_num
  · rw [h38, h37]; norm_num
  · rw [h39, h38]; norm_num
  · rw [h40, h39]; norm_num

/-- Predpostavke trditve `n9a` se dajo izpolniti (dolžine iz uradne rešitve). -/
example : ∃ L : ℕ → ℚ, L 36 = 22.6 ∧ L 37 = 23.2 ∧ L 38 = 23.9 ∧ L 39 = 24.6 ∧ L 40 = 25.2 ∧
    ∀ n, 37 ≤ n → n ≤ 40 → L (n + 4) - L (n + 3) = L (n + 1) - L n := by
  refine ⟨fun n => if n = 36 then 22.6 else if n = 37 then 23.2 else if n = 38 then 23.9 else
    if n = 39 then 24.6 else if n = 40 then 25.2 else if n = 41 then 25.9 else if n = 42 then 26.6 else
    if n = 43 then 27.2 else 27.9, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  intro n h1 h2
  interval_cases n <;> norm_num

/-- Naloga 9a, pot »Drugače: vsake tri številke 2 cm«: 0,6 + 0,7 + 0,7 = 2; 23,9 + 2 = 25,9, 24,6 + 2 = 26,6,
25,9 + 2 = 27,9; preizkus 25,2 + 2 = 27,2. -/
theorem n9a_pot2 :
    (0.6:ℚ) + 0.7 + 0.7 = 2 ∧ (23.9:ℚ) + 2 = 25.9 ∧ (24.6:ℚ) + 2 = 26.6 ∧ (25.9:ℚ) + 2 = 27.9 ∧
    (25.2:ℚ) + 2 = 27.2 := by norm_num

/-- Naloga 9a, napaka: z razliko 0,6 vsakič dobimo 25,8, 26,4, 27,0 (≠ dana 27,2) in 27,6. -/
theorem n9a_napaka :
    (25.2:ℚ) + 0.6 = 25.8 ∧ (25.8:ℚ) + 0.6 = 26.4 ∧ (26.4:ℚ) + 0.6 = 27.0 ∧ (27.0:ℚ) ≠ 27.2 ∧
    (27.0:ℚ) + 0.6 = 27.6 := by norm_num

/-- Številke čevljev 25 učencev, urejene po velikosti (37: 2, 38: 7, 39: 3, 40: 6, 41: 4, 42: 3). -/
abbrev stevilke : List ℕ :=
  List.replicate 2 37 ++ List.replicate 7 38 ++ List.replicate 3 39 ++ List.replicate 6 40 ++
    List.replicate 4 41 ++ List.replicate 3 42

/-- Dolžina stopala v milimetrih za številko čevlja (iz prve preglednice in 9a). -/
abbrev dolzinaMm (n : ℕ) : ℕ :=
  if n = 37 then 232 else if n = 38 then 239 else if n = 39 then 246 else if n = 40 then 252 else
    if n = 41 then 259 else 266

/-- Naloga 9b.1, pot »Po vrsti« in pot 2: 4 od 25 učencev je 4/25 = 16/100 = 16 %; 100 % : 25 = 4 %,
4·4 % = 16 %. -/
theorem n9b_odstotek :
    stevilke.length = 25 ∧ stevilke.count 41 = 4 ∧ (4:ℚ) / 25 = 16 / 100 ∧ (100:ℚ) / 25 = 4 ∧
    (4:ℚ) * 4 = 16 := by
  refine ⟨by decide, by decide, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 9b.2: modus številk je 38 – vsaka druga številka se pojavi manjkrat kot 38 (7-krat). -/
theorem n9b_modus : stevilke.count 38 = 7 ∧ ∀ k, k ≠ 38 → stevilke.count k < stevilke.count 38 := by
  refine ⟨by decide, fun k hk => ?_⟩
  by_cases hm : k ∈ stevilke
  · have : k = 37 ∨ k = 38 ∨ k = 39 ∨ k = 40 ∨ k = 41 ∨ k = 42 := by
      simp only [stevilke, List.mem_append, List.mem_replicate] at hm; omega
    rcases this with rfl | rfl | rfl | rfl | rfl | rfl <;> first | exact absurd rfl hk | decide
  · rw [List.count_eq_zero_of_not_mem hm]; decide

/-- Naloga 9b.3 (uradni odgovor), pot »Po vrsti«: 2 + 7 = 9, 9 + 3 = 12; seznam 25 številk je urejen,
13. podatek (indeks 12) je 40; dolžine stopal (mm) so prav tako urejene, 13. je 252 mm = 25,2 cm. Pot 2 (od
zgoraj): 3 + 4 = 7, 7 + 6 = 13, tudi 13. od zgoraj je 40. -/
theorem n9b_mediana :
    2 + 7 = 9 ∧ 9 + 3 = 12 ∧ stevilke.Pairwise (· ≤ ·) ∧ stevilke[12]? = some 40 ∧
    (stevilke.map dolzinaMm).Pairwise (· ≤ ·) ∧ (stevilke.map dolzinaMm)[12]? = some 252 ∧
    (252:ℚ) / 10 = 25.2 ∧ 3 + 4 = 7 ∧ 7 + 6 = 13 ∧ stevilke.reverse[12]? = some 40 := by
  refine ⟨by norm_num, by norm_num, by decide, by decide, by decide, by decide, by norm_num, by norm_num,
    by norm_num, by decide⟩

/-- Naloga 9b.4 (uradni odgovor): manjšo številko od 40 nosi 2 + 7 + 3 = 12 učencev, P = 12/25 = 0,48 = 48 %;
pot 2 (nasprotni dogodek): 6 + 4 + 3 = 13, 1 − 13/25 = 12/25. -/
theorem n9b_verjetnost :
    (stevilke.filter (· < 40)).length = 12 ∧ 2 + 7 + 3 = 12 ∧ (12:ℚ) / 25 = 0.48 ∧ (0.48:ℚ) = 48 / 100 ∧
    (stevilke.filter (40 ≤ ·)).length = 13 ∧ 6 + 4 + 3 = 13 ∧ (1:ℚ) - 13 / 25 = 12 / 25 := by
  refine ⟨by decide, by norm_num, by norm_num, by norm_num, by decide, by norm_num, by norm_num⟩

end Evklid.Pole.NPZ9_MAT_2022_redni
