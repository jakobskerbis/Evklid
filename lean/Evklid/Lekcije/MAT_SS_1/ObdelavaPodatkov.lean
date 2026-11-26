/-
vir: content/lessons/MAT-SS-1/obdelava-podatkov.md
sha256: bf0fecb1b01f7c8ad3df9b6e03a614f9a3f8c31f20ccdb47bc189ba4fea2f1ae
Model: splošne trditve so za podatke x : Fin n → ℝ (`M x` je aritmetična sredina, `Var x` varianca z deljenjem z n);
računi iz lekcije so za sezname realnih števil: `sr l` = vsota/število, `var l` = povprečje kvadratov odklonov,
standardni odklon √(var l), `varVz l` deljenje z n − 1 (vzorčni odklon, ki ga lekcija omenja kot napačno izbiro).
»Urejeni podatki« so seznam s, ki je permutacija podatkov (`List.Perm`) in je urejen (`List.Pairwise (· ≤ ·)`), oboje
preverjeno z `decide` na naravnih številih. Mediana urejenega seznama `med` je srednji podatek pri lihem n in sredina
obeh srednjih pri sodem; Q₁ in Q₃ sta mediani spodnje (`take (n/2)`) in zgornje (`drop ((n+1)/2)`) polovice (pri lihem
n srednji podatek ni v nobeni, kot v lekciji). Modus: vsaka druga vrednost se pojavi redkeje (`List.count`).
»≈ a« na k decimalk je |vrednost − a| < ½·10⁻ᵏ.
Ni v Leanu: zgodbe (utrinki, krožek, strelca, ISS), simulacija »Obdelava podatkov: sredine in razpršenost« in risbe;
definicije pojmov (populacija, vzorec, enota, spremenljivka, frekvenca), vrste podatkov (opisni, vrstni, številski),
izbira povzetka glede na vrsto (tabela, Primer 5, kvizi 6 in 7) in prikazi podatkov (diagrami, histogram, škatla z
brki kot risba) kot opis in dogovor; »mediana je odpornejša na osamelce« splošno (opis; dokazano na primerih žepnine,
plač, Naloge 2 d) in Ustnega vprašanja 3); »metod za kvartile je več« in navodila za računalo (σₙ proti sₓ) kot opis;
»razredna sredina je le približek« (opis); sklepanje o populaciji iz pristranskega vzorca (kviz 7, opis); Postopek,
Pazi na, točkovanje.
Lean: x/0 = 0; splošne trditve imajo zato n ≠ 0.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.ObdelavaPodatkov

open Finset

/-! ## Splošne trditve (podatki x : Fin n → ℝ) -/

/-- Aritmetična sredina. -/
noncomputable def M {n : ℕ} (x : Fin n → ℝ) : ℝ := (∑ i, x i) / n

/-- Varianca (deljenje z n). -/
noncomputable def Var {n : ℕ} (x : Fin n → ℝ) : ℝ := (∑ i, (x i - M x) ^ 2) / n

/-- Primer 4 in Razlaga 3: vsota podatkov je n·x̄ (n ≠ 0). -/
theorem vsota_n_sredina {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) : ∑ i, x i = n * M x := by
  unfold M; field_simp

/-- Pomožno: ∑ (xᵢ − c)² = ∑ xᵢ² − 2c∑ xᵢ + nc². -/
theorem vsota_kv {n : ℕ} (x : Fin n → ℝ) (c : ℝ) :
    ∑ i, (x i - c) ^ 2 = ∑ i, x i ^ 2 - 2 * c * ∑ i, x i + n * c ^ 2 := by
  simp only [sub_sq, Finset.sum_add_distrib, Finset.sum_sub_distrib, Finset.sum_const, Finset.card_univ,
    Fintype.card_fin, nsmul_eq_mul]
  rw [show ∑ i, 2 * x i * c = 2 * c * ∑ i, x i by rw [Finset.mul_sum]; congr 1; ext i; ring]

/-- Premisli 3, Pogoste napake, Bolj natančno: vsota odklonov je vedno 0: ∑ (xᵢ − x̄) = ∑ xᵢ − n x̄ = 0. -/
theorem vsota_odklonov {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) : ∑ i, (x i - M x) = 0 := by
  rw [Finset.sum_sub_distrib, Finset.sum_const, Finset.card_univ, Fintype.card_fin, nsmul_eq_mul,
    vsota_n_sredina hn x]
  ring

