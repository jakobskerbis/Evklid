/-
vir: content/lessons/MAT-SS-3/krozne-funkcije.md
sha256: cd65fbaf5b2ec6527d8cf0c72a888c54c03fc9ea899e506a8f3e74b3888005fb
Ni v Leanu: zgodovina (Ptolemaj, tabele tetiv), zgodba o osciloskopu kot besedilo (dokazano je, da imajo 30°,
150° in 390° sinus 1/2 in 180° − 30° = 150°); simulacija »Kot iz vrednosti sinusa«; risbe grafov in »graf je
zrcalna slika čez y = x« (dokazane so lastnosti: D, Z, monotonost, lihost, točke na grafu, asimptoti
arkus tangensa kot limiti); »asimptoti ima le arkus tangens« (arcsin in arccos sta definirana le na [−1, 1];
pojem asimptote zanju ni formaliziran); oznaka sin⁻¹ in delovanje kalkulatorja kot opis (dokazano je
arcsin 0,5 = π/6 ≈ 0,5236 ≠ 1/sin(π/6) = 2 in da je napaka pri stopinjah faktor 180/π, med 57 in 58);
Postopek v Ponovitvi, točkovanje; Naloga 2 a): da je 600 ms najmanjša perioda (dokazano je h(t + 600) = h(t) in
2π/(π/300) = 600); Naloga 2 b): »gre skozi najvišjo lego« je dokazano kot h(300) = 55 in h ≥ 40 na [t₁, t₂].
Leanove konvencije: arcsin, arccos sta v Leanu definirana na vsem ℝ (zunaj [−1, 1] vrneta mejno vrednost), zato
imajo trditve o D pogoj −1 ≤ x ≤ 1 oziroma so zapisane kot »sin y = x nima rešitve«; tan x = sin x/cos x z
x/0 = 0, zato ima rešitev tan x = a pogoj cos x ≠ 0. Koti so v radianih, čas v Primeru 3 v sekundah.
»≈ a« na k decimalk je a − ½·10⁻ᵏ < vrednost < a + ½·10⁻ᵏ. Meje za arcsin 0,4 in arcsin 0,8 so izračunane s
Taylorjevima ocenama za sin in cos ter šestkratnim podvajanjem kota (`zacetni`, `dvojno`).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.KrozneFunkcije

open Real Filter Topology Set

/-! ## Pomožne trditve -/

/-- Pomožna trditev: 1,7320 < √3 < 1,7321.
pomozno -/
theorem koren3 : (1.7320 : ℝ) < √3 ∧ √3 < 1.7321 := by
  constructor
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num

/-- Pomožna trditev (računanje mej): za 0 < a ≤ 1 je a − a³/6 ≤ sin a ≤ a − a³/6 + a⁵/100 in
1 − a²/2 ≤ cos a ≤ 1 − a²/2 + 5a⁴/96 (Taylorjeve ocene iz Mathliba).
pomozno -/
theorem zacetni (a : ℝ) (h0 : 0 < a) (h1 : a ≤ 1) :
    a - a ^ 3 / 6 ≤ sin a ∧ sin a ≤ a - a ^ 3 / 6 + a ^ 5 / 100 ∧ 1 - a ^ 2 / 2 ≤ cos a ∧
    cos a ≤ 1 - a ^ 2 / 2 + a ^ 4 * (5 / 96) := by
  have hs := sin_bound (x := a) (by rw [abs_of_pos h0]; exact h1)
  have hc := cos_bound (x := a) (by rw [abs_of_pos h0]; exact h1)
  rw [abs_of_pos h0, abs_le] at hs hc
  exact ⟨sin_ge_sub_cube h0.le, by linarith, one_sub_sq_div_two_le_cos, by linarith⟩

/-- Pomožna trditev (računanje mej): ožje meje za sin in cos lahko oslabimo v širše.
pomozno -/
theorem oslabi {a sl sh cl ch sl' sh' cl' ch' : ℝ} (h : sl ≤ sin a ∧ sin a ≤ sh ∧ cl ≤ cos a ∧ cos a ≤ ch)
    (h1 : sl' ≤ sl) (h2 : sh ≤ sh') (h3 : cl' ≤ cl) (h4 : ch ≤ ch') :
    sl' ≤ sin a ∧ sin a ≤ sh' ∧ cl' ≤ cos a ∧ cos a ≤ ch' :=
  ⟨h1.trans h.1, h.2.1.trans h2, h3.trans h.2.2.1, h.2.2.2.trans h4⟩

/-- Pomožna trditev (računanje mej): iz mej za sin a, cos a (spodnji meji nenegativni) dobimo meje za kot 2a:
sin 2a = 2 sin a cos a, cos 2a = cos²a − sin²a.
pomozno -/
theorem dvojno {a a2 sl sh cl ch : ℝ} (h : sl ≤ sin a ∧ sin a ≤ sh ∧ cl ≤ cos a ∧ cos a ≤ ch)
    (hs : 0 ≤ sl) (hc : 0 ≤ cl) (he : 2 * a = a2) :
    2 * sl * cl ≤ sin a2 ∧ sin a2 ≤ 2 * sh * ch ∧ cl ^ 2 - sh ^ 2 ≤ cos a2 ∧ cos a2 ≤ ch ^ 2 - sl ^ 2 := by
  obtain ⟨h1, h2, h3, h4⟩ := h
  subst he
  have e1 : sin (2 * a) = 2 * sin a * cos a := sin_two_mul a
  have e2 : cos (2 * a) = cos a ^ 2 - sin a ^ 2 := by rw [cos_two_mul]; linarith [sin_sq_add_cos_sq a]
  have ps : 0 ≤ sin a := hs.trans h1
  have pc : 0 ≤ cos a := hc.trans h3
  refine ⟨?_, ?_, ?_, ?_⟩
  · rw [e1]; nlinarith [mul_le_mul h1 h3 hc ps]
  · rw [e1]; nlinarith [mul_le_mul h2 h4 pc (ps.trans h2)]
  · rw [e2]; nlinarith [pow_le_pow_left₀ hc h3 2, pow_le_pow_left₀ ps h2 2]
  · rw [e2]; nlinarith [pow_le_pow_left₀ pc h4 2, pow_le_pow_left₀ hs h1 2]

