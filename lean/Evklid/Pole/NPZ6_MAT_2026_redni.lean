/-
vir: content/exam-papers/NPZ6-MAT-2026-redni.json
sha256: 2becdb53382803bd2e2f0bb3d3d4e2e1ce47f5bbfb1a98224d8f363b54f6505a
Ni v Leanu:
- pisni postopki (pisno seštevanje, odštevanje z izposojanjem, dopolnjevanje) kot postopek: dokazan je
  vsak zapisani korak kot račun (vsote stolpcev, prenosi, števke), ne sam algoritem;
- 1c, napaka »najprej potenciramo samo 7 (brez oklepaja)«: v razlagi ni števila, zato ni dokazana;
- 2a, 2b: račun s kvadratki je zapisan kot enačba s števkami (vsaka števka < 10), prebranimi iz SVG slike;
  dokazano je, da je rešitev natanko ena (`↔`);
- 2d, napaka »narobe podpisane števke da napačno razliko«: v razlagi ni števila, zato ni dokazana;
- 5: Vennov diagram (risba). Diagram je zapisan kot seznam 26 učencev z množico zank, v katerih je
  sličica (preglednica iz poti »Drugače: najprej preštejemo vsako območje«; zunaj vseh zank 3). Da je
  vsaka sličica iz SVG v tem območju (štiri zasukane elipse), je preverjeno numerično zunaj Leana, ne v
  Leanu (cos 40° ni racionalen; zahtevno, še ni dokazano); vse trditve so dokazane v tem modelu;
- 7a: višine stolpcev so prebrane iz koordinat SVG slike (os 0 pri y = 134, ena črta = 11,8 enote = 1
  učenec; legenda: polnilo 0,12 = 6. a, 0,45 = 6. b, 0,85 = 6. c); dokazano je v tem modelu;
- 7b: »zaslužek sorazmeren vložku« je zapisan kot zaslužek = k · vložek s k iz vsake ponudbe;
- 8: merjenje s kotomerom je merjenje. Oglišča so prebrana iz SVG slike (A(18, 136), B(138, 136),
  C(190,5; 18), D(129,3; 91), os y kaže navzdol; zrcaljenje kotov ne spremeni). Kota sta
  `InnerProductGeometry.angle` v `EuclideanSpace ℝ (Fin 2)`, v stopinjah · 180/π: β = ∠(BA, BC),
  ∠ADC = ∠(DA, DC), podaljšek kraka AD čez D ima smer −DA. Izbočeni kot je *definiran* kot
  δ = 360° − ∠ADC (Lean `angle` je vedno med 0 in π); da je notranji kot pri D izbočen, je utemeljeno s
  tem, da D leži znotraj trikotnika ABC (dokazano z baricentričnimi koeficienti). Dokazano je
  113,5° < β < 114,5° (zato je zaokrožen β = 114°), 151,5° < ∠ADC < 152,5°, 27,5° < podaljšek < 28,5° in
  207,5° < δ < 208,5° (zaokrožen δ = 208°), vse z mejami iz `Real.sin_bound`, `Real.cos_bound`;
- 8a: »štirikotnik« (ime lika) je dokazano s štirimi različnimi oglišči in tem, da A, D, C niso na
  premici (lik se pri D lomi); nekonveksnost z D znotraj trikotnika ABC;
- 9: načrtovanje (geotrikotnik, šestilo, ravnilo) je risba. Pravokotnik je zapisan splošno v ravnini
  `EuclideanSpace ℝ (Fin 2)`: |AB| = 4, |BC| = 3, AB ⟂ BC, D = A + C − B. Dokazano: D je edino
  presečišče vzporednic (pot 1), D je edina točka z |AD| = 3, |CD| = 4 na drugi strani premice AC kot B
  (pot 2; »stran« je zapisana s funkcijo f(P) = ⟨P − B, A − B⟩/16 + ⟨P − B, C − B⟩/9 − 1, ki je na
  premici AC enaka 0, pri B pa −1), pravi koti, |AC| = |BD| = 5, S je edino presečišče premic AC in BD
  in je od oglišč oddaljeno 2,5, razdalja med AC in vzporednico p skozi B je 2,4 (najmanjša razdalja med
  točkama obeh premic, dosežena v nožišču F); 9b je risba (premica sega čez oglišči), brez trditve;
- 9d, »Za radovedne«: ploščina trikotnika kot polovica zmnožka osnovnice in višine je obrazec (ni
  dokazan geometrijsko); dokazan je račun 4 · 3 = 12, 12 : 2 = 6, 5 · h = 12 ⇔ h = 2,4 in neodvisno
  razdalja 2,4;
- razlage napak v besedah; števila iz razlag napak, ki so račun, so dokazana.
Decimalna števila so zapisana v ℚ (decimalni zapis je v ℚ točen), pri kotih in razdaljah v ℝ.
Zaokrožitev je dokazana z `round` (round x = ⌊x + 1/2⌋). ℕ-odštevanje (v ℕ je a − b = 0 pri a < b) je
uporabljeno samo pri a ≥ b; računi z oklepaji so v ℤ. Lean `arccos` je med 0 in π; drugih posebnih
dogovorov (x/0 = 0, √ negativnega = 0) dokazi ne uporabljajo.
-/
module

public import Mathlib

public section

namespace Evklid.Pole.NPZ6_MAT_2026_redni

open Real

/-! ## Naloga 1 -/

/-- Naloga 1a (odgovor): 37 486 + 48 759 = 86 245; zaokroženo na stotice 86 200. -/
theorem n1a_odgovor :
    37486 + 48759 = 86245 ∧ round ((86245 : ℚ) / 100) * 100 = 86200 := by
  refine ⟨by norm_num, ?_⟩
  have h : round ((86245 : ℚ) / 100) = 862 := by
    rw [round_eq, Int.floor_eq_iff]; norm_num
  rw [h]; norm_num

/-- Naloga 1a, »Po korakih (pisno seštevanje)«: enice 6 + 9 = 15 (5, prenos 1), desetice 8 + 5 + 1 = 14,
stotice 4 + 7 + 1 = 12, tisočice 7 + 8 + 1 = 16, desettisočice 3 + 4 + 1 = 8; števke vsote od enic
navzgor so 5, 4, 2, 6, 8. Zaokrožitev: števka stotic je 2, števka desetic 4 < 5, zato navzdol: 86 200. -/
theorem n1a_pot1 :
    6 + 9 = 5 + 10 ∧ 8 + 5 + 1 = 4 + 10 ∧ 4 + 7 + 1 = 2 + 10 ∧ 7 + 8 + 1 = 6 + 10 ∧ 3 + 4 + 1 = 8 ∧
    Nat.digits 10 86245 = [5, 4, 2, 6, 8] ∧
    5 + 4 * 10 + 2 * 100 + 6 * 1000 + 8 * 10000 = 86245 ∧
    (86245 / 100) % 10 = 2 ∧ (86245 / 10) % 10 = 4 ∧ 4 < 5 ∧
    round ((86245 : ℚ) / 100) * 100 = 86200 := by
  refine ⟨rfl, rfl, rfl, rfl, rfl, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    n1a_odgovor.2⟩

/-- Naloga 1a, »Drugače: po delih in s preizkusom«: (37 000 + 48 000) + (486 + 759) = 85 000 + 1 245 =
86 245; preizkus 86 245 − 48 759 = 37 486; ocena 37 500 + 48 800 = 86 300; 86 200 ≤ 86 245 ≤ 86 300,
od 86 200 je 45, od 86 300 pa 55, 45 < 55. -/
theorem n1a_pot2 :
    37486 + 48759 = (37000 + 48000) + (486 + 759) ∧ (37000 + 48000) + (486 + 759) = 85000 + 1245 ∧
    85000 + 1245 = 86245 ∧ 86245 - 48759 = 37486 ∧ 37500 + 48800 = 86300 ∧
    86200 ≤ 86245 ∧ 86245 ≤ 86300 ∧ 86245 - 86200 = 45 ∧ 86300 - 86245 = 55 ∧ 45 < 55 := by
  decide

/-- Naloga 1a, napaka: zaokrožitev 86 300 je napačna (pravilno 86 200); zadnja števka je 5, števka
desetic pa 4. -/
theorem n1a_napaka :
    round ((86245 : ℚ) / 100) * 100 ≠ 86300 ∧ 86245 % 10 = 5 ∧ (86245 / 10) % 10 = 4 := by
  refine ⟨by rw [n1a_odgovor.2]; norm_num, by norm_num, by norm_num⟩

/-- Naloga 1b (odgovor): 8 203 − (3 465 − 1 278) = 6 016. -/
theorem n1b_odgovor : (8203 : ℤ) - (3465 - 1278) = 6016 := by norm_num

/-- Naloga 1b, »Po korakih (najprej oklepaj)«: oklepaj 3 465 − 1 278 = 2 187 (enice 15 − 8 = 7, desetice
15 − 7 = 8, stotice 3 − 2 = 1, tisočice 3 − 1 = 2), nato 8 203 − 2 187 = 6 016; preizkus
6 016 + 2 187 = 8 203. -/
theorem n1b_pot1 :
    (15 : ℤ) - 8 = 7 ∧ (15 : ℤ) - 7 = 8 ∧ (3 : ℤ) - 2 = 1 ∧ (3 : ℤ) - 1 = 2 ∧
    (3465 : ℤ) - 1278 = 2 * 1000 + 1 * 100 + 8 * 10 + 7 ∧
    (8203 : ℤ) - (3465 - 1278) = 8203 - 2187 ∧ (8203 : ℤ) - 2187 = 6016 ∧ (6016 : ℤ) + 2187 = 8203 := by
  norm_num

/-- Naloga 1b, »Drugače: odpravimo oklepaj«: a − (b − c) = a − b + c (v splošnem), zato
8 203 − (3 465 − 1 278) = 8 203 − 3 465 + 1 278 = 4 738 + 1 278 = 6 016. -/
theorem n1b_pot2 :
    (∀ a b c : ℤ, a - (b - c) = a - b + c) ∧ (8203 : ℤ) - 3465 = 4738 ∧ (4738 : ℤ) + 1278 = 6016 := by
  refine ⟨fun a b c => by ring, by norm_num, by norm_num⟩

/-- Naloga 1b, »Drugače: odpravimo oklepaj« kot veriga: 8 203 − (3 465 − 1 278) = 8 203 − 3 465 + 1 278 =
4 738 + 1 278 = 6 016. -/
theorem n1b_pot2_veriga : (8203 : ℤ) - (3465 - 1278) = 6016 := by
  calc (8203 : ℤ) - (3465 - 1278) = 8203 - 3465 + 1278 := by ring
    _ = 4738 + 1278 := by norm_num
    _ = 6016 := by norm_num

/-- Naloga 1b, napaka: brez oklepaja 8 203 − 3 465 − 1 278 = 3 460 ≠ 6 016. -/
theorem n1b_napaka : (8203 : ℤ) - 3465 - 1278 = 3460 ∧ (3460 : ℤ) ≠ 6016 := by norm_num

/-- Naloga 1c (odgovor in pot »Po korakih«): (12 − 7)³ − 4² = 5³ − 4² = 125 − 16 = 109, kjer je
5³ = 5 · 5 · 5 = 125 in 4² = 4 · 4 = 16. -/
theorem n1c_pot1 : ((12 : ℤ) - 7) ^ 3 - 4 ^ 2 = 109 ∧ (5 : ℤ) ^ 3 = 5 * 5 * 5 ∧ (5 : ℤ) * 5 * 5 = 125 ∧
    (4 : ℤ) ^ 2 = 4 * 4 ∧ (4 : ℤ) * 4 = 16 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  calc ((12 : ℤ) - 7) ^ 3 - 4 ^ 2 = 5 ^ 3 - 4 ^ 2 := by norm_num
    _ = 125 - 16 := by norm_num
    _ = 109 := by norm_num

