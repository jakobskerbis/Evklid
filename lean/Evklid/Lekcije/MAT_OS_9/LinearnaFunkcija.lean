/-
vir: content/lessons/MAT-OS-9/linearna-funkcija.md
sha256: fd9ceda209212d97151b3e81bcbb0fcc712db642b1c0d50ddf4bec8073eca6d9
Model: linearna funkcija je `f k n x = k·x + n` na ℝ; količine so brez enot (mm, h, °C, km, cm so le v
docstringih); decimalna števila so točni ulomki (2,5 = 5/2). »k in n predpisa« pomeni: če je k·x + n = a·x + b za
vsak x, je k = a in n = b (`koeficienta`). »Narašča/pada« je `StrictMono`/`StrictAnti`, »konstantna« je f x = n za
vsak x. »Bolj strma« je model: sprememba |f x₂ − f x₁| = |k|·|x₂ − x₁| je pri večjem |k| večja. »≈ 7« je
|vrednost − 7| < 1/2. Čas 8.00, 11.00, 10.00, 14.00 je zapisan kot število (ur od 6.00 oz. ura dneva).
Ni v Leanu: zgodbe (dežemer, 1 mm = 1 L/m², hrib, sneg) kot fizika; definicija funkcije ter neodvisne in odvisne
spremenljivke (pojma, ne trditvi; »ob istem času ena višina« je dogovor modela); izvor imena »linearna«; risbe in
simulacija (drsnika, stopnica kot slika — dokazano je le f 1 = k + n in pri k = 1/2 dvojna stopnica); »graf je
premica« (pojem premice ni definiran v lekciji; dokazano je, da je sprememba y sorazmerna spremembi x); enote k
in »predpis velja le v nekem obsegu / pravilo velja povprečno« (opis modela); presečišče z osjo x (druga lekcija).
Lean: x/0 = 0; formula za k iz dveh točk ima zato pogoj x₂ ≠ x₁.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_9.LinearnaFunkcija

/-- Linearna funkcija s predpisom y = kx + n. -/
noncomputable def f (k n x : ℝ) : ℝ := k * x + n

/-! ## Razlaga -/

/-- Razlaga 1 (tabela meritev): pri y = 4x + 12 so vrednosti pri x = 0, 1, 2, 3 enake 12, 16, 20, 24. -/
theorem tabela : f 4 12 0 = 12 ∧ f 4 12 1 = 16 ∧ f 4 12 2 = 20 ∧ f 4 12 3 = 24 := by
  unfold f; norm_num

/-- Razlaga 1, Hitro preveri: po 2 urah je 4 · 2 + 12 = 20. -/
theorem po_dveh_urah : f 4 12 2 = 20 := by
  calc f 4 12 2 = 4 * 2 + 12 := rfl
    _ = 20 := by norm_num

/-- Razlaga 3, Premisli 1: po 6 urah je 4 · 6 + 12 = 36. -/
theorem po_sestih_urah : f 4 12 6 = 36 := by
  calc f 4 12 6 = 4 * 6 + 12 := rfl
    _ = 36 := by norm_num

/-- Razlaga 3 in 4, Pogoste napake, Primer 1: k in n sta s predpisom natanko določena — k·x + n = a·x + b za
vsak x natanko tedaj, ko je k = a in n = b (»k je število ob x, n samostojno število«). -/
theorem koeficienta (k n a b : ℝ) : (∀ x, f k n x = f a b x) ↔ (k = a ∧ n = b) := by
  constructor
  · intro h
    have h0 := h 0
    have h1 := h 1
    unfold f at h0 h1
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩ x
    rfl

/-- Razlaga 3, Hitro preveri: pri y = 5x − 2 je k = 5 in n = −2. -/
theorem kn_5x_minus_2 : (∀ x, f 5 (-2) x = 5 * x - 2) ∧ (∀ k n, (∀ x, f k n x = 5 * x - 2) → k = 5 ∧ n = -2) := by
  refine ⟨fun x => by unfold f; ring, fun k n h => (koeficienta k n 5 (-2)).1 fun x => ?_⟩
  rw [h x]; unfold f; ring

/-- Razlaga 4: f(0) = k · 0 + n = n (začetna vrednost). -/
theorem zacetna_vrednost (k n : ℝ) : f k n 0 = n := by
  calc f k n 0 = k * 0 + n := rfl
    _ = n := by ring

