/-
vir: content/lessons/MAT-SS-1/linearna-funkcija.md
sha256: 9e2ea2b8a95b48b5281a4b3758137f7d7507a3f646477beb03293f23f671a9b8
Ni v Leanu: risbe, drsniki in simulacija (»premica se vrti okoli (0, n)«, »premikanje gor in dol«;
dokazano je le, da gre premica pri vsakem k skozi (0, n) in da sprememba n ne spremeni spremembe na enoto);
trditev »graf linearne funkcije je premica« kot geometrijska trditev (dokazano: dve točki z različnima
abscisama natanko določata k in n, količnik sprememb je za vsak par točk enak k); poimenovanja (smerni
koeficient, začetna vrednost, neodvisna/odvisna spremenljivka) in postopki v korakih (Ponovitev, »nariši«,
»vedno preveri«) kot navodila; pomen količin v besedilnih nalogah (cena, baterija, gorivo, hoja) kot modeli
(dokazana je samo algebra); »strmejša premica« je dokazana kot |k₁| < |k₂| ⇒ |k₁h| < |k₂h| (večja sprememba
y pri istem premiku x ≠ 0); »Iz vsakdanjega življenja«: »enaka sprememba na enoto ⇒ linearna« je dokazana
v natančni obliki (enak količnik sprememb za vsak par točk ⇒ f(x) = cx + f(0)); samo enaka sprememba pri
koraku 1 linearnosti ne zagotavlja; stavek »če se spreminja vedno hitreje ali počasneje, ni linearna« je
opisen; ploščina trikotnika (Naloga 1) je dokazana kot račun 6·4/2 = 12 (obrazec za ploščino pravokotnega
trikotnika ni formaliziran); točkovanje maturitetnih nalog; besedilo napačnih odgovorov v Preveri se
(dokazano je, da napačne vrednosti niso pravilne). Približki (Naloga 2, Preveri se 4) so dokazani kot
|točna − približek| < pol enote zadnjega mesta. Decimalna števila so točna racionalna števila v ℝ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.LinearnaFunkcija

/-! ## Uvod -/

/-- Zakaj se tega učimo: paket y = 2x + 5 stane pri 3 GB 11 €, pri 7 GB 19 €. -/
theorem uvod_cene : (2:ℝ) * 3 + 5 = 11 ∧ (2:ℝ) * 7 + 5 = 19 := by norm_num

/-- Zakaj se tega učimo: vsak dodatni GB doda enakih 2 € (sprememba pri x + 1 je vedno 2). -/
theorem uvod_enakomerno (x : ℝ) : (2 * (x + 1) + 5) - (2 * x + 5) = 2 := by ring

/-! ## Razlaga 1 in 2: definicija, k in n -/

/-- Razlaga 1, hitri preizkus: y = 3x² + 1 ni linearna funkcija (ni k, n, da bi bilo 3x² + 1 = kx + n
za vse x). -/
theorem kvadrat_ni_linearna : ¬ ∃ k n : ℝ, ∀ x : ℝ, 3 * x ^ 2 + 1 = k * x + n := by
  rintro ⟨k, n, h⟩
  have h0 := h 0
  have h1 := h 1
  have h2 := h (-1)
  norm_num at h0 h1 h2
  linarith

/-- Razlaga 2 (pomen k): ko se x poveča za 1, se y = kx + n spremeni za k. -/
theorem pomen_k (k n x : ℝ) : (k * (x + 1) + n) - (k * x + n) = k := by ring

/-- Razlaga 2 (pomen n): pri x = 0 je y = n, graf seka os y v (0, n). -/
theorem pomen_n (k n : ℝ) : k * 0 + n = n := by ring

/-- Razlaga 2: k in n sta s funkcijo natanko določena (če je kx + n = k'x + n' za vse x, je k = k', n = n').
Zato ju iz predpisa »preberemo«. -/
theorem koeficienta (k n k' n' : ℝ) (h : ∀ x : ℝ, k * x + n = k' * x + n') : k = k' ∧ n = n' := by
  have h0 := h 0
  have h1 := h 1
  constructor <;> linarith

