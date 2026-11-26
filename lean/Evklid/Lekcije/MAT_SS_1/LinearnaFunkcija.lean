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

/-- Zakaj se tega učimo: paket y = 2x + 5 stane pri 3 GB 11 €, pri 7 GB 19 €.
trditev: MAT-SS-1/linearna-funkcija#uvod-cene
besedilo: »Hitro izračunaš $11\,\text{€}$ in $19\,\text{€}$.« -/
theorem uvod_cene : (2:ℝ) * 3 + 5 = 11 ∧ (2:ℝ) * 7 + 5 = 19 := by norm_num

/-- Zakaj se tega učimo: vsak dodatni GB doda enakih 2 € (sprememba pri x + 1 je vedno 2).
trditev: MAT-SS-1/linearna-funkcija#uvod-enakomerno
besedilo: »Vsak dodatni GB doda enakih $2\,\text{€}$, zato cena raste enakomerno.« -/
theorem uvod_enakomerno (x : ℝ) : (2 * (x + 1) + 5) - (2 * x + 5) = 2 := by ring

/-! ## Razlaga 1 in 2: definicija, k in n -/

/-- Razlaga 1, hitri preizkus: y = 3x² + 1 ni linearna funkcija (ni k, n, da bi bilo 3x² + 1 = kx + n
za vse x).
trditev: MAT-SS-1/linearna-funkcija#kvadrat-ni-linearna
besedilo: »Ne, ker $x$ nastopa s kvadratom.« -/
theorem kvadrat_ni_linearna : ¬ ∃ k n : ℝ, ∀ x : ℝ, 3 * x ^ 2 + 1 = k * x + n := by
  rintro ⟨k, n, h⟩
  have h0 := h 0
  have h1 := h 1
  have h2 := h (-1)
  norm_num at h0 h1 h2
  linarith

/-- Razlaga 2 (pomen k): ko se x poveča za 1, se y = kx + n spremeni za k.
trditev: MAT-SS-1/linearna-funkcija#pomen-k
besedilo: »Pove, za koliko se spremeni $y$, ko se $x$ poveča za $1$.« -/
theorem pomen_k (k n x : ℝ) : (k * (x + 1) + n) - (k * x + n) = k := by ring

/-- Razlaga 2 (pomen n): pri x = 0 je y = n, graf seka os y v (0, n).
trditev: MAT-SS-1/linearna-funkcija#pomen-n
besedilo: »Pove, kolikšen je $y$ pri $x = 0$, torej kje graf seka os $y$: v točki $(0, n)$.« -/
theorem pomen_n (k n : ℝ) : k * 0 + n = n := by ring

/-- Razlaga 2: k in n sta s funkcijo natanko določena (če je kx + n = k'x + n' za vse x, je k = k', n = n').
Zato ju iz predpisa »preberemo«.
pomozno – lekcija k in n le prebere iz predpisa; enoličnosti koeficientov ne izreče -/
theorem koeficienta (k n k' n' : ℝ) (h : ∀ x : ℝ, k * x + n = k' * x + n') : k = k' ∧ n = n' := by
  have h0 := h 0
  have h1 := h 1
  constructor <;> linarith

/-- Predpostavka `koeficienta` se da izpolniti (k = k' = 2, n = n' = 5). -/
example : ∀ x : ℝ, 2 * x + 5 = 2 * x + 5 := fun _ => rfl

/-- Pomožno: predpis ax + b je enak kx + n natanko tedaj, ko je k = a in n = b.
pomozno – orodje (docstring »Pomožno«) za branje k in n iz predpisa -/
theorem preberi (a b k n : ℝ) : (∀ x : ℝ, a * x + b = k * x + n) ↔ (k = a ∧ n = b) := by
  constructor
  · intro h
    obtain ⟨h1, h2⟩ := koeficienta a b k n h
    exact ⟨h1.symm, h2.symm⟩
  · rintro ⟨rfl, rfl⟩ _
    rfl

/-- Razlaga 1: paket y = 2x + 5 ima k = 2 in n = 5.
trditev: MAT-SS-1/linearna-funkcija#paket-k-n
besedilo: »V paketu je $k = 2$: vsak GB doda $2\,\text{€}$.« -/
theorem paket_k_n (k n : ℝ) : (∀ x : ℝ, 2 * x + 5 = k * x + n) ↔ (k = 2 ∧ n = 5) := preberi 2 5 k n

/-- Razlaga 2, hitri preizkus: pri y = 0,5x + 8 je k = 0,5 in n = 8.
trditev: MAT-SS-1/linearna-funkcija#preizkus-k-n
besedilo: »$k = 0{,}5$; $n = 8$.« -/
theorem preizkus_k_n (k n : ℝ) : (∀ x : ℝ, 0.5 * x + 8 = k * x + n) ↔ (k = 0.5 ∧ n = 8) :=
  preberi 0.5 8 k n

/-! ## Razlaga 3: graf -/

/-- Razlaga 3: točke (0, 5), (3, 11) in (6, 17) ležijo na grafu y = 2x + 5 (pri 6 GB je cena 17 €).
trditev: MAT-SS-1/linearna-funkcija#graf-tocke
besedilo: »Točka $(6, 17)$, torej $17\,\text{€}$.« -/
theorem graf_tocke : (2:ℝ) * 0 + 5 = 5 ∧ (2:ℝ) * 3 + 5 = 11 ∧ (2:ℝ) * 6 + 5 = 17 := by norm_num

