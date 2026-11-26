/-
vir: content/exam-papers/NPZ6-MAT-2025-redni.json
sha256: a598834896c113d06973c3595b07fff75d288e6bbc3923a31d8c181ed3fcb9ff
Ni v Leanu:
- pisni postopki (pisno seštevanje, odštevanje z dopolnjevanjem, množenje, deljenje) kot postopek: dokazan
  je vsak zapisani korak kot račun (števke, prenosi, ostanki), ne sam algoritem;
- 2a, 3a: preglednica mest je dokazana s števkami (`Nat.digits`) oziroma z vsoto desetiških enot;
- 2c: »štirimestno število iz štirih različnih danih števk« je zapisano kot 1000a + 100b + 10c + d z
  a, b, c, d iz [7, 0, 4, 9, 2], [a, b, c, d] brez ponovitev in a ≠ 0; največje in najmanjše je dokazano
  s pregledom vseh 625 izbir (`decide`);
- 3c: barvanje kvadrata (risba); dokazano je štetje 76 = 7 · 10 + 6 in 100 − 76 = 24 = 2 · 10 + 4;
- 3d: lega točk A, B, C, D je prevedena iz koordinat SVG slike (zgornja vrstica: 0 pri x = 18, 0,5 pri
  x = 318; spodnja: 0,5 pri x = 18, 1 pri x = 318); dokazano je v tem modelu, ne pomen slike;
- 4a: risanje kota (risba); dokazana je lega A in B glede na V iz koordinat SVG slike (kvadratek 12 enot);
- 4b: merjenje s kotomerom je merjenje. Kot AVB je zapisan kot `InnerProductGeometry.angle` vektorjev
  VA = (9, 4) in VB = (−9, 5) v `EuclideanSpace ℝ (Fin 2)`, v stopinjah · 180/π. Dokazano je
  ∠AVB = 180° − arctg(4/9) − arctg(5/9) (v stopinjah), 23,5° < arctg(4/9) < 24,5°, 28,5° < arctg(5/9) < 29,5° in
  zato 126° < ∠AVB < 128° (meje odgovora »od 126° do 128°«). Da je zaokrožen na stopinjo natanko 127°
  (natančno ≈ 126,98°), ni dokazano: Taylorjeve meje iz Mathliba (`Real.sin_bound`, `Real.cos_bound`) so pri
  teh kotih pregrobe za mejo ±0,5° (zahtevno, še ni dokazano). 4c, 4d: dokazano z istimi mejami in z
  računom za izmerjeno vrednost 127°;
- 6b: »pri sklenjeni ograji je stebričkov toliko kot razmikov« je dokazano kot število različnih leg
  k · 1,4 m za k = 0 … 29 (30 leg, vse pod 42 m, 30 · 1,4 = 42 je spet začetek), ne kot geometrija ograje;
- 6d: polaganje desk je dokazano kot račun (6 · 24 in 4 · 36); »manj kot 144 ne gre« je dokazano s
  ploščino (n desk brez prekrivanja pokrije n · 0,735 m², kar mora biti vsaj 105,84 m²), ne kot mera
  pokritja;
- 9c: risanje figurnega prikaza (risba); dokazano je štetje simbolov;
- razlage napak v besedah; števila iz razlag napak, ki so račun, so dokazana.
Decimalna števila so zapisana v ℚ (decimalni zapis je v ℚ točen). Zaokrožitev je dokazana z `round`
(round x = ⌊x + 1/2⌋) in z mejo napake. ℕ-odštevanje (v ℕ je a − b = 0 pri a < b) je uporabljeno samo pri
a ≥ b; ℕ-deljenje (navzdol) samo kjer je ostanek 0 ali je ostanek posebej dokazan.
-/
module

public import Mathlib

public section

namespace Evklid.Pole.NPZ6_MAT_2025_redni

open Real

/-! ## Naloga 1 -/

/-- Naloga 1a (odgovor): 386 457 + 7 896 = 394 353; zaokroženo na stotice 394 400 (napaka največ 50). -/
theorem n1a_odgovor :
    386457 + 7896 = 394353 ∧ round ((394353 : ℚ) / 100) * 100 = 394400 ∧
    |(394353 : ℚ) - 394400| ≤ 50 := by
  refine ⟨by norm_num, ?_, ?_⟩
  · have h : round ((394353 : ℚ) / 100) = 3944 := by
      rw [round_eq, Int.floor_eq_iff]; norm_num
    rw [h]; norm_num
  · rw [abs_le]; norm_num

/-- Naloga 1a, »Pisno seštevanje po mestih«: enice 7 + 6 = 13 (3, prenos 1), desetice 5 + 9 + 1 = 15,
stotice 4 + 8 + 1 = 13, tisočice 6 + 7 + 1 = 14, desettisočice 8 + 1 = 9, stotisočice 3; števke vsote
394 353 od enic navzgor so 3, 5, 3, 4, 9, 3; števka desetic je 5 ≥ 5, zato navzgor: 394 400. -/
theorem n1a_pot1 :
    7 + 6 = 3 + 10 ∧ 5 + 9 + 1 = 5 + 10 ∧ 4 + 8 + 1 = 3 + 10 ∧ 6 + 7 + 1 = 4 + 10 ∧ 8 + 1 = 9 ∧
    Nat.digits 10 394353 = [3, 5, 3, 4, 9, 3] ∧
    3 + 5 * 10 + 3 * 100 + 4 * 1000 + 9 * 10000 + 3 * 100000 = 394353 ∧
    (394353 / 10) % 10 = 5 ∧ 5 ≤ 5 ∧ round ((394353 : ℚ) / 100) * 100 = 394400 := by
  refine ⟨rfl, rfl, rfl, rfl, rfl, by norm_num, by norm_num, by norm_num, le_rfl, n1a_odgovor.2.1⟩

/-- Naloga 1a, »Drugače: z okroglim številom«: 8 000 − 7 896 = 104; 386 457 + 8 000 = 394 457;
394 457 − 104 = 394 353; 394 300 ≤ 394 353 ≤ 394 400, do 394 400 manjka 47, od 394 300 je 53, 47 < 53. -/
theorem n1a_pot2 :
    8000 - 7896 = 104 ∧ 386457 + 8000 = 394457 ∧ 394457 - 104 = 394353 ∧
    394300 ≤ 394353 ∧ 394353 ≤ 394400 ∧ 394400 - 394353 = 47 ∧ 394353 - 394300 = 53 ∧ 47 < 53 := by
  decide

/-- Naloga 1a, napaka: 394 300 je od 394 353 oddaljeno 53 > 50 (ni zaokrožitev na stotice). -/
theorem n1a_napaka : |(394353 : ℚ) - 394300| = 53 ∧ (50 : ℚ) < 53 := by
  rw [abs_of_pos (by norm_num)]; norm_num

/-- Naloga 1b (odgovor): 70 304 − 28 657 = 41 647; v ℤ: 28 657 + x = 70 304 natanko tedaj, ko x = 41 647. -/
theorem n1b_odgovor : (70304 : ℤ) - 28657 = 41647 ∧ ∀ x : ℤ, 28657 + x = 70304 ↔ x = 41647 := by
  refine ⟨by norm_num, fun x => by omega⟩

/-- Naloga 1b, »Pisno odštevanje (z dopolnjevanjem)«: 7 + 7 = 14; 5 + 1 = 6, 6 + 4 = 10; 6 + 1 = 7,
7 + 6 = 13; 8 + 1 = 9, 9 + 1 = 10; 2 + 1 = 3, 3 + 4 = 7; števke 41 647 od enic so 7, 4, 6, 1, 4;
preizkus 41 647 + 28 657 = 70 304. -/
theorem n1b_pot :
    7 + 7 = 14 ∧ 5 + 1 = 6 ∧ 6 + 4 = 10 ∧ 6 + 1 = 7 ∧ 7 + 6 = 13 ∧ 8 + 1 = 9 ∧ 9 + 1 = 10 ∧
    2 + 1 = 3 ∧ 3 + 4 = 7 ∧ Nat.digits 10 41647 = [7, 4, 6, 1, 4] ∧ 41647 + 28657 = 70304 := by
  refine ⟨rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, by norm_num, rfl⟩

