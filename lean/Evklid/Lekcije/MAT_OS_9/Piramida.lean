/-
vir: content/lessons/MAT-OS-9/piramida.md
sha256: ffe09ca1102b50531e84ced554b8ca0a7c5e31db80e4d10f8530cced224cbbe7
Model: formule so funkcije na ℝ: `O4 a = a²` (kvadratna osnovna ploskev), `pl n a vs = n·(a·vs/2)`,
`P O pl = O + pl`, `Vpir O v = O·v/3`, `Vpri O v = O·v` (prizma). Pravilna štiristrana piramida je v prostoru
ℝ³ (`EuclideanSpace ℝ (Fin 3)`) s središčem osnovne ploskve v izhodišču, oglišči (±a/2, ±a/2, 0) in vrhom
(0, 0, v); v_s je razdalja od vrha do razpolovišča osnovnega roba (a/2, 0, 0), stranski rob razdalja od vrha do
oglišča. Iz vᵢ² = … in vᵢ > 0 je vᵢ enolično določen (`koren_enolicno`). »≈« na dano mesto je |x − a| < pol enote
zadnjega mesta. Količine so brez enot (cm, m, €).
Ni v Leanu: pojmi (piramida, osnovna in stranske ploskve, robovi, plašč, poimenovanje po osnovni ploskvi, »od prizme
do piramide«) kot definicije; tabela razlik prizma/piramida razen formul; risbe in mreža; »stranske ploskve
pravilne piramide so skladni enakokraki trikotniki« splošno (dokazano je le, da so v modelu štiristrane piramide
vsi štirje stranski robovi enako dolgi); da je v_s res višina stranskega trikotnika (pravokotnost) in da je v
razdalja vrha od osnovne ploskve (v modelu sta to definiciji); formula V = O·v/3 kot prostornina telesa (mera
množice v ℝ³) — zahtevno, še ni dokazano, zato je V = O·v/3 tu definicija; razrez kocke na šest skladnih piramid
(geometrijsko; dokazana je le aritmetika a²·(a/2)/3 = a³/6 in 6·a³/6 = a³); poskus z mivko (»natanko trikrat«; kot
račun je dokazano 3·V = O·v); »trikotnik se zoži v eni smeri, piramida v dveh« (razlaga); streha, lampion, streha
proti tlom podstrešja (izbira, kaj se računa; dokazani so računi).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_9.Piramida

/-- Ploščina kvadratne osnovne ploskve O = a². -/
noncomputable def O4 (a : ℝ) : ℝ := a ^ 2

/-- Plašč pravilne n-strane piramide: pl = n · (a · v_s / 2). -/
noncomputable def pl (n a vs : ℝ) : ℝ := n * (a * vs / 2)

/-- Površina piramide P = O + pl. -/
noncomputable def P (O plasc : ℝ) : ℝ := O + plasc

/-- Prostornina piramide V = O · v / 3. -/
noncomputable def Vpir (O v : ℝ) : ℝ := O * v / 3

/-- Prostornina prizme V = O · v. -/
noncomputable def Vpri (O v : ℝ) : ℝ := O * v

/-- Pomožno: pozitivno število z danim kvadratom je enolično: x > 0 in x² = c² (c > 0) natanko pri x = c. -/
theorem koren_enolicno (x c : ℝ) (hc : 0 < c) : (0 < x ∧ x ^ 2 = c ^ 2) ↔ x = c := by
  constructor
  · rintro ⟨hx, h⟩
    have := (sq_eq_sq₀ hx.le hc.le).1 h
    exact this
  · rintro rfl
    exact ⟨hc, rfl⟩

/-- Predpostavka `koren_enolicno` se da izpolniti. -/
example : (0 : ℝ) < 5 := by norm_num

/-! ## Model pravilne štiristrane piramide v ℝ³ -/

/-- Vrh piramide (0, 0, v). -/
noncomputable def vrh (v : ℝ) : EuclideanSpace ℝ (Fin 3) := !₂[0, 0, v]

/-- Razpolovišče osnovnega roba (a/2, 0, 0). -/
noncomputable def razpolovisce (a : ℝ) : EuclideanSpace ℝ (Fin 3) := !₂[a / 2, 0, 0]

/-- Oglišče osnovne ploskve (±a/2, ±a/2, 0). -/
noncomputable def oglisce (a : ℝ) (p q : ℝ) : EuclideanSpace ℝ (Fin 3) := !₂[p * (a / 2), q * (a / 2), 0]

