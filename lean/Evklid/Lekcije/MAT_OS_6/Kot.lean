/-
vir: content/lessons/MAT-OS-6/kot.md
sha256: af4fc5d210dfe2e68d8d0a304b74eaf12c55534099fbb31d09c054ebefefaf3b
Model: velikost kota v stopinjah je realno število α; vrste kotov so predikati na α (ostri 0 < α < 90, pravi α = 90,
topi 90 < α < 180, iztegnjeni α = 180, udrti 180 < α < 360, ničelni 0, polni 360). Geometrijske trditve (dolžina
krakov, lupa, iztegnjeni kot, ∠AVB ≠ ∠VAB, ∠AVB ni večji od iztegnjenega) so dokazane za neusmerjeni kot iz Mathliba
(`InnerProductGeometry.angle` med vektorjema krakov, `EuclideanGeometry.angle` ∠ med točkami), ki je v radianih
(iztegnjeni kot = π); zgled je v ravnini ℂ. Upogib kolena u in kot v kolenu: α = 180 − u (definicija iz lekcije).
Ni v Leanu: pravilo za sosednja kota ∠AVC = ∠AVB + ∠BVC v splošnem (zahtevno, še ni dokazano: pogoj »se ne
prekrivata« za neusmerjene kote v ravnini; dokazan je primer, ko je ∠AVC iztegnjeni, in računi primerov); postopka
merjenja s kotomerom in risanja kota (navodila za risanje, dokazano je le branje na drugi lestvici: 180° − α);
»Kraka vedno določata dva kota, ki skupaj merita 360°« je dogovor o udrtem kotu (dokazano: drugi kot ostrega, pravega
ali topega je udrt); zgodbe (fizioterapevtka, komolec, rentgen, Maja, goniometer) in »Majin cilj« so okvir računov;
risbi kotov α = 40°, β = 70° in kviza 4 (dokazani so računi); simulacija »Kot in kotomer«; oznaka pravega kota (lok s
piko) in grške črke so dogovor o zapisu; razlogi napak so opis.
Napačni odgovori kvizov: dokazano je, da napačne vrednosti niso pravilne.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.Kot

open EuclideanGeometry Real

/-- Ničelni kot. -/
def nicelni (α : ℝ) : Prop := α = 0
/-- Ostri kot: med 0° in 90°. -/
def ostri (α : ℝ) : Prop := 0 < α ∧ α < 90
/-- Pravi kot: 90°. -/
def pravi (α : ℝ) : Prop := α = 90
/-- Topi kot: med 90° in 180°. -/
def topi (α : ℝ) : Prop := 90 < α ∧ α < 180
/-- Iztegnjeni kot: 180°. -/
def iztegnjeni (α : ℝ) : Prop := α = 180
/-- Udrti kot: med 180° in 360°. -/
def udrti (α : ℝ) : Prop := 180 < α ∧ α < 360
/-- Polni kot: 360°. -/
def polni (α : ℝ) : Prop := α = 360

/-- Kot v kolenu pri upogibu u (stopinje). -/
def kotKolena (u : ℝ) : ℝ := 180 - u

/-! ## Razlaga 1–3: kot, velikost kota, stopinja -/

/-- Razlaga 1, premisli: β = 70° je večji od α = 40°.
trditev: MAT-OS-6/kot#premisli-1
besedilo: »Večji je $\beta$: meri $70^\circ$, $\alpha$ pa le $40^\circ$.« -/
theorem premisli1 : (40 : ℝ) < 70 := by norm_num

/-- Razlaga 2, Povzetek in Pogoste napake 1: velikost kota ni odvisna od dolžine krakov: če krak (ali oba) podaljšamo
ali skrajšamo (pomnožimo s pozitivnim številom), kot ostane enak.
trditev: MAT-OS-6/kot#dolzina-krakov
besedilo: »Pravilno: velikost kota je odvisna samo od razprtosti krakov. Daljša roka, povečana slika ali podaljšan krak kota ne spremenijo.« -/
theorem dolzina_krakov {V : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] (x y : V) (r s : ℝ)
    (hr : 0 < r) (hs : 0 < s) : InnerProductGeometry.angle (r • x) (s • y) = InnerProductGeometry.angle x y := by
  rw [InnerProductGeometry.angle_smul_left_of_pos _ _ hr, InnerProductGeometry.angle_smul_right_of_pos _ _ hs]

