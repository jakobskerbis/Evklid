/-
vir: content/lessons/MAT-OS-9/mesane-naloge-npz.md
sha256: 2da05b20d2f3932d3cd4397f73a4efb8b1e868cb1c0c98a482cdf61b178abddc
Model: decimalna števila so točna racionalna števila v ℝ; odstotek je decimalno število (20 % = 0,2).
Pitagorov izrek je dokazan z Mathlibovim izrekom za evklidske prostore (c² = a² + b² ⇔ pravi kot);
formule za telesa (V = O·v, V = πr²v, tretjina za piramido in stožec) so obrazci iz lekcij o telesih;
verjetnost je po definiciji »ugodni izidi / vsi izidi« (relativna frekvenca je ocena), dokazani so računi.
»Zaokroži navzgor« je ⌈·⌉ (`Int.ceil`) skupaj z dokazom, da je eno manj premalo. Zaokrožene vrednosti so
dokazane kot |točna − približek| < pol enote zadnjega mesta (π med 3,141592 in 3,141593); »približno« pri
večjih številih (≈ 250 L, ≈ 1000 L) kot zaokrožitev na desetice oziroma stotice.
Ni v Leanu: zemljevid sklopov (tabela znakov), navodila za branje naloge, skice in »Na sliki« (faze
gradbišča); simulacija razen računa 2³ = 8 in 2² = 4; »hipotenuza leži nasproti pravega kota« kot
poimenovanje; definicije povprečja, mediane in modusa (v lekciji ni podatkov za račun); smiselnost
(»steber ne more imeti več kot nekaj kubičnih metrov«) kot ocena; besedilo napačnih odgovorov v Preveri se
(dokazano je, da so napačne vrednosti take, kot pravi razlaga).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_9.MesaneNalogeNpz

open Real

/-! ## Zakaj se tega učimo, Blok 1: odstotki -/

/-- Zakaj se tega učimo, Blok 1: −20 % pomeni ·0,8 (1 − 0,2), +20 % pomeni ·1,2; 300·0,8 = 240,
240·1,2 = 288, skupaj 300·0,8·1,2 = 288 ≠ 300. -/
theorem telefon :
    (1:ℝ) - 0.2 = 0.8 ∧ (1:ℝ) + 0.2 = 1.2 ∧ (300:ℝ) * 0.8 = 240 ∧ (240:ℝ) * 1.2 = 288 ∧
    (300:ℝ) * 0.8 * 1.2 = 288 ∧ (288:ℝ) ≠ 300 := by norm_num

/-- Blok 1 (hitro vprašanje): 15 % od 60 € je 0,15·60 = 9 €. -/
theorem blok1 : (0.15 : ℝ) * 60 = 9 := by norm_num

/-- Blok 1 (premisli): najprej +20 % in nato −20 %: 300·1,2 = 360, 360·0,8 = 288; vrstni red faktorjev ne
vpliva na rezultat (x·a·b = x·b·a). -/
theorem premisli_vrstni_red (x a b : ℝ) :
    (300:ℝ) * 1.2 = 360 ∧ (360:ℝ) * 0.8 = 288 ∧ x * a * b = x * b * a := ⟨by norm_num, by norm_num, by ring⟩

/-- Bolj natančno: pocenitev in podražitev za isti delež p dasta faktor (1 − p)(1 + p) = 1 − p², v obeh
vrstnih redih; za p = 0,2: 1 − 0,04 = 0,96 in 300·0,96 = 288; za p ≠ 0 je končna cena (x > 0) vedno nižja. -/
theorem odstotki_se_ne_iznicijo (p x : ℝ) (hp : p ≠ 0) (hx : 0 < x) :
    (1 - p) * (1 + p) = 1 - p ^ 2 ∧ (1 + p) * (1 - p) = 1 - p ^ 2 ∧ x * ((1 - p) * (1 + p)) < x ∧
    (1:ℝ) - 0.2 ^ 2 = 1 - 0.04 ∧ (1:ℝ) - 0.04 = 0.96 ∧ (300:ℝ) * 0.96 = 288 := by
  have hp2 : 0 < p ^ 2 := by positivity
  refine ⟨by ring, by ring, by nlinarith, by norm_num, by norm_num, by norm_num⟩

/-- Predpostavke trditve `odstotki_se_ne_iznicijo` se dajo izpolniti (p = 0,2, x = 300). -/
example : (0.2 : ℝ) ≠ 0 ∧ (0:ℝ) < 300 := by norm_num

