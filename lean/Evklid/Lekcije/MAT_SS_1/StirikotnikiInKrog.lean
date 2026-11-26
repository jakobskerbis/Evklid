/-
vir: content/lessons/MAT-SS-1/stirikotniki-in-krog.md
sha256: 2d43efe7086ac883129f769d620272fc764444d9942481f2adecaa06a4b75f4c
Model: lastnosti likov so dokazane v realnem prostoru s skalarnim produktom `V` (točke so vektorji):
paralelogram ABCD je B − A = C − D (u = B − A, w = D − A, C = A + u + w), pravokotnik še ⟪u, w⟫ = 0, romb še
‖u‖ = ‖w‖, trapez C − D = t(B − A) s t ≥ 0 (osnovnici vzporedni in enako usmerjeni), deltoid |AB| = |AD|,
|CB| = |CD|. Enakokraki trapez (lekcija: enaka kraka, ni paralelogram) je v Leanu modeliran že s simetrično lego
v ℂ (A = −p, B = p, C = q + hi, D = −q + hi); da ima vsak trapez z enakima krakoma, ki ni paralelogram, to lego,
ni dokazano (zahtevno, še ni dokazano). Tetivni liki so v ℂ s simetrično lego. Koti `∠` so v radianih (θ° = θ·π/180),
stopinjski računi so s stopinjami kot števili. Ploščina kroga je Lebesgueova mera zaprtega kroga v ℂ. Obodni kot:
dokazan je primer iz lekcije (središče S znotraj obodnega kota, D je drugo presečišče CS s krožnico), zapisan s
predpostavkama ∠ACB = ∠ACS + ∠SCB in ∠ASB = ∠ASD + ∠DSB (S leži znotraj obeh kotov). »≈ a« na k decimalk je
|vrednost − a| < ½·10⁻ᵏ; π je omejen z `pi_gt_d6`, `pi_lt_d6`.
Ni v Leanu: zgodbe (učenci, mizar, keramik, steklar, Ana in dedek), risbe in simulaciji (»Štirikotniki«, »Obodni
in središčni kot«); definicije likov, kroga, krožnice, tetive, loka, izseka, tangente kot opis; vsota kotov
poljubnega štirikotnika (dokazana je ob predpostavki, da diagonala AC razdeli kota pri A in C, kar velja za
konveksen štirikotnik; da to velja, ni dokazano: zahtevno, še ni dokazano); »štirikotnik z enakima paroma nasprotnih
stranic je paralelogram« (zahtevno, še ni dokazano; mizarjev trik je dokazan za paralelogram: enaki diagonali ⇔ pravi
kot); dokaza ploščin z rezanjem papirja in »romb zapolni polovico pravokotnika« (ploščine likov so formule, dokazane
so zveze med njimi: S = m·v, a² = (e/2)² + (f/2)², diagonale); »v_a ni nikoli večja od b« (zahtevno, še ni dokazano);
obseg kroga 2πr (dolžina krivulje, zahtevno, še ni dokazano; dokazana je formula za lok kot delež 2πr); obodni kot
za druge lege C, »vsi obodni koti nad istim lokom so enaki« zunaj dokazane lege, tetivni štirikotnik (α + γ = 180°)
in obrat, »romb (razen kvadrata) in neenakokraki trapez nista tetivna«, včrtana krožnica tangentnega štirikotnika
(zahtevno, še ni dokazano; dokazano je: pravokotnik in enakokraki trapez imata točko, enako oddaljeno od vseh
oglišč, tangentni odseki iz točke so enako dolgi in iz tega a + c = b + d); iskanje središča s kotnikom (Tales je
dokazan); Naloga 2 a) korak 3, da E, S, F ležijo na skupni simetrali osnovnic in S med njima, zato v = |SE| + |SF|
(zahtevno, še ni dokazano; dokazan je račun 5 + 12 = 17); Postopek, Pazi na, točkovanje, razlage v kvizih.
Lean: √ negativnega je 0, x/0 = 0 (formule z deljenjem imajo pozitivne podatke).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.StirikotnikiInKrog

open Real EuclideanGeometry MeasureTheory

variable {V : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V]
variable {W P : Type*} [NormedAddCommGroup W] [InnerProductSpace ℝ W] [MetricSpace P] [NormedAddTorsor W P]

/-- Pomožno: kvadrat razdalje v ℂ iz koordinat.
pomozno – orodje (kvadrat razdalje v ℂ) -/
theorem dist_c_sq (z w : ℂ) : dist z w ^ 2 = (z.re - w.re) ^ 2 + (z.im - w.im) ^ 2 := by
  rw [Complex.dist_eq_re_im, Real.sq_sqrt (by positivity)]

/-- Pomožno: √(k²) = k za k ≥ 0.
pomozno – orodje (√(k²) = k za k ≥ 0) -/
theorem sqrt_kv {k : ℝ} (hk : 0 ≤ k) : √(k ^ 2) = k := Real.sqrt_sq hk

/-- Predpostavka trditve `sqrt_kv` se da izpolniti (k = 3). -/
example : (0 : ℝ) ≤ 3 := by norm_num

/-! ## 1. Vsota kotov -/

/-- Razlaga 1 in Povzetek: diagonala AC razreže štirikotnik na trikotnika ABC in ACD; če razdeli kota pri A in C
(∠DAB = ∠DAC + ∠CAB, ∠BCD = ∠BCA + ∠ACD), je α + β + γ + δ = 2π (360°).
trditev: MAT-SS-1/stirikotniki-in-krog#vsota-kotov
besedilo: »\alpha + \beta + \gamma + \delta = 360^\circ« -/
theorem vsota_kotov {A B C D : P} (hAC : A ≠ C) (hA : ∠ D A B = ∠ D A C + ∠ C A B)
    (hC : ∠ B C D = ∠ B C A + ∠ A C D) : ∠ D A B + ∠ A B C + ∠ B C D + ∠ C D A = 2 * π := by
  have t1 := EuclideanGeometry.angle_add_angle_add_angle_eq_pi B hAC.symm
  have t2 := EuclideanGeometry.angle_add_angle_add_angle_eq_pi D hAC
  rw [hA, hC]
  linarith [EuclideanGeometry.angle_comm C A B, EuclideanGeometry.angle_comm A B C,
    EuclideanGeometry.angle_comm B C A, EuclideanGeometry.angle_comm D A C, EuclideanGeometry.angle_comm A C D,
    EuclideanGeometry.angle_comm C D A]

/-- Razlaga 1: izmerjene vsote 88 + 97 + 104 + 70 = 359, 120 + 60 + 119 + 62 = 361, 4·90 = 360.
trditev: MAT-SS-1/stirikotniki-in-krog#meritve
besedilo: »poljuben štirikotnik: $88^\circ + 97^\circ + 104^\circ + 70^\circ = 359^\circ$; - paralelogram: $120^\circ + 60^\circ + 119^\circ + 62^\circ = 361^\circ$; - kvadrat: $90^\circ + 90^\circ + 90^\circ + 90^\circ = 360^\circ$.« -/
theorem meritve : (88 : ℝ) + 97 + 104 + 70 = 359 ∧ (120 : ℝ) + 60 + 119 + 62 = 361 ∧
    (90 : ℝ) + 90 + 90 + 90 = 360 := by norm_num

/-! ## 2. Paralelogram, pravokotnik, romb, kvadrat, trapez, deltoid -/