/-- Naloga 1c, »Drugače: potence zapišemo kot zmnožke«: (12 − 7)³ − 4² = 5 · 5 · 5 − 4 · 4,
5 · 5 · 5 = 25 · 5 = 125, 4 · 4 = 16, 125 − 16 = 109; preizkus 109 + 16 = 125 = 5³. -/
theorem n1c_pot2 : ((12 : ℤ) - 7) ^ 3 - 4 ^ 2 = 5 * 5 * 5 - 4 * 4 ∧ (5 : ℤ) * 5 * 5 = 25 * 5 ∧
    (25 : ℤ) * 5 = 125 ∧ (4 : ℤ) * 4 = 16 ∧ (125 : ℤ) - 16 = 109 ∧ (109 : ℤ) + 16 = 125 ∧
    (125 : ℤ) = 5 ^ 3 := by
  norm_num

/-- Naloga 1c, napaka: 5³ ni 5 · 3 = 15 in 4² ni 4 · 2 = 8. -/
theorem n1c_napaka : (5 : ℤ) * 3 = 15 ∧ (5 : ℤ) ^ 3 ≠ 15 ∧ (4 : ℤ) * 2 = 8 ∧ (4 : ℤ) ^ 2 ≠ 8 := by
  norm_num

/-! ## Naloga 2 -/

/-- Naloga 2a (odgovor): račun 2□47 + 13□5 + 96□ = □900 (števke a, b, c, d < 10 po vrsti od zgoraj
navzdol, prebrane iz slike) ima natanko eno rešitev a = 5, b = 8, c = 8, d = 4, to je
2 547 + 1 385 + 968 = 4 900. -/
theorem n2a_odgovor (a b c d : ℕ) (ha : a < 10) (hb : b < 10) (hc : c < 10) (_hd : d < 10) :
    (2000 + 100 * a + 47) + (1300 + 10 * b + 5) + (960 + c) = 1000 * d + 900 ↔
      a = 5 ∧ b = 8 ∧ c = 8 ∧ d = 4 := by
  omega

/-- Predpostavke `n2a_odgovor` so izpolnljive. -/
example : (5 : ℕ) < 10 ∧ (8 : ℕ) < 10 ∧ (8 : ℕ) < 10 ∧ (4 : ℕ) < 10 := by norm_num

/-- Naloga 2a, »Po stolpcih od desne proti levi«: enice 7 + 5 = 12, 12 + 8 = 20 (0, prenos 2);
desetice 4 + □ + 6 + 2 = 12 + □, edina števka s koncem 0 je 8 (12 + 8 = 20, prenos 2); stotice
□ + 3 + 9 + 2 = □ + 14, edina števka s koncem 9 je 5 (5 + 14 = 19, prenos 1); tisočice 2 + 1 + 1 = 4;
2 547 + 1 385 + 968 = 4 900. -/
theorem n2a_pot1 :
    7 + 5 = 12 ∧ 12 + 8 = 20 ∧ (∀ x < 10, (7 + 5 + x) % 10 = 0 ↔ x = 8) ∧
    (∀ x < 10, 4 + x + 6 + 2 = 12 + x) ∧ (∀ x < 10, (12 + x) % 10 = 0 ↔ x = 8) ∧ 12 + 8 = 20 ∧
    (∀ x < 10, x + 3 + 9 + 2 = x + 14) ∧ (∀ x < 10, (x + 14) % 10 = 9 ↔ x = 5) ∧ 5 + 14 = 19 ∧
    2 + 1 + 1 = 4 ∧ 2547 + 1385 + 968 = 4900 := by
  refine ⟨rfl, rfl, ?_, ?_, ?_, rfl, ?_, ?_, rfl, rfl, rfl⟩ <;> intro x hx <;> omega

/-- Naloga 2a, »Drugače: najprej seštejemo znane dele«: 2 047 + 1 305 + 960 = 4 312; manjkajoče števke
dodajo največ 900 + 90 + 9 = 999, vsota je med 4 312 in 5 311; edino tako število s koncem 900 je
4 900; 4 900 − 4 312 = 588 = 5 · 100 + 8 · 10 + 8; preizkus 2 547 + 1 385 = 3 932, 3 932 + 968 = 4 900. -/
theorem n2a_pot2 :
    2047 + 1305 + 960 = 4312 ∧ 900 + 90 + 9 = 999 ∧ 4312 + 999 = 5311 ∧
    (∀ a b c : ℕ, a < 10 → b < 10 → c < 10 →
      4312 ≤ 4312 + 100 * a + 10 * b + c ∧ 4312 + 100 * a + 10 * b + c ≤ 5311) ∧
    (∀ n : ℕ, 4312 ≤ n → n ≤ 5311 → (n % 1000 = 900 ↔ n = 4900)) ∧
    4900 - 4312 = 588 ∧ 588 = 5 * 100 + 8 * 10 + 8 ∧ 2547 + 1385 = 3932 ∧ 3932 + 968 = 4900 := by
  refine ⟨rfl, rfl, rfl, ?_, ?_, rfl, rfl, rfl, rfl⟩
  · intro a b c ha hb hc; omega
  · intro n h1 h2; omega

/-- Naloga 2a, napaka: kdor pri deseticah pozabi prenos 2, dobi 4 + □ + 6 s koncem 0 in števko 0
namesto 8. -/
theorem n2a_napaka : (∀ x < 10, (4 + x + 6) % 10 = 0 ↔ x = 0) ∧ (0 : ℕ) ≠ 8 := by
  refine ⟨fun x hx => by omega, by norm_num⟩

/-- Naloga 2b (odgovor): račun □3,0□ − 2□,□8 = 45,37 (v stotinkah, števke x, y zgoraj in z, w spodaj,
vse < 10) ima natanko eno rešitev x = 7, y = 5, z = 7, w = 6: 73,05 − 27,68 = 45,37. Zapisano kot
seštevanje (zmanjševanec = odštevanec + razlika), da ni ℕ-odštevanja. -/
theorem n2b_odgovor (x y z w : ℕ) (_hx : x < 10) (hy : y < 10) (hz : z < 10) (hw : w < 10) :
    1000 * x + 300 + 0 * 10 + y = (2000 + 100 * z + 10 * w + 8) + 4537 ↔
      x = 7 ∧ y = 5 ∧ z = 7 ∧ w = 6 := by
  omega

/-- Predpostavke `n2b_odgovor` so izpolnljive. -/
example : (7 : ℕ) < 10 ∧ (5 : ℕ) < 10 ∧ (7 : ℕ) < 10 ∧ (6 : ℕ) < 10 := by norm_num

/-- Naloga 2b, odgovor v decimalnih številih: 73,05 − 27,68 = 45,37. -/
theorem n2b_racun : (73.05 : ℚ) - 27.68 = 45.37 := by norm_num

/-- Naloga 2b, »Po stolpcih od desne (z izposojanjem)«: stotinke □ − 8 = 7 brez izposoje bi potrebovala
15 > 9, z izposojo 15 − 8 = 7 (zgoraj 5); desetinke 10 − 1 − □ = 3, 9 − □ = 3, □ = 6; enice
13 − 1 − □ = 5, □ = 7; desetice □ − 1 − 2 = 4, □ = 7. -/
theorem n2b_pot1 :
    7 + 8 = 15 ∧ 9 < 15 ∧ 15 - 8 = 7 ∧
    (10 - 1 = 9) ∧ (∀ s < 10, 9 - s = 3 ↔ s = 6) ∧
    (∀ s < 10, 13 - 1 - s = 5 ↔ s = 7) ∧ (∀ s < 10, s ≥ 3 → (s - 1 - 2 = 4 ↔ s = 7)) := by
  refine ⟨rfl, by norm_num, rfl, rfl, ?_, ?_, ?_⟩
  · intro s hs; omega
  · intro s hs; omega
  · intro s hs h3; omega

/-- Naloga 2b, »Drugače: s seštevanjem«: stotinke 7 + 8 = 15 (5, prenos 1); desetinke 3 + □ + 1 s
koncem 0 ⇔ □ = 6 (3 + 6 + 1 = 10); enice 5 + □ + 1 s koncem 3 ⇔ □ = 7 (5 + 7 + 1 = 13); desetice
4 + 2 + 1 = 7; preizkus 45,37 + 27,68 = 73,05. -/
theorem n2b_pot2 :
    7 + 8 = 15 ∧ (∀ s < 10, (3 + s + 1) % 10 = 0 ↔ s = 6) ∧ 3 + 6 + 1 = 10 ∧
    (∀ s < 10, (5 + s + 1) % 10 = 3 ↔ s = 7) ∧ 5 + 7 + 1 = 13 ∧ 4 + 2 + 1 = 7 ∧
    (45.37 : ℚ) + 27.68 = 73.05 := by
  refine ⟨rfl, ?_, rfl, ?_, rfl, rfl, by norm_num⟩ <;> intro s hs <;> omega

/-- Naloga 2b, napaka: 8 − □ = 7 da □ = 1, a zgoraj je zmanjševanec; □ − 8 = 7 brez izposoje nima
rešitve med števkami, z izposojo je 15 − 8 = 7, zgoraj 5. -/
theorem n2b_napaka :
    (∀ s < 10, (8 : ℤ) - s = 7 ↔ s = 1) ∧ (∀ s < 10, (s : ℤ) - 8 ≠ 7) ∧ (15 : ℤ) - 8 = 7 := by
  refine ⟨fun s _ => by omega, fun s hs => by omega, by norm_num⟩

/-- Naloga 2c (odgovor): zaporedje 0,15; 0,6; 2,4; x; 38,4 z istim faktorjem q je natanko q = 4,
x = 9,6. -/
theorem n2c_odgovor (q x : ℚ) :
    (0.15 * q = 0.6 ∧ 0.6 * q = 2.4 ∧ 2.4 * q = x ∧ x * q = 38.4) ↔ (q = 4 ∧ x = 9.6) := by
  constructor
  · rintro ⟨h1, h2, h3, h4⟩
    have hq : q = 4 := by linarith
    subst hq
    exact ⟨rfl, by linarith⟩
  · rintro ⟨rfl, rfl⟩
    norm_num

/-- Naloga 2c, »Poiščemo število, s katerim množimo«: 0,15 · 2 = 0,3, 0,15 · 4 = 0,6, 0,6 · 4 = 2,4,
2,4 · 4 = 9,6, preizkus 9,6 · 4 = 38,4. -/
theorem n2c_pot1 :
    (0.15 : ℚ) * 2 = 0.3 ∧ (0.15 : ℚ) * 4 = 0.6 ∧ (0.6 : ℚ) * 4 = 2.4 ∧ (2.4 : ℚ) * 4 = 9.6 ∧
    (9.6 : ℚ) * 4 = 38.4 := by norm_num

/-- Naloga 2c, »Drugače: od zadaj«: 38,4 : 4 = 9,6 in 9,6 : 4 = 2,4. -/
theorem n2c_pot2 : (38.4 : ℚ) / 4 = 9.6 ∧ (9.6 : ℚ) / 4 = 2.4 := by norm_num

/-- Naloga 2c, napaka: prištevanje 1,8 (= 2,4 − 0,6) da 4,2, a 4,2 · 4 = 16,8 ≠ 38,4. -/
theorem n2c_napaka :
    (2.4 : ℚ) - 0.6 = 1.8 ∧ (2.4 : ℚ) + 1.8 = 4.2 ∧ (4.2 : ℚ) * 4 = 16.8 ∧ (4.2 : ℚ) * 4 ≠ 38.4 := by
  norm_num

