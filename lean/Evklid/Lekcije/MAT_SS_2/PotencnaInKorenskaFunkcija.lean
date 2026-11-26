/-
vir: content/lessons/MAT-SS-2/potencna-in-korenska-funkcija.md
sha256: 0294dca53a13651566eb189b0ce19e07e3703319853240490d4b238e58f30429
Ni v Leanu: risbe grafov in simulaciji; opisi oblike grafa (»spominja na parabolo«, »bolj sploščen«, »strm«,
»položen«, »veja hiperbole«; dokazane so primerjave vrednosti, točke, monotonost, sodost/lihost in limite, ki
določajo asimptote); zrcaljenje grafa čez y = x kot geometrijska slika (dokazano je, da točka (a, b) grafa xⁿ da
točko (b, a) grafa korena, tj. da sta funkciji inverzni); uporabe pri mizarjih, zidarjih, polagalcih (opis);
kritična presoja modela (veljavnost le za suho cesto, mokra cesta ima večji c, Preveri se, 8: sklep o veljavnosti
modela; fizikalna/empirična trditev) in podatki meritev kot empirična dejstva; pojasnilo, da sta nihajni čas in
dolžina potenčni odvisnosti v fiziki; Kot zgodba: risanje kvadrata razdeljenega na četrtine (dokazano: (2a)² = 4a²);
točkovanje. Uvod: »največje celo število, katerega kub ne preseže 50, je 3« je dokazano.
»Večji eksponent – bolj sploščen graf« je zapisano z absolutnimi vrednostmi: za 0 < |x| < 1 in m < n je
|xⁿ| < |xᵐ|, za |x| > 1 pa |xᵐ| < |xⁿ|.
Ni dokazano (zahtevno, še ni dokazano): limite pri splošnem premiku y = a(x − p)^(−n) + q (dokazane za Primer 6
in Nalogo 1; v splošnem je dokazano, da je D = R \ {p}, da vrednost q ni dosežena in da je (p, q) pri lihem n
središče simetrije).
Primer 6: prva trditev f(x) = 2(x − 1)⁻¹ − 1 velja v Leanu tudi pri x = 1, a le zato, ker je tam 2/0 = 0 in 0⁻¹ = 0
(obe strani −1); v lekciji x = 1 ni v D_f.
Lean: x^(−n) je zapisan z zpow; v Leanu je 0^(−n) = 0 in 1/0 = 0, zato je definicijsko območje R \ {0}
(oz. R \ {p}) vedno zapisano kot pogoj x ≠ 0 (x ≠ p), zaloga vrednosti pa kot slika tega območja. Kubični koren je
`koren 3` (za a < 0 je −(−a)^(1/3)); `koren_lih` pokaže, da je edino realno število b z b³ = a.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.PotencnaInKorenskaFunkcija

open Real Filter Topology Set

/-! ## Pomožne trditve: n-ti koren -/

/-- Realni n-ti koren: za a ≥ 0 je a^(1/n), za a < 0 je −(−a)^(1/n). -/
noncomputable def koren (n : ℕ) (a : ℝ) : ℝ :=
  if 0 ≤ a then a ^ ((n : ℝ)⁻¹) else -((-a) ^ ((n : ℝ)⁻¹))

theorem koren_nenegativen {n : ℕ} {a : ℝ} (ha : 0 ≤ a) : 0 ≤ koren n a := by
  simp only [koren, ha, ↓reduceIte]; exact Real.rpow_nonneg ha _

theorem koren_pot {n : ℕ} (hn : n ≠ 0) {a : ℝ} (ha : 0 ≤ a) : koren n a ^ n = a := by
  simp only [koren, ha, ↓reduceIte]; exact Real.rpow_inv_natCast_pow ha hn

example : (2:ℕ) ≠ 0 ∧ (0:ℝ) ≤ 4 := by norm_num

theorem koren_eq {n : ℕ} (hn : n ≠ 0) {a b : ℝ} (hb : 0 ≤ b) (h : b ^ n = a) : koren n a = b := by
  subst h; simp only [koren, pow_nonneg hb n, ↓reduceIte]; exact Real.pow_rpow_inv_natCast hb hn

example : (2:ℕ) ≠ 0 ∧ (0:ℝ) ≤ 2 ∧ (2:ℝ) ^ 2 = 4 := by norm_num