/-- Pomožna trditev: meje za sin 0,411516 (šestkratno podvajanje kota 0,411516/64).
pomozno -/
theorem sin_a1 : (0.3999992227473455 : ℝ) ≤ sin 0.411516 ∧ sin 0.411516 ≤ 0.3999992250334502 := by
  have h0 : (0.0064298931933408 : ℝ) ≤ sin 0.0064299375 ∧ sin 0.0064299375 ≤ 0.0064298931934508 ∧ (0.999979327951873 : ℝ) ≤ cos 0.0064299375 ∧ cos 0.0064299375 ≤ 0.9999793280409009 :=
    oslabi (zacetni 0.0064299375 (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h1 : (0.0128595205485585 : ℝ) ≤ sin 0.012859875 ∧ sin 0.012859875 ≤ 0.0128595205499234 ∧ (0.9999173128046003 : ℝ) ≤ cos 0.012859875 ∧ cos 0.012859875 ≤ 0.999917312982654 :=
    oslabi (dvojno h0 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h2 : (0.0257169144617403 : ℝ) ≤ sin 0.02571975 ∧ sin 0.02571975 ≤ 0.0257169144690493 ∧ (0.9996692651775989 : ℝ) ≤ cos 0.02571975 ∧ cos 0.02571975 ≤ 0.9996692655337121 :=
    oslabi (dvojno h1 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h3 : (0.0514168179652061 : ℝ) ≤ sin 0.0514395 ∧ sin 0.0514395 ≤ 0.0514168179981357 ∧ (0.9986772800509121 : ℝ) ≤ cos 0.0514395 ∧ cos 0.0514395 ≤ 0.998677280763279 :=
    oslabi (dvojno h2 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h4 : (0.1026976158287298 : ℝ) ≤ sin 0.102879 ∧ sin 0.102879 ≤ 0.1026976159677572 ∧ (0.9947126205168345 : ℝ) ≤ cos 0.102879 ∧ cos 0.102879 ≤ 0.9947126219430701 :=
    oslabi (dvojno h3 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h5 : (0.2043092291236539 : ℝ) ≤ sin 0.205758 ∧ sin 0.205758 ≤ 0.2043092296931806 ∧ (0.978906397090007 : ℝ) ≤ cos 0.205758 ∧ cos 0.205758 ≤ 0.9789063999559518 :=
    oslabi (dvojno h4 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h6 : (0.3999992227473455 : ℝ) ≤ sin 0.411516 ∧ sin 0.411516 ≤ 0.3999992250334502 ∧ (0.9165154729259176 : ℝ) ≤ cos 0.411516 ∧ cos 0.411516 ≤ 0.9165154787696202 :=
    oslabi (dvojno h5 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  exact ⟨h6.1, h6.2.1⟩
/-- Pomožna trditev: meje za sin 0,4115176.
pomozno -/
theorem sin_a2 : (0.400000689171559 : ℝ) ≤ sin 0.4115176 ∧ sin 0.4115176 ≤ 0.4000006914577147 := by
  have h0 : (0.006429918192824 : ℝ) ≤ sin 0.0064299625 ∧ sin 0.0064299625 ≤ 0.006429918192934 ∧ (0.9999793277911242 : ℝ) ≤ cos 0.0064299625 ∧ cos 0.0064299625 ≤ 0.9999793278801536 :=
    oslabi (zacetni 0.0064299625 (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h1 : (0.0128595705444241 : ℝ) ≤ sin 0.012859925 ∧ sin 0.012859925 ≤ 0.0128595705457891 ∧ (0.9999173121616207 : ℝ) ≤ cos 0.012859925 ∧ cos 0.012859925 ≤ 0.9999173123396774 :=
    oslabi (dvojno h0 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h2 : (0.0257170144286665 : ℝ) ≤ sin 0.02571985 ∧ sin 0.02571985 ≤ 0.0257170144359759 ∧ (0.9996692626058978 : ℝ) ≤ cos 0.02571985 ∧ cos 0.02571985 ≤ 0.999669262962017 :=
    oslabi (dvojno h1 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h3 : (0.0514170177006605 : ℝ) ≤ sin 0.0514397 ∧ sin 0.0514397 ≤ 0.0514170177335912 ∧ (0.9986772697675192 : ℝ) ≤ cos 0.0514397 ∧ cos 0.0514397 ≤ 0.9986772704798981 :=
    oslabi (dvojno h2 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h4 : (0.1026980137137676 : ℝ) ≤ sin 0.1028794 ∧ sin 0.1028794 ≤ 0.1026980138527988 ∧ (0.9947125794376898 : ℝ) ≤ cos 0.1028794 ∧ cos 0.1028794 ≤ 0.9947125808639496 :=
    oslabi (dvojno h3 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h5 : (0.204310012248698 : ℝ) ≤ sin 0.2057588 ∧ sin 0.2057588 ≤ 0.2043100128182383 ∧ (0.9789062336422726 : ℝ) ≤ cos 0.2057588 ∧ cos 0.2057588 ≤ 0.9789062365082663 :=
    oslabi (dvojno h4 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h6 : (0.400000689171559 : ℝ) ≤ sin 0.4115176 ∧ sin 0.4115176 ≤ 0.4000006914577147 ∧ (0.9165148329259108 : ℝ) ≤ cos 0.4115176 ∧ cos 0.4115176 ≤ 0.9165148387697147 :=
    oslabi (dvojno h5 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  exact ⟨h6.1, h6.2.1⟩
/-- Pomožna trditev: meje za sin 0,927293.
pomozno -/
theorem sin_b1 : (0.7999985712170279 : ℝ) ≤ sin 0.927293 ∧ sin 0.927293 ≤ 0.7999986972727304 := by
  have h0 : (0.0144884461812515 : ℝ) ≤ sin 0.014488953125 ∧ sin 0.014488953125 ≤ 0.014488446187637 ∧ (0.9998950351186707 : ℝ) ≤ cos 0.014488953125 ∧ cos 0.014488953125 ≤ 0.9998950374140096 :=
    oslabi (zacetni 0.014488953125 (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h1 : (0.0289738508064348 : ℝ) ≤ sin 0.02897790625 ∧ sin 0.02897790625 ≤ 0.0289738508857164 ∧ (0.9995801661820356 : ℝ) ≤ cos 0.02897790625 ∧ cos 0.02897790625 ≤ 0.9995801707724167 :=
    oslabi (dvojno h0 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h2 : (0.0579233732080592 : ℝ) ≤ sin 0.0579558125 ∧ sin 0.0579558125 ≤ 0.0579233736325579 ∧ (0.9983210245893581 : ℝ) ≤ cos 0.0579558125 ∧ cos 0.0579558125 ≤ 0.9983210337708602 :=
    oslabi (dvojno h1 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h3 : (0.1156522425774828 : ℝ) ≤ sin 0.115911625 ∧ sin 0.115911625 ≤ 0.115652244488702 ∧ (0.9932897509241688 : ℝ) ≤ cos 0.115911625 ∧ cos 0.115911625 ≤ 0.9932897693055189 :=
    oslabi (dvojno h2 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h4 : (0.2297523744472188 : ℝ) ≤ sin 0.23182325 ∧ sin 0.23182325 ≤ 0.2297523824956966 ∧ (0.9732490876357227 : ℝ) ≤ cos 0.23182325 ∧ cos 0.23182325 ≤ 0.9732491245938101 :=
    oslabi (dvojno h3 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h5 : (0.4472125776257932 : ℝ) ≤ sin 0.4636465 ∧ sin 0.4636465 ≤ 0.4472126102745579 ∧ (0.8944276293213177 : ℝ) ≤ cos 0.4636465 ∧ cos 0.4636465 ≤ 0.8944277049584827 :=
    oslabi (dvojno h4 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h6 : (0.7999985712170279 : ℝ) ≤ sin 0.927293 ∧ sin 0.927293 ≤ 0.7999986972727304 ∧ (0.6000016653047688 : ℝ) ≤ cos 0.927293 ∧ cos 0.927293 ≤ 0.6000018298105925 :=
    oslabi (dvojno h5 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  exact ⟨h6.1, h6.2.1⟩
/-- Pomožna trditev: meje za sin 0,927297.
pomozno -/
theorem sin_b2 : (0.8000009712156945 : ℝ) ≤ sin 0.927297 ∧ sin 0.927297 ≤ 0.8000010972740424 := by
  have h0 : (0.0144885086746912 : ℝ) ≤ sin 0.014489015625 ∧ sin 0.014489015625 ≤ 0.0144885086810768 ∧ (0.9998950342131092 : ℝ) ≤ cos 0.014489015625 ∧ cos 0.014489015625 ≤ 0.9998950365084877 :=
    oslabi (zacetni 0.014489015625 (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h1 : (0.0289739757539545 : ℝ) ≤ sin 0.02897803125 ∧ sin 0.02897803125 ≤ 0.0289739758332377 ∧ (0.9995801625602331 : ℝ) ≤ cos 0.02897803125 ∧ cos 0.02897803125 ≤ 0.9995801671506934 :=
    oslabi (dvojno h0 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h2 : (0.0579236227883081 : ℝ) ≤ sin 0.0579560625 ∧ sin 0.0579560625 ≤ 0.0579236232128158 ∧ (0.9983210101083569 : ℝ) ≤ cos 0.0579560625 ∧ cos 0.0579560625 ≤ 0.9983210192900175 :=
    oslabi (dvojno h1 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h3 : (0.1156527392223183 : ℝ) ≤ sin 0.115912125 ∧ sin 0.115912125 ≤ 0.1156527411335784 ∧ (0.9932896930976697 : ℝ) ≤ cos 0.115912125 ∧ cos 0.115912125 ≤ 0.9932897114793373 :=
    oslabi (dvojno h2 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h4 : (0.2297533476960827 : ℝ) ≤ sin 0.23182425 ∧ sin 0.23182425 ≤ 0.2297533557447332 ∧ (0.9732488578823523 : ℝ) ≤ cos 0.23182425 ∧ cos 0.23182425 ≤ 0.9732488948410796 :=
    oslabi (dvojno h3 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h5 : (0.4472143664797189 : ℝ) ≤ sin 0.4636485 ∧ sin 0.4636485 ≤ 0.447214399129182 ∧ (0.8944267348933372 : ℝ) ≤ cos 0.4636485 ∧ cos 0.4636485 ≤ 0.8944268105318258 :=
    oslabi (dvojno h4 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h6 : (0.8000009712156945 : ℝ) ≤ sin 0.927297 ∧ sin 0.927297 ≤ 0.8000010972740424 ∧ (0.5999984653034808 : ℝ) ≤ cos 0.927297 ∧ cos 0.927297 ≤ 0.5999986298122783 :=
    oslabi (dvojno h5 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  exact ⟨h6.1, h6.2.1⟩

/-- Pomožna trditev: če je sin lo < v < sin hi za lo, hi ∈ [−π/2, π/2] in v ∈ [−1, 1], je lo < arcsin v < hi.
pomozno -/
theorem arcsin_med {v lo hi : ℝ} (hv : v ∈ Icc (-1 : ℝ) 1) (hlo : lo ∈ Icc (-(π / 2)) (π / 2))
    (hhi : hi ∈ Icc (-(π / 2)) (π / 2)) (h1 : sin lo < v) (h2 : v < sin hi) : lo < arcsin v ∧ arcsin v < hi :=
  ⟨(lt_arcsin_iff_sin_lt hlo hv).mpr h1, (arcsin_lt_iff_lt_sin hv hhi).mpr h2⟩

/-- Pomožna trditev: 0,411516 < arcsin 0,4 < 0,4115176.
pomozno -/
theorem arcsin04 : (0.411516 : ℝ) < arcsin 0.4 ∧ arcsin 0.4 < 0.4115176 := by
  have p := pi_gt_d6
  exact arcsin_med ⟨by norm_num, by norm_num⟩ ⟨by linarith, by linarith⟩ ⟨by linarith, by linarith⟩
    (by linarith [sin_a1.2]) (by linarith [sin_a2.1])

/-- Pomožna trditev: 0,927293 < arcsin 0,8 < 0,927297.
pomozno -/
theorem arcsin08 : (0.927293 : ℝ) < arcsin 0.8 ∧ arcsin 0.8 < 0.927297 := by
  have p := pi_gt_d6
  exact arcsin_med ⟨by norm_num, by norm_num⟩ ⟨by linarith, by linarith⟩ ⟨by linarith, by linarith⟩
    (by linarith [sin_b1.2]) (by linarith [sin_b2.1])

/-- Pomožna trditev: če je arccos y = c za 0 < c < π, je y = cos c (tudi brez pogoja na y,
ker Lean zunaj [−1, 1] vrne 0 ali π).
pomozno -/
theorem iz_arccos {y c : ℝ} (h : arccos y = c) (h0 : 0 < c) (h1 : c < π) : y = cos c := by
  rcases le_or_gt 1 y with hy | hy
  · rw [arccos_of_one_le hy] at h; linarith
  rcases le_or_gt y (-1) with hy' | hy'
  · rw [arccos_of_le_neg_one hy'] at h; linarith
  rw [← h, cos_arccos hy'.le hy.le]

/-! ## Razlaga -/

/-- Razlaga 1 in Pogoste napake: arcsin 0,5 = π/6 ≈ 0,5236 (kot, katerega sinus je 0,5), ulomek pa dá
1/sin(π/6) = 2 ≠ π/6.
trditev: MAT-SS-3/krozne-funkcije#razlaga1
besedilo: »Tipka $\sin^{-1}$ pri vrednosti $0{,}5$ vrne $0{,}5236$, kar je $\frac{\pi}{6}$: kot, katerega sinus je $0{,}5$.« -/
theorem razlaga1 : arcsin 0.5 = π / 6 ∧ (0.52355 : ℝ) < π / 6 ∧ π / 6 < 0.52365 ∧ 1 / sin (π / 6) = 2 ∧
    1 / sin (π / 6) ≠ π / 6 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  have e : arcsin 0.5 = π / 6 := by
    rw [show (0.5 : ℝ) = 1 / 2 by norm_num, ← sin_pi_div_six,
      arcsin_sin (by linarith [pi_pos]) (by linarith [pi_pos])]
  refine ⟨e, by linarith, by linarith, by rw [sin_pi_div_six]; norm_num, ?_⟩
  rw [sin_pi_div_six]; intro h; norm_num at h; linarith

/-- Razlaga 2: premica y = 1/2 seka sinus v neskončno mnogo točkah: sin(π/6 + 2kπ) = 1/2 za vsak celi k
(med njimi π/6, 13π/6) in sin(5π/6) = 1/2.
trditev: MAT-SS-3/krozne-funkcije#razlaga2
besedilo: »Druga napaka: en sinus, en kot.** Premica $y = \frac12$ seka graf sinusa v neskončno mnogo točkah: pri $\frac{\pi}{6}$, $\frac{5\pi}{6}$, $\frac{13\pi}{6}$ in tako naprej.« -/
theorem razlaga2 : (∀ k : ℤ, sin (π / 6 + 2 * k * π) = 1 / 2) ∧ sin (5 * π / 6) = 1 / 2 ∧
    sin (13 * π / 6) = 1 / 2 := by
  have a : ∀ k : ℤ, sin (π / 6 + 2 * k * π) = 1 / 2 := fun k => by
    rw [show 2 * (k : ℝ) * π = k * (2 * π) by ring, sin_add_int_mul_two_pi, sin_pi_div_six]
  refine ⟨a, ?_, ?_⟩
  · rw [show 5 * π / 6 = π - π / 6 by ring, sin_pi_sub, sin_pi_div_six]
  · have := a 1; push_cast at this; rw [← this]; congr 1; ring

/-- Razlaga 2, 3 in Ustno vprašanje 1: na [−π/2, π/2] sinus narašča in vsako vrednost x ∈ [−1, 1] doseže
natanko enkrat, pri kotu arcsin x.
trditev: MAT-SS-3/krozne-funkcije#sinus-zozen
besedilo: »Na intervalu $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$ sinus narašča in vsako vrednost z $[-1, 1]$ doseže natanko enkrat.« -/
theorem sinus_zozen : StrictMonoOn sin (Icc (-(π / 2)) (π / 2)) ∧
    ∀ x ∈ Icc (-1 : ℝ) 1, arcsin x ∈ Icc (-(π / 2)) (π / 2) ∧ sin (arcsin x) = x ∧
      ∀ y ∈ Icc (-(π / 2)) (π / 2), sin y = x → y = arcsin x :=
  ⟨strictMonoOn_sin, fun x hx => ⟨arcsin_mem_Icc x, sin_arcsin hx.1 hx.2, fun _ hy h =>
    (arcsin_eq_of_sin_eq h hy).symm⟩⟩

/-- Razlaga 2 (simulacija): na [0, 2π) ima sin x = 1/2 natanko rešitvi π/6 in 5π/6 (v zoženem intervalu le
prvo); sin x = −1/2 ima na [0, 2π) rešitvi 7π/6 in 11π/6, nobena ni v [−π/2, π/2]; arcsin(−1/2) = −π/6 =
11π/6 − 2π.
trditev: MAT-SS-3/krozne-funkcije#simulacija
besedilo: »Na $[0, 2\pi)$ dobiš dve rešitvi, $\frac{\pi}{6}$ in $\frac{5\pi}{6}$; v zoženem intervalu leži le prva.« -/
theorem simulacija (x : ℝ) (h0 : 0 ≤ x) (h1 : x < 2 * π) :
    (sin x = 1 / 2 ↔ x = π / 6 ∨ x = 5 * π / 6) ∧ (sin x = -(1 / 2) ↔ x = 7 * π / 6 ∨ x = 11 * π / 6) ∧
    π / 2 < 7 * π / 6 ∧ π / 2 < 11 * π / 6 ∧ arcsin (-(1 / 2)) = -(π / 6) ∧ -(π / 6) = 11 * π / 6 - 2 * π := by
  have hp := pi_pos
  have e1 : arcsin (-(1 / 2)) = -(π / 6) := by
    rw [arcsin_neg, show (1 / 2 : ℝ) = sin (π / 6) by rw [sin_pi_div_six],
      arcsin_sin (by linarith) (by linarith)]
  refine ⟨?_, ?_, by linarith, by linarith, e1, by ring⟩
  · rw [← sin_pi_div_six, eq_comm, sin_eq_sin_iff]
    constructor
    · rintro ⟨k, hk | hk⟩
      · have a : (-1 : ℝ) < k := by nlinarith
        have b : (k : ℝ) < 1 := by nlinarith
        have : k = 0 := by
          have a' : -1 < k := by exact_mod_cast a
          have b' : k < 1 := by exact_mod_cast b
          omega
        subst this; left; simp at hk; linarith
      · have a : (-1 : ℝ) < k := by nlinarith
        have b : (k : ℝ) < 1 := by nlinarith
        have : k = 0 := by
          have a' : -1 < k := by exact_mod_cast a
          have b' : k < 1 := by exact_mod_cast b
          omega
        subst this; right; simp at hk; linarith
    · rintro (rfl | rfl)
      · exact ⟨0, Or.inl (by simp)⟩
      · exact ⟨0, Or.inr (by push_cast; ring)⟩
  · rw [show -(1 / 2 : ℝ) = sin (-(π / 6)) by rw [sin_neg, sin_pi_div_six], eq_comm, sin_eq_sin_iff]
    constructor
    · rintro ⟨k, hk | hk⟩
      · have a : (0 : ℝ) < k := by nlinarith
        have b : (k : ℝ) < 2 := by nlinarith
        have : k = 1 := by
          have a' : 0 < k := by exact_mod_cast a
          have b' : k < 2 := by exact_mod_cast b
          omega
        subst this; right; push_cast at hk; linarith
      · have a : (-1 : ℝ) < k := by nlinarith
        have b : (k : ℝ) < 1 := by nlinarith
        have : k = 0 := by
          have a' : -1 < k := by exact_mod_cast a
          have b' : k < 1 := by exact_mod_cast b
          omega
        subst this; left; push_cast at hk; linarith
    · rintro (rfl | rfl)
      · exact ⟨0, Or.inr (by push_cast; ring)⟩
      · exact ⟨1, Or.inl (by push_cast; ring)⟩

/-- Pogoja izreka `simulacija` se dajo izpolniti (x = 0). -/
example : (0 : ℝ) ≤ 0 ∧ (0 : ℝ) < 2 * π := ⟨le_rfl, by positivity⟩

/-- Predpostavke trditve `simulacija` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) ≤ 0 ∧ (0 : ℝ) < 2 * π := ⟨le_rfl, by positivity⟩
  simulacija (h0 := w.1) (h1 := w.2)

/-- Razlaga 3: arcsin(1/2) = π/6, ker je sin(π/6) = 1/2 in π/6 ∈ [−π/2, π/2].
trditev: MAT-SS-3/krozne-funkcije#arcsin-pol
besedilo: »3. Arkus sinus.** $\arcsin x$ je tisti kot $y$ z intervala $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$, za katerega je $\sin y = x$. Primer: $\arcsin\frac12 = \frac{\pi}{6}$, ker je $\sin\frac{\pi}{6} = \frac12$ in $\frac{\pi}{6}$ leži v intervalu.« -/
theorem arcsin_pol : arcsin (1 / 2) = π / 6 := by
  have hp := pi_pos
  rw [← sin_pi_div_six, arcsin_sin (by linarith) (by linarith)]

/-- Razlaga 3, 6 in Povzetek (lastnosti arkus sinusa): D = [−1, 1] (za |x| > 1 sin y = x nima rešitve),
Z = [−π/2, π/2] (vsak kot z Z je arcsin svojega sinusa), arcsin narašča in je lih, arcsin(−1/2) = −π/6.
trditev: MAT-SS-3/krozne-funkcije#lastnosti-arcsin
besedilo: »3. Arkus sinus.** $\arcsin x$ je tisti kot $y$ z intervala $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$, za katerega je $\sin y = x$. Primer: $\arcsin\frac12 = \frac{\pi}{6}$, ker je $\sin\frac{\pi}{6} = \frac12$ in $\frac{\pi}{6}$ leži v intervalu.« -/
theorem lastnosti_arcsin :
    (∀ x y : ℝ, 1 < |x| → sin y ≠ x) ∧ (∀ x ∈ Icc (-1 : ℝ) 1, arcsin x ∈ Icc (-(π / 2)) (π / 2)) ∧
    (∀ y ∈ Icc (-(π / 2)) (π / 2), ∃ x ∈ Icc (-1 : ℝ) 1, arcsin x = y) ∧
    StrictMonoOn arcsin (Icc (-1) 1) ∧ (∀ x ∈ Icc (-1 : ℝ) 1, arcsin (-x) = -arcsin x) ∧
    arcsin (-(1 / 2)) = -(π / 6) := by
  refine ⟨fun x y hx h => ?_, fun x _ => arcsin_mem_Icc x, fun y hy => ⟨sin y, ⟨neg_one_le_sin y, sin_le_one y⟩,
    arcsin_sin hy.1 hy.2⟩, strictMonoOn_arcsin, fun x _ => arcsin_neg x, by rw [arcsin_neg, arcsin_pol]⟩
  have := abs_sin_le_one y; rw [h] at this; linarith

/-- Razlaga 3, Premisli: na [0, π] sinus ni injektiven (sin(π/6) = sin(5π/6)) in nima negativnih vrednosti.
trditev: MAT-SS-3/krozne-funkcije#premisli-0-pi
besedilo: »Na $[0, \pi]$ sinus vsako vrednost med $0$ in $1$ doseže dvakrat, na primer $\sin\frac{\pi}{6} = \sin\frac{5\pi}{6}$. Negativnih vrednosti tam sploh nima. Obratna funkcija ne bi bila enolična in ne bi bila definirana za negativna števila.« -/
theorem premisli_0_pi : sin (π / 6) = sin (5 * π / 6) ∧ π / 6 ≠ 5 * π / 6 ∧
    ∀ x ∈ Icc 0 π, 0 ≤ sin x := by
  have hp := pi_pos
  refine ⟨by rw [razlaga2.2.1, sin_pi_div_six], by intro h; linarith, fun x hx =>
    sin_nonneg_of_nonneg_of_le_pi hx.1 hx.2⟩

/-- Razlaga 4: cos(−π/3) = cos(π/3), zato [−π/2, π/2] za kosinus ne deluje; na [0, π] kosinus pada, arccos x je
edini kot z [0, π] s kosinusom x.
trditev: MAT-SS-3/krozne-funkcije#kosinus-zozen
besedilo: »Arkus kosinus.** Pri kosinusu interval $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$ ne deluje, ker je $\cos\left(-\frac{\pi}{3}\right) = \cos\frac{\pi}{3}$.« -/
theorem kosinus_zozen : cos (-(π / 3)) = cos (π / 3) ∧ StrictAntiOn cos (Icc 0 π) ∧
    ∀ x ∈ Icc (-1 : ℝ) 1, arccos x ∈ Icc 0 π ∧ cos (arccos x) = x ∧
      ∀ y ∈ Icc 0 π, cos y = x → y = arccos x := by
  refine ⟨cos_neg _, strictAntiOn_cos, fun x hx => ⟨⟨arccos_nonneg x, arccos_le_pi x⟩,
    cos_arccos hx.1 hx.2, fun y hy h => ?_⟩⟩
  rw [← h, arccos_cos hy.1 hy.2]

/-- Razlaga 4, 6, Povzetek in Ustno vprašanje 2 (lastnosti arkus kosinusa): Z = [0, π], arccos pada, ni ne
sod ne lih (arccos(−1/2) = 2π/3 ni ne arccos(1/2) = π/3 ne −π/3), arccos(−x) = π − arccos x.
trditev: MAT-SS-3/krozne-funkcije#lastnosti-arccos
besedilo: »Velja zveza $\arccos(-x) = \pi - \arccos x$ za $-1 \le x \le 1$.« -/
theorem lastnosti_arccos :
    (∀ x ∈ Icc (-1 : ℝ) 1, arccos x ∈ Icc 0 π) ∧ (∀ y ∈ Icc 0 π, ∃ x ∈ Icc (-1 : ℝ) 1, arccos x = y) ∧
    StrictAntiOn arccos (Icc (-1) 1) ∧ arccos (-(1 / 2)) = 2 * π / 3 ∧ arccos (1 / 2) = π / 3 ∧
    arccos (-(1 / 2)) ≠ arccos (1 / 2) ∧ arccos (-(1 / 2)) ≠ -arccos (1 / 2) ∧
    (∀ x ∈ Icc (-1 : ℝ) 1, arccos (-x) = π - arccos x) := by
  have hp := pi_pos
  have h1 : arccos (1 / 2) = π / 3 := by
    rw [← cos_pi_div_three, arccos_cos (by linarith) (by linarith)]
  have h2 : arccos (-(1 / 2)) = 2 * π / 3 := by rw [arccos_neg, h1]; ring
  refine ⟨fun x _ => ⟨arccos_nonneg x, arccos_le_pi x⟩, fun y hy => ⟨cos y, ⟨neg_one_le_cos y, cos_le_one y⟩,
    arccos_cos hy.1 hy.2⟩, strictAntiOn_arccos, h2, h1, by rw [h1, h2]; intro h; linarith,
    by rw [h1, h2]; intro h; linarith, fun x _ => arccos_neg x⟩

/-- Ustno vprašanje 2: dokaz arccos(−x) = π − arccos x po korakih: φ = arccos x ∈ [0, π], cos(π − φ) = −cos φ
= −x in π − φ ∈ [0, π], zato je π − φ edini kot s kosinusom −x.
trditev: MAT-SS-3/krozne-funkcije#ustno2
besedilo: »Ker je $\arccos(-x)$ edini kot z intervala $[0, \pi]$, katerega kosinus je $-x$, je $\arccos(-x) = \pi - \varphi = \pi - \arccos x$.« -/
theorem ustno2 (x : ℝ) (h0 : -1 ≤ x) (h1 : x ≤ 1) : arccos (-x) = π - arccos x := by
  have hφ0 := arccos_nonneg x
  have hφ1 := arccos_le_pi x
  have hc : cos (π - arccos x) = -x := by rw [cos_pi_sub, cos_arccos h0 h1]
  rw [← hc, arccos_cos (by linarith) (by linarith)]

/-- Pogoja izreka `ustno2` se dajo izpolniti (x = 0). -/
example : (-1 : ℝ) ≤ 0 ∧ (0 : ℝ) ≤ 1 := by norm_num

/-- Predpostavke trditve `ustno2` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (-1 : ℝ) ≤ 0 ∧ (0 : ℝ) ≤ 1 := by norm_num
  ustno2 (h0 := w.1) (h1 := w.2)

/-- Razlaga 5, 6 in Povzetek (arkus tangens): D = ℝ, Z = (−π/2, π/2), tan(arctan x) = x, arctan y je edini kot
z (−π/2, π/2) s tangensom tan y, narašča, je lih; arctan 1 = π/4, arctan(−√3) = −π/3.
trditev: MAT-SS-3/krozne-funkcije#lastnosti-arctan
besedilo: »Na primer $\arctan 1 = \frac{\pi}{4}$ in $\arctan(-\sqrt3) = -\frac{\pi}{3}$.« -/
theorem lastnosti_arctan :
    (∀ x, arctan x ∈ Ioo (-(π / 2)) (π / 2)) ∧ (∀ x, tan (arctan x) = x) ∧
    (∀ y ∈ Ioo (-(π / 2)) (π / 2), arctan (tan y) = y) ∧ StrictMono arctan ∧
    (∀ x, arctan (-x) = -arctan x) ∧ arctan 1 = π / 4 ∧ arctan (-√3) = -(π / 3) := by
  have hp := pi_pos
  refine ⟨arctan_mem_Ioo, tan_arctan, fun y hy => arctan_tan hy.1 hy.2, arctan_strictMono, arctan_neg,
    arctan_one, ?_⟩
  rw [arctan_neg, ← tan_pi_div_three, arctan_tan (by linarith) (by linarith)]

/-- Razlaga 5, Premisli in Povzetek: arkus tangens ima vodoravni asimptoti y = π/2 (x → ∞) in y = −π/2
(x → −∞), ki ju ne doseže.
trditev: MAT-SS-3/krozne-funkcije#asimptoti
besedilo: »Tangens ima navpični asimptoti $x = -\frac{\pi}{2}$ in $x = \frac{\pi}{2}$. Kakšni asimptoti napoveš za arkus tangens?« -/
theorem asimptoti : Tendsto arctan atTop (𝓝 (π / 2)) ∧ Tendsto arctan atBot (𝓝 (-(π / 2))) ∧
    ∀ x, -(π / 2) < arctan x ∧ arctan x < π / 2 :=
  ⟨tendsto_nhds_of_tendsto_nhdsWithin tendsto_arctan_atTop,
    tendsto_nhds_of_tendsto_nhdsWithin tendsto_arctan_atBot, fun x => arctan_mem_Ioo x⟩

/-- Razlaga 7 in Povzetek: sin(arcsin x) = x za −1 ≤ x ≤ 1; arcsin(sin x) = x natanko za x ∈ [−π/2, π/2].
trditev: MAT-SS-3/krozne-funkcije#sestavljanje
besedilo: »$$\sin(\arcsin x) = x \quad \text{za } -1 \le x \le 1$$« -/
theorem sestavljanje : (∀ x ∈ Icc (-1 : ℝ) 1, sin (arcsin x) = x) ∧
    ∀ x : ℝ, arcsin (sin x) = x ↔ x ∈ Icc (-(π / 2)) (π / 2) :=
  ⟨fun _ hx => sin_arcsin hx.1 hx.2, fun _ => ⟨fun h => h ▸ arcsin_mem_Icc _, fun h => arcsin_sin h.1 h.2⟩⟩

/-- Razlaga 7: arcsin(sin(5π/6)) = arcsin(1/2) = π/6, arctan(tan(3π/4)) = arctan(−1) = −π/4,
arccos(cos(−π/3)) = π/3.
trditev: MAT-SS-3/krozne-funkcije#past
besedilo: »Podobno velja $\arctan\left(\tan\frac{3\pi}{4}\right) = \arctan(-1) = -\frac{\pi}{4}$ in $\arccos\left(\cos\left(-\frac{\pi}{3}\right)\right) = \frac{\pi}{3}$.« -/
theorem past : arcsin (sin (5 * π / 6)) = arcsin (1 / 2) ∧ arcsin (1 / 2) = π / 6 ∧
    tan (3 * π / 4) = -1 ∧ arctan (tan (3 * π / 4)) = -(π / 4) ∧ arccos (cos (-(π / 3))) = π / 3 := by
  have hp := pi_pos
  have t : tan (3 * π / 4) = -1 := by
    rw [show 3 * π / 4 = -(π / 4) + (1 : ℤ) * π by push_cast; ring, tan_add_int_mul_pi, tan_neg,
      tan_pi_div_four]
  refine ⟨by rw [razlaga2.2.1], arcsin_pol, t, by rw [t, arctan_eq_neg_pi_div_four], ?_⟩
  rw [cos_neg, arccos_cos (by linarith) (by linarith)]

/-- Razlaga 8 in Ponovitev: za −1 ≤ a ≤ 1 so rešitve sin x = a natanko x = arcsin a + 2kπ ali
x = π − arcsin a + 2kπ (k celo število).
trditev: MAT-SS-3/krozne-funkcije#resitve-sin
besedilo: »$\sin x = a$, $x_1 = \arcsin a$: $x = x_1 + 2k\pi$ ali $x = \pi - x_1 + 2k\pi$ (na pamet)« -/
theorem resitve_sin (a x : ℝ) (h0 : -1 ≤ a) (h1 : a ≤ 1) :
    sin x = a ↔ ∃ k : ℤ, x = arcsin a + 2 * k * π ∨ x = π - arcsin a + 2 * k * π := by
  conv_lhs => rw [← sin_arcsin h0 h1, eq_comm]
  rw [sin_eq_sin_iff]
  constructor
  · rintro ⟨k, h | h⟩
    · exact ⟨k, Or.inl (by rw [h]; ring)⟩
    · exact ⟨k, Or.inr (by rw [h]; ring)⟩
  · rintro ⟨k, h | h⟩
    · exact ⟨k, Or.inl (by rw [h]; ring)⟩
    · exact ⟨k, Or.inr (by rw [h]; ring)⟩

/-- Razlaga 8: za −1 ≤ a ≤ 1 so rešitve cos x = a natanko x = ±arccos a + 2kπ.
trditev: MAT-SS-3/krozne-funkcije#resitve-cos
besedilo: »$x = \pm\arccos a + 2k\pi$« -/
theorem resitve_cos (a x : ℝ) (h0 : -1 ≤ a) (h1 : a ≤ 1) :
    cos x = a ↔ ∃ k : ℤ, x = arccos a + 2 * k * π ∨ x = -arccos a + 2 * k * π := by
  conv_lhs => rw [← cos_arccos h0 h1, eq_comm]
  rw [cos_eq_cos_iff]
  constructor
  · rintro ⟨k, h | h⟩
    · exact ⟨k, Or.inl (by rw [h]; ring)⟩
    · exact ⟨k, Or.inr (by rw [h]; ring)⟩
  · rintro ⟨k, h | h⟩
    · exact ⟨k, Or.inl (by rw [h]; ring)⟩
    · exact ⟨k, Or.inr (by rw [h]; ring)⟩

/-- Pogoja izrekov `resitve_sin` in `resitve_cos` se dajo izpolniti (a = 0). -/
example : (-1 : ℝ) ≤ 0 ∧ (0 : ℝ) ≤ 1 := by norm_num

/-- Predpostavke trditve `resitve_cos` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (-1 : ℝ) ≤ 0 ∧ (0 : ℝ) ≤ 1 := by norm_num
  resitve_cos (h0 := w.1) (h1 := w.2)

/-- Predpostavke trditve `resitve_sin` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (-1 : ℝ) ≤ 0 ∧ (0 : ℝ) ≤ 1 := by norm_num
  resitve_sin (h0 := w.1) (h1 := w.2)

/-- Razlaga 8: rešitve tan x = a (kjer tangens obstaja, cos x ≠ 0) so natanko x = arctan a + kπ.
trditev: MAT-SS-3/krozne-funkcije#resitve-tan
besedilo: »pri tangensu $x = \arctan a + k\pi$.« -/
theorem resitve_tan (a x : ℝ) : (cos x ≠ 0 ∧ tan x = a) ↔ ∃ k : ℤ, x = arctan a + k * π := by
  have hp := pi_pos
  have ht := arctan_mem_Ioo a
  have hct : 0 < cos (arctan a) := cos_arctan_pos a
  constructor
  · rintro ⟨hc, h⟩
    have e : sin (x - arctan a) = 0 := by
      rw [sin_sub]
      have h' : sin x / cos x = sin (arctan a) / cos (arctan a) := by
        rw [← tan_eq_sin_div_cos, ← tan_eq_sin_div_cos, h, tan_arctan]
      rw [div_eq_div_iff hc hct.ne'] at h'
      linarith
    obtain ⟨n, hn⟩ := sin_eq_zero_iff.mp e
    exact ⟨n, by linarith⟩
  · rintro ⟨k, rfl⟩
    refine ⟨fun h0 => ?_, by rw [tan_add_int_mul_pi, tan_arctan]⟩
    obtain ⟨m, hm⟩ := cos_eq_zero_iff.mp h0
    have a1 : (-1 : ℝ) < 2 * m + 1 - 2 * k := by
      by_contra hc; push Not at hc
      have : (2 * (m : ℝ) + 1 - 2 * k) * π ≤ -π := by nlinarith
      linarith [ht.1]
    have a2 : (2 * m + 1 - 2 * k : ℝ) < 1 := by
      by_contra hc; push Not at hc
      have : π ≤ (2 * (m : ℝ) + 1 - 2 * k) * π := by nlinarith
      linarith [ht.2]
    have b1 : -1 < 2 * m + 1 - 2 * k := by exact_mod_cast a1
    have b2 : 2 * m + 1 - 2 * k < 1 := by exact_mod_cast a2
    omega

/-! ## Rešeni primeri -/

/-- Primer 1: arcsin(√3/2) = π/3 (sin(π/3) = √3/2, π/3 ∈ [−π/2, π/2]); cos(3π/4) = −√2/2 in 3π/4 ∈ [0, π],
zato arccos(−√2/2) = 3π/4; arctan(−1) = −arctan 1 = −π/4.
trditev: MAT-SS-3/krozne-funkcije#primer1
besedilo: »Velja $\cos\frac{\pi}{4} = \frac{\sqrt2}{2}$. Negativen kosinus ima kot v drugem kvadrantu: $\cos\frac{3\pi}{4} = -\frac{\sqrt2}{2}$. Ker $\frac{3\pi}{4}$ leži v $[0, \pi]$, je $\arccos\left(-\frac{\sqrt2}{2}\right) = \frac{3\pi}{4}$.« -/
theorem primer1 : sin (π / 3) = √3 / 2 ∧ arcsin (√3 / 2) = π / 3 ∧ cos (3 * π / 4) = -(√2 / 2) ∧
    arccos (-(√2 / 2)) = 3 * π / 4 ∧ arctan (-1) = -arctan 1 ∧ -arctan 1 = -(π / 4) := by
  have hp := pi_pos
  have c : cos (3 * π / 4) = -(√2 / 2) := by
    rw [show 3 * π / 4 = π - π / 4 by ring, cos_pi_sub, cos_pi_div_four]
  refine ⟨sin_pi_div_three, by rw [← sin_pi_div_three, arcsin_sin (by linarith) (by linarith)], c,
    by rw [← c, arccos_cos (by linarith) (by linarith)], arctan_neg 1, by rw [arctan_one]⟩

/-- Primer 2: f(x) = 2 arcsin(x − 1): −1 ≤ x − 1 ≤ 1 ⇔ 0 ≤ x ≤ 2 (D_f = [0, 2]); za x ∈ [0, 2] je
f(x) ∈ [−π, π] in vsako vrednost z [−π, π] f doseže (Z_f = [−π, π]); f(x) = 0 ⇔ x = 1 (RACUN, za vsak x);
f(3/2) = 2·π/6 = π/3; f narašča na [0, 2], f(0) = −π, f(2) = π.
trditev: MAT-SS-3/krozne-funkcije#primer2
besedilo: »Odgovor: $D_f = [0, 2]$, $Z_f = [-\pi, \pi]$, ničla je $x = 1$ in $f\left(\frac32\right) = \frac{\pi}{3}$.« -/
theorem primer2 :
    (∀ x : ℝ, (-1 ≤ x - 1 ∧ x - 1 ≤ 1) ↔ (0 ≤ x ∧ x ≤ 2)) ∧
    (∀ x ∈ Icc (0 : ℝ) 2, 2 * arcsin (x - 1) ∈ Icc (-π) π) ∧
    (∀ y ∈ Icc (-π) π, ∃ x ∈ Icc (0 : ℝ) 2, 2 * arcsin (x - 1) = y) ∧
    (∀ x : ℝ, 2 * arcsin (x - 1) = 0 ↔ x = 1) ∧
    2 * arcsin (3 / 2 - 1) = 2 * (π / 6) ∧ 2 * (π / 6) = π / 3 ∧
    StrictMonoOn (fun x => 2 * arcsin (x - 1)) (Icc 0 2) ∧
    2 * arcsin (0 - 1) = -π ∧ 2 * arcsin (2 - 1) = π := by
  have hp := pi_pos
  refine ⟨fun x => ⟨fun h => ⟨by linarith, by linarith⟩, fun h => ⟨by linarith, by linarith⟩⟩,
    fun x _ => ⟨by linarith [neg_pi_div_two_le_arcsin (x - 1)], by linarith [arcsin_le_pi_div_two (x - 1)]⟩,
    fun y hy => ⟨sin (y / 2) + 1, ⟨by linarith [neg_one_le_sin (y / 2)], by linarith [sin_le_one (y / 2)]⟩,
      by rw [add_sub_cancel_right, arcsin_sin (by linarith [hy.1]) (by linarith [hy.2])]; ring⟩,
    fun x => ⟨fun h => ?_, fun h => by rw [h]; simp⟩,
    by rw [show (3 / 2 - 1 : ℝ) = 1 / 2 by norm_num, arcsin_pol], by ring, ?_,
    by rw [zero_sub, arcsin_neg_one]; ring, by rw [show (2 - 1 : ℝ) = 1 by norm_num, arcsin_one]; ring⟩
  · have : arcsin (x - 1) = 0 := by linarith
    rw [arcsin_eq_zero_iff] at this; linarith
  · intro a ha b hb hab
    have := strictMonoOn_arcsin (a := a - 1) (b := b - 1) ⟨by linarith [ha.1], by linarith [ha.2]⟩
      ⟨by linarith [hb.1], by linarith [hb.2]⟩ (by linarith)
    simp only; linarith

/-- Primer 3 (enačba): za A ≠ 0 je A/2 = A sin(2π·250·t) ⇔ sin(500πt) = 1/2; RACUN: 500πt = π/6 ⇔
t = 1/3000 in 500πt = 5π/6 ⇔ t = 1/600 (π − π/6 = 5π/6).
trditev: MAT-SS-3/krozne-funkcije#primer3-enacba
besedilo: »Dobimo jo iz $\pi - \frac{\pi}{6} = \frac{5\pi}{6}$: $500\pi t_2 = \frac{5\pi}{6}$, torej $t_2 = \frac{1}{600}\,\mathrm{s} \approx 1{,}67\,\mathrm{ms}$.« -/
theorem primer3_enacba (A t : ℝ) (hA : A ≠ 0) :
    (A / 2 = A * sin (2 * π * 250 * t) ↔ sin (500 * π * t) = 1 / 2) ∧
    (500 * π * t = π / 6 ↔ t = 1 / 3000) ∧ π - π / 6 = 5 * π / 6 ∧ (500 * π * t = 5 * π / 6 ↔ t = 1 / 600) := by
  have hp := pi_pos.ne'
  refine ⟨?_, ?_, by ring, ?_⟩
  · rw [show 2 * π * 250 * t = 500 * π * t by ring]
    constructor
    · intro h
      have h' : A * sin (500 * π * t) = A * (1 / 2) := by linarith
      exact mul_left_cancel₀ hA h'
    · intro h; rw [h]; ring
  · constructor
    · intro h; field_simp at h; linarith
    · rintro rfl; field_simp; ring
  · constructor
    · intro h; field_simp at h; linarith
    · rintro rfl; field_simp; ring

/-- Pogoj izreka `primer3_enacba` se da izpolniti (A = 1). -/
example : (1 : ℝ) ≠ 0 := one_ne_zero

/-- Predpostavke trditve `primer3_enacba` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ) ≠ 0 := one_ne_zero
  primer3_enacba (hA := w)

/-- Primer 3: v prvem nihaju (0 < t ≤ 1/250 s = 4 ms) membrana doseže odmik A/2 natanko ob t₁ = 1/3000 s
≈ 0,333 ms (prva četrtina nihaja) in t₂ = 1/600 s ≈ 1,67 ms (druga četrtina).
trditev: MAT-SS-3/krozne-funkcije#primer3
besedilo: »Odgovor: odmik $\frac{A}{2}$ membrana doseže prvič po približno $0{,}333\,\mathrm{ms}$, drugič po približno $1{,}67\,\mathrm{ms}$.« -/
theorem primer3 (t : ℝ) (h0 : 0 < t) (h1 : t ≤ 1 / 250) :
    sin (500 * π * t) = 1 / 2 ↔ t = 1 / 3000 ∨ t = 1 / 600 := by
  have hp := pi_pos
  have hx0 : 0 < 500 * π * t := by positivity
  have hx1 : 500 * π * t ≤ 2 * π := by nlinarith
  rw [← sin_pi_div_six, eq_comm, sin_eq_sin_iff]
  constructor
  · rintro ⟨k, hk | hk⟩
    · have a : (-1 : ℝ) < k := by nlinarith
      have b : (k : ℝ) < 1 := by nlinarith
      have : k = 0 := by
        have a' : -1 < k := by exact_mod_cast a
        have b' : k < 1 := by exact_mod_cast b
        omega
      subst this; left; simp at hk; field_simp at hk; linarith
    · have a : (-1 : ℝ) < k := by nlinarith
      have b : (k : ℝ) < 1 := by nlinarith
      have : k = 0 := by
        have a' : -1 < k := by exact_mod_cast a
        have b' : k < 1 := by exact_mod_cast b
        omega
      subst this; right; simp at hk; field_simp at hk; linarith
  · rintro (rfl | rfl)
    · exact ⟨0, Or.inl (by simp; ring)⟩
    · exact ⟨0, Or.inr (by push_cast; ring)⟩

/-- Pogoja izreka `primer3` se dajo izpolniti (t = 1/3000). -/
example : (0 : ℝ) < 1 / 3000 ∧ (1 / 3000 : ℝ) ≤ 1 / 250 := by norm_num

/-- Predpostavke trditve `primer3` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 1 / 3000 ∧ (1 / 3000 : ℝ) ≤ 1 / 250 := by norm_num
  primer3 (h0 := w.1) (h1 := w.2)

/-- Primer 3, korak 4 (smer gibanja): sin(500πt) na [0, 1/1000] narašča (signal gre navzgor skozi A/2 pri
t₁ = 1/3000), na [1/1000, 1/500] pa pada (signal gre navzdol skozi A/2 pri t₂ = 1/600).
trditev: MAT-SS-3/krozne-funkcije#primer3-smer
besedilo: »Arkus sinus da prvo rešitev: $500\pi t_1 = \frac{\pi}{6}$, torej $t_1 = \frac{1}{3000}\,\mathrm{s} \approx 0{,}333\,\mathrm{ms}$.« -/
theorem primer3_smer :
    StrictMonoOn (fun t : ℝ => sin (500 * π * t)) (Icc 0 (1 / 1000)) ∧
    StrictAntiOn (fun t : ℝ => sin (500 * π * t)) (Icc (1 / 1000) (1 / 500)) := by
  have hp := pi_pos
  constructor
  · intro a ha b hb hab
    simp only
    apply strictMonoOn_sin
    · constructor <;> nlinarith [ha.1, ha.2]
    · constructor <;> nlinarith [hb.1, hb.2]
    · nlinarith
  · intro a ha b hb hab
    simp only
    rw [← cos_sub_pi_div_two, ← cos_sub_pi_div_two]
    apply strictAntiOn_cos
    · constructor <;> nlinarith [ha.1, ha.2]
    · constructor <;> nlinarith [hb.1, hb.2]
    · nlinarith

/-- Primer 3, smiselnost in zaokrožitve: nihajni čas 1/250 s = 4 ms, t₁ = 1/3000 s ≈ 0,333 ms leži v prvi
četrtini (pred 1 ms), t₂ = 1/600 s ≈ 1,67 ms v drugi (med 1 ms in 2 ms).
trditev: MAT-SS-3/krozne-funkcije#primer3-casi
besedilo: »Smiselnost: nihajni čas je $\frac{1}{250}\,\mathrm{s} = 4\,\mathrm{ms}$. Prvi čas je v prvi četrtini nihaja, ko gre membrana navzgor. Drugi je v drugi četrtini, ko se že vrača.« -/
theorem primer3_casi : (1 / 250 : ℝ) * 1000 = 4 ∧ (0.3325 : ℝ) < 1 / 3000 * 1000 ∧ (1 / 3000 : ℝ) * 1000 < 0.3335 ∧
    (1.665 : ℝ) < 1 / 600 * 1000 ∧ (1 / 600 : ℝ) * 1000 < 1.675 ∧ (1 / 3000 : ℝ) < 1 / 1000 ∧
    (1 / 1000 : ℝ) < 1 / 600 ∧ (1 / 600 : ℝ) < 2 / 1000 := by norm_num

/-- Primer 4: 4π/3 ∉ [0, π], cos(4π/3) = −1/2 in arccos(cos(4π/3)) = arccos(−1/2) = 2π/3 (cos(2π/3) = −1/2,
2π/3 ∈ [0, π]).
trditev: MAT-SS-3/krozne-funkcije#primer4
besedilo: »$\frac{2\pi}{3}$. Velja $\cos\frac{2\pi}{3} = -\frac12$ in $\frac{2\pi}{3}$ leži v $[0, \pi]$. Torej je $\arccos\left(\cos\frac{4\pi}{3}\right) = \frac{2\pi}{3}$.« -/
theorem primer4 : π < 4 * π / 3 ∧ cos (4 * π / 3) = -(1 / 2) ∧ arccos (cos (4 * π / 3)) = arccos (-(1 / 2)) ∧
    arccos (-(1 / 2)) = 2 * π / 3 ∧ cos (2 * π / 3) = -(1 / 2) := by
  have hp := pi_pos
  have c : cos (4 * π / 3) = -(1 / 2) := by
    rw [show 4 * π / 3 = π / 3 + π by ring, cos_add_pi, cos_pi_div_three]
  refine ⟨by linarith, c, by rw [c], lastnosti_arccos.2.2.2.1, ?_⟩
  rw [show 2 * π / 3 = π - π / 3 by ring, cos_pi_sub, cos_pi_div_three]

/-! ## Pogoste napake -/

/-- Pogoste napake: arcsin(sin(5π/4)) = −π/4 (sin(5π/4) = −√2/2), ne 5π/4; arccos(−1/2) = π − π/3 = 2π/3,
ne −π/3; napaka pri stopinjah je faktor 180/π, med 57 in 58 (»približno 57«).
trditev: MAT-SS-3/krozne-funkcije#pogoste
besedilo: »»$\arcsin(\sin x)$ je vedno $x$.«** Arkus sinus vrača le kote z $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$, zato je na primer $\arcsin\left(\sin\frac{5\pi}{4}\right) = -\frac{\pi}{4}$.« -/
theorem pogoste : sin (5 * π / 4) = -(√2 / 2) ∧ arcsin (sin (5 * π / 4)) = -(π / 4) ∧
    arcsin (sin (5 * π / 4)) ≠ 5 * π / 4 ∧ arccos (-(1 / 2)) = π - π / 3 ∧ arccos (-(1 / 2)) ≠ -(π / 3) ∧
    (57 : ℝ) < 180 / π ∧ 180 / π < 58 := by
  have hp := pi_pos
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  have s : sin (5 * π / 4) = -(√2 / 2) := by
    rw [show 5 * π / 4 = π / 4 + π by ring, sin_add_pi, sin_pi_div_four]
  have e : arcsin (sin (5 * π / 4)) = -(π / 4) := by
    rw [s, arcsin_neg, ← sin_pi_div_four, arcsin_sin (by linarith) (by linarith)]
  refine ⟨s, e, by rw [e]; intro h; linarith, by rw [lastnosti_arccos.2.2.2.1]; ring,
    by rw [lastnosti_arccos.2.2.2.1]; intro h; linarith, ?_, ?_⟩
  · rw [lt_div_iff₀ hp]; linarith
  · rw [div_lt_iff₀ hp]; linarith

/-! ## Za maturo -/

/-- Naloga 1 (f(x) = 2 arccos(x/2) − π): a) −1 ≤ x/2 ≤ 1 ⇔ −2 ≤ x ≤ 2, za x ∈ [−2, 2] je f(x) ∈ [−π, π] in f
doseže vsako vrednost z [−π, π]; b) f(x) = 0 ⇔ x = 0 in f(x) = π/3 ⇔ x = −1 (za vsak realni x; arccos(x/2) =
π/2 oz. 2π/3, x/2 = cos(π/2) = 0 oz. cos(2π/3) = −1/2); c) f pada na [−2, 2], f(−2) = π, f(2) = −π,
f(−1) = π/3, f(0) = 0.
trditev: MAT-SS-3/krozne-funkcije#matura1
besedilo: »Odgovor: a) $D_f = [-2, 2]$, $Z_f = [-\pi, \pi]$; b) ničla je $x = 0$, enačba $f(x) = \frac{\pi}{3}$ ima rešitev $x = -1$; c) graf pada od $(-2, \pi)$ do $(2, -\pi)$.« -/
theorem matura1 :
    (∀ x : ℝ, (-1 ≤ x / 2 ∧ x / 2 ≤ 1) ↔ (-2 ≤ x ∧ x ≤ 2)) ∧
    (∀ x ∈ Icc (-2 : ℝ) 2, 2 * arccos (x / 2) - π ∈ Icc (-π) π) ∧
    (∀ y ∈ Icc (-π) π, ∃ x ∈ Icc (-2 : ℝ) 2, 2 * arccos (x / 2) - π = y) ∧
    (∀ x : ℝ, 2 * arccos (x / 2) - π = 0 ↔ x = 0) ∧
    (∀ x : ℝ, 2 * arccos (x / 2) - π = π / 3 ↔ x = -1) ∧
    StrictAntiOn (fun x => 2 * arccos (x / 2) - π) (Icc (-2) 2) ∧
    2 * arccos (-2 / 2) - π = π ∧ 2 * arccos (2 / 2) - π = -π ∧
    2 * arccos (-1 / 2) - π = π / 3 ∧ 2 * arccos (0 / 2) - π = 0 := by
  have hp := pi_pos
  have c23 : arccos (-1 / 2) = 2 * π / 3 := by
    rw [neg_div, lastnosti_arccos.2.2.2.1]
  refine ⟨fun x => ⟨fun h => ⟨by linarith, by linarith⟩, fun h => ⟨by linarith, by linarith⟩⟩,
    fun x _ => ⟨by linarith [arccos_nonneg (x / 2)], by linarith [arccos_le_pi (x / 2)]⟩,
    fun y hy => ⟨2 * cos ((y + π) / 2), ⟨by linarith [neg_one_le_cos ((y + π) / 2)],
      by linarith [cos_le_one ((y + π) / 2)]⟩, ?_⟩,
    fun x => ⟨fun h => ?_, fun h => by rw [h]; simp; ring⟩,
    fun x => ⟨fun h => ?_, fun h => by rw [h, c23]; ring⟩, ?_,
    by rw [show (-2 / 2 : ℝ) = -1 by norm_num, arccos_neg_one]; ring,
    by rw [show (2 / 2 : ℝ) = 1 by norm_num, arccos_one]; ring, by rw [c23]; ring,
    by rw [zero_div, arccos_zero]; ring⟩
  · rw [mul_div_cancel_left₀ _ (two_ne_zero), arccos_cos (by linarith [hy.1]) (by linarith [hy.2])]; ring
  · have := iz_arccos (show arccos (x / 2) = π / 2 by linarith) (by positivity) (by linarith)
    rw [cos_pi_div_two] at this; linarith
  · have := iz_arccos (show arccos (x / 2) = 2 * π / 3 by linarith) (by positivity) (by linarith)
    rw [show 2 * π / 3 = π - π / 3 by ring, cos_pi_sub, cos_pi_div_three] at this; linarith
  · intro a ha b hb hab
    have := strictAntiOn_arccos (a := a / 2) (b := b / 2) ⟨by linarith [ha.1], by linarith [ha.2]⟩
      ⟨by linarith [hb.1], by linarith [hb.2]⟩ (by linarith)
    simp only; linarith

/-- Pomožna trditev: za θ ∈ [0, 2π] in A ∈ [0, π] je cos θ ≤ cos A natanko za A ≤ θ ≤ 2π − A.
pomozno -/
theorem cos_le_iff {θ A : ℝ} (h0 : 0 ≤ θ) (h1 : θ ≤ 2 * π) (hA0 : 0 ≤ A) (hA1 : A ≤ π) :
    cos θ ≤ cos A ↔ A ≤ θ ∧ θ ≤ 2 * π - A := by
  rcases le_total θ π with hθ | hθ
  · constructor
    · intro h
      refine ⟨?_, by linarith⟩
      by_contra hc; push Not at hc
      have := strictAntiOn_cos ⟨h0, hθ⟩ ⟨hA0, hA1⟩ hc
      linarith
    · rintro ⟨h, -⟩; exact cos_le_cos_of_nonneg_of_le_pi hA0 hθ h
  · have e : cos θ = cos (2 * π - θ) := by rw [cos_two_pi_sub]
    rw [e]
    constructor
    · intro h
      refine ⟨by linarith, ?_⟩
      by_contra hc; push Not at hc
      have := strictAntiOn_cos ⟨by linarith, by linarith⟩ ⟨hA0, hA1⟩ (show 2 * π - θ < A by linarith)
      linarith
    · rintro ⟨-, h⟩; exact cos_le_cos_of_nonneg_of_le_pi hA0 (by linarith) (by linarith)

/-- Pomožna trditev: arccos(−0,4) = π/2 + arcsin 0,4 in 1,982305 < arccos(−0,4) < 1,982315 (≈ 1,98231).
pomozno -/
theorem arccos04 : arccos (-0.4) = π / 2 + arcsin 0.4 ∧ (1.982305 : ℝ) < arccos (-0.4) ∧
    arccos (-0.4) < 1.982315 := by
  have e : arccos (-0.4) = π / 2 + arcsin 0.4 := by
    rw [arccos_neg, arccos_eq_pi_div_two_sub_arcsin]; ring
  have p1 := pi_gt_d20; have p2 := pi_lt_d20
  have a := arcsin04
  exact ⟨e, by rw [e]; linarith, by rw [e]; linarith⟩

/-- Naloga 2 (h(t) = 30 − 25 cos(πt/300) mm): a) ob t = 0 je utež v najnižji legi (h(0) = 5 ≤ h(t)),
h(100) = 30 − 25·cos(π/3) = 30 − 12,5 = 17,5 mm, h(t + 600) = h(t) in 2π/(π/300) = 600 ms; najvišja lega
h(300) = 55 mm.
trditev: MAT-SS-3/krozne-funkcije#matura2a
besedilo: »a) $h(100) = 30 - 25\cos\frac{\pi}{3} = 30 - 12{,}5 = 17{,}5$, utež je $17{,}5\,\text{mm}$ nad mizo.« -/
theorem matura2a :
    (30 - 25 * cos (π * 0 / 300) = 5) ∧ (∀ t : ℝ, 5 ≤ 30 - 25 * cos (π * t / 300)) ∧
    30 - 25 * cos (π * 100 / 300) = 30 - 25 * (1 / 2) ∧ (30 : ℝ) - 25 * (1 / 2) = 30 - 12.5 ∧
    (30 : ℝ) - 12.5 = 17.5 ∧
    (∀ t : ℝ, 30 - 25 * cos (π * (t + 600) / 300) = 30 - 25 * cos (π * t / 300)) ∧
    2 * π / (π / 300) = 600 ∧ 30 - 25 * cos (π * 300 / 300) = 55 ∧
    (∀ t : ℝ, 30 - 25 * cos (π * t / 300) ≤ 55) := by
  have hp := pi_pos
  refine ⟨by simp; norm_num, fun t => by linarith [cos_le_one (π * t / 300)],
    by rw [show π * 100 / 300 = π / 3 by ring, cos_pi_div_three], by norm_num, by norm_num, fun t => ?_,
    by field_simp; ring, by rw [show π * 300 / 300 = π by ring, cos_pi]; norm_num,
    fun t => by linarith [neg_one_le_cos (π * t / 300)]⟩
  rw [show π * (t + 600) / 300 = π * t / 300 + (1 : ℤ) * (2 * π) by push_cast; ring,
    cos_add_int_mul_two_pi]

/-- Naloga 2 b): h(t) = 40 ⇔ cos(πt/300) = −10/25 = −0,4; t₁ = 300·arccos(−0,4)/π ≈ 189,297 ms in
t₂ = 600 − t₁ ≈ 410,703 ms sta rešitvi, v nihaju (t ∈ [0, 600]) je utež vsaj 40 mm visoko natanko za
t₁ ≤ t ≤ t₂, in to traja t₂ − t₁ = 600 − 2t₁ ≈ 221,406 ms ≈ 221 ms.
trditev: MAT-SS-3/krozne-funkcije#matura2b
besedilo: »b) Kosinus ima enako vrednost tudi pri kotu $2\pi - \arccos(-0{,}4)$, zato je v istem nihaju druga rešitev $t_2 = 600 - t_1 \approx 410{,}703\,\text{ms}$.« -/
theorem matura2b :
    (∀ t : ℝ, 30 - 25 * cos (π * t / 300) = 40 ↔ cos (π * t / 300) = -10 / 25) ∧ (-10 / 25 : ℝ) = -0.4 ∧
    30 - 25 * cos (π * (300 * arccos (-0.4) / π) / 300) = 40 ∧
    30 - 25 * cos (π * (600 - 300 * arccos (-0.4) / π) / 300) = 40 ∧
    (∀ t ∈ Icc (0 : ℝ) 600, 40 ≤ 30 - 25 * cos (π * t / 300) ↔
      300 * arccos (-0.4) / π ≤ t ∧ t ≤ 600 - 300 * arccos (-0.4) / π) ∧
    (189.2965 : ℝ) < 300 * arccos (-0.4) / π ∧ 300 * arccos (-0.4) / π < 189.2975 ∧
    (189.25 : ℝ) < 300 * arccos (-0.4) / π ∧ 300 * arccos (-0.4) / π < 189.35 ∧
    (410.7025 : ℝ) < 600 - 300 * arccos (-0.4) / π ∧ 600 - 300 * arccos (-0.4) / π < 410.7035 ∧
    (600 - 300 * arccos (-0.4) / π) - 300 * arccos (-0.4) / π = 600 - 600 * arccos (-0.4) / π ∧
    (221.4055 : ℝ) < 600 - 600 * arccos (-0.4) / π ∧ 600 - 600 * arccos (-0.4) / π < 221.4065 ∧
    (220.5 : ℝ) < 600 - 600 * arccos (-0.4) / π ∧ 600 - 600 * arccos (-0.4) / π < 221.5 := by
  have hp := pi_pos
  have p1 := pi_gt_d20; have p2 := pi_lt_d20
  obtain ⟨e, -, -⟩ := arccos04
  have a := arcsin04
  have hA0 := arccos_nonneg (-0.4 : ℝ)
  have hA1 := arccos_le_pi (-0.4 : ℝ)
  have cA : cos (arccos (-0.4 : ℝ)) = -0.4 := cos_arccos (by norm_num) (by norm_num)
  -- t₁ = 150 + 300·arcsin 0,4/π
  have t1 : 300 * arccos (-0.4) / π = 150 + 300 * arcsin 0.4 / π := by rw [e]; field_simp; ring
  have b1 : (39.2965 : ℝ) < 300 * arcsin 0.4 / π := by rw [lt_div_iff₀ hp]; nlinarith
  have b2 : 300 * arcsin 0.4 / π < (39.2975 : ℝ) := by rw [div_lt_iff₀ hp]; nlinarith
  have b3 : (78.5935 : ℝ) < 600 * arcsin 0.4 / π := by rw [lt_div_iff₀ hp]; nlinarith
  have b4 : 600 * arcsin 0.4 / π < (78.5945 : ℝ) := by rw [div_lt_iff₀ hp]; nlinarith
  have t2 : 600 * arccos (-0.4) / π = 300 + 600 * arcsin 0.4 / π := by rw [e]; field_simp; ring
  refine ⟨fun t => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, ?_, ?_, ?_,
    by rw [t1]; linarith, by rw [t1]; linarith, by rw [t1]; linarith, by rw [t1]; linarith,
    by rw [t1]; linarith, by rw [t1]; linarith, by ring, by rw [t2]; linarith, by rw [t2]; linarith,
    by rw [t2]; linarith, by rw [t2]; linarith⟩
  · rw [show π * (300 * arccos (-0.4) / π) / 300 = arccos (-0.4) by field_simp, cA]; norm_num
  · rw [show π * (600 - 300 * arccos (-0.4) / π) / 300 = 2 * π - arccos (-0.4) by field_simp; ring,
      cos_two_pi_sub, cA]; norm_num
  · intro t ht
    have hθ0 : 0 ≤ π * t / 300 := by have := ht.1; positivity
    have hθ1 : π * t / 300 ≤ 2 * π := by nlinarith [ht.2]
    have k := cos_le_iff hθ0 hθ1 hA0 hA1
    rw [cA] at k
    have i1 : arccos (-0.4) ≤ π * t / 300 ↔ 300 * arccos (-0.4) / π ≤ t := by
      rw [div_le_iff₀ hp, le_div_iff₀ (by norm_num : (0:ℝ) < 300)]; constructor <;> intro h <;> linarith
    have i2 : π * t / 300 ≤ 2 * π - arccos (-0.4) ↔ t ≤ 600 - 300 * arccos (-0.4) / π := by
      rw [show 600 - 300 * arccos (-0.4) / π = (600 * π - 300 * arccos (-0.4)) / π by field_simp,
        le_div_iff₀ hp, div_le_iff₀ (by norm_num : (0:ℝ) < 300)]
      constructor <;> intro h <;> linarith
    rw [← i1, ← i2, ← k]
    constructor <;> intro h <;> linarith

/-- Naloga 2 c): za 0 ≤ t ≤ 300 je cos(πt/300) = (30 − h)/25 in t = 300/π·arccos((30 − h)/25) (ker je
πt/300 ∈ [0, π]); −1 ≤ (30 − h)/25 ≤ 1 ⇔ 5 ≤ h ≤ 55 (D = [5, 55]); za h ∈ [5, 55] je čas v [0, 300] in višina
ob tem času je h (Z = [0, 300]); RACUN: čas pri h = 5 je 0, pri h = 55 je 300.
trditev: MAT-SS-3/krozne-funkcije#matura2c
besedilo: »Odgovor: a) $17{,}5\,\text{mm}$, en nihaj traja $600\,\text{ms}$; b) senzor zaznava utež približno $221\,\text{ms}$; c) $t = \frac{300}{\pi}\arccos\frac{30 - h}{25}$, $D = [5, 55]$, $Z = [0, 300]$.« -/
theorem matura2c :
    (∀ t ∈ Icc (0 : ℝ) 300, cos (π * t / 300) = (30 - (30 - 25 * cos (π * t / 300))) / 25 ∧
      t = 300 / π * arccos ((30 - (30 - 25 * cos (π * t / 300))) / 25)) ∧
    (∀ h : ℝ, (-1 ≤ (30 - h) / 25 ∧ (30 - h) / 25 ≤ 1) ↔ (5 ≤ h ∧ h ≤ 55)) ∧
    (∀ h ∈ Icc (5 : ℝ) 55, 300 / π * arccos ((30 - h) / 25) ∈ Icc (0 : ℝ) 300 ∧
      30 - 25 * cos (π * (300 / π * arccos ((30 - h) / 25)) / 300) = h) ∧
    300 / π * arccos ((30 - 5) / 25) = 0 ∧ 300 / π * arccos ((30 - 55) / 25) = 300 := by
  have hp := pi_pos
  refine ⟨fun t ht => ⟨by ring, ?_⟩, fun h => ⟨fun k => ⟨by
      have := k.2; rw [div_le_iff₀ (by norm_num)] at this; linarith, by
      have := k.1; rw [le_div_iff₀ (by norm_num)] at this; linarith⟩,
    fun k => ⟨by rw [le_div_iff₀ (by norm_num)]; linarith, by rw [div_le_iff₀ (by norm_num)]; linarith⟩⟩,
    fun h hh => ⟨⟨by have := arccos_nonneg ((30 - h) / 25); positivity, ?_⟩, ?_⟩, ?_, ?_⟩
  · rw [show (30 - (30 - 25 * cos (π * t / 300))) / 25 = cos (π * t / 300) by ring,
      arccos_cos (by have := ht.1; positivity) (by nlinarith [ht.2])]
    field_simp
  · have := arccos_le_pi ((30 - h) / 25)
    rw [div_mul_eq_mul_div, div_le_iff₀ hp]; nlinarith
  · rw [show π * (300 / π * arccos ((30 - h) / 25)) / 300 = arccos ((30 - h) / 25) by field_simp,
      cos_arccos (by rw [le_div_iff₀ (by norm_num)]; linarith [hh.2])
        (by rw [div_le_iff₀ (by norm_num)]; linarith [hh.1])]
    ring
  · rw [show ((30 : ℝ) - 5) / 25 = 1 by norm_num, arccos_one]; ring
  · rw [show ((30 : ℝ) - 55) / 25 = -1 by norm_num, arccos_neg_one]; field_simp

/-- Ustno vprašanje 3: arcsin(sin x) = x ne velja za vsak x: sin(2π/3) = √3/2 in arcsin(√3/2) = π/3 ≠ 2π/3.
trditev: MAT-SS-3/krozne-funkcije#ustno3
besedilo: »Za $x = \frac{2\pi}{3}$ je $\sin\frac{2\pi}{3} = \frac{\sqrt3}{2}$, $\arcsin\frac{\sqrt3}{2}$ pa je $\frac{\pi}{3}$, kar ni enako $\frac{2\pi}{3}$.« -/
theorem ustno3 : sin (2 * π / 3) = √3 / 2 ∧ arcsin (sin (2 * π / 3)) = π / 3 ∧ π / 3 ≠ 2 * π / 3 := by
  have hp := pi_pos
  have s : sin (2 * π / 3) = √3 / 2 := by
    rw [show 2 * π / 3 = π - π / 3 by ring, sin_pi_sub, sin_pi_div_three]
  exact ⟨s, by rw [s, primer1.2.1], by intro h; linarith⟩

/-! ## Drugače -/

/-- Drugače, kot zgodba: sin 30° = sin 150° = sin 390° = 1/2, osciloskop pokaže arcsin(1/2) = 30°
(= π/6), in 180° − 30° = 150°.
trditev: MAT-SS-3/krozne-funkcije#zgodba
besedilo: »$180° - 30° = 150°$« -/
theorem zgodba : sin (π / 6) = 1 / 2 ∧ sin (5 * π / 6) = 1 / 2 ∧ sin (13 * π / 6) = 1 / 2 ∧
    arcsin (1 / 2) = π / 6 ∧ π - π / 6 = 5 * π / 6 :=
  ⟨sin_pi_div_six, razlaga2.2.1, razlaga2.2.2, arcsin_pol, by ring⟩

/-- Drugače, korak za korakom (tabela in primeri): vrednosti arcsin in arccos pri −1, −1/2, 0, 1/2, √2/2,
√3/2, 1; arcsin(−√2/2) = −π/4, arctan(−√3) = −π/3, arccos(−√3/2) = π − π/6 = 5π/6; v vsaki vrstici je
arcsin x + arccos x = π/2.
trditev: MAT-SS-3/krozne-funkcije#tabela
besedilo: »$\arccos\left(-\frac{\sqrt3}{2}\right) = \pi - \frac{\pi}{6} = \frac{5\pi}{6}$« -/
theorem tabela :
    (arcsin (-1) = -(π / 2) ∧ arccos (-1) = π) ∧
    (arcsin (-(1 / 2)) = -(π / 6) ∧ arccos (-(1 / 2)) = 2 * π / 3) ∧
    (arcsin 0 = 0 ∧ arccos 0 = π / 2) ∧
    (arcsin (1 / 2) = π / 6 ∧ arccos (1 / 2) = π / 3) ∧
    (arcsin (√2 / 2) = π / 4 ∧ arccos (√2 / 2) = π / 4) ∧
    (arcsin (√3 / 2) = π / 3 ∧ arccos (√3 / 2) = π / 6) ∧
    (arcsin 1 = π / 2 ∧ arccos 1 = 0) ∧
    arcsin (-(√2 / 2)) = -(π / 4) ∧ arctan (-√3) = -(π / 3) ∧ arccos (-(√3 / 2)) = π - π / 6 ∧
    π - π / 6 = 5 * π / 6 ∧ (∀ x ∈ Icc (-1 : ℝ) 1, arcsin x + arccos x = π / 2) := by
  have hp := pi_pos
  have s2 : arcsin (√2 / 2) = π / 4 := by
    rw [← sin_pi_div_four, arcsin_sin (by linarith) (by linarith)]
  have c2 : arccos (√2 / 2) = π / 4 := by
    rw [← cos_pi_div_four, arccos_cos (by linarith) (by linarith)]
  have c3 : arccos (√3 / 2) = π / 6 := by
    rw [← cos_pi_div_six, arccos_cos (by linarith) (by linarith)]
  refine ⟨⟨arcsin_neg_one, arccos_neg_one⟩, ⟨by rw [arcsin_neg, arcsin_pol], lastnosti_arccos.2.2.2.1⟩,
    ⟨arcsin_zero, arccos_zero⟩, ⟨arcsin_pol, lastnosti_arccos.2.2.2.2.1⟩, ⟨s2, c2⟩, ⟨primer1.2.1, c3⟩,
    ⟨arcsin_one, arccos_one⟩, by rw [arcsin_neg, s2], lastnosti_arctan.2.2.2.2.2.2,
    by rw [arccos_neg, c3], by ring, fun x _ => by rw [arccos_eq_pi_div_two_sub_arcsin]; ring⟩

/-! ## Preveri se -/

/-- Preveri se 1: arcsin(1/2) = arccos(√3/2) = arctan(√3/3) = π/6 = 30°, izstopa arccos(1/2) = π/3 = 60°
(RACUN: arccos(1/2)·180/π = 60); napačni odgovor 1,05 je π/3 v radianih.
trditev: MAT-SS-3/krozne-funkcije#preveri1
besedilo: »Prve tri so $\frac{\pi}{6} = 30°$. Izstopa $\arccos\frac12 = \frac{\pi}{3} = 60°$, ker je $\cos 60° = \frac12$.« -/
theorem preveri1 : arcsin (1 / 2) = π / 6 ∧ arccos (√3 / 2) = π / 6 ∧ arctan (√3 / 3) = π / 6 ∧
    arccos (1 / 2) = π / 3 ∧ π / 6 * 180 / π = 30 ∧ arccos (1 / 2) * 180 / π = 60 ∧
    (1.045 : ℝ) < π / 3 ∧ π / 3 < 1.055 := by
  have hp := pi_pos
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  have t : tan (π / 6) = √3 / 3 := by
    rw [tan_pi_div_six]; have h3 : 0 < √3 := by positivity
    field_simp; rw [Real.sq_sqrt (by norm_num)]
  refine ⟨arcsin_pol, tabela.2.2.2.2.2.1.2, by rw [← t, arctan_tan (by linarith) (by linarith)],
    lastnosti_arccos.2.2.2.2.1, by field_simp; ring, by rw [lastnosti_arccos.2.2.2.2.1]; field_simp; ring,
    by linarith, by linarith⟩

/-- Preveri se 2 in RACUN `limita`: y = 2 arctan x ima vodoravni asimptoti y = π (x → ∞) in y = −π (x → −∞),
zaloga vrednosti je (−π, π).
trditev: MAT-SS-3/krozne-funkcije#preveri2
besedilo: »Na sliki je graf funkcije $y = 2\arctan x$. Zakaj ima vodoravni asimptoti $y = \pi$ in $y = -\pi$?« -/
theorem preveri2 : Tendsto (fun x => 2 * arctan x) atTop (𝓝 π) ∧
    Tendsto (fun x => 2 * arctan x) atBot (𝓝 (-π)) ∧ ∀ x, -π < 2 * arctan x ∧ 2 * arctan x < π := by
  have a := asimptoti
  refine ⟨?_, ?_, fun x => ⟨by linarith [(a.2.2 x).1], by linarith [(a.2.2 x).2]⟩⟩
  · have := a.1.const_mul 2; rwa [show 2 * (π / 2) = π by ring] at this
  · have := a.2.1.const_mul 2; rwa [show 2 * -(π / 2) = -π by ring] at this

/-- Preveri se 3 (Maja): korak A je pravilen (sin(5π/4) = −√2/2), korak B ne: arcsin(−√2/2) = −π/4 ≠ 5π/4.
trditev: MAT-SS-3/krozne-funkcije#preveri3
besedilo: »Korak A: $\sin\frac{5\pi}{4} = -\frac{\sqrt2}{2}$.« -/
theorem preveri3 : sin (5 * π / 4) = -(√2 / 2) ∧ arcsin (-(√2 / 2)) = -(π / 4) ∧
    arcsin (-(√2 / 2)) ≠ 5 * π / 4 := by
  have hp := pi_pos
  refine ⟨pogoste.1, tabela.2.2.2.2.2.2.2.1, by rw [tabela.2.2.2.2.2.2.2.1]; intro h; linarith⟩

/-- Preveri se 4: sin(400πt) = 0,8 velja ob t₁ = arcsin 0,8/(400π) s in nikoli prej (za t > 0);
t₁ ≈ 0,738 ms (RACUN); napačni odgovori: arcsin 0,8 ≈ 53,13° in 53,13/(400π)·1000 ≈ 42,28, arcsin 0,8/200·1000
≈ 4,636 ter drugi čas (π − arcsin 0,8)/(400π)·1000 ≈ 1,762 ms.
trditev: MAT-SS-3/krozne-funkcije#preveri4
besedilo: »42,28 | Kalkulator je računal v stopinjah ($\arcsin 0{,}8 \approx 53{,}13°$). Izraz $2\pi \cdot 200\, t$ je v radianih.« -/
theorem preveri4 : sin (400 * π * (arcsin 0.8 / (400 * π))) = 0.8 ∧
    (∀ t : ℝ, 0 < t → sin (400 * π * t) = 0.8 → arcsin 0.8 / (400 * π) ≤ t) ∧
    (0.7375 : ℝ) < arcsin 0.8 / (400 * π) * 1000 ∧ arcsin 0.8 / (400 * π) * 1000 < 0.7385 ∧
    (53.125 : ℝ) < arcsin 0.8 * 180 / π ∧ arcsin 0.8 * 180 / π < 53.135 ∧
    (42.275 : ℝ) < arcsin 0.8 * 180 / π / (400 * π) * 1000 ∧
    arcsin 0.8 * 180 / π / (400 * π) * 1000 < 42.285 ∧
    (4.6355 : ℝ) < arcsin 0.8 / 200 * 1000 ∧ arcsin 0.8 / 200 * 1000 < 4.6365 ∧
    (1.7615 : ℝ) < (π - arcsin 0.8) / (400 * π) * 1000 ∧ (π - arcsin 0.8) / (400 * π) * 1000 < 1.7625 := by
  have hp := pi_pos
  have p1 := pi_gt_d20; have p2 := pi_lt_d20
  have a := arcsin08
  have hπ2 : 0 < π ^ 2 := by positivity
  refine ⟨?_, fun t ht h => ?_, ?_, ?_, ?_, ?_, ?_, ?_, by linarith, by linarith, ?_, ?_⟩
  · rw [show 400 * π * (arcsin 0.8 / (400 * π)) = arcsin 0.8 by field_simp,
      sin_arcsin (by norm_num) (by norm_num)]
  · obtain ⟨k, hk | hk⟩ := (resitve_sin 0.8 (400 * π * t) (by norm_num) (by norm_num)).mp h
    · have : (0 : ℝ) ≤ k := by
        by_contra hc; push Not at hc
        have hk1 : (k : ℝ) ≤ -1 := by
          have : k < 0 := by exact_mod_cast hc
          exact_mod_cast (show k ≤ -1 by omega)
        have : 0 < 400 * π * t := by positivity
        nlinarith [arcsin_le_pi_div_two (0.8 : ℝ)]
      rw [div_le_iff₀ (by positivity)]; nlinarith
    · have : (0 : ℝ) ≤ k := by
        by_contra hc; push Not at hc
        have hk1 : (k : ℝ) ≤ -1 := by
          have : k < 0 := by exact_mod_cast hc
          exact_mod_cast (show k ≤ -1 by omega)
        have : 0 < 400 * π * t := by positivity
        nlinarith [neg_pi_div_two_le_arcsin (0.8 : ℝ)]
      rw [div_le_iff₀ (by positivity)]; nlinarith [arcsin_le_pi_div_two (0.8 : ℝ)]
  · rw [div_mul_eq_mul_div, lt_div_iff₀ (by positivity)]; nlinarith
  · rw [div_mul_eq_mul_div, div_lt_iff₀ (by positivity)]; nlinarith
  · rw [lt_div_iff₀ hp]; nlinarith
  · rw [div_lt_iff₀ hp]; nlinarith
  · rw [div_div, div_mul_eq_mul_div, lt_div_iff₀ (by positivity)]; nlinarith
  · rw [div_div, div_mul_eq_mul_div, div_lt_iff₀ (by positivity)]; nlinarith
  · rw [div_mul_eq_mul_div, lt_div_iff₀ (by positivity)]; nlinarith
  · rw [div_mul_eq_mul_div, div_lt_iff₀ (by positivity)]; nlinarith

/-- Preveri se 5 in RACUN `resi`: 2 sin x = −1 ⇔ sin x = −1/2 ⇔ x = −π/6 + 2kπ ali x = 7π/6 + 2kπ
(x₁ = arcsin(−1/2) = −π/6, π − x₁ = 7π/6); na [0, 2π) sta rešitvi 7π/6 in 11π/6 = −π/6 + 2π.
trditev: MAT-SS-3/krozne-funkcije#preveri5
besedilo: »Arkus sinus da le $-\frac{\pi}{6}$, ki ni v $[0, 2\pi)$. Druga družina je $\pi - x_1 = \frac{7\pi}{6}$; iz prve pri $k = 1$ dobiš $\frac{11\pi}{6}$.« -/
theorem preveri5 : (∀ x : ℝ, 2 * sin x = -1 ↔ ∃ k : ℤ, x = -(π / 6) + 2 * k * π ∨ x = 7 * π / 6 + 2 * k * π) ∧
    π - -(π / 6) = 7 * π / 6 ∧ -(π / 6) + 2 * (1 : ℤ) * π = 11 * π / 6 ∧
    (∀ x : ℝ, 0 ≤ x → x < 2 * π → (2 * sin x = -1 ↔ x = 7 * π / 6 ∨ x = 11 * π / 6)) := by
  refine ⟨fun x => ?_, by ring, by push_cast; ring, fun x h0 h1 => ?_⟩
  · rw [show 2 * sin x = -1 ↔ sin x = -(1 / 2) from ⟨fun h => by linarith, fun h => by rw [h]; ring⟩,
      resitve_sin _ _ (by norm_num) (by norm_num), simulacija 0 le_rfl (by positivity) |>.2.2.2.2.1]
    constructor
    · rintro ⟨k, h | h⟩
      · exact ⟨k, Or.inl h⟩
      · exact ⟨k, Or.inr (by rw [h]; ring)⟩
    · rintro ⟨k, h | h⟩
      · exact ⟨k, Or.inl h⟩
      · exact ⟨k, Or.inr (by rw [h]; ring)⟩
  · rw [show 2 * sin x = -1 ↔ sin x = -(1 / 2) from ⟨fun h => by linarith, fun h => by rw [h]; ring⟩]
    exact (simulacija x h0 h1).2.1

end Evklid.Lekcije.MAT_SS_3.KrozneFunkcije