/-- Bolj natančno (drugi zapis variance): σ² = (∑ xᵢ²)/n − x̄². -/
theorem varianca_drugi_zapis {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) : Var x = (∑ i, x i ^ 2) / n - M x ^ 2 := by
  unfold Var
  rw [vsota_kv, vsota_n_sredina hn x]
  have : (n : ℝ) ≠ 0 := Nat.cast_ne_zero.mpr hn
  field_simp
  ring

/-- Bolj natančno: aritmetična sredina je število c, pri katerem je ∑ (xᵢ − c)² najmanjša:
∑ (xᵢ − c)² = ∑ (xᵢ − x̄)² + n(x̄ − c)² ≥ ∑ (xᵢ − x̄)², z enakostjo le pri c = x̄. -/
theorem sredina_minimum {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) (c : ℝ) :
    ∑ i, (x i - c) ^ 2 = ∑ i, (x i - M x) ^ 2 + n * (M x - c) ^ 2 ∧
      ∑ i, (x i - M x) ^ 2 ≤ ∑ i, (x i - c) ^ 2 ∧
      (∑ i, (x i - c) ^ 2 = ∑ i, (x i - M x) ^ 2 ↔ c = M x) := by
  have e : ∑ i, (x i - c) ^ 2 = ∑ i, (x i - M x) ^ 2 + n * (M x - c) ^ 2 := by
    rw [vsota_kv, vsota_kv, vsota_n_sredina hn x]; ring
  have hn' : (0 : ℝ) < n := Nat.cast_pos.mpr (Nat.pos_of_ne_zero hn)
  refine ⟨e, by rw [e]; nlinarith [sq_nonneg (M x - c)], ?_⟩
  rw [e]
  constructor
  · intro h
    have : (n : ℝ) * (M x - c) ^ 2 = 0 := by linarith
    rcases mul_eq_zero.mp this with h0 | h0
    · linarith
    · have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h0; linarith
  · rintro rfl; simp

/-- Predpostavka splošnih trditev se da izpolniti (n = 5). -/
example : (5 : ℕ) ≠ 0 := by norm_num

/-- Bolj natančno, kviz 5 (linearna sprememba): pri yᵢ = a·xᵢ + b je ȳ = a·x̄ + b, σ_y² = a²σ_x² in σ_y = |a|σ_x;
premik (a = 1) razpršenosti ne spremeni. -/
theorem linearna {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) (a b : ℝ) :
    M (fun i => a * x i + b) = a * M x + b ∧ Var (fun i => a * x i + b) = a ^ 2 * Var x ∧
      √(Var (fun i => a * x i + b)) = |a| * √(Var x) := by
  have hm : M (fun i => a * x i + b) = a * M x + b := by
    unfold M
    rw [Finset.sum_add_distrib, ← Finset.mul_sum, Finset.sum_const, Finset.card_univ, Fintype.card_fin,
      nsmul_eq_mul]
    have : (n : ℝ) ≠ 0 := Nat.cast_ne_zero.mpr hn
    field_simp
  have hv : Var (fun i => a * x i + b) = a ^ 2 * Var x := by
    unfold Var
    rw [hm]
    simp only [show ∀ i, a * x i + b - (a * M x + b) = a * (x i - M x) from fun i => by ring, mul_pow,
      ← Finset.mul_sum]
    ring
  refine ⟨hm, hv, ?_⟩
  rw [hv, Real.sqrt_mul (sq_nonneg a), Real.sqrt_sq_eq_abs]

/-! ## Računi na seznamih -/

/-- Aritmetična sredina seznama. -/
noncomputable def sr (l : List ℝ) : ℝ := l.sum / l.length

/-- Varianca seznama (deljenje z n). -/
noncomputable def var (l : List ℝ) : ℝ := (l.map (fun x => (x - sr l) ^ 2)).sum / l.length

/-- Vzorčna varianca (deljenje z n − 1), ki je na maturi napačna izbira. -/
noncomputable def varVz (l : List ℝ) : ℝ := (l.map (fun x => (x - sr l) ^ 2)).sum / (l.length - 1)

/-- Mediana urejenega seznama: srednji podatek (lih n) ali sredina obeh srednjih (sod n). -/
noncomputable def med (s : List ℝ) : ℝ :=
  if s.length % 2 = 1 then s.getD (s.length / 2) 0 else (s.getD (s.length / 2 - 1) 0 + s.getD (s.length / 2) 0) / 2