/-- Naloga 1b, napaka: »manjša števka od večje« na vsakem mestu od enic (7 − 4, 5 − 0, 6 − 3, 8 − 0,
7 − 2) dá števke 3, 5, 3, 8, 5, torej 58 353; to ni razlika, preizkus 58 353 + 28 657 ≠ 70 304. -/
theorem n1b_napaka :
    7 - 4 = 3 ∧ 5 - 0 = 5 ∧ 6 - 3 = 3 ∧ 8 - 0 = 8 ∧ 7 - 2 = 5 ∧
    Nat.ofDigits 10 [3, 5, 3, 8, 5] = 58353 ∧ 58353 + 28657 ≠ 70304 := by
  refine ⟨rfl, rfl, rfl, rfl, rfl, by norm_num [Nat.ofDigits], by decide⟩

/-- Naloga 1c (odgovor): 487 · 36 = 17 532. -/
theorem n1c_odgovor : 487 * 36 = 17532 := rfl

/-- Naloga 1c, »Pisno množenje«: 487 · 3 = 1 461 (desetice: 14 610), 487 · 6 = 2 922,
14 610 + 2 922 = 17 532. -/
theorem n1c_pot1 :
    487 * 3 = 1461 ∧ 1461 * 10 = 14610 ∧ 487 * 6 = 2922 ∧ 14610 + 2922 = 17532 ∧
    487 * 36 = 487 * 3 * 10 + 487 * 6 := by decide

/-- Naloga 1c, »Drugače: z zaokroženim faktorjem«: 500 − 487 = 13; 500 · 36 = 18 000, 13 · 36 = 468,
487 · 36 = 18 000 − 468 = 17 532. -/
theorem n1c_pot2 :
    500 - 487 = 13 ∧ 500 * 36 = 18000 ∧ 13 * 36 = 468 ∧
    (487 : ℤ) * 36 = 500 * 36 - 13 * 36 ∧ (18000 : ℤ) - 468 = 17532 := by
  refine ⟨rfl, rfl, rfl, by norm_num, by norm_num⟩

/-- Naloga 1c, napaka: brez zamika 1 461 + 2 922 = 4 383, kar je manj od 487 · 10 = 4 870 (in od 17 532). -/
theorem n1c_napaka : 1461 + 2922 = 4383 ∧ 487 * 10 = 4870 ∧ 4383 < 4870 ∧ 4870 < 17532 := by decide

/-- Naloga 1d (odgovor): 58,9 : 4 = 14,725; zaokroženo na celo število 15 (napaka največ 1/2). -/
theorem n1d_odgovor :
    (58.9 : ℚ) / 4 = 14.725 ∧ round (14.725 : ℚ) = 15 ∧ |(14.725 : ℚ) - 15| ≤ 1 / 2 := by
  refine ⟨by norm_num, ?_, ?_⟩
  · rw [round_eq, Int.floor_eq_iff]; norm_num
  · rw [abs_le]; norm_num

/-- Naloga 1d, »Pisno deljenje«: 5 = 1 · 4 + 1, 18 = 4 · 4 + 2, 29 = 7 · 4 + 1, 10 = 2 · 4 + 2,
20 = 5 · 4 + 0; količnik 14,725; števka desetin 7 ≥ 5, navzgor 15; preizkus 14,725 · 4 = 58,9. -/
theorem n1d_pot1 :
    5 = 1 * 4 + 1 ∧ 18 = 4 * 4 + 2 ∧ 29 = 7 * 4 + 1 ∧ 10 = 2 * 4 + 2 ∧ 20 = 5 * 4 + 0 ∧
    (58.9 : ℚ) / 4 = 14 + 7 / 10 + 2 / 100 + 5 / 1000 ∧ 5 ≤ 7 ∧ round (14.725 : ℚ) = 15 ∧
    (14.725 : ℚ) * 4 = 58.9 := by
  refine ⟨rfl, rfl, rfl, rfl, rfl, by norm_num, by norm_num, n1d_odgovor.2.1, by norm_num⟩

/-- Naloga 1d, »Drugače: dovolj je ena decimalka«: 4 · 14 = 56 ≤ 58 < 60 = 4 · 15 (56 je največji
večkratnik 4 do 58), 56 : 4 = 14, ostane 58,9 − 56 = 2,9; polovica od 4 je 2, 2 < 2,9, zato
2,9 : 4 > 0,5; 14,5 < 58,9 : 4 < 15, zaokroženo 15; natančno 2,9 : 4 = 0,725 in 14 + 0,725 = 14,725. -/
theorem n1d_pot2 :
    4 * 14 = 56 ∧ 56 ≤ 58 ∧ 58 < 4 * 15 ∧ (∀ k : ℕ, 4 * k ≤ 58 → 4 * k ≤ 56) ∧ 56 / 4 = 14 ∧
    (58.9 : ℚ) - 56 = 2.9 ∧ (4 : ℚ) / 2 = 2 ∧ (2 : ℚ) < 2.9 ∧ (0.5 : ℚ) < 2.9 / 4 ∧
    (14.5 : ℚ) < 58.9 / 4 ∧ (58.9 : ℚ) / 4 < 15 ∧ round ((58.9 : ℚ) / 4) = 15 ∧
    (2.9 : ℚ) / 4 = 0.725 ∧ (14 : ℚ) + 0.725 = 14.725 := by
  refine ⟨rfl, by norm_num, by norm_num, fun k hk => by omega, rfl, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num, ?_, by norm_num, by norm_num⟩
  rw [round_eq, Int.floor_eq_iff]; norm_num

/-- Naloga 1d, napaka: odrezovanje dá ⌊14,725⌋ = 14 ≠ 15; 14,725 je bližje 15 kot 14. -/
theorem n1d_napaka :
    ⌊(14.725 : ℚ)⌋ = 14 ∧ (14 : ℤ) ≠ 15 ∧ |(14.725 : ℚ) - 15| < |(14.725 : ℚ) - 14| := by
  refine ⟨by rw [Int.floor_eq_iff]; norm_num, by norm_num, ?_⟩
  rw [abs_of_neg (by norm_num), abs_of_pos (by norm_num)]; norm_num

/-! ## Naloga 2 -/

/-- Naloga 2a (odgovor in pot »V preglednico mest«): 6 milijonov, 2 tisočici, 5 stotic in 3 enice
so 6 000 000 + 2 000 + 500 + 3 = 6 002 503; števke od enic navzgor 3, 0, 5, 2, 0, 0, 6 (prazna mesta 0). -/
theorem n2a :
    6 * 1000000 + 2 * 1000 + 5 * 100 + 3 = 6002503 ∧
    6000000 + 2000 + 500 + 3 = 6002503 ∧ Nat.digits 10 6002503 = [3, 0, 5, 2, 0, 0, 6] := by
  refine ⟨rfl, rfl, by norm_num⟩

/-- Naloga 2a, napaka: 6 253 (brez ničel) ni 6 002 503. -/
theorem n2a_napaka : 6253 ≠ 6002503 := by decide

/-- Naloga 2b (odgovor in pot »Po mestih«): števke 5 831 946 od enic so 6, 4, 9, 1, 3, 8, 5 (9 na mestu
stotic, 3 na mestu desettisočic); po zamenjavi 6, 4, 3, 1, 9, 8, 5, kar je 5 891 346; razlika je
(9 − 3) · 10 000 − (9 − 3) · 100. -/
theorem n2b :
    Nat.digits 10 5831946 = [6, 4, 9, 1, 3, 8, 5] ∧ Nat.digits 10 5891346 = [6, 4, 3, 1, 9, 8, 5] ∧
    Nat.ofDigits 10 [6, 4, 3, 1, 9, 8, 5] = 5891346 ∧
    5831946 + (9 - 3) * 10000 - (9 - 3) * 100 = 5891346 := by
  refine ⟨by norm_num, by norm_num, by norm_num [Nat.ofDigits], rfl⟩

/-- Naloga 2b, napaka: 5 893 146 ima števke 6, 4, 1, 3, 9, 8, 5 (premaknjena je tudi 1), torej ni
5 891 346. -/
theorem n2b_napaka :
    Nat.digits 10 5893146 = [6, 4, 1, 3, 9, 8, 5] ∧ 5893146 ≠ 5891346 := by
  refine ⟨by norm_num, by decide⟩

/-- Dane števke naloge 2c. -/
def stevke2c : List ℕ := [7, 0, 4, 9, 2]

/-- Naloga 2c (odgovor, največje): 9 742 je iz štirih različnih danih števk, prva ni 0, in vsako tako
štirimestno število 1000a + 100b + 10c + d je kvečjemu 9 742. -/
theorem n2c_najvecje :
    ([9, 7, 4, 2].Nodup ∧ ∀ s ∈ [9, 7, 4, 2], s ∈ stevke2c) ∧ 1000 * 9 + 100 * 7 + 10 * 4 + 2 = 9742 ∧
    ∀ a ∈ stevke2c, ∀ b ∈ stevke2c, ∀ c ∈ stevke2c, ∀ d ∈ stevke2c,
      [a, b, c, d].Nodup → a ≠ 0 → 1000 * a + 100 * b + 10 * c + d ≤ 9742 := by
  decide

