/-
vir: content/lessons/MAT-OS-9/podobni-trikotniki.md
sha256: 26dc955c19e7499e507b8da1889cbd9024637c5fb168c3fe2dea01aeb683553b
Ni v Leanu: risba in simulacija kot sliki; izrek SsK (Mathlib ga nima, zahtevno, še ni dokazano); merjenje s
kotomerom, poimenovanja (ustrezni deli, črtica) in navodila (»najprej poišči enake kote«, »preveri
smiselnost«); trditev »ustrezni stranici ležita nasproti skladnima kotoma, najkrajša ustreza najkrajši« kot
splošno pravilo (dokazano je le, da podobnost ohrani vse kote in pomnoži vse stranice z istim k > 0, zato se
vrstni red stranic ohrani: a < b ⇒ ka < kb); besedilne naloge (nalepka, nosilec, steber, sonce, zemljevid,
maketa, recept, fotokopirni stroj) kot modeli: dokazani so računi, vzporednost sončnih žarkov ni
formalizirana (dokazano: KK da podobnost, nato h/1,5 = 12/2 ⇔ h = 9); »recept« je dokazan kot a/b ≠
(a + c)/(b + c) pri a ≠ b, c > 0; besedilo napačnih odgovorov v Preveri se (dokazano je, da napačne
vrednosti niso pravilne). Geometrija: trikotnik je trojica točk evklidskega prostora, ki niso kolinearne;
podobnost je Mathlibova `Similar` (vse razdalje v istem razmerju), koti so `∠` v radianih (180° = π).
Izreki KK, SKS, SSS so Mathlibovi (`similar_of_angle_angle`, `similar_of_side_angle_side`,
`similar_of_dist_mul_eq_dist_mul_eq`). Kjer so podani le števila stranic, je »nista podobna« dokazano kot
»ni k, da bi bile vse tri stranice (urejene po velikosti, kot v `vrstni_red`) pomnožene s k«. Ploščina pravokotnega trikotnika je račun ab/2 (obrazec
ni formaliziran kot mera). Decimalna števila so točna racionalna števila v ℝ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_9.PodobniTrikotniki

open EuclideanGeometry
open scoped Similar

/-- Ravnina ℝ² za primere. -/
abbrev R2 := EuclideanSpace ℝ (Fin 2)

/-! ## Razlaga 1 in 2: povečava nalepke -/

/-- Razlaga 2 (tabela): 6/3 = 8/4 = 10/5 = 2, vse stranice nalepke so pomnožene z istim številom 2.
trditev: MAT-OS-9/podobni-trikotniki#tabela
besedilo: »| najkrajša | $3\,\text{cm}$ | $6\,\text{cm}$ | $2$ | | srednja | $4\,\text{cm}$ | $8\,\text{cm}$ | $2$ | | najdaljša | $5\,\text{cm}$ | $10\,\text{cm}$ | $2$ |« -/
theorem tabela : (6:ℝ) / 3 = 2 ∧ (8:ℝ) / 4 = 2 ∧ (10:ℝ) / 5 = 2 := by norm_num

/-- Razlaga 2, Premisli: prištevanje 3 cm da 6, 7, 8; razmerja 6/3 = 2, 7/4 = 1,75, 8/5 = 1,6 niso enaka
(ni k, da bi bile vse tri stranice pomnožene s k); 6² + 7² = 85, 8² = 64.
trditev: MAT-OS-9/podobni-trikotniki#pristevanje
besedilo: »Razmerja $\dfrac{6}{3} = 2$, $\dfrac{7}{4} = 1{,}75$ in $\dfrac{8}{5} = 1{,}6$ niso enaka« -/
theorem pristevanje :
    (3:ℝ) + 3 = 6 ∧ (4:ℝ) + 3 = 7 ∧ (5:ℝ) + 3 = 8 ∧ (6:ℝ) / 3 = 2 ∧ (7:ℝ) / 4 = 1.75 ∧ (8:ℝ) / 5 = 1.6 ∧
      (¬ ∃ k : ℝ, 6 = k * 3 ∧ 7 = k * 4 ∧ 8 = k * 5) ∧ (6:ℝ) ^ 2 + 7 ^ 2 = 85 ∧ (8:ℝ) ^ 2 = 64 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_, by norm_num,
    by norm_num⟩
  rintro ⟨k, h1, h2, _⟩
  linarith