/-- Predpostavka `koeficienta` se da izpolniti (k = k' = 2, n = n' = 5). -/
example : ∀ x : ℝ, 2 * x + 5 = 2 * x + 5 := fun _ => rfl

/-- Pomožno: predpis ax + b je enak kx + n natanko tedaj, ko je k = a in n = b. -/
theorem preberi (a b k n : ℝ) : (∀ x : ℝ, a * x + b = k * x + n) ↔ (k = a ∧ n = b) := by
  constructor
  · intro h
    obtain ⟨h1, h2⟩ := koeficienta a b k n h
    exact ⟨h1.symm, h2.symm⟩
  · rintro ⟨rfl, rfl⟩ _
    rfl

/-- Razlaga 1: paket y = 2x + 5 ima k = 2 in n = 5. -/
theorem paket_k_n (k n : ℝ) : (∀ x : ℝ, 2 * x + 5 = k * x + n) ↔ (k = 2 ∧ n = 5) := preberi 2 5 k n

/-- Razlaga 2, hitri preizkus: pri y = 0,5x + 8 je k = 0,5 in n = 8. -/
theorem preizkus_k_n (k n : ℝ) : (∀ x : ℝ, 0.5 * x + 8 = k * x + n) ↔ (k = 0.5 ∧ n = 8) :=
  preberi 0.5 8 k n

/-! ## Razlaga 3: graf -/

/-- Razlaga 3: točke (0, 5), (3, 11) in (6, 17) ležijo na grafu y = 2x + 5 (pri 6 GB je cena 17 €). -/
theorem graf_tocke : (2:ℝ) * 0 + 5 = 5 ∧ (2:ℝ) * 3 + 5 = 11 ∧ (2:ℝ) * 6 + 5 = 17 := by norm_num

/-- Razlaga 3 in 5: dve točki z različnima abscisama natanko določata linearno funkcijo: obstaja natanko en
par (k, n), da gre y = kx + n skozi (x₁, y₁) in (x₂, y₂). Zato za risanje zadostujeta dve točki. -/
theorem dve_tocki (x₁ y₁ x₂ y₂ : ℝ) (h : x₁ ≠ x₂) :
    ∃! p : ℝ × ℝ, p.1 * x₁ + p.2 = y₁ ∧ p.1 * x₂ + p.2 = y₂ := by
  have hx : x₂ - x₁ ≠ 0 := sub_ne_zero.mpr (Ne.symm h)
  have hc : (y₂ - y₁) / (x₂ - x₁) * (x₂ - x₁) = y₂ - y₁ := div_mul_cancel₀ _ hx
  refine ⟨((y₂ - y₁) / (x₂ - x₁), y₁ - (y₂ - y₁) / (x₂ - x₁) * x₁), ⟨by ring, by linear_combination hc⟩, ?_⟩
  rintro ⟨k, n⟩ ⟨h1, h2⟩
  have hk : k = (y₂ - y₁) / (x₂ - x₁) := by
    rw [eq_div_iff hx]
    linear_combination h2 - h1
  refine Prod.ext hk ?_
  simp only at h1 ⊢
  rw [← hk]
  linarith

/-- Predpostavka `dve_tocki` se da izpolniti (x₁ = 0, x₂ = 3). -/
example : (0:ℝ) ≠ 3 := by norm_num

/-! ## Razlaga 4: lega premice -/

/-- Razlaga 4: pri k > 0 je funkcija naraščajoča. -/
theorem narasca (k n : ℝ) (hk : 0 < k) : StrictMono (fun x : ℝ => k * x + n) := by
  intro a b hab
  show k * a + n < k * b + n
  nlinarith

/-- Predpostavka `narasca` se da izpolniti (k = 2). -/
example : (0:ℝ) < 2 := by norm_num

/-- Razlaga 4: pri k < 0 je funkcija padajoča. -/
theorem pada (k n : ℝ) (hk : k < 0) : StrictAnti (fun x : ℝ => k * x + n) := by
  intro a b hab
  show k * b + n < k * a + n
  nlinarith

