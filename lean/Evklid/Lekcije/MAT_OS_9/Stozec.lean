/-
vir: content/lessons/MAT-OS-9/stozec.md
sha256: a2f47b89f4a930654cd949c6344303fb08b1504fbce80253644b304f8dd334d4
Ni v Leanu: risba in simulacija kot sliki; stožec kot telo v prostoru ni formaliziran: imena delov (osnovna
ploskev, vrh, plašč, višina, stranica), »plašč razgrnemo v krožni izsek«, vrtenina (pravokotni ali
enakokraki trikotnik zavrtimo okoli katete/višine), osni presek in Preveri se 1 (druga kateta postane polmer)
so opisni; obrazci so dokazani kot algebra s pomenom iz lekcije: s² = r² + v² (pravokotni trikotnik) ⇒
s = √(r² + v²), izsek je r/s celega kroga ⇒ (r/s)·πs² = πrs, lok (α/360°)·2πs = 2πr ⇔ α = (r/s)·360°.
Prostornina kot mera telesa ni formalizirana in »poskus z vodo« ni dokaz; »tretjina« je dokazana z
integralom prerezov: ∫₀^v π(rt/v)² dt = πr²v/3 (krog s polmerom rt/v na višini t; to ni dokaz lekcije s
piramidami, ki ga lekcija sama označi kot nestrogega). »Pri zelo ploščatem stožcu je izsek skoraj cel krog«
je dokazano kot: manjša višina ⇒ manjša stranica ⇒ večji r/s, in r/s < 1 pri v > 0 (limita ni
formalizirana). Analogija s pahljačo in »papir se ne raztegne« kot model; »zelo veliko ozkih trikotnikov« je
dokazano le kot račun 2πr·s/2 = πrs. Približki (≈) so dokazani kot |točna − približek| < pol enote zadnjega
mesta (s π iz `Real.pi_gt_d6`, `Real.pi_lt_d6`). Decimalna števila so točna racionalna števila v ℝ. Lean
deli z 0 kot x/0 = 0, zato imajo obrazci z r/s pogoj s ≠ 0 (pri stožcu s > 0).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_9.Stozec

open Real

/-- Pomožno: √(a²) = a za a ≥ 0 (za korake »√625 = 25«).
pomozno – orodje: √(a²) = a za a ≥ 0 -/
theorem koren_kvadrata (a : ℝ) (ha : 0 ≤ a) : √(a ^ 2) = a := Real.sqrt_sq ha

/-- Predpostavka `koren_kvadrata` se da izpolniti (a = 25). -/
example : (0:ℝ) ≤ 25 := by norm_num

/-! ## Razlaga 1 in 2: deli in stranica -/

/-- Razlaga 1: premer odprtine 14 cm ⇒ polmer r = 14/2 = 7 cm.
trditev: MAT-OS-9/stozec#polmer-megafona
besedilo: »njen polmer je $r = 7\,\text{cm}$« -/
theorem polmer_megafona : (14:ℝ) / 2 = 7 := by norm_num

/-- Razlaga 2 in Povzetek: iz s² = r² + v² in s ≥ 0 sledi s = √(r² + v²) (edina nenegativna rešitev).
trditev: MAT-OS-9/stozec#stranica
besedilo: »$s^2 = r^2 + v^2$, zato $s = \sqrt{r^2 + v^2}$.« -/
theorem stranica (r v s : ℝ) (hs : 0 ≤ s) : s ^ 2 = r ^ 2 + v ^ 2 ↔ s = √(r ^ 2 + v ^ 2) := by
  constructor
  · intro h
    rw [← h, Real.sqrt_sq hs]
  · intro h
    rw [h, Real.sq_sqrt (by positivity)]

/-- Predpostavka `stranica` se da izpolniti (s = 25). -/
example : (0:ℝ) ≤ 25 := by norm_num