/-- Razlaga 4, Preveri se 3: graf seka os y natanko v točki (0, n): točka (0, y) je na grafu natanko tedaj,
ko je y = n. -/
theorem os_y (k n y : ℝ) : y = f k n 0 ↔ y = n := by
  rw [zacetna_vrednost]

/-- Razlaga 4: pri y = 2x − 5 je začetna vrednost −5 (presečišče (0, −5) je pod osjo x); pri y = −3x + 7 je 7. -/
theorem zacetne_primeri : f 2 (-5) 0 = -5 ∧ (-5 : ℝ) < 0 ∧ f (-3) 7 0 = 7 := by
  unfold f; norm_num

/-- Razlaga 5, Povzetek: k pove, za koliko se spremeni y, ko se x poveča za 1: f(x + 1) − f(x) = k. -/
theorem sprememba_na_enoto (k n x : ℝ) : f k n (x + 1) - f k n x = k := by
  unfold f; ring

/-- Razlaga 5: pri k > 0 funkcija narašča (in obratno: narašča le pri k > 0). -/
theorem narasca (k n : ℝ) : StrictMono (f k n) ↔ 0 < k := by
  constructor
  · intro h
    have := h (show (0 : ℝ) < 1 by norm_num)
    unfold f at this
    linarith
  · intro hk a b hab
    unfold f
    nlinarith

/-- Razlaga 5: pri k < 0 funkcija pada (in obratno: pada le pri k < 0). -/
theorem pada (k n : ℝ) : StrictAnti (f k n) ↔ k < 0 := by
  constructor
  · intro h
    have := h (show (0 : ℝ) < 1 by norm_num)
    unfold f at this
    linarith
  · intro hk a b hab
    unfold f
    nlinarith

/-- Razlaga 5: pri k = 0 je y = n pri vsakem x (konstantna funkcija, vodoravna premica); in obratno. -/
theorem konstantna (k n : ℝ) : (∀ x, f k n x = n) ↔ k = 0 := by
  constructor
  · intro h
    have := h 1
    unfold f at this
    linarith
  · rintro rfl x
    unfold f; ring

/-- Razlaga 5, Hitro preveri: y = −0,5x + 3 pada, ker je k < 0. -/
theorem pada_primer : StrictAnti (f (-1 / 2) 3) := (pada _ _).2 (by norm_num)

/-- Razlaga 5 (sneg, ki se tali za 2 cm na uro, k = −2): funkcija pada. -/
theorem sneg_pada (n : ℝ) : StrictAnti (f (-2) n) := (pada _ _).2 (by norm_num)

/-- Razlaga 5, Pogoste napake (model strmine): sprememba y je |f x₂ − f x₁| = |k| · |x₂ − x₁|. -/
theorem strmina (k n x₁ x₂ : ℝ) : |f k n x₂ - f k n x₁| = |k| * |x₂ - x₁| := by
  unfold f
  rw [show k * x₂ + n - (k * x₁ + n) = k * (x₂ - x₁) by ring, abs_mul]

/-- Razlaga 5, Pogoste napake: večji |k| pomeni bolj strmo premico — pri |k₁| < |k₂| in x₁ ≠ x₂ je sprememba
y pri prvi premici manjša. -/
theorem bolj_strma (k₁ n₁ k₂ n₂ x₁ x₂ : ℝ) (hk : |k₁| < |k₂|) (hx : x₁ ≠ x₂) :
    |f k₁ n₁ x₂ - f k₁ n₁ x₁| < |f k₂ n₂ x₂ - f k₂ n₂ x₁| := by
  rw [strmina, strmina]
  have : 0 < |x₂ - x₁| := abs_pos.mpr (sub_ne_zero.mpr hx.symm)
  exact mul_lt_mul_of_pos_right hk this

/-- Predpostavke `bolj_strma` se dajo izpolniti (naliv k = 10 proti pršenju k = 1; Pogoste napake: k = −4
proti k = 2). -/
example : |(1 : ℝ)| < |10| ∧ |(2 : ℝ)| < |-4| ∧ (0 : ℝ) ≠ 1 := by norm_num

/-- Pogoste napake: premica s k = −4 je bolj strma od premice s k = 2 (|2| < |−4|), a pada. -/
theorem minus4_proti_2 (n : ℝ) : |(2 : ℝ)| < |(-4 : ℝ)| ∧ StrictAnti (f (-4) n) :=
  ⟨by norm_num, (pada _ _).2 (by norm_num)⟩

