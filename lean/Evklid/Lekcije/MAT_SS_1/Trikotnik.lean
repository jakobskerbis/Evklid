/-
vir: content/lessons/MAT-SS-1/trikotnik.md
sha256: 00f1f2be70281f7c0b93f3e1ec5479a00de351e15db8a0e0b430f7820552e6d3
Model: točke so v evklidskem prostoru `P` (ali v vektorskem prostoru `V`, kjer je trditev vektorska), konkretni
trikotniki pa v ravnini ℂ (z = x + yi). Koti `∠` so neorientirani in v radianih (θ° = θ·π/180); stopinjske račune
(Primeri, Naloga 1) dokazujemo s stopinjami kot števili. Skladnost je Mathlibova `≅` (enake vse razdalje med
istoležnimi oglišči), istoležni koti sledijo iz `angle_eq_of_congruent`. »Trikotnik« (nedegeneriran) je
`¬ Collinear ℝ {A, B, C}`. Simetrala stranice je `AffineSubspace.perpBisector`, višina iz A je množica X z
⟪X − A, B − C⟫ = 0, težišče je (A + B + C)/3. »≈ a« na k decimalk je |vrednost − a| < ½·10⁻ᵏ.
Ni v Leanu: zgodba (oddajniki, stojala, okno), risbe in simulaciji (»Značilne točke trikotnika«, »Trikotnik:
stranice in koti«); oznake, definicije in poimenovanja (obseg, polobseg, n-kotnik, diagonala, konveksnost,
pravilni večkotnik) kot opis; razlaga »zakaj« vsote kotov z vzporednico (dokazana je vsota kotov sama, Mathlibov
dokaz); v Primeru 2 vrednost β ≈ 85° je podatek lekcije (preverjanje iz a, b, γ s kosinusnim izrekom: zahtevno, še
ni dokazano), dokazano je SKS, ujemanje oglišč, δ = β, φ = α in 180 − 50 − 85 = 45; da SsK s kotom nasproti krajše
stranice ne zadošča (dva neskladna trikotnika; zahtevno, še ni dokazano); presečišče simetral kotov v središču I
včrtane krožnice in obstoj višinske točke (zahtevno, še ni dokazano; dokazano je, da točka na dveh višinah leži na
tretji, in da simetrale stranic gredo skozi eno točko, ki obstaja); lega O in V glede na vrsto trikotnika in
kviz 4 (zahtevno, še ni dokazano; dokazano je, da je pri pravokotnem O na sredini hipotenuze in V v oglišču pravega
kota, in za Nalogo 2, da je O zunaj); »T in I sta vedno znotraj« (zahtevno, še ni dokazano); razrez trikotnika na
tri trikotnike z višino r pri S = r·s (dokazana je le algebra a·r/2 + b·r/2 + c·r/2 = r·s); vsota notranjih kotov
n-kotnika (n − 2)·180° in razrez na n − 2 trikotnikov (dokazano le za trikotnik; za n-kotnik je dokazana algebra
zunanjih kotov in formul); štetje »iz vsakega oglišča n − 3 diagonal« (dokazana je enakost C(n,2) − n = n(n − 3)/2);
»višina in težiščnica sovpadata le v enakokrakem« (opis; dokazano za Nalogo 2); Naloga 2 b) korak 4–5, pot s primerjavo
stranic in SSS (|AD| > |DC| ⇒ ∠ACD > 45°, ADC ≅ BDC ⇒ γ = 2∠ACD) je opis; topost γ je dokazana drugače, s
⟪A − C, B − C⟫ < 0 (`naloga2_top`); Pogoste napake, Postopek, Pazi na,
Iz vsakdanjega življenja (razen SSS, dokazano), točkovanje in razlage v kvizih (opis; dokazani so pravilni odgovori).
Lean: √ negativnega je 0, x/0 = 0 (formule z deljenjem imajo pozitivne podatke).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.Trikotnik

open Real EuclideanGeometry
open scoped Congruent

variable {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P] [NormedAddTorsor V P]

/-- Pomožno: razdalja v ℂ iz koordinat.
pomozno – orodje (razdalja v ℂ iz koordinat) -/
theorem dist_c {z w : ℂ} {d : ℝ} (hd : 0 ≤ d) (h : (z.re - w.re) ^ 2 + (z.im - w.im) ^ 2 = d ^ 2) :
    dist z w = d := by
  rw [Complex.dist_eq_re_im, h, Real.sqrt_sq hd]

/-- Predpostavke trditve `dist_c` se dajo izpolniti (z = 3, w = 0, d = 3). -/
example : (0 : ℝ) ≤ 3 ∧ ((3 : ℂ).re - (0 : ℂ).re) ^ 2 + ((3 : ℂ).im - (0 : ℂ).im) ^ 2 = 3 ^ 2 := by
  constructor <;> simp

/-- Pomožno: kvadrat razdalje v ℂ iz koordinat.
pomozno – orodje (kvadrat razdalje v ℂ) -/
theorem dist_c_sq (z w : ℂ) : dist z w ^ 2 = (z.re - w.re) ^ 2 + (z.im - w.im) ^ 2 := by
  rw [Complex.dist_eq_re_im, Real.sq_sqrt (by positivity)]

/-- Pomožno: trikotnik 0, 1, i v ℂ ni izrojen (kot pri 0 je pravi).
pomozno – orodje za primere izpolnljivosti (trikotnik 0, 1, i ni izrojen) -/
theorem nekolinearni : ¬ Collinear ℝ ({(0 : ℂ), 1, Complex.I} : Set ℂ) := by
  have hang : ∠ (1 : ℂ) 0 Complex.I = π / 2 := by
    rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [Complex.inner]
  intro hc
  have hc' : Collinear ℝ ({(1 : ℂ), 0, Complex.I} : Set ℂ) := by rwa [Set.insert_comm]
  rcases collinear_iff_eq_or_eq_or_angle_eq_zero_or_angle_eq_pi.mp hc' with h | h | h | h
  · exact one_ne_zero h
  · exact Complex.I_ne_zero h
  · rw [hang] at h; linarith [pi_pos]
  · rw [hang] at h; linarith [pi_pos]

/-- Pomožno: nekolinearnost ni odvisna od vrstnega reda točk.
pomozno – orodje (nekolinearnost ni odvisna od vrstnega reda) -/
theorem nk {A B C X Y Z : P} (h : ¬ Collinear ℝ ({A, B, C} : Set P))
    (e : ({X, Y, Z} : Set P) = {A, B, C}) : ¬ Collinear ℝ ({X, Y, Z} : Set P) := e ▸ h

/-- Predpostavki trditve `nk` se dajo izpolniti (nekolinearni 0, 1, i in ista množica). -/
example : ¬ Collinear ℝ ({(0 : ℂ), 1, Complex.I} : Set ℂ) ∧
    ({(0 : ℂ), 1, Complex.I} : Set ℂ) = {(0 : ℂ), 1, Complex.I} := ⟨nekolinearni, rfl⟩

/-! ## 2. Koti v trikotniku -/

/-- Razlaga 2, Povzetek, Ustno vprašanje 1: vsota notranjih kotov trikotnika je π (180°).
trditev: MAT-SS-1/trikotnik#vsota-kotov
besedilo: »Vsota notranjih kotov je vedno $180^\circ$« -/
theorem vsota_kotov {A B C : P} (h : B ≠ A) : ∠ C A B + ∠ A B C + ∠ B C A = π := by
  have := EuclideanGeometry.angle_add_angle_add_angle_eq_pi C h
  linarith

/-- Predpostavka trditve `vsota_kotov` se da izpolniti (B = 1 ≠ A = 0 v ℂ). -/
example : (1 : ℂ) ≠ 0 := one_ne_zero

/-- Razlaga 2 in Ustno vprašanje 1 (zunanji kot): če je D na podaljšku stranice BC čez C (C strogo med B in D),
je zunanji kot ∠ACD = π − γ in enak vsoti nenaležnih notranjih kotov α + β.
trditev: MAT-SS-1/trikotnik#zunanji-kot
besedilo: »**Zunanji kot** pri oglišču je sokot notranjega kota, na primer $\gamma' = 180^\circ - \gamma$. Velja: **zunanji kot je enak vsoti obeh nenaležnih notranjih kotov** (kotov pri drugih dveh ogliščih), torej $\gamma' = \alpha + \beta$.« -/
theorem zunanji_kot {A B C D : P} (h : Sbtw ℝ B C D) :
    ∠ A C D = π - ∠ B C A ∧ ∠ A C D = ∠ C A B + ∠ A B C := by
  have h1 := EuclideanGeometry.angle_add_angle_eq_pi_of_angle_eq_pi A h.angle₁₂₃_eq_pi
  have h2 := EuclideanGeometry.exterior_angle_eq_angle_add_angle (p₃ := A) D h.symm
  refine ⟨by rw [angle_comm B C A]; linarith, ?_⟩
  rw [h2, angle_comm C A B, angle_comm A B C]

