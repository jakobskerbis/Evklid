/-
vir: content/lessons/MAT-OS-9/krogla.md
sha256: b987f0f5b08533f5f21aa52fcd82218196fd6d59f6080cfcdc835300746317fd
Model: krogla je `Metric.closedBall S r` v `EuclideanSpace ℝ (Fin 3)`, kroglina ploskev `Metric.sphere S r`.
Prostornina krogle je dokazana z Mathlibovo Lebesgueovo mero (`EuclideanSpace.volume_closedBall_fin_three`).
Površina 4πr² je v računih vzeta kot obrazec iz lekcije; kot mera ploskve je dokazana le za enotsko sfero
(r = 1) z Mathlibovo mero `Measure.toSphere`, ki je definirana prav s »stožci« iz središča (Na sliki: krogla
iz piramid): ploskev ima mero 3 · (prostornina krogle) = 4π. Prostornina polkrogle (Bolj natančno) je
dokazana kot integral ploščin presekov π(r² − h²) od 0 do r. Prostornine valja (πr²·v) in stožca (πr²v/3)
ter površina valja so obrazci iz prejšnjih lekcij. Zaokrožene vrednosti so dokazane kot
|točna − približek| < pol enote zadnjega mesta (π med 3,141592 in 3,141593); decimalna števila so točna
racionalna števila v ℝ. Lean: √ negativnega je 0, zato imajo trditve s koreni pogoj r > 0 oziroma |h| ≤ r.
Ni v Leanu: risbe in simulaciji; »Zakaj se tega učimo« in »Iz vsakdanjega življenja« kot opisi (dokazana
so števila); krogla kot vrtenina polkroga (zahtevno, še ni dokazano); »kroglina ploskev se ne da razgrniti v
ravnino brez popačenja« (zahtevno, še ni dokazano); površina 4πr² za splošen r kot mera ploskve (zahtevno,
še ni dokazano; dokazana za r = 1, glej zgoraj) in zato tudi »kroglina ploskev je enako velika kot plašč
valja« kot geometrijska trditev (dokazano je 4πr² = 2πr·2r); »prerez z ravnino je vedno krog« za poševne
ravnine (dokazano za vodoravne ravnine z = h v koordinatah); Cavalierijevo načelo kot splošen izrek
(zahtevno, še ni dokazano; dokazana je enakost ploščin presekov na vsaki višini in vrednost integrala);
»lupina pomaranče pokrije štiri kroge« kot poskus; milni mehurček (izoperimetrična neenakost: zahtevno, še ni
dokazano); dejstvo o polmerih Zemlje in Lune (podatek, dokazan je račun 3,7³); enote (cm², cm³,
1 dm³ = 1 l je dokazano kot 10³ = 1000); navodila za računanje (koraki 1–5 v razlagi 6); besedilo napačnih
odgovorov v Preveri se (dokazano je, da so napačne vrednosti take, kot pravi razlaga); »krogla nima ne
osnovnih ploskev ne robov ne oglišč« (zahtevno, še ni dokazano); najmanjši valj okoli krogle (r, 2r) in
»krogla se dotika obeh osnovnih ploskev in plašča« kot geometrijska trditev (zahtevno, še ni dokazano;
dokazani so računi z r in 2r); zgodovinska opomba o Arhimedu (podatek).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_9.Krogla

open Real

/-! ## Razlaga 1: kaj je krogla -/

/-- Razlaga 1: krogla s središčem S in polmerom r so vse točke, ki so od S oddaljene največ r; kroglina
ploskev so točke na razdalji natanko r in je (za r > 0) meja krogle. -/
theorem krogla_in_ploskev (S : EuclideanSpace ℝ (Fin 3)) (r : ℝ) (hr : 0 < r) :
    (∀ p, p ∈ Metric.closedBall S r ↔ dist p S ≤ r) ∧ (∀ p, p ∈ Metric.sphere S r ↔ dist p S = r) ∧
    frontier (Metric.closedBall S r) = Metric.sphere S r :=
  ⟨fun _ => Metric.mem_closedBall, fun _ => Metric.mem_sphere, frontier_closedBall S hr.ne'⟩

/-- Predpostavka trditve `krogla_in_ploskev` se da izpolniti (r = 1). -/
example : (0:ℝ) < 1 := one_pos

