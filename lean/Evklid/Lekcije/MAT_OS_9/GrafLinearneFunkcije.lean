/-
vir: content/lessons/MAT-OS-9/graf-linearne-funkcije.md
sha256: 26d725e22653f2704f5d7db4196e9e21975a96e1c0842da318995861fb19295d
Ni v Leanu: risbe, drsniki in simulacija kot slike (dokazano je, kar slike trdijo računsko: presečišči z osema,
premik ničle pri k = 1, ničla se pri strmejši premici približa osi y (|n/k₂| < |n/k₁| pri |k₁| < |k₂|, n ≠ 0),
pri k = 0 premica doseže os x natanko pri n = 0); »graf je premica« in »podobni trikotniki pod stopnicami,
zato vse točke ležijo na isti premici« kot geometrijski trditvi (dokazano: količnik sprememb je za vsak par
točk enak k, dve točki z različnima abscisama natanko določata k in n); navodila za risanje (ravnilo,
podaljšaj, »tretja točka je preizkus«, »vedno reši korak za korakom«) in Pogoste napake »zamenjani koordinati« (poimenovanje: prva koordinata je x); geometrijsko besedilo »premica pri
k ≠ 0 se v eno smer dviga, v drugo spušča« (dokazano: pri k ≠ 0 natanko ena ničla); pomen količin v
besedilnih nalogah (baterija, modul, gorivo) kot modeli: dokazana je algebra in ura (20 + 4 = 24 > 23,5),
izbira daljice je dokazana kot −15x + 60 ≥ 0 ⇔ x ≤ 4; besedilo napačnih odgovorov v Preveri se (dokazano je,
da napačne vrednosti niso pravilne). »Približno 100 s« je dokazano kot 100 < 250/2,4 < 105 in
|250/2,4 − 104| < 1/2. Decimalna števila so točna racionalna števila v ℝ. Lean deli z 0 kot x/0 = 0, zato
imajo trditve z −n/k pogoj k ≠ 0, kot v lekciji.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_9.GrafLinearneFunkcije

/-! ## Zakaj se tega učimo -/

/-- Zakaj se tega učimo: −15x + 60 = 0 natanko pri x = 4 (baterija se izprazni po 4 urah; po korakih
Razlage 4: −15x = −60, x = 4).
trditev: MAT-OS-9/graf-linearne-funkcije#baterija-nicla
besedilo: »iz $-15x + 60 = 0$ sledi $-15x = -60$ in $x = 4$« -/
theorem baterija_nicla (x : ℝ) : -15 * x + 60 = 0 ↔ x = 4 := by
  calc -15 * x + 60 = 0 ↔ -15 * x = -60 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 4 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Zakaj se tega učimo in Razlaga 4: začetek ob 20.00, 4 ure ⇒ polnoč (24.00), pristanek ob 23.30 je
prej (23,5 < 24), ob pristanku (po 3,5 h) ima baterija še −15·3,5 + 60 = 7,5 % > 0.
trditev: MAT-OS-9/graf-linearne-funkcije#baterija-pristanek
besedilo: »Baterija se izprazni po $4$ urah, ob polnoči, torej pristanek ob 23.30 še vidiš.« -/
theorem baterija_pristanek :
    (20:ℝ) + 4 = 24 ∧ (23.5:ℝ) < 24 ∧ (-15:ℝ) * (23.5 - 20) + 60 = 7.5 ∧ (0:ℝ) < 7.5 := by norm_num

/-! ## Razlaga 1: graf iz tabele -/

/-- Razlaga 1: tabela za y = −2x + 4 (x = −1, 0, 1, 2, 3 ⇒ y = 6, 4, 2, 0, −2).
trditev: MAT-OS-9/graf-linearne-funkcije#tabela
besedilo: »| $-1$ | $6$ | | $0$ | $4$ | | $1$ | $2$ | | $2$ | $0$ | | $3$ | $-2$ |« -/
theorem tabela :
    (-2:ℝ) * (-1) + 4 = 6 ∧ (-2:ℝ) * 0 + 4 = 4 ∧ (-2:ℝ) * 1 + 4 = 2 ∧ (-2:ℝ) * 2 + 4 = 0 ∧
      (-2:ℝ) * 3 + 4 = -2 := by norm_num

