/-
vir: content/lessons/MAT-SS-3/adicijski-izreki.md
sha256: dfde1fb6ea23b64ca2da7a9f4e9f51ba83ace338d9202e5381fe3ba049f59782
Ni v Leanu: uganka s pico in zgodba o torti kot besedilo (dokazani so njuni računi); simulacija »Adicijski
izreki«; geometrijska utemeljitev z zrcaljenjem čez os x (dokazani sta enakosti cos(−β) = cos β,
sin(−β) = −sin β); »graf sinusa, premaknjen za 90° v levo, je graf kosinusa« (dokazana je enakost
sin(90° + β) = cos β); izpeljava tangensa z deljenjem s cos α cos β kot postopek (dokazan je izrek);
napotki, kako si formulo zapomniti, »izbereš obliko, ki vsebuje znano funkcijo«, Postopek v Ponovitvi in
točkovanje nalog; navedbe »priloga / na pamet«; »kosinus pada« v razlagi napake pri Preveri se 3 (dokazano
je le cos 75° < cos 60° = 0,5 z izračunanima vrednostma). Primer 3, korak 5: dokazano je, da je razdalja
točne lege natanko 12 cm in da je √(4,71² + 11,04²) med 11,95 in 12,05 (»≈ 12,0«).
Koti so v radianih (75° = 5π/12 ipd.). Tangens: v Leanu je x/0 = 0, zato tan x = 0, kjer je cos x = 0; izreki
za tangens imajo zato pogoje cos ≠ 0, ki jih lekcija ne zapiše, a jih potrebuje (sicer tangens ne obstaja).
»≈ a« na k decimalk je zapisano kot a − ½·10⁻ᵏ < vrednost < a + ½·10⁻ᵏ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.AdicijskiIzreki

open Real

/-! ## Pomožne ocene korenov -/

/-- Pomožna trditev: 1,4142 < √2 < 1,4143.
pomozno -/
theorem koren2 : (1.4142 : ℝ) < √2 ∧ √2 < 1.4143 := by
  constructor
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num

/-- Pomožna trditev: 1,7320 < √3 < 1,7321.
pomozno -/
theorem koren3 : (1.7320 : ℝ) < √3 ∧ √3 < 1.7321 := by
  constructor
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num

/-- Pomožna trditev: 2,4494 < √6 < 2,4495.
pomozno -/
theorem koren6 : (2.4494 : ℝ) < √6 ∧ √6 < 2.4495 := by
  constructor
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num

/-- Pomožna trditev: √2 · √3 = √6.
pomozno -/
theorem koren2_3 : √2 * √3 = √6 := by
  rw [← Real.sqrt_mul (by norm_num)]; norm_num

/-- Pomožna trditev: (√2)² = 2.
pomozno -/
theorem kv2 : √2 ^ 2 = 2 := Real.sq_sqrt (by norm_num)
/-- Pomožna trditev: (√3)² = 3.
pomozno -/
theorem kv3 : √3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)

/-! ## Razlaga -/

/-- Zakaj se tega učimo (uganka): sin 45° + sin 30° = √2/2 + 1/2 ≈ 1,207 in je večje od 1, zato ne more
biti sin 75° (sinus nikoli ne preseže 1).
trditev: MAT-SS-3/adicijski-izreki#uganka
besedilo: »Dobiš $\dfrac{\sqrt{2}}{2} + \dfrac{1}{2} \approx 1{,}207$. To ne more biti res, saj sinus nikoli ne preseže $1$. Sinus vsote torej **ni** vsota sinusov.« -/
theorem uganka : sin (π / 4) + sin (π / 6) = √2 / 2 + 1 / 2 ∧
    (1.2065 : ℝ) < √2 / 2 + 1 / 2 ∧ √2 / 2 + 1 / 2 < 1.2075 ∧
    1 < sin (π / 4) + sin (π / 6) ∧ sin (π / 4) + sin (π / 6) ≠ sin (π / 4 + π / 6) := by
  have h := koren2
  have hs : sin (π / 4) + sin (π / 6) = √2 / 2 + 1 / 2 := by rw [sin_pi_div_four, sin_pi_div_six]
  refine ⟨hs, by linarith, by linarith, by rw [hs]; linarith, ?_⟩
  intro he
  have := sin_le_one (π / 4 + π / 6)
  rw [← he, hs] at this; linarith

/-- Razlaga 1, tabela, stolpec »križni«: sin α cos β + cos α sin β za pare 30° + 60°, 30° + 30°, 60° + 90°,
45° + 30° je 1, √3/2 ≈ 0,866, 1/2 in (√6 + √2)/4 ≈ 0,966.
trditev: MAT-SS-3/adicijski-izreki#tabela-krizni
besedilo: »| $30^\circ + 60^\circ$ | $1$ | $1$ | | $30^\circ + 30^\circ$ | $0{,}866$ | $0{,}866$ | | $60^\circ + 90^\circ$ | $0{,}5$ | $0{,}5$ | | $45^\circ + 30^\circ$ | $0{,}966$ | $0{,}966$ |« -/
theorem tabela_krizni :
    sin (π / 6) * cos (π / 3) + cos (π / 6) * sin (π / 3) = 1 ∧
    sin (π / 6) * cos (π / 6) + cos (π / 6) * sin (π / 6) = √3 / 2 ∧
    sin (π / 3) * cos (π / 2) + cos (π / 3) * sin (π / 2) = 1 / 2 ∧
    sin (π / 4) * cos (π / 6) + cos (π / 4) * sin (π / 6) = (√6 + √2) / 4 ∧
    (0.8655 : ℝ) < √3 / 2 ∧ √3 / 2 < 0.8665 ∧
    (0.9655 : ℝ) < (√6 + √2) / 4 ∧ (√6 + √2) / 4 < 0.9665 := by
  have h2 := koren2; have h3 := koren3; have h6 := koren6
  simp only [sin_pi_div_six, cos_pi_div_six, sin_pi_div_three, cos_pi_div_three, sin_pi_div_two,
    cos_pi_div_two, sin_pi_div_four, cos_pi_div_four]
  refine ⟨?_, by ring, by ring, ?_, by linarith, by linarith, by linarith, by linarith⟩
  · nlinarith [kv3]
  · rw [← koren2_3]; ring

/-- Razlaga 1, tabela, stolpec sin(α + β): sin 90° = 1, sin 60° = √3/2, sin 150° = 1/2,
sin 75° = (√6 + √2)/4; križni izraz se ujema v vsaki vrstici.
trditev: MAT-SS-3/adicijski-izreki#tabela-vsota
besedilo: »| $30^\circ + 60^\circ$ | $1$ | $1$ | | $30^\circ + 30^\circ$ | $0{,}866$ | $0{,}866$ | | $60^\circ + 90^\circ$ | $0{,}5$ | $0{,}5$ | | $45^\circ + 30^\circ$ | $0{,}966$ | $0{,}966$ |« -/
theorem tabela_vsota :
    sin (π / 6 + π / 3) = 1 ∧ sin (π / 6 + π / 6) = √3 / 2 ∧ sin (π / 3 + π / 2) = 1 / 2 ∧
    sin (π / 4 + π / 6) = (√6 + √2) / 4 := by
  obtain ⟨a, b, c, d, -⟩ := tabela_krizni
  refine ⟨?_, ?_, ?_, ?_⟩ <;> rw [sin_add] <;> assumption

/-- Razlaga 1: vsota sinusov se za iste pare ne ujema nikjer: dá (1 + √3)/2 ≈ 1,366; 1; (√3 + 2)/2 ≈ 1,866 in
(√2 + 1)/2 ≈ 1,207, kar je vsakič različno od sin(α + β).
trditev: MAT-SS-3/adicijski-izreki#tabela-naivno
besedilo: »Vsota sinusov se ne ujema nikjer: za iste pare kotov da $1{,}366$; $1$; $1{,}866$ in $1{,}207$.« -/
theorem tabela_naivno :
    sin (π / 6) + sin (π / 3) = (1 + √3) / 2 ∧ sin (π / 6) + sin (π / 6) = 1 ∧
    sin (π / 3) + sin (π / 2) = (√3 + 2) / 2 ∧ sin (π / 4) + sin (π / 6) = (√2 + 1) / 2 ∧
    (1.3655 : ℝ) < (1 + √3) / 2 ∧ (1 + √3) / 2 < 1.3665 ∧
    (1.8655 : ℝ) < (√3 + 2) / 2 ∧ (√3 + 2) / 2 < 1.8665 ∧
    (1.2065 : ℝ) < (√2 + 1) / 2 ∧ (√2 + 1) / 2 < 1.2075 ∧
    sin (π / 6) + sin (π / 3) ≠ sin (π / 6 + π / 3) ∧
    sin (π / 6) + sin (π / 6) ≠ sin (π / 6 + π / 6) ∧
    sin (π / 3) + sin (π / 2) ≠ sin (π / 3 + π / 2) ∧
    sin (π / 4) + sin (π / 6) ≠ sin (π / 4 + π / 6) := by
  obtain ⟨a, b, c, d⟩ := tabela_vsota
  have h2 := koren2; have h3 := koren3; have h6 := koren6
  simp only [a, b, c, d, sin_pi_div_six, sin_pi_div_three, sin_pi_div_two, sin_pi_div_four]
  refine ⟨by ring, by ring, by ring, by ring, by linarith, by linarith, by linarith, by linarith,
    by linarith, by linarith, by intro h; linarith, by intro h; linarith, by intro h; linarith,
    by intro h; linarith⟩

/-- Razlaga 2: adicijski izrek za sinus, sin(α + β) = sin α cos β + cos α sin β (za vse kote).
trditev: MAT-SS-3/adicijski-izreki#sinus-vsote
besedilo: »$$\sin(\alpha + \beta) = \sin\alpha\cos\beta + \cos\alpha\sin\beta$$« -/
theorem sinus_vsote (α β : ℝ) : sin (α + β) = sin α * cos β + cos α * sin β := sin_add α β

/-- Razlaga 2, Premisli: sin(90° + β) = sin 90° cos β + cos 90° sin β = 1·cos β + 0·sin β = cos β.
trditev: MAT-SS-3/adicijski-izreki#sinus-90-plus
besedilo: »$\sin 90^\circ\cos\beta + \cos 90^\circ\sin\beta = 1 \cdot \cos\beta + 0 \cdot \sin\beta = \cos\beta$« -/
theorem sinus_90_plus (β : ℝ) : sin (π / 2 + β) = cos β := by
  calc sin (π / 2 + β) = sin (π / 2) * cos β + cos (π / 2) * sin β := sin_add _ _
    _ = 1 * cos β + 0 * sin β := by rw [sin_pi_div_two, cos_pi_div_two]
    _ = cos β := by ring