/-- Predpostavka trditve `zunanji_kot` se da izpolniti (C = 1 strogo med 0 in 2 v ℝ). -/
example : Sbtw ℝ (0 : ℝ) 1 2 := by
  refine ⟨⟨1 / 2, ⟨by norm_num, by norm_num⟩, by norm_num [AffineMap.lineMap_apply]⟩, by norm_num,
    by norm_num⟩

/-! ## 3. Stranice in koti, Pitagora, Tales -/

/-- Razlaga 3: nasproti večje stranice leži večji kot: v trikotniku ABC je |AB| < |AC| ⇔ ∠ACB < ∠ABC
(kot nasproti AB je pri C, kot nasproti AC je pri B).
trditev: MAT-SS-1/trikotnik#vecja-stranica-vecji-kot
besedilo: »Nasproti večje stranice leži večji kot: $a > b \Leftrightarrow \alpha > \beta$.« -/
theorem vecja_stranica_vecji_kot {A B C : P} (h : ¬ Collinear ℝ ({A, B, C} : Set P)) :
    dist A B < dist A C ↔ ∠ A C B < ∠ A B C :=
  (angle_lt_iff_dist_lt h).symm

/-- Razlaga 3: v enakokrakem trikotniku (|AB| = |AC|) sta kota ob osnovnici BC enaka.
trditev: MAT-SS-1/trikotnik#enakokraki
besedilo: »V enakokrakem trikotniku sta kota ob osnovnici enaka« -/
theorem enakokraki {A B C : P} (h : dist A B = dist A C) : ∠ A B C = ∠ A C B :=
  angle_eq_angle_of_dist_eq h

/-- Razlaga 3: v enakostraničnem trikotniku je vsak kot π/3 (60°).
trditev: MAT-SS-1/trikotnik#enakostranicni
besedilo: »v enakostraničnem je vsak kot $60^\circ$« -/
theorem enakostranicni {A B C : P} (hAB : B ≠ A) (h1 : dist A B = dist A C) (h2 : dist B C = dist B A) :
    ∠ C A B = π / 3 ∧ ∠ A B C = π / 3 ∧ ∠ B C A = π / 3 := by
  have e1 := angle_eq_angle_of_dist_eq h1
  have e2 := angle_eq_angle_of_dist_eq h2
  have hs := vsota_kotov (C := C) hAB
  rw [angle_comm A C B] at e1
  rw [angle_comm B A C] at e2
  refine ⟨by linarith, by linarith, by linarith⟩

/-- Predpostavke trditev o enakokrakem in enakostraničnem trikotniku se dajo izpolniti: A = 0, B = 2,
C = 1 + √3·i v ℂ ima |AB| = |AC| = |BC| = 2. -/
example : (2 : ℂ) ≠ 0 ∧ dist (0 : ℂ) 2 = dist (0 : ℂ) ⟨1, √3⟩ ∧ dist (2 : ℂ) ⟨1, √3⟩ = dist (2 : ℂ) 0 := by
  have h3 : (√3 : ℝ) ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have e1 : dist (0 : ℂ) 2 = 2 := dist_c (by norm_num) (by simp)
  have e2 : dist (0 : ℂ) ⟨1, √3⟩ = 2 := dist_c (by norm_num) (by simp; norm_num)
  have e3 : dist (2 : ℂ) ⟨1, √3⟩ = 2 := dist_c (by norm_num) (by simp; norm_num)
  have e4 : dist (2 : ℂ) 0 = 2 := dist_c (by norm_num) (by simp)
  exact ⟨two_ne_zero, e1.trans e2.symm, e3.trans e4.symm⟩

/-- Razlaga 3 in Povzetek (Pitagorov izrek, v obeh smereh): kot pri C je pravi ⇔ |AB|² = |CA|² + |CB|².
trditev: MAT-SS-1/trikotnik#pitagora
besedilo: »veljata pa Pitagorov izrek $a^2 + b^2 = c^2$« -/
theorem pitagora (A B C : P) : dist A B * dist A B = dist A C * dist A C + dist B C * dist B C ↔ ∠ A C B = π / 2 :=
  dist_sq_eq_dist_sq_add_dist_sq_iff_angle_eq_pi_div_two A C B

/-- Razlaga 3 (Talesov izrek in obrat), Primer 3, premisli 2: kot pri C je pravi natanko tedaj, ko C leži na
krožnici s premerom AB (središče je razpolovišče hipotenuze, polmer R = |AB|/2).
trditev: MAT-SS-1/trikotnik#tales
besedilo: »Talesov izrek: kot v polkrogu je pravi in obratno, oglišče pravega kota leži na krožnici, ki ima hipotenuzo za premer.« -/
theorem tales (A B C : P) : ∠ A C B = π / 2 ↔ dist C (midpoint ℝ A B) = dist A B / 2 := by
  rw [EuclideanGeometry.Sphere.angle_eq_pi_div_two_iff_mem_sphere_ofDiameter, EuclideanGeometry.mem_sphere]
  rfl

/-! ## 4. Trikotniška neenakost -/

/-- Razlaga 4: v trikotniku (nekolinearne točke) je vsaka stranica strogo krajša od vsote drugih dveh.
trditev: MAT-SS-1/trikotnik#trikotniska-neenakost
besedilo: »a < b + c, \qquad b < a + c, \qquad c < a + b« -/
theorem trikotniska_neenakost {A B C : P} (h : ¬ Collinear ℝ ({A, B, C} : Set P)) :
    dist B C < dist C A + dist A B ∧ dist C A < dist B C + dist A B ∧ dist A B < dist B C + dist C A := by
  have hw : ∀ X Y Z : P, ¬ Collinear ℝ ({X, Y, Z} : Set P) → dist X Z < dist X Y + dist Y Z :=
    fun X Y Z hc => dist_lt_dist_add_dist_iff.mpr (fun hw => hc hw.collinear)
  have p1 := hw B A C (nk h (by ext; simp only [Set.mem_insert_iff, Set.mem_singleton_iff]; tauto))
  have p2 := hw C B A (nk h (by ext; simp only [Set.mem_insert_iff, Set.mem_singleton_iff]; tauto))
  have p3 := hw A C B (nk h (by ext; simp only [Set.mem_insert_iff, Set.mem_singleton_iff]; tauto))
  refine ⟨?_, ?_, ?_⟩
  · linarith [dist_comm B A, dist_comm A C, dist_comm C A]
  · linarith [dist_comm C B, dist_comm B A]
  · linarith [dist_comm C B, dist_comm A C, dist_comm C A]

/-- Razlaga 4: za dve znani stranici velja |a − b| < c < a + b (a = |BC|, b = |CA|, c = |AB|).
trditev: MAT-SS-1/trikotnik#meje-tretje
besedilo: »Če poznamo dve stranici $a$ in $b$, za tretjo velja $|a - b| < c < a + b$.« -/
theorem meje_tretje {A B C : P} (h : ¬ Collinear ℝ ({A, B, C} : Set P)) :
    |dist B C - dist C A| < dist A B ∧ dist A B < dist B C + dist C A := by
  obtain ⟨h1, h2, h3⟩ := trikotniska_neenakost h
  exact ⟨abs_sub_lt_iff.mpr ⟨by linarith, by linarith⟩, h3⟩

/-- Razlaga 4: če je c = a + b, ležijo točke na isti premici (C leži na daljici AB), trikotnika ni.
trditev: MAT-SS-1/trikotnik#enakost-kolinearne
besedilo: »Če je $c = a + b$, ležijo vse tri točke na isti premici in trikotnika ni.« -/
theorem enakost_kolinearne {A B C : P} (h : dist A B = dist A C + dist C B) : Wbtw ℝ A C B ∧
    Collinear ℝ ({A, C, B} : Set P) :=
  ⟨dist_add_dist_eq_iff.mp h.symm, (dist_add_dist_eq_iff.mp h.symm).collinear⟩