/-- Razlaga 2 (paralelogram): ABCD z B − A = C − D ima enaki nasprotni stranici, diagonali se razpolavljata
(skupno razpolovišče), in obratno: če se diagonali razpolavljata, je ABCD paralelogram.
trditev: MAT-SS-1/stirikotniki-in-krog#paralelogram
besedilo: »Diagonali paralelograma se razpolavljata.« -/
theorem paralelogram (A B C D : V) :
    (B - A = C - D → ‖B - A‖ = ‖C - D‖ ∧ ‖C - B‖ = ‖D - A‖ ∧ midpoint ℝ A C = midpoint ℝ B D) ∧
      (midpoint ℝ A C = midpoint ℝ B D → B - A = C - D) := by
  constructor
  · intro h
    have h2 : C - B = D - A := by
      have : C = B - A + D := by rw [h]; abel
      rw [this]; abel
    refine ⟨by rw [h], by rw [h2], ?_⟩
    simp only [midpoint_eq_smul_add, invOf_eq_inv]
    have : A + C = B + D := by
      have : C = B - A + D := by rw [h]; abel
      rw [this]; abel
    rw [this]
  · intro h
    simp only [midpoint_eq_smul_add, invOf_eq_inv] at h
    have h' : A + C = B + D := by
      have := congrArg (fun x => (2 : ℝ) • x) h
      simpa [smul_smul] using this
    have : B = A + C - D := by rw [h']; abel
    rw [this]; abel

/-- Razlaga 2 (paralelogram, koti): pri u = B − A, w = D − A in C = A + u + w sta nasprotna kota enaka
(∠DAB = ∠BCD), sosednja pa se dopolnjujeta do π (∠DAB + ∠ABC = π).
trditev: MAT-SS-1/stirikotniki-in-krog#paralelogram-koti
besedilo: »nasprotna kota enaka, sosednja kota se dopolnjujeta do $180^\circ$« -/
theorem paralelogram_koti (A u w : V) :
    ∠ (A + w) A (A + u) = ∠ (A + u) (A + u + w) (A + w) ∧ ∠ (A + w) A (A + u) + ∠ A (A + u) (A + u + w) = π := by
  simp only [EuclideanGeometry.angle, vsub_eq_sub]
  constructor
  · rw [show A + w - A = w by abel, show A + u - A = u by abel, show A + u - (A + u + w) = -w by abel,
      show A + w - (A + u + w) = -u by abel, InnerProductGeometry.angle_neg_neg,
      InnerProductGeometry.angle_comm]
  · rw [show A + w - A = w by abel, show A + u - A = u by abel, show A - (A + u) = -u by abel,
      show A + u + w - (A + u) = w by abel, InnerProductGeometry.angle_neg_left, InnerProductGeometry.angle_comm u w]
    ring

/-- Razlaga 2 (pravokotnik): v paralelogramu s pravim kotom pri A (⟪u, w⟫ = 0) sta diagonali enako dolgi in
|AC|² = a² + b²; Premisli (mizarjev trik): paralelogram z enako dolgima diagonalama ima pravi kot.
trditev: MAT-SS-1/stirikotniki-in-krog#pravokotnik
besedilo: »Med paralelogrami imajo enako dolgi diagonali le pravokotniki, zato so vsi vogali pravi.« -/
theorem pravokotnik (u w : V) :
    (inner ℝ u w = 0 → ‖u + w‖ = ‖w - u‖ ∧ ‖u + w‖ ^ 2 = ‖u‖ ^ 2 + ‖w‖ ^ 2) ∧
      (‖u + w‖ = ‖w - u‖ → inner ℝ u w = 0) := by
  have e1 : ‖u + w‖ ^ 2 = ‖u‖ ^ 2 + 2 * inner ℝ u w + ‖w‖ ^ 2 := norm_add_sq_real u w
  have e2 : ‖w - u‖ ^ 2 = ‖w‖ ^ 2 - 2 * inner ℝ w u + ‖u‖ ^ 2 := norm_sub_sq_real w u
  rw [real_inner_comm u w] at e2
  constructor
  · intro h
    refine ⟨?_, by rw [e1, h]; ring⟩
    have : ‖u + w‖ ^ 2 = ‖w - u‖ ^ 2 := by rw [e1, e2, h]; ring
    exact (sq_eq_sq₀ (norm_nonneg _) (norm_nonneg _)).mp this
  · intro h
    have : ‖u + w‖ ^ 2 = ‖w - u‖ ^ 2 := by rw [h]
    linarith

/-- Razlaga 3 in Povzetek: diagonala pravokotnika je √(a² + b²), diagonala kvadrata a√2 (a ≥ 0).
trditev: MAT-SS-1/stirikotniki-in-krog#diagonala
besedilo: »Diagonala kvadrata je $a\sqrt{2}$, pravokotnika $\sqrt{a^2 + b^2}$.« -/
theorem diagonala (u w : V) (h : inner ℝ u w = 0) :
    ‖u + w‖ = √(‖u‖ ^ 2 + ‖w‖ ^ 2) ∧ (‖u‖ = ‖w‖ → ‖u + w‖ = ‖u‖ * √2) := by
  have e := ((pravokotnik u w).1 h).2
  have h1 : ‖u + w‖ = √(‖u‖ ^ 2 + ‖w‖ ^ 2) := by rw [← e, sqrt_kv (norm_nonneg _)]
  refine ⟨h1, fun hn => ?_⟩
  rw [h1, hn, show ‖w‖ ^ 2 + ‖w‖ ^ 2 = ‖w‖ ^ 2 * 2 by ring, Real.sqrt_mul (sq_nonneg _), sqrt_kv (norm_nonneg _)]

/-- Razlaga 2 (romb): v paralelogramu z enakima stranicama (‖u‖ = ‖w‖) sta diagonali u + w in w − u pravokotni,
diagonala AC razpolavlja kot pri A (∠(u, u + w) = ∠(w, u + w)), in Razlaga 3: a² = (e/2)² + (f/2)².
trditev: MAT-SS-1/stirikotniki-in-krog#romb
besedilo: »**romb**: paralelogram z enakimi stranicami. Diagonali sta pravokotni« -/
theorem romb (u w : V) (h : ‖u‖ = ‖w‖) :
    inner ℝ (u + w) (w - u) = 0 ∧
      InnerProductGeometry.angle u (u + w) = InnerProductGeometry.angle w (u + w) ∧
      ‖u‖ ^ 2 = (‖u + w‖ / 2) ^ 2 + (‖w - u‖ / 2) ^ 2 := by
  refine ⟨?_, ?_, ?_⟩
  · rw [inner_add_left, inner_sub_right, inner_sub_right, real_inner_self_eq_norm_sq,
      real_inner_self_eq_norm_sq, real_inner_comm w u, h]; ring
  · unfold InnerProductGeometry.angle
    rw [inner_add_right, inner_add_right, real_inner_self_eq_norm_sq, real_inner_self_eq_norm_sq,
      real_inner_comm w u, h]
    ring_nf
  · have e1 : ‖u + w‖ ^ 2 = ‖u‖ ^ 2 + 2 * inner ℝ u w + ‖w‖ ^ 2 := norm_add_sq_real u w
    have e2 : ‖w - u‖ ^ 2 = ‖w‖ ^ 2 - 2 * inner ℝ w u + ‖u‖ ^ 2 := norm_sub_sq_real w u
    rw [real_inner_comm u w] at e2
    rw [div_pow, div_pow, e1, e2, h]; ring

/-- Predpostavka trditve `romb` se da izpolniti (u = w = 1 v ℂ, izrojeni romb, ali u = 1, w = i). -/
example : ‖(1 : ℂ)‖ = ‖Complex.I‖ := by simp

/-- Razlaga 2 (kvadrat): kvadrat ima vse lastnosti pravokotnika in romba (enaki in pravokotni diagonali).
trditev: MAT-SS-1/stirikotniki-in-krog#kvadrat
besedilo: »Ima vse lastnosti pravokotnika in romba.« -/
theorem kvadrat (u w : V) (h0 : inner ℝ u w = 0) (h : ‖u‖ = ‖w‖) :
    ‖u + w‖ = ‖w - u‖ ∧ inner ℝ (u + w) (w - u) = 0 :=
  ⟨((pravokotnik u w).1 h0).1, (romb u w h).1⟩

/-- Predpostavke trditev `pravokotnik`, `diagonala`, `kvadrat` se dajo izpolniti (u = 1, w = i v ℂ). -/
example : inner ℝ (1 : ℂ) Complex.I = 0 ∧ ‖(1 : ℂ)‖ = ‖Complex.I‖ := by simp [Complex.inner]

/-- Razlaga 2 (trapez): pri C − D = t(B − A), t ≥ 0, je srednjica MN (razpolovišči krakov AD in BC) vzporedna
osnovnici AB (N − M = ((1 + t)/2)(B − A)) in dolga (a + c)/2, kjer a = |AB|, c = |DC|.
trditev: MAT-SS-1/stirikotniki-in-krog#srednjica
besedilo: »Srednjica (daljica med središčema krakov) je vzporedna osnovnicama« -/
theorem srednjica (A B C D : V) {t : ℝ} (ht : 0 ≤ t) (h : C - D = t • (B - A)) :
    midpoint ℝ B C - midpoint ℝ A D = ((1 + t) / 2) • (B - A) ∧
      ‖midpoint ℝ B C - midpoint ℝ A D‖ = (‖B - A‖ + ‖C - D‖) / 2 := by
  have e : midpoint ℝ B C - midpoint ℝ A D = ((1 + t) / 2) • (B - A) := by
    simp only [midpoint_eq_smul_add, invOf_eq_inv]
    have hC : C = D + t • (B - A) := by rw [← h]; abel
    rw [hC]; module
  refine ⟨e, ?_⟩
  rw [e, h, norm_smul, norm_smul, Real.norm_of_nonneg (by positivity), Real.norm_of_nonneg ht]; ring

/-- Predpostavka trditve `srednjica` se da izpolniti (t = 1/2). -/
example : (0 : ℝ) ≤ 1 / 2 := by norm_num

/-- Razlaga 2 (enakokraki trapez): A = −p, B = p, C = q + hi, D = −q + hi v ℂ ima enaka kraka in enako dolgi
diagonali, in Razlaga 7: točka ki, k = (q² + h² − p²)/(2h), je enako oddaljena od vseh oglišč (je tetiven).
trditev: MAT-SS-1/stirikotniki-in-krog#enakokraki-trapez
besedilo: »enakokraki trapez (enaka kraka, ni paralelogram) ima enako dolgi diagonali« -/
theorem enakokraki_trapez (p q h : ℝ) (hh : h ≠ 0) :
    dist (⟨-p, 0⟩ : ℂ) ⟨-q, h⟩ = dist (⟨p, 0⟩ : ℂ) ⟨q, h⟩ ∧ dist (⟨-p, 0⟩ : ℂ) ⟨q, h⟩ = dist (⟨p, 0⟩ : ℂ) ⟨-q, h⟩ ∧
      let O : ℂ := ⟨0, (q ^ 2 + h ^ 2 - p ^ 2) / (2 * h)⟩
      dist O ⟨-p, 0⟩ = dist O ⟨p, 0⟩ ∧ dist O ⟨p, 0⟩ = dist O ⟨q, h⟩ ∧ dist O ⟨q, h⟩ = dist O ⟨-q, h⟩ := by
  refine ⟨?_, ?_, ?_⟩
  · rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im]; ring_nf
  · rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im]; ring_nf
  · intro O
    refine ⟨?_, ?_, ?_⟩
    all_goals (rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im]; congr 1; simp [O])
    field_simp
    ring