/-- Razlaga 1 (in Bolj natančno): dve točki z različnima abscisama natanko določata linearno funkcijo
(natanko en par (k, n)), zato zadoščata dve točki in je vseeno, kateri dve izberemo.
trditev: MAT-OS-9/graf-linearne-funkcije#dve-tocki
besedilo: »Ker je graf premica, zadoščata dve točki.« -/
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

/-- Predpostavka `dve_tocki` se da izpolniti (x₁ = 0, x₂ = 2). -/
example : (0:ℝ) ≠ 2 := by norm_num

/-- Razlaga 1, hitro preveri: točka (3, −2) leži na grafu y = −2x + 4.
trditev: MAT-OS-9/graf-linearne-funkcije#tocka-3
besedilo: »Da: $-2 \cdot 3 + 4 = -2$.« -/
theorem tocka_3 : (-2:ℝ) * 3 + 4 = -2 := by norm_num

/-! ## Razlaga 2: stopnica -/

/-- Razlaga 2 in Povzetek: od točke grafa za 1 v desno se y = kx + n spremeni za k (stopnica).
trditev: MAT-OS-9/graf-linearne-funkcije#stopnica
besedilo: »Od tam naredimo **stopnico**: $1$ v desno in za $k$ navzgor, pri negativnem $k$ navzdol.« -/
theorem stopnica (k n x : ℝ) : k * (x + 1) + n = (k * x + n) + k := by ring

/-- Razlaga 2: pri y = −2x + 4 iz (0, 4) s stopnico (1 desno, 2 dol) v (1, 2), nato v (2, 0).
trditev: MAT-OS-9/graf-linearne-funkcije#stopnici
besedilo: »Pri $y = -2x + 4$ gremo iz $(0, 4)$ za $1$ desno in $2$ dol, v točko $(1, 2)$, in še enkrat, v $(2, 0)$.« -/
theorem stopnici : (-2:ℝ) * 0 + 4 = 4 ∧ (4:ℝ) - 2 = 2 ∧ (-2:ℝ) * 1 + 4 = 2 ∧ (2:ℝ) - 2 = 0 ∧
    (-2:ℝ) * 2 + 4 = 0 := by norm_num

/-- Razlaga 2, hitro preveri: iz (0, 1) s k = 3 prideš v (1, 1 + 3) = (1, 4); ta točka leži na y = 3x + 1.
trditev: MAT-OS-9/graf-linearne-funkcije#stopnica-k3
besedilo: »V točko $(1, 4)$.« -/
theorem stopnica_k3 : (1:ℝ) + 3 = 4 ∧ (3:ℝ) * 1 + 1 = 4 := by norm_num

/-- Razlaga 2, Premisli: pri y = ½x − 1 je dvojna stopnica 2 v desno in 1 navzgor (½·2 = 1); iz (0, −1)
prideš v (2, 0), ki leži na grafu.
trditev: MAT-OS-9/graf-linearne-funkcije#dvojna-stopnica
besedilo: »Narediš dvojno stopnico: $2$ v desno in $1$ navzgor. Iz $(0, -1)$ prideš v točko $(2, 0)$.« -/
theorem dvojna_stopnica (x : ℝ) :
    (1 / 2 * (x + 2) - 1) - (1 / 2 * x - 1) = 1 ∧ (1:ℝ) / 2 * 0 - 1 = -1 ∧ (1:ℝ) / 2 * 2 - 1 = 0 := by
  refine ⟨by ring, by norm_num, by norm_num⟩

/-- Pogoste napake (napačna smer stopnice): pri k = −2 se po koraku 1 v desno premakneš za 2 navzdol.
trditev: MAT-OS-9/graf-linearne-funkcije#stopnica-navzdol
besedilo: »Pri $k = -2$ se po koraku $1$ v desno premakneš za $2$ *navzdol*, ne navzgor.« -/
theorem stopnica_navzdol (n x : ℝ) : -2 * (x + 1) + n = (-2 * x + n) - 2 := by ring

/-! ## Razlaga 3: presečišče z osjo y -/