/-- Prvi kvartil: mediana spodnje polovice (brez srednjega podatka pri lihem n). -/
noncomputable def Q1 (s : List ℝ) : ℝ := med (s.take (s.length / 2))

/-- Tretji kvartil: mediana zgornje polovice (brez srednjega podatka pri lihem n). -/
noncomputable def Q3 (s : List ℝ) : ℝ := med (s.drop ((s.length + 1) / 2))

/-- Pomožno: vsota seznama ne odvisna od vrstnega reda (urejanje ne spremeni sredine). -/
theorem sr_perm {l s : List ℕ} (h : l.Perm s) : sr (l.map (↑)) = sr (s.map (↑)) := by
  unfold sr
  rw [(h.map _).sum_eq, (h.map _).length_eq]

/-- Predpostavka trditve `sr_perm` se da izpolniti (Primer 1: podatki in urejeni podatki). -/
example : ([6, 9, 7, 10, 8, 9, 5, 12] : List ℕ).Perm [5, 6, 7, 8, 9, 9, 10, 12] := by decide

/-! ## Uvod in razlaga -/

/-- Uvod in Razlaga 4: oba kraja imata vsoto 100 in povprečje 20; razmah 22 − 18 = 4 in 38 − 2 = 36; odkloni prvega
kraja od 20 so 0, 2, −1, 1, −2 z vsoto 0. -/
theorem uvod : ([20, 22, 19, 21, 18] : List ℝ).sum = 100 ∧ ([2, 38, 35, 3, 22] : List ℝ).sum = 100 ∧
    sr [20, 22, 19, 21, 18] = 20 ∧ sr [2, 38, 35, 3, 22] = 20 ∧ (22 : ℝ) - 18 = 4 ∧ (38 : ℝ) - 2 = 36 ∧
    (∀ x ∈ ([20, 22, 19, 21, 18] : List ℕ), 18 ≤ x ∧ x ≤ 22) ∧ (∀ x ∈ ([2, 38, 35, 3, 22] : List ℕ), 2 ≤ x ∧ x ≤ 38) ∧
    ([20, 22, 19, 21, 18] : List ℝ).map (· - 20) = [0, 2, -1, 1, -2] ∧ ([0, 2, -1, 1, -2] : List ℝ).sum = 0 := by
  refine ⟨by norm_num, by norm_num, by norm_num [sr], by norm_num [sr], by norm_num, by norm_num, by decide, by decide,
    by norm_num, by norm_num⟩

/-- Razlaga 1 (preveri): relativna frekvenca 10/40 = 0,25 = 25 %. -/
theorem rel_frekvenca : (10 : ℝ) / 40 = 25 / 100 := by norm_num

/-- Razlaga 3 (žepnina) in premisli 1: devet po 10 € in en 200 €: povprečje (9·10 + 200)/10 = 29, mediana 10; pri
2000 € povprečje (9·10 + 2000)/10 = 209, mediana ostane 10. -/
theorem zepnina : sr [10, 10, 10, 10, 10, 10, 10, 10, 10, 200] = 29 ∧ med [10, 10, 10, 10, 10, 10, 10, 10, 10, 200] = 10 ∧
    sr [10, 10, 10, 10, 10, 10, 10, 10, 10, 2000] = 209 ∧ med [10, 10, 10, 10, 10, 10, 10, 10, 10, 2000] = 10 ∧
    ((9 : ℝ) * 10 + 200) / 10 = 29 ∧ ((9 : ℝ) * 10 + 2000) / 10 = 209 := by
  refine ⟨by norm_num [sr], by norm_num [med], by norm_num [sr], by norm_num [med], by norm_num, by norm_num⟩

/-- Razlaga 3: mediana ocen 1, 3, 3, 4, 5 je 3. -/
theorem ocene : med [1, 3, 3, 4, 5] = 3 := by norm_num [med]

/-- Razlaga 5 (preveri): pri Q₁ = 10, Q₃ = 14 je zgornja meja 14 + 1,5·4 = 20 < 21, zato je 21 osamelec. -/
theorem osamelec21 : (14 : ℝ) + 3 / 2 * (14 - 10) = 20 ∧ (20 : ℝ) < 21 := by norm_num

