/-
vir: content/lessons/MAT-SS-2/podobnost.md
sha256: a8239470f27ed3f3a976b3c469ee7ba4e1a42cc2ac02d122a7a749a608b447bf
Ni v Leanu: risbe, simulacija, preglednica skladnost/podobnost kot opis (dokazano: skladna ⟹ podobna, podobna ⟹
enaki koti in razmerja stranic), Razlaga 2 »najkrajša stranica ustreza najkrajši« (opis), izrek SSK (dokaz s
kosinusnim izrekom še ni narejen; dokazani so KK, SSS, SKS iz Mathliba), skica in utemeljitev podobnosti v Primeru 2
in Preveri se 2 (oko–kovanec–Luna: da sta trikotnika podobna po KK, je opis skice; dokazano je sorazmerje in račun)
ter v Nalogi 1 za maturo (da MN ∥ AB da središčni razteg s središčem C, je opis; dokazano je, da se ploščina pri raztegu pomnoži s k², in računi 27 cm² in 15 cm²; trapez kot razlika
trikotnikov je opis), analogije (fotokopirni stroj, projektor, zemljevid, sence; dokazani so računi), Postopek in
Pazi na (navodila), točkovanje. Ploščina je dokazana na dva načina: kot Lebesgueova mera slike poljubne množice v
ravnini pri središčnem raztegu (`razteg_ploscina`) in s formulo ½|…| za trikotnik v koordinatah
(`ploscina_trikotnika_razteg`); za dva splošna podobna trikotnika (ne razteg) ploščina kot mera ni dokazana
(zahtevno, še ni dokazano), dokazana je formula ½·(kz)·(kv) = k²·½·zv. Geometrijske trditve so zapisane s točkami
evklidskega prostora (`∠`, `dist`, Mathlibov `Similar` s koeficientom k > 0, `Sbtw` za točko D med A in B);
primeri pogojev so v ravnini ℂ. V `evklid_visinski` in `trije_podobni` je predpostavljeno, da nožišče višine D leži
strogo med A in B (Sbtw); da to v pravokotnem trikotniku vedno velja, tu ni dokazano.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.Podobnost

open Real EuclideanGeometry Set

variable {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P] [NormedAddTorsor V P]

/-! ## Podobni trikotniki -/