/-- Predpostavka `pada` se da izpolniti (k = −2). -/
example : (-2:ℝ) < 0 := by norm_num

/-- Razlaga 4: pri k = 0 je funkcija konstantna y = n. -/
theorem konstantna (n x : ℝ) : 0 * x + n = n := by ring

/-- Razlaga 4: večja ko je |k|, strmejša je premica: pri istem premiku h ≠ 0 se y pri večjem |k| spremeni
za več (|k₁h| < |k₂h|). -/
theorem strmejsa (k₁ k₂ h : ℝ) (hk : |k₁| < |k₂|) (hh : h ≠ 0) : |k₁ * h| < |k₂ * h| := by
  rw [abs_mul, abs_mul]
  exact mul_lt_mul_of_pos_right hk (abs_pos.mpr hh)

/-- Predpostavke `strmejsa` se dajo izpolniti (k₁ = 1, k₂ = 2, h = 1). -/
example : |(1:ℝ)| < |(2:ℝ)| ∧ (1:ℝ) ≠ 0 := by norm_num

/-- Razlaga 4 (slika s stopnico): od točke (0, n) za 1 v desno se premica dvigne za k. -/
theorem stopnica (k n : ℝ) : k * 1 + n = (k * 0 + n) + k := by ring

/-- Razlaga 4 (simulacija pri n = 5): pri vsakem k gre premica y = kx + 5 skozi (0, 5); pri k = 0 je
vodoravna. -/
theorem simulacija_n5 (k : ℝ) : k * 0 + 5 = 5 ∧ ∀ x : ℝ, 0 * x + 5 = (5:ℝ) := ⟨by ring, fun x => by ring⟩

/-- Razlaga 4, Premisli: y = 3x + 2 je strmejši od y = 2x + 5 (3 > 2), začne nižje (2 < 5), premici se
sekata natanko pri x = 3, kjer sta obe ceni 11 €. -/
theorem premisli_operaterja :
    (2:ℝ) < 3 ∧ (2:ℝ) < 5 ∧ (∀ x : ℝ, 3 * x + 2 = 2 * x + 5 ↔ x = 3) ∧
      (3:ℝ) * 3 + 2 = 11 ∧ (2:ℝ) * 3 + 5 = 11 := by
  refine ⟨by norm_num, by norm_num, fun x => ⟨fun h => by linarith, fun h => by subst h; norm_num⟩,
    by norm_num, by norm_num⟩

/-! ## Razlaga 5: k iz dveh točk -/

/-- Razlaga 5, Ustno vprašanje 2 in Bolj natančno: za točki (x₁, kx₁ + n) in (x₂, kx₂ + n) grafa z
x₁ ≠ x₂ je (y₂ − y₁)/(x₂ − x₁) = k(x₂ − x₁)/(x₂ − x₁) = k, za vsak par točk. -/
theorem kolicnik (k n x₁ x₂ : ℝ) (h : x₁ ≠ x₂) :
    ((k * x₂ + n) - (k * x₁ + n)) / (x₂ - x₁) = k := by
  have hx : x₂ - x₁ ≠ 0 := sub_ne_zero.mpr (Ne.symm h)
  calc ((k * x₂ + n) - (k * x₁ + n)) / (x₂ - x₁) = k * (x₂ - x₁) / (x₂ - x₁) := by ring
    _ = k := mul_div_cancel_right₀ k hx

/-- Predpostavka `kolicnik` se da izpolniti (x₁ = 1, x₂ = 4). -/
example : (1:ℝ) ≠ 4 := by norm_num

/-- Razlaga 5, hitri preizkus: k skozi (0, 5) in (3, 11) je 6/3 = 2. -/
theorem preizkus_k : ((11:ℝ) - 5) / (3 - 0) = 6 / 3 ∧ (6:ℝ) / 3 = 2 := by norm_num

/-! ## Razlaga 6: ničla -/

