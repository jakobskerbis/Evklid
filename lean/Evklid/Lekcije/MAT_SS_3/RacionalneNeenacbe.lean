/-
vir: content/lessons/MAT-SS-3/racionalne-neenacbe.md
sha256: 32da6369bc5f8b23e9271e42c21527c216b893492d056a7d8c86205c9c205d9f
Ni v Leanu: risbe (graf, številska premica) in simulacija; Doppler kot fizikalni model in trditev, da je
razmerje 17/16 »približno pol tona« (fizika, ne matematična trditev lekcije); opisi napačnih postopkov v Pogostih napakah (pravilne rešitve
so dokazane); trditev »rešitve f(x) > 0 so x, kjer je graf nad osjo x« (definicija grafa); postopek v 5 korakih, pravilo
o pregledni tabeli in Preveri se, vprašanje 5 (vrstni red korakov, ni računska trditev); analogija s
hodnikom in stikali (opis; pravilo o sodi in lihi stopnji je dokazano v `predznak_ob_tocki_liha`,
`predznak_ob_tocki_soda`); »pri polu ulomek ne obstaja« (v Leanu je x/0 = 0, zato je pri nestrogih
neenačbah in pri neenačbah, kjer bi 0 v polu ustrezal, pogoj »imenovalec ≠ 0« zapisan na levi strani ↔;
pri strogih neenačbah oblike p/q > 0 ali p/q < 0 pogoj ni potreben, ker 0 ni rešitev); pomen asimptote
(»zdravilo se izloči«) in točkovanje maturitetnih nalog.
Približki pri nalogi 2 c) so dokazani kot ocene napake zaokrožitve iz 1,7320508 < √3 < 1,7320509.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.RacionalneNeenacbe

open Filter Topology Set

/-! ## Pomožne trditve in splošna pravila -/

/-- Bolj natančno: za q ≠ 0 je p/q > 0 enakovredno p·q > 0 (množimo s q² > 0). -/
theorem kolicnik_poz (p q : ℝ) (hq : q ≠ 0) : 0 < p / q ↔ 0 < p * q := by
  have e : p / q = p * q / q ^ 2 := by field_simp
  rw [e, lt_div_iff₀ (by positivity), zero_mul]

/-- Bolj natančno: za q ≠ 0 je p/q ≥ 0 enakovredno p·q ≥ 0 (pogoj q ≠ 0 izloči pole). -/
theorem kolicnik_nenegativen (p q : ℝ) (hq : q ≠ 0) : 0 ≤ p / q ↔ 0 ≤ p * q := by
  have e : p / q = p * q / q ^ 2 := by field_simp
  rw [e, le_div_iff₀ (by positivity), zero_mul]

/-- Bolj natančno (isto za <): za q ≠ 0 je p/q < 0 enakovredno p·q < 0. -/
theorem kolicnik_neg (p q : ℝ) (hq : q ≠ 0) : p / q < 0 ↔ p * q < 0 := by
  have e : p / q = p * q / q ^ 2 := by field_simp
  rw [e, div_lt_iff₀ (by positivity), zero_mul]

/-- Bolj natančno (isto za ≤): za q ≠ 0 je p/q ≤ 0 enakovredno p·q ≤ 0. -/
theorem kolicnik_nepozitiven (p q : ℝ) (hq : q ≠ 0) : p / q ≤ 0 ↔ p * q ≤ 0 := by
  have e : p / q = p * q / q ^ 2 := by field_simp
  rw [e, div_le_iff₀ (by positivity), zero_mul]

/-- Predpostavka trditev `kolicnik_poz`, `kolicnik_nenegativen`, `kolicnik_neg`, `kolicnik_nepozitiven` se
da izpolniti (q = 1). -/
example : (0 < (1 : ℝ) / 1 ↔ 0 < (1 : ℝ) * 1) ∧ (0 ≤ (1 : ℝ) / 1 ↔ 0 ≤ (1 : ℝ) * 1) ∧
    ((1 : ℝ) / 1 < 0 ↔ (1 : ℝ) * 1 < 0) ∧ ((1 : ℝ) / 1 ≤ 0 ↔ (1 : ℝ) * 1 ≤ 0) :=
  ⟨kolicnik_poz 1 1 one_ne_zero, kolicnik_nenegativen 1 1 one_ne_zero, kolicnik_neg 1 1 one_ne_zero,
    kolicnik_nepozitiven 1 1 one_ne_zero⟩

/-- Razlaga 1: pri množenju s pozitivnim številom znak neenačbe ostane, pri množenju z negativnim se obrne. -/
theorem mnozenje_znak (a b c : ℝ) (h : a < b) : (0 < c → a * c < b * c) ∧ (c < 0 → b * c < a * c) :=
  ⟨fun hc => mul_lt_mul_of_pos_right h hc, fun hc => mul_lt_mul_of_neg_right h hc⟩

/-- Predpostavka `mnozenje_znak` se da izpolniti (1 < 2). -/
example : (0 < (3 : ℝ) → (1 : ℝ) * 3 < 2 * 3) ∧ ((-3 : ℝ) < 0 → (2 : ℝ) * -3 < 1 * -3) :=
  ⟨(mnozenje_znak (1 : ℝ) 2 3 (by norm_num)).1, (mnozenje_znak (1 : ℝ) 2 (-3) (by norm_num)).2⟩

/-- Razlaga 2, Bolj natančno, Povzetek (»na vsakem intervalu zadošča eno testno število«): zvezna funkcija
brez ničel na intervalu (povezani množici S, npr. med sosednjima ničlama ali poloma) ima na njem stalen
predznak; sicer bi po izreku o vmesni vrednosti imela vmes ničlo. -/
theorem predznak_stalen {f : ℝ → ℝ} {S : Set ℝ} (hS : S.OrdConnected) (hf : ContinuousOn f S)
    (h : ∀ x ∈ S, f x ≠ 0) : (∀ x ∈ S, 0 < f x) ∨ (∀ x ∈ S, f x < 0) := by
  by_contra hc
  push Not at hc
  obtain ⟨⟨a, ha, fa⟩, ⟨b, hb, fb⟩⟩ := hc
  have fa' : f a < 0 := lt_of_le_of_ne fa (h a ha)
  have fb' : 0 < f b := lt_of_le_of_ne fb (h b hb).symm
  have sub := hS.uIcc_subset ha hb
  obtain ⟨z, hz, fz⟩ := intermediate_value_uIcc (hf.mono sub)
    (show (0 : ℝ) ∈ uIcc (f a) (f b) from Set.mem_uIcc.2 (Or.inl ⟨fa'.le, fb'.le⟩))
  exact h z (sub hz) fz

/-- Predpostavke `predznak_stalen` se dajo izpolniti (f = 1 na ℝ). -/
example : (∀ x ∈ (univ : Set ℝ), (0 : ℝ) < (fun _ => (1 : ℝ)) x) ∨
    (∀ x ∈ (univ : Set ℝ), (fun _ => (1 : ℝ)) x < 0) :=
  predznak_stalen ordConnected_univ continuousOn_const (fun _ _ => one_ne_zero)

/-- Razlaga 2 (»ulomek lahko zamenja predznak le tam, kjer je števec ali imenovalec 0«): če p in q na
povezani množici S nimata ničel in sta tam zvezna, ima p/q na S stalen predznak. -/
theorem predznak_ulomka_stalen {p q : ℝ → ℝ} {S : Set ℝ} (hS : S.OrdConnected) (hp : ContinuousOn p S)
    (hq : ContinuousOn q S) (hp0 : ∀ x ∈ S, p x ≠ 0) (hq0 : ∀ x ∈ S, q x ≠ 0) :
    (∀ x ∈ S, 0 < p x / q x) ∨ (∀ x ∈ S, p x / q x < 0) :=
  predznak_stalen hS (hp.div hq hq0) (fun x hx => div_ne_zero (hp0 x hx) (hq0 x hx))