/-- Razlaga 3 in Povzetek: pri x = 0 je y = k·0 + n = n, presečišče z osjo y je (0, n).
trditev: MAT-OS-9/graf-linearne-funkcije#presecisce-y
besedilo: »Vstavimo: $y = k \cdot 0 + n = n$. Presečišče z osjo $y$ je točka $(0, n)$.« -/
theorem presecisce_y (k n : ℝ) : k * 0 + n = n := by ring

/-- Razlaga 3: pri y = −2x + 4 je presečišče z osjo y (0, 4); hitro preveri: y = 2x − 8 seka os y v (0, −8).
trditev: MAT-OS-9/graf-linearne-funkcije#presecisce-y-primeri
besedilo: »Pri $y = -2x + 4$ je to $(0, 4)$.« -/
theorem presecisce_y_primeri : (-2:ℝ) * 0 + 4 = 4 ∧ (2:ℝ) * 0 - 8 = -8 := by norm_num

/-- Pogoste napake (zamenjana k in n): y = 3x + 5 seka os y v (0, 5), ne v (0, 3).
trditev: MAT-OS-9/graf-linearne-funkcije#zamenjana-k-n
besedilo: »Pri $y = 3x + 5$ graf ne seka osi $y$ v $(0, 3)$, ampak v $(0, 5)$.« -/
theorem zamenjana_k_n : (3:ℝ) * 0 + 5 = 5 ∧ (3:ℝ) * 0 + 5 ≠ 3 := by norm_num

/-! ## Razlaga 4: ničla -/

/-- Razlaga 4, Povzetek in Bolj natančno: pri k ≠ 0 je kx + n = 0 ⇔ kx = −n ⇔ x = −n/k.
trditev: MAT-OS-9/graf-linearne-funkcije#nicla
besedilo: »reši $kx + n = 0$, pri $k \ne 0$ je $x = -\dfrac{n}{k}$« -/
theorem nicla (k n x : ℝ) (hk : k ≠ 0) : k * x + n = 0 ↔ x = -n / k := by
  calc k * x + n = 0 ↔ k * x = -n := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = -n / k := by rw [eq_div_iff hk, mul_comm]

/-- Predpostavka `nicla` se da izpolniti (k = −2). -/
example : (-2:ℝ) ≠ 0 := by norm_num

/-- Razlaga 5, Premisli in Bolj natančno: pri k ≠ 0 ima funkcija natanko eno ničlo.
trditev: MAT-OS-9/graf-linearne-funkcije#nicla-enolicna
besedilo: »Če je $k \ne 0$, delimo s $k$ in dobimo natanko eno ničlo $x = -\dfrac{n}{k}$.« -/
theorem nicla_enolicna (k n : ℝ) (hk : k ≠ 0) : ∃! x : ℝ, k * x + n = 0 :=
  ⟨-n / k, (nicla k n _ hk).mpr rfl, fun y hy => (nicla k n y hk).mp hy⟩

/-- Predpostavka `nicla_enolicna` se da izpolniti (k = 1/100, »skoraj vodoravna« premica iz Premisli). -/
example : (1 / 100 : ℝ) ≠ 0 := by norm_num

/-- Razlaga 4: −2x + 4 = 0 ⇔ −2x = −4 ⇔ x = 2; presečišče z osjo x je (2, 0).
trditev: MAT-OS-9/graf-linearne-funkcije#nicla-primer
besedilo: »Pri $y = -2x + 4$ rešimo $-2x + 4 = 0$, torej $-2x = -4$ in $x = 2$.« -/
theorem nicla_primer (x : ℝ) : -2 * x + 4 = 0 ↔ x = 2 := by
  calc -2 * x + 4 = 0 ↔ -2 * x = -4 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 2 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Razlaga 4, hitro preveri: ničla funkcije y = 2x − 8 je x = 4 (edina).
trditev: MAT-OS-9/graf-linearne-funkcije#nicla-2x-8
besedilo: »(Odgovor: $x = 4$.)« -/
theorem nicla_2x_8 (x : ℝ) : 2 * x - 8 = 0 ↔ x = 4 := ⟨fun h => by linarith, fun h => by linarith⟩

/-! ## Razlaga 5: posebni primeri -/

