/-
vir: content/lessons/MAT-OS-9/besedilne-naloge.md
sha256: af5175fc30b87a50998f0d7ebaea9785bc6d1f45ad91533105750c4da8b4ac82
Model: količine so realna števila brez enot (ml, h, km, km/h, kg, l so le v docstringih); decimalna števila so
točni ulomki v ℝ (0,7 = 7/10). Reševanje enačbe je veriga `calc` ekvivalenc (↔) z vmesnimi enačbami iz lekcije,
zato je dokazana celotna množica rešitev; preizkus je posebna veriga enakosti.
Ni v Leanu: zgodbe in njihov prevod v enačbo (izbira neznanke, »kaj pomeni 40x«, kviz 1) ter postopek v 7 korakih,
vrstni red korakov (kviz 2), tri vzorci za 4. korak in tabela prevajanja besed v znake (dogovor zapisa, ne
trditev); simulacija »Gibanje: srečanje in dohitevanje« in graf; »Pogoste napake« o opisu neznanke z enoto,
preizkusu v besedilu in odgovoru s stavkom (navodila; dokazano je le, da napačni enačbi iz Pogostih napak dasta
drugo rešitev); analogija z zdravnikom; »rešitev mora biti smiselna / naravno število« in primer x = 4,5 dneva
(razlaga pomena, ne matematična trditev); ure 14.00 in 14.30 kot ure na uri (dokazano je le 0,5 h = 30 min).
Lean: x/0 = 0; formuli za čas srečanja in dohitevanja imata zato pogoj, da imenovalec ni 0.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_9.BesedilneNaloge

/-! ## Razlaga -/

/-- Razlaga (infuzija): enačba 500 − 40x = 180 ima natanko rešitev x = 8, po korakih lekcije:
−40x = 180 − 500, −40x = −320, x = 8. -/
theorem infuzija (x : ℝ) : 500 - 40 * x = 180 ↔ x = 8 := by
  calc 500 - 40 * x = 180 ↔ -40 * x = 180 - 500 := by constructor <;> intro h <;> linarith
    _ ↔ -40 * x = -320 := by norm_num
    _ ↔ x = 8 := by constructor <;> intro h <;> linarith

/-- Razlaga (infuzija), preizkus: v 8 urah izteče 40 · 8 = 320 ml, ostane 500 − 320 = 180 ml. -/
theorem infuzija_preizkus : (500 : ℝ) - 40 * 8 = 180 := by
  calc (500 : ℝ) - 40 * 8 = 500 - 320 := by norm_num
    _ = 180 := by norm_num

/-- Razlaga, Premisli 1 (babičine tablete): 20 − 2x = 6 ima natanko rešitev x = 7 (−2x = −14). -/
theorem tablete (x : ℝ) : 20 - 2 * x = 6 ↔ x = 7 := by
  calc 20 - 2 * x = 6 ↔ -2 * x = -14 := by constructor <;> intro h <;> linarith
    _ ↔ x = 7 := by constructor <;> intro h <;> linarith

/-- Razlaga, Premisli 1, preizkus: po 7 dneh ostane 20 − 14 = 6 tablet. -/
theorem tablete_preizkus : (20 : ℝ) - 2 * 7 = 20 - 14 ∧ (20 : ℝ) - 14 = 6 := by norm_num

/-- Razlaga, Premisli 2 in Bolj natančno: pri dohitevanju z enakima hitrostma (d > 0) enačba v·t = d + v·t
nima rešitve (odštejemo v·t in ostane 0 = d). -/
theorem dohitevanje_enaki_hitrosti (v d : ℝ) (hd : 0 < d) : ¬ ∃ t : ℝ, v * t = d + v * t := by
  rintro ⟨t, ht⟩
  have h0 : (0 : ℝ) = d := by linarith
  linarith

/-- Predpostavka `dohitevanje_enaki_hitrosti` (d > 0) se da izpolniti. -/
example : (0 : ℝ) < 1 := by norm_num