/-- Razlaga 6: krožni diagram 0,25·360° = 90°; razredna sredina razreda 10–20 je (10 + 20)/2 = 15. -/
theorem razlaga6 : (25 / 100 : ℝ) * 360 = 90 ∧ ((10 : ℝ) + 20) / 2 = 15 := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: vsota 66, x̄ = 66/8 = 8,25; urejeni podatki 5, 6, 7, 8, 9, 9, 10, 12, M = (8 + 9)/2 = 8,5; modus 9
(dvakrat, druge vrednosti enkrat); razmah 12 − 5 = 7. -/
theorem primer1 : ([6, 9, 7, 10, 8, 9, 5, 12] : List ℝ).sum = 66 ∧ sr [6, 9, 7, 10, 8, 9, 5, 12] = 66 / 8 ∧
    (66 / 8 : ℝ) = 825 / 100 ∧
    (([6, 9, 7, 10, 8, 9, 5, 12] : List ℕ).Perm [5, 6, 7, 8, 9, 9, 10, 12] ∧
      ([5, 6, 7, 8, 9, 9, 10, 12] : List ℕ).Pairwise (· ≤ ·)) ∧
    med [5, 6, 7, 8, 9, 9, 10, 12] = (8 + 9) / 2 ∧ ((8 : ℝ) + 9) / 2 = 85 / 10 ∧
    (List.count 9 [6, 9, 7, 10, 8, 9, 5, 12] = 2 ∧
      ∀ v ∈ ([6, 9, 7, 10, 8, 9, 5, 12] : List ℕ), v ≠ 9 → List.count v [6, 9, 7, 10, 8, 9, 5, 12] = 1) ∧
    (12 : ℝ) - 5 = 7 := by
  refine ⟨by norm_num, by norm_num [sr], by norm_num, by decide, by norm_num [med], by norm_num, by decide,
    by norm_num⟩

/-- Primer 2 in Na sliki: urejeni podatki 12, 13, 14, 14, 15, 15, 16, 16, 17, 18, 45; Q₂ = M = 15, Q₁ = 14, Q₃ = 17,
Q₃ − Q₁ = 3; meji 14 − 1,5·3 = 9,5 in 17 + 1,5·3 = 21,5; edini osamelec je 45; vsota 195, x̄ = 195/11 ≈ 17,7;
brez osamelca 150/10 = 15, mediana 15. -/
theorem primer2 :
    (([12, 15, 14, 18, 16, 13, 17, 15, 14, 16, 45] : List ℕ).Perm [12, 13, 14, 14, 15, 15, 16, 16, 17, 18, 45] ∧
      ([12, 13, 14, 14, 15, 15, 16, 16, 17, 18, 45] : List ℕ).Pairwise (· ≤ ·)) ∧
    med [12, 13, 14, 14, 15, 15, 16, 16, 17, 18, 45] = 15 ∧ Q1 [12, 13, 14, 14, 15, 15, 16, 16, 17, 18, 45] = 14 ∧
    Q3 [12, 13, 14, 14, 15, 15, 16, 16, 17, 18, 45] = 17 ∧ (17 : ℝ) - 14 = 3 ∧ (14 : ℝ) - 3 / 2 * 3 = 19 / 2 ∧
    (17 : ℝ) + 3 / 2 * 3 = 43 / 2 ∧ (43 / 2 : ℝ) < 45 ∧
    (∀ x ∈ ([12, 13, 14, 14, 15, 15, 16, 16, 17, 18] : List ℝ), 19 / 2 ≤ x ∧ x ≤ 43 / 2) ∧
    ([12, 15, 14, 18, 16, 13, 17, 15, 14, 16, 45] : List ℝ).sum = 195 ∧
    |sr [12, 15, 14, 18, 16, 13, 17, 15, 14, 16, 45] - 177 / 10| < 5 / 100 ∧
    sr [12, 15, 14, 18, 16, 13, 17, 15, 14, 16] = 150 / 10 ∧ (150 / 10 : ℝ) = 15 ∧
    med [12, 13, 14, 14, 15, 15, 16, 16, 17, 18] = 15 := by
  refine ⟨by decide, by norm_num [med], by norm_num [Q1, med], by norm_num [Q3, med], by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num, by norm_num, ?_, by norm_num [sr], by norm_num, by norm_num [med]⟩
  rw [abs_lt]; norm_num [sr]

