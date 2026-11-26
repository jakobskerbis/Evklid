/-
vir: content/lessons/MAT-SS-1/sistemi-linearnih-enacb.md
sha256: 314408126be0bb7846e00cb6170bbb0cf775407a573156d1d545979518658107
Ni v Leanu: risbe in simulacija (grafična metoda, »odčitamo presečišče«; dokazano je, kje je presečišče in
da so izbrane točke na premicah); trditev »vsaka linearna enačba (a, b ne oba 0) je enačba premice« kot
geometrijska trditev (dokazano: pri b ≠ 0 je ax + by = c ⇔ y = −a/b·x + c/b); »sistem ima običajno natanko
eno rešitev« (beseda »običajno« ni matematična; dokazano je, da ima sistem natanko eno rešitev natanko
tedaj, ko je a₁b₂ − a₂b₁ ≠ 0, sicer nobene ali neskončno mnogo); postopki v korakih (zamenjava, nasprotni
koeficienti, Ponovitev, Ustno 3) in nasveti (»najraje koeficient 1«, »raje množi z negativnim številom«,
»izberi neznanko z najkrajšim množenjem«, enakovrednost metod) kot navodila, ne trditve (dokazana sta
splošna koraka: zamenjava in nadomestitev enačbe z vsoto ali z neničelnim večkratnikom ne spremenita
množice rešitev); vsebinski podatki (Sibirija, Velika planina, štorklje in srne kot model; dokazana je
algebra; rešitve so iskane v ℝ, dobljene so naravna števila); Naloga 3 d) risba; točkovanje maturitetnih
nalog; besedilo napačnih odgovorov v Preveri se (kjer gre, je dokazano, da napačna vrednost ni rešitev).
Približki (Naloga 2 c, Preveri se 2) so dokazani kot |točna − približek| < pol enote zadnjega mesta
(pri »blizu (3, 7)« kot razlika < 1/2 v obeh koordinatah). Decimalna števila so točna racionalna števila v ℝ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.SistemiLinearnihEnacb

/-! ## Uvod -/

/-- Zakaj se tega učimo: y = 1,8x + 32 da pare 0 °C → 32 °F, 10 °C → 50 °F, 20 °C → 68 °F; vsakih 10 °C
prinese 18 °F; v teh parih je število v °F večje.
trditev: MAT-SS-1/sistemi-linearnih-enacb#uvod-pari
besedilo: »$0\,°\text{C}$ je $32\,°\text{F}$, $10\,°\text{C}$ je $50\,°\text{F}$, $20\,°\text{C}$ je $68\,°\text{F}$. Število v °F je tu vedno večje.« -/
theorem uvod_pari : (1.8:ℝ) * 0 + 32 = 32 ∧ (1.8:ℝ) * 10 + 32 = 50 ∧ (1.8:ℝ) * 20 + 32 = 68 ∧
    (50:ℝ) - 32 = 18 ∧ (68:ℝ) - 50 = 18 ∧ (18:ℝ) / 10 = 1.8 ∧
    (0:ℝ) < 32 ∧ (10:ℝ) < 50 ∧ (20:ℝ) < 68 := by norm_num

/-- Zakaj se tega učimo: pari (0, 32) in (10, 50) natanko določata y = 1,8x + 32.
trditev: MAT-SS-1/sistemi-linearnih-enacb#uvod-predpis
besedilo: »vsakih $10\,°\text{C}$ prinese $18\,°\text{F}$ več, torej vsaka stopinja Celzija $1{,}8\,°\text{F}$, začne pa se pri $32\,°\text{F}$. Zato je $y = 1{,}8x + 32$« -/
theorem uvod_predpis (k n : ℝ) : (k * 0 + n = 32 ∧ k * 10 + n = 50) ↔ (k = 1.8 ∧ n = 32) := by
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Razlaga 3, Premisli: sistem y = 1,8x + 32, y = x ima natanko rešitev x = y = −40 (pod lediščem):
x = 1,8x + 32 ⇔ −0,8x = 32 ⇔ x = −40.
trditev: MAT-SS-1/sistemi-linearnih-enacb#uvod-sistem
besedilo: »$x = 1{,}8x + 32$, torej $-0{,}8x = 32$ in $x = -40$. Pri $-40\,°\text{C}$ termometer kaže tudi $-40\,°\text{F}$.« -/
theorem uvod_sistem (x y : ℝ) : (y = 1.8 * x + 32 ∧ y = x) ↔ (x = -40 ∧ y = -40) := by
  constructor
  · rintro ⟨h1, h2⟩
    have h3 : x = 1.8 * x + 32 := by rw [h2] at h1; exact h1
    have h4 : -0.8 * x = 32 := by linarith
    have hx : x = -40 := by linarith
    exact ⟨hx, by rw [h2, hx]⟩
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Razlaga 3, Premisli: −40 je pod lediščem.
trditev: MAT-SS-1/sistemi-linearnih-enacb#pod-lediscem
besedilo: »Pod lediščem.«
besedilo-kratko: odgovor v Premisli je ta kratki stavek -/
theorem pod_lediscem : (-40:ℝ) < 0 := by norm_num

/-! ## Razlaga 1: rešitev sistema -/

/-- Razlaga 1: sistem x + y = 6, y = 2x ima natanko rešitev (2, 4).
trditev: MAT-SS-1/sistemi-linearnih-enacb#r1-sistem
besedilo: »Le pri $x = 2$ se ujemata: par $(2, 4)$ ustreza obema enačbama.« -/
theorem r1_sistem (x y : ℝ) : (x + y = 6 ∧ y = 2 * x) ↔ (x = 2 ∧ y = 4) := by
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Razlaga 1, tabela: y iz x + y = 6 je 6, 5, 4, 3, y iz y = 2x je 0, 2, 4, 6 pri x = 0, 1, 2, 3; ujemata se
samo pri x = 2.
trditev: MAT-SS-1/sistemi-linearnih-enacb#r1-tabela
besedilo: »Le pri $x = 2$ se ujemata« -/
theorem r1_tabela : ((6:ℝ) - 0 = 6 ∧ (6:ℝ) - 1 = 5 ∧ (6:ℝ) - 2 = 4 ∧ (6:ℝ) - 3 = 3) ∧
    ((2:ℝ) * 0 = 0 ∧ (2:ℝ) * 1 = 2 ∧ (2:ℝ) * 2 = 4 ∧ (2:ℝ) * 3 = 6) ∧
    (∀ x : ℝ, 6 - x = 2 * x ↔ x = 2) := by
  refine ⟨by norm_num, by norm_num, fun x => ⟨fun h => by linarith, fun h => by subst h; norm_num⟩⟩

/-- Razlaga 1: ena sama enačba x + y = 6 ima neskončno mnogo rešitev.
pomozno – izrek je le primer x + y = 6, lekcija trdi splošno »Ena sama enačba ima neskončno mnogo rešitev« -/
theorem r1_ena_enacba : Set.Infinite {p : ℝ × ℝ | p.1 + p.2 = 6} := by
  refine Set.infinite_of_injective_forall_mem (f := fun t : ℝ => (t, 6 - t)) ?_ ?_
  · intro a b h
    exact (Prod.ext_iff.mp h).1
  · intro t
    show t + (6 - t) = 6
    ring

/-! ## Splošni sistem: koliko rešitev -/

