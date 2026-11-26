/-
vir: content/lessons/MAT-OS-9/statisticna-raziskava.md
sha256: a13c9d03b715ca96c8e8e66fe5736bafe641c7c6cbc423bc781208633a1992b9
Model: podatki so seznami celih števil (`List ℤ`); računa se na njihovi preslikavi v ℝ (`R l`). `sr l` je
vsota/število, `med s` je mediana seznama s, ki je urejen (srednji podatek pri lihem n, sredina obeh srednjih pri
sodem). »Urejeni podatki« so seznam s, ki je permutacija podatkov (`List.Perm`) in je urejen
(`List.Pairwise (· ≤ ·)`), oboje z `decide`. Modus: podatek, ki se pojavi največkrat (`List.count`), vsaka druga
vrednost redkeje (ali: vsi enako pogosti). Frekvenčna tabela je seznam parov (podatek, f), razpisana v seznam
podatkov (`razpisi`). Kot izseka je f/n · 360. »≈ a« na eno decimalko je |x − a| < 1/20. Neštevilski podatki
(vreme, smer vetra) so naštevni tipi.
Ni v Leanu: koraki raziskave, vrste zbiranja podatkov, izbira prikaza (stolpčni, krožni, črtni diagram) in izbira
srednje vrednosti (Razlaga 5) kot navodila; »modus je edina srednja vrednost za neštevilske, neurejene podatke« in
kviz 5 o povprečju/mediani smeri (pomen, ne trditev; dokazan je le modus); »en izstopajoč podatek močno premakne
povprečje, mediane skoraj ne« splošno (opis; dokazano na tednih iz Razlage 3, Primeru 1 in kvizu 4); simulacija
»Srednje vrednosti podatkov« (pik ni v besedilu); zgodba o Tini (podatki niso dani, le »okoli 19«); kviz 1
(definicija mediane); kviz 3 in Pogoste napake kot razlaga (dokazani so računi).
Lean: x/0 = 0; splošne trditve o sredini imajo zato neprazen seznam.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_9.StatisticnaRaziskava

/-- Podatki kot realna števila. -/
noncomputable def R (l : List ℤ) : List ℝ := l.map (↑)

/-- Aritmetična sredina (povprečje) seznama. -/
noncomputable def sr (l : List ℝ) : ℝ := l.sum / l.length

/-- Mediana urejenega seznama: srednji podatek (lih n) ali sredina obeh srednjih (sod n). -/
noncomputable def med (s : List ℝ) : ℝ :=
  if s.length % 2 = 1 then s.getD (s.length / 2) 0 else (s.getD (s.length / 2 - 1) 0 + s.getD (s.length / 2) 0) / 2

/-- Frekvenčna tabela (pari podatek, frekvenca), razpisana v seznam podatkov. -/
def razpisi (t : List (ℤ × ℕ)) : List ℤ := t.flatMap fun p => List.replicate p.2 p.1

/-! ## Splošne trditve -/

/-- Urejanje ne spremeni povprečja: za permutacijo s podatkov l je sr s = sr l. -/
theorem sr_perm {l s : List ℤ} (h : l.Perm s) : sr (R l) = sr (R s) := by
  unfold sr R
  rw [(h.map _).sum_eq, (h.map _).length_eq]

/-- Predpostavka `sr_perm` se da izpolniti (Primer 1). -/
example : ([0, 4, 0, 12, 3, 0, 9] : List ℤ).Perm [0, 0, 0, 3, 4, 9, 12] := by decide

/-- Razlaga 3, Primer 3 (formula): iz x̄ = vsota/n sledi vsota = x̄ · n (n ≠ 0). -/
theorem vsota_iz_sredine (l : List ℝ) (hl : l.length ≠ 0) : l.sum = sr l * l.length := by
  unfold sr
  have : (l.length : ℝ) ≠ 0 := Nat.cast_ne_zero.mpr hl
  field_simp

/-- Predpostavka `vsota_iz_sredine` se da izpolniti. -/
example : ([14] : List ℝ).length ≠ 0 := by decide

