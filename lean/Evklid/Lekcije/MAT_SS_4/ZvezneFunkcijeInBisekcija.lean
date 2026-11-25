/-
vir: content/lessons/MAT-SS-4/zvezne-funkcije-in-bisekcija.md
sha256: d608b9d03bf8a29874fb77d4e8fbf2ecbe2c16e3f12a6d56f23243bdd1396c38
Ni v Leanu: zgodbi o bencinski črpalki in vožnji na smučišče (ni dane funkcije; splošno pravilo je
`vmesne_vrednosti`); simulacija »skok« (funkcija ni zapisana v lekciji); risbe grafov; razdelek 6 o
žepnem računalu in programu za grafe (opis tehnologije; dokazano je le pravilo o zaokroževanju krajišč
`zaokrozitev_krajisc` in prevod točke na krivulji na ničlo razlike); besedilni sklepi »natančnost« in
»tri decimalke stanejo približno 10 korakov«; zgodba o Maji in ceni kolesa razen štetja možnosti;
nepravilni odgovori kvizov (dokazani so pravilni); kviz o vrstnem redu korakov bisekcije (ni
matematična trditev); točkovanje. Približki »≈« so dokazani kot |vrednost − približek| ≤ pol enote
zadnjega zapisanega mesta.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.ZvezneFunkcijeInBisekcija

open Set

/-! ## Pomožne definicije in trditve -/

/-- En korak bisekcije (razlaga, 5): sredina `c = (a + b)/2`; obdržimo levo polovico, če imata `f(a)` in
`f(c)` različna predznaka (ali je `f(c) = 0`), sicer desno. -/
noncomputable def korak (f : ℝ → ℝ) (I : ℝ × ℝ) : ℝ × ℝ :=
  if f I.1 * f ((I.1 + I.2) / 2) ≤ 0 then (I.1, (I.1 + I.2) / 2) else ((I.1 + I.2) / 2, I.2)

/-- Interval po `n` korakih bisekcije, začenši na `[a, b]`. -/
noncomputable def bisekcija (f : ℝ → ℝ) (a b : ℝ) : ℕ → ℝ × ℝ
  | 0 => (a, b)
  | n + 1 => korak f (bisekcija f a b n)

/-- Zaokrožitev na `k` decimalk (navzgor pri polovici), zapisana kot celo število `⌊x·10ᵏ + ½⌋`;
npr. `zaokrozi 1 x = 12` pomeni, da se `x` zaokroži na `1,2`. -/
noncomputable def zaokrozi (k : ℕ) (x : ℝ) : ℤ := ⌊x * 10 ^ k + 1 / 2⌋

/-- Pomožna trditev: korak bisekcije obdrži levo polovico `[a, c]`, če je `f(a)·f(c) ≤ 0`. -/
theorem korak_levo (f : ℝ → ℝ) (a b c : ℝ) (hc : (a + b) / 2 = c) (h : f a * f c ≤ 0) :
    korak f (a, b) = (a, c) := by
  subst hc
  unfold korak
  dsimp only
  simp only [h, ↓reduceIte]

/-- Pomožna trditev: korak bisekcije obdrži desno polovico `[c, b]`, če je `f(a)·f(c) > 0`. -/
theorem korak_desno (f : ℝ → ℝ) (a b c : ℝ) (hc : (a + b) / 2 = c) (h : 0 < f a * f c) :
    korak f (a, b) = (c, b) := by
  subst hc
  unfold korak
  dsimp only
  simp only [not_le.mpr h, ↓reduceIte]

/-- Pomožna trditev: približek »≈ v« dokažemo z mejama `v − e ≤ x ≤ v + e`. -/
theorem blizu {x v e : ℝ} (h1 : v - e ≤ x) (h2 : x ≤ v + e) : |x - v| ≤ e :=
  abs_le.mpr ⟨by linarith, by linarith⟩

/-- Pomožna trditev: ocena potence `2^r` z racionalnim eksponentom; če je `r·q = k` celo število, je
`(2^r)^q = 2^k`, zato iz `lo^q < 2^k < hi^q` sledi `lo < 2^r < hi`. -/
theorem ocena_dva (r : ℝ) (q : ℕ) (k : ℤ) (hk : r * q = k) (lo hi : ℝ) (_hlo : 0 ≤ lo) (hhi : 0 ≤ hi)
    (h1 : lo ^ q < (2:ℝ) ^ k) (h2 : (2:ℝ) ^ k < hi ^ q) : lo < (2:ℝ) ^ r ∧ (2:ℝ) ^ r < hi := by
  have e : ((2:ℝ) ^ r) ^ q = (2:ℝ) ^ k := by
    rw [← Real.rpow_natCast, ← Real.rpow_mul (by norm_num), hk, Real.rpow_intCast]
  have hpos : 0 ≤ (2:ℝ) ^ r := Real.rpow_nonneg (by norm_num) r
  exact ⟨lt_of_pow_lt_pow_left₀ q hpos (e ▸ h1), lt_of_pow_lt_pow_left₀ q hhi (e ▸ h2)⟩

/-- Pomožna trditev: iz `x·y ≤ 0` sledi, da je `0` med `x` in `y`. -/
theorem nic_med {x y : ℝ} (h : x * y ≤ 0) : (0:ℝ) ∈ uIcc x y := by
  rw [mem_uIcc]
  rcases le_total x 0 with hx | hx
  · rcases le_total 0 y with hy | hy
    · exact Or.inl ⟨hx, hy⟩
    · have : x * y = 0 := le_antisymm h (mul_nonneg_of_nonpos_of_nonpos hx hy)
      rcases mul_eq_zero.mp this with h0 | h0
      · exact Or.inr ⟨by linarith, by linarith⟩
      · exact Or.inl ⟨hx, by linarith⟩
  · rcases le_total y 0 with hy | hy
    · exact Or.inr ⟨hy, hx⟩
    · have : x * y = 0 := le_antisymm h (mul_nonneg hx hy)
      rcases mul_eq_zero.mp this with h0 | h0
      · exact Or.inl ⟨by linarith, hy⟩
      · exact Or.inr ⟨by linarith, hx⟩

/-- Pomožna trditev: če velja `K < 2ᵐ` in `2ᵐ⁻¹ ≤ K`, je `K < 2ⁿ` natanko za `n ≥ m`. -/
theorem koraki (K m : ℕ) (h1 : 2 ^ (m - 1) ≤ K) (h2 : K < 2 ^ m) (n : ℕ) : K < 2 ^ n ↔ m ≤ n := by
  constructor
  · intro h
    by_contra hn
    push Not at hn
    have : 2 ^ n ≤ 2 ^ (m - 1) := Nat.pow_le_pow_right (by norm_num) (by omega)
    omega
  · intro h
    exact lt_of_lt_of_le h2 (Nat.pow_le_pow_right (by norm_num) h)

/-- Pomožna trditev za depresirani kubični polinom `x³ + px + q`: tri različne ničle imajo vsoto 0. -/
theorem vsota_nicel (p q a b c : ℝ) (hab : a ≠ b) (hac : a ≠ c) (hbc : b ≠ c)
    (ha : a ^ 3 + p * a + q = 0) (hb : b ^ 3 + p * b + q = 0) (hc : c ^ 3 + p * c + q = 0) :
    a + b + c = 0 := by
  have e1 : (a - b) * (a ^ 2 + a * b + b ^ 2 + p) = 0 := by linear_combination ha - hb
  have e2 : (a - c) * (a ^ 2 + a * c + c ^ 2 + p) = 0 := by linear_combination ha - hc
  have h1 : a ^ 2 + a * b + b ^ 2 + p = 0 :=
    (mul_eq_zero.mp e1).resolve_left (sub_ne_zero.mpr hab)
  have h2 : a ^ 2 + a * c + c ^ 2 + p = 0 :=
    (mul_eq_zero.mp e2).resolve_left (sub_ne_zero.mpr hac)
  have e3 : (b - c) * (a + b + c) = 0 := by linear_combination h1 - h2
  exact (mul_eq_zero.mp e3).resolve_left (sub_ne_zero.mpr hbc)

/-- Pomožna trditev: ima `x³ + px + q` tri različne ničle, drugih ničel nima (»polinom tretje stopnje
ima največ 3 ničle« za depresirani polinom). -/
theorem tri_nicle (p q a b c : ℝ) (hab : a ≠ b) (hac : a ≠ c) (hbc : b ≠ c)
    (ha : a ^ 3 + p * a + q = 0) (hb : b ^ 3 + p * b + q = 0) (hc : c ^ 3 + p * c + q = 0) (x : ℝ) :
    x ^ 3 + p * x + q = 0 ↔ x = a ∨ x = b ∨ x = c := by
  constructor
  · intro hx
    by_contra hne
    push Not at hne
    obtain ⟨h1, h2, h3⟩ := hne
    have s1 := vsota_nicel p q x a b h1 h2 hab hx ha hb
    have s2 := vsota_nicel p q x a c h1 h3 hac hx ha hc
    exact hbc (by linarith)
  · rintro (rfl | rfl | rfl) <;> assumption

/-- Predpostavke trditev `vsota_nicel` in `tri_nicle` se dajo izpolniti: `x³ − x` ima ničle `−1, 0, 1`. -/
example : (-1:ℝ) ≠ 0 ∧ (-1:ℝ) ≠ 1 ∧ (0:ℝ) ≠ 1 ∧ (-1:ℝ) ^ 3 + (-1) * (-1) + 0 = 0 ∧
    (0:ℝ) ^ 3 + (-1) * 0 + 0 = 0 ∧ (1:ℝ) ^ 3 + (-1) * 1 + 0 = 0 := by norm_num

/-- Predpostavke trditve `korak_levo` se dajo izpolniti (`f(x) = x − 1` na `[0, 2]`, `c = 1`). -/
example : ((0:ℝ) + 2) / 2 = 1 ∧ ((0:ℝ) - 1) * ((1:ℝ) - 1) ≤ 0 := by norm_num

/-- Predpostavke trditve `korak_desno` se dajo izpolniti (`f(x) = x − 3` na `[0, 2]`, `c = 1`). -/
example : ((0:ℝ) + 2) / 2 = 1 ∧ 0 < ((0:ℝ) - 3) * ((1:ℝ) - 3) := by norm_num

/-- Predpostavke trditve `blizu` se dajo izpolniti. -/
example : (1:ℝ) - 0.5 ≤ 1 ∧ (1:ℝ) ≤ 1 + 0.5 := by norm_num

