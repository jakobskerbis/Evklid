/-
vir: content/lessons/MAT-OS-9/valj.md
sha256: 3e56fe73147eda6354b829253e2f455746e23bee2281ea7f7c462ad5a45fe86d
Model: formule so funkcije na ℝ: `O r = π r²`, `V r v = π r² v`, `pl r v = 2π r v`, `P r v = 2·O r + pl r v`.
Prostornina je dokazana tudi kot mera: valj je množica (krog s polmerom r v ravnini) × (0, v) v
`EuclideanSpace ℝ (Fin 2) × ℝ` z Lebesguovo mero, in ima prostornino π r² v (`prostornina_mera`). Arhimedova
trditev je primerjava mer: krogla s polmerom r v ℝ³ (`EuclideanSpace ℝ (Fin 3)`) in valj s polmerom r in višino
2r. Količine so brez enot (cm, m, l so le v docstringih); decimalna števila so točni ulomki. »≈ a« na k decimalk je
|x − a| < ½·10⁻ᵏ (pri »približno N l« |x − N| < 1/2, pri »približno 100 l« na desetice |x − 100| < 5); meje za π
so `Real.pi_gt_d6`/`Real.pi_lt_d6` (pri 518π `pi_gt_d20`/`pi_lt_d20`).
Ni v Leanu: zgodovina (Arhimed, Cicero) in da se krogla »natanko prilega« v valj (geometrijska lega; dokazano je
le razmerje prostornin krogle s polmerom r in valja s polmerom r, višino 2r); pojmi (osnovni ploskvi, plašč, os,
višina, vrtenina, mreža, osni presek 2r × v, enakostranični valj v = 2r) kot definicije; da je razvit plašč pravokotnik 2πr × v oz. da je ploščina
ukrivljene ploskve 2πrv (ploščina ploskve v prostoru in dolžina krožnice — zahtevno, še ni dokazano; tu je
pl = 2πrv definicija); da vrtenje pravokotnika opiše valj (geometrijsko; dokazani so računi Primera 2 in kviza 4);
kviz 1 (pojmi; krožni izsek je plašč stožca); risba, simulacija, zgodba o pločevinki (opis, njene trditve so
dokazane kot formule); enote (dokazana je le 10³ = 1000); izbira formule in recept (navodila).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_9.Valj

open Real MeasureTheory

/-- Ploščina osnovne ploskve O = π r². -/
noncomputable def O (r : ℝ) : ℝ := π * r ^ 2

/-- Prostornina valja V = π r² v. -/
noncomputable def V (r v : ℝ) : ℝ := π * r ^ 2 * v

/-- Ploščina plašča pl = 2π r v. -/
noncomputable def pl (r v : ℝ) : ℝ := 2 * π * r * v

/-- Površina valja P = 2O + pl. -/
noncomputable def P (r v : ℝ) : ℝ := 2 * O r + pl r v

/-- Pomožno: |k·π − c| < e iz mej 3,141592 < π < 3,141593 (k ≥ 0).
pomozno – orodje: meje za π -/
theorem blizu (k c e : ℝ) (hk : 0 ≤ k) (h1 : c - e < k * 3.141592) (h2 : k * 3.141593 < c + e) :
    |k * π - c| < e := by
  have l := Real.pi_gt_d6
  have u := Real.pi_lt_d6
  rw [abs_lt]
  constructor <;> nlinarith

/-- Predpostavke `blizu` se dajo izpolniti (49π ≈ 153,94). -/
example : (0 : ℝ) ≤ 49 ∧ (15394 / 100 : ℝ) - 1 / 200 < 49 * 3.141592 ∧ (49 : ℝ) * 3.141593 < 15394 / 100 + 1 / 200 := by
  norm_num

/-! ## Splošne formule -/

