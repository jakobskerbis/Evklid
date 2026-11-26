/-
vir: content/lessons/MAT-OS-8/krozni-lok-in-krozni-izsek.md
sha256: 43662eda0f1cb67c60cc0f067b37d2d1e33905f4f576f275f992330c5f6ef9a5
Model: kot α je v stopinjah (realno število), obrazca sta funkciji na ℝ: `o r = 2πr`, `p r = πr²`,
`l α r = α/360 · 2πr`, `pi α r = α/360 · πr²`. Količine so brez enot (cm, km, m² so le v docstringih);
decimalna števila so točni ulomki v ℝ. Kjer lekcija računa s π ≈ 3,14, je račun dokazan s številom 3,14 (kot
ga zapiše lekcija), »≈ a« na k decimalk pa je |x − a| < ½·10⁻ᵏ (»približno 7100« na stotice |x − 7100| < 50,
»okroglo 800 000« |x − 800 000| < 50 000); meje za π sta `Real.pi_gt_d6` in `Real.pi_lt_d6`. Pri iskanju kota
je pogoj r > 0 (Lean deli z 0 kot x/0 = 0).
Ni v Leanu: da je dolžina krožnega loka oz. ploščina krožnega izseka (kot geometrijska množica v ravnini, z
mero) res α/360 · 2πr oz. α/360 · πr² — zahtevno, še ni dokazano; tu sta obrazca definiciji, dokazane so
njune lastnosti (delež, premo sorazmerje s kotom, sorazmerje l : 2πr = α : 360, p_i = l·r/2, skaliranje s
polmerom). Pojmi (lok, središčni kot, izsek, kos torte, polni in iztegnjeni kot) kot definicije; simulacija in
risbe; enote (»lok v cm, izsek v cm²«); podatki o ISS in Luni (polmer Zemlje, čas obhoda) kot podatki iz
zgodbe; »lok je črta, izsek ploskev« in analogija s ploščino trikotnika (dokazana je le enakost p_i = l·r/2);
»račun je krajši, manj možnosti za napako« (nasvet); Preveri se 3: razlogi v besedah (dokazano je
pi α (2r) = 4·pi α r pri istem kotu in da se pri istem kotu delež ne spremeni).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_8.KrozniLokInKrozniIzsek

open Real

/-- Obseg kroga o = 2πr. -/
noncomputable def o (r : ℝ) : ℝ := 2 * π * r

/-- Ploščina kroga p = πr². -/
noncomputable def p (r : ℝ) : ℝ := π * r ^ 2

/-- Razlaga (Pravilo): dolžina loka l = α/360° · 2πr. -/
noncomputable def l (α r : ℝ) : ℝ := α / 360 * (2 * π * r)

/-- Razlaga (Pravilo): ploščina izseka p_i = α/360° · πr². -/
noncomputable def pi (α r : ℝ) : ℝ := α / 360 * (π * r ^ 2)

/-- Pomožno: |k·π − c| < e iz mej 3,141592 < π < 3,141593 (k ≥ 0). -/
theorem blizu (k c e : ℝ) (hk : 0 ≤ k) (h1 : c - e < k * 3.141592) (h2 : k * 3.141593 < c + e) :
    |k * π - c| < e := by
  have l1 := Real.pi_gt_d6
  have u := Real.pi_lt_d6
  rw [abs_lt]
  constructor <;> nlinarith

/-- Predpostavke `blizu` se dajo izpolniti (2π ≈ 6,3). -/
example : (0 : ℝ) ≤ 2 ∧ (6.3 : ℝ) - 0.05 < 2 * 3.141592 ∧ (2 : ℝ) * 3.141593 < 6.3 + 0.05 := by norm_num

/-! ## Razlaga -/

/-- Razlaga, »Najprej nekaj primerov«: krog s polmerom 6 cm ima obseg 2π·6 = 12π cm in ploščino
π·6² = 36π cm². -/
theorem krog_6 : o 6 = 2 * π * 6 ∧ 2 * π * 6 = 12 * π ∧ p 6 = π * 6 ^ 2 ∧ π * 6 ^ 2 = 36 * π := by
  refine ⟨rfl, by ring, rfl, by ring⟩

