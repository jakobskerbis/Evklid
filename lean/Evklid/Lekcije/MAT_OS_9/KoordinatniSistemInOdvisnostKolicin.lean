/-
vir: content/lessons/MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin.md
sha256: 4156a3629f1c04a791b4e9cdf6b5ddc5f7feaf095b5dc0077592b38639eb482a
Model: točka je urejeni par v ℝ × ℝ (najprej abscisa x, nato ordinata y); kvadranti in osi so definirani s
predznaki koordinat natanko kot v lekciji. Količine so realna števila brez enot (g, ml, l, °C, min so le v
docstringih); 0,25 = 1/4. Graf v primeru 3 je funkcija T(t) = 20 + 8t za 0 ≤ t ≤ 10 in T(t) = 100 za t > 10.
Ni v Leanu: risanje (številski premici pod pravim kotom, premiki »desno/gor« kot slika: dokazano je le, kaj
pomenijo predznaki), poimenovanja (abscisa, ordinata, izhodišče, kvadrant, neodvisna/odvisna količina, merilo)
in navodila (os označi z imenom in enoto, na isti osi enako veliki razdelki, katera količina gre na katero os); simulacija; »Točke povežemo le,
kadar imajo vmesne vrednosti pomen« in premisli o rižu in vodi (odločitev o pomenu, ne matematična trditev);
»narašča / pada / vodoravno / bolj strmo« kot opis grafa (dokazano: pri zamrzovalniku so spremembe 8, 6, 4
pozitivne in vse manjše, točke niso na eni premici; pri čajih sta spremembi −40 in −20, |−40| > |−20|;
pri pečici je 40 − 15 = 25 minut stalne temperature); branje grafa (korak 4) kot postopek: dokazan je račun
»vrednost = število razdelkov · vrednost razdelka« v primerih; »Drugače: Kot zgodba« (opis grafa pečice brez
računske trditve; dokazano je le, da je vodoravni del od 15. do 60. minute dolg 45 minut); kviz 3 je dokazan
kot to, da razmiki 100, 100, 200, 400 niso enaki in da sta moka in piškoti premo sorazmerna; besedilo napačnih
odgovorov v Preveri se (dokazano je, da napačne vrednosti niso pravilne).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_9.KoordinatniSistemInOdvisnostKolicin

/-- I. kvadrant: x > 0 in y > 0. -/
def KvI (T : ℝ × ℝ) : Prop := 0 < T.1 ∧ 0 < T.2
/-- II. kvadrant: x < 0 in y > 0. -/
def KvII (T : ℝ × ℝ) : Prop := T.1 < 0 ∧ 0 < T.2
/-- III. kvadrant: x < 0 in y < 0. -/
def KvIII (T : ℝ × ℝ) : Prop := T.1 < 0 ∧ T.2 < 0
/-- IV. kvadrant: x > 0 in y < 0. -/
def KvIV (T : ℝ × ℝ) : Prop := 0 < T.1 ∧ T.2 < 0
/-- Točka leži na osi x (ordinata 0). -/
def NaOsiX (T : ℝ × ℝ) : Prop := T.2 = 0
/-- Točka leži na osi y (abscisa 0). -/
def NaOsiY (T : ℝ × ℝ) : Prop := T.1 = 0

/-! ## Zakaj se tega učimo in razlaga 1 -/

/-- Zakaj se tega učimo in Razlaga 2: (4, 320) in (320, 4) nista ista točka (Tine se moti).
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#tine
besedilo: »Točka $(320, 4)$ bi pomenila »$320$ oseb in $4$ grami riža«: druga točka in zelo lačna druščina.« -/
theorem tine : ((4:ℝ), (320:ℝ)) ≠ (320, 4) := by
  intro h; have := congrArg Prod.fst h; norm_num at this

