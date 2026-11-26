/-
vir: content/lessons/MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini.md
sha256: eecd0f530b7d1aa8a6e7d5c40a851fe6900afc001d44e66566f09a70f59f8825
Ni v Leanu: risbe, simulacija in dogovor risanja (osenčeno, polna/črtkana črta, prazen krožec; dokazano je,
katere točke so v množici); merjenje z ravnilom in tesarsko pravilo 3-4-5 kot praksa (dokazano je
3² + 4² = 5²); poimenovanja (izhodišče, abscisa, ordinata, kvadrant, polravnina, pas); Pitagorov izrek kot
geometrijska trditev (dokazano: obrazec za razdaljo je evklidska razdalja v EuclideanSpace ℝ (Fin 2));
»u₁v₂ − u₂v₁ je ploščina paralelograma s predznakom« in »predznak pove smer obhoda« (dokazano je le, da je izraz
lahko negativen in da je neodvisen od izbire oglišča za izhodišče premikov); obrazec S = ½|u₁v₂ − u₂v₁| je
vzet kot definicija ploščine trikotnika (z odrezovanjem je dokazano le ujemanje števil v primerih);
kolinearnost je formalizirana kot C = A + t·(B − A) pri A ≠ B (pri A = B je izraz vedno 0);
ploščina pravokotnika v Primeru 5 je dokazana kot Lebesgueova mera (Ico ×ˢ Icc ima mero 16, enako kot zaprti
pravokotnik, robovi ne vplivajo); višina kot 2S/osnovnica (Naloga 2 c) je račun, dokazano je še, da je CS_AB
pravokotna na AB; »senca daljice« (Na sliki) kot opis; postopki (Ponovitev) in točkovanje; besedilo napačnih
odgovorov v Preveri se (kjer gre, je dokazano, da napačna možnost ni pravilna). Približki (√116, √29, √98)
so dokazani kot |točna − približek| < pol enote zadnjega mesta. Decimalna števila so točna racionalna
števila v ℝ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.PravokotniKoordinatniSistemVRavnini

open MeasureTheory

/-! ## Definicije -/

/-- Razdalja med A(x_A, y_A) in B(x_B, y_B): √((x_B − x_A)² + (y_B − y_A)²). -/
noncomputable def d (xA yA xB yB : ℝ) : ℝ := √((xB - xA) ^ 2 + (yB - yA) ^ 2)

/-- Ploščina trikotnika ABC: ½|u₁v₂ − u₂v₁|, u = premik od A do B, v = premik od A do C. -/
noncomputable def ploscina (xA yA xB yB xC yC : ℝ) : ℝ :=
  1 / 2 * |(xB - xA) * (yC - yA) - (yB - yA) * (xC - xA)|

/-- Kvadranti (osi ne spadajo v noben kvadrant). -/
def kvadrant (n : ℕ) (x y : ℝ) : Prop :=
  (n = 1 ∧ 0 < x ∧ 0 < y) ∨ (n = 2 ∧ x < 0 ∧ 0 < y) ∨ (n = 3 ∧ x < 0 ∧ y < 0) ∨ (n = 4 ∧ 0 < x ∧ y < 0)

/-- Pomožno: √(a²) = a za a ≥ 0.
pomozno – orodje: √(a²) = a za a ≥ 0 -/
theorem koren_kvadrata (a : ℝ) (ha : 0 ≤ a) : √(a ^ 2) = a := Real.sqrt_sq ha

/-- Predpostavka `koren_kvadrata` se da izpolniti (a = 5). -/
example : (0:ℝ) ≤ 5 := by norm_num

/-! ## Uvod in razdalja -/

/-- Razlaga, Ustno 1, Bolj natančno: obrazec za razdaljo je evklidska razdalja v ravnini (Pitagorov izrek,
zapisan s koordinatami).
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#razdalja-pitagora
besedilo: »Formula za razdaljo je Pitagorov izrek, zapisan s koordinatami.« -/
theorem razdalja_evklidska (xA yA xB yB : ℝ) :
    dist (!₂[xA, yA]) (!₂[xB, yB]) = d xA yA xB yB := by
  rw [EuclideanSpace.dist_eq, d]
  congr 1
  simp [Fin.sum_univ_two, Real.dist_eq, sq_abs]
  ring

/-- Zakaj se tega učimo in Razlaga: A(1, 1), B(5, 4): kateti 4 in 3, d² = 4² + 3² = 25, d = 5 (3-4-5).
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#uvod
besedilo: »Kateti merita $|x_B - x_A| = 4$ in $|y_B - y_A| = 3$. Iskana razdalja $d$ je hipotenuza. Po Pitagorovem izreku je $d^2 = 4^2 + 3^2 = 25$, torej $d = 5$.« -/
theorem uvod : (5:ℝ) - 1 = 4 ∧ (4:ℝ) - 1 = 3 ∧ (4:ℝ) ^ 2 + 3 ^ 2 = 25 ∧ d 1 1 5 4 = 5 ∧
    (3:ℝ) ^ 2 + 4 ^ 2 = 5 ^ 2 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, by norm_num⟩
  rw [d, show ((5:ℝ) - 1) ^ 2 + (4 - 1) ^ 2 = 5 ^ 2 by norm_num, koren_kvadrata 5 (by norm_num)]

/-- Razlaga, Preveri: T(−2, 3) leži v II. kvadrantu.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#preveri-kvadrant
besedilo: »(V II.: levo od osi $y$, nad osjo $x$.)« -/
theorem preveri_kvadrant : kvadrant 2 (-2) 3 := Or.inr (Or.inl ⟨rfl, by norm_num, by norm_num⟩)