/-- Razlaga 6 in Bolj natančno: za točki (x₁, y₁), (x₂, y₂) na premici y = kx + n z x₂ ≠ x₁ je
(y₂ − y₁)/(x₂ − x₁) = k, po korakih: y₂ − y₁ = kx₂ − kx₁ = k(x₂ − x₁), nato delimo z x₂ − x₁. -/
theorem k_iz_dveh_tock (k n x₁ y₁ x₂ y₂ : ℝ) (hx : x₂ ≠ x₁) (h₁ : y₁ = f k n x₁) (h₂ : y₂ = f k n x₂) :
    (y₂ - y₁) / (x₂ - x₁) = k := by
  have hd : x₂ - x₁ ≠ 0 := sub_ne_zero.mpr hx
  unfold f at h₁ h₂
  calc (y₂ - y₁) / (x₂ - x₁) = (k * x₂ - k * x₁) / (x₂ - x₁) := by rw [h₁, h₂]; ring_nf
    _ = k * (x₂ - x₁) / (x₂ - x₁) := by ring_nf
    _ = k := by field_simp

/-- Predpostavke `k_iz_dveh_tock` se dajo izpolniti (točki (1, 16) in (3, 24) na y = 4x + 12). -/
example : (3 : ℝ) ≠ 1 ∧ (16 : ℝ) = f 4 12 1 ∧ (24 : ℝ) = f 4 12 3 := by unfold f; norm_num

/-- Razlaga 6: iz meritev (1, 16) in (3, 24) je k = (24 − 16)/(3 − 1) = 8/2 = 4. -/
theorem k_dezemer : ((24 : ℝ) - 16) / (3 - 1) = 4 := by
  calc ((24 : ℝ) - 16) / (3 - 1) = 8 / 2 := by norm_num
    _ = 4 := by norm_num

/-- Razlaga 6, Hitro preveri: premica skozi (0, 12) in (2, 20) ima k = 8/2 = 4. -/
theorem k_hitro : ((20 : ℝ) - 12) / (2 - 0) = 4 := by
  calc ((20 : ℝ) - 12) / (2 - 0) = 8 / 2 := by norm_num
    _ = 4 := by norm_num

/-- Razlaga 7, Povzetek: pri n = 0 je y = kx in premica gre skozi izhodišče (0, 0). -/
theorem premo_sorazmerje (k x : ℝ) : f k 0 x = k * x ∧ f k 0 0 = 0 := by
  unfold f; constructor <;> ring

/-- Razlaga 7, Premisli 2: nova premica y = 4x ima enak k, na vsakem x je za 12 nižje od y = 4x + 12, in gre
skozi izhodišče. -/
theorem prazen_kozarec (x : ℝ) : f 4 12 x - f 4 0 x = 12 ∧ f 4 0 0 = 0 := by
  unfold f; constructor <;> ring

/-! ## Rešeni primeri -/

/-- Primer 1: pri y = 2x + 3 je k = 2, n = 3: f 2 3 je ta predpis in vsak k, n z istim predpisom je k = 2, n = 3. -/
theorem primer1_kn : (∀ x, f 2 3 x = 2 * x + 3) ∧ (∀ k n, (∀ x, f k n x = 2 * x + 3) → k = 2 ∧ n = 3) := by
  refine ⟨fun x => by unfold f; ring, fun k n h => (koeficienta k n 2 3).1 fun x => ?_⟩
  rw [h x]; unfold f; ring

/-- Primer 1: vrednosti: 2 · 0 + 3 = 3, 2 · 1 + 3 = 5,
2 · 4 + 3 = 8 + 3 = 11. -/
theorem primer1 : f 2 3 0 = 3 ∧ f 2 3 1 = 5 ∧ f 2 3 4 = 11 := by
  refine ⟨?_, ?_, ?_⟩
  · calc f 2 3 0 = 2 * 0 + 3 := rfl
      _ = 3 := by norm_num
  · calc f 2 3 1 = 2 * 1 + 3 := rfl
      _ = 5 := by norm_num
  · calc f 2 3 4 = 2 * 4 + 3 := rfl
      _ = 8 + 3 := by norm_num
      _ = 11 := by norm_num