/-- Razlaga (prostornina) kot mera: valj s polmerom r ≥ 0 in višino v (krog × interval (0, v)) ima prostornino
π r² v = O · v (pri v < 0 je množica prazna in obe strani sta 0, ker je `ENNReal.ofReal` negativnega števila 0).
trditev: MAT-OS-9/valj#prostornina
besedilo: »$$V = \pi r^2 v$$« -/
theorem prostornina_mera (r v : ℝ) (hr : 0 ≤ r) :
    volume (Metric.ball (0 : EuclideanSpace ℝ (Fin 2)) r ×ˢ Set.Ioo (0 : ℝ) v) = ENNReal.ofReal (V r v) := by
  rw [Measure.volume_eq_prod, Measure.prod_prod, EuclideanSpace.volume_ball_fin_two, Real.volume_Ioo, sub_zero,
    ← ENNReal.ofReal_pow hr, ← ENNReal.ofReal_mul (by positivity), ← ENNReal.ofReal_mul (by positivity)]
  unfold V
  congr 1
  ring

/-- Predpostavka `prostornina_mera` se da izpolniti (r = 3). -/
example : (0 : ℝ) ≤ 3 := by norm_num

/-- Zakaj se tega učimo (Arhimed): krogla s polmerom r ≥ 0 ima dve tretjini prostornine valja s polmerom r in
višino 2r (4/3 π r³ = 2/3 · π r² · 2r).
trditev: MAT-OS-9/valj#arhimed
besedilo: »da ima krogla, ki se natanko prilega v valj, dve tretjini prostornine tega valja« -/
theorem arhimed (r : ℝ) (hr : 0 ≤ r) :
    volume (Metric.ball (0 : EuclideanSpace ℝ (Fin 3)) r) =
      ENNReal.ofReal (2 / 3) * volume (Metric.ball (0 : EuclideanSpace ℝ (Fin 2)) r ×ˢ Set.Ioo (0 : ℝ) (2 * r)) := by
  rw [prostornina_mera r (2 * r) hr, EuclideanSpace.volume_ball_fin_three,
    ← ENNReal.ofReal_pow hr, ← ENNReal.ofReal_mul (by positivity), ← ENNReal.ofReal_mul (by norm_num)]
  unfold V
  congr 1
  ring

/-- Predpostavka `arhimed` se da izpolniti. -/
example : (0 : ℝ) ≤ 1 := by norm_num

/-- Razlaga, Povzetek: V = O · v.
trditev: MAT-OS-9/valj#prostornina-o-v
besedilo: »Prostornina: $V = O \cdot v = \pi r^2 v$.« -/
theorem V_O (r v : ℝ) : V r v = O r * v := by
  unfold V O; ring

/-- Razlaga, Povzetek: P = 2π r² + 2π r v = 2π r (r + v).
trditev: MAT-OS-9/valj#povrsina
besedilo: »Površina: $P = 2O + \mathrm{pl} = 2\pi r^2 + 2\pi r v = 2\pi r (r + v)$.« -/
theorem P_razpis (r v : ℝ) : P r v = 2 * π * r ^ 2 + 2 * π * r * v ∧ P r v = 2 * π * r * (r + v) := by
  unfold P O pl; constructor <;> ring

/-- Razlaga, Pogoste napake, Povzetek, Preveri se 2: dvakrat večji polmer (enaka višina) da štirikrat večjo
prostornino.
trditev: MAT-OS-9/valj#dvojni-polmer-v
besedilo: »Dvakrat večji polmer da štirikrat večjo prostornino.« -/
theorem dvojni_polmer_V (r v : ℝ) : V (2 * r) v = 4 * V r v := by
  unfold V; ring

/-- Razlaga: dvakrat višji valj (enak polmer) ima dvakrat večjo prostornino.
pomozno – lekcija dvakrat višjega valja ne pove splošno, le za posodi A in B (izrek posode) -/
theorem dvojna_visina_V (r v : ℝ) : V r (2 * v) = 2 * V r v := by
  unfold V; ring

/-- Razlaga, Premisli 1 (bidon): trikrat večji premer, torej trikrat večji polmer, pri enaki višini da
3 · 3 = 9-krat več.
trditev: MAT-OS-9/valj#bidon
besedilo: »Devetkrat več. Premer je trikrat večji, zato je tudi polmer trikrat večji. Osnovna ploskev je $3 \cdot 3 = 9$-krat večja, višina pa ostane enaka.« -/
theorem bidon (r v : ℝ) : V (3 * r) v = 9 * V r v := by
  unfold V; ring

