/-
vir: content/lessons/MAT-OS-9/premica-v-ravnini.md
sha256: e6e1f643fc325e149f17dce306a69989a29ffd57db8bebbc6f0c1e15a0d2dc7f
Model: premica y = kx + n je množica točk (x, y) z y = kx + n; točka »leži na premici«, ko njeni koordinati
izpolnita enačbo. »Vzporedni« pomeni po lekciji: premici nimata skupne točke ali sovpadata (sovpadajoči štejeta
za vzporedni). Količine so realna števila brez enot (cm, s, m, min, tisoč km, h so le v docstringih).
Lean: x/0 = 0; formula za k ima zato pogoj x₁ ≠ x₂.
Ni v Leanu: risbe, graf treh roverjev in simulacija »Premica skozi dve točki« (dokazano je, da premik B za
(2, 4) od A da k = 2 ne glede na lego A); fizikalni model (»rover vozi enakomerno«, rover na Marsu, sonde) kot
predpostavka, da so točke na eni premici; poimenovanja (smerni koeficient, začetna vrednost, navpična premica)
in postopek v 4 korakih kot navodilo (dokazana sta vsak korak in to, da postopek da edino premico skozi točki);
»navpična premica x = x₁ ni graf linearne funkcije« je dokazana kot: skozi dve različni točki z x₁ = x₂ ne
gre nobena premica y = kx + n; »približno 60 m« (kviz 2) je dokazan kot točna vrednost 61, napačna odgovora 16 in
210 kot točni vrednosti 9 + 20/3 in 214 napačnih računov (zaokroževanje »približno« ni formalizirano).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_9.PremicaVRavnini

/-- Točka (x, y) leži na premici y = kx + n. -/
def NaPremici (k n x y : ℝ) : Prop := y = k * x + n

/-- Premici y = k₁x + n₁ in y = k₂x + n₂ sta vzporedni (po lekciji): nimata skupne točke ali sovpadata. -/
def Vzporedni (k₁ n₁ k₂ n₂ : ℝ) : Prop :=
  (∀ x : ℝ, k₁ * x + n₁ ≠ k₂ * x + n₂) ∨ (∀ x : ℝ, k₁ * x + n₁ = k₂ * x + n₂)

/-! ## Razlaga 1–3: vzorec, pravilo za k, začetna vrednost -/

/-- Razlaga 1: iz tabele roverja (2, 50), (4, 80), (6, 110), (8, 140) dajo vsi trije pari isti količnik 15:
(110 − 50)/(6 − 2) = 60/4 = 15, (140 − 80)/(8 − 4) = 60/4 = 15, (140 − 50)/(8 − 2) = 90/6 = 15.
trditev: MAT-OS-9/premica-v-ravnini#tabela-k
besedilo: »$\dfrac{110 - 50}{6 - 2} = \dfrac{60}{4} = 15$, - od $4\,\text{s}$ do $8\,\text{s}$: $\dfrac{140 - 80}{8 - 4} = \dfrac{60}{4} = 15$, - od $2\,\text{s}$ do $8\,\text{s}$: $\dfrac{140 - 50}{8 - 2} = \dfrac{90}{6} = 15$.« -/
theorem tabela_k :
    ((110:ℝ) - 50) / (6 - 2) = 60 / 4 ∧ (60:ℝ) / 4 = 15 ∧
    ((140:ℝ) - 80) / (8 - 4) = 60 / 4 ∧
    ((140:ℝ) - 50) / (8 - 2) = 90 / 6 ∧ (90:ℝ) / 6 = 15 := by norm_num

/-- Razlaga 1: v vsakih 2 s se lega poveča za 30 cm, torej v vsaki sekundi za 15 cm.
trditev: MAT-OS-9/premica-v-ravnini#tabela-koraki
besedilo: »V vsakih $2$ sekundah se lega poveča za $30\,\text{cm}$, torej v vsaki sekundi za $15\,\text{cm}$.« -/
theorem tabela_koraki : (80:ℝ) - 50 = 30 ∧ (110:ℝ) - 80 = 30 ∧ (140:ℝ) - 110 = 30 ∧ (30:ℝ) / 2 = 15 := by
  norm_num

/-- Razlaga 1 (k pove spremembo pri koraku 1): na premici y = kx + n se y poveča za k, ko se x poveča za 1.
trditev: MAT-OS-9/premica-v-ravnini#k-korak
besedilo: »pove, za koliko se $y$ spremeni, ko se $x$ poveča za $1$.« -/
theorem k_korak (k n x : ℝ) : (k * (x + 1) + n) - (k * x + n) = k := by ring

/-- Razlaga 2 in Bolj natančno: če A(x₁, y₁) in B(x₂, y₂) ležita na premici y = kx + n, je
y₂ − y₁ = k(x₂ − x₁), pri x₁ ≠ x₂ pa k = (y₂ − y₁)/(x₂ − x₁).
trditev: MAT-OS-9/premica-v-ravnini#smerni-koeficient
besedilo: »$$y_2 - y_1 = k(x_2 - x_1).$$ Če je $x_2 \ne x_1$, delimo z $x_2 - x_1$ in dobimo $$k = \frac{y_2 - y_1}{x_2 - x_1}.$$« -/
theorem smerni_koeficient (k n x₁ y₁ x₂ y₂ : ℝ) (hA : NaPremici k n x₁ y₁) (hB : NaPremici k n x₂ y₂)
    (hx : x₁ ≠ x₂) : y₂ - y₁ = k * (x₂ - x₁) ∧ k = (y₂ - y₁) / (x₂ - x₁) := by
  unfold NaPremici at hA hB
  have h1 : y₂ - y₁ = k * (x₂ - x₁) := by rw [hA, hB]; ring
  refine ⟨h1, ?_⟩
  have hne : x₂ - x₁ ≠ 0 := sub_ne_zero.mpr (Ne.symm hx)
  rw [h1, mul_div_assoc, div_self hne, mul_one]

