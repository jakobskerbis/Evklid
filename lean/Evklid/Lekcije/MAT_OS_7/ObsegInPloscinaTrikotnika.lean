/-
vir: content/lessons/MAT-OS-7/obseg-in-ploscina-trikotnika.md
sha256: ffdb4d0316c349fe50821285206d71786c982672b3bcfdafa65cb0888fd24bfe
Model: trikotnik z osnovnico a > 0 in višino h > 0 postavimo v ravnino ℝ × ℝ s koordinatama (y, x): y je višina
nad osnovnico, x vodoravna lega. Oglišča so (0, 0), (0, a) in vrh (h, s); s je »zamik vrha« (simulacija), vsak
realen s je dovoljen (s < 0 ali s > a: višina pade zunaj, na podaljšek osnovnice). Trikotnik je množica točk,
ki na višini y ∈ [0, h] ležijo med stranicama: `regionBetween` (vodoravna daljica brez krajišč; robovi imajo mero
0), ploščina je Lebesgueova mera `volume` v ℝ × ℝ. Dolžini poševnih stranic sta po formuli za razdaljo
√(h² + s²) in √(h² + (a − s)²); obseg je vsota treh stranic (`obseg`). Konkretni trikotniki iz lekcije so dani
z a, h, s; da imajo stranice iz lekcije (13, 13, 10; 5, 5, 8 …), je dokazano. Decimalna števila so točni ulomki
(4,8 = 24/5, 0,5 = 1/2); enote (cm, m) so le v docstringih, 0,5 m = 50 cm je 1/2 · 100 = 50.
Ni v Leanu: risbe, simulacija in zgodba (dokazani so računi in splošni trditvi, da ploščina ni odvisna od zamika
vrha in da je obseg najmanjši, ko je vrh nad sredino); definicije in poimenovanja (osnovnica, višina, pripadajoča
stranica, kaj je v_c: Preveri se 1, opis); da je p = a·v_a/2 = b·v_b/2 = c·v_c/2 v SPLOŠNEM trikotniku (ena
ploščina ne glede na izbrano osnovnico: zahtevno, še ni dokazano; dokazano je za trikotnik 5, 5, 8 iz Primera 2,
postavljen na osnovnico a = 5 in na osnovnico c = 8, obakrat ploščina 12); »pravokotni trikotnik: samo tu smeš
množiti dve stranici« je dokazano le za stranici ob oglišču (0, 0) (a · √(h² + s²)/2 je ploščina natanko pri s = 0);
razrez z višino na dva pravokotna trikotnika in »diagonala razpolovi pravokotnik« (dokazana je algebra
s·h/2 + (a − s)·h/2 = a·h/2 in da je ploščina pravokotnika a·h, trikotnika pa pol tega); vrstica »daleč ob strani:
še večji obseg« (dokazano je le, da je nad sredino najmanjši in nad ogliščem večji; rast obsega z oddaljenostjo:
zahtevno, še ni dokazano); hipotenuza ruti »približno 136 cm« je dokazana kot 135,5 < √18432 < 136,5; postopek
»Korak za korakom«, Pogoste napake 4 (višina mora pripadati osnovnici, opis), zadnja alineja Povzetka (rob je
obseg, površina je ploščina, opis), nasveti o enotah in besedilo napačnih odgovorov v Preveri se (dokazane so napačne vrednosti);
v zgodbi, da sta pol kvadrata dve enaki ruti (dokazano 96 · 96 = 9216 in 9216 : 2 = 4608 ter ploščina modela).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.ObsegInPloscinaTrikotnika

open MeasureTheory Set

/-- Model: trikotnik z oglišči (0, 0), (0, a) in vrhom (h, s) v koordinatah (y, x): na višini y ∈ [0, h] so
točke z x med levo stranico s·y/h in desno stranico s·y/h + a·(1 − y/h). -/
noncomputable def trikotnik (a h s : ℝ) : Set (ℝ × ℝ) :=
  regionBetween (fun y => s * y / h) (fun y => s * y / h + a * (1 - y / h)) (Icc 0 h)

/-- Model: obseg trikotnika (osnovnica a in poševni stranici √(h² + s²), √(h² + (a − s)²)). -/
noncomputable def obseg (a h s : ℝ) : ℝ := a + √(h ^ 2 + s ^ 2) + √(h ^ 2 + (a - s) ^ 2)

/-! ## Splošna pravila -/