/-- Razlaga 5, Povzetek, Bolj natančno: pri k = 0 in n ≠ 0 ničle ni.
trditev: MAT-OS-9/graf-linearne-funkcije#brez-nicle
besedilo: »Če je $k = 0$ in $n \ne 0$, je $y = n$ pri vsakem $x$. Graf je vodoravna premica, ki osi $x$ nikoli ne doseže: funkcija **nima ničle**.« -/
theorem brez_nicle (n : ℝ) (hn : n ≠ 0) : ∀ x : ℝ, 0 * x + n ≠ 0 := by
  intro x
  simpa using hn

/-- Predpostavka `brez_nicle` se da izpolniti (n = 3). -/
example : (3:ℝ) ≠ 0 := by norm_num

/-- Razlaga 5, Pogoste napake, Preveri se 2: y = 3 nima ničle (tudi x = 3 in x = 0 nista ničli).
trditev: MAT-OS-9/graf-linearne-funkcije#y3-brez-nicle
besedilo: »Število $3$ je vrednost $y$, ne $x$: $y$ je vedno $3$ in nikoli $0$, zato ničle ni.« -/
theorem y3_brez_nicle : (∀ x : ℝ, 0 * x + 3 ≠ 0) ∧ (0:ℝ) * 3 + 3 = 3 ∧ (0:ℝ) * 0 + 3 = 3 := by
  refine ⟨brez_nicle 3 (by norm_num), by norm_num, by norm_num⟩

/-- Razlaga 5, Povzetek, Bolj natančno: pri k = 0 in n = 0 je vsak x ničla.
trditev: MAT-OS-9/graf-linearne-funkcije#vse-nicle
besedilo: »Če je $k = 0$ in $n = 0$, je $y = 0$: graf je kar os $x$ in vsak $x$ je ničla.« -/
theorem vse_nicle (x : ℝ) : 0 * x + 0 = (0:ℝ) := by ring

/-- Razlaga 5, Povzetek: pri n = 0 in k ≠ 0 gre graf skozi izhodišče in edina ničla je 0.
trditev: MAT-OS-9/graf-linearne-funkcije#nicla-izhodisce
besedilo: »Če je $n = 0$ in $k \ne 0$, gre graf skozi izhodišče in ničla je $x = 0$.« -/
theorem nicla_izhodisce (k x : ℝ) (hk : k ≠ 0) : k * 0 + 0 = 0 ∧ (k * x + 0 = 0 ↔ x = 0) := by
  refine ⟨by ring, ?_⟩
  rw [add_zero, mul_eq_zero]
  exact ⟨fun h => h.resolve_left hk, fun h => Or.inr h⟩

/-- Predpostavka `nicla_izhodisce` se da izpolniti (k = 2). -/
example : (2:ℝ) ≠ 0 := by norm_num

/-- Na sliki (simulacija pri k = 0): vodoravna premica y = n doseže os x natanko pri n = 0.
trditev: MAT-OS-9/graf-linearne-funkcije#vodoravna-os-x
besedilo: »os $x$ pa doseže le pri $n = 0$, ko z njo sovpade« -/
theorem vodoravna_os_x (n : ℝ) : (∃ x : ℝ, 0 * x + n = 0) ↔ n = 0 := by
  constructor
  · rintro ⟨x, hx⟩
    simpa using hx
  · intro h
    exact ⟨0, by simp [h]⟩

/-! ## Razlaga 6: graf v besedilni nalogi -/

/-- Razlaga 6: baterija ni negativna natanko za x ≤ 4, zato pri x ≥ 0 rišemo daljico od (0, 60) do (4, 0).
trditev: MAT-OS-9/graf-linearne-funkcije#baterija-daljica
besedilo: »Pri telefonu imajo smisel le časi od $0$ do $4$ ur: prej prenosa še ni, pozneje bi bila baterija negativna.« -/
theorem baterija_daljica (x : ℝ) : 0 ≤ -15 * x + 60 ↔ x ≤ 4 :=
  ⟨fun h => by linarith, fun h => by linarith⟩

/-- Razlaga 6, hitro preveri: pri x = 5 bi bil y = −15 (< 0).
trditev: MAT-OS-9/graf-linearne-funkcije#baterija-x5
besedilo: »Ker bi bil $y = -15$, baterija pa ne more imeti $-15\,\%$.« -/
theorem baterija_x5 : (-15:ℝ) * 5 + 60 = -15 ∧ (-15:ℝ) < 0 := by norm_num

