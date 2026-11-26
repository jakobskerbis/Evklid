/-
vir: content/exam-papers/NPZ6-MAT-2024-redni.json
sha256: bcddb90a8453248ed1c41b744fa41eaa2737e6902cc13a5dbc1180f03174a936
Ni v Leanu:
- pisni postopki (pisno odštevanje, deljenje, premik decimalne vejice) kot postopek: dokazan je vsak zapisani
  korak kot račun, ne sam algoritem;
- 2a: tabela mestnih vrednosti je dokazana s števkami (`Nat.digits`, n / 10ᵏ % 10); »mesta šteješ od desne« je
  razlaga;
- 4a–4e: branje puščic s slike je dokazano le kot račun s koordinatami SVG slike (črtice pri x = 20 + 16k,
  k = 0 … 20), ne kot pomen slike; 4e: risanje puščice (risba);
- 5a, 5b: načrtovanje z geotrikotnikom in ravnilom (risba); 5c: merjenje z ravnilom. Lega p, A in B je s slike
  prevedena v koordinate v cm (kvadratek 0,5 cm): p: 6x − 8y + 1 = 0, A = (2,5; 4,5), B = (6,5; 1,5); vse
  trditve 5a–5e so dokazane v tem modelu. Razdalja je zapisana kot √(Δx² + Δy²) (ne `dist` na ℝ × ℝ, ki je
  v Mathlibu največja razlika koordinat). 5e: besedna razlaga je razlaga; dokazano je |AN| = 2 cm, AN ⊥ p in
  da je vsaka druga daljica od A do p daljša;
- 6a: risanje kota (risba); dokazano 125° = 90° + 35°, 125° > 90° in napaka 180° − 125° = 55° < 90°;
- 7: pravilo »n-ta slika ima n + 2 trikotnikov, na lihih mestih nepobarvani« je razbrano s prvih treh slik
  (3, 4, 5 trikotnikov) in je zapisano kot definicija; dokazano je štetje po tej definiciji; 7a: risba;
- 8: smeri stranic (katere so vodoravne in v katero smer gredo) so s skice; vrt je zapisan z oglišči
  A(0, 0), B(24, 0), C(24, 7), D(16, 7), E(16, 13), F(9, 13), G(9, 10), H(0, 10) (dokazano, da se ujemajo z
  danimi dolžinami); ploščina je dokazana kot mera unije treh polodprtih pravokotnikov (razdelitev 1); razdelitvi
  2 in 3 sta dokazani kot račun, ne kot mera;
- 9c, 9d: izbira utemeljitve je razlaga besedila; dokazano je, da dani podatki ne določijo cene nove izdaje
  oziroma števila poglavij;
- razlage napak v besedah; števila iz razlag napak, ki so račun, so dokazana.
Decimalna števila so zapisana v ℚ (decimalni zapis je v ℚ točen). Zaokrožitev je dokazana z `round`
(round x = ⌊x + 1/2⌋) in z mejo napake. ℕ-odštevanje (v ℕ je a − b = 0 pri a < b) je uporabljeno
samo pri a ≥ b (2e, 6d, 7, 8); ℕ-deljenje (navzdol) samo pri izločanju števk in kjer je ostanek 0 ali je
ostanek posebej dokazan.
-/
module

public import Mathlib

public section

namespace Evklid.Pole.NPZ6_MAT_2024_redni

/-! ## Naloga 1 -/

/-- Naloga 1a (odgovor, ↔): 15 − x = 6,38 natanko tedaj, ko je x = 8,62. -/
theorem n1a_odgovor (x : ℚ) : 15 - x = 6.38 ↔ x = 8.62 := by
  constructor <;> intro h <;> linarith

/-- Naloga 1a, »Po korakih«: manjkajoče število je 15 − 6,38; 15 = 15,00; 15,00 − 6,38 = 8,62. -/
theorem n1a_pot1 : (15 : ℚ) = 15.00 ∧ (15.00 : ℚ) - 6.38 = 8.62 := by norm_num

/-- Naloga 1a, »Preizkus«: 15 − 8,62 = 6,38. -/
theorem n1a_pot2 : (15 : ℚ) - 8.62 = 6.38 := by norm_num

/-- Naloga 1a, napaka: 15 − 6 = 9 in dopisano 0,62 dá 9,62, a 15 − 9,62 ≠ 6,38. Pot pole: ko od 15,00
odštejemo 0,38, si izposodimo eno celo, zato od 9 celih ostane le 8 celih (9 − 1 = 8). Isto drugače:
15,00 − 0,38 = 14,62, ostane 14 celih, in 14 − 6 = 8. -/
theorem n1a_napaka :
    (15 : ℚ) - 6 = 9 ∧ (9 : ℚ) + 0.62 = 9.62 ∧ (15 : ℚ) - 9.62 ≠ 6.38 ∧
    (9 : ℚ) - 1 = 8 ∧ (15 : ℚ) - 6.38 = (9 - 1) + 0.62 ∧
    (15.00 : ℚ) - 0.38 = 14.62 ∧ (14 : ℚ) - 6 = 8 := by norm_num

/-- Naloga 1b (odgovor, ↔): 4,27 + x = 7 natanko tedaj, ko je x = 2,73. -/
theorem n1b_odgovor (x : ℚ) : 4.27 + x = 7 ↔ x = 2.73 := by
  constructor <;> intro h <;> linarith

/-- Naloga 1b, »Z dopolnjevanjem«: 4,27 + 0,73 = 5, od 5 do 7 manjka 2 (5 + 2 = 7), skupaj 0,73 + 2 = 2,73. -/
theorem n1b_pot1 : (4.27 : ℚ) + 0.73 = 5 ∧ (5 : ℚ) + 2 = 7 ∧ (0.73 : ℚ) + 2 = 2.73 := by norm_num

/-- Naloga 1b, »Drugače: z odštevanjem«: 7,00 − 4,27 = 2,73; preizkus 4,27 + 2,73 = 7. -/
theorem n1b_pot2 : (7.00 : ℚ) - 4.27 = 2.73 ∧ (4.27 : ℚ) + 2.73 = 7 := by norm_num

/-- Naloga 1b, napaka: 4,27 + 3,73 = 8 (ne 7). -/
theorem n1b_napaka : (4.27 : ℚ) + 3.73 = 8 ∧ (8 : ℚ) ≠ 7 := by norm_num

/-- Naloga 1c (odgovor, ↔): 0,046 · x = 46 natanko tedaj, ko je x = 1 000. -/
theorem n1c_odgovor (x : ℚ) : 0.046 * x = 46 ↔ x = 1000 := by
  constructor <;> intro h <;> linarith

/-- Naloga 1c, »S premikom decimalne vejice«: 0,046 → 0,46 → 4,6 → 46 (vsak premik je · 10);
10 · 10 · 10 = 1 000; preizkus 0,046 · 1 000 = 46. -/
theorem n1c_pot :
    (0.046 : ℚ) * 10 = 0.46 ∧ (0.46 : ℚ) * 10 = 4.6 ∧ (4.6 : ℚ) * 10 = 46 ∧
    (10 : ℚ) * 10 * 10 = 1000 ∧ (0.046 : ℚ) * 1000 = 46 := by norm_num

/-- Naloga 1c, napaka: 0,046 · 100 = 4,6, kar je desetkrat premalo (4,6 · 10 = 46). -/
theorem n1c_napaka : (0.046 : ℚ) * 100 = 4.6 ∧ (4.6 : ℚ) * 10 = 46 ∧ (4.6 : ℚ) ≠ 46 := by norm_num

/-- Naloga 1d (odgovor, ↔): 372 · x = 3,72 natanko tedaj, ko je x = 0,01. -/
theorem n1d_odgovor (x : ℚ) : 372 * x = 3.72 ↔ x = 0.01 := by
  constructor <;> intro h <;> linarith

/-- Naloga 1d, »S premikom decimalne vejice«: 3,72 < 372, zato je faktor manjši od 1; premik za dve mesti
v levo je deljenje s 100 ali množenje z 0,01: 372 : 100 = 3,72 = 372 · 0,01. -/
theorem n1d_pot :
    (3.72 : ℚ) < 372 ∧ (∀ x : ℚ, 372 * x = 3.72 → x < 1) ∧
    (372 : ℚ) / 100 = 3.72 ∧ (372 : ℚ) * 0.01 = 3.72 := by
  refine ⟨by norm_num, fun x h => by linarith, by norm_num, by norm_num⟩

/-- Predpostavka v `n1d_pot` se da izpolniti (x = 0,01). -/
example : (372 : ℚ) * 0.01 = 3.72 := by norm_num

/-- Naloga 1d, napaka: 372 · 0,1 = 37,2 ≠ 3,72. -/
theorem n1d_napaka : (372 : ℚ) * 0.1 = 37.2 ∧ (37.2 : ℚ) ≠ 3.72 := by norm_num

/-- Naloga 1e (odgovor, ↔): x : 10 = 0,58 natanko tedaj, ko je x = 5,8. -/
theorem n1e_odgovor (x : ℚ) : x / 10 = 0.58 ↔ x = 5.8 := by
  constructor <;> intro h <;> linarith