/-- Naloga 2d (odgovor): zaporedje 3,75; x; 5,45; 6,3; 7,15 z isto razliko d je natanko d = 0,85,
x = 4,6. -/
theorem n2d_odgovor (d x : ℚ) :
    (3.75 + d = x ∧ x + d = 5.45 ∧ 5.45 + d = 6.3 ∧ 6.3 + d = 7.15) ↔ (d = 0.85 ∧ x = 4.6) := by
  constructor
  · rintro ⟨h1, h2, h3, h4⟩
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩
    norm_num

/-- Naloga 2d, »Poiščemo razliko«: 6,3 − 5,45 = 6,30 − 5,45 = 0,85; 7,15 − 6,3 = 0,85;
3,75 + 0,85 = 4,6; preizkus 4,6 + 0,85 = 5,45. -/
theorem n2d_pot1 :
    (6.3 : ℚ) - 5.45 = 6.30 - 5.45 ∧ (6.30 : ℚ) - 5.45 = 0.85 ∧ (7.15 : ℚ) - 6.3 = 0.85 ∧
    (3.75 : ℚ) + 0.85 = 4.6 ∧ (4.6 : ℚ) + 0.85 = 5.45 := by norm_num

/-- Naloga 2d, »Drugače: dva koraka hkrati«: 5,45 − 3,75 = 1,7; 1,7 : 2 = 0,85; 3,75 + 0,85 = 4,6. -/
theorem n2d_pot2 : (5.45 : ℚ) - 3.75 = 1.7 ∧ (1.7 : ℚ) / 2 = 0.85 ∧ (3.75 : ℚ) + 0.85 = 4.6 := by
  norm_num

/-! ## Naloga 3 -/

/-- Naloga 3a (odgovor in pot): 250 min = x h 10 min natanko pri x = 4 (1 h = 60 min);
250 − 10 = 240 = 4 · 60. -/
theorem n3a (x : ℚ) : (250 = x * 60 + 10 ↔ x = 4) ∧ (250 : ℚ) - 10 = 240 ∧ (4 : ℚ) * 60 = 240 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num⟩

/-- Naloga 3a, napaka: 2 h 50 min je 170 min, ne 250 min. -/
theorem n3a_napaka : (2 : ℚ) * 60 + 50 = 170 ∧ (170 : ℚ) ≠ 250 := by norm_num

/-- Naloga 3b (odgovor in pot): 93 dm = x m (1 m = 10 dm) natanko pri x = 9,3; 93 : 10 = 9,3 = 9 + 3/10
(9 m in 3 dm). -/
theorem n3b (x : ℚ) : (93 = x * 10 ↔ x = 9.3) ∧ (93 : ℚ) / 10 = 9.3 ∧ (9.3 : ℚ) = 9 + 3 / 10 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num⟩

/-- Naloga 3b, napaka: 93 · 10 = 930 metrov bi bilo več kot 93, metrov pa mora biti manj. -/
theorem n3b_napaka : (93 : ℚ) * 10 = 930 ∧ (93 : ℚ) < 930 ∧ (9.3 : ℚ) < 93 := by norm_num

/-- Naloga 3c (odgovor in pot): 2 m x dm 5 cm = 275 cm natanko pri x = 7; 275 = 200 + 70 + 5. -/
theorem n3c (x : ℚ) : (2 * 100 + x * 10 + 5 = 275 ↔ x = 7) ∧ (275 : ℚ) = 200 + 70 + 5 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num⟩

/-- Naloga 3c, napaka: 75 dm = 750 cm; 275 − 200 = 75 cm = 7 dm 5 cm. -/
theorem n3c_napaka : (75 : ℚ) * 10 = 750 ∧ (275 : ℚ) - 200 = 75 ∧ (75 : ℚ) = 7 * 10 + 5 := by norm_num

/-- Naloga 3d (odgovor in pot): 1 kg 50 g = 1 000 g + 50 g = 1 050 g. -/
theorem n3d (x : ℚ) : (1 * 1000 + 50 = x ↔ x = 1050) ∧ (1000 : ℚ) + 50 = 1050 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num⟩

/-- Naloga 3d, napaka: 150 g ≠ 1 050 g (kilogram ima 1 000 g, ne 100 g). -/
theorem n3d_napaka : (1 : ℚ) * 100 + 50 = 150 ∧ (150 : ℚ) ≠ 1050 := by norm_num

/-- Naloga 3e (odgovor in pot): 3 t 40 kg = 3 000 kg + 40 kg = 3 040 kg; 3 040 · 100 = 304 000 dag. -/
theorem n3e (x : ℚ) :
    ((3 * 1000 + 40) * 100 = x ↔ x = 304000) ∧ (3000 : ℚ) + 40 = 3040 ∧ (3040 : ℚ) * 100 = 304000 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num⟩

/-- Naloga 3e, napaka: 3 400 kg · 100 = 340 000 dag ≠ 304 000 dag. -/
theorem n3e_napaka : (3400 : ℚ) * 100 = 340000 ∧ (340000 : ℚ) ≠ 304000 ∧ (3400 : ℚ) ≠ 3040 := by
  norm_num

/-! ## Naloga 4 -/

/-- Naloga 4 (b, c): sistem a + b + c = 2 860, a + b = 1 730, b + c = 2 040 (masa v posameznem tednu)
ima natanko rešitev a = 820, b = 910, c = 1 130. -/
theorem n4_sistem (a b c : ℚ) :
    (a + b + c = 2860 ∧ a + b = 1730 ∧ b + c = 2040) ↔ (a = 820 ∧ b = 910 ∧ c = 1130) := by
  constructor
  · rintro ⟨h1, h2, h3⟩
    refine ⟨by linarith, by linarith, by linarith⟩
  · rintro ⟨rfl, rfl, rfl⟩
    norm_num

/-- Naloga 4a (odgovor in pot »Po korakih«): 2 860 · 0,07 = 200,20; 2 860 · 7 = 20 020, dve decimalni
mesti: 20 020 / 100 = 200,20. -/
theorem n4a_pot1 : (2860 : ℚ) * 0.07 = 200.20 ∧ (2860 : ℚ) * 7 = 20020 ∧ (20020 : ℚ) / 100 = 200.20 := by
  norm_num

/-- Naloga 4a, »Drugače: v centih«: 0,07 € = 7 centov; 2 860 · 7 = 20 020 centov = 200 € in 20 centov. -/
theorem n4a_pot2 :
    (0.07 : ℚ) * 100 = 7 ∧ 2860 * 7 = 20020 ∧ 20020 = 200 * 100 + 20 ∧ (200 : ℚ) + 20 / 100 = 200.20 := by
  norm_num

/-- Naloga 4a, »Drugače: po delih«: 1 000 kg → 70 €, 2 000 kg → 140 €, 800 kg → 8 · 7 = 56 €,
60 kg → 60 · 0,07 = 4,2 €; 2 000 + 800 + 60 = 2 860; 140 + 56 + 4,2 = 200,2. -/
theorem n4a_pot3 :
    (1000 : ℚ) * 0.07 = 70 ∧ (2000 : ℚ) * 0.07 = 140 ∧ (800 : ℚ) * 0.07 = 8 * 7 ∧ (8 : ℚ) * 7 = 56 ∧
    (60 : ℚ) * 0.07 = 4.2 ∧ (2000 : ℚ) + 800 + 60 = 2860 ∧ (140 : ℚ) + 56 + 4.2 = 200.2 := by
  norm_num

/-- Naloga 4a, napaka: 20,02 € in 2 002 € nista 200,20 €; ocena 3 000 · 0,07 = 210. -/
theorem n4a_napaka :
    (20.02 : ℚ) ≠ 2860 * 0.07 ∧ (2002 : ℚ) ≠ 2860 * 0.07 ∧ (3000 : ℚ) * 0.07 = 210 := by norm_num

/-- Naloga 4b (odgovor, pot »Po korakih«): 2 860 − 2 040 = 820. -/
theorem n4b_pot1 : (2860 : ℚ) - 2040 = 820 := by norm_num

/-- Naloga 4b, »Drugače: s sliko (trakovi)«: 2 040 + 820 = 2 860. -/
theorem n4b_pot2 : (2040 : ℚ) + 820 = 2860 := by norm_num

/-- Naloga 4b, napaka: 2 860 − 1 730 = 1 130 je masa 3. tedna, ne 1. tedna (820). -/
theorem n4b_napaka : (2860 : ℚ) - 1730 = 1130 ∧ (1130 : ℚ) ≠ 820 := by norm_num

/-- Naloga 4c, »Po korakih (s prvim tednom)«: 1 730 − 820 = 910; preizkus 2 040 − 910 = 1 130 in
820 + 910 + 1 130 = 2 860. -/
theorem n4c_pot1 :
    (1730 : ℚ) - 820 = 910 ∧ (2040 : ℚ) - 910 = 1130 ∧ (820 : ℚ) + 910 + 1130 = 2860 := by norm_num

/-- Naloga 4c, »Drugače: najprej tretji teden«: 2 860 − 1 730 = 1 130; 2 040 − 1 130 = 910. -/
theorem n4c_pot2 : (2860 : ℚ) - 1730 = 1130 ∧ (2040 : ℚ) - 1130 = 910 := by norm_num

/-- Naloga 4c, »Drugače: drugi teden je štet dvakrat«: (a + b) + (b + c) − (a + b + c) = b in
1 730 + 2 040 = 3 770, 3 770 − 2 860 = 910. -/
theorem n4c_pot3 :
    (∀ a b c : ℚ, (a + b) + (b + c) - (a + b + c) = b) ∧ (1730 : ℚ) + 2040 = 3770 ∧
    (3770 : ℚ) - 2860 = 910 := by
  refine ⟨fun a b c => by ring, by norm_num, by norm_num⟩

/-- Naloga 4c, napaka: 2 860 : 3 je približno 953 (953 < 2 860/3 < 954), kar ni 910. -/
theorem n4c_napaka : (953 : ℚ) < 2860 / 3 ∧ (2860 : ℚ) / 3 < 954 ∧ (2860 : ℚ) / 3 ≠ 910 := by norm_num

/-! ## Naloga 5 (model Vennovega diagrama) -/

/-- Zanke: 0 = pevski zbor (Z), 1 = robotika (R), 2 = šah (Š), 3 = planinski krožek (K). Vsak učenec je
množica zank, v katerih je njegova sličica (preglednica poti »Drugače: najprej preštejemo vsako
območje«; zunaj vseh zank 3 učenci). -/
def ucenci : List (Finset (Fin 4)) :=
  List.replicate 3 {0} ++ List.replicate 2 {1} ++ List.replicate 4 {2} ++ List.replicate 2 {3} ++
  List.replicate 2 {0, 1} ++ List.replicate 1 {0, 2} ++ List.replicate 1 {1, 2} ++
  List.replicate 1 {1, 3} ++ List.replicate 2 {2, 3} ++ List.replicate 0 {0, 3} ++
  List.replicate 1 {0, 1, 2} ++ List.replicate 1 {0, 2, 3} ++ List.replicate 1 {1, 2, 3} ++
  List.replicate 0 {0, 1, 3} ++ List.replicate 2 {0, 1, 2, 3} ++ List.replicate 3 ∅

/-- Število učencev, ki obiskujejo (vsaj) vse dejavnosti iz S. -/
def obiskuje (S : Finset (Fin 4)) : ℕ := (ucenci.filter (fun r => decide (S ⊆ r))).length

/-- Število učencev v območju r (natanko zanke iz r). -/
def obmocje (r : Finset (Fin 4)) : ℕ := (ucenci.filter (fun s => decide (s = r))).length

