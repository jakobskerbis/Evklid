/-
vir: content/lessons/MAT-OS-7/razmerje.md
sha256: 971052b82715543e346a3c8feb9f173b95778c6cac94ef1ec78f7b2673dfb9ea
Ni v Leanu: zgodbe (klop, okvir, letev, barva, sestre, malinovec, riž, zidar, Jure in Tina) so dokazane
samo kot račun s števili; risbi (trak) in simulacija (sok) kot slike, dokazan je le račun (1 : 3 = 2 : 6,
800 mL → 200 mL in 600 mL); enote so pretvorjene kot števila (1 m = 100 cm, 1 kg = 1000 g, 1 l = 1000 ml),
»enoti se pokrajšata« ni dokazano kot fizikalna trditev; branje »a proti b«, »vrstni red je pomemben« (dokazano
le na primerih, da a : b in b : a nista enaka), »riž približno 1 : 2« in navodila kot besedilo.
Model: razmerje a : b je enako c : d, ko imata enako vrednost a/b = c/d (tako ga definira razdelek »Bolj
natančno«); računa se v ℚ. Pravila razširjanja in krajšanja imajo le lekcijin pogoj k ≠ 0; pri b = 0 bi
obe strani zaradi Leanovega dogovora x/0 = 0 bili 0 (lekcija tak člen prepove). Razmerje treh količin
a : b : d je dokazano kot »deli« x = a·e, y = b·e, z = d·e z istim e. Okrajšano razmerje je par tujih
naravnih števil (`Nat.Coprime`), D(a, b) je `Nat.gcd`, v(…) je `Nat.lcm`. Približki (0,67, 33,3, 66,7)
so dokazani kot ocene napake, zaokrožitev na 67 kot `round`.
Napačni odgovori kvizov: dokazano je, da napačne vrednosti niso pravilne.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.Razmerje

/-! ## Razlaga 1–2: razmerje in njegova vrednost -/

/-- Razlaga 1: vrstni red je pomemben, 12 : 18 in 18 : 12 nista enaki razmerji (12/18 ≠ 18/12).
trditev: MAT-OS-7/razmerje#vrstni-red
besedilo: »Razmerje bratovega prispevka proti tvojemu je $18 : 12$, ne $12 : 18$.« -/
theorem vrstni_red : (12 : ℚ) / 18 ≠ 18 / 12 := by norm_num

/-- Razlaga 1 (preveri): 7 vijakov in 10 žebljev; razmerje žebljev proti vijakom je 10 : 7, ne 7 : 10.
trditev: MAT-OS-7/razmerje#zeblji-vijaki
besedilo: »(Odgovor: $10 : 7$.)« -/
theorem zeblji_vijaki : (10 : ℚ) / 7 ≠ 7 / 10 := by norm_num

/-- Razlaga 2: vrednost razmerja 12 : 18 je 12/18 = 2/3.
trditev: MAT-OS-7/razmerje#vrednost-12-18
besedilo: »Vrednost razmerja $12 : 18$ je $\dfrac{12}{18} = \dfrac{2}{3}$« -/
theorem vrednost_12_18 : (12 : ℚ) / 18 = 2 / 3 := by norm_num

/-- Razlaga 2: vrednost razmerja pove, kolikokrat je ena količina večja ali manjša od druge:
a = (a/b)·b za b ≠ 0.
trditev: MAT-OS-7/razmerje#vrednost-kolikokrat
besedilo: »Vrednost razmerja pove, kolikokrat je ena količina večja ali manjša od druge.« -/
theorem vrednost_kolikokrat (a b : ℚ) (hb : b ≠ 0) : a = (a / b) * b := by
  field_simp

/-- Predpostavka trditve `vrednost_kolikokrat` se da izpolniti (b = 18). -/
example := vrednost_kolikokrat 12 18 (by norm_num)

/-- Razlaga 2 (preveri): vrednost razmerja 3 : 4 je 3/4 = 0,75.
trditev: MAT-OS-7/razmerje#vrednost-3-4
besedilo: »(Odgovor: $\dfrac{3}{4} = 0{,}75$.)« -/
theorem vrednost_3_4 : (3 : ℚ) / 4 = 0.75 := by norm_num

/-! ## Razlaga 3: razširjanje in krajšanje -/

/-- Razlaga 3 in Povzetek: a : b = (a·k) : (b·k) za k ≠ 0 (vrednost se ne spremeni).
trditev: MAT-OS-7/razmerje#razsirjanje
besedilo: »$$a : b = (a \cdot k) : (b \cdot k), \quad k \neq 0$$« -/
theorem razsirjanje (a b k : ℚ) (hk : k ≠ 0) : (a * k) / (b * k) = a / b :=
  mul_div_mul_right a b hk

/-- Razlaga 3 in Povzetek: a : b = (a : k) : (b : k) za k ≠ 0.
trditev: MAT-OS-7/razmerje#krajsanje
besedilo: »$$a : b = (a : k) : (b : k), \quad k \neq 0$$« -/
theorem krajsanje (a b k : ℚ) (hk : k ≠ 0) : (a / k) / (b / k) = a / b := by
  rw [div_div_div_cancel_right₀ hk]

/-- Predpostavka trditve `razsirjanje` se da izpolniti (2 : 3, k = 6). -/
example := razsirjanje 2 3 6 (by norm_num)

/-- Predpostavka trditve `krajsanje` se da izpolniti (12 : 18, k = 6). -/
example := krajsanje 12 18 6 (by norm_num)

/-- Razlaga 3: pogoj k ≠ 0 je potreben (pri k = 0 dobimo 0 : 0 z vrednostjo 0, ne 2/3).
trditev: MAT-OS-7/razmerje#k-ni-nic
besedilo: »Oba člena pomnožimo ali delimo z **istim** številom $k$, različnim od $0$.« -/
theorem k_nic : (2 * 0 : ℚ) / (3 * 0) ≠ 2 / 3 := by norm_num