/-- Primer 1, preizkus s k: ko se x poveča z 0 na 1, se y poveča s 3 na 5, torej za 2 = k. -/
theorem primer1_preizkus : f 2 3 1 - f 2 3 0 = 2 := by
  unfold f; norm_num

/-- Primer 2 (temperatura): y = −6x + 18; na vrhu 2,5 km: −6 · 2,5 + 18 = −15 + 18 = 3. -/
theorem primer2 : f (-6) 18 (5 / 2) = 3 := by
  calc f (-6) 18 (5 / 2) = -6 * (5 / 2) + 18 := rfl
    _ = -15 + 18 := by norm_num
    _ = 3 := by norm_num

/-- Primer 3 (sneg), korak 2: k = (18 − 9)/(5 − 2) = 9/3 = 3. -/
theorem primer3_k : ((18 : ℝ) - 9) / (5 - 2) = 3 := by
  calc ((18 : ℝ) - 9) / (5 - 2) = 9 / 3 := by norm_num
    _ = 3 := by norm_num

/-- Primer 3, Premisli: 9 = 3 · 2 + n natanko pri n = 9 − 6 = 3. -/
theorem primer3_n (n : ℝ) : 9 = 3 * 2 + n ↔ n = 3 := by
  calc 9 = 3 * 2 + n ↔ n = 9 - 6 := by constructor <;> intro h <;> linarith
    _ ↔ n = 3 := by norm_num

/-- Primer 3, Premisli, preizkus: 3 · 5 + 3 = 18. -/
theorem primer3_preizkus : f 3 3 5 = 18 := by
  calc f 3 3 5 = 3 * 5 + 3 := rfl
    _ = 18 := by norm_num

/-- Primer 3: y = 3x + 3 je edina linearna funkcija skozi točki (2, 9) in (5, 18) (ob 6.00 je bilo 3 cm). -/
theorem primer3_enolicno (k n : ℝ) : (f k n 2 = 9 ∧ f k n 5 = 18) ↔ (k = 3 ∧ n = 3) := by
  unfold f
  constructor
  · rintro ⟨h1, h2⟩
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩
    norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake: pri y = 5x + 1 je k = 5 in n = 1 (vstavimo x = 0, ostane 1). -/
theorem napaka_zamenjana : (∀ k n, (∀ x, f k n x = 5 * x + 1) → k = 5 ∧ n = 1) ∧ f 5 1 0 = 1 := by
  refine ⟨fun k n h => (koeficienta k n 5 1).1 fun x => ?_, by unfold f; norm_num⟩
  rw [h x]; unfold f; ring

/-- Pogoste napake: y = 4 − 3x je y = −3x + 4, torej k = −3 in n = 4; pri y = 2x − 5 je n = −5. -/
theorem napaka_predznak :
    (∀ k n, (∀ x, f k n x = 4 - 3 * x) → k = -3 ∧ n = 4) ∧
    (∀ k n, (∀ x, f k n x = 2 * x - 5) → k = 2 ∧ n = -5) := by
  refine ⟨fun k n h => (koeficienta k n (-3) 4).1 fun x => ?_,
    fun k n h => (koeficienta k n 2 (-5)).1 fun x => ?_⟩
  · rw [h x]; unfold f; ring
  · rw [h x]; unfold f; ring

/-- Pogoste napake (nepopoln izračun): pri y = −5x + 18 in x = 1,6 je −5 · 1,6 = −8 (le kx), 18 − 5 = 13
(x = 1), pravilno pa −8 + 18 = 10. -/
theorem napaka_izracun : (-5 : ℝ) * (16 / 10) = -8 ∧ (18 : ℝ) - 5 = 13 ∧ f (-5) 18 (16 / 10) = 10 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  calc f (-5) 18 (16 / 10) = -5 * (16 / 10) + 18 := rfl
    _ = -8 + 18 := by norm_num
    _ = 10 := by norm_num

/-- Pogoste napake (razlika namesto k): voda v 3 minutah upade s 40 na 34 cm, razlika je −6,
k = −6/3 = −2; obrnjen kvocient bi dal 3/(−6) = −1/2. -/
theorem napaka_razlika : (34 : ℝ) - 40 = -6 ∧ ((34 : ℝ) - 40) / 3 = -2 ∧ (3 : ℝ) / (34 - 40) = -1 / 2 := by
  norm_num