/-- Naloga 5: diagram ima 26 sličic (učencev). -/
theorem n5_skupaj : ucenci.length = 26 := by decide

/-- Naloga 5a (odgovor): A pravilna (Z in R: 5), B nepravilna (Š in K: 6 ≠ 2), C pravilna (R, Š in K: 3). -/
theorem n5a_odgovor :
    obiskuje {0, 1} = 5 ∧ obiskuje {2, 3} = 6 ∧ obiskuje {2, 3} ≠ 2 ∧ obiskuje {1, 2, 3} = 3 := by
  decide

/-- Naloga 5a, »Po korakih: štejemo vse dele preseka«: A = 2 + 1 + 2 (samo Z, R; Z, R, Š; vse štiri),
B = 2 + 1 + 1 + 2 (samo Š, K; Z, Š, K; R, Š, K; vse štiri), C = 1 + 2 (samo R, Š, K; vse štiri); 2 je
število učencev samo v Š in K. -/
theorem n5a_pot1 :
    obmocje {0, 1} = 2 ∧ obmocje {0, 1, 2} = 1 ∧ obmocje {0, 1, 2, 3} = 2 ∧ 2 + 1 + 2 = 5 ∧
    obmocje {2, 3} = 2 ∧ obmocje {0, 2, 3} = 1 ∧ obmocje {1, 2, 3} = 1 ∧ 2 + 1 + 1 + 2 = 6 ∧
    1 + 2 = 3 := by
  decide

/-- Naloga 5a, »Drugače: najprej preštejemo vsako območje«: vsa števila iz preglednice in vsote
A: 2 + 1 + 0 + 2 = 5, B: 2 + 1 + 1 + 2 = 6, C: 1 + 2 = 3. -/
theorem n5a_pot2 :
    obmocje {0} = 3 ∧ obmocje {1} = 2 ∧ obmocje {2} = 4 ∧ obmocje {3} = 2 ∧
    obmocje {0, 1} = 2 ∧ obmocje {0, 2} = 1 ∧ obmocje {1, 2} = 1 ∧
    obmocje {1, 3} = 1 ∧ obmocje {2, 3} = 2 ∧ obmocje {0, 3} = 0 ∧
    obmocje {0, 1, 2} = 1 ∧ obmocje {0, 2, 3} = 1 ∧ obmocje {1, 2, 3} = 1 ∧ obmocje {0, 1, 3} = 0 ∧
    obmocje {0, 1, 2, 3} = 2 ∧ 2 + 1 + 0 + 2 = 5 ∧ 2 + 1 + 1 + 2 = 6 ∧ 1 + 2 = 3 := by
  decide

/-- Naloga 5b (odgovor in pot): natanko eno dejavnost obiskuje 3 + 2 + 4 + 2 = 11 učencev; zunaj vseh
zank so 3 učenci (ne štejejo). -/
theorem n5b :
    (ucenci.filter (fun r => decide (r.card = 1))).length = 11 ∧ 3 + 2 + 4 + 2 = 11 ∧
    obmocje ∅ = 3 := by
  decide

/-- Naloga 5c (odgovor in pot): vse štiri dejavnosti obiskujeta 2 učenca. -/
theorem n5c : obiskuje {0, 1, 2, 3} = 2 := by decide

/-! ## Naloga 6 -/

/-- Naloga 6a (odgovor in pot »Po korakih«): 12 · 0,45 = 5,40; 12 · 45 = 540, dve decimalni mesti. -/
theorem n6a_pot1 : (12 : ℚ) * 0.45 = 5.40 ∧ 12 * 45 = 540 ∧ (540 : ℚ) / 100 = 5.40 := by norm_num

/-- Naloga 6a, »Drugače: po delih«: 10 · 0,45 = 4,5; 2 · 0,45 = 0,9; 4,5 + 0,9 = 5,4. -/
theorem n6a_pot2 : (10 : ℚ) * 0.45 = 4.5 ∧ (2 : ℚ) * 0.45 = 0.9 ∧ (4.5 : ℚ) + 0.9 = 5.4 := by norm_num

/-- Naloga 6a, napaka: 54 € in 0,54 € nista 12 · 0,45; ocena 0,45 < 0,5, zato 12 · 0,45 < 12 · 0,5 = 6. -/
theorem n6a_napaka :
    (54 : ℚ) ≠ 12 * 0.45 ∧ (0.54 : ℚ) ≠ 12 * 0.45 ∧ (0.45 : ℚ) < 0.5 ∧ (12 : ℚ) * 0.45 < 12 * 0.5 ∧
    (12 : ℚ) * 0.5 = 6 := by norm_num

/-- Naloga 6b (odgovor in pot »Po vrsticah«): 12 · 0,45 = 5,40; 3 · 1,29 = 3,87; 2 · 1,85 = 3,70;
piškoti 2,39; 4 · 0,69 = 2,76; 5,40 + 3,87 + 3,70 + 2,39 + 2,76 = 18,12. -/
theorem n6b_pot1 :
    (12 : ℚ) * 0.45 = 5.40 ∧ (3 : ℚ) * 1.29 = 3.87 ∧ (2 : ℚ) * 1.85 = 3.70 ∧ (1 : ℚ) * 2.39 = 2.39 ∧
    (4 : ℚ) * 0.69 = 2.76 ∧ (5.40 : ℚ) + 3.87 + 3.70 + 2.39 + 2.76 = 18.12 := by norm_num

/-- Naloga 6b, »Drugače: posebej evri, posebej centi«: 5 + 3 + 3 + 2 + 2 = 15, 40 + 87 + 70 + 39 + 76 = 312
centov = 3 € 12 centov, 15 + 3,12 = 18,12. -/
theorem n6b_pot2 :
    5 + 3 + 3 + 2 + 2 = 15 ∧ 40 + 87 + 70 + 39 + 76 = 312 ∧ 312 = 3 * 100 + 12 ∧
    (15 : ℚ) + 3.12 = 18.12 ∧
    (5.40 : ℚ) + 3.87 + 3.70 + 2.39 + 2.76 = (5 + 3 + 3 + 2 + 2) + (40 + 87 + 70 + 39 + 76) / 100 := by
  norm_num

/-- Naloga 6b, napaka: samo cene iz cenika: 0,45 + 1,29 + 1,85 + 2,39 + 0,69 = 6,67 ≠ 18,12. -/
theorem n6b_napaka : (0.45 : ℚ) + 1.29 + 1.85 + 2.39 + 0.69 = 6.67 ∧ (6.67 : ℚ) ≠ 18.12 := by norm_num

/-- Naloga 6c (odgovor): vračilo v z 18,12 + v = 20 je natanko v = 1,88; pot »Po korakih«:
20 − 18,12 = 20,00 − 18,12 = 1,88. -/
theorem n6c_odgovor (v : ℚ) :
    (18.12 + v = 20 ↔ v = 1.88) ∧ (20 : ℚ) - 18.12 = 20.00 - 18.12 ∧ (20.00 : ℚ) - 18.12 = 1.88 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num⟩

/-- Naloga 6c, »Drugače: z dopolnjevanjem«: 18,12 + 0,08 = 18,20; 18,20 + 0,80 = 19; 19 + 1 = 20;
0,08 + 0,80 + 1 = 1,88. -/
theorem n6c_pot2 :
    (18.12 : ℚ) + 0.08 = 18.20 ∧ (18.20 : ℚ) + 0.80 = 19 ∧ (19 : ℚ) + 1 = 20 ∧
    (0.08 : ℚ) + 0.80 + 1 = 1.88 := by norm_num

/-! ## Naloga 7 -/

/-- Naloga 7: lestvica stolpčnega diagrama iz SVG: os 0 pri y = 134, oznaka 2 pri y = 110,4, oznaka 10
pri y = 16; ena črta (1 učenec) je 11,8 enote. -/
theorem n7_lestvica :
    ((134 : ℚ) - 110.4) / 2 = 11.8 ∧ ((134 : ℚ) - 16) / 10 = 11.8 ∧ (134 : ℚ) - 122.2 = 11.8 := by
  norm_num

/-- Število učencev iz višine stolpca v SVG. -/
def stolpec (h : ℚ) : ℚ := h / 11.8

/-- Naloga 7: višine vseh 12 stolpcev (6. a, 6. b, 6. c): peš 8, 6, 10; s kolesom 5, 7, 4;
z avtobusom 7, 9, 5; z avtom 4, 3, 7. -/
theorem n7_stolpci :
    stolpec 94.4 = 8 ∧ stolpec 70.8 = 6 ∧ stolpec 118 = 10 ∧
    stolpec 59 = 5 ∧ stolpec 82.6 = 7 ∧ stolpec 47.2 = 4 ∧
    stolpec 82.6 = 7 ∧ stolpec 106.2 = 9 ∧ stolpec 59 = 5 ∧
    stolpec 47.2 = 4 ∧ stolpec 35.4 = 3 ∧ stolpec 82.6 = 7 := by
  unfold stolpec; norm_num

/-- Naloga 7a (odgovor in pot »Po korakih«): 1. z avtobusom 6. b: 9; 2. s kolesom 5 + 7 + 4 = 16;
3. peš 10 − 6 = 4; 4. 26 − 10 = 16. -/
theorem n7a_pot1 :
    stolpec 106.2 = 9 ∧ stolpec 59 + stolpec 82.6 + stolpec 47.2 = 16 ∧ (5 : ℚ) + 7 + 4 = 16 ∧
    stolpec 118 - stolpec 70.8 = 4 ∧ (10 : ℚ) - 6 = 4 ∧ 26 - stolpec 118 = 16 ∧ (26 : ℚ) - 10 = 16 := by
  unfold stolpec; norm_num

/-- Naloga 7a, »Drugače: preverjanje s seštevanjem stolpcev«: 6. c s kolesom 4, z avtobusom 5, z avtom 7,
4 + 5 + 7 = 16, 10 + 16 = 26 (diagram zajema vseh 26 učencev 6. c); vrh stolpca 6. c je 4 črte
(4 · 11,8) nad vrhom stolpca 6. b. -/
theorem n7a_pot2 :
    stolpec 47.2 + stolpec 59 + stolpec 82.6 = 16 ∧ (4 : ℚ) + 5 + 7 = 16 ∧ (10 : ℚ) + 16 = 26 ∧
    stolpec 118 + stolpec 47.2 + stolpec 59 + stolpec 82.6 = 26 ∧
    (134 - 118 : ℚ) + 4 * 11.8 = 134 - 70.8 := by
  unfold stolpec; norm_num

/-- Naloga 7a, napaka pri 4.: 10 je število tistih, ki pridejo peš, ne tistih, ki ne pridejo (16). -/
theorem n7a_napaka : stolpec 118 = 10 ∧ (10 : ℚ) ≠ 26 - 10 := by unfold stolpec; norm_num

/-- Naloga 7b, ponudba A: če je zaslužek k · vložek in 50 € prinese 51,50 − 50 = 1,50 €, potem 600 €
prinese 18 € (600 : 50 = 12, 12 · 1,50 = 18). -/
theorem n7b_A (k : ℚ) (h : k * 50 = 51.50 - 50) : k * 600 = 18 := by
  calc k * 600 = k * 50 * (600 / 50) := by ring
    _ = 1.50 * 12 := by rw [h]; norm_num
    _ = 18 := by norm_num

/-- Predpostavka `n7b_A` je izpolnljiva (k = 0,03). -/
example : (0.03 : ℚ) * 50 = 51.50 - 50 := by norm_num

/-- Naloga 7b, ponudba B: 205 − 200 = 5 € na 200 €; 600 : 200 = 3, 3 · 5 = 15. -/
theorem n7b_B (k : ℚ) (h : k * 200 = 205 - 200) : k * 600 = 15 := by
  calc k * 600 = k * 200 * (600 / 200) := by ring
    _ = 5 * 3 := by rw [h]; norm_num
    _ = 15 := by norm_num

