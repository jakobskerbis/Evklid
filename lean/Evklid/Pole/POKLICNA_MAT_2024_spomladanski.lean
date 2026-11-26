/-
vir: content/exam-papers/POKLICNA-MAT-2024-spomladanski.json
sha256: 4085885223e863e96dec2f4c20bb19bc4ab20213d60aacc86691d738501e8735
Ni v Leanu: vse skice, risbe in grafi v zvezek (A3 skica romba, B1b graf polinoma), branje s slik (A10, A11)
in navodila za računalo (DEG/RAD, tipka eˣ) niso trditve. A3 obrazca S = a·v za romb in »višina je kateta
nasproti α v trikotniku AD'D« sta podatek (Mathlib nima ploščine lika); dokazano je, da v pravokotnem trikotniku
velja sin α · hipotenuza = nasprotna kateta (`n3_sin_v_trikotniku`), in vsi računi. A4 obrestovanje je model
Gₙ = 6500·1,032ⁿ (definicija iz rešitve); »obresti le enkrat na leto« je zapisano kot n ∈ ℕ. A6 verjetnost je
ugodni : vsi izidi (definicija iz rešitve), izid je permutacija `Equiv.Perm (Fin 4)` (plezalka ↦ mesto; 0 Ajda,
1 Brina, 2 Lara, 3 Vita; mesto 0 je prvo). A10 opis vej grafa ob asimptotah (»poljubno globoko/visoko«, limite)
ni dokazan; dokazana je zaloga vrednosti ℝ, ki to zajame. B1b obnašanje grafa v ±∞ (limite) ni dokazano
(zahtevno, še ni dokazano); dokazane so ničle, razcep in preglednica predznakov. B2a »povlečeta povprečje navzgor«
je razlaga; dokazano je Me < x̄. B2b pomen V'(0) (»hitrost spreminjanja«) je razlaga; dokazana sta odvod in
vrednost. Besedilne razlage brez števil (vrstni red računanja, »krajšaš le faktorje«) niso trditve.
Decimalna števila so točna racionalna (ℚ) ali realna (ℝ) števila. Zaokroženo »r na k decimalk« je zapisano kot
`Zaokr k r x`: r − 5/10^(k+1) ≤ x < r + 5/10^(k+1) (zaokroževanje navzgor pri polovici), »≈« pri vmesnih
približkih prav tako (na toliko decimalk, kot jih ima zapisani približek). Konvencije Leana: x/0 = 0 (zato ima
B3a pogoj x ≠ 0 in A5 pogoje definiranosti zapisane izrecno), tan x = sin x / cos x je v asimptotah (cos x = 0)
enak 0 (zato A10 izrecno izključi x = π/2), odštevanje v ℕ se ne uporabi (B3b računa v ℤ).
-/
module

public import Mathlib

public section

namespace Evklid.Pole.POKLICNA_MAT_2024_spomladanski

open Real Finset

/-- Zaokroženo: »x je r, zaokroženo na k decimalk« (r − 5·10^(−k−1) ≤ x < r + 5·10^(−k−1)). -/
def Zaokr (k : ℕ) (r x : ℝ) : Prop := r - 5 / 10 ^ (k + 1) ≤ x ∧ x < r + 5 / 10 ^ (k + 1)

/-! ## Pomožne ocene (sin, cos, log, exp) -/

/-- Ocena sin 2° in cos 2° (2° = π/90) iz Taylorjevih ocen `Real.sin_bound`, `Real.cos_bound` in π ∈ (3,141592;
3,141593). -/
theorem ocena_2st : sin (π / 90) ∈ Set.Ioo (0.03489948 : ℝ) 0.03489951 ∧
    cos (π / 90) ∈ Set.Ioo (0.99939068 : ℝ) 0.99939085 := by
  have h1 : (0.0349065777 : ℝ) < π / 90 := by have := pi_gt_d6; linarith
  have h2 : π / 90 < (0.0349065889 : ℝ) := by have := pi_lt_d6; linarith
  generalize π / 90 = y at h1 h2 ⊢
  have hy : |y| = y := abs_of_pos (by linarith)
  have hb := Real.sin_bound (x := y) (by rw [hy]; linarith)
  have hc := Real.cos_bound (x := y) (by rw [hy]; linarith)
  rw [hy, abs_le] at hb hc
  obtain ⟨hb1, hb2⟩ := hb
  obtain ⟨hc1, hc2⟩ := hc
  have p2 : y ^ 2 ≤ 0.0349065889 ^ 2 := by gcongr
  have p3 : y ^ 3 ≤ 0.0349065889 ^ 3 := by gcongr
  have p4 : y ^ 4 ≤ 0.0349065889 ^ 4 := by gcongr
  have p5 : y ^ 5 ≤ 0.0349065889 ^ 5 := by gcongr
  have p2' : 0.0349065777 ^ 2 ≤ y ^ 2 := by gcongr
  have p3' : 0.0349065777 ^ 3 ≤ y ^ 3 := by gcongr
  norm_num at p2 p3 p4 p5 p2' p3' ⊢
  refine ⟨⟨?_, ?_⟩, ?_, ?_⟩ <;> linarith