/-- Razlaga 1, Povzetek: premer je d = 2r: nobeni dve točki krogle nista oddaljeni več kot 2r, dve
nasprotni točki pa sta oddaljeni natanko 2r. -/
theorem premer (S : EuclideanSpace ℝ (Fin 3)) (r : ℝ) (hr : 0 ≤ r) :
    Metric.diam (Metric.closedBall S r) ≤ 2 * r ∧
    ∃ p ∈ Metric.closedBall S r, ∃ q ∈ Metric.closedBall S r, dist p q = 2 * r := by
  refine ⟨Metric.diam_closedBall hr, ?_⟩
  set e : EuclideanSpace ℝ (Fin 3) := EuclideanSpace.single 0 1
  have he : ‖e‖ = 1 := by simp [e]
  refine ⟨S + r • e, ?_, S - r • e, ?_, ?_⟩
  · rw [Metric.mem_closedBall, dist_eq_norm]; simp [norm_smul, he, abs_of_nonneg hr]
  · rw [Metric.mem_closedBall, dist_eq_norm]; simp [norm_smul, he, abs_of_nonneg hr]
  · rw [dist_eq_norm, show S + r • e - (S - r • e) = (2 * r) • e by module, norm_smul, he]
    simp [abs_of_nonneg hr]

/-- Predpostavka trditve `premer` se da izpolniti (r = 1). -/
example : (0:ℝ) ≤ 1 := zero_le_one

/-! ## Razlaga 2: krogla ob valju (tabela) -/

/-- Razlaga 2 (tabela): valj s polmerom r in višino 2r ima osnovni ploskvi 2πr², plašč 2πr·2r = 4πr²,
površino 2πr² + 4πr² = 6πr² in prostornino πr²·2r = 2πr³; kroglina ploskev 4πr² je enaka plašču. -/
theorem tabela (r : ℝ) :
    2 * (π * r ^ 2) = 2 * π * r ^ 2 ∧ 2 * π * r * (2 * r) = 4 * π * r ^ 2 ∧
    2 * π * r ^ 2 + 2 * π * r * (2 * r) = 6 * π * r ^ 2 ∧ π * r ^ 2 * (2 * r) = 2 * π * r ^ 3 :=
  ⟨by ring, by ring, by ring, by ring⟩

/-- Razlaga 2 (premisli): površina krogle 4πr² je manjša od površine valja 6πr² (r > 0); krogla zapolni več
kot polovico valja (2/3 > 1/2); v osnem preseku krog pokrije π/4 ≈ 79 % kvadrata, kar je več od 2/3. -/
theorem premisli_valj (r : ℝ) (hr : 0 < r) :
    4 * π * r ^ 2 < 6 * π * r ^ 2 ∧ (1:ℝ) / 2 < 2 / 3 ∧
    (π * r ^ 2) / ((2 * r) ^ 2) = π / 4 ∧ |π / 4 - 0.79| < 0.005 ∧ (2:ℝ) / 3 < π / 4 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  have h : 0 < π * r ^ 2 := by positivity
  refine ⟨by nlinarith, by norm_num, by field_simp; ring, ?_, by linarith⟩
  rw [abs_lt]; constructor <;> linarith

/-- Predpostavka trditve `premisli_valj` se da izpolniti (r = 1). -/
example : (0:ℝ) < 1 := one_pos

/-! ## Razlaga 3 in 4: površina in prostornina -/

/-- Razlaga 3: površina 4πr² je štirikratnik ploščine največjega kroga πr² in je enaka plašču valja
2πr·2r. -/
theorem povrsina_stirje_krogi (r : ℝ) : 4 * π * r ^ 2 = 4 * (π * r ^ 2) ∧
    4 * π * r ^ 2 = 2 * π * r * (2 * r) := ⟨by ring, by ring⟩

/-- Razlaga 3, Na sliki (krogla iz piramid): mera enotske kroglinine ploskve (Mathlibova `toSphere`,
definirana s stožci iz središča) je 3 · (prostornina enotske krogle) = 4π = 4π·1². -/
theorem povrsina_enotske :
    (MeasureTheory.volume : MeasureTheory.Measure (EuclideanSpace ℝ (Fin 3))).toSphere.real Set.univ
      = 4 * π * 1 ^ 2 := by
  rw [MeasureTheory.Measure.toSphere_real_apply_univ, finrank_euclideanSpace_fin,
    MeasureTheory.measureReal_def, EuclideanSpace.volume_ball_fin_three, ENNReal.toReal_mul,
    ENNReal.toReal_pow, ENNReal.toReal_ofReal zero_le_one, ENNReal.toReal_ofReal (by positivity)]
  push_cast; ring