/-- Pomožno: množica rešitev sistema a₁x + b₁y = c₁, a₂x + b₂y = c₂. -/
def resitve (a₁ b₁ c₁ a₂ b₂ c₂ : ℝ) : Set (ℝ × ℝ) :=
  {p | a₁ * p.1 + b₁ * p.2 = c₁ ∧ a₂ * p.1 + b₂ * p.2 = c₂}

/-- Razlaga 1 in 5 (natančna oblika »sistem ima običajno natanko eno rešitev«): če je a₁b₂ − a₂b₁ ≠ 0, ima
sistem natanko eno rešitev.
trditev: MAT-SS-1/sistemi-linearnih-enacb#ena-resitev
besedilo: »sistem pa običajno natanko eno« -/
theorem ena_resitev (a₁ b₁ c₁ a₂ b₂ c₂ : ℝ) (hD : a₁ * b₂ - a₂ * b₁ ≠ 0) :
    ∃! p : ℝ × ℝ, p ∈ resitve a₁ b₁ c₁ a₂ b₂ c₂ := by
  refine ⟨((c₁ * b₂ - c₂ * b₁) / (a₁ * b₂ - a₂ * b₁), (a₁ * c₂ - a₂ * c₁) / (a₁ * b₂ - a₂ * b₁)),
    ⟨?_, ?_⟩, ?_⟩
  · show a₁ * ((c₁ * b₂ - c₂ * b₁) / (a₁ * b₂ - a₂ * b₁)) + b₁ * ((a₁ * c₂ - a₂ * c₁) / (a₁ * b₂ - a₂ * b₁))
      = c₁
    rw [mul_div_assoc', mul_div_assoc', ← add_div, div_eq_iff hD]; ring
  · show a₂ * ((c₁ * b₂ - c₂ * b₁) / (a₁ * b₂ - a₂ * b₁)) + b₂ * ((a₁ * c₂ - a₂ * c₁) / (a₁ * b₂ - a₂ * b₁))
      = c₂
    rw [mul_div_assoc', mul_div_assoc', ← add_div, div_eq_iff hD]; ring
  · rintro ⟨x, y⟩ ⟨h1, h2⟩
    simp only at h1 h2
    refine Prod.ext ?_ ?_
    · show x = _
      rw [eq_div_iff hD]; linear_combination b₂ * h1 - b₁ * h2
    · show y = _
      rw [eq_div_iff hD]; linear_combination a₁ * h2 - a₂ * h1

/-- Predpostavka `ena_resitev` se da izpolniti (Primer 2: a₁ = 2, b₁ = 1, a₂ = 3, b₂ = −2). -/
example : (2:ℝ) * (-2) - 3 * 1 ≠ 0 := by norm_num

/-- Razlaga 5 in Ustno vprašanje 1: če je a₁b₂ − a₂b₁ = 0 (prva enačba ima a₁, b₁ ne oba 0), sistem nima
natanko ene rešitve (premici sta vzporedni ali sovpadata).
pomozno – sestavni del trditve o treh primerih; lekcija pogoja a₁b₂ − a₂b₁ = 0 ne omenja -/
theorem ni_ene_resitve (a₁ b₁ c₁ a₂ b₂ c₂ : ℝ) (h₁ : a₁ ≠ 0 ∨ b₁ ≠ 0) (hD : a₁ * b₂ - a₂ * b₁ = 0) :
    ¬ ∃! p : ℝ × ℝ, p ∈ resitve a₁ b₁ c₁ a₂ b₂ c₂ := by
  rintro ⟨⟨x, y⟩, ⟨h1, h2⟩, hu⟩
  simp only at h1 h2
  have := hu (x + b₁, y - a₁) ⟨by simp only; linear_combination h1,
    by simp only; linear_combination h2 - hD⟩
  have e1 : x + b₁ = x := congrArg Prod.fst this
  have e2 : y - a₁ = y := congrArg Prod.snd this
  rcases h₁ with h | h
  · exact h (by linarith)
  · exact h (by linarith)

/-- Predpostavke `ni_ene_resitve` se dajo izpolniti (x + y = 3, 2x + 2y = 8). -/
example : ((1:ℝ) ≠ 0 ∨ (1:ℝ) ≠ 0) ∧ (1:ℝ) * 2 - 2 * 1 = 0 := by norm_num

/-- Razlaga 5 in Ustno vprašanje 1: če je a₁b₂ − a₂b₁ = 0 (a₁, b₁ ne oba 0) in ima sistem kakšno rešitev,
ima neskončno mnogo rešitev. Skupaj z `ena_resitev` in `ni_ene_resitve`: ena, nobena ali neskončno.
pomozno – sestavni del trditve o treh primerih; lekcija pogoja a₁b₂ − a₂b₁ = 0 ne omenja -/
theorem neskoncno_resitev (a₁ b₁ c₁ a₂ b₂ c₂ : ℝ) (h₁ : a₁ ≠ 0 ∨ b₁ ≠ 0) (hD : a₁ * b₂ - a₂ * b₁ = 0)
    (hp : (resitve a₁ b₁ c₁ a₂ b₂ c₂).Nonempty) : (resitve a₁ b₁ c₁ a₂ b₂ c₂).Infinite := by
  obtain ⟨⟨x, y⟩, h1, h2⟩ := hp
  simp only at h1 h2
  refine Set.infinite_of_injective_forall_mem (f := fun t : ℝ => (x + t * b₁, y - t * a₁)) ?_ ?_
  · intro s t hst
    have e1 : x + s * b₁ = x + t * b₁ := congrArg Prod.fst hst
    have e2 : y - s * a₁ = y - t * a₁ := congrArg Prod.snd hst
    rcases h₁ with h | h
    · exact mul_right_cancel₀ h (by linarith)
    · exact mul_right_cancel₀ h (by linarith)
  · intro t
    exact ⟨by simp only; linear_combination h1, by simp only; linear_combination h2 - t * hD⟩

/-- Predpostavke `neskoncno_resitev` se dajo izpolniti (x + y = 3, 2x + 2y = 6, rešitev (3, 0)). -/
example : ((1:ℝ) ≠ 0 ∨ (1:ℝ) ≠ 0) ∧ (1:ℝ) * 2 - 2 * 1 = 0 ∧ (resitve 1 1 3 2 2 6).Nonempty :=
  ⟨by norm_num, by norm_num, ⟨(3, 0), by norm_num [resitve]⟩⟩

/-! ## Razlaga 2 -/

/-- Razlaga 2: pri b ≠ 0 je ax + by = c ⇔ y = −a/b·x + c/b (iz enačbe izrazimo y).
pomozno – orodje: splošno izražanje y iz ax + by = c; lekcija ga pove le kot navodilo -/
theorem izrazi_y (a b c x y : ℝ) (hb : b ≠ 0) : a * x + b * y = c ↔ y = -a / b * x + c / b := by
  constructor
  · intro h; field_simp; linarith
  · intro h; rw [h]; field_simp; ring

/-- Predpostavka `izrazi_y` se da izpolniti (b = 1). -/
example : (1:ℝ) ≠ 0 := by norm_num

/-- Razlaga 2: x + y = 6 postane y = 6 − x.
trditev: MAT-SS-1/sistemi-linearnih-enacb#r2-izrazi
besedilo: »npr. $x + y = 6$ postane $y = 6 - x$« -/
theorem r2_izrazi (x y : ℝ) : x + y = 6 ↔ y = 6 - x := ⟨fun h => by linarith, fun h => by linarith⟩