/-- Predpostavka trditve `enakost_kolinearne` se da izpolniti (0, 1, 2 na premici ℂ: |0 − 2| = 1 + 1). -/
example : dist (0 : ℂ) 2 = dist (0 : ℂ) 1 + dist (1 : ℂ) 2 := by
  simp [Complex.dist_eq]; norm_num

/-- Razlaga 4 (obstoj): za a, b, c > 0, ki zadoščajo trikotniški neenakosti, obstaja trikotnik v ravnini ℂ s
stranicami |BC| = a, |CA| = b, |AB| = c, ki ni izrojen (C ni na premici AB, Im C > 0).
pomozno – lekcija pove le ekvivalenco (»natanko tedaj«); ta izrek dokaže le smer »obstaja, če« -/
theorem obstoj_trikotnika (a b c : ℝ) (ha : 0 < a) (hb : 0 < b) (hc : 0 < c) (h1 : a < b + c) (h2 : b < a + c)
    (h3 : c < a + b) :
    ∃ A B C : ℂ, dist B C = a ∧ dist C A = b ∧ dist A B = c ∧ A.im = 0 ∧ B.im = 0 ∧ 0 < C.im := by
  set x := (b ^ 2 + c ^ 2 - a ^ 2) / (2 * c) with hx
  have hpos : 0 < b ^ 2 - x ^ 2 := by
    have key : 4 * c ^ 2 * (b ^ 2 - x ^ 2) = (a ^ 2 - (b - c) ^ 2) * ((b + c) ^ 2 - a ^ 2) := by
      rw [hx]; field_simp; ring
    have q1 : 0 < a - (b - c) := by linarith
    have q2 : 0 < a + (b - c) := by linarith
    have q3 : 0 < b + c - a := by linarith
    have q4 : 0 < b + c + a := by linarith
    have k1 : 0 < a ^ 2 - (b - c) ^ 2 := by nlinarith [mul_pos q1 q2]
    have k2 : 0 < (b + c) ^ 2 - a ^ 2 := by nlinarith [mul_pos q3 q4]
    have : 0 < 4 * c ^ 2 * (b ^ 2 - x ^ 2) := by rw [key]; positivity
    have hc2 : 0 < 4 * c ^ 2 := by positivity
    exact pos_of_mul_pos_right this hc2.le
  set y := √(b ^ 2 - x ^ 2) with hy
  have hy0 : 0 < y := Real.sqrt_pos.mpr hpos
  have hy2 : y ^ 2 = b ^ 2 - x ^ 2 := Real.sq_sqrt hpos.le
  refine ⟨0, c, ⟨x, y⟩, ?_, ?_, ?_, rfl, by simp, hy0⟩
  · rw [Complex.dist_eq_re_im]; simp only [Complex.ofReal_re, Complex.ofReal_im]
    rw [show (c - x) ^ 2 + (0 - y) ^ 2 = a ^ 2 by rw [show (0 - y) ^ 2 = y ^ 2 by ring, hy2, hx]; field_simp; ring]
    exact Real.sqrt_sq ha.le
  · rw [Complex.dist_eq_re_im]; simp only [Complex.zero_re, Complex.zero_im]
    rw [show (x - 0) ^ 2 + (y - 0) ^ 2 = b ^ 2 by rw [show (y - 0) ^ 2 = y ^ 2 by ring, hy2]; ring]
    exact Real.sqrt_sq hb.le
  · rw [Complex.dist_eq_re_im]; simp only [Complex.zero_re, Complex.zero_im, Complex.ofReal_re, Complex.ofReal_im]
    rw [show (0 - c) ^ 2 + (0 - 0) ^ 2 = c ^ 2 by ring]
    exact Real.sqrt_sq hc.le

/-- Predpostavke trditve `obstoj_trikotnika` se dajo izpolniti (a = 5, b = 6, c = 10, kviz 1). -/
example : (0 : ℝ) < 5 ∧ (0 : ℝ) < 6 ∧ (0 : ℝ) < 10 ∧ (5 : ℝ) < 6 + 10 ∧ (6 : ℝ) < 5 + 10 ∧ (10 : ℝ) < 5 + 6 := by
  norm_num

/-! ## 5. Skladnost -/

/-- Razlaga 5 (SSS), Iz vsakdanjega življenja (togost): trikotnika, ki se ujemata v vseh treh stranicah, sta
skladna, zato se ujemata tudi v kotih.
trditev: MAT-SS-1/trikotnik#sss
besedilo: »po izreku SSS tri palice določajo eno samo obliko« -/
theorem sss {A B C A₁ B₁ C₁ : P} (h1 : dist A B = dist A₁ B₁) (h2 : dist B C = dist B₁ C₁)
    (h3 : dist C A = dist C₁ A₁) : (![A, B, C] ≅ ![A₁, B₁, C₁]) ∧ ∠ A B C = ∠ A₁ B₁ C₁ := by
  have hc := side_side_side h1 h2 h3
  exact ⟨hc, by simpa using angle_eq_of_congruent hc 0 1 2⟩

/-- Razlaga 5 (SKS): dve stranici in kot med njima (kot pri B med BA in BC).
trditev: MAT-SS-1/trikotnik#sks
besedilo: »| SKS | dveh stranicah in kotu med njima |« -/
theorem sks {A B C A₁ B₁ C₁ : P} (h : ∠ A B C = ∠ A₁ B₁ C₁) (h1 : dist A B = dist A₁ B₁)
    (h2 : dist B C = dist B₁ C₁) : ![A, B, C] ≅ ![A₁, B₁, C₁] :=
  side_angle_side h h1 h2

/-- Razlaga 5 (KSK): stranica BC in oba kota ob njej (trikotnik ni izrojen).
trditev: MAT-SS-1/trikotnik#ksk
besedilo: »| KSK | stranici in obeh kotih ob njej |« -/
theorem ksk {A B C A₁ B₁ C₁ : P} (hn : ¬ Collinear ℝ ({A, B, C} : Set P)) (h : ∠ A B C = ∠ A₁ B₁ C₁)
    (h1 : dist B C = dist B₁ C₁) (h' : ∠ B C A = ∠ B₁ C₁ A₁) : ![A, B, C] ≅ ![A₁, B₁, C₁] :=
  angle_side_angle hn h h1 h'

/-- Razlaga 5 (SsK): dve stranici |AB| = c, |BC| = a in kot pri A, ki leži nasproti daljše od njiju (c ≤ a);
pri A ≠ C in A₁ ≠ C₁ sta trikotnika skladna. Dokaz: po kosinusnem izreku je |AC| pozitivna rešitev
b² − 2bc·cos α + (c² − a²) = 0; zmnožek rešitev je c² − a² ≤ 0, zato je pozitivna rešitev ena sama.
trditev: MAT-SS-1/trikotnik#ssk
besedilo: »| SsK | dveh stranicah in kotu nasproti **daljše** od njiju |« -/
theorem ssk {A B C A₁ B₁ C₁ : P} (hAC : A ≠ C) (hAC₁ : A₁ ≠ C₁) (h : ∠ B A C = ∠ B₁ A₁ C₁)
    (h1 : dist A B = dist A₁ B₁) (h2 : dist B C = dist B₁ C₁) (hdalj : dist A B ≤ dist B C) :
    ![A, B, C] ≅ ![A₁, B₁, C₁] := by
  have l1 := EuclideanGeometry.law_cos B A C
  have l2 := EuclideanGeometry.law_cos B₁ A₁ C₁
  have hb : 0 < dist A C := dist_pos.mpr hAC
  have hb₁ : 0 < dist A₁ C₁ := dist_pos.mpr hAC₁
  rw [dist_comm B A, dist_comm C A] at l1
  rw [dist_comm B₁ A₁, dist_comm C₁ A₁, ← h, ← h1, ← h2] at l2
  have hb_eq : dist A C = dist A₁ C₁ := by
    by_contra hne
    have e : (dist A C - dist A₁ C₁) *
        (dist A C + dist A₁ C₁ - 2 * dist A B * Real.cos (∠ B A C)) = 0 := by
      linear_combination l2 - l1
    have hsum : dist A C + dist A₁ C₁ - 2 * dist A B * Real.cos (∠ B A C) = 0 := by
      rcases mul_eq_zero.mp e with h0 | h0
      · exact absurd (by linarith) hne
      · exact h0
    have hprod : dist A C * dist A₁ C₁ = dist A B * dist A B - dist B C * dist B C := by
      linear_combination l1 + dist A C * hsum
    have : dist A B * dist A B - dist B C * dist B C ≤ 0 := by
      nlinarith [dist_nonneg (x := A) (y := B)]
    nlinarith [mul_pos hb hb₁]
  exact side_side_side h1 h2 (by rw [dist_comm C A, dist_comm C₁ A₁]; exact hb_eq)

/-- Predpostavke trditev `vecja_stranica_vecji_kot`, `trikotniska_neenakost`, `meje_tretje`, `sss`, `sks`, `ksk`,
`ssk` se dajo izpolniti (nekolinearni trikotnik 0, 1, i v ℂ, za skladnost isti trikotnik dvakrat, da so enakosti
izpolnjene; |AB| = 1 ≤ |BC| = √2, A ≠ C). -/
example : ¬ Collinear ℝ ({(0 : ℂ), 1, Complex.I} : Set ℂ) ∧ (0 : ℂ) ≠ Complex.I ∧
    dist (0 : ℂ) 1 ≤ dist (1 : ℂ) Complex.I := by
  refine ⟨nekolinearni, fun h => by simpa using congrArg Complex.im h, ?_⟩
  rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im]; simp