/-- Naloga 1e, »Z obratno računsko operacijo«: 0,58 · 10 = 5,8; preizkus 5,8 : 10 = 0,58. -/
theorem n1e_pot : (0.58 : ℚ) * 10 = 5.8 ∧ (5.8 : ℚ) / 10 = 0.58 := by norm_num

/-- Naloga 1e, napaka: 0,58 : 10 = 0,058, preizkus 0,058 : 10 = 0,0058 ≠ 0,58. -/
theorem n1e_napaka : (0.58 : ℚ) / 10 = 0.058 ∧ (0.058 : ℚ) / 10 = 0.0058 ∧ (0.0058 : ℚ) ≠ 0.58 := by
  norm_num

/-- Naloga 1f (odgovor): 0,75 : 0,1 = 7,5. -/
theorem n1f_odgovor : (0.75 : ℚ) / 0.1 = 7.5 := by norm_num

/-- Naloga 1f, »Koliko desetin je v številu?«: v 0,75 je 7,5 desetin (7,5 · 0,1 = 0,75), zato
0,75 : 0,1 = 7,5; deljenje z 0,1 je množenje z 10: 0,75 · 10 = 7,5. -/
theorem n1f_pot1 :
    (7.5 : ℚ) * 0.1 = 0.75 ∧ (0.75 : ℚ) / 0.1 = 7.5 ∧ (∀ a : ℚ, a / 0.1 = a * 10) ∧ (0.75 : ℚ) * 10 = 7.5 := by
  refine ⟨by norm_num, by norm_num, fun a => by norm_num [div_eq_mul_inv], by norm_num⟩

/-- Naloga 1f, »Drugače: razširi oba člena«: 0,75 : 0,1 = (0,75 · 10) : (0,1 · 10) = 7,5 : 1 = 7,5. -/
theorem n1f_pot2 : (0.75 : ℚ) / 0.1 = 7.5 := by
  calc (0.75 : ℚ) / 0.1 = (0.75 * 10) / (0.1 * 10) := by norm_num
    _ = 7.5 / 1 := by norm_num
    _ = 7.5 := by norm_num

/-- Naloga 1f, napaka: 0,75 · 0,1 = 0,075 in 0,75 : 10 = 0,075, oboje ≠ 7,5; pravilo: pri deljenju
pozitivnega števila s številom med 0 in 1 je količnik večji od deljenca. -/
theorem n1f_napaka :
    (0.75 : ℚ) * 0.1 = 0.075 ∧ (0.75 : ℚ) / 10 = 0.075 ∧ (0.075 : ℚ) ≠ 7.5 ∧
    (∀ a d : ℚ, 0 < a → 0 < d → d < 1 → a < a / d) := by
  refine ⟨by norm_num, by norm_num, by norm_num, fun a d ha hd hd1 => ?_⟩
  rw [lt_div_iff₀ hd]
  nlinarith

/-- Predpostavke pravila v `n1f_napaka` se dajo izpolniti (a = 0,75, d = 0,1). -/
example : (0 : ℚ) < 0.75 ∧ (0 : ℚ) < 0.1 ∧ (0.1 : ℚ) < 1 := by norm_num

/-! ## Naloga 2 -/

/-- Naloga 2a (odgovor in pot »S tabelo mestnih vrednosti«): števke 734 518 od enic navzgor so
8, 1, 5, 4, 3, 7 in števke 2 476 365 so 5, 6, 3, 6, 7, 4, 2; števka stotisočic je pri 734 518 enaka 7, pri
2 476 365 pa 4 (tam je 7 števka desettisočic); od obeh števil ima 7 na mestu stotisočic samo 734 518. -/
theorem n2a :
    Nat.digits 10 734518 = [8, 1, 5, 4, 3, 7] ∧ Nat.digits 10 2476365 = [5, 6, 3, 6, 7, 4, 2] ∧
    (734518 / 100000) % 10 = 7 ∧ (2476365 / 100000) % 10 = 4 ∧ (2476365 / 10000) % 10 = 7 ∧
    ({734518, 2476365} : Finset ℕ).filter (fun n => (n / 100000) % 10 = 7) = {734518} := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by decide⟩

/-- Naloga 2b (odgovor in pot »Po korakih«): večje število je 2 476 365 (> 734 518); števka desettisočic 7,
tisočic 6 ≥ 5, zato navzgor (7 → 8): zaokroženo na desettisočice 2 480 000, napaka največ 5 000. -/
theorem n2b :
    734518 < 2476365 ∧ (2476365 / 10000) % 10 = 7 ∧ (2476365 / 1000) % 10 = 6 ∧ 5 ≤ 6 ∧
    round ((2476365 : ℚ) / 10000) * 10000 = 2480000 ∧ |(2476365 : ℚ) - 2480000| ≤ 5000 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_, ?_⟩
  · have h : round ((2476365 : ℚ) / 10000) = 248 := by
      rw [round_eq, Int.floor_eq_iff]; norm_num
    rw [h]; norm_num
  · rw [abs_le]; norm_num

/-- Naloga 2b, napaka: 2 470 000 je od 2 476 365 oddaljeno 6 365 > 5 000 (ni zaokrožitev na desettisočice);
248 ni 2 480 000. -/
theorem n2b_napaka :
    |(2476365 : ℚ) - 2470000| = 6365 ∧ (5000 : ℚ) < 6365 ∧ (248 : ℚ) ≠ 2480000 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  rw [abs_of_pos (by norm_num)]; norm_num

/-- Naloga 2c (odgovor, ↔): 734 518 + x = 2 476 365 natanko tedaj, ko je x = 1 741 847. -/
theorem n2c_odgovor (x : ℤ) : 734518 + x = 2476365 ↔ x = 1741847 := by
  constructor <;> intro h <;> omega

/-- Naloga 2c, »Pisno odštevanje«: 2 476 365 − 734 518 = 1 741 847. -/
theorem n2c_pot1 : (2476365 : ℤ) - 734518 = 1741847 := by norm_num

/-- Naloga 2c, »Preizkus s seštevanjem«: 1 741 847 + 734 518 = 2 476 365. -/
theorem n2c_pot2 : (1741847 : ℤ) + 734518 = 2476365 := by norm_num

/-- Naloga 2d (odgovor): vsota je od razlike večja za 1 469 036. -/
theorem n2d_odgovor : ((734518 : ℤ) + 2476365) - (2476365 - 734518) = 1469036 := by norm_num

/-- Naloga 2d, »Po korakih«: vsota 734 518 + 2 476 365 = 3 210 883, razlika 2 476 365 − 734 518 = 1 741 847,
3 210 883 − 1 741 847 = 1 469 036. -/
theorem n2d_pot1 :
    ((734518 : ℤ) + 2476365) - (2476365 - 734518) = 1469036 := by
  calc ((734518 : ℤ) + 2476365) - (2476365 - 734518) = 3210883 - (2476365 - 734518) := by norm_num
    _ = 3210883 - 1741847 := by norm_num
    _ = 1469036 := by norm_num

/-- Naloga 2d, »Drugače: brez velike vsote«: (a + b) − (a − b) = 2b za vsa a, b (večje število a ne vpliva);
(2 476 365 + 734 518) − (2 476 365 − 734 518) = 2 · 734 518 = 1 469 036. -/
theorem n2d_pot2 :
    (∀ a b : ℤ, (a + b) - (a - b) = 2 * b) ∧
    ((2476365 : ℤ) + 734518) - (2476365 - 734518) = 2 * 734518 ∧ (2 : ℤ) * 734518 = 1469036 := by
  refine ⟨fun a b => by ring, by norm_num, by norm_num⟩

/-- Naloga 2d, napaka: 1 741 847 (razlika) ni odgovor 1 469 036. -/
theorem n2d_napaka : (1741847 : ℤ) ≠ 1469036 := by norm_num

/-- Količnik iz naloge 2e. -/
def q2e : ℚ := 2476365 / 734518

/-- Naloga 2e (odgovor 3): količnik 2 476 365 : 734 518 je bližje številu 3 kot kateremukoli drugemu
naravnemu številu (zato tudi kot 4 in 30). -/
theorem n2e_odgovor : ∀ n : ℕ, n ≠ 3 → |q2e - 3| < |q2e - n| := by
  have h1 : (3 : ℚ) < q2e := by unfold q2e; norm_num
  have h2 : q2e < 7 / 2 := by unfold q2e; norm_num
  intro n hn
  rcases (show n ≤ 2 ∨ 4 ≤ n by omega) with h | h
  · have hn' : (n : ℚ) ≤ 2 := by exact_mod_cast h
    rw [abs_of_pos (by linarith), abs_of_pos (by linarith)]
    linarith
  · have hn' : (4 : ℚ) ≤ n := by exact_mod_cast h
    rw [abs_of_pos (by linarith), abs_of_neg (by linarith)]
    linarith