/-- Razlaga (Ploščina), Povzetek, simulacija, Preveri se 3: ploščina trikotnika z osnovnico a in višino h je
a · h/2, za vsak zamik vrha s (tudi pri topokotnem trikotniku, ko višina pade na podaljšek osnovnice). -/
theorem ploscina (a h s : ℝ) (ha : 0 < a) (hh : 0 < h) :
    volume (trikotnik a h s) = ENNReal.ofReal (a * h / 2) := by
  unfold trikotnik
  rw [Measure.volume_eq_prod]
  have hf : Continuous (fun y : ℝ => s * y / h) := by fun_prop
  have hg : Continuous (fun y : ℝ => s * y / h + a * (1 - y / h)) := by fun_prop
  rw [volume_regionBetween_eq_integral (hf.integrableOn_Icc) (hg.integrableOn_Icc) measurableSet_Icc
    (fun y hy => by
      have h1 : y / h ≤ 1 := (div_le_one hh).mpr hy.2
      nlinarith)]
  congr 1
  have e : ∀ y : ℝ, ((fun y => s * y / h + a * (1 - y / h)) - fun y => s * y / h) y = a - a / h * y := by
    intro y; simp only [Pi.sub_apply]; ring
  simp_rw [e]
  rw [integral_Icc_eq_integral_Ioc, ← intervalIntegral.integral_of_le hh.le,
    intervalIntegral.integral_sub (f := fun _ : ℝ => a) (g := fun x : ℝ => a / h * x) intervalIntegrable_const
      ((continuous_const.mul continuous_id).intervalIntegrable 0 h),
    intervalIntegral.integral_const, intervalIntegral.integral_const_mul, integral_id]
  simp only [smul_eq_mul]
  field_simp
  ring

/-- Predpostavki `ploscina` se dajo izpolniti (a = 6, h = 4). -/
example : (0:ℝ) < 6 ∧ (0:ℝ) < 4 := by norm_num

/-- Razlaga (Ploščina), Pogoste napake 2: pravokotnik okoli trikotnika (stranici a in h) ima ploščino a · h;
trikotnik ima pol te ploščine. -/
theorem pol_pravokotnika (a h s : ℝ) (ha : 0 < a) (hh : 0 < h) :
    volume (Icc (0:ℝ) h ×ˢ Icc (0:ℝ) a) = ENNReal.ofReal (a * h) ∧
    volume (trikotnik a h s) = ENNReal.ofReal (a * h / 2) := by
  refine ⟨?_, ploscina a h s ha hh⟩
  rw [Measure.volume_eq_prod, Measure.prod_prod, Real.volume_Icc, Real.volume_Icc,
    ← ENNReal.ofReal_mul (by linarith)]
  congr 1; ring

/-- Predpostavki `pol_pravokotnika` se dajo izpolniti (a = 10, h = 12). -/
example : (0:ℝ) < 10 ∧ (0:ℝ) < 12 := by norm_num

/-- Razlaga (Ploščina): višina razdeli osnovnico na dela s in a − s; polovici pravokotnikov s · h in (a − s) · h
skupaj data a · h/2. -/
theorem razrez_z_visino (a h s : ℝ) : s * h / 2 + (a - s) * h / 2 = a * h / 2 := by ring

/-- Razlaga (Pravokotni trikotnik), Povzetek, Pogoste napake 1: pri s = 0 je stranica od (0, 0) do vrha (h, 0)
pravokotna na osnovnico in dolga h, zato je ploščina polovica zmnožka katet a · h/2. Zmnožek osnovnice in poševne
stranice √(h² + s²) ob istem oglišču da ploščino natanko tedaj, ko je s = 0 (kot pri (0, 0) je pravi). -/
theorem pravokotni (a h s : ℝ) (ha : 0 < a) (hh : 0 < h) :
    volume (trikotnik a h 0) = ENNReal.ofReal (a * h / 2) ∧ √(h ^ 2 + 0 ^ 2) = h ∧
    (a * √(h ^ 2 + s ^ 2) / 2 = a * h / 2 ↔ s = 0) := by
  refine ⟨ploscina a h 0 ha hh, by simp [Real.sqrt_sq hh.le], ?_⟩
  constructor
  · intro e
    have e2 : √(h ^ 2 + s ^ 2) = h := by
      have := mul_left_cancel₀ ha.ne' (by linarith : a * √(h ^ 2 + s ^ 2) = a * h)
      exact this
    have e3 : h ^ 2 + s ^ 2 = h ^ 2 := by
      have := Real.sq_sqrt (by positivity : (0:ℝ) ≤ h ^ 2 + s ^ 2)
      rw [e2] at this; linarith
    nlinarith
  · rintro rfl; simp [Real.sqrt_sq hh.le]

