/-
vir: content/exam-papers/NPZ9-MAT-2023-redni.json
sha256: 7f7f9088cdb1074f5a0aa9bb5acf24802f2132949358c66806fa1419fad05bfa
Ni v Leanu: 1b izbira problema iz besedila (pomen besedila je jezik; dokazani so izrazi vseh štirih izbir in
da je n · 3/4 = 2 1/4 natanko pri n = 3); pisni postopki kot zapis na papirju (»premik vejice«, štetje
decimalnih mest: dokazani so ustrezni zmnožki celih števil in količniki); 4a in 4b v koordinatnem modelu
(S = (0,0), A = (−6,0), B = (0,−6), C = (6,0), D = (0,6), očrtani kvadrat z oglišči (±6, ±6)); dolžina loka
kot krivulje ni dokazana (zahtevno, še ni dokazano), uporabljen je obrazec l = r·α s središčnim kotom α,
dokazanim kot ∠DSC = ∠BSA = π/2; ocena »tetiva krajša od loka« je dokazana samo za števila 6√2 < 3π;
6a odčitek točke A s slike (dokazana je pretvorba koordinat slike SVG v koordinate: x = (px − 140)/20,
y = (120 − py)/20, za A in za točke rešitvenih slik); 6b in 6c/6d kot risanje (dokazane so koordinate in
kvadrant); 6e ploščina kot mera lika (zahtevno, še ni dokazano) – ploščina je obrazec |det|/2 za trikotnik
(in a·b za pravokotnik), z njim so dokazani vsi koraki obeh poti; 8a in 8b v koordinatnem modelu prizme z
višino h (B = (0,0,0), C = (8,0,0), A = (0,h,0), E = (0,0,h), F = (8,0,h), D = (0,h,h)); »pokončna
prizma« je dokazana kot: stranski robovi so pravokotni na dva nevzporedna robova osnovne ploskve;
prostornina kot mera telesa (zahtevno, še ni dokazano) – uporabljen je obrazec V = O·v; 8a (3) »premica BC
je projekcija EF« je ponazoritev. Naloga 9: modus je definiran tako kot v rešitvah (podatek, ki se pojavi
vsaj dvakrat in večkrat kot vsak drug podatek; brez ponovitev modusa ni), mediana kot srednji podatek
urejenega seznama oziroma sredina obeh srednjih; v 9c je število v okvirčku poljubno realno, v 9d naravno.
Decimalna števila so točna racionalna števila. Lean: a⁰ = 1 tudi za a = 0 (pogoj a ≠ 0 iz besedila je
ohranjen); √ in deljenje se uporabljata le za pozitivna števila.
4a: pola zdaj navaja približno 8,49 cm in s √2 ≈ 1,41 8,46 cm (prej samo 8,46); oboje dokazano v
`n4a_priblizek`.
-/
module

public import Mathlib

public section

namespace Evklid.Pole.NPZ9_MAT_2023_redni

open EuclideanGeometry

/-! ## Naloga 1 -/

/-- Naloga 1a (1) (uradni odgovor), pot »Po korakih«: 12 = 2²·3, 18 = 2·3², v(12, 18) = 2²·3² = 36;
5/12 = (5·3)/(12·3) = 15/36, 7/18 = (7·2)/(18·2) = 14/36; 15/36 + 14/36 = 29/36; 29 je praštevilo, ki ne
deli 36, zato je ulomek okrajšan (D(29, 36) = 1). -/
theorem n1a1 :
    (12:ℕ) = 2 ^ 2 * 3 ∧ (18:ℕ) = 2 * 3 ^ 2 ∧ Nat.lcm 12 18 = 2 ^ 2 * 3 ^ 2 ∧ (2:ℕ) ^ 2 * 3 ^ 2 = 36 ∧
    (5:ℚ) / 12 = (5 * 3) / (12 * 3) ∧ (5 * 3 : ℚ) / (12 * 3) = 15 / 36 ∧
    (7:ℚ) / 18 = (7 * 2) / (18 * 2) ∧ (7 * 2 : ℚ) / (18 * 2) = 14 / 36 ∧
    (15:ℚ) / 36 + 14 / 36 = 29 / 36 ∧ (5:ℚ) / 12 + 7 / 18 = 29 / 36 ∧
    Nat.Prime 29 ∧ ¬ (29 ∣ 36) ∧ Nat.gcd 29 36 = 1 := by
  refine ⟨by norm_num, by norm_num, by decide, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num, by norm_num, by decide, by decide⟩

/-- Naloga 1a (1), pot »Drugače: z ulomki in preizkusom«: 12·18 = 216; 5/12 + 7/18 = 90/216 + 84/216 =
174/216 = 29/36 (174 = 29·6, 216 = 36·6). -/
theorem n1a1_pot2 :
    (12:ℕ) * 18 = 216 ∧ (174:ℕ) = 29 * 6 ∧ (216:ℕ) = 36 * 6 ∧ (5:ℚ) / 12 + 7 / 18 = 29 / 36 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  calc (5:ℚ) / 12 + 7 / 18 = 90 / 216 + 84 / 216 := by norm_num
    _ = 174 / 216 := by norm_num
    _ = 29 / 36 := by norm_num

/-- Naloga 1a (1), napaka: števca in imenovalca posebej da (5 + 7)/(12 + 18) = 12/30 ≠ 29/36. -/
theorem n1a1_napaka : ((5:ℚ) + 7) / (12 + 18) = 12 / 30 ∧ (12:ℚ) / 30 ≠ 29 / 36 := by norm_num

/-- Naloga 1a (2) (uradni odgovor), pot »Po korakih«: 3 3/5 = 3 + 6/10 = 3,6; deljenec in delitelj pomnožimo
z 10: 3,6 : 0,9 = 36 : 9 = 4. -/
theorem n1a2 :
    (3:ℚ) + 3 / 5 = 3 + 6 / 10 ∧ (3:ℚ) + 6 / 10 = 3.6 ∧ (3 + 3 / 5 : ℚ) / 0.9 = 4 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  calc (3 + 3 / 5 : ℚ) / 0.9 = 3.6 / 0.9 := by norm_num
    _ = (3.6 * 10) / (0.9 * 10) := by norm_num
    _ = 36 / 9 := by norm_num
    _ = 4 := by norm_num