/-- Pogoste napake (prva), Preveri se (4): po 25 % popusta je cena 60 €: 0,75·x = 60 natanko pri x = 80
(ne 60 + 15 = 75 ali 60 + 25 = 85); preizkus 25 % od 80 je 20, 80 − 20 = 60. -/
theorem vrtalnik (x : ℝ) :
    (0.75 * x = 60 ↔ x = 80) ∧ (1:ℝ) - 0.25 = 0.75 ∧ (0.25 : ℝ) * 60 = 15 ∧ (60:ℝ) + 15 = 75 ∧
    (75:ℝ) ≠ 80 ∧ (60:ℝ) + 25 = 85 ∧ (0.25 : ℝ) * 80 = 20 ∧ (80:ℝ) - 20 = 60 := by
  refine ⟨⟨fun h => by linarith, by rintro rfl; norm_num⟩, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num⟩

/-! ## Blok 2: linearna funkcija in enačbe -/

/-- Blok 2: c = 15x + 20; za 3 dni 15·3 + 20 = 65 €. -/
theorem blok2 : (15:ℝ) * 3 + 20 = 65 := by norm_num

/-- Primer 4: 15x + 20 = 95 natanko pri x = 5 (15x = 75, x = 75 : 15 = 5); preizkus 15·5 + 20 = 95. -/
theorem primer4 (x : ℝ) :
    (15 * x + 20 = 95 ↔ 15 * x = 75) ∧ (15 * x = 75 ↔ x = 5) ∧ (75:ℝ) / 15 = 5 ∧ (15:ℝ) * 5 + 20 = 95 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, by rintro rfl; norm_num⟩,
    by norm_num, by norm_num⟩

/-- Preveri se (1): c(x) = 8x + 12 da 20, 28, 36 za 1, 2, 3 dni; napačni tabeli: brez dostave 8x (8, 16, 24)
in dostava vsak dan 20x (20, 40, 60). -/
theorem preveri1 :
    (8:ℝ) * 1 + 12 = 20 ∧ (8:ℝ) * 2 + 12 = 28 ∧ (8:ℝ) * 3 + 12 = 36 ∧
    (8:ℝ) * 1 = 8 ∧ (8:ℝ) * 2 = 16 ∧ (8:ℝ) * 3 = 24 ∧
    (20:ℝ) * 1 = 20 ∧ (20:ℝ) * 2 = 40 ∧ (20:ℝ) * 3 = 60 ∧ (8:ℝ) * 2 + 12 ≠ 40 := by norm_num

/-! ## Blok 3: Pitagorov izrek -/

/-- Blok 3, Povzetek: v trikotniku p₁p₂p₃ (evklidska ravnina) velja |p₁p₃|² = |p₁p₂|² + |p₃p₂|² natanko
tedaj, ko je kot pri p₂ pravi: zato zidarjev preizkus 60² + 80² = 100² zagotovi pravi vogal. -/
theorem pitagora (p₁ p₂ p₃ : EuclideanSpace ℝ (Fin 2)) :
    dist p₁ p₃ * dist p₁ p₃ = dist p₁ p₂ * dist p₁ p₂ + dist p₃ p₂ * dist p₃ p₂ ↔
      EuclideanGeometry.angle p₁ p₂ p₃ = π / 2 :=
  EuclideanGeometry.dist_sq_eq_dist_sq_add_dist_sq_iff_angle_eq_pi_div_two p₁ p₂ p₃