/-- Razlaga 3 in 5: dve točki z različnima abscisama natanko določata linearno funkcijo: obstaja natanko en
par (k, n), da gre y = kx + n skozi (x₁, y₁) in (x₂, y₂). Zato za risanje zadostujeta dve točki.
trditev: MAT-SS-1/linearna-funkcija#dve-tocki
besedilo: »Za risanje zadostujeta dve točki.« -/
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

/-- Razlaga 4: pri k > 0 je funkcija naraščajoča.
trditev: MAT-SS-1/linearna-funkcija#narasca
besedilo: »$k > 0$: funkcija je **naraščajoča**« -/
theorem narasca (k n : ℝ) (hk : 0 < k) : StrictMono (fun x : ℝ => k * x + n) := by
  intro a b hab
  show k * a + n < k * b + n
  nlinarith

/-- Predpostavka `narasca` se da izpolniti (k = 2). -/
example : (0:ℝ) < 2 := by norm_num

/-- Razlaga 4: pri k < 0 je funkcija padajoča.
trditev: MAT-SS-1/linearna-funkcija#pada
besedilo: »$k < 0$: funkcija je **padajoča**« -/
theorem pada (k n : ℝ) (hk : k < 0) : StrictAnti (fun x : ℝ => k * x + n) := by
  intro a b hab
  show k * b + n < k * a + n
  nlinarith

/-- Predpostavka `pada` se da izpolniti (k = −2). -/
example : (-2:ℝ) < 0 := by norm_num

/-- Razlaga 4: pri k = 0 je funkcija konstantna y = n.
trditev: MAT-SS-1/linearna-funkcija#konstantna
besedilo: »$k = 0$: funkcija je **konstantna** $y = n$« -/
theorem konstantna (n x : ℝ) : 0 * x + n = n := by ring

/-- Razlaga 4: večja ko je |k|, strmejša je premica: pri istem premiku h ≠ 0 se y pri večjem |k| spremeni
za več (|k₁h| < |k₂h|).
trditev: MAT-SS-1/linearna-funkcija#strmejsa
besedilo: »Večja ko je $|k|$, strmejša je premica.« -/
theorem strmejsa (k₁ k₂ h : ℝ) (hk : |k₁| < |k₂|) (hh : h ≠ 0) : |k₁ * h| < |k₂ * h| := by
  rw [abs_mul, abs_mul]
  exact mul_lt_mul_of_pos_right hk (abs_pos.mpr hh)

/-- Predpostavke `strmejsa` se dajo izpolniti (k₁ = 1, k₂ = 2, h = 1). -/
example : |(1:ℝ)| < |(2:ℝ)| ∧ (1:ℝ) ≠ 0 := by norm_num

/-- Razlaga 4 (slika s stopnico): od točke (0, n) za 1 v desno se premica dvigne za k.
trditev: MAT-SS-1/linearna-funkcija#stopnica
besedilo: »ko greš od točke $(0, n)$ za $1$ v desno, se premica dvigne za $k$« -/
theorem stopnica (k n : ℝ) : k * 1 + n = (k * 0 + n) + k := by ring

/-- Razlaga 4 (simulacija pri n = 5): pri vsakem k gre premica y = kx + 5 skozi (0, 5); pri k = 0 je
vodoravna.
trditev: MAT-SS-1/linearna-funkcija#simulacija-n5
besedilo: »Opazi, da se premica vrti okoli točke $(0, 5)$ in da je pri $k = 0$ vodoravna.« -/
theorem simulacija_n5 (k : ℝ) : k * 0 + 5 = 5 ∧ ∀ x : ℝ, 0 * x + 5 = (5:ℝ) := ⟨by ring, fun x => by ring⟩

/-- Razlaga 4, Premisli: y = 3x + 2 je strmejši od y = 2x + 5 (3 > 2), začne nižje (2 < 5), premici se
sekata natanko pri x = 3, kjer sta obe ceni 11 €.
trditev: MAT-SS-1/linearna-funkcija#premisli-operaterja
besedilo: »Strmejši je $y = 3x + 2$, ker je $3 > 2$. Začne nižje ($2 < 5$), a raste hitreje, zato drugo premico na neki točki dohiti (pri $x = 3$ sta obe ceni $11\,\text{€}$).« -/
theorem premisli_operaterja :
    (2:ℝ) < 3 ∧ (2:ℝ) < 5 ∧ (∀ x : ℝ, 3 * x + 2 = 2 * x + 5 ↔ x = 3) ∧
      (3:ℝ) * 3 + 2 = 11 ∧ (2:ℝ) * 3 + 5 = 11 := by
  refine ⟨by norm_num, by norm_num, fun x => ⟨fun h => by linarith, fun h => by subst h; norm_num⟩,
    by norm_num, by norm_num⟩

/-! ## Razlaga 5: k iz dveh točk -/