/-- Razlaga 1: A(3, 2), B(2, 3) in C(−3, 2) so tri različne točke.
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#tri-tocke
besedilo: »Vse tri so zgrajene iz števil $2$ in $3$, pa vendar ležijo na treh različnih mestih.« -/
theorem tri_tocke : ((3:ℝ), (2:ℝ)) ≠ (2, 3) ∧ ((3:ℝ), (2:ℝ)) ≠ (-3, 2) ∧ ((2:ℝ), (3:ℝ)) ≠ (-3, 2) := by
  refine ⟨?_, ?_, ?_⟩ <;> intro h <;> have := congrArg Prod.fst h <;> norm_num at this

/-- Razlaga 1: urejeni par: (x, y) = (x', y') natanko tedaj, ko je x = x' in y = y' (vrstni red je pomemben).
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#urejeni-par
besedilo: »Ker je vrstni red pomemben, je $(x, y)$ **urejeni par**.« -/
theorem urejeni_par (x y x' y' : ℝ) : (x, y) = (x', y') ↔ x = x' ∧ y = y' :=
  ⟨fun h => ⟨congrArg Prod.fst h, congrArg Prod.snd h⟩, fun ⟨a, b⟩ => by rw [a, b]⟩

/-- Razlaga 1, premisli: (5, 0) leži na osi x, (0, −4) na osi y, 4 enote pod izhodiščem.
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#premisli-osi
besedilo: »Točka $(5, 0)$ se premakne $5$ desno, gor ali dol pa nič, zato leži na osi $x$. Točka $(0, -4)$ se ne premakne levo ali desno, zato leži na osi $y$, $4$ enote pod izhodiščem.« -/
theorem premisli_osi : NaOsiX (5, 0) ∧ NaOsiY (0, -4) ∧ (-4:ℝ) < 0 ∧ (0:ℝ) - (-4) = 4 := by
  unfold NaOsiX NaOsiY; norm_num

/-- Razlaga 1: točka na osi ne leži v nobenem kvadrantu.
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#na-osi-ni-kvadrant
besedilo: »Točka na osi ne leži v nobenem kvadrantu.« -/
theorem na_osi_ni_kvadrant (T : ℝ × ℝ) (h : NaOsiX T ∨ NaOsiY T) :
    ¬ KvI T ∧ ¬ KvII T ∧ ¬ KvIII T ∧ ¬ KvIV T := by
  unfold NaOsiX NaOsiY at h
  unfold KvI KvII KvIII KvIV
  rcases h with h | h <;> rw [h] <;> simp

/-- Predpostavka `na_osi_ni_kvadrant` se da izpolniti (T = (5, 0)). -/
example : NaOsiX ((5:ℝ), 0) ∨ NaOsiY ((5:ℝ), 0) := Or.inl rfl

/-- Razlaga 1: osi razdelita ravnino na štiri kvadrante: točka, ki ni na osi, leži v vsaj enem kvadrantu, in
noben par kvadrantov nima skupne točke (torej natanko v enem).
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#stirje-kvadranti
besedilo: »Osi razdelita ravnino na štiri **kvadrante**.« -/
theorem stirje_kvadranti (T : ℝ × ℝ) (hx : ¬ NaOsiY T) (hy : ¬ NaOsiX T) :
    (KvI T ∨ KvII T ∨ KvIII T ∨ KvIV T) ∧
    ¬ (KvI T ∧ KvII T) ∧ ¬ (KvI T ∧ KvIII T) ∧ ¬ (KvI T ∧ KvIV T) ∧
    ¬ (KvII T ∧ KvIII T) ∧ ¬ (KvII T ∧ KvIV T) ∧ ¬ (KvIII T ∧ KvIV T) := by
  unfold NaOsiX NaOsiY at *
  unfold KvI KvII KvIII KvIV
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_⟩
  · rcases lt_or_gt_of_ne hx with h1 | h1 <;> rcases lt_or_gt_of_ne hy with h2 | h2 <;> simp [h1, h2]
  all_goals (rintro ⟨⟨a, b⟩, c, d⟩; linarith)