/-- Ustno 2: točke na koordinatnih oseh ne ležijo v nobenem kvadrantu.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#osi-brez-kvadranta
besedilo: »Točke na koordinatnih oseh ne ležijo v nobenem kvadrantu.« -/
theorem osi_brez_kvadranta (n : ℕ) (t : ℝ) : ¬ kvadrant n 0 t ∧ ¬ kvadrant n t 0 := by
  unfold kvadrant
  constructor
  · rintro (⟨_, h, _⟩ | ⟨_, h, _⟩ | ⟨_, h, _⟩ | ⟨_, h, _⟩) <;> exact lt_irrefl 0 h
  · rintro (⟨_, _, h⟩ | ⟨_, _, h⟩ | ⟨_, _, h⟩ | ⟨_, _, h⟩) <;> exact lt_irrefl 0 h

/-- Razlaga (razdalja ob osi): točki z enako drugo koordinato sta oddaljeni |x_B − x_A|; A(−3, 2), B(4, 2):
7 enot; C(1, −5), D(1, 3): |3 − (−5)| = 8.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#razdalja-ob-osi
besedilo: »Razdaljo preberemo kot na številski premici: od $-3$ do $4$ je $7$ enot. V splošnem je to $|x_B - x_A|$.« -/
theorem razdalja_ob_osi (xA xB y : ℝ) : d xA y xB y = |xB - xA| ∧ d (-3) 2 4 2 = 7 ∧ d 1 (-5) 1 3 = 8 := by
  refine ⟨?_, ?_, ?_⟩
  · rw [d, sub_self, show (0:ℝ) ^ 2 = 0 by norm_num, add_zero, Real.sqrt_sq_eq_abs]
  · rw [d, show ((4:ℝ) - (-3)) ^ 2 + (2 - 2) ^ 2 = 7 ^ 2 by norm_num, koren_kvadrata 7 (by norm_num)]
  · rw [d, show ((1:ℝ) - 1) ^ 2 + (3 - (-5)) ^ 2 = 8 ^ 2 by norm_num, koren_kvadrata 8 (by norm_num)]

/-- Razlaga, Premisli, Preveri se 3, Povzetek: vrstni red točk ni pomemben, d(A, B) = d(B, A), ker je
(x_A − x_B)² = (x_B − x_A)² (npr. (−4)² = 4² = 16).
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#razdalja-simetricna
besedilo: »$(x_A - x_B)^2 = (x_B - x_A)^2$, ker se razlikujeta le v predznaku. Zato je $d(A, B) = d(B, A)$.« -/
theorem razdalja_simetricna (xA yA xB yB : ℝ) : d xA yA xB yB = d xB yB xA yA ∧
    (xA - xB) ^ 2 = (xB - xA) ^ 2 ∧ ((1:ℝ) - 5) ^ 2 = 16 ∧ ((5:ℝ) - 1) ^ 2 = 16 := by
  refine ⟨?_, by ring, by norm_num, by norm_num⟩
  unfold d; congr 1; ring

/-- Bolj natančno: (x_B − x_A)² = |x_B − x_A|²; razdalja od izhodišča je √(x² + y²).
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#razdalja-absolutna
besedilo: »in zato $(x_B - x_A)^2 = |x_B - x_A|^2$. Poseben primer je razdalja točke $T(x, y)$ od izhodišča, $\sqrt{x^2 + y^2}$.« -/
theorem bolj_natancno_razdalja (a x y : ℝ) : a ^ 2 = |a| ^ 2 ∧ d 0 0 x y = √(x ^ 2 + y ^ 2) := by
  refine ⟨(sq_abs a).symm, ?_⟩
  unfold d; congr 1; ring

/-! ## Razpolovišče -/

/-- Razlaga, Preveri: sredina med 2 in 8 je (2 + 8)/2 = 5; razpolovišče A(2, 7), B(8, −1) je (5, 3).
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#razpolovisce-primer
besedilo: »(V točki $(5, 3)$, ker je $\dfrac{2 + 8}{2} = 5$ in $\dfrac{7 + (-1)}{2} = 3$.)« -/
theorem razpolovisce_primer : ((2:ℝ) + 8) / 2 = 5 ∧ ((7:ℝ) + (-1)) / 2 = 3 := by norm_num

/-- Bolj natančno: premik od A do S_AB je enak premiku od S_AB do B in je polovica premika od A do B; zato je
S_AB od obeh krajišč enako oddaljena, za polovico d(A, B).
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#razpolovisce
besedilo: »Premik od $A$ do $S_{AB}$ je $\left(\dfrac{x_B - x_A}{2}, \dfrac{y_B - y_A}{2}\right)$, enak kot premik od $S_{AB}$ do $B$. Oba sta natanko polovica premika od $A$ do $B$« -/
theorem razpolovisce (xA yA xB yB : ℝ) :
    (xA + xB) / 2 - xA = xB - (xA + xB) / 2 ∧ (xA + xB) / 2 - xA = (xB - xA) / 2 ∧
    (yA + yB) / 2 - yA = yB - (yA + yB) / 2 ∧ (yA + yB) / 2 - yA = (yB - yA) / 2 ∧
    d xA yA ((xA + xB) / 2) ((yA + yB) / 2) = d ((xA + xB) / 2) ((yA + yB) / 2) xB yB ∧
    d xA yA ((xA + xB) / 2) ((yA + yB) / 2) = d xA yA xB yB / 2 := by
  refine ⟨by ring, by ring, by ring, by ring, ?_, ?_⟩
  · unfold d; congr 1; ring
  · unfold d
    rw [show ((xA + xB) / 2 - xA) ^ 2 + ((yA + yB) / 2 - yA) ^ 2 =
      ((xB - xA) ^ 2 + (yB - yA) ^ 2) / 2 ^ 2 by ring, Real.sqrt_div' _ (by positivity),
      koren_kvadrata 2 (by norm_num)]