/-- Naloga 2c (odgovor, najmanjše): 2 047 je iz štirih različnih danih števk, prva ni 0, in vsako tako
štirimestno število je vsaj 2 047. -/
theorem n2c_najmanjse :
    ([2, 0, 4, 7].Nodup ∧ ∀ s ∈ [2, 0, 4, 7], s ∈ stevke2c) ∧ 1000 * 2 + 100 * 0 + 10 * 4 + 7 = 2047 ∧
    ∀ a ∈ stevke2c, ∀ b ∈ stevke2c, ∀ c ∈ stevke2c, ∀ d ∈ stevke2c,
      [a, b, c, d].Nodup → a ≠ 0 → 2047 ≤ 1000 * a + 100 * b + 10 * c + d := by
  decide

/-- Naloga 2c, »Mesto za mestom od leve« in »Drugače: najprej izberi števke«: 9 > 7 > 4 > 2 (0 izpustiš)
dá 9 742; najmanjša neničelna števka je 2, nato 0, 4, 7 (9 izpustiš) dá 2 047; 0247 je trimestno 247
(< 1 000); sosednji možnosti 2 049 in 2 074 sta večji od 2 047. -/
theorem n2c_poti :
    9 > 7 ∧ 7 > 4 ∧ 4 > 2 ∧ 2 > 0 ∧ (∀ s ∈ stevke2c, s ≠ 0 → 2 ≤ s) ∧
    1000 * 0 + 100 * 2 + 10 * 4 + 7 = 247 ∧ 247 < 1000 ∧ 2047 < 2049 ∧ 2047 < 2074 := by
  decide

/-- Naloga 2d (odgovor): 9 742 − 2 047 = 7 695; v ℤ: 2 047 + x = 9 742 natanko tedaj, ko x = 7 695. -/
theorem n2d_odgovor : 9742 - 2047 = 7695 ∧ ∀ x : ℤ, 2047 + x = 9742 ↔ x = 7695 :=
  ⟨rfl, fun x => by omega⟩

/-- Naloga 2d, »Pisno odštevanje«: 7 + 5 = 12; 4 + 1 = 5, 5 + 9 = 14; 0 + 1 = 1, 1 + 6 = 7; 2 + 7 = 9;
števke 7 695 od enic: 5, 9, 6, 7. -/
theorem n2d_pot1 :
    7 + 5 = 12 ∧ 4 + 1 = 5 ∧ 5 + 9 = 14 ∧ 0 + 1 = 1 ∧ 1 + 6 = 7 ∧ 2 + 7 = 9 ∧
    Nat.digits 10 7695 = [5, 9, 6, 7] := by
  refine ⟨rfl, rfl, rfl, rfl, rfl, rfl, by norm_num⟩

/-- Naloga 2d, »Drugače: odštevaj po delih«: 2 047 = 2 000 + 47; 9 742 − 2 000 = 7 742;
7 742 − 47 = 7 695; preizkus 7 695 + 2 047 = 9 742. -/
theorem n2d_pot2 :
    2047 = 2000 + 47 ∧ 9742 - 2000 = 7742 ∧ 7742 - 47 = 7695 ∧ 7695 + 2047 = 9742 := by decide

/-- Naloga 2d, napaka: pri deseticah odštevanec ni 4, ampak 4 + 1 = 5 (prenos); 4 − 4 = 0 bi dalo
napačno števko desetic. -/
theorem n2d_napaka : 4 + 1 = 5 ∧ 4 - 4 = 0 ∧ (7695 / 10) % 10 = 9 ∧ (9 : ℕ) ≠ 0 := by decide

/-! ## Naloga 3 -/

/-- Naloga 3a (odgovor, ↔): za števki x, y (y < 10, stotine so ena števka) je x desetin + y stotin enako
0,76 natanko tedaj, ko je x = 7 in y = 6. -/
theorem n3a_odgovor (x y : ℕ) (hy : y < 10) :
    (x : ℚ) / 10 + y / 100 = 0.76 ↔ x = 7 ∧ y = 6 := by
  constructor
  · intro h
    have h' : ((10 * x + y : ℕ) : ℚ) = 76 := by push_cast; linarith
    have h'' : 10 * x + y = 76 := by exact_mod_cast h'
    omega
  · rintro ⟨rfl, rfl⟩; norm_num

example : (6 : ℕ) < 10 := by norm_num

/-- Naloga 3a, »Preglednica mest«: 0,76 = 0 + 7/10 + 6/100; preizkus 0,7 + 0,06 = 0,76. -/
theorem n3a_pot : (0.76 : ℚ) = 0 + 7 / 10 + 6 / 100 ∧ (0.7 : ℚ) + 0.06 = 0.76 := by norm_num

/-- Naloga 3a, napaka: 76 desetin je 7,6, ne 0,76. -/
theorem n3a_napaka : (76 : ℚ) / 10 = 7.6 ∧ (7.6 : ℚ) ≠ 0.76 := by norm_num

/-- Naloga 3b (odgovor in pot »Iz števila decimalk«): 0,76 = 76/100; drug ulomek z enako vrednostjo
je enak 76/100 (npr. 19/25). -/
theorem n3b : (0.76 : ℚ) = 76 / 100 ∧ (19 : ℚ) / 25 = 76 / 100 := by norm_num

/-- Naloga 3b, napaka: 76/10 = 7,6 = 10 · 0,76. -/
theorem n3b_napaka : (76 : ℚ) / 10 = 7.6 ∧ (7.6 : ℚ) = 10 * 0.76 := by norm_num

/-- Naloga 3c (odgovor in pot »S stolpci«): en kvadratek je 1/100, 0,76 = 76/100 je 76 kvadratkov;
7 stolpcev po 10 in še 6: 7 · 10 + 6 = 76. -/
theorem n3c_pot1 : (0.76 : ℚ) * 100 = 76 ∧ 7 * 10 + 6 = 76 ∧ (7 : ℚ) / 10 = 70 / 100 := by
  refine ⟨by norm_num, rfl, by norm_num⟩

/-- Naloga 3c, »Drugače: koliko ostane belih«: 100 − 76 = 24 = 2 · 10 + 4. -/
theorem n3c_pot2 : 100 - 76 = 24 ∧ 2 * 10 + 4 = 24 := by decide

/-- Naloga 3c, napaka: 7 + 6 = 13 kvadratkov ni 76. -/
theorem n3c_napaka : 7 + 6 = 13 ∧ 13 ≠ 76 := by decide

/-- Točke naloge 3d. -/
inductive Tocka3d
  | A | B | C | D

/-- Vodoravna koordinata točke na SVG sliki. -/
def x3d : Tocka3d → ℚ
  | .A => 60 | .B => 120 | .C => 174 | .D => 234

/-- Vrednost točke na premici: A je v zgornji vrstici (0 pri x = 18, 0,5 pri x = 318), druge so v
spodnji (0,5 pri x = 18, 1 pri x = 318). -/
def vrednost3d : Tocka3d → ℚ
  | .A => (x3d .A - 18) / 600
  | p => 1 / 2 + (x3d p - 18) / 600

/-- Naloga 3d (odgovor, ↔): točka ponazarja 0,76 natanko tedaj, ko je to C. -/
theorem n3d_odgovor (p : Tocka3d) : vrednost3d p = 0.76 ↔ p = .C := by
  cases p <;> simp [vrednost3d, x3d] <;> norm_num

/-- Naloga 3d, »Štetje črtic«: dolge črtice so na 60 enot (60/600 = 0,1), kratke na 6 enot
(6/600 = 0,01); 0,7 je tretja dolga črtica spodaj (18 + 2 · 60 = 138, vrednost 0,7); 6 kratkih črtic
desno je 138 + 6 · 6 = 174 (točka C), 0,7 + 0,06 = 0,76; A = 0,07, B = 0,67, D = 0,86. -/
theorem n3d_pot :
    (60 : ℚ) / 600 = 0.1 ∧ (6 : ℚ) / 600 = 0.01 ∧ (18 : ℚ) + 2 * 60 = 138 ∧
    (1 : ℚ) / 2 + (138 - 18) / 600 = 0.7 ∧ (138 : ℚ) + 6 * 6 = x3d .C ∧ (0.7 : ℚ) + 0.06 = 0.76 ∧
    vrednost3d .A = 0.07 ∧ vrednost3d .B = 0.67 ∧ vrednost3d .C = 0.76 ∧ vrednost3d .D = 0.86 := by
  simp only [vrednost3d, x3d]; norm_num

