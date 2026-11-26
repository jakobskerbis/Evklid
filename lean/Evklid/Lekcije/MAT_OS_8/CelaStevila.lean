/-
vir: content/lessons/MAT-OS-8/cela-stevila.md
sha256: db3af98fe3907ef6bf810dbf9db8f4d69e7b060b8f4dcb8d130e78f73399d3bb
Ni v Leanu: zgodba o gradbišču, risbi (številska premica, prerez hiše) in simulacija kot slike; »leži bolj
desno«, »bliže ničli«, »enako daleč na nasprotnih straneh« so dokazani kot neenakosti in absolutne vrednosti
(razdalja med a in b je |b − a|, razdalja od ničle |a − 0| = |a|), ne kot geometrija premice; postavitev
premice pokonci (»desno pomeni gor«) in navodila (»pomagaj si s premico«) kot besedilo; štetje korakov
po 1 m od −6 do 9 je dokazano kot število celih števil v [−6, 9) (Finset.Ico). Opis ℤ kot množice
{…, −2, −1, 0, 1, 2, …} je dokazan kot: vsako celo število je naravno (> 0), 0 ali nasprotno naravnemu.
Besedilo napačnih odgovorov kviza: dokazano je, da napačne vrednosti niso pravilne. Vse trditve so v ℤ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_8.CelaStevila

/-! ## Zakaj se tega učimo in Razlaga 2 (premisli): Žanova trditev -/

/-- Zakaj se tega učimo in Razlaga 2 (premisli): Žanova trditev »garaža (−6) je višje od kleti (−3)« je
napačna: −3 > −6 in garaža je 3 m pod kletjo (−3 − (−6) = 3). -/
theorem zan_se_moti : ¬ ((-6 : ℤ) > -3) ∧ (-3 : ℤ) > -6 ∧ (-3 : ℤ) - (-6) = 3 := by
  refine ⟨by norm_num, by norm_num, by norm_num⟩

/-! ## Razlaga 1: cela števila -/

/-- Razlaga 1: ℤ sestavljajo naravna števila 1, 2, 3, …, število 0 in negativna števila −1, −2, −3, …:
vsako celo število je naravno (n > 0), 0 ali nasprotno naravnemu. -/
theorem cela_stevila (z : ℤ) :
    (∃ n : ℕ, 0 < n ∧ z = n) ∨ z = 0 ∨ (∃ n : ℕ, 0 < n ∧ z = -n) := by
  rcases lt_trichotomy z 0 with h | h | h
  · right; right
    refine ⟨z.natAbs, by omega, by omega⟩
  · right; left; exact h
  · left
    refine ⟨z.natAbs, by omega, by omega⟩

/-- Razlaga 1: število 0 ni ne pozitivno ne negativno (tudi Pogoste napake 4 in Preveri se 1). -/
theorem nic_ni_pozitivna_ne_negativna : ¬ (0 : ℤ) > 0 ∧ ¬ (0 : ℤ) < 0 := by
  exact ⟨lt_irrefl 0, lt_irrefl 0⟩

/-- Razlaga 1 (preizkus): −3 je negativno celo število. -/
theorem minus_tri_negativno : (-3 : ℤ) < 0 := by norm_num

/-! ## Razlaga 2: številska premica in primerjanje -/

/-- Razlaga 2: korak med sosednjima številoma je povsod enak (1). -/
theorem enak_korak (n : ℤ) : (n + 1) - n = 1 := by ring

/-- Razlaga 2: −2 > −5. -/
theorem primer_premica : (-2 : ℤ) > -5 := by norm_num

/-- Razlaga 2 (preizkus): −1 je večje od −4. -/
theorem preizkus_premica : (-1 : ℤ) > -4 := by norm_num

/-! ## Razlaga 3: nasprotna števila -/