/-- Razlaga 5, premisli 1 (ni »KKK«): trikotnik, raztegnjen s faktorjem r > 0, r ≠ 1, ima enake kote, a drugačne
stranice, zato ni skladen s prvotnim.
trditev: MAT-SS-1/trikotnik#kkk-ne
besedilo: »Trije koti ne povedo ničesar o velikosti: posnetek trikotnika na zaslonu telefona, ki ga povečaš z dvema prstoma, ima enake kote, stranice pa daljše.« -/
theorem kkk_ne (A B C : V) {r : ℝ} (hr : 0 < r) (hr1 : r ≠ 1) (hAB : A ≠ B) :
    ∠ (r • A) (r • B) (r • C) = ∠ A B C ∧ dist (r • A) (r • B) ≠ dist A B := by
  constructor
  · simp only [EuclideanGeometry.angle, vsub_eq_sub, ← smul_sub]
    rw [InnerProductGeometry.angle_smul_left_of_pos _ _ hr, InnerProductGeometry.angle_smul_right_of_pos _ _ hr]
  · rw [dist_smul₀, Real.norm_of_nonneg hr.le]
    intro h
    have hd : 0 < dist A B := dist_pos.mpr hAB
    have : (r - 1) * dist A B = 0 := by linarith
    rcases mul_eq_zero.mp this with h0 | h0
    · exact hr1 (by linarith)
    · linarith

/-- Predpostavke trditve `kkk_ne` se dajo izpolniti (r = 2, A = 0, B = 1 v ℂ). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℂ) ≠ 1 := ⟨by norm_num, by norm_num, zero_ne_one⟩

/-! ## 6. Značilne točke trikotnika -/

/-- Razlaga 6, Ustno vprašanje 3, Bolj natančno: točka O na simetralah stranic AB in BC leži tudi na simetrali
stranice AC in je enako oddaljena od vseh treh oglišč.
trditev: MAT-SS-1/trikotnik#simetrale-stranic
besedilo: »Presečišče simetral stranic $AB$ in $BC$ je zato točka $O$ z $|OA| = |OB|$ in $|OB| = |OC|$, torej tudi $|OA| = |OC|$. Točka $O$ leži zato tudi na simetrali stranice $AC$.« -/
theorem simetrale_stranic {A B C O : P} (h1 : O ∈ AffineSubspace.perpBisector A B)
    (h2 : O ∈ AffineSubspace.perpBisector B C) :
    O ∈ AffineSubspace.perpBisector A C ∧ dist O A = dist O B ∧ dist O B = dist O C := by
  rw [AffineSubspace.mem_perpBisector_iff_dist_eq] at h1 h2 ⊢
  exact ⟨h1.trans h2, h1, h2⟩

/-- Predpostavki trditve `simetrale_stranic` se dajo izpolniti (izrojeno O = A = B = C = 0; nedegeneriran primer je
središče iz `obstoj_O`, spodaj 0 = središče za −1, 1, i). -/
example : (0 : ℂ) ∈ AffineSubspace.perpBisector (0 : ℂ) 0 := by
  rw [AffineSubspace.mem_perpBisector_iff_dist_eq]

/-- Nedegeneriran primer za `simetrale_stranic`: O = 0 leži na simetralah stranic AB in BC za A = −1, B = 1, C = i. -/
example : (0 : ℂ) ∈ AffineSubspace.perpBisector (-1 : ℂ) 1 ∧
    (0 : ℂ) ∈ AffineSubspace.perpBisector (1 : ℂ) Complex.I := by
  simp only [AffineSubspace.mem_perpBisector_iff_dist_eq, Complex.dist_eq]
  simp