/-- Predpostavke trditve `ocena_dva` se dajo izpolniti (`r = 1`, `q = 1`, `k = 1`, `lo = 1`, `hi = 3`). -/
example : (1:ℝ) * ((1:ℕ):ℝ) = ((1:ℤ):ℝ) ∧ (0:ℝ) ≤ 1 ∧ (0:ℝ) ≤ 3 ∧ (1:ℝ) ^ 1 < (2:ℝ) ^ (1:ℤ) ∧
    (2:ℝ) ^ (1:ℤ) < (3:ℝ) ^ 1 := by norm_num

/-- Predpostavka trditve `nic_med` se da izpolniti. -/
example : (-1:ℝ) * 1 ≤ 0 := by norm_num

/-- Predpostavke trditve `koraki` se dajo izpolniti (`K = 1000`, `m = 10`). -/
example : 2 ^ (10 - 1) ≤ 1000 ∧ 1000 < 2 ^ 10 := by norm_num

/-- Predpostavke trditev `f₃_narasca` (`x = 1`, `y = 2`) in `h₂_pada` (`x = −2`, `y = −1`) se dajo
izpolniti. -/
example : ((1 / 2 : ℝ) ≤ 1 ∧ (1:ℝ) < 2) ∧ ((-2:ℝ) ≤ -2 ∧ (-2:ℝ) < -1 ∧ (-1:ℝ) ≤ -1) := by norm_num

/-! ## Razlaga, 1: stanje računa s skokom -/

/-- Stanje računa v evrih ob času `t` (ure): do 12. ure −30 €, nato +50 €. -/
noncomputable def stanje (t : ℝ) : ℝ := if t < 12 then -30 else 50

/-- Razlaga 1: stanje je zjutraj negativno (−30 €), zvečer pozitivno (+50 €), a nikoli točno 0 €. -/
theorem stanje_nikoli_nic : stanje 0 = -30 ∧ stanje 20 = 50 ∧ ∀ t, stanje t ≠ 0 := by
  refine ⟨by norm_num [stanje], by norm_num [stanje], fun t => ?_⟩
  unfold stanje
  split_ifs <;> norm_num

/-! ## Razlaga, 2–4: izreki o zveznih funkcijah -/

/-- Razlaga 2 (izrek o ničli): `f` zvezna na `[a, b]` in `f(a)·f(b) < 0` ⇒ `f(c) = 0` za vsaj en
`c ∈ (a, b)`. -/
theorem izrek_o_nicli (f : ℝ → ℝ) (a b : ℝ) (hab : a ≤ b) (hf : ContinuousOn f (Icc a b))
    (h : f a * f b < 0) : ∃ c ∈ Ioo a b, f c = 0 := by
  rcases lt_or_gt_of_ne (show f a ≠ 0 by rintro h0; rw [h0, zero_mul] at h; exact lt_irrefl 0 h)
    with ha | ha
  · have hb : 0 < f b := by nlinarith
    exact intermediate_value_Ioo hab hf ⟨ha, hb⟩
  · have hb : f b < 0 := by nlinarith
    exact intermediate_value_Ioo' hab hf ⟨hb, ha⟩

/-- Predpostavke izreka o ničli se dajo izpolniti (`f(x) = x` na `[−1, 1]`). -/
example : ContinuousOn (fun x : ℝ => x) (Icc (-1) 1) ∧ (-1:ℝ) ≤ 1 ∧ (-1:ℝ) * 1 < 0 :=
  ⟨continuousOn_id, by norm_num, by norm_num⟩

/-- Razlaga 2, premisli: `x² − 1` ima na `[−2, 2]` na krajiščih enaka predznaka (`3` in `3`), pa vseeno
ničli `−1` in `1`. -/
theorem enaka_predznaka_dve_nicli :
    ((-2:ℝ) ^ 2 - 1 = 3 ∧ (2:ℝ) ^ 2 - 1 = 3) ∧ ∀ x : ℝ, x ^ 2 - 1 = 0 ↔ x = -1 ∨ x = 1 := by
  refine ⟨by norm_num, fun x => ?_⟩
  constructor
  · intro h
    have : (x + 1) * (x - 1) = 0 := by linear_combination h
    rcases mul_eq_zero.mp this with h1 | h1
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Razlaga 3 (vse vmesne vrednosti): zvezna funkcija na `[a, b]` zavzame vsako vrednost med `f(a)`
in `f(b)`. -/
theorem vmesne_vrednosti (f : ℝ → ℝ) (a b : ℝ) (hab : a ≤ b) (hf : ContinuousOn f (Icc a b))
    (y : ℝ) (hy : y ∈ uIcc (f a) (f b)) : ∃ c ∈ Icc a b, f c = y := by
  rw [← uIcc_of_le hab] at hf ⊢
  exact intermediate_value_uIcc hf hy

/-- Predpostavke trditve `vmesne_vrednosti` se dajo izpolniti. -/
example : ContinuousOn (fun x : ℝ => x) (Icc 0 1) ∧ (0:ℝ) ≤ 1 ∧ (1/2:ℝ) ∈ uIcc 0 1 :=
  ⟨continuousOn_id, by norm_num, by rw [uIcc_of_le (by norm_num)]; norm_num⟩

/-- Razlaga 4: zvezna funkcija na zaprtem intervalu `[a, b]` doseže najmanjšo vrednost `m` in največjo
vrednost `M` ter zavzame natanko vse vrednosti od `m` do `M`. -/
theorem najmanjsa_najvecja (f : ℝ → ℝ) (a b : ℝ) (hab : a ≤ b) (hf : ContinuousOn f (Icc a b)) :
    ∃ m M : ℝ, (∃ x ∈ Icc a b, f x = m) ∧ (∃ x ∈ Icc a b, f x = M) ∧ f '' Icc a b = Icc m M := by
  obtain ⟨x1, hx1, hmin⟩ := isCompact_Icc.exists_isMinOn (nonempty_Icc.mpr hab) hf
  obtain ⟨x2, hx2, hmax⟩ := isCompact_Icc.exists_isMaxOn (nonempty_Icc.mpr hab) hf
  refine ⟨f x1, f x2, ⟨x1, hx1, rfl⟩, ⟨x2, hx2, rfl⟩, ?_⟩
  apply Subset.antisymm
  · rintro _ ⟨x, hx, rfl⟩
    exact ⟨isMinOn_iff.mp hmin x hx, isMaxOn_iff.mp hmax x hx⟩
  · intro y hy
    have hsub : uIcc x1 x2 ⊆ Icc a b := uIcc_subset_Icc hx1 hx2
    obtain ⟨c, hc, hfc⟩ := intermediate_value_uIcc (hf.mono hsub)
      (show y ∈ uIcc (f x1) (f x2) from Icc_subset_uIcc hy)
    exact ⟨c, hsub hc, hfc⟩

/-- Predpostavke trditve `najmanjsa_najvecja` se dajo izpolniti. -/
example : (0:ℝ) ≤ 1 ∧ ContinuousOn (fun x : ℝ => x) (Icc 0 1) := ⟨by norm_num, continuousOn_id⟩

/-- Razlaga 4 in ustno vprašanje 2: `f(x) = x` je na odprtem intervalu `(0, 1)` zvezna, a največje
vrednosti nima. -/
theorem odprt_brez_maksimuma : ¬ ∃ c ∈ Ioo (0:ℝ) 1, ∀ x ∈ Ioo (0:ℝ) 1, x ≤ c := by
  rintro ⟨c, ⟨h0, h1⟩, h⟩
  have := h ((c + 1) / 2) ⟨by linarith, by linarith⟩
  linarith

/-- Razlaga 4: `1/x` na `[−1, 1]` (za `x ≠ 0`) raste čez vse meje, zato največje vrednosti nima. -/
theorem ena_skozi_x_neomejena (M : ℝ) : ∃ x ∈ Icc (-1:ℝ) 1, x ≠ 0 ∧ M < 1 / x := by
  refine ⟨1 / (|M| + 2), ⟨?_, ?_⟩, by positivity, ?_⟩
  · have : 0 < 1 / (|M| + 2) := by positivity
    linarith
  · rw [div_le_one (by positivity)]
    linarith [abs_nonneg M]
  · rw [one_div_one_div]
    linarith [le_abs_self M]

/-- Razlaga 4 in pogoste napake: `1/x` na `[−1, 1]` ni zvezna (sicer bi bila omejena), čeprav imata
`f(−1) = −1` in `f(1) = 1` različna predznaka, ničle pa ni. -/
theorem ena_skozi_x :
    ¬ ContinuousOn (fun x : ℝ => 1 / x) (Icc (-1) 1) ∧ (1 / (-1:ℝ)) * (1 / 1) < 0 ∧
      ∀ x ∈ Icc (-1:ℝ) 1, x ≠ 0 → 1 / x ≠ 0 := by
  refine ⟨fun hc => ?_, by norm_num, fun x _ hx => one_div_ne_zero hx⟩
  obtain ⟨M, hM⟩ := isCompact_Icc.bddAbove_image hc
  obtain ⟨x, hx, _, hlt⟩ := ena_skozi_x_neomejena M
  have := hM ⟨x, hx, rfl⟩
  linarith

/-! ## Razlaga, 5: bisekcija -/

/-- Razlaga 5: po `n` korakih bisekcije ima interval dolžino `dₙ = (b − a)/2ⁿ`. -/
theorem dolzina (f : ℝ → ℝ) (a b : ℝ) (n : ℕ) :
    (bisekcija f a b n).2 - (bisekcija f a b n).1 = (b - a) / 2 ^ n := by
  induction n with
  | zero => simp [bisekcija]
  | succ n ih =>
    simp only [bisekcija, korak]
    split_ifs
    · rw [pow_succ, ← div_div, ← ih]; ring
    · rw [pow_succ, ← div_div, ← ih]; ring

/-- Razlaga 5 in ustno vprašanje 3: bisekcija ohrani pogoj — vsak interval leži v `[a, b]`, krajišči
imata vrednosti različnih predznakov (`f(aₙ)·f(bₙ) ≤ 0`). -/
theorem bisekcija_pogoj (f : ℝ → ℝ) (a b : ℝ) (hab : a ≤ b) (hf : f a * f b ≤ 0) (n : ℕ) :
    a ≤ (bisekcija f a b n).1 ∧ (bisekcija f a b n).1 ≤ (bisekcija f a b n).2 ∧
      (bisekcija f a b n).2 ≤ b ∧ f (bisekcija f a b n).1 * f (bisekcija f a b n).2 ≤ 0 := by
  induction n with
  | zero => exact ⟨le_rfl, hab, le_rfl, hf⟩
  | succ n ih =>
    obtain ⟨h1, h2, h3, h4⟩ := ih
    simp only [bisekcija, korak]
    split_ifs with h
    · exact ⟨h1, by linarith, by linarith, h⟩
    · refine ⟨by linarith, by linarith, h3, ?_⟩
      push Not at h
      set l := (bisekcija f a b n).1
      set r := (bisekcija f a b n).2
      set c := (l + r) / 2
      by_contra hc
      push Not at hc
      have e1 := mul_pos h hc
      have e2 := mul_nonpos_of_nonpos_of_nonneg h4 (sq_nonneg (f c))
      nlinarith