/-- Razlaga 3: adicijski izrek za kosinus, cos(α + β) = cos α cos β − sin α sin β.
trditev: MAT-SS-3/adicijski-izreki#kosinus-vsote
besedilo: »$$\cos(\alpha + \beta) = \cos\alpha\cos\beta - \sin\alpha\sin\beta$$« -/
theorem kosinus_vsote (α β : ℝ) : cos (α + β) = cos α * cos β - sin α * sin β := cos_add α β

/-- Razlaga 3, preizkus: cos 30° cos 60° − sin 30° sin 60° = √3/4 − √3/4 = 0 = cos 90°; s plusom bi dobili
√3/2 ≈ 0,866 ≠ 0.
trditev: MAT-SS-3/adicijski-izreki#kosinus-preizkus
besedilo: »Preizkus z $\alpha = 30^\circ$, $\beta = 60^\circ$: $\cos 30^\circ \cos 60^\circ - \sin 30^\circ \sin 60^\circ = \dfrac{\sqrt{3}}{4} - \dfrac{\sqrt{3}}{4} = 0$, in res je $\cos 90^\circ = 0$. S plusom bi dobili $\dfrac{\sqrt{3}}{2} \approx 0{,}866$, kar je napačno.« -/
theorem kosinus_preizkus :
    cos (π / 6) * cos (π / 3) - sin (π / 6) * sin (π / 3) = √3 / 4 - √3 / 4 ∧
    √3 / 4 - √3 / 4 = cos (π / 2) ∧
    cos (π / 6) * cos (π / 3) + sin (π / 6) * sin (π / 3) = √3 / 2 ∧ √3 / 2 ≠ cos (π / 2) := by
  have h3 := koren3
  simp only [cos_pi_div_six, cos_pi_div_three, sin_pi_div_six, sin_pi_div_three, cos_pi_div_two]
  refine ⟨by ring, by ring, by ring, by intro h; linarith⟩

/-- Razlaga 4: cos(−β) = cos β in sin(−β) = −sin β.
trditev: MAT-SS-3/adicijski-izreki#nasprotni-kot
besedilo: »Zato je $\cos(-\beta) = \cos\beta$ in $\sin(-\beta) = -\sin\beta$.« -/
theorem nasprotni_kot (β : ℝ) : cos (-β) = cos β ∧ sin (-β) = -sin β := ⟨cos_neg β, sin_neg β⟩

/-- Razlaga 4 in Ustno vprašanje 1: izreka za razliko dobimo z vstavitvijo −β:
sin(α − β) = sin α cos β − cos α sin β.
trditev: MAT-SS-3/adicijski-izreki#sinus-razlike
besedilo: »$$\sin(\alpha - \beta) = \sin\alpha\cos\beta - \cos\alpha\sin\beta$$« -/
theorem sinus_razlike (α β : ℝ) : sin (α - β) = sin α * cos β - cos α * sin β := by
  calc sin (α - β) = sin (α + -β) := by rw [sub_eq_add_neg]
    _ = sin α * cos (-β) + cos α * sin (-β) := sin_add _ _
    _ = sin α * cos β - cos α * sin β := by rw [cos_neg, sin_neg]; ring

/-- Razlaga 4 in Ustno vprašanje 1: cos(α − β) = cos α cos β + sin α sin β.
trditev: MAT-SS-3/adicijski-izreki#kosinus-razlike
besedilo: »$$\cos(\alpha - \beta) = \cos\alpha\cos\beta + \sin\alpha\sin\beta$$« -/
theorem kosinus_razlike (α β : ℝ) : cos (α - β) = cos α * cos β + sin α * sin β := by
  calc cos (α - β) = cos (α + -β) := by rw [sub_eq_add_neg]
    _ = cos α * cos (-β) - sin α * sin (-β) := cos_add _ _
    _ = cos α * cos β + sin α * sin β := by rw [cos_neg, sin_neg]; ring

/-- Razlaga 4 in Povzetek: tan(α + β) = (tan α + tan β)/(1 − tan α tan β), kjer tangensi obstajajo
(cos α, cos β, cos(α + β) ≠ 0).
trditev: MAT-SS-3/adicijski-izreki#tangens-vsote
besedilo: »$$\tan(\alpha \pm \beta) = \frac{\tan\alpha \pm \tan\beta}{1 \mp \tan\alpha\tan\beta}$$« -/
theorem tangens_vsote (α β : ℝ) (ha : cos α ≠ 0) (hb : cos β ≠ 0) (h : cos (α + β) ≠ 0) :
    tan (α + β) = (tan α + tan β) / (1 - tan α * tan β) := by
  rw [cos_add] at h
  simp only [tan_eq_sin_div_cos, sin_add, cos_add]
  have h1 : 1 - sin α / cos α * (sin β / cos β) = (cos α * cos β - sin α * sin β) / (cos α * cos β) := by
    field_simp
  rw [h1]
  field_simp