/-- Razlaga, tabela: koti 180°, 90°, 60°, 30° so deleži 1/2, 1/4, 1/6, 1/12 polnega kota; pri r = 6 so
loki 6π, 3π, 2π, π cm in izseki 18π, 9π, 6π, 3π cm². -/
theorem tabela :
    ((180 : ℝ) / 360 = 1 / 2 ∧ l 180 6 = 6 * π ∧ pi 180 6 = 18 * π) ∧
    ((90 : ℝ) / 360 = 1 / 4 ∧ l 90 6 = 3 * π ∧ pi 90 6 = 9 * π) ∧
    ((60 : ℝ) / 360 = 1 / 6 ∧ l 60 6 = 2 * π ∧ pi 60 6 = 6 * π) ∧
    ((30 : ℝ) / 360 = 1 / 12 ∧ l 30 6 = π ∧ pi 30 6 = 3 * π) := by
  unfold l pi
  refine ⟨⟨?_, ?_, ?_⟩, ⟨?_, ?_, ?_⟩, ⟨?_, ?_, ?_⟩, ⟨?_, ?_, ?_⟩⟩ <;> ring

/-- Razlaga, tabela: »kolikšen del polnega kota zajame kos, tolikšen del obsega in ploščine dobi«:
l = (α/360)·o in p_i = (α/360)·p. -/
theorem delez (α r : ℝ) : l α r = α / 360 * o r ∧ pi α r = α / 360 * p r := ⟨rfl, rfl⟩

/-- Razlaga, prvi »Premisli«: kot 120° je tretjina od 360°; lok je 12π/3 = 4π cm, ploščina 36π/3 = 12π cm²,
natanko dvakrat toliko kot pri 60°. -/
theorem premisli_120 :
    (120 : ℝ) / 360 = 1 / 3 ∧ l 120 6 = 12 * π / 3 ∧ 12 * π / 3 = 4 * π ∧ pi 120 6 = 36 * π / 3 ∧
      36 * π / 3 = 12 * π ∧ l 120 6 = 2 * l 60 6 ∧ pi 120 6 = 2 * pi 60 6 := by
  unfold l pi
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_⟩ <;> ring

/-- Razlaga, »Polmer in kot« in drugi »Premisli«; Pogoste napake 4; Povzetek 5: pri istem kotu da dvakrat večji
polmer dvakrat daljši lok in štirikrat večji izsek (2·2 = 4). -/
theorem dvakrat_polmer (α r : ℝ) : l α (2 * r) = 2 * l α r ∧ pi α (2 * r) = 4 * pi α r := by
  unfold l pi
  constructor <;> ring

/-- Razlaga, drugi »Premisli«: pri 90° in r = 5 je izsek 25π/4 ≈ 19,6 cm², pri r = 10 pa 25π ≈ 78,5 cm². -/
theorem premisli_5_10 :
    pi 90 5 = 25 * π / 4 ∧ |25 / 4 * π - 19.6| < 0.05 ∧ pi 90 10 = 25 * π ∧ |25 * π - 78.5| < 0.05 := by
  refine ⟨by unfold pi; ring, blizu _ _ _ (by norm_num) (by norm_num) (by norm_num), by unfold pi; ring,
    blizu _ _ _ (by norm_num) (by norm_num) (by norm_num)⟩

/-- Razlaga (Postopek) in Povzetek 6: kot iz dolžine loka. Pri r > 0 ima enačba l = α/360 · 2πr natanko eno
rešitev α = 360·l/(2πr). -/
theorem kot_iz_loka (α r L : ℝ) (hr : 0 < r) : l α r = L ↔ α = 360 * L / (2 * π * r) := by
  unfold l
  have : 0 < 2 * π * r := by positivity
  constructor
  · intro h; rw [← h]; field_simp
  · intro h; rw [h]; field_simp

/-- Predpostavka `kot_iz_loka` se da izpolniti (r = 9 > 0). -/
example : (0 : ℝ) < 9 := by norm_num