/-- Razlaga 5, Ustno vprašanje 2 in Bolj natančno: za točki (x₁, kx₁ + n) in (x₂, kx₂ + n) grafa z
x₁ ≠ x₂ je (y₂ − y₁)/(x₂ − x₁) = k(x₂ − x₁)/(x₂ − x₁) = k, za vsak par točk.
trditev: MAT-SS-1/linearna-funkcija#kolicnik
besedilo: »$$\frac{y_2 - y_1}{x_2 - x_1} = \frac{(kx_2 + n) - (kx_1 + n)}{x_2 - x_1} = \frac{k(x_2 - x_1)}{x_2 - x_1} = k.$$ Razmerje je za **vsak** par točk enako $k$.« -/
theorem kolicnik (k n x₁ x₂ : ℝ) (h : x₁ ≠ x₂) :
    ((k * x₂ + n) - (k * x₁ + n)) / (x₂ - x₁) = k := by
  have hx : x₂ - x₁ ≠ 0 := sub_ne_zero.mpr (Ne.symm h)
  calc ((k * x₂ + n) - (k * x₁ + n)) / (x₂ - x₁) = k * (x₂ - x₁) / (x₂ - x₁) := by ring
    _ = k := mul_div_cancel_right₀ k hx

/-- Predpostavka `kolicnik` se da izpolniti (x₁ = 1, x₂ = 4). -/
example : (1:ℝ) ≠ 4 := by norm_num

/-- Razlaga 5, hitri preizkus: k skozi (0, 5) in (3, 11) je 6/3 = 2.
trditev: MAT-SS-1/linearna-funkcija#preizkus-k
besedilo: »$k = \dfrac{6}{3} = 2$, kot pri paketu.« -/
theorem preizkus_k : ((11:ℝ) - 5) / (3 - 0) = 6 / 3 ∧ (6:ℝ) / 3 = 2 := by norm_num

/-! ## Razlaga 6: ničla -/

/-- Razlaga 6 in Povzetek: pri k ≠ 0 je kx + n = 0 natanko tedaj, ko je x = −n/k.
trditev: MAT-SS-1/linearna-funkcija#nicla
besedilo: »Dobimo jo z reševanjem enačbe $kx + n = 0$: $$x_0 = -\frac{n}{k}, \qquad k \ne 0.$$« -/
theorem nicla (k n x : ℝ) (hk : k ≠ 0) : k * x + n = 0 ↔ x = -n / k := by
  rw [eq_div_iff hk]
  constructor <;> intro h <;> linarith

/-- Predpostavka `nicla` se da izpolniti (k = 2). -/
example : (2:ℝ) ≠ 0 := by norm_num

/-- Ustno vprašanje 3: pri k ≠ 0 ima funkcija natanko eno ničlo.
trditev: MAT-SS-1/linearna-funkcija#nicla-enolicna
besedilo: »Pri $k \ne 0$ ima funkcija natanko eno ničlo $x_0 = -\dfrac{n}{k}$« -/
theorem nicla_enolicna (k n : ℝ) (hk : k ≠ 0) : ∃! x : ℝ, k * x + n = 0 :=
  ⟨-n / k, (nicla k n _ hk).mpr rfl, fun y hy => (nicla k n y hk).mp hy⟩

/-- Predpostavka `nicla_enolicna` se da izpolniti (k = −2). -/
example : (-2:ℝ) ≠ 0 := by norm_num

/-- Razlaga 6 in Bolj natančno: pri k = 0 in n ≠ 0 ničle ni.
trditev: MAT-SS-1/linearna-funkcija#brez-nicle
besedilo: »Če je $k = 0$ in $n \ne 0$, ničle ni (premica je vzporedna osi $x$).« -/
theorem brez_nicle (n : ℝ) (hn : n ≠ 0) : ∀ x : ℝ, 0 * x + n ≠ 0 := by
  intro x
  simpa using hn

/-- Predpostavka `brez_nicle` se da izpolniti (n = 3). -/
example : (3:ℝ) ≠ 0 := by norm_num

/-- Razlaga 6 in Bolj natančno: pri k = 0 in n = 0 je vsak x ničla.
trditev: MAT-SS-1/linearna-funkcija#vse-nicle
besedilo: »Če je $k = 0$ in $n = 0$, je vsak $x$ ničla.« -/
theorem vse_nicle (x : ℝ) : 0 * x + 0 = (0:ℝ) := by ring

/-- Bolj natančno: konstantna funkcija (k = 0) nima natanko ene ničle.
trditev: MAT-SS-1/linearna-funkcija#konstantna-ni-ene-nicle
besedilo: »Zato konstantna funkcija nima natanko ene ničle.« -/
theorem konstantna_ni_ene_nicle (n : ℝ) : ¬ ∃! x : ℝ, 0 * x + n = 0 := by
  rintro ⟨x, hx, hu⟩
  have h1 := hu (x + 1) (by simpa using hx)
  linarith

/-- Ustno vprašanje 3: f(x) = 3 nima ničle.
trditev: MAT-SS-1/linearna-funkcija#f3-brez-nicle
besedilo: »Pri $k = 0$ in $n \ne 0$ ničle ni: funkcija $f(x) = 3$ ima na primer povsod vrednost $3$« -/
theorem f3_brez_nicle : ∀ x : ℝ, 0 * x + 3 ≠ (0:ℝ) := brez_nicle 3 (by norm_num)