/-! ## Razlaga 3: zamenjava -/

/-- Razlaga 3 (zamenjava): če je y = f(x), lahko y v drugi enačbi zamenjamo z f(x); množica rešitev se ne
spremeni.
pomozno – orodje: splošna zamenjava y = f(x); lekcija je ne trdi kot izrek -/
theorem zamenjava (f : ℝ → ℝ) (P : ℝ → ℝ → Prop) (x y : ℝ) :
    (y = f x ∧ P x y) ↔ (y = f x ∧ P x (f x)) := by
  constructor
  · rintro ⟨rfl, h⟩; exact ⟨rfl, h⟩
  · rintro ⟨rfl, h⟩; exact ⟨rfl, h⟩

/-- Razlaga 3: x + 2x = 6 ⇔ 3x = 6 ⇔ x = 2, nato y = 2·2 = 4.
trditev: MAT-SS-1/sistemi-linearnih-enacb#r3-zamenjava
besedilo: »dobimo $x + 2x = 6$, torej $3x = 6$ in $x = 2$, nato $y = 2 \cdot 2 = 4$« -/
theorem r3_zamenjava (x : ℝ) : (x + 2 * x = 6 ↔ x = 2) ∧ (2:ℝ) * 2 = 4 := by
  refine ⟨?_, by norm_num⟩
  calc x + 2 * x = 6 ↔ 3 * x = 6 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 2 := ⟨fun h => by linarith, fun h => by linarith⟩

/-! ## Razlaga 4 in 6: nasprotni koeficienti, ekvivalentna preoblikovanja -/

/-- Razlaga 4, Premisli: enačbi smemo sešteti (iz a = b in c = d sledi a + c = b + d).
trditev: MAT-SS-1/sistemi-linearnih-enacb#sestej
besedilo: »Če enakim številom prištejemo enaki števili, dobimo spet enakost.« -/
theorem sestej (a b c d : ℝ) (h1 : a = b) (h2 : c = d) : a + c = b + d := by rw [h1, h2]

/-- Predpostavki `sestej` se dasta izpolniti. -/
example : (1:ℝ) = 1 ∧ (2:ℝ) = 2 := ⟨rfl, rfl⟩

/-- Razlaga 6 in Ustno vprašanje 2: če drugo enačbo nadomestimo z vsoto obeh (prvo obdržimo), se množica
rešitev ne spremeni.
trditev: MAT-SS-1/sistemi-linearnih-enacb#nadomesti-z-vsoto
besedilo: »Stari in novi sistem imata zato isto množico rešitev« -/
theorem nadomesti_z_vsoto (a₁ b₁ c₁ a₂ b₂ c₂ x y : ℝ) :
    (a₁ * x + b₁ * y = c₁ ∧ a₂ * x + b₂ * y = c₂) ↔
      (a₁ * x + b₁ * y = c₁ ∧ (a₁ + a₂) * x + (b₁ + b₂) * y = c₁ + c₂) := by
  constructor
  · rintro ⟨h1, h2⟩; exact ⟨h1, by linear_combination h1 + h2⟩
  · rintro ⟨h1, h2⟩; exact ⟨h1, by linear_combination h2 - h1⟩

/-- Razlaga 6: če eno enačbo pomnožimo s številom λ ≠ 0 (vse člene), se množica rešitev ne spremeni.
trditev: MAT-SS-1/sistemi-linearnih-enacb#pomnozi
besedilo: »Rešitve sistema ne spremenimo, če eno enačbo pomnožimo s številom, različnim od $0$« -/
theorem pomnozi (a b c l x y : ℝ) (hl : l ≠ 0) : a * x + b * y = c ↔ (l * a) * x + (l * b) * y = l * c := by
  constructor
  · intro h; linear_combination l * h
  · intro h
    have : l * (a * x + b * y - c) = 0 := by linear_combination h
    rcases mul_eq_zero.mp this with h0 | h0
    · exact absurd h0 hl
    · linarith

/-- Predpostavka `pomnozi` se da izpolniti (λ = −2). -/
example : (-2:ℝ) ≠ 0 := by norm_num

/-- Razlaga 4: x + y = 9, x − y = 3: vsota je 2x = 12, rešitev natanko (6, 3).
trditev: MAT-SS-1/sistemi-linearnih-enacb#r4-prvi
besedilo: »dobiš $2x = 12$. Neznanka $y$ je izginila, ker sta $+y$ in $-y$ skupaj $0$. Iz $x = 6$ sledi še $y = 3$.« -/
theorem r4_prvi (x y : ℝ) : (x + y = 9 ∧ x - y = 3) ↔ (x = 6 ∧ y = 3) := by
  constructor
  · rintro ⟨h1, h2⟩
    have h3 : 2 * x = 12 := by linarith
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Razlaga 4: pri 3x + y = 7, x + y = 3 vsota da 4x + 2y = 10 (y ne izpade); z −1 pomnožena druga enačba
−x − y = −3 da v vsoti 2x = 4; rešitev natanko (2, 1).
trditev: MAT-SS-1/sistemi-linearnih-enacb#r4-drugi
besedilo: »Drugo enačbo zato najprej pomnožimo z $-1$: $-x - y = -3$. Zdaj imamo $+y$ in $-y$, vsota da $2x = 4$, torej $x = 2$ in $y = 1$.« -/
theorem r4_drugi (x y : ℝ) :
    ((3 * x + y = 7 ∧ x + y = 3) → 4 * x + 2 * y = 10 ∧ -x - y = -3 ∧ 2 * x = 4) ∧
      ((3 * x + y = 7 ∧ x + y = 3) ↔ (x = 2 ∧ y = 1)) := by
  refine ⟨fun ⟨h1, h2⟩ => ⟨by linarith, by linarith, by linarith⟩, ⟨?_, ?_⟩⟩
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-! ## Razlaga 5: lega premic -/

/-- Razlaga 5 (premici se sekata): pri k₁ ≠ k₂ imata y = k₁x + n₁ in y = k₂x + n₂ natanko eno skupno točko.
trditev: MAT-SS-1/sistemi-linearnih-enacb#sekata
besedilo: »premici **se sekata**: natanko ena rešitev« -/
theorem sekata (k₁ n₁ k₂ n₂ : ℝ) (hk : k₁ ≠ k₂) :
    ∃! p : ℝ × ℝ, p.2 = k₁ * p.1 + n₁ ∧ p.2 = k₂ * p.1 + n₂ := by
  have hd : k₁ - k₂ ≠ 0 := sub_ne_zero.mpr hk
  refine ⟨((n₂ - n₁) / (k₁ - k₂), k₁ * ((n₂ - n₁) / (k₁ - k₂)) + n₁), ⟨rfl, ?_⟩, ?_⟩
  · have hc : (n₂ - n₁) / (k₁ - k₂) * (k₁ - k₂) = n₂ - n₁ := div_mul_cancel₀ _ hd
    simp only
    linear_combination hc
  · rintro ⟨x, y⟩ ⟨h1, h2⟩
    simp only at h1 h2
    have hx : x = (n₂ - n₁) / (k₁ - k₂) := by
      rw [eq_div_iff hd]; linear_combination h2 - h1
    refine Prod.ext hx ?_
    simp only
    rw [h1, hx]