/-- Razlaga 4: prostornina krogle s polmerom r ≥ 0 je V = 4/3·π·r³ (Lebesgueova mera v ℝ³). -/
theorem prostornina_krogle (S : EuclideanSpace ℝ (Fin 3)) (r : ℝ) (hr : 0 ≤ r) :
    (MeasureTheory.volume (Metric.closedBall S r)).toReal = 4 / 3 * π * r ^ 3 := by
  rw [EuclideanSpace.volume_closedBall_fin_three, ENNReal.toReal_mul, ENNReal.toReal_pow,
    ENNReal.toReal_ofReal hr, ENNReal.toReal_ofReal (by positivity)]
  ring

/-- Predpostavka trditve `prostornina_krogle` se da izpolniti (r = 1). -/
example : (0:ℝ) ≤ 1 := zero_le_one

/-- Razlaga 4, Povzetek: krogla zapolni 2/3 valja s polmerom r in višino 2r; stožec iz istega valja ima
1/3·πr²·2r = 2/3·πr³; valj, krogla in stožec so v razmerju 3 : 2 : 1. -/
theorem valj_krogla_stozec (r : ℝ) (hr : 0 < r) :
    (4 / 3 * π * r ^ 3) / (π * r ^ 2 * (2 * r)) = 2 / 3 ∧
    1 / 3 * π * r ^ 2 * (2 * r) = 2 / 3 * π * r ^ 3 ∧
    2 * π * r ^ 3 = 3 * (2 / 3 * π * r ^ 3) ∧ 4 / 3 * π * r ^ 3 = 2 * (2 / 3 * π * r ^ 3) := by
  have := pi_pos
  refine ⟨by field_simp; ring, by ring, by ring, by ring⟩

/-- Predpostavka trditve `valj_krogla_stozec` se da izpolniti (r = 1). -/
example : (0:ℝ) < 1 := one_pos

/-- Razlaga 5 in »3D: prerez z ravnino«: vodoravna ravnina z = h (|h| ≤ r) seka kroglo s središčem v
izhodišču v krog s polmerom √(r² − h²); ta je največji (r² − h² = r²) natanko pri h = 0. -/
theorem prerez (r h : ℝ) (hh : |h| ≤ r) :
    (∀ x y : ℝ, x ^ 2 + y ^ 2 + h ^ 2 ≤ r ^ 2 ↔ x ^ 2 + y ^ 2 ≤ √(r ^ 2 - h ^ 2) ^ 2) ∧
    r ^ 2 - h ^ 2 ≤ r ^ 2 ∧ (r ^ 2 - h ^ 2 = r ^ 2 ↔ h = 0) := by
  have h0 : 0 ≤ r ^ 2 - h ^ 2 := by nlinarith [abs_le.1 hh, sq_abs h, abs_nonneg h]
  refine ⟨fun x y => by rw [Real.sq_sqrt h0]; constructor <;> intro <;> linarith,
    by nlinarith [sq_nonneg h], ⟨fun e => by nlinarith [sq_nonneg h], fun e => by subst e; ring⟩⟩

/-- Predpostavka trditve `prerez` se da izpolniti (r = 1, h = 0). -/
example : |(0:ℝ)| ≤ 1 := by norm_num

/-! ## Razlaga 5: kvadrat in kub -/

/-- Razlaga 5: (2r)² = 4r², (2r)³ = 8r³: pri dvakratnem polmeru je površina 4-krat, prostornina 8-krat
večja; 1 dm³ = 10³ cm³ = 1000 cm³ = 1 l. -/
theorem dvakratni_polmer (r : ℝ) :
    (2 * r) ^ 2 = 4 * r ^ 2 ∧ (2 * r) ^ 3 = 8 * r ^ 3 ∧
    4 * π * (2 * r) ^ 2 = 4 * (4 * π * r ^ 2) ∧ 4 / 3 * π * (2 * r) ^ 3 = 8 * (4 / 3 * π * r ^ 3) ∧
    (10:ℝ) ^ 3 = 1000 := ⟨by ring, by ring, by ring, by ring, by norm_num⟩

/-- Razlaga 5 (premisli o toči): zrno s premerom 4 cm ima polmer 4-krat večji od zrna s premerom 1 cm,
zato je ledu 4³ = 64-krat več, površina pa 4² = 16-krat večja. -/
theorem toca_64 :
    (4:ℝ) / 2 = 4 * (1 / 2) ∧ 4 / 3 * π * (4 / 2) ^ 3 = 64 * (4 / 3 * π * (1 / 2) ^ 3) ∧
    4 * π * (4 / 2) ^ 2 = 16 * (4 * π * (1 / 2) ^ 2) ∧ (4:ℝ) ^ 3 = 64 ∧ (4:ℝ) ^ 2 = 16 :=
  ⟨by norm_num, by ring, by ring, by norm_num, by norm_num⟩

