/-
vir: content/lessons/MAT-SS-2/kvadratna-neenacba.md
sha256: a4bc6769e3d345b709bda09e633f206624ed41a9321dda17e4adeb32e8689355
Ni v Leanu: simulacija kot interaktivni prikaz (dokazano je, da je pri a = 1, b = −4 in c < 4 rešitev
interval (2 − √(4 − c), 2 + √(4 − c)), ki se z večjim c krči, pri c ≥ 4 pa je ni) in analogija z
gladino vode; definicija kvadratne neenačbe in rešitve (»množica vseh x, za katere velja«; v Leanu je
rešitev zapisana kot množica ali kot ↔); »graf nad osjo« je pomen neenačbe f(x) > 0, ne trditev;
postopek reševanja v korakih (Razlaga 4, Ponovitev, Ustno vprašanje 1, Preveri se 1 in 2 kot izbira
postopka) in nasveti (skica, preizkus z enim številom); fizikalna modela porabe goriva in zaustavitvene
poti (model velja za 30 ≤ v ≤ 130, »sorazmerna« kot fizikalni zakon; dokazana sta izračun koeficientov
iz podatkov in vsa računska vsebina); točkovanje; besedilo napačnih odgovorov v Preveri se (dokazani so
pravilni odgovori in, kjer gre, da napačni ne ustrezajo).
Približki so dokazani kot ocene napake zaokrožitve iz dokazanih mej korenov. Decimalna števila so točna
racionalna števila v ℝ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.KvadratnaNeenacba

open Set

/-! ## Splošna pravila -/

/-- Razlaga 5, Povzetek, Ponovitev, Bolj natančno (tabela predznakov): za a > 0 in ničli x₁ < x₂ je
a(x − x₁)(x − x₂) > 0 ⇔ x < x₁ ali x > x₂; ≥ 0 ⇔ x ≤ x₁ ali x ≥ x₂; < 0 ⇔ x₁ < x < x₂;
≤ 0 ⇔ x₁ ≤ x ≤ x₂.
trditev: MAT-SS-2/kvadratna-neenacba#med-nicla
besedilo: »| $f(x) > 0$ | $(-\infty, x_1) \cup (x_2, \infty)$ | | $f(x) \ge 0$ | $(-\infty, x_1] \cup [x_2, \infty)$ | | $f(x) < 0$ | $(x_1, x_2)$ | | $f(x) \le 0$ | $[x_1, x_2]$ |« -/
theorem med_nicla (a x₁ x₂ x : ℝ) (ha : 0 < a) (h12 : x₁ < x₂) :
    (0 < a * (x - x₁) * (x - x₂) ↔ x < x₁ ∨ x₂ < x) ∧
      (0 ≤ a * (x - x₁) * (x - x₂) ↔ x ≤ x₁ ∨ x₂ ≤ x) ∧
      (a * (x - x₁) * (x - x₂) < 0 ↔ x₁ < x ∧ x < x₂) ∧
      (a * (x - x₁) * (x - x₂) ≤ 0 ↔ x₁ ≤ x ∧ x ≤ x₂) := by
  refine ⟨⟨fun h => ?_, fun h => ?_⟩, ⟨fun h => ?_, fun h => ?_⟩, ⟨fun h => ?_, fun h => ?_⟩,
    ⟨fun h => ?_, fun h => ?_⟩⟩
  · by_contra hc
    push Not at hc
    nlinarith [mul_nonneg ha.le (mul_nonneg (sub_nonneg.2 hc.1) (sub_nonneg.2 hc.2))]
  · rcases h with h | h
    · nlinarith [mul_pos ha (mul_pos (sub_pos.2 h) (sub_pos.2 (h.trans h12)))]
    · nlinarith [mul_pos ha (mul_pos (sub_pos.2 (h12.trans h)) (sub_pos.2 h))]
  · by_contra hc
    push Not at hc
    nlinarith [mul_pos ha (mul_pos (sub_pos.2 hc.1) (sub_pos.2 hc.2))]
  · rcases h with h | h
    · nlinarith [mul_nonneg ha.le (mul_nonneg (sub_nonneg.2 h) (sub_nonneg.2 (h.trans h12.le)))]
    · nlinarith [mul_nonneg ha.le (mul_nonneg (sub_nonneg.2 (h12.le.trans h)) (sub_nonneg.2 h))]
  · constructor
    · by_contra hc
      push Not at hc
      nlinarith [mul_nonneg ha.le (mul_nonneg (sub_nonneg.2 hc) (sub_nonneg.2 (hc.trans h12.le)))]
    · by_contra hc
      push Not at hc
      nlinarith [mul_nonneg ha.le (mul_nonneg (sub_nonneg.2 (h12.le.trans hc)) (sub_nonneg.2 hc))]
  · nlinarith [mul_pos ha (mul_pos (sub_pos.2 h.1) (sub_pos.2 h.2))]
  · constructor
    · by_contra hc
      push Not at hc
      nlinarith [mul_pos ha (mul_pos (sub_pos.2 hc) (sub_pos.2 (hc.trans h12)))]
    · by_contra hc
      push Not at hc
      nlinarith [mul_pos ha (mul_pos (sub_pos.2 (h12.trans hc)) (sub_pos.2 hc))]
  · nlinarith [mul_nonneg ha.le (mul_nonneg (sub_nonneg.2 h.1) (sub_nonneg.2 h.2))]

/-- Predpostavke `med_nicla` se dajo izpolniti (a = 1, ničli 0 in 1). -/
example : (1 : ℝ) * (2 - 0) * (2 - 1) > 0 :=
  (med_nicla 1 0 1 2 one_pos one_pos).1.2 (Or.inr one_lt_two)

/-- Razlaga 8: za a < 0 in x₁ < x₂ je a(x − x₁)(x − x₂) > 0 ⇔ x₁ < x < x₂ (med ničlama nad osjo),
≥ 0 ⇔ x₁ ≤ x ≤ x₂, < 0 ⇔ x < x₁ ali x > x₂, ≤ 0 ⇔ x ≤ x₁ ali x ≥ x₂.
trditev: MAT-SS-2/kvadratna-neenacba#med-nicla-neg
besedilo: »Parabola je odprta navzdol, zato je **med** ničlama nad osjo, zunaj njiju pod osjo.« -/
theorem med_nicla_neg (a x₁ x₂ x : ℝ) (ha : a < 0) (h12 : x₁ < x₂) :
    (0 < a * (x - x₁) * (x - x₂) ↔ x₁ < x ∧ x < x₂) ∧
      (0 ≤ a * (x - x₁) * (x - x₂) ↔ x₁ ≤ x ∧ x ≤ x₂) ∧
      (a * (x - x₁) * (x - x₂) < 0 ↔ x < x₁ ∨ x₂ < x) ∧
      (a * (x - x₁) * (x - x₂) ≤ 0 ↔ x ≤ x₁ ∨ x₂ ≤ x) := by
  have h := med_nicla (-a) x₁ x₂ x (by linarith) h12
  have e : a * (x - x₁) * (x - x₂) = -(-a * (x - x₁) * (x - x₂)) := by ring
  rw [e, neg_pos, neg_nonneg, neg_lt_zero, neg_nonpos]
  exact ⟨h.2.2.1, h.2.2.2, h.1, h.2.1⟩

/-- Predpostavke `med_nicla_neg` se dajo izpolniti (a = −1). -/
example : 0 < (-1 : ℝ) * (0.5 - 0) * (0.5 - 1) :=
  (med_nicla_neg (-1) 0 1 0.5 (by norm_num) one_pos).1.2 (by norm_num)

/-- Razlaga 8, Pogoste napake 1, Povzetek: pri množenju z negativnim številom se neenačaj obrne:
za k < 0 je k·A > 0 ⇔ A < 0 (in k·A ≥ 0 ⇔ A ≤ 0); pri pozitivnem ostane.
trditev: MAT-SS-2/kvadratna-neenacba#mnozenje-z-negativnim
besedilo: »Pri množenju ali deljenju z negativnim številom obrni neenačaj.« -/
theorem mnozenje_z_negativnim (k A : ℝ) (hk : k < 0) : (0 < k * A ↔ A < 0) ∧ (0 ≤ k * A ↔ A ≤ 0) :=
  ⟨⟨fun h => by nlinarith, fun h => by nlinarith⟩, ⟨fun h => by nlinarith, fun h => by nlinarith⟩⟩

/-- Predpostavka `mnozenje_z_negativnim` se da izpolniti (k = −1). -/
example : (0 < (-1 : ℝ) * (-2) ↔ (-2 : ℝ) < 0) := (mnozenje_z_negativnim (-1) (-2) (by norm_num)).1