/-- Razlaga, Premisli 2: pri dvojnem polmeru se plašč le podvoji.
trditev: MAT-OS-9/valj#dvojni-polmer-pl
besedilo: »Ne, plašč se samo podvoji.« -/
theorem dvojni_polmer_pl (r v : ℝ) : pl (2 * r) v = 2 * pl r v := by
  unfold pl; ring

/-- Razlaga, Premisli 2: pri dvojnem polmeru (r, v > 0) se površina ne podvoji in ne početveri.
trditev: MAT-OS-9/valj#dvojni-polmer-p
besedilo: »Površina se zato ne podvoji in ne početveri« -/
theorem dvojni_polmer_P (r v : ℝ) (hr : 0 < r) (hv : 0 < v) : P (2 * r) v ≠ 2 * P r v ∧ P (2 * r) v ≠ 4 * P r v := by
  unfold P O pl
  have h1 : 0 < π * r ^ 2 := by positivity
  have h2 : 0 < π * r * v := by positivity
  constructor <;> intro h <;> nlinarith

/-- Predpostavke `dvojni_polmer_P` se dajo izpolniti. -/
example : (0 : ℝ) < 3 ∧ (0 : ℝ) < 10 := by norm_num

/-- Pogoste napake (premer namesto polmera): π d² v pri d = 2r je štirikrat preveč.
trditev: MAT-OS-9/valj#premer-namesto-polmera
besedilo: »Pri $\pi r^2 v$ dobiš tako štirikrat preveliko prostornino.« -/
theorem premer_namesto_polmera (r v : ℝ) : V (2 * r) v = 4 * V r v := dvojni_polmer_V r v

/-- Pogoste napake (ena osnovna ploskev premalo): pri r > 0 je O + pl < 2O + pl.
trditev: MAT-OS-9/valj#ena-ploskev-premalo
besedilo: »**Ena osnovna ploskev premalo.** Učenec računa $P = O + \mathrm{pl}$ in prešteje samo dno.« -/
theorem ena_ploskev_premalo (r v : ℝ) (hr : 0 < r) : O r + pl r v < P r v := by
  unfold P O
  have : 0 < π * r ^ 2 := by positivity
  linarith

/-- Predpostavka `ena_ploskev_premalo` se da izpolniti. -/
example : (0 : ℝ) < 5 := by norm_num

/-- Razlaga (enote), Pogoste napake: 1 dm = 10 cm, zato 1 dm³ = 10³ = 1000 cm³ (ne 100).
trditev: MAT-OS-9/valj#liter
besedilo: »Liter je kubični decimeter, $1\,\text{l} = 1000\,\text{cm}^3$, zato deliš s $1000$.« -/
theorem liter : (10 : ℝ) ^ 3 = 1000 ∧ (10 : ℝ) ^ 3 ≠ 100 := by norm_num

/-! ## Razlaga: trenerjeve posode -/

/-- Razlaga (posode): B (r = 3, v = 10) 90π, A (r = 3, v = 20) 180π, C (r = 6, v = 10) 360π; A = 2B, C = 4B;
6² = 36, 3² = 9.
trditev: MAT-OS-9/valj#posode
besedilo: »V A gre res dvakrat toliko kot v B. V C pa štirikrat toliko.« -/
theorem posode : V 3 10 = 90 * π ∧ V 3 20 = 180 * π ∧ V 6 10 = 360 * π ∧ V 3 20 = 2 * V 3 10 ∧
    V 6 10 = 4 * V 3 10 ∧ (6 : ℝ) ^ 2 = 36 ∧ (3 : ℝ) ^ 2 = 9 := by
  unfold V; refine ⟨by ring, by ring, by ring, by ring, by ring, by norm_num, by norm_num⟩

/-! ## Rešeni primeri -/