/-- Razlaga 1 (definicija): če je △A'B'C' ∼ △ABC, so ustrezni koti enaki in obstaja k > 0, da je a' = k·a,
b' = k·b, c' = k·c (a = |BC|, b = |CA|, c = |AB|); skladna trikotnika (k = 1) sta podobna.
trditev: MAT-SS-2/podobnost#definicija
besedilo: »Število $k$ je **koeficient podobnosti**. Če je $k > 1$, je drugi trikotnik večji, če je $k < 1$, je manjši. Pri $k = 1$ sta trikotnika skladna.« -/
theorem definicija (A B C A' B' C' : P) :
    (Similar ![A', B', C'] ![A, B, C] →
      (∠ A' B' C' = ∠ A B C ∧ ∠ B' C' A' = ∠ B C A ∧ ∠ C' A' B' = ∠ C A B) ∧
      ∃ k : ℝ, 0 < k ∧ dist B' C' = k * dist B C ∧ dist C' A' = k * dist C A ∧ dist A' B' = k * dist A B) ∧
    (Congruent ![A', B', C'] ![A, B, C] → Similar ![A', B', C'] ![A, B, C]) := by
  refine ⟨fun h => ⟨h.angle_eq_all, ?_⟩, fun h => h.similar⟩
  rw [similar_iff_exists_pos_dist_eq] at h
  obtain ⟨r, hr, h⟩ := h
  exact ⟨r, hr, by simpa using h 1 2, by simpa using h 2 0, by simpa using h 0 1⟩

/-- Razlaga 3 in Ustno vprašanje 1: če se trikotnika ujemata v dveh kotih, se ujemata tudi v tretjem (vsota kotov
je π = 180°).
trditev: MAT-SS-2/podobnost#tretji-kot
besedilo: »KK:** ujemata se v dveh kotih. Tretji kot je potem samodejno enak, saj je vsota kotov $180^\circ$.« -/
theorem tretji_kot (A B C A' B' C' : P) (hAB : B ≠ A) (hAB' : B' ≠ A') (h₁ : ∠ A B C = ∠ A' B' C')
    (h₂ : ∠ B C A = ∠ B' C' A') : ∠ C A B = ∠ C' A' B' := by
  have s := angle_add_angle_add_angle_eq_pi C hAB
  have s' := angle_add_angle_add_angle_eq_pi C' hAB'
  linarith

/-- Pomožna trditev: trikotnik s pravim kotom pri b (in a ≠ b, c ≠ b) ni izrojen (točke niso kolinearne).
pomozno -/
theorem nekolinearne (a b c : P) (h : ∠ a b c = π / 2) (ha : a ≠ b) (hc : c ≠ b) : ¬ Collinear ℝ {a, b, c} := by
  intro hcol
  rcases collinear_iff_eq_or_eq_or_angle_eq_zero_or_angle_eq_pi.mp hcol with h1 | h1 | h1 | h1
  · exact ha h1
  · exact hc h1
  · rw [h] at h1; linarith [pi_pos]
  · rw [h] at h1; linarith [pi_pos]

/-- Primer pogojev: v ravnini ℂ imajo točke 1, 0, i pravi kot pri 0.
trditev: MAT-SS-2/podobnost#primer-pravi-kot
besedilo: »Točkovanje:** 1 točka za podobnost trikotnikov in $k = \dfrac{3}{2}$,« -/
theorem primer_pravi_kot : ∠ (1:ℂ) 0 Complex.I = π / 2 := by
  rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
  simp [Complex.inner]

/-- Predpostavke `tretji_kot` in `nekolinearne` se dajo izpolniti (trikotnik 1, 0, i v ℂ). -/
example : (0:ℂ) ≠ 1 ∧ ∠ (1:ℂ) 0 Complex.I = π / 2 ∧ (1:ℂ) ≠ 0 ∧ Complex.I ≠ 0 :=
  ⟨zero_ne_one, primer_pravi_kot, one_ne_zero, Complex.I_ne_zero⟩

/-- Razlaga 3 (izrek KK) in Povzetek: nekolinearna trikotnika, ki se ujemata v dveh kotih, sta podobna, ujemata pa
se tudi v tretjem kotu.
trditev: MAT-SS-2/podobnost#izrek-kk
besedilo: »Trikotnika se ujemata v dveh kotih, zato sta po izreku KK podobna.« -/
theorem izrek_KK {A B C A' B' C' : P} (h : ¬ Collinear ℝ {A, B, C}) (h₁ : ∠ A B C = ∠ A' B' C')
    (h₂ : ∠ B C A = ∠ B' C' A') : Similar ![A, B, C] ![A', B', C'] ∧ ∠ C A B = ∠ C' A' B' :=
  ⟨similar_of_angle_angle h h₁ h₂, (similar_of_angle_angle h h₁ h₂).angle_eq_all.2.2⟩

/-- Predpostavke `izrek_KK` se dajo izpolniti (trikotnik 1, 0, i s samim seboj). -/
example : ¬ Collinear ℝ {(1:ℂ), 0, Complex.I} :=
  nekolinearne 1 0 Complex.I primer_pravi_kot one_ne_zero Complex.I_ne_zero

/-- Razlaga 3 (izrek SSS): če so razmerja vseh treh parov ustreznih stranic enaka, sta trikotnika podobna.
trditev: MAT-SS-2/podobnost#izrek-sss
besedilo: »Po izreku SSS sta trikotnika podobna, če so razmerja vseh treh parov ustreznih stranic enaka.« -/
theorem izrek_SSS {A B C A' B' C' : P} (h : dist A B ≠ 0) (h' : dist A' B' ≠ 0)
    (e1 : dist A B * dist B' C' = dist B C * dist A' B') (e2 : dist A B * dist C' A' = dist C A * dist A' B') :
    Similar ![A, B, C] ![A', B', C'] :=
  similar_of_dist_mul_eq_dist_mul_eq h h' e1 e2

/-- Predpostavke `izrek_SSS` se dajo izpolniti (trikotnik 1, 0, i s samim seboj). -/
example : dist (1:ℂ) 0 ≠ 0 ∧ dist (1:ℂ) 0 * dist (0:ℂ) Complex.I = dist (0:ℂ) Complex.I * dist (1:ℂ) 0 ∧
    dist (1:ℂ) 0 * dist Complex.I (1:ℂ) = dist Complex.I (1:ℂ) * dist (1:ℂ) 0 := by
  refine ⟨by simp, by ring, by ring⟩

/-- Razlaga 3 (izrek SKS): nekolinearna trikotnika z enakim razmerjem dveh parov stranic in enakim kotom med njima
sta podobna.
trditev: MAT-SS-2/podobnost#izrek-sks
besedilo: »SKS:** razmerje dveh parov ustreznih stranic je enako in kota med njima sta enaka.« -/
theorem izrek_SKS {A B C A' B' C' : P} (h : ¬ Collinear ℝ {A, B, C}) (h' : ¬ Collinear ℝ {A', B', C'})
    (hk : ∠ A B C = ∠ A' B' C') (hd : dist A B * dist B' C' = dist B C * dist A' B') :
    Similar ![A, B, C] ![A', B', C'] :=
  similar_of_side_angle_side h h' hk hd

/-- Predpostavke `izrek_SKS` se dajo izpolniti (trikotnik 1, 0, i s samim seboj). -/
example : ¬ Collinear ℝ {(1:ℂ), 0, Complex.I} ∧
    dist (1:ℂ) 0 * dist (0:ℂ) Complex.I = dist (0:ℂ) Complex.I * dist (1:ℂ) 0 :=
  ⟨nekolinearne 1 0 Complex.I primer_pravi_kot one_ne_zero Complex.I_ne_zero, by ring⟩

/-! ## Ploščine -/

/-- Razlaga 4, Drugače: Bolj natančno in Ustno vprašanje 3: ploščina ½·z·v trikotnika z osnovnico z in višino v
se pri k-krat daljših dolžinah pomnoži s k²: ½·(kz)·(kv) = k²·(½·z·v); Premisli 1: 3² = 9; simulacija:
2² = 4, 0,5² = 0,25.
trditev: MAT-SS-2/podobnost#ploscina-k2
besedilo: »V simulaciji spodaj (»Podobnost in središčni razteg«) nastavi k = 2 in nato k = 0,5. Opazuj, da je razmerje stranic $k$, razmerje ploščin pa $4$ oziroma $0{,}25$, torej $k^2$. Kje glede na središče (v simulaciji O) leži slika, ko nastaviš negativen k?« -/
theorem ploscina_k2 :
    (∀ k z v : ℝ, (k * z) * (k * v) / 2 = k ^ 2 * (z * v / 2)) ∧ (3:ℝ) ^ 2 = 9 ∧ (2:ℝ) ^ 2 = 4 ∧
    (0.5:ℝ) ^ 2 = 0.25 :=
  ⟨fun k z v => by ring, by norm_num, by norm_num, by norm_num⟩

/-- Ploščina trikotnika z oglišči A, B, C v koordinatah: ½·|(x_B − x_A)(y_C − y_A) − (x_C − x_A)(y_B − y_A)|. -/
noncomputable def pl (A B C : ℝ × ℝ) : ℝ :=
  |(B.1 - A.1) * (C.2 - A.2) - (C.1 - A.1) * (B.2 - A.2)| / 2

/-- Razlaga 8, Primer 5 in Povzetek: središčni razteg s središčem S(x_S, y_S) in koeficientom k slika točko (x, y)
v (x_S + k(x − x_S), y_S + k(y − y_S)); pri središču v izhodišču v (kx, ky).
trditev: MAT-SS-2/podobnost#razteg-koordinate
besedilo: »$$x' = x_S + k\,(x - x_S), \qquad y' = y_S + k\,(y - y_S)$$« -/
theorem razteg_koordinate (xS yS k x y : ℝ) :
    AffineMap.homothety ((xS, yS) : ℝ × ℝ) k (x, y) = (xS + k * (x - xS), yS + k * (y - yS)) ∧
    AffineMap.homothety ((0, 0) : ℝ × ℝ) k (x, y) = (k * x, k * y) := by
  constructor
  · rw [AffineMap.homothety_apply]; ext <;> simp <;> ring
  · rw [AffineMap.homothety_apply]; ext <;> simp

/-- Razlaga 8 in Povzetek: pri središčnem raztegu s koeficientom k se ploščina trikotnika pomnoži s k² (tudi za
negativen k).
trditev: MAT-SS-2/podobnost#ploscina-trikotnika-razteg
besedilo: »Zato je slika lika podobna liku s koeficientom podobnosti $|k|$, ploščina pa se pomnoži s $k^2$.« -/
theorem ploscina_trikotnika_razteg (S A B C : ℝ × ℝ) (k : ℝ) :
    pl (AffineMap.homothety S k A) (AffineMap.homothety S k B) (AffineMap.homothety S k C) = k ^ 2 * pl A B C := by
  simp only [pl, AffineMap.homothety_apply, vsub_eq_sub, vadd_eq_add, Prod.fst_add, Prod.snd_add, Prod.smul_fst,
    Prod.smul_snd, Prod.fst_sub, Prod.snd_sub, smul_eq_mul]
  rw [show (k * (B.1 - S.1) + S.1 - (k * (A.1 - S.1) + S.1)) * (k * (C.2 - S.2) + S.2 - (k * (A.2 - S.2) + S.2)) -
      (k * (C.1 - S.1) + S.1 - (k * (A.1 - S.1) + S.1)) * (k * (B.2 - S.2) + S.2 - (k * (A.2 - S.2) + S.2)) =
      k ^ 2 * ((B.1 - A.1) * (C.2 - A.2) - (C.1 - A.1) * (B.2 - A.2)) by ring, abs_mul,
    abs_of_nonneg (sq_nonneg k)]
  ring

/-- Razlaga 4 in 8 (ploščina kot mera): pri središčnem raztegu ravnine s koeficientom k se ploščina (Lebesgueova
mera) vsakega lika pomnoži s k².
trditev: MAT-SS-2/podobnost#razteg-ploscina
besedilo: »Zato je slika lika podobna liku s koeficientom podobnosti $|k|$, ploščina pa se pomnoži s $k^2$.« -/
theorem razteg_ploscina (S : EuclideanSpace ℝ (Fin 2)) (k : ℝ) (s : Set (EuclideanSpace ℝ (Fin 2))) :
    MeasureTheory.volume (AffineMap.homothety S k '' s) = ENNReal.ofReal (k ^ 2) * MeasureTheory.volume s := by
  rw [MeasureTheory.Measure.addHaar_image_homothety, finrank_euclideanSpace_fin, abs_of_nonneg (sq_nonneg k)]

/-! ## Evklidov in višinski izrek -/

/-- Razlaga 5–7, Drugače: Bolj natančno in Ustno vprašanje 2: v trikotniku ABC s pravim kotom pri C naj bo D nožišče
višine na hipotenuzo (D strogo med A in B, ∠ADC = 90°), c = |AB|, a = |BC|, b = |AC|, c_a = |DB|, c_b = |AD|,
v_c = |CD|. Tedaj velja Evklidov izrek a² = c·c_a, b² = c·c_b, višinski izrek v_c² = c_a·c_b, c = c_a + c_b in
Pitagorov izrek kot posledica a² + b² = c(c_a + c_b) = c².
trditev: MAT-SS-2/podobnost#evklid-visinski
besedilo: »$c = c_a + c_b$, višinski izrek $v_c^2 = c_a \cdot c_b$, Evklidov izrek $a^2 = c \cdot c_a$ in $b^2 = c \cdot c_b$« -/
theorem evklid_visinski {A B C D : P} (hD : Sbtw ℝ A D B) (hCD : ∠ A D C = π / 2) (hC : ∠ A C B = π / 2) :
    dist B C ^ 2 = dist A B * dist D B ∧ dist A C ^ 2 = dist A B * dist A D ∧
    dist C D ^ 2 = dist D B * dist A D ∧ dist A B = dist D B + dist A D ∧
    dist B C ^ 2 + dist A C ^ 2 = dist A B * (dist D B + dist A D) ∧
    dist A B * (dist D B + dist A D) = dist A B ^ 2 := by
  have hBD : ∠ B D C = π / 2 := by
    have := angle_add_angle_eq_pi_of_angle_eq_pi C hD.angle₁₂₃_eq_pi
    rw [angle_comm C D A, hCD] at this; rw [angle_comm]; linarith
  have h1 := dist_sq_eq_dist_mul_dist_of_angle_eq_pi_div_two' hD hCD hC
  have h2 := dist_sq_eq_dist_mul_dist_of_angle_eq_pi_div_two' hD.symm hBD (by rw [angle_comm]; exact hC)
  have h3 := dist_sq_eq_dist_mul_dist_of_angle_eq_pi_div_two hD hCD hC
  have h4 := dist_eq_add_dist_of_angle_eq_pi hD.angle₁₂₃_eq_pi
  have e2 : dist B C ^ 2 = dist A B * dist D B := by rw [h2, dist_comm B A, dist_comm B D]
  have e4 : dist A B = dist D B + dist A D := by rw [h4, dist_comm B D]; ring
  refine ⟨e2, h1, by rw [h3, dist_comm B D]; ring, e4, by rw [e2, h1]; ring, by rw [← e4]; ring⟩

/-- Pogoji izreka `evklid_visinski` se dajo izpolniti: v ℂ so A = 0, B = 25, D = 16, C = 16 + 12i (trikotnik z
risbe v razlagi).
trditev: MAT-SS-2/podobnost#primer-risba
besedilo: »Višina.** Uporabimo višinski izrek: $v_c^2 = c_a \cdot c_b = 9 \cdot 16 = 144$, zato $v_c = \sqrt{144} = 12\,\text{cm}$.« -/
theorem primer_risba :
    Sbtw ℝ (0:ℂ) 16 25 ∧ ∠ (0:ℂ) 16 (16 + 12 * Complex.I) = π / 2 ∧
    ∠ (0:ℂ) (16 + 12 * Complex.I) 25 = π / 2 := by
  refine ⟨⟨⟨16 / 25, ⟨by norm_num, by norm_num⟩, ?_⟩, by norm_num, by norm_num⟩, ?_, ?_⟩
  · rw [AffineMap.lineMap_apply]; apply Complex.ext <;> simp
  · rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [Complex.inner]
  · rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [Complex.inner]; norm_num

/-- Predpostavke izrekov `evklid_visinski` in `trije_podobni` se dajo izpolniti (`primer_risba`). -/
example : ∃ A B C D : ℂ, Sbtw ℝ A D B ∧ ∠ A D C = π / 2 ∧ ∠ A C B = π / 2 :=
  ⟨0, 25, 16 + 12 * Complex.I, 16, primer_risba⟩

/-- Pomožna trditev: nenegativni števili z enakima kvadratoma sta enaki.
pomozno -/
theorem iz_kvadratov {x y : ℝ} (hx : 0 ≤ x) (hy : 0 ≤ y) (h : x ^ 2 = y ^ 2) : x = y :=
  (pow_left_inj₀ hx hy two_ne_zero).mp h

/-- Predpostavke `iz_kvadratov` se dajo izpolniti (x = y = 1). -/
example : (0:ℝ) ≤ 1 ∧ (1:ℝ) ^ 2 = 1 ^ 2 := by norm_num

/-- Razlaga 5 in Drugače: Bolj natančno, Na sliki: višina na hipotenuzo razdeli pravokotni trikotnik ABC na
trikotnika, ki sta podobna drug drugemu in velikemu: △ABC ∼ △CBD, △ABC ∼ △ACD in △ACD ∼ △CBD.
trditev: MAT-SS-2/podobnost#trije-podobni
besedilo: »zato je $c = c_a + c_b$. Višina razdeli trikotnik na dva manjša pravokotna trikotnika, ki sta podobna drug drugemu in tudi velikemu trikotniku. Dokaz je spodaj v razdelku »Drugače: Bolj natančno«.« -/
theorem trije_podobni {A B C D : P} (hD : Sbtw ℝ A D B) (hCD : ∠ A D C = π / 2) (hC : ∠ A C B = π / 2) :
    Similar ![A, B, C] ![C, B, D] ∧ Similar ![A, B, C] ![A, C, D] ∧ Similar ![A, C, D] ![C, B, D] := by
  obtain ⟨ea, eb, ev, ec, -, -⟩ := evklid_visinski hD hCD hC
  have hca : 0 < dist D B := dist_pos.mpr hD.ne_right
  have hcb : 0 < dist A D := dist_pos.mpr hD.left_ne
  have hc : 0 < dist A B := by rw [ec]; linarith
  have ha : 0 < dist B C := by
    have : 0 < dist B C ^ 2 := by rw [ea]; positivity
    exact lt_of_le_of_ne dist_nonneg (fun h => by rw [← h] at this; norm_num at this)
  have hb : 0 < dist A C := by
    have : 0 < dist A C ^ 2 := by rw [eb]; positivity
    exact lt_of_le_of_ne dist_nonneg (fun h => by rw [← h] at this; norm_num at this)
  have hv := dist_nonneg (x := C) (y := D)
  -- c·v = a·b
  have k1 : dist A B * dist C D = dist B C * dist A C := iz_kvadratov (by positivity) (by positivity)
    (by rw [mul_pow, mul_pow, ev, ea, eb]; ring)
  -- b·c_a = v·a
  have k2 : dist A C * dist D B = dist C D * dist B C := iz_kvadratov (by positivity) (by positivity)
    (by rw [mul_pow, mul_pow, ev, ea, eb]; ring)
  -- b·v = c_b·a
  have k3 : dist A C * dist C D = dist A D * dist B C := iz_kvadratov (by positivity) (by positivity)
    (by rw [mul_pow, mul_pow, ev, ea, eb]; ring)
  refine ⟨?_, ?_, ?_⟩
  · refine similar_of_dist_mul_eq_dist_mul_eq hc.ne' (by rw [dist_comm]; exact ha.ne') ?_ ?_
    · rw [dist_comm C B, dist_comm B D]; nlinarith [ea]
    · rw [dist_comm D C, dist_comm C A, dist_comm C B]; linarith [k1]
  · refine similar_of_dist_mul_eq_dist_mul_eq hc.ne' hb.ne' ?_ ?_
    · linarith [k1]
    · rw [dist_comm D A, dist_comm C A]; nlinarith [eb]
  · refine similar_of_dist_mul_eq_dist_mul_eq hb.ne' (by rw [dist_comm]; exact ha.ne') ?_ ?_
    · rw [dist_comm C B, dist_comm B D]; linarith [k2]
    · rw [dist_comm D C, dist_comm D A, dist_comm C B]; linarith [k3]

/-- Predpostavke trditve `trije_podobni` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ A B C D : ℂ, Sbtw ℝ A D B ∧ ∠ A D C = π / 2 ∧ ∠ A C B = π / 2 :=
    ⟨0, 25, 16 + 12 * Complex.I, 16, primer_risba⟩
  trije_podobni (hD := w.choose_spec.choose_spec.choose_spec.choose_spec.1) (hCD := w.choose_spec.choose_spec.choose_spec.choose_spec.2.1) (hC := w.choose_spec.choose_spec.choose_spec.choose_spec.2.2)

/-- Razlaga 7 (risba) in Preveri se 1: 15² = 25·9, 20² = 25·16 in 12² = 9·16.
trditev: MAT-SS-2/podobnost#risba
besedilo: »Na risbi zgoraj: $15^2 = 25 \cdot 9$, $20^2 = 25 \cdot 16$ in $12^2 = 9 \cdot 16$.« -/
theorem risba : (15:ℝ) ^ 2 = 25 * 9 ∧ (20:ℝ) ^ 2 = 25 * 16 ∧ (12:ℝ) ^ 2 = 9 * 16 := by norm_num

/-- Razlaga 7, Premisli 2: če je c_a = c_b, je iz v_c² = c_a·c_b višina v_c = c_a, iz a² = c·c_a = b² pa a = b
(enakokraki pravokotni trikotnik).
trditev: MAT-SS-2/podobnost#premisli2
besedilo: »Iz $v_c^2 = c_a \cdot c_a = c_a^2$ sledi $v_c = c_a$: višina je enako dolga kot vsak odsek. Kateti sta enaki ($a^2 = c \cdot c_a = b^2$), zato je trikotnik enakokrak pravokotni, kota ob hipotenuzi sta $45^\circ$.« -/
theorem premisli2 (a b c ca cb v : ℝ) (hv : 0 ≤ v) (hca : 0 ≤ ca) (ha : 0 ≤ a) (hb : 0 ≤ b) (he : ca = cb)
    (h1 : v ^ 2 = ca * cb) (h2 : a ^ 2 = c * ca) (h3 : b ^ 2 = c * cb) : v = ca ∧ a = b :=
  ⟨iz_kvadratov hv hca (by rw [h1, he]; ring), iz_kvadratov ha hb (by rw [h2, h3, he])⟩

/-- Predpostavke `premisli2` se dajo izpolniti (a = b = 1, c = 2, c_a = c_b = v = 1/2). -/
example : (0:ℝ) ≤ 1 / 2 ∧ (0:ℝ) ≤ 1 ∧ (1 / 2 : ℝ) = 1 / 2 ∧ (1 / 2 : ℝ) ^ 2 = 1 / 2 * (1 / 2) ∧
    (1:ℝ) ^ 2 = 2 * (1 / 2) := by norm_num

/-- Predpostavke trditve `premisli2` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 1 / 2 ∧ (0:ℝ) ≤ 1 ∧ (1 / 2 : ℝ) = 1 / 2 ∧ (1 / 2 : ℝ) ^ 2 = 1 / 2 * (1 / 2) ∧ (1:ℝ) ^ 2 = 2 * (1 / 2) := by norm_num
  premisli2 (hv := w.1) (hca := w.2.1) (ha := w.1) (hb := w.1) (he := w.2.2.1) (h1 := w.2.2.2.1) (h2 := w.2.2.2.2) (h3 := w.2.2.2.1)

/-- Razlaga 7, Premisli 2: v enakokrakem pravokotnem trikotniku (|CA| = |CB|, pravi kot pri C) sta kota ob
hipotenuzi enaka (kota ob osnovnici enakokrakega trikotnika) in skupaj merita π − π/2, zato je vsak π/4 = 45°.
trditev: MAT-SS-2/podobnost#premisli2-koti
besedilo: »Kateti sta enaki ($a^2 = c \cdot c_a = b^2$), zato je trikotnik enakokrak pravokotni, kota ob hipotenuzi sta $45^\circ$.« -/
theorem premisli2_koti {A B C : P} (hA : A ≠ C) (hd : dist C A = dist C B) (hC : ∠ A C B = π / 2) :
    ∠ C A B = π / 4 ∧ ∠ C B A = π / 4 := by
  have he := angle_eq_angle_of_dist_eq hd
  have hs := angle_add_angle_add_angle_eq_pi B hA
  rw [angle_comm A B C, angle_comm B C A, hC, ← he] at hs
  exact ⟨by linarith, by rw [← he]; linarith⟩

/-- Predpostavke `premisli2_koti` se dajo izpolniti: v ℂ so C = 0, A = 1, B = i. -/
example : (1:ℂ) ≠ 0 ∧ dist (0:ℂ) 1 = dist (0:ℂ) Complex.I ∧ ∠ (1:ℂ) 0 Complex.I = π / 2 :=
  ⟨one_ne_zero, by simp [dist_eq_norm], primer_pravi_kot⟩

/-! ## Središčni razteg -/

/-- Predpostavke trditve `premisli2_koti` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℂ) ≠ 0 ∧ dist (0:ℂ) 1 = dist (0:ℂ) Complex.I ∧ ∠ (1:ℂ) 0 Complex.I = π / 2 :=
    ⟨one_ne_zero, by simp [dist_eq_norm], primer_pravi_kot⟩
  premisli2_koti (hA := w.1) (hd := w.2.1) (hC := w.2.2)

/-- Razlaga 8 in Povzetek: središčni razteg s središčem S in koeficientom k: |ST'| = |k|·|ST|, daljica se preslika
v |k|-krat daljšo (|A'B'| = |k|·|AB|) in je z njo vzporedna (A'B'→ = k·AB→), S se preslika vase, ST'→ = k·ST→ (pri k > 0 na poltraku ST, pri k < 0 na
nasprotni strani), pri k = 1 ostane vse na mestu, pri k = −1 je razteg zrcaljenje čez točko S.
trditev: MAT-SS-2/podobnost#razteg
besedilo: »Pri $|k| > 1$ se lik poveča, pri $|k| < 1$ se pomanjša. Pri $k = 1$ ostane vse na mestu, pri $k = -1$ je razteg zrcaljenje čez točko $S$.« -/
theorem razteg (S T A B : P) (k : ℝ) :
    dist (AffineMap.homothety S k T) S = |k| * dist S T ∧
    dist (AffineMap.homothety S k A) (AffineMap.homothety S k B) = |k| * dist A B ∧
    AffineMap.homothety S k B -ᵥ AffineMap.homothety S k A = k • (B -ᵥ A) ∧
    AffineMap.homothety S k S = S ∧ AffineMap.homothety S k T -ᵥ S = k • (T -ᵥ S) ∧
    AffineMap.homothety S (1:ℝ) T = T ∧ AffineMap.homothety S (-1:ℝ) T = Equiv.pointReflection S T := by
  refine ⟨by rw [dist_homothety_center, Real.norm_eq_abs], by rw [dist_homothety, Real.norm_eq_abs],
    by rw [AffineMap.homothety_apply, AffineMap.homothety_apply, vadd_vsub_vadd_cancel_right, ← smul_sub,
      vsub_sub_vsub_cancel_right],
    AffineMap.homothety_apply_same S k, by rw [AffineMap.homothety_apply, vadd_vsub], by simp, ?_⟩
  rw [AffineMap.homothety_apply, Equiv.pointReflection_apply]
  simp [neg_vsub_eq_vsub_rev]

/-- Razlaga 8 in Povzetek: za k ≠ 0 je slika trikotnika pri središčnem raztegu podobna trikotniku s koeficientom
|k|, zato se koti ohranijo.
trditev: MAT-SS-2/podobnost#razteg-podobnost
besedilo: »8. Središčni razteg.** Podobne like dobimo s preslikavo. Izberemo točko $S$, **središče raztega**, in število $k \ne 0$, **koeficient raztega**. **Središčni razteg** vsaki točki $T$ priredi točko $T'$ na premici $ST$, za katero je« -/
theorem razteg_podobnost (S A B C : P) (k : ℝ) (hk : k ≠ 0) :
    Similar ![AffineMap.homothety S k A, AffineMap.homothety S k B, AffineMap.homothety S k C] ![A, B, C] ∧
    ∠ (AffineMap.homothety S k A) (AffineMap.homothety S k B) (AffineMap.homothety S k C) = ∠ A B C := by
  have hs : Similar ![AffineMap.homothety S k A, AffineMap.homothety S k B, AffineMap.homothety S k C]
      ![A, B, C] := by
    rw [similar_iff_exists_pos_dist_eq]
    refine ⟨|k|, abs_pos.mpr hk, fun i j => ?_⟩
    fin_cases i <;> fin_cases j <;> simp [dist_homothety, Real.norm_eq_abs]
  exact ⟨hs, hs.angle_eq⟩

/-- Predpostavka `razteg_podobnost` se da izpolniti (k = 2). -/
example : (2:ℝ) ≠ 0 := by norm_num

/-- Predpostavke trditve `razteg_podobnost` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2:ℝ) ≠ 0 := by norm_num
  razteg_podobnost (hk := w)

/-- Razlaga 8 (slika): pri središču v izhodišču se A(2, 1), B(4, 1), C(3, 3) pri k = 2 preslikajo v (4, 2), (8, 2),
(6, 6), pri k = −1/2 pa v (−1; −0,5), (−2; −0,5), (−1,5; −1,5).
trditev: MAT-SS-2/podobnost#slika-razteg
besedilo: »V simulaciji spodaj (»Podobnost in središčni razteg«) nastavi k = 2 in nato k = 0,5. Opazuj, da je razmerje stranic $k$, razmerje ploščin pa $4$ oziroma $0{,}25$, torej $k^2$. Kje glede na središče (v simulaciji O) leži slika, ko nastaviš negativen k?« -/
theorem slika_razteg :
    ((2:ℝ) * 2, (2:ℝ) * 1) = (4, 2) ∧ ((2:ℝ) * 4, (2:ℝ) * 1) = (8, 2) ∧ ((2:ℝ) * 3, (2:ℝ) * 3) = (6, 6) ∧
    ((-1 / 2 : ℝ) * 2, (-1 / 2 : ℝ) * 1) = (-1, -0.5) ∧ ((-1 / 2 : ℝ) * 4, (-1 / 2 : ℝ) * 1) = (-2, -0.5) ∧
    ((-1 / 2 : ℝ) * 3, (-1 / 2 : ℝ) * 3) = (-1.5, -1.5) := by
  norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: k = a'/a = 10/4 = 2,5, b' = 2,5·6 = 15 cm, c' = 2,5·8 = 20 cm; preizkus 15/6 = 20/8 = 2,5; iz
b'/b = a'/a sledi b' = 15 (enolično).
trditev: MAT-SS-2/podobnost#primer1
besedilo: »$\dfrac{15}{6} = 2{,}5$ in $\dfrac{20}{8} = 2{,}5$. ✓« -/
theorem primer1 :
    (10:ℝ) / 4 = 2.5 ∧ (2.5:ℝ) * 6 = 15 ∧ (2.5:ℝ) * 8 = 20 ∧ (15:ℝ) / 6 = 2.5 ∧ (20:ℝ) / 8 = 2.5 ∧
    ∀ b' c' : ℝ, b' / 6 = 10 / 4 → c' / 8 = 10 / 4 → b' = 15 ∧ c' = 20 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, fun b' c' h1 h2 => ⟨?_, ?_⟩⟩
  · field_simp at h1; linarith
  · field_simp at h2; linarith

/-- Primer 2: x/384 000 = 2,5/275 ⟺ x = 2,5·384 000/275 ≈ 3491 km ≈ 3500 km (izmerjenih 3474 km se razlikuje za
manj kot 0,5 %). Pogoste napake: obrnjeno razmerje x/384 000 = 275/2,5 bi dalo x = 42 240 000 km.
trditev: MAT-SS-2/podobnost#primer2
besedilo: »$x = \dfrac{2{,}5 \cdot 384\,000}{275} \approx 3491\,\text{km}$« -/
theorem primer2 :
    (∀ x : ℝ, x / 384000 = 2.5 / 275 ↔ x = 2.5 * 384000 / 275) ∧ |(2.5:ℝ) * 384000 / 275 - 3491| < 0.5 ∧
    |(2.5:ℝ) * 384000 / 275 - 3500| < 50 ∧ |(2.5:ℝ) * 384000 / 275 - 3474| / 3474 < 0.005 ∧
    (∀ x : ℝ, x / 384000 = 275 / 2.5 ↔ x = 42240000) := by
  refine ⟨fun x => ⟨fun h => ?_, fun h => ?_⟩, ?_, ?_, ?_, fun x => ⟨fun h => ?_, fun h => ?_⟩⟩
  · field_simp at h; linarith
  · rw [h]; norm_num
  · rw [abs_lt]; constructor <;> norm_num
  · rw [abs_lt]; constructor <;> norm_num
  · rw [abs_of_pos (by norm_num)]; norm_num
  · field_simp at h; linarith
  · rw [h]; norm_num

/-- Pomožna trditev: za x ≥ 0 je x² = n² (n ≥ 0) natanko pri x = n (na koncu še koreni).
pomozno -/
theorem koren {x n : ℝ} (hx : 0 ≤ x) (hn : 0 ≤ n) : x ^ 2 = n ^ 2 ↔ x = n :=
  ⟨iz_kvadratov hx hn, fun h => by rw [h]⟩

/-- Predpostavke `koren` se dajo izpolniti (x = n = 1). -/
example : (0:ℝ) ≤ 1 := zero_le_one

/-- Primer 3: c = 9 + 16 = 25; v_c² = 9·16 = 144, v_c = 12; a² = 25·9 = 225, a = 15; b² = 25·16 = 400, b = 20
(dolžine so nenegativne); preizkus 15² + 20² = 225 + 400 = 625 = 25².
trditev: MAT-SS-2/podobnost#primer3
besedilo: »$15^2 + 20^2 = 225 + 400 = 625 = 25^2$« -/
theorem primer3 :
    (9:ℝ) + 16 = 25 ∧ (∀ v : ℝ, 0 ≤ v → (v ^ 2 = 9 * 16 ↔ v = 12)) ∧ (9:ℝ) * 16 = 144 ∧
    (∀ a : ℝ, 0 ≤ a → (a ^ 2 = 25 * 9 ↔ a = 15)) ∧ (∀ b : ℝ, 0 ≤ b → (b ^ 2 = 25 * 16 ↔ b = 20)) ∧
    (15:ℝ) ^ 2 + 20 ^ 2 = 225 + 400 ∧ (225:ℝ) + 400 = 625 ∧ (625:ℝ) = 25 ^ 2 := by
  refine ⟨by norm_num, fun v hv => ?_, by norm_num, fun a ha => ?_, fun b hb => ?_, by norm_num, by norm_num,
    by norm_num⟩
  · rw [show (9:ℝ) * 16 = 12 ^ 2 by norm_num]; exact koren hv (by norm_num)
  · rw [show (25:ℝ) * 9 = 15 ^ 2 by norm_num]; exact koren ha (by norm_num)
  · rw [show (25:ℝ) * 16 = 20 ^ 2 by norm_num]; exact koren hb (by norm_num)

/-- Primer 4: c_a = a²/c = 900/50 = 18; c_b = 50 − 18 = 32; v_c² = 18·32 = 576, v_c = 24; b² = 50·32 = 1600,
b = 40; preizkus 30·40 = 50·24.
trditev: MAT-SS-2/podobnost#primer4
besedilo: »$c_b = 50 - 18 = 32\,\text{cm}$ in $v_c^2 = 18 \cdot 32 = 576$, zato $v_c = 24\,\text{cm}$. Preizkus: $b^2 = 50 \cdot 32 = 1600$, $b = 40\,\text{cm}$, in $30 \cdot 40 = 50 \cdot 24$, ker sta to dvakratni ploščini.« -/
theorem primer4 :
    (30:ℝ) ^ 2 / 50 = 900 / 50 ∧ (900:ℝ) / 50 = 18 ∧ (50:ℝ) - 18 = 32 ∧ (18:ℝ) * 32 = 576 ∧
    (∀ v : ℝ, 0 ≤ v → (v ^ 2 = 576 ↔ v = 24)) ∧ (50:ℝ) * 32 = 1600 ∧ (∀ b : ℝ, 0 ≤ b → (b ^ 2 = 1600 ↔ b = 40)) ∧
    (30:ℝ) * 40 = 50 * 24 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, fun v hv => ?_, by norm_num, fun b hb => ?_,
    by norm_num⟩
  · rw [show (576:ℝ) = 24 ^ 2 by norm_num]; exact koren hv (by norm_num)
  · rw [show (1600:ℝ) = 40 ^ 2 by norm_num]; exact koren hb (by norm_num)

/-- Primer 5: s središčem S(1, 1) se A(2, 2), B(4, 2), C(2, 3) pri k = 2 preslikajo v A'(3, 3), B'(7, 3),
C'(3, 5), pri k = −1 v A''(0, 0), B''(−2, 0), C''(0, −1); ploščine so P = 1, P' = 4 = 2²·1, P'' = 1 = (−1)²·1;
kateti |AB| = 2, |AC| = 1 in pri k = 2 kateti 4 in 2.
trditev: MAT-SS-2/podobnost#primer5
besedilo: »Odgovor: a) $A'(3, 3)$, $B'(7, 3)$, $C'(3, 5)$, ploščina je $4$-krat večja; b) $A''(0, 0)$, $B''(-2, 0)$, $C''(0, -1)$, trikotnik je skladen z $ABC$ (zrcaljen čez $S$), ploščina je enaka.« -/
theorem primer5 :
    AffineMap.homothety ((1, 1) : ℝ × ℝ) (2:ℝ) (2, 2) = (3, 3) ∧
    AffineMap.homothety ((1, 1) : ℝ × ℝ) (2:ℝ) (4, 2) = (7, 3) ∧
    AffineMap.homothety ((1, 1) : ℝ × ℝ) (2:ℝ) (2, 3) = (3, 5) ∧
    AffineMap.homothety ((1, 1) : ℝ × ℝ) (-1:ℝ) (2, 2) = (0, 0) ∧
    AffineMap.homothety ((1, 1) : ℝ × ℝ) (-1:ℝ) (4, 2) = (-2, 0) ∧
    AffineMap.homothety ((1, 1) : ℝ × ℝ) (-1:ℝ) (2, 3) = (0, -1) ∧
    pl (2, 2) (4, 2) (2, 3) = 1 ∧ pl (3, 3) (7, 3) (3, 5) = 4 ∧ (4:ℝ) = 2 ^ 2 * 1 ∧
    pl (0, 0) (-2, 0) (0, -1) = 1 ∧ (1:ℝ) = (-1) ^ 2 * 1 ∧
    (4:ℝ) - 2 = 2 ∧ (3:ℝ) - 2 = 1 ∧ (7:ℝ) - 3 = 4 ∧ (5:ℝ) - 3 = 2 := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, by norm_num, ?_, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩ <;>
  first
  | (rw [(razteg_koordinate _ _ _ _ _).1]; norm_num)
  | (simp only [pl]; norm_num)

/-! ## Pogoste napake -/

/-- Pogoste napake (pozabljen koren): pri odsekih 4 in 25 je v_c = √(4·25) = 10, zmnožek 100 pa bi bil daljši od
hipotenuze 4 + 25 = 29; dvakrat daljše dolžine dajo štirikrat večjo ploščino (2² = 4).
trditev: MAT-SS-2/podobnost#napake
besedilo: »Pozabljen koren.** Velja $v_c^2 = c_a \cdot c_b$ in $a^2 = c \cdot c_a$. Kdor zapiše zmnožek kot končni rezultat, dobi pri odsekih $4$ in $25$ višino $100$, kar je daljše od hipotenuze. Na koncu še koreni.« -/
theorem napake : √((4:ℝ) * 25) = 10 ∧ (4:ℝ) + 25 = 29 ∧ (29:ℝ) < 4 * 25 ∧ (2:ℝ) ^ 2 = 4 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  rw [show (4:ℝ) * 25 = 10 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-! ## Za maturo -/

/-- Naloga 1: |CA| = 4 + 2 = 6, k = 6/4 = 3/2, razmerje ploščin k² = 9/4, ploščina △ABC = 9/4·12 = 27 cm²,
trapez 27 − 12 = 15 cm²; ploščina se pri raztegu s središčem C in koeficientom 3/2 pomnoži z (3/2)² (`razteg_ploscina`).
trditev: MAT-SS-2/podobnost#naloga1
besedilo: »Razmerje ploščin je $k^2 = \dfrac{9}{4}$, zato je ploščina trikotnika $ABC$ enaka $\dfrac{9}{4} \cdot 12\,\text{cm}^2 = 27\,\text{cm}^2$.« -/
theorem naloga1 :
    (4:ℝ) + 2 = 6 ∧ (6:ℝ) / 4 = 3 / 2 ∧ (3 / 2 : ℝ) ^ 2 = 9 / 4 ∧ (9 / 4 : ℝ) * 12 = 27 ∧ (27:ℝ) - 12 = 15 ∧
    ∀ (C : EuclideanSpace ℝ (Fin 2)) (s : Set (EuclideanSpace ℝ (Fin 2))),
      MeasureTheory.volume (AffineMap.homothety C (3 / 2 : ℝ) '' s) =
        ENNReal.ofReal (9 / 4) * MeasureTheory.volume s := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, fun C s => ?_⟩
  rw [razteg_ploscina]; norm_num

/-- Naloga 2 a), b): c_b = v_c²/c_a = 36/3 = 12 cm, c = 3 + 12 = 15 cm; a² = 15·3 = 45, a = √45 = 3√5 cm;
b² = 15·12 = 180, b = √180 = 6√5 cm; preizkus 45 + 180 = 225 = 15².
trditev: MAT-SS-2/podobnost#naloga2-ab
besedilo: »b) Prav tako $b^2 = c \cdot c_b = 15 \cdot 12 = 180$, zato $b = \sqrt{180} = 6\sqrt{5}\,\text{cm}$. Preverimo: $45 + 180 = 225 = 15^2$. ✓« -/
theorem naloga2_ab :
    (6:ℝ) ^ 2 / 3 = 12 ∧ (3:ℝ) + 12 = 15 ∧ (15:ℝ) * 3 = 45 ∧ √(45:ℝ) = 3 * √5 ∧ (15:ℝ) * 12 = 180 ∧
    √(180:ℝ) = 6 * √5 ∧ (45:ℝ) + 180 = 225 ∧ (225:ℝ) = 15 ^ 2 := by
  have h5 : (0:ℝ) ≤ √5 := Real.sqrt_nonneg 5
  have h55 : √5 ^ 2 = (5:ℝ) := Real.sq_sqrt (by norm_num)
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, by norm_num, ?_, by norm_num, by norm_num⟩
  · rw [show (45:ℝ) = (3 * √5) ^ 2 by rw [mul_pow, h55]; norm_num, Real.sqrt_sq (by positivity)]
  · rw [show (180:ℝ) = (6 * √5) ^ 2 by rw [mul_pow, h55]; norm_num, Real.sqrt_sq (by positivity)]

/-- Naloga 2 c): kot pri C v △CBD je 90° − β = α (vsota kotov); k = 6√5/(3√5) = 2 = 12/6; ploščini 12·6/2 = 36 in
3·6/2 = 9, razmerje 36 : 9 = 4 = k² (podobnost △ACD ∼ △CBD je izrek `trije_podobni`).
trditev: MAT-SS-2/podobnost#naloga2-c
besedilo: »c) Razmerje ploščin je $k^2 = 4$. Preverimo: ploščina trikotnika $ACD$ je $\dfrac{12 \cdot 6}{2} = 36\,\text{cm}^2$, ploščina trikotnika $CBD$ je $\dfrac{3 \cdot 6}{2} = 9\,\text{cm}^2$, in $36 : 9 = 4$. ✓« -/
theorem naloga2_c :
    (∀ α β : ℝ, α + β + π / 2 = π → π / 2 - β = α) ∧ 6 * √5 / (3 * √5) = (2:ℝ) ∧ (12:ℝ) / 6 = 2 ∧
    (12:ℝ) * 6 / 2 = 36 ∧ (3:ℝ) * 6 / 2 = 9 ∧ (36:ℝ) / 9 = 4 ∧ (2:ℝ) ^ 2 = 4 := by
  have h5 : (0:ℝ) < √5 := Real.sqrt_pos.mpr (by norm_num)
  refine ⟨fun α β h => by linarith, by field_simp; norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩

