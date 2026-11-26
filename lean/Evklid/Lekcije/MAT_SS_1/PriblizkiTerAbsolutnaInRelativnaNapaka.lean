/-
vir: content/lessons/MAT-SS-1/priblizki-ter-absolutna-in-relativna-napaka.md
sha256: 4a0131c539549722e231fb1c0ae0ea3328d6b22dabfc221eb70da54f425e52d6
Ni v Leanu: risbe in simulacija; vsebinski zgledi (telefon, Triglav, sneg, potok, travnik, plošča) kot
modeli (dokazana je algebra); »meja napake je pol najmanjšega razdelka« in izbira merila kot praksa;
»decimalni zapis iracionalnega števila je neskončen in neperiodičen« (dokazano je le, da sta √2 in π
iracionalni); pravilo zaokroževanja je formalizirano z Mathlibovim `round` (zaokrožanje navzgor pri 5:
round y = ⌊y + ½⌋), zaokrožanje na n decimalk oz. mest kot round(x·10ⁿ)/10ⁿ; »približno« pravili
δ(xy) ≈ δx + δy in δ(x/y) ≈ δx + δy nista dokazljivi kot enakosti (»≈« ni matematična relacija): dokazana je
natančna meja (relativna napaka produkta ≤ δa + δb + δa·δb, količnika (δx + δy)/(1 − δy)) in izpuščeni člen;
»razlika je zanemarljiva« (deljenje s približkom) je dokazana kot ocena |Δ/|x| − Δ/|x̄|| ≤ δx·Δ/|x̄|;
Primer 3 b) in Primer 4 uporabljata približno pravilo (dokazani so računi in natančne meje v Primeru 4);
besedni utemeljitvi (Pogoste napake, »komu bi zaupal«) in »razlika podobnih števil ima veliko relativno
napako« kot opis (dokazan je primer: 2/7 ≈ 29 % proti 1/42 ≈ 2,4 %); postopki (Ponovitev), točkovanje; besedilo
napačnih odgovorov v Preveri se (kjer gre, je dokazano, da napačna vrednost ni pravilna). Približki so
dokazani kot |točna − približek| < pol enote zadnjega mesta. Decimalna števila so točna racionalna števila v ℝ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.PriblizkiTerAbsolutnaInRelativnaNapaka

open Real

/-! ## Zaokroževanje -/

/-- Zaokrožanje števila x na n decimalk (n < 0: na mesta, npr. n = −2 na stotice). -/
noncomputable def zaokrozi (x : ℝ) (n : ℤ) : ℝ := round (x * 10 ^ n) / 10 ^ n

/-- Pomožno: če je k − ½ ≤ x·10ⁿ < k + ½, je zaokrožena vrednost k/10ⁿ (prva odvržena števka 0–4 navzdol,
5–9 navzgor). -/
theorem zaokrozi_eq (x : ℝ) (n k : ℤ) (h1 : (k : ℝ) - 1 / 2 ≤ x * 10 ^ n) (h2 : x * 10 ^ n < k + 1 / 2) :
    zaokrozi x n = k / 10 ^ n := by
  unfold zaokrozi
  congr 1
  have : round (x * 10 ^ n) = k := by
    rw [round_eq, Int.floor_eq_iff]
    constructor <;> linarith
  rw [this]

/-- Predpostavki `zaokrozi_eq` se dasta izpolniti (x = 2,449, n = 1, k = 24). -/
example : ((24:ℤ) : ℝ) - 1 / 2 ≤ 2.449 * 10 ^ (1:ℤ) ∧ (2.449:ℝ) * 10 ^ (1:ℤ) < (24:ℤ) + 1 / 2 := by norm_num

/-- Razlaga 3: pri zaokroževanju na n decimalk absolutna napaka nikoli ne preseže pol enote zadnjega mesta
(½·10⁻ⁿ; na dve decimalki 0,005, na eno 0,05). -/
theorem pol_enote (x : ℝ) (n : ℤ) : |zaokrozi x n - x| ≤ 1 / 2 * 10 ^ (-n) := by
  have hp : (0:ℝ) < 10 ^ n := zpow_pos (by norm_num) n
  have h := abs_sub_round (x * 10 ^ n)
  have e : zaokrozi x n - x = (round (x * 10 ^ n) - x * 10 ^ n) / 10 ^ n := by
    unfold zaokrozi; field_simp
  rw [e, abs_div, abs_of_pos hp, div_le_iff₀ hp, zpow_neg, mul_assoc, inv_mul_cancel₀ hp.ne', mul_one,
    abs_sub_comm]
  exact h