/-- Razlaga 6 (obstoj središča očrtane krožnice): za nekolinearne A, B, C obstaja točka O, enako oddaljena od vseh
treh oglišč (Mathlibov `circumcenter`), in leži na vseh treh simetralah stranic.
trditev: MAT-SS-1/trikotnik#obstoj-o
besedilo: »Novo je, da gredo vse tri simetrale stranic trikotnika skozi eno točko.« -/
theorem obstoj_O {A B C : P} (h : AffineIndependent ℝ ![A, B, C]) :
    ∃ O : P, O ∈ AffineSubspace.perpBisector A B ∧ O ∈ AffineSubspace.perpBisector B C ∧
      O ∈ AffineSubspace.perpBisector A C := by
  let t : Affine.Triangle ℝ P := ⟨![A, B, C], h⟩
  have e : ∀ i, dist (t.points i) t.circumcenter = t.circumradius := t.dist_circumcenter_eq_circumradius
  have e0 := e 0; have e1 := e 1; have e2 := e 2
  simp only [t, Matrix.cons_val_zero, Matrix.cons_val_one, Matrix.cons_val_two, Matrix.head_cons,
    Matrix.tail_cons] at e0 e1 e2
  refine ⟨t.circumcenter, ?_, ?_, ?_⟩ <;> rw [AffineSubspace.mem_perpBisector_iff_dist_eq'] <;> linarith

/-- Predpostavka trditve `obstoj_O` se da izpolniti (0, 1, i v ℂ so afino neodvisne). -/
example : AffineIndependent ℝ ![(0 : ℂ), 1, Complex.I] :=
  affineIndependent_iff_not_collinear_set.mpr nekolinearni

/-- Razlaga 6 (višinska točka): če točka H leži na višinah iz A in iz B (⟪H − A, B − C⟫ = 0, ⟪H − B, C − A⟫ = 0),
leži tudi na višini iz C.
trditev: MAT-SS-1/trikotnik#visine
besedilo: »**Višine** se sekajo v višinski točki.« -/
theorem visine (A B C H : V) (hA : inner ℝ (H - A) (B - C) = 0) (hB : inner ℝ (H - B) (C - A) = 0) :
    inner ℝ (H - C) (A - B) = 0 := by
  have key : inner ℝ (H - A) (B - C) + inner ℝ (H - B) (C - A) + inner ℝ (H - C) (A - B) = 0 := by
    simp only [inner_sub_left, inner_sub_right, real_inner_comm A B, real_inner_comm A C, real_inner_comm B C]
    ring
  linarith

/-- Predpostavke trditve `visine` se dajo izpolniti (pravokotni trikotnik A = 1, B = i, C = 0 in H = C v ℂ). -/
example : inner ℝ ((0 : ℂ) - 1) (Complex.I - 0) = 0 ∧ inner ℝ ((0 : ℂ) - Complex.I) (0 - 1) = 0 := by
  simp [Complex.inner]

/-- Razlaga 6 (pravokotni trikotnik): če je kot pri C pravi (⟪A − C, B − C⟫ = 0), leži C na vseh treh višinah,
torej je višinska točka V = C.
trditev: MAT-SS-1/trikotnik#visinska-v-pravem-kotu
besedilo: »pri pravokotnem je $V$ v oglišču pravega kota« -/
theorem visinska_v_pravem_kotu (A B C : V) (h : inner ℝ (A - C) (B - C) = 0) :
    inner ℝ (C - A) (B - C) = 0 ∧ inner ℝ (C - B) (C - A) = 0 ∧ inner ℝ (C - C) (A - B) = 0 := by
  refine ⟨?_, ?_, by simp⟩
  · rw [← neg_sub, inner_neg_left, h, neg_zero]
  · rw [← neg_sub A C, ← neg_sub B C, inner_neg_left, inner_neg_right, neg_neg, real_inner_comm, h]

/-- Predpostavka trditve `visinska_v_pravem_kotu` se da izpolniti (A = 1, B = i, C = 0 v ℂ). -/
example : inner ℝ ((1 : ℂ) - 0) (Complex.I - 0) = 0 := by simp [Complex.inner]

/-- Razlaga 6 in Povzetek (težišče): T = (A + B + C)/3 leži na vseh treh težiščnicah in deli vsako v razmerju 2 : 1
od oglišča: T − C = ⅔(D − C) za razpolovišče D stranice AB, in podobno za A in B.
trditev: MAT-SS-1/trikotnik#tezisce
besedilo: »**Težiščnice** se sekajo v težišču, ki deli težiščnico v razmerju $2:1$ od oglišča.« -/
theorem tezisce (A B C : V) :
    (1 / 3 : ℝ) • (A + B + C) - C = (2 / 3 : ℝ) • (midpoint ℝ A B - C) ∧
    (1 / 3 : ℝ) • (A + B + C) - A = (2 / 3 : ℝ) • (midpoint ℝ B C - A) ∧
    (1 / 3 : ℝ) • (A + B + C) - B = (2 / 3 : ℝ) • (midpoint ℝ C A - B) := by
  simp only [midpoint_eq_smul_add, invOf_eq_inv]
  refine ⟨?_, ?_, ?_⟩ <;> module

/-- Razlaga 7 in Povzetek: S = a·r/2 + b·r/2 + c·r/2 = r·s (s = (a + b + c)/2), zato r = S/s (s ≠ 0).
trditev: MAT-SS-1/trikotnik#vcrtana
besedilo: »S = \frac{a r}{2} + \frac{b r}{2} + \frac{c r}{2} = r \cdot s$$ Od tod $r = \dfrac{S}{s}$.« -/
theorem vcrtana (a b c r : ℝ) (hs : (a + b + c) / 2 ≠ 0) :
    a * r / 2 + b * r / 2 + c * r / 2 = r * ((a + b + c) / 2) ∧
      r = (a * r / 2 + b * r / 2 + c * r / 2) / ((a + b + c) / 2) := by
  refine ⟨by ring, ?_⟩
  rw [eq_div_iff hs]
  ring

/-- Predpostavka trditve `vcrtana` se da izpolniti (Primer 3: s = 12). -/
example : ((6 : ℝ) + 8 + 10) / 2 ≠ 0 := by norm_num

/-! ## 8. Večkotniki (algebra formul) -/

/-- Razlaga 8: vsota zunanjih kotov: n·180° − (n − 2)·180° = 360°.
trditev: MAT-SS-1/trikotnik#zunanji-koti
besedilo: »$n \cdot 180^\circ - (n - 2) \cdot 180^\circ = 360^\circ$« -/
theorem zunanji_koti (n : ℝ) : n * 180 - (n - 2) * 180 = 360 := by ring

/-- Razlaga 8: število diagonal: vseh daljic med n oglišči je C(n, 2), stranic je n, zato je diagonal
C(n, 2) − n = n(n − 3)/2.
trditev: MAT-SS-1/trikotnik#diagonale
besedilo: »Število diagonal je $\dfrac{n(n - 3)}{2}$.« -/
theorem diagonale (n : ℕ) : ((n.choose 2 : ℕ) : ℝ) - n = n * (n - 3) / 2 := by
  rw [Nat.cast_choose_two]; ring

/-- Razlaga 8: pravilni n-kotnik (n ≠ 0): φ = (n − 2)·180/n, zunanji kot 180 − φ = 360/n.
trditev: MAT-SS-1/trikotnik#pravilni
besedilo: »Ker so koti enaki, meri notranji kot $\varphi = \dfrac{(n - 2) \cdot 180^\circ}{n}$, zunanji pa $\varphi' = \dfrac{360^\circ}{n}$.« -/
theorem pravilni (n : ℝ) (hn : n ≠ 0) : 180 - (n - 2) * 180 / n = 360 / n := by
  field_simp; ring

/-- Predpostavka trditve `pravilni` se da izpolniti (n = 6). -/
example : (6 : ℝ) ≠ 0 := by norm_num

/-- Razlaga 8 in `RACUN`: štirikotnik 360°, petkotnik 3·180° = 540°, šestkotnik 720°; d₅ = 5, d₆ = 6·3/2 = 9;
pravilni šestkotnik φ' = 360/6 = 60°, φ = (6 − 2)·180/6 = 120°.
trditev: MAT-SS-1/trikotnik#vecko-vrednosti
besedilo: »Štirikotnik ima vsoto $360^\circ$, petkotnik $3 \cdot 180^\circ = 540^\circ$, šestkotnik $720^\circ$.« -/
theorem vecko_vrednosti : (4 - 2 : ℝ) * 180 = 360 ∧ (5 - 2 : ℝ) * 180 = 3 * 180 ∧ (3 : ℝ) * 180 = 540 ∧
    (6 - 2 : ℝ) * 180 = 720 ∧ (5 : ℝ) * (5 - 3) / 2 = 5 ∧ (6 : ℝ) * (6 - 3) / 2 = 9 ∧ (6 : ℝ) * 3 / 2 = 9 ∧
    (360 : ℝ) / 6 = 60 ∧ (6 - 2 : ℝ) * 180 / 6 = 120 := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: γ = 180 − 48 − 75 = 57, γ' = 180 − 57 = 123, preverba α + β = 48 + 75 = 123.
trditev: MAT-SS-1/trikotnik#primer1
besedilo: »Odgovor: $\gamma = 57^\circ$, zunanji kot pri $C$ je $123^\circ$.« -/
theorem primer1 : (180 : ℝ) - 48 - 75 = 57 ∧ (180 : ℝ) - 57 = 123 ∧ (48 : ℝ) + 75 = 123 := by norm_num

/-- Primer 1 (vse rešitve): iz α + β + γ = 180, α = 48, β = 75 sledi natanko γ = 57.
trditev: MAT-SS-1/trikotnik#primer1-iff
besedilo: »Notranji kot: $\gamma = 180^\circ - 48^\circ - 75^\circ = 57^\circ$.« -/
theorem primer1_iff (γ : ℝ) : 48 + 75 + γ = 180 ↔ γ = 57 := by
  constructor <;> intro h <;> linarith

/-- Primer 2: a = |BC| = 5, b = |CA| = 7, γ = ∠BCA = 50°; f = |DE| = 5, d = |EF| = 7, ε = ∠DEF = 50°. Po SKS je
△ABC ≅ △FDE (A ↔ F, B ↔ D, C ↔ E), zato je δ = ∠EDF = ∠CBA = β in φ = ∠DFE = ∠CAB = α.
trditev: MAT-SS-1/trikotnik#primer2
besedilo: »$A \leftrightarrow F$ (nasproti obeh je stranica $5\,\text{cm}$), $B \leftrightarrow D$ (nasproti obeh $7\,\text{cm}$), $C \leftrightarrow E$. Zapišemo $\triangle ABC \cong \triangle FDE$.« -/
theorem primer2 {A B C D E F : P} (ha : dist B C = 5) (hb : dist C A = 7) (hf : dist D E = 5)
    (hd : dist E F = 7) (hγ : ∠ B C A = 50 * π / 180) (hε : ∠ D E F = 50 * π / 180) :
    (![B, C, A] ≅ ![D, E, F]) ∧ ∠ C B A = ∠ E D F ∧ ∠ C A B = ∠ E F D := by
  have hc := side_angle_side (hγ.trans hε.symm) (ha.trans hf.symm) (hb.trans hd.symm)
  refine ⟨hc, ?_, ?_⟩
  · simpa using angle_eq_of_congruent hc 1 0 2
  · simpa using angle_eq_of_congruent hc 1 2 0

/-- Predpostavke trditve `primer2` se dajo izpolniti: C = 0, B = 5, A = 7·e^{iθ} s θ = 50° v ℂ ima |BC| = 5,
|CA| = 7 in ∠BCA = 50° (za DEF isti trikotnik). -/
example : dist (5 : ℂ) 0 = 5 ∧ dist (0 : ℂ) (7 * Complex.exp ((50 * π / 180 : ℝ) * Complex.I)) = 7 ∧
    ∠ (5 : ℂ) 0 (7 * Complex.exp ((50 * π / 180 : ℝ) * Complex.I)) = 50 * π / 180 := by
  refine ⟨dist_c (by norm_num) (by simp), ?_, ?_⟩
  · rw [Complex.dist_eq, zero_sub, norm_neg, norm_mul, Complex.norm_exp_ofReal_mul_I]; simp
  · simp only [EuclideanGeometry.angle, vsub_eq_sub, sub_zero]
    rw [show (5 : ℂ) = (5 : ℝ) • (1 : ℂ) by simp,
      show (7 : ℂ) * Complex.exp ((50 * π / 180 : ℝ) * Complex.I) =
        (7 : ℝ) • Complex.exp ((50 * π / 180 : ℝ) * Complex.I) by simp,
      InnerProductGeometry.angle_smul_left_of_pos _ _ (by norm_num),
      InnerProductGeometry.angle_smul_right_of_pos _ _ (by norm_num), InnerProductGeometry.angle_comm,
      Complex.angle_exp_one, toIocMod_eq_self _ |>.mpr ⟨by linarith [pi_pos], by linarith [pi_pos]⟩,
      abs_of_pos (by positivity)]

/-- Primer 2, korak 5: α ≈ 180 − 50 − 85 = 45.
trditev: MAT-SS-1/trikotnik#primer2-alfa
besedilo: »$\alpha \approx 180^\circ - 50^\circ - 85^\circ = 45^\circ$« -/
theorem primer2_alfa : (180 : ℝ) - 50 - 85 = 45 := by norm_num

/-- Primer 3 (C = 0, A = 6, B = 8i v ℂ): c = √(6² + 8²) = √100 = 10; središče O očrtane krožnice je razpolovišče
hipotenuze in R = |OC| = c/2 = 5 (pravi kot pri C, Tales); težišče T = (A + B + C)/3 ima
|TC| = ⅔·t_c = ⅔·5 = 10/3, t_c = |CO| = 5.
trditev: MAT-SS-1/trikotnik#primer3
besedilo: »Hipotenuza: $c = \sqrt{6^2 + 8^2} = \sqrt{100} = 10\,\text{cm}$. 2. Po Talesovem izreku leži $C$ na krožnici s premerom $AB$, zato je središče $O$ očrtane krožnice na sredini hipotenuze: $R = \dfrac{c}{2} = 5\,\text{cm}$.« -/
theorem primer3 :
    dist (6 : ℂ) (8 * Complex.I) = √(6 ^ 2 + 8 ^ 2) ∧ √((6 : ℝ) ^ 2 + 8 ^ 2) = √100 ∧ √(100 : ℝ) = 10 ∧
    ∠ (6 : ℂ) 0 (8 * Complex.I) = π / 2 ∧ dist (0 : ℂ) (midpoint ℝ 6 (8 * Complex.I)) = 5 ∧
    dist ((1 / 3 : ℝ) • ((6 : ℂ) + 8 * Complex.I + 0)) 0 = 2 / 3 * 5 ∧ (2 / 3 : ℝ) * 5 = 10 / 3 := by
  have h100 : √(100 : ℝ) = 10 := by
    rw [show (100 : ℝ) = 10 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have h25 : √(25 : ℝ) = 5 := by
    rw [show (25 : ℝ) = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨?_, by norm_num, h100, ?_, ?_, ?_, by norm_num⟩
  · rw [Complex.dist_eq_re_im]; simp
  · rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [Complex.inner]
  · rw [midpoint_eq_smul_add]; exact dist_c (by norm_num) (by simp; norm_num)
  · exact dist_c (by norm_num) (by simp; norm_num)

/-- Primer 3: S = 6·8/2 = 24, s = (6 + 8 + 10)/2 = 12, r = S/s = 24/12 = 2, |TC| = 10/3 ≈ 3,33.
trditev: MAT-SS-1/trikotnik#primer3-racun
besedilo: »Ploščina: $S = \dfrac{6 \cdot 8}{2} = 24\,\text{cm}^2$, polobseg $s = \dfrac{6 + 8 + 10}{2} = 12\,\text{cm}$. 4. Polmer včrtane krožnice: $r = \dfrac{S}{s} = \dfrac{24}{12} = 2\,\text{cm}$.« -/
theorem primer3_racun : (6 : ℝ) * 8 / 2 = 24 ∧ ((6 : ℝ) + 8 + 10) / 2 = 12 ∧ (24 : ℝ) / 12 = 2 ∧
    (10 / 2 : ℝ) = 5 ∧ |(10 / 3 : ℝ) - 333 / 100| < 5 / 1000 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  rw [abs_lt]; norm_num

/-- Primer 4: |4 − 7| = 3 < c < 11 = 4 + 7; 9 km je v mejah, 12 km ni.
trditev: MAT-SS-1/trikotnik#primer4
besedilo: »$7 - 4 = 3$ in $7 + 4 = 11$, zato je $3\,\text{km} < c < 11\,\text{km}$. Razdalja $9\,\text{km}$ je torej mogoča, $12\,\text{km}$ pa ne.« -/
theorem primer4 : |(4 : ℝ) - 7| = 3 ∧ (4 : ℝ) + 7 = 11 ∧ (3 < (9 : ℝ) ∧ (9 : ℝ) < 11) ∧ ¬ ((12 : ℝ) < 11) := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  rw [abs_of_neg (by norm_num)]; norm_num

/-- Primer 5: pravilni n-kotnik z notranjim kotom 140°: 180 − 140 = 360/n natanko pri n = 9 (n > 0).
trditev: MAT-SS-1/trikotnik#primer5
besedilo: »Vsi zunanji koti so enaki in skupaj merijo $360^\circ$, zato je $n = \dfrac{360^\circ}{40^\circ} = 9$.« -/
theorem primer5 (n : ℝ) (hn : 0 < n) : 180 - 140 = 360 / n ↔ n = 9 := by
  constructor
  · intro h
    have h40 : (40 : ℝ) = 360 / n := by linarith
    field_simp at h40
    linarith
  · rintro rfl; norm_num

/-- Predpostavka trditve `primer5` se da izpolniti (n = 9). -/
example : (0 : ℝ) < 9 := by norm_num

/-- Primer 5 in `RACUN`: 180 − 140 = 40, 360/40 = 9, d₉ = 9·6/2 = 27, (9 − 2)·180 = 7·180 = 1260 = 9·140.
trditev: MAT-SS-1/trikotnik#primer5-racun
besedilo: »Odgovor: okno je pravilni devetkotnik s $27$ diagonalami, vsota notranjih kotov je $1260^\circ$.« -/
theorem primer5_racun : (180 : ℝ) - 140 = 40 ∧ (360 : ℝ) / 40 = 9 ∧ (9 : ℝ) * (9 - 3) / 2 = 27 ∧
    (9 : ℝ) * 6 / 2 = 27 ∧ (9 - 2 : ℝ) * 180 = 7 * 180 ∧ (7 : ℝ) * 180 = 1260 ∧ (9 : ℝ) * 140 = 1260 := by
  norm_num

/-! ## Za maturo -/

/-- Naloga 1: γ' = 126°, α − β = 18°: γ = 180 − 126 = 54; α + β = 126 in α − β = 18 ⇔ α = 72, β = 54
(2α = 144).
trditev: MAT-SS-1/trikotnik#naloga1
besedilo: »Ker je $\alpha - \beta = 18^\circ$, sledi $2\alpha = 126^\circ + 18^\circ = 144^\circ$, zato $\alpha = 72^\circ$ in $\beta = 126^\circ - 72^\circ = 54^\circ$.« -/
theorem naloga1 (α β : ℝ) : (α + β = 126 ∧ α - β = 18) ↔ (α = 72 ∧ β = 54) := by
  constructor
  · rintro ⟨h1, h2⟩
    have h3 : 2 * α = 126 + 18 := by linarith
    have h4 : (126 : ℝ) + 18 = 144 := by norm_num
    exact ⟨by linarith, by linarith⟩
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Naloga 1 in `RACUN`: 180 − 126 = 54, (126 + 18)/2 = 72, (126 − 18)/2 = 54, 72 + 54 + 54 = 180.
trditev: MAT-SS-1/trikotnik#naloga1-racun
besedilo: »Odgovor: $\alpha = 72^\circ$, $\beta = 54^\circ$, $\gamma = 54^\circ$« -/
theorem naloga1_racun : (180 : ℝ) - 126 = 54 ∧ ((126 : ℝ) + 18) / 2 = 72 ∧ ((126 : ℝ) - 18) / 2 = 54 ∧
    (72 : ℝ) + 54 + 54 = 180 := by norm_num

/-- Naloga 1 (najdaljša stranica): v trikotniku z α = ∠CAB večjim od β = ∠ABC in od γ = ∠BCA je a = |BC| večja
od b = |CA| in od c = |AB|; pri β = γ je b = c.
trditev: MAT-SS-1/trikotnik#naloga1-stranice
besedilo: »Največji kot je $\alpha = 72^\circ$, zato je najdaljša stranica $a$. Ker je $\beta = \gamma$, je $b = c$« -/
theorem naloga1_stranice {A B C : P} (h : ¬ Collinear ℝ ({A, B, C} : Set P)) (hαβ : ∠ A B C < ∠ C A B)
    (hαγ : ∠ B C A < ∠ C A B) (hβγ : ∠ A B C = ∠ B C A) :
    dist C A < dist B C ∧ dist A B < dist B C ∧ dist C A = dist A B := by
  have hC : ¬ Collinear ℝ ({C, A, B} : Set P) :=
    nk h (by ext; simp only [Set.mem_insert_iff, Set.mem_singleton_iff]; tauto)
  have hB : ¬ Collinear ℝ ({B, A, C} : Set P) :=
    nk h (by ext; simp only [Set.mem_insert_iff, Set.mem_singleton_iff]; tauto)
  refine ⟨?_, ?_, ?_⟩
  · have := (angle_lt_iff_dist_lt hC).mp (by rw [angle_comm C B A]; exact hαβ)
    linarith [dist_comm C B]
  · have := (angle_lt_iff_dist_lt hB).mp (by rw [angle_comm B A C]; exact hαγ)
    linarith [dist_comm B A]
  · have := dist_eq_of_angle_eq_angle_of_angle_ne_pi (p₁ := A) (p₂ := B) (p₃ := C)
      (by rw [hβγ, angle_comm]) (angle_lt_pi_of_not_collinear hB).ne
    linarith [dist_comm C A]

/-- Pomožno: trikotnik A = i/2, B = −1, C = 1 v ℂ ni izrojen (kot pri B ni 0 ne π).
pomozno – orodje za primer izpolnljivosti (trikotnik i/2, −1, 1 ni izrojen) -/
theorem nekolinearni2 : ¬ Collinear ℝ ({(⟨0, 1 / 2⟩ : ℂ), -1, 1} : Set ℂ) := by
  intro hc
  have hc' : Collinear ℝ ({(⟨0, 1 / 2⟩ : ℂ), -1, 1} : Set ℂ) := hc
  rcases collinear_iff_eq_or_eq_or_angle_eq_zero_or_angle_eq_pi.mp hc' with h | h | h | h
  · have := congrArg Complex.re h; norm_num at this
  · have := congrArg Complex.re h; norm_num at this
  · rw [EuclideanGeometry.angle, InnerProductGeometry.angle_eq_zero_iff] at h
    obtain ⟨-, r, hr, he⟩ := h
    have h1 := congrArg Complex.im he
    have h2 := congrArg Complex.re he
    simp at h1 h2
    linarith
  · rw [EuclideanGeometry.angle, InnerProductGeometry.angle_eq_pi_iff] at h
    obtain ⟨-, r, hr, he⟩ := h
    have h1 := congrArg Complex.im he
    have h2 := congrArg Complex.re he
    simp at h1 h2
    linarith

/-- Predpostavke trditve `naloga1_stranice` se dajo izpolniti: A = i/2, B = −1, C = 1 (enakokraki, α top, β = γ). -/
example : ¬ Collinear ℝ ({(⟨0, 1 / 2⟩ : ℂ), -1, 1} : Set ℂ) ∧
    ∠ (⟨0, 1 / 2⟩ : ℂ) (-1) 1 < ∠ (1 : ℂ) ⟨0, 1 / 2⟩ (-1) ∧ ∠ (-1 : ℂ) 1 ⟨0, 1 / 2⟩ < ∠ (1 : ℂ) ⟨0, 1 / 2⟩ (-1) ∧
    ∠ (⟨0, 1 / 2⟩ : ℂ) (-1) 1 = ∠ (-1 : ℂ) 1 ⟨0, 1 / 2⟩ := by
  have h := nekolinearni2
  have hCAB : ¬ Collinear ℝ ({(1 : ℂ), ⟨0, 1 / 2⟩, -1} : Set ℂ) :=
    nk h (by ext; simp only [Set.mem_insert_iff, Set.mem_singleton_iff]; tauto)
  have hBAC : ¬ Collinear ℝ ({(-1 : ℂ), ⟨0, 1 / 2⟩, 1} : Set ℂ) :=
    nk h (by ext; simp only [Set.mem_insert_iff, Set.mem_singleton_iff]; tauto)
  have dCA : dist (1 : ℂ) ⟨0, 1 / 2⟩ < dist (1 : ℂ) (-1) := by
    rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im]; norm_num
    rw [div_lt_iff₀ (by norm_num), Real.sqrt_lt' (by norm_num)]; norm_num
  have dBA : dist (-1 : ℂ) ⟨0, 1 / 2⟩ < dist (-1 : ℂ) 1 := by
    rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im]; norm_num
    rw [div_lt_iff₀ (by norm_num), Real.sqrt_lt' (by norm_num)]; norm_num
  have dAB : dist (⟨0, 1 / 2⟩ : ℂ) (-1) = dist (⟨0, 1 / 2⟩ : ℂ) 1 := by
    rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im]; norm_num
  refine ⟨h, ?_, ?_, ?_⟩
  · have := (angle_lt_iff_dist_lt hCAB).mpr dCA
    rwa [angle_comm (1 : ℂ) (-1) ⟨0, 1 / 2⟩] at this
  · have := (angle_lt_iff_dist_lt hBAC).mpr dBA
    rwa [angle_comm (-1 : ℂ) ⟨0, 1 / 2⟩ 1] at this
  · rw [EuclideanGeometry.angle_eq_angle_of_dist_eq dAB, angle_comm]

/-- Pomožno: √24 je med 4,898979 in 4,898980.
pomozno – orodje (meje za √24) -/
theorem sqrt24_meje : (4898979 / 1000000 : ℝ) < √24 ∧ √24 < 4898980 / 1000000 := by
  constructor
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num

/-- Naloga 2 (A = −5, B = 5, C = √24·i, D = 0 v ℂ): |AB| = 10, |AC| = |BC| = 7, D je razpolovišče AB,
kot pri D je pravi in v_c = |DC| = √(7² − 5²) = √24.
trditev: MAT-SS-1/trikotnik#naloga2-trikotnik
besedilo: »$v_c = |DC| = \sqrt{7^2 - 5^2}\,\text{cm} = \sqrt{24}\,\text{cm}« -/
theorem naloga2_trikotnik :
    dist (-5 : ℂ) 5 = 10 ∧ dist (-5 : ℂ) (√24 * Complex.I) = 7 ∧ dist (5 : ℂ) (√24 * Complex.I) = 7 ∧
    midpoint ℝ (-5 : ℂ) 5 = 0 ∧ ∠ (-5 : ℂ) 0 (√24 * Complex.I) = π / 2 ∧
    dist (0 : ℂ) (√24 * Complex.I) = √(7 ^ 2 - 5 ^ 2) ∧ √((7 : ℝ) ^ 2 - 5 ^ 2) = √24 := by
  have h24 : (√24 : ℝ) ^ 2 = 24 := Real.sq_sqrt (by norm_num)
  refine ⟨dist_c (by norm_num) (by simp; norm_num), dist_c (by norm_num) (by simp; norm_num),
    dist_c (by norm_num) (by simp; norm_num), ?_, ?_, ?_, by norm_num⟩
  · rw [midpoint_eq_smul_add]; norm_num
  · rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [Complex.inner]
  · exact dist_c (Real.sqrt_nonneg _) (by
      simp; rw [Real.sq_sqrt (by norm_num)]; norm_num)

/-- Naloga 2 a), c), d) in `RACUN`: v_c = √24 ≈ 4,899 ≈ 4,90; S = 10·√24/2 = 5√24 ≈ 24,495 ≈ 24,49;
s = (10 + 7 + 7)/2 = 12; r = 5√24/12 ≈ 2,041 ≈ 2,04; t_c = v_c in |TC| = ⅔√24 ≈ 3,266 ≈ 3,27.
trditev: MAT-SS-1/trikotnik#naloga2-racun
besedilo: »Polobseg: $s = \dfrac{10 + 7 + 7}{2}\,\text{cm} = 12\,\text{cm}$. 8. c) $r = \dfrac{S}{s} = \dfrac{5\sqrt{24}}{12}\,\text{cm} \approx 2{,}041\,\text{cm} \approx 2{,}04\,\text{cm}$. 9. d) Težiščnica $t_c$ gre od $C$ do razpolovišča $D$, torej sovpada z višino: $t_c = v_c = \sqrt{24}\,\text{cm}$. 10. d) Težišče deli težiščnico v razmerju $2:1$ od oglišča: $|TC| = \dfrac{2}{3}\sqrt{24}\,\text{cm} \approx 3{,}266\,\text{cm} \approx 3{,}27\,\text{cm}$.« -/
theorem naloga2_racun :
    |√24 - 4899 / 1000| < 5 / 10000 ∧ |√24 - 490 / 100| < 5 / 1000 ∧
    10 * √24 / 2 = 5 * √24 ∧ |5 * √24 - 24495 / 1000| < 5 / 10000 ∧ |5 * √24 - 2449 / 100| < 5 / 1000 ∧
    ((10 : ℝ) + 7 + 7) / 2 = 12 ∧ |5 * √24 / 12 - 2041 / 1000| < 5 / 10000 ∧ |5 * √24 / 12 - 204 / 100| < 5 / 1000 ∧
    |2 * √24 / 3 - 3266 / 1000| < 5 / 10000 ∧ |2 * √24 / 3 - 327 / 100| < 5 / 1000 := by
  obtain ⟨l, u⟩ := sqrt24_meje
  refine ⟨?_, ?_, by ring, ?_, ?_, by norm_num, ?_, ?_, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Naloga 2 b): kot γ = ∠ACB pri vrhu C = √24·i je top (⟪A − C, B − C⟫ = −25 + 24 = −1 < 0).