/-- Primer 2 (formula za frekvenčno tabelo): vsota razpisanih podatkov je vsota (podatek · f), število podatkov
je vsota frekvenc. -/
theorem tabela_vsota (t : List (ℤ × ℕ)) :
    (razpisi t).sum = (t.map fun p => (p.2 : ℤ) * p.1).sum ∧ (razpisi t).length = (t.map Prod.snd).sum := by
  induction t with
  | nil => simp [razpisi]
  | cons p t ih =>
    obtain ⟨ih1, ih2⟩ := ih
    simp only [razpisi, List.flatMap_cons, List.sum_append, List.length_append, List.map_cons,
      List.sum_cons, List.sum_replicate, List.length_replicate, nsmul_eq_mul] at ih1 ih2 ⊢
    exact ⟨by rw [ih1], by rw [ih2]⟩

/-- Korak za korakom, 7. korak (preveri): povprečje leži med najmanjšim in največjim podatkom — če so vsi
podatki nepraznega seznama med a in b, je a ≤ x̄ ≤ b. -/
theorem sr_med_mejama (l : List ℝ) (hl : l ≠ []) (a b : ℝ) (h : ∀ x ∈ l, a ≤ x ∧ x ≤ b) :
    a ≤ sr l ∧ sr l ≤ b := by
  unfold sr
  have hn : (0 : ℝ) < l.length := by exact_mod_cast List.length_pos_of_ne_nil hl
  have h1 : l.length • a ≤ l.sum := List.length_nsmul_le_sum l a fun x hx => (h x hx).1
  have h2 : l.sum ≤ l.length • b := List.sum_le_length_nsmul l b fun x hx => (h x hx).2
  rw [nsmul_eq_mul] at h1 h2
  constructor
  · rw [le_div_iff₀ hn]; linarith
  · rw [div_le_iff₀ hn]; linarith

/-- Predpostavke `sr_med_mejama` se dajo izpolniti (sončne ure 2, 4, 5, 7, 9 med 2 in 9). -/
example : ([2, 4, 5, 7, 9] : List ℝ) ≠ [] ∧ ∀ x ∈ ([2, 4, 5, 7, 9] : List ℝ), 2 ≤ x ∧ x ≤ 9 := by
  refine ⟨by simp, ?_⟩
  intro x hx
  simp only [List.mem_cons, List.not_mem_nil, or_false] at hx
  rcases hx with rfl | rfl | rfl | rfl | rfl <;> norm_num

/-- Razlaga 4, Premisli 2 (dež): pet suhih dni (0 mm) in dva deževna (0 < a ≤ b): urejeni podatki
0, 0, 0, 0, 0, a, b imajo mediano 0, povprečje pa je večje od 0, torej večje od mediane. -/
theorem suhi_dnevi (a b : ℝ) (ha : 0 < a) (hab : a ≤ b) :
    [0, 0, 0, 0, 0, a, b].Pairwise (· ≤ ·) ∧ med [0, 0, 0, 0, 0, a, b] = 0 ∧
    med [0, 0, 0, 0, 0, a, b] < sr [0, 0, 0, 0, 0, a, b] := by
  have hm : med [0, 0, 0, 0, 0, a, b] = 0 := by norm_num [med]
  refine ⟨?_, hm, ?_⟩
  · have h1 := ha.le
    have h2 := ha.le.trans hab
    simp [h1, h2, hab]
  · rw [hm]
    unfold sr
    norm_num
    linarith

/-- Predpostavke `suhi_dnevi` se dajo izpolniti (a = 9, b = 12). -/
example : (0 : ℝ) < 9 ∧ (9 : ℝ) ≤ 12 := by norm_num

/-- Primer 3 (manjkajoči dan), splošno: če je povprečje šestih dni 14, je povprečje sedmih dni (sedmi dan t)
enako 15 natanko pri t = 21 (vsota 6 dni 14 · 6 = 84, vsota 7 dni 15 · 7 = 105, 105 − 84 = 21). -/
theorem primer3 (l : List ℝ) (t : ℝ) (hn : l.length = 6) (h6 : sr l = 14) : sr (l ++ [t]) = 15 ↔ t = 21 := by
  have hs : l.sum = 84 := by
    rw [vsota_iz_sredine l (by omega), h6, hn]; norm_num
  unfold sr
  rw [List.sum_append, List.length_append, hs, hn]
  norm_num
  constructor <;> intro h <;> linarith

