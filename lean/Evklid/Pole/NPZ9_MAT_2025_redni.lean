/-
vir: content/exam-papers/NPZ9-MAT-2025-redni.json
sha256: 213fe6fa36deeb14b66ec57a03354b47948de36cf47bc781d2a73b731e6363c3
Ni v Leanu: 4 trikotnik je model v ℂ (C = 0, A = 12, B = 5i, torej a = |BC| = 5, b = |CA| = 12, c = |AB| = 13);
da je vsak trikotnik s temi podatki skladen z modelom, ni dokazano (vse trditve 4. naloge veljajo za model).
4a »višina« je zapisana kot najkrajša razdalja od oglišča do premice nosilke (dokazano je, da je vznožje
pravokotne projekcije najbližja točka premice); da presečišče višin leži v C (napaka v 4b), sledi iz tega,
da sta višini v_a in v_b daljici AC in BC (dokazano), presečišče premic samo ni zapisano posebej.
4b »Talesova krožnica« je zapisana kot: razpolovišče M hipotenuze je enako oddaljeno od A, B, C (6,5) in je
edina taka točka (↔); splošni Talesov izrek za vsak pravokotni trikotnik ni dokazan (le model).
4c risanje (šestilo, ravnilo, geotrikotnik, merjenje) ni dokazano; dokazano je, da je S razpolovišče AB,
|AS| = |SB| = |SC| = 6,5, da je simetrala množica točk, enako oddaljenih od A in B (Mathlibov `perpBisector`),
in da se loka z enakim polmerom r sekata le, če je 2r ≥ 13 (napaka); obstoj dveh presečišč za r = 8 in
pravi kot med simetralo in AB nista dokazana (risba). 4e, 6a, 9 obrazci za ploščino (a·b/2, x·y, x²) in
prostornino (a³, O·v) so uporabljeni kot podatek (Mathlib nima ploščine lika iz slike); dokazani so računi.
6a, 6b razdelitev lika in obhod po robu sta odčitek s slike; dokazana sta obrazca in računi (obseg je vsota
dolžin, ki jih našteje rešitev). 5 pretvorbe enot (1 m = 10 dm = 100 cm = 1000 mm, 1 km = 1000 m,
1 h = 60 min, 1 min = 60 s, 1 dm³ = 1 l = 10 dl = 1000 ml = 1000 cm³, 1 m³ = 1000 dm³, 1 m² = 100 dm²,
1 dm² = 100 cm²) so zapisane kot definicije: vsaka izbira je pretvorjena v isto enoto. 8 verjetnost je
zapisana kot ugodni : vsi izidi (definicija iz rešitve); verjetnostni prostor ni zapisan. 9 skica hiške in
»streha na kocki« sta razlaga; prostornina telesa je vsota prostornin (podatek). 2 »praštevilo« in »delitelji«
sta pojma na ℕ (`Nat.Prime`, `Nat.divisors`), »kvadrat« v seznamu je n = k² za k ≤ 10 (n ≤ 90 < 11²).
Besedilne razlage (»vejico premaknemo«, »preglednica mest«, »številska premica«, ocena »približno osemkrat«
je dokazana kot 8 ≤ 5 : 0,6 < 9) niso trditve, kjer niso števila.
Decimalna števila so točna racionalna (ℚ) ali realna (ℝ) števila. Konvencije Leana: x/0 = 0 (deljenje z 0 se
ne uporabi), √ negativnega je 0 (korena sta le iz pozitivnih števil), kot z ničelnim vektorjem je π/2 (pri 4
so vse uporabljene točke različne), odštevanje v ℕ se uporabi le pri 25 − 8 in podobnem (manjše od večjega).
Zaokroževanje je Mathlibov `round` (⌊x + 1/2⌋).
-/
module

public import Mathlib

public section

namespace Evklid.Pole.NPZ9_MAT_2025_redni

open EuclideanGeometry Complex

/-! ## Naloga 1 -/

/-- Naloga 1a, uradni odgovor: 3/4 + 5/6 = 19/12 = 1 7/12. -/
theorem n1a : (3 / 4 + 5 / 6 : ℚ) = 19 / 12 ∧ (19 / 12 : ℚ) = 1 + 7 / 12 := by norm_num

/-- Naloga 1a, pot »Po korakih«: v(4, 6) = 12, 3/4 = 9/12, 5/6 = 10/12, 9/12 + 10/12 = 19/12; ulomek je
okrajšan, ker je 19 praštevilo (in ne deli 12); 19/12 = 1 7/12. -/
theorem n1a_koraki : Nat.lcm 4 6 = 12 ∧ (3 / 4 : ℚ) = 9 / 12 ∧ (5 / 6 : ℚ) = 10 / 12 ∧
    (9 / 12 + 10 / 12 : ℚ) = 19 / 12 ∧ Nat.Prime 19 ∧ Nat.Coprime 19 12 ∧ (19 / 12 : ℚ) = 1 + 7 / 12 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 1a, pot »Drugače: s produktom imenovalcev«: 4·6 = 24;
3/4 + 5/6 = (3·6 + 5·4)/24 = (18 + 20)/24 = 38/24 = 19/12. -/
theorem n1a_produkt : 4 * 6 = 24 ∧ (3 / 4 + 5 / 6 : ℚ) = 19 / 12 := by
  refine ⟨by norm_num, ?_⟩
  calc (3 / 4 + 5 / 6 : ℚ) = (3 * 6 + 5 * 4) / 24 := by norm_num
    _ = (18 + 20) / 24 := by norm_num
    _ = 38 / 24 := by norm_num
    _ = 19 / 12 := by norm_num

/-- Naloga 1a, napaka: (3 + 5)/(4 + 6) = 8/10 ni vsota ulomkov. -/
theorem n1a_napaka : ((3 + 5) / (4 + 6) : ℚ) = 8 / 10 ∧ (8 / 10 : ℚ) ≠ 3 / 4 + 5 / 6 := by norm_num

/-- Naloga 1b, pot »Z decimalnimi števili«: 3/4 = 0,75; −1,25 − (−0,75) = −1,25 + 0,75 = −0,5 = −1/2. -/
theorem n1b : (3 / 4 : ℚ) = 0.75 ∧ (-1.25 : ℚ) - (-(3 / 4)) = -0.5 ∧ (-0.5 : ℚ) = -1 / 2 := by
  refine ⟨by norm_num, ?_, by norm_num⟩
  calc (-1.25 : ℚ) - (-(3 / 4)) = -1.25 - (-0.75) := by norm_num
    _ = -1.25 + 0.75 := by norm_num
    _ = -0.5 := by norm_num

/-- Naloga 1b, pot »Drugače: z ulomki«: −1,25 = −125/100 = −5/4;
−5/4 − (−3/4) = −5/4 + 3/4 = −2/4 = −1/2. -/
theorem n1b_ulomki : (-1.25 : ℚ) = -125 / 100 ∧ (-125 / 100 : ℚ) = -5 / 4 ∧
    (-5 / 4 : ℚ) - (-(3 / 4)) = -1 / 2 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  calc (-5 / 4 : ℚ) - (-(3 / 4)) = -5 / 4 + 3 / 4 := by norm_num
    _ = -2 / 4 := by norm_num
    _ = -1 / 2 := by norm_num

/-- Naloga 1b, pot »S številsko premico«: premik od −1,25 za 0,75 v desno pristane pri −0,5. -/
theorem n1b_premica : (-1.25 : ℚ) + 0.75 = -0.5 := by norm_num

/-- Naloga 1b, napaka: −1,25 − 0,75 = −2 ni rezultat. -/
theorem n1b_napaka : (-1.25 : ℚ) - 0.75 = -2 ∧ (-2 : ℚ) ≠ -1.25 - (-(3 / 4)) := by norm_num

/-- Naloga 1c, pot »Po korakih: najprej potenca«: (−0,2)³ = (−0,2)(−0,2)(−0,2) = −0,008 (predznak: trije
negativni faktorji; števke 2·2·2 = 8; decimalna mesta 1 + 1 + 1 = 3, tj. 0,008 = 8/10³);
−0,008·50 = −0,4. -/
theorem n1c : (-0.2 : ℚ) ^ 3 * 50 = -0.4 ∧ (-0.2 : ℚ) ^ 3 = (-0.2) * (-0.2) * (-0.2) ∧
    (-0.2 : ℚ) * (-0.2) * (-0.2) = -0.008 ∧ 2 * 2 * 2 = 8 ∧ 1 + 1 + 1 = 3 ∧ (0.008 : ℚ) = 8 / 10 ^ 3 ∧
    (-0.008 : ℚ) * 50 = -0.4 := by
  refine ⟨?_, by ring, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  calc (-0.2 : ℚ) ^ 3 * 50 = (-0.2) * (-0.2) * (-0.2) * 50 := by ring
    _ = -0.008 * 50 := by norm_num
    _ = -0.4 := by norm_num

/-- Naloga 1c, pot »Drugače: z ulomkom«: −0,2 = −1/5, (−1/5)³ = −1/125;
−1/125·50 = −50/125 = −2/5 = −0,4. -/
theorem n1c_ulomek : (-0.2 : ℚ) = -1 / 5 ∧ (-1 / 5 : ℚ) ^ 3 = -1 / 125 ∧ (-1 / 125 : ℚ) * 50 = -0.4 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  calc (-1 / 125 : ℚ) * 50 = -50 / 125 := by norm_num
    _ = -2 / 5 := by norm_num
    _ = -0.4 := by norm_num

