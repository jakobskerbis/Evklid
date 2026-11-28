/-
vir: content/lessons/MAT-OS-6/krog-in-kroznica.md
sha256: 2ba249fd5fd00006e3beb601862e2db65630b1363d944acda7afc6950f2199c6
Model: ravnina je `EuclideanSpace ℝ (Fin 2)`, |ST| je `dist S T`. Krožnica k(S, r) je `Metric.sphere S r`
(točke z |ST| = r), krog je `Metric.closedBall S r` (|ST| ≤ r), notranjost kroga je `Metric.ball S r` (|ST| < r).
Polmer, tetiva in premer so dane s krajišči: tetiva AB ima A, B na krožnici, premer je tetiva, pri kateri S leži
na daljici AB (`Wbtw ℝ A S B`). Dolžine so realna števila; enote (cm, mm, m) so le v docstringih, 1 cm = 10 mm.
Decimalna števila so točni ulomki v ℝ (2,4 = 24/10).
Lean: polmer v splošnih trditvah ni omejen na r > 0; kjer je potreben obstoj premera, je pogoj 0 ≤ r.
Ni v Leanu: risbe (slika s točkami S, A, B, C, D, E, T; kviz 1 – katera daljica na sliki je tetiva, ki ni premer, je
prepoznavanje na risbi; dokazano je le, da je T na sliki dlje od S kot C, po koordinatah risbe); imena »krožni
lok«, »polmer« in »tetiva« kot imena daljic (definicije; dokazane so njihove lastnosti); risanje s šestilom in
vrstni red korakov v kvizu 3 (navodilo; dokazan je račun 6 : 2 = 3); simulacija »Krog, krožnica in premica«
(tetiva se daljša proti središču – opazovanje, ni dokazano); zgodbe (dermatologinja, optik, EKG, petrijevka,
koza, kolo, ruter, zenica) kot opis, dokazani so njihovi računi; »rez čez sredino razdeli pico na dve enaki
polovici« (ploščina, zahtevno, še ni dokazano); »vrv se povesi« (meja analogije, ni matematična trditev);
»zenica se razširi in zoži« (opis).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.KrogInKroznica

open Metric

/-- Ravnina. -/
abbrev Ravnina := EuclideanSpace ℝ (Fin 2)

/-- Točka (a, 0) na vodoravni osi. -/
noncomputable def tocka (a : ℝ) : Ravnina := EuclideanSpace.single 0 a

/-- Pomožno: razdalja med (a, 0) in (b, 0) je |a − b|.
pomozno – računanje razdalj za primere izpolnljivosti -/
theorem dist_tocka (a b : ℝ) : dist (tocka a) (tocka b) = |a - b| := by
  simp [tocka, Real.dist_eq]

/-- Pomožno: dolžina vektorja (a, 0) je |a|.
pomozno – računanje razdalj za obstoj premera -/
theorem norm_tocka (a : ℝ) : ‖tocka a‖ = |a| := by
  simp [tocka, Real.norm_eq_abs]

/-- Pomožno: (0, 0) leži na daljici med (a, 0) in (−a, 0).
pomozno – priča za premer v primerih izpolnljivosti -/
theorem wbtw_tocka (a : ℝ) : Wbtw ℝ (tocka a) (tocka 0) (tocka (-a)) := by
  have h0 : tocka 0 = 0 := by simp [tocka]
  have hn : tocka (-a) = - tocka a := PiLp.single_neg 2 0
  rw [h0, hn, ← mem_segment_iff_wbtw]
  exact ⟨1 / 2, 1 / 2, by norm_num, by norm_num, by norm_num, by rw [smul_neg, add_neg_cancel]⟩

/-! ## Razlaga -/