/-- Razlaga 2, Premisli: trikotnik s stranicami 6, 7, 8 nima pravega kota (pri nobenem oglišču; obrat
Pitagorovega izreka).
trditev: MAT-OS-9/podobni-trikotniki#trikotnik-678-brez-pravega
besedilo: »Tak trikotnik nima niti pravega kota, saj je $6^2 + 7^2 = 85$, $8^2$ pa je $64$.« -/
theorem trikotnik_678_brez_pravega {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V]
    [MetricSpace P] [NormedAddTorsor V P] (A B C : P)
    (hAB : dist A B = 6) (hBC : dist B C = 7) (hAC : dist A C = 8) :
    ∠ A B C ≠ Real.pi / 2 ∧ ∠ B C A ≠ Real.pi / 2 ∧ ∠ C A B ≠ Real.pi / 2 := by
  refine ⟨fun h => ?_, fun h => ?_, fun h => ?_⟩
  · have := (dist_sq_eq_dist_sq_add_dist_sq_iff_angle_eq_pi_div_two A B C).mpr h
    rw [dist_comm C B, hAB, hBC, hAC] at this
    norm_num at this
  · have := (dist_sq_eq_dist_sq_add_dist_sq_iff_angle_eq_pi_div_two B C A).mpr h
    rw [dist_comm B A, hAB, hBC, hAC] at this
    norm_num at this
  · have := (dist_sq_eq_dist_sq_add_dist_sq_iff_angle_eq_pi_div_two C A B).mpr h
    rw [dist_comm C B, dist_comm C A, dist_comm B A, hAB, hBC, hAC] at this
    norm_num at this

/-- Predpostavke `trikotnik_678_brez_pravega` se dajo izpolniti: A = (0, 0), B = (51/16, √6615/16),
C = (8, 0) v ravnini. -/
example : dist (!₂[0, 0] : R2) !₂[51 / 16, Real.sqrt 6615 / 16] = 6 ∧
    dist (!₂[51 / 16, Real.sqrt 6615 / 16] : R2) !₂[8, 0] = 7 ∧ dist (!₂[0, 0] : R2) !₂[8, 0] = 8 := by
  refine ⟨?_, ?_, ?_⟩ <;> rw [EuclideanSpace.dist_eq] <;>
    simp [Fin.sum_univ_two, Real.dist_eq, sq_abs, div_pow, Real.sq_sqrt (by norm_num : (0:ℝ) ≤ 6615)] <;>
    rw [Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)] <;> norm_num

/-! ## Razlaga 3, 4, 5: podobnost in razmerje podobnosti -/

/-- Razlaga 3 (definicija, smer ⇒): podobna trikotnika imata skladne ustrezne kote.
trditev: MAT-OS-9/podobni-trikotniki#podobna-koti
besedilo: »ustrezni koti so skladni: $\alpha = \alpha'$, $\beta = \beta'$, $\gamma = \gamma'$« -/
theorem podobna_koti {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] {a b c a' b' c' : P} (h : ![a, b, c] ∼ ![a', b', c']) :
    ∠ a b c = ∠ a' b' c' ∧ ∠ b c a = ∠ b' c' a' ∧ ∠ c a b = ∠ c' a' b' :=
  h.angle_eq_all