/-- Razlaga 4, Povzetek: v_s² = v² + (a/2)², kjer je v_s razdalja od vrha do razpolovišča osnovnega roba. -/
theorem vs_kvadrat (a v : ℝ) : dist (vrh v) (razpolovisce a) ^ 2 = v ^ 2 + (a / 2) ^ 2 := by
  rw [EuclideanSpace.dist_sq_eq]
  simp [vrh, razpolovisce, Fin.sum_univ_three, Real.dist_eq, sq_abs]
  ring

/-- Razlaga 4, Povzetek: stranski rob s (od vrha do oglišča) zadošča s² = v_s² + (a/2)². -/
theorem s_kvadrat (a v : ℝ) :
    dist (vrh v) (oglisce a 1 1) ^ 2 = dist (vrh v) (razpolovisce a) ^ 2 + (a / 2) ^ 2 := by
  rw [EuclideanSpace.dist_sq_eq, EuclideanSpace.dist_sq_eq]
  simp [vrh, razpolovisce, oglisce, Fin.sum_univ_three, Real.dist_eq, sq_abs]
  ring

/-- Razlaga 2 (delno): v modelu pravilne štiristrane piramide so vsi štirje stranski robovi enako dolgi. -/
theorem stranski_robovi_enaki (a v : ℝ) :
    dist (vrh v) (oglisce a 1 (-1)) = dist (vrh v) (oglisce a 1 1) ∧
    dist (vrh v) (oglisce a (-1) 1) = dist (vrh v) (oglisce a 1 1) ∧
    dist (vrh v) (oglisce a (-1) (-1)) = dist (vrh v) (oglisce a 1 1) := by
  simp only [EuclideanSpace.dist_eq]
  simp [vrh, oglisce, Fin.sum_univ_three, Real.dist_eq, sq_abs]

/-- Razlaga 4, Preveri se 3: v_s je hipotenuza, zato je pri a > 0 vedno daljša od v (v ≥ 0, v_s ≥ 0,
v_s² = v² + (a/2)²). -/
theorem vs_vecja (a v vs : ℝ) (ha : 0 < a) (hv : 0 ≤ v) (hvs : 0 ≤ vs) (h : vs ^ 2 = v ^ 2 + (a / 2) ^ 2) :
    v < vs := by
  nlinarith

/-- Predpostavke `vs_vecja` se dajo izpolniti (a = 6, v = 4, v_s = 5). -/
example : (0 : ℝ) < 6 ∧ (0 : ℝ) ≤ 4 ∧ (0 : ℝ) ≤ 5 ∧ (5 : ℝ) ^ 2 = 4 ^ 2 + (6 / 2) ^ 2 := by norm_num

/-- Pogoste napake, Preveri se 3: v_s ≠ v + a/2; pri v > 0, a > 0 je v_s celo manjša od vsote v + a/2. -/
theorem vs_manjsa_od_vsote (a v vs : ℝ) (ha : 0 < a) (hv : 0 < v) (hvs : 0 ≤ vs)
    (h : vs ^ 2 = v ^ 2 + (a / 2) ^ 2) : vs < v + a / 2 := by
  nlinarith

/-- Predpostavke `vs_manjsa_od_vsote` se dajo izpolniti (a = 6, v = 4, v_s = 5 < 7). -/
example : (0 : ℝ) < 6 ∧ (0 : ℝ) < 4 ∧ (0 : ℝ) ≤ 5 ∧ (5 : ℝ) ^ 2 = 4 ^ 2 + (6 / 2) ^ 2 := by norm_num

/-! ## Splošne formule -/

/-- Razlaga 5: pri štiristrani piramidi (n = 4) je pl = 2 a v_s. -/
theorem pl_stiristrana (a vs : ℝ) : pl 4 a vs = 2 * a * vs := by
  unfold pl; ring

/-- Razlaga 5: z obsegom o = n · a je plašč pl = o · v_s / 2. -/
theorem pl_obseg (n a vs : ℝ) : pl n a vs = (n * a) * vs / 2 := by
  unfold pl; ring

/-- Razlaga 6, Pogoste napake: prostornina piramide je tretjina prizme, tri piramide dajo prizmo:
3 · V_pir = V_pri. -/
theorem tri_piramide (O v : ℝ) : 3 * Vpir O v = Vpri O v := by
  unfold Vpir Vpri; ring