/-! ## Primer 1 -/

/-- Primer 1: pri y = 2x + 1 je k = 2 > 0, zato funkcija narašča.
trditev: MAT-OS-9/graf-linearne-funkcije#primer1-narasca
besedilo: »Ker je $k > 0$, funkcija narašča.« -/
theorem primer1_narasca : StrictMono (fun x : ℝ => 2 * x + 1) := by
  intro a b hab
  show 2 * a + 1 < 2 * b + 1
  linarith

/-- Primer 1: tabela x = 0, 1, 2 ⇒ y = 1, 3, 5; stopnica iz (0, 1): 1 desno, 2 gor ⇒ (1, 1 + 2) = (1, 3).
trditev: MAT-OS-9/graf-linearne-funkcije#primer1-tabela
besedilo: »| $y = 2x + 1$ | $1$ | $3$ | $5$ |« -/
theorem primer1_tabela :
    (2:ℝ) * 0 + 1 = 1 ∧ (2:ℝ) * 1 + 1 = 3 ∧ (2:ℝ) * 2 + 1 = 5 ∧ (1:ℝ) + 2 = 3 := by norm_num

/-! ## Primer 2 -/

/-- Primer 2, korak 1: pri x = 0 je y = 3, presečišče (0, 3).
trditev: MAT-OS-9/graf-linearne-funkcije#primer2-y
besedilo: »pri $x = 0$ je $y = 3$, točka $(0, 3)$« -/
theorem primer2_y : -(1 / 2 : ℝ) * 0 + 3 = 3 := by norm_num

/-- Primer 2, koraka 2 in 3: −½x + 3 = 0 ⇔ −½x = −3 ⇔ x = 6 (pomnožimo z −2); presečišče (6, 0).
trditev: MAT-OS-9/graf-linearne-funkcije#primer2-nicla
besedilo: »Odštejemo $3$: $-\dfrac{1}{2}x = -3$. Pomnožimo z $-2$, da ostane sam $x$: $x = 6$.« -/
theorem primer2_nicla (x : ℝ) : -(1 / 2) * x + 3 = 0 ↔ x = 6 := by
  calc -(1 / 2) * x + 3 = 0 ↔ -(1 / 2) * x = -3 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 6 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Primer 2, korak 4 (preizkus): −½·6 + 3 = −3 + 3 = 0.
trditev: MAT-OS-9/graf-linearne-funkcije#primer2-preizkus
besedilo: »$-\dfrac{1}{2} \cdot 6 + 3 = -3 + 3 = 0$« -/
theorem primer2_preizkus : -(1 / 2 : ℝ) * 6 + 3 = 0 := by
  calc -(1 / 2 : ℝ) * 6 + 3 = -3 + 3 := by norm_num
    _ = 0 := by norm_num

/-- Primer 2, korak 5: k = −½ < 0, zato funkcija pada.
trditev: MAT-OS-9/graf-linearne-funkcije#primer2-pada
besedilo: »Ker je $k = -\dfrac{1}{2} < 0$, funkcija pada.« -/
theorem primer2_pada : StrictAnti (fun x : ℝ => -(1 / 2) * x + 3) := by
  intro a b hab
  show -(1 / 2) * b + 3 < -(1 / 2) * a + 3
  linarith

/-- Povzetek, Pogoste napake: splošno pravilo – pri k > 0 funkcija y = kx + n narašča, pri k < 0 pada.
trditev: MAT-OS-9/graf-linearne-funkcije#negativen-k-pada
besedilo: »Negativen $k$ pomeni padajočo premico.« -/
theorem narasca_pada (k n : ℝ) :
    (0 < k → StrictMono (fun x : ℝ => k * x + n)) ∧ (k < 0 → StrictAnti (fun x : ℝ => k * x + n)) := by
  refine ⟨fun hk a b hab => ?_, fun hk a b hab => ?_⟩
  · show k * a + n < k * b + n
    nlinarith
  · show k * b + n < k * a + n
    nlinarith

/-! ## Primer 3 -/