/-- Predpostavki `stirje_kvadranti` se dasta izpolniti (T = (3, 2)). -/
example : ¬ NaOsiY ((3:ℝ), 2) ∧ ¬ NaOsiX ((3:ℝ), 2) := by unfold NaOsiX NaOsiY; norm_num

/-- Razlaga 1 (simulacija): (3, −2) leži v IV., (−2, 3) v II. kvadrantu.
pomozno – besedilo ob simulaciji je le navodilo in ne pove, v katerem kvadrantu ležita (3, −2) in (−2, 3) -/
theorem simulacija : KvIV (3, -2) ∧ KvII (-2, 3) := by unfold KvIV KvII; norm_num

/-! ## Razlaga 2: riž, premo sorazmerje -/

/-- Količina riža za n oseb: 80 g na osebo. -/
def riz (n : ℝ) : ℝ := 80 * n

/-- Razlaga 2 (tabela): 1 → 80, 2 → 160, 3 → 240, 4 → 320.
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#riz-tabela
besedilo: »| 1 | 80 | | 2 | 160 | | 3 | 240 | | 4 | 320 |« -/
theorem riz_tabela : riz 1 = 80 ∧ riz 2 = 160 ∧ riz 3 = 240 ∧ riz 4 = 320 := by unfold riz; norm_num

/-- Razlaga 2: ko število oseb podvojimo, se podvoji tudi riž (premo sorazmerje).
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#riz-podvojitev
besedilo: »Ko število oseb podvojimo, se podvoji tudi riž.« -/
theorem riz_podvojitev (n : ℝ) : riz (2 * n) = 2 * riz n := by unfold riz; ring

/-- Razlaga 2 (merilo): pri razdelku 40 g je 320 g natanko 8 razdelkov visoko.
pomozno – lekcija pove le razdelek 40 g, višine 8 razdelkov za 320 g ne navede -/
theorem riz_merilo : (320:ℝ) / 40 = 8 := by norm_num

/-- Razlaga 2 in Povzetek: premo sorazmerje y = kx gre skozi (0, 0), in kolikokrat povečamo x, tolikokrat
se poveča y (homogenost). Da je graf premica, je tu le model y = kx (risba ni v Leanu).
pomozno – stavki lekcije o premem sorazmerju trdijo premico skozi izhodišče (graf), izrek pa dokaže le k·0 = 0 in homogenost (docstring: risba ni v Leanu) -/
theorem premo_sorazmerje (k c x : ℝ) : k * 0 = 0 ∧ k * (c * x) = c * (k * x) := by
  constructor <;> ring

/-! ## Razlaga 3: zamrzovalnik -/

/-- Razlaga 3: (0, −18) leži na osi y pod izhodiščem, (10, −10) in (20, −4) v IV. kvadrantu, (30, 0) na osi x.
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#zelenjava-lega
besedilo: »Prva točka leži na osi $y$ pod izhodiščem, naslednji dve v IV. kvadrantu, zadnja na osi $x$.« -/
theorem zelenjava_lega :
    NaOsiY (0, -18) ∧ (-18:ℝ) < 0 ∧ KvIV (10, -10) ∧ KvIV (20, -4) ∧ NaOsiX (30, 0) := by
  unfold NaOsiY NaOsiX KvIV; norm_num

/-- Razlaga 3: v zaporednih desetih minutah se zelenjava segreje za 8, 6 in 4 °C; spremembe so pozitivne
(temperatura narašča) in vse manjše (vedno počasneje).
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#zelenjava-spremembe
besedilo: »V prvih desetih minutah se zelenjava segreje za $8\,^\circ\mathrm{C}$, v naslednjih za $6\,^\circ\mathrm{C}$, nato le za $4\,^\circ\mathrm{C}$.« -/
theorem zelenjava_spremembe :
    (-10:ℝ) - (-18) = 8 ∧ (-4:ℝ) - (-10) = 6 ∧ (0:ℝ) - (-4) = 4 ∧ (0:ℝ) < 4 ∧ (4:ℝ) < 6 ∧ (6:ℝ) < 8 := by
  norm_num