/-- Predpostavka `sekata` se da izpolniti (k₁ = 1, k₂ = −1). -/
example : (1:ℝ) ≠ -1 := by norm_num

/-- Razlaga 5 (vzporedni premici): pri k₁ = k₂ in n₁ ≠ n₂ ni skupne točke.
trditev: MAT-SS-1/sistemi-linearnih-enacb#vzporedni
besedilo: »premici **sta vzporedni**: nobene rešitve« -/
theorem vzporedni (k n₁ n₂ : ℝ) (hn : n₁ ≠ n₂) : ∀ x y : ℝ, ¬ (y = k * x + n₁ ∧ y = k * x + n₂) := by
  rintro x y ⟨h1, h2⟩
  exact hn (by linarith)

/-- Predpostavka `vzporedni` se da izpolniti (n₁ = −3, n₂ = 1). -/
example : (-3:ℝ) ≠ 1 := by norm_num

/-- Razlaga 5 (sovpadanje): pri k₁ = k₂ in n₁ = n₂ je vsaka točka premice rešitev, rešitev je neskončno
mnogo.
trditev: MAT-SS-1/sistemi-linearnih-enacb#sovpadata
besedilo: »premici **sovpadata**: neskončno mnogo rešitev« -/
theorem sovpadata (k n : ℝ) :
    Set.Infinite {p : ℝ × ℝ | p.2 = k * p.1 + n ∧ p.2 = k * p.1 + n} := by
  refine Set.infinite_of_injective_forall_mem (f := fun t : ℝ => (t, k * t + n)) ?_ ?_
  · intro a b h
    exact (Prod.ext_iff.mp h).1
  · intro t
    exact ⟨rfl, rfl⟩

/-- Razlaga 5: x + y = 3 in 2x + 2y = 8: −2-kratnik prve plus druga da 0 = 2 (−2·3 + 8 = 2), rešitve ni.
trditev: MAT-SS-1/sistemi-linearnih-enacb#r5-vzporedni
besedilo: »Če prvo pomnožimo z $-2$ in seštejemo, dobimo $0 = 2$, kar je nemogoče, zato rešitve ni.« -/
theorem r5_vzporedni (x y : ℝ) : (-2 * (x + y) + (2 * x + 2 * y) = 0 ∧ (-2:ℝ) * 3 + 8 = 2) ∧
    ¬ (x + y = 3 ∧ 2 * x + 2 * y = 8) := by
  refine ⟨⟨by ring, by norm_num⟩, ?_⟩
  rintro ⟨h1, h2⟩; linarith

/-- Razlaga 5: x + y = 3 in 2x + 2y = 6: −2-kratnik prve plus druga da 0 = 0; rešitve so natanko pari
(x, 3 − x).
trditev: MAT-SS-1/sistemi-linearnih-enacb#r5-sovpadata
besedilo: »Druga enačba je le dvakratnik prve, zato dobimo $0 = 0$ in vsak par $(x, 3 - x)$ je rešitev.« -/
theorem r5_sovpadata (x y : ℝ) : (-2:ℝ) * 3 + 6 = 0 ∧ ((x + y = 3 ∧ 2 * x + 2 * y = 6) ↔ y = 3 - x) := by
  refine ⟨by norm_num, ⟨fun ⟨h1, _⟩ => by linarith, fun h => ⟨by linarith, by linarith⟩⟩⟩

/-! ## Primer 1 -/

/-- Primer 1, koraki 1–3: y = 5 − x; tabeli: y = x + 1 da 1, 3, 4 pri 0, 2, 3; y = 5 − x da 5, 3, 0 pri 0, 2, 5.
trditev: MAT-SS-1/sistemi-linearnih-enacb#p1-tabeli
besedilo: »Iz druge enačbe izrazimo $y$: $y = 5 - x$. 2. Tabela točk za prvo premico $y = x + 1$: pri $x = 0$ je $y = 1$, pri $x = 2$ je $y = 3$, pri $x = 3$ je $y = 4$. 3. Tabela točk za drugo premico $y = 5 - x$: pri $x = 0$ je $y = 5$, pri $x = 2$ je $y = 3$, pri $x = 5$ je $y = 0$.« -/
theorem p1_tabeli (x y : ℝ) : (x + y = 5 ↔ y = 5 - x) ∧
    ((0:ℝ) + 1 = 1 ∧ (2:ℝ) + 1 = 3 ∧ (3:ℝ) + 1 = 4) ∧ ((5:ℝ) - 0 = 5 ∧ (5:ℝ) - 2 = 3 ∧ (5:ℝ) - 5 = 0) :=
  ⟨⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, by norm_num⟩

/-- Primer 1, korak 4: prva premica narašča, druga pada.
trditev: MAT-SS-1/sistemi-linearnih-enacb#p1-lega
besedilo: »Prva narašča, druga pada« -/
theorem p1_lega : StrictMono (fun x : ℝ => x + 1) ∧ StrictAnti (fun x : ℝ => 5 - x) :=
  ⟨fun a b h => by show a + 1 < b + 1; linarith, fun a b h => by show 5 - b < 5 - a; linarith⟩

/-- Primer 1, koraka 4–6: sistem y = x + 1, x + y = 5 ima natanko rešitev (2, 3); preizkus 3 = 2 + 1,
2 + 3 = 5.
trditev: MAT-SS-1/sistemi-linearnih-enacb#p1-sistem
besedilo: »Odgovor: rešitev sistema je $x = 2$, $y = 3$, torej par $(2, 3)$.« -/
theorem p1_sistem (x y : ℝ) : (y = x + 1 ∧ x + y = 5) ↔ (x = 2 ∧ y = 3) := by
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-! ## Primer 2 -/

/-- Primer 2, koraki 1–4: y = 11 − 2x vstavimo: 3x − 2(11 − 2x) = 6 ⇔ 3x − 22 + 4x = 6 ⇔ 7x − 22 = 6 ⇔
7x = 28 ⇔ x = 4.
trditev: MAT-SS-1/sistemi-linearnih-enacb#p2-koraki
besedilo: »Vstavimo v drugo enačbo: $3x - 2(11 - 2x) = 6$. 3. Odpremo oklepaj: $3x - 22 + 4x = 6$, torej $7x - 22 = 6$. 4. $7x = 28$, od tod $x = 4$.« -/
theorem p2_koraki (x : ℝ) : 3 * x - 2 * (11 - 2 * x) = 6 ↔ x = 4 := by
  calc 3 * x - 2 * (11 - 2 * x) = 6 ↔ 3 * x - 22 + 4 * x = 6 := by constructor <;> intro h <;> linarith
    _ ↔ 7 * x - 22 = 6 := by constructor <;> intro h <;> linarith
    _ ↔ 7 * x = 28 := by constructor <;> intro h <;> linarith
    _ ↔ x = 4 := by constructor <;> intro h <;> linarith