/-- Razlaga 3: nasprotna števila od 7, −4 in 0 so −7, 4 (−(−4) = 4) in 0. -/
theorem nasprotna_primeri : -(7 : ℤ) = -7 ∧ -(-4 : ℤ) = 4 ∧ -(0 : ℤ) = 0 := by
  refine ⟨rfl, by norm_num, by norm_num⟩

/-- Razlaga 3 in Povzetek: število in njegovo nasprotno število imata vsoto 0: a + (−a) = 0. -/
theorem vsota_nasprotnih (a : ℤ) : a + (-a) = 0 := by ring

/-- Povzetek (in Pogoste napake 3): −(−a) = a. -/
theorem nasprotno_nasprotnega (a : ℤ) : -(-a) = a := neg_neg a

/-- Razlaga 3 in Povzetek: nasprotni števili a ≠ 0 in −a sta enako daleč od 0 (|a| = |−a|) in na
nasprotnih straneh ničle (natanko eno je pozitivno, drugo negativno). -/
theorem nasprotni_na_nasprotnih_straneh (a : ℤ) (ha : a ≠ 0) :
    |a - 0| = |(-a) - 0| ∧ ((0 < a ∧ -a < 0) ∨ (a < 0 ∧ 0 < -a)) := by
  refine ⟨by simp, ?_⟩
  rcases lt_or_gt_of_ne ha with h | h
  · right; exact ⟨h, by linarith⟩
  · left; exact ⟨h, by linarith⟩

/-- Predpostavka `nasprotni_na_nasprotnih_straneh` se da izpolniti (a = 3). -/
example : (3 : ℤ) ≠ 0 := by norm_num

/-- Razlaga 3 (preizkus): nasprotno število od −9 je 9. -/
theorem preizkus_nasprotno : -(-9 : ℤ) = 9 := by norm_num

/-! ## Razlaga 4: absolutna vrednost -/

/-- Razlaga 4: absolutna vrednost je razdalja od 0 (|a| = |a − 0|) in ni nikoli negativna: |a| ≥ 0
(tudi Povzetek in Preveri se 1). -/
theorem abs_razdalja_nenegativna (a : ℤ) : |a| = |a - 0| ∧ 0 ≤ |a| :=
  ⟨by simp, abs_nonneg a⟩

/-- Razlaga 4: vedro iz kleti (−3) in iz prvega nadstropja (3) do pritličja: razdalja od ničle je obakrat 3. -/
theorem vedro : |(-3 : ℤ)| = 3 ∧ |(3 : ℤ)| = 3 := by norm_num

/-- Razlaga 4: |5| = 5, |−5| = 5, |0| = 0. -/
theorem abs_primeri : |(5 : ℤ)| = 5 ∧ |(-5 : ℤ)| = 5 ∧ |(0 : ℤ)| = 0 := by norm_num

/-- Razlaga 4 in Povzetek: nasprotni števili imata enako absolutno vrednost: |a| = |−a|. -/
theorem abs_nasprotnega (a : ℤ) : |a| = |-a| := (abs_neg a).symm

/-- Razlaga 4 (preizkus): |−6| = 6. -/
theorem preizkus_abs : |(-6 : ℤ)| = 6 := by norm_num

/-- Razlaga 4 (simulacija): ko se 4 premakne na −4, preskoči na drugo stran ničle, absolutna vrednost pa
ostane 4. -/
theorem simulacija : (0 : ℤ) < 4 ∧ (-4 : ℤ) < 0 ∧ |(4 : ℤ)| = 4 ∧ |(-4 : ℤ)| = 4 := by norm_num

/-! ## Razlaga 5: primerjanje -/

/-- Razlaga 5, tabela, vrstica 1: od števil različnih predznakov je večje pozitivno (primer 2 > −8). -/
theorem razlicna_predznaka (a b : ℤ) (ha : 0 < a) (hb : b < 0) : a > b := by linarith

/-- Predpostavki `razlicna_predznaka` se dasta izpolniti (a = 2, b = −8). -/
example : (0 : ℤ) < 2 ∧ (-8 : ℤ) < 0 := by norm_num

