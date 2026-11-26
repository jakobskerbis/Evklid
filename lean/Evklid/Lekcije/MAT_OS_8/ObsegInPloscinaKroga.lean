/-
vir: content/lessons/MAT-OS-8/obseg-in-ploscina-kroga.md
sha256: 97328f89cb98e0868f25f9dbecc5fc93fd0fc05952f97a36cbe7fdef8fafa5be
Model: π je Mathlibov `Real.pi`. Krog s središčem S in polmerom r je `Metric.closedBall S r` v ravnini
`EuclideanSpace ℝ (Fin 2)`; njegova ploščina je dokazana z Mathlibovo Lebesgueovo mero
(`EuclideanSpace.volume_closedBall_fin_two`). Obseg je dokazan kot dolžina poti ∫₀^{2π} ‖γ'(θ)‖ dθ za pot
γ(θ) = c + r·e^{iθ} v kompleksni ravnini (`circleMap`), katere slika je krožnica s polmerom r. Iz tega sledi,
da je o : d = π za vsak krog (r > 0). Računi s π ≈ 3,14 so točni računi z racionalnim številom 3,14 (kot
zahteva lekcija); zaokroženi rezultati so dokazani kot |točna − približek| < pol enote zadnjega mesta.
Meritve (Razlaga, tabela) so dokazane kot količniki, zaokroženi na tri decimalke. Lean: √ negativnega
števila je 0, zato ima r = √(p/π) pogoja r ≥ 0 in p ≥ 0. Približek 7,7 m iz uvoda je dokazan s pravim π
(3,141592 < π < 3,141593, `Real.pi_gt_d6`, `Real.pi_lt_d6`).
Ni v Leanu: risbe in simulacija; izpeljava ploščine z izseki (»pravokotnik« πr krat r kot meja pri vse več
izsekih: zahtevno, še ni dokazano; ploščina πr² je dokazana z mero, analogija s trakovi pa kot integral
∫₀ʳ 2πs ds = πr² in kot ploščina trikotnika 2πr · r/2); da je vsak krog povečava drugega (podobnost) kot
geometrijska trditev (dokazano je, da obseg s polmerom kr znaša k-kratnik in da se količnik pri povečavi ne
spremeni); »decimalke se ne ponavljajo« kot trditev o decimalnem zapisu (dokazano je, da π ni ulomek,
`irrational_pi`, kar je isto, a ta enakovrednost ni dokazana); Arhimedov postopek z včrtanim in očrtanim
96-kotnikom (zahtevno, še ni dokazano; dokazane so njegove meje 3 10/71 < π < 3 1/7); zgodovinski podatki
(Arhimed, Lambert 1761); enote (m, cm, m², 1 m² = 10 000 cm² je dokazano kot 100² = 10 000) in »kateri
obrazec« kot nasvet; zgodbe (stadion, tarča, kolo, trener) kot opisi; menjalnica kot analogija; besedilo
napačnih odgovorov v Preveri se (dokazane so napačne vrednosti, ki jih razlaga navaja). Opomba: lekcija
računa s 3,14; s pravim π bi bila zaokrožena rezultata Primera 1 11,31 m in 10,18 m² (ni napaka lekcije,
ker naloga predpiše π ≈ 3,14; dokazano v `primer1_pravi_pi`).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_8.ObsegInPloscinaKroga

open Real

/-! ## Razlaga: meritev in število π -/

/-- Razlaga, tabela meritev: 23,9 : 7,6 ≈ 3,145; 84,8 : 27 ≈ 3,141; 141,4 : 45 ≈ 3,142 (zaokroženo na tri
decimalke: napaka manj kot 0,0005). -/
theorem meritve :
    |(23.9:ℝ) / 7.6 - 3.145| < 0.0005 ∧ |(84.8:ℝ) / 27 - 3.141| < 0.0005 ∧
    |(141.4:ℝ) / 45 - 3.142| < 0.0005 := by
  refine ⟨?_, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> norm_num

/-- Model obsega: pot γ(θ) = c + r·e^{iθ}, θ ∈ (0, 2π], preteče krožnico s središčem c in polmerom |r|. -/
theorem pot_je_kroznica (c : ℂ) (r : ℝ) :
    circleMap c r '' Set.Ioc 0 (2 * π) = Metric.sphere c |r| := image_circleMap_Ioc c r