/-- Predpostavke `predznak_ulomka_stalen` se dajo izpolniti ((1 − x)/x na (0, 1)). -/
example : (∀ x ∈ Ioo (0 : ℝ) 1, 0 < (1 - x) / x) ∨ (∀ x ∈ Ioo (0 : ℝ) 1, (1 - x) / x < 0) :=
  predznak_ulomka_stalen ordConnected_Ioo (by fun_prop) (by fun_prop)
    (fun x hx => by have := hx.2; intro e; linarith) (fun x hx => hx.1.ne')

/-- Pomožna: zvezna g z g(c) ≠ 0 ima blizu c isti predznak kot v c. -/
theorem blizu_isti_predznak {g : ℝ → ℝ} {c : ℝ} (hg : ContinuousAt g c) (h0 : g c ≠ 0) :
    ∃ δ > 0, ∀ x, |x - c| < δ → 0 < g x * g c := by
  have : ∀ᶠ x in 𝓝 c, 0 < g x * g c := by
    have hc : 0 < g c * g c := mul_self_pos.2 h0
    exact (hg.mul continuousAt_const).eventually (lt_mem_nhds hc)
  obtain ⟨δ, hδ, h⟩ := Metric.eventually_nhds_iff.1 this
  exact ⟨δ, hδ, fun x hx => h (by rwa [Real.dist_eq])⟩

/-- Predpostavke `blizu_isti_predznak` se dajo izpolniti (g = 1, c = 0). -/
example : ∃ δ > 0, ∀ x : ℝ, |x - 0| < δ → 0 < (fun _ => (1 : ℝ)) x * (fun _ => (1 : ℝ)) 0 :=
  blizu_isti_predznak continuousAt_const one_ne_zero

/-- Ustno vprašanje 2, Povzetek (»predznak se zamenja … le pri lihi stopnji«): f(x) = g(x)(x − c)ᵐ, g zvezna
v c, g(c) ≠ 0, m lih: blizu c ima f levo in desno od c nasprotna predznaka (f(x)·f(y) < 0). -/
theorem predznak_ob_tocki_liha {g : ℝ → ℝ} {c : ℝ} {m : ℕ} (hg : ContinuousAt g c) (h0 : g c ≠ 0)
    (hm : Odd m) : ∃ δ > 0, ∀ x y, c - δ < x → x < c → c < y → y < c + δ →
      (g x * (x - c) ^ m) * (g y * (y - c) ^ m) < 0 := by
  obtain ⟨δ, hδ, h⟩ := blizu_isti_predznak hg h0
  refine ⟨δ, hδ, fun x y h1 h2 h3 h4 => ?_⟩
  have gx := h x (by rw [abs_lt]; constructor <;> linarith)
  have gy := h y (by rw [abs_lt]; constructor <;> linarith)
  have gxy : 0 < g x * g y := by
    have : 0 < (g x * g c) * (g y * g c) := mul_pos gx gy
    have hc : 0 < g c * g c := mul_self_pos.2 h0
    nlinarith
  have px : (x - c) ^ m < 0 := hm.pow_neg (by linarith)
  have py : 0 < (y - c) ^ m := pow_pos (by linarith) m
  have : (g x * (x - c) ^ m) * (g y * (y - c) ^ m) = (g x * g y) * ((x - c) ^ m * (y - c) ^ m) := by ring
  rw [this]
  exact mul_neg_of_pos_of_neg gxy (mul_neg_of_neg_of_pos px py)

/-- Predpostavke `predznak_ob_tocki_liha` se dajo izpolniti (g = 1, c = 0, m = 1). -/
example : ∃ δ > 0, ∀ x y : ℝ, 0 - δ < x → x < 0 → 0 < y → y < 0 + δ →
    ((fun _ => (1 : ℝ)) x * (x - 0) ^ 1) * ((fun _ => (1 : ℝ)) y * (y - 0) ^ 1) < 0 :=
  predznak_ob_tocki_liha continuousAt_const one_ne_zero odd_one

/-- Razlaga 6, ustno vprašanje 2: pri sodi stopnji m ima f(x) = g(x)(x − c)ᵐ blizu c na obeh straneh isti
predznak (f(x)·f(y) > 0). -/
theorem predznak_ob_tocki_soda {g : ℝ → ℝ} {c : ℝ} {m : ℕ} (hg : ContinuousAt g c) (h0 : g c ≠ 0)
    (hm : Even m) : ∃ δ > 0, ∀ x y, c - δ < x → x < c → c < y → y < c + δ →
      0 < (g x * (x - c) ^ m) * (g y * (y - c) ^ m) := by
  obtain ⟨δ, hδ, h⟩ := blizu_isti_predznak hg h0
  refine ⟨δ, hδ, fun x y h1 h2 h3 h4 => ?_⟩
  have gx := h x (by rw [abs_lt]; constructor <;> linarith)
  have gy := h y (by rw [abs_lt]; constructor <;> linarith)
  have gxy : 0 < g x * g y := by
    have : 0 < (g x * g c) * (g y * g c) := mul_pos gx gy
    have hc : 0 < g c * g c := mul_self_pos.2 h0
    nlinarith
  have px : 0 < (x - c) ^ m := hm.pow_pos (by linarith)
  have py : 0 < (y - c) ^ m := pow_pos (by linarith) m
  have : (g x * (x - c) ^ m) * (g y * (y - c) ^ m) = (g x * g y) * ((x - c) ^ m * (y - c) ^ m) := by ring
  rw [this]
  exact mul_pos gxy (mul_pos px py)

/-- Predpostavke `predznak_ob_tocki_soda` se dajo izpolniti (g = 1, c = 0, m = 2). -/
example : ∃ δ > 0, ∀ x y : ℝ, 0 - δ < x → x < 0 → 0 < y → y < 0 + δ →
    0 < ((fun _ => (1 : ℝ)) x * (x - 0) ^ 2) * ((fun _ => (1 : ℝ)) y * (y - 0) ^ 2) :=
  predznak_ob_tocki_soda continuousAt_const one_ne_zero even_two

/-- Razlaga 6: (x − 2)² je povsod nenegativen. -/
theorem kvadrat_nenegativen (x : ℝ) : 0 ≤ (x - 2) ^ 2 := sq_nonneg _

/-- Razlaga 5 in Povzetek (krajišča): v ničli števca (q ≠ 0, p = 0) je p/q = 0, zato velja p/q ≥ 0 in
p/q ≤ 0, ne pa p/q > 0 ali p/q < 0. -/
theorem krajisca_nicla (p q : ℝ) (hp : p = 0) :
    0 ≤ p / q ∧ p / q ≤ 0 ∧ ¬ (0 < p / q) ∧ ¬ (p / q < 0) := by
  subst hp; simp

/-- Predpostavka `krajisca_nicla` se da izpolniti (ničla števca x − 2 pri x = 2, imenovalec 3). -/
example : 0 ≤ ((2 : ℝ) - 2) / 3 ∧ ((2 : ℝ) - 2) / 3 ≤ 0 ∧ ¬ (0 < ((2 : ℝ) - 2) / 3) ∧ ¬ (((2 : ℝ) - 2) / 3 < 0) :=
  krajisca_nicla _ 3 (by norm_num)

/-! ## Zakaj se tega učimo in Razlaga: 1/x < 1 -/

/-- Uvod: 1/(−2) = −0,5 < 1, čeprav −2 ni večje od 1 (naivno množenje z x da 1 < x in izgubi to rešitev). -/
theorem uvod : (1 : ℝ) / (-2) = -1 / 2 ∧ (1 : ℝ) / (-2) < 1 ∧ ¬ ((1 : ℝ) < -2) := by norm_num

/-- Razlaga 1: 1/x − 1 = (1 − x)/x za x ≠ 0. -/
theorem en_ulomek (x : ℝ) (hx : x ≠ 0) : 1 / x - 1 = (1 - x) / x := by field_simp

/-- Predpostavka `en_ulomek` se da izpolniti (x = 2). -/
example : (1 : ℝ) / 2 - 1 = (1 - 2) / 2 := en_ulomek 2 (by norm_num)

/-- Razlaga 2, tabela predznakov za (1 − x)/x na (−∞, 0), (0, 1), (1, ∞); pri x = 1 je ulomek 0. -/
theorem tabela_uvod :
    (∀ x : ℝ, x < 0 → 0 < 1 - x ∧ x < 0 ∧ (1 - x) / x < 0) ∧
    (∀ x : ℝ, 0 < x → x < 1 → 0 < 1 - x ∧ 0 < x ∧ 0 < (1 - x) / x) ∧
    (∀ x : ℝ, 1 < x → 1 - x < 0 ∧ 0 < x ∧ (1 - x) / x < 0) ∧ ((1 : ℝ) - 1) / 1 = 0 := by
  refine ⟨fun x h => ⟨by linarith, h, div_neg_of_pos_of_neg (by linarith) h⟩,
    fun x h1 h2 => ⟨by linarith, h1, div_pos (by linarith) h1⟩,
    fun x h => ⟨by linarith, by linarith, div_neg_of_neg_of_pos (by linarith) (by linarith)⟩,
    by norm_num⟩

/-- Razlaga 2 (RACUN neenacba): 1/x < 1 s pogojem x ≠ 0 ↔ x ∈ (−∞, 0) ∪ (1, ∞). -/
theorem resitev_uvod (x : ℝ) : (x ≠ 0 ∧ 1 / x < 1) ↔ x ∈ Iio 0 ∪ Ioi 1 := by
  simp only [mem_union, mem_Iio, mem_Ioi]
  constructor
  · rintro ⟨h0, h⟩
    have h1 : (1 - x) / x < 0 := by rw [← en_ulomek x h0]; linarith
    rw [kolicnik_neg _ _ h0] at h1
    by_contra hc; push Not at hc
    nlinarith [hc.1, hc.2]
  · rintro (h | h)
    · exact ⟨h.ne, by have : 1 / x < 0 := by rw [one_div]; exact inv_lt_zero.2 h
                      linarith⟩
    · exact ⟨by linarith, by rw [div_lt_one (by linarith)]; exact h⟩

/-! ## Razlaga: premisli -/

/-- Razlaga 5, premisli: (x − 2)/(x + 1) ≥ 0 s pogojem x ≠ −1 ↔ x ∈ (−∞, −1) ∪ [2, ∞) (RACUN); preizkus
x = −2 da 4, x = 0 da −2, x = 3 da 1/4. -/
theorem premisli1 (x : ℝ) : (x ≠ -1 ∧ 0 ≤ (x - 2) / (x + 1)) ↔ x ∈ Iio (-1) ∪ Ici 2 := by
  simp only [mem_union, mem_Iio, mem_Ici]
  constructor
  · rintro ⟨h1, h⟩
    have hq : x + 1 ≠ 0 := fun e => h1 (by linarith)
    rw [kolicnik_nenegativen _ _ hq] at h
    by_contra hc; push Not at hc
    have : -1 < x := lt_of_le_of_ne hc.1 (Ne.symm h1)
    nlinarith [hc.2]
  · rintro (h | h)
    · exact ⟨h.ne, div_nonneg_of_nonpos (by linarith) (by linarith)⟩
    · exact ⟨by intro e; linarith, div_nonneg (by linarith) (by linarith)⟩

/-- Razlaga 5, premisli, preizkusi: (−2 − 2)/(−2 + 1) = 4, (0 − 2)/(0 + 1) = −2, (3 − 2)/(3 + 1) = 1/4. -/
theorem premisli1_preizkus : ((-2 : ℝ) - 2) / (-2 + 1) = 4 ∧ ((0 : ℝ) - 2) / (0 + 1) = -2 ∧
    ((3 : ℝ) - 2) / (3 + 1) = 1 / 4 := by norm_num

/-- Razlaga 6, premisli (RACUN): (x − 2)²/(x + 3) > 0 ↔ x ∈ (−3, 2) ∪ (2, ∞); na (−∞, −3) je ulomek
negativen (izmenično pisanje bi ta interval napačno vzelo). -/
theorem premisli2 (x : ℝ) : 0 < (x - 2) ^ 2 / (x + 3) ↔ x ∈ Ioo (-3) 2 ∪ Ioi 2 := by
  simp only [mem_union, mem_Ioo, mem_Ioi]
  constructor
  · intro h
    have hq : x + 3 ≠ 0 := by intro e; rw [e, div_zero] at h; exact lt_irrefl _ h
    rw [kolicnik_poz _ _ hq] at h
    have h2 : x ≠ 2 := by rintro rfl; norm_num at h
    have h3 : -3 < x := by
      by_contra hc; push Not at hc; nlinarith [sq_nonneg (x - 2)]
    rcases lt_or_gt_of_ne h2 with e | e
    · left; exact ⟨h3, e⟩
    · right; exact e
  · rintro (⟨h1, h2⟩ | h)
    · exact div_pos (by nlinarith) (by linarith)
    · exact div_pos (by nlinarith) (by linarith)

/-- Razlaga 6, premisli: za x < −3 je (x − 2)²/(x + 3) < 0 (interval (−∞, −3) ni v rešitvi). -/
theorem premisli2_levo (x : ℝ) (hx : x < -3) : (x - 2) ^ 2 / (x + 3) < 0 :=
  div_neg_of_pos_of_neg (by nlinarith) (by linarith)

/-- Predpostavka `premisli2_levo` se da izpolniti (x = −4). -/
example : ((-4 : ℝ) - 2) ^ 2 / (-4 + 3) < 0 := premisli2_levo (-4) (by norm_num)

/-! ## Primer 1: (x + 5)/(x − 1) ≥ 2 -/

/-- Primer 1, koraka 1–2 (RACUN enako): (x + 5)/(x − 1) − 2 = (x + 5 − 2(x − 1))/(x − 1) = (7 − x)/(x − 1)
(x ≠ 1). -/
theorem primer1_ulomek (x : ℝ) (hx : x ≠ 1) :
    (x + 5) / (x - 1) - 2 = (x + 5 - 2 * (x - 1)) / (x - 1) ∧
    (x + 5 - 2 * (x - 1)) / (x - 1) = (7 - x) / (x - 1) := by
  have h : x - 1 ≠ 0 := sub_ne_zero.2 hx
  exact ⟨by field_simp, by congr 1; ring⟩

/-- Predpostavka `primer1_ulomek` se da izpolniti (x = 3). -/
example : ((3 : ℝ) + 5) / (3 - 1) - 2 = (3 + 5 - 2 * (3 - 1)) / (3 - 1) ∧
    ((3 : ℝ) + 5 - 2 * (3 - 1)) / (3 - 1) = (7 - 3) / (3 - 1) := primer1_ulomek 3 (by norm_num)

/-- Primer 1, korak 4: tabela predznakov (7 − x)/(x − 1): −, +, − na (−∞, 1), (1, 7), (7, ∞). -/
theorem primer1_tabela :
    (∀ x : ℝ, x < 1 → 0 < 7 - x ∧ x - 1 < 0 ∧ (7 - x) / (x - 1) < 0) ∧
    (∀ x : ℝ, 1 < x → x < 7 → 0 < 7 - x ∧ 0 < x - 1 ∧ 0 < (7 - x) / (x - 1)) ∧
    (∀ x : ℝ, 7 < x → 7 - x < 0 ∧ 0 < x - 1 ∧ (7 - x) / (x - 1) < 0) := by
  refine ⟨fun x h => ⟨by linarith, by linarith, div_neg_of_pos_of_neg (by linarith) (by linarith)⟩,
    fun x h1 h2 => ⟨by linarith, by linarith, div_pos (by linarith) (by linarith)⟩,
    fun x h => ⟨by linarith, by linarith, div_neg_of_neg_of_pos (by linarith) (by linarith)⟩⟩

/-- Primer 1 (RACUN neenacba): (x + 5)/(x − 1) ≥ 2 s pogojem x ≠ 1 ↔ x ∈ (1, 7]. -/
theorem primer1 (x : ℝ) : (x ≠ 1 ∧ 2 ≤ (x + 5) / (x - 1)) ↔ x ∈ Ioc 1 7 := by
  simp only [mem_Ioc]
  constructor
  · rintro ⟨h1, h⟩
    have hq : x - 1 ≠ 0 := sub_ne_zero.2 h1
    obtain ⟨e1, e2⟩ := primer1_ulomek x h1
    have h' : 0 ≤ (7 - x) / (x - 1) := by rw [← e2, ← e1]; linarith
    rw [kolicnik_nenegativen _ _ hq] at h'
    have : 1 < x := by
      by_contra hc; push Not at hc
      have : x < 1 := lt_of_le_of_ne hc h1
      nlinarith
    exact ⟨this, by nlinarith⟩
  · rintro ⟨h1, h2⟩
    have hq : x - 1 ≠ 0 := by linarith
    refine ⟨by linarith, ?_⟩
    have := (primer1_ulomek x (by linarith))
    have : 0 ≤ (7 - x) / (x - 1) := div_nonneg (by linarith) (by linarith)
    linarith [(primer1_ulomek x (by linarith)).1, (primer1_ulomek x (by linarith)).2]

/-- Primer 1, korak 6, preizkus: pri x = 3 je 8/2 = 4 ≥ 2; pri x = 0 je 5/(−1) = −5 < 2, čeprav »pomnožena«
neenačba x + 5 ≥ 2x − 2 (x ≤ 7) število 0 sprejme. -/
theorem primer1_preizkus : ((3 : ℝ) + 5) / (3 - 1) = 8 / 2 ∧ (8 : ℝ) / 2 = 4 ∧ (2 : ℝ) ≤ 4 ∧
    ((0 : ℝ) + 5) / (0 - 1) = -5 ∧ ¬ ((2 : ℝ) ≤ -5) ∧ (0 : ℝ) + 5 ≥ 2 * 0 - 2 ∧
    (∀ x : ℝ, x + 5 ≥ 2 * x - 2 ↔ x ≤ 7) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    fun x => ⟨fun h => by linarith, fun h => by linarith⟩⟩

/-- Bolj natančno, Primer 1 prek produkta: (7 − x)(x − 1) ≥ 0 ↔ x ∈ [1, 7]; brez pola x ≠ 1 ostane (1, 7]. -/
theorem primer1_produkt (x : ℝ) : (0 ≤ (7 - x) * (x - 1) ↔ x ∈ Icc 1 7) ∧
    ((0 ≤ (7 - x) * (x - 1) ∧ x ≠ 1) ↔ x ∈ Ioc 1 7) := by
  have a : 0 ≤ (7 - x) * (x - 1) ↔ x ∈ Icc 1 7 := by
    simp only [mem_Icc]
    constructor
    · intro h
      constructor
      · by_contra hc; push Not at hc; nlinarith
      · by_contra hc; push Not at hc; nlinarith
    · rintro ⟨h1, h2⟩; exact mul_nonneg (by linarith) (by linarith)
  refine ⟨a, ?_⟩
  rw [a]; simp only [mem_Icc, mem_Ioc]
  constructor
  · rintro ⟨⟨h1, h2⟩, h3⟩; exact ⟨lt_of_le_of_ne h1 (Ne.symm h3), h2⟩
  · rintro ⟨h1, h2⟩; exact ⟨⟨h1.le, h2⟩, h1.ne'⟩

/-! ## Primer 2: dvojna ničla -/

/-- Primer 2, korak 1 (RACUN enako): x² − 4x + 4 = (x − 2)², x² − 9 = (x − 3)(x + 3); ničla 2 je dvojna,
pola −3 in 3. -/
theorem primer2_razcep (x : ℝ) : x ^ 2 - 4 * x + 4 = (x - 2) ^ 2 ∧ x ^ 2 - 9 = (x - 3) * (x + 3) ∧
    (x ^ 2 - 9 = 0 ↔ x = 3 ∨ x = -3) := by
  refine ⟨by ring, by ring, ?_⟩
  rw [show x ^ 2 - 9 = (x - 3) * (x + 3) by ring, mul_eq_zero, sub_eq_zero, add_eq_zero_iff_eq_neg]

/-- Primer 2, korak 3: tabela predznakov (x − 2)²/(x² − 9): +, −, −, + na (−∞, −3), (−3, 2), (2, 3), (3, ∞);
korak 4: v x = 2 je ulomek 0. -/
theorem primer2_tabela :
    (∀ x : ℝ, x < -3 → 0 < (x - 2) ^ 2 / (x ^ 2 - 9)) ∧
    (∀ x : ℝ, -3 < x → x < 2 → (x - 2) ^ 2 / (x ^ 2 - 9) < 0) ∧
    (∀ x : ℝ, 2 < x → x < 3 → (x - 2) ^ 2 / (x ^ 2 - 9) < 0) ∧
    (∀ x : ℝ, 3 < x → 0 < (x - 2) ^ 2 / (x ^ 2 - 9)) ∧ ((2 : ℝ) - 2) ^ 2 / (2 ^ 2 - 9) = 0 := by
  refine ⟨fun x h => div_pos (by nlinarith) (by nlinarith),
    fun x h1 h2 => div_neg_of_pos_of_neg (by nlinarith) (by nlinarith),
    fun x h1 h2 => div_neg_of_pos_of_neg (by nlinarith) (by nlinarith),
    fun x h => div_pos (by nlinarith) (by nlinarith), by norm_num⟩

/-- Primer 2 (RACUN neenacba): (x² − 4x + 4)/(x² − 9) < 0 ↔ x ∈ (−3, 2) ∪ (2, 3). Pogoste napake: (−3, 3)
ni rešitev, ker je v 2 ulomek 0. -/
theorem primer2 (x : ℝ) : (x ^ 2 - 4 * x + 4) / (x ^ 2 - 9) < 0 ↔ x ∈ Ioo (-3) 2 ∪ Ioo 2 3 := by
  simp only [mem_union, mem_Ioo]
  rw [(primer2_razcep x).1]
  constructor
  · intro h
    have hq : x ^ 2 - 9 ≠ 0 := by intro e; rw [e, div_zero] at h; exact lt_irrefl _ h
    rw [kolicnik_neg _ _ hq] at h
    have h2 : x ≠ 2 := by rintro rfl; norm_num at h
    have hlo : -3 < x := by
      by_contra hc; push Not at hc
      nlinarith [mul_nonneg (sq_nonneg (x - 2)) (show (0 : ℝ) ≤ x ^ 2 - 9 by nlinarith)]
    have hhi : x < 3 := by
      by_contra hc; push Not at hc
      nlinarith [mul_nonneg (sq_nonneg (x - 2)) (show (0 : ℝ) ≤ x ^ 2 - 9 by nlinarith)]
    rcases lt_or_gt_of_ne h2 with e | e
    · left; exact ⟨hlo, e⟩
    · right; exact ⟨e, hhi⟩
  · rintro (⟨h1, h2⟩ | ⟨h1, h2⟩)
    · exact primer2_tabela.2.1 x h1 h2
    · exact primer2_tabela.2.2.1 x h1 h2

/-! ## Primer 3: sirena -/

/-- Primer 3, koraka 1–2 (RACUN enako): 340/(340 − v) − 17/16 = (16·340 − 17(340 − v))/(16(340 − v)) in
16·340 − 17(340 − v) = 5440 − 5780 + 17v = 17v − 340 (v ≠ 340). -/
theorem primer3_ulomek (v : ℝ) (hv : v ≠ 340) :
    340 / (340 - v) - 17 / 16 = (16 * 340 - 17 * (340 - v)) / (16 * (340 - v)) ∧
    16 * 340 - 17 * (340 - v) = 5440 - 5780 + 17 * v ∧ (5440 : ℝ) - 5780 + 17 * v = 17 * v - 340 := by
  have h : (340 : ℝ) - v ≠ 0 := sub_ne_zero.2 (Ne.symm hv)
  exact ⟨by field_simp, by ring, by ring⟩

/-- Predpostavka `primer3_ulomek` se da izpolniti (v = 0). -/
example : (340 : ℝ) / (340 - 0) - 17 / 16 = (16 * 340 - 17 * (340 - 0)) / (16 * (340 - 0)) ∧
    (16 : ℝ) * 340 - 17 * (340 - 0) = 5440 - 5780 + 17 * 0 ∧ (5440 : ℝ) - 5780 + 17 * 0 = 17 * 0 - 340 :=
  primer3_ulomek 0 (by norm_num)

/-- Primer 3, koraka 3–4: ničla 20, pol 340; tabela predznakov (17v − 340)/(16(340 − v)): −, +, −. -/
theorem primer3_tabela :
    (17 * (20 : ℝ) - 340 = 0) ∧ (16 * (340 - (340 : ℝ)) = 0) ∧
    (∀ v : ℝ, v < 20 → (17 * v - 340) / (16 * (340 - v)) < 0) ∧
    (∀ v : ℝ, 20 < v → v < 340 → 0 < (17 * v - 340) / (16 * (340 - v))) ∧
    (∀ v : ℝ, 340 < v → (17 * v - 340) / (16 * (340 - v)) < 0) := by
  refine ⟨by norm_num, by norm_num, fun v h => div_neg_of_neg_of_pos (by linarith) (by linarith),
    fun v h1 h2 => div_pos (by linarith) (by linarith),
    fun v h => div_neg_of_pos_of_neg (by linarith) (by linarith)⟩

/-- Primer 3 (RACUN neenacba): 340/(340 − v) ≥ 17/16 s pogojem v ≠ 340 ↔ v ∈ [20, 340); skupaj s pogojem
v ≥ 0 je rešitev ista. -/
theorem primer3 (v : ℝ) : (v ≠ 340 ∧ 17 / 16 ≤ 340 / (340 - v)) ↔ v ∈ Ico 20 340 := by
  simp only [mem_Ico]
  constructor
  · rintro ⟨h1, h⟩
    obtain ⟨e1, e2, e3⟩ := primer3_ulomek v h1
    have hq : (16 : ℝ) * (340 - v) ≠ 0 := mul_ne_zero (by norm_num) (sub_ne_zero.2 (Ne.symm h1))
    have h' : 0 ≤ (17 * v - 340) / (16 * (340 - v)) := by rw [← e3, ← e2, ← e1]; linarith
    rw [kolicnik_nenegativen _ _ hq] at h'
    have : v < 340 := by
      by_contra hc; push Not at hc
      have : 340 < v := lt_of_le_of_ne hc (Ne.symm h1)
      nlinarith
    exact ⟨by nlinarith, this⟩
  · rintro ⟨h1, h2⟩
    refine ⟨h2.ne, ?_⟩
    obtain ⟨e1, e2, e3⟩ := primer3_ulomek v h2.ne
    have : 0 ≤ (17 * v - 340) / (16 * (340 - v)) := div_nonneg (by linarith) (by linarith)
    rw [← e3, ← e2, ← e1] at this; linarith

/-- Primer 3, korak 5: s pogojem v ≥ 0 je rešitev ista. -/
theorem primer3_v_nenegativen (v : ℝ) :
    (0 ≤ v ∧ v ≠ 340 ∧ 17 / 16 ≤ 340 / (340 - v)) ↔ v ∈ Ico 20 340 := by
  rw [← primer3]
  constructor
  · exact fun h => h.2
  · intro h; exact ⟨by have := (primer3 v).1 h; exact le_trans (by norm_num) this.1, h⟩

/-- Primer 3, korak 6: 20 m/s = 20·3,6 km/h = 72 km/h (RACUN vrednost). -/
theorem primer3_pretvorba : (20 : ℝ) * (36 / 10) = 72 := by norm_num

/-- Primer 3, korak 7: »pomnožena« neenačba 16·340 ≥ 17(340 − v) da v ≥ 20, za v > 340 pa je razmerje
340/(340 − v) negativno. -/
theorem primer3_naivno : (∀ v : ℝ, (16 * 340 ≥ 17 * (340 - v) ↔ 20 ≤ v)) ∧
    (∀ v : ℝ, 340 < v → 340 / (340 - v) < 0) :=
  ⟨fun v => ⟨fun h => by linarith, fun h => by linarith⟩,
    fun v h => div_neg_of_pos_of_neg (by norm_num) (by linarith)⟩

/-! ## Primer 4 -/

/-- Primer 4, koraka 1–2 (RACUN enako): x/(x + 2) − 1/x = (x² − x − 2)/(x(x + 2)) in
x² − x − 2 = (x − 2)(x + 1) (x ≠ 0, x ≠ −2). -/
theorem primer4_ulomek (x : ℝ) (h0 : x ≠ 0) (h2 : x ≠ -2) :
    x / (x + 2) - 1 / x = (x ^ 2 - x - 2) / (x * (x + 2)) ∧ x ^ 2 - x - 2 = (x - 2) * (x + 1) := by
  have h : x + 2 ≠ 0 := fun e => h2 (by linarith)
  exact ⟨by field_simp; ring, by ring⟩

/-- Predpostavke `primer4_ulomek` se dajo izpolniti (x = 1). -/
example : (1 : ℝ) / (1 + 2) - 1 / 1 = (1 ^ 2 - 1 - 2) / (1 * (1 + 2)) ∧
    (1 : ℝ) ^ 2 - 1 - 2 = (1 - 2) * (1 + 1) := primer4_ulomek 1 one_ne_zero (by norm_num)

/-- Primer 4, korak 3: predznaka števca (x − 2)(x + 1) in imenovalca x(x + 2) po intervalih:
+/+, +/−, −/−, −/+, +/+. -/
theorem primer4_tabela :
    (∀ x : ℝ, x < -2 → 0 < (x - 2) * (x + 1) ∧ 0 < x * (x + 2)) ∧
    (∀ x : ℝ, -2 < x → x < -1 → 0 < (x - 2) * (x + 1) ∧ x * (x + 2) < 0) ∧
    (∀ x : ℝ, -1 < x → x < 0 → (x - 2) * (x + 1) < 0 ∧ x * (x + 2) < 0) ∧
    (∀ x : ℝ, 0 < x → x < 2 → (x - 2) * (x + 1) < 0 ∧ 0 < x * (x + 2)) ∧
    (∀ x : ℝ, 2 < x → 0 < (x - 2) * (x + 1) ∧ 0 < x * (x + 2)) := by
  refine ⟨fun x h => ⟨by nlinarith, by nlinarith⟩, fun x h1 h2 => ⟨by nlinarith, by nlinarith⟩,
    fun x h1 h2 => ⟨by nlinarith, by nlinarith⟩, fun x h1 h2 => ⟨by nlinarith, by nlinarith⟩,
    fun x h => ⟨by nlinarith, by nlinarith⟩⟩

/-- Primer 4, premisli (RACUN neenacba): x/(x + 2) > 1/x s pogojema x ≠ 0, x ≠ −2 ↔
x ∈ (−∞, −2) ∪ (−1, 0) ∪ (2, ∞). -/
theorem primer4 (x : ℝ) :
    (x ≠ 0 ∧ x ≠ -2 ∧ 1 / x < x / (x + 2)) ↔ x ∈ Iio (-2) ∪ Ioo (-1) 0 ∪ Ioi 2 := by
  simp only [mem_union, mem_Iio, mem_Ioo, mem_Ioi]
  constructor
  · rintro ⟨h0, h2, h⟩
    obtain ⟨e1, e2⟩ := primer4_ulomek x h0 h2
    have hq : x * (x + 2) ≠ 0 := mul_ne_zero h0 (fun e => h2 (by linarith))
    have h' : 0 < (x ^ 2 - x - 2) / (x * (x + 2)) := by rw [← e1]; linarith
    rw [kolicnik_poz _ _ hq, e2] at h'
    rcases lt_or_ge x (-2) with a | a
    · left; left; exact a
    rcases lt_or_ge x (-1) with b | b
    · exfalso
      have : -2 < x := lt_of_le_of_ne a (Ne.symm h2)
      nlinarith [(primer4_tabela.2.1 x this b).1, (primer4_tabela.2.1 x this b).2]
    rcases lt_or_ge x 0 with c | c
    · have : -1 < x := by
        rcases eq_or_lt_of_le b with e | e
        · rw [← e] at h'; norm_num at h'
        · exact e
      left; right; exact ⟨this, c⟩
    rcases le_or_gt x 2 with d | d
    · exfalso
      have c' : 0 < x := lt_of_le_of_ne c (Ne.symm h0)
      have : (x - 2) * (x + 1) ≤ 0 := by nlinarith
      have : 0 < x * (x + 2) := by nlinarith
      nlinarith
    · right; exact d
  · rintro ((a | ⟨b1, b2⟩) | d)
    · have h0 : x ≠ 0 := by linarith
      have h2 : x ≠ -2 := by linarith
      refine ⟨h0, h2, ?_⟩
      have := (primer4_tabela.1 x a)
      have e := primer4_ulomek x h0 h2
      have : 0 < (x ^ 2 - x - 2) / (x * (x + 2)) := by rw [e.2]; exact div_pos this.1 this.2
      linarith [e.1]
    · have h0 : x ≠ 0 := by linarith
      have h2 : x ≠ -2 := by linarith
      refine ⟨h0, h2, ?_⟩
      have := (primer4_tabela.2.2.1 x b1 b2)
      have e := primer4_ulomek x h0 h2
      have : 0 < (x ^ 2 - x - 2) / (x * (x + 2)) := by
        rw [e.2]; exact div_pos_of_neg_of_neg this.1 this.2
      linarith [e.1]
    · have h0 : x ≠ 0 := by linarith
      have h2 : x ≠ -2 := by linarith
      refine ⟨h0, h2, ?_⟩
      have := (primer4_tabela.2.2.2.2 x d)
      have e := primer4_ulomek x h0 h2
      have : 0 < (x ^ 2 - x - 2) / (x * (x + 2)) := by rw [e.2]; exact div_pos this.1 this.2
      linarith [e.1]

/-! ## Za maturo: naloga 1 -/

/-- Naloga 1 a) (RACUN resi): (x + 3)/(x − 1) = x + 3 s pogojem x ≠ 1 ↔ x = −3 ali x = 2 (koraka
x + 3 = (x + 3)(x − 1) in (x + 3)(x − 2) = 0); h(−3) = 0, h(2) = 5. -/
theorem matura1a (x : ℝ) : (x ≠ 1 ∧ (x + 3) / (x - 1) = x + 3) ↔ (x = -3 ∨ x = 2) := by
  constructor
  · rintro ⟨h1, h⟩
    have hq : x - 1 ≠ 0 := sub_ne_zero.2 h1
    have k1 : x + 3 = (x + 3) * (x - 1) := by rw [div_eq_iff hq] at h; exact h
    have k2 : (x + 3) * (x - 1 - 1) = 0 := by linear_combination -k1
    have k3 : (x + 3) * (x - 2) = 0 := by linear_combination k2
    rcases mul_eq_zero.1 k3 with e | e
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Naloga 1 a): presečišči (−3, 0) in (2, 5): h(−3) = 0, h(2) = 5. -/
theorem matura1a_tocki : (-3 : ℝ) + 3 = 0 ∧ (2 : ℝ) + 3 = 5 := by norm_num