/-- Razlaga 5 in ustno vprašanje 3: če je `f` zvezna na `[a, b]` in `f(a)·f(b) ≤ 0`, je v vsakem intervalu
bisekcije ničla; po `n` korakih jo torej poznamo na natančnost `(b − a)/2ⁿ`. -/
theorem bisekcija_nicla (f : ℝ → ℝ) (a b : ℝ) (hab : a ≤ b) (hf : ContinuousOn f (Icc a b))
    (h : f a * f b ≤ 0) (n : ℕ) :
    ∃ c ∈ Icc (bisekcija f a b n).1 (bisekcija f a b n).2, f c = 0 := by
  obtain ⟨h1, h2, h3, h4⟩ := bisekcija_pogoj f a b hab h n
  have hsub : Icc (bisekcija f a b n).1 (bisekcija f a b n).2 ⊆ Icc a b := Icc_subset_Icc h1 h3
  have := intermediate_value_uIcc (f := f) (a := (bisekcija f a b n).1) (b := (bisekcija f a b n).2)
    (by rw [uIcc_of_le h2]; exact hf.mono hsub) (nic_med h4)
  rw [uIcc_of_le h2] at this
  obtain ⟨c, hc, hfc⟩ := this
  exact ⟨c, hc, hfc⟩

/-- Predpostavke trditev `bisekcija_pogoj` in `bisekcija_nicla` se dajo izpolniti. -/
example : (1:ℝ) ≤ 2 ∧ ContinuousOn (fun x : ℝ => x ^ 3 + x - 3) (Icc 1 2) ∧
    ((1:ℝ) ^ 3 + 1 - 3) * (2 ^ 3 + 2 - 3) ≤ 0 := ⟨by norm_num, by fun_prop, by norm_num⟩

/-- Razlaga 5, premisli: na intervalu dolžine 1 je interval krajši od `0,001` natanko po vsaj `10`
korakih (`2⁹ = 512` je premalo, `2¹⁰ = 1024` zadošča). -/
theorem premisli_tisocinka :
    (1:ℝ) / 2 ^ 9 > 0.001 ∧ (1:ℝ) / 2 ^ 10 < 0.001 ∧ ∀ n : ℕ, (1:ℝ) / 2 ^ n < 0.001 ↔ 10 ≤ n := by
  refine ⟨by norm_num, by norm_num, fun n => ?_⟩
  rw [show (0.001:ℝ) = 1 / 1000 by norm_num, one_div_lt_one_div (by positivity) (by norm_num)]
  rw [← koraki 1000 10 (by norm_num) (by norm_num) n]
  norm_cast

/-- Razlaga 6: če je ničla med krajiščema `lo ≤ x ≤ hi` in se obe krajišči zaokrožita na isto
število, se nanj zaokroži tudi ničla. -/
theorem zaokrozitev_krajisc (k : ℕ) (lo x hi : ℝ) (h1 : lo ≤ x) (h2 : x ≤ hi)
    (h : zaokrozi k lo = zaokrozi k hi) : zaokrozi k x = zaokrozi k lo := by
  have hp : (0:ℝ) < 10 ^ k := by positivity
  apply le_antisymm
  · rw [h]
    exact Int.floor_mono (by nlinarith)
  · exact Int.floor_mono (by nlinarith)

/-- Predpostavke trditve `zaokrozitev_krajisc` se dajo izpolniti (`1,2` med `1,2` in `1,2`). -/
example : (1.2:ℝ) ≤ 1.2 ∧ zaokrozi 1 1.2 = zaokrozi 1 1.2 := ⟨le_rfl, rfl⟩

/-- Razlaga 6: točka na krivulji z `f(x) = 2` je ničla `f(x) − 2`; presečišče `f` in `g` je ničla `f − g`. -/
theorem prevod_na_niclo (f g : ℝ → ℝ) (x : ℝ) :
    (f x = 2 ↔ f x - 2 = 0) ∧ (f x = g x ↔ f x - g x = 0) :=
  ⟨sub_eq_zero.symm, sub_eq_zero.symm⟩

/-! ## Primer 1: kaj vemo brez računanja ničel -/

/-- Funkcija iz primera 1. -/
noncomputable def f₁ (x : ℝ) : ℝ := x ^ 3 - 3 * x + 1

/-- Primer 1, korak 2: `f(0) = 1`, `f(1) = 1 − 3 + 1 = −1`, `f(2) = 8 − 6 + 1 = 3`. -/
theorem primer1_vrednosti :
    f₁ 0 = 1 ∧ f₁ 1 = 1 - 3 + 1 ∧ (1:ℝ) - 3 + 1 = -1 ∧ f₁ 2 = 8 - 6 + 1 ∧ (8:ℝ) - 6 + 1 = 3 := by
  norm_num [f₁]

/-- Primer 1, korak 3: na `(0, 1)` in na `(1, 2)` je vsaj po ena ničla. -/
theorem primer1_nicli : (∃ c ∈ Ioo (0:ℝ) 1, f₁ c = 0) ∧ (∃ c ∈ Ioo (1:ℝ) 2, f₁ c = 0) := by
  have hc : Continuous f₁ := by unfold f₁; fun_prop
  exact ⟨izrek_o_nicli f₁ 0 1 (by norm_num) hc.continuousOn (by norm_num [f₁]),
    izrek_o_nicli f₁ 1 2 (by norm_num) hc.continuousOn (by norm_num [f₁])⟩

/-- Primer 1, korak 4 (splošno): polinom tretje stopnje `ax³ + bx² + cx + d`, `a ≠ 0`, ima največ 3
ničle — vsaka končna množica ničel ima največ 3 elemente. -/
theorem kubicni_najvec_tri (a b c d : ℝ) (ha : a ≠ 0) (s : Finset ℝ)
    (hs : ∀ x ∈ s, a * x ^ 3 + b * x ^ 2 + c * x + d = 0) : s.card ≤ 3 := by
  open Polynomial in
  let P : ℝ[X] := C a * X ^ 3 + C b * X ^ 2 + C c * X + C d
  have hdeg : P.natDegree = 3 := natDegree_cubic ha
  have hP : P ≠ 0 := by intro h; rw [h] at hdeg; simp at hdeg
  have hsub : s ⊆ P.roots.toFinset := by
    intro x hx
    rw [Multiset.mem_toFinset, mem_roots hP]
    simp [P, hs x hx]
  calc s.card ≤ P.roots.toFinset.card := Finset.card_le_card hsub
    _ ≤ P.roots.card := Multiset.toFinset_card_le _
    _ ≤ P.natDegree := card_roots' P
    _ = 3 := hdeg

/-- Predpostavke trditve `kubicni_najvec_tri` se dajo izpolniti (`x³ − x` z ničlami `{−1, 0, 1}`). -/
example : (1:ℝ) ≠ 0 ∧ ∀ x ∈ ({-1, 0, 1} : Finset ℝ), 1 * x ^ 3 + 0 * x ^ 2 + (-1) * x + 0 = 0 := by
  refine ⟨by norm_num, ?_⟩
  intro x hx
  simp only [Finset.mem_insert, Finset.mem_singleton] at hx
  rcases hx with rfl | rfl | rfl <;> norm_num

/-- Primer 1, korak 5: `f` na `[0, 2]` doseže najmanjšo vrednost `m ≤ −1` in največjo `M ≥ 3`. -/
theorem primer1_min_max :
    ∃ m M : ℝ, (∃ x ∈ Icc (0:ℝ) 2, f₁ x = m ∧ ∀ y ∈ Icc (0:ℝ) 2, m ≤ f₁ y) ∧
      (∃ x ∈ Icc (0:ℝ) 2, f₁ x = M ∧ ∀ y ∈ Icc (0:ℝ) 2, f₁ y ≤ M) ∧ m ≤ -1 ∧ 3 ≤ M := by
  have hc : ContinuousOn f₁ (Icc 0 2) := by unfold f₁; fun_prop
  obtain ⟨x1, hx1, hmin⟩ := isCompact_Icc.exists_isMinOn (nonempty_Icc.mpr (by norm_num)) hc
  obtain ⟨x2, hx2, hmax⟩ := isCompact_Icc.exists_isMaxOn (nonempty_Icc.mpr (by norm_num)) hc
  refine ⟨f₁ x1, f₁ x2, ⟨x1, hx1, rfl, fun y hy => isMinOn_iff.mp hmin y hy⟩,
    ⟨x2, hx2, rfl, fun y hy => isMaxOn_iff.mp hmax y hy⟩, ?_, ?_⟩
  · calc f₁ x1 ≤ f₁ 1 := isMinOn_iff.mp hmin 1 ⟨by norm_num, by norm_num⟩
      _ = -1 := by norm_num [f₁]
  · calc (3:ℝ) = f₁ 2 := by norm_num [f₁]
      _ ≤ f₁ x2 := isMaxOn_iff.mp hmax 2 ⟨by norm_num, by norm_num⟩

/-- Primer 1, koraka 5 in 6: `f` na `[0, 2]` zavzame vsako vrednost med `−1` in `3`, na primer tudi `2`. -/
theorem primer1_vmesne (y : ℝ) (hy : y ∈ Icc (-1:ℝ) 3) : ∃ c ∈ Icc (0:ℝ) 2, f₁ c = y := by
  have hc : ContinuousOn f₁ (Icc 1 2) := by unfold f₁; fun_prop
  obtain ⟨c, hc1, hc2⟩ := intermediate_value_Icc (show (1:ℝ) ≤ 2 by norm_num) hc
    (show y ∈ Icc (f₁ 1) (f₁ 2) by norm_num [f₁]; exact hy)
  exact ⟨c, ⟨by linarith [hc1.1], hc1.2⟩, hc2⟩