/-- Razlaga 4 in Povzetek: tan(α − β) = (tan α − tan β)/(1 + tan α tan β), kjer tangensi obstajajo.
trditev: MAT-SS-3/adicijski-izreki#tangens-razlike
besedilo: »$$\tan(\alpha \pm \beta) = \frac{\tan\alpha \pm \tan\beta}{1 \mp \tan\alpha\tan\beta}$$« -/
theorem tangens_razlike (α β : ℝ) (ha : cos α ≠ 0) (hb : cos β ≠ 0) (h : cos (α - β) ≠ 0) :
    tan (α - β) = (tan α - tan β) / (1 + tan α * tan β) := by
  have hb' : cos (-β) ≠ 0 := by rwa [cos_neg]
  rw [sub_eq_add_neg] at h ⊢
  rw [tangens_vsote α (-β) ha hb' h, tan_neg]
  ring

/-- Pogoji izrekov `tangens_vsote` in `tangens_razlike` se dajo izpolniti (α = β = 0). -/
example : cos (0:ℝ) ≠ 0 ∧ cos ((0:ℝ) + 0) ≠ 0 ∧ cos ((0:ℝ) - 0) ≠ 0 := by simp

/-- Predpostavke trditve `tangens_razlike` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  tangens_razlike 0 0 (by simp) (by simp) (by simp)

/-- Predpostavke trditve `tangens_vsote` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  tangens_vsote 0 0 (by simp) (by simp) (by simp)

/-- Razlaga 5 in Ustno vprašanje 2: sin 2α = sin α cos α + cos α sin α = 2 sin α cos α.
trditev: MAT-SS-3/adicijski-izreki#sinus-dvojnega
besedilo: »$\sin 2\alpha = \sin\alpha\cos\alpha + \cos\alpha\sin\alpha = 2\sin\alpha\cos\alpha$« -/
theorem sinus_dvojnega (α : ℝ) : sin (2 * α) = 2 * sin α * cos α := by
  calc sin (2 * α) = sin (α + α) := by rw [two_mul]
    _ = sin α * cos α + cos α * sin α := sin_add _ _
    _ = 2 * sin α * cos α := by ring

/-- Razlaga 5 in Ustno vprašanje 2: cos 2α = cos²α − sin²α = 1 − 2 sin²α = 2 cos²α − 1.
trditev: MAT-SS-3/adicijski-izreki#kosinus-dvojnega
besedilo: »$$\cos 2\alpha = \cos^2\alpha - \sin^2\alpha$$ Z zvezo $\sin^2\alpha + \cos^2\alpha = 1$ ima kosinus dvojnega kota še dve obliki. Izbereš tisto, ki vsebuje funkcijo, ki jo poznaš: $$\cos 2\alpha = 1 - 2\sin^2\alpha = 2\cos^2\alpha - 1$$« -/
theorem kosinus_dvojnega (α : ℝ) : cos (2 * α) = cos α ^ 2 - sin α ^ 2 ∧
    cos α ^ 2 - sin α ^ 2 = 1 - 2 * sin α ^ 2 ∧ 1 - 2 * sin α ^ 2 = 2 * cos α ^ 2 - 1 := by
  have h := sin_sq_add_cos_sq α
  refine ⟨?_, by linarith, by linarith⟩
  calc cos (2 * α) = cos (α + α) := by rw [two_mul]
    _ = cos α * cos α - sin α * sin α := cos_add _ _
    _ = cos α ^ 2 - sin α ^ 2 := by ring

/-- Razlaga 5: tan 2α = 2 tan α/(1 − tan²α), kjer tangensa obstajata (cos α ≠ 0, cos 2α ≠ 0).
trditev: MAT-SS-3/adicijski-izreki#tangens-dvojnega
besedilo: »Za tangens velja $\tan 2\alpha = \dfrac{2\tan\alpha}{1 - \tan^2\alpha}$.« -/
theorem tangens_dvojnega (α : ℝ) (ha : cos α ≠ 0) (h : cos (2 * α) ≠ 0) :
    tan (2 * α) = 2 * tan α / (1 - tan α ^ 2) := by
  rw [two_mul] at h ⊢
  rw [tangens_vsote α α ha ha h]; ring

/-- Pogoja izreka `tangens_dvojnega` se dajo izpolniti (α = 0). -/
example : cos (0:ℝ) ≠ 0 ∧ cos (2 * (0:ℝ)) ≠ 0 := by simp

/-- Predpostavke trditve `tangens_dvojnega` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : cos (0:ℝ) ≠ 0 ∧ cos (2 * (0:ℝ)) ≠ 0 := by simp
  tangens_dvojnega (ha := w.1) (h := w.2)

/-- Razlaga 5, Premisli, Pogoste napake in Preveri se 4: za ostri kot (0 < α < 90°) je sin 2α < 2 sin α,
ker je 0 < cos α < 1.
trditev: MAT-SS-3/adicijski-izreki#dvojni-manjsi
besedilo: »Pravilno je $2\sin\alpha\cos\alpha$, kar je za ostre kote vedno manj kot $2\sin\alpha$.« -/
theorem dvojni_manjsi (α : ℝ) (h0 : 0 < α) (h1 : α < π / 2) : sin (2 * α) < 2 * sin α := by
  have hs : 0 < sin α := sin_pos_of_pos_of_lt_pi h0 (by linarith [pi_pos])
  have hc : cos α < 1 := by
    have : cos α < cos 0 := cos_lt_cos_of_nonneg_of_le_pi_div_two le_rfl h1.le h0
    rwa [cos_zero] at this
  rw [sinus_dvojnega]; nlinarith

/-- Pogoji izreka `dvojni_manjsi` se dajo izpolniti (α = 30°). -/
example : (0:ℝ) < π / 6 ∧ π / 6 < π / 2 := ⟨by positivity, by linarith [pi_pos]⟩

/-- Predpostavke trditve `dvojni_manjsi` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < π / 6 ∧ π / 6 < π / 2 := ⟨by positivity, by linarith [pi_pos]⟩
  dvojni_manjsi (h0 := w.1) (h1 := w.2)

/-- Razlaga 5, Premisli: sin 2α = 2 sin α velja natanko tedaj, ko je sin α = 0 ali cos α = 1
(iz 2 sin α cos α = 2 sin α sledi sin α (cos α − 1) = 0).
trditev: MAT-SS-3/adicijski-izreki#dvojni-enak
besedilo: »Enakost bi veljala le pri $\cos\alpha = 1$ ali $\sin\alpha = 0$.« -/
theorem dvojni_enak (α : ℝ) : sin (2 * α) = 2 * sin α ↔ (sin α = 0 ∨ cos α = 1) := by
  rw [sinus_dvojnega]
  constructor
  · intro h
    have : sin α * (cos α - 1) = 0 := by linarith
    rcases mul_eq_zero.mp this with h0 | h0
    · exact Or.inl h0
    · exact Or.inr (by linarith)
  · rintro (h | h) <;> rw [h] <;> ring

/-- Razlaga 5, Premisli: za α = 60° je 2 sin α = √3 ≈ 1,732, sin 120° = √3/2 ≈ 0,866.
trditev: MAT-SS-3/adicijski-izreki#premisli-60
besedilo: »Za $\alpha = 60^\circ$ je $2\sin\alpha \approx 1{,}732$, $\sin 120^\circ$ pa le $0{,}866$.« -/
theorem premisli_60 : 2 * sin (π / 3) = √3 ∧ sin (2 * (π / 3)) = √3 / 2 ∧
    (1.7315 : ℝ) < √3 ∧ √3 < 1.7325 ∧ (0.8655 : ℝ) < √3 / 2 ∧ √3 / 2 < 0.8665 := by
  have h3 := koren3
  refine ⟨by rw [sin_pi_div_three]; ring, ?_, by linarith, by linarith, by linarith, by linarith⟩
  rw [sinus_dvojnega, sin_pi_div_three, cos_pi_div_three]; ring

/-- Razlaga 6: izraza 2 sin x cos x in cos²x − sin²x zapišemo krajše kot sin 2x in cos 2x.
trditev: MAT-SS-3/adicijski-izreki#preoblikovanje
besedilo: »Izraz $2\sin x\cos x$ lahko zapišeš krajše kot $\sin 2x$, izraz $\cos^2 x - \sin^2 x$ pa kot $\cos 2x$.« -/
theorem preoblikovanje (x : ℝ) : 2 * sin x * cos x = sin (2 * x) ∧ cos x ^ 2 - sin x ^ 2 = cos (2 * x) :=
  ⟨(sinus_dvojnega x).symm, (kosinus_dvojnega x).1.symm⟩

/-- Razlaga 7 in Povzetek (polovični kot): sin²(α/2) = (1 − cos α)/2 in cos²(α/2) = (1 + cos α)/2; izpeljava iz
cos α = 1 − 2 sin²(α/2) = 2 cos²(α/2) − 1.
trditev: MAT-SS-3/adicijski-izreki#polovicni
besedilo: »$\cos\alpha = 1 - 2\sin^2\frac{\alpha}{2} = 2\cos^2\frac{\alpha}{2} - 1$. Izrazimo kvadrata: $$\sin^2\frac{\alpha}{2} = \frac{1 - \cos\alpha}{2}$$ $$\cos^2\frac{\alpha}{2} = \frac{1 + \cos\alpha}{2}$$« -/
theorem polovicni (α : ℝ) : cos α = 1 - 2 * sin (α / 2) ^ 2 ∧ cos α = 2 * cos (α / 2) ^ 2 - 1 ∧
    sin (α / 2) ^ 2 = (1 - cos α) / 2 ∧ cos (α / 2) ^ 2 = (1 + cos α) / 2 := by
  obtain ⟨h1, h2, h3⟩ := kosinus_dvojnega (α / 2)
  have e : 2 * (α / 2) = α := by ring
  rw [e] at h1
  refine ⟨by linarith, by linarith, by linarith, by linarith⟩

/-- Razlaga 8 in Ustno vprašanje 3: sin(u + v) + sin(u − v) = 2 sin u cos v.
trditev: MAT-SS-3/adicijski-izreki#vsota-sinusov-uv
besedilo: »$\sin(u + v) + \sin(u - v) = 2\sin u\cos v$« -/
theorem vsota_sinusov_uv (u v : ℝ) : sin (u + v) + sin (u - v) = 2 * sin u * cos v := by
  rw [sin_add, sinus_razlike]; ring

/-- Razlaga 8, Povzetek in Ustno vprašanje 3: sin α + sin β = 2 sin((α + β)/2) cos((α − β)/2)
(z u = (α + β)/2, v = (α − β)/2).
trditev: MAT-SS-3/adicijski-izreki#sin-plus-sin
besedilo: »$$\sin\alpha + \sin\beta = 2\sin\frac{\alpha + \beta}{2}\cos\frac{\alpha - \beta}{2}$$« -/
theorem sin_plus_sin (α β : ℝ) : sin α + sin β = 2 * sin ((α + β) / 2) * cos ((α - β) / 2) := by
  have := vsota_sinusov_uv ((α + β) / 2) ((α - β) / 2)
  rwa [show (α + β) / 2 + (α - β) / 2 = α by ring, show (α + β) / 2 - (α - β) / 2 = β by ring] at this

/-- Razlaga 8: sin α − sin β = 2 cos((α + β)/2) sin((α − β)/2).
trditev: MAT-SS-3/adicijski-izreki#sin-minus-sin
besedilo: »$$\sin\alpha - \sin\beta = 2\cos\frac{\alpha + \beta}{2}\sin\frac{\alpha - \beta}{2}$$« -/
theorem sin_minus_sin (α β : ℝ) : sin α - sin β = 2 * cos ((α + β) / 2) * sin ((α - β) / 2) := by
  rw [sin_sub_sin]; ring

/-- Razlaga 8: cos α + cos β = 2 cos((α + β)/2) cos((α − β)/2).
trditev: MAT-SS-3/adicijski-izreki#cos-plus-cos
besedilo: »$$\cos\alpha + \cos\beta = 2\cos\frac{\alpha + \beta}{2}\cos\frac{\alpha - \beta}{2}$$« -/
theorem cos_plus_cos (α β : ℝ) : cos α + cos β = 2 * cos ((α + β) / 2) * cos ((α - β) / 2) :=
  cos_add_cos α β

/-- Razlaga 8: cos α − cos β = −2 sin((α + β)/2) sin((α − β)/2).
trditev: MAT-SS-3/adicijski-izreki#cos-minus-cos
besedilo: »$$\cos\alpha - \cos\beta = -2\sin\frac{\alpha + \beta}{2}\sin\frac{\alpha - \beta}{2}$$« -/
theorem cos_minus_cos (α β : ℝ) : cos α - cos β = -2 * sin ((α + β) / 2) * sin ((α - β) / 2) :=
  cos_sub_cos α β

/-- Razlaga 8, preizkus: sin 75° + sin 15° = 2 sin 45° cos 30° = √6/2 ≈ 1,225.
trditev: MAT-SS-3/adicijski-izreki#preizkus-75-15
besedilo: »Preizkus: $\sin 75^\circ + \sin 15^\circ = 2\sin 45^\circ\cos 30^\circ = \frac{\sqrt{6}}{2} \approx 1{,}225$.« -/
theorem preizkus_75_15 : sin (5 * π / 12) + sin (π / 12) = 2 * sin (π / 4) * cos (π / 6) ∧
    2 * sin (π / 4) * cos (π / 6) = √6 / 2 ∧ (1.2245 : ℝ) < √6 / 2 ∧ √6 / 2 < 1.2255 := by
  have h6 := koren6
  refine ⟨?_, ?_, by linarith, by linarith⟩
  · rw [sin_plus_sin, show (5 * π / 12 + π / 12) / 2 = π / 4 by ring,
      show (5 * π / 12 - π / 12) / 2 = π / 6 by ring]
  · rw [sin_pi_div_four, cos_pi_div_six, ← koren2_3]; ring

/-! ## Rešeni primeri -/

/-- Pomožna trditev: sin 15° = (√6 − √2)/4 in cos 75° = (√6 − √2)/4 (razlika oz. vsota kotov iz tabele).
pomozno -/
theorem sin15 : sin (π / 12) = (√6 - √2) / 4 ∧ cos (π / 4 + π / 6) = (√6 - √2) / 4 := by
  constructor
  · rw [show π / 12 = π / 4 - π / 6 by ring, sinus_razlike, sin_pi_div_four, cos_pi_div_four,
      sin_pi_div_six, cos_pi_div_six, ← koren2_3]; ring
  · rw [cos_add, sin_pi_div_four, cos_pi_div_four, sin_pi_div_six, cos_pi_div_six, ← koren2_3]; ring

/-- Primer 1: cos 15° = cos(45° − 30°) = √2/2·√3/2 + √2/2·1/2 = √6/4 + √2/4 = (√6 + √2)/4 ≈ 0,966, kar je
enako sin 75° (cos x = sin(90° − x)).
trditev: MAT-SS-3/adicijski-izreki#primer1
besedilo: »Odgovor: $\cos 15^\circ = \dfrac{\sqrt{6} + \sqrt{2}}{4} \approx 0{,}966$. Je enak $\sin 75^\circ$ iz uganke, saj se kota dopolnjujeta do $90^\circ$ in velja $\cos x = \sin(90^\circ - x)$.« -/
theorem primer1 : cos (π / 12) = (√6 + √2) / 4 ∧ (0.9655 : ℝ) < (√6 + √2) / 4 ∧ (√6 + √2) / 4 < 0.9665 ∧
    cos (π / 12) = sin (π / 2 - π / 12) ∧ π / 2 - π / 12 = 5 * π / 12 := by
  have h2 := koren2; have h6 := koren6
  refine ⟨?_, by linarith, by linarith, (sin_pi_div_two_sub _).symm, by ring⟩
  calc cos (π / 12) = cos (π / 4 - π / 6) := by congr 1; ring
    _ = cos (π / 4) * cos (π / 6) + sin (π / 4) * sin (π / 6) := kosinus_razlike _ _
    _ = √2 / 2 * (√3 / 2) + √2 / 2 * (1 / 2) := by
        rw [cos_pi_div_four, cos_pi_div_six, sin_pi_div_four, sin_pi_div_six]
    _ = √6 / 4 + √2 / 4 := by rw [← koren2_3]; ring
    _ = (√6 + √2) / 4 := by ring

/-- Primer 2: iz sin α = 3/5 in 90° < α < 180° sledi cos²α = 1 − 9/25 = 16/25, |cos α| = 4/5, cos α = −4/5,
sin 2α = 2·3/5·(−4/5) = −24/25, cos 2α = 1 − 2·9/25 = 7/25, preverba 576/625 + 49/625 = 1 in
270° < 2α < 360° (četrti kvadrant).
trditev: MAT-SS-3/adicijski-izreki#primer2
besedilo: »Odgovor: $\sin 2\alpha = -0{,}96$ in $\cos 2\alpha = 0{,}28$. Kot $2\alpha$ leži v četrtem kvadrantu.« -/
theorem primer2 (α : ℝ) (hs : sin α = 3 / 5) (h1 : π / 2 < α) (h2 : α < π) :
    cos α ^ 2 = 1 - 9 / 25 ∧ (1 : ℝ) - 9 / 25 = 16 / 25 ∧ |cos α| = 4 / 5 ∧ cos α = -4 / 5 ∧
    sin (2 * α) = -24 / 25 ∧ cos (2 * α) = 7 / 25 ∧
    sin (2 * α) ^ 2 + cos (2 * α) ^ 2 = 576 / 625 + 49 / 625 ∧ (576 : ℝ) / 625 + 49 / 625 = 1 ∧
    3 * π / 2 < 2 * α ∧ 2 * α < 2 * π := by
  have hp := pi_pos
  have hk : cos α ^ 2 = 1 - 9 / 25 := by have := sin_sq_add_cos_sq α; rw [hs] at this; linarith
  have hn : cos α < 0 := cos_neg_of_pi_div_two_lt_of_lt h1 (by linarith)
  have hc : cos α = -4 / 5 := by nlinarith
  have hs2 : sin (2 * α) = -24 / 25 := by
    calc sin (2 * α) = 2 * sin α * cos α := sinus_dvojnega α
      _ = 2 * (3 / 5) * (-4 / 5) := by rw [hs, hc]
      _ = -24 / 25 := by norm_num
  have hc2 : cos (2 * α) = 7 / 25 := by
    calc cos (2 * α) = 1 - 2 * sin α ^ 2 := by rw [(kosinus_dvojnega α).1, (kosinus_dvojnega α).2.1]
      _ = 1 - 2 * (9 / 25) := by rw [hs]; norm_num
      _ = 7 / 25 := by norm_num
  refine ⟨hk, by norm_num, by rw [hc]; norm_num, hc, hs2, hc2, by rw [hs2, hc2]; norm_num, by norm_num,
    ?_, by linarith⟩
  by_contra h
  push Not at h
  have := cos_nonpos_of_pi_div_two_le_of_le (x := 2 * α) (by linarith) (by linarith)
  linarith

/-- Pogoji izreka `primer2` se dajo izpolniti: α = 180° − arcsin(3/5). -/
example : sin (π - arcsin (3 / 5)) = 3 / 5 ∧ π / 2 < π - arcsin (3 / 5) ∧ π - arcsin (3 / 5) < π := by
  have h1 : 0 < arcsin (3 / 5 : ℝ) := arcsin_pos.mpr (by norm_num)
  have h2 : arcsin (3 / 5 : ℝ) < π / 2 := arcsin_lt_pi_div_two.mpr (by norm_num)
  refine ⟨by rw [sin_pi_sub, sin_arcsin (by norm_num) (by norm_num)], by linarith, by linarith⟩

/-- Predpostavke trditve `primer2` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : sin (π - arcsin (3 / 5)) = 3 / 5 ∧ π / 2 < π - arcsin (3 / 5) ∧ π - arcsin (3 / 5) < π := by
    have h1 : 0 < arcsin (3 / 5 : ℝ) := arcsin_pos.mpr (by norm_num)
    have h2 : arcsin (3 / 5 : ℝ) < π / 2 := arcsin_lt_pi_div_two.mpr (by norm_num)
    refine ⟨by rw [sin_pi_sub, sin_arcsin (by norm_num) (by norm_num)], by linarith, by linarith⟩
  primer2 (hs := w.1) (h1 := w.2.1) (h2 := w.2.2)

/-- Pogoste napake (predznak pri korenjenju) k Primeru 2: s cos α = +4/5 bi dobili 2·3/5·4/5 = 24/25 = 0,96,
kar ni pravi sin 2α = −0,96.
trditev: MAT-SS-3/adicijski-izreki#primer2-napaka
besedilo: »Predznak pozabljen pri korenjenju.** Iz $\sin\alpha$ dobiš $|\cos\alpha|$, predznak pa določi kvadrant. V Primeru 2 bi s $\cos\alpha = +\frac{4}{5}$ dobil $\sin 2\alpha = +0{,}96$, kar je napačno.« -/
theorem primer2_napaka : (2 : ℝ) * (3 / 5) * (4 / 5) = 0.96 ∧ (0.96 : ℝ) ≠ -24 / 25 := by norm_num

/-- Primer 3: skodelica 12 cm od središča v (9,6; 7,2) se zavrti za 30°: cos α = 9,6/12 = 0,8,
sin α = 7,2/12 = 0,6; cos(α + 30°) = 0,8·√3/2 − 0,6·1/2 (0,8·√3/2 ≈ 0,6928), sin(α + 30°) = 0,6·√3/2 + 0,8·1/2
(0,6·√3/2 ≈ 0,5196; cos(α + 30°) ≈ 0,3928, sin(α + 30°) ≈ 0,9196); x = 12 cos(α + 30°) ≈ 4,71 cm, y = 12 sin(α + 30°) ≈ 11,04 cm; razdalja točne lege od
središča je natanko 12 cm, √(4,71² + 11,04²) ≈ 12,0.
trditev: MAT-SS-3/adicijski-izreki#primer3
besedilo: »Odgovor: skodelica je po zasuku v točki približno $(4{,}71\,\text{cm};\ 11{,}04\,\text{cm})$.« -/
theorem primer3 (α : ℝ) (hc : 12 * cos α = 9.6) (hs : 12 * sin α = 7.2) :
    cos α = 9.6 / 12 ∧ (9.6 : ℝ) / 12 = 0.8 ∧ sin α = 7.2 / 12 ∧ (7.2 : ℝ) / 12 = 0.6 ∧
    12 * cos (α + π / 6) = 12 * (cos α * cos (π / 6) - sin α * sin (π / 6)) ∧
    12 * sin (α + π / 6) = 12 * (sin α * cos (π / 6) + cos α * sin (π / 6)) ∧
    cos (α + π / 6) = 0.8 * (√3 / 2) - 0.6 * (1 / 2) ∧ sin (α + π / 6) = 0.6 * (√3 / 2) + 0.8 * (1 / 2) ∧
    (0.39275 : ℝ) < cos (α + π / 6) ∧ cos (α + π / 6) < 0.39285 ∧
    (0.91955 : ℝ) < sin (α + π / 6) ∧ sin (α + π / 6) < 0.91965 ∧
    (0.69275 : ℝ) < 0.8 * (√3 / 2) ∧ 0.8 * (√3 / 2) < (0.69285 : ℝ) ∧
    (0.51955 : ℝ) < 0.6 * (√3 / 2) ∧ 0.6 * (√3 / 2) < (0.51965 : ℝ) ∧
    (4.705 : ℝ) < 12 * cos (α + π / 6) ∧ 12 * cos (α + π / 6) < 4.715 ∧
    (11.035 : ℝ) < 12 * sin (α + π / 6) ∧ 12 * sin (α + π / 6) < 11.045 ∧
    (12 * cos (α + π / 6)) ^ 2 + (12 * sin (α + π / 6)) ^ 2 = 12 ^ 2 ∧
    (11.95 : ℝ) < √(4.71 ^ 2 + 11.04 ^ 2) ∧ √(4.71 ^ 2 + 11.04 ^ 2) < (12.05 : ℝ) := by
  have h3 := koren3
  have hc' : cos α = 0.8 := by linarith
  have hs' : sin α = 0.6 := by linarith
  have ex : cos (α + π / 6) = 0.8 * (√3 / 2) - 0.6 * (1 / 2) := by
    rw [cos_add, hc', hs', cos_pi_div_six, sin_pi_div_six]
  have ey : sin (α + π / 6) = 0.6 * (√3 / 2) + 0.8 * (1 / 2) := by
    rw [sin_add, hc', hs', cos_pi_div_six, sin_pi_div_six]
  refine ⟨by linarith, by norm_num, by linarith, by norm_num, by rw [cos_add], by rw [sin_add], ex, ey,
    by rw [ex]; linarith, by rw [ex]; linarith, by rw [ey]; linarith, by rw [ey]; linarith,
    by linarith, by linarith, by linarith, by linarith, by rw [ex]; linarith, by rw [ex]; linarith,
    by rw [ey]; linarith, by rw [ey]; linarith, ?_, ?_, ?_⟩
  · have := sin_sq_add_cos_sq (α + π / 6); nlinarith
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num

/-- Pogoji izreka `primer3` se dajo izpolniti: α = arcsin 0,6. -/
example : 12 * cos (arcsin (0.6 : ℝ)) = 9.6 ∧ 12 * sin (arcsin (0.6 : ℝ)) = 7.2 := by
  rw [cos_arcsin, sin_arcsin (by norm_num) (by norm_num),
    show (1 - 0.6 ^ 2 : ℝ) = 0.8 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  norm_num

/-- Predpostavke trditve `primer3` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : 12 * cos (arcsin (0.6 : ℝ)) = 9.6 ∧ 12 * sin (arcsin (0.6 : ℝ)) = 7.2 := by
    rw [cos_arcsin, sin_arcsin (by norm_num) (by norm_num),
      show (1 - 0.6 ^ 2 : ℝ) = 0.8 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
    norm_num
  primer3 (hc := w.1) (hs := w.2)

/-- Primer 4: za 1 + cos 2α ≠ 0 je sin 2α/(1 + cos 2α) = 2 sin α cos α/(2 cos²α) = sin α/cos α = tan α
(v imenovalcu 1 + cos 2α = 1 + 2cos²α − 1 = 2cos²α).
trditev: MAT-SS-3/adicijski-izreki#primer4
besedilo: »Krajšamo $2\cos\alpha$ in ostane $\dfrac{\sin\alpha}{\cos\alpha} = \tan\alpha$.« -/
theorem primer4 (α : ℝ) (h : 1 + cos (2 * α) ≠ 0) : sin (2 * α) / (1 + cos (2 * α)) = tan α := by
  have hi : 1 + cos (2 * α) = 2 * cos α ^ 2 := by
    calc 1 + cos (2 * α) = 1 + (2 * cos α ^ 2 - 1) := by
          rw [(kosinus_dvojnega α).1, (kosinus_dvojnega α).2.1, (kosinus_dvojnega α).2.2]
      _ = 2 * cos α ^ 2 := by ring
  have hc : cos α ≠ 0 := by intro h0; apply h; rw [hi, h0]; ring
  calc sin (2 * α) / (1 + cos (2 * α)) = 2 * sin α * cos α / (2 * cos α ^ 2) := by
        rw [hi, sinus_dvojnega]
    _ = sin α / cos α := by field_simp
    _ = tan α := (tan_eq_sin_div_cos α).symm

/-- Pogoj izreka `primer4` se da izpolniti (α = 0). -/
example : 1 + cos (2 * (0:ℝ)) ≠ 0 := by norm_num

/-- Predpostavke trditve `primer4` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : 1 + cos (2 * (0:ℝ)) ≠ 0 := by norm_num
  primer4 (h := w)

/-- Primer 4, preizkus z α = 30°: sin 60°/(1 + cos 60°) = (√3/2)/(3/2) = √3/3 = tan 30° ≈ 0,577; tudi
0,866/1,5 ≈ 0,577.
trditev: MAT-SS-3/adicijski-izreki#primer4-preizkus
besedilo: »Preizkus z $\alpha = 30^\circ$: $\dfrac{\sin 60^\circ}{1 + \cos 60^\circ} = \dfrac{0{,}866}{1{,}5} \approx 0{,}577 = \tan 30^\circ$.« -/
theorem primer4_preizkus : sin (π / 3) / (1 + cos (π / 3)) = √3 / 3 ∧ tan (π / 6) = √3 / 3 ∧
    (0.5765 : ℝ) < √3 / 3 ∧ √3 / 3 < 0.5775 ∧ (0.5765 : ℝ) < 0.866 / 1.5 ∧ (0.866 : ℝ) / 1.5 < 0.5775 := by
  have h3 := koren3
  have hp : 0 < √3 := by positivity
  refine ⟨by rw [sin_pi_div_three, cos_pi_div_three]; ring, ?_, by linarith, by linarith, by norm_num,
    by norm_num⟩
  rw [tan_pi_div_six]; field_simp; rw [kv3]

/-- Primer 5: iz cos α = −7/25 in 180° < α < 270° sledi 90° < α/2 < 135°, sin²(α/2) = (1 + 7/25)/2 = 16/25,
sin(α/2) = 4/5, cos²(α/2) = (1 − 7/25)/2 = 9/25, cos(α/2) = −3/5; preverba 9/25 − 16/25 = −7/25.
trditev: MAT-SS-3/adicijski-izreki#primer5
besedilo: »Odgovor: $\sin\dfrac{\alpha}{2} = 0{,}8$ in $\cos\dfrac{\alpha}{2} = -0{,}6$.« -/
theorem primer5 (α : ℝ) (hc : cos α = -7 / 25) (h1 : π < α) (h2 : α < 3 * π / 2) :
    π / 2 < α / 2 ∧ α / 2 < 3 * π / 4 ∧
    sin (α / 2) ^ 2 = (1 + 7 / 25) / 2 ∧ ((1 : ℝ) + 7 / 25) / 2 = 16 / 25 ∧ sin (α / 2) = 4 / 5 ∧
    cos (α / 2) ^ 2 = (1 - 7 / 25) / 2 ∧ ((1 : ℝ) - 7 / 25) / 2 = 9 / 25 ∧ cos (α / 2) = -3 / 5 ∧
    cos (α / 2) ^ 2 - sin (α / 2) ^ 2 = 9 / 25 - 16 / 25 ∧ (9 : ℝ) / 25 - 16 / 25 = -7 / 25 := by
  have hp := pi_pos
  obtain ⟨-, -, hs, hk⟩ := polovicni α
  rw [hc] at hs hk
  have hs' : sin (α / 2) ^ 2 = (1 + 7 / 25) / 2 := by rw [hs]; ring
  have hsp : 0 < sin (α / 2) := sin_pos_of_pos_of_lt_pi (by linarith) (by linarith)
  have hcn : cos (α / 2) < 0 := cos_neg_of_pi_div_two_lt_of_lt (by linarith) (by linarith)
  have e1 : sin (α / 2) = 4 / 5 := by nlinarith
  have e2 : cos (α / 2) = -3 / 5 := by nlinarith
  refine ⟨by linarith, by linarith, hs', by norm_num, e1, by rw [hk]; ring, by norm_num, e2,
    by rw [e1, e2]; norm_num, by norm_num⟩

/-- Pogoji izreka `primer5` se dajo izpolniti: α = 180° + arccos(7/25). -/
example : cos (π + arccos (7 / 25)) = -7 / 25 ∧ π < π + arccos (7 / 25) ∧
    π + arccos (7 / 25) < 3 * π / 2 := by
  have h1 : 0 < arccos (7 / 25 : ℝ) := arccos_pos.mpr (by norm_num)
  have h2 : arccos (7 / 25 : ℝ) < π / 2 := arccos_lt_pi_div_two.mpr (by norm_num)
  refine ⟨?_, by linarith, by linarith⟩
  rw [cos_add, cos_pi, sin_pi, cos_arccos (by norm_num) (by norm_num)]; ring

/-- Predpostavke trditve `primer5` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : cos (π + arccos (7 / 25)) = -7 / 25 ∧ π < π + arccos (7 / 25) ∧ π + arccos (7 / 25) < 3 * π / 2 := by
    have h1 : 0 < arccos (7 / 25 : ℝ) := arccos_pos.mpr (by norm_num)
    have h2 : arccos (7 / 25 : ℝ) < π / 2 := arccos_lt_pi_div_two.mpr (by norm_num)
    refine ⟨?_, by linarith, by linarith⟩
    rw [cos_add, cos_pi, sin_pi, cos_arccos (by norm_num) (by norm_num)]; ring
  primer5 (hc := w.1) (h1 := w.2.1) (h2 := w.2.2)

/-- Blok RACUN (k Primeru 5): sin(π − arctan(4/3)) = 0,8, cos(π − arctan(4/3)) = −0,6 in
cos(2(π − arctan(4/3))) = −0,28.
trditev: MAT-SS-3/adicijski-izreki#racun-primer5
besedilo: »$\sin\dfrac{\alpha}{2} = 0{,}8$ in $\cos\dfrac{\alpha}{2} = -0{,}6$.« -/
theorem racun_primer5 : sin (π - arctan (4 / 3)) = 0.8 ∧ cos (π - arctan (4 / 3)) = -0.6 ∧
    cos (2 * (π - arctan (4 / 3))) = -0.28 := by
  have hq : √(1 + (4 / 3 : ℝ) ^ 2) = 5 / 3 := by
    rw [show (1 + (4 / 3 : ℝ) ^ 2) = (5 / 3) ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have hs : sin (π - arctan (4 / 3)) = 0.8 := by rw [sin_pi_sub, sin_arctan, hq]; norm_num
  have hc : cos (π - arctan (4 / 3)) = -0.6 := by rw [cos_pi_sub, cos_arctan, hq]; norm_num
  refine ⟨hs, hc, ?_⟩
  rw [(kosinus_dvojnega _).1, hs, hc]; norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake: sin(α + β) = sin α + sin β ne velja za vse kote (že 45° + 30° jo ovrže),
sin 2α = 2 sin α ne velja za vse kote (α = 90°: sin 180° = 0 ≠ 2), cos²α + sin²α je vedno 1, zato ne more biti
cos 2α (pri α = 90° je cos 180° = −1).
trditev: MAT-SS-3/adicijski-izreki#pogoste-napake
besedilo: »**»Sinus vsote je vsota sinusov.«** Zapis $\sin(\alpha + \beta) = \sin\alpha + \sin\beta$ je videti kot razčlenjevanje oklepaja. Sinus pa ni množenje s številom, zato oklepaja ne smeš »razčleniti«. Že $\sin 45^\circ + \sin 30^\circ > 1$ pokaže, da je to nemogoče. Uporabi križni izraz. - **Napačen predznak pri kosinusu.** Kdor si zapomni, da je pri sinusu vsote plus, rad napiše plus tudi pri kosinusu. Pri kosinusu je predznak ravno obrnjen: pri vsoti minus, pri razliki plus. Preveri s $\cos(30^\circ + 60^\circ) = 0$. - **$\sin 2\alpha = 2\sin\alpha$.** Dvojka pred kotom ni dvojka pred funkcijo. Pravilno je $2\sin\alpha\cos\alpha$, kar je za ostre kote vedno manj kot $2\sin\alpha$. - **$\cos 2\alpha = \cos^2\alpha + \sin^2\alpha$.** Ta izraz je vedno $1$, zato ne more biti $\cos 2\alpha$. Med kvadratoma je minus.« -/
theorem pogoste_napake :
    sin (π / 4 + π / 6) ≠ sin (π / 4) + sin (π / 6) ∧ sin (2 * (π / 2)) ≠ 2 * sin (π / 2) ∧
    (∀ α : ℝ, cos α ^ 2 + sin α ^ 2 = 1) ∧ cos (2 * (π / 2)) ≠ cos (π / 2) ^ 2 + sin (π / 2) ^ 2 := by
  refine ⟨fun h => (tabela_naivno.2.2.2.2.2.2.2.2.2.2.2.2.2) h.symm, ?_, fun α => by
    rw [add_comm]; exact sin_sq_add_cos_sq α, ?_⟩
  · rw [show 2 * (π / 2) = π by ring, sin_pi, sin_pi_div_two]; norm_num
  · rw [show 2 * (π / 2) = π by ring, cos_pi, cos_pi_div_two, sin_pi_div_two]; norm_num

/-! ## Za maturo -/

/-- Naloga 1: tan 75° = tan(45° + 30°) = (1 + √3/3)/(1 − 1·√3/3) = (3 + √3)/(3 − √3)
= (3 + √3)²/((3 − √3)(3 + √3)) = (9 + 6√3 + 3)/(9 − 3) = (12 + 6√3)/6 = 2 + √3.
trditev: MAT-SS-3/adicijski-izreki#matura1
besedilo: »$\dfrac{(3 + \sqrt3)^2}{(3 - \sqrt3)(3 + \sqrt3)} = \dfrac{9 + 6\sqrt3 + 3}{9 - 3} = \dfrac{12 + 6\sqrt3}{6} = 2 + \sqrt3$« -/
theorem matura1 : tan (5 * π / 12) = 2 + √3 := by
  have h3 := koren3; have h2 := koren2; have h6 := koren6
  have k := kv3
  have t6 : tan (π / 6) = √3 / 3 := primer4_preizkus.2.1
  have c1 : cos (π / 4) ≠ 0 := by rw [cos_pi_div_four]; positivity
  have c2 : cos (π / 6) ≠ 0 := by rw [cos_pi_div_six]; positivity
  have c3 : cos (π / 4 + π / 6) ≠ 0 := by rw [sin15.2]; intro h; linarith
  have d1 : (3 - √3) ≠ 0 := by intro h; linarith
  have d2 : (1 - 1 * (√3 / 3)) ≠ 0 := by intro h; linarith
  calc tan (5 * π / 12) = tan (π / 4 + π / 6) := by congr 1; ring
    _ = (tan (π / 4) + tan (π / 6)) / (1 - tan (π / 4) * tan (π / 6)) := tangens_vsote _ _ c1 c2 c3
    _ = (1 + √3 / 3) / (1 - 1 * (√3 / 3)) := by rw [tan_pi_div_four, t6]
    _ = (3 + √3) / (3 - √3) := by field_simp
    _ = (3 + √3) ^ 2 / ((3 - √3) * (3 + √3)) := by
        have : (3 + √3) ≠ 0 := by positivity
        field_simp
    _ = (9 + 6 * √3 + 3) / (9 - 3) := by congr 1 <;> nlinarith
    _ = (12 + 6 * √3) / 6 := by ring
    _ = 2 + √3 := by ring

/-- Preveri se 3 (Nina): pravilno je cos 75° = (√6 − √2)/4 ≈ 0,259, kar je manj od cos 60° = 0,5;
Ninin izraz s plusom (korak 2) dá (√6 + √2)/4 ≈ 0,966, ki ni cos 75°, zato je napaka v koraku 2.
trditev: MAT-SS-3/adicijski-izreki#nina
besedilo: »Kosinus pada, zato mora biti $\cos 75^\circ$ manjši od $\cos 60^\circ = 0{,}5$. Rezultat $0{,}966$ je prevelik.« -/
theorem nina : cos (5 * π / 12) = (√6 - √2) / 4 ∧ (0.2585 : ℝ) < (√6 - √2) / 4 ∧ (√6 - √2) / 4 < 0.2595 ∧
    cos (5 * π / 12) < cos (π / 3) ∧
    cos (π / 4) * cos (π / 6) + sin (π / 4) * sin (π / 6) = (√6 + √2) / 4 ∧
    cos (π / 4) * cos (π / 6) + sin (π / 4) * sin (π / 6) ≠ cos (5 * π / 12) := by
  have h2 := koren2; have h6 := koren6
  have e : cos (5 * π / 12) = (√6 - √2) / 4 := by rw [← sin15.2]; congr 1; ring
  have e2 : cos (π / 4) * cos (π / 6) + sin (π / 4) * sin (π / 6) = (√6 + √2) / 4 := by
    rw [← kosinus_razlike, ← primer1.1]; congr 1; ring
  refine ⟨e, by linarith, by linarith, by rw [e, cos_pi_div_three]; linarith, e2, ?_⟩
  rw [e, e2]; intro h; linarith [Real.sqrt_pos.mpr (show (0:ℝ) < 2 by norm_num)]

/-- Naloga 2: ostra α, β s cos α = 7/25 in tan β = 4/3. a) sin²α = 1 − 49/625 = 576/625, sin α = 24/25;
sin β = 4/3·cos β, 25/9·cos²β = 1, cos²β = 9/25, cos β = 3/5, sin β = 4/5. b) sin(α + β) = (72 + 28)/125 = 4/5,
cos(α + β) = (21 − 96)/125 = −3/5. c) α + β je top (90° < α + β < 180°). d) sin 2β = 24/25,
cos 2β = 9/25 − 16/25 = −7/25, cos(α + 2β) = −(49 + 576)/625 = −1 in α + 2β = 180°.
trditev: MAT-SS-3/adicijski-izreki#matura2
besedilo: »Odgovor: a) $\sin\alpha = \frac{24}{25}$, $\sin\beta = \frac45$, $\cos\beta = \frac35$; b) $\sin(\alpha + \beta) = \frac45$, $\cos(\alpha + \beta) = -\frac35$; c) kot $\alpha + \beta$ je top; d) $\sin 2\beta = \frac{24}{25}$, $\cos 2\beta = -\frac{7}{25}$ in $\alpha + 2\beta = 180^\circ$.« -/
theorem matura2 (α β : ℝ) (ha0 : 0 < α) (ha1 : α < π / 2) (hb0 : 0 < β) (hb1 : β < π / 2)
    (hc : cos α = 7 / 25) (ht : tan β = 4 / 3) :
    sin α ^ 2 = 1 - 49 / 625 ∧ (1 : ℝ) - 49 / 625 = 576 / 625 ∧ sin α = 24 / 25 ∧
    sin β = 4 / 3 * cos β ∧ 16 / 9 * cos β ^ 2 + cos β ^ 2 = 1 ∧ 25 / 9 * cos β ^ 2 = 1 ∧
    cos β ^ 2 = 9 / 25 ∧ cos β = 3 / 5 ∧ sin β = 4 / 5 ∧
    sin (α + β) = 24 / 25 * (3 / 5) + 7 / 25 * (4 / 5) ∧
    (24 : ℝ) / 25 * (3 / 5) + 7 / 25 * (4 / 5) = (72 + 28) / 125 ∧ ((72 : ℝ) + 28) / 125 = 100 / 125 ∧
    (100 : ℝ) / 125 = 4 / 5 ∧
    cos (α + β) = 7 / 25 * (3 / 5) - 24 / 25 * (4 / 5) ∧
    (7 : ℝ) / 25 * (3 / 5) - 24 / 25 * (4 / 5) = (21 - 96) / 125 ∧ ((21 : ℝ) - 96) / 125 = -75 / 125 ∧
    (-75 : ℝ) / 125 = -3 / 5 ∧
    π / 2 < α + β ∧ α + β < π ∧
    sin (2 * β) = 2 * (4 / 5) * (3 / 5) ∧ (2 : ℝ) * (4 / 5) * (3 / 5) = 24 / 25 ∧
    cos (2 * β) = 9 / 25 - 16 / 25 ∧ (9 : ℝ) / 25 - 16 / 25 = -7 / 25 ∧
    cos (α + 2 * β) = 7 / 25 * (-7 / 25) - 24 / 25 * (24 / 25) ∧
    (7 : ℝ) / 25 * (-7 / 25) - 24 / 25 * (24 / 25) = -(49 + 576) / 625 ∧ -((49 : ℝ) + 576) / 625 = -1 ∧
    0 < α + 2 * β ∧ α + 2 * β < 3 * π / 2 ∧ α + 2 * β = π := by
  have hp := pi_pos
  have hsa2 : sin α ^ 2 = 1 - 49 / 625 := by have := sin_sq_add_cos_sq α; rw [hc] at this; linarith
  have hsa : sin α = 24 / 25 := by
    have : 0 < sin α := sin_pos_of_pos_of_lt_pi ha0 (by linarith)
    nlinarith
  have hcb : 0 < cos β := cos_pos_of_mem_Ioo ⟨by linarith, hb1⟩
  have hsb : sin β = 4 / 3 * cos β := by
    rw [tan_eq_sin_div_cos, div_eq_iff hcb.ne'] at ht; exact ht
  have p1 : 16 / 9 * cos β ^ 2 + cos β ^ 2 = 1 := by
    have := sin_sq_add_cos_sq β; rw [hsb] at this; linarith
  have hcb2 : cos β ^ 2 = 9 / 25 := by linarith
  have hcb' : cos β = 3 / 5 := by nlinarith
  have hsb' : sin β = 4 / 5 := by rw [hsb, hcb']; norm_num
  have hs1 : sin (α + β) = 24 / 25 * (3 / 5) + 7 / 25 * (4 / 5) := by rw [sin_add, hsa, hc, hsb', hcb']
  have hc1 : cos (α + β) = 7 / 25 * (3 / 5) - 24 / 25 * (4 / 5) := by rw [cos_add, hsa, hc, hsb', hcb']
  have hs2 : sin (2 * β) = 2 * (4 / 5) * (3 / 5) := by rw [sinus_dvojnega, hsb', hcb']
  have hc2 : cos (2 * β) = 9 / 25 - 16 / 25 := by rw [(kosinus_dvojnega β).1, hsb', hcb']; norm_num
  have hc3 : cos (α + 2 * β) = 7 / 25 * (-7 / 25) - 24 / 25 * (24 / 25) := by
    rw [cos_add, hc, hsa, hc2, hs2]; norm_num
  have tup : π / 2 < α + β := by
    by_contra h; push Not at h
    have := cos_nonneg_of_neg_pi_div_two_le_of_le (x := α + β) (by linarith) h
    rw [hc1] at this; norm_num at this
  have e : α + 2 * β = π := by
    have hm : cos (α + 2 * β) = -1 := by rw [hc3]; norm_num
    obtain ⟨k, hk⟩ := cos_eq_neg_one_iff.mp hm
    have k1 : (k : ℝ) < 1 / 2 := by nlinarith
    have k2 : (-1 / 2 : ℝ) < k := by nlinarith
    have : k = 0 := by
      have a : k < 1 := by exact_mod_cast (show (k : ℝ) < 1 by linarith)
      have b : -1 < k := by exact_mod_cast (show (-1 : ℝ) < k by linarith)
      omega
    rw [← hk, this]; simp
  exact ⟨hsa2, by norm_num, hsa, hsb, p1, by linarith, hcb2, hcb', hsb', hs1, by norm_num, by norm_num,
    by norm_num, hc1, by norm_num, by norm_num, by norm_num, tup, by linarith, hs2, by norm_num, hc2,
    by norm_num, hc3, by norm_num, by norm_num, by linarith, by linarith, e⟩