/-- Naloga 1 b), korak 4 (RACUN enako): (x + 3)/(x − 1) − (x + 3) = (x + 3 − (x + 3)(x − 1))/(x − 1) =
(x + 3)(2 − x)/(x − 1) (x ≠ 1). -/
theorem matura1_ulomek (x : ℝ) (hx : x ≠ 1) :
    (x + 3) / (x - 1) - (x + 3) = (x + 3 - (x + 3) * (x - 1)) / (x - 1) ∧
    (x + 3 - (x + 3) * (x - 1)) / (x - 1) = (x + 3) * (2 - x) / (x - 1) := by
  have h : x - 1 ≠ 0 := sub_ne_zero.2 hx
  exact ⟨by field_simp, by congr 1; ring⟩

/-- Predpostavka `matura1_ulomek` se da izpolniti (x = 0). -/
example : ((0 : ℝ) + 3) / (0 - 1) - (0 + 3) = (0 + 3 - (0 + 3) * (0 - 1)) / (0 - 1) ∧
    ((0 : ℝ) + 3 - (0 + 3) * (0 - 1)) / (0 - 1) = (0 + 3) * (2 - 0) / (0 - 1) :=
  matura1_ulomek 0 (by norm_num)

/-- Naloga 1 b), korak 5: tabela predznakov (x + 3)(2 − x)/(x − 1): +, −, +, −. -/
theorem matura1_tabela :
    (∀ x : ℝ, x < -3 → 0 < (x + 3) * (2 - x) / (x - 1)) ∧
    (∀ x : ℝ, -3 < x → x < 1 → (x + 3) * (2 - x) / (x - 1) < 0) ∧
    (∀ x : ℝ, 1 < x → x < 2 → 0 < (x + 3) * (2 - x) / (x - 1)) ∧
    (∀ x : ℝ, 2 < x → (x + 3) * (2 - x) / (x - 1) < 0) := by
  refine ⟨fun x h => div_pos_of_neg_of_neg (by nlinarith) (by linarith),
    fun x h1 h2 => div_neg_of_pos_of_neg (by nlinarith) (by linarith),
    fun x h1 h2 => div_pos (by nlinarith) (by linarith),
    fun x h => div_neg_of_neg_of_pos (by nlinarith) (by linarith)⟩