/-- Blok 3: 60² + 80² = 100²; hitro vprašanje √(36 + 64) = 10 (6² = 36, 8² = 64). -/
theorem blok3 : (60:ℝ) ^ 2 + 80 ^ 2 = 100 ^ 2 ∧ (6:ℝ) ^ 2 = 36 ∧ (8:ℝ) ^ 2 = 64 ∧ √((36:ℝ) + 64) = 10 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  rw [show (36:ℝ) + 64 = 10 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Blok 3, Primer 1 (korak 4), Pogoste napake (zadnja), Na sliki: hipotenuza je najdaljša stranica: iz
c² = a² + b² z b > 0 (in a, c ≥ 0) sledi a < c; seštevanje √(c² + a²) bi dalo več kot c (a > 0). -/
theorem kateta_krajsa (a b c : ℝ) (ha : 0 ≤ a) (hb : 0 < b) (hc : 0 ≤ c) (h : c ^ 2 = a ^ 2 + b ^ 2) :
    a < c ∧ (0 < a → c < √(c ^ 2 + a ^ 2)) := by
  refine ⟨by nlinarith, fun ha' => ?_⟩
  rw [show c = √(c ^ 2) from (Real.sqrt_sq hc).symm]
  rw [Real.sq_sqrt (by positivity)]
  exact Real.sqrt_lt_sqrt (by positivity) (by nlinarith)

/-- Predpostavke trditve `kateta_krajsa` se dajo izpolniti (lestev: a = 1,4, b = 4,8, c = 5). -/
example : (0:ℝ) ≤ 1.4 ∧ (0:ℝ) < 4.8 ∧ (0:ℝ) ≤ 5 ∧ (5:ℝ) ^ 2 = 1.4 ^ 2 + 4.8 ^ 2 := by norm_num

/-- Primer 1 (lestev): za višino b > 0 velja b² + 1,4² = 5² natanko pri b = 4,8; c² − a² = 25 − 1,96 =
23,04, √23,04 = 4,8 < 5; napačno √(25 + 1,96) > 5. -/
theorem primer1 (b : ℝ) (hb : 0 < b) :
    (b ^ 2 + 1.4 ^ 2 = 5 ^ 2 ↔ b = 4.8) ∧ (5:ℝ) ^ 2 - 1.4 ^ 2 = 25 - 1.96 ∧ (25:ℝ) - 1.96 = 23.04 ∧
    √(23.04 : ℝ) = 4.8 ∧ (4.8 : ℝ) < 5 ∧ (5:ℝ) < √(25 + 1.96) := by
  refine ⟨⟨fun h => by nlinarith [sq_nonneg (b - 4.8)], by rintro rfl; norm_num⟩, by norm_num, by norm_num,
    ?_, by norm_num, ?_⟩
  · rw [show (23.04 : ℝ) = 4.8 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [Real.lt_sqrt (by norm_num)]; norm_num

/-- Predpostavka trditve `primer1` se da izpolniti (b = 4,8). -/
example : (0:ℝ) < 4.8 := by norm_num

/-! ## Blok 4: telesa in enote -/

/-- Blok 4 (enote): dolžine med sosednjimi enotami ·10, ploščine ·100 = 10², prostornine ·1000 = 10³;
1 m² = 100·100 = 10 000 cm² (ne 100 cm², Pogoste napake), 1 m³ = 10³ dm³ = 1000 L (Preveri se 3:
10·10·10 = 1000); hitro vprašanje: 0,5³ = 0,125 m³ = 125 L. -/
theorem enote :
    (10:ℝ) ^ 2 = 100 ∧ (10:ℝ) ^ 3 = 1000 ∧ (100:ℝ) * 100 = 10000 ∧ (10000:ℝ) ≠ 100 ∧
    (10:ℝ) * 10 * 10 = 1000 ∧ (0.5 : ℝ) ^ 3 = 0.125 ∧ (0.125 : ℝ) * 1000 = 125 := by norm_num

/-- Bolj natančno: pri k-krat daljših dolžinah je ploščina k²-krat, prostornina k³-krat večja. -/
theorem k_krat (k a b c : ℝ) : (k * a) * (k * b) = k ^ 2 * (a * b) ∧
    (k * a) * (k * b) * (k * c) = k ^ 3 * (a * b * c) := ⟨by ring, by ring⟩

/-- Blok 4 (premisli), Bolj natančno: pri podvojenem polmeru se prostornina valja početveri:
π(2r)²v = 4·πr²v; simulacija: kocka z robom 6 = 2·3 ima 2³ = 8-krat večjo prostornino (6³ = 8·3³). -/
theorem podvojeni (r v : ℝ) :
    π * (2 * r) ^ 2 * v = 4 * (π * r ^ 2 * v) ∧ (2:ℝ) ^ 3 = 8 ∧ (6:ℝ) ^ 3 = 8 * 3 ^ 3 ∧ (2:ℝ) ^ 2 = 4 :=
  ⟨by ring, by norm_num, by norm_num, by norm_num⟩

/-- Pogoste napake (druga): premer 40 namesto polmera 20 da štirikrat preveč betona: π·40²·v = 4·π·20²·v. -/
theorem premer_namesto_polmera (v : ℝ) : π * 40 ^ 2 * v = 4 * (π * 20 ^ 2 * v) := by ring

/-! ## Primer 2: ploščice -/

/-- Primer 2: 3,2·2,5 = 8 m², 1,1·8 = 8,8 m², 8,8 : 1,5 ≈ 5,87; navzgor ⌈8,8 : 1,5⌉ = 6 (5 škatel je
premalo: 5·1,5 < 8,8); 6·24 = 144 €. -/
theorem primer2 :
    (3.2 : ℝ) * 2.5 = 8 ∧ (1.1 : ℝ) * 8 = 8.8 ∧ |(8.8 : ℝ) / 1.5 - 5.87| < 0.005 ∧
    ⌈(8.8 : ℝ) / 1.5⌉ = 6 ∧ (5:ℝ) * 1.5 < 8.8 ∧ (6:ℕ) * 24 = 144 := by
  refine ⟨by norm_num, by norm_num, by norm_num [abs_lt], ?_, by norm_num, by norm_num⟩
  rw [Int.ceil_eq_iff]; norm_num

/-! ## Blok 5: podatki in verjetnost -/

/-- Blok 5: 40 − 6 = 34 dobrih, P = 34/40 = 0,85; zvit: 1 − 0,85 = 0,15 = 6/40. -/
theorem blok5 :
    (40:ℝ) - 6 = 34 ∧ (34:ℝ) / 40 = 0.85 ∧ (1:ℝ) - 0.85 = 0.15 ∧ (6:ℝ) / 40 = 0.15 := by norm_num

/-- Preveri se (5): zvitih 2 + 0 + 3 + 1 + 4 = 10 od 5·50 = 250, 10/250 = 0,04; napačni: 10/50 = 0,2,
povprečje 10/5 = 2 (> 1, ni verjetnost), nasprotni dogodek 1 − 0,04 = 0,96. -/
theorem preveri5 :
    (2:ℝ) + 0 + 3 + 1 + 4 = 10 ∧ (5:ℝ) * 50 = 250 ∧ (10:ℝ) / 250 = 0.04 ∧ (10:ℝ) / 50 = 0.2 ∧
    (10:ℝ) / 5 = 2 ∧ (1:ℝ) < 2 ∧ (1:ℝ) - 0.04 = 0.96 := by norm_num

/-! ## Primer 3: betonski steber -/

/-- Primer 3: r = 40 : 2 = 20 cm = 0,2 m; V = π·0,2²·2,5 = π·0,1 ≈ 0,314 m³ (≈ 314 L); 0,314 : 0,012 ≈ 26,2;
navzgor ⌈π·0,1 : 0,012⌉ = 27 (26 vreč je premalo: 26·0,012 < π·0,1). -/
theorem primer3 :
    (40:ℝ) / 2 = 20 ∧ (20:ℝ) / 100 = 0.2 ∧ π * 0.2 ^ 2 * 2.5 = π * 0.1 ∧ |π * 0.1 - 0.314| < 0.0005 ∧
    (0.314 : ℝ) * 1000 = 314 ∧ |(0.314 : ℝ) / 0.012 - 26.2| < 0.05 ∧ ⌈π * 0.1 / 0.012⌉ = 27 ∧
    26 * 0.012 < π * 0.1 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  refine ⟨by norm_num, by norm_num, by ring, ?_, by norm_num, by norm_num [abs_lt], ?_, by linarith⟩
  · rw [abs_lt]; constructor <;> linarith
  · rw [Int.ceil_eq_iff]
    constructor
    · rw [lt_div_iff₀ (by norm_num)]; push_cast; linarith
    · rw [div_le_iff₀ (by norm_num)]; push_cast; linarith

/-- Bolj natančno: s π ≈ 3 bi dobili 0,1·3 = 0,3 m³ in 0,3 : 0,012 = 25 vreč, kar je premalo
(25·0,012 = 0,3 < π·0,1). -/
theorem zaokrozi_na_koncu :
    (0.1 : ℝ) * 3 = 0.3 ∧ (0.3 : ℝ) / 0.012 = 25 ∧ (25 : ℝ) * 0.012 < π * 0.1 := by
  have p1 := pi_gt_d6
  refine ⟨by norm_num, by norm_num, by linarith⟩

/-- Preveri se (2): sod d = 60 cm, v = 90 cm: r = 0,3 m, V = π·0,3²·0,9 ≈ 0,25 m³ ≈ 250 L; napačni: deljenje s
100 namesto 1000 (≈ 25 L), polmer 0,6 (4-krat več, ≈ 1000 L). -/
theorem preveri2 :
    (60:ℝ) / 2 / 100 = 0.3 ∧ |π * 0.3 ^ 2 * 0.9 - 0.25| < 0.005 ∧ |π * 0.3 ^ 2 * 0.9 * 1000 - 250| < 5 ∧
    |π * 0.3 ^ 2 * 0.9 * 100 - 25| < 0.5 ∧ π * 0.6 ^ 2 * 0.9 = 4 * (π * 0.3 ^ 2 * 0.9) ∧
    |π * 0.6 ^ 2 * 0.9 * 1000 - 1000| < 50 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  refine ⟨by norm_num, ?_, ?_, ?_, by ring, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

end Evklid.Lekcije.MAT_OS_9.MesaneNalogeNpz