/-- Pogoji izreka `matura2` se dajo izpolniti: α = arccos(7/25), β = arctan(4/3) (to sta kota iz bloka
RACUN; zato velja tudi (arccos(7/25) + 2 arctan(4/3))·180/π = 180). -/
example : 0 < arccos (7 / 25 : ℝ) ∧ arccos (7 / 25 : ℝ) < π / 2 ∧ 0 < arctan (4 / 3 : ℝ) ∧
    arctan (4 / 3 : ℝ) < π / 2 ∧ cos (arccos (7 / 25 : ℝ)) = 7 / 25 ∧ tan (arctan (4 / 3 : ℝ)) = 4 / 3 :=
  ⟨arccos_pos.mpr (by norm_num), arccos_lt_pi_div_two.mpr (by norm_num), arctan_pos.mpr (by norm_num),
    arctan_lt_pi_div_two _, cos_arccos (by norm_num) (by norm_num), tan_arctan _⟩

/-- Predpostavke trditve `matura2` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : 0 < arccos (7 / 25 : ℝ) ∧ arccos (7 / 25 : ℝ) < π / 2 ∧ 0 < arctan (4 / 3 : ℝ) ∧ arctan (4 / 3 : ℝ) < π / 2 ∧ cos (arccos (7 / 25 : ℝ)) = 7 / 25 ∧ tan (arctan (4 / 3 : ℝ)) = 4 / 3 :=
    ⟨arccos_pos.mpr (by norm_num), arccos_lt_pi_div_two.mpr (by norm_num), arctan_pos.mpr (by norm_num),
      arctan_lt_pi_div_two _, cos_arccos (by norm_num) (by norm_num), tan_arctan _⟩
  matura2 (ha0 := w.1) (ha1 := w.2.1) (hb0 := w.2.2.1) (hb1 := w.2.2.2.1) (hc := w.2.2.2.2.1) (ht := w.2.2.2.2.2)