/-- Predpostavka `n7b_B` je izpolnljiva (k = 0,025). -/
example : (0.025 : ℚ) * 200 = 205 - 200 := by norm_num

/-- Naloga 7b, ponudba C: 102,80 − 100 = 2,80 € na 100 €; 600 : 100 = 6, 6 · 2,80 = 16,8. -/
theorem n7b_C (k : ℚ) (h : k * 100 = 102.80 - 100) : k * 600 = 16.8 := by
  calc k * 600 = k * 100 * (600 / 100) := by ring
    _ = 2.80 * 6 := by rw [h]; norm_num
    _ = 16.8 := by norm_num

/-- Predpostavka `n7b_C` je izpolnljiva (k = 0,028). -/
example : (0.028 : ℚ) * 100 = 102.80 - 100 := by norm_num

/-- Naloga 7b (odgovor): največ (18 €) pri ponudbi A; B 15 €, C 16,80 €. -/
theorem n7b_odgovor (kA kB kC : ℚ) (hA : kA * 50 = 51.50 - 50) (hB : kB * 200 = 205 - 200)
    (hC : kC * 100 = 102.80 - 100) :
    kA * 600 = 18 ∧ kB * 600 = 15 ∧ kC * 600 = 16.80 ∧ kB * 600 < kA * 600 ∧ kC * 600 < kA * 600 := by
  rw [n7b_A kA hA, n7b_B kB hB, n7b_C kC hC]; norm_num

/-- Predpostavke `n7b_odgovor` so izpolnljive. -/
example : (0.03 : ℚ) * 50 = 51.50 - 50 ∧ (0.025 : ℚ) * 200 = 205 - 200 ∧ (0.028 : ℚ) * 100 = 102.80 - 100 := by
  norm_num

/-- Naloga 7b, »Po korakih«: razlike 51,50 − 50 = 1,50; 205 − 200 = 5; 102,80 − 100 = 2,80; kolikokrat
600 : 50 = 12, 600 : 200 = 3, 600 : 100 = 6; zaslužki 12 · 1,50 = 18, 3 · 5 = 15, 6 · 2,80 = 16,8. -/
theorem n7b_pot1 :
    (51.50 : ℚ) - 50 = 1.50 ∧ (205 : ℚ) - 200 = 5 ∧ (102.80 : ℚ) - 100 = 2.80 ∧
    (600 : ℚ) / 50 = 12 ∧ (600 : ℚ) / 200 = 3 ∧ (600 : ℚ) / 100 = 6 ∧
    (12 : ℚ) * 1.50 = 18 ∧ (3 : ℚ) * 5 = 15 ∧ (6 : ℚ) * 2.80 = 16.8 := by norm_num

/-- Naloga 7b, »Drugače: primerjamo zaslužek na 100 €«: A 2 · 1,50 = 3, B 5 : 2 = 2,5, C 2,80; 3 je
največ; 6 · 3 = 18; B 6 · 2,5 = 15, C 6 · 2,8 = 16,8. Zaslužek na 100 € pri vsaki ponudbi je k · 100. -/
theorem n7b_pot2 (kA kB kC : ℚ) (hA : kA * 50 = 51.50 - 50) (hB : kB * 200 = 205 - 200)
    (hC : kC * 100 = 102.80 - 100) :
    kA * 100 = 3 ∧ kB * 100 = 2.5 ∧ kC * 100 = 2.80 ∧ (2 : ℚ) * 1.50 = 3 ∧ (5 : ℚ) / 2 = 2.5 ∧
    kB * 100 < kA * 100 ∧ kC * 100 < kA * 100 ∧ (6 : ℚ) * 3 = 18 ∧ (6 : ℚ) * 2.5 = 15 ∧
    (6 : ℚ) * 2.8 = 16.8 := by
  have a : kA * 100 = 3 := by linarith
  have b : kB * 100 = 2.5 := by linarith
  have c : kC * 100 = 2.80 := by linarith
  rw [a, b, c]; norm_num

/-- Naloga 7b, napaka: B ima največjo razliko (5 > 1,50 in 5 > 2,80), a pri 600 € da manj (15 < 18). -/
theorem n7b_napaka : (1.50 : ℚ) < 5 ∧ (2.80 : ℚ) < 5 ∧ (15 : ℚ) < 18 := by norm_num

/-! ## Naloga 8 (koordinate iz SVG slike) -/

/-- Naloga 8: oglišča iz SVG: A(18, 136), B(138, 136), C(190,5; 18), D(129,3; 91); vektorji
BA = (−120, 0), BC = (52,5; −118), DA = (−111,3; 45), DC = (61,2; −73). -/
theorem n8_slika :
    (18 : ℚ) - 138 = -120 ∧ (136 : ℚ) - 136 = 0 ∧ (190.5 : ℚ) - 138 = 52.5 ∧ (18 : ℚ) - 136 = -118 ∧
    (18 : ℚ) - 129.3 = -111.3 ∧ (136 : ℚ) - 91 = 45 ∧ (190.5 : ℚ) - 129.3 = 61.2 ∧
    (18 : ℚ) - 91 = -73 := by norm_num

/-- Naloga 8a: lik ima štiri različna oglišča; A, D, C niso na premici (vektorski produkt DA × DC
= 5 370,9 ≠ 0), zato se lik pri D lomi (ni trikotnik); D leži znotraj trikotnika ABC
(D = λA + μB + νC z λ, μ, ν > 0, λ + μ + ν = 1), zato je notranji kot pri D izbočen (nekonveksni
štirikotnik). -/
theorem n8a :
    ((18 : ℚ), (136 : ℚ)) ≠ (138, 136) ∧ ((18 : ℚ), (136 : ℚ)) ≠ (190.5, 18) ∧
    ((18 : ℚ), (136 : ℚ)) ≠ (129.3, 91) ∧ ((138 : ℚ), (136 : ℚ)) ≠ (190.5, 18) ∧
    ((138 : ℚ), (136 : ℚ)) ≠ (129.3, 91) ∧ ((190.5 : ℚ), (18 : ℚ)) ≠ (129.3, 91) ∧
    (-111.3 : ℚ) * (-73) - 45 * 61.2 = 5370.9 ∧ (5370.9 : ℚ) ≠ 0 ∧
    (let l : ℚ := 11297 / 47200; let m : ℚ := 17903 / 47200; let n : ℚ := 45 / 118
     0 < l ∧ 0 < m ∧ 0 < n ∧ l + m + n = 1 ∧ l * 18 + m * 138 + n * 190.5 = 129.3 ∧
     l * 136 + m * 136 + n * 18 = 91) := by
  norm_num

local notation "E2" => EuclideanSpace ℝ (Fin 2)

/-- Vektor BA. -/
noncomputable def vBA : E2 := !₂[-120, 0]
/-- Vektor BC. -/
noncomputable def vBC : E2 := !₂[52.5, -118]
/-- Vektor DA. -/
noncomputable def vDA : E2 := !₂[-111.3, 45]
/-- Vektor DC. -/
noncomputable def vDC : E2 := !₂[61.2, -73]
/-- Podaljšek kraka AD čez D: smer −DA. -/
noncomputable def vDP : E2 := !₂[111.3, -45]

/-- Kot β v stopinjah. -/
noncomputable def beta : ℝ := InnerProductGeometry.angle vBA vBC * 180 / π
/-- Kot ADC (manjši, med krakoma DA in DC) v stopinjah. -/
noncomputable def kotADC : ℝ := InnerProductGeometry.angle vDA vDC * 180 / π
/-- Kot med podaljškom kraka AD čez D in krakom DC v stopinjah. -/
noncomputable def kotPodaljsek : ℝ := InnerProductGeometry.angle vDP vDC * 180 / π
/-- Izbočeni notranji kot δ pri D (D leži znotraj trikotnika ABC, `n8a`): δ = 360° − ∠ADC. -/
noncomputable def delta : ℝ := 360 - kotADC

/-- Razmerje vektorskega in skalarnega produkta pri D: tg(podaljšek) = 5 370,9 / 10 096,56. -/
noncomputable def tD : ℝ := 5370.9 / 10096.56

theorem koren_beta : √(1 + (105 / 236 : ℝ) ^ 2) = √66721 / 236 := by
  rw [show (1 : ℝ) + (105 / 236) ^ 2 = 66721 / 236 ^ 2 by norm_num, Real.sqrt_div' _ (by positivity),
    Real.sqrt_sq (by norm_num)]

/-- β = π/2 + arctg(105/236) (radiani). -/
theorem kot_beta : InnerProductGeometry.angle vBA vBC = arctan (105 / 236) + π / 2 := by
  have hi : inner ℝ vBA vBC = -6300 := by
    simp [vBA, vBC, Fin.sum_univ_two, inner]; norm_num
  have h1 : ‖vBA‖ = 120 := by
    rw [EuclideanSpace.norm_eq]; simp [vBA, Fin.sum_univ_two]
  have h2 : ‖vBC‖ = √66721 / 2 := by
    rw [EuclideanSpace.norm_eq]; simp [vBC, Fin.sum_univ_two]; norm_num
  have ha0 := arctan_pos.2 (show (0 : ℝ) < 105 / 236 by norm_num)
  have ha1 := arctan_lt_pi_div_two (105 / 236 : ℝ)
  have hc : cos (arctan (105 / 236) + π / 2) = -6300 / (120 * (√66721 / 2)) := by
    rw [cos_add_pi_div_two, sin_arctan, koren_beta]
    have : (0 : ℝ) < √66721 := by positivity
    field_simp
    ring
  rw [InnerProductGeometry.angle, hi, h1, h2, ← hc, arccos_cos] <;> linarith [pi_pos]