/-- Primer 2, koraka 5–6: y = 11 − 2·4 = 11 − 8 = 3; preizkus 2·4 + 3 = 11, 3·4 − 2·3 = 12 − 6 = 6.
trditev: MAT-SS-1/sistemi-linearnih-enacb#p2-racun
besedilo: »$y = 11 - 2 \cdot 4 = 11 - 8 = 3$. 6. Preizkus: $2 \cdot 4 + 3 = 11$ velja, $3 \cdot 4 - 2 \cdot 3 = 12 - 6 = 6$ velja.« -/
theorem p2_racun : (11:ℝ) - 2 * 4 = 11 - 8 ∧ (11:ℝ) - 8 = 3 ∧ (2:ℝ) * 4 + 3 = 11 ∧
    (3:ℝ) * 4 - 2 * 3 = 12 - 6 ∧ (12:ℝ) - 6 = 6 := by norm_num

/-- Primer 2, odgovor: sistem 2x + y = 11, 3x − 2y = 6 ima natanko rešitev (4, 3).
trditev: MAT-SS-1/sistemi-linearnih-enacb#p2-sistem
besedilo: »Odgovor: $x = 4$, $y = 3$.« -/
theorem p2_sistem (x y : ℝ) : (2 * x + y = 11 ∧ 3 * x - 2 * y = 6) ↔ (x = 4 ∧ y = 3) := by
  constructor
  · rintro ⟨h1, h2⟩
    have hy : y = 11 - 2 * x := by linarith
    rw [hy] at h2
    have hx := (p2_koraki x).mp h2
    exact ⟨hx, by rw [hy, hx]; norm_num⟩
  · rintro ⟨rfl, rfl⟩; norm_num

/-! ## Primer 3 -/

/-- Primer 3, koraka 2–3: z −2 pomnožena prva enačba je −2x − 2y = −28; vsota z drugo da 2y = 16, y = 8.
trditev: MAT-SS-1/sistemi-linearnih-enacb#p3-koraki
besedilo: »Prvo enačbo pomnožimo z $-2$ (vse člene): $-2x - 2y = -28$. 3. Enačbi seštejemo, $x$ izpade: $2y = 16$, torej $y = 8$.« -/
theorem p3_koraki (x y : ℝ) (h1 : x + y = 14) (h2 : 2 * x + 4 * y = 44) :
    -2 * x - 2 * y = -28 ∧ 2 * y = 16 ∧ y = 8 := ⟨by linarith, by linarith, by linarith⟩

/-- Predpostavke `p3_koraki` se dajo izpolniti (x = 6, y = 8). -/
example : (6:ℝ) + 8 = 14 ∧ (2:ℝ) * 6 + 4 * 8 = 44 := by norm_num

/-- Primer 3, Premisli: sistem x + y = 14, 2x + 4y = 44 ima natanko rešitev x = 6 štorkelj, y = 8 srn;
x + 8 = 14 ⇔ x = 6; preizkus 2·6 + 4·8 = 12 + 32 = 44.
trditev: MAT-SS-1/sistemi-linearnih-enacb#p3-sistem
besedilo: »Iz $x + 8 = 14$ sledi $x = 6$. Preizkus: $2 \cdot 6 + 4 \cdot 8 = 12 + 32 = 44$ nog, kar velja. Odgovor: na travniku je $6$ štorkelj in $8$ srn.« -/
theorem p3_sistem (x y : ℝ) : ((x + y = 14 ∧ 2 * x + 4 * y = 44) ↔ (x = 6 ∧ y = 8)) ∧
    (x + 8 = 14 ↔ x = 6) ∧ (2:ℝ) * 6 + 4 * 8 = 12 + 32 ∧ (12:ℝ) + 32 = 44 := by
  refine ⟨⟨fun ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩, ?_⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, by norm_num⟩
  rintro ⟨rfl, rfl⟩; norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1 in Pazi na: 2·(5x − 4y) = 10x − 8y in 2·(−3) = −6; zapis 10x − 4y = −3 ni enakovreden
(par (1, 2) reši 5x − 4y = −3, ne pa 10x − 4y = −3).
trditev: MAT-SS-1/sistemi-linearnih-enacb#napaka-mnozenje
besedilo: »Pomnoži vsak člen: $5x - 4y = -3$ krat $2$ je $10x - 8y = -6$.« -/
theorem napaka_mnozenje (x y : ℝ) : 2 * (5 * x - 4 * y) = 10 * x - 8 * y ∧ (2:ℝ) * (-3) = -6 ∧
    ((5:ℝ) * 1 - 4 * 2 = -3 ∧ (10:ℝ) * 1 - 4 * 2 ≠ -3) := ⟨by ring, by norm_num, by norm_num⟩

/-- Pogoste napake 2: (6x + 4y) − (5x − 4y) = x + 8y (ne x + 0y).
trditev: MAT-SS-1/sistemi-linearnih-enacb#napaka-odstevanje
besedilo: »Pri odštevanju $(6x + 4y) - (5x - 4y)$ pogosto zapišeš $x + 0y$, pravilno pa je $x + 8y$« -/
theorem napaka_odstevanje (x y : ℝ) : (6 * x + 4 * y) - (5 * x - 4 * y) = x + 8 * y := by ring

/-- Pogoste napake 3: vstavitev y = 2x − 1 nazaj v isto enačbo da 0 = 0 (enačba velja za vsak x).
trditev: MAT-SS-1/sistemi-linearnih-enacb#napaka-ista-enacba
besedilo: »Če iz $y = 2x - 1$ vstaviš nazaj v isto enačbo, dobiš $0 = 0$« -/
theorem napaka_ista_enacba (x : ℝ) : (2 * x - 1) - (2 * x - 1) = 0 := by ring

/-- Pogoste napake 4: preizkus v eni enačbi ne zadošča: (5, 1) reši 2x + y = 11, ne pa 3x − 2y = 6.
trditev: MAT-SS-1/sistemi-linearnih-enacb#napaka-en-preizkus
besedilo: »Preizkus samo v eni enačbi ne zadošča.« -/
theorem napaka_en_preizkus : (2:ℝ) * 5 + 1 = 11 ∧ (3:ℝ) * 5 - 2 * 1 ≠ 6 := by norm_num

/-- Pogoste napake 5: (2,1; 2,9) ni rešitev sistema iz Primera 1 (2,9 ≠ 2,1 + 1), rešitev je (2, 3).
pomozno – lekcija ne trdi izrecno, da (2,1; 2,9) ni rešitev; pravi le, da ju lahko zamenjaš -/
theorem napaka_risba : (2.9:ℝ) ≠ 2.1 + 1 := by norm_num

/-! ## Za maturo -/

/-- Naloga 1, koraka 1–2: −2-kratnik druge enačbe je −4x − 10y = −18; vsota s prvo da −13y = −13, y = 1;
nato 4x − 3 = 5 ⇔ 4x = 8 ⇔ x = 2.
trditev: MAT-SS-1/sistemi-linearnih-enacb#m1-koraki
besedilo: »Drugo enačbo pomnožimo z $-2$: $-4x - 10y = -18$. 2. Seštejemo jo s prvo enačbo, $x$ izpade: $-13y = -13$, torej $y = 1$.« -/
theorem m1_koraki (x y : ℝ) (h1 : 4 * x - 3 * y = 5) (h2 : 2 * x + 5 * y = 9) :
    -4 * x - 10 * y = -18 ∧ -13 * y = -13 ∧ y = 1 := ⟨by linarith, by linarith, by linarith⟩

/-- Predpostavke `m1_koraki` se dajo izpolniti (x = 2, y = 1). -/
example : (4:ℝ) * 2 - 3 * 1 = 5 ∧ (2:ℝ) * 2 + 5 * 1 = 9 := by norm_num