/-- Bolj natančno: pri srečanju iz v₁t + v₂t = d izpostavimo t in dobimo t = d/(v₁ + v₂) (pogoj v₁ + v₂ ≠ 0;
v lekciji sta hitrosti pozitivni). Enačba ima natanko to rešitev. -/
theorem cas_srecanja (v₁ v₂ d t : ℝ) (hv : v₁ + v₂ ≠ 0) : v₁ * t + v₂ * t = d ↔ t = d / (v₁ + v₂) := by
  rw [eq_div_iff hv]
  constructor <;> intro h <;> linarith

/-- Predpostavka `cas_srecanja` se da izpolniti (v₁ = 60, v₂ = 90). -/
example : (60 : ℝ) + 90 ≠ 0 := by norm_num

/-- Bolj natančno: pri dohitevanju iz v₁t = d + v₂t dobimo t = d/(v₁ − v₂) (pogoj v₁ ≠ v₂, sicer bi delili
z nič). Enačba ima natanko to rešitev. -/
theorem cas_dohitevanja (v₁ v₂ d t : ℝ) (hv : v₁ ≠ v₂) : v₁ * t = d + v₂ * t ↔ t = d / (v₁ - v₂) := by
  have h : v₁ - v₂ ≠ 0 := sub_ne_zero.mpr hv
  rw [eq_div_iff h]
  constructor <;> intro h <;> linarith

/-- Predpostavka `cas_dohitevanja` se da izpolniti (v₁ = 60, v₂ = 40). -/
example : (60 : ℝ) ≠ 40 := by norm_num

/-- Bolj natančno: »za dohitevanje je potrebno v₁ > v₂«: če je prednost d > 0 in hitrejši dohiti počasnejšega
v času t > 0 (v₁t = d + v₂t), je v₁ > v₂. -/
theorem dohitevanje_potrebno (v₁ v₂ d t : ℝ) (hd : 0 < d) (ht : 0 < t) (h : v₁ * t = d + v₂ * t) :
    v₂ < v₁ := by
  by_contra hc
  rw [not_lt] at hc
  have : v₁ * t ≤ v₂ * t := mul_le_mul_of_nonneg_right hc ht.le
  linarith

/-- Predpostavke `dohitevanje_potrebno` se dajo izpolniti (kviz 5: v₁ = 60, v₂ = 40, d = 20, t = 1). -/
example : (0 : ℝ) < 20 ∧ (0 : ℝ) < 1 ∧ (60 : ℝ) * 1 = 20 + 40 * 1 := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 1 (dojenček): 3,4 + 0,7x = 7,6 ima natanko rešitev x = 6: 0,7x = 4,2 (7,6 − 3,4 = 4,2), x = 6
(4,2 : 0,7 = 6). -/
theorem primer1 (x : ℝ) : 34 / 10 + 7 / 10 * x = 76 / 10 ↔ x = 6 := by
  calc 34 / 10 + 7 / 10 * x = 76 / 10 ↔ 7 / 10 * x = 42 / 10 := by constructor <;> intro h <;> linarith
    _ ↔ x = 6 := by constructor <;> intro h <;> linarith

/-- Primer 1, korak 4 in 5: 7,6 − 3,4 = 4,2 in 4,2 : 0,7 = 6. -/
theorem primer1_racuna : (76 : ℝ) / 10 - 34 / 10 = 42 / 10 ∧ (42 : ℝ) / 10 / (7 / 10) = 6 := by norm_num

/-- Primer 1, preizkus: 3,4 + 0,7 · 6 = 7,6. -/
theorem primer1_preizkus : (34 : ℝ) / 10 + 7 / 10 * 6 = 76 / 10 := by norm_num