/-- Predpostavki `pravokotni` se dajo izpolniti (a = 96, h = 96). -/
example : (0:ℝ) < 96 ∧ (0:ℝ) < 96 := by norm_num

/-- Razlaga (Topokotni trikotnik): pri s > a pade višina iz vrha zunaj osnovnice [0, a] in kot pri (0, a) je top
(skalarni produkt stranic iz (0, a), (0, −a) · (h, s − a) = −a(s − a), je negativen). -/
theorem topokotni (a h s : ℝ) (ha : 0 < a) (hs : a < s) : s ∉ Icc 0 a ∧ 0 * h + (-a) * (s - a) < 0 := by
  refine ⟨fun h' => by linarith [h'.2], by nlinarith⟩

/-- Predpostavki `topokotni` se dajo izpolniti (a = 5, s = 32/5 iz Primera 2). -/
example : (0:ℝ) < 5 ∧ (5:ℝ) < 32 / 5 := by norm_num

/-- Razlaga (simulacija), Korak za korakom, Preveri se 3: obseg je najmanjši, ko je vrh nad sredino osnovnice
(s = a/2); pri ostalih legah vrha je obseg enak ali večji. -/
theorem obseg_najmanjsi (a h s : ℝ) : obseg a h (a / 2) ≤ obseg a h s := by
  simp only [obseg]
  have hm : √(h ^ 2 + (a / 2) ^ 2) + √(h ^ 2 + (a - a / 2) ^ 2) = √(4 * h ^ 2 + a ^ 2) := by
    rw [show a - a / 2 = a / 2 by ring, ← two_mul,
      show 4 * h ^ 2 + a ^ 2 = 2 ^ 2 * (h ^ 2 + (a / 2) ^ 2) by ring,
      Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  set u := √(h ^ 2 + s ^ 2) with hu_def
  set w := √(h ^ 2 + (a - s) ^ 2) with hw_def
  have hu : 0 ≤ u := Real.sqrt_nonneg _
  have hw : 0 ≤ w := Real.sqrt_nonneg _
  have hu2 : u ^ 2 = h ^ 2 + s ^ 2 := Real.sq_sqrt (by positivity)
  have hw2 : w ^ 2 = h ^ 2 + (a - s) ^ 2 := Real.sq_sqrt (by positivity)
  have huw : h ^ 2 + s * (a - s) ≤ u * w := by
    have e : u * w = √((h ^ 2 + s ^ 2) * (h ^ 2 + (a - s) ^ 2)) :=
      (Real.sqrt_mul (by positivity) _).symm
    rw [e]
    refine le_trans (le_abs_self _) (Real.abs_le_sqrt ?_)
    nlinarith [sq_nonneg (h * (a - s) - h * s)]
  have key : √(4 * h ^ 2 + a ^ 2) ≤ u + w := by
    calc √(4 * h ^ 2 + a ^ 2) ≤ √((u + w) ^ 2) := Real.sqrt_le_sqrt (by nlinarith)
      _ = u + w := Real.sqrt_sq (by positivity)
  linarith

/-! ## Zakaj se tega učimo in razlaga -/

/-- Uvod, Razlaga (preglednica): ozek obliž (osnovnica 10, višina 12, vrh nad sredino) ima stranici 13 in 13;
širok obliž (osnovnica 24, višina 5) ima stranici 13 in 13; drugi ima za 24 − 10 = 14 daljši rob. -/
theorem oblizi_stranice : √((12:ℝ) ^ 2 + 5 ^ 2) = 13 ∧ √((12:ℝ) ^ 2 + (10 - 5) ^ 2) = 13 ∧
    √((5:ℝ) ^ 2 + 12 ^ 2) = 13 ∧ √((5:ℝ) ^ 2 + (24 - 12) ^ 2) = 13 ∧ (24:ℝ) - 10 = 14 := by
  refine ⟨?_, ?_, ?_, ?_, by norm_num⟩ <;>
  · rw [Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)]; norm_num