/-- Razlaga 3 in 6 (D = 0): za a > 0 je a(x − p)² > 0 ⇔ x ≠ p, ≥ 0 za vse x, < 0 nikoli,
≤ 0 ⇔ x = p.
trditev: MAT-SS-2/kvadratna-neenacba#dvojna-nicla
besedilo: »Parabola se osi $x$ le dotakne v eni točki (teme leži na osi). Za $a > 0$ je graf povsod drugje nad osjo.« -/
theorem dvojna_nicla (a p x : ℝ) (ha : 0 < a) :
    (0 < a * (x - p) ^ 2 ↔ x ≠ p) ∧ 0 ≤ a * (x - p) ^ 2 ∧ ¬ a * (x - p) ^ 2 < 0 ∧
      (a * (x - p) ^ 2 ≤ 0 ↔ x = p) := by
  have h0 : 0 ≤ a * (x - p) ^ 2 := by positivity
  have hz : a * (x - p) ^ 2 = 0 ↔ x = p := by simp [ha.ne', sub_eq_zero]
  refine ⟨⟨fun h hx => by rw [hz.2 hx] at h; exact lt_irrefl 0 h,
    fun hx => lt_of_le_of_ne h0 (fun e => hx (hz.1 e.symm))⟩, h0, not_lt.2 h0,
    ⟨fun h => hz.1 (le_antisymm h h0), fun hx => (hz.2 hx).le⟩⟩

/-- Predpostavka `dvojna_nicla` se da izpolniti (a = 1). -/
example : 0 ≤ (1 : ℝ) * (3 - 2) ^ 2 := (dvojna_nicla 1 2 3 one_pos).2.1

/-- Razlaga 6, Ustno vprašanje 3: za f(x) = (x − 2)² je f > 0 na ℝ ∖ {2}, f ≥ 0 povsod, f < 0 nikoli,
množica rešitev f ≤ 0 je {2}.
trditev: MAT-SS-2/kvadratna-neenacba#primer-x-2
besedilo: »Za $f(x) = (x - 2)^2$ dobimo: $f(x) > 0$ za $x \in \mathbb{R} \setminus \{2\}$, $f(x) \ge 0$ za vse $x \in \mathbb{R}$, $f(x) < 0$ nima rešitve ($\emptyset$), $f(x) \le 0$ pa velja le za $x = 2$, torej je rešitev $\{2\}$.« -/
theorem primer_x_2 : {x : ℝ | 0 < (x - 2) ^ 2} = univ \ {2} ∧ {x : ℝ | 0 ≤ (x - 2) ^ 2} = univ ∧
    {x : ℝ | (x - 2) ^ 2 < 0} = ∅ ∧ {x : ℝ | (x - 2) ^ 2 ≤ 0} = {2} := by
  have h := fun x : ℝ => dvojna_nicla 1 2 x one_pos
  simp only [one_mul] at h
  refine ⟨?_, ?_, ?_, ?_⟩ <;> ext x
  · simp [(h x).1]
  · simp [(h x).2.1]
  · simp [(h x).2.2.1]
  · simp [sub_eq_zero]

/-- Razlaga 7, Povzetek, Ponovitev, Ustno vprašanje 2 (D < 0): izraz ax² + bx + c ima za vse x predznak
koeficienta a.
trditev: MAT-SS-2/kvadratna-neenacba#d-neg-predznak
besedilo: »Pri $D < 0$ ima $ax^2 + bx + c$ za vse $x$ predznak koeficienta $a$.« -/
theorem D_neg_predznak (a b c : ℝ) (hD : b ^ 2 - 4 * a * c < 0) :
    (0 < a → ∀ x, 0 < a * x ^ 2 + b * x + c) ∧ (a < 0 → ∀ x, a * x ^ 2 + b * x + c < 0) := by
  have key : ∀ x, 4 * a * (a * x ^ 2 + b * x + c) = (2 * a * x + b) ^ 2 - (b ^ 2 - 4 * a * c) :=
    fun x => by ring
  have hp : ∀ x, 0 < 4 * a * (a * x ^ 2 + b * x + c) := fun x => by
    rw [key]; nlinarith [sq_nonneg (2 * a * x + b)]
  refine ⟨fun ha x => ?_, fun ha x => ?_⟩
  · by_contra h
    push Not at h
    nlinarith [hp x, mul_nonpos_of_nonneg_of_nonpos (by linarith : (0 : ℝ) ≤ 4 * a) h]
  · by_contra h
    push Not at h
    nlinarith [hp x, mul_nonpos_of_nonpos_of_nonneg (by linarith : 4 * a ≤ 0) h]

/-- Predpostavka `D_neg_predznak` se da izpolniti (x² + 1). -/
example : ∀ x : ℝ, 0 < 1 * x ^ 2 + 0 * x + 1 := (D_neg_predznak 1 0 1 (by norm_num)).1 one_pos

/-- Ustno vprašanje 2, Bolj natančno: ax² + bx + c = a[(x + b/(2a))² − D/(4a²)] (a ≠ 0), in pri D < 0 je
oglati oklepaj pozitiven (kvadrat ≥ 0, −D/(4a²) > 0).
trditev: MAT-SS-2/kvadratna-neenacba#temenska-d
besedilo: »Z dopolnjevanjem do popolnega kvadrata zapišemo $ax^2 + bx + c = a\left[\left(x + \frac{b}{2a}\right)^2 - \frac{D}{4a^2}\right]$. Prvi člen v oglatem oklepaju je kvadrat in zato ni negativen. Pri $D < 0$ je drugi člen $-\frac{D}{4a^2}$ pozitiven, zato je ves oglati oklepaj pozitiven za vsak $x$.« -/
theorem temenska_D (a b c x : ℝ) (ha : a ≠ 0) :
    a * x ^ 2 + b * x + c = a * ((x + b / (2 * a)) ^ 2 - (b ^ 2 - 4 * a * c) / (4 * a ^ 2)) ∧
      (b ^ 2 - 4 * a * c < 0 → 0 < -(b ^ 2 - 4 * a * c) / (4 * a ^ 2) ∧
        0 < (x + b / (2 * a)) ^ 2 - (b ^ 2 - 4 * a * c) / (4 * a ^ 2)) := by
  refine ⟨by field_simp; ring, fun hD => ?_⟩
  have h1 : 0 < -(b ^ 2 - 4 * a * c) / (4 * a ^ 2) := div_pos (by linarith) (by positivity)
  refine ⟨h1, ?_⟩
  have h2 : 0 ≤ (x + b / (2 * a)) ^ 2 := sq_nonneg _
  rw [neg_div] at h1
  linarith

/-- Predpostavka `temenska_D` se da izpolniti (a = 1). -/
example : (1 : ℝ) * 0 ^ 2 + 0 * 0 + 1 = 1 * ((0 + 0 / (2 * 1)) ^ 2 - (0 ^ 2 - 4 * 1 * 1) / (4 * 1 ^ 2)) :=
  (temenska_D 1 0 1 0 one_ne_zero).1

/-- Razlaga 8, premisli: pri a > 0 in x₁ < x₂ rešitev f(x) > 0 ni en sam neomejen interval (ni enaka
nobenemu (t, ∞) ali (−∞, t)).
trditev: MAT-SS-2/kvadratna-neenacba#ni-en-interval
besedilo: »Njena kraka se na obeh straneh dvigata v neskončnost, zato je nad osjo levo od $x_1$ in desno od $x_2$, torej na dveh ločenih kosih.« -/
theorem ni_en_interval (a x₁ x₂ : ℝ) (ha : 0 < a) (h12 : x₁ < x₂) (t : ℝ) :
    {x | 0 < a * (x - x₁) * (x - x₂)} ≠ Ioi t ∧ {x | 0 < a * (x - x₁) * (x - x₂)} ≠ Iio t := by
  constructor
  · intro h
    have m1 : x₁ - 1 ∈ {x | 0 < a * (x - x₁) * (x - x₂)} :=
      (med_nicla a x₁ x₂ (x₁ - 1) ha h12).1.2 (Or.inl (by linarith))
    rw [h] at m1
    have m2 : x₁ ∈ Ioi t := mem_Ioi.2 (lt_trans (mem_Ioi.1 m1) (by linarith))
    rw [← h] at m2
    simp at m2
  · intro h
    have m1 : x₂ + 1 ∈ {x | 0 < a * (x - x₁) * (x - x₂)} :=
      (med_nicla a x₁ x₂ (x₂ + 1) ha h12).1.2 (Or.inr (by linarith))
    rw [h] at m1
    have m2 : x₂ ∈ Iio t := mem_Iio.2 (lt_trans (by linarith) (mem_Iio.1 m1))
    rw [← h] at m2
    simp at m2

/-- Predpostavke `ni_en_interval` se dajo izpolniti (a = 1, ničli 0 in 1). -/
example : {x : ℝ | 0 < 1 * (x - 0) * (x - 1)} ≠ Ioi 0 := (ni_en_interval 1 0 1 one_pos one_pos 0).1

/-! ## Prelaz iz uvoda in Razlaga 1 -/

/-- Zakaj se tega učimo, Razlaga 1: 1600 − 25x² > 1200 ⇔ 400 − 25x² > 0 ⇔ x² < 16 ⇔ |x| < 4 ⇔ −4 < x < 4
(√(x²) = |x|); odsek je dolg 4 − (−4) = 8 km.
trditev: MAT-SS-2/kvadratna-neenacba#prelaz
besedilo: »Rešitev je $x \in (-4, 4)$: nad snežno mejo je $8\,\text{km}$ ceste, po štiri na vsaki strani vrha. Sošolec je pozabil, da je $\sqrt{x^2} = |x|$. Iz $x^2 < 16$ sledi $|x| < 4$, torej $-4 < x < 4$, ne le $x < 4$.« -/
theorem prelaz (x : ℝ) : (1600 - 25 * x ^ 2 > 1200 ↔ 400 - 25 * x ^ 2 > 0) ∧
    (400 - 25 * x ^ 2 > 0 ↔ x ^ 2 < 16) ∧ Real.sqrt (x ^ 2) = |x| ∧ (x ^ 2 < 16 ↔ |x| < 4) ∧
    (|x| < 4 ↔ -4 < x ∧ x < 4) ∧ (4 : ℝ) - (-4) = 8 := by
  refine ⟨by constructor <;> intro h <;> linarith, by constructor <;> intro h <;> linarith,
    Real.sqrt_sq_eq_abs x, ?_, abs_lt, by norm_num⟩
  rw [show (16 : ℝ) = 4 ^ 2 by norm_num, sq_lt_sq, abs_of_pos (by norm_num : (0 : ℝ) < 4)]

/-- Zakaj se tega učimo: sošolčev »x < 4« je napačen: x = −6 zadošča x < 4, a h(−6) = 700 < 1200.
trditev: MAT-SS-2/kvadratna-neenacba#prelaz-napaka
besedilo: »Po tem rezultatu pa bi bila nad snežno mejo tudi točka $x = -6$, šest kilometrov zahodno od prelaza. Tam je cesta na višini $h(-6) = 700\,\text{m}$, globoko pod mejo.« -/
theorem prelaz_napaka : (-6 : ℝ) < 4 ∧ 1600 - 25 * (-6 : ℝ) ^ 2 = 700 ∧ (700 : ℝ) < 1200 := by norm_num

/-- Razlaga 1 (tabela): f(−5) = −225 < 0, f(0) = 400 > 0, f(5) = −225 < 0 za f(x) = 400 − 25x²; ničli ±4.
trditev: MAT-SS-2/kvadratna-neenacba#prelaz-tabela
besedilo: »| $x < -4$ | $f(-5) = -225 < 0$ | | $-4 < x < 4$ | $f(0) = 400 > 0$ | | $x > 4$ | $f(5) = -225 < 0$ |« -/
theorem prelaz_tabela : 400 - 25 * (-5 : ℝ) ^ 2 = -225 ∧ 400 - 25 * (0 : ℝ) ^ 2 = 400 ∧
    400 - 25 * (5 : ℝ) ^ 2 = -225 ∧ ∀ x : ℝ, 400 - 25 * x ^ 2 = 0 ↔ x = -4 ∨ x = 4 := by
  refine ⟨by norm_num, by norm_num, by norm_num, fun x => ?_⟩
  have e : 400 - 25 * x ^ 2 = -25 * ((x - -4) * (x - 4)) := by ring
  rw [e, mul_eq_zero, or_iff_right (by norm_num), mul_eq_zero, sub_eq_zero, sub_eq_zero]

/-- Razlaga 1, premisli: 1600 − 25x² > 1700 ⇔ −25x² − 100 > 0, kar nima rešitve (najvišja točka je 1600).
trditev: MAT-SS-2/kvadratna-neenacba#prelaz-1700
besedilo: »Rešitve ni. Najvišja točka ceste je vrh prelaza na $1600\,\text{m}$. Neenačba $1600 - 25x^2 > 1700$ da $-25x^2 - 100 > 0$; parabola $-25x^2 - 100$ je odprta navzdol z vrhom pri $-100$, zato je ves graf pod osjo.« -/
theorem prelaz_1700 : (∀ x : ℝ, 1600 - 25 * x ^ 2 > 1700 ↔ -25 * x ^ 2 - 100 > 0) ∧
    {x : ℝ | 1600 - 25 * x ^ 2 > 1700} = ∅ ∧ ∀ x : ℝ, 1600 - 25 * x ^ 2 ≤ 1600 := by
  refine ⟨fun x => by constructor <;> intro h <;> linarith, ?_, fun x => by nlinarith [sq_nonneg x]⟩
  refine eq_empty_iff_forall_notMem.2 fun x hx => ?_
  have hx' : 1600 - 25 * x ^ 2 > 1700 := hx
  nlinarith [sq_nonneg x]

/-- Razlaga 7 (simulacija, a = 1, b = −4): pri c = 3 je rešitev x² − 4x + 3 < 0 interval (1, 3); pri
c = 4 (D = 0) je x² − 4x + 4 < 0 brez rešitve, x² − 4x + 4 ≤ 0 pa velja le za x = 2.
trditev: MAT-SS-2/kvadratna-neenacba#simulacija
besedilo: »pri $c = 4$ (ko je $D = 0$) izgine. Pri znaku »$\le 0$« ostane pri $c = 4$ ena sama točka.« -/
theorem simulacija (x : ℝ) : (x ^ 2 - 4 * x + 3 < 0 ↔ 1 < x ∧ x < 3) ∧ (-4 : ℝ) ^ 2 - 4 * 1 * 4 = 0 ∧
    ¬ x ^ 2 - 4 * x + 4 < 0 ∧ (x ^ 2 - 4 * x + 4 ≤ 0 ↔ x = 2) := by
  have e3 : x ^ 2 - 4 * x + 3 = 1 * (x - 1) * (x - 3) := by ring
  have e4 : x ^ 2 - 4 * x + 4 = 1 * (x - 2) ^ 2 := by ring
  refine ⟨by rw [e3]; exact (med_nicla 1 1 3 x one_pos (by norm_num)).2.2.1, by norm_num, ?_, ?_⟩
  · rw [e4]; exact (dvojna_nicla 1 2 x one_pos).2.2.1
  · rw [e4]; exact (dvojna_nicla 1 2 x one_pos).2.2.2

/-- Razlaga 7 (simulacija, splošno): za c < 4 je x² − 4x + c < 0 ⇔ 2 − √(4 − c) < x < 2 + √(4 − c);
dolžina intervala 2√(4 − c) z večjim c pada (interval se krči), pri c ≥ 4 rešitve ni.
trditev: MAT-SS-2/kvadratna-neenacba#simulacija-splosno
besedilo: »z večjim $c$ se krči, pri $c = 4$ (ko je $D = 0$) izgine« -/
theorem simulacija_splosno :
    (∀ c x : ℝ, c < 4 →
      (x ^ 2 - 4 * x + c < 0 ↔ 2 - Real.sqrt (4 - c) < x ∧ x < 2 + Real.sqrt (4 - c))) ∧
    (∀ c c' : ℝ, c < c' → c' ≤ 4 → 2 * Real.sqrt (4 - c') < 2 * Real.sqrt (4 - c)) ∧
    (∀ c x : ℝ, 4 ≤ c → ¬ x ^ 2 - 4 * x + c < 0) := by
  refine ⟨fun c x hc => ?_, fun c c' h h' => ?_, fun c x hc h => by nlinarith [sq_nonneg (x - 2)]⟩
  · have hs : Real.sqrt (4 - c) ^ 2 = 4 - c := Real.sq_sqrt (by linarith)
    have hpos : 0 < Real.sqrt (4 - c) := Real.sqrt_pos.2 (by linarith)
    have e : x ^ 2 - 4 * x + c = 1 * (x - (2 - Real.sqrt (4 - c))) * (x - (2 + Real.sqrt (4 - c))) := by
      linear_combination hs
    rw [e]
    exact (med_nicla 1 _ _ x one_pos (by linarith)).2.2.1
  · have := Real.sqrt_lt_sqrt (by linarith : (0 : ℝ) ≤ 4 - c') (by linarith : 4 - c' < 4 - c)
    linarith