/-- Predpostavke `smerni_koeficient` se dajo izpolniti (y = 15x + 20, točki (2, 50) in (6, 110)). -/
example : NaPremici 15 20 2 50 ∧ NaPremici 15 20 6 110 ∧ (2:ℝ) ≠ 6 := by
  unfold NaPremici; norm_num

/-- Razlaga 2, premisli: vrstni red točk ne spremeni k (pri x₁ ≠ x₂); primer (50 − 110)/(2 − 6) = −60/(−4) = 15.
trditev: MAT-OS-9/premica-v-ravnini#k-zamenjava
besedilo: »Ne. $\dfrac{50 - 110}{2 - 6} = \dfrac{-60}{-4} = 15$. Obe razliki zamenjata predznak, količnik ostane enak.« -/
theorem k_zamenjava (x₁ y₁ x₂ y₂ : ℝ) :
    (y₁ - y₂) / (x₁ - x₂) = (y₂ - y₁) / (x₂ - x₁) ∧ ((50:ℝ) - 110) / (2 - 6) = -60 / -4 ∧ (-60:ℝ) / -4 = 15 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  rw [← neg_sub y₂ y₁, ← neg_sub x₂ x₁, neg_div_neg_eq]

/-- Razlaga 2: skozi dve točki z različnima abscisama gre natanko ena premica y = kx + n:
k = (y₂ − y₁)/(x₂ − x₁), n = y₁ − kx₁.
trditev: MAT-OS-9/premica-v-ravnini#premica-skozi-tocki
besedilo: »Skozi točki $A(x_1, y_1)$ in $B(x_2, y_2)$ z $x_1 \ne x_2$ je $k = \dfrac{y_2 - y_1}{x_2 - x_1}$« -/
theorem premica_skozi_tocki (x₁ y₁ x₂ y₂ : ℝ) (hx : x₁ ≠ x₂) (k n : ℝ) :
    (NaPremici k n x₁ y₁ ∧ NaPremici k n x₂ y₂) ↔
      (k = (y₂ - y₁) / (x₂ - x₁) ∧ n = y₁ - (y₂ - y₁) / (x₂ - x₁) * x₁) := by
  have hne : x₂ - x₁ ≠ 0 := sub_ne_zero.mpr (Ne.symm hx)
  constructor
  · rintro ⟨hA, hB⟩
    have hk := (smerni_koeficient k n x₁ y₁ x₂ y₂ hA hB hx).2
    unfold NaPremici at hA
    refine ⟨hk, ?_⟩
    rw [← hk]; linarith
  · rintro ⟨hk, hn⟩
    unfold NaPremici
    subst hk hn
    constructor
    · ring
    · field_simp; ring

/-- Predpostavka `premica_skozi_tocki` se da izpolniti (x₁ = 2, x₂ = 6). -/
example : (2:ℝ) ≠ 6 := by norm_num

/-- Razlaga 2 (navpična premica): če je x₁ = x₂ in y₁ ≠ y₂, ne obstaja premica y = kx + n skozi obe točki
(premica x = x₁ ni graf linearne funkcije).
trditev: MAT-OS-9/premica-v-ravnini#navpicna
besedilo: »Taka premica je navpična, zapišemo jo kot $x = x_1$. Ni graf linearne funkcije in nima smernega koeficienta.« -/
theorem navpicna (x₁ y₁ y₂ : ℝ) (hy : y₁ ≠ y₂) : ¬ ∃ k n, NaPremici k n x₁ y₁ ∧ NaPremici k n x₁ y₂ := by
  rintro ⟨k, n, hA, hB⟩
  unfold NaPremici at hA hB
  exact hy (hA.trans hB.symm)

/-- Predpostavka `navpicna` se da izpolniti (y₁ = 1, y₂ = 2). -/
example : (1:ℝ) ≠ 2 := by norm_num

/-- Razlaga 3: lega ob 0 s je 50 − 2·15 = 20; iz 50 = 15·2 + n sledi natanko n = 20; enačba y = 15x + 20,
preizkus 15·8 + 20 = 140.
trditev: MAT-OS-9/premica-v-ravnini#zacetna-vrednost
besedilo: »Od $2\,\text{s}$ gremo $2$ sekundi nazaj, torej $50 - 2 \cdot 15 = 20$. Isto dobiš, če v $y = kx + n$ vstaviš $k = 15$ in točko $(2, 50)$: $50 = 15 \cdot 2 + n$, torej $n = 20$. Enačba je $y = 15x + 20$. Preizkus s točko $(8, 140)$: $15 \cdot 8 + 20 = 140$.« -/
theorem zacetna_vrednost (n : ℝ) :
    (50:ℝ) - 2 * 15 = 20 ∧ ((50:ℝ) = 15 * 2 + n ↔ n = 20) ∧ (15:ℝ) * 8 + 20 = 140 := by
  refine ⟨by norm_num, by constructor <;> intro h <;> linarith, by norm_num⟩

/-- Razlaga 3: n je vrednost y pri x = 0.
trditev: MAT-OS-9/premica-v-ravnini#n-pri-nic
besedilo: »Število $n$ je torej vrednost $y$ pri $x = 0$« -/
theorem n_pri_nic (k n : ℝ) : k * 0 + n = n := by ring