/-- Primer 3 (frekvenčna tabela 0, 1, 2, 3, 4 s frekvencami 4, 8, 5, 2, 1): n = 20, ∑ fᵢxᵢ = 28, x̄ = 1,4 (tudi kot
sredina razpisanih 20 podatkov); M = 1 (10. in 11. podatek), modus 1; ∑ fᵢ(xᵢ − 1,4)² = 7,84 + 1,28 + 1,8 + 5,12 +
6,76 = 22,8, σ² = 22,8/20 = 1,14, σ = √1,14 ≈ 1,07. -/
theorem primer3 :
    (4 : ℝ) + 8 + 5 + 2 + 1 = 20 ∧ (4 : ℝ) * 0 + 8 * 1 + 5 * 2 + 2 * 3 + 1 * 4 = 28 ∧ (28 : ℝ) / 20 = 14 / 10 ∧
    sr [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 4] = 14 / 10 ∧
    med [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 4] = 1 ∧
    (0 - 14 / 10 : ℝ) ^ 2 = 196 / 100 ∧
    (4 : ℝ) * (0 - 14 / 10) ^ 2 = 784 / 100 ∧ (8 : ℝ) * (1 - 14 / 10) ^ 2 = 128 / 100 ∧
    (5 : ℝ) * (2 - 14 / 10) ^ 2 = 18 / 10 ∧ (2 : ℝ) * (3 - 14 / 10) ^ 2 = 512 / 100 ∧
    (1 : ℝ) * (4 - 14 / 10) ^ 2 = 676 / 100 ∧
    (784 / 100 : ℝ) + 128 / 100 + 18 / 10 + 512 / 100 + 676 / 100 = 228 / 10 ∧ (228 / 10 : ℝ) / 20 = 114 / 100 ∧
    var [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 4] = 114 / 100 ∧
    |√(114 / 100 : ℝ) - 107 / 100| < 5 / 1000 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num [sr], by norm_num [med], by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num [var, sr], ?_⟩
  have l : (1065 / 1000 : ℝ) < √(114 / 100) := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u : √(114 / 100 : ℝ) < 1075 / 1000 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  rw [abs_lt]; constructor <;> linarith

/-- Primer 3: razpisani podatki so urejeni, modus je 1 (vrednost 1 se pojavi 8-krat, vsaka druga redkeje). -/
theorem primer3_modus :
    ([0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 4] : List ℕ).Pairwise (· ≤ ·) ∧
    List.count 1 [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 4] = 8 ∧
    ∀ v ∈ ([0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 4] : List ℕ), v ≠ 1 →
      List.count v [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 4] < 8 := by
  decide

/-- Primer 3 (Pogoste napake): napačni imenovalec 28/5 = 5,6 namesto 28/20 = 1,4. -/
theorem primer3_napaka : (28 : ℝ) / 5 ≠ 28 / 20 := by norm_num

/-- Primer 4 (premisli): (14 + 18 + 11 + 20 + x₅)/5 = 16 ⇔ x₅ = 80 − 63 = 17; 5·16 = 80, 14 + 18 + 11 + 20 = 63. -/
theorem primer4 (x : ℝ) : sr [14, 18, 11, 20, x] = 16 ↔ x = 17 := by
  unfold sr
  simp
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Primer 4: 5·16 = 80, 14 + 18 + 11 + 20 = 63, 80 − 63 = 17, (63 + 17)/5 = 16. -/
theorem primer4_racun : (5 : ℝ) * 16 = 80 ∧ (14 : ℝ) + 18 + 11 + 20 = 63 ∧ (80 : ℝ) - 63 = 17 ∧
    ((63 : ℝ) + 17) / 5 = 16 := by norm_num

/-! ## Za maturo -/