/-- Primer 1 (penasti valj, r = 7, v = 30): O = π · 7² = 49π ≈ 153,94; pl = 2π · 7 · 30 = 420π ≈ 1319,47;
P = 2 · 49π + 420π = 518π ≈ 1627,34; V = 49π · 30 = 1470π ≈ 4618,14, okoli 4,6 l.
trditev: MAT-OS-9/valj#primer1
besedilo: »Odgovor: za prevleko potrebujemo približno $1627\,\text{cm}^2$ blaga, valj pa zavzame približno $4618\,\text{cm}^3$, torej okoli $4{,}6\,\text{l}$.« -/
theorem primer1 : O 7 = 49 * π ∧ pl 7 30 = 420 * π ∧ P 7 30 = 518 * π ∧ V 7 30 = 1470 * π ∧
    |49 * π - 15394 / 100| < 1 / 200 ∧ |420 * π - 131947 / 100| < 1 / 200 ∧
    |518 * π - 162734 / 100| < 1 / 200 ∧ |1470 * π - 461814 / 100| < 1 / 200 ∧
    |1470 * π / 1000 - 46 / 10| < 1 / 20 := by
  refine ⟨?_, ?_, ?_, ?_, blizu _ _ _ (by norm_num) (by norm_num) (by norm_num),
    blizu _ _ _ (by norm_num) (by norm_num) (by norm_num), ?_,
    blizu _ _ _ (by norm_num) (by norm_num) (by norm_num), ?_⟩
  · calc O 7 = π * 7 ^ 2 := rfl
      _ = 49 * π := by ring
  · calc pl 7 30 = 2 * π * 7 * 30 := rfl
      _ = 420 * π := by ring
  · calc P 7 30 = 2 * (49 * π) + 420 * π := by unfold P O pl; ring
      _ = 518 * π := by ring
  · calc V 7 30 = 49 * π * 30 := by unfold V; ring
      _ = 1470 * π := by ring
  · have l := Real.pi_gt_d20
    have u := Real.pi_lt_d20
    rw [abs_lt]
    constructor <;> nlinarith
  · rw [show 1470 * π / 1000 = (147 / 100) * π by ring]
    exact blizu _ _ _ (by norm_num) (by norm_num) (by norm_num)

/-- Primer 2 (zastavica 7 × 4): ob daljši stranici v = 7, r = 4: V₁ = π · 4² · 7 = 112π ≈ 351,86 (≈ 352); ob
krajši v = 4, r = 7: V₂ = π · 7² · 4 = 196π ≈ 615,75 (≈ 616); 196π : 112π = 1,75, drugi je večji.
trditev: MAT-OS-9/valj#primer2
besedilo: »Odgovor: prvi valj ima prostornino približno $352\,\text{cm}^3$, drugi približno $616\,\text{cm}^3$. Večji valj nastane, ko palčko pritrdimo ob krajšo stranico.« -/
theorem primer2 : V 4 7 = 112 * π ∧ V 7 4 = 196 * π ∧ |112 * π - 35186 / 100| < 1 / 200 ∧
    |196 * π - 61575 / 100| < 1 / 200 ∧ |112 * π - 352| < 1 / 2 ∧ |196 * π - 616| < 1 / 2 ∧
    V 7 4 / V 4 7 = 175 / 100 ∧ V 4 7 < V 7 4 := by
  have hp := Real.pi_pos
  refine ⟨by unfold V; ring, by unfold V; ring, blizu _ _ _ (by norm_num) (by norm_num) (by norm_num),
    blizu _ _ _ (by norm_num) (by norm_num) (by norm_num), blizu _ _ _ (by norm_num) (by norm_num) (by norm_num),
    blizu _ _ _ (by norm_num) (by norm_num) (by norm_num), ?_, ?_⟩
  · unfold V; field_simp; ring
  · unfold V; nlinarith

/-- Primer 3 (valjar), koraki 1–3: r = 60 : 2 = 30 cm = 0,3 m; pl = 2π · 0,3 · 1,2 = 0,72π ≈ 2,26 m²;
S = 36 · 18 = 648 m².
pomozno – vmesni koraki 1–3 primera 3 (polmer, plašč, ploščina igrišča); končno trditev citira primer3_obrati -/
theorem primer3_koraki : (60 : ℝ) / 2 = 30 ∧ (30 : ℝ) / 100 = 3 / 10 ∧ pl (3 / 10) (12 / 10) = 72 / 100 * π ∧
    |72 / 100 * π - 226 / 100| < 1 / 200 ∧ (36 : ℝ) * 18 = 648 := by
  refine ⟨by norm_num, by norm_num, by unfold pl; ring, blizu _ _ _ (by norm_num) (by norm_num) (by norm_num),
    by norm_num⟩