/-- Pogoste napake (pozabljena tretjina): pri O > 0, v > 0 je O · v / 3 < O · v. -/
theorem manjsa_od_prizme (O v : ℝ) (hO : 0 < O) (hv : 0 < v) : Vpir O v < Vpri O v := by
  unfold Vpir Vpri
  have : 0 < O * v := mul_pos hO hv
  linarith

/-- Predpostavke `manjsa_od_prizme` se dajo izpolniti (O = 36, v = 4). -/
example : (0 : ℝ) < 36 ∧ (0 : ℝ) < 4 := by norm_num

/-- Primer 3, simboli: obrnjena formula — pri O ≠ 0 je V = O · v / 3 natanko tedaj, ko je v = 3V/O. -/
theorem visina_iz_V (O v V : ℝ) (hO : O ≠ 0) : V = Vpir O v ↔ v = 3 * V / O := by
  unfold Vpir
  rw [eq_div_iff hO]
  constructor <;> intro h <;> linarith

/-- Predpostavka `visina_iz_V` se da izpolniti (O = 64). -/
example : (64 : ℝ) ≠ 0 := by norm_num

/-- Pogoste napake (zamenjava višin): pri n, a > 0 in v < v_s da v namesto v_s premajhen plašč, v_s namesto v
pa preveliko prostornino (O > 0). -/
theorem zamenjava_visin (n a O v vs : ℝ) (hn : 0 < n) (ha : 0 < a) (hO : 0 < O) (hv : v < vs) :
    pl n a v < pl n a vs ∧ Vpir O v < Vpir O vs := by
  unfold pl Vpir
  have h1 : a * v < a * vs := mul_lt_mul_of_pos_left hv ha
  have h2 : O * v < O * vs := mul_lt_mul_of_pos_left hv hO
  constructor
  · have : a * v / 2 < a * vs / 2 := by linarith
    exact mul_lt_mul_of_pos_left this hn
  · linarith

/-- Predpostavke `zamenjava_visin` se dajo izpolniti (n = 4, a = 10, O = 100, v = 12, v_s = 13). -/
example : (0 : ℝ) < 4 ∧ (0 : ℝ) < 10 ∧ (0 : ℝ) < 100 ∧ (12 : ℝ) < 13 := by norm_num

/-- Pogoste napake (plašč kot pri prizmi): pri a, v_s > 0 je a · v_s / 2 < a · v_s. -/
theorem trikotnik_pol (a vs : ℝ) (ha : 0 < a) (hvs : 0 < vs) : a * vs / 2 < a * vs := by
  have := mul_pos ha hvs
  linarith

/-- Predpostavke `trikotnik_pol` se dajo izpolniti. -/
example : (0 : ℝ) < 10 ∧ (0 : ℝ) < 13 := by norm_num

/-- Bolj natančno (kocka): piramida z osnovno ploskvijo a² in višino a/2 ima a² · (a/2) / 3 = a³/6, šest takih
da a³. -/
theorem kocka (a : ℝ) : Vpir (O4 a) (a / 2) = a ^ 3 / 6 ∧ 6 * (a ^ 3 / 6) = a ^ 3 := by
  unfold Vpir O4; constructor <;> ring

/-! ## Razlaga: račun z risbe in ute -/