/-- Razlaga 5, tabela, vrstica 2: od dveh pozitivnih števil je večje tisto z večjo absolutno vrednostjo. -/
theorem obe_pozitivni (a b : ℤ) (ha : 0 < a) (hb : 0 < b) : a > b ↔ |a| > |b| := by
  rw [abs_of_pos ha, abs_of_pos hb]

/-- Predpostavki `obe_pozitivni` se dasta izpolniti (a = 7, b = 3). -/
example : (0 : ℤ) < 7 ∧ (0 : ℤ) < 3 := by norm_num

/-- Razlaga 5, tabela, vrstica 3, premisli in Povzetek: od dveh negativnih števil je večje tisto z manjšo
absolutno vrednostjo (bliže ničli). -/
theorem obe_negativni (a b : ℤ) (ha : a < 0) (hb : b < 0) : a > b ↔ |a| < |b| := by
  rw [abs_of_neg ha, abs_of_neg hb]
  constructor <;> intro h <;> linarith

/-- Predpostavki `obe_negativni` se dasta izpolniti (a = −3, b = −7). -/
example : (-3 : ℤ) < 0 ∧ (-7 : ℤ) < 0 := by norm_num

/-- Razlaga 5, primeri iz tabele: 2 > −8, 7 > 3, −3 > −7; premisli: klet (−3) je višje kot garaža (−6). -/
theorem tabela_primeri : (2 : ℤ) > -8 ∧ (7 : ℤ) > 3 ∧ (-3 : ℤ) > -7 ∧ (-3 : ℤ) > -6 := by norm_num

/-- Razlaga 5 (preizkus): 0 > −100, ker je vsako negativno število manjše od 0. -/
theorem preizkus_nic (b : ℤ) (hb : b < 0) : (0 : ℤ) > -100 ∧ 0 > b := ⟨by norm_num, hb⟩

/-- Predpostavka `preizkus_nic` se da izpolniti (b = −100). -/
example : (-100 : ℤ) < 0 := by norm_num

/-! ## Primer 1: razvrščanje -/

/-- Primer 1, koraki 1–4: −6 in −1 sta manjši od 0 in od pozitivnih 3, 5; |−6| = 6 > |−1| = 1, zato
−6 < −1; 3 < 5; skupaj −6 < −1 < 0 < 3 < 5. -/
theorem primer1_koraki :
    ((-6 : ℤ) < 0 ∧ (-1 : ℤ) < 0 ∧ (-6 : ℤ) < 3 ∧ (-1 : ℤ) < 3) ∧
    (|(-6 : ℤ)| = 6 ∧ |(-1 : ℤ)| = 1 ∧ (6 : ℤ) > 1 ∧ (-6 : ℤ) < -1) ∧
    (3 : ℤ) < 5 ∧
    ((-6 : ℤ) < -1 ∧ (-1 : ℤ) < 0 ∧ (0 : ℤ) < 3 ∧ (3 : ℤ) < 5) := by
  norm_num

/-- Primer 1, odgovor: seznam −6, −1, 0, 3, 5 je natanko preureditev danih števil 3, −6, 0, −1, 5 in je
strogo naraščajoč (vrstni red od najmanjšega do največjega). -/
theorem primer1_odgovor :
    List.Perm [(3 : ℤ), -6, 0, -1, 5] [-6, -1, 0, 3, 5] ∧
    List.Pairwise (· < ·) [(-6 : ℤ), -1, 0, 3, 5] := by
  decide

/-! ## Primer 2: nasprotno število in absolutna vrednost -/

/-- Primer 2, koraki 1–2: za −9 je −(−9) = 9 in |−9| = 9; za 12 je nasprotno −12 in |12| = 12. -/
theorem primer2_koraki :
    -(-9 : ℤ) = 9 ∧ |(-9 : ℤ)| = 9 ∧ -(12 : ℤ) = -12 ∧ |(12 : ℤ)| = 12 := by norm_num