/-- Primer 2 (tekočina): x/3 + x/4 + 1 = x ima natanko rešitev x = 2,4, po korakih: množenje z 12 da
4x + 3x + 12 = 12x, nato 7x + 12 = 12x, 12 = 5x in x = 2,4 (12 : 5 = 2,4). -/
theorem primer2 (x : ℝ) : x / 3 + x / 4 + 1 = x ↔ x = 24 / 10 := by
  calc x / 3 + x / 4 + 1 = x ↔ 4 * x + 3 * x + 12 = 12 * x := by constructor <;> intro h <;> linarith
    _ ↔ 7 * x + 12 = 12 * x := by constructor <;> intro h <;> linarith
    _ ↔ 12 = 5 * x := by constructor <;> intro h <;> linarith
    _ ↔ x = 24 / 10 := by constructor <;> intro h <;> linarith

/-- Primer 2, korak 3: najmanjši skupni večkratnik imenovalcev 3 in 4 je 12. -/
theorem primer2_nsv : Nat.lcm 3 4 = 12 := by decide

/-- Primer 2, preizkus: 2,4 : 3 = 0,8, 2,4 : 4 = 0,6 in 0,8 + 0,6 + 1 = 2,4. -/
theorem primer2_preizkus :
    (24 : ℝ) / 10 / 3 = 8 / 10 ∧ (24 : ℝ) / 10 / 4 = 6 / 10 ∧ (8 : ℝ) / 10 + 6 / 10 + 1 = 24 / 10 := by
  norm_num

/-- Primer 3, korak 1: 10 min = 1/6 h (10/60 = 1/6). -/
theorem primer3_zamik : (10 : ℝ) / 60 = 1 / 6 := by norm_num

/-- Primer 3 (reševalci naproti): 60t + 90(t − 1/6) = 60 ima natanko rešitev t = 0,5, po korakih:
60t + 90t − 15 = 60 (90 · 1/6 = 15), 150t = 75, t = 0,5. -/
theorem primer3 (t : ℝ) : 60 * t + 90 * (t - 1 / 6) = 60 ↔ t = 1 / 2 := by
  calc 60 * t + 90 * (t - 1 / 6) = 60 ↔ 60 * t + 90 * t - 15 = 60 := by
        constructor <;> intro h <;> linarith
    _ ↔ 150 * t = 75 := by constructor <;> intro h <;> linarith
    _ ↔ t = 1 / 2 := by constructor <;> intro h <;> linarith

/-- Primer 3, korak 4 in 5: 90 · 1/6 = 15; avto vozi 0,5 h = 30 min in prevozi 60 · 0,5 = 30 km. -/
theorem primer3_racuna : (90 : ℝ) * (1 / 6) = 15 ∧ (1 : ℝ) / 2 * 60 = 30 ∧ (60 : ℝ) * (1 / 2) = 30 := by
  norm_num

/-- Primer 3, smiselnost: rešitev t = 0,5 je vsaj 1/6, zato reševalci vozijo nenegativen čas t − 1/6 ≥ 0. -/
theorem primer3_smiselno : (1 : ℝ) / 6 ≤ 1 / 2 ∧ (0 : ℝ) ≤ 1 / 2 - 1 / 6 := by norm_num

/-- Primer 3, preizkus: reševalci vozijo 0,5 − 1/6 = 1/3 h (= 20 min), prevozijo 90 · 1/3 = 30 km,
skupaj 30 + 30 = 60. -/
theorem primer3_preizkus :
    (1 : ℝ) / 2 - 1 / 6 = 1 / 3 ∧ (1 : ℝ) / 3 * 60 = 20 ∧ (90 : ℝ) * (1 / 3) = 30 ∧ (30 : ℝ) + 30 = 60 := by
  norm_num

/-- Primer 4 (dve škatli tablet), Premisli: 38 − 3x = 24 − x ima natanko rešitev x = 7 (14 = 2x). -/
theorem primer4 (x : ℝ) : 38 - 3 * x = 24 - x ↔ x = 7 := by
  calc 38 - 3 * x = 24 - x ↔ 14 = 2 * x := by constructor <;> intro h <;> linarith
    _ ↔ x = 7 := by constructor <;> intro h <;> linarith