/-- Razlaga 8: −x² + 4 > 0 ⇔ x² − 4 < 0 (množenje z −1 obrne neenačaj).
trditev: MAT-SS-2/kvadratna-neenacba#razlaga8
besedilo: »Pri tem **obrni neenačaj**: iz $-x^2 + 4 > 0$ dobiš $x^2 - 4 < 0$.« -/
theorem razlaga8 (x : ℝ) : -x ^ 2 + 4 > 0 ↔ x ^ 2 - 4 < 0 := by
  constructor <;> intro h <;> linarith

/-! ## Rešeni primeri -/

/-- Primer 1: D = (−1)² − 4·1·(−6) = 1 + 24 = 25, x = (1 ± 5)/2: −2 in 3; x² − x − 6 < 0 ⇔ −2 < x < 3.
trditev: MAT-SS-2/kvadratna-neenacba#primer1
besedilo: »Odgovor: rešitev neenačbe je interval $(-2, 3)$.« -/
theorem primer1 (x : ℝ) : ((-1 : ℝ) ^ 2 - 4 * 1 * (-6) = 1 + 24 ∧ (1 : ℝ) + 24 = 25) ∧
    ((1 - 5) / 2 = (-2 : ℝ) ∧ (1 + 5) / 2 = (3 : ℝ)) ∧ (x ^ 2 - x - 6 < 0 ↔ -2 < x ∧ x < 3) := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  rw [show x ^ 2 - x - 6 = 1 * (x - -2) * (x - 3) by ring]
  exact (med_nicla 1 (-2) 3 x one_pos (by norm_num)).2.2.1