/-- Predpostavka trditve `enakokraki_trapez` se da izpolniti (h = 17, Naloga 2). -/
example : (17 : ℝ) ≠ 0 := by norm_num

/-- Razlaga 7 (pravokotnik je tetiven): vsa oglišča A, A + u, A + u + w, A + w so enako oddaljena od razpolovišča
diagonale (središča očrtane krožnice, R = d/2), če je ⟪u, w⟫ = 0.
trditev: MAT-SS-1/stirikotniki-in-krog#pravokotnik-tetiven
besedilo: »Obe diagonali sta premera očrtane krožnice (obrat Talesovega izreka: pravi kot stoji nad diagonalo).« -/
theorem pravokotnik_tetiven (A u w : V) (h : inner ℝ u w = 0) :
    let O := midpoint ℝ A (A + u + w)
    dist O A = ‖u + w‖ / 2 ∧ dist O (A + u) = ‖u + w‖ / 2 ∧ dist O (A + u + w) = ‖u + w‖ / 2 ∧
      dist O (A + w) = ‖u + w‖ / 2 := by
  intro O
  have hO : O = A + (1 / 2 : ℝ) • (u + w) := by
    simp only [O, midpoint_eq_smul_add, invOf_eq_inv]; module
  have hn : ‖u - w‖ = ‖u + w‖ := by
    have := ((pravokotnik u w).1 h).1
    rw [this, ← norm_neg]; congr 1; abel
  rw [hO]
  simp only [dist_eq_norm]
  refine ⟨?_, ?_, ?_, ?_⟩
  · rw [show A + (1 / 2 : ℝ) • (u + w) - A = (1 / 2 : ℝ) • (u + w) by abel, norm_smul]; norm_num; ring
  · rw [show A + (1 / 2 : ℝ) • (u + w) - (A + u) = (-(1 / 2) : ℝ) • (u - w) by module, norm_smul, hn]
    norm_num; ring
  · rw [show A + (1 / 2 : ℝ) • (u + w) - (A + u + w) = (-(1 / 2) : ℝ) • (u + w) by module, norm_smul]
    norm_num; ring
  · rw [show A + (1 / 2 : ℝ) • (u + w) - (A + w) = (1 / 2 : ℝ) • (u - w) by module, norm_smul, hn]
    norm_num; ring

/-- Predpostavka trditve `pravokotnik_tetiven` se da izpolniti (u = 1, w = i v ℂ). -/
example : inner ℝ (1 : ℂ) Complex.I = 0 := by simp [Complex.inner]

/-- Razlaga 2 (deltoid): pri |AB| = |AD| in |CB| = |CD| sta diagonali pravokotni, A in C ležita na simetrali
diagonale BD (diagonala AC je simetrala BD).
trditev: MAT-SS-1/stirikotniki-in-krog#deltoid
besedilo: »Diagonali sta pravokotni, ena diagonala je simetrala druge.« -/
theorem deltoid {A B C D : P} (h1 : dist B A = dist D A) (h2 : dist B C = dist D C) :
    inner ℝ (C -ᵥ A) (D -ᵥ B) = 0 ∧ A ∈ AffineSubspace.perpBisector B D ∧
      C ∈ AffineSubspace.perpBisector B D := by
  refine ⟨inner_vsub_vsub_of_dist_eq_of_dist_eq h1 h2, ?_, ?_⟩ <;>
    rw [AffineSubspace.mem_perpBisector_iff_dist_eq']
  · exact h1
  · exact h2

/-- Predpostavke trditve `deltoid` se dajo izpolniti: A = 0, B = 1 + i, C = 3, D = 1 − i v ℂ. -/
example : dist (1 + Complex.I : ℂ) 0 = dist (1 - Complex.I : ℂ) 0 ∧
    dist (1 + Complex.I : ℂ) 3 = dist (1 - Complex.I : ℂ) 3 := by
  constructor <;> rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im] <;> norm_num