/-- Povzetek 6: kot iz ploščine izseka. Pri r > 0 ima enačba p_i = α/360 · πr² natanko eno rešitev
α = 360·P/(πr²). -/
theorem kot_iz_izseka (α r P : ℝ) (hr : 0 < r) : pi α r = P ↔ α = 360 * P / (π * r ^ 2) := by
  unfold pi
  have : 0 < π * r ^ 2 := by positivity
  constructor
  · intro h; rw [← h]; field_simp
  · intro h; rw [h]; field_simp

/-- Predpostavka `kot_iz_izseka` se da izpolniti (r = 1 > 0). -/
example : (0 : ℝ) < 1 := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: r = 6 cm, α = 60°: delež 60/360 = 1/6, obseg 2π·6 = 12π, lok 1/6·12π = 2π cm. -/
theorem primer1 : l 60 6 = 2 * π := by
  calc l 60 6 = 60 / 360 * (2 * π * 6) := rfl
    _ = 1 / 6 * (2 * π * 6) := by norm_num
    _ = 1 / 6 * (12 * π) := by ring
    _ = 2 * π := by ring

/-- Primer 1, koraki 1, 4, 5: 60° gre v polni kot šestkrat; 2·3,14 = 6,28 ≈ 6,3; tudi točni 2π ≈ 6,3; lok je
krajši od obsega 12π ≈ 37,7. -/
theorem primer1_priblizki :
    6 * (60 : ℝ) = 360 ∧ (2 : ℝ) * 3.14 = 6.28 ∧ |(6.28 : ℝ) - 6.3| < 0.05 ∧ |2 * π - 6.3| < 0.05 ∧
      2 * π < 12 * π ∧ |12 * π - 37.7| < 0.05 := by
  refine ⟨by norm_num, by norm_num, by norm_num, blizu _ _ _ (by norm_num) (by norm_num) (by norm_num),
    by linarith [Real.pi_pos], blizu _ _ _ (by norm_num) (by norm_num) (by norm_num)⟩

/-- Primer 2: r = 1,2 m, α = 150°: delež 150/360 = 5/12 (delimo s 30), ploščina kroga π·1,2² = 1,44π,
izsek 5/12 · 1,44π = 0,6π m². -/
theorem primer2 : pi 150 1.2 = 0.6 * π := by
  calc pi 150 1.2 = 150 / 360 * (π * 1.2 ^ 2) := rfl
    _ = 5 / 12 * (π * 1.2 ^ 2) := by norm_num
    _ = 5 / 12 * (1.44 * π) := by ring
    _ = 0.6 * π := by ring

/-- Primer 2, koraki 1, 3, 4: 150 : 30 = 5, 360 : 30 = 12; 1,44 : 12 = 0,12; 5·0,12 = 0,6;
0,6·3,14 = 1,884 ≈ 1,88; tudi točni 0,6π ≈ 1,88 m². -/
theorem primer2_koraki :
    (150 : ℝ) / 30 = 5 ∧ (360 : ℝ) / 30 = 12 ∧ (1.44 : ℝ) / 12 = 0.12 ∧ (5 : ℝ) * 0.12 = 0.6 ∧
      (0.6 : ℝ) * 3.14 = 1.884 ∧ |(1.884 : ℝ) - 1.88| < 0.005 ∧ |0.6 * π - 1.88| < 0.005 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    blizu _ _ _ (by norm_num) (by norm_num) (by norm_num)⟩

/-- Primer 3: r = 6400 + 400 = 6800 km; 15/90 = 1/6 obhoda, kot 1/6·360° = 60°; obseg (π ≈ 3,14)
2·3,14·6800 = 42 704 km; lok 42 704 : 6 ≈ 7117 km, približno 7100 km; to je skoraj 8 km v sekundi
(15 min = 900 s, 7,9 < 42 704/6/900 < 8). -/
theorem primer3 :
    (6400 : ℝ) + 400 = 6800 ∧ (15 : ℝ) / 90 = 1 / 6 ∧ (1 / 6 : ℝ) * 360 = 60 ∧
      (2 : ℝ) * 3.14 * 6800 = 42704 ∧ |(42704 : ℝ) / 6 - 7117| < 0.5 ∧ |(42704 : ℝ) / 6 - 7100| < 50 ∧
      (7.9 : ℝ) < 42704 / 6 / (15 * 60) ∧ (42704 : ℝ) / 6 / (15 * 60) < 8 := by
  norm_num [abs_lt]