/-- Razlaga 3: točke (0, −18), (10, −10), (20, −4), (30, 0) ne ležijo na nobeni premici y = kx + n.
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#zelenjava-ni-premica
besedilo: »Točke zato ne ležijo na premici.« -/
theorem zelenjava_ni_premica :
    ¬ ∃ k n : ℝ, -18 = k * 0 + n ∧ -10 = k * 10 + n ∧ -4 = k * 20 + n ∧ 0 = k * 30 + n := by
  rintro ⟨k, n, h1, h2, h3, -⟩
  linarith

/-! ## Rešeni primeri -/

/-- Primer 1: A(4, 1) je v I., B(−2, 3) v II., C(−1, −4) v III. kvadrantu, D(0, −3) na osi y, 3 enote pod
izhodiščem.
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#primer1
besedilo: »Odgovor: $A$ je v I., $B$ v II., $C$ v III. kvadrantu, $D$ pa na osi $y$.« -/
theorem primer1 : KvI (4, 1) ∧ KvII (-2, 3) ∧ KvIII (-1, -4) ∧ NaOsiY (0, -3) ∧ (-3:ℝ) < 0 ∧ (0:ℝ) - (-3) = 3 := by
  unfold KvI KvII KvIII NaOsiY; norm_num

/-- Primer 1: D(0, −3) ne leži v nobenem kvadrantu.
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#primer1-d
besedilo: »Točka na osi ne leži v nobenem kvadrantu.« -/
theorem primer1_D : ¬ KvI (0, -3) ∧ ¬ KvII (0, -3) ∧ ¬ KvIII (0, -3) ∧ ¬ KvIV (0, -3) :=
  na_osi_ni_kvadrant _ (Or.inr rfl)

/-- Primer 2, korak 1: tabela mleka 150·1 = 150, 150·2 = 300, 150·3 = 450, 150·4 = 600 (ml).
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#primer2-tabela
besedilo: »Tabela: $1 \to 150$, $2 \to 300$, $3 \to 450$, $4 \to 600$ (ml), ker vsako jajce prinese $150\,\mathrm{ml}$.« -/
theorem primer2_tabela :
    (150:ℝ) * 1 = 150 ∧ (150:ℝ) * 2 = 300 ∧ (150:ℝ) * 3 = 450 ∧ (150:ℝ) * 4 = 600 := by norm_num

/-- Primer 2, koraki 3–5: 150·5 = 750, merilo 750 : 15 = 50, višini 150 : 50 = 3 in 600 : 50 = 12 kvadratkov,
točka za 5 jajc je 12 + 3 = 15 kvadratkov visoko, 15·50 = 750 ml.
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#primer2
besedilo: »zato je točka za $5$ jajc $12 + 3 = 15$ kvadratkov visoko, $15 \cdot 50 = 750$ ml.« -/
theorem primer2 :
    (150:ℝ) * 5 = 750 ∧ (750:ℝ) / 15 = 50 ∧ (150:ℝ) / 50 = 3 ∧ (600:ℝ) / 50 = 12 ∧ (12:ℝ) + 3 = 15 ∧
    (15:ℝ) * 50 = 750 := by norm_num

/-- Primer 2, korak 5: vsako jajce doda 150 : 50 = 3 kvadratke višine (višina za j jajc je 3j).
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#primer2-korak
besedilo: »Vsako jajce doda $3$ kvadratke višine« -/
theorem primer2_korak (j : ℝ) : 150 * (j + 1) / 50 - 150 * j / 50 = 3 := by ring

