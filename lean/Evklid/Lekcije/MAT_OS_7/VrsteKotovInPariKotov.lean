/-
vir: content/lessons/MAT-OS-7/vrste-kotov-in-pari-kotov.md
sha256: 3a4885527e019c47cf05749a2f72d75657bd2877cb1675e546dca76e04f46ee7
Model: geometrijske trditve so v evklidskem prostoru `P` (oz. v realnem prostoru s skalarnim produktom `V`) z
Mathlibovim neorientiranim kotom `∠` (v radianih, med 0 in π; π = 180°). Točke A, O, C ležijo na premici z O med
njima natanko tedaj, ko je ∠ A O C = π (iztegnjeni kot). Sokota sta ∠ A O B in ∠ B O C pri ∠ A O C = π; sovršna
kota sta ∠ A O B in ∠ C O D pri ∠ A O C = π in ∠ B O D = π (dve premici skozi O). Kota z vzporednimi kraki sta kota
med smernima vektorjema x, y krakov in med r • x, s • y (r, s ≠ 0; r > 0 pomeni »v isto smer«, r < 0 »v nasprotno
smer«). Splošno pravilo »iste vrste / različnih vrst« je dokazano za poljuben iztegnjeni kot S (S = π v radianih,
S = 180 v stopinjah), računski primeri so v stopinjah kot števila.
Ni v Leanu: zgodba (kartografinja, Gozdna cesta, Lipova ulica) kot opis, dokazani so njeni računi; definicije
(kot, teme, krak, vrste kotov iz tabele, sokota, sovršna, komplementarna kota) kot poimenovanja; udrti in polni kot
(Mathlibov kot je med 0 in π, zato kotov nad 180° ni mogoče zapisati s `∠`; dokazana je le vsota 360° štirih kotov ob
presečišču); simulacija »Pari kotov ob premicah« in analogije (pica, škarje, geotrikotnik) kot slike: dokazana so
pravila, ki jih ponazarjajo (sokota, sovršna kota, premik in obrat kraka); »zveza se bere s slike« (Pogoste
napake 5, navodilo); »strog dokaz uporablja kote ob vzporednicah« (napoved); razlage napačnih odgovorov v kvizih
(dokazano je, da napačne vrednosti niso pravilne); da sta v Primeru 3 in na Lipovi ulici kota z vzporednimi kraki
(podatek naloge; dokazano je pravilo za kote z vzporednimi kraki in iz njega rezultat).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.VrsteKotovInPariKotov

open Real EuclideanGeometry

variable {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P] [NormedAddTorsor V P]

/-! ## Sokota, sovršna kota, poln obrat (geometrijsko) -/

/-- Razlaga (Sokota), Povzetek 2, Primer 1 (formula): če kraka OA in OC tvorita premico (∠ A O C = π), sta kota
∠ A O B in ∠ B O C sokota: α + β = π (180°).
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#sokota
besedilo: »Takemu paru rečemo **sokota**. Skupaj tvorita iztegnjeni kot: $$\alpha + \beta = 180^\circ$$« -/
theorem sokota {A B C O : P} (h : ∠ A O C = π) : ∠ A O B + ∠ B O C = π := by
  have := EuclideanGeometry.angle_add_angle_eq_pi_of_angle_eq_pi B h
  rw [angle_comm B O A] at this
  exact this

/-- Razlaga (Sovršna kota), Povzetek 3, Preveri se 1, analogija s škarjami: ob presečišču dveh premic AC in BD
(O med A in C ter med B in D) sta nasprotna kota enaka: ∠ A O B = ∠ C O D in ∠ B O C = ∠ D O A.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#sovrsna
besedilo: »V primeru smo videli, zakaj sta enaka: oba sta sokota istega kota $\beta$, zato oba merita $180^\circ - \beta$. Velja: $$\alpha = \gamma \qquad \beta = \delta$$« -/
theorem sovrsna {A B C D O : P} (h1 : ∠ A O C = π) (h2 : ∠ B O D = π) :
    ∠ A O B = ∠ C O D ∧ ∠ B O C = ∠ D O A := by
  refine ⟨EuclideanGeometry.angle_eq_angle_of_angle_eq_pi_of_angle_eq_pi h1 h2, ?_⟩
  have := EuclideanGeometry.angle_eq_angle_of_angle_eq_pi_of_angle_eq_pi h2 (by rwa [angle_comm] at h1)
  exact this