/-- Razlaga 6, Premisli: baterija y = −10x + 100 ima ničlo natanko x₀ = 10.
trditev: MAT-SS-1/linearna-funkcija#baterija-10
besedilo: »Ničla $x_0 = 10$ pomeni, da je telefon po $10$ urah prazen.« -/
theorem baterija_10 (x : ℝ) : -10 * x + 100 = 0 ↔ x = 10 :=
  ⟨fun h => by linarith, fun h => by subst h; norm_num⟩

/-- Razlaga 6, Premisli: paket y = 2x + 5 pri x ≥ 0 nikoli ni 0 (cena je vsaj 5), ničla je −2,5 < 0.
trditev: MAT-SS-1/linearna-funkcija#paket-brez-nicle
besedilo: »Pri paketu cena samo raste od $5\,\text{€}$ naprej, zato pri $x \ge 0$ nikoli ni $0$ (ničla $-2{,}5$ nima smisla, število GB ne more biti negativno).« -/
theorem paket_brez_nicle :
    (∀ x : ℝ, 0 ≤ x → 5 ≤ 2 * x + 5) ∧ (∀ x : ℝ, 2 * x + 5 = 0 ↔ x = -2.5) ∧ (-2.5 : ℝ) < 0 := by
  refine ⟨fun x hx => by linarith, fun x => ⟨fun h => by linarith, fun h => by subst h; norm_num⟩,
    by norm_num⟩

/-! ## Primer 1 -/

/-- Primer 1, korak 1: f(x) = 2x − 4 ima k = 2, n = −4.
trditev: MAT-SS-1/linearna-funkcija#p1-k-n
besedilo: »Preberemo: $k = 2$, $n = -4$.« -/
theorem p1_k_n (k n : ℝ) : (∀ x : ℝ, 2 * x + (-4) = k * x + n) ↔ (k = 2 ∧ n = -4) := preberi 2 (-4) k n

/-- Primer 1, korak 1: f(x) = 2x − 4 narašča.
trditev: MAT-SS-1/linearna-funkcija#p1-narasca
besedilo: »Ker je $k > 0$, funkcija narašča.« -/
theorem p1_narasca : StrictMono (fun x : ℝ => 2 * x + (-4)) := narasca 2 (-4) (by norm_num)

/-- Primer 1, korak 2: f(0) = −4, točka (0, −4).
trditev: MAT-SS-1/linearna-funkcija#p1-f0
besedilo: »Prva točka je presečišče z osjo $y$: $(0, -4)$.« -/
theorem p1_f0 : (2:ℝ) * 0 - 4 = -4 := by norm_num

/-- Primer 1, korak 3: f(3) = 2·3 − 4 = 2.
trditev: MAT-SS-1/linearna-funkcija#p1-f3
besedilo: »$f(3) = 2 \cdot 3 - 4 = 2$« -/
theorem p1_f3 : (2:ℝ) * 3 - 4 = 2 := by norm_num

/-- Primer 1, korak 5: 2x − 4 = 0 ⇔ 2x = 4 ⇔ x = 2.
trditev: MAT-SS-1/linearna-funkcija#p1-nicla
besedilo: »Ničla: $2x - 4 = 0$, torej $2x = 4$ in $x_0 = 2$.« -/
theorem p1_nicla (x : ℝ) : 2 * x - 4 = 0 ↔ x = 2 := by
  calc 2 * x - 4 = 0 ↔ 2 * x = 4 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 2 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Primer 1, korak 6: f(2) = 2·2 − 4 = 0 in 0 < 2 < 3 (ničla leži med izbranima točkama).
trditev: MAT-SS-1/linearna-funkcija#p1-preizkus
besedilo: »Preverimo: $f(2) = 2 \cdot 2 - 4 = 0$. ✓ Točka $(2, 0)$ leži na premici med izbranima točkama« -/
theorem p1_preizkus : (2:ℝ) * 2 - 4 = 0 ∧ (0:ℝ) < 2 ∧ (2:ℝ) < 3 := by norm_num

/-! ## Primer 2 -/

/-- Primer 2, korak 1: k = (−1 − 5)/(4 − 1) = −6/3 = −2 (k < 0).
trditev: MAT-SS-1/linearna-funkcija#p2-k
besedilo: »Smerni koeficient: $k = \dfrac{-1 - 5}{4 - 1} = \dfrac{-6}{3} = -2$.« -/
theorem p2_k : ((-1:ℝ) - 5) / (4 - 1) = -6 / 3 ∧ (-6:ℝ) / 3 = -2 ∧ (-2:ℝ) < 0 := by norm_num

/-- Primer 2, koraka 2–3: iz 5 = −2·1 + n sledi n = 5 + 2 = 7 (in obratno).
trditev: MAT-SS-1/linearna-funkcija#p2-n
besedilo: »vstavimo točko $A$: $5 = -2 \cdot 1 + n$. 3. Rešimo: $n = 5 + 2 = 7$.« -/
theorem p2_n (n : ℝ) : (5:ℝ) = -2 * 1 + n ↔ n = 5 + 2 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Primer 2, koraka 3–4: 5 + 2 = 7.
trditev: MAT-SS-1/linearna-funkcija#p2-n7
besedilo: »Rešimo: $n = 5 + 2 = 7$.« -/
theorem p2_n7 : (5:ℝ) + 2 = 7 := by norm_num