/-- Primer 3, korak 1: linearna funkcija y = kx + n z višino 60 pri x = 0 in padcem 1,5 m vsako sekundo je
natanko y = −1,5x + 60 (k in n sta s temi podatki enolično določena).
trditev: MAT-OS-9/graf-linearne-funkcije#primer3-predpis
besedilo: »Pri $x = 0$ je višina $60\,\mathrm{m}$, zato $n = 60$. Višina vsako sekundo pade za $1{,}5\,\mathrm{m}$, zato $k = -1{,}5$. Predpis: $y = -1{,}5x + 60$.« -/
theorem primer3_predpis (k n : ℝ) :
    (k * 0 + n = 60 ∧ ∀ x : ℝ, (k * (x + 1) + n) - (k * x + n) = -1.5) ↔ (k = -1.5 ∧ n = 60) := by
  constructor
  · rintro ⟨h0, h1⟩
    have := h1 0
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩
    exact ⟨by norm_num, fun x => by ring⟩

/-- Primer 3, korak 2: −1,5x + 60 = 0 ⇔ −1,5x = −60 ⇔ x = 40 (pristanek po 40 s).
trditev: MAT-OS-9/graf-linearne-funkcije#primer3-nicla
besedilo: »Dobimo $-1{,}5x = -60$ in $x = 40$.« -/
theorem primer3_nicla (x : ℝ) : -1.5 * x + 60 = 0 ↔ x = 40 := by
  calc -1.5 * x + 60 = 0 ↔ -1.5 * x = -60 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 40 := ⟨fun h => by norm_num at h ⊢; linarith, fun h => by norm_num [h]⟩

/-- Primer 3, korak 3: višina ni negativna natanko za x ≤ 40 (daljica od (0, 60) do (40, 0)).
trditev: MAT-OS-9/graf-linearne-funkcije#primer3-daljica
besedilo: »smisel imajo le časi od $0$ do $40\,\mathrm{s}$, zato narišemo daljico od $(0, 60)$ do $(40, 0)$« -/
theorem primer3_daljica (x : ℝ) : 0 ≤ -1.5 * x + 60 ↔ x ≤ 40 :=
  ⟨fun h => by norm_num at h; linarith, fun h => by norm_num; linarith⟩

/-- Primer 3, Premisli: −1,5x + 60 = 15 ⇔ −1,5x = 15 − 60 = −45 ⇔ x = 30 (10 s pred pristankom).
trditev: MAT-OS-9/graf-linearne-funkcije#primer3-15
besedilo: »$-1{,}5x = 15 - 60 = -45$, zato $x = 30$.« -/
theorem primer3_15 (x : ℝ) : -1.5 * x + 60 = 15 ↔ x = 30 := by
  calc -1.5 * x + 60 = 15 ↔ -1.5 * x = 15 - 60 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ -1.5 * x = -45 := by norm_num
    _ ↔ x = 30 := ⟨fun h => by norm_num at h ⊢; linarith, fun h => by norm_num [h]⟩

/-- Primer 3, Premisli (preizkus): −1,5·30 + 60 = −45 + 60 = 15; 40 − 30 = 10.
trditev: MAT-OS-9/graf-linearne-funkcije#primer3-preizkus
besedilo: »po $30\,\mathrm{s}$, $10\,\mathrm{s}$ pred pristankom. Preizkus: $-1{,}5 \cdot 30 + 60 = -45 + 60 = 15$.« -/
theorem primer3_preizkus : (-1.5 : ℝ) * 30 + 60 = 15 ∧ (40:ℝ) - 30 = 10 := by
  refine ⟨?_, by norm_num⟩
  calc (-1.5 : ℝ) * 30 + 60 = -45 + 60 := by norm_num
    _ = 15 := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake (predznak ničle): 2x − 6 = 0 ⇔ 2x = 6 ⇔ x = 3; −6 in −3 nista ničli; preizkus 2·3 − 6 = 0.