/-- Razlaga 3: na dve decimalki je meja 0,005, na eno 0,05. -/
theorem pol_enote_primera : (1 / 2 : ℝ) * 10 ^ (-(2:ℤ)) = 0.005 ∧ (1 / 2 : ℝ) * 10 ^ (-(1:ℤ)) = 0.05 := by
  norm_num

/-- Razlaga 1: √2 in π sta iracionalni števili. -/
theorem iracionalni : Irrational (√2) ∧ Irrational π := ⟨irrational_sqrt_two, irrational_pi⟩

/-- Razlaga 1, tabela: √2 ≈ 1,4; 1,41; 1,414. -/
theorem koren2 : zaokrozi (√2) 1 = 1.4 ∧ zaokrozi (√2) 2 = 1.41 ∧ zaokrozi (√2) 3 = 1.414 := by
  have h1 : (1.41421:ℝ) < √2 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have h2 : √2 < (1.41422:ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨?_, ?_, ?_⟩
  · rw [zaokrozi_eq _ _ 14 (by norm_num; linarith) (by norm_num; linarith)]; norm_num
  · rw [zaokrozi_eq _ _ 141 (by norm_num; linarith) (by norm_num; linarith)]; norm_num
  · rw [zaokrozi_eq _ _ 1414 (by norm_num; linarith) (by norm_num; linarith)]; norm_num

/-- Razlaga 1, tabela: π ≈ 3,1; 3,14; 3,142 (na tri decimalke je odvržena števka 5, zato 3,142). -/
theorem pi_priblizki : zaokrozi π 1 = 3.1 ∧ zaokrozi π 2 = 3.14 ∧ zaokrozi π 3 = 3.142 := by
  have h1 := Real.pi_gt_d6
  have h2 := Real.pi_lt_d6
  refine ⟨?_, ?_, ?_⟩
  · rw [zaokrozi_eq _ _ 31 (by norm_num; linarith) (by norm_num; linarith)]; norm_num
  · rw [zaokrozi_eq _ _ 314 (by norm_num; linarith) (by norm_num; linarith)]; norm_num
  · rw [zaokrozi_eq _ _ 3142 (by norm_num; linarith) (by norm_num; linarith)]; norm_num

/-- Razlaga 1, preizkus: 2,71828 na dve decimalki je 2,72. -/
theorem preizkus_e : zaokrozi 2.71828 2 = 2.72 := by
  rw [zaokrozi_eq _ _ 272 (by norm_num) (by norm_num)]; norm_num

/-- Razlaga 2, Primer 1: 2864 na stotice je 2900, na tisočice 3000, na desetice 2860 (29 ni 2900). -/
theorem triglav : zaokrozi 2864 (-2) = 2900 ∧ zaokrozi 2864 (-3) = 3000 ∧ zaokrozi 2864 (-1) = 2860 ∧
    (29:ℝ) ≠ 2900 := by
  refine ⟨?_, ?_, ?_, by norm_num⟩
  · rw [zaokrozi_eq _ _ 29 (by norm_num) (by norm_num)]; norm_num
  · rw [zaokrozi_eq _ _ 3 (by norm_num) (by norm_num)]; norm_num
  · rw [zaokrozi_eq _ _ 286 (by norm_num) (by norm_num)]; norm_num

/-- Razlaga 2, Pogoste napake 5: 2,449 na eno decimalko je 2,4; v dveh korakih (2,45, nato 2,5) dobimo
napačno 2,5. -/
theorem dva_koraka : zaokrozi 2.449 1 = 2.4 ∧ zaokrozi 2.449 2 = 2.45 ∧ zaokrozi 2.45 1 = 2.5 := by
  refine ⟨?_, ?_, ?_⟩
  · rw [zaokrozi_eq _ _ 24 (by norm_num) (by norm_num)]; norm_num
  · rw [zaokrozi_eq _ _ 245 (by norm_num) (by norm_num)]; norm_num
  · rw [zaokrozi_eq _ _ 25 (by norm_num) (by norm_num)]; norm_num

/-- Razlaga 3 (simulacija): 3 405 127 na tisočice je 3 405 000, na desettisočice 3 410 000; absolutni napaki
127 in 4873. -/
theorem simulacija : zaokrozi 3405127 (-3) = 3405000 ∧ zaokrozi 3405127 (-4) = 3410000 ∧
    |(3405000:ℝ) - 3405127| = 127 ∧ |(3410000:ℝ) - 3405127| = 4873 := by
  refine ⟨?_, ?_, by norm_num [abs_of_neg], by norm_num [abs_of_pos]⟩
  · rw [zaokrozi_eq _ _ 3405 (by norm_num) (by norm_num)]; norm_num
  · rw [zaokrozi_eq _ _ 341 (by norm_num) (by norm_num)]; norm_num

/-! ## Absolutna napaka -/

/-- Razlaga 3, RACUN: za π ≈ 3,14 je Δx = |3,14 − π| ≈ 0,0016. -/
theorem napaka_pi : |(|3.14 - π|) - 0.0016| < 0.00005 := by
  have h1 := Real.pi_gt_d6
  have h2 := Real.pi_lt_d6
  rw [abs_of_neg (by linarith : (3.14:ℝ) - π < 0), abs_sub_lt_iff]
  constructor <;> linarith

/-- Razlaga 3, Povzetek: x = x̄ ± Δx (|x − x̄| ≤ Δx) pomeni x ∈ [x̄ − Δx, x̄ + Δx]. -/
theorem interval (x xb D : ℝ) : |x - xb| ≤ D ↔ x ∈ Set.Icc (xb - D) (xb + D) := by
  rw [abs_le, Set.mem_Icc]
  constructor <;> rintro ⟨h1, h2⟩ <;> constructor <;> linarith

/-- Razlaga 3, preizkus, Preveri se 1: (42 ± 1) cm je [41, 43], (12,0 ± 0,2) s je [11,8; 12,2],
(12,4 ± 0,2) cm je [12,2; 12,6] (napaka je 0,2, polovica dolžine 0,4 intervala). -/
theorem intervali (x : ℝ) : (|x - 42| ≤ 1 ↔ x ∈ Set.Icc (41:ℝ) 43) ∧
    (|x - 12.0| ≤ 0.2 ↔ x ∈ Set.Icc (11.8:ℝ) 12.2) ∧ (|x - 12.4| ≤ 0.2 ↔ x ∈ Set.Icc (12.2:ℝ) 12.6) ∧
    ((12.6:ℝ) - 12.2) / 2 = 0.2 := by
  refine ⟨?_, ?_, ?_, by norm_num⟩
  · rw [interval]; norm_num
  · rw [interval]; norm_num
  · rw [interval]; norm_num

/-! ## Relativna napaka -/

/-- Zakaj se tega učimo, Razlaga 4, RACUN: obakrat 0,3 km (4,3 − 4,0 = 105,3 − 105 = 0,3), relativno
0,3/4,3 ≈ 7,0 % in 0,3/105,3 ≈ 0,28 %. -/
theorem telefon : (4.3:ℝ) - 4.0 = 0.3 ∧ (105.3:ℝ) - 105 = 0.3 ∧
    |(0.3:ℝ) / 4.3 * 100 - 7.0| < 0.05 ∧ |(0.3:ℝ) / 105.3 * 100 - 0.28| < 0.005 := by
  norm_num [abs_lt]

/-- Razlaga 4, Premisli, Pogoste napake 4, RACUN: pero 0,5/18 ≈ 2,8 %, drevo 0,5/24 ≈ 2,1 %; relativna napaka
peresa je večja, čeprav je absolutna manjša (0,5 cm < 0,5 m = 50 cm). -/
theorem pero_drevo : |(0.5:ℝ) / 18 * 100 - 2.8| < 0.05 ∧ |(0.5:ℝ) / 24 * 100 - 2.1| < 0.05 ∧
    (0.5:ℝ) / 24 < 0.5 / 18 ∧ (0.5:ℝ) < 50 := by
  norm_num [abs_lt]

/-- Razlaga 4, Bolj natančno: deljenje s približkom namesto s točno vrednostjo spremeni relativno napako
največ za δx·Δ/|x̄| (pri majhnem δx precej manj od same napake). -/
theorem deljenje_s_priblizkom (x xb D : ℝ) (hx : x ≠ 0) (hxb : xb ≠ 0) (hD : 0 ≤ D) (h : |xb - x| ≤ D) :
    abs (D / |x| - D / |xb|) ≤ (D / |x|) * (D / |xb|) := by
  have ha : 0 < |x| := abs_pos.mpr hx
  have hb : 0 < |xb| := abs_pos.mpr hxb
  have e : D / |x| - D / |xb| = D * (|xb| - |x|) / (|x| * |xb|) := by field_simp
  rw [e, abs_div, abs_mul, abs_of_nonneg hD, abs_of_pos (mul_pos ha hb), div_mul_div_comm]
  apply div_le_div_of_nonneg_right _ (mul_pos ha hb).le
  exact mul_le_mul_of_nonneg_left ((abs_abs_sub_abs_le xb x).trans h) hD

/-- Predpostavke `deljenje_s_priblizkom` se dajo izpolniti (x = 4,3, x̄ = 4,0, Δ = 0,3). -/
example : (4.3:ℝ) ≠ 0 ∧ (4.0:ℝ) ≠ 0 ∧ (0:ℝ) ≤ 0.3 ∧ |(4.0:ℝ) - 4.3| ≤ 0.3 := by norm_num [abs_le]

/-! ## Napaka vsote in razlike -/

/-- Razlaga 5, Ustno 2, Povzetek: Δ(x + y) ≤ Δx + Δy. -/
theorem napaka_vsote (x xb y yb Dx Dy : ℝ) (hx : |x - xb| ≤ Dx) (hy : |y - yb| ≤ Dy) :
    |(x + y) - (xb + yb)| ≤ Dx + Dy := by
  rw [abs_le] at *; constructor <;> linarith

/-- Predpostavki `napaka_vsote` se dasta izpolniti (dež: x = 12, y = 8). -/
example : |(12:ℝ) - 12| ≤ 1 ∧ |(8:ℝ) - 8| ≤ 1 := by norm_num

/-- Razlaga 5, Ustno 2, Pogoste napake 1: Δ(x − y) ≤ Δx + Δy (napaki se seštejeta, ne odštejeta). -/
theorem napaka_razlike (x xb y yb Dx Dy : ℝ) (hx : |x - xb| ≤ Dx) (hy : |y - yb| ≤ Dy) :
    |(x - y) - (xb - yb)| ≤ Dx + Dy := by
  rw [abs_le] at *; constructor <;> linarith

/-- Predpostavki `napaka_razlike` se dasta izpolniti (sneg: x = 42, y = 35). -/
example : |(42:ℝ) - 42| ≤ 1 ∧ |(35:ℝ) - 35| ≤ 1 := by norm_num

/-- Ustno 2: meja Δx + Δy se pri razliki doseže (x na zgornji, y na spodnji meji), zato je ne moremo
zmanjšati. -/
theorem razlika_najslabse (xb yb Dx Dy : ℝ) (hx : 0 ≤ Dx) (hy : 0 ≤ Dy) :
    |((xb + Dx) - (yb - Dy)) - (xb - yb)| = Dx + Dy := by
  rw [show (xb + Dx) - (yb - Dy) - (xb - yb) = Dx + Dy by ring, abs_of_nonneg (by linarith)]

/-- Predpostavki `razlika_najslabse` se dasta izpolniti (Δx = Δy = 1). -/
example : (0:ℝ) ≤ 1 := by norm_num

/-- Razlaga 5: dež (12 ± 1) + (8 ± 1) = (20 ± 2) mm; preizkus (30 ± 0,5) − (10 ± 0,5) = (20 ± 1) m. -/
theorem r5_primera : (12:ℝ) + 8 = 20 ∧ (1:ℝ) + 1 = 2 ∧ (30:ℝ) - 10 = 20 ∧ (0.5:ℝ) + 0.5 = 1 := by norm_num

/-! ## Napaka produkta in količnika -/

/-- Ustno 3, Bolj natančno: ab(1 + δa)(1 + δb) = ab(1 + δa + δb + δa·δb). -/
theorem produkt_identiteta (a b da db : ℝ) :
    a * (1 + da) * (b * (1 + db)) = a * b * (1 + da + db + da * db) := by ring

/-- Razlaga 6, Ustno 3 (natančna meja): za a, b > 0, |x − a| ≤ δa·a in |y − b| ≤ δb·b je relativna napaka
produkta največ δa + δb + δa·δb (približno pravilo izpusti člen δa·δb). -/
theorem napaka_produkta (a b x y da db : ℝ) (ha : 0 < a) (hb : 0 < b) (hda : 0 ≤ da)
    (hx : |x - a| ≤ da * a) (hy : |y - b| ≤ db * b) : |x * y - a * b| / (a * b) ≤ da + db + da * db := by
  have hab : 0 < a * b := mul_pos ha hb
  rw [div_le_iff₀ hab]
  have e : x * y - a * b = (x - a) * (y - b) + a * (y - b) + b * (x - a) := by ring
  rw [e]
  have h1 : |(x - a) * (y - b)| ≤ da * a * (db * b) := by
    rw [abs_mul]; exact mul_le_mul hx hy (abs_nonneg _) (by positivity)
  have h2 : |a * (y - b)| ≤ a * (db * b) := by
    rw [abs_mul, abs_of_pos ha]; exact mul_le_mul_of_nonneg_left hy ha.le
  have h3 : |b * (x - a)| ≤ b * (da * a) := by
    rw [abs_mul, abs_of_pos hb]; exact mul_le_mul_of_nonneg_left hx hb.le
  calc |(x - a) * (y - b) + a * (y - b) + b * (x - a)|
      ≤ |(x - a) * (y - b)| + |a * (y - b)| + |b * (x - a)| := abs_add_three _ _ _
    _ ≤ da * a * (db * b) + a * (db * b) + b * (da * a) := by linarith
    _ = (da + db + da * db) * (a * b) := by ring

/-- Predpostavke `napaka_produkta` se dajo izpolniti (travnik: a = 40, b = 25, δa = 0,5/40, δb = 0,5/25). -/
example : (0:ℝ) < 40 ∧ (0:ℝ) < 25 ∧ (0:ℝ) ≤ 0.5 / 40 ∧
    |(40.5:ℝ) - 40| ≤ 0.5 / 40 * 40 ∧ |(25.5:ℝ) - 25| ≤ 0.5 / 25 * 25 := by norm_num [abs_le]

/-- Bolj natančno (količnik): največja vrednost x(1 + δx)/(y(1 − δy)) ima relativno napako
(1 + δx)/(1 − δy) − 1 = (δx + δy)/(1 − δy), kar je ≥ δx + δy (pri δy < 1). -/
theorem napaka_kolicnika (dx dy : ℝ) (hx : 0 ≤ dx) (hy0 : 0 ≤ dy) (hy : dy < 1) :
    (1 + dx) / (1 - dy) - 1 = (dx + dy) / (1 - dy) ∧ dx + dy ≤ (dx + dy) / (1 - dy) := by
  have hd : 0 < 1 - dy := by linarith
  refine ⟨by field_simp; ring, ?_⟩
  rw [le_div_iff₀ hd]
  nlinarith

/-- Predpostavke `napaka_kolicnika` se dajo izpolniti (δx = 0,01, δy = 0,025). -/
example : (0:ℝ) ≤ 0.01 ∧ (0:ℝ) ≤ 0.025 ∧ (0.025:ℝ) < 1 := by norm_num

/-- Bolj natančno: 1/0,98 = 1,0204… ≈ 1 + 0,02. -/
theorem obratna : |(1:ℝ) / 0.98 - 1.0204| < 0.00005 ∧ |(1:ℝ) / 0.98 - (1 + 0.02)| < 0.001 := by
  norm_num [abs_lt]

/-- Razlaga 6, Na sliki, RACUN: travnik 40·25 = 1000; meji 39,5·24,5 = 967,75 in 40,5·25,5 = 1032,75;
ocena 0,5/40 + 0,5/25 = 0,0325, 3,25 % od 1000 je 32,5 (meji 967,5 in 1032,5); natančno 32,75; razlika
0,25 = 0,5·0,5; za a ∈ [39,5; 40,5], b ∈ [24,5; 25,5] je ab ∈ [967,75; 1032,75]. -/
theorem travnik : (40:ℝ) * 25 = 1000 ∧ (39.5:ℝ) * 24.5 = 967.75 ∧ (40.5:ℝ) * 25.5 = 1032.75 ∧
    (0.5:ℝ) / 40 + 0.5 / 25 = 0.0325 ∧ (0.0325:ℝ) * 1000 = 32.5 ∧ (1000:ℝ) - 32.5 = 967.5 ∧
    (1000:ℝ) + 32.5 = 1032.5 ∧ (1032.75:ℝ) - 1000 = 32.75 ∧ (32.75:ℝ) - 32.5 = 0.5 * 0.5 ∧
    ∀ a b : ℝ, a ∈ Set.Icc (39.5:ℝ) 40.5 → b ∈ Set.Icc (24.5:ℝ) 25.5 → a * b ∈ Set.Icc (967.75:ℝ) 1032.75 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, ?_⟩
  rintro a b ⟨ha1, ha2⟩ ⟨hb1, hb2⟩
  constructor <;> nlinarith

/-- Razlaga 6, Premisli, RACUN: prekratka stranica a za 0,5 m zmanjša ploščino za pas b·Δa = 25·0,5 = 12,5 m²
(40·25 − 39,5·25 = 12,5). -/
theorem pas : (25:ℝ) * 0.5 = 12.5 ∧ (40:ℝ) * 25 - 39.5 * 25 = 12.5 := by norm_num

/-- Na sliki: (a + Δa)(b + Δb) = ab + b·Δa + a·Δb + Δa·Δb; pas b·Δa je delež Δa/a = δa ploščine, pas a·Δb
delež δb. -/
theorem na_sliki (a b Da Db : ℝ) (ha : a ≠ 0) (hb : b ≠ 0) :
    (a + Da) * (b + Db) = a * b + b * Da + a * Db + Da * Db ∧ b * Da / (a * b) = Da / a ∧
    a * Db / (a * b) = Db / b := by
  refine ⟨by ring, by field_simp, by field_simp⟩

/-- Predpostavki `na_sliki` se dasta izpolniti (a = 40, b = 25). -/
example : (40:ℝ) ≠ 0 ∧ (25:ℝ) ≠ 0 := by norm_num

/-! ## Primeri -/

/-- Primer 1, RACUN: Δx = |2900 − 2864| = 36 m, δx = 36/2864 ≈ 0,013 = 1,3 %; |3000 − 2864| = 136 m,
136/2864 ≈ 4,7 %. -/
theorem p1 : |(2900:ℝ) - 2864| = 36 ∧ |(36:ℝ) / 2864 - 0.013| < 0.0005 ∧ |(36:ℝ) / 2864 * 100 - 1.3| < 0.05 ∧
    |(3000:ℝ) - 2864| = 136 ∧ |(136:ℝ) / 2864 * 100 - 4.7| < 0.05 := by
  norm_num [abs_lt]

/-- Primer 2: d = 42 − 35 = 7 cm, Δd = 1 + 1 = 2 cm, δd = 2/7 ≈ 0,29 = 29 %; posamezni meritvi 1/42 ≈ 2,4 % in
1/35 ≈ 2,9 %; iz h₁ ∈ [41, 43], h₂ ∈ [34, 36] je d ∈ [5, 9], tj. d = 7 ± 2, meji se dosežeta. -/
theorem p2 : (42:ℝ) - 35 = 7 ∧ (1:ℝ) + 1 = 2 ∧ |(2:ℝ) / 7 - 0.29| < 0.005 ∧
    |(1:ℝ) / 42 * 100 - 2.4| < 0.05 ∧ |(1:ℝ) / 35 * 100 - 2.9| < 0.05 ∧
    (∀ h₁ h₂ : ℝ, |h₁ - 42| ≤ 1 → |h₂ - 35| ≤ 1 → |(h₁ - h₂) - 7| ≤ 2) ∧ (43:ℝ) - 34 = 9 ∧ (41:ℝ) - 36 = 5 := by
  refine ⟨by norm_num, by norm_num, by norm_num [abs_lt], by norm_num [abs_lt], by norm_num [abs_lt],
    fun h₁ h₂ h1 h2 => ?_, by norm_num, by norm_num⟩
  have := napaka_razlike h₁ 42 h₂ 35 1 1 h1 h2
  norm_num at this ⊢; linarith

/-- Pogoste napake 1: (42 ± 1) − (35 ± 1) ni 7 ± 0: razlika je lahko 9 ali 5. -/
theorem napaka_odstej : (43:ℝ) - 34 ≠ 7 ∧ (41:ℝ) - 36 ≠ 7 := by norm_num

/-- Primer 3, RACUN: v = 50/40 = 1,25 m/s; δs = 0,5/50 = 0,01, δt = 1/40 = 0,025; δv ≈ 0,035;
Δv ≈ 0,035·1,25 ≈ 0,044 ≈ 0,04; b) 0,02 − 0,01 = 0,01, Δt ≤ 0,01·40 = 0,4 s. -/
theorem p3 : (50:ℝ) / 40 = 1.25 ∧ (0.5:ℝ) / 50 = 0.01 ∧ (1:ℝ) / 40 = 0.025 ∧ (0.01:ℝ) + 0.025 = 0.035 ∧
    |(0.035:ℝ) * 1.25 - 0.044| < 0.0005 ∧ |(0.035:ℝ) * 1.25 - 0.04| < 0.005 ∧ (0.02:ℝ) - 0.01 = 0.01 ∧
    (0.01:ℝ) * 40 = 0.4 := by
  norm_num [abs_lt]