/-- Ulomki naloge 3e po vrsti A … F. -/
def ulomki3e : Fin 6 → ℚ := ![19 / 25, 76 / 10, 38 / 50, 7 / 6, 760 / 1000, 19 / 50]

/-- Naloga 3e (odgovor, ↔): ulomek je enak 0,76 natanko tedaj, ko je to A, C ali E (indeksi 0, 2, 4). -/
theorem n3e_odgovor (i : Fin 6) : ulomki3e i = 0.76 ↔ i = 0 ∨ i = 2 ∨ i = 4 := by
  fin_cases i <;> simp [ulomki3e] <;> norm_num

/-- Naloga 3e, »Del od 100 kvadratkov«: 100 : 25 = 4, 19 · 4 = 76; 76/10 = 7,6 = 10 · 0,76;
100 : 50 = 2, 38 · 2 = 76; 7/6 > 1 > 0,76; 760/1000 = 0,760 = 0,76; 19 · 2 = 38, 0,38 = 0,76 / 2. -/
theorem n3e_pot :
    100 / 25 = 4 ∧ 19 * 4 = 76 ∧ (76 : ℚ) / 10 = 7.6 ∧ (7.6 : ℚ) = 10 * 0.76 ∧ 100 / 50 = 2 ∧
    38 * 2 = 76 ∧ (1 : ℚ) < 7 / 6 ∧ (0.76 : ℚ) < 1 ∧ (760 : ℚ) / 1000 = 0.760 ∧ (0.760 : ℚ) = 0.76 ∧
    19 * 2 = 38 ∧ (19 : ℚ) / 50 = 0.38 ∧ (0.38 : ℚ) = 0.76 / 2 := by
  refine ⟨rfl, rfl, by norm_num, by norm_num, rfl, rfl, by norm_num, by norm_num, by norm_num, by norm_num,
    rfl, by norm_num, by norm_num⟩

/-- Naloga 3f (odgovor in pot »Po števki stotin«): števka stotin je 6 ≥ 5, zaokroženo na desetine
0,8 (round(7,6) = 8); 0,8 − 0,76 = 0,04 < 0,06 = 0,76 − 0,7. -/
theorem n3f :
    5 ≤ 6 ∧ (round ((0.76 : ℚ) * 10) : ℚ) / 10 = 0.8 ∧ (0.8 : ℚ) - 0.76 = 0.04 ∧ (0.76 : ℚ) - 0.7 = 0.06 ∧
    (0.04 : ℚ) < 0.06 := by
  refine ⟨by norm_num, ?_, by norm_num, by norm_num, by norm_num⟩
  have h : round ((0.76 : ℚ) * 10) = 8 := by rw [round_eq, Int.floor_eq_iff]; norm_num
  rw [h]; norm_num

/-- Naloga 3f, napaka: odrezovanje dá ⌊7,6⌋ / 10 = 0,7, ne 0,8. -/
theorem n3f_napaka : (⌊(0.76 : ℚ) * 10⌋ : ℚ) / 10 = 0.7 := by
  have h : ⌊(0.76 : ℚ) * 10⌋ = 7 := by rw [Int.floor_eq_iff]; norm_num
  rw [h]; norm_num

/-! ## Naloga 4 -/

/-- Naloga 4 (podatki s slike): na SVG sliki je V = (130, 94), A = (238, 46), B = (22, 34), kvadratek 12
enot, os y kaže navzdol; A je 9 desno in 4 navzgor od V, B 9 levo in 5 navzgor. -/
theorem n4_slika :
    ((238 : ℚ) - 130) / 12 = 9 ∧ ((94 : ℚ) - 46) / 12 = 4 ∧ ((22 : ℚ) - 130) / 12 = -9 ∧
    ((94 : ℚ) - 34) / 12 = 5 := by norm_num

/-- Vektor VA = (9, 4). -/
noncomputable def VA : EuclideanSpace ℝ (Fin 2) := !₂[9, 4]

/-- Vektor VB = (−9, 5). -/
noncomputable def VB : EuclideanSpace ℝ (Fin 2) := !₂[-9, 5]

/-- Kot AVB v stopinjah. -/
noncomputable def kotAVB : ℝ := InnerProductGeometry.angle VA VB * 180 / π

/-- Kot med krakom VA in vodoravnico v stopinjah: arctg(4/9). -/
noncomputable def alfa4 : ℝ := arctan (4 / 9) * 180 / π

/-- Kot med krakom VB in vodoravnico v stopinjah: arctg(5/9). -/
noncomputable def beta4 : ℝ := arctan (5 / 9) * 180 / π

theorem kot_arccos : InnerProductGeometry.angle VA VB = arccos (-61 / (√97 * √106)) := by
  unfold InnerProductGeometry.angle
  congr 1
  rw [EuclideanSpace.norm_eq, EuclideanSpace.norm_eq]
  simp [VA, VB, Fin.sum_univ_two, inner]
  norm_num

theorem koren97 : √(1 + (4 / 9 : ℝ) ^ 2) = √97 / 9 := by
  rw [show (1 : ℝ) + (4 / 9) ^ 2 = 97 / 9 ^ 2 by norm_num, Real.sqrt_div' _ (by positivity),
    Real.sqrt_sq (by norm_num)]

theorem koren106 : √(1 + (5 / 9 : ℝ) ^ 2) = √106 / 9 := by
  rw [show (1 : ℝ) + (5 / 9) ^ 2 = 106 / 9 ^ 2 by norm_num, Real.sqrt_div' _ (by positivity),
    Real.sqrt_sq (by norm_num)]

/-- Naloga 4b, »Drugače: dva manjša kota« (natančno): kot AVB z vodoravnima kotoma tvori iztegnjeni kot,
∠AVB = π − arctg(4/9) − arctg(5/9). -/
theorem kot_arctan : InnerProductGeometry.angle VA VB = π - arctan (4 / 9) - arctan (5 / 9) := by
  rw [kot_arccos]
  have ha0 := arctan_pos.2 (show (0 : ℝ) < 4 / 9 by norm_num)
  have hb0 := arctan_pos.2 (show (0 : ℝ) < 5 / 9 by norm_num)
  have ha1 := arctan_lt_pi_div_two (4 / 9 : ℝ)
  have hb1 := arctan_lt_pi_div_two (5 / 9 : ℝ)
  have hc : cos (π - arctan (4 / 9) - arctan (5 / 9)) = -61 / (√97 * √106) := by
    rw [sub_sub, cos_pi_sub, cos_add, cos_arctan, cos_arctan, sin_arctan, sin_arctan, koren97, koren106]
    have h1 : (0 : ℝ) < √97 := by positivity
    have h2 : (0 : ℝ) < √106 := by positivity
    field_simp
    ring
  rw [← hc, arccos_cos] <;> linarith

/-- V stopinjah: ∠AVB = 180° − α − β. -/
theorem kot_stopinje : kotAVB = 180 - alfa4 - beta4 := by
  have hpi : π ≠ 0 := pi_ne_zero
  unfold kotAVB alfa4 beta4
  rw [kot_arctan]
  field_simp

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
r = 24,5 · 3,1415/180, y = 4/9). -/
example : let r : ℝ := 23.5 * 3.1416 / 180
    0 < r ∧ r ≤ 1 ∧ (0 : ℝ) < 4 / 9 ∧ r - r ^ 3 / 6 + r ^ 5 / 100 < 4 / 9 * (1 - r ^ 2 / 2 - r ^ 4 * (5 / 96)) := by
  norm_num

example : let r : ℝ := 24.5 * 3.1415 / 180
    0 < r ∧ r ≤ 1 ∧ (0 : ℝ) < 4 / 9 ∧ 4 / 9 * (1 - r ^ 2 / 2 + r ^ 4 * (5 / 96)) < r - r ^ 3 / 6 - r ^ 5 / 100 := by
  norm_num

/-- Iz ločenih mej v radianih na stopinje: d₁ < x · 180/π < d₂. -/
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

/-- Naloga 4b, »Drugače: dva manjša kota«: kot med vodoravnico (desno) in krakom VA je približno 24°:
23,5° < α < 24,5°. -/
theorem n4b_alfa : 23.5 < alfa4 ∧ alfa4 < 24.5 := by
  unfold alfa4
  apply stopinje_med _ _ _ _ _ (by norm_num)
  · exact lt_arctan_of _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  · exact arctan_lt_of _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num)