/-- Temperatura vode v primeru 3: premica od (0, 20) do (10, 100), nato vodoravno pri 100. -/
noncomputable def voda (t : ℝ) : ℝ := if t ≤ 10 then 20 + 8 * t else 100

/-- Primer 3, koraki 1–3: 100 − 20 = 80, 80 : 10 = 8 na minuto, 60 − 20 = 40, 40 : 8 = 5 minut.
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#primer3-racun
besedilo: »Do $60\,^\circ\mathrm{C}$ se mora segreti za $60 - 20 = 40$ stopinj. To traja $40 : 8 = 5$ minut.« -/
theorem primer3_racun : (100:ℝ) - 20 = 80 ∧ (80:ℝ) / 10 = 8 ∧ (60:ℝ) - 20 = 40 ∧ (40:ℝ) / 8 = 5 := by norm_num

/-- Primer 3, korak 2: premica skozi (0, 20) in (10, 100) je natanko T = 8t + 20 (enakomerno 8 stopinj na
minuto).
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#primer3-premica
besedilo: »Ker je graf premica, je segrevanje enakomerno: $80 : 10 = 8$ stopinj na minuto.« -/
theorem primer3_premica (k n : ℝ) : (20 = k * 0 + n ∧ 100 = k * 10 + n) ↔ (k = 8 ∧ n = 20) := by
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Primer 3: graf gre skozi (0, 20) in (10, 100).
pomozno – preveri, da model voda ustreza podatkom naloge (točki iz besedila naloge, ki se ne citira) -/
theorem voda_krajisca : voda 0 = 20 ∧ voda 10 = 100 := by
  unfold voda; norm_num

/-- Primer 3, odgovor: voda ima 60 °C natanko ob t = 5 (velja tudi brez pogoja t ≥ 0).
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#primer3-60
besedilo: »Odgovor: voda ima $60\,^\circ\mathrm{C}$ po $5$ minutah« -/
theorem primer3_60 (t : ℝ) : voda t = 60 ↔ t = 5 := by
  unfold voda
  split_ifs with h
  · constructor <;> intro h' <;> linarith
  · constructor
    · intro h'; norm_num at h'
    · intro h'; exact absurd (h' ▸ (by norm_num : (5:ℝ) ≤ 10)) h

/-- Primer 3, korak 5: po 10. minuti se temperatura ne spreminja; ob 12. minuti je 100 °C.
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#primer3-12
besedilo: »Po $10$. minuti je graf vodoraven, temperatura se ne spreminja več. Voda vre, zato ima ob $12$. minuti še vedno $100\,^\circ\mathrm{C}$.« -/
theorem primer3_12 : voda 12 = 100 ∧ ∀ t : ℝ, 10 ≤ t → voda t = 100 := by
  unfold voda
  refine ⟨by norm_num, fun t ht => ?_⟩
  split_ifs with h
  · have : t = 10 := le_antisymm h ht
    subst this; norm_num
  · rfl

/-- Primer 4, korak 1: 3 − 4·0,25 = 2 in 3 − 8·0,25 = 1 (l); pri 0 krožnikih 3 l.
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#primer4-tabela
besedilo: »Tabela: $0$ krožnikov $\to 3\,\mathrm{l}$; $4$ krožniki $\to 3 - 4 \cdot 0{,}25 = 2$ (l); $8$ krožnikov $\to 3 - 8 \cdot 0{,}25 = 1$ (l).« -/
theorem primer4_tabela : (3:ℝ) - 0 * (1/4) = 3 ∧ (3:ℝ) - 4 * (1/4) = 2 ∧ (3:ℝ) - 8 * (1/4) = 1 := by norm_num

/-- Primer 4, korak 2: premica je padajoča, na vsake 4 krožnike gre 1 l manj.
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#primer4-padajoca
besedilo: »na vsake $4$ krožnike gre $1\,\mathrm{l}$ manj.« -/
theorem primer4_padajoca (m : ℝ) : (3 - (m + 4) * (1/4)) - (3 - m * (1/4)) = -1 := by ring