/-- Razlaga 6 in Povzetek: pri k ≠ 0 je kx + n = 0 natanko tedaj, ko je x = −n/k. -/
theorem nicla (k n x : ℝ) (hk : k ≠ 0) : k * x + n = 0 ↔ x = -n / k := by
  rw [eq_div_iff hk]
  constructor <;> intro h <;> linarith

/-- Predpostavka `nicla` se da izpolniti (k = 2). -/
example : (2:ℝ) ≠ 0 := by norm_num

/-- Ustno vprašanje 3: pri k ≠ 0 ima funkcija natanko eno ničlo. -/
theorem nicla_enolicna (k n : ℝ) (hk : k ≠ 0) : ∃! x : ℝ, k * x + n = 0 :=
  ⟨-n / k, (nicla k n _ hk).mpr rfl, fun y hy => (nicla k n y hk).mp hy⟩

/-- Predpostavka `nicla_enolicna` se da izpolniti (k = −2). -/
example : (-2:ℝ) ≠ 0 := by norm_num

/-- Razlaga 6 in Bolj natančno: pri k = 0 in n ≠ 0 ničle ni. -/
theorem brez_nicle (n : ℝ) (hn : n ≠ 0) : ∀ x : ℝ, 0 * x + n ≠ 0 := by
  intro x
  simpa using hn

/-- Predpostavka `brez_nicle` se da izpolniti (n = 3). -/
example : (3:ℝ) ≠ 0 := by norm_num

/-- Razlaga 6 in Bolj natančno: pri k = 0 in n = 0 je vsak x ničla. -/
theorem vse_nicle (x : ℝ) : 0 * x + 0 = (0:ℝ) := by ring

/-- Bolj natančno: konstantna funkcija (k = 0) nima natanko ene ničle. -/
theorem konstantna_ni_ene_nicle (n : ℝ) : ¬ ∃! x : ℝ, 0 * x + n = 0 := by
  rintro ⟨x, hx, hu⟩
  have h1 := hu (x + 1) (by simpa using hx)
  linarith

/-- Ustno vprašanje 3: f(x) = 3 nima ničle. -/
theorem f3_brez_nicle : ∀ x : ℝ, 0 * x + 3 ≠ (0:ℝ) := brez_nicle 3 (by norm_num)

/-- Razlaga 6, Premisli: baterija y = −10x + 100 ima ničlo natanko x₀ = 10. -/
theorem baterija_10 (x : ℝ) : -10 * x + 100 = 0 ↔ x = 10 :=
  ⟨fun h => by linarith, fun h => by subst h; norm_num⟩

/-- Razlaga 6, Premisli: paket y = 2x + 5 pri x ≥ 0 nikoli ni 0 (cena je vsaj 5), ničla je −2,5 < 0. -/
theorem paket_brez_nicle :
    (∀ x : ℝ, 0 ≤ x → 5 ≤ 2 * x + 5) ∧ (∀ x : ℝ, 2 * x + 5 = 0 ↔ x = -2.5) ∧ (-2.5 : ℝ) < 0 := by
  refine ⟨fun x hx => by linarith, fun x => ⟨fun h => by linarith, fun h => by subst h; norm_num⟩,
    by norm_num⟩

/-! ## Primer 1 -/

/-- Primer 1, korak 1: f(x) = 2x − 4 ima k = 2, n = −4. -/
theorem p1_k_n (k n : ℝ) : (∀ x : ℝ, 2 * x + (-4) = k * x + n) ↔ (k = 2 ∧ n = -4) := preberi 2 (-4) k n

/-- Primer 1, korak 1: f(x) = 2x − 4 narašča. -/
theorem p1_narasca : StrictMono (fun x : ℝ => 2 * x + (-4)) := narasca 2 (-4) (by norm_num)

/-- Primer 1, korak 2: f(0) = −4, točka (0, −4). -/
theorem p1_f0 : (2:ℝ) * 0 - 4 = -4 := by norm_num

/-- Primer 1, korak 3: f(3) = 2·3 − 4 = 2. -/
theorem p1_f3 : (2:ℝ) * 3 - 4 = 2 := by norm_num