/-- Primer 4, preizkus: Ana ima 38 − 21 = 17, Bor 24 − 7 = 17 tablet. -/
theorem primer4_preizkus : (38 : ℝ) - 3 * 7 = 38 - 21 ∧ (38 : ℝ) - 21 = 17 ∧ (24 : ℝ) - 7 = 17 := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake (mešane enote): napačna enačba 60t + 90(t − 10) = 60 ima rešitev t = 6,4, ne 0,5. -/
theorem napaka_enote (t : ℝ) : 60 * t + 90 * (t - 10) = 60 ↔ t = 64 / 10 := by
  constructor <;> intro h <;> linarith

/-- Pogoste napake (besedo za besedo): napačna enačba 40x − 500 = 180 ima rešitev x = 17, zato pravi odgovor
x = 8 te enačbe ne reši. -/
theorem napaka_vrstni_red (x : ℝ) : 40 * x - 500 = 180 ↔ x = 17 := by
  constructor <;> intro h <;> linarith

/-- Pogoste napake (besedo za besedo): x = 8 ne reši 40x − 500 = 180. -/
theorem napaka_vrstni_red_8 : (40 : ℝ) * 8 - 500 ≠ 180 := by norm_num

/-- Pogoste napake (seštete hitrosti pri dohitevanju, kviz 5): napačna enačba (60 + 40)t = 20 da t = 0,2,
pravilna 60t = 40(t + 0,5) pa t = 1 (`kviz5`). -/
theorem napaka_sestete (t : ℝ) : (60 + 40) * t = 20 ↔ t = 2 / 10 := by
  constructor <;> intro h <;> linarith

/-! ## Bolj natančno -/

/-- Bolj natančno: premici y = −3x + 38 in y = −x + 24 (Primer 4) se sekata natanko v točki (7, 17). -/
theorem presecisce (x y : ℝ) : (y = -3 * x + 38 ∧ y = -x + 24) ↔ (x = 7 ∧ y = 17) := by
  constructor
  · rintro ⟨h1, h2⟩
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩
    norm_num

/-- Bolj natančno: pri različnih smernih koeficientih (k₁ ≠ k₂) ima enačba k₁x + n₁ = k₂x + n₂ natanko eno
rešitev. -/
theorem ena_resitev (k₁ n₁ k₂ n₂ : ℝ) (hk : k₁ ≠ k₂) : ∃! x : ℝ, k₁ * x + n₁ = k₂ * x + n₂ := by
  have h : k₁ - k₂ ≠ 0 := sub_ne_zero.mpr hk
  refine ⟨(n₂ - n₁) / (k₁ - k₂), ?_, ?_⟩
  · field_simp
    ring
  · intro y hy
    rw [eq_div_iff h]
    linarith

/-- Predpostavka `ena_resitev` se da izpolniti (k₁ = −3, k₂ = −1). -/
example : (-3 : ℝ) ≠ -1 := by norm_num

/-- Bolj natančno: vzporedni premici (k₁ = k₂, n₁ ≠ n₂): enačba k₁x + n₁ = k₂x + n₂ nima rešitve. -/
theorem nobene_resitve (k₁ n₁ k₂ n₂ : ℝ) (hk : k₁ = k₂) (hn : n₁ ≠ n₂) :
    ¬ ∃ x : ℝ, k₁ * x + n₁ = k₂ * x + n₂ := by
  rintro ⟨x, hx⟩
  subst hk
  exact hn (by linarith)

/-- Predpostavke `nobene_resitve` se dajo izpolniti (k₁ = k₂ = 2, n₁ = 0, n₂ = 1). -/
example : (2 : ℝ) = 2 ∧ (0 : ℝ) ≠ 1 := by norm_num

/-- Bolj natančno: sovpadajoči premici (k₁ = k₂, n₁ = n₂): vsak x je rešitev. -/
theorem neskoncno_resitev (k₁ n₁ k₂ n₂ : ℝ) (hk : k₁ = k₂) (hn : n₁ = n₂) :
    ∀ x : ℝ, k₁ * x + n₁ = k₂ * x + n₂ := by
  intro x
  rw [hk, hn]