/-- Razlaga 3 (premisli, Nik): prištevanje 1 spremeni razmerje: 2/3 ≠ 3/4; 2/3 ≈ 0,67 in 3/4 = 0,75.
trditev: MAT-OS-7/razmerje#nik
besedilo: »Vrednost $2 : 3$ je $\dfrac{2}{3} \approx 0{,}67$, vrednost $3 : 4$ pa $\dfrac{3}{4} = 0{,}75$.« -/
theorem nik : (2 : ℚ) / 3 ≠ (2 + 1) / (3 + 1) ∧ |(2 : ℚ) / 3 - 0.67| < 0.005 ∧ (3 : ℚ) / 4 = 0.75 := by
  refine ⟨by norm_num, ?_, by norm_num⟩
  rw [abs_lt]; constructor <;> norm_num

/-- Razlaga 3 (premisli) in Pogoste napake: prištevanje istega števila obema členoma razmerja v splošnem
ne ohrani (protiprimer 2 : 3 in 1).
trditev: MAT-OS-7/razmerje#pristevanje-ne-ohrani
besedilo: »Prištevanje spremeni razmerje.« -/
theorem pristevanje_ne_ohrani : ¬ ∀ a b c : ℚ, (a + c) / (b + c) = a / b := by
  intro h
  have := h 2 3 1
  norm_num at this

/-- Razlaga 3 (premisli) v splošnem: prištevanje istega števila c obema členoma (b ≠ 0, b + c ≠ 0)
ohrani razmerje natanko tedaj, ko je c = 0 ali a = b; pri 2 : 3 in c ≠ 0 se razmerje torej vedno spremeni.
trditev: MAT-OS-7/razmerje#pristevanje-splosno
besedilo: »Prištevanje spremeni razmerje.« -/
theorem pristevanje_splosno (a b c : ℚ) (hb : b ≠ 0) (hbc : b + c ≠ 0) :
    (a + c) / (b + c) = a / b ↔ c = 0 ∨ a = b := by
  rw [div_eq_div_iff hbc hb]
  constructor
  · intro h
    have : c * (b - a) = 0 := by linarith
    rcases mul_eq_zero.mp this with h1 | h1
    · exact Or.inl h1
    · exact Or.inr (by linarith)
  · rintro (rfl | rfl) <;> ring

/-- Predpostavki trditve `pristevanje_splosno` se dasta izpolniti (b = 3, c = 1). -/
example := pristevanje_splosno 2 3 1 (by norm_num) (by norm_num)

/-! ## Razlaga 4: okrajšano razmerje -/