/-- Naloga 1 b) (RACUN neenacba): g(x) ≥ h(x) s pogojem x ≠ 1 ↔ x ∈ (−∞, −3] ∪ (1, 2]. -/
theorem matura1b (x : ℝ) : (x ≠ 1 ∧ x + 3 ≤ (x + 3) / (x - 1)) ↔ x ∈ Iic (-3) ∪ Ioc 1 2 := by
  simp only [mem_union, mem_Iic, mem_Ioc]
  constructor
  · rintro ⟨h1, h⟩
    obtain ⟨e1, e2⟩ := matura1_ulomek x h1
    have hq : x - 1 ≠ 0 := sub_ne_zero.2 h1
    have h' : 0 ≤ (x + 3) * (2 - x) / (x - 1) := by rw [← e2, ← e1]; linarith
    rw [kolicnik_nenegativen _ _ hq] at h'
    rcases le_or_gt x (-3) with a | a
    · left; exact a
    rcases lt_or_ge x 1 with b | b
    · exfalso; nlinarith [mul_pos (by linarith : (0:ℝ) < x + 3) (by linarith : (0:ℝ) < 2 - x)]
    have b' : 1 < x := lt_of_le_of_ne b (Ne.symm h1)
    right; refine ⟨b', ?_⟩
    by_contra hc; push Not at hc
    nlinarith [mul_pos (by linarith : (0:ℝ) < x + 3) (by linarith : (0:ℝ) < x - 2)]
  · rintro (a | ⟨b1, b2⟩)
    · refine ⟨by linarith, ?_⟩
      obtain ⟨e1, e2⟩ := matura1_ulomek x (by linarith)
      have : 0 ≤ (x + 3) * (2 - x) / (x - 1) :=
        div_nonneg_of_nonpos (mul_nonpos_of_nonpos_of_nonneg (by linarith) (by linarith)) (by linarith)
      linarith
    · refine ⟨by linarith, ?_⟩
      obtain ⟨e1, e2⟩ := matura1_ulomek x (by linarith)
      have : 0 ≤ (x + 3) * (2 - x) / (x - 1) :=
        div_nonneg (mul_nonneg (by linarith) (by linarith)) (by linarith)
      linarith