/-- Primer 4, premisli: graf doseže os x natanko pri 12 krožnikih (3 − 0,25m = 0 ↔ m = 12); 3 : 0,25 = 12,
od (8, 1) še 4 krožnike.
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#primer4
besedilo: »Račun: $3 : 0{,}25 = 12$. Točka je $(12, 0)$, lonec je prazen po $12$ krožnikih.« -/
theorem primer4 (m : ℝ) : (3 - m * (1/4) = 0 ↔ m = 12) ∧ (3:ℝ) / (1/4) = 12 ∧ (8:ℝ) + 4 = 12 := by
  refine ⟨by constructor <;> intro h <;> linarith, by norm_num, by norm_num⟩

/-! ## Pogoste napake in Povzetek -/

/-- Pogoste napake 1 in Povzetek: (2, 5) ≠ (5, 2).
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#napaka-vrstni-red
besedilo: »Točki $(2, 5)$ in $(5, 2)$ pa ležita na različnih mestih.« -/
theorem napaka_vrstni_red : ((2:ℝ), (5:ℝ)) ≠ (5, 2) := by
  intro h; have := congrArg Prod.fst h; norm_num at this

/-- Pogoste napake 2: oznake 0, 100, 200, 400 na enakih razmikih niso enakomerne (razmiki 100, 100, 200).
pomozno – lekcija opiše napako in pravilo, razmikov 100, 100, 200 (da niso enaki) pa ne pove -/
theorem napaka_razdelki : (100:ℝ) - 0 = 100 ∧ (200:ℝ) - 100 = 100 ∧ (400:ℝ) - 200 = 200 ∧ (200:ℝ) ≠ 100 := by
  norm_num

/-- Pogoste napake 3: 7 kvadratkov pri merilu 50 g je 7·50 = 350 g, ne 7 g.
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#napaka-kvadratki
besedilo: »Pri merilu $50\,\mathrm{g}$ na kvadratek je to $7 \cdot 50 = 350$ gramov.« -/
theorem napaka_kvadratki : (7:ℝ) * 50 = 350 ∧ (350:ℝ) ≠ 7 := by norm_num

/-! ## Drugače -/

/-- Korak za korakom: 10 piškotov → 120 g, zato 20 → 240, 30 → 360 (premo sorazmerje 12 g na piškot).
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#piskoti-tabela
besedilo: »**Tabela.** $10 \to 120$, $20 \to 240$, $30 \to 360$ (gramov moke).« -/
theorem piskoti_tabela : (120:ℝ) / 10 = 12 ∧ (12:ℝ) * 20 = 240 ∧ (12:ℝ) * 30 = 360 := by norm_num

/-- Korak za korakom: na osi x 30 : 10 = 3 kvadratki; na osi y 360 : 40 = 9 kvadratkov; točka (20, 240) je
20 : 10 = 2 kvadratka desno in 240 : 40 = 6 kvadratkov gor.
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#piskoti-merilo
besedilo: »Točka $(20, 240)$: $2$ kvadratka desno, $240 : 40 = 6$ kvadratkov gor.« -/
theorem piskoti_merilo : (30:ℝ) / 10 = 3 ∧ (360:ℝ) / 40 = 9 ∧ (20:ℝ) / 10 = 2 ∧ (240:ℝ) / 40 = 6 := by norm_num

/-- Korak za korakom, korak 6: dvakrat več piškotov, dvakrat več moke (120·(2p)/10 = 2·(120p/10)).
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#piskoti-sorazmerje
besedilo: »dvakrat več piškotov dvakrat več moke« -/
theorem piskoti_sorazmerje (p : ℝ) : 120 * (2 * p) / 10 = 2 * (120 * p / 10) := by ring