/-- Primer 3 (natančna meja): pri s ∈ [49,5; 50,5] in t ∈ [39; 41] je relativna napaka količnika največ
(δs + δt)/(1 − δt) = 0,035/0,975 ≈ 3,6 % (približno pravilo da 3,5 %). -/
theorem p3_natancno : ((1 + 0.01) / (1 - 0.025) - 1 : ℝ) = (0.01 + 0.025) / (1 - 0.025) ∧
    |((0.01:ℝ) + 0.025) / (1 - 0.025) * 100 - 3.6| < 0.05 ∧ (50.5:ℝ) / 39 / 1.25 = (1 + 0.01) / (1 - 0.025) := by
  norm_num [abs_lt]

/-- Primer 4, Premisli, RACUN: S = 120·80 = 9600 m²; δS ≈ 1/120 + 1/80 ≈ 0,021 = 2,1 %; ΔS ≈ 9600·(1/120 + 1/80)
= 200 m²; natančni meji 119·79 = 9401 in 121·81 = 9801 (oddaljeni 199 in 201 od 9600). -/
theorem p4 : (120:ℝ) * 80 = 9600 ∧ |(1:ℝ) / 120 + 1 / 80 - 0.021| < 0.0005 ∧
    |((1:ℝ) / 120 + 1 / 80) * 100 - 2.1| < 0.05 ∧ (9600:ℝ) * (1 / 120 + 1 / 80) = 200 ∧
    (119:ℝ) * 79 = 9401 ∧ (121:ℝ) * 81 = 9801 ∧ (9600:ℝ) - 9401 = 199 ∧ (9801:ℝ) - 9600 = 201 := by
  norm_num [abs_lt]