/-- Primer 2, korak 4: premica skozi A(1, 5) in B(4, −1) je natanko y = −2x + 7.
trditev: MAT-SS-1/linearna-funkcija#p2-enacba
besedilo: »Enačba: $y = -2x + 7$.« -/
theorem p2_enacba (k n : ℝ) : (k * 1 + n = 5 ∧ k * 4 + n = -1) ↔ (k = -2 ∧ n = 7) := by
  constructor
  · rintro ⟨h1, h2⟩
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩
    norm_num

/-- Primer 2, korak 5: −2·4 + 7 = −8 + 7 = −1.
trditev: MAT-SS-1/linearna-funkcija#p2-preizkus
besedilo: »Preverimo z drugo točko: $-2 \cdot 4 + 7 = -8 + 7 = -1$.« -/
theorem p2_preizkus : (-2:ℝ) * 4 + 7 = -8 + 7 ∧ (-8:ℝ) + 7 = -1 := by norm_num

/-- Primer 2, korak 6: −2x + 7 = 0 ⇔ x = 7/2 in 7/2 = 3,5.
trditev: MAT-SS-1/linearna-funkcija#p2-nicla
besedilo: »Ničla: $-2x + 7 = 0$, $x_0 = \dfrac{7}{2} = 3{,}5$.« -/
theorem p2_nicla (x : ℝ) : (-2 * x + 7 = 0 ↔ x = 7 / 2) ∧ (7:ℝ) / 2 = 3.5 :=
  ⟨⟨fun h => by linarith, fun h => by subst h; norm_num⟩, by norm_num⟩

/-! ## Primer 3 -/

/-- Primer 3 (a): pogoja »pri x = 0 plačamo 3« in »vsak GB doda 1,20« natanko določata y = 1,2x + 3.
trditev: MAT-SS-1/linearna-funkcija#p3-a
besedilo: »Pri $x = 0$ plačamo $3$, zato je $n = 3$. Vsak GB doda $1{,}20$, zato je $k = 1{,}2$. Funkcija: $y = 1{,}2x + 3$.« -/
theorem p3_a (k n : ℝ) :
    (k * 0 + n = 3 ∧ ∀ x : ℝ, (k * (x + 1) + n) - (k * x + n) = 1.2) ↔ (k = 1.2 ∧ n = 3) := by
  constructor
  · rintro ⟨h0, h1⟩
    have := h1 0
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩
    exact ⟨by norm_num, fun x => by ring⟩

/-- Primer 3 (b): y = 1,2·15 + 3 = 18 + 3 = 21.
trditev: MAT-SS-1/linearna-funkcija#p3-b
besedilo: »$y = 1{,}2 \cdot 15 + 3 = 18 + 3 = 21$. Račun je $21\,\text{€}$.« -/
theorem p3_b : (1.2:ℝ) * 15 + 3 = 18 + 3 ∧ (18:ℝ) + 3 = 21 := by norm_num

/-- Primer 3 (c), Premisli: 1,2x + 3 = 27 ⇔ 1,2x = 24 ⇔ x = 20; preizkus 1,2·20 + 3 = 27.
trditev: MAT-SS-1/linearna-funkcija#p3-c
besedilo: »Odštejemo $3$: $1{,}2x = 24$. Delimo z $1{,}2$: $x = 20$. Preizkus: $1{,}2 \cdot 20 + 3 = 27$.« -/
theorem p3_c (x : ℝ) : (1.2 * x + 3 = 27 ↔ x = 20) ∧ (1.2:ℝ) * 20 + 3 = 27 := by
  refine ⟨?_, by norm_num⟩
  calc 1.2 * x + 3 = 27 ↔ 1.2 * x = 24 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 20 := ⟨fun h => by linarith, fun h => by subst h; norm_num⟩

/-! ## Pogoste napake -/

/-- Pogoste napake 1: pri y = −4x + 1 je k = −4 in n = 1 (ne (0, −4)).
trditev: MAT-SS-1/linearna-funkcija#napaka-k-n
besedilo: »pri $y = -4x + 1$ je $k = -4$, $n = 1$.« -/
theorem napaka_k_n (k n : ℝ) : (∀ x : ℝ, -4 * x + 1 = k * x + n) ↔ (k = -4 ∧ n = 1) :=
  preberi (-4) 1 k n

/-- Pogoste napake 2 in 4, Preveri se 1: 3x − 12 = 0 ⇔ 3x = 12 ⇔ x = 4; −4, −12 in 12 niso ničle.
trditev: MAT-SS-1/linearna-funkcija#nicla-3x-12
besedilo: »Rešimo $3x - 12 = 0$, torej $3x = 12$ in $x = 4$.« -/
theorem nicla_3x_12 (x : ℝ) : 3 * x - 12 = 0 ↔ x = 4 := by
  calc 3 * x - 12 = 0 ↔ 3 * x = 12 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 4 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Pogoste napake 2 in 4, Preveri se 1: napačni odgovori −4, −12 in 12 niso ničle 3x − 12; f(0) = −12.