trditev: MAT-OS-9/graf-linearne-funkcije#napaka-predznak
besedilo: »Iz enačbe $2x - 6 = 0$ sledi $2x = 6$ in $x = 3$. Popravek: enačbo vedno reši korak za korakom in naredi preizkus: $2 \cdot 3 - 6 = 0$.« -/
theorem napaka_predznak (x : ℝ) :
    (2 * x - 6 = 0 ↔ x = 3) ∧ (2:ℝ) * (-6) - 6 ≠ 0 ∧ (2:ℝ) * (-3) - 6 ≠ 0 ∧ (2:ℝ) * 3 - 6 = 0 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  calc 2 * x - 6 = 0 ↔ 2 * x = 6 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 3 := ⟨fun h => by linarith, fun h => by linarith⟩

/-! ## Na sliki -/

/-- Na sliki: pri k = 1 je ničla −n; če n povečaš za 1, se ničla premakne za 1 v levo.
trditev: MAT-OS-9/graf-linearne-funkcije#slika-premik
besedilo: »Za $1$ v levo, ker je ničla $-n$.« -/
theorem slika_premik (n : ℝ) : -(n + 1) / 1 = -n / 1 - 1 := by ring

/-- Na sliki: pri stalnem n ≠ 0 je ničla bolj strme premice bližje osi y (|k₁| < |k₂|, k₁ ≠ 0 ⇒
|−n/k₂| < |−n/k₁|).
trditev: MAT-OS-9/graf-linearne-funkcije#slika-strmejsa
besedilo: »ničla pa se pri bolj strmi premici približa osi $y$« -/
theorem slika_strmejsa (n k₁ k₂ : ℝ) (hn : n ≠ 0) (hk₁ : k₁ ≠ 0) (hk : |k₁| < |k₂|) :
    |-n / k₂| < |-n / k₁| := by
  have h1 : 0 < |k₁| := abs_pos.mpr hk₁
  have hn' : 0 < |n| := abs_pos.mpr hn
  rw [abs_div, abs_div, abs_neg]
  exact div_lt_div_of_pos_left hn' h1 hk

/-- Predpostavke `slika_strmejsa` se dajo izpolniti (n = 2, k₁ = 1, k₂ = 2). -/
example : (2:ℝ) ≠ 0 ∧ (1:ℝ) ≠ 0 ∧ |(1:ℝ)| < |(2:ℝ)| := by norm_num

/-! ## Bolj natančno -/

/-- Bolj natančno: za vsak par točk grafa z x₁ ≠ x₂ je (y₂ − y₁)/(x₂ − x₁) = k.
trditev: MAT-OS-9/graf-linearne-funkcije#kolicnik
besedilo: »za vsak par točk $(x_1, y_1)$ in $(x_2, y_2)$ na grafu, kjer je $x_2 \ne x_1$, razmerje $\dfrac{y_2 - y_1}{x_2 - x_1}$ enako $k$« -/
theorem kolicnik (k n x₁ x₂ : ℝ) (h : x₁ ≠ x₂) :
    ((k * x₂ + n) - (k * x₁ + n)) / (x₂ - x₁) = k := by
  have hx : x₂ - x₁ ≠ 0 := sub_ne_zero.mpr (Ne.symm h)
  calc ((k * x₂ + n) - (k * x₁ + n)) / (x₂ - x₁) = k * (x₂ - x₁) / (x₂ - x₁) := by ring
    _ = k := mul_div_cancel_right₀ k hx

/-- Predpostavka `kolicnik` se da izpolniti (x₁ = 0, x₂ = 1). -/
example : (0:ℝ) ≠ 1 := by norm_num

/-- Bolj natančno: vsaka nenavpična premica ax + by = c (b ≠ 0) je graf linearne funkcije y = kx + n.
trditev: MAT-OS-9/graf-linearne-funkcije#nenavpicna
besedilo: »Vsaka nenavpična premica je graf neke linearne funkcije.« -/
theorem nenavpicna (a b c : ℝ) (hb : b ≠ 0) :
    ∃ k n : ℝ, ∀ x y : ℝ, a * x + b * y = c ↔ y = k * x + n := by
  refine ⟨-a / b, c / b, fun x y => ?_⟩
  constructor
  · intro h
    field_simp
    linarith
  · intro h
    rw [h]
    field_simp
    ring

/-- Predpostavka `nenavpicna` se da izpolniti (b = 1). -/
example : (1:ℝ) ≠ 0 := by norm_num