/-- Predpostavke `primer3` se dajo izpolniti (šest dni po 14 °C). -/
example : ([14, 14, 14, 14, 14, 14] : List ℝ).length = 6 ∧ sr [14, 14, 14, 14, 14, 14] = 14 := by
  norm_num [sr]

/-- Primer 3, koraki: 14 · 6 = 84, 15 · 7 = 105, 105 − 84 = 21 > 14. -/
theorem primer3_koraki : (14 : ℝ) * 6 = 84 ∧ (15 : ℝ) * 7 = 105 ∧ (105 : ℝ) - 84 = 21 ∧ (14 : ℝ) < 21 := by
  norm_num

/-! ## Uganka in Razlaga -/

/-- Zakaj se tega učimo (uganka): 22, 23, 24, 25, 6 imajo povprečje 20, štirje od petih dni so toplejši od 20. -/
theorem uganka : sr (R [22, 23, 24, 25, 6]) = 20 ∧
    ([22, 23, 24, 25, 6] : List ℤ).countP (fun x => decide (20 < x)) = 4 := by
  refine ⟨by norm_num [sr, R], by decide⟩

/-- Razlaga 2 (vreme 10 dni): 5 + 3 + 2 = 10; relativne frekvence 50 %, 30 %, 20 %; koti 180°, 108°, 72°
(skupaj 360°). -/
theorem vreme_tabela : (5 : ℝ) + 3 + 2 = 10 ∧ (5 : ℝ) / 10 = 50 / 100 ∧ (3 : ℝ) / 10 = 30 / 100 ∧
    (2 : ℝ) / 10 = 20 / 100 ∧ (5 : ℝ) / 10 * 360 = 180 ∧ (3 : ℝ) / 10 * 360 = 108 ∧ (2 : ℝ) / 10 * 360 = 72 ∧
    (180 : ℝ) + 108 + 72 = 360 := by
  norm_num

/-- Vreme (neštevilski podatek). -/
inductive Vreme
  | soncno
  | oblacno
  | dezevno
  deriving DecidableEq

/-- Razlaga 4: modus vremena iz tabele je »sončno« (5-krat, drugo redkeje). -/
theorem vreme_modus :
    let l := List.replicate 5 Vreme.soncno ++ List.replicate 3 Vreme.oblacno ++ List.replicate 2 Vreme.dezevno
    l.count Vreme.soncno = 5 ∧ ∀ v ∈ l, v ≠ Vreme.soncno → l.count v < 5 := by
  decide

/-- Razlaga 3: maj (18, 20, 21, 19, 22) in teden iz uganke (22, 23, 24, 25, 6) imata vsoto 100 in povprečje
20; urejena sta 18, 19, 20, 21, 22 in 6, 22, 23, 24, 25, mediani sta 20 in 23. -/
theorem dva_tedna :
    (R [18, 20, 21, 19, 22]).sum = 100 ∧ (R [22, 23, 24, 25, 6]).sum = 100 ∧
    sr (R [18, 20, 21, 19, 22]) = 20 ∧ sr (R [22, 23, 24, 25, 6]) = 20 ∧
    ([18, 20, 21, 19, 22] : List ℤ).Perm [18, 19, 20, 21, 22] ∧ ([18, 19, 20, 21, 22] : List ℤ).Pairwise (· ≤ ·) ∧
    ([22, 23, 24, 25, 6] : List ℤ).Perm [6, 22, 23, 24, 25] ∧ ([6, 22, 23, 24, 25] : List ℤ).Pairwise (· ≤ ·) ∧
    med (R [18, 19, 20, 21, 22]) = 20 ∧ med (R [6, 22, 23, 24, 25]) = 23 := by
  refine ⟨by norm_num [R], by norm_num [R], by norm_num [sr, R], by norm_num [sr, R], by decide, by decide,
    by decide, by decide, by norm_num [med, R], by norm_num [med, R]⟩