/-- Razlaga (Sovršna kota: »vsak kot je sokot obeh sosedov«), Povzetek 6: štirje koti ob presečišču dveh premic
dajo skupaj 2π (360°), in vsak je sokot obeh sosedov.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#poln-obrat
besedilo: »Štirje koti ob presečišču dveh premic dajo skupaj $360^\circ$.« -/
theorem poln_obrat {A B C D O : P} (h1 : ∠ A O C = π) (h2 : ∠ B O D = π) :
    ∠ A O B + ∠ B O C = π ∧ ∠ B O C + ∠ C O D = π ∧ ∠ C O D + ∠ D O A = π ∧ ∠ D O A + ∠ A O B = π ∧
      ∠ A O B + ∠ B O C + ∠ C O D + ∠ D O A = 2 * π := by
  have s1 := sokota (B := B) h1
  have s2 := sokota (B := C) h2
  have s3 := sokota (B := D) (by rwa [angle_comm] at h1 : ∠ C O A = π)
  have s4 := sokota (B := A) (by rwa [angle_comm] at h2 : ∠ D O B = π)
  refine ⟨s1, s2, s3, s4, by linarith⟩

/-- Pomožno za `example`-e: v ℂ je ∠ 1 0 (−1) = π in ∠ i 0 (−i) = π (dve premici skozi 0).
pomozno – priča (dve premici skozi 0 v ℂ) za primere izpolnljivosti -/
theorem dve_premici : ∠ (1 : ℂ) 0 (-1) = π ∧ ∠ Complex.I 0 (-Complex.I) = π := by
  simp only [EuclideanGeometry.angle, vsub_eq_sub, sub_zero]
  exact ⟨InnerProductGeometry.angle_self_neg_of_ne_zero one_ne_zero,
    InnerProductGeometry.angle_self_neg_of_ne_zero Complex.I_ne_zero⟩

/-- Predpostavka trditve `sokota` se da izpolniti: izrek, uporabljen na primeru (A = 1, B = i, C = −1, O = 0 v ℂ). -/
example := sokota (B := Complex.I) dve_premici.1

/-- Predpostavke trditve `sovrsna` se dajo izpolniti: izrek, uporabljen na primeru (A = 1, B = i, C = −1, D = −i,
O = 0 v ℂ). -/
example := sovrsna dve_premici.1 dve_premici.2

/-- Predpostavke trditve `poln_obrat` se dajo izpolniti: izrek, uporabljen na primeru (A = 1, B = i, C = −1, D = −i,
O = 0 v ℂ). -/
example := poln_obrat dve_premici.1 dve_premici.2

/-! ## Kota z vzporednimi kraki (vektorsko) -/

/-- Bolj natančno (vzporedni kraki): če oba kraka kažeta v isto smer (r, s > 0), sta kota enaka; Lipova ulica in
premisli 3: premik kota (kraki ostanejo vzporedni) ne spremeni kota.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#kraki-ista-smer
besedilo: »oba kraka kažeta v isto smer ali oba v nasprotno smer: kota sta enaka;« -/
theorem kraki_ista_smer (x y : V) {r s : ℝ} (hr : 0 < r) (hs : 0 < s) :
    InnerProductGeometry.angle (r • x) (s • y) = InnerProductGeometry.angle x y := by
  rw [InnerProductGeometry.angle_smul_left_of_pos _ _ hr, InnerProductGeometry.angle_smul_right_of_pos _ _ hs]

/-- Predpostavke trditve `kraki_ista_smer` se dajo izpolniti: izrek, uporabljen na primeru (r = s = 1). -/
example := kraki_ista_smer (1 : ℂ) 1 (r := 1) (s := 1) one_pos one_pos