trditev: MAT-SS-1/trikotnik#naloga2-top
besedilo: »$\gamma = 2 \cdot \angle ACD > 90^\circ$: kot $\gamma$ je top.« -/
theorem naloga2_top : π / 2 < ∠ (-5 : ℂ) (√24 * Complex.I) 5 := by
  rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_neg_iff_pi_div_two_lt_angle]
  have h24 : (√24 : ℝ) ^ 2 = 24 := Real.sq_sqrt (by norm_num)
  simp [Complex.inner]
  nlinarith [h24]

/-- Naloga 2 b): središče O očrtane krožnice (|OA| = |OB| = |OC|) leži pod osnovnico AB (Im O < 0), trikotnik pa
v zgornji polravnini (vse točke konveksne ogrinjače A, B, C imajo Im ≥ 0), zato je O zunaj trikotnika.
trditev: MAT-SS-1/trikotnik#naloga2-o-zunaj
besedilo: »Trikotnik je topokoten, zato središče $O$ očrtane krožnice leži zunaj trikotnika (onkraj osnovnice $AB$).« -/
theorem naloga2_O_zunaj (O : ℂ) (h1 : dist O (-5) = dist O 5) (h2 : dist O 5 = dist O (√24 * Complex.I)) :
    O.im < 0 ∧ O ∉ convexHull ℝ ({(-5 : ℂ), 5, √24 * Complex.I} : Set ℂ) := by
  have h24 : (√24 : ℝ) ^ 2 = 24 := Real.sq_sqrt (by norm_num)
  have hpos : 0 < √(24 : ℝ) := Real.sqrt_pos.mpr (by norm_num)
  have e1 := congrArg (· ^ 2) h1; have e2 := congrArg (· ^ 2) h2
  simp only [dist_c_sq] at e1 e2
  simp at e1 e2
  have hre : O.re = 0 := by nlinarith
  have him : O.im * (2 * √24) = -1 := by rw [hre] at e2; nlinarith
  have hneg : O.im < 0 := by nlinarith
  refine ⟨hneg, fun hO => ?_⟩
  have hsub : convexHull ℝ ({(-5 : ℂ), 5, √24 * Complex.I} : Set ℂ) ⊆ {z : ℂ | 0 ≤ z.im} := by
    apply convexHull_min _ (convex_halfSpace_im_ge 0)
    intro z hz
    simp only [Set.mem_insert_iff, Set.mem_singleton_iff] at hz
    rcases hz with rfl | rfl | rfl <;> simp [hpos.le]
  have := hsub hO
  simp at this
  linarith