/-- Primer 1, korak 5: 2x − 4 = 0 ⇔ 2x = 4 ⇔ x = 2. -/
theorem p1_nicla (x : ℝ) : 2 * x - 4 = 0 ↔ x = 2 := by
  calc 2 * x - 4 = 0 ↔ 2 * x = 4 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 2 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Primer 1, korak 6: f(2) = 2·2 − 4 = 0 in 0 < 2 < 3 (ničla leži med izbranima točkama). -/
theorem p1_preizkus : (2:ℝ) * 2 - 4 = 0 ∧ (0:ℝ) < 2 ∧ (2:ℝ) < 3 := by norm_num

/-! ## Primer 2 -/

/-- Primer 2, korak 1: k = (−1 − 5)/(4 − 1) = −6/3 = −2 (k < 0). -/
theorem p2_k : ((-1:ℝ) - 5) / (4 - 1) = -6 / 3 ∧ (-6:ℝ) / 3 = -2 ∧ (-2:ℝ) < 0 := by norm_num

/-- Primer 2, koraka 2–3: iz 5 = −2·1 + n sledi n = 5 + 2 = 7 (in obratno). -/
theorem p2_n (n : ℝ) : (5:ℝ) = -2 * 1 + n ↔ n = 5 + 2 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Primer 2, koraka 3–4: 5 + 2 = 7. -/
theorem p2_n7 : (5:ℝ) + 2 = 7 := by norm_num

/-- Primer 2, korak 4: premica skozi A(1, 5) in B(4, −1) je natanko y = −2x + 7. -/
theorem p2_enacba (k n : ℝ) : (k * 1 + n = 5 ∧ k * 4 + n = -1) ↔ (k = -2 ∧ n = 7) := by
  constructor
  · rintro ⟨h1, h2⟩
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩
    norm_num

/-- Primer 2, korak 5: −2·4 + 7 = −8 + 7 = −1. -/
theorem p2_preizkus : (-2:ℝ) * 4 + 7 = -8 + 7 ∧ (-8:ℝ) + 7 = -1 := by norm_num

/-- Primer 2, korak 6: −2x + 7 = 0 ⇔ x = 7/2 in 7/2 = 3,5. -/
theorem p2_nicla (x : ℝ) : (-2 * x + 7 = 0 ↔ x = 7 / 2) ∧ (7:ℝ) / 2 = 3.5 :=
  ⟨⟨fun h => by linarith, fun h => by subst h; norm_num⟩, by norm_num⟩

/-! ## Primer 3 -/

/-- Primer 3 (a): pogoja »pri x = 0 plačamo 3« in »vsak GB doda 1,20« natanko določata y = 1,2x + 3. -/
theorem p3_a (k n : ℝ) :
    (k * 0 + n = 3 ∧ ∀ x : ℝ, (k * (x + 1) + n) - (k * x + n) = 1.2) ↔ (k = 1.2 ∧ n = 3) := by
  constructor
  · rintro ⟨h0, h1⟩
    have := h1 0
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩
    exact ⟨by norm_num, fun x => by ring⟩

/-- Primer 3 (b): y = 1,2·15 + 3 = 18 + 3 = 21. -/
theorem p3_b : (1.2:ℝ) * 15 + 3 = 18 + 3 ∧ (18:ℝ) + 3 = 21 := by norm_num

/-- Primer 3 (c), Premisli: 1,2x + 3 = 27 ⇔ 1,2x = 24 ⇔ x = 20; preizkus 1,2·20 + 3 = 27. -/
theorem p3_c (x : ℝ) : (1.2 * x + 3 = 27 ↔ x = 20) ∧ (1.2:ℝ) * 20 + 3 = 27 := by
  refine ⟨?_, by norm_num⟩
  calc 1.2 * x + 3 = 27 ↔ 1.2 * x = 24 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 20 := ⟨fun h => by linarith, fun h => by subst h; norm_num⟩

/-! ## Pogoste napake -/