theorem koren_lih_pot {n : ℕ} (hn : Odd n) (a : ℝ) : koren n a ^ n = a := by
  have hn0 : n ≠ 0 := by rintro rfl; exact Nat.not_odd_zero hn
  by_cases ha : 0 ≤ a
  · exact koren_pot hn0 ha
  · have ha' : 0 ≤ -a := le_of_lt (neg_pos.mpr (not_le.mp ha))
    simp only [koren, ha, ↓reduceIte]; rw [hn.neg_pow, Real.rpow_inv_natCast_pow ha' hn0, neg_neg]

example : Odd 3 := ⟨1, rfl⟩

/-- Pri lihem n je ⁿ√a edino realno število b z bⁿ = a. -/
theorem koren_lih {n : ℕ} (hn : Odd n) (a b : ℝ) : b ^ n = a ↔ b = koren n a := by
  constructor
  · intro h; exact hn.pow_inj.mp (by rw [h, koren_lih_pot hn])
  · rintro rfl; exact koren_lih_pot hn a

theorem koren_med {n : ℕ} (hn : n ≠ 0) {a lo hi : ℝ} (ha : 0 ≤ a) (hhi : 0 ≤ hi)
    (h1 : lo ^ n < a) (h2 : a < hi ^ n) : lo < koren n a ∧ koren n a < hi := by
  have hr := koren_pot hn ha
  exact ⟨lt_of_pow_lt_pow_left₀ n (koren_nenegativen ha) (by rw [hr]; exact h1),
    lt_of_pow_lt_pow_left₀ n hhi (by rw [hr]; exact h2)⟩

example : (3:ℕ) ≠ 0 ∧ (0:ℝ) ≤ 50 ∧ (0:ℝ) ≤ 4 ∧ (3:ℝ) ^ 3 < 50 ∧ (50:ℝ) < 4 ^ 3 := by norm_num

theorem sqrt_kv {k : ℝ} (hk : 0 ≤ k) : √(k ^ 2) = k := Real.sqrt_sq hk

example : (0:ℝ) ≤ 2 := by norm_num

/-! ## Zakaj se tega učimo -/

/-- Uvod: kocke z robom 2, 3, 4 porabijo 8, 27, 64 kock; iz 50 kock zgradiš največ kocko z robom 3
(3³ = 27 ≤ 50 < 64 = 4³), ne 50 : 3. -/
theorem uvod : (2:ℕ) ^ 3 = 8 ∧ (3:ℕ) ^ 3 = 27 ∧ (4:ℕ) ^ 3 = 64 ∧
    (∀ a : ℕ, a ^ 3 ≤ 50 ↔ a ≤ 3) := by
  refine ⟨by norm_num, by norm_num, by norm_num, fun a => ⟨fun h => ?_, fun h => ?_⟩⟩
  · by_contra hc
    have : 4 ≤ a := by omega
    have : 4 ^ 3 ≤ a ^ 3 := Nat.pow_le_pow_left this 3
    omega
  · calc a ^ 3 ≤ 3 ^ 3 := Nat.pow_le_pow_left h 3
      _ ≤ 50 := by norm_num

/-! ## Razlaga: potenčna funkcija xⁿ -/

/-- Razlaga: pri n = 1 je xⁿ = x, pri n = 0 konstanta 1 (za x ≠ 0; 0⁰ = 1 je v Leanu le dogovor). -/
theorem n_ena_nic (x : ℝ) (_hx : x ≠ 0) : x ^ (1:ℤ) = x ∧ x ^ (0:ℤ) = 1 := ⟨zpow_one x, zpow_zero x⟩

example : (2:ℝ) ≠ 0 := by norm_num

/-- Najprej opazuj (tabela): vrednosti x², x³, x⁴ pri x = −2, −1, 0, 1, 2. -/
theorem tabela : ((-2:ℝ) ^ 2 = 4 ∧ (-2:ℝ) ^ 3 = -8 ∧ (-2:ℝ) ^ 4 = 16) ∧
    ((-1:ℝ) ^ 2 = 1 ∧ (-1:ℝ) ^ 3 = -1 ∧ (-1:ℝ) ^ 4 = 1) ∧ ((0:ℝ) ^ 2 = 0 ∧ (0:ℝ) ^ 3 = 0 ∧ (0:ℝ) ^ 4 = 0) ∧
    ((1:ℝ) ^ 2 = 1 ∧ (1:ℝ) ^ 3 = 1 ∧ (1:ℝ) ^ 4 = 1) ∧ ((2:ℝ) ^ 2 = 4 ∧ (2:ℝ) ^ 3 = 8 ∧ (2:ℝ) ^ 4 = 16) := by
  norm_num

/-- Pravilo za sode eksponente: (−x)ⁿ = xⁿ (soda funkcija), vrednosti niso negativne. -/
theorem sod_eksponent {n : ℕ} (hn : Even n) (x : ℝ) : (-x) ^ n = x ^ n ∧ 0 ≤ x ^ n :=
  ⟨hn.neg_pow x, hn.pow_nonneg x⟩

example : Even 2 := even_two

/-- Pravilo za sode eksponente: Z_f = [0, ∞) (n sod, n ≥ 2). -/
theorem sod_zaloga {n : ℕ} (hn : Even n) (hn0 : n ≠ 0) : Set.range (fun x : ℝ => x ^ n) = Set.Ici 0 := by
  ext y; constructor
  · rintro ⟨x, rfl⟩; exact hn.pow_nonneg x
  · intro hy; exact ⟨koren n y, koren_pot hn0 hy⟩

example : Even 4 ∧ (4:ℕ) ≠ 0 := ⟨⟨2, rfl⟩, by norm_num⟩

/-- Pravilo za sode eksponente: graf gre skozi (−1, 1), (0, 0), (1, 1). -/
theorem sod_tocke {n : ℕ} (hn : Even n) (hn0 : n ≠ 0) : (-1:ℝ) ^ n = 1 ∧ (0:ℝ) ^ n = 0 ∧ (1:ℝ) ^ n = 1 :=
  ⟨hn.neg_one_pow, zero_pow hn0, one_pow n⟩

/-- Pravilo za sode eksponente: na [0, ∞) narašča, na (−∞, 0] pada. -/
theorem sod_monotonost {n : ℕ} (hn : Even n) (hn0 : n ≠ 0) :
    StrictMonoOn (fun x : ℝ => x ^ n) (Set.Ici 0) ∧ StrictAntiOn (fun x : ℝ => x ^ n) (Set.Iic 0) := by
  refine ⟨fun a ha b _ hab => pow_lt_pow_left₀ hab ha hn0, fun a _ b hb hab => ?_⟩
  simp only
  rw [← hn.neg_pow a, ← hn.neg_pow b]
  exact pow_lt_pow_left₀ (neg_lt_neg hab) (neg_nonneg.mpr hb) hn0

/-- Pravilo za lihe eksponente: (−x)ⁿ = −xⁿ (liha funkcija), povsod narašča, Z_f = R, skozi (−1, −1),
(0, 0), (1, 1). -/
theorem lih_eksponent {n : ℕ} (hn : Odd n) :
    (∀ x : ℝ, (-x) ^ n = -x ^ n) ∧ StrictMono (fun x : ℝ => x ^ n) ∧ Set.range (fun x : ℝ => x ^ n) = Set.univ ∧
    (-1:ℝ) ^ n = -1 ∧ (0:ℝ) ^ n = 0 ∧ (1:ℝ) ^ n = 1 := by
  have hn0 : n ≠ 0 := by rintro rfl; exact Nat.not_odd_zero hn
  refine ⟨fun x => hn.neg_pow x, hn.strictMono_pow, ?_, hn.neg_one_pow, zero_pow hn0, one_pow n⟩
  ext y; simp only [Set.mem_range, Set.mem_univ, iff_true]; exact ⟨koren n y, koren_lih_pot hn y⟩

example : Odd 3 := ⟨1, rfl⟩

/-- Premisli in Povzetek (splošno): večji eksponent – na (−1, 1) bolj sploščen graf, zunaj strmejši:
za 0 < |x| < 1 in m < n je |xⁿ| < |xᵐ|, za |x| > 1 je |xᵐ| < |xⁿ|. -/
theorem splosceni_graf {m n : ℕ} (hmn : m < n) (x : ℝ) :
    (0 < |x| → |x| < 1 → |x ^ n| < |x ^ m|) ∧ (1 < |x| → |x ^ m| < |x ^ n|) := by
  rw [abs_pow, abs_pow]
  exact ⟨fun h0 h1 => pow_lt_pow_right_of_lt_one₀ h0 h1 hmn, fun h1 => pow_lt_pow_right₀ h1 hmn⟩

example : (2:ℕ) < 4 ∧ (0:ℝ) < |0.5| ∧ |(0.5:ℝ)| < 1 ∧ (1:ℝ) < |3| := by norm_num [abs_of_pos]

/-- Premisli: 0,5² = 0,25 > 0,5⁴ = 0,0625, 3² = 9 < 81 = 3⁴; splošno je za 0 < |x| < 1 x⁴ < x², za |x| > 1
x⁴ > x²; grafa se sekata v x ∈ {−1, 0, 1}. -/
theorem premisli_x2_x4 : (0.5:ℝ) ^ 2 = 0.25 ∧ (0.5:ℝ) ^ 4 = 0.0625 ∧ (0.0625:ℝ) < 0.25 ∧ (3:ℝ) ^ 2 = 9 ∧
    (3:ℝ) ^ 4 = 81 ∧ (∀ x : ℝ, 0 < |x| → |x| < 1 → x ^ 4 < x ^ 2) ∧ (∀ x : ℝ, 1 < |x| → x ^ 2 < x ^ 4) ∧
    (∀ x : ℝ, x ^ 4 = x ^ 2 ↔ x = -1 ∨ x = 0 ∨ x = 1) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, fun x h0 h1 => ?_, fun x h1 => ?_,
    fun x => ?_⟩
  · have e : x ^ 2 = |x| ^ 2 := (sq_abs x).symm
    have h2 : 0 < x ^ 2 := by rw [e]; positivity
    have h3 : x ^ 2 < 1 := by rw [e]; nlinarith
    nlinarith
  · have e : x ^ 2 = |x| ^ 2 := (sq_abs x).symm
    have h3 : 1 < x ^ 2 := by rw [e]; nlinarith
    nlinarith
  · have : x ^ 4 - x ^ 2 = (x - (-1)) * x * (x - 1) * x := by ring
    constructor
    · intro h
      have h0 : (x - (-1)) * x * (x - 1) * x = 0 := by rw [← this]; linarith
      rcases mul_eq_zero.mp h0 with h | h
      · rcases mul_eq_zero.mp h with h | h
        · rcases mul_eq_zero.mp h with h | h
          · left; linarith
          · right; left; exact h
        · right; right; linarith
      · right; left; exact h
    · rintro (rfl | rfl | rfl) <;> norm_num

/-! ## Negativni eksponent -/

/-- Negativni eksponent: x^(−n) = 1/xⁿ (za x ≠ 0; v Leanu velja tudi pri x = 0, kjer sta obe strani 0). -/
theorem negativni (x : ℝ) (n : ℕ) : x ^ (-(n:ℤ)) = 1 / x ^ n := by
  rw [zpow_neg, zpow_natCast, one_div]

/-- Negativni eksponent: definicijsko območje R \ {0}: imenovalec xⁿ je nič natanko pri x = 0 (n ≥ 1). -/
theorem negativni_D {n : ℕ} (hn : n ≠ 0) (x : ℝ) : x ^ n ≠ 0 ↔ x ≠ 0 :=
  not_congr (pow_eq_zero_iff hn)

example : (1:ℕ) ≠ 0 := by norm_num

/-- Negativni eksponent: ko gre x proti ±∞, gre x^(−n) proti 0 (asimptota y = 0). -/
theorem negativni_v_neskoncnosti {n : ℕ} (hn : n ≠ 0) :
    Tendsto (fun x : ℝ => x ^ (-(n:ℤ))) atTop (𝓝 0) ∧ Tendsto (fun x : ℝ => x ^ (-(n:ℤ))) atBot (𝓝 0) := by
  refine ⟨tendsto_pow_neg_atTop hn, ?_⟩
  have h : Tendsto (fun x : ℝ => (|x| ^ n)⁻¹) atBot (𝓝 0) :=
    tendsto_inv_atTop_zero.comp ((tendsto_pow_atTop hn).comp tendsto_abs_atBot_atTop)
  rw [tendsto_zero_iff_abs_tendsto_zero]
  refine h.congr (fun x => ?_)
  simp [zpow_neg, abs_inv, abs_pow]

example : (2:ℕ) ≠ 0 := by norm_num

/-- Negativni eksponent: ko gre x z desne proti 0, x^(−n) raste čez vse meje (asimptota x = 0). -/
theorem negativni_pri_nic {n : ℕ} (hn : n ≠ 0) : Tendsto (fun x : ℝ => x ^ (-(n:ℤ))) (𝓝[>] 0) atTop := by
  have h1 : Tendsto (fun x : ℝ => x ^ n) (𝓝[>] 0) (𝓝[>] 0) := by
    apply tendsto_nhdsWithin_of_tendsto_nhds_of_eventually_within
    · have : Tendsto (fun x : ℝ => x ^ n) (𝓝 0) (𝓝 (0 ^ n)) := (continuous_pow n).tendsto 0
      rw [zero_pow hn] at this
      exact this.mono_left nhdsWithin_le_nhds
    · filter_upwards [self_mem_nhdsWithin] with x hx using pow_pos hx n
  refine h1.inv_tendsto_nhdsGT_zero.congr (fun x => ?_)
  simp [zpow_neg]

example : (1:ℕ) ≠ 0 := by norm_num

/-- Negativni eksponent, lihi n: ko gre x z leve proti 0, gre x^(−n) proti −∞. -/
theorem negativni_lih_z_leve {n : ℕ} (hn : Odd n) : Tendsto (fun x : ℝ => x ^ (-(n:ℤ))) (𝓝[<] 0) atBot := by
  have hn0 : n ≠ 0 := by rintro rfl; exact Nat.not_odd_zero hn
  have h1 : Tendsto (fun x : ℝ => x ^ n) (𝓝[<] 0) (𝓝[<] 0) := by
    apply tendsto_nhdsWithin_of_tendsto_nhds_of_eventually_within
    · have : Tendsto (fun x : ℝ => x ^ n) (𝓝 0) (𝓝 (0 ^ n)) := (continuous_pow n).tendsto 0
      rw [zero_pow hn0] at this
      exact this.mono_left nhdsWithin_le_nhds
    · filter_upwards [self_mem_nhdsWithin] with x hx using hn.pow_neg hx
  refine h1.inv_tendsto_nhdsLT_zero.congr (fun x => ?_)
  simp [zpow_neg]

example : Odd 1 := ⟨0, rfl⟩

/-- Negativni eksponent, sodi n: ko gre x z leve proti 0, gre x^(−n) proti +∞. -/
theorem negativni_sod_z_leve {n : ℕ} (hn : Even n) (hn0 : n ≠ 0) :
    Tendsto (fun x : ℝ => x ^ (-(n:ℤ))) (𝓝[<] 0) atTop := by
  have h1 : Tendsto (fun x : ℝ => x ^ n) (𝓝[<] 0) (𝓝[>] 0) := by
    apply tendsto_nhdsWithin_of_tendsto_nhds_of_eventually_within
    · have : Tendsto (fun x : ℝ => x ^ n) (𝓝 0) (𝓝 (0 ^ n)) := (continuous_pow n).tendsto 0
      rw [zero_pow hn0] at this
      exact this.mono_left nhdsWithin_le_nhds
    · filter_upwards [self_mem_nhdsWithin] with x hx using hn.pow_pos (ne_of_lt hx)
  refine h1.inv_tendsto_nhdsGT_zero.congr (fun x => ?_)
  simp [zpow_neg]

example : Even 2 ∧ (2:ℕ) ≠ 0 := ⟨even_two, by norm_num⟩

/-- Negativni eksponent, zaloga vrednosti: pri sodem n (n ≥ 2) je Z = (0, ∞), pri lihem n je Z = R \ {0}
(D = R \ {0}). -/
theorem negativni_zaloga {n : ℕ} (hn0 : n ≠ 0) :
    (Even n → (fun x : ℝ => x ^ (-(n:ℤ))) '' {x | x ≠ 0} = Ioi 0) ∧
    (Odd n → (fun x : ℝ => x ^ (-(n:ℤ))) '' {x | x ≠ 0} = {y | y ≠ 0}) := by
  have val : ∀ b : ℝ, b ^ n ≠ 0 → b ≠ 0 ∧ b ^ (-(n:ℤ)) = (b ^ n)⁻¹ := fun b hb =>
    ⟨fun h => hb (by rw [h, zero_pow hn0]), by rw [zpow_neg, zpow_natCast]⟩
  refine ⟨fun hn => ?_, fun hn => ?_⟩
  · ext y; constructor
    · rintro ⟨x, hx, rfl⟩
      simp only [mem_Ioi]; rw [zpow_neg, zpow_natCast]; exact inv_pos.mpr (hn.pow_pos hx)
    · intro hy
      rw [mem_Ioi] at hy
      have hp := koren_pot hn0 (inv_nonneg.mpr hy.le)
      obtain ⟨h1, h2⟩ := val (koren n y⁻¹) (by rw [hp]; exact (inv_pos.mpr hy).ne')
      exact ⟨koren n y⁻¹, h1, by simp only; rw [h2, hp, inv_inv]⟩
  · ext y; constructor
    · rintro ⟨x, hx, rfl⟩
      simp only [mem_ofPred_eq]; exact zpow_ne_zero _ hx
    · intro hy
      simp only [mem_ofPred_eq] at hy
      have hp := koren_lih_pot hn y⁻¹
      obtain ⟨h1, h2⟩ := val (koren n y⁻¹) (by rw [hp]; exact inv_ne_zero hy)
      exact ⟨koren n y⁻¹, h1, by simp only; rw [h2, hp, inv_inv]⟩

example : (3:ℕ) ≠ 0 := by norm_num

/-- Negativni eksponent, sodi n (x⁻², x⁻⁴, …): soda funkcija, veji nad osjo x, skozi (−1, 1) in (1, 1). -/
theorem negativni_sod {n : ℕ} (hn : Even n) :
    (∀ x : ℝ, (-x) ^ (-(n:ℤ)) = x ^ (-(n:ℤ))) ∧ (∀ x : ℝ, x ≠ 0 → 0 < x ^ (-(n:ℤ))) ∧
    (-1:ℝ) ^ (-(n:ℤ)) = 1 ∧ (1:ℝ) ^ (-(n:ℤ)) = 1 := by
  refine ⟨fun x => by rw [negativni, negativni, hn.neg_pow], fun x hx => ?_, ?_, by simp⟩
  · rw [negativni]; have := hn.pow_pos hx; positivity
  · rw [negativni, hn.neg_one_pow]; norm_num

example : Even 2 := even_two

/-- Negativni eksponent, lihi n (x⁻¹, x⁻³, …): liha funkcija, veji v 1. in 3. kvadrantu, skozi (1, 1) in
(−1, −1). -/
theorem negativni_lih {n : ℕ} (hn : Odd n) :
    (∀ x : ℝ, (-x) ^ (-(n:ℤ)) = -x ^ (-(n:ℤ))) ∧ (∀ x : ℝ, 0 < x → 0 < x ^ (-(n:ℤ))) ∧
    (∀ x : ℝ, x < 0 → x ^ (-(n:ℤ)) < 0) ∧ (1:ℝ) ^ (-(n:ℤ)) = 1 ∧ (-1:ℝ) ^ (-(n:ℤ)) = -1 := by
  refine ⟨fun x => by rw [negativni, negativni, hn.neg_pow]; ring, fun x hx => ?_, fun x hx => ?_, by simp, ?_⟩
  · rw [negativni]; have := pow_pos hx n; positivity
  · rw [negativni]; have := hn.pow_neg hx; exact one_div_neg.mpr this
  · rw [negativni, hn.neg_one_pow]; norm_num

/-! ## Korenska funkcija kot inverzna -/

/-- Korenska funkcija kot inverzna: x³ je injektivna na R, ∛x je njena inverzna funkcija na R
(∛(x³) = x in (∛x)³ = x); ∛(−8) = −2, ker je (−2)³ = −8. -/
theorem kubicni_inverz : Function.Injective (fun x : ℝ => x ^ 3) ∧ (∀ x : ℝ, koren 3 (x ^ 3) = x) ∧
    (∀ x : ℝ, koren 3 x ^ 3 = x) ∧ koren 3 (-8) = -2 := by
  have h3 : Odd 3 := ⟨1, rfl⟩
  exact ⟨h3.strictMono_pow.injective, fun x => ((koren_lih h3 _ _).mp rfl).symm, koren_lih_pot h3,
    ((koren_lih h3 _ _).mp (by norm_num)).symm⟩

/-- Premisli: x² ni injektivna, f(−3) = f(3) = 9; na [0, ∞) je inverzna funkcija √x (√(x²) = x in
(√x)² = x za x ≥ 0). -/
theorem kvadrat_inverz : ¬ Function.Injective (fun x : ℝ => x ^ 2) ∧ (-3:ℝ) ^ 2 = 9 ∧ (3:ℝ) ^ 2 = 9 ∧
    Set.InjOn (fun x : ℝ => x ^ 2) (Set.Ici 0) ∧ (∀ x : ℝ, 0 ≤ x → √(x ^ 2) = x) ∧
    (∀ x : ℝ, 0 ≤ x → √x ^ 2 = x) := by
  refine ⟨fun h => by have := @h (-3) 3 (by norm_num); norm_num at this, by norm_num, by norm_num,
    (pow_left_strictMonoOn₀ (by norm_num)).injOn, fun x hx => Real.sqrt_sq hx, fun x hx => Real.sq_sqrt hx⟩

/-- Splošno: za lihi n je ⁿ√x inverz xⁿ na R; za sodi n je xⁿ injektivna na [0, ∞), inverz ⁿ√x pa ima
D = [0, ∞); ⁿ√x = x^(1/n) za x ≥ 0. -/
theorem splosno_inverz (n : ℕ) (hn0 : n ≠ 0) :
    (Odd n → ∀ x : ℝ, koren n (x ^ n) = x ∧ koren n x ^ n = x) ∧
    (Set.InjOn (fun x : ℝ => x ^ n) (Set.Ici 0)) ∧
    (∀ x : ℝ, 0 ≤ x → koren n (x ^ n) = x ∧ koren n x ^ n = x) ∧
    (∀ x : ℝ, 0 ≤ x → koren n x = x ^ ((1:ℝ) / n)) := by
  refine ⟨fun hn x => ⟨((koren_lih hn _ _).mp rfl).symm, koren_lih_pot hn x⟩,
    (pow_left_strictMonoOn₀ hn0).injOn, fun x hx => ⟨koren_eq hn0 hx rfl, koren_pot hn0 hx⟩, fun x hx => ?_⟩
  simp only [koren, hx, ↓reduceIte, one_div]

example : (3:ℕ) ≠ 0 := by norm_num

/-- Ustno vprašanje 2: pri sodem n funkcija xⁿ ni injektivna, ker je (−1)ⁿ = 1ⁿ in −1 ≠ 1. -/
theorem sod_ni_injektivna {n : ℕ} (hn : Even n) : (-1:ℝ) ^ n = 1 ^ n ∧ ¬ Function.Injective (fun x : ℝ => x ^ n) := by
  have h : (-1:ℝ) ^ n = 1 ^ n := by rw [hn.neg_one_pow, one_pow]
  exact ⟨h, fun hi => by have := hi h; norm_num at this⟩

example : Even 2 := even_two

/-- Slika v besedah: točka (2, 8) na grafu x³ preide v (8, 2) na grafu ∛x. -/
theorem zrcalna_tocka : (2:ℝ) ^ 3 = 8 ∧ koren 3 8 = 2 :=
  ⟨by norm_num, koren_eq (by norm_num) (by norm_num) (by norm_num)⟩

/-- Ker je √x inverz le desne polovice parabole, je √(x²) = |x|. -/
theorem koren_kvadrata (x : ℝ) : √(x ^ 2) = |x| := Real.sqrt_sq_eq_abs x

/-! ## Transformacije -/

/-- Transformacije: graf √(x − 2) + 1 je definiran za x ≥ 2 in se začne v točki (2, 1). -/
theorem premik_korena : √((2:ℝ) - 2) + 1 = 1 ∧ ∀ x : ℝ, 2 ≤ x → 1 ≤ √(x - 2) + 1 :=
  ⟨by norm_num, fun x _ => by have := Real.sqrt_nonneg (x - 2); linarith⟩

/-- Transformacije: pri y = a(x − p)ⁿ + q (n ≥ 1) točka (0, 0) preide v (p, q). -/
theorem premik_tocka (a p q : ℝ) {n : ℕ} (hn : n ≠ 0) : a * (p - p) ^ n + q = q := by
  rw [sub_self, zero_pow hn]; ring

example : (3:ℕ) ≠ 0 := by norm_num

/-- Transformacije, negativni eksponent: pri y = a(x − p)^(−n) + q (a ≠ 0) je D = R \ {p} (imenovalec
(x − p)ⁿ je nič le pri x = p), vrednosti q funkcija ne doseže. -/
theorem premik_asimptota {a p q : ℝ} (ha : a ≠ 0) {n : ℕ} (hn : n ≠ 0) (x : ℝ) :
    ((x - p) ^ n ≠ 0 ↔ x ≠ p) ∧ (x ≠ p → a * (x - p) ^ (-(n:ℤ)) + q ≠ q) := by
  refine ⟨by rw [Ne, pow_eq_zero_iff hn, sub_eq_zero], fun hx => ?_⟩
  have h1 : (x - p) ^ (-(n:ℤ)) ≠ 0 := zpow_ne_zero _ (sub_ne_zero.mpr hx)
  intro h; exact h1 ((mul_eq_zero.mp (by linarith : a * (x - p) ^ (-(n:ℤ)) = 0)).resolve_left ha)

example : (2:ℝ) ≠ 0 ∧ (1:ℕ) ≠ 0 := by norm_num

/-- Transformacije: pri lihem n je (p, q) središče simetrije grafa y = a(x − p)ⁿ + q: točki pri x = p + t in
x = p − t sta simetrični glede na (p, q), f(p + t) + f(p − t) = 2q. -/
theorem premik_sredisce {n : ℕ} (hn : Odd n) (a p q t : ℝ) :
    (a * ((p + t) - p) ^ n + q) + (a * ((p - t) - p) ^ n + q) = 2 * q := by
  rw [show (p + t) - p = t by ring, show (p - t) - p = -t by ring, hn.neg_pow]; ring

example : Odd 3 := ⟨1, rfl⟩

/-! ## Potenčna odvisnost in modeliranje -/

/-- Potenčna odvisnost: c(2x)ⁿ = 2ⁿ · c · xⁿ; pri V = a³ dvakrat daljši rob da 8-krat večjo prostornino;
pri y = c x⁻² se y zmanjša na četrtino. -/
theorem podvojitev (c x : ℝ) (n : ℕ) : c * (2 * x) ^ n = 2 ^ n * c * x ^ n ∧ (2 * x) ^ 3 = 8 * x ^ 3 ∧
    c * (2 * x) ^ (-2:ℤ) = c * x ^ (-2:ℤ) / 4 := by
  refine ⟨by rw [mul_pow]; ring, by ring, ?_⟩
  rw [mul_zpow]; norm_num; ring

/-- Lesene kocke: količniki m/a so 0,6; 2,4; 5,4 (masa ni premo sorazmerna z robom), količniki m/a³ so vsi
0,6, zato m = 0,6 a³ (0,6 · 3³ = 16,2; 16,2 : 3 = 5,4). -/
theorem lesene_kocke : (0.6:ℝ) / 1 = 0.6 ∧ (4.8:ℝ) / 2 = 2.4 ∧ (16.2:ℝ) / 3 = 5.4 ∧
    (0.6:ℝ) / 1 ^ 3 = 0.6 ∧ (4.8:ℝ) / 2 ^ 3 = 0.6 ∧ (16.2:ℝ) / 3 ^ 3 = 0.6 ∧ (0.6:ℝ) * 3 ^ 3 = 16.2 := by
  norm_num

/-- Pozor: graf xⁿ gre za n ≥ 1 skozi (0, 0), premica pa je le pri n = 1: za vsak n ≥ 2 točke (0, 0), (1, 1ⁿ),
(2, 2ⁿ) niso kolinearne (determinanta (1 − 0)(2ⁿ − 0) − (1ⁿ − 0)(2 − 0) ≠ 0), pri n = 1 pa so. -/
theorem skozi_izhodisce (n : ℕ) (hn : n ≠ 0) : (0:ℝ) ^ n = 0 ∧
    (2 ≤ n → (1 - 0) * ((2:ℝ) ^ n - 0) - ((1:ℝ) ^ n - 0) * (2 - 0) ≠ 0) ∧
    (n = 1 → (1 - 0) * ((2:ℝ) ^ n - 0) - ((1:ℝ) ^ n - 0) * (2 - 0) = 0) := by
  refine ⟨zero_pow hn, fun h2 => ?_, fun h1 => by subst h1; norm_num⟩
  have : (2:ℝ) ^ 2 ≤ 2 ^ n := pow_le_pow_right₀ (by norm_num) h2
  rw [one_pow]; nlinarith

example : (1:ℕ) ≠ 0 := by norm_num

/-- Modeliranje, korak 1: iz 2ⁿ = 4 sledi n = 2 (n celo število). -/
theorem eksponent_iz_podvojitve (n : ℤ) : (2:ℝ) ^ n = 4 ↔ n = 2 := by
  rw [show (4:ℝ) = 2 ^ (2:ℤ) by norm_num, zpow_right_inj₀ (by norm_num) (by norm_num)]

/-- Modeliranje: skozi dve točki gre premica in tudi parabola (npr. skozi (30; 4,5) in (60; 18) gresta
s = 0,45v − 9 in s = 0,005v²), zato dve meritvi ne zadoščata za izbiro modela. -/
theorem dve_tocki : (0.45:ℝ) * 30 - 9 = 4.5 ∧ (0.45:ℝ) * 60 - 9 = 18 ∧ (0.005:ℝ) * 30 ^ 2 = 4.5 ∧
    (0.005:ℝ) * 60 ^ 2 = 18 := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: f(x) = x⁻³ = 1/x³; D_f = R \ {0}; Z_f = R \ {0}; f(−x) = −f(x) (liha); f(2) = 1/2³ = 1/8 = 0,125;
f(−1/2) = 1/(−1/2)³ = 1/(−1/8) = −8. -/
theorem primer1 :
    (∀ x : ℝ, x ^ (-3:ℤ) = 1 / x ^ 3) ∧ (∀ x : ℝ, x ^ 3 ≠ 0 ↔ x ≠ 0) ∧
    (fun x : ℝ => x ^ (-3:ℤ)) '' {x | x ≠ 0} = {y | y ≠ 0} ∧ (∀ x : ℝ, (-x) ^ (-3:ℤ) = -x ^ (-3:ℤ)) ∧
    (2:ℝ) ^ (-3:ℤ) = 1 / 2 ^ 3 ∧ (1:ℝ) / 2 ^ 3 = 1 / 8 ∧ (1:ℝ) / 8 = 0.125 ∧
    (-1/2:ℝ) ^ (-3:ℤ) = 1 / (-1/2) ^ 3 ∧ (1:ℝ) / (-1/2) ^ 3 = 1 / (-1/8) ∧ (1:ℝ) / (-1/8) = -8 := by
  have hf : ∀ x : ℝ, x ^ (-3:ℤ) = 1 / x ^ 3 := fun x => negativni x 3
  have h3 : Odd 3 := ⟨1, rfl⟩
  refine ⟨hf, fun x => negativni_D (by norm_num) x, ?_, (negativni_lih h3).1, hf 2, by norm_num, by norm_num,
    hf _, by norm_num, by norm_num⟩
  ext y; simp only [Set.mem_image, Set.mem_ofPred_eq]
  constructor
  · rintro ⟨x, hx, rfl⟩; rw [hf]; exact one_div_ne_zero (pow_ne_zero 3 hx)
  · intro hy
    refine ⟨koren 3 (1 / y), ?_, ?_⟩
    · intro h0; have := koren_lih_pot h3 (1 / y); rw [h0] at this; norm_num at this; exact hy this.symm
    · rw [hf, koren_lih_pot h3]; field_simp

/-- Primer 2: f(x) = x³ − 2 je injektivna; iz y = x³ − 2 sledi x³ = y + 2 in x = ∛(y + 2) (tudi za negativne
y + 2), zato je f⁻¹(x) = ∛(x + 2) z D = R (f(f⁻¹(x)) = x in f⁻¹(f(x)) = x); f⁻¹(6) = ∛8 = 2 (preizkus
2³ − 2 = 6), f⁻¹(−6) = ∛(−4) ≈ −1,59. -/
theorem primer2 :
    Function.Injective (fun x : ℝ => x ^ 3 - 2) ∧ (∀ x y : ℝ, y = x ^ 3 - 2 ↔ x = koren 3 (y + 2)) ∧
    (∀ x : ℝ, koren 3 (x + 2) ^ 3 - 2 = x) ∧ (∀ x : ℝ, koren 3 ((x ^ 3 - 2) + 2) = x) ∧
    koren 3 (6 + 2) = 2 ∧ (2:ℝ) ^ 3 - 2 = 6 ∧ koren 3 (-6 + 2) = koren 3 (-4) ∧
    -1.595 < koren 3 (-4) ∧ koren 3 (-4) < -1.585 := by
  have h3 : Odd 3 := ⟨1, rfl⟩
  have e4 : koren 3 (-4) = -koren 3 4 := by simp only [koren]; norm_num
  obtain ⟨a, b⟩ := koren_med (n := 3) (a := 4) (lo := 1.585) (hi := 1.595) (by norm_num) (by norm_num)
    (by norm_num) (by norm_num) (by norm_num)
  refine ⟨fun x y h => h3.strictMono_pow.injective (by simpa using h), fun x y => ?_, fun x => ?_, fun x => ?_,
    koren_eq (by norm_num) (by norm_num) (by norm_num), by norm_num, by norm_num, by rw [e4]; linarith,
    by rw [e4]; linarith⟩
  · rw [← koren_lih h3]; constructor <;> intro h <;> linarith
  · rw [koren_lih_pot h3]; ring
  · rw [sub_add_cancel]; exact ((koren_lih h3 _ _).mp rfl).symm

/-- Primer 3: a₁ = ∛0,5 ≈ 0,794 m (≈ 79 cm), preizkus 0,794³ ≈ 0,5; a₂ = ∛1 = 1; a₂/a₁ = 1/∛0,5 = ∛2 ≈ 1,26,
tudi 1/0,794 ≈ 1,26 (rob le ≈ 1,26-krat daljši, ne dvakrat). -/
theorem primer3 : 0.7935 < koren 3 0.5 ∧ koren 3 0.5 < 0.7945 ∧ 0.785 < koren 3 0.5 ∧ koren 3 0.5 < 0.795 ∧
    0.45 < (0.794:ℝ) ^ 3 ∧ (0.794:ℝ) ^ 3 < 0.55 ∧ koren 3 1 = 1 ∧ 1 / koren 3 0.5 = koren 3 2 ∧
    1.255 < koren 3 2 ∧ koren 3 2 < 1.265 ∧ 1.255 < 1 / (0.794:ℝ) ∧ 1 / (0.794:ℝ) < 1.265 ∧ koren 3 2 ≠ 2 := by
  obtain ⟨a, b⟩ := koren_med (n := 3) (a := 0.5) (lo := 0.7935) (hi := 0.7945) (by norm_num) (by norm_num)
    (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨c, d⟩ := koren_med (n := 3) (a := 2) (lo := 1.255) (hi := 1.265) (by norm_num) (by norm_num)
    (by norm_num) (by norm_num) (by norm_num)
  have hprod : koren 3 0.5 * koren 3 2 = 1 := by
    have := koren_eq (n := 3) (a := 0.5 * 2) (b := koren 3 0.5 * koren 3 2) (by norm_num)
      (by positivity) (by rw [mul_pow, koren_pot (by norm_num) (by norm_num),
        koren_pot (by norm_num) (by norm_num)])
    rw [← this, show (0.5:ℝ) * 2 = 1 by norm_num]; exact koren_eq (by norm_num) (by norm_num) (by norm_num)
  refine ⟨a, b, by linarith, by linarith, by norm_num, by norm_num, koren_eq (by norm_num) (by norm_num) (by norm_num),
    ?_, c, d, by norm_num, by norm_num, by linarith⟩
  rw [div_eq_iff (by linarith)]; linarith

/-- Primer 4: b = S · a⁻¹; b₁ = 1,2/0,8 = 1,5 m, b₂ = 1,2/1,6 = 0,75 m (dvakrat daljša → dvakrat ožja),
preizkus 1,6 · 0,75 = 1,2. -/
theorem primer4 : (1.2:ℝ) * 0.8⁻¹ = 1.2 / 0.8 ∧ (1.2:ℝ) / 0.8 = 1.5 ∧ (1.2:ℝ) / 1.6 = 0.75 ∧
    (1.2:ℝ) / (2 * 0.8) = (1.2 / 0.8) / 2 ∧ (1.6:ℝ) * 0.75 = 1.2 := by norm_num

/-- Primer 5: količniki s/v so 0,15; 0,3; 0,45; 0,6 (niso stalni); Janova premica k = (18 − 4,5)/(60 − 30) = 0,45,
s = 0,45v − 9; pri 90: 31,5 ≠ 40,5; pri 10: −4,5 < 0; podvojitev: 4 · 4,5 = 18, 4 · 18 = 72, 2ⁿ = 4 ⇒ n = 2;
c = 4,5/30² = 4,5/900 = 0,005; preizkus 0,005 · 90² = 40,5, 0,005 · 120² = 72, pri v = 0 pot 0; ocena
0,005 · 50² = 12,5. -/
theorem primer5 :
    (4.5:ℝ) / 30 = 0.15 ∧ (18:ℝ) / 60 = 0.3 ∧ (40.5:ℝ) / 90 = 0.45 ∧ (72:ℝ) / 120 = 0.6 ∧
    ((18:ℝ) - 4.5) / (60 - 30) = 0.45 ∧ (0.45:ℝ) * 30 - 9 = 4.5 ∧ (0.45:ℝ) * 60 - 9 = 18 ∧
    (0.45:ℝ) * 90 - 9 = 31.5 ∧ (31.5:ℝ) ≠ 40.5 ∧ (0.45:ℝ) * 10 - 9 = -4.5 ∧ (4:ℝ) * 4.5 = 18 ∧ (4:ℝ) * 18 = 72 ∧
    (∀ n : ℤ, (2:ℝ) ^ n = 4 ↔ n = 2) ∧ (4.5:ℝ) / 30 ^ 2 = 4.5 / 900 ∧ (4.5:ℝ) / 900 = 0.005 ∧
    (0.005:ℝ) * 30 ^ 2 = 4.5 ∧ (0.005:ℝ) * 60 ^ 2 = 18 ∧ (0.005:ℝ) * 90 ^ 2 = 40.5 ∧ (0.005:ℝ) * 120 ^ 2 = 72 ∧
    (0.005:ℝ) * 0 ^ 2 = 0 ∧ (0.005:ℝ) * 50 ^ 2 = 12.5 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num, by norm_num, eksponent_iz_podvojitve, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Primer 6: f(x) = 2/(x − 1) − 1 = 2(x − 1)⁻¹ − 1. -/
noncomputable def f6 (x : ℝ) : ℝ := 2 / (x - 1) - 1

/-- Primer 6: f(x) = 2 · (x − 1)⁻¹ − 1; razteg (1, 1) → (1, 2), premik (1, 2) → (2, 1), središče (0, 0) → (1, −1);
D_f = R \ {1} (imenovalec je nič le pri x = 1); Z_f = R \ {−1}; ničla x = 3 (2/(x − 1) = 1, x − 1 = 2);
f(0) = 2/(−1) − 1 = −3; f(−1) = −2, f(2) = 1, f(5) = −0,5. -/
theorem primer6 :
    (∀ x : ℝ, f6 x = 2 * (x - 1) ^ (-1:ℤ) - 1) ∧ (2 * (1:ℝ) = 2) ∧ ((1:ℝ) + 1 = 2 ∧ (2:ℝ) - 1 = 1) ∧
    ((0:ℝ) + 1 = 1 ∧ (0:ℝ) - 1 = -1) ∧ (∀ x : ℝ, x - 1 ≠ 0 ↔ x ≠ 1) ∧
    f6 '' {x | x ≠ 1} = {y | y ≠ -1} ∧ (∀ x : ℝ, x ≠ 1 → (f6 x = 0 ↔ x = 3)) ∧
    f6 0 = 2 / (-1) - 1 ∧ f6 0 = -3 ∧ f6 (-1) = -2 ∧ f6 2 = 1 ∧ f6 5 = -0.5 := by
  refine ⟨fun x => by simp [f6, zpow_neg, div_eq_mul_inv], by norm_num, by norm_num, by norm_num,
    fun x => by rw [Ne, sub_eq_zero], ?_, fun x hx => ?_, by simp [f6], by simp [f6]; norm_num,
    by simp [f6]; norm_num, by simp [f6]; norm_num, by simp [f6]; norm_num⟩
  · ext y; simp only [Set.mem_image, Set.mem_ofPred_eq]
    constructor
    · rintro ⟨x, hx, rfl⟩ h
      have : 2 / (x - 1) = 0 := by unfold f6 at h; linarith
      rcases div_eq_zero_iff.mp this with h1 | h1
      · norm_num at h1
      · exact hx (by linarith)
    · intro hy
      have hy1 : y + 1 ≠ 0 := fun h => hy (by linarith)
      refine ⟨2 / (y + 1) + 1, fun h => ?_, ?_⟩
      · have : 2 / (y + 1) = 0 := by linarith
        rcases div_eq_zero_iff.mp this with h1 | h1
        · norm_num at h1
        · exact hy1 h1
      · unfold f6; rw [add_sub_cancel_right, div_div_eq_mul_div]; field_simp; ring
  · have hx1 : x - 1 ≠ 0 := sub_ne_zero.mpr hx
    unfold f6
    constructor
    · intro h; rw [sub_eq_zero, div_eq_one_iff_eq hx1] at h; linarith
    · rintro rfl; norm_num

/-- Primer 6, korak 7: f pada na (−∞, 1) in na (1, ∞), na vsem D_f pa ne: f(0) = −3 < f(2) = 1. -/
theorem primer6_monotonost : StrictAntiOn f6 (Set.Iio 1) ∧ StrictAntiOn f6 (Set.Ioi 1) ∧ f6 0 < f6 2 := by
  refine ⟨fun a ha b hb hab => ?_, fun a ha b hb hab => ?_, by simp [f6]; norm_num⟩
  · simp only [Set.mem_Iio] at ha hb
    unfold f6
    have h1 : a - 1 < 0 := by linarith
    have h2 : b - 1 < 0 := by linarith
    have h1' : a - 1 ≠ 0 := h1.ne
    have h2' : b - 1 ≠ 0 := h2.ne
    have e : 2 / (b - 1) - 2 / (a - 1) = 2 * (a - b) / ((b - 1) * (a - 1)) := by field_simp; ring
    have : 2 * (a - b) / ((b - 1) * (a - 1)) < 0 := div_neg_of_neg_of_pos (by linarith) (by nlinarith)
    linarith
  · simp only [Set.mem_Ioi] at ha hb
    unfold f6
    have : 2 / (b - 1) < 2 / (a - 1) := div_lt_div_of_pos_left (by norm_num) (by linarith) (by linarith)
    linarith

/-- Primer 6 in RACUN: f(x) → −1, ko x → ∞ (asimptota y = −1). -/
theorem primer6_limita : Tendsto f6 atTop (𝓝 (-1)) := by
  have h1 : Tendsto (fun x : ℝ => x - 1) atTop atTop := tendsto_atTop_add_const_right _ (-1) tendsto_id
  have h2 : Tendsto (fun x : ℝ => 2 * (x - 1)⁻¹) atTop (𝓝 (2 * 0)) :=
    (tendsto_inv_atTop_zero.comp h1).const_mul 2
  have h3 := h2.sub_const 1
  simp only [mul_zero, zero_sub] at h3
  refine h3.congr (fun x => ?_)
  simp [f6, div_eq_mul_inv]

/-- Primer 6: asimptota x = 1 – ko gre x z desne proti 1, f(x) raste čez vse meje. -/
theorem primer6_asimptota_x : Tendsto f6 (𝓝[>] 1) atTop := by
  have h1 : Tendsto (fun x : ℝ => x - 1) (𝓝[>] 1) (𝓝[>] 0) := by
    apply tendsto_nhdsWithin_of_tendsto_nhds_of_eventually_within
    · have : Tendsto (fun x : ℝ => x - 1) (𝓝 1) (𝓝 (1 - 1)) := (continuous_id.sub continuous_const).tendsto 1
      rw [sub_self] at this; exact this.mono_left nhdsWithin_le_nhds
    · filter_upwards [self_mem_nhdsWithin] with x hx; exact sub_pos.mpr hx
  have h2 := Tendsto.const_mul_atTop (show (0:ℝ) < 2 by norm_num) h1.inv_tendsto_nhdsGT_zero
  have h3 := tendsto_atTop_add_const_right _ (-1) h2
  refine h3.congr (fun x => ?_)
  simp [f6, div_eq_mul_inv]; ring

/-- Primer 6: f(x) → −1 tudi, ko x → −∞. -/
theorem primer6_limita_minus : Tendsto f6 atBot (𝓝 (-1)) := by
  have h1 : Tendsto (fun x : ℝ => x - 1) atBot atBot := tendsto_atBot_add_const_right _ (-1) tendsto_id
  have h2 : Tendsto (fun x : ℝ => 2 * (x - 1)⁻¹) atBot (𝓝 (2 * 0)) :=
    (tendsto_inv_atBot_zero.comp h1).const_mul 2
  have h3 := h2.sub_const 1
  simp only [mul_zero, zero_sub] at h3
  refine h3.congr (fun x => ?_)
  simp [f6, div_eq_mul_inv]

/-- Primer 6: asimptota x = 1 – ko gre x z leve proti 1, gre f(x) proti −∞. -/
theorem primer6_asimptota_x_leve : Tendsto f6 (𝓝[<] 1) atBot := by
  have h1 : Tendsto (fun x : ℝ => x - 1) (𝓝[<] 1) (𝓝[<] 0) := by
    apply tendsto_nhdsWithin_of_tendsto_nhds_of_eventually_within
    · have : Tendsto (fun x : ℝ => x - 1) (𝓝 1) (𝓝 (1 - 1)) := (continuous_id.sub continuous_const).tendsto 1
      rw [sub_self] at this; exact this.mono_left nhdsWithin_le_nhds
    · filter_upwards [self_mem_nhdsWithin] with x hx; exact sub_neg.mpr hx
  have h2 := Tendsto.const_mul_atBot (show (0:ℝ) < 2 by norm_num) h1.inv_tendsto_nhdsLT_zero
  have h3 := tendsto_atBot_add_const_right _ (-1) h2
  refine h3.congr (fun x => ?_)
  simp [f6, div_eq_mul_inv]; ring

/-! ## Pogoste napake -/

/-- Pogoste napake: 2⁻² = 1/4 (ne −4), x⁻² > 0 za x ≠ 0; pri lihem n je (−1)ⁿ = −1; √9 = 3 ≠ −3; ∛(−8) = −2;
dvakrat daljši rob da 2³ = 8-krat večjo prostornino; pri podvojeni prostornini rob zraste za ∛2 ≈ 1,26. -/
theorem pogoste_napake : (2:ℝ) ^ (-2:ℤ) = 1 / 4 ∧ (2:ℝ) ^ (-2:ℤ) ≠ -4 ∧ (∀ x : ℝ, x ≠ 0 → 0 < x ^ (-2:ℤ)) ∧
    (-1:ℝ) ^ 3 = -1 ∧ √((-3:ℝ) ^ 2) = 3 ∧ koren 3 (-8) = -2 ∧ (2:ℝ) ^ 3 = 8 ∧
    1.255 < koren 3 2 ∧ koren 3 2 < 1.265 := by
  obtain ⟨c, d⟩ := koren_med (n := 3) (a := 2) (lo := 1.255) (hi := 1.265) (by norm_num) (by norm_num)
    (by norm_num) (by norm_num) (by norm_num)
  refine ⟨by norm_num, by norm_num, fun x hx => (negativni_sod (n := 2) even_two).2.1 x hx, by norm_num,
    by rw [show ((-3:ℝ)) ^ 2 = 3 ^ 2 by norm_num]; exact sqrt_kv (by norm_num), kubicni_inverz.2.2.2, by norm_num,
    c, d⟩

/-! ## Za maturo -/

/-- Naloga 1: g(x) = (x − 1)⁻² + 2 = 1/(x − 1)² + 2. -/
noncomputable def g1 (x : ℝ) : ℝ := (x - 1) ^ (-2:ℤ) + 2

/-- Naloga 1: g(x) = 1/(x − 1)² + 2; D_g = R \ {1}; zaloga x⁻² je (0, ∞), Z_g = (2, ∞). -/
theorem matura1 : (∀ x : ℝ, g1 x = 1 / (x - 1) ^ 2 + 2) ∧ (∀ x : ℝ, (x - 1) ^ 2 ≠ 0 ↔ x ≠ 1) ∧
    (fun x : ℝ => x ^ (-2:ℤ)) '' {x | x ≠ 0} = Set.Ioi 0 ∧ g1 '' {x | x ≠ 1} = Set.Ioi 2 := by
  have hg : ∀ x : ℝ, g1 x = 1 / (x - 1) ^ 2 + 2 := fun x => by unfold g1; simp [zpow_neg, one_div]
  refine ⟨hg, fun x => by rw [Ne, pow_eq_zero_iff (by norm_num), sub_eq_zero], ?_, ?_⟩
  · ext y; simp only [Set.mem_image, Set.mem_ofPred_eq, Set.mem_Ioi]
    constructor
    · rintro ⟨x, hx, rfl⟩; exact (negativni_sod (n := 2) even_two).2.1 x hx
    · intro hy
      refine ⟨√(1 / y), by positivity, ?_⟩
      rw [show (-2:ℤ) = -((2:ℕ):ℤ) by norm_num, negativni, Real.sq_sqrt (by positivity)]; field_simp
  · ext y; simp only [Set.mem_image, Set.mem_ofPred_eq, Set.mem_Ioi]
    constructor
    · rintro ⟨x, hx, rfl⟩; rw [hg]
      have : 0 < (x - 1) ^ 2 := lt_of_le_of_ne (sq_nonneg _) (Ne.symm (pow_ne_zero 2 (sub_ne_zero.mpr hx)))
      have : 0 < 1 / (x - 1) ^ 2 := by positivity
      linarith
    · intro hy
      have hy2 : 0 < y - 2 := by linarith
      refine ⟨√(1 / (y - 2)) + 1, ?_, ?_⟩
      · have : 0 < √(1 / (y - 2)) := by positivity
        intro h; linarith
      · rw [hg, add_sub_cancel_right, Real.sq_sqrt (by positivity)]; field_simp; ring

/-- Naloga 1 in RACUN: asimptoti x = 1 in y = 2: g(x) → 2, ko x → ∞, in g(x) → ∞, ko x → 1. -/
theorem matura1_asimptoti : Tendsto g1 atTop (𝓝 2) ∧ Tendsto g1 (𝓝[≠] 1) atTop := by
  have hg : ∀ x : ℝ, g1 x = ((x - 1) ^ 2)⁻¹ + 2 := fun x => by unfold g1; rw [zpow_neg]; norm_num
  constructor
  · have h1 : Tendsto (fun x : ℝ => x - 1) atTop atTop := tendsto_atTop_add_const_right _ (-1) tendsto_id
    have h2 : Tendsto (fun x : ℝ => ((x - 1) ^ 2)⁻¹) atTop (𝓝 0) :=
      tendsto_inv_atTop_zero.comp ((tendsto_pow_atTop (by norm_num)).comp h1)
    have h3 := h2.add_const 2
    rw [zero_add] at h3
    exact h3.congr (fun x => (hg x).symm)
  · have h1 : Tendsto (fun x : ℝ => (x - 1) ^ 2) (𝓝[≠] 1) (𝓝[>] 0) := by
      apply tendsto_nhdsWithin_of_tendsto_nhds_of_eventually_within
      · have : Tendsto (fun x : ℝ => (x - 1) ^ 2) (𝓝 1) (𝓝 ((1 - 1) ^ 2)) :=
          ((continuous_id.sub continuous_const).pow 2).tendsto 1
        rw [sub_self, zero_pow (by norm_num)] at this
        exact this.mono_left nhdsWithin_le_nhds
      · filter_upwards [self_mem_nhdsWithin] with x hx
        have : x - 1 ≠ 0 := sub_ne_zero.mpr hx
        exact lt_of_le_of_ne (sq_nonneg _) (Ne.symm (pow_ne_zero 2 this))
    have h2 := tendsto_atTop_add_const_right _ 2 h1.inv_tendsto_nhdsGT_zero
    exact h2.congr (fun x => (hg x).symm)

/-- Naloga 2 a): T/l: 1,0/0,25 = 4; 2,0/1,00 = 2; 3,0/2,25 ≈ 1,33; 4,0/4,00 = 1 (ni stalen); štirikratna dolžina
(1 → 4) da le dvakraten čas (2 → 4). -/
theorem matura2a : (1.0:ℝ) / 0.25 = 4 ∧ (2.0:ℝ) / 1.00 = 2 ∧ 1.325 < (3.0:ℝ) / 2.25 ∧ (3.0:ℝ) / 2.25 < 1.335 ∧
    (4.0:ℝ) / 4.00 = 1 ∧ (1.0:ℝ) / 0.25 ≠ 2.0 / 1.00 ∧ (4:ℝ) = 4 * 1 ∧ (4.0:ℝ) = 2 * 2.0 := by norm_num

/-- Naloga 2 b): √0,25 = 0,5; √1 = 1; √2,25 = 1,5; √4 = 2; količniki T/√l so vsi 2, zato T = 2√l, c = 2. -/
theorem matura2b : √(0.25:ℝ) = 0.5 ∧ √(1:ℝ) = 1 ∧ √(2.25:ℝ) = 1.5 ∧ √(4:ℝ) = 2 ∧
    (1.0:ℝ) / 0.5 = 2 ∧ (2.0:ℝ) / 1 = 2 ∧ (3.0:ℝ) / 1.5 = 2 ∧ (4.0:ℝ) / 2 = 2 := by
  refine ⟨?_, Real.sqrt_one, ?_, ?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  · rw [show (0.25:ℝ) = 0.5 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)
  · rw [show (2.25:ℝ) = 1.5 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)
  · rw [show (4:ℝ) = 2 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)

/-- Naloga 2 c): T = 2√1,5 ≈ 2,4495 ≈ 2,45 s. -/
theorem matura2c : 2.44945 < 2 * √(1.5:ℝ) ∧ 2 * √(1.5:ℝ) < 2.44955 ∧ 2.445 < 2 * √(1.5:ℝ) ∧ 2 * √(1.5:ℝ) < 2.455 := by
  have a : (1.224725:ℝ) < √1.5 := (Real.lt_sqrt (by norm_num)).mpr (by norm_num)
  have b : √(1.5:ℝ) < 1.224775 := (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)
  refine ⟨by linarith, by linarith, by linarith, by linarith⟩