/-- Razlaga 3, Premisli 1: s šestim dnem 26 so urejeni podatki 6, 22, 23, 24, 25, 26 in mediana je
(23 + 24)/2 = 23,5. -/
theorem sesti_dan : ([22, 23, 24, 25, 6, 26] : List ℤ).Perm [6, 22, 23, 24, 25, 26] ∧
    ([6, 22, 23, 24, 25, 26] : List ℤ).Pairwise (· ≤ ·) ∧ med (R [6, 22, 23, 24, 25, 26]) = (23 + 24) / 2 ∧
    ((23 : ℝ) + 24) / 2 = 235 / 10 := by
  refine ⟨by decide, by decide, by norm_num [med, R], by norm_num⟩

/-- Razlaga 4: podatki imajo lahko več modusov (npr. 1, 1, 2, 2, 3: 1 in 2 sta oba najpogostejša). -/
theorem vec_modusov : ([1, 1, 2, 2, 3] : List ℤ).count 1 = 2 ∧ ([1, 1, 2, 2, 3] : List ℤ).count 2 = 2 ∧
    ∀ v ∈ ([1, 1, 2, 2, 3] : List ℤ), ([1, 1, 2, 2, 3] : List ℤ).count v ≤ 2 := by
  decide

/-! ## Rešeni primeri -/

/-- Primer 1 (dež): vsota 0 + 4 + 0 + 12 + 3 + 0 + 9 = 28, povprečje 28/7 = 4; urejeni 0, 0, 0, 3, 4, 9, 12,
mediana (četrti) 3; modus 0 (trikrat, drugi po enkrat). -/
theorem primer1 :
    (R [0, 4, 0, 12, 3, 0, 9]).sum = 28 ∧ sr (R [0, 4, 0, 12, 3, 0, 9]) = 28 / 7 ∧ (28 : ℝ) / 7 = 4 ∧
    ([0, 4, 0, 12, 3, 0, 9] : List ℤ).Perm [0, 0, 0, 3, 4, 9, 12] ∧
    ([0, 0, 0, 3, 4, 9, 12] : List ℤ).Pairwise (· ≤ ·) ∧ med (R [0, 0, 0, 3, 4, 9, 12]) = 3 ∧
    ([0, 4, 0, 12, 3, 0, 9] : List ℤ).count 0 = 3 ∧
    ∀ v ∈ ([0, 4, 0, 12, 3, 0, 9] : List ℤ), v ≠ 0 → ([0, 4, 0, 12, 3, 0, 9] : List ℤ).count v = 1 := by
  refine ⟨by norm_num [R], by norm_num [sr, R], by norm_num, by decide, by decide, by norm_num [med, R],
    by decide, by decide⟩

/-- Pogoste napake (pozabljene ničle): deljenje vsote 28 s štirimi deževnimi dnevi da 7, ne 4. -/
theorem napaka_nicle : (28 : ℝ) / 4 = 7 ∧ (28 : ℝ) / 4 ≠ 28 / 7 := by norm_num

/-- Primer 2: tabela gnezd (2 jajci 2-krat, 3 5-krat, 4 8-krat, 5 5-krat). -/
def gnezda : List (ℤ × ℕ) := [(2, 2), (3, 5), (4, 8), (5, 5)]

/-- Primer 2 (jajca): 20 gnezd; 2 · 2 + 3 · 5 + 4 · 8 + 5 · 5 = 76; povprečje 76/20 = 3,8; razpisani podatki so
urejeni, 2 + 5 = 7, 7 + 8 = 15, 10. in 11. podatek sta 4, mediana 4; modus 4 (8-krat, drugi redkeje; 8 ni
podatek); delež 8/20 = 0,4, kot 0,4 · 360 = 144°. -/
theorem primer2 :
    (razpisi gnezda).length = 20 ∧ (2 : ℤ) * 2 + 3 * 5 + 4 * 8 + 5 * 5 = 76 ∧ (razpisi gnezda).sum = 76 ∧
    sr (R (razpisi gnezda)) = 76 / 20 ∧ (76 : ℝ) / 20 = 38 / 10 ∧
    (razpisi gnezda).Pairwise (· ≤ ·) ∧ 2 + 5 = 7 ∧ 7 + 8 = 15 ∧
    (razpisi gnezda).getD 9 0 = 4 ∧ (razpisi gnezda).getD 10 0 = 4 ∧ med (R (razpisi gnezda)) = 4 ∧
    (razpisi gnezda).count 4 = 8 ∧ (∀ v ∈ razpisi gnezda, v ≠ 4 → (razpisi gnezda).count v < 8) ∧
    (8 : ℤ) ∉ razpisi gnezda ∧ (8 : ℝ) / 20 = 4 / 10 ∧ (4 : ℝ) / 10 * 360 = 144 := by
  refine ⟨by decide, by norm_num, by decide, ?_, by norm_num, by decide, rfl, rfl, by decide, by decide, ?_,
    by decide, by decide, by decide, by norm_num, by norm_num⟩
  · norm_num [sr, R, razpisi, gnezda]
  · norm_num [med, R, razpisi, gnezda]