/-- Predpostavka trditve `primer1_vmesne` se da izpolniti (`y = 2`). -/
example : (2:ℝ) ∈ Icc (-1:ℝ) 3 := ⟨by norm_num, by norm_num⟩

/-- Pogoste napake (»natanko ena ničla«): funkcija iz primera 1 ima `f(−2) = −1` in `f(2) = 3`, na
`[−2, 2]` pa tri ničle — na `(−2, −1)`, `(0, 1)` in `(1, 2)` — in drugih ničel nima. -/
theorem primer1_tri_nicle :
    f₁ (-2) = -1 ∧ f₁ 2 = 3 ∧ ∃ x₁ ∈ Ioo (-2:ℝ) (-1), ∃ x₂ ∈ Ioo (0:ℝ) 1, ∃ x₃ ∈ Ioo (1:ℝ) 2,
      ∀ x, f₁ x = 0 ↔ x = x₁ ∨ x = x₂ ∨ x = x₃ := by
  have hc : Continuous f₁ := by unfold f₁; fun_prop
  obtain ⟨x₁, h1, e1⟩ := izrek_o_nicli f₁ (-2) (-1) (by norm_num) hc.continuousOn (by norm_num [f₁])
  obtain ⟨x₂, h2, e2⟩ := izrek_o_nicli f₁ 0 1 (by norm_num) hc.continuousOn (by norm_num [f₁])
  obtain ⟨x₃, h3, e3⟩ := izrek_o_nicli f₁ 1 2 (by norm_num) hc.continuousOn (by norm_num [f₁])
  refine ⟨by norm_num [f₁], by norm_num [f₁], x₁, h1, x₂, h2, x₃, h3, fun x => ?_⟩
  have key := tri_nicle (-3) 1 x₁ x₂ x₃ (by linarith [h1.2, h2.1]) (by linarith [h1.2, h3.1])
    (by linarith [h2.2, h3.1]) (by unfold f₁ at e1; linarith) (by unfold f₁ at e2; linarith)
    (by unfold f₁ at e3; linarith) x
  rw [← key]
  unfold f₁
  constructor <;> intro h <;> linarith

/-! ## Primer 2: bisekcija s tabelo -/

/-- Funkcija iz primera 2. -/
noncomputable def f₂ (x : ℝ) : ℝ := x ^ 3 + x - 3

/-- Primer 2, korak 1: `f(1) = −1 < 0`, `f(2) = 7 > 0`. -/
theorem primer2_pogoj : f₂ 1 = -1 ∧ f₂ 2 = 7 := by norm_num [f₂]

/-- Primer 2, korak 2: vrednosti v sredinah — `f(1,5) = 1,875`, `f(1,25) ≈ 0,203`, `f(1,125) ≈ −0,451`,
`f(1,1875) ≈ −0,138`, `f(1,21875) ≈ 0,029` (z znaki, ki jih lekcija zapiše). -/
theorem primer2_vrednosti :
    f₂ 1.5 = 1.875 ∧ |f₂ 1.25 - 0.203| ≤ 0.0005 ∧ |f₂ 1.125 - (-0.451)| ≤ 0.0005 ∧
      |f₂ 1.1875 - (-0.138)| ≤ 0.0005 ∧ |f₂ 1.21875 - 0.029| ≤ 0.0005 ∧
      0 < f₂ 1.25 ∧ f₂ 1.125 < 0 ∧ f₂ 1.1875 < 0 ∧ 0 < f₂ 1.21875 := by
  refine ⟨by norm_num [f₂], blizu (by norm_num [f₂]) (by norm_num [f₂]),
    blizu (by norm_num [f₂]) (by norm_num [f₂]), blizu (by norm_num [f₂]) (by norm_num [f₂]),
    blizu (by norm_num [f₂]) (by norm_num [f₂]), by norm_num [f₂], by norm_num [f₂],
    by norm_num [f₂], by norm_num [f₂]⟩

/-- Primer 2, koraka 2 in 3: pet korakov bisekcije na `[1, 2]` da zapored intervale `[1; 1,5]`,
`[1; 1,25]`, `[1,125; 1,25]`, `[1,1875; 1,25]` in `[1,1875; 1,21875]`, dolžine `1/32 = 0,03125`. -/
theorem primer2_koraki :
    bisekcija f₂ 1 2 1 = (1, 1.5) ∧ bisekcija f₂ 1 2 2 = (1, 1.25) ∧
      bisekcija f₂ 1 2 3 = (1.125, 1.25) ∧ bisekcija f₂ 1 2 4 = (1.1875, 1.25) ∧
      bisekcija f₂ 1 2 5 = (1.1875, 1.21875) ∧ (1.25:ℝ) - 1.1875 = 0.0625 ∧
      (1.21875:ℝ) - 1.1875 = 1 / 32 ∧ (1:ℝ) / 32 = 0.03125 := by
  have k1 : bisekcija f₂ 1 2 1 = (1, 1.5) :=
    korak_levo f₂ 1 2 1.5 (by norm_num) (by norm_num [f₂])
  have k2 : bisekcija f₂ 1 2 2 = (1, 1.25) := by
    show korak f₂ (bisekcija f₂ 1 2 1) = _
    rw [k1]; exact korak_levo f₂ 1 1.5 1.25 (by norm_num) (by norm_num [f₂])
  have k3 : bisekcija f₂ 1 2 3 = (1.125, 1.25) := by
    show korak f₂ (bisekcija f₂ 1 2 2) = _
    rw [k2]; exact korak_desno f₂ 1 1.25 1.125 (by norm_num) (by norm_num [f₂])
  have k4 : bisekcija f₂ 1 2 4 = (1.1875, 1.25) := by
    show korak f₂ (bisekcija f₂ 1 2 3) = _
    rw [k3]; exact korak_desno f₂ 1.125 1.25 1.1875 (by norm_num) (by norm_num [f₂])
  have k5 : bisekcija f₂ 1 2 5 = (1.1875, 1.21875) := by
    show korak f₂ (bisekcija f₂ 1 2 4) = _
    rw [k4]; exact korak_levo f₂ 1.1875 1.25 1.21875 (by norm_num) (by norm_num [f₂])
  exact ⟨k1, k2, k3, k4, k5, by norm_num, by norm_num, by norm_num⟩

/-- Pogoste napake (»napačna polovica«): v prvem koraku primera 2 je `f(1,5) > 0`; kdor obdrži polovico
`[1,5; 2]` (kjer je `f(c) > 0`), ne pa `[1; 1,5]` z različnima predznakoma na krajiščih, na njej nima
ničle: `f` je naraščajoča, zato je `f(x) ≥ f(1,5) > 0` za `x ≥ 1,5`; ničla leži v `(1; 1,5)`. -/
theorem napacna_polovica :
    0 < f₂ 1.5 ∧ 0 < f₂ 2 ∧ (∀ x ∈ Set.Icc (1.5:ℝ) 2, 0 < f₂ x) ∧ ∃ x ∈ Set.Ioo (1:ℝ) 1.5, f₂ x = 0 := by
  have hc : Continuous f₂ := by unfold f₂; fun_prop
  refine ⟨by norm_num [f₂], by norm_num [f₂], fun x hx => ?_, ?_⟩
  · have y : 0 ≤ x - 1.5 := by linarith [hx.1]
    unfold f₂; nlinarith [mul_nonneg (mul_nonneg y y) y, mul_nonneg y y]
  · have h0 : (0:ℝ) ∈ Set.Ioo (f₂ 1) (f₂ 1.5) := by norm_num [f₂]
    exact intermediate_value_Ioo (by norm_num) hc.continuousOn h0

/-- Primer 2, korak 4: krajišči `1,1875` in `1,21875` se na eno decimalko zaokrožita na `1,2`, po
četrtem koraku pa `1,25` na `1,3`. -/
theorem primer2_zaokrozitev :
    zaokrozi 1 1.1875 = 12 ∧ zaokrozi 1 1.21875 = 12 ∧ zaokrozi 1 1.25 = 13 := by
  refine ⟨?_, ?_, ?_⟩ <;> rw [zaokrozi, Int.floor_eq_iff] <;> norm_num

/-- Primer 2, korak 5: `x³ + x − 3` ima natanko eno ničlo; leži na `(1,1875; 1,21875)` in se na eno
decimalko zaokroži na `1,2`. -/
theorem primer2_nicla :
    ∃ x ∈ Ioo (1.1875:ℝ) 1.21875, f₂ x = 0 ∧ (∀ y, f₂ y = 0 → y = x) ∧ zaokrozi 1 x = 12 := by
  have hc : ContinuousOn f₂ (Icc 1.1875 1.21875) := by unfold f₂; fun_prop
  obtain ⟨x, hx, hfx⟩ := izrek_o_nicli f₂ 1.1875 1.21875 (by norm_num) hc (by norm_num [f₂])
  have mono : StrictMono f₂ := by
    intro u v huv
    have : 0 < v ^ 2 + u * v + u ^ 2 + 1 := by nlinarith [sq_nonneg (u + v), sq_nonneg u, sq_nonneg v]
    have e : f₂ v - f₂ u = (v - u) * (v ^ 2 + u * v + u ^ 2 + 1) := by unfold f₂; ring
    nlinarith [mul_pos (sub_pos.mpr huv) this]
  refine ⟨x, hx, hfx, fun y hy => mono.injective (hy.trans hfx.symm), ?_⟩
  rw [zaokrozitev_krajisc 1 1.1875 x 1.21875 hx.1.le hx.2.le
    (by rw [(primer2_zaokrozitev).1, (primer2_zaokrozitev).2.1]), (primer2_zaokrozitev).1]

/-! ## Primer 3: skrite obresti pri nakupu na obroke -/

/-- Funkcija iz primera 3: `f(r) = 100r³ − 37r² − 37r − 37`. -/
noncomputable def f₃ (r : ℝ) : ℝ := 100 * r ^ 3 - 37 * r ^ 2 - 37 * r - 37

/-- Primer 3, formula in korak 1: `((1000r − 370)r − 370)r − 370 = 1000r³ − 370r² − 370r − 370`, kar je
`10·f(r)`. -/
theorem primer3_razcleni (r : ℝ) :
    ((1000 * r - 370) * r - 370) * r - 370 = 1000 * r ^ 3 - 370 * r ^ 2 - 370 * r - 370 ∧
      1000 * r ^ 3 - 370 * r ^ 2 - 370 * r - 370 = 10 * f₃ r := by
  exact ⟨by ring, by unfold f₃; ring⟩