/-- Pogoste napake 2: absolutni napaki stranic travnika 0,5 + 0,5 = 1 nista napaka ploščine (ta je do 32,75 m²). -/
theorem napaka_produkt_abs : (0.5:ℝ) + 0.5 = 1 ∧ (1:ℝ) < 1032.75 - 1000 := by norm_num

/-- Pogoste napake 3: pri vsoti (12 ± 1) + (8 ± 1) je relativna napaka 2/20 = 10 %, ne 1/12 + 1/8 ≈ 21 %. -/
theorem napaka_vsota_rel : (2:ℝ) / 20 * 100 = 10 ∧ |((1:ℝ) / 12 + 1 / 8) * 100 - 21| < 0.5 := by
  norm_num [abs_lt]

/-! ## Za maturo -/

/-- Naloga 1, RACUN: 2/3 ≈ 0,67; Δx = |67/100 − 2/3| = |(201 − 200)/300| = 1/300; δx = (1/300) : (2/3) =
1/300 · 3/2 = 1/200 = 0,005 = 0,5 %. -/
theorem m1 : zaokrozi (2 / 3) 2 = 0.67 ∧ |(0.67:ℝ) - 2 / 3| = |(67:ℝ) / 100 - 2 / 3| ∧
    |(67:ℝ) / 100 - 2 / 3| = |((201:ℝ) - 200) / 300| ∧ |((201:ℝ) - 200) / 300| = 1 / 300 ∧
    ((1:ℝ) / 300) / (2 / 3) = 1 / 300 * (3 / 2) ∧ (1:ℝ) / 300 * (3 / 2) = 1 / 200 ∧ (1:ℝ) / 200 = 0.005 ∧
    (1:ℝ) / 200 * 100 = 0.5 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num [abs_of_pos], by norm_num, by norm_num, by norm_num,
    by norm_num⟩
  rw [zaokrozi_eq _ _ 67 (by norm_num) (by norm_num)]; norm_num