/-- Bolj natančno: navpična premica x = 2 ni graf nobene funkcije (ni f, da bi bilo x = 2 ⇔ y = f(x)).
trditev: MAT-OS-9/graf-linearne-funkcije#navpicna-ni-graf
besedilo: »Navpična premica, na primer skozi vse točke z $x = 2$, pa ni graf funkcije« -/
theorem navpicna_ni_graf : ¬ ∃ f : ℝ → ℝ, ∀ x y : ℝ, x = 2 ↔ y = f x := by
  rintro ⟨f, hf⟩
  have h1 := (hf 2 (f 2 + 1)).mp rfl
  linarith

/-! ## Preveri se -/

/-- Preveri se 1: y = 3x − 6 narašča (k = 3 > 0), seka os y v (0, −6), edina ničla je 2 (os x v (2, 0));
−2 ni ničla.
trditev: MAT-OS-9/graf-linearne-funkcije#preveri1
besedilo: »$k = 3 > 0$, zato narašča. Pri $x = 0$ je $y = -6$, ničla pa je rešitev $3x - 6 = 0$, torej $x = 2$.« -/
theorem preveri1 :
    StrictMono (fun x : ℝ => 3 * x - 6) ∧ (3:ℝ) * 0 - 6 = -6 ∧ (∀ x : ℝ, 3 * x - 6 = 0 ↔ x = 2) ∧
      (3:ℝ) * (-2) - 6 ≠ 0 := by
  refine ⟨fun a b hab => ?_, by norm_num, fun x => ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num⟩
  show 3 * a - 6 < 3 * b - 6
  linarith

/-- Preveri se 3: ničla y = 2x + n je 3 natanko pri n = −6; pri n = −3 bi bila ničla 1,5.
trditev: MAT-OS-9/graf-linearne-funkcije#preveri3
besedilo: »Pri $x = 3$ je $y = 0$: iz enačbe $2 \cdot 3 + n = 0$ sledi $n = -6$.« -/
theorem preveri3 (n : ℝ) : (2 * 3 + n = 0 ↔ n = -6) ∧ (∀ x : ℝ, 2 * x + -3 = 0 ↔ x = 1.5) := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, fun x => ⟨fun h => ?_, fun h => ?_⟩⟩
  · norm_num; linarith
  · norm_num [h]

/-- Preveri se 4: −2,4x + 250 = 0 ⇔ x = 250/2,4; to je približno 104 (|250/2,4 − 104| < 1/2), torej
približno 100 s (100 < 250/2,4 < 105); 250·2,4 = 600 (napačen odgovor).
trditev: MAT-OS-9/graf-linearne-funkcije#preveri4
besedilo: »ničla je $x = \dfrac{250}{2{,}4} \approx 104$, torej približno $100\,\mathrm{s}$« -/
theorem preveri4 (x : ℝ) :
    (-2.4 * x + 250 = 0 ↔ x = 250 / 2.4) ∧ |(250:ℝ) / 2.4 - 104| < 1 / 2 ∧
      (100:ℝ) < 250 / 2.4 ∧ (250:ℝ) / 2.4 < 105 ∧ (250:ℝ) * 2.4 = 600 := by
  refine ⟨?_, by norm_num [abs_lt], by norm_num, by norm_num, by norm_num⟩
  rw [eq_div_iff (by norm_num)]
  constructor <;> intro h <;> linarith

/-- Preveri se 5: −40x + 1200 = 0 ⇔ 40x = 1200 ⇔ x = 30; −1200/(−40) = 30; 1200 − 40 = 1160 in
1200·40 = 48 000 (napačna odgovora).
trditev: MAT-OS-9/graf-linearne-funkcije#preveri5
besedilo: »Iz enačbe $-40x + 1200 = 0$ sledi $40x = 1200$ in $x = 30$.« -/
theorem preveri5 (x : ℝ) :
    (-40 * x + 1200 = 0 ↔ x = 30) ∧ -(1200:ℝ) / (-40) = 30 ∧ (1200:ℝ) - 40 = 1160 ∧
      (1200:ℝ) * 40 = 48000 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  calc -40 * x + 1200 = 0 ↔ 40 * x = 1200 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 30 := ⟨fun h => by linarith, fun h => by linarith⟩

end Evklid.Lekcije.MAT_OS_9.GrafLinearneFunkcije