/-- Pogoste napake 1: pri y = −4x + 1 je k = −4 in n = 1 (ne (0, −4)). -/
theorem napaka_k_n (k n : ℝ) : (∀ x : ℝ, -4 * x + 1 = k * x + n) ↔ (k = -4 ∧ n = 1) :=
  preberi (-4) 1 k n

/-- Pogoste napake 2 in 4, Preveri se 1: 3x − 12 = 0 ⇔ 3x = 12 ⇔ x = 4; −4, −12 in 12 niso ničle. -/
theorem nicla_3x_12 (x : ℝ) : 3 * x - 12 = 0 ↔ x = 4 := by
  calc 3 * x - 12 = 0 ↔ 3 * x = 12 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 4 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Pogoste napake 2 in 4, Preveri se 1: napačni odgovori −4, −12 in 12 niso ničle 3x − 12; f(0) = −12. -/
theorem nicla_3x_12_napacne :
    (3:ℝ) * (-4) - 12 ≠ 0 ∧ (3:ℝ) * (-12) - 12 ≠ 0 ∧ (3:ℝ) * 12 - 12 ≠ 0 ∧ (3:ℝ) * 0 - 12 = -12 := by
  norm_num

/-- Pogoste napake 3, Preveri se 2: obrnjen ulomek ne da k: za (2, 1), (5, 7) je (5 − 2)/(7 − 1) = 1/2 ≠ 2. -/
theorem obrnjen_ulomek : ((5:ℝ) - 2) / (7 - 1) = 1 / 2 ∧ (1:ℝ) / 2 ≠ 2 := by norm_num

/-- Pogoste napake 5, Preveri se 5: točki (0, 6) in (3, 0) dasta k = (0 − 6)/(3 − 0) = −2, ne 2 (in ne 1/2,
ne 3). -/
theorem padajoca_k :
    ((0:ℝ) - 6) / (3 - 0) = -2 ∧ (-2:ℝ) ≠ 2 ∧ (-2:ℝ) ≠ 1 / 2 ∧ (-2:ℝ) ≠ 3 := by norm_num

/-! ## Za maturo -/

/-- Naloga 1, korak 1: −2/3·x + 4 = 0 ⇔ 2/3·x = 4 ⇔ x = 6. -/
theorem m1_nicla (x : ℝ) : -(2 / 3) * x + 4 = 0 ↔ x = 6 := by
  calc -(2 / 3) * x + 4 = 0 ↔ 2 / 3 * x = 4 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 6 := ⟨fun h => by linarith, fun h => by subst h; norm_num⟩

/-- Naloga 1, korak 2: f(0) = 4, graf seka os y v (0, 4). -/
theorem m1_f0 : -(2 / 3 : ℝ) * 0 + 4 = 4 := by norm_num

/-- Naloga 1, korak 3: P = 6·4/2 = 12. -/
theorem m1_ploscina : (6:ℝ) * 4 / 2 = 12 := by norm_num

/-- Naloga 2 a): 6,4/100 = 0,064, zato k = −0,064 in n = 48; k pomeni spremembo −0,064 l na km. -/
theorem m2_a (x : ℝ) : (6.4:ℝ) / 100 = 0.064 ∧ (-0.064 * (x + 1) + 48) - (-0.064 * x + 48) = -0.064 :=
  ⟨by norm_num, by ring⟩

/-- Naloga 2 a): predpis y = kx + n s k = −0,064 in n = 48 je natanko y = −0,064x + 48. -/
theorem m2_predpis (k n : ℝ) : (∀ x : ℝ, -0.064 * x + 48 = k * x + n) ↔ (k = -0.064 ∧ n = 48) :=
  preberi (-0.064) 48 k n

/-- Naloga 2 b): y = −0,064·285 + 48 = −18,24 + 48 = 29,76 ≈ 29,8. -/
theorem m2_b : (-0.064:ℝ) * 285 + 48 = -18.24 + 48 ∧ (-18.24:ℝ) + 48 = 29.76 ∧
    |(29.76:ℝ) - 29.8| < 0.05 := by
  norm_num [abs_lt]