theorem koren_D : √(1 + tD ^ 2) = √14412.69 * √9074.44 / 10096.56 := by
  rw [← Real.sqrt_mul (by norm_num),
    show (1 : ℝ) + tD ^ 2 = (14412.69 * 9074.44) / 10096.56 ^ 2 by unfold tD; norm_num,
    Real.sqrt_div' _ (by positivity), Real.sqrt_sq (by norm_num)]

/-- Kot med podaljškom kraka AD in krakom DC je arctg(tD) (radiani). -/
theorem kot_podaljsek : InnerProductGeometry.angle vDP vDC = arctan tD := by
  have hi : inner ℝ vDP vDC = 10096.56 := by
    simp [vDP, vDC, Fin.sum_univ_two, inner]; norm_num
  have h1 : ‖vDP‖ = √14412.69 := by
    rw [EuclideanSpace.norm_eq]; simp [vDP, Fin.sum_univ_two]; norm_num
  have h2 : ‖vDC‖ = √9074.44 := by
    rw [EuclideanSpace.norm_eq]; simp [vDC, Fin.sum_univ_two]; norm_num
  have ht0 : 0 < tD := by unfold tD; norm_num
  have ha0 := arctan_pos.2 ht0
  have ha1 := arctan_lt_pi_div_two tD
  have hc : cos (arctan tD) = 10096.56 / (√14412.69 * √9074.44) := by
    rw [cos_arctan, koren_D]
    have : (0 : ℝ) < √14412.69 := by positivity
    have : (0 : ℝ) < √9074.44 := by positivity
    field_simp
  rw [InnerProductGeometry.angle, hi, h1, h2, ← hc, arccos_cos] <;> linarith [pi_pos]

/-- ∠ADC = π − arctg(tD) (radiani). -/
theorem kot_ADC : InnerProductGeometry.angle vDA vDC = π - arctan tD := by
  have hi : inner ℝ vDA vDC = -10096.56 := by
    simp [vDA, vDC, Fin.sum_univ_two, inner]; norm_num
  have h1 : ‖vDA‖ = √14412.69 := by
    rw [EuclideanSpace.norm_eq]; simp [vDA, Fin.sum_univ_two]; norm_num
  have h2 : ‖vDC‖ = √9074.44 := by
    rw [EuclideanSpace.norm_eq]; simp [vDC, Fin.sum_univ_two]; norm_num
  have ht0 : 0 < tD := by unfold tD; norm_num
  have ha0 := arctan_pos.2 ht0
  have ha1 := arctan_lt_pi_div_two tD
  have hc : cos (π - arctan tD) = -10096.56 / (√14412.69 * √9074.44) := by
    rw [cos_pi_sub, cos_arctan, koren_D]
    have : (0 : ℝ) < √14412.69 := by positivity
    have : (0 : ℝ) < √9074.44 := by positivity
    field_simp
  rw [InnerProductGeometry.angle, hi, h1, h2, ← hc, arccos_cos] <;> linarith [pi_pos]

/-- Spodnja meja arctg iz Taylorjevih mej za sin in cos (`Real.sin_bound`, `Real.cos_bound`). -/
theorem lt_arctan_of (r y : ℝ) (hr0 : 0 < r) (hr1 : r ≤ 1) (hy : 0 < y)
    (h : r - r ^ 3 / 6 + r ^ 5 / 100 < y * (1 - r ^ 2 / 2 - r ^ 4 * (5 / 96))) : r < arctan y := by
  have habs : |r| ≤ 1 := by rw [abs_of_pos hr0]; exact hr1
  have hs := sin_bound habs
  have hcb := cos_bound habs
  rw [abs_of_pos hr0] at hs hcb
  rw [abs_le] at hs hcb
  have hcos : 0 < cos r := cos_pos_of_le_one habs
  have hpi : r < π / 2 := by linarith [pi_gt_three]
  have ht : tan r < y := by
    rw [tan_eq_sin_div_cos, div_lt_iff₀ hcos]
    nlinarith [mul_le_mul_of_nonneg_left hcb.1 hy.le]
  calc r = arctan (tan r) := (arctan_tan (by linarith) hpi).symm
    _ < arctan y := arctan_strictMono ht

/-- Zgornja meja arctg iz Taylorjevih mej za sin in cos. -/
theorem arctan_lt_of (r y : ℝ) (hr0 : 0 < r) (hr1 : r ≤ 1) (hy : 0 < y)
    (h : y * (1 - r ^ 2 / 2 + r ^ 4 * (5 / 96)) < r - r ^ 3 / 6 - r ^ 5 / 100) : arctan y < r := by
  have habs : |r| ≤ 1 := by rw [abs_of_pos hr0]; exact hr1
  have hs := sin_bound habs
  have hcb := cos_bound habs
  rw [abs_of_pos hr0] at hs hcb
  rw [abs_le] at hs hcb
  have hcos : 0 < cos r := cos_pos_of_le_one habs
  have hpi : r < π / 2 := by linarith [pi_gt_three]
  have ht : y < tan r := by
    rw [tan_eq_sin_div_cos, lt_div_iff₀ hcos]
    nlinarith [mul_le_mul_of_nonneg_left hcb.2 hy.le]
  calc arctan y < arctan (tan r) := arctan_strictMono ht
    _ = r := arctan_tan (by linarith) hpi

/-- Predpostavke `lt_arctan_of` in `arctan_lt_of` so izpolnljive (r = 23,5 · 3,1416/180 oziroma
r = 24,5 · 3,1415/180, y = 105/236). -/
example : let r : ℝ := 23.5 * 3.1416 / 180
    0 < r ∧ r ≤ 1 ∧ (0 : ℝ) < 105 / 236 ∧
      r - r ^ 3 / 6 + r ^ 5 / 100 < 105 / 236 * (1 - r ^ 2 / 2 - r ^ 4 * (5 / 96)) := by
  norm_num

example : let r : ℝ := 24.5 * 3.1415 / 180
    0 < r ∧ r ≤ 1 ∧ (0 : ℝ) < 105 / 236 ∧
      105 / 236 * (1 - r ^ 2 / 2 + r ^ 4 * (5 / 96)) < r - r ^ 3 / 6 - r ^ 5 / 100 := by
  norm_num

/-- Iz mej v radianih na stopinje: d₁ < x · 180/π < d₂. -/
theorem stopinje_med (x d₁ d₂ : ℝ) (h₁ : d₁ * 3.1416 / 180 < x) (h₂ : x < d₂ * 3.1415 / 180)
    (hd₁ : 0 ≤ d₁) : d₁ < x * 180 / π ∧ x * 180 / π < d₂ := by
  have hp1 := pi_gt_d4
  have hp2 := pi_lt_d4
  have hpi : 0 < π := pi_pos
  constructor
  · rw [lt_div_iff₀ hpi]; nlinarith
  · rw [div_lt_iff₀ hpi]; nlinarith

/-- Predpostavke `stopinje_med` so izpolnljive (x = 1, d₁ = 1, d₂ = 100). -/
example : (1 : ℝ) * 3.1416 / 180 < 1 ∧ (1 : ℝ) < 100 * 3.1415 / 180 ∧ (0 : ℝ) ≤ 1 := by norm_num

/-- arctg(105/236) je v stopinjah med 23,5° in 24,5°. -/
theorem arctan_beta : 23.5 < arctan (105 / 236) * 180 / π ∧ arctan (105 / 236) * 180 / π < 24.5 := by
  apply stopinje_med _ _ _ _ _ (by norm_num)
  · exact lt_arctan_of _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  · exact arctan_lt_of _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num)

/-- Naloga 8c, »Drugače: s podaljškom kraka«: kot med podaljškom in krakom DC je med 27,5° in 28,5°
(izmerjeno 28°). -/
theorem n8c_podaljsek : 27.5 < kotPodaljsek ∧ kotPodaljsek < 28.5 := by
  unfold kotPodaljsek
  rw [kot_podaljsek]
  apply stopinje_med _ _ _ _ _ (by norm_num)
  · exact lt_arctan_of _ _ (by norm_num) (by norm_num) (by unfold tD; norm_num) (by unfold tD; norm_num)
  · exact arctan_lt_of _ _ (by norm_num) (by norm_num) (by unfold tD; norm_num) (by unfold tD; norm_num)

/-- Naloga 8b (odgovor in pot): 113,5° < β < 114,5°, zato je β zaokrožen na stopinjo 114° (v dopustnem
odstopanju ±2°); 90° < β < 180° (top kot). -/
theorem n8b : 113.5 < beta ∧ beta < 114.5 ∧ round beta = 114 ∧ |beta - 114| ≤ 2 ∧ 90 < beta ∧
    beta < 180 := by
  have hb : beta = 90 + arctan (105 / 236) * 180 / π := by
    unfold beta; rw [kot_beta]; field_simp; ring
  have h := arctan_beta
  have h1 : 113.5 < beta := by rw [hb]; linarith
  have h2 : beta < 114.5 := by rw [hb]; linarith
  refine ⟨h1, h2, ?_, ?_, by linarith, by linarith⟩
  · rw [round_eq, Int.floor_eq_iff]; constructor <;> push_cast <;> linarith
  · rw [abs_le]; constructor <;> linarith

/-- Naloga 8b, napaka: 66° je ostri kot (= 180° − 114°), β pa je top. -/
theorem n8b_napaka : (66 : ℝ) < 90 ∧ (180 : ℝ) - 114 = 66 ∧ (66 : ℝ) < beta := by
  refine ⟨by norm_num, by norm_num, by linarith [n8b.2.2.2.2.1]⟩

/-- Naloga 8c, »Izmerimo drugi del do polnega kota«: kot zunaj lika ∠ADC je med 151,5° in 152,5°
(izmerjeno 152°), δ = 360° − ∠ADC, 360 − 152 = 208. -/
theorem n8c_pot1 : 151.5 < kotADC ∧ kotADC < 152.5 ∧ (360 : ℝ) - 152 = 208 := by
  have hk : kotADC = 180 - kotPodaljsek := by
    unfold kotADC kotPodaljsek; rw [kot_ADC, kot_podaljsek]; field_simp
  have h := n8c_podaljsek
  refine ⟨by rw [hk]; linarith, by rw [hk]; linarith, by norm_num⟩

/-- Naloga 8c, »Drugače: s podaljškom kraka«: δ = 180° + (kot med podaljškom in DC); 180 + 28 = 208. -/
theorem n8c_pot2 : delta = 180 + kotPodaljsek ∧ (180 : ℝ) + 28 = 208 := by
  have hk : kotADC = 180 - kotPodaljsek := by
    unfold kotADC kotPodaljsek; rw [kot_ADC, kot_podaljsek]; field_simp
  refine ⟨by unfold delta; rw [hk]; ring, by norm_num⟩

/-- Naloga 8c (odgovor): 207,5° < δ < 208,5°, zato je δ zaokrožen na stopinjo 208° (v dopustnem
odstopanju ±2°); δ > 180° (izbočen kot). -/
theorem n8c_odgovor : 207.5 < delta ∧ delta < 208.5 ∧ round delta = 208 ∧ |delta - 208| ≤ 2 ∧
    180 < delta := by
  have h := n8c_pot1
  have e : delta = 360 - kotADC := rfl
  have h1 : 207.5 < delta := by rw [e]; linarith
  have h2 : delta < 208.5 := by rw [e]; linarith
  refine ⟨h1, h2, ?_, ?_, by linarith⟩
  · rw [round_eq, Int.floor_eq_iff]; constructor <;> push_cast <;> linarith
  · rw [abs_le]; constructor <;> linarith

/-- Naloga 8c, napaka: 152° je kot zunaj lika, δ pa je večji od iztegnjenega (δ ≠ 152°). -/
theorem n8c_napaka : (152 : ℝ) < 180 ∧ delta ≠ 152 := by
  refine ⟨by norm_num, by linarith [n8c_odgovor.2.2.2.2]⟩

/-- Naloga 8d (odgovor): 180° − 63° 48' = 116° 12' (v minutah: 180 · 60 − (63 · 60 + 48) = 116 · 60 + 12). -/
theorem n8d_odgovor : (180 : ℤ) * 60 - (63 * 60 + 48) = 116 * 60 + 12 := by norm_num

/-- Naloga 8d, »Po korakih«: 180° = 179° 60'; minute 60' − 48' = 12'; stopinje 179° − 63° = 116°. -/
theorem n8d_pot1 :
    (180 : ℤ) * 60 = 179 * 60 + 60 ∧ (60 : ℤ) - 48 = 12 ∧ (179 : ℤ) - 63 = 116 ∧
    (179 * 60 + 60 : ℤ) - (63 * 60 + 48) = (179 - 63) * 60 + (60 - 48) := by norm_num

/-- Naloga 8d, »Drugače: z dopolnjevanjem«: 48' + 12' = 60' = 1°, 63° 48' + 12' = 64°; 180° − 64° = 116°;
preizkus 63° 48' + 116° 12' = 179° 60' = 180°. -/
theorem n8d_pot2 :
    (48 : ℤ) + 12 = 60 ∧ (63 * 60 + 48 : ℤ) + 12 = 64 * 60 ∧ (180 : ℤ) - 64 = 116 ∧
    (63 * 60 + 48 : ℤ) + (116 * 60 + 12) = 179 * 60 + 60 ∧ (179 * 60 + 60 : ℤ) = 180 * 60 := by
  norm_num