/-- Naloga 2 d): iz T = 2√l (T ≥ 0) sledi √l = T/2 in l = T²/4 (inverz); za T = 1,5: l = 1,5²/4 = 2,25/4 = 0,5625 m
≈ 56 cm; RACUN: 2√l = 1,5 ⇔ l = 0,5625. -/
theorem matura2d (T l : ℝ) (hT : 0 ≤ T) (hl : 0 ≤ l) : (T = 2 * √l ↔ √l = T / 2) ∧ (T = 2 * √l ↔ l = T ^ 2 / 4) ∧
    (1.5:ℝ) ^ 2 / 4 = 2.25 / 4 ∧ (2.25:ℝ) / 4 = 0.5625 ∧ (55.5:ℝ) ≤ 0.5625 * 100 ∧ (0.5625:ℝ) * 100 < 56.5 ∧
    (2 * √l = 1.5 ↔ l = 0.5625) := by
  have key : ∀ T : ℝ, 0 ≤ T → (T = 2 * √l ↔ l = T ^ 2 / 4) := by
    intro T hT
    constructor
    · intro h; rw [h, mul_pow, Real.sq_sqrt hl]; ring
    · intro h; rw [h, Real.sqrt_div' _ (by norm_num), Real.sqrt_sq hT,
        show (4:ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]; ring
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, key T hT, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  rw [eq_comm, key 1.5 (by norm_num)]; norm_num

example : (0:ℝ) ≤ 1.5 ∧ (0:ℝ) ≤ 0.5625 := by norm_num

/-! ## Drugače -/

/-- Korak za korakom: zamenjani stolpci tabele x³ dajo točke grafa ∛x: (−8, −2), (−1, −1), (0, 0), (1, 1), (8, 2);
iz tabele x² za x ≥ 0 točke grafa √x: (0, 0), (1, 1), (4, 2), (9, 3). -/
theorem korak_tocke : koren 3 (-8) = -2 ∧ koren 3 (-1) = -1 ∧ koren 3 0 = 0 ∧ koren 3 1 = 1 ∧ koren 3 8 = 2 ∧
    √(0:ℝ) = 0 ∧ √(1:ℝ) = 1 ∧ √(4:ℝ) = 2 ∧ √(9:ℝ) = 3 := by
  have h3 : Odd 3 := ⟨1, rfl⟩
  refine ⟨((koren_lih h3 _ _).mp (by norm_num)).symm, ((koren_lih h3 _ _).mp (by norm_num)).symm,
    koren_eq (by norm_num) le_rfl (by norm_num), koren_eq (by norm_num) (by norm_num) (by norm_num),
    koren_eq (by norm_num) (by norm_num) (by norm_num), Real.sqrt_zero, Real.sqrt_one, ?_, ?_⟩
  · rw [show (4:ℝ) = 2 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)
  · rw [show (9:ℝ) = 3 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)

/-- Kot zgodba: stranica z 2 na 4 m da štirikrat več ploščic (4² = 4 · 2²); za 20 m² je stranica √20 ≈ 4,5 m. -/
theorem zgodba : (4:ℝ) ^ 2 = 4 * 2 ^ 2 ∧ 4.45 < √(20:ℝ) ∧ √(20:ℝ) < 4.55 :=
  ⟨by norm_num, (Real.lt_sqrt (by norm_num)).mpr (by norm_num), (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)⟩

/-! ## Preveri se -/

/-- Preveri se, 1: x⁻² da pri −2, −1, 1, 2 vrednosti 1/4, 1, 1, 1/4; x² da pri 2 vrednost 4, x⁻¹ pri −1 vrednost
−1, −x² da negativne vrednosti. -/
theorem preveri1 : (-2:ℝ) ^ (-2:ℤ) = 1 / 4 ∧ (-1:ℝ) ^ (-2:ℤ) = 1 ∧ (1:ℝ) ^ (-2:ℤ) = 1 ∧ (2:ℝ) ^ (-2:ℤ) = 1 / 4 ∧
    (2:ℝ) ^ 2 = 4 ∧ (-1:ℝ) ^ (-1:ℤ) = -1 ∧ -(1:ℝ) ^ 2 < 0 := by norm_num

/-- Preveri se, 2: 3³ = 27 < 30 < 64 = 4³, ∛30 ≈ 3,1 (natančneje ≈ 3,11); 10³ = 1000; 5,5² ≈ 30, 5,5³ ≈ 166;
2,5³ ≈ 15,6. -/
theorem preveri2 : 3.105 < koren 3 30 ∧ koren 3 30 < 3.115 ∧ 3.05 < koren 3 30 ∧ koren 3 30 < 3.15 ∧
    (10:ℝ) ^ 3 = 1000 ∧ (5.5:ℝ) ^ 2 = 30.25 ∧ (5.5:ℝ) ^ 3 = 166.375 ∧ (2.5:ℝ) ^ 3 = 15.625 ∧
    (27:ℝ) < 30 ∧ (30:ℝ) < 64 := by
  obtain ⟨a, b⟩ := koren_med (n := 3) (a := 30) (lo := 3.105) (hi := 3.115) (by norm_num) (by norm_num)
    (by norm_num) (by norm_num) (by norm_num)
  exact ⟨a, b, by linarith, by linarith, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Preveri se, 3: x³ je injektivna, x² ni ((−2)² = 2²); vodoravna premica y = 4 seka parabolo dvakrat. -/
theorem preveri3 : Function.Injective (fun x : ℝ => x ^ 3) ∧ (-2:ℝ) ^ 2 = 2 ^ 2 ∧ (-2:ℝ) ≠ 2 :=
  ⟨kubicni_inverz.1, by norm_num, by norm_num⟩

/-- Preveri se, 4: 2ⁿ = 1/8 ⇔ n = −3 (2⁻³ = 1/2³ = 1/8); 2³ = 8, 2⁻⁸ = 1/256, 2⁻⁴ = 1/16. -/
theorem preveri4 (n : ℤ) : ((2:ℝ) ^ n = 1 / 8 ↔ n = -3) ∧ (2:ℝ) ^ (-3:ℤ) = 1 / 2 ^ 3 ∧ (2:ℝ) ^ (-8:ℤ) = 1 / 256 ∧
    (2:ℝ) ^ (-4:ℤ) = 1 / 16 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  rw [show (1:ℝ) / 8 = 2 ^ (-3:ℤ) by norm_num, zpow_right_inj₀ (by norm_num) (by norm_num)]

/-- Preveri se, 5: (3a)³ = 27a³ (3² = 9 je razmerje ploščin ploskev). -/
theorem preveri5 (a : ℝ) : (3 * a) ^ 3 = 27 * a ^ 3 ∧ (3 * a) ^ 2 = 9 * a ^ 2 := ⟨by ring, by ring⟩

/-- Preveri se, 6: y = c xⁿ z vrednostmi 3, 24, 192 pri x = 1, 2, 4: 24/3 = 192/24 = 8 = 2³, torej n = 3, c = 3. -/
theorem preveri6 (c : ℝ) (n : ℤ) (h1 : c * 1 ^ n = 3) (h2 : c * 2 ^ n = 24) : n = 3 ∧ c = 3 ∧
    (24:ℝ) / 3 = 8 ∧ (192:ℝ) / 24 = 8 ∧ (3:ℝ) * 4 ^ (3:ℤ) = 192 := by
  have hc : c = 3 := by simpa using h1
  subst hc
  have : (2:ℝ) ^ n = 8 := by linarith
  refine ⟨?_, rfl, by norm_num, by norm_num, by norm_num⟩
  rwa [show (8:ℝ) = 2 ^ (3:ℤ) by norm_num, zpow_right_inj₀ (by norm_num) (by norm_num)] at this

example : (3:ℝ) * 1 ^ (3:ℤ) = 3 ∧ (3:ℝ) * 2 ^ (3:ℤ) = 24 := by norm_num

/-- Preveri se, 7: središče (2, 1), f(x) = (x − 2)³ + 1; f(4) = 2³ + 1 = 9; graf skozi (1, 0) in (3, 2);
napačni odgovori (4 + 2)³ + 1 = 217, (4 − 1)³ + 2 = 29, (4 − 2)³ − 1 = 7. -/
theorem preveri7 : ((4:ℝ) - 2) ^ 3 + 1 = 2 ^ 3 + 1 ∧ (2:ℝ) ^ 3 + 1 = 9 ∧ ((2:ℝ) - 2) ^ 3 + 1 = 1 ∧
    ((1:ℝ) - 2) ^ 3 + 1 = 0 ∧ ((3:ℝ) - 2) ^ 3 + 1 = 2 ∧ ((4:ℝ) + 2) ^ 3 + 1 = 217 ∧ ((4:ℝ) - 1) ^ 3 + 2 = 29 ∧
    ((4:ℝ) - 2) ^ 3 - 1 = 7 := by norm_num

/-- RACUN: 3,0/√2,25 = 2, 1,0/√0,25 = 2, 1,5²/4 = 0,5625, 0,6 · 3³ = 16,2, 16,2/3 = 5,4, 2/(0 − 1) − 1 = −3,
2/(5 − 1) − 1 = −0,5, 2/(x − 1) − 1 = 0 ⇔ x = 3 (za x ≠ 1), 3 · 2ⁿ = 24 ⇔ n = 3, (4 − 2)³ + 1 = 9. -/
theorem racun (n : ℤ) : (3.0:ℝ) / √2.25 = 2 ∧ (1.0:ℝ) / √0.25 = 2 ∧ (1.5:ℝ) ^ 2 / 4 = 0.5625 ∧
    (0.6:ℝ) * 3 ^ 3 = 16.2 ∧ (16.2:ℝ) / 3 = 5.4 ∧ (2:ℝ) / (0 - 1) - 1 = -3 ∧ (2:ℝ) / (5 - 1) - 1 = -0.5 ∧
    (∀ x : ℝ, x ≠ 1 → (2 / (x - 1) - 1 = 0 ↔ x = 3)) ∧ ((4:ℝ) - 2) ^ 3 + 1 = 9 ∧
    ((3:ℝ) * 2 ^ n = 24 ↔ n = 3) := by
  have e1 : √(2.25:ℝ) = 1.5 := by rw [show (2.25:ℝ) = 1.5 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)
  have e2 : √(0.25:ℝ) = 0.5 := by rw [show (0.25:ℝ) = 0.5 ^ 2 by norm_num]; exact sqrt_kv (by norm_num)
  refine ⟨by rw [e1]; norm_num, by rw [e2]; norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, fun x hx => primer6.2.2.2.2.2.2.1 x hx, by norm_num, ?_⟩
  rw [show ((3:ℝ) * 2 ^ n = 24) ↔ (2:ℝ) ^ n = 2 ^ (3:ℤ) from ⟨fun h => by norm_num; linarith,
    fun h => by rw [h]; norm_num⟩, zpow_right_inj₀ (by norm_num) (by norm_num)]

/-- Modeliranje (realni eksponent): 2^r = 4 ⇔ r = 2 in 3 · 2^r = 24 ⇔ r = 3 tudi za realni r. -/
theorem eksponent_realni (r : ℝ) : ((2:ℝ) ^ r = 4 ↔ r = 2) ∧ ((3:ℝ) * 2 ^ r = 24 ↔ r = 3) := by
  have inj : ∀ a b : ℝ, (2:ℝ) ^ a = 2 ^ b ↔ a = b := fun a b =>
    ⟨fun h => le_antisymm ((Real.rpow_le_rpow_left_iff (by norm_num)).mp h.le)
      ((Real.rpow_le_rpow_left_iff (by norm_num)).mp h.ge), fun h => by rw [h]⟩
  refine ⟨?_, ?_⟩
  · rw [show (4:ℝ) = 2 ^ (2:ℝ) by norm_num, inj]
  · rw [show ((3:ℝ) * 2 ^ r = 24) ↔ (2:ℝ) ^ r = 2 ^ (3:ℝ) from ⟨fun h => by norm_num; linarith,
      fun h => by rw [h]; norm_num⟩, inj]

end Evklid.Lekcije.MAT_SS_2.PotencnaInKorenskaFunkcija