/-- Uvod, Razlaga (preglednica), Pogoste napake 3: oba obliža pokrijeta natanko 60 cm² (10 · 12/2 = 24 · 5/2 = 60),
obseg prvega je 10 + 13 + 13 = 36 cm, drugega 24 + 13 + 13 = 50 cm: daljši rob, enaka ploščina. -/
theorem oblizi : volume (trikotnik 10 12 5) = ENNReal.ofReal 60 ∧ volume (trikotnik 24 5 12) = ENNReal.ofReal 60 ∧
    obseg 10 12 5 = 10 + 13 + 13 ∧ (10:ℝ) + 13 + 13 = 36 ∧ obseg 24 5 12 = 24 + 13 + 13 ∧
    (24:ℝ) + 13 + 13 = 50 := by
  obtain ⟨h1, h2, h3, h4, -⟩ := oblizi_stranice
  refine ⟨?_, ?_, ?_, by norm_num, ?_, by norm_num⟩
  · rw [ploscina 10 12 5 (by norm_num) (by norm_num)]; norm_num
  · rw [ploscina 24 5 12 (by norm_num) (by norm_num)]; norm_num
  · simp only [obseg]; rw [h1, h2]
  · simp only [obseg]; rw [h3, h4]

/-- Razlaga (mamljiva napačna ideja), Pogoste napake 1: 13 · 13/2 = 84,5 ni 60. -/
theorem napacna_ideja : (13:ℝ) * 13 / 2 = 169 / 2 ∧ (169:ℝ) / 2 ≠ 60 := by norm_num

/-- Razlaga, premisli 1: kos, prerezan vzdolž višine, ima osnovnico 5 in višino 12, je pravokotni trikotnik
(vrh nad ogliščem, s = 0) s ploščino 5 · 12/2 = 30 = 60/2. -/
theorem polovica_obliza : volume (trikotnik 5 12 0) = ENNReal.ofReal 30 ∧ (5:ℝ) * 12 / 2 = 30 ∧
    (60:ℝ) / 2 = 30 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  rw [ploscina 5 12 0 (by norm_num) (by norm_num)]; norm_num