/-- Naloga 1 c) (RACUN neenacba): g(x) < h(x) s pogojem x ≠ 1 ↔ x ∈ (−3, 1) ∪ (2, ∞). -/
theorem matura1c (x : ℝ) : (x ≠ 1 ∧ (x + 3) / (x - 1) < x + 3) ↔ x ∈ Ioo (-3) 1 ∪ Ioi 2 := by
  simp only [mem_union, mem_Ioo, mem_Ioi]
  constructor
  · rintro ⟨h1, h⟩
    obtain ⟨e1, e2⟩ := matura1_ulomek x h1
    have hq : x - 1 ≠ 0 := sub_ne_zero.2 h1
    have h' : (x + 3) * (2 - x) / (x - 1) < 0 := by rw [← e2, ← e1]; linarith
    rw [kolicnik_neg _ _ hq] at h'
    rcases le_or_gt x (-3) with a | a
    · exfalso; nlinarith [mul_nonneg (by linarith : (0:ℝ) ≤ -(x + 3)) (by linarith : (0:ℝ) ≤ 2 - x)]
    rcases lt_or_ge x 1 with b | b
    · left; exact ⟨a, b⟩
    rcases le_or_gt x 2 with c | c
    · exfalso; nlinarith [mul_nonneg (by linarith : (0:ℝ) ≤ x + 3) (by linarith : (0:ℝ) ≤ 2 - x)]
    · right; exact c
  · rintro (⟨a1, a2⟩ | c)
    · refine ⟨by linarith, ?_⟩
      have := matura1_tabela.2.1 x a1 a2
      linarith [(matura1_ulomek x (by linarith)).1, (matura1_ulomek x (by linarith)).2]
    · refine ⟨by linarith, ?_⟩
      have := matura1_tabela.2.2.2 x c
      linarith [(matura1_ulomek x (by linarith)).1, (matura1_ulomek x (by linarith)).2]