trditev: MAT-SS-1/linearna-funkcija#nicla-3x-12-napacne
besedilo: »Vrednost $-12$ je presečišče z osjo $y$ ($f(0) = -12$), ne ničla.« -/
theorem nicla_3x_12_napacne :
    (3:ℝ) * (-4) - 12 ≠ 0 ∧ (3:ℝ) * (-12) - 12 ≠ 0 ∧ (3:ℝ) * 12 - 12 ≠ 0 ∧ (3:ℝ) * 0 - 12 = -12 := by
  norm_num

/-- Pogoste napake 3, Preveri se 2: obrnjen ulomek ne da k: za (2, 1), (5, 7) je (5 − 2)/(7 − 1) = 1/2 ≠ 2.
trditev: MAT-SS-1/linearna-funkcija#obrnjen-ulomek
besedilo: »Odgovor $\dfrac12$ je obrnjen ulomek« -/
theorem obrnjen_ulomek : ((5:ℝ) - 2) / (7 - 1) = 1 / 2 ∧ (1:ℝ) / 2 ≠ 2 := by norm_num

/-- Pogoste napake 5, Preveri se 5: točki (0, 6) in (3, 0) dasta k = (0 − 6)/(3 − 0) = −2, ne 2 (in ne 1/2,
ne 3).
trditev: MAT-SS-1/linearna-funkcija#padajoca-k
besedilo: »Točki $(0, 6)$ in $(3, 0)$ dasta $k = \dfrac{0 - 6}{3 - 0} = -2$.« -/
theorem padajoca_k :
    ((0:ℝ) - 6) / (3 - 0) = -2 ∧ (-2:ℝ) ≠ 2 ∧ (-2:ℝ) ≠ 1 / 2 ∧ (-2:ℝ) ≠ 3 := by norm_num

/-! ## Za maturo -/

/-- Naloga 1, korak 1: −2/3·x + 4 = 0 ⇔ 2/3·x = 4 ⇔ x = 6.
trditev: MAT-SS-1/linearna-funkcija#m1-nicla
besedilo: »$-\dfrac{2}{3}x + 4 = 0$, torej $\dfrac{2}{3}x = 4$ in $x_0 = 6$.« -/
theorem m1_nicla (x : ℝ) : -(2 / 3) * x + 4 = 0 ↔ x = 6 := by
  calc -(2 / 3) * x + 4 = 0 ↔ 2 / 3 * x = 4 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 6 := ⟨fun h => by linarith, fun h => by subst h; norm_num⟩

/-- Naloga 1, korak 2: f(0) = 4, graf seka os y v (0, 4).
trditev: MAT-SS-1/linearna-funkcija#m1-f0
besedilo: »Začetna vrednost je $n = 4$, zato graf seka os $y$ v točki $(0, 4)$.« -/
theorem m1_f0 : -(2 / 3 : ℝ) * 0 + 4 = 4 := by norm_num

/-- Naloga 1, korak 3: P = 6·4/2 = 12.
trditev: MAT-SS-1/linearna-funkcija#m1-ploscina
besedilo: »$P = \dfrac{6 \cdot 4}{2} = 12$« -/
theorem m1_ploscina : (6:ℝ) * 4 / 2 = 12 := by norm_num

/-- Naloga 2 a): 6,4/100 = 0,064, zato k = −0,064 in n = 48; k pomeni spremembo −0,064 l na km.
trditev: MAT-SS-1/linearna-funkcija#m2-a
besedilo: »Na vsak kilometer se količina goriva zmanjša za $\dfrac{6{,}4}{100} = 0{,}064$ litra, zato je $k = -0{,}064$.« -/
theorem m2_a (x : ℝ) : (6.4:ℝ) / 100 = 0.064 ∧ (-0.064 * (x + 1) + 48) - (-0.064 * x + 48) = -0.064 :=
  ⟨by norm_num, by ring⟩

/-- Naloga 2 a): predpis y = kx + n s k = −0,064 in n = 48 je natanko y = −0,064x + 48.
trditev: MAT-SS-1/linearna-funkcija#m2-predpis
besedilo: »Predpis: $y = -0{,}064x + 48$.« -/
theorem m2_predpis (k n : ℝ) : (∀ x : ℝ, -0.064 * x + 48 = k * x + n) ↔ (k = -0.064 ∧ n = 48) :=
  preberi (-0.064) 48 k n

/-- Naloga 2 b): y = −0,064·285 + 48 = −18,24 + 48 = 29,76 ≈ 29,8.
trditev: MAT-SS-1/linearna-funkcija#m2-b
besedilo: »$y = -0{,}064 \cdot 285 + 48 = -18{,}24 + 48 = 29{,}76$, torej približno $29{,}8$ litra.« -/
theorem m2_b : (-0.064:ℝ) * 285 + 48 = -18.24 + 48 ∧ (-18.24:ℝ) + 48 = 29.76 ∧
    |(29.76:ℝ) - 29.8| < 0.05 := by
  norm_num [abs_lt]