/-- Naloga 1 in `RACUN`: urejeni 8, 9, 11, 12, 14, 15, 20; M = 12, Q₁ = 9, Q₃ = 15, Q₃ − Q₁ = 6; meji 9 − 1,5·6 = 0
in 15 + 1,5·6 = 24, osamelcev ni; pet števil 8, 9, 12, 15, 20. -/
theorem naloga1 :
    (([15, 8, 12, 20, 9, 14, 11] : List ℕ).Perm [8, 9, 11, 12, 14, 15, 20] ∧
      ([8, 9, 11, 12, 14, 15, 20] : List ℕ).Pairwise (· ≤ ·)) ∧
    med [8, 9, 11, 12, 14, 15, 20] = 12 ∧ Q1 [8, 9, 11, 12, 14, 15, 20] = 9 ∧ Q3 [8, 9, 11, 12, 14, 15, 20] = 15 ∧
    (15 : ℝ) - 9 = 6 ∧ (9 : ℝ) - 3 / 2 * 6 = 0 ∧ (15 : ℝ) + 3 / 2 * 6 = 24 ∧
    (∀ x ∈ ([8, 9, 11, 12, 14, 15, 20] : List ℝ), 0 ≤ x ∧ x ≤ 24) := by
  refine ⟨by decide, by norm_num [med], by norm_num [Q1, med], by norm_num [Q3, med], by norm_num, by norm_num,
    by norm_num, by norm_num⟩

/-- Pomožno: √5 in √(136/6) na štiri decimalke. -/
theorem meje : (22360 / 10000 : ℝ) < √5 ∧ √5 < 22361 / 10000 ∧ (47609 / 10000 : ℝ) < √(136 / 6) ∧
    √(136 / 6 : ℝ) < 47610 / 10000 := by
  refine ⟨?_, ?_, ?_, ?_⟩
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num

/-- Naloga 2 in `RACUN`: obe vsoti 240, x̄ = 40; mediani (40 + 40)/2 = 40 in (39 + 43)/2 = 41; vsoti kvadratov
odklonov 30 in 136; σ² = 5 in 136/6 ≈ 22,67; σ = √5 ≈ 2,24 in √(136/6) ≈ 4,76 (2,24 < 4,76/2, prva postaja bolj
enakomerna); z n − 1: √(30/5) ≈ 2,45, √(136/5) ≈ 5,22; d) (240 + 54)/7 = 42, M = 40. -/
theorem naloga2 :
    ([38, 41, 40, 44, 37, 40] : List ℝ).sum = 240 ∧ sr [38, 41, 40, 44, 37, 40] = 40 ∧
    ([35, 46, 39, 43, 33, 44] : List ℝ).sum = 240 ∧ sr [35, 46, 39, 43, 33, 44] = 40 ∧
    (([38, 41, 40, 44, 37, 40] : List ℕ).Perm [37, 38, 40, 40, 41, 44] ∧
      ([37, 38, 40, 40, 41, 44] : List ℕ).Pairwise (· ≤ ·)) ∧ med [37, 38, 40, 40, 41, 44] = (40 + 40) / 2 ∧
    (([35, 46, 39, 43, 33, 44] : List ℕ).Perm [33, 35, 39, 43, 44, 46] ∧
      ([33, 35, 39, 43, 44, 46] : List ℕ).Pairwise (· ≤ ·)) ∧ med [33, 35, 39, 43, 44, 46] = (39 + 43) / 2 ∧
    ((39 : ℝ) + 43) / 2 = 41 ∧
    ([38, 41, 40, 44, 37, 40] : List ℝ).map (· - 40) = [-2, 1, 0, 4, -3, 0] ∧
    (-2 : ℝ) ^ 2 + 1 ^ 2 + 0 ^ 2 + 4 ^ 2 + (-3) ^ 2 + 0 ^ 2 = 30 ∧
    ([35, 46, 39, 43, 33, 44] : List ℝ).map (· - 40) = [-5, 6, -1, 3, -7, 4] ∧
    (-5 : ℝ) ^ 2 + 6 ^ 2 + (-1) ^ 2 + 3 ^ 2 + (-7) ^ 2 + 4 ^ 2 = 136 ∧
    var [38, 41, 40, 44, 37, 40] = 5 ∧ var [35, 46, 39, 43, 33, 44] = 136 / 6 ∧
    |(136 / 6 : ℝ) - 2267 / 100| < 5 / 1000 ∧ |√(5 : ℝ) - 224 / 100| < 5 / 1000 ∧
    |√(136 / 6 : ℝ) - 476 / 100| < 5 / 1000 ∧ √(5 : ℝ) < √(136 / 6) / 2 ∧
    varVz [38, 41, 40, 44, 37, 40] = 30 / 5 ∧ varVz [35, 46, 39, 43, 33, 44] = 136 / 5 ∧
    |√(30 / 5 : ℝ) - 245 / 100| < 5 / 1000 ∧ |√(136 / 5 : ℝ) - 522 / 100| < 5 / 1000 ∧
    sr [38, 41, 40, 44, 37, 40, 54] = 42 ∧ ((240 : ℝ) + 54) / 7 = 42 ∧
    (([38, 41, 40, 44, 37, 40, 54] : List ℕ).Perm [37, 38, 40, 40, 41, 44, 54] ∧
      ([37, 38, 40, 40, 41, 44, 54] : List ℕ).Pairwise (· ≤ ·)) ∧ med [37, 38, 40, 40, 41, 44, 54] = 40 := by
  obtain ⟨l5, u5, l1, u1⟩ := meje
  have l6 : (2449 / 1000 : ℝ) < √(30 / 5) := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u6 : √(30 / 5 : ℝ) < 2450 / 1000 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  have l7 : (5215 / 1000 : ℝ) < √(136 / 5) := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u7 : √(136 / 5 : ℝ) < 5216 / 1000 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num, by norm_num [sr], by norm_num, by norm_num [sr], by decide, by norm_num [med], by decide,
    by norm_num [med], by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num [var, sr],
    by norm_num [var, sr], ?_, ?_, ?_, by linarith, by norm_num [varVz, sr], by norm_num [varVz, sr], ?_, ?_,
    by norm_num [sr], by norm_num, by decide, by norm_num [med]⟩
  all_goals rw [abs_lt]; constructor
  all_goals linarith