/-- Kot zgodba: vodoravni del grafa pečice od 15. do 60. minute traja 45 minut.
pomozno – lekcija trajanja 45 minut ne navede (pove le »od 15. do 60. minute«) -/
theorem pecica_zgodba : (60:ℝ) - 15 = 45 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 1: T(−3, 2) leži v II. kvadrantu (3 levo od osi y, 2 nad osjo x), ne v III.; ni ista točka kot
(2, −3), ki leži v IV. kvadrantu.
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#kviz1
besedilo: »Abscisa $-3$ pomeni $3$ enote levo, ordinata $2$ pomeni $2$ enoti gor. Predznaka $(-,+)$ pomenita II. kvadrant.« -/
theorem kviz1 :
    KvII (-3, 2) ∧ (0:ℝ) - (-3) = 3 ∧ ¬ KvIII (-3, 2) ∧ ((-3:ℝ), (2:ℝ)) ≠ (2, -3) ∧ KvIV (2, -3) := by
  refine ⟨by unfold KvII; norm_num, by norm_num, by unfold KvIII; norm_num, ?_, by unfold KvIV; norm_num⟩
  intro h; have := congrArg Prod.fst h; norm_num at this

/-- Preveri se 2: 7 kvadratkov po 50 g je 7·50 = 350 g (ne 7, ne 7 + 50 = 57, ne 50).
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#kviz2
besedilo: »Vrednost $=$ število kvadratkov $\cdot$ vrednost kvadratka $= 7 \cdot 50\,\mathrm{g} = 350\,\mathrm{g}$.« -/
theorem kviz2 : (7:ℝ) * 50 = 350 ∧ (7:ℝ) + 50 = 57 ∧ (350:ℝ) ≠ 57 ∧ (350:ℝ) ≠ 7 ∧ (350:ℝ) ≠ 50 := by norm_num

/-- Preveri se 3: Majini razmiki 100, 100, 200, 400 niso enaki; moka je premo sorazmerna s številom piškotov
(z enakomernim merilom je graf premica skozi izhodišče).
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#kviz3
besedilo: »Pri receptu sta premo sorazmerni: dvakrat več piškotov, dvakrat več moke.« -/
theorem kviz3 (p : ℝ) :
    (100:ℝ) - 0 = 100 ∧ (200:ℝ) - 100 = 100 ∧ (400:ℝ) - 200 = 200 ∧ (800:ℝ) - 400 = 400 ∧ (200:ℝ) ≠ 100 ∧
    120 / 10 * 0 = (0:ℝ) ∧ 120 / 10 * (2 * p) = 2 * (120 / 10 * p) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by ring⟩

/-- Preveri se 4: čaj A se v 10 minutah ohladi za 90 − 50 = 40 °C, B za 90 − 70 = 20 °C; obe spremembi sta
negativni (grafa padata), A je večja (A pada strmeje).
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#kviz4
besedilo: »Oba padata, ker se temperatura znižuje.« -/
theorem kviz4 :
    (50:ℝ) - 90 = -40 ∧ (70:ℝ) - 90 = -20 ∧ (-40:ℝ) < 0 ∧ (-20:ℝ) < 0 ∧ |(-20:ℝ)| < |(-40:ℝ)| := by
  norm_num

/-- Preveri se 5: vodoravna črta od 15. do 40. minute pri 180 °C pomeni stalno temperaturo 180 °C 40 − 15 = 25
minut (sprememba 180 − 180 = 0, višina 180 ≠ 0).
trditev: MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin#kviz5
besedilo: »Temperatura je $25$ minut ostala $180\,^\circ\mathrm{C}$.« -/
theorem kviz5 : (40:ℝ) - 15 = 25 ∧ (180:ℝ) - 180 = 0 ∧ (180:ℝ) ≠ 0 := by norm_num

end Evklid.Lekcije.MAT_OS_9.KoordinatniSistemInOdvisnostKolicin