/-! ## 3. Ploščine (zveze med formulami) -/

/-- Razlaga 3: srednjica m = (a + c)/2, zato je S = (a + c)v/2 = m·v; obsegi 2(a + b), 4a.
trditev: MAT-SS-1/stirikotniki-in-krog#trapez-srednjica
besedilo: »Srednjica trapeza je $m = \dfrac{a + c}{2}$, zato je $S = m \cdot v$.« -/
theorem trapez_srednjica (a c v : ℝ) : (a + c) * v / 2 = ((a + c) / 2) * v := by ring

/-- Razlaga 3 (enakokraki trapez): v² = b² − ((a − c)/2)²: višina iz Pitagore v trikotniku s kateto (a − c)/2.
trditev: MAT-SS-1/stirikotniki-in-krog#trapez-visina
besedilo: »višina iz Pitagorovega izreka: $v^2 = b^2 - \left(\dfrac{a - c}{2}\right)^2$« -/
theorem trapez_visina (a c b v : ℝ) (hv : 0 ≤ v) (h : v ^ 2 + ((a - c) / 2) ^ 2 = b ^ 2) :
    v = √(b ^ 2 - ((a - c) / 2) ^ 2) := by
  rw [← h, add_sub_cancel_right, sqrt_kv hv]

/-- Predpostavke trditve `trapez_visina` se dajo izpolniti (Primer 2: v = 4, a = 14, c = 8, b = 5). -/
example : (0 : ℝ) ≤ 4 ∧ (4 : ℝ) ^ 2 + ((14 - 8) / 2) ^ 2 = 5 ^ 2 := by norm_num

/-! ## 4.–6. Krog, lok, izsek, tangenta, obodni kot -/

/-- Razlaga 4 in Povzetek: ploščina kroga s polmerom r ≥ 0 (Lebesgueova mera zaprtega kroga v ℂ) je πr².
trditev: MAT-SS-1/stirikotniki-in-krog#ploscina-kroga
besedilo: »$S = \pi r^2$«
besedilo-kratko: formula za ploščino kroga; daljši citat (»$o = 2\pi r, \qquad S = \pi r^2$«) bi vključil obseg, ki ga izrek ne dokaže -/
theorem ploscina_kroga (a : ℂ) (r : ℝ) (hr : 0 ≤ r) : (volume (Metric.closedBall a r)).toReal = π * r ^ 2 := by
  rw [Complex.volume_closedBall, ENNReal.toReal_mul, ENNReal.toReal_pow, ENNReal.toReal_ofReal hr]
  simp [mul_comm]

/-- Predpostavka trditve `ploscina_kroga` se da izpolniti (r = 9). -/
example : (0 : ℝ) ≤ 9 := by norm_num

/-- Razlaga 5 in Povzetek: lok je delež α/360 obsega 2πr, izsek delež α/360 ploščine πr²:
(α/360)·2πr = πrα/180 in (α/360)·πr² = πr²α/360.
trditev: MAT-SS-1/stirikotniki-in-krog#lok-izsek
besedilo: »Lok je delež $\dfrac{\alpha}{360^\circ}$ krožnice, izsek pa enak delež kroga. Pri loku se $2$ iz $2\pi r$ pokrajša s $360^\circ$ v $180^\circ$: $$l = \frac{\pi r \alpha}{180^\circ}, \qquad S_{\text{izs}} = \frac{\pi r^2 \alpha}{360^\circ}$$« -/
theorem lok_izsek (r α : ℝ) : α / 360 * (2 * π * r) = π * r * α / 180 ∧ α / 360 * (π * r ^ 2) = π * r ^ 2 * α / 360 := by
  constructor <;> ring

/-- Razlaga 4: premer je dvakratni polmer: točki S + v in S − v (‖v‖ = r) sta na krožnici in |PQ| = 2r.
trditev: MAT-SS-1/stirikotniki-in-krog#premer
besedilo: »($d = 2r$)«
besedilo-kratko: »premer je najdaljša tetiva« izrek ne dokaže, zato le zapis d = 2r -/
theorem premer (S v : V) : dist (S + v) S = ‖v‖ ∧ dist (S - v) S = ‖v‖ ∧ dist (S + v) (S - v) = 2 * ‖v‖ := by
  simp only [dist_eq_norm]
  refine ⟨by simp, by simp, ?_⟩
  rw [show S + v - (S - v) = (2 : ℝ) • v by module, norm_smul]; norm_num

/-- Razlaga 4: premica skozi točko T krožnice (|ST| = r), pravokotna na polmer ST (⟪T − S, v⟫ = 0, v ≠ 0), ima s
krožnico eno samo skupno točko T: |S − (T + tv)|² = r² + t²‖v‖² > r² za t ≠ 0.
pomozno – lekcija pove smer »tangenta je pravokotna na polmer«; izrek dokaže obrat (pravokotnica na polmer ima s krožnico eno samo skupno točko) -/
theorem tangenta (S T v : V) (hv : v ≠ 0) (h : inner ℝ (T - S) v = 0) (t : ℝ) :
    ‖T + t • v - S‖ = ‖T - S‖ ↔ t = 0 := by
  constructor
  · intro he
    have e : ‖T + t • v - S‖ ^ 2 = ‖T - S‖ ^ 2 + t ^ 2 * ‖v‖ ^ 2 := by
      rw [show T + t • v - S = (T - S) + t • v by abel, norm_add_sq_real, inner_smul_right, h, norm_smul,
        Real.norm_eq_abs, mul_pow, sq_abs]; ring
    rw [he] at e
    have hv' : 0 < ‖v‖ ^ 2 := by positivity
    have : t ^ 2 * ‖v‖ ^ 2 = 0 := by linarith
    rcases mul_eq_zero.mp this with h0 | h0
    · exact pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h0
    · linarith
  · rintro rfl; simp

/-- Predpostavke trditve `tangenta` se dajo izpolniti (S = 0, T = 1, v = i v ℂ). -/
example : (Complex.I : ℂ) ≠ 0 ∧ inner ℝ ((1 : ℂ) - 0) Complex.I = 0 := ⟨Complex.I_ne_zero, by simp [Complex.inner]⟩

/-- Razlaga 6, Ustno vprašanje 1, Bolj natančno (obodni kot je polovica središčnega): S je središče
(|SA| = |SB| = |SC|), D je drugo presečišče premice CS s krožnico (S strogo med C in D), S leži znotraj kota ACB
in znotraj kota ASB. Potem je ∠ASB = 2·∠ACB.
trditev: MAT-SS-1/stirikotniki-in-krog#obodni-kot
besedilo: »Središčni kot je torej $\alpha = 2(\varphi_1 + \varphi_2) = 2\varphi$.« -/
theorem obodni_kot {A B C D S : P} (hA : dist S A = dist S C) (hB : dist S B = dist S C) (hD : Sbtw ℝ C S D)
    (hC : ∠ A C B = ∠ A C S + ∠ S C B) (hS : ∠ A S B = ∠ A S D + ∠ D S B) : ∠ A S B = 2 * ∠ A C B := by
  have i1 := EuclideanGeometry.angle_eq_angle_of_dist_eq hA
  have i2 := EuclideanGeometry.angle_eq_angle_of_dist_eq hB
  have z1 := EuclideanGeometry.exterior_angle_eq_angle_add_angle (p₃ := A) D hD.symm
  have z2 := EuclideanGeometry.exterior_angle_eq_angle_add_angle (p₃ := B) D hD.symm
  rw [hS, hC, z1, EuclideanGeometry.angle_comm D S B, z2, i1, i2]
  linarith [EuclideanGeometry.angle_comm S C A, EuclideanGeometry.angle_comm A C S,
    EuclideanGeometry.angle_comm S C B, EuclideanGeometry.angle_comm B C S]