/-- Ustno vprašanje 3: pri 1, 2, 3, 4, 100 je mediana 3, aritmetična sredina 110/5 = 22. -/
theorem ustno3 : med [1, 2, 3, 4, 100] = 3 ∧ sr [1, 2, 3, 4, 100] = 22 := by
  refine ⟨by norm_num [med], by norm_num [sr]⟩

/-! ## Drugače -/

/-- Iz vsakdanjega življenja: strelca imata povprečje 50; σ₁ = √(8/5) ≈ 1,3, σ₂ = √200 ≈ 14,1; plače: povprečje
(9·1000 + 11000)/10 = 2000, mediana 1000 (tudi kviz 2). -/
theorem vsakdan : sr [48, 50, 50, 50, 52] = 50 ∧ sr [30, 40, 50, 60, 70] = 50 ∧ var [48, 50, 50, 50, 52] = 8 / 5 ∧
    var [30, 40, 50, 60, 70] = 200 ∧ |√(8 / 5 : ℝ) - 13 / 10| < 5 / 100 ∧ |√(200 : ℝ) - 141 / 10| < 5 / 100 ∧
    sr [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 11000] = 2000 ∧
    med [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 11000] = 1000 := by
  have l1 : (125 / 100 : ℝ) < √(8 / 5) := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u1 : √(8 / 5 : ℝ) < 135 / 100 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  have l2 : (1410 / 100 : ℝ) < √200 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u2 : √(200 : ℝ) < 1415 / 100 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num [sr], by norm_num [sr], by norm_num [var, sr], by norm_num [var, sr], ?_, ?_, by norm_num [sr],
    by norm_num [med]⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Korak za korakom: 3, 5, 6, 8, 8: x̄ = 30/5 = 6; odkloni −3, −1, 0, 2, 2 z vsoto 0; kvadrati 9, 1, 0, 4, 4 z vsoto
18; σ² = 18/5 = 3,6; σ = √3,6 ≈ 1,90. -/
theorem korak_za_korakom : ([3, 5, 6, 8, 8] : List ℝ).sum = 30 ∧ sr [3, 5, 6, 8, 8] = 6 ∧
    ([3, 5, 6, 8, 8] : List ℝ).map (· - 6) = [-3, -1, 0, 2, 2] ∧ ([-3, -1, 0, 2, 2] : List ℝ).sum = 0 ∧
    ([-3, -1, 0, 2, 2] : List ℝ).map (· ^ 2) = [9, 1, 0, 4, 4] ∧ ([9, 1, 0, 4, 4] : List ℝ).sum = 18 ∧
    var [3, 5, 6, 8, 8] = 36 / 10 ∧ |√(36 / 10 : ℝ) - 190 / 100| < 5 / 1000 := by
  have l : (1897 / 1000 : ℝ) < √(36 / 10) := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u : √(36 / 10 : ℝ) < 1898 / 1000 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num, by norm_num [sr], by norm_num, by norm_num, by norm_num, by norm_num, by norm_num [var, sr], ?_⟩
  rw [abs_lt]; constructor <;> linarith