/-- Razlaga 4 in Povzetek: ko oba člena (naravni števili, b > 0) delimo z D(a, b), sta člena tuji števili
in vrednost razmerja ostane ista.
trditev: MAT-OS-7/razmerje#okrajsanje
besedilo: »Okrajšano razmerje: oba člena delimo z $D(a, b)$; člena sta nato tuji naravni števili.« -/
theorem okrajsanje (a b : ℕ) (hb : 0 < b) :
    Nat.Coprime (a / Nat.gcd a b) (b / Nat.gcd a b) ∧
      ((a / Nat.gcd a b : ℕ) : ℚ) / ((b / Nat.gcd a b : ℕ) : ℚ) = (a : ℚ) / b := by
  have hg : 0 < Nat.gcd a b := Nat.gcd_pos_of_pos_right a hb
  refine ⟨Nat.coprime_div_gcd_div_gcd hg, ?_⟩
  rw [Nat.cast_div (Nat.gcd_dvd_left a b) (by exact_mod_cast hg.ne'),
    Nat.cast_div (Nat.gcd_dvd_right a b) (by exact_mod_cast hg.ne')]
  exact krajsanje _ _ _ (by exact_mod_cast hg.ne')

/-- Predpostavka trditve `okrajsanje` se da izpolniti (b = 18). -/
example := okrajsanje 12 18 (by norm_num)

/-- Bolj natančno: okrajšana oblika je enolična: če sta a : b in c : d (b, d > 0) okrajšani razmerji
(tuja člena) z enako vrednostjo, je a = c in b = d.
trditev: MAT-OS-7/razmerje#okrajsana-enolicna
besedilo: »Okrajšana oblika je enolična: če sta člena tuji naravni števili, je razmerje že v najpreprostejši obliki in druge take oblike ni.« -/
theorem okrajsana_enolicna (a b c d : ℕ) (hb : 0 < b) (hd : 0 < d) (hab : Nat.Coprime a b)
    (hcd : Nat.Coprime c d) (h : (a : ℚ) / b = c / d) : a = c ∧ b = d := by
  have hb' : (b : ℚ) ≠ 0 := by exact_mod_cast hb.ne'
  have hd' : (d : ℚ) ≠ 0 := by exact_mod_cast hd.ne'
  rw [div_eq_div_iff hb' hd'] at h
  have hn : a * d = c * b := by exact_mod_cast h
  have h1 : b ∣ d := hab.symm.dvd_of_dvd_mul_right ⟨c, by linarith⟩
  have h2 : d ∣ b := hcd.symm.dvd_of_dvd_mul_right ⟨a, by linarith⟩
  have hbd : b = d := Nat.dvd_antisymm h1 h2
  subst hbd
  exact ⟨Nat.eq_of_mul_eq_mul_right hb hn, rfl⟩

/-- Predpostavke trditve `okrajsana_enolicna` se dajo izpolniti (2 : 3 in 2 : 3). -/
example := okrajsana_enolicna 2 3 2 3 (by norm_num) (by norm_num) (by decide) (by decide) (by norm_num)

/-- Razlaga 4: 12 : 18 = (12 : 6) : (18 : 6) = 2 : 3, ker je D(12, 18) = 6; 2 in 3 sta tuji.
trditev: MAT-OS-7/razmerje#okrajsaj-12-18
besedilo: »$$12 : 18 = (12 : 6) : (18 : 6) = 2 : 3, \quad \text{ker je } D(12, 18) = 6.$$« -/
theorem okrajsaj_12_18 :
    Nat.gcd 12 18 = 6 ∧ 12 / 6 = 2 ∧ 18 / 6 = 3 ∧ Nat.Coprime 2 3 ∧ (12 : ℚ) / 18 = 2 / 3 := by
  refine ⟨by decide, rfl, rfl, by decide, ?_⟩
  calc (12 : ℚ) / 18 = (12 / 6) / (18 / 6) := (krajsanje 12 18 6 (by norm_num)).symm
    _ = 2 / 3 := by norm_num

/-- Razlaga 4 (preveri): D(16, 24) = 8, zato 16 : 24 = 2 : 3.
trditev: MAT-OS-7/razmerje#okrajsaj-16-24
besedilo: »(Odgovor: $D(16, 24) = 8$, zato $2 : 3$.)« -/
theorem okrajsaj_16_24 : Nat.gcd 16 24 = 8 ∧ 16 / 8 = 2 ∧ 24 / 8 = 3 ∧ (16 : ℚ) / 24 = 2 / 3 := by
  refine ⟨by decide, rfl, rfl, by norm_num⟩

/-! ## Razlaga 5–6: enote, decimalna števila, ulomki -/

/-- Razlaga 5 in Pogoste napake: 50 cm : 2 m = 50 cm : 200 cm = 50 : 200 = 1 : 4 (2 m = 200 cm);
50 : 2 = 25 : 1 ni pravilno.
trditev: MAT-OS-7/razmerje#enote-50-2
besedilo: »Razmerje $50\,\text{cm} : 2\,\text{m}$ ni $50 : 2 = 25 : 1$.« -/
theorem enote_50_2 : (2 : ℚ) * 100 = 200 ∧ (50 : ℚ) / 200 = 1 / 4 ∧ (50 : ℚ) / 2 = 25 / 1 ∧
    (25 : ℚ) / 1 ≠ 1 / 4 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Razlaga 5 (preveri): 30 cm : 1,5 m = 30 : 150 = 1 : 5.
trditev: MAT-OS-7/razmerje#enote-30-15
besedilo: »(Odgovor: $30 : 150 = 1 : 5$.)« -/
theorem enote_30_15 : (1.5 : ℚ) * 100 = 150 ∧ (30 : ℚ) / 150 = 1 / 5 := by
  refine ⟨by norm_num, by norm_num⟩

/-- Razlaga 6: 0,6 : 1,5 = 6 : 15 = 2 : 5 (razširimo z 10).
trditev: MAT-OS-7/razmerje#decimalna
besedilo: »decimalni števili razširimo z $10$, $100$ …: $0{,}6 : 1{,}5 = 6 : 15 = 2 : 5$« -/
theorem decimalna : (0.6 : ℚ) * 10 = 6 ∧ (1.5 : ℚ) * 10 = 15 ∧ (0.6 : ℚ) / 1.5 = 6 / 15 ∧
    (6 : ℚ) / 15 = 2 / 5 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Razlaga 6: 2/3 : 5/6 = 4 : 5 (razširimo s 6 = v(3, 6): 2/3·6 = 4, 5/6·6 = 5).
trditev: MAT-OS-7/razmerje#ulomki-2-3-5-6
besedilo: »$\dfrac{2}{3} : \dfrac{5}{6} = 4 : 5$ (razširili smo s $6$: $\dfrac{2}{3} \cdot 6 = 4$ in $\dfrac{5}{6} \cdot 6 = 5$)« -/
theorem ulomki_2_3_5_6 : Nat.lcm 3 6 = 6 ∧ (2 / 3 : ℚ) * 6 = 4 ∧ (5 / 6 : ℚ) * 6 = 5 ∧
    ((2 : ℚ) / 3) / (5 / 6) = 4 / 5 := by
  refine ⟨by decide, by norm_num, by norm_num, by norm_num⟩

/-- Razlaga 6 (preveri): 1/2 : 3/4 razširimo s 4 in dobimo 2 : 3.
trditev: MAT-OS-7/razmerje#ulomki-1-2-3-4
besedilo: »(Odgovor: razširimo s $4$ in dobimo $2 : 3$.)« -/
theorem ulomki_1_2_3_4 : (1 / 2 : ℚ) * 4 = 2 ∧ (3 / 4 : ℚ) * 4 = 3 ∧ ((1 : ℚ) / 2) / (3 / 4) = 2 / 3 := by
  refine ⟨by norm_num, by norm_num, by norm_num⟩

/-! ## Razlaga 7: deljenje v danem razmerju -/

/-- Razlaga 7, Povzetek in Bolj natančno: količino c > 0 razdelimo v razmerju a : b (a, b > 0) natanko
tako, da je en del c : (a + b), prvi dobi a delov, drugi b delov (x + y = c in x : y = a : b velja
natanko za ta x in y).
trditev: MAT-OS-7/razmerje#deljenje-v-razmerju
besedilo: »Deljenje $c$ v razmerju $a : b$: en del je $c : (a + b)$, dela sta $a$ in $b$ delov.« -/
theorem deljenje_v_razmerju (a b c x y : ℚ) (ha : 0 < a) (hb : 0 < b) (hc : 0 < c) :
    (x + y = c ∧ x / y = a / b) ↔ (x = a * (c / (a + b)) ∧ y = b * (c / (a + b))) := by
  have hab : a + b ≠ 0 := by positivity
  constructor
  · rintro ⟨hs, hr⟩
    have hy : y ≠ 0 := by
      rintro rfl
      rw [div_zero] at hr
      exact (div_pos ha hb).ne' hr.symm
    rw [div_eq_div_iff hy hb.ne'] at hr
    have hy' : y = b * c / (a + b) := by rw [eq_div_iff hab]; nlinarith
    have hx' : x = a * c / (a + b) := by rw [eq_div_iff hab]; nlinarith
    rw [hx', hy', mul_div_assoc, mul_div_assoc]
    exact ⟨rfl, rfl⟩
  · rintro ⟨rfl, rfl⟩
    have he : c / (a + b) ≠ 0 := by positivity
    refine ⟨?_, mul_div_mul_right a b he⟩
    field_simp

/-- Predpostavke trditve `deljenje_v_razmerju` se dajo izpolniti (2 : 3, c = 45). -/
example := deljenje_v_razmerju 2 3 45 18 27 (by norm_num) (by norm_num) (by norm_num)

/-- Razlaga 7 in Bolj natančno: pri razmerju a : b (a + b ≠ 0) dobi prvi a/(a + b) celote, drugi
b/(a + b) celote; ulomka se seštejeta v 1, zato je vsota delov c.
trditev: MAT-OS-7/razmerje#delez-celote
besedilo: »Ulomka se seštejeta v $1$, zato vsota obeh delov res znaša $c$.« -/
theorem delez_celote (a b c : ℚ) (h : a + b ≠ 0) :
    a * (c / (a + b)) = a / (a + b) * c ∧ b * (c / (a + b)) = b / (a + b) * c ∧
      a / (a + b) + b / (a + b) = 1 ∧ a / (a + b) * c + b / (a + b) * c = c := by
  refine ⟨by ring, by ring, by field_simp, by field_simp⟩

/-- Predpostavka trditve `delez_celote` se da izpolniti (2 + 3 ≠ 0). -/
example := delez_celote 2 3 45 (by norm_num)

/-- Razlaga 7: deljenje v razmerju s tremi členi a : b : d (a + b + d ≠ 0): deli a·e, b·e, d·e z
e = c : (a + b + d) dajo skupaj c; in to je edina izbira e, pri kateri je vsota c.
trditev: MAT-OS-7/razmerje#deljenje-tri
besedilo: »Enako deliš v razmerju s tremi členi, na primer $a : b : d$, le delov je $a + b + d$.« -/
theorem deljenje_tri (a b d c e : ℚ) (h : a + b + d ≠ 0) :
    a * e + b * e + d * e = c ↔ e = c / (a + b + d) := by
  rw [eq_div_iff h]
  constructor <;> intro h' <;> linarith

/-- Predpostavka trditve `deljenje_tri` se da izpolniti (6 + 4 + 3 ≠ 0). -/
example := deljenje_tri 6 4 3 650 50 (by norm_num)

/-- Razlaga 7 (klop): 2 + 3 = 5 delov, en del 45 : 5 = 9, ti 2·9 = 18, brat 3·9 = 27; 18 + 27 = 45 in
18 : 27 = 2 : 3.
trditev: MAT-OS-7/razmerje#klop-racun
besedilo: »Preverimo: $18 + 27 = 45$ in $18 : 27 = 2 : 3$.« -/
theorem klop_racun : (2 : ℚ) + 3 = 5 ∧ (45 : ℚ) / 5 = 9 ∧ (2 : ℚ) * 9 = 18 ∧ (3 : ℚ) * 9 = 27 ∧
    (18 : ℚ) + 27 = 45 ∧ (18 : ℚ) / 27 = 2 / 3 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Zakaj se tega učimo: če vsak dobi polovico (45 : 2 = 22,5 €), dobi brat premalo: 22,5 < 27 (pošteni
bratov del iz `klop`).
trditev: MAT-OS-7/razmerje#klop-polovica
besedilo: »Če vsak dobi polovico, dobi brat premalo, saj je dal več.« -/
theorem klop_polovica : (45 : ℚ) / 2 = 22.5 ∧ (22.5 : ℚ) < 27 := by
  refine ⟨by norm_num, by norm_num⟩

/-- Razlaga 7 (klop): 45 € v razmerju 2 : 3 razdelimo natanko na 18 € in 27 €.
trditev: MAT-OS-7/razmerje#klop
besedilo: »Ti dobiš $2 \cdot 9 = 18$ evrov, brat $3 \cdot 9 = 27$ evrov.« -/
theorem klop (x y : ℚ) : (x + y = 45 ∧ x / y = 2 / 3) ↔ (x = 18 ∧ y = 27) := by
  rw [deljenje_v_razmerju 2 3 45 x y (by norm_num) (by norm_num) (by norm_num)]
  norm_num

/-- Razlaga 7 (premisli) in Pogoste napake: ti dobiš 2/5 zneska (2/5·45 = 18), ne 2/3; 18 je 2/3 od 27.
trditev: MAT-OS-7/razmerje#klop-delez
besedilo: »$\dfrac{2}{5}$ zneska, ker dobiš $2$ od $5$ enakih delov: $\dfrac{2}{5} \cdot 45 = 18$.« -/
theorem klop_delez : (2 : ℚ) / (2 + 3) = 2 / 5 ∧ (2 : ℚ) / 5 * 45 = 18 ∧ (2 : ℚ) / 5 ≠ 2 / 3 ∧
    (2 : ℚ) / 3 * 27 = 18 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Razlaga 7 (simulacija): sok in voda 1 : 3 = 2 : 6; 800 mL v razmerju 1 : 3 je 200 mL soka in
600 mL vode.
trditev: MAT-OS-7/razmerje#sok
besedilo: »($200\,\text{mL}$ in $600\,\text{mL}$)« -/
theorem sok : (1 : ℚ) / 3 = 2 / 6 ∧ (800 : ℚ) / (1 + 3) = 200 ∧ (3 : ℚ) * 200 = 600 := by
  refine ⟨by norm_num, by norm_num, by norm_num⟩

/-! ## Primer 1 -/

/-- Primer 1: delitelji 45 so 1, 3, 5, 9, 15, 45; delitelji 60 so 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60;
D(45, 60) = 15; 45 : 15 = 3, 60 : 15 = 4; 3 in 4 sta tuji; 45 : 60 = 3 : 4.
trditev: MAT-OS-7/razmerje#primer1
besedilo: »Odgovor: stranici sta v razmerju $3 : 4$; na vsake $3$ dele krajše stranice pridejo $4$ deli daljše.« -/
theorem primer1 :
    Nat.divisors 45 = {1, 3, 5, 9, 15, 45} ∧
      Nat.divisors 60 = {1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60} ∧ Nat.gcd 45 60 = 15 ∧
      45 / 15 = 3 ∧ 60 / 15 = 4 ∧ Nat.Coprime 3 4 ∧ (45 : ℚ) / 60 = 3 / 4 := by
  refine ⟨by decide, by decide, by decide, rfl, rfl, by decide, ?_⟩
  calc (45 : ℚ) / 60 = (45 / 15) / (60 / 15) := (krajsanje 45 60 15 (by norm_num)).symm
    _ = 3 / 4 := by norm_num

/-! ## Primer 2 -/

/-- Primer 2, koraki 1–5: 3,6 m = 360 cm; 4 + 5 = 9; en del 360 : 9 = 40; 4·40 = 160, 5·40 = 200;
160 + 200 = 360 in 160 : 200 = 4 : 5; 160 cm = 1,6 m, 200 cm = 2 m.
trditev: MAT-OS-7/razmerje#primer2-racun
besedilo: »Preverimo: $160\,\text{cm} + 200\,\text{cm} = 360\,\text{cm}$ in $160 : 200 = 4 : 5$.« -/
theorem primer2_racun : (3.6 : ℚ) * 100 = 360 ∧ (4 : ℚ) + 5 = 9 ∧ (360 : ℚ) / 9 = 40 ∧
    (4 : ℚ) * 40 = 160 ∧ (5 : ℚ) * 40 = 200 ∧ (160 : ℚ) + 200 = 360 ∧ (160 : ℚ) / 200 = 4 / 5 ∧
    (160 : ℚ) / 100 = 1.6 ∧ (200 : ℚ) / 100 = 2 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num⟩

/-- Primer 2 (odgovor): letev 360 cm v razmerju 4 : 5 razrežemo natanko na 160 cm in 200 cm.
trditev: MAT-OS-7/razmerje#primer2
besedilo: »Odgovor: kosa sta dolga $160\,\text{cm}$ ($1{,}6\,\text{m}$) in $200\,\text{cm}$ ($2\,\text{m}$).« -/
theorem primer2 (x y : ℚ) : (x + y = 360 ∧ x / y = 4 / 5) ↔ (x = 160 ∧ y = 200) := by
  rw [deljenje_v_razmerju 4 5 360 x y (by norm_num) (by norm_num) (by norm_num)]
  norm_num

/-! ## Primer 3 -/

/-- Primer 3, Povzetek: če količina x ustreza a delom (a ≠ 0), je en del x : a; drugi del je b·(x : a),
skupaj (a + b)·(x : a).
trditev: MAT-OS-7/razmerje#znani-del
besedilo: »Če poznaš le količino, ki ustreza $a$ delom, je en del ta količina $: a$.« -/
theorem znani_del (a b x : ℚ) (ha : a ≠ 0) :
    a * (x / a) = x ∧ x + b * (x / a) = (a + b) * (x / a) := by
  refine ⟨by field_simp, ?_⟩
  have : a * (x / a) = x := by field_simp
  linarith [show (a + b) * (x / a) = a * (x / a) + b * (x / a) by ring]

/-- Predpostavka trditve `znani_del` se da izpolniti (a = 3). -/
example := znani_del 3 5 1200 (by norm_num)

/-- Primer 3, koraki 1–5: 1,2 l = 1200 ml; en del 1200 : 3 = 400; rumena 5·400 = 2000; zelena 3 + 5 = 8
delov, 8·400 = 3200; 1200 : 2000 = 3 : 5 in 1200 + 2000 = 3200; 2000 ml = 2 l, 3200 ml = 3,2 l.
trditev: MAT-OS-7/razmerje#primer3-racun
besedilo: »Preverimo: $1200 : 2000 = 3 : 5$ in $1200\,\text{ml} + 2000\,\text{ml} = 3200\,\text{ml}$.« -/
theorem primer3_racun : (1.2 : ℚ) * 1000 = 1200 ∧ (1200 : ℚ) / 3 = 400 ∧ (5 : ℚ) * 400 = 2000 ∧
    (3 : ℚ) + 5 = 8 ∧ (8 : ℚ) * 400 = 3200 ∧ (1200 : ℚ) / 2000 = 3 / 5 ∧ (1200 : ℚ) + 2000 = 3200 ∧
    (2000 : ℚ) / 1000 = 2 ∧ (3200 : ℚ) / 1000 = 3.2 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num⟩

/-- Primer 3 (odgovor): k 1200 ml modre v razmerju 3 : 5 potrebuješ natanko 2000 ml rumene.
trditev: MAT-OS-7/razmerje#primer3
besedilo: »Odgovor: potrebuješ $2\,\text{l}$ rumene barve in dobiš $3{,}2\,\text{l}$ zelene barve.« -/
theorem primer3 (y : ℚ) : (1200 : ℚ) / y = 3 / 5 ↔ y = 2000 := by
  constructor
  · intro h
    have hy : y ≠ 0 := by rintro rfl; norm_num at h
    rw [div_eq_div_iff hy (by norm_num)] at h
    linarith
  · rintro rfl; norm_num

/-! ## Primer 4 -/

/-- Primer 4, koraki 1–3 in premisli: v(2, 3, 4) = 12; 1/2·12 = 6, 1/3·12 = 4, 1/4·12 = 3; 6 + 4 + 3 = 13;
en del 650 : 13 = 50; 6·50 = 300, 4·50 = 200, 3·50 = 150; 300 + 200 + 150 = 650.
trditev: MAT-OS-7/razmerje#primer4-racun
besedilo: »En del: $650 : 13 = 50$, torej $50$ €.« -/
theorem primer4_racun : Nat.lcm (Nat.lcm 2 3) 4 = 12 ∧ (1 / 2 : ℚ) * 12 = 6 ∧ (1 / 3 : ℚ) * 12 = 4 ∧
    (1 / 4 : ℚ) * 12 = 3 ∧ (6 : ℚ) + 4 + 3 = 13 ∧ (650 : ℚ) / 13 = 50 ∧ (6 : ℚ) * 50 = 300 ∧
    (4 : ℚ) * 50 = 200 ∧ (3 : ℚ) * 50 = 150 ∧ (300 : ℚ) + 200 + 150 = 650 := by
  refine ⟨by decide, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num⟩

/-- Primer 4 (odgovor): 650 € v razmerju 1/2 : 1/3 : 1/4 (deli x = e/2, y = e/3, z = e/4 z istim e)
razdelimo natanko na 300 €, 200 € in 150 €.
trditev: MAT-OS-7/razmerje#primer4
besedilo: »Prva sestra dobi $6 \cdot 50 = 300$ €, druga $4 \cdot 50 = 200$ €, tretja $3 \cdot 50 = 150$ €.« -/
theorem primer4 (x y z : ℚ) :
    ((∃ e : ℚ, x = 1 / 2 * e ∧ y = 1 / 3 * e ∧ z = 1 / 4 * e) ∧ x + y + z = 650) ↔
      (x = 300 ∧ y = 200 ∧ z = 150) := by
  constructor
  · rintro ⟨⟨e, rfl, rfl, rfl⟩, h⟩
    have : e = 600 := by linarith
    subst this
    norm_num
  · rintro ⟨rfl, rfl, rfl⟩
    exact ⟨⟨600, by norm_num, by norm_num, by norm_num⟩, by norm_num⟩

/-! ## Pogoste napake -/

/-- Pogoste napake (vrstni red): razmerje bratovega prispevka proti tvojemu je 3 : 2, ne 2 : 3.
trditev: MAT-OS-7/razmerje#napaka-vrstni-red
besedilo: »odgovor $2 : 3$ ni pravilen, pravilno je $3 : 2$.« -/
theorem napaka_vrstni_red : (18 : ℚ) / 12 = 3 / 2 ∧ (3 : ℚ) / 2 ≠ 2 / 3 := by
  refine ⟨by norm_num, by norm_num⟩

/-- Pogoste napake (število delov): 35 bonbonov v razmerju 3 : 4: 3 + 4 = 7, en del 5, 15 in 20 bonbonov;
to je edina delitev.
trditev: MAT-OS-7/razmerje#napaka-bonboni
besedilo: »Celoto sestavljajo vsi deli, zato deliš s $3 + 4 = 7$: en del je $5$, prvi dobi $15$, drugi $20$ bonbonov.« -/
theorem napaka_bonboni (x y : ℚ) :
    ((3 : ℚ) + 4 = 7 ∧ (35 : ℚ) / 7 = 5 ∧ (3 : ℚ) * 5 = 15 ∧ (4 : ℚ) * 5 = 20) ∧
      ((x + y = 35 ∧ x / y = 3 / 4) ↔ (x = 15 ∧ y = 20)) := by
  refine ⟨by norm_num, ?_⟩
  rw [deljenje_v_razmerju 3 4 35 x y (by norm_num) (by norm_num) (by norm_num)]
  norm_num

/-- Pogoste napake (ulomek celote): v razmerju 2 : 3 je prvi del 2/(2 + 3) = 2/5 celote, ne 2/3.
trditev: MAT-OS-7/razmerje#napaka-ulomek
besedilo: »V razmerju $2 : 3$ prvi del ni $\dfrac{2}{3}$ celote, ampak $\dfrac{2}{2 + 3} = \dfrac{2}{5}$ celote.« -/
theorem napaka_ulomek : (2 : ℚ) / (2 + 3) = 2 / 5 ∧ (2 : ℚ) / 5 ≠ 2 / 3 := by
  refine ⟨by norm_num, by norm_num⟩

/-- Pogoste napake (odštevanje, okrajšanje): 12 : 18 = 2 : 3 ni 6 : 12 = 1 : 2; 4 : 6 ni okrajšano do konca
(D(4, 6) = 2).
trditev: MAT-OS-7/razmerje#napaka-odstevanje
besedilo: »saj je $12 : 18 = 2 : 3$, $6 : 12$ pa $1 : 2$.« -/
theorem napaka_odstevanje : (12 : ℚ) / 18 = 2 / 3 ∧ (6 : ℚ) / 12 = 1 / 2 ∧ (12 : ℚ) / 18 ≠ 6 / 12 ∧
    (4 : ℚ) / 6 = 2 / 3 ∧ Nat.gcd 4 6 = 2 ∧ ¬ Nat.Coprime 4 6 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by decide, by decide⟩

/-! ## Drugače -/

/-- Na sliki: malinovec 1 : 5 = 2 : 10 = 3 : 15; vseh delov je 6, sirup je 1/6 vrča.
trditev: MAT-OS-7/razmerje#na-sliki
besedilo: »To je razširjanje razmerja: $1 : 5 = 2 : 10 = 3 : 15$.« -/
theorem na_sliki : (1 : ℚ) / 5 = 2 / 10 ∧ (2 : ℚ) / 10 = 3 / 15 ∧ (1 : ℚ) + 5 = 6 ∧
    (1 : ℚ) / (1 + 5) = 1 / 6 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Iz vsakdanjega življenja: riž 1 : 2 = 3 : 6; zidar 20 lopat v razmerju 1 : 3 (4 deli, en del 5):
5 lopat cementa in 15 peska; Jure in Tina 10 : 15 = 2 : 3, 30 € razdelita na 12 € in 18 €.
trditev: MAT-OS-7/razmerje#vsakdan
besedilo: »Če ima $20$ lopat mešanice, je vseh delov $1 + 3 = 4$, en del je $5$ lopat: $5$ lopat cementa in $15$ lopat peska.« -/
theorem vsakdan : (1 : ℚ) / 2 = 3 / 6 ∧ ((1 : ℚ) + 3 = 4 ∧ (20 : ℚ) / 4 = 5 ∧ (3 : ℚ) * 5 = 15) ∧
    (10 : ℚ) / 15 = 2 / 3 ∧ (∀ x y : ℚ, (x + y = 30 ∧ x / y = 2 / 3) ↔ (x = 12 ∧ y = 18)) := by
  refine ⟨by norm_num, by norm_num, by norm_num, fun x y => ?_⟩
  rw [deljenje_v_razmerju 2 3 30 x y (by norm_num) (by norm_num) (by norm_num)]
  norm_num

/-- Korak za korakom: 0,48 kg = 480 g; 480 = 2⁵·3·5, 600 = 2³·3·5², D(480, 600) = 2³·3·5 = 120;
480 : 120 = 4, 600 : 120 = 5; 480/600 = 0,8 = 4/5; postopno 480 : 600 = 48 : 60 = 4 : 5.
trditev: MAT-OS-7/razmerje#korak-480-600
besedilo: »$480 = 2^5 \cdot 3 \cdot 5$, $600 = 2^3 \cdot 3 \cdot 5^2$, zato je $D(480, 600) = 2^3 \cdot 3 \cdot 5 = 120$.« -/
theorem korak_480_600 : (0.48 : ℚ) * 1000 = 480 ∧ (480 : ℕ) = 2 ^ 5 * 3 * 5 ∧ (600 : ℕ) = 2 ^ 3 * 3 * 5 ^ 2 ∧
    Nat.gcd 480 600 = 2 ^ 3 * 3 * 5 ∧ (2 ^ 3 * 3 * 5 : ℕ) = 120 ∧ 480 / 120 = 4 ∧ 600 / 120 = 5 ∧
    (480 : ℚ) / 600 = 0.8 ∧ (4 : ℚ) / 5 = 0.8 ∧ (480 : ℚ) / 600 = 48 / 60 ∧ (48 : ℚ) / 60 = 4 / 5 ∧
    (480 / 10 = 48 ∧ 600 / 10 = 60 ∧ 48 / 12 = 4 ∧ 60 / 12 = 5) := by
  refine ⟨by norm_num, rfl, rfl, by decide, rfl, rfl, rfl, by norm_num, by norm_num, by norm_num,
    by norm_num, by decide⟩

/-- Bolj natančno: razmerji a : b in c : d (b, d ≠ 0) sta enaki natanko tedaj, ko a·d = c·b.
trditev: MAT-OS-7/razmerje#enaki-razmerji
besedilo: »Dve razmerji sta enaki natanko tedaj, ko imata enako vrednost.« -/
theorem enaki_razmerji (a b c d : ℚ) (hb : b ≠ 0) (hd : d ≠ 0) : a / b = c / d ↔ a * d = c * b :=
  div_eq_div_iff hb hd

/-- Predpostavki trditve `enaki_razmerji` se dasta izpolniti (b = 18, d = 3). -/
example := enaki_razmerji 12 18 2 3 (by norm_num) (by norm_num)

/-- Bolj natančno: 8 : 12 : 20 = 2 : 3 : 5, ker je D(8, 12, 20) = 4 (vsi trije členi deljeni s 4);
2 : 3 : 5 je okrajšano do konca (D(2, 3, 5) = 1).
trditev: MAT-OS-7/razmerje#tri-clena
besedilo: »$8 : 12 : 20 = 2 : 3 : 5$, ker je $D(8, 12, 20) = 4$.« -/
theorem tri_clena : Nat.gcd (Nat.gcd 8 12) 20 = 4 ∧ 8 / 4 = 2 ∧ 12 / 4 = 3 ∧ 20 / 4 = 5 ∧
    Nat.gcd (Nat.gcd 2 3) 5 = 1 := by decide

/-! ## Preveri se -/

/-- Preveri se 1: cement 2 vedri, pesek 4: 2 : 4 = 1 : 2 (D(2, 4) = 2); 2 : 1 je zamenjan vrstni red,
1 : 3 je delež cementa v vsej mešanici (2 od 6), 2 : 4 ni okrajšano.
trditev: MAT-OS-7/razmerje#kviz1
besedilo: »Cementa sta $2$ vedra, peska $4$ vedra: $2 : 4 = 1 : 2$, ker je $D(2, 4) = 2$.« -/
theorem kviz1 : Nat.gcd 2 4 = 2 ∧ (2 : ℚ) / 4 = 1 / 2 ∧ Nat.Coprime 1 2 ∧ (2 : ℚ) / 4 ≠ 2 / 1 ∧
    (2 : ℚ) / 6 = 1 / 3 ∧ (2 : ℚ) / 4 ≠ 1 / 3 ∧ ¬ Nat.Coprime 2 4 := by
  refine ⟨by decide, by norm_num, by decide, by norm_num, by norm_num, by norm_num, by decide⟩

/-- Preveri se 2: 24 : 36 = 2 : 3 (D(24, 36) = 12), Lukov 12 : 24 = 1 : 2 pa ne (12/24 ≠ 24/36); tudi
odštevanje 6 ne ohrani razmerja (18 : 30 ≠ 2 : 3), in to velja za vsako od 0 različno število c
(pri c = 36 je člen 0, vrednost 0 po dogovoru x/0 = 0, ki tudi ni 2/3).
trditev: MAT-OS-7/razmerje#kviz2
besedilo: »Pravilno: $D(24, 36) = 12$, zato $24 : 36 = 2 : 3$.« -/
theorem kviz2 : Nat.gcd 24 36 = 12 ∧ (24 : ℚ) / 36 = 2 / 3 ∧ (12 : ℚ) / 24 = 1 / 2 ∧
    (12 : ℚ) / 24 ≠ 24 / 36 ∧ (24 - 6 : ℚ) / (36 - 6) ≠ 24 / 36 ∧
    ∀ c : ℚ, c ≠ 0 → (24 - c) / (36 - c) ≠ 24 / 36 := by
  refine ⟨by decide, by norm_num, by norm_num, by norm_num, by norm_num, fun c hc h => ?_⟩
  by_cases h36 : (36 : ℚ) - c = 0
  · rw [h36, div_zero] at h; norm_num at h
  · rw [div_eq_div_iff h36 (by norm_num)] at h
    exact hc (by linarith)

/-- Predpostavka »c ≠ 0« v sklepu trditve `kviz2` se da izpolniti (Lukov c = 12). -/
example := kviz2.2.2.2.2.2 12 (by norm_num)

/-- Preveri se 3: apno : pesek = 1 : 3 in 45 kg peska ⇒ apna je natanko 15 kg (en del 45 : 3 = 15);
napačna 45/4 = 11,25 in 45·3 = 135.
trditev: MAT-OS-7/razmerje#kviz3
besedilo: »Pesek so $3$ deli, zato je en del $45 : 3 = 15$, torej $15\,\text{kg}$.« -/
theorem kviz3 (x : ℚ) : (x / 45 = 1 / 3 ↔ x = 15) ∧ (45 : ℚ) / 3 = 15 ∧ (45 : ℚ) / 4 = 11.25 ∧
    (11.25 : ℚ) / 45 ≠ 1 / 3 ∧ (135 : ℚ) / 45 ≠ 1 / 3 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  rw [div_eq_iff (by norm_num)]
  constructor <;> intro h <;> linarith

/-- Preveri se 4: 100 cm v razmerju 1 : 2: en del 100 : 3 ≈ 33,3, daljši kos 2/3·100 ≈ 66,7, zaokroženo
67 cm; 33 je krajši kos, 50 = 100 : 2 je napačno.
trditev: MAT-OS-7/razmerje#kviz4
besedilo: »daljši kos ima $2$ dela: $\dfrac{2}{3} \cdot 100 \approx 66{,}7$, torej približno $67\,\text{cm}$.« -/
theorem kviz4 :
    (∀ x y : ℚ, (x + y = 100 ∧ x / y = 1 / 2) ↔ (x = 100 / 3 ∧ y = 200 / 3)) ∧
      |(100 : ℚ) / 3 - 33.3| < 0.05 ∧ (2 : ℚ) / 3 * 100 = 200 / 3 ∧ |(200 : ℚ) / 3 - 66.7| < 0.05 ∧
      round ((200 : ℚ) / 3) = 67 ∧ round ((100 : ℚ) / 3) = 33 ∧ (50 : ℚ) ≠ 200 / 3 := by
  refine ⟨fun x y => ?_, ?_, by norm_num, ?_, ?_, ?_, by norm_num⟩
  · rw [deljenje_v_razmerju 1 2 100 x y (by norm_num) (by norm_num) (by norm_num)]
    norm_num
  · rw [abs_lt]; constructor <;> norm_num
  · rw [abs_lt]; constructor <;> norm_num
  · rw [round_eq, Int.floor_eq_iff]; constructor <;> norm_num
  · rw [round_eq, Int.floor_eq_iff]; constructor <;> norm_num

/-- Preveri se 5: beton 1 : 2 : 3 v 1200 kg: 1 + 2 + 3 = 6 delov, en del 1200 : 6 = 200, gramoz 3·200 = 600;
deli z istim e in vsoto 1200 so natanko 200, 400, 600. Napačni: 1200 : 3 = 400, 200, 1200 : 5·3 = 720.
trditev: MAT-OS-7/razmerje#kviz5
besedilo: »Vseh delov je $1 + 2 + 3 = 6$, en del je $1200 : 6 = 200$, gramoz pa $3 \cdot 200 = 600$, torej $600\,\text{kg}$.« -/
theorem kviz5 (x y z : ℚ) :
    ((1 : ℚ) + 2 + 3 = 6 ∧ (1200 : ℚ) / 6 = 200 ∧ (3 : ℚ) * 200 = 600) ∧
      (((∃ e : ℚ, x = 1 * e ∧ y = 2 * e ∧ z = 3 * e) ∧ x + y + z = 1200) ↔
        (x = 200 ∧ y = 400 ∧ z = 600)) ∧
      ((1200 : ℚ) / 3 = 400 ∧ (1200 : ℚ) / 5 * 3 = 720 ∧ (400 : ℚ) ≠ 600 ∧ (200 : ℚ) ≠ 600 ∧
        (720 : ℚ) ≠ 600) := by
  refine ⟨by norm_num, ⟨?_, ?_⟩, by norm_num⟩
  · rintro ⟨⟨e, rfl, rfl, rfl⟩, h⟩
    have : e = 200 := by linarith
    subst this
    norm_num
  · rintro ⟨rfl, rfl, rfl⟩
    exact ⟨⟨200, by norm_num, by norm_num, by norm_num⟩, by norm_num⟩

/-! ## Blok RACUN -/

/-- Blok RACUN: vse vrstice »vrednost« (66,7 je približek 100·2/3 na desetinko).
pomozno – vrednosti skritega bloka RACUN (ni vidno besedilo); iste račune pokrivajo klop_racun, primer1–primer4, kviz1, kviz3–kviz5 -/
theorem racun :
    (12 : ℚ) / 18 = 2 / 3 ∧ (45 : ℚ) / (2 + 3) = 9 ∧ (2 : ℚ) * 9 = 18 ∧ (3 : ℚ) * 9 = 27 ∧
      (45 : ℚ) / 60 = 3 / 4 ∧ (360 : ℚ) / (4 + 5) = 40 ∧ (4 : ℚ) * 40 = 160 ∧ (5 : ℚ) * 40 = 200 ∧
      (1200 : ℚ) / 3 = 400 ∧ (5 : ℚ) * 400 = 2000 ∧ (8 : ℚ) * 400 = 3200 ∧
      (650 : ℚ) / (6 + 4 + 3) = 50 ∧ (2 : ℚ) / 4 = 1 / 2 ∧ (45 : ℚ) / 3 = 15 ∧
      |(100 : ℚ) * 2 / 3 - 66.7| < 0.05 ∧ (1200 : ℚ) / (1 + 2 + 3) * 3 = 600 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_,
    by norm_num⟩
  rw [abs_lt]; constructor <;> norm_num

end Evklid.Lekcije.MAT_OS_7.Razmerje