example := dolzina_krakov (1 : ℂ) Complex.I 4 (3 / 2) (by norm_num) (by norm_num)

/-- Razlaga 3 (premisli) in Zakaj se tega učimo: lupa, ki vse poveča trikrat, kota ne spremeni.
trditev: MAT-OS-6/kot#lupa
besedilo: »Kraka ostaneta enako razprta, zato kot ostane enak.« -/
theorem lupa {V : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] (x y : V) :
    InnerProductGeometry.angle ((3 : ℝ) • x) ((3 : ℝ) • y) = InnerProductGeometry.angle x y :=
  dolzina_krakov x y 3 3 (by norm_num) (by norm_num)

/-- Kviz 3: sliko natisnemo dvakrat večjo, kot (40°) ostane enak; 80° in 20° nista pravilna odgovora.
trditev: MAT-OS-6/kot#kviz-3
besedilo: »Povečava podaljša kraka, ne spremeni pa njune razprtosti, zato kot ostane $40^\circ$.« -/
theorem kviz3 {V : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] (x y : V) :
    InnerProductGeometry.angle ((2 : ℝ) • x) ((2 : ℝ) • y) = InnerProductGeometry.angle x y ∧ (80 : ℝ) ≠ 40 ∧ (20 : ℝ) ≠ 40 :=
  ⟨dolzina_krakov x y 2 2 (by norm_num) (by norm_num), by norm_num, by norm_num⟩

