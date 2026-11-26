/-
vir: content/lessons/MAT-OS-7/aritmeticna-sredina.md
sha256: 24ba9281321626cd5f9401ef92a7010df0add0754707050ea20c6948dfb1d8a2
Model: splošne trditve so za podatke x : Fin n → ℝ (`M x` = vsota/n); računi iz lekcije so za sezname realnih
števil (`sr l` = vsota/dolžina), povezava `M_je_sr`. Dodan podatek je `Fin.snoc x a`, zamenjan podatek
`Function.update x i b`, frekvenčna tabela je seznam s ponovitvami (`List.replicate`). Enote (°C, cm, €, g) so
izpuščene, računa se s števili.
Lean: x/0 = 0; splošne trditve imajo zato pogoj n ≠ 0 (podatkov je vsaj eden, kot v lekciji).
Ni v Leanu: zgodbe (bonboni, žepnina, košarka, pica, poraba goriva, primerjava dveh razredov) kot besedilo;
risbe (številska premica s palico in utežmi, stolpčni prikaz s plastelinom) in simulacija »Aritmetična sredina
kot ravnovesje« (ravnovesje je dokazano kot vsota odmikov 0 ter enaki vsoti razdalj levo in desno na primerih);
»sredina pove, koliko bi dobil vsak pri enaki delitvi« in »sredina ni izmerjen podatek« (opis; dokazano, da n
enakih deležev x̄ da isto vsoto); »zelo velik ali zelo majhen podatek jo močno premakne« je dokazano kot natančen
premik d/n pri spremembi enega podatka za d in na primeru žepnine, »močno« je opis; navodila (»pri sredini vedno
pogledaj tudi podatke«, »način B je hiter za računanje na pamet«); oznaka x̄ in branje »x s črtico«.
Napačni odgovori kvizov: dokazano je, da napačne vrednosti niso pravilne.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.AritmeticnaSredina

open Finset

/-- Aritmetična sredina podatkov x₁, …, xₙ: x̄ = (x₁ + … + xₙ)/n. -/
noncomputable def M {n : ℕ} (x : Fin n → ℝ) : ℝ := (∑ i, x i) / n

/-- Aritmetična sredina seznama: vsota, deljena s številom podatkov. -/
noncomputable def sr (l : List ℝ) : ℝ := l.sum / l.length

/-- Obe definiciji se ujemata: sredina podatkov x je sredina seznama x₁, …, xₙ. -/
theorem M_je_sr {n : ℕ} (x : Fin n → ℝ) : M x = sr (List.ofFn x) := by
  simp [M, sr, List.sum_ofFn]

/-! ## Razlaga 1: izravnava -/

/-- Zakaj se tega učimo in Razlaga 1: 3 + 7 + 4 + 8 + 3 = 25, 25 : 5 = 5; vsak bi imel 5 bonbonov. -/
theorem bonboni : sr [3, 7, 4, 8, 3] = 5 := by
  calc sr [3, 7, 4, 8, 3] = (3 + 7 + 4 + 8 + 3) / 5 := by norm_num [sr]
    _ = 25 / 5 := by norm_num
    _ = 5 := by norm_num

/-- Razlaga 1 in Povzetek (»koliko bi dobil vsak«): če vsak od n dobi x̄, je vsota deležev n·x̄ enaka vsoti
podatkov (n ≠ 0). -/
theorem enaka_delitev {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) : ∑ _i : Fin n, M x = ∑ i, x i := by
  have hn' : (n : ℝ) ≠ 0 := Nat.cast_ne_zero.mpr hn
  simp only [sum_const, card_univ, Fintype.card_fin, nsmul_eq_mul, M]
  field_simp

/-- Predpostavka n ≠ 0 splošnih trditev se da izpolniti (n = 5). -/
example : (5 : ℕ) ≠ 0 := by norm_num

/-! ## Razlaga 2: odmiki -/