/-- Primer 1, korak 5 (preizkus): 0 − 0 − 6 = −6 < 0; za x = 4 je 16 − 4 − 6 = 6, kar ni < 0.
trditev: MAT-SS-2/kvadratna-neenacba#primer1-preizkus
besedilo: »Preizkus s številom iz intervala, na primer $x = 0$: $0 - 0 - 6 = -6 < 0$. Velja. Za $x = 4$: $16 - 4 - 6 = 6$, kar ni manjše od $0$, in $4$ res ni v rešitvi.« -/
theorem primer1_preizkus : (0 : ℝ) ^ 2 - 0 - 6 = -6 ∧ (-6 : ℝ) < 0 ∧ (4 : ℝ) ^ 2 - 4 - 6 = 6 ∧
    ¬ (6 : ℝ) < 0 := by norm_num

/-- Primer 2: D = 5² − 4·(−2)·3 = 25 + 24 = 49, x = (−5 ± 7)/(−4): 2/(−4) = −1/2 in −12/(−4) = 3;
−2x² + 5x + 3 ≥ 0 ⇔ −1/2 ≤ x ≤ 3.
trditev: MAT-SS-2/kvadratna-neenacba#primer2
besedilo: »Diskriminanta: $D = 5^2 - 4 \cdot (-2) \cdot 3 = 25 + 24 = 49$. 2. Ničli: $x_{1,2} = \dfrac{-5 \pm 7}{2 \cdot (-2)} = \dfrac{-5 \pm 7}{-4}$. Torej $x_1 = \dfrac{2}{-4} = -\dfrac{1}{2}$ in $x_2 = \dfrac{-12}{-4} = 3$. 3. Ker je $a = -2 < 0$, je parabola odprta navzdol. Nad osjo $x$ je med ničlama. 4. Neenačaj je nestrog, zato ničli spadata v rešitev: $x \in \left[-\dfrac{1}{2}, 3\right]$.« -/
theorem primer2 (x : ℝ) : ((5 : ℝ) ^ 2 - 4 * (-2) * 3 = 25 + 24 ∧ (25 : ℝ) + 24 = 49) ∧
    ((-5 + 7) / (2 * (-2)) = (2 : ℝ) / (-4) ∧ (2 : ℝ) / (-4) = -1 / 2 ∧
      (-5 - 7) / (2 * (-2)) = (-12 : ℝ) / (-4) ∧ (-12 : ℝ) / (-4) = 3) ∧
    (-2 * x ^ 2 + 5 * x + 3 ≥ 0 ↔ -1 / 2 ≤ x ∧ x ≤ 3) := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  rw [ge_iff_le, show -2 * x ^ 2 + 5 * x + 3 = -2 * (x - -1 / 2) * (x - 3) by ring]
  exact (med_nicla_neg (-2) (-1 / 2) 3 x (by norm_num) (by norm_num)).2.1

/-- Primer 2, koraka 5–7: cele rešitve so natanko 0, 1, 2, 3 (štiri); preizkus f(3) = −18 + 15 + 3 = 0,
f(−1) = −2 − 5 + 3 = −4 < 0.
trditev: MAT-SS-2/kvadratna-neenacba#primer2-cela
besedilo: »Cela števila v tem intervalu so $0$, $1$, $2$ in $3$ (število $-1$ je manjše od $-\dfrac{1}{2}$). 6. Preizkus: za $x = 3$ je $-18 + 15 + 3 = 0 \ge 0$, za $x = -1$ pa $-2 - 5 + 3 = -4 < 0$, zato $-1$ res ni rešitev.« -/
theorem primer2_cela : {n : ℤ | 0 ≤ -2 * n ^ 2 + 5 * n + 3} = Icc 0 3 ∧ (Finset.Icc (0 : ℤ) 3).card = 4 ∧
    (-2 * (3 : ℝ) ^ 2 + 5 * 3 + 3 = -18 + 15 + 3 ∧ (-18 : ℝ) + 15 + 3 = 0) ∧
    (-2 * (-1 : ℝ) ^ 2 + 5 * (-1) + 3 = -2 - 5 + 3 ∧ (-2 : ℝ) - 5 + 3 = -4) := by
  refine ⟨?_, by simp, by norm_num, by norm_num⟩
  ext n
  show 0 ≤ -2 * n ^ 2 + 5 * n + 3 ↔ 0 ≤ n ∧ n ≤ 3
  constructor
  · intro h
    constructor
    · by_contra hn
      push Not at hn
      nlinarith [mul_pos (by linarith : (0 : ℤ) < -(2 * n + 1)) (by linarith : (0 : ℤ) < 3 - n)]
    · by_contra hn
      push Not at hn
      nlinarith [mul_pos (by linarith : (0 : ℤ) < 2 * n + 1) (by linarith : (0 : ℤ) < n - 3)]
  · rintro ⟨h1, h2⟩
    nlinarith [mul_nonneg (by linarith : (0 : ℤ) ≤ 2 * n + 1) (by linarith : (0 : ℤ) ≤ 3 - n)]

/-- Primer 3, koraki 1–4: 0,001v² − 0,16v + 11 < 5,5 ⇔ 0,001v² − 0,16v + 5,5 < 0 ⇔ v² − 160v + 5500 < 0
(množenje s 1000 > 0); D = 160² − 4·5500 = 25600 − 22000 = 3600, v = (160 ± 60)/2: 50 in 110;
rešitev (50, 110) leži v območju modela [30, 130].
trditev: MAT-SS-2/kvadratna-neenacba#primer3
besedilo: »Prva neenačba: $0{,}001v^2 - 0{,}16v + 11 < 5{,}5$. Vse prenesemo na levo: $0{,}001v^2 - 0{,}16v + 5{,}5 < 0$. 2. Pomnožimo s $1000$, da se znebimo decimalk; število je pozitivno, zato neenačaj ostane: $v^2 - 160v + 5500 < 0$. 3. Diskriminanta: $D = 160^2 - 4 \cdot 5500 = 25600 - 22000 = 3600$, ničli $v_{1,2} = \dfrac{160 \pm 60}{2}$, torej $v_1 = 50$ in $v_2 = 110$. 4. Parabola $v^2 - 160v + 5500$ je odprta navzgor, pod osjo je med ničlama: $v \in (50, 110)$. Interval leži v območju modela.« -/
theorem primer3 (v : ℝ) : (0.001 * v ^ 2 - 0.16 * v + 11 < 5.5 ↔ 0.001 * v ^ 2 - 0.16 * v + 5.5 < 0) ∧
    (0.001 * v ^ 2 - 0.16 * v + 5.5 < 0 ↔ v ^ 2 - 160 * v + 5500 < 0) ∧
    ((160 : ℝ) ^ 2 - 4 * 5500 = 25600 - 22000 ∧ (25600 : ℝ) - 22000 = 3600) ∧
    ((160 - 60) / 2 = (50 : ℝ) ∧ (160 + 60) / 2 = (110 : ℝ)) ∧
    (v ^ 2 - 160 * v + 5500 < 0 ↔ 50 < v ∧ v < 110) ∧ Icc (50 : ℝ) 110 ⊆ Icc 30 130 := by
  refine ⟨by constructor <;> intro h <;> linarith, by constructor <;> intro h <;> linarith,
    by norm_num, by norm_num, ?_, Icc_subset_Icc (by norm_num) (by norm_num)⟩
  rw [show v ^ 2 - 160 * v + 5500 = 1 * (v - 50) * (v - 110) by ring]
  exact (med_nicla 1 50 110 v one_pos (by norm_num)).2.2.1

/-- Primer 3, korak 5: p(80) = 6,4 − 12,8 + 11 = 4,6 < 5,5.
trditev: MAT-SS-2/kvadratna-neenacba#primer3-preizkus
besedilo: »$p(80) = 6{,}4 - 12{,}8 + 11 = 4{,}6 < 5{,}5$« -/
theorem primer3_preizkus : 0.001 * (80 : ℝ) ^ 2 - 0.16 * 80 + 11 = 6.4 - 12.8 + 11 ∧
    (6.4 : ℝ) - 12.8 + 11 = 4.6 ∧ (4.6 : ℝ) < 5.5 := by norm_num

/-- Primer 3, korak 6 in premisli: p(v) < 4,5 ⇔ v² − 160v + 6500 < 0; D = 25600 − 26000 = −400 < 0, rešitve
ni; najmanjša poraba je 4,6 pri 80 km/h.
trditev: MAT-SS-2/kvadratna-neenacba#primer3-45
besedilo: »Nima. $D = 25600 - 26000 = -400 < 0$, parabola je odprta navzgor in je vsa nad osjo. Odgovor: avto porabi manj kot $5{,}5\,\text{L}/100\,\text{km}$ pri hitrostih med $50$ in $110\,\text{km/h}$, pod $4{,}5\,\text{L}$ pa ne pride nikoli. Najmanjša poraba je $4{,}6\,\text{L}/100\,\text{km}$ pri $80\,\text{km/h}$ (teme parabole).« -/
theorem primer3_45 : (∀ v : ℝ, 0.001 * v ^ 2 - 0.16 * v + 11 < 4.5 ↔ v ^ 2 - 160 * v + 6500 < 0) ∧
    ((160 : ℝ) ^ 2 - 4 * 6500 = 25600 - 26000 ∧ (25600 : ℝ) - 26000 = -400) ∧
    (∀ v : ℝ, ¬ v ^ 2 - 160 * v + 6500 < 0) ∧ ∀ v : ℝ, 4.6 ≤ 0.001 * v ^ 2 - 0.16 * v + 11 := by
  refine ⟨fun v => by constructor <;> intro h <;> linarith, by norm_num, fun v h => ?_,
    fun v => by nlinarith [sq_nonneg (v - 80)]⟩
  have := (D_neg_predznak 1 (-160) 6500 (by norm_num)).1 one_pos v
  linarith