/-- Naloga 2e, »Z večkratniki«: 3 · 734 518 = 2 203 554, 4 · 734 518 = 2 938 072, 2 476 365 leži med njima;
2 476 365 − 2 203 554 = 272 811, 2 938 072 − 2 476 365 = 461 707, 272 811 < 461 707; 30 · 734 518 je več kot
22 milijonov; pri zaokrožitvi 734 518 na 700 000 je količnik 2 476 365 : 700 000 med 3,5 in 4,5 (najbližje 4). -/
theorem n2e_pot1 :
    3 * 734518 = 2203554 ∧ 4 * 734518 = 2938072 ∧ 2203554 < 2476365 ∧ 2476365 < 2938072 ∧
    2476365 - 2203554 = 272811 ∧ 2938072 - 2476365 = 461707 ∧ 272811 < 461707 ∧
    22000000 < 30 * 734518 ∧
    (7 / 2 : ℚ) < 2476365 / 700000 ∧ (2476365 : ℚ) / 700000 < 9 / 2 := by
  norm_num

/-- Naloga 2e, »Drugače: z oceno«: 2 476 365 ≈ 2 500 000 (napaka 23 635 ≤ 50 000), 734 518 ≈ 750 000
(napaka 15 482 ≤ 25 000); 2 500 000 : 750 000 = 250 : 75 = 10 : 3, malo več kot 3 (natančneje 3,3, napaka
pod 0,05); natančni količnik je približno 3,37 (napaka pod 0,005) in je bližje 3 kot 4. -/
theorem n2e_pot2 :
    |(2476365 : ℚ) - 2500000| ≤ 50000 ∧ |(734518 : ℚ) - 750000| ≤ 25000 ∧
    (2500000 : ℚ) / 750000 = 250 / 75 ∧ (250 : ℚ) / 75 = 10 / 3 ∧ (3 : ℚ) < 10 / 3 ∧
    |(10 / 3 : ℚ) - 3.3| < 0.05 ∧ |q2e - 3.37| < 0.005 ∧ |q2e - 3| < |q2e - 4| := by
  have h4 := n2e_odgovor 4 (by norm_num)
  push_cast at h4
  refine ⟨?_, ?_, by norm_num, by norm_num, by norm_num, ?_, ?_, h4⟩
  · rw [abs_le]; norm_num
  · rw [abs_le]; norm_num
  · rw [abs_lt]; norm_num
  · unfold q2e; rw [abs_lt]; norm_num

/-! ## Naloga 3 -/

/-- Naloga 3a (odgovor, ↔ med števkami): 63 48□ je deljivo z 10 natanko pri števki 0 (63 480). Pravilo:
deljivo z 10 natanko tedaj, ko je zadnja števka 0. -/
theorem n3a :
    (∀ d < 10, 10 ∣ 63480 + d ↔ d = 0) ∧ (∀ n : ℕ, 10 ∣ n ↔ n % 10 = 0) ∧
    (Finset.range 10).filter (fun d => 10 ∣ 63480 + d) = {0} := by
  refine ⟨fun d _ => by omega, fun n => by omega, by decide⟩

/-- Naloga 3a, napaka: 63 485 je deljivo s 5, ne pa z 10. -/
theorem n3a_napaka : 5 ∣ 63485 ∧ ¬ 10 ∣ 63485 := by decide

/-- Naloga 3b (odgovor, ↔ med števkami): 20 71□ je deljivo z 2 natanko pri sodih števkah 0, 2, 4, 6, 8
(20 710, 20 712, 20 714, 20 716, 20 718). Pravilo: deljivo z 2 natanko tedaj, ko je zadnja števka soda. -/
theorem n3b :
    (∀ d < 10, 2 ∣ 20710 + d ↔ d = 0 ∨ d = 2 ∨ d = 4 ∨ d = 6 ∨ d = 8) ∧
    (∀ n : ℕ, 2 ∣ n ↔ 2 ∣ n % 10) ∧
    (Finset.range 10).filter (fun d => 2 ∣ 20710 + d) = {0, 2, 4, 6, 8} := by
  refine ⟨fun d _ => by omega, fun n => by omega, by decide⟩

/-- Naloga 3b, napaka: tudi 0 je soda števka, 20 710 je deljivo z 2. -/
theorem n3b_napaka : 2 ∣ 20710 := by decide

/-- Naloga 3c (odgovor: vse števke): 4□ 935 = 40 935 + 1 000 · □ je deljivo s 5 pri vsaki števki 0 … 9
(npr. 40 935, 47 935). Pravilo: deljivo s 5 natanko tedaj, ko je zadnja števka 0 ali 5. -/
theorem n3c :
    (∀ d : ℕ, 5 ∣ 40935 + 1000 * d) ∧ (∀ n : ℕ, 5 ∣ n ↔ n % 10 = 0 ∨ n % 10 = 5) ∧
    (Finset.range 10).filter (fun d => 5 ∣ 40935 + 1000 * d) = Finset.range 10 ∧
    40935 + 1000 * 0 = 40935 ∧ 40935 + 1000 * 7 = 47935 := by
  refine ⟨fun d => by omega, fun n => by omega, by decide, rfl, rfl⟩

/-- Naloga 3c, napaka: odgovor »0 in 5« ni množica vseh rešitev. -/
theorem n3c_napaka : (Finset.range 10).filter (fun d => 5 ∣ 40935 + 1000 * d) ≠ {0, 5} := by decide

/-- Naloga 3d (odgovor, ↔ med števkami): 5□ 214 = 50 214 + 1 000 · □ je deljivo s 3 natanko pri števkah
0, 3, 6, 9. -/
theorem n3d :
    (∀ d < 10, 3 ∣ 50214 + 1000 * d ↔ d = 0 ∨ d = 3 ∨ d = 6 ∨ d = 9) ∧
    (Finset.range 10).filter (fun d => 3 ∣ 50214 + 1000 * d) = {0, 3, 6, 9} := by
  refine ⟨fun d _ => by omega, by decide⟩

/-- Naloga 3d, »Z vsoto števk«: pravilo (3 ∣ n ↔ 3 ∣ vsota števk); 5 + 2 + 1 + 4 = 12, 3 ∣ 12; vsote števk
50 214, 53 214, 56 214, 59 214 so 12, 15, 18, 21. -/
theorem n3d_pot1 :
    (∀ n : ℕ, 3 ∣ n ↔ 3 ∣ (Nat.digits 10 n).sum) ∧ 5 + 2 + 1 + 4 = 12 ∧ 3 ∣ 12 ∧
    (Nat.digits 10 50214).sum = 12 ∧ (Nat.digits 10 53214).sum = 15 ∧
    (Nat.digits 10 56214).sum = 18 ∧ (Nat.digits 10 59214).sum = 21 := by
  refine ⟨fun n => Nat.three_dvd_iff n, rfl, by decide, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 3d, »Preizkus«: 53 214 : 3 = 17 738 in 59 214 : 3 = 19 738 (brez ostanka); 51 214 ima vsoto števk
13, ki ni deljiva s 3 (in 51 214 ni deljivo s 3). -/
theorem n3d_pot2 :
    53214 = 3 * 17738 ∧ 59214 = 3 * 19738 ∧ (Nat.digits 10 51214).sum = 13 ∧ ¬ 3 ∣ 13 ∧ ¬ 3 ∣ 51214 := by
  refine ⟨rfl, rfl, by norm_num, by decide, by decide⟩

/-- Naloga 3d, napaka: 50 214 ima vsoto števk 12 in je deljivo s 3 (števka 0 ustreza). -/
theorem n3d_napaka : (Nat.digits 10 50214).sum = 12 ∧ 3 ∣ 50214 := by
  refine ⟨by norm_num, by decide⟩

/-- Naloga 3e (odgovor, ↔ med števkami): 36 □81 = 36 081 + 100 · □ je deljivo z 9 natanko pri števkah 0 in 9.
Pot »Z vsoto števk«: pravilo (9 ∣ n ↔ 9 ∣ vsota števk), 3 + 6 + 8 + 1 = 18, vsoti števk 36 081 in 36 981 sta
18 in 27, obe deljivi z 9. -/
theorem n3e :
    (∀ d < 10, 9 ∣ 36081 + 100 * d ↔ d = 0 ∨ d = 9) ∧
    (Finset.range 10).filter (fun d => 9 ∣ 36081 + 100 * d) = {0, 9} ∧
    (∀ n : ℕ, 9 ∣ n ↔ 9 ∣ (Nat.digits 10 n).sum) ∧ 3 + 6 + 8 + 1 = 18 ∧
    (Nat.digits 10 36081).sum = 18 ∧ (Nat.digits 10 36981).sum = 27 ∧ 9 ∣ 18 ∧ 9 ∣ 27 ∧
    36081 + 100 * 9 = 36981 := by
  refine ⟨fun d _ => by omega, by decide, fun n => Nat.nine_dvd_iff n, rfl, by norm_num, by norm_num,
    by decide, by decide, rfl⟩

/-- Naloga 3e, napaka: le {9} ali le {0} ni množica vseh rešitev. -/
theorem n3e_napaka :
    (Finset.range 10).filter (fun d => 9 ∣ 36081 + 100 * d) ≠ {9} ∧
    (Finset.range 10).filter (fun d => 9 ∣ 36081 + 100 * d) ≠ {0} := by decide

/-- Naloga 3f (odgovor, ↔ med števkami): 15 27□ je deljivo z 2 in s 3 hkrati natanko pri števkah 0 in 6. -/
theorem n3f :
    (∀ d < 10, (2 ∣ 15270 + d ∧ 3 ∣ 15270 + d) ↔ d = 0 ∨ d = 6) ∧
    (Finset.range 10).filter (fun d => 2 ∣ 15270 + d ∧ 3 ∣ 15270 + d) = {0, 6} := by
  refine ⟨fun d _ => by omega, by decide⟩