/-- Blok RACUN k Nalogi 2: sin(arccos(7/25)) = 24/25, cos(arctan(4/3)) = 3/5, sin(arctan(4/3)) = 4/5,
sin(arccos(7/25) + arctan(4/3)) = 4/5, cos(…) = −3/5, sin(2 arctan(4/3)) = 24/25, cos(2 arctan(4/3)) = −7/25
in (arccos(7/25) + 2 arctan(4/3))·180/π = 180.
trditev: MAT-SS-3/adicijski-izreki#racun-matura2
besedilo: »Odgovor: a) $\sin\alpha = \frac{24}{25}$, $\sin\beta = \frac45$, $\cos\beta = \frac35$; b) $\sin(\alpha + \beta) = \frac45$, $\cos(\alpha + \beta) = -\frac35$; c) kot $\alpha + \beta$ je top; d) $\sin 2\beta = \frac{24}{25}$, $\cos 2\beta = -\frac{7}{25}$ in $\alpha + 2\beta = 180^\circ$.« -/
theorem racun_matura2 :
    sin (arccos (7 / 25 : ℝ)) = 24 / 25 ∧ cos (arctan (4 / 3 : ℝ)) = 3 / 5 ∧
    sin (arctan (4 / 3 : ℝ)) = 4 / 5 ∧ sin (arccos (7 / 25) + arctan (4 / 3 : ℝ)) = 4 / 5 ∧
    cos (arccos (7 / 25) + arctan (4 / 3 : ℝ)) = -3 / 5 ∧ sin (2 * arctan (4 / 3 : ℝ)) = 24 / 25 ∧
    cos (2 * arctan (4 / 3 : ℝ)) = -7 / 25 ∧ (arccos (7 / 25) + 2 * arctan (4 / 3 : ℝ)) * 180 / π = 180 := by
  have h := matura2 (arccos (7 / 25)) (arctan (4 / 3)) (arccos_pos.mpr (by norm_num))
    (arccos_lt_pi_div_two.mpr (by norm_num)) (arctan_pos.mpr (by norm_num)) (arctan_lt_pi_div_two _)
    (cos_arccos (by norm_num) (by norm_num)) (tan_arctan _)
  obtain ⟨-, -, a, -, -, -, -, b, c, d, -, -, -, e, -, -, -, -, -, f, -, g, -, -, -, -, -, -, k⟩ := h
  refine ⟨a, b, c, by rw [d]; norm_num, by rw [e]; norm_num, by rw [f]; norm_num, by rw [g]; norm_num, ?_⟩
  rw [k]; field_simp [pi_pos.ne']

/-- Naloga 3 a): E(α) = sin 3α − sin α = 2 cos((3α + α)/2) sin((3α − α)/2) = 2 cos 2α sin α.
trditev: MAT-SS-3/adicijski-izreki#matura3a
besedilo: »$\sin 3\alpha - \sin\alpha = 2\cos\frac{3\alpha + \alpha}{2}\sin\frac{3\alpha - \alpha}{2}$. 2. a) Torej je $E(\alpha) = 2\cos 2\alpha\sin\alpha$.« -/
theorem matura3a (α : ℝ) : sin (3 * α) - sin α = 2 * cos (2 * α) * sin α := by
  calc sin (3 * α) - sin α = 2 * cos ((3 * α + α) / 2) * sin ((3 * α - α) / 2) := sin_minus_sin _ _
    _ = 2 * cos (2 * α) * sin α := by
        rw [show (3 * α + α) / 2 = 2 * α by ring, show (3 * α - α) / 2 = α by ring]