/-! ## Pogoste napake -/

/-- Pogoste napake 1 in 4: −x² + 9 > 0 ⇔ x² − 9 < 0 ⇔ −3 < x < 3 (ne x² − 9 > 0).
trditev: MAT-SS-2/kvadratna-neenacba#napaka-obrat
besedilo: »Iz $-x^2 + 9 > 0$ ne dobiš $x^2 - 9 > 0$. Pri množenju ali deljenju z negativnim številom se neenačaj obrne: $x^2 - 9 < 0$, rešitev je $(-3, 3)$.« -/
theorem napaka_obrat (x : ℝ) : (-x ^ 2 + 9 > 0 ↔ x ^ 2 - 9 < 0) ∧ (x ^ 2 - 9 < 0 ↔ -3 < x ∧ x < 3) := by
  refine ⟨by constructor <;> intro h <;> linarith, ?_⟩
  rw [show x ^ 2 - 9 = 1 * (x - -3) * (x - 3) by ring]
  exact (med_nicla 1 (-3) 3 x one_pos (by norm_num)).2.2.1

/-- Pogoste napake 2, Ponovitev: x² > 9 ⇔ x < −3 ali x > 3 (ne le x > 3: (−4)² = 16 > 9).
trditev: MAT-SS-2/kvadratna-neenacba#napaka-korenjenje
besedilo: »Pozabil si na negativna števila: tudi $(-4)^2 = 16 > 9$. Pravilno: $x^2 - 9 > 0$, ničli $-3$ in $3$, rešitev $(-\infty, -3) \cup (3, \infty)$.« -/
theorem napaka_korenjenje (x : ℝ) : (x ^ 2 > 9 ↔ x < -3 ∨ 3 < x) ∧ (-4 : ℝ) ^ 2 = 16 ∧ (16 : ℝ) > 9 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  rw [gt_iff_lt, ← sub_pos (a := x ^ 2) (b := 9), show x ^ 2 - 9 = 1 * (x - -3) * (x - 3) by ring]
  exact (med_nicla 1 (-3) 3 x one_pos (by norm_num)).1

/-- Pogoste napake 3: x² > 2x ⇔ x² − 2x > 0 ⇔ x < 0 ali x > 2; x = −1 je rešitev (1 > −2).
trditev: MAT-SS-2/kvadratna-neenacba#napaka-deljenje
besedilo: »Pravilno: $x^2 - 2x > 0$, ničli $0$ in $2$, rešitev $(-\infty, 0) \cup (2, \infty)$. Na primer $x = -1$: $1 > -2$ velja.« -/
theorem napaka_deljenje (x : ℝ) : (x ^ 2 > 2 * x ↔ x < 0 ∨ 2 < x) ∧ (-1 : ℝ) ^ 2 > 2 * (-1) := by
  refine ⟨?_, by norm_num⟩
  rw [gt_iff_lt, ← sub_pos (a := x ^ 2) (b := 2 * x), show x ^ 2 - 2 * x = 1 * (x - 0) * (x - 2) by ring]
  exact (med_nicla 1 0 2 x one_pos (by norm_num)).1

/-- Pogoste napake 5: x² + x + 1 > 0 ima D = −3, a velja za vse realne x.
trditev: MAT-SS-2/kvadratna-neenacba#napaka-d-neg
besedilo: »Neenačba $x^2 + x + 1 > 0$ ima $D = -3$, a velja za **vse** realne $x$, ker je parabola ves čas nad osjo.« -/
theorem napaka_D_neg : (1 : ℝ) ^ 2 - 4 * 1 * 1 = -3 ∧ ∀ x : ℝ, x ^ 2 + x + 1 > 0 := by
  refine ⟨by norm_num, fun x => ?_⟩
  have := (D_neg_predznak 1 1 1 (by norm_num)).1 one_pos x
  linarith

/-! ## Za maturo -/

/-- Za maturo, naloga 1: 2x² ≥ x + 6 ⇔ 2x² − x − 6 ≥ 0; D = (−1)² − 4·2·(−6) = 49, x = (1 ± 7)/4: −3/2 in 2;
rešitev (−∞, −3/2] ∪ [2, ∞).
trditev: MAT-SS-2/kvadratna-neenacba#matura1
besedilo: »Vse prenesemo na levo: $2x^2 - x - 6 \ge 0$. 2. $D = (-1)^2 - 4 \cdot 2 \cdot (-6) = 49$, $x_{1,2} = \dfrac{1 \pm 7}{4}$, torej $x_1 = -\dfrac{3}{2}$ in $x_2 = 2$. 3. Ker je $a = 2 > 0$, je parabola odprta navzgor in je nad osjo $x$ zunaj ničel. 4. Neenačaj je nestrog, zato ničli spadata v rešitev. 5. Odgovor: $x \in \left(-\infty, -\dfrac{3}{2}\right] \cup [2, \infty)$.« -/
theorem matura1 (x : ℝ) : (2 * x ^ 2 ≥ x + 6 ↔ 2 * x ^ 2 - x - 6 ≥ 0) ∧ (-1 : ℝ) ^ 2 - 4 * 2 * (-6) = 49 ∧
    ((1 - 7) / 4 = (-3 / 2 : ℝ) ∧ (1 + 7) / 4 = (2 : ℝ)) ∧
    (2 * x ^ 2 ≥ x + 6 ↔ x ≤ -3 / 2 ∨ 2 ≤ x) := by
  refine ⟨by constructor <;> intro h <;> linarith, by norm_num, by norm_num, ?_⟩
  rw [ge_iff_le, ← sub_nonneg (a := 2 * x ^ 2) (b := x + 6), show 2 * x ^ 2 - (x + 6) = 2 * (x - -3 / 2) * (x - 2) by ring]
  exact (med_nicla 2 (-3 / 2) 2 x (by norm_num) (by norm_num)).2.1

/-- Za maturo, naloga 2 a): x² − 2x − 3 = (x + 1)(x − 3) > 0 ⇔ x < −1 ali x > 3.
trditev: MAT-SS-2/kvadratna-neenacba#matura2a
besedilo: »a) $x^2 - 2x - 3 = (x + 1)(x - 3)$, ničli sta $-1$ in $3$. 2. a) Parabola je odprta navzgor, nad osjo je zunaj ničel; neenačaj je strog: $x \in (-\infty, -1) \cup (3, \infty)$.« -/
theorem matura2a (x : ℝ) : x ^ 2 - 2 * x - 3 = (x + 1) * (x - 3) ∧ (0 < x ^ 2 - 2 * x - 3 ↔ x < -1 ∨ 3 < x) := by
  refine ⟨by ring, ?_⟩
  rw [show x ^ 2 - 2 * x - 3 = 1 * (x - -1) * (x - 3) by ring]
  exact (med_nicla 1 (-1) 3 x one_pos (by norm_num)).1

/-- Za maturo, naloga 2 b): x² − 2x + c > 0 za vse x ⇔ D = 4 − 4c < 0 ⇔ c > 1; pri c = 1 je
f(x) = (x − 1)², f(1) = 0, rešitev x² − 2x + 1 > 0 je (−∞, 1) ∪ (1, ∞).
trditev: MAT-SS-2/kvadratna-neenacba#matura2b
besedilo: »b) Parabola je odprta navzgor, zato je ves graf nad osjo $x$ natanko tedaj, ko nima realnih ničel, torej pri $D < 0$. 4. b) $D = 4 - 4c < 0$ da $c > 1$. (Pri $c = 1$ je $f(x) = (x - 1)^2$ in $f(1) = 0$, zato $c = 1$ ne ustreza.)« -/
theorem matura2b (c : ℝ) : ((∀ x : ℝ, 0 < x ^ 2 - 2 * x + c) ↔ 1 < c) ∧ ((-2 : ℝ) ^ 2 - 4 * 1 * c = 4 - 4 * c) ∧
    (4 - 4 * c < 0 ↔ 1 < c) ∧ (1 : ℝ) ^ 2 - 2 * 1 + 1 = 0 ∧
    ∀ x : ℝ, 0 < x ^ 2 - 2 * x + 1 ↔ x < 1 ∨ 1 < x := by
  refine ⟨⟨fun h => ?_, fun h x => by nlinarith [sq_nonneg (x - 1)]⟩, by ring,
    by constructor <;> intro h <;> linarith, by norm_num, fun x => ?_⟩
  · have := h 1; linarith
  · rw [show x ^ 2 - 2 * x + 1 = 1 * (x - 1) ^ 2 by ring, (dvojna_nicla 1 1 x one_pos).1]
    constructor
    · exact fun h => lt_or_gt_of_ne h
    · rintro (h | h)
      · exact h.ne
      · exact h.ne'