/-! ## Drugače -/

/-- Drugače: Iz vsakdanjega življenja: 6 cm pri merilu 1 : 50 000 je 300 000 cm = 3 km; pri 1 : 100 je 5 cm
v naravi 500 cm = 5 m, 1 cm² pa 100² = 10 000 cm² = 1 m².
trditev: MAT-SS-2/podobnost#vsakdan
besedilo: »Načrt hiše.** Arhitekt nariše načrt v merilu $1 : 100$. Dolžina $5\,\text{cm}$ na načrtu je $5\,\text{m}$ v resnici, ploščina $1\,\text{cm}^2$ na načrtu pa je $10\,000\,\text{cm}^2 = 1\,\text{m}^2$ v resnici. Ploščine se torej množijo s $k^2$, dolžine s $k$.« -/
theorem vsakdan : (6:ℝ) * 50000 = 300000 ∧ (300000:ℝ) / 100000 = 3 ∧ (5:ℝ) * 100 = 500 ∧ (100:ℝ) ^ 2 = 10000 :=
  by norm_num

/-- Drugače: Korak za korakom: a = 6, b = 8, c = 10 (36 + 64 = 100); c_a = 36/10 = 3,6, c_b = 64/10 = 6,4,
3,6 + 6,4 = 10; v_c² = 3,6·6,4 = 23,04, v_c = 4,8; ploščina 6·8/2 = 24 = 10·4,8/2.
trditev: MAT-SS-2/podobnost#korak-za-korakom
besedilo: »| Višina iz višinskega izreka | $v_c^2 = 3{,}6 \cdot 6{,}4 = 23{,}04$ | $v_c = 4{,}8\,\text{cm}$ |« -/
theorem korak_za_korakom :
    (36:ℝ) + 64 = 100 ∧ (36:ℝ) / 10 = 3.6 ∧ (64:ℝ) / 10 = 6.4 ∧ (3.6:ℝ) + 6.4 = 10 ∧ (3.6:ℝ) * 6.4 = 23.04 ∧
    (∀ v : ℝ, 0 ≤ v → (v ^ 2 = 23.04 ↔ v = 4.8)) ∧ (6:ℝ) * 8 / 2 = 24 ∧ (10:ℝ) * 4.8 / 2 = 24 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, fun v hv => ?_, by norm_num, by norm_num⟩
  rw [show (23.04:ℝ) = 4.8 ^ 2 by norm_num]; exact koren hv (by norm_num)