/-- Razlaga 1–3: y = 15x + 20 je edina premica skozi vse štiri točke tabele.
trditev: MAT-OS-9/premica-v-ravnini#tabela-premica
besedilo: »Enačba je $y = 15x + 20$.« -/
theorem tabela_premica (k n : ℝ) :
    (NaPremici k n 2 50 ∧ NaPremici k n 4 80 ∧ NaPremici k n 6 110 ∧ NaPremici k n 8 140) ↔ (k = 15 ∧ n = 20) := by
  unfold NaPremici
  constructor
  · rintro ⟨h1, h2, -, -⟩
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩
    norm_num

/-! ## Razlaga 5 in 6: vzporedni premici -/

/-- Razlaga 5: rover B (y = 15x + 50) je pri vsakem x za 30 cm pred A (y = 15x + 20), zato se ne srečata.
trditev: MAT-OS-9/premica-v-ravnini#rover-b
besedilo: »Rover B je pri vsakem $x$ za $15x + 50 - (15x + 20) = 30$ centimetrov pred A. Razlika se ne spreminja, zato se nikoli ne srečata« -/
theorem rover_B (x : ℝ) : (15 * x + 50) - (15 * x + 20) = 30 ∧ 15 * x + 50 ≠ 15 * x + 20 := by
  constructor
  · ring
  · intro h; linarith

/-- Razlaga 5: rover C (y = 20x) dohiti A natanko pri x = 4, pri oznaki 80 cm; C vsako sekundo pridobi 5 cm.
trditev: MAT-OS-9/premica-v-ravnini#rover-c
besedilo: »Rover C pa vsako sekundo pridobi $5\,\text{cm}$. Dohiti A, ko je $20x = 15x + 20$, torej pri $x = 4$, pri oznaki $80\,\text{cm}$.« -/
theorem rover_C (x : ℝ) : (20 * x = 15 * x + 20 ↔ x = 4) ∧ (20:ℝ) * 4 = 80 ∧ (20:ℝ) - 15 = 5 := by
  refine ⟨by constructor <;> intro h <;> linarith, by norm_num, by norm_num⟩

/-- Razlaga 5 (pravilo) in Povzetek: premici sta vzporedni natanko tedaj, ko je k₁ = k₂.
trditev: MAT-OS-9/premica-v-ravnini#vzporedni-iff
besedilo: »Pravilo: premici $y = k_1 x + n_1$ in $y = k_2 x + n_2$ sta vzporedni natanko tedaj, ko imata enak smerni koeficient: $$k_1 = k_2$$« -/
theorem vzporedni_iff (k₁ n₁ k₂ n₂ : ℝ) : Vzporedni k₁ n₁ k₂ n₂ ↔ k₁ = k₂ := by
  constructor
  · rintro (h | h)
    · by_contra hk
      apply h ((n₂ - n₁) / (k₁ - k₂))
      have : k₁ - k₂ ≠ 0 := sub_ne_zero.mpr hk
      field_simp
      ring
    · have h0 := h 0
      have h1 := h 1
      linarith
  · rintro rfl
    by_cases hn : n₁ = n₂
    · right; intro x; rw [hn]
    · left; intro x h; exact hn (by linarith)

/-- Razlaga 5 in Bolj natančno: pri k₁ = k₂ in n₁ ≠ n₂ premici nimata nobene skupne točke.
trditev: MAT-OS-9/premica-v-ravnini#vzporedni-razlicni
besedilo: »Če je pri tem $n_1 \ne n_2$, sta premici različni in nimata nobene skupne točke.« -/
theorem vzporedni_razlicni (k n₁ n₂ : ℝ) (hn : n₁ ≠ n₂) (x : ℝ) : k * x + n₁ ≠ k * x + n₂ := by
  intro h; exact hn (by linarith)

/-- Predpostavka `vzporedni_razlicni` se da izpolniti (n₁ = 20, n₂ = 50). -/
example : (20:ℝ) ≠ 50 := by norm_num

/-- Razlaga 5 in Povzetek: premici sovpadata (imata iste točke) natanko tedaj, ko je k₁ = k₂ in n₁ = n₂.
trditev: MAT-OS-9/premica-v-ravnini#sovpadata
besedilo: »Če je še $n_1 = n_2$, je to ena in ista premica (premici sovpadata)« -/
theorem sovpadata (k₁ n₁ k₂ n₂ : ℝ) :
    (∀ x y : ℝ, NaPremici k₁ n₁ x y ↔ NaPremici k₂ n₂ x y) ↔ (k₁ = k₂ ∧ n₁ = n₂) := by
  unfold NaPremici
  constructor
  · intro h
    have h0 := (h 0 (k₁ * 0 + n₁)).mp rfl
    have h1 := (h 1 (k₁ * 1 + n₁)).mp rfl
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩ x y; exact Iff.rfl

/-- Razlaga 5: premici z različnima smernima koeficientoma se sekata v natanko eni točki,
pri x = (n₂ − n₁)/(k₁ − k₂).
trditev: MAT-OS-9/premica-v-ravnini#razlicna-k
besedilo: »Premici z različnima smernima koeficientoma se sekata v natanko eni točki.« -/
theorem razlicna_k (k₁ n₁ k₂ n₂ : ℝ) (hk : k₁ ≠ k₂) :
    ∃! x : ℝ, k₁ * x + n₁ = k₂ * x + n₂ := by
  have hne : k₁ - k₂ ≠ 0 := sub_ne_zero.mpr hk
  refine ⟨(n₂ - n₁) / (k₁ - k₂), ?_, ?_⟩
  · field_simp; ring
  · intro y hy
    field_simp
    linarith

/-- Predpostavka `razlicna_k` se da izpolniti (k₁ = 15, k₂ = 20). -/
example : (15:ℝ) ≠ 20 := by norm_num