/-- Primer 2, korak 3: |−9| = |9| in |12| = |−12|. -/
theorem primer2_preverba : |(-9 : ℤ)| = |(9 : ℤ)| ∧ |(12 : ℤ)| = |(-12 : ℤ)| := by norm_num

/-! ## Primer 3: dvigalo na gradbišču -/

/-- Primer 3, formula: števili na nasprotnih straneh ničle (a < 0 < b) imata razdaljo |b − a| = |a| + |b|
(tudi Povzetek). -/
theorem razdalja_cez_nic (a b : ℤ) (ha : a < 0) (hb : 0 < b) : |b - a| = |a| + |b| := by
  rw [abs_of_neg ha, abs_of_pos hb, abs_of_pos (by linarith)]
  ring

/-- Predpostavki `razdalja_cez_nic` se dasta izpolniti (a = −6, b = 9). -/
example : (-6 : ℤ) < 0 ∧ (0 : ℤ) < 9 := by norm_num

/-- Primer 3, koraki 2–4 in premisli: od garaže (−6) do strehe (9) je |9 − (−6)| = |−6| + |9| = 6 + 9 = 15. -/
theorem primer3 : |(9 : ℤ) - (-6)| = 15 := by
  calc |(9 : ℤ) - (-6)| = |(-6 : ℤ)| + |(9 : ℤ)| := razdalja_cez_nic (-6) 9 (by norm_num) (by norm_num)
    _ = 6 + 9 := by norm_num
    _ = 15 := by norm_num

/-- Primer 3 (premisli): od −6 do 9 je 15 korakov po 1 (celih števil v [−6, 9) je 15). -/
theorem primer3_koraki : (Finset.Ico (-6 : ℤ) 9).card = 15 := by
  rw [Int.card_Ico]; rfl

/-! ## Pogoste napake -/

/-- Pogoste napake 1: »−6 je več kot −3« ne velja; −3 > −6. -/
theorem napaka1 : ¬ ((-6 : ℤ) > -3) ∧ (-3 : ℤ) > -6 := by norm_num

/-- Pogoste napake 2: |5| ≠ −5, pravilno |5| = 5. -/
theorem napaka2 : |(5 : ℤ)| ≠ -5 ∧ |(5 : ℤ)| = 5 := by norm_num

/-- Pogoste napake 3 in Preveri se 1: nasprotno od −3 ni −3, ampak pozitivno število 3 (nasprotno število
torej ni vedno negativno). -/
theorem napaka3 : -(-3 : ℤ) ≠ -3 ∧ -(-3 : ℤ) = 3 ∧ (0 : ℤ) < -(-3) := by norm_num

/-- Pogoste napake 4: 0 je celo število in je nasprotna sama sebi (da ni pozitivna, je
`nic_ni_pozitivna_ne_negativna`). -/
theorem napaka4 : -(0 : ℤ) = 0 := neg_zero

/-- Pogoste napake 5: od −6 do 9 ni 9 − 6 = 3, ampak 6 + 9 = 15. -/
theorem napaka5 : (9 : ℤ) - 6 = 3 ∧ |(9 : ℤ) - (-6)| ≠ 3 ∧ (6 : ℤ) + 9 = 15 := by norm_num

/-! ## Drugače: Na sliki -/

/-- Na sliki: od višin −6, −3, 0, 3, 9 je −6 najmanjše; 3 in −3 sta nasprotni; |−3| = |3| = 3. -/
theorem na_sliki :
    (∀ h ∈ ({-6, -3, 0, 3, 9} : Finset ℤ), -6 ≤ h) ∧ -(3 : ℤ) = -3 ∧
      |(-3 : ℤ)| = |(3 : ℤ)| ∧ |(3 : ℤ)| = 3 := by
  refine ⟨by decide, rfl, by norm_num, by norm_num⟩

/-! ## Drugače: Bolj natančno -/

