/-
vir: content/lessons/MAT-OS-7/vrste-trikotnikov-in-notranji-koti.md
sha256: 00c274e2de1ff06de26eb6ed0b4caa5cf29b4414a8ca2f1d1288ca90f8f32d1c
Model: geometrijske trditve so v poljubnem evklidskem prostoru (točke A, B, C : P, kot ∠ A B C iz Mathliba v
radianih, pretvorjen v stopinje z `deg x = x·180/π`); notranji koti so α = ∠BAC, β = ∠ABC, γ = ∠ACB, zunanji
kot pri C je ∠ACD, kjer D leži na podaljšku BC čez C (∠BCD = π, tj. C leži med B in D). Mathlib za vsoto kotov
potrebuje le B ≠ A, za obrat izreka o enakokrakem trikotniku pa kot pri vrhu ≠ 180° (velja v vsakem pravem
trikotniku). Računske trditve so za kote v stopinjah kot realna števila: `Trikotnik α β γ` pomeni α, β, γ > 0 in
α + β + γ = 180 (vsota je dokazana zgoraj; pozitivnost je dogovor, da trikotnik ni izrojen); ostri kot < 90°,
pravi = 90°, topi > 90°. Primer 3 računa s stopinjami in minutami kot st s m = s + m/60 (ℚ). Primeri točk za
`example` so v ℂ kot evklidski ravnini.
Ni v Leanu: poskus s papirjem in škarjami ter tesarji in mizarji (opis); poimenovanje delov trikotnika (oglišča,
stranice, »stranica a leži nasproti oglišča A«, kraka, osnovnica, vrh) in razvrstitev po stranicah in kotih kot
definicije; slika z vzporednico skozi C (Na sliki, Bolj natančno: »kota s paroma vzporednima, nasprotno obrnjenima
krakoma sta enaka«) je drug dokaz iste trditve, dokazana je trditev vsota = 180° (Mathlib); »obhod okoli
trikotnika je poln obrat« (opis; dokazana je vsota zunanjih kotov 360°); simulacija »Vrste trikotnikov in vsota
kotov« (opis); v Primeru 1 je »enakokrak« dokazan s splošnim obratom izreka (`enaka_kota_enaka_kraka`), račun
pa s koti; besedilo napačnih odgovorov kvizov (dokazano je, da napačne vrednosti niso pravilne).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.VrsteTrikotnikovInNotranjiKoti

open EuclideanGeometry Real

/-- Kot v radianih, pretvorjen v stopinje. -/
noncomputable def deg (x : ℝ) : ℝ := x * 180 / π

/-! ## Geometrija (Mathlib): vsota kotov, zunanji kot, enakokraki trikotnik -/

section Geometrija