/-- Naloga 2 c): −0,064x + 48 = 7 ⇔ 0,064x = 41 ⇔ x = 640,625 ≈ 641.
trditev: MAT-SS-1/linearna-funkcija#m2-c
besedilo: »$-0{,}064x + 48 = 7$, torej $0{,}064x = 41$ in $x = 640{,}625$. 5. c) Lučka zasveti po približno $641\,\text{km}$ vožnje.« -/
theorem m2_c (x : ℝ) : (-0.064 * x + 48 = 7 ↔ x = 640.625) ∧ |(640.625:ℝ) - 641| < 0.5 := by
  refine ⟨?_, by norm_num [abs_lt]⟩
  calc -0.064 * x + 48 = 7 ↔ 0.064 * x = 41 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 640.625 := ⟨fun h => by linarith, fun h => by subst h; norm_num⟩

/-- Naloga 2 d): −0,064x + 48 = 0 ⇔ x = 48/0,064 = 750.
trditev: MAT-SS-1/linearna-funkcija#m2-d
besedilo: »$-0{,}064x + 48 = 0$, torej $x_0 = \dfrac{48}{0{,}064} = 750$.« -/
theorem m2_d (x : ℝ) : (-0.064 * x + 48 = 0 ↔ x = 48 / 0.064) ∧ (48:ℝ) / 0.064 = 750 := by
  refine ⟨⟨fun h => ?_, fun h => ?_⟩, by norm_num⟩
  · rw [eq_div_iff (by norm_num)]; linarith
  · rw [h]; norm_num

/-- Naloga 2 d): pot in količina goriva nista negativni natanko za 0 ≤ x ≤ 750 (model velja na [0, 750]).
trditev: MAT-SS-1/linearna-funkcija#m2-d-interval
besedilo: »Prevožena pot ni negativna, količina goriva pa tudi ne, zato je model smiseln za $0 \le x \le 750$.« -/
theorem m2_d_interval (x : ℝ) : (0 ≤ x ∧ 0 ≤ -0.064 * x + 48) ↔ x ∈ Set.Icc (0:ℝ) 750 := by
  rw [Set.mem_Icc]
  constructor
  · rintro ⟨h1, h2⟩; exact ⟨h1, by linarith⟩
  · rintro ⟨h1, h2⟩; exact ⟨h1, by linarith⟩

/-! ## Drugače -/

/-- Iz vsakdanjega življenja: kartica y = −2x + 10 ima n = 10, k = −2 in je prazna natanko pri x = 5.
trditev: MAT-SS-1/linearna-funkcija#kartica
besedilo: »$n = 10$: začetno stanje. - $k = -2$: stanje pada za $2\,\text{€}$ na dan. - Ničla: $-2x + 10 = 0$, torej $x = 5$.« -/
theorem kartica (x : ℝ) : (-2:ℝ) * 0 + 10 = 10 ∧ (-2 * (x + 1) + 10) - (-2 * x + 10) = -2 ∧
    (-2 * x + 10 = 0 ↔ x = 5) :=
  ⟨by norm_num, by ring, ⟨fun h => by linarith, fun h => by subst h; norm_num⟩⟩

/-- Iz vsakdanjega življenja: pri y = 1,5x + 100 je hitrost 1,5 m/s smerni koeficient (sprememba na sekundo).
trditev: MAT-SS-1/linearna-funkcija#hoja
besedilo: »Hitrost je smerni koeficient.« -/
theorem hoja (x : ℝ) : (1.5 * (x + 1) + 100) - (1.5 * x + 100) = (1.5:ℝ) := by ring

/-- Iz vsakdanjega življenja (natančna oblika »enaka sprememba na enoto ⇒ linearna«): če je količnik sprememb
(f(b) − f(a))/(b − a) za vsak par a ≠ b enak c, je f(x) = cx + f(0).
trditev: MAT-SS-1/linearna-funkcija#enak-kolicnik-linearna
besedilo: »Vsakič, ko se nekaj spreminja **za enako količino na enoto**, je to linearna funkcija.« -/
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
f(6) = −3 + 3 = 0.
trditev: MAT-SS-1/linearna-funkcija#tabela
besedilo: »Preveri izračune: $-\tfrac{1}{2}\cdot(-2) + 3 = 1 + 3 = 4$; $-\tfrac{1}{2}\cdot 2 + 3 = -1 + 3 = 2$; $-\tfrac{1}{2}\cdot 6 + 3 = -3 + 3 = 0$.« -/
theorem tabela :
    (-(1 / 2) * (-2) + 3 : ℝ) = 1 + 3 ∧ (1 + 3 : ℝ) = 4 ∧ (-(1 / 2) * 0 + 3 : ℝ) = 3 ∧
      (-(1 / 2) * 2 + 3 : ℝ) = -1 + 3 ∧ (-1 + 3 : ℝ) = 2 ∧
      (-(1 / 2) * 6 + 3 : ℝ) = -3 + 3 ∧ (-3 + 3 : ℝ) = 0 := by norm_num

/-- Korak za korakom, korak 4: ko se x poveča za 2, se y zmanjša za 1; razmerje −1/2 = k.
trditev: MAT-SS-1/linearna-funkcija#tabela-razmerje
besedilo: »ko se $x$ poveča za $2$, se $y$ zmanjša za $1$. Razmerje je $\dfrac{-1}{2} = -\dfrac{1}{2} = k$.« -/
theorem tabela_razmerje (x : ℝ) : (-(1 / 2) * (x + 2) + 3) - (-(1 / 2) * x + 3) = -1 ∧
    (-1:ℝ) / 2 = -(1 / 2) := ⟨by ring, by norm_num⟩