/-- Naloga 3f, »Dva pogoja«: deljivost z 2 dá števke {0, 2, 4, 6, 8}; 1 + 5 + 2 + 7 = 15, deljivost s 3 dá
{0, 3, 6, 9}; presek je {0, 6} (15 270 in 15 276). -/
theorem n3f_pot1 :
    (Finset.range 10).filter (fun d => 2 ∣ 15270 + d) = {0, 2, 4, 6, 8} ∧ 1 + 5 + 2 + 7 = 15 ∧
    (Finset.range 10).filter (fun d => 3 ∣ 15270 + d) = {0, 3, 6, 9} ∧
    ({0, 2, 4, 6, 8} : Finset ℕ) ∩ {0, 3, 6, 9} = {0, 6} := by
  refine ⟨by decide, rfl, by decide, by decide⟩

/-- Naloga 3f, »Drugače: deljivost s 6«: 2 ∣ n ∧ 3 ∣ n ↔ 6 ∣ n; 15 270 : 6 = 2 545, 15 276 : 6 = 2 546;
15 272, 15 274 in 15 278 dajo ostanek. -/
theorem n3f_pot2 :
    (∀ n : ℕ, (2 ∣ n ∧ 3 ∣ n) ↔ 6 ∣ n) ∧ 15270 = 6 * 2545 ∧ 15276 = 6 * 2546 ∧
    15272 % 6 ≠ 0 ∧ 15274 % 6 ≠ 0 ∧ 15278 % 6 ≠ 0 := by
  refine ⟨fun n => by omega, rfl, rfl, by decide, by decide, by decide⟩

/-- Naloga 3f, napaka: 3 in 9 ustrezata le deljivosti s 3, 2, 4 in 8 le deljivosti z 2. -/
theorem n3f_napaka :
    (3 ∣ 15273 ∧ ¬ 2 ∣ 15273) ∧ (3 ∣ 15279 ∧ ¬ 2 ∣ 15279) ∧
    (2 ∣ 15272 ∧ ¬ 3 ∣ 15272) ∧ (2 ∣ 15274 ∧ ¬ 3 ∣ 15274) ∧ (2 ∣ 15278 ∧ ¬ 3 ∣ 15278) := by decide

/-! ## Naloga 4 -/

/-- Naloga 4, slika (SVG): merilo od x = 20 (0 kg) do x = 340 (1 kg) ima črtice na x = 20 + 16k, torej
(340 − 20) : 16 = 20 delov; puščice so na črticah k = 4 (biskvit, x = 84), 6 (palačinke, 116), 9 (pica, 164),
15 (kruh, 260), na sliki rešitve 12 (mafini, 212). -/
theorem n4_slika :
    (340 - 20) / 16 = 20 ∧ 20 + 16 * 4 = 84 ∧ 20 + 16 * 6 = 116 ∧ 20 + 16 * 9 = 164 ∧
    20 + 16 * 15 = 260 ∧ 20 + 16 * 12 = 212 := by decide

/-- Naloga 4a (odgovor in pot »Po korakih«): en del je 1 000 g : 20 = 50 g = 5 dag = 0,05 kg; biskvit
4 · 0,05 = 0,2 kg. -/
theorem n4a :
    (1000 : ℚ) / 20 = 50 ∧ (50 : ℚ) / 10 = 5 ∧ (50 : ℚ) / 1000 = 0.05 ∧ (4 : ℚ) * 0.05 = 0.2 := by norm_num

/-- Naloga 4a, napaka: z delom 0,1 kg bi bilo 4 · 0,1 = 0,4 kg; merilo ima 20 delov (1 : 20 = 0,05 ≠ 0,1). -/
theorem n4a_napaka : (4 : ℚ) * 0.1 = 0.4 ∧ (1 : ℚ) / 20 = 0.05 ∧ (0.05 : ℚ) ≠ 0.1 := by norm_num

/-- Naloga 4b (odgovor in pot »Po korakih«): en del je 50 g = 5 dag (1 dag = 10 g); palačinke 6 · 5 = 30 dag
= 300 g = 0,3 kg. -/
theorem n4b : (50 : ℚ) / 10 = 5 ∧ (6 : ℚ) * 5 = 30 ∧ (30 : ℚ) * 10 = 300 ∧ (300 : ℚ) / 1000 = 0.3 := by
  norm_num

/-- Naloga 4b, napaka: 300 je število gramov; dekagramov je 300 : 10 = 30. -/
theorem n4b_napaka : (300 : ℚ) / 10 = 30 ∧ (300 : ℚ) ≠ 30 := by norm_num

/-- Naloga 4c (odgovor pica, ↔): k delov po 50 g je 450 g natanko pri k = 9 (9. črtica); 450 : 50 = 9. -/
theorem n4c (k : ℚ) : (k * 50 = 450 ↔ k = 9) ∧ (450 : ℚ) / 50 = 9 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num⟩

/-- Naloga 4c, napaka: palačinke so 6 delov, to je 6 · 50 = 300 g ≠ 450 g. -/
theorem n4c_napaka : (6 : ℚ) * 50 = 300 ∧ (300 : ℚ) ≠ 450 := by norm_num

/-- Naloga 4d (odgovor kruh, ↔): k delov po 1/20 kg je 3/4 kg natanko pri k = 15. -/
theorem n4d_odgovor (k : ℚ) : k * (1 / 20) = 3 / 4 ↔ k = 15 := by
  constructor
  · intro h; linarith
  · intro h; rw [h]; norm_num

/-- Naloga 4d, »Z ulomkom merila«: četrtina je 20 : 4 = 5 delov, tri četrtine 3 · 5 = 15 delov. -/
theorem n4d_pot1 : 20 / 4 = 5 ∧ 3 * 5 = 15 := by decide

/-- Naloga 4d, »Drugače: v gramih«: 1 000 : 4 = 250, 3 · 250 = 750 g, 750 : 50 = 15. -/
theorem n4d_pot2 : (1000 : ℚ) / 4 = 250 ∧ (3 : ℚ) * 250 = 750 ∧ (3 : ℚ) / 4 * 1000 = 750 ∧ (750 : ℚ) / 50 = 15 := by
  norm_num

/-- Naloga 4d, napaka: 3/4 = 0,75, ne 3,4 in ne 0,34. -/
theorem n4d_napaka : (3 : ℚ) / 4 = 0.75 ∧ (3 : ℚ) / 4 ≠ 3.4 ∧ (3 : ℚ) / 4 ≠ 0.34 := by norm_num

/-- Naloga 4e (odgovor, ↔): k delov po 1/20 kg je 3/5 kg natanko pri k = 12; 3/5 kg = 0,6 kg = 600 g; 12. črtica
je med pico (9) in kruhom (15). -/
theorem n4e_odgovor (k : ℚ) :
    (k * (1 / 20) = 3 / 5 ↔ k = 12) ∧ (3 : ℚ) / 5 = 0.6 ∧ (0.6 : ℚ) * 1000 = 600 ∧ 9 < 12 ∧ 12 < 15 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num,
    by norm_num⟩

/-- Naloga 4e, »Z ulomkom merila«: petina je 20 : 5 = 4 deli, tri petine 3 · 4 = 12 delov. -/
theorem n4e_pot1 : 20 / 5 = 4 ∧ 3 * 4 = 12 := by decide

/-- Naloga 4e, »Drugače: v gramih«: 1 000 : 5 = 200 g, 3 · 200 = 600 g, 600 : 50 = 12 delov, tri dele pred
kruhom (15 − 12 = 3). -/
theorem n4e_pot2 :
    (1000 : ℚ) / 5 = 200 ∧ (3 : ℚ) * 200 = 600 ∧ (600 : ℚ) / 50 = 12 ∧ (15 : ℚ) - 12 = 3 := by norm_num

/-- Naloga 4e, napaka: 3. ali 5. črtica ni 12. (3 · 50 = 150 g in 5 · 50 = 250 g, ne 600 g). -/
theorem n4e_napaka : (3 : ℚ) * 50 ≠ 600 ∧ (5 : ℚ) * 50 ≠ 600 ∧ (12 : ℚ) * 50 = 600 := by norm_num

/-! ## Naloga 5

Model (cm, kvadratek 0,5 cm, izhodišče v spodnjem levem oglišču mreže): premica p skozi oglišče (0,5; 0,5) s
korakom 4 kvadratke desno, 3 navzgor, tj. (2; 1,5) cm: 6x − 8y + 1 = 0; A = (2,5; 4,5), B = (6,5; 1,5);
pravokotnica s skozi A: 8x + 6y = 47; vzporednica r skozi B: 6x − 8y = 27; N = (3,7; 2,9). -/

