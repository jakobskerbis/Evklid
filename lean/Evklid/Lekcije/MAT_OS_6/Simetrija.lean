/-
vir: content/lessons/MAT-OS-6/simetrija.md
sha256: 3f48a2f34d17297f3c66dcd97ecdbad553a7aeb6c0cda5b07cd7cf479e7f95cd
Model: zrcaljenje čez os o je `EuclideanGeometry.reflection o` iz Mathliba v evklidskem prostoru P (ravnina ali
prostor, pri ogledalu v kvizu 4 je os ravnina ogledala); o je neprazen afin podprostor z ortogonalno projekcijo.
Razdalja točke od osi je `Metric.infDist A o` (najkrajša razdalja, enaka razdalji do pravokotne projekcije F, tj.
»po pravokotnici«). Zgledi izpolnljivosti so v ravnini ℂ z osjo `perpBisector a b` (simetrala daljice).
Računi na mreži (razlaga 1) so v kvadratkih kot razlike koordinat x (os x = 5).
Ni v Leanu: obrnjena smer obhoda (A → B → C proti A' → B' → C') in »zrcaljenja ne moreš nadomestiti z vrtenjem«
(zahtevno, še ni dokazano: usmerjeni koti pri zrcaljenju); ohranitev ploščine (zahtevno, še ni dokazano: mera v
splošnem P; dokazane so dolžine, koti in obseg trikotnika); tabela števila simetrijskih osi likov (daljica 2, kot 1,
…, krog neskončno), osi črk A, H, F, kviz 2 (razvrstitev po številu osi) in premisli o diagonali pravokotnika
(zahtevno, še ni dokazano: »natanko k osi« zahteva opis vseh izometrij lika); konstrukcija s šestilom in prepogib kot
postopka (dokazano je, da je A' na pravokotnici skozi A, |FA'| = |FA|, in da je os simetrala daljice AA');
simulacija »Zrcaljenje čez os in središčna simetrija«; zgodbe in primeri iz življenja (trgovina, logotip, izložba,
odbojka, reševalno vozilo, jezero) in kviz 1 (ime pojma »simetrijska os«) so opis; »Zrcaljenje nikoli ne spremeni
velikosti« je dokazano kot ohranitev razdalj.
Napačni odgovori kvizov: dokazano je, da napačne vrednosti niso pravilne.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.Simetrija

open EuclideanGeometry AffineSubspace

/-! ## Razlaga 2, 3, 6: zrcaljenje točke -/

/-- Razlaga 2 in Povzetek: os o je (del) simetrale daljice AA' (A' slika A); zrcaljenje čez simetralo daljice AB
preslika A v B.
trditev: MAT-OS-6/simetrija#simetrala
besedilo: »Zrcaljenje čez premico $o$: točki $A$ priredimo $A'$ tako, da je $o$ simetrala daljice $AA'$.« -/
theorem simetrala {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (o : AffineSubspace ℝ P) [Nonempty o] [o.direction.HasOrthogonalProjection] (A B : P) :
    o ≤ perpBisector A (reflection o A) ∧ reflection (perpBisector A B) A = B :=
  ⟨le_perpBisector_self_reflection o A, reflection_perpBisector_left A B⟩

example := simetrala (perpBisector (0 : ℂ) 2) 0 2

/-- Razlaga 2 in Povzetek: točka je sama sebi slika natanko tedaj, ko leži na osi.
trditev: MAT-OS-6/simetrija#na-osi
besedilo: »Točka, ki leži na osi, je sama sebi slika: $A' = A$.« -/
theorem na_osi {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (o : AffineSubspace ℝ P) [Nonempty o] [o.direction.HasOrthogonalProjection] (A : P) :
    reflection o A = A ↔ A ∈ o :=
  reflection_eq_self_iff A

example := na_osi (perpBisector (0 : ℂ) 2) 1

/-- Razlaga 2, 6, Povzetek in Pogoste napake 3: točka in slika sta enako daleč od osi (d' = d), razdalja med
njima je |AA'| = 2d.
trditev: MAT-OS-6/simetrija#enako-dalec
besedilo: »Daljica $AA'$ je pravokotna na os, točka in slika sta enako daleč od osi: $d' = d$, $\lvert AA'\rvert = 2d$.« -/
theorem enako_dalec {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (o : AffineSubspace ℝ P) [Nonempty o] [o.direction.HasOrthogonalProjection] (A : P) :
    Metric.infDist (reflection o A) o = Metric.infDist A o ∧
      dist A (reflection o A) = 2 * Metric.infDist A o := by
  constructor
  · rw [Metric.infDist_eq_iInf, Metric.infDist_eq_iInf]
    congr 1
    ext x
    rw [dist_comm, dist_reflection_eq_of_mem o x.2, dist_comm]
  · rw [← dist_orthogonalProjection_eq_infDist, reflection_apply', dist_eq_norm_vsub V, dist_eq_norm_vsub V,
      vsub_vadd_eq_vsub_sub]
    have h : A -ᵥ (orthogonalProjection o A : P) - ((orthogonalProjection o A : P) -ᵥ A) =
        (2 : ℝ) • (A -ᵥ (orthogonalProjection o A : P)) := by
      rw [← neg_vsub_eq_vsub_rev A, sub_neg_eq_add, two_smul]
    rw [h, norm_smul, Real.norm_two]

example := enako_dalec (perpBisector (0 : ℂ) 2) 0

/-- Razlaga 2 in Povzetek: daljica AA' je pravokotna na os (vektor A − A' je pravokoten na smer osi).
trditev: MAT-OS-6/simetrija#pravokotna
besedilo: »daljica $AA'$ je **pravokotna** na os,« -/
theorem pravokotna {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (o : AffineSubspace ℝ P) [Nonempty o] [o.direction.HasOrthogonalProjection] (A : P) :
    A -ᵥ reflection o A ∈ o.directionᗮ := by
  rw [reflection_apply', vsub_vadd_eq_vsub_sub]
  have h : A -ᵥ (orthogonalProjection o A : P) - ((orthogonalProjection o A : P) -ᵥ A) =
      (2 : ℝ) • (A -ᵥ (orthogonalProjection o A : P)) := by
    rw [← neg_vsub_eq_vsub_rev A, sub_neg_eq_add, two_smul]
  rw [h]
  exact Submodule.smul_mem _ _ (vsub_orthogonalProjection_mem_direction_orthogonal o A)

example := pravokotna (perpBisector (0 : ℂ) 2) 0

/-- Razlaga 3 in Povzetek (konstrukcija): F je presečišče pravokotnice skozi A z osjo (pravokotna projekcija);
slika A' leži na drugi strani F na isti premici, |FA'| = |FA| (A' − F = F − A).
trditev: MAT-OS-6/simetrija#konstrukcija
besedilo: »Konstrukcija: pravokotnica skozi točko, razdaljo do osi preneseš na drugo stran.« -/
theorem konstrukcija {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (o : AffineSubspace ℝ P) [Nonempty o] [o.direction.HasOrthogonalProjection] (A : P) :
    reflection o A -ᵥ (orthogonalProjection o A : P) = (orthogonalProjection o A : P) -ᵥ A ∧
      dist (orthogonalProjection o A : P) (reflection o A) = dist (orthogonalProjection o A : P) A := by
  have h1 : reflection o A -ᵥ (orthogonalProjection o A : P) = (orthogonalProjection o A : P) -ᵥ A := by
    rw [reflection_apply', vadd_vsub]
  refine ⟨h1, ?_⟩
  rw [dist_comm, dist_eq_norm_vsub V, h1, ← dist_eq_norm_vsub V]

example := konstrukcija (perpBisector (0 : ℂ) 2) 0

/-- Razlaga 7 in Pogoste napake 1: razdalja točke do osi (tudi poševne) je razdalja po pravokotnici, do
presečišča F pravokotnice z osjo (pravokotne projekcije).
trditev: MAT-OS-6/simetrija#po-pravokotnici
besedilo: »Razdalja do premice je razdalja po pravokotnici.« -/
theorem po_pravokotnici {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (o : AffineSubspace ℝ P) [Nonempty o] [o.direction.HasOrthogonalProjection] (A : P) :
    Metric.infDist A o = dist A (orthogonalProjection o A : P) ∧
      A -ᵥ (orthogonalProjection o A : P) ∈ o.directionᗮ :=
  ⟨(dist_orthogonalProjection_eq_infDist o A).symm, vsub_orthogonalProjection_mem_direction_orthogonal o A⟩

example := po_pravokotnici (perpBisector (0 : ℂ) 2) 0

/-! ## Razlaga 4: kaj se ohrani -/

/-- Razlaga 4, Povzetek in Iz vsakdanjega življenja: zrcaljenje ohrani dolžine in velikosti kotov, zato tudi obseg
trikotnika; slika je skladna z izvirnikom.
trditev: MAT-OS-6/simetrija#ohrani
besedilo: »Ohranijo se dolžine stranic, velikosti kotov, obseg in ploščina.« -/
theorem ohrani {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (o : AffineSubspace ℝ P) [Nonempty o] [o.direction.HasOrthogonalProjection] (A B C : P) :
    dist (reflection o A) (reflection o B) = dist A B ∧
      ∠ (reflection o A) (reflection o B) (reflection o C) = ∠ A B C ∧
      dist (reflection o A) (reflection o B) + dist (reflection o B) (reflection o C) +
          dist (reflection o C) (reflection o A) = dist A B + dist B C + dist C A := by
  have hd : ∀ X Y : P, dist (reflection o X) (reflection o Y) = dist X Y := fun X Y => (reflection o).dist_map X Y
  refine ⟨hd A B, ?_, by rw [hd, hd, hd]⟩
  simpa using (reflection o).toAffineIsometry.angle_map A B C

example := ohrani (perpBisector (0 : ℂ) 2) 0 1 Complex.I

/-! ## Razlaga 1, 2, 6: računi na mreži -/

/-- Razlaga 1: os x = 5; A (x = 1) in A' (x = 9) sta 4 kvadratke od osi, B (4) in B' (6) 1 kvadratek, C (2) in
C' (8) 3 kvadratke; os seka AA', BB', CC' na sredini.
trditev: MAT-OS-6/simetrija#razlaga-1
besedilo: »Pri $B$ in $B'$ je razdalja do osi $1$ kvadratek, pri $C$ in $C'$ pa $3$.« -/
theorem razlaga1 :
    (5 : ℝ) - 1 = 4 ∧ (9 : ℝ) - 5 = 4 ∧ (5 : ℝ) - 4 = 1 ∧ (6 : ℝ) - 5 = 1 ∧ (5 : ℝ) - 2 = 3 ∧ (8 : ℝ) - 5 = 3 ∧
      ((1 : ℝ) + 9) / 2 = 5 ∧ ((4 : ℝ) + 6) / 2 = 5 ∧ ((2 : ℝ) + 8) / 2 = 5 := by
  norm_num

/-- Razlaga 2 (premisli): C 1 kvadratek bliže osi: obe točki sta 2 kvadratka od osi, |CC'| = 2 + 2 = 4 namesto 6.
trditev: MAT-OS-6/simetrija#premisli-c
besedilo: »Obe točki sta zdaj $2$ kvadratka od osi, zato je $CC'$ dolga $2 + 2 = 4$ kvadratke namesto $6$.« -/
theorem premisli_c : (3 : ℝ) - 1 = 2 ∧ (2 : ℝ) + 2 = 4 ∧ (3 : ℝ) + 3 = 6 := by norm_num

/-- Razlaga 6: d = 4 kvadratke, |AA'| = 2·4 = 8 kvadratkov.
trditev: MAT-OS-6/simetrija#razlaga-6
besedilo: »Za točko $A$ na sliki je $d = 4$ kvadratke, zato je $\lvert AA'\rvert = 2 \cdot 4 = 8$ kvadratkov.« -/
theorem razlaga6 : (2 : ℝ) * 4 = 8 := by norm_num

/-- Kviz 3 in Z analogijo: če se točka od osi odmakne za 1 (d → d + 1), se razdalja do slike poveča za 2:
2·(d + 1) = 2·d + 2; pri d = 2: 4 cm → 6 cm.
trditev: MAT-OS-6/simetrija#odmik
besedilo: »Razdalja med njima se poveča za dva koraka, to je $\lvert AA'\rvert = 2d$.« -/
theorem odmik (d : ℝ) : 2 * (d + 1) = 2 * d + 2 := by ring

/-- Kviz 3: prej d = 2 cm, |AA'| = 4 cm; potem d = 3 cm, |AA'| = 6 cm, 2 cm več (ne 1 cm).
trditev: MAT-OS-6/simetrija#kviz-3
besedilo: »Prej: $d = 2\,\text{cm}$, $\lvert AA'\rvert = 4\,\text{cm}$. Potem: $d = 3\,\text{cm}$, $\lvert AA'\rvert = 6\,\text{cm}$, kar je $2\,\text{cm}$ več.« -/
theorem kviz3 : (2 : ℝ) * 2 = 4 ∧ (2 : ℝ) + 1 = 3 ∧ (2 : ℝ) * 3 = 6 ∧ (6 : ℝ) - 4 = 2 ∧ (6 : ℝ) - 4 ≠ 1 := by
  norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: točka A, 3 cm od osi: slika A' je 3 cm od osi (na drugi strani), |AA'| = 2·3 = 6 cm.
trditev: MAT-OS-6/simetrija#primer-1
besedilo: »Odgovor: $A'$ je na drugi strani osi, $3\,\text{cm}$ od nje, na pravokotnici skozi $A$; od $A$ je oddaljena $6\,\text{cm}$.« -/
theorem primer1 {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (o : AffineSubspace ℝ P) [Nonempty o] [o.direction.HasOrthogonalProjection] (A : P)
    (hd : Metric.infDist A o = 3) :
    Metric.infDist (reflection o A) o = 3 ∧ dist A (reflection o A) = 6 ∧ (2 : ℝ) * 3 = 6 := by
  obtain ⟨h1, h2⟩ := enako_dalec o A
  refine ⟨by rw [h1, hd], by rw [h2, hd]; norm_num, by norm_num⟩

example := primer1 (perpBisector (0 : ℂ) 6) 0 (by
  have h := (enako_dalec (perpBisector (0 : ℂ) 6) 0).2
  rw [reflection_perpBisector_left, dist_comm, Complex.dist_eq, sub_zero] at h
  norm_num at h
  linarith)

/-- Primer 2: |AA'| = 2·2 = 4 cm, |BB'| = 2·5 = 10 cm, |CC'| = 2·2 = 4 cm; stranice slike 3, 4, 5 cm (glej
`ohrani`), obseg 3 + 4 + 5 = 12 cm.
trditev: MAT-OS-6/simetrija#primer-2
besedilo: »Obseg slike: $3\,\text{cm} + 4\,\text{cm} + 5\,\text{cm} = 12\,\text{cm}$, enako kot obseg izvirnika.« -/
theorem primer2 : (2 : ℝ) * 2 = 4 ∧ (2 : ℝ) * 5 = 10 ∧ (3 : ℝ) + 4 + 5 = 12 := by norm_num

/-- Primer 3 in kviz 5: os razpolovi daljico AA': iz |AA'| = 10 sledi d = 10 : 2 = 5 (kviz 5: 6 : 2 = 3 kvadratke;
napačna 6 in 8); polmer loka 7 cm je večji od 5 cm.
trditev: MAT-OS-6/simetrija#primer-3-razdalja
besedilo: »Os razpolovi daljico $AA'$, zato je $d = 10\,\text{cm} : 2 = 5\,\text{cm}$.« -/
theorem primer3_razdalja {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (o : AffineSubspace ℝ P) [Nonempty o] [o.direction.HasOrthogonalProjection] (A : P)
    (h : dist A (reflection o A) = 10) :
    Metric.infDist A o = 10 / 2 ∧ (10 : ℝ) / 2 = 5 ∧ (7 : ℝ) > 10 / 2 := by
  have h2 := (enako_dalec o A).2
  refine ⟨by linarith, by norm_num, by norm_num⟩

example := primer3_razdalja (perpBisector (0 : ℂ) 10) 0 (by
  rw [reflection_perpBisector_left, dist_comm, Complex.dist_eq, sub_zero]; norm_num)

/-- Primer 3: točka T na osi je od A' enako daleč kot od A: |TA'| = |TA| = 6 cm.
trditev: MAT-OS-6/simetrija#primer-3
besedilo: »$\lvert TA'\rvert = 6\,\text{cm}$. Točka $T$ leži na simetrali daljice $AA'$, zato je od $A'$ enako daleč kot od $A$.« -/
theorem primer3 {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (o : AffineSubspace ℝ P) [Nonempty o] [o.direction.HasOrthogonalProjection] (A T : P)
    (hT : T ∈ o) (hTA : dist T A = 6) : dist T (reflection o A) = 6 := by
  rw [dist_reflection_eq_of_mem o hT, hTA]

example := primer3 (perpBisector (0 : ℂ) 12) 0 6 (by
  rw [mem_perpBisector_iff_dist_eq, Complex.dist_eq, Complex.dist_eq]; norm_num) (by
  rw [Complex.dist_eq]; norm_num)

/-! ## Pogoste napake in Preveri se -/

/-- Pogoste napake 2: slika točke, ki ni na osi, je na nasprotni strani (os razpolovi AA': projekcija F je
razpolovišče daljice AA'), ni ista točka.
trditev: MAT-OS-6/simetrija#nasprotna-stran
besedilo: »Os mora razpoloviti daljico $AA'$, zato sta točka in slika na nasprotnih straneh.« -/
theorem nasprotna_stran {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (o : AffineSubspace ℝ P) [Nonempty o] [o.direction.HasOrthogonalProjection] (A : P) :
    midpoint ℝ A (reflection o A) = (orthogonalProjection o A : P) := by
  rw [midpoint_eq_iff', Equiv.pointReflection_apply, reflection_apply']

example := nasprotna_stran (perpBisector (0 : ℂ) 2) 0

/-- Kviz 4: listek 4,5 cm pred ogledalom: slika je 4,5 cm za ogledalom, razdalja 2·4,5 = 9 cm (ne 4,5 ne 2,25);
splošno pravilo |AA'| = 2d velja tudi za ogledalo (os je ravnina, glej `enako_dalec`).
trditev: MAT-OS-6/simetrija#kviz-4
besedilo: »Slika je $4{,}5\,\text{cm}$ za ogledalom, zato je razdalja $2 \cdot 4{,}5\,\text{cm} = 9\,\text{cm}$.« -/
theorem kviz4 : (2 : ℝ) * 4.5 = 9 ∧ (4.5 : ℝ) ≠ 9 ∧ (2.25 : ℝ) ≠ 9 ∧ (4.5 : ℝ) / 2 = 2.25 := by norm_num

/-- Kviz 5: med A in A' je 6 kvadratkov, os je od A oddaljena 6 : 2 = 3 kvadratke (ne 6, ne 8).
trditev: MAT-OS-6/simetrija#kviz-5
besedilo: »Os je simetrala daljice $AA'$, zato je od $A$ oddaljena $6 : 2 = 3$ kvadratke.« -/
theorem kviz5 : (8 : ℝ) - 2 = 6 ∧ (6 : ℝ) / 2 = 3 ∧ (6 : ℝ) ≠ 3 ∧ (8 : ℝ) ≠ 3 ∧ (2 : ℝ) + 3 = 5 := by norm_num

/-- RACUN: 2·4 = 8, 2 + 2 = 4, 2·3 = 6, 2·2 = 4, 2·5 = 10, 3 + 4 + 5 = 12, 10/2 = 5, 2·4,5 = 9, 6/2 = 3.
pomozno – ponovi vrstice bloka RACUN, ki ga učenec ne vidi; iste račune citirajo izreki primerov -/
theorem racun :
    (2 : ℝ) * 4 = 8 ∧ (2 : ℝ) + 2 = 4 ∧ (2 : ℝ) * 3 = 6 ∧ (2 : ℝ) * 2 = 4 ∧ (2 : ℝ) * 5 = 10 ∧
      (3 : ℝ) + 4 + 5 = 12 ∧ (10 : ℝ) / 2 = 5 ∧ (2 : ℝ) * 4.5 = 9 ∧ (6 : ℝ) / 2 = 3 := by
  norm_num

end Evklid.Lekcije.MAT_OS_6.Simetrija