/-! ## Preveri se -/

/-- Preveri se 3: razmerje ploščin k² = 9 da (za k > 0) k = 3; napačna odgovora 9 in 4,5 nista koeficient.
trditev: MAT-SS-2/podobnost#kviz3
besedilo: »Razmerje ploščin je $k^2 = 9$, zato $k = 3$.« -/
theorem kviz3 (k : ℝ) (hk : 0 < k) : k ^ 2 = 9 ↔ k = 3 := by
  rw [show (9:ℝ) = 3 ^ 2 by norm_num]; exact koren hk.le (by norm_num)

/-- Predpostavka `kviz3` se da izpolniti (k = 3). -/
example : (0:ℝ) < 3 := by norm_num

/-- Predpostavke trditve `kviz3` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 3 := by norm_num
  kviz3 (hk := w)

/-- Preveri se 4: 1 cm na sliki pomeni 3500/3,5 = 1000 km, krater 0,2·1000 = 200 km (napaka 0,2·3500 = 700).
trditev: MAT-SS-2/podobnost#kviz4
besedilo: »Fotografija je pomanjšana za $3500\,\text{km} : 3{,}5\,\text{cm}$, torej $1\,\text{cm}$ pomeni $1000\,\text{km}$; $0{,}2\,\text{cm}$ je $200\,\text{km}$, ne $20$.« -/
theorem kviz4 : (3500:ℝ) / 3.5 = 1000 ∧ (0.2:ℝ) * 1000 = 200 ∧ (0.2:ℝ) / 3.5 * 3500 = 200 ∧ (0.2:ℝ) * 3500 = 700 := by
  norm_num