/-- Naloga 2 a), RACUN: o = 2·2,40 + 2·0,85 = 6,50 m; Δo = 0,01·4 = 0,04 m (obseg kot vsota a + a + b + b). -/
theorem m2_a : (2:ℝ) * 2.40 + 2 * 0.85 = 6.50 ∧ (0.01:ℝ) * 4 = 0.04 ∧
    ∀ a b : ℝ, |a - 2.40| ≤ 0.01 → |b - 0.85| ≤ 0.01 → |(2 * a + 2 * b) - 6.50| ≤ 0.04 := by
  refine ⟨by norm_num, by norm_num, fun a b ha hb => ?_⟩
  rw [abs_le] at *; constructor <;> linarith

/-- Naloga 2 b), RACUN: S = 2,40·0,85 = 2,04 m²; δa = 0,01/2,40 ≈ 0,004167, δb = 0,01/0,85 ≈ 0,011765,
δS ≈ 0,015931 ≈ 1,59 %, ΔS ≈ 0,015931·2,04 ≈ 0,0325 ≈ 0,03 m². -/
theorem m2_b : (2.40:ℝ) * 0.85 = 2.04 ∧ |(0.01:ℝ) / 2.40 - 0.004167| < 0.0000005 ∧
    |(0.01:ℝ) / 0.85 - 0.011765| < 0.0000005 ∧ |(0.01:ℝ) / 2.40 + 0.01 / 0.85 - 0.015931| < 0.0000005 ∧
    |((0.01:ℝ) / 2.40 + 0.01 / 0.85) * 100 - 1.59| < 0.005 ∧
    |((0.01:ℝ) / 2.40 + 0.01 / 0.85) * 2.04 - 0.0325| < 0.00005 ∧
    |((0.01:ℝ) / 2.40 + 0.01 / 0.85) * 2.04 - 0.03| < 0.005 := by
  norm_num [abs_lt]