/-- Naloga 1, korak 3: 4x − 3 = 5 ⇔ 4x = 8 ⇔ x = 2.
trditev: MAT-SS-1/sistemi-linearnih-enacb#m1-x
besedilo: »$4x - 3 = 5$, torej $4x = 8$ in $x = 2$« -/
theorem m1_x (x : ℝ) : 4 * x - 3 = 5 ↔ x = 2 := by
  calc 4 * x - 3 = 5 ↔ 4 * x = 8 := by constructor <;> intro h <;> linarith
    _ ↔ x = 2 := by constructor <;> intro h <;> linarith

/-- Naloga 1, RACUN: sistem 4x − 3y = 5, 2x + 5y = 9 ima natanko rešitev (2, 1).
trditev: MAT-SS-1/sistemi-linearnih-enacb#m1-sistem
besedilo: »Odgovor: $(x, y) = (2, 1)$.« -/
theorem m1_sistem (x y : ℝ) : (4 * x - 3 * y = 5 ∧ 2 * x + 5 * y = 9) ↔ (x = 2 ∧ y = 1) := by
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Naloga 2 b): 3,5(236 − y) + 6,8y = 1103,2 ⇔ 826 + 3,3y = 1103,2 ⇔ 3,3y = 277,2 ⇔ y = 84; x = 236 − 84 = 152.
trditev: MAT-SS-1/sistemi-linearnih-enacb#m2-koraki
besedilo: »$3{,}5(236 - y) + 6{,}8y = 1103{,}2$, torej $826 + 3{,}3y = 1103{,}2$. 4. b) $3{,}3y = 277{,}2$, zato $y = 84$ in $x = 236 - 84 = 152$.« -/
theorem m2_koraki (y : ℝ) : (3.5 * (236 - y) + 6.8 * y = 1103.2 ↔ y = 84) ∧ (236:ℝ) - 84 = 152 ∧
    (3.5:ℝ) * 236 = 826 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  calc 3.5 * (236 - y) + 6.8 * y = 1103.2 ↔ 826 + 3.3 * y = 1103.2 := by
        constructor <;> intro h <;> linarith
    _ ↔ 3.3 * y = 277.2 := by constructor <;> intro h <;> linarith
    _ ↔ y = 84 := by constructor <;> intro h <;> linarith

/-- Naloga 2 a), b), RACUN: sistem x + y = 236, 3,5x + 6,8y = 1103,2 ima natanko rešitev (152, 84).
trditev: MAT-SS-1/sistemi-linearnih-enacb#m2-sistem
besedilo: »prodali so $152$ vstopnic za dijake in $84$ vstopnic za odrasle« -/
theorem m2_sistem (x y : ℝ) : (x + y = 236 ∧ 3.5 * x + 6.8 * y = 1103.2) ↔ (x = 152 ∧ y = 84) := by
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Naloga 2 b), c): preizkus 3,5·152 + 6,8·84 = 532 + 571,2 = 1103,2; odrasli 6,8·84 = 571,2 €;
delež 571,2/1103,2 ≈ 0,51777 ≈ 51,8 % (RACUN: ≈ 51,78).
trditev: MAT-SS-1/sistemi-linearnih-enacb#m2-c
besedilo: »Delež: $\dfrac{571{,}2}{1103{,}2} \approx 0{,}51777$, torej približno $51{,}8\,\%$.« -/
theorem m2_c : (3.5:ℝ) * 152 + 6.8 * 84 = 532 + 571.2 ∧ (532:ℝ) + 571.2 = 1103.2 ∧ (6.8:ℝ) * 84 = 571.2 ∧
    |(571.2:ℝ) / 1103.2 - 0.51777| < 0.000005 ∧ |(571.2:ℝ) / 1103.2 * 100 - 51.8| < 0.05 ∧
    |(571.2:ℝ) / 1103.2 * 100 - 51.78| < 0.005 := by
  norm_num [abs_lt]

/-- Pomožno: sistem iz Naloge 3: 2x − y = 3, mx + 2y = p. -/
def sistem3 (m p x y : ℝ) : Prop := 2 * x - y = 3 ∧ m * x + 2 * y = p

/-- Naloga 3 a): pri m = 3, p = 1: y = 2x − 3, 3x + 4x − 6 = 1 ⇔ 7x = 7 ⇔ x = 1; y = 2·1 − 3 = −1;
rešitev natanko (1, −1); preizkus 3·1 + 2·(−1) = 1.
trditev: MAT-SS-1/sistemi-linearnih-enacb#m3-a
besedilo: »Iz prve enačbe izrazimo $y = 2x - 3$ in vstavimo: $3x + 4x - 6 = 1$, torej $7x = 7$ in $x = 1$. 2. a) $y = 2 \cdot 1 - 3 = -1$. Preizkus: $3 \cdot 1 + 2 \cdot (-1) = 1$. Rešitev je $(1, -1)$.« -/
theorem m3_a (x y : ℝ) : (3 * x + 4 * x - 6 = 1 ↔ x = 1) ∧ (2:ℝ) * 1 - 3 = -1 ∧ (3:ℝ) * 1 + 2 * (-1) = 1 ∧
    (sistem3 3 1 x y ↔ (x = 1 ∧ y = -1)) := by
  refine ⟨?_, by norm_num, by norm_num, ?_⟩
  · calc 3 * x + 4 * x - 6 = 1 ↔ 7 * x = 7 := by constructor <;> intro h <;> linarith
      _ ↔ x = 1 := by constructor <;> intro h <;> linarith
  · unfold sistem3
    constructor
    · rintro ⟨h1, h2⟩; constructor <;> linarith
    · rintro ⟨rfl, rfl⟩; norm_num

/-- Naloga 3 b), RACUN: 2(2x − y) + (mx + 2y) = (m + 4)x, zato iz sistema sledi (m + 4)x = p + 6.
trditev: MAT-SS-1/sistemi-linearnih-enacb#m3-b-izpeljava
besedilo: »Prištejemo jo drugi enačbi, $y$ izpade: $(m + 4)x = p + 6$.« -/
theorem m3_b_izpeljava (m p x y : ℝ) : 2 * (2 * x - y) + (m * x + 2 * y) = (m + 4) * x ∧
    (sistem3 m p x y → (m + 4) * x = p + 6) := by
  refine ⟨by ring, fun ⟨h1, h2⟩ => by linear_combination 2 * h1 + h2⟩

/-- Naloga 3 b): sistem ima natanko eno rešitev natanko tedaj, ko je m ≠ −4 (pri poljubnem p).
trditev: MAT-SS-1/sistemi-linearnih-enacb#m3-b
besedilo: »Sistem ima natanko eno rešitev za vsak $m \ne -4$ (pri poljubnem $p$).« -/
theorem m3_b (m p : ℝ) : (∃! q : ℝ × ℝ, sistem3 m p q.1 q.2) ↔ m ≠ -4 := by
  constructor
  · rintro ⟨⟨x, y⟩, ⟨h1, h2⟩, hu⟩ hm
    subst hm
    have := hu (x + 1, y + 2) ⟨by simp only; linarith, by simp only; linarith⟩
    have e : x + 1 = x := congrArg Prod.fst this
    linarith
  · intro hm
    have hd : m + 4 ≠ 0 := fun h => hm (by linarith)
    refine ⟨((p + 6) / (m + 4), 2 * ((p + 6) / (m + 4)) - 3), ⟨by simp only; ring, ?_⟩, ?_⟩
    · have hc : (p + 6) / (m + 4) * (m + 4) = p + 6 := div_mul_cancel₀ _ hd
      simp only
      linear_combination hc
    · rintro ⟨x, y⟩ ⟨h1, h2⟩
      simp only at h1 h2
      have hx : x = (p + 6) / (m + 4) := by
        rw [eq_div_iff hd]; linear_combination 2 * h1 + h2
      refine Prod.ext hx ?_
      simp only
      rw [← hx]; linarith