/-- Primer 3, koraki 2–5: `f(1) = −11`, `f(1,1) ≈ 10,63`, `f(1,05) = −0,88`, `f(1,075) ≈ 4,70`,
`f(1,0625) ≈ 1,86`, `f(1,05625) ≈ 0,48`, `f(1,054) ≈ −0,011`, `f(1,055) ≈ 0,21`, `f(1,0535) ≈ −0,12`,
`f(1,0545) ≈ 0,098` (z zapisanimi znaki). -/
theorem primer3_vrednosti :
    f₃ 1 = -11 ∧ |f₃ 1.1 - 10.63| ≤ 0.005 ∧ f₃ 1.05 = -0.88 ∧ |f₃ 1.075 - 4.70| ≤ 0.005 ∧
      |f₃ 1.0625 - 1.86| ≤ 0.005 ∧ |f₃ 1.05625 - 0.48| ≤ 0.005 ∧
      |f₃ 1.054 - (-0.011)| ≤ 0.0005 ∧ |f₃ 1.055 - 0.21| ≤ 0.005 ∧
      |f₃ 1.0535 - (-0.12)| ≤ 0.005 ∧ |f₃ 1.0545 - 0.098| ≤ 0.0005 ∧
      0 < f₃ 1.1 ∧ 0 < f₃ 1.075 ∧ 0 < f₃ 1.0625 ∧ 0 < f₃ 1.05625 ∧ f₃ 1.054 < 0 ∧ 0 < f₃ 1.055 ∧
      f₃ 1.0535 < 0 ∧ 0 < f₃ 1.0545 := by
  refine ⟨by norm_num [f₃], blizu (by norm_num [f₃]) (by norm_num [f₃]), by norm_num [f₃],
    blizu (by norm_num [f₃]) (by norm_num [f₃]), blizu (by norm_num [f₃]) (by norm_num [f₃]),
    blizu (by norm_num [f₃]) (by norm_num [f₃]), blizu (by norm_num [f₃]) (by norm_num [f₃]),
    blizu (by norm_num [f₃]) (by norm_num [f₃]), blizu (by norm_num [f₃]) (by norm_num [f₃]),
    blizu (by norm_num [f₃]) (by norm_num [f₃]), ?_⟩
  norm_num [f₃]

/-- Primer 3, korak 3: štirje koraki bisekcije na `[1; 1,1]` dajo `[1,05; 1,1]`, `[1,05; 1,075]`,
`[1,05; 1,0625]` in `[1,05; 1,05625]`. -/
theorem primer3_koraki :
    bisekcija f₃ 1 1.1 1 = (1.05, 1.1) ∧ bisekcija f₃ 1 1.1 2 = (1.05, 1.075) ∧
      bisekcija f₃ 1 1.1 3 = (1.05, 1.0625) ∧ bisekcija f₃ 1 1.1 4 = (1.05, 1.05625) := by
  have k1 : bisekcija f₃ 1 1.1 1 = (1.05, 1.1) :=
    korak_desno f₃ 1 1.1 1.05 (by norm_num) (by norm_num [f₃])
  have k2 : bisekcija f₃ 1 1.1 2 = (1.05, 1.075) := by
    show korak f₃ (bisekcija f₃ 1 1.1 1) = _
    rw [k1]; exact korak_levo f₃ 1.05 1.1 1.075 (by norm_num) (by norm_num [f₃])
  have k3 : bisekcija f₃ 1 1.1 3 = (1.05, 1.0625) := by
    show korak f₃ (bisekcija f₃ 1 1.1 2) = _
    rw [k2]; exact korak_levo f₃ 1.05 1.075 1.0625 (by norm_num) (by norm_num [f₃])
  have k4 : bisekcija f₃ 1 1.1 4 = (1.05, 1.05625) := by
    show korak f₃ (bisekcija f₃ 1 1.1 3) = _
    rw [k3]; exact korak_levo f₃ 1.05 1.0625 1.05625 (by norm_num) (by norm_num [f₃])
  exact ⟨k1, k2, k3, k4⟩

/-- Pomožna trditev za primer 3: `f` je na `[1/2, ∞)` strogo naraščajoča. -/
theorem f₃_narasca (x y : ℝ) (hx : 1 / 2 ≤ x) (hxy : x < y) : f₃ x < f₃ y := by
  have hy : 1 / 2 ≤ y := by linarith
  have a1 : x / 2 ≤ x ^ 2 := by nlinarith
  have a2 : y / 2 ≤ y ^ 2 := by nlinarith
  have a3 : (x + y) / 4 ≤ x * y := by nlinarith
  have hb : 0 < 100 * (y ^ 2 + x * y + x ^ 2) - 37 * (x + y) - 37 := by nlinarith
  have e : f₃ y - f₃ x = (y - x) * (100 * (y ^ 2 + x * y + x ^ 2) - 37 * (x + y) - 37) := by
    unfold f₃; ring
  nlinarith [mul_pos (sub_pos.mpr hxy) hb]

/-- Primer 3, koraki 5 in 7: enačba `f(r) = 0` ima natanko eno pozitivno rešitev; ta leži na
`(1,0535; 1,0545)`, zato je `p = 100(r − 1)` na desetinko odstotka `5,4 %`. -/
theorem primer3_obrestna_mera :
    ∃ r ∈ Ioo (1.0535:ℝ) 1.0545, f₃ r = 0 ∧ (∀ s, 0 < s → f₃ s = 0 → s = r) ∧
      zaokrozi 1 (100 * (r - 1)) = 54 := by
  have hc : ContinuousOn f₃ (Icc 1.0535 1.0545) := by unfold f₃; fun_prop
  obtain ⟨r, hr, hfr⟩ := izrek_o_nicli f₃ 1.0535 1.0545 (by norm_num) hc (by norm_num [f₃])
  refine ⟨r, hr, hfr, fun s hs hfs => ?_, ?_⟩
  · have hs2 : 1 / 2 ≤ s := by
      by_contra h
      push Not at h
      have : s ^ 3 ≤ 1 / 8 := by
        have := pow_le_pow_left₀ hs.le h.le 3
        norm_num at this; linarith
      unfold f₃ at hfs
      nlinarith [sq_nonneg s]
    rcases lt_trichotomy s r with h | h | h
    · exact absurd (hfs.trans hfr.symm) (f₃_narasca s r hs2 h).ne
    · exact h
    · exact absurd (hfr.trans hfs.symm) (f₃_narasca r s (by linarith [hr.1]) h).ne
  · rw [zaokrozi, Int.floor_eq_iff]
    constructor <;> norm_num <;> linarith [hr.1, hr.2]

/-- Primer 3, koraka 6 in 7: preizkus z `r = 1,054` — dolgovi po letih `684 €`, približno `350,94 €`
in skoraj `0 €` (natanko `−0,113456 €`); na obroke plačaš `3·370 = 1110 €`. -/
theorem primer3_preizkus :
    1000 * (1.054:ℝ) - 370 = 684 ∧ |684 * (1.054:ℝ) - 370 - 350.94| ≤ 0.005 ∧
      (684 * (1.054:ℝ) - 370) * 1.054 - 370 = -0.113456 ∧ 3 * 370 = 1110 := by
  refine ⟨by norm_num, blizu (by norm_num) (by norm_num), by norm_num, by norm_num⟩

/-! ## Primer 4: točka na krivulji s tabelo -/

/-- Funkcija iz primera 4: `g(x) = x³ − 3x − 1`. -/
noncomputable def g₄ (x : ℝ) : ℝ := x ^ 3 - 3 * x - 1

/-- Primer 4, formula: `g(x) = x³ − 3x + 1 − 2 = x³ − 3x − 1`. -/
theorem primer4_g (x : ℝ) : x ^ 3 - 3 * x + 1 - 2 = g₄ x := by unfold g₄; ring

/-- Primer 4, koraka 1 in 2 ter premisli: `g(1,8) = −0,568`, `g(1,9) = 0,159`, `g(1,87) ≈ −0,071`,
`g(1,88) ≈ 0,005`, `g(1,875) ≈ −0,033`. -/
theorem primer4_vrednosti :
    g₄ 1.8 = -0.568 ∧ g₄ 1.9 = 0.159 ∧ |g₄ 1.87 - (-0.071)| ≤ 0.0005 ∧ |g₄ 1.88 - 0.005| ≤ 0.0005 ∧
      |g₄ 1.875 - (-0.033)| ≤ 0.0005 ∧ g₄ 1.87 < 0 ∧ 0 < g₄ 1.88 ∧ g₄ 1.875 < 0 := by
  refine ⟨by norm_num [g₄], by norm_num [g₄], blizu (by norm_num [g₄]) (by norm_num [g₄]),
    blizu (by norm_num [g₄]) (by norm_num [g₄]), blizu (by norm_num [g₄]) (by norm_num [g₄]),
    by norm_num [g₄], by norm_num [g₄], by norm_num [g₄]⟩

/-- Primer 4, premisli: na `[1, 2]` ima `g` natanko eno ničlo, ta leži na `(1,875; 1,88)` in se na dve
decimalki zaokroži na `1,88`; to je abscisa točke `T(1,88; 2)` na krivulji `y = x³ − 3x + 1`. -/
theorem primer4_tocka :
    ∃ x ∈ Ioo (1.875:ℝ) 1.88, g₄ x = 0 ∧ x ^ 3 - 3 * x + 1 = 2 ∧
      (∀ y ∈ Icc (1:ℝ) 2, g₄ y = 0 → y = x) ∧ zaokrozi 2 x = 188 := by
  have hc : ContinuousOn g₄ (Icc 1.875 1.88) := by unfold g₄; fun_prop
  obtain ⟨x, hx, hgx⟩ := izrek_o_nicli g₄ 1.875 1.88 (by norm_num) hc (by norm_num [g₄])
  have mono : ∀ u v : ℝ, 1 ≤ u → u < v → g₄ u < g₄ v := by
    intro u v hu huv
    have : 0 < v ^ 2 + u * v + u ^ 2 - 3 := by nlinarith
    have e : g₄ v - g₄ u = (v - u) * (v ^ 2 + u * v + u ^ 2 - 3) := by unfold g₄; ring
    nlinarith [mul_pos (sub_pos.mpr huv) this]
  refine ⟨x, hx, hgx, by have := primer4_g x; linarith, fun y hy hgy => ?_, ?_⟩
  · rcases lt_trichotomy y x with h | h | h
    · exact absurd (hgy.trans hgx.symm) (mono y x hy.1 h).ne
    · exact h
    · exact absurd (hgx.trans hgy.symm) (mono x y (by linarith [hx.1]) h).ne
  · rw [zaokrozi, Int.floor_eq_iff]
    constructor <;> norm_num <;> linarith [hx.1, hx.2]