/-- Pomožno: kot med 1 + i in 1 (ter med 1 in 1 − i) v ℂ je π/4.
pomozno – orodje za primer izpolnljivosti (kot π/4 v ℂ) -/
theorem kot_pi4 : InnerProductGeometry.angle ((1 : ℂ) + Complex.I) 1 = π / 4 ∧
    InnerProductGeometry.angle (1 : ℂ) (1 - Complex.I) = π / 4 := by
  have hn1 : ‖(1 : ℂ) + Complex.I‖ = √2 := by
    rw [Complex.norm_eq_sqrt_sq_add_sq]; norm_num
  have hn2 : ‖(1 : ℂ) - Complex.I‖ = √2 := by
    rw [Complex.norm_eq_sqrt_sq_add_sq]; norm_num
  have h2 : (√2 : ℝ) ≠ 0 := by positivity
  have hc : (√2 : ℝ)⁻¹ = Real.cos (π / 4) := by
    rw [Real.cos_pi_div_four]; field_simp; rw [Real.sq_sqrt (by norm_num)]
  unfold InnerProductGeometry.angle
  rw [hn1, hn2]
  simp only [Complex.inner, norm_one, mul_one, one_mul]
  simp
  rw [hc, Real.arccos_cos (by positivity) (by linarith [pi_pos])]

/-- Pomožno: kot med i in 1 + i v ℂ je π/4.
pomozno – orodje za primer izpolnljivosti (kot π/4 v ℂ) -/
theorem kot_pi4' : InnerProductGeometry.angle Complex.I (1 + Complex.I) = π / 4 := by
  have hn1 : ‖(1 : ℂ) + Complex.I‖ = √2 := by
    rw [Complex.norm_eq_sqrt_sq_add_sq]; norm_num
  have hc : (√2 : ℝ)⁻¹ = Real.cos (π / 4) := by
    rw [Real.cos_pi_div_four]; field_simp; rw [Real.sq_sqrt (by norm_num)]
  unfold InnerProductGeometry.angle
  rw [hn1]
  simp [Complex.inner]
  rw [hc, Real.arccos_cos (by positivity) (by linarith [pi_pos])]