/-- Naloga 3 b) (geometrijsko): mx + 2y = p ⇔ y = −m/2·x + p/2; smerna koeficienta 2 in −m/2 sta različna
natanko pri m ≠ −4 (RACUN: −m/2 = 2 ⇔ m = −4).
trditev: MAT-SS-1/sistemi-linearnih-enacb#m3-b-geometrija
besedilo: »prva premica ima smerni koeficient $2$, druga $-\dfrac{m}{2}$; ta sta različna natanko pri $m \ne -4$« -/
theorem m3_b_geometrija (m p x y : ℝ) : (m * x + 2 * y = p ↔ y = -m / 2 * x + p / 2) ∧
    (-m / 2 = 2 ↔ m = -4) := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by subst h; norm_num⟩⟩

/-- Naloga 3 c): pri m = −4 enačba 0·x = p + 6 velja za vsak x natanko tedaj, ko je p = −6.
trditev: MAT-SS-1/sistemi-linearnih-enacb#m3-c-p
besedilo: »Ta enačba velja za vsak $x$ natanko tedaj, ko je $p = -6$.« -/
theorem m3_c_p (p : ℝ) : (∀ x : ℝ, 0 * x = p + 6) ↔ p = -6 := by
  constructor
  · intro h; have := h 0; linarith
  · rintro rfl x; ring

/-- Naloga 3 c), RACUN: pri p = −6 je −4x + 2y = −6 −2-kratnik prve (−4t + 2(2t − 3) = −6,
2t − (2t − 3) = 3); rešitve so natanko pari (t, 2t − 3), t ∈ ℝ.
trditev: MAT-SS-1/sistemi-linearnih-enacb#m3-c-neskoncno
besedilo: »Rešitve so vsi pari $(t, 2t - 3)$, kjer je $t$ poljubno realno število.« -/
theorem m3_c_neskoncno (x y : ℝ) : sistem3 (-4) (-6) x y ↔ ∃ t : ℝ, x = t ∧ y = 2 * t - 3 := by
  unfold sistem3
  constructor
  · rintro ⟨h1, _⟩; exact ⟨x, rfl, by linarith⟩
  · rintro ⟨t, rfl, rfl⟩; constructor <;> ring

/-- Naloga 3 c), RACUN: 2t − (2t − 3) = 3 in −4t + 2(2t − 3) = −6.
pomozno – preizkus iz bloka RACUN, ki ga učenec ne vidi -/
theorem m3_c_racun (t : ℝ) : 2 * t - (2 * t - 3) = 3 ∧ -4 * t + 2 * (2 * t - 3) = -6 := ⟨by ring, by ring⟩

/-- Naloga 3 c): pri m = −4 in p ≠ −6 sistem nima rešitve (0 = p + 6 ≠ 0).
trditev: MAT-SS-1/sistemi-linearnih-enacb#m3-c-nobene
besedilo: »Pri $m = -4$ in $p \ne -6$ dobimo protislovje $0 = p + 6 \ne 0$, zato sistem nima rešitve.« -/
theorem m3_c_nobene (p : ℝ) (hp : p ≠ -6) : ∀ x y : ℝ, ¬ sistem3 (-4) p x y := by
  rintro x y ⟨h1, h2⟩
  exact hp (by linarith)

/-- Predpostavka `m3_c_nobene` se da izpolniti (p = 2). -/
example : (2:ℝ) ≠ -6 := by norm_num

/-- Naloga 3 d), RACUN: −4x + 2y = 2 ⇔ y = 2x + 1; (0, −3), (2, 1) sta na y = 2x − 3, (0, 1), (1, 3) na
y = 2x + 1; −3 ≠ 1; sistem pri m = −4, p = 2 nima rešitve.
trditev: MAT-SS-1/sistemi-linearnih-enacb#m3-d
besedilo: »Premici sta $y = 2x - 3$ (skozi točki $(0, -3)$ in $(2, 1)$) in iz $-4x + 2y = 2$ premica $y = 2x + 1$ (skozi točki $(0, 1)$ in $(1, 3)$). 10. d) Obe imata smerni koeficient $2$, os $y$ pa sekata v različnih točkah, zato sta vzporedni in različni. Skupne točke nimata, sistem nima rešitve.« -/
theorem m3_d (x y : ℝ) : (-4 * x + 2 * y = 2 ↔ y = 2 * x + 1) ∧
    ((2:ℝ) * 0 - 3 = -3 ∧ (2:ℝ) * 2 - 3 = 1) ∧ ((2:ℝ) * 0 + 1 = 1 ∧ (2:ℝ) * 1 + 1 = 3) ∧ (-3:ℝ) ≠ 1 ∧
    ¬ sistem3 (-4) 2 x y :=
  ⟨⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, by norm_num, by norm_num,
    m3_c_nobene 2 (by norm_num) x y⟩

/-! ## Drugače -/

/-- Kot zgodba: 2 kroasana + 1 kava = 5 €, 1 kroasan + 2 kavi = 5,50 €; podvojeno 2a + 4c = 11,
11 − 5 = 6, 3c = 6, c = 2, 2a = 5 − 2 = 3, a = 1,50; preizkus 1,50 + 2·2 = 5,50.
trditev: MAT-SS-1/sistemi-linearnih-enacb#zgodba-koraki
besedilo: »Naročili se razlikujeta za $11 - 5 = 6\,\text{€}$, torej tri kave stanejo $6\,\text{€}$ in ena kava $2\,\text{€}$. Njena dva kroasana potem staneta $5 - 2 = 3\,\text{€}$, en kroasan $1{,}50\,\text{€}$.« -/
theorem zgodba_koraki (a c : ℝ) (h1 : 2 * a + c = 5) (h2 : a + 2 * c = 5.5) :
    2 * a + 4 * c = 11 ∧ (11:ℝ) - 5 = 6 ∧ 3 * c = 6 ∧ c = 2 ∧ 2 * a = 5 - 2 ∧ a = 1.5 := by
  refine ⟨by linarith, by norm_num, by linarith, by linarith, by linarith, by linarith⟩

/-- Predpostavke `zgodba_koraki` se dajo izpolniti (a = 1,5, c = 2). -/
example : (2:ℝ) * 1.5 + 2 = 5 ∧ (1.5:ℝ) + 2 * 2 = 5.5 := by norm_num