/-- Korak za korakom, korak 5: −½x + 3 = 0 ⇔ x = 6.
trditev: MAT-SS-1/linearna-funkcija#tabela-nicla
besedilo: »Ničla: $-\tfrac{1}{2}x + 3 = 0$, $x = 6$.« -/
theorem tabela_nicla (x : ℝ) : -(1 / 2) * x + 3 = 0 ↔ x = 6 :=
  ⟨fun h => by linarith, fun h => by subst h; norm_num⟩

/-- Na sliki: pri k = 2 greš 1 desno in 2 gor, pri k = −½ greš 2 desno in 1 dol.
trditev: MAT-SS-1/linearna-funkcija#na-sliki
besedilo: »Pri $k = 2$ greš $1$ desno in $2$ gor, pri $k = -\tfrac{1}{2}$ greš $2$ desno in $1$ dol.« -/
theorem na_sliki (n x : ℝ) : (2 * (x + 1) + n) - (2 * x + n) = 2 ∧
    (-(1 / 2) * (x + 2) + n) - (-(1 / 2) * x + n) = -1 := ⟨by ring, by ring⟩

/-- Na sliki: sprememba n ne spremeni spremembe na enoto (naklon ostane k).
trditev: MAT-SS-1/linearna-funkcija#na-sliki-n
besedilo: »Ko spreminjaš **$n$**, se premica premika gor in dol, njen naklon pa ostane enak.« -/
theorem na_sliki_n (k n n' x : ℝ) :
    (k * (x + 1) + n) - (k * x + n) = (k * (x + 1) + n') - (k * x + n') := by ring

/-! ## Preveri se -/

/-- Preveri se 2: k = (7 − 1)/(5 − 2) = 6/3 = 2; napačni odgovori 0,5, 3, 6 in −2 niso 2.
trditev: MAT-SS-1/linearna-funkcija#preveri-2
besedilo: »$k = \dfrac{7 - 1}{5 - 2} = \dfrac{6}{3} = 2$.« -/
theorem preveri_2 : ((7:ℝ) - 1) / (5 - 2) = 6 / 3 ∧ (6:ℝ) / 3 = 2 ∧
    (0.5:ℝ) ≠ 2 ∧ (3:ℝ) ≠ 2 ∧ (6:ℝ) ≠ 2 ∧ (-2:ℝ) ≠ 2 := by norm_num

/-- Preveri se 3: pri y = −4x + 1 so vrednosti pri x = 0, 1, 2 enake 1, −3, −7 (ne −4, −3, −2 in ne 1, 5, 9).
trditev: MAT-SS-1/linearna-funkcija#preveri-3
besedilo: »Pri $x = 0$ je $y = n = 1$, nato se $y$ ob vsakem koraku za $1$ zmanjša za $4$, ker je $k = -4$.« -/
theorem preveri_3 : ((-4:ℝ) * 0 + 1 = 1 ∧ (-4:ℝ) * 1 + 1 = -3 ∧ (-4:ℝ) * 2 + 1 = -7) ∧
    (-4:ℝ) * 0 + 1 ≠ -4 ∧ (-4:ℝ) * 1 + 1 ≠ 5 := by norm_num

/-- Preveri se 4: ničla y = −7x + 100 je x₀ = −100/(−7) = 100/7 ≈ 14 (|100/7 − 14| < 0,5); ni 7, 100 ali −14.
trditev: MAT-SS-1/linearna-funkcija#preveri-4
besedilo: »Ničla funkcije $y = -7x + 100$: $x_0 = \dfrac{100}{7} \approx 14{,}3$. Po približno $14$ urah je baterija prazna.« -/
theorem preveri_4 (x : ℝ) : (-7 * x + 100 = 0 ↔ x = 100 / 7) ∧ -(100:ℝ) / (-7) = 100 / 7 ∧
    |(100:ℝ) / 7 - 14| < 0.5 ∧ (100:ℝ) / 7 ≠ 7 ∧ (100:ℝ) / 7 ≠ 100 ∧ (100:ℝ) / 7 ≠ -14 := by
  refine ⟨⟨fun h => by linarith, fun h => by subst h; norm_num⟩, by norm_num, by norm_num [abs_lt],
    by norm_num, by norm_num, by norm_num⟩

/-! ## RACUN -/

/-- RACUN: vse vrstice bloka (rešitve enačb so dokazane zgoraj kot ↔).
pomozno – zbirni izrek skritega bloka RACUN; njegove vrednosti so citirane pri m1_ploscina, m2_a, m2_b, m2_d in preveri_2 -/
theorem racun : (6:ℝ) * 4 / 2 = 12 ∧ (6.4:ℝ) / 100 = 0.064 ∧ (-0.064:ℝ) * 285 + 48 = 29.76 ∧
    (48:ℝ) / 0.064 = 750 ∧ ((7:ℝ) - 1) / (5 - 2) = 2 := by norm_num

end Evklid.Lekcije.MAT_SS_1.LinearnaFunkcija