/-- Primer 3, Premisli: 648 / 2,26 ≈ 286,7; z natančno vrednostjo 648 / (0,72π) ≈ 286,5; 286 obratov ne povalja
vsega (286 · 0,72π < 648), zato je najmanjše število obratov ⌈648 / (0,72π)⌉ = 287.
trditev: MAT-OS-9/valj#primer3-obrati
besedilo: »$n \approx 286{,}7$ (z natančno vrednostjo $0{,}72\pi$ dobiš $286{,}5$). Zaokrožimo **navzgor**, ker $286$ obratov ne povalja vsega. Valj se mora zavrteti vsaj $287$-krat.« -/
theorem primer3_obrati : |(648 : ℝ) / (226 / 100) - 2867 / 10| < 1 / 20 ∧
    |648 / (72 / 100 * π) - 2865 / 10| < 1 / 20 ∧ 286 * (72 / 100 * π) < 648 ∧
    ⌈648 / (72 / 100 * π)⌉₊ = 287 := by
  have l := Real.pi_gt_d6
  have u := Real.pi_lt_d6
  have hp : 0 < 72 / 100 * π := by positivity
  refine ⟨by norm_num [abs_lt], ?_, by nlinarith, ?_⟩
  · rw [abs_lt]
    constructor
    · rw [lt_sub_iff_add_lt, lt_div_iff₀ hp]; nlinarith
    · rw [sub_lt_iff_lt_add, div_lt_iff₀ hp]; nlinarith
  · rw [Nat.ceil_eq_iff (by norm_num)]
    constructor
    · rw [lt_div_iff₀ hp]; norm_num; nlinarith
    · rw [div_le_iff₀ hp]; norm_num; nlinarith

/-! ## Korak za korakom -/

/-- Korak za korakom (r = 2, v = 10): O = π · 2² = 4π, pl = 2π · 2 · 10 = 40π, P = 2 · 4π + 40π = 48π ≈ 150,8,
V = 4π · 10 = 40π.
trditev: MAT-OS-9/valj#korak-za-korakom
besedilo: »| osnovna ploskev | $O = \pi r^2$ | $\pi \cdot 2^2 = 4\pi\,\text{cm}^2$ | | plašč | $\mathrm{pl} = 2\pi r v$ | $2\pi \cdot 2 \cdot 10 = 40\pi\,\text{cm}^2$ | | površina | $P = 2O + \mathrm{pl}$ | $2 \cdot 4\pi + 40\pi = 48\pi\,\text{cm}^2$ | | prostornina | $V = O \cdot v$ | $4\pi \cdot 10 = 40\pi\,\text{cm}^3$ |« -/
theorem korak_za_korakom : O 2 = 4 * π ∧ pl 2 10 = 40 * π ∧ P 2 10 = 48 * π ∧ V 2 10 = 40 * π ∧
    |48 * π - 1508 / 10| < 1 / 20 := by
  refine ⟨by unfold O; ring, by unfold pl; ring, ?_, by unfold V; ring,
    blizu _ _ _ (by norm_num) (by norm_num) (by norm_num)⟩
  calc P 2 10 = 2 * (4 * π) + 40 * π := by unfold P O pl; ring
    _ = 48 * π := by ring

/-! ## Preveri se -/

/-- Preveri se 2: π (2r)² = 4π r², zato je pri enaki višini prostornina štirikrat večja.
trditev: MAT-OS-9/valj#kviz2
besedilo: »Nova osnovna ploskev je $\pi (2r)^2 = 4\pi r^2$, torej štirikrat večja. Pri enaki višini je zato štirikrat večja tudi prostornina.« -/
theorem kviz2 (r v : ℝ) : O (2 * r) = 4 * O r ∧ V (2 * r) v = 4 * V r v := by
  unfold O V; constructor <;> ring