/-- Predpostavke trditve `vsota_kotov` se dajo izpolniti: kvadrat A = 0, B = 1, C = 1 + i, D = i v ℂ (diagonala AC
razdeli prava kota pri A in C na π/4 + π/4). -/
example : (0 : ℂ) ≠ 1 + Complex.I ∧ ∠ Complex.I (0 : ℂ) 1 = ∠ Complex.I (0 : ℂ) (1 + Complex.I) + ∠ (1 + Complex.I) 0 1 ∧
    ∠ (1 : ℂ) (1 + Complex.I) Complex.I = ∠ (1 : ℂ) (1 + Complex.I) 0 + ∠ (0 : ℂ) (1 + Complex.I) Complex.I := by
  have hpi2 : InnerProductGeometry.angle Complex.I 1 = π / 2 :=
    (InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two _ _).mp (by simp [Complex.inner])
  refine ⟨fun h => by simpa using congrArg Complex.re h, ?_, ?_⟩
  · simp only [EuclideanGeometry.angle, vsub_eq_sub, sub_zero]
    rw [hpi2, kot_pi4', kot_pi4.1]; ring
  · simp only [EuclideanGeometry.angle, vsub_eq_sub]
    rw [show (1 : ℂ) - (1 + Complex.I) = -Complex.I by ring, show Complex.I - (1 + Complex.I) = -1 by ring,
      show (0 : ℂ) - (1 + Complex.I) = -(1 + Complex.I) by ring, InnerProductGeometry.angle_neg_neg,
      InnerProductGeometry.angle_neg_neg, InnerProductGeometry.angle_neg_neg, hpi2, kot_pi4', kot_pi4.1]
    ring

/-- Predpostavke trditev `obodni_kot` in `obodna_enaka` (s C' = C, D' = D) se dajo izpolniti: S = 0, C = −1, D = 1, A = i, B = −i v ℂ
(∠ACS = ∠SCB = π/4, ∠ASD = ∠DSB = π/2). -/
example : dist (0 : ℂ) Complex.I = dist (0 : ℂ) (-1) ∧ dist (0 : ℂ) (-Complex.I) = dist (0 : ℂ) (-1) ∧
    Sbtw ℝ (-1 : ℂ) 0 1 ∧
    ∠ Complex.I (-1 : ℂ) (-Complex.I) = ∠ Complex.I (-1 : ℂ) 0 + ∠ (0 : ℂ) (-1) (-Complex.I) ∧
    ∠ Complex.I (0 : ℂ) (-Complex.I) = ∠ Complex.I (0 : ℂ) 1 + ∠ (1 : ℂ) 0 (-Complex.I) := by
  have hpi2 : ∀ x y : ℂ, inner ℝ x y = 0 → InnerProductGeometry.angle x y = π / 2 :=
    fun x y h => InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two x y |>.mp h
  refine ⟨by simp, by simp, ?_, ?_, ?_⟩
  · have := sbtw_midpoint_of_ne ℝ (show (-1 : ℂ) ≠ 1 by norm_num)
    rwa [show midpoint ℝ (-1 : ℂ) 1 = 0 by rw [midpoint_eq_smul_add]; simp] at this
  · simp only [EuclideanGeometry.angle, vsub_eq_sub, sub_neg_eq_add, zero_add]
    rw [hpi2 _ _ (by simp [Complex.inner]), add_comm Complex.I 1,
      show -Complex.I + 1 = 1 - Complex.I by ring, kot_pi4.1, kot_pi4.2]
    ring
  · simp only [EuclideanGeometry.angle, vsub_eq_sub, sub_zero]
    rw [InnerProductGeometry.angle_neg_right, InnerProductGeometry.angle_self (Complex.I_ne_zero),
      hpi2 _ _ (by simp [Complex.inner]), hpi2 _ _ (by simp [Complex.inner])]
    ring

/-- Razlaga 6 (obodni koti nad istim lokom v dokazani legi): dva obodna kota pri C in C' nad lokom AB sta enaka.
pomozno – izrek dokaže enakost obodnih kotov le v legi, ko je središče znotraj obeh kotov; lekcija trdi splošno -/
theorem obodna_enaka {A B C C' D D' S : P} (hA : dist S A = dist S C) (hB : dist S B = dist S C)
    (hD : Sbtw ℝ C S D) (hC : ∠ A C B = ∠ A C S + ∠ S C B) (hS : ∠ A S B = ∠ A S D + ∠ D S B)
    (hA' : dist S A = dist S C') (hB' : dist S B = dist S C') (hD' : Sbtw ℝ C' S D')
    (hC' : ∠ A C' B = ∠ A C' S + ∠ S C' B) (hS' : ∠ A S B = ∠ A S D' + ∠ D' S B) : ∠ A C B = ∠ A C' B := by
  have := obodni_kot hA hB hD hC hS
  have := obodni_kot hA' hB' hD' hC' hS'
  linarith

/-- Razlaga 6 in Razlaga 3 lekcije Trikotnik (Talesov izrek): kot pri C je pravi natanko tedaj, ko C leži na
krožnici s premerom AB; Iz Kot zgodba (kotnik): oglišče pravega kota na robu ⇒ PQ je premer.
trditev: MAT-SS-1/stirikotniki-in-krog#tales
besedilo: »obodni kot nad premerom je pravi ($\alpha = 180^\circ$, zato $\varphi = 90^\circ$)« -/
theorem tales (A B C : P) : ∠ A C B = π / 2 ↔ dist C (midpoint ℝ A B) = dist A B / 2 := by
  rw [EuclideanGeometry.Sphere.angle_eq_pi_div_two_iff_mem_sphere_ofDiameter, EuclideanGeometry.mem_sphere]
  rfl

/-- Razlaga 7 (tangentni štirikotnik): tangentna odseka iz točke P na krožnico sta enako dolga
(|PT|² = |PS|² − r² pri ⟪T − S, P − T⟫ = 0), zato iz a = x + y, b = y + z, c = z + w, d = w + x sledi a + c = b + d.
pomozno – lekcija enakosti tangentnih odsekov ne zapiše (le posledico a + c = b + d) -/
theorem tangentni_odseki (S P T T' : V) (hT : inner ℝ (T - S) (P - T) = 0) (hT' : inner ℝ (T' - S) (P - T') = 0)
    (hr : ‖T - S‖ = ‖T' - S‖) : ‖P - T‖ = ‖P - T'‖ := by
  have e1 : ‖P - S‖ ^ 2 = ‖T - S‖ ^ 2 + ‖P - T‖ ^ 2 := by
    rw [show P - S = (T - S) + (P - T) by abel, norm_add_sq_real, hT]; ring
  have e2 : ‖P - S‖ ^ 2 = ‖T' - S‖ ^ 2 + ‖P - T'‖ ^ 2 := by
    rw [show P - S = (T' - S) + (P - T') by abel, norm_add_sq_real, hT']; ring
  have : ‖P - T‖ ^ 2 = ‖P - T'‖ ^ 2 := by rw [hr] at e1; linarith
  exact (sq_eq_sq₀ (norm_nonneg _) (norm_nonneg _)).mp this

/-- Predpostavke trditve `tangentni_odseki` se dajo izpolniti (S = 0, T = 1, T' = i, P = 1 + i v ℂ). -/
example : inner ℝ ((1 : ℂ) - 0) ((1 + Complex.I) - 1) = 0 ∧
    inner ℝ (Complex.I - 0) ((1 + Complex.I) - Complex.I) = 0 ∧ ‖(1 : ℂ) - 0‖ = ‖Complex.I - 0‖ := by
  simp [Complex.inner]

/-- Razlaga 7: iz enakih tangentnih odsekov x, y, z, w je a + c = b + d.
pomozno – izrek je le algebrska enakost vsot tangentnih odsekov; trditve o tangentnem štirikotniku (a + c = b + d) ne dokaže -/
theorem pitot (x y z w : ℝ) : (x + y) + (z + w) = (y + z) + (w + x) := by ring

/-! ## Rešeni primeri in računi -/

/-- Pomožno: π ≈ 3,141592…3,141593.
pomozno – orodje (meje za π) -/
theorem pi_meje : (3141592 / 1000000 : ℝ) < π ∧ π < 3141593 / 1000000 := by
  constructor
  · have := Real.pi_gt_d6; norm_num at this ⊢; linarith
  · have := Real.pi_lt_d6; norm_num at this ⊢; linarith

/-- Razlaga 6 (tabela in premisli): obodni kot je polovica: 60/2 = 30, 100/2 = 50, 180/2 = 90; nad lokom 140°
je 70°, nad preostalim lokom 360 − 140 = 220, obodni 110°, skupaj 180°.
trditev: MAT-SS-1/stirikotniki-in-krog#razlaga6
besedilo: »Prvi je $70^\circ$, polovica od $140^\circ$. Drugi stoji nad preostalim lokom, ki mu pripada središčni kot $360^\circ - 140^\circ = 220^\circ$, zato meri $110^\circ$. Skupaj imata $180^\circ$.« -/
theorem razlaga6 : (60 : ℝ) / 2 = 30 ∧ (100 : ℝ) / 2 = 50 ∧ (180 : ℝ) / 2 = 90 ∧ (140 : ℝ) / 2 = 70 ∧
    (360 : ℝ) - 140 = 220 ∧ (220 : ℝ) / 2 = 110 ∧ (70 : ℝ) + 110 = 180 := by norm_num

/-- Primer 1: romb e = 12, f = 16: a = √(6² + 8²) = √100 = 10, o = 4·10 = 40, S = 12·16/2 = 96.
trditev: MAT-SS-1/stirikotniki-in-krog#primer1
besedilo: »Odgovor: stranica ploščice je $10\,\text{cm}$, obseg $40\,\text{cm}$, ploščina $96\,\text{cm}^2$.« -/
theorem primer1 : (12 : ℝ) / 2 = 6 ∧ (16 : ℝ) / 2 = 8 ∧ √((6 : ℝ) ^ 2 + 8 ^ 2) = √100 ∧ √(100 : ℝ) = 10 ∧
    (4 : ℝ) * 10 = 40 ∧ (12 : ℝ) * 16 / 2 = 96 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, by norm_num, by norm_num⟩
  rw [show (100 : ℝ) = 10 ^ 2 by norm_num, sqrt_kv (by norm_num)]

/-- Primer 1 (geometrijsko): romb z diagonalama 12 in 16 (u = 6 − 8i, w = 6 + 8i v ℂ) ima stranico 10.
trditev: MAT-SS-1/stirikotniki-in-krog#primer1-geo
besedilo: »$a = \sqrt{6^2 + 8^2} = \sqrt{100} = 10\,\text{cm}$.« -/
theorem primer1_geo : ‖(⟨6, -8⟩ : ℂ)‖ = 10 ∧ ‖(⟨6, -8⟩ : ℂ)‖ = ‖(⟨6, 8⟩ : ℂ)‖ ∧
    ‖(⟨6, -8⟩ : ℂ) + ⟨6, 8⟩‖ = 12 ∧ ‖(⟨6, 8⟩ : ℂ) - ⟨6, -8⟩‖ = 16 := by
  refine ⟨?_, ?_, ?_, ?_⟩ <;> rw [Complex.norm_eq_sqrt_sq_add_sq] <;> try rw [Complex.norm_eq_sqrt_sq_add_sq]
  all_goals norm_num

/-- Primer 2: x = (14 − 8)/2 = 3, v = √(5² − 3²) = √16 = 4, S = (14 + 8)·4/2 = 44, o = 14 + 5 + 8 + 5 = 32.
trditev: MAT-SS-1/stirikotniki-in-krog#primer2
besedilo: »Odgovor: višina je $4\,\text{cm}$, ploščina $44\,\text{cm}^2$, obseg $32\,\text{cm}$.« -/
theorem primer2 : ((14 : ℝ) - 8) / 2 = 3 ∧ √((5 : ℝ) ^ 2 - 3 ^ 2) = √16 ∧ √(16 : ℝ) = 4 ∧
    ((14 : ℝ) + 8) * 4 / 2 = 44 ∧ (14 : ℝ) + 5 + 8 + 5 = 32 := by
  refine ⟨by norm_num, by norm_num, ?_, by norm_num, by norm_num⟩
  rw [show (16 : ℝ) = 4 ^ 2 by norm_num, sqrt_kv (by norm_num)]

/-- Primer 3: φ = 80/2 = 40, ∠ADB = 180 − 40 = 140, l = π·9·80/180 = 4π ≈ 12,57, S = π·9²·80/360 = 18π ≈ 56,55.
trditev: MAT-SS-1/stirikotniki-in-krog#primer3
besedilo: »Odgovor: $\varphi = 40^\circ$, $\angle ADB = 140^\circ$, svinčeni rob je dolg $4\pi\,\text{cm} \approx 12{,}57\,\text{cm}$, barvno steklo ima ploščino $18\pi\,\text{cm}^2 \approx 56{,}55\,\text{cm}^2$.« -/
theorem primer3 : (80 : ℝ) / 2 = 40 ∧ (180 : ℝ) - 40 = 140 ∧ π * 9 * 80 / 180 = 4 * π ∧
    π * 9 ^ 2 * 80 / 360 = 18 * π ∧ |4 * π - 1257 / 100| < 5 / 1000 ∧ |18 * π - 5655 / 100| < 5 / 1000 := by
  obtain ⟨l, u⟩ := pi_meje
  refine ⟨by norm_num, by norm_num, by ring, by ring, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Primer 4 (premisli): d² = 90² + 200² = 8100 + 40000 = 48100, d = √48100 ≈ 219,3 (≈ 219).
trditev: MAT-SS-1/stirikotniki-in-krog#primer4
besedilo: »$d = \sqrt{48100} \approx 219{,}3\,\text{cm}$. Obe diagonali morata meriti približno $219\,\text{cm}$« -/
theorem primer4 : (90 : ℝ) ^ 2 + 200 ^ 2 = 8100 + 40000 ∧ (8100 : ℝ) + 40000 = 48100 ∧
    |√(48100 : ℝ) - 2193 / 10| < 5 / 100 ∧ |√(48100 : ℝ) - 219| < 1 / 2 := by
  have l : (2192 / 10 : ℝ) < √48100 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have l2 : (21928 / 100 : ℝ) < √48100 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u : √(48100 : ℝ) < 21932 / 100 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num, by norm_num, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Pogoste napake: paralelogram 10·6 = 60 je ploščina pravokotnika; obodni kot nad 100° je 50°.
trditev: MAT-SS-1/stirikotniki-in-krog#napake
besedilo: »Za lok, ki ustreza kotu $100^\circ$ v središču, je obodni kot $50^\circ$.« -/
theorem napake : (10 : ℝ) * 6 = 60 ∧ (100 : ℝ) / 2 = 50 := by norm_num

/-- Naloga 1 in `RACUN`: ∠B = ∠D = 90° (Tales), ∠CAD = 76/2 = 38, ∠BAD = 34 + 38 = 72, ∠BCD = 180 − 72 = 108,
preizkus 72 + 90 + 108 + 90 = 360.
trditev: MAT-SS-1/stirikotniki-in-krog#naloga1
besedilo: »$\angle CAD = \dfrac{76^\circ}{2} = 38^\circ$. Diagonala $AC$ razdeli kot pri $A$ na dva dela: $\angle BAD = 34^\circ + 38^\circ = 72^\circ$. 3. Štirikotnik je tetiven, zato imata nasprotna kota vsoto $180^\circ$: $\angle BCD = 180^\circ - 72^\circ = 108^\circ$. 4. Preverimo z vsoto kotov štirikotnika: $72^\circ + 90^\circ + 108^\circ + 90^\circ = 360^\circ$.« -/
theorem naloga1 : (76 : ℝ) / 2 = 38 ∧ (34 : ℝ) + 38 = 72 ∧ (180 : ℝ) - 72 = 108 ∧ (72 : ℝ) + 90 + 108 + 90 = 360 := by
  norm_num

/-- Naloga 2 a) (splošno): razdalja središča S od tetive AB (|SA| = |SB| = r) do njenega razpolovišča E je
|SE|² = r² − (|AB|/2)², in SE ⊥ AB.
trditev: MAT-SS-1/stirikotniki-in-krog#tetiva-razdalja
besedilo: »Simetrala tetive gre skozi središče krožnice, zato je $SE \perp AB$.« -/
theorem tetiva_razdalja {A B S : P} {r : ℝ} (hA : dist S A = r) (hB : dist S B = r) :
    dist S (midpoint ℝ A B) ^ 2 = r ^ 2 - (dist A B / 2) ^ 2 ∧
      inner ℝ (S -ᵥ midpoint ℝ A B) (B -ᵥ A) = 0 := by
  have h := dist_sq_add_dist_sq_eq_two_mul_dist_midpoint_sq_add_half_dist_sq S A B
  rw [hA, hB] at h
  refine ⟨by linarith, ?_⟩
  apply inner_vsub_vsub_of_dist_eq_of_dist_eq
  · rw [dist_left_midpoint (𝕜 := ℝ), dist_right_midpoint (𝕜 := ℝ)]
  · rw [dist_comm, hA, dist_comm, hB]

/-- Predpostavke trditve `tetiva_razdalja` se dajo izpolniti (S = 0, A = 1, B = −1, r = 1 v ℂ). -/
example : dist (0 : ℂ) 1 = 1 ∧ dist (0 : ℂ) (-1) = 1 := by simp [Complex.dist_eq]

/-- Naloga 2 in `RACUN`: |SE| = √(13² − 12²) = √25 = 5, |SF| = √(13² − 5²) = √144 = 12, v = 5 + 12 = 17,
(24 − 10)/2 = 7, b = √(7² + 17²) = √338 ≈ 18,3848 ≈ 18,38, o = 24 + 10 + 2√338 ≈ 70,770 ≈ 70,77,
S = (24 + 10)·17/2 = 289, πr² = 169π ≈ 530,93, delež 289/(169π) ≈ 0,5443 ≈ 54,4 %.
trditev: MAT-SS-1/stirikotniki-in-krog#naloga2
besedilo: »Odgovor: a) $|SE| = 5\,\text{cm}$, $|SF| = 12\,\text{cm}$, višina meri $17\,\text{cm}$; b) krak meri približno $18{,}38\,\text{cm}$, obseg približno $70{,}77\,\text{cm}$; c) trapez pokriva približno $54{,}4\,\%$ kroga.« -/
theorem naloga2 : √((13 : ℝ) ^ 2 - 12 ^ 2) = √25 ∧ √(25 : ℝ) = 5 ∧ √((13 : ℝ) ^ 2 - 5 ^ 2) = √144 ∧
    √(144 : ℝ) = 12 ∧ (5 : ℝ) + 12 = 17 ∧ ((24 : ℝ) - 10) / 2 = 7 ∧ √((7 : ℝ) ^ 2 + 17 ^ 2) = √338 ∧
    |√(338 : ℝ) - 183848 / 10000| < 5 / 100000 ∧ |√(338 : ℝ) - 1838 / 100| < 5 / 1000 ∧
    |24 + 10 + 2 * √(338 : ℝ) - 70770 / 1000| < 5 / 10000 ∧ |24 + 10 + 2 * √(338 : ℝ) - 7077 / 100| < 5 / 1000 ∧
    ((24 : ℝ) + 10) * 17 / 2 = 289 ∧ |169 * π - 53093 / 100| < 5 / 1000 ∧
    |289 / (169 * π) - 5443 / 10000| < 5 / 100000 ∧ |289 / (169 * π) * 100 - 544 / 10| < 5 / 100 := by
  obtain ⟨pl, pu⟩ := pi_meje
  have l : (18384776 / 1000000 : ℝ) < √338 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u : √(338 : ℝ) < 18384777 / 1000000 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  have hp : 0 < 169 * π := by positivity
  refine ⟨by norm_num, ?_, by norm_num, ?_, by norm_num, by norm_num, by norm_num, ?_, ?_, ?_, ?_, by norm_num,
    ?_, ?_, ?_⟩
  · rw [show (25 : ℝ) = 5 ^ 2 by norm_num, sqrt_kv (by norm_num)]
  · rw [show (144 : ℝ) = 12 ^ 2 by norm_num, sqrt_kv (by norm_num)]
  all_goals rw [abs_lt]; constructor
  all_goals first
    | linarith
    | (rw [lt_sub_iff_add_lt, lt_div_iff₀ hp]; nlinarith)
    | (rw [sub_lt_iff_lt_add, div_lt_iff₀ hp]; nlinarith)
    | (rw [lt_sub_iff_add_lt, div_mul_eq_mul_div, lt_div_iff₀ hp]; nlinarith)
    | (rw [sub_lt_iff_lt_add, div_mul_eq_mul_div, div_lt_iff₀ hp]; nlinarith)

/-- Korak za korakom (pravokotnik 9 × 12): S = 108, o = 2(9 + 12) = 42, d = √(9² + 12²) = √225 = 15, R = 7,5,
S_k = π·7,5² = 56,25π ≈ 176,71, delež 108/(56,25π) ≈ 0,611 (≈ 61 %), o_k = 2π·7,5 = 15π ≈ 47,12 > 42.
trditev: MAT-SS-1/stirikotniki-in-krog#korak-za-korakom
besedilo: »**Polmer očrtane krožnice:** $R = \dfrac{d}{2} = 7{,}5\,\text{cm}$. 5. **Ploščina kroga:** $S_k = \pi \cdot 7{,}5^2 = 56{,}25\pi \approx 176{,}71\,\text{cm}^2$. 6. **Delež pravokotnika v krogu:** $\dfrac{108}{176{,}71} \approx 0{,}611$, torej približno $61\,\%$. 7. **Obseg kroga:** $o = 2\pi \cdot 7{,}5 = 15\pi \approx 47{,}12\,\text{cm}$, kar je več kot obseg pravokotnika ($42\,\text{cm}$).« -/
theorem korak_za_korakom : (9 : ℝ) * 12 = 108 ∧ (2 : ℝ) * (9 + 12) = 42 ∧ √((9 : ℝ) ^ 2 + 12 ^ 2) = √225 ∧
    √(225 : ℝ) = 15 ∧ (15 : ℝ) / 2 = 75 / 10 ∧ π * (75 / 10) ^ 2 = 5625 / 100 * π ∧
    |5625 / 100 * π - 17671 / 100| < 5 / 1000 ∧ |108 / (5625 / 100 * π) - 611 / 1000| < 5 / 10000 ∧
    |108 / (5625 / 100 * π) * 100 - 61| < 1 / 2 ∧ 2 * π * (75 / 10) = 15 * π ∧ |15 * π - 4712 / 100| < 5 / 1000 ∧
    42 < 15 * π := by
  obtain ⟨pl, pu⟩ := pi_meje
  have hp : 0 < 5625 / 100 * π := by positivity
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, by norm_num, by ring, ?_, ?_, ?_, by ring, ?_, by linarith⟩
  · rw [show (225 : ℝ) = 15 ^ 2 by norm_num, sqrt_kv (by norm_num)]
  all_goals rw [abs_lt]; constructor
  all_goals first
    | linarith
    | (rw [lt_sub_iff_add_lt, lt_div_iff₀ hp]; nlinarith)
    | (rw [sub_lt_iff_lt_add, div_lt_iff₀ hp]; nlinarith)
    | (rw [lt_sub_iff_add_lt, div_mul_eq_mul_div, lt_div_iff₀ hp]; nlinarith)
    | (rw [sub_lt_iff_lt_add, div_mul_eq_mul_div, div_lt_iff₀ hp]; nlinarith)

/-- Kot zgodba: 3² + 4² = 25 = 5² (obrat Pitagore, `pravokotnik`), S = (180 + 120)·80/2 = 12000 cm² = 1,2 m²,
2π·30 ≈ 188,5, π·30² ≈ 2827.
trditev: MAT-SS-1/stirikotniki-in-krog#zgodba
besedilo: »$S = \dfrac{(180 + 120) \cdot 80}{2} = 12000\,\text{cm}^2$, torej $1{,}2\,\text{m}^2$« -/
theorem zgodba : (3 : ℝ) ^ 2 + 4 ^ 2 = 25 ∧ (25 : ℝ) = 5 ^ 2 ∧ ((180 : ℝ) + 120) * 80 / 2 = 12000 ∧
    (12000 : ℝ) / 10000 = 12 / 10 ∧ |2 * π * 30 - 1885 / 10| < 5 / 100 ∧ |π * 30 ^ 2 - 2827| < 1 / 2 := by
  obtain ⟨l, u⟩ := pi_meje
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-! ## Preveri se
Preveri se 1 (romb) pokrivata `romb` in `paralelogram`, Preveri se 3 (obodna kota nad istim lokom) `obodna_enaka`,
Preveri se 5 (središče s kotnikom) `tales`. -/

/-- Preveri se 2: r = 0,6, S = π·0,6² = 0,36π ≈ 1,13 (napačni: π·1,2² ≈ 4,52, obseg 2π·0,6 ≈ 3,77).
trditev: MAT-SS-1/stirikotniki-in-krog#kviz2
besedilo: »$r = 0{,}6\,\text{m}$, $S = \pi r^2 = \pi \cdot 0{,}36 \approx 1{,}13\,\text{m}^2$.« -/
theorem kviz2 : (12 / 10 : ℝ) / 2 = 6 / 10 ∧ π * (6 / 10) ^ 2 = 36 / 100 * π ∧ |36 / 100 * π - 113 / 100| < 5 / 1000 ∧
    |π * (12 / 10) ^ 2 - 452 / 100| < 5 / 1000 ∧ |2 * π * (6 / 10) - 377 / 100| < 5 / 1000 := by
  obtain ⟨l, u⟩ := pi_meje
  refine ⟨by norm_num, by ring, ?_, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> nlinarith

/-- Preveri se 4: S = (11 + 9)v/2 = 60 ⇔ v = 6 (napačno: 60/20 = 3, 60/11 ≈ 5,45).
trditev: MAT-SS-1/stirikotniki-in-krog#kviz4
besedilo: »Iz $S = \dfrac{(a + c)\, v}{2}$ sledi $v = \dfrac{2S}{a + c} = \dfrac{120}{20} = 6\,\text{cm}$.« -/
theorem kviz4 (v : ℝ) : ((11 : ℝ) + 9) * v / 2 = 60 ↔ v = 6 := by
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Preveri se 4 (napačni odgovori): 60/20 = 3 in 60/11 ≈ 5,45.
trditev: MAT-SS-1/stirikotniki-in-krog#kviz4-napacni
besedilo: »Računal si kot pri paralelogramu z eno osnovnico, $\dfrac{60}{11} \approx 5{,}45$.« -/
theorem kviz4_napacni : (60 : ℝ) / 20 = 3 ∧ |(60 : ℝ) / 11 - 545 / 100| < 5 / 1000 := by
  refine ⟨by norm_num, ?_⟩; rw [abs_lt]; norm_num

end Evklid.Lekcije.MAT_SS_1.StirikotnikiInKrog