/-- Naloga 3 b): za α ∈ [0°, 180°] je E(α) = 0 natanko pri α ∈ {0°, 45°, 135°, 180°} (sin α = 0 ali
cos 2α = 0); to pokrije tudi vrstici RACUN sin(3·45°) − sin 45° = 0 in sin(3·135°) − sin 135° = 0.
trditev: MAT-SS-3/adicijski-izreki#matura3b
besedilo: »Produkt je enak $0$, kadar je $\sin\alpha = 0$ ali $\cos 2\alpha = 0$. 4. b) Na intervalu $[0^\circ, 180^\circ]$ je $\sin\alpha = 0$ pri $\alpha = 0^\circ$ in $\alpha = 180^\circ$. 5. b) Za $\alpha \in [0^\circ, 180^\circ]$ je $2\alpha \in [0^\circ, 360^\circ]$. Kosinus je tam enak $0$ pri $2\alpha = 90^\circ$ in $2\alpha = 270^\circ$, torej pri $\alpha = 45^\circ$ in $\alpha = 135^\circ$.« -/
theorem matura3b (α : ℝ) (h0 : 0 ≤ α) (h1 : α ≤ π) :
    sin (3 * α) - sin α = 0 ↔ α = 0 ∨ α = π / 4 ∨ α = 3 * π / 4 ∨ α = π := by
  have hp := pi_pos
  rw [matura3a]
  constructor
  · intro h
    have h' : cos (2 * α) = 0 ∨ sin α = 0 := by
      rcases mul_eq_zero.mp h with h2 | h2
      · left; simpa using h2
      · right; exact h2
    rcases h' with hc | hs
    · obtain ⟨k, hk⟩ := cos_eq_zero_iff.mp hc
      have a : (-1 : ℝ) < k := by
        by_contra hc'; push Not at hc'
        have : (2 * (k : ℝ) + 1) * π ≤ -π := by nlinarith
        linarith
      have b : (k : ℝ) < 2 := by
        by_contra hc'; push Not at hc'
        have : 5 * π ≤ (2 * (k : ℝ) + 1) * π := by nlinarith
        linarith
      have a' : -1 < k := by exact_mod_cast a
      have b' : k < 2 := by exact_mod_cast b
      have : k = 0 ∨ k = 1 := by omega
      rcases this with rfl | rfl
      · right; left; push_cast at hk; linarith
      · right; right; left; push_cast at hk; linarith
    · obtain ⟨n, hn⟩ := sin_eq_zero_iff.mp hs
      have a : (-1 : ℝ) < n := by
        by_contra hc'; push Not at hc'
        have : (n : ℝ) * π ≤ -π := by nlinarith
        linarith
      have b : (n : ℝ) < 2 := by
        by_contra hc'; push Not at hc'
        have : 2 * π ≤ (n : ℝ) * π := by nlinarith
        linarith
      have a' : -1 < n := by exact_mod_cast a
      have b' : n < 2 := by exact_mod_cast b
      have : n = 0 ∨ n = 1 := by omega
      rcases this with rfl | rfl
      · left; simp at hn; linarith
      · right; right; right; simp at hn; linarith
  · rintro (rfl | rfl | rfl | rfl)
    · simp
    · rw [show 2 * (π / 4) = π / 2 by ring, cos_pi_div_two]; ring
    · rw [cos_eq_zero_iff.mpr ⟨1, by push_cast; ring⟩]; ring
    · simp