/-- Naloga 2 c), RACUN: q = 30,6/2,04 = 15 kg/m²; δm = 0,2/30,6 ≈ 0,006536; δq ≈ 0,006536 + 0,015931 = 0,022467
≈ 2,25 %; Δq ≈ 0,022467·15 ≈ 0,337 ≈ 0,34 kg/m². -/
theorem m2_c : (30.6:ℝ) / 2.04 = 15 ∧ |(0.2:ℝ) / 30.6 - 0.006536| < 0.0000005 ∧ (0.006536:ℝ) + 0.015931 = 0.022467 ∧
    |(0.2:ℝ) / 30.6 + 0.01 / 2.40 + 0.01 / 0.85 - 0.022467| < 0.0000005 ∧
    |((0.2:ℝ) / 30.6 + 0.01 / 2.40 + 0.01 / 0.85) * 100 - 2.25| < 0.005 ∧
    |((0.2:ℝ) / 30.6 + 0.01 / 2.40 + 0.01 / 0.85) * 15 - 0.337| < 0.0005 ∧
    |((0.2:ℝ) / 30.6 + 0.01 / 2.40 + 0.01 / 0.85) * 15 - 0.34| < 0.005 := by
  norm_num [abs_lt]

/-! ## Preveri se -/

/-- Preveri se 3: (17 ± 1) + (8 ± 1) = (25 ± 2) mm, relativna napaka 2/25 = 8/100 = 8 % (ne 1/17 + 1/8 ≈ 18 %,
ne 1/25 = 4 %). -/
theorem preveri_3 : (17:ℝ) + 8 = 25 ∧ (2:ℝ) / 25 = 8 / 100 ∧ (2:ℝ) / 25 * 100 = 8 ∧
    |((1:ℝ) / 17 + 1 / 8) * 100 - 18| < 0.5 ∧ (1:ℝ) / 25 * 100 = 4 := by
  norm_num [abs_lt]

