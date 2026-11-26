/-
vir: content/lessons/MAT-SS-3/grafi-kotnih-funkcij.md
sha256: 530510c505006f6793937ced4e464183719c8cd3e5f3c36e5ef53a6e266c024b
Ni v Leanu: aplikacija phyphox in žvižganje (»glasnejši/višji ton« kot fizikalni opis; dokazano je, da ima
2 sin x amplitudo 2 in periodo 2π, sin 2x pa amplitudo 1 in periodo π); risbe, simulaciji in drsniki (dokazane
so vrednosti, ničle, vrhovi, periode, zaloge vrednosti in točke, ki jih slike kažejo); »odvijanje krožnice na
os« (dolžina loka: zahtevno, še ni dokazano); »točke povežemo z gladko krivuljo«, opisni pojmi srednja črta,
premik in zrcaljenje (dokazane so enakosti, npr. sin(x − c) pri x = c je sin 0, sin(x + π/2) = cos x); vrstni
red transformacij v razdelku Bolj natančno kot opis (dokazano je sin(bx − p) = sin(b(x − p/b))); Primer 3:
resnični podatki (14 h 21 min, 186 dni med enakonočjema, »dva dni prezgodaj« glede na resnične datume) in
pretvorba dneva v datum (dokazane so vsote dni po mesecih); Primer 4: da graf s štirimi točkami določa A, b,
c, d (dokazano je, da predpis gre skozi točke, in da tudi c = 5, c = −3 in kosinusni zapis dajo isto
funkcijo); Naloga 3 c): pretvorba ur v ure in minute (dokazani so ulomki ure·60); Postopek, točkovanje.
Osnovna perioda je definirana kot `OsnovnaPerioda`: T > 0, f(x + T) = f(x) za vsak x in nobena pozitivna
perioda ni manjša. Leanove konvencije: tan x = sin x/cos x in x/0 = 0, zato je tan v polih enak 0; ničle
tangensa so zato zapisane s pogojem cos x ≠ 0. Koti so v radianih. »≈ a« na k decimalk je
a − ½·10⁻ᵏ < vrednost < a + ½·10⁻ᵏ. Meje za sin(84π/365) in sin(7,9π/6,2) so izračunane s Taylorjevima ocenama
za sin in cos ter šestkratnim podvajanjem kota (`zacetni`, `dvojno`).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.GrafiKotnihFunkcij

open Real Filter Topology Set

/-- Osnovna perioda funkcije f: T > 0 je perioda (f(x + T) = f(x) za vsak x) in nobena pozitivna perioda ni
manjša od T (razdelek 2). -/
def OsnovnaPerioda (f : ℝ → ℝ) (T : ℝ) : Prop :=
  0 < T ∧ (∀ x, f (x + T) = f x) ∧ ∀ S, 0 < S → (∀ x, f (x + S) = f x) → T ≤ S

/-! ## Pomožne trditve -/

/-- Pomožna trditev (računanje mej): za 0 < a ≤ 1 je a − a³/6 ≤ sin a ≤ a − a³/6 + a⁵/100 in
1 − a²/2 ≤ cos a ≤ 1 − a²/2 + 5a⁴/96 (Taylorjeve ocene iz Mathliba).
pomozno -/
theorem zacetni (a : ℝ) (h0 : 0 < a) (h1 : a ≤ 1) :
    a - a ^ 3 / 6 ≤ sin a ∧ sin a ≤ a - a ^ 3 / 6 + a ^ 5 / 100 ∧ 1 - a ^ 2 / 2 ≤ cos a ∧
    cos a ≤ 1 - a ^ 2 / 2 + a ^ 4 * (5 / 96) := by
  have hs := sin_bound (x := a) (by rw [abs_of_pos h0]; exact h1)
  have hc := cos_bound (x := a) (by rw [abs_of_pos h0]; exact h1)
  rw [abs_of_pos h0, abs_le] at hs hc
  exact ⟨sin_ge_sub_cube h0.le, by linarith, one_sub_sq_div_two_le_cos, by linarith⟩

/-- Pomožna trditev (računanje mej): ožje meje za sin in cos lahko oslabimo v širše.
pomozno -/
theorem oslabi {a sl sh cl ch sl' sh' cl' ch' : ℝ} (h : sl ≤ sin a ∧ sin a ≤ sh ∧ cl ≤ cos a ∧ cos a ≤ ch)
    (h1 : sl' ≤ sl) (h2 : sh ≤ sh') (h3 : cl' ≤ cl) (h4 : ch ≤ ch') :
    sl' ≤ sin a ∧ sin a ≤ sh' ∧ cl' ≤ cos a ∧ cos a ≤ ch' :=
  ⟨h1.trans h.1, h.2.1.trans h2, h3.trans h.2.2.1, h.2.2.2.trans h4⟩

/-- Pomožna trditev (računanje mej): iz mej za sin a, cos a (spodnji meji nenegativni) dobimo meje za kot 2a:
sin 2a = 2 sin a cos a, cos 2a = cos²a − sin²a.
pomozno -/
theorem dvojno {a a2 sl sh cl ch : ℝ} (h : sl ≤ sin a ∧ sin a ≤ sh ∧ cl ≤ cos a ∧ cos a ≤ ch)
    (hs : 0 ≤ sl) (hc : 0 ≤ cl) (he : 2 * a = a2) :
    2 * sl * cl ≤ sin a2 ∧ sin a2 ≤ 2 * sh * ch ∧ cl ^ 2 - sh ^ 2 ≤ cos a2 ∧ cos a2 ≤ ch ^ 2 - sl ^ 2 := by
  obtain ⟨h1, h2, h3, h4⟩ := h
  subst he
  have e1 : sin (2 * a) = 2 * sin a * cos a := sin_two_mul a
  have e2 : cos (2 * a) = cos a ^ 2 - sin a ^ 2 := by rw [cos_two_mul]; linarith [sin_sq_add_cos_sq a]
  have ps : 0 ≤ sin a := hs.trans h1
  have pc : 0 ≤ cos a := hc.trans h3
  refine ⟨?_, ?_, ?_, ?_⟩
  · rw [e1]; nlinarith [mul_le_mul h1 h3 hc ps]
  · rw [e1]; nlinarith [mul_le_mul h2 h4 pc (ps.trans h2)]
  · rw [e2]; nlinarith [pow_le_pow_left₀ hc h3 2, pow_le_pow_left₀ ps h2 2]
  · rw [e2]; nlinarith [pow_le_pow_left₀ pc h4 2, pow_le_pow_left₀ hs h1 2]

