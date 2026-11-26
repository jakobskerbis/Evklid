/-
vir: content/lessons/MAT-OS-9/prizma.md
sha256: b62b0a9480354cfb53846dc5bb6fceb8137fc451d72a1360ee6e22e48f2610b2
Model: prostor je ℝ × (ℝ × ℝ) (prva koordinata je višina z) z Lebesgueovo mero (produktna mera). Prizma z
osnovno ploskvijo B ⊆ ℝ² (merljiva množica), višino v in stranskim robom v smeri (w, 1) je množica točk
(z, p) z 0 ≤ z ≤ v in p − z·w ∈ B (plast na višini z je B, premaknjena za z·w); w = 0 je pokončna prizma.
Dokazano je, da ima vsaka taka prizma (pokončna ali poševna) prostornino vol(B)·v, in Cavalierijevo
načelo (enako velike plasti na vsaki višini ⇒ enaka prostornina). Plašč pl = o·v je dokazan kot vsota
ploščin pravokotnikov a₁v + … + aₙv = (a₁ + … + aₙ)v; površina P = 2O + pl je ploščina mreže po definiciji
(vsota ploščin ploskev). Ploščine trikotnikov in trapeza (ab/2, (a + c)·h/2) so obrazci iz prejšnjih
lekcij. Decimalnih števil ni.
Ni v Leanu: risbe in mreža kot slika; definicije in poimenovanja (prizma, osnovna in stranska ploskev,
plašč, robovi, pokončna/poševna/pravilna prizma, tristrana …, kvader je štiristrana prizma); »stranske ploskve
pokončne prizme so pravokotniki in stranski rob je dolg v« kot geometrijska trditev; »pravokotnikov v plašču
je toliko, kolikor stranic ima osnovna ploskev« (opis mreže); »višina enakokrakega trikotnika razpolovi
osnovnico« (Primer 3) in »kateti sta pravokotni, zato je ena višina na drugo« (Primer 2) kot geometrijski
trditvi (dokazana je Pitagorova enačba za h oziroma c), enako »višina trapeza je 4, ker je
(10 − 4)/2 = 3« v Korak za korakom (dokazan je račun); »stranske ploskve so paralelogrami« (poševna
prizma) kot geometrijska trditev (zahtevno, še ni dokazano); enote (1 dm³ = 1 l je dokazano kot 10³ = 1000) in
nasvet o enotah; besedni premisli (zakaj 2O; kovček je »isto telo«: dokazana je enakost 15·4 = 12·5) in
navodila (Povzetek, zadnja alineja); Preveri se (1) o tem, kaj je plašč (poimenovanje); besedilo napačnih
odgovorov (dokazano je, da so napačne vrednosti take, kot pravi razlaga).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_9.Prizma

open MeasureTheory Set

/-! ## Prostornina: plasti in Cavalierijevo načelo -/

/-- Prizma z osnovno ploskvijo B, višino v in stranskim robom v smeri (w, 1): plast na višini z ∈ [0, v] je
osnovna ploskev B, premaknjena za z·w (w = 0: pokončna prizma). -/
noncomputable def prizma (B : Set (ℝ × ℝ)) (w : ℝ × ℝ) (v : ℝ) : Set (ℝ × (ℝ × ℝ)) :=
  {q | q.1 ∈ Icc 0 v ∧ q.2 - q.1 • w ∈ B}

/-- Bolj natančno (Cavalierijevo načelo): telesi, ki imata na vsaki višini z preseka z enako ploščino,
imata enako prostornino. -/
theorem cavalieri (S T : Set (ℝ × (ℝ × ℝ))) (hS : MeasurableSet S) (hT : MeasurableSet T)
    (h : ∀ z, volume (Prod.mk z ⁻¹' S) = volume (Prod.mk z ⁻¹' T)) : volume S = volume T := by
  rw [Measure.volume_eq_prod, Measure.prod_apply hS, Measure.prod_apply hT]
  simp_rw [h]