/-- Razlaga (simulacija), Korak za korakom (preglednica): a = 6, v = 4: ploščina je 6 · 4/2 = 12 za vsak zamik
vrha s; obseg nad sredino je 6 + 5 + 5 = 16, nad ogliščem 6 + 4 + √52, kar je več kot 16 (obseg se spremeni). -/
theorem simulacija (s : ℝ) : volume (trikotnik 6 4 s) = ENNReal.ofReal 12 ∧ (6:ℝ) * 4 = 24 ∧
    obseg 6 4 3 = 16 ∧ obseg 6 4 0 = 6 + 4 + √52 ∧ obseg 6 4 3 < obseg 6 4 0 := by
  have h5 : √((4:ℝ) ^ 2 + 3 ^ 2) = 5 := by
    rw [show (4:ℝ) ^ 2 + 3 ^ 2 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have h5' : √((4:ℝ) ^ 2 + (6 - 3) ^ 2) = 5 := by
    rw [show (4:ℝ) ^ 2 + (6 - 3) ^ 2 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have h4 : √((4:ℝ) ^ 2 + 0 ^ 2) = 4 := by
    rw [show (4:ℝ) ^ 2 + 0 ^ 2 = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have h52 : √((4:ℝ) ^ 2 + (6 - 0) ^ 2) = √52 := by norm_num
  have hlt : (6:ℝ) < √52 := Real.lt_sqrt_of_sq_lt (by norm_num)
  have o3 : obseg 6 4 3 = 16 := by simp only [obseg]; rw [h5, h5']; norm_num
  have o0 : obseg 6 4 0 = 6 + 4 + √52 := by simp only [obseg]; rw [h4, h52]
  refine ⟨?_, by norm_num, o3, o0, ?_⟩
  · rw [ploscina 6 4 s (by norm_num) (by norm_num)]; norm_num
  · rw [o3, o0]; linarith

/-! ## Rešeni primeri -/

/-- Primer 1 (ruta): kateti 96 in 96: o = 96 + 96 + 136 = 328 cm (s hipotenuzo, zaokroženo na 136),
p = 96 · 96/2 = 4608 cm²; ruta je pravokotni trikotnik modela z a = h = 96, s = 0. -/
theorem primer1 : (96:ℝ) + 96 + 136 = 328 ∧ (96:ℝ) * 96 / 2 = 4608 ∧
    volume (trikotnik 96 96 0) = ENNReal.ofReal 4608 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  rw [ploscina 96 96 0 (by norm_num) (by norm_num)]; norm_num

/-- Primer 1: hipotenuza √(96² + 96²) = √18432 je približno 136 (135,5 < √18432 < 136,5), zato se točni obseg
96 + 96 + √18432 od 328 razlikuje za manj kot 1/2. -/
theorem primer1_hipotenuza : (96:ℝ) ^ 2 + 96 ^ 2 = 18432 ∧ 271 / 2 < √(18432:ℝ) ∧ √(18432:ℝ) < 273 / 2 ∧
    |obseg 96 96 0 - 328| < 1 / 2 := by
  have h1 : (271:ℝ) / 2 < √18432 := Real.lt_sqrt_of_sq_lt (by norm_num)
  have h2 : √(18432:ℝ) < 273 / 2 := (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)
  have h96 : √((96:ℝ) ^ 2 + 0 ^ 2) = 96 := by
    rw [show (96:ℝ) ^ 2 + 0 ^ 2 = 96 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have hh : √((96:ℝ) ^ 2 + (96 - 0) ^ 2) = √18432 := by norm_num
  refine ⟨by norm_num, h1, h2, ?_⟩
  simp only [obseg]; rw [h96, hh, abs_lt]; constructor <;> linarith

/-- Primer 2 (obliž za komolec): o = 5 + 5 + 8 = 18 cm; p = 5 · 4,8/2 = 12 cm²; preizkus z osnovnico c = 8 in
v_c = 3: 8 · 3/2 = 12. Trikotnik je topokoten (5² + 5² < 8²). -/
theorem primer2 : (5:ℝ) + 5 + 8 = 18 ∧ (5:ℝ) * (24 / 5) / 2 = 12 ∧ (8:ℝ) * 3 / 2 = 12 ∧
    (5:ℝ) ^ 2 + 5 ^ 2 < 8 ^ 2 := by norm_num

/-- Primer 2 v modelu: na osnovnici a = 5 z višino v_a = 4,8 in zamikom vrha 6,4 (> 5: višina pade zunaj) ima
trikotnik stranici 8 in 5 in ploščino 12; na osnovnici c = 8 z višino 3 (vrh nad sredino) stranici 5 in 5 in
ploščino 12. -/
theorem primer2_model :
    √((24 / 5 : ℝ) ^ 2 + (32 / 5) ^ 2) = 8 ∧ √((24 / 5 : ℝ) ^ 2 + (5 - 32 / 5) ^ 2) = 5 ∧ (5:ℝ) < 32 / 5 ∧
    volume (trikotnik 5 (24 / 5) (32 / 5)) = ENNReal.ofReal 12 ∧
    √((3:ℝ) ^ 2 + 4 ^ 2) = 5 ∧ √((3:ℝ) ^ 2 + (8 - 4) ^ 2) = 5 ∧
    volume (trikotnik 8 3 4) = ENNReal.ofReal 12 := by
  refine ⟨?_, ?_, by norm_num, ?_, ?_, ?_, ?_⟩
  · rw [show (24 / 5 : ℝ) ^ 2 + (32 / 5) ^ 2 = 8 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (24 / 5 : ℝ) ^ 2 + (5 - 32 / 5) ^ 2 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [ploscina 5 (24 / 5) (32 / 5) (by norm_num) (by norm_num)]; norm_num
  · rw [show (3:ℝ) ^ 2 + 4 ^ 2 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (3:ℝ) ^ 2 + (8 - 4) ^ 2 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [ploscina 8 3 4 (by norm_num) (by norm_num)]; norm_num

/-- Primer 3, formula, Povzetek: iz p = a · v_a/2 sledi natanko v_a = 2p/a (a ≠ 0), oziroma a · v_a = 2p. -/
theorem visina_iz_ploscine (a p v : ℝ) (ha : a ≠ 0) : p = a * v / 2 ↔ v = 2 * p / a := by
  constructor
  · intro h; rw [h]; field_simp
  · intro h; rw [h]; field_simp

/-- Predpostavka `visina_iz_ploscine` se da izpolniti (a = 50). -/
example : (50:ℝ) ≠ 0 := by norm_num

/-- Primer 3 (blazina): 0,5 m = 50 cm; 2 · 750 = 1500; v_a = 1500 : 50 = 30 cm; preizkus 50 · 30/2 = 750; edina
višina z 750 = 50 · v/2 je 30. -/
theorem primer3 (v : ℝ) : (1 / 2 : ℝ) * 100 = 50 ∧ (2:ℝ) * 750 = 1500 ∧ (1500:ℝ) / 50 = 30 ∧
    (50:ℝ) * 30 / 2 = 750 ∧ ((750:ℝ) = 50 * v / 2 ↔ v = 30) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Primer 4 (enakokraki obliž): 16 = 6 + 2a natanko pri a = 5 (16 − 6 = 10, 10 : 2 = 5); p = 6 · 4/2 = 12 cm².
V modelu (osnovnica 6, višina 4, vrh nad sredino) sta kraka res 5, obseg 16 in ploščina 12. -/
theorem primer4 (a : ℝ) : ((16:ℝ) = 6 + 2 * a ↔ a = 5) ∧ (16:ℝ) - 6 = 10 ∧ (10:ℝ) / 2 = 5 ∧
    (6:ℝ) * 4 / 2 = 12 ∧ obseg 6 4 3 = 16 ∧ volume (trikotnik 6 4 3) = ENNReal.ofReal 12 := by
  obtain ⟨h12, -, h16, -, -⟩ := simulacija 3
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num, h16, h12⟩

/-! ## Pogoste napake in zgodba -/

/-- Pogoste napake 3: širok, nizek obliž ima lahko daljši rob in celo manjšo ploščino: osnovnica 24, višina 4,
vrh nad sredino: ploščina 48 < 60, obseg 24 + 2√160 > 36. -/
theorem daljsi_rob_manjsa : volume (trikotnik 24 4 12) = ENNReal.ofReal 48 ∧ (48:ℝ) < 60 ∧
    obseg 24 4 12 = 24 + 2 * √160 ∧ (36:ℝ) < 24 + 2 * √160 := by
  have h12 : (12:ℝ) < √160 := Real.lt_sqrt_of_sq_lt (by norm_num)
  refine ⟨?_, by norm_num, ?_, by linarith⟩
  · rw [ploscina 24 4 12 (by norm_num) (by norm_num)]; norm_num
  · simp only [obseg]; norm_num; ring

/-- Kot zgodba: kvadrat 96 · 96 = 9216 cm², polovica 9216 : 2 = 4608 cm² (ruta iz Primera 1). -/
theorem zgodba : (96:ℝ) * 96 = 9216 ∧ (9216:ℝ) / 2 = 4608 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 2: ploščine 9 · 2/2 = 9, 4 · 6/2 = 12, 6 · 5/2 = 15, torej A < B < C. -/
theorem preveri2 : (9:ℝ) * 2 / 2 = 9 ∧ (4:ℝ) * 6 / 2 = 12 ∧ (6:ℝ) * 5 / 2 = 15 ∧ (9:ℝ) < 12 ∧ (12:ℝ) < 15 := by
  norm_num

/-- Preveri se 3: premik vrha ne spremeni ploščine (`ploscina` velja za vsak s), obseg pa se lahko spremeni
(`simulacija`: obseg 6 4 3 < obseg 6 4 0). -/
theorem preveri3 (a h s t : ℝ) (ha : 0 < a) (hh : 0 < h) :
    volume (trikotnik a h s) = volume (trikotnik a h t) ∧ obseg 6 4 3 ≠ obseg 6 4 0 := by
  refine ⟨by rw [ploscina a h s ha hh, ploscina a h t ha hh], ?_⟩
  exact ne_of_lt (simulacija 0).2.2.2.2

/-- Predpostavki `preveri3` se dajo izpolniti (a = 6, h = 4). -/
example : (0:ℝ) < 6 ∧ (0:ℝ) < 4 := by norm_num

/-- Preveri se 4: p = 8 · 3/2 = 12 cm²; napačni odgovori: 8 · 3 = 24, 5 · 8/2 = 20, 5 + 5 + 8 = 18. -/
theorem preveri4 : (8:ℝ) * 3 / 2 = 12 ∧ (8:ℝ) * 3 = 24 ∧ (5:ℝ) * 8 / 2 = 20 ∧ (5:ℝ) + 5 + 8 = 18 := by norm_num

/-- Preveri se 5: 21 = 7 · v/2 natanko pri v = 6 (a · v_a = 2 · 21 = 42, 42 : 7 = 6; preizkus 7 · 6/2 = 21);
napačni odgovori 21 : 7 = 3, 21 : 2 = 10,5, 21 · 7 = 147. -/
theorem preveri5 (v : ℝ) : ((21:ℝ) = 7 * v / 2 ↔ v = 6) ∧ (2:ℝ) * 21 = 42 ∧ (42:ℝ) / 7 = 6 ∧
    (7:ℝ) * 6 / 2 = 21 ∧ (21:ℝ) / 7 = 3 ∧ (21:ℝ) / 2 = 10 + 1 / 2 ∧ (21:ℝ) * 7 = 147 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num⟩

end Evklid.Lekcije.MAT_OS_7.ObsegInPloscinaTrikotnika