/-- Bolj natančno (preizkus): 2, 4, 4, 4, 5, 5, 7, 9: x̄ = 5, povprečje kvadratov 232/8 = 29, σ² = 29 − 25 = 4, σ = 2. -/
theorem bolj_natancno : sr [2, 4, 4, 4, 5, 5, 7, 9] = 5 ∧ ([2, 4, 4, 4, 5, 5, 7, 9] : List ℝ).map (· ^ 2) =
    [4, 16, 16, 16, 25, 25, 49, 81] ∧ ([4, 16, 16, 16, 25, 25, 49, 81] : List ℝ).sum = 232 ∧ (232 : ℝ) / 8 = 29 ∧
    var [2, 4, 4, 4, 5, 5, 7, 9] = 29 - 25 ∧ √(var [2, 4, 4, 4, 5, 5, 7, 9]) = 2 := by
  have hv : var [2, 4, 4, 4, 5, 5, 7, 9] = 4 := by norm_num [var, sr]
  refine ⟨by norm_num [sr], by norm_num, by norm_num, by norm_num, by rw [hv]; norm_num, ?_⟩
  rw [hv, show (4 : ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-! ## Preveri se -/

/-- Preveri se 1: kot Lune je 0,15·360° = 54° (ne 15°). -/
theorem kviz1 : (15 / 100 : ℝ) * 360 = 54 ∧ (15 / 100 : ℝ) * 360 ≠ 15 := by norm_num

/-- Preveri se 3 in `RACUN`: ISS 5,8; 6,0; 6,1; 5,9; 6,2: x̄ = 6, σ² = 0,1/5 = 0,02, σ = √0,02 ≈ 0,14 (z n − 1:
√(0,1/4) ≈ 0,16; brez korena 0,02). -/
theorem kviz3 : sr [58 / 10, 6, 61 / 10, 59 / 10, 62 / 10] = 6 ∧ var [58 / 10, 6, 61 / 10, 59 / 10, 62 / 10] = 2 / 100 ∧
    ((-2 / 10 : ℝ) ^ 2 + 0 ^ 2 + (1 / 10) ^ 2 + (-1 / 10) ^ 2 + (2 / 10) ^ 2) = 1 / 10 ∧
    |√(2 / 100 : ℝ) - 14 / 100| < 5 / 1000 ∧ |√((1 / 10) / 4 : ℝ) - 16 / 100| < 5 / 1000 := by
  have l : (141 / 1000 : ℝ) < √(2 / 100) := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u : √(2 / 100 : ℝ) < 142 / 1000 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  have l' : (158 / 1000 : ℝ) < √((1 / 10) / 4) := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u' : √((1 / 10) / 4 : ℝ) < 159 / 1000 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num [sr], by norm_num [var, sr], by norm_num, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Preveri se 4 in `RACUN`: urejeni 3, 5, 6, 8, 9, 11, 15, M = 8; x̄ = 57/7 ≈ 8,14; (3 + 15)/2 = 9. -/
theorem kviz4 : (([8, 3, 11, 5, 15, 6, 9] : List ℕ).Perm [3, 5, 6, 8, 9, 11, 15] ∧
      ([3, 5, 6, 8, 9, 11, 15] : List ℕ).Pairwise (· ≤ ·)) ∧ med [3, 5, 6, 8, 9, 11, 15] = 8 ∧
    |sr [8, 3, 11, 5, 15, 6, 9] - 814 / 100| < 5 / 1000 ∧ ((3 : ℝ) + 15) / 2 = 9 := by
  refine ⟨by decide, by norm_num [med], ?_, by norm_num⟩
  rw [abs_lt]; norm_num [sr]

/-- Preveri se 5: prištevanje 5 točk poveča sredino za 5, standardni odklon ostane enak (`linearna` z a = 1). -/
theorem kviz5 {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) :
    M (fun i => 1 * x i + 5) = M x + 5 ∧ √(Var (fun i => 1 * x i + 5)) = √(Var x) := by
  obtain ⟨h1, -, h3⟩ := linearna hn x 1 5
  exact ⟨by rw [h1]; ring, by rw [h3]; simp⟩

end Evklid.Lekcije.MAT_SS_1.ObdelavaPodatkov