/-! ## Za maturo, naloga 1 -/

/-- Funkcija iz naloge 1: `f(x) = x³ − 4x + 1`. -/
noncomputable def n₁ (x : ℝ) : ℝ := x ^ 3 - 4 * x + 1

/-- Naloga 1 a), korak 1: `f(−3) = −27 + 12 + 1 = −14`, `f(−2) = −8 + 8 + 1 = 1`, `f(0) = 1`,
`f(1) = 1 − 4 + 1 = −2`, `f(2) = 8 − 8 + 1 = 1`. -/
theorem naloga1_vrednosti :
    n₁ (-3) = -27 + 12 + 1 ∧ (-27:ℝ) + 12 + 1 = -14 ∧ n₁ (-2) = -8 + 8 + 1 ∧ (-8:ℝ) + 8 + 1 = 1 ∧
      n₁ 0 = 1 ∧ n₁ 1 = 1 - 4 + 1 ∧ (1:ℝ) - 4 + 1 = -2 ∧ n₁ 2 = 8 - 8 + 1 ∧ (8:ℝ) - 8 + 1 = 1 := by
  norm_num [n₁]

/-- Naloga 1 a), koraki 2 in 3: enačba `x³ − 4x + 1 = 0` ima natanko tri realne rešitve, po eno na
`(−3, −2)`, `(0, 1)` in `(1, 2)`. -/
theorem naloga1_tri_resitve :
    ∃ x₁ ∈ Ioo (-3:ℝ) (-2), ∃ x₂ ∈ Ioo (0:ℝ) 1, ∃ x₃ ∈ Ioo (1:ℝ) 2,
      ∀ x, n₁ x = 0 ↔ x = x₁ ∨ x = x₂ ∨ x = x₃ := by
  have hc : Continuous n₁ := by unfold n₁; fun_prop
  obtain ⟨x₁, h1, e1⟩ := izrek_o_nicli n₁ (-3) (-2) (by norm_num) hc.continuousOn (by norm_num [n₁])
  obtain ⟨x₂, h2, e2⟩ := izrek_o_nicli n₁ 0 1 (by norm_num) hc.continuousOn (by norm_num [n₁])
  obtain ⟨x₃, h3, e3⟩ := izrek_o_nicli n₁ 1 2 (by norm_num) hc.continuousOn (by norm_num [n₁])
  refine ⟨x₁, h1, x₂, h2, x₃, h3, fun x => ?_⟩
  have key := tri_nicle (-4) 1 x₁ x₂ x₃ (by linarith [h1.2, h2.1]) (by linarith [h1.2, h3.1])
    (by linarith [h2.2, h3.1]) (by unfold n₁ at e1; linarith) (by unfold n₁ at e2; linarith)
    (by unfold n₁ at e3; linarith) x
  rw [← key]
  unfold n₁
  constructor <;> intro h <;> linarith

/-- Naloga 1 b): `f(0,5) = 0,125 − 2 + 1 = −0,875`, `f(0,25) = 1/64 − 1 + 1 = 1/64`; dva koraka
bisekcije na `[0, 1]` dasta `[0; 0,5]` in `[0,25; 0,5]`, na katerem leži ničla. -/
theorem naloga1_bisekcija :
    n₁ 0.5 = 0.125 - 2 + 1 ∧ (0.125:ℝ) - 2 + 1 = -0.875 ∧ n₁ 0.25 = 1 / 64 - 1 + 1 ∧
      (1 / 64 : ℝ) - 1 + 1 = 1 / 64 ∧ bisekcija n₁ 0 1 1 = (0, 0.5) ∧
      bisekcija n₁ 0 1 2 = (0.25, 0.5) ∧ ∃ c ∈ Ioo (0.25:ℝ) 0.5, n₁ c = 0 := by
  have k1 : bisekcija n₁ 0 1 1 = (0, 0.5) :=
    korak_levo n₁ 0 1 0.5 (by norm_num) (by norm_num [n₁])
  have k2 : bisekcija n₁ 0 1 2 = (0.25, 0.5) := by
    show korak n₁ (bisekcija n₁ 0 1 1) = _
    rw [k1]; exact korak_desno n₁ 0 0.5 0.25 (by norm_num) (by norm_num [n₁])
  have hc : ContinuousOn n₁ (Icc 0.25 0.5) := by unfold n₁; fun_prop
  exact ⟨by norm_num [n₁], by norm_num, by norm_num [n₁], by norm_num, k1, k2,
    izrek_o_nicli n₁ 0.25 0.5 (by norm_num) hc (by norm_num [n₁])⟩

/-- Naloga 1 c): `f` na `[0, 2]` doseže najmanjšo vrednost `m` in velja `m ≤ f(1) = −2`. -/
theorem naloga1_minimum :
    ∃ x₀ ∈ Icc (0:ℝ) 2, (∀ y ∈ Icc (0:ℝ) 2, n₁ x₀ ≤ n₁ y) ∧ n₁ x₀ ≤ -2 := by
  have hc : ContinuousOn n₁ (Icc 0 2) := by unfold n₁; fun_prop
  obtain ⟨x₀, hx₀, hmin⟩ := isCompact_Icc.exists_isMinOn (nonempty_Icc.mpr (by norm_num)) hc
  refine ⟨x₀, hx₀, fun y hy => isMinOn_iff.mp hmin y hy, ?_⟩
  calc n₁ x₀ ≤ n₁ 1 := isMinOn_iff.mp hmin 1 ⟨by norm_num, by norm_num⟩
    _ = -2 := by norm_num [n₁]

/-! ## Za maturo, naloga 2 -/

/-- Funkcija iz naloge 2: `h(x) = 2ˣ + x² − 3`. -/
noncomputable def h₂ (x : ℝ) : ℝ := (2:ℝ) ^ x + x ^ 2 - 3

/-- Pomožna trditev: `h` je zvezna. -/
theorem h₂_zvezna : Continuous h₂ := by
  unfold h₂
  exact ((Real.continuous_const_rpow (by norm_num)).add (continuous_pow 2)).sub continuous_const

/-- Naloga 2 a): pri `x = 1` je `2¹ = 2` in `3 − 1² = 2`; abscise presečišč so ničle
`h(x) = 2ˣ + x² − 3`. -/
theorem naloga2_a :
    ((2:ℝ) ^ (1:ℝ) = 2 ∧ (3:ℝ) - 1 ^ 2 = 2) ∧ ∀ x : ℝ, (2:ℝ) ^ x = 3 - x ^ 2 ↔ h₂ x = 0 := by
  refine ⟨⟨Real.rpow_one 2, by norm_num⟩, fun x => ?_⟩
  unfold h₂
  constructor <;> intro h <;> linarith

/-- Naloga 2 b): `h(−2) = 0,25 + 4 − 3 = 1,25 > 0`, `h(−1) = 0,5 + 1 − 3 = −1,5 < 0`; po izreku o ničli
je na `(−2, −1)` vsaj ena ničla. -/
theorem naloga2_b :
    h₂ (-2) = 0.25 + 4 - 3 ∧ (0.25:ℝ) + 4 - 3 = 1.25 ∧ h₂ (-1) = 0.5 + 1 - 3 ∧ (0.5:ℝ) + 1 - 3 = -1.5 ∧
      ∃ c ∈ Ioo (-2:ℝ) (-1), h₂ c = 0 := by
  have e2 : (2:ℝ) ^ (-2:ℝ) = 0.25 := by
    rw [show (-2:ℝ) = ((-2:ℤ):ℝ) by norm_num, Real.rpow_intCast]; norm_num
  have e1 : (2:ℝ) ^ (-1:ℝ) = 0.5 := by
    rw [show (-1:ℝ) = ((-1:ℤ):ℝ) by norm_num, Real.rpow_intCast]; norm_num
  have v2 : h₂ (-2) = 0.25 + 4 - 3 := by unfold h₂; rw [e2]; norm_num
  have v1 : h₂ (-1) = 0.5 + 1 - 3 := by unfold h₂; rw [e1]; norm_num
  refine ⟨v2, by norm_num, v1, by norm_num, izrek_o_nicli h₂ (-2) (-1) (by norm_num)
    h₂_zvezna.continuousOn (by rw [v1, v2]; norm_num)⟩

/-- Ocene potenc `2ᶜ` v sredinah in točkah tabele naloge 2. -/
theorem ocene_potenc :
    ((0.353553:ℝ) < 2 ^ (-1.5:ℝ) ∧ (2:ℝ) ^ (-1.5:ℝ) < 0.353554) ∧
    ((0.297301:ℝ) < 2 ^ (-1.75:ℝ) ∧ (2:ℝ) ^ (-1.75:ℝ) < 0.297302) ∧
    ((0.324209:ℝ) < 2 ^ (-1.625:ℝ) ∧ (2:ℝ) ^ (-1.625:ℝ) < 0.324210) ∧
    ((0.307786:ℝ) < 2 ^ (-1.7:ℝ) ∧ (2:ℝ) ^ (-1.7:ℝ) < 0.307787) ∧
    ((0.329876:ℝ) < 2 ^ (-1.6:ℝ) ∧ (2:ℝ) ^ (-1.6:ℝ) < 0.329877) ∧
    ((0.320856:ℝ) < 2 ^ (-1.64:ℝ) ∧ (2:ℝ) ^ (-1.64:ℝ) < 0.320857) ∧
    ((0.323088:ℝ) < 2 ^ (-1.63:ℝ) ∧ (2:ℝ) ^ (-1.63:ℝ) < 0.323089) := by
  refine ⟨ocena_dva _ 2 (-3) (by norm_num) _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    ocena_dva _ 4 (-7) (by norm_num) _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    ocena_dva _ 8 (-13) (by norm_num) _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    ocena_dva _ 10 (-17) (by norm_num) _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    ocena_dva _ 5 (-8) (by norm_num) _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    ocena_dva _ 25 (-41) (by norm_num) _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    ocena_dva _ 100 (-163) (by norm_num) _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num)⟩

set_option exponentiation.threshold 400 in
/-- Ocena potence `2^(−1,635)` (meja zaokroževanja v nalogi 2 d). -/
theorem ocena_meje : (0.321970:ℝ) < 2 ^ (-1.635:ℝ) ∧ (2:ℝ) ^ (-1.635:ℝ) < 0.321971 :=
  ocena_dva _ 200 (-327) (by norm_num) _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num)