/-- Preveri se 4: pri kvadratu je relativna napaka ploščine (1 + δa)² − 1 = 2δa + δa² ≈ 2δa; iz 4 % dobimo
δa ≈ 2 % (natančno √1,04 − 1 ≈ 1,98 %, v toleranci 0,1). -/
theorem preveri_4 (da : ℝ) : (1 + da) ^ 2 - 1 = 2 * da + da ^ 2 ∧ (2 * da = 0.04 ↔ da = 0.02) ∧
    |(√1.04 - 1) * 100 - 2| < 0.1 := by
  have h1 : (1.0198:ℝ) < √1.04 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have h2 : √1.04 < (1.0199:ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by ring, ⟨fun h => by linarith, fun h => by subst h; norm_num⟩, ?_⟩
  rw [abs_sub_lt_iff]; constructor <;> linarith

/-- Preveri se 5: 12,8 − 12,3 = 0,5 °C, Δ = 0,1 + 0,1 = 0,2 °C, relativno 0,2/0,5 = 40 %. -/
theorem preveri_5 : (12.8:ℝ) - 12.3 = 0.5 ∧ (0.1:ℝ) + 0.1 = 0.2 ∧ (0.2:ℝ) / 0.5 * 100 = 40 := by norm_num

end Evklid.Lekcije.MAT_SS_1.PriblizkiTerAbsolutnaInRelativnaNapaka