/-- Razlaga 4 (dogovor): ∠AVB je kot, ki ni večji od iztegnjenega: 0 ≤ ∠AVB ≤ π (iztegnjeni kot je π radianov).
trditev: MAT-OS-6/kot#ne-vecji-od-iztegnjenega
besedilo: »Če ni drugače rečeno, z zapisom $\angle AVB$ mislimo kot, ki ni večji od iztegnjenega.« -/
theorem ne_vecji_od_iztegnjenega {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (A V' B : P) : 0 ≤ ∠ A V' B ∧ ∠ A V' B ≤ π :=
  ⟨angle_nonneg A V' B, angle_le_pi A V' B⟩

/-- Pogoste napake 5 in Povzetek: vrh je srednja črka; ∠AVB in ∠VAB nista isti kot (zgled v ravnini:
A = 1, V = 0, B = i, kjer je ∠AVB pravi, ∠VAB pa ne).
trditev: MAT-OS-6/kot#vrh-srednja-crka
besedilo: »Zapisa $\angle AVB$ in $\angle VAB$ ne pomenita istega kota.« -/
theorem vrh_srednja_crka : ∠ (1 : ℂ) 0 Complex.I = π / 2 ∧ ∠ (0 : ℂ) 1 Complex.I ≠ π / 2 ∧
    ∠ (1 : ℂ) 0 Complex.I ≠ ∠ (0 : ℂ) 1 Complex.I := by
  have h1 : ∠ (1 : ℂ) 0 Complex.I = π / 2 := by
    unfold EuclideanGeometry.angle
    rw [← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [Complex.inner]
  have h2 : ∠ (0 : ℂ) 1 Complex.I ≠ π / 2 := by
    unfold EuclideanGeometry.angle
    rw [Ne, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [Complex.inner]
  exact ⟨h1, h2, by rw [h1]; exact fun h => h2 h.symm⟩

/-- Razlaga 3 in Povzetek: polni kot meri 360°, 1° je tristošestdesetinka polnega kota; v radianih je polni kot 2π
in 1° = π/180 = 2π/360.
trditev: MAT-OS-6/kot#stopinja
besedilo: »Ena stopinja je torej tristošestdesetinka polnega kota:« -/
theorem stopinja : (1 : ℝ) = 1 / 360 * 360 ∧ π / 180 = 1 / 360 * (2 * π) := by
  constructor <;> ring

/-! ## Razlaga 4: vrste kotov -/

/-- Razlaga 4 in Povzetek: vsak kot med 0° in 360° je ničelni, ostri, pravi, topi, iztegnjeni, udrti ali polni.
trditev: MAT-OS-6/kot#razvrstitev
besedilo: »Ničelni $0^\circ$; ostri med $0^\circ$ in $90^\circ$; pravi $90^\circ$; topi med $90^\circ$ in $180^\circ$; iztegnjeni $180^\circ$; udrti med $180^\circ$ in $360^\circ$; polni $360^\circ$.« -/
theorem razvrstitev (α : ℝ) (h0 : 0 ≤ α) (h1 : α ≤ 360) :
    nicelni α ∨ ostri α ∨ pravi α ∨ topi α ∨ iztegnjeni α ∨ udrti α ∨ polni α := by
  unfold nicelni ostri pravi topi iztegnjeni udrti polni
  rcases h0.lt_or_eq with h0 | h0
  · rcases lt_trichotomy α 90 with h | h | h
    · exact Or.inr (Or.inl ⟨h0, h⟩)
    · exact Or.inr (Or.inr (Or.inl h))
    · rcases lt_trichotomy α 180 with h' | h' | h'
      · exact Or.inr (Or.inr (Or.inr (Or.inl ⟨h, h'⟩)))
      · exact Or.inr (Or.inr (Or.inr (Or.inr (Or.inl h'))))
      · rcases h1.lt_or_eq with h1 | h1
        · exact Or.inr (Or.inr (Or.inr (Or.inr (Or.inr (Or.inl ⟨h', h1⟩)))))
        · exact Or.inr (Or.inr (Or.inr (Or.inr (Or.inr (Or.inr h1)))))
  · exact Or.inl h0.symm

example := razvrstitev 35 (by norm_num) (by norm_num)

/-- Razlaga 4, Pogoste napake 3 in kviz 2: vrste po velikosti: ničelni < ostri < pravi < topi < iztegnjeni < udrti
< polni (zato se vrste izključujejo).
trditev: MAT-OS-6/kot#vrstni-red
besedilo: »Ostri je pod $90^\circ$, pravi $90^\circ$, topi med $90^\circ$ in $180^\circ$, iztegnjeni $180^\circ$, udrti nad $180^\circ$.« -/
theorem vrstni_red (z a b c d e f : ℝ) (hz : nicelni z) (ha : ostri a) (hb : pravi b) (hc : topi c)
    (hd : iztegnjeni d) (he : udrti e) (hf : polni f) : z < a ∧ a < b ∧ b < c ∧ c < d ∧ d < e ∧ e < f := by
  unfold nicelni ostri pravi topi iztegnjeni udrti polni at *
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_⟩ <;> linarith [ha.1, ha.2, hc.1, hc.2, he.1, he.2]

example := vrstni_red 0 35 90 128 180 250 360 rfl (by unfold ostri; norm_num) rfl (by unfold topi; norm_num) rfl
  (by unfold udrti; norm_num) rfl

/-- Razlaga 4 in Pogoste napake 3: pravi kot ni ne ostri ne topi; iztegnjeni kot ni topi (ostri je strogo manjši od
90°, topi strogo med 90° in 180°).
trditev: MAT-OS-6/kot#pravi-meja
besedilo: »Pravi kot je meja med ostrimi in topimi koti, zato ni ne ostri ne topi.« -/
theorem pravi_meja : ¬ ostri 90 ∧ ¬ topi 90 ∧ ¬ topi 180 ∧ pravi 90 ∧ iztegnjeni 180 := by
  unfold ostri topi pravi iztegnjeni; norm_num

/-- Razlaga 4 in 7: če je kot ostri, pravi ali topi (0° < α < 180°), je drugi kot pri istih krakih, 360° − α, udrti;
skupaj merita 360°.
trditev: MAT-OS-6/kot#drugi-kot
besedilo: »Kraka vedno določata dva kota, ki skupaj merita $360^\circ$; če je eden ostri, pravi ali topi, je drugi udrti.« -/
theorem drugi_kot (α : ℝ) (h : ostri α ∨ pravi α ∨ topi α) : udrti (360 - α) ∧ α + (360 - α) = 360 := by
  unfold ostri pravi topi udrti at *
  refine ⟨?_, by ring⟩
  rcases h with ⟨h1, h2⟩ | h | ⟨h1, h2⟩
  · constructor <;> linarith
  · subst h; norm_num
  · constructor <;> linarith

example := drugi_kot 110 (Or.inr (Or.inr (by unfold topi; norm_num)))

/-- Razlaga 7 in Povzetek: kraka kota α (0° < α < 180°) določata še udrti kot 360° − α.
trditev: MAT-OS-6/kot#udrti
besedilo: »Kraka kota $\alpha$ (kjer je $0^\circ < \alpha < 180^\circ$) določata še udrti kot, ki meri $360^\circ - \alpha$.« -/
theorem udrti_kot (α : ℝ) (h0 : 0 < α) (h1 : α < 180) : udrti (360 - α) := by
  unfold udrti; constructor <;> linarith

example := udrti_kot 110 (by norm_num) (by norm_num)

/-! ## Razlaga 5 in 7: kotomer, iztegnjeni kot, upogib -/

/-- Razlaga 5 in Pogoste napake 2: lestvici kotomera tečeta v nasprotnih smereh, na drugi lestvici prebereš
180° − α; topi kot 110° na napačni lestvici prebereš kot 70° (ostri).
trditev: MAT-OS-6/kot#napacna-lestvica
besedilo: »kotomer ima dve vrsti številk, ki sta videti podobni, zato topi kot $110^\circ$ prebereš kot $70^\circ$.« -/
theorem napacna_lestvica : (180 : ℝ) - 110 = 70 ∧ topi 110 ∧ ostri 70 := by
  unfold topi ostri; norm_num

/-- Razlaga 5 (preizkus z vogalom lista): kot, širši od pravega (in manjši od iztegnjenega), je topi in meri več
kot 90°.
trditev: MAT-OS-6/kot#ocena
besedilo: »Če je širši, je topi in kotomer mora pokazati več kot $90^\circ$.« -/
theorem ocena (α : ℝ) (h1 : 90 < α) (h2 : α < 180) : topi α := ⟨h1, h2⟩

example := ocena 110 (by norm_num) (by norm_num)

/-- Razlaga 5 in Povzetek: udrti kot izmeriš posredno, drugi kot pri istih krakih odšteješ od 360°; Korak za korakom:
drugi kot 110°, udrti kot 360° − 110° = 250°.
trditev: MAT-OS-6/kot#udrti-posredno
besedilo: »Udrti kot meri $360^\circ - 110^\circ = 250^\circ$.« -/
theorem udrti_posredno : (360 : ℝ) - 110 = 250 ∧ udrti 250 := by unfold udrti; norm_num

/-- Kviz 4 (splošno): poltrak VB razdeli iztegnjeni kot AVC (∠AVC = π) na kota, ki skupaj merita iztegnjeni kot.
trditev: MAT-OS-6/kot#iztegnjeni-razdeljen
besedilo: »Kota skupaj sestavljata iztegnjeni kot, $180^\circ$.« -/
theorem iztegnjeni_razdeljen {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (A V' B C : P) (h : ∠ A V' C = π) : ∠ B V' A + ∠ B V' C = π :=
  angle_add_angle_eq_pi_of_angle_eq_pi B h

example := iztegnjeni_razdeljen (1 : ℂ) 0 Complex.I (-1) (by
  unfold EuclideanGeometry.angle
  simp)

/-- Kviz 4: α + β = 180° in α = 125° natanko tedaj, ko β = 55°; napačna 235° (od polnega kota) in 125° nista
rešitev.
trditev: MAT-OS-6/kot#kviz-4
besedilo: »$\alpha + \beta = 180^\circ$, zato je $\beta = 180^\circ - 125^\circ = 55^\circ$.« -/
theorem kviz4 (β : ℝ) : 125 + β = 180 ↔ β = 55 := by
  constructor <;> intro h <;> linarith

/-- Kviz 4 (napačni vrednosti): 360° − 125° = 235° in 125° nista 55°.
trditev: MAT-OS-6/kot#kviz-4-napacni
besedilo: »To je kot $\alpha$. Kota $\alpha$ in $\beta$ skupaj merita $180^\circ$.« -/
theorem kviz4_napacni : (360 : ℝ) - 125 = 235 ∧ (125 : ℝ) + 235 ≠ 180 ∧ (125 : ℝ) + 125 ≠ 180 := by norm_num

/-- Razlaga 7 in Povzetek: kar kotu α manjka do iztegnjenega, meri 180° − α (α + (180° − α) = 180°).
trditev: MAT-OS-6/kot#do-iztegnjenega
besedilo: »Kar kotu $\alpha$ manjka do iztegnjenega kota, meri $180^\circ - \alpha$.« -/
theorem do_iztegnjenega (α β : ℝ) : α + β = 180 ↔ β = 180 - α := by
  constructor <;> intro h <;> linarith

/-- Razlaga 7 in Pogoste napake 4: večji upogib pomeni manjši kot v kolenu.
trditev: MAT-OS-6/kot#vecji-upogib
besedilo: »Večji upogib pomeni manjši kot.« -/
theorem vecji_upogib (u₁ u₂ : ℝ) : u₁ < u₂ ↔ kotKolena u₂ < kotKolena u₁ := by
  unfold kotKolena; constructor <;> intro h <;> linarith

/-! ## Rešeni primeri -/

/-- Primer 1: 35° je ostri, 90° pravi, 128° topi, 180° iztegnjeni, 250° udrti.
trditev: MAT-OS-6/kot#primer-1
besedilo: »Odgovor: po vrsti so koti ostri, pravi, topi, iztegnjeni in udrti.« -/
theorem primer1 : ostri 35 ∧ pravi 90 ∧ topi 128 ∧ iztegnjeni 180 ∧ udrti 250 := by
  unfold ostri pravi topi iztegnjeni udrti; norm_num

/-- Primer 2: ∠AVC = 38° + 52° = 90° (pravi); do iztegnjenega manjka 180° − 90° = 90°; preizkus 90° + 90° = 180°.
trditev: MAT-OS-6/kot#primer-2
besedilo: »Odgovor: roka in trup oklepata pravi kot $90^\circ$; do roke nad glavo manjka še $90^\circ$.« -/
theorem primer2 : (38 : ℝ) + 52 = 90 ∧ pravi (38 + 52) ∧ (180 : ℝ) - 90 = 90 ∧ (90 : ℝ) + 90 = 180 := by
  unfold pravi; norm_num

/-- Primer 3: α₁ = 180° − 65° = 115° (topi); u₂ = 65° + 30° = 95°; α₂ = 180° − 95° = 85° (ostri);
115° − 30° = 85°.
trditev: MAT-OS-6/kot#primer-3
besedilo: »$\alpha_2 = 180^\circ - 95^\circ = 85^\circ$. Ker je $85^\circ < 90^\circ$, je kot ostri.« -/
theorem primer3 :
    kotKolena 65 = 115 ∧ topi 115 ∧ (65 : ℝ) + 30 = 95 ∧ kotKolena (65 + 30) = 85 ∧ (85 : ℝ) < 90 ∧ ostri 85 ∧
      (115 : ℝ) - 30 = 85 := by
  unfold kotKolena topi ostri; norm_num

/-- Primer 3 (splošno): upogib, večji za 30°, da kot, manjši za 30°.
trditev: MAT-OS-6/kot#primer-3-splosno
besedilo: »Upogib se je povečal, kot se je zmanjšal za $30^\circ$: $115^\circ - 30^\circ = 85^\circ$.« -/
theorem primer3_splosno (u : ℝ) : kotKolena (u + 30) = kotKolena u - 30 := by unfold kotKolena; ring

/-! ## Pogoste napake, zgodba, korak za korakom -/

/-- Pogoste napake 4 in kviz 5: pri upogibu 40° je kot v kolenu 180° − 40° = 140° (topi), ne 40°.
trditev: MAT-OS-6/kot#upogib-40
besedilo: »Pravilno: kot je $180^\circ - 40^\circ = 140^\circ$, torej topi.« -/
theorem upogib40 : kotKolena 40 = 140 ∧ topi 140 ∧ kotKolena 40 ≠ 40 ∧ ostri 40 := by
  unfold kotKolena topi ostri; norm_num

/-- Kviz 5: kot v kolenu pri upogibu 40° je natanko 140°; napačni 40 (upogib), 50 (90° − 40°), 320 (360° − 40°).
trditev: MAT-OS-6/kot#kviz-5
besedilo: »$\alpha = 180^\circ - u = 180^\circ - 40^\circ = 140^\circ$; kot je topi.« -/
theorem kviz5 (α : ℝ) : (α = kotKolena 40 ↔ α = 140) ∧ (90 : ℝ) - 40 = 50 ∧ (360 : ℝ) - 40 = 320 ∧
    kotKolena 40 ≠ 50 ∧ kotKolena 40 ≠ 320 := by
  unfold kotKolena; norm_num

/-- Kot zgodba: kot 160° da upogib 180° − 160° = 20°; 70° ni topi, na drugi lestvici 110° je topi, upogib
180° − 110° = 70°; pri kotu 90° je upogib 180° − 90° = 90°.
trditev: MAT-OS-6/kot#zgodba
besedilo: »Na drugi lestvici je pisalo $110^\circ$; upogib je bil $180^\circ - 110^\circ = 70^\circ$.« -/
theorem zgodba :
    (180 : ℝ) - 160 = 20 ∧ kotKolena 20 = 160 ∧ ¬ topi 70 ∧ topi 110 ∧ (180 : ℝ) - 110 = 70 ∧
      kotKolena 70 = 110 ∧ (180 : ℝ) - 90 = 90 ∧ pravi (kotKolena 90) := by
  unfold kotKolena topi pravi; norm_num

/-- Korak za korakom (merjenje): 63° < 90°, kot 63° je ostri.
trditev: MAT-OS-6/kot#korak-63
besedilo: »Rezultat: $\angle AVB = 63^\circ$. Ocena se ujema ($63^\circ < 90^\circ$).« -/
theorem korak63 : (63 : ℝ) < 90 ∧ ostri 63 := by unfold ostri; norm_num

/-- Korak za korakom (risanje): 125° > 90° je topi; do iztegnjenega manjka 180° − 125° = 55°; 125° + 55° = 180°.
trditev: MAT-OS-6/kot#korak-125
besedilo: »Do iztegnjenega kota manjka $180^\circ - 125^\circ = 55^\circ$. Preizkus: $125^\circ + 55^\circ = 180^\circ$.« -/
theorem korak125 : (125 : ℝ) > 90 ∧ topi 125 ∧ (180 : ℝ) - 125 = 55 ∧ (125 : ℝ) + 55 = 180 := by
  unfold topi; norm_num

/-! ## Preveri se -/

/-- Kviz 1: kot 180° je iztegnjeni, ni pravi (90°).
trditev: MAT-OS-6/kot#kviz-1
besedilo: »Kot $180^\circ$ je iztegnjeni kot: kraka sta nasprotna poltraka na isti premici, kot pri iztegnjeni roki.« -/
theorem kviz1 : iztegnjeni 180 ∧ ¬ pravi 180 := by unfold iztegnjeni pravi; norm_num

/-- Kviz 1 (geometrijsko): kraka iztegnjenega kota sta nasprotna poltraka: kot med vektorjem x ≠ 0 in −x je π
(iztegnjeni kot).
trditev: MAT-OS-6/kot#nasprotna-poltraka
besedilo: »Pri $180^\circ$ kraka ležita na isti premici.« -/
theorem nasprotna_poltraka {V : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] (x : V) (hx : x ≠ 0) :
    InnerProductGeometry.angle x (-x) = π :=
  InnerProductGeometry.angle_self_neg_of_ne_zero hx

example := nasprotna_poltraka (1 : ℂ) one_ne_zero

/-- RACUN: 38 + 52 = 90, 180 − 90 = 90, 180 − 65 = 115, 65 + 30 = 95, 180 − 95 = 85, 115 − 30 = 85,
180 − 160 = 20, 180 − 110 = 70, 180 − 125 = 55, 360 − 110 = 250, 180 − 40 = 140.
pomozno – ponovi vrstice bloka RACUN, ki ga učenec ne vidi; iste račune citirajo izreki primerov -/
theorem racun :
    (38 : ℝ) + 52 = 90 ∧ (180 : ℝ) - 90 = 90 ∧ (180 : ℝ) - 65 = 115 ∧ (65 : ℝ) + 30 = 95 ∧ (180 : ℝ) - 95 = 85 ∧
      (115 : ℝ) - 30 = 85 ∧ (180 : ℝ) - 160 = 20 ∧ (180 : ℝ) - 110 = 70 ∧ (180 : ℝ) - 125 = 55 ∧
      (360 : ℝ) - 110 = 250 ∧ (180 : ℝ) - 40 = 140 := by
  norm_num

end Evklid.Lekcije.MAT_OS_6.Kot