/-- Naloga 4b, »Drugače: dva manjša kota«: kot med vodoravnico (levo) in krakom VB je približno 29°:
28,5° < β < 29,5°. -/
theorem n4b_beta : 28.5 < beta4 ∧ beta4 < 29.5 := by
  unfold beta4
  apply stopinje_med _ _ _ _ _ (by norm_num)
  · exact lt_arctan_of _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  · exact arctan_lt_of _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num)

/-- Naloga 4b (odgovor): kot AVB leži v priznanem razponu 126° < ∠AVB < 128° (izmerjeno 127°). -/
theorem n4b_odgovor : 126 < kotAVB ∧ kotAVB < 128 := by
  rw [kot_stopinje]
  constructor <;> linarith [n4b_alfa.1, n4b_alfa.2, n4b_beta.1, n4b_beta.2]

/-- Naloga 4b, »Drugače: dva manjša kota« (račun z izmerjenima vrednostma): 180° − 24° − 29° = 127°. -/
theorem n4b_pot2 : (180 : ℚ) - 24 - 29 = 127 := by norm_num

/-- Naloga 4b, »S kotomerom« (preizkus na oko): oba kraka sta položna (α < 45°, β < 45°), zato je kot
AVB večji od pravega: ∠AVB > 90°. -/
theorem n4b_pot1 : alfa4 < 45 ∧ beta4 < 45 ∧ 90 < kotAVB := by
  refine ⟨by linarith [n4b_alfa.2], by linarith [n4b_beta.2], by linarith [n4b_odgovor.1]⟩

/-- Naloga 4b, napaka: 53° je ostri kot (< 90°), kot AVB pa je večji od 90°. -/
theorem n4b_napaka : (53 : ℝ) < 90 ∧ (53 : ℝ) < kotAVB := by
  refine ⟨by norm_num, by linarith [n4b_odgovor.1]⟩

/-- Naloga 4c (odgovor in pot »Primerjava s pravim in iztegnjenim kotom«): 90° < ∠AVB < 180°, zato je kot
topi (ni ostri: ni < 90°; ni vdrti: ni > 180°; ni polni: ni 360°); tudi za izmerjeno vrednost
90 < 127 < 180; kot na drugi strani krakov meri 360° − ∠AVB > 180° (vdrti). -/
theorem n4c :
    90 < kotAVB ∧ kotAVB < 180 ∧ ¬ kotAVB < 90 ∧ ¬ 180 < kotAVB ∧ kotAVB ≠ 360 ∧
    (90 : ℚ) < 127 ∧ (127 : ℚ) < 180 ∧ 180 < 360 - kotAVB := by
  have h := n4b_odgovor
  refine ⟨by linarith, by linarith, by linarith, by linarith, by linarith, by norm_num, by norm_num,
    by linarith⟩

/-- Naloga 4d (odgovor in pot »Od iztegnjenega kota«): 180° − 127° = 53°, preizkus 127° + 53° = 180°;
za natančni kot je razlika med 52° in 54°. -/
theorem n4d :
    (180 : ℚ) - 127 = 53 ∧ (127 : ℚ) + 53 = 180 ∧ 52 < 180 - kotAVB ∧ 180 - kotAVB < 54 := by
  have h := n4b_odgovor
  refine ⟨by norm_num, by norm_num, by linarith, by linarith⟩

/-- Naloga 4d, napaka: 127° − 90° = 37° je razlika do pravega kota, ne do iztegnjenega (53°). -/
theorem n4d_napaka : (127 : ℚ) - 90 = 37 ∧ (37 : ℚ) ≠ 53 := by norm_num

/-- Naloga 4e (odgovor, ↔, v minutah): 143°12' = 8 592', 58°45' = 3 525'; γ + x = β natanko tedaj,
ko je x = 84°27' = 5 067'. -/
theorem n4e_odgovor (x : ℚ) : (58 * 60 + 45) + x = 143 * 60 + 12 ↔ x = 84 * 60 + 27 := by
  constructor <;> intro h <;> linarith

/-- Naloga 4e, »S prehodom čez stopinjo«: 143°12' = 142°72' (12' + 60' = 72'); 142° − 58° = 84°,
72' − 45' = 27'; rezultat 84°27'. -/
theorem n4e_pot1 :
    (143 : ℚ) * 60 + 12 = 142 * 60 + 72 ∧ (12 : ℚ) + 60 = 72 ∧ (142 : ℚ) - 58 = 84 ∧
    (72 : ℚ) - 45 = 27 ∧
    ((142 : ℚ) * 60 + 72) - (58 * 60 + 45) = (142 - 58) * 60 + (72 - 45) := by norm_num

/-- Naloga 4e, »Drugače: dopolnjevanje od γ do β«: 58°45' + 15' = 59°; 59° + 84° = 143°; 143° + 12' =
143°12'; 15' + 12' = 27'; preizkus 84°27' + 58°45' = 142°72' = 143°12'. -/
theorem n4e_pot2 :
    (58 : ℚ) * 60 + 45 + 15 = 59 * 60 ∧ (59 : ℚ) + 84 = 143 ∧ (143 : ℚ) * 60 + 12 = 143 * 60 + 12 ∧
    (15 : ℚ) + 12 = 27 ∧ (84 : ℚ) * 60 + 27 + (58 * 60 + 45) = 142 * 60 + 72 ∧
    (142 : ℚ) * 60 + 72 = 143 * 60 + 12 := by norm_num

/-- Naloga 4e, napaka: 45' − 12' = 33' in 85°33' ≠ 84°27' (85°33' + 58°45' ≠ 143°12'). -/
theorem n4e_napaka :
    (45 : ℚ) - 12 = 33 ∧ (85 : ℚ) * 60 + 33 ≠ 84 * 60 + 27 ∧
    (85 : ℚ) * 60 + 33 + (58 * 60 + 45) ≠ 143 * 60 + 12 := by norm_num

/-! ## Naloga 5 -/

/-- Naloga 5a (odgovor in pot »Pretvornik 100«): 4,08 · 100 = 408; 4 m = 400 cm, 0,08 m = 8 cm. -/
theorem n5a : (4.08 : ℚ) * 100 = 408 ∧ (4 : ℚ) * 100 = 400 ∧ (0.08 : ℚ) * 100 = 8 ∧ (400 : ℚ) + 8 = 408 := by
  norm_num

/-- Naloga 5a, napaka: 0,08 m je 8 cm, ne 80 cm; 480 cm je 4,8 m ≠ 4,08 m. -/
theorem n5a_napaka : (480 : ℚ) / 100 = 4.8 ∧ (4.8 : ℚ) ≠ 4.08 := by norm_num

/-- Naloga 5b (odgovor in pot »Pretvornik 100 pri ploščini«): 1 dm = 10 cm, 10 · 10 = 100 cm²;
2,6 · 100 = 260. -/
theorem n5b : (10 : ℚ) * 10 = 100 ∧ (2.6 : ℚ) * 100 = 260 := by norm_num

/-- Naloga 5b, napaka: 2,6 · 10 = 26 ≠ 260. -/
theorem n5b_napaka : (2.6 : ℚ) * 10 = 26 ∧ (26 : ℚ) ≠ 260 := by norm_num

/-- Naloga 5c (odgovor in pot »Pretvornik 100«): 1 kg = 1 000 g, 1 dag = 10 g, 1 000 : 10 = 100;
1,35 · 100 = 135. -/
theorem n5c : (1000 : ℚ) / 10 = 100 ∧ (1.35 : ℚ) * 100 = 135 := by norm_num

/-- Naloga 5c, napaka: 1,35 kg = 1 350 g, to je 1 350 : 10 = 135 dag (ne 1 350 dag). -/
theorem n5c_napaka : (1.35 : ℚ) * 1000 = 1350 ∧ (1350 : ℚ) / 10 = 135 ∧ (1350 : ℚ) ≠ 135 := by norm_num

/-- Naloga 5d (odgovor in pot »Pretvornik 60«): 2,4 · 60 = 144; 2 · 60 = 120, 0,4 · 60 = 24,
120 + 24 = 144. -/
theorem n5d :
    (2.4 : ℚ) * 60 = 144 ∧ (2 : ℚ) * 60 = 120 ∧ (0.4 : ℚ) * 60 = 24 ∧ (120 : ℚ) + 24 = 144 := by norm_num