/-- Naloga 2 c): −0,064x + 48 = 7 ⇔ 0,064x = 41 ⇔ x = 640,625 ≈ 641. -/
theorem m2_c (x : ℝ) : (-0.064 * x + 48 = 7 ↔ x = 640.625) ∧ |(640.625:ℝ) - 641| < 0.5 := by
  refine ⟨?_, by norm_num [abs_lt]⟩
  calc -0.064 * x + 48 = 7 ↔ 0.064 * x = 41 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 640.625 := ⟨fun h => by linarith, fun h => by subst h; norm_num⟩

/-- Naloga 2 d): −0,064x + 48 = 0 ⇔ x = 48/0,064 = 750. -/
theorem m2_d (x : ℝ) : (-0.064 * x + 48 = 0 ↔ x = 48 / 0.064) ∧ (48:ℝ) / 0.064 = 750 := by
  refine ⟨⟨fun h => ?_, fun h => ?_⟩, by norm_num⟩
  · rw [eq_div_iff (by norm_num)]; linarith
  · rw [h]; norm_num

/-- Naloga 2 d): pot in količina goriva nista negativni natanko za 0 ≤ x ≤ 750 (model velja na [0, 750]). -/
theorem m2_d_interval (x : ℝ) : (0 ≤ x ∧ 0 ≤ -0.064 * x + 48) ↔ x ∈ Set.Icc (0:ℝ) 750 := by
  rw [Set.mem_Icc]
  constructor
  · rintro ⟨h1, h2⟩; exact ⟨h1, by linarith⟩
  · rintro ⟨h1, h2⟩; exact ⟨h1, by linarith⟩

/-! ## Drugače -/

/-- Iz vsakdanjega življenja: kartica y = −2x + 10 ima n = 10, k = −2 in je prazna natanko pri x = 5. -/
theorem kartica (x : ℝ) : (-2:ℝ) * 0 + 10 = 10 ∧ (-2 * (x + 1) + 10) - (-2 * x + 10) = -2 ∧
    (-2 * x + 10 = 0 ↔ x = 5) :=
  ⟨by norm_num, by ring, ⟨fun h => by linarith, fun h => by subst h; norm_num⟩⟩

/-- Iz vsakdanjega življenja: pri y = 1,5x + 100 je hitrost 1,5 m/s smerni koeficient (sprememba na sekundo). -/
theorem hoja (x : ℝ) : (1.5 * (x + 1) + 100) - (1.5 * x + 100) = (1.5:ℝ) := by ring

/-- Iz vsakdanjega življenja (natančna oblika »enaka sprememba na enoto ⇒ linearna«): če je količnik sprememb
(f(b) − f(a))/(b − a) za vsak par a ≠ b enak c, je f(x) = cx + f(0). -/
theorem enak_kolicnik_linearna (f : ℝ → ℝ) (c : ℝ)
    (h : ∀ a b : ℝ, a ≠ b → (f b - f a) / (b - a) = c) : ∀ x, f x = c * x + f 0 := by
  intro x
  by_cases hx : x = 0
  · subst hx; ring
  · have := h 0 x (Ne.symm hx)
    rw [sub_zero, div_eq_iff hx] at this
    linarith

/-- Predpostavka `enak_kolicnik_linearna` se da izpolniti (f(x) = 2x + 5, c = 2). -/
example : ∀ a b : ℝ, a ≠ b → ((2 * b + 5) - (2 * a + 5)) / (b - a) = 2 :=
  fun a b hab => kolicnik 2 5 a b hab

/-- Korak za korakom: tabela za f(x) = −½x + 3: f(−2) = 1 + 3 = 4, f(0) = 3, f(2) = −1 + 3 = 2,
f(6) = −3 + 3 = 0. -/
theorem tabela :
    (-(1 / 2) * (-2) + 3 : ℝ) = 1 + 3 ∧ (1 + 3 : ℝ) = 4 ∧ (-(1 / 2) * 0 + 3 : ℝ) = 3 ∧
      (-(1 / 2) * 2 + 3 : ℝ) = -1 + 3 ∧ (-1 + 3 : ℝ) = 2 ∧
      (-(1 / 2) * 6 + 3 : ℝ) = -3 + 3 ∧ (-3 + 3 : ℝ) = 0 := by norm_num