/-- Naloga 5, slika (SVG, kvadratek 12 enot, mreža od x = 10, y = 166): A = (70, 58) je (5, 9) kvadratkov,
B = (166, 130) je (13, 3) kvadratkov; p gre skozi (22, 154) = (1, 1) kvadratek in ima naklon 153 : 204 = 3 : 4;
nožišče N = (98,8; 96,4) je (7,4; 5,8) kvadratka. V cm (· 0,5): A = (2,5; 4,5), B = (6,5; 1,5),
N = (3,7; 2,9). -/
theorem n5_slika :
    ((70 : ℚ) - 10) / 12 = 5 ∧ ((166 : ℚ) - 58) / 12 = 9 ∧ ((166 : ℚ) - 10) / 12 = 13 ∧
    ((166 : ℚ) - 130) / 12 = 3 ∧ ((22 : ℚ) - 10) / 12 = 1 ∧ ((166 : ℚ) - 154) / 12 = 1 ∧
    ((163 : ℚ) - 10) * 4 = 3 * (214 - 10) ∧ ((163 : ℚ) - 154) * 4 = 3 * (22 - 10) ∧
    ((98.8 : ℚ) - 10) / 12 = 7.4 ∧ ((166 : ℚ) - 96.4) / 12 = 5.8 ∧
    (5 : ℚ) * 0.5 = 2.5 ∧ (9 : ℚ) * 0.5 = 4.5 ∧ (13 : ℚ) * 0.5 = 6.5 ∧ (3 : ℚ) * 0.5 = 1.5 ∧
    (7.4 : ℚ) * 0.5 = 3.7 ∧ (5.8 : ℚ) * 0.5 = 2.9 := by
  norm_num

/-- Premica p (v cm). -/
def naP (Q : ℝ × ℝ) : Prop := 6 * Q.1 - 8 * Q.2 + 1 = 0

/-- Pravokotnica s skozi A. -/
def naS (Q : ℝ × ℝ) : Prop := 8 * Q.1 + 6 * Q.2 = 47

/-- Vzporednica r skozi B. -/
def naR (Q : ℝ × ℝ) : Prop := 6 * Q.1 - 8 * Q.2 = 27

/-- Naloga 5 (uvod): p gre skozi oglišča (0,5 + 2k; 0,5 + 1,5k), ki si sledijo po 4 kvadratke (2 cm) desno in
3 kvadratke (1,5 cm) navzgor, za vsak k. -/
theorem n5_premica_p (k : ℝ) : naP (0.5 + 2 * k, 0.5 + 1.5 * k) := by
  unfold naP; ring_nf

/-- Naloga 5a (odgovor): s gre skozi A = (2,5; 4,5), seka p v natanko eni točki N = (3,7; 2,9) in je pravokotna
na p (normali (8, 6) in (6, −8) imata skalarni produkt 0). -/
theorem n5a :
    naS (2.5, 4.5) ∧ naS (3.7, 2.9) ∧ naP (3.7, 2.9) ∧
    (∀ Q : ℝ × ℝ, naS Q ∧ naP Q ↔ Q = (3.7, 2.9)) ∧ (8 : ℝ) * 6 + 6 * (-8) = 0 := by
  unfold naS naP
  refine ⟨by norm_num, by norm_num, by norm_num, fun Q => ⟨fun ⟨h1, h2⟩ => ?_, fun h => ?_⟩, by norm_num⟩
  · exact Prod.ext (by simp only; linarith) (by simp only; linarith)
  · subst h; norm_num

/-- Naloga 5a, »Drugače: s pravim kotom geotrikotnika«: kraka pravega kota sta pravokotna; smer p je (4, 3),
smer s je (3, −4), 4 · 3 + 3 · (−4) = 0. -/
theorem n5a_pot2 : (4 : ℝ) * 3 + 3 * (-4) = 0 := by norm_num

/-- Naloga 5b (odgovor): r gre skozi B = (6,5; 1,5), ima isto smer kot p in nima s p nobene skupne točke. -/
theorem n5b : naR (6.5, 1.5) ∧ (∀ Q : ℝ × ℝ, ¬ (naP Q ∧ naR Q)) := by
  unfold naR naP
  refine ⟨by norm_num, fun Q ⟨h1, h2⟩ => by linarith⟩

/-- Naloga 5b, »Drugače: z vzporednimi črtami«: tudi r gre od B po 4 kvadratke (2 cm) desno in 3 kvadratke
(1,5 cm) navzgor: B + (2; 1,5) = (8,5; 3) je na r. -/
theorem n5b_pot2 (k : ℝ) : naR (6.5 + 2 * k, 1.5 + 1.5 * k) ∧ naR (8.5, 3) := by
  unfold naR; constructor
  · ring_nf
  · norm_num

/-- Naloga 5c (odgovor in pot »Z merjenjem«): |AB| = √((6,5 − 2,5)² + (1,5 − 4,5)²) = 5 cm; 8 kvadratkov desno
je 8 · 0,5 = 4 cm, 6 navzdol 6 · 0,5 = 3 cm; 4 < 5, 3 < 5 in 5 < 4 + 3 = 7. -/
theorem n5c :
    Real.sqrt ((6.5 - 2.5) ^ 2 + (1.5 - 4.5) ^ 2) = 5 ∧ (8 : ℝ) * 0.5 = 4 ∧ (6 : ℝ) * 0.5 = 3 ∧
    (4 : ℝ) < 5 ∧ (3 : ℝ) < 5 ∧ (5 : ℝ) < 4 + 3 ∧ (4 : ℝ) + 3 = 7 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  rw [show ((6.5 : ℝ) - 2.5) ^ 2 + (1.5 - 4.5) ^ 2 = 5 ^ 2 by norm_num]
  exact Real.sqrt_sq (by norm_num)