/-- Naloga 1c, napaki: (−0,2)³ ni −0,6 (to je 3·(−0,2)) in ni 0,008. -/
theorem n1c_napaka : 3 * (-0.2 : ℚ) = -0.6 ∧ (-0.2 : ℚ) ^ 3 ≠ -0.6 ∧ (-0.2 : ℚ) ^ 3 ≠ 0.008 := by norm_num

/-- Naloga 1d, pot »Razširimo količnik«: 4,86 : 0,6 = 48,6 : 6 (oba pomnožimo z 10);
48,6 : 6 = 8,1, ker je 6·8 = 48 in 6·0,1 = 0,6. -/
theorem n1d : (4.86 / 0.6 : ℚ) = 8.1 ∧ (4.86 / 0.6 : ℚ) = (4.86 * 10) / (0.6 * 10) ∧
    (4.86 * 10 : ℚ) = 48.6 ∧ (0.6 * 10 : ℚ) = 6 ∧ (48.6 / 6 : ℚ) = 8.1 ∧ 6 * 8 = 48 ∧ (6 * 0.1 : ℚ) = 0.6 ∧
    (48.6 : ℚ) = 6 * 8 + 6 * 0.1 ∧ (8 + 0.1 : ℚ) = 8.1 := by
  refine ⟨by norm_num, by rw [mul_div_mul_right _ _ (by norm_num : (10 : ℚ) ≠ 0)], by norm_num,
    by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 1d, pot »Preizkus z množenjem«: 8,1·0,6 = 4,86 (81·6 = 486, dve decimalni mesti). -/
theorem n1d_preizkus : (8.1 * 0.6 : ℚ) = 4.86 ∧ 81 * 6 = 486 ∧ (486 / 10 ^ 2 : ℚ) = 4.86 := by norm_num

/-- Naloga 1d, napaka in ocena: 0,81 in 81 nista rezultat; 5 : 0,6 je med 8 in 9 (»približno osemkrat«). -/
theorem n1d_napaka : (0.81 : ℚ) ≠ 4.86 / 0.6 ∧ (81 : ℚ) ≠ 4.86 / 0.6 ∧ (8 : ℚ) ≤ 5 / 0.6 ∧
    (5 / 0.6 : ℚ) < 9 := by norm_num

/-- Naloga 1e, pot »Po korakih«: 3² = 9, 1 − 9 = −8, 2·(−8) = −16, −16 : 4 = −4, 18 − (−4) = 18 + 4 = 22
(v Leanu `18 - 2 * (1 - 3 ^ 2) / 4` pomeni 18 − ((2·(1 − 3²)) : 4), množenje in deljenje od leve proti desni). -/
theorem n1e : (18 - 2 * (1 - 3 ^ 2) / 4 : ℚ) = 22 ∧ (3 : ℚ) ^ 2 = 9 ∧ (1 - 9 : ℚ) = -8 ∧ (2 * (-8) : ℚ) = -16 ∧
    (-16 / 4 : ℚ) = -4 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  calc (18 - 2 * (1 - 3 ^ 2) / 4 : ℚ) = 18 - 2 * (1 - 9) / 4 := by norm_num
    _ = 18 - 2 * (-8) / 4 := by norm_num
    _ = 18 - (-16) / 4 := by norm_num
    _ = 18 - (-4) := by norm_num
    _ = 18 + 4 := by norm_num
    _ = 22 := by norm_num

/-- Naloga 1e, pot »Drugače: deljenje kot ulomek«: 18 − 2·(1 − 9)/4 = 18 − (−16)/4 = 18 − (−4) = 22. -/
theorem n1e_ulomek : (18 - 2 * (1 - 9) / 4 : ℚ) = 22 := by
  calc (18 - 2 * (1 - 9) / 4 : ℚ) = 18 - (-16) / 4 := by norm_num
    _ = 18 - (-4) := by norm_num
    _ = 22 := by norm_num

/-- Naloga 1e, napaki: začeti z 18 − 2 = 16 da 16·(−8) : 4 = −32 ≠ 22; (1 − 3)² = 4 ≠ 1 − 3² = −8. -/
theorem n1e_napaka : (18 - 2 : ℚ) = 16 ∧ (16 * (1 - 3 ^ 2) / 4 : ℚ) = -32 ∧ (-32 : ℚ) ≠ 22 ∧
    ((1 - 3) ^ 2 : ℚ) = 4 ∧ (1 - 3 ^ 2 : ℚ) = -8 ∧ ((1 - 3) ^ 2 : ℚ) ≠ 1 - 3 ^ 2 := by norm_num

/-! ## Naloga 2 -/

/-- Seznam iz 2. naloge. -/
def L : Finset ℕ := {27, 64, 1, 49, 90, 19, 72, 15, 31, 23}

/-- Naloga 2a, uradni odgovor: praštevila v seznamu so 19, 23, 31; najmanjše je 19. -/
theorem n2a : L.filter Nat.Prime = {19, 23, 31} ∧ 19 ∈ L.filter Nat.Prime ∧
    ∀ p ∈ L.filter Nat.Prime, 19 ≤ p := by
  refine ⟨by decide, by decide, by decide⟩

/-- Naloga 2a, pot »Po korakih«: 1 ni praštevilo; 15 = 3·5, 27 = 3·9, 49 = 7·7, 64 = 8·8, 72 = 8·9,
90 = 9·10 so sestavljena; 19, 23, 31 so praštevila. -/
theorem n2a_koraki : ¬ Nat.Prime 1 ∧ Nat.divisors 1 = {1} ∧ 15 = 3 * 5 ∧ 27 = 3 * 9 ∧ 49 = 7 * 7 ∧
    64 = 8 * 8 ∧ 72 = 8 * 9 ∧ 90 = 9 * 10 ∧ ¬ Nat.Prime 15 ∧ ¬ Nat.Prime 27 ∧ ¬ Nat.Prime 49 ∧
    ¬ Nat.Prime 64 ∧ ¬ Nat.Prime 72 ∧ ¬ Nat.Prime 90 ∧ Nat.Prime 19 ∧ Nat.Prime 23 ∧ Nat.Prime 31 := by
  refine ⟨by norm_num, by decide, rfl, rfl, rfl, rfl, rfl, rfl, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 2a, pot »Drugače: od najmanjšega navzgor«: manjši od 19 sta v seznamu le 1 in 15; 15 je deljivo
s 3; 19 ni deljivo z 2, 3, 5; 5·5 = 25 > 19, zato je 19 praštevilo (deliteljev, večjih od 5, ni treba
preverjati: vsak delitelj d, 1 < d < 19, bi imel delitelj ≤ √19 < 5). -/
theorem n2a_navzgor : L.filter (· < 19) = {1, 15} ∧ 3 ∣ 15 ∧ ¬ 2 ∣ 19 ∧ ¬ 3 ∣ 19 ∧ ¬ 5 ∣ 19 ∧
    5 * 5 = 25 ∧ 19 < 25 ∧ (∀ d, 2 ≤ d → d * d ≤ 19 → ¬ d ∣ 19) ∧ Nat.Prime 19 := by
  refine ⟨by decide, by decide, by decide, by decide, by decide, rfl, by norm_num, ?_, by norm_num⟩
  intro d h2 hd
  have : d ≤ 4 := by nlinarith
  interval_cases d <;> decide

/-- Naloga 2a, napaka: 1 ni praštevilo. -/
theorem n2a_napaka : 1 ∈ L ∧ ¬ Nat.Prime 1 := ⟨by decide, by norm_num⟩

/-- Naloga 2b, uradni odgovor: edino število v seznamu z natanko tremi delitelji je 49. -/
theorem n2b : L.filter (fun n => (Nat.divisors n).card = 3) = {49} := by decide

/-- Naloga 2b, pot »S kvadrati praštevil«: kvadrat praštevila ima natanko tri delitelje (1, p, p²);
kvadrati v seznamu so 1 = 1², 49 = 7², 64 = 8²; praštevilo je le 7; delitelji 49 so 1, 7, 49. -/
theorem n2b_kvadrati : (∀ p : ℕ, p.Prime → (Nat.divisors (p ^ 2)).card = 3) ∧
    L.filter (fun n => ∃ k < 11, k ^ 2 = n) = {1, 49, 64} ∧ 1 = 1 ^ 2 ∧ 49 = 7 ^ 2 ∧ 64 = 8 ^ 2 ∧
    ¬ Nat.Prime 1 ∧ Nat.Prime 7 ∧ ¬ Nat.Prime 8 ∧ Nat.divisors 49 = {1, 7, 49} := by
  refine ⟨fun p hp => ?_, by decide, rfl, rfl, rfl, by norm_num, by norm_num, by norm_num, by decide⟩
  rw [Nat.divisors_prime_pow hp]; simp

/-- Naloga 2b, pot »Drugače: naštejemo delitelje« in napaka: 49 ima tri delitelje, 64 sedem
(1, 2, 4, 8, 16, 32, 64), 15 štiri (1, 3, 5, 15), praštevila dva, 1 enega; 64 je kvadrat, a nima treh. -/
theorem n2b_nastevanje : Nat.divisors 49 = {1, 7, 49} ∧ Nat.divisors 64 = {1, 2, 4, 8, 16, 32, 64} ∧
    (Nat.divisors 64).card = 7 ∧ Nat.divisors 15 = {1, 3, 5, 15} ∧ (Nat.divisors 15).card = 4 ∧
    (∀ p : ℕ, p.Prime → (Nat.divisors p).card = 2) ∧ (Nat.divisors 1).card = 1 := by
  refine ⟨by decide, by decide, by decide, by decide, by decide, fun p hp => ?_, by decide⟩
  rw [hp.divisors]; simp [hp.one_lt.ne]