/-- Preveri se 5: c = 4 + 21 = 25, a² = 25·4 = 100, a = 10 cm; √(4·21) = √84 je višina, √(25·21) = √525 uporabi
napačen odsek.
trditev: MAT-SS-2/podobnost#kviz5
besedilo: »Najprej hipotenuza $c = 4 + 21 = 25\,\text{cm}$, nato Evklidov izrek $a^2 = 25 \cdot 4 = 100$, torej $a = 10\,\text{cm}$.« -/
theorem kviz5 : (4:ℝ) + 21 = 25 ∧ (25:ℝ) * 4 = 100 ∧ (∀ a : ℝ, 0 ≤ a → (a ^ 2 = 100 ↔ a = 10)) ∧ (4:ℝ) * 21 = 84 ∧
    (25:ℝ) * 21 = 525 := by
  refine ⟨by norm_num, by norm_num, fun a ha => ?_, by norm_num, by norm_num⟩
  rw [show (100:ℝ) = 10 ^ 2 by norm_num]; exact koren ha (by norm_num)

/-- Preveri se 6 (in blok RACUN): razteg s S(1, 2) in k = −2 preslika T(3, 5) v T'(−3, −4): x' = 1 + (−2)(3 − 1) =
1 − 4 = −3, y' = 2 + (−2)(5 − 2) = −4; napake: 1 + 2·2 = 5, −2·3 = −6, −2·(3 − 1) = −4.
trditev: MAT-SS-2/podobnost#kviz6
besedilo: »$x' = 1 + (-2) \cdot (3 - 1) = 1 - 4 = -3$. (Druga koordinata: $y' = 2 + (-2) \cdot (5 - 2) = -4$, torej $T'(-3, -4)$.)« -/
theorem kviz6 :
    AffineMap.homothety ((1, 2) : ℝ × ℝ) (-2:ℝ) (3, 5) = (-3, -4) ∧ (1:ℝ) + (-2) * (3 - 1) = 1 - 4 ∧
    (1:ℝ) - 4 = -3 ∧ (2:ℝ) + (-2) * (5 - 2) = -4 ∧ (1:ℝ) + 2 * (3 - 1) = 5 ∧ (-2:ℝ) * 3 = -6 ∧
    (-2:ℝ) * (3 - 1) = -4 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  rw [(razteg_koordinate _ _ _ _ _).1]; norm_num

/-- Preveri se 7 (in blok RACUN): pri k = −3 se ploščina 5 cm² pomnoži s k² = 9: 9·5 = 45 cm² (ne −45, ne 15).
trditev: MAT-SS-2/podobnost#kviz7
besedilo: »15 | Dolžine se pomnožijo s $|k| = 3$, ploščina pa s $k^2 = 9$.« -/
theorem kviz7 : (-3:ℝ) ^ 2 = 9 ∧ (-3:ℝ) ^ 2 * 5 = 45 ∧ |(-3:ℝ)| = 3 ∧ (3:ℝ) * 5 = 15 := by norm_num

end Evklid.Lekcije.MAT_SS_2.Podobnost