variable {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
  [NormedAddTorsor V P]

/-- Razlaga 4, Povzetek, Zakaj se tega učimo in Bolj natančno: vsota notranjih kotov trikotnika je
α + β + γ = 180° (B ≠ A). -/
theorem vsota_notranjih (A B C : P) (h : B ≠ A) : deg (∠ B A C) + deg (∠ A B C) + deg (∠ A C B) = 180 := by
  have e := angle_add_angle_add_angle_eq_pi C h
  rw [angle_comm B C A, angle_comm C A B] at e
  have e' : ∠ B A C + ∠ A B C + ∠ A C B = π := by linarith
  calc deg (∠ B A C) + deg (∠ A B C) + deg (∠ A C B) = (∠ B A C + ∠ A B C + ∠ A C B) * 180 / π := by
        unfold deg; ring
    _ = 180 := by rw [e']; field_simp

/-- Razlaga 6, 7 in Povzetek: zunanji kot γ' = ∠ACD (D na podaljšku BC čez C) in notranji kot γ sta sokota
(γ + γ' = 180°), zunanji kot pa je vsota nesosednjih notranjih kotov: γ' = α + β (B ≠ A). -/
theorem zunanji_kot (A B C D : P) (h : B ≠ A) (hD : ∠ B C D = π) :
    deg (∠ A C B) + deg (∠ A C D) = 180 ∧ deg (∠ A C D) = deg (∠ B A C) + deg (∠ A B C) := by
  have s := angle_add_angle_eq_pi_of_angle_eq_pi A hD
  have v := vsota_notranjih A B C h
  have s' : deg (∠ A C B) + deg (∠ A C D) = 180 := by
    calc deg (∠ A C B) + deg (∠ A C D) = (∠ A C B + ∠ A C D) * 180 / π := by unfold deg; ring
      _ = 180 := by rw [s]; field_simp
  exact ⟨s', by linarith⟩

/-- Razlaga 8, Povzetek in Bolj natančno: pri vsakem oglišču vzamemo en zunanji kot (E na podaljšku CA čez A,
F na podaljšku AB čez B, D na podaljšku BC čez C); vsota α' + β' + γ' = 3·180° − 180° = 360° (B ≠ A). -/
theorem vsota_zunanjih (A B C D E F : P) (h : B ≠ A) (hE : ∠ C A E = π) (hF : ∠ A B F = π)
    (hD : ∠ B C D = π) : deg (∠ B A E) + deg (∠ C B F) + deg (∠ A C D) = 360 := by
  have sA := angle_add_angle_eq_pi_of_angle_eq_pi B hE
  have sB := angle_add_angle_eq_pi_of_angle_eq_pi C hF
  have sC := angle_add_angle_eq_pi_of_angle_eq_pi A hD
  have e := angle_add_angle_add_angle_eq_pi C h
  rw [angle_comm B C A, angle_comm C A B] at e
  rw [angle_comm C B A] at sB
  have t : ∠ B A E + ∠ C B F + ∠ A C D = 2 * π := by linarith
  calc deg (∠ B A E) + deg (∠ C B F) + deg (∠ A C D) = (∠ B A E + ∠ C B F + ∠ A C D) * 180 / π := by
        unfold deg; ring
    _ = 360 := by rw [t]; field_simp; ring

/-- Razlaga 2 in Povzetek: v enakokrakem trikotniku (kraka CA = CB) sta kota ob osnovnici enaka. -/
theorem enakokraki_koti (A B C : P) (h : dist C A = dist C B) : ∠ C A B = ∠ C B A :=
  angle_eq_angle_of_dist_eq h

/-- Razlaga 2 (obrat): če sta kota ob AB enaka in kot pri C ni 180°, je trikotnik enakokrak (CA = CB). -/
theorem enaka_kota_enaka_kraka (A B C : P) (h : ∠ C A B = ∠ C B A) (hpi : ∠ A C B ≠ π) : dist C A = dist C B :=
  dist_eq_of_angle_eq_angle_of_angle_ne_pi h hpi

/-- Razlaga 2 (tabela): v raznostraničnem trikotniku (vse stranice različno dolge, noben kot 180°) so vsi koti
različni. -/
theorem raznostranicni_koti (A B C : P) (hab : dist A B ≠ dist A C) (hbc : dist B A ≠ dist B C)
    (hca : dist C A ≠ dist C B) (hA : ∠ B A C ≠ π) (hB : ∠ A B C ≠ π) (hC : ∠ A C B ≠ π) :
    ∠ B A C ≠ ∠ A B C ∧ ∠ A B C ≠ ∠ A C B ∧ ∠ A C B ≠ ∠ B A C := by
  refine ⟨fun e => hca ?_, fun e => hab ?_, fun e => hbc ?_⟩
  · apply enaka_kota_enaka_kraka A B C _ hC
    rw [angle_comm C A B, angle_comm C B A]; exact e
  · exact dist_eq_of_angle_eq_angle_of_angle_ne_pi e hA
  · apply dist_eq_of_angle_eq_angle_of_angle_ne_pi _ hB
    rw [angle_comm B C A]; exact e.symm

/-- Razlaga 5 in Povzetek: enakostranični trikotnik (AB = BC = CA, A ≠ B) ima vse kote po 60°; je tudi
enakokrak (CA = CB). -/
theorem enakostranicni (A B C : P) (h1 : dist A B = dist B C) (h2 : dist B C = dist C A) (h : B ≠ A) :
    deg (∠ B A C) = 60 ∧ deg (∠ A B C) = 60 ∧ deg (∠ A C B) = 60 ∧ dist C A = dist C B := by
  have hCAB : dist C A = dist C B := by rw [dist_comm C B]; exact h2.symm
  have hABC : dist A B = dist A C := by rw [dist_comm A C, ← h2, h1]
  have e1 := angle_eq_angle_of_dist_eq hCAB
  have e2 := angle_eq_angle_of_dist_eq hABC
  rw [angle_comm C A B, angle_comm C B A] at e1
  have v := vsota_notranjih A B C h
  have d1 : deg (∠ B A C) = deg (∠ A B C) := by rw [e1]
  have d2 : deg (∠ A B C) = deg (∠ A C B) := by rw [e2]
  refine ⟨by linarith, by linarith, by linarith, hCAB⟩

end Geometrija

/-- Pomožno (ℂ kot ravnina): če je r − q = −(p − q) in p ≠ q, je ∠ p q r = 180° (q leži med p in r). -/
theorem kot_pi_C (p q r : ℂ) (h : r - q = -(p - q)) (hne : p ≠ q) : ∠ p q r = π := by
  unfold EuclideanGeometry.angle
  rw [vsub_eq_sub, vsub_eq_sub, h]
  exact InnerProductGeometry.angle_self_neg_of_ne_zero (sub_ne_zero.mpr hne)

/-- Pomožno (ℂ kot ravnina): če p, q, r niso na premici (vektorski produkt ≠ 0), ∠ p q r ni 180°. -/
theorem kot_ne_pi_C (p q r : ℂ)
    (h : (p - q).re * (r - q).im - (p - q).im * (r - q).re ≠ 0) : ∠ p q r ≠ π := by
  intro e
  unfold EuclideanGeometry.angle at e
  rw [vsub_eq_sub, vsub_eq_sub] at e
  obtain ⟨-, t, -, ht⟩ := InnerProductGeometry.angle_eq_pi_iff.mp e
  apply h
  rw [ht]
  simp only [Complex.real_smul, Complex.mul_re, Complex.mul_im, Complex.ofReal_re, Complex.ofReal_im]
  ring

/-- Predpostavke `vsota_notranjih` in `zunanji_kot` se dajo izpolniti: A = i, B = 0, C = 1, D = 2 v ℂ. -/
example : (0 : ℂ) ≠ Complex.I ∧ ∠ (0 : ℂ) 1 2 = π := by
  refine ⟨fun h => Complex.I_ne_zero h.symm, kot_pi_C 0 1 2 (by ring) (by norm_num)⟩

/-- Predpostavke `vsota_zunanjih` se dajo izpolniti: A = i, B = 0, C = 1, E = 2i − 1, F = −i, D = 2 v ℂ. -/
example : (0 : ℂ) ≠ Complex.I ∧ ∠ (1 : ℂ) Complex.I (2 * Complex.I - 1) = π ∧
    ∠ Complex.I (0 : ℂ) (-Complex.I) = π ∧ ∠ (0 : ℂ) 1 2 = π := by
  refine ⟨fun h => Complex.I_ne_zero h.symm, kot_pi_C _ _ _ (by ring) ?_,
    kot_pi_C _ _ _ (by ring) Complex.I_ne_zero, kot_pi_C 0 1 2 (by ring) (by norm_num)⟩
  intro h
  have := congrArg Complex.im h
  simp at this

/-- Predpostavke `enakokraki_koti` in `enaka_kota_enaka_kraka` se dajo izpolniti: A = −1, B = 1, C = i v ℂ
(CA = CB = √2, kot pri C ni 180°). -/
example : dist Complex.I (-1) = dist Complex.I 1 ∧ ∠ (-1 : ℂ) Complex.I 1 ≠ π ∧
    ∠ Complex.I (-1 : ℂ) 1 = ∠ Complex.I (1 : ℂ) (-1) := by
  have hd : dist Complex.I (-1) = dist Complex.I 1 := by
    simp [Complex.dist_eq, Complex.norm_eq_sqrt_sq_add_sq]
  refine ⟨hd, kot_ne_pi_C _ _ _ (by simp), angle_eq_angle_of_dist_eq hd⟩

/-- Predpostavke `raznostranicni_koti` se dajo izpolniti: A = 0, B = 2, C = i v ℂ (stranice 2, 1, √5). -/
example : dist (0 : ℂ) 2 ≠ dist (0 : ℂ) Complex.I ∧ dist (2 : ℂ) 0 ≠ dist (2 : ℂ) Complex.I ∧
    dist Complex.I (0 : ℂ) ≠ dist Complex.I (2 : ℂ) ∧ ∠ (2 : ℂ) 0 Complex.I ≠ π ∧ ∠ (0 : ℂ) 2 Complex.I ≠ π ∧
    ∠ (0 : ℂ) Complex.I 2 ≠ π := by
  have s5 : Real.sqrt 5 ≠ 2 := by
    intro h; have := Real.sq_sqrt (show (0 : ℝ) ≤ 5 by norm_num); rw [h] at this; norm_num at this
  have s5' : Real.sqrt 5 ≠ 1 := by
    intro h; have := Real.sq_sqrt (show (0 : ℝ) ≤ 5 by norm_num); rw [h] at this; norm_num at this
  refine ⟨?_, ?_, ?_, kot_ne_pi_C _ _ _ (by simp), kot_ne_pi_C _ _ _ (by simp), kot_ne_pi_C _ _ _ (by simp)⟩
  · simp [Complex.dist_eq]
  · simp [Complex.dist_eq, Complex.norm_eq_sqrt_sq_add_sq]
    norm_num
    exact fun h => s5 h.symm
  · simp [Complex.dist_eq, Complex.norm_eq_sqrt_sq_add_sq]
    norm_num
    exact fun h => s5' h.symm

/-- Predpostavke `enakostranicni` se dajo izpolniti: A = 0, B = 1, C = 1/2 + (√3/2)i v ℂ (vse stranice 1). -/
example : dist (0 : ℂ) 1 = dist (1 : ℂ) (1 / 2 + (Real.sqrt 3 / 2 : ℝ) * Complex.I) ∧
    dist (1 : ℂ) (1 / 2 + (Real.sqrt 3 / 2 : ℝ) * Complex.I) =
      dist (1 / 2 + (Real.sqrt 3 / 2 : ℝ) * Complex.I) (0 : ℂ) ∧ (1 : ℂ) ≠ 0 := by
  have h3 : (Real.sqrt 3 / 2) ^ 2 = 3 / 4 := by
    rw [div_pow, Real.sq_sqrt (by norm_num)]; norm_num
  refine ⟨?_, ?_, one_ne_zero⟩
  · simp only [Complex.dist_eq, Complex.norm_eq_sqrt_sq_add_sq]
    simp
    rw [h3]; norm_num
  · simp only [Complex.dist_eq, Complex.norm_eq_sqrt_sq_add_sq]
    simp
    rw [h3]; norm_num

/-! ## Računanje s koti (stopinje) -/

/-- Trikotnik s koti α, β, γ (v stopinjah): vsi koti so pozitivni in α + β + γ = 180. -/
def Trikotnik (α β γ : ℝ) : Prop := 0 < α ∧ 0 < β ∧ 0 < γ ∧ α + β + γ = 180

/-- Razlaga 4: tretji kot dobiš z odštevanjem: α + β + γ = 180° ⇔ γ = 180° − α − β. -/
theorem tretji_kot (α β γ : ℝ) : α + β + γ = 180 ↔ γ = 180 - α - β := by
  constructor <;> intro h <;> linarith

/-- Razlaga 4 (premisli), Povzetek in kviz 3: trikotnik ima največ en pravi ali topi kot (dva kota ≥ 90° bi skupaj
merila vsaj 180°, za tretjega ne bi ostalo nič). -/
theorem najvec_en_neostri (α β γ : ℝ) (t : Trikotnik α β γ) :
    ¬ (90 ≤ α ∧ 90 ≤ β) ∧ ¬ (90 ≤ β ∧ 90 ≤ γ) ∧ ¬ (90 ≤ α ∧ 90 ≤ γ) := by
  obtain ⟨ha, hb, hc, s⟩ := t
  refine ⟨fun ⟨h1, h2⟩ => ?_, fun ⟨h1, h2⟩ => ?_, fun ⟨h1, h2⟩ => ?_⟩ <;> linarith

/-- Predpostavka `Trikotnik` se da izpolniti (55°, 70°, 55° iz Primera 1). -/
example : Trikotnik 55 70 55 := by unfold Trikotnik; norm_num

/-- Razlaga 3: trikotnik s koti 30°, 60°, 90° je pravokotni (en pravi kot, ostala ostra). -/
theorem preveri_30_60_90 : Trikotnik 30 60 90 ∧ (90 : ℝ) = 90 ∧ (30 : ℝ) < 90 ∧ (60 : ℝ) < 90 := by
  unfold Trikotnik; norm_num

/-- Razlaga 5 in Povzetek: enakostranični trikotnik (trije enaki koti) ima vse kote 180° : 3 = 60°. -/
theorem enakostranicni_60 (α : ℝ) : α + α + α = 180 ↔ α = 60 := by
  constructor <;> intro h <;> linarith

/-- Razlaga 5, Povzetek in Primer 2: v enakokrakem trikotniku (α = β) sta kota ob osnovnici (180° − γ) : 2. -/
theorem enakokraki_osnovnica (α β γ : ℝ) (hab : α = β) (s : α + β + γ = 180) : α = (180 - γ) / 2 := by
  subst hab; linarith

/-- Predpostavke `enakokraki_osnovnica` se dajo izpolniti (40°, 40°, 100°). -/
example : (40 : ℝ) = 40 ∧ (40 : ℝ) + 40 + 100 = 180 := by norm_num

/-- Razlaga 5 in Povzetek: v pravokotnem trikotniku (γ = 90°) sta ostra kota komplementarna: α + β = 90°. -/
theorem pravokotni_komplementarna (α β γ : ℝ) (hg : γ = 90) (s : α + β + γ = 180) : α + β = 90 := by
  linarith

/-- Predpostavke `pravokotni_komplementarna` se dajo izpolniti (37°, 53°, 90°). -/
example : (90 : ℝ) = 90 ∧ (37 : ℝ) + 53 + 90 = 180 := by norm_num

/-- Razlaga 5 (preveri) in kviz 1: v pravokotnem trikotniku z ostrim kotom 45° je drugi 45° (trikotnik je
enakokrak); 90°, 45°, 45° je trikotnik. -/
theorem preveri_45 (β : ℝ) : 45 + β + 90 = 180 ↔ β = 45 := by
  constructor <;> intro h <;> linarith

/-- Razlaga 6 in Povzetek: zunanji kot α' = 180° − α; pri α = 70° je α' = 110°. -/
theorem zunanji_70 : (180 : ℝ) - 70 = 110 := by norm_num

/-- Razlaga 7 (izrek o zunanjem kotu, računsko): iz γ' = 180° − γ in α + β + γ = 180° sledi γ' = α + β. -/
theorem zunanji_racun (α β γ γ' : ℝ) (h : γ' = 180 - γ) (s : α + β + γ = 180) : γ' = α + β := by linarith

/-- Predpostavke `zunanji_racun` se dajo izpolniti (40°, 60°, 80°, 100°). -/
example : (100 : ℝ) = 180 - 80 ∧ (40 : ℝ) + 60 + 80 = 180 := by norm_num

/-- Razlaga 7 (premisli): zunanji kot je večji od vsakega od nesosednjih notranjih kotov (oba > 0°); pri
α = 40°, β = 60° je γ' = 100°. -/
theorem zunanji_vecji (α β : ℝ) (ha : 0 < α) (hb : 0 < β) : α < α + β ∧ β < α + β := by
  constructor <;> linarith

/-- Predpostavke `zunanji_vecji` se dajo izpolniti; primer 40° + 60° = 100°. -/
example : (0 : ℝ) < 40 ∧ (0 : ℝ) < 60 ∧ (40 : ℝ) + 60 = 100 := by norm_num

/-- Bolj natančno (računsko): α' + β' + γ' = (180° − α) + (180° − β) + (180° − γ) = 540° − 180° = 360°. -/
theorem zunanji_vsota_racun (α β γ : ℝ) (s : α + β + γ = 180) :
    (180 - α) + (180 - β) + (180 - γ) = 3 * 180 - (α + β + γ) ∧ 3 * 180 - (α + β + γ) = 540 - 180 ∧
      (540 : ℝ) - 180 = 360 := by
  refine ⟨by ring, by rw [s]; norm_num, by norm_num⟩

/-- Pogoste napake 2: zunanji in notranji kot pri istem oglišču sta enaka le pri pravem kotu. -/
theorem zunanji_enak_notranjemu (α : ℝ) : 180 - α = α ↔ α = 90 := by
  constructor <;> intro h <;> linarith

/-! ## Rešeni primeri -/

/-- Primer 1: γ = 180° − 55° − 70° = 55°; vsi koti < 90° (ostrokotni), α = γ (enakokraki); preverimo
55° + 70° + 55° = 180°. -/
theorem primer1 :
    (180 : ℝ) - 55 - 70 = 55 ∧ (55 : ℝ) < 90 ∧ (70 : ℝ) < 90 ∧ (55 : ℝ) = 55 ∧ (55 : ℝ) + 70 + 55 = 180 := by
  norm_num

/-- Primer 2: kota ob osnovnici skupaj merita 180° − 100° = 80°, vsak 80° : 2 = 40°; preverimo
40° + 40° + 100° = 180°. Rešitev je ena sama: α = β in α + β + 100° = 180° ⇔ α = β = 40°. -/
theorem primer2 (α β : ℝ) : (α = β ∧ α + β + 100 = 180) ↔ (α = 40 ∧ β = 40) := by
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Primer 2 (koraki): 180 − 100 = 80, 80 : 2 = 40, 40 + 40 + 100 = 180. -/
theorem primer2_koraki : (180 : ℝ) - 100 = 80 ∧ (80 : ℝ) / 2 = 40 ∧ (40 : ℝ) + 40 + 100 = 180 := by norm_num

/-- Kot s° m' v stopinjah: s + m/60. -/
def st (s m : ℚ) : ℚ := s + m / 60

/-- Primer 3: γ' = 116°15' = 115°75', β = γ' − α = 115°75' − 48°25' = 67°50'; γ = 180° − 116°15' = 179°60' − 116°15'
= 63°45'; preverimo 48°25' + 67°50' + 63°45' = 178°120' = 180°. -/
theorem primer3 :
    st 116 15 = st 115 75 ∧ st 115 75 - st 48 25 = st 67 50 ∧ 180 - st 116 15 = st 179 60 - st 116 15 ∧
      st 179 60 - st 116 15 = st 63 45 ∧ st 48 25 + st 67 50 + st 63 45 = st 178 120 ∧ st 178 120 = 180 := by
  unfold st; norm_num

/-- Primer 3: iz γ' = α + β in γ + γ' = 180° pri γ' = 116°15', α = 48°25' sledi natanko β = 67°50', γ = 63°45'. -/
theorem primer3_resitev (β γ : ℚ) :
    (st 116 15 = st 48 25 + β ∧ γ + st 116 15 = 180) ↔ (β = st 67 50 ∧ γ = st 63 45) := by
  unfold st
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Primer 4: β = 90° − 37° = 53°, α' = 180° − 37° = 143°; preverba z izrekom o zunanjem kotu 53° + 90° = 143°. -/
theorem primer4 : (90 : ℝ) - 37 = 53 ∧ (180 : ℝ) - 37 = 143 ∧ (53 : ℝ) + 90 = 143 := by norm_num

/-! ## Pogoste napake in Preveri se -/

/-- Pogoste napake 1 in kviz 2: pri kotih 89° in 88° je tretji 180° − 177° = 3° (ne 360° − 177° = 183°, ne
približno 90°). -/
theorem napaka_360 (γ : ℝ) :
    (89 + 88 + γ = 180 ↔ γ = 3) ∧ (89 : ℝ) + 88 = 177 ∧ (360 : ℝ) - 177 = 183 ∧ (183 : ℝ) ≠ 3 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num⟩

/-- Pogoste napake 5 in kviz 5: pri vrhu 110° ostane za osnovnico 180° − 110° = 70°, vsak kot 70° : 2 = 35°
(ne 70°, 110° ali (360° − 110°) : 2 = 125°). -/
theorem napaka_deljenje (α : ℝ) :
    (α + α + 110 = 180 ↔ α = 35) ∧ (180 : ℝ) - 110 = 70 ∧ (70 : ℝ) / 2 = 35 ∧ ((360 : ℝ) - 110) / 2 = 125 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num⟩

/-- Kviz 1: 90°, 45°, 45° je pravokoten in enakokrak trikotnik; 90°, 60°, 30° nima enakih kotov; 60°, 60°, 60°
nima pravega kota; 90°, 90°, 0° ni trikotnik (kot 0°). -/
theorem kviz1 :
    Trikotnik 90 45 45 ∧ ((90 : ℝ) ≠ 60 ∧ (60 : ℝ) ≠ 30 ∧ (90 : ℝ) ≠ 30) ∧ (60 : ℝ) ≠ 90 ∧ ¬ Trikotnik 90 90 0 := by
  unfold Trikotnik; norm_num

/-- Kviz 4: γ' = α + β, zato pri γ' = 130°, α = 50° velja natanko β = 80°; preverba γ = 180° − 130° = 50°,
50° + 80° + 50° = 180°; napačni 50°, 180°, 130° niso β. -/
theorem kviz4 (β : ℝ) :
    (130 = 50 + β ↔ β = 80) ∧ (180 : ℝ) - 130 = 50 ∧ (50 : ℝ) + 80 + 50 = 180 ∧ (50 : ℝ) ≠ 80 ∧
      (180 : ℝ) ≠ 80 ∧ (130 : ℝ) ≠ 80 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num⟩

end Evklid.Lekcije.MAT_OS_7.VrsteTrikotnikovInNotranjiKoti