/-- Ocena sin 36° in cos 36° (36° = π/5) iz cos(π/5) = (1 + √5)/4. -/
theorem ocena_36st : sin (π / 5) ∈ Set.Ioo (0.58778523 : ℝ) 0.58778530 ∧
    cos (π / 5) ∈ Set.Ioo (0.80901697 : ℝ) 0.80901700 := by
  have s5a : (2.2360679 : ℝ) < √5 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have s5b : √5 < (2.2360680 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  have hc : cos (π / 5) = (1 + √5) / 4 := cos_pi_div_five
  have hcl : (0.80901697 : ℝ) < cos (π / 5) := by rw [hc]; linarith
  have hcu : cos (π / 5) < (0.80901700 : ℝ) := by rw [hc]; linarith
  have hs : 0 < sin (π / 5) := sin_pos_of_pos_of_lt_pi (by positivity) (by linarith [pi_pos])
  have hsc := sin_sq_add_cos_sq (π / 5)
  refine ⟨⟨?_, ?_⟩, hcl, hcu⟩ <;> nlinarith

/-- Ocena sin 38° in cos 38° (38° = 36° + 2°, adicijska izreka). -/
theorem ocena_38st : sin (38 * π / 180) ∈ Set.Ioo (0.6156610 : ℝ) 0.6156620 ∧
    cos (38 * π / 180) ∈ Set.Ioo (0.788010 : ℝ) 0.788012 := by
  have e : 38 * π / 180 = π / 5 + π / 90 := by ring
  rw [e, sin_add, cos_add]
  obtain ⟨⟨a1, a2⟩, b1, b2⟩ := ocena_36st
  obtain ⟨⟨c1, c2⟩, d1, d2⟩ := ocena_2st
  refine ⟨⟨?_, ?_⟩, ?_, ?_⟩ <;>
    nlinarith [mul_pos (show (0:ℝ) < sin (π / 5) by linarith) (show (0:ℝ) < cos (π / 90) by linarith)]

/-- Okno za log(1 − x) iz vrste (`Real.abs_log_sub_add_sum_range_le`). -/
theorem log_okno (x : ℝ) (h : |x| < 1) (n : ℕ) :
    -(∑ i ∈ range n, x ^ (i + 1) / (i + 1)) - |x| ^ (n + 1) / (1 - |x|) ≤ log (1 - x) ∧
    log (1 - x) ≤ -(∑ i ∈ range n, x ^ (i + 1) / (i + 1)) + |x| ^ (n + 1) / (1 - |x|) := by
  have := abs_le.mp (abs_log_sub_add_sum_range_le h n)
  constructor <;> linarith [this.1, this.2]

theorem ocena_log1032 : log 1.032 ∈ Set.Ioo (0.0314986 : ℝ) 0.0314987 := by
  have := log_okno (-0.032) (by norm_num [abs_of_neg]) 6
  norm_num [sum_range_succ, abs_of_neg] at this
  constructor <;> linarith [this.1, this.2]

theorem ocena_log1613 : log (16 / 13) ∈ Set.Ioo (0.2076393 : ℝ) 0.2076394 := by
  have := log_okno (3 / 16) (by norm_num [abs_of_pos]) 12
  norm_num [sum_range_succ, abs_of_pos] at this
  have e : log (16 / 13 : ℝ) = -log (13 / 16) := by rw [← Real.log_inv]; norm_num
  rw [e]
  constructor <;> linarith [this.1, this.2]

theorem ocena_log12308 : log 1.2308 ∈ Set.Ioo (0.2076643 : ℝ) 0.2076645 := by
  have := log_okno (577 / 3077) (by norm_num [abs_of_pos]) 12
  norm_num [sum_range_succ, abs_of_pos] at this
  have e : log (1.2308 : ℝ) = -log (2500 / 3077) := by rw [← Real.log_inv]; norm_num
  rw [e]
  constructor <;> linarith [this.1, this.2]

/-- log 2,001 = log 2 + log 1,0005 in log 1,999 = log 2 + log 0,9995. -/
theorem ocena_log2001 : log 2.001 ∈ Set.Ioo (0.6936470 : ℝ) 0.6936473 ∧
    log 1.999 ∈ Set.Ioo (0.6926470 : ℝ) 0.6926473 := by
  have l2a := log_two_gt_d9
  have l2b := log_two_lt_d9
  have h1 := log_okno (-0.0005) (by norm_num [abs_of_neg]) 4
  have h2 := log_okno 0.0005 (by norm_num [abs_of_pos]) 4
  norm_num [sum_range_succ, abs_of_neg, abs_of_pos] at h1 h2
  have e1 : log (2.001 : ℝ) = log 2 + log 1.0005 := by rw [← Real.log_mul (by norm_num) (by norm_num)]; norm_num
  have e2 : log (1.999 : ℝ) = log 2 + log 0.9995 := by rw [← Real.log_mul (by norm_num) (by norm_num)]; norm_num
  rw [e1, e2]
  refine ⟨⟨?_, ?_⟩, ?_, ?_⟩ <;> linarith [h1.1, h1.2, h2.1, h2.2]

example : ∃ x : ℝ, |x| < 1 := ⟨0, by simp⟩

/-- Okno za eˣ iz vrste (`Real.exp_bound`). -/
theorem exp_okno (x : ℝ) (hx : |x| ≤ 1) (n : ℕ) (hn : 0 < n) :
    ∑ m ∈ range n, x ^ m / m.factorial - |x| ^ n * (n.succ / (n.factorial * n)) ≤ exp x ∧
    exp x ≤ ∑ m ∈ range n, x ^ m / m.factorial + |x| ^ n * (n.succ / (n.factorial * n)) := by
  have := abs_le.mp (Real.exp_bound hx hn)
  constructor <;> linarith [this.1, this.2]

example : ∃ (x : ℝ) (n : ℕ), |x| ≤ 1 ∧ 0 < n := ⟨0, 1, by simp, by norm_num⟩

theorem ocena_exp03 : exp 0.3 ∈ Set.Ioo (1.3498588 : ℝ) 1.3498589 := by
  have := exp_okno 0.3 (by norm_num [abs_of_pos]) 10 (by norm_num)
  norm_num [sum_range_succ, Nat.factorial, abs_of_pos] at this
  constructor <;> linarith [this.1, this.2]

theorem ocena_exp06 : exp 0.6 ∈ Set.Ioo (1.8221187 : ℝ) 1.8221189 := by
  have := exp_okno 0.6 (by norm_num [abs_of_pos]) 14 (by norm_num)
  norm_num [sum_range_succ, Nat.factorial, abs_of_pos] at this
  constructor <;> linarith [this.1, this.2]

theorem ocena_exp0006 : exp 0.006 ∈ Set.Ioo (1.006018035 : ℝ) 1.006018037 := by
  have := exp_okno 0.006 (by norm_num [abs_of_pos]) 5 (by norm_num)
  norm_num [sum_range_succ, Nat.factorial, abs_of_pos] at this
  constructor <;> linarith [this.1, this.2]

/-! ## 1. del, naloga 1 -/

/-- Naloga 1, uradni odgovor: −0,6 · 5/9 + (1/2 − 5/4)² = 11/48; ulomek je okrajšan (števec 11, imenovalec 48,
D(11, 48) = 1). -/
theorem n1_odgovor : (-0.6 : ℚ) * (5 / 9) + (1 / 2 - 5 / 4) ^ 2 = 11 / 48 ∧
    ((11 / 48 : ℚ).num = 11 ∧ (11 / 48 : ℚ).den = 48) ∧ Nat.Coprime 11 48 := by
  refine ⟨by norm_num, ⟨by norm_num, by norm_num⟩, by norm_num⟩

/-- Naloga 1, pot »Po korakih«: −0,6 = −6/10 = −3/5; 1/2 − 5/4 = 2/4 − 5/4 = −3/4; (−3/4)² = 9/16;
−3/5 · 5/9 = −15/45 = −1/3; −1/3 + 9/16 = −16/48 + 27/48 = 11/48; 11 je praštevilo in ne deli 48. -/
theorem n1_po_korakih :
    ((-0.6 : ℚ) = -(6 / 10) ∧ -(6 / 10 : ℚ) = -(3 / 5)) ∧
    ((1 / 2 : ℚ) - 5 / 4 = 2 / 4 - 5 / 4 ∧ (2 / 4 : ℚ) - 5 / 4 = -(3 / 4)) ∧
    (-(3 / 4 : ℚ)) ^ 2 = 9 / 16 ∧
    (-(3 / 5 : ℚ) * (5 / 9) = -(15 / 45) ∧ -(15 / 45 : ℚ) = -(1 / 3)) ∧
    (-(1 / 3 : ℚ) + 9 / 16 = -(16 / 48) + 27 / 48 ∧ -(16 / 48 : ℚ) + 27 / 48 = 11 / 48) ∧
    Nat.Prime 11 ∧ ¬ 11 ∣ 48 := by
  refine ⟨⟨?_, ?_⟩, ⟨?_, ?_⟩, ?_, ⟨?_, ?_⟩, ⟨?_, ?_⟩, ?_, ?_⟩ <;> norm_num

/-- Naloga 1, pot »Po korakih« kot ena veriga. -/
theorem n1_veriga : (-0.6 : ℚ) * (5 / 9) + (1 / 2 - 5 / 4) ^ 2 = 11 / 48 := by
  calc (-0.6 : ℚ) * (5 / 9) + (1 / 2 - 5 / 4) ^ 2 = -(3 / 5) * (5 / 9) + (1 / 2 - 5 / 4) ^ 2 := by norm_num
    _ = -(3 / 5) * (5 / 9) + (2 / 4 - 5 / 4) ^ 2 := by norm_num
    _ = -(3 / 5) * (5 / 9) + (-(3 / 4)) ^ 2 := by norm_num
    _ = -(3 / 5) * (5 / 9) + 9 / 16 := by norm_num
    _ = -(15 / 45) + 9 / 16 := by norm_num
    _ = -(1 / 3) + 9 / 16 := by norm_num
    _ = -(16 / 48) + 27 / 48 := by norm_num
    _ = 11 / 48 := by norm_num

/-- Naloga 1, pot »Drugače: krajšanje pred množenjem in preizkus«: −3/5 · 5/9 = −3/9 = −1/3 (petici se
pokrajšata); 1/2 − 5/4 = 0,5 − 1,25 = −0,75, (−0,75)² = 0,5625 = 5625/10000 = 9/16;
−1/3 + 9/16 = (−16 + 27)/48 = 11/48. -/
theorem n1_drugace :
    (-(3 / 5 : ℚ) * (5 / 9) = -(3 / 9) ∧ -(3 / 9 : ℚ) = -(1 / 3)) ∧
    ((1 / 2 : ℚ) - 5 / 4 = 0.5 - 1.25 ∧ (0.5 : ℚ) - 1.25 = -0.75) ∧
    ((-0.75 : ℚ) ^ 2 = 0.5625 ∧ (0.5625 : ℚ) = 5625 / 10000 ∧ (5625 / 10000 : ℚ) = 9 / 16) ∧
    (-(1 / 3 : ℚ) + 9 / 16 = (-16 + 27) / 48 ∧ ((-16 + 27) / 48 : ℚ) = 11 / 48) := by
  refine ⟨⟨?_, ?_⟩, ⟨?_, ?_⟩, ⟨?_, ?_, ?_⟩, ?_, ?_⟩ <;> norm_num

/-- Naloga 1, preizkus s približki: −1/3 ≈ −0,3333, 9/16 = 0,5625, −0,3333 + 0,5625 = 0,2292 in 11/48 ≈ 0,2292
(na 4 decimalke). -/
theorem n1_preizkus : Zaokr 4 (-0.3333) (-(1 / 3)) ∧ (9 / 16 : ℝ) = 0.5625 ∧
    (-0.3333 : ℝ) + 0.5625 = 0.2292 ∧ Zaokr 4 0.2292 (11 / 48) := by
  unfold Zaokr; norm_num

/-- Naloga 1, napaka: (1/2)² − (5/4)² = 1/4 − 25/16 = −21/16 ni (1/2 − 5/4)² = 9/16. -/
theorem n1_napaka : (1 / 2 : ℚ) ^ 2 - (5 / 4) ^ 2 = 1 / 4 - 25 / 16 ∧ (1 / 4 : ℚ) - 25 / 16 = -(21 / 16) ∧
    (1 / 2 : ℚ) ^ 2 - (5 / 4) ^ 2 ≠ (1 / 2 - 5 / 4) ^ 2 := by
  refine ⟨?_, ?_, ?_⟩ <;> norm_num

/-! ## 1. del, naloga 2 -/

/-- Naloga 2, uradni odgovor: A (91 je praštevilo) NE, B (57 je sestavljeno) DA, C (35 in 48 sta tuji) DA,
D (2²·3·15 je praštevilski razcep 180) NE – zmnožek je 180, a faktor 15 ni praštevilo. -/
theorem n2_odgovor : ¬ Nat.Prime 91 ∧ (¬ Nat.Prime 57 ∧ 1 < 57) ∧ Nat.Coprime 35 48 ∧
    ¬ (2 ^ 2 * 3 * 15 = 180 ∧ Nat.Prime 2 ∧ Nat.Prime 3 ∧ Nat.Prime 15) := by
  refine ⟨by norm_num, ⟨by norm_num, by norm_num⟩, by norm_num, ?_⟩
  rintro ⟨-, -, -, h⟩
  norm_num at h

/-- Naloga 2, pot »Po trditvah«: A: 91 = 7·13; B: 5 + 7 = 12, 3 ∣ 12, 57 = 3·19; C: 35 = 5·7, 48 = 2⁴·3,
D(35, 48) = 1; D: 2²·3·15 = 180, 15 = 3·5, pravilni razcep 180 = 2²·3²·5 (faktorji 2, 2, 3, 3, 5). -/
theorem n2_po_trditvah :
    (91 = 7 * 13 ∧ ¬ Nat.Prime 91) ∧
    ((Nat.digits 10 57).sum = 12 ∧ 5 + 7 = 12 ∧ 3 ∣ 12 ∧ 57 = 3 * 19 ∧ ¬ Nat.Prime 57) ∧
    (35 = 5 * 7 ∧ 48 = 2 ^ 4 * 3 ∧ Nat.gcd 35 48 = 1) ∧
    (2 ^ 2 * 3 * 15 = 180 ∧ 15 = 3 * 5 ∧ ¬ Nat.Prime 15 ∧ 180 = 2 ^ 2 * 3 ^ 2 * 5 ∧
      Nat.primeFactorsList 180 = [2, 2, 3, 3, 5]) := by
  refine ⟨⟨by norm_num, by norm_num⟩, ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩,
    ⟨by norm_num, by norm_num, by norm_num⟩, ⟨by norm_num, by norm_num, by norm_num, by norm_num, by simp⟩⟩

/-- Naloga 2, pot »Drugače«, preizkus deliteljev: število p ≥ 2 je praštevilo natanko tedaj, ko nima delitelja
m z 2 ≤ m ≤ √p (`Nat.prime_def_le_sqrt`); √91 je med 9 in 10 (9² = 81, 10² = 100), 7 ≤ 9 in 91 : 7 = 13;
√57 je med 7 in 8, 3 ≤ 7 in 57 : 3 = 19. -/
theorem n2_preizkus_deliteljev :
    (∀ p : ℕ, Nat.Prime p ↔ 2 ≤ p ∧ ∀ m, 2 ≤ m → m ≤ Nat.sqrt p → ¬ m ∣ p) ∧
    (9 ^ 2 = 81 ∧ 10 ^ 2 = 100 ∧ Nat.sqrt 91 = 9 ∧ 91 / 7 = 13 ∧ 91 % 7 = 0) ∧
    (Nat.sqrt 57 = 7 ∧ 57 / 3 = 19 ∧ 57 % 3 = 0) := by
  refine ⟨fun p => Nat.prime_def_le_sqrt, ⟨by norm_num, by norm_num, ?_, by norm_num, by norm_num⟩,
    ⟨?_, by norm_num, by norm_num⟩⟩
  · exact (Nat.eq_sqrt.2 ⟨by norm_num, by norm_num⟩).symm
  · exact (Nat.eq_sqrt.2 ⟨by norm_num, by norm_num⟩).symm

/-- Naloga 2, pot »Drugače«, Evklidov algoritem: 48 = 1·35 + 13, 35 = 2·13 + 9, 13 = 1·9 + 4, 9 = 2·4 + 1,
4 = 4·1 + 0; zadnji neničelni ostanek je 1 = D(35, 48). -/
theorem n2_evklid :
    (48 = 1 * 35 + 13 ∧ 35 = 2 * 13 + 9 ∧ 13 = 1 * 9 + 4 ∧ 9 = 2 * 4 + 1 ∧ 4 = 4 * 1 + 0) ∧
    Nat.gcd 35 48 = 1 := by
  refine ⟨by norm_num, ?_⟩
  calc Nat.gcd 35 48 = Nat.gcd 13 35 := by norm_num
    _ = Nat.gcd 9 13 := by norm_num
    _ = Nat.gcd 4 9 := by norm_num
    _ = Nat.gcd 1 4 := by norm_num
    _ = Nat.gcd 0 1 := by norm_num
    _ = 1 := by norm_num

/-- Naloga 2, pot »Drugače«, razcep: 180 = 2·90 = 2·2·45 = 2·2·3·15 = 2·2·3·3·5. -/
theorem n2_razcep : (180 : ℕ) = 2 * 2 * 3 * 3 * 5 := by
  calc (180 : ℕ) = 2 * 90 := by norm_num
    _ = 2 * 2 * 45 := by norm_num
    _ = 2 * 2 * 3 * 15 := by norm_num
    _ = 2 * 2 * 3 * 3 * 5 := by norm_num

/-- Naloga 2, napaka: tuji števili nista nujno praštevili – 35 in 48 sta sestavljeni in tuji. -/
theorem n2_napaka : ¬ Nat.Prime 35 ∧ ¬ Nat.Prime 48 ∧ Nat.Coprime 35 48 := by
  refine ⟨by norm_num, by norm_num, by norm_num⟩

/-! ## 1. del, naloga 3 -/

/-- Naloga 3, zveza sin α = v/a: v pravokotnem trikotniku AD'D s pravim kotom pri D' je
sin(∠D'AD) · |AD| = |DD'| (kateta nasproti kota α). -/
theorem n3_sin_v_trikotniku {A D D' : EuclideanSpace ℝ (Fin 2)}
    (h : EuclideanGeometry.angle D D' A = π / 2) :
    sin (EuclideanGeometry.angle D' A D) * dist D A = dist D D' :=
  EuclideanGeometry.sin_angle_mul_dist_of_angle_eq_pi_div_two h

/-- Predpostavka trditve `n3_sin_v_trikotniku` se da izpolniti z nedegeneriranim trikotnikom (A ≠ D', D ≠ D'). -/
example : ∃ A D D' : EuclideanSpace ℝ (Fin 2), A ≠ D' ∧ D ≠ D' ∧ EuclideanGeometry.angle D D' A = π / 2 := by
  refine ⟨EuclideanSpace.single 0 1, EuclideanSpace.single 1 1, 0, ?_, ?_, ?_⟩
  · intro h; have := congrArg (fun v => v 0) h; simp at this
  · intro h; have := congrArg (fun v => v 1) h; simp at this
  · rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [EuclideanSpace.inner_single_left]

/-- α = 38° v radianih. -/
noncomputable def alfa3 : ℝ := 38 * π / 180

/-- Naloga 3, uradni odgovor: v = 7,5 · sin 38° ≈ 4,62 cm, S = 7,5 · v ≈ 34,63 cm² (na dve decimalki). -/
theorem n3_odgovor : Zaokr 2 4.62 (7.5 * sin alfa3) ∧ Zaokr 2 34.63 (7.5 * (7.5 * sin alfa3)) := by
  obtain ⟨⟨a, b⟩, -⟩ := ocena_38st
  unfold Zaokr alfa3
  refine ⟨⟨?_, ?_⟩, ?_, ?_⟩ <;> nlinarith

/-- Naloga 3, pot »Po korakih«: sin 38° ≈ 0,61566; 7,5 · 0,61566 = 4,61745 ≈ 4,62; nezaokrožena višina je
v ≈ 4,6175; S ≈ 7,5 · 4,6175 = 34,63125 ≈ 34,63. -/
theorem n3_po_korakih :
    Zaokr 5 0.61566 (sin alfa3) ∧
    ((7.5 : ℝ) * 0.61566 = 4.61745 ∧ Zaokr 2 4.62 4.61745) ∧
    Zaokr 4 4.6175 (7.5 * sin alfa3) ∧
    ((7.5 : ℝ) * 4.6175 = 34.63125 ∧ Zaokr 2 34.63 34.63125) := by
  obtain ⟨⟨a, b⟩, -⟩ := ocena_38st
  unfold Zaokr alfa3
  refine ⟨⟨?_, ?_⟩, ⟨?_, ?_, ?_⟩, ⟨?_, ?_⟩, ?_, ?_, ?_⟩ <;> norm_num <;> linarith

/-- Naloga 3, pot »Drugače: formula s kotom«: S = a · (a sin α) = a² sin α; 7,5² = 56,25; S ≈ 56,25 · 0,61566
= 34,630875 ≈ 34,63; S ≈ 34,631 (na tri decimalke); v = S/a; 34,631/7,5 ≈ 4,62; preizkus 4,62 < 7,5 in
S < 56,25. -/
theorem n3_drugace :
    (∀ a α : ℝ, a * (a * sin α) = a ^ 2 * sin α) ∧
    (7.5 : ℝ) ^ 2 = 56.25 ∧
    ((56.25 : ℝ) * 0.61566 = 34.630875 ∧ Zaokr 2 34.63 34.630875) ∧
    Zaokr 2 34.63 (56.25 * sin alfa3) ∧ Zaokr 3 34.631 (56.25 * sin alfa3) ∧
    (56.25 * sin alfa3) / 7.5 = 7.5 * sin alfa3 ∧ Zaokr 2 4.62 (34.631 / 7.5) ∧
    (4.62 : ℝ) < 7.5 ∧ 56.25 * sin alfa3 < 56.25 := by
  obtain ⟨⟨a, b⟩, -⟩ := ocena_38st
  unfold Zaokr alfa3
  refine ⟨fun a α => by ring, by norm_num, ⟨by norm_num, by norm_num, by norm_num⟩,
    ⟨?_, ?_⟩, ⟨?_, ?_⟩, by ring, ⟨by norm_num, by norm_num⟩, by norm_num, ?_⟩ <;> norm_num <;> linarith

/-- Naloga 3, točkovanje: z zaokroženo višino 4,62 je S = 7,5 · 4,62 = 34,65. -/
theorem n3_tockovanje : (7.5 : ℝ) * 4.62 = 34.65 := by norm_num

/-- Naloga 3, napaka: a cos α = 7,5 · cos 38° ≈ 5,91 (dolžina AD', ne višina); v radianih sin 38 ≈ 0,30. -/
theorem n3_napaka : Zaokr 2 5.91 (7.5 * cos alfa3) ∧ Zaokr 2 0.30 (sin 38) := by
  obtain ⟨-, ⟨c, d⟩⟩ := ocena_38st
  have e : sin 38 = sin (38 - (6 : ℕ) * (2 * π)) := (sin_sub_nat_mul_two_pi 38 6).symm
  have h1 := pi_gt_d6
  have h2 := pi_lt_d6
  have l : (0.30088 : ℝ) < 38 - (6 : ℕ) * (2 * π) := by push_cast; linarith
  have u : 38 - (6 : ℕ) * (2 * π) < (0.30090 : ℝ) := by push_cast; linarith
  unfold Zaokr alfa3
  refine ⟨⟨by nlinarith, by nlinarith⟩, ?_⟩
  rw [e]
  generalize 38 - (6 : ℕ) * (2 * π) = y at l u ⊢
  have hy : |y| = y := abs_of_pos (by linarith)
  have hb := Real.sin_bound (x := y) (by rw [hy]; linarith)
  rw [hy, abs_le] at hb
  have p3 : y ^ 3 ≤ 0.30090 ^ 3 := by gcongr
  have p5 : y ^ 5 ≤ 0.30090 ^ 5 := by gcongr
  have p3' : 0.30088 ^ 3 ≤ y ^ 3 := by gcongr
  norm_num at p3 p5 p3' ⊢
  constructor <;> linarith [hb.1, hb.2]

/-! ## 1. del, naloga 4 -/

/-- Naloga 4, uradni odgovor: 6500 · 1,032ⁿ > 8000 velja natanko za n ≥ 7 (n ∈ ℕ), torej prvič po 7 letih;
takrat je stanje ≈ 8103,47 €. -/
theorem n4_odgovor : (∀ n : ℕ, (8000 : ℝ) < 6500 * 1.032 ^ n ↔ 7 ≤ n) ∧
    Zaokr 2 8103.47 (6500 * 1.032 ^ 7) := by
  refine ⟨fun n => ⟨fun h => ?_, fun h => ?_⟩, by unfold Zaokr; norm_num⟩
  · by_contra hn
    have : (1.032 : ℝ) ^ n ≤ 1.032 ^ 6 := pow_le_pow_right₀ (by norm_num) (by omega)
    norm_num at this
    linarith
  · have : (1.032 : ℝ) ^ 7 ≤ 1.032 ^ n := pow_le_pow_right₀ (by norm_num) h
    norm_num at this ⊢
    linarith

/-- Naloga 4, pot »Po korakih (logaritem)«: r = 1 + 3,2/100 = 1,032; za realni n je
6500 · 1,032ⁿ > 8000 ⇔ 1,032ⁿ > 8000/6500 ⇔ n · ln 1,032 > ln(8000/6500) ⇔ n > ln(8000/6500)/ln 1,032. -/
theorem n4_logaritem (n : ℝ) :
    (1 : ℝ) + 3.2 / 100 = 1.032 ∧
    ((8000 : ℝ) < 6500 * 1.032 ^ n ↔ 8000 / 6500 < (1.032 : ℝ) ^ n) ∧
    (8000 / 6500 < (1.032 : ℝ) ^ n ↔ log (8000 / 6500) < n * log 1.032) ∧
    (log (8000 / 6500) < n * log 1.032 ↔ log (8000 / 6500) / log 1.032 < n) := by
  have hl : 0 < log (1.032 : ℝ) := Real.log_pos (by norm_num)
  refine ⟨by norm_num, ?_, Real.lt_rpow_iff_log_lt (by norm_num) (by norm_num), ?_⟩
  · rw [div_lt_iff₀ (by norm_num)]; constructor <;> intro h <;> linarith
  · rw [div_lt_iff₀ hl]

/-- Naloga 4, pot »Po korakih«, številke: 8000/6500 ≈ 1,2308; ln 1,2308 ≈ 0,20766; ln 1,032 ≈ 0,03150;
0,20766/0,03150 ≈ 6,59; tudi natančna meja ln(8000/6500)/ln 1,032 ≈ 6,59; najmanjše naravno število,
večje od meje (in od 6,59), je 7. -/
theorem n4_stevilke :
    Zaokr 4 1.2308 (8000 / 6500) ∧ Zaokr 5 0.20766 (log 1.2308) ∧ Zaokr 5 0.03150 (log 1.032) ∧
    Zaokr 2 6.59 (0.20766 / 0.03150) ∧ Zaokr 2 6.59 (log (8000 / 6500) / log 1.032) ∧
    (∀ n : ℕ, log (8000 / 6500) / log 1.032 < n ↔ 7 ≤ n) ∧ (∀ n : ℕ, (6.59 : ℝ) < n ↔ 7 ≤ n) := by
  obtain ⟨a1, a2⟩ := ocena_log1032
  obtain ⟨b1, b2⟩ := ocena_log1613
  obtain ⟨c1, c2⟩ := ocena_log12308
  have e : (8000 / 6500 : ℝ) = 16 / 13 := by norm_num
  have hl : (0 : ℝ) < log 1.032 := by linarith
  have q1 : (6.585 : ℝ) ≤ log (8000 / 6500) / log 1.032 := by
    rw [le_div_iff₀ hl, e]; nlinarith
  have q2 : log (8000 / 6500) / log 1.032 < (6.595 : ℝ) := by
    rw [div_lt_iff₀ hl, e]; nlinarith
  have q3 : log (8000 / 6500) / log 1.032 < (7 : ℝ) := by linarith
  have q4 : (6 : ℝ) < log (8000 / 6500) / log 1.032 := by linarith
  unfold Zaokr
  refine ⟨by norm_num, ⟨by linarith, by linarith⟩, ⟨by linarith, by linarith⟩, by norm_num,
    ⟨by norm_num; linarith, by norm_num; linarith⟩, fun n => ⟨fun h => ?_, fun h => ?_⟩,
    fun n => ⟨fun h => ?_, fun h => ?_⟩⟩
  · by_contra hn
    have : (n : ℝ) ≤ 6 := by exact_mod_cast (by omega : n ≤ 6)
    linarith
  · have : (7 : ℝ) ≤ n := by exact_mod_cast h
    linarith
  · by_contra hn
    have : (n : ℝ) ≤ 6 := by exact_mod_cast (by omega : n ≤ 6)
    linarith
  · have : (7 : ℝ) ≤ n := by exact_mod_cast h
    linarith

/-- Naloga 4, pot »Drugače: preizkus z zaporednimi leti« in napaka: po 6 letih 6500 · 1,032⁶ ≈ 7852,20 € < 8000 €,
po 7 letih 6500 · 1,032⁷ ≈ 8103,47 € > 8000 €. -/
theorem n4_preizkus : Zaokr 2 7852.20 (6500 * 1.032 ^ 6) ∧ (6500 : ℝ) * 1.032 ^ 6 < 8000 ∧
    Zaokr 2 8103.47 (6500 * 1.032 ^ 7) ∧ (8000 : ℝ) < 6500 * 1.032 ^ 7 := by
  unfold Zaokr; norm_num

/-- Naloga 4, napaka: z napačnim faktorjem 3,2 namesto 1,032 bi bilo že po enem letu 6500 · 3,2 = 20 800 > 8000
(»odgovor« 1 leto), s faktorjem 0,032 pa glavnica pade in 8000 € ni dosežena nikoli: 6500 · 0,032ⁿ < 8000 za
vsak n ≥ 1. -/
theorem n4_napaka_faktor : (6500 : ℝ) * 3.2 = 20800 ∧ (8000 : ℝ) < 6500 * 3.2 ∧
    ∀ n : ℕ, 1 ≤ n → (6500 : ℝ) * 0.032 ^ n < 8000 := by
  refine ⟨by norm_num, by norm_num, fun n hn => ?_⟩
  have h : (0.032 : ℝ) ^ n ≤ 0.032 ^ 1 :=
    pow_le_pow_of_le_one (by norm_num) (by norm_num) hn
  norm_num at h ⊢
  nlinarith

/-! ## 1. del, naloga 5 -/

/-- Naloga 5, pogoji: vsi ulomki (x² − 4 ≠ 0, x + 2 ≠ 0 in (x + 5)/(x + 2) ≠ 0 za obratno vrednost) so
definirani natanko za x ≠ 2, x ≠ −2, x ≠ −5. -/
theorem n5_pogoji (x : ℝ) :
    (x ^ 2 - 4 ≠ 0 ∧ x + 2 ≠ 0 ∧ (x + 5) / (x + 2) ≠ 0) ↔ (x ≠ 2 ∧ x ≠ -2 ∧ x ≠ -5) := by
  constructor
  · rintro ⟨h1, h2, h3⟩
    refine ⟨fun h => h1 (by rw [h]; norm_num), fun h => h2 (by rw [h]; norm_num), fun h => h3 (by rw [h]; norm_num)⟩
  · rintro ⟨h1, h2, h3⟩
    have a : x - 2 ≠ 0 := sub_ne_zero.mpr h1
    have b : x + 2 ≠ 0 := fun h => h2 (by linarith)
    have c : x + 5 ≠ 0 := fun h => h3 (by linarith)
    refine ⟨?_, b, div_ne_zero c b⟩
    have : x ^ 2 - 4 = (x - 2) * (x + 2) := by ring
    rw [this]; exact mul_ne_zero a b

/-- Naloga 5, uradni odgovor in pot »Po korakih«: ((x + 5)/(x + 2))⁻¹ = (x + 2)/(x + 5);
x² + 2x − 15 = (x + 5)(x − 3) (5 · (−3) = −15, 5 + (−3) = 2); x² − 4 = (x − 2)(x + 2); po krajšanju
(x − 3)/(x − 2), za x ≠ 2, x ≠ −2, x ≠ −5. -/
theorem n5_odgovor (x : ℝ) (h1 : x ≠ 2) (h2 : x ≠ -2) (h3 : x ≠ -5) :
    ((x + 5) / (x + 2))⁻¹ = (x + 2) / (x + 5) ∧
    (5 : ℝ) * (-3) = -15 ∧ (5 : ℝ) + (-3) = 2 ∧ x ^ 2 + 2 * x - 15 = (x + 5) * (x - 3) ∧
    x ^ 2 - 4 = (x - 2) * (x + 2) ∧
    (x ^ 2 + 2 * x - 15) / (x ^ 2 - 4) * ((x + 5) / (x + 2))⁻¹ = (x - 3) / (x - 2) := by
  have a : x - 2 ≠ 0 := sub_ne_zero.mpr h1
  have b : x + 2 ≠ 0 := fun h => h2 (by linarith)
  have c : x + 5 ≠ 0 := fun h => h3 (by linarith)
  refine ⟨inv_div _ _, by norm_num, by norm_num, by ring, by ring, ?_⟩
  calc (x ^ 2 + 2 * x - 15) / (x ^ 2 - 4) * ((x + 5) / (x + 2))⁻¹
      = (x ^ 2 + 2 * x - 15) / (x ^ 2 - 4) * ((x + 2) / (x + 5)) := by rw [inv_div]
    _ = ((x + 5) * (x - 3)) / ((x - 2) * (x + 2)) * ((x + 2) / (x + 5)) := by ring_nf
    _ = (x - 3) / (x - 2) := by field_simp

example : ∃ x : ℝ, x ≠ 2 ∧ x ≠ -2 ∧ x ≠ -5 := ⟨4, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 5, razcepa: 5 · (−3) = −15, 5 + (−3) = 2, x² + 2x − 15 = (x + 5)(x − 3); x² − 4 = x² − 2² =
(x − 2)(x + 2). -/
theorem n5_razcepa (x : ℝ) : (5 : ℝ) * (-3) = -15 ∧ (5 : ℝ) + (-3) = 2 ∧
    x ^ 2 + 2 * x - 15 = (x + 5) * (x - 3) ∧ x ^ 2 - 4 = x ^ 2 - 2 ^ 2 ∧ x ^ 2 - 2 ^ 2 = (x - 2) * (x + 2) := by
  refine ⟨by norm_num, by norm_num, by ring, by norm_num, by ring⟩

/-- Naloga 5, pot »Drugače: razcep z ničlami«: D = 2² + 4 · 15 = 64 (= 2² − 4 · 1 · (−15)); x² + 2x − 15 = 0
natanko za x = (−2 ± 8)/2, torej x = 3 ali x = −5; razcep (x − 3)(x + 5). -/
theorem n5_nicle :
    ((2 : ℝ) ^ 2 + 4 * 15 = 64 ∧ (2 : ℝ) ^ 2 - 4 * 1 * (-15) = 64) ∧
    ((-2 + 8) / 2 = (3 : ℝ) ∧ (-2 - 8) / 2 = (-5 : ℝ)) ∧
    (∀ x : ℝ, x ^ 2 + 2 * x - 15 = 0 ↔ x = 3 ∨ x = -5) ∧
    (∀ x : ℝ, x ^ 2 + 2 * x - 15 = (x - 3) * (x + 5)) := by
  refine ⟨⟨by norm_num, by norm_num⟩, ⟨by norm_num, by norm_num⟩, fun x => ?_, fun x => by ring⟩
  have : x ^ 2 + 2 * x - 15 = (x - 3) * (x + 5) := by ring
  rw [this, mul_eq_zero, sub_eq_zero, add_eq_zero_iff_eq_neg]

/-- Naloga 5, preizkus z x = 4: (16 + 8 − 15)/(16 − 4) = 9/12 = 3/4, (9/6)⁻¹ = 6/9 = 2/3, 3/4 · 2/3 = 1/2;
(4 − 3)/(4 − 2) = 1/2; začetni izraz pri x = 4 je 1/2. -/
theorem n5_preizkus :
    ((16 + 8 - 15) / (16 - 4) = (9 / 12 : ℚ) ∧ (9 / 12 : ℚ) = 3 / 4) ∧
    ((9 / 6 : ℚ)⁻¹ = 6 / 9 ∧ (6 / 9 : ℚ) = 2 / 3) ∧ (3 / 4 : ℚ) * (2 / 3) = 1 / 2 ∧
    ((4 - 3) / (4 - 2) : ℚ) = 1 / 2 ∧
    ((4 : ℚ) ^ 2 + 2 * 4 - 15) / (4 ^ 2 - 4) * ((4 + 5) / (4 + 2))⁻¹ = 1 / 2 := by
  refine ⟨⟨?_, ?_⟩, ⟨?_, ?_⟩, ?_, ?_, ?_⟩ <;> norm_num

/-! ## 1. del, naloga 6 -/

/-- Lara (plezalka 2) je na drugem mestu (mesto 1; mesta so 0, 1, 2, 3). -/
def laraDruga (σ : Equiv.Perm (Fin 4)) : Prop := σ 2 = 1

instance : DecidablePred laraDruga := fun σ => inferInstanceAs (Decidable (σ 2 = 1))

/-- Naloga 6, pot »Po korakih (permutacije)«: vseh izidov je 4! = 4·3·2·1 = 24, ugodnih (Lara druga)
3! = 3·2·1 = 6, P = 6/24 = 1/4 = 0,25 (uradni odgovor). -/
theorem n6_permutacije :
    Fintype.card (Equiv.Perm (Fin 4)) = Nat.factorial 4 ∧ Nat.factorial 4 = 4 * 3 * 2 * 1 ∧
    4 * 3 * 2 * 1 = 24 ∧
    (univ.filter laraDruga).card = 6 ∧ Nat.factorial 3 = 3 * 2 * 1 ∧ 3 * 2 * 1 = 6 ∧
    ((univ.filter laraDruga).card : ℚ) / Fintype.card (Equiv.Perm (Fin 4)) = 6 / 24 ∧
    (6 / 24 : ℚ) = 1 / 4 ∧ (1 / 4 : ℚ) = 0.25 := by
  have hc : (univ.filter laraDruga).card = 6 := by decide
  have hu : Fintype.card (Equiv.Perm (Fin 4)) = 24 := by rw [Fintype.card_perm]; rfl
  refine ⟨by rw [Fintype.card_perm, Fintype.card_fin], by decide, by norm_num, hc, by decide, by norm_num,
    ?_, by norm_num, by norm_num⟩
  rw [hc, hu]; norm_num

/-- Naloga 6, pot »Drugače: simetrija«: za vsako mesto i je Lara na tem mestu v 6 od 24 izidov, zato so štiri
verjetnosti enake, se izključujejo, njihova vsota je 1 in vsaka je 1/4. -/
theorem n6_simetrija :
    (∀ i : Fin 4, (univ.filter fun σ : Equiv.Perm (Fin 4) => σ 2 = i).card = 6) ∧
    (∑ i : Fin 4, ((univ.filter fun σ : Equiv.Perm (Fin 4) => σ 2 = i).card : ℚ) / 24) = 1 ∧
    (6 / 24 : ℚ) = 1 / 4 := by
  have h : ∀ i : Fin 4, (univ.filter fun σ : Equiv.Perm (Fin 4) => σ 2 = i).card = 6 := by decide
  refine ⟨h, ?_, by norm_num⟩
  simp only [h]; norm_num

/-- Naloga 6, preizkus s seznamom: ugodni vrstni redi (po mestih; 0 A, 1 B, 2 L, 3 V) so natanko
A L B V, A L V B, B L A V, B L V A, V L A B, V L B A. -/
theorem n6_seznam :
    (univ.filter laraDruga).image (fun σ : Equiv.Perm (Fin 4) => List.ofFn σ.symm) =
      {[0, 2, 1, 3], [0, 2, 3, 1], [1, 2, 0, 3], [1, 2, 3, 0], [3, 2, 0, 1], [3, 2, 1, 0]} := by
  decide

/-- Naloga 6, napaka: 1/24 je verjetnost enega celotnega vrstnega reda, ne 1/4. -/
theorem n6_napaka : (1 / Fintype.card (Equiv.Perm (Fin 4)) : ℚ) = 1 / 24 ∧ (1 / 24 : ℚ) ≠ 1 / 4 := by
  refine ⟨?_, by norm_num⟩
  rw [Fintype.card_perm]; rfl

/-! ## 1. del, naloga 7 -/

/-- Naloga 7, uradni odgovor: 3x(2x + 1) = 2(x + 1) natanko za x = 1/2 ali x = −2/3. -/
theorem n7_odgovor (x : ℝ) : 3 * x * (2 * x + 1) = 2 * (x + 1) ↔ x = 1 / 2 ∨ x = -(2 / 3) := by
  constructor
  · intro h
    have : (2 * x - 1) * (3 * x + 2) = 0 := by linear_combination h
    rcases mul_eq_zero.mp this with h | h
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Naloga 7, pot »Po korakih (diskriminanta)«: 6x² + 3x = 2x + 2; 6x² + 3x − 2x − 2 = 0, torej
6x² + x − 2 = 0; D = 1 − 4·6·(−2) = 1 + 48 = 49; x = (−1 ± 7)/12: 6/12 = 1/2, −8/12 = −2/3. -/
theorem n7_diskriminanta (x : ℝ) :
    (3 * x * (2 * x + 1) = 2 * (x + 1) ↔ 6 * x ^ 2 + 3 * x = 2 * x + 2) ∧
    (6 * x ^ 2 + 3 * x = 2 * x + 2 ↔ 6 * x ^ 2 + 3 * x - 2 * x - 2 = 0) ∧
    (6 * x ^ 2 + 3 * x - 2 * x - 2 = 6 * x ^ 2 + x - 2) ∧
    ((1 : ℝ) ^ 2 - 4 * 6 * (-2) = 1 + 48 ∧ (1 : ℝ) + 48 = 49 ∧ √(49 : ℝ) = 7) ∧
    ((-1 + 7) / 12 = (6 / 12 : ℝ) ∧ (6 / 12 : ℝ) = 1 / 2 ∧ (-1 - 7) / 12 = (-8 / 12 : ℝ) ∧
      (-8 / 12 : ℝ) = -(2 / 3)) ∧
    (6 * x ^ 2 + x - 2 = 0 ↔ x = (-1 + 7) / 12 ∨ x = (-1 - 7) / 12) := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    by ring, ⟨by norm_num, by norm_num, ?_⟩, ⟨by norm_num, by norm_num, by norm_num, by norm_num⟩, ?_⟩
  · rw [show (49 : ℝ) = 7 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · have : 6 * x ^ 2 + x - 2 = 6 * ((x - (-1 + 7) / 12) * (x - (-1 - 7) / 12)) := by ring
    rw [this, mul_eq_zero, mul_eq_zero, sub_eq_zero, sub_eq_zero]
    simp

/-- Naloga 7, pot »Drugače: razcep«: 6·(−2) = −12 = 4·(−3), 4 + (−3) = 1;
6x² + 4x − 3x − 2 = 2x(3x + 2) − (3x + 2) = (2x − 1)(3x + 2); 2x − 1 = 0 ⇔ x = 1/2, 3x + 2 = 0 ⇔ x = −2/3;
preizkus: 3 · 1/2 · 2 = 3 = 2 · 3/2 in 3 · (−2/3) · (−1/3) = 2/3 = 2 · 1/3. -/
theorem n7_razcep (x : ℝ) :
    ((6 : ℝ) * (-2) = -12 ∧ (4 : ℝ) * (-3) = -12 ∧ (4 : ℝ) + (-3) = 1) ∧
    (6 * x ^ 2 + x - 2 = 6 * x ^ 2 + 4 * x - 3 * x - 2) ∧
    (6 * x ^ 2 + 4 * x - 3 * x - 2 = 2 * x * (3 * x + 2) - (3 * x + 2)) ∧
    (2 * x * (3 * x + 2) - (3 * x + 2) = (2 * x - 1) * (3 * x + 2)) ∧
    (2 * x - 1 = 0 ↔ x = 1 / 2) ∧ (3 * x + 2 = 0 ↔ x = -(2 / 3)) ∧
    ((3 : ℝ) * (1 / 2) * 2 = 3 ∧ (2 : ℝ) * (3 / 2) = 3 ∧ (1 / 2 : ℝ) + 1 = 3 / 2 ∧ 2 * (1 / 2 : ℝ) + 1 = 2) ∧
    ((3 : ℝ) * (-(2 / 3)) * (-(1 / 3)) = 2 / 3 ∧ (2 : ℝ) * (1 / 3) = 2 / 3 ∧ -(2 / 3 : ℝ) + 1 = 1 / 3 ∧
      2 * (-(2 / 3) : ℝ) + 1 = -(1 / 3)) := by
  refine ⟨⟨by norm_num, by norm_num, by norm_num⟩, by ring, by ring, by ring,
    ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    ⟨by norm_num, by norm_num, by norm_num, by norm_num⟩, ⟨by norm_num, by norm_num, by norm_num, by norm_num⟩⟩

/-- Naloga 7, napaka: sklep »3x = 2 ali 2x + 1 = x + 1« da x = 2/3 ali x = 0, kar nista rešitvi. -/
theorem n7_napaka : ¬ (3 * (2 / 3 : ℝ) * (2 * (2 / 3) + 1) = 2 * ((2 / 3) + 1)) ∧
    ¬ (3 * (0 : ℝ) * (2 * 0 + 1) = 2 * (0 + 1)) := by
  constructor <;> norm_num

/-! ## 1. del, naloga 8 -/

/-- Funkcija iz 8. naloge. -/
noncomputable def f8 (x : ℝ) : ℝ := 2 * x ^ 3 - 5 * x + 4 * log x

/-- Naloga 8, pot »Po korakih (odvod po členih)«: (2x³)' = 2 · 3x² = 6x², (−5x)' = −5, (4 ln x)' = 4 · 1/x = 4/x,
torej f'(x) = 6x² − 5 + 4/x (za x > 0). -/
theorem n8_odvod (x : ℝ) (hx : 0 < x) :
    HasDerivAt (fun x => 2 * x ^ 3) (2 * (3 * x ^ 2)) x ∧ 2 * (3 * x ^ 2) = 6 * x ^ 2 ∧
    HasDerivAt (fun x => -5 * x) (-5) x ∧
    HasDerivAt (fun x => 4 * log x) (4 * (1 / x)) x ∧ 4 * (1 / x) = 4 / x ∧
    HasDerivAt f8 (6 * x ^ 2 - 5 + 4 / x) x ∧ deriv f8 x = 6 * x ^ 2 - 5 + 4 / x := by
  have d1 : HasDerivAt (fun x => 2 * x ^ 3) (2 * (3 * x ^ 2)) x := by
    have := (hasDerivAt_pow 3 x).const_mul 2
    convert this using 2
  have d2 : HasDerivAt (fun x => -5 * x) (-5) x := by
    simpa using (hasDerivAt_id x).const_mul (-5)
  have d3 : HasDerivAt (fun x => 4 * log x) (4 * (1 / x)) x := by
    simpa [one_div] using (hasDerivAt_log hx.ne').const_mul 4
  have d : HasDerivAt f8 (6 * x ^ 2 - 5 + 4 / x) x := by
    have := (d1.add d2).add d3
    unfold f8
    convert this using 1
    · ext y; simp only [Pi.add_apply]; ring
    · ring
  exact ⟨d1, by ring, d2, d3, by ring, d, d.deriv⟩

/-- Naloga 8, uradni odgovor: f'(2) = 6 · 2² − 5 + 4/2 = 24 − 5 + 2 = 21. -/
theorem n8_odgovor : deriv f8 2 = 21 := by
  calc deriv f8 2 = 6 * 2 ^ 2 - 5 + 4 / 2 := ((n8_odvod 2 (by norm_num)).2.2.2.2.2.2)
    _ = 24 - 5 + 2 := by norm_num
    _ = 21 := by norm_num

/-- Naloga 8, pot »Drugače: skupni ulomek«: 6x² − 5 + 4/x = (6x³ − 5x + 4)/x (x ≠ 0);
f'(2) = (6 · 8 − 10 + 4)/2 = 42/2 = 21. -/
theorem n8_ulomek (x : ℝ) (hx : x ≠ 0) :
    6 * x ^ 2 - 5 + 4 / x = (6 * x ^ 3 - 5 * x + 4) / x ∧
    ((6 * 2 ^ 3 - 5 * 2 + 4) / 2 : ℝ) = (6 * 8 - 10 + 4) / 2 ∧ ((6 * 8 - 10 + 4) / 2 : ℝ) = 42 / 2 ∧
    (42 / 2 : ℝ) = 21 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  field_simp

example : ∃ x : ℝ, x ≠ 0 := ⟨1, one_ne_zero⟩
example : ∃ x : ℝ, 0 < x := ⟨1, one_pos⟩

/-- Naloga 8, preizkus z diferenčnim kvocientom: f(2,001) ≈ 8,79360, f(1,999) ≈ 8,75160 (na 5 decimalk),
(8,79360 − 8,75160)/0,002 = 21,0; tudi natančni kvocient (f(2,001) − f(1,999))/0,002 ≈ 21,0. -/
theorem n8_preizkus : Zaokr 5 8.79360 (f8 2.001) ∧ Zaokr 5 8.75160 (f8 1.999) ∧
    ((8.79360 : ℝ) - 8.75160) / 0.002 = 21.0 ∧ Zaokr 1 21.0 ((f8 2.001 - f8 1.999) / 0.002) := by
  obtain ⟨⟨a1, a2⟩, b1, b2⟩ := ocena_log2001
  unfold Zaokr f8
  refine ⟨⟨?_, ?_⟩, ⟨?_, ?_⟩, by norm_num, ?_, ?_⟩ <;> norm_num <;> linarith

/-- Naloga 8, napake: odvod konstante f(2) je 0; (ln x)' = 1/x ni ln x (pri x = 1: 1 ≠ 0); (−5x)' = −5 ≠ 0. -/
theorem n8_napaka (x : ℝ) : deriv (fun _ : ℝ => f8 2) x = 0 ∧ deriv log 1 ≠ log 1 ∧
    deriv (fun x : ℝ => -5 * x) x ≠ 0 := by
  refine ⟨by simp, ?_, ?_⟩
  · rw [Real.deriv_log]; norm_num
  · rw [(show HasDerivAt (fun x : ℝ => -5 * x) (-5) x by simpa using (hasDerivAt_id x).const_mul (-5)).deriv]
    norm_num

/-! ## 1. del, naloga 9 -/

/-- Naloga 9, uradni odgovor in pot »Po korakih«: b = 252/18 = 14; S_pl = 2(a + b)v = 2 · (18 + 14) · 9,5 =
64 · 9,5 = 608; 100 % − 22 % = 78 %; 0,78 · 608 = 474,24 m². -/
theorem n9_po_korakih :
    (252 / 18 : ℚ) = 14 ∧ (18 : ℚ) * 14 = 252 ∧
    ((2 : ℚ) * (18 + 14) * 9.5 = 64 * 9.5 ∧ (64 : ℚ) * 9.5 = 608) ∧
    ((100 : ℚ) - 22 = 78) ∧ (0.78 : ℚ) * 608 = 474.24 := by
  refine ⟨by norm_num, by norm_num, ⟨by norm_num, by norm_num⟩, by norm_num, by norm_num⟩

/-- Naloga 9, celotna veriga: (1 − 22/100) · 2 · (18 + 252/18) · 9,5 = 474,24. -/
theorem n9_odgovor : (1 - 22 / 100 : ℚ) * (2 * (18 + 252 / 18) * 9.5) = 474.24 := by
  calc (1 - 22 / 100 : ℚ) * (2 * (18 + 252 / 18) * 9.5) = 0.78 * (2 * (18 + 14) * 9.5) := by norm_num
    _ = 0.78 * (64 * 9.5) := by norm_num
    _ = 0.78 * 608 := by norm_num
    _ = 474.24 := by norm_num

/-- Naloga 9, pot »Drugače: stene posebej in odštevanje«: 2 · 18 · 9,5 = 342, 2 · 14 · 9,5 = 266, 342 + 266 = 608;
0,22 · 608 = 133,76; 608 − 133,76 = 474,24; ocena: 474,24 je nad oceno 600 − 150 = 450. -/
theorem n9_drugace :
    (2 : ℚ) * 18 * 9.5 = 342 ∧ (2 : ℚ) * 14 * 9.5 = 266 ∧ (342 : ℚ) + 266 = 608 ∧
    (0.22 : ℚ) * 608 = 133.76 ∧ (608 : ℚ) - 133.76 = 474.24 ∧
    ((600 : ℚ) - 0.25 * 600 = 450 ∧ (450 : ℚ) < 474.24) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 9, napaka: celotna površina 2 · 252 + 608 = 1112 m² ni fasada; 608 − 22 = 586 ≠ 474,24. -/
theorem n9_napaka : (2 : ℚ) * 252 + 608 = 1112 ∧ (608 : ℚ) - 22 = 586 ∧ (586 : ℚ) ≠ 474.24 := by
  refine ⟨by norm_num, by norm_num, by norm_num⟩

/-! ## 1. del, naloga 10 -/

/-- Definicijsko območje v nalogi 10: (−π/2, 3π/2) brez asimptote π/2. -/
def D10 : Set ℝ := {x | x ∈ Set.Ioo (-(π / 2)) (3 * π / 2) ∧ x ≠ π / 2}

/-- Naloga 10, a: 2 = a · tan(π/4) = a · 1 natanko za a = 2. -/
theorem n10_a (a : ℝ) : a * tan (π / 4) = 2 ↔ a = 2 := by
  rw [tan_pi_div_four, mul_one]

/-- Naloga 10, zaloga vrednosti: f(x) = 2 tan x zavzame na D10 vsa realna števila, Z_f = ℝ
(za y vzamemo x = arctan(y/2) ∈ (−π/2, π/2)). Zato tudi Z_f ≠ [−2, 2] in Z_f ≠ (−2, 2) (napaka). -/
theorem n10_zaloga : (fun x => 2 * tan x) '' D10 = Set.univ ∧
    (fun x => 2 * tan x) '' D10 ≠ Set.Icc (-2) 2 ∧ (fun x => 2 * tan x) '' D10 ≠ Set.Ioo (-2) 2 := by
  have h : (fun x => 2 * tan x) '' D10 = Set.univ := by
    refine Set.eq_univ_of_forall fun y => ⟨arctan (y / 2), ⟨⟨neg_pi_div_two_lt_arctan _, ?_⟩,
      (arctan_lt_pi_div_two _).ne⟩, ?_⟩
    · linarith [arctan_lt_pi_div_two (y / 2), pi_pos]
    · simp only [tan_arctan]; ring
  refine ⟨h, fun h' => ?_, fun h' => ?_⟩
  · have : (3 : ℝ) ∈ Set.Icc (-2) 2 := by rw [← h', h]; trivial
    norm_num at this
  · have : (3 : ℝ) ∈ Set.Ioo (-2) 2 := by rw [← h', h]; trivial
    norm_num at this

/-- Naloga 10, začetna vrednost: f(0) = 2 tan 0 = 0. -/
theorem n10_f0 : 2 * tan 0 = 0 := by simp

/-- Naloga 10, pot »Drugače: s sinusom in kosinusom«: tan x = sin x / cos x > 0 natanko tedaj, ko imata sin x
in cos x enak predznak. -/
theorem n10_predznak (x : ℝ) : 0 < 2 * tan x ↔ (0 < sin x ∧ 0 < cos x) ∨ (sin x < 0 ∧ cos x < 0) := by
  rw [← div_pos_iff, ← tan_eq_sin_div_cos]
  constructor <;> intro h <;> linarith

/-- Naloga 10, kvadranta: na (−π/2, 3π/2) sta sin x, cos x oba pozitivna natanko na (0, π/2) (1. kvadrant)
in oba negativna natanko na (π, 3π/2) (3. kvadrant). -/
theorem n10_kvadranta (x : ℝ) (h1 : -(π / 2) < x) (h2 : x < 3 * π / 2) :
    ((0 < sin x ∧ 0 < cos x) ↔ x ∈ Set.Ioo 0 (π / 2)) ∧
    ((sin x < 0 ∧ cos x < 0) ↔ x ∈ Set.Ioo π (3 * π / 2)) := by
  have hp := pi_pos
  constructor
  · constructor
    · rintro ⟨hs, hc⟩
      refine ⟨?_, ?_⟩
      · by_contra h; push Not at h
        have := sin_nonpos_of_nonpos_of_neg_pi_le h (by linarith); linarith
      · by_contra h; push Not at h
        have := cos_nonpos_of_pi_div_two_le_of_le h (by linarith); linarith
    · rintro ⟨a, b⟩
      exact ⟨sin_pos_of_pos_of_lt_pi a (by linarith), cos_pos_of_mem_Ioo ⟨by linarith, b⟩⟩
  · constructor
    · rintro ⟨hs, hc⟩
      refine ⟨?_, h2⟩
      by_contra h; push Not at h
      rcases le_or_gt 0 x with h0 | h0
      · have := sin_nonneg_of_nonneg_of_le_pi h0 h; linarith
      · have := cos_pos_of_mem_Ioo ⟨h1, by linarith⟩; linarith
    · rintro ⟨a, b⟩
      refine ⟨?_, cos_neg_of_pi_div_two_lt_of_lt (by linarith) (by linarith)⟩
      have := sin_pos_of_pos_of_lt_pi (x := x - π) (by linarith) (by linarith)
      rw [sin_sub_pi] at this; linarith

example : ∃ x : ℝ, -(π / 2) < x ∧ x < 3 * π / 2 := ⟨0, by linarith [pi_pos], by linarith [pi_pos]⟩

/-- Naloga 10, uradni odgovor (pozitivnost): za x iz D10 je f(x) = 2 tan x > 0 natanko za
x ∈ (0, π/2) ∪ (π, 3π/2). -/
theorem n10_pozitivna (x : ℝ) (hx : x ∈ D10) :
    0 < 2 * tan x ↔ x ∈ Set.Ioo 0 (π / 2) ∪ Set.Ioo π (3 * π / 2) := by
  obtain ⟨⟨h1, h2⟩, -⟩ := hx
  obtain ⟨k1, k2⟩ := n10_kvadranta x h1 h2
  rw [n10_predznak, k1, k2, Set.mem_union]

example : ∃ x, x ∈ D10 := ⟨0, ⟨by constructor <;> linarith [pi_pos], by linarith [pi_pos]⟩⟩

/-- Naloga 10, natančna vrednost: f(π/6) = 2 tan(π/6) = 2 · √3/3 = 2√3/3 ≈ 1,15; je med 1 in 2 (= f(π/4)). -/
theorem n10_pi6 : tan (π / 6) = √3 / 3 ∧ 2 * tan (π / 6) = 2 * (√3 / 3) ∧ 2 * (√3 / 3) = 2 * √3 / 3 ∧
    Zaokr 2 1.15 (2 * √3 / 3) ∧ 1 < 2 * tan (π / 6) ∧ 2 * tan (π / 6) < 2 * tan (π / 4) := by
  have s3 : √3 * √3 = 3 := Real.mul_self_sqrt (by norm_num)
  have s3p : 0 < √3 := by positivity
  have t : tan (π / 6) = √3 / 3 := by
    rw [tan_pi_div_six]; field_simp; rw [Real.sq_sqrt (by norm_num)]
  have a : (1.732 : ℝ) < √3 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have b : √3 < (1.7321 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  unfold Zaokr
  refine ⟨t, by rw [t], by ring, ⟨by norm_num; linarith, by norm_num; linarith⟩, ?_, ?_⟩
  · rw [t]; linarith
  · rw [t, tan_pi_div_four]; linarith

/-- Naloga 10, pot »Drugače«: sin(π/6) = 1/2, cos(π/6) = √3/2, tan(π/6) = (1/2) : (√3/2) = 1/√3 = √3/3. -/
theorem n10_sin_cos : sin (π / 6) = 1 / 2 ∧ cos (π / 6) = √3 / 2 ∧
    sin (π / 6) / cos (π / 6) = 1 / √3 ∧ 1 / √3 = √3 / 3 := by
  have s3 : √3 * √3 = 3 := Real.mul_self_sqrt (by norm_num)
  have s3p : 0 < √3 := by positivity
  refine ⟨sin_pi_div_six, cos_pi_div_six, ?_, ?_⟩
  · rw [sin_pi_div_six, cos_pi_div_six]; field_simp
  · field_simp; rw [Real.sq_sqrt (by norm_num)]

/-- Naloga 10, asimptote: na [−π/2, 3π/2] je cos x = 0 natanko za x = −π/2, π/2, 3π/2. (Lean tam
tan x računa kot sin x / 0 = 0; zato D10 asimptoto π/2 izključi izrecno.) -/
theorem n10_asimptote (x : ℝ) (h1 : -(π / 2) ≤ x) (h2 : x ≤ 3 * π / 2) :
    cos x = 0 ↔ x = -(π / 2) ∨ x = π / 2 ∨ x = 3 * π / 2 := by
  have hp := pi_pos
  rw [cos_eq_zero_iff]
  constructor
  · rintro ⟨k, rfl⟩
    have a : (-1 : ℝ) ≤ k := by nlinarith
    have b : (k : ℝ) ≤ 1 := by nlinarith
    have a' : -1 ≤ k := by exact_mod_cast a
    have b' : k ≤ 1 := by exact_mod_cast b
    interval_cases k
    · left; push_cast; ring
    · right; left; push_cast; ring
    · right; right; push_cast; ring
  · rintro (rfl | rfl | rfl)
    · exact ⟨-1, by push_cast; ring⟩
    · exact ⟨0, by push_cast; ring⟩
    · exact ⟨1, by push_cast; ring⟩

example : ∃ x : ℝ, -(π / 2) ≤ x ∧ x ≤ 3 * π / 2 := ⟨0, by linarith [pi_pos], by linarith [pi_pos]⟩

/-- Naloga 10, napaki: zaloga vrednosti 2 sin x je [−2, 2] (ne pri tangensu); tan(π/3) = √3, tan(π/6) < 1. -/
theorem n10_napaka : Set.range (fun x => 2 * sin x) = Set.Icc (-2) 2 ∧ tan (π / 3) = √3 ∧ tan (π / 6) < 1 := by
  refine ⟨?_, tan_pi_div_three, ?_⟩
  · ext y
    constructor
    · rintro ⟨x, rfl⟩
      exact ⟨by linarith [neg_one_le_sin x], by linarith [sin_le_one x]⟩
    · rintro ⟨a, b⟩
      have : y / 2 ∈ Set.range sin := by rw [Real.range_sin]; constructor <;> linarith
      obtain ⟨x, hx⟩ := this
      exact ⟨x, by simp only [hx]; ring⟩
  · have := n10_pi6.2.2.2.2.1
    have h2 := n10_pi6.1
    have b : √3 < (1.7321 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
    rw [h2]; linarith

/-! ## 1. del, naloga 11 -/

/-- Naloga 11a, uradni odgovor: premica c = ks + n skozi A(5, 10) in B(15, 22) je natanko c = 1,2s + 4. -/
theorem n11a_odgovor (k n : ℝ) : (10 = k * 5 + n ∧ 22 = k * 15 + n) ↔ (k = 1.2 ∧ n = 4) := by
  constructor
  · rintro ⟨h1, h2⟩
    constructor <;> norm_num <;> linarith
  · rintro ⟨rfl, rfl⟩
    norm_num

/-- Naloga 11a, pot »Po korakih«: k = (22 − 10)/(15 − 5) = 12/10 = 1,2; 10 = 1,2 · 5 + n = 6 + n, n = 4. -/
theorem n11a_po_korakih (n : ℝ) :
    ((22 - 10) / (15 - 5) : ℝ) = 12 / 10 ∧ (12 / 10 : ℝ) = 1.2 ∧ (1.2 : ℝ) * 5 + n = 6 + n ∧
    ((10 : ℝ) = 6 + n ↔ n = 4) := by
  refine ⟨by norm_num, by norm_num, by norm_num, fun h => by linarith, fun h => by rw [h]; norm_num⟩

/-- Naloga 11a, pot »Drugače«: c − 10 = 1,2(s − 5) ⇔ c = 1,2s − 6 + 10 = 1,2s + 4; preizkus B:
1,2 · 15 + 4 = 18 + 4 = 22; presečišče z osjo c je c(0) = 4. -/
theorem n11a_drugace (s c : ℝ) :
    (c - 10 = 1.2 * (s - 5) ↔ c = 1.2 * s - 6 + 10) ∧ 1.2 * s - 6 + 10 = 1.2 * s + 4 ∧
    ((1.2 : ℝ) * 15 + 4 = 18 + 4 ∧ (18 : ℝ) + 4 = 22) ∧ (1.2 : ℝ) * 0 + 4 = 4 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, by ring, ⟨by norm_num, by norm_num⟩, by norm_num⟩

/-- Naloga 11a, napaka: (15 − 5)/(22 − 10) ≈ 0,83 ni smerni koeficient 1,2. -/
theorem n11a_napaka : Zaokr 2 0.83 ((15 - 5) / (22 - 10)) ∧ ((15 - 5) / (22 - 10) : ℝ) ≠ 1.2 := by
  unfold Zaokr; norm_num

/-- Naloga 11b, uradni odgovor in pot »Z neenačbo«: 1,2s + 4 ≤ 19 ⇔ 1,2s ≤ 15 ⇔ s ≤ 15/1,2 = 12,5; največja
dolžina je 12,5 km. -/
theorem n11b_odgovor :
    (∀ s : ℝ, (1.2 * s + 4 ≤ 19 ↔ 1.2 * s ≤ 15) ∧ (1.2 * s ≤ 15 ↔ s ≤ 15 / 1.2)) ∧ (15 / 1.2 : ℝ) = 12.5 ∧
    IsGreatest {s : ℝ | 0 ≤ s ∧ 1.2 * s + 4 ≤ 19} 12.5 := by
  refine ⟨fun s => ⟨⟨fun h => by linarith, fun h => by linarith⟩, ?_⟩, by norm_num, ⟨⟨by norm_num, by norm_num⟩,
    fun s hs => by linarith [hs.2]⟩⟩
  rw [le_div_iff₀ (by norm_num)]; constructor <;> intro h <;> linarith

/-- Naloga 11b, pot »Drugače«: 19 − 4 = 15, 15 : 1,2 = 12,5; preizkus 1,2 · 12,5 + 4 = 15 + 4 = 19;
12 < 12,5 < 13. -/
theorem n11b_drugace : (19 : ℝ) - 4 = 15 ∧ (15 : ℝ) / 1.2 = 12.5 ∧ (1.2 : ℝ) * 12.5 + 4 = 15 + 4 ∧
    (15 : ℝ) + 4 = 19 ∧ (12 : ℝ) < 12.5 ∧ (12.5 : ℝ) < 13 := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_⟩ <;> norm_num

/-- Naloga 11b, napaka: 19 : 1,2 ≈ 15,8 (pozabljena začetnina). -/
theorem n11b_napaka : Zaokr 1 15.8 (19 / 1.2) ∧ (19 / 1.2 : ℝ) ≠ 12.5 := by
  unfold Zaokr; norm_num

/-! ## 2. del, naloga 1 -/

open Polynomial in
/-- Polinom p(x) = ½x³ − 7/2 x + 3. -/
noncomputable def p1 : Polynomial ℝ := C (1 / 2) * X ^ 3 - C (7 / 2) * X + C 3

open Polynomial in
theorem p1_eval (x : ℝ) : p1.eval x = 1 / 2 * x ^ 3 - 7 / 2 * x + 3 := by
  simp [p1]

open Polynomial in
/-- Naloga B1a, uradni odgovor: stopnja 3, prosti člen 3, vodilni člen ½x³ (vodilni koeficient ½), p(−2) = 6. -/
theorem b1a_odgovor : p1.natDegree = 3 ∧ p1.coeff 0 = 3 ∧ p1.leadingCoeff = 1 / 2 ∧
    C p1.leadingCoeff * X ^ p1.natDegree = C (1 / 2) * X ^ 3 ∧ p1.eval (-2) = 6 := by
  have hd : p1.natDegree = 3 := by unfold p1; compute_degree!
  have hl : p1.leadingCoeff = 1 / 2 := by
    rw [leadingCoeff, hd]; simp [p1]
  refine ⟨hd, by simp [p1], hl, by rw [hl, hd], by rw [p1_eval]; norm_num⟩

/-- Naloga B1a, pot »Po korakih«: p(−2) = ½ · (−8) − 7/2 · (−2) + 3 = −4 + 7 + 3 = 6. -/
theorem b1a_po_korakih : p1.eval (-2) = 6 := by
  calc p1.eval (-2) = 1 / 2 * (-2) ^ 3 - 7 / 2 * (-2) + 3 := p1_eval _
    _ = 1 / 2 * (-8) - 7 / 2 * (-2) + 3 := by norm_num
    _ = -4 + 7 + 3 := by norm_num
    _ = 6 := by norm_num

/-- Naloga B1a, pot »Hornerjev algoritem«: koeficienti ½, 0, −7/2, 3; ½ · (−2) = −1, 0 + (−1) = −1;
(−1)(−2) = 2, −7/2 + 2 = −3/2; (−3/2)(−2) = 3, 3 + 3 = 6 = p(−2); Hornerjeva shema je p(x) = ((½x + 0)x − 7/2)x + 3. -/
theorem b1a_horner :
    ((1 / 2 : ℝ) * (-2) = -1 ∧ (0 : ℝ) + (-1) = -1) ∧
    ((-1 : ℝ) * (-2) = 2 ∧ (-(7 / 2) : ℝ) + 2 = -(3 / 2)) ∧
    ((-(3 / 2) : ℝ) * (-2) = 3 ∧ (3 : ℝ) + 3 = 6) ∧
    (∀ x, p1.eval x = ((1 / 2 * x + 0) * x - 7 / 2) * x + 3) := by
  refine ⟨⟨by norm_num, by norm_num⟩, ⟨by norm_num, by norm_num⟩, ⟨by norm_num, by norm_num⟩, fun x => ?_⟩
  rw [p1_eval]; ring

/-- Naloga B1b, uradni odgovor: ničle so natanko −3, 1, 2; p(x) = ½(x + 3)(x − 1)(x − 2); presečišče z osjo y
je (0, 3). -/
theorem b1b_odgovor : (∀ x, p1.eval x = 0 ↔ x = -3 ∨ x = 1 ∨ x = 2) ∧
    (∀ x, p1.eval x = 1 / 2 * (x + 3) * (x - 1) * (x - 2)) ∧ p1.eval 0 = 3 := by
  have hf : ∀ x, p1.eval x = 1 / 2 * (x + 3) * (x - 1) * (x - 2) := fun x => by rw [p1_eval]; ring
  refine ⟨fun x => ?_, hf, by rw [p1_eval]; norm_num⟩
  rw [hf]
  simp only [mul_eq_zero, sub_eq_zero, one_div, inv_eq_zero, OfNat.ofNat_ne_zero, false_or]
  constructor
  · rintro ((h | h) | h)
    · left; linarith
    · right; left; exact h
    · right; right; exact h
  · rintro (h | h | h)
    · left; left; linarith
    · left; right; exact h
    · right; exact h

/-- Naloga B1b, pot »Po korakih«: p(x) = 0 ⇔ x³ − 7x + 6 = 0 (pomnožimo z 2); cele ničle x³ − 7x + 6 delijo 6;
1 − 7 + 6 = 0; Horner z 1: 1, 0 + 1 = 1, −7 + 1 = −6, 6 + (−6) = 0, količnik x² + x − 6;
x³ − 7x + 6 = (x − 1)(x² + x − 6), x² + x − 6 = (x + 3)(x − 2); p(0) = 3;
p(1,5) = ½ · 3,375 − 5,25 + 3 = −0,5625. -/
theorem b1b_po_korakih :
    (∀ x, p1.eval x = 0 ↔ x ^ 3 - 7 * x + 6 = 0) ∧
    (∀ x : ℤ, x ^ 3 - 7 * x + 6 = 0 → x ∣ 6) ∧
    ((1 : ℝ) - 7 + 6 = 0 ∧ (1 : ℝ) ^ 3 - 7 * 1 + 6 = 0) ∧
    ((1 : ℝ) * 1 = 1 ∧ (0 : ℝ) + 1 = 1 ∧ (1 : ℝ) * 1 = 1 ∧ (-7 : ℝ) + 1 = -6 ∧ (-6 : ℝ) * 1 = -6 ∧
      (6 : ℝ) + (-6) = 0) ∧
    (∀ x : ℝ, x ^ 3 - 7 * x + 6 = (x - 1) * (x ^ 2 + x - 6)) ∧
    (∀ x : ℝ, x ^ 2 + x - 6 = (x + 3) * (x - 2)) ∧
    p1.eval 0 = 3 ∧
    ((1.5 : ℝ) ^ 3 = 3.375 ∧ p1.eval 1.5 = 1 / 2 * 3.375 - 5.25 + 3 ∧ (1 / 2 * 3.375 - 5.25 + 3 : ℝ) = -0.5625) := by
  refine ⟨fun x => ?_, fun x h => ?_, ⟨by norm_num, by norm_num⟩,
    ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩,
    fun x => by ring, fun x => by ring, by rw [p1_eval]; norm_num,
    ⟨by norm_num, by rw [p1_eval]; norm_num, by norm_num⟩⟩
  · rw [p1_eval]; constructor <;> intro h <;> linarith
  · exact ⟨-(x ^ 2 - 7), by linear_combination h⟩

/-- Naloga B1b, graf (preglednica predznakov): p > 0 natanko na (−3, 1) in za x > 2; p < 0 natanko za x < −3 in
na (1, 2). -/
theorem b1b_predznak (x : ℝ) :
    (0 < p1.eval x ↔ (-3 < x ∧ x < 1) ∨ 2 < x) ∧ (p1.eval x < 0 ↔ x < -3 ∨ (1 < x ∧ x < 2)) := by
  rw [b1b_odgovor.2.1 x]
  have key : ∀ a b c : ℝ, 0 < 1 / 2 * a * b * c ↔ 0 < a * b * c := fun a b c => by
    constructor <;> intro h <;> nlinarith
  have key2 : ∀ a b c : ℝ, 1 / 2 * a * b * c < 0 ↔ a * b * c < 0 := fun a b c => by
    constructor <;> intro h <;> nlinarith
  rw [key, key2]
  constructor
  · constructor
    · intro h
      rcases lt_trichotomy x (-3) with h1 | h1 | h1
      · nlinarith [mul_pos (by linarith : (0:ℝ) < -(x + 3)) (by linarith : (0:ℝ) < -(x - 1))]
      · subst h1; norm_num at h
      · rcases lt_trichotomy x 1 with h2 | h2 | h2
        · left; exact ⟨h1, h2⟩
        · subst h2; norm_num at h
        · rcases lt_trichotomy x 2 with h3 | h3 | h3
          · nlinarith [mul_pos (by linarith : (0:ℝ) < x + 3) (by linarith : (0:ℝ) < x - 1)]
          · subst h3; norm_num at h
          · right; exact h3
    · rintro (⟨h1, h2⟩ | h3)
      · have := mul_pos (by linarith : (0:ℝ) < x + 3) (by linarith : (0:ℝ) < 1 - x)
        nlinarith
      · have := mul_pos (by linarith : (0:ℝ) < x + 3) (by linarith : (0:ℝ) < x - 1)
        nlinarith
  · constructor
    · intro h
      rcases lt_trichotomy x (-3) with h1 | h1 | h1
      · left; exact h1
      · subst h1; norm_num at h
      · rcases lt_trichotomy x 1 with h2 | h2 | h2
        · nlinarith [mul_pos (by linarith : (0:ℝ) < x + 3) (by linarith : (0:ℝ) < 1 - x)]
        · subst h2; norm_num at h
        · rcases lt_trichotomy x 2 with h3 | h3 | h3
          · right; exact ⟨h2, h3⟩
          · subst h3; norm_num at h
          · nlinarith [mul_pos (by linarith : (0:ℝ) < x + 3) (by linarith : (0:ℝ) < x - 1)]
    · rintro (h1 | ⟨h2, h3⟩)
      · have := mul_pos (by linarith : (0:ℝ) < -(x + 3)) (by linarith : (0:ℝ) < 1 - x)
        nlinarith
      · have := mul_pos (by linarith : (0:ℝ) < x + 3) (by linarith : (0:ℝ) < x - 1)
        nlinarith

/-- Naloga B1b, pot »Drugače: Horner z ulomki in diskriminanta«: ½; 0 + ½ = ½; −7/2 + ½ = −3; 3 + (−3) = 0;
p(x) = (x − 1)(½x² + ½x − 3); ½x² + ½x − 3 = 0 ⇔ x² + x − 6 = 0; D = 1 + 24 = 25; x = (−1 ± 5)/2 = 2 ali −3;
p(x) = ½(x − 1)(x + 3)(x − 2); preizkus p(2) = ½ · 8 − 7 + 3 = 0, p(−3) = −27/2 + 21/2 + 3 = −3 + 3 = 0. -/
theorem b1b_drugace :
    ((1 / 2 : ℝ) * 1 = 1 / 2 ∧ (0 : ℝ) + 1 / 2 = 1 / 2 ∧ (-(7 / 2) : ℝ) + 1 / 2 = -3 ∧ (3 : ℝ) + (-3) = 0) ∧
    (∀ x, p1.eval x = (x - 1) * (1 / 2 * x ^ 2 + 1 / 2 * x - 3)) ∧
    (∀ x : ℝ, 1 / 2 * x ^ 2 + 1 / 2 * x - 3 = 0 ↔ x ^ 2 + x - 6 = 0) ∧
    ((1 : ℝ) ^ 2 - 4 * 1 * (-6) = 1 + 24 ∧ (1 : ℝ) + 24 = 25 ∧ √(25 : ℝ) = 5) ∧
    ((-1 + 5) / 2 = (2 : ℝ) ∧ (-1 - 5) / 2 = (-3 : ℝ)) ∧
    (∀ x : ℝ, x ^ 2 + x - 6 = 0 ↔ x = 2 ∨ x = -3) ∧
    (∀ x, p1.eval x = 1 / 2 * (x - 1) * (x + 3) * (x - 2)) ∧
    (p1.eval 2 = 1 / 2 * 8 - 7 + 3 ∧ (1 / 2 * 8 - 7 + 3 : ℝ) = 0) ∧
    (p1.eval (-3) = -(27 / 2) + 21 / 2 + 3 ∧ (-(27 / 2) + 21 / 2 + 3 : ℝ) = -3 + 3 ∧ (-3 + 3 : ℝ) = 0) := by
  refine ⟨⟨by norm_num, by norm_num, by norm_num, by norm_num⟩, fun x => by rw [p1_eval]; ring,
    fun x => ⟨fun h => by linarith, fun h => by linarith⟩, ⟨by norm_num, by norm_num, ?_⟩,
    ⟨by norm_num, by norm_num⟩, fun x => ?_, fun x => by rw [p1_eval]; ring,
    ⟨by rw [p1_eval]; norm_num, by norm_num⟩, ⟨by rw [p1_eval]; norm_num, by norm_num, by norm_num⟩⟩
  · rw [show (25 : ℝ) = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · have : x ^ 2 + x - 6 = (x - 2) * (x + 3) := by ring
    rw [this, mul_eq_zero, sub_eq_zero, add_eq_zero_iff_eq_neg]

/-- Naloga B1b, napaka: brez koeficienta 0 pri x² bi Horner računal s ½x² − 7/2x + 3 in pri x = 1 dobil ostanek
½ − 7/2 + 3 = 0 ter količnik ½x − 3 (stopnja 1), ki ni pravi količnik ½x² + ½x − 3. -/
theorem b1b_napaka : (1 / 2 : ℝ) - 7 / 2 + 3 = 0 ∧ ¬ (∀ x : ℝ, 1 / 2 * x - 3 = 1 / 2 * x ^ 2 + 1 / 2 * x - 3) := by
  refine ⟨by norm_num, fun h => ?_⟩
  have := h 1; norm_num at this

/-! ## 2. del, naloga 2 -/

/-- Lesna zaloga območij A–F (v milijonih m³). -/
def z2 : Fin 6 → ℚ := ![48.6, 31.2, 55.8, 22.4, 39.4, 27.6]

/-- Podatki v desetinkah (za preverjanje ureditve z `decide`). -/
def z2d : List ℕ := [486, 312, 558, 224, 394, 276]

/-- Urejeni podatki v desetinkah. -/
def z2u : List ℕ := [224, 276, 312, 394, 486, 558]

/-- Naloga B2a, uradni odgovor in pot »Po korakih«: vsota 48,6 + 31,2 + 55,8 + 22,4 + 39,4 + 27,6 = 225,
x̄ = 225/6 = 37,5 (= 37 500 000 m³); urejeni podatki 22,4 < 27,6 < 31,2 < 39,4 < 48,6 < 55,8 (so preureditev
podatkov), Me = (31,2 + 39,4)/2 = 70,6/2 = 35,3; nad sredino so natanko A, C, E (indeksi 0, 2, 4). -/
theorem b2a_odgovor :
    (∑ i, z2 i = 225 ∧ (225 : ℚ) / 6 = 37.5 ∧ (37.5 : ℚ) * 1000000 = 37500000) ∧
    (z2u.Perm z2d ∧ z2u.Pairwise (· < ·) ∧ z2d.map (fun n => (n : ℚ) / 10) = List.ofFn z2 ∧
      z2u.map (fun n => (n : ℚ) / 10) = [22.4, 27.6, 31.2, 39.4, 48.6, 55.8]) ∧
    ((31.2 + 39.4) / 2 = (70.6 / 2 : ℚ) ∧ (70.6 / 2 : ℚ) = 35.3) ∧
    (∀ i : Fin 6, (37.5 : ℚ) < z2 i ↔ i = 0 ∨ i = 2 ∨ i = 4) := by
  refine ⟨⟨?_, by norm_num, by norm_num⟩, ⟨by decide, by decide, ?_, ?_⟩, ⟨by norm_num, by norm_num⟩, ?_⟩
  · simp [z2, Fin.sum_univ_succ]; norm_num
  · simp [z2d, z2, List.ofFn_succ]; norm_num
  · simp [z2u]; norm_num
  · intro i; fin_cases i <;> simp [z2] <;> norm_num

/-- Naloga B2a, pot »Drugače: z odmiki«: odmiki od 40 so 8,6; −8,8; 15,8; −17,6; −0,6; −12,4, vsota −15,
povprečni odmik −15/6 = −2,5, x̄ = 40 − 2,5 = 37,5; s črtanjem ostaneta 31,2 in 39,4, povprečje 35,3;
Me = 35,3 < 37,5 = x̄. -/
theorem b2a_drugace :
    ((48.6 : ℚ) - 40 = 8.6 ∧ (31.2 : ℚ) - 40 = -8.8 ∧ (55.8 : ℚ) - 40 = 15.8 ∧ (22.4 : ℚ) - 40 = -17.6 ∧
      (39.4 : ℚ) - 40 = -0.6 ∧ (27.6 : ℚ) - 40 = -12.4) ∧
    (8.6 : ℚ) - 8.8 + 15.8 - 17.6 - 0.6 - 12.4 = -15 ∧ (-15 : ℚ) / 6 = -2.5 ∧ (40 : ℚ) - 2.5 = 37.5 ∧
    ((31.2 : ℚ) + 39.4) / 2 = 35.3 ∧ (35.3 : ℚ) < 37.5 := by
  refine ⟨⟨?_, ?_, ?_, ?_, ?_, ?_⟩, ?_, ?_, ?_, ?_, ?_⟩ <;> norm_num

/-- Naloga B2a, napaka: povprečje 3. in 4. vrednosti iz neurejene preglednice je (55,8 + 22,4)/2 = 39,1 ≠ 35,3. -/
theorem b2a_napaka : (z2 2 + z2 3) / 2 = 39.1 ∧ (39.1 : ℚ) ≠ 35.3 := by
  simp [z2]; norm_num

/-- Model lesne zaloge V(t) = 225 · e^(0,006 t). -/
noncomputable def V2 (t : ℝ) : ℝ := 225 * exp (0.006 * t)

/-- Naloga B2b, uradni odgovor in pot »Po korakih«: 2070 − 2020 = 50, 2120 − 2020 = 100; V(0) = 225 · e⁰ =
225 · 1 = 225,0; V(50) = 225 · e^0,3, e^0,3 ≈ 1,34986, V(50) ≈ 303,7; V(100) = 225 · e^0,6, e^0,6 ≈ 1,82212,
V(100) ≈ 410,0. -/
theorem b2b_tabela :
    ((2070 : ℝ) - 2020 = 50 ∧ (2120 : ℝ) - 2020 = 100) ∧
    (V2 0 = 225 * exp 0 ∧ 225 * exp 0 = 225 * 1 ∧ (225 : ℝ) * 1 = 225.0) ∧
    (V2 50 = 225 * exp 0.3 ∧ Zaokr 5 1.34986 (exp 0.3) ∧ Zaokr 1 303.7 (V2 50)) ∧
    (V2 100 = 225 * exp 0.6 ∧ Zaokr 5 1.82212 (exp 0.6) ∧ Zaokr 1 410.0 (V2 100)) := by
  obtain ⟨a1, a2⟩ := ocena_exp03
  obtain ⟨b1, b2⟩ := ocena_exp06
  have e50 : V2 50 = 225 * exp 0.3 := by unfold V2; norm_num
  have e100 : V2 100 = 225 * exp 0.6 := by unfold V2; norm_num
  unfold Zaokr
  refine ⟨⟨by norm_num, by norm_num⟩, ⟨by unfold V2; norm_num, by rw [exp_zero], by norm_num⟩,
    ⟨e50, ⟨by norm_num; linarith, by norm_num; linarith⟩, ?_⟩, ⟨e100, ⟨by norm_num; linarith, by norm_num; linarith⟩, ?_⟩⟩
  · rw [e50]; constructor <;> norm_num <;> linarith
  · rw [e100]; constructor <;> norm_num <;> linarith

/-- Naloga B2b, odvod: V'(t) = 225 · 0,006 · e^(0,006t) = 1,35 · e^(0,006t); V'(0) = 1,35 · e⁰ = 1,35. -/
theorem b2b_odvod (t : ℝ) :
    HasDerivAt V2 (225 * (0.006 * exp (0.006 * t))) t ∧ (225 : ℝ) * 0.006 = 1.35 ∧
    deriv V2 t = 1.35 * exp (0.006 * t) ∧ deriv V2 0 = 1.35 := by
  have d : ∀ t, HasDerivAt V2 (225 * (0.006 * exp (0.006 * t))) t := fun t => by
    have := (((hasDerivAt_id' t).const_mul (0.006 : ℝ)).exp).const_mul (225 : ℝ)
    unfold V2
    convert this using 1; ring
  have dd : ∀ t, deriv V2 t = 1.35 * exp (0.006 * t) := fun t => by
    rw [(d t).deriv]; ring
  refine ⟨d t, by norm_num, dd t, ?_⟩
  rw [dd]; simp

/-- Naloga B2b, pot »Drugače«: v 50 letih se zaloga pomnoži z e^(0,006·50) = e^0,3 ≈ 1,34986 (rast ≈ 35 %);
V(100) = V(50) · e^0,3; 225 · 1,34986 = 303,7185 ≈ 303,72 in V(50) ≈ 303,72; 303,72 · 1,34986 ≈ 409,98 in
V(100) ≈ 409,98; V(1) − V(0) = 225(e^0,006 − 1), e^0,006 − 1 ≈ 0,006018, 225 · 0,006018 ≈ 1,354 in
V(1) − V(0) ≈ 1,354 ≈ V'(0) = 1,35. -/
theorem b2b_drugace :
    (0.006 * 50 : ℝ) = 0.3 ∧ Zaokr 2 0.35 (exp 0.3 - 1) ∧
    (∀ t, V2 (t + 50) = V2 t * exp 0.3) ∧
    ((225 : ℝ) * 1.34986 = 303.7185 ∧ Zaokr 2 303.72 303.7185 ∧ Zaokr 2 303.72 (V2 50)) ∧
    (Zaokr 2 409.98 (303.72 * 1.34986) ∧ Zaokr 2 409.98 (V2 100)) ∧
    (V2 1 - V2 0 = 225 * (exp 0.006 - 1) ∧ Zaokr 6 0.006018 (exp 0.006 - 1) ∧
      Zaokr 3 1.354 (225 * 0.006018) ∧ Zaokr 3 1.354 (V2 1 - V2 0)) := by
  obtain ⟨a1, a2⟩ := ocena_exp03
  obtain ⟨b1, b2⟩ := ocena_exp06
  obtain ⟨c1, c2⟩ := ocena_exp0006
  have e50 : V2 50 = 225 * exp 0.3 := by unfold V2; norm_num
  have e100 : V2 100 = 225 * exp 0.6 := by unfold V2; norm_num
  have e1 : V2 1 - V2 0 = 225 * (exp 0.006 - 1) := by unfold V2; norm_num; ring
  have per : ∀ t, V2 (t + 50) = V2 t * exp 0.3 := fun t => by
    unfold V2; rw [mul_assoc, ← exp_add]; norm_num; ring_nf
  unfold Zaokr
  refine ⟨by norm_num, ⟨by norm_num; linarith, by norm_num; linarith⟩, per,
    ⟨by norm_num, by norm_num, ?_⟩, ⟨by norm_num, ?_⟩, ⟨e1, ?_, by norm_num, ?_⟩⟩
  · rw [e50]; constructor <;> norm_num <;> linarith
  · rw [e100]; constructor <;> norm_num <;> linarith
  · constructor <;> norm_num <;> linarith
  · rw [e1]; constructor <;> norm_num <;> linarith

/-- Naloga B2b, napaka: pozabljen notranji odvod – (e^(0,006t))' = 0,006 · e^(0,006t), ne e^(0,006t). -/
theorem b2b_napaka (t : ℝ) : deriv (fun t : ℝ => exp (0.006 * t)) t = 0.006 * exp (0.006 * t) ∧
    deriv (fun t : ℝ => exp (0.006 * t)) t ≠ exp (0.006 * t) := by
  have d : deriv (fun t : ℝ => exp (0.006 * t)) t = 0.006 * exp (0.006 * t) := by
    rw [(((hasDerivAt_id' t).const_mul (0.006 : ℝ)).exp).deriv]; ring
  refine ⟨d, ?_⟩
  rw [d]; intro h
  have := exp_pos (0.006 * t)
  nlinarith

/-! ## 2. del, naloga 3 -/

/-- Naloga B3a, uradni odgovor: 5, x, 45 so zaporedni členi geometrijskega zaporedja (x = 5q, 45 = xq za neki q)
natanko za x = 15 ali x = −15. -/
theorem b3a_odgovor (x : ℝ) : (∃ q : ℝ, x = 5 * q ∧ 45 = x * q) ↔ x = 15 ∨ x = -15 := by
  constructor
  · rintro ⟨q, rfl, h⟩
    have : (q - 3) * (q + 3) = 0 := by linear_combination -h / 5
    rcases mul_eq_zero.mp this with h | h
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl)
    · exact ⟨3, by norm_num, by norm_num⟩
    · exact ⟨-3, by norm_num, by norm_num⟩

/-- Naloga B3a, pot »Po korakih (enaka količnika)«: x/5 = 45/x (x ≠ 0, sicer Lean da 0 = 0) ⇔ x² = 5 · 45 = 225
⇔ x = 15 ali x = −15; q = 15/5 = 3 (5, 15, 45, … narašča), q = −15/5 = −3 (5, −15, 45, … alternira, ne narašča). -/
theorem b3a_kolicnika :
    (∀ x : ℝ, (x ≠ 0 ∧ x / 5 = 45 / x) ↔ (x ≠ 0 ∧ x ^ 2 = 5 * 45)) ∧ (5 : ℝ) * 45 = 225 ∧
    (∀ x : ℝ, x ^ 2 = 225 ↔ x = 15 ∨ x = -15) ∧
    ((15 : ℝ) / 5 = 3 ∧ (-15 : ℝ) / 5 = -3) ∧
    StrictMono (fun n : ℕ => (5 : ℝ) * 3 ^ n) ∧
    ((∀ n : ℕ, 0 < (5 : ℝ) * (-3) ^ (2 * n) ∧ (5 : ℝ) * (-3) ^ (2 * n + 1) < 0) ∧
      ¬ Monotone (fun n : ℕ => (5 : ℝ) * (-3) ^ n)) := by
  refine ⟨fun x => ⟨fun ⟨h0, h⟩ => ⟨h0, ?_⟩, fun ⟨h0, h⟩ => ⟨h0, ?_⟩⟩, by norm_num, fun x => ?_,
    ⟨by norm_num, by norm_num⟩, ?_, ⟨fun n => ⟨?_, ?_⟩, ?_⟩⟩
  · field_simp at h; linarith
  · field_simp; linarith
  · have : x ^ 2 - 225 = (x - 15) * (x + 15) := by ring
    rw [← sub_eq_zero, this, mul_eq_zero, sub_eq_zero, add_eq_zero_iff_eq_neg]
  · exact strictMono_nat_of_lt_succ fun n => by rw [pow_succ]; nlinarith [pow_pos (by norm_num : (0:ℝ) < 3) n]
  · rw [pow_mul]; norm_num
  · rw [pow_succ, pow_mul]; norm_num
  · intro h
    have := h (show 0 ≤ 1 by norm_num)
    norm_num at this

example : ∃ x : ℝ, x ≠ 0 ∧ x / 5 = 45 / x := ⟨15, by norm_num, by norm_num⟩

/-- Naloga B3a, pot »Drugače: prek splošnega člena«: 45 = 5q² ⇔ q² = 9 ⇔ q = 3 ali q = −3; x = 5q:
5 · 3 = 15, 5 · (−3) = −15; za a₁ > 0 je zaporedje a₁qⁿ naraščajoče natanko za q > 1 (torej le pri q = 3);
preizkus 15 · 3 = 45, (−15) · (−3) = 45. -/
theorem b3a_splosni_clen :
    (∀ q : ℝ, 45 = 5 * q ^ 2 ↔ q ^ 2 = 9) ∧ (∀ q : ℝ, q ^ 2 = 9 ↔ q = 3 ∨ q = -3) ∧
    ((5 : ℝ) * 3 = 15 ∧ (5 : ℝ) * (-3) = -15) ∧
    (∀ a₁ q : ℝ, 0 < a₁ → (StrictMono (fun n : ℕ => a₁ * q ^ n) ↔ 1 < q)) ∧
    ((15 : ℝ) * 3 = 45 ∧ (-15 : ℝ) * (-3) = 45) := by
  refine ⟨fun q => ⟨fun h => by linarith, fun h => by linarith⟩, fun q => ?_, ⟨by norm_num, by norm_num⟩,
    fun a₁ q ha => ⟨fun h => ?_, fun h => ?_⟩, ⟨by norm_num, by norm_num⟩⟩
  · have : q ^ 2 - 9 = (q - 3) * (q + 3) := by ring
    rw [← sub_eq_zero, this, mul_eq_zero, sub_eq_zero, add_eq_zero_iff_eq_neg]
  · have := h (show 0 < 1 by norm_num)
    simp only [pow_zero, mul_one, pow_one] at this
    by_contra hq; push Not at hq
    nlinarith
  · exact strictMono_nat_of_lt_succ fun n => by
      rw [pow_succ]
      have := pow_pos (by linarith : (0:ℝ) < q) n
      nlinarith [mul_pos ha this]

example : ∃ a₁ : ℝ, 0 < a₁ := ⟨5, by norm_num⟩

/-- Naloga B3a, napaka: aritmetična sredina (5 + 45)/2 = 25 ni geometrijski srednji člen (25² ≠ 225). -/
theorem b3a_napaka : ((5 + 45) / 2 : ℝ) = 25 ∧ (25 : ℝ) ^ 2 ≠ 225 := by
  refine ⟨by norm_num, by norm_num⟩

/-- Splošni člen aritmetičnega zaporedja a₁ = 5, d = 20: aₙ = 5 + (n − 1) · 20 (v ℤ). -/
def a3 (n : ℕ) : ℤ := 5 + ((n : ℤ) - 1) * 20

/-- Naloga B3b, pot »Po korakih«: x = a₂ = 5 + 20 = 25 (25 + 20 = 45); aₙ = 20n − 15; za n ≥ 1:
20n − 15 < 10 000 ⇔ 20n < 10 015 ⇔ n < 500,75 ⇔ n ≤ 500; preizkus a₅₀₀ = 9985 < 10 000, a₅₀₁ = 10 005 > 10 000. -/
theorem b3b_po_korakih :
    (a3 2 = 5 + 20 ∧ (5 : ℤ) + 20 = 25 ∧ (25 : ℤ) + 20 = 45 ∧ a3 3 = 45) ∧
    (∀ n, a3 n = 20 * n - 15) ∧
    (∀ n : ℕ, (20 * (n : ℤ) - 15 < 10000 ↔ 20 * (n : ℤ) < 10015) ∧
      (20 * (n : ℤ) < 10015 ↔ (n : ℝ) < 500.75) ∧ ((n : ℝ) < 500.75 ↔ n ≤ 500)) ∧
    (a3 500 = 20 * 500 - 15 ∧ (20 * 500 - 15 : ℤ) = 9985 ∧ a3 500 < 10000) ∧
    (a3 501 = 20 * 501 - 15 ∧ (20 * 501 - 15 : ℤ) = 10005 ∧ 10000 < a3 501) := by
  refine ⟨⟨by simp [a3], by norm_num, by norm_num, by norm_num [a3]⟩, fun n => by unfold a3; ring,
    fun n => ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => ?_, fun h => ?_⟩, ⟨fun h => ?_, fun h => ?_⟩⟩,
    ⟨by norm_num [a3], by norm_num, by norm_num [a3]⟩, ⟨by norm_num [a3], by norm_num,
    by norm_num [a3]⟩⟩
  · have : (20 * (n : ℝ)) < 10015 := by exact_mod_cast h
    linarith
  · have : (20 * (n : ℝ)) < 10015 := by linarith
    exact_mod_cast this
  · by_contra hn; push Not at hn
    have : (501 : ℝ) ≤ n := by exact_mod_cast hn
    linarith
  · have : (n : ℝ) ≤ 500 := by exact_mod_cast h
    linarith

/-- Naloga B3b, uradni odgovor: x = 25; členov, manjših od 10 000, je natanko 500 (n = 1, …, 500). -/
theorem b3b_odgovor : a3 2 = 25 ∧ {n : ℕ | 1 ≤ n ∧ a3 n < 10000} = ↑(Finset.Icc 1 500) ∧
    {n : ℕ | 1 ≤ n ∧ a3 n < 10000}.ncard = 500 := by
  have hs : {n : ℕ | 1 ≤ n ∧ a3 n < 10000} = ↑(Finset.Icc 1 500) := by
    ext n
    simp only [Set.mem_ofPred_eq, Finset.coe_Icc, Set.mem_Icc, a3]
    constructor
    · rintro ⟨h1, h2⟩; exact ⟨h1, by omega⟩
    · rintro ⟨h1, h2⟩; exact ⟨h1, by omega⟩
  refine ⟨by norm_num [a3], hs, ?_⟩
  rw [hs, Set.ncard_coe_finset]; simp

/-- Naloga B3b, pot »Drugače: največji člen pod mejo«: x = (5 + 45)/2 = 25, d = 25 − 5 = 20; členi so 5 + 20k
in dajo ostanek 5 pri deljenju z 20; 10 000 = 20 · 500; največje število pod 10 000 z ostankom 5 je
20 · 499 + 5 = 9985 (in je člen a₅₀₀); (9985 − 5)/20 + 1 = 499 + 1 = 500. -/
theorem b3b_drugace :
    ((5 + 45) / 2 = (25 : ℚ) ∧ (25 : ℤ) - 5 = 20) ∧
    (∀ k : ℕ, a3 (k + 1) = 5 + 20 * k ∧ (5 + 20 * (k : ℤ)) % 20 = 5) ∧
    (10000 : ℤ) = 20 * 500 ∧
    (20 * 499 + 5 = (9985 : ℤ) ∧ IsGreatest {m : ℤ | m < 10000 ∧ m % 20 = 5} 9985 ∧ a3 500 = 9985) ∧
    ((9985 - 5) / 20 + 1 = (499 + 1 : ℤ) ∧ (499 + 1 : ℤ) = 500) := by
  refine ⟨⟨by norm_num, by norm_num⟩, fun k => ⟨by unfold a3; push_cast; ring, by omega⟩, by norm_num,
    ⟨by norm_num, ⟨⟨by norm_num, by norm_num⟩, fun m ⟨h1, h2⟩ => by omega⟩, by norm_num [a3]⟩,
    ⟨by norm_num, by norm_num⟩⟩

/-- Naloga B3b, napaki: n < 500,75 ne pomeni 501 členov (a₅₀₁ = 10 005 > 10 000); predpis 5 + 20n da za prvi
člen 5 + 20 · 1 = 25 namesto 5. -/
theorem b3b_napaka : 10000 < a3 501 ∧ (5 : ℤ) + 20 * 1 = 25 ∧ (25 : ℤ) ≠ a3 1 := by
  refine ⟨by norm_num [a3], by norm_num, by simp [a3]⟩

end Evklid.Pole.POKLICNA_MAT_2024_spomladanski