/-- Razlaga 2 (tabela): odmiki od 5 so −2, +2, −1, +3, −2; Bor in Dana imata skupaj 5 preveč, Ana, Cene in Eva
5 premalo, vsota odmikov je 0. -/
theorem odmiki_bonbonov :
    (3 : ℝ) - 5 = -2 ∧ (7 : ℝ) - 5 = 2 ∧ (4 : ℝ) - 5 = -1 ∧ (8 : ℝ) - 5 = 3 ∧ (3 : ℝ) - 5 = -2 ∧
      (2 : ℝ) + 3 = 5 ∧ (2 : ℝ) + 1 + 2 = 5 ∧ (-2 : ℝ) + 2 + (-1) + 3 + (-2) = 0 := by
  norm_num

/-- Bolj natančno (pomožno): vsota odmikov od poljubnega števila c je n·(x̄ − c) (n ≠ 0). -/
theorem vsota_odmikov_od {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) (c : ℝ) :
    ∑ i, (x i - c) = n * (M x - c) := by
  have hn' : (n : ℝ) ≠ 0 := Nat.cast_ne_zero.mpr hn
  rw [sum_sub_distrib, sum_const, card_univ, Fintype.card_fin, nsmul_eq_mul, M, mul_sub,
    mul_div_cancel₀ _ hn']

/-- Razlaga 2, Povzetek in Bolj natančno: vsota odmikov od sredine je vedno 0:
(x₁ − x̄) + … + (xₙ − x̄) = vsota podatkov − n·x̄ = 0 (n ≠ 0). -/
theorem vsota_odmikov {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) : ∑ i, (x i - M x) = 0 := by
  rw [vsota_odmikov_od hn, sub_self, mul_zero]

/-- Razlaga 2 (premisli): Eva dobi še 5 bonbonov: vsota je 30, podatkov je 5, 30 : 5 = 6; vsak dobi 1 več
(5 : 5 = 1). -/
theorem eva_dobi_pet : sr [3, 7, 4, 8, 3 + 5] = 6 ∧ (5 : ℝ) / 5 = 1 := by
  refine ⟨?_, by norm_num⟩
  calc sr [3, 7, 4, 8, 3 + 5] = 30 / 5 := by norm_num [sr]
    _ = 6 := by norm_num

/-! ## Razlaga 3: na številski premici -/

/-- Razlaga 3: pri podatkih 3, 3, 4, 7, 8 so uteži levo od 5 skupaj oddaljene 2 + 1 + 2 = 5, desno 2 + 3 = 5. -/
theorem ravnovesje_bonbonov :
    sr [3, 3, 4, 7, 8] = 5 ∧ ((5 : ℝ) - 3) + (5 - 4) + (5 - 3) = 5 ∧ ((7 : ℝ) - 5) + (8 - 5) = 5 := by
  norm_num [sr]

/-- Razlaga 3 (simulacija): pri podatkih 2, 4, 9 je točka ravnovesja 5, čeprav noben podatek ni 5; razdalji
majhnih podatkov do 5 (3 in 1) sta manjši od razdalje velikega (4), razdalje levo in desno sta enaki (3 + 1 = 4). -/
theorem ravnovesje_2_4_9 :
    sr [2, 4, 9] = 5 ∧ (5 : ℝ) ∉ [2, 4, 9] ∧ (5 : ℝ) - 2 < 9 - 5 ∧ (5 : ℝ) - 4 < 9 - 5 ∧
      ((5 : ℝ) - 2) + (5 - 4) = 9 - 5 := by
  norm_num [sr]

/-! ## Razlaga 4: zapis s simboli -/

/-- Razlaga 4 in Povzetek: vsota podatkov = x̄ · n (n ≠ 0). -/
theorem vsota_je_sredina_krat_n {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) : ∑ i, x i = M x * n := by
  have hn' : (n : ℝ) ≠ 0 := Nat.cast_ne_zero.mpr hn
  rw [M, div_mul_cancel₀ _ hn']

/-! ## Razlaga 5: lastnosti -/

/-- Bolj natančno: če je vsak podatek vsaj m, je vsota vsaj n·m in sredina vsaj m (n ≠ 0). -/
theorem sredina_vsaj {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) (m : ℝ) (h : ∀ i, m ≤ x i) :
    n * m ≤ ∑ i, x i ∧ m ≤ M x := by
  have hs : n * m ≤ ∑ i, x i := by
    have := sum_le_sum (s := univ) (fun i _ => h i)
    simpa [sum_const, card_univ] using this
  have hn' : (0 : ℝ) < n := by exact_mod_cast Nat.pos_of_ne_zero hn
  refine ⟨hs, ?_⟩
  rw [M, le_div_iff₀ hn']
  linarith

/-- Bolj natančno (»enako razmisliš za največjega«) in Razlaga 5 (premisli): če je vsak podatek največ m, je
vsota največ n·m in sredina največ m (n ≠ 0). -/
theorem sredina_najvec {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) (m : ℝ) (h : ∀ i, x i ≤ m) :
    ∑ i, x i ≤ n * m ∧ M x ≤ m := by
  have hs : ∑ i, x i ≤ n * m := by
    have := sum_le_sum (s := univ) (fun i _ => h i)
    simpa [sum_const, card_univ] using this
  have hn' : (0 : ℝ) < n := by exact_mod_cast Nat.pos_of_ne_zero hn
  refine ⟨hs, ?_⟩
  rw [M, div_le_iff₀ hn']
  linarith

/-- Predpostavke `sredina_vsaj` in `sredina_najvec` se dajo izpolniti (podatki 2, 4, 9; m = 2 oziroma m = 9). -/
example : (∀ i, (2 : ℝ) ≤ ![(2 : ℝ), 4, 9] i) ∧ (∀ i, ![(2 : ℝ), 4, 9] i ≤ 9) := by
  constructor <;> intro i <;> fin_cases i <;> norm_num

/-- Razlaga 5 in Povzetek: sredina leži med najmanjšim podatkom xᵢ in največjim podatkom xⱼ (n ≠ 0). -/
theorem sredina_med_min_max {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) :
    ∃ i j, (∀ k, x i ≤ x k) ∧ (∀ k, x k ≤ x j) ∧ x i ≤ M x ∧ M x ≤ x j := by
  have hne : (univ : Finset (Fin n)).Nonempty := ⟨⟨0, Nat.pos_of_ne_zero hn⟩, mem_univ _⟩
  obtain ⟨i, -, hi⟩ := exists_min_image univ x hne
  obtain ⟨j, -, hj⟩ := exists_max_image univ x hne
  exact ⟨i, j, fun k => hi k (mem_univ k), fun k => hj k (mem_univ k),
    (sredina_vsaj hn x (x i) (fun k => hi k (mem_univ k))).2,
    (sredina_najvec hn x (x j) (fun k => hj k (mem_univ k))).2⟩

/-- Razlaga 5 in Povzetek: sredina ni nujno enaka kateremu od podatkov in je lahko decimalna, čeprav so vsi
podatki celi: pri 2, 4, 9 je 5 (ni podatek), pri ocenah iz Primera 2 je 71/20 = 3,55 (ni celo število). -/
theorem ni_nujno_podatek_ne_celo :
    sr [2, 4, 9] = 5 ∧ (5 : ℝ) ∉ [2, 4, 9] ∧ ¬ ∃ k : ℤ, (k : ℝ) = 71 / 20 := by
  refine ⟨by norm_num [sr], by norm_num, ?_⟩
  rintro ⟨k, hk⟩
  have h1 : (3 : ℝ) < k := by rw [hk]; norm_num
  have h2 : (k : ℝ) < 4 := by rw [hk]; norm_num
  have h1' : (3 : ℤ) < k := by exact_mod_cast h1
  have h2' : k < (4 : ℤ) := by exact_mod_cast h2
  omega

/-- Pomožno: vsota po zamenjavi podatka xᵢ z b je stara vsota − xᵢ + b. -/
theorem vsota_zamenjava {n : ℕ} (x : Fin n → ℝ) (i : Fin n) (b : ℝ) :
    ∑ j, Function.update x i b j = ∑ j, x j - x i + b := by
  rw [sum_update_of_mem (mem_univ i), sdiff_singleton_eq_erase, ← add_sum_erase univ x (mem_univ i)]
  ring

/-- Razlaga 5 (izstopajoč podatek premakne sredino): če en podatek povečaš za d, se sredina poveča za d/n
(n ≠ 0). -/
theorem premik_enega_podatka {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) (i : Fin n) (d : ℝ) :
    M (Function.update x i (x i + d)) = M x + d / n := by
  have hn' : (n : ℝ) ≠ 0 := Nat.cast_ne_zero.mpr hn
  rw [M, M, vsota_zamenjava]
  field_simp
  ring

/-- Razlaga 6: žepnina 10, 12, 8, 10, 60 €: vsota 100 €, sredina 100 : 5 = 20 €; štirje od petih dobijo največ
12 €. -/
theorem zepnina :
    sr [10, 12, 8, 10, 60] = 20 ∧ (10 : ℝ) + 12 + 8 + 10 + 60 = 100 ∧ (100 : ℝ) / 5 = 20 ∧
      ∀ y ∈ ([10, 12, 8, 10] : List ℝ), y ≤ 12 := by
  norm_num [sr]

/-! ## Rešeni primeri -/

/-- Primer 1: (12 + 15 + 9 + 14 + 10 + 13 + 11)/7 = 84/7 = 12 °C; preverimo: 9 ≤ 12 ≤ 15. -/
theorem primer1 : sr [12, 15, 9, 14, 10, 13, 11] = 12 ∧ (9 : ℝ) ≤ 12 ∧ (12 : ℝ) ≤ 15 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  calc sr [12, 15, 9, 14, 10, 13, 11] = (12 + 15 + 9 + 14 + 10 + 13 + 11) / 7 := by norm_num [sr]
    _ = 84 / 7 := by norm_num
    _ = 12 := by norm_num

/-- Razlaga in Povzetek (frekvenčna tabela): vsota podatkov je vsota vrednosti v, pomnoženih s frekvenco
(kolikokrat se v pojavi), zato x̄ = (∑ frekvenca · vrednost) / n. -/
theorem frekvence {n : ℕ} (x : Fin n → ℝ) :
    M x = (∑ v ∈ univ.image x, (#{i | x i = v} : ℝ) * v) / n := by
  have h := sum_comp (s := univ) (fun v : ℝ => v) x
  simp only [nsmul_eq_mul] at h
  rw [M, h]

/-- Primer 2: n = 4 + 7 + 6 + 2 + 1 = 20; vsota 5·4 + 4·7 + 3·6 + 2·2 + 1·1 = 20 + 28 + 18 + 4 + 1 = 71;
x̄ = 71/20 = 3,55 (računano na seznamu vseh 20 ocen). -/
theorem primer2 :
    sr (List.replicate 4 5 ++ List.replicate 7 4 ++ List.replicate 6 3 ++ List.replicate 2 2 ++
      List.replicate 1 1) = 355 / 100 ∧ 4 + 7 + 6 + 2 + 1 = 20 := by
  refine ⟨?_, by norm_num⟩
  calc sr (List.replicate 4 5 ++ List.replicate 7 4 ++ List.replicate 6 3 ++ List.replicate 2 2 ++
        List.replicate 1 1)
      = (5 * 4 + 4 * 7 + 3 * 6 + 2 * 2 + 1 * 1) / (4 + 7 + 6 + 2 + 1) := by
        simp only [sr, List.sum_append, List.sum_replicate, List.length_append, List.length_replicate,
          nsmul_eq_mul]
        norm_num
    _ = (20 + 28 + 18 + 4 + 1) / 20 := by norm_num
    _ = 71 / 20 := by norm_num
    _ = 355 / 100 := by norm_num

/-- Pomožno: vsota po dodanem podatku a je stara vsota + a. -/
theorem vsota_snoc {n : ℕ} (x : Fin n → ℝ) (a : ℝ) :
    ∑ i, (Fin.snoc x a : Fin (n + 1) → ℝ) i = ∑ i, x i + a := by
  rw [Fin.sum_univ_castSucc]
  simp

/-- Primer 3 (računski koraki): 78·4 = 312, 80·5 = 400, x₅ = 400 − 312 = 88; preverimo (312 + 88)/5 = 400/5 = 80. -/
theorem primer3_koraki :
    (78 : ℝ) * 4 = 312 ∧ (80 : ℝ) * 5 = 400 ∧ (400 : ℝ) - 312 = 88 ∧
      ((312 : ℝ) + 88) / 5 = 400 / 5 ∧ (400 : ℝ) / 5 = 80 := by
  norm_num

/-- Primer 3: Nika ima na štirih testih povprečno 78 točk; povprečje po petem testu je 80 natanko tedaj, ko na
petem testu doseže x₅ = 88 točk. -/
theorem primer3 (x : Fin 4 → ℝ) (h : M x = 78) (x5 : ℝ) : M (Fin.snoc x x5 : Fin 5 → ℝ) = 80 ↔ x5 = 88 := by
  have hs : ∑ i, x i = 312 := by
    rw [vsota_je_sredina_krat_n (by norm_num) x, h]; norm_num
  rw [M, vsota_snoc, hs]
  push_cast
  constructor
  · intro h5; linarith
  · rintro rfl; norm_num

/-- Predpostavka `primer3` se da izpolniti (vsi štirje testi po 78 točk). -/
example : M (fun _ : Fin 4 => (78 : ℝ)) = 78 := by
  simp [M]

/-- Primer 4: povprečje 5 košarkarjev je 186 cm; igralca s 178 cm zamenja igralec s 193 cm: vsota prej
186·5 = 930, nova vsota 930 − 178 + 193 = 945, nova sredina 945/5 = 189 cm. -/
theorem primer4 (x : Fin 5 → ℝ) (i : Fin 5) (h : M x = 186) (hi : x i = 178) :
    M (Function.update x i 193) = 189 := by
  have hs : ∑ j, x j = 186 * 5 := by
    rw [vsota_je_sredina_krat_n (by norm_num) x, h]; norm_num
  calc M (Function.update x i 193) = (∑ j, x j - x i + 193) / 5 := by rw [M, vsota_zamenjava]; norm_num
    _ = (930 - 178 + 193) / 5 := by rw [hs, hi]; norm_num
    _ = 945 / 5 := by norm_num
    _ = 189 := by norm_num

/-- Primer 4 (premisli): novi igralec je za 193 − 178 = 15 cm višji, 15/5 = 3, povprečje je višje za 3 cm. -/
theorem primer4_razlika : (193 : ℝ) - 178 = 15 ∧ (15 : ℝ) / 5 = 3 ∧ (189 : ℝ) - 186 = 3 := by norm_num

/-- Predpostavke `primer4` se dajo izpolniti: višine 178, 188, 188, 188, 188 cm, i = 0. -/
example : M (fun j : Fin 5 => if j = 0 then (178 : ℝ) else 188) = 186 ∧
    (fun j : Fin 5 => if j = 0 then (178 : ℝ) else 188) 0 = 178 := by
  refine ⟨?_, by simp⟩
  rw [M, Fin.sum_univ_five]
  norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1: podatki 4, 0, 5, 3: ničla je podatek, sredina je 12 : 4 = 3, ne 12 : 3 = 4. -/
theorem napaka_nicla : sr [4, 0, 5, 3] = 3 ∧ (12 : ℝ) / 4 = 3 ∧ (12 : ℝ) / 3 = 4 ∧ (4 : ℝ) ≠ 3 := by
  norm_num [sr]

/-- Pogoste napake 2: seštevanje le različnih vrednosti da (5 + 4 + 3 + 2 + 1) : 5 = 3, kar ni prava sredina 3,55
iz Primera 2. -/
theorem napaka_tabela : ((5 : ℝ) + 4 + 3 + 2 + 1) / 5 = 3 ∧ (3 : ℝ) ≠ 355 / 100 := by norm_num

/-- Pogoste napake 3 in kviz 2: družine z 1, 2, 1, 2 in 2 otrokoma imajo skupaj 8 otrok, 8 : 5 = 1,6, čeprav
nobena družina nima 1,6 otroka (sredina je lahko decimalna). -/
theorem druzine : sr [1, 2, 1, 2, 2] = 16 / 10 ∧ (1 + 2 + 1 + 2 + 2 : ℝ) = 8 ∧
    (16 / 10 : ℝ) ∉ [1, 2, 1, 2, 2] := by
  norm_num [sr]

/-- Pogoste napake 4 in kviz 5: po dveh testih s povprečjem 70 in tretjem testu s 85 točkami je novo povprečje
natanko 75: vsota 70·2 = 140, nova vsota 140 + 85 = 225, 225 : 3 = 75; (70 + 85) : 2 = 77,5 je napačno. -/
theorem povprecje_povprecij (x : Fin 2 → ℝ) (h : M x = 70) :
    M (Fin.snoc x 85 : Fin 3 → ℝ) = 75 ∧ ((70 : ℝ) + 85) / 2 = 775 / 10 ∧ (775 / 10 : ℝ) ≠ 75 := by
  have hs : ∑ i, x i = 70 * 2 := by
    rw [vsota_je_sredina_krat_n (by norm_num) x, h]; norm_num
  refine ⟨?_, by norm_num, by norm_num⟩
  calc M (Fin.snoc x 85 : Fin 3 → ℝ) = (∑ i, x i + 85) / 3 := by rw [M, vsota_snoc]; norm_num
    _ = (140 + 85) / 3 := by rw [hs]; norm_num
    _ = 225 / 3 := by norm_num
    _ = 75 := by norm_num

/-- Predpostavka `povprecje_povprecij` se da izpolniti (oba testa po 70 točk). -/
example : M (fun _ : Fin 2 => (70 : ℝ)) = 70 := by
  simp [M]

/-- Pogoste napake 5: pri podatkih 2, 9, 4 na sredini seznama stoji 9, sredina pa je 15 : 3 = 5. -/
theorem napaka_sredina_seznama : sr [2, 9, 4] = 5 ∧ [2, 9, 4].getD 1 0 = (9 : ℝ) ∧ (2 + 9 + 4 : ℝ) / 3 = 5 ∧
    (9 : ℝ) ≠ 5 := by
  norm_num [sr]

/-! ## Drugače -/

/-- Na sliki: pri črti na višini 5 je odrezanega 2 + 3 = 5, lukenj 2 + 1 + 2 = 5; pri črti na 6 je odrezanega
1 + 2 = 3 manj kot lukenj 3 + 2 + 3 = 8, pri 4 odrezanega 3 + 4 = 7 več kot lukenj 1 + 1 = 2. -/
theorem plastelin :
    ((7 : ℝ) - 5) + (8 - 5) = 5 ∧ ((5 : ℝ) - 3) + (5 - 4) + (5 - 3) = 5 ∧
      ((7 : ℝ) - 6) + (8 - 6) = 3 ∧ ((6 : ℝ) - 3) + (6 - 4) + (6 - 3) = 8 ∧ (3 : ℝ) < 8 ∧
      ((7 : ℝ) - 4) + (8 - 4) = 7 ∧ ((4 : ℝ) - 3) + (4 - 3) = 2 ∧ (2 : ℝ) < 7 := by
  norm_num

/-- Na sliki (splošno): odrezano minus luknje pri črti na višini c je ∑ (xᵢ − c) = n(x̄ − c); to je 0 natanko
pri c = x̄, pri c > x̄ je lukenj več, pri c < x̄ odrezanega več (n ≠ 0). -/
theorem crta_na_visini {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) (c : ℝ) :
    (∑ i, (x i - c) = 0 ↔ c = M x) ∧ (∑ i, (x i - c) < 0 ↔ M x < c) ∧ (0 < ∑ i, (x i - c) ↔ c < M x) := by
  have hn' : (0 : ℝ) < n := by exact_mod_cast Nat.pos_of_ne_zero hn
  rw [vsota_odmikov_od hn]
  refine ⟨⟨fun h => ?_, fun h => by rw [h, sub_self, mul_zero]⟩, ⟨fun h => ?_, fun h => ?_⟩,
    ⟨fun h => ?_, fun h => ?_⟩⟩
  · rcases mul_eq_zero.mp h with h0 | h0
    · linarith
    · linarith
  · by_contra hc; have hc' := not_lt.mp hc; nlinarith
  · nlinarith
  · by_contra hc; have hc' := not_lt.mp hc; nlinarith
  · nlinarith

/-- Iz vsakdanjega življenja: 9 + 6 + 12 + 5 = 32 €, 32 : 4 = 8 €; odmiki +1, −2, +4, −3; preplačanega
1 + 4 = 5 €, premalo plačanega 2 + 3 = 5 €; Bor in Dana dasta 2 + 3 = 5 €, Ana dobi 1 €, Cene 4 €, nato je vsak
plačal 8 €: 9 − 1 = 6 + 2 = 12 − 4 = 5 + 3 = 8. -/
theorem pica :
    sr [9, 6, 12, 5] = 8 ∧ (9 : ℝ) + 6 + 12 + 5 = 32 ∧ (32 : ℝ) / 4 = 8 ∧
      (9 : ℝ) - 8 = 1 ∧ (6 : ℝ) - 8 = -2 ∧ (12 : ℝ) - 8 = 4 ∧ (5 : ℝ) - 8 = -3 ∧
      (1 : ℝ) + 4 = 5 ∧ (2 : ℝ) + 3 = 5 ∧
      (9 : ℝ) - 1 = 8 ∧ (6 : ℝ) + 2 = 8 ∧ (12 : ℝ) - 4 = 8 ∧ (5 : ℝ) + 3 = 8 := by
  norm_num [sr]

/-- Korak za korakom, način A: 152 + 148 + 160 + 140 = 600, n = 4, 600 : 4 = 150 g. -/
theorem jabolka_A : sr [152, 148, 160, 140] = 150 := by
  calc sr [152, 148, 160, 140] = 600 / 4 := by norm_num [sr]
    _ = 150 := by norm_num

/-- Korak za korakom, način B (splošno): x̄ = c + (vsota odmikov od c)/n za vsako ugibano vrednost c (n ≠ 0). -/
theorem sredina_z_ugibanjem {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) (c : ℝ) :
    M x = c + (∑ i, (x i - c)) / n := by
  have hn' : (n : ℝ) ≠ 0 := Nat.cast_ne_zero.mpr hn
  rw [vsota_odmikov_od hn, mul_div_cancel_left₀ _ hn']
  ring

/-- Korak za korakom, način B: ugib 150, odmiki +2, −2, +10, −10, vsota 0, 0 : 4 = 0, 150 + 0 = 150; ugib 145,
odmiki +7, +3, +15, −5, vsota 20, 20 : 4 = 5, 145 + 5 = 150. -/
theorem jabolka_B :
    (152 : ℝ) - 150 = 2 ∧ (148 : ℝ) - 150 = -2 ∧ (160 : ℝ) - 150 = 10 ∧ (140 : ℝ) - 150 = -10 ∧
      (2 : ℝ) + (-2) + 10 + (-10) = 0 ∧ (0 : ℝ) / 4 = 0 ∧ (150 : ℝ) + 0 = 150 ∧
      (152 : ℝ) - 145 = 7 ∧ (148 : ℝ) - 145 = 3 ∧ (160 : ℝ) - 145 = 15 ∧ (140 : ℝ) - 145 = -5 ∧
      (7 : ℝ) + 3 + 15 + (-5) = 20 ∧ (20 : ℝ) / 4 = 5 ∧ (145 : ℝ) + 5 = 150 := by
  norm_num

/-- Bolj natančno: če vsakemu podatku prišteješ k, se sredina poveča za k (n ≠ 0). -/
theorem pristej_vsem {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) (k : ℝ) : M (fun i => x i + k) = M x + k := by
  have hn' : (n : ℝ) ≠ 0 := Nat.cast_ne_zero.mpr hn
  simp only [M, sum_add_distrib, sum_const, card_univ, Fintype.card_fin, nsmul_eq_mul]
  rw [add_div, mul_div_cancel_left₀ _ hn']

/-- Bolj natančno (pomožno): po dodanem podatku a je nova sredina x̄ + (a − x̄)/(n + 1) (n ≠ 0). -/
theorem dodan_podatek {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) (a : ℝ) :
    M (Fin.snoc x a : Fin (n + 1) → ℝ) = M x + (a - M x) / (n + 1) := by
  have hn' : (n : ℝ) ≠ 0 := Nat.cast_ne_zero.mpr hn
  have hp : (n : ℝ) + 1 ≠ 0 := by positivity
  rw [M, M, vsota_snoc]
  push_cast
  field_simp
  ring

/-- Bolj natančno in kviz 3: dodan podatek, enak sredini, sredine ne spremeni; večji od sredine jo poveča,
manjši zmanjša (vse kot ↔, n ≠ 0). -/
theorem dodan_podatek_vpliv {n : ℕ} (hn : n ≠ 0) (x : Fin n → ℝ) (a : ℝ) :
    (M (Fin.snoc x a : Fin (n + 1) → ℝ) = M x ↔ a = M x) ∧
      (M x < M (Fin.snoc x a : Fin (n + 1) → ℝ) ↔ M x < a) ∧
      (M (Fin.snoc x a : Fin (n + 1) → ℝ) < M x ↔ a < M x) := by
  have hp : (0 : ℝ) < n + 1 := by positivity
  rw [dodan_podatek hn]
  refine ⟨⟨fun h => ?_, fun h => by rw [h, sub_self, zero_div, add_zero]⟩, ⟨fun h => ?_, fun h => ?_⟩,
    ⟨fun h => ?_, fun h => ?_⟩⟩
  · have h0 : (a - M x) / (n + 1) = 0 := by linarith
    rcases div_eq_zero_iff.mp h0 with h1 | h1
    · linarith
    · linarith
  · have h0 : 0 < (a - M x) / (n + 1) := by linarith
    rw [lt_div_iff₀ hp] at h0; linarith
  · have h0 : 0 < (a - M x) / (n + 1) := div_pos (by linarith) hp
    linarith
  · have h0 : (a - M x) / (n + 1) < 0 := by linarith
    rw [div_lt_iff₀ hp] at h0; linarith
  · have h0 : (a - M x) / (n + 1) < 0 := div_neg_of_neg_of_pos (by linarith) hp
    linarith

/-! ## Preveri se -/

/-- Kviz 1: sredina je vsota vseh podatkov, deljena s številom podatkov (definicija `sr`); vrstni red v seznamu ni
pomemben (premešan seznam ima isto sredino). -/
theorem kviz1_vrstni_red (l l' : List ℝ) (h : l.Perm l') : sr l = sr l' := by
  rw [sr, sr, h.sum_eq, h.length_eq]

/-- Predpostavka `kviz1_vrstni_red` se da izpolniti: [4, 2, 9] je premešan [2, 4, 9]. -/
example : ([2, 4, 9] : List ℝ).Perm [4, 2, 9] := List.Perm.swap 4 2 [9]

/-- Kviz 1 (napačna odgovora): pri 2, 4, 9 je (najmanjši + največji)/2 = 5,5 in podatek na sredini 4, sredina pa 5. -/
theorem kviz1_napacni : ((2 : ℝ) + 9) / 2 = 55 / 10 ∧ (55 / 10 : ℝ) ≠ sr [2, 4, 9] ∧ (4 : ℝ) ≠ sr [2, 4, 9] := by
  norm_num [sr]

/-- Kviz 3 (primer): podatkom 2, 4, 9 (sredina 5) dodamo 7 > 5; nova sredina 22/4 = 5,5 je večja. -/
theorem kviz3_primer : sr [2, 4, 9, 7] = 55 / 10 ∧ sr [2, 4, 9] < sr [2, 4, 9, 7] := by
  norm_num [sr]

/-- Kviz 4: 0·3 + 1·4 + 2·2 + 3·1 = 11 golov na 10 tekmah, 11 : 10 = 1,1 (na seznamu vseh 10 tekem); napačno sta
(0 + 1 + 2 + 3) : 4 = 1,5 in 11 : 7 ≈ 1,6 (tekme brez gola izpuščene). -/
theorem kviz4 :
    sr (List.replicate 3 0 ++ List.replicate 4 1 ++ List.replicate 2 2 ++ List.replicate 1 3) = 11 / 10 ∧
      (0 * 3 + 1 * 4 + 2 * 2 + 3 * 1 : ℝ) = 11 ∧ ((0 : ℝ) + 1 + 2 + 3) / 4 = 15 / 10 ∧
      |(11 : ℝ) / 7 - 16 / 10| < 5 / 100 ∧ (15 / 10 : ℝ) ≠ 11 / 10 ∧ (11 / 7 : ℝ) ≠ 11 / 10 := by
  refine ⟨?_, by norm_num, by norm_num, ?_, by norm_num, by norm_num⟩
  · simp only [sr, List.sum_append, List.sum_replicate, List.length_append, List.length_replicate,
      nsmul_eq_mul]
    norm_num
  · rw [abs_lt]; constructor <;> norm_num

end Evklid.Lekcije.MAT_OS_7.AritmeticnaSredina