/-- Preveri se 3 (premer 10, višina 6): r = 10 : 2 = 5, O = 25π, pl = 60π; napačno P = O + pl = 85π, pravilno
P = 2O + pl = 50π + 60π = 110π.
trditev: MAT-OS-9/valj#kviz3
besedilo: »Valj ima dve osnovni ploskvi: $P = 2O + \mathrm{pl} = 50\pi + 60\pi = 110\pi\,\text{cm}^2$.« -/
theorem kviz3 : (10 : ℝ) / 2 = 5 ∧ O 5 = 25 * π ∧ pl 5 6 = 60 * π ∧ O 5 + pl 5 6 = 85 * π ∧ P 5 6 = 110 * π ∧
    P 5 6 ≠ O 5 + pl 5 6 := by
  have hp := Real.pi_pos
  refine ⟨by norm_num, by unfold O; ring, by unfold pl; ring, by unfold O pl; ring, by unfold P O pl; ring, ?_⟩
  unfold P O pl
  intro h
  nlinarith

/-- Preveri se 4 (pravokotnik 3 × 5 okoli stranice 5): v = 5, r = 3, V = π · 3² · 5 = 45π; napačni: zamenjani
vlogi 75π, brez kvadrata 15π, plašč 30π.
trditev: MAT-OS-9/valj#kviz4
besedilo: »Stranica ob osi je višina, $v = 5\,\text{cm}$, druga stranica je polmer, $r = 3\,\text{cm}$. $V = \pi \cdot 3^2 \cdot 5 = 45\pi\,\text{cm}^3$.« -/
theorem kviz4 : V 3 5 = 45 * π ∧ V 5 3 = 75 * π ∧ π * 3 * 5 = 15 * π ∧ pl 3 5 = 30 * π := by
  unfold V pl; refine ⟨by ring, by ring, by ring, by ring⟩

/-- Preveri se 5 (termovka r = 10, v = 32): V = π · 10² · 32 = 3200π ≈ 10 053 cm³, kar je približno 10 l;
napačni: π · 10 · 32 = 320π ≈ 1005 (≈ 1 l), plašč 640π ≈ 2011 (≈ 2 l), deljenje s 100 da ≈ 100.
trditev: MAT-OS-9/valj#kviz5
besedilo: »$V = \pi \cdot 10^2 \cdot 32 = 3200\pi \approx 10\,053\,\text{cm}^3$. Ker je $1\,\text{l} = 1000\,\text{cm}^3$, drži termovka približno $10\,\text{l}$.« -/
theorem kviz5 : V 10 32 = 3200 * π ∧ |3200 * π - 10053| < 1 / 2 ∧ |3200 * π / 1000 - 10| < 1 / 2 ∧
    |320 * π - 1005| < 1 / 2 ∧ |320 * π / 1000 - 1| < 1 / 2 ∧ pl 10 32 = 640 * π ∧ |640 * π - 2011| < 1 / 2 ∧
    |640 * π / 1000 - 2| < 1 / 2 ∧ |3200 * π / 100 - 100| < 5 := by
  refine ⟨by unfold V; ring, blizu _ _ _ (by norm_num) (by norm_num) (by norm_num), ?_,
    blizu _ _ _ (by norm_num) (by norm_num) (by norm_num), ?_, by unfold pl; ring,
    blizu _ _ _ (by norm_num) (by norm_num) (by norm_num), ?_, ?_⟩
  · rw [show 3200 * π / 1000 = (32 / 10) * π by ring]
    exact blizu _ _ _ (by norm_num) (by norm_num) (by norm_num)
  · rw [show 320 * π / 1000 = (32 / 100) * π by ring]
    exact blizu _ _ _ (by norm_num) (by norm_num) (by norm_num)
  · rw [show 640 * π / 1000 = (64 / 100) * π by ring]
    exact blizu _ _ _ (by norm_num) (by norm_num) (by norm_num)
  · rw [show 3200 * π / 100 = 32 * π by ring]
    exact blizu _ _ _ (by norm_num) (by norm_num) (by norm_num)

end Evklid.Lekcije.MAT_OS_9.Valj