/-- Razlaga, obseg: dolžina krožnice s polmerom r ≥ 0 (dolžina poti ∫₀^{2π} ‖γ'(θ)‖ dθ) je o = 2πr. -/
theorem obseg (c : ℂ) (r : ℝ) (hr : 0 ≤ r) :
    ∫ θ in (0:ℝ)..2 * π, ‖deriv (circleMap c r) θ‖ = 2 * π * r := by
  simp only [deriv_circleMap, norm_mul, norm_circleMap_zero, Complex.norm_I, mul_one, abs_of_nonneg hr,
    intervalIntegral.integral_const, smul_eq_mul, sub_zero]

/-- Predpostavka trditev `obseg` in `ploscina` se da izpolniti (r = 1,8). -/
example : (0:ℝ) ≤ 1.8 := by norm_num

/-- Razlaga, Povzetek: premer je dvakratni polmer, d = 2r, in o = πd = 2πr. -/
theorem obseg_s_premerom (r : ℝ) : π * (2 * r) = 2 * π * r := by ring

/-- Razlaga, Povzetek, Preveri se 1, Premisli (sredinski krog): količnik obsega in premera je pri vsakem
krogu (r > 0) enak π. -/
theorem pi_je_kolicnik (r : ℝ) (hr : 0 < r) : (2 * π * r) / (2 * r) = π := by
  field_simp

/-- Predpostavka `pi_je_kolicnik` se da izpolniti (r = 9,15, polovica premera 18,3). -/
example : (0:ℝ) < 9.15 := by norm_num

/-- Razlaga: π = 3,14159…: 3,141592 < π < 3,141593, zato π ≈ 3,14 (napaka manj kot 0,005), a π ni 3,14. -/
theorem pi_priblizno :
    (3.141592:ℝ) < π ∧ π < 3.141593 ∧ |π - 3.14| < 0.005 ∧ π ≠ 3.14 := by
  have h1 := pi_gt_d6
  have h2 := pi_lt_d6
  refine ⟨h1, h2, ?_, ?_⟩
  · rw [abs_lt]; constructor <;> linarith
  · intro h; rw [h] at h1; norm_num at h1

/-- Razlaga, Pogoste napake: π ni ulomek (je iracionalno število); zato ni točno 3,14 ne 22/7. -/
theorem pi_ni_ulomek : (¬ ∃ q : ℚ, (q:ℝ) = π) ∧ π ≠ 3.14 ∧ π ≠ 22 / 7 := by
  refine ⟨fun ⟨q, hq⟩ => irrational_pi ⟨q, hq⟩, pi_priblizno.2.2.2, ?_⟩
  intro h
  have := pi_lt_d6
  rw [h] at this
  norm_num at this

/-! ## Razlaga: ploščina in obratni obrazci -/

/-- Razlaga, Povzetek: ploščina kroga s polmerom r ≥ 0 (Lebesgueova mera kroga v ravnini) je p = πr². -/
theorem ploscina (S : EuclideanSpace ℝ (Fin 2)) (r : ℝ) (hr : 0 ≤ r) :
    MeasureTheory.volume (Metric.closedBall S r) = ENNReal.ofReal (π * r ^ 2) := by
  rw [EuclideanSpace.volume_closedBall_fin_two, ← ENNReal.ofReal_pow hr,
    ← ENNReal.ofReal_mul (by positivity), mul_comm]

/-- Razlaga: »pravokotnik« iz izsekov z osnovnico πr (polovica obsega, 2πr/2) in višino r ima ploščino
πr · r = πr². -/
theorem pravokotnik_iz_izsekov (r : ℝ) : (2 * π * r) / 2 = π * r ∧ π * r * r = π * r ^ 2 :=
  ⟨by ring, by ring⟩

/-- Razlaga, Povzetek, Primer 4: polmer iz obsega: o = 2πr natanko tedaj, ko je r = o/(2π). -/
theorem polmer_iz_obsega (o r : ℝ) : o = 2 * π * r ↔ r = o / (2 * π) := by
  have : (2 * π) ≠ 0 := by positivity
  constructor
  · rintro rfl; field_simp
  · rintro rfl; field_simp

/-- Razlaga, Povzetek: polmer iz ploščine: za r ≥ 0 in p ≥ 0 je p = πr² natanko tedaj, ko je
r = √(p/π). -/
theorem polmer_iz_ploscine (p r : ℝ) (hr : 0 ≤ r) (hp : 0 ≤ p) : p = π * r ^ 2 ↔ r = √(p / π) := by
  have hpi : 0 < π := pi_pos
  constructor
  · rintro rfl
    rw [mul_div_cancel_left₀ _ hpi.ne', Real.sqrt_sq hr]
  · rintro rfl
    rw [Real.sq_sqrt (div_nonneg hp hpi.le)]
    field_simp

/-- Predpostavke `polmer_iz_ploscine` se dajo izpolniti (r = 4, p = 16π). -/
example : (0:ℝ) ≤ 4 ∧ 0 ≤ 16 * π := ⟨by norm_num, by positivity⟩

/-! ## Rešeni primeri -/

/-- Primer 1: o = 2 · 3,14 · 1,8 = 11,304 ≈ 11,30; 1,8² = 3,24; p = 3,14 · 3,24 = 10,1736 ≈ 10,17;
objeti kvadrat ima stranico 3,6 in ploščino 3,6² = 12,96, ki je večja od ploščine kroga. -/
theorem primer1 :
    (2:ℝ) * 3.14 * 1.8 = 11.304 ∧ |(11.304:ℝ) - 11.30| < 0.005 ∧ (1.8:ℝ) ^ 2 = 3.24 ∧
    (3.14:ℝ) * 3.24 = 10.1736 ∧ |(10.1736:ℝ) - 10.17| < 0.005 ∧ (2:ℝ) * 1.8 = 3.6 ∧
    (3.6:ℝ) ^ 2 = 12.96 ∧ (10.1736:ℝ) < 12.96 := by
  refine ⟨by norm_num, ?_, by norm_num, by norm_num, ?_, by norm_num, by norm_num, by norm_num⟩ <;>
    rw [abs_lt] <;> constructor <;> norm_num

/-- Primer 1, smiselnost v splošnem: krog s polmerom r > 0 ima manjšo ploščino kot objeti kvadrat s
stranico 2r (πr² < (2r)², ker je π < 4). -/
theorem krog_manjsi_od_kvadrata (r : ℝ) (hr : 0 < r) : π * r ^ 2 < (2 * r) ^ 2 := by
  have := pi_lt_four
  have h2 : 0 < r ^ 2 := by positivity
  nlinarith

/-- Predpostavka `krog_manjsi_od_kvadrata` se da izpolniti (r = 1,8). -/
example : (0:ℝ) < 1.8 := by norm_num

/-- Primer 1 s pravim π (opomba v glavi): 2π · 1,8 ≈ 11,31 in π · 1,8² ≈ 10,18. -/
theorem primer1_pravi_pi : |2 * π * 1.8 - 11.31| < 0.005 ∧ |π * 1.8 ^ 2 - 10.18| < 0.005 := by
  have h1 := pi_gt_d6
  have h2 := pi_lt_d6
  constructor <;> rw [abs_lt] <;> constructor <;> nlinarith

/-- Primer 2: r = 122 : 2 = 61; 61² = 3721; 3,14 · 3721 = 11 683,94 (cm²); 11 683,94 : 10 000 ≈ 1,17 (m²),
in 1 m² = 100² cm² = 10 000 cm². -/
theorem primer2 :
    (122:ℝ) / 2 = 61 ∧ (61:ℝ) ^ 2 = 3721 ∧ (3.14:ℝ) * 3721 = 11683.94 ∧ (100:ℝ) ^ 2 = 10000 ∧
    |(11683.94:ℝ) / 10000 - 1.17| < 0.005 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  rw [abs_lt]; constructor <;> norm_num

/-- Primer 2, korak 5, Pogoste napake: kdor vstavi premer d = 2r namesto polmera, dobi štirikrat preveč:
π(2r)² = 4 · πr²; pri tarči 3,14 · 122² = 4 · (3,14 · 61²). -/
theorem premer_namesto_polmera (r : ℝ) :
    π * (2 * r) ^ 2 = 4 * (π * r ^ 2) ∧ (3.14:ℝ) * 122 ^ 2 = 4 * (3.14 * 61 ^ 2) :=
  ⟨by ring, by norm_num⟩

/-- Primer 3, koraki 1–4: r₂ = 36,5 + 1,22 = 37,72; o₁ = 2 · 3,14 · 36,5 = 229,22;
o₂ = 2 · 3,14 · 37,72 = 236,8816; o₂ − o₁ = 7,6616 ≈ 7,66. -/
theorem primer3 :
    (36.5:ℝ) + 1.22 = 37.72 ∧ (2:ℝ) * 3.14 * 36.5 = 229.22 ∧ (2:ℝ) * 3.14 * 37.72 = 236.8816 ∧
    (236.8816:ℝ) - 229.22 = 7.6616 ∧ |(7.6616:ℝ) - 7.66| < 0.005 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  rw [abs_lt]; constructor <;> norm_num

/-- Primer 3, korak 5, Povzetek: o₂ − o₁ = 2πr₂ − 2πr₁ = 2π(r₂ − r₁); če polmer povečamo za a, se obseg
poveča za 2πa ne glede na velikost kroga; 2 · 3,14 · 1,22 = 7,6616. -/
theorem razlika_obsegov (r₁ r₂ r a : ℝ) :
    2 * π * r₂ - 2 * π * r₁ = 2 * π * (r₂ - r₁) ∧ 2 * π * (r + a) - 2 * π * r = 2 * π * a ∧
    (2:ℝ) * 3.14 * 1.22 = 7.6616 := ⟨by ring, by ring, by norm_num⟩

/-- Zakaj se tega učimo: dodatna pot sosednje proge (1,22 m dlje od središča) je pri vsakem polmeru r
enaka 2π · 1,22 ≈ 7,7 m (s pravim π, napaka manj kot 0,05). -/
theorem dodatna_pot (r : ℝ) :
    2 * π * (r + 1.22) - 2 * π * r = 2 * π * 1.22 ∧ |2 * π * 1.22 - 7.7| < 0.05 := by
  have h1 := pi_gt_d6
  have h2 := pi_lt_d6
  refine ⟨by ring, ?_⟩
  rw [abs_lt]; constructor <;> nlinarith

/-- Primer 4 s Premisli: r = 25,12/(2 · 3,14) = 25,12/6,28 = 4 (6,28 · 4 = 25,12);
p = 3,14 · 4² = 3,14 · 16 = 50,24. -/
theorem primer4 :
    (25.12:ℝ) / (2 * 3.14) = 25.12 / 6.28 ∧ (25.12:ℝ) / 6.28 = 4 ∧ (6.28:ℝ) * 4 = 25.12 ∧
    (3.14:ℝ) * 4 ^ 2 = 3.14 * 16 ∧ (3.14:ℝ) * 16 = 50.24 := by norm_num

/-- Primer 4, enoličnost: s π ≈ 3,14 je 4 edini polmer z obsegom 25,12 (2 · 3,14 · r = 25,12 ↔ r = 4). -/
theorem primer4_enolicno (r : ℝ) : 2 * 3.14 * r = 25.12 ↔ r = 4 := by
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake: πr² ni (πr)² (za r = 1 bi bilo π = π², ker π ≠ 1); r² = 2r velja le za r = 0 ali
r = 2; pri r = 3 je r² = 9, ne 6. -/
theorem napaka_kvadriranje :
    π * 1 ^ 2 ≠ (π * 1) ^ 2 ∧ (∀ r : ℝ, r ^ 2 = 2 * r ↔ r = 0 ∨ r = 2) ∧ (3:ℝ) ^ 2 = 9 ∧
    (2:ℝ) * 3 = 6 := by
  refine ⟨?_, fun r => ?_, by norm_num, by norm_num⟩
  · have := pi_gt_three
    intro h
    have h' : π * (π - 1) = 0 := by nlinarith
    rcases mul_eq_zero.mp h' with h0 | h0 <;> linarith
  · constructor
    · intro h
      have h' : r * (r - 2) = 0 := by linarith [h]
      rcases mul_eq_zero.mp h' with h0 | h0
      · exact Or.inl h0
      · exact Or.inr (by linarith)
    · rintro (rfl | rfl) <;> norm_num

/-- Pogoste napake, Povzetek, Preveri se 3: pri dvakrat večjem polmeru je obseg dvakrat, ploščina pa
štirikrat večja: 2π(2r) = 2 · (2πr), π(2r)² = 4 · πr². -/
theorem dvakrat_polmer (r : ℝ) : 2 * π * (2 * r) = 2 * (2 * π * r) ∧ π * (2 * r) ^ 2 = 4 * (π * r ^ 2) :=
  ⟨by ring, by ring⟩

/-- Pogoste napake: rezultat lahko pustimo s π, npr. krog s polmerom 4 (m) ima ploščino 16π (m²). -/
theorem ploscina_16pi : π * 4 ^ 2 = 16 * π := by ring

/-! ## Drugače -/

/-- Drugače: z analogijo: trikotnik z osnovnico 2πr in višino r ima ploščino 2πr · r / 2 = πr². -/
theorem trikotnik_trakov (r : ℝ) : (2 * π * r * r) / 2 = π * r ^ 2 := by ring

/-- Drugače: z analogijo, natančneje: trakovi (obroči s polmerom s in dolžino 2πs) od središča do roba
dajo skupaj ∫₀ʳ 2πs ds = πr². -/
theorem trakovi (r : ℝ) : ∫ s in (0:ℝ)..r, 2 * π * s = π * r ^ 2 := by
  rw [intervalIntegral.integral_const_mul, integral_id]
  ring

/-- Drugače: bolj natančno: pri k-kratni povečavi (k ≠ 0) se količnik ne spremeni, (k·o)/(k·d) = o/d, in
krog s polmerom kr ima k-krat večji obseg. -/
theorem povecava (k o d r : ℝ) (hk : k ≠ 0) :
    (k * o) / (k * d) = o / d ∧ 2 * π * (k * r) = k * (2 * π * r) :=
  ⟨mul_div_mul_left o d hk, by ring⟩

/-- Predpostavka `povecava` se da izpolniti (k = 2). -/
example : (2:ℝ) ≠ 0 := by norm_num

/-- Drugače: bolj natančno: Arhimedove meje 3 10/71 < π < 3 1/7, zato je 22/7 nekoliko prevelik
približek. -/
theorem arhimed : (3 + 10 / 71 : ℝ) < π ∧ π < 3 + 1 / 7 ∧ π < 22 / 7 := by
  have h1 := pi_gt_d6
  have h2 := pi_lt_d6
  refine ⟨by linarith [show (3 + 10 / 71 : ℝ) < 3.141592 by norm_num],
    by linarith [show (3.141593 : ℝ) < 3 + 1 / 7 by norm_num],
    by linarith [show (3.141593 : ℝ) < 22 / 7 by norm_num]⟩

/-! ## Preveri se -/

/-- Preveri se 2: polmeri A 3, B 5/2 = 2,5, C 12,56/(2 · 3,14) = 2; ploščine C 12,56, B 19,625, A 28,26,
zato vrstni red C, B, A. Napačna polmera: 12,56/3,14 = 4 in premer 5. -/
theorem preveri2 :
    (5:ℝ) / 2 = 2.5 ∧ (12.56:ℝ) / (2 * 3.14) = 2 ∧ (3.14:ℝ) * 2 ^ 2 = 12.56 ∧
    (3.14:ℝ) * 2.5 ^ 2 = 19.625 ∧ (3.14:ℝ) * 3 ^ 2 = 28.26 ∧ (12.56:ℝ) < 19.625 ∧
    (19.625:ℝ) < 28.26 ∧ (12.56:ℝ) / 3.14 = 4 := by norm_num

/-- Preveri se 4: en obrat 3,14 · 60 = 188,4 (cm), deset obratov 1884 cm = 18,84 m. Napačni odgovori:
2 · 3,14 · 60 · 10 = 3768 cm = 37,68 m; 188,4 cm = 1,884 m; 3,14 · 30² · 10 = 28 260, deljeno s 100 je
282,6. -/
theorem preveri4 :
    (3.14:ℝ) * 60 = 188.4 ∧ (188.4:ℝ) * 10 = 1884 ∧ (1884:ℝ) / 100 = 18.84 ∧
    (2:ℝ) * 3.14 * 60 * 10 / 100 = 37.68 ∧ (188.4:ℝ) / 100 = 1.884 ∧
    (3.14:ℝ) * 30 ^ 2 * 10 / 100 = 282.6 := by norm_num

/-- Preveri se 5: r = 10/2 = 5, p = 3,14 · 5² = 3,14 · 25 = 78,5. Napačni odgovori: 3,14 · 10² = 314
(štirikrat preveč), 3,14 · 10 = 31,4 (obseg), 2 · 3,14 · 10 = 62,8. -/
theorem preveri5 :
    (10:ℝ) / 2 = 5 ∧ (3.14:ℝ) * 5 ^ 2 = 3.14 * 25 ∧ (3.14:ℝ) * 25 = 78.5 ∧ (3.14:ℝ) * 10 ^ 2 = 314 ∧
    (314:ℝ) = 4 * 78.5 ∧ (3.14:ℝ) * 10 = 31.4 ∧ (2:ℝ) * 3.14 * 10 = 62.8 := by norm_num

end Evklid.Lekcije.MAT_OS_8.ObsegInPloscinaKroga