/-- Predpostavke trditve `cavalieri` se dajo izpolniti (S = T = ∅). -/
example : MeasurableSet (∅ : Set (ℝ × (ℝ × ℝ))) ∧
    ∀ z : ℝ, volume (Prod.mk z ⁻¹' (∅ : Set (ℝ × (ℝ × ℝ)))) = volume (Prod.mk z ⁻¹' (∅ : Set (ℝ × (ℝ × ℝ)))) :=
  ⟨MeasurableSet.empty, fun _ => rfl⟩

/-- Razlaga 1 in 5, Pogoste napake (prva), Povzetek, Bolj natančno: vsaka prizma, pokončna ali poševna,
ima prostornino V = O·v (O = vol(B)); nagib w prostornine ne spremeni. -/
theorem prostornina (B : Set (ℝ × ℝ)) (hB : MeasurableSet B) (w : ℝ × ℝ) (v : ℝ) :
    volume (prizma B w v) = volume B * ENNReal.ofReal v := by
  have hS : MeasurableSet (prizma B w v) :=
    (measurableSet_Icc.preimage measurable_fst).inter
      (hB.preimage (Continuous.measurable (by fun_prop)))
  rw [Measure.volume_eq_prod, Measure.prod_apply hS]
  have hz : ∀ z, volume (Prod.mk z ⁻¹' prizma B w v) = (Icc 0 v).indicator (fun _ => volume B) z := by
    intro z
    by_cases hzv : z ∈ Icc 0 v
    · rw [indicator_of_mem hzv]
      have e : Prod.mk z ⁻¹' prizma B w v = (fun p => p + -(z • w)) ⁻¹' B := by
        ext p; simp [prizma, hzv.1, hzv.2, sub_eq_add_neg]
      rw [e, measure_preimage_add_right]
    · rw [indicator_of_notMem hzv]
      have e : Prod.mk z ⁻¹' prizma B w v = ∅ := by
        ext p; simp only [prizma, mem_preimage, mem_ofPred_eq, mem_empty_iff_false, iff_false]
        exact fun h => hzv h.1
      rw [e, measure_empty]
  simp_rw [hz]
  rw [lintegral_indicator_const measurableSet_Icc, Real.volume_Icc, sub_zero, mul_comm]

/-- Predpostavka trditve `prostornina` se da izpolniti (B = ∅). -/
example : MeasurableSet (∅ : Set (ℝ × ℝ)) := MeasurableSet.empty

/-- Zakaj se tega učimo, Razlaga 1: kup zemljevidov 20 cm × 10 cm, visok 15 cm, ima pri vsakem nagibu w
prostornino 200 · 15 = 3000 cm³ (ne 200 · 18 = 3600 cm³). -/
theorem kup_zemljevidov (w : ℝ × ℝ) :
    (volume (prizma (Icc (0:ℝ) 20 ×ˢ Icc (0:ℝ) 10) w 15)).toReal = 3000 ∧
    (20:ℝ) * 10 = 200 ∧ (200:ℝ) * 15 = 3000 ∧ (200:ℝ) * 18 = 3600 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  rw [prostornina _ (measurableSet_Icc.prod measurableSet_Icc), Measure.volume_eq_prod,
    Measure.prod_prod, Real.volume_Icc, Real.volume_Icc, ENNReal.toReal_mul, ENNReal.toReal_mul,
    ENNReal.toReal_ofReal (by norm_num), ENNReal.toReal_ofReal (by norm_num),
    ENNReal.toReal_ofReal (by norm_num)]
  norm_num

/-! ## Plašč in površina -/

/-- Razlaga 7, Bolj natančno: plašč pokončne prizme so pravokotniki z višino v in širinami a₁, …, aₙ
(stranice osnovne ploskve): a₁v + … + aₙv = (a₁ + … + aₙ)·v = o·v. -/
theorem plasc {n : ℕ} (a : Fin n → ℝ) (v : ℝ) : ∑ i, a i * v = (∑ i, a i) * v := by
  rw [Finset.sum_mul]

/-- Razlaga 5, Bolj natančno: pri kvadru je O = a·b, v = c in V = (a·b)·c = a·b·c; površina 2O + o·v z
o = 2(a + b) je 2(ab + ac + bc) (Primer 1, korak 6). -/
theorem kvader (a b c : ℝ) :
    (a * b) * c = a * b * c ∧ 2 * (a * b) + 2 * (a + b) * c = 2 * (a * b + a * c + b * c) :=
  ⟨by ring, by ring⟩

/-- Pogoste napake (druga): če pozabimo eno osnovno ploskev (O + pl), je rezultat napačen za vsako
O ≠ 0. -/
theorem ena_osnovna_premalo (O pl : ℝ) (hO : O ≠ 0) : O + pl ≠ 2 * O + pl := by
  intro h; exact hO (by linarith)

/-- Predpostavka trditve `ena_osnovna_premalo` se da izpolniti (O = 1). -/
example : (1:ℝ) ≠ 0 := one_ne_zero

/-! ## Razlaga: kovček in mreža tristrane prizme -/

/-- Razlaga 5 (premisli): kovček 5 × 3 × 4: V = 15·4 = 60 dm³; postavljen na ploskev 3 × 4: O = 3·4 = 12,
v = 5, V = 12·5 = 60 dm³. -/
theorem kovcek_pokonci :
    (5:ℝ) * 3 = 15 ∧ (15:ℝ) * 4 = 60 ∧ (3:ℝ) * 4 = 12 ∧ (12:ℝ) * 5 = 60 := by norm_num

/-- Razlaga 6–8 (mreža): o = 3 + 4 + 5 = 12, pl = 12·6 = 72 = 3·6 + 4·6 + 5·6 = 18 + 24 + 30,
O = 3·4/2 = 6, O·v = 6·6 = 36 je prostornina (ne plašč, 36 ≠ 72), P = 2·6 + 72 = 84; trikotnik 3, 4, 5 je
pravokoten (3² + 4² = 5²). -/
theorem mreza :
    (3:ℝ) + 4 + 5 = 12 ∧ (12:ℝ) * 6 = 72 ∧ (3:ℝ) * 6 + 4 * 6 + 5 * 6 = 18 + 24 + 30 ∧
    (18:ℝ) + 24 + 30 = 72 ∧ (3:ℝ) * 4 / 2 = 6 ∧ (6:ℝ) * 6 = 36 ∧ (36:ℝ) ≠ 72 ∧ (2:ℝ) * 6 + 72 = 84 ∧
    (3:ℝ) ^ 2 + 4 ^ 2 = 5 ^ 2 := by norm_num

/-- Razlaga 9: 1 dm³ = 10³ cm³ = 1000 cm³ (= 1 l). -/
theorem dm3 : (10:ℝ) ^ 3 = 1000 := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 1 (kovček 5 × 3 × 4): O = 5·3 = 15, o = 2·(5 + 3) = 16, pl = 16·4 = 64, P = 2·15 + 64 = 94,
V = 15·4 = 60; preizkus 2(5·3 + 5·4 + 3·4) = 2·47 = 94. -/
theorem primer1 :
    (5:ℝ) * 3 = 15 ∧ (2:ℝ) * (5 + 3) = 16 ∧ (16:ℝ) * 4 = 64 ∧ (2:ℝ) * 15 + 64 = 94 ∧ (15:ℝ) * 4 = 60 ∧
    (2:ℝ) * (5 * 3 + 5 * 4 + 3 * 4) = 2 * 47 ∧ (2:ℝ) * 47 = 94 := by norm_num

/-- Primer 2, korak 1: hipotenuza c > 0 s c² = 6² + 8² je natanko c = 10, in √(6² + 8²) = √100 = 10. -/
theorem primer2_hipotenuza (c : ℝ) (hc : 0 < c) :
    (c ^ 2 = 6 ^ 2 + 8 ^ 2 ↔ c = 10) ∧ √((6:ℝ) ^ 2 + 8 ^ 2) = √100 ∧ √(100:ℝ) = 10 := by
  refine ⟨⟨fun h => by nlinarith [sq_nonneg (c - 10)], by rintro rfl; norm_num⟩, by norm_num, ?_⟩
  rw [show (100:ℝ) = 10 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Predpostavka trditve `primer2_hipotenuza` se da izpolniti (c = 10). -/
example : (0:ℝ) < 10 := by norm_num

/-- Primer 2, koraki 2–6: o = 6 + 8 + 10 = 24, O = 6·8/2 = 24, pl = 24·12 = 288 = 72 + 96 + 120
(6·12, 8·12, 10·12), P = 2·24 + 288 = 336, V = 24·12 = 288. -/
theorem primer2 :
    (6:ℝ) + 8 + 10 = 24 ∧ (6:ℝ) * 8 / 2 = 24 ∧ (24:ℝ) * 12 = 288 ∧
    (6:ℝ) * 12 = 72 ∧ (8:ℝ) * 12 = 96 ∧ (10:ℝ) * 12 = 120 ∧ (72:ℝ) + 96 + 120 = 288 ∧
    (2:ℝ) * 24 + 288 = 336 ∧ (24:ℝ) * 12 = 288 := by norm_num

/-- Primer 3, korak 2: višina zatrepa h > 0 s h² + 3² = 5² je natanko h = 4; h = √(5² − 3²) = √16 = 4,
pri čemer je 3 = 6/2. -/
theorem primer3_visina (h : ℝ) (hh : 0 < h) :
    (6:ℝ) / 2 = 3 ∧ (h ^ 2 + 3 ^ 2 = 5 ^ 2 ↔ h = 4) ∧ √((5:ℝ) ^ 2 - 3 ^ 2) = √16 ∧ √(16:ℝ) = 4 := by
  refine ⟨by norm_num, ⟨fun e => by nlinarith [sq_nonneg (h - 4)], by rintro rfl; norm_num⟩, by norm_num,
    ?_⟩
  rw [show (16:ℝ) = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Predpostavka trditve `primer3_visina` se da izpolniti (h = 4). -/
example : (0:ℝ) < 4 := by norm_num

/-- Primer 3, koraki 3–5 in premisli: O = 6·4/2 = 12, V = 12·8 = 96 m³; streha 2·5·8 = 80, zatrepa
2·12 = 24, skupaj 80 + 24 = 104 m². -/
theorem primer3 :
    (6:ℝ) * 4 / 2 = 12 ∧ (12:ℝ) * 8 = 96 ∧ (2:ℝ) * 5 * 8 = 80 ∧ (2:ℝ) * 12 = 24 ∧ (80:ℝ) + 24 = 104 := by
  norm_num

/-! ## Drugače -/

/-- Kot zgodba: 3 · 4 / 2 = 6, 6·10 = 60 (prostornina, ne karton), trakovi 30 + 40 + 50 = 120 = 2·60,
o = 3 + 4 + 5 = 12, pl = 12·10 = 120, P = 2·6 + 120 = 132; trikotnik je pravokoten (3² + 4² = 5²). -/
theorem zgodba :
    (3:ℝ) * 4 / 2 = 6 ∧ (6:ℝ) * 10 = 60 ∧ (3:ℝ) * 10 = 30 ∧ (4:ℝ) * 10 = 40 ∧ (5:ℝ) * 10 = 50 ∧
    (30:ℝ) + 40 + 50 = 120 ∧ (120:ℝ) = 2 * 60 ∧ (3:ℝ) + 4 + 5 = 12 ∧ (12:ℝ) * 10 = 120 ∧
    (2:ℝ) * 6 + 120 = 132 ∧ (3:ℝ) ^ 2 + 4 ^ 2 = 5 ^ 2 := by norm_num

/-- Korak za korakom: trapez 10, 4, kraka 5: (10 − 4)/2 = 3, √(5² − 3²) = 4; O = (10 + 4)·4/2 = 28,
o = 10 + 4 + 5 + 5 = 24, pl = 24·10 = 240, P = 2·28 + 240 = 296, V = 28·10 = 280. -/
theorem trapez :
    ((10:ℝ) - 4) / 2 = 3 ∧ √((5:ℝ) ^ 2 - 3 ^ 2) = 4 ∧ ((10:ℝ) + 4) * 4 / 2 = 28 ∧
    (10:ℝ) + 4 + 5 + 5 = 24 ∧ (24:ℝ) * 10 = 240 ∧ (2:ℝ) * 28 + 240 = 296 ∧ (28:ℝ) * 10 = 280 := by
  refine ⟨by norm_num, ?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  rw [show (5:ℝ) ^ 2 - 3 ^ 2 = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-! ## Preveri se -/

/-- Preveri se (2): V_A = 4·3·10 = 12·10 = 120, V_B = 12·8 = 96 (ne 12·13 = 156), V_C = 6·5/2·7 = 15·7 = 105
(ne 6·5·7 = 210); vrstni red B < C < A. -/
theorem preveri2 :
    (4:ℝ) * 3 = 12 ∧ (12:ℝ) * 10 = 120 ∧ (12:ℝ) * 8 = 96 ∧ (12:ℝ) * 13 = 156 ∧ (6:ℝ) * 5 / 2 = 15 ∧
    (15:ℝ) * 7 = 105 ∧ (6:ℝ) * 5 * 7 = 210 ∧ (96:ℝ) < 105 ∧ (105:ℝ) < 120 := by norm_num

/-- Preveri se (3): pri podvojeni višini in isti osnovni ploskvi se prostornina podvoji: O·(2v) = 2(O·v); to
ni O·v (za O·v ≠ 0) in ne 4·O·v; 4-krat bi bila večja, če bi podvojili obe stranici osnovne ploskve. -/
theorem preveri3 (O v a b : ℝ) (h : O * v ≠ 0) :
    O * (2 * v) = 2 * (O * v) ∧ O * (2 * v) ≠ O * v ∧ O * (2 * v) ≠ 4 * (O * v) ∧
    (2 * a) * (2 * b) * v = 4 * (a * b * v) := by
  refine ⟨by ring, fun e => h (by linarith), fun e => h (by linarith), by ring⟩

/-- Predpostavka trditve `preveri3` se da izpolniti (O = v = 1). -/
example : (1:ℝ) * 1 ≠ 0 := by norm_num

/-- Preveri se (4): V = (4·3)·5 = 60; napačni: O = 12, površina 2(12 + 20 + 15) = 94, polovica 47 =
12 + 20 + 15 (4·3, 4·5, 3·5). -/
theorem preveri4 :
    (4:ℝ) * 3 * 5 = 60 ∧ (4:ℝ) * 3 = 12 ∧ (4:ℝ) * 5 = 20 ∧ (3:ℝ) * 5 = 15 ∧ (12:ℝ) + 20 + 15 = 47 ∧
    (2:ℝ) * 47 = 94 := by norm_num

/-- Preveri se (5): enakostranični trikotnik s stranico 5: o = 3·5 = 15, pl = 15·10 = 150; napačni: ena
ploskev 5·10 = 50, štiri ploskve 4·5·10 = 200. -/
theorem preveri5 :
    (3:ℝ) * 5 = 15 ∧ (15:ℝ) * 10 = 150 ∧ (5:ℝ) * 10 = 50 ∧ (4:ℝ) * 5 * 10 = 200 := by norm_num

end Evklid.Lekcije.MAT_OS_9.Prizma