/-- Povzetek, Primer 4: x_S = (x_A + x_B)/2 ⇔ x_B = 2x_S − x_A (enako za y).
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#krajisce
besedilo: »Iz $A$ in $S_{AB}$ dobiš $B$: $x_B = 2x_S - x_A$, $y_B = 2y_S - y_A$.« -/
theorem krajisce (xA xB xS : ℝ) : xS = (xA + xB) / 2 ↔ xB = 2 * xS - xA :=
  ⟨fun h => by linarith, fun h => by linarith⟩

/-! ## Ploščina trikotnika -/

/-- Razlaga: trikotnik A(1, 1), B(6, 2), C(3, 5): očrtan pravokotnik 5·4 = 20, odrezani trikotniki 5·1/2 = 2,5,
3·3/2 = 4,5, 2·4/2 = 4; 20 − 2,5 − 4,5 − 4 = 9; obrazec: u = (5, 1), v = (2, 4), ½|5·4 − 1·2| = ½·18 = 9.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#ploscina-primer
besedilo: »Za naš trikotnik je $u_1 = 5$, $u_2 = 1$, $v_1 = 2$, $v_2 = 4$, zato je $S = \dfrac{1}{2} \cdot |5 \cdot 4 - 1 \cdot 2| = \dfrac{1}{2} \cdot 18 = 9$. Isto kot z odrezovanjem.« -/
theorem ploscina_primer : (6:ℝ) - 1 = 5 ∧ (5:ℝ) - 1 = 4 ∧ (5:ℝ) * 4 = 20 ∧ (5:ℝ) * 1 / 2 = 2.5 ∧
    (3:ℝ) * 3 / 2 = 4.5 ∧ (2:ℝ) * 4 / 2 = 4 ∧ (20:ℝ) - 2.5 - 4.5 - 4 = 9 ∧
    (1 / 2 : ℝ) * |5 * 4 - 1 * 2| = 1 / 2 * 18 ∧ ploscina 1 1 6 2 3 5 = 9 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num [abs_of_pos], ?_⟩
  unfold ploscina; norm_num [abs_of_pos]

/-- Razlaga, Premisli, Ustno 3, Povzetek: pri A ≠ B je u₁v₂ − u₂v₁ = 0 (ploščina 0) natanko tedaj, ko C leži na
premici AB (C = A + t·(B − A)), torej so točke kolinearne.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#kolinearne
besedilo: »Formula da $0$ natanko tedaj, ko točke $A$, $B$, $C$ ležijo na isti premici (so **kolinearne**).« -/
theorem kolinearne (xA yA xB yB xC yC : ℝ) (hAB : xA ≠ xB ∨ yA ≠ yB) :
    ploscina xA yA xB yB xC yC = 0 ↔ ∃ t : ℝ, xC = xA + t * (xB - xA) ∧ yC = yA + t * (yB - yA) := by
  unfold ploscina
  rw [mul_eq_zero, abs_eq_zero]
  simp only [one_div, inv_eq_zero, OfNat.ofNat_ne_zero, false_or]
  constructor
  · intro h
    rcases hAB with hx | hy
    · have hu : xB - xA ≠ 0 := sub_ne_zero.mpr (Ne.symm hx)
      refine ⟨(xC - xA) / (xB - xA), by field_simp; ring, ?_⟩
      field_simp
      linear_combination h
    · have hu : yB - yA ≠ 0 := sub_ne_zero.mpr (Ne.symm hy)
      refine ⟨(yC - yA) / (yB - yA), ?_, by field_simp; ring⟩
      field_simp
      linear_combination -h
  · rintro ⟨t, rfl, rfl⟩
    ring

/-- Predpostavka `kolinearne` se da izpolniti (A(−1, −1), B(1, 2)). -/
example : (-1:ℝ) ≠ 1 ∨ (-1:ℝ) ≠ 2 := Or.inl (by norm_num)

/-- Bolj natančno: izraz u₁v₂ − u₂v₁ je neodvisen od tega, katero oglišče vzamemo za izhodišče premikov
(iz B dobimo isto vrednost), zato tudi ploščina.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#ploscina-neodvisna
besedilo: »Formula deluje ne glede na to, katero oglišče vzameš za izhodišče premikov.« -/
theorem ploscina_neodvisna (xA yA xB yB xC yC : ℝ) :
    (xC - xB) * (yA - yB) - (yC - yB) * (xA - xB) = (xB - xA) * (yC - yA) - (yB - yA) * (xC - xA) ∧
    ploscina xB yB xC yC xA yA = ploscina xA yA xB yB xC yC := by
  have h : (xC - xB) * (yA - yB) - (yC - yB) * (xA - xB) = (xB - xA) * (yC - yA) - (yB - yA) * (xC - xA) := by
    ring
  exact ⟨h, by unfold ploscina; rw [h]⟩