/-- Naloga 2c, uradni odgovor in pot »Z deljenjem«: večkratniki 9 v seznamu so natanko 27, 72, 90
(27 = 3·9, 72 = 8·9, 90 = 10·9). -/
theorem n2c : L.filter (9 ∣ ·) = {27, 72, 90} ∧ 27 = 3 * 9 ∧ 72 = 8 * 9 ∧ 90 = 10 * 9 := by
  refine ⟨by decide, rfl, rfl, rfl⟩

/-- Naloga 2c, pot »S pravilom za deljivost z 9«: 9 ∣ n ⇔ 9 deli vsoto števk; vsote števk:
27 → 9, 72 → 9, 90 → 9, 64 → 10, 49 → 13, 19 → 10, 15 → 6, 31 → 4, 23 → 5, 1 → 1. -/
theorem n2c_stevke : (∀ n : ℕ, 9 ∣ n ↔ 9 ∣ (Nat.digits 10 n).sum) ∧
    (Nat.digits 10 27).sum = 9 ∧ (Nat.digits 10 72).sum = 9 ∧ (Nat.digits 10 90).sum = 9 ∧
    (Nat.digits 10 64).sum = 10 ∧ (Nat.digits 10 49).sum = 13 ∧ (Nat.digits 10 19).sum = 10 ∧
    (Nat.digits 10 15).sum = 6 ∧ (Nat.digits 10 31).sum = 4 ∧ (Nat.digits 10 23).sum = 5 ∧
    (Nat.digits 10 1).sum = 1 ∧ 2 + 7 = 9 ∧ 7 + 2 = 9 ∧ 9 + 0 = 9 ∧ 6 + 4 = 10 ∧ 4 + 9 = 13 ∧
    1 + 9 = 10 ∧ 1 + 5 = 6 ∧ 3 + 1 = 4 ∧ 2 + 3 = 5 := by
  refine ⟨Nat.nine_dvd_iff, ?_⟩
  norm_num

/-- Naloga 2c, napaka: 1 ni večkratnik 9 (je njegov delitelj), 90 pa je. -/
theorem n2c_napaka : ¬ 9 ∣ 1 ∧ 1 ∣ 9 ∧ 9 ∣ 90 := by decide

/-- Naloga 2d: 4³ = 4·4·4 = 16·4 = 64 in 64 je v seznamu. -/
theorem n2d : 4 ^ 3 = 64 ∧ 64 ∈ L := by
  refine ⟨?_, by decide⟩
  calc 4 ^ 3 = 4 * 4 * 4 := by norm_num
    _ = 16 * 4 := by norm_num
    _ = 64 := by norm_num

/-- Naloga 2d, pot »Drugače: s potencami števila 2«: 4 = 2², 4³ = (2²)³ = 2⁶ = 64. -/
theorem n2d_dve : 4 = 2 ^ 2 ∧ 4 ^ 3 = 64 := by
  refine ⟨rfl, ?_⟩
  calc 4 ^ 3 = (2 ^ 2) ^ 3 := by norm_num
    _ = 2 ^ 6 := by rw [← pow_mul]
    _ = 64 := by norm_num

/-- Naloga 2d, napaka: 4·3 = 12 ≠ 4³. -/
theorem n2d_napaka : 4 * 3 = 12 ∧ 12 ≠ 4 ^ 3 := by decide

/-- Naloga 2e, uradni odgovor in pot »Z zaporednim deljenjem«: največje število je 90;
90 : 2 = 45, 45 : 3 = 15, 15 : 3 = 5, 5 : 5 = 1 (vsakič brez ostanka); 90 = 2·3·3·5 = 2·3²·5 in to je
razcep na prafaktorje. -/
theorem n2e : L.max' ⟨1, by decide⟩ = 90 ∧ 90 / 2 = 45 ∧ 90 % 2 = 0 ∧ 45 / 3 = 15 ∧ 45 % 3 = 0 ∧
    15 / 3 = 5 ∧ 15 % 3 = 0 ∧ 5 / 5 = 1 ∧ 5 % 5 = 0 ∧ 90 = 2 * 3 * 3 * 5 ∧ 2 * 3 * 3 * 5 = 2 * 3 ^ 2 * 5 ∧
    Nat.primeFactorsList 90 = [2, 3, 3, 5] := by
  refine ⟨by decide, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, by norm_num⟩

/-- Naloga 2e, pot »Drugače: z drevesom« in napaka: 90 = 9·10, 9 = 3·3, 10 = 2·5; 9 in 10 nista praštevili,
zato 90 = 9·10 še ni razcep. -/
theorem n2e_drevo : 90 = 9 * 10 ∧ 9 = 3 * 3 ∧ 10 = 2 * 5 ∧ 90 = 2 * 3 * 3 * 5 ∧ ¬ Nat.Prime 9 ∧
    ¬ Nat.Prime 10 := by
  refine ⟨rfl, rfl, rfl, rfl, by norm_num, by norm_num⟩

/-- Naloga 2f, uradni odgovor in poti »Po definiciji«, »S številsko premico«: vsa števila so pozitivna, zato
so nasprotne vrednosti negativne; −n je največja med nasprotnimi vrednostmi natanko za n = 1 (−1). -/
theorem n2f : (∀ m ∈ L, 0 < m ∧ -(m : ℤ) < 0) ∧
    ∀ n ∈ L, (∀ m ∈ L, -(m : ℤ) ≤ -(n : ℤ)) ↔ n = 1 := by
  have hmin : ∀ m ∈ L, 1 ≤ m := by decide
  refine ⟨fun m hm => ⟨hmin m hm, by have := hmin m hm; omega⟩, fun n hn => ⟨fun h => ?_, ?_⟩⟩
  · have h1 := h 1 (by decide)
    have := hmin n hn
    omega
  · rintro rfl m hm
    have := hmin m hm
    omega

/-- Naloga 2f, napaka: −90 je najmanjša nasprotna vrednost. -/
theorem n2f_napaka : ∀ m ∈ L, -(90 : ℤ) ≤ -(m : ℤ) := by
  have h : ∀ m ∈ L, m ≤ 90 := by decide
  intro m hm
  have := h m hm
  omega

/-! ## Naloga 3 -/

/-- Naloga 3a, pot »Po korakih«: 62,5 % = 62,5/100 = 0,625 = 625/1000 = 125/200 = 5/8 (625 : 5 = 125,
1000 : 5 = 200; 125 : 25 = 5, 200 : 25 = 8); 5/8 je okrajšan. -/
theorem n3a : (62.5 / 100 : ℚ) = 0.625 ∧ (0.625 : ℚ) = 5 / 8 ∧ Nat.Coprime 5 8 ∧
    625 / 5 = 125 ∧ 1000 / 5 = 200 ∧ 125 / 25 = 5 ∧ 200 / 25 = 8 := by
  refine ⟨by norm_num, ?_, by norm_num, rfl, rfl, rfl, rfl⟩
  calc (0.625 : ℚ) = 625 / 1000 := by norm_num
    _ = 125 / 200 := by norm_num
    _ = 5 / 8 := by norm_num

/-- Naloga 3a, pot »Drugače: prek osmine«: 100 % : 8 = 12,5 %, 12,5 % = 1/8; 62,5 % = 5·12,5 % = 5/8;
5 : 8 = 0,625. -/
theorem n3a_osmina : (100 / 8 : ℚ) = 12.5 ∧ (12.5 / 100 : ℚ) = 1 / 8 ∧ (62.5 : ℚ) = 5 * 12.5 ∧
    (5 * (1 / 8) : ℚ) = 5 / 8 ∧ (5 / 8 : ℚ) = 0.625 := by norm_num

/-- Naloga 3a, napaka in točkovanje: 6,25 ≠ 62,5 %; 625/1000 ni okrajšan (D(625, 1000) = 125). -/
theorem n3a_napaka : (6.25 : ℚ) ≠ 62.5 / 100 ∧ Nat.gcd 625 1000 = 125 := by norm_num

/-- Naloga 3b, pot »Po korakih«: 1,24 = 124/100 = 31/25 = 1 6/25 (delimo s 4; okrajšan); 1,24·100 % = 124 %. -/
theorem n3b : (1.24 : ℚ) = 124 / 100 ∧ (124 / 100 : ℚ) = 31 / 25 ∧ (31 / 25 : ℚ) = 1 + 6 / 25 ∧
    124 / 4 = 31 ∧ 100 / 4 = 25 ∧ Nat.Coprime 31 25 ∧ (1.24 * 100 : ℚ) = 124 := by
  refine ⟨by norm_num, by norm_num, by norm_num, rfl, rfl, by norm_num, by norm_num⟩

/-- Naloga 3b, pot »Drugače: celi del posebej«: 1,24 = 1 + 0,24, 0,24 = 24/100 = 6/25;
100 % + 24 % = 124 % > 100 %. -/
theorem n3b_celi : (1.24 : ℚ) = 1 + 0.24 ∧ (0.24 : ℚ) = 24 / 100 ∧ (24 / 100 : ℚ) = 6 / 25 ∧
    (100 + 24 : ℚ) = 124 ∧ (100 : ℚ) < 124 := by norm_num