/-- Predpostavke trditve `naloga2_O_zunaj` se dajo izpolniti: O = −i/(2√24) je enako oddaljen od A, B in C. -/
example : dist ((-(1 / (2 * √24)) : ℝ) * Complex.I) (-5) = dist ((-(1 / (2 * √24)) : ℝ) * Complex.I) 5 ∧
    dist ((-(1 / (2 * √24)) : ℝ) * Complex.I) 5 = dist ((-(1 / (2 * √24)) : ℝ) * Complex.I) (√24 * Complex.I) := by
  have h24 : (√24 : ℝ) ^ 2 = 24 := Real.sq_sqrt (by norm_num)
  have hpos : 0 < √(24 : ℝ) := Real.sqrt_pos.mpr (by norm_num)
  have hne : (√24 : ℝ) ≠ 0 := hpos.ne'
  refine ⟨?_, ?_⟩ <;> rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im] <;> simp
  congr 1
  field_simp
  nlinarith [h24]

/-! ## Preveri se
Preveri se 5 (središče očrtane krožnice kot presečišče simetral stranic) pokrivata `simetrale_stranic` in
`obstoj_O`. -/

/-- Pogoj obstoja trikotnika s stranicami a, b, c. -/
def obstaja (a b c : ℝ) : Prop := a < b + c ∧ b < a + c ∧ c < a + b