/-- Pomožno (Naloga 2 c): za c ≤ 1 je rešitev x² − 2x + c ≤ 0 interval [1 − √(1 − c), 1 + √(1 − c)]
s središčem v osi x = 1; za c > 1 je prazna.
pomozno -/
theorem resitev_le (c : ℝ) :
    (c ≤ 1 → {x : ℝ | x ^ 2 - 2 * x + c ≤ 0} = Icc (1 - Real.sqrt (1 - c)) (1 + Real.sqrt (1 - c))) ∧
      (1 < c → {x : ℝ | x ^ 2 - 2 * x + c ≤ 0} = ∅) := by
  refine ⟨fun hc => ?_, fun hc => ?_⟩
  · have hs : Real.sqrt (1 - c) ^ 2 = 1 - c := Real.sq_sqrt (by linarith)
    have h0 : 0 ≤ Real.sqrt (1 - c) := Real.sqrt_nonneg _
    ext x
    show x ^ 2 - 2 * x + c ≤ 0 ↔ 1 - Real.sqrt (1 - c) ≤ x ∧ x ≤ 1 + Real.sqrt (1 - c)
    constructor
    · intro h
      constructor
      · by_contra hx
        push Not at hx
        nlinarith [mul_pos (by linarith : 0 < 1 - Real.sqrt (1 - c) - x)
          (by linarith : 0 < 1 + Real.sqrt (1 - c) - x)]
      · by_contra hx
        push Not at hx
        nlinarith [mul_pos (by linarith : 0 < x - (1 - Real.sqrt (1 - c)))
          (by linarith : 0 < x - (1 + Real.sqrt (1 - c)))]
    · rintro ⟨h1, h2⟩
      nlinarith [mul_nonneg (by linarith : 0 ≤ x - (1 - Real.sqrt (1 - c)))
        (by linarith : 0 ≤ 1 + Real.sqrt (1 - c) - x)]
  · refine eq_empty_iff_forall_notMem.2 fun x hx => ?_
    have hx' : x ^ 2 - 2 * x + c ≤ 0 := hx
    nlinarith [sq_nonneg (x - 1)]

/-- Za maturo, naloga 2 c): rešitev x² − 2x + c ≤ 0 je zaprt interval [u, u + 6] dolžine 6 natanko pri
c = −8 in u = −2, torej interval [−2, 4]; os x = −(−2)/2 = 1, ničli −2 in 4 = 1 ∓ 3, Vieta
c = (−2)·4 = −8, x² − 2x − 8 = (x + 2)(x − 4).
trditev: MAT-SS-2/kvadratna-neenacba#matura2c
besedilo: »c) Rešitev $f(x) \le 0$ je interval med ničlama. Ničli sta simetrični glede na os parabole $x = -\dfrac{-2}{2} = 1$. 6. c) Interval dolžine $6$ s središčem $1$ je $[-2, 4]$, zato sta ničli $-2$ in $4$. 7. c) Po Vietu je $c = x_1 x_2 = (-2) \cdot 4 = -8$. Preverjanje: $x^2 - 2x - 8 = (x + 2)(x - 4)$.« -/
theorem matura2c (c u : ℝ) : ({x : ℝ | x ^ 2 - 2 * x + c ≤ 0} = Icc u (u + 6) ↔ c = -8 ∧ u = -2) ∧
    -(-2 : ℝ) / 2 = 1 ∧ ((1 : ℝ) - 3 = -2 ∧ (1 : ℝ) + 3 = 4) ∧ (-2 : ℝ) * 4 = -8 ∧
    (∀ x : ℝ, x ^ 2 - 2 * x - 8 = (x + 2) * (x - 4)) ∧ ((-2 : ℝ) ^ 2 - 2 * (-2) + c = 0 ↔ c = -8) := by
  refine ⟨⟨fun h => ?_, ?_⟩, by norm_num, by norm_num, by norm_num, fun x => by ring,
    by constructor <;> intro h <;> linarith⟩
  · by_cases hc : c ≤ 1
    · rw [(resitev_le c).1 hc] at h
      have h0 : 0 ≤ Real.sqrt (1 - c) := Real.sqrt_nonneg _
      obtain ⟨e1, e2⟩ := (Icc_eq_Icc_iff (by linarith)).1 h
      have h3 : Real.sqrt (1 - c) = 3 := by linarith
      have hs : Real.sqrt (1 - c) ^ 2 = 1 - c := Real.sq_sqrt (by linarith)
      rw [h3] at hs
      exact ⟨by linarith, by linarith⟩
    · push Not at hc
      have hu : u ∈ Icc u (u + 6) := ⟨le_rfl, by linarith⟩
      rw [← h, (resitev_le c).2 hc] at hu
      exact absurd hu (notMem_empty u)
  · rintro ⟨rfl, rfl⟩
    rw [(resitev_le (-8)).1 (by norm_num), show (1 : ℝ) - -8 = 3 ^ 2 by norm_num,
      Real.sqrt_sq (by norm_num)]
    norm_num

/-- Za maturo, naloga 3 a): reakcijski del 15/50 = 0,3 na km/h, zavorni 20/50² = 20/2500 = 0,008; iz
d_r(v) = k·v, d_r(50) = 15 sledi k = 0,3, iz d_z(v) = m·v², d_z(50) = 20 sledi m = 0,008.
trditev: MAT-SS-2/kvadratna-neenacba#matura3a
besedilo: »a) Pot v reakcijskem času je sorazmerna z $v$: na vsak $\text{km/h}$ je $\dfrac{15}{50} = 0{,}3\,\text{m}$, torej $0{,}3v$. 2. a) Zavorna pot je sorazmerna z $v^2$: koeficient je $\dfrac{20}{50^2} = \dfrac{20}{2500} = 0{,}008$, torej $0{,}008v^2$. Skupaj $d(v) = 0{,}3v + 0{,}008v^2$.« -/
theorem matura3a (k m : ℝ) : ((15 : ℝ) / 50 = 0.3 ∧ (20 : ℝ) / 50 ^ 2 = 20 / 2500 ∧ (20 : ℝ) / 2500 = 0.008) ∧
    (k * 50 = 15 ↔ k = 0.3) ∧ (m * 50 ^ 2 = 20 ↔ m = 0.008) := by
  refine ⟨by norm_num, by constructor <;> intro h <;> linarith, by constructor <;> intro h <;> linarith⟩

/-- Za maturo, naloga 3 b): 0,008v² + 0,3v < 60 ⇔ v² + 37,5v − 7500 < 0 (·125); D = 37,5² + 4·7500 =
31406,25 = (25√201/2)²; ničli (−37,5 ± √31406,25)/2 ≈ −107,359 in 69,859; za v ≥ 0 se avto ustavi pred
oviro natanko pri 0 ≤ v < 69,859… (približno do 69,9 km/h). Za vse realne v (Razlaga 5):
0,008v² + 0,3v < 60 ⇔ v₁ < v < v₂.
trditev: MAT-SS-2/kvadratna-neenacba#matura3b
besedilo: »b) Iščemo $v \ge 0$, za katere je $0{,}008v^2 + 0{,}3v < 60$. Pomnožimo s $125$ (pozitivno število): $v^2 + 37{,}5v - 7500 < 0$. 4. b) $D = 37{,}5^2 + 4 \cdot 7500 = 31406{,}25$, $v_{1,2} = \dfrac{-37{,}5 \pm \sqrt{31406{,}25}}{2}$, torej $v_1 \approx -107{,}359$ in $v_2 \approx 69{,}859$. 5. b) Parabola je odprta navzgor, pod osjo je med ničlama: $v_1 < v < v_2$. 6. b) Hitrost ni negativna, zato se avtomobil ustavi pred oviro pri $0 \le v < 69{,}859\,\text{km/h}$, torej pri hitrostih do približno $69{,}9\,\text{km/h}$.« -/
theorem matura3b : (∀ v : ℝ, 0.008 * v ^ 2 + 0.3 * v < 60 ↔ v ^ 2 + 37.5 * v - 7500 < 0) ∧
    (∀ v : ℝ, 0.008 * v ^ 2 + 0.3 * v < 60 ↔
      (-37.5 - Real.sqrt 31406.25) / 2 < v ∧ v < (-37.5 + Real.sqrt 31406.25) / 2) ∧
    (37.5 : ℝ) ^ 2 + 4 * 7500 = 31406.25 ∧ Real.sqrt 31406.25 = 25 * Real.sqrt 201 / 2 ∧
    (∀ v : ℝ, 0 ≤ v → (0.008 * v ^ 2 + 0.3 * v < 60 ↔ v < (-37.5 + Real.sqrt 31406.25) / 2)) ∧
    |(-37.5 + Real.sqrt 31406.25) / 2 - 69.859| < 0.0005 ∧
    |(-37.5 - Real.sqrt 31406.25) / 2 - (-107.359)| < 0.0005 ∧
    |(-37.5 + Real.sqrt 31406.25) / 2 - 69.9| < 0.05 := by
  have hs : Real.sqrt 31406.25 ^ 2 = 31406.25 := Real.sq_sqrt (by norm_num)
  have h1 : (177.218 : ℝ) < Real.sqrt 31406.25 := Real.lt_sqrt_of_sq_lt (by norm_num)
  have h2 : Real.sqrt 31406.25 < 177.2182 := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  have full : ∀ v : ℝ, 0.008 * v ^ 2 + 0.3 * v < 60 ↔
      (-37.5 - Real.sqrt 31406.25) / 2 < v ∧ v < (-37.5 + Real.sqrt 31406.25) / 2 := fun v => by
    have e : 0.008 * v ^ 2 + 0.3 * v - 60 = 0.008 * (v - (-37.5 - Real.sqrt 31406.25) / 2) *
        (v - (-37.5 + Real.sqrt 31406.25) / 2) := by linear_combination (0.002) * hs
    have key := (med_nicla 0.008 ((-37.5 - Real.sqrt 31406.25) / 2) ((-37.5 + Real.sqrt 31406.25) / 2) v
      (by norm_num) (by linarith)).2.2.1
    rw [← e, sub_neg] at key
    exact key
  refine ⟨fun v => by constructor <;> intro h <;> linarith, full, by norm_num, ?_, fun v hv => ?_, ?_, ?_,
    ?_⟩
  · calc Real.sqrt 31406.25 = Real.sqrt ((25 / 2) ^ 2 * 201) := by norm_num
      _ = 25 * Real.sqrt 201 / 2 := by
        rw [Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]; ring
  · rw [full v]
    constructor
    · exact fun h => h.2
    · exact fun h => ⟨by linarith, h⟩
  all_goals (rw [abs_lt]; constructor <;> linarith)