/-- Naloga 3b, napaka: 12,4 % in 1,24 % nista 1,24. -/
theorem n3b_napaka : (12.4 / 100 : ℚ) ≠ 1.24 ∧ (1.24 / 100 : ℚ) ≠ 1.24 := by norm_num

/-- Naloga 3c, pot »Razširimo na tisočinke«: 40·25 = 1000; 3/40 = (3·25)/(40·25) = 75/1000 = 0,075;
0,075 = 7,5/100 = 7,5 %. -/
theorem n3c : 40 * 25 = 1000 ∧ (3 / 40 : ℚ) = 0.075 ∧ (0.075 : ℚ) = 7.5 / 100 := by
  refine ⟨rfl, ?_, by norm_num⟩
  calc (3 / 40 : ℚ) = (3 * 25) / (40 * 25) := by norm_num
    _ = 75 / 1000 := by norm_num
    _ = 0.075 := by norm_num

/-- Naloga 3c, pot »Drugače: najprej odstotek«: 100 % : 40 = 2,5 %; 3·2,5 % = 7,5 %; 7,5 % = 0,075. -/
theorem n3c_odstotek : (100 / 40 : ℚ) = 2.5 ∧ (3 * 2.5 : ℚ) = 7.5 ∧ (7.5 / 100 : ℚ) = 0.075 ∧
    (3 / 40 * 100 : ℚ) = 7.5 := by norm_num

/-- Naloga 3c, pot »Preizkus«: 40·0,075 = 3, zato 3 : 40 = 0,075. -/
theorem n3c_preizkus : (40 * 0.075 : ℚ) = 3 ∧ (3 / 40 : ℚ) = 0.075 := by norm_num

/-- Naloga 3c, napaka: 0,75 in 75 % nista 3/40; 3/40 < 4/40 = 1/10 = 10 %. -/
theorem n3c_napaka : (0.75 : ℚ) ≠ 3 / 40 ∧ (75 / 100 : ℚ) ≠ 3 / 40 ∧ (3 / 40 : ℚ) < 4 / 40 ∧
    (4 / 40 : ℚ) = 1 / 10 ∧ (1 / 10 : ℚ) = 10 / 100 := by norm_num

/-! ## Naloga 4

Model trikotnika v ℂ: C = 0, A = 12, B = 5i (kateta a = |BC| = 5, kateta b = |CA| = 12, hipotenuza
c = |AB| = 13). -/

/-- Kvadrat razdalje v ℂ: |z − w|² = (Re z − Re w)² + (Im z − Im w)². -/
theorem dsq (z w : ℂ) : dist z w ^ 2 = (z.re - w.re) ^ 2 + (z.im - w.im) ^ 2 := by
  rw [Complex.dist_eq, Complex.sq_norm, Complex.normSq_apply]; simp; ring

/-- Razdalja iz kvadrata razdalje. -/
theorem dist_iz_sq {z w : ℂ} {r : ℝ} (hr : 0 ≤ r) (h : (z.re - w.re) ^ 2 + (z.im - w.im) ^ 2 = r ^ 2) :
    dist z w = r := by
  rw [← Real.sqrt_sq dist_nonneg, dsq, h, Real.sqrt_sq hr]

/-- Predpostavke trditve `dist_iz_sq` se dajo izpolniti (z = 5i, w = 0, r = 5). -/
example : ∃ (z w : ℂ) (r : ℝ), 0 ≤ r ∧ (z.re - w.re) ^ 2 + (z.im - w.im) ^ 2 = r ^ 2 :=
  ⟨5 * I, 0, 5, by norm_num, by simp⟩

/-- Enakost razdalj v ℂ je enakost kvadratov razdalj. -/
theorem deq (z w u v : ℂ) : dist z w = dist u v ↔
    (z.re - w.re) ^ 2 + (z.im - w.im) ^ 2 = (u.re - v.re) ^ 2 + (u.im - v.im) ^ 2 := by
  rw [← dsq, ← dsq]; exact (pow_left_inj₀ dist_nonneg dist_nonneg two_ne_zero).symm

/-- Naloga 4 (uvod): model ima |BC| = 5, |CA| = 12, |AB| = 13 in pravi kot pri C (obrat Pitagorovega izreka). -/
theorem n4_model : dist (5 * I) (0 : ℂ) = 5 ∧ dist (0 : ℂ) 12 = 12 ∧ dist (12 : ℂ) (5 * I) = 13 ∧
    ∠ (12 : ℂ) 0 (5 * I) = Real.pi / 2 := by
  have h1 : dist (5 * I) (0 : ℂ) = 5 := dist_iz_sq (by norm_num) (by simp)
  have h2 : dist (0 : ℂ) 12 = 12 := dist_iz_sq (by norm_num) (by simp)
  have h3 : dist (12 : ℂ) (5 * I) = 13 := dist_iz_sq (by norm_num) (by simp; norm_num)
  refine ⟨h1, h2, h3, ?_⟩
  rw [← dist_sq_eq_dist_sq_add_dist_sq_iff_angle_eq_pi_div_two, h3, dist_comm, h2, h1]
  norm_num