/-- Razlaga 3 in 4 (definicija, smer ⇒): pri podobnih trikotnikih obstaja k > 0, da je a' = ka, b' = kb,
c' = kc (vse tri ustrezne stranice v istem razmerju k).
trditev: MAT-OS-9/podobni-trikotniki#podobna-stranice
besedilo: »ustrezne stranice so v istem razmerju: $$\frac{a'}{a} = \frac{b'}{b} = \frac{c'}{c} = k$$« -/
theorem podobna_stranice {P : Type*} [MetricSpace P] {a b c a' b' c' : P}
    (h : ![a, b, c] ∼ ![a', b', c']) :
    ∃ k : ℝ, 0 < k ∧ dist a' b' = k * dist a b ∧ dist b' c' = k * dist b c ∧ dist c' a' = k * dist c a := by
  have h' := (Similar.symm h)
  rw [similar_iff_exists_pos_dist_eq] at h'
  obtain ⟨k, hk, hd⟩ := h'
  exact ⟨k, hk, hd 0 1, hd 1 2, hd 2 0⟩

/-- Primer za `podobna_koti` in `podobna_stranice`: trikotnik je podoben sam sebi (predpostavka se da
izpolniti). -/
example : ![(!₂[0, 0] : R2), !₂[1, 0], !₂[0, 1]] ∼ ![(!₂[0, 0] : R2), !₂[1, 0], !₂[0, 1]] := Similar.refl _

/-- Razlaga 4: pri stranici a > 0 je k > 1 povečava (ka > a), k < 1 pomanjšava (ka < a), k = 1 skladnost
(ka = a).
trditev: MAT-OS-9/podobni-trikotniki#razmerje-k
besedilo: »$k > 1$: drugi trikotnik je povečava. - $k < 1$: drugi trikotnik je pomanjšava. - $k = 1$: trikotnika sta skladna.« -/
theorem razmerje_k (a k : ℝ) (ha : 0 < a) :
    (1 < k → a < k * a) ∧ (k < 1 → k * a < a) ∧ (k = 1 → k * a = a) := by
  refine ⟨fun h => by nlinarith, fun h => by nlinarith, fun h => by rw [h, one_mul]⟩

/-- Predpostavka `razmerje_k` se da izpolniti (a = 3). -/
example : (0:ℝ) < 3 := by norm_num

/-- Razlaga 5: množenje s k > 0 ohrani vrstni red stranic (najkrajša ostane najkrajša).
trditev: MAT-OS-9/podobni-trikotniki#vrstni-red
besedilo: »Najkrajša stranica ustreza najkrajši, najdaljša najdaljši.« -/
theorem vrstni_red (a b k : ℝ) (hk : 0 < k) : a < b ↔ k * a < k * b := (mul_lt_mul_iff_right₀ hk).symm

/-- Predpostavka `vrstni_red` se da izpolniti (k = 2). -/
example : (0:ℝ) < 2 := by norm_num

/-! ## Razlaga 6: izreki o podobnosti -/

/-- Razlaga 6 (KK): če se ujemata dva para kotov, sta trikotnika podobna.
trditev: MAT-OS-9/podobni-trikotniki#kk
besedilo: »Dovolj je eno od naslednjega: - **KK:** dva para ustreznih kotov sta skladna.« -/
theorem kk {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] {a b c a' b' c' : P} (hnc : ¬ Collinear ℝ {a, b, c})
    (h₁ : ∠ a b c = ∠ a' b' c') (h₂ : ∠ b c a = ∠ b' c' a') : ![a, b, c] ∼ ![a', b', c'] :=
  similar_of_angle_angle hnc h₁ h₂

/-- Pomožno: (0, 0), (1, 0), (0, 1) niso kolinearne (trikotnik v ravnini obstaja).
pomozno – priča, da nekolinearen trikotnik v ravnini obstaja (za primer izpolnljivosti); ni v besedilu lekcije -/
theorem trikotnik_ravnina : ¬ Collinear ℝ ({!₂[0, 0], !₂[1, 0], !₂[0, 1]} : Set R2) := by
  rw [collinear_iff_of_mem (p₀ := !₂[0, 0]) (by simp)]
  rintro ⟨v, hv⟩
  obtain ⟨r1, h1⟩ := hv !₂[1, 0] (by simp)
  obtain ⟨r2, h2⟩ := hv !₂[0, 1] (by simp)
  have a0 := congrArg (fun p : R2 => p 0) h1
  have a1 := congrArg (fun p : R2 => p 1) h1
  have b0 := congrArg (fun p : R2 => p 0) h2
  have b1 := congrArg (fun p : R2 => p 1) h2
  simp at a0 a1 b0 b1
  rcases a1 with h | h
  · rw [h] at a0; norm_num at a0
  · rw [h] at b1; norm_num at b1

/-- Predpostavke `kk` se dajo izpolniti (isti nekolinearen trikotnik dvakrat). -/
example : ¬ Collinear ℝ ({!₂[0, 0], !₂[1, 0], !₂[0, 1]} : Set R2) ∧
    ∠ (!₂[0, 0] : R2) !₂[1, 0] !₂[0, 1] = ∠ (!₂[0, 0] : R2) !₂[1, 0] !₂[0, 1] ∧
    ∠ (!₂[1, 0] : R2) !₂[0, 1] !₂[0, 0] = ∠ (!₂[1, 0] : R2) !₂[0, 1] !₂[0, 0] :=
  ⟨trikotnik_ravnina, rfl, rfl⟩

/-- Razlaga 6, Premisli, Bolj natančno: v trikotniku je vsota kotov π (180°), zato se pri dveh parih
skladnih kotov ujema tudi tretji kot.
trditev: MAT-OS-9/podobni-trikotniki#tretji-kot
besedilo: »Če se ujemata dva para kotov, se ujema tudi tretji.« -/
theorem tretji_kot {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] {a b c a' b' c' : P} (hab : b ≠ a) (hab' : b' ≠ a')
    (h₁ : ∠ a b c = ∠ a' b' c') (h₂ : ∠ b c a = ∠ b' c' a') : ∠ c a b = ∠ c' a' b' := by
  have s := angle_add_angle_add_angle_eq_pi c hab
  have s' := angle_add_angle_add_angle_eq_pi c' hab'
  linarith

/-- Predpostavki `tretji_kot` se dasta izpolniti ((1, 0) ≠ (0, 0)). -/
example : (!₂[1, 0] : R2) ≠ !₂[0, 0] := by
  intro h
  have := congrArg (fun p : R2 => p 0) h
  simp at this

/-- Razlaga 6, Premisli (v stopinjah): γ = 180° − α − β, zato α = α', β = β' ⇒ γ = γ'.
trditev: MAT-OS-9/podobni-trikotniki#tretji-kot-stopinje
besedilo: »Vsota kotov v trikotniku je $180^\circ$, zato je tretji kot $\gamma = 180^\circ - \alpha - \beta$.« -/
theorem tretji_kot_stopinje (α β γ α' β' γ' : ℝ) (h : α + β + γ = 180) (h' : α' + β' + γ' = 180)
    (h₁ : α = α') (h₂ : β = β') : γ = 180 - α - β ∧ γ = γ' := ⟨by linarith, by linarith⟩

/-- Predpostavke `tretji_kot_stopinje` se dajo izpolniti (90°, 35°, 55° dvakrat). -/
example : (90:ℝ) + 35 + 55 = 180 := by norm_num

/-- Razlaga 6 (SSS): če so vse tri stranice pomnožene z istim k > 0 (a'/a = b'/b = c'/c = k), sta
trikotnika podobna.
trditev: MAT-OS-9/podobni-trikotniki#sss
besedilo: »**SSS:** vsi trije pari ustreznih stranic so v istem razmerju: $\dfrac{a'}{a} = \dfrac{b'}{b} = \dfrac{c'}{c}$.« -/
theorem sss {P : Type*} [MetricSpace P] {a b c a' b' c' : P} (hab : a ≠ b) (k : ℝ) (hk : 0 < k)
    (h1 : dist a' b' = k * dist a b) (h2 : dist b' c' = k * dist b c) (h3 : dist c' a' = k * dist c a) :
    ![a, b, c] ∼ ![a', b', c'] := by
  have hd : dist a b ≠ 0 := dist_ne_zero.mpr hab
  have hd' : dist a' b' ≠ 0 := by rw [h1]; exact mul_ne_zero hk.ne' hd
  refine similar_of_dist_mul_eq_dist_mul_eq hd hd' ?_ ?_
  · rw [h1, h2]; ring
  · rw [h1, h3]; ring

/-- Predpostavke `sss` se dajo izpolniti (isti trikotnik, k = 1). -/
example : (!₂[0, 0] : R2) ≠ !₂[1, 0] ∧ (0:ℝ) < 1 := by
  refine ⟨fun h => ?_, by norm_num⟩
  have := congrArg (fun p : R2 => p 0) h
  simp at this

/-- Razlaga 6 (SKS): dva para stranic v istem razmerju k > 0 in skladen kot med njima ⇒ podobna.
trditev: MAT-OS-9/podobni-trikotniki#sks
besedilo: »**SKS:** dva para ustreznih stranic sta v istem razmerju in kota, ki ju stranici oklepata, sta skladna.« -/
theorem sks {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] {a b c a' b' c' : P} (hnc : ¬ Collinear ℝ {a, b, c})
    (hnc' : ¬ Collinear ℝ {a', b', c'}) (k : ℝ) (h1 : dist a' b' = k * dist a b)
    (h2 : dist b' c' = k * dist b c) (hk : ∠ a b c = ∠ a' b' c') : ![a, b, c] ∼ ![a', b', c'] := by
  refine similar_of_side_angle_side hnc hnc' hk ?_
  rw [h1, h2]; ring

/-- Predpostavke `sks` se dajo izpolniti (isti nekolinearen trikotnik dvakrat, k = 1). -/
example : ¬ Collinear ℝ ({!₂[0, 0], !₂[1, 0], !₂[0, 1]} : Set R2) ∧
    dist (!₂[0, 0] : R2) !₂[1, 0] = 1 * dist (!₂[0, 0] : R2) !₂[1, 0] := ⟨trikotnik_ravnina, (one_mul _).symm⟩

/-! ## Razlaga 7: obseg -/

/-- Razlaga 7, Povzetek, Preveri se 3: o' = ka + kb + kc = k(a + b + c) = k·o.
trditev: MAT-OS-9/podobni-trikotniki#obseg
besedilo: »Če je razmerje podobnosti $k$, so v razmerju $k$ vse ustrezne dolžine, torej tudi obsega: $o' = k \cdot o$.« -/
theorem obseg (a b c k : ℝ) : k * a + k * b + k * c = k * (a + b + c) := by ring

/-- Razlaga 7: o = 3 + 4 + 5 = 12, o' = 6 + 8 + 10 = 24 = 2·12.
trditev: MAT-OS-9/podobni-trikotniki#obseg-letak
besedilo: »Pri nalepki in letaku je $o = 12\,\text{cm}$ in $o' = 24\,\text{cm}$.« -/
theorem obseg_letak : (3:ℝ) + 4 + 5 = 12 ∧ (6:ℝ) + 8 + 10 = 24 ∧ (2:ℝ) * 12 = 24 := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: 36/3 = 48/4 = 60/5 = 12; edini k z 36 = 3k, 48 = 4k, 60 = 5k je 12 (SSS); o = 12, o' = 144
= 12·12.
trditev: MAT-OS-9/podobni-trikotniki#primer1
besedilo: »Obsega: $o = 3 + 4 + 5 = 12\,\text{cm}$ in $o' = 36 + 48 + 60 = 144\,\text{cm}$. Res je $o' = k \cdot o = 12 \cdot 12 = 144$ ✓.« -/
theorem primer1 (k : ℝ) :
    (36:ℝ) / 3 = 12 ∧ (48:ℝ) / 4 = 12 ∧ (60:ℝ) / 5 = 12 ∧ ((36 = k * 3 ∧ 48 = k * 4 ∧ 60 = k * 5) ↔ k = 12) ∧
      (3:ℝ) + 4 + 5 = 12 ∧ (36:ℝ) + 48 + 60 = 144 ∧ (12:ℝ) * 12 = 144 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ⟨fun h => by linarith [h.1], ?_⟩, by norm_num, by norm_num,
    by norm_num⟩
  rintro rfl
  norm_num

/-- Primer 2: k = 10/4 = 2,5; iz a'/a = b'/b = c'/c pri a = 4, b = 6, c = 8, a' = 10 sledi natanko
b' = 15, c' = 20 (b' = 2,5·6, c' = 2,5·8); preizkus 15/6 = 20/8 = 2,5.
trditev: MAT-OS-9/podobni-trikotniki#primer2
besedilo: »Odgovor: $b' = 15\,\text{cm}$ in $c' = 20\,\text{cm}$.« -/
theorem primer2 (k b' c' : ℝ) :
    ((10 = k * 4 ∧ b' = k * 6 ∧ c' = k * 8) ↔ (k = 2.5 ∧ b' = 15 ∧ c' = 20)) ∧ (10:ℝ) / 4 = 2.5 ∧
      (2.5:ℝ) * 6 = 15 ∧ (2.5:ℝ) * 8 = 20 ∧ (15:ℝ) / 6 = 2.5 ∧ (20:ℝ) / 8 = 2.5 := by
  refine ⟨⟨fun ⟨h1, h2, h3⟩ => ?_, fun ⟨h1, h2, h3⟩ => ?_⟩, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩
  · have hk : k = 2.5 := by norm_num; linarith
    subst hk
    refine ⟨rfl, by rw [h2]; norm_num, by rw [h3]; norm_num⟩
  · subst h1 h2 h3
    norm_num

/-- Primer 3: k = 150/5 = 30, o = 12, o' = 30·12 = 360; preizkus 30·3 = 90, 30·4 = 120, 90 + 120 + 150 =
360; 360 cm = 3,6 m; cena 3,6·6 = 21,6 €.
trditev: MAT-OS-9/podobni-trikotniki#primer3
besedilo: »Odgovor: trak stane $21{,}60\,€$.« -/
theorem primer3 :
    (150:ℝ) / 5 = 30 ∧ (3:ℝ) + 4 + 5 = 12 ∧ (30:ℝ) * 12 = 360 ∧ (30:ℝ) * 3 = 90 ∧ (30:ℝ) * 4 = 120 ∧
      (90:ℝ) + 120 + 150 = 360 ∧ (360:ℝ) / 100 = 3.6 ∧ (3.6:ℝ) * 6 = 21.6 := by norm_num

/-- Primer 4 in Premisli: h/1,5 = 12/2 ⇔ h = 9 (12/2 = 6, h = 6·1,5 = 9 m).
trditev: MAT-OS-9/podobni-trikotniki#primer4
besedilo: »$h = 6 \cdot 1{,}5\,\text{m} = 9\,\text{m}$.« -/
theorem primer4 (h : ℝ) : (h / 1.5 = 12 / 2 ↔ h = 9) ∧ (12:ℝ) / 2 = 6 ∧ (6:ℝ) * 1.5 = 9 := by
  refine ⟨⟨fun hh => ?_, fun hh => by rw [hh]; norm_num⟩, by norm_num, by norm_num⟩
  norm_num at hh
  linarith

/-! ## Pogoste napake -/

/-- Pogoste napake 2: pri k ≠ 0 je a' = ka ⇔ a = a'/k.
trditev: MAT-OS-9/podobni-trikotniki#obrnjeno
besedilo: »Če je $k = \dfrac{a'}{a}$, potem je $a' = k \cdot a$ in $a = \dfrac{a'}{k}$.« -/
theorem obrnjeno (a a' k : ℝ) (hk : k ≠ 0) : a' = k * a ↔ a = a' / k := by
  rw [eq_div_iff hk, mul_comm]
  exact eq_comm

/-- Predpostavka `obrnjeno` se da izpolniti (k = 2,5). -/
example : (2.5:ℝ) ≠ 0 := by norm_num

/-- Pogoste napake 3: 5 → 15 pomeni k = 3; 3·3 = 9, ne 3 + 10 = 13.
trditev: MAT-OS-9/podobni-trikotniki#sestevanje
besedilo: »Če se stranica $5$ poveča na $15$, se vsaka stranica ne podaljša za $10$, ampak se pomnoži s $3$.« -/
theorem sestevanje : (15:ℝ) / 5 = 3 ∧ (3:ℝ) * 3 = 9 ∧ (3:ℝ) + 10 = 13 ∧ (9:ℝ) ≠ 13 := by norm_num

/-- Pogoste napake 3, Povzetek, Z analogijo: prištevanje istega števila d > 0 spremeni razmerje, če stranici
nista enaki: (a + d)/a ≠ (c + d)/c pri a, c > 0, a ≠ c.
trditev: MAT-OS-9/podobni-trikotniki#pristevanje-splosno
besedilo: »Prištevanje istega števila spremeni obliko.« -/
theorem pristevanje_splosno (a c d : ℝ) (ha : 0 < a) (hc : 0 < c) (hac : a ≠ c) (hd : 0 < d) :
    (a + d) / a ≠ (c + d) / c := by
  rw [Ne, div_eq_div_iff ha.ne' hc.ne']
  intro h
  have : d * (c - a) = 0 := by linarith
  rcases mul_eq_zero.mp this with h' | h'
  · linarith
  · exact hac (by linarith)

/-- Predpostavke `pristevanje_splosno` se dajo izpolniti (a = 3, c = 5, d = 3). -/
example : (0:ℝ) < 3 ∧ (0:ℝ) < 5 ∧ (3:ℝ) ≠ 5 ∧ (0:ℝ) < 3 := by norm_num

/-- Z analogijo (recept): prištevanje c > 0 obema sestavinama a ≠ b (b > 0) pokvari razmerje: a/b ≠ (a + c)/(b + c).
trditev: MAT-OS-9/podobni-trikotniki#recept
besedilo: »Če pa vsaki sestavini prišteješ $100\,\text{g}$, se razmerje sestavin pokvari« -/
theorem recept (a b c : ℝ) (hb : 0 < b) (hab : a ≠ b) (hc : 0 < c) :
    a / b ≠ (a + c) / (b + c) := by
  rw [Ne, div_eq_div_iff hb.ne' (by linarith)]
  intro h
  apply hab
  have : c * (a - b) = 0 := by linarith
  rcases mul_eq_zero.mp this with h' | h'
  · linarith
  · linarith

/-- Predpostavke `recept` se dajo izpolniti (a = 200, b = 500, c = 100). -/
example : (0:ℝ) < 500 ∧ (200:ℝ) ≠ 500 ∧ (0:ℝ) < 100 := by norm_num

/-- Z analogijo (recept 4 → 8 oseb): podvojitev vsake sestavine ohrani razmerje: (2a)/(2b) = a/b.
trditev: MAT-OS-9/podobni-trikotniki#recept-podvojen
besedilo: »Če recept za palačinke za $4$ osebe preračunaš za $8$ oseb, podvojiš **vsako** sestavino: moko, mleko in jajca. Palačinke so enake, le več jih je.« -/
theorem recept_podvojen (a b : ℝ) : (2 * a) / (2 * b) = a / b := by
  rw [mul_div_mul_left a b (by norm_num : (2:ℝ) ≠ 0)]

/-- Pogoste napake 4: eno ujemajoče razmerje, enak obseg ali enakokrakost ne zadoščajo: 4, 6, 8 in 6, 9, 13
(6/4 = 9/6, a 13/8 = 1,625 ≠ 1,5); 3, 4, 5 in 4, 4, 4 (oba obseg 12); 2, 2, 3 in 2, 2, 1 (oba enakokraka);
v nobenem paru ni k, da bi bile vse tri stranice, urejene po velikosti (2, 2, 3 ↔ 1, 2, 2), pomnožene s k. Vsi so trikotniki (trikotniška neenakost).
trditev: MAT-OS-9/podobni-trikotniki#premalo
besedilo: »Eno samo ujemajoče se razmerje stranic, enak obseg ali to, da sta oba trikotnika enakokraka, še ne pomeni podobnosti.« -/
theorem premalo :
    ((6:ℝ) / 4 = 1.5 ∧ (9:ℝ) / 6 = 1.5 ∧ (13:ℝ) / 8 = 1.625 ∧ (1.625:ℝ) ≠ 1.5 ∧
      ¬ ∃ k : ℝ, 6 = k * 4 ∧ 9 = k * 6 ∧ 13 = k * 8) ∧ (13:ℝ) < 6 + 9 ∧
    ((3:ℝ) + 4 + 5 = 4 + 4 + 4 ∧ ¬ ∃ k : ℝ, 4 = k * 3 ∧ 4 = k * 4 ∧ 4 = k * 5) ∧
    ((¬ ∃ k : ℝ, 1 = k * 2 ∧ 2 = k * 2 ∧ 2 = k * 3) ∧ (3:ℝ) < 2 + 2 ∧ (1:ℝ) < 2 + 2) := by
  refine ⟨⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩, by norm_num, ⟨by norm_num, ?_⟩,
    ⟨?_, by norm_num, by norm_num⟩⟩
  · rintro ⟨k, h1, _, h3⟩; linarith
  · rintro ⟨k, h1, h2, _⟩; linarith
  · rintro ⟨k, h1, h2, _⟩; linarith

/-! ## Bolj natančno: ploščine -/

/-- Bolj natančno, Pogoste napake 5: ploščina pravokotnega trikotnika s katetama ka, kb je
(ka)(kb)/2 = k²·(ab/2).
pomozno – izrek dokaže k² le za pravokotni trikotnik s katetama (ploščina ab/2); lekcija trdi za vse podobne trikotnike -/
theorem ploscina (a b k : ℝ) : (k * a) * (k * b) / 2 = k ^ 2 * (a * b / 2) := by ring

/-- Bolj natančno: 3·4/2 = 6, 6·8/2 = 24 = 2²·6.
trditev: MAT-OS-9/podobni-trikotniki#ploscina-primer
besedilo: »in ploščino $\dfrac{6 \cdot 8}{2} = 24\,\text{cm}^2$. Res je $24 = 2^2 \cdot 6$.« -/
theorem ploscina_primer : (3:ℝ) * 4 / 2 = 6 ∧ (6:ℝ) * 8 / 2 = 24 ∧ (24:ℝ) = 2 ^ 2 * 6 := by norm_num

/-! ## Iz vsakdanjega življenja -/

/-- Iz vsakdanjega življenja: 1 cm na zemljevidu 1 : 100 000 je 100 000 cm = 1000 m = 1 km; maketa
1 : 18: dolžina d na avtu je na maketi d/18 (18-krat krajša).
trditev: MAT-OS-9/podobni-trikotniki#merilo
besedilo: »Na zemljevidu z merilom $1 : 100\,000$ je $1\,\text{cm}$ v resnici $100\,000\,\text{cm} = 1\,\text{km}$.« -/
theorem merilo (d : ℝ) : (100000:ℝ) / 100 = 1000 ∧ (1000:ℝ) / 1000 = 1 ∧ 18 * (d / 18) = d := by
  refine ⟨by norm_num, by norm_num, by ring⟩

/-- Iz vsakdanjega življenja (senca): če so sence sorazmerne višinam (s/h = S/H, h, H > 0) in je s = 2h,
je S = 2H.
trditev: MAT-OS-9/podobni-trikotniki#senca
besedilo: »Če je tvoja senca dvakrat daljša od tvoje višine, je tudi senca stolpa dvakrat daljša od njegove višine.« -/
theorem senca (h s H S : ℝ) (hh : 0 < h) (hH : 0 < H) (hp : s / h = S / H) (hs : s = 2 * h) :
    S = 2 * H := by
  rw [hs, mul_div_assoc, div_self hh.ne', mul_one, eq_div_iff hH.ne'] at hp
  linarith

/-- Predpostavke `senca` se dajo izpolniti (h = 1,5, s = 3, H = 10, S = 20). -/
example : (0:ℝ) < 1.5 ∧ (0:ℝ) < 10 ∧ (3:ℝ) / 1.5 = 20 / 10 ∧ (3:ℝ) = 2 * 1.5 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 1: tretji kot je pri obeh 180° − 90° − 35° = 55°, zato se ujemajo vsi koti (KK).
trditev: MAT-OS-9/podobni-trikotniki#preveri1
besedilo: »Tretji kot je pri obeh $180^\circ - 90^\circ - 35^\circ = 55^\circ$.« -/
theorem preveri1 : (180:ℝ) - 90 - 35 = 55 := by norm_num

/-- Preveri se 2: Q (1; 1,5; 2), P (4, 6, 8), R (6, 9, 12) so podobni 2, 3, 4 z razmerji 0,5 < 2 < 3
(vsaka trojica s svojim k).
trditev: MAT-OS-9/podobni-trikotniki#preveri2
besedilo: »Razmerja so $Q$: $\dfrac{1}{2} = 0{,}5$, $P$: $\dfrac{4}{2} = 2$ in $R$: $\dfrac{6}{2} = 3$.« -/
theorem preveri2 :
    ((1:ℝ) = 0.5 * 2 ∧ (1.5:ℝ) = 0.5 * 3 ∧ (2:ℝ) = 0.5 * 4) ∧ ((4:ℝ) = 2 * 2 ∧ (6:ℝ) = 2 * 3 ∧ (8:ℝ) = 2 * 4) ∧
      ((6:ℝ) = 3 * 2 ∧ (9:ℝ) = 3 * 3 ∧ (12:ℝ) = 3 * 4) ∧ (0.5:ℝ) < 2 ∧ (2:ℝ) < 3 ∧ (1:ℝ) / 2 = 0.5 := by
  norm_num

/-- Preveri se 3: o' = 3o, kar ni o + 3 (razen pri o = 1,5) in ni 9o (razen pri o = 0).
trditev: MAT-OS-9/podobni-trikotniki#preveri3
besedilo: »$o' = 3a + 3b + 3c = 3(a + b + c) = 3 \cdot o$.« -/
theorem preveri3 (a b c : ℝ) (ho : 0 < a + b + c) :
    3 * a + 3 * b + 3 * c = 3 * (a + b + c) ∧ 3 * (a + b + c) ≠ 9 * (a + b + c) ∧
      (3 * (a + b + c) = (a + b + c) + 3 ↔ a + b + c = 1.5) := by
  refine ⟨by ring, fun h => by linarith, ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩⟩

/-- Predpostavka `preveri3` se da izpolniti (3 + 4 + 5 > 0). -/
example : (0:ℝ) < 3 + 4 + 5 := by norm_num

/-- Preveri se 4: k = 15/5 = 3, ustrezna stranica 3·4 = 12 cm (napačno 4 + 10 = 14 in 4/3).
trditev: MAT-OS-9/podobni-trikotniki#preveri4
besedilo: »Razmerje podobnosti je $k = \dfrac{15}{5} = 3$, zato je ustrezna stranica $3 \cdot 4 = 12\,\text{cm}$.« -/
theorem preveri4 (x : ℝ) : (15:ℝ) / 5 = 3 ∧ (x = 3 * 4 ↔ x = 12) ∧ (4:ℝ) + 10 = 14 ∧ (12:ℝ) ≠ 14 ∧
    (4:ℝ) / 3 ≠ 12 := by
  refine ⟨by norm_num, ⟨fun h => by rw [h]; norm_num, fun h => by rw [h]; norm_num⟩, by norm_num,
    by norm_num, by norm_num⟩

/-- Preveri se 5: k = 100/5 = 20, o' = 20·12 = 240 cm = 2,4 m, cena 2,4·3 = 7,2 €; napačni: 240·3 = 720,
k² = 400, 12·400 = 4800 cm = 48 m, 48·3 = 144; +95 cm vsaki stranici: 12 + 3·95 = 297 cm, 2,97·3 = 8,91.
trditev: MAT-OS-9/podobni-trikotniki#preveri5
besedilo: »$k = \dfrac{100}{5} = 20$, $o' = 20 \cdot 12 = 240\,\text{cm} = 2{,}4\,\text{m}$, cena $2{,}4 \cdot 3 = 7{,}2$, torej $7{,}20\,€$.« -/
theorem preveri5 :
    (100:ℝ) / 5 = 20 ∧ (20:ℝ) * 12 = 240 ∧ (240:ℝ) / 100 = 2.4 ∧ (2.4:ℝ) * 3 = 7.2 ∧ (240:ℝ) * 3 = 720 ∧
      (20:ℝ) ^ 2 = 400 ∧ (12:ℝ) * 400 / 100 * 3 = 144 ∧ (100:ℝ) - 5 = 95 ∧
      ((12:ℝ) + 3 * 95) / 100 * 3 = 8.91 := by norm_num

end Evklid.Lekcije.MAT_OS_9.PodobniTrikotniki