/-- Pogoste napake 4, Bolj natančno: u₁v₂ − u₂v₁ je lahko negativen (pri zamenjanih B in C trikotnika iz
razlage je −18), zato je ploščina polovica absolutne vrednosti.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#predznak
besedilo: »Izraz $u_1 v_2 - u_2 v_1$ je ploščina paralelograma s predznakom, zato je lahko negativen. Ploščina trikotnika je **polovica** njegove **absolutne vrednosti**.« -/
theorem predznak : ((3:ℝ) - 1) * (2 - 1) - (5 - 1) * (6 - 1) = -18 ∧ ploscina 1 1 3 5 6 2 = 9 := by
  refine ⟨by norm_num, ?_⟩
  unfold ploscina; norm_num [abs_of_neg]

/-! ## Množice točk -/

/-- Razlaga: |y| < 2 ⇔ −2 < y < 2 (pas; RACUN: (−2, 2)); |x| ≥ 3 ⇔ x ≤ −3 ali x ≥ 3 (dve polravnini).
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#mnozice
besedilo: »$|y| < 2$: to je isto kot $-2 < y < 2$, zato dobimo **pas** med vodoravnicama $y = -2$ in $y = 2$, brez njiju. - $|x| \ge 3$: to je $x \le -3$ ali $x \ge 3$, torej dve polravnini, levo in desno od pasu $|x| < 3$.« -/
theorem mnozice (x y : ℝ) : (|y| < 2 ↔ -2 < y ∧ y < 2) ∧ (|x| ≥ 3 ↔ x ≤ -3 ∨ x ≥ 3) := by
  refine ⟨abs_lt, ?_⟩
  rw [ge_iff_le, le_abs']

/-- Razlaga: pri 1 ≤ x < 4 in y > −1 oglišče (1, −1) ne spada zraven (y > −1 ne velja), točke nad njim pa
(npr. (1, 0)).
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#oglisce-prazno
besedilo: »Oglišče $(1, -1)$ leži na polni črti, a ne spada zraven, ker zanj ne velja $y > -1$.« -/
theorem oglisce_prazno : ¬ ((1:ℝ) ≤ 1 ∧ (1:ℝ) < 4 ∧ (-1:ℝ) > -1) ∧ ((1:ℝ) ≤ 1 ∧ (1:ℝ) < 4 ∧ (0:ℝ) > -1) := by
  norm_num

/-- Razlaga, Premisli: |x| < 1 in |y| < 1 je odprt kvadrat (−1, 1) × (−1, 1); pri »ali« je to unija pasov
(križ, npr. (5, 0) je v njej, v kvadratu pa ne).
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#kvadrat-kriz
besedilo: »Pri »in« je to kvadrat s stranico $2$ in središčem v izhodišču, brez roba: presek navpičnega in vodoravnega pasu. Pri »ali« je to unija obeh pasov, torej križ, ki se razteza v vse štiri smeri.« -/
theorem kvadrat_kriz (x y : ℝ) : ((|x| < 1 ∧ |y| < 1) ↔ (x, y) ∈ Set.Ioo (-1:ℝ) 1 ×ˢ Set.Ioo (-1:ℝ) 1) ∧
    ((|x| < 1 ∨ |y| < 1) ↔ (x, y) ∈ {p : ℝ × ℝ | |p.1| < 1} ∪ {p : ℝ × ℝ | |p.2| < 1}) ∧
    (|(5:ℝ)| < 1 ∨ |(0:ℝ)| < 1) ∧ ¬ (|(5:ℝ)| < 1 ∧ |(0:ℝ)| < 1) := by
  refine ⟨?_, Iff.rfl, by norm_num, by norm_num⟩
  simp only [Set.mem_prod, Set.mem_Ioo, abs_lt]

/-- Pogoste napake 6: x ≥ 2 omeji točke levo-desno: točki (2, −7) in (2, 5) ležita na robu (navpična premica
x = 2), (3, 0) v polravnini, (1, 0) ne.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#rob-navpicen
besedilo: »Pogoj $x \ge 2$ omeji točke levo in desno, zato je njegov rob navpična premica $x = 2$, ne vodoravna.« -/
theorem rob_navpicen : ((2:ℝ) ≥ 2 ∧ (2:ℝ) ≥ 2) ∧ (3:ℝ) ≥ 2 ∧ ¬ ((1:ℝ) ≥ 2) := by norm_num

/-! ## Primeri -/

/-- Primer 1, Pogoste napake 1: x_B − x_A = 4 − (−2) = 6 (ne 4 − 2 = 2), y_B − y_A = 9 − 1 = 8,
d = √(36 + 64) = √100 = 10 m.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#primer1
besedilo: »Odgovor: stebra sta $10\,\text{m}$ narazen.« -/
theorem p1 : (4:ℝ) - (-2) = 6 ∧ (4:ℝ) - 2 ≠ 6 ∧ (9:ℝ) - 1 = 8 ∧ (6:ℝ) ^ 2 + 8 ^ 2 = 36 + 64 ∧
    √(36 + 64 : ℝ) = √100 ∧ √(100:ℝ) = 10 ∧ d (-2) 1 4 9 = 10 := by
  have h10 : √(100:ℝ) = 10 := by rw [show (100:ℝ) = 10 ^ 2 by norm_num, koren_kvadrata 10 (by norm_num)]
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, h10, ?_⟩
  rw [d, show ((4:ℝ) - (-2)) ^ 2 + (9 - 1) ^ 2 = 100 by norm_num, h10]

/-- Primer 2, koraki 1–3: S_AB = ((−4 + 6)/2, (3 + (−1))/2) = (2/2, 2/2) = (1, 1); razliki 10 in −4,
d(A, B) = √(100 + 16) = √116 ≈ 10,77 ≈ 10,8.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#primer2-tram
besedilo: »Odgovor: podpora je v točki $S_{AB}(1, 1)$, tram je dolg približno $10{,}8\,\text{dm}$« -/
theorem p2_tram : ((-4:ℝ) + 6) / 2 = 2 / 2 ∧ (2:ℝ) / 2 = 1 ∧ ((3:ℝ) + (-1)) / 2 = 2 / 2 ∧
    (6:ℝ) - (-4) = 10 ∧ (-1:ℝ) - 3 = -4 ∧ d (-4) 3 6 (-1) = √(100 + 16) ∧ (100:ℝ) + 16 = 116 ∧
    |√116 - 10.77| < 0.005 ∧ |√116 - 10.8| < 0.05 := by
  have h1 : (10.765:ℝ) < √116 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have h2 : √116 < (10.775:ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by unfold d; norm_num,
    by norm_num, ?_, ?_⟩ <;> rw [abs_sub_lt_iff] <;> constructor <;> linarith

/-- Primer 2, korak 4: od A do S_AB in od S_AB do B sta razliki 5 in −2, obe razdalji √(25 + 4) = √29 ≈ 5,39
≈ 5,4, kar je točno polovica od √116.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#primer2-sredina
besedilo: »$$d = \sqrt{25 + 4} = \sqrt{29} \approx 5{,}39$$ kar je polovica od $10{,}77$.« -/
theorem p2_sredina : d (-4) 3 1 1 = √(25 + 4) ∧ d 1 1 6 (-1) = √(25 + 4) ∧ √(25 + 4 : ℝ) = √116 / 2 ∧
    |√(29:ℝ) - 5.39| < 0.005 ∧ |√(29:ℝ) - 5.4| < 0.05 := by
  have h1 : (5.385:ℝ) < √29 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have h2 : √29 < (5.395:ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by unfold d; norm_num, by unfold d; norm_num, ?_, ?_, ?_⟩
  · rw [show (116:ℝ) = 2 ^ 2 * 29 by norm_num, Real.sqrt_mul (by norm_num), koren_kvadrata 2 (by norm_num)]
    norm_num
  all_goals rw [abs_sub_lt_iff]; constructor <;> linarith

/-- Primer 3: u = (4 − (−2), 1 − (−1)) = (6, 2), v = (1 − (−2), 5 − (−1)) = (3, 6), S = ½|6·6 − 2·3| = ½·30 = 15 m²;
odrezovanje 6·6 = 36, 36 − 6 − 6 − 9 = 15; lazura 15/6 = 2,5 L.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#primer3
besedilo: »Odgovor: terasa ima ploščino $15\,\text{m}^2$, za en premaz potrebuješ $2{,}5\,\text{L}$ lazure.« -/
theorem p3 : ((4:ℝ) - (-2) = 6 ∧ (1:ℝ) - (-1) = 2) ∧ ((1:ℝ) - (-2) = 3 ∧ (5:ℝ) - (-1) = 6) ∧
    (1 / 2 : ℝ) * |6 * 6 - 2 * 3| = 1 / 2 * 30 ∧ ploscina (-2) (-1) 4 1 1 5 = 15 ∧
    (6:ℝ) * 6 = 36 ∧ (36:ℝ) - 6 - 6 - 9 = 15 ∧ (15:ℝ) / 6 = 2.5 := by
  refine ⟨by norm_num, by norm_num, by norm_num [abs_of_pos], ?_, by norm_num, by norm_num, by norm_num⟩
  unfold ploscina; norm_num [abs_of_pos]

/-- Primer 3, korak 4: odrezani trikotniki imajo ploščine 6, 6 in 9 (kateti 6 in 2, 3 in 4, 3 in 6).
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#primer3-odrezani
besedilo: »odrezani trikotniki pa $6$, $6$ in $9$« -/
theorem p3_odrezani : (6:ℝ) * 2 / 2 = 6 ∧ (3:ℝ) * 4 / 2 = 6 ∧ (3:ℝ) * 6 / 2 = 9 := by norm_num

/-- Primer 4, Premisli: 3 = (−1 + x_B)/2 ⇔ −1 + x_B = 6 ⇔ x_B = 7; 0 = (2 + y_B)/2 ⇔ y_B = −2; B(7, −2);
preizkus (−1 + 7)/2 = 3, (2 + (−2))/2 = 0.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#primer4
besedilo: »Iz $2 + y_B = 0$ dobimo $y_B = -2$, torej $B(7, -2)$. Preizkus: $\dfrac{-1 + 7}{2} = 3$ in $\dfrac{2 + (-2)}{2} = 0$.« -/
theorem p4 (xB yB : ℝ) : (3 = (-1 + xB) / 2 ↔ -1 + xB = 6) ∧ (-1 + xB = 6 ↔ xB = 7) ∧
    (0 = (2 + yB) / 2 ↔ yB = -2) ∧ ((-1:ℝ) + 7) / 2 = 3 ∧ ((2:ℝ) + (-2)) / 2 = 0 :=
  ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, by norm_num⟩

/-- Pomožno: množica M iz Primera 5: −1 ≤ x < 3 in |y| ≤ 2. -/
def M (x y : ℝ) : Prop := -1 ≤ x ∧ x < 3 ∧ |y| ≤ 2

/-- Primer 5, koraki 1–6: |y| ≤ 2 ⇔ −2 ≤ y ≤ 2; M je pravokotnik [−1, 3) × [−2, 2]; (3, 2), (3, −2) in A(3, 0)
niso v M, B(−1, −2) je (|−2| = 2 ≤ 2), C(1, 3) ni (|3| = 3 > 2).
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#primer5
besedilo: »Odgovor: $M$ je pravokotnik na sliki brez desnega roba; $B \in M$, $A \notin M$, $C \notin M$« -/
theorem p5 (x y : ℝ) : (|y| ≤ 2 ↔ -2 ≤ y ∧ y ≤ 2) ∧ (M x y ↔ (x, y) ∈ Set.Ico (-1:ℝ) 3 ×ˢ Set.Icc (-2:ℝ) 2) ∧
    ¬ M 3 2 ∧ ¬ M 3 (-2) ∧ ¬ M 3 0 ∧ M (-1) (-2) ∧ ¬ M 1 3 := by
  refine ⟨abs_le, ?_, ?_, ?_, ?_, ?_, ?_⟩
  · simp only [M, Set.mem_prod, Set.mem_Ico, Set.mem_Icc, abs_le, and_assoc]
  all_goals norm_num [M, abs_le]

/-- Primer 5, korak 7, RACUN: širina 3 − (−1) = 4, višina 2 − (−2) = 4, ploščina 4·4 = 16; mera množice M je
16, enako kot zaprtega pravokotnika (robovi ne vplivajo).
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#primer5-ploscina
besedilo: »Ploščina: pravokotnik je širok $3 - (-1) = 4$ in visok $2 - (-2) = 4$, zato meri ploščina $4 \cdot 4 = 16$. Robovi so črte brez širine, zato na ploščino ne vplivajo.« -/
theorem p5_ploscina : (3:ℝ) - (-1) = 4 ∧ (2:ℝ) - (-2) = 4 ∧ ((3:ℝ) - (-1)) * (2 - (-2)) = 16 ∧
    volume (Set.Ico (-1:ℝ) 3 ×ˢ Set.Icc (-2:ℝ) 2) = 16 ∧
    volume (Set.Icc (-1:ℝ) 3 ×ˢ Set.Icc (-2:ℝ) 2) = 16 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, ?_⟩
  · rw [Measure.volume_eq_prod, Measure.prod_prod, Real.volume_Ico, Real.volume_Icc,
      ← ENNReal.ofReal_mul (by norm_num)]
    norm_num
  · rw [Measure.volume_eq_prod, Measure.prod_prod, Real.volume_Icc, Real.volume_Icc,
      ← ENNReal.ofReal_mul (by norm_num)]
    norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 2, Na sliki: razdalja ni vsota katet (4 + 3 = 7 ≠ 5); razdalja je krajša od poti po
kvadratkih, razen če ležita točki na isti vodoravnici ali navpičnici.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#napaka-vsota
besedilo: »Razdalja je vedno krajša od poti po kvadratkih, razen če ležita točki na isti vodoravnici ali navpičnici.« -/
theorem napaka_vsota (a b : ℝ) (ha : a ≠ 0) (hb : b ≠ 0) : (4:ℝ) + 3 ≠ 5 ∧ √(a ^ 2 + b ^ 2) < |a| + |b| ∧
    √(a ^ 2 + 0 ^ 2) = |a| + |0| := by
  refine ⟨by norm_num, ?_, ?_⟩
  · rw [Real.sqrt_lt' (by positivity)]
    have h1 : 0 < |a| := abs_pos.mpr ha
    have h2 : 0 < |b| := abs_pos.mpr hb
    nlinarith [sq_abs a, sq_abs b, mul_pos h1 h2]
  · simp [Real.sqrt_sq_eq_abs]

/-- Predpostavki `napaka_vsota` se dasta izpolniti (a = 4, b = 3). -/
example : (4:ℝ) ≠ 0 ∧ (3:ℝ) ≠ 0 := by norm_num

/-- Pogoste napake 3: (x_B − x_A)/2 ni koordinata sredine: za 2 in 8 je (8 − 2)/2 = 3 ≠ 5.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#napaka-sredina
besedilo: »$\dfrac{x_B - x_A}{2}$ je polovica dolžine v smeri $x$, ne koordinata sredine.« -/
theorem napaka_sredina : ((8:ℝ) - 2) / 2 = 3 ∧ (3:ℝ) ≠ (2 + 8) / 2 := by norm_num

/-- Pogoste napake 5: (3, −2) in (−2, 3) sta različni točki.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#napaka-zamenjane
besedilo: »Točka $(-2, 3)$ je povsem druga točka.« -/
theorem napaka_zamenjane : ((3:ℝ), (-2:ℝ)) ≠ ((-2:ℝ), (3:ℝ)) := by
  intro h; have := congrArg Prod.fst h; norm_num at this

/-! ## Za maturo -/

/-- Naloga 1, RACUN: √((x_B − 2)² + (5 − (−1))²) = 10 ⇔ (x_B − 2)² + 36 = 100 ⇔ (x_B − 2)² = 64 (100 − 36 = 64)
⇔ x_B = 10 ali x_B = −6.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#naloga1
besedilo: »Odgovor: $x_B = 10$ ali $x_B = -6$, torej $B(10, 5)$ ali $B(-6, 5)$.« -/
theorem m1 (x : ℝ) : (d 2 (-1) x 5 = 10 ↔ (x - 2) ^ 2 + 36 = 100) ∧ ((x - 2) ^ 2 + 36 = 100 ↔ (x - 2) ^ 2 = 64) ∧
    ((x - 2) ^ 2 = 64 ↔ x = 10 ∨ x = -6) ∧ (100:ℝ) - 36 = 64 := by
  refine ⟨?_, ⟨fun h => by linarith, fun h => by linarith⟩, ?_, by norm_num⟩
  · unfold d
    rw [show ((5:ℝ) - (-1)) ^ 2 = 36 by norm_num, Real.sqrt_eq_iff_mul_self_eq (by positivity) (by norm_num)]
    constructor <;> intro h <;> linarith
  · constructor
    · intro h
      have : (x - 10) * (x + 6) = 0 := by linear_combination h
      rcases mul_eq_zero.mp this with h0 | h0
      · left; linarith
      · right; linarith
    · rintro (rfl | rfl) <;> norm_num

/-- Naloga 2 a), RACUN: d(A, B) = √((7 − (−1))² + (3 − (−3))²) = √(64 + 36) = √100 = 10, S_AB((−1 + 7)/2, (−3 + 3)/2)
= (3, 0).
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#naloga2a
besedilo: »$d(A, B) = \sqrt{(7 - (-1))^2 + (3 - (-3))^2} = \sqrt{64 + 36} = \sqrt{100} = 10$. 2. a) $S_{AB}\left(\dfrac{-1 + 7}{2}, \dfrac{-3 + 3}{2}\right) = S_{AB}(3, 0)$.« -/
theorem m2_a : d (-1) (-3) 7 3 = √(64 + 36) ∧ √(64 + 36 : ℝ) = √100 ∧ √(100:ℝ) = 10 ∧
    ((-1:ℝ) + 7) / 2 = 3 ∧ ((-3:ℝ) + 3) / 2 = 0 := by
  refine ⟨by unfold d; norm_num, by norm_num, ?_, by norm_num, by norm_num⟩
  rw [show (100:ℝ) = 10 ^ 2 by norm_num, koren_kvadrata 10 (by norm_num)]

/-- Naloga 2 b), RACUN: d(A, C) = √(4 + 121) = √125 = 5√5 in d(B, C) = √(100 + 25) = √125 = 5√5, kraka sta enaka.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#naloga2b
besedilo: »$d(A, C) = \sqrt{(-3 - (-1))^2 + (8 - (-3))^2} = \sqrt{4 + 121} = \sqrt{125} = 5\sqrt{5}$. 4. b) $d(B, C) = \sqrt{(-3 - 7)^2 + (8 - 3)^2} = \sqrt{100 + 25} = \sqrt{125} = 5\sqrt{5}$. Kraka $AC$ in $BC$ sta enako dolga, zato je trikotnik enakokrak z osnovnico $AB$.« -/
theorem m2_b : d (-1) (-3) (-3) 8 = √(4 + 121) ∧ d 7 3 (-3) 8 = √(100 + 25) ∧ √(4 + 121 : ℝ) = √125 ∧
    √(100 + 25 : ℝ) = √125 ∧ √(125:ℝ) = 5 * √5 ∧ d (-1) (-3) (-3) 8 = d 7 3 (-3) 8 := by
  have h5 : √(125:ℝ) = 5 * √5 := by
    rw [show (125:ℝ) = 5 ^ 2 * 5 by norm_num, Real.sqrt_mul (by norm_num), koren_kvadrata 5 (by norm_num)]
  refine ⟨by unfold d; norm_num, by unfold d; norm_num, by norm_num, by norm_num, h5, ?_⟩
  unfold d; norm_num