/-- Splošno: če je ∠XYZ pravi, je Y najbližja točka premice XY točki Z: za vsak t je
|ZY| ≤ |Z, Y + t·(X − Y)|. To je »višina je pravokotna razdalja do nosilke«. -/
theorem najblizja {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (X Y Z : P) (hkot : ∠ X Y Z = Real.pi / 2) :
    ∀ t : ℝ, dist Z Y ≤ dist Z (AffineMap.lineMap Y X t) := by
  intro t
  have hin : inner ℝ (X -ᵥ Y) (Z -ᵥ Y) = 0 :=
    (InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two _ _).2 hkot
  have hX : Z -ᵥ AffineMap.lineMap Y X t = (Z -ᵥ Y) - t • (X -ᵥ Y) := by
    rw [AffineMap.lineMap_apply, vsub_vadd_eq_vsub_sub]
  have key : ‖(Z -ᵥ Y) - t • (X -ᵥ Y)‖ ^ 2 = ‖Z -ᵥ Y‖ ^ 2 + t ^ 2 * ‖X -ᵥ Y‖ ^ 2 := by
    rw [norm_sub_sq_real, real_inner_smul_right, real_inner_comm, hin, norm_smul, Real.norm_eq_abs,
      mul_pow, sq_abs]
    ring
  rw [dist_eq_norm_vsub V, dist_eq_norm_vsub V, hX]
  have h1 := norm_nonneg (Z -ᵥ Y)
  have h2 := norm_nonneg ((Z -ᵥ Y) - t • (X -ᵥ Y))
  have h3 : 0 ≤ t ^ 2 * ‖X -ᵥ Y‖ ^ 2 := by positivity
  nlinarith

/-- Predpostavka trditve `najblizja` se da izpolniti (model: ∠ACB = 90°). -/
example : ∃ X Y Z : ℂ, ∠ X Y Z = Real.pi / 2 := ⟨12, 0, 5 * I, n4_model.2.2.2⟩

/-- Naloga 4a, pravilna izjava (pot »Po definiciji višine«, »S sliko«): kateta b = AC je pravokotna na BC in
gre iz A, zato je C najbližja točka premice BC točki A: v_a = |AC| = 12. Prav tako v_b = |BC| = 5 ≠ 13
(izjava C je napačna). -/
theorem n4a : (∀ t : ℝ, dist (12 : ℂ) 0 ≤ dist (12 : ℂ) (AffineMap.lineMap 0 (5 * I) t)) ∧
    dist (12 : ℂ) 0 = 12 ∧
    (∀ t : ℝ, dist (5 * I : ℂ) 0 ≤ dist (5 * I : ℂ) (AffineMap.lineMap 0 12 t)) ∧
    dist (5 * I : ℂ) 0 = 5 ∧ (5 : ℝ) ≠ 13 := by
  obtain ⟨h1, h2, -, hk⟩ := n4_model
  refine ⟨najblizja _ _ _ (by rw [angle_comm]; exact hk), by rw [dist_comm, h2],
    najblizja _ _ _ hk, h1, by norm_num⟩

/-- Naloga 4a, višina v_c: vznožje H = 300/169 + 720/169·i = A + (144/169)·(B − A) leži na AB med A in B
(0 < 144/169 < 1, zato višina leži v trikotniku; izjava D je napačna), CH ⟂ AB (∠AHC = 90°),
v_c = |CH| = 60/13 je najkrajša razdalja od C do premice AB, 60/13 ≠ 5 (izjava B je napačna),
60/13 < 5 < 12 (krajša od obeh katet) in |60/13 − 4,6| < 0,05 (»približno 4,6 cm«). -/
theorem n4a_vc :
    AffineMap.lineMap (12 : ℂ) (5 * I) (144 / 169 : ℝ) = 300 / 169 + 720 / 169 * I ∧
    (0 : ℝ) < 144 / 169 ∧ (144 / 169 : ℝ) < 1 ∧
    ∠ (12 : ℂ) (300 / 169 + 720 / 169 * I) 0 = Real.pi / 2 ∧
    dist (0 : ℂ) (300 / 169 + 720 / 169 * I) = 60 / 13 ∧
    (∀ t : ℝ, dist (0 : ℂ) (300 / 169 + 720 / 169 * I) ≤
      dist (0 : ℂ) (AffineMap.lineMap (300 / 169 + 720 / 169 * I) 12 t)) ∧
    (60 / 13 : ℝ) ≠ 5 ∧ (60 / 13 : ℝ) < 5 ∧ (5 : ℝ) < 12 ∧ |(60 / 13 : ℝ) - 4.6| < 0.05 := by
  have hH : AffineMap.lineMap (12 : ℂ) (5 * I) (144 / 169 : ℝ) = 300 / 169 + 720 / 169 * I := by
    rw [AffineMap.lineMap_apply]; apply Complex.ext <;> simp <;> norm_num
  have hCH : dist (0 : ℂ) (300 / 169 + 720 / 169 * I) = 60 / 13 :=
    dist_iz_sq (by norm_num) (by simp; norm_num)
  have hAH : dist (12 : ℂ) (300 / 169 + 720 / 169 * I) = 144 / 13 :=
    dist_iz_sq (by norm_num) (by simp; norm_num)
  have hk : ∠ (12 : ℂ) (300 / 169 + 720 / 169 * I) 0 = Real.pi / 2 := by
    have hAC : dist (12 : ℂ) 0 = 12 := by rw [dist_comm]; exact n4_model.2.1
    rw [← dist_sq_eq_dist_sq_add_dist_sq_iff_angle_eq_pi_div_two, hAH, hCH, hAC]
    norm_num
  refine ⟨hH, by norm_num, by norm_num, hk, hCH, najblizja _ _ _ hk, by norm_num, by norm_num, by norm_num,
    ?_⟩
  rw [abs_lt]; constructor <;> norm_num

/-- Naloga 4b, uradni odgovor in pot »S Talesovim izrekom«: središče očrtane krožnice je razpolovišče
M = 6 + 5/2·i hipotenuze AB; |MA| = |MB| = |MC| = 13/2 = 6,5; M je edina točka, enako oddaljena od A, B in C;
M ni oglišče C (izjava B je napačna); M = A + ½·(B − A) leži na stranici AB (izjavi C »zunaj trikotnika« in
D »v notranjosti« sta napačni: točka na stranici ni ne zunaj ne v notranjosti). -/
theorem n4b : midpoint ℝ (12 : ℂ) (5 * I) = 6 + 5 / 2 * I ∧
    dist (6 + 5 / 2 * I : ℂ) 12 = 13 / 2 ∧ dist (6 + 5 / 2 * I : ℂ) (5 * I) = 13 / 2 ∧
    dist (6 + 5 / 2 * I : ℂ) 0 = 13 / 2 ∧ (13 / 2 : ℝ) = 6.5 ∧
    (∀ z : ℂ, (dist z 12 = dist z (5 * I) ∧ dist z (5 * I) = dist z 0) ↔ z = 6 + 5 / 2 * I) ∧
    (6 + 5 / 2 * I : ℂ) ≠ 0 ∧
    AffineMap.lineMap (12 : ℂ) (5 * I) (1 / 2 : ℝ) = 6 + 5 / 2 * I ∧ (6 + 5 / 2 * I : ℂ) ∈ segment ℝ 12 (5 * I) := by
  have hl : AffineMap.lineMap (12 : ℂ) (5 * I) (1 / 2 : ℝ) = 6 + 5 / 2 * I := by
    rw [AffineMap.lineMap_apply]; apply Complex.ext <;> simp <;> norm_num
  refine ⟨?_, dist_iz_sq (by norm_num) (by simp; norm_num), dist_iz_sq (by norm_num) (by simp; norm_num),
    dist_iz_sq (by norm_num) (by simp; norm_num), by norm_num, fun z => ?_, ?_, hl, ?_⟩
  · rw [midpoint_eq_smul_add]; apply Complex.ext <;> simp <;> norm_num
  · rw [deq, deq]
    simp
    constructor
    · rintro ⟨h1, h2⟩
      apply Complex.ext <;> simp <;> nlinarith
    · rintro rfl; simp; norm_num
  · intro h; have := congrArg Complex.re h; simp at this
  · rw [← hl, segment_eq_image_lineMap]; exact ⟨1 / 2, ⟨by norm_num, by norm_num⟩, rfl⟩

/-- Naloga 4b, pot »Drugače: s simetralama katet«: simetrala katete a (BC) je vodoravna premica Im z = 5/2,
simetrala katete b (CA) je navpična premica Re z = 6; sekata se v točki 6 + 5/2·i, ki je od C oddaljena 6
vodoravno in 2,5 navpično, in to je razpolovišče AB. -/
theorem n4b_simetrali : (∀ z : ℂ, dist z (5 * I) = dist z 0 ↔ z.im = 5 / 2) ∧
    (∀ z : ℂ, dist z 12 = dist z 0 ↔ z.re = 6) ∧
    (6 + 5 / 2 * I : ℂ).re = 6 ∧ (6 + 5 / 2 * I : ℂ).im = 2.5 ∧
    midpoint ℝ (12 : ℂ) (5 * I) = 6 + 5 / 2 * I := by
  refine ⟨fun z => ?_, fun z => ?_, by simp, by simp; norm_num, n4b.1⟩
  · rw [deq]; simp; constructor <;> intro h <;> nlinarith
  · rw [deq]; simp; constructor <;> intro h <;> nlinarith

/-- Naloga 4c: S = 6 + 5/2·i je razpolovišče AB, |AS| = |SB| = 6,5; simetrala stranice c je množica točk,
enako oddaljenih od A in B, S leži na njej; razpetina 8 cm je večja od 6,5 cm; |SC| = 6,5 (pot »Preizkus
z merjenjem«). -/
theorem n4c : midpoint ℝ (12 : ℂ) (5 * I) = 6 + 5 / 2 * I ∧
    dist (12 : ℂ) (6 + 5 / 2 * I) = 6.5 ∧ dist (6 + 5 / 2 * I : ℂ) (5 * I) = 6.5 ∧
    (∀ P : ℂ, P ∈ AffineSubspace.perpBisector (12 : ℂ) (5 * I) ↔ dist P 12 = dist P (5 * I)) ∧
    (6 + 5 / 2 * I : ℂ) ∈ AffineSubspace.perpBisector (12 : ℂ) (5 * I) ∧
    (6.5 : ℝ) < 8 ∧ dist (6 + 5 / 2 * I : ℂ) 0 = 6.5 := by
  obtain ⟨hm, h1, h2, h3, -, -, -⟩ := n4b
  refine ⟨hm, by rw [dist_comm, h1]; norm_num, by rw [h2]; norm_num,
    fun P => AffineSubspace.mem_perpBisector_iff_dist_eq, ?_, by norm_num, by rw [h3]; norm_num⟩
  rw [AffineSubspace.mem_perpBisector_iff_dist_eq, h1, h2]

/-- Naloga 4c, napaka: loka s središčema A in B in enakim polmerom r se sekata le, če je r ≥ 13/2 = 6,5
(trikotniška neenakost, |AB| = 13). -/
theorem n4c_napaka : ∀ (P : ℂ) (r : ℝ), dist P 12 = r → dist P (5 * I) = r → 13 / 2 ≤ r := by
  intro P r h1 h2
  have h := dist_triangle (12 : ℂ) P (5 * I)
  rw [n4_model.2.2.1, dist_comm, h1, h2] at h
  linarith

/-- Naloga 4c, napaka: pravokotnica iz C na AB je višina v_c, ne simetrala: njeno nožišče
H = 300/169 + 720/169·i (`n4a_vc`) ni razpolovišče S = 6 + 5/2·i stranice AB. -/
theorem n4c_napaka_visina : AffineMap.lineMap (12 : ℂ) (5 * I) (144 / 169 : ℝ) ≠ midpoint ℝ (12 : ℂ) (5 * I) := by
  rw [n4a_vc.1, n4b.1]
  intro h; have := congrArg Complex.re h; simp at this; norm_num at this

/-- Predpostavke trditve `n4c_napaka` se dajo izpolniti (P = S, r = 13/2). -/
example : ∃ (P : ℂ) (r : ℝ), dist P 12 = r ∧ dist P (5 * I) = r :=
  ⟨6 + 5 / 2 * I, 13 / 2, n4b.2.1, n4b.2.2.1⟩

/-- Naloga 4d: a² + b² = c² v modelu (|BC|² + |CA|² = |AB|²); 5² + 12² = 25 + 144 = 169 = 13²
(pot »S kvadrati nad stranicami«: 25 + 144 = 169). -/
theorem n4d : dist (5 * I) (0 : ℂ) ^ 2 + dist (0 : ℂ) 12 ^ 2 = dist (12 : ℂ) (5 * I) ^ 2 ∧
    (5 : ℝ) ^ 2 + 12 ^ 2 = 25 + 144 ∧ (25 + 144 : ℝ) = 169 ∧ (169 : ℝ) = 13 ^ 2 := by
  obtain ⟨h1, h2, h3, -⟩ := n4_model
  refine ⟨by rw [h1, h2, h3]; norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 4d, napaka: a² + c² = b² ne velja (25 + 169 = 194 ≠ 144). -/
theorem n4d_napaka : (5 : ℝ) ^ 2 + 13 ^ 2 = 194 ∧ (194 : ℝ) ≠ 12 ^ 2 := by norm_num

/-- Naloga 4e, pot »Po korakih«: p = a·b/2 = 5·12/2 = 30. -/
theorem n4e : (5 * 12 / 2 : ℝ) = 30 := by norm_num

/-- Naloga 4e, pot »S sliko: polovica pravokotnika«: 5·12 = 60, 60 : 2 = 30. -/
theorem n4e_pravokotnik : (5 * 12 : ℝ) = 60 ∧ (60 / 2 : ℝ) = 30 := by norm_num

/-- Naloga 4e, napaki: 5·13/2 = 32,5 ≠ 30 in 60 ≠ 30. -/
theorem n4e_napaka : (5 * 13 / 2 : ℝ) = 32.5 ∧ (32.5 : ℝ) ≠ 30 ∧ (60 : ℝ) ≠ 30 := by norm_num

/-! ## Naloga 5 (vse izbire pretvorjene v isto enoto) -/

/-- Naloga 5a, uradni odgovor: v metrih so izbire 45 cm = 45/100, 4,5 dm = 4,5/10, 4500 mm = 4500/1000,
0,0045 km = 0,0045·1000, 450 mm = 450/1000; enake 0,45 m so natanko izbire 1, 2 in 5 (indeksi 0, 1, 4). -/
theorem n5a : ∀ i : Fin 5,
    ![(45 : ℚ) / 100, 4.5 / 10, 4500 / 1000, 0.0045 * 1000, 450 / 1000] i = 0.45 ↔
      i ∈ ({0, 1, 4} : Finset (Fin 5)) := by
  intro i; fin_cases i <;> simp <;> norm_num

/-- Naloga 5a, poti »S pretvorbami«, »S preglednico mest« in napaka: 0,45 m = 4,5 dm = 45 cm = 450 mm;
4500 mm = 4,5 m = 10·0,45 m; 0,45 m = 0,00045 km ≠ 0,0045 km (= 0,45 : 100). -/
theorem n5a_koraki : (0.45 * 10 : ℚ) = 4.5 ∧ (0.45 * 100 : ℚ) = 45 ∧ (0.45 * 1000 : ℚ) = 450 ∧
    (4500 / 1000 : ℚ) = 4.5 ∧ (4.5 : ℚ) = 10 * 0.45 ∧ (0.45 / 1000 : ℚ) = 0.00045 ∧
    (0.00045 : ℚ) ≠ 0.0045 ∧ (0.45 / 100 : ℚ) = 0.0045 := by norm_num

/-- Naloga 5b, uradni odgovor: v urah so izbire 2 h 25 min = 2 + 25/60, 2 h 15 min = 2 + 15/60,
135 min = 135/60, 8100 s = 8100/3600, 225 min = 225/60; enake 2,25 h so natanko izbire 2, 3, 4
(indeksi 1, 2, 3). -/
theorem n5b : ∀ i : Fin 5,
    ![(2 : ℚ) + 25 / 60, 2 + 15 / 60, 135 / 60, 8100 / 3600, 225 / 60] i = 2.25 ↔
      i ∈ ({1, 2, 3} : Finset (Fin 5)) := by
  intro i; fin_cases i <;> simp <;> norm_num

/-- Naloga 5b, poti »Decimalni del ure v minute« in »Drugače: z ulomkom«: 0,25·60 = 15; 2,25·60 = 135;
135·60 = 8100; 0,25 = 1/4, 2·60 = 120, 120 + 15 = 135. Napaka: 2 h 25 min ≠ 2,25 h. -/
theorem n5b_koraki : (0.25 * 60 : ℚ) = 15 ∧ (2.25 * 60 : ℚ) = 135 ∧ 135 * 60 = 8100 ∧
    (0.25 : ℚ) = 1 / 4 ∧ 2 * 60 = 120 ∧ 120 + 15 = 135 ∧ ((2 : ℚ) + 25 / 60) ≠ 2.25 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 5c, uradni odgovor: v dm³ so izbire 1,2 l = 1,2, 120 cm³ = 120/1000, 1200 ml = 1200/1000,
0,012 m³ = 0,012·1000, 12 dl = 12/10; enake 1,2 dm³ so natanko izbire 1, 3, 5 (indeksi 0, 2, 4). -/
theorem n5c : ∀ i : Fin 5,
    ![(1.2 : ℚ), 120 / 1000, 1200 / 1000, 0.012 * 1000, 12 / 10] i = 1.2 ↔
      i ∈ ({0, 2, 4} : Finset (Fin 5)) := by
  intro i; fin_cases i <;> simp <;> norm_num

/-- Naloga 5c, poti »Prek litra« in »Mililiter je kubični centimeter«: 1,2 l = 12 dl = 1200 ml;
1,2 dm³ = 1200 cm³ (ne 120: 120·10 = 1200) in 1,2 dm³ = 0,0012 m³ (ne 0,012). -/
theorem n5c_koraki : (1.2 * 10 : ℚ) = 12 ∧ (1.2 * 1000 : ℚ) = 1200 ∧ (1.2 / 1000 : ℚ) = 0.0012 ∧
    (0.0012 : ℚ) ≠ 0.012 ∧ (120 : ℚ) ≠ 1200 ∧ 120 * 10 = 1200 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 5d, uradni odgovor: 3 m² + 40 dm² = 340 dm²; v dm² so izbire 3,4·100, 3,04·100, 340,
34 000/100, 43; enake so natanko izbire 1, 3, 4 (indeksi 0, 2, 3). -/
theorem n5d : (3 * 100 + 40 : ℚ) = 340 ∧ ∀ i : Fin 5,
    ![(3.4 : ℚ) * 100, 3.04 * 100, 340, 34000 / 100, 43] i = 3 * 100 + 40 ↔
      i ∈ ({0, 2, 3} : Finset (Fin 5)) := by
  refine ⟨by norm_num, fun i => ?_⟩
  fin_cases i <;> simp <;> norm_num

/-- Naloga 5d, poti »Vse v kvadratnih decimetrih«, »Vse v kvadratnih metrih« in napaka: 3 m² = 300 dm²,
300 + 40 = 340, 340 dm² = 3,4 m² = 34 000 cm²; 40 dm² = 0,4 m², 3 + 0,4 = 3,4; 3,04 m² = 304 dm²;
3 + 40 = 43 ≠ 340. -/
theorem n5d_koraki : 3 * 100 = 300 ∧ 300 + 40 = 340 ∧ (340 / 100 : ℚ) = 3.4 ∧ 340 * 100 = 34000 ∧
    (40 / 100 : ℚ) = 0.4 ∧ (3 + 0.4 : ℚ) = 3.4 ∧ (3.04 * 100 : ℚ) = 304 ∧ 3 + 40 = 43 ∧ 43 ≠ 340 := by
  refine ⟨rfl, rfl, by norm_num, rfl, by norm_num, by norm_num, by norm_num, rfl, by decide⟩

/-! ## Naloga 6 -/

/-- Naloga 6 (splošno): ploščina osenčenega lika je (x + y)² − x·y = x² + x·y + y² (obe poti 6a
dasta isti izraz). -/
theorem n6_obrazec (x y : ℝ) : (x + y) ^ 2 - x * y = x ^ 2 + x * y + y ^ 2 := by ring

/-- Naloga 6a, pot »Po korakih: kvadrat brez pravokotnika«: x + y = 6 + 2,5 = 8,5; 8,5² = 8,5·8,5 = 72,25;
x·y = 6·2,5 = 15; p = 72,25 − 15 = 57,25. -/
theorem n6a : (6 + 2.5 : ℚ) = 8.5 ∧ (8.5 : ℚ) ^ 2 = 8.5 * 8.5 ∧ (8.5 * 8.5 : ℚ) = 72.25 ∧
    (6 * 2.5 : ℚ) = 15 ∧ (72.25 - 15 : ℚ) = 57.25 ∧ ((6 + 2.5) ^ 2 - 6 * 2.5 : ℚ) = 57.25 := by
  refine ⟨by norm_num, by ring, by norm_num, by norm_num, by norm_num, ?_⟩
  calc ((6 + 2.5) ^ 2 - 6 * 2.5 : ℚ) = 8.5 ^ 2 - 6 * 2.5 := by norm_num
    _ = 72.25 - 15 := by norm_num
    _ = 57.25 := by norm_num

/-- Naloga 6a, pot »Drugače: seštejemo osenčene dele«: x² = 36, x·y = 15, y² = 2,5² = 6,25;
p = 36 + 15 + 6,25 = 57,25. -/
theorem n6a_deli : (6 : ℚ) ^ 2 = 36 ∧ (6 * 2.5 : ℚ) = 15 ∧ (2.5 : ℚ) ^ 2 = 6.25 ∧
    ((6 : ℚ) ^ 2 + 6 * 2.5 + 2.5 ^ 2) = 57.25 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  calc ((6 : ℚ) ^ 2 + 6 * 2.5 + 2.5 ^ 2) = 36 + 15 + 6.25 := by norm_num
    _ = 57.25 := by norm_num

/-- Naloga 6a, pot »Preizkus« in napaka: 57,25 + 15 = 72,25 = 8,5²; 8,5² ni 64,25 ne 17;
8,5·8,5 = 64 + 4 + 4 + 0,25 = 72,25. -/
theorem n6a_preizkus : (57.25 + 15 : ℚ) = 72.25 ∧ (72.25 : ℚ) = 8.5 ^ 2 ∧ (8.5 : ℚ) ^ 2 ≠ 64.25 ∧
    (8.5 : ℚ) ^ 2 ≠ 17 ∧ (8.5 * 8.5 : ℚ) = 64 + 4 + 4 + 0.25 ∧ (64 + 4 + 4 + 0.25 : ℚ) = 72.25 := by
  norm_num

/-- Naloga 6b, pot »Obhod po robu«: o = (x + y) + (x + y) + y + y + x + x = 4x + 4y = 4(x + y). -/
theorem n6b (x y : ℝ) : (x + y) + (x + y) + y + y + x + x = 4 * x + 4 * y ∧
    4 * x + 4 * y = 4 * (x + y) := ⟨by ring, by ring⟩

/-- Naloga 6b, pot »Drugače: premik stranic«: o = 4(x + y) = 4x + 4y; pri x = 6, y = 2,5: 4·8,5 = 34. -/
theorem n6b_premik : (∀ x y : ℝ, 4 * (x + y) = 4 * x + 4 * y) ∧ (4 * (6 + 2.5) : ℚ) = 4 * 8.5 ∧
    (4 * 8.5 : ℚ) = 34 := ⟨fun x y => by ring, by norm_num, by norm_num⟩

/-- Naloga 6b, napaka: brez notranjih stranic je obseg 3x + 3y, kar je za pozitivna x, y manj kot 4x + 4y
(pogoj iz besedila: x > y, dolžini sta pozitivni). -/
theorem n6b_napaka (x y : ℝ) (hy : 0 < y) (hxy : x > y) : 3 * x + 3 * y ≠ 4 * x + 4 * y := by
  intro h; linarith

/-- Predpostavke trditve `n6b_napaka` se dajo izpolniti (x = 6, y = 2,5). -/
example : ∃ x y : ℝ, 0 < y ∧ x > y := ⟨6, 2.5, by norm_num, by norm_num⟩

/-! ## Naloga 7 -/

/-- Naloga 7a, pot »Po korakih: razlika kvadratov«: (2a + 3)(2a − 3) = (2a)² − 3² = 4a² − 9 in
4a² − 9 − a² = 3a² − 9; torej (2a + 3)(2a − 3) − a² = 3a² − 9 za vsak a. -/
theorem n7a (a : ℝ) : (2 * a + 3) * (2 * a - 3) - a ^ 2 = 3 * a ^ 2 - 9 ∧
    (2 * a + 3) * (2 * a - 3) = (2 * a) ^ 2 - 3 ^ 2 ∧ (2 * a) ^ 2 - 3 ^ 2 = 4 * a ^ 2 - 9 := by
  refine ⟨?_, by ring, by ring⟩
  calc (2 * a + 3) * (2 * a - 3) - a ^ 2 = (2 * a) ^ 2 - 3 ^ 2 - a ^ 2 := by ring
    _ = 4 * a ^ 2 - 9 - a ^ 2 := by ring
    _ = 3 * a ^ 2 - 9 := by ring

/-- Naloga 7a, pot »Drugače: vsak člen z vsakim«: (2a + 3)(2a − 3) = 4a² − 6a + 6a − 9 = 4a² − 9. -/
theorem n7a_clenji (a : ℝ) : (2 * a + 3) * (2 * a - 3) = 4 * a ^ 2 - 9 := by
  calc (2 * a + 3) * (2 * a - 3) = 4 * a ^ 2 - 6 * a + 6 * a - 9 := by ring
    _ = 4 * a ^ 2 - 9 := by ring

/-- Naloga 7a, pot »Preizkus s številom«: za a = 2: (4 + 3)(4 − 3) − 4 = 7 − 4 = 3 in 3·2² − 9 = 12 − 9 = 3. -/
theorem n7a_preizkus : ((2 * 2 + 3) * (2 * 2 - 3) - 2 ^ 2 : ℝ) = (4 + 3) * (4 - 3) - 4 ∧
    ((4 + 3) * (4 - 3) - 4 : ℝ) = 7 - 4 ∧ (7 - 4 : ℝ) = 3 ∧ (3 * 2 ^ 2 - 9 : ℝ) = 12 - 9 ∧
    (12 - 9 : ℝ) = 3 := by norm_num

/-- Naloga 7a, napaka: (2a)² = 2a² velja le za a = 0; pravilno (2a)² = 4a². -/
theorem n7a_napaka (a : ℝ) : (2 * a) ^ 2 = 4 * a ^ 2 ∧ ((2 * a) ^ 2 = 2 * a ^ 2 ↔ a = 0) := by
  refine ⟨by ring, ⟨fun h => ?_, fun h => by rw [h]; ring⟩⟩
  have : a ^ 2 = 0 := by nlinarith
  exact pow_eq_zero_iff (n := 2) (by norm_num) |>.1 this

/-- Naloga 7b, uradni odgovor: (x − 3)² − (x + 2)(x − 1) = 3(x − 1) − 2(x + 1) ⇔ x = 2 (edina rešitev). -/
theorem n7b (x : ℝ) : (x - 3) ^ 2 - (x + 2) * (x - 1) = 3 * (x - 1) - 2 * (x + 1) ↔ x = 2 := by
  constructor
  · intro h
    have h1 : -7 * x + 11 = x - 5 := by
      calc -7 * x + 11 = (x - 3) ^ 2 - (x + 2) * (x - 1) := by ring
        _ = 3 * (x - 1) - 2 * (x + 1) := h
        _ = x - 5 := by ring
    linarith
  · rintro rfl; norm_num

/-- Naloga 7b, pot »Po korakih«: (x − 3)² = x² − 6x + 9; (x + 2)(x − 1) = x² − x + 2x − 2 = x² + x − 2;
leva stran x² − 6x + 9 − (x² + x − 2) = x² − 6x + 9 − x² − x + 2 = −7x + 11; desna stran
3(x − 1) − 2(x + 1) = 3x − 3 − 2x − 2 = x − 5; −7x + 11 = x − 5 ⇔ −7x − x = −5 − 11 ⇔ −8x = −16 ⇔ x = 2. -/
theorem n7b_koraki (x : ℝ) : (x - 3) ^ 2 = x ^ 2 - 6 * x + 9 ∧
    (x + 2) * (x - 1) = x ^ 2 - x + 2 * x - 2 ∧ x ^ 2 - x + 2 * x - 2 = x ^ 2 + x - 2 ∧
    x ^ 2 - 6 * x + 9 - (x ^ 2 + x - 2) = x ^ 2 - 6 * x + 9 - x ^ 2 - x + 2 ∧
    x ^ 2 - 6 * x + 9 - x ^ 2 - x + 2 = -7 * x + 11 ∧
    3 * (x - 1) - 2 * (x + 1) = 3 * x - 3 - 2 * x - 2 ∧ 3 * x - 3 - 2 * x - 2 = x - 5 ∧
    (-7 * x + 11 = x - 5 ↔ -7 * x - x = -5 - 11) ∧ (-7 * x - x = -5 - 11 ↔ -8 * x = -16) ∧
    (-8 * x = -16 ↔ x = 2) := by
  refine ⟨by ring, by ring, by ring, by ring, by ring, by ring, by ring, ⟨fun h => by linarith,
    fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith,
    fun h => by rw [h]; norm_num⟩⟩

/-- Naloga 7b, pot »Drugače: vse na levo stran«: enačba je enakovredna
x² − 6x + 9 − x² − x + 2 − 3x + 3 + 2x + 2 = 0; x² − x² = 0, −6x − x − 3x + 2x = −8x, 9 + 2 + 3 + 2 = 16;
−8x + 16 = 0 ⇔ 8x = 16 ⇔ x = 2. -/
theorem n7b_levo (x : ℝ) : ((x - 3) ^ 2 - (x + 2) * (x - 1) = 3 * (x - 1) - 2 * (x + 1) ↔
      x ^ 2 - 6 * x + 9 - x ^ 2 - x + 2 - 3 * x + 3 + 2 * x + 2 = 0) ∧
    x ^ 2 - x ^ 2 = 0 ∧ -6 * x - x - 3 * x + 2 * x = -8 * x ∧ (9 + 2 + 3 + 2 : ℝ) = 16 ∧
    x ^ 2 - 6 * x + 9 - x ^ 2 - x + 2 - 3 * x + 3 + 2 * x + 2 = -8 * x + 16 ∧
    (-8 * x + 16 = 0 ↔ 8 * x = 16) ∧ (8 * x = 16 ↔ x = 2) := by
  refine ⟨⟨fun h => by linarith [h], fun h => by linarith [h]⟩, by ring, by ring, by norm_num, by ring,
    ⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩⟩

/-- Naloga 7b, pot »Preizkus«: pri x = 2 je leva stran (2 − 3)² − (2 + 2)(2 − 1) = 1 − 4 = −3,
desna 3·(2 − 1) − 2·(2 + 1) = 3 − 6 = −3. -/
theorem n7b_preizkus : ((2 - 3) ^ 2 - (2 + 2) * (2 - 1) : ℝ) = 1 - 4 ∧ (1 - 4 : ℝ) = -3 ∧
    (3 * (2 - 1) - 2 * (2 + 1) : ℝ) = 3 - 6 ∧ (3 - 6 : ℝ) = -3 := by norm_num

/-- Naloga 7b, napaki: −(x² + x − 2) = −x² − x + 2, zato −(x² + x − 2) = −x² + x − 2 velja le za x = 2;
(x − 3)² = x² − 9 velja le za x = 3. -/
theorem n7b_napaka (x : ℝ) : -(x ^ 2 + x - 2) = -x ^ 2 - x + 2 ∧ (-(x ^ 2 + x - 2) = -x ^ 2 + x - 2 ↔ x = 2) ∧
    ((x - 3) ^ 2 = x ^ 2 - 9 ↔ x = 3) := by
  refine ⟨by ring, ⟨fun h => by linarith, fun h => by rw [h]; ring⟩, ⟨fun h => by nlinarith, fun h => by rw [h]; ring⟩⟩

/-! ## Naloga 8 -/

/-- Naloga 8 (uvod): 8 + 6 + 5 + 4 + 2 = 25. -/
theorem n8_skupaj : 8 + 6 + 5 + 4 + 2 = 25 := rfl

/-- Naloga 8a, poti »Seštejemo« in »Preizkus z ostalimi«: 6 + 5 = 11 in 25 − 8 − 4 − 2 = 11. -/
theorem n8a : 6 + 5 = 11 ∧ (25 - 8 - 4 - 2 : ℤ) = 11 := ⟨rfl, by norm_num⟩

/-- Naloga 8b: P = 8/25 (ugodni : vsi), okrajšan (D(8, 25) = 1); 8/25 = 32/100 = 0,32, med 0 in 1;
napaka 8/17 ≠ 8/25. -/
theorem n8b : Nat.Coprime 8 25 ∧ (8 / 25 : ℚ) = 32 / 100 ∧ (32 / 100 : ℚ) = 0.32 ∧ (0 : ℚ) ≤ 8 / 25 ∧
    (8 / 25 : ℚ) ≤ 1 ∧ (8 / 17 : ℚ) ≠ 8 / 25 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 8c, pot »Preštejemo«: 25 − 8 = 17, P = 17/25 = 68/100 = 68 %. -/
theorem n8c : 25 - 8 = 17 ∧ (17 / 25 : ℚ) = 68 / 100 := ⟨rfl, by norm_num⟩

/-- Naloga 8c, pot »Drugače: nasprotni dogodek« in napaka: 1 − 8/25 = 1 − 0,32 = 0,68 = 68 %; 17 % ≠ 68 %. -/
theorem n8c_nasprotni : (1 - 8 / 25 : ℚ) = 1 - 0.32 ∧ (1 - 0.32 : ℚ) = 0.68 ∧ (0.68 : ℚ) = 68 / 100 ∧
    (17 / 100 : ℚ) ≠ 17 / 25 := by norm_num

/-- Naloga 8d, pot »Po korakih«: 25 − 5 = 20; 750 : 25 = 30; 750 : 20 = 37,5; 37,50 − 30 = 7,50. -/
theorem n8d : 25 - 5 = 20 ∧ (750 / 25 : ℚ) = 30 ∧ (750 / 20 : ℚ) = 37.5 ∧ (37.5 - 30 : ℚ) = 7.5 ∧
    (750 / (25 - 5) - 750 / 25 : ℚ) = 7.5 := by
  refine ⟨rfl, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 8d, pot »Drugače: delež manjkajočih«: 5·30 = 150, 150/20 = 7,5. -/
theorem n8d_delez : (5 * 30 : ℚ) = 150 ∧ (150 / 20 : ℚ) = 7.5 := by norm_num

/-- Naloga 8d, pot »Preizkus« in napaka: 20·37,5 = 750, 25·30 = 750; 750 : 5 = 150 ≠ 7,5. -/
theorem n8d_preizkus : (20 * 37.5 : ℚ) = 750 ∧ (25 * 30 : ℚ) = 750 ∧ (750 / 5 : ℚ) = 150 ∧
    (150 : ℚ) ≠ 7.5 := by norm_num

/-! ## Naloga 9 -/

/-- Naloga 9, pot »Po korakih« (s √3 ≈ 1,73): V₁ = 20³ = 8000; v_t = 20·1,73/2 = 17,3; O = 20·17,3/2 = 173;
V₂ = 173·20 = 3460; V = 8000 + 3460 = 11 460 cm³; 11 460 : 1000 = 11,46 l (z 1,73 je rezultat točno 11,46). -/
theorem n9 : (20 : ℚ) ^ 3 = 8000 ∧ (20 * 1.73 / 2 : ℚ) = 17.3 ∧ (20 * 17.3 / 2 : ℚ) = 173 ∧
    (173 * 20 : ℚ) = 3460 ∧ (8000 + 3460 : ℚ) = 11460 ∧ (11460 / 1000 : ℚ) = 11.46 := by norm_num

/-- Naloga 9, pot »Drugače: z obrazcem za enakostranični trikotnik«: O = a²√3/4 = 400·1,73/4 = 100·1,73 = 173;
V₂ = 173·20 = 3460; splošno V = a³ + (a²√3/4)·a = a³(1 + √3/4); 8000·(1 + 1,73/4) = 8000·1,4325 = 11 460. -/
theorem n9_obrazec : (20 : ℚ) ^ 2 = 400 ∧ (400 * 1.73 / 4 : ℚ) = 100 * 1.73 ∧ (100 * 1.73 : ℚ) = 173 ∧
    (173 * 20 : ℚ) = 3460 ∧ (∀ a s : ℝ, a ^ 3 + a ^ 2 * s / 4 * a = a ^ 3 * (1 + s / 4)) ∧
    (1 + 1.73 / 4 : ℚ) = 1.4325 ∧ (8000 * 1.4325 : ℚ) = 11460 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, fun a s => by ring, by norm_num, by norm_num⟩

/-- Naloga 9, pot »Drugače: računamo v decimetrih«: 2³ = 8; O = 2²·1,73/4 = 1,73; V₂ = 1,73·2 = 3,46;
8 + 3,46 = 11,46. -/
theorem n9_dm : (2 : ℚ) ^ 3 = 8 ∧ ((2 : ℚ) ^ 2 * 1.73 / 4) = 1.73 ∧ (1.73 * 2 : ℚ) = 3.46 ∧
    (8 + 3.46 : ℚ) = 11.46 := by norm_num

/-- Meje za √3: 1,732 < √3 < 1,7321. -/
theorem koren3 : (1.732 : ℝ) < √3 ∧ √3 < 1.7321 := by
  constructor
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num

/-- Naloga 9, točna vrednost in pot »Preizkus smiselnosti«: višina enakostraničnega trikotnika s stranico 20 je
√(20² − 10²) = 10√3 = 20√3/2; točna prostornina je 8000 + 2000√3 cm³; z 1,732: 2000·1,732 = 3464,
8000 + 3464 = 11 464, zaokroženo na stotinke litra 11,46; točna vrednost v litrih, (8000 + 2000√3)/1000,
se od 11,46 razlikuje za manj kot 0,005, zaokrožena na dve decimalki je 11,46 (uradni odgovor je pravilen);
streha (3464) je manj kot pol kocke (4000); |√3 − 1,73| < 0,003. -/
theorem n9_tocno : √((20 : ℝ) ^ 2 - 10 ^ 2) = 10 * √3 ∧ 10 * √3 = 20 * √3 / 2 ∧
    (20 * (10 * √3) / 2) * 20 = 2000 * √3 ∧
    (2000 * 1.732 : ℚ) = 3464 ∧ (8000 + 3464 : ℚ) = 11464 ∧ (round ((11464 : ℚ) / 1000 * 100) : ℚ) / 100 = 11.46 ∧
    |(8000 + 2000 * √3) / 1000 - 11.46| < 0.005 ∧
    (round ((8000 + 2000 * √3) / 1000 * 100) : ℝ) / 100 = 11.46 ∧
    (3464 : ℚ) < 8000 / 2 ∧ |√3 - 1.73| < 0.003 := by
  obtain ⟨h1, h2⟩ := koren3
  refine ⟨?_, by ring, by ring, by norm_num, by norm_num, ?_, ?_, ?_, by norm_num, ?_⟩
  · rw [show (20 : ℝ) ^ 2 - 10 ^ 2 = 10 ^ 2 * 3 by norm_num, Real.sqrt_mul (by norm_num),
      Real.sqrt_sq (by norm_num)]
  · have h : round ((11464 : ℚ) / 1000 * 100) = 1146 := by
      rw [round_eq, Int.floor_eq_iff]; norm_num
    rw [h]; norm_num
  · rw [abs_lt]; constructor <;> linarith
  · have h : round ((8000 + 2000 * √3) / 1000 * 100) = 1146 := by
      rw [round_eq, Int.floor_eq_iff]; constructor <;> push_cast <;> linarith
    rw [h]; norm_num
  · rw [abs_lt]; constructor <;> linarith

/-- Naloga 9, napake: prostornina prizme ni 20·20·20 = 8000 ≠ 3460; brez deljenja z 2 je 20·17,3 = 346 ≠ 173;
z 1 l = 100 cm³ bi dobili 11 460 : 100 = 114,6 ≠ 11,46. -/
theorem n9_napaka : (20 * 20 * 20 : ℚ) = 8000 ∧ (8000 : ℚ) ≠ 3460 ∧ (20 * 17.3 : ℚ) = 346 ∧ (346 : ℚ) ≠ 173 ∧
    (11460 / 100 : ℚ) = 114.6 ∧ (114.6 : ℚ) ≠ 11.46 := by norm_num

end Evklid.Pole.NPZ9_MAT_2025_redni