/-- Naloga 2 c), d): vrednosti `h(−1,5) ≈ −0,396`, `h(−1,75) ≈ 0,360`, `h(−1,625) ≈ −0,035`,
`h(−1,7) ≈ 0,198`, `h(−1,6) ≈ −0,110`, `h(−1,64) ≈ 0,0105`, `h(−1,63) ≈ −0,0200`, `h(−1,635) ≈ −0,0048`
(z zapisanimi znaki). -/
theorem naloga2_vrednosti :
    |h₂ (-1.5) - (-0.396)| ≤ 0.0005 ∧ |h₂ (-1.75) - 0.360| ≤ 0.0005 ∧
      |h₂ (-1.625) - (-0.035)| ≤ 0.0005 ∧ |h₂ (-1.7) - 0.198| ≤ 0.0005 ∧
      |h₂ (-1.6) - (-0.110)| ≤ 0.0005 ∧ |h₂ (-1.64) - 0.0105| ≤ 0.00005 ∧
      |h₂ (-1.63) - (-0.0200)| ≤ 0.00005 ∧ |h₂ (-1.635) - (-0.0048)| ≤ 0.00005 ∧
      h₂ (-1.5) < 0 ∧ 0 < h₂ (-1.75) ∧ h₂ (-1.625) < 0 ∧ 0 < h₂ (-1.7) ∧ h₂ (-1.6) < 0 ∧
      0 < h₂ (-1.64) ∧ h₂ (-1.63) < 0 ∧ h₂ (-1.635) < 0 := by
  obtain ⟨⟨a1, b1⟩, ⟨a2, b2⟩, ⟨a3, b3⟩, ⟨a4, b4⟩, ⟨a5, b5⟩, ⟨a6, b6⟩, ⟨a7, b7⟩⟩ := ocene_potenc
  obtain ⟨a8, b8⟩ := ocena_meje
  unfold h₂
  refine ⟨blizu (by norm_num; linarith) (by norm_num; linarith),
    blizu (by norm_num; linarith) (by norm_num; linarith),
    blizu (by norm_num; linarith) (by norm_num; linarith),
    blizu (by norm_num; linarith) (by norm_num; linarith),
    blizu (by norm_num; linarith) (by norm_num; linarith),
    blizu (by norm_num; linarith) (by norm_num; linarith),
    blizu (by norm_num; linarith) (by norm_num; linarith),
    blizu (by norm_num; linarith) (by norm_num; linarith), ?_⟩
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_⟩ <;> norm_num <;> linarith

/-- Naloga 2 c): trije koraki bisekcije na `[−2, −1]` dajo `[−2; −1,5]`, `[−1,75; −1,5]` in
`[−1,75; −1,625]`. -/
theorem naloga2_koraki :
    bisekcija h₂ (-2) (-1) 1 = (-2, -1.5) ∧ bisekcija h₂ (-2) (-1) 2 = (-1.75, -1.5) ∧
      bisekcija h₂ (-2) (-1) 3 = (-1.75, -1.625) := by
  obtain ⟨-, -, -, -, -, -, -, -, s1, s2, s3, -⟩ := naloga2_vrednosti
  obtain ⟨v2, -, -, -, -⟩ := naloga2_b
  have hm2 : 0 < h₂ (-2) := by rw [v2]; norm_num
  have k1 : bisekcija h₂ (-2) (-1) 1 = (-2, -1.5) :=
    korak_levo h₂ (-2) (-1) (-1.5) (by norm_num) (mul_neg_of_pos_of_neg hm2 s1).le
  have k2 : bisekcija h₂ (-2) (-1) 2 = (-1.75, -1.5) := by
    show korak h₂ (bisekcija h₂ (-2) (-1) 1) = _
    rw [k1]; exact korak_desno h₂ (-2) (-1.5) (-1.75) (by norm_num) (mul_pos hm2 s2)
  have k3 : bisekcija h₂ (-2) (-1) 3 = (-1.75, -1.625) := by
    show korak h₂ (bisekcija h₂ (-2) (-1) 2) = _
    rw [k2]; exact korak_levo h₂ (-1.75) (-1.5) (-1.625) (by norm_num) (mul_neg_of_pos_of_neg s2 s3).le
  exact ⟨k1, k2, k3⟩

/-- Pomožna trditev za nalogo 2: `h` je na `[−2, −1]` strogo padajoča (`2ʸ − 2ˣ ≤ (y − x)/2`, ker je
`2ᵗ ≤ 1 + t` za `0 ≤ t ≤ 1` in `2ˣ ≤ 1/2`). -/
theorem h₂_pada (x y : ℝ) (hx : -2 ≤ x) (hxy : x < y) (hy : y ≤ -1) : h₂ y < h₂ x := by
  set t := y - x with ht
  have t0 : 0 ≤ t := by linarith
  have t1 : t ≤ 1 := by linarith
  have bern : (2:ℝ) ^ t ≤ 1 + t := by
    have := rpow_one_add_le_one_add_mul_self (s := 1) (p := t) (by norm_num) t0 t1
    norm_num at this; linarith
  have hx2 : (2:ℝ) ^ x ≤ 1 / 2 := by
    calc (2:ℝ) ^ x ≤ 2 ^ (-1:ℝ) := Real.rpow_le_rpow_of_exponent_le (by norm_num) (by linarith)
      _ = 1 / 2 := by rw [Real.rpow_neg_one]; norm_num
  have hxp : 0 ≤ (2:ℝ) ^ x := Real.rpow_nonneg (by norm_num) x
  have hy2 : (2:ℝ) ^ y = 2 ^ x * 2 ^ t := by
    rw [← Real.rpow_add (by norm_num)]; congr 1; linarith
  have d1 : (2:ℝ) ^ y - 2 ^ x ≤ t / 2 := by
    rw [hy2]
    have : (2:ℝ) ^ x * (2 ^ t - 1) ≤ 2 ^ x * t := mul_le_mul_of_nonneg_left (by linarith) hxp
    have : (2:ℝ) ^ x * t ≤ 1 / 2 * t := mul_le_mul_of_nonneg_right hx2 t0
    nlinarith
  have d2 : y ^ 2 - x ^ 2 ≤ -2 * t := by
    have : y ^ 2 - x ^ 2 = t * (y + x) := by rw [ht]; ring
    rw [this]
    nlinarith
  unfold h₂
  nlinarith

/-- Naloga 2 d): na `[−2, −1]` ima `h` natanko eno ničlo; ta leži na `(−1,64; −1,635)` in se na dve
decimalki zaokroži na `−1,64`. -/
theorem naloga2_d :
    ∃ x ∈ Ioo (-1.64:ℝ) (-1.635), h₂ x = 0 ∧ (∀ y ∈ Icc (-2:ℝ) (-1), h₂ y = 0 → y = x) ∧
      zaokrozi 2 x = -164 := by
  obtain ⟨-, -, -, -, -, -, -, -, -, -, -, -, -, p1, -, p2⟩ := naloga2_vrednosti
  obtain ⟨x, hx, hhx⟩ := izrek_o_nicli h₂ (-1.64) (-1.635) (by norm_num) h₂_zvezna.continuousOn
    (mul_neg_of_pos_of_neg p1 p2)
  refine ⟨x, hx, hhx, fun y hy hhy => ?_, ?_⟩
  · rcases lt_trichotomy y x with h | h | h
    · exact absurd (hhx.trans hhy.symm) (h₂_pada y x hy.1 h (by linarith [hx.2])).ne
    · exact h
    · exact absurd (hhy.trans hhx.symm) (h₂_pada x y (by linarith [hx.1]) h hy.2).ne
  · rw [zaokrozi, Int.floor_eq_iff]
    constructor <;> norm_num <;> linarith [hx.1, hx.2]

/-- Naloga 2 e): na `[−2, −1]` (dolžina 1) je interval krajši od `0,005` natanko po vsaj `8` korakih
(`2⁷ = 128` je premalo, `2⁸ = 256` zadošča, `1/2⁸ = 0,00390625`). -/
theorem naloga2_e :
    (1:ℝ) / 2 ^ 8 = 0.00390625 ∧ ∀ n : ℕ, (1:ℝ) / 2 ^ n < 0.005 ↔ 8 ≤ n := by
  refine ⟨by norm_num, fun n => ?_⟩
  rw [show (0.005:ℝ) = 1 / 200 by norm_num, one_div_lt_one_div (by positivity) (by norm_num)]
  rw [← koraki 200 8 (by norm_num) (by norm_num) n]
  norm_cast

/-! ## Ustna vprašanja -/

/-- Funkcija s skokom iz ustnega vprašanja 1: `−1` za `x < 0`, `1` za `x ≥ 0`. -/
noncomputable def predznak (x : ℝ) : ℝ := if x < 0 then -1 else 1

/-- Ustno vprašanje 1: brez zveznosti izrek ne velja (`−1` za `x < 0`, `1` za `x ≥ 0` na `[−1, 1]` ima
različna predznaka na krajiščih, ničle pa ne); `x² + 1` je zvezna z enakima predznakoma brez ničle,
`x²` pa ima pri enakih predznakih ničlo `0`. -/
theorem ustno1 :
    (predznak (-1) * predznak 1 < 0 ∧ ∀ x, predznak x ≠ 0) ∧
      ((-1:ℝ) ^ 2 + 1 > 0 ∧ (1:ℝ) ^ 2 + 1 > 0 ∧ ∀ x : ℝ, x ^ 2 + 1 ≠ 0) ∧
      ((-1:ℝ) ^ 2 > 0 ∧ (1:ℝ) ^ 2 > 0 ∧ (0:ℝ) ^ 2 = 0) := by
  refine ⟨⟨by norm_num [predznak], fun x => ?_⟩, ⟨by norm_num, by norm_num, fun x => by positivity⟩,
    by norm_num⟩
  unfold predznak
  split_ifs <;> norm_num

/-! ## Drugače -/

/-- Drugače, kot zgodba: cele cene od `201 €` do `264 €` so `64` možnosti; po odgovoru »da« ostane `32`
cen (`233 €` do `264 €`), po »ne« `16` (`233 €` do `248 €`); po šestih vprašanjih `64/2⁶ = 1`. -/
theorem zgodba_cene :
    (Finset.Icc 201 264).card = 64 ∧ (Finset.Icc 233 264).card = 32 ∧ (Finset.Icc 233 248).card = 16 ∧
      64 / 2 ^ 6 = 1 := by
  simp