/-- Naloga 1a (2), pot »Drugače«: 3 3/5 = 18/5, 0,9 = 9/10; 18/5 : 9/10 = 18/5 · 10/9 = (2·2)/1 = 4;
preizkus 4 · 0,9 = 3,6. -/
theorem n1a2_pot2 :
    (3:ℚ) + 3 / 5 = 18 / 5 ∧ (0.9:ℚ) = 9 / 10 ∧ (4:ℚ) * 0.9 = 3.6 ∧ (18:ℚ) / 5 / (9 / 10) = 4 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  calc (18:ℚ) / 5 / (9 / 10) = 18 / 5 * (10 / 9) := by rw [div_div_eq_mul_div, mul_div_assoc']
    _ = (2 * 2) / 1 := by norm_num
    _ = 4 := by norm_num

/-- Naloga 1a (3) (uradni odgovor), pot »Po korakih«: 15·24 = 360; skupaj 2 + 1 = 3 decimalna mesta:
0,15 · 2,4 = 360/1000 = 0,360 = 0,36. -/
theorem n1a3 : (15:ℕ) * 24 = 360 ∧ (0.15:ℚ) * 2.4 = 0.36 := by
  refine ⟨by norm_num, ?_⟩
  calc (0.15:ℚ) * 2.4 = (15 * 24) / 10 ^ (2 + 1) := by norm_num
    _ = 360 / 1000 := by norm_num
    _ = 0.36 := by norm_num

/-- Naloga 1a (3), pot »Drugače«: 0,15·2,4 = 0,15·2 + 0,15·0,4 = 0,3 + 0,06 = 0,36; ocena: 0,15 > 0,1,
0,1·2,4 = 0,24 in 0,24 < 0,36 < 2,4. Napaka 3,6 ≠ 0,36. -/
theorem n1a3_pot2 :
    (0.15:ℚ) * 2.4 = 0.36 ∧ (0.1:ℚ) < 0.15 ∧ (0.1:ℚ) * 2.4 = 0.24 ∧ (0.24:ℚ) < 0.36 ∧ (0.36:ℚ) < 2.4 ∧
    (3.6:ℚ) ≠ 0.36 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  calc (0.15:ℚ) * 2.4 = 0.15 * 2 + 0.15 * 0.4 := by norm_num
    _ = 0.3 + 0.06 := by norm_num
    _ = 0.36 := by norm_num

/-- Naloga 1a (4) (uradni odgovor), pot »Po korakih«: množenje ima prednost: 25·18 = 450, 2,5·1,8 = 4,5;
7 − 4,5 = 2,5. Napaka (od leve proti desni): (7 − 2,5)·1,8 = 8,1 ≠ 2,5. -/
theorem n1a4 :
    (25:ℕ) * 18 = 450 ∧ (2.5:ℚ) * 1.8 = 4.5 ∧ (7:ℚ) - 2.5 * 1.8 = 2.5 ∧
    ((7:ℚ) - 2.5) * 1.8 = 8.1 ∧ (8.1:ℚ) ≠ 2.5 := by
  refine ⟨by norm_num, by norm_num, ?_, by norm_num, by norm_num⟩
  calc (7:ℚ) - 2.5 * 1.8 = 7 - 4.5 := by norm_num
    _ = 2.5 := by norm_num

/-- Naloga 1a (4), pot »Drugače«: 2,5 = 5/2, 2,5·1,8 = (5·1,8)/2 = 9/2 = 4,5 in 7 − 4,5 = 2,5. -/
theorem n1a4_pot2 :
    (2.5:ℚ) = 5 / 2 ∧ (2.5:ℚ) * 1.8 = 4.5 ∧ (7:ℚ) - 4.5 = 2.5 := by
  refine ⟨by norm_num, ?_, by norm_num⟩
  calc (2.5:ℚ) * 1.8 = (5 * 1.8) / 2 := by norm_num
    _ = 9 / 2 := by norm_num
    _ = 4.5 := by norm_num

/-- Naloga 1b (uradni odgovor C), pot »Pomen deljenja«: 2 1/4 : 3/4 = 9/4 · 4/3 = 3, preizkus 3·3/4 = 9/4 =
2 1/4; število kosov n po 3/4 m iz 2 1/4 m vrvi (n · 3/4 = 2 1/4) je natanko n = 3. Druge izbire:
A 2 1/4 : 4 = 9/16, B 3/4 · 2 1/4 = 27/16, D 2 1/4 − 3/4 = 3/2; nobena ni 3. -/
theorem n1b :
    ((2:ℚ) + 1 / 4) / (3 / 4) = 9 / 4 * (4 / 3) ∧ (9:ℚ) / 4 * (4 / 3) = 3 ∧
    (3:ℚ) * (3 / 4) = 9 / 4 ∧ (9:ℚ) / 4 = 2 + 1 / 4 ∧
    (∀ n : ℚ, n * (3 / 4) = 2 + 1 / 4 ↔ n = 3) ∧
    ((2:ℚ) + 1 / 4) / 4 = 9 / 16 ∧ (3:ℚ) / 4 * (2 + 1 / 4) = 27 / 16 ∧ ((2:ℚ) + 1 / 4) - 3 / 4 = 3 / 2 ∧
    (9:ℚ) / 16 ≠ 3 ∧ (27:ℚ) / 16 ≠ 3 ∧ (3:ℚ) / 2 ≠ 3 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, fun n => ⟨fun h => by linarith,
    fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩

/-! ## Naloga 2 -/

/-- Naloga 2a (uradni odgovor), pot »Po pravilu«: a⁰ = 1 za a ≠ 0, zato (−13,7)⁰ = 1; »zakaj«: za a ≠ 0
je a³ : a³ = 1 in a³ : a³ = a³⁻³ = a⁰. Napačni odgovori 0, −1, −13,7. -/
theorem n2a :
    (∀ a : ℚ, a ≠ 0 → a ^ 0 = 1) ∧ (-13.7:ℚ) ≠ 0 ∧ (-13.7:ℚ) ^ 0 = 1 ∧
    (∀ a : ℚ, a ≠ 0 → a ^ 3 / a ^ 3 = a ^ (3 - 3) ∧ a ^ (3 - 3) = a ^ 0 ∧ a ^ 3 / a ^ 3 = 1) ∧
    (1:ℚ) ≠ 0 ∧ (1:ℚ) ≠ -1 ∧ (1:ℚ) ≠ -13.7 := by
  refine ⟨fun a _ => pow_zero a, by norm_num, by norm_num, fun a ha => ?_, by norm_num, by norm_num,
    by norm_num⟩
  have h : a ^ 3 / a ^ 3 = 1 := div_self (pow_ne_zero 3 ha)
  exact ⟨by rw [h]; norm_num, by norm_num, h⟩

/-- Naloga 2b (uradni odgovor), pot »Po korakih«: 1200 = 12·100, 1200² = 12²·100² = 144·10 000 =
1 440 000; napačna 14 400 in 2400. -/
theorem n2b : (1200:ℕ) = 12 * 100 ∧ (1200:ℕ) ^ 2 = 1440000 ∧ (1440000:ℕ) ≠ 14400 ∧ (1440000:ℕ) ≠ 2400 ∧
    2 * 1200 = 2400 := by
  refine ⟨by norm_num, ?_, by norm_num, by norm_num, by norm_num⟩
  calc (1200:ℕ) ^ 2 = 12 ^ 2 * 100 ^ 2 := by norm_num
    _ = 144 * 10000 := by norm_num
    _ = 1440000 := by norm_num

/-- Naloga 2b, pot »Drugače«: 1200·1200 = 1200·1000 + 1200·200 = 1 200 000 + 240 000 = 1 440 000. -/
theorem n2b_pot2 : (1200:ℕ) * 1200 = 1440000 := by
  calc (1200:ℕ) * 1200 = 1200 * 1000 + 1200 * 200 := by norm_num
    _ = 1200000 + 240000 := by norm_num
    _ = 1440000 := by norm_num

/-- Naloga 2c (uradni odgovor), pot »Po korakih«: (−1,2)³ = (−1,2)·(−1,2)·(−1,2); (−1,2)·(−1,2) = 1,44;
1,44·(−1,2) = −1,728 (144·12 = 1728); liha potenca negativnega števila je negativna. Napačni −3,6 = 3·(−1,2)
in 1,728. -/
theorem n2c :
    (-1.2:ℚ) ^ 3 = -1.728 ∧ (144:ℕ) * 12 = 1728 ∧ (∀ a : ℚ, a < 0 → a ^ 3 < 0) ∧
    (3:ℚ) * (-1.2) = -3.6 ∧ (-3.6:ℚ) ≠ -1.728 ∧ (1.728:ℚ) ≠ -1.728 := by
  refine ⟨?_, by norm_num, fun a ha => Odd.pow_neg (by decide) ha, by norm_num, by norm_num, by norm_num⟩
  calc (-1.2:ℚ) ^ 3 = (-1.2) * (-1.2) * (-1.2) := by ring
    _ = 1.44 * (-1.2) := by norm_num
    _ = -1.728 := by norm_num

/-- Naloga 2c, pot »Drugače: z ulomkom«: 1,2 = 12/10, 1,2³ = 12³/10³ = 1728/1000 = 1,728; eksponent 3 je
lih, zato (−1,2)³ = −1,2³ = −1,728. -/
theorem n2c_pot2 : (1.2:ℚ) = 12 / 10 ∧ (1.2:ℚ) ^ 3 = 1.728 ∧ (-1.2:ℚ) ^ 3 = -(1.2 ^ 3) := by
  refine ⟨by norm_num, ?_, Odd.neg_pow (by decide) _⟩
  calc (1.2:ℚ) ^ 3 = 12 ^ 3 / 10 ^ 3 := by norm_num
    _ = 1728 / 1000 := by norm_num
    _ = 1.728 := by norm_num

/-- Naloga 2d (uradni odgovor), pot »Po korakih«: 2 7/9 = (2·9 + 7)/9 = 25/9; √(25/9) = √25/√9 = 5/3 =
1 2/3. -/
theorem n2d : (2:ℝ) + 7 / 9 = (2 * 9 + 7) / 9 ∧ ((2 * 9 + 7) / 9 : ℝ) = 25 / 9 ∧
    Real.sqrt (2 + 7 / 9) = 5 / 3 ∧ (5:ℝ) / 3 = 1 + 2 / 3 := by
  have h25 : Real.sqrt 25 = 5 := by
    rw [show (25:ℝ) = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have h9 : Real.sqrt 9 = 3 := by
    rw [show (9:ℝ) = 3 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨by norm_num, by norm_num, ?_, by norm_num⟩
  calc Real.sqrt (2 + 7 / 9) = Real.sqrt (25 / 9) := by norm_num
    _ = Real.sqrt 25 / Real.sqrt 9 := Real.sqrt_div' 25 (by norm_num)
    _ = 5 / 3 := by rw [h25, h9]

/-- Naloga 2d, pot »Preizkus«: (5/3)² = 25/9 = 2 7/9. Napaka »korenjenje po delih«: √2 + √7/3 ≠ 5/3 (√2 > 1,4,
√7 > 2,6, zato je vsota večja od 2,2). -/
theorem n2d_preizkus : ((5:ℚ) / 3) ^ 2 = 25 / 9 ∧ (25:ℚ) / 9 = 2 + 7 / 9 ∧
    Real.sqrt 2 + Real.sqrt 7 / 3 ≠ 5 / 3 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  have h2 : (1.4:ℝ) < Real.sqrt 2 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have h7 : (2.6:ℝ) < Real.sqrt 7 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  intro h; linarith

/-- Naloga 2e (uradni odgovor), pot »Po korakih«: 8² + 15² = 64 + 225 = 289, √289 = 17, ker 17² = 289.
Napaka 8 + 15 = 23: 23² = 529 ≠ 289. Pot »s Pitagorovim izrekom«: 8, 15, 17 je pitagorejska trojica. -/
theorem n2e :
    Real.sqrt (8 ^ 2 + 15 ^ 2) = 17 ∧ (17:ℕ) ^ 2 = 289 ∧ (8:ℕ) ^ 2 + 15 ^ 2 = 17 ^ 2 ∧
    (8:ℕ) + 15 = 23 ∧ (23:ℕ) ^ 2 = 529 ∧ (529:ℕ) ≠ 289 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  calc Real.sqrt (8 ^ 2 + 15 ^ 2) = Real.sqrt (64 + 225) := by norm_num
    _ = Real.sqrt 289 := by norm_num
    _ = Real.sqrt (17 ^ 2) := by norm_num
    _ = 17 := Real.sqrt_sq (by norm_num)

/-! ## Naloga 3 -/

/-- Naloga 3a (uradni odgovor), pot »Po korakih«: nakupna cena 87,50 : 25 = 3,50 €; 80 centov = 80/100 € =
0,80 €; prodajna cena 3,50 + 0,80 = 4,30 €. Napake: 3,50 + 80 in 3,50 + 0,08 nista 4,30. -/
theorem n3a :
    (87.5:ℚ) / 25 = 3.5 ∧ (80:ℚ) / 100 = 0.8 ∧ (3.5:ℚ) + 0.8 = 4.3 ∧
    (3.5:ℚ) + 80 ≠ 4.3 ∧ (3.5:ℚ) + 0.08 ≠ 4.3 := by norm_num

/-- Naloga 3a, pot »Drugače: v centih«: 87,50 € = 8750 centov; 8750 : 25 = 350; 350 + 80 = 430 centov =
4,30 €; preizkus 25 · 3,50 = 87,50. -/
theorem n3a_pot2 :
    (87.5:ℚ) * 100 = 8750 ∧ (8750:ℚ) / 25 = 350 ∧ (350:ℚ) + 80 = 430 ∧ (430:ℚ) / 100 = 4.3 ∧
    (25:ℚ) * 3.5 = 87.5 := by norm_num

/-- Naloga 3b (uradni odgovor), pot »Po korakih«: 8 kg > 5 kg, zato popust; 8 · 4,30 = 34,40 €;
10 % od 34,40 je 34,40 : 10 = 3,44 €; plača 34,40 − 3,44 = 30,96 €. Napaka: 34,40 − 10 = 24,40 ≠ 30,96. -/
theorem n3b :
    (5:ℚ) < 8 ∧ (8:ℚ) * 4.3 = 34.4 ∧ (10:ℚ) / 100 * 34.4 = 34.4 / 10 ∧ (34.4:ℚ) / 10 = 3.44 ∧
    (34.4:ℚ) - 3.44 = 30.96 ∧ (34.4:ℚ) - 10 = 24.4 ∧ (24.4:ℚ) ≠ 30.96 := by norm_num

/-- Naloga 3b, pot »Drugače: z deležem«: 100 % − 10 % = 90 %; 0,9 · 4,30 = 3,87; 8 · 3,87 = 30,96; ocena
8 · 4 = 32 in 30,96 < 32. -/
theorem n3b_pot2 :
    (100:ℚ) - 10 = 90 ∧ (0.9:ℚ) * 4.3 = 3.87 ∧ (8:ℚ) * 3.87 = 30.96 ∧ (8:ℚ) * 4 = 32 ∧
    (30.96:ℚ) < 32 ∧ (8:ℚ) * (0.9 * 4.3) = 8 * 4.3 - 10 / 100 * (8 * 4.3) := by norm_num

/-! ## Naloga 4 (koordinatni model: S = (0,0), r = 6) -/

/-- Ravnina. -/
abbrev E2 := EuclideanSpace ℝ (Fin 2)

/-- Središče krožnice in oglišča včrtanega kvadrata ABCD (A levo, B spodaj, C desno, D zgoraj). -/
noncomputable def kS : E2 := !₂[0, 0]
noncomputable def kA : E2 := !₂[-6, 0]
noncomputable def kB : E2 := !₂[0, -6]
noncomputable def kC : E2 := !₂[6, 0]
noncomputable def kD : E2 := !₂[0, 6]
/-- Oglišča očrtanega kvadrata. -/
noncomputable def kK1 : E2 := !₂[-6, -6]
noncomputable def kK2 : E2 := !₂[6, -6]
noncomputable def kK3 : E2 := !₂[6, 6]
noncomputable def kK4 : E2 := !₂[-6, 6]

theorem dist2 (x y : E2) : dist x y = Real.sqrt ((x 0 - y 0) ^ 2 + (x 1 - y 1) ^ 2) := by
  rw [EuclideanSpace.dist_eq, Fin.sum_univ_two]; simp [Real.dist_eq, sq_abs]

/-- Naloga 4a, stranica očrtanega kvadrata, pot »Po korakih«: oglišča A, B, C, D ležijo na krožnici
(|SA| = … = 6) in so razpolovišča stranic očrtanega kvadrata; krožnica leži v kvadratu |x| ≤ 6, |y| ≤ 6 (se
stranic le dotika); stranica očrtanega kvadrata je 2r = 2·6 = 12. -/
theorem n4a_ocrtani :
    dist kA kS = 6 ∧ dist kB kS = 6 ∧ dist kC kS = 6 ∧ dist kD kS = 6 ∧
    kA = midpoint ℝ kK4 kK1 ∧ kB = midpoint ℝ kK1 kK2 ∧ kC = midpoint ℝ kK2 kK3 ∧ kD = midpoint ℝ kK3 kK4 ∧
    (∀ p : E2, dist p kS = 6 → |p 0| ≤ 6 ∧ |p 1| ≤ 6) ∧
    dist kK1 kK2 = 2 * 6 ∧ (2:ℝ) * 6 = 12 ∧ dist kK2 kK3 = 12 := by
  have s6 : Real.sqrt 36 = 6 := by rw [show (36:ℝ) = 6 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have s12 : Real.sqrt 144 = 12 := by rw [show (144:ℝ) = 12 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have md : ∀ P Q R : E2, (∀ i, R i = (P i + Q i) / 2) → R = midpoint ℝ P Q := by
    intro P Q R h; ext i; rw [h i]; simp [midpoint_eq_smul_add]; ring
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, by norm_num, ?_⟩
  · rw [dist2]; norm_num [kA, kS, s6]
  · rw [dist2]; norm_num [kB, kS, s6]
  · rw [dist2]; norm_num [kC, kS, s6]
  · rw [dist2]; norm_num [kD, kS, s6]
  · apply md; intro i; fin_cases i <;> norm_num [kA, kK4, kK1]
  · apply md; intro i; fin_cases i <;> norm_num [kB, kK1, kK2]
  · apply md; intro i; fin_cases i <;> norm_num [kC, kK2, kK3]
  · apply md; intro i; fin_cases i <;> norm_num [kD, kK3, kK4]
  rotate_left
  · rw [dist2]; norm_num [kK1, kK2, s12]
  · rw [dist2]; norm_num [kK2, kK3, s12]
  intro p hp
  rw [dist2] at hp
  simp [kS] at hp
  have h : p 0 ^ 2 + p 1 ^ 2 = 36 := by
    have := Real.sq_sqrt (show (0:ℝ) ≤ p 0 ^ 2 + p 1 ^ 2 by positivity)
    rw [hp] at this; linarith
  exact ⟨abs_le.mpr ⟨by nlinarith [sq_nonneg (p 1), sq_nonneg (p 0 + 6)],
      by nlinarith [sq_nonneg (p 1), sq_nonneg (p 0 - 6)]⟩,
    abs_le.mpr ⟨by nlinarith [sq_nonneg (p 0), sq_nonneg (p 1 + 6)],
      by nlinarith [sq_nonneg (p 0), sq_nonneg (p 1 - 6)]⟩⟩

/-- Naloga 4a, diagonala AC, pot »Po korakih«: AC gre skozi S (S je razpolovišče AC), zato je premer:
|AC| = 2r = 12. -/
theorem n4a_diagonala : midpoint ℝ kA kC = kS ∧ dist kA kC = 2 * 6 ∧ dist kA kC = 12 := by
  have s12 : Real.sqrt 144 = 12 := by rw [show (144:ℝ) = 12 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨?_, ?_, ?_⟩
  · ext i; fin_cases i <;> simp [midpoint_eq_smul_add, kA, kC, kS]
  · rw [dist2]; norm_num [kA, kC, s12]
  · rw [dist2]; norm_num [kA, kC, s12]

/-- Naloga 4a, stranica |AB|, pot »Po korakih«: diagonali sta pravokotni (∠ASB = 90°), katete |SA| = |SB| = 6;
po Pitagorovem izreku |AB|² = 6² + 6² = 36 + 36 = 72, |AB| = √72 = √(36·2) = 6√2. -/
theorem n4a_stranica :
    ∠ kA kS kB = Real.pi / 2 ∧ dist kA kB ^ 2 = 6 ^ 2 + 6 ^ 2 ∧ (6:ℝ) ^ 2 + 6 ^ 2 = 36 + 36 ∧
    (36:ℝ) + 36 = 72 ∧ dist kA kB = Real.sqrt 72 ∧ Real.sqrt 72 = Real.sqrt (36 * 2) ∧
    Real.sqrt (36 * 2) = 6 * Real.sqrt 2 := by
  have hang : ∠ kA kS kB = Real.pi / 2 := by
    rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [kA, kB, kS, Fin.sum_univ_two, inner]
  have hSA : dist kA kS = 6 := by
    have s6 : Real.sqrt 36 = 6 := by rw [show (36:ℝ) = 6 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
    rw [dist2]; norm_num [kA, kS, s6]
  have hSB : dist kB kS = 6 := by
    have s6 : Real.sqrt 36 = 6 := by rw [show (36:ℝ) = 6 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
    rw [dist2]; norm_num [kB, kS, s6]
  have pit := (dist_sq_eq_dist_sq_add_dist_sq_iff_angle_eq_pi_div_two kA kS kB).mpr hang
  have h72 : dist kA kB ^ 2 = 6 ^ 2 + 6 ^ 2 := by
    rw [sq, pit, hSA, hSB]; ring
  refine ⟨hang, h72, by norm_num, by norm_num, ?_, by norm_num, ?_⟩
  · rw [← Real.sqrt_sq dist_nonneg, h72]; norm_num
  · rw [Real.sqrt_mul (by norm_num), show (36:ℝ) = 6 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Naloga 4a, približek: s √2 ≈ 1,41 je 6·1,41 = 8,46 (tako v poli); točno je 8,48 < 6√2 < 8,49, zato je
|6√2 − 8,46| < 0,03 in 6√2 na stotinko zaokroženo 8,49 (ne 8,46). -/
theorem n4a_priblizek :
    (6:ℝ) * 1.41 = 8.46 ∧ (8.48:ℝ) < 6 * Real.sqrt 2 ∧ 6 * Real.sqrt 2 < 8.49 ∧
    |6 * Real.sqrt 2 - 8.46| < 0.03 ∧ round (6 * Real.sqrt 2 * 100) = 849 := by
  have h1 : (1.4134:ℝ) < Real.sqrt 2 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have h2 : Real.sqrt 2 < 1.4143 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  have h3 : (1.4142:ℝ) < Real.sqrt 2 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  refine ⟨by norm_num, by linarith, by linarith, abs_lt.mpr ⟨by linarith, by linarith⟩, ?_⟩
  rw [round_eq, Int.floor_eq_iff]; constructor <;> push_cast <;> linarith

/-- Naloga 4a, pot »Drugače: z obrazcem za diagonalo«: d = a√2 (|AC| = |AB|·√2); a = d/√2 = 12/√2 =
12√2/2 = 6√2; preizkus s ploščino 4·(6·6/2) = 72 in √72 = 6√2. -/
theorem n4a_pot2 :
    dist kA kC = dist kA kB * Real.sqrt 2 ∧ (12:ℝ) / Real.sqrt 2 = 12 * Real.sqrt 2 / 2 ∧
    12 * Real.sqrt 2 / 2 = 6 * Real.sqrt 2 ∧ (4:ℝ) * (6 * 6 / 2) = 72 ∧ dist kA kB ^ 2 = 72 := by
  obtain ⟨-, h72, -, -, hAB, h1, h62⟩ := n4a_stranica
  have hs : Real.sqrt 2 * Real.sqrt 2 = 2 := Real.mul_self_sqrt (by norm_num)
  have hpos : 0 < Real.sqrt 2 := by positivity
  refine ⟨?_, ?_, by ring, by norm_num, by rw [h72]; norm_num⟩
  · rw [n4a_diagonala.2.2, hAB, h1, h62, mul_assoc, hs]; norm_num
  · field_simp; linarith [hs]

/-- Naloga 4a, napaki: |AB| ≠ 6 (6 je stranica včrtanega šestkotnika) in d = r√2 = 6√2 ≠ 12 = |AC|. -/
theorem n4a_napaka : dist kA kB ≠ 6 ∧ 6 * Real.sqrt 2 ≠ dist kA kC := by
  have h3 : (1.4142:ℝ) < Real.sqrt 2 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have h2 : Real.sqrt 2 < 1.4143 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  obtain ⟨-, -, -, -, hAB, h1, h62⟩ := n4a_stranica
  rw [hAB, h1, h62, n4a_diagonala.2.2]
  constructor <;> intro h <;> linarith

/-- Naloga 4b, loka: oglišča razdelijo krožnico na loke s središčnim kotom 90° (∠DSC = ∠BSA = π/2); z
l = r·α je l₁ + l₂ = 6·π/2 + 6·π/2 = 2π·6/2 = π·6. -/
theorem n4b_loka :
    ∠ kD kS kC = Real.pi / 2 ∧ ∠ kB kS kA = Real.pi / 2 ∧
    6 * (Real.pi / 2) + 6 * (Real.pi / 2) = 2 * Real.pi * 6 / 2 ∧ 2 * Real.pi * 6 / 2 = Real.pi * 6 := by
  refine ⟨?_, ?_, by ring, by ring⟩
  · rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [kC, kD, kS, Fin.sum_univ_two, inner]
  · rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [kA, kB, kS, Fin.sum_univ_two, inner]

/-- Naloga 4b (uradni odgovor o ≈ 35,8 cm), pot »Po korakih«: l₁ + l₂ = πr ≈ 3,14·6 = 18,84; stranici
2a = 2·6√2 = 12√2 ≈ 12·1,41 = 16,92; o ≈ 18,84 + 16,92 = 35,76 ≈ 35,8 (na desetinko). Točni obseg
o = 6π + 12√2 leži med 35,80 in 35,83, zato je zaokrožen na desetinko tudi 35,8. -/
theorem n4b :
    (3.14:ℝ) * 6 = 18.84 ∧ 2 * (6 * Real.sqrt 2) = 12 * Real.sqrt 2 ∧ (12:ℝ) * 1.41 = 16.92 ∧
    (18.84:ℝ) + 16.92 = 35.76 ∧ round ((35.76:ℝ) * 10) = 358 ∧
    (35.8:ℝ) < Real.pi * 6 + 12 * Real.sqrt 2 ∧ Real.pi * 6 + 12 * Real.sqrt 2 < 35.83 ∧
    round ((Real.pi * 6 + 12 * Real.sqrt 2) * 10) = 358 := by
  have p1 := Real.pi_gt_d2
  have p2 := Real.pi_lt_d4
  have h1 : (1.4142:ℝ) < Real.sqrt 2 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have h2 : Real.sqrt 2 < 1.4143 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num, by ring, by norm_num, by norm_num, ?_, by linarith, by linarith, ?_⟩
  · rw [round_eq, Int.floor_eq_iff]; norm_num
  · rw [round_eq, Int.floor_eq_iff]; constructor <;> push_cast <;> linarith

/-- Naloga 4b, pot »Drugače: z izrazom«: o = πr + 2r√2 = r(π + 2√2); 2·1,41 = 2,82, 3,14 + 2,82 = 5,96,
6·5,96 = 35,76 ≈ 35,8. Ocena: 2·3,14·6 = 37,68, četrtina obsega 3,14·6/2 = 9,42; tetiva je krajša od loka
(6√2 < 3π) in o = 6π + 12√2 < 2π·6. -/
theorem n4b_pot2 :
    (∀ r : ℝ, Real.pi * r + 2 * r * Real.sqrt 2 = r * (Real.pi + 2 * Real.sqrt 2)) ∧
    (2:ℝ) * 1.41 = 2.82 ∧ (3.14:ℝ) + 2.82 = 5.96 ∧ (6:ℝ) * 5.96 = 35.76 ∧
    (2:ℝ) * 3.14 * 6 = 37.68 ∧ (3.14:ℝ) * 6 / 2 = 9.42 ∧
    6 * Real.sqrt 2 < 2 * Real.pi * 6 / 4 ∧ Real.pi * 6 + 12 * Real.sqrt 2 < 2 * Real.pi * 6 := by
  have p1 := Real.pi_gt_d2
  have h2 : Real.sqrt 2 < 1.4143 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨fun r => by ring, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by linarith, by linarith⟩

/-! ## Naloga 5 -/

/-- Naloga 5a (uradni odgovor), pot »Po korakih«: 0,063·100 = 6,3; 6,3·1000 = 6300; vrzel x z
x : 1000 = 6,3 je natanko 6300. Pot »Drugače«: 63/1000·100 = 63/10 = 6,3; 6300 : 1000 = 6,3. Napaki:
0,0063 : 1000 ≠ 6,3 in 63 ≠ 6,3. -/
theorem n5a :
    (0.063:ℚ) * 100 = 6.3 ∧ (6.3:ℚ) * 1000 = 6300 ∧ (∀ x : ℚ, x / 1000 = 6.3 ↔ x = 6300) ∧
    (0.063:ℚ) = 63 / 1000 ∧ (63:ℚ) / 1000 * 100 = 63 / 10 ∧ (63:ℚ) / 10 = 6.3 ∧ (6300:ℚ) / 1000 = 6.3 ∧
    (0.0063:ℚ) / 1000 ≠ 6.3 ∧ (63:ℚ) ≠ 6.3 := by
  refine ⟨by norm_num, by norm_num, fun x => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 5b (uradni odgovor), pot »S skupnim imenovalcem«: 2/5 = 14/35, 3/7 = 15/35; med 14 in 15 ni
naravnega števila; 14/35 = 28/70, 15/35 = 30/70 in 2/5 < 29/70 < 3/7; tudi 5/12 in 41/100 ležita vmes.
Pot »Drugače«: 2/5 = 0,4, 7·0,43 = 3,01 > 3, zato 3/7 < 0,43, in 0,4 < 0,41 < 3/7. Napaka: vmes je
neskončno mnogo ulomkov. -/
theorem n5b :
    (2:ℚ) / 5 = 14 / 35 ∧ (3:ℚ) / 7 = 15 / 35 ∧ (¬ ∃ n : ℕ, 14 < n ∧ n < 15) ∧
    (14:ℚ) / 35 = 28 / 70 ∧ (15:ℚ) / 35 = 30 / 70 ∧
    ((2:ℚ) / 5 < 29 / 70 ∧ (29:ℚ) / 70 < 3 / 7) ∧ ((2:ℚ) / 5 < 5 / 12 ∧ (5:ℚ) / 12 < 3 / 7) ∧
    ((2:ℚ) / 5 < 41 / 100 ∧ (41:ℚ) / 100 < 3 / 7) ∧
    (2:ℚ) / 5 = 0.4 ∧ (7:ℚ) * 0.43 = 3.01 ∧ (3:ℚ) / 7 < 0.43 ∧ (0.41:ℚ) = 41 / 100 ∧
    (Set.Ioo ((2:ℚ) / 5) (3 / 7)).Infinite := by
  refine ⟨by norm_num, by norm_num, by omega, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, Set.Ioo_infinite (by norm_num)⟩

/-- Naloga 5c (uradni odgovor »>«), pot »Z razmislekom«: za x > 0 in c > 1 je x·c > x > x : c; 7/4 > 1. -/
theorem n5c_razmislek :
    (∀ x c : ℚ, 0 < x → 1 < c → x < x * c ∧ x / c < x) ∧ (1:ℚ) < 7 / 4 ∧
    (3.2:ℚ) * (7 / 4) > 3.2 / (7 / 4) := by
  refine ⟨fun x c hx hc => ⟨by nlinarith, div_lt_self hx hc⟩, by norm_num, by norm_num⟩

/-- Naloga 5c, pot »Z izračunom«: 3,2·7/4 = 22,4/4 = 5,6; 3,2 : 7/4 = 3,2·4/7 = 12,8/7 < 2, ker je
2·7 = 14 > 12,8; 5,6 > 2. Napaka: pri 3/4 bi bil znak obrnjen (3,2·3/4 < 3,2 : 3/4). -/
theorem n5c :
    (3.2:ℚ) * (7 / 4) = 22.4 / 4 ∧ (22.4:ℚ) / 4 = 5.6 ∧ (3.2:ℚ) / (7 / 4) = 3.2 * (4 / 7) ∧
    (3.2:ℚ) * (4 / 7) = 12.8 / 7 ∧ (2:ℚ) * 7 = 14 ∧ (12.8:ℚ) < 14 ∧ (12.8:ℚ) / 7 < 2 ∧ (5.6:ℚ) > 2 ∧
    (3.2:ℚ) * (3 / 4) < 3.2 / (3 / 4) := by norm_num

/-- Naloga 5d (uradni odgovor C: −0,8), pot »Po definiciji«: −1,25 = −5/4, obratna vrednost −4/5 = −0,8;
(−1,25)·(−0,8) = 1; x·(−1,25) = 1 natanko za x = −0,8. Druge izbire: 1,25 je nasprotna vrednost
(−1,25 + 1,25 = 0, zmnožek ni 1), (−1,25)·0,8 = −1, (−1,25)·(−0,125) = 0,15625 ≈ 0,16 ≠ 1. -/
theorem n5d :
    (-1.25:ℚ) = -(5 / 4) ∧ (-(5 / 4) : ℚ)⁻¹ = -(4 / 5) ∧ (-(4 / 5) : ℚ) = -0.8 ∧
    (-1.25:ℚ) * (-0.8) = 1 ∧ (∀ x : ℚ, x * (-1.25) = 1 ↔ x = -0.8) ∧
    (-1.25:ℚ) + 1.25 = 0 ∧ (-1.25:ℚ) * 1.25 ≠ 1 ∧ (-1.25:ℚ) * 0.8 = -1 ∧
    (-1.25:ℚ) * (-0.125) = 0.15625 ∧ |(0.15625:ℚ) - 0.16| < 0.005 ∧ (0.15625:ℚ) ≠ 1 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num,
    fun x => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num,
    by norm_num, by rw [abs_lt]; norm_num, by norm_num⟩

/-! ## Naloga 6 (točke v ℚ × ℚ, enota 1 cm) -/

/-- Pretvorba koordinat slike SVG (izhodišče pri (140, 120), 20 enot slike na 1 cm) v koordinate. -/
def izSlike (px py : ℚ) : ℚ × ℚ := ((px - 140) / 20, (120 - py) / 20)

/-- Zrcaljenje čez abscisno os, čez ordinatno os in čez izhodišče. -/
def zrcaliX (p : ℚ × ℚ) : ℚ × ℚ := (p.1, -p.2)
def zrcaliY (p : ℚ × ℚ) : ℚ × ℚ := (-p.1, p.2)
def zrcaliO (p : ℚ × ℚ) : ℚ × ℚ := (-p.1, -p.2)

/-- Ploščina trikotnika PQR po obrazcu |det(Q − P, R − P)|/2. -/
def ploscina (P Q R : ℚ × ℚ) : ℚ := |(Q.1 - P.1) * (R.2 - P.2) - (R.1 - P.1) * (Q.2 - P.2)| / 2

/-- Naloga 6a (uradni odgovor A(−4, 3)): točka A na sliki (60, 60) ima koordinati (−4, 3); A(3, −4) je
druga točka. 6b: B(2, −1) leži v 4. kvadrantu (x > 0, y < 0); na rešitveni sliki je pri (180, 140). -/
theorem n6ab :
    izSlike 60 60 = (-4, 3) ∧ ((-4, 3) : ℚ × ℚ) ≠ (3, -4) ∧
    izSlike 180 140 = (2, -1) ∧ (0:ℚ) < 2 ∧ (-1:ℚ) < 0 ∧ ((2, -1) : ℚ × ℚ) ≠ (-1, 2) := by
  refine ⟨?_, by norm_num [Prod.ext_iff], ?_, by norm_num, by norm_num, by norm_num [Prod.ext_iff]⟩ <;>
    norm_num [izSlike]

/-- Naloga 6c (uradni odgovor A'(−4, −3)), pot »Po pravilu«: zrcaljenje čez os x ohrani absciso in obrne
predznak ordinate; razpolovišče AA' leži na osi x in AA' je navpična (A' je 3 enote pod osjo); na rešitveni
sliki je A' pri (60, 180). Napaka: čez os y bi dobili (4, 3). -/
theorem n6c :
    zrcaliX (-4, 3) = (-4, -3) ∧ ((-4:ℚ) + -4) / 2 = -4 ∧ ((3:ℚ) + -3) / 2 = 0 ∧
    izSlike 60 180 = (-4, -3) ∧ zrcaliY (-4, 3) = (4, 3) ∧ ((4, 3) : ℚ × ℚ) ≠ (-4, -3) := by
  refine ⟨?_, by norm_num, by norm_num, ?_, ?_, by norm_num [Prod.ext_iff]⟩ <;>
    norm_num [zrcaliX, zrcaliY, izSlike]

/-- Naloga 6d (uradni odgovor B'(−2, 1)), poti »Po pravilu« in »z daljico skozi izhodišče«: obe koordinati
obrneta predznak; izhodišče je razpolovišče BB'; na rešitveni sliki je B' pri (100, 100). Napaka: (−2, −1)
je zrcalna slika čez ordinatno os, ne čez izhodišče. -/
theorem n6d :
    zrcaliO (2, -1) = (-2, 1) ∧ ((2:ℚ) + -2) / 2 = 0 ∧ ((-1:ℚ) + 1) / 2 = 0 ∧
    izSlike 100 100 = (-2, 1) ∧ zrcaliY (2, -1) = (-2, -1) ∧ ((-2, -1) : ℚ × ℚ) ≠ (-2, 1) := by
  refine ⟨?_, by norm_num, by norm_num, ?_, ?_, by norm_num [Prod.ext_iff]⟩ <;>
    norm_num [zrcaliO, zrcaliY, izSlike]

/-- Naloga 6e (uradni odgovor 18 cm²), pot »Z osnovnico in višino«: |AA'| = 3 − (−3) = 6, višina
v = 2 − (−4) = 6 (razdalja B od navpičnice x = −4), p = 6·6/2 = 18; enako da obrazec |det|/2. Napaka brez
deljenja z 2: 36. -/
theorem n6e :
    (3:ℚ) - (-3) = 6 ∧ (2:ℚ) - (-4) = 6 ∧ (6:ℚ) * 6 / 2 = 18 ∧
    ploscina (-4, 3) (-4, -3) (2, -1) = 18 ∧ (6:ℚ) * 6 ≠ 18 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, by norm_num⟩
  simp [ploscina]; norm_num [abs_of_nonneg]

/-- Naloga 6e, pot »Drugače: pravokotnik brez dveh trikotnikov«: pravokotnik (−4,3), (2,3), (2,−3), (−4,−3)
ima ploščino 6·6 = 36; trikotnik A(−4,3), (2,3), B(2,−1) s katetama 6 in 4 ima 6·4/2 = 12, trikotnik
A'(−4,−3), (2,−3), B s katetama 6 in 2 ima 6·2/2 = 6; p = 36 − 12 − 6 = 18. -/
theorem n6e_pot2 :
    (2:ℚ) - (-4) = 6 ∧ (3:ℚ) - (-3) = 6 ∧ (6:ℚ) * 6 = 36 ∧
    (3:ℚ) - (-1) = 4 ∧ ploscina (-4, 3) (2, 3) (2, -1) = 6 * 4 / 2 ∧ (6:ℚ) * 4 / 2 = 12 ∧
    (-1:ℚ) - (-3) = 2 ∧ ploscina (-4, -3) (2, -3) (2, -1) = 6 * 2 / 2 ∧ (6:ℚ) * 2 / 2 = 6 ∧
    (36:ℚ) - 12 - 6 = 18 ∧ (36:ℚ) - 12 - 6 = ploscina (-4, 3) (-4, -3) (2, -1) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_, by norm_num, by norm_num, ?_, by norm_num,
    by norm_num, ?_⟩ <;> simp [ploscina] <;> norm_num [abs_of_nonneg]

/-! ## Naloga 7 -/

/-- Naloga 7a (1) (uradni odgovor 8a − (5a − 2b) = 3a + 2b), pot »Po korakih«: 8a − (□ − 2b) = 8a − □ + 2b;
vrzeli c·a in d·b dasta identiteto natanko pri c = 5, d = 2. Pot »Preizkus«: a = b = 1: 8 − (5 − 2) = 5,
3 + 2 = 5. Napaka −2b na desni ni identiteta. -/
theorem n7a1 :
    (∀ a b c : ℚ, 8 * a - (c * a - 2 * b) = 8 * a - c * a + 2 * b) ∧
    (∀ c d : ℚ, (∀ a b : ℚ, 8 * a - (c * a - 2 * b) = 3 * a + d * b) ↔ c = 5 ∧ d = 2) ∧
    (8:ℚ) - (5 - 2) = 5 ∧ (3:ℚ) + 2 = 5 ∧
    ¬ (∀ a b : ℚ, 8 * a - (5 * a - 2 * b) = 3 * a - 2 * b) := by
  refine ⟨fun a b c => by ring, fun c d => ⟨fun h => ?_, ?_⟩, by norm_num, by norm_num, fun h => ?_⟩
  · have h1 := h 1 0
    have h2 := h 0 1
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩ a b; ring
  · have := h 0 1; norm_num at this

/-- Naloga 7a (2) (uradni odgovor (x + 5)(x − 2) = x² + 3x − 10), pot »Po korakih«:
(x + k)(x − 2) = x² − 2x + kx − 2k; identiteta z x² + e·x − 10 velja natanko pri −2k = −10, torej k = 5,
in −2x + 5x = 3x (e = 3). Pot »Preizkus«: x = 1: (1 + 5)(1 − 2) = 6·(−1) = −6 in 1 + 3 − 10 = −6; x = 2:
7·0 = 0 in 4 + 6 − 10 = 0. Napaki 7x in −5 nista identiteti. -/
theorem n7a2 :
    (∀ x k : ℚ, (x + k) * (x - 2) = x ^ 2 - 2 * x + k * x - 2 * k) ∧
    (∀ k : ℚ, -2 * k = -10 ↔ k = 5) ∧ (∀ x : ℚ, -2 * x + 5 * x = 3 * x) ∧
    (∀ k e : ℚ, (∀ x : ℚ, (x + k) * (x - 2) = x ^ 2 + e * x - 10) ↔ k = 5 ∧ e = 3) ∧
    ((1:ℚ) + 5) * (1 - 2) = 6 * (-1) ∧ (6:ℚ) * (-1) = -6 ∧ (1:ℚ) + 3 - 10 = -6 ∧
    ((2:ℚ) + 5) * (2 - 2) = 7 * 0 ∧ (7:ℚ) * 0 = 0 ∧ (4:ℚ) + 6 - 10 = 0 ∧
    ¬ (∀ x : ℚ, (x + 5) * (x - 2) = x ^ 2 + 7 * x - 10) ∧
    ¬ (∀ x : ℚ, (x - 5) * (x - 2) = x ^ 2 + 3 * x - 10) := by
  refine ⟨fun x k => by ring, fun k => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    fun x => by ring, fun k e => ⟨fun h => ?_, ?_⟩, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, fun h => ?_, fun h => ?_⟩
  · have h0 := h 0
    have h1 := h 1
    have hk : k = 5 := by linarith
    subst hk
    constructor
    · rfl
    · linarith
  · rintro ⟨rfl, rfl⟩ x; ring
  · have := h 1; norm_num at this
  · have := h 1; norm_num at this

/-- Naloga 7b (uradni odgovor x = 5, edina rešitev), pot »Po korakih«: pomnožimo z 12:
4(x + 1) − 3(x − 2) = 2x + 5; 4x + 4 − 3x + 6 = 2x + 5; x + 10 = 2x + 5; 10 − 5 = 2x − x; x = 5. -/
theorem n7b (x : ℚ) : (x + 1) / 3 - (x - 2) / 4 = x / 6 + 5 / 12 ↔ x = 5 := by
  calc (x + 1) / 3 - (x - 2) / 4 = x / 6 + 5 / 12 ↔ 4 * (x + 1) - 3 * (x - 2) = 2 * x + 5 :=
        ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 4 * x + 4 - 3 * x + 6 = 2 * x + 5 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x + 10 = 2 * x + 5 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 10 - 5 = 2 * x - x := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 5 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Naloga 7b, preizkus: levo (5 + 1)/3 − (5 − 2)/4 = 2 − 3/4 = 5/4; desno 5/6 + 5/12 = 10/12 + 5/12 = 15/12
= 5/4. Napake: −3(x − 2) = −3x + 6, ne −3x − 6; 4(x + 1) = 4x + 4, ne 4x + 1. -/
theorem n7b_preizkus :
    ((5:ℚ) + 1) / 3 - (5 - 2) / 4 = 2 - 3 / 4 ∧ (2:ℚ) - 3 / 4 = 5 / 4 ∧
    (5:ℚ) / 6 + 5 / 12 = 10 / 12 + 5 / 12 ∧ (10:ℚ) / 12 + 5 / 12 = 15 / 12 ∧ (15:ℚ) / 12 = 5 / 4 ∧
    (∀ x : ℚ, -3 * (x - 2) = -3 * x + 6 ∧ -3 * (x - 2) ≠ -3 * x - 6) ∧
    (∀ x : ℚ, 4 * (x + 1) = 4 * x + 4 ∧ 4 * (x + 1) ≠ 4 * x + 1) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    fun x => ⟨by ring, fun h => by linarith⟩, fun x => ⟨by ring, fun h => by linarith⟩⟩

/-- Naloga 7b, pot »Drugače: ulomke razstavimo«: x/3 + 1/3 − x/4 + 2/4 = x/6 + 5/12 ⇔ x/3 − x/4 − x/6 =
5/12 − 1/3 − 1/2 ⇔ (4x − 3x − 2x)/12 = (5 − 4 − 6)/12 ⇔ −x/12 = −5/12 ⇔ x = 5; razstavitev je identiteta. -/
theorem n7b_pot2 (x : ℚ) :
    ((x + 1) / 3 - (x - 2) / 4 = x / 3 + 1 / 3 - x / 4 + 2 / 4) ∧
    (x / 3 + 1 / 3 - x / 4 + 2 / 4 = x / 6 + 5 / 12 ↔ x = 5) := by
  refine ⟨by ring, ?_⟩
  calc x / 3 + 1 / 3 - x / 4 + 2 / 4 = x / 6 + 5 / 12 ↔ x / 3 - x / 4 - x / 6 = 5 / 12 - 1 / 3 - 1 / 2 :=
        ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ (4 * x - 3 * x - 2 * x) / 12 = (5 - 4 - 6) / 12 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ -x / 12 = -5 / 12 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 5 := ⟨fun h => by linarith, fun h => by linarith⟩

/-! ## Naloga 8 (koordinatni model prizme z višino h) -/

/-- Prostor. -/
abbrev E3 := EuclideanSpace ℝ (Fin 3)

noncomputable def pA (h : ℝ) : E3 := !₂[0, h, 0]
noncomputable def pB : E3 := !₂[0, 0, 0]
noncomputable def pC : E3 := !₂[8, 0, 0]
noncomputable def pD (h : ℝ) : E3 := !₂[0, h, h]
noncomputable def pE (h : ℝ) : E3 := !₂[0, 0, h]
noncomputable def pF (h : ℝ) : E3 := !₂[8, 0, h]

/-- Vodoravna ravnina z = c. -/
noncomputable def ravnina (c : ℝ) : AffineSubspace ℝ E3 where
  carrier := {p | p 2 = c}
  smul_vsub_vadd_mem' := by
    intro t p1 p2 p3 h1 h2 h3
    simp only [Set.mem_ofPred_eq, vsub_eq_sub, vadd_eq_add, PiLp.add_apply, PiLp.smul_apply,
      PiLp.sub_apply, smul_eq_mul] at *
    rw [h1, h2, h3]; ring

theorem mem_ravnina {c : ℝ} {p : E3} : p ∈ ravnina c ↔ p 2 = c := Iff.rfl

theorem dist3 (x y : E3) :
    dist x y = Real.sqrt ((x 0 - y 0) ^ 2 + (x 1 - y 1) ^ 2 + (x 2 - y 2) ^ 2) := by
  rw [EuclideanSpace.dist_eq, Fin.sum_univ_three]; simp [Real.dist_eq, sq_abs]

/-- Model ustreza opisu: AD, BE, CF so stranski robovi (D − A = E − B = F − C = (0,0,h)), višina h = |AB|,
|BC| = 8 in AB ⊥ BC (∠ABC = 90°). -/
theorem n8_model (h : ℝ) (hh : 0 < h) :
    pD h - pA h = pE h - pB ∧ pE h - pB = pF h - pC ∧ dist (pA h) pB = h ∧ dist pB (pE h) = h ∧
    dist pB pC = 8 ∧ ∠ (pA h) pB pC = Real.pi / 2 := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_⟩
  · ext i; fin_cases i <;> simp [pA, pD, pE, pB]
  · ext i; fin_cases i <;> simp [pB, pC, pE, pF]
  · rw [dist3]; simp [pA, pB, Real.sqrt_sq hh.le]
  · rw [dist3]; simp [pE, pB, Real.sqrt_sq hh.le]
  · rw [dist3]; simp [pB, pC]
  · rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [pA, pB, pC, Fin.sum_univ_three, inner]

/-- Predpostavka trditev z 0 < h se da izpolniti (h = 15). -/
example : (0:ℝ) < 15 := by norm_num

/-- Naloga 8b in 8a, višina: trikotnik BCF je pravokoten pri C (∠BCF = 90°), |BF|² = |BC|² + |CF|² =
8² + h²; |BF| = 17 velja natanko pri h = 15: v² = 17² − 8² = 289 − 64 = 225, v = 15. -/
theorem n8_visina (h : ℝ) (hh : 0 < h) :
    ∠ pB pC (pF h) = Real.pi / 2 ∧ dist pB (pF h) ^ 2 = 8 ^ 2 + h ^ 2 ∧
    (dist pB (pF h) = 17 ↔ h = 15) ∧ (17:ℝ) ^ 2 - 8 ^ 2 = 289 - 64 ∧ (289:ℝ) - 64 = 225 ∧
    Real.sqrt 225 = 15 := by
  have hd : dist pB (pF h) ^ 2 = 8 ^ 2 + h ^ 2 := by
    rw [dist3, Real.sq_sqrt (by positivity)]; simp [pB, pF]
  refine ⟨?_, hd, ⟨fun h17 => ?_, fun h15 => ?_⟩, by norm_num, by norm_num, ?_⟩
  · rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [pB, pC, pF, Fin.sum_univ_three, inner]
  · rw [h17] at hd
    have h2 : h ^ 2 = 15 ^ 2 := by linarith
    nlinarith [sq_nonneg (h - 15), sq_nonneg (h + 15)]
  · subst h15
    rw [← Real.sqrt_sq dist_nonneg, hd]
    rw [show (8:ℝ) ^ 2 + 15 ^ 2 = 17 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (225:ℝ) = 15 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Naloga 8a (1) (uradni odgovor A: pokončna), poti »Razmislek« in »Drugače«: stranski rob AD je pravokoten
na AB in na AC (dva nevzporedna robova osnovne ploskve), enako BE in CF; stranske ploskve imajo pravi kot
(∠DAB = 90°). Pri h = 15 osnovna ploskev ni enakostranična (|AB| = 15 ≠ 8 = |BC|), zato prizma ni pravilna. -/
theorem n8a1 (h : ℝ) :
    inner ℝ (pD h - pA h) (pB - pA h) = 0 ∧ inner ℝ (pD h - pA h) (pC - pA h) = 0 ∧
    inner ℝ (pE h - pB) (pA h - pB) = 0 ∧ inner ℝ (pE h - pB) (pC - pB) = 0 ∧
    inner ℝ (pF h - pC) (pA h - pC) = 0 ∧ inner ℝ (pF h - pC) (pB - pC) = 0 ∧
    ∠ (pD h) (pA h) pB = Real.pi / 2 ∧ dist (pA 15) pB ≠ dist pB pC := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_⟩
  all_goals try (simp [pA, pB, pC, pD, pE, pF, Fin.sum_univ_three, inner]; done)
  · rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [pA, pB, pD, Fin.sum_univ_three, inner]
  · obtain ⟨-, -, h1, -, h2, -⟩ := n8_model 15 (by norm_num)
    rw [h1, h2]; norm_num

/-- Naloga 8a (2) (uradni odgovor E: pravokotni trikotnik), poti »Razmislek« in »Drugače«: ∠ABC = 90°;
trikotnik ni enakokrak (pri |BF| = 17 je |AB| = 15 ≠ 8 = |BC|; če bi bilo |AB| = |BC| = 8, bi bilo
|BF|² = 8² + 8² = 128 ≠ 289 = 17²) in ni enakostraničen (ima pravi kot, ne 60°; |AC| = 17 ≠ 15 = |AB|). -/
theorem n8a2 (h : ℝ) (hh : 0 < h) (h17 : dist pB (pF h) = 17) :
    ∠ (pA h) pB pC = Real.pi / 2 ∧ dist (pA h) pB ≠ dist pB pC ∧
    ((8:ℝ) ^ 2 + 8 ^ 2 = 128 ∧ (17:ℝ) ^ 2 = 289 ∧ (128:ℝ) ≠ 289) ∧
    dist (pA h) pC ≠ dist (pA h) pB ∧ Real.pi / 2 ≠ Real.pi / 3 := by
  obtain ⟨-, -, hAB, -, hBC, hang⟩ := n8_model h hh
  have h15 := ((n8_visina h hh).2.2.1).mp h17
  subst h15
  have s289 : Real.sqrt 289 = 17 := by rw [show (289:ℝ) = 17 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨hang, by rw [hAB, hBC]; norm_num, by norm_num, ?_, ?_⟩
  · rw [hAB, dist3]; simp [pA, pC]; norm_num [s289]
  · intro h; have := Real.pi_pos; linarith

/-- Predpostavke trditve `n8a2` se dajo izpolniti (h = 15). -/
example : (0:ℝ) < 15 ∧ dist pB (pF 15) = 17 := ⟨by norm_num, ((n8_visina 15 (by norm_num)).2.2.1).mpr rfl⟩

/-- Naloga 8a (3) (uradni odgovor I: prazna množica), poti »Razmislek« in »Drugače«: vse točke premice EF
imajo višino z = h, vse točke ravnine ABC višino z = 0 (razlika h ≠ 0), zato je presek premice EF z ravnino
ABC prazen; F ne leži v ravnini ABC. -/
theorem n8a3 (h : ℝ) (hh : h ≠ 0) :
    (∀ p ∈ line[ℝ, pE h, pF h], p 2 = h) ∧ (∀ p ∈ affineSpan ℝ {pA h, pB, pC}, p 2 = 0) ∧
    ((line[ℝ, pE h, pF h] : Set E3) ∩ (affineSpan ℝ {pA h, pB, pC} : Set E3) = ∅) ∧
    pF h ∉ affineSpan ℝ {pA h, pB, pC} := by
  have h1 : line[ℝ, pE h, pF h] ≤ ravnina h := by
    rw [affineSpan_le, Set.insert_subset_iff, Set.singleton_subset_iff]
    exact ⟨by simp [mem_ravnina, pE], by simp [mem_ravnina, pF]⟩
  have h2 : affineSpan ℝ {pA h, pB, pC} ≤ ravnina 0 := by
    rw [affineSpan_le, Set.insert_subset_iff, Set.insert_subset_iff, Set.singleton_subset_iff]
    exact ⟨by simp [mem_ravnina, pA], by simp [mem_ravnina, pB], by simp [mem_ravnina, pC]⟩
  have k1 : ∀ p ∈ line[ℝ, pE h, pF h], p 2 = h := fun p hp => mem_ravnina.mp (h1 hp)
  have k2 : ∀ p ∈ affineSpan ℝ {pA h, pB, pC}, p 2 = 0 := fun p hp => mem_ravnina.mp (h2 hp)
  refine ⟨k1, k2, ?_, fun hF => hh ?_⟩
  · rw [Set.eq_empty_iff_forall_notMem]
    rintro p ⟨hp1, hp2⟩
    exact hh ((k1 p hp1).symm.trans (k2 p hp2))
  · have := k2 _ hF; simpa [pF] using this

/-- Predpostavka trditve `n8a3` se da izpolniti (h = 15). -/
example : (15:ℝ) ≠ 0 := by norm_num

/-- Naloga 8b (uradni odgovor V = 900 cm³), pot »Po korakih«: v = 15; O = |AB|·|BC|/2 = 15·8/2 = 60;
V = O·v = 60·15 = 900. Napaka brez deljenja z 2: 15·8·15 = 1800. -/
theorem n8b :
    (15:ℝ) * 8 / 2 = 60 ∧ (60:ℝ) * 15 = 900 ∧ (15:ℝ) * 8 * 15 = 1800 ∧ (1800:ℝ) ≠ 900 := by norm_num

/-- Naloga 8b, pot »Drugače: brez korenjenja«: pri |AB| = v je V = (v·8/2)·v = 4v²; v² = 289 − 64 = 225,
V = 4·225 = 900; trojica 8, 15, 17: 64 + 225 = 289. -/
theorem n8b_pot2 :
    (∀ v : ℝ, v * 8 / 2 * v = 4 * v ^ 2) ∧ (289:ℝ) - 64 = 225 ∧ (4:ℝ) * 225 = 900 ∧
    (64:ℕ) + 225 = 289 ∧ (8:ℕ) ^ 2 + 15 ^ 2 = 17 ^ 2 := by
  refine ⟨fun v => by ring, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-! ## Naloga 9 (seznami realnih števil) -/

/-- Aritmetična sredina. -/
noncomputable def sredina (l : List ℝ) : ℝ := l.sum / l.length

/-- Mediana: srednji podatek urejenega seznama (liho število podatkov) oziroma sredina obeh srednjih. -/
noncomputable def mediana (l : List ℝ) : ℝ :=
  let s := l.insertionSort (· ≤ ·)
  if s.length % 2 = 1 then s.getD (s.length / 2) 0
  else (s.getD (s.length / 2 - 1) 0 + s.getD (s.length / 2) 0) / 2

/-- m je modus: pojavi se vsaj dvakrat in večkrat kot vsak drug podatek. -/
def jeModus (l : List ℝ) (m : ℝ) : Prop := 2 ≤ l.count m ∧ ∀ y ∈ l, y ≠ m → l.count y < l.count m

/-- Modus je en sam (če obstaja). -/
theorem modus_enolicen {l : List ℝ} {m m' : ℝ} (h : jeModus l m) (h' : jeModus l m') : m = m' := by
  by_contra hne
  have hm : m ∈ l := List.count_pos_iff.mp (by have := h.1; omega)
  have hm' : m' ∈ l := List.count_pos_iff.mp (by have := h'.1; omega)
  have := h.2 m' hm' (Ne.symm hne)
  have := h'.2 m hm hne
  omega

/-- Predpostavke trditve `modus_enolicen` se dajo izpolniti (seznam iz naloge 9a, m = m' = 27). -/
example : jeModus [34, 27, 41, 27, 46] 27 ∧ jeModus [34, 27, 41, 27, 46] 27 := by
  have hm : jeModus [34, 27, 41, 27, 46] 27 := by
    refine ⟨by norm_num [List.count_cons], ?_⟩
    intro y hy hne
    simp only [List.mem_cons, List.not_mem_nil, or_false] at hy
    rcases hy with rfl | rfl | rfl | rfl | rfl <;> norm_num [List.count_cons] at *
  exact ⟨hm, hm⟩

/-- Naloga 9a (uradni odgovor), pot »Po korakih«: (34 + 27 + 41 + 27 + 46)/5 = 175/5 = 35; modus 27 (dvakrat,
edini); urejeno 27, 27, 34, 41, 46, mediana 34. Napaki: srednji neurejeni podatek 41 ≠ 34, število ponovitev
2 ni modus. -/
theorem n9a :
    sredina [34, 27, 41, 27, 46] = 35 ∧ ((34:ℝ) + 27 + 41 + 27 + 46) / 5 = 175 / 5 ∧ (175:ℝ) / 5 = 35 ∧
    jeModus [34, 27, 41, 27, 46] 27 ∧ (∀ m, jeModus [34, 27, 41, 27, 46] m → m = 27) ∧
    ([34, 27, 41, 27, 46] : List ℝ).insertionSort (· ≤ ·) = [27, 27, 34, 41, 46] ∧
    mediana [34, 27, 41, 27, 46] = 34 ∧ ¬ jeModus [34, 27, 41, 27, 46] 2 := by
  have hm : jeModus [34, 27, 41, 27, 46] 27 := by
    refine ⟨by norm_num [List.count_cons], ?_⟩
    intro y hy hne
    simp only [List.mem_cons, List.not_mem_nil, or_false] at hy
    rcases hy with rfl | rfl | rfl | rfl | rfl <;> norm_num [List.count_cons] at *
  refine ⟨?_, by norm_num, by norm_num, hm, fun m h => modus_enolicen h hm, ?_, ?_, ?_⟩
  · norm_num [sredina]
  · norm_num [List.insertionSort_cons, List.orderedInsert_cons,
      List.insertionSort_nil, List.orderedInsert_nil]
  · norm_num [mediana, List.insertionSort_cons, List.orderedInsert_cons,
      List.insertionSort_nil, List.orderedInsert_nil]
  · intro h; have := h.1; norm_num [List.count_cons] at this

/-- Naloga 9a, pot »Drugače: sredina z odmiki«: odmiki od 30 so +4, −3, +11, −3, +16, vsota 25, 25 : 5 = 5,
sredina 30 + 5 = 35. -/
theorem n9a_pot2 :
    (34:ℝ) - 30 = 4 ∧ (27:ℝ) - 30 = -3 ∧ (41:ℝ) - 30 = 11 ∧ (46:ℝ) - 30 = 16 ∧
    (4:ℝ) + -3 + 11 + -3 + 16 = 25 ∧ (25:ℝ) / 5 = 5 ∧ (30:ℝ) + 5 = 35 ∧
    sredina [34, 27, 41, 27, 46] = 30 + (4 + -3 + 11 + -3 + 16) / 5 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  norm_num [sredina]

/-- Naloga 9b (uradni odgovor 16, edina rešitev), pot »Z vsoto«: vsota mora biti 5·14 = 70; 12 + 18 + 9 + 15 =
54; manjka 70 − 54 = 16. Pot »z odmiki«: −2 + 4 − 5 + 1 = −2, iskano število je 14 + 2. Napaka: 54 : 4 = 13,5. -/
theorem n9b :
    (∀ x : ℝ, sredina [12, 18, x, 9, 15] = 14 ↔ x = 16) ∧
    (5:ℝ) * 14 = 70 ∧ (12:ℝ) + 18 + 9 + 15 = 54 ∧ (70:ℝ) - 54 = 16 ∧
    (-2:ℝ) + 4 + -5 + 1 = -2 ∧ (14:ℝ) + 2 = 16 ∧ (54:ℝ) / 4 = 13.5 ∧ (13.5:ℝ) ≠ 16 := by
  refine ⟨fun x => ?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩
  simp only [sredina, List.sum_cons, List.sum_nil, List.length_cons, List.length_nil]
  push_cast
  constructor
  · intro h; field_simp at h; linarith
  · intro h; rw [h]; norm_num

/-- Naloga 9c, pot »Preverimo možnosti«: modus obstaja le, če je število v okvirčku eno od 14, 2, 9, 5, 12
(drugače se vsak podatek pojavi enkrat); mediane: pri 2 in 5 je 7, pri 9 je 9, pri 12 in 14 je 10,5. -/
theorem n9c_moznosti :
    (∀ x m : ℝ, 2 ≤ ([14, 2, 9, x, 5, 12] : List ℝ).count m →
      x = m ∧ (m = 14 ∨ m = 2 ∨ m = 9 ∨ m = 5 ∨ m = 12)) ∧
    mediana [14, 2, 9, 2, 5, 12] = 7 ∧ mediana [14, 2, 9, 5, 5, 12] = 7 ∧
    mediana [14, 2, 9, 9, 5, 12] = 9 ∧ mediana [14, 2, 9, 12, 5, 12] = 10.5 ∧
    mediana [14, 2, 9, 14, 5, 12] = 10.5 := by
  refine ⟨fun x m h => ?_, ?_, ?_, ?_, ?_, ?_⟩
  · simp only [List.count_cons, List.count_nil, beq_iff_eq] at h
    split_ifs at h <;> simp_all <;> grind
  all_goals norm_num [mediana, List.insertionSort_cons, List.orderedInsert_cons,
      List.insertionSort_nil, List.orderedInsert_nil]

/-- Naloga 9c (uradni odgovor 9, edina rešitev): modus števil 14, 2, 9, x, 5, 12 obstaja in je enak mediani
natanko pri x = 9. -/
theorem n9c (x : ℝ) :
    (∃ m, jeModus [14, 2, 9, x, 5, 12] m ∧ mediana [14, 2, 9, x, 5, 12] = m) ↔ x = 9 := by
  constructor
  · rintro ⟨m, hm, hmed⟩
    obtain ⟨hx, hm5⟩ := n9c_moznosti.1 x m hm.1
    subst hx
    rcases hm5 with rfl | rfl | rfl | rfl | rfl
    all_goals first
      | rfl
      | (norm_num [mediana, List.insertionSort_cons, List.orderedInsert_cons,
      List.insertionSort_nil, List.orderedInsert_nil] at hmed)
  · rintro rfl
    refine ⟨9, ⟨by norm_num [List.count_cons], ?_⟩, n9c_moznosti.2.2.2.1⟩
    intro y hy hne
    simp only [List.mem_cons, List.not_mem_nil, or_false] at hy
    rcases hy with rfl | rfl | rfl | rfl | rfl | rfl <;> norm_num [List.count_cons] at *

/-- Naloga 9d (uradni odgovor: 2 in 5 v poljubnem vrstnem redu ali 8 in 11), pot »Po korakih: najprej
modus«: za naravni števili a, b imajo 5, a, 8, b enake sredino, mediano in modus natanko v teh štirih
primerih. (Dve enaki števili m: 13 + 2m = 4m da m = 6,5, ni naravno; modus 5: 20 − 5 − 5 − 8 = 2;
modus 8: 32 − 5 − 8 − 8 = 11.) -/
theorem n9d (a b : ℕ) :
    (∃ m, jeModus [5, (a:ℝ), 8, (b:ℝ)] m ∧ sredina [5, (a:ℝ), 8, (b:ℝ)] = m ∧
      mediana [5, (a:ℝ), 8, (b:ℝ)] = m) ↔
    (a = 2 ∧ b = 5) ∨ (a = 5 ∧ b = 2) ∨ (a = 8 ∧ b = 11) ∨ (a = 11 ∧ b = 8) := by
  constructor
  · rintro ⟨m, hm, hs, -⟩
    have hc := hm.1
    simp only [sredina, List.sum_cons, List.sum_nil, List.length_cons, List.length_nil] at hs
    push_cast at hs
    have hs' : (5:ℝ) + (a + (8 + b)) = 4 * m := by
      field_simp at hs; linarith
    simp only [List.count_cons, List.count_nil, beq_iff_eq] at hc
    split_ifs at hc with h1 h2 h3 h4 <;> simp at hc
    all_goals first
      | (have ha : (a:ℝ) = 2 := by linarith
         have hb : (b:ℝ) = 5 := by linarith
         left; exact ⟨by exact_mod_cast ha, by exact_mod_cast hb⟩)
      | (have ha : (a:ℝ) = 5 := by linarith
         have hb : (b:ℝ) = 2 := by linarith
         right; left; exact ⟨by exact_mod_cast ha, by exact_mod_cast hb⟩)
      | (have ha : (a:ℝ) = 8 := by linarith
         have hb : (b:ℝ) = 11 := by linarith
         right; right; left; exact ⟨by exact_mod_cast ha, by exact_mod_cast hb⟩)
      | (have ha : (a:ℝ) = 11 := by linarith
         have hb : (b:ℝ) = 8 := by linarith
         right; right; right; exact ⟨by exact_mod_cast ha, by exact_mod_cast hb⟩)
      | (exfalso
         have h13 : ((2 * a : ℕ) : ℝ) = 13 := by push_cast; linarith
         have : 2 * a = 13 := by exact_mod_cast h13
         omega)
  · rintro (⟨rfl, rfl⟩ | ⟨rfl, rfl⟩ | ⟨rfl, rfl⟩ | ⟨rfl, rfl⟩)
    · refine ⟨5, ⟨by norm_num [List.count_cons], ?_⟩, by norm_num [sredina],
        by norm_num [mediana, List.insertionSort_cons, List.orderedInsert_cons,
      List.insertionSort_nil, List.orderedInsert_nil]⟩
      intro y hy hne
      simp only [List.mem_cons, List.not_mem_nil, or_false] at hy
      rcases hy with rfl | rfl | rfl | rfl <;> norm_num [List.count_cons] at *
    · refine ⟨5, ⟨by norm_num [List.count_cons], ?_⟩, by norm_num [sredina],
        by norm_num [mediana, List.insertionSort_cons, List.orderedInsert_cons,
      List.insertionSort_nil, List.orderedInsert_nil]⟩
      intro y hy hne
      simp only [List.mem_cons, List.not_mem_nil, or_false] at hy
      rcases hy with rfl | rfl | rfl | rfl <;> norm_num [List.count_cons] at *
    · refine ⟨8, ⟨by norm_num [List.count_cons], ?_⟩, by norm_num [sredina],
        by norm_num [mediana, List.insertionSort_cons, List.orderedInsert_cons,
      List.insertionSort_nil, List.orderedInsert_nil]⟩
      intro y hy hne
      simp only [List.mem_cons, List.not_mem_nil, or_false] at hy
      rcases hy with rfl | rfl | rfl | rfl <;> norm_num [List.count_cons] at *
    · refine ⟨8, ⟨by norm_num [List.count_cons], ?_⟩, by norm_num [sredina],
        by norm_num [mediana, List.insertionSort_cons, List.orderedInsert_cons,
      List.insertionSort_nil, List.orderedInsert_nil]⟩
      intro y hy hne
      simp only [List.mem_cons, List.not_mem_nil, or_false] at hy
      rcases hy with rfl | rfl | rfl | rfl <;> norm_num [List.count_cons] at *

/-- Naloga 9d, pot »Preizkus« in računi: 2, 5, 5, 8: sredina 20/4 = 5, mediana (5 + 5)/2 = 5, modus 5;
5, 8, 8, 11: sredina 32/4 = 8, mediana 8, modus 8; 4·5 = 20, 20 − 5 − 5 − 8 = 2, 4·8 = 32, 32 − 5 − 8 − 8 = 11;
2m = 13 da m = 6,5. Napaki iz razlage: 5, 5, 8, 8 nima (enega) modusa, mediana 6,5; 5, 5, 5, 8 ima modus in
mediano 5, sredino pa 23/4 ≠ 5. -/
theorem n9d_preizkus :
    sredina [2, 5, 5, 8] = 20 / 4 ∧ (20:ℝ) / 4 = 5 ∧ mediana [2, 5, 5, 8] = (5 + 5) / 2 ∧
    sredina [5, 8, 8, 11] = 32 / 4 ∧ (32:ℝ) / 4 = 8 ∧ mediana [5, 8, 8, 11] = 8 ∧
    (4:ℕ) * 5 = 20 ∧ 20 - 5 - 5 - 8 = 2 ∧ (4:ℕ) * 8 = 32 ∧ 32 - 5 - 8 - 8 = 11 ∧
    (∀ m : ℝ, (13 + 2 * m) / 4 = m ↔ m = 6.5) ∧
    (¬ ∃ m, jeModus [5, 5, 8, 8] m) ∧ mediana [5, 5, 8, 8] = 6.5 ∧
    jeModus [5, 5, 5, 8] 5 ∧ mediana [5, 5, 5, 8] = 5 ∧ sredina [5, 5, 5, 8] = 23 / 4 ∧ (23:ℝ) / 4 ≠ 5 := by
  refine ⟨by norm_num [sredina], by norm_num, by norm_num [mediana, List.insertionSort_cons, List.orderedInsert_cons,
      List.insertionSort_nil, List.orderedInsert_nil],
    by norm_num [sredina], by norm_num, by norm_num [mediana, List.insertionSort_cons, List.orderedInsert_cons,
      List.insertionSort_nil, List.orderedInsert_nil],
    by norm_num, by norm_num, by norm_num, by norm_num,
    fun m => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, ?_,
    by norm_num [mediana, List.insertionSort_cons, List.orderedInsert_cons,
      List.insertionSort_nil, List.orderedInsert_nil], ?_,
    by norm_num [mediana, List.insertionSort_cons, List.orderedInsert_cons,
      List.insertionSort_nil, List.orderedInsert_nil], by norm_num [sredina], by norm_num⟩
  · rintro ⟨m, hc, hlt⟩
    have h5 := hlt 5 (by simp)
    have h8 := hlt 8 (by simp)
    by_cases e5 : (5:ℝ) = m
    · subst e5; norm_num [List.count_cons] at h8
    · by_cases e8 : (8:ℝ) = m
      · subst e8; norm_num [List.count_cons] at h5
      · have := List.count_pos_iff.mp (show 0 < List.count m [5, 5, 8, 8] by omega)
        simp at this
        rcases this with h | h
        · exact e5 h.symm
        · exact e8 h.symm
  · refine ⟨by norm_num [List.count_cons], ?_⟩
    intro y hy hne
    simp only [List.mem_cons, List.not_mem_nil, or_false] at hy
    rcases hy with rfl | rfl | rfl | rfl <;> norm_num [List.count_cons] at *

end Evklid.Pole.NPZ9_MAT_2023_redni