/-- Razlaga 2: s = √(7² + 24²) = √625 = 25 cm.
trditev: MAT-OS-9/stozec#stranica-megafona
besedilo: »Pitagorov izrek da $s = \sqrt{7^2 + 24^2} = \sqrt{625} = 25\,\text{cm}$.« -/
theorem stranica_megafona : √((7:ℝ) ^ 2 + 24 ^ 2) = 25 := by
  calc √((7:ℝ) ^ 2 + 24 ^ 2) = √625 := by norm_num
    _ = 25 := by rw [show (625:ℝ) = 25 ^ 2 by norm_num]; exact koren_kvadrata 25 (by norm_num)

/-- Pogoste napake 3: pri r, v > 0 je s = √(r² + v²) < r + v (stranic ne seštevamo).
trditev: MAT-OS-9/stozec#stranica-manj-od-vsote
besedilo: »zato velja $s = \sqrt{r^2 + v^2}$, kar je manj kot $r + v$« -/
theorem stranica_manj_od_vsote (r v : ℝ) (hr : 0 < r) (hv : 0 < v) : √(r ^ 2 + v ^ 2) < r + v := by
  rw [Real.sqrt_lt' (by linarith)]
  nlinarith

/-- Predpostavki `stranica_manj_od_vsote` se dasta izpolniti (r = 7, v = 24). -/
example : (0:ℝ) < 7 ∧ (0:ℝ) < 24 := by norm_num

/-- Pogoste napake 3: kateto dobimo z odštevanjem: pri s² = r² + v² in v ≥ 0 je v = √(s² − r²).
trditev: MAT-OS-9/stozec#kateta
besedilo: »Ko iščeš kateto ($v$ ali $r$), pod korenom odštevaš.« -/
theorem kateta (r v s : ℝ) (hv : 0 ≤ v) (h : s ^ 2 = r ^ 2 + v ^ 2) : v = √(s ^ 2 - r ^ 2) := by
  rw [h, show r ^ 2 + v ^ 2 - r ^ 2 = v ^ 2 by ring, Real.sqrt_sq hv]

/-- Predpostavke `kateta` se dajo izpolniti (r = 6, v = 8, s = 10). -/
example : (0:ℝ) ≤ 8 ∧ (10:ℝ) ^ 2 = 6 ^ 2 + 8 ^ 2 := by norm_num

/-! ## Razlaga 3: plašč -/

/-- Razlaga 3: lok 2π·7 = 14π, obseg kroga 2π·25 = 50π, ploščina π·25² = 625π, delež 14π/50π = 14/50 =
7/25, ploščina izseka 7/25·625π = 175π, kot 7/25·360° = 100,8°.
trditev: MAT-OS-9/stozec#megafon-plasc
besedilo: »Cel krog s polmerom $25\,\text{cm}$ ima obseg $50\pi\,\text{cm}$ in ploščino $625\pi\,\text{cm}^2$. Izsek ima lok $14\pi$ od $50\pi$, torej je $\frac{14}{50} = \frac{7}{25}$ celega kroga.« -/
theorem megafon_plasc :
    2 * π * 7 = 14 * π ∧ 2 * π * 25 = 50 * π ∧ π * 25 ^ 2 = 625 * π ∧ (14 * π) / (50 * π) = 14 / 50 ∧
      (14:ℝ) / 50 = 7 / 25 ∧ 7 / 25 * (625 * π) = 175 * π ∧ (7:ℝ) / 25 * 360 = 100.8 := by
  have hp : π ≠ 0 := Real.pi_ne_zero
  refine ⟨by ring, by ring, by ring, ?_, by norm_num, by ring, by norm_num⟩
  rw [mul_div_mul_right _ _ hp]

/-- Razlaga 3: 175π ≈ 549,78 cm² (|175π − 549,78| < 0,005).
trditev: MAT-OS-9/stozec#megafon-plasc-priblizek
besedilo: »Njegova ploščina je $\frac{7}{25} \cdot 625\pi = 175\pi \approx 549{,}78\,\text{cm}^2$.« -/
theorem megafon_plasc_priblizek : |175 * π - 549.78| < 0.005 := by
  rw [abs_lt]
  constructor <;> linarith [Real.pi_gt_d6, Real.pi_lt_d6]

/-- Razlaga 3: plašč je r/s celega kroga s polmerom s: lok 2πr je r/s obsega 2πs, in (r/s)·πs² = πrs
(pri s ≠ 0).
trditev: MAT-OS-9/stozec#plasc
besedilo: »Lok izseka je $2\pi r$, obseg celega kroga pa $2\pi s$. Izsek je zato vedno $\frac{r}{s}$ celega kroga s polmerom $s$. Ploščina plašča je zato $\frac{r}{s} \cdot \pi s^2$, kar se okrajša v $$\mathrm{pl} = \pi r s$$« -/
theorem plasc (r s : ℝ) (hs : s ≠ 0) : r / s * (2 * π * s) = 2 * π * r ∧ r / s * (π * s ^ 2) = π * r * s := by
  constructor <;> field_simp

/-- Predpostavka `plasc` se da izpolniti (s = 25). -/
example : (25:ℝ) ≠ 0 := by norm_num

/-- Razlaga 3 in Primer 3: lok izseka (α/360)·2πs je enak obsegu osnovne ploskve 2πr natanko tedaj, ko je
α = (r/s)·360 (pri s ≠ 0).
trditev: MAT-OS-9/stozec#kot-izseka
besedilo: »Razgrnjen plašč je krožni izsek s polmerom $s$ in lokom $2\pi r$; središčni kot je $\alpha = \frac{r}{s} \cdot 360^\circ$.« -/
theorem kot_izseka (r s α : ℝ) (hs : s ≠ 0) : α / 360 * (2 * π * s) = 2 * π * r ↔ α = r / s * 360 := by
  have hp : π ≠ 0 := Real.pi_ne_zero
  constructor
  · intro h
    field_simp
    field_simp at h
    linarith
  · rintro rfl
    field_simp

/-- Predpostavka `kot_izseka` se da izpolniti (s = 10). -/
example : (10:ℝ) ≠ 0 := by norm_num

/-- Razlaga 3 in Povzetek: površina zaprtega stožca je osnovna ploskev plus plašč, πr² + πrs = πr(r + s).
pomozno – razstavljena oblika πr(r + s) v lekciji ni zapisana; lekcija ima le P = πr² + πrs (definicija) -/
theorem povrsina (r s : ℝ) : π * r ^ 2 + π * r * s = π * r * (r + s) := by ring

/-- Razlaga 3, Premisli: pri istem r > 0 manjša višina (0 ≤ v₁ < v₂) da manjšo stranico in zato večji delež
r/s (večji središčni kot).
trditev: MAT-OS-9/stozec#splosceni
besedilo: »Pri manjši višini se zmanjša stranica $s$, polmer $r$ pa ostane. Razmerje $\frac{r}{s}$ se poveča, zato se poveča tudi središčni kot.« -/
theorem splosceni (r v₁ v₂ : ℝ) (hr : 0 < r) (hv₁ : 0 ≤ v₁) (hv : v₁ < v₂) :
    √(r ^ 2 + v₁ ^ 2) < √(r ^ 2 + v₂ ^ 2) ∧ r / √(r ^ 2 + v₂ ^ 2) < r / √(r ^ 2 + v₁ ^ 2) := by
  have hlt : √(r ^ 2 + v₁ ^ 2) < √(r ^ 2 + v₂ ^ 2) :=
    Real.sqrt_lt_sqrt (by positivity) (by nlinarith)
  have hpos : 0 < √(r ^ 2 + v₁ ^ 2) := Real.sqrt_pos.mpr (by positivity)
  exact ⟨hlt, div_lt_div_of_pos_left hr hpos hlt⟩

/-- Predpostavke `splosceni` se dajo izpolniti (r = 7, v₁ = 10, v₂ = 24). -/
example : (0:ℝ) < 7 ∧ (0:ℝ) ≤ 10 ∧ (10:ℝ) < 24 := by norm_num

/-- Pogoste napake 5: pri r > 0 in v > 0 je r < s, zato r/s < 1 in (r/s)·360° < 360° (izsek manjši od
kroga), obrnjeni ulomek s/r·360° pa je > 360°.
trditev: MAT-OS-9/stozec#kot-manj-od-360
besedilo: »Učenec računa $\frac{s}{r} \cdot 360^\circ$ in dobi več kot $360^\circ$. Ker je $r < s$, je izsek vedno manjši od celega kroga: $\alpha = \frac{r}{s} \cdot 360^\circ$.« -/
theorem kot_manj_od_360 (r v : ℝ) (hr : 0 < r) (hv : 0 < v) :
    r < √(r ^ 2 + v ^ 2) ∧ r / √(r ^ 2 + v ^ 2) * 360 < 360 ∧ 360 < √(r ^ 2 + v ^ 2) / r * 360 := by
  have hs : r < √(r ^ 2 + v ^ 2) := by
    rw [Real.lt_sqrt hr.le]
    nlinarith
  have hspos : 0 < √(r ^ 2 + v ^ 2) := by linarith
  refine ⟨hs, ?_, ?_⟩
  · have : r / √(r ^ 2 + v ^ 2) < 1 := (div_lt_one hspos).mpr hs
    linarith
  · have : 1 < √(r ^ 2 + v ^ 2) / r := (one_lt_div hr).mpr hs
    linarith

/-- Predpostavki `kot_manj_od_360` se dasta izpolniti (r = 9, v = 12). -/
example : (0:ℝ) < 9 ∧ (0:ℝ) < 12 := by norm_num

/-! ## Razlaga 4: prostornina -/

/-- Razlaga 4: valj π·7²·24 = 1176π, stožec 1176π/3 = 392π.
trditev: MAT-OS-9/stozec#megafon-prostornina
besedilo: »Ta ima prostornino $\pi \cdot 7^2 \cdot 24 = 1176\pi\,\text{cm}^3$.« -/
theorem megafon_prostornina : π * 7 ^ 2 * 24 = 1176 * π ∧ 1176 * π / 3 = 392 * π := by
  constructor <;> ring

/-- Razlaga 4: 392π ≈ 1231,50 cm³ (|392π − 1231,50| < 0,005), malo več kot liter (1000 cm³ < 392π < 1300 cm³).
trditev: MAT-OS-9/stozec#megafon-prostornina-priblizek
besedilo: »Stožec ima torej tretjino prostornine valja: $1176\pi : 3 = 392\pi \approx 1231{,}50\,\text{cm}^3$, kar je malo več kot liter.« -/
theorem megafon_prostornina_priblizek : |392 * π - 1231.50| < 0.005 ∧ 1000 < 392 * π ∧ 392 * π < 1300 := by
  refine ⟨?_, by linarith [Real.pi_gt_d6], by linarith [Real.pi_lt_d6]⟩
  rw [abs_lt]
  constructor <;> linarith [Real.pi_gt_d6, Real.pi_lt_d6]

/-- Razlaga 4, Pogoste napake 2: trikrat prelit stožec napolni valj: 3·(πr²v/3) = πr²v; stožec je tretjina
valja.
pomozno – izrek je le račun 3·(πr²v/3) = πr²v; lekcija trdi geometrijsko »stožec ima tretjino valja« (to dokaže prostornina_integral) -/
theorem tretjina_valja (r v : ℝ) : 3 * (π * r ^ 2 * v / 3) = π * r ^ 2 * v := by ring

/-- Razlaga 4, Z analogijo: V = πr²v/3 je O·v/3 z O = πr² (kot pri piramidi).
trditev: MAT-OS-9/stozec#kot-piramida
besedilo: »To je ista zveza kot pri piramidi, $V = \frac{O \cdot v}{3}$, le da je osnovna ploskev krog.« -/
theorem kot_piramida (r v : ℝ) : π * r ^ 2 * v / 3 = (π * r ^ 2) * v / 3 := rfl

/-- Razlaga 4, Premisli: stožec s trikratno višino ima prostornino valja: π r²·(3v)/3 = πr²v.
trditev: MAT-OS-9/stozec#trikrat-visji
besedilo: »Enako veliko. Tretjina in trikrat večja višina se izničita: $\frac{\pi r^2 \cdot 3v}{3} = \pi r^2 v$.« -/
theorem trikrat_visji (r v : ℝ) : π * r ^ 2 * (3 * v) / 3 = π * r ^ 2 * v := by ring

/-- Bolj natančno (zakaj tretjina; drug dokaz kot v lekciji): prerez stožca na višini t od vrha je krog s
polmerom rt/v; vsota (integral) ploščin prerezov je ∫₀^v π(rt/v)² dt = πr²v/3 (pri v ≠ 0).
trditev: MAT-OS-9/stozec#prostornina
besedilo: »$$V = \frac{\pi r^2 v}{3}$$« -/
theorem prostornina_integral (r v : ℝ) (hv : v ≠ 0) :
    ∫ t in (0:ℝ)..v, π * (r * t / v) ^ 2 = π * r ^ 2 * v / 3 := by
  have h : ∀ t : ℝ, π * (r * t / v) ^ 2 = (π * r ^ 2 / v ^ 2) * t ^ 2 := fun t => by
    field_simp
  simp_rw [h]
  rw [intervalIntegral.integral_const_mul, integral_pow]
  field_simp
  ring

/-- Predpostavka `prostornina_integral` se da izpolniti (v = 24). -/
example : (24:ℝ) ≠ 0 := by norm_num

/-- Razlaga 7: 1000 cm³ = 1 l, zato 392π cm³ = 392π/1000 l > 1 l.
trditev: MAT-OS-9/stozec#enote
besedilo: »kar je malo več kot liter« -/
theorem enote : 392 * π / 1000 > 1 := by
  rw [gt_iff_lt, one_lt_div (by norm_num)]
  linarith [Real.pi_gt_d6]

/-! ## Razlaga 6 in Bolj natančno: enakostranični stožec -/

/-- Razlaga 6, Bolj natančno: pri s = 2r (r > 0) je r/s = 1/2, kot (1/2)·360° = 180° (polkrog), plašč
πr·2r = 2πr², površina πr² + 2πr² = 3πr².
trditev: MAT-OS-9/stozec#enakostranicni
besedilo: »Ker je $s = 2r$, je $\frac{r}{s} = \frac{1}{2}$ in razgrnjen plašč je polkrog ($180^\circ$). Plašč je $\pi r \cdot 2r = 2\pi r^2$, površina pa $\pi r^2 + 2\pi r^2 = 3\pi r^2$.« -/
theorem enakostranicni (r : ℝ) (hr : 0 < r) :
    r / (2 * r) = 1 / 2 ∧ (1:ℝ) / 2 * 360 = 180 ∧ π * r * (2 * r) = 2 * π * r ^ 2 ∧
      π * r ^ 2 + 2 * π * r ^ 2 = 3 * π * r ^ 2 := by
  refine ⟨by field_simp, by norm_num, by ring, by ring⟩

/-- Predpostavka `enakostranicni` se da izpolniti (r = 1). -/
example : (0:ℝ) < 1 := by norm_num

/-- Bolj natančno (ozki trikotniki): trikotnik z osnovnico 2πr in višino s ima ploščino 2πr·s/2 = πrs.
trditev: MAT-OS-9/stozec#ozki-trikotniki
besedilo: »Vsota ploščin je zato $\frac{2\pi r \cdot s}{2} = \pi r s$.« -/
theorem ozki_trikotniki (r s : ℝ) : 2 * π * r * s / 2 = π * r * s := by ring

/-! ## Rešeni primeri -/

/-- Primer 1: s = √(8² + 6²) = √100 = 10; pl = π·8·10 = 80π; α = 8/10·360° = 288°.
trditev: MAT-OS-9/stozec#primer1
besedilo: »Izrežemo izsek s polmerom $10\,\text{cm}$ in kotom $288^\circ$.« -/
theorem primer1 :
    √((8:ℝ) ^ 2 + 6 ^ 2) = 10 ∧ π * 8 * 10 = 80 * π ∧ (8:ℝ) / 10 * 360 = 288 := by
  refine ⟨?_, by ring, by norm_num⟩
  calc √((8:ℝ) ^ 2 + 6 ^ 2) = √100 := by norm_num
    _ = 10 := by rw [show (100:ℝ) = 10 ^ 2 by norm_num]; exact koren_kvadrata 10 (by norm_num)

/-- Primer 1: 80π ≈ 251,33 cm² (|80π − 251,33| < 0,005), približno 251 cm².
trditev: MAT-OS-9/stozec#primer1-priblizek
besedilo: »Odgovor: v membrani je približno $251\,\text{cm}^2$ papirja.« -/
theorem primer1_priblizek : |80 * π - 251.33| < 0.005 ∧ |80 * π - 251| < 0.5 := by
  constructor <;> rw [abs_lt] <;> constructor <;> linarith [Real.pi_gt_d6, Real.pi_lt_d6]

/-- Primer 2, korak 1: s = √(5² + 12²) = √169 = 13.
trditev: MAT-OS-9/stozec#primer2-s
besedilo: »Hipotenuza je v obeh primerih stranica: $s = \sqrt{5^2 + 12^2} = \sqrt{169} = 13\,\text{cm}$.« -/
theorem primer2_s : √((5:ℝ) ^ 2 + 12 ^ 2) = 13 := by
  calc √((5:ℝ) ^ 2 + 12 ^ 2) = √169 := by norm_num
    _ = 13 := by rw [show (169:ℝ) = 13 ^ 2 by norm_num]; exact koren_kvadrata 13 (by norm_num)

/-- Primer 2, koraki 2–5: V₁ = π·5²·12/3 = 100π, P₁ = π·5² + π·5·13 = 25π + 65π = 90π, V₂ = π·12²·5/3 =
240π, P₂ = π·12² + π·12·13 = 144π + 156π = 300π.
pomozno – vsak korak Primera 2 v lekciji nosi tudi približek (≈), ki ga izrek ne dokaže (primer2_priblizki); točnih vrednosti brez približka lekcija ne zapiše -/
theorem primer2 :
    π * 5 ^ 2 * 12 / 3 = 100 * π ∧ π * 5 ^ 2 + π * 5 * 13 = 25 * π + 65 * π ∧ 25 * π + 65 * π = 90 * π ∧
      π * 12 ^ 2 * 5 / 3 = 240 * π ∧ π * 12 ^ 2 + π * 12 * 13 = 144 * π + 156 * π ∧
      144 * π + 156 * π = 300 * π := by
  refine ⟨by ring, by ring, by ring, by ring, by ring, by ring⟩

/-- Primer 2, približki: 100π ≈ 314,16, 90π ≈ 282,74, 240π ≈ 753,98, 300π ≈ 942,48 (na 0,005); v odgovoru
≈ 314, 283, 754, 942 (na 0,5); drugi stožec je večji (240π > 100π, 300π > 90π).
trditev: MAT-OS-9/stozec#primer2-odgovor
besedilo: »prvi stožec ima $V_1 \approx 314\,\text{cm}^3$ in $P_1 \approx 283\,\text{cm}^2$, drugi $V_2 \approx 754\,\text{cm}^3$ in $P_2 \approx 942\,\text{cm}^2$. Drugi je večji« -/
theorem primer2_priblizki :
    |100 * π - 314.16| < 0.005 ∧ |90 * π - 282.74| < 0.005 ∧ |240 * π - 753.98| < 0.005 ∧
      |300 * π - 942.48| < 0.005 ∧ |100 * π - 314| < 0.5 ∧ |90 * π - 283| < 0.5 ∧ |240 * π - 754| < 0.5 ∧
      |300 * π - 942| < 0.5 ∧ 100 * π < 240 * π ∧ 90 * π < 300 * π := by
  have h1 := Real.pi_gt_d6
  have h2 := Real.pi_lt_d6
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, by linarith, by linarith⟩ <;> rw [abs_lt] <;> constructor <;>
    linarith

/-- Primer 3, koraki 1–3: l = 216/360·2π·10 = 12π; 2πr = 12π ⇔ r = 6.
trditev: MAT-OS-9/stozec#primer3-lok
besedilo: »Lok izseka: $l = \dfrac{216}{360} \cdot 2\pi \cdot 10 = 12\pi\,\text{cm}$. 3. Lok se ovije okoli osnovne ploskve, zato je $2\pi r = 12\pi$ in $r = 6\,\text{cm}$.« -/
theorem primer3_lok (r : ℝ) : 216 / 360 * (2 * π * 10) = 12 * π ∧ (2 * π * r = 12 * π ↔ r = 6) := by
  have hp : 0 < π := Real.pi_pos
  refine ⟨by ring, ⟨fun h => ?_, fun h => by rw [h]; ring⟩⟩
  have : π * (2 * r - 12) = 0 := by linarith
  rcases mul_eq_zero.mp this with h' | h'
  · linarith
  · linarith

/-- Primer 3, Premisli: pri s = 10, r = 6 je višina v ≥ 0 natanko v = √(10² − 6²) = √64 = 8.
trditev: MAT-OS-9/stozec#primer3-visina
besedilo: »$v = \sqrt{10^2 - 6^2} = \sqrt{64} = 8\,\text{cm}$« -/
theorem primer3_visina (v : ℝ) (hv : 0 ≤ v) :
    ((10:ℝ) ^ 2 = 6 ^ 2 + v ^ 2 ↔ v = 8) ∧ √((10:ℝ) ^ 2 - 6 ^ 2) = √64 ∧ √(64:ℝ) = 8 := by
  refine ⟨⟨fun h => by nlinarith, fun h => by rw [h]; norm_num⟩, by norm_num, ?_⟩
  rw [show (64:ℝ) = 8 ^ 2 by norm_num]
  exact koren_kvadrata 8 (by norm_num)

/-- Predpostavka `primer3_visina` se da izpolniti (v = 8). -/
example : (0:ℝ) ≤ 8 := by norm_num

/-- Primer 3, Premisli: V = π·6²·8/3 = 96π ≈ 301,59 cm³, približno 0,3 l (|96π/1000 − 0,3| < 0,05).
trditev: MAT-OS-9/stozec#primer3-prostornina
besedilo: »$V = \dfrac{\pi \cdot 6^2 \cdot 8}{3} = 96\pi \approx 301{,}59\,\text{cm}^3$, torej približno $0{,}3\,\text{l}$ zraka.« -/
theorem primer3_prostornina :
    π * 6 ^ 2 * 8 / 3 = 96 * π ∧ |96 * π - 301.59| < 0.005 ∧ |96 * π / 1000 - 0.3| < 0.05 := by
  refine ⟨by ring, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith [Real.pi_gt_d6, Real.pi_lt_d6]

/-! ## Preveri se -/

/-- Preveri se 2: s = √(9² + 12²) = 15, α = 9/15·360° = 216°; napačni 9/12·360° = 270°,
15/9·360° = 600°, 9/15·180° = 108°.
trditev: MAT-OS-9/stozec#preveri2
besedilo: »$s = \sqrt{9^2 + 12^2} = 15\,\text{cm}$, $\alpha = \frac{9}{15} \cdot 360^\circ = 216^\circ$.« -/
theorem preveri2 :
    √((9:ℝ) ^ 2 + 12 ^ 2) = 15 ∧ (9:ℝ) / 15 * 360 = 216 ∧ (9:ℝ) / 12 * 360 = 270 ∧ (15:ℝ) / 9 * 360 = 600 ∧
      (9:ℝ) / 15 * 180 = 108 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  rw [show (9:ℝ) ^ 2 + 12 ^ 2 = 15 ^ 2 by norm_num]
  exact koren_kvadrata 15 (by norm_num)

/-- Preveri se 3: koraki (1)–(3) so pravilni (√(25 + 144) = 13, π·5² = 25π, π·5·13 = 65π), korak (4) ne:
V = π·25·12/3 = 100π ≠ π·25·13/3.
trditev: MAT-OS-9/stozec#preveri3
besedilo: »V prostornino spada višina, ne stranica: $V = \frac{\pi \cdot 25 \cdot 12}{3} = 100\pi\,\text{cm}^3$.« -/
theorem preveri3 :
    √((25:ℝ) + 144) = 13 ∧ π * 5 ^ 2 = 25 * π ∧ π * 5 * 13 = 65 * π ∧ π * 25 * 12 / 3 = 100 * π ∧
      π * 25 * 13 / 3 ≠ 100 * π := by
  have hp : 0 < π := Real.pi_pos
  refine ⟨?_, by ring, by ring, by ring, fun h => by nlinarith⟩
  rw [show (25:ℝ) + 144 = 13 ^ 2 by norm_num]
  exact koren_kvadrata 13 (by norm_num)

/-- Preveri se 4: V = π·6²·8/3 = 288π/3 = 96π; napačni: valj π·6²·8 = 288π, s s = 10: π·6²·10/3 = 120π,
brez kvadrata: π·6·8/3 = 16π.
trditev: MAT-OS-9/stozec#preveri4
besedilo: »$V = \frac{\pi \cdot 6^2 \cdot 8}{3} = \frac{288\pi}{3} = 96\pi\,\text{cm}^3$.« -/
theorem preveri4 :
    π * 6 ^ 2 * 8 / 3 = 288 * π / 3 ∧ 288 * π / 3 = 96 * π ∧ π * 6 ^ 2 * 8 = 288 * π ∧
      π * 6 ^ 2 * 10 / 3 = 120 * π ∧ π * 6 * 8 / 3 = 16 * π := by
  refine ⟨by ring, by ring, by ring, by ring, by ring⟩

/-- Preveri se 5: s = √(10² + 24²) = 26, plašč π·10·26 = 260π ≈ 817 cm²; napačni: π·10·24 = 240π ≈ 754,
260π + 100π = 360π ≈ 1131, π·10²·24/3 = 800π ≈ 2513 (vsi na 0,5).
trditev: MAT-OS-9/stozec#preveri5
besedilo: »$s = \sqrt{10^2 + 24^2} = 26\,\text{cm}$, plašč $\pi \cdot 10 \cdot 26 = 260\pi \approx 817\,\text{cm}^2$.« -/
theorem preveri5 :
    √((10:ℝ) ^ 2 + 24 ^ 2) = 26 ∧ π * 10 * 26 = 260 * π ∧ |260 * π - 817| < 0.5 ∧
      π * 10 * 24 = 240 * π ∧ |240 * π - 754| < 0.5 ∧ 260 * π + π * 10 ^ 2 = 360 * π ∧
      |360 * π - 1131| < 0.5 ∧ π * 10 ^ 2 * 24 / 3 = 800 * π ∧ |800 * π - 2513| < 0.5 := by
  have h1 := Real.pi_gt_d6
  have h2 := Real.pi_lt_d6
  refine ⟨?_, by ring, ?_, by ring, ?_, by ring, ?_, by ring, ?_⟩
  · rw [show (10:ℝ) ^ 2 + 24 ^ 2 = 26 ^ 2 by norm_num]
    exact koren_kvadrata 26 (by norm_num)
  all_goals rw [abs_lt]; constructor <;> linarith

end Evklid.Lekcije.MAT_OS_9.Stozec