/-- Naloga 2 c), RACUN: u = (8, 6), v = (−2, 11), S = ½|8·11 − 6·(−2)| = ½|88 + 12| = 50; višina 2S/d(A, B) =
100/10 = 10; d(C, S_AB) = √(36 + 64) = 10 in CS_AB ⊥ AB ((6, −8)·(8, 6) = 0), višina pade v razpolovišče.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#naloga2c
besedilo: »ploščina je $50$ kvadratnih enot, višina na $AB$ meri $10$ enot.« -/
theorem m2_c : ploscina (-1) (-3) 7 3 (-3) 8 = 50 ∧ (1 / 2 : ℝ) * |88 + 12| = 50 ∧ (2:ℝ) * 50 / 10 = 10 ∧
    d (-3) 8 3 0 = 10 ∧ ((3:ℝ) - (-3)) * (7 - (-1)) + (0 - 8) * (3 - (-3)) = 0 := by
  refine ⟨?_, by norm_num [abs_of_pos], by norm_num, ?_, by norm_num⟩
  · unfold ploscina; norm_num [abs_of_pos]
  · rw [d, show ((3:ℝ) - (-3)) ^ 2 + (0 - 8) ^ 2 = 10 ^ 2 by norm_num, koren_kvadrata 10 (by norm_num)]