/-- Bolj natančno: če oba kraka kažeta v nasprotno smer (r, s < 0), sta kota enaka (sovršna kota sta poseben
primer, r = s = −1).
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#kraki-obe-nasprotni
besedilo: »Sovršna kota sta poseben primer: oba kraka kažeta v nasprotno smer, zato sta enaka.« -/
theorem kraki_obe_nasprotni (x y : V) {r s : ℝ} (hr : r < 0) (hs : s < 0) :
    InnerProductGeometry.angle (r • x) (s • y) = InnerProductGeometry.angle x y := by
  rw [InnerProductGeometry.angle_smul_left_of_neg _ _ hr, InnerProductGeometry.angle_smul_right_of_neg _ _ hs,
    InnerProductGeometry.angle_neg_neg]

/-- Predpostavke trditve `kraki_obe_nasprotni` se dajo izpolniti: izrek, uporabljen na primeru (r = s = −1). -/
example := kraki_obe_nasprotni (1 : ℂ) 1 (r := -1) (s := -1) (by norm_num) (by norm_num)

/-- Bolj natančno, analogija z geotrikotnikom: če en krak kaže v isto, drugi v nasprotno smer, kota skupaj merita π
(180°).
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#kraki-ena-nasprotna
besedilo: »en krak kaže v isto, drugi v nasprotno smer: kota skupaj merita $180^\circ$, $\alpha + \beta = 180^\circ$.« -/
theorem kraki_ena_nasprotna (x y : V) {r s : ℝ} (hr : 0 < r) (hs : s < 0) :
    InnerProductGeometry.angle (r • x) (s • y) + InnerProductGeometry.angle x y = π := by
  rw [InnerProductGeometry.angle_smul_left_of_pos _ _ hr, InnerProductGeometry.angle_smul_right_of_neg _ _ hs,
    InnerProductGeometry.angle_neg_right]
  ring

/-- Predpostavke trditve `kraki_ena_nasprotna` se dajo izpolniti: izrek, uporabljen na primeru (r = 1, s = −1). -/
example := kraki_ena_nasprotna (1 : ℂ) 1 (r := 1) (s := -1) (by norm_num) (by norm_num)

/-- Bolj natančno (druga različica: nasprotna je prva smer): kota skupaj merita π.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#kraki-ena-nasprotna-2
besedilo: »en krak kaže v isto, drugi v nasprotno smer: kota skupaj merita $180^\circ$, $\alpha + \beta = 180^\circ$.« -/
theorem kraki_ena_nasprotna' (x y : V) {r s : ℝ} (hr : r < 0) (hs : 0 < s) :
    InnerProductGeometry.angle (r • x) (s • y) + InnerProductGeometry.angle x y = π := by
  rw [InnerProductGeometry.angle_smul_left_of_neg _ _ hr, InnerProductGeometry.angle_smul_right_of_pos _ _ hs,
    InnerProductGeometry.angle_neg_left]
  ring

/-- Predpostavke trditve `kraki_ena_nasprotna'` se dajo izpolniti: izrek, uporabljen na primeru (r = −1, s = 1). -/
example := kraki_ena_nasprotna' (1 : ℂ) 1 (r := -1) (s := 1) (by norm_num) (by norm_num)