/-- Bolj natančno: |a| = a za a ≥ 0 in |a| = −a za a < 0 (definicija po primerih). -/
theorem abs_po_primerih (a : ℤ) : |a| = if 0 ≤ a then a else -a := by
  split_ifs with h
  · exact abs_of_nonneg h
  · exact abs_of_neg (not_le.mp h)

/-- Bolj natančno: če je a < 0, je −a > 0. -/
theorem neg_pozitiven (a : ℤ) (ha : a < 0) : -a > 0 := by linarith

/-- Predpostavka `neg_pozitiven` se da izpolniti (a = −6). -/
example : (-6 : ℤ) < 0 := by norm_num

/-- Bolj natančno: |−6| = −(−6) = 6. -/
theorem abs_minus_sest : |(-6 : ℤ)| = 6 := by
  calc |(-6 : ℤ)| = -(-6) := abs_of_neg (by norm_num)
    _ = 6 := by norm_num

/-- Bolj natančno: |a| = 0 natanko tedaj, ko je a = 0. -/
theorem abs_nic (a : ℤ) : |a| = 0 ↔ a = 0 := abs_eq_zero

/-- Bolj natančno: |x| = 5 ima natanko dve rešitvi, x = 5 ali x = −5. -/
theorem abs_enacba (x : ℤ) : |x| = 5 ↔ x = 5 ∨ x = -5 := abs_eq (by norm_num)

/-- Bolj natančno: |x| = −2 nima rešitve. -/
theorem abs_negativna (x : ℤ) : |x| ≠ -2 := by
  have := abs_nonneg x
  omega

/-! ## Preveri se -/

/-- Preveri se 1: pravilno je, da absolutna vrednost ni nikoli negativna; |−3| = 3 ≠ −3. -/
theorem preveri1 : (∀ a : ℤ, 0 ≤ |a|) ∧ |(-3 : ℤ)| ≠ -3 ∧ |(-3 : ℤ)| = 3 :=
  ⟨abs_nonneg, by norm_num, by norm_num⟩

/-- Preveri se 2: |−11| + |4| = 11 + 4 = 15 (ne −11 + 4 = −7 in ne 11 − 4 = 7). -/
theorem preveri2 : |(-11 : ℤ)| + |(4 : ℤ)| = 15 ∧ (-11 : ℤ) + 4 = -7 ∧ (11 : ℤ) - 4 = 7 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  calc |(-11 : ℤ)| + |(4 : ℤ)| = 11 + 4 := by norm_num
    _ = 15 := by norm_num

/-- Preveri se 3: Mihov vrstni red −2 < −8 je napačen; pravilno −8 < −2 < 0 < 5 (preureditev danih števil). -/
theorem preveri3 :
    ¬ ((-2 : ℤ) < -8) ∧ List.Perm [(-2 : ℤ), 5, -8, 0] [-8, -2, 0, 5] ∧
      List.Pairwise (· < ·) [(-8 : ℤ), -2, 0, 5] := by
  decide

/-- Preveri se 4: −15 < −9 in |−15| > |−9|. -/
theorem preveri4 : (-15 : ℤ) < -9 ∧ |(-15 : ℤ)| > |(-9 : ℤ)| := by norm_num

/-- Preveri se 5: stopnišče od −4 do 7 premaga |7 − (−4)| = |−4| + |7| = 4 + 7 = 11 (ne 7 − 4 = 3). -/
theorem preveri5 : |(7 : ℤ) - (-4)| = 11 ∧ (7 : ℤ) - 4 = 3 := by
  refine ⟨?_, by norm_num⟩
  calc |(7 : ℤ) - (-4)| = |(-4 : ℤ)| + |(7 : ℤ)| := razdalja_cez_nic (-4) 7 (by norm_num) (by norm_num)
    _ = 4 + 7 := by norm_num
    _ = 11 := by norm_num

end Evklid.Lekcije.MAT_OS_8.CelaStevila