/-- Pomožna trditev: meje za sin 0,7229966654 (šestkratno podvajanje kota).
pomozno -/
theorem sin_c1 : (0.6616345888804183 : ℝ) ≤ sin 0.7229966654 ∧ sin 0.7229966654 ≤ 0.661634626145426 := by
  have h0 : (0.0112965826168267 : ℝ) ≤ sin 0.011296822896875 ∧ sin 0.011296822896875 ≤ 0.0112965826186667 ∧ (0.9999361908962183 : ℝ) ≤ cos 0.011296822896875 ∧ cos 0.011296822896875 ≤ 0.9999361917444687 :=
    oslabi (zacetni 0.011296822896875 (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h1 : (0.0225917235840282 : ℝ) ≤ sin 0.02259364579375 ∧ sin 0.02259364579375 ≤ 0.0225917236068727 ∧ (0.9997447730851779 : ℝ) ≤ cos 0.02259364579375 ∧ cos 0.02259364579375 ≤ 0.9997447747816121 :=
    oslabi (dvojno h0 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h2 : (0.0451719151362346 : ℝ) ≤ sin 0.0451872915875 ∧ sin 0.0451872915875 ≤ 0.0451719152585628 ∧ (0.9989792253356045 : ℝ) ≤ cos 0.0451872915875 ∧ cos 0.0451872915875 ≤ 0.9989792287286392 :=
    oslabi (dvojno h1 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h3 : (0.0902516095794426 : ℝ) ≤ sin 0.090374583175 ∧ sin 0.090374583175 ≤ 0.0902516101303891 ∧ (0.9959189907239976 : ℝ) ≤ cos 0.090374583175 ∧ cos 0.090374583175 ≤ 0.9959189975141917 :=
    oslabi (dvojno h2 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h4 : (0.1797665838471494 : ℝ) ≤ sin 0.18074916635 ∧ sin 0.18074916635 ≤ 0.1797665861701976 ∧ (0.9837092829535782 : ℝ) ≤ cos 0.18074916635 ∧ cos 0.18074916635 ≤ 0.9837092965779925 :=
    oslabi (dvojno h3 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h5 : (0.3536761145905872 : ℝ) ≤ sin 0.3614983327 ∧ sin 0.3614983327 ≤ 0.3536761240594244 ∧ (0.9353679278657558 : ℝ) ≤ cos 0.3614983327 ∧ cos 0.3614983327 ≤ 0.9353679555058947 :=
    oslabi (dvojno h4 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h6 : (0.6616345888804183 : ℝ) ≤ sin 0.7229966654 ∧ sin 0.7229966654 ≤ 0.661634626145426 ∧ (0.7498263597501803 : ℝ) ≤ cos 0.7229966654 ∧ cos 0.7229966654 ≤ 0.7498264181553833 :=
    oslabi (dvojno h5 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  exact ⟨h6.1, h6.2.1⟩
/-- Pomožna trditev: meje za sin 0,7229966655.
pomozno -/
theorem sin_c2 : (0.6616345889553981 : ℝ) ≤ sin 0.7229966655 ∧ sin 0.7229966655 ≤ 0.6616346262204099 := by
  have h0 : (0.0112965826183891 : ℝ) ≤ sin 0.0112968228984375 ∧ sin 0.0112968228984375 ≤ 0.0112965826202291 ∧ (0.9999361908962006 : ℝ) ≤ cos 0.0112968228984375 ∧ cos 0.0112968228984375 ≤ 0.9999361917444511 :=
    oslabi (zacetni 0.0112968228984375 (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h1 : (0.0225917235871524 : ℝ) ≤ sin 0.022593645796875 ∧ sin 0.022593645796875 ≤ 0.0225917236099969 ∧ (0.9997447730851072 : ℝ) ≤ cos 0.022593645796875 ∧ cos 0.022593645796875 ≤ 0.9997447747815416 :=
    oslabi (dvojno h0 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h2 : (0.0451719151424782 : ℝ) ≤ sin 0.04518729159375 ∧ sin 0.04518729159375 ≤ 0.0451719152648064 ∧ (0.9989792253353219 : ℝ) ≤ cos 0.04518729159375 ∧ cos 0.04518729159375 ≤ 0.9989792287283571 :=
    oslabi (dvojno h1 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h3 : (0.0902516095918915 : ℝ) ≤ sin 0.0903745831875 ∧ sin 0.0903745831875 ≤ 0.090251610142838 ∧ (0.9959189907228689 : ℝ) ≤ cos 0.0903745831875 ∧ cos 0.0903745831875 ≤ 0.995918997513064 :=
    oslabi (dvojno h2 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h4 : (0.1797665838717419 : ℝ) ≤ sin 0.180749166375 ∧ sin 0.180749166375 ≤ 0.1797665861947902 ∧ (0.983709282949083 : ℝ) ≤ cos 0.180749166375 ∧ cos 0.180749166375 ≤ 0.9837092965734992 :=
    oslabi (dvojno h3 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h5 : (0.3536761146373548 : ℝ) ≤ sin 0.36149833275 ∧ sin 0.36149833275 ≤ 0.3536761241061928 ∧ (0.9353679278480701 : ℝ) ≤ cos 0.36149833275 ∧ cos 0.36149833275 ≤ 0.9353679554882126 :=
    oslabi (dvojno h4 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h6 : (0.6616345889553981 : ℝ) ≤ sin 0.7229966655 ∧ sin 0.7229966655 ≤ 0.6616346262204099 ∧ (0.7498263596840133 : ℝ) ≤ cos 0.7229966655 ∧ cos 0.7229966655 ≤ 0.7498264180892236 :=
    oslabi (dvojno h5 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  exact ⟨h6.1, h6.2.1⟩
/-- Pomožna trditev: meje za sin 0,8614044372.
pomozno -/
theorem sin_d1 : (0.758758053977548 : ℝ) ≤ sin 0.8614044372 ∧ sin 0.8614044372 ≤ 0.7587581419654311 := by
  have h0 : (0.0134590379532942 : ℝ) ≤ sin 0.01345944433125 ∧ sin 0.01345944433125 ≤ 0.0134590379577114 ∧ (0.9999094216791469 : ℝ) ≤ cos 0.01345944433125 ∧ cos 0.01345944433125 ≤ 0.9999094233884038 :=
    oslabi (zacetni 0.01345944433125 (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h1 : (0.0269156377124721 : ℝ) ≤ sin 0.0269188886625 ∧ sin 0.0269188886625 ≤ 0.0269156377673157 ∧ (0.9996377058599788 : ℝ) ≤ cos 0.0269188886625 ∧ cos 0.0269188886625 ≤ 0.999637709278302 :=
    oslabi (dvojno h0 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h2 : (0.0538117726693078 : ℝ) ≤ sin 0.053837777325 ∧ sin 0.053837777325 ≤ 0.0538117729629681 ∧ (0.9985510914205801 : ℝ) ≤ cos 0.053837777325 ∧ cos 0.053837777325 ≤ 0.998551098257702 :=
    oslabi (dvojno h1 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h3 : (0.1074676086604268 : ℝ) ≤ sin 0.10767555465 ∧ sin 0.10767555465 ≤ 0.1074676099827319 ∧ (0.9942085752678136 : ℝ) ≤ cos 0.10767555465 ∧ cos 0.10767555465 ≤ 0.9942085889538496 :=
    oslabi (dvojno h2 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h4 : (0.2136904361874437 : ℝ) ≤ sin 0.2153511093 ∧ sin 0.2153511093 ≤ 0.2136904417583491 ∧ (0.9769014039406552 : ℝ) ≤ cos 0.2153511093 ∧ cos 0.2153511093 ≤ 0.9769014314384141 :=
    oslabi (dvojno h3 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h5 : (0.4175089742404094 : ℝ) ≤ sin 0.4307022186 ∧ sin 0.4307022186 ≤ 0.4175089968768766 ∧ (0.9086727481223447 : ℝ) ≤ cos 0.4307022186 ∧ cos 0.4307022186 ≤ 0.9086728042284426 :=
    oslabi (dvojno h4 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h6 : (0.758758053977548 : ℝ) ≤ sin 0.8614044372 ∧ sin 0.8614044372 ≤ 0.7587581419654311 ∧ (0.6513724007070783 : ℝ) ≤ cos 0.8614044372 ∧ cos 0.8614044372 ≤ 0.6513725215731028 :=
    oslabi (dvojno h5 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  exact ⟨h6.1, h6.2.1⟩
/-- Pomožna trditev: meje za sin 0,8614044373.
pomozno -/
theorem sin_d2 : (0.7587580540426914 : ℝ) ≤ sin 0.8614044373 ∧ sin 0.8614044373 ≤ 0.7587581420305691 := by
  have h0 : (0.0134590379548566 : ℝ) ≤ sin 0.0134594443328125 ∧ sin 0.0134594443328125 ≤ 0.0134590379592738 ∧ (0.9999094216791259 : ℝ) ≤ cos 0.0134594443328125 ∧ cos 0.0134594443328125 ≤ 0.9999094233883827 :=
    oslabi (zacetni 0.0134594443328125 (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h1 : (0.0269156377155961 : ℝ) ≤ sin 0.026918888665625 ∧ sin 0.026918888665625 ≤ 0.0269156377704397 ∧ (0.9996377058598948 : ℝ) ≤ cos 0.026918888665625 ∧ cos 0.026918888665625 ≤ 0.9996377092782178 :=
    oslabi (dvojno h0 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h2 : (0.053811772675549 : ℝ) ≤ sin 0.05383777733125 ∧ sin 0.05383777733125 ≤ 0.0538117729692093 ∧ (0.998551091420244 : ℝ) ≤ cos 0.05383777733125 ∧ cos 0.05383777733125 ≤ 0.9985510982573655 :=
    oslabi (dvojno h1 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h3 : (0.107467608672855 : ℝ) ≤ sin 0.1076755546625 ∧ sin 0.1076755546625 ≤ 0.10746760999516 ∧ (0.9942085752664707 : ℝ) ≤ cos 0.1076755546625 ∧ cos 0.1076755546625 ≤ 0.9942085889525059 :=
    oslabi (dvojno h2 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h4 : (0.2136904362118675 : ℝ) ≤ sin 0.215351109325 ∧ sin 0.215351109325 ≤ 0.2136904417827725 ∧ (0.9769014039353137 : ℝ) ≤ cos 0.215351109325 ∧ cos 0.215351109325 ≤ 0.976901431433071 :=
    oslabi (dvojno h3 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h5 : (0.4175089742858459 : ℝ) ≤ sin 0.43070221865 ∧ sin 0.43070221865 ≤ 0.4175089969223116 ∧ (0.9086727481014704 : ℝ) ≤ cos 0.43070221865 ∧ cos 0.43070221865 ≤ 0.908672804207565 :=
    oslabi (dvojno h4 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have h6 : (0.7587580540426914 : ℝ) ≤ sin 0.8614044373 ∧ sin 0.8614044373 ≤ 0.7587581420305691 ∧ (0.6513724006312034 : ℝ) ≤ cos 0.8614044373 ∧ cos 0.8614044373 ≤ 0.6513725214972207 :=
    oslabi (dvojno h5 (by norm_num) (by norm_num) (by norm_num)) (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  exact ⟨h6.1, h6.2.1⟩

/-- Pomožna trditev: osnovna perioda je ena sama.
pomozno -/
theorem osnovna_enolicna {f : ℝ → ℝ} {T T' : ℝ} (h : OsnovnaPerioda f T) (h' : OsnovnaPerioda f T') :
    T = T' :=
  le_antisymm (h.2.2 T' h'.1 h'.2.1) (h'.2.2 T h.1 h.2.1)

/-- Ustno vprašanje 2 in Bolj natančno: sin(u + s) = sin u za vsak u natanko takrat, ko je s večkratnik 2π.
trditev: MAT-SS-3/grafi-kotnih-funkcij#sin-premik
besedilo: »Ker je $\sin(bx + bT) = \sin(bx)$ za vsak $x$ natanko takrat, ko je $bT$ večkratnik $2\pi$, je najmanjši tak $|b|T = 2\pi$, torej $T = \frac{2\pi}{|b|}$.« -/
theorem sin_premik (s : ℝ) : (∀ u, sin (u + s) = sin u) ↔ ∃ k : ℤ, s = k * (2 * π) := by
  constructor
  · intro h
    have := h (π / 2)
    rw [add_comm, sin_add_pi_div_two, sin_pi_div_two] at this
    obtain ⟨n, hn⟩ := (cos_eq_one_iff s).mp this
    exact ⟨n, hn.symm⟩
  · rintro ⟨k, rfl⟩ u; exact sin_add_int_mul_two_pi u k

/-- Pomožna trditev: cos(u + s) = cos u za vsak u natanko takrat, ko je s večkratnik 2π.
pomozno -/
theorem cos_premik (s : ℝ) : (∀ u, cos (u + s) = cos u) ↔ ∃ k : ℤ, s = k * (2 * π) := by
  constructor
  · intro h
    have := h 0
    rw [zero_add, cos_zero] at this
    obtain ⟨n, hn⟩ := (cos_eq_one_iff s).mp this
    exact ⟨n, hn.symm⟩
  · rintro ⟨k, rfl⟩ u; exact cos_add_int_mul_two_pi u k

/-- Pomožna trditev: rešitve tan y = a (kjer cos y ≠ 0) so y = arctan a + kπ.
pomozno -/
theorem resitve_tan (a x : ℝ) : (cos x ≠ 0 ∧ tan x = a) ↔ ∃ k : ℤ, x = arctan a + k * π := by
  have hp := pi_pos
  have ht := arctan_mem_Ioo a
  have hct : 0 < cos (arctan a) := cos_arctan_pos a
  constructor
  · rintro ⟨hc, h⟩
    have e : sin (x - arctan a) = 0 := by
      rw [sin_sub]
      have h' : sin x / cos x = sin (arctan a) / cos (arctan a) := by
        rw [← tan_eq_sin_div_cos, ← tan_eq_sin_div_cos, h, tan_arctan]
      rw [div_eq_div_iff hc hct.ne'] at h'
      linarith
    obtain ⟨n, hn⟩ := sin_eq_zero_iff.mp e
    exact ⟨n, by linarith⟩
  · rintro ⟨k, rfl⟩
    refine ⟨fun h0 => ?_, by rw [tan_add_int_mul_pi, tan_arctan]⟩
    obtain ⟨m, hm⟩ := cos_eq_zero_iff.mp h0
    have a1 : (-1 : ℝ) < 2 * m + 1 - 2 * k := by
      by_contra hc; push Not at hc
      have : (2 * (m : ℝ) + 1 - 2 * k) * π ≤ -π := by nlinarith
      linarith [ht.1]
    have a2 : (2 * m + 1 - 2 * k : ℝ) < 1 := by
      by_contra hc; push Not at hc
      have : π ≤ (2 * (m : ℝ) + 1 - 2 * k) * π := by nlinarith
      linarith [ht.2]
    have b1 : -1 < 2 * m + 1 - 2 * k := by exact_mod_cast a1
    have b2 : 2 * m + 1 - 2 * k < 1 := by exact_mod_cast a2
    omega

/-- Ustno vprašanje 1: tan(u + s) = tan u za vsak u natanko takrat, ko je s večkratnik π.
trditev: MAT-SS-3/grafi-kotnih-funkcij#tan-premik
besedilo: »$f(x + T) = f(x)$« -/
theorem tan_premik (s : ℝ) : (∀ u, tan (u + s) = tan u) ↔ ∃ k : ℤ, s = k * π := by
  constructor
  · intro h
    have h1 : tan (π / 4 + s) = 1 := by rw [h, tan_pi_div_four]
    have hc : cos (π / 4 + s) ≠ 0 := by
      intro h0; rw [tan_eq_sin_div_cos, h0, div_zero] at h1; norm_num at h1
    obtain ⟨k, hk⟩ := (resitve_tan 1 _).mp ⟨hc, h1⟩
    rw [arctan_one] at hk
    exact ⟨k, by linarith⟩
  · rintro ⟨k, rfl⟩ u; exact tan_add_int_mul_pi u k

/-- Pomožna trditev (splošna): če g(u + s) = g(u) za vsak u velja natanko za s = kP (P > 0), ima
f(x) = A·g(b(x − c)) + d pri A ≠ 0, b ≠ 0 osnovno periodo P/|b|.
pomozno -/
theorem osnovna_splosna {g : ℝ → ℝ} {P : ℝ} (hP : 0 < P) (hg : ∀ s, (∀ u, g (u + s) = g u) ↔ ∃ k : ℤ, s = k * P)
    (A b c d : ℝ) (hA : A ≠ 0) (hb : b ≠ 0) :
    OsnovnaPerioda (fun x => A * g (b * (x - c)) + d) (P / |b|) := by
  have hab : 0 < |b| := abs_pos.mpr hb
  have key : ∀ T, (∀ x, A * g (b * (x + T - c)) + d = A * g (b * (x - c)) + d) ↔ ∃ k : ℤ, b * T = k * P := by
    intro T
    rw [← hg]
    constructor
    · intro h u
      have := h (u / b + c)
      rw [show b * (u / b + c + T - c) = u + b * T by field_simp; ring,
        show b * (u / b + c - c) = u by rw [add_sub_cancel_right]; field_simp] at this
      have := mul_left_cancel₀ hA (add_right_cancel this)
      exact this
    · intro h x
      rw [show b * (x + T - c) = b * (x - c) + b * T by ring, h]
  refine ⟨div_pos hP hab, fun x => ?_, fun S hS hper => ?_⟩
  · have := (key (P / |b|)).mpr ?_
    · exact this x
    rcases lt_or_gt_of_ne hb with h | h
    · exact ⟨-1, by rw [abs_of_neg h]; field_simp; push_cast; ring⟩
    · exact ⟨1, by rw [abs_of_pos h]; field_simp; push_cast; ring⟩
  · obtain ⟨k, hk⟩ := (key S).mp (fun x => hper x)
    have habs : |b| * S = |(k : ℝ)| * P := by
      rw [← abs_of_pos hS, ← abs_mul, hk, abs_mul, abs_of_pos hP]
    have hk0 : k ≠ 0 := by
      rintro rfl
      simp at hk
      rcases hk with h | h
      · exact hb h
      · linarith
    have hk1 : (1 : ℝ) ≤ |(k : ℝ)| := by
      rw [← Int.cast_abs]; exact_mod_cast Int.one_le_abs hk0
    rw [div_le_iff₀ hab]
    nlinarith

/-- Pomožna trditev (splošna): za A ≠ 0, b ≠ 0 in g z vrednostmi natanko [−1, 1] ima
f(x) = A·g(b(x − c)) + d zalogo vrednosti [d − |A|, d + |A|].
pomozno -/
theorem zaloga_splosna {g : ℝ → ℝ} (hg1 : ∀ u, g u ∈ Icc (-1 : ℝ) 1) (hg2 : ∀ v ∈ Icc (-1 : ℝ) 1, ∃ u, g u = v)
    (A b c d : ℝ) (hA : A ≠ 0) (hb : b ≠ 0) :
    (∀ x, A * g (b * (x - c)) + d ∈ Icc (d - |A|) (d + |A|)) ∧
    ∀ y ∈ Icc (d - |A|) (d + |A|), ∃ x, A * g (b * (x - c)) + d = y := by
  have haA : 0 < |A| := abs_pos.mpr hA
  refine ⟨fun x => ?_, fun y hy => ?_⟩
  · have h1 := hg1 (b * (x - c))
    have : |A * g (b * (x - c))| ≤ |A| := by
      rw [abs_mul]; nlinarith [abs_le.mpr ⟨h1.1, h1.2⟩, abs_nonneg (g (b * (x - c)))]
    rw [abs_le] at this
    exact ⟨by linarith, by linarith⟩
  · have hv : (y - d) / A ∈ Icc (-1 : ℝ) 1 := by
      have : |(y - d) / A| ≤ 1 := by
        rw [abs_div, div_le_one haA, abs_le]; exact ⟨by linarith [hy.1], by linarith [hy.2]⟩
      exact abs_le.mp this
    obtain ⟨u, hu⟩ := hg2 _ hv
    refine ⟨u / b + c, ?_⟩
    rw [show b * (u / b + c - c) = u by rw [add_sub_cancel_right]; field_simp, hu]; field_simp; ring

/-- Pomožna trditev: sin in cos imata vrednosti natanko [−1, 1].
pomozno -/
theorem sin_cos_zaloga : (∀ u, sin u ∈ Icc (-1 : ℝ) 1) ∧ (∀ v ∈ Icc (-1 : ℝ) 1, ∃ u, sin u = v) ∧
    (∀ u, cos u ∈ Icc (-1 : ℝ) 1) ∧ (∀ v ∈ Icc (-1 : ℝ) 1, ∃ u, cos u = v) :=
  ⟨fun u => ⟨neg_one_le_sin u, sin_le_one u⟩, fun v hv => ⟨arcsin v, sin_arcsin hv.1 hv.2⟩,
    fun u => ⟨neg_one_le_cos u, cos_le_one u⟩, fun v hv => ⟨arccos v, cos_arccos hv.1 hv.2⟩⟩

/-! ## Razlaga -/

/-- Razlaga 8, Povzetek in Ustno vprašanje 3 (splošna sinusna funkcija): f(x) = A sin(b(x − c)) + d (A ≠ 0,
b ≠ 0) ima osnovno periodo 2π/|b| in zalogo vrednosti [d − |A|, d + |A|] (največja vrednost d + |A|,
najmanjša d − |A|).
trditev: MAT-SS-3/grafi-kotnih-funkcij#splosna-sinus
besedilo: »$f(x) = A\sin\big(b(x - c)\big) + d$: amplituda $|A|$, $T = \dfrac{2\pi}{|b|}$, $Z_f = [d - |A|,\ d + |A|]$« -/
theorem splosna_sinus (A b c d : ℝ) (hA : A ≠ 0) (hb : b ≠ 0) :
    OsnovnaPerioda (fun x => A * sin (b * (x - c)) + d) (2 * π / |b|) ∧
    (∀ x, A * sin (b * (x - c)) + d ∈ Icc (d - |A|) (d + |A|)) ∧
    ∀ y ∈ Icc (d - |A|) (d + |A|), ∃ x, A * sin (b * (x - c)) + d = y :=
  ⟨osnovna_splosna (by positivity) sin_premik A b c d hA hb,
    zaloga_splosna sin_cos_zaloga.1 sin_cos_zaloga.2.1 A b c d hA hb⟩

/-- Razlaga 8 (kosinus): f(x) = A cos(b(x − c)) + d (A ≠ 0, b ≠ 0) ima osnovno periodo 2π/|b| in zalogo
vrednosti [d − |A|, d + |A|].
trditev: MAT-SS-3/grafi-kotnih-funkcij#splosna-kosinus
besedilo: »Enako velja za kosinus: $f(x) = A\cos\big(b(x - c)\big) + d$ ima amplitudo $|A|$, periodo $\frac{2\pi}{|b|}$ in enaka premika.« -/
theorem splosna_kosinus (A b c d : ℝ) (hA : A ≠ 0) (hb : b ≠ 0) :
    OsnovnaPerioda (fun x => A * cos (b * (x - c)) + d) (2 * π / |b|) ∧
    (∀ x, A * cos (b * (x - c)) + d ∈ Icc (d - |A|) (d + |A|)) ∧
    ∀ y ∈ Icc (d - |A|) (d + |A|), ∃ x, A * cos (b * (x - c)) + d = y :=
  ⟨osnovna_splosna (by positivity) cos_premik A b c d hA hb,
    zaloga_splosna sin_cos_zaloga.2.2.1 sin_cos_zaloga.2.2.2 A b c d hA hb⟩

/-- Pogoji izrekov `splosna_sinus`, `splosna_kosinus` in `osnovna_splosna` se dajo izpolniti (A = b = 1). -/
example : (1 : ℝ) ≠ 0 := one_ne_zero

/-- Predpostavke trditve `splosna_kosinus` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ) ≠ 0 := one_ne_zero
  splosna_kosinus (hA := w) (hb := w)

/-- Predpostavke trditve `splosna_sinus` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ) ≠ 0 := one_ne_zero
  splosna_sinus (hA := w) (hb := w)

/-- Razlaga 3, Povzetek in Ustno vprašanje 1: tan(bx) (b ≠ 0) ima osnovno periodo π/|b|; pri b = 1 je to π.
trditev: MAT-SS-3/grafi-kotnih-funkcij#tangens-perioda
besedilo: »$\tan(bx)$ ima osnovno periodo $\frac{\pi}{|b|}$.« -/
theorem tangens_perioda (b : ℝ) (hb : b ≠ 0) : OsnovnaPerioda (fun x => tan (b * x)) (π / |b|) := by
  have := osnovna_splosna pi_pos tan_premik 1 b 0 0 one_ne_zero hb
  simpa using this

/-- Pogoj izreka `tangens_perioda` se da izpolniti (b = 1). -/
example : (1 : ℝ) ≠ 0 := one_ne_zero

/-- Predpostavke trditve `tangens_perioda` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ) ≠ 0 := one_ne_zero
  tangens_perioda (hb := w)

/-- Razlaga 2 in Ustno vprašanje 1: sin in cos imata osnovno periodo 2π, tan pa π; 4π je tudi perioda
sinusa, a ni osnovna (2π < 4π).
trditev: MAT-SS-3/grafi-kotnih-funkcij#osnovne-periode
besedilo: »Preveri:* ali je $4\pi$ tudi perioda sinusa? *Odgovor:* je, ker sta to dva obrata, a ni osnovna perioda.« -/
theorem osnovne_periode : OsnovnaPerioda sin (2 * π) ∧ OsnovnaPerioda cos (2 * π) ∧ OsnovnaPerioda tan π ∧
    (∀ x, sin (x + 4 * π) = sin x) ∧ 2 * π < 4 * π := by
  have hp := pi_pos
  have a := (splosna_sinus 1 1 0 0 one_ne_zero one_ne_zero).1
  have b := (splosna_kosinus 1 1 0 0 one_ne_zero one_ne_zero).1
  have c := tangens_perioda 1 one_ne_zero
  simp only [one_mul, sub_zero, add_zero, abs_one, div_one] at a b c
  refine ⟨a, b, c, fun x => (sin_premik (4 * π)).mpr ⟨2, by push_cast; ring⟩ x, by linarith⟩

/-- Razlaga 1 (tabela): sin in cos pri 0, π/2, π, 3π/2, 2π; sin(3π/4) = sin(π/4) = √2/2 ≈ 0,71.
trditev: MAT-SS-3/grafi-kotnih-funkcij#tabela
besedilo: »Njena višina $\sin\frac{3\pi}{4} \approx 0{,}71$ je hkrati višina grafa nad $\frac{3\pi}{4}$.« -/
theorem tabela : (sin 0 = 0 ∧ cos 0 = 1) ∧ (sin (π / 2) = 1 ∧ cos (π / 2) = 0) ∧ (sin π = 0 ∧ cos π = -1) ∧
    (sin (3 * π / 2) = -1 ∧ cos (3 * π / 2) = 0) ∧ (sin (2 * π) = 0 ∧ cos (2 * π) = 1) ∧
    sin (3 * π / 4) = √2 / 2 ∧ sin (π / 4) = sin (3 * π / 4) ∧ (0.705 : ℝ) < √2 / 2 ∧ √2 / 2 < 0.715 := by
  have e : sin (3 * π / 4) = √2 / 2 := by
    rw [show 3 * π / 4 = π - π / 4 by ring, sin_pi_sub, sin_pi_div_four]
  have k1 : (1.41 : ℝ) < √2 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have k2 : √2 < (1.43 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨⟨sin_zero, cos_zero⟩, ⟨sin_pi_div_two, cos_pi_div_two⟩, ⟨sin_pi, cos_pi⟩, ?_, ⟨sin_two_pi, cos_two_pi⟩,
    e, by rw [e, sin_pi_div_four], by linarith, by linarith⟩
  rw [show 3 * π / 2 = π / 2 + π by ring, sin_add_pi, cos_add_pi, sin_pi_div_two, cos_pi_div_two]; norm_num

/-- Razlaga 1, Preveri: na [0, 2π] je sin x najmanjši (−1) natanko pri x = 3π/2.
trditev: MAT-SS-3/grafi-kotnih-funkcij#min-sin
besedilo: »Preveri:* pri katerem $x$ med $0$ in $2\pi$ je $\sin x$ najmanjši? *Odgovor:* pri $\frac{3\pi}{2}$, kjer je $\sin x = -1$.« -/
theorem min_sin (x : ℝ) (h0 : 0 ≤ x) (h1 : x ≤ 2 * π) : sin x = -1 ↔ x = 3 * π / 2 := by
  have hp := pi_pos
  constructor
  · intro h
    obtain ⟨k, hk⟩ := sin_eq_neg_one_iff.mp h
    have a : (-1 : ℝ) < k := by nlinarith
    have b : (k : ℝ) < 2 := by nlinarith
    have : k = 1 := by
      have a' : -1 < k := by exact_mod_cast a
      have b' : k < 2 := by exact_mod_cast b
      have : k ≠ 0 := by
        rintro rfl; simp at hk; linarith
      omega
    subst this; push_cast at hk; linarith
  · rintro rfl; exact tabela.2.2.2.1.1

/-- Pogoja izreka `min_sin` se dajo izpolniti (x = 3π/2). -/
example : (0 : ℝ) ≤ 3 * π / 2 ∧ 3 * π / 2 ≤ 2 * π := by
  have := pi_pos; constructor <;> linarith

/-- Predpostavke trditve `min_sin` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) ≤ 3 * π / 2 ∧ 3 * π / 2 ≤ 2 * π := by
    have := pi_pos; constructor <;> linarith
  min_sin (h0 := w.1) (h1 := w.2)

/-- Razlaga 3 (tabela ničel in skrajnih vrednosti, Povzetek): sin x = 0 ⇔ x = kπ, cos x = 0 ⇔ x = π/2 + kπ,
sin x = 1 ⇔ x = π/2 + 2kπ, cos x = 1 ⇔ x = 2kπ, sin x = −1 ⇔ x = 3π/2 + 2kπ, cos x = −1 ⇔ x = π + 2kπ.
trditev: MAT-SS-3/grafi-kotnih-funkcij#nicle-vrhovi
besedilo: »Ničle:** $\sin x = 0$ pri $x = k\pi$, $\cos x = 0$ pri $x = \frac{\pi}{2} + k\pi$.« -/
theorem nicle_vrhovi (x : ℝ) :
    (sin x = 0 ↔ ∃ k : ℤ, x = k * π) ∧ (cos x = 0 ↔ ∃ k : ℤ, x = π / 2 + k * π) ∧
    (sin x = 1 ↔ ∃ k : ℤ, x = π / 2 + 2 * k * π) ∧ (cos x = 1 ↔ ∃ k : ℤ, x = 2 * k * π) ∧
    (sin x = -1 ↔ ∃ k : ℤ, x = 3 * π / 2 + 2 * k * π) ∧ (cos x = -1 ↔ ∃ k : ℤ, x = π + 2 * k * π) := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_⟩
  · rw [sin_eq_zero_iff]; exact ⟨fun ⟨k, h⟩ => ⟨k, h.symm⟩, fun ⟨k, h⟩ => ⟨k, h.symm⟩⟩
  · rw [cos_eq_zero_iff]
    exact ⟨fun ⟨k, h⟩ => ⟨k, by rw [h]; ring⟩, fun ⟨k, h⟩ => ⟨k, by rw [h]; ring⟩⟩
  · rw [sin_eq_one_iff]
    exact ⟨fun ⟨k, h⟩ => ⟨k, by rw [← h]; ring⟩, fun ⟨k, h⟩ => ⟨k, by rw [h]; ring⟩⟩
  · rw [cos_eq_one_iff]
    exact ⟨fun ⟨k, h⟩ => ⟨k, by rw [← h]; ring⟩, fun ⟨k, h⟩ => ⟨k, by rw [h]; ring⟩⟩
  · rw [sin_eq_neg_one_iff]
    exact ⟨fun ⟨k, h⟩ => ⟨k - 1, by rw [← h]; push_cast; ring⟩,
      fun ⟨k, h⟩ => ⟨k + 1, by rw [h]; push_cast; ring⟩⟩
  · rw [cos_eq_neg_one_iff]
    exact ⟨fun ⟨k, h⟩ => ⟨k, by rw [← h]; ring⟩, fun ⟨k, h⟩ => ⟨k, by rw [h]; ring⟩⟩

/-- Razlaga 3 in Preveri se 1: graf kosinusa je graf sinusa, premaknjen za π/2 v levo (cos x = sin(x + π/2));
sinus je lih, kosinus sod.
trditev: MAT-SS-3/grafi-kotnih-funkcij#sin-cos-zveza
besedilo: »Graf kosinusa ima enako obliko kot graf sinusa, le premaknjen je za $\frac{\pi}{2}$ v levo: vrh ima pri $0$, sinus pa šele pri $\frac{\pi}{2}$.« -/
theorem sin_cos_zveza (x : ℝ) : cos x = sin (x + π / 2) ∧ sin (-x) = -sin x ∧ cos (-x) = cos x :=
  ⟨(sin_add_pi_div_two x).symm, sin_neg x, cos_neg x⟩

/-- Razlaga 3 (tangens): tangens ni definiran (cos x = 0) natanko pri x = π/2 + kπ; ničle (kjer je definiran)
ima natanko pri kπ; zaloga vrednosti so vsa realna števila; na (−π/2, π/2) narašča; ob x → π/2 z leve gre proti
+∞, ob x → −π/2 z desne proti −∞ (navpični asimptoti); tan(π/4) = 1.
trditev: MAT-SS-3/grafi-kotnih-funkcij#tangens
besedilo: »Tangens ni definiran tam, kjer je $\cos x = 0$, torej pri $x = \frac{\pi}{2} + k\pi$.« -/
theorem tangens :
    (∀ x, cos x = 0 ↔ ∃ k : ℤ, x = π / 2 + k * π) ∧
    (∀ x, (cos x ≠ 0 ∧ tan x = 0) ↔ ∃ k : ℤ, x = k * π) ∧ (∀ y, ∃ x, tan x = y) ∧
    StrictMonoOn tan (Ioo (-(π / 2)) (π / 2)) ∧ Tendsto tan (𝓝[<] (π / 2)) atTop ∧
    Tendsto tan (𝓝[>] (-(π / 2))) atBot ∧ tan (π / 4) = 1 := by
  refine ⟨fun x => (nicle_vrhovi x).2.1, fun x => ?_, fun y => ⟨arctan y, tan_arctan y⟩, strictMonoOn_tan,
    tendsto_tan_pi_div_two, tendsto_tan_neg_pi_div_two, tan_pi_div_four⟩
  rw [resitve_tan, arctan_zero]; simp only [zero_add]

/-- Razlaga 3 (kotangens): cot x = cos x/sin x ima pole pri kπ (sin x = 0), cot(x + π) = cot x in na veji
(0, π) pada.
trditev: MAT-SS-3/grafi-kotnih-funkcij#kotangens
besedilo: »Kotangens $\cot x = \frac{\cos x}{\sin x}$ ima pole pri $k\pi$, periodo $\pi$ in na vsaki veji pada.« -/
theorem kotangens : (∀ x, cot x = cos x / sin x) ∧ (∀ x, sin x = 0 ↔ ∃ k : ℤ, x = k * π) ∧
    (∀ x, cot (x + π) = cot x) ∧ StrictAntiOn cot (Ioo 0 π) := by
  refine ⟨cot_eq_cos_div_sin, fun x => (nicle_vrhovi x).1, fun x => ?_, fun a ha b hb hab => ?_⟩
  · rw [cot_eq_cos_div_sin, cot_eq_cos_div_sin, sin_add_pi, cos_add_pi, neg_div_neg_eq]
  · rw [cot_eq_cos_div_sin, cot_eq_cos_div_sin]
    have sa := sin_pos_of_pos_of_lt_pi ha.1 ha.2
    have sb := sin_pos_of_pos_of_lt_pi hb.1 hb.2
    have sd : 0 < sin (b - a) := sin_pos_of_pos_of_lt_pi (by linarith) (by linarith [ha.1, hb.2])
    rw [sin_sub] at sd
    rw [div_lt_div_iff₀ sb sa]
    linarith

/-- Razlaga 3 (kotangens): v Leanu je cot x = tan(π/2 − x) za vsak x (tudi v polih, kjer sta obe 0).
trditev: MAT-SS-3/grafi-kotnih-funkcij#cot-tan
besedilo: »Tangens ni definiran tam, kjer je $\cos x = 0$, torej pri $x = \frac{\pi}{2} + k\pi$.« -/
theorem cot_tan (x : ℝ) : cot x = tan (π / 2 - x) := by
  rw [cot_eq_cos_div_sin, tan_eq_sin_div_cos, sin_pi_div_two_sub, cos_pi_div_two_sub]

/-- Razlaga 3 (kotangens): osnovna perioda kotangensa je π.
trditev: MAT-SS-3/grafi-kotnih-funkcij#kotangens-perioda
besedilo: »osnovna perioda pa je $\pi$:« -/
theorem kotangens_perioda : OsnovnaPerioda cot π := by
  have ht := osnovne_periode.2.2.1
  refine ⟨pi_pos, fun x => by rw [cot_tan, cot_tan, show π / 2 - (x + π) = π / 2 - x - π by ring,
    ← (tan_premik π).mpr ⟨1, by simp⟩ (π / 2 - x - π)]; ring_nf, fun S hS h => ht.2.2 S hS ?_⟩
  intro y
  have := h (π / 2 - y - S)
  rw [cot_tan, cot_tan, show π / 2 - (π / 2 - y - S + S) = y by ring,
    show π / 2 - (π / 2 - y - S) = y + S by ring] at this
  exact this.symm

/-- Razlaga 3, Premisli: sin 4 < 0, ker je π ≈ 3,14 < 4 < 3π/2 ≈ 4,71.
trditev: MAT-SS-3/grafi-kotnih-funkcij#sin4
besedilo: »$\pi \approx 3{,}14 < 4 < \frac{3\pi}{2} \approx 4{,}71$« -/
theorem sin4 : π < 4 ∧ 4 < 3 * π / 2 ∧ sin 4 < 0 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  refine ⟨by linarith, by linarith, ?_⟩
  have := sin_neg_of_neg_of_neg_pi_lt (x := 4 - 2 * π) (by linarith) (by linarith)
  rwa [sin_sub_two_pi] at this

/-- Razlaga 3–5 in Preveri se 1, 5: osnovne periode tan 2x = π/2 (ne π), sin 2x = π (ne 4π, ki je le perioda),
sin(x/3) = 6π, sin(x/2) = 4π, 3 sin x = 2π; vrstni red π/2 < π < 2π < 4π.
trditev: MAT-SS-3/grafi-kotnih-funkcij#periode
besedilo: »Zaporedna vrhova sta pri $x = 1$ in $x = 5$, zato je $T = 5 - 1 = 4$. Od vrha do dna pri $x = 3$ je pol periode. Narisana je $f(x) = 3\sin\left(\frac{\pi}{2}x\right) + 1$.« -/
theorem periode :
    OsnovnaPerioda (fun x => tan (2 * x)) (π / 2) ∧ OsnovnaPerioda (fun x => sin (2 * x)) π ∧
    OsnovnaPerioda (fun x => sin (x / 3)) (6 * π) ∧ OsnovnaPerioda (fun x => sin (x / 2)) (4 * π) ∧
    OsnovnaPerioda (fun x => 3 * sin x) (2 * π) ∧ (∀ x, sin (2 * (x + 4 * π)) = sin (2 * x)) ∧
    π / 2 < π ∧ π < 2 * π ∧ 2 * π < 4 * π := by
  have hp := pi_pos
  have t := tangens_perioda 2 two_ne_zero
  have s2 := (splosna_sinus 1 2 0 0 one_ne_zero two_ne_zero).1
  have s3 := (splosna_sinus 1 (1 / 3) 0 0 one_ne_zero (by norm_num)).1
  have s4 := (splosna_sinus 1 (1 / 2) 0 0 one_ne_zero (by norm_num)).1
  have s5 := (splosna_sinus 3 1 0 0 (by norm_num) one_ne_zero).1
  simp only [one_mul, sub_zero, add_zero, abs_one, div_one, abs_two] at t s2 s3 s4 s5
  rw [show |(1 / 3 : ℝ)| = 1 / 3 by norm_num] at s3
  rw [show |(1 / 2 : ℝ)| = 1 / 2 by norm_num] at s4
  rw [show 2 * π / 2 = π by ring] at s2
  rw [show 2 * π / (1 / 3) = 6 * π by ring] at s3
  rw [show 2 * π / (1 / 2) = 4 * π by ring] at s4
  refine ⟨t, s2, ?_, ?_, s5, fun x => ?_, by linarith, by linarith, by linarith⟩
  · simpa [div_eq_inv_mul, mul_comm] using s3
  · simpa [div_eq_inv_mul, mul_comm] using s4
  · rw [show 2 * (x + 4 * π) = 2 * x + (4 : ℤ) * (2 * π) by push_cast; ring, sin_add_int_mul_two_pi]

/-- Razlaga 4, 5, Napoved in Pogoste napake: y = 2 sin x ima zalogo [−2, 2] in periodo 2π; y = sin 2x ima
zalogo [−1, 1] (ni dvakrat višji val) in periodo π; y = −3 sin x ima amplitudo 3 (zaloga [−3, 3]); sin(−2x) =
−sin 2x (zrcaljenje, perioda ostane).
trditev: MAT-SS-3/grafi-kotnih-funkcij#amplitude
besedilo: »Napoved.** Graf $y = \sin x$ je tak val. Eden od zapisov $y = 2\sin x$ in $y = \sin 2x$ opiše glasnejši žvižg, drugi višji ton. Kateri je kateri? Zapiši si odgovor; v 5. razdelku ga preveriš.« -/
theorem amplitude :
    (∀ x, 2 * sin x ∈ Icc (-2 : ℝ) 2) ∧ 2 * sin (π / 2) = 2 ∧ OsnovnaPerioda (fun x => 2 * sin x) (2 * π) ∧
    (∀ x, sin (2 * x) ∈ Icc (-1 : ℝ) 1) ∧
    (∀ x, -3 * sin x ∈ Icc (-3 : ℝ) 3) ∧ -3 * sin (3 * π / 2) = 3 ∧ (∀ x, sin (-2 * x) = -sin (2 * x)) := by
  have p := (splosna_sinus 2 1 0 0 two_ne_zero one_ne_zero).1
  simp only [one_mul, sub_zero, add_zero, abs_one, div_one] at p
  refine ⟨fun x => ⟨by linarith [neg_one_le_sin x], by linarith [sin_le_one x]⟩, by rw [sin_pi_div_two]; ring,
    p, fun x => ⟨neg_one_le_sin _, sin_le_one _⟩,
    fun x => ⟨by linarith [sin_le_one x], by linarith [neg_one_le_sin x]⟩, by rw [tabela.2.2.2.1.1]; ring,
    fun x => by rw [neg_mul, sin_neg]⟩

/-- Razlaga 5 (drsnik b): konec prve periode 2π/b je pri b = 2 π ≈ 3,14, pri b = 3 2π/3 ≈ 2,09, pri b = 4
π/2 ≈ 1,57, pri b = 0,5 4π; pri b = 1 je 2π ≈ 6,28.
trditev: MAT-SS-3/grafi-kotnih-funkcij#drsnik-b
besedilo: »Pri $b = 2$ je pri $\pi \approx 3{,}14$, pri $b = 3$ pri $\frac{2\pi}{3} \approx 2{,}09$, pri $b = 4$ pri $\frac{\pi}{2} \approx 1{,}57$.« -/
theorem drsnik_b : 2 * π / 2 = π ∧ (3.135 : ℝ) < π ∧ π < 3.145 ∧ (2.085 : ℝ) < 2 * π / 3 ∧ 2 * π / 3 < 2.095 ∧
    2 * π / 4 = π / 2 ∧ (1.565 : ℝ) < π / 2 ∧ π / 2 < 1.575 ∧ 2 * π / 0.5 = 4 * π ∧
    (6.275 : ℝ) < 2 * π ∧ 2 * π < 6.285 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  refine ⟨by ring, by linarith, by linarith, by linarith, by linarith, by ring, by linarith, by linarith,
    by ring, by linarith, by linarith⟩

/-- Razlaga 6, 7 in Preveri se 1: pri y = sin(x − c) ima nova funkcija pri x = c vrednost sin 0;
sin(x + 1) = sin(x − (−1)) (premik v levo); sin(x + π/2) = sin(x − (−π/2)) = cos x; sin x + 3 niha med 2 in 4;
sin(x − 1) + 2 niha med 1 in 3 z začetkom vala v (1; 2).
trditev: MAT-SS-3/grafi-kotnih-funkcij#premiki
besedilo: »6. Premik v smeri osi $x$.** Pri $y = \sin(x - c)$ se graf premakne **v desno** za $c$, če je $c > 0$. Razlog: vrednost, ki jo je $\sin$ imel pri $0$, ima nova funkcija šele pri $x = c$, saj je $\sin(c - c) = \sin 0$. Če je $c < 0$, gre graf v levo.« -/
theorem premiki (c x : ℝ) : sin (c - c) = sin 0 ∧ sin (x + 1) = sin (x - (-1)) ∧
    sin (x + π / 2) = sin (x - (-(π / 2))) ∧ sin (x + π / 2) = cos x ∧
    (sin x + 3 ∈ Icc (2 : ℝ) 4) ∧ sin (π / 2) + 3 = 4 ∧ sin (3 * π / 2) + 3 = 2 ∧
    (sin (x - 1) + 2 ∈ Icc (1 : ℝ) 3) ∧ sin (1 - 1) + 2 = 2 := by
  refine ⟨by rw [sub_self], by ring_nf, by ring_nf, sin_add_pi_div_two x,
    ⟨by linarith [neg_one_le_sin x], by linarith [sin_le_one x]⟩, by rw [sin_pi_div_two]; ring,
    by rw [tabela.2.2.2.1.1]; ring, ⟨by linarith [neg_one_le_sin (x - 1)], by linarith [sin_le_one (x - 1)]⟩,
    by simp⟩

/-- Razlaga 8 (Pazi na obliko), Povzetek, Pogoste napake, Preveri se 3 in Bolj natančno: pred branjem premika
izpostavimo b: sin(bx − p) = sin(b(x − p/b)) za b ≠ 0; 2x − π/2 = 2(x − π/4), 2x − π/3 = 2(x − π/6); val
sin(2x − π/2) se začne pri x = π/4 (argument 0); sin(x − π/3) ima vrednost sin 0 pri x = π/3 (premik v desno).
trditev: MAT-SS-3/grafi-kotnih-funkcij#izpostavi
besedilo: »Pazi na obliko.** Če je funkcija zapisana kot $\sin(2x - \frac{\pi}{2})$, najprej izpostavi $b$: $2x - \frac{\pi}{2} = 2\left(x - \frac{\pi}{4}\right)$.« -/
theorem izpostavi (b p x : ℝ) (hb : b ≠ 0) : sin (b * x - p) = sin (b * (x - p / b)) ∧
    2 * x - π / 2 = 2 * (x - π / 4) ∧ 2 * x - π / 3 = 2 * (x - π / 6) ∧ 2 * (π / 4) - π / 2 = 0 ∧
    π / 3 - π / 3 = 0 := by
  refine ⟨by congr 1; field_simp, by ring, by ring, by ring, by ring⟩

/-- Pogoj izreka `izpostavi` se da izpolniti (b = 2). -/
example : (2 : ℝ) ≠ 0 := two_ne_zero

/-- Predpostavke trditve `izpostavi` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2 : ℝ) ≠ 0 := two_ne_zero
  izpostavi (hb := w)

/-- Razlaga 8 (simulacija): pri b = 2, c = π/4 je perioda π in val se začne pri x = π/4 (vrednost d).
trditev: MAT-SS-3/grafi-kotnih-funkcij#simulacija-8
besedilo: »V simulaciji spodaj (»Graf A sin(b(x − c)) + d«) spreminjaj vse štiri hkrati. Nastavi $b = 2$ in $c = \frac{\pi}{4}$: kolikšna je perioda in kje se začne val? *Odgovor:* perioda je $\pi$, val se začne pri $x = \frac{\pi}{4}$.« -/
theorem simulacija_8 (A d : ℝ) (hA : A ≠ 0) :
    OsnovnaPerioda (fun x => A * sin (2 * (x - π / 4)) + d) π ∧ A * sin (2 * (π / 4 - π / 4)) + d = d := by
  have := (splosna_sinus A 2 (π / 4) d hA two_ne_zero).1
  rw [abs_two, show 2 * π / 2 = π by ring] at this
  exact ⟨this, by simp⟩

/-- Pogoj izreka `simulacija_8` se da izpolniti (A = 1). -/
example : (1 : ℝ) ≠ 0 := one_ne_zero

/-- Predpostavke trditve `simulacija_8` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ) ≠ 0 := one_ne_zero
  simulacija_8 (hA := w)

/-- Pomožna trditev: zaloga vrednosti kot množica: range f = [d − |A|, d + |A|] za f(x) = A sin(b(x − c)) + d
oziroma A cos(b(x − c)) + d.
pomozno -/
theorem zaloga_mnozica (A b c d : ℝ) (hA : A ≠ 0) (hb : b ≠ 0) :
    range (fun x => A * sin (b * (x - c)) + d) = Icc (d - |A|) (d + |A|) ∧
    range (fun x => A * cos (b * (x - c)) + d) = Icc (d - |A|) (d + |A|) := by
  obtain ⟨-, s1, s2⟩ := splosna_sinus A b c d hA hb
  obtain ⟨-, c1, c2⟩ := splosna_kosinus A b c d hA hb
  constructor <;> ext y <;> constructor
  · rintro ⟨x, rfl⟩; exact s1 x
  · intro hy; obtain ⟨x, hx⟩ := s2 y hy; exact ⟨x, hx⟩
  · rintro ⟨x, rfl⟩; exact c1 x
  · intro hy; obtain ⟨x, hx⟩ := c2 y hy; exact ⟨x, hx⟩

/-! ## Rešeni primeri -/

/-- Primer 1: f(x) = −3 sin x − 1 = A sin(b(x − c)) + d z A = −3, b = 1, c = 0, d = −1; amplituda |−3| = 3,
osnovna perioda 2π/1 = 2π, Z_f = [−1 − 3, −1 + 3] = [−4, 2]; na [0, 2π] je f(x) = 2 (največja vrednost)
natanko pri x = 3π/2, f(3π/2) = −3·(−1) − 1 = 2.
trditev: MAT-SS-3/grafi-kotnih-funkcij#primer1
besedilo: »Odgovor: amplituda je $3$, perioda $2\pi$, $Z_f = [-4, 2]$; največjo vrednost $2$ doseže pri $x = \frac{3\pi}{2}$.« -/
theorem primer1 :
    (∀ x, -3 * sin x - 1 = -3 * sin (1 * (x - 0)) + -1) ∧ |(-3 : ℝ)| = 3 ∧
    OsnovnaPerioda (fun x => -3 * sin x - 1) (2 * π) ∧ range (fun x => -3 * sin x - 1) = Icc (-4) 2 ∧
    ((-1 : ℝ) - 3 = -4 ∧ (-1 : ℝ) + 3 = 2) ∧
    (∀ x ∈ Icc 0 (2 * π), -3 * sin x - 1 = 2 ↔ x = 3 * π / 2) ∧ -3 * sin (3 * π / 2) - 1 = -3 * (-1) - 1 ∧
    (-3 : ℝ) * (-1) - 1 = 2 := by
  have e : (fun x => -3 * sin (1 * (x - 0)) + -1) = fun x => -3 * sin x - 1 := by funext x; ring_nf
  have h := splosna_sinus (-3) 1 0 (-1) (by norm_num) one_ne_zero
  have r := (zaloga_mnozica (-3) 1 0 (-1) (by norm_num) one_ne_zero).1
  rw [e] at h r
  rw [abs_one, div_one] at h
  rw [show |(-3 : ℝ)| = 3 by norm_num, show (-1 : ℝ) - 3 = -4 by norm_num,
    show (-1 : ℝ) + 3 = 2 by norm_num] at r
  refine ⟨fun x => by ring_nf, by norm_num, h.1, r, by norm_num, fun x hx => ?_, by rw [tabela.2.2.2.1.1],
    by norm_num⟩
  rw [← min_sin x hx.1 hx.2]; constructor <;> intro h <;> linarith

/-- Primer 2: f(x) = 2 sin(2x − π/2) + 1 = 2 sin(2(x − π/4)) + 1 (A = 2, b = 2, c = π/4, d = 1); osnovna
perioda π, Z_f = [1 − 2, 1 + 2] = [−1, 3]; f(x) = 3 natanko pri x = π/2 + kπ (RACUN: 2(x − π/4) = π/2 ⇔
x = π/2), zato je najmanjši pozitivni maksimum pri x = π/2 (π/2 − π < 0) in f(π/2) = 2 sin(π/2) + 1 = 3.
trditev: MAT-SS-3/grafi-kotnih-funkcij#primer2
besedilo: »Za funkcijo $f(x) = 2\sin\left(2x - \frac{\pi}{2}\right) + 1$ določi amplitudo, osnovno periodo, premika in zalogo vrednosti. Pri katerem najmanjšem pozitivnem $x$ ima maksimum?« -/
theorem primer2 :
    (∀ x, 2 * sin (2 * x - π / 2) + 1 = 2 * sin (2 * (x - π / 4)) + 1) ∧
    OsnovnaPerioda (fun x => 2 * sin (2 * (x - π / 4)) + 1) π ∧
    range (fun x => 2 * sin (2 * (x - π / 4)) + 1) = Icc (-1) 3 ∧
    (∀ x, 2 * sin (2 * x - π / 2) + 1 = 3 ↔ ∃ k : ℤ, x = π / 2 + k * π) ∧
    (∀ x, 2 * (x - π / 4) = π / 2 ↔ x = π / 2) ∧
    (∀ x, 0 < x → 2 * sin (2 * x - π / 2) + 1 = 3 → π / 2 ≤ x) ∧ π / 2 - π < 0 ∧
    2 * sin (2 * (π / 2) - π / 2) + 1 = 2 * sin (π / 2) + 1 ∧ 2 * sin (π / 2) + 1 = 3 := by
  have hp := pi_pos
  have h := splosna_sinus 2 2 (π / 4) 1 two_ne_zero two_ne_zero
  have r := (zaloga_mnozica 2 2 (π / 4) 1 two_ne_zero two_ne_zero).1
  rw [abs_two, show 2 * π / 2 = π by ring] at h
  rw [abs_two, show (1 : ℝ) - 2 = -1 by norm_num, show (1 : ℝ) + 2 = 3 by norm_num] at r
  have key : ∀ x, 2 * sin (2 * x - π / 2) + 1 = 3 ↔ ∃ k : ℤ, x = π / 2 + k * π := by
    intro x
    rw [show 2 * sin (2 * x - π / 2) + 1 = 3 ↔ sin (2 * x - π / 2) = 1 from
      ⟨fun h => by linarith, fun h => by rw [h]; ring⟩, (nicle_vrhovi _).2.2.1]
    exact ⟨fun ⟨k, hk⟩ => ⟨k, by linarith⟩, fun ⟨k, hk⟩ => ⟨k, by rw [hk]; ring⟩⟩
  refine ⟨fun x => by ring_nf, h.1, r, key, fun x => ⟨fun h => by linarith, fun h => by rw [h]; ring⟩,
    fun x hx hf => ?_, by linarith, by ring_nf, by rw [sin_pi_div_two]; ring⟩
  obtain ⟨k, hk⟩ := (key x).mp hf
  have : (0 : ℝ) ≤ k := by
    by_contra hc; push Not at hc
    have : (k : ℝ) ≤ -1 := by
      have : k < 0 := by exact_mod_cast hc
      exact_mod_cast (show k ≤ -1 by omega)
    nlinarith
  nlinarith

/-- Primer 3: d = (15,8 + 8,6)/2 = 12,2, A = (15,8 − 8,6)/2 = 3,6, b = 2π/365, c = 79; D(t) =
3,6 sin(2π/365·(t − 79)) + 12,2 ima osnovno periodo 365 in zalogo [8,6; 15,8]; D(79) = 12,2 in D narašča na
[79 − 365/4, 79 + 365/4] (srednje dolg dan, ki se daljša); 121 − 79 = 42, argument 2π·42/365 ≈ 0,723,
sin(2π·42/365) ≈ 0,662, D(121) ≈ 14,6 h; D(t) = 15,8 natanko pri t = 79 + 365/4 + 365k (79 + 365/4 = 170,25
≈ 170), najkrajši dan pri 79 − 365/4 + 365 = 352,75 ≈ 353 (D = 8,6); dnevi: 20. 3. = 31 + 28 + 20 = 79,
1. 5. = 121, 19. 6. = 170, 19. 12. = 353.
trditev: MAT-SS-3/grafi-kotnih-funkcij#primer3
besedilo: »Podatki:** $D_{\min} = 8{,}6\,\text{h}$, $D_{\max} = 15{,}8\,\text{h}$, $T = 365\,\text{dni}$, 20. marec: $t = 79$ (dan srednje dolg, se daljša), 1. maj: $t = 121$« -/
theorem primer3 :
    ((15.8 : ℝ) + 8.6) / 2 = 12.2 ∧ ((15.8 : ℝ) - 8.6) / 2 = 3.6 ∧
    OsnovnaPerioda (fun t => 3.6 * sin (2 * π / 365 * (t - 79)) + 12.2) 365 ∧
    range (fun t => 3.6 * sin (2 * π / 365 * (t - 79)) + 12.2) = Icc 8.6 15.8 ∧
    3.6 * sin (2 * π / 365 * (79 - 79)) + 12.2 = 12.2 ∧
    StrictMonoOn (fun t => 3.6 * sin (2 * π / 365 * (t - 79)) + 12.2) (Icc (79 - 365 / 4) (79 + 365 / 4)) ∧
    (121 : ℝ) - 79 = 42 ∧
    (0.7225 : ℝ) < 2 * π / 365 * (121 - 79) ∧ 2 * π / 365 * (121 - 79) < 0.7235 ∧
    (0.6615 : ℝ) < sin (2 * π / 365 * (121 - 79)) ∧ sin (2 * π / 365 * (121 - 79)) < 0.6625 ∧
    (14.55 : ℝ) < 3.6 * sin (2 * π / 365 * (121 - 79)) + 12.2 ∧
    3.6 * sin (2 * π / 365 * (121 - 79)) + 12.2 < 14.65 ∧
    (∀ t, 3.6 * sin (2 * π / 365 * (t - 79)) + 12.2 = 15.8 ↔ ∃ k : ℤ, t = 79 + 365 / 4 + 365 * k) ∧
    (79 : ℝ) + 365 / 4 = 170.25 ∧ 3.6 * sin (2 * π / 365 * ((79 - 365 / 4 + 365) - 79)) + 12.2 = 8.6 ∧
    (79 : ℝ) - 365 / 4 + 365 = 352.75 ∧
    31 + 28 + 20 = 79 ∧ 31 + 28 + 31 + 30 + 1 = 121 ∧ 31 + 28 + 31 + 30 + 31 + 19 = 170 ∧
    31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30 + 19 = 353 := by
  have hp := pi_pos
  have p1 := pi_gt_d20; have p2 := pi_lt_d20
  have hb : (2 * π / 365) ≠ 0 := by positivity
  have h := splosna_sinus 3.6 (2 * π / 365) 79 12.2 (by norm_num) hb
  have r := (zaloga_mnozica 3.6 (2 * π / 365) 79 12.2 (by norm_num) hb).1
  rw [abs_of_pos (by positivity : (0 : ℝ) < 2 * π / 365), show 2 * π / (2 * π / 365) = 365 by field_simp] at h
  rw [show |(3.6 : ℝ)| = 3.6 by norm_num, show (12.2 : ℝ) - 3.6 = 8.6 by norm_num,
    show (12.2 : ℝ) + 3.6 = 15.8 by norm_num] at r
  -- argument
  have ea : 2 * π / 365 * (121 - 79) = 84 * π / 365 := by ring
  have a1 : (0.7229966654 : ℝ) < 84 * π / 365 := by linarith
  have a2 : 84 * π / 365 < (0.7229966655 : ℝ) := by linarith
  have m1 : sin 0.7229966654 ≤ sin (84 * π / 365) :=
    strictMonoOn_sin.monotoneOn ⟨by linarith, by linarith⟩ ⟨by linarith, by linarith⟩ a1.le
  have m2 : sin (84 * π / 365) ≤ sin 0.7229966655 :=
    strictMonoOn_sin.monotoneOn ⟨by linarith, by linarith⟩ ⟨by linarith, by linarith⟩ a2.le
  have s1 := sin_c1.1; have s2 := sin_c2.2
  have mono : StrictMonoOn (fun t => 3.6 * sin (2 * π / 365 * (t - 79)) + 12.2) (Icc (79 - 365 / 4) (79 + 365 / 4)) := by
    intro x hx y hy hxy
    have k : ∀ z ∈ Icc ((79 : ℝ) - 365 / 4) (79 + 365 / 4), 2 * π / 365 * (z - 79) ∈ Icc (-(π / 2)) (π / 2) := by
      intro z hz
      constructor <;> nlinarith [hz.1, hz.2]
    have := strictMonoOn_sin (k x hx) (k y hy) (by nlinarith)
    simp only; linarith
  have vrh : ∀ t, 3.6 * sin (2 * π / 365 * (t - 79)) + 12.2 = 15.8 ↔ ∃ k : ℤ, t = 79 + 365 / 4 + 365 * k := by
    intro t
    rw [show 3.6 * sin (2 * π / 365 * (t - 79)) + 12.2 = 15.8 ↔ sin (2 * π / 365 * (t - 79)) = 1 from
      ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, (nicle_vrhovi _).2.2.1]
    constructor
    · rintro ⟨k, hk⟩
      refine ⟨k, ?_⟩
      have : π * ((t - 79) * 2 / 365) = π * (1 / 2 + 2 * k) := by linarith
      have := mul_left_cancel₀ pi_ne_zero this
      linarith
    · rintro ⟨k, rfl⟩; exact ⟨k, by field_simp; ring⟩
  refine ⟨by norm_num, by norm_num, h.1, r, by simp, mono, by norm_num, by rw [ea]; linarith,
    by rw [ea]; linarith, by rw [ea]; linarith, by rw [ea]; linarith, by rw [ea]; linarith,
    by rw [ea]; linarith, vrh, by norm_num, ?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  rw [show 2 * π / 365 * ((79 - 365 / 4 + 365) - 79) = 3 * π / 2 by ring, tabela.2.2.2.1.1]; norm_num

/-- Primer 4: A = (5 − (−1))/2 = 3, d = (5 + (−1))/2 = 2, T = 5 − 1 = 4, b = 2π/4 = π/2, c = 1;
f(x) = 3 sin(π/2·(x − 1)) + 2 gre skozi (1; 2), (2; 5), (4; −1), (5; 2), ima osnovno periodo 4, in isti
predpis dajo c = 5, c = −3 ter 3 cos(π/2·(x − 2)) + 2 (RACUN `enako`).
trditev: MAT-SS-3/grafi-kotnih-funkcij#primer4
besedilo: »Zaporedna vrhova sta pri $x = 1$ in $x = 5$, zato je $T = 5 - 1 = 4$. Od vrha do dna pri $x = 3$ je pol periode. Narisana je $f(x) = 3\sin\left(\frac{\pi}{2}x\right) + 1$.« -/
theorem primer4 :
    ((5 : ℝ) - (-1)) / 2 = 3 ∧ ((5 : ℝ) + (-1)) / 2 = 2 ∧ (5 : ℝ) - 1 = 4 ∧ 2 * π / 4 = π / 2 ∧
    3 * sin (π / 2 * (1 - 1)) + 2 = 2 ∧ 3 * sin (π / 2 * (2 - 1)) + 2 = 5 ∧
    3 * sin (π / 2 * (4 - 1)) + 2 = -1 ∧ 3 * sin (π / 2 * (5 - 1)) + 2 = 2 ∧
    OsnovnaPerioda (fun x => 3 * sin (π / 2 * (x - 1)) + 2) 4 ∧
    (∀ x, 3 * sin (π / 2 * (x - 5)) + 2 = 3 * sin (π / 2 * (x - 1)) + 2) ∧
    (∀ x, 3 * sin (π / 2 * (x - -3)) + 2 = 3 * sin (π / 2 * (x - 1)) + 2) ∧
    (∀ x, 3 * cos (π / 2 * (x - 2)) + 2 = 3 * sin (π / 2 * (x - 1)) + 2) := by
  have hp := pi_pos
  have h := (splosna_sinus 3 (π / 2) 1 2 (by norm_num) (by positivity)).1
  rw [abs_of_pos (by positivity : (0 : ℝ) < π / 2), show 2 * π / (π / 2) = 4 by field_simp; ring] at h
  refine ⟨by norm_num, by norm_num, by norm_num, by ring, by simp, ?_, ?_, ?_, h, fun x => ?_, fun x => ?_,
    fun x => ?_⟩
  · rw [show π / 2 * (2 - 1) = π / 2 by ring, sin_pi_div_two]; norm_num
  · rw [show π / 2 * (4 - 1) = 3 * π / 2 by ring, tabela.2.2.2.1.1]; norm_num
  · rw [show π / 2 * (5 - 1) = 2 * π by ring, sin_two_pi]; norm_num
  · rw [show π / 2 * (x - 5) = π / 2 * (x - 1) + (-1 : ℤ) * (2 * π) by push_cast; ring,
      sin_add_int_mul_two_pi]
  · rw [show π / 2 * (x - -3) = π / 2 * (x - 1) + (1 : ℤ) * (2 * π) by push_cast; ring,
      sin_add_int_mul_two_pi]
  · rw [show π / 2 * (x - 2) = π / 2 * (x - 1) - π / 2 by ring, cos_sub_pi_div_two]

/-- Primer 4: premik c da isto funkcijo 3 sin(π/2·(x − c)) + 2 natanko tedaj, ko je c = 1 + 4k (k ∈ ℤ);
zato je c = 1 najmanjši pozitivni premik.
trditev: MAT-SS-3/grafi-kotnih-funkcij#primer4-premiki
besedilo: »$f(x) = 3\sin\big(\frac{\pi}{2}(x - 1)\big) + 2$« -/
theorem primer4_premiki :
    (∀ c : ℝ, (∀ x, 3 * sin (π / 2 * (x - c)) + 2 = 3 * sin (π / 2 * (x - 1)) + 2) ↔
      ∃ k : ℤ, c = 1 + 4 * k) ∧
    (∀ c : ℝ, 0 < c → (∀ x, 3 * sin (π / 2 * (x - c)) + 2 = 3 * sin (π / 2 * (x - 1)) + 2) → 1 ≤ c) := by
  have hp := pi_pos
  have key : ∀ c : ℝ, (∀ x, 3 * sin (π / 2 * (x - c)) + 2 = 3 * sin (π / 2 * (x - 1)) + 2) ↔
      ∃ k : ℤ, c = 1 + 4 * k := by
    intro c
    constructor
    · intro h
      have hs : ∀ u, sin (u + π / 2 * (c - 1)) = sin u := by
        intro u
        have := h (2 * u / π + c)
        rw [show π / 2 * (2 * u / π + c - c) = u by field_simp; ring,
          show π / 2 * (2 * u / π + c - 1) = u + π / 2 * (c - 1) by field_simp; ring] at this
        linarith
      obtain ⟨k, hk⟩ := (sin_premik _).mp hs
      refine ⟨k, ?_⟩
      have : π * (c - 1) = π * (4 * k) := by linarith
      have := mul_left_cancel₀ pi_ne_zero this
      linarith
    · rintro ⟨k, rfl⟩ x
      rw [show π / 2 * (x - (1 + 4 * k)) = π / 2 * (x - 1) + ((-k : ℤ) : ℝ) * (2 * π) by push_cast; ring,
        sin_add_int_mul_two_pi]
  refine ⟨key, fun c hc h => ?_⟩
  obtain ⟨k, rfl⟩ := (key c).mp h
  have : (-1 : ℝ) < k := by linarith
  have : (0 : ℤ) ≤ k := by
    have : (-1 : ℤ) < k := by exact_mod_cast this
    omega
  have : (0 : ℝ) ≤ k := by exact_mod_cast this
  linarith

/-- Pogoji izreka `primer4_premiki` se dajo izpolniti (c = 1, k = 0). -/
example : (0 : ℝ) < 1 ∧ (1 : ℝ) = 1 + 4 * ((0 : ℤ) : ℝ) := by norm_num

/-- Naloga 2 d): na [0, π] ima f(x) = 2 cos(2x − π/3) − 1 ničle natanko pri x = 0, π/3 in π.
trditev: MAT-SS-3/grafi-kotnih-funkcij#matura2-nicle
besedilo: »$f(x) = 2\cos\left(2x - \frac{\pi}{3}\right) - 1$« -/
theorem matura2_nicle (x : ℝ) (hx : x ∈ Icc 0 π) :
    2 * cos (2 * x - π / 3) - 1 = 0 ↔ x = 0 ∨ x = π / 3 ∨ x = π := by
  have hp := pi_pos
  have e : 2 * cos (2 * x - π / 3) - 1 = 0 ↔ cos (π / 3) = cos (2 * x - π / 3) := by
    rw [cos_pi_div_three]; constructor <;> intro h <;> linarith
  rw [e, cos_eq_cos_iff]
  constructor
  · rintro ⟨k, hk | hk⟩
    · have a : (-1 : ℝ) < k := by nlinarith [hx.1]
      have b : (k : ℝ) < 1 := by nlinarith [hx.2]
      have : k = 0 := by
        have a' : -1 < k := by exact_mod_cast a
        have b' : k < 1 := by exact_mod_cast b
        omega
      subst this; simp at hk; right; left; linarith
    · have a : (-1 : ℝ) < k := by nlinarith [hx.1]
      have b : (k : ℝ) < 2 := by nlinarith [hx.2]
      have : k = 0 ∨ k = 1 := by
        have a' : -1 < k := by exact_mod_cast a
        have b' : k < 2 := by exact_mod_cast b
        omega
      rcases this with rfl | rfl
      · simp at hk; left; linarith
      · simp at hk; right; right; linarith
  · rintro (rfl | rfl | rfl)
    · exact ⟨0, Or.inr (by simp)⟩
    · exact ⟨0, Or.inl (by simp; ring)⟩
    · exact ⟨1, Or.inr (by push_cast; ring)⟩

/-- Pogoj izreka `matura2_nicle` se da izpolniti (x = 0). -/
example : (0 : ℝ) ∈ Icc 0 π := ⟨le_rfl, pi_pos.le⟩

/-! ## Pogoste napake -/

/-- Predpostavke trditve `matura2_nicle` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) ∈ Icc 0 π := ⟨le_rfl, pi_pos.le⟩
  matura2_nicle (hx := w)

/-- Pogoste napake: pri 3 sin x − 1 je amplituda 3 (največja vrednost 2 ni amplituda; zaloga [−4, 2]); zaloga
4 cos x + 1 je [−3, 5], ne [−4, 4]; amplituda −2 sin x je |−2| = 2.
trditev: MAT-SS-3/grafi-kotnih-funkcij#pogoste
besedilo: »ker je največja vrednost $2$.« ali »$Z_f$ funkcije $4\cos x + 1$ je $[-4, 4]$.« Amplitudo merimo od srednje črte $y = d$,« -/
theorem pogoste :
    range (fun x => 3 * sin (1 * (x - 0)) + -1) = Icc (-4) 2 ∧
    range (fun x => 4 * cos (1 * (x - 0)) + 1) = Icc (-3) 5 ∧ Icc (-3 : ℝ) 5 ≠ Icc (-4) 4 ∧
    |(-2 : ℝ)| = 2 := by
  have r1 := (zaloga_mnozica 3 1 0 (-1) (by norm_num) one_ne_zero).1
  have r2 := (zaloga_mnozica 4 1 0 1 (by norm_num) one_ne_zero).2
  rw [show |(3 : ℝ)| = 3 by norm_num, show (-1 : ℝ) - 3 = -4 by norm_num,
    show (-1 : ℝ) + 3 = 2 by norm_num] at r1
  rw [show |(4 : ℝ)| = 4 by norm_num, show (1 : ℝ) - 4 = -3 by norm_num,
    show (1 : ℝ) + 4 = 5 by norm_num] at r2
  refine ⟨r1, r2, ?_, by norm_num⟩
  rw [Ne, Icc_eq_Icc_iff (by norm_num)]; norm_num

/-! ## Za maturo -/

/-- Naloga 1: za A > 0, b > 0 ima f(x) = A cos(bx) + d zalogo vrednosti [−1, 5] in osnovno periodo 2π/3
natanko tedaj, ko je d = (5 + (−1))/2 = 2, A = (5 − (−1))/2 = 3 in b = 3 (iz 2π/b = 2π/3, RACUN), torej
f(x) = 3 cos 3x + 2.
trditev: MAT-SS-3/grafi-kotnih-funkcij#matura1
besedilo: »Zapišite predpis funkcije oblike $f(x) = A\cos(bx) + d$, kjer sta $A > 0$ in $b > 0$, ki ima zalogo vrednosti $[-1, 5]$ in osnovno periodo $\frac{2\pi}{3}$.« -/
theorem matura1 (A b d : ℝ) (hA : 0 < A) (hb : 0 < b) :
    (range (fun x => A * cos (b * x) + d) = Icc (-1) 5 ∧ OsnovnaPerioda (fun x => A * cos (b * x) + d) (2 * π / 3))
      ↔ (d = 2 ∧ A = 3 ∧ b = 3) := by
  have hp := pi_pos
  have e : (fun x => A * cos (b * (x - 0)) + d) = fun x => A * cos (b * x) + d := by funext x; ring_nf
  have r := (zaloga_mnozica A b 0 d hA.ne' hb.ne').2
  have p := (splosna_kosinus A b 0 d hA.ne' hb.ne').1
  rw [e, abs_of_pos hA] at r
  rw [e, abs_of_pos hb] at p
  constructor
  · rintro ⟨h1, h2⟩
    rw [r, Icc_eq_Icc_iff (by linarith)] at h1
    have hT := osnovna_enolicna p h2
    have hb3 : b = 3 := by
      rw [div_eq_div_iff hb.ne' (by norm_num)] at hT; nlinarith
    refine ⟨by linarith, by linarith, hb3⟩
  · rintro ⟨rfl, rfl, rfl⟩
    refine ⟨by rw [r]; norm_num, p⟩

/-- Pogoja izreka `matura1` se dajo izpolniti (A = b = 3). -/
example : (0 : ℝ) < 3 := by norm_num

/-- Predpostavke trditve `matura1` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 3 := by norm_num
  matura1 (hA := w) (hb := w)

/-- Naloga 1, RACUN: (5 + (−1))/2 = 2, (5 − (−1))/2 = 3 in 2π/b = 2π/3 ⇔ b = 3 (za vsak realni b).
trditev: MAT-SS-3/grafi-kotnih-funkcij#matura1-racun
besedilo: »$A = \frac{5 - (-1)}{2} = 3$« -/
theorem matura1_racun : ((5 : ℝ) + (-1)) / 2 = 2 ∧ ((5 : ℝ) - (-1)) / 2 = 3 ∧
    ∀ b : ℝ, 2 * π / b = 2 * π / 3 ↔ b = 3 := by
  have hp := pi_pos
  refine ⟨by norm_num, by norm_num, fun b => ⟨fun h => ?_, fun h => by rw [h]⟩⟩
  rcases eq_or_ne b 0 with rfl | hb
  · rw [div_zero] at h; have : 0 < 2 * π / 3 := by positivity
    linarith
  · rw [div_eq_div_iff hb (by norm_num)] at h; nlinarith

/-- Naloga 2 (f(x) = 2 cos(2x − π/3) − 1): a) f(x) = 2 cos(2(x − π/6)) − 1, amplituda 2, osnovna perioda π;
b) f(0) = 2 cos(−π/3) − 1 = 2·1/2 − 1 = 0, Z_f = [−3, 1]; c) na [0, π] je f(x) = 1 natanko pri x = π/6 (naslednji
maksimum 7π/6 > π) in f(x) = −3 natanko pri x = 2π/3; d) točke (5π/12; −1), (11π/12; −1), (π; 0),
presečišče (π/3; 0), razmik četrtine periode π/4.
trditev: MAT-SS-3/grafi-kotnih-funkcij#matura2
besedilo: »Odgovor: a) $f(x) = 2\cos\left(2\left(x - \frac{\pi}{6}\right)\right) - 1$, amplituda $2$, perioda $\pi$; b) presečišče $(0, 0)$, $Z_f = [-3, 1]$; c) največja vrednost $1$ pri $x = \frac{\pi}{6}$, najmanjša $-3$ pri $x = \frac{2\pi}{3}$; d) graf je na sliki.« -/
theorem matura2 :
    (∀ x, 2 * cos (2 * x - π / 3) - 1 = 2 * cos (2 * (x - π / 6)) + -1) ∧ |(2 : ℝ)| = 2 ∧
    OsnovnaPerioda (fun x => 2 * cos (2 * (x - π / 6)) + -1) π ∧
    2 * cos (2 * 0 - π / 3) - 1 = 2 * (1 / 2) - 1 ∧ (2 : ℝ) * (1 / 2) - 1 = 0 ∧
    range (fun x => 2 * cos (2 * (x - π / 6)) + -1) = Icc (-3) 1 ∧
    (∀ x ∈ Icc 0 π, 2 * cos (2 * x - π / 3) - 1 = 1 ↔ x = π / 6) ∧
    2 * cos (2 * (7 * π / 6) - π / 3) - 1 = 1 ∧ π < 7 * π / 6 ∧
    (∀ x ∈ Icc 0 π, 2 * cos (2 * x - π / 3) - 1 = -3 ↔ x = 2 * π / 3) ∧
    2 * cos (2 * (5 * π / 12) - π / 3) - 1 = -1 ∧ 2 * cos (2 * (11 * π / 12) - π / 3) - 1 = -1 ∧
    2 * cos (2 * π - π / 3) - 1 = 0 ∧ 2 * cos (2 * (π / 3) - π / 3) - 1 = 0 ∧
    5 * π / 12 - π / 6 = π / 4 ∧ 2 * π / 3 - 5 * π / 12 = π / 4 ∧ 11 * π / 12 - 2 * π / 3 = π / 4 := by
  have hp := pi_pos
  have h := (splosna_kosinus 2 2 (π / 6) (-1) two_ne_zero two_ne_zero).1
  rw [abs_two, show 2 * π / 2 = π by ring] at h
  have r := (zaloga_mnozica 2 2 (π / 6) (-1) two_ne_zero two_ne_zero).2
  rw [abs_two, show (-1 : ℝ) - 2 = -3 by norm_num, show (-1 : ℝ) + 2 = 1 by norm_num] at r
  refine ⟨fun x => by ring_nf, abs_two, h, ?_, by norm_num, r, fun x hx => ?_, ?_, by linarith,
    fun x hx => ?_, ?_, ?_, ?_, ?_, by ring, by ring, by ring⟩
  · rw [show 2 * 0 - π / 3 = -(π / 3) by ring, cos_neg, cos_pi_div_three]
  · rw [show 2 * cos (2 * x - π / 3) - 1 = 1 ↔ cos (2 * x - π / 3) = 1 from
      ⟨fun h => by linarith, fun h => by rw [h]; ring⟩, (nicle_vrhovi _).2.2.2.1]
    constructor
    · rintro ⟨k, hk⟩
      have a : (-1 : ℝ) < k := by nlinarith [hx.1]
      have b : (k : ℝ) < 1 := by nlinarith [hx.2]
      have : k = 0 := by
        have a' : -1 < k := by exact_mod_cast a
        have b' : k < 1 := by exact_mod_cast b
        omega
      subst this; simp at hk; linarith
    · rintro rfl; exact ⟨0, by simp; ring⟩
  · rw [show 2 * (7 * π / 6) - π / 3 = 0 + (1 : ℤ) * (2 * π) by push_cast; ring,
      cos_add_int_mul_two_pi, cos_zero]; norm_num
  · rw [show 2 * cos (2 * x - π / 3) - 1 = -3 ↔ cos (2 * x - π / 3) = -1 from
      ⟨fun h => by linarith, fun h => by rw [h]; ring⟩, (nicle_vrhovi _).2.2.2.2.2]
    constructor
    · rintro ⟨k, hk⟩
      have a : (-1 : ℝ) < k := by nlinarith [hx.1]
      have b : (k : ℝ) < 1 := by nlinarith [hx.2]
      have : k = 0 := by
        have a' : -1 < k := by exact_mod_cast a
        have b' : k < 1 := by exact_mod_cast b
        omega
      subst this; simp at hk; linarith
    · rintro rfl; exact ⟨0, by simp; ring⟩
  · rw [show 2 * (5 * π / 12) - π / 3 = π / 2 by ring, cos_pi_div_two]; norm_num
  · rw [show 2 * (11 * π / 12) - π / 3 = π / 2 + π by ring, cos_add_pi, cos_pi_div_two]; norm_num
  · rw [show 2 * π - π / 3 = 2 * π - π / 3 by ring, cos_two_pi_sub, cos_pi_div_three]; norm_num
  · rw [show 2 * (π / 3) - π / 3 = π / 3 by ring, cos_pi_div_three]; norm_num

/-- Pomožna trditev: π·a = π·b ⇔ a = b.
pomozno -/
theorem pi_krajsaj {a b : ℝ} : π * a = π * b ↔ a = b := mul_right_inj' pi_ne_zero

/-- Naloga 3 a): d = (6,2 + 1,8)/2 = 4, A = (6,2 − 1,8)/2 = 2,2, 12 min = 0,2 h, 9,2 − 3 = 6,2 (pol periode),
T = 12,4 h, b = 2π/12,4 = π/6,2 ≈ 0,5067, c = (3 + 9,2)/2 = 6,1; h(t) = 2,2 sin(π/6,2·(t − 6,1)) + 4 ima
osnovno periodo 12,4, h(3) = 1,8 (oseka) in h(9,2) = 6,2 (plima); c = 6,1 je najmanjši pozitivni premik, pri
katerem je plima ob 9,2.
trditev: MAT-SS-3/grafi-kotnih-funkcij#matura3a
besedilo: »a) Ura 9.12 je $t = 9{,}2$, ker je $12\,\text{min} = 0{,}2\,\text{h}$. Od oseke do plime mine pol periode, $9{,}2 - 3 = 6{,}2$, zato je $T = 12{,}4\,\text{h}$ in $b = \frac{2\pi}{12{,}4} = \frac{\pi}{6{,}2} \approx 0{,}5067$.« -/
theorem matura3a :
    ((6.2 : ℝ) + 1.8) / 2 = 4 ∧ ((6.2 : ℝ) - 1.8) / 2 = 2.2 ∧ (12 : ℝ) / 60 = 0.2 ∧ (9.2 : ℝ) - 3 = 6.2 ∧
    2 * (6.2 : ℝ) = 12.4 ∧ 2 * π / 12.4 = π / 6.2 ∧ (0.50665 : ℝ) < π / 6.2 ∧ π / 6.2 < 0.50675 ∧
    ((3 : ℝ) + 9.2) / 2 = 6.1 ∧
    OsnovnaPerioda (fun t => 2.2 * sin (π / 6.2 * (t - 6.1)) + 4) 12.4 ∧
    2.2 * sin (π / 6.2 * (3 - 6.1)) + 4 = 1.8 ∧ 2.2 * sin (π / 6.2 * (9.2 - 6.1)) + 4 = 6.2 ∧
    ∀ c : ℝ, 0 < c → sin (π / 6.2 * (9.2 - c)) = 1 → 6.1 ≤ c := by
  have hp := pi_pos
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  have h := (splosna_sinus 2.2 (π / 6.2) 6.1 4 (by norm_num) (by positivity)).1
  rw [abs_of_pos (by positivity : (0 : ℝ) < π / 6.2), show 2 * π / (π / 6.2) = 12.4 by field_simp; norm_num] at h
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by ring,
    by rw [lt_div_iff₀ (by norm_num)]; linarith, by rw [div_lt_iff₀ (by norm_num)]; linarith,
    by norm_num, h, ?_, ?_, fun c hc hs => ?_⟩
  · rw [show π / 6.2 * (3 - 6.1) = -(π / 2) by ring, sin_neg, sin_pi_div_two]; norm_num
  · rw [show π / 6.2 * (9.2 - 6.1) = π / 2 by ring, sin_pi_div_two]; norm_num
  · obtain ⟨k, hk⟩ := ((nicle_vrhovi _).2.2.1).mp hs
    rw [show π / 6.2 * (9.2 - c) = π * ((92 - 10 * c) / 62) by ring] at hk
    have e : π * ((92 - 10 * c) / 62) = π * (1 / 2 + 2 * k) := by linarith
    rw [pi_krajsaj] at e
    have : (k : ℝ) ≤ 0 := by
      by_contra hc'; push Not at hc'
      have : (1 : ℝ) ≤ k := by
        have : 0 < k := by exact_mod_cast hc'
        exact_mod_cast this
      linarith
    linarith

/-- Naloga 3 b): ob 14.00 je argument π/6,2·(14 − 6,1) ≈ 4,00300, sin ≈ −0,758758 in globina h(14) ≈ 2,33073
≈ 2,33 m.
trditev: MAT-SS-3/grafi-kotnih-funkcij#matura3b
besedilo: »b) $h(14) = 2{,}2\sin\left(\frac{\pi}{6{,}2} \cdot 7{,}9\right) + 4$. Računalo mora biti v načinu RAD: argument je približno $4{,}00300$ in $\sin 4{,}00300 \approx -0{,}758758$.« -/
theorem matura3b :
    (4.002995 : ℝ) < π / 6.2 * (14 - 6.1) ∧ π / 6.2 * (14 - 6.1) < 4.003005 ∧
    (-0.7587585 : ℝ) < sin (π / 6.2 * (14 - 6.1)) ∧ sin (π / 6.2 * (14 - 6.1)) < -0.7587575 ∧
    (2.330725 : ℝ) < 2.2 * sin (π / 6.2 * (14 - 6.1)) + 4 ∧ 2.2 * sin (π / 6.2 * (14 - 6.1)) + 4 < 2.330735 ∧
    (2.325 : ℝ) < 2.2 * sin (π / 6.2 * (14 - 6.1)) + 4 ∧ 2.2 * sin (π / 6.2 * (14 - 6.1)) + 4 < 2.335 := by
  have hp := pi_pos
  have p1 := pi_gt_d20; have p2 := pi_lt_d20
  have ez : π / 6.2 * (14 - 6.1) = 17 * π / 62 + π := by ring
  have a1 : (0.8614044372 : ℝ) < 17 * π / 62 := by linarith
  have a2 : 17 * π / 62 < (0.8614044373 : ℝ) := by linarith
  have m1 : sin 0.8614044372 ≤ sin (17 * π / 62) :=
    strictMonoOn_sin.monotoneOn ⟨by linarith, by linarith⟩ ⟨by linarith, by linarith⟩ a1.le
  have m2 : sin (17 * π / 62) ≤ sin 0.8614044373 :=
    strictMonoOn_sin.monotoneOn ⟨by linarith, by linarith⟩ ⟨by linarith, by linarith⟩ a2.le
  have s1 := sin_d1.1; have s2 := sin_d2.2
  have es : sin (π / 6.2 * (14 - 6.1)) = -sin (17 * π / 62) := by rw [ez, sin_add_pi]
  refine ⟨by rw [ez]; linarith, by rw [ez]; linarith, by rw [es]; linarith, by rw [es]; linarith,
    by rw [es]; linarith, by rw [es]; linarith, by rw [es]; linarith, by rw [es]; linarith⟩

/-- Naloga 3 c): oseke (h = 1,8) so natanko ob t = 3 + 12,4k, plime (h = 6,2) natanko ob t = 9,2 + 12,4k;
naslednja oseka je ob 3 + 12,4 = 15,4 (15.24, 0,4·60 = 24), naslednja plima ob 9,2 + 12,4 = 21,6 (21.36,
0,6·60 = 36).
trditev: MAT-SS-3/grafi-kotnih-funkcij#matura3c
besedilo: »c) Oseke si sledijo na eno periodo: $3 + 12{,}4 = 15{,}4$, kar je ura 15.24. Tudi plime si sledijo na eno periodo: $9{,}2 + 12{,}4 = 21{,}6$, kar je ura 21.36.« -/
theorem matura3c :
    (∀ t, 2.2 * sin (π / 6.2 * (t - 6.1)) + 4 = 1.8 ↔ ∃ k : ℤ, t = 3 + 12.4 * k) ∧
    (∀ t, 2.2 * sin (π / 6.2 * (t - 6.1)) + 4 = 6.2 ↔ ∃ k : ℤ, t = 9.2 + 12.4 * k) ∧
    (3 : ℝ) + 12.4 = 15.4 ∧ (0.4 : ℝ) * 60 = 24 ∧ (9.2 : ℝ) + 12.4 = 21.6 ∧ (0.6 : ℝ) * 60 = 36 := by
  refine ⟨fun t => ?_, fun t => ?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  · rw [show 2.2 * sin (π / 6.2 * (t - 6.1)) + 4 = 1.8 ↔ sin (π / 6.2 * (t - 6.1)) = -1 from
      ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, sin_eq_neg_one_iff]
    constructor
    · rintro ⟨k, hk⟩
      rw [show π / 6.2 * (t - 6.1) = π * ((10 * t - 61) / 62) by ring] at hk
      have e : π * ((10 * t - 61) / 62) = π * (-(1 / 2) + 2 * k) := by linarith
      rw [pi_krajsaj] at e
      exact ⟨k, by linarith⟩
    · rintro ⟨k, rfl⟩; exact ⟨k, by ring⟩
  · rw [show 2.2 * sin (π / 6.2 * (t - 6.1)) + 4 = 6.2 ↔ sin (π / 6.2 * (t - 6.1)) = 1 from
      ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, sin_eq_one_iff]
    constructor
    · rintro ⟨k, hk⟩
      rw [show π / 6.2 * (t - 6.1) = π * ((10 * t - 61) / 62) by ring] at hk
      have e : π * ((10 * t - 61) / 62) = π * (1 / 2 + 2 * k) := by linarith
      rw [pi_krajsaj] at e
      exact ⟨k, by linarith⟩
    · rintro ⟨k, rfl⟩; exact ⟨k, by ring⟩

/-- Naloga 3 d): med oseko ob 3 in naslednjo oseko ob 15,4 je globina vsaj 4 m natanko za 6,1 ≤ t ≤ 12,3
(6.06 in 12.18; 6,1 + 6,2 = 12,3, 0,1·60 = 6, 0,3·60 = 18).
trditev: MAT-SS-3/grafi-kotnih-funkcij#matura3d
besedilo: »d) Globina je $4\,\text{m}$ na srednji črti. Funkcija gre skozi srednjo črto navzgor pri $t = c = 6{,}1$ (ura 6.06) in navzdol pol periode kasneje, pri $6{,}1 + 6{,}2 = 12{,}3$ (ura 12.18). Med tema trenutkoma je val nad srednjo črto (vmes je plima ob 9.12).« -/
theorem matura3d :
    (∀ t ∈ Icc (3 : ℝ) 15.4, 4 ≤ 2.2 * sin (π / 6.2 * (t - 6.1)) + 4 ↔ 6.1 ≤ t ∧ t ≤ 12.3) ∧
    (6.1 : ℝ) + 6.2 = 12.3 ∧ (0.1 : ℝ) * 60 = 6 ∧ (0.3 : ℝ) * 60 = 18 := by
  have hp := pi_pos
  refine ⟨fun t ht => ?_, by norm_num, by norm_num, by norm_num⟩
  set w := (10 * t - 61) / 62 with hw
  rw [show π / 6.2 * (t - 6.1) = π * w by rw [hw]; ring]
  have w0 : -(1 / 2) ≤ w := by rw [hw]; linarith [ht.1]
  have w1 : w ≤ 3 / 2 := by rw [hw]; linarith [ht.2]
  set u := π * w with hu
  have u0 : -(π / 2) ≤ u := by rw [hu]; nlinarith [mul_le_mul_of_nonneg_left w0 hp.le]
  have u1 : u ≤ 3 * π / 2 := by rw [hu]; nlinarith [mul_le_mul_of_nonneg_left w1 hp.le]
  have i1 : 0 ≤ u ↔ 6.1 ≤ t := by
    rw [hu, mul_nonneg_iff_of_pos_left hp, hw]
    constructor <;> intro h <;> linarith
  have i2 : u ≤ π ↔ t ≤ 12.3 := by
    rw [hu, show π * w ≤ π ↔ π * w ≤ π * 1 by rw [mul_one], mul_le_mul_iff_right₀ hp, hw]
    constructor <;> intro h <;> linarith
  rw [← i1, ← i2]
  constructor
  · intro h
    have hs : 0 ≤ sin u := by linarith
    constructor
    · by_contra hc; push Not at hc
      have := sin_neg_of_neg_of_neg_pi_lt hc (by linarith); linarith
    · by_contra hc; push Not at hc
      have := sin_neg_of_neg_of_neg_pi_lt (x := u - 2 * π) (by linarith) (by linarith)
      rw [sin_sub_two_pi] at this; linarith
  · rintro ⟨h1, h2⟩
    have := sin_nonneg_of_nonneg_of_le_pi h1 h2; linarith

/-- Ustno vprašanje 2 in Bolj natančno: sin(b(x + T)) = sin(bx) za vsak x (b ≠ 0) natanko takrat, ko je bT
večkratnik 2π; zato je osnovna perioda sin(bx) enaka 2π/|b|.
trditev: MAT-SS-3/grafi-kotnih-funkcij#ustno2
besedilo: »Ker je $\sin(bx + bT) = \sin(bx)$ za vsak $x$ natanko takrat, ko je $bT$ večkratnik $2\pi$, je najmanjši tak $|b|T = 2\pi$, torej $T = \frac{2\pi}{|b|}$.« -/
theorem ustno2 (b T : ℝ) (hb : b ≠ 0) :
    ((∀ x, sin (b * (x + T)) = sin (b * x)) ↔ ∃ k : ℤ, b * T = k * (2 * π)) ∧
    OsnovnaPerioda (fun x => sin (b * x)) (2 * π / |b|) := by
  refine ⟨?_, ?_⟩
  · rw [← sin_premik]
    constructor
    · intro h u
      have := h (u / b); rwa [show b * (u / b + T) = u + b * T by field_simp, show b * (u / b) = u by
        field_simp] at this
    · intro h x; rw [mul_add, h]
  · have := (splosna_sinus 1 b 0 0 one_ne_zero hb).1
    simpa using this

/-- Pogoj izreka `ustno2` se da izpolniti (b = 1). -/
example : (1 : ℝ) ≠ 0 := one_ne_zero

/-! ## Drugače -/

/-- Predpostavke trditve `ustno2` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ) ≠ 0 := one_ne_zero
  ustno2 (hb := w)

/-- Drugače, na sliki: val f(x) = 2 sin(2(x − π/4)) + 1 ima pri π/4, π/2, 3π/4, π, 5π/4 višine 1, 3, 1, −1, 1
(razmik četrtine periode π/4); kosinus začne v vrhu: cos 0 = 1, cos(π/2) = 0, cos π = −1, cos(3π/2) = 0,
cos 2π = 1.
trditev: MAT-SS-3/grafi-kotnih-funkcij#na-sliki
besedilo: »$f(x) = 2\sin\big(2(x - \frac{\pi}{4})\big) + 1$« -/
theorem na_sliki :
    2 * sin (2 * (π / 4 - π / 4)) + 1 = 1 ∧ 2 * sin (2 * (π / 2 - π / 4)) + 1 = 3 ∧
    2 * sin (2 * (3 * π / 4 - π / 4)) + 1 = 1 ∧ 2 * sin (2 * (π - π / 4)) + 1 = -1 ∧
    2 * sin (2 * (5 * π / 4 - π / 4)) + 1 = 1 ∧
    cos 0 = 1 ∧ cos (π / 2) = 0 ∧ cos π = -1 ∧ cos (3 * π / 2) = 0 ∧ cos (2 * π) = 1 := by
  refine ⟨by simp, ?_, ?_, ?_, ?_, cos_zero, cos_pi_div_two, cos_pi, tabela.2.2.2.1.2, cos_two_pi⟩
  · rw [show 2 * (π / 2 - π / 4) = π / 2 by ring, sin_pi_div_two]; norm_num
  · rw [show 2 * (3 * π / 4 - π / 4) = π by ring, sin_pi]; norm_num
  · rw [show 2 * (π - π / 4) = 3 * π / 2 by ring, tabela.2.2.2.1.1]; norm_num
  · rw [show 2 * (5 * π / 4 - π / 4) = 2 * π by ring, sin_two_pi]; norm_num

/-! ## Preveri se -/

/-- Preveri se 2: narisani val f(x) = 3 sin(π/2·x) + 1 gre skozi (0; 1), (1; 4), (3; −2), (5; 4) in ima osnovno
periodo 5 − 1 = 4; napačni odgovori: b = π/2 ≈ 1,6, pol periode 3 − 1 = 2, 4 − (−2) = 6 = 2|A|, |A| = 3.
trditev: MAT-SS-3/grafi-kotnih-funkcij#preveri2
besedilo: »Zaporedna vrhova sta pri $x = 1$ in $x = 5$, zato je $T = 5 - 1 = 4$. Od vrha do dna pri $x = 3$ je pol periode. Narisana je $f(x) = 3\sin\left(\frac{\pi}{2}x\right) + 1$.« -/
theorem preveri2 :
    3 * sin (π / 2 * 0) + 1 = 1 ∧ 3 * sin (π / 2 * 1) + 1 = 4 ∧ 3 * sin (π / 2 * 3) + 1 = -2 ∧
    3 * sin (π / 2 * 5) + 1 = 4 ∧ OsnovnaPerioda (fun x => 3 * sin (π / 2 * x) + 1) 4 ∧ (5 : ℝ) - 1 = 4 ∧
    (1.55 : ℝ) < π / 2 ∧ π / 2 < 1.65 ∧ (3 : ℝ) - 1 = 2 ∧ (4 : ℝ) - (-2) = 6 ∧ (6 : ℝ) / 2 = 3 := by
  have hp := pi_pos
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  have h := (splosna_sinus 3 (π / 2) 0 1 (by norm_num) (by positivity)).1
  rw [abs_of_pos (by positivity : (0 : ℝ) < π / 2), show 2 * π / (π / 2) = 4 by field_simp; ring] at h
  simp only [sub_zero] at h
  refine ⟨by simp, ?_, ?_, ?_, h, by norm_num, by linarith, by linarith, by norm_num, by norm_num, by norm_num⟩
  · rw [mul_one, sin_pi_div_two]; norm_num
  · rw [show π / 2 * 3 = 3 * π / 2 by ring, tabela.2.2.2.1.1]; norm_num
  · rw [show π / 2 * 5 = π / 2 + (1 : ℤ) * (2 * π) by push_cast; ring, sin_add_int_mul_two_pi,
      sin_pi_div_two]; norm_num

/-- Preveri se 4: svetlost s(t) = 40 cos(πt) + 50 niha od 50 − 40 = 10 do 50 + 40 = 90 odstotkov; najmanjša
svetlost 10 % je dosežena pri t = 1.
trditev: MAT-SS-3/grafi-kotnih-funkcij#preveri4
besedilo: »$|A| = 40$ in $d = 50$, zato svetlost niha od $50 - 40 = 10$ do $50 + 40 = 90$ odstotkov.« -/
theorem preveri4 : range (fun t => 40 * cos (π * (t - 0)) + 50) = Icc 10 90 ∧
    40 * cos (π * (1 - 0)) + 50 = 10 ∧ (50 : ℝ) - 40 = 10 ∧ (50 : ℝ) + 40 = 90 := by
  have r := (zaloga_mnozica 40 π 0 50 (by norm_num) pi_ne_zero).2
  rw [show |(40 : ℝ)| = 40 by norm_num] at r
  refine ⟨by rw [r]; norm_num, by rw [sub_zero, mul_one, cos_pi]; norm_num, by norm_num, by norm_num⟩

end Evklid.Lekcije.MAT_SS_3.GrafiKotnihFunkcij