/-- Za maturo, naloga 3 c): mokra cesta: 1,5·0,008 = 0,012, d_m(v) = 0,3v + 0,012v²; 0,012v² + 0,3v < 60
⇔ v² + 25v − 5000 < 0 (·250/3); D = 625 + 20000 = 20625 = (25√33)²; za v ≥ 0 se avto ustavi natanko pri
v < (−25 + √20625)/2 ≈ 59,307 ≈ 59,3 km/h. Za vse realne v: 0,012v² + 0,3v < 60 ⇔
(−25 − √20625)/2 < v < (−25 + √20625)/2.
trditev: MAT-SS-2/kvadratna-neenacba#matura3c
besedilo: »c) Zavorna pot je $1{,}5 \cdot 0{,}008v^2 = 0{,}012v^2$, zato $d_m(v) = 0{,}3v + 0{,}012v^2$. 8. c) Neenačba $0{,}012v^2 + 0{,}3v < 60$ po množenju z $\dfrac{250}{3}$ da $v^2 + 25v - 5000 < 0$; $D = 625 + 20000 = 20625$. 9. c) Pozitivna ničla je $v = \dfrac{-25 + \sqrt{20625}}{2} \approx 59{,}307$, zato se avtomobil ustavi pri $0 \le v < 59{,}3\,\text{km/h}$.« -/
theorem matura3c : (1.5 : ℝ) * 0.008 = 0.012 ∧
    (∀ v : ℝ, 0.012 * v ^ 2 + 0.3 * v < 60 ↔ v ^ 2 + 25 * v - 5000 < 0) ∧
    (∀ v : ℝ, 0.012 * v ^ 2 + 0.3 * v < 60 ↔
      (-25 - Real.sqrt 20625) / 2 < v ∧ v < (-25 + Real.sqrt 20625) / 2) ∧
    ((25 : ℝ) ^ 2 + 4 * 5000 = 625 + 20000 ∧ (625 : ℝ) + 20000 = 20625) ∧
    Real.sqrt 20625 = 25 * Real.sqrt 33 ∧
    (∀ v : ℝ, 0 ≤ v → (0.012 * v ^ 2 + 0.3 * v < 60 ↔ v < (-25 + Real.sqrt 20625) / 2)) ∧
    |(-25 + Real.sqrt 20625) / 2 - 59.307| < 0.0005 ∧ |(-25 + Real.sqrt 20625) / 2 - 59.3| < 0.05 := by
  have hs : Real.sqrt 20625 ^ 2 = 20625 := Real.sq_sqrt (by norm_num)
  have h1 : (143.614 : ℝ) < Real.sqrt 20625 := Real.lt_sqrt_of_sq_lt (by norm_num)
  have h2 : Real.sqrt 20625 < 143.6141 := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  have full : ∀ v : ℝ, 0.012 * v ^ 2 + 0.3 * v < 60 ↔
      (-25 - Real.sqrt 20625) / 2 < v ∧ v < (-25 + Real.sqrt 20625) / 2 := fun v => by
    have e : 0.012 * v ^ 2 + 0.3 * v - 60 = 0.012 * (v - (-25 - Real.sqrt 20625) / 2) *
        (v - (-25 + Real.sqrt 20625) / 2) := by linear_combination (0.003) * hs
    have key := (med_nicla 0.012 ((-25 - Real.sqrt 20625) / 2) ((-25 + Real.sqrt 20625) / 2) v
      (by norm_num) (by linarith)).2.2.1
    rw [← e, sub_neg] at key
    exact key
  refine ⟨by norm_num, fun v => by constructor <;> intro h <;> linarith, full, by norm_num, ?_,
    fun v hv => ?_, ?_, ?_⟩
  · calc Real.sqrt 20625 = Real.sqrt (25 ^ 2 * 33) := by norm_num
      _ = 25 * Real.sqrt 33 := by rw [Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  · rw [full v]
    constructor
    · exact fun h => h.2
    · exact fun h => ⟨by linarith, h⟩
  all_goals (rw [abs_lt]; constructor <;> linarith)

/-- Za maturo, naloga 3 d): razlika mejnih hitrosti ≈ 10,552 km/h, relativno zmanjšanje
1 − v_m/v_s ≈ 0,151 = 15,1 %; z zaokroženima mejama (69,9 − 59,3)/69,9 ≈ 0,152 (15,2 %).
trditev: MAT-SS-2/kvadratna-neenacba#matura3d
besedilo: »d) Razlika mejnih hitrosti je $69{,}859 - 59{,}307 = 10{,}552\,\text{km/h}$. 11. d) $\dfrac{10{,}552}{69{,}859} \approx 0{,}151$, torej je mejna hitrost manjša za približno $15{,}1\,\%$.« -/
theorem matura3d :
    |(-37.5 + Real.sqrt 31406.25) / 2 - (-25 + Real.sqrt 20625) / 2 - 10.552| < 0.0005 ∧
    |1 - ((-25 + Real.sqrt 20625) / 2) / ((-37.5 + Real.sqrt 31406.25) / 2) - 0.151| < 0.0005 ∧
    |((69.9 : ℝ) - 59.3) / 69.9 - 0.152| < 0.0005 := by
  have h1 : (177.218 : ℝ) < Real.sqrt 31406.25 := Real.lt_sqrt_of_sq_lt (by norm_num)
  have h2 : Real.sqrt 31406.25 < 177.2182 := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  have h3 : (143.614 : ℝ) < Real.sqrt 20625 := Real.lt_sqrt_of_sq_lt (by norm_num)
  have h4 : Real.sqrt 20625 < 143.6141 := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  have hB : 0 < (-37.5 + Real.sqrt 31406.25) / 2 := by linarith
  have q1 : ((-25 + Real.sqrt 20625) / 2) / ((-37.5 + Real.sqrt 31406.25) / 2) < 0.8495 := by
    rw [div_lt_iff₀ hB]; linarith
  have q2 : 0.8485 < ((-25 + Real.sqrt 20625) / 2) / ((-37.5 + Real.sqrt 31406.25) / 2) := by
    rw [lt_div_iff₀ hB]; linarith
  refine ⟨?_, ?_, by rw [abs_lt]; norm_num⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-! ## Korak za korakom in Preveri se -/

/-- Drugače: korak za korakom: x² + 2x > 8 ⇔ x² + 2x − 8 > 0; D = 2² − 4·1·(−8) = 4 + 32 = 36;
x = (−2 ± 6)/2: −4 in 2; rešitev (−∞, −4) ∪ (2, ∞); preizkus: (−5)² + 2·(−5) = 25 − 10 = 15 > 8,
0 ni > 8, 3² + 2·3 = 9 + 6 = 15 > 8.
trditev: MAT-SS-2/kvadratna-neenacba#korak-za-korakom
besedilo: »**Na desni naj bo nič:** $x^2 + 2x - 8 > 0$. 2. **Koeficienti:** $a = 1$, $b = 2$, $c = -8$. 3. **Diskriminanta:** $D = 2^2 - 4 \cdot 1 \cdot (-8) = 4 + 32 = 36$. 4. **Ničli:** $x_{1,2} = \dfrac{-2 \pm 6}{2}$, torej $x_1 = -4$ in $x_2 = 2$. 5. **Skica:** $a > 0$, parabola odprta navzgor, nad osjo je levo od $-4$ in desno od $2$. 6. **Oklepaji:** neenačaj je strog, ničli izključimo. 7. **Rešitev:** $(-\infty, -4) \cup (2, \infty)$.« -/
theorem korak_za_korakom (x : ℝ) : (x ^ 2 + 2 * x > 8 ↔ x ^ 2 + 2 * x - 8 > 0) ∧
    ((2 : ℝ) ^ 2 - 4 * 1 * (-8) = 4 + 32 ∧ (4 : ℝ) + 32 = 36) ∧
    ((-2 - 6) / 2 = (-4 : ℝ) ∧ (-2 + 6) / 2 = (2 : ℝ)) ∧ (x ^ 2 + 2 * x > 8 ↔ x < -4 ∨ 2 < x) ∧
    ((-5 : ℝ) ^ 2 + 2 * (-5) = 25 - 10 ∧ (25 : ℝ) - 10 = 15 ∧ (15 : ℝ) > 8) ∧
    ¬ ((0 : ℝ) ^ 2 + 2 * 0 > 8) ∧ ((3 : ℝ) ^ 2 + 2 * 3 = 9 + 6 ∧ (9 : ℝ) + 6 = 15) := by
  refine ⟨by constructor <;> intro h <;> linarith, by norm_num, by norm_num, ?_, by norm_num, by norm_num,
    by norm_num⟩
  rw [gt_iff_lt, ← sub_pos (a := x ^ 2 + 2 * x) (b := 8), show x ^ 2 + 2 * x - 8 = 1 * (x - -4) * (x - 2) by ring]
  exact (med_nicla 1 (-4) 2 x one_pos (by norm_num)).1