/-- Naloga 8d, napaka: z minutami kot decimalkami 180 − 63,48 = 116,52, zapisano 116° 52' ≠ 116° 12'. -/
theorem n8d_napaka : (180 : ℚ) - 63.48 = 116.52 ∧ (116 * 60 + 52 : ℤ) ≠ 116 * 60 + 12 := by norm_num

/-! ## Naloga 9 (pravokotnik v ravnini) -/

theorem norm_komb (a c : E2) (h : inner ℝ a c = 0) (x y : ℝ) :
    ‖x • a + y • c‖ ^ 2 = x ^ 2 * ‖a‖ ^ 2 + y ^ 2 * ‖c‖ ^ 2 := by
  rw [norm_add_sq_real, norm_smul, norm_smul, real_inner_smul_left, real_inner_smul_right, h,
    Real.norm_eq_abs, Real.norm_eq_abs, mul_pow, mul_pow, sq_abs, sq_abs]
  ring

theorem inner_komb_a (a c : E2) (h : inner ℝ a c = 0) (x y : ℝ) :
    inner ℝ (x • a + y • c) a = x * ‖a‖ ^ 2 := by
  rw [inner_add_left, real_inner_smul_left, real_inner_smul_left, real_inner_self_eq_norm_sq,
    real_inner_comm, h]
  ring

theorem inner_komb_c (a c : E2) (h : inner ℝ a c = 0) (x y : ℝ) :
    inner ℝ (x • a + y • c) c = y * ‖c‖ ^ 2 := by
  rw [inner_add_left, real_inner_smul_left, real_inner_smul_left, real_inner_self_eq_norm_sq, h]
  ring

theorem inner_komb2 (a c : E2) (h : inner ℝ a c = 0) (x y u v : ℝ) :
    inner ℝ (x • a + y • c) (u • a + v • c) = x * u * ‖a‖ ^ 2 + y * v * ‖c‖ ^ 2 := by
  rw [inner_add_right, real_inner_smul_right, real_inner_smul_right, inner_komb_a a c h,
    inner_komb_c a c h]
  ring

theorem komb_nic (a c : E2) (ha : a ≠ 0) (hc : c ≠ 0) (h : inner ℝ a c = 0) (x y : ℝ)
    (hxy : x • a + y • c = 0) : x = 0 ∧ y = 0 := by
  have h1 := inner_komb_a a c h x y
  have h2 := inner_komb_c a c h x y
  rw [hxy, inner_zero_left] at h1 h2
  have pa : 0 < ‖a‖ ^ 2 := by positivity
  have pc : 0 < ‖c‖ ^ 2 := by positivity
  constructor
  · rcases mul_eq_zero.1 h1.symm with h | h
    · exact h
    · linarith
  · rcases mul_eq_zero.1 h2.symm with h | h
    · exact h
    · linarith

/-- V ravnini je vsaka točka kombinacija dveh pravokotnih neničelnih vektorjev. -/
theorem ravnina (a c : E2) (ha : a ≠ 0) (hc : c ≠ 0) (h : inner ℝ a c = 0) (P : E2) :
    ∃ x y : ℝ, P = x • a + y • c := by
  have hli : LinearIndependent ℝ ![a, c] := by
    rw [LinearIndependent.pair_iff]
    exact komb_nic a c ha hc h
  have hsp := hli.span_eq_top_of_card_eq_finrank (by simp)
  have hP : P ∈ Submodule.span ℝ (Set.range ![a, c]) := hsp ▸ Submodule.mem_top
  rw [Matrix.range_cons_cons_empty] at hP
  obtain ⟨x, y, hxy⟩ := Submodule.mem_span_pair.1 hP
  exact ⟨x, y, hxy.symm⟩

theorem norm_iz (a c : E2) (ha : ‖a‖ = 4) (hc : ‖c‖ = 3) (h : inner ℝ a c = 0) (x y r : ℝ)
    (hr : 0 ≤ r) (hxy : x ^ 2 * 16 + y ^ 2 * 9 = r ^ 2) : ‖x • a + y • c‖ = r := by
  have e := norm_komb a c h x y
  rw [ha, hc] at e
  have hn := norm_nonneg (x • a + y • c)
  nlinarith

/-- Predpostavke naloge 9 so izpolnljive: A = (0, 0), B = (4, 0), C = (4, 3). -/
example : dist (!₂[0, 0] : E2) !₂[4, 0] = 4 ∧ dist (!₂[4, 0] : E2) !₂[4, 3] = 3 ∧
    inner ℝ ((!₂[0, 0] : E2) - !₂[4, 0]) ((!₂[4, 3] : E2) - !₂[4, 0]) = 0 := by
  refine ⟨?_, ?_, ?_⟩
  · rw [EuclideanSpace.dist_eq]; simp [Fin.sum_univ_two]
  · rw [EuclideanSpace.dist_eq]; simp [Fin.sum_univ_two]
  · simp [Fin.sum_univ_two, inner]

/-- Naloga 9a (odgovor) in pot »Z geotrikotnikom«: premica skozi A, vzporedna BC ({A + s·(C − B)},
pravokotna na AB), in premica skozi C, vzporedna AB ({C + t·(A − B)}), se sekata natanko v
D = A + C − B; |AD| = 3, |CD| = 4, pri A, C, D so pravi koti. -/
theorem n9a_pot1 (A B C : E2) (hAB : dist A B = 4) (hBC : dist B C = 3)
    (hpr : inner ℝ (A - B) (C - B) = 0) :
    (∀ P : E2, ((∃ s : ℝ, P = A + s • (C - B)) ∧ (∃ t : ℝ, P = C + t • (A - B))) ↔ P = A + C - B) ∧
    inner ℝ (C - B) (B - A) = 0 ∧ dist A (A + C - B) = 3 ∧ dist C (A + C - B) = 4 ∧
    inner ℝ (B - A) ((A + C - B) - A) = 0 ∧ inner ℝ (B - C) ((A + C - B) - C) = 0 ∧
    inner ℝ (A - (A + C - B)) (C - (A + C - B)) = 0 := by
  obtain ⟨a, rfl⟩ : ∃ a, A = B + a := ⟨A - B, by abel⟩
  obtain ⟨c, rfl⟩ : ∃ c, C = B + c := ⟨C - B, by abel⟩
  simp only [add_sub_cancel_left] at hpr
  have ha : ‖a‖ = 4 := by rw [← hAB, dist_eq_norm]; simp
  have hc : ‖c‖ = 3 := by rw [← hBC, dist_comm, dist_eq_norm]; simp
  have ha0 : a ≠ 0 := by intro h; rw [h, norm_zero] at ha; norm_num at ha
  have hc0 : c ≠ 0 := by intro h; rw [h, norm_zero] at hc; norm_num at hc
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_⟩
  · intro P
    constructor
    · rintro ⟨⟨s, hs⟩, ⟨t, ht⟩⟩
      have e : (1 - t) • a + (s - 1) • c = (B + a + s • (B + c - B)) - (B + c + t • (B + a - B)) := by
        module
      rw [← hs, ← ht, sub_self] at e
      have := komb_nic a c ha0 hc0 hpr _ _ e
      have ht1 : t = 1 := by linarith [this.1]
      rw [ht, ht1]; module
    · intro hP
      refine ⟨⟨1, by rw [hP]; module⟩, ⟨1, by rw [hP]; module⟩⟩
  · have e : B + c - B = (0 : ℝ) • a + (1 : ℝ) • c := by module
    have e2 : B - (B + a) = (-1 : ℝ) • a + (0 : ℝ) • c := by module
    rw [e, e2, inner_komb2 a c hpr]; ring
  · have e : B + a - (B + a + (B + c) - B) = (0 : ℝ) • a + (-1 : ℝ) • c := by module
    rw [dist_eq_norm, e]; exact norm_iz a c ha hc hpr _ _ _ (by norm_num) (by norm_num)
  · have e : B + c - (B + a + (B + c) - B) = (-1 : ℝ) • a + (0 : ℝ) • c := by module
    rw [dist_eq_norm, e]; exact norm_iz a c ha hc hpr _ _ _ (by norm_num) (by norm_num)
  · have e : B + a + (B + c) - B - (B + a) = (0 : ℝ) • a + (1 : ℝ) • c := by module
    have e2 : B - (B + a) = (-1 : ℝ) • a + (0 : ℝ) • c := by module
    rw [e, e2, inner_komb2 a c hpr]; ring
  · have e : B + a + (B + c) - B - (B + c) = (1 : ℝ) • a + (0 : ℝ) • c := by module
    have e2 : B - (B + c) = (0 : ℝ) • a + (-1 : ℝ) • c := by module
    rw [e, e2, inner_komb2 a c hpr]; ring
  · have e : B + a - (B + a + (B + c) - B) = (0 : ℝ) • a + (-1 : ℝ) • c := by module
    have e2 : B + c - (B + a + (B + c) - B) = (-1 : ℝ) • a + (0 : ℝ) • c := by module
    rw [e, e2, inner_komb2 a c hpr]; ring

/-- Stran premice AC: f(P) = ⟨P − B, A − B⟩/16 + ⟨P − B, C − B⟩/9 − 1. -/
noncomputable def stran (A B C P : E2) : ℝ :=
  inner ℝ (P - B) (A - B) / 16 + inner ℝ (P - B) (C - B) / 9 - 1