/-- Razlaga 2 in Povzetek 1: krog je krožnica skupaj z notranjostjo (točke z |ST| < r in točke z |ST| = r dajo
skupaj krog), krožnica je del kroga, točka znotraj kroga pa ni na krožnici.
trditev: MAT-OS-6/krog-in-kroznica#krog-in-kroznica
besedilo: »Krožnica je samo črta, rob. Če ji dodamo še vse točke znotraj nje, dobimo **krog**, torej ploskev.« -/
theorem krog_in_kroznica (S : Ravnina) (r : ℝ) :
    ball S r ∪ sphere S r = closedBall S r ∧ sphere S r ⊆ closedBall S r ∧
      ∀ T, T ∈ ball S r → T ∉ sphere S r := by
  refine ⟨ball_union_sphere, sphere_subset_closedBall, fun T hT hT' => ?_⟩
  rw [mem_ball] at hT; rw [mem_sphere] at hT'; linarith

example := (krog_in_kroznica 0 1).2.2 0 (by simp)

/-- Pogoste napake 1: točka znotraj kroga ni na krožnici (krožnica je le rob).
trditev: MAT-OS-6/krog-in-kroznica#napaka-1
besedilo: »Točka znotraj kroga ni na krožnici.« -/
theorem napaka1 (S T : Ravnina) (r : ℝ) (hT : dist S T < r) : T ∉ sphere S r := by
  rw [mem_sphere']; exact hT.ne

example := napaka1 (tocka 0) (tocka 0) 1 (by rw [dist_tocka]; norm_num)

/-- Razlaga 3 in Povzetek 2: vsi polmeri iste krožnice so enako dolgi.
trditev: MAT-OS-6/krog-in-kroznica#polmeri-enaki
besedilo: »Vsi polmeri iste krožnice so enako dolgi, kot špice pri kolesu.« -/
theorem polmeri_enaki (S A B : Ravnina) (r : ℝ) (hA : A ∈ sphere S r) (hB : B ∈ sphere S r) :
    dist S A = dist S B := by
  rw [mem_sphere'] at hA hB; rw [hA, hB]

example := polmeri_enaki (tocka 0) (tocka 1) (tocka (-1)) 1 (by rw [mem_sphere', dist_tocka]; norm_num)
  (by rw [mem_sphere', dist_tocka]; norm_num)

/-- Razlaga 5: premer AB sestavljata polmera SA in SB, zato je d = 2r.
trditev: MAT-OS-6/krog-in-kroznica#premer
besedilo: »Na sliki premer $AB$ sestavljata dva polmera, $SA$ in $SB$. Zato je premer dvakrat daljši od polmera:« -/
theorem premer (S A B : Ravnina) (r : ℝ) (hA : A ∈ sphere S r) (hB : B ∈ sphere S r) (hS : Wbtw ℝ A S B) :
    dist A B = 2 * r := by
  rw [← hS.dist_add_dist]
  rw [mem_sphere] at hA; rw [mem_sphere'] at hB
  rw [hA, hB]; ring

example := premer (tocka 0) (tocka 1) (tocka (-1)) 1 (by rw [mem_sphere', dist_tocka]; norm_num)
  (by rw [mem_sphere', dist_tocka]; norm_num) (wbtw_tocka 1)

/-- Razlaga 5, Povzetek 4: d = 2r natanko tedaj, ko je r = d/2.
trditev: MAT-OS-6/krog-in-kroznica#d-in-r
besedilo: »$d = 2r$ in $r = \dfrac{d}{2}$.« -/
theorem d_in_r (d r : ℝ) : d = 2 * r ↔ r = d / 2 := by
  constructor <;> intro h <;> linarith

/-- Razlaga 4 (premisli 1), Povzetek 4, Pogoste napake 3: nobena tetiva ni daljša od 2r; tetiva je dolga 2r natanko
tedaj, ko gre skozi središče (je premer); vsaka druga tetiva je krajša.
trditev: MAT-OS-6/krog-in-kroznica#najdaljsa-tetiva
besedilo: »Ravna daljica $DE$ je najkrajša pot med točkama, zato ni daljša od $r + r$. Enako dolga je le, če gre skozi $S$, torej če je premer.« -/
theorem najdaljsa_tetiva (S D E : Ravnina) (r : ℝ) (hD : D ∈ sphere S r) (hE : E ∈ sphere S r) :
    dist D E ≤ r + r ∧ (dist D E = r + r ↔ Wbtw ℝ D S E) ∧ (¬ Wbtw ℝ D S E → dist D E < r + r) := by
  rw [mem_sphere] at hD; rw [mem_sphere'] at hE
  have tri := dist_triangle D S E
  refine ⟨by rw [hD, hE] at tri; exact tri, ?_, ?_⟩
  · rw [← dist_add_dist_eq_iff, hD, hE, eq_comm]
  · intro h
    have := dist_lt_dist_add_dist_iff.mpr h
    rwa [hD, hE] at this

example := najdaljsa_tetiva (tocka 0) (tocka 1) (tocka (-1)) 1 (by rw [mem_sphere', dist_tocka]; norm_num)
  (by rw [mem_sphere', dist_tocka]; norm_num)

/-- Pogoste napake 3: tetiva, ki ne gre skozi središče, je krajša od premera 2r.
trditev: MAT-OS-6/krog-in-kroznica#napaka-3
besedilo: »Pravilno: premer je le tetiva skozi središče. Vsaka druga tetiva je krajša od premera.« -/
theorem napaka3 (S D E : Ravnina) (r : ℝ) (hD : D ∈ sphere S r) (hE : E ∈ sphere S r) (h : ¬ Wbtw ℝ D S E) :
    dist D E < 2 * r := by
  have := (najdaljsa_tetiva S D E r hD hE).2.2 h
  linarith

example := napaka3 (tocka 0) (tocka 1) (tocka 1) 1 (by rw [mem_sphere', dist_tocka]; norm_num)
  (by rw [mem_sphere', dist_tocka]; norm_num) (by
    rw [wbtw_self_iff]
    intro h
    have := dist_tocka 0 1
    rw [h, dist_self] at this
    norm_num at this)

/-- Pomožno: za 0 ≤ r ima vsaka krožnica premer: točki A = S + (r, 0) in B = S + (−r, 0) sta na krožnici,
S leži na AB in |AB| = 2r. Najdaljša tetiva torej res meri 2r.
pomozno – obstoj premera za »najdaljša tetiva je premer« -/
theorem premer_obstaja (S : Ravnina) (r : ℝ) (hr : 0 ≤ r) :
    ∃ A B : Ravnina, A ∈ sphere S r ∧ B ∈ sphere S r ∧ Wbtw ℝ A S B ∧ dist A B = 2 * r := by
  have hAB : dist (S + tocka r) (S + tocka (-r)) = r + r := by
    rw [dist_eq_norm, add_sub_add_left_eq_sub, ← dist_eq_norm, dist_tocka, abs_of_nonneg (by linarith)]
    ring
  have hA : S + tocka r ∈ sphere S r := by
    rw [mem_sphere, dist_eq_norm, add_sub_cancel_left, norm_tocka, abs_of_nonneg hr]
  have hB : S + tocka (-r) ∈ sphere S r := by
    rw [mem_sphere, dist_eq_norm, add_sub_cancel_left, norm_tocka, abs_neg, abs_of_nonneg hr]
  refine ⟨_, _, hA, hB, ((najdaljsa_tetiva S _ _ r hA hB).2.1).mp hAB, by rw [hAB]; ring⟩

example := premer_obstaja (tocka 0) 1 (by norm_num)

/-- Razlaga 7, tabela in Povzetek 5: lega točke T: |ST| < r natanko tedaj, ko je T v krogu znotraj krožnice;
|ST| = r natanko tedaj, ko je T na krožnici; |ST| > r natanko tedaj, ko je T zunaj kroga.
trditev: MAT-OS-6/krog-in-kroznica#lega-tocke
besedilo: »Točko $T$ primerjamo s krožnico tako, da razdaljo $|ST|$ (dolžino daljice $ST$) primerjamo s polmerom:« -/
theorem lega_tocke (S T : Ravnina) (r : ℝ) :
    (dist S T < r ↔ T ∈ ball S r) ∧ (dist S T = r ↔ T ∈ sphere S r) ∧
      (r < dist S T ↔ T ∉ closedBall S r) := by
  refine ⟨mem_ball'.symm, mem_sphere'.symm, ?_⟩
  rw [mem_closedBall', not_le]

/-- Razlaga 8: k(S, r) je krožnica s središčem S in polmerom r: točka je na njej natanko tedaj, ko je od S
oddaljena za r (npr. r = 3 cm).
trditev: MAT-OS-6/krog-in-kroznica#zapis
besedilo: »Krožnico s središčem $S$ in polmerom $r$ zapišemo $k(S, r)$.« -/
theorem zapis (S T : Ravnina) : T ∈ sphere S 3 ↔ dist S T = 3 := mem_sphere'

/-- Razlaga 7 (slika): po koordinatah risbe (S = (5; 3), C = (7,5; 3), T = (9; 4,6)) je |SC| = 2,5 = r, |ST| pa
večji, zato je T zunaj kroga.
trditev: MAT-OS-6/krog-in-kroznica#slika
besedilo: »Na sliki je $T$ dlje od $S$ kot $C$, zato leži zunaj kroga.« -/
theorem slika : Real.sqrt ((7.5 - 5) ^ 2 + (3 - 3) ^ 2) = 2.5 ∧
    (2.5 : ℝ) < Real.sqrt ((9 - 5) ^ 2 + (4.6 - 3) ^ 2) := by
  constructor
  · rw [show ((7.5 : ℝ) - 5) ^ 2 + (3 - 3) ^ 2 = 2.5 ^ 2 by norm_num]
    exact Real.sqrt_sq (by norm_num)
  · rw [Real.lt_sqrt (by norm_num)]; norm_num

/-- Razlaga 5 (zenica): pri premeru 4 mm je polmer 2 mm.
trditev: MAT-OS-6/krog-in-kroznica#zenica
besedilo: »Pri zenici s premerom $4\,\text{mm}$ je torej polmer $2\,\text{mm}$.« -/
theorem zenica : (4 : ℝ) / 2 = 2 := by norm_num

/-- Premisli 2: šestilo razprto na 4 cm da polmer 4 cm in premer 2 · 4 = 8 cm (dvakrat preveč); pravilno je
4 cm : 2 = 2 cm.
trditev: MAT-OS-6/krog-in-kroznica#premisli-2
besedilo: »Šestilo meri polmer, zato ga razpreš na $4\,\text{cm} : 2 = 2\,\text{cm}$.« -/
theorem premisli2 : (2 : ℝ) * 4 = 8 ∧ (8 : ℝ) = 2 * 4 ∧ (4 : ℝ) / 2 = 2 ∧ (2 : ℝ) * 2 = 4 := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: r = 2,4 cm, d = 2 · 2,4 = 4,8 cm; preizkus 4,8 : 2 = 2,4.
trditev: MAT-OS-6/krog-in-kroznica#primer-1
besedilo: »Odgovor: premer elektrode je $4{,}8\,\text{cm}$.« -/
theorem primer1 : (2 : ℝ) * 2.4 = 4.8 ∧ (4.8 : ℝ) / 2 = 2.4 := by norm_num

/-- Primer 1 (enoličnost): krožnica s polmerom 2,4 ima premer (tetivo skozi S) natanko 4,8.
trditev: MAT-OS-6/krog-in-kroznica#primer-1-premer
besedilo: »Premer sestavljata dva polmera: $d = 2 \cdot 2{,}4\,\text{cm} = 4{,}8\,\text{cm}$.« -/
theorem primer1_premer (S A B : Ravnina) (hA : A ∈ sphere S 2.4) (hB : B ∈ sphere S 2.4)
    (hS : Wbtw ℝ A S B) : dist A B = 4.8 := by
  calc dist A B = 2 * 2.4 := premer S A B 2.4 hA hB hS
    _ = 4.8 := by norm_num

example := primer1_premer (tocka 0) (tocka 2.4) (tocka (-2.4)) (by rw [mem_sphere', dist_tocka]; norm_num)
  (by rw [mem_sphere', dist_tocka]; norm_num) (wbtw_tocka 2.4)

/-- Primer 2, koraki 1, 2 in 4: 9 cm = 90 mm; r = 90 : 2 = 45 mm; preizkus 2 · 45 = 90.
trditev: MAT-OS-6/krog-in-kroznica#primer-2-racun
besedilo: »Polmer je polovica premera: $r = \dfrac{90\,\text{mm}}{2} = 45\,\text{mm}$.« -/
theorem primer2_racun : (9 : ℝ) * 10 = 90 ∧ (90 : ℝ) / 2 = 45 ∧ (2 : ℝ) * 45 = 90 := by norm_num

/-- Primer 2, korak 3 in odgovor: na krožnici s polmerom 45 mm je vsaka tetiva dolga največ 90 mm, in tetiva
dolžine 90 mm (premer) obstaja: najdaljša poteza meri 90 mm.
trditev: MAT-OS-6/krog-in-kroznica#primer-2
besedilo: »Odgovor: polmer petrijevke je $45\,\text{mm}$, najdaljša poteza meri $90\,\text{mm}$.« -/
theorem primer2 (S : Ravnina) :
    (∀ A B : Ravnina, A ∈ sphere S 45 → B ∈ sphere S 45 → dist A B ≤ 90) ∧
      ∃ A B : Ravnina, A ∈ sphere S 45 ∧ B ∈ sphere S 45 ∧ dist A B = 90 := by
  refine ⟨fun A B hA hB => ?_, ?_⟩
  · have := (najdaljsa_tetiva S A B 45 hA hB).1; linarith
  · obtain ⟨A, B, hA, hB, -, h⟩ := premer_obstaja S 45 (by norm_num)
    exact ⟨A, B, hA, hB, by rw [h]; norm_num⟩

example := (primer2 (tocka 0)).1 (tocka 45) (tocka (-45)) (by rw [mem_sphere', dist_tocka]; norm_num)
  (by rw [mem_sphere', dist_tocka]; norm_num)

/-- Primer 3, koraki 1–3 in premisli: d = 2 cm da r = 2 : 2 = 1 cm; pegica A (0,6 cm) je v krogu, B (1 cm) na
krožnici, C (1,3 cm) zunaj kroga.
trditev: MAT-OS-6/krog-in-kroznica#primer-3-pegice
besedilo: »$1{,}3\,\text{cm} > 1\,\text{cm}$, zato je $C$ zunaj kroga in ostane.« -/
theorem primer3_pegice (S A B C : Ravnina) (hA : dist S A = 0.6) (hB : dist S B = 1) (hC : dist S C = 1.3) :
    (2 : ℝ) / 2 = 1 ∧ A ∈ ball S (2 / 2) ∧ B ∈ sphere S (2 / 2) ∧ C ∉ closedBall S (2 / 2) := by
  refine ⟨by norm_num, ?_, ?_, ?_⟩
  · rw [mem_ball', hA]; norm_num
  · rw [mem_sphere', hB]; norm_num
  · rw [mem_closedBall', hC]; norm_num

example := primer3_pegice (tocka 0) (tocka 0.6) (tocka 1) (tocka 1.3) (by rw [dist_tocka]; norm_num)
  (by rw [dist_tocka]; norm_num) (by rw [dist_tocka]; norm_num)

/-- Primer 3, premisli: na krožnici s polmerom 1 cm ni tetive (reza od roba do roba) dolžine 2,2 cm, ker je
najdaljša tetiva premer 2 cm < 2,2 cm.
trditev: MAT-OS-6/krog-in-kroznica#primer-3-rez
besedilo: »Najdaljša tetiva je premer, $2\,\text{cm}$. Ker je $2{,}2\,\text{cm} > 2\,\text{cm}$, takega reza ni.« -/
theorem primer3_rez (S : Ravnina) :
    (2.2 : ℝ) > 2 ∧ ¬ ∃ A B : Ravnina, A ∈ sphere S 1 ∧ B ∈ sphere S 1 ∧ dist A B = 2.2 := by
  refine ⟨by norm_num, ?_⟩
  rintro ⟨A, B, hA, hB, h⟩
  have := (najdaljsa_tetiva S A B 1 hA hB).1
  rw [h] at this; norm_num at this

/-! ## Pogoste napake, Povzetek, Drugače -/

/-- Pogoste napake 2: pri premeru 4 mm je polmer 4 : 2 = 2 mm, ne 8 mm; iz polmera premer z množenjem z 2.
trditev: MAT-OS-6/krog-in-kroznica#napaka-2
besedilo: »Iz premera dobiš polmer z deljenjem z $2$, iz polmera premer z množenjem z $2$.« -/
theorem napaka2 : (4 : ℝ) / 2 = 2 ∧ (4 : ℝ) / 2 ≠ 8 ∧ (2 : ℝ) * 2 = 4 := by norm_num

/-- Pogoste napake 5, kviz 4: premer je dvakratnik polmera; če polmer podvojiš, se podvoji tudi premer; če ga
povečaš za 1 cm, se premer poveča za 2 cm.
trditev: MAT-OS-6/krog-in-kroznica#napaka-5
besedilo: »Če polmer podvojiš, se podvoji tudi premer; če polmer povečaš za $1\,\text{cm}$, se premer poveča za $2\,\text{cm}$.« -/
theorem napaka5 (r : ℝ) : 2 * (2 * r) = 2 * (2 * r) ∧ 2 * (r + 1) = 2 * r + 2 := by
  constructor <;> ring

/-- Kviz 4: nov premer je 2 · 2r = 4r, dvakrat več kot prej 2r; za r > 0 se ne ohrani, ne početveri in ne
poveča le za r.
trditev: MAT-OS-6/krog-in-kroznica#kviz-4
besedilo: »$d = 2r$. Če je nov polmer $2r$, je nov premer $2 \cdot 2r = 4r$, kar je dvakrat več kot prej $2r$.« -/
theorem kviz4 (r : ℝ) (hr : 0 < r) :
    2 * (2 * r) = 4 * r ∧ 4 * r = 2 * (2 * r) ∧ 2 * (2 * r) ≠ 2 * r ∧ 2 * (2 * r) ≠ 4 * (2 * r) ∧
      2 * (2 * r) ≠ 2 * r + r := by
  refine ⟨by ring, by ring, ?_, ?_, ?_⟩ <;> intro h <;> linarith

example := kviz4 1 one_pos

/-- Drugače (iz vsakdanjega življenja, ruter): doseg 15 m; telefon na 12 m je v krogu, na 15 m na robu, na 20 m
zunaj.
trditev: MAT-OS-6/krog-in-kroznica#ruter
besedilo: »To je lega točke glede na krožnico.« -/
theorem ruter (S A B C : Ravnina) (hA : dist S A = 12) (hB : dist S B = 15) (hC : dist S C = 20) :
    A ∈ ball S 15 ∧ B ∈ sphere S 15 ∧ C ∉ closedBall S 15 := by
  refine ⟨?_, ?_, ?_⟩
  · rw [mem_ball', hA]; norm_num
  · rw [mem_sphere', hB]
  · rw [mem_closedBall', hC]; norm_num

example := ruter (tocka 0) (tocka 12) (tocka 15) (tocka 20) (by rw [dist_tocka]; norm_num)
  (by rw [dist_tocka]; norm_num) (by rw [dist_tocka]; norm_num)

/-- Drugače (z analogijo): kozi na istem količku na nasprotnih straneh z napetima vrvema dolžine r sta narazen
2r (premer).
trditev: MAT-OS-6/krog-in-kroznica#koza
besedilo: »Narazen sta za dve dolžini vrvi: to je **premer**, $d = 2r$.« -/
theorem koza (S A B : Ravnina) (r : ℝ) (hA : dist S A = r) (hB : dist S B = r) (hS : Wbtw ℝ A S B) :
    dist A B = 2 * r :=
  premer S A B r (mem_sphere'.mpr hA) (mem_sphere'.mpr hB) hS

example := koza (tocka 0) (tocka 1) (tocka (-1)) 1 (by rw [dist_tocka]; norm_num) (by rw [dist_tocka]; norm_num)
  (wbtw_tocka 1)

/-! ## Preveri se -/

/-- Kviz 2: r = 2,5 cm, d = 2 · 2,5 = 5 cm; napačna 1,25 (razpolovljen polmer) in 2,5 (polmer) nista premer.
trditev: MAT-OS-6/krog-in-kroznica#kviz-2
besedilo: »Razdalja od sredine do roba je polmer: $d = 2r = 2 \cdot 2{,}5\,\text{cm} = 5\,\text{cm}$.« -/
theorem kviz2 : (2 : ℝ) * 2.5 = 5 ∧ (2.5 : ℝ) / 2 = 1.25 ∧ (1.25 : ℝ) ≠ 5 ∧ (2.5 : ℝ) ≠ 5 := by norm_num

/-- Kviz 3: polmer krožnice s premerom 6 cm je 6 : 2 = 3 cm (na toliko razpremo šestilo).
trditev: MAT-OS-6/krog-in-kroznica#kviz-3
besedilo: »Šestilo meri polmer, zato najprej izračunaš polmer.« -/
theorem kviz3 : (6 : ℝ) / 2 = 3 ∧ (2 : ℝ) * 3 = 6 := by norm_num

/-- Kviz 5: najdaljša tetiva je premer 7 cm; polmer 7 : 2 = 3,5 cm; napačna 7 (premer) in 14 (podvojen premer).
trditev: MAT-OS-6/krog-in-kroznica#kviz-5
besedilo: »Rob je od središča oddaljen za polmer: $r = \dfrac{7\,\text{cm}}{2} = 3{,}5\,\text{cm}$.« -/
theorem kviz5 : (7 : ℝ) / 2 = 3.5 ∧ (2 : ℝ) * 7 = 14 ∧ (7 : ℝ) ≠ 3.5 ∧ (14 : ℝ) ≠ 3.5 := by norm_num

/-- Kviz 5 (enoličnost): če je najdaljša tetiva krožnice s polmerom r (0 ≤ r) dolga 7, je r = 3,5.
trditev: MAT-OS-6/krog-in-kroznica#kviz-5-enolicnost
besedilo: »Najdaljša tetiva je premer, $d = 7\,\text{cm}$.« -/
theorem kviz5_enolicnost (S : Ravnina) (r : ℝ) (hr : 0 ≤ r)
    (h7 : ∀ A B : Ravnina, A ∈ sphere S r → B ∈ sphere S r → dist A B ≤ 7)
    (hm : ∃ A B : Ravnina, A ∈ sphere S r ∧ B ∈ sphere S r ∧ dist A B = 7) : r = 3.5 := by
  obtain ⟨A, B, hA, hB, -, hAB⟩ := premer_obstaja S r hr
  obtain ⟨C, D, hC, hD, hCD⟩ := hm
  have h1 := h7 A B hA hB
  have h2 := (najdaljsa_tetiva S C D r hC hD).1
  norm_num; linarith

example := kviz5_enolicnost (tocka 0) 3.5 (by norm_num)
  (fun A B hA hB => by have := (najdaljsa_tetiva _ A B 3.5 hA hB).1; norm_num at this ⊢; linarith)
  (by
    obtain ⟨A, B, hA, hB, -, h⟩ := premer_obstaja (tocka 0) 3.5 (by norm_num)
    exact ⟨A, B, hA, hB, by rw [h]; norm_num⟩)

/-- RACUN: 2 · 2,4 = 4,8; 90/2 = 45; 2 · 45 = 90; 2/2 = 1; 4/2 = 2; 2 · 4 = 8; 2 · 2,5 = 5; 6/2 = 3;
7/2 = 3,5; 9 cm = 90 mm.
pomozno – vrstice bloka RACUN, ki ni vidno besedilo -/
theorem racun : (2 : ℝ) * 2.4 = 4.8 ∧ (90 : ℝ) / 2 = 45 ∧ (2 : ℝ) * 45 = 90 ∧ (2 : ℝ) / 2 = 1 ∧
    (4 : ℝ) / 2 = 2 ∧ (2 : ℝ) * 4 = 8 ∧ (2 : ℝ) * 2.5 = 5 ∧ (6 : ℝ) / 2 = 3 ∧ (7 : ℝ) / 2 = 3.5 ∧
    (9 : ℝ) * 10 = 90 := by norm_num

end Evklid.Lekcije.MAT_OS_6.KrogInKroznica