/-- Naloga 5d, napaka: »2 uri in 40 minut« je 2 · 60 + 40 = 160 ≠ 144. -/
theorem n5d_napaka : (2 : ℚ) * 60 + 40 = 160 ∧ (160 : ℚ) ≠ 144 := by norm_num

/-- Naloga 5e (odgovor, ↔): za t tednov in d < 7 dni je 7t + d = 52 natanko tedaj, ko t = 7 in d = 3. -/
theorem n5e_odgovor (t d : ℕ) (hd : d < 7) : 7 * t + d = 52 ↔ t = 7 ∧ d = 3 := by
  omega

example : (3 : ℕ) < 7 := by norm_num

/-- Naloga 5e, »Deljenje z ostankom«: 52 : 7 = 7, ostanek 3; 7 · 7 = 49, 52 − 49 = 3. -/
theorem n5e_pot : 52 / 7 = 7 ∧ 52 % 7 = 3 ∧ 7 * 7 = 49 ∧ 52 - 49 = 3 := by decide

/-- Naloga 5e, napaka: »5 tednov 2 dni« je 5 · 7 + 2 = 37 ≠ 52 dni. -/
theorem n5e_napaka : 5 * 7 + 2 = 37 ∧ 37 ≠ 52 := by decide

/-! ## Naloga 6 -/

/-- Naloga 6a (odgovor in pot »Po korakih«): o = 2 · 12,6 + 2 · 8,4 = 25,2 + 16,8 = 42. -/
theorem n6a_pot1 : (2 : ℚ) * 12.6 + 2 * 8.4 = 42 := by
  calc (2 : ℚ) * 12.6 + 2 * 8.4 = 25.2 + 16.8 := by norm_num
    _ = 42 := by norm_num

/-- Naloga 6a, »Drugače: najprej polovica obsega«: 12,6 + 8,4 = 21, o = 2 · 21 = 42. -/
theorem n6a_pot2 : (12.6 : ℚ) + 8.4 = 21 ∧ (2 : ℚ) * 21 = 42 ∧
    (2 : ℚ) * 12.6 + 2 * 8.4 = 2 * (12.6 + 8.4) := by norm_num

/-- Naloga 6a, napaka: 21 m je le polovica obsega (2 · 21 = 42); 12,6 · 8,4 = 105,84 je ploščina. -/
theorem n6a_napaka : (21 : ℚ) = 42 / 2 ∧ (12.6 : ℚ) * 8.4 = 105.84 := by norm_num

/-- Naloga 6b (odgovor in pot »Razmiki okoli terase«): 140 cm = 1,4 m, 42 m = 4 200 cm,
4 200 : 140 = 30 razmikov; pri sklenjeni ograji so stebrički na legah k · 1,4 m (k = 0 … 29): teh leg je
30, vse so pred koncem 42 m, 30 · 1,4 = 42 pa je spet začetek. -/
theorem n6b_pot1 :
    (140 : ℚ) / 100 = 1.4 ∧ (42 : ℚ) * 100 = 4200 ∧ (4200 : ℚ) / 140 = 30 ∧
    ((Finset.range 30).image (fun k : ℕ => (k : ℚ) * 1.4)).card = 30 ∧
    (∀ k ∈ Finset.range 30, (k : ℚ) * 1.4 < 42) ∧ (30 : ℚ) * 1.4 = 42 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, ?_, by norm_num⟩
  · rw [Finset.card_image_of_injective _ ?_, Finset.card_range]
    intro a b h
    have : (a : ℚ) = b := by
      have h' : (a : ℚ) * 1.4 = b * 1.4 := h
      linarith
    exact_mod_cast this
  · intro k hk
    have : (k : ℚ) ≤ 29 := by
      have := Finset.mem_range.1 hk
      exact_mod_cast (by omega : k ≤ 29)
    linarith

/-- Naloga 6b, »Drugače: po stranicah«: 12,6 : 1,4 = 9, 8,4 : 1,4 = 6, 9 + 6 + 9 + 6 = 30; vogali so
pri 0, 9, 15 in 24 razmikih (0, 12,6, 21 in 33,6 m), torej na stebričkih. -/
theorem n6b_pot2 :
    (12.6 : ℚ) / 1.4 = 9 ∧ (8.4 : ℚ) / 1.4 = 6 ∧ 9 + 6 + 9 + 6 = 30 ∧
    (9 : ℚ) * 1.4 = 12.6 ∧ (15 : ℚ) * 1.4 = 12.6 + 8.4 ∧ (24 : ℚ) * 1.4 = 12.6 + 8.4 + 12.6 := by
  refine ⟨by norm_num, by norm_num, rfl, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 6b, napaka: 10 + 7 + 10 + 7 = 34 stebričkov po stranicah (9 + 1 in 6 + 1) šteje 4 vogalne
dvakrat: 34 − 4 = 30. -/
theorem n6b_napaka : 9 + 1 = 10 ∧ 6 + 1 = 7 ∧ 10 + 7 + 10 + 7 = 34 ∧ 34 - 4 = 30 := by decide

/-- Naloga 6c (odgovor): 12,6 · 8,4 = 105,84. -/
theorem n6c_odgovor : (12.6 : ℚ) * 8.4 = 105.84 := by norm_num

/-- Naloga 6c, »Pisno množenje decimalnih števil«: 126 · 8 = 1 008 (desetice: 10 080), 126 · 4 = 504,
10 080 + 504 = 10 584; dve decimalki: 12,6 · 8,4 = 10 584 / 100 = 105,84. -/
theorem n6c_pot1 :
    126 * 8 = 1008 ∧ 1008 * 10 = 10080 ∧ 126 * 4 = 504 ∧ 10080 + 504 = 10584 ∧
    (12.6 : ℚ) * 8.4 = (126 * 84) / (10 * 10) ∧ (10584 : ℚ) / 100 = 105.84 := by
  refine ⟨rfl, rfl, rfl, rfl, by norm_num, by norm_num⟩

/-- Naloga 6c, »Drugače: razdeli dolžino na dva dela«: 12,6 = 12 + 0,6; 12 · 8,4 = 100,8,
0,6 · 8,4 = 5,04, 100,8 + 5,04 = 105,84; ocena 13 · 8 = 104. -/
theorem n6c_pot2 :
    (12.6 : ℚ) = 12 + 0.6 ∧ (12 : ℚ) * 8.4 = 100.8 ∧ (0.6 : ℚ) * 8.4 = 5.04 ∧ (100.8 : ℚ) + 5.04 = 105.84 ∧
    13 * 8 = 104 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, rfl⟩

/-- Naloga 6c, napaka: 1 058,4 in 10,584 nista 105,84; od ocene 104 je 105,84 oddaljeno manj kot 2,
drugi dve vrednosti pa več kot 90. -/
theorem n6c_napaka :
    (1058.4 : ℚ) ≠ 105.84 ∧ (10.584 : ℚ) ≠ 105.84 ∧ |(105.84 : ℚ) - 104| < 2 ∧
    90 < |(1058.4 : ℚ) - 104| ∧ 90 < |(10.584 : ℚ) - 104| := by
  refine ⟨by norm_num, by norm_num, ?_, ?_, ?_⟩
  · rw [abs_of_pos (by norm_num)]; norm_num
  · rw [abs_of_pos (by norm_num)]; norm_num
  · rw [abs_of_neg (by norm_num)]; norm_num

/-- Naloga 6d (odgovor, ploščina): n desk (vsaka 2,1 · 0,35 = 0,735 m², brez prekrivanja) pokrije vsaj
105,84 m² natanko tedaj, ko je n ≥ 144; 144 desk pokrije natanko 105,84 m². -/
theorem n6d_odgovor (n : ℕ) : (105.84 : ℚ) ≤ n * (2.1 * 0.35) ↔ 144 ≤ n := by
  constructor
  · intro h
    by_contra hn
    have : (n : ℚ) ≤ 143 := by exact_mod_cast (by omega : n ≤ 143)
    nlinarith
  · intro h
    have : (144 : ℚ) ≤ n := by exact_mod_cast h
    nlinarith

/-- Naloga 6d, »Po vrstah«: 21 dm = 2,1 m, 35 cm = 0,35 m; 12,6 : 2,1 = 6; 8,4 : 0,35 = 24
(840 : 35 = 24); 6 · 24 = 144. -/
theorem n6d_pot1 :
    (21 : ℚ) / 10 = 2.1 ∧ (35 : ℚ) / 100 = 0.35 ∧ (12.6 : ℚ) / 2.1 = 6 ∧ (8.4 : ℚ) / 0.35 = 24 ∧
    (840 : ℚ) / 35 = 24 ∧ 6 * 24 = 144 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, rfl⟩