/-- Razlaga 6, korak 4: π ≈ 3,14159. -/
theorem pi_priblizek : |π - 3.14159| < 0.000005 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  rw [abs_lt]; constructor <;> linarith

/-! ## Razlaga 7: obratna naloga -/

/-- Razlaga 7, Pogoste napake (zadnja): kubični koren iz 216 je 6 (6·6·6 = 216): r³ = 216 velja natanko za
r = 6. -/
theorem kubicni_koren (r : ℝ) : (6:ℝ) * 6 * 6 = 216 ∧ (r ^ 3 = 216 ↔ r = 6) :=
  ⟨by norm_num, ⟨fun h => by nlinarith [sq_nonneg (r - 6), sq_nonneg (r + 3)], by rintro rfl; norm_num⟩⟩

/-- Pogoste napake (zadnja): za polmer r > 0 velja r² = 25 natanko pri r = 5 (ne r = 25); √216 ≠ 6. -/
theorem kvadratni_koren (r : ℝ) (hr : 0 < r) : (r ^ 2 = 25 ↔ r = 5) ∧ √(216:ℝ) ≠ 6 := by
  refine ⟨⟨fun h => by nlinarith [sq_nonneg (r - 5)], by rintro rfl; norm_num⟩, ?_⟩
  intro h
  have := Real.sq_sqrt (show (0:ℝ) ≤ 216 by norm_num)
  rw [h] at this; norm_num at this

/-- Predpostavka trditve `kvadratni_koren` se da izpolniti (r = 5). -/
example : (0:ℝ) < 5 := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: r = 6 cm: P = 4π·6² = 4π·36 = 144π ≈ 452,39 cm²; V = 4/3·π·6³ = 4/3·π·216 = 288π ≈ 904,78 cm³,
pri čemer 6³ = 6·6·6 = 216 in 4/3·216 = 4·72 = 288. -/
theorem primer1 :
    4 * π * 6 ^ 2 = 144 * π ∧ |144 * π - 452.39| < 0.005 ∧
    4 / 3 * π * 6 ^ 3 = 288 * π ∧ |288 * π - 904.78| < 0.005 ∧
    (6:ℝ) ^ 3 = 6 * 6 * 6 ∧ (6:ℝ) * 6 * 6 = 216 ∧ (4:ℝ) / 3 * 216 = 4 * 72 ∧ (4:ℝ) * 72 = 288 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  refine ⟨?_, ?_, ?_, ?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  · calc 4 * π * 6 ^ 2 = 4 * π * 36 := by norm_num
      _ = 144 * π := by ring
  · rw [abs_lt]; constructor <;> linarith
  · calc 4 / 3 * π * 6 ^ 3 = 4 / 3 * π * 216 := by norm_num
      _ = 288 * π := by ring
  · rw [abs_lt]; constructor <;> linarith

/-- Primer 1, korak 6 (smiselnost): kocka z robom 12 = 2·6 ima prostornino 12³ = 1728 cm³; krogla ima manj,
približno 52 % kocke, kar je nekaj več kot polovica. -/
theorem primer1_smiselnost :
    (2:ℝ) * 6 = 12 ∧ (12:ℝ) ^ 3 = 1728 ∧ 288 * π < 1728 ∧ 1728 / 2 < 288 * π ∧
    |288 * π / 1728 - 0.52| < 0.005 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  refine ⟨by norm_num, by norm_num, by linarith, by linarith, ?_⟩
  rw [abs_lt]; constructor <;> linarith

/-- Primer 2: d = 22: r = 22 : 2 = 11; P = 4π·11² = 4π·121 = 484π ≈ 1520,53 cm² (≈ 1520,5);
11³ = 1331, V = 4/3·π·1331 = 5324/3·π ≈ 5575,28 cm³ ≈ 5,58 dm³ (≈ 5,6 l). -/
theorem primer2 :
    (22:ℝ) / 2 = 11 ∧
    4 * π * 11 ^ 2 = 484 * π ∧ |484 * π - 1520.53| < 0.005 ∧ |484 * π - 1520.5| < 0.05 ∧
    (11:ℝ) ^ 3 = 1331 ∧ 4 / 3 * π * 1331 = 5324 / 3 * π ∧ |5324 / 3 * π - 5575.28| < 0.005 ∧
    |(5575.28 : ℝ) / 1000 - 5.58| < 0.005 ∧ |5324 / 3 * π / 1000 - 5.6| < 0.05 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  refine ⟨by norm_num, ?_, ?_, ?_, by norm_num, by ring, ?_, by norm_num [abs_lt], ?_⟩
  · calc 4 * π * 11 ^ 2 = 4 * π * 121 := by norm_num
      _ = 484 * π := by ring
  all_goals rw [abs_lt]; constructor <;> linarith