/-- Pogoste napake (povprečje brez frekvenc): (2 + 3 + 4 + 5)/4 = 3,5 ≠ 3,8. -/
theorem napaka_brez_frekvenc : ((2 : ℝ) + 3 + 4 + 5) / 4 = 35 / 10 ∧ (35 / 10 : ℝ) ≠ 38 / 10 := by norm_num

/-- Primer 4 (zimski teden): urejeni podatki −4, −3, −1, 0, 1, 2; tretji in četrti sta −1 in 0; vsota
−3 + 1 − 1 + 2 − 4 + 0 = −5; mediana (−1 + 0)/2 = −0,5; povprečje −5/6 ≈ −0,8. -/
theorem primer4 :
    ([-3, 1, -1, 2, -4, 0] : List ℤ).Perm [-4, -3, -1, 0, 1, 2] ∧ ([-4, -3, -1, 0, 1, 2] : List ℤ).Pairwise (· ≤ ·) ∧
    ([-4, -3, -1, 0, 1, 2] : List ℤ).getD 2 0 = -1 ∧ ([-4, -3, -1, 0, 1, 2] : List ℤ).getD 3 0 = 0 ∧
    (R [-3, 1, -1, 2, -4, 0]).sum = -5 ∧ med (R [-4, -3, -1, 0, 1, 2]) = (-1 + 0) / 2 ∧
    ((-1 : ℝ) + 0) / 2 = -5 / 10 ∧ sr (R [-3, 1, -1, 2, -4, 0]) = -5 / 6 ∧ |(-5 : ℝ) / 6 - (-8 / 10)| < 1 / 20 := by
  refine ⟨by decide, by decide, by decide, by decide, by norm_num [R], by norm_num [med, R], by norm_num,
    by norm_num [sr, R], by norm_num [abs_lt]⟩

/-! ## Pogoste napake, Korak za korakom, Preveri se -/

/-- Pogoste napake, Korak za korakom, Preveri se 3 (sončne ure 7, 2, 9, 4, 5): srednji podatek zapisa je 9, po
urejanju 2, 4, 5, 7, 9 pa je mediana 5; n = 5, vsota 27, povprečje 27/5 = 5,4 (med 2 in 9); modusa ni (vsak
podatek enkrat). -/
theorem soncne_ure :
    (R [7, 2, 9, 4, 5]).getD 2 0 = 9 ∧ ([7, 2, 9, 4, 5] : List ℤ).Perm [2, 4, 5, 7, 9] ∧
    ([2, 4, 5, 7, 9] : List ℤ).Pairwise (· ≤ ·) ∧ med (R [2, 4, 5, 7, 9]) = 5 ∧
    ([7, 2, 9, 4, 5] : List ℤ).length = 5 ∧ (R [2, 4, 5, 7, 9]).sum = 27 ∧ sr (R [2, 4, 5, 7, 9]) = 27 / 5 ∧
    (27 : ℝ) / 5 = 54 / 10 ∧ (2 : ℝ) ≤ 54 / 10 ∧ (54 / 10 : ℝ) ≤ 9 ∧
    ∀ v ∈ ([7, 2, 9, 4, 5] : List ℤ), ([7, 2, 9, 4, 5] : List ℤ).count v = 1 := by
  refine ⟨by norm_num [R], by decide, by decide, by norm_num [med, R], rfl, by norm_num [R], by norm_num [sr, R],
    by norm_num, by norm_num, by norm_num, by decide⟩