/-- Predpostavke `neskoncno_resitev` se dajo izpolniti. -/
example : (2 : ℝ) = 2 ∧ (5 : ℝ) = 5 := by norm_num

/-! ## Preveri se -/

/-- Preveri se, vprašanje 3: brez zamika je 60t + 90t = 60 natanko pri t = 0,4 h (150t = 60); to je 24 min,
manj kot 30 min (prej kot v Primeru 3). -/
theorem kviz3 (t : ℝ) : 60 * t + 90 * t = 60 ↔ t = 4 / 10 := by
  calc 60 * t + 90 * t = 60 ↔ 150 * t = 60 := by constructor <;> intro h <;> linarith
    _ ↔ t = 4 / 10 := by constructor <;> intro h <;> linarith

/-- Preveri se, vprašanje 3: 0,4 h = 24 min < 30 min. -/
theorem kviz3_minute : (4 : ℝ) / 10 * 60 = 24 ∧ (24 : ℝ) < 30 := by norm_num

/-- Preveri se, vprašanje 3, napačni odgovor »ob isti uri«: če bi se srečala pri t = 0,5 h, bi reševalci vozili
0,5 h namesto 1/3 h (10 min = 1/6 h dlje), prevozili 90 · 0,5 = 45 km, to je 15 km več kot 30 km, skupaj pa
30 + 45 = 75 km, več kot 60 km. -/
theorem kviz3_napaka : (1 : ℝ) / 2 - 1 / 3 = 1 / 6 ∧ (90 : ℝ) * (1 / 2) = 45 ∧ (45 : ℝ) - 30 = 15 ∧
    (60 : ℝ) * (1 / 2) + 90 * (1 / 2) = 75 ∧ (60 : ℝ) < 75 := by norm_num

/-- Preveri se, vprašanje 4: 1000 − 125x = 250 ima natanko rešitev x = 6 (−125x = −750). -/
theorem kviz4 (x : ℝ) : 1000 - 125 * x = 250 ↔ x = 6 := by
  calc 1000 - 125 * x = 250 ↔ -125 * x = -750 := by constructor <;> intro h <;> linarith
    _ ↔ x = 6 := by constructor <;> intro h <;> linarith

/-- Preveri se, vprašanje 4: preizkus 1000 − 125 · 6 = 250; napačni odgovori 8, 2 in 10 so
1000 : 125, 250 : 125 in (1000 + 250) : 125. -/
theorem kviz4_racuni : (1000 : ℝ) - 125 * 6 = 250 ∧ (1000 : ℝ) / 125 = 8 ∧ (250 : ℝ) / 125 = 2 ∧
    ((1000 : ℝ) + 250) / 125 = 10 := by norm_num

/-- Preveri se, vprašanje 5 (kurir): 60t = 40(t + 0,5) ima natanko rešitev t = 1 (20t = 20). -/
theorem kviz5 (t : ℝ) : 60 * t = 40 * (t + 1 / 2) ↔ t = 1 := by
  calc 60 * t = 40 * (t + 1 / 2) ↔ 20 * t = 20 := by constructor <;> intro h <;> linarith
    _ ↔ t = 1 := by constructor <;> intro h <;> linarith

/-- Preveri se, vprašanje 5: takrat sta oba 60 km od bolnišnice (60 · 1 = 40 · 1,5 = 60); kurir vozi 1,5 h. -/
theorem kviz5_preizkus : (60 : ℝ) * 1 = 60 ∧ (40 : ℝ) * (1 + 1 / 2) = 60 := by norm_num

/-- Preveri se, vprašanje 5, napačna odgovora: pri dohitevanju se razdalja manjša za 60 − 40 = 20 (km/h);
čas vožnje kurirja je t + 0,5 = 1 + 0,5 = 1,5 (h). -/
theorem kviz5_napake : (60 : ℝ) - 40 = 20 ∧ (1 : ℝ) + 1 / 2 = 3 / 2 := by norm_num

end Evklid.Lekcije.MAT_OS_9.BesedilneNaloge