/-- Preveri se 1: trikotnik obstaja za 5, 6, 10, ne pa za 4, 5, 10 (10 > 9) in ne za 3, 4, 7 (3 + 4 = 7).
trditev: MAT-SS-1/trikotnik#kviz1
besedilo: »Najdaljša stranica je $10$, vsota drugih dveh je $11 > 10$, zato trikotnik obstaja.« -/
theorem kviz1 : obstaja 5 6 10 ∧ ¬ obstaja 4 5 10 ∧ ¬ obstaja 3 4 7 ∧ (3 : ℝ) + 4 = 7 := by
  unfold obstaja; norm_num

/-- Preveri se 2: težišče je ⅔·8 = 16/3 ≈ 5,3 cm od oglišča (ne 4 = ½·8 in ne ⅓·8 ≈ 2,7).
trditev: MAT-SS-1/trikotnik#kviz2
besedilo: »Od oglišča do težišča sta dve tretjini težiščnice: $\dfrac{2}{3} \cdot 8 \approx 5{,}3\,\text{cm}$.« -/
theorem kviz2 : |(2 / 3 : ℝ) * 8 - 53 / 10| < 5 / 100 ∧ (1 / 2 : ℝ) * 8 ≠ 2 / 3 * 8 ∧
    |(1 / 3 : ℝ) * 8 - 27 / 10| < 5 / 100 := by
  refine ⟨?_, by norm_num, ?_⟩ <;> rw [abs_lt] <;> norm_num

/-- Preveri se 6 in `RACUN`: osemkotnik ima d₈ = 8·5/2 = 20 diagonal; 8·5 = 40 (dvojno štetje), C(8, 2) = 28 vseh
daljic, 8 − 3 = 5 iz enega oglišča.
trditev: MAT-SS-1/trikotnik#kviz6
besedilo: »Iz vsakega oglišča gre $8 - 3 = 5$ diagonal, vseh skupaj je $d_8 = \dfrac{8 \cdot 5}{2} = 20$.« -/
theorem kviz6 : (8 : ℝ) * (8 - 3) / 2 = 20 ∧ (8 : ℝ) * 5 = 40 ∧ Nat.choose 8 2 = 28 ∧ Nat.choose 8 2 - 8 = 20 ∧
    8 - 3 = 5 := by
  refine ⟨by norm_num, by norm_num, by decide, by decide, by norm_num⟩

end Evklid.Lekcije.MAT_SS_1.Trikotnik