/-- Primer 3, s točnim π: lok l(60°, 6800) = 6800π/3 ≈ 7100 km (na stotice) je 1/6 obsega. -/
theorem primer3_tocno : l (15 / 90 * 360) (6400 + 400) = 1 / 6 * o 6800 ∧ 1 / 6 * o 6800 = 6800 / 3 * π ∧
    |6800 / 3 * π - 7100| < 50 := by
  refine ⟨by unfold l o; norm_num, by unfold o; ring, blizu _ _ _ (by norm_num) (by norm_num) (by norm_num)⟩

/-- Primer 4 (π ≈ 3,14): obseg 2·3,14·10 = 62,8; delež 15,7/62,8 = 1/4, ker 4·15,7 = 62,8; kot
α = 1/4·360° = 90° je edina rešitev α/360·62,8 = 15,7; ploščina kroga 3,14·10² = 314, izsek 314 : 4 = 78,5. -/
theorem primer4 :
    (2 : ℝ) * 3.14 * 10 = 62.8 ∧ (15.7 : ℝ) / 62.8 = 1 / 4 ∧ (4 : ℝ) * 15.7 = 62.8 ∧ (1 / 4 : ℝ) * 360 = 90 ∧
      (∀ α : ℝ, α / 360 * 62.8 = 15.7 ↔ α = 90) ∧ (3.14 : ℝ) * 10 ^ 2 = 314 ∧ (314 : ℝ) / 4 = 78.5 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, fun α => ?_, by norm_num, by norm_num⟩
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Primer 4 s točnim π: l = 15,7, r = 10 da α = 282,6/π ≈ 90° (na desetinke), izsek pa je točno 78,5 cm²
(p_i = l·r/2 ne vsebuje π). -/
theorem primer4_tocno (α : ℝ) (h : l α 10 = 15.7) : α = 282.6 / π ∧ |α - 90| < 0.05 ∧ pi α 10 = 78.5 := by
  have hα : α = 282.6 / π := by
    rw [kot_iz_loka α 10 15.7 (by norm_num)] at h; rw [h]; field_simp; norm_num
  have hp := Real.pi_pos
  have l1 := Real.pi_gt_d6
  have u := Real.pi_lt_d6
  refine ⟨hα, ?_, ?_⟩
  · rw [hα, abs_lt]
    constructor
    · rw [lt_sub_iff_add_lt, lt_div_iff₀ hp]; nlinarith
    · rw [sub_lt_iff_lt_add, div_lt_iff₀ hp]; nlinarith
  · unfold l at h; unfold pi
    have : α / 360 * (π * 10 ^ 2) = 10 / 2 * (α / 360 * (2 * π * 10)) := by ring
    rw [this, h]; norm_num

/-- Predpostavka `primer4_tocno` se da izpolniti: α = 282,6/π. -/
example : l (282.6 / π) 10 = 15.7 := by
  unfold l; field_simp; norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1: brez deljenja s 360° (l = 60·2πr) dobimo lok, daljši od cele krožnice (pri r > 0);
pravi lok pri 0 ≤ α ≤ 360 ni daljši od krožnice. -/
theorem napaka_brez_360 (r : ℝ) (hr : 0 < r) : 60 * (2 * π * r) > 2 * π * r ∧
    ∀ α, 0 ≤ α → α ≤ 360 → l α r ≤ o r := by
  have : 0 < 2 * π * r := by positivity
  refine ⟨by linarith, fun α h0 h1 => ?_⟩
  unfold l o
  have : α / 360 ≤ 1 := by rw [div_le_one (by norm_num)]; exact h1
  nlinarith

/-- Predpostavka `napaka_brez_360` se da izpolniti (r = 6). -/
example : (0 : ℝ) < 6 := by norm_num

/-- Pogoste napake 3: premer d namesto polmera r = d : 2 da dvakrat daljši lok in štirikrat večji izsek. -/
theorem napaka_premer (α d : ℝ) : l α d = 2 * l α (d / 2) ∧ pi α d = 4 * pi α (d / 2) := by
  unfold l pi; constructor <;> ring