/-- Kota z vzporednimi kraki (r, s ≠ 0) sta vedno enaka ali skupaj merita π.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#vzporedni-kraki
besedilo: »Za taka kota velja: - če sta oba ostra ali oba topa, sta **enaka**; - če je eden ostri in drugi topi, je njuna vsota $180^\circ$.« -/
theorem vzporedni_kraki (x y : V) {r s : ℝ} (hr : r ≠ 0) (hs : s ≠ 0) :
    InnerProductGeometry.angle (r • x) (s • y) = InnerProductGeometry.angle x y ∨
      InnerProductGeometry.angle (r • x) (s • y) = π - InnerProductGeometry.angle x y := by
  rcases hr.lt_or_gt with hr | hr <;> rcases hs.lt_or_gt with hs | hs
  · exact Or.inl (kraki_obe_nasprotni x y hr hs)
  · exact Or.inr (by linarith [kraki_ena_nasprotna' x y hr hs])
  · exact Or.inr (by linarith [kraki_ena_nasprotna x y hr hs])
  · exact Or.inl (kraki_ista_smer x y hr hs)

/-- Predpostavke trditve `vzporedni_kraki` se dajo izpolniti: izrek, uporabljen na primeru (r = 2, s = −3). -/
example := vzporedni_kraki (1 : ℂ) 1 (r := 2) (s := -3) (by norm_num) (by norm_num)

/-- Razlaga (Kota z vzporednimi kraki), Povzetek 4, Bolj natančno (krajša oblika): kota φ, θ, ki sta enaka ali se
dopolnjujeta do iztegnjenega kota S (φ = θ ali φ = S − θ, kot pri vzporednih krakih), sta enaka, če sta iste vrste
(oba ostra: < S/2, ali oba topa: med S/2 in S), in skupaj merita S, če je eden ostri in drugi topi; pri pravem kotu
(θ = S/2) veljata obe zvezi hkrati.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#vrste
besedilo: »**Kota z vzporednimi kraki**: oba ostra ali oba topa, potem sta enaka. En ostri in en topi, potem je $\alpha + \beta = 180^\circ$.« -/
theorem vrste (S θ φ : ℝ) (h : φ = θ ∨ φ = S - θ) :
    (((θ < S / 2 ∧ φ < S / 2) ∨ (S / 2 < θ ∧ S / 2 < φ)) → φ = θ) ∧
      (((θ < S / 2 ∧ S / 2 < φ) ∨ (S / 2 < θ ∧ φ < S / 2)) → θ + φ = S) ∧
      (θ = S / 2 → φ = θ ∧ θ + φ = S) := by
  refine ⟨fun h' => ?_, fun h' => ?_, fun h' => ?_⟩
  · rcases h with h | h
    · exact h
    · rcases h' with ⟨a, b⟩ | ⟨a, b⟩ <;> linarith
  · rcases h with h | h
    · rcases h' with ⟨a, b⟩ | ⟨a, b⟩ <;> linarith
    · linarith
  · rcases h with h | h <;> constructor <;> linarith

/-- Predpostavka trditve `vrste` se da izpolniti: izrek, uporabljen na primeru (S = 180, θ = 70, φ = 110). -/
example := (vrste 180 70 110 (Or.inr (by norm_num))).2.1 (Or.inl ⟨by norm_num, by norm_num⟩)

/-- Predpostavke trditve `vrste` se dajo izpolniti: izrek, uporabljen na primeru (oba ostra, θ = φ = 65). -/
example := (vrste 180 65 65 (Or.inl rfl)).1 (Or.inl ⟨by norm_num, by norm_num⟩)

/-- Predpostavke trditve `vrste` se dajo izpolniti: izrek, uporabljen na primeru (prava kota, θ = φ = 90). -/
example := (vrste 180 90 90 (Or.inl rfl)).2.2 (by norm_num)

/-- Premisli 3 (Lipova ulica še dlje od proge): premik kota (vseh treh točk za isti vektor v) kota ne spremeni.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#premik
besedilo: »Nič se ne spremeni. Kraki ostanejo vzporedni s kraki kotov ob progi, razdalja med križiščema pa na velikost kota ne vpliva.« -/
theorem premik (A O B v : V) : ∠ (A + v) (O + v) (B + v) = ∠ A O B := by
  simp only [EuclideanGeometry.angle, vsub_eq_sub, add_sub_add_right_eq_sub]

/-! ## Vrste kotov in pravila v stopinjah -/

/-- Premisli 1: dva topa kota (90° < α, β) skupaj merita več kot 180°, zato topi kot nima topega sokota; sokot topega
kota (90° < α < 180°) je ostri, sokot pravega je pravi.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#sokot-topega
besedilo: »Dva topa kota sta skupaj več kot $180^\circ$. Sokot topega kota je vedno ostri, sokot pravega kota pa je spet pravi kot.« -/
theorem sokot_topega (α β : ℝ) :
    (90 < α → 90 < β → 180 < α + β) ∧ (90 < α → α < 180 → 0 < 180 - α ∧ 180 - α < 90) ∧
      (180 : ℝ) - 90 = 90 := by
  refine ⟨fun h1 h2 => by linarith, fun h1 h2 => ⟨by linarith, by linarith⟩, by norm_num⟩

/-- Predpostavke trditve `sokot_topega` se dajo izpolniti: izrek, uporabljen na primeru (α = 100, β = 120). -/
example := (sokot_topega 100 120).1 (by norm_num) (by norm_num)

/-- Predpostavke trditve `sokot_topega` se dajo izpolniti: izrek, uporabljen na primeru (topi α = 115). -/
example := (sokot_topega 115 0).2.1 (by norm_num) (by norm_num)

/-- Bolj natančno (zakaj sta sovršna kota enaka): iz α + β = 180° in β + γ = 180° sledi α = γ.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#sovrsna-iz-sokotov
besedilo: »Obe vsoti sta enaki, zato je $\alpha + \beta = \beta + \gamma$. Na obeh straneh odštejemo $\beta$ in dobimo $\alpha = \gamma$.« -/
theorem sovrsna_iz_sokotov (α β γ : ℝ) (h1 : α + β = 180) (h2 : β + γ = 180) : α = γ := by
  have : α + β = β + γ := by rw [h1, h2]
  linarith

/-- Predpostavke trditve `sovrsna_iz_sokotov` se dajo izpolniti: izrek, uporabljen na primeru (α = γ = 65, β = 115). -/
example := sovrsna_iz_sokotov 65 115 65 (by norm_num) (by norm_num)

/-- Razlaga (zgled ob križišču): iz α = 65° in sokotov po vrsti (α + β = β + γ = γ + δ = 180°) dobimo natanko
β = 180° − 65° = 115°, γ = 180° − 115° = 65°, δ = 180° − 65° = 115°; vsota je 360°; dva kota sta ostra (65° < 90°),
dva topa (90° < 115° < 180°).
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#krizisce
besedilo: »Zato je $\beta = 180^\circ - 65^\circ = 115^\circ$. - Kot $\gamma$ spodaj levo leži ob $\beta$ na isti strani ceste. Zato je $\gamma = 180^\circ - 115^\circ = 65^\circ$.« -/
theorem krizisce (β γ δ : ℝ) :
    (65 + β = 180 ∧ β + γ = 180 ∧ γ + δ = 180) ↔ (β = 115 ∧ γ = 65 ∧ δ = 115) := by
  constructor
  · rintro ⟨h1, h2, h3⟩
    refine ⟨by linarith, by linarith, by linarith⟩
  · rintro ⟨rfl, rfl, rfl⟩
    norm_num

/-- Razlaga (zgled): koraki 180 − 65 = 115, 180 − 115 = 65, 180 − 65 = 115, vsota 65 + 115 + 65 + 115 = 360,
vrste 65 < 90 < 115 < 180.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#krizisce-racun
besedilo: »Skupaj dajo $360^\circ$, poln obrat okoli križišča.« -/
theorem krizisce_racun : (180 : ℝ) - 65 = 115 ∧ (180 : ℝ) - 115 = 65 ∧ (65 : ℝ) + 115 + 65 + 115 = 360 ∧
    (65 : ℝ) < 90 ∧ (90 : ℝ) < 115 ∧ (115 : ℝ) < 180 := by norm_num

/-- Razlaga (Lipova ulica): kot φ na drugem križišču ima vzporedne krake s 65° ali s 115° (φ = θ ali φ = 180 − θ);
ostri meri 65°, topi 115°; preostala kota χ, ω na tem križišču sta sokota (ψ + χ = 180°, χ + ω = 180°), zato
χ = 65°, ω = 115°: spet dva kota po 65° in dva po 115°.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#lipova
besedilo: »Zato tudi na drugem križišču nastaneta dva kota po $65^\circ$ in dva po $115^\circ$.« -/
theorem lipova (φ ψ χ ω : ℝ) (h1 : φ = 65 ∨ φ = 180 - 65) (h1' : φ < 90) (h2 : ψ = 65 ∨ ψ = 180 - 65)
    (h2' : 90 < ψ) (h3 : ψ + χ = 180) (h4 : χ + ω = 180) : φ = 65 ∧ ψ = 115 ∧ χ = 65 ∧ ω = 115 := by
  have hφ := (vrste 180 65 φ h1).1 (Or.inl ⟨by norm_num, by linarith⟩)
  have := (vrste 180 65 ψ h2).2.1 (Or.inl ⟨by norm_num, by linarith⟩)
  refine ⟨hφ, by linarith, by linarith, by linarith⟩

/-- Predpostavke trditve `lipova` se dajo izpolniti: izrek, uporabljen na primeru (φ = 65, ψ = 115, χ = 65, ω = 115). -/
example := lipova 65 115 65 115 (Or.inl rfl) (by norm_num) (Or.inr (by norm_num)) (by norm_num) (by norm_num)
    (by norm_num)

/-- Primer 1: sokot kota 112° je natanko 180° − 112° = 68°; 112° je topi, 68° ostri; preizkus 112° + 68° = 180°.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#primer1
besedilo: »Odgovor: drugi kot meri $68^\circ$. Prvi kot je topi, drugi ostri.« -/
theorem primer1 (β : ℝ) : 112 + β = 180 ↔ β = 68 := by
  constructor <;> intro h <;> linarith

/-- Primer 1 (koraki): 180 − 112 = 68, 90 < 112 < 180, 68 < 90, 112 + 68 = 180.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#primer1-racun
besedilo: »Preverimo: $112^\circ + 68^\circ = 180^\circ$.« -/
theorem primer1_racun : (180 : ℝ) - 112 = 68 ∧ (90 : ℝ) < 112 ∧ (112 : ℝ) < 180 ∧ (68 : ℝ) < 90 ∧
    (112 : ℝ) + 68 = 180 := by norm_num

/-- Primer 2: iz α = 54°, γ = α (sovršna), α + β = 180° (sokota) in δ = β (sovršna) sledi natanko γ = 54°,
β = 180° − 54° = 126°, δ = 126°; preizkus 54 + 126 + 54 + 126 = 360.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#primer2
besedilo: »Odgovor: ostali koti merijo $126^\circ$, $54^\circ$ in $126^\circ$.« -/
theorem primer2 (β γ δ : ℝ) : (γ = 54 ∧ 54 + β = 180 ∧ δ = β) ↔ (β = 126 ∧ γ = 54 ∧ δ = 126) := by
  constructor
  · rintro ⟨h1, h2, h3⟩
    refine ⟨by linarith, h1, by linarith⟩
  · rintro ⟨rfl, rfl, rfl⟩
    norm_num

/-- Primer 2 (koraki): 180 − 54 = 126 in 54 + 126 + 54 + 126 = 360.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#primer2-racun
besedilo: »Preverimo poln obrat: $54^\circ + 126^\circ + 54^\circ + 126^\circ = 360^\circ$.« -/
theorem primer2_racun : (180 : ℝ) - 54 = 126 ∧ (54 : ℝ) + 126 + 54 + 126 = 360 := by norm_num

/-- Primer 3: sokota v razmerju 4 : 5 (5α = 4β, α + β = 180°) sta natanko α = 80°, β = 100°.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#primer3
besedilo: »Ostri kot: $\alpha = 4 \cdot 20^\circ = 80^\circ$, topi kot: $\beta = 5 \cdot 20^\circ = 100^\circ$.« -/
theorem primer3 (α β : ℝ) : (α + β = 180 ∧ 5 * α = 4 * β) ↔ (α = 80 ∧ β = 100) := by
  constructor
  · rintro ⟨h1, h2⟩
    refine ⟨by linarith, by linarith⟩
  · rintro ⟨rfl, rfl⟩
    norm_num

/-- Primer 3 (koraki): 4 + 5 = 9 delov, en del 180 : 9 = 20, 4 · 20 = 80, 5 · 20 = 100, 80 + 100 = 180.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#primer3-racun
besedilo: »En del: $180^\circ : 9 = 20^\circ$.« -/
theorem primer3_racun : (4 : ℝ) + 5 = 9 ∧ (180 : ℝ) / 9 = 20 ∧ (4 : ℝ) * 20 = 80 ∧ (5 : ℝ) * 20 = 100 ∧
    (80 : ℝ) + 100 = 180 := by norm_num

/-- Primer 3, korak 4: na drugem križišču je kot φ z vzporednimi kraki (φ = θ ali φ = 180 − θ); če je iste vrste
kot θ = 80° (ostri), je φ = 80°, če je iste vrste kot θ = 100° (topi), je φ = 100°.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#primer3-drugo-krizisce
besedilo: »Odgovor: na drugem križišču sta dva kota po $80^\circ$ in dva po $100^\circ$.« -/
theorem primer3_drugo_krizisce (φ ψ : ℝ) (h1 : φ = 80 ∨ φ = 180 - 80) (h1' : φ < 90)
    (h2 : ψ = 100 ∨ ψ = 180 - 100) (h2' : 90 < ψ) : φ = 80 ∧ ψ = 100 :=
  ⟨(vrste 180 80 φ h1).1 (Or.inl ⟨by norm_num, by linarith⟩),
    (vrste 180 100 ψ h2).1 (Or.inr ⟨by norm_num, by linarith⟩)⟩

/-- Predpostavke trditve `primer3_drugo_krizisce` se dajo izpolniti: izrek, uporabljen na primeru (φ = 80, ψ = 100). -/
example := primer3_drugo_krizisce 80 100 (Or.inl rfl) (by norm_num) (Or.inl rfl) (by norm_num)

/-- Primer 4: kota z vzporednimi kraki, α = 47° (ostri), β topi: različnih vrst, zato α + β = 180° in natanko
β = 180° − 47° = 133°, kar je res topi kot.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#primer4
besedilo: »$\beta = 180^\circ - 47^\circ = 133^\circ$. Rezultat je res topi kot, kar se ujema s podatki.« -/
theorem primer4 (β : ℝ) (h : β = 47 ∨ β = 180 - 47) (hβ : 90 < β) :
    47 + β = 180 ∧ β = 133 ∧ 90 < β ∧ β < 180 := by
  have e := (vrste 180 47 β h).2.1 (Or.inl ⟨by norm_num, by linarith⟩)
  refine ⟨e, by linarith, hβ, by linarith⟩

/-- Predpostavke trditve `primer4` se dajo izpolniti: izrek, uporabljen na primeru (β = 133). -/
example := primer4 133 (Or.inr (by norm_num)) (by norm_num)

/-! ## Pogoste napake -/

/-- Pogoste napake 1–4, Povzetek 5: komplementarni kot kota 50° je 90° − 50° = 40°, sokot pa 180° − 50° = 130°;
sokot kota 123° je 180° − 123° = 57°, ne 360° − 123° = 237°; nasproti 48° leži spet 48°, ne 180° − 48° = 132°;
topi kot z vzporednimi kraki ob ostrem 70° meri 180° − 70° = 110°.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#napake
besedilo: »To je komplementarni kot. Sokota skupaj tvorita premico, zato računaj s $180^\circ$: sokot je $130^\circ$.« -/
theorem napake : (90 : ℝ) - 50 = 40 ∧ (180 : ℝ) - 50 = 130 ∧ (40 : ℝ) ≠ 130 ∧ (360 : ℝ) - 123 = 237 ∧
    (180 : ℝ) - 123 = 57 ∧ (180 : ℝ) - 48 = 132 ∧ (132 : ℝ) ≠ 48 ∧ (180 : ℝ) - 70 = 110 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 2: pri kotu 50° je K = 90 − 50 = 40, V = 50, S = 180 − 50 = 130 in K < V < S.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#kviz2
besedilo: »$K = 40^\circ$, $V = 50^\circ$, $S = 130^\circ$. Zato je $K < V < S$.« -/
theorem kviz2 : (90 : ℝ) - 50 = 40 ∧ (180 : ℝ) - 50 = 130 ∧ (40 : ℝ) < 50 ∧ (50 : ℝ) < 130 := by norm_num

/-- Preveri se 3: sovršni kot V je enak α, sokot S je 180° − α; ko se α poveča za 10° (α' = α + 10), se sovršni kot
poveča za 10° (V' = V + 10), sokot pa zmanjša za 10° (S' = S − 10).
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#kviz3
besedilo: »Sovršni kot je vedno enak $\alpha$. Sokot je $180^\circ - \alpha$, zato se zmanjša za toliko, za kolikor se $\alpha$ poveča.« -/
theorem kviz3 (α α' V S V' S' : ℝ) (hV : V = α) (hS : α + S = 180) (hV' : V' = α') (hS' : α' + S' = 180)
    (h : α' = α + 10) : V' = V + 10 ∧ S' = S - 10 := by
  refine ⟨by rw [hV', hV, h], by linarith⟩

/-- Predpostavke trditve `kviz3` se dajo izpolniti: izrek, uporabljen na primeru (α = 50, α' = 60). -/
example := kviz3 50 60 50 130 60 120 rfl (by norm_num) rfl (by norm_num) (by norm_num)

/-- Preveri se 4: sokot kota 123° je 57° (ne 123 − 90 = 33, ne 360 − 123 = 237, ne 123); topi kot ima ostri sokot.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#kviz4
besedilo: »$180^\circ - 123^\circ = 57^\circ$. Topi kot ima vedno ostri sokot.« -/
theorem kviz4 (β : ℝ) : 123 + β = 180 ↔ β = 57 := by
  constructor <;> intro h <;> linarith

/-- Preveri se 4 (koraki in napačni odgovori): 180 − 123 = 57 < 90, 123 − 90 = 33, 360 − 123 = 237.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#kviz4-racun
besedilo: »To je $360^\circ - 123^\circ$. Sokota tvorita premico, ne polnega obrata.« -/
theorem kviz4_racun : (180 : ℝ) - 123 = 57 ∧ (57 : ℝ) < 90 ∧ (123 : ℝ) - 90 = 33 ∧ (360 : ℝ) - 123 = 237 := by
  norm_num

/-- Preveri se 5: α = 70° in topi β z vzporednimi kraki: β = 180° − 70° = 110° (ne 70, ne 20 = 90 − 70, ne 290 =
360 − 70, ki je udrti, > 180).
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#kviz5
besedilo: »Kota sta različnih vrst, zato je $\alpha + \beta = 180^\circ$ in $\beta = 180^\circ - 70^\circ = 110^\circ$.« -/
theorem kviz5 (β : ℝ) (h : β = 70 ∨ β = 180 - 70) (hβ : 90 < β) : β = 110 := by
  have := (vrste 180 70 β h).2.1 (Or.inl ⟨by norm_num, by linarith⟩)
  linarith

/-- Predpostavke trditve `kviz5` se dajo izpolniti: izrek, uporabljen na primeru (β = 110). -/
example := kviz5 110 (Or.inr (by norm_num)) (by norm_num)

/-- Preveri se 5 (napačni odgovori): 90 − 70 = 20 < 90, 360 − 70 = 290 > 180.
trditev: MAT-OS-7/vrste-kotov-in-pari-kotov#kviz5-racun
besedilo: »To je $360^\circ - 70^\circ$, udrti kot, ne topi.« -/
theorem kviz5_racun : (90 : ℝ) - 70 = 20 ∧ (20 : ℝ) < 90 ∧ (360 : ℝ) - 70 = 290 ∧ (180 : ℝ) < 290 := by norm_num

end Evklid.Lekcije.MAT_OS_7.VrsteKotovInPariKotov