/-! ## Za maturo: naloga 2 (koncentracija zdravila) -/

/-- Naloga 2: c(t) = 30t/(t² + 9). -/
noncomputable def konc (t : ℝ) : ℝ := 30 * t / (t ^ 2 + 9)

/-- Naloga 2 a) (RACUN vrednost): c(1) = 30/(1 + 9) = 3, c(6) = 180/(36 + 9) = 4. -/
theorem matura2a : konc 1 = 3 ∧ konc 6 = 4 := by
  constructor
  · calc konc 1 = 30 / (1 + 9) := by unfold konc; norm_num
      _ = 3 := by norm_num
  · calc konc 6 = 180 / (36 + 9) := by unfold konc; norm_num
      _ = 4 := by norm_num

/-- Naloga 2 b) (RACUN limita): vodoravna asimptota c = 0 (števec stopnje 1, imenovalec stopnje 2). -/
theorem matura2b : Tendsto konc atTop (𝓝 0) := by
  have h : Tendsto (fun t : ℝ => 30 * t⁻¹ / (1 + 9 * t⁻¹ ^ 2)) atTop (𝓝 (30 * 0 / (1 + 9 * 0 ^ 2))) :=
    ((by fun_prop (disch := norm_num) : ContinuousAt (fun s : ℝ => 30 * s / (1 + 9 * s ^ 2)) 0).tendsto).comp
      tendsto_inv_atTop_zero
  rw [show (30 : ℝ) * 0 / (1 + 9 * 0 ^ 2) = 0 by norm_num] at h
  refine h.congr' ?_
  filter_upwards [eventually_gt_atTop 0] with t ht
  unfold konc
  have : t ^ 2 + 9 ≠ 0 := by positivity
  field_simp