/-- Pogoste napake (prva), Primer 2 korak 1: kdor vstavi premer 22 namesto polmera 11, dobi
(2·11)³ = 2³·11³ = 8-krat preveliko prostornino; v splošnem (d)³ = (2r)³ = 8r³. -/
theorem premer_namesto_polmera (r : ℝ) :
    4 / 3 * π * 22 ^ 3 = 8 * (4 / 3 * π * 11 ^ 3) ∧ 4 / 3 * π * (2 * r) ^ 3 = 2 ^ 3 * (4 / 3 * π * r ^ 3) ∧
    (2:ℝ) ^ 3 = 8 := ⟨by ring, by ring, by norm_num⟩

/-- Primer 3: za polmer r > 0 je 4πr² = 100π natanko tedaj, ko r² = 100π/(4π) = 25, torej r = √25 = 5;
nato V = 4/3·π·5³ = 4/3·π·125 = 500/3·π ≈ 523,60 cm³; preizkus 4π·5² = 4π·25 = 100π. -/
theorem primer3 (r : ℝ) (hr : 0 < r) :
    (4 * π * r ^ 2 = 100 * π ↔ r = 5) ∧ 100 * π / (4 * π) = 25 ∧ √(25:ℝ) = 5 ∧
    4 / 3 * π * 5 ^ 3 = 500 / 3 * π ∧ |500 / 3 * π - 523.60| < 0.005 ∧ 4 * π * 5 ^ 2 = 100 * π := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  have hp := pi_pos
  refine ⟨⟨fun h => ?_, by rintro rfl; ring⟩, by field_simp; ring, ?_, ?_, ?_, ?_⟩
  · have h2 : r ^ 2 = 25 :=
      by have := mul_right_cancel₀ hp.ne' (show (4 * r ^ 2) * π = 100 * π by linarith); linarith
    nlinarith [sq_nonneg (r - 5)]
  · rw [show (25:ℝ) = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · calc 4 / 3 * π * 5 ^ 3 = 4 / 3 * π * 125 := by norm_num
      _ = 500 / 3 * π := by ring
  · rw [abs_lt]; constructor <;> linarith
  · calc 4 * π * 5 ^ 2 = 4 * π * 25 := by norm_num
      _ = 100 * π := by ring

/-- Predpostavka trditve `primer3` se da izpolniti (r = 5). -/
example : (0:ℝ) < 5 := by norm_num

/-- Primer 4 (toča): d = 4: r = 4 : 2 = 2, 2³ = 8, V = 4/3·π·8 = 32/3·π ≈ 33,51 cm³; 1000 : 33,51 ≈ 29,8 in
tudi točno 1000 : V ≈ 29,8; 29 zrn je premalo, 30 zrn je dovolj za liter (»približno 30 zrn«). -/
theorem primer4 :
    (4:ℝ) / 2 = 2 ∧ (2:ℝ) ^ 3 = 8 ∧ 4 / 3 * π * 2 ^ 3 = 4 / 3 * π * 8 ∧ 4 / 3 * π * 8 = 32 / 3 * π ∧
    |32 / 3 * π - 33.51| < 0.005 ∧ |(1000 : ℝ) / 33.51 - 29.8| < 0.05 ∧
    |1000 / (32 / 3 * π) - 29.8| < 0.05 ∧ 29 * (32 / 3 * π) < 1000 ∧ 1000 < 30 * (32 / 3 * π) := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  have hp := pi_pos
  refine ⟨by norm_num, by norm_num, by norm_num, by ring, ?_, by norm_num [abs_lt], ?_, by linarith,
    by linarith⟩
  · rw [abs_lt]; constructor <;> linarith
  · have a1 : 1000 / (32 / 3 * (3.141593 : ℝ)) < 1000 / (32 / 3 * π) := by gcongr
    have a2 : 1000 / (32 / 3 * π) < 1000 / (32 / 3 * (3.141592 : ℝ)) := by gcongr
    norm_num at a1 a2
    rw [abs_lt]; constructor <;> linarith

/-! ## Pogoste napake -/

/-- Pogoste napake (tretja): brez deljenja s 3 je 4πr³ trikrat prevelika prostornina in večja celo od valja
2πr³ okoli krogle (r > 0); prava prostornina 4/3·πr³ je manjša od valja. -/
theorem pozabljeno_deljenje (r : ℝ) (hr : 0 < r) :
    4 * π * r ^ 3 = 3 * (4 / 3 * π * r ^ 3) ∧ 2 * π * r ^ 3 < 4 * π * r ^ 3 ∧
    4 / 3 * π * r ^ 3 < 2 * π * r ^ 3 := by
  have h : 0 < π * r ^ 3 := by positivity
  exact ⟨by ring, by nlinarith, by nlinarith⟩

/-- Predpostavka trditve `pozabljeno_deljenje` se da izpolniti (r = 1). -/
example : (0:ℝ) < 1 := one_pos

/-- Razlaga, Pogoste napake (četrta), Povzetek, Korak za korakom: polmer k-krat večji ⇒ površina k²-krat,
prostornina k³-krat večja. -/
theorem k_krat (k r : ℝ) :
    4 * π * (k * r) ^ 2 = k ^ 2 * (4 * π * r ^ 2) ∧
    4 / 3 * π * (k * r) ^ 3 = k ^ 3 * (4 / 3 * π * r ^ 3) := ⟨by ring, by ring⟩

/-! ## Na sliki in Iz vsakdanjega življenja -/

/-- Na sliki (krogla iz piramid): 1/3 · 4πr² · r = 4/3·πr³. -/
theorem piramide (r : ℝ) : 1 / 3 * (4 * π * r ^ 2) * r = 4 / 3 * π * r ^ 3 := by ring

/-- Iz vsakdanjega življenja (konzerva): r = 3: valj π·3²·6 = 54π, krogla 4/3·π·27 = 36π, 36π/54π = 2/3. -/
theorem konzerva :
    π * 3 ^ 2 * 6 = 54 * π ∧ 4 / 3 * π * 27 = 36 * π ∧ (4:ℝ) / 3 * π * 3 ^ 3 = 4 / 3 * π * 27 ∧
    (36 * π) / (54 * π) = 2 / 3 := by
  have := pi_pos
  refine ⟨by ring, by ring, by norm_num, by field_simp; ring⟩

/-- Iz vsakdanjega življenja (dežne kapljice): kapljica s 100-krat manjšim premerom ima
100³ = 1 000 000-krat manjšo prostornino: V(d) = 100³ · V(d/100). -/
theorem kapljice (d : ℝ) :
    (100:ℝ) ^ 3 = 1000000 ∧ 4 / 3 * π * (d / 2) ^ 3 = 100 ^ 3 * (4 / 3 * π * (d / 100 / 2) ^ 3) :=
  ⟨by norm_num, by ring⟩

/-! ## Korak za korakom s številkami (tabela) -/

/-- Korak za korakom: r = 1: 4π ≈ 12,57, 4/3·π ≈ 4,19; r = 2: 16π ≈ 50,27, 32/3·π ≈ 33,51; r = 4:
64π ≈ 201,06, 256/3·π ≈ 268,08; pri 1 → 2 se površina poveča 4-krat, prostornina 8-krat. -/
theorem tabela_stevilke :
    4 * π * 1 ^ 2 = 4 * π ∧ 4 / 3 * π * 1 ^ 3 = 4 / 3 * π ∧
    4 * π * 2 ^ 2 = 16 * π ∧ 4 / 3 * π * 2 ^ 3 = 32 / 3 * π ∧
    4 * π * 4 ^ 2 = 64 * π ∧ 4 / 3 * π * 4 ^ 3 = 256 / 3 * π ∧
    |4 * π - 12.57| < 0.005 ∧ |4 / 3 * π - 4.19| < 0.005 ∧ |16 * π - 50.27| < 0.005 ∧
    |32 / 3 * π - 33.51| < 0.005 ∧ |64 * π - 201.06| < 0.005 ∧ |256 / 3 * π - 268.08| < 0.005 ∧
    16 * π = 4 * (4 * π) ∧ 32 / 3 * π = 8 * (4 / 3 * π) := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  refine ⟨by ring, by ring, by ring, by ring, by ring, by ring, ?_, ?_, ?_, ?_, ?_, ?_, by ring, by ring⟩
  all_goals rw [abs_lt]; constructor <;> linarith

/-! ## Bolj natančno: polkrogla -/

/-- Bolj natančno: presek polkrogle na višini h (|h| ≤ r) je krog s polmerom √(r² − h²) in ploščino
π(r² − h²) = πr² − πh² (enako kot kolobar valja brez stožca); integral presekov od 0 do r je
πr²·r − 1/3·πr²·r = πr³ − 1/3·πr³ = 2/3·πr³; cela krogla je 2 · 2/3·πr³ = 4/3·πr³. -/
theorem polkrogla (r : ℝ) (hr : 0 ≤ r) :
    (∀ h, |h| ≤ r → π * √(r ^ 2 - h ^ 2) ^ 2 = π * (r ^ 2 - h ^ 2)) ∧
    (∀ h : ℝ, π * r ^ 2 - π * h ^ 2 = π * (r ^ 2 - h ^ 2)) ∧
    ∫ h in (0:ℝ)..r, π * (r ^ 2 - h ^ 2) = π * r ^ 2 * r - 1 / 3 * π * r ^ 2 * r ∧
    π * r ^ 2 * r - 1 / 3 * π * r ^ 2 * r = π * r ^ 3 - 1 / 3 * π * r ^ 3 ∧
    π * r ^ 3 - 1 / 3 * π * r ^ 3 = 2 / 3 * π * r ^ 3 ∧ 2 * (2 / 3 * π * r ^ 3) = 4 / 3 * π * r ^ 3 := by
  refine ⟨fun h hh => ?_, fun h => by ring, ?_, by ring, by ring, by ring⟩
  · rw [Real.sq_sqrt]; nlinarith [abs_le.1 hh, sq_abs h, abs_nonneg h]
  · have hF : ∀ x ∈ Set.uIcc (0:ℝ) r, HasDerivAt (fun h : ℝ => π * (r ^ 2 * h - h ^ 3 / 3))
        (π * (r ^ 2 - x ^ 2)) x := by
      intro x _
      have := (((hasDerivAt_id x).const_mul (r ^ 2)).sub ((hasDerivAt_pow 3 x).div_const 3)).const_mul π
      convert this using 1; simp; ring
    have hc : Continuous (fun h : ℝ => π * (r ^ 2 - h ^ 2)) := by fun_prop
    rw [intervalIntegral.integral_eq_sub_of_hasDerivAt hF (hc.intervalIntegrable 0 r)]
    ring

/-- Predpostavka trditve `polkrogla` se da izpolniti (r = 1, h = 0). -/
example : (0:ℝ) ≤ 1 ∧ |(0:ℝ)| ≤ 1 := by norm_num

/-! ## Preveri se -/

/-- Preveri se (1): r = 3: P = 4π·3² = 36π, V = 4/3·π·3³ = 4/3·π·27 = 36π; napačni: 4π·27 = 108π (brez
deljenja s 3), 4π·3 = 12π (brez kvadrata), r = 6: 144π in 288π. -/
theorem preveri1 :
    4 * π * 3 ^ 2 = 36 * π ∧ 4 / 3 * π * 3 ^ 3 = 4 / 3 * π * 27 ∧ 4 / 3 * π * 27 = 36 * π ∧
    4 * π * 27 = 108 * π ∧ 4 * π * 3 = 12 * π ∧ 4 * π * 6 ^ 2 = 144 * π ∧ 4 / 3 * π * 6 ^ 3 = 288 * π := by
  refine ⟨by ring, by norm_num, by ring, by ring, by ring, by ring, by ring⟩

/-- Preveri se (2): d = 2, r = 1: s π ≈ 3 je 4/3·3·1³ = 4, točno 4/3·π ≈ 4,19; napačni: r = 2 da
4/3·π·8 ≈ 34 (8-krat več), 4πr² ≈ 12,6 ≈ 13 je površina, kocka 2·2·2 = 8, krogla zapolni nekaj več kot
polovico kocke. -/
theorem preveri2 :
    (2:ℝ) / 2 = 1 ∧ (4:ℝ) / 3 * 3 * 1 ^ 3 = 4 ∧ |4 / 3 * π * 1 ^ 3 - 4.19| < 0.005 ∧
    |4 / 3 * π * 2 ^ 3 - 34| < 0.5 ∧ 4 / 3 * π * 2 ^ 3 = 8 * (4 / 3 * π * 1 ^ 3) ∧
    |4 * π * 1 ^ 2 - 12.6| < 0.05 ∧ |4 * π * 1 ^ 2 - 13| < 0.5 ∧ (2:ℝ) * 2 * 2 = 8 ∧
    8 / 2 < 4 / 3 * π * 1 ^ 3 ∧ 4 / 3 * π * 1 ^ 3 < 8 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  refine ⟨by norm_num, by norm_num, ?_, ?_, by ring, ?_, ?_, by norm_num, by linarith, by linarith⟩
  all_goals rw [abs_lt]; constructor <;> linarith

/-- Preveri se (3): pri dvakratnem polmeru (r > 0) je razmerje prostornin 2³ = 8, površin 2² = 4 (faktor 4/3
in π se pokrajšata); pri trikratnem 3² = 9 in 3³ = 27 ≠ 2·9 = 18. -/
theorem preveri3 (r : ℝ) (hr : 0 < r) :
    (4 / 3 * π * (2 * r) ^ 3) / (4 / 3 * π * r ^ 3) = 2 ^ 3 ∧
    (4 * π * (2 * r) ^ 2) / (4 * π * r ^ 2) = 2 ^ 2 ∧ (2:ℝ) ^ 3 = 8 ∧ (2:ℝ) ^ 2 = 4 ∧
    (3:ℝ) ^ 2 = 9 ∧ (3:ℝ) ^ 3 = 27 ∧ (2:ℝ) * 9 ≠ 27 := by
  have := pi_pos
  refine ⟨by field_simp, by field_simp, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩

/-- Predpostavka trditve `preveri3` se da izpolniti (r = 1). -/
example : (0:ℝ) < 1 := one_pos

/-- Preveri se (4): 4/3·π·r³ = 288π natanko tedaj, ko r³ = 288·3/4 = 216, torej natanko pri r = 6;
preizkus 4/3·π·216 = 288π; napačni: √216 ≈ 14,7, 288·4/3 = 384 in ∛384 ≈ 7,3. -/
theorem preveri4 (r : ℝ) :
    (4 / 3 * π * r ^ 3 = 288 * π ↔ r = 6) ∧ (288:ℝ) * (3 / 4) = 216 ∧ 4 / 3 * π * 216 = 288 * π ∧
    |√(216 : ℝ) - 14.7| < 0.05 ∧ (288:ℝ) * (4 / 3) = 384 ∧ |(384 : ℝ) ^ ((1 : ℝ) / 3) - 7.3| < 0.05 := by
  have hp := pi_pos
  refine ⟨⟨fun h => ?_, by rintro rfl; ring⟩, by norm_num, by ring, ?_, by norm_num, ?_⟩
  · have h3 : r ^ 3 = 216 := by nlinarith
    nlinarith [sq_nonneg (r - 6), sq_nonneg (r + 3)]
  · have h1 : (14.65 : ℝ) < √216 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
    have h2 : √216 < (14.75 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
    rw [abs_lt]; constructor <;> linarith
  · set c := (384 : ℝ) ^ ((1 : ℝ) / 3) with hcdef
    have hc : c ^ 3 = 384 := by
      rw [hcdef, ← Real.rpow_natCast, ← Real.rpow_mul (by norm_num)]; norm_num
    have hc0 : 0 < c := by positivity
    rw [abs_lt]; constructor
    · by_contra h; push Not at h
      have := pow_le_pow_left₀ hc0.le (show c ≤ 7.25 by linarith) 3
      norm_num at this; linarith
    · by_contra h; push Not at h
      have := pow_le_pow_left₀ (by norm_num) (show (7.35 : ℝ) ≤ c by linarith) 3
      norm_num at this; linarith

/-- Preveri se (5): pri polmeru Zemlje R = 3,7·ρ (ρ polmer Lune) je razmerje prostornin 3,7³ ≈ 50,7
(≈ 50 Lun); napačni: 3,7² ≈ 13,7 (≈ 14, razmerje površin), 3·3,7 = 11,1 (≈ 11). -/
theorem preveri5 (ρ : ℝ) (hρ : 0 < ρ) :
    (4 / 3 * π * (3.7 * ρ) ^ 3) / (4 / 3 * π * ρ ^ 3) = 3.7 ^ 3 ∧ |(3.7 : ℝ) ^ 3 - 50.7| < 0.05 ∧
    |(3.7 : ℝ) ^ 3 - 50| < 1 ∧ |(3.7 : ℝ) ^ 2 - 13.7| < 0.05 ∧ |(3.7 : ℝ) ^ 2 - 14| < 0.5 ∧
    (3:ℝ) * 3.7 = 11.1 := by
  have := pi_pos
  refine ⟨by field_simp, ?_, ?_, ?_, ?_, by norm_num⟩ <;> norm_num [abs_lt]

/-- Predpostavka trditve `preveri5` se da izpolniti (ρ = 1). -/
example : (0:ℝ) < 1 := one_pos

end Evklid.Lekcije.MAT_OS_9.Krogla