/-- Korak za korakom, korak 4: ko se x poveča za 2, se y zmanjša za 1; razmerje −1/2 = k. -/
theorem tabela_razmerje (x : ℝ) : (-(1 / 2) * (x + 2) + 3) - (-(1 / 2) * x + 3) = -1 ∧
    (-1:ℝ) / 2 = -(1 / 2) := ⟨by ring, by norm_num⟩

/-- Korak za korakom, korak 5: −½x + 3 = 0 ⇔ x = 6. -/
theorem tabela_nicla (x : ℝ) : -(1 / 2) * x + 3 = 0 ↔ x = 6 :=
  ⟨fun h => by linarith, fun h => by subst h; norm_num⟩

/-- Na sliki: pri k = 2 greš 1 desno in 2 gor, pri k = −½ greš 2 desno in 1 dol. -/
theorem na_sliki (n x : ℝ) : (2 * (x + 1) + n) - (2 * x + n) = 2 ∧
    (-(1 / 2) * (x + 2) + n) - (-(1 / 2) * x + n) = -1 := ⟨by ring, by ring⟩

/-- Na sliki: sprememba n ne spremeni spremembe na enoto (naklon ostane k). -/
theorem na_sliki_n (k n n' x : ℝ) :
    (k * (x + 1) + n) - (k * x + n) = (k * (x + 1) + n') - (k * x + n') := by ring

/-! ## Preveri se -/

/-- Preveri se 2: k = (7 − 1)/(5 − 2) = 6/3 = 2; napačni odgovori 0,5, 3, 6 in −2 niso 2. -/
theorem preveri_2 : ((7:ℝ) - 1) / (5 - 2) = 6 / 3 ∧ (6:ℝ) / 3 = 2 ∧
    (0.5:ℝ) ≠ 2 ∧ (3:ℝ) ≠ 2 ∧ (6:ℝ) ≠ 2 ∧ (-2:ℝ) ≠ 2 := by norm_num

/-- Preveri se 3: pri y = −4x + 1 so vrednosti pri x = 0, 1, 2 enake 1, −3, −7 (ne −4, −3, −2 in ne 1, 5, 9). -/
theorem preveri_3 : ((-4:ℝ) * 0 + 1 = 1 ∧ (-4:ℝ) * 1 + 1 = -3 ∧ (-4:ℝ) * 2 + 1 = -7) ∧
    (-4:ℝ) * 0 + 1 ≠ -4 ∧ (-4:ℝ) * 1 + 1 ≠ 5 := by norm_num

/-- Preveri se 4: ničla y = −7x + 100 je x₀ = −100/(−7) = 100/7 ≈ 14 (|100/7 − 14| < 0,5); ni 7, 100 ali −14. -/
theorem preveri_4 (x : ℝ) : (-7 * x + 100 = 0 ↔ x = 100 / 7) ∧ -(100:ℝ) / (-7) = 100 / 7 ∧
    |(100:ℝ) / 7 - 14| < 0.5 ∧ (100:ℝ) / 7 ≠ 7 ∧ (100:ℝ) / 7 ≠ 100 ∧ (100:ℝ) / 7 ≠ -14 := by
  refine ⟨⟨fun h => by linarith, fun h => by subst h; norm_num⟩, by norm_num, by norm_num [abs_lt],
    by norm_num, by norm_num, by norm_num⟩

/-! ## RACUN -/

/-- RACUN: vse vrstice bloka (rešitve enačb so dokazane zgoraj kot ↔). -/
theorem racun : (6:ℝ) * 4 / 2 = 12 ∧ (6.4:ℝ) / 100 = 0.064 ∧ (-0.064:ℝ) * 285 + 48 = 29.76 ∧
    (48:ℝ) / 0.064 = 750 ∧ ((7:ℝ) - 1) / (5 - 2) = 2 := by norm_num

end Evklid.Lekcije.MAT_SS_1.LinearnaFunkcija