/-- Naloga 2 c), koraki 3–4 (RACUN enako): c(t) − 2,5 = (30t − 2,5(t² + 9))/(t² + 9) =
−2,5(t² − 12t + 9)/(t² + 9); imenovalec je vedno pozitiven. -/
theorem matura2c_ulomek (t : ℝ) :
    konc t - 5 / 2 = (30 * t - 5 / 2 * (t ^ 2 + 9)) / (t ^ 2 + 9) ∧
    (30 * t - 5 / 2 * (t ^ 2 + 9)) / (t ^ 2 + 9) = -(5 / 2) * (t ^ 2 - 12 * t + 9) / (t ^ 2 + 9) ∧
    0 < t ^ 2 + 9 := by
  have h : t ^ 2 + 9 ≠ 0 := by positivity
  exact ⟨by unfold konc; field_simp, by congr 1; ring, by positivity⟩

/-- Naloga 2 c), korak 4: c(t) ≥ 2,5 ↔ t² − 12t + 9 ≤ 0 (delimo z −2,5 in obrnemo znak). -/
theorem matura2c_kvadratna (t : ℝ) : 5 / 2 ≤ konc t ↔ t ^ 2 - 12 * t + 9 ≤ 0 := by
  obtain ⟨e1, e2, hp⟩ := matura2c_ulomek t
  have key : 5 / 2 ≤ konc t ↔ 0 ≤ -(5 / 2) * (t ^ 2 - 12 * t + 9) / (t ^ 2 + 9) := by
    rw [← e2, ← e1]; constructor <;> intro h <;> linarith
  rw [key, le_div_iff₀ hp, zero_mul]
  constructor <;> intro h <;> linarith

/-- Naloga 2 c), korak 5: ničli t₁,₂ = (12 ± √(144 − 36))/2 = 6 ± 3√3. -/
theorem matura2c_nicli : (12 - Real.sqrt (144 - 36)) / 2 = 6 - 3 * Real.sqrt 3 ∧
    (12 + Real.sqrt (144 - 36)) / 2 = 6 + 3 * Real.sqrt 3 ∧
    (6 - 3 * Real.sqrt 3) ^ 2 - 12 * (6 - 3 * Real.sqrt 3) + 9 = 0 ∧
    (6 + 3 * Real.sqrt 3) ^ 2 - 12 * (6 + 3 * Real.sqrt 3) + 9 = 0 := by
  have s : Real.sqrt (144 - 36) = 6 * Real.sqrt 3 := by
    rw [show (144 : ℝ) - 36 = 6 ^ 2 * 3 by norm_num, Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  have h3 : Real.sqrt 3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  refine ⟨by rw [s]; ring, by rw [s]; ring, by nlinarith, by nlinarith⟩

/-- Naloga 2 c) (RACUN neenacba): c(t) ≥ 2,5 ↔ t ∈ [6 − 3√3, 6 + 3√3] (parabola odprta navzgor je
nepozitivna med ničlama). -/
theorem matura2c (t : ℝ) : 5 / 2 ≤ konc t ↔ t ∈ Icc (6 - 3 * Real.sqrt 3) (6 + 3 * Real.sqrt 3) := by
  rw [matura2c_kvadratna, mem_Icc]
  have h3 : Real.sqrt 3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have hs : 0 < Real.sqrt 3 := Real.sqrt_pos.2 (by norm_num)
  have e : t ^ 2 - 12 * t + 9 = (t - (6 - 3 * Real.sqrt 3)) * (t - (6 + 3 * Real.sqrt 3)) := by
    linear_combination 9 * h3
  rw [e]
  constructor
  · intro h
    constructor
    · by_contra hc; push Not at hc; nlinarith
    · by_contra hc; push Not at hc; nlinarith
  · rintro ⟨h1, h2⟩; exact mul_nonpos_of_nonneg_of_nonpos (by linarith) (by linarith)

/-- Pomožna: 1,7320508 < √3 < 1,7320509. -/
theorem koren3 : (17320508 / 10000000 : ℝ) < Real.sqrt 3 ∧ Real.sqrt 3 < 17320509 / 10000000 := by
  constructor
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num

/-- Naloga 2 c), koraki 5–7 (RACUN vrednost): t₁ ≈ 0,8038, t₂ ≈ 11,1962, (6 − 3√3)·60 ≈ 48,2,
0,8038·60 ≈ 48,2, 0,1962·60 ≈ 11,8, t₂ − t₁ = 6√3 ≈ 10,3923, 0,3923·60 ≈ 23,5. -/
theorem matura2c_priblizki :
    |(6 - 3 * Real.sqrt 3) - 8038 / 10000| < 5 / 100000 ∧
    |(6 + 3 * Real.sqrt 3) - 111962 / 10000| < 5 / 100000 ∧
    |(6 - 3 * Real.sqrt 3) * 60 - 482 / 10| < 5 / 100 ∧
    |(8038 / 10000 : ℝ) * 60 - 482 / 10| < 5 / 100 ∧
    |(1962 / 10000 : ℝ) * 60 - 118 / 10| < 5 / 100 ∧
    (6 + 3 * Real.sqrt 3) - (6 - 3 * Real.sqrt 3) = 6 * Real.sqrt 3 ∧
    |6 * Real.sqrt 3 - 103923 / 10000| < 5 / 100000 ∧
    |(3923 / 10000 : ℝ) * 60 - 235 / 10| < 5 / 100 := by
  obtain ⟨a, b⟩ := koren3
  refine ⟨?_, ?_, ?_, ?_, ?_, by ring, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Naloga 2 c), korak 6–7 in odgovor: zaokroženo na celo minuto zdravilo učinkuje od 48 min do
11 h 12 min, trajanje 10 h 24 min (časa v minutah: 60t₁ ≈ 48, 60t₂ ≈ 672 = 11·60 + 12,
60(t₂ − t₁) ≈ 624 = 10·60 + 24). -/
theorem matura2c_minute :
    |(6 - 3 * Real.sqrt 3) * 60 - 48| < 1 / 2 ∧ |(6 + 3 * Real.sqrt 3) * 60 - (11 * 60 + 12)| < 1 / 2 ∧
    |6 * Real.sqrt 3 * 60 - (10 * 60 + 24)| < 1 / 2 := by
  obtain ⟨a, b⟩ := koren3
  refine ⟨?_, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Naloga 2 d), korak 8 (RACUN enako): c(t) − 5 = (30t − 5(t² + 9))/(t² + 9) = −5(t − 3)²/(t² + 9). -/
theorem matura2d_ulomek (t : ℝ) :
    konc t - 5 = (30 * t - 5 * (t ^ 2 + 9)) / (t ^ 2 + 9) ∧
    (30 * t - 5 * (t ^ 2 + 9)) / (t ^ 2 + 9) = -5 * (t - 3) ^ 2 / (t ^ 2 + 9) := by
  have h : t ^ 2 + 9 ≠ 0 := by positivity
  exact ⟨by unfold konc; field_simp, by congr 1; ring⟩

/-- Naloga 2 d), korak 9 (RACUN neenacba): c(t) ≤ 5 za vsak t (rešitev (−∞, ∞)); enakost natanko pri
t = 3, c(3) = 90/18 = 5. -/
theorem matura2d : (∀ t : ℝ, konc t ≤ 5) ∧ (∀ t : ℝ, konc t = 5 ↔ t = 3) ∧ konc 3 = 90 / 18 ∧
    (90 : ℝ) / 18 = 5 := by
  have key : ∀ t : ℝ, konc t - 5 = -5 * (t - 3) ^ 2 / (t ^ 2 + 9) := fun t =>
    (matura2d_ulomek t).1.trans (matura2d_ulomek t).2
  refine ⟨fun t => ?_, fun t => ?_, by unfold konc; norm_num, by norm_num⟩
  · have : -5 * (t - 3) ^ 2 / (t ^ 2 + 9) ≤ 0 :=
      div_nonpos_of_nonpos_of_nonneg (by nlinarith [sq_nonneg (t - 3)]) (by positivity)
    linarith [key t]
  · constructor
    · intro h
      have : -5 * (t - 3) ^ 2 / (t ^ 2 + 9) = 0 := by rw [← key t, h]; ring
      rw [div_eq_zero_iff] at this
      rcases this with e | e
      · have : (t - 3) ^ 2 = 0 := by linarith
        have := pow_eq_zero_iff (n := 2) (by norm_num) |>.1 this
        linarith
      · nlinarith [sq_nonneg t]
    · rintro rfl; unfold konc; norm_num