/-- Razlaga 4 (risba, a = 6, v = 4): v_s = √(16 + 9) = 5; s² = 25 + 9 = 34 in s = √34 ≈ 5,8. -/
theorem risba : Real.sqrt (16 + 9) = 5 ∧ (25 : ℝ) + 9 = 34 ∧
    (575 / 100 : ℝ) < Real.sqrt 34 ∧ Real.sqrt 34 < 585 / 100 := by
  refine ⟨?_, by norm_num, ?_, ?_⟩
  · rw [show (16 : ℝ) + 9 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num

/-- Razlaga 4 (risba) v modelu ℝ³: pri a = 6, v = 4 je v_s = 5 in s² = 34. -/
theorem risba_model : dist (vrh 4) (razpolovisce 6) = 5 ∧ dist (vrh 4) (oglisce 6 1 1) ^ 2 = 34 := by
  have h := vs_kvadrat 6 4
  have hs := s_kvadrat 6 4
  rw [h] at hs
  refine ⟨?_, by rw [hs]; norm_num⟩
  have hd : 0 ≤ dist (vrh 4) (razpolovisce 6) := dist_nonneg
  nlinarith [h]

/-- Razlaga 5, Premisli (uta): v_s = √(1,5² + 2²) = √6,25 = 2,5; pl = 4 · (4 · 2,5)/2 = 20 m²; kritina
20 · 15 = 300 €, ne 16 · 15 = 240 €; streha je večja od tal (tla so štirje trikotniki 4 · (4 · 2)/2 = 16,
v_s = 2,5 > 2). -/
theorem uta : Real.sqrt ((3 / 2) ^ 2 + 2 ^ 2) = Real.sqrt (625 / 100) ∧ Real.sqrt (625 / 100) = 5 / 2 ∧
    pl 4 4 (5 / 2) = 20 ∧ (20 : ℝ) * 15 = 300 ∧ O4 4 * 15 = 240 ∧ pl 4 4 2 = 16 ∧ O4 4 = 16 ∧
    (2 : ℝ) < 5 / 2 ∧ (16 : ℝ) < 20 := by
  refine ⟨by norm_num, ?_, by unfold pl; norm_num, by norm_num, by unfold O4; norm_num, by unfold pl; norm_num,
    by unfold O4; norm_num, by norm_num, by norm_num⟩
  rw [show (625 / 100 : ℝ) = (5 / 2) ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-! ## Rešeni primeri -/

/-- Primer 1 (sveča, a = 6, v = 4): O = 6² = 36; V = 36 · 4 / 3 = 48. -/
theorem primer1_V : O4 6 = 36 ∧ Vpir (O4 6) 4 = 48 := by
  refine ⟨?_, ?_⟩
  · calc O4 6 = 6 ^ 2 := rfl
      _ = 36 := by norm_num
  · calc Vpir (O4 6) 4 = 36 * 4 / 3 := by unfold O4 Vpir; norm_num
      _ = 48 := by norm_num

/-- Primer 1, korak 3: v_s² = 16 + 9 = 25 in (v_s > 0) natanko v_s = 5. -/
theorem primer1_vs (vs : ℝ) : (0 < vs ∧ vs ^ 2 = 4 ^ 2 + (6 / 2) ^ 2) ↔ vs = 5 := by
  rw [show (4 : ℝ) ^ 2 + (6 / 2) ^ 2 = 16 + 9 by norm_num, show (16 : ℝ) + 9 = 5 ^ 2 by norm_num]
  exact koren_enolicno vs 5 (by norm_num)

/-- Primer 1, korak 4–6, Na sliki: pl = 4 · (6 · 5)/2 = 60 (vsak trikotnik 15, 4 · 15 = 60), P = 36 + 60 = 96,
in v_s = 5 > v = 4. -/
theorem primer1_P : pl 4 6 5 = 60 ∧ (6 : ℝ) * 5 / 2 = 15 ∧ (4 : ℝ) * 15 = 60 ∧ P (O4 6) (pl 4 6 5) = 96 ∧
    (4 : ℝ) < 5 := by
  refine ⟨by unfold pl; norm_num, by norm_num, by norm_num, ?_, by norm_num⟩
  calc P (O4 6) (pl 4 6 5) = 36 + 60 := by unfold P O4 pl; norm_num
    _ = 96 := by norm_num

/-- Primer 2 (model, a = 10, v_s = 13): a/2 = 5, v² = 13² − 5² = 169 − 25 = 144 in (v > 0) natanko v = 12. -/
theorem primer2_v (v : ℝ) : (0 < v ∧ v ^ 2 = 13 ^ 2 - (10 / 2) ^ 2) ↔ v = 12 := by
  have h : (13 : ℝ) ^ 2 - (10 / 2) ^ 2 = 169 - 25 := by norm_num
  rw [h, show (169 : ℝ) - 25 = 144 by norm_num, show (144 : ℝ) = 12 ^ 2 by norm_num]
  exact koren_enolicno v 12 (by norm_num)

/-- Primer 2: O = 10² = 100, V = 100 · 12 / 3 = 400. -/
theorem primer2_V : O4 10 = 100 ∧ Vpir (O4 10) 12 = 400 := by
  refine ⟨by unfold O4; norm_num, ?_⟩
  calc Vpir (O4 10) 12 = 100 * 12 / 3 := by unfold O4 Vpir; norm_num
    _ = 400 := by norm_num

/-- Primer 3 (lesena piramida, a = 8, V = 64): O = 8² = 64 in V = O · v / 3 natanko pri
v = 3 · 64 / 64 = 3. -/
theorem primer3_v (v : ℝ) : O4 8 = 64 ∧ (64 = Vpir (O4 8) v ↔ v = 3) := by
  have hO : O4 8 = 64 := by unfold O4; norm_num
  refine ⟨hO, ?_⟩
  rw [hO, visina_iz_V 64 v 64 (by norm_num)]
  norm_num

/-- Primer 3, korak 3: v_s² = 3² + 4² = 25 in (v_s > 0) natanko v_s = 5. -/
theorem primer3_vs (vs : ℝ) : (0 < vs ∧ vs ^ 2 = 3 ^ 2 + (8 / 2) ^ 2) ↔ vs = 5 := by
  rw [show (3 : ℝ) ^ 2 + (8 / 2) ^ 2 = 5 ^ 2 by norm_num]
  exact koren_enolicno vs 5 (by norm_num)

/-- Primer 3, Premisli: pl = 4 · (8 · 5)/2 = 80, P = 64 + 80 = 144. -/
theorem primer3_P : pl 4 8 5 = 80 ∧ P (O4 8) (pl 4 8 5) = 144 := by
  refine ⟨by unfold pl; norm_num, ?_⟩
  calc P (O4 8) (pl 4 8 5) = 64 + 80 := by unfold P O4 pl; norm_num
    _ = 144 := by norm_num

/-! ## Iz vsakdanjega življenja -/

/-- Iz vsakdanjega življenja (čaj): toliko čaja kot v prizmi je v treh piramidah (3 · V_pir = V_pri), ki stanejo
3 · 3 = 9 € > 6 €. -/
theorem caj (O v : ℝ) : 3 * Vpir O v = Vpri O v ∧ (3 : ℝ) * 3 = 9 ∧ (6 : ℝ) < 9 :=
  ⟨tri_piramide O v, by norm_num, by norm_num⟩

/-! ## Preveri se -/

/-- Preveri se 1: O = 36, v = 4: prizma 36 · 4 = 144, piramida 144/3 = 48 (ne 72 = 144/2). -/
theorem kviz1 : Vpri 36 4 = 144 ∧ Vpir 36 4 = 48 ∧ (144 : ℝ) / 2 = 72 := by
  unfold Vpri Vpir; norm_num

/-- Preveri se 2 (Keopsova piramida, a ≈ 230, v ≈ 140): 230² = 52 900 ≈ 53 000, 53 000 · 140 = 7 420 000;
prostornina 230² · 140 / 3 ≈ 2,5 milijona (na desetinko milijona); napačni odgovori: prizma ≈ 7,4 milijona,
230 · 140 / 3 ≈ 11 000 (na tisoč), polovica prizme ≈ 3,7 milijona. -/
theorem kviz2 : (230 : ℝ) ^ 2 = 52900 ∧ |(52900 : ℝ) - 53000| < 500 ∧ (53000 : ℝ) * 140 = 7420000 ∧
    |Vpir (O4 230) 140 - 2500000| < 50000 ∧ |Vpri (O4 230) 140 - 7400000| < 50000 ∧
    |Vpir 230 140 - 11000| < 500 ∧ |Vpri (O4 230) 140 / 2 - 3700000| < 50000 := by
  unfold Vpir Vpri O4
  norm_num [abs_lt]

/-- Preveri se 4: a = 6, V = 96: O = 36 in V = O · v / 3 natanko pri v = 3 · 96 / 36 = 8; napačna odgovora:
96 : 36 ≈ 2,7 in 96 : 6 = 16. -/
theorem kviz4 (v : ℝ) : (96 = Vpir (O4 6) v ↔ v = 8) ∧ |(96 : ℝ) / 36 - 27 / 10| < 1 / 20 ∧
    (96 : ℝ) / 6 = 16 := by
  refine ⟨?_, by norm_num [abs_lt], by norm_num⟩
  rw [visina_iz_V _ v 96 (by unfold O4; norm_num)]
  unfold O4
  norm_num

/-- Preveri se 5 (lampion, a = 10, v = 12): v_s = √(12² + 5²) = 13, plašč 4 · (10 · 13)/2 = 260; napačni:
z v namesto v_s 240, s prišteto osnovno ploskvijo 360, brez deljenja z 2 520. -/
theorem kviz5 : Real.sqrt (12 ^ 2 + 5 ^ 2) = 13 ∧ pl 4 10 13 = 260 ∧ pl 4 10 12 = 240 ∧
    O4 10 + pl 4 10 13 = 360 ∧ (4 : ℝ) * (10 * 13) = 520 := by
  refine ⟨?_, by unfold pl; norm_num, by unfold pl; norm_num, by unfold O4 pl; norm_num, by norm_num⟩
  rw [show (12 : ℝ) ^ 2 + 5 ^ 2 = 13 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

end Evklid.Lekcije.MAT_OS_9.Piramida