/-- Predpostavki trditve `matura3b` se dajo izpolniti (α = 0). -/
example : (0:ℝ) ≤ 0 ∧ (0:ℝ) ≤ π := ⟨le_rfl, pi_pos.le⟩

/-- Predpostavke trditve `matura3b` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 0 ∧ (0:ℝ) ≤ π := ⟨le_rfl, pi_pos.le⟩
  matura3b (h0 := w.1) (h1 := w.2)

/-- Naloga 3 c): sin²22,5° = (1 − cos 45°)/2 = (1 − √2/2)/2 = (2 − √2)/4, sin 22,5° = √(2 − √2)/2 (prvi
kvadrant), E(22,5°) = 2 cos 45° sin 22,5° = 2·√2/2·√(2 − √2)/2 = √(2(2 − √2))/2 = √(4 − 2√2)/2.
trditev: MAT-SS-3/adicijski-izreki#matura3c
besedilo: »Ker je $22{,}5^\circ = \frac{45^\circ}{2}$, velja $\sin^2 22{,}5^\circ = \dfrac{1 - \cos 45^\circ}{2} = \dfrac{1 - \frac{\sqrt2}{2}}{2} = \dfrac{2 - \sqrt2}{4}$. 7. c) Kot $22{,}5^\circ$ leži v I. kvadrantu, zato je sinus pozitiven: $\sin 22{,}5^\circ = \dfrac{\sqrt{2 - \sqrt2}}{2}$. 8. c) Iz zapisa v a): $E(22{,}5^\circ) = 2\cos 45^\circ \sin 22{,}5^\circ = 2 \cdot \dfrac{\sqrt2}{2} \cdot \dfrac{\sqrt{2 - \sqrt2}}{2} = \dfrac{\sqrt{2(2 - \sqrt2)}}{2} = \dfrac{\sqrt{4 - 2\sqrt2}}{2}$.« -/
theorem matura3c : sin (π / 8) ^ 2 = (1 - cos (π / 4)) / 2 ∧ (1 - cos (π / 4)) / 2 = (1 - √2 / 2) / 2 ∧
    (1 - √2 / 2) / 2 = (2 - √2) / 4 ∧ sin (π / 8) = √(2 - √2) / 2 ∧
    sin (3 * (π / 8)) - sin (π / 8) = 2 * cos (π / 4) * sin (π / 8) ∧
    2 * cos (π / 4) * sin (π / 8) = 2 * (√2 / 2) * (√(2 - √2) / 2) ∧
    2 * (√2 / 2) * (√(2 - √2) / 2) = √(2 * (2 - √2)) / 2 ∧ √(2 * (2 - √2)) / 2 = √(4 - 2 * √2) / 2 := by
  have h2 := koren2
  have hp := pi_pos
  have hq : sin (π / 8) ^ 2 = (1 - cos (π / 4)) / 2 := by
    have := (polovicni (π / 4)).2.2.1; rwa [show π / 4 / 2 = π / 8 by ring] at this
  have hpos : 0 < sin (π / 8) := sin_pos_of_pos_of_lt_pi (by positivity) (by linarith)
  have hv : sin (π / 8) = √(2 - √2) / 2 := by
    have e : sin (π / 8) ^ 2 = (2 - √2) / 4 := by rw [hq, cos_pi_div_four]; ring
    calc sin (π / 8) = √(sin (π / 8) ^ 2) := (Real.sqrt_sq hpos.le).symm
      _ = √((2 - √2) / 4) := by rw [e]
      _ = √(2 - √2) / 2 := by
          rw [Real.sqrt_div (by linarith), show (4 : ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have he : sin (3 * (π / 8)) - sin (π / 8) = 2 * cos (π / 4) * sin (π / 8) := by
    rw [matura3a, show 2 * (π / 8) = π / 4 by ring]
  refine ⟨hq, by rw [cos_pi_div_four], by ring, hv, he, by rw [cos_pi_div_four, hv], ?_, ?_⟩
  · rw [Real.sqrt_mul (by norm_num)]; ring
  · congr 2; ring

/-- Naloga 3 d): E(α) = 2 sin α (1 − 2 sin²α) = 2 sin α − 4 sin³α za vsak kot α.
trditev: MAT-SS-3/adicijski-izreki#matura3d
besedilo: »$E(\alpha) = 2\sin\alpha\,(1 - 2\sin^2\alpha) = 2\sin\alpha - 4\sin^3\alpha$« -/
theorem matura3d (α : ℝ) : sin (3 * α) - sin α = 2 * sin α * (1 - 2 * sin α ^ 2) ∧
    2 * sin α * (1 - 2 * sin α ^ 2) = 2 * sin α - 4 * sin α ^ 3 := by
  refine ⟨?_, by ring⟩
  rw [matura3a, (kosinus_dvojnega α).1, (kosinus_dvojnega α).2.1]; ring

/-! ## Drugače -/

/-- Drugače, korak za korakom: sin 105° = sin(60° + 45°) = √3/2·√2/2 + 1/2·√2/2 = (√6 + √2)/4 ≈ 0,966, kar je
enako sin 75° (sin(180° − x) = sin x).
trditev: MAT-SS-3/adicijski-izreki#drugace-105
besedilo: »Vstavi: $\frac{\sqrt{3}}{2} \cdot \frac{\sqrt{2}}{2} + \frac{1}{2} \cdot \frac{\sqrt{2}}{2} = \frac{\sqrt{6} + \sqrt{2}}{4}$. 5. Preveri smiselnost: $\frac{\sqrt{6} + \sqrt{2}}{4} \approx 0{,}966$. To je enako kot $\sin 75^\circ$, kar se ujema, saj je $\sin(180^\circ - x) = \sin x$.« -/
theorem drugace_105 : sin (7 * π / 12) = (√6 + √2) / 4 ∧ sin (7 * π / 12) = sin (π - 7 * π / 12) ∧
    π - 7 * π / 12 = 5 * π / 12 := by
  refine ⟨?_, (sin_pi_sub _).symm, by ring⟩
  calc sin (7 * π / 12) = sin (π / 3 + π / 4) := by congr 1; ring
    _ = sin (π / 3) * cos (π / 4) + cos (π / 3) * sin (π / 4) := sin_add _ _
    _ = √3 / 2 * (√2 / 2) + 1 / 2 * (√2 / 2) := by
        rw [sin_pi_div_three, cos_pi_div_four, cos_pi_div_three, sin_pi_div_four]
    _ = (√6 + √2) / 4 := by rw [← koren2_3]; ring

/-- Drugače, korak za korakom: tri oblike cos 2α pri α = 30°: 0,75 − 0,25 = 0,5; 1 − 0,5 = 0,5;
1,5 − 1 = 0,5; res je cos 60° = 0,5.
trditev: MAT-SS-3/adicijski-izreki#drugace-trije
besedilo: »$\cos^2 30^\circ - \sin^2 30^\circ = 0{,}75 - 0{,}25 = 0{,}5$ - $1 - 2\sin^2 30^\circ = 1 - 0{,}5 = 0{,}5$ - $2\cos^2 30^\circ - 1 = 1{,}5 - 1 = 0{,}5$« -/
theorem drugace_trije :
    cos (π / 6) ^ 2 - sin (π / 6) ^ 2 = 0.75 - 0.25 ∧ (0.75 : ℝ) - 0.25 = 0.5 ∧
    1 - 2 * sin (π / 6) ^ 2 = 1 - 0.5 ∧ (1 : ℝ) - 0.5 = 0.5 ∧
    2 * cos (π / 6) ^ 2 - 1 = 1.5 - 1 ∧ (1.5 : ℝ) - 1 = 0.5 ∧ cos (2 * (π / 6)) = 0.5 := by
  have hc : cos (π / 6) ^ 2 = 0.75 := by rw [cos_pi_div_six, div_pow, kv3]; norm_num
  have hs : sin (π / 6) ^ 2 = 0.25 := by rw [sin_pi_div_six]; norm_num
  refine ⟨by rw [hc, hs], by norm_num, by rw [hs]; norm_num, by norm_num, by rw [hc]; norm_num, by norm_num,
    ?_⟩
  rw [show 2 * (π / 6) = π / 3 by ring, cos_pi_div_three]; norm_num

/-- Drugače, kot zgodba: Lukova »višina« sin 60° + sin 60° = √3 ≈ 1,73 je večja od 1 (jagoda bi zletela s
torte); pravilno sin 60° cos 60° + cos 60° sin 60° = 2·√3/2·1/2 = √3/2 ≈ 0,866 = sin 120°.
trditev: MAT-SS-3/adicijski-izreki#zgodba
besedilo: »Luka preveri z $\alpha = \beta = 60^\circ$: $2 \cdot \frac{\sqrt{3}}{2} \cdot \frac{1}{2} \approx 0{,}866 = \sin 120^\circ$. Jagoda ostane na torti.« -/
theorem zgodba : sin (π / 3) + sin (π / 3) = √3 ∧ (1.725 : ℝ) < √3 ∧ √3 < 1.735 ∧ 1 < √3 ∧
    sin (π / 3) * cos (π / 3) + cos (π / 3) * sin (π / 3) = 2 * (√3 / 2) * (1 / 2) ∧
    2 * (√3 / 2) * (1 / 2) = sin (2 * π / 3) ∧ (0.8655 : ℝ) < √3 / 2 ∧ √3 / 2 < 0.8665 := by
  have h3 := koren3
  have e : sin (2 * π / 3) = √3 / 2 := by
    rw [show 2 * π / 3 = π - π / 3 by ring, sin_pi_sub, sin_pi_div_three]
  refine ⟨by rw [sin_pi_div_three]; ring, by linarith, by linarith, by linarith,
    by rw [sin_pi_div_three, cos_pi_div_three]; ring, by rw [e]; ring, by linarith, by linarith⟩

/-! ## Preveri se -/

/-- Preveri se 1: za vse kote velja le cos(α + β) = cos α cos β − sin α sin β; enakosti
sin(α + β) = sin α + sin β, cos(α − β) = cos α cos β − sin α sin β (protiprimer α = β = 90°: cos 0° = 1) in
sin 2α = 2 sin α ne veljajo za vse kote.
trditev: MAT-SS-3/adicijski-izreki#preveri1
besedilo: »$\cos(\alpha + \beta) = \cos\alpha\cos\beta - \sin\alpha\sin\beta$« -/
theorem preveri1 : (∀ α β : ℝ, cos (α + β) = cos α * cos β - sin α * sin β) ∧
    ¬ (∀ α β : ℝ, sin (α + β) = sin α + sin β) ∧
    ¬ (∀ α β : ℝ, cos (α - β) = cos α * cos β - sin α * sin β) ∧
    ¬ (∀ α : ℝ, sin (2 * α) = 2 * sin α) := by
  refine ⟨kosinus_vsote, fun h => pogoste_napake.1 (h _ _), fun h => ?_, fun h => pogoste_napake.2.1 (h _)⟩
  have := h (π / 2) (π / 2)
  rw [sub_self, cos_zero, cos_pi_div_two, sin_pi_div_two] at this; norm_num at this

/-- Preveri se 2: iz sin α = 0,6 in cos α = 0,8 sledi sin 2α = 2·0,6·0,8 = 0,96; napačni odgovori so
2 sin α = 1,2, sin α cos α = 0,48 in cos 2α = 0,64 − 0,36 = 0,28.
trditev: MAT-SS-3/adicijski-izreki#preveri2
besedilo: »$\sin 2\alpha = 2 \cdot 0{,}6 \cdot 0{,}8 = 0{,}96$« -/
theorem preveri2 (α : ℝ) (hs : sin α = 0.6) (hc : cos α = 0.8) :
    sin (2 * α) = 2 * 0.6 * 0.8 ∧ (2 : ℝ) * 0.6 * 0.8 = 0.96 ∧ 2 * sin α = 1.2 ∧ sin α * cos α = 0.48 ∧
    cos (2 * α) = 0.64 - 0.36 ∧ (0.64 : ℝ) - 0.36 = 0.28 := by
  refine ⟨by rw [sinus_dvojnega, hs, hc], by norm_num, by rw [hs]; norm_num, by rw [hs, hc]; norm_num,
    by rw [(kosinus_dvojnega α).1, hs, hc]; norm_num, by norm_num⟩

/-- Pogoja izreka `preveri2` se dajo izpolniti: α = arcsin 0,6 (glej tudi primer `primer3`). -/
example : sin (arcsin (0.6 : ℝ)) = 0.6 ∧ cos (arcsin (0.6 : ℝ)) = 0.8 := by
  rw [cos_arcsin, sin_arcsin (by norm_num) (by norm_num),
    show (1 - 0.6 ^ 2 : ℝ) = 0.8 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  norm_num

/-- Predpostavke trditve `preveri2` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : sin (arcsin (0.6 : ℝ)) = 0.6 ∧ cos (arcsin (0.6 : ℝ)) = 0.8 := by
    rw [cos_arcsin, sin_arcsin (by norm_num) (by norm_num),
      show (1 - 0.6 ^ 2 : ℝ) = 0.8 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
    norm_num
  preveri2 (hs := w.1) (hc := w.2)

/-- Preveri se 5: točka (10; 0) se zavrti za 45° in 30°, zato je y = 10 sin 75° = 10·(√6 + √2)/4 ≈ 9,66 cm;
napačna odgovora: 10(sin 45° + sin 30°) ≈ 12,07 > 10 (več od razdalje od središča) in
10 sin 15° ≈ 2,59.
trditev: MAT-SS-3/adicijski-izreki#preveri5
besedilo: »Skupni zasuk je $75^\circ$, zato $y = 10\,\text{cm} \cdot \sin 75^\circ = 10\,\text{cm} \cdot \dfrac{\sqrt{6} + \sqrt{2}}{4} \approx 9{,}66\,\text{cm}$.« -/
theorem preveri5 : 10 * sin (0 + π / 4 + π / 6) = 10 * ((√6 + √2) / 4) ∧
    (9.655 : ℝ) < 10 * ((√6 + √2) / 4) ∧ 10 * ((√6 + √2) / 4) < 9.665 ∧
    (12.065 : ℝ) < 10 * (sin (π / 4) + sin (π / 6)) ∧ 10 * (sin (π / 4) + sin (π / 6)) < 12.075 ∧
    (10 : ℝ) < 10 * (sin (π / 4) + sin (π / 6)) ∧
    (2.585 : ℝ) < 10 * sin (π / 12) ∧ 10 * sin (π / 12) < 2.595 := by
  have h2 := koren2; have h6 := koren6
  rw [zero_add, tabela_vsota.2.2.2, sin_pi_div_four, sin_pi_div_six, sin15.1]
  refine ⟨rfl, by linarith, by linarith, by linarith, by linarith, by linarith, by linarith, by linarith⟩

end Evklid.Lekcije.MAT_SS_3.AdicijskiIzreki