/-- Naloga 6d, »Drugače: deske obrnjene drugače«: 8,4 : 2,1 = 4; 12,6 : 0,35 = 36 (1 260 : 35 = 36);
4 · 36 = 144; ena deska 2,1 · 0,35 = 0,735 m², 144 · 0,735 = 105,84 (ploščina iz c), 143 · 0,735 < 105,84. -/
theorem n6d_pot2 :
    (8.4 : ℚ) / 2.1 = 4 ∧ (12.6 : ℚ) / 0.35 = 36 ∧ (1260 : ℚ) / 35 = 36 ∧ 4 * 36 = 144 ∧
    (2.1 : ℚ) * 0.35 = 0.735 ∧ (144 : ℚ) * 0.735 = 105.84 ∧ (105.84 : ℚ) = 12.6 * 8.4 ∧
    (143 : ℚ) * 0.735 < 105.84 := by
  refine ⟨by norm_num, by norm_num, by norm_num, rfl, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 6d, napaka: brez pretvorbe 12,6 : 21 = 0,6 in 8,4 : 35 = 0,24 (nista celi števili desk). -/
theorem n6d_napaka :
    (12.6 : ℚ) / 21 = 0.6 ∧ (8.4 : ℚ) / 35 = 0.24 ∧ (∀ k : ℤ, (k : ℚ) ≠ 0.6) ∧ (∀ k : ℤ, (k : ℚ) ≠ 0.24) := by
  refine ⟨by norm_num, by norm_num, fun k h => ?_, fun k h => ?_⟩
  · have h0 : (0 : ℚ) < k := by rw [h]; norm_num
    have h1 : (k : ℚ) < 1 := by rw [h]; norm_num
    have : (0 : ℤ) < k := by exact_mod_cast h0
    have : k < (1 : ℤ) := by exact_mod_cast h1
    omega
  · have h0 : (0 : ℚ) < k := by rw [h]; norm_num
    have h1 : (k : ℚ) < 1 := by rw [h]; norm_num
    have : (0 : ℤ) < k := by exact_mod_cast h0
    have : k < (1 : ℤ) := by exact_mod_cast h1
    omega

/-! ## Naloga 7 -/

/-- Cene rolerjev v trgovinah Veter (0), Skok (1), Zalet (2). -/
def rolerji7 : Fin 3 → ℚ := ![79.90, 74.50, 82.40]
/-- Cene čelade. -/
def celada7 : Fin 3 → ℚ := ![32.60, 36.90, 29.80]
/-- Cene ščitnikov. -/
def scitniki7 : Fin 3 → ℚ := ![18.75, 21.40, 19.60]

/-- Naloga 7a (odgovor): vsak nakup (rolerji v i, čelada v j, ščitniki v k) stane vsaj 123,05 €;
najcenejši (Skok, Zalet, Veter) stane natanko 123,05 €; Tilen ima 50 + 35,50 + 38,20 = 123,70 € ≥ 123,05 €,
torej ima dovolj, ostane 0,65 €. -/
theorem n7a_odgovor :
    (∀ i j k : Fin 3, (123.05 : ℚ) ≤ rolerji7 i + celada7 j + scitniki7 k) ∧
    rolerji7 1 + celada7 2 + scitniki7 0 = 123.05 ∧ (50.00 : ℚ) + 35.50 + 38.20 = 123.70 ∧
    (123.05 : ℚ) ≤ 123.70 ∧ (123.70 : ℚ) - 123.05 = 0.65 := by
  refine ⟨fun i j k => ?_, by simp [rolerji7, celada7, scitniki7]; norm_num, by norm_num, by norm_num,
    by norm_num⟩
  fin_cases i <;> fin_cases j <;> fin_cases k <;> simp [rolerji7, celada7, scitniki7] <;> norm_num

/-- Naloga 7a, »Najnižje cene in primerjava«: najnižje cene so 74,50 (Skok), 29,80 (Zalet), 18,75 (Veter);
74,50 + 29,80 + 18,75 = 123,05; 50,00 + 35,50 + 38,20 = 123,70; 123,70 > 123,05; ostane 0,65. -/
theorem n7a_pot1 :
    (∀ i, rolerji7 1 ≤ rolerji7 i) ∧ (∀ i, celada7 2 ≤ celada7 i) ∧ (∀ i, scitniki7 0 ≤ scitniki7 i) ∧
    rolerji7 1 = 74.50 ∧ celada7 2 = 29.80 ∧ scitniki7 0 = 18.75 ∧
    (74.50 : ℚ) + 29.80 + 18.75 = 123.05 ∧ (50.00 : ℚ) + 35.50 + 38.20 = 123.70 ∧
    (123.05 : ℚ) < 123.70 ∧ (123.70 : ℚ) - 123.05 = 0.65 := by
  refine ⟨fun i => ?_, fun i => ?_, fun i => ?_, by simp [rolerji7], by simp [celada7],
    by simp [scitniki7], by norm_num, by norm_num, by norm_num, by norm_num⟩ <;>
  fin_cases i <;> simp [rolerji7, celada7, scitniki7] <;> norm_num

/-- Naloga 7a, »Drugače: sproti odštevaj«: 123,70 − 74,50 = 49,20; 49,20 − 29,80 = 19,40;
19,40 − 18,75 = 0,65 ≥ 0 (vsi ostanki so nenegativni). -/
theorem n7a_pot2 :
    (123.70 : ℚ) - 74.50 = 49.20 ∧ (49.20 : ℚ) - 29.80 = 19.40 ∧ (19.40 : ℚ) - 18.75 = 0.65 ∧
    (0 : ℚ) ≤ 49.20 ∧ (0 : ℚ) ≤ 19.40 ∧ (0 : ℚ) ≤ 0.65 := by norm_num

/-- Naloga 7a, napaka: vse v Vetru stane 131,25 € > 123,70 €, a naloga dovoljuje različne trgovine. -/
theorem n7a_napaka :
    rolerji7 0 + celada7 0 + scitniki7 0 = 131.25 ∧ (123.70 : ℚ) < 131.25 := by
  simp [rolerji7, celada7, scitniki7]; norm_num

/-- Skupna cena vseh treh izdelkov v isti trgovini. -/
def skupaj7 (t : Fin 3) : ℚ := rolerji7 t + celada7 t + scitniki7 t

/-- Naloga 7b (odgovor, ↔): trgovina t je najcenejša za nakup vseh treh izdelkov (njena skupna cena ni
večja od nobene druge) natanko tedaj, ko je t = Veter (0). -/
theorem n7b_odgovor (t : Fin 3) : (∀ s, skupaj7 t ≤ skupaj7 s) ↔ t = 0 := by
  simp only [Fin.forall_fin_succ, IsEmpty.forall_iff]
  fin_cases t <;> simp [skupaj7, rolerji7, celada7, scitniki7] <;> norm_num

/-- Naloga 7b, »Skupne cene po trgovinah«: Veter 79,90 + 32,60 + 18,75 = 131,25; Skok 74,50 + 36,90 +
21,40 = 132,80; Zalet 82,40 + 29,80 + 19,60 = 131,80; najmanjša je 131,25 (Veter); 123,70 < 131,25. -/
theorem n7b_pot1 :
    skupaj7 0 = 79.90 + 32.60 + 18.75 ∧ (79.90 : ℚ) + 32.60 + 18.75 = 131.25 ∧
    skupaj7 1 = 74.50 + 36.90 + 21.40 ∧ (74.50 : ℚ) + 36.90 + 21.40 = 132.80 ∧
    skupaj7 2 = 82.40 + 29.80 + 19.60 ∧ (82.40 : ℚ) + 29.80 + 19.60 = 131.80 ∧
    (131.25 : ℚ) < 131.80 ∧ (131.80 : ℚ) < 132.80 ∧ (123.70 : ℚ) < 131.25 := by
  simp [skupaj7, rolerji7, celada7, scitniki7]; norm_num