/-- Pogoste napake 5: deljenje s 180° da dvakrat predolg lok; pri iskanju kota (r > 0) da polovico pravega
kota: če je α'/180·2πr = α/360·2πr, je α' = α/2. -/
theorem napaka_180 (α r : ℝ) (hr : 0 < r) : α / 180 * (2 * π * r) = 2 * l α r ∧
    ∀ α', α' / 180 * (2 * π * r) = l α r → α' = α / 2 := by
  have : 0 < 2 * π * r := by positivity
  refine ⟨by unfold l; ring, fun α' h => ?_⟩
  unfold l at h
  have h2 : (α' / 180 - α / 360) * (2 * π * r) = 0 := by linarith
  rcases mul_eq_zero.mp h2 with h3 | h3
  · linarith
  · linarith

/-- Predpostavka `napaka_180` se da izpolniti (r = 6). -/
example : (0 : ℝ) < 6 := by norm_num

/-! ## Drugače: Korak za korakom, Kot zgodba, Bolj natančno -/

/-- Korak za korakom: r = 12 cm, α = 150°: 150/360 = 5/12; obseg 2π·12 = 24π; lok 5/12·24π = 10π cm (24 : 12 = 2,
2·5 = 10); ploščina π·12² = 144π; izsek 5/12·144π = 60π cm²; π ≈ 3,14: l ≈ 31,4, p_i ≈ 188,4. -/
theorem korak_za_korakom :
    (150 : ℝ) / 360 = 5 / 12 ∧ o 12 = 24 * π ∧ l 150 12 = 5 / 12 * (24 * π) ∧ 5 / 12 * (24 * π) = 10 * π ∧
      (24 : ℝ) / 12 = 2 ∧ (2 : ℝ) * 5 = 10 ∧ p 12 = 144 * π ∧ pi 150 12 = 5 / 12 * (144 * π) ∧
      5 / 12 * (144 * π) = 60 * π ∧ (10 : ℝ) * 3.14 = 31.4 ∧ (60 : ℝ) * 3.14 = 188.4 := by
  unfold o l p pi
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_⟩ <;> ring

/-- Kot zgodba (Luna): 9/27 = 1/3 kroga, 1/3·360° = 120°; 1/3·2·3,14·384 000 = 803 840 km, okroglo 800 000 km;
izsek s kotom 120° je tretjina kroga (isti delež kot lok). -/
theorem zgodba :
    (9 : ℝ) / 27 = 1 / 3 ∧ (1 / 3 : ℝ) * 360 = 120 ∧ (1 / 3 : ℝ) * 2 * 3.14 * 384000 = 803840 ∧
      |(803840 : ℝ) - 800000| < 50000 ∧ ∀ r, pi 120 r = 1 / 3 * p r ∧ l 120 r = 1 / 3 * o r := by
  unfold pi p l o
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num [abs_lt], fun r => ⟨?_, ?_⟩⟩ <;> ring

/-- Bolj natančno: lok je premo sorazmeren s kotom (k-krat večji kot da k-krat daljši lok), za polni kot 360° je
lok cela krožnica 2πr; enako za izsek (polni kot da cel krog). -/
theorem premo_sorazmerno (k α r : ℝ) :
    l (k * α) r = k * l α r ∧ l 360 r = 2 * π * r ∧ pi (k * α) r = k * pi α r ∧ pi 360 r = π * r ^ 2 := by
  unfold l pi; refine ⟨?_, ?_, ?_, ?_⟩ <;> ring

/-- Bolj natančno: sorazmerji l : 2πr = α : 360° in p_i : πr² = α : 360° (pri r ≠ 0). -/
theorem sorazmerje (α r : ℝ) (hr : r ≠ 0) : l α r / (2 * π * r) = α / 360 ∧ pi α r / (π * r ^ 2) = α / 360 := by
  unfold l pi
  have : π ≠ 0 := Real.pi_ne_zero
  constructor <;> field_simp

/-- Predpostavka `sorazmerje` se da izpolniti (r = 6). -/
example : (6 : ℝ) ≠ 0 := by norm_num

/-- Bolj natančno: p_i = α/360·πr² = (α/360·2πr)·r/2 = l·r/2. -/
theorem izsek_iz_loka (α r : ℝ) : pi α r = l α r * r / 2 := by
  calc pi α r = α / 360 * (π * r ^ 2) := rfl
    _ = (α / 360 * (2 * π * r)) * (r / 2) := by ring
    _ = l α r * r / 2 := by unfold l; ring

/-! ## Preveri se -/

/-- Preveri se 1: pri 90° in r = 6 je delež 1/4, lok 1/4·12π = 3π cm, izsek 1/4·36π = 9π cm²
(ne obratno: 9π ≠ 3π). -/
theorem kviz1 : (90 : ℝ) / 360 = 1 / 4 ∧ l 90 6 = 1 / 4 * (12 * π) ∧ 1 / 4 * (12 * π) = 3 * π ∧
    pi 90 6 = 1 / 4 * (36 * π) ∧ 1 / 4 * (36 * π) = 9 * π ∧ 3 * π ≠ 9 * π := by
  have := Real.pi_pos
  unfold l pi
  refine ⟨by norm_num, by ring, by ring, by ring, by ring, by intro h; linarith⟩

/-- Preveri se 2: krog s ploščino 200 cm², kot 89°: izsek 89/360·200 ≈ 49,4 cm², malo manj od četrtine 50 cm². -/
theorem kviz2 : (89 : ℝ) / 360 * 200 < 200 / 4 ∧ (200 : ℝ) / 4 = 50 ∧ |(89 : ℝ) / 360 * 200 - 49.4| < 0.05 ∧
    |(89 : ℝ) / 360 * 200 - 50| < 1 := by
  norm_num [abs_lt]

/-- Preveri se 3: pri istem kotu je delež enak, ploščina pa 2r·2r = 4·r·r, torej štirikrat večja. -/
theorem kviz3 (α r : ℝ) : (2 * r) * (2 * r) = 4 * (r * r) ∧ pi α (2 * r) = 4 * pi α r :=
  ⟨by ring, (dvakrat_polmer α r).2⟩

/-- Preveri se 4: lok 6π v krogu s polmerom 9: obseg 2π·9 = 18π, delež 6π/18π = 1/3, kot 120° (edina rešitev). -/
theorem kviz4 (α : ℝ) : l α 9 = 6 * π ↔ α = 120 := by
  have hp := Real.pi_ne_zero
  rw [kot_iz_loka α 9 _ (by norm_num)]
  have : 360 * (6 * π) / (2 * π * 9) = 120 := by field_simp; norm_num
  rw [this]

/-- Preveri se 4, koraki odgovora: 2π·9 = 18π, 6π/18π = 1/3, 1/3·360° = 120°. -/
theorem kviz4_koraki : o 9 = 18 * π ∧ 6 * π / (18 * π) = 1 / 3 ∧ (1 / 3 : ℝ) * 360 = 120 := by
  have hp := Real.pi_ne_zero
  unfold o
  refine ⟨by ring, by field_simp; norm_num, by norm_num⟩

/-- Preveri se 5: v 20 minutah minutni kazalec opravi 20/60 = 1/3 kroga, 120°; pot konice
l = 1/3·2π·12 = 8π ≈ 25,1 cm (tudi s π ≈ 3,14: 8·3,14 = 25,12). Napačni odgovori: cel obseg 24·3,14 ≈ 75,4
in ploščina izseka 1/3·π·12² = 48π, 48·3,14 ≈ 150,7. -/
theorem kviz5 :
    (20 : ℝ) / 60 * 360 = 120 ∧ l 120 12 = 1 / 3 * (2 * π * 12) ∧ 1 / 3 * (2 * π * 12) = 8 * π ∧
      |8 * π - 25.1| < 0.05 ∧ (8 : ℝ) * 3.14 = 25.12 ∧ |(24 : ℝ) * 3.14 - 75.4| < 0.05 ∧
      pi 120 12 = 48 * π ∧ |(48 : ℝ) * 3.14 - 150.7| < 0.05 := by
  unfold l pi
  refine ⟨by norm_num, by norm_num, by ring, blizu _ _ _ (by norm_num) (by norm_num) (by norm_num), by norm_num,
    by norm_num [abs_lt], by ring, by norm_num [abs_lt]⟩

end Evklid.Lekcije.MAT_OS_8.KrozniLokInKrozniIzsek