/-- Naloga 9a, »Drugače: s šestilom«: f je na premici AC enaka 0, pri B je −1; loka s središčem A
(polmer 3) in središčem C (polmer 4) se na drugi strani premice AC kot B (f > 0) sekata natanko v
D = A + C − B. Loka se sekata še v eni točki, ki je na isti strani kot B. -/
theorem n9a_pot2 (A B C : E2) (hAB : dist A B = 4) (hBC : dist B C = 3)
    (hpr : inner ℝ (A - B) (C - B) = 0) :
    (∀ t : ℝ, stran A B C (A + t • (C - A)) = 0) ∧ stran A B C B = -1 ∧
    (∀ P : E2, (dist A P = 3 ∧ dist C P = 4 ∧ 0 < stran A B C P) ↔ P = A + C - B) ∧
    (∀ P : E2, (dist A P = 3 ∧ dist C P = 4) →
      P = A + C - B ∨ (P = B + (7 / 25 : ℝ) • (A - B) + (-7 / 25 : ℝ) • (C - B) ∧ stran A B C P < 0)) := by
  obtain ⟨a, rfl⟩ : ∃ a, A = B + a := ⟨A - B, by abel⟩
  obtain ⟨c, rfl⟩ : ∃ c, C = B + c := ⟨C - B, by abel⟩
  simp only [add_sub_cancel_left] at hpr
  have ha : ‖a‖ = 4 := by rw [← hAB, dist_eq_norm]; simp
  have hc : ‖c‖ = 3 := by rw [← hBC, dist_comm, dist_eq_norm]; simp
  have ha0 : a ≠ 0 := by intro h; rw [h, norm_zero] at ha; norm_num at ha
  have hc0 : c ≠ 0 := by intro h; rw [h, norm_zero] at hc; norm_num at hc
  -- f v koordinatah: f(B + x a + y c) = x + y − 1
  have hf : ∀ x y : ℝ, stran (B + a) B (B + c) (B + (x • a + y • c)) = x + y - 1 := by
    intro x y
    unfold stran
    simp only [add_sub_cancel_left]
    rw [inner_komb_a a c hpr, inner_komb_c a c hpr, ha, hc]; ring
  -- razdalji v koordinatah
  have hdA : ∀ x y : ℝ, dist (B + a) (B + (x • a + y • c)) ^ 2 = (x - 1) ^ 2 * 16 + y ^ 2 * 9 := by
    intro x y
    have e : B + a - (B + (x • a + y • c)) = (1 - x) • a + (-y) • c := by module
    rw [dist_eq_norm, e, norm_komb a c hpr, ha, hc]; ring
  have hdC : ∀ x y : ℝ, dist (B + c) (B + (x • a + y • c)) ^ 2 = x ^ 2 * 16 + (y - 1) ^ 2 * 9 := by
    intro x y
    have e : B + c - (B + (x • a + y • c)) = (-x) • a + (1 - y) • c := by module
    rw [dist_eq_norm, e, norm_komb a c hpr, ha, hc]; ring
  -- glavna enačba: rešitvi (1, 1) in (7/25, −7/25)
  have hres : ∀ x y : ℝ, dist (B + a) (B + (x • a + y • c)) = 3 → dist (B + c) (B + (x • a + y • c)) = 4 →
      (x = 1 ∧ y = 1) ∨ (x = 7 / 25 ∧ y = -7 / 25) := by
    intro x y h1 h2
    have e1 := hdA x y
    have e2 := hdC x y
    rw [h1] at e1
    rw [h2] at e2
    have hl : 16 * x - 9 * y = 7 := by linarith
    have hq : (x - 1) * (25 * x - 7) = 0 := by nlinarith
    rcases mul_eq_zero.1 hq with h | h
    · left; constructor <;> linarith
    · right; constructor <;> linarith
  refine ⟨?_, ?_, ?_, ?_⟩
  · intro t
    have e : B + a + t • (B + c - (B + a)) = B + ((1 - t) • a + t • c) := by module
    rw [e, hf]; ring
  · have e : B = B + ((0 : ℝ) • a + (0 : ℝ) • c) := by simp
    rw [show stran (B + a) B (B + c) B = stran (B + a) B (B + c) (B + ((0 : ℝ) • a + (0 : ℝ) • c)) by
      rw [← e], hf]; norm_num
  · intro P
    obtain ⟨x, y, hxy⟩ := ravnina a c ha0 hc0 hpr (P - B)
    have hP : P = B + (x • a + y • c) := by rw [← hxy]; abel
    subst hP
    constructor
    · rintro ⟨h1, h2, h3⟩
      rw [hf] at h3
      rcases hres x y h1 h2 with ⟨rfl, rfl⟩ | ⟨rfl, rfl⟩
      · module
      · norm_num at h3
    · intro h
      have e : B + a + (B + c) - B = B + ((1 : ℝ) • a + (1 : ℝ) • c) := by module
      rw [e] at h
      rw [h, hf]
      refine ⟨?_, ?_, by norm_num⟩
      · have := hdA 1 1
        nlinarith [dist_nonneg (x := B + a) (y := B + ((1 : ℝ) • a + (1 : ℝ) • c))]
      · have := hdC 1 1
        nlinarith [dist_nonneg (x := B + c) (y := B + ((1 : ℝ) • a + (1 : ℝ) • c))]
  · intro P ⟨h1, h2⟩
    obtain ⟨x, y, hxy⟩ := ravnina a c ha0 hc0 hpr (P - B)
    have hP : P = B + (x • a + y • c) := by rw [← hxy]; abel
    subst hP
    rcases hres x y h1 h2 with ⟨rfl, rfl⟩ | ⟨rfl, rfl⟩
    · left; module
    · right
      refine ⟨by simp only [add_sub_cancel_left]; module, ?_⟩
      rw [hf]; norm_num

/-- Naloga 9b in 9c: |AC| = |BD| = 5; premici AC in BD se sekata natanko v S = B + ((A − B) + (C − B))/2
(središče pravokotnika), |AS| = |SC| = |BS| = |SD| = 2,5. -/
theorem n9c (A B C : E2) (hAB : dist A B = 4) (hBC : dist B C = 3)
    (hpr : inner ℝ (A - B) (C - B) = 0) :
    dist A C = 5 ∧ dist B (A + C - B) = 5 ∧
    (∀ P : E2, ((∃ t : ℝ, P = A + t • (C - A)) ∧ (∃ s : ℝ, P = B + s • ((A + C - B) - B))) ↔
      P = B + (1 / 2 : ℝ) • ((A - B) + (C - B))) ∧
    dist A (B + (1 / 2 : ℝ) • ((A - B) + (C - B))) = 2.5 ∧
    dist (B + (1 / 2 : ℝ) • ((A - B) + (C - B))) C = 2.5 ∧
    dist B (B + (1 / 2 : ℝ) • ((A - B) + (C - B))) = 2.5 ∧
    dist (B + (1 / 2 : ℝ) • ((A - B) + (C - B))) (A + C - B) = 2.5 := by
  obtain ⟨a, rfl⟩ : ∃ a, A = B + a := ⟨A - B, by abel⟩
  obtain ⟨c, rfl⟩ : ∃ c, C = B + c := ⟨C - B, by abel⟩
  simp only [add_sub_cancel_left] at hpr ⊢
  have ha : ‖a‖ = 4 := by rw [← hAB, dist_eq_norm]; simp
  have hc : ‖c‖ = 3 := by rw [← hBC, dist_comm, dist_eq_norm]; simp
  have ha0 : a ≠ 0 := by intro h; rw [h, norm_zero] at ha; norm_num at ha
  have hc0 : c ≠ 0 := by intro h; rw [h, norm_zero] at hc; norm_num at hc
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_⟩
  · have e : B + a - (B + c) = (1 : ℝ) • a + (-1 : ℝ) • c := by module
    rw [dist_eq_norm, e]; exact norm_iz a c ha hc hpr _ _ _ (by norm_num) (by norm_num)
  · have e : B - (B + a + (B + c) - B) = (-1 : ℝ) • a + (-1 : ℝ) • c := by module
    rw [dist_eq_norm, e]; exact norm_iz a c ha hc hpr _ _ _ (by norm_num) (by norm_num)
  · intro P
    constructor
    · rintro ⟨⟨t, ht⟩, ⟨s, hs⟩⟩
      have e : (1 - t - s) • a + (t - s) • c = (B + a + t • (B + c - (B + a))) - (B + s • (B + a + (B + c) - B - B)) := by
        module
      rw [← ht, ← hs, sub_self] at e
      have := komb_nic a c ha0 hc0 hpr _ _ e
      have hs1 : s = 1 / 2 := by linarith [this.1, this.2]
      rw [hs, hs1]; module
    · intro hP
      refine ⟨⟨1 / 2, by rw [hP]; module⟩, ⟨1 / 2, by rw [hP]; module⟩⟩
  · have e : B + a - (B + (1 / 2 : ℝ) • (a + c)) = (1 / 2 : ℝ) • a + (-1 / 2 : ℝ) • c := by module
    rw [dist_eq_norm, e]; exact norm_iz a c ha hc hpr _ _ _ (by norm_num) (by norm_num)
  · have e : B + (1 / 2 : ℝ) • (a + c) - (B + c) = (1 / 2 : ℝ) • a + (-1 / 2 : ℝ) • c := by module
    rw [dist_eq_norm, e]; exact norm_iz a c ha hc hpr _ _ _ (by norm_num) (by norm_num)
  · have e : B - (B + (1 / 2 : ℝ) • (a + c)) = (-1 / 2 : ℝ) • a + (-1 / 2 : ℝ) • c := by module
    rw [dist_eq_norm, e]; exact norm_iz a c ha hc hpr _ _ _ (by norm_num) (by norm_num)
  · have e : B + (1 / 2 : ℝ) • (a + c) - (B + a + (B + c) - B) = (-1 / 2 : ℝ) • a + (-1 / 2 : ℝ) • c := by
      module
    rw [dist_eq_norm, e]; exact norm_iz a c ha hc hpr _ _ _ (by norm_num) (by norm_num)

/-- Naloga 9d (odgovor) in poti: premica p = {B + s·(C − A)} je vzporedna AC; razdalja med točkama
obeh premic je vedno vsaj 2,4 in je enaka 2,4 v nožišču F = A + (16/25)·(C − A) pravokotnice iz B
(⟨B − F, C − A⟩ = 0), zato je razdalja med premicama 2,4 cm (tudi iz C: najmanjša razdalja od C do p
je 2,4). -/
theorem n9d (A B C : E2) (hAB : dist A B = 4) (hBC : dist B C = 3)
    (hpr : inner ℝ (A - B) (C - B) = 0) :
    (∀ s t : ℝ, 2.4 ≤ dist (A + t • (C - A)) (B + s • (C - A))) ∧
    dist (A + (16 / 25 : ℝ) • (C - A)) B = 2.4 ∧
    inner ℝ (B - (A + (16 / 25 : ℝ) • (C - A))) (C - A) = 0 ∧
    dist C (B + (9 / 25 : ℝ) • (C - A)) = 2.4 := by
  obtain ⟨a, rfl⟩ : ∃ a, A = B + a := ⟨A - B, by abel⟩
  obtain ⟨c, rfl⟩ : ∃ c, C = B + c := ⟨C - B, by abel⟩
  simp only [add_sub_cancel_left] at hpr
  have ha : ‖a‖ = 4 := by rw [← hAB, dist_eq_norm]; simp
  have hc : ‖c‖ = 3 := by rw [← hBC, dist_comm, dist_eq_norm]; simp
  refine ⟨?_, ?_, ?_, ?_⟩
  · intro s t
    have e : B + a + t • (B + c - (B + a)) - (B + s • (B + c - (B + a))) =
        (1 - (t - s)) • a + (t - s) • c := by module
    have hn := norm_komb a c hpr (1 - (t - s)) (t - s)
    rw [ha, hc] at hn
    rw [dist_eq_norm, e]
    have h0 := norm_nonneg ((1 - (t - s)) • a + (t - s) • c)
    nlinarith [sq_nonneg (t - s - 16 / 25)]
  · have e : B + a + (16 / 25 : ℝ) • (B + c - (B + a)) - B = (9 / 25 : ℝ) • a + (16 / 25 : ℝ) • c := by
      module
    rw [dist_eq_norm, e]; exact norm_iz a c ha hc hpr _ _ _ (by norm_num) (by norm_num)
  · have e : B - (B + a + (16 / 25 : ℝ) • (B + c - (B + a))) = (-9 / 25 : ℝ) • a + (-16 / 25 : ℝ) • c := by
      module
    have e2 : B + c - (B + a) = (-1 : ℝ) • a + (1 : ℝ) • c := by module
    rw [e, e2, inner_komb2 a c hpr, ha, hc]; norm_num
  · have e : B + c - (B + (9 / 25 : ℝ) • (B + c - (B + a))) = (9 / 25 : ℝ) • a + (16 / 25 : ℝ) • c := by
      module
    rw [dist_eq_norm, e]; exact norm_iz a c ha hc hpr _ _ _ (by norm_num) (by norm_num)

/-- Naloga 9d, »Za radovedne«: 4 · 3 = 12; 12 : 2 = 6; |AC| = 5 (`n9c`); 5 · h = 12 ⇔ h = 12 : 5 = 2,4. -/
theorem n9d_racun (h : ℚ) :
    (4 : ℚ) * 3 = 12 ∧ (12 : ℚ) / 2 = 6 ∧ (5 * h / 2 = 6 ↔ 5 * h = 12) ∧ (5 * h = 12 ↔ h = 2.4) ∧
    (12 : ℚ) / 5 = 2.4 := by
  refine ⟨by norm_num, by norm_num, ⟨fun e => by linarith, fun e => by linarith⟩,
    ⟨fun e => by linarith, fun e => by rw [e]; norm_num⟩, by norm_num⟩

/-- Naloga 9d, napaka: razdalja ni |AB| = 4 ali |BC| = 3, ker je 2,4 < 3 < 4. -/
theorem n9d_napaka : (2.4 : ℚ) < 3 ∧ (2.4 : ℚ) < 4 := by norm_num

end Evklid.Pole.NPZ6_MAT_2026_redni