/-- Funkcija iz razdelka »Korak za korakom«: `f(x) = x³ − 2x − 5`. -/
noncomputable def d₃ (x : ℝ) : ℝ := x ^ 3 - 2 * x - 5

/-- Drugače, korak za korakom: `f(2) = −1`, `f(3) = 16`, `f(2,5) = 5,625`, `f(2,25) ≈ 1,89`,
`f(2,125) ≈ 0,35`; intervali `[2; 2,5]`, `[2; 2,25]`, `[2; 2,125]` dolžine `0,125`, krajišči se zaokrožita
na `2,0` in `2,1`. -/
theorem drugace_koraki :
    d₃ 2 = -1 ∧ d₃ 3 = 16 ∧ d₃ 2.5 = 5.625 ∧ |d₃ 2.25 - 1.89| ≤ 0.005 ∧ |d₃ 2.125 - 0.35| ≤ 0.005 ∧
      bisekcija d₃ 2 3 1 = (2, 2.5) ∧ bisekcija d₃ 2 3 2 = (2, 2.25) ∧
      bisekcija d₃ 2 3 3 = (2, 2.125) ∧ (2.125:ℝ) - 2 = 0.125 ∧
      zaokrozi 1 2 = 20 ∧ zaokrozi 1 2.125 = 21 := by
  have k1 : bisekcija d₃ 2 3 1 = (2, 2.5) :=
    korak_levo d₃ 2 3 2.5 (by norm_num) (by norm_num [d₃])
  have k2 : bisekcija d₃ 2 3 2 = (2, 2.25) := by
    show korak d₃ (bisekcija d₃ 2 3 1) = _
    rw [k1]; exact korak_levo d₃ 2 2.5 2.25 (by norm_num) (by norm_num [d₃])
  have k3 : bisekcija d₃ 2 3 3 = (2, 2.125) := by
    show korak d₃ (bisekcija d₃ 2 3 2) = _
    rw [k2]; exact korak_levo d₃ 2 2.25 2.125 (by norm_num) (by norm_num [d₃])
  refine ⟨by norm_num [d₃], by norm_num [d₃], by norm_num [d₃],
    blizu (by norm_num [d₃]) (by norm_num [d₃]), blizu (by norm_num [d₃]) (by norm_num [d₃]),
    k1, k2, k3, by norm_num, ?_, ?_⟩ <;> rw [zaokrozi, Int.floor_eq_iff] <;> norm_num

/-! ## Preveri se -/

/-- Preveri se 1: `f` zvezna na `[1, 4]`, `f(1) = −2`, `f(4) = 5` ⇒ `f` na `[1, 4]` zavzame vrednost `3`. -/
theorem kviz1 (f : ℝ → ℝ) (hf : ContinuousOn f (Icc 1 4)) (h1 : f 1 = -2) (h4 : f 4 = 5) :
    ∃ c ∈ Icc (1:ℝ) 4, f c = 3 :=
  intermediate_value_Icc (by norm_num) hf (by rw [h1, h4]; norm_num)

/-- Predpostavke trditve `kviz1` se dajo izpolniti (`f(x) = (7x − 13)/3`). -/
example : ContinuousOn (fun x : ℝ => (7 * x - 13) / 3) (Icc 1 4) ∧
    (7 * (1:ℝ) - 13) / 3 = -2 ∧ (7 * (4:ℝ) - 13) / 3 = 5 := ⟨by fun_prop, by norm_num, by norm_num⟩

/-- Funkcija z grafa v Preveri se 2: `x − 3` za `x < 2`, `x` za `x ≥ 2`. -/
noncomputable def skok (x : ℝ) : ℝ := if x < 2 then x - 3 else x

/-- Preveri se 2: `f(0) = −3`, `f(4) = 4`, `f(2) = 2`, `f(3) = 3`; na `[0, 4]` ni ničle in `f` ni zvezna. -/
theorem kviz2_ni_nicle :
    skok 0 = -3 ∧ skok 4 = 4 ∧ skok 2 = 2 ∧ skok 3 = 3 ∧ (∀ x ∈ Icc (0:ℝ) 4, skok x ≠ 0) ∧
      ¬ ContinuousOn skok (Icc 0 4) := by
  have nic : ∀ x ∈ Icc (0:ℝ) 4, skok x ≠ 0 := by
    intro x hx
    unfold skok
    split_ifs with h
    · linarith
    · push Not at h; linarith
  refine ⟨by norm_num [skok], by norm_num [skok], by norm_num [skok], by norm_num [skok], nic,
    fun hc => ?_⟩
  obtain ⟨c, hc, hfc⟩ := izrek_o_nicli skok 0 4 (by norm_num) hc (by norm_num [skok])
  exact nic c (Ioo_subset_Icc_self hc) hfc

/-- Preveri se 2: bisekcija na `[0, 4]` po `n + 1` korakih da interval `[2 − 2/2ⁿ, 2]`, ki se krči proti
`x = 2`, kjer funkcija skoči. -/
theorem kviz2_bisekcija (n : ℕ) : bisekcija skok 0 4 (n + 1) = (2 - 2 / 2 ^ n, 2) := by
  induction n with
  | zero =>
    rw [show (2:ℝ) - 2 / 2 ^ 0 = 0 by norm_num]
    exact korak_levo skok 0 4 2 (by norm_num) (by norm_num [skok])
  | succ n ih =>
    show korak skok (bisekcija skok 0 4 (n + 1)) = _
    rw [ih]
    have hp : (0:ℝ) < 2 / 2 ^ n := by positivity
    have hq : (0:ℝ) < 2 / 2 ^ (n + 1) := by positivity
    have hc : ((2:ℝ) - 2 / 2 ^ n + 2) / 2 = 2 - 2 / 2 ^ (n + 1) := by
      rw [pow_succ]; field_simp; ring
    apply korak_desno skok _ _ _ hc
    have e1 : skok (2 - 2 / 2 ^ n) = 2 - 2 / 2 ^ n - 3 := by
      have : (2:ℝ) - 2 / 2 ^ n < 2 := by linarith
      unfold skok; simp only [this, ↓reduceIte]
    have e2 : skok (2 - 2 / 2 ^ (n + 1)) = 2 - 2 / 2 ^ (n + 1) - 3 := by
      have : (2:ℝ) - 2 / 2 ^ (n + 1) < 2 := by linarith
      unfold skok; simp only [this, ↓reduceIte]
    rw [e1, e2]
    exact mul_pos_of_neg_of_neg (by linarith) (by linarith)

/-- Preveri se 4: na `[2, 3]` je interval krajši od `0,01` natanko po vsaj `7` korakih
(`1/2⁶ ≈ 0,016`, `2⁷ = 128`, `1/2⁷ = 0,0078125`). -/
theorem kviz4 :
    |(1:ℝ) / 2 ^ 6 - 0.016| ≤ 0.0005 ∧ (1:ℝ) / 2 ^ 7 = 0.0078125 ∧
      ∀ n : ℕ, ((3:ℝ) - 2) / 2 ^ n < 0.01 ↔ 7 ≤ n := by
  refine ⟨blizu (by norm_num) (by norm_num), by norm_num, fun n => ?_⟩
  rw [show (3:ℝ) - 2 = 1 by norm_num, show (0.01:ℝ) = 1 / 100 by norm_num,
    one_div_lt_one_div (by positivity) (by norm_num)]
  rw [← koraki 100 7 (by norm_num) (by norm_num) n]
  norm_cast

/-- Funkcija iz Preveri se 5: `f(x) = x³ + 2x − 5`. -/
noncomputable def k₅ (x : ℝ) : ℝ := x ^ 3 + 2 * x - 5

/-- Preveri se 5: `f(1) = −2`, `f(2) = 7`, `f(1,5) = 1,375 > 0`, `f(1,25) ≈ −0,547 < 0`; intervala
`[1; 1,5]` in `[1,25; 1,5]`, tretja sredina `c₃ = 1,375`. -/
theorem kviz5 :
    k₅ 1 = -2 ∧ k₅ 2 = 7 ∧ k₅ 1.5 = 1.375 ∧ |k₅ 1.25 - (-0.547)| ≤ 0.0005 ∧
      bisekcija k₅ 1 2 1 = (1, 1.5) ∧ bisekcija k₅ 1 2 2 = (1.25, 1.5) ∧
      ((bisekcija k₅ 1 2 2).1 + (bisekcija k₅ 1 2 2).2) / 2 = 1.375 := by
  have k1 : bisekcija k₅ 1 2 1 = (1, 1.5) :=
    korak_levo k₅ 1 2 1.5 (by norm_num) (by norm_num [k₅])
  have k2 : bisekcija k₅ 1 2 2 = (1.25, 1.5) := by
    show korak k₅ (bisekcija k₅ 1 2 1) = _
    rw [k1]; exact korak_desno k₅ 1 1.5 1.25 (by norm_num) (by norm_num [k₅])
  refine ⟨by norm_num [k₅], by norm_num [k₅], by norm_num [k₅],
    blizu (by norm_num [k₅]) (by norm_num [k₅]), k1, k2, by rw [k2]; norm_num⟩

/-! ## Blok RACUN (vrstice, ki niso že dokazane zgoraj) -/

/-- RACUN: `2³ − 3·2 + 1 = 3`, `1,375³ + 2·1,375 − 5 ≈ 0,350`, `(−3)³ − 4·(−3) + 1 = −14`,
`1³ − 4·1 + 1 = −2`, `0,5³ − 4·0,5 + 1 = −0,875`, `0,25³ − 4·0,25 + 1 = 0,015625`, `1/2⁷ = 0,0078125`,
`1/2⁸ = 0,00390625`. -/
theorem racun :
    (2:ℝ) ^ 3 - 3 * 2 + 1 = 3 ∧ |(1.375:ℝ) ^ 3 + 2 * 1.375 - 5 - 0.350| ≤ 0.0005 ∧
      (-3:ℝ) ^ 3 - 4 * (-3) + 1 = -14 ∧ (1:ℝ) ^ 3 - 4 * 1 + 1 = -2 ∧
      (0.5:ℝ) ^ 3 - 4 * 0.5 + 1 = -0.875 ∧ (0.25:ℝ) ^ 3 - 4 * 0.25 + 1 = 0.015625 ∧
      (1:ℝ) / 2 ^ 7 = 0.0078125 ∧ (1:ℝ) / 2 ^ 8 = 0.00390625 := by
  refine ⟨by norm_num, blizu (by norm_num) (by norm_num), by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num⟩

end Evklid.Lekcije.MAT_SS_4.ZvezneFunkcijeInBisekcija