/-- Naloga 7b, »Drugače: primerjaj razlike z Vetrom«: Skok: 79,90 − 74,50 = 5,40, 36,90 − 32,60 = 4,30,
21,40 − 18,75 = 2,65, 4,30 + 2,65 = 6,95, 6,95 − 5,40 = 1,55 (Skok − Veter); Zalet: 82,40 − 79,90 = 2,50,
19,60 − 18,75 = 0,85, 32,60 − 29,80 = 2,80, 2,50 + 0,85 = 3,35, 3,35 − 2,80 = 0,55 (Zalet − Veter). -/
theorem n7b_pot2 :
    (79.90 : ℚ) - 74.50 = 5.40 ∧ (36.90 : ℚ) - 32.60 = 4.30 ∧ (21.40 : ℚ) - 18.75 = 2.65 ∧
    (4.30 : ℚ) + 2.65 = 6.95 ∧ (6.95 : ℚ) - 5.40 = 1.55 ∧ skupaj7 1 - skupaj7 0 = 1.55 ∧
    (82.40 : ℚ) - 79.90 = 2.50 ∧ (19.60 : ℚ) - 18.75 = 0.85 ∧ (32.60 : ℚ) - 29.80 = 2.80 ∧
    (2.50 : ℚ) + 0.85 = 3.35 ∧ (3.35 : ℚ) - 2.80 = 0.55 ∧ skupaj7 2 - skupaj7 0 = 0.55 := by
  simp [skupaj7, rolerji7, celada7, scitniki7]; norm_num

/-- Naloga 7b, napaka: Skok ima najcenejše rolerje (74,50 €), a skupaj je najdražji (132,80 €). -/
theorem n7b_napaka : (∀ i, rolerji7 1 ≤ rolerji7 i) ∧ ∀ s, skupaj7 s ≤ skupaj7 1 := by
  refine ⟨n7a_pot1.1, fun s => ?_⟩
  fin_cases s <;> simp [skupaj7, rolerji7, celada7, scitniki7] <;> norm_num

/-! ## Naloga 8 -/

/-- Naloga 8a (odgovor in pot »Po skupinah«): 11 + 13 = 24, 14 + 9 = 23, 12 + 13 = 25,
24 + 23 + 25 = 72; preizkus po stolpcih 11 + 14 + 12 = 37, 13 + 9 + 13 = 35, 37 + 35 = 72. -/
theorem n8a :
    11 + 13 = 24 ∧ 14 + 9 = 23 ∧ 12 + 13 = 25 ∧ 24 + 23 + 25 = 72 ∧
    11 + 14 + 12 = 37 ∧ 13 + 9 + 13 = 35 ∧ 37 + 35 = 72 := by decide

/-- Naloga 8a, napaka: samo dečkov je 37 ≠ 72. -/
theorem n8a_napaka : 11 + 14 + 12 = 37 ∧ 37 ≠ 72 := by decide

/-- Naloga 8b (odgovor in pot »Od skupnega zneska odštej znane stroške«): 489,60 + 180,00 = 669,60;
1 108,80 − 669,60 = 439,20; preizkus 489,60 + 180,00 + 439,20 = 1 108,80. -/
theorem n8b :
    (489.60 : ℚ) + 180.00 = 669.60 ∧ (1108.80 : ℚ) - 669.60 = 439.20 ∧
    (489.60 : ℚ) + 180.00 + 439.20 = 1108.80 := by norm_num

/-- Naloga 8b, napaka: 1 108,80 − 489,60 = 619,20 = 180,00 + 439,20 (vsebuje še vodenje). -/
theorem n8b_napaka : (1108.80 : ℚ) - 489.60 = 619.20 ∧ (619.20 : ℚ) = 180.00 + 439.20 := by norm_num

/-- Naloga 8c (odgovor, ↔): 72 · x = 1 108,80 natanko tedaj, ko je x = 15,40. -/
theorem n8c_odgovor (x : ℚ) : 72 * x = 1108.80 ↔ x = 15.40 := by
  constructor <;> intro h <;> linarith

/-- Naloga 8c, »Skupni znesek deliš s številom učencev«: 110 = 1 · 72 + 38; 388 = 5 · 72 + 28
(72 · 5 = 360); 288 = 4 · 72 + 0; 0 = 0 · 72; 1 108,80 : 72 = 15,40; preizkus 72 · 15,40 = 1 108,80. -/
theorem n8c_pot1 :
    110 = 1 * 72 + 38 ∧ 388 = 5 * 72 + 28 ∧ 72 * 5 = 360 ∧ 288 = 4 * 72 + 0 ∧ 0 = 0 * 72 ∧
    (1108.80 : ℚ) / 72 = 15.40 ∧ (72 : ℚ) * 15.40 = 1108.80 := by
  refine ⟨rfl, rfl, rfl, rfl, rfl, by norm_num, by norm_num⟩

/-- Naloga 8c, »Drugače: vsako postavko posebej«: 489,60 : 72 = 6,80; 180,00 : 72 = 2,50;
439,20 : 72 = 6,10; 6,80 + 2,50 + 6,10 = 15,40. -/
theorem n8c_pot2 :
    (489.60 : ℚ) / 72 = 6.80 ∧ (180.00 : ℚ) / 72 = 2.50 ∧ (439.20 : ℚ) / 72 = 6.10 ∧
    (6.80 : ℚ) + 2.50 + 6.10 = 15.40 := by norm_num

/-- Naloga 8c, napaka: 1 108,80 : 3 = 369,60 je znesek na skupino, ne na učenca. -/
theorem n8c_napaka : (1108.80 : ℚ) / 3 = 369.60 ∧ (369.60 : ℚ) ≠ 15.40 := by norm_num

/-! ## Naloga 9 -/

/-- Naloga 9a (odgovor): 3/10 od 60 je 18, 1/4 od 60 je 15, rdečih 60 − 18 − 15 = 27. -/
theorem n9a_odgovor :
    (3 : ℚ) / 10 * 60 = 18 ∧ (1 : ℚ) / 4 * 60 = 15 ∧ (60 : ℚ) - 18 - 15 = 27 := by norm_num

/-- Naloga 9a, »Del od celote«: 60 : 10 = 6, 3 · 6 = 18; 60 : 4 = 15; 60 − 18 − 15 = 27;
preizkus 18 + 15 + 27 = 60. -/
theorem n9a_pot1 :
    60 / 10 = 6 ∧ 60 % 10 = 0 ∧ 3 * 6 = 18 ∧ 60 / 4 = 15 ∧ 60 % 4 = 0 ∧ 60 - 18 - 15 = 27 ∧
    18 + 15 + 27 = 60 := by decide

/-- Naloga 9a, »Drugače: skupine po 3 balone«: 60 = 20 · 3; desetina 20 skupin sta 2 skupini, tri desetine
3 · 2 = 6 skupin, 6 · 3 = 18; četrtina 20 : 4 = 5 skupin, 5 · 3 = 15; 20 − 6 − 5 = 9, 9 · 3 = 27. -/
theorem n9a_pot2 :
    60 = 20 * 3 ∧ 20 / 10 = 2 ∧ 3 * 2 = 6 ∧ 6 * 3 = 18 ∧ 20 / 4 = 5 ∧ 5 * 3 = 15 ∧ 20 - 6 - 5 = 9 ∧
    9 * 3 = 27 := by decide

/-- Naloga 9a, napaka: 60 : 3 = 20 ni tri desetine od 60 (to je 18). -/
theorem n9a_napaka : 60 / 3 = 20 ∧ (3 : ℚ) / 10 * 60 ≠ 20 := by
  refine ⟨rfl, by norm_num⟩

/-- Naloga 9b (odgovor in pot »Del od celote«): rdečih je 27/60 = 9/20; preizkus
6/20 + 5/20 + 9/20 = 20/20 = 1. -/
theorem n9b :
    (27 : ℚ) / 60 = 9 / 20 ∧ (6 : ℚ) / 20 + 5 / 20 + 9 / 20 = 20 / 20 ∧ (20 : ℚ) / 20 = 1 := by norm_num

/-- Naloga 9b, napaka: 27/100 ≠ 27/60. -/
theorem n9b_napaka : (27 : ℚ) / 100 ≠ 27 / 60 := by norm_num

/-- Naloga 9c (odgovor in poti): 18 : 3 = 6, 15 : 3 = 5, 27 : 3 = 9 simbolov; preizkus 6 + 5 + 9 = 20,
20 · 3 = 60. -/
theorem n9c :
    18 / 3 = 6 ∧ 18 % 3 = 0 ∧ 15 / 3 = 5 ∧ 15 % 3 = 0 ∧ 27 / 3 = 9 ∧ 27 % 3 = 0 ∧ 6 + 5 + 9 = 20 ∧
    20 * 3 = 60 := by decide

/-- Naloga 9c, napaka: 18 + 15 + 27 = 60 simbolov po 3 balone bi pomenilo 180 balonov, ne 60. -/
theorem n9c_napaka : (18 + 15 + 27) * 3 = 180 ∧ 180 ≠ 60 := by decide

end Evklid.Pole.NPZ6_MAT_2025_redni