/-! ## Drugače: Na sliki -/

/-- Na sliki (stopnica): iz (0, n) greš 1 v desno in k navpično do (1, k + n); pri k = 1/2 dvojna stopnica:
2 desno in 1 gor. -/
theorem stopnica (k n : ℝ) : f k n 1 = k + n ∧ f (1 / 2) n 2 - f (1 / 2) n 0 = 1 := by
  unfold f; constructor <;> ring

/-! ## Preveri se -/

/-- Preveri se 1: edina linearna funkcija s presečiščem (0, −4) in spremembo −3 na enoto je y = −3x − 4. -/
theorem kviz1 (k n : ℝ) : (f k n 0 = -4 ∧ ∀ x, f k n (x + 1) - f k n x = -3) ↔ (k = -3 ∧ n = -4) := by
  rw [zacetna_vrednost]
  simp only [sprememba_na_enoto]
  constructor
  · rintro ⟨h1, h2⟩
    exact ⟨h2 0, h1⟩
  · rintro ⟨rfl, rfl⟩
    exact ⟨rfl, fun _ => rfl⟩

/-- Preveri se 2: y = 2x − 1 ima pri x = 0, 1, 2 vrednosti −1, 1, 3; napačne tabele so od y = −x + 2
(2, 1, 0), y = 2x + 1 (1, 3, 5) in y = 2x (0, 2, 4). -/
theorem kviz2 : (f 2 (-1) 0 = -1 ∧ f 2 (-1) 1 = 1 ∧ f 2 (-1) 2 = 3) ∧
    (f (-1) 2 0 = 2 ∧ f (-1) 2 1 = 1 ∧ f (-1) 2 2 = 0) ∧
    (f 2 1 0 = 1 ∧ f 2 1 1 = 3 ∧ f 2 1 2 = 5) ∧
    (f 2 0 0 = 0 ∧ f 2 0 1 = 2 ∧ f 2 0 2 = 4) := by
  unfold f; norm_num

/-- Preveri se 4: y = −6x + 20 pri x = 2,2 je −13,2 + 20 = 6,8, približno 7 (|6,8 − 7| < 1/2). Napačni
odgovori: 20 − 6 = 14, 6 · 2,2 + 20 = 33,2 ≈ 33, −6 · 2,2 = −13,2 ≈ −13 (|33,2 − 33| < 1/2, |−13,2 + 13| < 1/2). -/
theorem kviz4 : f (-6) 20 (22 / 10) = 68 / 10 ∧ |(68 : ℝ) / 10 - 7| < 1 / 2 ∧
    (20 : ℝ) - 6 = 14 ∧ f 6 20 (22 / 10) = 332 / 10 ∧ (-6 : ℝ) * (22 / 10) = -132 / 10 ∧
    |(332 : ℝ) / 10 - 33| < 1 / 2 ∧ |(-132 : ℝ) / 10 + 13| < 1 / 2 := by
  refine ⟨?_, ?_, by norm_num, by unfold f; norm_num, by norm_num, ?_, ?_⟩
  · calc f (-6) 20 (22 / 10) = -6 * (22 / 10) + 20 := rfl
      _ = -132 / 10 + 20 := by norm_num
      _ = 68 / 10 := by norm_num
  · rw [abs_lt]; constructor <;> norm_num
  · rw [abs_lt]; constructor <;> norm_num
  · rw [abs_lt]; constructor <;> norm_num

/-- Preveri se 5, napačna odgovora: −8 = 22 − 30 je sprememba v 4 urah (ne deljena s 14 − 10), −1/2 je obrnjen
kvocient (14 − 10)/(22 − 30). -/
theorem kviz5_napake : (22 : ℝ) - 30 = -8 ∧ ((14 : ℝ) - 10) / (22 - 30) = -1 / 2 := by norm_num

/-- Preveri se 5: sneg ob 10.00 30 cm, ob 14.00 22 cm: k = (22 − 30)/(14 − 10) = −8/4 = −2. -/
theorem kviz5 : ((22 : ℝ) - 30) / (14 - 10) = -2 := by
  calc ((22 : ℝ) - 30) / (14 - 10) = -8 / 4 := by norm_num
    _ = -2 := by norm_num

end Evklid.Lekcije.MAT_OS_9.LinearnaFunkcija