/-- Naloga 5c, splošno pravilo iz poti: poševna daljica s katetama a, b > 0 je daljša od obeh in krajša od
njune vsote: max(a, b) < √(a² + b²) < a + b. -/
theorem n5c_posevna (a b : ℝ) (ha : 0 < a) (hb : 0 < b) :
    a < Real.sqrt (a ^ 2 + b ^ 2) ∧ b < Real.sqrt (a ^ 2 + b ^ 2) ∧ Real.sqrt (a ^ 2 + b ^ 2) < a + b := by
  refine ⟨?_, ?_, ?_⟩
  · rw [Real.lt_sqrt ha.le]; nlinarith
  · rw [Real.lt_sqrt hb.le]; nlinarith
  · rw [Real.sqrt_lt' (by linarith)]; nlinarith

/-- Predpostavke trditve `n5c_posevna` se dajo izpolniti (a = 4, b = 3). -/
example : (0 : ℝ) < 4 ∧ (0 : ℝ) < 3 := by norm_num

/-- Naloga 5d (odgovor in pot »Iz načrtovanja«): s ⊥ p in s ⊥ r (normale (8, 6) · (6, −8) = 0), r ∥ p (ista
normala, brez skupne točke), A ∈ s, B ∉ p (B je pod p: 6x − 8y + 1 > 0, na p pri x = 6,5 je y = 5 > 1,5). -/
theorem n5d :
    (8 : ℝ) * 6 + 6 * (-8) = 0 ∧ (∀ Q : ℝ × ℝ, ¬ (naP Q ∧ naR Q)) ∧ naS (2.5, 4.5) ∧
    ¬ naP (6.5, 1.5) ∧ 6 * (6.5 : ℝ) - 8 * 1.5 + 1 > 0 ∧ naP (6.5, 5) ∧ (1.5 : ℝ) < 5 := by
  refine ⟨by norm_num, n5b.2, n5a.1, ?_, by norm_num, ?_, by norm_num⟩
  · unfold naP; norm_num
  · unfold naP; norm_num

/-- Naloga 5d, »s ⊥ p in r ∥ p ⟹ s ⊥ r«: če je smer u pravokotna na v in je w = c · v, je u pravokotna na w. -/
theorem n5d_pravilo (u v w : ℝ × ℝ) (c : ℝ) (h : u.1 * v.1 + u.2 * v.2 = 0) (hw : w = (c * v.1, c * v.2)) :
    u.1 * w.1 + u.2 * w.2 = 0 := by
  subst hw; simp only
  linear_combination c * h

/-- Predpostavke trditve `n5d_pravilo` se dajo izpolniti (u = (3, −4), v = w = (4, 3), c = 1). -/
example : ((3 : ℝ), (-4 : ℝ)).1 * ((4 : ℝ), (3 : ℝ)).1 + ((3 : ℝ), (-4 : ℝ)).2 * ((4 : ℝ), (3 : ℝ)).2 = 0 ∧
    ((4 : ℝ), (3 : ℝ)) = (1 * ((4 : ℝ), (3 : ℝ)).1, 1 * ((4 : ℝ), (3 : ℝ)).2) := by norm_num

/-- Naloga 5e (odgovor in pot »S pravokotnico«): N = (3,7; 2,9) je na p in na s, AN = (1,2; −1,6) je
pravokotna na smer (4, 3) premice p, |AN| = 2 cm (= 4 kvadratki · 0,5 cm); za vsako točko Q na p je |AQ| ≥ 2,
za Q ≠ N pa |AQ| > 2 (vsaka druga daljica je daljša). -/
theorem n5e :
    naP (3.7, 2.9) ∧ naS (3.7, 2.9) ∧ (1.2 : ℝ) * 4 + (-1.6) * 3 = 0 ∧
    Real.sqrt ((3.7 - 2.5) ^ 2 + (2.9 - 4.5) ^ 2) = 2 ∧ (4 : ℝ) * 0.5 = 2 ∧
    (∀ Q : ℝ × ℝ, naP Q → 2 ≤ Real.sqrt ((Q.1 - 2.5) ^ 2 + (Q.2 - 4.5) ^ 2)) ∧
    (∀ Q : ℝ × ℝ, naP Q → Q ≠ (3.7, 2.9) → 2 < Real.sqrt ((Q.1 - 2.5) ^ 2 + (Q.2 - 4.5) ^ 2)) := by
  have kljuc : ∀ Q : ℝ × ℝ, naP Q →
      100 * ((Q.1 - 2.5) ^ 2 + (Q.2 - 4.5) ^ 2) = 400 + (8 * (Q.1 - 2.5) + 6 * (Q.2 - 4.5)) ^ 2 := by
    intro Q h; unfold naP at h
    have h' : 6 * (Q.1 - 2.5) - 8 * (Q.2 - 4.5) = 20 := by linarith
    have e : 100 * ((Q.1 - 2.5) ^ 2 + (Q.2 - 4.5) ^ 2) =
        (6 * (Q.1 - 2.5) - 8 * (Q.2 - 4.5)) ^ 2 + (8 * (Q.1 - 2.5) + 6 * (Q.2 - 4.5)) ^ 2 := by ring
    rw [e, h']; norm_num
  refine ⟨n5a.2.2.1, n5a.2.1, by norm_num, ?_, by norm_num, fun Q h => ?_, fun Q h hQ => ?_⟩
  · rw [show ((3.7 : ℝ) - 2.5) ^ 2 + (2.9 - 4.5) ^ 2 = 2 ^ 2 by norm_num]
    exact Real.sqrt_sq (by norm_num)
  · have k := kljuc Q h
    rw [Real.le_sqrt (by norm_num) (by positivity)]
    nlinarith [sq_nonneg (8 * (Q.1 - 2.5) + 6 * (Q.2 - 4.5))]
  · have k := kljuc Q h
    rw [Real.lt_sqrt (by norm_num)]
    by_contra hc
    push Not at hc
    have h0 : (8 * (Q.1 - 2.5) + 6 * (Q.2 - 4.5)) ^ 2 = 0 := by
      nlinarith [sq_nonneg (8 * (Q.1 - 2.5) + 6 * (Q.2 - 4.5))]
    have h1 : 8 * (Q.1 - 2.5) + 6 * (Q.2 - 4.5) = 0 := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h0
    unfold naP at h
    exact hQ (Prod.ext (by simp only; linarith) (by simp only; linarith))

/-- Predpostavke v `n5e` se dajo izpolniti: Q = (0,5; 0,5) je na p in ni N. -/
example : naP (0.5, 0.5) ∧ ((0.5 : ℝ), (0.5 : ℝ)) ≠ (3.7, 2.9) := by
  unfold naP; refine ⟨by norm_num, fun h => ?_⟩
  have := congrArg Prod.fst h; norm_num at this

/-! ## Naloga 6 -/

/-- Naloga 6a, »Drugače: pravi kot in še 35°« in preverjanje: 125° = 90° + 35°, 125° > 90°. -/
theorem n6a : (125 : ℤ) = 90 + 35 ∧ (90 : ℤ) < 125 := by norm_num

/-- Naloga 6a, napaka: napačna lestvica dá 180° − 125° = 55°, kar je manj od pravega kota. -/
theorem n6a_napaka : (180 : ℤ) - 125 = 55 ∧ (55 : ℤ) < 90 := by norm_num

/-- Naloga 6b (odgovor topi kot): 90° < 125° < 180°; ni ostri (ni < 90°), ni pravi (≠ 90°), ni iztegnjeni
(≠ 180°). -/
theorem n6b :
    (90 : ℤ) < 125 ∧ (125 : ℤ) < 180 ∧ ¬ (125 : ℤ) < 90 ∧ (125 : ℤ) ≠ 90 ∧ (125 : ℤ) ≠ 180 := by norm_num

/-- Naloga 6c (odgovor, v minutah): 47°38′ + 65°49′ = 113°27′ (27′ < 60′). -/
theorem n6c_odgovor : (47 * 60 + 38) + (65 * 60 + 49) = 113 * 60 + 27 ∧ 27 < 60 := by decide

/-- Naloga 6c, »Po korakih«: 47 + 65 = 112, 38 + 49 = 87, 87′ = 60′ + 27′ = 1°27′, 112°87′ = 113°27′. -/
theorem n6c_pot :
    47 + 65 = 112 ∧ 38 + 49 = 87 ∧ 87 = 60 + 27 ∧
    (47 * 60 + 38) + (65 * 60 + 49) = 113 * 60 + 27 := by
  refine ⟨rfl, rfl, rfl, ?_⟩
  calc (47 * 60 + 38) + (65 * 60 + 49) = (47 + 65) * 60 + (38 + 49) := by ring
    _ = 112 * 60 + 87 := by norm_num
    _ = 112 * 60 + (60 + 27) := by norm_num
    _ = 113 * 60 + 27 := by norm_num

/-- Naloga 6c, napaka: 112°87′ ni dokončan zapis (87 ≥ 60); 87′ = 87/60 ° = 1,45°, ne 0,87°. -/
theorem n6c_napaka : 60 ≤ 87 ∧ (87 : ℚ) / 60 = 1.45 ∧ (87 : ℚ) / 60 ≠ 0.87 := by norm_num

/-- Naloga 6d (odgovor, v minutah): 102°15′ − 58°47′ = 43°28′. -/
theorem n6d_odgovor : ((102 : ℤ) * 60 + 15) - (58 * 60 + 47) = 43 * 60 + 28 := by norm_num

/-- Naloga 6d, »S prehodom čez stopinjo«: 15 < 47; 102°15′ = 101°75′ (15 + 60 = 75); 101 − 58 = 43,
75 − 47 = 28; preizkus 43°28′ + 58°47′ = 101°75′ = 102°15′ (43 + 58 = 101, 28 + 47 = 75). -/
theorem n6d_pot :
    15 < 47 ∧ 15 + 60 = 75 ∧ 102 * 60 + 15 = 101 * 60 + 75 ∧ 101 - 58 = 43 ∧ 75 - 47 = 28 ∧
    ((102 : ℤ) * 60 + 15) - (58 * 60 + 47) = 43 * 60 + 28 ∧
    43 + 58 = 101 ∧ 28 + 47 = 75 ∧ (43 * 60 + 28) + (58 * 60 + 47) = 101 * 60 + 75 := by
  refine ⟨by decide, rfl, rfl, rfl, rfl, ?_, rfl, rfl, by decide⟩
  calc ((102 : ℤ) * 60 + 15) - (58 * 60 + 47) = (101 * 60 + 75) - (58 * 60 + 47) := by norm_num
    _ = (101 - 58) * 60 + (75 - 47) := by ring
    _ = 43 * 60 + 28 := by norm_num

/-- Naloga 6d, napaka: 47 − 15 = 32 in 102 − 58 = 44 dá 44°32′, kar ni rezultat (preizkus
44°32′ + 58°47′ = 103°19′ ≠ 102°15′). -/
theorem n6d_napaka :
    47 - 15 = 32 ∧ 102 - 58 = 44 ∧ ((102 : ℤ) * 60 + 15) - (58 * 60 + 47) ≠ 44 * 60 + 32 ∧
    (44 * 60 + 32) + (58 * 60 + 47) = 103 * 60 + 19 := by decide

/-! ## Naloga 7 -/

/-- Število trikotnikov na n-ti sliki (pravilo s prvih treh slik). -/
def trikotnikov (n : ℕ) : ℕ := n + 2

/-- Število nepobarvanih (na lihih mestih 1, 3, …) na n-ti sliki. -/
def nepobarvanih (n : ℕ) : ℕ := ((Finset.Icc 1 (trikotnikov n)).filter (fun i => i % 2 = 1)).card

/-- Število pobarvanih (na sodih mestih 2, 4, …) na n-ti sliki. -/
def pobarvanih (n : ℕ) : ℕ := ((Finset.Icc 1 (trikotnikov n)).filter (fun i => i % 2 = 0)).card

/-- Število skupnih stranic: en stik med i-tim in (i + 1)-tim trikotnikom za i = 1 … m − 1. -/
def skupnih (n : ℕ) : ℕ := (Finset.Icc 1 (trikotnikov n - 1)).card

/-- Naloga 7a (odgovor in pot »Poišči pravilo«): slike 1, 2, 3 imajo 3, 4, 5 trikotnikov; 4. slika
4 + 2 = 6; barve po mestih 1 … 6: nepobarvan, pobarvan, … , šesti pobarvan (pobarvan = sodo mesto). -/
theorem n7a :
    trikotnikov 1 = 3 ∧ trikotnikov 2 = 4 ∧ trikotnikov 3 = 5 ∧ trikotnikov 4 = 4 + 2 ∧ 4 + 2 = 6 ∧
    (List.range' 1 6).map (fun i => decide (i % 2 = 0)) = [false, true, false, true, false, true] := by
  decide

/-- Naloga 7a, napaka: 7 trikotnikov bi pomenilo dva dodana; med slikama se doda en (5 + 1 = 6 ≠ 7). -/
theorem n7a_napaka : trikotnikov 4 - trikotnikov 3 = 1 ∧ trikotnikov 4 ≠ 7 := by decide

/-- Naloga 7b (odgovor in pot »S pravilom«): 9. slika ima 9 + 2 = 11 trikotnikov; 6 nepobarvanih (liha mesta)
in 5 pobarvanih (soda mesta), 6 + 5 = 11. -/
theorem n7b : trikotnikov 9 = 11 ∧ nepobarvanih 9 = 6 ∧ pobarvanih 9 = 5 ∧ 6 + 5 = 11 := by decide

/-- Naloga 7b, napaka: »9 in 9« ni pravilno (9 + 9 = 18 ≠ 11). -/
theorem n7b_napaka : nepobarvanih 9 ≠ 9 ∧ pobarvanih 9 ≠ 9 ∧ 9 + 9 ≠ trikotnikov 9 := by decide

/-- Naloga 7c (odgovor 26 in pot »S pravilom«): 25. slika ima 25 + 2 = 27 trikotnikov, skupnih stranic je
27 − 1 = 26; preizkus: 3, 4, 5 trikotnikov imajo 2, 3, 4 skupne stranice. -/
theorem n7c :
    trikotnikov 25 = 27 ∧ skupnih 25 = 26 ∧ 27 - 1 = 26 ∧ skupnih 1 = 2 ∧ skupnih 2 = 3 ∧ skupnih 3 = 4 := by
  decide

/-- Naloga 7c, napaka: 27 je število trikotnikov, ne stikov. -/
theorem n7c_napaka : skupnih 25 ≠ 27 := by decide

/-- Naloga 7d (odgovor 13 in pot »S pravilom«): 27 trikotnikov (liho), pobarvanih (27 − 1) : 2 = 13,
nepobarvanih 13 + 1 = 14, preizkus 13 + 14 = 27. -/
theorem n7d :
    trikotnikov 25 = 27 ∧ 27 % 2 = 1 ∧ pobarvanih 25 = 13 ∧ (27 - 1) / 2 = 13 ∧ (27 - 1) % 2 = 0 ∧
    nepobarvanih 25 = 13 + 1 ∧ 13 + 14 = 27 := by decide

/-- Naloga 7d, napaka: 27 : 2 = 13,5 ni celo število; pobarvanih ni 14. -/
theorem n7d_napaka : (27 : ℚ) / 2 = 13.5 ∧ ¬ (2 ∣ 27) ∧ pobarvanih 25 ≠ 14 := by
  refine ⟨by norm_num, by decide, by decide⟩

/-- Naloga 7e (odgovor 25 in pot »S pravilom«): 48. slika ima 48 + 2 = 50 trikotnikov (sodo), 50 : 2 = 25
nepobarvanih in 25 pobarvanih; primerjava z 2. sliko: 4 trikotniki, 2 in 2. -/
theorem n7e :
    trikotnikov 48 = 50 ∧ 50 % 2 = 0 ∧ 50 / 2 = 25 ∧ nepobarvanih 48 = 25 ∧ pobarvanih 48 = 25 ∧
    trikotnikov 2 = 4 ∧ nepobarvanih 2 = 2 ∧ pobarvanih 2 = 2 := by decide

/-- Naloga 7e, napaka: 48 : 2 = 24 ≠ 25. -/
theorem n7e_napaka : 48 / 2 = 24 ∧ nepobarvanih 48 ≠ 24 := by decide

/-! ## Naloga 8 -/

/-- Naloga 8a (odgovor, ↔): obhod vrta se sklene, vodoravno |AB| = |GH| + |FE| + |DC| in navpično
|BC| + |DE| = |HA| + |GF|; s 24 = 9 + 7 + c in 7 + 6 = 10 + f natanko c = |CD| = 8 m, f = |FG| = 3 m. -/
theorem n8a_odgovor (c f : ℚ) : (24 = 9 + 7 + c ∧ 7 + 6 = 10 + f) ↔ (c = 8 ∧ f = 3) := by
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Naloga 8a, »Po korakih«: |CD| = 24 − 9 − 7 = 8; |BC| + |DE| = 7 + 6 = 13; |FG| = 13 − 10 = 3. -/
theorem n8a_pot1 : (24 : ℚ) - 9 - 7 = 8 ∧ (7 : ℚ) + 6 = 13 ∧ (13 : ℚ) - 10 = 3 := by norm_num

/-- Naloga 8a, »Drugače: s premiki stranic«: 9 + 7 + 8 = 24 in 10 + 3 = 7 + 6. -/
theorem n8a_pot2 : (9 : ℚ) + 7 + 8 = 24 ∧ (10 : ℚ) + 3 = 7 + 6 := by norm_num

/-- Oglišča vrta s skice (v metrih). -/
def oA : ℤ × ℤ := (0, 0)
def oB : ℤ × ℤ := (24, 0)
def oC : ℤ × ℤ := (24, 7)
def oD : ℤ × ℤ := (16, 7)
def oE : ℤ × ℤ := (16, 13)
def oF : ℤ × ℤ := (9, 13)
def oG : ℤ × ℤ := (9, 10)
def oH : ℤ × ℤ := (0, 10)

/-- Naloga 8, oglišča A(0, 0), B(24, 0), C(24, 7), D(16, 7), E(16, 13), F(9, 13), G(9, 10), H(0, 10): stranice
so izmenično vodoravne in navpične (sosednje pravokotne) in merijo |AB| = 24, |BC| = 7, |CD| = 8, |DE| = 6,
|EF| = 7, |FG| = 3, |GH| = 9, |HA| = 10; te dolžine izpolnjujejo obe enačbi iz `n8a_odgovor`
(|AB| = |GH| + |FE| + |CD| s c = |CD| = 8 in |BC| + |DE| = |HA| + |FG| s f = |FG| = 3). -/
theorem n8_oglisca :
    (oB.1 - oA.1 = 24 ∧ oB.2 - oA.2 = 0) ∧ (oC.1 - oB.1 = 0 ∧ oC.2 - oB.2 = 7) ∧
    (oC.1 - oD.1 = 8 ∧ oD.2 - oC.2 = 0) ∧ (oE.1 - oD.1 = 0 ∧ oE.2 - oD.2 = 6) ∧
    (oE.1 - oF.1 = 7 ∧ oF.2 - oE.2 = 0) ∧ (oF.1 - oG.1 = 0 ∧ oF.2 - oG.2 = 3) ∧
    (oG.1 - oH.1 = 9 ∧ oG.2 - oH.2 = 0) ∧ (oH.1 - oA.1 = 0 ∧ oH.2 - oA.2 = 10) ∧
    (oB.1 - oA.1 = (oG.1 - oH.1) + (oE.1 - oF.1) + (oC.1 - oD.1) ∧
      (oC.2 - oB.2) + (oE.2 - oD.2) = (oH.2 - oA.2) + (oF.2 - oG.2)) ∧
    ((24 : ℚ) = 9 + 7 + (oC.1 - oD.1 : ℤ) ∧ (7 : ℚ) + 6 = 10 + (oF.2 - oG.2 : ℤ)) := by
  norm_num [oA, oB, oC, oD, oE, oF, oG, oH]

/-- Naloga 8b (odgovor in pot »Seštej vse stranice«): 24 + 7 + 8 + 6 + 7 + 3 + 9 + 10 = 74 m. -/
theorem n8b_pot1 : 24 + 7 + 8 + 6 + 7 + 3 + 9 + 10 = 74 := by decide

/-- Naloga 8b, »Drugače: kot pravokotnik«: vodoravne 2 · 24 = 48 (24 + 9 + 7 + 8 = 48), navpične
2 · 13 = 26 (7 + 6 + 3 + 10 = 26), 48 + 26 = 74. -/
theorem n8b_pot2 :
    2 * 24 = 48 ∧ 24 + 9 + 7 + 8 = 48 ∧ 2 * 13 = 26 ∧ 7 + 6 + 3 + 10 = 26 ∧ 48 + 26 = 74 := by decide

/-- Naloga 8b, napaka: brez |CD| in |FG| je 24 + 7 + 6 + 7 + 9 + 10 = 63 ≠ 74. -/
theorem n8b_napaka : 24 + 7 + 6 + 7 + 9 + 10 = 63 ∧ 63 ≠ 74 := by decide

/-- Vrt kot unija treh (polodprtih) pravokotnikov iz razdelitve z navpičnima črtama skozi G in D. -/
def vrt : Set (ℝ × ℝ) :=
  (Set.Ico 0 9 ×ˢ Set.Ico 0 10) ∪ (Set.Ico 9 16 ×ˢ Set.Ico 0 13) ∪ (Set.Ico 16 24 ×ˢ Set.Ico 0 7)

open MeasureTheory in
/-- Naloga 8c (odgovor): ploščina (mera) vrta je 237 m² = 9 · 10 + 7 · 13 + 8 · 7. -/
theorem n8c_odgovor : volume vrt = 237 := by
  have hP : ∀ a b c d : ℝ, a ≤ b → c ≤ d →
      volume (Set.Ico a b ×ˢ Set.Ico c d) = ENNReal.ofReal ((b - a) * (d - c)) := by
    intro a b c d hab hcd
    rw [Measure.volume_eq_prod, Measure.prod_prod, Real.volume_Ico, Real.volume_Ico,
      ← ENNReal.ofReal_mul (by linarith)]
  unfold vrt
  rw [measure_union, measure_union, hP _ _ _ _ (by norm_num) (by norm_num),
    hP _ _ _ _ (by norm_num) (by norm_num), hP _ _ _ _ (by norm_num) (by norm_num),
    ← ENNReal.ofReal_add (by norm_num) (by norm_num), ← ENNReal.ofReal_add (by norm_num) (by norm_num)]
  · norm_num
  · exact Set.disjoint_prod.mpr (Or.inl Set.Ico_disjoint_Ico_same)
  · exact measurableSet_Ico.prod measurableSet_Ico
  · refine Set.disjoint_union_left.mpr ⟨?_, ?_⟩
    · exact Set.disjoint_prod.mpr (Or.inl (Set.Ico_disjoint_Ico.mpr (by norm_num)))
    · exact Set.disjoint_prod.mpr (Or.inl Set.Ico_disjoint_Ico_same)
  · exact measurableSet_Ico.prod measurableSet_Ico

/-- Naloga 8c, »Razdelitev na tri pravokotnike«: 9 · 10 = 90, 7 · 13 = 91, 8 · 7 = 56, 90 + 91 + 56 = 237. -/
theorem n8c_pot1 : 9 * 10 + 7 * 13 + 8 * 7 = 237 := by
  calc 9 * 10 + 7 * 13 + 8 * 7 = 90 + 91 + 56 := by norm_num
    _ = 237 := by norm_num

/-- Naloga 8c, »Drugače: velik pravokotnik minus izrezi«: 24 · 13 = 312, 8 · 6 = 48, 9 · 3 = 27,
312 − 48 − 27 = 237. -/
theorem n8c_pot2 : (24 : ℤ) * 13 - 8 * 6 - 9 * 3 = 237 := by
  calc (24 : ℤ) * 13 - 8 * 6 - 9 * 3 = 312 - 48 - 27 := by norm_num
    _ = 237 := by norm_num

/-- Naloga 8c, »Preizkus: vodoravna razdelitev«: spodaj 24 · 7 = 168; srednji pas širok 9 + 7 = 16, visok
6 − 3 = 3 (od y = 7 do y = 10), 16 · 3 = 48; zgoraj 7 · 3 = 21; 168 + 48 + 21 = 237. -/
theorem n8c_pot3 :
    (9 : ℤ) + 7 = 16 ∧ (6 : ℤ) - 3 = 3 ∧ (10 : ℤ) - 7 = 3 ∧ (13 : ℤ) - 10 = 3 ∧
    (24 : ℤ) * 7 + (9 + 7) * (6 - 3) + 7 * 3 = 237 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  calc (24 : ℤ) * 7 + (9 + 7) * (6 - 3) + 7 * 3 = 168 + 16 * 3 + 21 := by norm_num
    _ = 168 + 48 + 21 := by norm_num
    _ = 237 := by norm_num

/-- Naloga 8c, neodvisen preizkus z oglišči (Gaussova formula, kot račun): vsota xᵢyᵢ₊₁ − xᵢ₊₁yᵢ po obhodu
A … H je 474 = 2 · 237. -/
theorem n8c_gauss :
    ((0 : ℤ) * 0 - 24 * 0) + (24 * 7 - 24 * 0) + (24 * 7 - 16 * 7) + (16 * 13 - 16 * 7) +
      (16 * 13 - 9 * 13) + (9 * 10 - 9 * 13) + (9 * 10 - 0 * 10) + (0 * 0 - 0 * 10) = 2 * 237 := by
  norm_num

/-- Naloga 8c, napaka: 24 · 13 = 312 ≠ 237 (vrt ni pravokotnik). -/
theorem n8c_napaka : 24 * 13 = 312 ∧ 312 ≠ 237 := by decide

/-! ## Naloga 9 -/

/-- Naloga 9a (odgovor, pot »Po korakih«): 3 · 16 = 48, 5 · 12 = 60, 196 − 48 + 60 = 208. -/
theorem n9a_pot1 : (3 : ℤ) * 16 = 48 ∧ (5 : ℤ) * 12 = 60 ∧ (196 : ℤ) - 3 * 16 + 5 * 12 = 208 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  calc (196 : ℤ) - 3 * 16 + 5 * 12 = 196 - 48 + 60 := by norm_num
    _ = 208 := by norm_num

/-- Naloga 9a, »Drugače: najprej sprememba«: 60 − 48 = 12, 196 + 12 = 208. -/
theorem n9a_pot2 : (60 : ℤ) - 48 = 12 ∧ (196 : ℤ) + 12 = 208 := by norm_num

/-- Naloga 9a, napaka: 196 − 3 + 5 = 198 ≠ 208 (šteje poglavja namesto strani). -/
theorem n9a_napaka : (196 : ℤ) - 3 + 5 = 198 ∧ (198 : ℤ) ≠ 208 := by norm_num

/-- Naloga 9b (odgovor, ↔): s ceno platnic P in ceno strani c je nova izdaja (P + 208c) za 1,56 € dražja od
stare (P + 196c) natanko tedaj, ko je c = 0,13 € (13 centov). -/
theorem n9b_odgovor (P c : ℚ) : (P + 208 * c) - (P + 196 * c) = 1.56 ↔ c = 0.13 := by
  constructor <;> intro h <;> linarith

/-- Naloga 9b, »Po korakih«: 208 − 196 = 12; 1,56 : 12 = 0,13 (pisno: 1 < 12, celih 0; 15 = 12 · 1 + 3;
36 = 12 · 3): 1,56 = 12 · 0,1 + 0,36, 0,36 : 12 = 0,03, 0,1 + 0,03 = 0,13. -/
theorem n9b_pot1 :
    (208 : ℚ) - 196 = 12 ∧ 1 < 12 ∧ 15 = 12 * 1 + 3 ∧ 36 = 12 * 3 ∧ (1.56 : ℚ) / 12 = 0.13 := by
  refine ⟨by norm_num, by norm_num, rfl, rfl, ?_⟩
  calc (1.56 : ℚ) / 12 = (12 * 0.1 + 0.36) / 12 := by norm_num
    _ = 0.1 + 0.36 / 12 := by ring
    _ = 0.1 + 0.03 := by norm_num
    _ = 0.13 := by norm_num

/-- Naloga 9b, »Drugače: v centih«: 1,56 € = 156 centov, 156 : 12 = 13 (12 · 13 = 156), 13 centov = 0,13 €. -/
theorem n9b_pot2 :
    (1.56 : ℚ) * 100 = 156 ∧ 156 / 12 = 13 ∧ 156 % 12 = 0 ∧ 12 * 13 = 156 ∧ (13 : ℚ) / 100 = 0.13 := by
  refine ⟨by norm_num, rfl, rfl, rfl, by norm_num⟩

/-- Naloga 9b, napaka: 1,56 : 5 = 0,312 in 1,56 : 60 = 0,026 nista 0,13. -/
theorem n9b_napaka : (1.56 : ℚ) / 5 = 0.312 ∧ (1.56 : ℚ) / 60 = 0.026 ∧ (0.312 : ℚ) ≠ 0.13 ∧
    (0.026 : ℚ) ≠ 0.13 := by norm_num

/-- Naloga 9c (odgovor »Ne, ker ne poznaš cene platnic«): podatki (podražitev 1,56 €) ne določijo cene nove
izdaje: za vsako vrednost v obstajata P in c, ki ustrezata podatkom, a cena P + 208c ni v. Pri c = 0,13 je
cena P + 27,04 (208 · 0,13 = 27,04, prva utemeljitev pozabi P); cena nove izdaje je stara cena + 1,56 €. -/
theorem n9c :
    (∀ v : ℚ, ∃ P c : ℚ, (P + 208 * c) - (P + 196 * c) = 1.56 ∧ P + 208 * c ≠ v) ∧
    (208 : ℚ) * 0.13 = 27.04 ∧ (∀ P : ℚ, P + 208 * 0.13 = P + 27.04) ∧
    (∀ P c : ℚ, (P + 208 * c) - (P + 196 * c) = 1.56 → P + 208 * c = (P + 196 * c) + 1.56) := by
  refine ⟨fun v => ⟨v - 27.04 + 1, 0.13, by norm_num, by intro h; linarith⟩, by norm_num, fun P => by norm_num,
    fun P c h => by linarith⟩

/-- Naloga 9d (odgovor »število poglavij stare izdaje«): nova izdaja ima k − 3 + 5 = k + 2 poglavij (5 − 3 = 2),
kar brez k ni določeno; npr. pri k = 11 je 11 − 3 + 5 = 13. Napaka: 196 : 16 = 12,25 ni celo število
(196 = 16 · 12 + 4). -/
theorem n9d :
    (∀ k : ℤ, k - 3 + 5 = k + 2) ∧ (5 : ℤ) - 3 = 2 ∧ (∀ v : ℤ, ∃ k : ℤ, k - 3 + 5 ≠ v) ∧
    (11 : ℤ) - 3 + 5 = 13 ∧ (196 : ℚ) / 16 = 12.25 ∧ 196 = 16 * 12 + 4 := by
  refine ⟨fun k => by ring, by norm_num, fun v => ⟨v, by omega⟩, by norm_num, by norm_num, rfl⟩

end Evklid.Pole.NPZ6_MAT_2024_redni