/-- Preveri se 2: 3x² > 2x + 1 ⇔ 3x² − 2x − 1 > 0 ⇔ x < −1/3 ali x > 1; x = −1 je rešitev (izgubi se
pri deljenju z x).
trditev: MAT-SS-2/kvadratna-neenacba#preveri2
besedilo: »Najprej $3x^2 - 2x - 1 > 0$, ničli $-\dfrac{1}{3}$ in $1$, parabola je odprta navzgor, rešitev $\left(-\infty, -\dfrac{1}{3}\right) \cup (1, \infty)$.« -/
theorem preveri2 (x : ℝ) : (3 * x ^ 2 > 2 * x + 1 ↔ x < -1 / 3 ∨ 1 < x) ∧ 3 * (-1 : ℝ) ^ 2 > 2 * (-1) + 1 := by
  refine ⟨?_, by norm_num⟩
  rw [gt_iff_lt, ← sub_pos (a := 3 * x ^ 2) (b := 2 * x + 1), show 3 * x ^ 2 - (2 * x + 1) = 3 * (x - -1 / 3) * (x - 1) by ring]
  exact (med_nicla 3 (-1 / 3) 1 x (by norm_num) (by norm_num)).1

/-- Preveri se 3: x² − 4x + 3 < 0 ⇔ 1 < x < 3 (teme (2, −1)); po premiku za 2 navzgor je teme (2, 1),
D = 16 − 20 = −4 < 0, x² − 4x + 5 < 0 nima rešitve (x² − 4x + 5 > 0 velja povsod).
trditev: MAT-SS-2/kvadratna-neenacba#preveri3
besedilo: »Teme je bilo v $(2, -1)$, po premiku je v $(2, 1)$. $D = 16 - 20 = -4 < 0$, parabola je vsa nad osjo, zato $x^2 - 4x + 5 < 0$ nima rešitve.« -/
theorem preveri3 : (∀ x : ℝ, x ^ 2 - 4 * x + 3 < 0 ↔ 1 < x ∧ x < 3) ∧ (2 : ℝ) ^ 2 - 4 * 2 + 3 = -1 ∧
    (2 : ℝ) ^ 2 - 4 * 2 + 5 = 1 ∧ ((-4 : ℝ) ^ 2 - 4 * 1 * 5 = 16 - 20 ∧ (16 : ℝ) - 20 = -4) ∧
    {x : ℝ | x ^ 2 - 4 * x + 5 < 0} = ∅ ∧ ∀ x : ℝ, 0 < x ^ 2 - 4 * x + 5 := by
  have hpos : ∀ x : ℝ, 0 < x ^ 2 - 4 * x + 5 := fun x => by
    have := (D_neg_predznak 1 (-4) 5 (by norm_num)).1 one_pos x; linarith
  refine ⟨fun x => (simulacija x).1, by norm_num, by norm_num, by norm_num, ?_, hpos⟩
  refine eq_empty_iff_forall_notMem.2 fun x hx => ?_
  have hx' : x ^ 2 - 4 * x + 5 < 0 := hx
  linarith [hpos x]

/-- Preveri se 4: x² − 9 < 0 ⇔ −3 < x < 3; (−5)² = 25 ni < 9, 4² − 9 = 7 > 0.
trditev: MAT-SS-2/kvadratna-neenacba#preveri4
besedilo: »Ničli sta $-3$ in $3$. Parabola je odprta navzgor, pod osjo je med ničlama, torej $(-3, 3)$.« -/
theorem preveri4 (x : ℝ) : (x ^ 2 - 9 < 0 ↔ -3 < x ∧ x < 3) ∧ ¬ ((-5 : ℝ) ^ 2 < 9) ∧ (4 : ℝ) ^ 2 - 9 = 7 :=
  ⟨(napaka_obrat x).2, by norm_num, by norm_num⟩

/-- Preveri se 5: −x² + 6x − 8 ≥ 0 ⇔ 2 ≤ x ≤ 4 (ničli 2, 4, f(2) = 0).
trditev: MAT-SS-2/kvadratna-neenacba#preveri5
besedilo: »Ničli sta $2$ in $4$. Parabola je odprta navzdol, nad osjo je med ničlama; neenačaj je nestrog, zato ničli vključimo.« -/
theorem preveri5 (x : ℝ) : (-x ^ 2 + 6 * x - 8 ≥ 0 ↔ 2 ≤ x ∧ x ≤ 4) ∧ -(2 : ℝ) ^ 2 + 6 * 2 - 8 = 0 := by
  refine ⟨?_, by norm_num⟩
  rw [ge_iff_le, show -x ^ 2 + 6 * x - 8 = -1 * (x - 2) * (x - 4) by ring]
  exact (med_nicla_neg (-1) 2 4 x (by norm_num) (by norm_num)).2.1

/-- Preveri se 6: x² − 2x − 8 = (x + 2)(x − 4) < 0 ⇔ −2 < x < 4; cele rešitve so −1, 0, 1, 2, 3 (pet);
f(−2) = 0 ni < 0, dolžina intervala 4 − (−2) = 6.
trditev: MAT-SS-2/kvadratna-neenacba#preveri6
besedilo: »Ničli sta $-2$ in $4$ (razcep $(x + 2)(x - 4)$). Parabola je odprta navzgor, pod osjo je med ničlama: $x \in (-2, 4)$. Cela števila v njem so $-1$, $0$, $1$, $2$ in $3$, torej $5$.« -/
theorem preveri6 : (∀ x : ℝ, x ^ 2 - 2 * x - 8 < 0 ↔ -2 < x ∧ x < 4) ∧
    {n : ℤ | n ^ 2 - 2 * n - 8 < 0} = Icc (-1) 3 ∧ (Finset.Icc (-1 : ℤ) 3).card = 5 ∧
    ¬ ((-2 : ℝ) ^ 2 - 2 * (-2) - 8 < 0) ∧ (4 : ℝ) - (-2) = 6 := by
  refine ⟨fun x => ?_, ?_, by simp, by norm_num, by norm_num⟩
  · rw [show x ^ 2 - 2 * x - 8 = 1 * (x - -2) * (x - 4) by ring]
    exact (med_nicla 1 (-2) 4 x one_pos (by norm_num)).2.2.1
  · ext n
    show n ^ 2 - 2 * n - 8 < 0 ↔ -1 ≤ n ∧ n ≤ 3
    constructor
    · intro h
      constructor
      · by_contra hn
        push Not at hn
        nlinarith [mul_nonneg (by linarith : (0 : ℤ) ≤ -(n + 2)) (by linarith : (0 : ℤ) ≤ 4 - n)]
      · by_contra hn
        push Not at hn
        nlinarith [mul_nonneg (by linarith : (0 : ℤ) ≤ n + 2) (by linarith : (0 : ℤ) ≤ n - 4)]
    · rintro ⟨h1, h2⟩
      nlinarith [mul_pos (by linarith : (0 : ℤ) < n + 2) (by linarith : (0 : ℤ) < 4 - n)]

/-- Preveri se 7: 1500 − 20x² > 1320 ⇔ 180 − 20x² > 0 ⇔ x² < 9 ⇔ −3 < x < 3; odsek je dolg 3 − (−3) = 6 km.
trditev: MAT-SS-2/kvadratna-neenacba#preveri7
besedilo: »$1500 - 20x^2 > 1320$ da $180 - 20x^2 > 0$, torej $x^2 < 9$ in $x \in (-3, 3)$. Odsek je dolg $3 - (-3) = 6\,\text{km}$.« -/
theorem preveri7 (x : ℝ) : (1500 - 20 * x ^ 2 > 1320 ↔ 180 - 20 * x ^ 2 > 0) ∧
    (180 - 20 * x ^ 2 > 0 ↔ x ^ 2 < 9) ∧ (x ^ 2 < 9 ↔ -3 < x ∧ x < 3) ∧ (3 : ℝ) - (-3) = 6 := by
  refine ⟨by constructor <;> intro h <;> linarith, by constructor <;> intro h <;> linarith, ?_, by norm_num⟩
  rw [← sub_neg (a := x ^ 2) (b := 9), show x ^ 2 - 9 = 1 * (x - -3) * (x - 3) by ring]
  exact (med_nicla 1 (-3) 3 x one_pos (by norm_num)).2.2.1

end Evklid.Lekcije.MAT_SS_2.KvadratnaNeenacba