/-- Razlaga 5, premisli: rover D (y = 15x) ima enak k kot A, drug n, zato ga nikoli ne sreča in je ves čas
20 cm za A.
trditev: MAT-OS-9/premica-v-ravnini#rover-d
besedilo: »Premica D je $y = 15x$: ima enak $k$ kot A, a drug $n$. Premici sta vzporedni, D je ves čas $20\,\text{cm}$ za A.« -/
theorem rover_D (x : ℝ) : (15 * x + 20) - 15 * x = 20 ∧ 15 * x ≠ 15 * x + 20 ∧ Vzporedni 15 0 15 20 := by
  refine ⟨by ring, by intro h; linarith, (vzporedni_iff _ _ _ _).mpr rfl⟩

/-- Razlaga 6: premica skozi (x₀, y₀), vzporedna premici s smernim koeficientom k, je natanko
y = kx + (y₀ − kx₀).
trditev: MAT-OS-9/premica-v-ravnini#vzporednica-skozi-tocko
besedilo: »Smerni koeficient prepišeš z dane premice, $n$ pa izračunaš tako, da v $y = kx + n$ vstaviš dano točko.« -/
theorem vzporednica_skozi_tocko (k k' n x₀ y₀ : ℝ) :
    (k' = k ∧ NaPremici k' n x₀ y₀) ↔ (k' = k ∧ n = y₀ - k * x₀) := by
  unfold NaPremici
  constructor
  · rintro ⟨rfl, h⟩; exact ⟨rfl, by linarith⟩
  · rintro ⟨rfl, rfl⟩; exact ⟨rfl, by ring⟩

/-- Razlaga 6 (simulacija): če je B za 2 desno in 4 višje od A, je k = 4/2 = 2 ne glede na lego A.
trditev: MAT-OS-9/premica-v-ravnini#simulacija
besedilo: »Nato obe točki premakni, a ohrani ta premik med njima: $k = 2$ se ne spremeni.« -/
theorem simulacija (a b : ℝ) : ((b + 4) - b) / ((a + 2) - a) = 2 := by
  have h1 : (b + 4) - b = 4 := by ring
  have h2 : (a + 2) - a = 2 := by ring
  rw [h1, h2]; norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: premici y = 3x − 2 in y = 3x + 4 sta vzporedni premici y = 3x + 1, y = −3x + 1 ni.
trditev: MAT-OS-9/premica-v-ravnini#primer1
besedilo: »Odgovor: dani premici sta vzporedni premici $y = 3x - 2$ in $y = 3x + 4$.« -/
theorem primer1 : Vzporedni 3 (-2) 3 1 ∧ Vzporedni 3 4 3 1 ∧ ¬ Vzporedni (-3) 1 3 1 := by
  simp only [vzporedni_iff]; norm_num

/-- Primer 1, korak 3: y = −3x + 1 in y = 3x + 1 se sekata natanko v točki (0, 1).
trditev: MAT-OS-9/premica-v-ravnini#primer1-presecisce
besedilo: »Ker ima enak $n$, dano premico seka na osi $y$, v točki $(0, 1)$.« -/
theorem primer1_presecisce (x : ℝ) : (-3 * x + 1 = 3 * x + 1 ↔ x = 0) ∧ (3:ℝ) * 0 + 1 = 1 := by
  refine ⟨by constructor <;> intro h <;> linarith, by norm_num⟩

/-- Primer 2: k = (−1 − 5)/(4 − (−2)) = −6/6 = −1 (4 − (−2) = 6).
trditev: MAT-OS-9/premica-v-ravnini#primer2-k
besedilo: »Smerni koeficient: $k = \dfrac{-1 - 5}{4 - (-2)} = \dfrac{-6}{6} = -1$.« -/
theorem primer2_k : ((-1:ℝ) - 5) / (4 - (-2)) = -6 / 6 ∧ (4:ℝ) - (-2) = 6 ∧ (-6:ℝ) / 6 = -1 := by norm_num

/-- Primer 2, korak 2: iz 5 = (−1)·(−2) + n, torej 5 = 2 + n, sledi natanko n = 3.
trditev: MAT-OS-9/premica-v-ravnini#primer2-n
besedilo: »$5 = (-1) \cdot (-2) + n$, torej $5 = 2 + n$ in $n = 3$.« -/
theorem primer2_n (n : ℝ) : (5 = (-1) * (-2) + n ↔ n = 3) ∧ (-1:ℝ) * (-2) = 2 := by
  refine ⟨?_, by norm_num⟩
  calc (5:ℝ) = (-1) * (-2) + n ↔ 5 = 2 + n := by norm_num
    _ ↔ n = 3 := by constructor <;> intro h <;> linarith

/-- Primer 2: premica skozi A(−2, 5) in B(4, −1) je natanko y = −x + 3; preizkus z B: −4 + 3 = −1.
trditev: MAT-OS-9/premica-v-ravnini#primer2
besedilo: »Odgovor: premica skozi $A$ in $B$ ima enačbo $y = -x + 3$.« -/
theorem primer2 (k n : ℝ) : (NaPremici k n (-2) 5 ∧ NaPremici k n 4 (-1)) ↔ (k = -1 ∧ n = 3) := by
  unfold NaPremici
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Primer 2, preizkus: −4 + 3 = −1.
trditev: MAT-OS-9/premica-v-ravnini#primer2-preizkus
besedilo: »Preizkus s točko $B$: $-4 + 3 = -1$« -/
theorem primer2_preizkus : (-1:ℝ) * 4 + 3 = -4 + 3 ∧ (-4:ℝ) + 3 = -1 := by norm_num

/-- Primer 3: k = (15 − 7)/(6 − 2) = 8/4 = 2; iz 7 = 2·2 + n je n = 3; preizkus 2·6 + 3 = 15.
trditev: MAT-OS-9/premica-v-ravnini#primer3-k-n
besedilo: »$k = \dfrac{15 - 7}{6 - 2} = \dfrac{8}{4} = 2$. Ker je vožnja enakomerna, se rover vsako minuto oddalji za enakih $2\,\text{m}$. 3. Vstavimo prvo točko: $7 = 2 \cdot 2 + n$, torej $n = 3$. Ob $t = 0$ je bil rover $3\,\text{m}$ od modula. 4. Enačba je $d = 2t + 3$. Preizkus: $2 \cdot 6 + 3 = 15$« -/
theorem primer3_k_n (n : ℝ) :
    ((15:ℝ) - 7) / (6 - 2) = 8 / 4 ∧ (8:ℝ) / 4 = 2 ∧ ((7:ℝ) = 2 * 2 + n ↔ n = 3) ∧ (2:ℝ) * 6 + 3 = 15 := by
  refine ⟨by norm_num, by norm_num, by constructor <;> intro h <;> linarith, by norm_num⟩

/-- Primer 3: premica skozi (2, 7) in (6, 15) je natanko d = 2t + 3.
trditev: MAT-OS-9/premica-v-ravnini#primer3
besedilo: »Enačba je $d = 2t + 3$.« -/
theorem primer3 (k n : ℝ) : (NaPremici k n 2 7 ∧ NaPremici k n 6 15) ↔ (k = 2 ∧ n = 3) := by
  unfold NaPremici
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Primer 3, korak 5: 25 = 2t + 3 ima natanko rešitev t = 11, po korakih: 2t = 22, t = 11.
trditev: MAT-OS-9/premica-v-ravnini#primer3-t
besedilo: »$25 = 2t + 3$, torej $2t = 22$ in $t = 11$.« -/
theorem primer3_t (t : ℝ) : 25 = 2 * t + 3 ↔ t = 11 := by
  calc (25:ℝ) = 2 * t + 3 ↔ 2 * t = 22 := by constructor <;> intro h <;> linarith
    _ ↔ t = 11 := by constructor <;> intro h <;> linarith

/-- Primer 4: premica q, vzporedna p: y = −x + 3, skozi C(1, 4), je natanko y = −x + 5 (iz 4 = −1·1 + n je
n = 5); preizkus −1 + 5 = 4; q in p sta različni (5 ≠ 3).
trditev: MAT-OS-9/premica-v-ravnini#primer4
besedilo: »$4 = -1 \cdot 1 + n$, torej $n = 5$ in $q\colon y = -x + 5$.« -/
theorem primer4 (k n : ℝ) :
    (Vzporedni k n (-1) 3 ∧ NaPremici k n 1 4) ↔ (k = -1 ∧ n = 5) := by
  rw [vzporedni_iff]
  unfold NaPremici
  constructor
  · rintro ⟨rfl, h⟩; exact ⟨rfl, by linarith⟩
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Primer 4, preizkus in razlika: −1 + 5 = 4 in q ni ista premica kot p (nimata skupne točke).
trditev: MAT-OS-9/premica-v-ravnini#primer4-preizkus
besedilo: »Preizkus: $-1 + 5 = 4$ ✓. Smerna koeficienta sta enaka, $n$ pa različna, zato $q$ in $p$ nista ista premica.« -/
theorem primer4_preizkus : (-1:ℝ) * 1 + 5 = 4 ∧ ∀ x : ℝ, -1 * x + 5 ≠ -1 * x + 3 := by
  refine ⟨by norm_num, fun x h => by linarith⟩

/-! ## Pogoste napake -/

/-- Pogoste napake 1: pri (3, 10) in (7, 22) je k = (22 − 10)/(7 − 3) = 3, obrnjeni ulomek da 1/3.
trditev: MAT-OS-9/premica-v-ravnini#napaka-obrnjen
besedilo: »Kdor računa $\dfrac{x_2 - x_1}{y_2 - y_1}$, dobi pri $(3, 10)$ in $(7, 22)$ namesto $k = 3$ število $\dfrac{1}{3}$.« -/
theorem napaka_obrnjen : ((22:ℝ) - 10) / (7 - 3) = 3 ∧ ((7:ℝ) - 3) / (22 - 10) = 1 / 3 := by norm_num

/-- Pogoste napake 2: mešan vrstni red (y₂ − y₁)/(x₁ − x₂) da nasprotni predznak.
trditev: MAT-OS-9/premica-v-ravnini#napaka-mesan
besedilo: »V števcu $y_2 - y_1$, v imenovalcu pa $x_1 - x_2$: dobiš nasprotni predznak.« -/
theorem napaka_mesan (x₁ y₁ x₂ y₂ : ℝ) : (y₂ - y₁) / (x₁ - x₂) = -((y₂ - y₁) / (x₂ - x₁)) := by
  rw [← neg_sub x₂ x₁, div_neg]

/-- Pogoste napake 3: razlika y brez deljenja ni k: pri (3, 10), (7, 22) je razlika 12, k pa 3.
trditev: MAT-OS-9/premica-v-ravnini#napaka-deljenje
besedilo: »Tu je za $k$ vzeta kar razlika $22 - 10 = 12$, brez deljenja s $7 - 3 = 4$.« -/
theorem napaka_deljenje : (22:ℝ) - 10 = 12 ∧ ((22:ℝ) - 10) / (7 - 3) = 3 ∧ (12:ℝ) ≠ 3 := by norm_num

/-- Pogoste napake 4: n ni kar koordinata y točke (1, 5): če premica skozi (1, 5) ima k ≠ 0, je n = 5 − k ≠ 5;
za točko (0, 4) na osi y pa je n = 4.
trditev: MAT-OS-9/premica-v-ravnini#napaka-n
besedilo: »Pri točki $(1, 5)$ to ni res: $n$ je vrednost $y$ pri $x = 0$. Velja le, če točka leži na osi $y$, na primer $(0, 4)$.« -/
theorem napaka_n (k n : ℝ) (hk : k ≠ 0) :
    (NaPremici k n 1 5 → n = 5 - k ∧ n ≠ 5) ∧ (NaPremici k n 0 4 → n = 4) := by
  unfold NaPremici
  refine ⟨fun h => ⟨by linarith, fun h' => hk (by linarith)⟩, fun h => by linarith⟩

/-- Predpostavka `napaka_n` se da izpolniti (k = 2). -/
example : (2:ℝ) ≠ 0 := by norm_num

/-- Pogoste napake 5: pri enakem n in različnem k se premici sekata na osi y (natanko pri x = 0).
trditev: MAT-OS-9/premica-v-ravnini#napaka-enak-n
besedilo: »Pri enakem $n$ in različnem $k$ se premici sekata na osi $y$.« -/
theorem napaka_enak_n (k₁ k₂ n x : ℝ) (hk : k₁ ≠ k₂) : k₁ * x + n = k₂ * x + n ↔ x = 0 := by
  constructor
  · intro h
    have : (k₁ - k₂) * x = 0 := by linarith
    rcases mul_eq_zero.mp this with h' | h'
    · exact absurd (sub_eq_zero.mp h') hk
    · exact h'
  · rintro rfl; ring

/-- Predpostavka `napaka_enak_n` se da izpolniti (k₁ = 3, k₂ = −3). -/
example : (3:ℝ) ≠ -3 := by norm_num

/-! ## Drugače -/

/-- Korak za korakom: skozi A(2, 1) in B(6, 9): 9 − 1 = 8, 6 − 2 = 4, k = 8 : 4 = 2, 1 = 2·2 + n, 1 = 4 + n,
n = −3, y = 2x − 3, preizkus 2·6 − 3 = 9.
trditev: MAT-OS-9/premica-v-ravnini#korak-racun
besedilo: »| 1 | Razlika $y$ | $9 - 1 = 8$ | | 2 | Razlika $x$ | $6 - 2 = 4$ | | 3 | Smerni koeficient | $k = 8 : 4 = 2$ | | 4 | Vstavimo $A$ in $k$ | $1 = 2 \cdot 2 + n$ | | 5 | Izračunamo $n$ | $1 = 4 + n$, torej $n = -3$ | | 6 | Enačba | $y = 2x - 3$ | | 7 | Preverimo $B$ | $2 \cdot 6 - 3 = 9$ ✓ |« -/
theorem korak_racun (n : ℝ) :
    (9:ℝ) - 1 = 8 ∧ (6:ℝ) - 2 = 4 ∧ (8:ℝ) / 4 = 2 ∧
    ((1:ℝ) = 2 * 2 + n ↔ 1 = 4 + n) ∧ ((1:ℝ) = 4 + n ↔ n = -3) ∧ (2:ℝ) * 6 - 3 = 9 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by constructor <;> intro h <;> linarith, by norm_num⟩

/-- Korak za korakom: premica skozi (2, 1) in (6, 9) je natanko y = 2x − 3.
trditev: MAT-OS-9/premica-v-ravnini#korak-premica
besedilo: »| 6 | Enačba | $y = 2x - 3$ |« -/
theorem korak_premica (k n : ℝ) : (NaPremici k n 2 1 ∧ NaPremici k n 6 9) ↔ (k = 2 ∧ n = -3) := by
  unfold NaPremici
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Korak za korakom: vzporednica skozi C(0, 4) je natanko y = 2x + 4.
trditev: MAT-OS-9/premica-v-ravnini#korak-vzporednica
besedilo: »Vzporedna premica skozi $C(0, 4)$ ima $k = 2$ in ker je $C$ na osi $y$, je $n = 4$. Torej $y = 2x + 4$.« -/
theorem korak_vzporednica (k n : ℝ) : (Vzporedni k n 2 (-3) ∧ NaPremici k n 0 4) ↔ (k = 2 ∧ n = 4) := by
  rw [vzporedni_iff]
  unfold NaPremici
  constructor
  · rintro ⟨rfl, h⟩; exact ⟨rfl, by linarith⟩
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Kot zgodba: za sondo B je k = (150 − 70)/(3 − 1) = 80/2 = 40, iz 70 = 40·1 + n je n = 30.
trditev: MAT-OS-9/premica-v-ravnini#sonda-racun
besedilo: »Smerni koeficient za B je $\dfrac{150 - 70}{3 - 1} = \dfrac{80}{2} = 40$, enako kot pri A. Iz $70 = 40 \cdot 1 + n$ dobi $n = 30$« -/
theorem sonda_racun (n : ℝ) : ((150:ℝ) - 70) / (3 - 1) = 80 / 2 ∧ (80:ℝ) / 2 = 40 ∧ ((70:ℝ) = 40 * 1 + n ↔ n = 30) := by
  refine ⟨by norm_num, by norm_num, by constructor <;> intro h <;> linarith⟩

/-- Kot zgodba: premica sonde B skozi (1, 70) in (3, 150) je natanko d = 40t + 30; je vzporedna d = 40t + 10,
nimata skupne točke in B je ves čas 20 tisoč km pred A.
trditev: MAT-OS-9/premica-v-ravnini#sonda
besedilo: »torej $d = 40t + 30$. »Ne bo je,« reče Bor. »Obe se vsako uro oddaljita za $40$ tisoč km. Premici imata enak $k$, zato sta vzporedni. B je ves čas $20$ tisoč km pred A.«« -/
theorem sonda (k n t : ℝ) :
    ((NaPremici k n 1 70 ∧ NaPremici k n 3 150) ↔ (k = 40 ∧ n = 30)) ∧ Vzporedni 40 30 40 10 ∧
    (40 * t + 30) - (40 * t + 10) = 20 ∧ 40 * t + 30 ≠ 40 * t + 10 := by
  refine ⟨?_, (vzporedni_iff _ _ _ _).mpr rfl, by ring, fun h => by linarith⟩
  unfold NaPremici
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-! ## Preveri se -/

/-- Preveri se 1: točke (0, 4), (1, 6), (2, 8) ležijo natanko na premici y = 2x + 4, ki je vzporedna
y = 2x + 1 in ni ista (4 ≠ 1).
trditev: MAT-OS-9/premica-v-ravnini#kviz1
besedilo: »Pri $(0, 4)$, $(1, 6)$, $(2, 8)$ se $y$ na vsak korak v desno poveča za $2$, torej $k = 2$ kot pri dani premici, $n = 4 \ne 1$. Premica je $y = 2x + 4$.« -/
theorem kviz1 (k n : ℝ) :
    ((NaPremici k n 0 4 ∧ NaPremici k n 1 6 ∧ NaPremici k n 2 8) ↔ (k = 2 ∧ n = 4)) ∧
    Vzporedni 2 4 2 1 ∧ (4:ℝ) ≠ 1 := by
  refine ⟨?_, (vzporedni_iff _ _ _ _).mpr rfl, by norm_num⟩
  unfold NaPremici
  constructor
  · rintro ⟨h1, h2, -⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Preveri se 1, napačni tabeli: (0, 1), (1, 4), (2, 7) leže na y = 3x + 1 (k = 3), (0, 4), (1, 5), (2, 6) na
y = x + 4 (k = 1); nobena ni vzporedna y = 2x + 1.
trditev: MAT-OS-9/premica-v-ravnini#kviz1-napacni
besedilo: »Vrednost $y$ se tu poveča za $3$ na korak, torej je $k = 3$. Enak začetek $n = 1$ ni dovolj za vzporednost.« -/
theorem kviz1_napacni :
    (NaPremici 3 1 0 1 ∧ NaPremici 3 1 1 4 ∧ NaPremici 3 1 2 7) ∧
    (NaPremici 1 4 0 4 ∧ NaPremici 1 4 1 5 ∧ NaPremici 1 4 2 6) ∧
    ¬ Vzporedni 3 1 2 1 ∧ ¬ Vzporedni 1 4 2 1 := by
  simp only [vzporedni_iff, NaPremici]; norm_num

/-- Preveri se 2: k = (22 − 10)/(7 − 3) = 3, iz 10 = 3·3 + n je n = 1, po 20 minutah 3·20 + 1 = 61 m.
Napačna odgovora: obrnjeni ulomek (7 − 3)/(22 − 10) = 1/3 in n = 10 − 1 da 1/3·20 + 9 = 9 + 20/3 (≈ 16);
k = 12 brez deljenja in n = 10 − 36 = −26 da 12·20 − 26 = 214 (≈ 210).
trditev: MAT-OS-9/premica-v-ravnini#kviz2
besedilo: »$k = \dfrac{22 - 10}{7 - 3} = 3$, iz $10 = 3 \cdot 3 + n$ je $n = 1$. Po $20$ minutah: $3 \cdot 20 + 1 = 61$« -/
theorem kviz2 (n : ℝ) :
    ((22:ℝ) - 10) / (7 - 3) = 3 ∧ ((10:ℝ) = 3 * 3 + n ↔ n = 1) ∧ (3:ℝ) * 20 + 1 = 61 ∧
    ((7:ℝ) - 3) / (22 - 10) = 1 / 3 ∧ (10:ℝ) - 1/3 * 3 = 9 ∧ (1/3:ℝ) * 20 + 9 = 9 + 20/3 ∧
    (10:ℝ) - 12 * 3 = -26 ∧ (12:ℝ) * 20 - 26 = 214 := by
  refine ⟨by norm_num, by constructor <;> intro h <;> linarith, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num⟩

/-- Preveri se 2: premica skozi (3, 10) in (7, 22) je natanko d = 3t + 1.
trditev: MAT-OS-9/premica-v-ravnini#kviz2-premica
besedilo: »$k = \dfrac{22 - 10}{7 - 3} = 3$, iz $10 = 3 \cdot 3 + n$ je $n = 1$« -/
theorem kviz2_premica (k n : ℝ) : (NaPremici k n 3 10 ∧ NaPremici k n 7 22) ↔ (k = 3 ∧ n = 1) := by
  unfold NaPremici
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Preveri se 3: (2x + 3) − (2x − 1) = 4 pri vsakem x, zato y = 2x + 3 in y = 2x − 1 nimata skupne točke.
Napačni odgovor »različna n«: y = x + 3 in y = 2x − 1 se sekata natanko pri x = 4, v (4, 7).
trditev: MAT-OS-9/premica-v-ravnini#kviz3
besedilo: »Pri vsakem $x$ je $(2x + 3) - (2x - 1) = 4$. Razlika ni nikoli $0$, zato skupne točke ni.« -/
theorem kviz3 (x : ℝ) :
    (2 * x + 3) - (2 * x - 1) = 4 ∧ 2 * x + 3 ≠ 2 * x - 1 ∧ (x + 3 = 2 * x - 1 ↔ x = 4) ∧ (4:ℝ) + 3 = 7 := by
  refine ⟨by ring, fun h => by linarith, by constructor <;> intro h <;> linarith, by norm_num⟩

/-- Preveri se 3, napačni odgovor »ena nad osjo x, druga pod njo«: obe premici prečkata os x (y = 2x + 3 pri
x = −3/2, y = 2x − 1 pri x = 1/2) in imata točke nad njo in pod njo.
trditev: MAT-OS-9/premica-v-ravnini#kviz3-napacni
besedilo: »Obe premici prečkata os $x$ in imata točke nad njo in pod njo.« -/
theorem kviz3_napacni :
    (2:ℝ) * (-3/2) + 3 = 0 ∧ (2:ℝ) * (1/2) - 1 = 0 ∧
    (0:ℝ) < 2 * 0 + 3 ∧ (2:ℝ) * (-2) + 3 < 0 ∧ (0:ℝ) < 2 * 1 - 1 ∧ (2:ℝ) * 0 - 1 < 0 := by norm_num

/-- Preveri se 4: premica skozi (1, 2) in (3, a) je vzporedna y = 3x natanko pri a = 8
((a − 2)/(3 − 1) = 3, a − 2 = 6); premica je y = 3x − 1. Napačni odgovor 9: točka (3, 9) je na y = 3x.
trditev: MAT-OS-9/premica-v-ravnini#kviz4
besedilo: »Vzporedna premica ima $k = 3$, zato velja $\dfrac{a - 2}{3 - 1} = 3$. Torej $a - 2 = 6$ in $a = 8$. Premica je $y = 3x - 1$.« -/
theorem kviz4 (a : ℝ) : ((a - 2) / (3 - 1) = 3 ↔ a = 8) ∧ NaPremici 3 (-1) 1 2 ∧ NaPremici 3 (-1) 3 8 ∧
    NaPremici 3 0 3 9 := by
  refine ⟨?_, by unfold NaPremici; norm_num, by unfold NaPremici; norm_num, by unfold NaPremici; norm_num⟩
  calc (a - 2) / (3 - 1) = 3 ↔ a - 2 = 6 := by
        constructor <;> intro h
        · have : (a - 2) / 2 = 3 := by norm_num at h ⊢; linarith
          linarith
        · rw [h]; norm_num
    _ ↔ a = 8 := by constructor <;> intro h <;> linarith

/-- Preveri se 4: premica y = kx + n skozi (1, 2) in (3, a), vzporedna y = 3x, obstaja natanko pri a = 8.
trditev: MAT-OS-9/premica-v-ravnini#kviz4-premica
besedilo: »Torej $a - 2 = 6$ in $a = 8$.« -/
theorem kviz4_premica (a : ℝ) : (∃ k n, Vzporedni k n 3 0 ∧ NaPremici k n 1 2 ∧ NaPremici k n 3 a) ↔ a = 8 := by
  simp only [vzporedni_iff, NaPremici]
  constructor
  · rintro ⟨k, n, rfl, h1, h2⟩; linarith
  · rintro rfl; exact ⟨3, -1, rfl, by norm_num, by norm_num⟩

/-- Preveri se 4, napačni odgovor 5: korak 1 v desno da +3 (2 + 3 = 5), od x = 1 do x = 3 pa sta dva koraka
(2 + 2·3 = 8); pri a = 5 bi bil k = (5 − 2)/(3 − 1) = 3/2 ≠ 3.
trditev: MAT-OS-9/premica-v-ravnini#kviz4-napacni-5
besedilo: »Od $x = 1$ do $x = 3$ sta dva koraka, zato se druga koordinata poveča za $6$, ne za $3$.« -/
theorem kviz4_napacni_5 : (2:ℝ) + 3 = 5 ∧ (2:ℝ) + 2 * 3 = 8 ∧ ((5:ℝ) - 2) / (3 - 1) = 3 / 2 ∧ (3:ℝ) / 2 ≠ 3 := by
  norm_num

/-- Preveri se 5: sonda B z enakim k = 30 skozi (2, 80) je natanko d = 30t + 20 (80 = 30·2 + n); je vzporedna
d = 30t + 5 in ves čas 15 tisoč km pred A. Napačni d = 30t + 80 ne gre skozi (2, 80).
trditev: MAT-OS-9/premica-v-ravnini#kviz5
besedilo: »Iz $80 = 30 \cdot 2 + n$ dobimo $n = 20$. Premici sta vzporedni: B je ves čas $15$ tisoč km pred A.« -/
theorem kviz5 (k n t : ℝ) :
    ((Vzporedni k n 30 5 ∧ NaPremici k n 2 80) ↔ (k = 30 ∧ n = 20)) ∧
    (30 * t + 20) - (30 * t + 5) = 15 ∧ ¬ NaPremici 30 80 2 80 := by
  refine ⟨?_, by ring, by unfold NaPremici; norm_num⟩
  rw [vzporedni_iff]
  unfold NaPremici
  constructor
  · rintro ⟨rfl, h⟩; exact ⟨rfl, by linarith⟩
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Preveri se 5, napačni odgovor d = 40t: 80 : 2 = 40 je premo sorazmerje, premica d = 40t pa ni vzporedna
d = 30t + 5 (k = 40 ≠ 30).
trditev: MAT-OS-9/premica-v-ravnini#kviz5-napacni-40
besedilo: »To je premo sorazmerje $\dfrac{80}{2} = 40$, kot da bi sonda začela na Zemlji. Enaka hitrost pa pomeni $k = 30$.« -/
theorem kviz5_napacni_40 : (80:ℝ) / 2 = 40 ∧ NaPremici 40 0 2 80 ∧ ¬ Vzporedni 40 0 30 5 := by
  rw [vzporedni_iff]; unfold NaPremici; norm_num

end Evklid.Lekcije.MAT_OS_9.PremicaVRavnini