/-- Korak za korakom: s šestim dnem 0 ur je vsota še 27, povprečje 27/6 = 4,5, urejeni 0, 2, 4, 5, 7, 9 in
mediana (4 + 5)/2 = 4,5. -/
theorem soncne_ure_sesti :
    (R [7, 2, 9, 4, 5, 0]).sum = 27 ∧ sr (R [7, 2, 9, 4, 5, 0]) = 45 / 10 ∧
    ([7, 2, 9, 4, 5, 0] : List ℤ).Perm [0, 2, 4, 5, 7, 9] ∧ ([0, 2, 4, 5, 7, 9] : List ℤ).Pairwise (· ≤ ·) ∧
    med (R [0, 2, 4, 5, 7, 9]) = 45 / 10 := by
  refine ⟨by norm_num [R], by norm_num [sr, R], by decide, by decide, by norm_num [med, R]⟩

/-- Preveri se 2 (sneg 12, 15, 0, 9, 14): vsota 50, povprečje 50/5 = 10; napačni odgovori: 50/4 = 12,5
(brez ničle), mediana 12 (urejeni 0, 9, 12, 14, 15), vsota 50. -/
theorem kviz2 : (R [12, 15, 0, 9, 14]).sum = 50 ∧ sr (R [12, 15, 0, 9, 14]) = 10 ∧ (50 : ℝ) / 4 = 125 / 10 ∧
    ([12, 15, 0, 9, 14] : List ℤ).Perm [0, 9, 12, 14, 15] ∧ ([0, 9, 12, 14, 15] : List ℤ).Pairwise (· ≤ ·) ∧
    med (R [0, 9, 12, 14, 15]) = 12 := by
  refine ⟨by norm_num [R], by norm_num [sr, R], by norm_num, by decide, by decide, by norm_num [med, R]⟩

/-- Preveri se 4 (veter): A 10, 12, 11, 13, 54 in B 20, 21, 19, 20, 20 imata povprečje 20; mediana A je 12,
mediana B 20; vsi dnevi na A razen dneva s 54 (torej štirje dnevi) so mirnejši od vseh dni na B (najmanj 19). -/
theorem kviz4 : sr (R [10, 12, 11, 13, 54]) = 20 ∧ sr (R [20, 21, 19, 20, 20]) = 20 ∧
    ([10, 12, 11, 13, 54] : List ℤ).Perm [10, 11, 12, 13, 54] ∧ ([10, 11, 12, 13, 54] : List ℤ).Pairwise (· ≤ ·) ∧
    med (R [10, 11, 12, 13, 54]) = 12 ∧
    ([20, 21, 19, 20, 20] : List ℤ).Perm [19, 20, 20, 20, 21] ∧ ([19, 20, 20, 20, 21] : List ℤ).Pairwise (· ≤ ·) ∧
    med (R [19, 20, 20, 20, 21]) = 20 ∧
    ∀ a ∈ ([10, 12, 11, 13, 54] : List ℤ), a ≠ 54 → ∀ b ∈ ([20, 21, 19, 20, 20] : List ℤ), a < b := by
  refine ⟨by norm_num [sr, R], by norm_num [sr, R], by decide, by decide, by norm_num [med, R], by decide,
    by decide, by norm_num [med, R], by decide⟩

/-- Smer vetra (neštevilski podatek). -/
inductive Smer
  | sever
  | jug
  | vzhod
  | zahod
  deriving DecidableEq

/-- Preveri se 5 (smer vetra 30 dni): sever 4, jug 7, vzhod 3, zahod 16; modus je zahod (16-krat, drugi
redkeje). -/
theorem kviz5 :
    let l := List.replicate 4 Smer.sever ++ List.replicate 7 Smer.jug ++ List.replicate 3 Smer.vzhod ++
      List.replicate 16 Smer.zahod
    l.length = 30 ∧ l.count Smer.zahod = 16 ∧ ∀ v ∈ l, v ≠ Smer.zahod → l.count v < 16 := by
  decide

end Evklid.Lekcije.MAT_OS_9.StatisticnaRaziskava