/-! ## Preveri se -/

/-- Preveri se 1: A(−2, 3), B(4, 3) ležita na vodoravnici y = 3 > 0 (nad osjo x), dolžina |4 − (−2)| = 6
(ne 2).
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#preveri1
besedilo: »Obe točki imata $y = 3$, zato ležita na vodoravnici nad osjo $x$. Dolžina je $|4 - (-2)| = 6$.« -/
theorem preveri_1 : d (-2) 3 4 3 = 6 ∧ (0:ℝ) < 3 ∧ (4:ℝ) + (-2) ≠ 6 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  rw [(razdalja_ob_osi (-2) 4 3).1]; norm_num [abs_of_pos]

/-- Preveri se 2: d(O, T(7, 7)) = √98 ≈ 9,9, najbližje celo število je 10 (|√98 − 10| < ½, √98 < 10); ne 7, 14
ali 49.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#preveri2
besedilo: »$d = \sqrt{49 + 49} = \sqrt{98} \approx 9{,}9$, kar je skoraj $10$. Ker je $\sqrt{100} = 10$, je razdalja malo manj kot $10$.« -/
theorem preveri_2 : d 0 0 7 7 = √98 ∧ |√(98:ℝ) - 10| < 1 / 2 ∧ √(98:ℝ) < 10 ∧ |√(98:ℝ) - 9.9| < 0.05 ∧
    1 / 2 < |√(98:ℝ) - 7| ∧ 1 / 2 < |√(98:ℝ) - 14| := by
  have h1 : (9.895:ℝ) < √98 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have h2 : √98 < (9.9:ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by unfold d; norm_num, ?_, by linarith, ?_, ?_, ?_⟩
  · rw [abs_sub_lt_iff]; constructor <;> linarith
  · rw [abs_sub_lt_iff]; constructor <;> linarith
  · rw [abs_of_pos (by linarith)]; linarith
  · rw [abs_of_neg (by linarith)]; linarith

/-- Preveri se 4: iz S_AB(1, −2) in A(−3, 4): x_B = 2·1 − (−3) = 5, y_B = 2·(−2) − 4 = −8; preizkus
(−3 + 5)/2 = 1, (4 + (−8))/2 = −2; (−1, 1), (4, −6), (−1, 0) niso B.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#preveri4
besedilo: »$x_B = 2 \cdot 1 - (-3) = 5$ in $y_B = 2 \cdot (-2) - 4 = -8$. Preizkus: $\dfrac{-3 + 5}{2} = 1$ in $\dfrac{4 + (-8)}{2} = -2$.« -/
theorem preveri_4 : (2:ℝ) * 1 - (-3) = 5 ∧ (2:ℝ) * (-2) - 4 = -8 ∧ ((-3:ℝ) + 5) / 2 = 1 ∧
    ((4:ℝ) + (-8)) / 2 = -2 ∧ ((-3:ℝ) + (-1)) / 2 ≠ 1 ∧ ((-3:ℝ) + 4) / 2 ≠ 1 ∧ ((4:ℝ) + 0) / 2 ≠ -2 := by
  norm_num

/-- Preveri se 5: A(−1, −1), B(1, 2), C(5, 8): u = (2, 3), v = (6, 9), S = ½|2·9 − 3·6| = 0, točke so kolinearne
(C = A + 3·(B − A)); ½·2·9 = 9 ni ploščina; A je v III. kvadrantu.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#preveri5
besedilo: »$u_1 = 2$, $u_2 = 3$, $v_1 = 6$, $v_2 = 9$; $S = \frac{1}{2}|2 \cdot 9 - 3 \cdot 6| = 0$. Točke so kolinearne« -/
theorem preveri_5 : ploscina (-1) (-1) 1 2 5 8 = 0 ∧
    ((5:ℝ) = -1 + 3 * (1 - (-1)) ∧ (8:ℝ) = -1 + 3 * (2 - (-1))) ∧ (1 / 2 : ℝ) * 2 * 9 = 9 ∧
    kvadrant 3 (-1) (-1) := by
  refine ⟨by unfold ploscina; norm_num, by norm_num, by norm_num,
    Or.inr (Or.inr (Or.inl ⟨rfl, by norm_num, by norm_num⟩))⟩

/-- Preveri se 6: točke (−2, y) niso v množici −2 < x ≤ 1, točke (1, y) so; pri »ali« (x > −2 ali x ≤ 1) je to
vsaka točka ravnine.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#preveri6
besedilo: »Levi rob je črtkan ($x > -2$), desni poln ($x \le 1$).« -/
theorem preveri_6 (x : ℝ) : ¬ ((-2:ℝ) < -2 ∧ (-2:ℝ) ≤ 1) ∧ ((-2:ℝ) < 1 ∧ (1:ℝ) ≤ 1) ∧ (x > -2 ∨ x ≤ 1) := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  rcases le_or_gt x 1 with h | h
  · right; exact h
  · left; linarith

/-- Preveri se 7, RACUN: celoštevilske točke z −1 ≤ x < 3 in |y| < 2 so natanko x ∈ {−1, 0, 1, 2},
y ∈ {−1, 0, 1}; teh je 4·3 = 12.
trditev: MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini#preveri7
besedilo: »Za $x$ pridejo v poštev $-1$, $0$, $1$, $2$ (štiri vrednosti), za $y$ pa $-1$, $0$, $1$ (tri vrednosti). Vseh točk je $4 \cdot 3 = 12$.« -/
theorem preveri_7 : (∀ x y : ℤ, (-1 ≤ x ∧ x < 3 ∧ |y| < 2) ↔ (x, y) ∈ Finset.Ico (-1:ℤ) 3 ×ˢ Finset.Ioo (-2:ℤ) 2) ∧
    (Finset.Ico (-1:ℤ) 3 ×ˢ Finset.Ioo (-2:ℤ) 2).card = 12 ∧ (4:ℕ) * 3 = 12 := by
  refine ⟨fun x y => ?_, by decide, by norm_num⟩
  simp only [Finset.mem_product, Finset.mem_Ico, Finset.mem_Ioo, abs_lt]
  constructor
  · rintro ⟨h1, h2, h3, h4⟩; exact ⟨⟨h1, h2⟩, h3, h4⟩
  · rintro ⟨⟨h1, h2⟩, h3, h4⟩; exact ⟨h1, h2, h3, h4⟩

end Evklid.Lekcije.MAT_SS_1.PravokotniKoordinatniSistemVRavnini