/-- Kot zgodba: sistem ima natanko rešitev kroasan 1,50 €, kava 2 €.
trditev: MAT-SS-1/sistemi-linearnih-enacb#zgodba
besedilo: »ena kava $2\,\text{€}$. Njena dva kroasana potem staneta $5 - 2 = 3\,\text{€}$, en kroasan $1{,}50\,\text{€}$« -/
theorem zgodba (a c : ℝ) : (2 * a + c = 5 ∧ a + 2 * c = 5.5) ↔ (a = 1.5 ∧ c = 2) := by
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Korak za korakom: 2(3x + 2y) = 2·7 je 6x + 4y = 14; vsota z 5x − 4y = −3 da 11x = 11 (6x + 5x = 11x,
4y − 4y = 0, 14 + (−3) = 11), x = 1; 3·1 + 2y = 7 ⇔ 2y = 4 ⇔ y = 2.
trditev: MAT-SS-1/sistemi-linearnih-enacb#kzk-koraki
besedilo: »$2 \cdot (3x + 2y) = 2 \cdot 7$, torej $6x + 4y = 14$. Druge enačbe ne spreminjamo: $5x - 4y = -3$. 3. Pri $y$ imamo zdaj $+4y$ in $-4y$. Enačbi seštejemo: $6x + 5x = 11x$, $4y - 4y = 0$, $14 + (-3) = 11$. 4. Dobimo $11x = 11$, torej $x = 1$.« -/
theorem kzk_koraki (x y : ℝ) (h1 : 3 * x + 2 * y = 7) (h2 : 5 * x - 4 * y = -3) :
    6 * x + 4 * y = 14 ∧ 6 * x + 5 * x = 11 * x ∧ 4 * y - 4 * y = 0 ∧ (14:ℝ) + (-3) = 11 ∧
      11 * x = 11 ∧ x = 1 := by
  refine ⟨by linarith, by ring, by ring, by norm_num, by linarith, by linarith⟩

/-- Predpostavke `kzk_koraki` se dajo izpolniti (x = 1, y = 2). -/
example : (3:ℝ) * 1 + 2 * 2 = 7 ∧ (5:ℝ) * 1 - 4 * 2 = -3 := by norm_num

/-- Korak za korakom: 3·1 + 2y = 7 ⇔ 2y = 4 ⇔ y = 2; preizkus 3 + 4 = 7, 5·1 − 4·2 = 5 − 8 = −3;
rešitev sistema natanko (1, 2).
trditev: MAT-SS-1/sistemi-linearnih-enacb#kzk-sistem
besedilo: »Odgovor: $(x, y) = (1, 2)$.« -/
theorem kzk_sistem (x y : ℝ) : (3 * 1 + 2 * y = 7 ↔ y = 2) ∧ (3:ℝ) + 4 = 7 ∧
    (5:ℝ) * 1 - 4 * 2 = 5 - 8 ∧ (5:ℝ) - 8 = -3 ∧
    ((3 * x + 2 * y = 7 ∧ 5 * x - 4 * y = -3) ↔ (x = 1 ∧ y = 2)) := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, ?_⟩
  · calc 3 * 1 + 2 * y = 7 ↔ 2 * y = 4 := by constructor <;> intro h <;> linarith
      _ ↔ y = 2 := by constructor <;> intro h <;> linarith
  · constructor
    · rintro ⟨h1, h2⟩; constructor <;> linarith
    · rintro ⟨rfl, rfl⟩; norm_num

/-! ## Preveri se -/

/-- Preveri se 2: presečišče y = 2x in y = −x + 10 je natanko (10/3, 20/3) ≈ (3,3; 6,7), blizu (3, 7)
(razlika v obeh koordinatah < 1/2); (7, 3) in (10, 0) nista na y = 2x.
trditev: MAT-SS-1/sistemi-linearnih-enacb#preveri-2
besedilo: »Iz $2x = -x + 10$ sledi $x = \dfrac{10}{3} \approx 3{,}3$ in $y \approx 6{,}7$.« -/
theorem preveri_2 (x y : ℝ) : ((y = 2 * x ∧ y = -x + 10) ↔ (x = 10 / 3 ∧ y = 20 / 3)) ∧
    |(10:ℝ) / 3 - 3| < 1 / 2 ∧ |(20:ℝ) / 3 - 7| < 1 / 2 ∧
    |(10:ℝ) / 3 - 3.3| < 0.05 ∧ |(20:ℝ) / 3 - 6.7| < 0.05 ∧ (3:ℝ) ≠ 2 * 7 ∧ (0:ℝ) ≠ 2 * 10 := by
  refine ⟨⟨fun ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩, ?_⟩, by norm_num [abs_lt], by norm_num [abs_lt],
    by norm_num [abs_lt], by norm_num [abs_lt], by norm_num, by norm_num⟩
  rintro ⟨rfl, rfl⟩; constructor <;> norm_num

/-- Preveri se 3: pri +3y in −3y je vsota 0·y.
trditev: MAT-SS-1/sistemi-linearnih-enacb#preveri-3
besedilo: »Pri $+3y$ in $-3y$ je vsota $0 \cdot y$« -/
theorem preveri_3 (y : ℝ) : 3 * y + (-3) * y = 0 * y := by ring

/-- Preveri se 4: (2, −1) reši x + y = 1 in 3x + by = 8 natanko pri b = −2 (6 − b = 8); 2 in −14 nista
pravilna.
trditev: MAT-SS-1/sistemi-linearnih-enacb#preveri-4
besedilo: »Vstavimo $x = 2$ in $y = -1$: $3 \cdot 2 + b \cdot (-1) = 8$, torej $6 - b = 8$ in $b = -2$. Prva enačba je izpolnjena: $2 + (-1) = 1$.« -/
theorem preveri_4 (b : ℝ) : (2:ℝ) + (-1) = 1 ∧ (3 * 2 + b * (-1) = 8 ↔ b = -2) ∧
    (3:ℝ) * 2 + 2 * (-1) ≠ 8 ∧ (3:ℝ) * 2 + (-14) * (-1) ≠ 8 := by
  refine ⟨by norm_num, ?_, by norm_num, by norm_num⟩
  calc 3 * 2 + b * (-1) = 8 ↔ 6 - b = 8 := by constructor <;> intro h <;> linarith
    _ ↔ b = -2 := by constructor <;> intro h <;> linarith

/-- Preveri se 5: x + y = 30, y − x = 8: vsota 2y = 38, y = 19, x = 30 − 19 = 11; rešitev natanko (11, 19);
preizkus 19 − 11 = 8; 19, 22 in 15 niso prvi dan.
trditev: MAT-SS-1/sistemi-linearnih-enacb#preveri-5
besedilo: »Seštejemo: $2y = 38$, $y = 19$, nato $x = 30 - 19 = 11$. Preizkus: $19 - 11 = 8$ velja.« -/
theorem preveri_5 (x y : ℝ) : ((x + y = 30 ∧ y - x = 8) → 2 * y = 38) ∧
    ((x + y = 30 ∧ y - x = 8) ↔ (x = 11 ∧ y = 19)) ∧ (30:ℝ) - 19 = 11 ∧
    (19:ℝ) - 11 = 8 ∧ (11:ℝ) ≠ 19 ∧ (11:ℝ) ≠ 22 ∧ (11:ℝ) ≠ 15 := by
  refine ⟨fun ⟨h1, h2⟩ => by linarith, ⟨fun ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩, ?_⟩, by norm_num,
    by norm_num, by norm_num, by norm_num, by norm_num⟩
  rintro ⟨rfl, rfl⟩; norm_num

end Evklid.Lekcije.MAT_SS_1.SistemiLinearnihEnacb