/-! ## Ustno vprašanje 3 in Preveri se -/

/-- Ustno vprašanje 3 (RACUN neenacba): (x + 2)/(x − 1) ≥ 0 s pogojem x ≠ 1 ↔ x ∈ (−∞, −2] ∪ (1, ∞). -/
theorem ustno3 (x : ℝ) : (x ≠ 1 ∧ 0 ≤ (x + 2) / (x - 1)) ↔ x ∈ Iic (-2) ∪ Ioi 1 := by
  simp only [mem_union, mem_Iic, mem_Ioi]
  constructor
  · rintro ⟨h1, h⟩
    have hq : x - 1 ≠ 0 := sub_ne_zero.2 h1
    rw [kolicnik_nenegativen _ _ hq] at h
    by_contra hc; push Not at hc
    have : x < 1 := lt_of_le_of_ne hc.2 h1
    nlinarith [hc.1]
  · rintro (h | h)
    · exact ⟨by linarith, div_nonneg_of_nonpos (by linarith) (by linarith)⟩
    · exact ⟨by linarith, div_nonneg (by linarith) (by linarith)⟩

/-- Preveri se, vprašanje 1 (RACUN neenacba): (x + 3)/(x − 2) ≤ 0 s pogojem x ≠ 2 ↔ x ∈ [−3, 2). -/
theorem preveri1 (x : ℝ) : (x ≠ 2 ∧ (x + 3) / (x - 2) ≤ 0) ↔ x ∈ Ico (-3) 2 := by
  simp only [mem_Ico]
  constructor
  · rintro ⟨h2, h⟩
    have hq : x - 2 ≠ 0 := sub_ne_zero.2 h2
    rw [kolicnik_nepozitiven _ _ hq] at h
    have : x < 2 := by
      by_contra hc; push Not at hc
      have : 2 < x := lt_of_le_of_ne hc (Ne.symm h2)
      nlinarith
    exact ⟨by nlinarith, this⟩
  · rintro ⟨h1, h2⟩
    exact ⟨h2.ne, div_nonpos_of_nonneg_of_nonpos (by linarith) (by linarith)⟩

/-- Preveri se, vprašanje 1: neenačbo reši natanko 5 celih števil (−3, −2, −1, 0, 1). -/
theorem preveri1_cela : (∀ n : ℤ, ((n : ℝ) ≠ 2 ∧ ((n : ℝ) + 3) / ((n : ℝ) - 2) ≤ 0) ↔ n ∈ Finset.Ico (-3) 2) ∧
    (Finset.Ico (-3 : ℤ) 2).card = 5 := by
  refine ⟨fun n => ?_, by decide⟩
  rw [preveri1, mem_Ico, Finset.mem_Ico]
  constructor
  · rintro ⟨a, b⟩; exact ⟨by exact_mod_cast a, by exact_mod_cast b⟩
  · rintro ⟨a, b⟩; exact ⟨by exact_mod_cast a, by exact_mod_cast b⟩

/-- Preveri se, vprašanje 2 (RACUN neenacba): (x − 4)/(x + 1) ≥ 0 s pogojem x ≠ −1 ↔ x ∈ (−∞, −1) ∪ [4, ∞);
pol −1 ni v rešitvi. -/
theorem preveri2 (x : ℝ) : (x ≠ -1 ∧ 0 ≤ (x - 4) / (x + 1)) ↔ x ∈ Iio (-1) ∪ Ici 4 := by
  simp only [mem_union, mem_Iio, mem_Ici]
  constructor
  · rintro ⟨h1, h⟩
    have hq : x + 1 ≠ 0 := fun e => h1 (by linarith)
    rw [kolicnik_nenegativen _ _ hq] at h
    by_contra hc; push Not at hc
    have : -1 < x := lt_of_le_of_ne hc.1 (Ne.symm h1)
    nlinarith [hc.2]
  · rintro (h | h)
    · exact ⟨h.ne, div_nonneg_of_nonpos (by linarith) (by linarith)⟩
    · exact ⟨by intro e; linarith, div_nonneg (by linarith) (by linarith)⟩

/-- Preveri se, vprašanje 3: f(x) = (x − 1)²/(4(x + 2)); f ≥ 0 s pogojem x ≠ −2 ↔ x ∈ (−2, ∞), f > 0 ↔
x ∈ (−2, 1) ∪ (1, ∞) (RACUN neenacba); f(1) = 0. -/
theorem preveri3 (x : ℝ) :
    ((x ≠ -2 ∧ 0 ≤ (x - 1) ^ 2 / (4 * (x + 2))) ↔ x ∈ Ioi (-2)) ∧
    (0 < (x - 1) ^ 2 / (4 * (x + 2)) ↔ x ∈ Ioo (-2) 1 ∪ Ioi 1) ∧
    ((1 : ℝ) - 1) ^ 2 / (4 * (1 + 2)) = 0 := by
  refine ⟨?_, ?_, by norm_num⟩
  · simp only [mem_Ioi]
    constructor
    · rintro ⟨h2, h⟩
      have hq : 4 * (x + 2) ≠ 0 := mul_ne_zero (by norm_num) (fun e => h2 (by linarith))
      rw [kolicnik_nenegativen _ _ hq] at h
      by_contra hc; push Not at hc
      have hlt : x < -2 := lt_of_le_of_ne hc h2
      have a : 0 < (x - 1) ^ 2 := by nlinarith
      have b : 0 < (x - 1) ^ 2 * (-(4 * (x + 2))) := mul_pos a (by linarith)
      linarith
    · intro h; exact ⟨by intro e; linarith, div_nonneg (sq_nonneg _) (by linarith)⟩
  · simp only [mem_union, mem_Ioo, mem_Ioi]
    constructor
    · intro h
      have hq : 4 * (x + 2) ≠ 0 := by intro e; rw [e, div_zero] at h; exact lt_irrefl _ h
      rw [kolicnik_poz _ _ hq] at h
      have h1 : x ≠ 1 := by rintro rfl; norm_num at h
      have h2 : -2 < x := by by_contra hc; push Not at hc; nlinarith [sq_nonneg (x - 1)]
      rcases lt_or_gt_of_ne h1 with e | e
      · left; exact ⟨h2, e⟩
      · right; exact e
    · rintro (⟨a, b⟩ | c)
      · exact div_pos (by nlinarith) (by linarith)
      · exact div_pos (by nlinarith) (by linarith)

/-- Preveri se, vprašanje 4 (RACUN neenacba): (x + 6)/x ≥ 4 s pogojem x ≠ 0 ↔ x ∈ (0, 2], torej b = 2;
(x + 6)/x − 4 = (6 − 3x)/x. -/
theorem preveri4 (x : ℝ) : (x ≠ 0 → (x + 6) / x - 4 = (6 - 3 * x) / x) ∧
    ((x ≠ 0 ∧ 4 ≤ (x + 6) / x) ↔ x ∈ Ioc 0 2) := by
  have e : x ≠ 0 → (x + 6) / x - 4 = (6 - 3 * x) / x := fun h => by field_simp; ring
  refine ⟨e, ?_⟩
  simp only [mem_Ioc]
  constructor
  · rintro ⟨h0, h⟩
    have h' : 0 ≤ (6 - 3 * x) / x := by rw [← e h0]; linarith
    rw [kolicnik_nenegativen _ _ h0] at h'
    have : 0 < x := by
      by_contra hc; push Not at hc
      have : x < 0 := lt_of_le_of_ne hc h0
      nlinarith
    exact ⟨this, by nlinarith⟩
  · rintro ⟨h1, h2⟩
    have h0 : x ≠ 0 := h1.ne'
    refine ⟨h0, ?_⟩
    have : 0 ≤ (6 - 3 * x) / x := div_nonneg (by linarith) h1.le
    linarith [e h0]

end Evklid.Lekcije.MAT_SS_3.RacionalneNeenacbe
